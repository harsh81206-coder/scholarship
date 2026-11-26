"""Core scholarship approval, payment, logistics, and ledger demo path."""

from __future__ import annotations

import json

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine, select
from sqlmodel.pool import StaticPool

from app.db import get_session
from app.main import app
from app.models.core import (
    AcademicRecord,
    Application,
    BankAccount,
    AuditLog,
    District,
    Document,
    DbtTxn,
    EligibilityResult,
    Family,
    School,
    Scheme,
    Notification,
    Setting,
    Student,
    Taluka,
    User,
)
from app.security import create_access_token
from app.services.eligibility import _eval_rule, evaluate, stacking_optimizer


@pytest.fixture
def demo_api():
    from app.security import _otp_store, _resend_cooldown

    # These stores intentionally model an in-memory SMS gateway; isolate each
    # fixture so one test's cooldown cannot affect another test's OTP flow.
    _otp_store.clear()
    _resend_cooldown.clear()
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    SQLModel.metadata.create_all(engine)
    session = Session(engine)
    district = District(name="Anand")
    session.add(district)
    session.flush()
    taluka = Taluka(name="Anand", district_id=district.id)
    session.add(taluka)
    session.flush()
    school = School(
        udise_code="24150104502",
        name_en="Shree Sardar Patel High School",
        principal_name="Dr. Kalpesh Shah",
        taluka_id=taluka.id,
    )
    session.add(school)
    session.flush()
    student = Student(
        cts_id="GJ-AND-2026-004512",
        mobile="9876543210",
        name_en="Riya Patel",
        name_gu="રિયા પટેલ",
        dob="2009-08-15",
        gender="female",
        caste_category="obc",
        school_id=school.id,
        grade=9,
        guardian_name="Hetalben Patel",
        guardian_mobile="9876543211",
        guardian_consent=True,
    )
    session.add(student)
    session.flush()
    session.add_all(
        [
            AcademicRecord(
                student_id=student.id,
                year=2026,
                grade=9,
                attendance_pct=88,
                marks_pct=79,
            ),
            Family(
                student_id=student.id,
                annual_income=96000,
                income_cert_id="REV/AND/2026/049182",
            ),
            BankAccount(
                student_id=student.id,
                holder_type="mother",
                holder_name="Hetalben Patel",
                account_hash="seeded-bank-hash",
                last4="4521",
                aadhaar_seeded=False,
                verified=True,
            ),
            Document(
                student_id=student.id,
                doc_type="income",
                status="verified",
                confidence=0.4,
            ),
            User(
                officer_id="SCH-AND-001",
                mobile="9898000001",
                name="Dr. Kalpesh Shah",
                role="school",
                school_id=school.id,
            ),
            User(
                officer_id="TPEO-AND-001",
                mobile="9898000002",
                name="Taluka Officer",
                role="taluka",
                taluka_id=taluka.id,
            ),
            User(
                officer_id="DEO-AND-001",
                mobile="9898000003",
                name="DEO Anand",
                role="deo",
                district_id=district.id,
            ),
            User(
                officer_id="ADMIN-STATE-001",
                mobile="9898000004",
                name="State Admin",
                role="admin",
            ),
            User(
                officer_id="VND-001",
                mobile="9898000005",
                name="Hero Cycles Gujarat",
                role="vendor",
            ),
        ]
    )
    scheme = Scheme(
        code="demo-cash",
        name_en="Demo Scholarship",
        scheme_type="cash",
        rules_json=json.dumps({"all": [{"field": "grade", "op": ">=", "value": 9}]}),
        required_docs_json="[]",
        payout_json=json.dumps({"amount": 10000}),
        budget=500000,
    )
    session.add(scheme)
    session.commit()

    def override():
        yield session

    app.dependency_overrides[get_session] = override
    with TestClient(app) as client:
        yield client, session, student, school
    app.dependency_overrides.clear()
    session.close()
    _otp_store.clear()
    _resend_cooldown.clear()


