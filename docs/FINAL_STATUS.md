# Final status — Vidya Pragati Setu

Updated: 2026-11-26. This report separates API wiring, browser interaction coverage, route-only screenshots, and items that were not verified.

## Acceptance summary

| Work area | Status | Evidence / boundary |
|---|---|---|
| Golden Path frontend | Done for the 17 listed Tier 1 routes, with X1 partial | Real API hooks are used for login, student application, school/DEO review, vendor dispatch, school handover, student cycle/payments/notifications, admin DBT, and promotion. X1 currently exposes promotion only. |
| Cross-role database flow | Done for tested path | Playwright submits one student application and verifies the same row as school, DEO, vendor/school logistics, admin DBT, and student. |
| Backend regression | Done for current test suite | 79 tests passed, including deterministic seed counts/role queues/hash chains; Ruff is clean. |
| Demo seed | Done for Prompt 1 | 1,500 students, 40 schools, 2,200 applications, 900 DBT rows, 400 cycles, and 2,016 chart points; reset is under 5 seconds. See [`SEED_DATA.md`](SEED_DATA.md). |
| Seeded ML artifacts | Done for Prompt 1 | `make seed-reset` trains dropout on 1,500 seeded students with simulated proxy labels, fraud on 2,200 seeded applications, and forecast on 40 seeded school allocations. These are demo models, not real-world accuracy claims. |
| Contract check | Partial | `80` endpoint calls passed across six seeded roles. This is not a 33-page UI wiring check or full runtime Zod validation. |
| Browser E2E | Done for stated path | Latest `make e2e` passed three consecutive runs against fresh temporary databases, including Riya’s seeded pending cycle and mock DBT credit. |
| Route and visual QA | Partial | Latest production sweep captured 33/33 authenticated screens: all HTTP 200, with zero page/API errors, broken images, or document-level overflow. Full Stitch pixel comparison and all-language layout review are still outstanding; focused manual review found fidelity gaps on dense officer screens. |
| Tier 2/3 wiring | Partial | These routes render but remain fixtures/static. See [`STATUS.md`](STATUS.md). |
| Production local demo | Done | `make demo` runs a production Next build and `next start` alongside FastAPI. Server URLs and current health are reported in the completion message. |
| Offline demo | Done | `make demo-offline` builds and serves the mock-only frontend without requiring the API. |
| Deployment / Docker | Partial | Deployment files are present. Docker is unavailable in this environment, so Compose validation and container startup are not verified. No hosted URL has been deployed or tested. |

## Evidence

Commands run from the repository root unless noted:

```text
make test
make check-contract
make e2e
```

Latest full output summary:

```text
Endpoint contract check: 80 calls passed across 6 seeded roles.
79 passed, 3 warnings in 2.96s
All checks passed!
openapi-typescript 7.13.0 generated lib/api/types.ts
✔ No ESLint warnings or errors
✓ Compiled successfully
✓ Generating static pages (47/47)
Playwright login: student OTP, /students/me, school role switch, scoped applications, and wrong-role redirect passed.
Screenshots: 33/33 (production demo)
HTTP/page errors: 0
E2E: 3/3 consecutive Golden Path runs passed
```

The latest checks include contract calls, backend tests and Ruff, `tsc`, ESLint, three full Golden Path runs, a production build, OTP/role smoke, and a 33-route production browser sweep. These commands were run separately; `make qa` was not rerun after the final seed/training changes.

Production demo startup check:

```text
VPS_API_PORT=8000 VPS_WEB_PORT=3000 make demo
✓ Generating static pages (47/47)
✓ Ready in 131ms
curl http://127.0.0.1:3000/ → HTTP 200
curl http://127.0.0.1:8000/health → HTTP 200, {"status":"ok","version":"2.0.0","adapter_mode":"mock"}
```

Both servers are left running for the user at `http://localhost:3000` and `http://localhost:8000/api/docs`.

```text
make e2e
```

The command runs the browser Golden Path three times against a new disposable SQLite database each time. The tested path is login → S1 → S2 → S4 OCR upload → S5 guardian OTP/apply → S6 tracker → SC2/SC3 school approval → D2 DEO approval → V1 dispatch → SC5 receive/handover → S7 delivered → A3 DBT initiate → S8 credited → X1 promote → S10 notification. The seeded QR signature uses the same demo key as `make demo`.

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
- Dropout, fraud, and forecast artifacts use seeded demo data; dropout labels are simulated proxies, so model metrics are not real-world performance claims.
- OTP state and resend cooldown are in memory and reset when the API process restarts. Demo OTP `123456` is available only in mock mode.
- The 16 fixture/static routes listed in `docs/STATUS.md` do not become real-data screens just because their backend endpoints exist.
- The checked-in SQLite seed is demo data. Reset it with `make demo-reset` before each clean presentation. Current dataset detail and seed-specific checks are in [`SEED_DATA.md`](SEED_DATA.md).

## Next steps for production

1. Wire Tier 2 dashboards and remaining Tier 3 screens, with per-screen interaction checks and a visible fixture fallback marker.
2. Add browser-side runtime response validation for all screen payloads and complete full screen-by-screen contract coverage.
3. Finish Stitch comparison and Gujarati/Hindi/English layout review, especially SC2, SC3, SC6, D2, A3, and V1.
4. Persist OTP state, configure production secrets/CORS/rate limits, and complete a security review/VAPT.
5. Integrate approved PFMS, Aadhaar/UIDAI through AUA/KUA, CTS, DigiLocker, and SMS providers before making production service claims.
6. Deploy to a hosted environment, verify the cold-start/health path, then add the real URL and recorded demo link to the README.
