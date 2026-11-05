"use client";

import { useState } from "react";
import Link from "next/link";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { StatusChip, KpiCard, Avatar } from "@/components/ui";

interface StudentIssue {
  id: string;
  ctsNumber: string;
  name: string;
  nameEn: string;
  grade: string;
  gradeEn: string;
  scheme: string;
  schemeEn: string;
  schemeBadgeClass: string;
  issue: string;
  issueEn: string;
  issueHi: string;
  issueIcon: string;
  issueSeverityClass: string;
  status: "pending" | "approved" | "rejected" | "inprogress";
  statusLabel: { gu: string; en: string; hi: string };
}

const PRIORITY_STUDENTS: StudentIssue[] = [
  {
    id: "GJ-AND-2026-004512",
    ctsNumber: "GJ-AND-2026-004512",
    name: "રિયા હસમુખભાઈ પટેલ",
    nameEn: "Riya Hasmukhbhai Patel",
    grade: "ધોરણ: 9-B",
    gradeEn: "Class: 9-B",
    scheme: "નમો લક્ષ્મી",
    schemeEn: "Namo Lakshmi",
    schemeBadgeClass: "bg-primary-fixed text-on-primary-fixed",
    issue: "આવક દાખલામાં પિતાના નામમાં વિસંગતતા (84% Mismatch)",
    issueEn: "Father name mismatch in income certificate (84% Mismatch)",
    issueHi: "आय प्रमाण पत्र में पिता के नाम में विसंगति (84% बेमेल)",
    issueIcon: "warning",
    issueSeverityClass: "text-secondary",
    status: "pending",
    statusLabel: { gu: "ધ્યાન જરૂરી", en: "Needs Review", hi: "समीक्षा आवश्यक" },
  },
  {
    id: "GJ-AND-2026-004481",
    ctsNumber: "GJ-AND-2026-004481",
    name: "દક્ષેશ સુરેશભાઈ પરમાર",
    nameEn: "Dakshesh Sureshbhai Parmar",
    grade: "ધોરણ: 10-A",
    gradeEn: "Class: 10-A",
    scheme: "જ્ઞાન સાધના",
    schemeEn: "Gyan Sadhana",
    schemeBadgeClass: "bg-tertiary-fixed text-on-tertiary-fixed",
    issue: "લઘુત્તમ હાજરી ૭૪% (< ૭૫% નિયમ મુજબ)",
    issueEn: "Minimum attendance 74% (< 75% rule requirement)",
    issueHi: "न्यूनतम उपस्थिति 74% (75% नियम से कम)",
    issueIcon: "person_cancel",
    issueSeverityClass: "text-error",
    status: "pending",
    statusLabel: { gu: "હાજરી કમી", en: "Low Attendance", hi: "कम उपस्थिति" },
  },
  {
    id: "GJ-AND-2026-004390",
    ctsNumber: "GJ-AND-2026-004390",
    name: "મીત ચંદુભાઈ ચૌહાણ",
    nameEn: "Meet Chandubhai Chauhan",
    grade: "ધોરણ: 11-Arts",
    gradeEn: "Class: 11-Arts",
    scheme: "SC/ST ઉચ્ચ",
    schemeEn: "SC/ST Higher",
    schemeBadgeClass: "bg-surface-container-high text-on-surface",
    issue: "IFSC કોડ મર્જર સુધારો જરૂરી (BOB Branch)",
    issueEn: "Bank IFSC merger update required (BOB Branch)",
    issueHi: "बैंक IFSC विलय संशोधन आवश्यक (BOB शाखा)",
    issueIcon: "account_balance",
    issueSeverityClass: "text-secondary",
    status: "inprogress",
    statusLabel: { gu: "પ્રક્રિયામાં", en: "In Progress", hi: "प्रगति पर" },
  },
  {
    id: "GJ-AND-2026-004529",
    ctsNumber: "GJ-AND-2026-004529",
    name: "પ્રિયા કિરણભાઈ વણકર",
    nameEn: "Priya Kiranbhai Vankar",
    grade: "ધોરણ: 9-A",
    gradeEn: "Class: 9-A",
    scheme: "સરસ્વતી સાયકલ",
    schemeEn: "Saraswati Cycle",
    schemeBadgeClass: "bg-secondary-fixed text-on-secondary-fixed-variant",
    issue: "ડિજિલોકર આધાર પુનઃપ્રમાણીકરણ વિનંતી",
    issueEn: "DigiLocker Aadhaar re-authentication request",
    issueHi: "डिजीलॉकर आधार पुनः सत्यापन अनुरोध",
    issueIcon: "lock_reset",
    issueSeverityClass: "text-outline",
    status: "pending",
    statusLabel: { gu: "પુનઃચકાસણી", en: "Re-verify", hi: "पुनःसत्यापन" },
  },
  {
    id: "GJ-AND-2026-004412",
    ctsNumber: "GJ-AND-2026-004412",
    name: "આર્યન જગદીશભાઈ સોલંકી",
    nameEn: "Aryan Jagdishbhai Solanki",
    grade: "ધોરણ: 10-B",
    gradeEn: "Class: 10-B",
    scheme: "NMMS સહાય",
    schemeEn: "NMMS Aid",
    schemeBadgeClass: "bg-surface-container-high text-on-surface",
    issue: "માર્કશીટ સ્પષ્ટ નથી (Blurry Scan 42 dpi)",
    issueEn: "Marksheet blurry / illegible scan (42 dpi)",
    issueHi: "अंकतालिका अस्पष्ट (धुंधला स्कैन 42 dpi)",
    issueIcon: "visibility_off",
    issueSeverityClass: "text-error",
    status: "rejected",
    statusLabel: { gu: "પુનઃઅપલોડ", en: "Re-upload", hi: "पुनः अपलोड" },
  },
];

