# Final status — Vidya Pragati Setu

Updated: 2026-11-26. This report reflects commands run for the 64-route expansion and current demo handoff. “API-linked” means a page uses at least one shared API hook/client request; it does not mean every value or interaction on the page is live.

## Done, with evidence

| Area | Result | Evidence |
|---|---|---|
| Route inventory | 64/64 Next.js route files listed; 62 pages issue an API request. `/privacy` and `/design-system` are static. | [`STATUS.md`](STATUS.md), [`qa/report.md`](../qa/report.md) |
| Backend tests and lint | 84 tests passed; Ruff clean. | `make test` and full `make qa` |
| API contract | 112 endpoint calls passed across six seeded roles, including the 33 original screen groups and expansion routes. | `make check-contract`; also passed inside `make qa` |
| Golden Path E2E | 3/3 consecutive runs passed through login, application, approvals, dispatch, handover, DBT, promotion, and notification. | `make e2e` |
| Frontend checks | TypeScript, ESLint, and optimized Next production build passed; 63/63 static pages generated. | `make test` and `make qa` |
| Browser smoke and route sweep | OTP/role smoke passed. 64/64 routes returned HTTP 200 in screenshot sweep; zero page/API errors, broken images, or document-level overflow. 64/64 Gujarati font readiness checks passed. | Full `make qa`; screenshots in [`qa/screens`](../qa/screens/) and summary in [`qa/report.md`](../qa/report.md) |
| Demo data and models | Seeded SQLite database and dropout/fraud/forecast model artifacts are present. | `api/vps.demo.db`, `api/artifacts/` |

Latest suite evidence:

```text
make qa
Endpoint contract check: 112 calls passed across 6 seeded roles.
84 passed, 3 warnings
All checks passed!
TypeScript, ESLint, optimized build passed (63/63 static pages).
Playwright login/role smoke passed.
Screenshots: 64/64; HTTP/page errors: 0.
```

The three backend warnings are upstream Passlib `crypt` and FastAPI `on_event` deprecations. They did not fail the suite.

```text
make e2e
Golden Path run 1/3: ALL GOLDEN PATH E2E CHECKS PASSED!
Golden Path run 2/3: ALL GOLDEN PATH E2E CHECKS PASSED!
Golden Path run 3/3: ALL GOLDEN PATH E2E CHECKS PASSED!
```

## Demo commands

From the repository root:

```bash
# Online local demo: FastAPI + production Next.js frontend
VPS_API_PORT=8000 VPS_WEB_PORT=3000 make demo

# Offline fallback: mock-only production frontend, no backend required
VPS_WEB_PORT=3100 make demo-offline
```

The online demo uses mock adapters and OTP `123456`; the demo identities are printed by `make demo`. The offline command serves only the mock frontend. Both demo commands build the frontend before starting it. `make demo-reset` reseeds the checked-in SQLite demo database and retrains the demo models.

Offline-mode verification completed in this environment:

```text
VPS_WEB_PORT=3100 make demo-offline
✓ Compiled successfully
✓ Generating static pages (63/63)
✓ Ready on http://127.0.0.1:3100
GET /       → HTTP 200
GET /login  → HTTP 200
```

## Not verified

- Docker is not installed in this environment; `docker compose config` and container startup were not run.
- Screenshot QA verifies route rendering, page errors, images, document overflow, and Gujarati font readiness. It does not perform a pixel-by-pixel comparison against all 33 Stitch references or inspect all nested table clipping.
- Every route was swept in the default language. Full `gu`/`hi`/`en` layout and translation verification remains incomplete; the source audit still reports untranslated JSX text.
- QA is not a complete click-through of every control on all 64 pages. Mixed fixture-backed widgets remain; consult [`STATUS.md`](STATUS.md) for route-level API linkage.
- Real PFMS, Aadhaar/UIDAI, CTS, DigiLocker, and SMS services are not connected. Their demo adapters are simulated.

## Known limitations and production next steps

- ML artifacts were trained on synthetic/demo seed data and are not evidence of real-world prediction accuracy.
- Demo OTP, payment, document/OCR, logistics, and external-service behavior are mock-mode behavior. Use production secrets and real approved adapters before deployment.
- Complete translation of remaining JSX copy and verify all three languages at mobile and desktop sizes.
- Compare each route against its Stitch reference and finish manual review of dense tables and role-specific actions.
- Add Docker-based deployment verification, then integrate approved PFMS, UIDAI via AUA/KUA, CTS, DigiLocker, and SMS providers with security review/VAPT.
