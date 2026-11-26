# Vidya Pragati Setu route status

Updated: 2026-11-26. Inventory is generated from the checked-in Next.js page files. “API-linked” means the page issues at least one request through the shared API hooks or client; it does not mean every card or interaction on a mixed fixture page is live.

| # | Screen | Route | Role | API-linked | Hook/client evidence | Mapped API paths |
|---:|---|---|---|---|---|---|
| 1 | A5 | `/admin/audit` | admin | Yes | useAuditLogs, useVerifyAuditChain | /audit/logs?page=1&size=50, /audit/verify-chain |
| 2 | A4 | `/admin/fraud` | admin | Yes | useFraudFlags, useRescanFraud | /fraud/flags?page=1&size=50, /fraud/rescan |
| 3 | A3 | `/admin/funds` | admin | Yes | useApplications, useDbt, useFundsOverview, useDbtReconciliation, useSanctionDbt, useInitiateDbt, useRetryDbt | /applications?page=1&size=50, /dbt/initiate, /dbt/reconciliation, /dbt/sanction, /dbt/transactions?page=1&size=50, /dbt/{txn_id}/retry, /funds/overview |
| 4 | /admin/ml | `/admin/ml` | admin | Yes | useAdminMlMetrics | /admin/ml/metrics |
| 5 | A1 | `/admin` | admin | Yes | useAnalytics | /analytics/state |
| 6 | /admin/ranking | `/admin/ranking` | admin | Yes | useStateRanking | /analytics/state/ranking |
| 7 | A2 | `/admin/schemes/builder` | admin | Yes | useAdminSchemes, useCreateAdminScheme, useUpdateSchemeRules | /admin/schemes, /admin/schemes/{scheme_id}/rules |
| 8 | /admin/schemes | `/admin/schemes` | admin | Yes | useAdminSchemes, useSetSchemeActive | /admin/schemes, /admin/schemes/{scheme_id}/active |
| 9 | /admin/settings | `/admin/settings` | admin | Yes | useAdminSettings, useUpdateAdminSettings | /admin/settings |
| 10 | /admin/users | `/admin/users` | admin | Yes | useAdminUsers, useSetAdminUserActive | /admin/users, /admin/users/{user_id} |
| 11 | X1 | `/demo/simulate` | demo | Yes | useDemoPromote | /demo/promote/{cts_id} |
| 12 | /deo/applications | `/deo/applications` | deo | Yes | useApplications | /applications?page=1&size=50 |
| 13 | D2 | `/deo/approvals` | deo | Yes | useApplications, useBulkApprove, useDelegations, useCreateDelegation | /applications/bulk-approve, /applications?page=1&size=50, /delegations, /delegations/me |
| 14 | D4 | `/deo/at-risk` | deo | Yes | useDropout | /ml/dropout/students?page=1&size=50 |
| 15 | D3 | `/deo/cycles` | deo | Yes | useCycleOverview, useCycleForecast | /cycles/overview, /ml/forecast/cycles |
| 16 | /deo/delegations | `/deo/delegations` | deo | Yes | useDelegations, useCreateDelegation | /delegations, /delegations/me |
| 17 | D5 | `/deo/grievances` | deo | Yes | useGrievances, useUpdateGrievance | /grievances?page=1&size=50, GET/PATCH /grievances/{grv_code} |
| 18 | D1 | `/deo` | deo | Yes | useAnalytics | /analytics/district |
| 19 | /deo/schools | `/deo/schools` | deo | Yes | useDistrictSchools | /analytics/district/schools |
| 20 | /design-system | `/design-system` | public | No | — | — |
| 21 | /help | `/help` | public | Yes | usePublicStatus | /public/status/{application_code} |
| 22 | P2 | `/login` | public | Yes | sendOtp | /auth/otp/send |
| 23 | P3 | `/login/verify` | public | Yes | sendOtp, verifyOtp | /auth/otp/send, /auth/otp/verify |
| 24 | P1 | `/` | public | Yes | usePublicTransparency | /public/transparency |
| 25 | /privacy | `/privacy` | public | No | — | — |
| 26 | SC5 | `/school/cycles` | school | Yes | useCycleOverview, useHandover, useReceiveBatch | /batches/{batch_id}/receive, /cycles/overview, /handover/confirm, /handover/initiate |
| 27 | /school/grievances | `/school/grievances` | school | Yes | useGrievances | /grievances?page=1&size=50 |
| 28 | /school/handover-register | `/school/handover-register` | school | Yes | useHandovers | /handovers |
| 29 | SC1 | `/school` | school | Yes | useAnalytics | /analytics/school |
| 30 | SC3 | `/school/queue/[id]` | school | Yes | useApplication, useApprove, useReject, useRequestCorrection | /applications/{app_code}, /applications/{app_code}/approve, /applications/{app_code}/reject, /applications/{app_code}/request-correction |
| 31 | SC2 | `/school/queue` | school | Yes | useApplications, useApprove, useBulkApprove | /applications/bulk-approve, /applications/{app_code}/approve, /applications?page=1&size=50 |
| 32 | SC4 | `/school/records` | school | Yes | useUploadRecords, useConfirmRecords | /records/{record_type}/confirm, /records/{record_type}/upload |
| 33 | SC6 | `/school/reports` | school | Yes | useSchoolReports | /analytics/school/reports?type={type} |
| 34 | /school/students/[id] | `/school/students/[id]` | school | Yes | useSchoolStudent | /school/students/{cts_id} |
| 35 | /school/students | `/school/students` | school | Yes | useSchoolStudents | /school/students |
| 36 | /student/applications/[id] | `/student/applications/[id]` | student | Yes | useApplicationTimeline, useApplication | /applications/{app_code}, /applications/{app_code}/timeline, /applications/{app_code}/ack.pdf |
| 37 | S6 | `/student/applications` | student | Yes | useMe, useApplications, useApplicationTimeline | /applications/{app_code}/timeline, /applications?page=1&size=50, /students/me |
| 38 | S5 | `/student/apply` | student | Yes | useMe, useMySchemes, useApplications, useSendGuardianOtp, useBulkApply | /applications/bulk, /applications/guardian-otp/send, /applications?page=1&size=50, /students/me, /students/me/schemes |
| 39 | S12 | `/student/assistant` | student | Yes | useChat | /ai/chat |
| 40 | /student/bank | `/student/bank` | student | Yes | useMyBank, useAddBank, useVerifyBank | /students/me/bank, /students/me/bank/verify |
| 41 | S7 | `/student/cycle` | student | Yes | useMe, useMyCycle, useNotifications | /notifications, /students/me, /students/me/cycle |
| 42 | S9 | `/student/grievances` | student | Yes | useGrievances, useCreateGrievance | /grievances |
| 43 | /student/id-card | `/student/id-card` | student | Yes | useMe | /students/me, /students/me/id-card.pdf |
| 44 | S10 | `/student/notifications` | student | Yes | useNotifications, useReadAllNotifications, useReadNotification | /notifications, /notifications/read-all, /notifications/{id}/read |
| 45 | S1 | `/student` | student | Yes | useMe, useMySchemes, useApplications, useMyCycle, useNotifications | /applications?page=1&size=50, /notifications, /students/me, /students/me/cycle, /students/me/schemes |
| 46 | S8 | `/student/payments` | student | Yes | useMe, usePayments, useReceipt | /dbt/receipt/{txn_id}, /students/me, /students/me/payments |
| 47 | S11 | `/student/profile` | student | Yes | useMe, useConsents, useUpdateConsents, useExportData | /students/me, /students/me/consents, /students/me/data-export |
| 48 | S2 | `/student/schemes/[id]` | student | Yes | useMe, useMySchemes, useExplain | /students/me/schemes, /eligibility/explain/{scheme_code}, /ai/explain/{scheme_code} |
| 49 | /student/schemes/list | `/student/schemes/list` | student | Yes | useMySchemes | /students/me/schemes |
| 50 | S3 | `/student/vault` | student | Yes | useDocuments, useFetchDigiLocker | /documents, /documents/{doc_id}/download, /documents/fetch-digilocker, DELETE /documents/{doc_id} |
| 51 | S4 | `/student/vault/upload` | student | Yes | useMe, useDocuments, useUploadDocument | /documents, /students/me |
| 52 | /tpeo/approvals | `/tpeo/approvals` | taluka | Yes | useApplications, useApprove, useReject | /applications/{app_code}/approve, /applications/{app_code}/reject, /applications?page=1&size=50 |
| 53 | /tpeo | `/tpeo` | taluka | Yes | useAnalytics | /analytics/taluka |
| 54 | /tpeo/reports | `/tpeo/reports` | taluka | Yes | useTalukaReports | /analytics/taluka/reports |
| 55 | /tpeo/schools | `/tpeo/schools` | taluka | Yes | useTalukaSchools | /analytics/taluka/schools |
| 56 | /transparency | `/transparency` | public | Yes | usePublicTransparency | /public/transparency, /public/transparency.csv |
| 57 | /vendor/challan | `/vendor/challan` | vendor | Yes | useVendorBatches, useBatchTracking | /vendor/batches, /vendor/batches/{batch_id}/track |
| 58 | /vendor/orders | `/vendor/orders` | vendor | Yes | useVendorOrders, useUpdateVendorOrder | /vendor/orders, /vendor/orders/{order_id}/{action} |
| 59 | V1 | `/vendor` | vendor | Yes | useVendorBatches, useCreateBatch, useDispatchBatch | /batches/{batch_id}/dispatch, /vendor/batches |
| 60 | /vendor/payments | `/vendor/payments` | vendor | Yes | useVendorOrders, useVendorInvoices, useCreateVendorInvoice | /vendor/invoices, /vendor/orders |
| 61 | /vendor/qr | `/vendor/qr` | vendor | Yes | useVendorBatches, useBatchQr | /vendor/batches, /vendor/batches/{batch_id}/qr |
| 62 | /vendor/returns | `/vendor/returns` | vendor | Yes | useVendorReturns, useCreateVendorReturn | /vendor/returns |
| 63 | /vendor/tracking | `/vendor/tracking` | vendor | Yes | useVendorBatches, useBatchTracking, useUpdateBatchGps | /batches/{batch_id}/gps, /vendor/batches, /vendor/batches/{batch_id}/track |
| 64 | /verify/[code] | `/verify/[code]` | public | Yes | usePublicVerify | /public/verify/{code} |

## Coverage snapshot

- 64/64 route files exist.
- 62/64 pages issue at least one API request; `/privacy` and `/design-system` remain intentionally static.
- The browser sweep checks each route loads, and the contract runner checks the original screen groups plus registered expansion endpoints. Neither proves every fixture-backed widget is sourced from the API.
- See [`qa/report.md`](../qa/report.md) for the latest screenshot sweep and the remaining Stitch comparison gaps.
- “API-linked” describes data access only; it does not certify every button, download, state transition, language variant, or visual match.
