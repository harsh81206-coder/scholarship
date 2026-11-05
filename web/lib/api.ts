/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * lib/api.ts — Mock-first API layer with FastAPI fallback.
 * NEXT_PUBLIC_USE_MOCK=true  → instant mock data (no backend needed)
 * NEXT_PUBLIC_USE_MOCK=false → calls NEXT_PUBLIC_API_URL (FastAPI on :8000)
 */
import {
  MOCK_STUDENT,
  MOCK_SCHEMES,
  MOCK_APPLICATIONS,
  MOCK_PAYMENTS,
  MOCK_NOTIFICATIONS,
  MOCK_GRIEVANCES,
  MOCK_DISTRICTS,
  MOCK_MONTHLY_DBT,
  MOCK_OFFICER,
} from "./mock";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const TOKEN_KEY = "vps_access_token";

function authHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Core fetch helpers ───────────────────────────────────────────────────────
async function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function get<T>(path: string, mockData: T): Promise<T> {
  if (USE_MOCK) { await delay(150); return mockData; }
  const res = await fetch(`${API_URL}${path}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown, mockData: T): Promise<T> {
  if (USE_MOCK) { await delay(300); return mockData; }
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

async function put<T>(path: string, body: unknown, mockData: T): Promise<T> {
  if (USE_MOCK) { await delay(200); return mockData; }
  const res = await fetch(`${API_URL}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export async function sendOtp(ctsId: string, mobile: string, role = "student") {
  const backendRole = role === "tpeo" ? "taluka" : role;
  return post("/auth/otp/send", { role: backendRole, identifier: ctsId, mobile }, { success: true, demo_otp: "123456" });
}

export async function verifyOtp(ctsId: string, otp: string, role = "student") {
  if (USE_MOCK) {
    await delay(300);
    if (otp !== "123456") throw new Error("Invalid OTP");
    return { success: true, token: "mock-jwt-token", role, name_en: MOCK_STUDENT.name };
  }
  const backendRole = role === "tpeo" ? "taluka" : role;
  const res = await fetch(`${API_URL}/auth/otp/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: ctsId, otp, role: backendRole }),
  });
  if (!res.ok) throw new Error("Invalid OTP");
  const payload = await res.json();
  if (typeof window !== "undefined" && payload.access_token) {
    window.localStorage.setItem(TOKEN_KEY, payload.access_token);
  }
  return { ...payload, success: true, token: payload.access_token, role, name_en: payload.name };
}

// ── Student ──────────────────────────────────────────────────────────────────
export async function getStudentProfile(ctsId = "GJ-AND-2026-004512") {
  return get("/students/me", MOCK_STUDENT);
}

export async function getSchemes() {
  return get("/students/me/schemes", MOCK_SCHEMES);
}

export async function getSchemeById(id: string) {
  return get(`/students/me/schemes`, MOCK_SCHEMES).then(
    (schemes) => (schemes as typeof MOCK_SCHEMES).find((s) => s.id === id) ?? MOCK_SCHEMES[0]
  );
}

export async function getApplications(ctsId = "GJ-AND-2026-004512") {
  return get(`/applications`, MOCK_APPLICATIONS);
}

export async function submitApplications(schemeCodes: string[], ctsId = "GJ-AND-2026-004512") {
  return post(
    `/applications/bulk`,
    { scheme_codes: schemeCodes, consent: true },
    { success: true, created: schemeCodes, count: schemeCodes.length }
  );
}

export async function getDocuments(ctsId = "GJ-AND-2026-004512") {
  return get(`/documents`, [
    { doc_type: "aadhaar", doc_number: "••••••••8912", source: "digilocker", status: "verified", ocr_confidence: 0.98 },
    { doc_type: "income", doc_number: "REV/AND/2026/049182", source: "upload", status: "verified", ocr_confidence: 0.84 },
    { doc_type: "caste", doc_number: "CST/GUJ/2024/99102", source: "digilocker", status: "verified", ocr_confidence: 0.99 },
    { doc_type: "marksheet", doc_number: "GSEB/2025/MS-88124", source: "upload", status: "verified", ocr_confidence: 0.95 },
  ]);
}

export async function getPayments(ctsId = "GJ-AND-2026-004512") {
  return get(`/students/me/payments`, MOCK_PAYMENTS);
}

export async function getNotifications() {
  return get("/notifications", MOCK_NOTIFICATIONS);
}

export async function markAllNotificationsRead() {
  return post("/notifications/read-all", {}, { success: true });
}

export async function getGrievances(ctsId = "GJ-AND-2026-004512") {
  return get(`/grievances/me`, MOCK_GRIEVANCES);
}

export async function raiseGrievance(
  data: { subject: string; description: string; scheme_code?: string },
  ctsId = "GJ-AND-2026-004512"
) {
  return post(
    `/grievances`,
    { category: data.scheme_code ?? "other", description: `${data.subject}: ${data.description}` },
    { success: true, grv_code: `GRV-2026-${Math.floor(Math.random() * 90000 + 10000)}` }
  );
}

// ── School Officer ────────────────────────────────────────────────────────────
export async function getSchoolDashboard() {
  return get("/analytics/school", {
    officer: MOCK_OFFICER,
    totalStudents: 847,
    pendingQueue: 23,
    disbursed: 4200000,
    avgAttendance: 87,
  });
}

export async function getVerificationQueue(udise = "24150104502") {
  return get(
    `/applications?status=applied`,
    MOCK_APPLICATIONS.map((a) => ({ ...a, studentName: MOCK_STUDENT.name }))
  );
}

export async function approveApplication(appCode: string, remark?: string) {
  return post(
    `/applications/${appCode}/approve`,
    { remark: remark ?? "Approved by Principal" },
    { success: true, app_code: appCode, status: "school_approved" }
  );
}

export async function rejectApplication(appCode: string, remark: string) {
  return post(
    `/applications/${appCode}/reject`,
    { remark },
    { success: true, app_code: appCode, status: "rejected" }
  );
}

// ── TPEO ─────────────────────────────────────────────────────────────────────
export async function getTpeoQueue() {
  return get("/applications?route=taluka", MOCK_APPLICATIONS.filter((a) => Number(a.amount) >= 10000));
}

export async function tpeoApprove(appCode: string, remark?: string) {
  return post(
    `/applications/${appCode}/approve`,
    { remark: remark ?? "TPEO Clearance granted" },
    { success: true, app_code: appCode, tpeo_status: "cleared" }
  );
}

export async function tpeoReject(appCode: string, remark: string) {
  return post(
    `/applications/${appCode}/reject`,
    { remark },
    { success: true, app_code: appCode, status: "rejected" }
  );
}

// ── DEO Officer ───────────────────────────────────────────────────────────────
export async function getDeoDashboard() {
  return get("/analytics/district", {
    totalStudents: 12450,
    pendingApprovals: 234,
    disbursedThisMonth: 23000000,
    atRiskStudents: 67,
    districts: MOCK_DISTRICTS,
  });
}

export async function getDeoQueue() {
  return get("/applications?route=deo", MOCK_APPLICATIONS);
}

export async function bulkApprove(appCodes: string[], remark?: string) {
  return post(
    "/applications/bulk-approve",
    { app_codes: appCodes, remark },
    { success: true, approved: appCodes, count: appCodes.length }
  );
}

export async function getAtRiskStudents() {
  return get("/ml/dropout/students", []);
}

// ── Admin ─────────────────────────────────────────────────────────────────────
export async function getStateAnalytics() {
  return get("/analytics/state", {
    totalBeneficiaries: 1240000,
    totalDisbursed: 847000000,
    coveragePercent: 89,
    activeSchemesCount: 7,
    districts: MOCK_DISTRICTS,
    monthlyDbt: MOCK_MONTHLY_DBT,
  });
}

export async function getAdminSchemes() {
  return get("/admin/schemes", MOCK_SCHEMES);
}

export async function getAuditLogs(_filters?: Record<string, string>) {
  return get("/audit/logs", [
    { id: "AL001", ts: "2026-11-04T10:32:00Z", actor: "Dr. Kalpesh Shah", role: "school", action: "APPROVE", entity: "Application", entityId: "APP-2026-00871", result: "SUCCESS" },
    { id: "AL002", ts: "2026-11-04T09:15:00Z", actor: "DEO Anand", role: "deo", action: "APPROVE", entity: "Application", entityId: "APP-2026-00870", result: "SUCCESS" },
    { id: "AL003", ts: "2026-11-03T16:40:00Z", actor: "SYSTEM", role: "system", action: "AUTO_VERIFY", entity: "Document", entityId: "DOC-2026-04512", result: "SUCCESS" },
    { id: "AL004", ts: "2026-11-03T14:22:00Z", actor: "Admin User", role: "admin", action: "CREATE", entity: "Scheme", entityId: "SCH-NL-2027", result: "SUCCESS" },
    { id: "AL005", ts: "2026-11-02T11:05:00Z", actor: "DEO Anand", role: "deo", action: "REJECT", entity: "Application", entityId: "APP-2026-00865", result: "SUCCESS" },
  ]);
}

// ── Vendor ────────────────────────────────────────────────────────────────────
export async function getVendorBatches() {
  return get("/vendor/batches", [
    { batch_id: "CYCLE-2026-AN-001", vendor: "Atlas Cycles Ltd", quantity: 200, district: "Anand", dispatch_date: "2026-09-15", status: "partially_delivered", delivered_pct: 85, schools_covered: 12 },
  ]);
}
