#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
e2e_tmp_dir="$(mktemp -d "${TMPDIR:-/tmp}/vps-e2e.XXXXXX")"
database_url="sqlite:///${e2e_tmp_dir}/vps.db"
vps_api_port="$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1]); s.close()')"
vps_web_port="$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1]); s.close()')"
api_log="$(mktemp)"
web_log="$(mktemp)"
api_pid=""
web_pid=""

cleanup() {
  exit_code=$?
  if [ "${exit_code}" -ne 0 ]; then
    echo "E2E failed. API log follows:" >&2
    cat "${api_log}" >&2
    echo "Web log follows:" >&2
    cat "${web_log}" >&2
  fi
  if [ -n "${web_pid}" ]; then kill "${web_pid}" 2>/dev/null || true; wait "${web_pid}" 2>/dev/null || true; fi
  if [ -n "${api_pid}" ]; then kill "${api_pid}" 2>/dev/null || true; wait "${api_pid}" 2>/dev/null || true; fi
  rm -f "${api_log}" "${web_log}"
  rm -rf "${e2e_tmp_dir}"
}
trap cleanup EXIT INT TERM

echo "Resetting demo database..."
(cd "${repo_root}/api" && DATABASE_URL="${database_url}" JWT_SECRET="vps-e2e-local-secret-32-characters" python3 -m seed.seed --reset >/dev/null)
# Make the UI path deterministic: treat auto-verified applications as audit samples
# in this throwaway E2E database so school and DEO actions are exercised every run.
(
  cd "${repo_root}/api"
  DATABASE_URL="${database_url}" PYTHONPATH="${repo_root}/api" python3 - <<'PY'
import json
from sqlmodel import Session
from app.db import engine
from app.models.core import Setting

with Session(engine) as session:
    for key, value in (("RISK_AUTO_THRESHOLD", 1.0), ("AMOUNT_LIMIT_TALUKA", 100000.0), ("AUTO_AUDIT_SAMPLE_PCT", 100.0)):
        setting = session.get(Setting, key)
        if setting is None:
            setting = Setting(key=key, value_json=json.dumps(value), description="E2E-only routing override")
        else:
            setting.value_json = json.dumps(value)
        session.add(setting)
    session.commit()
PY
)

(
  cd "${repo_root}/api"
  export DATABASE_URL="${database_url}"
  export JWT_SECRET="vps-e2e-local-secret-32-characters"
  export ADAPTER_MODE=mock DEMO_OTP=123456 PFMS_MOCK_SUCCESS_RATE=1.0
  export CORS_ORIGINS="http://127.0.0.1:${vps_web_port}"
  export PYTHONPATH="${repo_root}/api"
  exec uvicorn app.main:app --host 127.0.0.1 --port "${vps_api_port}"
) >"${api_log}" 2>&1 &
api_pid=$!

(
  cd "${repo_root}/web"
  export NEXT_PUBLIC_USE_MOCK=false
  export NEXT_PUBLIC_API_URL="http://127.0.0.1:${vps_api_port}"
  exec ./node_modules/.bin/next dev --hostname 127.0.0.1 --port "${vps_web_port}"
) >"${web_log}" 2>&1 &
web_pid=$!

ready=false
for attempt in $(seq 1 60); do
  if curl --silent --fail "http://127.0.0.1:${vps_api_port}/health" >/dev/null \
    && curl --silent --fail "http://127.0.0.1:${vps_web_port}/login" >/dev/null; then
    ready=true
    break
  fi
  if ! kill -0 "${api_pid}" 2>/dev/null || ! kill -0 "${web_pid}" 2>/dev/null; then
    break
  fi
  sleep 0.5
done

if [ "${ready}" != true ]; then
  echo "E2E services did not start. API log: ${api_log}; web log: ${web_log}" >&2
  cat "${api_log}" "${web_log}" >&2
  exit 1
fi

echo "Running Golden Path E2E against 127.0.0.1:${vps_web_port} and 127.0.0.1:${vps_api_port}..."
(cd "${repo_root}/web" && QA_BASE_URL="http://127.0.0.1:${vps_web_port}" QA_API_URL="http://127.0.0.1:${vps_api_port}" npm run qa:golden)
