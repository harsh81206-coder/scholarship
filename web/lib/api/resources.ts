import { MOCK_APPLICATIONS, MOCK_GRIEVANCES, MOCK_NOTIFICATIONS, MOCK_PAYMENTS, MOCK_SCHEMES, MOCK_STUDENT } from "@/lib/mock";
import { apiJson, apiRequest, type ApiEndpoint } from "./client";
import { useAuthStore } from "./auth-store";
import type { Lang, Role } from "@/lib/store";
import { useAppStore } from "@/lib/store";

export interface StudentProfile {
  cts_id: string;
  name_en: string;
  name_gu: string;
  grade: number;
  gender: string;
  school_name: string;
  completion_pct: number;
  [key: string]: unknown;
}
export interface SchemeSummary {
  scheme_code: string;
  scheme_name_en: string;
  scheme_name_gu?: string;
  amount: number;
  status: string;
  reasons?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}
export interface Paged<T> { items: T[]; total: number; page: number; size: number }
export type ApplicationSummary = Record<string, unknown> & { app_code: string; status: string; amount: number };
export type DocumentSummary = Record<string, unknown> & { id: number; doc_type: string; status: string };
export type NotificationSummary = Record<string, unknown> & { id: number; title_en: string; read: boolean };
export type GrievanceSummary = Record<string, unknown> & { grv_code: string; status: string };
const route = (path: string) => path as ApiEndpoint;

export interface ResourceApi {
  sendOtp(identifier: string, mobile: string, role: Role): Promise<{ success: boolean; resend_after_seconds: number; demo_otp?: string }>;
  verifyOtp(identifier: string, otp: string, role: Role): Promise<{ access_token: string; role: string; sub: string; scope: { school_id: number | null; taluka_id: number | null; district_id: number | null } }>;
  me(): Promise<StudentProfile>;
  mySchemes(): Promise<SchemeSummary[]>;
  explain(code: string, lang: Lang): Promise<Record<string, unknown>>;
  applications(): Promise<Paged<ApplicationSummary>>;
  applicationTimeline(code: string): Promise<Array<Record<string, unknown>>>;
  application(code: string): Promise<Record<string, unknown>>;
  documents(): Promise<DocumentSummary[]>;
  uploadDocument(docType: string, file: File): Promise<DocumentSummary & Record<string, unknown>>;
  fetchDigiLocker(): Promise<Record<string, unknown>>;
  bulkApply(codes: string[], consent: boolean): Promise<Record<string, unknown>>;
  approve(code: string, remark?: string): Promise<Record<string, unknown>>;
  reject(code: string, reason: string): Promise<Record<string, unknown>>;
  requestCorrection(code: string, fields: string[], note: string): Promise<Record<string, unknown>>;
  bulkApprove(codes: string[], remark?: string): Promise<Record<string, unknown>>;
  myCycle(): Promise<Record<string, unknown>>;
  cycleOverview(): Promise<Record<string, unknown>>;
  startHandover(input: Record<string, unknown>): Promise<Record<string, unknown>>;
  handover(input: Record<string, unknown>): Promise<Record<string, unknown>>;
  payments(): Promise<Record<string, unknown>>;
  dbtTransactions(): Promise<Paged<Record<string, unknown>>>;
  grievances(): Promise<Paged<GrievanceSummary>>;
  createGrievance(input: { category: string; description: string }): Promise<Record<string, unknown>>;
  notifications(): Promise<NotificationSummary[]>;
  readAllNotifications(): Promise<Record<string, unknown>>;
  readNotification(id: number): Promise<Record<string, unknown>>;
  consents(): Promise<Record<string, unknown>>;
  updateConsents(values: Record<string, boolean>): Promise<Record<string, unknown>>;
  exportData(): Promise<Record<string, unknown>>;
  verifyAuditChain(): Promise<Record<string, unknown>>;
  delegations(): Promise<Array<Record<string, unknown>>>;
  createDelegation(input: Record<string, unknown>): Promise<Record<string, unknown>>;
  fundsOverview(): Promise<Record<string, unknown>>;
  dbtReconciliation(): Promise<Record<string, unknown>>;
  retryDbt(id: number): Promise<Record<string, unknown>>;
  reports(type?: string): Promise<Record<string, unknown>>;
  dropoutForecast(): Promise<Record<string, unknown>>;
  budgetForecast(): Promise<Record<string, unknown>>;
  adminSettings(): Promise<Record<string, unknown>>;
  updateAdminSettings(values: Record<string, unknown>): Promise<Record<string, unknown>>;
  createAdminScheme(input: Record<string, unknown>): Promise<Record<string, unknown>>;
  updateSchemeRules(id: number, rules: Record<string, unknown>, publish: boolean): Promise<Record<string, unknown>>;
  testEligibility(input: Record<string, unknown>): Promise<Record<string, unknown>>;
  uploadRecords(type: "attendance" | "marks", file: File): Promise<Record<string, unknown>>;
  confirmRecords(type: "attendance" | "marks", rows: Array<Record<string, unknown>>): Promise<Record<string, unknown>>;
  vendorBatches(): Promise<Array<Record<string, unknown>>>;
  createBatch(schoolId: number, qty: number): Promise<Record<string, unknown>>;
  dispatchBatch(id: number, gps: { lat: number; lng: number }): Promise<Record<string, unknown>>;
  updateBatchGps(id: number, gps: { lat: number; lng: number }): Promise<Record<string, unknown>>;
  receiveBatch(id: number, input: Record<string, unknown>): Promise<Record<string, unknown>>;
  fraudFlag(id: number): Promise<Record<string, unknown>>;
  updateFraudFlag(id: number, status: string): Promise<Record<string, unknown>>;
  rescanFraud(): Promise<Record<string, unknown>>;
  analytics(role: Role): Promise<Record<string, unknown>>;
  dropout(): Promise<Paged<Record<string, unknown>>>;
  fraudFlags(): Promise<Paged<Record<string, unknown>>>;
  adminSchemes(): Promise<Array<Record<string, unknown>>>;
  auditLogs(): Promise<Paged<Record<string, unknown>>>;
  chat(message: string, lang: Lang): Promise<{ reply_text: string; cards: Array<Record<string, unknown>>; quick_replies: string[] }>;
  promote(ctsId: string): Promise<Record<string, unknown>>;
}

