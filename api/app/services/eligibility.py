"""app/services/eligibility.py — B3: Rule engine + stacking optimizer."""

from __future__ import annotations
import json
from sqlmodel import Session, select
from app.models.core import (
    Student,
    AcademicRecord,
    Family,
    Document,
    Scheme,
    EligibilityResult,
)

CURRENT_YEAR = "2026-27"


# ── Student context builder ───────────────────────────────────────────────────
def _build_context(student: Student, session: Session) -> dict:
    ctx: dict = {
        "gender": student.gender,
        "grade": student.grade,
        "stream": student.stream,
        "caste_category": student.caste_category,
        "distance_km": student.distance_km,
        "school_type": student.school.school_type if student.school else "Govt",
    }
    # Latest academic record
    records = session.exec(
        select(AcademicRecord)
        .where(AcademicRecord.student_id == student.id)
        .order_by(AcademicRecord.year.desc())  # type: ignore[arg-type]
    ).all()
    if records:
        ctx["attendance_pct"] = records[0].attendance_pct
        ctx["marks_pct"] = records[0].marks_pct
    else:
        ctx["attendance_pct"] = 0.0
        ctx["marks_pct"] = 0.0

    # Family income
    family = session.exec(select(Family).where(Family.student_id == student.id)).first()
    ctx["annual_income"] = family.annual_income if family else 999999

    # Document presence
    docs = session.exec(select(Document).where(Document.student_id == student.id)).all()
    for d in docs:
        ctx[f"has_doc:{d.doc_type}"] = d.status == "verified"
    return ctx


# ── Rule evaluation ───────────────────────────────────────────────────────────
def _eval_rule(rule: dict, ctx: dict) -> tuple[bool, dict]:
    field = rule["field"]
    op = rule["op"]
    expected = rule["value"]
    actual = ctx.get(field)

    if actual is None:
        return False, {
            "field": field,
            "op": op,
            "expected": expected,
            "actual": None,
            "passed": False,
            "gap": None,
            "fix_hint_en": "Data not available",
            "fix_hint_gu": "માહિતી ઉપલબ્ધ નથી",
            "fix_hint_hi": "जानकारी उपलब्ध नहीं है",
        }

    passed = False
    gap = None
    fix_hint_en = ""
    fix_hint_gu = ""
    fix_hint_hi = ""

    if op == "==":
        passed = actual == expected
    elif op == "!=":
        passed = actual != expected
    elif op == ">=":
        passed = actual >= expected
    elif op == "<=":
        passed = actual <= expected
    elif op == ">":
        passed = actual > expected
    elif op == "<":
        passed = actual < expected
    elif op == "in":
        passed = actual in expected
    elif op == "not_in":
        passed = actual not in expected
    elif op == "between":
        passed = expected[0] <= actual <= expected[1]

    if not passed and op in (">=", ">") and isinstance(actual, (int, float)):
        gap = round(expected - actual, 2)
        if field == "attendance_pct" and gap:
            days_needed = round(gap * 200 / 100)
            fix_hint_en = f"Attendance {actual}%, need {expected}%. Attend {days_needed} more days."
            fix_hint_gu = f"હાજરી {actual}%, {expected}% જોઈએ. {days_needed} વધુ દિવસ."
            fix_hint_hi = f"उपस्थिति {actual}% है, {expected}% चाहिए। {days_needed} दिन और उपस्थित रहें।"
        elif field == "marks_pct" and gap:
            fix_hint_en = f"Marks {actual}%, need {expected}%."
            fix_hint_gu = f"ગુણ {actual}% છે, {expected}% જરૂરી છે."
            fix_hint_hi = f"अंक {actual}% हैं, {expected}% आवश्यक हैं।"
        elif field == "annual_income":
            fix_hint_en = f"Income ₹{actual:,}, limit is ₹{expected:,}."
            fix_hint_gu = f"આવક ₹{actual:,} છે, મર્યાદા ₹{expected:,} છે."
            fix_hint_hi = f"आय ₹{actual:,} है, सीमा ₹{expected:,} है।"

    return passed, {
        "field": field,
        "op": op,
        "expected": expected,
        "actual": actual,
        "passed": passed,
        "gap": gap,
        "fix_hint_en": fix_hint_en,
        "fix_hint_gu": fix_hint_gu,
        "fix_hint_hi": fix_hint_hi,
    }


