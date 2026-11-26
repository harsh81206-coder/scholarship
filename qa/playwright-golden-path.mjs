import assert from "node:assert/strict";
import path from "node:path";
import { createRequire } from "node:module";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const require = createRequire(path.join(root, "web", "package.json"));
const { chromium } = require("@playwright/test");
const webUrl = process.env.QA_BASE_URL ?? "http://127.0.0.1:3100";
const apiUrl = process.env.QA_API_URL ?? "http://127.0.0.1:8100";

const identities = {
  school: "SCH-AND-001",
  deo: "DEO-AND-001",
  vendor: "VND-001",
  admin: "ADMIN-STATE-001",
};

async function loginApiRole(role, identifier) {
  const send = await fetch(`${apiUrl}/auth/otp/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, identifier }),
  });
  const sendBody = await send.json();
  assert.equal(send.status, 200, `${role} OTP send: ${JSON.stringify(sendBody)}`);
  assert.ok(sendBody.demo_otp, `${role} OTP should be available in mock mode`);

  const verify = await fetch(`${apiUrl}/auth/otp/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, identifier, otp: sendBody.demo_otp }),
  });
  const auth = await verify.json();
  assert.equal(verify.status, 200, `${role} OTP verify: ${JSON.stringify(auth)}`);
  return { accessToken: auth.access_token, role, identifier, scope: auth.scope };
}

