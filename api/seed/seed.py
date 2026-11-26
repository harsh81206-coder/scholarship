"""Build the deterministic, offline Vidya Pragati Setu demo dataset.

Run from ``api/`` with ``python -m seed.seed --reset``. ``DATABASE_URL`` may
point to a temporary SQLite file for verification.
"""

from __future__ import annotations

import hashlib
import hmac
from importlib.util import module_from_spec, spec_from_file_location
import json
import random
import shutil
import sys
from datetime import datetime, timedelta
from pathlib import Path

from sqlmodel import Session, SQLModel, select

from app.config import get_settings
from app.db import engine
from app.models.core import (
    AcademicRecord,
    Application,
    ApplicationEvent,
    AuditLog,
    BankAccount,
    Cycle,
    CycleBatch,
    District,
    Document,
    DbtTxn,
    Family,
    FraudFlag,
    Grievance,
    GrievanceMessage,
    Handover,
    Notification,
    Scheme,
    School,
    Setting,
    Student,
    Taluka,
    TimeSeriesPoint,
    User,
)
from app.security import hash_password, sha256_chain

_sample_path = Path(__file__).resolve().parents[2] / "scripts" / "make_sample_docs.py"
_sample_module_spec = spec_from_file_location("vps_sample_docs", _sample_path)
if _sample_module_spec is None or _sample_module_spec.loader is None:
    raise RuntimeError(f"Cannot load demo document generator at {_sample_path}")
_sample_module = module_from_spec(_sample_module_spec)
_sample_module_spec.loader.exec_module(_sample_module)
generate_sample_docs = _sample_module.generate
make_handover_proof = _sample_module.make_handover_proof


SEED = 42
NOW = datetime(2026, 11, 26, 12, 0, 0)
DISTRICT_NAME = "Anand"
TALUKAS = [
    ("Anand", "આણંદ", 22.5645, 72.9289),
    ("Anklav", "આંકલાવ", 22.3860, 72.9990),
    ("Borsad", "બોરસદ", 22.4170, 72.8990),
    ("Khambhat", "ખંભાત", 22.3177, 72.6190),
    ("Petlad", "પેટલાદ", 22.4760, 72.8000),
    ("Sojitra", "સોજિત્રા", 22.5520, 72.7150),
    ("Tarapur", "તારાપુર", 22.4860, 72.6580),
    ("Umreth", "ઉમરેઠ", 22.6980, 73.1150),
]
FIRST_F = ["Riya", "Priya", "Anita", "Kavya", "Pooja", "Minal", "Hetal", "Kinjal", "Foram", "Nidhi", "Disha", "Bhoomi", "Riddhi", "Khushi", "Jagruti", "Dhara", "Payal", "Rupal", "Shital", "Meera"]
FIRST_M = ["Rahul", "Harsh", "Kishan", "Bhavik", "Darshan", "Krunal", "Meet", "Vipul", "Vishal", "Nirav", "Hardik", "Yash", "Dhruv", "Jay", "Kiran", "Manan", "Neel", "Om", "Parth", "Raj"]
FIRST_GU = {
    "Riya": "રિયા", "Priya": "પ્રિયા", "Anita": "અનિતા", "Kavya": "કાવ્યા", "Pooja": "પૂજા",
    "Minal": "મીનલ", "Hetal": "હેતલ", "Kinjal": "કિંજલ", "Foram": "ફોરમ", "Nidhi": "નિધિ",
    "Disha": "દિશા", "Bhoomi": "ભૂમિ", "Riddhi": "ઋદ્ધિ", "Khushi": "ખુશી", "Jagruti": "જાગૃતિ",
    "Dhara": "ધારા", "Payal": "પાયલ", "Rupal": "રૂપલ", "Shital": "શીતલ", "Meera": "મીરા",
    "Rahul": "રાહુલ", "Harsh": "હર્ષ", "Kishan": "કિશન", "Bhavik": "ભાવિક", "Darshan": "દર્શન",
    "Krunal": "કૃણાલ", "Meet": "મીત", "Vipul": "વિપુલ", "Vishal": "વિશાલ", "Nirav": "નિરવ",
    "Hardik": "હાર્દિક", "Yash": "યશ", "Dhruv": "ધ્રુવ", "Jay": "જય", "Kiran": "કિરણ",
    "Manan": "મનન", "Neel": "નીલ", "Om": "ઓમ", "Parth": "પાર્થ", "Raj": "રાજ",
}
SURNAMES = ["Patel", "Shah", "Desai", "Joshi", "Parmar", "Makwana", "Chauhan", "Bhatt", "Mehta", "Raval", "Soni", "Thakkar", "Modi", "Pandya", "Trivedi", "Nayak", "Rathod", "Vasava", "Solanki", "Prajapati"]
SURNAME_GU = {
    "Patel": "પટેલ", "Shah": "શાહ", "Desai": "દેસાઈ", "Joshi": "જોશી", "Parmar": "પરમાર",
    "Makwana": "મકવાણા", "Chauhan": "ચૌહાણ", "Bhatt": "ભટ્ટ", "Mehta": "મહેતા", "Raval": "રાવળ",
    "Soni": "સોની", "Thakkar": "ઠાકર", "Modi": "મોદી", "Pandya": "પંડ્યા", "Trivedi": "ત્રિવેદી",
    "Nayak": "નાયક", "Rathod": "રાઠોડ", "Vasava": "વસાવા", "Solanki": "સોલંકી", "Prajapati": "પ્રજાપતિ",
}
CASTES = ["obc"] * 36 + ["sebc"] * 16 + ["sc"] * 14 + ["st"] * 8 + ["general"] * 26
SCHOOL_NAMES = [
    ("Shree Sardar Patel High School", "શ્રી સરદાર પટેલ હાઈસ્કૂલ"),
    ("Vinay Mandir High School", "વિનય મંદિર હાઈસ્કૂલ"),
    ("New Era High School", "ન્યૂ એરા હાઈસ્કૂલ"),
    ("Sarvajanik Kanya Vidyalaya", "સાર્વજનિક કન્યા વિદ્યાલય"),
    ("Vallabh Model Secondary School", "વલ્લભ મોડેલ માધ્યમિક શાળા"),
]
SCHOOL_PRINCIPALS = ["Dr. Kalpesh Shah", "Smt. Ila Desai", "Mr. Bhavesh Joshi", "Dr. Meera Shah", "Mrs. Hansa Patel"]
REJECT_REASONS = ["name_mismatch", "income_above_limit", "attendance_short", "duplicate"]
DOC_TYPES = ["income", "marksheet", "aadhaar", "caste", "bank"]
STAGES = [
    ("submitted", "applied", 176),
    ("school_verification", "applied", 308),
    ("correction_requested", "correction_requested", 110),
    ("taluka_approved", "taluka_approved", 220),
    ("deo_approved", "deo_approved", 264),
    ("sanctioned", "sanctioned", 176),
    ("dbt_initiated", "dbt_initiated", 132),
    ("credited", "credited", 660),
    ("rejected", "rejected", 154),
]
DEMO_CAST = [
    {"cts_id": "GJ-AND-2026-004512", "name_en": "Riya Hasmukhbhai Patel", "name_gu": "રિયા હસમુખભાઈ પટેલ", "gender": "female", "grade": 9, "caste": "obc", "income": 96000, "attendance": 88.0, "marks": 79.0, "distance": 1.5, "school": 1},
    {"cts_id": "GJ-AND-2026-004513", "name_en": "Meera Ramesh Parmar", "name_gu": "મીરા રમેશ પરમાર", "gender": "female", "grade": 10, "caste": "sebc", "income": 132500, "attendance": 86.0, "marks": 74.0, "distance": 4.2, "school": 1},
    {"cts_id": "GJ-AND-2026-004514", "name_en": "Anita Mahesh Shah", "name_gu": "અનિતા મહેશ શાહ", "gender": "female", "grade": 9, "caste": "obc", "income": 104000, "attendance": 83.0, "marks": 68.0, "distance": 5.3, "school": 1},
    {"cts_id": "GJ-AND-2026-004515", "name_en": "Kavya Pravin Desai", "name_gu": "કાવ્યા પ્રવીણ દેસાઈ", "gender": "female", "grade": 9, "caste": "general", "income": 180000, "attendance": 72.0, "marks": 61.0, "distance": 3.4, "school": 1},
    {"cts_id": "GJ-AND-2026-004516", "name_en": "Rahul Suresh Patel", "name_gu": "રાહુલ સુરેશ પટેલ", "gender": "male", "grade": 11, "caste": "obc", "income": 125000, "attendance": 91.0, "marks": 82.0, "distance": 2.7, "school": 2},
    {"cts_id": "GJ-AND-2026-004517", "name_en": "Priya Mahendra Joshi", "name_gu": "પ્રિયા મહેન્દ્ર જોશી", "gender": "female", "grade": 10, "caste": "obc", "income": 99000, "attendance": 87.0, "marks": 73.0, "distance": 6.1, "school": 3},
    {"cts_id": "GJ-AND-2026-004518", "name_en": "Pooja Bharat Nayak", "name_gu": "પૂજા ભરત નાયક", "gender": "female", "grade": 9, "caste": "st", "income": 89000, "attendance": 93.0, "marks": 77.0, "distance": 7.8, "school": 4},
    {"cts_id": "GJ-AND-2026-004519", "name_en": "Dhruv Arvind Solanki", "name_gu": "ધ્રુવ અરવિંદ સોલંકી", "gender": "male", "grade": 10, "caste": "sc", "income": 146000, "attendance": 58.0, "marks": 55.0, "distance": 18.5, "school": 40},
]


