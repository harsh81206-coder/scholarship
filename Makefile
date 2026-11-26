.PHONY: install demo demo-offline demo-reset seed seed-reset train test qa e2e check-contract

install:
	@if ! python3 -c 'import fastapi, sqlmodel' >/dev/null 2>&1; then python3 -m pip install -r api/requirements.txt; fi
	@if [ ! -x web/node_modules/.bin/next ]; then cd web && npm ci; fi

seed:
	cd api && DATABASE_URL="sqlite:///$(CURDIR)/api/vps.demo.db" JWT_SECRET="$(if $(VPS_JWT_SECRET),$(VPS_JWT_SECRET),local-demo-secret-change-before-deployment)" python3 -m seed.seed --reset

seed-reset: seed train

demo-reset: seed-reset

train:
	cd api && DATABASE_URL="sqlite:///$(CURDIR)/api/vps.demo.db" python3 -m ml_train.train_all

demo: install
	bash scripts/demo.sh

demo-offline:
	bash scripts/demo-offline.sh

test:
	cd api && pytest -q && ruff check app tests
	cd web && npx tsc --noEmit && npm run lint

check-contract:
	cd api && DATABASE_URL="sqlite:///$(CURDIR)/api/vps.demo.db" JWT_SECRET="$(if $(VPS_JWT_SECRET),$(VPS_JWT_SECRET),local-demo-secret-change-before-deployment)" ADAPTER_MODE=mock DEMO_OTP=123456 python3 -m scripts.check_contract

e2e:
	@set -e; for run in 1 2 3; do echo "Golden Path run $$run/3"; bash scripts/e2e.sh; done

qa:
	cd api && make check-contract && pytest -q && ruff check app tests
	cd web && npm run api:types && npx tsc --noEmit && npm run lint && rm -rf .next && npm run build
	bash scripts/qa.sh