def headers(
    role: str,
    identifier: str,
    school_id: int | None = None,
    taluka_id: int | None = None,
    district_id: int | None = None,
) -> dict[str, str]:
    token = create_access_token(
        {
            "sub": identifier,
            "role": role,
            "name": identifier,
            "school_id": school_id,
            "taluka_id": taluka_id,
            "district_id": district_id,
        }
    )
    return {"Authorization": f"Bearer {token}"}


def apply_with_guardian_otp(
    client: TestClient,
    student_cts_id: str,
    scheme_codes: list[str],
    consent: bool = True,
):
    student_headers = headers("student", student_cts_id)
    from app.security import _resend_cooldown

    _resend_cooldown.pop(f"guardian:guardian:{student_cts_id}", None)
    sent = client.post(
        "/applications/guardian-otp/send", headers=student_headers
    )
    assert sent.status_code == 200, sent.text
    return client.post(
        "/applications/bulk",
        json={
            "scheme_codes": scheme_codes,
            "consent": consent,
            "guardian_otp": sent.json()["demo_otp"],
        },
        headers=student_headers,
    )


def test_full_demo_path(demo_api, monkeypatch, tmp_path):
    client, session, student, school = demo_api
    student_auth = headers("student", student.cts_id)
    school_auth = headers("school", "SCH-AND-001", school_id=school.id)
    deo_auth = headers("deo", "DEO-AND-001", district_id=1)
    admin_auth = headers("admin", "ADMIN-STATE-001")
    vendor_auth = headers("vendor", "VND-001")

    # Force this synthetic application into the 5% school audit sample so the
    # golden path exercises the school -> DEO handoff explicitly.
    session.add_all(
        [
            Setting(key="RISK_AUTO_THRESHOLD", value_json="1.0"),
            Setting(key="AUTO_AUDIT_SAMPLE_PCT", value_json="100"),
        ]
    )
    session.commit()

    applied = apply_with_guardian_otp(client, student.cts_id, ["demo-cash"])
    assert applied.status_code == 200, applied.text
    app_code = applied.json()["created"][0]
    for role_auth in (school_auth, deo_auth):
        response = client.post(
            f"/applications/{app_code}/approve",
            json={"remark": "Verified"},
            headers=role_auth,
        )
        assert response.status_code == 200, response.text

    assert (
        client.post(
            "/dbt/sanction", json={"application_ids": [app_code]}, headers=admin_auth
        ).status_code
        == 200
    )
    bank = session.exec(
        select(BankAccount).where(BankAccount.student_id == student.id)
    ).first()
    bank.aadhaar_seeded = True
    session.commit()

    def credit(txn_id: int) -> None:
        from app.models.core import Application, DbtTxn
        from datetime import datetime

        txn = session.get(DbtTxn, txn_id)
        txn.status = "credited"
        txn.utr = "SBIN2611020045"
        txn.credited_at = datetime.utcnow()
        session.get(Application, txn.application_id).status = "credited"
        session.commit()

    monkeypatch.setattr("app.routers.dbt._mock_pfms_process", credit)
    initiated = client.post(
        "/dbt/initiate", json={"application_ids": [app_code]}, headers=admin_auth
    )
    assert initiated.status_code == 200, initiated.text
    txn_id = initiated.json()["initiated"][0]["txn_id"]
    payments = client.get("/students/me/payments", headers=student_auth).json()
    assert payments["total_credited"] == 10000
    assert payments["transactions"][0]["id"] == txn_id
    assert payments["transactions"][0]["app_code"] == app_code
    assert (
        client.get(f"/dbt/receipt/{txn_id}", headers=student_auth).json()["utr"]
        == "SBIN2611020045"
    )

    batch = client.post(
        "/vendor/batches", json={"school_id": school.id, "qty": 1}, headers=vendor_auth
    )
    assert batch.status_code == 200, batch.text
    data = batch.json()
    assert (
        client.post(
            f"/batches/{data['id']}/dispatch",
            json={"lat": 22.56, "lng": 72.95},
            headers=vendor_auth,
        ).status_code
        == 200
    )
    assert (
        client.post(
            f"/batches/{data['id']}/receive",
            json={"received_qty": 1, "scanned_serials": data["serials"]},
            headers=school_auth,
        ).json()["status"]
        == "received"
    )
    handover = client.post(
        "/handover/initiate",
        json={"student_id": student.id, "cycle_serial": data["serials"][0]},
        headers=school_auth,
    )
    assert handover.status_code == 200, handover.text
    complete = client.post(
        "/handover/confirm",
        json={"cycle_serial": data["serials"][0], "otp": handover.json()["demo_otp"]},
        headers=school_auth,
    )
    assert complete.status_code == 200, complete.text

    promoted = client.post(f"/demo/promote/{student.cts_id}", headers=admin_auth)
    assert promoted.status_code == 200, promoted.text
    assert len(promoted.json()["diff"]["renewed"]) == 1
    renewal_code = promoted.json()["diff"]["renewed"][0]["app_code"]
    consent = client.post(
        f"/applications/{renewal_code}/renewal-consent",
        json={"consent": True},
        headers=student_auth,
    )
    assert consent.status_code == 200, consent.text
    assert consent.json()["status"] == "applied"
    assert client.get("/audit/verify-chain", headers=admin_auth).json()["valid"] is True
    renewal_notice = session.exec(
        select(Notification).where(
            Notification.recipient_id == student.cts_id,
            Notification.title_en.like("Renewal available:%"),
        )
    ).first()
    assert renewal_notice is not None

    from app.routers.documents import settings as document_settings

    monkeypatch.setattr(document_settings, "data_dir", str(tmp_path))
    upload = client.post(
        "/documents",
        data={"doc_type": "income"},
        files={"file": ("cert.png", b"demo", "image/png")},
        headers=student_auth,
    )
    assert upload.status_code == 200, upload.text
    assert upload.json()["authenticity"]["overall"] == "genuine"


