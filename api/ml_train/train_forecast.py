from __future__ import annotations

import json
from pathlib import Path

import joblib
import numpy as np
from sklearn.linear_model import LinearRegression

from ml_train.seeded_data import forecast_rows

ROOT = Path(__file__).resolve().parents[1]


def train() -> dict:
    dataset = forecast_rows()
    source = "seeded_demo_cycle_allocations" if dataset is not None else "synthetic_fallback"
    if dataset is None:
        rng = np.random.default_rng(44)
        grade8_girls = rng.integers(10, 1200, 400)
        historic_uptake = rng.uniform(0.62, 0.94, 400)
        x = np.column_stack([grade8_girls, historic_uptake])
        y = grade8_girls * historic_uptake + rng.normal(0, 8, 400)
    else:
        x, y = dataset
    model = LinearRegression().fit(x, y)
    metrics = {
        "samples": len(y),
        "source": source,
        "r2": round(float(model.score(x, y)), 4),
    }
    (ROOT / "artifacts").mkdir(exist_ok=True)
    joblib.dump(
        {
            "coef": model.coef_.tolist(),
            "intercept": float(model.intercept_),
            "metrics": metrics,
        },
        ROOT / "artifacts" / "forecast_model.joblib",
    )
    return metrics


if __name__ == "__main__":
    print(json.dumps(train(), indent=2))
