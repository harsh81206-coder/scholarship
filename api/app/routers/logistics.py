"""Offline QR cycle dispatch, receipt, and student handover workflow."""

from __future__ import annotations

import hashlib
import hmac
import json
import secrets
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlmodel import Session, select

from app.config import get_settings
from app.db import get_session
from app.deps import CurrentUser, get_current_user
from app.models.core import (
    Cycle,
    CycleBatch,
    Handover,
    Notification,
    School,
    Student,
    User,
)

router = APIRouter(tags=["logistics"])
settings = get_settings()


def _signed_payload(serial: str, batch_id: int) -> str:
    raw = f"{serial}|{batch_id}"
    digest = hmac.new(
        settings.jwt_secret.encode(), raw.encode(), hashlib.sha256
    ).hexdigest()
    return f"{raw}|{digest}"


class BatchCreate(BaseModel):
    school_id: int
    qty: int = Field(ge=1, le=1000)


class ReceiveRequest(BaseModel):
    received_qty: int = Field(ge=0)
    scanned_serials: list[str] = []


class HandoverStart(BaseModel):
    student_id: int
    cycle_serial: str


class HandoverConfirm(BaseModel):
    cycle_serial: str
    otp: str
    photo_path: str = ""
    lat: float | None = None
    lng: float | None = None


