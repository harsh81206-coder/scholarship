/**
 * lib/mock.ts — Centralized mock data for NEXT_PUBLIC_USE_MOCK=true mode
 * All demo data matches AGENTS.md seed identities.
 */

export const MOCK_STUDENT = {
  id: "GJ-AND-2026-004512",
  name: { gu: "રિયા હસમુખભાઈ પટેલ", en: "Riya Hasukhbhai Patel", hi: "रिया हसमुखभाई पटेल" },
  nameShort: { gu: "રિયા પટેલ", en: "Riya Patel", hi: "रिया पटेल" },
  initials: "RP",
  class: "9-B",
  school: { gu: "શ્રી સ.પ. હાઈ., આ.", en: "Shri Sardar Patel HS, Anand", hi: "श्री स.प. हाई., आणंद" },
  schoolUDISE: "24150104502",
  district: { gu: "આ. જિ.", en: "Anand District", hi: "आणंद जिला" },
  dob: "2009-08-15",
  gender: "F",
  category: "OBC",
  mobile: "9876543210",
  aadhaarLast4: "4512",
  attendance: 89,
  profileCompletion: 92,
  bank: {
    name: { gu: "હેતલ. પ. (માત.)", en: "Hetalben Patel (Mother)", hi: "हेतलबेन पटेल (माता)" },
    bank: "State Bank of India",
    last4: "4521",
    ifsc: "SBIN0001234",
    branch: "Anand",
    aadhaarSeeded: true,
  },
};

export const MOCK_OFFICER = {
  name: { gu: "ડૉ. ક. શ.", en: "Dr. Kalpesh Shah", hi: "डॉ. कल्पेश शाह" },
  role: "Principal",
  school: "Shri Sardar Patel HS",
  udise: "24150104502",
  district: "Anand",
};

export const MOCK_SCHEMES = [
  {
    id: "namo-lakshmi",
    name: { gu: "નમો લક્ષ્મી", en: "Namo Lakshmi Yojana", hi: "नमो लक्ष्मी योजना" },
    amount: 50000,
    perYear: 10000,
    target: "Girls Grade 9-12",
    icon: "volunteer_activism",
    eligible: true,
    applied: true,
    status: "approved",
  },
  {
    id: "saraswati-cycle",
    name: { gu: "સ.સ. સાઇ.", en: "Saraswati Sadhana Cycle", hi: "सरस्वती साधना साइकिल" },
    amount: 0,
    amountLabel: "Free Bicycle",
    target: "Girls Grade 9",
    icon: "pedal_bike",
    eligible: true,
    applied: true,
    status: "inprogress",
  },
  {
    id: "gyan-setu",
    name: { gu: "જ્ઞ. સ. મ.", en: "Gyan Setu Merit", hi: "ज्ञान सेतु मेरिट" },
    amount: 12000,
    target: "Merit Grade 9-12",
    icon: "emoji_events",
    eligible: true,
    applied: true,
    status: "approved",
  },
  {
    id: "nmms",
    name: { gu: "NMMS", en: "NMMS Scholarship", hi: "NMMS छात्रवृत्ति" },
    amount: 12000,
    target: "Merit Grade 9-12",
    icon: "auto_stories",
    eligible: true,
    applied: false,
    status: "not_applied",
    exclusiveWith: ["gyan-setu"],
  },
  {
    id: "obc-scholarship",
    name: { gu: "OBC સ.", en: "OBC Scholarship", hi: "OBC छात्रवृत्ति" },
    amount: 7500,
    target: "OBC Grade 1-12",
    icon: "diversity_3",
    eligible: true,
    applied: false,
    status: "action_required",
    actionRequired: "Upload Income Certificate",
  },
];

export const MOCK_APPLICATIONS = [
  {
    id: "APP-2026-00871",
    schemeId: "namo-lakshmi",
    schemeName: "Namo Lakshmi Yojana",
    amount: 10000,
    status: "inprogress",
    submittedDate: "2026-07-15",
    lastUpdated: "2026-10-28",
    timeline: [
      { step: "Submitted", done: true, date: "15 Jul" },
      { step: "School Verified", done: true, date: "18 Jul" },
      { step: "DEO Approved", done: true, date: "22 Jul" },
      { step: "Sanction Order", done: false, active: true, date: "Est. 5 Nov" },
      { step: "DBT Initiated", done: false, date: "Est. 8 Nov" },
      { step: "Credited", done: false, date: "Est. 12 Nov" },
    ],
  },
  {
    id: "APP-2026-00872",
    schemeId: "saraswati-cycle",
    schemeName: "Saraswati Sadhna Cycle",
    amount: 0,
    status: "inprogress",
    submittedDate: "2026-07-15",
    lastUpdated: "2026-10-30",
    cycleModel: "Atlas Trailblazer 22T",
    deliveryStatus: "School Arrived",
    deliveryOTP: "482913",
    timeline: [
      { step: "Applied", done: true, date: "15 Jul" },
      { step: "Approved", done: true, date: "22 Jul" },
      { step: "Dispatched", done: true, date: "1 Oct" },
      { step: "School Arrived", done: true, active: true, date: "30 Oct" },
      { step: "Handover Pending", done: false, date: "Pending OTP" },
    ],
  },
  {
    id: "APP-2025-004190",
    schemeId: "gyan-setu",
    schemeName: "Gyan Sadhna Merit",
    amount: 12500,
    status: "approved",
    submittedDate: "2025-08-10",
    lastUpdated: "2025-11-01",
    utr: "SBIN2611020045",
    creditedDate: "2025-11-01",
    timeline: [
      { step: "Submitted", done: true, date: "10 Aug" },
      { step: "Verified", done: true, date: "15 Aug" },
      { step: "Approved", done: true, date: "20 Aug" },
      { step: "DBT Credited", done: true, date: "1 Nov" },
    ],
  },
  {
    id: "APP-2026-00875",
    schemeId: "obc-scholarship",
    schemeName: "OBC Pre-Matric",
    amount: 7500,
    status: "action_required",
    submittedDate: "2026-09-01",
    lastUpdated: "2026-10-10",
    actionRequired: "Income Certificate expired — please upload renewed certificate",
    timeline: [
      { step: "Submitted", done: true, date: "1 Sep" },
      { step: "School Verified", done: true, date: "5 Sep" },
      { step: "DEO Review", done: false, active: false, date: "Paused" },
    ],
  },
];

