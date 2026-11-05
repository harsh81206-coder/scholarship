from __future__ import annotations

import json
from pathlib import Path

import joblib
from sklearn.ensemble import IsolationForest

from ml_train.gen_synthetic import gen_fraud

ROOT = Path(__file__).resolve().parents[1]


def train() -> dict:
    x = gen_fraud()
    model = IsolationForest(n_estimators=150, contamination=0.04, random_state=43)
    model.fit(x)
    inlier_rate = float((model.predict(x) == 1).mean())
    (ROOT / "artifacts").mkdir(exist_ok=True)
    joblib.dump(model, ROOT / "artifacts" / "fraud_model.joblib")
    return {"samples": len(x), "expected_anomaly_rate": round(1 - inlier_rate, 4)}


if __name__ == "__main__":
    print(json.dumps(train(), indent=2))
