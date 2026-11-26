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
tokenBundle.student ??= await loginApiRole("student", "GJ-AND-2026-004512");
tokenBundle.school ??= await loginApiRole("school", "SCH-AND-001");
tokenBundle.taluka ??= await loginApiRole("taluka", "TPEO-BOR-001");
tokenBundle.deo ??= await loginApiRole("deo", "DEO-AND-001");
tokenBundle.admin ??= await loginApiRole("admin", "ADMIN-STATE-001");
tokenBundle.vendor ??= await loginApiRole("vendor", "VND-001");
tokenBundle.demo = { ...tokenBundle.admin, role: "demo" };

async function findPageFiles(directory) {
  const result = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await findPageFiles(fullPath));
    else if (entry.isFile() && entry.name === "page.tsx") result.push(fullPath);
  }
  return result;
}

function routeForPage(file) {
  const relative = path.relative(path.join(root, "web", "app"), file);
  const segments = relative.split(path.sep).slice(0, -1);
  if (!segments.length) return "/";
  const raw = `/${segments.join("/")}`;
  return raw
    .replace("/student/schemes/[id]", "/student/schemes/namo-lakshmi")
    .replace("/student/applications/[id]", "/student/applications/APP-2026-RIYA-NL")
    .replace("/school/queue/[id]", "/school/queue/APP-2026-RIYA-NL")
    .replace("/school/students/[id]", "/school/students/GJ-AND-2026-004512")
    .replace("/verify/[code]", "/verify/DBT-1");
}

function roleForRoute(route) {
  if (route === "/" || route === "/login" || route === "/login/verify" || route === "/transparency" || route === "/help" || route === "/privacy" || route.startsWith("/verify/") || route === "/design-system") return null;
  if (route.startsWith("/student")) return "student";
  if (route.startsWith("/school")) return "school";
  if (route.startsWith("/tpeo")) return "taluka";
  if (route.startsWith("/deo")) return "deo";
  if (route.startsWith("/admin")) return "admin";
  if (route.startsWith("/vendor")) return "vendor";
  if (route.startsWith("/demo")) return "demo";
  return null;
}

const pageFiles = await findPageFiles(path.join(root, "web", "app"));
const screens = pageFiles.map((file) => {
  const route = routeForPage(file);
  const role = roleForRoute(route);
  return [route, route, role];
}).sort((left, right) => left[1].localeCompare(right[1]));

await fs.mkdir(screensDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const [code, route, role] of screens) {
    const mobile = route === "/login/verify" || route.startsWith("/student/") || route === "/student" || route === "/school/cycles";
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
      const appRole = route.startsWith("/tpeo") ? "tpeo" : role;
      await context.addInitScript(({ session, appRole }) => {
        localStorage.setItem("vps-auth-session", JSON.stringify({ state: session, version: 0 }));
        localStorage.setItem("vps-app-store", JSON.stringify({ state: { lang: "en", role: appRole, isAuthenticated: true }, version: 0 }));
      }, { session: auth, appRole });
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
      const screenshotName = route === "/" ? "P1" : route.replaceAll("/", "_").replace(/^_/, "") || "root";
      await page.screenshot({ path: path.join(screensDir, `${screenshotName}.png`), animations: "disabled" });
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
