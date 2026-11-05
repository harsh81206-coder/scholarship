#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
API_PORT="${VPS_API_PORT:-8000}"
WEB_PORT="${VPS_WEB_PORT:-3000}"
DATABASE_URL="sqlite:///${REPO_ROOT}/api/vps.demo.db"

if [ ! -f "${REPO_ROOT}/api/vps.demo.db" ]; then
  (cd "${REPO_ROOT}/api" && DATABASE_URL="${DATABASE_URL}" python3 -m seed.seed --reset)
fi

for artifact in dropout_model.joblib fraud_model.joblib forecast_model.joblib; do
  if [ ! -f "${REPO_ROOT}/api/artifacts/${artifact}" ]; then
    (cd "${REPO_ROOT}/api" && python3 -m ml_train.train_all)
    break
  fi
done

export DATABASE_URL
export JWT_SECRET="${VPS_JWT_SECRET:-local-demo-secret-change-before-deployment}"
export ADAPTER_MODE=mock
export DEMO_OTP=123456
export CORS_ORIGINS="http://localhost:${WEB_PORT}"
export DATA_DIR="${REPO_ROOT}/api/data"
mkdir -p "${DATA_DIR}"

cd "${REPO_ROOT}/api"
PYTHONPATH="${REPO_ROOT}/api" uvicorn app.main:app --host 127.0.0.1 --port "${API_PORT}" &
API_PID=$!
cleanup() {
  kill "${API_PID}" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

for attempt in $(seq 1 30); do
  if curl --silent --fail "http://127.0.0.1:${API_PORT}/health" >/dev/null; then
    break
  fi
  if [ "${attempt}" -eq 30 ]; then
    echo "API did not become healthy on port ${API_PORT}." >&2
    exit 1
  fi
  sleep 1
done

echo "Vidya Pragati Setu demo is starting."
echo "Web: http://localhost:${WEB_PORT}"
echo "API docs: http://localhost:${API_PORT}/api/docs"
echo "Demo OTP: 123456 (mock adapters)"
echo "Student: GJ-AND-2026-004512"
echo "School: SCH-AND-001 | Taluka: TPEO-BOR-001 | DEO: DEO-AND-001"
echo "Admin: ADMIN-STATE-001 | Vendor: VND-001"

cd "${REPO_ROOT}/web"
NEXT_PUBLIC_USE_MOCK=false \
NEXT_PUBLIC_API_URL="http://localhost:${API_PORT}" \
  npm run dev -- --hostname 127.0.0.1 --port "${WEB_PORT}"
