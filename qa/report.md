# Browser route and visual QA report

Run date: 2026-11-26. Generated from the latest `make qa` screenshot sweep against a clean temporary SQLite database and the production Next.js build.

- Screenshots captured: 64/64.
- Routes passing HTTP, browser/API error, broken-image, Gujarati-font-ready, and document-overflow checks: 64/64.
- Routes where the browser confirmed Noto Sans Gujarati loaded: 64/64.
- Original Stitch screens represented: 33/33. Added routes have no Stitch reference image.
- Mobile viewport: 390×844 for student pages, P3, and SC5; desktop viewport: 1440×900 for other pages.

This automated sweep validates route rendering and broad document-level layout health. It does not compare pixels, inspect every nested table for clipping, exercise every control, or verify Gujarati/Hindi/English parity. Those visual and language reviews remain open.

| Screen / route | Viewport | Capture | Stitch reference | Result |
|---|---:|---|---|---|
| P1 · `/` | 1440×900 | [P1.png](screens/P1.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/p1_landing_page/screen.png) | 200 · pass |
| A1 · `/admin` | 1440×900 | [admin.png](screens/admin.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/a1_state_analytics_dashboard/screen.png) | 200 · pass |
| A5 · `/admin/audit` | 1440×900 | [admin_audit.png](screens/admin_audit.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/a5_audit_logs/screen.png) | 200 · pass |
| A4 · `/admin/fraud` | 1440×900 | [admin_fraud.png](screens/admin_fraud.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/a4_fraud_detection_dashboard/screen.png) | 200 · pass |
| A3 · `/admin/funds` | 1440×900 | [admin_funds.png](screens/admin_funds.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/a3_fund_tracker_dbt_reconciliation/screen.png) | 200 · pass |
| `/admin/ml` | 1440×900 | [admin_ml.png](screens/admin_ml.png) | — (added route) | 200 · pass |
| `/admin/ranking` | 1440×900 | [admin_ranking.png](screens/admin_ranking.png) | — (added route) | 200 · pass |
| `/admin/schemes` | 1440×900 | [admin_schemes.png](screens/admin_schemes.png) | — (added route) | 200 · pass |
| A2 · `/admin/schemes/builder` | 1440×900 | [admin_schemes_builder.png](screens/admin_schemes_builder.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/a2_scheme_builder_rule_builder/screen.png) | 200 · pass |
| `/admin/settings` | 1440×900 | [admin_settings.png](screens/admin_settings.png) | — (added route) | 200 · pass |
| `/admin/users` | 1440×900 | [admin_users.png](screens/admin_users.png) | — (added route) | 200 · pass |
| X1 · `/demo/simulate` | 1440×900 | [demo_simulate.png](screens/demo_simulate.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/x1_simulate_next_year_control_panel/screen.png) | 200 · pass |
| D1 · `/deo` | 1440×900 | [deo.png](screens/deo.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/d1_deo_dashboard/screen.png) | 200 · pass |
| `/deo/applications` | 1440×900 | [deo_applications.png](screens/deo_applications.png) | — (added route) | 200 · pass |
| D2 · `/deo/approvals` | 1440×900 | [deo_approvals.png](screens/deo_approvals.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/d2_bulk_approvals/screen.png) | 200 · pass |
| D4 · `/deo/at-risk` | 1440×900 | [deo_at-risk.png](screens/deo_at-risk.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/d4_at_risk_students_dropout_predictor/screen.png) | 200 · pass |
| D3 · `/deo/cycles` | 1440×900 | [deo_cycles.png](screens/deo_cycles.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/d3_cycle_supply_chain_map/screen.png) | 200 · pass |
| `/deo/delegations` | 1440×900 | [deo_delegations.png](screens/deo_delegations.png) | — (added route) | 200 · pass |
| D5 · `/deo/grievances` | 1440×900 | [deo_grievances.png](screens/deo_grievances.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/d5_grievance_management/screen.png) | 200 · pass |
| `/deo/schools` | 1440×900 | [deo_schools.png](screens/deo_schools.png) | — (added route) | 200 · pass |
| `/design-system` | 1440×900 | [design-system.png](screens/design-system.png) | — (added route) | 200 · pass |
| `/help` | 1440×900 | [help.png](screens/help.png) | — (added route) | 200 · pass |
| P2 · `/login` | 1440×900 | [login.png](screens/login.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/p2_login_page/screen.png) | 200 · pass |
| P3 · `/login/verify` | 390×844 | [login_verify.png](screens/login_verify.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/p3_otp_verification/screen.png) | 200 · pass |
| `/privacy` | 1440×900 | [privacy.png](screens/privacy.png) | — (added route) | 200 · pass |
| SC1 · `/school` | 1440×900 | [school.png](screens/school.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/sc1_school_dashboard/screen.png) | 200 · pass |
| SC5 · `/school/cycles` | 390×844 | [school_cycles.png](screens/school_cycles.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/sc5_cycle_receive_handover/screen.png) | 200 · pass |
| `/school/grievances` | 1440×900 | [school_grievances.png](screens/school_grievances.png) | — (added route) | 200 · pass |
| `/school/handover-register` | 1440×900 | [school_handover-register.png](screens/school_handover-register.png) | — (added route) | 200 · pass |
| SC2 · `/school/queue` | 1440×900 | [school_queue.png](screens/school_queue.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/sc2_verification_queue/screen.png) | 200 · pass |
| SC3 · `/school/queue/APP-2026-RIYA-NL` | 1440×900 | [school_queue_APP-2026-RIYA-NL.png](screens/school_queue_APP-2026-RIYA-NL.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/sc3_application_review_detail/screen.png) | 200 · pass |
| SC4 · `/school/records` | 1440×900 | [school_records.png](screens/school_records.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/sc4_attendance_and_marks_upload/screen.png) | 200 · pass |
| SC6 · `/school/reports` | 1440×900 | [school_reports.png](screens/school_reports.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/sc6_school_reports/screen.png) | 200 · pass |
| `/school/students` | 1440×900 | [school_students.png](screens/school_students.png) | — (added route) | 200 · pass |
| `/school/students/GJ-AND-2026-004512` | 1440×900 | [school_students_GJ-AND-2026-004512.png](screens/school_students_GJ-AND-2026-004512.png) | — (added route) | 200 · pass |
| S1 · `/student` | 390×844 | [student.png](screens/student.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/s1_student_dashboard/screen.png) | 200 · pass |
| S6 · `/student/applications` | 390×844 | [student_applications.png](screens/student_applications.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/s6_application_tracker/screen.png) | 200 · pass |
| `/student/applications/APP-2026-RIYA-NL` | 390×844 | [student_applications_APP-2026-RIYA-NL.png](screens/student_applications_APP-2026-RIYA-NL.png) | — (added route) | 200 · pass |
| S5 · `/student/apply` | 390×844 | [student_apply.png](screens/student_apply.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/s5_one_click_apply_consent/screen.png) | 200 · pass |
| S12 · `/student/assistant` | 390×844 | [student_assistant.png](screens/student_assistant.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/s12_ai_help_assistant/screen.png) | 200 · pass |
| `/student/bank` | 390×844 | [student_bank.png](screens/student_bank.png) | — (added route) | 200 · pass |
| S7 · `/student/cycle` | 390×844 | [student_cycle.png](screens/student_cycle.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/s7_cycle_delivery_qr_otp/screen.png) | 200 · pass |
| S9 · `/student/grievances` | 390×844 | [student_grievances.png](screens/student_grievances.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/s9_grievance_raise_track/screen.png) | 200 · pass |
| `/student/id-card` | 390×844 | [student_id-card.png](screens/student_id-card.png) | — (added route) | 200 · pass |
| S10 · `/student/notifications` | 390×844 | [student_notifications.png](screens/student_notifications.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/s10_notifications/screen.png) | 200 · pass |
| S8 · `/student/payments` | 390×844 | [student_payments.png](screens/student_payments.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/s8_payments_and_bank_account/screen.png) | 200 · pass |
| S11 · `/student/profile` | 390×844 | [student_profile.png](screens/student_profile.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/s11_profile_and_consent_manager/screen.png) | 200 · pass |
| `/student/schemes/list` | 390×844 | [student_schemes_list.png](screens/student_schemes_list.png) | — (added route) | 200 · pass |
| S2 · `/student/schemes/namo-lakshmi` | 390×844 | [student_schemes_namo-lakshmi.png](screens/student_schemes_namo-lakshmi.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/s2_scheme_detail_explainer/screen.png) | 200 · pass |
| S3 · `/student/vault` | 390×844 | [student_vault.png](screens/student_vault.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/s3_document_vault/screen.png) | 200 · pass |
| S4 · `/student/vault/upload` | 390×844 | [student_vault_upload.png](screens/student_vault_upload.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/s4_document_upload_ocr_review/screen.png) | 200 · pass |
| `/tpeo` | 1440×900 | [tpeo.png](screens/tpeo.png) | — (added route) | 200 · pass |
| `/tpeo/approvals` | 1440×900 | [tpeo_approvals.png](screens/tpeo_approvals.png) | — (added route) | 200 · pass |
| `/tpeo/reports` | 1440×900 | [tpeo_reports.png](screens/tpeo_reports.png) | — (added route) | 200 · pass |
| `/tpeo/schools` | 1440×900 | [tpeo_schools.png](screens/tpeo_schools.png) | — (added route) | 200 · pass |
| `/transparency` | 1440×900 | [transparency.png](screens/transparency.png) | — (added route) | 200 · pass |
| V1 · `/vendor` | 1440×900 | [vendor.png](screens/vendor.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/v1_vendor_batch_dispatch/screen.png) | 200 · pass |
| `/vendor/challan` | 1440×900 | [vendor_challan.png](screens/vendor_challan.png) | — (added route) | 200 · pass |
| `/vendor/orders` | 1440×900 | [vendor_orders.png](screens/vendor_orders.png) | — (added route) | 200 · pass |
| `/vendor/payments` | 1440×900 | [vendor_payments.png](screens/vendor_payments.png) | — (added route) | 200 · pass |
| `/vendor/qr` | 1440×900 | [vendor_qr.png](screens/vendor_qr.png) | — (added route) | 200 · pass |
| `/vendor/returns` | 1440×900 | [vendor_returns.png](screens/vendor_returns.png) | — (added route) | 200 · pass |
| `/vendor/tracking` | 1440×900 | [vendor_tracking.png](screens/vendor_tracking.png) | — (added route) | 200 · pass |
| `/verify/DBT-1` | 1440×900 | [verify_DBT-1.png](screens/verify_DBT-1.png) | — (added route) | 200 · pass |

## Review notes

- `horizontalOverflow` measures the document width against the viewport. The capture sweep reported no document-level overflow on passing routes; it cannot guarantee that every data table or side panel is unclipped.
- Screenshots are stored in `qa/screens/` and route metrics in `qa/results.json`.
- Backend workflow coverage is reported separately in `docs/FINAL_STATUS.md`; route capture is not proof that every workflow action is complete.
