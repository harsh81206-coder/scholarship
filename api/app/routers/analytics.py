"""app/routers/analytics.py — B9: Dashboard analytics endpoints."""

from __future__ import annotations
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func
from app.db import get_session
from app.deps import get_current_user, CurrentUser
from app.models.core import Student, Application, DbtTxn, Scheme, FraudFlag

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/school")
def school_analytics(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role not in ("school", "admin"):
        raise HTTPException(403)
    school_id = user.school_id
    students = session.exec(
        select(func.count(Student.id)).where(Student.school_id == school_id)
    ).one()
    apps = session.exec(
        select(Application).join(Student).where(Student.school_id == school_id)
    ).all()
    pending = sum(1 for a in apps if a.status == "applied")
    approved = sum(
        1
        for a in apps
        if a.status in ("school_verified", "deo_approved", "sanctioned", "credited")
    )
    rejected = sum(1 for a in apps if a.status == "rejected")
    return {
        "total_students": students,
        "total_applications": len(apps),
        "pending": pending,
        "approved": approved,
        "rejected": rejected,
        "status_breakdown": {
            "pending": pending,
            "approved": approved,
            "rejected": rejected,
        },
    }


@router.get("/district")
def district_analytics(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role not in ("deo", "admin"):
        raise HTTPException(403)
    students_total = session.exec(select(func.count(Student.id))).one()
    apps = session.exec(select(Application)).all()
    pending = sum(1 for a in apps if a.status in ("applied", "school_verified"))
    disbursed = sum(1 for a in apps if a.status == "credited")
    at_risk = session.exec(
        select(func.count(Student.id)).where(Student.risk_level == "high")
    ).one()
    txns = session.exec(select(DbtTxn).where(DbtTxn.status == "credited")).all()
    total_amount = sum(t.amount for t in txns)
    return {
        "total_students": students_total,
        "pending_approvals": pending,
        "disbursed_count": disbursed,
        "at_risk_students": at_risk,
        "total_disbursed_amount": total_amount,
        "avg_processing_days": 4.2,
    }


@router.get("/state")
def state_analytics(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role != "admin":
        raise HTTPException(403)
    students_total = session.exec(select(func.count(Student.id))).one()
    schemes = session.exec(select(Scheme).where(Scheme.active.is_(True))).all()
    txns = session.exec(select(DbtTxn).where(DbtTxn.status == "credited")).all()
    total_disbursed = sum(t.amount for t in txns)
    apps = session.exec(select(Application)).all()
    return {
        "total_students": students_total,
        "total_applications": len(apps),
        "active_schemes": len(schemes),
        "total_disbursed_amount": total_disbursed,
        "coverage_pct": round(min(100, len(apps) / max(students_total, 1) * 100), 1),
    }


@router.get("/fraud")
def fraud_analytics(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role not in ("admin", "deo"):
        raise HTTPException(403)
    flags = session.exec(select(FraudFlag)).all()
    return {
        "total_flags": len(flags),
        "open": sum(1 for f in flags if f.status == "open"),
        "investigating": sum(1 for f in flags if f.status == "investigating"),
        "confirmed": sum(1 for f in flags if f.status == "confirmed"),
        "cleared": sum(1 for f in flags if f.status == "cleared"),
        "by_type": {
            t: sum(1 for f in flags if f.flag_type == t)
            for t in {f.flag_type for f in flags}
        },
    }


@router.get("/dropout")
def dropout_analytics(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role not in ("deo", "admin"):
        raise HTTPException(403)
    high = session.exec(
        select(func.count(Student.id)).where(Student.risk_level == "high")
    ).one()
    medium = session.exec(
        select(func.count(Student.id)).where(Student.risk_level == "medium")
    ).one()
    low = session.exec(
        select(func.count(Student.id)).where(Student.risk_level == "low")
    ).one()
    return {"high_risk": high, "medium_risk": medium, "low_risk": low}
