"""Verify the 33 UI route files and declared API paths against OpenAPI."""

from __future__ import annotations

from pathlib import Path
import json
import os
import sqlite3
import tempfile

from fastapi.testclient import TestClient

from app.main import app

ROOT = Path(__file__).resolve().parents[2]
SCREENS: dict[str, tuple[str, tuple[str, ...]]] = {
    "P1": ("web/app/page.tsx", ()),
    "P2": ("web/app/login/page.tsx", ("/auth/otp/send",)),
    "P3": ("web/app/login/verify/page.tsx", ("/auth/otp/verify",)),
    "S1": (
        "web/app/student/page.tsx",
        ("/students/me", "/students/me/schemes", "/applications", "/notifications"),
    ),
    "S2": (
        "web/app/student/schemes/[id]/page.tsx",
        (
            "/students/me/schemes",
            "/eligibility/explain/{scheme_code}",
            "/ai/explain/{scheme_code}",
        ),
    ),
    "S3": (
        "web/app/student/vault/page.tsx",
        ("/documents", "/documents/fetch-digilocker"),
    ),
    "S4": ("web/app/student/vault/upload/page.tsx", ("/documents",)),
    "S5": (
        "web/app/student/apply/page.tsx",
        ("/applications/guardian-otp/send", "/applications/bulk"),
    ),
    "S6": (
        "web/app/student/applications/page.tsx",
        ("/applications", "/applications/{app_code}/timeline"),
    ),
    "S7": (
        "web/app/student/cycle/page.tsx",
        ("/students/me/cycle", "/handover/initiate", "/handover/confirm"),
    ),
    "S8": (
        "web/app/student/payments/page.tsx",
        ("/students/me/payments", "/dbt/receipt/{txn_id}"),
    ),
    "S9": ("web/app/student/grievances/page.tsx", ("/grievances", "/grievances/me")),
    "S10": (
        "web/app/student/notifications/page.tsx",
        ("/notifications", "/notifications/read-all"),
    ),
    "S11": (
        "web/app/student/profile/page.tsx",
        ("/students/me", "/students/me/consents", "/students/me/data-export"),
    ),
    "S12": ("web/app/student/assistant/page.tsx", ("/ai/chat",)),
    "SC1": ("web/app/school/page.tsx", ("/analytics/school",)),
    "SC2": (
        "web/app/school/queue/page.tsx",
        ("/applications", "/applications/bulk-approve"),
    ),
    "SC3": (
        "web/app/school/queue/[id]/page.tsx",
        (
            "/applications/{app_code}",
            "/applications/{app_code}/approve",
            "/applications/{app_code}/reject",
        ),
    ),
    "SC4": (
        "web/app/school/records/page.tsx",
        ("/records/{record_type}/upload", "/records/{record_type}/confirm"),
    ),
    "SC5": (
        "web/app/school/cycles/page.tsx",
        ("/batches/{batch_id}/receive", "/handover/initiate", "/handover/confirm"),
    ),
    "SC6": ("web/app/school/reports/page.tsx", ("/analytics/school/reports",)),
    "D1": ("web/app/deo/page.tsx", ("/analytics/district",)),
    "D2": (
        "web/app/deo/approvals/page.tsx",
        (
            "/applications",
            "/applications/bulk-approve",
            "/delegations",
            "/delegations/me",
        ),
    ),
    "D3": ("web/app/deo/cycles/page.tsx", ("/cycles/overview", "/ml/forecast/cycles")),
    "D4": (
        "web/app/deo/at-risk/page.tsx",
        ("/ml/dropout/students", "/ml/dropout/students/{cts_id}"),
    ),
    "D5": (
        "web/app/deo/grievances/page.tsx",
        ("/grievances", "/grievances/{grv_code}"),
    ),
    "A1": ("web/app/admin/page.tsx", ("/analytics/state",)),
    "A2": (
        "web/app/admin/schemes/builder/page.tsx",
        ("/admin/schemes", "/admin/schemes/{scheme_id}/rules", "/eligibility/test"),
    ),
    "A3": (
        "web/app/admin/funds/page.tsx",
        ("/funds/overview", "/dbt/reconciliation", "/dbt/{txn_id}/retry"),
    ),
    "A4": (
        "web/app/admin/fraud/page.tsx",
        ("/fraud/flags", "/fraud/flags/{id}", "/fraud/rescan"),
    ),
    "A5": ("web/app/admin/audit/page.tsx", ("/audit/logs", "/audit/verify-chain")),
    "V1": (
        "web/app/vendor/page.tsx",
        ("/vendor/batches", "/batches/{batch_id}/dispatch", "/batches/{batch_id}/gps"),
    ),
    "X1": (
        "web/app/demo/simulate/page.tsx",
        (
            "/demo/promote/{cts_id}",
            "/demo/simulate-attendance",
            "/demo/simulate-dbt",
            "/demo/reset",
        ),
    ),
}


