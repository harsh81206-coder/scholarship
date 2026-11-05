.PHONY: install seed train run test check-contract openapi

install:
	python3 -m pip install -r requirements.txt -q

seed:
	python3 -m seed.seed

seed-reset:
	python3 -m seed.seed --reset

train:
	python3 -m ml_train.train_all

run:
	uvicorn app.main:app --reload --port 8000

run-prod:
	uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2

test:
	pytest tests/ -v --tb=short

check-contract:
	python3 -m scripts.check_contract

openapi:
	python3 -c 'import json; from app.main import app; open("openapi.json", "w").write(json.dumps(app.openapi(), indent=2) + chr(10))'

lint:
	ruff check app/ seed/ tests/

format:
	ruff format app/ seed/ tests/

setup: install seed
	@echo "✅ Setup complete. Run: make run"
