# Five-minute Vidya Pragati Setu demo

This walkthrough uses the production Next.js server and FastAPI with mock external adapters. The UI and workflow data run against SQLite. PFMS, SMS, DigiLocker, CTS, and Aadhaar are simulated.

## Start clean

From the repository root:

```bash
make demo-reset
make demo
```

Open `http://localhost:3000`; API docs are at `http://localhost:8000/api/docs`. `make demo` serves the production Next build, not the Next development server. Mock login OTP is `123456`.

## Click path

### 1. Student login and dashboard — P2/P3 → S1 (30 seconds)

At `/login`, enter Riya's CTS ID `GJ-AND-2026-004512`, DOB `2009-08-15`, and mobile `9876543210`. Enter `123456` on the OTP screen.

**Expected:** S1 shows Riya's API profile, eligible schemes, applications, notifications, and cycle summary. Switch language once to confirm the header labels change.

### 2. Eligibility and OCR — S2 → S4 (45 seconds)

Open Namo Lakshmi from S1 and view the eligibility explanation. Then open `/student/vault/upload`, choose a PDF or image, review the extracted fields, and save.

**Expected:** S2 displays eligibility information from the API. S4 shows mock OCR fields for the uploaded file and confirms it was saved.

### 3. Guardian consent and application — S5 → S6 (45 seconds)

Open `/student/apply`, select an eligible scheme, check guardian consent, request the guardian OTP, and enter the code shown by the mock adapter. Submit and open `/student/applications`.

**Expected:** The new application code appears in the tracker with a live status/timeline. The seeded demo's normal risk settings keep the audit sample at 5%, so a newly submitted application may be auto-routed instead of appearing in the school queue. The deterministic browser E2E uses a disposable database with a 100% audit-sample override to exercise every review role; that test-only override is not applied by `make demo`.

### 4. School and DEO review — SC2/SC3 → D2 (60 seconds)

If the application route is `school`, switch to **School**, open `/school/queue`, open the application, and use **Approve & Forward**. Switch to **DEO**, open `/deo/approvals`, select the application in the DEO route tab, and approve it.

**Expected:** The same application advances from school verification to DEO approval and remains visible in Riya's tracker. If the application was auto-routed by the seeded 5% sampling rules, continue with the seeded data or run `make e2e` for the deterministic review walkthrough.

### 5. Bicycle logistics — V1 → SC5 → S7 (60 seconds)

Switch to **Vendor**, create a one-cycle batch for the seeded school, and dispatch it. Switch to **School**, open `/school/cycles`, receive the batch using the serial returned by V1, then initiate handover for Riya. Confirm using the mock OTP displayed by SC5. Open Riya's `/student/cycle` page.

**Expected:** The batch changes to received, the handover is confirmed, and S7 displays a delivered cycle. Handover OTP is generated for the session; it is not necessarily `123456`.

### 6. DBT and next-year renewal — A3 → S8 → X1 → S10 (60 seconds)

Switch to **State Admin** and open `/admin/funds`. Sanction an eligible DEO-approved application, then initiate DBT. Wait briefly and check Riya's `/student/payments`. Finish at `/demo/simulate`, promote Riya to the next grade, then check `/student/notifications`.

**Expected:** A3 shows a DBT transaction, S8 shows its current API status (credited after successful mock processing), X1 shows the eligibility diff, and S10 shows the promotion/renewal notice.

The DBT mock worker is asynchronous and can return a failure or still be processing during a manual walkthrough. The automated E2E makes completion deterministic by calling the mock-only DBT simulator endpoint after the A3 initiate action; X1 does not currently expose that simulator control.

## If something breaks

- **API or web does not start:** Check port availability (`8000` and `3000` by default), then retry with `VPS_API_PORT=8101 VPS_WEB_PORT=3101 make demo`.
- **Stale demo state:** Stop the running servers and run `make demo-reset`, then restart `make demo`.
- **No internet:** Stop the online server and run `make demo-offline`; the mock-only frontend starts at `http://localhost:3000` and does not need FastAPI.
- **OTP expired or locked:** Restart the API to clear in-memory OTP state, then request a new OTP. Mock login OTP remains `123456`.
- **Application misses the school review stage:** This follows the seeded 5% audit sampling behavior. Show the API-backed S1/S6 state, or use `make e2e` for the deterministic end-to-end review path.
- **DBT remains processing or fails:** Show the live status and explain that PFMS is simulated; the E2E uses a demo-only simulator for repeatable credited-state assertions.

## Demo identities

| Role | Identifier | Login OTP |
|---|---|---|
| Student (Riya Patel) | `GJ-AND-2026-004512` | `123456` |
| School Principal | `SCH-AND-001` | `123456` |
| Taluka Officer | `TPEO-BOR-001` | `123456` |
| District Education Officer | `DEO-AND-001` | `123456` |
| State Admin | `ADMIN-STATE-001` | `123456` |
| Cycle Vendor | `VND-001` | `123456` |
