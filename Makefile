.PHONY: install demo demo-offline seed train test qa

install:
	@if ! python3 -c 'import fastapi, sqlmodel' >/dev/null 2>&1; then python3 -m pip install -r api/requirements.txt; fi
	@if [ ! -x web/node_modules/.bin/next ]; then cd web && npm ci; fi

seed:
	cd api && DATABASE_URL="sqlite:///$(CURDIR)/api/vps.demo.db" python3 -m seed.seed --reset

train:
	cd api && python3 -m ml_train.train_all

demo: install
	bash scripts/demo.sh

demo-offline:
	cd web && NEXT_PUBLIC_USE_MOCK=true npm run build

test:
	cd api && pytest -q && ruff check app tests
	cd web && npx tsc --noEmit && npm run lint

qa:
	cd api && make check-contract && pytest -q && ruff check app tests
	cd web && npm run api:types && npx tsc --noEmit && npm run lint && npm run build
	bash scripts/qa.sh
