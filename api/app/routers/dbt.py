"""app/routers/dbt.py — B7: Mock PFMS DBT disbursement pipeline."""

from __future__ import annotations
import random
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlmodel import Session, select
from pydantic import BaseModel
from app.db import engine, get_session
from app.deps import get_current_user, CurrentUser
from app.models.core import Application, DbtTxn, Notification, BankAccount, Student

router = APIRouter(prefix="/dbt", tags=["dbt"])


def _gen_utr() -> str:
    return f"SBIN{random.randint(1000000000, 9999999999)}"


def _mock_pfms_process(txn_id: int) -> None:
    """Simulate async PFMS processing — 95% success."""
    import time

    time.sleep(random.uniform(0.5, 2.0))
    with Session(engine) as session:
        txn = session.get(DbtTxn, txn_id)
        if not txn:
            return
        app = session.get(Application, txn.application_id)
        student = session.get(Student, app.student_id) if app else None
        if random.random() < 0.95:
            txn.status = "credited"
            txn.utr = _gen_utr()
            txn.credited_at = datetime.utcnow()
            if app:
                app.status = "credited"
            if student:
                session.add(
                    Notification(
                        recipient_id=student.cts_id,
                        notif_type="dbt",
                        title_en=f"₹{txn.amount:,} credited!",
                        title_gu=f"₹{txn.amount:,} .",
                        body=f"UTR: {txn.utr}. Scheme: {app.scheme.name_en if app and app.scheme else ''}",
                    )
                )
        else:
            reasons = ["account_closed", "name_mismatch", "npci_not_seeded"]
            txn.status = "failed"
            txn.failure_reason = random.choice(reasons)
            if app:
                app.status = "correction_requested"
            if student:
                session.add(
                    Notification(
                        recipient_id=student.cts_id,
                        notif_type="dbt",
                        title_en="Bank correction required",
                        title_gu="બેંક વિગતો સુધારવી જરૂરી છે",
                        body=f"Payment failed ({txn.failure_reason}). Update bank details and ask an officer to retry.",
                    )
                )
        session.commit()


class SanctionRequest(BaseModel):
    application_ids: list[str]  # app_codes


class InitiateRequest(BaseModel):
    application_ids: list[str]
    idempotency_key: str | None = None


