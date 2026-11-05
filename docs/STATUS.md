# Vidya Pragati Setu screen status

Audit date: 2026-11-05. `API endpoints` are canonical paths listed in `api/openapi.json`. `API-wired` means the route component actually calls the API layer. P2/P3 now call real OTP endpoints; S1–X1 data and action screens still render their local fixture/Zustand state and do not call the shared query hooks. The hook layer exists, but it is not yet connected to those screens.

| Code | Route | API endpoints needed/registered | API-wired | Notes |
|---|---|---|---|---|
| P1 | `/` | None | No | Public landing content is static. |
| P2 | `/login` | `POST /auth/otp/send` | Yes | Sends OTP and stores the API resend cooldown. |
| P3 | `/login/verify` | `POST /auth/otp/verify` | Yes | Verifies OTP, stores JWT/role/scope, and redirects by role. Demo autofill is hidden outside frontend mock mode. |
| S1 | `/student` | `GET /students/me`, `/students/me/schemes`, `/applications`, `/notifications` | No | Dashboard reads demo values/store. |
| S2 | `/student/schemes/[id]` | `/students/me/schemes`, `/eligibility/explain/{scheme_code}`, `/ai/explain/{scheme_code}` | No | Dynamic page exists; no API calls. |
| S3 | `/student/vault` | `GET /documents`, `POST /documents/fetch-digilocker` | No | Vault is local page state. |
| S4 | `/student/vault/upload` | `POST /documents`, `GET /documents/{doc_id}` | No | Upload/OCR route exists; UI is not connected. |
| S5 | `/student/apply` | `POST /applications/bulk` | No | Consent/stacking are local. |
| S6 | `/student/applications` | `GET /applications`, `/applications/{app_code}/timeline`, `POST /applications/{app_code}/renewal-consent` | No | Tracker and renewal consent are not API-backed. |
| S7 | `/student/cycle` | `GET /students/me/cycle` | No | Student cycle status endpoint exists. |
| S8 | `/student/payments` | `/students/me/payments`, `/dbt/receipt/{txn_id}` | No | Receipt route returns JSON, not a downloadable PDF. |
| S9 | `/student/grievances` | `GET/POST /grievances`, `GET /grievances/me` | No | Rate/escalate routes are missing. |
| S10 | `/student/notifications` | `GET /notifications`, read/read-all routes | No | Notification screen uses local state. |
| S11 | `/student/profile` | `GET /students/me`, `/students/me/consents`, `/students/me/data-export` | No | Profile update/withdraw-consent routes are missing. |
| S12 | `/student/assistant` | `POST /ai/chat` | No | Chat UI is local. |
| SC1 | `/school` | `GET /analytics/school` | No | Dashboard uses fixture data. |
| SC2 | `/school/queue` | `GET /applications`, `/applications/bulk-approve` | No | Queue and actions not API-backed. |
| SC3 | `/school/queue/[id]` | `/applications/{app_code}`, approve/reject/correction | No | Review detail and authenticity panel are local. |
| SC4 | `/school/records` | `/records/{record_type}/upload`, `/confirm` | No | Upload/confirm endpoints exist; UI is unwired. |
| SC5 | `/school/cycles` | `/batches/{batch_id}/receive`, `/handover/*` | No | Receive and handover endpoints exist. |
| SC6 | `/school/reports` | `/analytics/school/reports` | No | Export endpoint formats are not implemented. |
| D1 | `/deo` | `GET /analytics/district` | No | Dashboard uses fixture data. |
| D2 | `/deo/approvals` | `/applications`, `/applications/bulk-approve`, `/delegations*` | No | Route-level approval checks need strengthening. |
| D3 | `/deo/cycles` | `/cycles/overview`, `/ml/forecast/cycles` | No | No map integration in page. |
| D4 | `/deo/at-risk` | `/ml/dropout/students*` | No | ML routes exist, assignment route is missing. |
| D5 | `/deo/grievances` | `/grievances*` | No | Grievance actions are only partially implemented. |
| A1 | `/admin` | `/analytics/state`, `/ml/forecast/budget` | No | Dashboard is not API-backed. |
| A2 | `/admin/schemes/builder` | `/admin/schemes*`, `/eligibility/test` | No | Builder UI is local. |
| A3 | `/admin/funds` | `/funds/overview`, `/dbt/reconciliation`, retry | No | Receipt/reconciliation is not fully wired. |
| A4 | `/admin/fraud` | `/fraud/flags*`, rescan | No | Block-payment route is missing. |
| A5 | `/admin/audit` | `/audit/logs`, `/audit/verify-chain` | No | Log screen is local. |
| V1 | `/vendor` | `/vendor/batches*`, dispatch/GPS | No | Label generation endpoint is missing. |
| X1 | `/demo/simulate` | `/demo/promote`, simulate-attendance/DBT/reset | No | Promote returns a renewal eligibility diff; controls remain local. |

## Findings

- The earlier checker had 27 **group keys**, not 27 of 33 individual screens. It did not inspect the frontend routes or invoke screen endpoints.
- All 33 target codes are represented above. P1 is intentionally static. P2/P3 use the API; the other 30 routes still need page-level API integration and loading/empty/error handling.
- `web/lib/api/types.ts` is generated from OpenAPI. `client.ts`, `resources.ts`, resource hooks, and shared state components exist, but the screens do not yet consume them. The contract checker tests route registration only.
- The project root has no `.git`; `web/` has an independent nested Git repository. API/docs changes cannot be committed as requested without restructuring repository history.
- `docker-compose.yml` uses `api/`; nothing outside legacy `backend/` imports the old package. It is archived at `_archive/backend/` to retain its old SQLite file without leaving a competing importable `backend/` folder.
- The 33 Playwright route captures are in `qa/screens/`; all returned HTTP 200 with no page errors or broken images at the prescribed viewport sizes. SC4 and A3 initially exceeded the desktop width; adding `min-w-0` to the officer content area removed the page-level overflow. SC5 now uses a shared mobile shell.
