"use client";

import React, { useState, useEffect } from "react";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { KpiCard, StatusChip } from "@/components/ui";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// ── Types ───────────────────────────────────────────────────────────────────
interface SchemeData {
  id: string;
  code: string;
  nameGu: string;
  nameEn: string;
  nameHi: string;
  deptGu: string;
  deptEn: string;
  deptHi: string;
  allocated: number; // in Cr
  sanctioned: number; // in Cr
  disbursed: number; // in Cr
  utilization: number; // percentage
  beneficiaries: string;
  status: "approved" | "inprogress" | "pending";
}

interface DistrictData {
  id: string;
  nameGu: string;
  nameEn: string;
  nameHi: string;
  allocated: number; // in Cr
  disbursed: number; // in Cr
  variance: number; // in Cr
  utilization: number; // percentage
  isWarning: boolean;
}

interface BatchData {
  batchId: string;
  dateGu: string;
  dateEn: string;
  dateHi: string;
  schemeGu: string;
  schemeEn: string;
  schemeHi: string;
  beneficiaries: string;
  amount: string;
  status: "approved" | "inprogress" | "rejected";
  statusLabelGu: string;
  statusLabelEn: string;
  statusLabelHi: string;
}

// ── Mock Data: 6 Schemes ────────────────────────────────────────────────────
const SCHEMES: SchemeData[] = [
  {
    id: "nl",
    code: "SCH-GJ-2025-NL01",
    nameGu: "નમો લક્ષ્મી યોજના",
    nameEn: "Namo Lakshmi Yojana",
    nameHi: "नमो लक्ष्मी योजना",
    deptGu: "કન્યા કેળવણી પ્રોત્સાહન",
    deptEn: "Girl Child Education Incentive",
    deptHi: "बालिका शिक्षा प्रोत्साहन",
    allocated: 520.0,
    sanctioned: 495.0,
    disbursed: 485.0,
    utilization: 93.3,
    beneficiaries: "9,42,800",
    status: "approved",
  },
  {
    id: "ss",
    code: "SCH-GJ-2025-SS88",
    nameGu: "સરસ્વતી સાધના સાયકલ યોજના",
    nameEn: "Saraswati Sadhana Cycle Yojana",
    nameHi: "सरस्वती साधना साइकिल योजना",
    deptGu: "ધોરણ ૯ કન્યા સાયકલ સહાય",
    deptEn: "Class 9 Girl Cycle Aid",
    deptHi: "कक्षा 9 बालिका साइकिल सहायता",
    allocated: 120.0,
    sanctioned: 115.0,
    disbursed: 112.0,
    utilization: 93.3,
    beneficiaries: "1,12,000",
    status: "approved",
  },
  {
    id: "ob",
    code: "SCH-GJ-2025-OB22",
    nameGu: "OBC / SEBC પૂર્વ-મેટ્રિક શિષ્યવૃત્તિ",
    nameEn: "OBC / SEBC Pre-Matric Scholarship",
    nameHi: "ओबीसी / एसईबीसी प्री-मैट्रिक छात्रवृत्ति",
    deptGu: "સામાજિક ન્યાય અને અધિકારીતા વિભાગ",
    deptEn: "Dept of Social Justice & Empowerment",
    deptHi: "सामाजिक न्याय एवं अधिकारिता विभाग",
    allocated: 260.0,
    sanctioned: 250.0,
    disbursed: 245.0,
    utilization: 94.2,
    beneficiaries: "6,98,000",
    status: "approved",
  },
  {
    id: "gs",
    code: "SCH-GJ-2025-GS09",
    nameGu: "મુખ્યમંત્રી જ્ઞાન સાધના સ્કોલરશિપ",
    nameEn: "CM Gyan Sadhana Scholarship",
    nameHi: "मुख्यमंत्री ज्ञान साधना छात्रवृत्ति",
    deptGu: "મેરિટ પ્રવેશ યોજના",
    deptEn: "Merit Entrance Scheme",
    deptHi: "मेरिट प्रवेश योजना",
    allocated: 195.0,
    sanctioned: 188.0,
    disbursed: 182.0,
    utilization: 93.3,
    beneficiaries: "72,800",
    status: "approved",
  },
  {
    id: "nm",
    code: "SCH-GJ-2025-NM04",
    nameGu: "NMMS મેરિટ શિષ્યવૃત્તિ",
    nameEn: "NMMS Merit Scholarship",
    nameHi: "एनएमएमएस मेरिट छात्रवृत्ति",
    deptGu: "કેન્દ્ર-રાજ્ય સહભાગિતા",
    deptEn: "Central-State Partnership",
    deptHi: "केंद्र-राज्य सहभागिता",
    allocated: 105.0,
    sanctioned: 100.0,
    disbursed: 96.0,
    utilization: 91.4,
    beneficiaries: "80,000",
    status: "approved",
  },
  {
    id: "nsv",
    code: "SCH-GJ-2025-NS15",
    nameGu: "નમો સરસ્વતી વિજ્ઞાન સાધના",
    nameEn: "Namo Saraswati Vigyan Sadhana",
    nameHi: "नमो सरस्वती विज्ञान साधना",
    deptGu: "વિજ્ઞાન પ્રવાહ વિદ્યાર્થી પ્રોત્સાહન",
    deptEn: "Science Stream Student Incentive",
    deptHi: "विज्ञान संकाय छात्र प्रोत्साहन",
    allocated: 175.0,
    sanctioned: 135.0,
    disbursed: 120.5,
    utilization: 68.8,
    beneficiaries: "48,200",
    status: "inprogress",
  },
];

// ── Mock Data: 5 Districts ──────────────────────────────────────────────────
const DISTRICTS: DistrictData[] = [
  {
    id: "amd",
    nameGu: "અમદાવાદ",
    nameEn: "Ahmedabad",
    nameHi: "अहमदाबाद",
    allocated: 185.0,
    disbursed: 168.5,
    variance: 16.5,
    utilization: 91.1,
    isWarning: false,
  },
  {
    id: "srt",
    nameGu: "સુરત",
    nameEn: "Surat",
    nameHi: "सूरत",
    allocated: 142.0,
    disbursed: 129.2,
    variance: 12.8,
    utilization: 91.0,
    isWarning: false,
  },
  {
    id: "rjt",
    nameGu: "રાજકોટ",
    nameEn: "Rajkot",
    nameHi: "राजकोट",
    allocated: 98.0,
    disbursed: 86.4,
    variance: 11.6,
    utilization: 88.2,
    isWarning: false,
  },
  {
    id: "and",
    nameGu: "આણંદ",
    nameEn: "Anand",
    nameHi: "आनंद",
    allocated: 64.0,
    disbursed: 43.5,
    variance: 20.5,
    utilization: 68.0, // < 70% Alert
    isWarning: true,
  },
  {
    id: "dhd",
    nameGu: "દાહોદ",
    nameEn: "Dahod",
    nameHi: "दाहोद",
    allocated: 76.0,
    disbursed: 51.0,
    variance: 25.0,
    utilization: 67.1, // < 70% Alert
    isWarning: true,
  },
];

