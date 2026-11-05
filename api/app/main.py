"""app/main.py — FastAPI application entry point."""

from __future__ import annotations
import json
from datetime import datetime
from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlmodel import Session, select

from app.config import get_settings
from app.db import create_db_tables
from app.routers import (
    auth,
    students,
    applications,
    grievances,
    analytics,
    documents,
    dbt,
    notifications,
)
from app.routers import logistics, operations
from app.ml import fraud, dropout
from app.ml import forecast
from app.db import get_session
from app.deps import get_current_user, CurrentUser
from app.security import sha256_chain
from app.models.core import (
    AcademicRecord,
    Application,
    ApplicationEvent,
    AuditLog,
    DbtTxn,
    Notification,
    Scheme,
    Student,
)
from app.services.eligibility import evaluate_all_schemes, evaluate

settings = get_settings()

app = FastAPI(
    title="Vidya Pragati Setu API",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global error handler
@app.exception_handler(Exception)
async def global_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "code": "INTERNAL_ERROR",
            "message": "An unexpected error occurred",
            "details": None,
        },
    )


@app.exception_handler(HTTPException)
async def http_error_handler(request: Request, exc: HTTPException):
    detail = exc.detail
    return JSONResponse(
        status_code=exc.status_code,
        headers=exc.headers,
        content={
            "code": f"HTTP_{exc.status_code}",
            "message": detail if isinstance(detail, str) else "Request failed",
            "details": None if isinstance(detail, str) else detail,
        },
    )


# Startup
@app.on_event("startup")
def on_startup():
    if (
        settings.adapter_mode != "mock"
        and settings.jwt_secret == "change-me-dev-secret-key-32chars"
    ):
        raise RuntimeError("JWT_SECRET must be set when ADAPTER_MODE is not mock")
    create_db_tables()


# Health
@app.get("/health", tags=["health"])
def health():
    return {"status": "ok", "version": "2.0.0", "adapter_mode": settings.adapter_mode}


# Routers
app.include_router(auth.router)
app.include_router(students.router)
app.include_router(applications.router)
app.include_router(grievances.router)
app.include_router(analytics.router)
app.include_router(fraud.router)
app.include_router(dropout.router)
app.include_router(forecast.router)
app.include_router(documents.router)
app.include_router(dbt.router)
app.include_router(notifications.router)
app.include_router(logistics.router)
app.include_router(operations.router)

# Eligibility router (inline to avoid circular imports)
elig_router = APIRouter(prefix="/eligibility", tags=["eligibility"])


