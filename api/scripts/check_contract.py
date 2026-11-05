"""Verify the 33 UI route files and declared API paths against OpenAPI."""

from __future__ import annotations

from pathlib import Path

from fastapi.testclient import TestClient

from app.main import app

ROOT = Path(__file__).resolve().parents[2]
SCREENS: dict[str, tuple[str, tuple[str, ...]]] = {
    "P1": ("web/app/page.tsx", ()),
    "P2": ("web/app/login/page.tsx", ("/auth/otp/send",)),
    "P3": ("web/app/login/verify/page.tsx", ("/auth/otp/verify",)),
    "S1": (
        "web/app/student/page.tsx",
        ("/students/me", "/students/me/schemes", "/applications", "/notifications"),
    ),
    "S2": (
        "web/app/student/schemes/[id]/page.tsx",
        (
            "/students/me/schemes",
            "/eligibility/explain/{scheme_code}",
            "/ai/explain/{scheme_code}",
        ),
    ),
    "S3": (
        "web/app/student/vault/page.tsx",
        ("/documents", "/documents/fetch-digilocker"),
    ),
    "S4": ("web/app/student/vault/upload/page.tsx", ("/documents",)),
    "S5": ("web/app/student/apply/page.tsx", ("/applications/bulk",)),
    "S6": (
        "web/app/student/applications/page.tsx",
        ("/applications", "/applications/{app_code}/timeline"),
    ),
    "S7": (
        "web/app/student/cycle/page.tsx",
        ("/students/me/cycle", "/handover/initiate", "/handover/confirm"),
    ),
    "S8": (
        "web/app/student/payments/page.tsx",
        ("/students/me/payments", "/dbt/receipt/{txn_id}"),
    ),
    "S9": ("web/app/student/grievances/page.tsx", ("/grievances", "/grievances/me")),
    "S10": (
        "web/app/student/notifications/page.tsx",
        ("/notifications", "/notifications/read-all"),
    ),
    "S11": (
        "web/app/student/profile/page.tsx",
        ("/students/me", "/students/me/consents", "/students/me/data-export"),
    ),
    "S12": ("web/app/student/assistant/page.tsx", ("/ai/chat",)),
    "SC1": ("web/app/school/page.tsx", ("/analytics/school",)),
    "SC2": (
        "web/app/school/queue/page.tsx",
        ("/applications", "/applications/bulk-approve"),
    ),
    "SC3": (
        "web/app/school/queue/[id]/page.tsx",
        (
            "/applications/{app_code}",
            "/applications/{app_code}/approve",
            "/applications/{app_code}/reject",
        ),
    ),
    "SC4": (
        "web/app/school/records/page.tsx",
        ("/records/{record_type}/upload", "/records/{record_type}/confirm"),
    ),
    "SC5": (
        "web/app/school/cycles/page.tsx",
        ("/batches/{batch_id}/receive", "/handover/initiate", "/handover/confirm"),
    ),
    "SC6": ("web/app/school/reports/page.tsx", ("/analytics/school/reports",)),
    "D1": ("web/app/deo/page.tsx", ("/analytics/district",)),
    "D2": (
        "web/app/deo/approvals/page.tsx",
        (
            "/applications",
            "/applications/bulk-approve",
            "/delegations",
            "/delegations/me",
        ),
    ),
    "D3": ("web/app/deo/cycles/page.tsx", ("/cycles/overview", "/ml/forecast/cycles")),
    "D4": (
        "web/app/deo/at-risk/page.tsx",
        ("/ml/dropout/students", "/ml/dropout/students/{cts_id}"),
    ),
    "D5": (
        "web/app/deo/grievances/page.tsx",
        ("/grievances", "/grievances/{grv_code}"),
    ),
    "A1": ("web/app/admin/page.tsx", ("/analytics/state",)),
    "A2": (
        "web/app/admin/schemes/builder/page.tsx",
        ("/admin/schemes", "/admin/schemes/{scheme_id}/rules", "/eligibility/test"),
    ),
    "A3": (
        "web/app/admin/funds/page.tsx",
        ("/funds/overview", "/dbt/reconciliation", "/dbt/{txn_id}/retry"),
    ),
    "A4": (
        "web/app/admin/fraud/page.tsx",
        ("/fraud/flags", "/fraud/flags/{id}", "/fraud/rescan"),
    ),
    "A5": ("web/app/admin/audit/page.tsx", ("/audit/logs", "/audit/verify-chain")),
    "V1": (
        "web/app/vendor/page.tsx",
        ("/vendor/batches", "/batches/{batch_id}/dispatch", "/batches/{batch_id}/gps"),
    ),
    "X1": (
        "web/app/demo/simulate/page.tsx",
        (
            "/demo/promote/{cts_id}",
            "/demo/simulate-attendance",
            "/demo/simulate-dbt",
            "/demo/reset",
        ),
    ),
}


def main() -> int:
    spec = app.openapi()
    api_paths = set(spec["paths"])
    missing: list[tuple[str, str]] = []
    for screen, (page, endpoints) in SCREENS.items():
        if not (ROOT / page).is_file():
            missing.append((screen, f"frontend route missing: {page}"))
        for endpoint in endpoints:
            if endpoint not in api_paths:
                missing.append((screen, f"OpenAPI route missing: {endpoint}"))
    with TestClient(app) as client:
        health_status = client.get("/health").status_code
        spec_status = client.get("/api/openapi.json").status_code
    print("screen | page | API paths | route registration")
    for screen, (page, endpoints) in SCREENS.items():
        okay = (ROOT / page).is_file() and all(path in api_paths for path in endpoints)
        print(f"{screen} | {page} | {len(endpoints)} | {'ok' if okay else 'missing'}")
    if health_status != 200 or spec_status != 200:
        missing.append(("API", f"health={health_status}, openapi={spec_status}"))
    if missing:
        for screen, issue in missing:
            print(f"FAIL {screen}: {issue}")
        print(
            f"Contract check: {len(SCREENS) - len({s for s, _ in missing})}/33 screens have route coverage"
        )
        return 1
    print(
        "Contract check: 33/33 screens have a frontend route and registered API path (P1 is static)."
    )
    print(
        "Note: this checks route registration, not screen wiring or response schemas."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
