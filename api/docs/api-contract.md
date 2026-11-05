# API contract coverage

This document maps the 33 frontend screen groups to the FastAPI routes that back them. OpenAPI is exported in [`openapi.json`](../openapi.json). Run `make check-contract` from `api/` to verify every mapped path is registered and that health/OpenAPI respond.

| Screen group | Routes |
|---|---|
| P2/P3 | `POST /auth/otp/send`, `POST /auth/otp/verify` |
| S1 | `GET /students/me`, `GET /students/me/schemes`, `GET /applications`, `GET /notifications` |
| S2 | `GET /eligibility/explain/{scheme_code}`, `GET /ai/explain/{scheme_code}` |
| S3/S4 | `GET/POST /documents`, `GET /documents/{doc_id}`, `POST /documents/{doc_id}/verify`, `POST /documents/fetch-digilocker` |
| S5/S6 | `POST /applications/bulk`, `GET /applications`, `GET /applications/{app_code}/timeline`, `POST /applications/{app_code}/renewal-consent` |
| S7 | `GET /students/me/cycle`, `POST /handover/initiate`, `POST /handover/confirm` |
| S8 | `GET /students/me/payments`, `GET /dbt/receipt/{txn_id}` |
| S9/S10/S11/S12 | `/grievances*`, `/notifications*`, `/students/me/consents`, `/students/me/data-export`, `POST /ai/chat` |
| SC1/SC6 | `GET /analytics/school`, `GET /analytics/school/reports` |
| SC2/SC3 | `GET /applications`, `GET /applications/{app_code}`, approve/reject/correction actions |
| SC4/SC5 | `/records/{record_type}/upload|confirm`, `/batches/{batch_id}/receive`, `/handover/*` |
| D1/D2/D3/D4/D5 | `/analytics/district`, `/applications/bulk-approve`, `/delegations*`, `/cycles/overview`, `/ml/dropout/*`, `/ml/forecast/cycles`, `/grievances*` |
| A1/A2/A3/A4/A5 | `/analytics/state`, `/admin/schemes*`, `/eligibility/test`, `/funds/overview`, `/ml/forecast/budget`, `/dbt/reconciliation`, `/fraud/*`, `/audit/*` |
| V1/X1 | `/vendor/batches*`, `/batches/{batch_id}/dispatch|gps`, `/demo/*` |

## Runtime notes

- All external integrations currently use deterministic local behavior; no SMS, PFMS, OCR, or LLM network credentials are required.
- The typed client, resource functions, and hooks live under `web/lib/api/`; P2/P3 use the real OTP routes, but other screen components still use local Zustand demo state. Docker Compose runs mock mode so its existing UI remains offline-capable.
- The API is served at port 8000 and its interactive docs are at `/api/docs`.
- The route checker verifies route-file/path registration plus health/OpenAPI smoke responses. It does not invoke every endpoint, validate response schemas, or prove page-level wiring. Role-level behavior is partly covered by backend tests.
