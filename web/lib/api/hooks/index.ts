"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Lang, Role } from "@/lib/store";
import { api } from "../resources";

export const keys = {
  me: ["me"] as const,
  schemes: ["schemes", "me"] as const,
  explain: (code: string, lang: Lang) => ["explain", code, lang] as const,
  apps: ["applications"] as const,
  timeline: (code: string) => ["applications", code, "timeline"] as const,
  docs: ["documents"] as const,
  cycle: ["cycle", "me"] as const,
  cycles: ["cycles", "overview"] as const,
  payments: ["payments", "me"] as const,
  dbt: ["dbt"] as const,
  grievances: ["grievances"] as const,
  notifications: ["notifications"] as const,
  analytics: (role: Role) => ["analytics", role] as const,
  dropout: ["dropout"] as const,
  fraud: ["fraud", "flags"] as const,
  adminSchemes: ["admin", "schemes"] as const,
  audit: ["audit", "logs"] as const,
};

export const useMe = () => useQuery({ queryKey: keys.me, queryFn: api.me });
export const useMySchemes = () => useQuery({ queryKey: keys.schemes, queryFn: api.mySchemes });
export const useExplain = (code: string, lang: Lang) => useQuery({
  queryKey: keys.explain(code, lang), queryFn: () => api.explain(code, lang), enabled: Boolean(code),
});
export const useApplications = () => useQuery({ queryKey: keys.apps, queryFn: api.applications });
export const useApplicationTimeline = (code: string) => useQuery({
  queryKey: keys.timeline(code), queryFn: () => api.applicationTimeline(code), enabled: Boolean(code),
});
export const useApplication = (code: string) => useQuery({
  queryKey: ["applications", code] as const, queryFn: () => api.application(code), enabled: Boolean(code),
});
export const useSendGuardianOtp = () => useMutation({ mutationFn: api.sendGuardianOtp });
export const useDocuments = () => useQuery({ queryKey: keys.docs, queryFn: api.documents });
export const useUploadDocument = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ docType, file }: { docType: string; file: File }) => api.uploadDocument(docType, file),
    onSuccess: () => client.invalidateQueries({ queryKey: keys.docs }) });
};
export const useFetchDigiLocker = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: api.fetchDigiLocker, onSuccess: () => client.invalidateQueries({ queryKey: keys.docs }) });
};
export const useBulkApply = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ codes, consent, guardianOtp }: { codes: string[]; consent: boolean; guardianOtp: string }) => api.bulkApply(codes, consent, guardianOtp),
    onSuccess: () => client.invalidateQueries({ queryKey: keys.apps }) });
};
export const useApprove = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ code, remark }: { code: string; remark?: string }) => api.approve(code, remark),
    onSuccess: () => client.invalidateQueries({ queryKey: keys.apps }) });
};
export const useReject = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ code, reason }: { code: string; reason: string }) => api.reject(code, reason),
    onSuccess: () => client.invalidateQueries({ queryKey: keys.apps }) });
};
export const useRequestCorrection = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ code, fields, note }: { code: string; fields: string[]; note: string }) => api.requestCorrection(code, fields, note),
    onSuccess: () => client.invalidateQueries({ queryKey: keys.apps }) });
};
export const useBulkApprove = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ codes, remark }: { codes: string[]; remark?: string }) => api.bulkApprove(codes, remark),
    onSuccess: () => client.invalidateQueries({ queryKey: keys.apps }) });
};
export const useMyCycle = () => useQuery({ queryKey: keys.cycle, queryFn: api.myCycle });
export const useCycleOverview = () => useQuery({ queryKey: keys.cycles, queryFn: api.cycleOverview });
export const useHandover = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ action, input }: { action: "initiate" | "confirm"; input: Record<string, unknown> }) =>
    action === "initiate" ? api.startHandover(input) : api.handover(input),
    onSuccess: () => client.invalidateQueries({ queryKey: keys.cycle }) });
};
export const usePayments = () => useQuery({ queryKey: keys.payments, queryFn: api.payments });
export const useReceipt = () => useMutation({ mutationFn: api.receipt });
export const useDbt = () => useQuery({ queryKey: keys.dbt, queryFn: api.dbtTransactions });
export const useGrievances = () => useQuery({ queryKey: keys.grievances, queryFn: api.grievances });
export const useCreateGrievance = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: api.createGrievance, onSuccess: () => client.invalidateQueries({ queryKey: keys.grievances }) });
};
export const useUpdateGrievance = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ code, status }: { code: string; status: string }) => api.updateGrievance(code, { status }),
    onSuccess: () => client.invalidateQueries({ queryKey: keys.grievances }),
  });
};
export const useNotifications = () => useQuery({ queryKey: keys.notifications, queryFn: api.notifications });
export const useReadAllNotifications = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: api.readAllNotifications, onSuccess: () => client.invalidateQueries({ queryKey: keys.notifications }) });
};
export const useReadNotification = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: api.readNotification,
    onSuccess: () => client.invalidateQueries({ queryKey: keys.notifications }) });
};
export const useConsents = () => useQuery({ queryKey: ["student", "consents"], queryFn: api.consents });
export const useUpdateConsents = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: api.updateConsents,
    onSuccess: () => client.invalidateQueries({ queryKey: ["student", "consents"] }) });
};
export const useExportData = () => useMutation({ mutationFn: api.exportData });
export const useAnalytics = (role: Role) => useQuery({ queryKey: keys.analytics(role), queryFn: () => api.analytics(role) });
export const useTalukaSchools = () => useQuery({ queryKey: ["analytics", "taluka", "schools"], queryFn: api.talukaSchools });
export const useTalukaReports = () => useQuery({ queryKey: ["analytics", "taluka", "reports"], queryFn: api.talukaReports });
export const useDropout = () => useQuery({ queryKey: keys.dropout, queryFn: api.dropout });
export const useFraudFlags = () => useQuery({ queryKey: keys.fraud, queryFn: api.fraudFlags });
export const useAdminSchemes = () => useQuery({ queryKey: keys.adminSchemes, queryFn: api.adminSchemes });
export const useAuditLogs = () => useQuery({ queryKey: keys.audit, queryFn: api.auditLogs });
export const useVerifyAuditChain = () => useQuery({ queryKey: ["audit", "verify-chain"], queryFn: api.verifyAuditChain });
export const useDelegations = () => useQuery({ queryKey: ["delegations"], queryFn: api.delegations });
export const useCreateDelegation = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: api.createDelegation,
    onSuccess: () => client.invalidateQueries({ queryKey: ["delegations"] }) });
};
export const useFundsOverview = () => useQuery({ queryKey: ["funds", "overview"], queryFn: api.fundsOverview });
export const useDbtReconciliation = () => useQuery({ queryKey: ["dbt", "reconciliation"], queryFn: api.dbtReconciliation });
export const useSanctionDbt = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (applicationIds: string[]) => api.sanctionDbt(applicationIds),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: keys.apps });
      client.invalidateQueries({ queryKey: keys.dbt });
      client.invalidateQueries({ queryKey: ["funds", "overview"] });
    },
  });
};
export const useInitiateDbt = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationIds, idempotencyKey }: { applicationIds: string[]; idempotencyKey?: string }) =>
      api.initiateDbt(applicationIds, idempotencyKey),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: keys.apps });
      client.invalidateQueries({ queryKey: keys.dbt });
      client.invalidateQueries({ queryKey: ["funds", "overview"] });
    },
  });
};
export const useRetryDbt = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: api.retryDbt,
    onSuccess: () => client.invalidateQueries({ queryKey: keys.dbt }) });
};
export const useSchoolReports = (type?: string) => useQuery({ queryKey: ["reports", "school", type], queryFn: () => api.reports(type) });
export const useCycleForecast = () => useQuery({ queryKey: ["forecast", "cycles"], queryFn: api.dropoutForecast });
export const useBudgetForecast = () => useQuery({ queryKey: ["forecast", "budget"], queryFn: api.budgetForecast });
export const useAdminSettings = () => useQuery({ queryKey: ["admin", "settings"], queryFn: api.adminSettings });
export const useUpdateAdminSettings = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: api.updateAdminSettings,
    onSuccess: () => client.invalidateQueries({ queryKey: ["admin", "settings"] }) });
};
export const useCreateAdminScheme = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: api.createAdminScheme,
    onSuccess: () => client.invalidateQueries({ queryKey: keys.adminSchemes }) });
};
export const useUpdateSchemeRules = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ id, rules, publish }: { id: number; rules: Record<string, unknown>; publish: boolean }) => api.updateSchemeRules(id, rules, publish),
    onSuccess: () => client.invalidateQueries({ queryKey: keys.adminSchemes }) });
};
export const useEligibilityTest = () => useMutation({ mutationFn: api.testEligibility });
export const useUploadRecords = () => useMutation({ mutationFn: ({ type, file }: { type: "attendance" | "marks"; file: File }) => api.uploadRecords(type, file) });
export const useConfirmRecords = () => useMutation({ mutationFn: ({ type, rows }: { type: "attendance" | "marks"; rows: Array<Record<string, unknown>> }) => api.confirmRecords(type, rows) });
export const useVendorBatches = () => useQuery({ queryKey: ["vendor", "batches"], queryFn: api.vendorBatches });
export const useBatchQr = (id: number) => useQuery({ queryKey: ["vendor", "batches", id, "qr"], queryFn: () => api.batchQr(id), enabled: id > 0 });
export const useBatchTracking = (id: number) => useQuery({ queryKey: ["vendor", "batches", id, "tracking"], queryFn: () => api.batchTracking(id), enabled: id > 0 });
export const useDistrictSchools = () => useQuery({ queryKey: ["analytics", "district", "schools"], queryFn: api.districtSchools });
export const useStateRanking = () => useQuery({ queryKey: ["analytics", "state", "ranking"], queryFn: api.stateRanking });
export const useMyBank = () => useQuery({ queryKey: ["student", "bank"], queryFn: api.myBank });
export const useAddBank = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: api.addBank, onSuccess: () => client.invalidateQueries({ queryKey: ["student", "bank"] }) });
};
export const useVerifyBank = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: api.verifyBank, onSuccess: () => client.invalidateQueries({ queryKey: ["student", "bank"] }) });
};
export const useSchoolStudents = (input?: { q?: string; risk?: string }) => useQuery({ queryKey: ["school", "students", input], queryFn: () => api.schoolStudents(input) });
export const useSchoolStudent = (ctsId: string) => useQuery({ queryKey: ["school", "students", ctsId], queryFn: () => api.schoolStudent(ctsId), enabled: Boolean(ctsId) });
export const useHandovers = () => useQuery({ queryKey: ["handovers"], queryFn: api.handovers });
export const useVendorOrders = () => useQuery({ queryKey: ["vendor", "orders"], queryFn: api.vendorOrders });
export const useCreateVendorOrder = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: api.createVendorOrder, onSuccess: () => client.invalidateQueries({ queryKey: ["vendor", "orders"] }) });
};
export const useUpdateVendorOrder = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: api.updateVendorOrder, onSuccess: () => client.invalidateQueries({ queryKey: ["vendor", "orders"] }) });
};
export const useVendorInvoices = () => useQuery({ queryKey: ["vendor", "invoices"], queryFn: api.vendorInvoices });
export const useCreateVendorInvoice = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: api.createVendorInvoice, onSuccess: () => client.invalidateQueries({ queryKey: ["vendor", "invoices"] }) });
};
export const usePayVendorInvoice = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: api.payVendorInvoice, onSuccess: () => client.invalidateQueries({ queryKey: ["vendor", "invoices"] }) });
};
export const useBudgetAllocations = () => useQuery({ queryKey: ["funds", "allocations"], queryFn: api.budgetAllocations });
export const useAllocateBudget = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: api.allocateBudget, onSuccess: () => client.invalidateQueries({ queryKey: ["funds", "allocations"] }) });
};
export const useAdminUsers = () => useQuery({ queryKey: ["admin", "users"], queryFn: api.adminUsers });
export const useSetAdminUserActive = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: api.setAdminUserActive, onSuccess: () => client.invalidateQueries({ queryKey: ["admin", "users"] }) });
};
export const useSetSchemeActive = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: api.setSchemeActive, onSuccess: () => client.invalidateQueries({ queryKey: keys.adminSchemes }) });
};
export const useVendorReturns = () => useQuery({ queryKey: ["vendor", "returns"], queryFn: api.vendorReturns });
export const useCreateVendorReturn = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: api.createVendorReturn, onSuccess: () => client.invalidateQueries({ queryKey: ["vendor", "returns"] }) });
};
export const usePublicTransparency = () => useQuery({ queryKey: ["public", "transparency"], queryFn: api.publicTransparency });
export const usePublicStatus = (code: string) => useQuery({ queryKey: ["public", "status", code], queryFn: () => api.publicStatus(code), enabled: Boolean(code) });
export const usePublicVerify = (code: string) => useQuery({ queryKey: ["public", "verify", code], queryFn: () => api.publicVerify(code), enabled: Boolean(code) });
export const useAdminMlMetrics = () => useQuery({ queryKey: ["admin", "ml", "metrics"], queryFn: api.adminMlMetrics });
export const useCreateBatch = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ schoolId, qty }: { schoolId: number; qty: number }) => api.createBatch(schoolId, qty),
    onSuccess: () => client.invalidateQueries({ queryKey: ["vendor", "batches"] }) });
};
export const useDispatchBatch = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ id, gps }: { id: number; gps: { lat: number; lng: number } }) => api.dispatchBatch(id, gps),
    onSuccess: () => client.invalidateQueries({ queryKey: ["vendor", "batches"] }) });
};
export const useUpdateBatchGps = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, gps }: { id: number; gps: { lat: number; lng: number } }) => api.updateBatchGps(id, gps),
    onSuccess: (_result, variables) => client.invalidateQueries({ queryKey: ["vendor", "batches", variables.id, "tracking"] }),
  });
};
export const useReceiveBatch = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ id, input }: { id: number; input: Record<string, unknown> }) => api.receiveBatch(id, input),
    onSuccess: () => client.invalidateQueries({ queryKey: ["vendor", "batches"] }) });
};
export const useFraudFlag = (id: number) => useQuery({ queryKey: ["fraud", "flags", id], queryFn: () => api.fraudFlag(id), enabled: Number.isFinite(id) });
export const useUpdateFraudFlag = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ id, status }: { id: number; status: string }) => api.updateFraudFlag(id, status),
    onSuccess: () => client.invalidateQueries({ queryKey: keys.fraud }) });
};
export const useRescanFraud = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: api.rescanFraud,
    onSuccess: () => client.invalidateQueries({ queryKey: keys.fraud }) });
};
export const useChat = () => useMutation({ mutationFn: ({ message, lang }: { message: string; lang: Lang }) => api.chat(message, lang) });
export const useDemoPromote = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: api.promote, onSuccess: () => client.invalidateQueries() });
};
