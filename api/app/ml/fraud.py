"""app/ml/fraud.py — Fraud detection rules, ML scoring, graph evidence & router."""

from __future__ import annotations
import json
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from pydantic import BaseModel
from sqlmodel import Session, select
from app.db import get_session, engine
from app.models.core import (
    FraudFlag,
    BankAccount,
    Student,
    Application,
    Family,
    AuditLog,
)
from app.deps import require_roles, CurrentUser
from app.security import sha256_chain
from app.ml.registry import registry

router = APIRouter(prefix="/fraud", tags=["fraud"])


def _audit(
    session: Session,
    user: CurrentUser,
    action: str,
    entity_id: str,
    before: str,
    after: str,
) -> None:
    prev = session.exec(select(AuditLog).order_by(AuditLog.id.desc())).first()  # type: ignore[arg-type]
    prev_hash = prev.hash if prev and prev.hash else "genesis"
    payload = f"{user.sub}:{user.role}:{action}:FraudFlag:{entity_id}:{after}"
    current_hash = sha256_chain(prev_hash, payload)
    log = AuditLog(
        actor_id=user.sub,
        role=user.role,
        action=action,
        entity="FraudFlag",
        entity_id=entity_id,
        before_json=before,
        after_json=after,
        prev_hash=prev_hash,
        hash=current_hash,
    )
    session.add(log)


def score_application(app_id: int, session: Session) -> float:
    """Calculates fraud risk score (0-100) for an application."""
    app = session.get(Application, app_id)
    if not app:
        return 0.0

    score = 5.0  # baseline
    student = session.get(Student, app.student_id)
    if not student:
        return score

    # 1. Duplicate check
    duplicates = session.exec(
        select(Application).where(
            Application.student_id == app.student_id,
            Application.scheme_id == app.scheme_id,
            Application.academic_year == app.academic_year,
            Application.id != app.id,
        )
    ).all()
    if duplicates:
        score += 50.0

    # 2. Shared bank hash
    bank_accs = session.exec(
        select(BankAccount).where(BankAccount.student_id == student.id)
    ).all()
    for b in bank_accs:
        if b.account_hash:
            shared = session.exec(
                select(BankAccount).where(
                    BankAccount.account_hash == b.account_hash,
                    BankAccount.student_id != student.id,
                )
            ).all()
            if shared:
                score += 35.0
                break

    # 3. Shared mobile
    if student.mobile:
        shared_mob = session.exec(
            select(Student).where(
                Student.mobile == student.mobile, Student.id != student.id
            )
        ).all()
        if len(shared_mob) >= 3:  # total 4+
            score += 30.0

    # 4. Income cert reused
    family = session.exec(select(Family).where(Family.student_id == student.id)).first()
    if family and family.income_cert_id:
        shared_cert = session.exec(
            select(Family).where(
                Family.income_cert_id == family.income_cert_id,
                Family.student_id != student.id,
            )
        ).all()
        if shared_cert:
            score += 40.0

    # Optional ML IsolationForest bonus
    model = registry.get_fraud_model()
    if model is not None:
        try:
            feats = [
                [float(app.amount), float(student.grade), float(student.distance_km)]
            ]
            pred = model.predict(feats)
            if pred[0] == -1:  # anomaly
                score += 15.0
        except Exception:
            pass

    return round(min(100.0, max(0.0, score)), 1)


