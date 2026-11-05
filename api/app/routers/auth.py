"""app/routers/auth.py — B2: Auth + OTP + JWT."""

from __future__ import annotations
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from pydantic import BaseModel
from app.db import get_session
from app.security import OTP_COOLDOWN, generate_otp, verify_otp, create_access_token
from app.models.core import Student, User
from app.deps import get_current_user, CurrentUser
from app.config import get_settings

router = APIRouter(prefix="/auth", tags=["auth"])
settings = get_settings()


class OtpSendRequest(BaseModel):
    role: str = "student"
    identifier: str  # cts_id for student, officer_id for others
    mobile: str | None = None


class OtpVerifyRequest(BaseModel):
    role: str = "student"
    identifier: str
    otp: str


@router.post("/otp/send")
def send_otp(body: OtpSendRequest, session: Session = Depends(get_session)):
    try:
        otp = generate_otp(body.identifier, body.role)
    except ValueError as e:
        raise HTTPException(status_code=429, detail=str(e))
    resp: dict = {
        "success": True,
        "message": "OTP sent to registered mobile",
        "resend_after_seconds": OTP_COOLDOWN,
    }
    if settings.adapter_mode == "mock":
        resp["demo_otp"] = otp
    return resp


@router.post("/otp/verify")
def verify_otp_endpoint(
    body: OtpVerifyRequest, session: Session = Depends(get_session)
):
    try:
        valid = verify_otp(body.identifier, body.role, body.otp)
    except ValueError as exc:
        raise HTTPException(status_code=429, detail=str(exc))
    if not valid:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    # Build JWT payload based on role
    payload: dict = {
        "sub": body.identifier,
        "role": body.role,
        "school_id": None,
        "taluka_id": None,
        "district_id": None,
    }

    if body.role == "student":
        student = session.exec(
            select(Student).where(Student.cts_id == body.identifier)
        ).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        payload["name"] = student.name_en
        payload["school_id"] = student.school_id
    else:
        user = session.exec(
            select(User).where(User.officer_id == body.identifier)
        ).first()
        if not user:
            raise HTTPException(status_code=404, detail="Officer not found")
        payload["name"] = user.name
        payload["school_id"] = user.school_id
        payload["taluka_id"] = user.taluka_id
        payload["district_id"] = user.district_id

    token = create_access_token(payload)
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": body.role,
        "name": payload.get("name", ""),
        "sub": body.identifier,
        "scope": {
            "school_id": payload["school_id"],
            "taluka_id": payload["taluka_id"],
            "district_id": payload["district_id"],
        },
    }


@router.get("/me")
def get_me(user: CurrentUser = Depends(get_current_user)):
    return {
        "sub": user.sub,
        "role": user.role,
        "name": user.name,
        "school_id": user.school_id,
        "taluka_id": user.taluka_id,
        "district_id": user.district_id,
    }
