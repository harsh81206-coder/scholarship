from __future__ import annotations

import json
from pathlib import Path

from ml_train.train_dropout import train as train_dropout
from ml_train.train_fraud import train as train_fraud
from ml_train.train_forecast import train as train_forecast


if __name__ == "__main__":
    metrics = {
        "dropout": train_dropout(),
        "fraud": train_fraud(),
        "forecast": train_forecast(),
    }
    output = Path(__file__).resolve().parents[1] / "artifacts" / "metrics.json"
    output.write_text(json.dumps(metrics, indent=2) + "\n")
    print(json.dumps(metrics, indent=2))
