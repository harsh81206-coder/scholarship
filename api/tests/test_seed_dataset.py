from __future__ import annotations

import json
import os
from pathlib import Path
import sqlite3
import subprocess
import sys
import time

from sqlmodel import Session, create_engine, select

from app.models.core import Cycle, Document, Handover, Student
from app.ml.dropout import score_student
from app.routers.logistics import _signed_payload
from app.security import sha256_chain
from app.services.eligibility import evaluate_all_schemes


ROOT = Path(__file__).resolve().parents[2]
API_ROOT = ROOT / "api"


def _count(connection: sqlite3.Connection, table: str) -> int:
    return int(connection.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0])


def test_rich_seed_is_deterministic_complete_and_fast(tmp_path: Path) -> None:
    db_path = tmp_path / "seed.db"
    database_url = f"sqlite:///{db_path}"
    env = os.environ.copy()
    env["DATABASE_URL"] = database_url
    env["DATA_DIR"] = str(tmp_path / "data")
    started = time.monotonic()
    result = subprocess.run(
        [sys.executable, "-m", "seed.seed", "--reset"],
        cwd=API_ROOT,
        env=env,
        capture_output=True,
        text=True,
        check=True,
        timeout=10,
    )
    elapsed = time.monotonic() - started
    assert elapsed < 5, f"seed reset took {elapsed:.2f}s"
    assert "student                 1500" in result.stdout
    assert "application             2200" in result.stdout
    assert "dbt_txn                  900" in result.stdout

    with sqlite3.connect(db_path) as connection:
        assert _count(connection, "district") == 1
        assert _count(connection, "taluka") == 8
        assert _count(connection, "school") == 40
        assert _count(connection, "student") == 1500
        assert _count(connection, "academic_record") == 9000
        assert _count(connection, "document") >= 6000
        assert _count(connection, "scheme") == 7
        assert _count(connection, "application") == 2200
        assert _count(connection, "application_event") > 2200
        assert _count(connection, "dbt_txn") == 900
        assert _count(connection, "cycle_batch") == 8
        assert _count(connection, "cycle") == 400
        assert _count(connection, "grievance") == 60
        assert _count(connection, "fraud_flag") == 18
        assert _count(connection, "audit_log") >= 300
        assert _count(connection, "time_series_point") >= 12 * 8 * 7

        stages = dict(connection.execute("SELECT stage, COUNT(*) FROM application GROUP BY stage"))
        assert stages == {
            "submitted": 176,
            "school_verification": 308,
            "correction_requested": 110,
            "taluka_approved": 220,
            "deo_approved": 264,
            "sanctioned": 176,
            "dbt_initiated": 132,
            "credited": 660,
            "rejected": 154,
        }
        assert dict(connection.execute("SELECT status, COUNT(*) FROM dbt_txn GROUP BY status")) == {
            "credited": 828,
            "failed": 27,
            "processing": 45,
        }
        riya_app = connection.execute(
            "SELECT status,stage,route,risk_level FROM application WHERE app_code='APP-2026-RIYA-NL'"
        ).fetchone()
        assert riya_app == ("applied", "submitted", "school", "high")

        school_pending = connection.execute(
            "SELECT COUNT(*) FROM application a JOIN student s ON s.id=a.student_id "
            "WHERE s.school_id=1 AND a.status='applied' AND a.route='school'"
        ).fetchone()[0]
        school_flagged = connection.execute(
            "SELECT COUNT(*) FROM application a JOIN student s ON s.id=a.student_id "
            "WHERE s.school_id=1 AND a.status='applied' AND a.route='school' AND a.risk_level='high'"
        ).fetchone()[0]
        assert school_pending >= 12
        assert school_flagged >= 3
        taluka_queue = connection.execute(
            "SELECT COUNT(*) FROM application a JOIN student s ON s.id=a.student_id "
            "JOIN school sc ON sc.id=s.school_id WHERE sc.taluka_id=3 AND a.status='applied' AND a.route='taluka'"
        ).fetchone()[0]
        assert taluka_queue >= 20
        deo_ready = connection.execute(
            "SELECT COUNT(*) FROM application WHERE route='deo' AND status='taluka_approved'"
        ).fetchone()[0]
        assert deo_ready >= 15
        deo_high_risk = connection.execute(
            "SELECT COUNT(*) FROM application WHERE route='deo' AND status='taluka_approved' AND risk_level='high'"
        ).fetchone()[0]
        assert deo_high_risk >= 15
        school_grievances = connection.execute(
            "SELECT COUNT(*) FROM grievance g JOIN student s ON s.id=g.student_id WHERE s.school_id=1"
        ).fetchone()[0]
        assert school_grievances >= 5

        vendor_one = set(
            row[0]
            for row in connection.execute(
                "SELECT cb.status FROM cycle_batch cb JOIN user u ON u.id=cb.vendor_id "
                "WHERE u.officer_id='VND-001'"
            )
        )
        assert {"ordered", "dispatched", "received"}.issubset(vendor_one)
        first_cycle = connection.execute(
            "SELECT serial_no,batch_id,qr_payload FROM cycle ORDER BY id LIMIT 1"
        ).fetchone()
        assert first_cycle[2] == _signed_payload(first_cycle[0], first_cycle[1])

        audit_rows = connection.execute(
            "SELECT actor_id,role,action,entity,entity_id,after_json,prev_hash,hash "
            "FROM audit_log ORDER BY id"
        ).fetchall()
        expected_previous = "genesis"
        for actor, role, action, entity, entity_id, after_json, previous, digest in audit_rows:
            assert previous == expected_previous
            payload = f"{actor}:{role}:{action}:{entity}:{entity_id}:{after_json or ''}"
            assert sha256_chain(previous, payload) == digest
            expected_previous = digest

        event_rows = connection.execute(
            "SELECT application_id,payload_json,prev_hash,hash FROM application_event ORDER BY application_id,id"
        ).fetchall()
        expected_by_app: dict[int, str] = {}
        for app_id, payload_json, previous, digest in event_rows:
            expected_previous = expected_by_app.get(app_id, "genesis")
            assert previous == expected_previous
            assert sha256_chain(previous, payload_json) == digest
            expected_by_app[app_id] = digest

    # Exercise the eligibility evaluator against the seeded, isolated database.
    test_engine = create_engine(database_url)
    with Session(test_engine) as session:
        riya = session.exec(
            select(Student).where(Student.cts_id == "GJ-AND-2026-004512")
        ).one()
        assert riya.mobile == "9876543210"
        statuses = [item["status"] for item in evaluate_all_schemes(riya.id, session)]
        assert statuses.count("eligible") == 4
        riya_docs = session.exec(select(Document).where(Document.student_id == riya.id)).all()
        assert sum(doc.status == "pending" for doc in riya_docs) == 1
        assert all((tmp_path / "data" / doc.file_path).is_file() for doc in riya_docs)
        assert session.exec(select(Handover).where(Handover.student_id == riya.id)).first()
        handed_student = session.exec(select(Student).where(Student.cts_id == "GJ-AND-2026-004518")).one()
        delivered = session.exec(select(Cycle).where(Cycle.student_id == handed_student.id)).one()
        assert delivered.status == "handed_over"
        delivered_handover = session.exec(
            select(Handover).where(Handover.student_id == handed_student.id)
        ).one()
        assert (tmp_path / "data" / delivered_handover.photo_path).is_file()
        at_risk = session.exec(select(Student).where(Student.cts_id == "GJ-AND-2026-004519")).one()
        dropout = score_student(at_risk.id, session)
        assert dropout["risk_level"] == "high"
        assert len(dropout["top_reasons"]) == 3
        attendance = session.connection().exec_driver_sql(
            "SELECT attendance_pct FROM academic_record WHERE student_id=? ORDER BY record_month",
            (at_risk.id,),
        ).fetchall()
        assert len(attendance) == 6
        assert attendance[-1][0] < attendance[0][0]
        failed_student = session.exec(
            select(Student).where(Student.cts_id == "GJ-AND-2026-004517")
        ).one()
        failed_txns = session.connection().exec_driver_sql(
            "SELECT t.status,t.failure_reason FROM dbt_txn t JOIN application a ON a.id=t.application_id "
            "WHERE a.student_id=? AND t.status='failed'",
            (failed_student.id,),
        ).fetchall()
        assert ("failed", "name_mismatch") in failed_txns

    sample_docs = ROOT / "demo_docs"
    assert len(list(sample_docs.glob("*.pdf"))) == 6
    assert len(list(sample_docs.glob("*.png"))) == 6
    samples = json.loads((sample_docs / "samples.json").read_text())
    assert samples["income_riya"] != samples["income_meera"]
    assert "INR 96,000" in " ".join(samples["income_riya"])
    assert "INR 132,500" in " ".join(samples["income_meera"])
    for pdf in sample_docs.glob("*.pdf"):
        assert pdf.stat().st_size > 100
