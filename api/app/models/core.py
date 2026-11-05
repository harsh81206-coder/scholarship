"""app/models/core.py — All SQLModel ORM tables (B1)."""

from datetime import datetime
from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship


# ── Geography ────────────────────────────────────────────────────────────────
class District(SQLModel, table=True):
    __tablename__ = "district"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    state: str = "Gujarat"
    talukas: List["Taluka"] = Relationship(back_populates="district")


class Taluka(SQLModel, table=True):
    __tablename__ = "taluka"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    district_id: int = Field(foreign_key="district.id", index=True)
    district: Optional["District"] = Relationship(back_populates="talukas")
    schools: List["School"] = Relationship(back_populates="taluka")


class School(SQLModel, table=True):
    __tablename__ = "school"
    id: Optional[int] = Field(default=None, primary_key=True)
    udise_code: str = Field(unique=True, index=True)
    name_en: str
    name_gu: str = ""
    school_type: str = "Govt"
    principal_name: str = ""
    taluka_id: int = Field(foreign_key="taluka.id", index=True)
    taluka: Optional["Taluka"] = Relationship(back_populates="schools")
    students: List["Student"] = Relationship(back_populates="school")


# ── Users (officers) ─────────────────────────────────────────────────────────
class User(SQLModel, table=True):
    __tablename__ = "user"
    id: Optional[int] = Field(default=None, primary_key=True)
    officer_id: str = Field(unique=True, index=True)
    mobile: str = Field(index=True)
    name: str
    role: str
    school_id: Optional[int] = Field(default=None, foreign_key="school.id")
    taluka_id: Optional[int] = Field(default=None, foreign_key="taluka.id")
    district_id: Optional[int] = Field(default=None, foreign_key="district.id")
    password_hash: str = ""
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ── Students ─────────────────────────────────────────────────────────────────
class Student(SQLModel, table=True):
    __tablename__ = "student"
    id: Optional[int] = Field(default=None, primary_key=True)
    cts_id: str = Field(unique=True, index=True)
    mobile: str = Field(index=True)
    name_en: str
    name_gu: str = ""
    dob: str = ""
    gender: str = ""
    caste_category: str = ""
    school_id: int = Field(foreign_key="school.id", index=True)
    grade: int = 9
    stream: str = ""
    guardian_name: str = ""
    guardian_mobile: str = ""
    guardian_consent: bool = False
    distance_km: float = 0.0
    risk_score: float = 0.0
    risk_level: str = "low"
    password_hash: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)

    school: Optional["School"] = Relationship(back_populates="students")
    academic_records: List["AcademicRecord"] = Relationship(back_populates="student")
    family: Optional["Family"] = Relationship(back_populates="student")
    bank_accounts: List["BankAccount"] = Relationship(back_populates="student")
    documents: List["Document"] = Relationship(back_populates="student")
    applications: List["Application"] = Relationship(back_populates="student")
    grievances: List["Grievance"] = Relationship(back_populates="student")


class AcademicRecord(SQLModel, table=True):
    __tablename__ = "academic_record"
    id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="student.id", index=True)
    year: int
    grade: int
    attendance_pct: float = 0.0
    marks_pct: float = 0.0
    result_json: Optional[str] = Field(default=None)
    student: Optional["Student"] = Relationship(back_populates="academic_records")


class Family(SQLModel, table=True):
    __tablename__ = "family"
    id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="student.id", unique=True, index=True)
    annual_income: int = 0
    income_cert_id: str = ""
    student: Optional["Student"] = Relationship(back_populates="family")


class BankAccount(SQLModel, table=True):
    __tablename__ = "bank_account"
    id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="student.id", index=True)
    holder_type: str = "mother"
    holder_name: str = ""
    account_hash: str = Field(index=True)
    last4: str
    ifsc: str = ""
    bank_name: str = ""
    aadhaar_seeded: bool = False
    verified: bool = False
    student: Optional["Student"] = Relationship(back_populates="bank_accounts")


class Document(SQLModel, table=True):
    __tablename__ = "document"
    id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="student.id", index=True)
    doc_type: str = Field(index=True)
    file_path: str = ""
    status: str = "pending"
    extracted_json: Optional[str] = None
    authenticity_json: Optional[str] = None
    confidence: float = 0.0
    expiry: Optional[str] = None
    source: str = "upload"
    doc_number: Optional[str] = None
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    student: Optional["Student"] = Relationship(back_populates="documents")


