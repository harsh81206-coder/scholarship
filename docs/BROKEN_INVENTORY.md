# Demo navigation and dead-control inventory — 2026-11-26

## Scope and method

This inventory combines (1) the role navigation configuration, (2) source inspection of page handlers and their API hooks, and (3) live Playwright reproduction of the core controls described in [`ISSUES.md`](ISSUES.md). A fresh authenticated Playwright screenshot sweep just completed for all 33 Stitch routes with 33/33 captures, HTTP/page errors 0, API errors 0, broken images 0, and document-level overflow 0. “Source checked” means the handler was traced in code; it does not mean every control was clicked in a browser. This distinction is deliberate.

## Navigation routes

| Role | Navigation route | Status observed / source checked |
|---|---|---|
| Public | `/` | Renders; static landing page. |
| Public | `/login` | OTP send flow is API-backed. |
| Public | `/login/verify` | OTP verification is API-backed. |
| Student | `/student` | API-backed dashboard. |
| Student | `/student/schemes/list` | Placeholder; `/student/schemes` itself is 404. |
| Student | `/student/apply` | API-backed bulk application flow. |
| Student | `/student/applications` | API-backed tracker; diverse stages in live seed. |
| Student | `/student/profile` | Fixture-backed screen. |
| School | `/school` | Fixture dashboard; controls are local/transient. |
| School | `/school/queue` | API-backed queue with filtering and bulk/quick approve controls. |
| School | `/school/records` | Fixture rows and local edits; no records API mutation. |
| School | `/school/cycles` | API-backed receive and handover flow. |
| School | `/school/reports` | Phase 3 placeholder. |
| School | `/school/grievances` | Phase 3 placeholder. |
| DEO | `/deo` | Fixture dashboard; filters do not affect data; map button only shows a toast. |
| DEO | `/deo/approvals` | API-backed route-scoped selection, bulk approval and delegation. No per-row approve/reject/view actions. |
| DEO | `/deo/cycles` | Static SVG map and fixture pins. |
| DEO | `/deo/at-risk` | Fixture-backed page; filters/actions affect local presentation only. |
| DEO | `/deo/grievances` | Fixture-backed page; no API workflow confirmed. |
| DEO | `/deo/schools` | Phase 3 placeholder. |
| Admin | `/admin` | Fixture dashboard; year/scheme selectors are inert; export/sync are transient UI only. |
| Admin | `/admin/schemes/builder` | Fixture-backed rule builder. |
| Admin | `/admin/funds` | API-backed funds and DBT controls. |
| Admin | `/admin/fraud` | Fixture-backed fraud panel. |
| Admin | `/admin/audit` | Fixture-backed audit panel; verify/export handlers are local. |
| Admin | `/admin/ranking` | Phase 3 placeholder. |
| Vendor | `/vendor` | API-backed batch creation/dispatch. |
| Vendor | `/vendor/qr` | Phase 3 placeholder. |
| Vendor | `/vendor/tracking` | Phase 3 placeholder. |
| Vendor | `/vendor/challan` | Phase 3 placeholder. |
| TPEO | `/tpeo` | Route exists; fixture/local-state workflow. |
| TPEO | `/tpeo/approvals` | Route exists; fixture/local-state workflow. |
| TPEO | `/tpeo/schools` | Route exists; fixture/local-state workflow. |
| TPEO | `/tpeo/reports` | Route exists; fixture/local-state workflow. |
| Demo | `/demo/simulate` | Promotion and eligibility diff are API-backed; planned attendance/DBT/reset controls are absent. |

The navigation configuration is centralized in [`web/lib/nav.config.ts`](../web/lib/nav.config.ts). Shell-level Help/Support links point to the student assistant, which role guards redirect away for officer roles; this is a navigation mismatch to review.

## Controls with verified behavior or gaps

| Screen | Control | Observed behavior | Evidence / gap |
|---|---|---|---|
| Student Vault | Download on document card/detail | Toast claims success; browser download event does not fire. | Live Playwright reproduction; `handleDownloadMock` in `web/app/student/vault/page.tsx`. |
| Student Vault | Category/status/search filters | Local filtering of fixture documents; not API-backed. | Source checked in `web/app/student/vault/page.tsx`. |
| Student Vault | DigiLocker sync | Local mock handler; no external adapter result from this screen. | Source checked in `web/app/student/vault/page.tsx`. |
| Student upload | Choose file / confirm OCR | Multipart upload endpoint is called; OCR fields are fixed by document type, independent of file bytes. | Live flow and `api/app/routers/documents.py`. |
| Student tracker | Stage tabs and expand row | API rows are rendered; stage diversity was present in the live DB. | Live Playwright reproduction and `web/app/student/applications/page.tsx`. |
| School dashboard | Attendance sync / CSV export / bulk SMS | Handler updates transient UI/toast state; no corresponding workflow is called by the page. | Source checked in `web/app/school/page.tsx`. |
| School queue | Status filter / quick approve / bulk approve | Calls API-backed queue and approval mutations. | Source checked; main approval path covered in the prior golden-path run. |
| School records | Edit/upload controls | Mutate local React state; do not upload records or trigger eligibility re-evaluation. | Source checked in `web/app/school/records/page.tsx`. |
| DEO dashboard | Year/Scheme/Taluka filters | Selected state is not used to filter or refetch dashboard content. | Source checked in `web/app/deo/page.tsx`. |
| DEO dashboard | Open GIS Map | Shows a temporary toast; no map route or district map API is opened. | Live/source reproduction in `web/app/deo/page.tsx`. |
| DEO approvals | Select all / bulk approve / delegate | Uses API hooks and limits approval selection to DEO-routed cases. Live data had zero DEO-ready cases. | Source checked and prior golden-path API role run. |
| DEO at-risk | Risk filters / chart tabs / student actions | Filters and actions operate on page fixtures/local state. | Source checked in `web/app/deo/at-risk/page.tsx`. |
| Admin dashboard | Year/Scheme selectors | No value/onChange behavior; no filter or refetch. | Source checked in `web/app/admin/page.tsx`. |
| Admin dashboard | Export / CM sync | Only transient UI status; no downloadable export or API sync. | Source checked in `web/app/admin/page.tsx`. |
| Admin fraud | Status buttons / filters | Act on local fixture list, not fraud API resources. | Source checked in `web/app/admin/fraud/page.tsx`. |
| Admin audit | Verify chain / export CSV | Local fixture handler; audit endpoint is not called. | Source checked in `web/app/admin/audit/page.tsx`. |
| Vendor | Batch create / dispatch | API-backed on `/vendor`; related QR/tracking/challan menu links lead to placeholders. | Source checked; vendor golden-path was exercised previously. |
| Language switcher | Gujarati/English/Hindi | Shared language state changes; default is Gujarati, and mixed-language literals remain in several screens. | Source checked in `web/lib/store.ts`, `web/components/T.tsx`, and page fixtures. |

## Remaining verification

- Fresh browser click-through of every configured navigation item is pending, especially the extra TPEO routes and `/deo/schools` and `/admin/ranking`, which are outside the 33-screen screenshot list. The source inventory above lists all configured nav entries.
- A systematic click of every visible button, input, filter, pagination control, and modal action across all 33 screens remains pending. The core controls named in the fix plan have source-level behavior recorded above, and the Vault download and scheme route failures were reproduced live.
- Browser automation could not be used through Codex’s visible browser because Work settings disable local browser access. Headless Playwright is available and was used for the reproductions that succeeded.
- Do not interpret a visible toast or button state as proof of a backend mutation; confirm a network request and persisted state when implementing each workflow.
