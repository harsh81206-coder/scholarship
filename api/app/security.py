"""app/security.py — JWT creation + verification, password hashing, OTP helpers."""

from __future__ import annotations
import hashlib
import secrets
import time
from datetime import datetime, timedelta, timezone
from typing import Any
from jose import jwt
from passlib.context import CryptContext
from app.config import get_settings

settings = get_settings()
pwd_ctx = CryptContext(schemes=["sha256_crypt"], deprecated="auto")

# In-memory OTP store: {key: {hash, expires, attempts}}
_otp_store: dict[str, dict] = {}
_resend_cooldown: dict[str, float] = {}

OTP_TTL = 300  # 5 minutes
OTP_MAX_ATTEMPTS = 5
OTP_COOLDOWN = 30  # seconds


def hash_password(plain: str) -> str:
    return pwd_ctx.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_ctx.verify(plain, hashed)


def create_access_token(
    data: dict[str, Any], expires_minutes: int | None = None
) -> str:
    exp = expires_minutes or settings.access_token_expire_minutes
    payload = {**data, "exp": datetime.now(timezone.utc) + timedelta(minutes=exp)}
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> dict[str, Any]:
    return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])


def _otp_key(identifier: str, role: str) -> str:
    return f"{role}:{identifier}"


def generate_otp(identifier: str, role: str) -> str:
    key = _otp_key(identifier, role)
    now = time.time()
    if key in _resend_cooldown and now - _resend_cooldown[key] < OTP_COOLDOWN:
        raise ValueError(f"Resend cooldown active. Wait {OTP_COOLDOWN}s.")
    # Demo OTP is deterministic only for offline mock mode. Production mode
    # creates an unpredictable code and requires an SMS adapter to deliver it.
    otp = (
        settings.demo_otp
        if settings.adapter_mode == "mock"
        else f"{secrets.randbelow(1_000_000):06d}"
    )
    _otp_store[key] = {
        "hash": hashlib.sha256(otp.encode()).hexdigest(),
        "expires": now + OTP_TTL,
        "attempts": 0,
    }
    _resend_cooldown[key] = now
    return otp  # In production, send via SMS adapter instead of returning


def verify_otp(identifier: str, role: str, otp: str) -> bool:
    key = _otp_key(identifier, role)
    record = _otp_store.get(key)
    if not record:
        return False
    if time.time() > record["expires"]:
        _otp_store.pop(key, None)
        return False
    if record["attempts"] >= OTP_MAX_ATTEMPTS:
        raise ValueError("OTP locked — too many attempts.")
    record["attempts"] += 1
    if hashlib.sha256(otp.encode()).hexdigest() != record["hash"]:
        return False
    _otp_store.pop(key, None)
    return True


def sha256_chain(prev_hash: str, payload: str) -> str:
    return hashlib.sha256(f"{prev_hash}{payload}".encode()).hexdigest()


def aadhaar_hash(raw: str, salt: str) -> str:
    """Store salted SHA-256 — never store raw Aadhaar."""
    return hashlib.sha256(f"{salt}{raw}".encode()).hexdigest()