def _check_required_docs(scheme: Scheme, ctx: dict) -> list[str]:
    required = json.loads(scheme.required_docs_json or "[]")
    return [d for d in required if not ctx.get(f"has_doc:{d}", False)]


# ── Main evaluate ─────────────────────────────────────────────────────────────
def evaluate(student_id: int, scheme: Scheme, session: Session) -> dict:
    student = session.get(Student, student_id)
    if not student:
        return {"status": "not_applicable", "reasons": []}

    ctx = _build_context(student, session)
    rules = json.loads(scheme.rules_json or "{}")
    reasons = []
    all_passed = True

    for rule in rules.get("all", []):
        passed, detail = _eval_rule(rule, ctx)
        reasons.append(detail)
        if not passed:
            all_passed = False

    any_rules = rules.get("any", [])
    if any_rules:
        any_passed = any(_eval_rule(r, ctx)[0] for r in any_rules)
        for rule in any_rules:
            _, detail = _eval_rule(rule, ctx)
            reasons.append(detail)
        if not any_passed:
            all_passed = False

    missing_docs = _check_required_docs(scheme, ctx)
    if missing_docs:
        return {
            "status": "pending_docs",
            "reasons": reasons,
            "missing_docs": missing_docs,
        }
    if all_passed:
        return {"status": "eligible", "reasons": reasons, "missing_docs": []}
    return {"status": "ineligible", "reasons": reasons, "missing_docs": []}


def store_result(
    student_id: int,
    scheme: Scheme,
    result: dict,
    session: Session,
    academic_year: str = CURRENT_YEAR,
) -> EligibilityResult:
    row = session.exec(
        select(EligibilityResult)
        .where(
            EligibilityResult.student_id == student_id,
            EligibilityResult.scheme_id == scheme.id,
            EligibilityResult.academic_year == academic_year,
        )
        .order_by(EligibilityResult.id.desc())
    ).first()
    if not row:
        row = EligibilityResult(
            student_id=student_id,
            scheme_id=scheme.id,  # type: ignore[arg-type]
            academic_year=academic_year,
        )
        session.add(row)
    row.status = result["status"]
    row.reasons_json = json.dumps(result.get("reasons", []), ensure_ascii=False)
    row.scheme_version = scheme.version
    return row


# ── Evaluate all schemes ──────────────────────────────────────────────────────
def evaluate_all_schemes(student_id: int, session: Session) -> list[dict]:
    schemes = session.exec(select(Scheme).where(Scheme.active.is_(True))).all()
    results = []
    for scheme in schemes:
        payout = json.loads(scheme.payout_json or "{}")
        amount = payout.get("amount", 0)
        res = evaluate(student_id, scheme, session)
        results.append(
            {
                "scheme_code": scheme.code,
                "scheme_name_en": scheme.name_en,
                "scheme_name_gu": scheme.name_gu,
                "scheme_type": scheme.scheme_type,
                "amount": amount,
                "status": res["status"],
                "reasons": res.get("reasons", []),
                "missing_docs": res.get("missing_docs", []),
                "scheme_version": scheme.version,
                "mutually_exclusive_with": json.loads(
                    scheme.mutually_exclusive_with_json or "[]"
                ),
            }
        )
    return sorted(results, key=lambda x: (x["status"] != "eligible", x["status"]))


# ── Stacking optimizer ────────────────────────────────────────────────────────
def stacking_optimizer(eligible_results: list[dict]) -> dict:
    """Greedy: pick best combo respecting mutual exclusion."""
    selected = []
    excluded: list[dict[str, str]] = []
    total = 0
    for r in sorted(eligible_results, key=lambda x: -x.get("amount", 0)):
        if r["status"] != "eligible":
            continue
        code = r["scheme_code"]
        conflict = next(
            (
                item["scheme_code"]
                for item in selected
                if code in item.get("mutually_exclusive_with", [])
                or item["scheme_code"] in r.get("mutually_exclusive_with", [])
            ),
            None,
        )
        if conflict:
            excluded.append(
                {
                    "scheme_code": code,
                    "conflicts_with": conflict,
                    "reason": "mutually_exclusive",
                }
            )
            continue
        selected.append(r)
        total += r.get("amount", 0)
    return {"selected": selected, "total_benefit": total, "excluded": excluded}