def main() -> int:
    from sqlmodel import Session, create_engine, select

    import app.db as db_module
    import app.security as security
    from app.ml import fraud
    from app.models.core import (
        Application,
        BankAccount,
        Cycle,
        DbtTxn,
        FraudFlag,
        Notification,
        School,
        Scheme,
        Student,
        User,
    )
    from app.routers import dbt, documents

    spec = app.openapi()
    api_paths = set(spec["paths"])
    missing: list[tuple[str, str]] = []
    for screen, (page, endpoints) in SCREENS.items():
        if not (ROOT / page).is_file():
            missing.append((screen, f"frontend route missing: {page}"))
        for endpoint in endpoints:
            if endpoint not in api_paths:
                missing.append((screen, f"OpenAPI route missing: {endpoint}"))
    if missing:
        for screen, issue in missing:
            print(f"FAIL {screen}: {issue}")
        return 1

    # Run calls against an isolated copy of the committed demo seed. The checker
    # creates synthetic rows in this temporary database so mutations never touch
    # api/vps.demo.db. Background workers that use imported engine globals are
    # disabled for the duration of this contract pass.
    source_db = Path(
        os.environ.get("VPS_CONTRACT_DB", str(ROOT / "api" / "vps.demo.db"))
    )
    if not source_db.is_file():
        print(f"FAIL API: seeded snapshot not found: {source_db}")
        return 1

    role_users = {
        "student": ("GJ-AND-2026-004512", "9876543210"),
        "school": ("SCH-AND-001", "9898000001"),
        "taluka": ("TPEO-BOR-001", "9898000002"),
        "deo": ("DEO-AND-001", "9898000003"),
        "admin": ("ADMIN-STATE-001", "9898000004"),
        "vendor": ("VND-001", "9898000005"),
    }
    rows: list[tuple[str, str, str, str, str]] = []
    calls = 0

    def required_shape(value: object, expected: tuple[str, ...] | str | None) -> bool:
        if expected is None:
            return isinstance(value, (dict, list))
        if expected == "list":
            return isinstance(value, list)
        if expected == "object":
            return isinstance(value, dict)
        return isinstance(value, dict) and all(key in value for key in expected)

    def validate_schema(schema: dict, value: object) -> bool | None:
        """Small OpenAPI response validator; None means no useful schema exists."""
        if not schema:
            return None
        if "$ref" in schema:
            target = spec
            for part in schema["$ref"].removeprefix("#/").split("/"):
                target = target.get(part, {})
            return validate_schema(target, value)
        if "anyOf" in schema:
            return any(validate_schema(item, value) is not False for item in schema["anyOf"])
        if "oneOf" in schema:
            return any(validate_schema(item, value) is not False for item in schema["oneOf"])
        kind = schema.get("type")
        if kind == "object":
            if not isinstance(value, dict):
                return False
            for key in schema.get("required", []):
                if key not in value:
                    return False
            for key, child in schema.get("properties", {}).items():
                if key in value and validate_schema(child, value[key]) is False:
                    return False
            return True
        if kind == "array":
            return isinstance(value, list) and all(
                validate_schema(schema.get("items", {}), item) is not False
                for item in value
            )
        if kind == "string":
            return isinstance(value, str)
        if kind == "integer":
            return isinstance(value, int) and not isinstance(value, bool)
        if kind == "number":
            return isinstance(value, (int, float)) and not isinstance(value, bool)
        if kind == "boolean":
            return isinstance(value, bool)
        if "enum" in schema:
            return value in schema["enum"]
        if "allOf" in schema:
            checks = [validate_schema(item, value) for item in schema["allOf"]]
            return all(check is not False for check in checks)
        # A bare {} response schema is emitted for several dict-returning routes.
        return None

    def check_call(
        client: TestClient,
        tokens: dict[str, str],
        screen: str,
        role: str,
        method: str,
        path: str,
        expected: tuple[str, ...] | str | None = None,
        *,
        data: dict | None = None,
        files: dict | None = None,
        params: dict | None = None,
        status: int = 200,
    ):
        nonlocal calls
        calls += 1
        response = client.request(
            method,
            path,
                        headers=(
                            {"Authorization": f"Bearer {tokens[role]}"}
                            if role in tokens and tokens[role]
                            else None
                        ),
            json=data if files is None else None,
            data=data if files is not None else None,
            files=files,
            params=params,
        )
        okay = response.status_code == status
        validation = "status"
        if okay and status == 200:
            try:
                payload = response.json()
            except ValueError:
                payload = None
                okay = False
            route_spec = spec["paths"].get(path.split("?", 1)[0], {})
            operation = route_spec.get(method.lower(), {})
            response_spec = operation.get("responses", {}).get("200", {})
            schema = (
                response_spec.get("content", {})
                .get("application/json", {})
                .get("schema", {})
            )
            schema_result = validate_schema(schema, payload)
            if schema_result is not None:
                validation = "OpenAPI"
                okay = okay and schema_result
            else:
                validation = "shape"
                okay = okay and required_shape(payload, expected)
        rows.append((screen, role, f"{method.upper()} {path}", str(response.status_code), validation if okay else "FAIL"))
        if not okay:
            missing.append((screen, f"{method.upper()} {path}: status={response.status_code}, body={response.text[:180]}"))
        return response

    with tempfile.TemporaryDirectory(prefix="vps-contract-") as temp_name:
        temp_dir = Path(temp_name)
        copied_db = temp_dir / "contract.db"
        with sqlite3.connect(source_db) as source, sqlite3.connect(copied_db) as target:
            source.backup(target)
        temp_engine = create_engine(
            f"sqlite:///{copied_db}", connect_args={"check_same_thread": False}
        )
        original_engine = db_module.engine
        original_data_dir = documents.settings.data_dir
        original_dbt_worker = dbt._mock_pfms_process
        original_fraud_worker = fraud._background_scan
        db_module.engine = temp_engine
        dbt.engine = temp_engine
        fraud.engine = temp_engine
        documents.settings.data_dir = str(temp_dir / "uploads")
        dbt._mock_pfms_process = lambda _txn_id: None
        fraud._background_scan = lambda: None

        def temp_session():
            with Session(temp_engine) as session:
                yield session

        app.dependency_overrides[db_module.get_session] = temp_session
        security._otp_store.clear()
        security._resend_cooldown.clear()
        try:
            with TestClient(app) as client:
                health_status = client.get("/health").status_code
                spec_status = client.get("/api/openapi.json").status_code
                tokens: dict[str, str] = {}
                for role, (identifier, mobile) in role_users.items():
                    sent = check_call(
                        client,
                        {role: ""},
                        "P2",
                        role,
                        "POST",
                        "/auth/otp/send",
                        ("success", "resend_after_seconds"),
                        data={"identifier": identifier, "mobile": mobile, "role": role},
                    )
                    if sent.status_code != 200:
                        continue
                    verified = client.post(
                        "/auth/otp/verify",
                        json={"identifier": identifier, "otp": "123456", "role": role},
                    )
                    if verified.status_code != 200:
                        missing.append((f"AUTH:{role}", f"POST /auth/otp/verify returned {verified.status_code}: {verified.text[:160]}"))
                        rows.append(("P3", role, "POST /auth/otp/verify", str(verified.status_code), "FAIL"))
                        continue
                    token_payload = verified.json()
                    okay = all(key in token_payload for key in ("access_token", "role", "sub", "scope"))
                    rows.append(("P3", role, "POST /auth/otp/verify", str(verified.status_code), "shape" if okay else "FAIL"))
                    if not okay:
                        missing.append((f"AUTH:{role}", "OTP verify response missing access_token/role/sub/scope"))
                    tokens[role] = token_payload["access_token"]

                if len(tokens) == len(role_users):
                    with Session(temp_engine) as session:
                        student = session.exec(select(Student).where(Student.cts_id == role_users["student"][0])).first()
                        scheme = session.exec(select(Scheme).where(Scheme.active.is_(True)).order_by(Scheme.id)).first()
                        school_id = student.school_id if student else None
                        assigned_student_ids = {
                            student_id
                            for student_id in session.exec(select(Cycle.student_id)).all()
                            if student_id is not None
                        }
                        handover_student = next(
                            (
                                candidate
                                for candidate in session.exec(
                                    select(Student).where(Student.school_id == school_id).order_by(Student.id)
                                ).all()
                                if candidate.id not in assigned_student_ids
                            ),
                            None,
                        )
                        if not handover_student:
                            missing.append(("seed", "no unassigned student found for the contract handover"))
                        school_user = session.exec(select(User).where(User.role == "school")).first()
                        taluka_user = session.exec(select(User).where(User.role == "taluka")).first()
                        vendor = session.exec(select(User).where(User.role == "vendor")).first()
                        if not student or not scheme or not school_user or not taluka_user or not vendor:
                            missing.append(("seed", "demo student/scheme/school/taluka/vendor not found in seed snapshot"))
                        else:
                            taluka_school = session.exec(
                                select(School).where(
                                    School.taluka_id == taluka_user.taluka_id
                                )
                            ).first()
                            taluka_student = (
                                session.exec(
                                    select(Student).where(
                                        Student.school_id == taluka_school.id
                                    )
                                ).first()
                                if taluka_school
                                else None
                            )
                            if not taluka_student:
                                missing.append(("seed", "no student found in the seeded taluka officer's scope"))
                            app_rows: dict[str, str] = {}
                            for key, route, state in (
                                ("school", "school", "applied"),
                                ("taluka", "taluka", "applied"),
                                ("deo", "deo", "applied"),
                                ("dbt", "deo", "deo_approved"),
                                ("bulk", "school", "applied"),
                                ("correction", "school", "applied"),
                                ("reject", "school", "applied"),
                                ("renewal", "school", "awaiting_consent"),
                                ("delegation", "school", "applied"),
                            ):
                                code = f"CONTRACT-{key.upper()}"
                                target_student_id = (
                                    taluka_student.id
                                    if key == "taluka" and taluka_student
                                    else student.id
                                )
                                session.add(
                                    Application(
                                        app_code=code,
                                        student_id=target_student_id,
                                        scheme_id=scheme.id,
                                        status=state,
                                        stage="school",
                                        route=route,
                                        amount=500,
                                        academic_year=f"2099-{key}",
                                    )
                                )
                                app_rows[key] = code
                            failed_app = Application(
                                app_code="CONTRACT-FAILED",
                                student_id=student.id,
                                scheme_id=scheme.id,
                                status="correction_requested",
                                route="deo",
                                amount=500,
                                academic_year="2099-failed",
                            )
                            session.add(failed_app)
                            session.flush()
                            failed_txn = DbtTxn(
                                application_id=failed_app.id,
                                amount=500,
                                status="failed",
                                idempotency_key="contract-failed-txn",
                            )
                            session.add(failed_txn)
                            session.add(
                                Notification(
                                    recipient_id=student.cts_id,
                                    notif_type="contract",
                                    title_en="Contract notification",
                                    title_gu="Contract notification",
                                    body="Contract runner",
                                )
                            )
                            session.add(
                                FraudFlag(
                                    flag_type="shared_mobile",
                                    entity_refs_json=json.dumps({"student_ids": [student.id]}),
                                    score=0.5,
                                    evidence_json="{}",
                                )
                            )
                            session.commit()
                            app_id_by_code = {
                                key: code for key, code in app_rows.items()
                            }
                            student_id = student.id
                            scheme_code = scheme.code
                            contract_school_id = school_id
                            contract_school_user_id = school_user.id
                            contract_student_id = student_id
                            contract_handover_student_id = handover_student.id if handover_student else student_id
                            first_flag = session.exec(select(FraudFlag).order_by(FraudFlag.id)).first()
                            flag_id = first_flag.id
                            failed_txn_id = failed_txn.id
                            notification = session.exec(
                                select(Notification).where(Notification.recipient_id == student.cts_id)
                            ).first()
                            notification_id = notification.id
                            bank = session.exec(select(BankAccount).where(BankAccount.student_id == student.id)).first()
                            if bank:
                                bank.verified = True
                                bank.aadhaar_seeded = True
                                session.commit()

                    if "student" in tokens:
                        check_call(client, tokens, "S1", "student", "GET", "/students/me", ("cts_id", "name_en"))
                        check_call(client, tokens, "S1", "student", "GET", "/students/me/schemes", "list")
                        check_call(client, tokens, "S2", "student", "GET", f"/eligibility/explain/{scheme_code}", ("scheme_code", "status", "steps"))
                        check_call(client, tokens, "S2", "student", "GET", f"/ai/explain/{scheme_code}", ("scheme_code", "lang", "text", "steps"))
                        check_call(client, tokens, "S6", "student", "GET", "/applications?page=1&size=50", ("items", "total", "page", "size"))
                        check_call(client, tokens, "S6", "student", "GET", f"/applications/{app_id_by_code['school']}", ("app_code", "status", "timeline"))
                        check_call(client, tokens, "S6", "student", "GET", f"/applications/{app_id_by_code['school']}/timeline", "list")
                        check_call(client, tokens, "S3", "student", "GET", "/documents", "list")
                        uploaded = check_call(client, tokens, "S4", "student", "POST", "/documents", ("id", "doc_type", "status", "ocr_fields", "authenticity"), data={"doc_type": "income"}, files={"file": ("income.png", b"demo", "image/png")})
                        doc_id = uploaded.json().get("id", 0) if uploaded.status_code == 200 else 0
                        if doc_id:
                            check_call(client, tokens, "S3", "student", "GET", f"/documents/{doc_id}", ("id", "doc_type", "status", "ocr_fields"))
                        check_call(client, tokens, "S3", "student", "POST", "/documents/fetch-digilocker", ("fetched", "source"))
                        guardian_otp = check_call(client, tokens, "S5", "student", "POST", "/applications/guardian-otp/send", ("success", "masked_mobile", "resend_after_seconds", "expires_in_seconds", "demo_otp"))
                        check_call(client, tokens, "S5", "student", "POST", "/applications/bulk", ("created", "skipped"), data={"scheme_codes": [scheme_code], "consent": True, "guardian_otp": guardian_otp.json().get("demo_otp", "")})
                        check_call(client, tokens, "S7", "student", "GET", "/students/me/cycle", ("assigned",))
                        check_call(client, tokens, "S8", "student", "GET", "/students/me/payments", ("total_credited", "transactions"))
                        grievance = check_call(client, tokens, "S9", "student", "POST", "/grievances", ("success", "grv_code"), data={"category": "other", "description": "Contract smoke test"})
                        grievance_code = grievance.json().get("grv_code", "") if grievance.status_code == 200 else ""
                        check_call(client, tokens, "S9", "student", "GET", "/grievances/me", "list")
                        if grievance_code:
                            check_call(client, tokens, "D5", "deo", "GET", f"/grievances/{grievance_code}", ("grv_code", "messages"))
                        check_call(client, tokens, "S10", "student", "GET", "/notifications", ("items", "unread_count"))
                        check_call(client, tokens, "S10", "student", "PATCH", f"/notifications/{notification_id}/read", ("success",))
                        check_call(client, tokens, "S10", "student", "POST", "/notifications/read-all", ("success", "marked"))
                        check_call(client, tokens, "S11", "student", "GET", "/students/me/consents", "object")
                        check_call(client, tokens, "S11", "student", "PUT", "/students/me/consents", "object", data={"values": {"guardian_consent": True, "share_documents": True, "auto_apply": False, "alerts": True}})
                        check_call(client, tokens, "S11", "student", "POST", "/students/me/data-export", ("profile", "family", "bank_accounts"))
                        check_call(client, tokens, "S12", "student", "POST", "/ai/chat", ("reply_text", "cards", "quick_replies"), data={"message": "What schemes can I apply for?", "lang": "en"})
                        if doc_id:
                            check_call(client, tokens, "S3", "student", "DELETE", f"/documents/{doc_id}", ("success", "deleted_id"))

                    # Detail and bulk application actions exercise route checks,
                    # scope and response fields from the UI workflow.
                    check_call(client, tokens, "SC3", "school", "POST", f"/applications/{app_id_by_code['school']}/approve", ("success", "app_code", "new_status", "route"), data={})
                    check_call(client, tokens, "SC2", "school", "POST", "/applications/bulk-approve", ("approved", "skipped", "count", "total", "skipped_count"), data={"app_codes": [app_id_by_code["bulk"]], "remark": "Contract"})
                    check_call(client, tokens, "SC3", "school", "POST", f"/applications/{app_id_by_code['correction']}/request-correction", ("success", "app_code", "fields"), data={"fields": ["income"], "note": "Contract"})
                    check_call(client, tokens, "SC3", "school", "POST", f"/applications/{app_id_by_code['reject']}/reject", ("success", "app_code", "new_status", "route"), data={"reason": "Contract"})
                    check_call(client, tokens, "SC1", "school", "GET", "/analytics/school", ("total_students", "total_applications", "pending"))
                    check_call(client, tokens, "SC6", "school", "GET", "/analytics/school/reports?type=summary", ("type", "total", "status_counts", "items"))
                    check_call(client, tokens, "SC4", "school", "POST", "/records/attendance/upload", ("total", "valid", "errors", "confirm_required"), data={}, files={"file": ("attendance.csv", b"cts_id,value\nGJ-AND-2026-004512,88\n", "text/csv")})
                    check_call(client, tokens, "SC4", "school", "POST", "/records/attendance/confirm", ("updated",), data={"rows": [{"cts_id": role_users["student"][0], "value": "88"}]})
                    check_call(client, tokens, "SC5", "school", "GET", "/cycles/overview", ("batches", "receivable_cycles", "handover_students"))
                    check_call(client, tokens, "D2", "taluka", "POST", f"/applications/{app_id_by_code['taluka']}/approve", ("success", "new_status", "route"), data={})
                    check_call(client, tokens, "D2", "deo", "POST", f"/applications/{app_id_by_code['school']}/approve", ("success", "new_status", "route"), data={})
                    check_call(client, tokens, "D2", "deo", "GET", "/delegations/me", "list")
                    check_call(client, tokens, "D2", "taluka", "POST", "/delegations", ("id", "status", "application_ids"), data={"to_user_id": contract_school_user_id, "application_ids": [app_id_by_code["delegation"]]})
                    check_call(client, tokens, "D1", "deo", "GET", "/analytics/district", ("total_students", "pending_approvals"))
                    check_call(client, tokens, "D3", "deo", "GET", "/cycles/overview", ("batches", "receivable_cycles", "handover_students"))
                    check_call(client, tokens, "D3", "deo", "GET", "/ml/forecast/cycles", ("model", "items", "total_forecast"))
                    check_call(client, tokens, "D4", "deo", "GET", "/ml/dropout/students?page=1&size=50", ("items", "total", "page", "size"))
                    check_call(client, tokens, "D4", "deo", "GET", f"/ml/dropout/students/{role_users['student'][0]}", ("cts_id", "score", "top_reasons"))
                    check_call(client, tokens, "D5", "deo", "GET", "/grievances", ("items", "total", "page", "size"))
                    check_call(client, tokens, "A1", "admin", "GET", "/analytics/state", ("total_students", "total_applications", "active_schemes"))
                    check_call(client, tokens, "A2", "admin", "GET", "/admin/schemes", "list")
                    created_scheme = check_call(client, tokens, "A2", "admin", "POST", "/admin/schemes", ("id", "code", "version"), data={"code": "contract-scheme", "name_en": "Contract Scheme", "rules": {"all": []}, "required_docs": [], "payout": {"amount": 100}, "budget": 1000})
                    scheme_id = created_scheme.json().get("id", 0)
                    if scheme_id:
                        check_call(client, tokens, "A2", "admin", "PUT", f"/admin/schemes/{scheme_id}/rules", ("id", "version", "published", "re_evaluated"), data={"rules": {"all": []}, "publish": True})
                    check_call(client, tokens, "A2", "admin", "POST", "/eligibility/test", ("result", "estimated_eligible_count"), data={"student_id": contract_student_id, "rules_json": "{}"})
                    check_call(client, tokens, "A3", "admin", "GET", "/funds/overview", ("budget", "sanctioned", "initiated", "credited", "failed", "schemes"))
                    check_call(client, tokens, "A3", "admin", "GET", "/dbt/reconciliation", ("by_status", "total_credited", "total_txns"))
                    check_call(client, tokens, "A3", "admin", "GET", "/dbt/transactions?page=1&size=50", ("items", "total", "page", "size"))
                    check_call(client, tokens, "A3", "admin", "POST", "/dbt/sanction", ("sanctioned", "count"), data={"application_ids": [app_id_by_code["dbt"]]})
                    initiated = check_call(client, tokens, "A3", "admin", "POST", "/dbt/initiate", ("initiated", "count"), data={"application_ids": [app_id_by_code["dbt"]], "idempotency_key": "contract-run"})
                    txn_id = initiated.json().get("initiated", [{}])[0].get("txn_id") if initiated.status_code == 200 else None
                    if txn_id:
                        check_call(client, tokens, "S8", "student", "GET", f"/dbt/receipt/{txn_id}", ("receipt_id", "app_code", "amount", "status"))
                    check_call(client, tokens, "A3", "admin", "POST", f"/dbt/{failed_txn_id}/retry", ("success", "txn_id"), data=None)
                    check_call(client, tokens, "A3", "admin", "GET", "/ml/forecast/budget", ("items", "total_forecast_budget"))
                    check_call(client, tokens, "A3", "admin", "GET", "/admin/settings", "object")
                    check_call(client, tokens, "A3", "admin", "PUT", "/admin/settings", ("updated",), data={"values": {"CONTRACT_CHECK": True}})
                    check_call(client, tokens, "A4", "admin", "GET", "/fraud/flags?page=1&size=50", ("items", "total", "page", "size"))
                    check_call(client, tokens, "A4", "admin", "GET", f"/fraud/flags/{flag_id}", ("id", "flag_type", "graph", "evidence"))
                    check_call(client, tokens, "A4", "admin", "PATCH", f"/fraud/flags/{flag_id}", ("id", "status"), data={"status": "investigating"})
                    check_call(client, tokens, "A4", "admin", "POST", "/fraud/rescan", ("message", "status"))
                    check_call(client, tokens, "A5", "admin", "GET", "/audit/logs?page=1&size=50", ("items", "total", "page", "size"))
                    check_call(client, tokens, "A5", "admin", "GET", "/audit/verify-chain", ("valid", "entries", "first_broken_index"))
                    check_call(client, tokens, "V1", "vendor", "GET", "/vendor/batches", "list")
                    batch = check_call(client, tokens, "V1", "vendor", "POST", "/vendor/batches", ("id", "batch_code", "qty", "serials", "status"), data={"school_id": contract_school_id, "qty": 1})
                    batch_id = batch.json().get("id", 0)
                    serials = batch.json().get("serials", [])
                    if batch_id and serials:
                        check_call(client, tokens, "V1", "vendor", "POST", f"/batches/{batch_id}/dispatch", ("id", "status", "dispatched_at"), data={"lat": 22.56, "lng": 72.95})
                        check_call(client, tokens, "V1", "vendor", "POST", f"/batches/{batch_id}/gps", ("success", "points"), data={"lat": 22.57, "lng": 72.96})
                        check_call(client, tokens, "SC5", "school", "POST", f"/batches/{batch_id}/receive", ("batch_id", "status", "received_qty", "expected_qty", "mismatch"), data={"received_qty": 1, "scanned_serials": serials})
                        started = check_call(client, tokens, "SC5", "school", "POST", "/handover/initiate", ("success", "cycle_serial", "expires_in_seconds", "demo_otp"), data={"student_id": contract_handover_student_id, "cycle_serial": serials[0]})
                        otp = started.json().get("demo_otp", "123456") if started.status_code == 200 else "123456"
                        check_call(client, tokens, "SC5", "school", "POST", "/handover/confirm", ("success", "serial_no", "status", "handed_at"), data={"cycle_serial": serials[0], "otp": otp, "photo_path": "", "lat": 22.56, "lng": 72.95})
                    check_call(client, tokens, "X1", "admin", "POST", f"/demo/promote/{role_users['student'][0]}", ("cts_id", "diff"))

                if health_status != 200 or spec_status != 200:
                    missing.append(("API", f"health={health_status}, openapi={spec_status}"))
        finally:
            app.dependency_overrides.clear()
            db_module.engine = original_engine
            dbt.engine = original_engine
            fraud.engine = original_engine
            documents.settings.data_dir = original_data_dir
            dbt._mock_pfms_process = original_dbt_worker
            fraud._background_scan = original_fraud_worker
            temp_engine.dispose()

    print("screen | role | endpoint | status | response validation")
    for screen, role, endpoint, status, validation in rows:
        print(f"{screen} | {role} | {endpoint} | {status} | {validation}")
    for screen, (page, endpoints) in SCREENS.items():
        okay = (ROOT / page).is_file() and all(path in api_paths for path in endpoints)
        print(f"ROUTE {screen} | {page} | {len(endpoints)} | {'ok' if okay else 'missing'}")
    if missing:
        for screen, issue in missing:
            print(f"FAIL {screen}: {issue}")
        print(f"Contract check: failed ({len(missing)} issue(s), {calls} endpoint calls).")
        return 1
    print("Contract check: 33/33 screens have a frontend route and registered API path (P1 is static).")
    print(f"Endpoint contract check: {calls} calls passed across 6 seeded roles.")
    print("Response validation: OpenAPI schemas were checked where declared; handler responses without schemas used explicit shape assertions.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
