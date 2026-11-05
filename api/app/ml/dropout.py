"""app/ml/dropout.py — Dropout risk ML & rule scoring with explainability."""

from __future__ import annotations
from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.db import get_session
from app.models.core import (
    Student,
    AcademicRecord,
    Family,
    Application,
    Grievance,
    Handover,
    School,
    Taluka,
)
from app.deps import get_current_user, CurrentUser
from app.ml.registry import registry

router = APIRouter(prefix="/ml/dropout", tags=["dropout"])


def _extract_features(student: Student, session: Session) -> dict[str, Any]:
    # 1. Academic records
    recs = session.exec(
        select(AcademicRecord)
        .where(AcademicRecord.student_id == student.id)
        .order_by(AcademicRecord.year.desc())  # type: ignore[arg-type]
    ).all()

    att = recs[0].attendance_pct if recs else 70.0
    marks = recs[0].marks_pct if recs else 45.0

    att_trend = 0.0
    marks_trend = 0.0
    if len(recs) >= 2:
        att_trend = (recs[0].attendance_pct - recs[-1].attendance_pct) / max(
            1, len(recs) - 1
        )
        marks_trend = (recs[0].marks_pct - recs[-1].marks_pct) / max(1, len(recs) - 1)

    # 2. Family income
    fam = session.exec(select(Family).where(Family.student_id == student.id)).first()
    income = fam.annual_income if fam else 90000

    # 3. Encodings
    g_enc = {"female": 0.0, "male": 1.0, "other": 0.5}.get(
        (student.gender or "").lower(), 0.0
    )
    c_enc = {"general": 0.0, "obc": 1.0, "sebc": 1.0, "sc": 2.0, "st": 3.0}.get(
        (student.caste_category or "").lower(), 0.0
    )

    # 4. Rural & School distance
    is_rural = 1.0 if student.distance_km > 3.0 else 0.0

    # 5. Benefits & Grievances
    apps = session.exec(
        select(Application).where(Application.student_id == student.id)
    ).all()
    benefit_recv = (
        1.0
        if any(a.status in ("sanctioned", "dbt_initiated", "credited") for a in apps)
        else 0.0
    )

    grvs = session.exec(
        select(Grievance).where(Grievance.student_id == student.id)
    ).all()
    grv_count = len(grvs)

    handovers = session.exec(
        select(Handover).where(Handover.student_id == student.id)
    ).all()
    bicycle_deliv = 1.0 if any(h.otp_verified for h in handovers) else 0.0

    return {
        "attendance_pct": att,
        "attendance_trend": att_trend,
        "marks_pct": marks,
        "marks_trend": marks_trend,
        "annual_income": income,
        "distance_km": student.distance_km,
        "gender_enc": g_enc,
        "caste_enc": c_enc,
        "grade": student.grade,
        "is_rural": is_rural,
        "benefit_received": benefit_recv,
        "grievance_count": grv_count,
        "bicycle_delivered": bicycle_deliv,
    }


def score_student(student_id: int, session: Session) -> dict[str, Any]:
    """Calculates dropout risk score (0-100), risk_level, and top reasons."""
    student = session.get(Student, student_id)
    if not student:
        return {"score": 0.0, "risk_level": "low", "top_reasons": []}

    f = _extract_features(student, session)
    reasons: list[dict[str, Any]] = []

    # Rule-based calculations
    r_score = 0.0
    if f["attendance_pct"] < 75.0:
        r_score += 20.0
        reasons.append(
            {
                "feature": "attendance_pct",
                "contribution": 20.0,
                "label_en": f"Low attendance ({f['attendance_pct']}%)",
                "label_gu": f"ઓછી હાજરી ({f['attendance_pct']}%)",
            }
        )
    if f["marks_pct"] < 50.0:
        r_score += 20.0
        reasons.append(
            {
                "feature": "marks_pct",
                "contribution": 20.0,
                "label_en": f"Low marks ({f['marks_pct']}%)",
                "label_gu": f"ઓછા ગુણ ({f['marks_pct']}%)",
            }
        )
    if f["annual_income"] < 80000:
        r_score += 15.0
        reasons.append(
            {
                "feature": "annual_income",
                "contribution": 15.0,
                "label_en": f"Low family income (₹{f['annual_income']:,})",
                "label_gu": f"ઓછી કૌટુંબિક આવક (₹{f['annual_income']:,})",
            }
        )
    if f["distance_km"] > 5.0:
        r_score += 15.0
        reasons.append(
            {
                "feature": "distance_km",
                "contribution": 15.0,
                "label_en": f"Long distance ({f['distance_km']} km)",
                "label_gu": f"શાળાથી લાંબુ અંતર ({f['distance_km']} કિમી)",
            }
        )
    if f["grade"] == 9:
        r_score += 10.0
        reasons.append(
            {
                "feature": "grade",
                "contribution": 10.0,
                "label_en": "Critical transition class (Grade 9)",
                "label_gu": "સંક્રમણ વર્ગ (ધોરણ ૯)",
            }
        )
    if f["benefit_received"] == 0.0:
        r_score += 10.0
        reasons.append(
            {
                "feature": "benefit_received",
                "contribution": 10.0,
                "label_en": "No scholarship or benefit received",
                "label_gu": "કોઈ લાભ કે સહાય મળેલ નથી",
            }
        )
    if f["grievance_count"] > 0:
        r_score += 10.0
        reasons.append(
            {
                "feature": "grievance_count",
                "contribution": 10.0,
                "label_en": f"Unresolved grievances ({f['grievance_count']})",
                "label_gu": f"અનિર્ણિત ફરિયાદો ({f['grievance_count']})",
            }
        )

    final_score = r_score

    # ML Model check
    model = registry.get_dropout_model()
    if model is not None:
        try:
            vec = [
                [
                    f["attendance_pct"],
                    f["attendance_trend"],
                    f["marks_pct"],
                    f["marks_trend"],
                    float(f["annual_income"]),
                    f["distance_km"],
                    f["gender_enc"],
                    f["caste_enc"],
                    float(f["grade"]),
                    f["is_rural"],
                    f["benefit_received"],
                    float(f["grievance_count"]),
                    f["bicycle_delivered"],
                ]
            ]
            prob = model.predict_proba(vec)[0][1]
            final_score = round(float(prob) * 100.0, 1)
        except Exception:
            pass

    final_score = round(min(100.0, max(0.0, final_score)), 1)
    risk_level = (
        "high" if final_score >= 60.0 else ("medium" if final_score >= 30.0 else "low")
    )
    reasons.sort(key=lambda x: -x["contribution"])

    # Update cache on student model
    student.risk_score = final_score
    student.risk_level = risk_level
    session.add(student)

    return {"score": final_score, "risk_level": risk_level, "top_reasons": reasons}


