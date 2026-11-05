# Vidya Pragati Setu demo script

## Current demo boundary

This is a three-minute **visual walkthrough** of the 33-screen prototype. P2/P3 login and the demo role switcher use the FastAPI OTP endpoints when `NEXT_PUBLIC_USE_MOCK=false`. The remaining screens still display local fixture/Zustand data; their approval, upload, handover, payment, and simulation actions do not persist through the API yet. Treat the workflow below as a UI walkthrough, not a live scholarship transaction.

## Three-minute walkthrough

1. **0:00–0:25 — Student login.** Open `/login`, enter CTS ID `GJ-AND-2026-004512`, DOB `2009-08-15`, mobile `9876543210`, accept consent, and send OTP. Enter `123456`. Expected: the student dashboard opens with Riya Patel's Anand profile. With the online command, OTP is sent/verified against the API; in offline mode, the mock adapter accepts the same code.
2. **0:25–0:45 — Eligibility.** Open the Namo Lakshmi card and show its eligibility explanation and required-document panel. Expected: the scheme detail screen renders in the selected language. The panel is fixture data today; it does not call the eligibility or AI explanation endpoints.
3. **0:45–1:05 — Document review.** Open Document Vault, then Upload. Show the income certificate/OCR review panel. Expected: the OCR review design and its confidence/authenticity fields are visible. The page does not submit a real multipart upload yet.
4. **1:05–1:25 — Application.** Open One-click Apply and show consent/stacking information. Expected: the local confirmation state appears after submission. No application is created in the backend from this screen.
5. **1:25–1:50 — School review.** Use the floating Demo Role Switcher to select School. Open Verification Queue and the Riya review detail. Show the checklist/authenticity panel and the approve action. Expected: the local review state changes; it is not an API approval.
6. **1:50–2:10 — Cycle handover.** Open Cycle Distribution on the school mobile screen. Show batch receive, QR/OTP handover, and receipt panels. Expected: the interaction is a local UI simulation; it does not change backend logistics records.
7. **2:10–2:30 — Student outcome.** Switch to Student and open Cycle, Applications, and Payments. Expected: the screens display their seeded visual states. They are not populated from the online backend yet.
8. **2:30–2:50 — State view.** Switch to Admin and open State Analytics, then Audit Logs. Expected: the dashboard and audit layout render. The UI does not query analytics or verify the backend hash chain.
9. **2:50–3:00 — Year simulation.** Switch to Demo Controller and open `/demo/simulate`. Show the promote/attendance/DBT controls. Avoid presenting the displayed diff as a live backend result; those controls remain local.

## If something breaks

- For a demo on a machine where ports 8000 and 3000 are free, run `make demo`. It prints the local web/API URLs and the demo identifiers.
- To use alternate ports, run `VPS_API_PORT=8101 VPS_WEB_PORT=3101 make demo`, then open `http://localhost:3101`.
- Offline fallback: run `make demo-offline`, then in another terminal run `cd web && npm run start -- --hostname 127.0.0.1 --port 3000`. This serves the production build compiled with `NEXT_PUBLIC_USE_MOCK=true`; no API server is needed for the fixture-driven UI.
- If login fails, confirm the selected mode, use OTP `123456`, and restart the API to clear its in-memory OTP cooldown. Use the same hostname (`localhost`) for the browser and its cookies.
- If a route is unavailable, use the 33 captured route images under [`../qa/screens/`](../qa/screens/) for the visual presentation. They are screenshots, not an interactive substitute.

## Verified startup evidence

`VPS_API_PORT=8101 VPS_WEB_PORT=3101 make demo` started successfully in this workspace. `GET http://127.0.0.1:8101/health` returned `{"status":"ok","version":"2.0.0","adapter_mode":"mock"}` and `http://localhost:3101/` returned HTTP 200. The command was stopped after the smoke check.
