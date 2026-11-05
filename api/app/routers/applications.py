"""app/routers/applications.py — B4: Application workflow + risk routing."""

from __future__ import annotations
import json
import random
import string
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from pydantic import BaseModel
from app.db import get_session
from app.deps import get_current_user, CurrentUser
from app.models.core import (
    Application,
    ApplicationEvent,
    AuditLog,
    Scheme,
    Student,
    BankAccount,
    Document,
    School,
    Taluka,
    Setting,
    Notification,
)
from app.security import sha256_chain
from app.services.eligibility import evaluate, store_result

router = APIRouter(tags=["applications"])

VALID_TRANSITIONS: dict[str, dict[str, list[str]]] = {
    "school": {"applied": ["school_verified", "rejected", "correction_requested"]},
    "taluka": {
        "school_verified": ["taluka_approved", "rejected", "correction_requested"]
    },
    "deo": {
        "taluka_approved": ["deo_approved", "rejected"],
        "school_verified": ["deo_approved", "rejected"],
    },
    "admin": {"deo_approved": ["sanctioned"], "sanctioned": ["dbt_initiated"]},
}


def _last_hash(session: Session, app_id: int) -> str:
    events = session.exec(
        select(ApplicationEvent)
        .where(ApplicationEvent.application_id == app_id)
        .order_by(ApplicationEvent.id.desc())  # type: ignore
    ).first()
    return events.hash if events else "genesis"


def _write_event(
    session: Session,
    app: Application,
    stage: str,
    actor: str,
    role: str,
    note: str,
    payload: dict,
) -> None:
    prev = _last_hash(session, app.id)  # type: ignore
    payload_str = json.dumps(payload, default=str)
    h = sha256_chain(prev, payload_str)
    ev = ApplicationEvent(
        application_id=app.id,  # type: ignore
        stage=stage,
        actor_id=actor,
        actor_role=role,
        note=note,
        payload_json=payload_str,
        prev_hash=prev,
        hash=h,
    )
    session.add(ev)
    last_audit = session.exec(select(AuditLog).order_by(AuditLog.id.desc())).first()
    audit_prev = last_audit.hash if last_audit and last_audit.hash else "genesis"
    audit_payload = f"{actor}:{role}:{stage}:Application:{app.app_code}:{payload_str}"
    session.add(
        AuditLog(
            actor_id=actor,
            role=role,
            action=stage,
            entity="Application",
            entity_id=app.app_code,
            after_json=payload_str,
            prev_hash=audit_prev,
            hash=sha256_chain(audit_prev, audit_payload),
        )
    )


def _compute_risk(student_id: int, scheme_id: int, session: Session) -> float:
    score = 0.0
    docs = session.exec(select(Document).where(Document.student_id == student_id)).all()
    if docs:
        avg_conf = sum(d.confidence for d in docs) / len(docs)
        score += 0.3 * (1 - avg_conf)
    else:
        score += 0.2
    banks = session.exec(
        select(BankAccount).where(BankAccount.student_id == student_id)
    ).all()
    if banks and not banks[0].aadhaar_seeded:
        score += 0.2
    return round(min(score, 1.0), 3)


def _setting_number(session: Session, key: str, default: float) -> float:
    row = session.get(Setting, key)
    if not row:
        return default
    try:
        return float(json.loads(row.value_json))
    except (TypeError, ValueError, json.JSONDecodeError):
        return default


def _risk_level(score: float, session: Session) -> str:
    taluka_threshold = _setting_number(session, "RISK_AUTO_THRESHOLD", 0.3)
    deo_threshold = _setting_number(session, "RISK_TALUKA_THRESHOLD", 0.6)
    if score < taluka_threshold:
        return "low"
    if score < deo_threshold:
        return "medium"
    return "high"


def _route(score: float, amount: int, session: Session) -> str:
    auto_threshold = _setting_number(session, "RISK_AUTO_THRESHOLD", 0.3)
    taluka_threshold = _setting_number(session, "RISK_TALUKA_THRESHOLD", 0.6)
    amount_limit = _setting_number(session, "AMOUNT_LIMIT_TALUKA", 10000)
    if amount > amount_limit:
        return "deo"
    if score < auto_threshold:
        return "auto"
    if score < taluka_threshold:
        return "taluka"
    return "deo"


