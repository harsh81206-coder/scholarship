from __future__ import annotations

import json
from pathlib import Path

import joblib
from sklearn.ensemble import IsolationForest

from ml_train.gen_synthetic import gen_fraud
from ml_train.seeded_data import fraud_rows

ROOT = Path(__file__).resolve().parents[1]


def train() -> dict:
    dataset = fraud_rows()
    source = "seeded_demo_applications" if dataset is not None else "synthetic_fallback"
    x = dataset if dataset is not None else gen_fraud()
    model = IsolationForest(n_estimators=150, contamination=0.04, random_state=43)
    model.fit(x)
    inlier_rate = float((model.predict(x) == 1).mean())
    (ROOT / "artifacts").mkdir(exist_ok=True)
    joblib.dump(model, ROOT / "artifacts" / "fraud_model.joblib")
    return {
        "samples": len(x),
        "source": source,
        "expected_anomaly_rate": round(1 - inlier_rate, 4),
    }


if __name__ == "__main__":
    print(json.dumps(train(), indent=2))
