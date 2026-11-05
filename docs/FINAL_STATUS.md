# Final status — Vidya Pragati Setu

Audit run: 2026-11-05. Statuses below reflect commands executed in this workspace; a route registration is not counted as a wired UI flow.

## Milestones

| Milestone | Status | Commit | Evidence / boundary |
|---|---|---|---|
| M0 Audit + hygiene | Done | N/A | `docs/STATUS.md` inventories all 33 screens; old `backend/` is archived at `_archive/backend/`; API README/contracts list current routes and describe actual ML fallbacks. |
| M1 Frontend API layer | Partial | N/A | OpenAPI types, API client/resources/hooks, shared loading states, and mock API exist. Most screens still do not call the hooks; response schemas are not checked with Zod at runtime. |
| M2 Login + guards | Partial | N/A | Real OTP send/verify, cooldown, role cookies/guards, and demo role login exist. Browser smoke passed for Student → School, `/students/me`, scoped `/applications`, and wrong-role redirect; all six demo roles were not individually exercised. |
| M3 Wire 33 screens | Partial | N/A | P2/P3 use the API. The other 30 screen routes remain fixture/Zustand-driven; no screen-by-screen API browser flow was completed. |
| M4 Backend verification | Partial | N/A | 46 backend tests pass, including a TestClient workflow through application approval, DBT, logistics, renewal consent, document upload, and audit-chain verification. Several requested edge cases are not covered yet. |
| M5 Contract check v2 | Partial | N/A | `make check-contract` reports 33/33 route registrations. It does not log in as every role, invoke each endpoint, or validate OpenAPI/runtime/Zod response shapes. |
| M6 E2E + visual QA | Partial | N/A | All 33 routes were captured at requested viewport sizes; login/role smoke passed. Full UI transaction journey and pixel-by-pixel comparison of all 33 references were not run. |
| M7 Hardening + environment | Partial | N/A | Startup secret guard, mock-only `demo_otp`, OTP attempt lock, and local-font build are present. Docker and several requested upload/privacy/performance cases remain unverified. |
| M8 Demo readiness | Partial | N/A | Root Makefile, seeded SQLite snapshot, trained artifacts, online startup script, offline build target, demo script, and this report exist. Root-level commits could not be made. |

**Commit note:** `/Users/harshpatel/Desktop/hiii` has no root `.git` directory. `web/` has a separate nested Git repository. No milestone commit hashes can be truthfully reported, and I did not rewrite repository metadata or history.

## Done with evidence

- Backend verification command, run from `api/`:

  ```text
  make openapi && make check-contract && ruff check app tests && pytest -q
  Contract check: 33/33 screens have a frontend route and registered API path (P1 is static).
  All checks passed!
  46 passed, 3 warnings in 1.15s
  ```

  The three warnings were Python `crypt` deprecation and FastAPI `on_event` deprecation notices.
- Frontend verification, run from `web/`:

  ```text
  npm run api:types && npx tsc --noEmit && npm run lint && npm run build
  openapi-typescript 7.13.0 generated lib/api/types.ts
  ✔ No ESLint warnings or errors
  ✓ Compiled successfully
  ✓ Generating static pages (47/47)
  ```

  TypeScript emitted no errors. The production build completed without the prior SWC lockfile warning.
- `make qa` completed end to end: 46 backend tests passed, ruff clean, API types regenerated, TypeScript/lint/build passed (47/47 pages), OTP/role smoke passed, and the browser sweep captured 33/33 routes with zero HTTP/page errors.
- Offline build: `make demo-offline` completed; Next.js compiled and generated 47/47 static pages with `NEXT_PUBLIC_USE_MOCK=true`.
- Route capture: `QA_BASE_URL=http://localhost:3100 npm run qa:screens` reported `Screenshots: 33/33`, `HTTP/page errors: 0`; all 33 rows had status 200, zero broken images, no page errors, Gujarati font availability true, and no document-level horizontal overflow. Result data: [`qa/results.json`](../qa/results.json); images: [`qa/screens/`](../qa/screens/).
- Browser auth smoke: `QA_BASE_URL=http://localhost:3100 npm run qa:login` passed Student OTP login, `/students/me`, demo switch to School, `/applications`, and middleware redirect from `/admin` to `/school`.
- Startup smoke: `VPS_API_PORT=8101 VPS_WEB_PORT=3101 make demo` printed demo URLs/identifiers; API `/health` returned HTTP 200 and web `/` returned HTTP 200.
- Seeded assets present locally: `api/vps.demo.db` (656 KB), with 600 students from the seed run; trained dropout, fraud, and forecast joblib artifacts are in `api/artifacts/`.

## Not verified

- Docker is not installed in this environment (`command -v docker` returned no path), so `docker compose config` and container startup were not run.
- Full browser journey from upload/apply through school/taluka/DEO approval, vendor delivery, DBT credit, promote, and audit verification was not run. The API TestClient flow is not equivalent to UI E2E.
- The 33 screenshots were checked for route load, JS errors, image failures, font availability, and page-level overflow. A full pixel/layout comparison against every Stitch PNG was not completed; focused manual inspection covered SC2, SC3, SC4, SC5, SC6, V1, and A3.
- The contract checker does not invoke every API endpoint or validate each response against OpenAPI and Zod/TypeScript shapes. It checks route files and registered paths.
- Dashboard latency under 300 ms, analytics cache behavior, all six role scopes, all requested authorization edge cases, ML artifact removal fallback, and every DBT/logistics/OCR/records/security requirement were not independently verified.
- The Playwright route screenshots used fixture data and fake role cookies for route access; only the separate OTP/role smoke used real API-issued JWTs.
- No Git commit hashes are available because the workspace root is not a Git repository.

## Known limitations

- Only login and OTP verification (P2/P3) call the backend from their screens. S1–X1 remain local fixture/Zustand screens despite the shared API client and hooks. `NEXT_PUBLIC_USE_MOCK=false` therefore does **not** make the whole UI a real-backend demo.
- `make demo` runs the API in mock adapter mode and starts the Next development server. It is an online local startup command, not a fully API-wired workflow.
- `make demo-offline` builds the mock-mode frontend; serve that build separately with `cd web && npm run start -- --hostname 127.0.0.1 --port 3000`.
- SMS, PFMS, DigiLocker, Aadhaar/UIDAI, CTS, and external LLM integrations are local mock/template behavior. Do not present them as connected government services.
- ML artifacts were trained from synthetic data; their metrics are not real-world accuracy claims.
- OTP storage and resend cooldown are in-memory. Production OTP delivery is not configured.
- Docker Compose currently builds the frontend with `NEXT_PUBLIC_USE_MOCK=true`; it does not demonstrate real API wiring from the pages.

## Next steps for production

1. Wire each screen to resource hooks and verify loading, empty, error, mutation, and language states against the running API.
2. Expand contract validation to invoke all screen endpoints under all relevant roles and validate response schemas.
3. Complete missing backend paths and tests listed in [`docs/STATUS.md`](STATUS.md) and `api/docs/api-contract.md`.
4. Run the full Playwright workflow and compare all screenshots with Stitch references at the required viewports.
5. Integrate approved PFMS, Aadhaar/UIDAI through AUA/KUA, CTS, DigiLocker, and SMS providers; complete VAPT and production secrets/CORS review.
