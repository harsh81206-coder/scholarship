"""app/routers/students.py — student profile, schemes, cycle, payments."""

from __future__ import annotations
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.db import get_session
from app.deps import get_current_user, CurrentUser
from app.models.core import Student, BankAccount, Application, DbtTxn, Handover, Cycle
from app.services.eligibility import evaluate_all_schemes

router = APIRouter(prefix="/students", tags=["students"])


@router.get("/me")
def get_my_profile(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role != "student":
        raise HTTPException(403, "Only students")
    student = session.exec(select(Student).where(Student.cts_id == user.sub)).first()
    if not student:
        raise HTTPException(404, "Student not found")
    bank = session.exec(
        select(BankAccount).where(BankAccount.student_id == student.id)
    ).first()
    return {
        "cts_id": student.cts_id,
        "name_en": student.name_en,
        "name_gu": student.name_gu,
        "dob": student.dob,
        "gender": student.gender,
        "caste_category": student.caste_category,
        "grade": student.grade,
        "stream": student.stream,
        "guardian_name": student.guardian_name,
        "guardian_consent": student.guardian_consent,
        "school_id": student.school_id,
        "school_name": student.school.name_en if student.school else "",
        "school_udise": student.school.udise_code if student.school else "",
        "bank": {
            "holder_name": bank.holder_name,
            "last4": bank.last4,
            "bank_name": bank.bank_name,
            "aadhaar_seeded": bank.aadhaar_seeded,
            "verified": bank.verified,
        }
        if bank
        else None,
        "completion_pct": _profile_completion(student, bank),
    }


def _profile_completion(student: Student, bank: BankAccount | None) -> int:
    score = 0
    if student.name_en:
        score += 15
    if student.dob:
        score += 10
    if student.gender:
        score += 10
    if student.caste_category:
        score += 10
    if student.guardian_consent:
        score += 15
    if bank:
        score += 20
    if student.mobile:
        score += 10
    if student.stream:
        score += 10
    return min(score, 100)


@router.get("/me/schemes")
def get_my_schemes(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role != "student":
        raise HTTPException(403, "Only students")
    student = session.exec(select(Student).where(Student.cts_id == user.sub)).first()
    if not student:
        raise HTTPException(404, "Student not found")
    return evaluate_all_schemes(student.id, session)  # type: ignore


@router.get("/me/payments")
def get_my_payments(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role != "student":
        raise HTTPException(403, "Only students")
    student = session.exec(select(Student).where(Student.cts_id == user.sub)).first()
    if not student:
        raise HTTPException(404, "Student not found")
    apps = session.exec(
        select(Application).where(Application.student_id == student.id)
    ).all()
    app_ids = [a.id for a in apps]
    txns = []
    for aid in app_ids:
        for txn in session.exec(
            select(DbtTxn).where(DbtTxn.application_id == aid)
        ).all():
            app = session.get(Application, txn.application_id)
            txns.append(
                {
                    "utr": txn.utr,
                    "amount": txn.amount,
                    "status": txn.status,
                    "scheme_name": app.scheme.name_en if app and app.scheme else "",
                    "bank_last4": "",
                    "initiated_at": txn.initiated_at.isoformat(),
                    "credited_at": txn.credited_at.isoformat()
                    if txn.credited_at
                    else None,
                    "failure_reason": txn.failure_reason,
                }
            )
    total_credited = sum(t["amount"] for t in txns if t["status"] == "credited")
    return {"total_credited": total_credited, "transactions": txns}


@router.get("/me/cycle")
def get_my_cycle(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role != "student":
        raise HTTPException(403, "Only students")
    student = session.exec(select(Student).where(Student.cts_id == user.sub)).first()
    if not student:
        raise HTTPException(404, "Student not found")
    cycle = session.exec(select(Cycle).where(Cycle.student_id == student.id)).first()
    if not cycle:
        return {"assigned": False}
    handover = session.exec(
        select(Handover).where(Handover.cycle_id == cycle.id)
    ).first()
    return {
        "assigned": True,
        "serial_no": cycle.serial_no,
        "status": cycle.status,
        "handover_pending": handover is not None and not handover.otp_verified,
        "otp_verified": handover.otp_verified if handover else False,
    }