// ── Mock Data: Recent Batches ───────────────────────────────────────────────
const BATCHES: BatchData[] = [
  {
    batchId: "PFMS-GJ-2026-B8841",
    dateGu: "૨૬ ફેબ્રુ, ૧૧:૪૫ AM",
    dateEn: "26 Feb, 11:45 AM",
    dateHi: "26 फर, 11:45 AM",
    schemeGu: "નમો લક્ષ્મી (તબક્કો ૩)",
    schemeEn: "Namo Lakshmi (Phase 3)",
    schemeHi: "नमो लक्ष्मी (चरण 3)",
    beneficiaries: "55,420",
    amount: "₹ 27.71 Cr",
    status: "approved",
    statusLabelGu: "સફળ / પ્રોસેસ્ડ",
    statusLabelEn: "Processed",
    statusLabelHi: "प्रसंस्कृत",
  },
  {
    batchId: "PFMS-GJ-2026-B8840",
    dateGu: "૨૬ ફેબ્રુ, ૦૯:૧૫ AM",
    dateEn: "26 Feb, 09:15 AM",
    dateHi: "26 फर, 09:15 AM",
    schemeGu: "સાયકલ વિતરણ ડીબીટી",
    schemeEn: "Cycle Distribution DBT",
    schemeHi: "साइकिल वितरण डीबीटी",
    beneficiaries: "12,000",
    amount: "₹ 4.80 Cr",
    status: "approved",
    statusLabelGu: "સફળ / પ્રોસેસ્ડ",
    statusLabelEn: "Processed",
    statusLabelHi: "प्रसंस्कृत",
  },
  {
    batchId: "PFMS-GJ-2026-B8839",
    dateGu: "૨૫ ફેબ્રુ, ૦૪:૫૦ PM",
    dateEn: "25 Feb, 04:50 PM",
    dateHi: "25 फर, 04:50 PM",
    schemeGu: "નમો સરસ્વતી વિજ્ઞાન",
    schemeEn: "Namo Saraswati Vigyan",
    schemeHi: "नमो सरस्वती विज्ञान",
    beneficiaries: "18,500",
    amount: "₹ 18.50 Cr",
    status: "inprogress",
    statusLabelGu: "ટ્રાન્ઝિટમાં છે",
    statusLabelEn: "In Transit",
    statusLabelHi: "पारगमन में",
  },
  {
    batchId: "PFMS-GJ-2026-B8838",
    dateGu: "૨૫ ફેબ્રુ, ૦૨:૧૦ PM",
    dateEn: "25 Feb, 02:10 PM",
    dateHi: "25 फर, 02:10 PM",
    schemeGu: "જ્ઞાન સાધના સ્કોલરશિપ",
    schemeEn: "Gyan Sadhana Scholarship",
    schemeHi: "ज्ञान साधना छात्रवृत्ति",
    beneficiaries: "3,120",
    amount: "₹ 3.12 Cr",
    status: "rejected",
    statusLabelGu: "અટકેલ / અપવાદ",
    statusLabelEn: "Exceptions",
    statusLabelHi: "अपवाद",
  },
];

