"""seed/seed.py — idempotent demo data seed. Run: python -m seed.seed [--reset]"""

from __future__ import annotations
import sys
import json
import random
import hashlib
from datetime import datetime, timedelta

from sqlmodel import Session, select
from app.db import engine, create_db_tables
from app.models.core import (
    District,
    Taluka,
    School,
    User,
    Student,
    AcademicRecord,
    Family,
    BankAccount,
    Document,
    Scheme,
    Application,
    ApplicationEvent,
    CycleBatch,
    Cycle,
    DbtTxn,
    Grievance,
    Notification,
    Setting,
)
from app.security import hash_password, sha256_chain

random.seed(42)

RESET = "--reset" in sys.argv

GU_NAMES_F = [
    "Riya",
    "Priya",
    "Anita",
    "Kavya",
    "Pooja",
    "Minal",
    "Hetal",
    "Kinjal",
    "Foram",
    "Nidhi",
    "Disha",
    "Bhoomi",
    "Riddhi",
    "Khushi",
    "Mantasha",
    "Jagruti",
    "Dhara",
    "Payal",
    "Rupal",
    "Shital",
]
GU_NAMES_M = [
    "Rahul",
    "Harsh",
    "Kishan",
    "Bhavik",
    "Darshan",
    "Krunal",
    "Meet",
    "Vipul",
    "Vishal",
    "Nirav",
    "Hardik",
    "Yash",
    "Dhruv",
    "Jay",
    "Kiran",
    "Manan",
    "Neel",
    "Om",
    "Parth",
    "Raj",
]
SURNAMES = [
    "Patel",
    "Shah",
    "Desai",
    "Joshi",
    "Parmar",
    "Makwana",
    "Chauhan",
    "Bhatt",
    "Mehta",
    "Raval",
    "Soni",
    "Thakkar",
    "Modi",
    "Pandya",
    "Trivedi",
    "Brahmbhatt",
    "Nayak",
    "Rathod",
    "Vaishnav",
    "Vasava",
]
CASTES = ["obc"] * 40 + ["sc"] * 20 + ["st"] * 10 + ["general"] * 20 + ["sebc"] * 10


def _sha(val: str) -> str:
    return hashlib.sha256(val.encode()).hexdigest()