@pytest.mark.parametrize(
    ("operator", "actual", "expected", "passed"),
    [
        ("==", 4, 4, True),
        ("==", 4, 5, False),
        ("!=", 4, 5, True),
        (">=", 5, 5, True),
        ("<=", 4, 5, True),
        (">", 6, 5, True),
        ("<", 4, 5, True),
        ("in", "obc", ["obc", "sebc"], True),
        ("not_in", "general", ["obc", "sebc"], True),
        ("between", 5, [4, 6], True),
    ],
)
def test_eligibility_rule_operators(operator, actual, expected, passed):
    result, detail = _eval_rule(
        {"field": "value", "op": operator, "value": expected}, {"value": actual}
    )
    assert result is passed
    assert detail["passed"] is passed


@pytest.mark.parametrize("language_key", ["fix_hint_en", "fix_hint_gu", "fix_hint_hi"])
def test_eligibility_gap_hint_has_three_language_fields(language_key):
    passed, detail = _eval_rule(
        {"field": "attendance_pct", "op": ">=", "value": 90},
        {"attendance_pct": 70},
    )
    assert passed is False
    assert detail[language_key]


def test_eligibility_missing_context_returns_localized_hint():
    passed, detail = _eval_rule(
        {"field": "attendance_pct", "op": ">=", "value": 70}, {}
    )
    assert passed is False
    assert detail["fix_hint_en"]
    assert detail["fix_hint_gu"]
    assert detail["fix_hint_hi"]


def test_stacking_optimizer_explains_mutual_exclusion():
    result = stacking_optimizer(
        [
            {
                "scheme_code": "gyan-setu",
                "status": "eligible",
                "amount": 12000,
                "mutually_exclusive_with": ["nmms"],
            },
            {
                "scheme_code": "nmms",
                "status": "eligible",
                "amount": 10000,
                "mutually_exclusive_with": ["gyan-setu"],
            },
        ]
    )
    assert [item["scheme_code"] for item in result["selected"]] == ["gyan-setu"]
    assert result["excluded"] == [
        {
            "scheme_code": "nmms",
            "conflicts_with": "gyan-setu",
            "reason": "mutually_exclusive",
        }
    ]


