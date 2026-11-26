"""Additional scoped directories, demo purchase orders and payment ledgers."""

from __future__ import annotations

import json
import secrets
from pathlib import Path
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlmodel import Session, select

from app.db import get_session
from app.deps import CurrentUser, get_current_user
from app.models.core import (
    AcademicRecord,
    Application,
    AuditLog,
    BankAccount,
    BudgetAllocation,
    Cycle,
    CycleBatch,
    Defect,
    Grievance,
    Handover,
    Invoice,
    Notification,
    School,
    Student,
    Taluka,
    User,
    VendorOrder,
    Scheme,
)
from app.security import sha256_chain

router = APIRouter(tags=["directories"])


@router.get("/admin/ml/metrics")
def admin_ml_metrics(
    user: CurrentUser = Depends(get_current_user),
):
    if user.role != "admin":
        raise HTTPException(403, "Admin role required")
    metrics_path = Path(__file__).resolve().parents[2] / "artifacts" / "metrics.json"
    if not metrics_path.is_file():
        return {"available": False, "models": {}}
    try:
        metrics = json.loads(metrics_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {"available": False, "models": {}}
    return {"available": True, "models": metrics, "synthetic_demo_data": True}


def _audit(session: Session, user: CurrentUser, action: str, entity: str, entity_id: str, data: dict):
    serialized = json.dumps(data, sort_keys=True, default=str)
    previous = session.exec(select(AuditLog).order_by(AuditLog.id.desc())).first()
    previous_hash = previous.hash if previous and previous.hash else "genesis"
    payload = f"{user.sub}:{user.role}:{action}:{entity}:{entity_id}:{serialized}"
    session.add(AuditLog(
        actor_id=user.sub,
        role=user.role,
        action=action,
        entity=entity,
        entity_id=entity_id,
        after_json=serialized,
        prev_hash=previous_hash,
        hash=sha256_chain(previous_hash, payload),
    ))


@router.get("/school/students")
def school_students(
    q: str = "",
    risk: str | None = None,
    page: int = 1,
    size: int = 50,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role not in ("school", "taluka", "deo", "admin"):
        raise HTTPException(403, "Officer role required")
    query = select(Student).order_by(Student.name_en)
    if user.role == "school":
        query = query.where(Student.school_id == user.school_id)
    elif user.role == "taluka":
        query = query.join(School).where(School.taluka_id == user.taluka_id)
    elif user.role == "deo":
        query = query.join(School).join(Taluka).where(Taluka.district_id == user.district_id)
    students = session.exec(query).all()
    normalized = q.strip().lower()
    if normalized:
        students = [s for s in students if normalized in s.name_en.lower() or normalized in s.cts_id.lower()]
    if risk:
        students = [s for s in students if s.risk_level == risk]
    total = len(students)
    rows = students[max(0, page - 1) * min(100, size):page * min(100, size)]
    return {
        "items": [
            {
                "cts_id": student.cts_id,
                "name_en": student.name_en,
                "name_gu": student.name_gu,
                "grade": student.grade,
                "gender": student.gender,
                "risk_level": student.risk_level,
                "risk_score": student.risk_score,
                "school_id": student.school_id,
                "attendance_pct": (session.exec(select(AcademicRecord.attendance_pct).where(AcademicRecord.student_id == student.id).order_by(AcademicRecord.id.desc())).first() or 0),
            }
            for student in rows
        ],
        "total": total,
        "page": page,
        "size": min(100, size),
    }


@router.get("/school/students/{cts_id}")
def school_student_detail(
    cts_id: str,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    student = session.exec(select(Student).where(Student.cts_id == cts_id)).first()
    if not student:
        raise HTTPException(404, "Student not found")
    if user.role == "school" and student.school_id != user.school_id:
        raise HTTPException(403, "Student is outside your school scope")
    school = session.get(School, student.school_id)
    if user.role == "taluka" and (not school or school.taluka_id != user.taluka_id):
        raise HTTPException(403, "Student is outside your taluka scope")
    if user.role == "deo":
        taluka = session.get(Taluka, school.taluka_id) if school else None
        if not taluka or taluka.district_id != user.district_id:
            raise HTTPException(403, "Student is outside your district scope")
    if user.role not in ("school", "taluka", "deo", "admin"):
        raise HTTPException(403)
    records = session.exec(select(AcademicRecord).where(AcademicRecord.student_id == student.id).order_by(AcademicRecord.id.desc()).limit(12)).all()
    applications = session.exec(select(Application).where(Application.student_id == student.id).order_by(Application.id.desc())).all()
    cycles = session.exec(select(Cycle).where(Cycle.student_id == student.id)).all()
    grievances = session.exec(select(Grievance).where(Grievance.student_id == student.id).order_by(Grievance.created_at.desc())).all()
    return {
        "cts_id": student.cts_id,
        "name_en": student.name_en,
        "name_gu": student.name_gu,
        "grade": student.grade,
        "risk_level": student.risk_level,
        "risk_score": student.risk_score,
        "distance_km": student.distance_km,
        "school_id": student.school_id,
        "attendance": [{"month": row.record_month, "attendance_pct": row.attendance_pct, "marks_pct": row.marks_pct} for row in records],
        "applications": [{"app_code": row.app_code, "status": row.status, "amount": row.amount, "scheme": row.scheme.name_en if row.scheme else ""} for row in applications],
        "cycles": [{"serial_no": row.serial_no, "status": row.status} for row in cycles],
        "grievances": [{"grv_code": row.grv_code, "status": row.status, "category": row.category} for row in grievances],
        "bank": [{"holder_type": row.holder_type, "holder_name": row.holder_name, "last4": row.last4, "verified": row.verified, "aadhaar_seeded": row.aadhaar_seeded} for row in session.exec(select(BankAccount).where(BankAccount.student_id == student.id)).all()],
    }


@router.get("/handovers")
def list_handovers(
    page: int = 1,
    size: int = 50,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role not in ("school", "taluka", "deo", "admin"):
        raise HTTPException(403, "Officer role required")
    rows = session.exec(select(Handover).order_by(Handover.id.desc())).all()
    result = []
    for handover in rows:
        cycle = session.get(Cycle, handover.cycle_id)
        student = session.get(Student, handover.student_id)
        school = session.get(School, student.school_id) if student else None
        if not cycle or not student or not school:
            continue
        if user.role == "school" and school.id != user.school_id:
            continue
        if user.role == "taluka" and school.taluka_id != user.taluka_id:
            continue
        if user.role == "deo":
            taluka = session.get(Taluka, school.taluka_id)
            if not taluka or taluka.district_id != user.district_id:
                continue
        result.append({
            "id": handover.id,
            "serial_no": cycle.serial_no,
            "cts_id": student.cts_id,
            "student_name": student.name_en,
            "school": school.name_en,
            "status": "handed_over" if handover.handed_at else "pending",
            "handed_at": handover.handed_at.isoformat() if handover.handed_at else None,
            "lat": handover.lat,
            "lng": handover.lng,
            "photo_path": handover.photo_path,
        })
    total = len(result)
    limit = min(max(size, 1), 100)
    return {"items": result[max(page - 1, 0) * limit:page * limit], "total": total, "page": page, "size": limit}


class VendorOrderCreate(BaseModel):
    vendor_id: int | None = None
    school_id: int
    qty: int = Field(ge=1, le=1000)
    rate: int = Field(ge=1)
    due_date: str | None = None


@router.get("/vendor/orders")
def vendor_orders(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role not in ("vendor", "admin", "deo", "taluka"):
        raise HTTPException(403)
    rows = session.exec(select(VendorOrder).order_by(VendorOrder.id.desc())).all()
    if user.role == "vendor":
        vendor = session.exec(select(User).where(User.officer_id == user.sub)).first()
        rows = [row for row in rows if vendor and row.vendor_id == vendor.id]
    if user.role == "taluka":
        rows = [row for row in rows if (school := session.get(School, row.school_id)) and school.taluka_id == user.taluka_id]
    if user.role == "deo":
        rows = [row for row in rows if (school := session.get(School, row.school_id)) and (taluka := session.get(Taluka, school.taluka_id)) and taluka.district_id == user.district_id]
    return {"items": [_order_dict(row, session) for row in rows], "total": len(rows)}


@router.post("/vendor/orders")
def create_vendor_order(
    body: VendorOrderCreate,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role not in ("admin", "deo", "taluka"):
        raise HTTPException(403, "Only officers can create purchase orders")
    school = session.get(School, body.school_id)
    if not school:
        raise HTTPException(404, "School not found")
    if user.role == "taluka" and school.taluka_id != user.taluka_id:
        raise HTTPException(403, "School is outside your taluka")
    if user.role == "deo":
        taluka = session.get(Taluka, school.taluka_id)
        if not taluka or taluka.district_id != user.district_id:
            raise HTTPException(403, "School is outside your district")
    vendor = session.get(User, body.vendor_id) if body.vendor_id else session.exec(select(User).where(User.role == "vendor").order_by(User.id)).first()
    if not vendor or vendor.role != "vendor":
        raise HTTPException(404, "Vendor not found")
    order = VendorOrder(po_code=f"PO-{datetime.utcnow():%y%m%d}-{secrets.token_hex(3).upper()}", vendor_id=vendor.id, school_id=school.id, qty=body.qty, rate=body.rate, due_date=body.due_date)
    session.add(order)
    session.flush()
    _audit(session, user, "vendor_order_created", "VendorOrder", str(order.id), {"po_code": order.po_code, "qty": order.qty, "school_id": order.school_id})
    session.add(Notification(recipient_id=vendor.officer_id, notif_type="vendor_order", title_en="New purchase order", title_gu="નવો ખરીદી ઓર્ડર", body=f"{order.po_code}: {order.qty} cycles for {school.name_en}."))
    session.commit()
    session.refresh(order)
    return _order_dict(order, session)


@router.post("/vendor/orders/{order_id}/{action}")
def update_vendor_order(
    order_id: int,
    action: str,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    order = session.get(VendorOrder, order_id)
    if not order:
        raise HTTPException(404, "Purchase order not found")
    vendor = session.get(User, order.vendor_id)
    if user.role == "vendor" and (not vendor or vendor.officer_id != user.sub):
        raise HTTPException(403, "Order is outside your vendor account")
    if action not in ("accept", "reject") or user.role not in ("vendor", "admin"):
        raise HTTPException(403, "Vendor or admin role required")
    if order.status != "open":
        raise HTTPException(409, "Only open purchase orders can be accepted or rejected")
    order.status = "accepted" if action == "accept" else "rejected"
    _audit(session, user, f"vendor_order_{action}", "VendorOrder", str(order.id), {"status": order.status})
    session.commit()
    return _order_dict(order, session)


class InvoiceCreate(BaseModel):
    po_id: int
    batch_id: int | None = None
    amount: int = Field(ge=1)


@router.get("/vendor/invoices")
def vendor_invoices(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role not in ("vendor", "admin", "deo"):
        raise HTTPException(403)
    rows = session.exec(select(Invoice).order_by(Invoice.id.desc())).all()
    if user.role == "vendor":
        vendor = session.exec(select(User).where(User.officer_id == user.sub)).first()
        rows = [row for row in rows if (order := session.get(VendorOrder, row.po_id)) and vendor and order.vendor_id == vendor.id]
    return {"items": [_invoice_dict(row) for row in rows], "total": len(rows)}


@router.post("/vendor/invoices")
def create_vendor_invoice(
    body: InvoiceCreate,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role != "vendor":
        raise HTTPException(403, "Vendor role required")
    vendor = session.exec(select(User).where(User.officer_id == user.sub)).first()
    order = session.get(VendorOrder, body.po_id)
    if not vendor or not order or order.vendor_id != vendor.id:
        raise HTTPException(404, "Purchase order not found")
    if order.status not in ("accepted", "delivered"):
        raise HTTPException(409, "Accept the purchase order before raising an invoice")
    if body.batch_id:
        batch = session.get(CycleBatch, body.batch_id)
        if not batch or batch.vendor_id != vendor.id:
            raise HTTPException(404, "Batch not found")
        if batch.status != "received":
            raise HTTPException(409, "Invoice can be raised after school receives the batch")
    invoice = Invoice(invoice_no=f"INV-{datetime.utcnow():%y%m%d}-{secrets.token_hex(3).upper()}", po_id=order.id, batch_id=body.batch_id, amount=body.amount)
    session.add(invoice)
    session.flush()
    _audit(session, user, "vendor_invoice_created", "Invoice", str(invoice.id), {"invoice_no": invoice.invoice_no, "amount": invoice.amount})
    session.commit()
    session.refresh(invoice)
    return _invoice_dict(invoice)


@router.post("/vendor/invoices/{invoice_id}/pay")
def pay_vendor_invoice(
    invoice_id: int,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role != "admin":
        raise HTTPException(403, "Admin role required")
    invoice = session.get(Invoice, invoice_id)
    if not invoice:
        raise HTTPException(404, "Invoice not found")
    if invoice.status == "paid":
        return _invoice_dict(invoice)
    invoice.status = "paid"
    invoice.paid_at = datetime.utcnow()
    invoice.utr = f"VPS{secrets.token_hex(6).upper()}"
    order = session.get(VendorOrder, invoice.po_id)
    vendor = session.get(User, order.vendor_id) if order else None
    if vendor:
        session.add(Notification(recipient_id=vendor.officer_id, notif_type="vendor_payment", title_en="Vendor invoice paid", title_gu="વેન્ડર ઇન્વૉઇસ ચૂકવાયું", body=f"Payment advice {invoice.invoice_no} is ready. UTR {invoice.utr}."))
    _audit(session, user, "vendor_invoice_paid", "Invoice", str(invoice.id), {"invoice_no": invoice.invoice_no, "utr": invoice.utr})
    session.commit()
    return _invoice_dict(invoice)


@router.get("/vendor/returns")
def vendor_returns(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role not in ("vendor", "admin", "school"):
        raise HTTPException(403)
    defects = session.exec(select(Defect).order_by(Defect.id.desc())).all()
    rows = []
    for defect in defects:
        cycle = session.get(Cycle, defect.cycle_id)
        batch = session.get(CycleBatch, cycle.batch_id) if cycle else None
        if user.role == "school" and (not batch or batch.school_id != user.school_id):
            continue
        if user.role == "vendor":
            vendor = session.exec(select(User).where(User.officer_id == user.sub)).first()
            if not batch or not vendor or batch.vendor_id != vendor.id:
                continue
        rows.append({"id": defect.id, "cycle_id": defect.cycle_id, "serial_no": cycle.serial_no if cycle else "", "reason": defect.reason, "photo": defect.photo, "status": defect.status, "replacement_batch": defect.replacement_batch})
    return {"items": rows, "total": len(rows)}


class DefectCreate(BaseModel):
    cycle_serial: str
    reason: str
    photo: str = ""


@router.post("/vendor/returns")
def create_vendor_return(
    body: DefectCreate,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role not in ("vendor", "school", "admin"):
        raise HTTPException(403)
    cycle = session.exec(select(Cycle).where(Cycle.serial_no == body.cycle_serial)).first()
    if not cycle:
        raise HTTPException(404, "Cycle not found")
    batch = session.get(CycleBatch, cycle.batch_id)
    if user.role == "school" and (not batch or batch.school_id != user.school_id):
        raise HTTPException(403, "Cycle is outside your school scope")
    if user.role == "vendor":
        vendor = session.exec(select(User).where(User.officer_id == user.sub)).first()
        if not vendor or not batch or vendor.id != batch.vendor_id:
            raise HTTPException(403, "Cycle is outside your vendor scope")
    defect = Defect(cycle_id=cycle.id, reason=body.reason[:500], photo=body.photo[:300])
    session.add(defect)
    session.flush()
    _audit(session, user, "cycle_defect_reported", "Defect", str(defect.id), {"cycle_serial": cycle.serial_no, "reason": defect.reason})
    session.commit()
    return {"id": defect.id, "cycle_serial": cycle.serial_no, "status": defect.status}


class BudgetAllocationInput(BaseModel):
    scheme_id: int
    level: str = Field(pattern="^(state|district|taluka|school)$")
    entity_id: int
    amount: int = Field(gt=0)
    fy: str


@router.get("/funds/allocations")
def list_allocations(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role not in ("admin", "deo", "taluka"):
        raise HTTPException(403)
    rows = session.exec(select(BudgetAllocation).order_by(BudgetAllocation.id.desc())).all()
    if user.role == "deo":
        rows = [row for row in rows if row.level == "district" and row.entity_id == (user.district_id or 0)]
    if user.role == "taluka":
        rows = [row for row in rows if row.level == "taluka" and row.entity_id == (user.taluka_id or 0)]
    return {"items": [{"id": row.id, "scheme_id": row.scheme_id, "level": row.level, "entity_id": row.entity_id, "amount": row.amount, "released": row.released, "fy": row.fy} for row in rows], "total": len(rows)}


@router.post("/funds/allocate")
def allocate_funds(
    body: BudgetAllocationInput,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role != "admin":
        raise HTTPException(403, "Admin role required")
    scheme = session.get(Scheme, body.scheme_id)
    if not scheme:
        raise HTTPException(404, "Scheme not found")
    allocation = BudgetAllocation(scheme_id=body.scheme_id, level=body.level, entity_id=body.entity_id, amount=body.amount, released=body.amount, fy=body.fy)
    session.add(allocation)
    session.flush()
    _audit(session, user, "budget_allocated", "BudgetAllocation", str(allocation.id), body.model_dump())
    if body.level == "district":
        for officer in session.exec(select(User).where(User.role == "deo", User.district_id == body.entity_id)).all():
            session.add(Notification(recipient_id=officer.officer_id, notif_type="budget", title_en="Budget allocation released", title_gu="બજેટ ફાળવણી જાહેર થઈ", body=f"{scheme.name_en}: ₹{body.amount:,} for FY {body.fy}."))
    session.commit()
    return {"id": allocation.id, "scheme_id": allocation.scheme_id, "level": allocation.level, "entity_id": allocation.entity_id, "amount": allocation.amount, "released": allocation.released, "fy": allocation.fy}


@router.get("/admin/users")
def list_admin_users(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role != "admin":
        raise HTTPException(403)
    users = session.exec(select(User).order_by(User.role, User.officer_id)).all()
    return {"items": [{"id": row.id, "officer_id": row.officer_id, "name": row.name, "role": row.role, "school_id": row.school_id, "taluka_id": row.taluka_id, "district_id": row.district_id, "is_active": row.is_active} for row in users], "total": len(users)}


@router.patch("/admin/users/{user_id}")
def set_admin_user_active(
    user_id: int,
    body: dict,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role != "admin":
        raise HTTPException(403)
    target = session.get(User, user_id)
    if not target:
        raise HTTPException(404, "Officer not found")
    target.is_active = bool(body.get("is_active"))
    _audit(session, user, "officer_access_updated", "User", str(target.id), {"is_active": target.is_active})
    session.commit()
    return {"id": target.id, "officer_id": target.officer_id, "is_active": target.is_active}


@router.patch("/admin/schemes/{scheme_id}/active")
def set_scheme_active(
    scheme_id: int,
    body: dict,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role != "admin":
        raise HTTPException(403)
    scheme = session.get(Scheme, scheme_id)
    if not scheme:
        raise HTTPException(404, "Scheme not found")
    before = scheme.active
    scheme.active = bool(body.get("active"))
    scheme.version += 1
    _audit(session, user, "scheme_activation_updated", "Scheme", str(scheme.id), {"before": before, "active": scheme.active, "version": scheme.version})
    session.commit()
    return {"id": scheme.id, "active": scheme.active, "version": scheme.version}


def _order_dict(order: VendorOrder, session: Session) -> dict:
    school = session.get(School, order.school_id)
    return {"id": order.id, "po_code": order.po_code, "vendor_id": order.vendor_id, "school_id": order.school_id, "school_name": school.name_en if school else "", "qty": order.qty, "rate": order.rate, "amount": order.qty * order.rate, "status": order.status, "due_date": order.due_date, "created_at": order.created_at.isoformat()}


def _invoice_dict(invoice: Invoice) -> dict:
    return {"id": invoice.id, "invoice_no": invoice.invoice_no, "po_id": invoice.po_id, "batch_id": invoice.batch_id, "amount": invoice.amount, "status": invoice.status, "paid_at": invoice.paid_at.isoformat() if invoice.paid_at else None, "utr": invoice.utr}
