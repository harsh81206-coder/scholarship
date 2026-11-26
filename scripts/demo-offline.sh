#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
web_port="${VPS_WEB_PORT:-3000}"

cd "${repo_root}/web"
rm -rf .next
NEXT_PUBLIC_USE_MOCK=true npm run build
NEXT_PUBLIC_USE_MOCK=true npm run start -- --hostname 127.0.0.1 --port "${web_port}"
