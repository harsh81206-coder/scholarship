import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const baseUrl = process.env.QA_BASE_URL ?? "http://127.0.0.1:3000";
const apiUrl = process.env.QA_API_URL ?? "http://127.0.0.1:8000";
const tokenFile = process.env.QA_TOKEN_FILE;
const root = path.resolve(new URL("..", import.meta.url).pathname);
const screensDir = path.join(root, "qa", "screens");
const require = createRequire(path.join(root, "web", "package.json"));
const { chromium } = require("@playwright/test");

async function loginApiRole(role, identifier) {
  const send = await fetch(`${apiUrl}/auth/otp/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, identifier }),
  });
  const sendBody = await send.json();
  if (!send.ok || !sendBody.demo_otp) {
    throw new Error(`Could not request ${role} QA OTP (${send.status}): ${JSON.stringify(sendBody)}`);
  }
  const verify = await fetch(`${apiUrl}/auth/otp/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, identifier, otp: sendBody.demo_otp }),
  });
  const verifyBody = await verify.json();
  if (!verify.ok || !verifyBody.access_token) {
    throw new Error(`Could not verify ${role} QA OTP (${verify.status}): ${JSON.stringify(verifyBody)}`);
  }
  return {
    accessToken: verifyBody.access_token,
    role,
    identifier,
    scope: verifyBody.scope,
  };
}

const tokenBundle = tokenFile ? JSON.parse(await fs.readFile(tokenFile, "utf8")) : {};
tokenBundle.deo ??= await loginApiRole("deo", "DEO-AND-001");
tokenBundle.admin ??= await loginApiRole("admin", "ADMIN-STATE-001");
tokenBundle.vendor ??= await loginApiRole("vendor", "VND-001");
tokenBundle.demo = { ...tokenBundle.admin, role: "demo" };

const screens = [
  ["P1", "/", null], ["P2", "/login", null], ["P3", "/login/verify", null],
  ["S1", "/student", "student"], ["S2", "/student/schemes/namo-lakshmi", "student"],
  ["S3", "/student/vault", "student"], ["S4", "/student/vault/upload", "student"],
  ["S5", "/student/apply", "student"], ["S6", "/student/applications", "student"],
  ["S7", "/student/cycle", "student"], ["S8", "/student/payments", "student"],
  ["S9", "/student/grievances", "student"], ["S10", "/student/notifications", "student"],
  ["S11", "/student/profile", "student"], ["S12", "/student/assistant", "student"],
  ["SC1", "/school", "school"], ["SC2", "/school/queue", "school"],
  ["SC3", "/school/queue/APP-2026-RIYA-NL", "school"], ["SC4", "/school/records", "school"],
  ["SC5", "/school/cycles", "school"], ["SC6", "/school/reports", "school"],
  ["D1", "/deo", "deo"], ["D2", "/deo/approvals", "deo"],
  ["D3", "/deo/cycles", "deo"], ["D4", "/deo/at-risk", "deo"],
  ["D5", "/deo/grievances", "deo"], ["A1", "/admin", "admin"],
  ["A2", "/admin/schemes/builder", "admin"], ["A3", "/admin/funds", "admin"],
  ["A4", "/admin/fraud", "admin"], ["A5", "/admin/audit", "admin"],
  ["V1", "/vendor", "vendor"], ["X1", "/demo/simulate", "demo"],
];

await fs.mkdir(screensDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const [code, route, role] of screens) {
    const mobile = code === "P3" || /^S\d+/.test(code) || code === "SC5";
    const viewport = mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 };
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
    if (role) {
      const auth = tokenBundle[role];
      if (!auth?.accessToken) throw new Error(`Missing API-issued ${role} token for ${code}`);
      const base = new URL(baseUrl);
      const hostnames = new Set([base.hostname]);
      if (base.hostname === "127.0.0.1") hostnames.add("localhost");
      if (base.hostname === "localhost") hostnames.add("127.0.0.1");
      await context.addCookies([...hostnames].flatMap((hostname) => [
        { name: "vps_access_token", value: auth.accessToken, url: `${base.protocol}//${hostname}:${base.port}`, sameSite: "Lax" },
        { name: "vps_role", value: role, url: `${base.protocol}//${hostname}:${base.port}`, sameSite: "Lax" },
      ]));
      await context.addInitScript(({ session, appRole }) => {
        localStorage.setItem("vps-auth-session", JSON.stringify({ state: session, version: 0 }));
        localStorage.setItem("vps-app-store", JSON.stringify({ state: { lang: "en", role: appRole, isAuthenticated: true }, version: 0 }));
      }, { session: auth, appRole: role });
    }
    const page = await context.newPage();
    const pageErrors = [];
    const apiErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("response", (response) => {
      if (response.url().startsWith(apiUrl) && response.status() >= 400) {
        apiErrors.push(`${response.status()} ${response.request().method()} ${new URL(response.url()).pathname}`);
      }
    });
    let status = 0;
    try {
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 30000 });
      status = response?.status() ?? 0;
      await page.evaluate(() => document.fonts.ready);
      await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => undefined);
      await page.waitForTimeout(600);
      const layout = await page.evaluate(() => ({
        title: document.title,
        textLength: document.body.innerText.trim().length,
        viewportWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        documentHeight: document.documentElement.scrollHeight,
        brokenImages: [...document.images].filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.currentSrc || image.src),
        fontFamily: getComputedStyle(document.body).fontFamily,
        notoGujaratiReady: document.fonts.check("16px 'Noto Sans Gujarati'", "ગુજરાતી"),
      }));
      await page.screenshot({ path: path.join(screensDir, `${code}.png`), animations: "disabled" });
      results.push({ code, route, role: role ?? "public", viewport, status, finalUrl: page.url(), pageErrors, apiErrors, ...layout,
        horizontalOverflow: layout.documentWidth > layout.viewportWidth + 1 });
    } catch (error) {
      results.push({ code, route, role: role ?? "public", viewport, status, pageErrors, apiErrors, error: String(error) });
    }
    await context.close();
  }
} finally {
  await browser.close();
}

await fs.writeFile(path.join(root, "qa", "results.json"), `${JSON.stringify(results, null, 2)}\n`);
const failures = results.filter((item) => item.status !== 200 || item.error || item.pageErrors?.length || item.apiErrors?.length);
console.log(`Screenshots: ${results.filter((item) => !item.error).length}/${screens.length}`);
console.log(`HTTP/page errors: ${failures.length}`);
console.table(results.map(({ code, status, viewport, horizontalOverflow, brokenImages, pageErrors, apiErrors }) => ({
  screen: code, status, viewport: `${viewport.width}x${viewport.height}`,
  overflow: horizontalOverflow ? "yes" : "no", brokenImages: brokenImages?.length ?? "?", pageErrors: pageErrors?.length ?? "?", apiErrors: apiErrors?.length ?? "?",
})));
if (failures.length) process.exitCode = 1;
