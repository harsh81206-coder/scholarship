import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const baseUrl = process.env.QA_BASE_URL ?? "http://127.0.0.1:3000";
const root = path.resolve(new URL("..", import.meta.url).pathname);
const screensDir = path.join(root, "qa", "screens");
const require = createRequire(path.join(root, "web", "package.json"));
const { chromium } = require("@playwright/test");
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
      await context.addCookies([
        { name: "vps_access_token", value: "visual-qa-token", url: baseUrl, sameSite: "Lax" },
        { name: "vps_role", value: role, url: baseUrl, sameSite: "Lax" },
      ]);
    }
    const page = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    let status = 0;
    try {
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 30000 });
      status = response?.status() ?? 0;
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(450);
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
      results.push({ code, route, role: role ?? "public", viewport, status, finalUrl: page.url(), pageErrors, ...layout,
        horizontalOverflow: layout.documentWidth > layout.viewportWidth + 1 });
    } catch (error) {
      results.push({ code, route, role: role ?? "public", viewport, status, pageErrors, error: String(error) });
    }
    await context.close();
  }
} finally {
  await browser.close();
}

await fs.writeFile(path.join(root, "qa", "results.json"), `${JSON.stringify(results, null, 2)}\n`);
const failures = results.filter((item) => item.status !== 200 || item.error || item.pageErrors?.length);
console.log(`Screenshots: ${results.filter((item) => !item.error).length}/${screens.length}`);
console.log(`HTTP/page errors: ${failures.length}`);
console.table(results.map(({ code, status, viewport, horizontalOverflow, brokenImages, pageErrors }) => ({
  screen: code, status, viewport: `${viewport.width}x${viewport.height}`,
  overflow: horizontalOverflow ? "yes" : "no", brokenImages: brokenImages?.length ?? "?", pageErrors: pageErrors?.length ?? "?",
})));
if (failures.length) process.exitCode = 1;
