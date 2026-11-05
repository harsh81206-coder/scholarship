"""app/ml/registry.py — Lazy ML artifact loader with rule fallback."""

from __future__ import annotations
import os
import logging
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)

try:
    import joblib
except ImportError:
    joblib = None


class ModelRegistry:
    """Lazy model loader that caches joblib artifacts and falls back safely."""

    def __init__(self, artifacts_dir: Path | str | None = None) -> None:
        self._cache: dict[str, Any] = {}
        if artifacts_dir:
            self.artifacts_dir = Path(artifacts_dir)
        else:
            env_dir = os.getenv("ARTIFACTS_DIR")
            candidate_dirs = [
                Path(env_dir) if env_dir else None,
                Path("/artifacts"),
                Path(__file__).resolve().parents[2] / "artifacts",
                Path(__file__).resolve().parents[1] / "artifacts",
                Path("./artifacts"),
            ]
            self.artifacts_dir = next(
                (d for d in candidate_dirs if d and d.is_dir()), Path("/artifacts")
            )

    def load(self, name: str) -> Any | None:
        """Loads a model artifact by name. Returns None on missing or error."""
        if name in self._cache:
            return self._cache[name]

        if joblib is None:
            return None

        candidates = [name]
        if not (name.endswith(".joblib") or name.endswith(".pkl")):
            candidates.extend([f"{name}.joblib", f"{name}.pkl"])

        target_path: Path | None = None
        for cand in candidates:
            p = self.artifacts_dir / cand
            if p.is_file():
                target_path = p
                break

        if not target_path:
            return None

        try:
            model = joblib.load(target_path)
            self._cache[name] = model
            return model
        except Exception as exc:
            logger.warning(
                "Failed to load model %s from %s: %s", name, target_path, exc
            )
            return None

    def get_fraud_model(self) -> Any | None:
        """Returns loaded IsolationForest model or None if missing."""
        return self.load("fraud_model") or self.load("fraud_isolation_forest")

    def get_dropout_model(self) -> Any | None:
        """Returns loaded LogisticRegression model or None if missing."""
        return self.load("dropout_model") or self.load("dropout_logistic_regression")

    def get_forecast_model(self) -> dict[str, Any] | None:
        """Returns linear coefficient dict or None if missing."""
        model = self.load("forecast_model") or self.load("forecast_coefficients")
        if isinstance(model, dict):
            return model
        return None


# Global singleton instance
registry = ModelRegistry()