def scan_all(session: Session) -> list[FraudFlag]:
    """Scans all data for fraud rules and returns newly created FraudFlags."""
    new_flags: list[FraudFlag] = []

    # 1. Shared bank hash (>=2 students)
    accounts = session.exec(select(BankAccount)).all()
    by_bank: dict[str, list[BankAccount]] = {}
    for a in accounts:
        if a.account_hash:
            by_bank.setdefault(a.account_hash, []).append(a)

    for h, accs in by_bank.items():
        st_ids = sorted(list({a.student_id for a in accs}))
        if len(st_ids) >= 2:
            ref_json = json.dumps({"account_hash": h, "student_ids": st_ids})
            evidence = json.dumps(
                {
                    "message": f"Bank account hash shared by {len(st_ids)} students",
                    "last4_list": [a.last4 for a in accs],
                    "student_ids": st_ids,
                }
            )
            existing = session.exec(
                select(FraudFlag).where(
                    FraudFlag.flag_type == "shared_bank_hash",
                    FraudFlag.entity_refs_json == ref_json,
                )
            ).first()
            if not existing:
                flag = FraudFlag(
                    flag_type="shared_bank_hash",
                    entity_refs_json=ref_json,
                    score=min(100.0, 50.0 + len(st_ids) * 15.0),
                    status="open",
                    evidence_json=evidence,
                )
                session.add(flag)
                new_flags.append(flag)

    # 2. Shared mobile (>=4 students)
    students = session.exec(select(Student)).all()
    by_mobile: dict[str, list[Student]] = {}
    for s in students:
        if s.mobile:
            by_mobile.setdefault(s.mobile, []).append(s)

    for mob, s_list in by_mobile.items():
        if len(s_list) >= 4:
            s_ids = [s.id for s in s_list]
            ref_json = json.dumps({"mobile_last4": mob[-4:], "student_ids": s_ids})
            evidence = json.dumps(
                {
                    "message": f"Mobile number ending in ...{mob[-4:]} shared by {len(s_list)} students",
                    "student_ids": s_ids,
                    "names": [s.name_en for s in s_list],
                }
            )
            existing = session.exec(
                select(FraudFlag).where(
                    FraudFlag.flag_type == "shared_mobile",
                    FraudFlag.entity_refs_json == ref_json,
                )
            ).first()
            if not existing:
                flag = FraudFlag(
                    flag_type="shared_mobile",
                    entity_refs_json=ref_json,
                    score=min(100.0, 40.0 + len(s_list) * 10.0),
                    status="open",
                    evidence_json=evidence,
                )
                session.add(flag)
                new_flags.append(flag)

    # 3. Duplicate application (same student + scheme + year)
    apps = session.exec(select(Application)).all()
    by_app: dict[tuple[int, int, str], list[Application]] = {}
    for ap in apps:
        by_app.setdefault((ap.student_id, ap.scheme_id, ap.academic_year), []).append(
            ap
        )

    for (st_id, sc_id, yr), a_list in by_app.items():
        if len(a_list) >= 2:
            a_ids = [a.id for a in a_list]
            ref_json = json.dumps(
                {
                    "student_id": st_id,
                    "scheme_id": sc_id,
                    "academic_year": yr,
                    "application_ids": a_ids,
                }
            )
            evidence = json.dumps(
                {
                    "message": f"Duplicate applications for scheme {sc_id} in {yr}",
                    "app_codes": [a.app_code for a in a_list],
                    "statuses": [a.status for a in a_list],
                }
            )
            existing = session.exec(
                select(FraudFlag).where(
                    FraudFlag.flag_type == "duplicate_application",
                    FraudFlag.entity_refs_json == ref_json,
                )
            ).first()
            if not existing:
                flag = FraudFlag(
                    flag_type="duplicate_application",
                    entity_refs_json=ref_json,
                    score=85.0,
                    status="open",
                    evidence_json=evidence,
                )
                session.add(flag)
                new_flags.append(flag)

    # 4. Income cert reused (same cert, different students)
    fams = session.exec(select(Family)).all()
    by_cert: dict[str, list[Family]] = {}
    for f in fams:
        cid = (f.income_cert_id or "").strip()
        if cid:
            by_cert.setdefault(cid, []).append(f)

    for cid, f_list in by_cert.items():
        st_ids = sorted(list({f.student_id for f in f_list}))
        if len(st_ids) >= 2:
            ref_json = json.dumps({"income_cert_id": cid, "student_ids": st_ids})
            evidence = json.dumps(
                {
                    "message": f"Income Certificate {cid} reused across {len(st_ids)} different students",
                    "student_ids": st_ids,
                }
            )
            existing = session.exec(
                select(FraudFlag).where(
                    FraudFlag.flag_type == "income_cert_reused",
                    FraudFlag.entity_refs_json == ref_json,
                )
            ).first()
            if not existing:
                flag = FraudFlag(
                    flag_type="income_cert_reused",
                    entity_refs_json=ref_json,
                    score=90.0,
                    status="open",
                    evidence_json=evidence,
                )
                session.add(flag)
                new_flags.append(flag)

    session.commit()
    return new_flags


# ── Router Endpoints ──────────────────────────────────────────────────────────


@router.get("/flags")
def list_flags(
    status: str | None = None,
    type: str | None = Query(default=None, alias="type"),
    min_score: float | None = None,
    page: int = 1,
    size: int = 20,
    session: Session = Depends(get_session),
    _: CurrentUser = Depends(require_roles("admin", "deo")),
):
    stmt = select(FraudFlag)
    if status:
        stmt = stmt.where(FraudFlag.status == status)
    if type:
        stmt = stmt.where(FraudFlag.flag_type == type)
    if min_score is not None:
        stmt = stmt.where(FraudFlag.score >= min_score)

    total = len(session.exec(stmt).all())
    items = session.exec(
        stmt.order_by(FraudFlag.id.desc()).offset((page - 1) * size).limit(size)
    ).all()  # type: ignore[arg-type]
    return {"items": items, "total": total, "page": page, "size": size}


