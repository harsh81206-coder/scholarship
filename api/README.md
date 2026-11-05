# Vidya Pragati Setu API

Offline-first FastAPI + SQLModel + SQLite backend for the Gujarat scholarship demo. The canonical app lives in `api/`; the previous prototype is retained under `_archive/backend/` and is not used by Compose.

## Run locally

```bash
cd api
python3 -m pip install -r requirements.txt
make seed
make run
```

Interactive OpenAPI docs: <http://localhost:8000/api/docs>. The demo OTP is `123456` when `ADAPTER_MODE=mock`.

## Demo identities

| Role | Identifier | Scope |
|---|---|---|
| Student | `GJ-AND-2026-004512` | Riya Patel's records |
| School | `SCH-AND-001` | Shree Sardar Patel High School |
| Taluka | `TPEO-BOR-001` | Borsad |
| DEO | `DEO-AND-001` | Anand district |
| Admin | `ADMIN-STATE-001` | State |
| Vendor | `VND-001` | Vendor batches |

## API route inventory

The source of truth is [`openapi.json`](openapi.json); this list covers every registered non-health path in that schema.

| Area | Routes |
|---|---|
| Auth | `POST /auth/otp/send`, `POST /auth/otp/verify`, `GET /auth/me` |
| Student | `GET /students/me`, `/students/me/schemes`, `/students/me/payments`, `/students/me/cycle`, `/students/me/consents`; `PUT /students/me/consents`; `POST /students/me/data-export` |
| Applications | `POST /applications/bulk`, `GET /applications`, `GET /applications/{app_code}`, `GET /applications/{app_code}/timeline`, `POST /applications/{app_code}/approve|reject|request-correction|renewal-consent`, `POST /applications/bulk-approve` |
| Eligibility and AI | `GET /eligibility/explain/{scheme_code}`, `POST /eligibility/test`, `GET /ai/explain/{scheme_code}`, `POST /ai/chat` |
| Documents | `POST/GET /documents`, `GET/DELETE /documents/{doc_id}`, `POST /documents/{doc_id}/verify`, `POST /documents/fetch-digilocker` |
| DBT | `POST /dbt/sanction`, `/dbt/initiate`, `/dbt/{txn_id}/retry`; `GET /dbt/transactions`, `/dbt/failed`, `/dbt/receipt/{txn_id}`, `/dbt/reconciliation` |
| Grievances and notifications | `POST/GET /grievances`, `GET /grievances/me`, `GET/PATCH /grievances/{grv_code}`, `POST /grievances/{grv_code}/messages`; `GET /notifications`, `POST /notifications/read-all`, `PATCH /notifications/{notif_id}/read` |
| Analytics and records | `GET /analytics/school`, `/analytics/school/reports`, `/analytics/district`, `/analytics/state`, `/analytics/fraud`, `/analytics/dropout`; `POST /records/{record_type}/upload|confirm` |
| Logistics and vendor | `GET/POST /vendor/batches`, `POST /batches/{batch_id}/dispatch|gps|receive`, `POST /handover/initiate|confirm`, `GET /cycles/overview` |
| DEO and ML | `GET /ml/dropout/students`, `/ml/dropout/students/{cts_id}`, `/ml/forecast/cycles`, `/ml/forecast/budget`; `POST /delegations`, `GET /delegations/me` |
| Admin and fraud | `GET/POST /admin/schemes`, `PUT /admin/schemes/{scheme_id}/rules`, `GET/PUT /admin/settings`, `GET /funds/overview`, `GET /audit/logs`, `/audit/verify-chain`, `GET /fraud/flags`, `/fraud/flags/{id}`, `PATCH /fraud/flags/{id}`, `POST /fraud/rescan` |
| Demo controls | `POST /demo/reset`, `/demo/promote/{cts_id}`, `/demo/simulate-attendance`, `/demo/simulate-dbt` |

## ML and fallbacks

- `ml_train/` trains a LogisticRegression pipeline for dropout risk, IsolationForest for anomaly scoring, and a linear demand forecast from deterministic synthetic data. Trained artifacts are loaded lazily through `app/ml/registry.py`.
- Dropout uses a rule score when its artifact is absent or errors. Fraud rule scans remain active without the IsolationForest; the model adds an anomaly contribution when loaded. Forecast routes use fixed uptake/statistical estimates if the forecast artifact is absent.
- `make train` writes the three joblib artifacts and `artifacts/metrics.json`. These metrics describe synthetic data, not real-world performance.
- OCR and assistant responses are deterministic mock/template implementations today; there are not yet complete adapter interfaces for every external provider listed in `api/AGENTS.md`.

## Commands

```bash
make seed
make seed-reset
make train
make test
make lint
make check-contract
make openapi
```

`make check-contract` verifies 33 screen codes have corresponding frontend route files and that their declared API paths exist in OpenAPI. It does not execute every endpoint or validate runtime response schemas. See [`docs/api-contract.md`](docs/api-contract.md) and [`docs/STATUS.md`](../docs/STATUS.md).

## Current boundary

The typed client, resource functions, and TanStack Query hooks live under `web/lib/api/`. P2/P3 use the API for OTP; the other screen components still use local Zustand/demo fixtures and do not call those hooks. Docker Compose therefore defaults to `NEXT_PUBLIC_USE_MOCK=true`; end-to-end UI/API wiring remains unfinished. See [`docs/STATUS.md`](../docs/STATUS.md).
