# Vidya Pragati Setu

Offline-first Gujarat scholarship platform demo with a Next.js frontend and FastAPI/SQLite backend.

## Run the demo

```bash
make demo
```

This starts the API at `http://localhost:8000` and the web app at `http://localhost:3000`. Use OTP `123456` and student ID `GJ-AND-2026-004512`. To choose other ports:

```bash
VPS_API_PORT=8101 VPS_WEB_PORT=3101 make demo
```

For an offline frontend build, run `make demo-offline`, then serve it with `cd web && npm run start -- --hostname 127.0.0.1 --port 3000`.

## Project layout

- `web/` — Next.js 14 App Router frontend
- `api/` — FastAPI backend, SQLite seed, trained demo artifacts, and tests
- `design/` — Stitch source screens and design references
- `docs/` — screen inventory, status, and demo instructions
- `qa/` — route screenshots, test results, and QA report

## Current demo scope

OTP login and role switching use the API in online mode. Most feature screens still use local demo fixtures; see [`docs/FINAL_STATUS.md`](docs/FINAL_STATUS.md) and [`docs/STATUS.md`](docs/STATUS.md) for the verified scope and remaining work. External government integrations are mocked, and ML artifacts use synthetic training data.

## Checks

```bash
make test
make qa
```

See [`api/README.md`](api/README.md) for backend routes and commands.
