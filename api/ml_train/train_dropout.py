from __future__ import annotations

import json
from pathlib import Path

import joblib
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

from ml_train.gen_synthetic import gen_dropout
from ml_train.seeded_data import dropout_rows

ROOT = Path(__file__).resolve().parents[1]


def train() -> dict:
    dataset = dropout_rows()
    source = "seeded_demo_proxy_labels" if dataset is not None else "synthetic_fallback"
    x, y = dataset if dataset is not None else gen_dropout()
    x_train, x_test, y_train, y_test = train_test_split(
        x, y, test_size=0.2, random_state=42, stratify=y
    )
    model = make_pipeline(
        StandardScaler(),
        LogisticRegression(max_iter=1000, class_weight="balanced", random_state=42),
    )
    model.fit(x_train, y_train)
    probabilities = model.predict_proba(x_test)[:, 1]
    predictions = (probabilities >= 0.5).astype(int)
    metrics = {
        "samples": int(len(y)),
        "source": source,
        "proxy_positive_labels": int(y.sum()) if dataset is not None else None,
        "auc": round(float(roc_auc_score(y_test, probabilities)), 4),
        "accuracy": round(float(accuracy_score(y_test, predictions)), 4),
        "precision": round(
            float(precision_score(y_test, predictions, zero_division=0)), 4
        ),
        "recall": round(float(recall_score(y_test, predictions, zero_division=0)), 4),
    }
    (ROOT / "artifacts").mkdir(exist_ok=True)
    joblib.dump(model, ROOT / "artifacts" / "dropout_model.joblib")
    return metrics


if __name__ == "__main__":
    print(json.dumps(train(), indent=2))