def test_bulk_apply_reapply_is_idempotent_and_stores_scheme_version(demo_api):
    client, session, student, school = demo_api
    first = apply_with_guardian_otp(client, student.cts_id, ["demo-cash"])
    assert first.status_code == 200, first.text
    second = apply_with_guardian_otp(client, student.cts_id, ["demo-cash"])
    assert second.status_code == 200
    assert second.json()["skipped"][0]["reason"] == "already_applied"
    result = session.exec(select(EligibilityResult)).first()
    assert result is not None and result.scheme_version == 1


def test_bulk_apply_rejects_missing_consent_and_wrong_role(demo_api):
    client, _, student, school = demo_api
    missing_consent = client.post(
        "/applications/bulk",
        json={"scheme_codes": ["demo-cash"], "consent": False},
        headers=headers("student", student.cts_id),
    )
    wrong_role = client.post(
        "/applications/bulk",
        json={"scheme_codes": ["demo-cash"], "consent": True},
        headers=headers("school", "SCH-AND-001", school.id),
    )
    assert missing_consent.status_code == 400
    assert wrong_role.status_code == 403


def test_auto_approval_and_audit_sample_route(demo_api, monkeypatch):
    client, session, student, school = demo_api
    session.exec(select(Document)).all()[0].confidence = 0.99
    bank = session.exec(select(BankAccount)).first()
    bank.aadhaar_seeded = True
    session.commit()
    monkeypatch.setattr("app.routers.applications.random.random", lambda: 0.5)
    auto = apply_with_guardian_otp(client, student.cts_id, ["demo-cash"])
    app_code = auto.json()["created"][0]
    row = session.exec(select(Application).where(Application.app_code == app_code)).first()
    assert row.status == "auto_verified"
    monkeypatch.setattr("app.routers.applications.random.random", lambda: 0.0)
    # Another academic year allows a separate audit-sample case.
    row.academic_year = "2025-26"
    session.commit()
    sampled = apply_with_guardian_otp(client, student.cts_id, ["demo-cash"])
    sampled_row = session.exec(
        select(Application).where(Application.app_code == sampled.json()["created"][0])
    ).first()
    assert sampled_row.route == "school"
    assert sampled_row.status == "applied"
    auto_notice = session.exec(
        select(Notification).where(Notification.recipient_id == student.cts_id)
    ).first()
    assert auto_notice is not None


@pytest.mark.parametrize(
    ("gender", "expected_status"), [("female", "eligible"), ("male", "ineligible")]
)
def test_eligibility_any_group_requires_one_match(demo_api, gender, expected_status):
    client, session, student, school = demo_api
    from app.models.core import Scheme

    student.gender = gender
    scheme = Scheme(
        code="any-rule",
        name_en="Any rule",
        rules_json=json.dumps(
            {"any": [{"field": "gender", "op": "==", "value": "female"}]}
        ),
        required_docs_json="[]",
    )
    session.add(scheme)
    session.commit()
    result = evaluate(student.id, scheme, session)
    assert result["status"] == expected_status


def test_eligibility_reports_missing_documents(demo_api):
    client, session, student, school = demo_api
    from app.models.core import Scheme

    scheme = Scheme(
        code="missing-doc",
        name_en="Missing document",
        rules_json="{}",
        required_docs_json=json.dumps(["residence"]),
    )
    session.add(scheme)
    session.commit()
    result = evaluate(student.id, scheme, session)
    assert result["status"] == "pending_docs"
    assert result["missing_docs"] == ["residence"]


