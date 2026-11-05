"""Deterministic synthetic student risk data (no real student records)."""

from __future__ import annotations

import numpy as np


FEATURE_NAMES = [
    "attendance_pct",
    "attendance_trend",
    "marks_pct",
    "marks_trend",
    "annual_income",
    "distance_km",
    "gender_enc",
    "caste_enc",
    "grade",
    "is_rural",
    "benefit_received",
    "grievance_count",
    "bicycle_delivered",
]


def gen_dropout(n: int = 5000, seed: int = 42) -> tuple[np.ndarray, np.ndarray]:
    rng = np.random.default_rng(seed)
    attendance = rng.uniform(45, 100, n)
    attendance_trend = rng.normal(0, 5, n)
    marks = rng.uniform(30, 100, n)
    marks_trend = rng.normal(0, 7, n)
    income = rng.integers(40000, 500001, n)
    distance = rng.uniform(0.2, 25, n)
    gender = rng.choice([0.0, 1.0, 0.5], n, p=[0.54, 0.45, 0.01])
    caste = rng.choice([0.0, 1.0, 2.0, 3.0], n, p=[0.2, 0.5, 0.2, 0.1])
    grade = rng.integers(8, 13, n)
    rural = (distance > 3).astype(float)
    benefit = rng.binomial(1, 0.55, n).astype(float)
    grievance = rng.poisson(0.25, n)
    bicycle = rng.binomial(1, 0.25, n).astype(float)
    x = np.column_stack(
        [
            attendance,
            attendance_trend,
            marks,
            marks_trend,
            income,
            distance,
            gender,
            caste,
            grade,
            rural,
            benefit,
            grievance,
            bicycle,
        ]
    )
    # Documented noisy label: academic disengagement is the main signal;
    # poverty/distance and transition grade add risk, with 8% label noise.
    logit = (
        -1.7
        + (75 - attendance) * 0.045
        + (50 - marks) * 0.035
        - attendance_trend * 0.025
        - marks_trend * 0.018
        + (distance > 5) * 0.55
        + (income < 100000) * 0.35
        + (grade == 9) * 0.35
        + grievance * 0.22
        - benefit * 0.28
        - bicycle * 0.15
    )
    probability = 1 / (1 + np.exp(-logit))
    labels = rng.binomial(1, probability)
    noise = rng.random(n) < 0.08
    labels[noise] = 1 - labels[noise]
    return x, labels


def gen_fraud(n: int = 3000, seed: int = 43) -> np.ndarray:
    rng = np.random.default_rng(seed)
    amount = np.clip(rng.lognormal(9.2, 0.8, n), 0, 100000)
    grade = rng.integers(8, 13, n)
    distance = rng.uniform(0.2, 25, n)
    return np.column_stack([amount, grade, distance])
