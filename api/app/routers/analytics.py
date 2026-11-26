"""app/routers/analytics.py — B9: Dashboard analytics endpoints."""

from __future__ import annotations
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func
from app.db import get_session
from app.deps import get_current_user, CurrentUser
from app.models.core import (
    Application,
    CycleBatch,
    DbtTxn,
    FraudFlag,
    School,
    Scheme,
    Student,
    Taluka,
)

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/taluka")
def taluka_analytics(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role != "taluka" or not user.taluka_id:
        raise HTTPException(403, "Taluka officer role required")
    schools = session.exec(select(School).where(School.taluka_id == user.taluka_id)).all()
    school_ids = [school.id for school in schools]
    students = session.exec(select(Student).where(Student.school_id.in_(school_ids))).all() if school_ids else []
    student_ids = [student.id for student in students]
    applications = session.exec(select(Application).where(Application.student_id.in_(student_ids))).all() if student_ids else []
    batches = session.exec(select(CycleBatch).where(CycleBatch.school_id.in_(school_ids))).all() if school_ids else []
    return {
        "taluka_id": user.taluka_id,
        "school_count": len(schools),
        "student_count": len(students),
        "application_count": len(applications),
        "pending_approvals": sum(app.status in ("applied", "school_verified") for app in applications),
        "high_risk_students": sum(student.risk_level == "high" for student in students),
        "cycles_delivered": sum(batch.received_qty for batch in batches),
    }


@router.get("/taluka/schools")
def taluka_schools(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role != "taluka":
        raise HTTPException(403, "Taluka officer role required")
    return district_schools(user, session)


@router.get("/taluka/reports")
def taluka_reports(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role != "taluka" or not user.taluka_id:
        raise HTTPException(403, "Taluka officer role required")
    school_ids = [school.id for school in session.exec(select(School).where(School.taluka_id == user.taluka_id)).all()]
    students = session.exec(select(Student).where(Student.school_id.in_(school_ids))).all() if school_ids else []
    student_ids = [student.id for student in students]
    applications = session.exec(select(Application).where(Application.student_id.in_(student_ids))).all() if student_ids else []
    return {
        "taluka_id": user.taluka_id,
        "total_applications": len(applications),
        "pending": sum(app.status in ("applied", "school_verified") for app in applications),
        "approved": sum(app.status in ("taluka_approved", "deo_approved", "sanctioned", "credited") for app in applications),
        "rejected": sum(app.status == "rejected" for app in applications),
        "students_at_risk": sum(student.risk_level == "high" for student in students),
    }


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
    if user.role not in ("taluka", "deo", "admin"):
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
    if user.role not in ("taluka", "deo", "admin"):
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


@router.get("/district/schools")
def district_schools(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role not in ("taluka", "deo", "admin"):
        raise HTTPException(403, "District school data requires an officer role")
    query = select(School).join(Taluka)
    if user.role == "taluka":
        query = query.where(School.taluka_id == user.taluka_id)
    elif user.role == "deo":
        query = query.where(Taluka.district_id == user.district_id)
    schools = session.exec(query.order_by(School.name_en)).all()
    school_ids = [school.id for school in schools]
    if not school_ids:
        return {"items": [], "total": 0}
    students = session.exec(select(Student).where(Student.school_id.in_(school_ids))).all()
    student_ids = [student.id for student in students]
    applications = (
        session.exec(select(Application).where(Application.student_id.in_(student_ids))).all()
        if student_ids
        else []
    )
    batches = session.exec(select(CycleBatch).where(CycleBatch.school_id.in_(school_ids))).all()
    talukas = {taluka.id: taluka for taluka in session.exec(select(Taluka)).all()}
    students_by_school: dict[int, list[Student]] = {}
    for student in students:
        students_by_school.setdefault(student.school_id, []).append(student)
    apps_by_school: dict[int, list[Application]] = {}
    students_by_id = {student.id: student for student in students}
    for application in applications:
        student = students_by_id.get(application.student_id)
        if student:
            apps_by_school.setdefault(student.school_id, []).append(application)
    batches_by_school: dict[int, list[CycleBatch]] = {}
    for batch in batches:
        batches_by_school.setdefault(batch.school_id, []).append(batch)
    items = []
    for school in schools:
        school_students = students_by_school.get(school.id, [])
        school_apps = apps_by_school.get(school.id, [])
        school_batches = batches_by_school.get(school.id, [])
        items.append(
            {
                "school_id": school.id,
                "udise_code": school.udise_code,
                "name_en": school.name_en,
                "name_gu": school.name_gu,
                "taluka_id": school.taluka_id,
                "taluka_name": talukas.get(school.taluka_id).name if school.taluka_id in talukas else "",
                "student_count": len(school_students),
                "high_risk_count": sum(student.risk_level == "high" for student in school_students),
                "application_count": len(school_apps),
                "pending_count": sum(application.status in ("applied", "school_verified") for application in school_apps),
                "credited_count": sum(application.status == "credited" for application in school_apps),
                "cycle_batches": len(school_batches),
                "cycles_delivered": sum(batch.received_qty for batch in school_batches),
            }
        )
    return {"items": items, "total": len(items)}


@router.get("/state/ranking")
def state_ranking(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role != "admin":
        raise HTTPException(403, "State rankings require an admin role")
    result = district_schools(
        CurrentUser(user.sub, "admin", user.name, None, None, None), session
    )
    schools = result["items"]
    for school in schools:
        total = school["application_count"]
        school["score"] = round(
            100 * school["credited_count"] / max(total, 1), 1
        )
    schools.sort(key=lambda item: (item["score"], item["student_count"]), reverse=True)
    for rank, school in enumerate(schools, start=1):
        school["rank"] = rank
    return {"items": schools, "total": len(schools), "metric": "credited_application_rate"}