export default function FundTrackerPage() {
  const [activeTab, setActiveTab] = useState<"schemes" | "districts" | "batches" | "exceptions">("schemes");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncTimestamp, setSyncTimestamp] = useState<string>("14:32 IST");
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [retriedCount, setRetriedCount] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} IST`;
      setSyncTimestamp(timeStr);
      setIsSyncing(false);
      setExportNotice("PFMS સર્વર સાથે સફળ સિંક્રનાઇઝેશન પૂર્ણ થયું.");
      setTimeout(() => setExportNotice(null), 4000);
    }, 1200);
  };

  const handleExportReport = () => {
    // Generate simulated CSV export
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Scheme Name,Allocated (Cr),Sanctioned (Cr),Disbursed (Cr),Utilization %,Beneficiaries\n" +
      SCHEMES.map(
        (s) =>
          `"${s.nameEn}",${s.allocated},${s.sanctioned},${s.disbursed},${s.utilization}%,"${s.beneficiaries}"`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Vidya_Pragati_Setu_DBT_Reconciliation_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice("રિકન્સિલિએશન રિપોર્ટ સફળતાપૂર્વક ડાઉનલોડ થયો.");
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handleRetryExceptions = () => {
    setRetriedCount((prev) => prev + 1);
    setExportNotice("બધા સુધારેલ ૮,૧૨૦ ખાતાઓ પર PFMS પુનઃચુકવણી બેચ મોકલાઈ ગઈ છે.");
    setTimeout(() => setExportNotice(null), 4000);
  };

  // Recharts Chart Data
  const chartData = SCHEMES.map((s) => ({
    name: s.nameEn.split(" ")[0] + " " + (s.nameEn.split(" ")[1] || ""),
    Allocated: s.allocated,
    Disbursed: s.disbursed,
    utilization: s.utilization,
  }));

  return (
    <OfficerShell role="admin">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Toast / Alert notification banner */}
        {exportNotice && (
          <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl shadow-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <Icon name="verified" size={20} className="text-emerald-700" />
              <span className="font-label-lg text-label-lg">{exportNotice}</span>
            </div>
            <button
              onClick={() => setExportNotice(null)}
              className="text-emerald-700 hover:text-emerald-900 p-1 rounded-lg"
            >
              <Icon name="close" size={18} />
            </button>
          </div>
        )}

        {/* ── 1. Header & Controls Zone ────────────────────────────────────── */}
        <section className="flex flex-col gap-4">
          {/* Meta breadcrumb & live audit reference */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-primary/10 text-primary">
                <Icon name="flag" size={15} />
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                <T
                  gu="શિક્ષણ વિભાગ, ગુજરાત સરકાર"
                  en="Education Department, Government of Gujarat"
                  hi="शिक्षा विभाग, गुजरात सरकार"
                />
              </span>
              <span className="text-outline-variant font-bold">•</span>
              <span className="font-label-md text-label-md text-tertiary font-semibold tracking-wide">
                <T
                  gu="સંદર્ભ: FIN-PFMS/2026/DBT-SETTLE/04"
                  en="Ref: FIN-PFMS/2026/DBT-SETTLE/04"
                  hi="संदर्भ: FIN-PFMS/2026/DBT-SETTLE/04"
                />
              </span>
            </div>

            {/* PFMS & APBS Live Badge */}
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 font-label-md text-label-md font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <T
                  gu="NPCI/APBS લિંક: કાર્યરત (99.98% અપટાઇમ)"
                  en="NPCI/APBS Link: Active (99.98% Uptime)"
                  hi="NPCI/APBS लिंक: सक्रिय (99.98% अपटाइम)"
                />
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-caption text-caption font-medium">
                <Icon name="schedule" size={15} className="text-primary" />
                <T
                  gu={`છેલ્લું સિંક: ${syncTimestamp}`}
                  en={`Last synced: ${syncTimestamp}`}
                  hi={`अंतिम सिंक: ${syncTimestamp}`}
                />
              </span>
            </div>
          </div>

          {/* Title & Action Buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col max-w-3xl">
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight leading-tight">
                <T
                  gu="રાજ્ય ફંડ ટ્રેકર અને DBT રિકન્સિલિએશન"
                  en="State Fund Tracker & DBT Reconciliation"
                  hi="राज्य फंड ट्रैकर और डीबीटी मिलान"
                />
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                <T
                  gu="નાણાકીય વર્ષ ૨૦૨૫-૨૬ અંતર્ગત તમામ યોજનાઓનું ટ્રેઝરી બજેટ, PFMS પેમેન્ટ ગેટવે સેટલમેન્ટ અને બેંક જમા ટ્રેકિંગ"
                  en="Treasury budget, PFMS payment gateway settlement, and bank credit tracking for FY 2025-26 schemes"
                  hi="वित्तीय वर्ष 2025-26 के तहत सभी योजनाओं का ट्रेजरी बजट, PFMS पेमेंट गेटवे सेटलमेंट और बैंक क्रेडिट ट्रैकिंग"
                />
              </p>
            </div>

            {/* Action Buttons Group */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Download / Export Button */}
              <button
                onClick={handleExportReport}
                className="btn-outline flex items-center gap-2 h-11 px-4 shadow-sm"
                title="Download CSV/XLSX"
              >
                <Icon name="download" size={20} className="text-primary" />
                <span>
                  <T
                    gu="RTI / CAG ઓડિટ રિપોર્ટ (.csv)"
                    en="Audit Report (.csv)"
                    hi="ऑडिट रिपोर्ट (.csv)"
                  />
                </span>
              </button>

              {/* Sync Now Button */}
              <button
                onClick={handleSyncNow}
                disabled={isSyncing}
                className="btn-primary flex items-center gap-2 h-11 px-4 shadow-sm"
              >
                <Icon
                  name="sync"
                  size={20}
                  className={isSyncing ? "animate-spin" : ""}
                />
                <span>
                  {isSyncing ? (
                    <T gu="સિંક્રનાઇઝ થઈ રહ્યું છે..." en="Syncing with PFMS..." hi="सिंक हो रहा है..." />
                  ) : (
                    <T gu="PFMS લાઈવ સિંક (Sync Now)" en="PFMS Sync Now" hi="पीएफएमएस लाइव सिंक" />
                  )}
                </span>
              </button>

              {/* Initiate New DBT Batch */}
              <button
                onClick={() => {
                  setExportNotice("નવી DBT બેચ વેલિડેશન પાઇપલાઇનમાં દાખલ થઈ છે.");
                  setTimeout(() => setExportNotice(null), 4000);
                }}
                className="btn-cta flex items-center gap-2 h-11 px-4 shadow-sm"
              >
                <Icon name="send_to_mobile" size={20} />
                <span>
                  <T
                    gu="નવી DBT બેચ શરૂ કરો"
                    en="Initiate New DBT Batch"
                    hi="नई डीबीटी बैच शुरू करें"
                  />
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* ── 2. Summary KPI Cards (Fund Allocation vs Disbursed) ───────────── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            icon="account_balance_wallet"
            label={
              <T
                gu="કુલ ફાળવેલ બજેટ (Sanctioned)"
                en="Total Sanctioned Budget"
                hi="कुल स्वीकृत बजट"
              />
            }
            value="₹ 1,500.0 Cr"
            sub={
              <T
                gu="૧૦૦% રાજ્ય કેબિનેટ મંજૂર"
                en="100% State Cabinet Sanctioned"
                hi="100% राज्य कैबिनेट स्वीकृत"
              />
            }
            accent="text-primary"
          />

          <KpiCard
            icon="payments"
            label={
              <T
                gu="કુલ ચૂકવેલ DBT (Disbursed)"
                en="Total Disbursed (DBT)"
                hi="कुल वितरित डीबीटी"
              />
            }
            value="₹ 1,240.5 Cr"
            sub={
              <T
                gu="૮૨.૭% સફળ ચૂકવણી • ૨૧.૨ લાખ લાભાર્થી"
                en="82.7% Credited • 21.2L Students"
                hi="82.7% सफल भुगतान • 21.2 लाख लाभार्थी"
              />
            }
            accent="text-emerald-700"
          />

          <KpiCard
            icon="pending_actions"
            label={
              <T
                gu="બાકી / પ્રોસેસિંગ (Pending in PFMS)"
                en="Pending in Pipeline"
                hi="प्रक्रियाधीन / लंबित"
              />
            }
            value="₹ 240.0 Cr"
            sub={
              <T
                gu="૧૬.૦% ટ્રાન્ઝિટ & વેરિફિકેશન"
                en="16.0% In-Transit & Verification"
                hi="16.0% पारगमन और सत्यापन"
              />
            }
            accent="text-tertiary"
          />

          <KpiCard
            icon="error_outline"
            label={
              <T
                gu="અટકેલ / પુનઃપ્રયાસ (Lapsed / Exceptions)"
                en="Lapsed / Exceptions"
                hi="अटके / अपवाद लेनदेन"
              />
            }
            value="₹ 19.5 Cr"
            sub={
              <T
                gu="૧.૩% આધાર/ખાતા સુધારા જરૂરી"
                en="1.3% Needs Remediation"
                hi="1.3% सुधार की आवश्यकता"
              />
            }
            accent="text-error"
          />
        </section>

        {/* ── 3. Waterfall Flow: Treasury to Bank Account ───────────────────── */}
        <section className="card p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Icon name="account_tree" size={22} className="text-primary" />
              <h2 className="font-title-md text-title-md text-on-surface">
                <T
                  gu="બજેટ થી બેંક ખાતા સુધીનો સ્ટેપવાઈઝ ફ્લો (Treasury Waterfall)"
                  en="Treasury to Bank Account Waterfall Flow"
                  hi="ट्रेजरी से बैंक खाते तक चरणबद्ध प्रवाह"
                />
              </h2>
            </div>
            <span className="font-label-md text-label-md px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-medium">
              <T
                gu="રીઅલ-ટાઇમ ક્લિયરિંગ સ્ટેટ્સ"
                en="Real-time Clearing Status"
                hi="रीयल-टाइम क्लियरिंग स्थिति"
              />
            </span>
          </div>

          {/* 5-Stage Stepper Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {/* Stage 1 */}
            <div className="flex flex-col bg-surface-container-low rounded-lg p-3">
              <div className="flex items-center justify-between text-caption font-caption text-on-surface-variant mb-1">
                <span className="uppercase tracking-wider font-semibold">
                  <T gu="સ્ટેજ ૧ • રાજ્ય મંજૂરી" en="Stage 1 • State Allocation" hi="चरण 1 • राज्य आवंटन" />
                </span>
                <span className="font-label-md font-bold text-primary">100%</span>
              </div>
              <span className="font-title-md text-title-md text-on-surface font-bold">₹ 1,500.0 Cr</span>
              <span className="font-caption text-caption text-on-surface-variant truncate">
                <T gu="કુલ ફાળવેલ બજેટ" en="Total Allocated Budget" hi="कुल आवंटित बजट" />
              </span>
              <div className="w-full bg-surface-container-highest h-2 rounded-full mt-2.5 overflow-hidden">
                <div className="bg-primary h-full rounded-full w-full" />
              </div>
            </div>

            {/* Stage 2 */}
            <div className="flex flex-col bg-surface-container-low rounded-lg p-3">
              <div className="flex items-center justify-between text-caption font-caption text-on-surface-variant mb-1">
                <span className="uppercase tracking-wider font-semibold">
                  <T gu="સ્ટેજ ૨ • વહીવટી મંજૂર" en="Stage 2 • Admin Sanction" hi="चरण 2 • प्रशासनिक स्वीकृति" />
                </span>
                <span className="font-label-md font-bold text-primary-container">88.0%</span>
              </div>
              <span className="font-title-md text-title-md text-on-surface font-bold">₹ 1,320.0 Cr</span>
              <span className="font-caption text-caption text-on-surface-variant truncate">
                <T gu="વહીવટી મંજૂર રકમ" en="Admin Sanctioned" hi="प्रशासनिक स्वीकृत" />
              </span>
              <div className="w-full bg-surface-container-highest h-2 rounded-full mt-2.5 overflow-hidden">
                <div className="bg-primary-container h-full rounded-full w-[88%]" />
              </div>
            </div>

            {/* Stage 3 */}
            <div className="flex flex-col bg-surface-container-low rounded-lg p-3">
              <div className="flex items-center justify-between text-caption font-caption text-on-surface-variant mb-1">
                <span className="uppercase tracking-wider font-semibold">
                  <T gu="સ્ટેજ ૩ • PFMS પ્રોસેસ" en="Stage 3 • PFMS Dispatch" hi="चरण 3 • PFMS प्रेषण" />
                </span>
                <span className="font-label-md font-bold text-tertiary">84.0%</span>
              </div>
              <span className="font-title-md text-title-md text-tertiary font-bold">₹ 1,260.0 Cr</span>
              <span className="font-caption text-caption text-on-surface-variant truncate">
                <T gu="PFMS બેચ ડિસ્પેચ" en="Batches Initiated" hi="बैच शुरू की गई" />
              </span>
              <div className="w-full bg-surface-container-highest h-2 rounded-full mt-2.5 overflow-hidden">
                <div className="bg-tertiary h-full rounded-full w-[84%]" />
              </div>
            </div>

            {/* Stage 4 */}
            <div className="flex flex-col bg-emerald-50/70 border border-emerald-100 rounded-lg p-3">
              <div className="flex items-center justify-between text-caption font-caption text-emerald-800 mb-1">
                <span className="uppercase tracking-wider font-bold">
                  <T gu="સ્ટેજ ૪ • ખાતામાં જમા" en="Stage 4 • Bank Credited" hi="चरण 4 • खाते में जमा" />
                </span>
                <span className="font-label-md font-bold text-emerald-700">82.7%</span>
              </div>
              <span className="font-title-md text-title-md text-emerald-700 font-bold">₹ 1,240.5 Cr</span>
              <span className="font-caption text-caption text-emerald-800 truncate">
                <T gu="સફળ DBT ચૂકવણી" en="Successful DBT Credit" hi="सफल डीबीटी भुगतान" />
              </span>
              <div className="w-full bg-emerald-200 h-2 rounded-full mt-2.5 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full w-[82.7%]" />
              </div>
            </div>

            {/* Stage 5 */}
            <div className="flex flex-col bg-rose-50/70 border border-rose-100 rounded-lg p-3">
              <div className="flex items-center justify-between text-caption font-caption text-error mb-1">
                <span className="uppercase tracking-wider font-bold">
                  <T gu="સ્ટેજ ૫ • અટકેલ વ્યવહાર" en="Stage 5 • Exceptions" hi="चरण 5 • अटके लेनदेन" />
                </span>
                <span className="font-label-md font-bold text-error">1.3%</span>
              </div>
              <span className="font-title-md text-title-md text-error font-bold">₹ 19.5 Cr</span>
              <span className="font-caption text-caption text-error truncate">
                <T gu="પુનઃપ્રયાસ જરૂરી કેસ" en="Retry Needed" hi="पुनः प्रयास आवश्यक" />
              </span>
              <div className="w-full bg-error-container h-2 rounded-full mt-2.5 overflow-hidden">
                <div className="bg-error h-full rounded-full w-[20%]" />
              </div>
            </div>
          </div>

          {/* Micro-badge security note */}
          <div className="mt-4 pt-3 border-t border-outline-variant flex items-center justify-between flex-wrap gap-2 text-on-surface-variant font-caption text-caption">
            <div className="flex items-center gap-2">
              <Icon name="verified" size={17} className="text-emerald-700" />
              <span>
                <T
                  gu="PFMS કેન્દ્રીય સર્વર સાથે ઓટો-રિકન્સિલિએશન: ૯૯.૭% ચોકસાઈ સાથે પ્રમાણિત • APBS સુરક્ષિત પેમેન્ટ ગેટવે"
                  en="Auto-reconciliation with PFMS Central Server: Verified with 99.7% accuracy • APBS certified gateway"
                  hi="PFMS केंद्रीय सर्वर के साथ ऑटो-मिलान: 99.7% सटीकता से प्रमाणित • APBS प्रमाणित गेटवे"
                />
              </span>
            </div>
            <span className="text-outline">
              <T
                gu="સંચાલન: સ્ટેટ ડેટા સેન્ટર (SDC) ગાંધીનગર"
                en="Managed by State Data Centre (SDC) Gandhinagar"
                hi="राज्य डेटा केंद्र (SDC) गांधीनगर द्वारा प्रबंधित"
              />
            </span>
          </div>
        </section>

        {/* ── 4. Recharts Visualization: Scheme Allocation vs Disbursed ─────── */}
        <section className="card p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Icon name="bar_chart" size={22} className="text-primary" />
              <div>
                <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                  <T
                    gu="યોજનાવાર બજેટ વપરાશ વિશ્લેષણ (Allocation vs Disbursed)"
                    en="Scheme-wise Budget Allocation vs Disbursed"
                    hi="योजनावार बजट आवंटन बनाम वितरण"
                  />
                </h3>
                <p className="font-caption text-caption text-on-surface-variant">
                  <T
                    gu="૬ મુખ્ય યોજનાઓનો નાણાકીય સરખામણી ગ્રાફ (₹ કરોડમાં)"
                    en="Financial comparison graph across 6 major schemes (₹ in Crores)"
                    hi="6 प्रमुख योजनाओं का वित्तीय तुलनात्मक ग्राफ (₹ करोड़ में)"
                  />
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-label-md font-semibold">
                <Icon name="account_balance" size={16} />
                <T gu="કુલ ₹ ૧,૪૭૫ કરોડ બજેટ" en="Total ₹ 1,475 Cr Budget" hi="कुल ₹ 1,475 करोड़ बजट" />
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    fontSize={12}
                    interval={0}
                    angle={-10}
                    textAnchor="end"
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    unit=" Cr"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#cbd5e1",
                      borderRadius: "8px",
                      fontSize: "12px",
                      boxShadow: "0 4px 16px rgba(15, 23, 42, 0.08)",
                    }}
                    formatter={(value) => [`₹ ${value} Cr`, ""]}
                  />
                  <Legend wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }} />
                  <Bar
                    dataKey="Allocated"
                    name="Allocated Budget (₹ Cr)"
                    fill="#1D4ED8"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Disbursed"
                    name="Disbursed DBT (₹ Cr)"
                    fill="#15803D"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-surface-container-low rounded-lg text-on-surface-variant text-sm">
                <T gu="ચાર્ટ લોડ થઈ રહ્યો છે..." en="Loading analytics chart..." hi="चार्ट लोड हो रहा है..." />
              </div>
            )}
          </div>
        </section>

        {/* ── 5. Navigation Filter Tabs ─────────────────────────────────────── */}
        <section className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("schemes")}
            className={`px-4 py-2.5 rounded-lg font-label-lg text-label-lg transition-all flex items-center gap-2 whitespace-nowrap shadow-sm ${
              activeTab === "schemes"
                ? "bg-primary text-on-primary font-bold"
                : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            <Icon name="pie_chart" size={19} />
            <span>
              <T
                gu="યોજનાવાર બજેટ વપરાશ (Scheme Utilization)"
                en="Scheme-wise Utilization"
                hi="योजनावार बजट उपयोग"
              />
            </span>
          </button>

          <button
            onClick={() => setActiveTab("districts")}
            className={`px-4 py-2.5 rounded-lg font-label-lg text-label-lg transition-all flex items-center gap-2 whitespace-nowrap shadow-sm ${
              activeTab === "districts"
                ? "bg-primary text-on-primary font-bold"
                : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            <Icon name="location_city" size={19} />
            <span>
              <T
                gu="જિલ્લા રિકન્સિલિએશન (District Variance)"
                en="District Reconciliation"
                hi="जिला मिलान"
              />
            </span>
            <span className="bg-amber-100 text-amber-800 text-caption font-bold px-1.5 py-0.5 rounded-full">
              <T gu="૨ એલર્ટ" en="2 Alerts" hi="2 अलर्ट" />
            </span>
          </button>

          <button
            onClick={() => setActiveTab("batches")}
            className={`px-4 py-2.5 rounded-lg font-label-lg text-label-lg transition-all flex items-center gap-2 whitespace-nowrap shadow-sm ${
              activeTab === "batches"
                ? "bg-primary text-on-primary font-bold"
                : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            <Icon name="receipt_long" size={19} />
            <span>
              <T
                gu="PFMS બેચ રિકન્સિલિએશન (Batch Files)"
                en="PFMS Batch Reconciliation"
                hi="पीएफएमएस बैच मिलान"
              />
            </span>
          </button>

          <button
            onClick={() => setActiveTab("exceptions")}
            className={`px-4 py-2.5 rounded-lg font-label-lg text-label-lg transition-all flex items-center gap-2 whitespace-nowrap shadow-sm ${
              activeTab === "exceptions"
                ? "bg-primary text-on-primary font-bold"
                : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            <Icon name="report_problem" size={19} className="text-error" />
            <span>
              <T
                gu="નિષ્ફળ વ્યવહારો ડેસ્ક (Failed DBT Desk)"
                en="Failed DBT Desk"
                hi="अटके लेनदेन डेस्क"
              />
            </span>
            <span className="bg-error-container text-on-error-container text-caption font-bold px-1.5 py-0.5 rounded-full">
              ₹ 19.5 Cr
            </span>
          </button>
        </section>

        {/* ── 6. Main Dynamic Content Grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols on lg) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* View A: Schemes Table */}
            {(activeTab === "schemes" || activeTab === "batches") && (
              <div className="card overflow-hidden">
                <div className="p-4 flex items-center justify-between bg-surface-container-low/40 border-b border-outline-variant">
                  <div className="flex items-center gap-2">
                    <Icon name="payments" size={22} className="text-primary" />
                    <div>
                      <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                        <T
                          gu="યોજનાવાર બજેટ વપરાશ સારાંશ"
                          en="Scheme-wise Budget Allocation vs DBT Disbursed"
                          hi="योजनावार बजट आवंटन बनाम डीबीटी वितरण"
                        />
                      </h3>
                      <p className="font-caption text-caption text-on-surface-variant">
                        <T
                          gu="કુલ ૬ સક્રિય સરકારી શિષ્યવૃત્તિ યોજનાઓ"
                          en="All 6 active state scholarship schemes"
                          hi="सभी 6 सक्रिय राज्य छात्रवृत्ति योजनाएं"
                        />
                      </p>
                    </div>
                  </div>
                  <span className="font-label-md text-label-md px-3 py-1 rounded bg-primary/10 text-primary font-semibold">
                    <T gu="૬ યોજનાઓ" en="6 Schemes" hi="6 योजनाएं" />
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-body-sm text-body-sm">
                    <thead className="bg-surface-container text-on-surface-variant font-label-md text-label-md">
                      <tr>
                        <th className="py-3 px-4">
                          <T gu="યોજનાનું નામ & કોડ" en="Scheme Name & Code" hi="योजना का नाम और कोड" />
                        </th>
                        <th className="py-3 px-3 text-right">
                          <T gu="ફાળવેલ બજેટ" en="Allocated" hi="आवंटित बजट" />
                        </th>
                        <th className="py-3 px-3 text-right">
                          <T gu="જમા DBT" en="Disbursed" hi="वितरित डीबीटी" />
                        </th>
                        <th className="py-3 px-4 min-w-[130px]">
                          <T gu="વપરાશ %" en="Utilization %" hi="उपयोग %" />
                        </th>
                        <th className="py-3 px-3 text-right">
                          <T gu="લાભાર્થી સંખ્યા" en="Beneficiaries" hi="लाभार्थी" />
                        </th>
                        <th className="py-3 px-4 text-center">
                          <T gu="સ્થિતિ" en="Status" hi="स्थिति" />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-low text-on-surface">
                      {SCHEMES.map((scheme) => (
                        <tr
                          key={scheme.id}
                          className="hover:bg-surface-container-low/40 transition-colors"
                        >
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-on-surface">
                              <T
                                gu={scheme.nameGu}
                                en={scheme.nameEn}
                                hi={scheme.nameHi}
                              />
                            </div>
                            <div className="font-caption text-caption text-on-surface-variant">
                              {scheme.code} •{" "}
                              <T
                                gu={scheme.deptGu}
                                en={scheme.deptEn}
                                hi={scheme.deptHi}
                              />
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-right font-medium">
                            ₹ {scheme.allocated.toFixed(1)} Cr
                          </td>
                          <td className="py-3.5 px-3 text-right font-semibold text-emerald-700">
                            ₹ {scheme.disbursed.toFixed(1)} Cr
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    scheme.utilization < 70
                                      ? "bg-amber-500"
                                      : "bg-emerald-600"
                                  }`}
                                  style={{ width: `${Math.min(scheme.utilization, 100)}%` }}
                                />
                              </div>
                              <span
                                className={`font-label-md text-label-md font-bold ${
                                  scheme.utilization < 70
                                    ? "text-amber-700"
                                    : "text-emerald-700"
                                }`}
                              >
                                {scheme.utilization.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-right font-medium">
                            {scheme.beneficiaries}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <StatusChip
                              status={scheme.status}
                              label={
                                scheme.status === "approved" ? (
                                  <T gu="સક્રિય" en="Active" hi="सक्रिय" />
                                ) : (
                                  <T gu="પ્રક્રિયામાં" en="In Progress" hi="प्रगति में" />
                                )
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* View B: District Reconciliation Table with <70% Warnings */}
            {(activeTab === "districts" || activeTab === "schemes") && (
              <div className="card overflow-hidden">
                <div className="p-4 flex items-center justify-between bg-surface-container-low/40 border-b border-outline-variant">
                  <div className="flex items-center gap-2">
                    <Icon name="location_city" size={22} className="text-primary" />
                    <div>
                      <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                        <T
                          gu="જિલ્લાવાર ફંડ રિકન્સિલિએશન અને તફાવત (District Reconciliation)"
                          en="District-wise Fund Reconciliation & Variance"
                          hi="जिलावार फंड मिलान और अंतर"
                        />
                      </h3>
                      <p className="font-caption text-caption text-on-surface-variant">
                        <T
                          gu="ફાળવેલ બજેટ વિરુદ્ધ વાસ્તવિક ચૂકવણી અને તફાવત વિશ્લેષણ (૫ જિલ્લા)"
                          en="Allocated budget vs actual disbursed and variance analysis (5 districts)"
                          hi="आवंटित बजट बनाम वास्तविक भुगतान और अंतर विश्लेषण (5 जिले)"
                        />
                      </p>
                    </div>
                  </div>
                  <span className="font-label-md text-label-md px-3 py-1 rounded bg-amber-100 text-amber-800 font-semibold">
                    <T gu="૫ જિલ્લાઓ" en="5 Districts" hi="5 जिले" />
                  </span>
                </div>

                {/* Warning Alert for <70% Utilization Districts */}
                <div className="p-4 bg-amber-50/90 border-b border-amber-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                    <Icon name="warning" size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-label-lg text-label-lg font-bold text-amber-900">
                      <T
                        gu="ચેતવણી: ૭૦% થી ઓછો વપરાશ ધરાવતા જિલ્લાઓ (Low Utilization Alert)"
                        en="Warning: Districts with < 70% Fund Utilization"
                        hi="चेतावनी: 70% से कम उपयोग वाले जिले"
                      />
                    </h4>
                    <p className="font-body-sm text-body-sm text-amber-800 mt-0.5">
                      <T
                        gu="આણંદ (૬૮.૦%) અને દાહોદ (૬૭.૧%) જિલ્લાઓમાં લક્ષ્યાંક કરતાં ઓછો બજેટ વપરાશ નોંધાયેલ છે. DEO કચેરીઓને બાકી અરજીઓની ઝડપી ચકાસણી માટે આદેશ જાહેર કરો."
                        en="Anand (68.0%) and Dahod (67.1%) have recorded under 70% budget utilization. Direct DEO offices to expedite pending application verifications."
                        hi="आनंद (68.0%) और दाहोद (67.1%) में 70% से कम बजट उपयोग दर्ज किया गया है। डीईओ कार्यालयों को लंबित सत्यापन में तेजी लाने का निर्देश दें।"
                      />
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setExportNotice("આણંદ અને દાહોદ DEO કચેરીઓને તાકીદની નોટિસ મોકલવામાં આવી.");
                      setTimeout(() => setExportNotice(null), 4000);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-label-md text-label-md font-semibold hover:bg-amber-700 transition-colors whitespace-nowrap shrink-0 shadow-sm"
                  >
                    <T gu="DEO નોટિસ મોકલો" en="Issue DEO Notice" hi="DEO नोटिस भेजें" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-body-sm text-body-sm">
                    <thead className="bg-surface-container text-on-surface-variant font-label-md text-label-md">
                      <tr>
                        <th className="py-3 px-4">
                          <T gu="જિલ્લો (District)" en="District" hi="जिला" />
                        </th>
                        <th className="py-3 px-3 text-right">
                          <T gu="ફાળવેલ રકમ" en="Allocated" hi="आवंटित" />
                        </th>
                        <th className="py-3 px-3 text-right">
                          <T gu="ચૂકવેલ રકમ" en="Disbursed" hi="वितरित" />
                        </th>
                        <th className="py-3 px-3 text-right">
                          <T gu="તફાવત (Variance)" en="Variance" hi="अंतर" />
                        </th>
                        <th className="py-3 px-4 min-w-[130px]">
                          <T gu="વપરાશ %" en="Utilization %" hi="उपयोग %" />
                        </th>
                        <th className="py-3 px-4 text-center">
                          <T gu="ચેતવણી / સ્થિતિ" en="Status" hi="स्थिति" />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-low text-on-surface">
                      {DISTRICTS.map((dist) => (
                        <tr
                          key={dist.id}
                          className={`transition-colors ${
                            dist.isWarning
                              ? "bg-amber-50/40 hover:bg-amber-50/70"
                              : "hover:bg-surface-container-low/40"
                          }`}
                        >
                          <td className="py-3.5 px-4 font-semibold text-on-surface">
                            <div className="flex items-center gap-2">
                              {dist.isWarning && (
                                <Icon name="warning" size={16} className="text-amber-600" />
                              )}
                              <span>
                                <T gu={dist.nameGu} en={dist.nameEn} hi={dist.nameHi} />
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-right font-medium">
                            ₹ {dist.allocated.toFixed(1)} Cr
                          </td>
                          <td className="py-3.5 px-3 text-right font-semibold text-emerald-700">
                            ₹ {dist.disbursed.toFixed(1)} Cr
                          </td>
                          <td className="py-3.5 px-3 text-right font-medium text-on-surface-variant">
                            ₹ {dist.variance.toFixed(1)} Cr
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    dist.isWarning ? "bg-amber-600" : "bg-emerald-600"
                                  }`}
                                  style={{ width: `${dist.utilization}%` }}
                                />
                              </div>
                              <span
                                className={`font-label-md text-label-md font-bold ${
                                  dist.isWarning ? "text-amber-700" : "text-emerald-700"
                                }`}
                              >
                                {dist.utilization.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {dist.isWarning ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-label-md text-label-md font-semibold border border-amber-300">
                                <Icon name="priority_high" size={14} className="text-amber-700" />
                                <T gu="< ૭૦% સમીક્ષા" en="< 70% Review" hi="< 70% समीक्षा" />
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-label-md text-label-md font-semibold border border-emerald-200">
                                <Icon name="check" size={14} className="text-emerald-700" />
                                <T gu="સામાન્ય" en="On Track" hi="सामान्य" />
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* View C: Recent PFMS Batches */}
            {(activeTab === "batches" || activeTab === "schemes") && (
              <div className="card overflow-hidden">
                <div className="p-4 flex items-center justify-between bg-surface-container-low/40 border-b border-outline-variant">
                  <div className="flex items-center gap-2">
                    <Icon name="dns" size={22} className="text-tertiary" />
                    <div>
                      <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                        <T
                          gu="તાજેતરની PFMS પેમેન્ટ બેચ ફાઇલો"
                          en="Recent PFMS Payment Batch Files"
                          hi="हाल की पीएफएमएस भुगतान बैच फाइलें"
                        />
                      </h3>
                      <p className="font-caption text-caption text-on-surface-variant">
                        <T
                          gu="રીઅલ-ટાઇમ ક્લિયરિંગ ગેટવે બેચ અને સ્વીકૃતિ સ્થિતિ"
                          en="Real-time clearing gateway batches and acknowledgment status"
                          hi="रीयल-टाइम क्लियरिंग गेटवे बैच और पावती स्थिति"
                        />
                      </p>
                    </div>
                  </div>
                  <span className="font-label-md text-label-md text-primary font-semibold hover:underline cursor-pointer flex items-center gap-1">
                    <T gu="તમામ બેચ જુઓ" en="View All Batches" hi="सभी बैच देखें" />
                    <Icon name="arrow_forward" size={16} />
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-body-sm text-body-sm">
                    <thead className="bg-surface-container text-on-surface-variant font-label-md text-label-md">
                      <tr>
                        <th className="py-3 px-4">
                          <T gu="બેચ આઈડી" en="Batch ID" hi="बैच आईडी" />
                        </th>
                        <th className="py-3 px-3">
                          <T gu="તારીખ અને સમય" en="Timestamp" hi="समय" />
                        </th>
                        <th className="py-3 px-3">
                          <T gu="યોજના" en="Scheme" hi="योजना" />
                        </th>
                        <th className="py-3 px-3 text-right">
                          <T gu="વિદ્યાર્થી" en="Beneficiaries" hi="विद्यार्थी" />
                        </th>
                        <th className="py-3 px-3 text-right">
                          <T gu="રકમ" en="Amount" hi="राशि" />
                        </th>
                        <th className="py-3 px-3 text-center">
                          <T gu="PFMS સ્ટેટસ" en="PFMS Status" hi="स्थिति" />
                        </th>
                        <th className="py-3 px-4 text-right">
                          <T gu="એક્શન" en="Action" hi="क्रिया" />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-low text-on-surface">
                      {BATCHES.map((batch) => (
                        <tr
                          key={batch.batchId}
                          className="hover:bg-surface-container-low/40 transition-colors"
                        >
                          <td className="py-3 px-4 font-mono font-semibold text-primary">
                            {batch.batchId}
                          </td>
                          <td className="py-3 px-3 text-on-surface-variant">
                            <T gu={batch.dateGu} en={batch.dateEn} hi={batch.dateHi} />
                          </td>
                          <td className="py-3 px-3">
                            <T gu={batch.schemeGu} en={batch.schemeEn} hi={batch.schemeHi} />
                          </td>
                          <td className="py-3 px-3 text-right font-medium">
                            {batch.beneficiaries}
                          </td>
                          <td className="py-3 px-3 text-right font-semibold">
                            {batch.amount}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <StatusChip
                              status={batch.status}
                              label={
                                <T
                                  gu={batch.statusLabelGu}
                                  en={batch.statusLabelEn}
                                  hi={batch.statusLabelHi}
                                />
                              }
                            />
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  setExportNotice(`બેચ ${batch.batchId} ની ડિસ્પેચ વિગતો લોડ થઈ.`);
                                  setTimeout(() => setExportNotice(null), 4000);
                                }}
                                className="p-1.5 rounded hover:bg-surface-container text-primary"
                                title="View Logs"
                              >
                                <Icon name="visibility" size={18} />
                              </button>
                              <button
                                onClick={() => {
                                  setExportNotice(`બેચ ${batch.batchId} ની રસીદ ડાઉનલોડ થઈ.`);
                                  setTimeout(() => setExportNotice(null), 4000);
                                }}
                                className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant"
                                title="Download Acknowledgment"
                              >
                                <Icon name="download" size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (4 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Card C: Failed DBT Resolution Desk */}
            <div className="card p-5">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-error-container text-error flex items-center justify-center">
                    <Icon name="warning" size={20} />
                  </div>
                  <div>
                    <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                      <T
                        gu="નિષ્ફળ વ્યવહારો પુનઃપ્રયાસ ડેસ્ક"
                        en="Failed DBT Exception Desk"
                        hi="अटके लेनदेन निवारण डेस्क"
                      />
                    </h3>
                    <p className="font-caption text-caption text-error font-semibold">
                      <T
                        gu="કુલ અટકેલ: ₹ ૧૯.૫ કરોડ (૧.૩%)"
                        en="Total Stuck: ₹ 19.5 Cr (1.3%)"
                        hi="कुल अटका: ₹ 19.5 करोड़ (1.3%)"
                      />
                    </p>
                  </div>
                </div>
                <span className="font-caption text-caption bg-error-container text-on-error-container font-bold px-2 py-0.5 rounded-full">
                  <T gu="૮,૧૨૦ કેસ" en="8,120 Cases" hi="8,120 केस" />
                </span>
              </div>

              <p className="font-body-sm text-body-sm text-on-surface-variant my-3">
                <T
                  gu="બેંક સર્વર અને NPCI મેપર રિજેક્શનનું વર્ગીકરણ. તાત્કાલિક સુધારાત્મક કાર્યવાહી હાથ ધરો:"
                  en="Categorization of bank server and NPCI mapper rejections. Initiate prompt remediation:"
                  hi="बैंक सर्वर और NPCI मैपर रिजेक्शन का वर्गीकरण। तुरंत सुधारात्मक कार्रवाई करें:"
                />
              </p>

              {/* Exception Breakdown List */}
              <div className="flex flex-col gap-2.5">
                {/* Item 1 */}
                <div className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-1.5 border border-outline-variant">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      <T
                        gu="૧. આધાર લિંક નથી (NPCI Seed Mismatch)"
                        en="1. Aadhaar Unlinked (NPCI Mismatch)"
                        hi="1. आधार लिंक नहीं (NPCI मिसमैच)"
                      />
                    </span>
                    <span className="font-label-md text-label-md text-error font-bold">₹ 5.2 Cr</span>
                  </div>
                  <div className="flex items-center justify-between text-caption text-on-surface-variant">
                    <span>
                      <T gu="૪,૨૧૦ વિદ્યાર્થીઓ" en="4,210 Students" hi="4,210 छात्र" />
                    </span>
                    <button
                      onClick={() => {
                        setExportNotice("૪,૨૧૦ વિદ્યાર્થીઓને આધાર સીડિંગ SMS નોટિસ મોકલાઈ ગઈ છે.");
                        setTimeout(() => setExportNotice(null), 4000);
                      }}
                      className="text-primary hover:underline font-semibold flex items-center gap-1"
                    >
                      <Icon name="sms" size={14} />
                      <T gu="SMS નોટિસ મોકલો" en="Send SMS Notice" hi="SMS नोटिस भेजें" />
                    </button>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-1.5 border border-outline-variant">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      <T
                        gu="૨. ખાતું નિષ્ક્રિય / બંધ થયેલ (Dormant)"
                        en="2. Dormant / Closed Account"
                        hi="2. निष्क्रिय / बंद खाता"
                      />
                    </span>
                    <span className="font-label-md text-label-md text-error font-bold">₹ 2.6 Cr</span>
                  </div>
                  <div className="flex items-center justify-between text-caption text-on-surface-variant">
                    <span>
                      <T gu="૨,૧૪૦ વિદ્યાર્થીઓ" en="2,140 Students" hi="2,140 छात्र" />
                    </span>
                    <button
                      onClick={() => {
                        setExportNotice("વિદ્યાર્થીઓને બેંક ખાતું અપડેટ કરવાની સુરક્ષિત લિંક મોકલાઈ.");
                        setTimeout(() => setExportNotice(null), 4000);
                      }}
                      className="text-primary hover:underline font-semibold flex items-center gap-1"
                    >
                      <Icon name="link" size={14} />
                      <T gu="ખાતું અપડેટ લિંક" en="Send Update Link" hi="अपडेट लिंक भेजें" />
                    </button>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-1.5 border border-outline-variant">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      <T
                        gu="૩. નામમાં વિસંગતતા (Name Mismatch)"
                        en="3. Name Mismatch (Bank vs School)"
                        hi="3. नाम में विसंगति"
                      />
                    </span>
                    <span className="font-label-md text-label-md text-error font-bold">₹ 1.4 Cr</span>
                  </div>
                  <div className="flex items-center justify-between text-caption text-on-surface-variant">
                    <span>
                      <T gu="૧,૧૨૦ વિદ્યાર્થીઓ" en="1,120 Students" hi="1,120 छात्र" />
                    </span>
                    <button
                      onClick={() => {
                        setExportNotice("૧,૧૨૦ ખાતાઓ પર ડીજીલોકર આધાર મેચ પ્રક્રિયા શરૂ થઈ.");
                        setTimeout(() => setExportNotice(null), 4000);
                      }}
                      className="text-primary hover:underline font-semibold flex items-center gap-1"
                    >
                      <Icon name="fingerprint" size={14} />
                      <T gu="ડીજીલોકર મેચ" en="DigiLocker Match" hi="डिजीलॉकर मैच" />
                    </button>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-1.5 border border-outline-variant">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      <T
                        gu="૪. અમાન્ય IFSC / બેંક મર્જર (Merged IFSC)"
                        en="4. Invalid / Merged Bank IFSC"
                        hi="4. अमान्य IFSC / बैंक विलय"
                      />
                    </span>
                    <span className="font-label-md text-label-md text-error font-bold">₹ 0.8 Cr</span>
                  </div>
                  <div className="flex items-center justify-between text-caption text-on-surface-variant">
                    <span>
                      <T gu="૬૫૦ વિદ્યાર્થીઓ" en="650 Students" hi="650 छात्र" />
                    </span>
                    <button
                      onClick={() => {
                        setExportNotice("RBI ડેટાબેઝ આધારે ૬૫૦ IFSC ઓટો-સુધારી દેવાયા.");
                        setTimeout(() => setExportNotice(null), 4000);
                      }}
                      className="text-primary hover:underline font-semibold flex items-center gap-1"
                    >
                      <Icon name="auto_fix_high" size={14} />
                      <T gu="ઓટો-કરેક્ટ IFSC" en="Auto-Fix IFSC" hi="ऑटो-करेक्ट IFSC" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Master Action CTA */}
              <button
                onClick={handleRetryExceptions}
                className="w-full mt-4 h-11 btn-primary flex items-center justify-center gap-2 shadow-sm"
              >
                <Icon name="refresh" size={19} />
                <span>
                  <T
                    gu="સુધારેલ ખાતાઓ પર તાત્કાલિક રી-ટ્રાય કરો"
                    en="Retry Corrected Accounts Now"
                    hi="सुधारे गए खातों पर पुनः प्रयास करें"
                  />
                  {retriedCount > 0 && ` (${retriedCount})`}
                </span>
              </button>
            </div>

            {/* Card D: Statutory & Audit Compliance Tile */}
            <div className="card p-5 bg-surface-container-low/70 border border-outline-variant">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="policy" size={22} className="text-emerald-700" />
                <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">
                  <T
                    gu="ઓડિટ અને કાયદાકીય માન્યતા"
                    en="Statutory & Audit Compliance"
                    hi="ऑडिट और वैधानिक अनुपालन"
                  />
                </h4>
              </div>
              <p className="font-caption text-caption text-on-surface-variant leading-relaxed mb-3">
                <T
                  gu="આ સમગ્ર DBT વ્યવહારો CAG (Comptroller and Auditor General) તેમજ PAC માર્ગદર્શિકા મુજબ સંપૂર્ણ એન્ક્રિપ્ટેડ અને પ્રમાણિત છે."
                  en="All DBT disbursements strictly comply with CAG and Public Accounts Committee (PAC) statutory audit guidelines."
                  hi="सभी डीबीटी भुगतान CAG और PAC वैधानिक ऑडिट दिशानिर्देशों के अनुरूप पूरी तरह से एन्क्रिप्टेड और प्रमाणित हैं।"
                />
              </p>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between bg-surface-container-lowest p-2.5 rounded-lg font-caption text-caption border border-outline-variant">
                  <span className="text-on-surface-variant font-medium">
                    <T gu="ટ્રેઝરી ઓથોરાઇઝેશન ટોકન:" en="Treasury Token:" hi="ट्रेजरी टोकन:" />
                  </span>
                  <span className="font-mono text-primary font-bold">#TRZ-GUJ-89104</span>
                </div>
                <div className="flex items-center justify-between bg-surface-container-lowest p-2.5 rounded-lg font-caption text-caption border border-outline-variant">
                  <span className="text-on-surface-variant font-medium">
                    <T gu="APBS સર્ટિફિકેશન:" en="APBS Certification:" hi="APBS प्रमाणन:" />
                  </span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Icon name="verified" size={15} className="text-emerald-700" />
                    <T gu="માન્ય & સુરક્ષિત" en="Valid & Secured" hi="मान्य और सुरक्षित" />
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-outline-variant flex items-center gap-1 text-on-surface-variant font-caption text-caption">
                <Icon name="lock" size={15} className="text-outline" />
                <span>
                  <T
                    gu="End-to-End 256-bit SHA-2 એનક્રિપ્ટેડ પેમેન્ટ પાઇપલાઇન"
                    en="End-to-End 256-bit SHA-2 Encrypted Pipeline"
                    hi="एंड-टू-एंड 256-बिट SHA-2 एन्क्रिप्टेड पाइपलाइन"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OfficerShell>
  );
}