# ── Schemes ──────────────────────────────────────────────────────────────────
class Scheme(SQLModel, table=True):
    __tablename__ = "scheme"
    id: Optional[int] = Field(default=None, primary_key=True)
    code: str = Field(unique=True, index=True)
    name_en: str
    name_gu: str = ""
    name_hi: str = ""
    scheme_type: str = "cash"
    rules_json: str = "{}"
    required_docs_json: str = "[]"
    payout_json: str = "{}"
    budget: int = 0
    mutually_exclusive_with_json: str = "[]"
    version: int = 1
    active: bool = True
    valid_from: str = ""
    valid_to: str = ""
    description_en: str = ""
    description_gu: str = ""
    eligibility_results: List["EligibilityResult"] = Relationship(
        back_populates="scheme"
    )
    applications: List["Application"] = Relationship(back_populates="scheme")


class EligibilityResult(SQLModel, table=True):
    __tablename__ = "eligibility_result"
    id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="student.id", index=True)
    scheme_id: int = Field(foreign_key="scheme.id", index=True)
    academic_year: str = ""
    status: str = "pending_docs"
    reasons_json: str = "[]"
    scheme_version: int = 1
    evaluated_at: datetime = Field(default_factory=datetime.utcnow)
    scheme: Optional["Scheme"] = Relationship(back_populates="eligibility_results")


# ── Applications ─────────────────────────────────────────────────────────────
class Application(SQLModel, table=True):
    __tablename__ = "application"
    id: Optional[int] = Field(default=None, primary_key=True)
    app_code: str = Field(unique=True, index=True)
    student_id: int = Field(foreign_key="student.id", index=True)
    scheme_id: int = Field(foreign_key="scheme.id", index=True)
    academic_year: str = "2026-27"
    status: str = "applied"
    stage: str = "school"
    risk_score: float = 0.0
    risk_level: str = "low"
    route: str = "auto"
    amount: int = 0
    consent_at: Optional[datetime] = None
    assigned_to: Optional[int] = Field(default=None, foreign_key="user.id")
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    student: Optional["Student"] = Relationship(back_populates="applications")
    scheme: Optional["Scheme"] = Relationship(back_populates="applications")
    events: List["ApplicationEvent"] = Relationship(back_populates="application")
    dbt_txns: List["DbtTxn"] = Relationship(back_populates="application")


class ApplicationEvent(SQLModel, table=True):
    __tablename__ = "application_event"
    id: Optional[int] = Field(default=None, primary_key=True)
    application_id: int = Field(foreign_key="application.id", index=True)
    stage: str
    actor_id: Optional[str] = None
    actor_role: str = ""
    note: str = ""
    payload_json: str = "{}"
    prev_hash: str = "genesis"
    hash: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)
    application: Optional["Application"] = Relationship(back_populates="events")


# ── Cycle Logistics ──────────────────────────────────────────────────────────
class CycleBatch(SQLModel, table=True):
    __tablename__ = "cycle_batch"
    id: Optional[int] = Field(default=None, primary_key=True)
    batch_code: str = Field(unique=True, index=True)
    vendor_id: int = Field(foreign_key="user.id", index=True)
    school_id: int = Field(foreign_key="school.id", index=True)
    qty: int = 0
    dispatched_at: Optional[datetime] = None
    received_at: Optional[datetime] = None
    received_qty: int = 0
    gps_json: str = "[]"
    status: str = "ordered"
    cycles: List["Cycle"] = Relationship(back_populates="batch")


class Cycle(SQLModel, table=True):
    __tablename__ = "cycle"
    id: Optional[int] = Field(default=None, primary_key=True)
    serial_no: str = Field(unique=True, index=True)
    qr_payload: str = ""
    batch_id: int = Field(foreign_key="cycle_batch.id", index=True)
    status: str = "in_stock"
    student_id: Optional[int] = Field(default=None, foreign_key="student.id")
    batch: Optional["CycleBatch"] = Relationship(back_populates="cycles")
    handovers: List["Handover"] = Relationship(back_populates="cycle")