def run_seed():
    if RESET:
        from sqlmodel import SQLModel

        SQLModel.metadata.drop_all(engine)
        print("Tables dropped.")

    create_db_tables()

    with Session(engine) as session:
        if session.exec(select(District)).first():
            print("Already seeded. Use --reset to reseed.")
            return

        # ── Geography ────────────────────────────────────────────────────────
        district = District(name="Anand", state="Gujarat")
        session.add(district)
        session.flush()

        talukas = []
        for t_name in ["Anand", "Borsad", "Petlad"]:
            t = Taluka(name=t_name, district_id=district.id)
            session.add(t)
            session.flush()
            talukas.append(t)
        anand_t, borsad_t, petlad_t = talukas

        # ── Schools (12) ─────────────────────────────────────────────────────
        school_data = [
            (
                "24150104502",
                "Shree Sardar Patel High School",
                "Govt",
                "Dr. Kalpesh Shah",
                anand_t.id,
            ),
            (
                "24150104503",
                "Vinay Mandir High School",
                "Govt",
                "Smt. Ila Desai",
                anand_t.id,
            ),
            (
                "24150104504",
                "New Era High School",
                "Grant-in-Aid",
                "Mr. Bhavesh Joshi",
                anand_t.id,
            ),
            (
                "24150200501",
                "Sarvajanik High School Borsad",
                "Govt",
                "Dr. Meera Shah",
                borsad_t.id,
            ),
            (
                "24150200502",
                "Shri Vallabh Kanya Vidyalaya",
                "Grant-in-Aid",
                "Mrs. Hansa Patel",
                borsad_t.id,
            ),
            (
                "24150200503",
                "Govt High School Borsad No.2",
                "Govt",
                "Mr. Arvind Raval",
                borsad_t.id,
            ),
            (
                "24150200504",
                "Model High School Borsad",
                "Model",
                "Mr. Sunil Bhatt",
                borsad_t.id,
            ),
            (
                "24150300601",
                "R.K. High School Petlad",
                "Govt",
                "Mrs. Jyoti Nayak",
                petlad_t.id,
            ),
            (
                "24150300602",
                "Pragati High School Petlad",
                "Grant-in-Aid",
                "Mr. Ravi Thakkar",
                petlad_t.id,
            ),
            (
                "24150300603",
                "Govt High School Petlad No.2",
                "Govt",
                "Mr. Suresh Parmar",
                petlad_t.id,
            ),
            (
                "24150104505",
                "Anand Model High School",
                "Model",
                "Dr. Alpa Mehta",
                anand_t.id,
            ),
            (
                "24150200505",
                "Bal Vidya Mandir Borsad",
                "Govt",
                "Mrs. Rupal Vasava",
                borsad_t.id,
            ),
        ]
        schools = []
        for udise, name, stype, principal, taluka_id in school_data:
            s = School(
                udise_code=udise,
                name_en=name,
                name_gu=name,
                school_type=stype,
                principal_name=principal,
                taluka_id=taluka_id,
            )
            session.add(s)
            session.flush()
            schools.append(s)
        demo_school = schools[0]

        # ── Officers (Users) ─────────────────────────────────────────────────
        officers = [
            User(
                officer_id="SCH-AND-001",
                mobile="9898000001",
                name="Dr. Kalpesh Shah",
                role="school",
                school_id=demo_school.id,
                password_hash=hash_password("123456"),
            ),
            User(
                officer_id="TPEO-BOR-001",
                mobile="9898000002",
                name="Shri Rameshbhai Patel",
                role="taluka",
                taluka_id=borsad_t.id,
                password_hash=hash_password("123456"),
            ),
            User(
                officer_id="DEO-AND-001",
                mobile="9898000003",
                name="Shri Mahendrabhai Desai",
                role="deo",
                district_id=district.id,
                password_hash=hash_password("123456"),
            ),
            User(
                officer_id="ADMIN-STATE-001",
                mobile="9898000004",
                name="State Administrator",
                role="admin",
                password_hash=hash_password("123456"),
            ),
            User(
                officer_id="VND-001",
                mobile="9898000005",
                name="Atlas Cycles Ltd",
                role="vendor",
                password_hash=hash_password("123456"),
            ),
            User(
                officer_id="VND-002",
                mobile="9898000006",
                name="Hero Cycles Gujarat",
                role="vendor",
                password_hash=hash_password("123456"),
            ),
        ]
        for u in officers:
            session.add(u)
        session.flush()
        vendor1 = officers[4]

        # ── Settings ──────────────────────────────────────────────────────────
        settings_data = {
            "INCOME_LIMIT_NL": 250000,
            "MARKS_LIMIT_GS": 60,
            "MARKS_LIMIT_NMMS": 55,
            "RISK_AUTO_THRESHOLD": 0.3,
            "RISK_TALUKA_THRESHOLD": 0.6,
            "AMOUNT_LIMIT_TALUKA": 10000,
            "SLA_DAYS_GRIEVANCE": 7,
        }
        for k, v in settings_data.items():
            session.add(Setting(key=k, value_json=json.dumps(v), description=k))

        # ── Schemes (7) ──────────────────────────────────────────────────────
        SCHEMES = [
            {
                "code": "namo-lakshmi",
                "name_en": "Namo Lakshmi Yojana",
                "name_gu": "નમો લ. .",
                "scheme_type": "cash",
                "rules_json": json.dumps(
                    {
                        "all": [
                            {"field": "gender", "op": "==", "value": "female"},
                            {"field": "grade", "op": ">=", "value": 9},
                            {"field": "annual_income", "op": "<=", "value": 250000},
                        ]
                    }
                ),
                "required_docs_json": json.dumps(["aadhaar", "income"]),
                "payout_json": json.dumps(
                    {"amount": 10000, "installments": 2, "frequency": "biannual"}
                ),
                "budget": 500000000,
                "description_en": "₹10,000/year for girls in Std 9–12. Direct DBT to mother's account.",
                "mutually_exclusive_with_json": "[]",
            },
            {
                "code": "namo-saraswati",
                "name_en": "Namo Saraswati Science Scholarship",
                "name_gu": "ન. સ. .",
                "scheme_type": "cash",
                "rules_json": json.dumps(
                    {
                        "all": [
                            {"field": "gender", "op": "==", "value": "female"},
                            {"field": "stream", "op": "==", "value": "science"},
                            {"field": "grade", "op": ">=", "value": 11},
                        ]
                    }
                ),
                "required_docs_json": json.dumps(["aadhaar", "marksheet"]),
                "payout_json": json.dumps({"amount": 25000}),
                "budget": 100000000,
                "description_en": "₹25,000/year for girls in Science stream Std 11–12.",
                "mutually_exclusive_with_json": "[]",
            },
            {
                "code": "gyan-sadhna",
                "name_en": "Gyan Sadhna Scholarship",
                "name_gu": "જ્ઞ. સ. .",
                "scheme_type": "cash",
                "rules_json": json.dumps(
                    {
                        "all": [
                            {"field": "marks_pct", "op": ">=", "value": 60},
                        ]
                    }
                ),
                "required_docs_json": json.dumps(["marksheet"]),
                "payout_json": json.dumps({"amount": 12500}),
                "budget": 200000000,
                "description_en": "Merit scholarship for 60%+ students.",
                "mutually_exclusive_with_json": "[]",
            },
            {
                "code": "gyan-setu",
                "name_en": "Gyan Setu Scholarship",
                "name_gu": "જ્ઞ. સ. .",
                "scheme_type": "cash",
                "rules_json": json.dumps(
                    {
                        "all": [
                            {"field": "annual_income", "op": "<=", "value": 250000},
                        ]
                    }
                ),
                "required_docs_json": json.dumps(["income"]),
                "payout_json": json.dumps({"amount": 12000}),
                "budget": 300000000,
                "description_en": "₹12,000 for students with family income < ₹2.5L.",
                "mutually_exclusive_with_json": json.dumps(["nmms"]),
            },
            {
                "code": "nmms",
                "name_en": "NMMS Scholarship",
                "name_gu": "NMMS .",
                "scheme_type": "cash",
                "rules_json": json.dumps(
                    {
                        "all": [
                            {"field": "marks_pct", "op": ">=", "value": 55},
                            {"field": "annual_income", "op": "<=", "value": 150000},
                        ]
                    }
                ),
                "required_docs_json": json.dumps(["marksheet", "income"]),
                "payout_json": json.dumps({"amount": 12000}),
                "budget": 150000000,
                "description_en": "National merit scholarship. Mutually exclusive with Gyan Setu.",
                "mutually_exclusive_with_json": json.dumps(["gyan-setu"]),
            },
            {
                "code": "sebc-obc",
                "name_en": "Post-Matric SEBC/OBC Scholarship",
                "name_gu": "SEBC/OBC.",
                "scheme_type": "cash",
                "rules_json": json.dumps(
                    {
                        "all": [
                            {
                                "field": "caste_category",
                                "op": "in",
                                "value": ["obc", "sebc"],
                            },
                            {"field": "annual_income", "op": "<=", "value": 250000},
                        ]
                    }
                ),
                "required_docs_json": json.dumps(["caste", "income"]),
                "payout_json": json.dumps({"amount": 15000}),
                "budget": 250000000,
                "description_en": "₹15,000 post-matric scholarship for OBC/SEBC students.",
                "mutually_exclusive_with_json": "[]",
            },
            {
                "code": "saraswati-sadhna",
                "name_en": "Saraswati Sadhna Yojana (Bicycle)",
                "name_gu": "સ. સ. .",
                "scheme_type": "material",
                "rules_json": json.dumps(
                    {
                        "all": [
                            {"field": "gender", "op": "==", "value": "female"},
                            {"field": "grade", "op": "==", "value": 9},
                        ]
                    }
                ),
                "required_docs_json": json.dumps(["aadhaar"]),
                "payout_json": json.dumps({"amount": 0, "material": "bicycle"}),
                "budget": 50000000,
                "description_en": "Free bicycle for girls entering Std 9.",
                "mutually_exclusive_with_json": "[]",
            },
        ]
        scheme_objs: dict[str, Scheme] = {}
        for sd in SCHEMES:
            s = Scheme(**sd, version=1, active=True)
            session.add(s)
            session.flush()
            scheme_objs[sd["code"]] = s

        # ── Demo Student (Riya Patel) ─────────────────────────────────────────
        # OTP is the demo login mechanism, but retain one shared password hash
        # for seeded records that expose the optional password field. Hashing
        # the same value for all 600 rows is needlessly expensive.
        demo_password_hash = hash_password("123456")
        riya = Student(
            cts_id="GJ-AND-2026-004512",
            mobile="9876543210",
            name_en="Riya Hasmukhbhai Patel",
            name_gu="રિયા હ. પ.",
            dob="2009-08-15",
            gender="female",
            caste_category="obc",
            school_id=demo_school.id,
            grade=9,
            stream="general",
            guardian_name="Hetalben Patel",
            guardian_mobile="9876543211",
            guardian_consent=True,
            distance_km=1.5,
            password_hash=demo_password_hash,
        )
        session.add(riya)
        session.flush()
        session.add(
            AcademicRecord(
                student_id=riya.id,
                year=2025,
                grade=8,
                attendance_pct=88.0,
                marks_pct=79.0,
            )
        )
        session.add(
            Family(
                student_id=riya.id,
                annual_income=96000,
                income_cert_id="REV/AND/2026/049182",
            )
        )
        session.add(
            BankAccount(
                student_id=riya.id,
                holder_type="mother",
                holder_name="Hetalben Patel",
                account_hash=_sha("SBI123454521"),
                last4="4521",
                ifsc="SBIN0001234",
                bank_name="State Bank of India",
                aadhaar_seeded=True,
                verified=True,
            )
        )
        for doc_type, doc_no, src, conf in [
            ("aadhaar", "••••8912", "digilocker", 0.98),
            ("income", "REV/AND/2026/049182", "upload", 0.84),
            ("caste", "CST/GUJ/2024/99102", "digilocker", 0.99),
            ("marksheet", "GSEB/2025/MS-88124", "upload", 0.95),
        ]:
            session.add(
                Document(
                    student_id=riya.id,
                    doc_type=doc_type,
                    doc_number=doc_no,
                    source=src,
                    status="verified",
                    confidence=conf,
                )
            )

        # ── 599 more students ─────────────────────────────────────────────────
        # 3 students share a bank account (fraud seed)
        shared_hash = _sha("SHARED_BANK_FRAUD_HASH")
        fraud_students_added = 0
        all_students = [riya]

        for i in range(599):
            is_female = random.random() < 0.55
            fname = random.choice(GU_NAMES_F if is_female else GU_NAMES_M)
            sname = random.choice(SURNAMES)
            caste = random.choice(CASTES)
            school = random.choice(schools)
            grade = random.randint(9, 12)
            stream = random.choice(["general", "science", "commerce", "arts"])
            income = random.randint(60000, 250000)
            att = round(random.uniform(60, 98), 1)
            marks = round(random.uniform(45, 95), 1)
            dist = round(random.uniform(0.5, 15.0), 1)
            # shared mobile fraud: student 500-504 share one mobile
            mobile = "9777000000" if i >= 499 and i < 504 else f"98{i:08d}"

            st = Student(
                cts_id=f"GJ-AND-2026-{i+1000:06d}",
                mobile=mobile,
                name_en=f"{fname} {sname}",
                name_gu=f"{fname} {sname}",
                dob=f"20{random.randint(8,10):02d}-{random.randint(1,12):02d}-{random.randint(1,28):02d}",
                gender="female" if is_female else "male",
                caste_category=caste,
                school_id=school.id,
                grade=grade,
                stream=stream,
                guardian_name=f"Guardian {sname}",
                guardian_mobile=f"96{i:08d}",
                guardian_consent=True,
                distance_km=dist,
                password_hash=demo_password_hash,
            )
            session.add(st)
            session.flush()
            session.add(
                AcademicRecord(
                    student_id=st.id,
                    year=2025,
                    grade=grade - 1,
                    attendance_pct=att,
                    marks_pct=marks,
                )
            )
            session.add(Family(student_id=st.id, annual_income=income))
            # Shared bank fraud: first 3 non-demo students share account
            if fraud_students_added < 3:
                session.add(
                    BankAccount(
                        student_id=st.id,
                        holder_type="student",
                        holder_name=f"{fname} {sname}",
                        account_hash=shared_hash,
                        last4="0000",
                        ifsc="HDFC0001234",
                        bank_name="HDFC Bank",
                        aadhaar_seeded=False,
                        verified=False,
                    )
                )
                fraud_students_added += 1
            else:
                acct_hash = _sha(f"ACCT_{i}_{sname}")
                session.add(
                    BankAccount(
                        student_id=st.id,
                        holder_type="student",
                        holder_name=f"{fname} {sname}",
                        account_hash=acct_hash,
                        last4=f"{i%10000:04d}",
                        ifsc="SBIN0001235",
                        bank_name="SBI",
                        aadhaar_seeded=True,
                        verified=True,
                    )
                )
            all_students.append(st)

        session.flush()

        # ── Applications (30 across students + statuses) ──────────────────────
        statuses = [
            "applied",
            "school_verified",
            "taluka_approved",
            "deo_approved",
            "sanctioned",
            "credited",
            "rejected",
        ] * 5
        for idx, st in enumerate(random.sample(all_students[1:], 30)):
            scheme = random.choice(list(scheme_objs.values()))
            payout = json.loads(scheme.payout_json)
            amount = payout.get("amount", 0)
            status = statuses[idx % len(statuses)]
            app = Application(
                app_code=f"APP-SEED-{idx:04d}",
                student_id=st.id,
                scheme_id=scheme.id,
                status=status,
                stage="school",
                route="auto",
                risk_score=round(random.uniform(0, 0.8), 2),
                risk_level=random.choice(["low", "medium", "high"]),
                amount=amount,
                academic_year="2026-27",
                consent_at=datetime.utcnow() - timedelta(days=random.randint(1, 30)),
            )
            session.add(app)
            session.flush()
            prev = "genesis"
            for ev_stage in [status]:
                payload = json.dumps({"stage": ev_stage})
                h = sha256_chain(prev, payload)
                session.add(
                    ApplicationEvent(
                        application_id=app.id,
                        stage=ev_stage,
                        actor_id="SYSTEM",
                        actor_role="system",
                        note="Seeded",
                        payload_json=payload,
                        prev_hash=prev,
                        hash=h,
                    )
                )
                prev = h
            if status == "credited":
                utr = f"SBIN{random.randint(1000000000, 9999999999)}"
                session.add(
                    DbtTxn(
                        application_id=app.id,
                        amount=amount,
                        status="credited",
                        utr=utr,
                        batch_ref="BATCH-SEED-01",
                        idempotency_key=f"idem-{app.app_code}",
                        initiated_at=datetime.utcnow() - timedelta(days=5),
                        credited_at=datetime.utcnow() - timedelta(days=3),
                    )
                )

        # ── Riya's applications ───────────────────────────────────────────────
        riya_app = Application(
            app_code="APP-2026-RIYA-NL",
            student_id=riya.id,
            scheme_id=scheme_objs["namo-lakshmi"].id,
            status="school_verified",
            stage="school",
            route="auto",
            risk_score=0.1,
            risk_level="low",
            amount=10000,
            academic_year="2026-27",
            consent_at=datetime.utcnow(),
        )
        session.add(riya_app)

        # ── Cycle Batches ─────────────────────────────────────────────────────
        batch1 = CycleBatch(
            batch_code="BATCH-2026-AN-001",
            vendor_id=vendor1.id,
            school_id=demo_school.id,
            qty=60,
            dispatched_at=datetime.utcnow() - timedelta(days=10),
            received_at=datetime.utcnow() - timedelta(days=5),
            received_qty=58,
            status="received",
        )
        session.add(batch1)
        session.flush()
        for i in range(60):
            serial = f"SSB-2026-{700000+i:06d}"
            session.add(
                Cycle(
                    serial_no=serial,
                    batch_id=batch1.id,
                    qr_payload=f"VPS|{serial}|{batch1.id}",
                    status="received" if i < 58 else "in_stock",
                )
            )

        # ── Grievances (20) ───────────────────────────────────────────────────
        grv_cats = ["payment", "document", "eligibility", "logistics", "other"]
        grv_statuses = ["new", "in_progress", "escalated", "resolved"]
        for gi, st in enumerate(random.sample(all_students, 20)):
            g = Grievance(
                grv_code=f"GRV-2026-{gi+1:05d}",
                student_id=st.id,
                category=grv_cats[gi % 5],
                description=f"Demo grievance {gi+1} — {grv_cats[gi % 5]} issue",
                status=grv_statuses[gi % 4],
                sla_due=datetime.utcnow() + timedelta(days=7 - (gi % 10)),
            )
            session.add(g)

        # ── Notifications ─────────────────────────────────────────────────────
        for ni in range(5):
            session.add(
                Notification(
                    recipient_id="GJ-AND-2026-004512",
                    notif_type="dbt",
                    title_en=f"Payment Update #{ni+1}",
                    title_gu=f"ચ. ., {ni+1}",
                    body=f"Your Namo Lakshmi installment #{ni+1} status updated.",
                    read=(ni > 2),
                )
            )

        session.commit()
        print("✅ Seeded successfully!")
        print("   Students: 600 | Schemes: 7 | Schools: 12")
        print("   Demo student: GJ-AND-2026-004512 / OTP: 123456")
        print("   Officers: SCH-AND-001, TPEO-BOR-001, DEO-AND-001, ADMIN-STATE-001")
        print(
            "   Fraud patterns seeded: shared_bank (3 students), shared_mobile (5 students)"
        )


if __name__ == "__main__":
    run_seed()
