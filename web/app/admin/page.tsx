"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";

// ── Mock Data Definitions ───────────────────────────────────────────────────

interface DistrictData {
  id: string;
  name: { gu: string; en: string; hi: string };
  code: string;
  students: string;
  studentsRaw: number;
  disbursed: string;
  disbursedCr: number;
  coverage: number; // percentage
  approvalRate: number; // percentage
  cycleDist: number; // percentage
  dropoutRisk: number; // percentage
  pendingApps: number;
  tier: "high" | "average" | "focus";
  tag: { gu: string; en: string; hi: string };
  note: { gu: string; en: string; hi: string };
}

const DISTRICTS_DATA: DistrictData[] = [
  {
    id: "anand",
    name: { gu: "આણંદ", en: "Anand", hi: "आणंद" },
    code: "DEO-GJ-AND-04",
    students: "૧,૨૪,૩૦૦",
    studentsRaw: 124300,
    disbursed: "₹ ૪૨.૬ કરોડ",
    disbursedCr: 42.6,
    coverage: 94.2,
    approvalRate: 96.8,
    cycleDist: 71,
    dropoutRisk: 2.1,
    pendingApps: 1420,
    tier: "high",
    tag: { gu: "ટોચનું પ્રદર્શન", en: "Top Performer", hi: "शीर्ष प्रदर्शन" },
    note: {
      gu: "ડીપીઇઓ ઓફિસ આણંદ • સરેરાશ પ્રક્રિયા સમય: ૨.૪ દિવસ",
      en: "DPEO Office Anand • Avg Processing Time: 2.4 Days",
      hi: "डीपीईओ कार्यालय आणंद • औसत प्रक्रिया समय: 2.4 दिन",
    },
  },
  {
    id: "gandhinagar",
    name: { gu: "ગાંધીનગર", en: "Gandhinagar", hi: "गांधीनगर" },
    code: "DEO-GJ-GND-01",
    students: "૮૯,૪૦૦",
    studentsRaw: 89400,
    disbursed: "₹ ૩૮.૨ કરોડ",
    disbursedCr: 38.2,
    coverage: 92.8,
    approvalRate: 95.2,
    cycleDist: 82,
    dropoutRisk: 1.8,
    pendingApps: 890,
    tier: "high",
    tag: { gu: "ઉત્કૃષ્ટ વેરિફિકેશન", en: "Exemplary Verification", hi: "उत्कृष्ट सत्यापन" },
    note: {
      gu: "ગાંધીનગર કમાન્ડ સેન્ટર • ડિજિટલ સર્ટિફિકેટ ઓટો-પાસ ૯૮%",
      en: "Gandhinagar Command Hub • Digital Auto-pass 98%",
      hi: "गांधीनगर कमांड हब • डिजिटल ऑटो-पास 98%",
    },
  },
  {
    id: "mehsana",
    name: { gu: "મહેસાણા", en: "Mehsana", hi: "महेसाणा" },
    code: "DEO-GJ-MSH-07",
    students: "૯૮,૭૦૦",
    studentsRaw: 98700,
    disbursed: "₹ ૩૯.૫ કરોડ",
    disbursedCr: 39.5,
    coverage: 91.5,
    approvalRate: 94.1,
    cycleDist: 78,
    dropoutRisk: 2.4,
    pendingApps: 1150,
    tier: "high",
    tag: { gu: "ઝડપી DBT", en: "Fast-Track DBT", hi: "त्वरित DBT" },
    note: {
      gu: "મહેસાણા શિક્ષણ સમિતિ • આધાર સીડિંગ ૯૯%",
      en: "Mehsana Education Committee • Aadhaar Seeding 99%",
      hi: "महेसाणा शिक्षा समिति • आधार सीडिंग 99%",
    },
  },
  {
    id: "navsari",
    name: { gu: "નવસારી", en: "Navsari", hi: "नवसारी" },
    code: "DEO-GJ-NVS-11",
    students: "૬૫,૨૦૦",
    studentsRaw: 65200,
    disbursed: "₹ ૨૬.૮ કરોડ",
    disbursedCr: 26.8,
    coverage: 90.2,
    approvalRate: 93.4,
    cycleDist: 74,
    dropoutRisk: 2.8,
    pendingApps: 920,
    tier: "high",
    tag: { gu: "૯૦%+ પૂર્ણ", en: "90%+ Achieved", hi: "90%+ पूर्ण" },
    note: {
      gu: "દક્ષિણ ઝોન નોડલ • કન્યા સ્કોલરશિપ વિતરણ પૂર્ણ",
      en: "South Zone Nodal • Girls Scholarship Complete",
      hi: "दक्षिण क्षेत्र नोडल • बालिका छात्रवृत्ति पूर्ण",
    },
  },
  {
    id: "ahmedabad",
    name: { gu: "અમદાવાદ", en: "Ahmedabad", hi: "अहमदाबाद" },
    code: "DEO-GJ-AHM-02",
    students: "૨,૪૫,૦૦૦",
    studentsRaw: 245000,
    disbursed: "₹ ૧૦૮.૦ કરોડ",
    disbursedCr: 108.0,
    coverage: 88.4,
    approvalRate: 91.2,
    cycleDist: 68,
    dropoutRisk: 3.2,
    pendingApps: 6540,
    tier: "average",
    tag: { gu: "મહત્તમ વિદ્યાર્થીઓ", en: "Highest Volume", hi: "अधिकतम छात्र" },
    note: {
      gu: "અમદાવાદ મહાનગરપાલિકા વિસ્તાર • ૧,૪૨૦ શાળાઓ સક્રિય",
      en: "Ahmedabad Metro & Rural • 1,420 Schools Active",
      hi: "अहमदाबाद महानगर क्षेत्र • 1,420 स्कूल सक्रिय",
    },
  },
  {
    id: "rajkot",
    name: { gu: "રાજકોટ", en: "Rajkot", hi: "राजकोट" },
    code: "DEO-GJ-RJK-09",
    students: "૧,૧૨,૫૦૦",
    studentsRaw: 112500,
    disbursed: "₹ ૪૮.૩ કરોડ",
    disbursedCr: 48.3,
    coverage: 87.1,
    approvalRate: 90.5,
    cycleDist: 73,
    dropoutRisk: 3.5,
    pendingApps: 2840,
    tier: "average",
    tag: { gu: "સૌરાષ્ટ્ર હબ", en: "Saurashtra Hub", hi: "सौराष्ट्र हब" },
    note: {
      gu: "સૌરાષ્ટ્ર ઝોન સમીક્ષા • સાયકલ વિતરણ ૭૩% પૂર્ણ",
      en: "Saurashtra Zone Review • Cycle Distribution 73%",
      hi: "सौराष्ट्र ज़ोन समीक्षा • साइकिल वितरण 73%",
    },
  },
  {
    id: "vadodara",
    name: { gu: "વડોદરા", en: "Vadodara", hi: "वडोदरा" },
    code: "DEO-GJ-BRD-03",
    students: "૧,૩૪,૨૦૦",
    studentsRaw: 134200,
    disbursed: "₹ ૫૧.૨ કરોડ",
    disbursedCr: 51.2,
    coverage: 86.9,
    approvalRate: 89.5,
    cycleDist: 76,
    dropoutRisk: 3.1,
    pendingApps: 3200,
    tier: "average",
    tag: { gu: "મધ્ય ગુજરાત", en: "Central Gujarat", hi: "मध्य गुजरात" },
    note: {
      gu: "વડોદરા DEO કચેરી • PFMS એકાઉન્ટ સિંક ૯૯.૧%",
      en: "Vadodara DEO Cell • PFMS Account Sync 99.1%",
      hi: "वडोदरा DEO कार्यालय • PFMS खाता सिंक 99.1%",
    },
  },
  {
    id: "surat",
    name: { gu: "સુરત", en: "Surat", hi: "सूरत" },
    code: "DEO-GJ-SRT-05",
    students: "૨,૧૦,૮૦૦",
    studentsRaw: 210800,
    disbursed: "₹ ૮૭.૫ કરોડ",
    disbursedCr: 87.5,
    coverage: 85.2,
    approvalRate: 88.1,
    cycleDist: 67,
    dropoutRisk: 3.9,
    pendingApps: 7890,
    tier: "average",
    tag: { gu: "ઔદ્યોગિક ક્ષેત્ર", en: "Industrial Belt", hi: "औद्योगिक क्षेत्र" },
    note: {
      gu: "દક્ષિણ ગુજરાત કેન્દ્ર • પરપ્રાંતીય વિદ્યાર્થી વેરિફિકેશન ચાલુ",
      en: "South Gujarat Hub • Migrant Verification in Progress",
      hi: "दक्षिण गुजरात केंद्र • प्रवासी छात्र सत्यापन जारी",
    },
  },
  {
    id: "bhavnagar",
    name: { gu: "ભાવનગર", en: "Bhavnagar", hi: "भावनगर" },
    code: "DEO-GJ-BVN-14",
    students: "૭૨,૪૦૦",
    studentsRaw: 72400,
    disbursed: "₹ ૨૯.૪ કરોડ",
    disbursedCr: 29.4,
    coverage: 82.6,
    approvalRate: 86.4,
    cycleDist: 71,
    dropoutRisk: 4.2,
    pendingApps: 2410,
    tier: "average",
    tag: { gu: "તટીય વિસ્તાર", en: "Coastal Region", hi: "तटीय क्षेत्र" },
    note: {
      gu: "ભાવનગર ગ્રામ્ય • સામાજિક કલ્યાણ હોસ્ટેલ ચકાસણી પૂર્ણ",
      en: "Bhavnagar Rural • Social Welfare Hostels Verified",
      hi: "भावनगर ग्रामीण • समाज कल्याण छात्रावास सत्यापित",
    },
  },
  {
    id: "dahod",
    name: { gu: "દાહોદ", en: "Dahod", hi: "दाहोद" },
    code: "DEO-GJ-DHD-20",
    students: "૮૭,૧૦૦",
    studentsRaw: 87100,
    disbursed: "₹ ૩૧.૨ કરોડ",
    disbursedCr: 31.2,
    coverage: 71.4,
    approvalRate: 74.0,
    cycleDist: 54,
    dropoutRisk: 6.8,
    pendingApps: 4890,
    tier: "focus",
    tag: { gu: "આદિજાતિ બેલ્ટ (ધ્યાન)", en: "Tribal Focus", hi: "आदिवासी बेल्ट (ध्यान)" },
    note: {
      gu: "દાહોદ આદિજાતિ વિભાગ • ડોક્યુમેન્ટ પેન્ડન્સી નિવારણ કેમ્પ ચાલુ",
      en: "Dahod Tribal Wing • Pending Docs Clearance Camp Active",
      hi: "दाहोद आदिवासी विंग • दस्तावेज़ निवारण शिविर सक्रिय",
    },
  },
  {
    id: "dang",
    name: { gu: "ડાંગ", en: "Dang", hi: "डांग" },
    code: "DEO-GJ-DNG-33",
    students: "૨૭,૬૦૦",
    studentsRaw: 27600,
    disbursed: "₹ ૧૧.૮ કરોડ",
    disbursedCr: 11.8,
    coverage: 66.2,
    approvalRate: 69.1,
    cycleDist: 48,
    dropoutRisk: 8.5,
    pendingApps: 2150,
    tier: "focus",
    tag: { gu: "સઘન દેખરેખ જરૂરી", en: "Critical Intervention", hi: "सघन निगरानी आवश्यक" },
    note: {
      gu: "ડાંગ પહાડી વિસ્તાર • ઓન-ગ્રાઉન્ડ ઓફલાઇન સિંક ટીમ તૈનાત",
      en: "Dang Hilly Terrain • Offline Sync Teams Field-Deployed",
      hi: "डांग पहाड़ी क्षेत्र • ऑफलाइन सिंक टीम फील्ड में तैनात",
    },
  },
];

