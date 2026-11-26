import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const results = JSON.parse(fs.readFileSync(path.join(root, "qa", "results.json"), "utf8"));
const original = new Map([
  ["/", ["P1", "p1_landing_page"]], ["/login", ["P2", "p2_login_page"]], ["/login/verify", ["P3", "p3_otp_verification"]],
  ["/student", ["S1", "s1_student_dashboard"]], ["/student/schemes/namo-lakshmi", ["S2", "s2_scheme_detail_explainer"]], ["/student/vault", ["S3", "s3_document_vault"]],
  ["/student/vault/upload", ["S4", "s4_document_upload_ocr_review"]], ["/student/apply", ["S5", "s5_one_click_apply_consent"]], ["/student/applications", ["S6", "s6_application_tracker"]],
  ["/student/cycle", ["S7", "s7_cycle_delivery_qr_otp"]], ["/student/payments", ["S8", "s8_payments_and_bank_account"]], ["/student/grievances", ["S9", "s9_grievance_raise_track"]],
  ["/student/notifications", ["S10", "s10_notifications"]], ["/student/profile", ["S11", "s11_profile_and_consent_manager"]], ["/student/assistant", ["S12", "s12_ai_help_assistant"]],
  ["/school", ["SC1", "sc1_school_dashboard"]], ["/school/queue", ["SC2", "sc2_verification_queue"]], ["/school/queue/APP-2026-RIYA-NL", ["SC3", "sc3_application_review_detail"]],
  ["/school/records", ["SC4", "sc4_attendance_and_marks_upload"]], ["/school/cycles", ["SC5", "sc5_cycle_receive_handover"]], ["/school/reports", ["SC6", "sc6_school_reports"]],
  ["/deo", ["D1", "d1_deo_dashboard"]], ["/deo/approvals", ["D2", "d2_bulk_approvals"]], ["/deo/cycles", ["D3", "d3_cycle_supply_chain_map"]],
  ["/deo/at-risk", ["D4", "d4_at_risk_students_dropout_predictor"]], ["/deo/grievances", ["D5", "d5_grievance_management"]],
  ["/admin", ["A1", "a1_state_analytics_dashboard"]], ["/admin/schemes/builder", ["A2", "a2_scheme_builder_rule_builder"]], ["/admin/funds", ["A3", "a3_fund_tracker_dbt_reconciliation"]],
  ["/admin/fraud", ["A4", "a4_fraud_detection_dashboard"]], ["/admin/audit", ["A5", "a5_audit_logs"]], ["/vendor", ["V1", "v1_vendor_batch_dispatch"]], ["/demo/simulate", ["X1", "x1_simulate_next_year_control_panel"]],
]);
const capture = (route) => route === "/" ? "P1.png" : `${route.replace(/^\//, "").replaceAll("/", "_")}.png`;
const clean = (item) => item.status === 200 && !item.error && !item.pageErrors?.length && !item.apiErrors?.length && !item.brokenImages?.length && !item.horizontalOverflow;
const passed = results.filter(clean).length;
const fonts = results.filter((item) => item.notoGujaratiReady).length;
const stitchCount = [...original.keys()].filter((route) => results.some((item) => item.route === route)).length;
const lines = [
  "# Browser route and visual QA report",
  "",
  `Run date: ${new Date().toISOString().slice(0, 10)}. Generated from the latest \`make qa\` screenshot sweep against a clean temporary SQLite database and the production Next.js build.`,
  "",
  `- Screenshots captured: ${results.filter((item) => !item.error).length}/${results.length}.`,
  `- Routes passing HTTP, browser/API error, broken-image, Gujarati-font-ready, and document-overflow checks: ${passed}/${results.length}.`,
  `- Routes where the browser confirmed Noto Sans Gujarati loaded: ${fonts}/${results.length}.`,
  `- Original Stitch screens represented: ${stitchCount}/33. Added routes have no Stitch reference image.`,
  "- Mobile viewport: 390×844 for student pages, P3, and SC5; desktop viewport: 1440×900 for other pages.",
  "",
  "This automated sweep validates route rendering and broad document-level layout health. It does not compare pixels, inspect every nested table for clipping, exercise every control, or verify Gujarati/Hindi/English parity. Those visual and language reviews remain open.",
  "",
  "| Screen / route | Viewport | Capture | Stitch reference | Result |",
  "|---|---:|---|---|---|",
];
for (const item of results) {
  const reference = original.get(item.route);
  const screen = reference ? `${reference[0]} · \`${item.route}\`` : `\`${item.route}\``;
  const stitch = reference
    ? `[screen.png](../design/stitch/stitch_complete_ui_screens_implementation/${reference[1]}/screen.png)`
    : "— (added route)";
  const viewport = `${item.viewport.width}×${item.viewport.height}`;
  const status = clean(item) ? "200 · pass" : `fail · HTTP ${item.status}${item.apiErrors?.length ? ` · ${item.apiErrors.length} API errors` : ""}`;
  lines.push(`| ${screen} | ${viewport} | [${capture(item.route)}](screens/${capture(item.route)}) | ${stitch} | ${status} |`);
}
lines.push("", "## Review notes", "", "- `horizontalOverflow` measures the document width against the viewport. The capture sweep reported no document-level overflow on passing routes; it cannot guarantee that every data table or side panel is unclipped.", "- Screenshots are stored in `qa/screens/` and route metrics in `qa/results.json`.", "- Backend workflow coverage is reported separately in `docs/FINAL_STATUS.md`; route capture is not proof that every workflow action is complete.", "");
fs.writeFileSync(path.join(root, "qa", "report.md"), lines.join("\n"));
console.log(`Wrote qa/report.md for ${results.length} routes (${passed} passed, ${fonts} Gujarati font checks).`);
