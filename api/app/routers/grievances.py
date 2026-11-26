"""app/routers/grievances.py — B8: Grievances + messages."""

from __future__ import annotations
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from pydantic import BaseModel
from app.db import get_session
from app.deps import get_current_user, CurrentUser
from app.models.core import Grievance, GrievanceMessage, School, Student, Taluka, Setting
import random
import string
import json

router = APIRouter(prefix="/grievances", tags=["grievances"])


def _get_sla_days(session: Session) -> int:
    s = session.get(Setting, "SLA_DAYS_GRIEVANCE")
    if s:
        return json.loads(s.value_json)
    return 7


def _assert_visible(grievance: Grievance, user: CurrentUser, session: Session) -> None:
    if user.role == "admin":
        return
    student = session.get(Student, grievance.student_id)
    if user.role == "student" and student and student.cts_id == user.sub:
        return
    if user.role == "school" and student and student.school_id == user.school_id:
        return
    school = session.get(School, student.school_id) if student else None
    if user.role == "taluka" and school and school.taluka_id == user.taluka_id:
        return
    taluka = session.get(Taluka, school.taluka_id) if school else None
    if user.role == "deo" and taluka and taluka.district_id == user.district_id:
        return
    raise HTTPException(403, "Grievance is outside the caller's scope")


class GrievanceCreate(BaseModel):
    category: str = "other"
    description: str
    related_application_id: int | None = None


class MessageCreate(BaseModel):
    text: str


class GrievanceUpdate(BaseModel):
    status: str | None = None
    assignee_id: int | None = None


@router.post("")
def create_grievance(
    body: GrievanceCreate,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role != "student":
        raise HTTPException(403, "Only students can raise grievances")
    student = session.exec(select(Student).where(Student.cts_id == user.sub)).first()
    if not student:
        raise HTTPException(404, "Student not found")
    sla = _get_sla_days(session)
    code = "GRV-" + "".join(random.choices(string.digits, k=8))
    g = Grievance(
        grv_code=code,
        student_id=student.id,
        category=body.category,  # type: ignore
        description=body.description,
        related_application_id=body.related_application_id,
        sla_due=datetime.utcnow() + timedelta(days=sla),
    )
    session.add(g)
    session.commit()
    return {
        "success": True,
        "grv_code": code,
        "sla_due": g.sla_due.isoformat() if g.sla_due else None,
    }


@router.get("/me")
def my_grievances(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role != "student":
        raise HTTPException(403, "Only students")
    student = session.exec(select(Student).where(Student.cts_id == user.sub)).first()
    if not student:
        raise HTTPException(404)
    grvs = session.exec(
        select(Grievance)
        .where(Grievance.student_id == student.id)
        .order_by(Grievance.created_at.desc())
    ).all()  # type: ignore
    return [_grv_dict(g) for g in grvs]


@router.get("")
def list_grievances(
    status: str | None = None,
    category: str | None = None,
    page: int = 1,
    size: int = 20,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    q = select(Grievance)
    if user.role == "student":
        raise HTTPException(403, "Use the student grievance list")
    if user.role == "school":
        q = q.join(Student).where(Student.school_id == user.school_id)
    elif user.role == "taluka":
        q = q.join(Student).join(School).where(School.taluka_id == user.taluka_id)
    elif user.role == "deo":
        q = q.join(Student).join(School).join(Taluka).where(Taluka.district_id == user.district_id)
    elif user.role != "admin":
        raise HTTPException(403, "Role not permitted to list grievances")
    if status:
        q = q.where(Grievance.status == status)
    if category:
        q = q.where(Grievance.category == category)
    total = len(session.exec(q).all())
    items = session.exec(q.offset((page - 1) * size).limit(size)).all()
    return {
        "items": [_grv_dict(g) for g in items],
        "total": total,
        "page": page,
        "size": size,
    }


@router.get("/{grv_code}")
def get_grievance(
    grv_code: str,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    g = session.exec(select(Grievance).where(Grievance.grv_code == grv_code)).first()
    if not g:
        raise HTTPException(404)
    _assert_visible(g, user, session)
    msgs = session.exec(
        select(GrievanceMessage).where(GrievanceMessage.grievance_id == g.id)
    ).all()
    result = _grv_dict(g)
    result["messages"] = [
        {"author": m.author_id, "text": m.text, "at": m.created_at.isoformat()}
        for m in msgs
    ]
    return result


@router.patch("/{grv_code}")
def update_grievance(
    grv_code: str,
    body: GrievanceUpdate,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    g = session.exec(select(Grievance).where(Grievance.grv_code == grv_code)).first()
    if not g:
        raise HTTPException(404)
    _assert_visible(g, user, session)
    if body.status:
        g.status = body.status
    if body.assignee_id:
        g.assignee_id = body.assignee_id
    g.updated_at = datetime.utcnow()
    session.commit()
    return {"success": True}


@router.post("/{grv_code}/messages")
def add_message(
    grv_code: str,
    body: MessageCreate,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    g = session.exec(select(Grievance).where(Grievance.grv_code == grv_code)).first()
    if not g:
        raise HTTPException(404)
    _assert_visible(g, user, session)
    msg = GrievanceMessage(grievance_id=g.id, author_id=user.sub, text=body.text)  # type: ignore
    session.add(msg)
    session.commit()
    return {"success": True}


def _grv_dict(g: Grievance) -> dict:
    return {
        "grv_code": g.grv_code,
        "category": g.category,
        "description": g.description,
        "status": g.status,
        "sla_due": g.sla_due.isoformat() if g.sla_due else None,
        "created_at": g.created_at.isoformat(),
        "updated_at": g.updated_at.isoformat(),
    }
