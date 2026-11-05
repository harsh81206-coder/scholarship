"""Admin, audit, funds, and deterministic assistant endpoints used by the UI."""

from __future__ import annotations

import csv
import io
import json
from datetime import datetime

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from pydantic import BaseModel
from sqlmodel import Session, select

from app.db import get_session
from app.deps import CurrentUser, get_current_user
from app.models.core import (
    Application,
    AuditLog,
    BankAccount,
    DbtTxn,
    Family,
    Scheme,
    Setting,
    Delegation,
    User,
    Student,
)
from app.security import sha256_chain
from app.services.eligibility import evaluate, store_result

router = APIRouter(tags=["operations"])


def _require(user: CurrentUser, *roles: str) -> None:
    if user.role not in roles:
        raise HTTPException(403, "Role not permitted")


def _student_for(user: CurrentUser, session: Session) -> Student:
    if user.role != "student":
        raise HTTPException(403, "Student role required")
    student = session.exec(select(Student).where(Student.cts_id == user.sub)).first()
    if not student:
        raise HTTPException(404, "Student not found")
    return student


class SchemeCreate(BaseModel):
    code: str
    name_en: str
    name_gu: str = ""
    name_hi: str = ""
    scheme_type: str = "cash"
    rules: dict = {}
    required_docs: list[str] = []
    payout: dict = {}
    budget: int = 0
    mutually_exclusive_with: list[str] = []


class RuleUpdate(BaseModel):
    rules: dict
    publish: bool = False


class SettingsUpdate(BaseModel):
    values: dict[str, object]


class ChatRequest(BaseModel):
    message: str
    lang: str = "en"


class DelegationRequest(BaseModel):
    to_user_id: int
    application_ids: list[str]
    due_date: str | None = None