def _hash(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def _bulk(session: Session, model: type, rows: list[dict]) -> None:
    if rows:
        session.bulk_insert_mappings(model, rows)


def _scheme_specs() -> list[dict]:
    definitions = [
        ("namo-lakshmi", "Namo Lakshmi Yojana", "નમો લક્ષ્મી યોજના", "cash", {"all": [{"field": "gender", "op": "==", "value": "female"}, {"field": "grade", "op": ">=", "value": 9}, {"field": "annual_income", "op": "<=", "value": 250000}]}, ["aadhaar", "income"], {"amount": 10000, "installments": 2}, 500000000, []),
        ("namo-saraswati", "Namo Saraswati Science Scholarship", "નમો સરસ્વતી વિજ્ઞાન શિષ્યવૃત્તિ", "cash", {"all": [{"field": "gender", "op": "==", "value": "female"}, {"field": "stream", "op": "==", "value": "science"}, {"field": "grade", "op": ">=", "value": 11}]}, ["aadhaar", "marksheet"], {"amount": 25000}, 100000000, []),
        ("gyan-sadhna", "Gyan Sadhna Scholarship", "જ્ઞાન સાધના શિષ્યવૃત્તિ", "cash", {"all": [{"field": "marks_pct", "op": ">=", "value": 60}]}, ["marksheet"], {"amount": 12500}, 200000000, []),
        ("gyan-setu", "Gyan Setu Scholarship", "જ્ઞાન સેતુ શિષ્યવૃત્તિ", "cash", {"all": [{"field": "annual_income", "op": "<=", "value": 250000}]}, ["income"], {"amount": 12000}, 300000000, ["nmms"]),
        ("nmms", "NMMS Scholarship", "NMMS શિષ્યવૃત્તિ", "cash", {"all": [{"field": "marks_pct", "op": ">=", "value": 55}, {"field": "annual_income", "op": "<=", "value": 150000}]}, ["marksheet", "income"], {"amount": 12000}, 150000000, ["gyan-setu"]),
        ("sebc-obc", "Post-Matric SEBC/OBC Scholarship", "પોસ્ટ મેટ્રિક SEBC/OBC શિષ્યવૃત્તિ", "cash", {"all": [{"field": "caste_category", "op": "in", "value": ["obc", "sebc"]}, {"field": "annual_income", "op": "<=", "value": 250000}]}, ["caste", "income"], {"amount": 15000}, 250000000, []),
        ("saraswati-sadhna", "Saraswati Sadhna Bicycle Scheme", "સરસ્વતી સાધના સાયકલ યોજના", "material", {"all": [{"field": "gender", "op": "==", "value": "female"}, {"field": "grade", "op": "==", "value": 9}]}, ["aadhaar"], {"amount": 0, "material": "bicycle"}, 50000000, []),
    ]
    return [
        {"id": idx, "code": code, "name_en": en, "name_gu": gu, "name_hi": en,
         "scheme_type": kind, "rules_json": json.dumps(rules),
         "required_docs_json": json.dumps(docs), "payout_json": json.dumps(payout),
         "budget": budget, "mutually_exclusive_with_json": json.dumps(excludes),
         "version": 1, "active": True, "valid_from": "2026-04-01", "valid_to": "2027-03-31",
         "description_en": en, "description_gu": gu}
        for idx, (code, en, gu, kind, rules, docs, payout, budget, excludes) in enumerate(definitions, start=1)
    ]


def _event_history(stage: str) -> list[str]:
    return {
        "submitted": ["submitted"],
        "school_verification": ["submitted", "school_verification"],
        "correction_requested": ["submitted", "school_verification", "correction_requested"],
        "taluka_approved": ["submitted", "school_verification", "taluka_approved"],
        "deo_approved": ["submitted", "school_verification", "deo_approved"],
        "sanctioned": ["submitted", "school_verification", "taluka_approved", "deo_approved", "sanctioned"],
        "dbt_initiated": ["submitted", "school_verification", "taluka_approved", "deo_approved", "sanctioned", "dbt_initiated"],
        "credited": ["submitted", "school_verification", "taluka_approved", "deo_approved", "sanctioned", "dbt_initiated", "credited"],
        "rejected": ["submitted", "school_verification", "rejected"],
    }[stage]


def _student_profile(rng: random.Random, idx: int, school_id: int) -> dict:
    female = rng.random() < 0.54
    first = rng.choice(FIRST_F if female else FIRST_M)
    surname = rng.choice(SURNAMES)
    middle = rng.choice(["Hasmukhbhai", "Ramesh", "Mahesh", "Pravin", "Bharat", "Kirit", "Arvind", "Suresh"])
    name_en = f"{first} {middle} {surname}"
    name_gu = f"{FIRST_GU[first]} {SURNAME_GU[surname]}"
    grade = rng.randint(8, 12)
    income = rng.randint(50000, 420000)
    return {"id": idx, "cts_id": f"GJ-AND-2026-{idx + 1000:06d}", "mobile": f"97{idx % 100:02d}{idx:06d}",
            "name_en": name_en, "name_gu": name_gu, "dob": f"{2008 if grade > 10 else 2010}-{rng.randint(1, 12):02d}-{rng.randint(1, 28):02d}",
            "gender": "female" if female else "male", "caste_category": rng.choice(CASTES), "school_id": school_id,
            "grade": grade, "stream": rng.choice(["general", "science", "commerce", "arts"]) if grade >= 11 else "general",
            "guardian_name": f"Guardian {surname}", "guardian_mobile": f"96{idx % 100:02d}{idx:06d}",
            "guardian_consent": True, "distance_km": round(rng.uniform(0.4, 21.0), 1), "risk_score": 0.0,
            "risk_level": "low", "password_hash": "", "created_at": NOW - timedelta(days=rng.randint(1, 900)),
            "income": income}


def _generate_students(rng: random.Random, schools: list[dict], password_hash: str) -> tuple[list[dict], list[dict], list[dict], list[dict]]:
    profiles: list[dict] = []
    for cast in DEMO_CAST:
        profile = {"id": len(profiles) + 1, "mobile": str(9876543210 + len(profiles)), "dob": "2009-08-15",
                   "school_id": cast["school"], "stream": "general", "guardian_name": f"Guardian of {cast['name_en'].split()[0]}",
                   "guardian_mobile": f"98990000{len(profiles):02d}", "guardian_consent": True, "risk_score": 0.18,
                   "risk_level": "low", "password_hash": password_hash, "created_at": NOW - timedelta(days=300),
                   "cts_id": cast["cts_id"], "name_en": cast["name_en"], "name_gu": cast["name_gu"],
                   "gender": cast["gender"], "grade": cast["grade"], "caste_category": cast["caste"],
                   "income": cast["income"], "distance_km": cast["distance"], "_base_attendance": cast["attendance"],
                   "_base_marks": cast["marks"]}
        profiles.append(profile)
    for idx in range(9, 1501):
        school_id = ((idx - 9) % len(schools)) + 1
        profile = _student_profile(rng, idx, school_id)
        profile["password_hash"] = password_hash
        profile["_base_attendance"] = round(rng.uniform(58, 98), 1)
        profile["_base_marks"] = round(rng.uniform(42, 96), 1)
        profiles.append(profile)

    students: list[dict] = []
    families: list[dict] = []
    banks: list[dict] = []
    records: list[dict] = []
    shared_bank_hash = _hash("DEMO_SHARED_BANK_CLUSTER_FAKE")
    for p in profiles:
        idx = p["id"]
        base_att = p["_base_attendance"]
        base_marks = p["_base_marks"]
        is_dropout = idx == 8
        risk_level = "high" if is_dropout or base_att < 67 else "medium" if base_att < 78 or p["distance_km"] > 14 else "low"
        risk_score = 0.82 if is_dropout else 0.68 if risk_level == "high" else 0.44 if risk_level == "medium" else 0.14
        students.append({k: v for k, v in p.items() if not k.startswith("_") and k != "income"} | {"risk_score": risk_score, "risk_level": risk_level})
        families.append({"id": idx, "student_id": idx, "annual_income": p["income"], "income_cert_id": f"REV/AND/2026/{idx:06d}"})
        mother = p["gender"] == "female" or rng.random() < 0.18
        holder_type = "mother" if mother else "student"
        holder_name = p["guardian_name"] if mother else p["name_en"]
        shared = 9 <= idx <= 11 or 100 <= idx <= 103
        banks.append({"id": idx, "student_id": idx, "holder_type": holder_type, "holder_name": holder_name,
                      "account_hash": shared_bank_hash if shared else _hash(f"FAKE_ACCOUNT_{idx}"),
                      "last4": "0000" if shared else f"{idx % 10000:04d}", "ifsc": "SBIN0001234" if idx % 2 else "HDFC0001234",
                      "bank_name": "State Bank of India" if idx % 2 else "HDFC Bank", "aadhaar_seeded": True,
                      "verified": True})
        for month_index in range(6):
            month = (NOW.replace(day=1) - timedelta(days=30 * (5 - month_index))).strftime("%Y-%m")
            if is_dropout:
                attendance = max(50.0, 84.0 - month_index * 5.2)
                marks = max(45.0, 72.0 - month_index * 3.0)
            else:
                drift = (month_index - 2.5) * (0.8 if base_att >= 75 else -1.4)
                attendance = min(99.0, max(45.0, base_att + drift + rng.uniform(-1.2, 1.2)))
                marks = min(99.0, max(35.0, base_marks + (month_index - 2.5) * rng.uniform(-0.7, 0.9)))
            records.append({"id": len(records) + 1, "student_id": idx, "year": int(month[:4]),
                            "grade": p["grade"], "attendance_pct": round(attendance, 1),
                            "marks_pct": round(marks, 1), "record_month": month,
                            "result_json": json.dumps({"source": "demo_seed", "trend_index": month_index})})
    return students, families, banks, records


def _document_rows(students: list[dict], upload_dir: Path, rng: random.Random) -> list[dict]:
    rows: list[dict] = []
    types = ["income", "marksheet", "aadhaar", "caste"]
    files = {"income": "income_riya.pdf", "marksheet": "marksheet_class8.pdf", "aadhaar": "aadhaar_masked.pdf", "caste": "caste_obc.pdf", "bank": "bank_mother.pdf"}
    for student in students:
        sid = student["id"]
        doc_types = types[:]
        if sid == 1 or sid % 3 == 0:
            doc_types.append("bank")
        for doc_type in doc_types:
            if sid == 1 and doc_type == "aadhaar":
                status = "pending"
            elif sid == 1:
                status = "verified"
            else:
                status = rng.choices(["verified", "pending", "expired"], weights=[72, 20, 8])[0]
            number = {"income": f"REV/AND/2026/{sid:06d}", "marksheet": f"GSEB/2026/MS-{sid:06d}",
                      "aadhaar": f"XXXX-XXXX-{(sid * 37) % 10000:04d}", "caste": f"CST/GUJ/2024/{sid:05d}",
                      "bank": f"ACCT-XXXX-{sid:04d}"}[doc_type]
            rows.append({"id": len(rows) + 1, "student_id": sid, "doc_type": doc_type,
                         "file_path": f"uploads/demo_docs/{files[doc_type]}", "status": status,
                         "extracted_json": json.dumps({"document_number": number}),
                         "authenticity_json": json.dumps({"qr": "present", "name_match": "pass", "expiry": "valid" if status != "expired" else "expired"}),
                         "confidence": round(rng.uniform(0.76, 0.99), 2),
                         "expiry": "2028-03-31" if status != "expired" else "2025-03-31",
                         "source": "seeded_sample", "doc_number": number,
                         "uploaded_at": NOW - timedelta(days=rng.randint(1, 250))})
    return rows


def _app_rows(students: list[dict], schemes: list[dict], rng: random.Random) -> tuple[list[dict], list[dict], dict[str, list[int]]]:
    scheme_by_code = {s["code"]: s for s in schemes}
    stage_entries: list[str] = []
    for stage, _, count in STAGES:
        stage_entries.extend([stage] * count)
    fixed = {
        "school_verification": [(2, "gyan-setu", "APP-2026-STU2-SCHOOL", "medium", 0.46)],
        "correction_requested": [(3, "sebc-obc", "APP-2026-STU3-CORRECTION", "medium", 0.52), (6, "namo-lakshmi", "APP-2026-STU6-DBT-FAIL", "high", 0.78)],
        "rejected": [(4, "namo-lakshmi", "APP-2026-STU4-REJECTED", "high", 0.86)],
        "credited": [(5, "gyan-sadhna", "APP-2026-STU5-CREDITED", "low", 0.16), (7, "saraswati-sadhna", "APP-2026-STU7-CYCLE", "low", 0.12)],
        "submitted": [(1, "namo-lakshmi", "APP-2026-RIYA-NL", "high", 0.82), (8, "gyan-sadhna", "APP-2026-STU8-AT-RISK", "high", 0.81)],
    }
    fixed_used: set[int] = set()
    assigned: dict[str, list[tuple[int, str, str, str, float]]] = {}
    for stage, records in fixed.items():
        assigned[stage] = records
        fixed_used.update(item[0] for item in records)
    by_school: dict[int, list[int]] = {}
    for student in students:
        by_school.setdefault(student["school_id"], []).append(student["id"])
    # A page-sized, high quality Anand school queue and a medium-risk Borsad queue.
    school_one_pool = [sid for sid in by_school[1] if sid not in fixed_used]
    assigned.setdefault("school_verification", []).extend(
        (sid, "namo-lakshmi" if idx % 2 == 0 else "gyan-sadhna", f"APP-SEED-SCH1-{idx:03d}", "high" if idx % 9 == 0 else "low", 0.74 if idx % 9 == 0 else 0.18)
        for idx, sid in enumerate(school_one_pool[:28], start=1)
    )
    borsad_students = [s["id"] for s in students if 11 <= s["school_id"] <= 15 and s["id"] not in fixed_used]
    assigned.setdefault("submitted", []).extend(
        (sid, "gyan-setu", f"APP-SEED-TPEO-{idx:03d}", "medium", 0.45)
        for idx, sid in enumerate(borsad_students[:30], start=1)
    )
    used_pairs: set[tuple[int, str]] = set()
    for stage, entries in assigned.items():
        for student_id, scheme_code, _, _, _ in entries:
            used_pairs.add((student_id, scheme_code))
    student_by_id = {s["id"]: s for s in students}
    random_students = [candidate for candidate in students if candidate["id"] > 8]
    apps: list[dict] = []
    event_rows: list[dict] = []
    app_indices_by_stage: dict[str, list[int]] = {stage: [] for stage, _, _ in STAGES}
    app_counter = 0
    for target_stage in stage_entries:
        if assigned.get(target_stage):
            student_id, scheme_code, custom_code, risk_level, risk_score = assigned[target_stage].pop(0)
            app_code = custom_code
        else:
            while True:
                student = rng.choice(random_students)
                scheme_code = rng.choice(list(scheme_by_code))
                if (student["id"], scheme_code) not in used_pairs:
                    break
            student_id = student["id"]
            risk_score = round(rng.choice([rng.uniform(0.04, 0.28), rng.uniform(0.31, 0.58), rng.uniform(0.62, 0.95)]), 3)
            risk_level = "low" if risk_score < 0.3 else "medium" if risk_score < 0.6 else "high"
            app_code = f"APP-2026-{app_counter + 1:06d}"
        used_pairs.add((student_id, scheme_code))
        app_counter += 1
        status = next(s for stage, s, _ in STAGES if stage == target_stage)
        student = student_by_id[student_id]
        if target_stage == "school_verification":
            route = "school"
        elif target_stage == "submitted":
            route = "taluka" if 11 <= student["school_id"] <= 15 else ("deo" if risk_level == "high" else "school")
        elif target_stage in ("correction_requested", "rejected"):
            route = "school" if student["school_id"] <= 5 else ("deo" if risk_level == "high" else "taluka")
        else:
            route = "deo"
        scheme = scheme_by_code[scheme_code]
        benefit = json.loads(scheme["payout_json"]).get("amount", 0)
        if app_code == "APP-2026-RIYA-NL":
            benefit, route, risk_score, risk_level = 10000, "school", 0.82, "high"
        submitted_at = NOW - timedelta(days=rng.randint(0, 84), hours=rng.randint(0, 23))
        app_id = app_counter
        apps.append({"id": app_id, "app_code": app_code, "student_id": student_id, "scheme_id": scheme["id"],
                     "academic_year": "2026-27", "status": status, "stage": target_stage, "risk_score": risk_score,
                     "risk_level": risk_level, "route": route, "amount": benefit,
                     "consent_at": submitted_at, "assigned_to": None, "submitted_at": submitted_at,
                     "updated_at": submitted_at + timedelta(days=rng.randint(0, 5))})
        app_indices_by_stage[target_stage].append(app_id)
        history = _event_history(target_stage)
        prev_hash = "genesis"
        start_at = submitted_at
        elapsed_hours = 0
        for event_idx, event_stage in enumerate(history):
            payload = json.dumps({"stage": event_stage, "seeded_stage": target_stage}, sort_keys=True)
            event_hash = sha256_chain(prev_hash, payload)
            if event_idx:
                elapsed_hours += rng.randint(2, 18)
            event_rows.append({"id": len(event_rows) + 1, "application_id": app_id, "stage": event_stage,
                               "actor_id": "SYSTEM-SEED", "actor_role": "system", "note": "Deterministic demo history",
                               "payload_json": payload, "prev_hash": prev_hash, "hash": event_hash,
                               "created_at": start_at + timedelta(hours=elapsed_hours)})
            prev_hash = event_hash
    return apps, event_rows, app_indices_by_stage


def _dbt_rows(apps: list[dict], app_indices: dict[str, list[int]], cast: list[dict], rng: random.Random) -> list[dict]:
    app_by_id = {a["id"]: a for a in apps}
    credited_ids = app_indices["credited"]
    processing_ids = app_indices["dbt_initiated"]
    correction_ids = app_indices["correction_requested"]
    txn_rows: list[dict] = []
    for index in range(828):
        app = app_by_id[credited_ids[index % len(credited_ids)]]
        txn_rows.append({"id": len(txn_rows) + 1, "application_id": app["id"], "amount": app["amount"] // 2 if index >= len(credited_ids) else app["amount"],
                         "status": "credited", "utr": f"SBIN{2600000000 + index:010d}", "failure_reason": None,
                         "batch_ref": f"PFMS-2026-W{index % 12 + 1:02d}", "idempotency_key": f"seed:{app['app_code']}:credit:{index // len(credited_ids) + 1}",
                         "initiated_at": app["submitted_at"] + timedelta(days=20), "credited_at": app["submitted_at"] + timedelta(days=22)})
    for index in range(45):
        app = app_by_id[processing_ids[index % len(processing_ids)]]
        txn_rows.append({"id": len(txn_rows) + 1, "application_id": app["id"], "amount": app["amount"], "status": "processing",
                         "utr": None, "failure_reason": None, "batch_ref": f"PFMS-PENDING-{index // 15 + 1}",
                         "idempotency_key": f"seed:{app['app_code']}:processing", "initiated_at": NOW - timedelta(hours=index + 1), "credited_at": None})
    failure_reasons = ["name_mismatch", "account_closed", "npci_not_seeded"]
    cast_failed_app = next(a for a in apps if a["app_code"] == "APP-2026-STU6-DBT-FAIL")
    for index in range(27):
        app = cast_failed_app if index == 0 else app_by_id[correction_ids[(index - 1) % len(correction_ids)]]
        txn_rows.append({"id": len(txn_rows) + 1, "application_id": app["id"], "amount": app["amount"], "status": "failed",
                         "utr": None, "failure_reason": failure_reasons[index % len(failure_reasons)], "batch_ref": f"PFMS-FAILED-{index // 9 + 1}",
                         "idempotency_key": f"seed:{app['app_code']}:failed:{index}", "initiated_at": NOW - timedelta(days=index % 18), "credited_at": None})
    return txn_rows


def _logistics_rows(students: list[dict], vendors: list[dict], schools: list[dict], rng: random.Random) -> tuple[list[dict], list[dict], list[dict]]:
    batches: list[dict] = []
    cycles: list[dict] = []
    handovers: list[dict] = []
    school_ids = [1, 2, 3, 4, 5, 11, 16, 36]
    sizes = [50] * 8
    statuses = ["ordered", "dispatched", "received", "received", "ordered", "dispatched", "partial", "ordered"]
    for batch_no in range(8):
        vendor_id = [5, 5, 5, 6, 6, 7, 7, 7][batch_no]
        school_id = school_ids[batch_no]
        batch_id = batch_no + 1
        school = schools[school_id - 1]
        delivered = statuses[batch_no] in ("received", "partial")
        path = [
            {"at": (NOW - timedelta(days=8)).isoformat(), "lat": round(school["latitude"] - 0.12, 5), "lng": round(school["longitude"] - 0.15, 5)},
            {"at": (NOW - timedelta(days=3)).isoformat(), "lat": round(school["latitude"] - 0.04, 5), "lng": round(school["longitude"] - 0.06, 5)},
        ] if statuses[batch_no] == "dispatched" else []
        batches.append({"id": batch_id, "batch_code": f"BATCH-2026-AN-{batch_id:03d}", "vendor_id": vendor_id,
                        "school_id": school_id, "qty": sizes[batch_no], "dispatched_at": NOW - timedelta(days=7) if statuses[batch_no] != "ordered" else None,
                        "received_at": NOW - timedelta(days=2) if delivered else None,
                        "received_qty": 45 if statuses[batch_no] == "partial" else 50 if delivered else 0,
                        "gps_json": json.dumps(path), "status": statuses[batch_no]})
        for offset in range(50):
            cycle_id = len(cycles) + 1
            if batch_no == 0:
                status = "in_stock"
            elif batch_no in (1, 5):
                status = "dispatched"
            elif batch_no in (2, 3, 6):
                status = "received"
            else:
                status = "in_stock"
            student_id = None
            if batch_no == 2 and offset == 20:
                status, student_id = "received", 1
            if batch_no == 2 and offset == 21:
                status, student_id = "handed_over", 7
            serial = f"SSB-2026-{700000 + cycle_id:06d}"
            signed = hmac.new(get_settings().jwt_secret.encode(), f"{serial}|{batch_id}".encode(), hashlib.sha256).hexdigest()
            cycles.append({"id": cycle_id, "serial_no": serial, "qr_payload": f"{serial}|{batch_id}|{signed}",
                           "batch_id": batch_id, "status": status, "student_id": student_id})
            if student_id == 1:
                handovers.append({"id": len(handovers) + 1, "cycle_id": cycle_id, "student_id": 1,
                                  "otp_hash": _hash("123456"), "otp_expires": NOW + timedelta(days=30),
                                  "otp_verified": False, "otp_attempts": 0, "photo_path": "", "lat": 22.5647,
                                  "lng": 72.9291, "handed_by": None, "handed_at": None})
            elif student_id == 7:
                handovers.append({"id": len(handovers) + 1, "cycle_id": cycle_id, "student_id": 7,
                                  "otp_hash": _hash("123456"), "otp_expires": NOW - timedelta(days=1),
                                  "otp_verified": True, "otp_attempts": 1,
                                  "photo_path": "uploads/demo_docs/handover_sample.png",
                                  "lat": 22.5481, "lng": 72.9142, "handed_by": 1, "handed_at": NOW - timedelta(days=2)})
    return batches, cycles, handovers


def _make_auxiliary_rows(students: list[dict], schools: list[dict], talukas: list[dict], district_id: int, rng: random.Random) -> tuple[list[dict], list[dict], list[dict], list[dict], list[dict]]:
    grievances: list[dict] = []
    messages: list[dict] = []
    categories = ["payment", "document", "eligibility", "cycle_damaged", "logistics", "other"]
    states = ["new", "in_progress", "escalated", "resolved"]
    school_one_students = [s["id"] for s in students if s["school_id"] == 1]
    demo_ids = school_one_students[:5]
    for index in range(60):
        student_id = demo_ids[index] if index < 5 else rng.randint(1, 1500)
        category = "cycle_damaged" if index == 0 else categories[index % len(categories)]
        age_days = 9 if index % 11 == 0 else index % 8
        status = states[index % 4]
        grievance_id = index + 1
        grievances.append({"id": grievance_id, "grv_code": f"GRV-2026-{grievance_id:05d}", "student_id": student_id,
                           "category": category, "related_application_id": None,
                           "description": f"{category.replace('_', ' ').title()} support request for demo student {student_id}.",
                           "status": status, "sla_due": NOW - timedelta(days=age_days - 7),
                           "assignee_id": 1 if student_id in school_one_students else 3, "rating": 4 if status == "resolved" else None,
                           "created_at": NOW - timedelta(days=age_days), "updated_at": NOW - timedelta(days=max(0, age_days - 1))})
        messages.extend([
            {"id": len(messages) + 1, "grievance_id": grievance_id, "author_id": students[student_id - 1]["cts_id"],
             "text": f"Please help with my {category.replace('_', ' ')} issue.", "created_at": NOW - timedelta(days=age_days)},
            {"id": len(messages) + 2, "grievance_id": grievance_id, "author_id": "SCH-AND-001" if student_id in school_one_students else "DEO-AND-001",
             "text": "We have received your request and are reviewing it.", "created_at": NOW - timedelta(days=max(0, age_days - 1))},
        ])

    notifications: list[dict] = []
    for student_id in range(1, 9):
        student = students[student_id - 1]
        for index in range(8):
            title = ["Application update", "Document reminder", "Scholarship payment", "Cycle delivery update", "Profile reminder", "Eligibility result", "School notice", "Support update"][index]
            notifications.append({"id": len(notifications) + 1, "recipient_id": student["cts_id"],
                                  "notif_type": ["application", "document", "dbt", "logistics"][index % 4],
                                  "title_en": title, "title_gu": ["અરજી અપડેટ", "દસ્તાવેજ યાદ અપાવવું", "શિષ્યવૃત્તિ ચુકવણી", "સાયકલ વિતરણ અપડેટ"][index % 4],
                                  "body": f"{title}: please review your Vidya Pragati Setu account.",
                                  "read": index >= 5, "created_at": NOW - timedelta(days=7 - index)})

    fraud: list[dict] = []
    fraud_types = ["shared_bank_account", "shared_mobile", "duplicate_application", "document_mismatch", "attendance_anomaly"]
    for index in range(18):
        cluster = index // 6
        refs = {"cluster_id": f"CLUSTER-{cluster + 1}", "student_ids": [cluster * 3 + 9, cluster * 3 + 10, cluster * 3 + 11],
                "scheme_code": ["namo-lakshmi", "sebc-obc", "gyan-setu"][cluster]}
        fraud.append({"id": index + 1, "flag_type": fraud_types[index % len(fraud_types)],
                      "entity_refs_json": json.dumps(refs), "score": round(0.68 + (index % 6) * 0.045, 3),
                      "status": ["open", "investigating", "confirmed"][index % 3],
                      "evidence_json": json.dumps({"signals": ["shared account hash", "near-duplicate mobile"], "cluster_id": refs["cluster_id"]}),
                      "created_at": NOW - timedelta(days=index % 60)})

    time_series: list[dict] = []
    for week in range(12):
        period = (NOW - timedelta(weeks=11 - week)).strftime("%Y-%m-%d")
        for taluka in talukas:
            for scheme_index, scheme in enumerate(["namo-lakshmi", "gyan-sadhna", "gyan-setu", "nmms", "sebc-obc", "saraswati-sadhna", "namo-saraswati"]):
                base = 14 + taluka["id"] * 2 + scheme_index * 3
                trend = week * (1 + (taluka["id"] % 3)) + (week * week) % 7
                app_count = max(1, base + trend + rng.randint(-3, 5))
                for metric, count, amount in [("applications", app_count, 0), ("approvals", int(app_count * (0.38 + week / 60)), 0), ("disbursement", int(app_count * 0.22), int(app_count * (3500 + scheme_index * 600)))]:
                    time_series.append({"id": len(time_series) + 1, "metric": metric, "period": period,
                                        "district_id": district_id, "taluka_id": taluka["id"],
                                        "scheme_code": scheme, "count": count, "amount": amount})
    return grievances, messages, notifications, fraud, time_series


def _audit_rows() -> list[dict]:
    rows: list[dict] = []
    previous = "genesis"
    for index in range(360):
        actor = ["SYSTEM-SEED", "SCH-AND-001", "TPEO-BOR-001", "DEO-AND-001", "ADMIN-STATE-001"][index % 5]
        role = ["system", "school", "taluka", "deo", "admin"][index % 5]
        action = ["application.seeded", "record.imported", "approval.reviewed", "funds.reconciled", "notification.sent"][index % 5]
        entity = ["Application", "AcademicRecord", "Application", "DbtTxn", "Notification"][index % 5]
        entity_id = f"SEED-{index + 1:04d}"
        after = json.dumps({"seed": SEED, "row": index + 1}, sort_keys=True)
        canonical = f"{actor}:{role}:{action}:{entity}:{entity_id}:{after}"
        digest = sha256_chain(previous, canonical)
        rows.append({"id": index + 1, "actor_id": actor, "role": role, "action": action, "entity": entity,
                     "entity_id": entity_id, "before_json": None, "after_json": after, "ip": "127.0.0.1",
                     "prev_hash": previous, "hash": digest, "created_at": NOW - timedelta(days=84) + timedelta(hours=index * 5)})
        previous = digest
    return rows


def build_dataset(seed: int = SEED) -> dict[str, list[dict]]:
    rng = random.Random(seed)
    settings = get_settings()
    samples = generate_sample_docs()
    sample_root = Path(__file__).resolve().parents[2] / "demo_docs"
    upload_dir = Path(settings.data_dir).resolve() / "uploads" / "demo_docs"
    upload_dir.mkdir(parents=True, exist_ok=True)
    for name in samples:
        for extension in ("pdf", "png"):
            shutil.copy2(sample_root / f"{name}.{extension}", upload_dir / f"{name}.{extension}")
    make_handover_proof(upload_dir / "handover_sample.png")

    districts = [{"id": 1, "name": DISTRICT_NAME, "state": "Gujarat"}]
    talukas = [{"id": idx, "name": name, "name_en": name, "name_gu": gu, "district_id": 1}
               for idx, (name, gu, _, _) in enumerate(TALUKAS, start=1)]
    schools: list[dict] = []
    school_types = ["Govt", "Grant-in-Aid", "Model", "Govt", "Grant-in-Aid"]
    for taluka_index, (taluka_name, _, center_lat, center_lng) in enumerate(TALUKAS):
        for local_index in range(5):
            school_id = taluka_index * 5 + local_index + 1
            name, name_gu = SCHOOL_NAMES[local_index]
            school_name = name if local_index == 0 else f"{name} {taluka_name} {local_index + 1}"
            school_gu = name_gu if local_index == 0 else f"{name_gu} {TALUKAS[taluka_index][1]} {local_index + 1}"
            schools.append({"id": school_id, "udise_code": f"2415{taluka_index + 1:02d}{local_index + 1:04d}",
                            "name_en": school_name, "name_gu": school_gu, "school_type": school_types[local_index],
                            "principal_name": "Dr. Kalpesh Shah" if school_id == 1 else SCHOOL_PRINCIPALS[local_index],
                            "taluka_id": taluka_index + 1,
                            "latitude": round(center_lat + rng.uniform(-0.025, 0.025), 6),
                            "longitude": round(center_lng + rng.uniform(-0.025, 0.025), 6)})
    officers = [
        {"id": 1, "officer_id": "SCH-AND-001", "mobile": "9898000001", "name": "Dr. Kalpesh Shah", "role": "school", "school_id": 1, "taluka_id": 1, "district_id": 1},
        {"id": 2, "officer_id": "TPEO-BOR-001", "mobile": "9898000002", "name": "Shri Rameshbhai Patel", "role": "taluka", "school_id": None, "taluka_id": 3, "district_id": 1},
        {"id": 3, "officer_id": "DEO-AND-001", "mobile": "9898000003", "name": "Shri Mahendrabhai Desai", "role": "deo", "school_id": None, "taluka_id": None, "district_id": 1},
        {"id": 4, "officer_id": "ADMIN-STATE-001", "mobile": "9898000004", "name": "State Administrator", "role": "admin", "school_id": None, "taluka_id": None, "district_id": 1},
        {"id": 5, "officer_id": "VND-001", "mobile": "9898000005", "name": "Atlas Cycles Ltd", "role": "vendor", "school_id": None, "taluka_id": None, "district_id": 1},
        {"id": 6, "officer_id": "VND-002", "mobile": "9898000006", "name": "Hero Cycles Gujarat", "role": "vendor", "school_id": None, "taluka_id": None, "district_id": 1},
        {"id": 7, "officer_id": "VND-003", "mobile": "9898000007", "name": "Anand Mobility Cooperative", "role": "vendor", "school_id": None, "taluka_id": None, "district_id": 1},
    ]
    password = hash_password("123456")
    for officer in officers:
        officer.update({"password_hash": password, "is_active": True, "created_at": NOW - timedelta(days=365)})
    scheme_rows = _scheme_specs()
    students, families, banks, records = _generate_students(rng, schools, password)
    applications, app_events, app_indices = _app_rows(students, scheme_rows, rng)
    dbt = _dbt_rows(applications, app_indices, DEMO_CAST, rng)
    batches, cycles, handovers = _logistics_rows(students, officers, schools, rng)
    grievances, messages, notifications, fraud, time_series = _make_auxiliary_rows(students, schools, talukas, 1, rng)
    documents = _document_rows(students, upload_dir, rng)
    settings_rows = [
        ("INCOME_LIMIT_NL", 250000), ("MARKS_LIMIT_GS", 60), ("MARKS_LIMIT_NMMS", 55),
        ("RISK_AUTO_THRESHOLD", 0.3), ("RISK_TALUKA_THRESHOLD", 0.6), ("AMOUNT_LIMIT_TALUKA", 10000),
        ("AUTO_AUDIT_SAMPLE_PCT", 5), ("SLA_DAYS_GRIEVANCE", 7),
    ]
    settings_data = [{"key": key, "value_json": json.dumps(value), "description": key, "updated_at": NOW} for key, value in settings_rows]
    audit = _audit_rows()
    return {
        "district": districts, "taluka": talukas, "school": schools, "user": officers,
        "scheme": scheme_rows, "student": students, "family": families, "bank_account": banks,
        "academic_record": records, "document": documents, "application": applications,
        "application_event": app_events, "dbt_txn": dbt, "cycle_batch": batches, "cycle": cycles,
        "handover": handovers, "grievance": grievances, "grievance_message": messages,
        "notification": notifications, "fraud_flag": fraud, "audit_log": audit,
        "time_series_point": time_series, "setting": settings_data,
    }


MODEL_BY_TABLE = {
    model.__tablename__: model for model in [
        District, Taluka, School, User, Scheme, Student, Family, BankAccount, AcademicRecord,
        Document, Application, ApplicationEvent, DbtTxn, CycleBatch, Cycle, Handover,
        Grievance, GrievanceMessage, Notification, FraudFlag, AuditLog, TimeSeriesPoint, Setting,
    ]
}


def run_seed(reset: bool = "--reset" in sys.argv) -> dict[str, int]:
    if reset:
        SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        if session.exec(select(District)).first():
            print("Already seeded. Use --reset to rebuild the demo dataset.")
            return {}
    dataset = build_dataset()
    # Build by dependency order and use bulk inserts to keep the reset quick.
    table_order = [
        "district", "taluka", "school", "user", "scheme", "student", "family", "bank_account",
        "academic_record", "document", "application", "application_event", "dbt_txn", "cycle_batch",
        "cycle", "handover", "grievance", "grievance_message", "notification", "fraud_flag",
        "audit_log", "time_series_point", "setting",
    ]
    with Session(engine) as session:
        for table_name in table_order:
            _bulk(session, MODEL_BY_TABLE[table_name], dataset[table_name])
        session.commit()
    summary = {name: len(dataset[name]) for name in table_order}
    print("Deterministic demo seed (seed=42)")
    print("Entity                 Count")
    print("---------------------  -----")
    for name, count in summary.items():
        print(f"{name:21}  {count:5}")
    print("Stage distribution")
    for stage, _, target in STAGES:
        print(f"{stage:24} {target:4} ({target / 2200:.1%})")
    print("Demo accounts: GJ-AND-2026-004512, SCH-AND-001, TPEO-BOR-001, DEO-AND-001, ADMIN-STATE-001, VND-001; OTP 123456")
    return summary


if __name__ == "__main__":
    run_seed()
