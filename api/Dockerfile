FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DATA_DIR=/data \
    DATABASE_URL=sqlite:////data/vps.db

WORKDIR /app
COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY app ./app
COPY seed ./seed
COPY ml_train ./ml_train
COPY scripts ./scripts
COPY README.md ./README.md
RUN mkdir -p /data

EXPOSE 8000
CMD ["sh", "-c", "python -m seed.seed && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