// Scheme-wise Disbursement Data
const SCHEME_DATA = [
  {
    nameKey: "namoLakshmi",
    guName: "નમો લક્ષ્મી યોજના",
    enName: "Namo Lakshmi Scheme",
    hiName: "नमो लक्ष्मी योजना",
    category: { gu: "કન્યા કેળવણી", en: "Girl Child Education", hi: "बालिका शिक्षा" },
    allocated: 520,
    disbursed: 485,
    pct: 93.2,
    color: "#1D4ED8",
  },
  {
    nameKey: "saraswatiSadhna",
    guName: "સરસ્વતી સાધના સાયકલ યોજના",
    enName: "Saraswati Sadhna Cycle Scheme",
    hiName: "सरस्वती साधना साइकिल योजना",
    category: { gu: "સાયકલ સહાય", en: "Cycle Aid", hi: "साइकिल सहायता" },
    allocated: 120,
    disbursed: 112,
    pct: 93.3,
    color: "#F97316",
  },
  {
    nameKey: "nmms",
    guName: "NMMS મેરિટ સ્કોલરશિપ",
    enName: "NMMS Merit Scholarship",
    hiName: "NMMS मेधावी छात्रवृत्ति",
    category: { gu: "મેરિટ સહાય", en: "Merit Support", hi: "मेधावी सहायता" },
    allocated: 105,
    disbursed: 96,
    pct: 91.4,
    color: "#7C3AED",
  },
  {
    nameKey: "sebc",
    guName: "OBC / SEBC પૂર્વ-મેટ્રિક સહાય",
    enName: "OBC / SEBC Pre-Matric Aid",
    hiName: "OBC / SEBC पूर्व-मैट्रिक सहायता",
    category: { gu: "સામાજિક ન્યાય", en: "Social Justice", hi: "सामाजिक न्याय" },
    allocated: 260,
    disbursed: 245,
    pct: 94.2,
    color: "#1E3A8A",
  },
  {
    nameKey: "gyanSadhna",
    guName: "મુખ્યમંત્રી જ્ઞાન સાધના સ્કોલરશિપ",
    enName: "CM Gyan Sadhna Scholarship",
    hiName: "मुख्यमंत्री ज्ञान साधना छात्रवृत्ति",
    category: { gu: "પ્રતિભા સહાય", en: "Talent Support", hi: "प्रतिभा सहायता" },
    allocated: 195,
    disbursed: 182,
    pct: 93.3,
    color: "#3B82F6",
  },
  {
    nameKey: "others",
    guName: "અન્ય રાજ્ય સહાય યોજનાઓ",
    enName: "Other State Welfare Schemes",
    hiName: "अन्य राज्य कल्याणकारी योजनाएं",
    category: { gu: "દિવ્યાંગ & અન્ય", en: "Special Needs & Misc", hi: "दिव्यांग और अन्य" },
    allocated: 136.4,
    disbursed: 120.5,
    pct: 88.3,
    color: "#64748B",
  },
];

// Monthly Trend Data (Apr to Nov 2025)
const MONTHLY_TREND_DATA = [
  { month: "Apr", gu: "એપ્રિલ", en: "Apr", target: 90, disbursed: 75 },
  { month: "May", gu: "મે", en: "May", target: 110, disbursed: 98 },
  { month: "Jun", gu: "જૂન", en: "Jun", target: 140, disbursed: 132 },
  { month: "Jul", gu: "જુલાઈ", en: "Jul", target: 180, disbursed: 174 },
  { month: "Aug", gu: "ઓગસ્ટ", en: "Aug", target: 210, disbursed: 198 },
  { month: "Sep", gu: "સપ્ટેમ્બર", en: "Sep", target: 200, disbursed: 192 },
  { month: "Oct", gu: "ઓક્ટોબર", en: "Oct", target: 190, disbursed: 185 },
  { month: "Nov", gu: "નવેમ્બર", en: "Nov", target: 196.4, disbursed: 186.5 },
];

