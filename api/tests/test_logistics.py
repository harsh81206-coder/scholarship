"""Integration checks for offline vendor-to-student cycle handover."""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine, select
from sqlmodel.pool import StaticPool
from datetime import datetime, timedelta

from app.db import get_session
from app.main import app
from app.models.core import AcademicRecord, Cycle, CycleBatch, District, Grievance, Handover, Notification, School, Student, Taluka, User
from app.routers.logistics import _signed_payload
from app.security import create_access_token


@pytest.fixture
def setup_client():
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
        taluka_id=taluka.id,
    )
    session.add(school)
    session.flush()
    student = Student(
        cts_id="GJ-AND-2026-004512",
        mobile="9876543210",
        name_en="Riya Patel",
        school_id=school.id,
        grade=9,
        guardian_consent=True,
    )
    vendor = User(
        officer_id="VND-001", mobile="9898000005", name="Hero Cycles", role="vendor"
    )
    officer = User(
        officer_id="SCH-AND-001",
        mobile="9898000001",
        name="Dr. Kalpesh Shah",
        role="school",
        school_id=school.id,
    )
    deo = User(
        officer_id="DEO-AND-001",
        mobile="9898000003",
        name="DEO Anand",
        role="deo",
        district_id=district.id,
    )
    session.add_all([student, vendor, officer, deo])
    session.commit()

    def override():
        yield session

    app.dependency_overrides[get_session] = override
    with TestClient(app) as client:
        yield client, student, school, session
    app.dependency_overrides.clear()
    session.close()


def auth(
    role: str,
    sub: str,
    school_id: int | None = None,
    taluka_id: int | None = None,
    district_id: int | None = None,
) -> dict[str, str]:
    token = create_access_token(
        {
            "sub": sub,
            "role": role,
            "name": sub,
            "school_id": school_id,
            "taluka_id": taluka_id,
            "district_id": district_id,
        }
    )
    return {"Authorization": f"Bearer {token}"}


def test_vendor_to_student_handover(setup_client):
    client, student, school, session = setup_client
    vendor_headers = auth("vendor", "VND-001")
    school_headers = auth("school", "SCH-AND-001", school.id)

    created = client.post(
        "/vendor/batches",
        json={"school_id": school.id, "qty": 1},
        headers=vendor_headers,
    )
    assert created.status_code == 200, created.text
    batch = created.json()
    serial = batch["serials"][0]

    dispatched = client.post(
        f"/batches/{batch['id']}/dispatch",
        json={"lat": 22.56, "lng": 72.95},
        headers=vendor_headers,
    )
    assert dispatched.json()["status"] == "dispatched"
    received = client.post(
        f"/batches/{batch['id']}/receive",
        json={"received_qty": 1, "scanned_serials": [serial]},
        headers=school_headers,
    )
    assert received.json()["status"] == "received"

    roster = client.get("/cycles/overview", headers=school_headers).json()
    assert roster["receivable_cycles"] == [
        {"serial_no": serial, "batch_id": batch["id"], "status": "received"}
    ]
    assert any(
        entry["id"] == student.id and entry["cts_id"] == student.cts_id
        for entry in roster["handover_students"]
    )

    started = client.post(
        "/handover/initiate",
        json={"student_id": student.id, "cycle_serial": serial},
        headers=school_headers,
    )
    assert started.status_code == 200, started.text
    otp = started.json()["demo_otp"]
    done = client.post(
        "/handover/confirm",
        json={"cycle_serial": serial, "otp": otp},
        headers=school_headers,
    )
    assert done.status_code == 200, done.text
    assert done.json()["status"] == "handed_over"
    delivered_roster = client.get("/cycles/overview", headers=school_headers).json()
    assert delivered_roster["delivered"] == 1
    assert delivered_roster["receivable_cycles"] == []
    assert all(entry["id"] != student.id for entry in delivered_roster["handover_students"])
    vendor_notice = session.exec(
        select(Notification).where(Notification.recipient_id == "VND-001")
    ).first()
    assert vendor_notice.notif_type == "vendor_payment"


