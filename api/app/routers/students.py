"""app/routers/students.py — student profile, schemes, cycle, payments."""

from __future__ import annotations
import hashlib
import io
import re
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing
from reportlab.graphics import renderPDF
from sqlmodel import Session, select
from app.db import get_session
from app.deps import get_current_user, CurrentUser
from app.models.core import Student, BankAccount, Application, DbtTxn, Handover, Cycle, Notification, AuditLog
from app.config import get_settings
from app.security import sha256_chain
from app.services.eligibility import evaluate_all_schemes

router = APIRouter(prefix="/students", tags=["students"])
settings = get_settings()


class BankAccountInput(BaseModel):
    holder_type: str = "student"
    holder_name: str
    account_number: str
    ifsc: str
    bank_name: str


def _student_audit(session: Session, actor: str, action: str, entity: str, entity_id: str, payload: dict):
    import json

    previous = session.exec(select(AuditLog).order_by(AuditLog.id.desc())).first()
    previous_hash = previous.hash if previous and previous.hash else "genesis"
    serialized = json.dumps(payload, sort_keys=True, default=str)
    chain_payload = f"{actor}:student:{action}:{entity}:{entity_id}:{serialized}"
    session.add(AuditLog(
        actor_id=actor,
        role="student",
        action=action,
        entity=entity,
        entity_id=entity_id,
        after_json=serialized,
        prev_hash=previous_hash,
        hash=sha256_chain(previous_hash, chain_payload),
    ))


def _student_id_for(user: CurrentUser, session: Session) -> Student:
    if user.role != "student":
        raise HTTPException(403, "Student role required")
    student = session.exec(select(Student).where(Student.cts_id == user.sub)).first()
    if not student:
        raise HTTPException(404, "Student not found")
    return student


@router.get("/me")
def get_my_profile(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    student = _student_id_for(user, session)
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
                    "id": txn.id,
                    "application_id": txn.application_id,
                    "app_code": app.app_code if app else "",
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


@router.get("/me/bank")
def get_my_bank(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    student = _student_id_for(user, session)
    accounts = session.exec(select(BankAccount).where(BankAccount.student_id == student.id)).all()
    return {
        "items": [
            {
                "id": account.id,
                "holder_type": account.holder_type,
                "holder_name": account.holder_name,
                "last4": account.last4,
                "ifsc": account.ifsc,
                "bank_name": account.bank_name,
                "verified": account.verified,
                "aadhaar_seeded": account.aadhaar_seeded,
            }
            for account in accounts
        ]
    }


@router.post("/me/bank")
def add_my_bank(
    body: BankAccountInput,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    student = _student_id_for(user, session)
    digits = re.sub(r"\D", "", body.account_number)
    if not 9 <= len(digits) <= 18 or not re.fullmatch(r"[A-Z]{4}0[A-Z0-9]{6}", body.ifsc.upper()):
        raise HTTPException(422, "Enter a valid account number and IFSC")
    account_hash = hashlib.sha256(f"{settings.jwt_secret}:{digits}".encode()).hexdigest()
    duplicate = session.exec(select(BankAccount).where(BankAccount.account_hash == account_hash)).first()
    if duplicate and duplicate.student_id != student.id:
        raise HTTPException(409, "This bank account is already linked to another profile")
    account = duplicate or BankAccount(
        student_id=student.id,
        holder_type=body.holder_type,
        holder_name=body.holder_name.strip(),
        account_hash=account_hash,
        last4=digits[-4:],
        ifsc=body.ifsc.upper(),
        bank_name=body.bank_name.strip(),
        verified=False,
        aadhaar_seeded=any(
            existing.aadhaar_seeded and existing.holder_type == body.holder_type
            for existing in session.exec(select(BankAccount).where(BankAccount.student_id == student.id)).all()
        ),
    )
    if not duplicate:
        session.add(account)
    _student_audit(session, student.cts_id, "bank_account_added", "BankAccount", f"{student.cts_id}:{digits[-4:]}", {"last4": digits[-4:], "ifsc": body.ifsc.upper()})
    session.add(Notification(recipient_id=student.cts_id, notif_type="bank", title_en="Bank account added", title_gu="બેંક ખાતું ઉમેરાયું", body="Verify the account using the demo penny-drop check."))
    session.commit()
    session.refresh(account)
    return {"id": account.id, "last4": account.last4, "ifsc": account.ifsc, "verified": account.verified, "aadhaar_seeded": account.aadhaar_seeded}


@router.post("/me/bank/verify")
def verify_my_bank(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    student = _student_id_for(user, session)
    account = session.exec(select(BankAccount).where(BankAccount.student_id == student.id).order_by(BankAccount.id.desc())).first()
    if not account:
        raise HTTPException(404, "Add a bank account first")
    account.verified = True
    _student_audit(session, student.cts_id, "bank_account_verified_demo", "BankAccount", str(account.id), {"last4": account.last4})
    session.add(Notification(recipient_id=student.cts_id, notif_type="bank", title_en="Bank account verified (demo)", title_gu="બેંક ખાતું ચકાસાયું (ડેમો)", body=f"Demo penny-drop verification completed for account ending {account.last4}."))
    session.commit()
    return {"verified": True, "simulated": True, "id": account.id, "last4": account.last4}


@router.get("/me/id-card.pdf")
def download_student_id_card(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    student = _student_id_for(user, session)
    stream = io.BytesIO()
    pdf = canvas.Canvas(stream, pagesize=A4)
    width, height = A4
    pdf.setTitle("Vidya Pragati Setu Student ID")
    pdf.setFillColorRGB(0.08, 0.35, 0.28)
    pdf.roundRect(48, height - 260, width - 96, 205, 16, fill=1, stroke=0)
    pdf.setFillColorRGB(1, 1, 1)
    pdf.setFont("Helvetica-Bold", 19)
    pdf.drawString(70, height - 95, "VIDYA PRAGATI SETU")
    pdf.setFont("Helvetica", 11)
    pdf.drawString(70, height - 117, "Student digital identity card · DEMO")
    pdf.setFont("Helvetica-Bold", 15)
    pdf.drawString(70, height - 160, student.name_en)
    pdf.setFont("Helvetica", 11)
    pdf.drawString(70, height - 183, f"CTS ID: {student.cts_id}")
    pdf.drawString(70, height - 202, f"Grade {student.grade} · School ID {student.school_id}")
    qr = QrCodeWidget(f"VPS-STUDENT|{student.cts_id}")
    bounds = qr.getBounds()
    drawing = Drawing(92, 92, transform=[92 / (bounds[2] - bounds[0]), 0, 0, 92 / (bounds[3] - bounds[1]), 0, 0])
    drawing.add(qr)
    renderPDF.draw(drawing, pdf, width - 155, height - 230)
    pdf.setFillColorRGB(0.3, 0.3, 0.3)
    pdf.setFont("Helvetica", 10)
    pdf.drawString(56, height - 292, "Demo QR contains a CTS reference only. Government identity providers are not connected.")
    pdf.save()
    stream.seek(0)
    return StreamingResponse(stream, media_type="application/pdf", headers={"Content-Disposition": f'attachment; filename="student-id-{student.cts_id}.pdf"'})