const realApi: ResourceApi = {
  sendOtp: (identifier, mobile, role) => apiRequest("/auth/otp/send", { ...apiJson("POST", { identifier, mobile, role: role === "tpeo" ? "taluka" : role }) }),
  verifyOtp: (identifier, otp, role) => apiRequest("/auth/otp/verify", { ...apiJson("POST", { identifier, otp, role: role === "tpeo" ? "taluka" : role }) }),
  me: () => apiRequest("/students/me"),
  mySchemes: () => apiRequest("/students/me/schemes"),
  explain: (code, lang) => apiRequest(route(`/ai/explain/${encodeURIComponent(code)}?lang=${lang}`)),
  applications: () => apiRequest("/applications?page=1&size=50"),
  applicationTimeline: (code) => apiRequest(route(`/applications/${encodeURIComponent(code)}/timeline`)),
  application: (code) => apiRequest(route(`/applications/${encodeURIComponent(code)}`)),
  documents: () => apiRequest("/documents"),
  uploadDocument: (docType, file) => {
    const body = new FormData(); body.set("doc_type", docType); body.set("file", file);
    return apiRequest("/documents", { method: "POST", body });
  },
  fetchDigiLocker: () => apiRequest("/documents/fetch-digilocker", { method: "POST" }),
  bulkApply: (schemeCodes, consent) => apiRequest("/applications/bulk", { ...apiJson("POST", { scheme_codes: schemeCodes, consent }) }),
  approve: (code, remark) => apiRequest(route(`/applications/${encodeURIComponent(code)}/approve`), { ...apiJson("POST", { remark }) }),
  reject: (code, reason) => apiRequest(route(`/applications/${encodeURIComponent(code)}/reject`), { ...apiJson("POST", { reason }) }),
  requestCorrection: (code, fields, note) => apiRequest(route(`/applications/${encodeURIComponent(code)}/request-correction`), { ...apiJson("POST", { fields, note }) }),
  bulkApprove: (codes, remark) => apiRequest("/applications/bulk-approve", { ...apiJson("POST", { app_codes: codes, remark }) }),
  myCycle: () => apiRequest("/students/me/cycle"),
  cycleOverview: () => apiRequest("/cycles/overview"),
  startHandover: (input) => apiRequest("/handover/initiate", { ...apiJson("POST", input) }),
  handover: (input) => apiRequest("/handover/confirm", { ...apiJson("POST", input) }),
  payments: () => apiRequest("/students/me/payments"),
  dbtTransactions: () => apiRequest("/dbt/transactions?page=1&size=50"),
  grievances: async () => {
    const items = await apiRequest<GrievanceSummary[]>("/grievances/me");
    return { items, total: items.length, page: 1, size: items.length || 1 };
  },
  createGrievance: (input) => apiRequest("/grievances", { ...apiJson("POST", input) }),
  notifications: () => apiRequest("/notifications"),
  readAllNotifications: () => apiRequest("/notifications/read-all", { method: "POST" }),
  readNotification: (id) => apiRequest(route(`/notifications/${id}/read`), { method: "PATCH" }),
  consents: () => apiRequest("/students/me/consents"),
  updateConsents: (values) => apiRequest("/students/me/consents", { ...apiJson("PUT", { values }) }),
  exportData: () => apiRequest("/students/me/data-export", { method: "POST" }),
  verifyAuditChain: () => apiRequest("/audit/verify-chain"),
  delegations: () => apiRequest("/delegations/me"),
  createDelegation: (input) => apiRequest("/delegations", { ...apiJson("POST", input) }),
  fundsOverview: () => apiRequest("/funds/overview"),
  dbtReconciliation: () => apiRequest("/dbt/reconciliation"),
  retryDbt: (id) => apiRequest(route(`/dbt/${id}/retry`), { method: "POST" }),
  reports: (type = "summary") => apiRequest(`/analytics/school/reports?type=${encodeURIComponent(type)}`),
  dropoutForecast: () => apiRequest("/ml/forecast/cycles"),
  budgetForecast: () => apiRequest("/ml/forecast/budget"),
  adminSettings: () => apiRequest("/admin/settings"),
  updateAdminSettings: (values) => apiRequest("/admin/settings", { ...apiJson("PUT", { values }) }),
  createAdminScheme: (input) => apiRequest("/admin/schemes", { ...apiJson("POST", input) }),
  updateSchemeRules: (id, rules, publish) => apiRequest(route(`/admin/schemes/${id}/rules`), { ...apiJson("PUT", { rules, publish }) }),
  testEligibility: (input) => apiRequest("/eligibility/test", { ...apiJson("POST", input) }),
  uploadRecords: (type, file) => {
    const body = new FormData(); body.set("file", file);
    return apiRequest(route(`/records/${type}/upload`), { method: "POST", body });
  },
  confirmRecords: (type, rows) => apiRequest(route(`/records/${type}/confirm`), { ...apiJson("POST", { rows }) }),
  vendorBatches: () => apiRequest("/vendor/batches"),
  createBatch: (school_id, qty) => apiRequest("/vendor/batches", { ...apiJson("POST", { school_id, qty }) }),
  dispatchBatch: (id, gps) => apiRequest(route(`/batches/${id}/dispatch`), { ...apiJson("POST", gps) }),
  updateBatchGps: (id, gps) => apiRequest(route(`/batches/${id}/gps`), { ...apiJson("POST", gps) }),
  receiveBatch: (id, input) => apiRequest(route(`/batches/${id}/receive`), { ...apiJson("POST", input) }),
  fraudFlag: (id) => apiRequest(route(`/fraud/flags/${id}`)),
  updateFraudFlag: (id, status) => apiRequest(route(`/fraud/flags/${id}`), { ...apiJson("PATCH", { status }) }),
  rescanFraud: () => apiRequest("/fraud/rescan", { method: "POST" }),
  analytics: (role) => apiRequest(role === "school" ? "/analytics/school" : role === "admin" ? "/analytics/state" : "/analytics/district"),
  dropout: () => apiRequest("/ml/dropout/students?page=1&size=50"),
  fraudFlags: () => apiRequest("/fraud/flags?page=1&size=50"),
  adminSchemes: () => apiRequest("/admin/schemes"),
  auditLogs: () => apiRequest("/audit/logs?page=1&size=50"),
  chat: (message, lang) => apiRequest("/ai/chat", { ...apiJson("POST", { message, lang }) }),
  promote: (ctsId) => apiRequest(route(`/demo/promote/${encodeURIComponent(ctsId)}`), { method: "POST" }),
};