export default function AdminAnalyticsDashboard() {
  const [mounted, setMounted] = useState(false);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("anand");
  const [activeMetricTab, setActiveMetricTab] = useState<"coverage" | "pending" | "cycles" | "dropout">("coverage");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tierFilter, setTierFilter] = useState<"all" | "high" | "average" | "focus">("all");
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "synced">("idle");
  const [exportStatus, setExportStatus] = useState<"idle" | "exporting" | "exported">("idle");
  const [meetingModalOpen, setMeetingModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Currently active district in the spotlight
  const activeDistrict = useMemo(() => {
    return DISTRICTS_DATA.find((d) => d.id === selectedDistrictId) || DISTRICTS_DATA[0];
  }, [selectedDistrictId]);

  // Filtered districts for the table
  const filteredDistricts = useMemo(() => {
    return DISTRICTS_DATA.filter((d) => {
      const matchesSearch =
        d.name.gu.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTier = tierFilter === "all" || d.tier === tierFilter;
      return matchesSearch && matchesTier;
    });
  }, [searchQuery, tierFilter]);

  // CM Dashboard Sync button handler
  const handleCmSync = () => {
    setSyncStatus("syncing");
    setTimeout(() => {
      setSyncStatus("synced");
      setTimeout(() => {
        setSyncStatus("idle");
      }, 2500);
    }, 1200);
  };

  // Export report button handler
  const handleExport = () => {
    setExportStatus("exporting");
    setTimeout(() => {
      setExportStatus("exported");
      setTimeout(() => {
        setExportStatus("idle");
      }, 2500);
    }, 1000);
  };

  return (
    <OfficerShell role="admin">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto animate-fade-in">
        
        {/* ── Top Live Alert Notification Banner ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 rounded-xl bg-surface-container-high text-on-surface border border-outline-variant/60 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse shrink-0" />
            <span className="font-label-md text-label-md font-bold text-secondary uppercase tracking-wider shrink-0">
              <T gu="લાઇવ ડેટા ફીડ:" en="LIVE DATA FEED:" hi="लाइव डेटा फीड:" />
            </span>
            <p className="font-body-sm text-body-sm text-on-surface truncate">
              <T
                gu="ગુજરાત રાજ્ય શિષ્યવૃત્તિ પોર્ટલ (VSK સેતુ) • તાજેતરનું DBT ચુકવણું સફળતાપૂર્વક અપડેટ થયું • સર્વર સિંક: ૯૯.૯૮% અપટાઇમ"
                en="Gujarat State Scholarship Portal (VSK Setu) • Recent DBT Disbursals Synced • 99.98% Uptime"
                hi="गुजरात राज्य छात्रवृत्ति पोर्टल (VSK सेतु) • हालिया DBT वितरण सफलतापूर्वक अपडेट • 99.98% अपटाइम"
              />
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
            <span className="font-caption text-caption text-on-surface-variant font-medium">
              <T
                gu="સત્ર: AY 2025-26 (દ્વિતીય સત્ર)"
                en="Session: AY 2025-26 (Term 2)"
                hi="सत्र: AY 2025-26 (द्वितीय सत्र)"
              />
            </span>
            <span className="font-caption text-caption bg-surface-container-lowest text-primary px-2.5 py-0.5 rounded font-semibold border border-outline-variant/80">
              <T gu="NIC સુરક્ષિત" en="NIC Secured" hi="NIC सुरक्षित" />
            </span>
          </div>
        </div>

        {/* ── Command Control & Filter Toolbar ── */}
        <section className="bg-surface-container-lowest rounded-xl p-4 sm:p-5 border border-outline-variant shadow-level-1">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1">
              {/* Academic Year */}
              <div className="flex flex-col gap-1">
                <label className="font-caption text-caption text-on-surface-variant font-semibold">
                  <T gu="શૈક્ષણિક વર્ષ (Year)" en="Academic Year" hi="शैक्षणिक वर्ष" />
                </label>
                <div className="relative">
                  <select className="w-full h-10 pl-3 pr-8 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-medium border border-outline-variant">
                    <option>AY 2025-26 (ચાલુ / Live)</option>
                    <option>AY 2024-25</option>
                    <option>AY 2023-24</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-outline pointer-events-none text-[20px]">
                    keyboard_arrow_down
                  </span>
                </div>
              </div>

              {/* Scheme Filter */}
              <div className="flex flex-col gap-1">
                <label className="font-caption text-caption text-on-surface-variant font-semibold">
                  <T gu="યોજના ફિલ્ટર (Schemes)" en="Scheme Filter" hi="योजना फ़िल्टर" />
                </label>
                <div className="relative">
                  <select className="w-full h-10 pl-3 pr-8 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-medium border border-outline-variant">
                    <option>તમામ ૮ યોજનાઓ (All 8 Schemes)</option>
                    <option>નમો લક્ષ્મી યોજના (Namo Lakshmi)</option>
                    <option>સરસ્વતી સાધના સાયકલ યોજના</option>
                    <option>NMMS મેરિટ સ્કોલરશિપ</option>
                    <option>OBC/SEBC પૂર્વ-મેટ્રિક સહાય</option>
                    <option>મુખ્યમંત્રી જ્ઞાન સાધના સ્કોલરશિપ</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-outline pointer-events-none text-[20px]">
                    tune
                  </span>
                </div>
              </div>

              {/* District Filter */}
              <div className="flex flex-col gap-1">
                <label className="font-caption text-caption text-on-surface-variant font-semibold">
                  <T gu="જિલ્લા પસંદગી (Districts)" en="District Selection" hi="जिला चयन" />
                </label>
                <div className="relative">
                  <select
                    value={selectedDistrictId}
                    onChange={(e) => setSelectedDistrictId(e.target.value)}
                    className="w-full h-10 pl-3 pr-8 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-medium border border-outline-variant"
                  >
                    <option value="anand">આણંદ (Anand - Top Rank)</option>
                    <option value="gandhinagar">ગાંધીનગર (Gandhinagar)</option>
                    <option value="mehsana">મહેસાણા (Mehsana)</option>
                    <option value="navsari">નવસારી (Navsari)</option>
                    <option value="ahmedabad">અમદાવાદ (Ahmedabad)</option>
                    <option value="rajkot">રાજકોટ (Rajkot)</option>
                    <option value="vadodara">વડોદરા (Vadodara)</option>
                    <option value="surat">સુરત (Surat)</option>
                    <option value="bhavnagar">ભાવનગર (Bhavnagar)</option>
                    <option value="dahod">દાહોદ (Dahod - Focus)</option>
                    <option value="dang">ડાંગ (Dang - Focus)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-outline pointer-events-none text-[20px]">
                    map
                  </span>
                </div>
              </div>

              {/* Time Range */}
              <div className="flex flex-col gap-1">
                <label className="font-caption text-caption text-on-surface-variant font-semibold">
                  <T gu="સમયગાળો (Time Period)" en="Time Period" hi="समय अवधि" />
                </label>
                <div className="relative">
                  <select className="w-full h-10 pl-3 pr-8 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-medium border border-outline-variant">
                    <option>આ શૈક્ષણિક સત્ર (This Session)</option>
                    <option>છેલ્લા ૩૦ દિવસ (Last 30 Days)</option>
                    <option>ચાલુ નાણાકીય ત્રિમાસિક (Q3)</option>
                    <option>સંપૂર્ણ વાર્ષિક હિસાબ (FY 2025-26)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-outline pointer-events-none text-[20px]">
                    date_range
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 shrink-0 pt-2 lg:pt-0">
              <button
                onClick={handleExport}
                className="h-10 px-4 rounded-lg bg-surface-container text-primary hover:bg-surface-container-high font-label-md text-label-md flex items-center gap-2 transition-all active:scale-95 border border-outline-variant"
                id="btn-export-report"
              >
                {exportStatus === "exporting" ? (
                  <>
                    <span className="material-symbols-outlined text-[19px] animate-spin">refresh</span>
                    <span><T gu="ડાઉનલોડ..." en="Exporting..." hi="डाउनलोड..." /></span>
                  </>
                ) : exportStatus === "exported" ? (
                  <>
                    <span className="material-symbols-outlined text-[19px] text-success">done_all</span>
                    <span><T gu="રિપોર્ટ તૈયાર!" en="Report Ready!" hi="रिपोर्ट तैयार!" /></span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[19px]">download</span>
                    <span><T gu="રિપોર્ટ ડાઉનલોડ (.pdf / .xlsx)" en="Export Report (.pdf / .xlsx)" hi="रिपोर्ट डाउनलोड (.pdf / .xlsx)" /></span>
                  </>
                )}
              </button>

              <button
                onClick={handleCmSync}
                className="h-10 px-4 rounded-lg bg-secondary text-on-secondary hover:bg-secondary/90 font-label-md text-label-md flex items-center gap-2 transition-all active:scale-95 shadow-sm"
                id="btn-cm-sync"
              >
                {syncStatus === "syncing" ? (
                  <>
                    <span className="material-symbols-outlined text-[19px] animate-spin">refresh</span>
                    <span><T gu="સિંક થઈ રહ્યું છે..." en="Syncing with CM Hub..." hi="सिंक हो रहा है..." /></span>
                  </>
                ) : syncStatus === "synced" ? (
                  <>
                    <span className="material-symbols-outlined text-[19px]">check_circle</span>
                    <span><T gu="સફળ સિંક પૂર્ણ!" en="Synced Successfully!" hi="सफल सिंक पूर्ण!" /></span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[19px]">sync</span>
                    <span><T gu="મુખ્યમંત્રી ડેશબોર્ડ સિંક" en="CM Dashboard Sync" hi="मुख्यमंत्री डैशबोर्ड सिंक" /></span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* ── State-Level Executive KPI Grid ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {/* Card 1: Total Beneficiaries */}
          <div className="card p-4 flex flex-col justify-between hover:shadow-level-2 transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Icon name="group" size={20} />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-caption text-caption font-semibold">
                +૪.૮% YoY
              </span>
            </div>
            <div>
              <p className="font-caption text-caption text-on-surface-variant font-medium">
                <T gu="કુલ નોંધાયેલ વિદ્યાર્થીઓ" en="Total Beneficiaries" hi="कुल नामांकित छात्र" />
              </p>
              <h3 className="font-headline-md text-headline-md text-on-surface tracking-tight mt-0.5">
                <T gu="૫૮.૨ લાખ" en="58.2 Lakh" hi="58.2 लाख" />
              </h3>
            </div>
            <div className="mt-3 pt-2 border-t border-outline-variant/50 flex items-center justify-between">
              <span className="font-caption text-caption text-outline">UDISE+ કવરેજ</span>
              <span className="font-caption text-caption text-primary font-bold">૧૦૦% પૂર્ણ</span>
            </div>
          </div>

          {/* Card 2: Eligible Beneficiaries */}
          <div className="card p-4 flex flex-col justify-between hover:shadow-level-2 transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Icon name="verified_user" size={20} />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-tertiary font-caption text-caption font-semibold">
                ૩૬.૮% ગુણોત્તર
              </span>
            </div>
            <div>
              <p className="font-caption text-caption text-on-surface-variant font-medium">
                <T gu="પાત્ર લાભાર્થીઓ (Eligible)" en="Eligible Beneficiaries" hi="पात्र लाभार्थी" />
              </p>
              <h3 className="font-headline-md text-headline-md text-on-surface tracking-tight mt-0.5">
                <T gu="૨૧.૪ લાખ" en="21.4 Lakh" hi="21.4 लाख" />
              </h3>
            </div>
            <div className="mt-3 pt-2 border-t border-outline-variant/50 flex items-center justify-between">
              <span className="font-caption text-caption text-outline">કુલ વિદ્યાર્થીઓ માંથી</span>
              <span className="font-caption text-caption text-on-surface font-semibold">૨૧,૪૪,૮૯૦ ચકાસાયેલ</span>
            </div>
          </div>

          {/* Card 3: Total DBT Disbursed */}
          <div className="card p-4 flex flex-col justify-between hover:shadow-level-2 transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary">
                <Icon name="payments" size={20} />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-caption text-caption font-semibold">
                ૯૪.૨% વહેંચણી
              </span>
            </div>
            <div>
              <p className="font-caption text-caption text-on-surface-variant font-medium">
                <T gu="સીધું DBT વિતરણ (PFMS)" en="Total DBT Disbursed" hi="प्रत्यक्ष DBT वितरण" />
              </p>
              <h3 className="font-headline-md text-headline-md text-primary tracking-tight mt-0.5">
                ₹ ૧,૨૪૦.૫ <span className="font-title-sm text-title-sm">Cr</span>
              </h3>
            </div>
            <div className="mt-3 pt-2 border-t border-outline-variant/50 flex items-center justify-between">
              <span className="font-caption text-caption text-outline">મંજૂર બજેટ</span>
              <span className="font-caption text-caption text-on-surface font-semibold">₹ ૧,૩૧૬.૪ Cr</span>
            </div>
          </div>

          {/* Card 4: State Coverage % */}
          <div className="card p-4 flex flex-col justify-between hover:shadow-level-2 transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Icon name="analytics" size={20} />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-chip-approved-bg text-chip-approved-text font-caption text-caption font-semibold">
                ૯૨.૪% સરેરાશ
              </span>
            </div>
            <div>
              <p className="font-caption text-caption text-on-surface-variant font-medium">
                <T gu="રાજ્ય કવરેજ દર" en="State Coverage Rate" hi="राज्य कवरेज दर" />
              </p>
              <h3 className="font-headline-md text-headline-md text-on-surface tracking-tight mt-0.5">
                ૯૨.૪%
              </h3>
            </div>
            <div className="mt-3 pt-2 border-t border-outline-variant/50 flex items-center justify-between">
              <span className="font-caption text-caption text-outline">સક્રિય યોજનાઓ</span>
              <span className="font-caption text-caption text-primary font-bold">૮ યોજનાઓ</span>
            </div>
          </div>

          {/* Card 5: Avg Credit Time */}
          <div className="card p-4 flex flex-col justify-between hover:shadow-level-2 transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
                <Icon name="speed" size={20} />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-tertiary font-caption text-caption font-semibold">
                -૧૮ દિવસ ઝડપી
              </span>
            </div>
            <div>
              <p className="font-caption text-caption text-on-surface-variant font-medium">
                <T gu="સરેરાશ ક્રેડિટ સમય" en="Avg Credit Time" hi="औसत क्रेडिट समय" />
              </p>
              <h3 className="font-headline-md text-headline-md text-on-surface tracking-tight mt-0.5">
                <T gu="૬.૨ દિવસ" en="6.2 Days" hi="6.2 दिन" />
              </h3>
            </div>
            <div className="mt-3 pt-2 border-t border-outline-variant/50 flex items-center justify-between">
              <span className="font-caption text-caption text-outline">ગત સત્ર: ૨૪ દિવસ</span>
              <span className="font-caption text-caption text-success font-semibold">૭૪% સુધારો</span>
            </div>
          </div>

          {/* Card 6: Intercepted Bogus Cases */}
          <div className="card p-4 flex flex-col justify-between hover:shadow-level-2 transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-lg bg-danger-container flex items-center justify-center text-danger">
                <Icon name="shield_lock" size={20} />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-danger-container text-danger font-caption text-caption font-semibold">
                ₹ ૬.૮ Cr બચત
              </span>
            </div>
            <div>
              <p className="font-caption text-caption text-on-surface-variant font-medium">
                <T gu="અટકાવેલ બોગસ કેસ" en="Fraud Intercepted" hi="रोके गए फर्जी केस" />
              </p>
              <h3 className="font-headline-md text-headline-md text-danger tracking-tight mt-0.5">
                <T gu="૩,૪૨૧ કેસ" en="3,421 Cases" hi="3,421 केस" />
              </h3>
            </div>
            <div className="mt-3 pt-2 border-t border-outline-variant/50 flex items-center justify-between">
              <span className="font-caption text-caption text-outline">AI સ્ક્રૂટિની મોડેલ</span>
              <span className="font-caption text-caption text-danger font-semibold">૧૦૦% ફ્રિઝ</span>
            </div>
          </div>
        </section>

        {/* ── Middle Analytics Section (Two Column Layout: 7 cols / 5 cols) ── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* ── Left Column (7 cols): Heatmap, District Performance & Monthly Trends ── */}
          <div className="xl:col-span-7 flex flex-col gap-6">
            
            {/* Gujarat 33 Districts Matrix & Interactive Performance Module */}
            <div className="card p-5 sm:p-6 flex flex-col justify-between">
              {/* Header & Tabs */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-6 bg-primary rounded-full shrink-0" />
                    <h2 className="font-title-lg text-title-lg text-on-surface">
                      <T
                        gu="ગુજરાત ૩૩ જિલ્લા હીટમેપ અને પ્રદર્શન વિશ્લેષણ"
                        en="Gujarat 33 Districts Heatmap & Performance"
                        hi="गुजरात 33 जिला हीटमैप और प्रदर्शन"
                      />
                    </h2>
                  </div>
                  <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                    <T
                      gu="શિક્ષણ વિભાગ મોનિટરિંગ સેલ • રીઅલ-ટાઇમ બ્લોક-લેવલ સિન્ક્રોનાઇઝેશન"
                      en="Education Monitoring Cell • Real-time Block-level Synchronization"
                      hi="शिक्षा विभाग निगरानी सेल • रीयल-टाइम ब्लॉक-स्तरीय समन्वय"
                    />
                  </p>
                </div>

                {/* Metric Segmented Tabs */}
                <div className="flex items-center bg-surface-container-low p-1 rounded-lg gap-1 shrink-0 overflow-x-auto border border-outline-variant">
                  <button
                    onClick={() => setActiveMetricTab("coverage")}
                    className={`px-3 py-1.5 rounded-md font-label-md text-label-md transition-all ${
                      activeMetricTab === "coverage"
                        ? "bg-surface-container-lowest text-primary font-semibold shadow-sm"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    <T gu="કવરેજ %" en="Coverage %" hi="कवरेज %" />
                  </button>
                  <button
                    onClick={() => setActiveMetricTab("pending")}
                    className={`px-3 py-1.5 rounded-md font-label-md text-label-md transition-all ${
                      activeMetricTab === "pending"
                        ? "bg-surface-container-lowest text-primary font-semibold shadow-sm"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    <T gu="પેન્ડિંગ અરજીઓ" en="Pending Apps" hi="लंबित आवेदन" />
                  </button>
                  <button
                    onClick={() => setActiveMetricTab("cycles")}
                    className={`px-3 py-1.5 rounded-md font-label-md text-label-md transition-all ${
                      activeMetricTab === "cycles"
                        ? "bg-surface-container-lowest text-primary font-semibold shadow-sm"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    <T gu="સાયકલ વિતરણ %" en="Cycles Dist %" hi="साइकिल वितरण %" />
                  </button>
                  <button
                    onClick={() => setActiveMetricTab("dropout")}
                    className={`px-3 py-1.5 rounded-md font-label-md text-label-md transition-all ${
                      activeMetricTab === "dropout"
                        ? "bg-surface-container-lowest text-primary font-semibold shadow-sm"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    <T gu="ડ્રોપઆઉટ જોખમ" en="Dropout Risk" hi="ड्रॉपआउट जोखिम" />
                  </button>
                </div>
              </div>

              {/* Active District Spotlight Card */}
              <div
                id="district-spotlight"
                className="mb-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                    <Icon name="verified" size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-title-md text-title-md text-on-surface font-bold">
                        <T
                          gu={`${activeDistrict.name.gu} જિલ્લો (${activeDistrict.code})`}
                          en={`${activeDistrict.name.en} District (${activeDistrict.code})`}
                          hi={`${activeDistrict.name.hi} जिला (${activeDistrict.code})`}
                        />
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-caption font-semibold ${
                          activeDistrict.tier === "high"
                            ? "bg-primary/10 text-primary"
                            : activeDistrict.tier === "focus"
                            ? "bg-danger-container text-danger"
                            : "bg-surface-container-high text-on-surface"
                        }`}
                      >
                        <T
                          gu={activeDistrict.tag.gu}
                          en={activeDistrict.tag.en}
                          hi={activeDistrict.tag.hi}
                        />
                      </span>
                    </div>
                    <p className="font-caption text-caption text-on-surface-variant">
                      <T
                        gu={activeDistrict.note.gu}
                        en={activeDistrict.note.en}
                        hi={activeDistrict.note.hi}
                      />
                    </p>
                  </div>
                </div>

                {/* Spotlight Micro-metrics */}
                <div className="flex items-center gap-4 text-left sm:text-right shrink-0">
                  <div>
                    <span className="font-caption text-caption text-outline block">
                      <T gu="કુલ કવરેજ" en="Coverage" hi="कवरेज" />
                    </span>
                    <span className="font-title-md text-title-md text-primary font-bold">
                      {activeDistrict.coverage}%
                    </span>
                  </div>
                  <div className="w-px h-8 bg-outline-variant" />
                  <div>
                    <span className="font-caption text-caption text-outline block">
                      <T gu="પાત્ર વિદ્યાર્થી" en="Students" hi="छात्र" />
                    </span>
                    <span className="font-title-md text-title-md text-on-surface font-semibold">
                      {activeDistrict.students}
                    </span>
                  </div>
                  <div className="w-px h-8 bg-outline-variant" />
                  <div>
                    <span className="font-caption text-caption text-outline block">
                      <T gu="ચુકવણી રકમ" en="Disbursed" hi="वितरित राशि" />
                    </span>
                    <span className="font-title-md text-title-md text-secondary font-bold">
                      {activeDistrict.disbursed}
                    </span>
                  </div>
                </div>
              </div>

              {/* District Cards Matrix Grid */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-caption text-caption uppercase text-outline tracking-wider font-semibold">
                    <T
                      gu="જિલ્લાવાર વિગતવાર સ્કોરબોર્ડ (District Coverage Cards)"
                      en="District Coverage Matrix (Select to Inspect)"
                      hi="जिलावार स्कोरबोर्ड (निरीक्षण के लिए चुनें)"
                    />
                  </span>
                  <div className="flex items-center gap-3 font-caption text-caption">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                      &gt;૯૦% <T gu="ઉત્કૃષ્ટ" en="High" hi="उत्कृष्ट" />
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                      ૭૫-૯૦% <T gu="સરેરાશ" en="Avg" hi="औसत" />
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-danger" />
                      &lt;૭૫% <T gu="સઘન ધ્યાન" en="Focus" hi="सघन ध्यान" />
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {DISTRICTS_DATA.map((d) => {
                    const isSelected = d.id === selectedDistrictId;
                    const val =
                      activeMetricTab === "coverage"
                        ? `${d.coverage}%`
                        : activeMetricTab === "pending"
                        ? `${d.pendingApps.toLocaleString()}`
                        : activeMetricTab === "cycles"
                        ? `${d.cycleDist}%`
                        : `${d.dropoutRisk}%`;
                    const barPct =
                      activeMetricTab === "coverage"
                        ? d.coverage
                        : activeMetricTab === "cycles"
                        ? d.cycleDist
                        : activeMetricTab === "dropout"
                        ? d.dropoutRisk * 10
                        : Math.min((d.pendingApps / 8000) * 100, 100);

                    return (
                      <div
                        key={d.id}
                        onClick={() => setSelectedDistrictId(d.id)}
                        className={`p-2.5 rounded-lg cursor-pointer transition-all border ${
                          isSelected
                            ? "bg-surface-container-high border-primary ring-2 ring-primary/20 shadow-sm"
                            : d.tier === "focus"
                            ? "bg-danger-container/20 border-danger/30 hover:bg-danger-container/40"
                            : "bg-surface-container-low border-outline-variant/60 hover:bg-surface-container-high"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-body-sm text-body-sm font-bold text-on-surface truncate">
                            <T gu={d.name.gu} en={d.name.en} hi={d.name.hi} />
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                              d.tier === "high"
                                ? "bg-primary/10 text-primary"
                                : d.tier === "focus"
                                ? "bg-danger text-on-danger"
                                : "bg-tertiary/10 text-tertiary"
                            }`}
                          >
                            {val}
                          </span>
                        </div>
                        <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              d.tier === "high"
                                ? "bg-primary"
                                : d.tier === "focus"
                                ? "bg-danger"
                                : "bg-tertiary"
                            }`}
                            style={{ width: `${Math.min(barPct, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Geographic Context Hub Card (Replacing external images with styled card) */}
              <div className="mt-2">
                <div className="w-full rounded-xl bg-gradient-to-r from-primary to-primary-container p-4 text-on-primary flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-level-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-on-primary/10 backdrop-blur flex items-center justify-center shrink-0">
                      <Icon name="hub" size={24} className="text-secondary-fixed" />
                    </div>
                    <div>
                      <p className="font-label-lg text-label-lg font-bold">
                        <T
                          gu="વિદ્યા સમીક્ષા કેન્દ્ર (VSK) • સેન્ટ્રલ કંટ્રોલ ડેસ્ક"
                          en="Vidya Samiksha Kendra (VSK) • Central Command Desk"
                          hi="विद्या समीक्षा केंद्र (VSK) • केंद्रीय कमांड डेस्क"
                        />
                      </p>
                      <p className="font-caption text-caption opacity-90">
                        <T
                          gu="ગાંધીનગર મુખ્ય મથક થી ૩૩ જિલ્લાઓના ૧૨,૪૮૦ વેરિફિકેશન સેન્ટર જોડાયેલા છે"
                          en="Gandhinagar HQ connected to 12,480 verification nodes across 33 districts"
                          hi="गांधीनगर मुख्यालय से 33 जिलों के 12,480 सत्यापन केंद्र जुड़े हैं"
                        />
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/admin/ranking"
                    className="px-3 py-1.5 rounded-lg bg-surface-container-lowest/20 hover:bg-surface-container-lowest/30 backdrop-blur font-caption text-caption font-semibold text-white transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <span><T gu="૩૩ જિલ્લા રેન્કિંગ જુઓ" en="View 33 Districts" hi="33 जिले देखें" /></span>
                    <Icon name="open_in_new" size={16} />
                  </Link>
                </div>
              </div>
            </div>

            {/* ── Monthly DBT Disbursement Trend (Recharts LineChart) ── */}
            <div className="card p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-6 bg-primary rounded-full shrink-0" />
                  <div>
                    <h2 className="font-title-lg text-title-lg text-on-surface">
                      <T
                        gu="માસિક DBT વિતરણ ટ્રેન્ડ (વાર્ષિક પ્રગતિ)"
                        en="Monthly DBT Disbursement Trend (FY 2025-26)"
                        hi="मासिक DBT वितरण ट्रेंड (वार्षिक प्रगति)"
                      />
                    </h2>
                    <p className="font-caption text-caption text-on-surface-variant">
                      <T
                        gu="લક્ષ્યાંક વિરુદ્ધ વાસ્તવિક ચુકવણી (₹ કરોડમાં)"
                        en="Allocated Target vs Actual Disbursed (in ₹ Crores)"
                        hi="लक्ष्य बनाम वास्तविक भुगतान (₹ करोड़ में)"
                      />
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-caption font-semibold">
                  <span className="flex items-center gap-1.5 text-primary">
                    <span className="w-3 h-0.5 bg-primary" />
                    <T gu="વાસ્તવિક DBT જમા" en="Actual DBT" hi="वास्तविक DBT" />
                  </span>
                  <span className="flex items-center gap-1.5 text-outline">
                    <span className="w-3 h-0.5 border-t-2 border-dashed border-outline" />
                    <T gu="મંજૂર લક્ષ્યાંક" en="Target Target" hi="स्वीकृत लक्ष्य" />
                  </span>
                </div>
              </div>

              {/* LineChart Container */}
              <div className="w-full h-64 sm:h-72">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={MONTHLY_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} />
                      <YAxis stroke="#64748B" fontSize={12} tickLine={false} unit=" Cr" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0F172A",
                          borderColor: "#334155",
                          borderRadius: "8px",
                          color: "#F8FAFC",
                          fontSize: "12px",
                        }}
                        formatter={(value, name) => [
                          `₹ ${value} Cr`,
                          name === "disbursed" ? "વાસ્તવિક DBT" : "લક્ષ્યાંક",
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke="#94A3B8"
                        strokeDasharray="5 5"
                        strokeWidth={2}
                        dot={{ r: 3, fill: "#94A3B8" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="disbursed"
                        stroke="#1D4ED8"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#1D4ED8" }}
                        activeDot={{ r: 6, fill: "#F97316" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full bg-surface-container-high rounded animate-pulse" />
                )}
              </div>
            </div>

            {/* ── Scheme-wise Fund Breakdown & Recharts BarChart ── */}
            <div className="card p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-6 bg-secondary rounded-full shrink-0" />
                  <div>
                    <h2 className="font-title-lg text-title-lg text-on-surface">
                      <T
                        gu="યોજનાવાર ફંડ મંજૂરી અને સીધા વિતરણની સ્થિતિ"
                        en="Scheme-wise Sanction vs Direct Disbursement"
                        hi="योजनावार स्वीकृति और प्रत्यक्ष वितरण स्थिति"
                      />
                    </h2>
                    <p className="font-caption text-caption text-on-surface-variant">
                      <T
                        gu="બજેટ ફાળવણી વિરુદ્ધ વાસ્તવિક ચુકવણી (Disbursed vs Allocated)"
                        en="Budget Allocation vs Actual PFMS Credit (in ₹ Cr)"
                        hi="बजट आवंटन बनाम वास्तविक भुगतान (₹ करोड़ में)"
                      />
                    </p>
                  </div>
                </div>
                <span className="font-label-md text-label-md bg-primary/10 text-primary px-3 py-1 rounded-full font-bold self-start sm:self-center">
                  <T gu="કુલ વિતરણ: ₹ ૧,૨૪૦.૫ કરોડ" en="Total Disbursed: ₹ 1,240.5 Cr" hi="कुल वितरण: ₹ 1,240.5 करोड़" />
                </span>
              </div>

              {/* Recharts BarChart */}
              <div className="w-full h-56 sm:h-64 mb-6">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={SCHEME_DATA}
                      margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis
                        dataKey="enName"
                        stroke="#64748B"
                        fontSize={11}
                        tickLine={false}
                        interval={0}
                        angle={-15}
                        textAnchor="end"
                      />
                      <YAxis stroke="#64748B" fontSize={12} tickLine={false} unit=" Cr" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0F172A",
                          borderColor: "#334155",
                          borderRadius: "8px",
                          color: "#F8FAFC",
                          fontSize: "12px",
                        }}
                        formatter={(val, name) => [
                          `₹ ${val} Cr`,
                          name === "allocated" ? "મંજૂર બજેટ" : "વાસ્તવિક ચુકવણી",
                        ]}
                      />
                      <Legend
                        verticalAlign="top"
                        align="right"
                        wrapperStyle={{ paddingBottom: 10, fontSize: "12px" }}
                      />
                      <Bar dataKey="allocated" name="મંજૂર બજેટ (Allocated)" fill="#BFDBFE" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="disbursed" name="વાસ્તવિક ચુકવણી (Disbursed)" fill="#1D4ED8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full bg-surface-container-high rounded animate-pulse" />
                )}
              </div>

              {/* Progress Bars for Detailed Schemes Breakdown */}
              <div className="space-y-4">
                {SCHEME_DATA.map((s) => (
                  <div key={s.nameKey} className="space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between font-body-sm text-body-sm gap-1">
                      <div className="flex items-center gap-2 font-semibold text-on-surface">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                        <span className="truncate">
                          <T gu={s.guName} en={s.enName} hi={s.hiName} />
                        </span>
                        <span className="font-caption text-caption bg-surface-container-low px-2 py-0.5 rounded text-on-surface-variant shrink-0 border border-outline-variant/60">
                          <T gu={s.category.gu} en={s.category.en} hi={s.category.hi} />
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 text-left sm:text-right">
                        <span className="font-caption text-caption text-outline">
                          <T
                            gu={`લક્ષ્યાંક: ₹ ${s.allocated} Cr`}
                            en={`Target: ₹ ${s.allocated} Cr`}
                            hi={`लक्ष्य: ₹ ${s.allocated} Cr`}
                          />
                        </span>
                        <span className="font-label-md text-label-md font-bold text-primary">
                          ₹ {s.disbursed} Cr ({s.pct}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-surface-container-low h-2.5 rounded-full overflow-hidden flex border border-outline-variant/40">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${s.pct}%`, backgroundColor: s.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* PFMS Gateway Status Footer */}
              <div className="mt-4 pt-3 bg-surface-container-low rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between text-on-surface-variant font-caption text-caption gap-2 border border-outline-variant/60">
                <div className="flex items-center gap-2">
                  <Icon name="account_balance" size={18} className="text-primary" />
                  <span>
                    <T
                      gu="PFMS ગેટવે સાથે ૧૦૦% ઈલેક્ટ્રોનિક એડવાઈસ ઓટોમેટેડ છે"
                      en="100% electronic payment advice automated via PFMS gateway"
                      hi="PFMS गेटवे के साथ 100% इलेक्ट्रॉनिक भुगतान सलाह स्वचालित"
                    />
                  </span>
                </div>
                <span className="font-semibold text-on-surface">
                  <T
                    gu="સરેરાશ સફળ વ્યવહાર દર: ૯૯.૭૨%"
                    en="Avg Successful Transaction: 99.72%"
                    hi="औसत सफल लेनदेन दर: 99.72%"
                  />
                </span>
              </div>
            </div>

            {/* ── District-wise Performance Data Table (Search, Filter & Below-Target Alerts) ── */}
            <div className="card p-5 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-6 bg-primary rounded-full shrink-0" />
                    <h2 className="font-title-lg text-title-lg text-on-surface">
                      <T
                        gu="જિલ્લાવાર વિગતવાર પ્રદર્શન સૂચિ (Performance Table)"
                        en="District-wise Performance Table"
                        hi="जिलावार प्रदर्शन तालिका"
                      />
                    </h2>
                  </div>
                  <p className="font-caption text-caption text-on-surface-variant">
                    <T
                      gu="વિદ્યાર્થી સંખ્યા, ડીબીટી ચુકવણી અને મંજૂરી દર સાથે લક્ષ્યાંક વિશ્લેષણ"
                      en="Student counts, DBT disbursements, and approval rates with alert statuses"
                      hi="छात्र संख्या, डीबीटी वितरण और स्वीकृति दर विश्लेषण"
                    />
                  </p>
                </div>

                {/* Filter and Search controls */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-outline text-[18px]">
                      search
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search district..."
                      className="h-9 pl-9 pr-3 rounded-lg bg-surface-container-low text-on-surface text-body-sm placeholder:text-outline border border-outline-variant focus:outline-none focus:ring-1 focus:ring-primary w-40 sm:w-48"
                    />
                  </div>

                  <select
                    value={tierFilter}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTierFilter(e.target.value as "all" | "high" | "average" | "focus")}
                    className="h-9 px-2.5 rounded-lg bg-surface-container-low text-on-surface text-body-sm border border-outline-variant focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="all">બધા જિલ્લા (All)</option>
                    <option value="high">&gt;૯૦% (High)</option>
                    <option value="average">૭૫-૯૦% (Avg)</option>
                    <option value="focus">&lt;૭૫% (Alerts)</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto border border-outline-variant rounded-lg">
                <table className="w-full text-left text-body-sm">
                  <thead className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md uppercase tracking-wider border-b border-outline-variant">
                    <tr>
                      <th className="py-3 px-4">
                        <T gu="જિલ્લો (District)" en="District" hi="जिला" />
                      </th>
                      <th className="py-3 px-3">
                        <T gu="વિદ્યાર્થી સંખ્યા" en="Students" hi="छात्र संख्या" />
                      </th>
                      <th className="py-3 px-3">
                        <T gu="DBT રકમ" en="DBT Amount" hi="DBT राशि" />
                      </th>
                      <th className="py-3 px-3">
                        <T gu="કવરેજ" en="Coverage" hi="कवरेज" />
                      </th>
                      <th className="py-3 px-3">
                        <T gu="મંજૂરી દર" en="Approval" hi="स्वीकृति दर" />
                      </th>
                      <th className="py-3 px-4">
                        <T gu="સ્થિતિ / એલર્ટ" en="Status / Alerts" hi="स्थिति / अलर्ट" />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/60">
                    {filteredDistricts.map((d) => (
                      <tr
                        key={d.id}
                        onClick={() => setSelectedDistrictId(d.id)}
                        className={`hover:bg-surface-container-low/60 cursor-pointer transition-colors ${
                          d.id === selectedDistrictId ? "bg-primary/5 font-semibold" : ""
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-on-surface">
                              <T gu={d.name.gu} en={d.name.en} hi={d.name.hi} />
                            </span>
                            <span className="font-caption text-caption text-outline">{d.code}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-medium text-on-surface">{d.students}</td>
                        <td className="py-3 px-3 font-bold text-primary">{d.disbursed}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-on-surface">{d.coverage}%</span>
                            <div className="w-12 bg-surface-container-high h-1.5 rounded-full overflow-hidden hidden sm:block">
                              <div
                                className={`h-full rounded-full ${
                                  d.tier === "high"
                                    ? "bg-primary"
                                    : d.tier === "focus"
                                    ? "bg-danger"
                                    : "bg-tertiary"
                                }`}
                                style={{ width: `${d.coverage}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-medium text-on-surface">{d.approvalRate}%</td>
                        <td className="py-3 px-4">
                          {d.tier === "focus" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-caption font-semibold bg-danger-container text-danger border border-danger/20">
                              <Icon name="warning" size={14} className="text-danger" />
                              <T gu="લક્ષ્યાંકથી નીચે" en="Below Target" hi="लक्ष्य से नीचे" />
                            </span>
                          ) : d.tier === "high" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-caption font-semibold bg-chip-approved-bg text-chip-approved-text border border-chip-approved-border">
                              <Icon name="check_circle" size={14} className="text-chip-approved-text" />
                              <T gu="ઉત્કૃષ્ટ" en="High Target" hi="उत्कृष्ट" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-caption font-semibold bg-surface-container text-on-surface-variant border border-outline-variant">
                              <Icon name="autorenew" size={14} className="text-on-surface-variant" />
                              <T gu="પ્રગતિમાં" en="On Track" hi="प्रगति पर" />
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── Right Column (5 cols): District Rankings, Gender, Demographics ── */}
          <div className="xl:col-span-5 flex flex-col gap-6">
            
            {/* ── District Rankings: Top 5 and Bottom 5 Need Support ── */}
            <div className="card p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-6 bg-primary rounded-full shrink-0" />
                    <h2 className="font-title-lg text-title-lg text-on-surface">
                      <T
                        gu="શ્રેષ્ઠ અને પાછળ રહેલા જિલ્લાઓ"
                        en="Top & Lagging Districts"
                        hi="शीर्ष और पिछड़े जिले"
                      />
                    </h2>
                  </div>
                  <span className="font-caption text-caption text-outline">
                    <T gu="કુલ ૩૩ જિલ્લા રેન્કિંગ" en="33 Districts Rank" hi="कुल 33 जिला रैंकिंग" />
                  </span>
                </div>

                {/* Top 5 Leaderboard */}
                <div className="mb-5">
                  <div className="flex items-center justify-between pb-1 mb-2">
                    <span className="font-label-md text-label-md font-bold text-primary flex items-center gap-1.5">
                      <Icon name="workspace_premium" size={18} className="text-secondary" />
                      <span><T gu="ટોપ ૫ ઉત્કૃષ્ટ જિલ્લા (Top 5)" en="Top 5 Performing Districts" hi="शीर्ष 5 उत्कृष्ट जिले" /></span>
                    </span>
                    <span className="font-caption text-caption text-outline">
                      <T gu="સિદ્ધિ દર" en="Coverage %" hi="उपलब्धि दर" />
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {[
                      { rank: "૧", gu: "આણંદ", en: "Anand", desk: "ડેસ્ક ૦૪", pct: "૯૪.૨%", num: 94.2 },
                      { rank: "૨", gu: "ગાંધીનગર", en: "Gandhinagar", desk: "ડેસ્ક ૦૧", pct: "૯૨.૮%", num: 92.8 },
                      { rank: "૩", gu: "મહેસાણા", en: "Mehsana", desk: "ડેસ્ક ૦૭", pct: "૯૧.૫%", num: 91.5 },
                      { rank: "૪", gu: "નવસારી", en: "Navsari", desk: "ડેસ્ક ૧૧", pct: "૯૦.૨%", num: 90.2 },
                      { rank: "૫", gu: "પોરબંદર", en: "Porbandar", desk: "ડેસ્ક ૧૯", pct: "૮૯.૪%", num: 89.4 },
                    ].map((item, idx) => (
                      <div
                        key={item.en}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/50 hover:bg-surface-container transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-6 h-6 rounded-full font-caption text-caption font-bold flex items-center justify-center ${
                              idx === 0
                                ? "bg-primary text-on-primary"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
                            {item.rank}
                          </span>
                          <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                            <T gu={item.gu} en={item.en} hi={item.en} />
                          </span>
                          <span className="font-caption text-caption text-outline">{item.desk}</span>
                        </div>
                        <span className="font-label-lg text-label-lg font-bold text-primary">
                          {item.pct}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom 5 / Intervention Needed */}
                <div>
                  <div className="flex items-center justify-between pb-1 mb-2">
                    <span className="font-label-md text-label-md font-bold text-danger flex items-center gap-1.5">
                      <Icon name="warning" size={18} className="text-danger" />
                      <span><T gu="પાછળ રહેલા ૫ જિલ્લા (Urgent Intervention)" en="Bottom 5 (Intervention Needed)" hi="पिछड़े 5 जिले (हस्तक्षेप)" /></span>
                    </span>
                    <span className="font-caption text-caption text-danger font-medium">
                      <T gu="વિલંબ સ્થિતિ" en="Status" hi="स्थिति" />
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {[
                      { rank: "૩૩", gu: "ડાંગ", en: "Dang", reason: { gu: "નેટવર્ક અભાવ", en: "Low Network", hi: "कम नेटवर्क" }, pct: "૬૬.૨%", badge: "danger" },
                      { rank: "૩૨", gu: "છોટા ઉદેપુર", en: "Chhota Udepur", reason: { gu: "આદિજાતિ બેલ્ટ", en: "Tribal Belt", hi: "आदिवासी बेल्ट" }, pct: "૬૮.૫%", badge: "danger" },
                      { rank: "૩૧", gu: "દાહોદ", en: "Dahod", reason: { gu: "ડોક્યુમેન્ટ પેન્ડન્સી", en: "Doc Pendency", hi: "दस्तावेज़ लंबित" }, pct: "૭૧.૪%", badge: "danger" },
                      { rank: "૩૦", gu: "કચ્છ", en: "Kutch", reason: { gu: "વિશાળ વિસ્તાર", en: "Vast Area", hi: "विशाल क्षेत्र" }, pct: "૭૨.૮%", badge: "warning" },
                      { rank: "૨૯", gu: "નર્મદા", en: "Narmada", reason: { gu: "કેમ્પિંગ જરૂરી", en: "Camps Needed", hi: "शिविर आवश्यक" }, pct: "૭૩.૫%", badge: "warning" },
                    ].map((item) => (
                      <div
                        key={item.en}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-danger-container/20 border border-danger/30 hover:bg-danger-container/30 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-6 h-6 rounded-full font-caption text-caption font-bold flex items-center justify-center ${
                              item.badge === "danger"
                                ? "bg-danger text-on-danger"
                                : "bg-secondary text-on-secondary"
                            }`}
                          >
                            {item.rank}
                          </span>
                          <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                            <T gu={item.gu} en={item.en} hi={item.en} />
                          </span>
                          <span className="font-caption text-caption text-danger">
                            <T gu={item.reason.gu} en={item.reason.en} hi={item.reason.hi} />
                          </span>
                        </div>
                        <span className="font-label-lg text-label-lg font-bold text-danger">
                          {item.pct}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Callout Button */}
              <div className="mt-4 pt-2">
                <button
                  onClick={() => setMeetingModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-lg bg-secondary hover:bg-secondary/90 text-on-secondary font-label-md text-label-md flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
                  id="btn-call-meeting"
                >
                  <Icon name="video_call" size={20} />
                  <span>
                    <T
                      gu="૫ પછાત જિલ્લાઓ માટે વિશેષ સમીક્ષા બેઠક બોલાવો (DDO Review)"
                      en="Call Emergency DDO Review Meeting for 5 Focus Districts"
                      hi="5 पिछड़े जिलों के लिए विशेष DDO समीक्षा बैठक बुलाएं"
                    />
                  </span>
                </button>
              </div>
            </div>

            {/* ── Gender Focus & Girl Child Priority Donut Component ── */}
            <div className="card p-5 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-6 bg-secondary rounded-full shrink-0" />
                  <div>
                    <h2 className="font-title-lg text-title-lg text-on-surface">
                      <T
                        gu="કન્યા કેળવણી પ્રાથમિકતા ગુણોત્તર"
                        en="Girl Child Priority Ratio"
                        hi="बालिका शिक्षा प्राथमिकता अनुपात"
                      />
                    </h2>
                    <p className="font-caption text-caption text-on-surface-variant">
                      <T
                        gu="નમો લક્ષ્મી અને સરસ્વતી સાધના યોજના અસરકારકતા"
                        en="Namo Lakshmi & Saraswati Sadhna Scheme Impact"
                        hi="नमो लक्ष्मी और सरस्वती साधना प्रभाव"
                      />
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-secondary/15 text-secondary font-label-md text-label-md font-bold">
                  <T gu="૬૮.૪% કન્યાઓ" en="68.4% Girls" hi="68.4% बालिकाएं" />
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
                {/* SVG Donut */}
                <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-surface-container-high"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4.5"
                    />
                    {/* Female Segment: 68.4% (Saffron) */}
                    <path
                      className="text-secondary transition-all duration-1000"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="68.4, 100"
                      strokeLinecap="round"
                      strokeWidth="4.5"
                    />
                    {/* Male Segment: 31.6% (Blue) */}
                    <path
                      className="text-primary transition-all duration-1000"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="31.6, 100"
                      strokeDashoffset="-68.4"
                      strokeLinecap="round"
                      strokeWidth="4.5"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      ૨૧.૪L
                    </span>
                    <span className="font-caption text-caption text-outline">
                      <T gu="લાભાર્થી" en="Beneficiaries" hi="लाभार्थी" />
                    </span>
                  </div>
                </div>

                {/* Legend & Stats */}
                <div className="flex-1 w-full space-y-2.5">
                  <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/60 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-secondary shrink-0" />
                      <div>
                        <span className="font-body-sm text-body-sm font-bold text-on-surface">
                          <T gu="કન્યા વિદ્યાર્થીઓ (Girl Child)" en="Girl Students" hi="छात्राएं (बालिका)" />
                        </span>
                        <span className="font-caption text-caption text-on-surface-variant block">
                          <T gu="૧૪.૬૬ લાખ લાભાર્થી કન્યાઓ" en="14.66 Lakh Beneficiaries" hi="14.66 लाख बालिका लाभार्थी" />
                        </span>
                      </div>
                    </div>
                    <span className="font-title-md text-title-md font-bold text-secondary">
                      ૬૮.૪%
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/60 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-primary shrink-0" />
                      <div>
                        <span className="font-body-sm text-body-sm font-bold text-on-surface">
                          <T gu="કુમાર વિદ્યાર્થીઓ (Boy Child)" en="Boy Students" hi="छात्र (बालक)" />
                        </span>
                        <span className="font-caption text-caption text-on-surface-variant block">
                          <T gu="૬.૭૮ લાખ લાભાર્થી કુમારો" en="6.78 Lakh Beneficiaries" hi="6.78 लाख बालक लाभार्थी" />
                        </span>
                      </div>
                    </div>
                    <span className="font-title-md text-title-md font-bold text-primary">
                      ૩૧.૬%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Urban vs Rural Distribution Insight ── */}
            <div className="card p-5 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-title-md text-title-md text-on-surface">
                  <T
                    gu="શહેરી વિરુદ્ધ ગ્રામીણ વિતરણ (Demographics)"
                    en="Urban vs Rural Distribution"
                    hi="शहरी बनाम ग्रामीण वितरण"
                  />
                </h3>
                <span className="font-caption text-caption text-primary font-semibold">
                  <T gu="ગ્રામ્ય પ્રાધાન્ય (૭૨%)" en="Rural Focus (72%)" hi="ग्रामीण प्राथमिकता (72%)" />
                </span>
              </div>

              <div className="space-y-3">
                {/* Visual Stacked Bar */}
                <div className="w-full h-3.5 rounded-full bg-surface-container-high overflow-hidden flex">
                  <div className="bg-primary h-full transition-all" style={{ width: "72%" }} title="ગ્રામ્ય: ૭૨%" />
                  <div className="bg-tertiary h-full transition-all" style={{ width: "28%" }} title="શહેરી: ૨૮%" />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/60">
                    <div className="flex items-center gap-1.5 text-primary mb-1">
                      <Icon name="agriculture" size={18} />
                      <span className="font-label-md text-label-md font-bold">
                        <T gu="ગ્રામ્ય શાળાઓ" en="Rural Schools" hi="ग्रामीण स्कूल" />
                      </span>
                    </div>
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface">૭૨%</span>
                    <span className="font-caption text-caption text-outline block mt-0.5">
                      ₹ ૮૯૩.૨ Cr (૧૫.૪L છાત્રો)
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/60">
                    <div className="flex items-center gap-1.5 text-tertiary mb-1">
                      <Icon name="location_city" size={18} />
                      <span className="font-label-md text-label-md font-bold">
                        <T gu="શહેરી શાળાઓ" en="Urban Schools" hi="शहरी स्कूल" />
                      </span>
                    </div>
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface">૨૮%</span>
                    <span className="font-caption text-caption text-outline block mt-0.5">
                      ₹ ૩૪૭.૩ Cr (૬.૦L છાત્રો)
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Bottom Section: State Command & Monitoring Live Alerts ── */}
        <section className="card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 bg-primary rounded-full shrink-0" />
              <h2 className="font-title-lg text-title-lg text-on-surface">
                <T
                  gu="રાજ્ય કમાન્ડ એન્ડ મોનિટરિંગ લાઇવ ચેતવણીઓ (Critical Alerts)"
                  en="State Command & Monitoring Live Alerts"
                  hi="राज्य कमांड और निगरानी लाइव चेतावनियां"
                />
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
              <span className="font-caption text-caption text-on-surface-variant font-semibold">
                <T gu="સ્વચાલિત સેતુ મોનિટર" en="Automated Setu Monitor" hi="स्वचालित सेतु मॉनिटर" />
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {/* Alert Strip 1: Success */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant/60 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-chip-approved-bg flex items-center justify-center text-chip-approved-text shrink-0">
                  <Icon name="check_circle" size={22} />
                </div>
                <div>
                  <span className="font-label-md text-label-md text-success font-bold uppercase tracking-wide">
                    <T gu="DBT ચુકવણી સફળ (Success)" en="DBT Payment Success" hi="DBT भुगतान सफल" />
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface font-medium">
                    <T
                      gu="નમો લક્ષ્મી યોજના અંતર્ગત આજે ૨.૧ લાખ કન્યા વિદ્યાર્થીઓના ખાતામાં PFMS દ્વારા ₹ ૨૬.૨ કરોડ સીધા જમા થયા."
                      en="₹ 26.2 Cr directly credited via PFMS to 2.1 Lakh girl students under Namo Lakshmi Scheme today."
                      hi="नमो लक्ष्मी योजना के तहत आज 2.1 लाख छात्राओं के खातों में PFMS द्वारा ₹ 26.2 करोड़ सीधे जमा हुए।"
                    />
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <span className="font-caption text-caption text-outline">આજે ૧૦:૧૫ AM</span>
                <Link
                  href="/admin/funds"
                  className="px-3 py-1 rounded bg-surface-container text-primary font-caption text-caption font-semibold hover:bg-surface-container-high border border-outline-variant transition-colors"
                >
                  <T gu="વિગત જુઓ" en="View Details" hi="विवरण देखें" />
                </Link>
              </div>
            </div>

            {/* Alert Strip 2: Tribal Focus Intervention */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-3.5 rounded-xl bg-secondary/10 hover:bg-secondary/15 transition-colors border border-secondary/20 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary shrink-0">
                  <Icon name="sensors_off" size={22} />
                </div>
                <div>
                  <span className="font-label-md text-label-md text-secondary font-bold uppercase tracking-wide">
                    <T gu="આદિજાતિ વિસ્તાર ખાસ ઝુંબેશ (Field Deployment)" en="Tribal Campaign (Field Deployment)" hi="आदिवासी क्षेत्र विशेष अभियान" />
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface font-medium">
                    <T
                      gu="૩ આદિજાતિ જિલ્લાઓમાં (ડાંગ, દાહોદ, છોટા ઉદેપુર) મોબાઇલ નેટવર્ક અભાવે ઓફલાઇન કેમ્પિંગ ટીમ તૈનાત કરવામાં આવી."
                      en="Offline mobile camps deployed across Dang, Dahod & Chhota Udepur to bridge connectivity deficits."
                      hi="डांग, दाहोद और छोटा उदेपुर में कनेक्टिविटी की कमी के लिए ऑफलाइन शिविर टीम तैनात की गई।"
                    />
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <span className="font-caption text-caption text-outline">આજે ૦૯:૪૦ AM</span>
                <Link
                  href="/deo/grievances"
                  className="px-3 py-1 rounded bg-secondary text-on-secondary font-caption text-caption font-semibold hover:bg-secondary/90 transition-colors"
                >
                  <T gu="નોડલ સંપર્ક" en="Contact Nodal" hi="नोडल संपर्क" />
                </Link>
              </div>
            </div>

            {/* Alert Strip 3: Fraud / Anomaly Blocked */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-3.5 rounded-xl bg-danger-container/30 hover:bg-danger-container/40 transition-colors border border-danger/30 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-danger-container flex items-center justify-center text-danger shrink-0">
                  <Icon name="shield" size={22} />
                </div>
                <div>
                  <span className="font-label-md text-label-md text-danger font-bold uppercase tracking-wide">
                    <T gu="સુરક્ષા એલર્ટ: બોગસ ડેટા અટકાવ્યો (Fraud Intercepted)" en="Security Alert: Fraud Blocked" hi="सुरक्षा अलर्ट: फर्जी डेटा रोका गया" />
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface font-medium">
                    <T
                      gu="આધાર અસંગતતાના કારણે બોગસ ૧,૪૨૦ એકાઉન્ટ્સ પર DBT રોકી ₹ ૨.૮ કરોડની સરકારી છેતરપિંડી સફળતાપૂર્વક અટકાવાઈ."
                      en="DBT paused for 1,420 mismatched Aadhaar entries, safeguarding ₹ 2.8 Cr via AI cross-verification."
                      hi="आधार बेमेल के कारण 1,420 संदिग्ध खातों पर DBT रोककर ₹ 2.8 करोड़ की धोखाधड़ी को रोका गया।"
                    />
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <span className="font-caption text-caption text-outline">ગઈકાલે ૧૧:૧૨ PM</span>
                <Link
                  href="/admin/fraud"
                  className="px-3 py-1 rounded bg-danger text-on-danger font-caption text-caption font-semibold hover:opacity-90 transition-colors"
                >
                  <T gu="ઓડિટ લૉગ" en="Audit Log" hi="ऑडिट लॉग" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Institutional Metadata & Compliance Footer ── */}
        <footer className="flex flex-col sm:flex-row items-center justify-between py-3 px-4 bg-surface-container-low rounded-xl text-on-surface-variant font-caption text-caption gap-2 border border-outline-variant/60">
          <div className="flex items-center gap-2">
            <Icon name="lock" size={16} className="text-primary" />
            <span>
              <T
                gu="ડેટા સ્ત્રોત: વિદ્યા સમીક્ષા કેન્દ્ર (VSK) & PFMS API • છેલ્લું અપડેટ: આજે ૧૧:૪૫ AM • NIC સ્ટેટ ડેટા સેન્ટર સુરક્ષિત"
                en="Source: Vidya Samiksha Kendra (VSK) & PFMS API • Last Synced: Today 11:45 AM • NIC SDC Secured"
                hi="स्रोत: विद्या समीक्षा केंद्र (VSK) और PFMS API • अंतिम सिंक: आज 11:45 AM • NIC डेटा सेंटर सुरक्षित"
              />
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/audit" className="hover:text-primary transition-colors">
              <T gu="ઓડિટ લૉગ્સ" en="Audit Trail" hi="ऑडिट ट्रेल्स" />
            </Link>
            <span>•</span>
            <Link href="/student/assistant" className="hover:text-primary transition-colors">
              <T gu="ડેશબોર્ડ સહાય (Helpdesk)" en="Helpdesk" hi="हेल्पडेस्क" />
            </Link>
            <span>•</span>
            <span className="text-secondary font-semibold">
              <T gu="વર્ઝન ૪.૨.૧" en="v4.2.1 (Gujarat EdTech)" hi="संस्करण 4.2.1" />
            </span>
          </div>
        </footer>

        {/* ── Modal for DDO Emergency Meeting ── */}
        {meetingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-level-3 border border-outline-variant">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-outline-variant">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary">
                    <Icon name="video_call" size={24} />
                  </div>
                  <div>
                    <h3 className="font-title-md text-title-md text-on-surface font-bold">
                      <T
                        gu="DDO વિશેષ સમીક્ષા બેઠક વિનંતી"
                        en="Schedule Special DDO Review Meeting"
                        hi="विशेष DDO समीक्षा बैठक निर्धारित करें"
                      />
                    </h3>
                    <p className="font-caption text-caption text-on-surface-variant">
                      <T
                        gu="૫ પછાત જિલ્લાઓ: ડાંગ, છોટા ઉદેપુર, દાહોદ, કચ્છ, નર્મદા"
                        en="5 Focus Districts: Dang, Chhota Udepur, Dahod, Kutch, Narmada"
                        hi="5 पिछड़े जिले: डांग, छोटा उदेपुर, दाहोद, कच्छ, नर्मदा"
                      />
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMeetingModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant"
                >
                  <Icon name="close" size={20} />
                </button>
              </div>

              <div className="space-y-4 py-2">
                <div className="p-3 rounded-lg bg-danger-container/20 border border-danger/30 text-on-surface text-body-sm">
                  <p className="font-semibold text-danger mb-1">
                    <T
                      gu="વિલંબ નિવારણ એજન્ડા:"
                      en="Action Agenda:"
                      hi="कार्यवाही एजेंडा:"
                    />
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-caption text-on-surface-variant">
                    <li><T gu="આદિજાતિ વિસ્તારોમાં ઑફલાઇન વેરિફિકેશન કેમ્પની સમીક્ષા" en="Review of offline verification camps in tribal belts" hi="आदिवासी क्षेत्रों में ऑफ़लाइन सत्यापन शिविर समीक्षा" /></li>
                    <li><T gu="સાયકલ વિતરણ પુરવઠા સાંકળ ઝડપી બનાવવી" en="Fast-tracking cycle distribution supply chain" hi="साइकिल आपूर्ति श्रृंखला को गति देना" /></li>
                    <li><T gu="બેંક ખાતા આધાર સીડિંગ પેન્ડન્સી તાત્કાલિક પૂર્ણ કરવી" en="Expediting bank account Aadhaar seeding pendency" hi="बैंक खाता आधार सीडिंग लंबितता को तुरंत हल करना" /></li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <label className="font-caption text-caption text-on-surface-variant font-semibold">
                    <T gu="સૂચિત સમય" en="Proposed Time" hi="प्रस्तावित समय" />
                  </label>
                  <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant text-body-sm font-medium">
                    આજે સાંજે ૦૫:૦૦ PM • VSK વિડીયો કોન્ફરન્સ હબ (NIC)
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-outline-variant">
                <button
                  onClick={() => setMeetingModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-label-md font-medium"
                >
                  <T gu="રદ કરો" en="Cancel" hi="रद्द करें" />
                </button>
                <button
                  onClick={() => {
                    alert("DDO સમીક્ષા બેઠકની સૂચના સંબંધિત ૫ કચેરીઓને મોકલી દેવાઈ છે.");
                    setMeetingModalOpen(false);
                  }}
                  className="px-5 py-2 rounded-lg bg-secondary text-on-secondary hover:bg-secondary/90 text-label-md font-bold shadow-sm"
                >
                  <T gu="બેઠક નોટિસ મોકલો" en="Issue Meeting Notice" hi="बैठक नोटिस भेजें" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </OfficerShell>
  );
}
