# Final status — Vidya Pragati Setu

Updated: 2026-11-26. This report separates API wiring, browser interaction coverage, route-only screenshots, and items that were not verified.

## Acceptance summary

| Work area | Status | Evidence / boundary |
|---|---|---|
| Golden Path frontend | Done for the 17 listed Tier 1 routes, with X1 partial | Real API hooks are used for login, student application, school/DEO review, vendor dispatch, school handover, student cycle/payments/notifications, admin DBT, and promotion. X1 currently exposes promotion only. |
| Cross-role database flow | Done for tested path | Playwright submits one student application and verifies the same row as school, DEO, vendor/school logistics, admin DBT, and student. |
| Backend regression | Done for current test suite | 77 tests passed, exceeding the plan's 70+ target; `ruff check app tests` is clean. |
| Contract check | Partial | `80` endpoint calls passed across six seeded roles. This is not a 33-page UI wiring check or full runtime Zod validation. |
| Browser E2E | Done for stated path | `make e2e` passed three consecutive runs against fresh temporary databases. E2E uses the mock DBT simulator endpoint for deterministic credit after initiating DBT. |
| Route and visual QA | Partial | 33/33 authenticated screenshots and browser health checks passed. Full Stitch pixel comparison and all-language layout review are still outstanding; focused manual review found fidelity gaps on dense officer screens. |
| Tier 2/3 wiring | Partial | These routes render but remain fixtures/static. See [`STATUS.md`](STATUS.md). |
| Production local demo | Done | `make demo` runs a production Next build and `next start` alongside FastAPI. Server URLs and current health are reported in the completion message. |
| Offline demo | Done | `make demo-offline` builds and serves the mock-only frontend without requiring the API. |
| Deployment / Docker | Partial | Deployment files are present. Docker is unavailable in this environment, so Compose validation and container startup are not verified. No hosted URL has been deployed or tested. |

## Evidence

Commands run from the repository root unless noted:

```text
make qa
```

Latest full output summary:

```text
Endpoint contract check: 80 calls passed across 6 seeded roles.
77 passed, 3 warnings in 1.48s
All checks passed!
openapi-typescript 7.13.0 generated lib/api/types.ts
✔ No ESLint warnings or errors
✓ Compiled successfully
✓ Generating static pages (47/47)
Playwright login: student OTP, /students/me, school role switch, scoped applications, and wrong-role redirect passed.
Screenshots: 33/33
HTTP/page errors: 0
```

This includes the OpenAPI contract calls, backend tests and Ruff, generated TypeScript, `tsc`, ESLint, optimized Next production build, OTP/role smoke, and all-route browser sweep. Screenshot QA starts a clean Next dev output against a temporary API port; it does not validate the production server session. The separate production build and the local `make demo` startup check cover the production bundle/server.

Production demo startup check:

```text
VPS_API_PORT=8000 VPS_WEB_PORT=3000 make demo
✓ Generating static pages (47/47)
✓ Ready in 123ms
curl http://127.0.0.1:3000/ → HTTP 200
curl http://127.0.0.1:8000/health → HTTP 200, {"status":"ok","version":"2.0.0","adapter_mode":"mock"}
```

Both servers are left running for the user at `http://localhost:3000` and `http://localhost:8000/api/docs`.

```text
make e2e
```

The command runs the browser Golden Path three times against a new disposable SQLite database each time. The tested path is login → S1 → S2 → S4 OCR upload → S5 guardian OTP/apply → S6 tracker → SC2/SC3 school approval → D2 DEO approval → V1 dispatch → SC5 receive/handover → S7 delivered → A3 DBT initiate → S8 credited → X1 promote → S10 notification.

The contract check currently reports `Endpoint contract check: 80 calls passed across 6 seeded roles.` It validates declared OpenAPI response schemas where available and checks explicit response keys for other handlers. It does not parse every screen response with Zod in the browser.

## Not verified

- Docker was not available (`command -v docker` returned no executable); `docker compose config` and container startup were not run.
- No Render/Vercel deployment was created, and there is no verified public demo URL.
- Full pixel-by-pixel comparison of all 33 Stitch references, every nested table/panel clipping check, and complete `gu`/`hi`/`en` switching on all Tier 1 and Tier 2 routes were not completed.
- Tier 2/3 screens remain fixture-backed; route screenshots prove rendering, not real data behavior.
- X1 has no UI controls for attendance simulation, forced DBT success/failure, or demo reset. These backend/demo endpoints are not part of the current click path.
- E2E forces mock DBT completion through the simulator API after the UI starts payment. It does not prove the asynchronous mock worker always completes before the user navigates, nor any external PFMS transfer.
- Full language, device, upload security, 300 ms dashboard latency, analytics cache expiry, all adapter failure cases, and VAPT were not exhaustively verified.

## Known limitations

- PFMS, Aadhaar/UIDAI, CTS, DigiLocker, SMS, and LLM integrations remain local mock adapters. No government provider is connected.
- Dropout, fraud, and forecast artifacts are trained on synthetic demo data; metrics are not real-world performance claims.
- OTP state and resend cooldown are in memory and reset when the API process restarts. Demo OTP `123456` is available only in mock mode.
- The 16 fixture/static routes listed in `docs/STATUS.md` do not become real-data screens just because their backend endpoints exist.
- The checked-in SQLite seed is demo data. Reset it with `make demo-reset` before each clean presentation.

## Next steps for production

1. Wire Tier 2 dashboards and remaining Tier 3 screens, with per-screen interaction checks and a visible fixture fallback marker.
2. Add browser-side runtime response validation for all screen payloads and complete full screen-by-screen contract coverage.
3. Finish Stitch comparison and Gujarati/Hindi/English layout review, especially SC2, SC3, SC6, D2, A3, and V1.
4. Persist OTP state, configure production secrets/CORS/rate limits, and complete a security review/VAPT.
5. Integrate approved PFMS, Aadhaar/UIDAI through AUA/KUA, CTS, DigiLocker, and SMS providers before making production service claims.
6. Deploy to a hosted environment, verify the cold-start/health path, then add the real URL and recorded demo link to the README.
