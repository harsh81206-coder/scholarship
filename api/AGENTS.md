# Project: Vidya Pragati Setu backend (Gujarat scholarships, hackathon demo, must run offline)

Stack: Python 3.11, FastAPI, SQLModel + SQLite (Postgres-compatible, DATABASE_URL env), Pydantic v2, pydantic-settings, python-jose (JWT), passlib, APScheduler/BackgroundTasks, scikit-learn, pandas, numpy, joblib, shap (optional), Pillow, pytesseract (optional), anthropic SDK (optional), pytest, httpx.
Roles: student, school, taluka, deo, admin, vendor.
Frontend: Next.js app in /web, currently on mock store. Backend must match its screens (33) and flip with NEXT_PUBLIC_USE_MOCK=false.

Rules:
1. Every external dependency (OCR, LLM, SMS, PFMS, DigiLocker, CTS, Aadhaar) sits behind an adapter interface in app/adapters with a Mock implementation as default (ADAPTER_MODE=mock). Real adapters can be stubs that raise NotImplemented.
2. Offline first: no network call required for demo. LLM/OCR features must have deterministic fallbacks.
3. Never store raw Aadhaar: store salted SHA-256 hash + last4 only. Minors' data needs guardian consent flag (DPDP Act 2023).
4. Eligibility rules are data (JSON, versioned), never hardcoded if/else per scheme. Do not hardcode real income/marks cutoffs, seed placeholder values and make them editable.
5. Every state change writes an application_event and audit_log row, hash-chained (hash = sha256(prev_hash + payload)).
6. RBAC + scoping on every endpoint: school sees own students, taluka sees own taluka, deo sees own district, admin sees all.
7. Typed responses (Pydantic), consistent error format {code, message, details}, pagination {items,total,page,size}.
8. Small modules, clean minimal code, pytest for each module, ruff clean. After each phase: run tests, then summarise in 5 lines.

## Screen → Endpoint Map
P2/P3: /auth/otp/send, /auth/otp/verify
S1: /students/me, /students/me/schemes, /applications, /notifications
S2: /eligibility/explain, /ai/explain
S3/S4: /documents*
S5: /applications/bulk
S6: /applications/{id}/timeline
S7: /students/me/cycle
S8: /students/me/payments, /dbt/receipt
S9: /grievances*
S10: /notifications*
S11: /students/me*, /consents
S12: /ai/chat
SC1: /analytics/school
SC2: /applications?route=school
SC3: /applications/{id}, approve/reject/correct
SC4: /records/*/upload
SC5: /batches/{id}/receive, /handover/*
SC6: /analytics/school/reports
D1: /analytics/district
D2: /applications?route=taluka|deo, /applications/bulk-approve, /delegations
D3: /cycles/overview
D4: /ml/dropout/*
D5: /grievances*
A1: /analytics/state
A2: /admin/schemes*, /eligibility/test
A3: /funds/overview, /dbt/reconciliation
A4: /fraud/*
A5: /audit/logs, /audit/verify-chain
V1: /vendor/batches*
X1: /demo/promote, /demo/simulate-attendance, /demo/simulate-dbt, /demo/reset

## Demo Seed Identities
- Student: Riya Patel, CTS GJ-AND-2026-004512, Class 9-B, female, OBC
- School: Shree Sardar Patel High School, Anand
- Principal: Dr. Kalpesh Shah
- Mother: Hetalben Patel, SBI account last4 4521
- OTP: always 123456