@router.post("/vendor/batches")
def create_batch(
    body: BatchCreate,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role not in ("vendor", "admin"):
        raise HTTPException(403, "Vendor role required")
    if not session.get(School, body.school_id):
        raise HTTPException(404, "School not found")
    vendor = session.exec(select(User).where(User.officer_id == user.sub)).first()
    if not vendor:
        raise HTTPException(404, "Vendor account not found")
    batch = CycleBatch(
        batch_code=f"BATCH-{datetime.utcnow():%Y%m%d%H%M%S}-{secrets.token_hex(2).upper()}",
        vendor_id=vendor.id,
        school_id=body.school_id,
        qty=body.qty,
        status="ordered",
    )
    session.add(batch)
    session.flush()
    first = session.exec(select(Cycle.id).order_by(Cycle.id.desc())).first() or 0
    cycles = []
    for offset in range(body.qty):
        serial = f"SSB-{datetime.utcnow().year}-{(first + offset + 1):06d}"
        cycle = Cycle(
            serial_no=serial,
            qr_payload=_signed_payload(serial, batch.id),
            batch_id=batch.id,
        )
        session.add(cycle)
        cycles.append(serial)
    session.commit()
    return {
        "id": batch.id,
        "batch_code": batch.batch_code,
        "qty": batch.qty,
        "serials": cycles,
        "status": batch.status,
    }


@router.get("/vendor/batches")
def list_batches(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role not in ("vendor", "admin", "school", "taluka", "deo"):
        raise HTTPException(403)
    batches = session.exec(select(CycleBatch).order_by(CycleBatch.id.desc())).all()
    if user.role == "vendor":
        vendor = session.exec(select(User).where(User.officer_id == user.sub)).first()
        batches = [b for b in batches if vendor and b.vendor_id == vendor.id]
    elif user.role == "school":
        batches = [b for b in batches if b.school_id == user.school_id]
    return [
        {
            "id": b.id,
            "batch_code": b.batch_code,
            "school_id": b.school_id,
            "qty": b.qty,
            "received_qty": b.received_qty,
            "status": b.status,
        }
        for b in batches
    ]


@router.post("/batches/{batch_id}/dispatch")
def dispatch_batch(
    batch_id: int,
    gps: dict,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role not in ("vendor", "admin"):
        raise HTTPException(403)
    batch = session.get(CycleBatch, batch_id)
    if not batch:
        raise HTTPException(404, "Batch not found")
    points = json.loads(batch.gps_json or "[]")
    points.append(
        {
            "at": datetime.utcnow().isoformat(),
            "lat": gps.get("lat"),
            "lng": gps.get("lng"),
        }
    )
    batch.gps_json = json.dumps(points)
    batch.dispatched_at = datetime.utcnow()
    batch.status = "dispatched"
    session.commit()
    return {
        "id": batch.id,
        "status": batch.status,
        "dispatched_at": batch.dispatched_at.isoformat(),
    }


@router.post("/batches/{batch_id}/gps")
def gps_ping(
    batch_id: int,
    gps: dict,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role not in ("vendor", "admin"):
        raise HTTPException(403)
    batch = session.get(CycleBatch, batch_id)
    if not batch:
        raise HTTPException(404, "Batch not found")
    points = json.loads(batch.gps_json or "[]")
    points.append(
        {
            "at": datetime.utcnow().isoformat(),
            "lat": gps.get("lat"),
            "lng": gps.get("lng"),
        }
    )
    batch.gps_json = json.dumps(points)
    session.commit()
    return {"success": True, "points": len(points)}


@router.post("/batches/{batch_id}/receive")
def receive_batch(
    batch_id: int,
    body: ReceiveRequest,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role not in ("school", "admin"):
        raise HTTPException(403)
    batch = session.get(CycleBatch, batch_id)
    if not batch:
        raise HTTPException(404, "Batch not found")
    if user.role == "school" and batch.school_id != user.school_id:
        raise HTTPException(403, "Batch is outside your school scope")
    known = session.exec(select(Cycle).where(Cycle.batch_id == batch_id)).all()
    known_serials = {c.serial_no for c in known}
    unknown = sorted(set(body.scanned_serials) - known_serials)
    received = min(body.received_qty, batch.qty)
    batch.received_qty = received
    batch.received_at = datetime.utcnow()
    batch.status = "received" if received == batch.qty and not unknown else "partial"
    for cycle in known:
        if cycle.serial_no in body.scanned_serials:
            cycle.status = "received"
    mismatch = received != batch.qty or bool(unknown)
    if mismatch:
        for officer in session.exec(select(User).where(User.role == "deo")).all():
            session.add(
                Notification(
                    recipient_id=officer.officer_id,
                    notif_type="logistics",
                    title_en=f"Cycle batch {batch.batch_code} quantity mismatch",
                    title_gu=f"બેચ {batch.batch_code} ની સંખ્યામાં તફાવત",
                    body=f"Received {received} of {batch.qty}; unknown serials: {', '.join(unknown) or 'none'}.",
                )
            )
    session.commit()
    return {
        "batch_id": batch.id,
        "status": batch.status,
        "received_qty": received,
        "expected_qty": batch.qty,
        "mismatch": mismatch,
        "unknown_serials": unknown,
    }


@router.post("/handover/initiate")
def initiate_handover(
    body: HandoverStart,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role not in ("school", "admin"):
        raise HTTPException(403)
    student = session.get(Student, body.student_id)
    cycle = session.exec(
        select(Cycle).where(Cycle.serial_no == body.cycle_serial)
    ).first()
    if not student or not cycle:
        raise HTTPException(404, "Student or cycle not found")
    school = session.get(School, student.school_id)
    if user.role == "school" and student.school_id != user.school_id:
        raise HTTPException(403, "Student is outside your school scope")
    assigned_cycle = session.exec(
        select(Cycle).where(Cycle.student_id == student.id)
    ).first()
    if assigned_cycle and assigned_cycle.id != cycle.id:
        raise HTTPException(409, "Student already has a cycle assigned")
    if cycle.status not in ("received", "in_stock") or cycle.student_id:
        raise HTTPException(409, "Cycle is not available")
    existing = session.exec(
        select(Handover).where(Handover.cycle_id == cycle.id)
    ).first()
    if existing and existing.handed_at:
        raise HTTPException(409, "Cycle already handed over")
    otp = f"{secrets.randbelow(1_000_000):06d}"
    handover = existing or Handover(cycle_id=cycle.id, student_id=student.id)
    handover.student_id = student.id
    handover.otp_hash = hashlib.sha256(otp.encode()).hexdigest()
    handover.otp_expires = datetime.utcnow() + timedelta(minutes=10)
    handover.otp_attempts = 0
    handover.otp_verified = False
    session.add(handover)
    session.add(
        Notification(
            recipient_id=student.cts_id,
            notif_type="cycle",
            title_en="Cycle handover OTP",
            title_gu="સાઇકલ સોંપણી OTP",
            body=f"Your handover code is {otp}",
        )
    )
    session.commit()
    response = {
        "success": True,
        "cycle_serial": cycle.serial_no,
        "school": school.name_en if school else "",
        "expires_in_seconds": 600,
    }
    if settings.adapter_mode == "mock":
        response["demo_otp"] = otp
    return response


@router.post("/handover/confirm")
def confirm_handover(
    body: HandoverConfirm,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role not in ("school", "admin"):
        raise HTTPException(403)
    cycle = session.exec(
        select(Cycle).where(Cycle.serial_no == body.cycle_serial)
    ).first()
    if not cycle:
        raise HTTPException(404, "Cycle not found")
    handover = session.exec(
        select(Handover).where(Handover.cycle_id == cycle.id)
    ).first()
    if not handover or not handover.otp_expires:
        raise HTTPException(409, "Handover has not been initiated")
    if user.role == "school":
        student = session.get(Student, handover.student_id)
        if not student or student.school_id != user.school_id:
            raise HTTPException(403, "Student is outside your school scope")
    if handover.otp_attempts >= 5:
        raise HTTPException(429, "OTP attempts exhausted")
    handover.otp_attempts += 1
    if datetime.utcnow() > handover.otp_expires or not hmac.compare_digest(
        handover.otp_hash, hashlib.sha256(body.otp.encode()).hexdigest()
    ):
        session.commit()
        raise HTTPException(400, "Invalid or expired OTP")
    expected = _signed_payload(cycle.serial_no, cycle.batch_id)
    if not hmac.compare_digest(cycle.qr_payload, expected):
        raise HTTPException(400, "Invalid cycle QR signature")
    cycle.status = "handed_over"
    cycle.student_id = handover.student_id
    handover.otp_verified = True
    handover.photo_path = body.photo_path
    handover.lat, handover.lng = body.lat, body.lng
    handover.handed_by = (
        session.exec(select(User).where(User.officer_id == user.sub)).first().id
        if user.role == "school"
        and session.exec(select(User).where(User.officer_id == user.sub)).first()
        else None
    )
    handover.handed_at = datetime.utcnow()
    session.flush()
    batch = session.get(CycleBatch, cycle.batch_id)
    batch_cycles = session.exec(select(Cycle).where(Cycle.batch_id == cycle.batch_id)).all()
    if batch and batch_cycles and all(item.status == "handed_over" for item in batch_cycles):
        vendor = session.get(User, batch.vendor_id)
        if vendor:
            session.add(
                Notification(
                    recipient_id=vendor.officer_id,
                    notif_type="vendor_payment",
                    title_en=f"Batch {batch.batch_code} is fully delivered",
                    title_gu=f"બેચ {batch.batch_code} સંપૂર્ણ પહોંચાડાયો",
                    body="The batch is eligible for vendor payment processing.",
                )
            )
    session.commit()
    return {
        "success": True,
        "serial_no": cycle.serial_no,
        "status": cycle.status,
        "handed_at": handover.handed_at.isoformat(),
    }


@router.get("/cycles/overview")
def cycles_overview(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role not in ("school", "taluka", "deo", "admin", "vendor"):
        raise HTTPException(403)
    batches = session.exec(select(CycleBatch)).all()
    cycles = session.exec(select(Cycle)).all()
    return {
        "ordered": sum(b.qty for b in batches),
        "dispatched": sum(
            b.qty for b in batches if b.status in ("dispatched", "received", "partial")
        ),
        "received": sum(b.received_qty for b in batches),
        "delivered": sum(c.status == "handed_over" for c in cycles),
        "batches": [
            {
                "id": b.id,
                "batch_code": b.batch_code,
                "status": b.status,
                "qty": b.qty,
                "received_qty": b.received_qty,
                "gps": json.loads(b.gps_json or "[]"),
            }
            for b in batches
        ],
    }