def _build_graph(flag: FraudFlag, session: Session) -> dict[str, list]:
    nodes: list[dict[str, str]] = []
    edges: list[dict[str, str]] = []
    refs = json.loads(flag.entity_refs_json or "{}")

    if flag.flag_type == "shared_bank_hash":
        h = refs.get("account_hash", "hash")
        b_id = f"bank_{h[:8]}"
        nodes.append({"id": b_id, "type": "bank_account", "label": f"Bank ...{h[-6:]}"})
        for sid in refs.get("student_ids", []):
            st = session.get(Student, sid)
            s_node = f"student_{sid}"
            nodes.append(
                {
                    "id": s_node,
                    "type": "student",
                    "label": st.name_en if st else f"Student #{sid}",
                }
            )
            edges.append({"from": s_node, "to": b_id, "rel": "shares_account"})
    elif flag.flag_type == "shared_mobile":
        m_id = f"mob_{refs.get('mobile_last4', 'xxxx')}"
        nodes.append(
            {
                "id": m_id,
                "type": "mobile",
                "label": f"Mobile ...{refs.get('mobile_last4', '')}",
            }
        )
        for sid in refs.get("student_ids", []):
            st = session.get(Student, sid)
            s_node = f"student_{sid}"
            nodes.append(
                {
                    "id": s_node,
                    "type": "student",
                    "label": st.name_en if st else f"Student #{sid}",
                }
            )
            edges.append({"from": s_node, "to": m_id, "rel": "uses_mobile"})
    elif flag.flag_type == "duplicate_application":
        st = session.get(Student, refs.get("student_id", 0))
        s_node = f"student_{refs.get('student_id')}"
        nodes.append(
            {"id": s_node, "type": "student", "label": st.name_en if st else "Student"}
        )
        for aid in refs.get("application_ids", []):
            app = session.get(Application, aid)
            a_node = f"app_{aid}"
            nodes.append(
                {
                    "id": a_node,
                    "type": "application",
                    "label": app.app_code if app else f"App #{aid}",
                }
            )
            edges.append({"from": s_node, "to": a_node, "rel": "submitted"})
    elif flag.flag_type == "income_cert_reused":
        cid = refs.get("income_cert_id", "cert")
        c_node = f"cert_{cid}"
        nodes.append({"id": c_node, "type": "certificate", "label": f"Cert {cid}"})
        for sid in refs.get("student_ids", []):
            st = session.get(Student, sid)
            s_node = f"student_{sid}"
            nodes.append(
                {
                    "id": s_node,
                    "type": "student",
                    "label": st.name_en if st else f"Student #{sid}",
                }
            )
            edges.append({"from": s_node, "to": c_node, "rel": "reused_cert"})

    return {"nodes": nodes, "edges": edges}


@router.get("/flags/{id}")
def get_flag_detail(
    id: int,
    session: Session = Depends(get_session),
    _: CurrentUser = Depends(require_roles("admin", "deo")),
):
    flag = session.get(FraudFlag, id)
    if not flag:
        raise HTTPException(status_code=404, detail="Fraud flag not found")

    evidence = json.loads(flag.evidence_json or "{}")
    graph = _build_graph(flag, session)
    return {
        "id": flag.id,
        "flag_type": flag.flag_type,
        "score": flag.score,
        "status": flag.status,
        "created_at": flag.created_at,
        "evidence": evidence,
        "graph": graph,
    }


class FlagStatusUpdate(BaseModel):
    status: str


@router.patch("/flags/{id}")
def update_flag_status(
    id: int,
    body: FlagStatusUpdate,
    session: Session = Depends(get_session),
    user: CurrentUser = Depends(require_roles("admin", "deo")),
):
    if body.status not in ("investigating", "cleared", "confirmed"):
        raise HTTPException(
            status_code=400,
            detail="Status must be investigating, cleared, or confirmed",
        )

    flag = session.get(FraudFlag, id)
    if not flag:
        raise HTTPException(status_code=404, detail="Fraud flag not found")

    before = json.dumps({"status": flag.status})
    flag.status = body.status
    after = json.dumps({"status": flag.status})
    _audit(session, user, "UPDATE_STATUS", str(flag.id), before, after)
    session.add(flag)
    session.commit()
    session.refresh(flag)
    return flag


def _background_scan():
    with Session(engine) as s:
        scan_all(s)


@router.post("/rescan")
def rescan_flags(
    background_tasks: BackgroundTasks,
    _: CurrentUser = Depends(require_roles("admin", "deo")),
):
    background_tasks.add_task(_background_scan)
    return {"message": "Rescan initiated in background", "status": "running"}
