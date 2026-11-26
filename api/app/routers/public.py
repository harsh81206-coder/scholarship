"""Public, privacy-preserving trust endpoints used by verify/help/transparency."""

from __future__ import annotations

import csv
import hashlib
import io

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlmodel import Session, select, func

from app.db import get_session
from app.models.core import Application, DbtTxn, Grievance, School, Student, Taluka

router = APIRouter(prefix="/public", tags=["public"])


@router.get("/transparency")
def transparency(session: Session = Depends(get_session)):
    districts = session.exec(select(Taluka.district_id, func.count(Taluka.id)).group_by(Taluka.district_id)).all()
    credited = session.exec(select(DbtTxn).where(DbtTxn.status == "credited")).all()
    applications = session.exec(select(Application)).all()
    grievances = session.exec(select(Grievance)).all()
    schools = session.exec(select(func.count(School.id))).one()
    students = session.exec(select(func.count(Student.id))).one()
    return {
        "district_count": len(districts),
        "school_count": schools,
        "student_count": students,
        "application_count": len(applications),
        "credited_count": len(credited),
        "total_disbursed": sum(txn.amount for txn in credited),
        "grievance_count": len(grievances),
        "grievances_resolved": sum(grievance.status == "resolved" for grievance in grievances),
        "items": [
            {
                "metric": "applications",
                "value": len(applications),
                "label": "Scholarship applications",
            },
            {
                "metric": "credited",
                "value": len(credited),
                "label": "Payments credited",
            },
        ],
        "privacy": "Aggregated public statistics; no personal records are included.",
    }


@router.get("/transparency.csv")
def transparency_csv(session: Session = Depends(get_session)):
    data = transparency(session)
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["metric", "value"])
    for key in (
        "district_count",
        "school_count",
        "student_count",
        "application_count",
        "credited_count",
        "total_disbursed",
        "grievance_count",
        "grievances_resolved",
    ):
        writer.writerow([key, data[key]])
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="vps-transparency.csv"'},
    )


@router.get("/status/{application_code}")
def public_application_status(
    application_code: str, session: Session = Depends(get_session)
):
    application = session.exec(
        select(Application).where(Application.app_code == application_code)
    ).first()
    if not application:
        raise HTTPException(404, "No application matched that reference")
    student = session.get(Student, application.student_id)
    name = student.name_en if student else "Student"
    masked = f"{name[:1]}***"
    return {
        "app_code": application.app_code,
        "student": masked,
        "status": application.status,
        "updated_at": application.updated_at.isoformat()
        if application.updated_at
        else application.created_at.isoformat(),
    }


@router.get("/verify/{code}")
def verify_code(code: str, session: Session = Depends(get_session)):
    from app.models.core import Certificate

    certificate = session.exec(
        select(Certificate).where(Certificate.code == code)
    ).first()
    if certificate:
        return {
            "valid": True,
            "code": certificate.code,
            "kind": certificate.kind,
            "issued_at": certificate.issued_at.isoformat(),
            "reference": certificate.ref_id,
            "hash": certificate.hash,
        }

    if code.startswith("DBT-") and code[4:].isdigit():
        txn = session.get(DbtTxn, int(code[4:]))
        if txn:
            application = session.get(Application, txn.application_id)
            student = session.get(Student, application.student_id) if application else None
            payload = f"{txn.id}|{txn.status}|{txn.amount}|{txn.utr or ''}"
            return {
                "valid": True,
                "code": code,
                "kind": "payment_receipt",
                "issued_at": (txn.credited_at or txn.initiated_at).isoformat(),
                "reference": application.app_code if application else "",
                "student": f"{student.name_en[:1]}***" if student else "Student",
                "amount": txn.amount,
                "status": txn.status,
                "hash": hashlib.sha256(payload.encode()).hexdigest(),
            }
    return {"valid": False, "code": code, "reason": "not_found"}
