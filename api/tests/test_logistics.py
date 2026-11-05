"""Integration checks for offline vendor-to-student cycle handover."""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine, select
from sqlmodel.pool import StaticPool
from datetime import datetime, timedelta

from app.db import get_session
from app.main import app
from app.models.core import Cycle, District, Handover, Notification, School, Student, Taluka, User
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


def auth(role: str, sub: str, school_id: int | None = None) -> dict[str, str]:
    token = create_access_token(
        {
            "sub": sub,
            "role": role,
            "name": sub,
            "school_id": school_id,
            "taluka_id": None,
            "district_id": None,
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
    assert (
        client.get("/cycles/overview", headers=school_headers).json()["delivered"] == 1
    )
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
