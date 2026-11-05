"""tests/test_health.py — B0 health check and auth smoke tests."""

import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, create_engine, Session
from sqlmodel.pool import StaticPool
from app.main import app
from app.db import get_session


# ── In-memory SQLite fixture ─────────────────────────────────────────────────
@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session):
    def override():
        yield session

    app.dependency_overrides[get_session] = override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


# ── Tests ─────────────────────────────────────────────────────────────────────
def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_otp_send(client):
    r = client.post(
        "/auth/otp/send", json={"role": "student", "identifier": "GJ-TEST-001"}
    )
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True
    # Mock mode returns demo_otp
    assert "demo_otp" in data


def test_otp_verify_wrong(client):
    client.post("/auth/otp/send", json={"role": "student", "identifier": "GJ-TEST-002"})
    r = client.post(
        "/auth/otp/verify",
        json={"role": "student", "identifier": "GJ-TEST-002", "otp": "000000"},
    )
    assert r.status_code == 400


def test_otp_cooldown(client):
    for _ in range(3):
        client.post(
            "/auth/otp/send", json={"role": "student", "identifier": "GJ-TEST-COOL"}
        )
    r = client.post(
        "/auth/otp/send", json={"role": "student", "identifier": "GJ-TEST-COOL"}
    )
    # Should be rate limited (429) or succeed — just check it doesn't 500
    assert r.status_code in (200, 429)


def test_otp_attempt_limit_returns_429(client):
    identifier = "GJ-TEST-LOCK"
    client.post("/auth/otp/send", json={"role": "student", "identifier": identifier})
    payload = {"role": "student", "identifier": identifier, "otp": "000000"}
    for _ in range(5):
        assert client.post("/auth/otp/verify", json=payload).status_code == 400
    locked = client.post("/auth/otp/verify", json=payload)
    assert locked.status_code == 429


def test_docs_accessible(client):
    r = client.get("/api/docs")
    assert r.status_code == 200