def test_dbt_duplicate_payment_guard_for_student_scheme_year(demo_api, monkeypatch):
    client, session, student, school = demo_api
    bank = session.exec(select(BankAccount)).first()
    bank.aadhaar_seeded = True
    bank.verified = True
    scheme = session.exec(select(Scheme).where(Scheme.code == "demo-cash")).first()
    apps = [
        Application(
            app_code=f"APP-DUP-{index}",
            student_id=student.id,
            scheme_id=scheme.id,
            status="sanctioned",
            amount=10000,
            academic_year="2026-27",
        )
        for index in (1, 2)
    ]
    session.add_all(apps)
    session.commit()
    monkeypatch.setattr("app.routers.dbt._mock_pfms_process", lambda _txn_id: None)
    result = client.post(
        "/dbt/initiate",
        json={"application_ids": [app.app_code for app in apps], "idempotency_key": "demo-batch"},
        headers=headers("admin", "ADMIN-STATE-001"),
    )
    assert result.status_code == 200, result.text
    assert len({item["txn_id"] for item in result.json()["initiated"]}) == 1
    assert len(session.exec(select(DbtTxn)).all()) == 1


def test_dbt_retry_requires_officer_role(demo_api, monkeypatch):
    client, session, student, school = demo_api
    scheme = session.exec(select(Scheme).where(Scheme.code == "demo-cash")).first()
    app = Application(
        app_code="APP-FAILED-RETRY",
        student_id=student.id,
        scheme_id=scheme.id,
        status="correction_requested",
        amount=10000,
    )
    session.add(app)
    session.flush()
    txn = DbtTxn(
        application_id=app.id,
        amount=10000,
        status="failed",
        failure_reason="name_mismatch",
        idempotency_key="failed-retry-key",
    )
    session.add(txn)
    session.commit()
    denied = client.post(
        f"/dbt/{txn.id}/retry", headers=headers("student", student.cts_id)
    )
    assert denied.status_code == 403
    monkeypatch.setattr("app.routers.dbt._mock_pfms_process", lambda _txn_id: None)
    retried = client.post(
        f"/dbt/{txn.id}/retry", headers=headers("admin", "ADMIN-STATE-001")
    )
    assert retried.status_code == 200


def test_application_detail_rejects_out_of_school_scope(demo_api):
    client, _, student, school = demo_api
    applied = apply_with_guardian_otp(client, student.cts_id, ["demo-cash"])
    app_code = applied.json()["created"][0]
    outside_scope = client.get(
        f"/applications/{app_code}",
        headers=headers("school", "SCH-OTHER", school.id + 1),
    )
    assert outside_scope.status_code == 403


def test_stacking_conflict_is_reported_by_bulk_apply(demo_api):
    client, session, student, school = demo_api
    from app.models.core import Scheme

    session.add_all(
        [
            Scheme(
                code="scheme-a",
                name_en="Scheme A",
                rules_json=json.dumps({"all": [{"field": "grade", "op": ">=", "value": 9}]}),
                payout_json=json.dumps({"amount": 12000}),
                mutually_exclusive_with_json=json.dumps(["scheme-b"]),
            ),
            Scheme(
                code="scheme-b",
                name_en="Scheme B",
                rules_json=json.dumps({"all": [{"field": "grade", "op": ">=", "value": 9}]}),
                payout_json=json.dumps({"amount": 10000}),
            ),
        ]
    )
    session.commit()
    result = apply_with_guardian_otp(client, student.cts_id, ["scheme-a", "scheme-b"])
    assert result.status_code == 200, result.text
    assert result.json()["created"]
    assert result.json()["skipped"][0]["reason"] == "stacking_conflict"
    assert result.json()["skipped"][0]["conflicts_with"] == "scheme-a"


