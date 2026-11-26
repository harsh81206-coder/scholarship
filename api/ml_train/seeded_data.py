"""Load deterministic training rows from the seeded demo SQLite database."""

from __future__ import annotations

import numpy as np
from sqlmodel import Session, select

from app.db import engine
from app.models.core import (
    AcademicRecord,
    Application,
    Cycle,
    CycleBatch,
    Family,
    Grievance,
    Handover,
    School,
    Student,
)


def dropout_rows() -> tuple[np.ndarray, np.ndarray] | None:
    """Return feature rows and proxy labels from the seeded academic history."""
    with Session(engine) as session:
        students = session.exec(select(Student).order_by(Student.id)).all()
        if not students:
            return None
        records = session.exec(
            select(AcademicRecord).order_by(
                AcademicRecord.student_id, AcademicRecord.record_month
            )
        ).all()
        families = session.exec(select(Family)).all()
        applications = session.exec(select(Application)).all()
        grievances = session.exec(select(Grievance)).all()
        handovers = session.exec(select(Handover)).all()

    records_by_student: dict[int, list[AcademicRecord]] = {}
    for record in records:
        records_by_student.setdefault(record.student_id, []).append(record)
    income_by_student = {family.student_id: family.annual_income for family in families}
    apps_by_student: dict[int, list[Application]] = {}
    for application in applications:
        apps_by_student.setdefault(application.student_id, []).append(application)
    grievances_by_student: dict[int, int] = {}
    for grievance in grievances:
        grievances_by_student[grievance.student_id] = (
            grievances_by_student.get(grievance.student_id, 0) + 1
        )
    delivered_by_student = {handover.student_id for handover in handovers if handover.otp_verified}

    gender_codes = {"female": 0.0, "male": 1.0, "other": 0.5}
    caste_codes = {"general": 0.0, "obc": 1.0, "sebc": 1.0, "sc": 2.0, "st": 3.0}
    features: list[list[float]] = []
    labels: list[int] = []
    for student in students:
        history = records_by_student.get(student.id or -1, [])
        if not history:
            continue
        latest, earliest = history[-1], history[0]
        divisor = max(1, len(history) - 1)
        attendance_trend = (latest.attendance_pct - earliest.attendance_pct) / divisor
        marks_trend = (latest.marks_pct - earliest.marks_pct) / divisor
        student_apps = apps_by_student.get(student.id or -1, [])
        benefit_received = float(
            any(app.status in ("sanctioned", "dbt_initiated", "credited") for app in student_apps)
        )
        attendance_change = latest.attendance_pct - earliest.attendance_pct
        # The demo has no observed dropout outcome labels. This documented proxy
        # identifies simulated academic disengagement for the local model demo.
        risk_proxy = (
            latest.attendance_pct < 75
            or (attendance_change <= -8 and latest.attendance_pct < 85)
            or (latest.marks_pct < 40 and marks_trend < 0)
        )
        features.append(
            [
                latest.attendance_pct,
                attendance_trend,
                latest.marks_pct,
                marks_trend,
                float(income_by_student.get(student.id or -1, 90000)),
                student.distance_km,
                gender_codes.get((student.gender or "").lower(), 0.0),
                caste_codes.get((student.caste_category or "").lower(), 0.0),
                float(student.grade),
                float(student.distance_km > 3),
                benefit_received,
                float(grievances_by_student.get(student.id or -1, 0)),
                float(student.id in delivered_by_student),
            ]
        )
        labels.append(int(risk_proxy))
    if len(set(labels)) < 2:
        return None
    return np.asarray(features, dtype=float), np.asarray(labels, dtype=int)


def fraud_rows() -> np.ndarray | None:
    """Return application amount, grade, and distance features from the seed."""
    with Session(engine) as session:
        rows = session.exec(
            select(Application, Student)
            .join(Student, Student.id == Application.student_id)
            .order_by(Application.id)
        ).all()
    if not rows:
        return None
    return np.asarray(
        [[float(application.amount), float(student.grade), student.distance_km]
         for application, student in rows],
        dtype=float,
    )


def forecast_rows() -> tuple[np.ndarray, np.ndarray] | None:
    """Fit forecast inputs to seeded cycle allocation counts by school."""
    with Session(engine) as session:
        schools = session.exec(select(School).order_by(School.id)).all()
        students = session.exec(select(Student)).all()
        cycle_rows = session.exec(
            select(Cycle, CycleBatch).join(CycleBatch, CycleBatch.id == Cycle.batch_id)
        ).all()
    if not schools or not cycle_rows:
        return None
    girls_by_school: dict[int, int] = {}
    for student in students:
        if student.grade == 9 and student.gender == "female":
            girls_by_school[student.school_id] = girls_by_school.get(student.school_id, 0) + 1
    cycles_by_school: dict[int, int] = {}
    for cycle, batch in cycle_rows:
        cycles_by_school[batch.school_id] = cycles_by_school.get(batch.school_id, 0) + 1

    rows: list[list[float]] = []
    targets: list[float] = []
    for school in schools:
        girls = girls_by_school.get(school.id or -1, 0)
        allocated = cycles_by_school.get(school.id or -1, 0)
        uptake = min(1.0, allocated / max(1, girls))
        rows.append([float(girls), float(uptake)])
        targets.append(float(allocated))
    return np.asarray(rows, dtype=float), np.asarray(targets, dtype=float)