def test_school_cannot_receive_other_school_batch(setup_client):
    client, _, school, _ = setup_client
    created = client.post(
        "/vendor/batches",
        json={"school_id": school.id, "qty": 1},
        headers=auth("vendor", "VND-001"),
    )
    assert created.status_code == 200
    outsider = auth("school", "SCH-OTHER", school_id=school.id + 1)
    response = client.post(
        f"/batches/{created.json()['id']}/receive",
        json={"received_qty": 1},
        headers=outsider,
    )
    assert response.status_code == 403


def test_vendor_batch_qr_and_tracking_are_signed_and_scoped(setup_client):
    client, _, school, _ = setup_client
    vendor_headers = auth("vendor", "VND-001")
    created = client.post(
        "/vendor/batches",
        json={"school_id": school.id, "qty": 2},
        headers=vendor_headers,
    )
    assert created.status_code == 200
    batch_id = created.json()["id"]

    qr = client.get(f"/vendor/batches/{batch_id}/qr", headers=vendor_headers)
    assert qr.status_code == 200
    assert len(qr.json()["items"]) == 2
    item = qr.json()["items"][0]
    assert item["payload"].startswith(item["serial_no"] + f"|{batch_id}|")

    dispatched = client.post(
        f"/batches/{batch_id}/dispatch",
        json={"lat": 22.56, "lng": 72.95},
        headers=vendor_headers,
    )
    assert dispatched.status_code == 200
    tracking = client.get(f"/vendor/batches/{batch_id}/track", headers=vendor_headers)
    assert tracking.status_code == 200
    assert tracking.json()["status"] == "dispatched"
    assert tracking.json()["gps_points"] == [{"lat": 22.56, "lng": 72.95, "at": tracking.json()["gps_points"][0]["at"]}]

    outsider = auth("vendor", "VND-OTHER")
    assert client.get(f"/vendor/batches/{batch_id}/qr", headers=outsider).status_code == 403


def test_district_school_list_and_state_ranking_are_role_scoped(setup_client):
    client, _, school, _ = setup_client
    deo_headers = auth("deo", "DEO-AND-001", district_id=1)
    response = client.get("/analytics/district/schools", headers=deo_headers)
    assert response.status_code == 200
    assert response.json()["items"][0]["school_id"] == school.id

    admin_response = client.get("/analytics/state/ranking", headers=auth("admin", "ADMIN-STATE-001"))
    assert admin_response.status_code == 200
    assert admin_response.json()["items"][0]["rank"] == 1
    assert client.get("/analytics/state/ranking", headers=deo_headers).status_code == 403


def test_school_report_types_use_scoped_records(setup_client):
    client, student, school, session = setup_client
    session.add(
        AcademicRecord(
            student_id=student.id,
            year=2026,
            grade=9,
            attendance_pct=68,
            marks_pct=74,
            record_month="2026-10",
        )
    )
    session.commit()
    response = client.get(
        "/analytics/school/reports?type=attendance-defaulters",
        headers=auth("school", "SCH-AND-001", school.id),
    )
    assert response.status_code == 200, response.text
    assert response.json()["total"] == 1
    assert response.json()["items"][0]["cts_id"] == student.cts_id


def test_grievance_list_and_detail_are_scoped_to_school(setup_client):
    client, student, school, session = setup_client
    other_school = School(
        udise_code="24150104503",
        name_en="Other School",
        taluka_id=school.taluka_id,
    )
    session.add(other_school)
    session.flush()
    other_student = Student(
        cts_id="GJ-AND-2026-999999",
        mobile="9876500000",
        name_en="Outside Student",
        school_id=other_school.id,
    )
    session.add(other_student)
    session.flush()
    own_grievance = Grievance(grv_code="GRV-00000001", student_id=student.id, description="Own case")
    other_grievance = Grievance(grv_code="GRV-00000002", student_id=other_student.id, description="Outside case")
    session.add_all([own_grievance, other_grievance])
    session.commit()

    school_headers = auth("school", "SCH-AND-001", school.id)
    response = client.get("/grievances", headers=school_headers)
    assert response.status_code == 200
    assert [item["grv_code"] for item in response.json()["items"]] == ["GRV-00000001"]
    assert client.get("/grievances/GRV-00000002", headers=school_headers).status_code == 403


