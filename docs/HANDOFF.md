# Workstream Handoff Notes

Cross-workstream change requests go here. Each entry has: requester, owner, description, status.

| # | From | To | Request | Status |
|---|---|---|---|---|
| WS1-1 | WS1 student UI | WS3 backend | Expose numeric DBT transaction `id`, `application_id`, and `app_code` in student payment rows so S8 can call `/dbt/receipt/{txn_id}` and display its application. `/dbt/transactions` also includes these IDs and `batch_ref`. | Resolved in API; UI can use `id` for receipt download |
| WS1-2 | WS1 student UI | WS3 backend | S5 guardian verification contract: call `POST /applications/guardian-otp/send`, then submit `guardian_otp` with `scheme_codes` and `consent` to `POST /applications/bulk`. The code is one-time and expires after the OTP TTL. | Resolved in mock mode; non-mock returns 503 until an SMS adapter is configured |
| WS3-1 | WS3 backend | WS1/WS2 | `/cycles/overview` now includes school-scoped `receivable_cycles` and `handover_students` (`id`, CTS ID, name, grade); `batches` and delivered counts are role-scoped. Use those fields for SC5 scan/manual serial and student selection. | Resolved in API |
| WS3-2 | WS3 backend | Demo QA | Set `AUTO_AUDIT_SAMPLE_PCT=100` and `RISK_AUTO_THRESHOLD=1.0` only in the disposable QA database to deterministically exercise school → DEO. Seed/default setting stays 5%. Set `PFMS_MOCK_SUCCESS_RATE=1.0` only in QA API process to make credited-payment screenshots deterministic; default remains 0.95. | Available as test-only overrides |

## Not yet production-ready

- OTP codes and resend cooldowns are held in process memory. The demo is single-process; a multi-worker deployment needs a shared, expiring OTP store.
- Guardian SMS delivery is not integrated. Mock mode exposes `demo_otp`; non-mock mode fails closed with HTTP 503 until the SMS adapter is configured.
- PFMS remains a mock adapter. Its mock success rate is controlled by `PFMS_MOCK_SUCCESS_RATE` (default `0.95`); setting `1.0` is for isolated test runs only.
