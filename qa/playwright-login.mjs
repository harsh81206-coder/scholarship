import assert from "node:assert/strict";
import path from "node:path";
import { createRequire } from "node:module";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const require = createRequire(path.join(root, "web", "package.json"));
const { chromium } = require("@playwright/test");
const webUrl = process.env.QA_BASE_URL ?? "http://127.0.0.1:3100";
const apiUrl = process.env.QA_API_URL ?? "http://127.0.0.1:8100";

const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on("console", (message) => {
    if (message.type() === "error") console.error("Browser console:", message.text());
  });
  page.on("pageerror", (error) => console.error("Browser page error:", error.message));
  page.on("requestfailed", (request) => console.error("Browser request failed:", request.url(), request.failure()?.errorText));
  await page.goto(`${webUrl}/login`, { waitUntil: "domcontentloaded" });
  await page.locator("#ctsId").waitFor();
  await page.waitForTimeout(300);
  await page.locator("#ctsId").fill("GJ-AND-2026-004512");
  await page.locator("#dob").fill("2009-08-15");
  await page.locator("#mobile").fill("9876543210");
  const sendResponsePromise = page.waitForResponse((response) => response.url().endsWith("/auth/otp/send"), { timeout: 10000 });
  await page.locator('form button[type="submit"]').first().click();
  const sendResponse = await sendResponsePromise;
  if (!sendResponse.ok()) throw new Error(`OTP send failed (${sendResponse.status()}): ${await sendResponse.text()}`);
  try {
    await page.waitForFunction(() => location.pathname === "/login/verify", null, { timeout: 10000 });
  } catch {
    throw new Error(`OTP send did not navigate to verification: ${(await page.locator("body").innerText()).slice(-500)}`);
  }
  if (!new URL(page.url()).pathname.endsWith("/login/verify")) {
    throw new Error(`OTP send did not navigate to verification: ${(await page.locator("body").innerText()).slice(-500)}`);
  }
  for (const [index, digit] of [..."123456"].entries()) {
    await page.getByLabel(`Digit ${index + 1}`).fill(digit);
  }
  await page.getByRole("button", { name: /ચકાસો|Verify/ }).click();
  await page.waitForURL("**/student", { timeout: 10000 });

  let cookies = await context.cookies(webUrl);
  const studentToken = decodeURIComponent(cookies.find((cookie) => cookie.name === "vps_access_token")?.value ?? "");
  assert.ok(studentToken, "student JWT cookie should be set");
  assert.equal(cookies.find((cookie) => cookie.name === "vps_role")?.value, "student");
  const studentResponse = await page.evaluate(async ({ apiUrl, token }) => {
    const response = await fetch(`${apiUrl}/students/me`, { headers: { Authorization: `Bearer ${token}` } });
    return { status: response.status, data: await response.json() };
  }, { apiUrl, token: studentToken });
  assert.equal(studentResponse.status, 200);
  assert.equal(studentResponse.data.cts_id, "GJ-AND-2026-004512");

  await page.locator('button[title="Demo role switcher"]').click();
  await page.locator(".fixed.bottom-24.right-4").locator("button").nth(1).click();
  await page.waitForURL("**/school", { timeout: 10000 });
  cookies = await context.cookies(webUrl);
  const schoolToken = decodeURIComponent(cookies.find((cookie) => cookie.name === "vps_access_token")?.value ?? "");
  assert.ok(schoolToken, "school JWT cookie should be set");
  assert.equal(cookies.find((cookie) => cookie.name === "vps_role")?.value, "school");
  const schoolResponse = await page.evaluate(async ({ apiUrl, token }) => {
    const response = await fetch(`${apiUrl}/applications`, { headers: { Authorization: `Bearer ${token}` } });
    return { status: response.status, data: await response.json() };
  }, { apiUrl, token: schoolToken });
  assert.equal(schoolResponse.status, 200);

  console.log("Role switch URL:", page.url(), "cookies:", (await context.cookies()).filter((cookie) => cookie.name.startsWith("vps_")).map(({ name, value, domain }) => ({ name, value: name === "vps_role" ? value : "<jwt>", domain })));
  await page.goto(`${webUrl}/admin`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  console.log("Wrong-role redirect URL:", page.url());
  assert.match(page.url(), /\/school$/);
  console.log("Playwright login: student OTP, /students/me, school role switch, scoped applications, and wrong-role redirect passed.");
} finally {
  await browser.close();
}