async function apiRequest(auth, route, init = {}) {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${auth.accessToken}`);
  headers.set("Accept-Language", "en");
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(`${apiUrl}${route}`, { ...init, headers });
  const text = await response.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  assert.ok(response.ok, `${init.method ?? "GET"} ${route} failed (${response.status}): ${JSON.stringify(data)}`);
  return data;
}

function sessionFromToken(token, role, identifier) {
  const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
  return {
    accessToken: token,
    role,
    identifier,
    scope: {
      school_id: payload.school_id ?? null,
      taluka_id: payload.taluka_id ?? null,
      district_id: payload.district_id ?? null,
    },
  };
}

const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => {
    localStorage.setItem("vps-app-store", JSON.stringify({ state: { lang: "en", role: "student", isAuthenticated: false }, version: 0 }));
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
  });

  async function open(route, viewport = { width: 390, height: 844 }) {
    await page.setViewportSize(viewport);
    const response = await page.goto(`${webUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    assert.equal(response?.status(), 200, `Page ${route} should return HTTP 200`);
    await page.waitForLoadState("networkidle", { timeout: 7000 }).catch(() => undefined);
    return response;
  }

  async function setRoleSession(auth, route, cookieRole = auth.role) {
    await context.addCookies([
      { name: "vps_access_token", value: auth.accessToken, url: webUrl, sameSite: "Lax" },
      { name: "vps_role", value: cookieRole, url: webUrl, sameSite: "Lax" },
    ]);
    await page.evaluate(({ session, appRole }) => {
      localStorage.setItem("vps-auth-session", JSON.stringify({ state: session, version: 0 }));
      localStorage.setItem("vps-app-store", JSON.stringify({ state: { lang: "en", role: appRole, isAuthenticated: true }, version: 0 }));
    }, { session: auth, appRole: cookieRole });
    await open(route, route === "/school/cycles" ? { width: 390, height: 844 } : { width: 1440, height: 900 });
  }

  // P2/P3 → S1: authenticate Riya through the browser and keep the API-issued JWT.
  await open("/login");
  await page.locator("#ctsId").waitFor();
  await page.locator("#ctsId").fill("GJ-AND-2026-004512");
  await page.locator("#dob").fill("2009-08-15");
  await page.locator("#mobile").fill("9876543210");
  const sendOtp = page.waitForResponse((response) => response.url().endsWith("/auth/otp/send"), { timeout: 10000 });
  await page.locator('form button[type="submit"]').first().click();
  const otpResponse = await sendOtp;
  assert.equal(otpResponse.status(), 200, "Student OTP send should succeed");
  const otpBody = await otpResponse.json();
  await page.waitForURL("**/login/verify", { timeout: 10000 });

  for (const [index, digit] of [...String(otpBody.demo_otp ?? "123456")].entries()) {
    await page.getByLabel(`Digit ${index + 1}`).fill(digit);
  }
  await page.getByRole("button", { name: /ચકાસો|Verify/ }).click();
  await page.waitForURL("**/student", { timeout: 10000 });
  const studentCookies = await context.cookies(webUrl);
  const studentToken = decodeURIComponent(studentCookies.find((cookie) => cookie.name === "vps_access_token")?.value ?? "");
  assert.ok(studentToken, "Student login must set an API JWT cookie");
  const studentAuth = sessionFromToken(studentToken, "student", "GJ-AND-2026-004512");
  await setRoleSession(studentAuth, "/student");

  const me = await apiRequest(studentAuth, "/students/me");
  assert.equal(me.cts_id, studentAuth.identifier);
  const studentSchemes = await apiRequest(studentAuth, "/students/me/schemes");
  assert.ok(Array.isArray(studentSchemes));
  await page.getByText("GJ-AND-2026-004512").first().waitFor({ timeout: 10000 });
  await page.getByText(/Riya/i).first().waitFor({ timeout: 10000 });
  console.log("PASS S1: real student profile, schemes, and dashboard loaded");

  // S2: eligibility explainer is backed by the student's scheme endpoint.
  await open("/student/schemes/namo-lakshmi");
  await page.getByText(/Namo Lakshmi Yojana/i).first().waitFor({ timeout: 10000 });
  console.log("PASS S2: scheme detail and eligibility explainer loaded");

  // S4: upload through multipart OCR and keep the returned document in the API.
  await open("/student/vault/upload");
  const uploadPromise = page.waitForResponse((response) => response.url().endsWith("/documents") && response.request().method() === "POST", { timeout: 10000 });
  await page.getByTestId("document-file-input").setInputFiles({
    name: "riya-income.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 Vidya Pragati Setu E2E document"),
  });
  const uploadResponse = await uploadPromise;
  assert.equal(uploadResponse.status(), 200, "OCR upload should return HTTP 200");
  const upload = await uploadResponse.json();
  assert.ok(upload.ocr_fields || upload.ocr_json || upload.ocr, "Mock OCR should return extracted fields");
  await page.getByRole("button", { name: /Confirm & Save to Vault/ }).click();
  await page.getByText(/Document Saved!/).waitFor({ timeout: 5000 });
  console.log("PASS S4: multipart upload returned OCR fields and saved to the vault");

  // S5/S6: apply via the real API, then confirm the created application is visible in Riya's tracker.
  await open("/student/apply");
  const targetScheme = page.getByTestId("scheme-gyan-sadhna");
  await targetScheme.waitFor({ state: "visible", timeout: 10000 });
  assert.equal(await targetScheme.isDisabled(), false, "Gyan Sadhna should be available for Riya");
  await targetScheme.check();
  const schemeCheckboxes = page.locator('input[data-testid^="scheme-"]');
  for (let index = 0; index < await schemeCheckboxes.count(); index += 1) {
    const checkbox = schemeCheckboxes.nth(index);
    if ((await checkbox.getAttribute("data-testid")) !== "scheme-gyan-sadhna") await checkbox.uncheck().catch(() => undefined);
  }
  await page.getByTestId("guardian-consent-checkbox").check();
  const guardianOtpSend = page.waitForResponse((response) => response.url().endsWith("/applications/guardian-otp/send") && response.request().method() === "POST", { timeout: 10000 });
  await page.getByRole("button", { name: /Send OTP|OTP મોકલો/ }).click();
  const guardianOtpResponse = await guardianOtpSend;
  assert.equal(guardianOtpResponse.status(), 200, "Guardian OTP send should return HTTP 200");
  const guardianOtpBody = await guardianOtpResponse.json();
  assert.ok(guardianOtpBody.demo_otp, "Mock guardian OTP must be returned for the demo flow");
  await page.locator("#guardian-otp").fill(guardianOtpBody.demo_otp);
  assert.equal(await page.locator("#guardian-otp").inputValue(), guardianOtpBody.demo_otp);
  const applyPromise = page.waitForResponse((response) => response.url().endsWith("/applications/bulk") && response.request().method() === "POST", { timeout: 10000 });
  await page.getByRole("button", { name: /Submit \d+ Application/ }).click();
  const applyResponse = await applyPromise;
  assert.equal(applyResponse.status(), 200, "Bulk application should return HTTP 200");
  const applyResult = await applyResponse.json();
  assert.ok(Array.isArray(applyResult.created) && applyResult.created.length > 0, `At least one application should be created: ${JSON.stringify(applyResult)}`);
  const allStudentApps = await apiRequest(studentAuth, "/applications");
  const createdRows = allStudentApps.items.filter((item) => applyResult.created.includes(item.app_code));
  assert.ok(createdRows.length > 0, "Created application should appear in the student's API list");
  const schoolApplication = createdRows.find((item) => item.route === "school" && item.status === "applied");
  assert.ok(schoolApplication, `E2E routing override should make an application school-reviewable: ${JSON.stringify(createdRows)}`);
  assert.ok(Number(schoolApplication.amount) > 0, `E2E scholarship should carry a positive amount: ${JSON.stringify(schoolApplication)}`);
  const appCode = schoolApplication.app_code;
  await page.waitForURL("**/student/applications", { timeout: 10000 });
  await page.getByText(appCode).first().waitFor({ timeout: 10000 });
  const initialTimeline = await apiRequest(studentAuth, `/applications/${encodeURIComponent(appCode)}/timeline`);
  assert.ok(Array.isArray(initialTimeline) && initialTimeline.length > 0);
  console.log(`PASS S5/S6: created ${appCode}, visible in tracker with timeline`);

  // SC2/SC3: authenticate the school as its own seeded account and approve Riya's application.
  const schoolAuth = await loginApiRole("school", identities.school);
  await setRoleSession(schoolAuth, "/school/queue");
  await page.getByText(appCode).first().waitFor({ timeout: 10000 });
  await page.getByText(/Riya Hasmukhbhai Patel|Riya Patel/i).first().waitFor({ timeout: 10000 });
  await page.locator(`a[href="/school/queue/${appCode}"]`).click();
  await page.getByRole("button", { name: /Approve & Forward/ }).waitFor({ timeout: 10000 });
  const schoolApprove = page.waitForResponse((response) => response.url().endsWith(`/applications/${appCode}/approve`) && response.request().method() === "POST", { timeout: 10000 });
  await page.getByRole("button", { name: /Approve & Forward/ }).click();
  const schoolApproveResponse = await schoolApprove;
  assert.equal(schoolApproveResponse.status(), 200, "School approval should return HTTP 200");
  const schoolApproveBody = await schoolApproveResponse.json();
  assert.equal(schoolApproveBody.new_status, "school_verified");
  const afterSchool = (await apiRequest(schoolAuth, "/applications")).items.find((item) => item.app_code === appCode);
  assert.equal(afterSchool.status, "school_verified");
  assert.equal(afterSchool.route, "deo");
  console.log("PASS SC2/SC3: same application advanced from school to DEO route");

  // D2: DEO route-scoped bulk approval on the same application.
  const deoAuth = await loginApiRole("deo", identities.deo);
  await setRoleSession(deoAuth, "/deo/approvals");
  await page.getByText(appCode).first().waitFor({ timeout: 10000 });
  await page.getByRole("button", { name: /Select Ready/ }).click();
  const deoApprove = page.waitForResponse((response) => response.url().endsWith("/applications/bulk-approve") && response.request().method() === "POST", { timeout: 10000 });
  await page.getByRole("button", { name: /Bulk Approve/ }).click();
  const deoApproveResponse = await deoApprove;
  assert.equal(deoApproveResponse.status(), 200, "DEO bulk approval should return HTTP 200");
  const deoApproveBody = await deoApproveResponse.json();
  assert.ok(Number(deoApproveBody.count ?? 0) >= 1, `DEO should approve the selected application: ${JSON.stringify(deoApproveBody)}`);
  assert.equal((await apiRequest(deoAuth, "/applications")).items.find((item) => item.app_code === appCode).status, "deo_approved");
  console.log("PASS D2: DEO bulk approval completed for the school-forwarded application");

  // V1: create and dispatch a single-cycle batch so receipt and full delivery are deterministic.
  const vendorAuth = await loginApiRole("vendor", identities.vendor);
  await setRoleSession(vendorAuth, "/vendor");
  await page.locator('input[type="number"]').nth(1).fill("1");
  const createBatch = page.waitForResponse((response) => response.url().endsWith("/vendor/batches") && response.request().method() === "POST", { timeout: 10000 });
  await page.getByRole("button", { name: /Create Batch/ }).click();
  const createBatchResponse = await createBatch;
  assert.equal(createBatchResponse.status(), 200, "Vendor batch create should return HTTP 200");
  const createdBatch = await createBatchResponse.json();
  assert.ok(createdBatch.id && createdBatch.serials?.length === 1);
  const batchRow = page.locator("tr").filter({ hasText: createdBatch.batch_code });
  const dispatch = page.waitForResponse((response) => response.url().includes(`/batches/${createdBatch.id}/dispatch`) && response.request().method() === "POST", { timeout: 10000 });
  await batchRow.getByRole("button", { name: /Dispatch/ }).click();
  assert.equal((await dispatch).status(), 200, "Vendor batch dispatch should return HTTP 200");
  console.log(`PASS V1: created and dispatched ${createdBatch.batch_code} with its label`);

  // SC5: receive the dispatched serial, initiate handover, and confirm with the OTP returned by mock SMS.
  await setRoleSession(schoolAuth, "/school/cycles");
  await page.locator('input[type="number"]').nth(0).fill(String(createdBatch.id));
  await page.locator('input[type="number"]').nth(1).fill("1");
  await page.locator("textarea").fill(createdBatch.serials.join("\n"));
  const receiveBatch = page.waitForResponse((response) => response.url().endsWith(`/batches/${createdBatch.id}/receive`) && response.request().method() === "POST", { timeout: 10000 });
  await page.getByRole("button", { name: /Confirm Batch Receipt/ }).click();
  const receiveResponse = await receiveBatch;
  assert.equal(receiveResponse.status(), 200, "School batch receipt should return HTTP 200");
  assert.equal((await receiveResponse.json()).mismatch, false);

  const cycleOverview = await apiRequest(schoolAuth, "/cycles/overview");
  const handoverStudent = cycleOverview.handover_students.find((student) => student.cts_id === studentAuth.identifier);
  assert.ok(handoverStudent, "School cycle roster should include Riya with a record ID");
  const assignedStudentCycle = await apiRequest(studentAuth, "/students/me/cycle");
  assert.ok(assignedStudentCycle.assigned && assignedStudentCycle.handover_pending,
    "Riya should use her seeded cycle that is already assigned and waiting for OTP");
  await page.getByRole("button", { name: /Student Handover/ }).click();
  await page.locator('input[type="number"]').fill(String(handoverStudent.id));
  await page.locator('input[type="text"]').nth(1).fill(assignedStudentCycle.serial_no);
  const initiateHandover = page.waitForResponse((response) => response.url().endsWith("/handover/initiate") && response.request().method() === "POST", { timeout: 10000 });
  await page.getByRole("button", { name: /Send Handover OTP to Student/ }).click();
  const initiateResponse = await initiateHandover;
  assert.equal(initiateResponse.status(), 200, "Handover initiation should return HTTP 200");
  const handoverOtp = (await initiateResponse.json()).demo_otp;
  assert.ok(handoverOtp, "Mock handover should return the student OTP");
  const confirmHandover = page.waitForResponse((response) => response.url().endsWith("/handover/confirm") && response.request().method() === "POST", { timeout: 10000 });
  await page.getByRole("button", { name: /Verify OTP & Complete Handover/ }).click();
  const handoverResponse = await confirmHandover;
  assert.equal(handoverResponse.status(), 200, "Handover confirmation should return HTTP 200");
  assert.equal((await handoverResponse.json()).status, "handed_over");
  console.log("PASS SC5: received serial and completed Riya's handover with the API-issued mock OTP");

  // S7: the student's view reflects the persisted delivered state.
  await setRoleSession(studentAuth, "/student/cycle");
  await page.getByText(/Bicycle Delivered!/).waitFor({ timeout: 10000 });
  const myCycle = await apiRequest(studentAuth, "/students/me/cycle");
  assert.equal(myCycle.status, "handed_over");
  console.log("PASS S7: student cycle page shows the delivered state from the database");

  // A3/S8: sanction, initiate mock DBT, wait for credit, then confirm in the student payment page.
  const adminAuth = await loginApiRole("admin", identities.admin);
  await setRoleSession(adminAuth, "/admin/funds");
  const sanctionButton = page.getByRole("button", { name: /Sanction Approved/ });
  await sanctionButton.waitFor({ state: "visible", timeout: 10000 });
  const sanction = page.waitForResponse((response) => response.url().endsWith("/dbt/sanction") && response.request().method() === "POST", { timeout: 10000 });
  await sanctionButton.click();
  const sanctionResponse = await sanction;
  assert.equal(sanctionResponse.status(), 200, "DBT sanction should return HTTP 200");
  assert.ok((await sanctionResponse.json()).sanctioned.includes(appCode));
  const initiateButton = page.getByRole("button", { name: /Initiate DBT/ });
  await initiateButton.waitFor({ state: "visible", timeout: 10000 });
  const initiateDbt = page.waitForResponse((response) => response.url().endsWith("/dbt/initiate") && response.request().method() === "POST", { timeout: 10000 });
  await initiateButton.click();
  const dbtInitiateResponse = await initiateDbt;
  assert.equal(dbtInitiateResponse.status(), 200, "DBT initiation should return HTTP 200");
  const initiateBody = await dbtInitiateResponse.json();
  const initiatedTxn = initiateBody.initiated.find((item) => item.app_code === appCode);
  assert.ok(initiatedTxn?.txn_id, `Initiate should return a transaction ID: ${JSON.stringify(initiateBody)}`);
  // The demo's explicit PFMS simulator is the deterministic completion control
  // for its mock processor. It updates the same persisted transaction row.
  const creditResult = await apiRequest(adminAuth, "/demo/simulate-dbt", {
    method: "POST",
    body: JSON.stringify({ txn_id: initiatedTxn.txn_id, status: "credited" }),
  });
  assert.equal(creditResult.status, "credited");
  const transaction = (await apiRequest(adminAuth, "/dbt/transactions")).items.find((item) => item.app_code === appCode);
  assert.equal(transaction?.status, "credited", `Mock DBT should credit ${appCode}: ${JSON.stringify(transaction)}`);
  await setRoleSession(studentAuth, "/student/payments");
  await page.getByText(/Credited/i).first().waitFor({ timeout: 10000 });
  assert.ok((await apiRequest(studentAuth, "/students/me/payments")).transactions.some((item) => item.status === "credited"));
  console.log("PASS A3/S8: mock DBT credited and the student payment history reflects the credit");

  // X1/S10: promote the seeded student and verify the server-side notification.
  await setRoleSession(adminAuth, "/demo/simulate", "demo");
  const promote = page.waitForResponse((response) => response.url().includes("/demo/promote/") && response.request().method() === "POST", { timeout: 10000 });
  await page.getByRole("button", { name: /Promote to Next Grade/ }).click();
  const promoteResponse = await promote;
  assert.equal(promoteResponse.status(), 200, "Promotion should return HTTP 200");
  await page.getByText(/Diff Computed/).waitFor({ timeout: 10000 });
  const promotion = await promoteResponse.json();
  assert.ok(promotion.diff, "Promotion should include the eligibility diff");

  await setRoleSession(studentAuth, "/student/notifications");
  const notices = await apiRequest(studentAuth, "/notifications");
  assert.ok(notices.items.some((notice) => /promot|grade|renew|year/i.test(`${notice.title_en} ${notice.body}`)), "Promotion should add a student notification");
  await page.getByText(/Notifications/i).first().waitFor({ timeout: 10000 });
  assert.equal(errors.length, 0, `Unexpected browser errors: ${errors.join("; ")}`);
  console.log("PASS X1/S10: promotion diff and notification persisted for Riya");
  console.log("ALL GOLDEN PATH E2E CHECKS PASSED!");
} finally {
  await browser.close();
}
