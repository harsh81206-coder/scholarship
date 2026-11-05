import { type Role } from "@/lib/store";

export interface NavItem {
  icon: string; // Material Symbol name
  gu: string;
  en: string;
  hi: string;
  href: string;
}

export const NAV_CONFIG: Record<Role, NavItem[]> = {
  student: [
    { icon: "home", gu: "હોમ", en: "Home", hi: "होम", href: "/student" },
    { icon: "auto_stories", gu: "યોજનાઓ", en: "Schemes", hi: "योजनाएं", href: "/student/schemes/list" },
    { icon: "send", gu: "અરજી કરો", en: "Apply", hi: "आवेदन", href: "/student/apply" },
    { icon: "timeline", gu: "ટ્રૅક", en: "Track", hi: "ट्रैक", href: "/student/applications" },
    { icon: "person", gu: "પ્રોફાઇલ", en: "Profile", hi: "प्रोफ़ाइल", href: "/student/profile" },
  ],
  school: [
    { icon: "dashboard", gu: "ડૅશબૉર્ડ", en: "Dashboard", hi: "डैशबोर्ड", href: "/school" },
    { icon: "fact_check", gu: "ચકાસણી કતાર", en: "Verification Queue", hi: "सत्यापन कतार", href: "/school/queue" },
    { icon: "school", gu: "વિદ્યાર્થી રેકોર્ડ", en: "Student Records & Marks", hi: "छात्र रिकॉर्ड", href: "/school/records" },
    { icon: "pedal_bike", gu: "સાઇકલ વિતરણ", en: "Cycle Distribution", hi: "साइकिल वितरण", href: "/school/cycles" },
    { icon: "bar_chart", gu: "રિપોર્ટ", en: "Reports & Analytics", hi: "रिपोर्ट", href: "/school/reports" },
    { icon: "support_agent", gu: "ફરિયાદ", en: "Support & Grievances", hi: "शिकायत", href: "/school/grievances" },
  ],
  deo: [
    { icon: "dashboard", gu: "ડૅશબૉર્ડ", en: "Dashboard", hi: "डैशबोर्ड", href: "/deo" },
    { icon: "done_all", gu: "બૅચ મંજૂરી", en: "Bulk Approvals", hi: "थोक अनुमोदन", href: "/deo/approvals" },
    { icon: "route", gu: "સાઇકલ સપ્લાય", en: "Cycle Supply Chain", hi: "साइकिल आपूर्ति", href: "/deo/cycles" },
    { icon: "warning", gu: "જોખમ વિદ્યાર્થી", en: "At-Risk Students", hi: "जोखिम छात्र", href: "/deo/at-risk" },
    { icon: "gavel", gu: "ફરિયાદ", en: "Grievance Redressal", hi: "शिकायत निवारण", href: "/deo/grievances" },
    { icon: "analytics", gu: "શાળા પ્રદર્શન", en: "School Performance", hi: "स्कूल प्रदर्शन", href: "/deo/schools" },
  ],
  admin: [
    { icon: "insights", gu: "રાજ્ય વિશ્લેષણ", en: "State Analytics", hi: "राज्य विश्लेषण", href: "/admin" },
    { icon: "build", gu: "નિયમ નિર્માતા", en: "Rule Builder", hi: "नियम निर्माता", href: "/admin/schemes/builder" },
    { icon: "account_balance", gu: "ભંડોળ ટ્રૅકર", en: "Fund Tracker & PFMS", hi: "फंड ट्रैकर", href: "/admin/funds" },
    { icon: "policy", gu: "છેતરપિંડી", en: "Fraud & Anomaly", hi: "धोखाधड़ी", href: "/admin/fraud" },
    { icon: "receipt_long", gu: "ઑડિટ લૉગ", en: "Audit Logs", hi: "ऑडिट लॉग", href: "/admin/audit" },
    { icon: "leaderboard", gu: "જિલ્લા ક્રમ", en: "District Ranking", hi: "जिला रैंकिंग", href: "/admin/ranking" },
  ],
  vendor: [
    { icon: "inventory_2", gu: "બૅચ & ડિસ્પૅચ", en: "Batch & Dispatch", hi: "बैच और डिस्पैच", href: "/vendor" },
    { icon: "qr_code_2", gu: "QR જનરેટર", en: "QR Generator", hi: "QR जेनरेटर", href: "/vendor/qr" },
    { icon: "location_on", gu: "GPS ટ્રૅકિંગ", en: "GPS Tracking", hi: "GPS ट्रैकिंग", href: "/vendor/tracking" },
    { icon: "description", gu: "ડિલિવરી ચલણ", en: "Delivery Challan", hi: "डिलिवरी चालान", href: "/vendor/challan" },
  ],
  tpeo: [
    { icon: "dashboard", gu: "ડૅશબૉર્ડ", en: "Dashboard", hi: "डैशबोर्ड", href: "/tpeo" },
    { icon: "fact_check", gu: "મંજૂરી કતાર", en: "Approval Queue", hi: "अनुमोदन कतार", href: "/tpeo/approvals" },
    { icon: "school", gu: "શાળા નિગરાની", en: "School Oversight", hi: "स्कूल निगरानी", href: "/tpeo/schools" },
    { icon: "bar_chart", gu: "રિપોર્ટ", en: "Reports", hi: "रिपोर्ट", href: "/tpeo/reports" },
  ],
  demo: [
    { icon: "tune", gu: "સિમ્યુલેશન કંટ્રોલ", en: "Simulation Control", hi: "सिमुलेशन नियंत्रण", href: "/demo/simulate" },
    { icon: "insights", gu: "રાજ્ય વિશ્લેષણ", en: "State Analytics", hi: "राज्य विश्लेषण", href: "/admin" },
    { icon: "build", gu: "નિયમ નિર્માતા", en: "Rule Builder", hi: "नियम निर्माता", href: "/admin/schemes/builder" },
    { icon: "analytics", gu: "શાળા પ્રદર્શન", en: "School Performance", hi: "स्कूल प्रदर्शन", href: "/deo/schools" },
  ],
};

export const ROLE_DASHBOARD: Record<Role, string> = {
  student: "/student",
  school: "/school",
  deo: "/deo",
  admin: "/admin",
  vendor: "/vendor",
  tpeo: "/tpeo",
  demo: "/demo/simulate",
};

export const ROLE_LABELS: Record<Role, { gu: string; en: string }> = {
  student: { gu: "વિદ્યાર્થી", en: "Student" },
  school: { gu: "શાળા", en: "School / Principal" },
  deo: { gu: "DEO", en: "District Education Officer" },
  admin: { gu: "રાજ્ય સંચાલક", en: "State Admin" },
  vendor: { gu: "વિક્રેતા", en: "Vendor" },
  tpeo: { gu: "TPEO", en: "Taluka Officer" },
  demo: { gu: "ડેમો", en: "Demo Control" },
};