def test_cycles_overview_scopes_batch_and_handover_roster_to_school(setup_client):
    client, student, school, session = setup_client
    other_school = School(
        udise_code="24150104503",
        name_en="Other School",
        taluka_id=school.taluka_id,
    )
    session.add(other_school)
    session.flush()
    outside_student = Student(
        cts_id="GJ-AND-2026-999999",
        mobile="9876500000",
        name_en="Outside Student",
        school_id=other_school.id,
        grade=9,
    )
    session.add(outside_student)
    session.commit()

    vendor_headers = auth("vendor", "VND-001")
    own_batch = client.post(
        "/vendor/batches",
        json={"school_id": school.id, "qty": 1},
        headers=vendor_headers,
    ).json()
    other_batch = client.post(
        "/vendor/batches",
        json={"school_id": other_school.id, "qty": 1},
        headers=vendor_headers,
    ).json()
    overview = client.get(
        "/cycles/overview", headers=auth("school", "SCH-AND-001", school.id)
    )
    assert overview.status_code == 200
    payload = overview.json()
    assert [batch["id"] for batch in payload["batches"]] == [own_batch["id"]]
    assert {cycle["serial_no"] for cycle in payload["receivable_cycles"]} == set(
        own_batch["serials"]
    )
    roster_ids = {entry["id"] for entry in payload["handover_students"]}
    assert student.id in roster_ids
    assert outside_student.id not in roster_ids
    assert other_batch["serials"][0] not in {
        cycle["serial_no"] for cycle in payload["receivable_cycles"]
    }


def test_received_quantity_mismatch_alerts_deo(setup_client):
    client, _, school, session = setup_client
    created = client.post(
        "/vendor/batches",
        json={"school_id": school.id, "qty": 2},
        headers=auth("vendor", "VND-001"),
    )
    batch_id = created.json()["id"]
    response = client.post(
        f"/batches/{batch_id}/receive",
        json={"received_qty": 1, "scanned_serials": [created.json()["serials"][0]]},
        headers=auth("school", "SCH-AND-001", school.id),
    )
    assert response.json()["mismatch"] is True
    notice = session.exec(
        select(Notification).where(Notification.recipient_id == "DEO-AND-001")
    ).first()
    assert notice.notif_type == "logistics"


def test_student_cannot_receive_a_second_cycle(setup_client):
    client, student, school, _ = setup_client
    school_headers = auth("school", "SCH-AND-001", school.id)
    vendor_headers = auth("vendor", "VND-001")
    created = client.post(
        "/vendor/batches", json={"school_id": school.id, "qty": 2}, headers=vendor_headers
    )
    batch_id, serials = created.json()["id"], created.json()["serials"]
    client.post(f"/batches/{batch_id}/dispatch", json={"lat": 22.5, "lng": 72.9}, headers=vendor_headers)
    client.post(
        f"/batches/{batch_id}/receive",
        json={"received_qty": 2, "scanned_serials": serials},
        headers=school_headers,
    )
    first = client.post(
        "/handover/initiate",
        json={"student_id": student.id, "cycle_serial": serials[0]},
        headers=school_headers,
    )
    completed = client.post(
        "/handover/confirm",
        json={"cycle_serial": serials[0], "otp": first.json()["demo_otp"]},
        headers=school_headers,
    )
    assert completed.status_code == 200
    second = client.post(
        "/handover/initiate",
        json={"student_id": student.id, "cycle_serial": serials[1]},
        headers=school_headers,
    )
    assert second.status_code == 409