def test_bulk_approval_route_filter_returns_totals(demo_api):
    client, _, student, school = demo_api
    applied = apply_with_guardian_otp(client, student.cts_id, ["demo-cash"])
    app_code = applied.json()["created"][0]
    result = client.post(
        "/applications/bulk-approve",
        json={"app_codes": [app_code]},
        headers=headers("school", "SCH-AND-001", school.id),
    )
    assert result.status_code == 200
    assert result.json()["total"] == 1
    assert result.json()["count"] == 0
    assert result.json()["skipped_count"] == 1


def test_approve_invalid_state_is_rejected(demo_api):
    client, session, student, school = demo_api
    applied = apply_with_guardian_otp(client, student.cts_id, ["demo-cash"])
    app_code = applied.json()["created"][0]
    # This test targets the school review state; route mismatch has a separate
    # regression check below.
    row = session.exec(select(Application).where(Application.app_code == app_code)).first()
    row.route = "school"
    session.commit()
    approved = client.post(
        f"/applications/{app_code}/approve",
        json={},
        headers=headers("school", "SCH-AND-001", school.id),
    )
    duplicate = client.post(
        f"/applications/{app_code}/approve",
        json={},
        headers=headers("school", "SCH-AND-001", school.id),
    )
    assert approved.status_code == 200
    assert duplicate.status_code == 400


def test_detail_approval_requires_current_route_and_advances_to_deo(demo_api):
    client, session, student, school = demo_api
    applied = apply_with_guardian_otp(client, student.cts_id, ["demo-cash"])
    app_code = applied.json()["created"][0]
    row = session.exec(select(Application).where(Application.app_code == app_code)).first()
    row.route = "school"
    session.commit()

    wrong_route = client.post(
        f"/applications/{app_code}/approve",
        json={},
        headers=headers("taluka", "TPEO-AND-001", taluka_id=school.taluka_id),
    )
    assert wrong_route.status_code == 403

    school_approved = client.post(
        f"/applications/{app_code}/approve",
        json={},
        headers=headers("school", "SCH-AND-001", school.id),
    )
    assert school_approved.status_code == 200, school_approved.text
    assert school_approved.json()["route"] == "deo"

    deo_approved = client.post(
        f"/applications/{app_code}/approve",
        json={},
        headers=headers("deo", "DEO-AND-001", district_id=1),
    )
    assert deo_approved.status_code == 200, deo_approved.text
    assert deo_approved.json()["new_status"] == "deo_approved"


def test_student_consent_hook_payload_updates_values(demo_api):
    client, _, student, _ = demo_api
    response = client.put(
        "/students/me/consents",
        json={"values": {"guardian_consent": False, "alerts": False}},
        headers=headers("student", student.cts_id),
    )
    assert response.status_code == 200, response.text
    assert response.json() == {"guardian_consent": False, "alerts": False}
    assert client.get(
        "/students/me/consents", headers=headers("student", student.cts_id)
    ).json() == {"guardian_consent": False, "alerts": False}


def test_bulk_apply_requires_one_time_guardian_otp(demo_api):
    client, _, student, _ = demo_api
    from app.security import _otp_store, _resend_cooldown

    _otp_store.clear()
    _resend_cooldown.clear()
    student_auth = headers("student", student.cts_id)
    missing = client.post(
        "/applications/bulk",
        json={"scheme_codes": ["demo-cash"], "consent": True},
        headers=student_auth,
    )
    assert missing.status_code == 400

    sent = client.post("/applications/guardian-otp/send", headers=student_auth)
    assert sent.status_code == 200, sent.text
    payload = sent.json()
    assert payload["masked_mobile"].endswith("11")
    assert payload["demo_otp"] == "123456"
    assert student.guardian_mobile not in str(payload)

    invalid = client.post(
        "/applications/bulk",
        json={
            "scheme_codes": ["demo-cash"],
            "consent": True,
            "guardian_otp": "000000",
        },
        headers=student_auth,
    )
    assert invalid.status_code == 400

    applied = client.post(
        "/applications/bulk",
        json={
            "scheme_codes": ["demo-cash"],
            "consent": True,
            "guardian_otp": payload["demo_otp"],
        },
        headers=student_auth,
    )
    assert applied.status_code == 200, applied.text
    reused = client.post(
        "/applications/bulk",
        json={
            "scheme_codes": ["demo-cash"],
            "consent": True,
            "guardian_otp": payload["demo_otp"],
        },
        headers=student_auth,
    )
    assert reused.status_code == 400