class Handover(SQLModel, table=True):
    __tablename__ = "handover"
    id: Optional[int] = Field(default=None, primary_key=True)
    cycle_id: int = Field(foreign_key="cycle.id", unique=True, index=True)
    student_id: int = Field(foreign_key="student.id", index=True)
    otp_hash: str = ""
    otp_expires: Optional[datetime] = None
    otp_verified: bool = False
    otp_attempts: int = 0
    photo_path: str = ""
    lat: Optional[float] = None
    lng: Optional[float] = None
    handed_by: Optional[int] = Field(default=None, foreign_key="user.id")
    handed_at: Optional[datetime] = None
    cycle: Optional["Cycle"] = Relationship(back_populates="handovers")


# ── DBT Transactions ─────────────────────────────────────────────────────────
class DbtTxn(SQLModel, table=True):
    __tablename__ = "dbt_txn"
    id: Optional[int] = Field(default=None, primary_key=True)
    application_id: int = Field(foreign_key="application.id", index=True)
    amount: int = 0
    status: str = "initiated"
    utr: Optional[str] = Field(default=None, index=True)
    failure_reason: Optional[str] = None
    batch_ref: Optional[str] = None
    idempotency_key: str = Field(unique=True, index=True)
    initiated_at: datetime = Field(default_factory=datetime.utcnow)
    credited_at: Optional[datetime] = None
    application: Optional["Application"] = Relationship(back_populates="dbt_txns")


# ── Grievances ───────────────────────────────────────────────────────────────
class Grievance(SQLModel, table=True):
    __tablename__ = "grievance"
    id: Optional[int] = Field(default=None, primary_key=True)
    grv_code: str = Field(unique=True, index=True)
    student_id: int = Field(foreign_key="student.id", index=True)
    category: str = ""
    related_application_id: Optional[int] = Field(
        default=None, foreign_key="application.id"
    )
    description: str = ""
    status: str = "new"
    sla_due: Optional[datetime] = None
    assignee_id: Optional[int] = Field(default=None, foreign_key="user.id")
    rating: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    student: Optional["Student"] = Relationship(back_populates="grievances")
    messages: List["GrievanceMessage"] = Relationship(back_populates="grievance")


class GrievanceMessage(SQLModel, table=True):
    __tablename__ = "grievance_message"
    id: Optional[int] = Field(default=None, primary_key=True)
    grievance_id: int = Field(foreign_key="grievance.id", index=True)
    author_id: Optional[str] = None
    text: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)
    grievance: Optional["Grievance"] = Relationship(back_populates="messages")


# ── Notifications ────────────────────────────────────────────────────────────
class Notification(SQLModel, table=True):
    __tablename__ = "notification"
    id: Optional[int] = Field(default=None, primary_key=True)
    recipient_id: str = Field(index=True)
    notif_type: str = ""
    title_en: str = ""
    title_gu: str = ""
    body: str = ""
    read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ── Fraud ────────────────────────────────────────────────────────────────────
class FraudFlag(SQLModel, table=True):
    __tablename__ = "fraud_flag"
    id: Optional[int] = Field(default=None, primary_key=True)
    flag_type: str = Field(index=True)
    entity_refs_json: str = "{}"
    score: float = 0.0
    status: str = "open"
    evidence_json: str = "{}"
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ── Audit Log ────────────────────────────────────────────────────────────────
class AuditLog(SQLModel, table=True):
    __tablename__ = "audit_log"
    id: Optional[int] = Field(default=None, primary_key=True)
    actor_id: str = ""
    role: str = ""
    action: str = ""
    entity: str = ""
    entity_id: str = ""
    before_json: Optional[str] = None
    after_json: Optional[str] = None
    ip: str = ""
    prev_hash: str = "genesis"
    hash: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ── Delegation ───────────────────────────────────────────────────────────────
class Delegation(SQLModel, table=True):
    __tablename__ = "delegation"
    id: Optional[int] = Field(default=None, primary_key=True)
    from_user_id: int = Field(foreign_key="user.id", index=True)
    to_user_id: int = Field(foreign_key="user.id", index=True)
    scope_json: str = "{}"
    due_date: Optional[str] = None
    status: str = "active"


# ── Settings ─────────────────────────────────────────────────────────────────
class Setting(SQLModel, table=True):
    __tablename__ = "setting"
    key: str = Field(primary_key=True)
    value_json: str = "{}"
    description: str = ""
    updated_at: datetime = Field(default_factory=datetime.utcnow)