def _assert_app_scope(app: Application, user: CurrentUser, session: Session) -> None:
    student = session.get(Student, app.student_id)
    if not student:
        raise HTTPException(404, "Student not found")
    allowed = False
    if user.role == "student":
        allowed = student.cts_id == user.sub
    elif user.role == "school":
        allowed = student.school_id == user.school_id
    elif user.role == "taluka":
        school = session.get(School, student.school_id)
        allowed = bool(school and school.taluka_id == user.taluka_id)
    elif user.role == "deo":
        school = session.get(School, student.school_id)
        taluka = session.get(Taluka, school.taluka_id) if school else None
        allowed = bool(taluka and taluka.district_id == user.district_id)
    elif user.role == "admin":
        allowed = True
    if not allowed:
        raise HTTPException(403, "Application is outside your scope")


def _gen_code() -> str:
    return "APP-" + "".join(random.choices(string.digits, k=10))


# ── Schemas ──────────────────────────────────────────────────────────────────
class BulkApplyRequest(BaseModel):
    scheme_codes: list[str]
    consent: bool = False


class ActionRequest(BaseModel):
    remark: str | None = None
    reason: str | None = None


class BulkApproveRequest(BaseModel):
    app_codes: list[str]
    remark: str | None = None


class CorrectionRequest(BaseModel):
    fields: list[str]
    note: str


class RenewalConsentRequest(BaseModel):
    consent: bool