def test_audit_chain_finds_first_tampered_row(demo_api):
    client, session, student, school = demo_api
    admin_auth = headers("admin", "ADMIN-STATE-001")
    apply_with_guardian_otp(client, student.cts_id, ["demo-cash"])
    first = session.exec(select(AuditLog).order_by(AuditLog.id)).first()
    first.after_json = '{"tampered":true}'
    session.commit()
    result = client.get("/audit/verify-chain", headers=admin_auth)
    assert result.status_code == 200
    assert result.json()["valid"] is False
    assert result.json()["first_broken_index"] == 0


def test_published_scheme_rules_re_evaluate_and_version_results(demo_api):
    client, session, student, school = demo_api
    apply_with_guardian_otp(client, student.cts_id, ["demo-cash"])
    scheme_id = session.exec(select(Scheme.id).where(Scheme.code == "demo-cash")).first()
    result = client.put(
        f"/admin/schemes/{scheme_id}/rules",
        json={"rules": {"all": [{"field": "grade", "op": ">=", "value": 8}]}, "publish": True},
        headers=headers("admin", "ADMIN-STATE-001"),
    )
    assert result.status_code == 200, result.text
    assert result.json()["version"] == 2
    assert result.json()["re_evaluated"] == 1
    stored = session.exec(select(EligibilityResult)).first()
    assert stored.scheme_version == 2


@pytest.mark.parametrize("role", ["school", "taluka", "deo", "admin", "vendor"])
def test_student_profile_route_rejects_officer_roles(demo_api, role):
    client, _, student, _ = demo_api
    response = client.get("/students/me", headers=headers(role, f"{role}-test"))
    assert response.status_code == 403


@pytest.mark.parametrize("role", ["school", "taluka", "deo", "admin", "vendor"])
def test_guardian_otp_route_rejects_officer_roles(demo_api, role):
    client, _, _, _ = demo_api
    response = client.post(
        "/applications/guardian-otp/send", headers=headers(role, f"{role}-test")
    )
    assert response.status_code == 403


@pytest.mark.parametrize("role", ["student", "school", "taluka", "vendor"])
def test_dbt_sanction_rejects_roles_without_payment_authority(demo_api, role):
    client, _, _, _ = demo_api
    response = client.post(
        "/dbt/sanction",
        json={"application_ids": ["MISSING-APP"]},
        headers=headers(role, f"{role}-test"),
    )
    assert response.status_code == 403


@pytest.mark.parametrize("role", ["student", "taluka", "deo", "vendor"])
def test_cycle_handover_start_rejects_non_school_roles(demo_api, role):
    client, _, _, _ = demo_api
    response = client.post(
        "/handover/initiate",
        json={"student_id": 1, "cycle_serial": "UNKNOWN"},
        headers=headers(role, f"{role}-test"),
    )
    assert response.status_code == 403


@pytest.mark.parametrize("role", ["student", "taluka", "deo", "vendor"])
def test_cycle_handover_confirmation_rejects_non_school_roles(demo_api, role):
    client, _, _, _ = demo_api
    response = client.post(
        "/handover/confirm",
        json={"cycle_serial": "UNKNOWN", "otp": "123456"},
        headers=headers(role, f"{role}-test"),
    )
    assert response.status_code == 403


@pytest.mark.parametrize("role", ["student", "school", "taluka", "deo", "vendor"])
def test_demo_promotion_rejects_non_admin_roles(demo_api, role):
    client, _, student, _ = demo_api
    response = client.post(
        f"/demo/promote/{student.cts_id}", headers=headers(role, f"{role}-test")
    )
    assert response.status_code == 403