@router.get("/admin/schemes")
def list_schemes(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    _require(user, "admin")
    items = session.exec(select(Scheme).order_by(Scheme.id)).all()
    return [
        {
            "id": s.id,
            "code": s.code,
            "name_en": s.name_en,
            "name_gu": s.name_gu,
            "name_hi": s.name_hi,
            "version": s.version,
            "active": s.active,
            "rules": json.loads(s.rules_json or "{}"),
            "required_docs": json.loads(s.required_docs_json or "[]"),
            "payout": json.loads(s.payout_json or "{}"),
            "budget": s.budget,
        }
        for s in items
    ]


@router.post("/admin/schemes")
def create_scheme(
    body: SchemeCreate,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    _require(user, "admin")
    if session.exec(select(Scheme).where(Scheme.code == body.code)).first():
        raise HTTPException(409, "Scheme code already exists")
    scheme = Scheme(
        code=body.code,
        name_en=body.name_en,
        name_gu=body.name_gu,
        name_hi=body.name_hi,
        scheme_type=body.scheme_type,
        rules_json=json.dumps(body.rules),
        required_docs_json=json.dumps(body.required_docs),
        payout_json=json.dumps(body.payout),
        mutually_exclusive_with_json=json.dumps(body.mutually_exclusive_with),
        budget=body.budget,
    )
    session.add(scheme)
    session.commit()
    session.refresh(scheme)
    return {"id": scheme.id, "code": scheme.code, "version": scheme.version}


@router.put("/admin/schemes/{scheme_id}/rules")
def update_scheme_rules(
    scheme_id: int,
    body: RuleUpdate,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    _require(user, "admin")
    scheme = session.get(Scheme, scheme_id)
    if not scheme:
        raise HTTPException(404, "Scheme not found")
    scheme.rules_json = json.dumps(body.rules)
    re_evaluated = 0
    if body.publish:
        scheme.version += 1
        for student in session.exec(select(Student)).all():
            result = evaluate(student.id, scheme, session)  # type: ignore[arg-type]
            store_result(student.id, scheme, result, session)  # type: ignore[arg-type]
            re_evaluated += 1
    session.commit()
    return {
        "id": scheme.id,
        "version": scheme.version,
        "published": body.publish,
        "re_evaluated": re_evaluated,
    }


@router.get("/admin/settings")
def get_settings(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    _require(user, "admin")
    rows = session.exec(select(Setting)).all()
    return {row.key: json.loads(row.value_json or "null") for row in rows}


@router.put("/admin/settings")
def update_settings(
    body: SettingsUpdate,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    _require(user, "admin")
    for key, value in body.values.items():
        row = session.get(Setting, key)
        if row:
            row.value_json = json.dumps(value)
            row.updated_at = datetime.utcnow()
        else:
            session.add(
                Setting(
                    key=key,
                    value_json=json.dumps(value),
                    description="Updated in admin settings",
                )
            )
    session.commit()
    return {"updated": sorted(body.values)}


@router.get("/funds/overview")
def funds_overview(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    _require(user, "admin", "deo")
    schemes = session.exec(select(Scheme)).all()
    txns = session.exec(select(DbtTxn)).all()
    apps = session.exec(select(Application)).all()
    return {
        "budget": sum(s.budget for s in schemes),
        "sanctioned": sum(
            a.amount
            for a in apps
            if a.status in ("sanctioned", "dbt_initiated", "credited")
        ),
        "initiated": sum(
            t.amount for t in txns if t.status in ("initiated", "processing")
        ),
        "credited": sum(t.amount for t in txns if t.status == "credited"),
        "failed": sum(t.amount for t in txns if t.status == "failed"),
        "schemes": [
            {
                "code": s.code,
                "name_en": s.name_en,
                "budget": s.budget,
                "credited": sum(
                    t.amount
                    for t in txns
                    if t.status == "credited"
                    and (app := session.get(Application, t.application_id))
                    and app.scheme_id == s.id
                ),
            }
            for s in schemes
        ],
    }


@router.get("/audit/logs")
def audit_logs(
    page: int = 1,
    size: int = 50,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    _require(user, "admin", "deo", "taluka")
    page, size = max(1, page), min(100, max(1, size))
    rows = session.exec(
        select(AuditLog)
        .order_by(AuditLog.id.desc())
        .offset((page - 1) * size)
        .limit(size)
    ).all()
    total = len(session.exec(select(AuditLog)).all())
    return {
        "items": [
            {
                "id": x.id,
                "at": x.created_at.isoformat(),
                "actor_id": x.actor_id,
                "role": x.role,
                "action": x.action,
                "entity": x.entity,
                "entity_id": x.entity_id,
                "before": x.before_json,
                "after": x.after_json,
                "prev_hash": x.prev_hash,
                "hash": x.hash,
            }
            for x in rows
        ],
        "total": total,
        "page": page,
        "size": size,
    }


@router.get("/audit/verify-chain")
def verify_chain(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    _require(user, "admin")
    rows = session.exec(select(AuditLog).order_by(AuditLog.id)).all()
    expected_prev = "genesis"
    broken = None
    for index, row in enumerate(rows):
        if row.prev_hash != expected_prev:
            broken = index
            break
        # Writers store canonical action data in a stable payload string.
        payload = f"{row.actor_id}:{row.role}:{row.action}:{row.entity}:{row.entity_id}:{row.after_json or ''}"
        if sha256_chain(row.prev_hash, payload) != row.hash:
            broken = index
            break
        expected_prev = row.hash
    return {"valid": broken is None, "entries": len(rows), "first_broken_index": broken}


@router.post("/delegations")
def create_delegation(
    body: DelegationRequest,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    _require(user, "taluka", "deo", "admin")
    sender = session.exec(select(User).where(User.officer_id == user.sub)).first()
    recipient = session.get(User, body.to_user_id)
    if not sender or not recipient:
        raise HTTPException(404, "Delegating or receiving officer not found")
    if recipient.role not in ("school", "taluka", "deo"):
        raise HTTPException(400, "Delegation recipient must be an officer")
    valid_codes = []
    for code in body.application_ids:
        app = session.exec(
            select(Application).where(Application.app_code == code)
        ).first()
        if app:
            valid_codes.append(code)
    if not valid_codes:
        raise HTTPException(400, "No valid applications in delegation")
    row = Delegation(
        from_user_id=sender.id,
        to_user_id=recipient.id,
        scope_json=json.dumps({"application_ids": valid_codes}),
        due_date=body.due_date,
    )
    session.add(row)
    session.commit()
    session.refresh(row)
    return {"id": row.id, "status": row.status, "application_ids": valid_codes}


@router.get("/delegations/me")
def my_delegations(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    officer = session.exec(select(User).where(User.officer_id == user.sub)).first()
    if not officer:
        raise HTTPException(404, "Officer not found")
    rows = session.exec(
        select(Delegation).where(Delegation.to_user_id == officer.id)
    ).all()
    return [
        {
            "id": d.id,
            "from_user_id": d.from_user_id,
            "to_user_id": d.to_user_id,
            "scope": json.loads(d.scope_json or "{}"),
            "due_date": d.due_date,
            "status": d.status,
        }
        for d in rows
    ]


@router.get("/analytics/school/reports")
def school_reports(
    type: str = "summary",
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    _require(user, "school", "admin")
    apps = session.exec(select(Application)).all()
    if user.role == "school":
        apps = [a for a in apps if a.student and a.student.school_id == user.school_id]
    return {
        "type": type,
        "total": len(apps),
        "status_counts": {
            status: sum(a.status == status for a in apps)
            for status in sorted({a.status for a in apps})
        },
        "items": [
            {
                "app_code": a.app_code,
                "status": a.status,
                "amount": a.amount,
                "scheme": a.scheme.name_en if a.scheme else "",
            }
            for a in apps
        ],
    }


@router.get("/ai/explain/{scheme_code}")
def ai_explain(
    scheme_code: str,
    lang: str = "en",
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    student = _student_for(user, session)
    scheme = session.exec(select(Scheme).where(Scheme.code == scheme_code)).first()
    if not scheme:
        raise HTTPException(404, "Scheme not found")
    result = evaluate(student.id, scheme, session)
    if lang == "gu":
        intro = (
            f"{scheme.name_gu or scheme.name_en} માટે તમારી સ્થિતિ: {result['status']}."
        )
    elif lang == "hi":
        intro = (
            f"{scheme.name_hi or scheme.name_en} के लिए आपकी स्थिति: {result['status']}."
        )
    else:
        intro = f"Your status for {scheme.name_en}: {result['status']}."
    steps = [
        r.get("fix_hint_" + lang) or r.get("fix_hint_en", "")
        for r in result.get("reasons", [])
        if not r.get("passed")
    ]
    return {
        "scheme_code": scheme.code,
        "lang": lang,
        "text": intro,
        "steps": [x for x in steps if x],
        "status": result["status"],
    }


@router.post("/ai/chat")
def assistant_chat(
    body: ChatRequest,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    student = _student_for(user, session)
    msg = body.message.casefold()
    lang = body.lang if body.lang in ("en", "gu", "hi") else "en"
    if any(word in msg for word in ("payment", "પેમેન્ટ", "भुगतान")):
        apps = session.exec(
            select(Application).where(Application.student_id == student.id)
        ).all()
        txns = [
            t
            for a in apps
            for t in session.exec(
                select(DbtTxn).where(DbtTxn.application_id == a.id)
            ).all()
        ]
        credited = sum(t.amount for t in txns if t.status == "credited")
        reply = {
            "en": f"Your credited payments total ₹{credited:,}.",
            "gu": f"તમારી જમા થયેલી ચુકવણી ₹{credited:,} છે.",
            "hi": f"आपकी जमा राशि ₹{credited:,} है.",
        }[lang]
        cards = [{"type": "payment", "total_credited": credited}]
    else:
        results = []
        for scheme in session.exec(select(Scheme).where(Scheme.active.is_(True))).all():
            result = evaluate(student.id, scheme, session)
            results.append(
                {
                    "scheme_code": scheme.code,
                    "name": scheme.name_en,
                    "status": result["status"],
                }
            )
        reply = {
            "en": f"I found eligibility information for {len(results)} schemes. I can also help with your payments.",
            "gu": f"{len(results)} યોજનાઓની પાત્રતા માહિતી મળી.",
            "hi": f"{len(results)} योजनाओं की पात्रता जानकारी मिली.",
        }[lang]
        cards = [{"type": "schemes", "items": results}]
    disclaimer = {
        "en": "AI guidance; officers make the final decision.",
        "gu": "આ AI માર્ગદર્શન છે; અંતિમ નિર્ણય અધિકારીઓનો છે.",
        "hi": "यह AI मार्गदर्शन है; अंतिम निर्णय अधिकारी लेते हैं.",
    }[lang]
    return {"reply_text": f"{reply} {disclaimer}", "cards": cards, "quick_replies": []}


@router.get("/students/me/consents")
def get_consents(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    student = _student_for(user, session)
    row = session.get(Setting, f"consents:{student.cts_id}")
    return (
        json.loads(row.value_json)
        if row
        else {
            "guardian_consent": student.guardian_consent,
            "share_documents": True,
            "auto_apply": False,
            "alerts": True,
        }
    )


@router.put("/students/me/consents")
def put_consents(
    body: dict,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    student = _student_for(user, session)
    key = f"consents:{student.cts_id}"
    row = session.get(Setting, key)
    value = {
        k: bool(body[k])
        for k in ("guardian_consent", "share_documents", "auto_apply", "alerts")
        if k in body
    }
    if row:
        row.value_json = json.dumps(value)
    else:
        session.add(
            Setting(
                key=key,
                value_json=json.dumps(value),
                description="Student consent preferences",
            )
        )
    if "guardian_consent" in value:
        student.guardian_consent = value["guardian_consent"]
    session.commit()
    return value


@router.post("/students/me/data-export")
def export_student_data(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    student = _student_for(user, session)
    return {
        "profile": {
            "cts_id": student.cts_id,
            "name_en": student.name_en,
            "name_gu": student.name_gu,
            "dob": student.dob,
            "gender": student.gender,
            "grade": student.grade,
            "caste_category": student.caste_category,
        },
        "family": (
            lambda f: {
                "annual_income": f.annual_income,
                "income_cert_id": f.income_cert_id,
            }
            if f
            else None
        )(session.exec(select(Family).where(Family.student_id == student.id)).first()),
        "bank_accounts": [
            {
                "holder_type": b.holder_type,
                "holder_name": b.holder_name,
                "last4": b.last4,
            }
            for b in session.exec(
                select(BankAccount).where(BankAccount.student_id == student.id)
            ).all()
        ],
    }


@router.post("/records/{record_type}/upload")
async def upload_records(
    record_type: str,
    file: UploadFile = File(...),
    user: CurrentUser = Depends(get_current_user),
):
    _require(user, "school", "admin")
    if record_type not in ("attendance", "marks"):
        raise HTTPException(404, "Record type must be attendance or marks")
    if file.content_type not in (
        "text/csv",
        "application/vnd.ms-excel",
        "application/octet-stream",
    ):
        raise HTTPException(400, "Upload a CSV file")
    raw = await file.read()
    if len(raw) > 5 * 1024 * 1024:
        raise HTTPException(413, "File exceeds 5 MB")
    try:
        rows = list(csv.DictReader(io.StringIO(raw.decode("utf-8-sig"))))
    except (UnicodeDecodeError, csv.Error):
        raise HTTPException(400, "Could not parse CSV")
    required = {"cts_id", "value"}
    if not rows or not required.issubset(rows[0]):
        raise HTTPException(400, "CSV must contain cts_id,value columns")
    errors = []
    valid = 0
    for i, row in enumerate(rows, start=2):
        try:
            value = float(row["value"])
            if not 0 <= value <= 100:
                raise ValueError
            valid += 1
        except (TypeError, ValueError):
            errors.append({"row": i, "issue": "value must be a number from 0 to 100"})
    return {
        "record_type": record_type,
        "total": len(rows),
        "valid": valid,
        "errors": errors,
        "confirm_required": True,
        "rows": rows,
    }


@router.post("/records/{record_type}/confirm")
def confirm_records(
    record_type: str,
    body: dict,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    _require(user, "school", "admin")
    if record_type not in ("attendance", "marks"):
        raise HTTPException(404, "Record type must be attendance or marks")
    from app.models.core import AcademicRecord

    updated = 0
    for row in body.get("rows", []):
        student = session.exec(
            select(Student).where(Student.cts_id == row.get("cts_id"))
        ).first()
        if not student or (
            user.role == "school" and student.school_id != user.school_id
        ):
            continue
        record = session.exec(
            select(AcademicRecord)
            .where(AcademicRecord.student_id == student.id)
            .order_by(AcademicRecord.year.desc())
        ).first()
        if record:
            setattr(
                record,
                "attendance_pct" if record_type == "attendance" else "marks_pct",
                float(row["value"]),
            )
            updated += 1
    session.commit()
    return {"updated": updated}