@router.post("/sanction")
def sanction(
    body: SanctionRequest,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role not in ("admin", "deo"):
        raise HTTPException(403)
    sanctioned = []
    for code in body.application_ids:
        app = session.exec(
            select(Application).where(Application.app_code == code)
        ).first()
        if app and app.status == "deo_approved":
            app.status = "sanctioned"
            sanctioned.append(code)
    session.commit()
    return {"sanctioned": sanctioned, "count": len(sanctioned)}


@router.post("/initiate")
def initiate(
    body: InitiateRequest,
    background: BackgroundTasks,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role not in ("admin", "deo"):
        raise HTTPException(403)
    initiated = []
    for code in body.application_ids:
        app = session.exec(
            select(Application).where(Application.app_code == code)
        ).first()
        if not app or app.status != "sanctioned":
            continue
        # Idempotency key is scoped per application, while the second guard
        # prevents payment duplication for a student/scheme/year even if an
        # administrator accidentally created a second application row.
        idem_key = f"{body.idempotency_key}:{code}" if body.idempotency_key else f"{code}-dbt"
        existing = session.exec(select(DbtTxn).where(DbtTxn.idempotency_key == idem_key)).first()
        if not existing:
            existing = session.exec(
                select(DbtTxn)
                .join(Application)
                .where(
                    Application.student_id == app.student_id,
                    Application.scheme_id == app.scheme_id,
                    Application.academic_year == app.academic_year,
                )
            ).first()
        if existing:
            initiated.append(
                {"app_code": code, "txn_id": existing.id, "status": existing.status}
            )
            continue
        # Bank verification
        banks = session.exec(
            select(BankAccount).where(BankAccount.student_id == app.student_id)
        ).all()
        student = session.get(Student, app.student_id)
        bank = next(
            (b for b in banks if student and student.gender == "female" and b.holder_type == "mother"),
            banks[0] if banks else None,
        )
        if not bank or not bank.verified or not bank.aadhaar_seeded:
            continue
        txn = DbtTxn(
            application_id=app.id,
            amount=app.amount,
            status="processing",
            batch_ref=f"BATCH-{datetime.utcnow():%Y%m%d}",
            idempotency_key=idem_key,
        )
        session.add(txn)
        session.flush()
        app.status = "dbt_initiated"
        session.commit()
        background.add_task(_mock_pfms_process, txn.id)
        initiated.append({"app_code": code, "txn_id": txn.id})
    return {"initiated": initiated, "count": len(initiated)}


@router.get("/transactions")
def list_transactions(
    status: str | None = None,
    page: int = 1,
    size: int = 20,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    q = select(DbtTxn)
    if status:
        q = q.where(DbtTxn.status == status)
    total = len(session.exec(q).all())
    items = session.exec(q.offset((page - 1) * size).limit(size)).all()
    return {
        "items": [
            {
                "id": t.id,
                "amount": t.amount,
                "status": t.status,
                "utr": t.utr,
                "failure_reason": t.failure_reason,
                "initiated_at": t.initiated_at.isoformat(),
            }
            for t in items
        ],
        "total": total,
        "page": page,
        "size": size,
    }


@router.get("/failed")
def failed_txns(session: Session = Depends(get_session)):
    items = session.exec(select(DbtTxn).where(DbtTxn.status == "failed")).all()
    return [
        {
            "id": t.id,
            "amount": t.amount,
            "failure_reason": t.failure_reason,
            "application_id": t.application_id,
            "initiated_at": t.initiated_at.isoformat(),
        }
        for t in items
    ]


@router.get("/receipt/{txn_id}")
def receipt(
    txn_id: int,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    txn = session.get(DbtTxn, txn_id)
    if not txn:
        raise HTTPException(404, "Transaction not found")
    app = session.get(Application, txn.application_id)
    student = session.get(Student, app.student_id) if app else None
    if user.role == "student" and (not student or student.cts_id != user.sub):
        raise HTTPException(403, "Receipt is outside your account")
    if user.role not in ("student", "school", "taluka", "deo", "admin"):
        raise HTTPException(403)
    return {
        "receipt_id": txn.id,
        "app_code": app.app_code if app else None,
        "student_name": student.name_en if student else "",
        "scheme": app.scheme.name_en if app and app.scheme else "",
        "amount": txn.amount,
        "status": txn.status,
        "utr": txn.utr,
        "initiated_at": txn.initiated_at.isoformat(),
        "credited_at": txn.credited_at.isoformat() if txn.credited_at else None,
    }


@router.post("/{txn_id}/retry")
def retry_txn(
    txn_id: int,
    background: BackgroundTasks,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role not in ("admin", "deo"):
        raise HTTPException(403, "Officer role required")
    txn = session.get(DbtTxn, txn_id)
    if not txn or txn.status != "failed":
        raise HTTPException(400, "Only failed txns can be retried")
    txn.status = "processing"
    app = session.get(Application, txn.application_id)
    if app:
        app.status = "dbt_initiated"
    session.commit()
    background.add_task(_mock_pfms_process, txn.id)
    return {"success": True, "txn_id": txn_id}


@router.get("/reconciliation")
def reconciliation(session: Session = Depends(get_session)):
    txns = session.exec(select(DbtTxn)).all()
    by_status = {}
    for t in txns:
        by_status[t.status] = by_status.get(t.status, 0) + 1
    total_amount = sum(t.amount for t in txns if t.status == "credited")
    return {
        "by_status": by_status,
        "total_credited": total_amount,
        "total_txns": len(txns),
    }
