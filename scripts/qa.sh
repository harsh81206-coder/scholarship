#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
qa_tmp_dir="$(mktemp -d "${TMPDIR:-/tmp}/vps-qa.XXXXXX")"
database_url="sqlite:///${qa_tmp_dir}/vps.db"
vps_api_port="$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1]); s.close()')"
vps_web_port="$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1]); s.close()')"
api_log="$(mktemp)"
web_log="$(mktemp)"
api_pid=""
web_pid=""
token_file="${qa_tmp_dir}/auth-tokens.json"

cleanup() {
  if [ -n "${web_pid}" ]; then kill "${web_pid}" 2>/dev/null || true; wait "${web_pid}" 2>/dev/null || true; fi
  if [ -n "${api_pid}" ]; then kill "${api_pid}" 2>/dev/null || true; wait "${api_pid}" 2>/dev/null || true; fi
  rm -f "${api_log}" "${web_log}"
  rm -rf "${qa_tmp_dir}"
}
trap cleanup EXIT INT TERM

(cd "${repo_root}/api" && DATABASE_URL="${database_url}" JWT_SECRET="vps-qa-local-secret-32-characters" python3 -m seed.seed --reset >/dev/null)
# make qa has just produced a production build. Give the browser smoke its own
# clean dev output so Next does not mix production traces with dev chunks.
rm -rf "${repo_root}/web/.next"

(
  cd "${repo_root}/api"
  export DATABASE_URL="${database_url}"
  export JWT_SECRET="vps-qa-local-secret-32-characters"
  export ADAPTER_MODE=mock DEMO_OTP=123456
  export CORS_ORIGINS="http://127.0.0.1:${vps_web_port}"
  export PYTHONPATH="${repo_root}/api"
  exec uvicorn app.main:app --host 127.0.0.1 --port "${vps_api_port}"
) >"${api_log}" 2>&1 &
api_pid=$!

(
  cd "${repo_root}/web"
  export NEXT_PUBLIC_USE_MOCK=false
  export NEXT_PUBLIC_API_URL="http://localhost:${vps_api_port}"
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
  echo "QA services did not start. API log: ${api_log}; web log: ${web_log}" >&2
  cat "${api_log}" "${web_log}" >&2
  exit 1
fi

echo "Running browser QA against 127.0.0.1:${vps_web_port} and 127.0.0.1:${vps_api_port}."
(cd "${repo_root}/web" && QA_BASE_URL="http://127.0.0.1:${vps_web_port}" QA_API_URL="http://127.0.0.1:${vps_api_port}" QA_TOKEN_FILE="${token_file}" npm run qa:login)
(cd "${repo_root}/web" && QA_BASE_URL="http://127.0.0.1:${vps_web_port}" QA_API_URL="http://127.0.0.1:${vps_api_port}" QA_TOKEN_FILE="${token_file}" npm run qa:screens)
