# Vidya Pragati Setu screen status

Updated: 2026-11-26. **API-wired** means that the route uses the API hooks when `NEXT_PUBLIC_USE_MOCK=false`; a registered backend endpoint by itself does not count. **Browser flow** means the page's main API interaction was exercised, not just that the route rendered.

| Code | Route | Tier | API-wired | Browser flow | Notes |
|---|---|---:|---|---|---|
| P1 | `/` | 3 | No | Route load | Static public landing page. |
| P2 | `/login` | 1 | Yes | OTP login | Sends login OTP through `POST /auth/otp/send`. |
| P3 | `/login/verify` | 1 | Yes | OTP login | Verifies through `POST /auth/otp/verify`; stores API-issued session. |
| S1 | `/student` | 1 | Yes | Golden path | `useMe`, `useMySchemes`, `useApplications`, `useNotifications`, `useMyCycle`. |
| S2 | `/student/schemes/[id]` | 1 | Yes | Golden path | Scheme data and eligibility explanation from API. |
| S3 | `/student/vault` | 3 | No | Route load | Fixture screen; upload endpoint is exercised from S4. |
| S4 | `/student/vault/upload` | 1 | Yes | Golden path | Multipart document upload and mock OCR response. |
| S5 | `/student/apply` | 1 | Yes | Golden path | Consent, guardian OTP send/TTL, and bulk application. |
| S6 | `/student/applications` | 1 | Yes | Golden path | Student-scoped applications and timeline. |
| S7 | `/student/cycle` | 1 | Yes | Golden path | `useMyCycle` displays delivered state; handover mutation is performed by SC5. |
| S8 | `/student/payments` | 1 | Yes | Golden path | Student-scoped payment rows; demo E2E completes mock DBT through simulator endpoint. |
| S9 | `/student/grievances` | 3 | No | Route load | Fixture screen. |
| S10 | `/student/notifications` | 1 | Yes | Golden path | Student notifications and read/read-all mutations. |
| S11 | `/student/profile` | 3 | No | Route load | Fixture screen. |
| S12 | `/student/assistant` | 3 | No | Route load | Fixture screen. |
| SC1 | `/school` | 2 | No | Route load | Fixture dashboard; analytics endpoint exists but this screen is not wired. |
| SC2 | `/school/queue` | 1 | Yes | Golden path | School-scoped applications and approval actions. |
| SC3 | `/school/queue/[id]` | 1 | Yes | Golden path | Application review and school approval mutation. |
| SC4 | `/school/records` | 3 | No | Route load | Fixture screen; record upload endpoints exist. |
| SC5 | `/school/cycles` | 1 | Yes | Golden path | Batch receipt and QR/serial plus OTP handover. |
| SC6 | `/school/reports` | 3 | No | Route load | Fixture screen; analytics report endpoint is partial/not wired. |
| D1 | `/deo` | 2 | No | Route load | Fixture dashboard; analytics endpoint exists but this screen is not wired. |
| D2 | `/deo/approvals` | 1 | Yes | Golden path | DEO route-scoped approval tabs, bulk approval, and delegation list/actions. |
| D3 | `/deo/cycles` | 2 | No | Route load | Fixture screen; cycle overview endpoint exists but this screen is not wired. |
| D4 | `/deo/at-risk` | 2 | No | Route load | Fixture screen; dropout endpoint exists but this screen is not wired. |
| D5 | `/deo/grievances` | 3 | No | Route load | Fixture screen. |
| A1 | `/admin` | 2 | No | Route load | Fixture dashboard; analytics and forecast endpoints exist but this screen is not wired. |
| A2 | `/admin/schemes/builder` | 2 | No | Route load | Fixture screen; scheme/rule endpoints exist but this screen is not wired. |
| A3 | `/admin/funds` | 1 | Yes | Golden path | Funds, DBT reconciliation, sanction, initiate and retry hooks. |
| A4 | `/admin/fraud` | 2 | No | Route load | Fixture screen; fraud endpoint exists but this screen is not wired. |
| A5 | `/admin/audit` | 2 | No | Route load | Fixture screen; audit and chain verification endpoints exist but this screen is not wired. |
| V1 | `/vendor` | 1 | Yes | Golden path | Vendor batches, batch creation, returned serial labels and dispatch. |
| X1 | `/demo/simulate` | 1 | Partial | Golden path | Promotion and eligibility diff only. Attendance/DBT simulation and reset controls are not present in this UI. |

## Coverage summary

- The current deterministic seed has 1 Anand district, 8 talukas, 40 schools, 1,500 students, 9,000 academic records, 2,200 applications, 900 DBT transactions, and 400 cycles. Exact counts, stage split, cast identities, and verification commands are in [`SEED_DATA.md`](SEED_DATA.md).

- 33/33 routes were captured by the route screenshot sweep; this verifies rendering and basic browser health, not that every screen's controls work.
- 17 Tier 1 routes are API-wired (P2, P3, S1, S2, S4, S5, S6, S7, S8, S10, SC2, SC3, SC5, D2, A3, V1, X1). X1 is partial as described above.
- 16 additional routes remain fixture-backed or static (P1, S3, S9, S11, S12, SC1, SC4, SC6, D1, D3, D4, D5, A1, A2, A4, A5).
- The contract checker made 80 endpoint calls across six seeded roles. This is API contract coverage; it does not mean all 33 screens are API-wired or that every response is runtime-validated with Zod.
- The three-run Playwright golden path exercised P2/P3, S1, S2, S4, S5, S6, SC2, SC3, D2, V1, SC5, S7, A3, S8, X1, and S10.

## Remaining scope

Tier 2 dashboards and Tier 3 screens are intentionally still fixture-backed. There is no runtime Zod response parsing across all API hooks. Visual comparison against all 33 Stitch references remains incomplete; see [`qa/report.md`](../qa/report.md).
