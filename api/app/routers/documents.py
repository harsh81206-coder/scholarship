"""app/routers/documents.py — B5: Document vault + mock OCR."""

from __future__ import annotations
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlmodel import Session, select
from pathlib import Path
import json
import hashlib
import secrets
from app.db import get_session
from app.deps import get_current_user, CurrentUser
from app.models.core import Student, Document
from app.config import get_settings

router = APIRouter(prefix="/documents", tags=["documents"])
settings = get_settings()

# Mock OCR — deterministic per doc_type
MOCK_OCR: dict[str, dict] = {
    "aadhaar": {
        "name": "Riya Hasmukhbhai Patel",
        "dob": "2009-08-15",
        "gender": "F",
        "uid_last4": "8912",
    },
    "income": {
        "holder_name": "Hasmukh Patel",
        "annual_income": 96000,
        "cert_no": "REV/AND/2026/049182",
        "issuing_authority": "Mamlatdar Anand",
    },
    "caste": {
        "category": "OBC",
        "cert_no": "CST/GUJ/2024/99102",
        "valid_upto": "2029-12-31",
    },
    "marksheet": {
        "student_name": "Riya Patel",
        "class": 8,
        "marks_pct": 79.0,
        "result": "PASS",
        "board": "GSEB",
    },
}


def _mock_authenticity(doc_type: str) -> dict:
    return {
        "qr_valid": True,
        "seal_detected": True,
        "ela_tamper_score": round(
            0.02 + 0.03 * (hashlib.sha256(doc_type.encode()).digest()[0] % 10), 3
        ),
        "name_match": True,
        "expiry_ok": True,
        "overall": "genuine",
    }


@router.post("")
async def upload_document(
    doc_type: str = Form(...),
    file: UploadFile = File(...),
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role != "student":
        raise HTTPException(403, "Only students can upload documents")
    if doc_type not in MOCK_OCR:
        raise HTTPException(400, "Unsupported document type")
    # Validate file type
    if file.content_type not in ("image/jpeg", "image/png", "application/pdf"):
        raise HTTPException(400, "Only JPEG/PNG/PDF accepted")
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(400, "File too large (max 10MB)")

    student = session.exec(select(Student).where(Student.cts_id == user.sub)).first()
    if not student:
        raise HTTPException(404, "Student not found")

    # Save file
    upload_dir = Path(settings.data_dir) / "uploads" / str(student.id)
    upload_dir.mkdir(parents=True, exist_ok=True)
    suffix = Path(file.filename or "upload").suffix.lower()
    fname = f"{doc_type}_{secrets.token_hex(12)}{suffix}"
    fpath = upload_dir / fname
    fpath.write_bytes(content)

    # Mock OCR
    ocr_fields = MOCK_OCR.get(doc_type, {})
    authenticity = _mock_authenticity(doc_type)
    confidence = 0.85 + 0.1 * (len(ocr_fields) > 2)

    # Upsert document
    existing = session.exec(
        select(Document).where(
            Document.student_id == student.id, Document.doc_type == doc_type
        )
    ).first()
    if existing:
        existing.file_path = str(fpath)
        existing.extracted_json = json.dumps(ocr_fields)
        existing.authenticity_json = json.dumps(authenticity)
        existing.confidence = confidence
        existing.status = "pending"
        existing.source = "upload"
        doc = existing
    else:
        doc = Document(
            student_id=student.id,
            doc_type=doc_type,
            file_path=str(fpath),
            extracted_json=json.dumps(ocr_fields),
            authenticity_json=json.dumps(authenticity),
            confidence=confidence,
            status="pending",
            source="upload",
        )
        session.add(doc)
    session.commit()
    session.refresh(doc)
    return {
        "id": doc.id,
        "doc_type": doc_type,
        "status": doc.status,
        "ocr_fields": ocr_fields,
        "confidence": confidence,
        "authenticity": authenticity,
    }


@router.get("")
def list_documents(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role != "student":
        raise HTTPException(403)
    student = session.exec(select(Student).where(Student.cts_id == user.sub)).first()
    if not student:
        raise HTTPException(404)
    docs = session.exec(select(Document).where(Document.student_id == student.id)).all()
    return [
        {
            "id": d.id,
            "doc_type": d.doc_type,
            "status": d.status,
            "confidence": d.confidence,
            "source": d.source,
            "doc_number": d.doc_number,
            "uploaded_at": d.uploaded_at.isoformat(),
        }
        for d in docs
    ]


@router.get("/{doc_id}")
def get_document(
    doc_id: int,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    doc = session.get(Document, doc_id)
    if not doc:
        raise HTTPException(404)
    student = session.get(Student, doc.student_id)
    if user.role == "student" and (not student or student.cts_id != user.sub):
        raise HTTPException(403, "Document is outside your account")
    if user.role == "school" and (not student or student.school_id != user.school_id):
        raise HTTPException(403, "Document is outside your school scope")
    if user.role not in ("student", "school", "taluka", "deo", "admin"):
        raise HTTPException(403)
    return {
        "id": doc.id,
        "doc_type": doc.doc_type,
        "status": doc.status,
        "ocr_fields": json.loads(doc.extracted_json) if doc.extracted_json else {},
        "authenticity": json.loads(doc.authenticity_json)
        if doc.authenticity_json
        else {},
        "confidence": doc.confidence,
        "source": doc.source,
    }


@router.post("/{doc_id}/verify")
def verify_document(
    doc_id: int,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role not in ("school", "taluka", "deo", "admin"):
        raise HTTPException(403)
    doc = session.get(Document, doc_id)
    if not doc:
        raise HTTPException(404)
    student = session.get(Student, doc.student_id)
    if user.role == "school" and (not student or student.school_id != user.school_id):
        raise HTTPException(403, "Document is outside your school scope")
    doc.status = "verified"
    session.commit()
    return {"success": True, "doc_id": doc_id, "status": "verified"}


@router.delete("/{doc_id}")
def delete_document(
    doc_id: int,
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if user.role != "student":
        raise HTTPException(403, "Only students can delete their documents")
    student = session.exec(select(Student).where(Student.cts_id == user.sub)).first()
    doc = session.get(Document, doc_id)
    if not student or not doc or doc.student_id != student.id:
        raise HTTPException(404, "Document not found")
    if doc.file_path:
        Path(doc.file_path).unlink(missing_ok=True)
    session.delete(doc)
    session.commit()
    return {"success": True, "deleted_id": doc_id}


@router.post("/fetch-digilocker")
def fetch_digilocker(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Mock DigiLocker — returns pre-verified docs."""
    if user.role != "student":
        raise HTTPException(403)
    student = session.exec(select(Student).where(Student.cts_id == user.sub)).first()
    if not student:
        raise HTTPException(404)
    fetched = []
    for doc_type in ["aadhaar", "caste"]:
        existing = session.exec(
            select(Document).where(
                Document.student_id == student.id, Document.doc_type == doc_type
            )
        ).first()
        if not existing:
            doc = Document(
                student_id=student.id,
                doc_type=doc_type,
                source="digilocker",
                status="verified",
                confidence=0.99,
                extracted_json=json.dumps(MOCK_OCR.get(doc_type, {})),
                authenticity_json=json.dumps(_mock_authenticity(doc_type)),
            )
            session.add(doc)
            fetched.append(doc_type)
    session.commit()
    return {"fetched": fetched, "source": "digilocker"}
