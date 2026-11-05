# Visual and route QA report

Run: 2026-11-05 using `QA_BASE_URL=http://localhost:3100 npm run qa:screens`.

## Automated checks

- Captured all 33 target routes: HTTP 200, zero page errors, zero broken images.
- Student routes, P3, and SC5 used 390×844; all other routes used 1440×900.
- All captures reported no document-level horizontal overflow and `document.fonts.check("16px 'Noto Sans Gujarati'", "ગુજરાતી")` returned true.
- This checks route rendering and broad layout health. It does not measure pixel similarity or prove text is not clipped inside every nested table/panel.

## Screen-by-screen captures and references

Each row links the app capture and the corresponding Stitch reference. The reference images were located for all 33 screens. Detailed pixel comparison is still outstanding; see the visual-review note below.

| Code | Route | Viewport | Capture | Stitch reference | Automated result |
|---|---|---:|---|---|---|
| P1 | `/` | 1440×900 | [P1.png](screens/P1.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/p1_landing_page/screen.png) | 200; clean |
| P2 | `/login` | 1440×900 | [P2.png](screens/P2.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/p2_login_page/screen.png) | 200; clean |
| P3 | `/login/verify` | 390×844 | [P3.png](screens/P3.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/p3_otp_verification/screen.png) | 200; clean |
| S1 | `/student` | 390×844 | [S1.png](screens/S1.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/s1_student_dashboard/screen.png) | 200; clean |
| S2 | `/student/schemes/namo-lakshmi` | 390×844 | [S2.png](screens/S2.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/s2_scheme_detail_explainer/screen.png) | 200; clean |
| S3 | `/student/vault` | 390×844 | [S3.png](screens/S3.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/s3_document_vault/screen.png) | 200; clean |
| S4 | `/student/vault/upload` | 390×844 | [S4.png](screens/S4.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/s4_document_upload_ocr_review/screen.png) | 200; clean |
| S5 | `/student/apply` | 390×844 | [S5.png](screens/S5.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/s5_one_click_apply_consent/screen.png) | 200; clean |
| S6 | `/student/applications` | 390×844 | [S6.png](screens/S6.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/s6_application_tracker/screen.png) | 200; clean |
| S7 | `/student/cycle` | 390×844 | [S7.png](screens/S7.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/s7_cycle_delivery_qr_otp/screen.png) | 200; clean |
| S8 | `/student/payments` | 390×844 | [S8.png](screens/S8.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/s8_payments_and_bank_account/screen.png) | 200; clean |
| S9 | `/student/grievances` | 390×844 | [S9.png](screens/S9.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/s9_grievance_raise_track/screen.png) | 200; clean |
| S10 | `/student/notifications` | 390×844 | [S10.png](screens/S10.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/s10_notifications/screen.png) | 200; clean |
| S11 | `/student/profile` | 390×844 | [S11.png](screens/S11.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/s11_profile_and_consent_manager/screen.png) | 200; clean |
| S12 | `/student/assistant` | 390×844 | [S12.png](screens/S12.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/s12_ai_help_assistant/screen.png) | 200; clean |
| SC1 | `/school` | 1440×900 | [SC1.png](screens/SC1.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/sc1_school_dashboard/screen.png) | 200; clean |
| SC2 | `/school/queue` | 1440×900 | [SC2.png](screens/SC2.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/sc2_verification_queue/screen.png) | 200; clean |
| SC3 | `/school/queue/APP-2026-RIYA-NL` | 1440×900 | [SC3.png](screens/SC3.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/sc3_application_review_detail/screen.png) | 200; clean |
| SC4 | `/school/records` | 1440×900 | [SC4.png](screens/SC4.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/sc4_attendance_and_marks_upload/screen.png) | 200; clean |
| SC5 | `/school/cycles` | 390×844 | [SC5.png](screens/SC5.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/sc5_cycle_receive_handover/screen.png) | 200; clean |
| SC6 | `/school/reports` | 1440×900 | [SC6.png](screens/SC6.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/sc6_school_reports/screen.png) | 200; clean |
| D1 | `/deo` | 1440×900 | [D1.png](screens/D1.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/d1_deo_dashboard/screen.png) | 200; clean |
| D2 | `/deo/approvals` | 1440×900 | [D2.png](screens/D2.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/d2_bulk_approvals/screen.png) | 200; clean |
| D3 | `/deo/cycles` | 1440×900 | [D3.png](screens/D3.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/d3_cycle_supply_chain_map/screen.png) | 200; clean |
| D4 | `/deo/at-risk` | 1440×900 | [D4.png](screens/D4.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/d4_at_risk_students_dropout_predictor/screen.png) | 200; clean |
| D5 | `/deo/grievances` | 1440×900 | [D5.png](screens/D5.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/d5_grievance_management/screen.png) | 200; clean |
| A1 | `/admin` | 1440×900 | [A1.png](screens/A1.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/a1_state_analytics_dashboard/screen.png) | 200; clean |
| A2 | `/admin/schemes/builder` | 1440×900 | [A2.png](screens/A2.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/a2_scheme_builder_rule_builder/screen.png) | 200; clean |
| A3 | `/admin/funds` | 1440×900 | [A3.png](screens/A3.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/a3_fund_tracker_dbt_reconciliation/screen.png) | 200; clean |
| A4 | `/admin/fraud` | 1440×900 | [A4.png](screens/A4.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/a4_fraud_detection_dashboard/screen.png) | 200; clean |
| A5 | `/admin/audit` | 1440×900 | [A5.png](screens/A5.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/a5_audit_logs/screen.png) | 200; clean |
| V1 | `/vendor` | 1440×900 | [V1.png](screens/V1.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/v1_vendor_batch_dispatch/screen.png) | 200; clean |
| X1 | `/demo/simulate` | 1440×900 | [X1.png](screens/X1.png) | [screen.png](../design/stitch/stitch_complete_ui_screens_implementation/x1_simulate_next_year_control_panel/screen.png) | 200; clean |

## Visual review notes

Focused manual review covered SC2, SC3, SC4, SC5, SC6, V1, and A3. Earlier page-level overflow on SC4/A3 was fixed with a minimum-width constraint in the shared officer content area; SC5 now uses the mobile shell. Those routes have no horizontal document overflow in this run. This review does not certify exact spacing, nested table clipping, or pixel-level fidelity across all screens; complete visual comparison remains outstanding.