const mockApi: ResourceApi = {
  sendOtp: async () => ({ success: true, resend_after_seconds: 30, demo_otp: "123456" }),
  verifyOtp: async (identifier, otp, role) => {
    if (otp !== "123456") throw new Error("Invalid or expired OTP");
    return {
      access_token: "mock-token", role, sub: identifier,
      scope: { school_id: null, taluka_id: null, district_id: null },
    };
  },
  me: async () => MOCK_STUDENT as unknown as StudentProfile,
  mySchemes: async () => MOCK_SCHEMES as unknown as SchemeSummary[],
  explain: async (code, lang) => ({ scheme_code: code, lang, status: "eligible", text: "Eligible for this scheme.", steps: [] }),
  applications: async () => ({ items: MOCK_APPLICATIONS as unknown as ApplicationSummary[], total: MOCK_APPLICATIONS.length, page: 1, size: 50 }),
  applicationTimeline: async (code) => [{ app_code: code, stage: "applied", actor: "Student" }],
  application: async (code) => ({ app_code: code, status: "applied", timeline: [{ app_code: code, stage: "applied" }] }),
  documents: async () => [],
  uploadDocument: async (docType) => ({ id: Date.now(), doc_type: docType, status: "pending", confidence: 0.92 }),
  fetchDigiLocker: async () => ({ fetched: ["aadhaar", "caste"], source: "digilocker" }),
  bulkApply: async (codes) => ({ created: codes, skipped: [], count: codes.length }),
  approve: async (code) => ({ app_code: code, success: true, new_status: "school_verified" }),
  reject: async (code, reason) => ({ app_code: code, success: true, reason }),
  requestCorrection: async (code, fields) => ({ app_code: code, success: true, fields }),
  bulkApprove: async (codes) => ({ approved: codes, skipped: [], count: codes.length, total: codes.length, skipped_count: 0 }),
  myCycle: async () => ({ assigned: true, serial_no: "SSB-2026-077432", status: "received" }),
  cycleOverview: async () => ({ ordered: 120, dispatched: 120, received: 118, delivered: 84, batches: [] }),
  startHandover: async (input) => ({ success: true, demo_otp: "123456", ...input }),
  handover: async (input) => ({ success: true, status: "handed_over", ...input }),
  payments: async () => ({ total_credited: 0, transactions: MOCK_PAYMENTS }),
  dbtTransactions: async () => ({ items: MOCK_PAYMENTS as unknown as Record<string, unknown>[], total: MOCK_PAYMENTS.length, page: 1, size: 50 }),
  grievances: async () => ({ items: MOCK_GRIEVANCES as unknown as GrievanceSummary[], total: MOCK_GRIEVANCES.length, page: 1, size: 50 }),
  createGrievance: async () => ({ success: true, grv_code: "GRV-DEMO-001" }),
  notifications: async () => MOCK_NOTIFICATIONS as unknown as NotificationSummary[],
  readAllNotifications: async () => ({ success: true }),
  readNotification: async (id) => ({ success: true, id, read: true }),
  consents: async () => ({ guardian_consent: true, data_sharing: true }),
  updateConsents: async (values) => ({ success: true, values }),
  exportData: async () => ({ success: true, download_url: "/demo/student-data.json" }),
  verifyAuditChain: async () => ({ valid: true, entries: 0, first_broken_index: null }),
  delegations: async () => [],
  createDelegation: async (input) => ({ success: true, ...input }),
  fundsOverview: async () => ({ allocated: 1000000, released: 720000, utilized: 510000 }),
  dbtReconciliation: async () => ({ matched: 0, mismatched: 0, pending: 0 }),
  retryDbt: async (id) => ({ success: true, txn_id: id }),
  reports: async () => ({ total: 0, status_counts: {}, items: [] }),
  dropoutForecast: async () => ({ model: "mock", items: [], total_forecast: 0 }),
  budgetForecast: async () => ({ items: [], total_forecast_budget: 0 }),
  adminSettings: async () => ({}),
  updateAdminSettings: async (values) => ({ updated: Object.keys(values) }),
  createAdminScheme: async (input) => ({ id: Date.now(), ...input }),
  updateSchemeRules: async (id, _rules, publish) => ({ id, version: 1, published: publish }),
  testEligibility: async (input) => ({ status: "eligible", ...input }),
  uploadRecords: async (_type, file) => ({ total: 0, valid: 0, errors: [], filename: file.name }),
  confirmRecords: async (_type, rows) => ({ updated: rows.length }),
  vendorBatches: async () => [],
  createBatch: async (school_id, qty) => ({ id: Date.now(), school_id, qty, status: "ordered", serials: [] }),
  dispatchBatch: async (id) => ({ id, status: "dispatched" }),
  updateBatchGps: async (id) => ({ id, success: true }),
  receiveBatch: async (id) => ({ id, status: "received" }),
  fraudFlag: async (id) => ({ id, graph: { nodes: [], edges: [] } }),
  updateFraudFlag: async (id, status) => ({ id, status }),
  rescanFraud: async () => ({ status: "running" }),
  analytics: async () => ({ total_students: 600, pending: 12, approved: 420 }),
  dropout: async () => ({ items: [], total: 0, page: 1, size: 50 }),
  fraudFlags: async () => ({ items: [], total: 0, page: 1, size: 50 }),
  adminSchemes: async () => MOCK_SCHEMES as unknown as Array<Record<string, unknown>>,
  auditLogs: async () => ({ items: [], total: 0, page: 1, size: 50 }),
  chat: async () => ({ reply_text: "I can help with schemes and applications. AI guidance; officers make the final decision.", cards: [], quick_replies: [] }),
  promote: async (ctsId) => ({ cts_id: ctsId, old_grade: 9, new_grade: 10, diff: { newly_eligible: [], renewed: [], no_longer_applicable: [] } }),
};

