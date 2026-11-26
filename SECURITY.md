# Security Policy

## Demo Scope Disclaimer
- **Demo OTP**: `123456` is enabled **only** when `ADAPTER_MODE=mock`. In non-mock mode, unpredictable cryptographic OTPs are generated and `JWT_SECRET` must be overridden at startup.
- **Mock Integrations**: PFMS, Aadhaar/UIDAI, CTS, DigiLocker, SMS, and external LLM calls use deterministic local mock adapters. No real government APIs or credentials are connected.
- **Synthetic Data**: All student, school, and transaction data in `api/seed/` and `api/vps.demo.db` are synthetic demo records. No real PII is stored in this repository.

## Reporting a Vulnerability
Please open a private security advisory or contact the repository maintainers before disclosing any vulnerability publicly.
