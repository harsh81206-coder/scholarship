# Project: Vidya Pragati Setu (Gujarat scholarship platform, hackathon demo)

Goal: Convert 33 Stitch-exported HTML screens (design/stitch/stitch_complete_ui_screens_implementation/<folder>/code.html + screen.png) into one working Next.js app with routing, shared layouts, language switching, mock data and a small FastAPI backend. Demo must work fully offline.

Stack: Next.js 14 (App Router) + TypeScript + Tailwind + TanStack Query + Zustand. Backend: FastAPI + SQLite. Icons: Material Symbols (local, @fontsource). Fonts: Inter + Noto Sans Gujarati via next/font. Charts: Recharts. QR: html5-qrcode (scan) + qrcode (generate).

Rules:
1. Design source of truth: design/stitch/.../vidya_pragati_setu/DESIGN.md (tokens) and each screen's screen.png. Keep markup/spacing faithful; do not redesign.
2. Never keep Tailwind CDN, per-file tailwind.config, external image URLs or Google font links. One tailwind.config.ts built from DESIGN.md.
3. Shared components only: no copy-pasted sidebars/headers per page.
4. Strings: bilingual strings in the HTML look like "Gujarati (English)". Convert to <T gu="" en="" hi="" /> and show only the selected language.
5. Minimal clean code, small files, TypeScript strict, no unused deps.
6. Mock-first: NEXT_PUBLIC_USE_MOCK=true must run the whole demo without backend.
7. After each phase: run typecheck + lint + build, then summarise what changed in 5 lines.

---

## Screen Map (33 screens)

| Code | Folder | Route | Shell | Device |
|---|---|---|---|---|
| P1 | p1_landing_page | / | Public | Desktop |
| P2 | p2_login_page | /login | Public | Both |
| P3 | p3_otp_verification | /login/verify | Public | Mobile |
| S1 | s1_student_dashboard | /student | StudentShell | Mobile |
| S2 | s2_scheme_detail_explainer | /student/schemes/[id] | StudentShell | Mobile |
| S3 | s3_document_vault | /student/vault | StudentShell | Mobile |
| S4 | s4_document_upload_ocr_review | /student/vault/upload | StudentShell | Mobile |
| S5 | s5_one_click_apply_consent | /student/apply | StudentShell | Mobile |
| S6 | s6_application_tracker | /student/applications | StudentShell | Mobile |
| S7 | s7_cycle_delivery_qr_otp | /student/cycle | StudentShell | Mobile |
| S8 | s8_payments_and_bank_account | /student/payments | StudentShell | Mobile |
| S9 | s9_grievance_raise_track | /student/grievances | StudentShell | Mobile |
| S10 | s10_notifications | /student/notifications | StudentShell | Mobile |
| S11 | s11_profile_and_consent_manager | /student/profile | StudentShell | Mobile |
| S12 | s12_ai_help_assistant | /student/assistant | StudentShell | Mobile |
| SC1 | sc1_school_dashboard | /school | OfficerShell(school) | Desktop |
| SC2 | sc2_verification_queue | /school/queue | OfficerShell(school) | Desktop |
| SC3 | sc3_application_review_detail | /school/queue/[id] | OfficerShell(school) | Desktop |
| SC4 | sc4_attendance_and_marks_upload | /school/records | OfficerShell(school) | Desktop |
| SC5 | sc5_cycle_receive_handover | /school/cycles | MobileShell(school) | Mobile |
| SC6 | sc6_school_reports | /school/reports | OfficerShell(school) | Desktop |
| D1 | d1_deo_dashboard | /deo | OfficerShell(deo) | Desktop |
| D2 | d2_bulk_approvals | /deo/approvals | OfficerShell(deo) | Desktop |
| D3 | d3_cycle_supply_chain_map | /deo/cycles | OfficerShell(deo) | Desktop |
| D4 | d4_at_risk_students_dropout_predictor | /deo/at-risk | OfficerShell(deo) | Desktop |
| D5 | d5_grievance_management | /deo/grievances | OfficerShell(deo) | Desktop |
| A1 | a1_state_analytics_dashboard | /admin | OfficerShell(admin) | Desktop |
| A2 | a2_scheme_builder_rule_builder | /admin/schemes/builder | OfficerShell(admin) | Desktop |
| A3 | a3_fund_tracker_dbt_reconciliation | /admin/funds | OfficerShell(admin) | Desktop |
| A4 | a4_fraud_detection_dashboard | /admin/fraud | OfficerShell(admin) | Desktop |
| A5 | a5_audit_logs | /admin/audit | OfficerShell(admin) | Desktop |
| V1 | v1_vendor_batch_dispatch | /vendor | OfficerShell(vendor) | Desktop |
| X1 | x1_simulate_next_year_control_panel | /demo/simulate | OfficerShell(demo) | Desktop |

---

## Known Issues to Fix During Conversion

1. Replace all Tailwind CDN + per-file tailwind.config with one tailwind.config.ts from DESIGN.md tokens.
2. Load Noto Sans Gujarati + Inter via next/font (NOT Google Fonts CDN).
3. All href="#" must become real Next.js Link routes.
4. Language switcher must be functional in every shell (Zustand store + <T/> component).
5. Add Hindi strings — fallback to English if missing.
6. Replace external/hotlinked images with /public/images placeholders or initials avatars.
7. Replace Material Symbols Google CDN with @fontsource/material-symbols-outlined.
8. Unify sidebar labels: one nav.config.ts, bilingual, per role.
9. Add button/input interactions (Phase 4 covers all flows).
10. Add Skeleton, EmptyState, ErrorState reusable components.
11. D2 Bulk Approve redesign: Taluka Officer layer + threshold routing (Phase 5).
12. Add Taluka Officer (TPEO) role with 2 screens (Phase 5).

---

## Nav Config Reference

| Role | Nav Items |
|---|---|
| school | Dashboard, Verification Queue, Student Records & Marks, Cycle Distribution, Reports & Analytics, Support & Grievances |
| deo | Dashboard, Bulk Approvals, Cycle Supply Chain, At-Risk Students, Grievance Redressal, School Performance |
| admin | State Analytics, Rule Builder, Fund Tracker & PFMS, Fraud & Anomaly, Audit Logs, District Ranking |
| vendor | Batch & Dispatch, QR Generator, GPS Tracking, Delivery Challan |
| tpeo | Dashboard, Approval Queue, School Oversight, Reports |

---

## Demo Seed Identities (use consistently across mock data and backend seed)

- Student: Riya Patel, CTS ID GJ-AND-2026-004512, Anand district
- Teacher/Principal: Dr. Kalpesh Shah
- School: (Anand district school)
- OTP: always accept 123456

---

## Phase Summary

| Phase | Goal |
|---|---|
| 0 | Extract zips, create docs/inventory.md (33 screens mapped) |
| 1 | Next.js scaffold, tailwind.config.ts from DESIGN.md, design-system page |
| 2 | Shells, navigation, i18n store, role switcher, placeholder routes |
| 3 | Convert all 33 screens group by group (8 groups) |
| 4 | Mock interactions, Zustand demo store, all 10 flows |
| 5 | DEO practicality fix: TPEO role, D2 redesign, risk thresholds |
| 6 | FastAPI + SQLite backend, lib/api.ts with mock fallback, docker-compose |
| 7 | Playwright QA, screenshot compare, polish, DEMO_SCRIPT.md |
