"""Offline demand and budget forecasts with a safe statistical fallback."""

from __future__ import annotations

import json

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.db import get_session
from app.deps import CurrentUser, get_current_user
from app.models.core import Application, Scheme, School, Student
from app.ml.registry import registry

router = APIRouter(prefix="/ml/forecast", tags=["forecast"])


def _check_role(user: CurrentUser) -> None:
    if user.role not in ("deo", "admin", "taluka"):
        raise HTTPException(403, "Officer role required")


@router.get("/cycles")
def cycle_forecast(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    _check_role(user)
    schools = session.exec(select(School)).all()
    students = session.exec(select(Student)).all()
    model = registry.get_forecast_model()
    coef = model.get("coef", [0.85, 0]) if model else [0.85, 0]
    intercept = model.get("intercept", 0) if model else 0
    items = []
    for school in schools:
        count = sum(
            s.school_id == school.id and s.gender == "female" and s.grade == 9
            for s in students
        )
        historical_uptake = 0.82
        predicted = max(
            0, round(intercept + count * coef[0] + historical_uptake * coef[1])
        )
        items.append(
            {
                "school_id": school.id,
                "school_name": school.name_en,
                "grade8_girls": count,
                "uptake_rate": historical_uptake,
                "forecast_cycles": predicted,
            }
        )
    return {
        "year": 2027,
        "model": "trained_linear" if model else "rule_fallback",
        "items": items,
        "total_forecast": sum(item["forecast_cycles"] for item in items),
    }


@router.get("/budget")
def budget_forecast(
    user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    _check_role(user)
    schemes = session.exec(select(Scheme).where(Scheme.active.is_(True))).all()
    applications = session.exec(select(Application)).all()
    items = []
    for scheme in schemes:
        payout = json.loads(scheme.payout_json or "{}")
        amount = int(payout.get("amount", 0))
        count = sum(
            app.scheme_id == scheme.id
            and app.status not in ("rejected", "correction_requested")
            for app in applications
        )
        estimate = max(count, round(count * 1.12))
        items.append(
            {
                "scheme_code": scheme.code,
                "scheme_name": scheme.name_en,
                "current_applications": count,
                "forecast_beneficiaries": estimate,
                "average_benefit": amount,
                "forecast_budget": estimate * amount,
            }
        )
    return {
        "items": items,
        "total_forecast_budget": sum(row["forecast_budget"] for row in items),
    }