export const api: ResourceApi = process.env.NEXT_PUBLIC_USE_MOCK === "true" ? mockApi : realApi;

export function storeAuthSession(identifier: string, role: Role, response: Awaited<ReturnType<ResourceApi["verifyOtp"]>>) {
  useAuthStore.getState().setSession({ accessToken: response.access_token, role, identifier, scope: response.scope });
}

const DEMO_IDENTITIES: Record<Exclude<Role, "demo">, { identifier: string; mobile: string }> = {
  student: { identifier: "GJ-AND-2026-004512", mobile: "9876543210" },
  school: { identifier: "SCH-AND-001", mobile: "9898000001" },
  tpeo: { identifier: "TPEO-BOR-001", mobile: "9898000002" },
  deo: { identifier: "DEO-AND-001", mobile: "9898000003" },
  admin: { identifier: "ADMIN-STATE-001", mobile: "9898000004" },
  vendor: { identifier: "VND-001", mobile: "9898000005" },
};

export async function loginDemoRole(role: Role) {
  const targetRole = role === "demo" ? "admin" : role;
  const identity = DEMO_IDENTITIES[targetRole];
  await api.sendOtp(identity.identifier, identity.mobile, targetRole);
  const response = await api.verifyOtp(identity.identifier, "123456", targetRole);
  storeAuthSession(identity.identifier, role, response);
  useAppStore.getState().login(role);
  return identity.identifier;
}