def test_pending_handover_can_resume_for_students_seeded_cycle(setup_client):
    client, student, school, session = setup_client
    vendor = session.exec(select(User).where(User.role == "vendor")).one()
    batch = CycleBatch(
        batch_code="BATCH-SEEDED-PENDING",
        vendor_id=vendor.id,
        school_id=school.id,
        qty=1,
        received_qty=1,
        status="received",
    )
    session.add(batch)
    session.flush()
    serial = "SSB-SEEDED-PENDING-0001"
    cycle = Cycle(
        serial_no=serial,
        qr_payload=_signed_payload(serial, batch.id),
        batch_id=batch.id,
        status="received",
        student_id=student.id,
    )
    session.add(cycle)
    session.flush()
    session.add(
        Handover(
            cycle_id=cycle.id,
            student_id=student.id,
            otp_hash="expired-demo-hash",
            otp_expires=datetime.utcnow() + timedelta(minutes=5),
        )
    )
    session.commit()

    school_headers = auth("school", "SCH-AND-001", school.id)
    started = client.post(
        "/handover/initiate",
        json={"student_id": student.id, "cycle_serial": serial},
        headers=school_headers,
    )
    assert started.status_code == 200, started.text
    confirmed = client.post(
        "/handover/confirm",
        json={"cycle_serial": serial, "otp": started.json()["demo_otp"]},
        headers=school_headers,
    )
    assert confirmed.status_code == 200, confirmed.text
    assert confirmed.json()["status"] == "handed_over"


def test_handover_otp_expires_and_locks_after_five_attempts(setup_client):
    client, student, school, session = setup_client
    school_headers = auth("school", "SCH-AND-001", school.id)
    batch = client.post(
        "/vendor/batches", json={"school_id": school.id, "qty": 1}, headers=auth("vendor", "VND-001")
    ).json()
    serial = batch["serials"][0]
    client.post(f"/batches/{batch['id']}/dispatch", json={"lat": 22.5, "lng": 72.9}, headers=auth("vendor", "VND-001"))
    client.post(f"/batches/{batch['id']}/receive", json={"received_qty": 1, "scanned_serials": [serial]}, headers=school_headers)
    started = client.post(
        "/handover/initiate", json={"student_id": student.id, "cycle_serial": serial}, headers=school_headers
    ).json()
    handover = session.exec(select(Handover)).first()
    handover.otp_expires = datetime.utcnow() - timedelta(seconds=1)
    session.commit()
    expired = client.post(
        "/handover/confirm", json={"cycle_serial": serial, "otp": started["demo_otp"]}, headers=school_headers
    )
    assert expired.status_code == 400


def test_handover_rejects_tampered_qr_signature(setup_client):
    client, student, school, session = setup_client
    school_headers = auth("school", "SCH-AND-001", school.id)
    batch = client.post(
        "/vendor/batches", json={"school_id": school.id, "qty": 1}, headers=auth("vendor", "VND-001")
    ).json()
    serial = batch["serials"][0]
    client.post(f"/batches/{batch['id']}/dispatch", json={"lat": 22.5, "lng": 72.9}, headers=auth("vendor", "VND-001"))
    client.post(f"/batches/{batch['id']}/receive", json={"received_qty": 1, "scanned_serials": [serial]}, headers=school_headers)
    started = client.post(
        "/handover/initiate", json={"student_id": student.id, "cycle_serial": serial}, headers=school_headers
    ).json()
    cycle = session.exec(select(Cycle).where(Cycle.serial_no == serial)).first()
    cycle.qr_payload = "tampered"
    session.commit()
    rejected = client.post(
        "/handover/confirm", json={"cycle_serial": serial, "otp": started["demo_otp"]}, headers=school_headers
    )
    assert rejected.status_code == 400


def test_school_student_detail_rejects_another_school(setup_client):
    client, _, school, session = setup_client
    other_school = School(
        udise_code="24150104599",
        name_en="Another Anand School",
        taluka_id=school.taluka_id,
    )
    session.add(other_school)
    session.flush()
    other_student = Student(
        cts_id="GJ-AND-2026-099999",
        mobile="9876549999",
        name_en="Other Student",
        school_id=other_school.id,
        grade=8,
        guardian_consent=True,
    )
    session.add(other_student)
    session.commit()
    response = client.get(
        f"/school/students/{other_student.cts_id}",
        headers=auth("school", "SCH-AND-001", school.id),
    )
    assert response.status_code == 403