# ── Router Endpoints ──────────────────────────────────────────────────────────


@router.get("/students")
def list_dropout_students(
    taluka: int | None = None,
    school: int | None = None,
    grade: int | None = None,
    gender: str | None = None,
    risk_level: str | None = None,
    page: int = 1,
    size: int = 20,
    session: Session = Depends(get_session),
    user: CurrentUser = Depends(get_current_user),
):
    stmt = select(Student)

    # RBAC Scoping
    if user.role == "school":
        stmt = stmt.where(Student.school_id == user.school_id)
    elif user.role == "taluka" and user.taluka_id:
        sch_ids = [
            s.id
            for s in session.exec(
                select(School).where(School.taluka_id == user.taluka_id)
            ).all()
        ]
        stmt = stmt.where(Student.school_id.in_(sch_ids))  # type: ignore[attr-defined]
    elif user.role == "deo" and user.district_id:
        taluka_ids = [
            t.id
            for t in session.exec(
                select(Taluka).where(Taluka.district_id == user.district_id)
            ).all()
        ]
        sch_ids = [
            s.id
            for s in session.exec(
                select(School).where(School.taluka_id.in_(taluka_ids))
            ).all()
        ]  # type: ignore[attr-defined]
        stmt = stmt.where(Student.school_id.in_(sch_ids))  # type: ignore[attr-defined]

    if school:
        stmt = stmt.where(Student.school_id == school)
    if taluka:
        sch_ids = [
            s.id
            for s in session.exec(
                select(School).where(School.taluka_id == taluka)
            ).all()
        ]
        stmt = stmt.where(Student.school_id.in_(sch_ids))  # type: ignore[attr-defined]
    if grade:
        stmt = stmt.where(Student.grade == grade)
    if gender:
        stmt = stmt.where(Student.gender == gender)
    if risk_level:
        stmt = stmt.where(Student.risk_level == risk_level)

    all_students = session.exec(stmt).all()
    total = len(all_students)
    paged = all_students[(page - 1) * size : page * size]

    items = []
    for s in paged:
        scored = score_student(s.id, session)  # type: ignore[arg-type]
        items.append(
            {
                "id": s.id,
                "cts_id": s.cts_id,
                "name_en": s.name_en,
                "name_gu": s.name_gu,
                "gender": s.gender,
                "grade": s.grade,
                "school_id": s.school_id,
                "score": scored["score"],
                "risk_level": scored["risk_level"],
                "top_reasons": scored["top_reasons"][:3],
            }
        )

    session.commit()
    return {"items": items, "total": total, "page": page, "size": size}


@router.get("/students/{cts_id}")
def get_dropout_profile(
    cts_id: str,
    session: Session = Depends(get_session),
    user: CurrentUser = Depends(get_current_user),
):
    student = session.exec(select(Student).where(Student.cts_id == cts_id)).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Scoping check
    if user.role == "student" and user.sub != student.cts_id:
        raise HTTPException(status_code=403, detail="Access denied")
    if user.role == "school" and user.school_id != student.school_id:
        raise HTTPException(status_code=403, detail="Access denied to other schools")

    f = _extract_features(student, session)
    scored = score_student(student.id, session)  # type: ignore[arg-type]

    bar_chart = [
        {
            "feature": "attendance_pct",
            "label_en": "Attendance",
            "label_gu": "હાજરી",
            "current": f["attendance_pct"],
            "benchmark": 75.0,
            "unit": "%",
        },
        {
            "feature": "marks_pct",
            "label_en": "Academic Marks",
            "label_gu": "ગુણ",
            "current": f["marks_pct"],
            "benchmark": 50.0,
            "unit": "%",
        },
        {
            "feature": "distance_km",
            "label_en": "Travel Distance",
            "label_gu": "અંતર",
            "current": f["distance_km"],
            "benchmark": 5.0,
            "unit": "km",
        },
        {
            "feature": "annual_income",
            "label_en": "Family Income",
            "label_gu": "કૌટુંબિક આવક",
            "current": f["annual_income"],
            "benchmark": 80000,
            "unit": "₹",
        },
    ]

    session.commit()
    return {
        "cts_id": student.cts_id,
        "name_en": student.name_en,
        "name_gu": student.name_gu,
        "grade": student.grade,
        "gender": student.gender,
        "distance_km": student.distance_km,
        "score": scored["score"],
        "risk_level": scored["risk_level"],
        "top_reasons": scored["top_reasons"],
        "bar_chart": bar_chart,
        "features": f,
    }