@elig_router.get("/explain/{scheme_code}")
def explain_eligibility(
    scheme_code: str,
    lang: str = "en",
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    student = session.exec(select(Student).where(Student.cts_id == user.sub)).first()
    if not student:
        raise HTTPException(404, "Student not found")
    scheme = session.exec(select(Scheme).where(Scheme.code == scheme_code)).first()
    if not scheme:
        raise HTTPException(404, "Scheme not found")
    result = evaluate(student.id, scheme, session)  # type: ignore
    hints = []
    for r in result.get("reasons", []):
        if not r.get("passed"):
            hint = r.get(f"fix_hint_{lang}", r.get("fix_hint_en", ""))
            if hint:
                hints.append(hint)
    return {
        "scheme_code": scheme_code,
        "scheme_name": scheme.name_en,
        "status": result["status"],
        "summary_en": f"You are {'eligible' if result['status'] == 'eligible' else 'not yet eligible'} for {scheme.name_en}.",
        "steps": hints,
        "reasons": result.get("reasons", []),
        "missing_docs": result.get("missing_docs", []),
    }


@elig_router.post("/test")
def test_rules(body: dict, session: Session = Depends(get_session)):
    """Admin: test draft rules against a student."""
    student_id = body.get("student_id")
    rules_json = body.get("rules_json", "{}")
    draft = Scheme(
        code="__test__",
        name_en="Test",
        scheme_type="cash",
        rules_json=rules_json,
        required_docs_json="[]",
        payout_json="{}",
        budget=0,
    )
    if not student_id:
        return {"error": "student_id required"}
    result = evaluate(int(student_id), draft, session)
    # Count eligible across all students (expensive — only for admin demo)
    all_students = session.exec(select(Student)).all()
    eligible_count = sum(
        1
        for s in all_students[:100]  # limit for demo
        if evaluate(s.id, draft, session)["status"] == "eligible"
    )  # type: ignore
    return {"result": result, "estimated_eligible_count": eligible_count}


app.include_router(elig_router)

# Demo router
demo_router = APIRouter(prefix="/demo", tags=["demo"])


@demo_router.post("/reset")
def demo_reset(user: CurrentUser = Depends(get_current_user)):
    """Drop + reseed the database (demo only)."""
    if user.role != "admin":
        raise HTTPException(403, "Admin role required")
    import subprocess

    subprocess.Popen(["python3", "-m", "seed.seed", "--reset"])
    return {"success": True, "message": "Reset triggered in background"}


@demo_router.post("/promote/{cts_id}")
def demo_promote(
    cts_id: str,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role != "admin":
        raise HTTPException(403, "Admin role required")
    student = session.exec(select(Student).where(Student.cts_id == cts_id)).first()
    if not student:
        raise HTTPException(404, "Student not found")
    old_grade = student.grade
    old_results = {
        result["scheme_code"]: result
        for result in evaluate_all_schemes(student.id, session)
    }
    prior_apps = session.exec(
        select(Application).where(Application.student_id == student.id)
    ).all()
    previously_approved = {
        app.scheme_id
        for app in prior_apps
        if app.status
        in (
            "taluka_approved",
            "deo_approved",
            "sanctioned",
            "dbt_initiated",
            "credited",
        )
    }
    student.grade = min(student.grade + 1, 12)
    new_eligible = evaluate_all_schemes(student.id, session)
    new_results = {result["scheme_code"]: result for result in new_eligible}
    newly_eligible = [
        code
        for code, result in new_results.items()
        if result["status"] == "eligible"
        and old_results.get(code, {}).get("status") != "eligible"
    ]
    no_longer_applicable = [
        code
        for code, result in old_results.items()
        if result["status"] == "eligible"
        and new_results.get(code, {}).get("status") != "eligible"
    ]
    year = datetime.utcnow().year + 1
    academic_year = f"{year}-{(year + 1) % 100:02d}"
    renewed = []
    for scheme in session.exec(select(Scheme).where(Scheme.active.is_(True))).all():
        result = new_results.get(scheme.code, {})
        if scheme.id not in previously_approved or result.get("status") != "eligible":
            continue
        duplicate = session.exec(
            select(Application).where(
                Application.student_id == student.id,
                Application.scheme_id == scheme.id,
                Application.academic_year == academic_year,
            )
        ).first()
        if duplicate:
            continue
        payout = json.loads(scheme.payout_json or "{}")
        renewal = Application(
            app_code=f"APP-RENEW-{student.id}-{scheme.id}-{year}",
            student_id=student.id,
            scheme_id=scheme.id,
            academic_year=academic_year,
            status="awaiting_consent",
            stage="student_consent",
            route="auto",
            amount=int(payout.get("amount", 0)),
            risk_score=0,
            risk_level="low",
        )
        session.add(renewal)
        session.flush()
        payload = json.dumps(
            {"renewal_of": scheme.code, "academic_year": academic_year}
        )
        session.add(
            ApplicationEvent(
                application_id=renewal.id,
                stage="awaiting_consent",
                actor_id="SYSTEM",
                actor_role="system",
                note="Eligible renewal created; student consent required",
                payload_json=payload,
                prev_hash="genesis",
                hash=sha256_chain("genesis", payload),
            )
        )
        previous = session.exec(select(AuditLog).order_by(AuditLog.id.desc())).first()
        prev_hash = previous.hash if previous and previous.hash else "genesis"
        audit_payload = (
            f"SYSTEM:system:awaiting_consent:Application:{renewal.app_code}:{payload}"
        )
        session.add(
            AuditLog(
                actor_id="SYSTEM",
                role="system",
                action="awaiting_consent",
                entity="Application",
                entity_id=renewal.app_code,
                after_json=payload,
                prev_hash=prev_hash,
                hash=sha256_chain(prev_hash, audit_payload),
            )
        )
        session.add(
            Notification(
                recipient_id=student.cts_id,
                notif_type="application",
                title_en=f"Renewal available: {scheme.name_en}",
                title_gu=f"નવીનીકરણ ઉપલબ્ધ: {scheme.name_gu or scheme.name_en}",
                body=f"Review and consent to continue for academic year {academic_year}.",
            )
        )
        renewed.append(
            {
                "app_code": renewal.app_code,
                "scheme_code": scheme.code,
                "academic_year": academic_year,
                "status": renewal.status,
            }
        )
    session.commit()
    return {
        "cts_id": cts_id,
        "old_grade": old_grade,
        "new_grade": student.grade,
        "scheme_eligibility": new_eligible,
        "diff": {
            "newly_eligible": newly_eligible,
            "renewed": renewed,
            "no_longer_applicable": no_longer_applicable,
        },
    }


@demo_router.post("/simulate-attendance")
def simulate_attendance(
    body: dict,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role != "admin":
        raise HTTPException(403, "Admin role required")
    student = session.exec(
        select(Student).where(Student.cts_id == body.get("cts_id"))
    ).first()
    if not student:
        raise HTTPException(404, "Student not found")
    value = float(body.get("attendance_pct", 88))
    if not 0 <= value <= 100:
        raise HTTPException(400, "attendance_pct must be from 0 to 100")
    record = session.exec(
        select(AcademicRecord)
        .where(AcademicRecord.student_id == student.id)
        .order_by(AcademicRecord.year.desc())
    ).first()
    if not record:
        raise HTTPException(404, "Academic record not found")
    before = record.attendance_pct
    record.attendance_pct = value
    session.commit()
    return {
        "cts_id": student.cts_id,
        "previous_attendance_pct": before,
        "attendance_pct": value,
    }


@demo_router.post("/simulate-dbt")
def simulate_dbt(
    body: dict,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role != "admin":
        raise HTTPException(403, "Admin role required")
    txn = session.get(DbtTxn, body.get("txn_id"))
    if not txn:
        raise HTTPException(404, "Transaction not found")
    status = body.get("status", "credited")
    if status not in ("credited", "failed"):
        raise HTTPException(400, "status must be credited or failed")
    txn.status = status
    if status == "credited":
        from datetime import datetime

        txn.credited_at = datetime.utcnow()
    session.commit()
    return {"txn_id": txn.id, "status": txn.status}


app.include_router(demo_router)