export default function SchoolDashboardPage() {
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [smsSent, setSmsSent] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleSyncAttendance = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSyncStatus("synced");
      setTimeout(() => setSyncStatus(null), 3000);
    }, 1200);
  };

  const handleSendBulkSms = () => {
    setSmsSent(true);
    setTimeout(() => setSmsSent(false), 4000);
  };

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      alert("શાળા પ્રગતિ અને અનુપાલન રિપોર્ટ (PDF) સફળતાપૂર્વક ડાઉનલોડ થયો છે.");
    }, 800);
  };

  return (
    <OfficerShell role="school">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Top Breadcrumb & School Context Header */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <nav className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
                <span className="hover:text-primary cursor-pointer transition-colors">
                  <T gu="શાળાઓ" en="Schools" hi="विद्यालय" />
                </span>
                <Icon name="chevron_right" size={16} className="text-outline" />
                <span className="text-primary font-semibold">
                  <T gu="ડેશબોર્ડ" en="Dashboard" hi="डैशबोर्ड" />
                </span>
              </nav>

              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                <T
                  gu="શાળા શિષ્યવૃત્તિ અને વિતરણ ડેશબોર્ડ"
                  en="School Scholarship & Distribution Dashboard"
                  hi="स्कूल छात्रवृत्ति और वितरण डैशबोर्ड"
                />
              </h1>

              <div className="font-body-sm text-body-sm text-on-surface-variant flex flex-wrap items-center gap-2 pt-0.5">
                <span className="font-medium text-on-surface">
                  <T
                    gu="શ્રી સરદાર પટેલ હાઈસ્કૂલ, આણંદ"
                    en="Shree Sardar Patel High School, Anand"
                    hi="श्री सरदार पटेल हाई स्कूल, आणंद"
                  />
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
                <span>
                  <T gu="UDISE કોડ:" en="UDISE Code:" hi="UDISE कोड:" />{" "}
                  <span className="font-mono text-on-surface font-semibold">24150104502</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
                <span>
                  <T
                    gu="શૈક્ષણિક વર્ષ: ૨૦૨૫-૨૬"
                    en="Academic Year: 2025-26"
                    hi="शैक्षणिक वर्ष: 2025-26"
                  />
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
                <span className="inline-flex items-center gap-1 font-medium text-primary">
                  <Icon name="person" size={15} />
                  <T
                    gu="ડો. કલ્પેશ શાહ (આચાર્ય)"
                    en="Dr. Kalpesh Shah (Principal)"
                    hi="डॉ. कल्पेश शाह (प्रधानाचार्य)"
                  />
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-col items-end">
                <button
                  type="button"
                  onClick={handleSyncAttendance}
                  disabled={syncing}
                  className="h-10 px-4 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-lg text-label-lg flex items-center gap-2 shadow-sm border border-outline-variant"
                  title="Sync student biometric attendance with Saral portal"
                >
                  <Icon
                    name="sync"
                    size={18}
                    className={`text-primary ${syncing ? "animate-spin" : ""}`}
                  />
                  <span>
                    {syncing ? (
                      <T gu="સિંક થઈ રહ્યું છે..." en="Syncing..." hi="सिंक हो रहा है..." />
                    ) : syncStatus === "synced" ? (
                      <T gu="સિંક સફળ!" en="Synced Successfully!" hi="सिंक सफल!" />
                    ) : (
                      <T gu="હાજરી સિંક કરો" en="Sync Attendance" hi="उपस्थिति सिंक करें" />
                    )}
                  </span>
                </button>
                <span className="font-caption text-caption text-on-surface-variant mt-1">
                  <T
                    gu="છેલ્લું સિંક: ૨ દિવસ પહેલાં (સરલ પોર્ટલ)"
                    en="Last synced: 2 days ago (Saral Portal)"
                    hi="अंतिम सिंक: 2 दिन पहले (सरल पोर्टल)"
                  />
                </span>
              </div>

              <button
                type="button"
                onClick={handleExport}
                disabled={exporting}
                className="h-10 px-4 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors font-label-lg text-label-lg flex items-center gap-2 shadow-sm"
              >
                <Icon name={exporting ? "hourglass_empty" : "download"} size={18} />
                <span>
                  {exporting ? (
                    <T gu="ડાઉનલોડિંગ..." en="Downloading..." hi="डाउनलोड हो रहा है..." />
                  ) : (
                    <T gu="રિપોર્ટ ડાઉનલોડ" en="Export Report" hi="रिपोर्ट डाउनलोड करें" />
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* AI Impact Celebratory Trust Banner */}
          <div className="relative overflow-hidden rounded-xl bg-surface-container-low border border-outline-variant/60 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start md:items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0 shadow-xs">
                <Icon name="electric_bolt" size={24} className="text-tertiary" />
              </div>
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-title-md text-title-md text-on-surface font-semibold">
                    <T
                      gu="AI આધારિત સ્વચાલિત દસ્તાવેજ ચકાસણી સક્રિય"
                      en="AI-Powered Automated Document Verification Active"
                      hi="एआई-आधारित स्वचालित दस्तावेज़ सत्यापन सक्रिय"
                    />
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-md text-[11px] font-bold uppercase tracking-wider">
                    <T gu="સક્રિય એન્જિન" en="Active Engine" hi="सक्रिय इंजन" />
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  <T
                    gu="⚡ AI ઓટો-વેરિફિકેશન દ્વારા આ મહિને તમારા સ્ટાફના ૩૮ કલાક (38 hours) ની બચત થઈ છે અને ૨૧૫ અરજીઓ સ્પીડ-ટ્રેક થઈ છે."
                    en="⚡ AI auto-verification saved 38 staff hours this month and speed-tracked 215 student applications directly to DBT sanction."
                    hi="⚡ एआई ऑटो-सत्यापन ने इस महीने कर्मचारियों के 38 घंटे बचाए हैं और 215 आवेदनों को सीधे डीबीटी स्वीकृति तक पहुंचाया है।"
                  />
                </p>
              </div>
            </div>
            <Link
              href="/school/reports"
              className="flex items-center gap-1.5 text-primary hover:text-primary-container font-label-lg text-label-lg shrink-0 group self-end md:self-center"
            >
              <span>
                <T gu="સમગ્ર રિપોર્ટ જુઓ" en="View Full Analytics" hi="पूरी रिपोर्ट देखें" />
              </span>
              <Icon name="arrow_forward" size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </section>

        {/* Metric / KPI Cards Row (5 Cards using KpiCard) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <KpiCard
            icon="groups"
            label={<T gu="કુલ નોંધાયેલ વિદ્યાર્થીઓ" en="Total Students" hi="कुल नामांकित छात्र" />}
            value="842"
            sub={<T gu="+૧૨ આ મહિને • ધોરણ ૯-૧૨" en="+12 this month • Grades 9-12" hi="+12 इस महीने • कक्षा 9-12" />}
            accent="text-on-surface"
          />

          <Link href="/school/queue" className="block focus:outline-none">
            <KpiCard
              icon="pending_actions"
              label={<T gu="ચકાસણી પેન્ડિંગ" en="Verification Queue" hi="सत्यापन कतार" />}
              value="37"
              sub={<T gu="૫ તાત્કાલિક ધ્યાન જરૂરી" en="5 Critical action required" hi="5 महत्वपूर्ण मामलों की समीक्षा" />}
              accent="text-secondary"
            />
          </Link>

          <KpiCard
            icon="verified"
            label={<T gu="AI આપમેળે મંજૂર" en="Auto-Verified (AI)" hi="एआई स्वचालित स्वीकृत" />}
            value="215"
            sub={<T gu="+૧૮% વધારો • શૂન્ય ભૂલ" en="+18% vs Aug • Zero errors" hi="+18% वृद्धि • शून्य त्रुटियां" />}
            accent="text-tertiary"
          />

          <Link href="/school/cycles" className="block focus:outline-none">
            <KpiCard
              icon="pedal_bike"
              label={<T gu="સરસ્વતી સાયકલ વિતરણ" en="Cycle Distribution" hi="साइकिल वितरण" />}
              value="96 / 120"
              sub={<T gu="૮૦% વિતરિત • ૨૪ બાકી" en="80% Delivered • 24 in stock" hi="80% वितरित • 24 शेष" />}
              accent="text-primary"
            />
          </Link>

          <KpiCard
            icon="account_balance"
            label={<T gu="DBT મંજૂર રકમ" en="Schemes Disbursed" hi="डीबीटी स्वीकृत राशि" />}
            value="₹ 32.45 L"
            sub={<T gu="૧૦૦% આધાર સીડેડ ખાતામાં" en="100% Aadhaar-seeded accounts" hi="100% आधार सीडेड खातों में" />}
            accent="text-primary"
          />
        </section>

        {/* Quick Action Navigation Grid (4 Direct Modules) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/school/queue"
            className="card p-4 hover:shadow-level-2 border border-outline-variant/60 hover:border-secondary transition-all flex items-center gap-3.5 group bg-surface-container-lowest"
          >
            <div className="w-11 h-11 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Icon name="fact_check" size={24} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-title-sm text-title-sm text-on-surface group-hover:text-secondary font-semibold transition-colors">
                  <T gu="ચકાસણી કતાર" en="Verification Queue" hi="सत्यापन कतार" />
                </h3>
                <span className="px-1.5 py-0.2 rounded-full bg-secondary-fixed text-on-secondary-fixed font-mono text-[10px] font-bold">
                  37
                </span>
              </div>
              <p className="font-caption text-caption text-on-surface-variant truncate">
                <T
                  gu="૫ કેસોમાં તાત્કાલિક ધ્યાન જરૂરી"
                  en="5 cases require urgent attention"
                  hi="5 मामलों में तत्काल ध्यान आवश्यक"
                />
              </p>
            </div>
          </Link>

          <Link
            href="/school/records"
            className="card p-4 hover:shadow-level-2 border border-outline-variant/60 hover:border-primary transition-all flex items-center gap-3.5 group bg-surface-container-lowest"
          >
            <div className="w-11 h-11 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Icon name="upload_file" size={24} />
            </div>
            <div className="min-w-0">
              <h3 className="font-title-sm text-title-sm text-on-surface group-hover:text-primary font-semibold transition-colors">
                <T gu="વિદ્યાર્થી રેકોર્ડ્સ & ગુણ" en="Records & Marks Upload" hi="छात्र रिकॉर्ड और अंक" />
              </h3>
              <p className="font-caption text-caption text-on-surface-variant truncate">
                <T
                  gu="હાજરી Excel અને CTS ડેટા સિંક"
                  en="Attendance Excel & CTS Portal Sync"
                  hi="उपस्थिति एक्सेल और सीटीएस डेटा सिंक"
                />
              </p>
            </div>
          </Link>

          <Link
            href="/school/cycles"
            className="card p-4 hover:shadow-level-2 border border-outline-variant/60 hover:border-tertiary transition-all flex items-center gap-3.5 group bg-surface-container-lowest"
          >
            <div className="w-11 h-11 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Icon name="pedal_bike" size={24} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-title-sm text-title-sm text-on-surface group-hover:text-tertiary font-semibold transition-colors">
                  <T gu="સરસ્વતી સાયકલ વિતરણ" en="Cycle Distribution" hi="साइकिल वितरण" />
                </h3>
                <span className="px-1.5 py-0.2 rounded-full bg-surface-container-high text-primary font-mono text-[10px] font-bold">
                  80%
                </span>
              </div>
              <p className="font-caption text-caption text-on-surface-variant truncate">
                <T
                  gu="QR સ્કેન સાથે હેન્ડઓવર કરો"
                  en="QR verification & photo handover"
                  hi="क्यूआर सत्यापन के साथ वितरण करें"
                />
              </p>
            </div>
          </Link>

          <Link
            href="/school/reports"
            className="card p-4 hover:shadow-level-2 border border-outline-variant/60 hover:border-primary transition-all flex items-center gap-3.5 group bg-surface-container-lowest"
          >
            <div className="w-11 h-11 rounded-xl bg-surface-container-high text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Icon name="bar_chart" size={24} />
            </div>
            <div className="min-w-0">
              <h3 className="font-title-sm text-title-sm text-on-surface group-hover:text-primary font-semibold transition-colors">
                <T gu="રિપોર્ટ્સ & વિશ્લેષણ" en="Reports & Analytics" hi="रिपोर्ट और विश्लेषण" />
              </h3>
              <p className="font-caption text-caption text-on-surface-variant truncate">
                <T
                  gu="માસિક DEO પ્રમાણપત્ર અને ઓડિટ"
                  en="Monthly DEO compliance & audit"
                  hi="मासिक DEO अनुपालन और ऑडिट"
                />
              </p>
            </div>
          </Link>
        </section>

        {/* Middle Section: Trends & Scheme Distribution (8 cols / 4 cols) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Weekly Applications & Sanctions Trend (8 cols) */}
          <div className="lg:col-span-8 rounded-xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/60 flex flex-col justify-between gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col">
                <h2 className="font-title-lg text-title-lg text-on-surface font-semibold">
                  <T
                    gu="સાપ્તાહિક અરજીઓ અને મંજૂરી પ્રવાહ"
                    en="Weekly Applications & Sanction Flow"
                    hi="साप्ताहिक आवेदन और स्वीकृति प्रवाह"
                  />
                </h2>
                <span className="font-caption text-caption text-on-surface-variant">
                  <T
                    gu="પ્રાપ્ત અરજીઓ vs. મંજૂર અરજીઓ (છેલ્લા ૬ અઠવાડિયા)"
                    en="Weekly Inflow vs. Verified Approvals (Last 6 Weeks)"
                    hi="प्राप्त आवेदन बनाम स्वीकृत आवेदन (अंतिम 6 सप्ताह)"
                  />
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-surface-container-highest" />
                  <span className="font-caption text-caption text-on-surface-variant">
                    <T gu="પ્રાપ્ત અરજીઓ (Inflow)" en="Received (Inflow)" hi="प्राप्त आवेदन" />
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-primary" />
                  <span className="font-caption text-caption text-on-surface-variant">
                    <T gu="મંજૂર અરજીઓ (Approved)" en="Approved" hi="स्वीकृत आवेदन" />
                  </span>
                </div>
              </div>
            </div>

            {/* Peak Callout Metric Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-lg bg-surface-container-low border border-outline-variant/40">
              <div className="flex items-center gap-2">
                <Icon name="bolt" size={20} className="text-secondary shrink-0" />
                <span className="font-body-sm text-body-sm text-on-surface">
                  <strong>
                    <T gu="પીક વોલ્યુમ:" en="Peak Volume:" hi="चरम मात्रा:" />
                  </strong>{" "}
                  <T
                    gu="૧લી ઓક્ટોબરે ૮૪ નવી અરજીઓ (નમો લક્ષ્મી યોજના લૉન્ચ બાદ)"
                    en="84 new applications on Oct 1st (Post Namo Lakshmi launch)"
                    hi="1 अक्टूबर को 84 नए आवेदन (नमो लक्ष्मी योजना लॉन्च के बाद)"
                  />
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="timer" size={20} className="text-tertiary shrink-0" />
                <span className="font-body-sm text-body-sm text-on-surface">
                  <T
                    gu="સરેરાશ નિકાલ સમય:"
                    en="Avg Turnaround:"
                    hi="औसत निपटान समय:"
                  />{" "}
                  <strong className="text-primary font-mono">
                    <T gu="૧.૪ દિવસ" en="1.4 Days Avg." hi="1.4 दिन औसत" />
                  </strong>
                </span>
              </div>
            </div>

            {/* Custom SVG / CSS Bar Visualization */}
            <div className="w-full flex flex-col justify-end">
              <div className="relative w-full h-48 flex items-end justify-between px-4 pb-2 border-b border-surface-container-high">
                {/* Background Grid Guide Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                  <div className="w-full border-t border-dashed border-outline-variant" />
                  <div className="w-full border-t border-dashed border-outline-variant" />
                  <div className="w-full border-t border-dashed border-outline-variant" />
                </div>

                {/* Bar 1: W1 Sep */}
                <div className="flex flex-col items-center gap-2 z-10 w-12 group">
                  <div className="flex items-end gap-1.5 h-36">
                    <div
                      className="w-4 bg-surface-container-highest rounded-t hover:bg-surface-dim transition-all h-[45%]"
                      title="Received: 42"
                    />
                    <div
                      className="w-4 bg-primary rounded-t hover:bg-primary-container transition-all h-[40%]"
                      title="Approved: 38"
                    />
                  </div>
                  <span className="font-caption text-caption text-on-surface-variant group-hover:text-on-surface">
                    <T gu="W1 સપ્ટે" en="W1 Sep" hi="W1 सित" />
                  </span>
                </div>

                {/* Bar 2: W2 Sep */}
                <div className="flex flex-col items-center gap-2 z-10 w-12 group">
                  <div className="flex items-end gap-1.5 h-36">
                    <div
                      className="w-4 bg-surface-container-highest rounded-t hover:bg-surface-dim transition-all h-[58%]"
                      title="Received: 54"
                    />
                    <div
                      className="w-4 bg-primary rounded-t hover:bg-primary-container transition-all h-[52%]"
                      title="Approved: 49"
                    />
                  </div>
                  <span className="font-caption text-caption text-on-surface-variant group-hover:text-on-surface">
                    <T gu="W2 સપ્ટે" en="W2 Sep" hi="W2 सित" />
                  </span>
                </div>

                {/* Bar 3: W3 Sep */}
                <div className="flex flex-col items-center gap-2 z-10 w-12 group">
                  <div className="flex items-end gap-1.5 h-36">
                    <div
                      className="w-4 bg-surface-container-highest rounded-t hover:bg-surface-dim transition-all h-[64%]"
                      title="Received: 60"
                    />
                    <div
                      className="w-4 bg-primary rounded-t hover:bg-primary-container transition-all h-[60%]"
                      title="Approved: 56"
                    />
                  </div>
                  <span className="font-caption text-caption text-on-surface-variant group-hover:text-on-surface">
                    <T gu="W3 સપ્ટે" en="W3 Sep" hi="W3 सित" />
                  </span>
                </div>

                {/* Bar 4: W4 Sep */}
                <div className="flex flex-col items-center gap-2 z-10 w-12 group">
                  <div className="flex items-end gap-1.5 h-36">
                    <div
                      className="w-4 bg-surface-container-highest rounded-t hover:bg-surface-dim transition-all h-[70%]"
                      title="Received: 68"
                    />
                    <div
                      className="w-4 bg-primary rounded-t hover:bg-primary-container transition-all h-[65%]"
                      title="Approved: 62"
                    />
                  </div>
                  <span className="font-caption text-caption text-on-surface-variant group-hover:text-on-surface">
                    <T gu="W4 સપ્ટે" en="W4 Sep" hi="W4 सित" />
                  </span>
                </div>

                {/* Bar 5: W1 Oct (Peak) */}
                <div className="flex flex-col items-center gap-2 z-10 w-12 group">
                  <div className="flex items-end gap-1.5 h-36 relative">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed-variant text-[10px] font-bold whitespace-nowrap">
                      <T gu="પીક ૮૪" en="Peak 84" hi="चरम 84" />
                    </span>
                    <div
                      className="w-4 bg-surface-container-highest rounded-t hover:bg-surface-dim transition-all h-[95%]"
                      title="Received: 84"
                    />
                    <div
                      className="w-4 bg-primary rounded-t hover:bg-primary-container transition-all h-[82%]"
                      title="Approved: 74"
                    />
                  </div>
                  <span className="font-caption text-caption font-semibold text-primary">
                    <T gu="W1 ઑક્ટો" en="W1 Oct" hi="W1 अक्टू" />
                  </span>
                </div>

                {/* Bar 6: W2 Oct (Current) */}
                <div className="flex flex-col items-center gap-2 z-10 w-12 group">
                  <div className="flex items-end gap-1.5 h-36">
                    <div
                      className="w-4 bg-surface-container-highest rounded-t hover:bg-surface-dim transition-all h-[76%]"
                      title="Received: 72"
                    />
                    <div
                      className="w-4 bg-primary rounded-t hover:bg-primary-container transition-all h-[60%]"
                      title="Approved: 58 (In Progress)"
                    />
                  </div>
                  <span className="font-caption text-caption text-on-surface-variant group-hover:text-on-surface whitespace-nowrap">
                    <T gu="W2 ઑક્ટો (ચાલુ)" en="W2 Oct (Active)" hi="W2 अक्टू (चालू)" />
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap justify-between items-center text-on-surface-variant font-caption text-[11px] pt-3 px-2 gap-2">
                <span>
                  <T
                    gu="સરેરાશ ૧૦૦% આધાર ઓટો-સિડેડ અરજીઓ ૮ કલાકમાં રાજ્ય પોર્ટલ પર મોકલાય છે"
                    en="100% Aadhaar auto-seeded applications dispatched to State Portal within 8 hours"
                    hi="100% आधार ऑटो-सीडेड आवेदन 8 घंटे में राज्य पोर्टल पर भेजे जाते हैं"
                  />
                </span>
                <Link href="/school/reports" className="text-primary font-medium hover:underline inline-flex items-center gap-0.5">
                  <T gu="વિગતવાર ટાઈમલાઈન જુઓ →" en="View detailed timeline →" hi="विस्तृत समयरेखा देखें →" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Scheme-Wise Breakdown (4 cols) */}
          <div className="lg:col-span-4 rounded-xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/60 flex flex-col justify-between gap-5">
            <div className="flex items-center justify-between">
              <h2 className="font-title-lg text-title-lg text-on-surface font-semibold">
                <T gu="યોજનાવાર અરજીઓની સ્થિતિ" en="Scheme Breakdown" hi="योजनावार आवेदन स्थिति" />
              </h2>
              <span className="font-caption text-caption text-on-surface-variant font-mono">
                <T gu="કુલ: ૮૪૨" en="Total: 842" hi="कुल: 842" />
              </span>
            </div>

            {/* Compact Donut + Stats Centerpiece */}
            <div className="flex items-center gap-4 py-1">
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Background circle */}
                  <path
                    className="text-surface-container-high"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4.5"
                  />
                  {/* Namo Lakshmi 42% */}
                  <path
                    className="text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="42, 100"
                    strokeDashoffset="0"
                    strokeWidth="4.5"
                  />
                  {/* Saraswati Sadhana 24% */}
                  <path
                    className="text-secondary"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="24, 100"
                    strokeDashoffset="-42"
                    strokeWidth="4.5"
                  />
                  {/* Gyan Sadhana 18% */}
                  <path
                    className="text-tertiary"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="18, 100"
                    strokeDashoffset="-66"
                    strokeWidth="4.5"
                  />
                  {/* OBC Pre-Matric 12% */}
                  <path
                    className="text-outline"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="12, 100"
                    strokeDashoffset="-84"
                    strokeWidth="4.5"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-title-lg text-title-lg font-bold text-on-surface leading-none font-mono">
                    842
                  </span>
                  <span className="font-caption text-[10px] text-on-surface-variant uppercase">
                    <T gu="અરજીઓ" en="Apps" hi="आवेदन" />
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1 text-on-surface-variant font-caption">
                <span className="font-medium text-on-surface">
                  <T gu="ટોચની યોજનાઓ:" en="Top Distribution:" hi="शीर्ष वितरण:" />
                </span>
                <span>
                  <T
                    gu="નમો લક્ષ્મી યોજનામાં સહુથી વધુ પ્રગતિ."
                    en="Namo Lakshmi has maximum volume."
                    hi="नमो लक्ष्मी योजना में सर्वाधिक प्रगति।"
                  />
                </span>
                <span className="text-primary font-semibold">
                  <T
                    gu="૯૮.૨% આધાર વેરિફિકેશન સફળ"
                    en="98.2% Aadhaar match success"
                    hi="98.2% आधार सत्यापन सफल"
                  />
                </span>
              </div>
            </div>

            {/* Scheme breakdown progress list */}
            <div className="flex flex-col gap-3">
              {/* Item 1 */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between font-label-md text-label-md">
                  <span className="text-on-surface flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                    <T
                      gu="નમો લક્ષ્મી યોજના"
                      en="Namo Lakshmi Scheme"
                      hi="नमो लक्ष्मी योजना"
                    />
                  </span>
                  <span className="font-mono text-on-surface font-semibold">42% (354)</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "42%" }} />
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between font-label-md text-label-md">
                  <span className="text-on-surface flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                    <T
                      gu="સરસ્વતી સાધના સાયકલ"
                      en="Saraswati Sadhana Cycle"
                      hi="सरस्वती साधना साइकिल"
                    />
                  </span>
                  <span className="font-mono text-on-surface font-semibold">24% (202)</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: "24%" }} />
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between font-label-md text-label-md">
                  <span className="text-on-surface flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                    <T
                      gu="જ્ઞાન સાધના સ્કોલરશિપ"
                      en="Gyan Sadhana Scholarship"
                      hi="ज्ञान साधना छात्रवृत्ति"
                    />
                  </span>
                  <span className="font-mono text-on-surface font-semibold">18% (152)</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                  <div className="h-full bg-tertiary rounded-full" style={{ width: "18%" }} />
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between font-label-md text-label-md">
                  <span className="text-on-surface flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-outline" />
                    <T
                      gu="OBC / EWS પ્રી-મેટ્રિક સહાય"
                      en="OBC / EWS Pre-Matric Aid"
                      hi="ओबीसी / ईडब्ल्यूएस प्री-मैट्रिक सहायता"
                    />
                  </span>
                  <span className="font-mono text-on-surface font-semibold">12% (101)</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                  <div className="h-full bg-outline rounded-full" style={{ width: "12%" }} />
                </div>
              </div>

              {/* Item 5 */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between font-label-md text-label-md">
                  <span className="text-on-surface-variant flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
                    <T
                      gu="અન્ય રાજ્ય સ્કોલરશિપ"
                      en="Other State Scholarships"
                      hi="अन्य राज्य छात्रवृत्ति"
                    />
                  </span>
                  <span className="font-mono text-on-surface-variant font-semibold">4% (33)</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                  <div className="h-full bg-outline-variant rounded-full" style={{ width: "4%" }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lower Section: Priority Exception Table & Action Panels (8 cols / 4 cols) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Priority Attention Table (Recent verification queue preview - 8 cols) */}
          <div className="lg:col-span-8 rounded-xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/60 flex flex-col justify-between gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h2 className="font-title-lg text-title-lg text-on-surface font-semibold">
                  <T
                    gu="તાત્કાલિક ધ્યાન જરૂરી અરજીઓ"
                    en="Priority Verification Queue"
                    hi="तत्काल ध्यान आवश्यक आवेदन"
                  />
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md font-bold">
                  <T gu="૫ કેસ ધ્યાન માંગે છે" en="5 Critical Cases" hi="5 महत्वपूर्ण मामले" />
                </span>
              </div>
              <Link
                href="/school/queue"
                className="font-label-lg text-label-lg text-primary hover:underline flex items-center gap-1 group"
              >
                <span>
                  <T gu="તમામ ચકાસણી કતાર જુઓ" en="View All In Queue" hi="सभी सत्यापन कतार देखें" />
                </span>
                <Icon name="arrow_forward" size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Responsive Exception Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
                    <th className="py-3 px-4 rounded-l-lg">
                      <T gu="વિદ્યાર્થી વિગત" en="Student Details" hi="छात्र विवरण" />
                    </th>
                    <th className="py-3 px-3">
                      <T gu="યોજના" en="Scheme" hi="योजना" />
                    </th>
                    <th className="py-3 px-3">
                      <T gu="સમસ્યા" en="Issue Detected" hi="समस्या" />
                    </th>
                    <th className="py-3 px-3">
                      <T gu="સ્થિતિ" en="Status" hi="स्थिति" />
                    </th>
                    <th className="py-3 px-4 rounded-r-lg text-right">
                      <T gu="કાર્યવાહી" en="Action" hi="कार्रवाई" />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high font-body-sm text-body-sm">
                  {PRIORITY_STUDENTS.map((student) => (
                    <tr key={student.id} className="hover:bg-surface-container-low/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={student.nameEn} size="sm" className="ring-1 ring-outline-variant" />
                          <div className="flex flex-col min-w-0">
                            <span className="font-title-sm text-title-sm text-on-surface font-semibold truncate">
                              <T gu={student.name} en={student.nameEn} hi={student.nameEn} />
                            </span>
                            <span className="font-caption text-caption text-on-surface-variant truncate">
                              <T gu={student.grade} en={student.gradeEn} hi={student.gradeEn} /> • CTS:{" "}
                              <span className="font-mono text-on-surface">{student.ctsNumber}</span>
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-label-md text-[11px] font-medium ${student.schemeBadgeClass}`}>
                          <T gu={student.scheme} en={student.schemeEn} hi={student.schemeEn} />
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className={`flex items-center gap-1.5 ${student.issueSeverityClass}`}>
                          <Icon name={student.issueIcon} size={16} />
                          <span className="font-medium text-body-sm">
                            <T gu={student.issue} en={student.issueEn} hi={student.issueHi} />
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <StatusChip
                          status={student.status}
                          label={<T gu={student.statusLabel.gu} en={student.statusLabel.en} hi={student.statusLabel.hi} />}
                        />
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/school/queue/${student.id}`}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg bg-surface-container text-primary hover:bg-primary hover:text-on-primary font-label-md text-label-md transition-colors"
                        >
                          <T gu="સમીક્ષા કરો" en="Review" hi="समीक्षा करें" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* SLA Footer & Bulk Reminder */}
            <div className="flex flex-wrap items-center justify-between text-on-surface-variant font-caption text-caption pt-2 gap-3 border-t border-surface-container-high">
              <span className="flex items-center gap-1.5">
                <Icon name="schedule" size={15} className="text-secondary" />
                <T
                  gu="આ તમામ અરજીઓ ૪૮ કલાકની અંદર નિકાલ કરવી ફરજિયાત છે (State Compliance SLA)"
                  en="Resolution mandatory within 48 hours (State Compliance SLA)"
                  hi="48 घंटे के भीतर अनिवार्य निपटान (राज्य अनुपालन SLA)"
                />
              </span>
              <button
                type="button"
                onClick={handleSendBulkSms}
                className="text-primary font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Icon name={smsSent ? "check" : "sms"} size={16} />
                <span>
                  {smsSent ? (
                    <T gu="વાલીઓને SMS મોકલાઈ ગયો!" en="SMS Sent to 5 Parents!" hi="अभिभावकों को एसएमएस भेजा गया!" />
                  ) : (
                    <T gu="બલ્ક SMS રિમાઇન્ડર મોકલો" en="Send Bulk SMS Reminder" hi="बल्क एसएमएस रिमाइंडर भेजें" />
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* Right Column: Stacked Action Cards (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Card A: Saraswati Sadhana Cycle Distribution Progress */}
            <div className="rounded-xl bg-surface-container-lowest p-5 shadow-sm border border-outline-variant/60 flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="pedal_bike" size={22} className="text-primary" />
                  <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                    <T
                      gu="સરસ્વતી સાધના સાયકલ પ્રગતિ"
                      en="Saraswati Cycle Progress"
                      hi="सरस्वती साधना साइकिल प्रगति"
                    />
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-label-md text-[11px] font-bold">
                  <T gu="૮૦% પૂર્ણ" en="80% Done" hi="80% पूर्ण" />
                </span>
              </div>

              {/* Gauge / Stats Widget */}
              <div className="flex items-center gap-4 p-3 rounded-lg bg-surface-container-low border border-outline-variant/40">
                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-surface-container-high"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="text-primary"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="80, 100"
                      strokeLinecap="round"
                      strokeWidth="4"
                    />
                  </svg>
                  <span className="absolute font-title-md text-title-md font-bold text-on-surface font-mono">
                    80%
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                    <span className="font-body-sm text-body-sm text-on-surface font-semibold">
                      <T gu="૯૬ વિતરિત (96 Delivered)" en="96 Delivered" hi="96 वितरित" />
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      <T gu="૨૪ બાકી (24 In Stock)" en="24 In Stock" hi="24 शेष" />
                    </span>
                  </div>
                </div>
              </div>

              <p className="font-caption text-caption text-on-surface-variant">
                <T
                  gu="ધોરણ ૯ ની કન્યા વિદ્યાર્થીઓને સાયકલ હેન્ડઓવર કરવા માટે ફોટો અને ક્યુઆર કોડ ઓથેન્ટિકેશન જરૂરી છે."
                  en="Photo and QR code authentication mandatory before releasing cycles to Class 9 girl students."
                  hi="कक्षा 9 की छात्राओं को साइकिल वितरण के लिए फोटो और क्यूआर कोड सत्यापन अनिवार्य है।"
                />
              </p>

              {/* CTA Button with Bicycle Icon */}
              <Link
                href="/school/cycles"
                className="w-full h-11 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-sm"
              >
                <Icon name="qr_code_scanner" size={20} />
                <span>
                  <T
                    gu="સાયકલ હેન્ડઓવર શરૂ કરો (Scan QR)"
                    en="Start Cycle Handover (Scan QR)"
                    hi="साइकिल वितरण शुरू करें (QR स्कैन)"
                  />
                </span>
              </Link>
            </div>

            {/* Card B: Quick Actions Panel */}
            <div className="rounded-xl bg-surface-container-lowest p-5 shadow-sm border border-outline-variant/60 flex flex-col justify-between gap-3">
              <h3 className="font-title-md text-title-md text-on-surface font-semibold flex items-center gap-2">
                <Icon name="flash_on" size={20} className="text-primary" />
                <span>
                  <T
                    gu="ઝડપી વહીવટી કાર્યો"
                    en="Administrative Tasks"
                    hi="त्वरित प्रशासनिक कार्य"
                  />
                </span>
              </h3>

              <div className="flex flex-col gap-2">
                {/* Action 1 */}
                <Link
                  href="/school/records"
                  className="w-full p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-container text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <Icon name="upload_file" size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                        <T gu="હાજરી Excel અપલોડ કરો" en="Upload Attendance Master" hi="उपस्थिति एक्सेल अपलोड करें" />
                      </span>
                      <span className="font-caption text-caption text-on-surface-variant">
                        <T gu="સરલ પોર્ટલ સુસંગત ફોર્મેટ" en="Saral Portal Compliant Format" hi="सरल पोर्टल अनुपालक प्रारूप" />
                      </span>
                    </div>
                  </div>
                  <Icon name="arrow_forward" size={18} className="text-outline group-hover:text-primary transition-colors" />
                </Link>

                {/* Action 2 */}
                <Link
                  href="/school/records"
                  className="w-full p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-container text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <Icon name="sync_alt" size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                        <T gu="નવા વિદ્યાર્થી રેકોર્ડ સિંક" en="Sync CTS Portal Master" hi="नए छात्र रिकॉर्ड सिंक" />
                      </span>
                      <span className="font-caption text-caption text-on-surface-variant">
                        <T gu="રાજ્ય ડેટાબેઝમાંથી સીધું આયાત" en="Direct State DB Import" hi="राज्य डेटाबेस से सीधा आयात" />
                      </span>
                    </div>
                  </div>
                  <Icon name="arrow_forward" size={18} className="text-outline group-hover:text-primary transition-colors" />
                </Link>

                {/* Action 3 */}
                <Link
                  href="/school/reports"
                  className="w-full p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-container text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <Icon name="picture_as_pdf" size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                        <T gu="માસિક અનુપાલન રિપોર્ટ PDF" en="DEO Compliance Certificate" hi="मासिक अनुपालन रिपोर्ट PDF" />
                      </span>
                      <span className="font-caption text-caption text-on-surface-variant">
                        <T gu="ડિજિટલ સહી થયેલ રિપોર્ટ" en="Digitally Signed Report" hi="डिजिटल हस्ताक्षरित रिपोर्ट" />
                      </span>
                    </div>
                  </div>
                  <Icon name="arrow_forward" size={18} className="text-outline group-hover:text-primary transition-colors" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </OfficerShell>
  );
}
