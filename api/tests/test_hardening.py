"""Configuration, OTP, route registration, and privacy regression checks."""

from __future__ import annotations

import pytest

from app import main, security
from app.models.core import Student
from app.routers import auth
from app.routers.auth import OtpSendRequest
from app.routers.applications import _risk_level, _route
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool


def test_production_startup_rejects_default_jwt_secret(monkeypatch):
    monkeypatch.setattr(main.settings, "adapter_mode", "real")
    monkeypatch.setattr(main.settings, "jwt_secret", "change-me-dev-secret-key-32chars")
    with pytest.raises(RuntimeError, match="JWT_SECRET must be set"):
        main.on_startup()


def test_production_otp_is_random_and_not_exposed(monkeypatch):
    monkeypatch.setattr(auth.settings, "adapter_mode", "real")
    monkeypatch.setattr(security.settings, "adapter_mode", "real")
    monkeypatch.setattr(security.settings, "demo_otp", "123456")
    monkeypatch.setattr(auth.settings, "demo_otp", "123456")
    monkeypatch.setattr(security.secrets, "randbelow", lambda _limit: 654321)
    response = auth.send_otp(
        OtpSendRequest(identifier="production-test-otp"), session=None
    )
    assert "demo_otp" not in response
    assert security.verify_otp("production-test-otp", "student", "123456") is False
    assert security.verify_otp("production-test-otp", "student", "654321") is True


def test_risk_routing_reads_threshold_settings():
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    from app.models.core import Setting

    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        session.add_all(
            [
                Setting(key="RISK_AUTO_THRESHOLD", value_json="0.2"),
                Setting(key="RISK_TALUKA_THRESHOLD", value_json="0.7"),
                Setting(key="AMOUNT_LIMIT_TALUKA", value_json="9000"),
            ]
        )
        session.commit()
        assert _route(0.19, 8000, session) == "auto"
        assert _route(0.3, 8000, session) == "taluka"
        assert _route(0.3, 10000, session) == "deo"
        assert _risk_level(0.3, session) == "medium"


def test_student_schema_has_no_raw_aadhaar_field():
    assert "aadhaar" not in Student.model_fields
    assert "aadhaar_hash" not in Student.model_fields
    assert "aadhaar_last4" not in Student.model_fields
