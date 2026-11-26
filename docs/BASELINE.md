# Baseline — finals strategy audit

Run date: 2026-11-26. Revision under test: `a7ced41` plus the already-present, uncommitted working-tree changes. This is the baseline before this continuation's fixes; do not compare it with earlier November results without accounting for those changes.

## Commands and evidence

Command: `make qa`

- Contract script completed and reported 33/33 route registrations. The current checker also makes a sample set of GET calls under six seeded roles, but its table only prints route-registration status; it does not call every hook endpoint or validate response schemas.
- Backend: `46 passed, 3 warnings in 1.13s`; `ruff check app tests` printed `All checks passed!`. Warnings: Python `crypt` deprecation and FastAPI `on_event` deprecation.
- OpenAPI TypeScript generation succeeded; `npx tsc --noEmit` emitted no errors.
- `next lint` completed with two `react-hooks/exhaustive-deps` warnings: `web/app/deo/approvals/page.tsx` (`apps`, line 28/useMemo line 35) and `web/app/school/queue/page.tsx` (`apps`, line 36/useMemo line 50).
- Next compiled and generated 47/47 static pages, then failed collecting build traces with `ENOENT` for `web/.next/server/app/admin/fraud/page.js.nft.json`; `make qa` exited 2 before its browser QA script ran. The error is consistent with conflicting/stale `.next` output, but its cause has not yet been established.
- A golden-path browser run was not part of this baseline. `scripts/e2e.sh` resets `api/vps.demo.db`; only run it when no live demo is using that snapshot.

## Audit findings

- Earlier edits already wire some Tier 1 student and officer pages to query/mutation hooks. Verify each page's implementation and API response use; do not infer wiring from hook imports or route registration alone.
- `docs/SCREEN_MATRIX.md` is a useful route/API inventory, but it needs per-screen `API-wired` and `tested` evidence to satisfy the finals matrix requirement.
- Both browser harness scripts previously started `uvicorn` inside a background subshell and could leave orphan API processes after cleanup. Nine orphan `uvicorn app.main` processes were found with working directory `api/` on ephemeral QA ports and stopped; both launch scripts now `exec` their server process so cleanup can reap it. Regression-check cleanup after the next QA run.
- `scripts/demo.sh` now intends to run `next build` + `next start`, but it needs a fresh successful build and startup smoke to verify production mode.
- Docker Compose now sets `NEXT_PUBLIC_USE_MOCK=false`; verify API URL/CORS behavior in a browser/container before treating that configuration as working.

## Not run in baseline

- `make e2e` / three repeated golden-path runs
- All-hook endpoint contract validation with response-schema checks
- Docker Compose build/start
- Full visual reference comparison for all screens