# ── Endpoints ────────────────────────────────────────────────────────────────
@router.post("/applications/bulk")
def bulk_apply(
    body: BulkApplyRequest,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if not body.consent:
        raise HTTPException(400, "Consent required")
    if user.role != "student":
        raise HTTPException(403, "Only students can apply")

    student = session.exec(select(Student).where(Student.cts_id == user.sub)).first()
    if not student:
        raise HTTPException(404, "Student not found")

    created, skipped = [], []
    for code in body.scheme_codes:
        scheme = session.exec(select(Scheme).where(Scheme.code == code)).first()
        if not scheme:
            skipped.append({"scheme": code, "reason": "Scheme not found"})
            continue
        # Check eligibility
        result = evaluate(student.id, scheme, session)  # type: ignore
        store_result(student.id, scheme, result, session)  # type: ignore[arg-type]
        if result["status"] not in ("eligible", "pending_docs"):
            skipped.append(
                {
                    "scheme": code,
                    "reason": result["status"],
                    "reasons": result.get("reasons", []),
                }
            )
            continue
        # Idempotency
        existing = session.exec(
            select(Application).where(
                Application.student_id == student.id,
                Application.scheme_id == scheme.id,
                Application.academic_year == "2026-27",
            )
        ).first()
        if existing:
            skipped.append(
                {
                    "scheme": code,
                    "reason": "already_applied",
                    "app_code": existing.app_code,
                }
            )
            continue

        current_apps = session.exec(
            select(Application).where(
                Application.student_id == student.id,
                Application.academic_year == "2026-27",
                Application.status.not_in(("rejected", "consent_declined")),
            )
        ).all()
        conflict = None
        scheme_exclusions = json.loads(scheme.mutually_exclusive_with_json or "[]")
        for current in current_apps:
            current_scheme = session.get(Scheme, current.scheme_id)
            if current_scheme and (
                current_scheme.code in scheme_exclusions
                or scheme.code
                in json.loads(current_scheme.mutually_exclusive_with_json or "[]")
            ):
                conflict = current_scheme.code
                break
        if conflict:
            skipped.append(
                {
                    "scheme": code,
                    "reason": "stacking_conflict",
                    "conflicts_with": conflict,
                    "explanation": f"This scheme cannot be combined with {conflict}.",
                }
            )
            continue

        payout = json.loads(scheme.payout_json or "{}")
        amount = payout.get("amount", 0)
        risk = _compute_risk(student.id, scheme.id, session)  # type: ignore
        app_code = _gen_code()
        route = _route(risk, amount, session)
        audit_sample = route == "auto" and random.random() < (
            _setting_number(session, "AUTO_AUDIT_SAMPLE_PCT", 5.0) / 100
        )
        if audit_sample:
            route = "school"
        status = "applied" if audit_sample or route != "auto" else "auto_verified"
        app = Application(
            app_code=app_code,
            student_id=student.id,
            scheme_id=scheme.id,
            status=status,
            stage="school" if status == "applied" else "auto_verified",
            risk_score=risk,
            risk_level=_risk_level(risk, session),
            route=route,
            amount=amount,
            consent_at=datetime.now(timezone.utc),
            academic_year="2026-27",
        )
        session.add(app)
        session.flush()
        _write_event(
            session,
            app,
            status,
            user.sub,
            user.role,
            "Application selected for school audit"
            if audit_sample
            else "Application submitted",
            {"scheme": code, "route": route, "audit_sample": audit_sample},
        )
        if status == "auto_verified":
            session.add(
                Notification(
                    recipient_id=student.cts_id,
                    notif_type="application",
                    title_en=f"Application verified: {scheme.name_en}",
                    title_gu=f"અરજી ચકાસાઈ: {scheme.name_gu or scheme.name_en}",
                    body="Auto-verified. A sample may still be reviewed by an officer.",
                )
            )
        created.append(app_code)

    session.commit()
    return {"created": created, "skipped": skipped}


@router.get("/applications")
def list_applications(
    scheme: str | None = None,
    status: str | None = None,
    route: str | None = None,
    risk_level: str | None = None,
    page: int = 1,
    size: int = 20,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    q = select(Application)
    # Scope by role
    if user.role == "school" and user.school_id:
        students_in_school = session.exec(
            select(Student.id).where(Student.school_id == user.school_id)
        ).all()
        q = q.where(Application.student_id.in_(students_in_school))  # type: ignore
    elif user.role == "taluka":
        school_ids = session.exec(
            select(School.id).where(School.taluka_id == user.taluka_id)
        ).all()
        student_ids = session.exec(
            select(Student.id).where(Student.school_id.in_(school_ids))
        ).all()
        q = q.where(Application.student_id.in_(student_ids))
    elif user.role == "deo":
        taluka_ids = session.exec(
            select(Taluka.id).where(Taluka.district_id == user.district_id)
        ).all()
        school_ids = session.exec(
            select(School.id).where(School.taluka_id.in_(taluka_ids))
        ).all()
        student_ids = session.exec(
            select(Student.id).where(Student.school_id.in_(school_ids))
        ).all()
        q = q.where(Application.student_id.in_(student_ids))
    elif user.role == "student":
        student = session.exec(
            select(Student).where(Student.cts_id == user.sub)
        ).first()
        if student:
            q = q.where(Application.student_id == student.id)
    # Filters
    if scheme:
        s = session.exec(select(Scheme).where(Scheme.code == scheme)).first()
        if s:
            q = q.where(Application.scheme_id == s.id)
    if status:
        q = q.where(Application.status == status)
    if route:
        q = q.where(Application.route == route)
    if risk_level:
        q = q.where(Application.risk_level == risk_level)

    total = len(session.exec(q).all())
    apps = session.exec(q.offset((page - 1) * size).limit(size)).all()
    items = []
    for a in apps:
        items.append(
            {
                "app_code": a.app_code,
                "status": a.status,
                "stage": a.stage,
                "route": a.route,
                "risk_level": a.risk_level,
                "risk_score": a.risk_score,
                "amount": a.amount,
                "submitted_at": a.submitted_at.isoformat(),
                "scheme_code": a.scheme.code if a.scheme else "",
                "scheme_name_en": a.scheme.name_en if a.scheme else "",
                "student_name": a.student.name_en if a.student else "",
                "student_cts_id": a.student.cts_id if a.student else "",
            }
        )
    return {"items": items, "total": total, "page": page, "size": size}


@router.get("/applications/{app_code}")
def get_application(
    app_code: str,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    app = session.exec(
        select(Application).where(Application.app_code == app_code)
    ).first()
    if not app:
        raise HTTPException(404, "Application not found")
    _assert_app_scope(app, user, session)
    events = session.exec(
        select(ApplicationEvent)
        .where(ApplicationEvent.application_id == app.id)
        .order_by(ApplicationEvent.created_at)  # type: ignore
    ).all()
    return {
        "app_code": app.app_code,
        "status": app.status,
        "stage": app.stage,
        "route": app.route,
        "risk_score": app.risk_score,
        "risk_level": app.risk_level,
        "amount": app.amount,
        "submitted_at": app.submitted_at.isoformat(),
        "scheme": {"code": app.scheme.code, "name_en": app.scheme.name_en}
        if app.scheme
        else {},
        "student": {"name_en": app.student.name_en, "cts_id": app.student.cts_id}
        if app.student
        else {},
        "timeline": [
            {
                "stage": e.stage,
                "actor": e.actor_id,
                "note": e.note,
                "at": e.created_at.isoformat(),
            }
            for e in events
        ],
    }


@router.get("/applications/{app_code}/timeline")
def get_timeline(
    app_code: str,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    app = session.exec(
        select(Application).where(Application.app_code == app_code)
    ).first()
    if not app:
        raise HTTPException(404, "Application not found")
    _assert_app_scope(app, user, session)
    events = session.exec(
        select(ApplicationEvent)
        .where(ApplicationEvent.application_id == app.id)
        .order_by(ApplicationEvent.created_at)  # type: ignore
    ).all()
    return [
        {
            "stage": e.stage,
            "actor": e.actor_id,
            "role": e.actor_role,
            "note": e.note,
            "at": e.created_at.isoformat(),
            "hash": e.hash[:12],
        }
        for e in events
    ]


def _do_action(
    app_code: str, new_status: str, user: CurrentUser, session: Session, note: str = ""
):
    app = session.exec(
        select(Application).where(Application.app_code == app_code)
    ).first()
    if not app:
        raise HTTPException(404, "Application not found")
    _assert_app_scope(app, user, session)
    allowed = VALID_TRANSITIONS.get(user.role, {}).get(app.status, [])
    if new_status not in allowed:
        raise HTTPException(
            400, f"Cannot transition {app.status} -> {new_status} as {user.role}"
        )
    previous_status = app.status
    app.status = new_status
    app.updated_at = datetime.now(timezone.utc)
    _write_event(
        session,
        app,
        new_status,
        user.sub,
        user.role,
        note,
        {"prev_status": previous_status},
    )
    session.commit()
    return {"success": True, "app_code": app_code, "new_status": new_status}


@router.post("/applications/{app_code}/approve")
def approve(
    app_code: str,
    body: ActionRequest,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    next_status_map = {
        "school": "school_verified",
        "taluka": "taluka_approved",
        "deo": "deo_approved",
        "admin": "sanctioned",
    }
    new_status = next_status_map.get(user.role, "")
    if not new_status:
        raise HTTPException(403, "Role cannot approve")
    return _do_action(
        app_code, new_status, user, session, body.remark or f"Approved by {user.role}"
    )


@router.post("/applications/{app_code}/reject")
def reject(
    app_code: str,
    body: ActionRequest,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return _do_action(app_code, "rejected", user, session, body.reason or "Rejected")


@router.post("/applications/{app_code}/request-correction")
def request_correction(
    app_code: str,
    body: CorrectionRequest,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    app = session.exec(
        select(Application).where(Application.app_code == app_code)
    ).first()
    if not app:
        raise HTTPException(404, "Application not found")
    _assert_app_scope(app, user, session)
    allowed = VALID_TRANSITIONS.get(user.role, {}).get(app.status, [])
    if "correction_requested" not in allowed:
        raise HTTPException(
            400, f"Cannot request a correction from {app.status} as {user.role}"
        )
    app.status = "correction_requested"
    app.updated_at = datetime.now(timezone.utc)
    _write_event(
        session,
        app,
        "correction_requested",
        user.sub,
        user.role,
        body.note,
        {"fields": body.fields},
    )
    session.commit()
    return {"success": True, "app_code": app_code, "fields": body.fields}


@router.post("/applications/{app_code}/renewal-consent")
def renewal_consent(
    app_code: str,
    body: RenewalConsentRequest,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role != "student":
        raise HTTPException(403, "Student role required")
    app = session.exec(
        select(Application).where(Application.app_code == app_code)
    ).first()
    if not app:
        raise HTTPException(404, "Application not found")
    _assert_app_scope(app, user, session)
    if app.status != "awaiting_consent":
        raise HTTPException(409, "Application is not waiting for renewal consent")
    before = app.status
    app.status = "applied" if body.consent else "consent_declined"
    app.stage = "school" if body.consent else "closed"
    app.consent_at = datetime.now(timezone.utc) if body.consent else None
    app.updated_at = datetime.now(timezone.utc)
    _write_event(
        session,
        app,
        app.status,
        user.sub,
        user.role,
        "Renewal consent recorded",
        {"previous_status": before, "consent": body.consent},
    )
    session.commit()
    return {"app_code": app.app_code, "status": app.status, "consent": body.consent}


@router.post("/applications/bulk-approve")
def bulk_approve(
    body: BulkApproveRequest,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    next_status_map = {
        "school": "school_verified",
        "taluka": "taluka_approved",
        "deo": "deo_approved",
    }
    new_status = next_status_map.get(user.role, "")
    if not new_status:
        raise HTTPException(403, "Role cannot bulk approve")
    approved, skipped = [], []
    route_for_role = {"school": "school", "taluka": "taluka", "deo": "deo"}
    for code in body.app_codes:
        try:
            target = session.exec(
                select(Application).where(Application.app_code == code)
            ).first()
            if not target:
                raise HTTPException(404, "Application not found")
            _assert_app_scope(target, user, session)
            if target.route != route_for_role[user.role]:
                raise HTTPException(
                    403,
                    f"Application route '{target.route}' cannot be approved by {user.role}",
                )
            _do_action(
                code,
                new_status,
                user,
                session,
                body.remark or f"Bulk approved by {user.role}",
            )
            approved.append(code)
        except HTTPException as e:
            skipped.append({"app_code": code, "reason": e.detail})
    return {
        "approved": approved,
        "skipped": skipped,
        "count": len(approved),
        "total": len(body.app_codes),
        "skipped_count": len(skipped),
    }