export const MOCK_PAYMENTS = [
  { id: "PAY-001", scheme: "Gyan Sadhna Merit", amount: 12500, date: "2025-11-01", utr: "SBIN2611020045", status: "credited" },
  { id: "PAY-002", scheme: "Namo Lakshmi Yojana", amount: 10000, date: "2026-03-15", utr: "SBIN0315260891", status: "credited" },
  { id: "PAY-003", scheme: "Namo Lakshmi (Q2)", amount: 2500, date: "Est. Nov 2026", utr: null, status: "pending" },
];

export const MOCK_NOTIFICATIONS = [
  { id: "N1", type: "dbt", icon: "account_balance", title: { gu: "₹10,000 DBT ✓", en: "₹10,000 DBT Credited", hi: "₹10,000 DBT क्रेडिट" }, body: "SBI ****4521 • UTR: SBIN0315260891", time: "10:32 AM", read: false },
  { id: "N2", type: "approval", icon: "check_circle", title: { gu: "ન.લ. DEO ✓", en: "Namo Lakshmi Approved by DEO", hi: "नमो लक्ष्मी DEO अनुमोदित" }, body: "Application APP-2026-00871 approved", time: "Yesterday", read: false },
  { id: "N3", type: "cycle", icon: "pedal_bike", title: { gu: "સાઇ. આ. ✓", en: "Cycle Arrived at School", hi: "साइकिल स्कूल पहुंची" }, body: "Atlas 22T ready for pickup • OTP: 482913", time: "2 days ago", read: true },
  { id: "N4", type: "action", icon: "warning", title: { gu: "ડૉ. અ. ⚠️", en: "Upload Income Certificate", hi: "आय प्रमाण पत्र अपलोड करें" }, body: "Required for OBC scholarship — expires 30 Nov", time: "3 days ago", read: false },
  { id: "N5", type: "info", icon: "info", title: { gu: "NMMS Exclusive", en: "NMMS cannot be combined with Gyan Setu", hi: "NMMS और ज्ञान सेतु साथ नहीं" }, body: "Rule ED/SCH/2024/78B applied automatically", time: "1 week ago", read: true },
];

export const MOCK_GRIEVANCES = [
  { id: "GRV-2026-00341", type: "Payment Delay", scheme: "Namo Lakshmi", status: "inprogress", daysOpen: 12, description: "DBT not credited for Q1 2026-27 despite sanction order dated Oct 15.", assignedTo: "DEO Anand" },
  { id: "GRV-2025-00892", type: "Document Rejection", scheme: "OBC Scholarship", status: "approved", daysOpen: 0, description: "Income certificate was rejected citing wrong format. Resolved after re-upload.", assignedTo: "School Principal", resolvedDate: "2025-12-10" },
];

// District and state analytics mock data
export const MOCK_DISTRICTS = [
  { name: "Anand", students: 12450, disbursed: 8.4, coverage: 94, approvalRate: 96 },
  { name: "Ahmedabad", students: 48200, disbursed: 32.1, coverage: 88, approvalRate: 91 },
  { name: "Surat", students: 36800, disbursed: 24.5, coverage: 86, approvalRate: 89 },
  { name: "Gandhinagar", students: 15200, disbursed: 10.2, coverage: 92, approvalRate: 94 },
  { name: "Vadodara", students: 29100, disbursed: 19.8, coverage: 83, approvalRate: 87 },
];

export const MOCK_MONTHLY_DBT = [
  { month: "Apr", amount: 68 }, { month: "May", amount: 72 }, { month: "Jun", amount: 65 },
  { month: "Jul", amount: 89 }, { month: "Aug", amount: 95 }, { month: "Sep", amount: 102 },
  { month: "Oct", amount: 118 }, { month: "Nov", amount: 85 },
];
