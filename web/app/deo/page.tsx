"use client";

import { useState } from "react";
import Link from "next/link";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { KpiCard, StatusChip, Avatar } from "@/components/ui";

interface TalukaRow {
  nameGu: string;
  nameEn: string;
  nameHi: string;
  schools: number;
  eligible: string;
  approvalPct: number;
  pending: string;
  cyclePct: number;
  atRisk: number;
  statusGu: string;
  statusEn: string;
  statusHi: string;
  statusColor: string;
}

interface PendingItem {
  id: string;
  studentNameGu: string;
  studentNameEn: string;
  studentNameHi: string;
  ctsId: string;
  schoolGu: string;
  schoolEn: string;
  schoolHi: string;
  talukaGu: string;
  talukaEn: string;
  talukaHi: string;
  schemeGu: string;
  schemeEn: string;
  schemeHi: string;
  amount: string;
  verifiedDetailsGu: string;
  verifiedDetailsEn: string;
  verifiedDetailsHi: string;
}

const TALUKA_DATA: TalukaRow[] = [
  {
    nameGu: "આણંદ (મુખ્યાલય)",
    nameEn: "Anand (HQ)",
    nameHi: "आणंद (मुख्यालय)",
    schools: 142,
    eligible: "૨,૮૫૦",
    approvalPct: 92,
    pending: "૨૮",
    cyclePct: 88,
    atRisk: 12,
    statusGu: "ઉત્કૃષ્ટ",
    statusEn: "Excellent",
    statusHi: "उत्कृष्ट",
    statusColor: "bg-surface-container-high text-primary",
  },
  {
    nameGu: "સોજિત્રા",
    nameEn: "Sojitra",
    nameHi: "सोजित्रा",
    schools: 48,
    eligible: "૯૧૨",
    approvalPct: 88,
    pending: "૧૮",
    cyclePct: 79,
    atRisk: 5,
    statusGu: "ઉત્કૃષ્ટ",
    statusEn: "Excellent",
    statusHi: "उत्कृष्ट",
    statusColor: "bg-surface-container-high text-primary",
  },
  {
    nameGu: "બોરસદ",
    nameEn: "Borsad",
    nameHi: "बोरसद",
    schools: 116,
    eligible: "૨,૨૮૦",
    approvalPct: 85,
    pending: "૪૨",
    cyclePct: 74,
    atRisk: 14,
    statusGu: "સામાન્ય",
    statusEn: "Normal",
    statusHi: "सामान्य",
    statusColor: "bg-surface-container text-on-surface",
  },
  {
    nameGu: "ઉમરેઠ",
    nameEn: "Umreth",
    nameHi: "उमरेठ",
    schools: 66,
    eligible: "૧,૨૪૫",
    approvalPct: 84,
    pending: "૨૬",
    cyclePct: 76,
    atRisk: 7,
    statusGu: "સામાન્ય",
    statusEn: "Normal",
    statusHi: "सामान्य",
    statusColor: "bg-surface-container text-on-surface",
  },
  {
    nameGu: "પેટલાદ",
    nameEn: "Petlad",
    nameHi: "पेटलाद",
    schools: 86,
    eligible: "૧,૬૮૦",
    approvalPct: 81,
    pending: "૩૪",
    cyclePct: 68,
    atRisk: 9,
    statusGu: "સામાન્ય",
    statusEn: "Normal",
    statusHi: "सामान्य",
    statusColor: "bg-surface-container text-on-surface",
  },
  {
    nameGu: "આંકલાવ",
    nameEn: "Anklav",
    nameHi: "आंकलाव",
    schools: 52,
    eligible: "૧,૦૬૪",
    approvalPct: 79,
    pending: "૩૧",
    cyclePct: 63,
    atRisk: 8,
    statusGu: "નિરીક્ષણ",
    statusEn: "Under Watch",
    statusHi: "निगरानी",
    statusColor: "bg-secondary-fixed text-on-secondary-fixed",
  },
  {
    nameGu: "ખંભાત",
    nameEn: "Khambhat",
    nameHi: "खंभात",
    schools: 84,
    eligible: "૧,૬૧૪",
    approvalPct: 76,
    pending: "૩૨",
    cyclePct: 59,
    atRisk: 7,
    statusGu: "તાકીદનું ધ્યાન",
    statusEn: "Needs Attention",
    statusHi: "ध्यान आवश्यक",
    statusColor: "bg-error-container text-on-error-container",
  },
  {
    nameGu: "તારાપુર",
    nameEn: "Tarapur",
    nameHi: "तारापुर",
    schools: 48,
    eligible: "૮૦૫",
    approvalPct: 74,
    pending: "૨૩",
    cyclePct: 54,
    atRisk: 5,
    statusGu: "તાકીદનું ધ્યાન",
    statusEn: "Needs Attention",
    statusHi: "ध्यान आवश्यक",
    statusColor: "bg-error-container text-on-error-container",
  },
];

const INITIAL_PENDING_QUEUE: PendingItem[] = [
  {
    id: "APP-GJ-2026-0812",
    studentNameGu: "પ્રિયા રમેશભાઈ પટેલ",
    studentNameEn: "Priya R. Patel",
    studentNameHi: "प्रिया आर. पटेल",
    ctsId: "GJ-AND-2026-004812",
    schoolGu: "શ્રી સરદાર પટેલ વિનય મંદિર",
    schoolEn: "Shree Sardar Patel Vinay Mandir",
    schoolHi: "श्री सरदार पटेल विनय मंदिर",
    talukaGu: "આણંદ",
    talukaEn: "Anand",
    talukaHi: "Anand",
    schemeGu: "નમો લક્ષ્મી યોજના (Namo Lakshmi)",
    schemeEn: "Namo Lakshmi Scheme",
    schemeHi: "नमो लक्ष्मी योजना",
    amount: "₹ ૧૦,૦૦૦/વર્ષ",
    verifiedDetailsGu: "આધાર સીડેડ • ૯૧% હાજરી • પાત્રતા પાસ",
    verifiedDetailsEn: "Aadhaar Seeded • 91% Attendance • Eligible",
    verifiedDetailsHi: "आधार सीडेड • 91% उपस्थिति • पात्र",
  },
  {
    id: "APP-GJ-2026-0945",
    studentNameGu: "રાહુલ દિનેશભાઈ વણકર",
    studentNameEn: "Rahul D. Vankar",
    studentNameHi: "राहुल डी. वणकर",
    ctsId: "GJ-AND-2026-005120",
    schoolGu: "સાર્વજનિક હાઈસ્કૂલ, બોરસદ",
    schoolEn: "Sarvajanik High School, Borsad",
    schoolHi: "सार्वजनिक हाई स्कूल, बोरसद",
    talukaGu: "બોરસદ",
    talukaEn: "Borsad",
    talukaHi: "Borsad",
    schemeGu: "સરસ્વતી સાધના સાયકલ યોજના",
    schemeEn: "Saraswati Sadhana Bicycle Scheme",
    schemeHi: "सरस्वती साधना साइकिल योजना",
    amount: "નિઃશુલ્ક સાયકલ",
    verifiedDetailsGu: "ઘરથી અંતર ૪.૨ કિમી • કન્યા સશક્તિકરણ",
    verifiedDetailsEn: "Distance 4.2 km • Girl Empowerment",
    verifiedDetailsHi: "दूरी 4.2 किमी • बालिका सशक्तिकरण",
  },
  {
    id: "APP-GJ-2026-1033",
    studentNameGu: "આયેશા મોહમ્મદ પઠાણ",
    studentNameEn: "Ayesha M. Pathan",
    studentNameHi: "आयशा एम. पठान",
    ctsId: "GJ-AND-2026-003891",
    schoolGu: "મોડેલ સ્કૂલ, ખંભાત",
    schoolEn: "Model School, Khambhat",
    schoolHi: "मॉडल स्कूल, खंभात",
    talukaGu: "ખંભાત",
    talukaEn: "Khambhat",
    talukaHi: "Khambhat",
    schemeGu: "જ્ઞાન સાધના સ્કોલરશીપ",
    schemeEn: "Gyan Sadhana Scholarship",
    schemeHi: "ज्ञान साधना छात्रवृत्ति",
    amount: "₹ ૨૨,૦૦૦/વર્ષ",
    verifiedDetailsGu: "મેરિટ રેન્ક ૮૪ • બેંક PFMS વેરિફાઇડ",
    verifiedDetailsEn: "Merit Rank 84 • PFMS Bank Verified",
    verifiedDetailsHi: "मेरिट रैंक 84 • पीएफएमएस बैंक सत्यापित",
  },
  {
    id: "APP-GJ-2026-1142",
    studentNameGu: "વિશાલ કાળુભાઈ રાવળ",
    studentNameEn: "Vishal K. Rawal",
    studentNameHi: "विशाल के. रावल",
    ctsId: "GJ-AND-2026-006234",
    schoolGu: "સરકારી હાઈસ્કૂલ, પેટલાદ",
    schoolEn: "Government High School, Petlad",
    schoolHi: "सरकारी हाई स्कूल, पेटलाद",
    talukaGu: "પેટલાદ",
    talukaEn: "Petlad",
    talukaHi: "Petlad",
    schemeGu: "OBC / SEBC પૂર્વ-મેટ્રિક",
    schemeEn: "OBC / SEBC Pre-Matric",
    schemeHi: "ओबीसी / एसईबीसी प्री-मैट्रिक",
    amount: "₹ ૪,૫૦૦/વર્ષ",
    verifiedDetailsGu: "જાતિ અને આવક પ્રમાણપત્ર મેળવેલ",
    verifiedDetailsEn: "Caste & Income Verified",
    verifiedDetailsHi: "जाति और आय सत्यापित",
  },
];

export default function DeoDashboardPage() {
  const [selectedYear, setSelectedYear] = useState("2025-26");
  const [selectedScheme, setSelectedScheme] = useState("all");
  const [selectedTaluka, setSelectedTaluka] = useState("all");
  const [approvedIds, setApprovedIds] = useState<string[]>([]);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeSent, setNoticeSent] = useState(false);
  const [downloadToast, setDownloadToast] = useState(false);
  const [gisToast, setGisToast] = useState(false);
  const [actionNoticeToast, setActionNoticeToast] = useState(false);

  const handleApprove = (id: string) => {
    if (!approvedIds.includes(id)) {
      setApprovedIds([...approvedIds, id]);
    }
  };

  const handleDownload = () => {
    setDownloadToast(true);
    setTimeout(() => setDownloadToast(false), 3000);
  };

  const handleSendDefaulterNotice = () => {
    setNoticeSent(true);
    setTimeout(() => {
      setShowNoticeModal(false);
      setNoticeSent(false);
      setActionNoticeToast(true);
      setTimeout(() => setActionNoticeToast(false), 3500);
    }, 1500);
  };

  return (
    <OfficerShell role="deo">
      <div className="p-4 md:p-6 space-y-6 max-w-[1440px] mx-auto pb-16">
        {/* Toast Alerts */}
        {downloadToast && (
          <div className="fixed top-20 right-6 z-50 bg-primary text-on-primary px-4 py-3 rounded-xl shadow-level-2 flex items-center gap-2 animate-fade-in">
            <Icon name="check_circle" size={20} fill className="text-on-primary" />
            <span className="font-label-md text-label-md">
              <T
                gu="આણંદ જિલ્લા સારાંશ (.xlsx) સફળતાપૂર્વક ડાઉનલોડ થઈ રહી છે..."
                en="Anand District Summary (.xlsx) is downloading successfully..."
                hi="आणंद जिला सारांश (.xlsx) सफलतापूर्वक डाउनलोड हो रहा है..."
              />
            </span>
          </div>
        )}

        {actionNoticeToast && (
          <div className="fixed top-20 right-6 z-50 bg-success text-on-success px-4 py-3 rounded-xl shadow-level-2 flex items-center gap-2 animate-fade-in">
            <Icon name="sms" size={20} className="text-on-success" />
            <span className="font-label-md text-label-md">
              <T
                gu="૧૨ ડિફોલ્ટર શાળાઓના આચાર્યોને SMS ચેતવણી મોકલાઈ ગઈ છે!"
                en="SMS warnings sent to Principals of all 12 defaulter schools!"
                hi="सभी 12 डिफाल्टर स्कूलों के प्राचार्यों को एसएमएस चेतावनी भेज दी गई है!"
              />
            </span>
          </div>
        )}

        {gisToast && (
          <div className="fixed top-20 right-6 z-50 bg-surface-container-highest text-primary border border-primary/20 px-4 py-3 rounded-xl shadow-level-2 flex items-center gap-2 animate-fade-in">
            <Icon name="map" size={20} className="text-primary" />
            <span className="font-label-md text-label-md">
              <T
                gu="GIS નકશા ડેટા લોડ થઈ રહ્યો છે..."
                en="Loading GIS Geospatial saturation map..."
                hi="जीआईएस भू-स्थानिक मानचित्र लोड हो रहा है..."
              />
            </span>
          </div>
        )}

        {/* 1. Top Breadcrumbs, Officer Profile Strip & Filter Bar */}
        <section className="bg-surface-container-lowest p-6 rounded-2xl shadow-level-1 flex flex-col gap-5 border border-outline-variant">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md mb-2">
                <span className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                  <Icon name="domain" size={16} />
                  <span>
                    <T gu="જિલ્લા કચેરી (District HQ)" en="District HQ" hi="जिला मुख्यालय" />
                  </span>
                </span>
                <span className="text-outline">/</span>
                <span className="text-primary font-semibold flex items-center gap-1">
                  <Icon name="analytics" size={16} />
                  <span>
                    <T gu="જિલ્લા કમાન્ડ ડેશબોર્ડ (DEO Command Center)" en="DEO Command Center" hi="डीईओ कमांड सेंटर" />
                  </span>
                </span>
              </nav>

              {/* Title & Subtitle */}
              <div className="flex flex-col">
                <h1 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                  <T
                    gu="આણંદ જિલ્લા શિષ્યવૃત્તિ અને કલ્યાણ મોનિટરિંગ ડેશબોર્ડ"
                    en="Anand District Scholarship & Welfare Monitoring Dashboard"
                    hi="आणंद जिला छात्रवृत्ति और कल्याण निगरानी डैशबोर्ड"
                  />
                </h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  <T
                    gu="શૈક્ષણિક વર્ષ ૨૦૨૫-૨૬ • ૮ તાલુકા, ૬૪૨ માન્ય શાળાઓ અને ૧૨,૪૫૦ નોંધાયેલ વિદ્યાર્થીઓનું સમન્વય"
                    en="Academic Year 2025-26 • 8 Talukas, 642 Recognized Schools & 12,450 Registered Students"
                    hi="शैक्षणिक वर्ष 2025-26 • 8 तालुका, 642 मान्यता प्राप्त स्कूल और 12,450 पंजीकृत छात्र"
                  />
                </p>
              </div>

              {/* Officer Details Banner Tag */}
              <div className="flex flex-wrap items-center gap-3 mt-3 pt-2 border-t border-outline-variant">
                <div className="flex items-center gap-2">
                  <Avatar name="Hasmukh Trivedi" size="sm" className="bg-primary text-on-primary ring-1 ring-primary/20" />
                  <div>
                    <span className="font-label-md text-label-md font-bold text-on-surface">
                      <T gu="શ્રી હસમુખ જે. ત્રિવેદી" en="Shri Hasmukh J. Trivedi" hi="श्री हसमुख जे. त्रिवेदी" />
                    </span>
                    <span className="text-on-surface-variant font-caption text-caption ml-1.5">
                      (<T gu="જિલ્લા શિક્ષણ અધિકારી, આણંદ" en="DEO, Anand" hi="डीईओ, आणंद" />)
                    </span>
                  </div>
                </div>
                <span className="text-outline hidden sm:inline">•</span>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-caption text-caption font-medium">
                  <Icon name="badge" size={14} className="text-primary" />
                  <span>DEO-GJ-AND-04</span>
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-caption text-caption font-semibold border border-emerald-200">
                  <Icon name="verified_user" size={13} fill className="text-emerald-700" />
                  <T gu="DSC ટોકન પ્રમાણિત" en="DSC Token Verified" hi="डीएससी टोकन सत्यापित" />
                </div>
              </div>
            </div>

            {/* Quick Action Top Buttons */}
            <div className="flex items-center gap-3 shrink-0 self-start lg:self-center">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-high text-primary font-label-lg text-label-lg hover:bg-surface-container-highest transition-colors shadow-sm"
                type="button"
              >
                <Icon name="download" size={20} />
                <span>
                  <T gu="જિલ્લા સારાંશ (.xlsx)" en="District Summary (.xlsx)" hi="जिला सारांश (.xlsx)" />
                </span>
              </button>

              <Link
                href="/deo/approvals"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-on-secondary font-label-lg text-label-lg font-bold shadow-level-1 hover:opacity-90 transition-all active:scale-95"
              >
                <Icon name="approval_delegation" size={20} />
                <span>
                  <T gu="જથ્થાબંધ મંજૂરી ડેસ્ક (Bulk Approvals) →" en="Bulk Approvals Desk →" hi="थोक अनुमोदन डेस्क →" />
                </span>
              </Link>
            </div>
          </div>

          {/* Filter Ribbon Bar */}
          <div className="pt-3 bg-surface-container-low p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 border border-outline-variant">
            <div className="flex flex-wrap items-center gap-3">
              {/* Year Select */}
              <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-lg shadow-sm border border-outline-variant">
                <Icon name="calendar_month" size={18} className="text-outline" />
                <label className="font-caption text-caption text-on-surface-variant font-medium">
                  <T gu="શૈક્ષણિક વર્ષ:" en="Academic Year:" hi="शैक्षणिक वर्ष:" />
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-transparent font-label-lg text-label-lg text-on-surface font-bold focus:outline-none cursor-pointer"
                >
                  <option value="2025-26">૨૦૨૫-૨૬ (ચાલુ / Active)</option>
                  <option value="2024-25">૨૦૨૪-૨૫ (સંપન્ન / Archived)</option>
                </select>
              </div>

              {/* Scheme Select */}
              <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-lg shadow-sm border border-outline-variant">
                <Icon name="school" size={18} className="text-outline" />
                <label className="font-caption text-caption text-on-surface-variant font-medium">
                  <T gu="યોજના:" en="Scheme:" hi="योजना:" />
                </label>
                <select
                  value={selectedScheme}
                  onChange={(e) => setSelectedScheme(e.target.value)}
                  className="bg-transparent font-label-lg text-label-lg text-on-surface font-bold focus:outline-none cursor-pointer"
                >
                  <option value="all">તમામ ૮ સરકારી યોજનાઓ (All 8 Schemes)</option>
                  <option value="namo-lakshmi">નમો લક્ષ્મી યોજના (Namo Lakshmi)</option>
                  <option value="saraswati-sadhana">સરસ્વતી સાધના સાયકલ યોજના (Cycle Scheme)</option>
                  <option value="gyan-sadhana">જ્ઞાન સાધના સ્કોલરશીપ (Gyan Sadhana)</option>
                  <option value="obc-prematric">OBC / SEBC પૂર્વ-મેટ્રિક (Pre-Matric)</option>
                  <option value="nmms">NMMS મેરિટ સ્કોલરશીપ (NMMS Merit)</option>
                </select>
              </div>

              {/* Taluka Select */}
              <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-lg shadow-sm border border-outline-variant">
                <Icon name="location_on" size={18} className="text-outline" />
                <label className="font-caption text-caption text-on-surface-variant font-medium">
                  <T gu="તાલુકો:" en="Taluka:" hi="तालुका:" />
                </label>
                <select
                  value={selectedTaluka}
                  onChange={(e) => setSelectedTaluka(e.target.value)}
                  className="bg-transparent font-label-lg text-label-lg text-on-surface font-bold focus:outline-none cursor-pointer"
                >
                  <option value="all">સમગ્ર આણંદ જિલ્લો (તમામ ૮ તાલુકા)</option>
                  <option value="anand">આણંદ (મુખ્ય મથક / HQ)</option>
                  <option value="borsad">બોરસદ (Borsad)</option>
                  <option value="khambhat">ખંભાત (Khambhat)</option>
                  <option value="petlad">પેટલાદ (Petlad)</option>
                  <option value="umreth">ઉમરેઠ (Umreth)</option>
                  <option value="anklav">આંકલાવ (Anklav)</option>
                  <option value="sojitra">સોજિત્રા (Sojitra)</option>
                  <option value="tarapur">તારાપુર (Tarapur)</option>
                </select>
              </div>
            </div>

            {/* Server Sync Status */}
            <div className="flex items-center gap-2 text-on-surface-variant font-caption text-caption">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                <T
                  gu="છેલ્લું સિંક: ૧૮ મિનિટ પહેલાં • NIC સર્વર કનેક્ટેડ"
                  en="Last synced: 18 mins ago • NIC Server connected"
                  hi="अंतिम सिंक: 18 मिनट पहले • एनआईसी सर्वर कनेक्टेड"
                />
              </span>
            </div>
          </div>
        </section>

        {/* 2. KPI Metric Cards Row (Using KpiCard from @/components/ui) */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Total Students */}
            <KpiCard
              icon="group"
              label={
                <T
                  gu="જિલ્લામાં કુલ વિદ્યાર્થીઓ"
                  en="Total Students in District"
                  hi="जिले में कुल छात्र"
                />
              }
              value={
                <T
                  gu="૧૨,૪૫૦"
                  en="12,450"
                  hi="12,450"
                />
              }
              sub={
                <span className="inline-flex items-center gap-1 text-primary font-medium">
                  <Icon name="verified" size={13} fill className="text-primary" />
                  <T gu="૧૦૦% UDISE & CTS વેરિફાઇડ" en="100% UDISE & CTS Verified" hi="100% यूडीआईएसई व सीटीएस सत्यापित" />
                </span>
              }
              accent="text-primary"
            />

            {/* KPI 2: Pending Approvals */}
            <KpiCard
              icon="pending_actions"
              label={
                <T
                  gu="મંજૂરી માટે બાકી (પેન્ડિંગ)"
                  en="Pending Approvals"
                  hi="स्वीकृति हेतु लंबित"
                />
              }
              value={
                <T
                  gu="૨૩૪"
                  en="234"
                  hi="234"
                />
              }
              sub={
                <span className="text-secondary font-semibold">
                  <T gu="DEO હસ્તાક્ષરની જરૂર" en="Awaiting DEO Sign-off" hi="डीईओ हस्ताक्षर की आवश्यकता" />
                </span>
              }
              accent="text-secondary"
            />

            {/* KPI 3: DBT Disbursed */}
            <KpiCard
              icon="account_balance_wallet"
              label={
                <T
                  gu="આ મહિને DBT ચૂકવણી"
                  en="DBT Disbursed this month"
                  hi="इस माह डीबीटी संवितरित"
                />
              }
              value={
                <T
                  gu="₹ ૨.૩ Cr"
                  en="₹ 2.3 Cr"
                  hi="₹ 2.3 करोड़"
                />
              }
              sub={
                <span className="text-emerald-700 font-medium">
                  <T gu="PFMS મારફત આધાર-સીડેડ" en="Aadhaar-seeded via PFMS" hi="पीएफएमएस से आधार-सीडेड" />
                </span>
              }
              accent="text-primary"
            />

            {/* KPI 4: At-Risk Students */}
            <KpiCard
              icon="warning"
              label={
                <T
                  gu="જોખમી વિદ્યાર્થીઓ"
                  en="At-Risk Students"
                  hi="जोखिम में छात्र"
                />
              }
              value={
                <T
                  gu="૬૭"
                  en="67"
                  hi="67"
                />
              }
              sub={
                <span className="text-danger font-semibold">
                  <T gu="ઓછી હાજરી / ડ્રોપઆઉટ જોખમ" en="Low Attendance / Dropout Risk" hi="कम उपस्थिति / ड्रॉपआउट जोखिम" />
                </span>
              }
              accent="text-danger"
            />
          </div>

          {/* Additional Quick Metrics Bar (Cycle & Grievances) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                  <Icon name="directions_bike" size={22} />
                </div>
                <div>
                  <p className="font-caption text-caption text-on-surface-variant font-medium">
                    <T gu="સરસ્વતી સાયકલ વિતરણ" en="Saraswati Bicycle Distribution" hi="सरस्वती साइकिल वितरण" />
                  </p>
                  <p className="font-title-md text-title-md font-bold text-on-surface">
                    <T gu="૭૧% વિતરિત (૮,૫૨૦ / ૧૨,૦૦૦)" en="71% Disbursed (8,520 / 12,000)" hi="71% वितरित (8,520 / 12,000)" />
                  </p>
                </div>
              </div>
              <Link
                href="/deo/cycles"
                className="text-secondary font-label-md text-label-md font-semibold hover:underline flex items-center gap-1"
              >
                <T gu="વિગતો જુઓ" en="View Details" hi="विवरण देखें" />
                <Icon name="arrow_forward" size={16} />
              </Link>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-danger/10 flex items-center justify-center text-danger">
                  <Icon name="report_problem" size={22} />
                </div>
                <div>
                  <p className="font-caption text-caption text-on-surface-variant font-medium">
                    <T gu="ફરિયાદ નિવારણ સ્થિતિ" en="Grievance Redressal Status" hi="शिकायत निवारण स्थिति" />
                  </p>
                  <p className="font-title-md text-title-md font-bold text-on-surface">
                    <T gu="૪૮ સક્રિય (TAT: ૨.૧ દિવસ • ૬ SLA નજીક)" en="48 Active (TAT: 2.1 days • 6 near SLA)" hi="48 सक्रिय (TAT: 2.1 दिन • 6 SLA के करीब)" />
                  </p>
                </div>
              </div>
              <Link
                href="/deo/grievances"
                className="text-primary font-label-md text-label-md font-semibold hover:underline flex items-center gap-1"
              >
                <T gu="નિવારણ ડેસ્ક" en="Redressal Desk" hi="निवारण डेस्क" />
                <Icon name="arrow_forward" size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* 3. Quick Action Cards (4 Cards Required by Prompt) */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-title-md text-title-md text-on-surface font-bold flex items-center gap-2">
              <Icon name="bolt" size={20} className="text-secondary" />
              <T gu="DEO ઝડપી કાર્યવાહી ડેસ્ક" en="DEO Quick Action Desks" hi="डीईओ त्वरित कार्रवाई डेस्क" />
            </h2>
            <span className="font-caption text-caption text-on-surface-variant">
              <T gu="પ્રાથમિક મોડ્યુલ્સ સીધા ઍક્સેસ કરો" en="Direct access to primary modules" hi="प्राथमिक मॉड्यूल पर सीधे पहुंचें" />
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Quick Action 1: Bulk Approvals */}
            <Link
              href="/deo/approvals"
              className="card p-5 hover:shadow-level-2 transition-all group flex flex-col justify-between border-l-4 border-l-secondary bg-surface-container-lowest"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                    <Icon name="done_all" size={22} />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md font-bold">
                    <T gu="૨૩૪ બાકી" en="234 Pending" hi="234 लंबित" />
                  </span>
                </div>
                <h3 className="font-title-md text-title-md font-bold text-on-surface group-hover:text-primary transition-colors">
                  <T gu="જથ્થાબંધ મંજૂરી ડેસ્ક" en="Bulk Approvals" hi="थोक अनुमोदन डेस्क" />
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">
                  <T
                    gu="૨૩૪ વેરિફાઈડ અરજીઓને એક ક્લિકમાં DSC e-Sign દ્વારા મંજૂર કરો."
                    en="Batch-approve 234 verified applications via DSC e-Sign in 1-click."
                    hi="एक क्लिक में डीएससी ई-हस्ताक्षर द्वारा 234 आवेदनों को स्वीकृत करें।"
                  />
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant flex items-center justify-between text-secondary font-label-md text-label-md font-semibold">
                <span>
                  <T gu="મંજૂરી ડેસ્ક ખોલો" en="Open Approvals" hi="अनुमोदन खोलें" />
                </span>
                <Icon name="arrow_forward" size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Quick Action 2: Cycle Supply Chain */}
            <Link
              href="/deo/cycles"
              className="card p-5 hover:shadow-level-2 transition-all group flex flex-col justify-between border-l-4 border-l-primary bg-surface-container-lowest"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Icon name="directions_bike" size={22} />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-md text-label-md font-bold">
                    <T gu="૭૧% વિતરણ" en="71% Dispatched" hi="71% वितरित" />
                  </span>
                </div>
                <h3 className="font-title-md text-title-md font-bold text-on-surface group-hover:text-primary transition-colors">
                  <T gu="સાયકલ સપ્લાય ચેઈન" en="Cycle Supply Chain" hi="साइकिल आपूर्ति श्रृंखला" />
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">
                  <T
                    gu="સરસ્વતી સાધના સાયકલ ડિસ્પેચ, વેરહાઉસ સ્ટોક અને QR હેન્ડઓવર."
                    en="Saraswati Sadhana cycle dispatch, warehouse inventory & QR audit."
                    hi="सरस्वती साधना साइकिल डिस्पैच, गोदाम स्टॉक और क्यूआर सत्यापन।"
                  />
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant flex items-center justify-between text-primary font-label-md text-label-md font-semibold">
                <span>
                  <T gu="સપ્લાય ચેઈન ટ્રૅક કરો" en="Track Supply Chain" hi="आपूर्ति श्रृंखला ट्रैक करें" />
                </span>
                <Icon name="arrow_forward" size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Quick Action 3: At-Risk Students */}
            <Link
              href="/deo/at-risk"
              className="card p-5 hover:shadow-level-2 transition-all group flex flex-col justify-between border-l-4 border-l-danger bg-surface-container-lowest"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center text-danger group-hover:scale-110 transition-transform">
                    <Icon name="warning" size={22} />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-danger-container text-on-danger-container font-label-md text-label-md font-bold">
                    <T gu="૬૭ જોખમી" en="67 At-Risk" hi="67 जोखिम" />
                  </span>
                </div>
                <h3 className="font-title-md text-title-md font-bold text-on-surface group-hover:text-danger transition-colors">
                  <T gu="જોખમી વિદ્યાર્થી નિરીક્ષણ" en="At-Risk Students" hi="जोखिम में छात्र निगरानी" />
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">
                  <T
                    gu="ઓછી હાજરી (<૭૫%) અને ડ્રોપઆઉટ જોખમ ધરાવતા વિદ્યાર્થીઓનું લિસ્ટ."
                    en="Intervene for students with attendance < 75% or dropout risk."
                    hi="कम उपस्थिति (<75%) या ड्रॉपआउट जोखिम वाले छात्रों की सूची।"
                  />
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant flex items-center justify-between text-danger font-label-md text-label-md font-semibold">
                <span>
                  <T gu="જોખમી લિસ્ટ જુઓ" en="View At-Risk List" hi="जोखिम सूची देखें" />
                </span>
                <Icon name="arrow_forward" size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Quick Action 4: Grievance Redressal */}
            <Link
              href="/deo/grievances"
              className="card p-5 hover:shadow-level-2 transition-all group flex flex-col justify-between border-l-4 border-l-primary-container bg-surface-container-lowest"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Icon name="chat" size={22} />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest text-primary font-label-md text-label-md font-bold">
                    <T gu="૪૮ સક્રિય" en="48 Active" hi="48 सक्रिय" />
                  </span>
                </div>
                <h3 className="font-title-md text-title-md font-bold text-on-surface group-hover:text-primary transition-colors">
                  <T gu="ફરિયાદ નિવારણ ડેસ્ક" en="Grievance Redressal" hi="शिकायत निवारण डेस्क" />
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">
                  <T
                    gu="વિદ્યાર્થીઓ અને શાળાઓની પેન્ડિંગ અરજી અને DBT સમસ્યાઓ ઉકેલો."
                    en="Resolve escalation tickets, bank rejections, and scheme inquiries."
                    hi="छात्रों व स्कूलों के टिकट, बैंक अस्वीकृति व योजना समस्याओं का समाधान करें।"
                  />
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant flex items-center justify-between text-primary font-label-md text-label-md font-semibold">
                <span>
                  <T gu="ફરિયાદોનું નિવારણ કરો" en="Manage Grievances" hi="शिकायतें प्रबंधित करें" />
                </span>
                <Icon name="arrow_forward" size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </section>

        {/* 4. Urgent Action Alert Strip (Full Width) */}
        <section className="p-4 md:p-5 rounded-2xl bg-danger-container/70 border border-danger/30 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-danger text-on-danger flex items-center justify-center shrink-0 shadow-sm">
              <Icon name="warning" size={24} className="text-on-danger" />
            </div>
            <div>
              <p className="font-title-md text-title-md text-on-danger-container font-bold">
                <T
                  gu="તાકીદનું પગલું: ૧૨ શાળાઓએ આ મહિનાની ઓક્ટોબર હાજરી પોર્ટલ પર અપલોડ કરી નથી."
                  en="Urgent Action: 12 schools have not uploaded October attendance to the portal."
                  hi="अति आवश्यक: 12 स्कूलों ने इस महीने की अक्टूबर उपस्थिति पोर्टल पर अपलोड नहीं की है।"
                />
              </p>
              <p className="font-body-sm text-body-sm text-on-danger-container/90 mt-0.5">
                <T
                  gu="શિષ્યવૃત્તિ વિતરણ સમયસર રાખવા માટે જિલ્લા શિક્ષણ કચેરી તરફથી તાત્કાલિક નોટિસ ઇશ્યૂ કરવાની ભલામણ છે."
                  en="Immediate issuance of notice from DEO office is required to prevent disbursement delays."
                  hi="छात्रवृत्ति वितरण समय पर रखने के लिए जिला शिक्षा कार्यालय से तत्काल नोटिस जारी करना आवश्यक है।"
                />
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3 w-full lg:w-auto justify-end">
            <button
              onClick={() => setShowNoticeModal(true)}
              className="px-4 py-2.5 rounded-xl bg-danger text-on-danger font-label-lg text-label-lg font-bold shadow hover:bg-danger/90 transition-all active:scale-95 flex items-center gap-2"
              type="button"
            >
              <Icon name="sms" size={18} />
              <span>
                <T
                  gu="ડિફોલ્ટર ૧૨ શાળાઓની યાદી જુઓ & SMS નોટિસ મોકલો →"
                  en="View 12 Defaulter Schools & Send SMS Notice →"
                  hi="12 डिफाल्टर स्कूलों की सूची देखें और SMS नोटिस भेजें →"
                />
              </span>
            </button>
          </div>
        </section>

        {/* 5. Recent Approval Queue Preview (3-4 Pending Applications Needing DEO Sign-off) */}
        <section className="bg-surface-container-lowest p-6 rounded-2xl shadow-level-1 border border-outline-variant flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-title-lg text-title-lg text-on-surface font-bold">
                  <T
                    gu="તાજેતરની મંજૂરી કતાર પૂર્વાવલોકન"
                    en="Recent Approval Queue Preview"
                    hi="हालिया स्वीकृति कतार पूर्वावलोकन"
                  />
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md font-bold">
                  <T gu="૪ તાત્કાલિક અરજીઓ" en="4 Urgent Applications" hi="4 तत्काल आवेदन" />
                </span>
              </div>
              <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                <T
                  gu="શાળા અને તાલુકા સ્તરે ચકાસાયેલ અરજીઓ - DEO ડિજિટલ સહીની રાહ જોઈ રહી છે."
                  en="Applications verified by School & TPEO — awaiting final DEO digital sign-off."
                  hi="स्कूल व टीपीईओ स्तर पर सत्यापित आवेदन - अंतिम डीईओ डिजिटल हस्ताक्षर की प्रतीक्षा में।"
                />
              </p>
            </div>

            <Link
              href="/deo/approvals"
              className="btn-outline flex items-center gap-2 px-4 py-2 rounded-xl text-primary font-label-md text-label-md hover:bg-surface-container-low transition-colors self-start sm:self-auto"
            >
              <span>
                <T
                  gu="તમામ ૨૩૪ પેન્ડિંગ અરજીઓ જુઓ"
                  en="View All 234 Pending Applications"
                  hi="सभी 234 लंबित आवेदन देखें"
                />
              </span>
              <Icon name="arrow_forward" size={16} />
            </Link>
          </div>

          {/* Queue List Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-sm text-body-sm">
              <thead className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg font-semibold">
                    <T gu="વિદ્યાર્થી & CTS ID" en="Student & CTS ID" hi="छात्र व सीटीएस आईडी" />
                  </th>
                  <th className="px-3 py-3 font-semibold">
                    <T gu="શાળા & તાલુકો" en="School & Taluka" hi="स्कूल व तालुका" />
                  </th>
                  <th className="px-3 py-3 font-semibold">
                    <T gu="યોજના" en="Scheme" hi="योजना" />
                  </th>
                  <th className="px-3 py-3 font-semibold">
                    <T gu="સહાય રકમ" en="Benefit Amount" hi="सहायता राशि" />
                  </th>
                  <th className="px-3 py-3 font-semibold">
                    <T gu="ચકાસણી નોંધ" en="Verification Note" hi="सत्यापन विवरण" />
                  </th>
                  <th className="px-3 py-3 font-semibold text-center">
                    <T gu="સ્થિતિ" en="Status" hi="स्थिति" />
                  </th>
                  <th className="px-4 py-3 rounded-r-lg font-semibold text-right">
                    <T gu="કાર્યવાહી" en="Action" hi="कार्रवाई" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {INITIAL_PENDING_QUEUE.map((item) => {
                  const isApproved = approvedIds.includes(item.id);
                  return (
                    <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={item.studentNameEn} size="sm" className="bg-primary/20 text-primary font-bold" />
                          <div>
                            <p className="font-label-lg text-label-lg font-bold text-on-surface">
                              <T gu={item.studentNameGu} en={item.studentNameEn} hi={item.studentNameHi} />
                            </p>
                            <p className="font-caption text-caption text-on-surface-variant font-mono">
                              {item.ctsId}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-3.5">
                        <p className="font-label-md text-label-md text-on-surface font-medium truncate max-w-[180px]">
                          <T gu={item.schoolGu} en={item.schoolEn} hi={item.schoolHi} />
                        </p>
                        <p className="font-caption text-caption text-on-surface-variant">
                          <T gu={item.talukaGu} en={item.talukaEn} hi={item.talukaHi} />
                        </p>
                      </td>

                      <td className="px-3 py-3.5">
                        <span className="font-label-md text-label-md text-on-surface font-semibold">
                          <T gu={item.schemeGu} en={item.schemeEn} hi={item.schemeHi} />
                        </span>
                      </td>

                      <td className="px-3 py-3.5">
                        <span className="font-label-md text-label-md text-primary font-bold">
                          {item.amount}
                        </span>
                      </td>

                      <td className="px-3 py-3.5">
                        <span className="inline-flex items-center gap-1 font-caption text-caption text-on-surface-variant">
                          <Icon name="check_circle" size={13} fill className="text-emerald-600" />
                          <T gu={item.verifiedDetailsGu} en={item.verifiedDetailsEn} hi={item.verifiedDetailsHi} />
                        </span>
                      </td>

                      <td className="px-3 py-3.5 text-center">
                        {isApproved ? (
                          <StatusChip
                            status="approved"
                            label={<T gu="મંજૂર થયેલ" en="Approved" hi="स्वीकृत" />}
                          />
                        ) : (
                          <StatusChip
                            status="pending"
                            label={<T gu="DEO પેન્ડિંગ" en="Pending DEO" hi="डीईओ लंबित" />}
                          />
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        {isApproved ? (
                          <span className="font-label-md text-label-md text-emerald-600 font-bold inline-flex items-center gap-1">
                            <Icon name="verified" size={16} fill className="text-emerald-600" />
                            <T gu="સહી થઈ ગઈ" en="e-Signed" hi="ई-हस्ताक्षरित" />
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApprove(item.id)}
                              className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold shadow-sm hover:bg-primary-container transition-all flex items-center gap-1"
                              type="button"
                            >
                              <Icon name="draw" size={15} />
                              <span>
                                <T gu="મંજૂર કરો" en="Approve" hi="स्वीकृत करें" />
                              </span>
                            </button>
                            <Link
                              href="/deo/approvals"
                              className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"
                              title="Review details"
                            >
                              <Icon name="visibility" size={18} />
                            </Link>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* 6. Middle Section - Two-Column Analytics Layout (Taluka Matrix 65% & Lagging Schools 35%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Taluka Distribution & Backlog Matrix (8 cols ~ 66%) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-level-1 border border-outline-variant flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 gap-3">
                <div>
                  <h2 className="font-title-lg text-title-lg text-on-surface font-bold tracking-tight">
                    <T
                      gu="આણંદ જિલ્લાના તાલુકાવાર ચક્રીય વિશ્લેષણ (Taluka-wise Saturation Matrix)"
                      en="Taluka-wise Saturation & Backlog Matrix"
                      hi="तालुकावार संतृप्ति और बैकलॉग मैट्रिक्स"
                    />
                  </h2>
                  <p className="font-caption text-caption text-on-surface-variant">
                    <T
                      gu="૮ તાલુકાઓ: આણંદ, બોરસદ, ખંભાત, પેટલાદ, ઉમરેઠ, આંકલાવ, સોજિત્રા, તારાપુર"
                      en="8 Talukas: Anand, Borsad, Khambhat, Petlad, Umreth, Anklav, Sojitra, Tarapur"
                      hi="8 तालुका: आणंद, बोरसद, खंभात, पेटलाद, उमरेठ, आंकलाव, सोजित्रा, तारापुर"
                    />
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg text-primary font-label-md text-label-md border border-outline-variant">
                  <Icon name="tune" size={18} />
                  <span>
                    <T gu="સોર્ટિંગ: મંજૂર દર (ચડતો ક્રમ)" en="Sort: Approval Rate" hi="सॉर्ट: अनुमोदन दर" />
                  </span>
                </div>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto">
                <table className="w-full text-left font-body-sm text-body-sm">
                  <thead className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg font-semibold">
                        <T gu="તાલુકો" en="Taluka" hi="तालुका" />
                      </th>
                      <th className="px-3 py-3 font-semibold">
                        <T gu="શાળાઓ" en="Schools" hi="स्कूल" />
                      </th>
                      <th className="px-3 py-3 font-semibold">
                        <T gu="પાત્ર વિદ્યાર્થી" en="Eligible" hi="पात्र" />
                      </th>
                      <th className="px-3 py-3 font-semibold w-36">
                        <T gu="મંજૂર %" en="Approval %" hi="स्वीकृत %" />
                      </th>
                      <th className="px-3 py-3 font-semibold">
                        <T gu="પેન્ડિંગ" en="Pending" hi="लंबित" />
                      </th>
                      <th className="px-3 py-3 font-semibold">
                        <T gu="સાયકલ %" en="Cycle %" hi="साइकिल %" />
                      </th>
                      <th className="px-3 py-3 font-semibold">
                        <T gu="જોખમી" en="At-Risk" hi="जोखिम" />
                      </th>
                      <th className="px-3 py-3 rounded-r-lg font-semibold text-center">
                        <T gu="સ્થિતિ" en="Status" hi="स्थिति" />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/60">
                    {TALUKA_DATA.map((t, idx) => (
                      <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-4 py-3 font-label-lg text-label-lg text-on-surface font-bold flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              t.approvalPct >= 85
                                ? "bg-primary"
                                : t.approvalPct >= 78
                                ? "bg-secondary"
                                : "bg-danger"
                            }`}
                          />
                          <T gu={t.nameGu} en={t.nameEn} hi={t.nameHi} />
                        </td>
                        <td className="px-3 py-3 text-on-surface">{t.schools}</td>
                        <td className="px-3 py-3 font-semibold text-on-surface">{t.eligible}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-label-md text-label-md font-bold text-primary w-8">
                              {t.approvalPct}%
                            </span>
                            <div className="w-full bg-surface-container-highest rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  t.approvalPct >= 85
                                    ? "bg-primary"
                                    : t.approvalPct >= 78
                                    ? "bg-secondary"
                                    : "bg-danger"
                                }`}
                                style={{ width: `${t.approvalPct}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className={`px-3 py-3 font-medium ${t.approvalPct < 78 ? "text-danger font-bold" : "text-on-surface-variant"}`}>
                          {t.pending}
                        </td>
                        <td className="px-3 py-3 font-medium text-on-surface">{t.cyclePct}%</td>
                        <td className={`px-3 py-3 font-medium ${t.atRisk > 10 ? "text-danger font-bold" : "text-on-surface-variant"}`}>
                          {t.atRisk}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full font-label-md text-[11px] font-bold ${t.statusColor}`}>
                            <T gu={t.statusGu} en={t.statusEn} hi={t.statusHi} />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Geographic Mini Insight Card */}
              <div className="mt-5 pt-4 bg-surface-container-low rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-outline-variant">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest text-primary flex items-center justify-center shrink-0">
                    <Icon name="map" size={24} />
                  </div>
                  <div>
                    <p className="font-label-lg text-label-lg text-on-surface font-bold">
                      <T
                        gu="ભૌગોલિક સમન્વય (Geospatial Saturation Map)"
                        en="Geospatial Saturation Map"
                        hi="भू-स्थानिक संतृप्ति मानचित्र"
                      />
                    </p>
                    <p className="font-caption text-caption text-on-surface-variant">
                      <T
                        gu="દક્ષિણ-પશ્ચિમ ખંભાતના દરિયાકાંઠાના વિસ્તારોમાં આધાર લિંકેજ કેમ્પનું આયોજન જરૂરી છે."
                        en="Aadhaar linkage camps required in South-West Khambhat coastal belt."
                        hi="दक्षिण-पश्चिम खंभात तटीय क्षेत्रों में आधार लिंकेज शिविर आवश्यक हैं।"
                      />
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setGisToast(true);
                    setTimeout(() => setGisToast(false), 2500);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-surface-container-lowest text-primary font-label-md text-label-md font-bold shadow-sm hover:bg-surface-container-high transition-colors shrink-0 border border-outline-variant"
                  type="button"
                >
                  <T gu="GIS નકશો ખોલો" en="Open GIS Map" hi="GIS नक्शा खोलें" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Lagging Schools & Immediate Intervention (4 cols ~ 34%) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-level-1 border border-outline-variant flex flex-col justify-between h-full">
              <div>
                <div className="flex items-start justify-between pb-4 border-b border-outline-variant">
                  <div>
                    <h2 className="font-title-lg text-title-lg text-on-surface font-bold">
                      <T gu="પાછળ રહેલી શાળાઓ" en="Lagging Schools" hi="पिछड़ रहे स्कूल" />
                    </h2>
                    <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                      <T
                        gu="ઓછી સંતૃપ્તિ અને વધુ પેન્ડિંગ ધરાવતી ટોચની ૫ શાળાઓ"
                        en="Top 5 schools with lowest saturation & high backlog"
                        hi="न्यूनतम संतृप्ति और अधिक लंबित वाले शीर्ष 5 स्कूल"
                      />
                    </p>
                  </div>
                  <span className="w-3 h-3 rounded-full bg-danger animate-ping" />
                </div>

                {/* School List */}
                <div className="space-y-3 mt-3">
                  {/* School 1 */}
                  <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant flex flex-col gap-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-label-lg text-label-lg font-bold text-on-surface">
                          <T
                            gu="૧. શ્રી વિનય મંદિર હાઈસ્કૂલ"
                            en="1. Shree Vinay Mandir High School"
                            hi="1. श्री विनय मंदिर हाई स्कूल"
                          />
                        </h3>
                        <p className="font-caption text-caption text-on-surface-variant">
                          <T gu="તાલુકો: ખંભાત • UDISE: 24150302101" en="Taluka: Khambhat • UDISE: 24150302101" hi="तालुका: खंभात • UDISE: 24150302101" />
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-danger-container text-on-danger-container font-label-md text-[10px] font-bold">
                        <T gu="૪૮% મંજૂર" en="48% Approved" hi="48% स्वीकृत" />
                      </span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-2">
                      <div className="bg-danger h-2 rounded-full" style={{ width: "48%" }} />
                    </div>
                    <div className="flex items-center justify-between font-caption text-caption text-on-surface-variant pt-1">
                      <span className="text-danger font-semibold">
                        <T gu="૮૬ અરજીઓ પેન્ડિંગ" en="86 applications pending" hi="86 आवेदन लंबित" />
                      </span>
                      <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-medium">
                        <T gu="હાજરી ડેટા બાકી" en="Attendance missing" hi="उपस्थिति शेष" />
                      </span>
                    </div>
                  </div>

                  {/* School 2 */}
                  <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant flex flex-col gap-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-label-lg text-label-lg font-bold text-on-surface">
                          <T gu="૨. જનતા વિદ્યાલય" en="2. Janta Vidyalaya" hi="2. जनता विद्यालय" />
                        </h3>
                        <p className="font-caption text-caption text-on-surface-variant">
                          <T gu="તાલુકો: તારાપુર • UDISE: 24150801402" en="Taluka: Tarapur • UDISE: 24150801402" hi="तालुका: तारापुर • UDISE: 24150801402" />
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-danger-container text-on-danger-container font-label-md text-[10px] font-bold">
                        <T gu="૫૨% મંજૂર" en="52% Approved" hi="52% स्वीकृत" />
                      </span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-2">
                      <div className="bg-danger h-2 rounded-full" style={{ width: "52%" }} />
                    </div>
                    <div className="flex items-center justify-between font-caption text-caption text-on-surface-variant pt-1">
                      <span className="text-danger font-semibold">
                        <T gu="૬૪ અરજીઓ પેન્ડિંગ" en="64 applications pending" hi="64 आवेदन लंबित" />
                      </span>
                      <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-medium">
                        <T gu="આચાર્ય મંજૂરી અટકી" en="Principal sign pending" hi="प्राचार्य अनुमोदन शेष" />
                      </span>
                    </div>
                  </div>

                  {/* School 3 */}
                  <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant flex flex-col gap-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-label-lg text-label-lg font-bold text-on-surface">
                          <T gu="૩. સાર્વજનિક હાઈસ્કૂલ" en="3. Sarvajanik High School" hi="3. सार्वजनिक हाई स्कूल" />
                        </h3>
                        <p className="font-caption text-caption text-on-surface-variant">
                          <T gu="તાલુકો: આંકલાવ • UDISE: 24150600801" en="Taluka: Anklav • UDISE: 24150600801" hi="तालुका: आंकलाव • UDISE: 24150600801" />
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-[10px] font-bold">
                        <T gu="૫૮% મંજૂર" en="58% Approved" hi="58% स्वीकृत" />
                      </span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-2">
                      <div className="bg-secondary h-2 rounded-full" style={{ width: "58%" }} />
                    </div>
                    <div className="flex items-center justify-between font-caption text-caption text-on-surface-variant pt-1">
                      <span className="text-on-surface font-semibold">
                        <T gu="૫૧ અરજીઓ પેન્ડિંગ" en="51 applications pending" hi="51 आवेदन लंबित" />
                      </span>
                      <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-medium">
                        <T gu="સાયકલ હેન્ડઓવર વિલંબ" en="Cycle handover delay" hi="साइकिल वितरण विलंब" />
                      </span>
                    </div>
                  </div>

                  {/* School 4 */}
                  <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant flex flex-col gap-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-label-lg text-label-lg font-bold text-on-surface">
                          <T
                            gu="૪. શ્રી સરદાર વલ્લભભાઈ પટેલ વિનય મંદિર"
                            en="4. Sardar Vallabhbhai Patel Vinay Mandir"
                            hi="4. सरदार वल्लभभाई पटेल विनय मंदिर"
                          />
                        </h3>
                        <p className="font-caption text-caption text-on-surface-variant">
                          <T gu="તાલુકો: બોરસદ • UDISE: 24150201905" en="Taluka: Borsad • UDISE: 24150201905" hi="तालुका: बोरसद • UDISE: 24150201905" />
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-md text-[10px] font-bold">
                        <T gu="૬૨% મંજૂર" en="62% Approved" hi="62% स्वीकृत" />
                      </span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "62%" }} />
                    </div>
                    <div className="flex items-center justify-between font-caption text-caption text-on-surface-variant pt-1">
                      <span className="text-on-surface font-semibold">
                        <T gu="૪૩ અરજીઓ પેન્ડિંગ" en="43 applications pending" hi="43 आवेदन लंबित" />
                      </span>
                      <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-medium">
                        <T gu="આધાર વિસંગતતા" en="Aadhaar mismatch" hi="आधार बेमेल" />
                      </span>
                    </div>
                  </div>

                  {/* School 5 */}
                  <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant flex flex-col gap-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-label-lg text-label-lg font-bold text-on-surface">
                          <T gu="૫. શ્રી કલ્યાણ હાઈસ્કૂલ" en="5. Shree Kalyan High School" hi="5. श्री कल्याण हाई स्कूल" />
                        </h3>
                        <p className="font-caption text-caption text-on-surface-variant">
                          <T gu="તાલુકો: પેટલાદ • UDISE: 24150400503" en="Taluka: Petlad • UDISE: 24150400503" hi="तालुका: पेटलाद • UDISE: 24150400503" />
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-md text-[10px] font-bold">
                        <T gu="૬૫% મંજૂર" en="65% Approved" hi="65% स्वीकृत" />
                      </span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "65%" }} />
                    </div>
                    <div className="flex items-center justify-between font-caption text-caption text-on-surface-variant pt-1">
                      <span className="text-on-surface font-semibold">
                        <T gu="૩૯ અરજીઓ પેન્ડિંગ" en="39 applications pending" hi="39 आवेदन लंबित" />
                      </span>
                      <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-medium">
                        <T gu="બેંક ખાતું અપડેટ બાકી" en="Bank update pending" hi="बैंक खाता अपडेट शेष" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Issue Notice CTA */}
              <div className="pt-4 mt-3 border-t border-outline-variant">
                <button
                  onClick={() => setShowNoticeModal(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-danger-container text-on-danger-container font-label-lg text-label-lg font-bold hover:bg-danger hover:text-on-danger transition-colors flex items-center justify-center gap-2"
                  type="button"
                >
                  <Icon name="notification_important" size={20} />
                  <span>
                    <T
                      gu="સંબંધિત આચાર્યોને ચેતવણી પત્ર મોકલો (Issue Formal Warning Notice)"
                      en="Issue Formal Warning Notice to Principals"
                      hi="संबंधित प्राचार्यों को औपचारिक चेतावनी पत्र भेजें"
                    />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 7. Bottom Section - In-depth Trends & Scheme Breakdown (3 Columns Grid) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Block A: Scheme Applications & Fund Status / Scheme-wise Disbursement Stats Bar */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-level-1 border border-outline-variant flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
                <div>
                  <h2 className="font-title-lg text-title-lg text-on-surface font-bold">
                    <T
                      gu="યોજનાવાર અરજી અને ફંડ વિતરણ"
                      en="Scheme-wise Fund Disbursement"
                      hi="योजनावार आवेदन व निधि संवितरण"
                    />
                  </h2>
                  <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                    <T gu="મુખ્ય રાજ્ય અને કેન્દ્રીય સહાય યોજનાઓ" en="Major State & Central Welfare Schemes" hi="प्रमुख राज्य व केंद्रीय कल्याणकारी योजनाएं" />
                  </p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Icon name="payments" size={22} />
                </div>
              </div>

              <div className="space-y-3.5 mt-4">
                {/* Scheme 1 */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between font-label-md text-label-md">
                    <span className="font-bold text-on-surface">
                      <T gu="નમો લક્ષ્મી યોજના" en="Namo Lakshmi Scheme" hi="नमो लक्ष्मी योजना" />
                    </span>
                    <span className="text-primary font-bold">₹ ૨૧.૦૦ Cr (૯૨%)</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "92%" }} />
                  </div>
                  <span className="font-caption text-caption text-on-surface-variant">
                    <T gu="૪૨,૦૦૦ અરજીઓ મંજૂર" en="42,000 applications approved" hi="42,000 आवेदन स्वीकृत" />
                  </span>
                </div>

                {/* Scheme 2 */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between font-label-md text-label-md">
                    <span className="font-bold text-on-surface">
                      <T gu="સરસ્વતી સાધના સાયકલ યોજના" en="Saraswati Sadhana Bicycle" hi="सरस्वती साधना साइकिल" />
                    </span>
                    <span className="text-secondary font-bold">
                      <T gu="૮,૫૨૦ વિતરિત (૭૧%)" en="8,520 distributed (71%)" hi="8,520 वितरित (71%)" />
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-2">
                    <div className="bg-secondary h-2 rounded-full" style={{ width: "71%" }} />
                  </div>
                  <span className="font-caption text-caption text-on-surface-variant">
                    <T gu="૧૨,૦૦૦ વાર્ષિક લક્ષ્યાંક" en="12,000 annual target" hi="12,000 वार्षिक लक्ष्य" />
                  </span>
                </div>

                {/* Scheme 3 */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between font-label-md text-label-md">
                    <span className="font-bold text-on-surface">
                      <T gu="જ્ઞાન સાધના સ્કોલરશીપ" en="Gyan Sadhana Scholarship" hi="ज्ञान साधना छात्रवृत्ति" />
                    </span>
                    <span className="text-primary font-bold">₹ ૯.૨૦ Cr (૮૬%)</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "86%" }} />
                  </div>
                  <span className="font-caption text-caption text-on-surface-variant">
                    <T gu="૧૮,૪૦૦ મેરિટ પાત્ર વિદ્યાર્થીઓ" en="18,400 merit students" hi="18,400 मेधावी छात्र" />
                  </span>
                </div>

                {/* Scheme 4 */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between font-label-md text-label-md">
                    <span className="font-bold text-on-surface">
                      <T gu="OBC / SEBC પૂર્વ-મેટ્રિક" en="OBC / SEBC Pre-Matric" hi="ओबीसी / एसईबीसी प्री-मैट्रिक" />
                    </span>
                    <span className="text-primary font-bold">₹ ૫.૯૨ Cr (૮૧%)</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "81%" }} />
                  </div>
                  <span className="font-caption text-caption text-on-surface-variant">
                    <T gu="૧૪,૮૦૦ અરજીઓ" en="14,800 applications" hi="14,800 आवेदन" />
                  </span>
                </div>

                {/* Scheme 5 */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between font-label-md text-label-md">
                    <span className="font-bold text-on-surface">
                      <T gu="NMMS મેરિટ સ્કોલરશીપ" en="NMMS Merit Scholarship" hi="एनएमएमएस मेरिट छात्रवृत्ति" />
                    </span>
                    <span className="text-primary font-bold">₹ ૫.૦૪ Cr (૯૪%)</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "94%" }} />
                  </div>
                  <span className="font-caption text-caption text-on-surface-variant">
                    <T gu="૪,૨૦૦ અરજીઓ" en="4,200 applications" hi="4,200 आवेदन" />
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-outline-variant font-caption text-caption text-on-surface-variant">
              <T
                gu="અન્ય સહાય યોજનાઓ: ૭,૦૫૦ અરજીઓ • ₹ ૧.૪૪ Cr"
                en="Other Welfare Schemes: 7,050 applications • ₹ 1.44 Cr"
                hi="अन्य कल्याण योजनाएं: 7,050 आवेदन • ₹ 1.44 करोड़"
              />
            </div>
          </div>

          {/* Block B: Turnaround Time Trend (Month over Month) */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-level-1 border border-outline-variant flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
                <div>
                  <h2 className="font-title-lg text-title-lg text-on-surface font-bold">
                    <T
                      gu="સરેરાશ નિકાલ સમય પ્રવાહ"
                      en="Turnaround Time Trend (TAT)"
                      hi="औसत निपटान समय रुझान"
                    />
                  </h2>
                  <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                    <T
                      gu="DEO સ્તરે અરજી મંજૂર કરવાનો સરેરાશ સમય (દિવસે)"
                      en="Avg time taken for DEO approval sign-off (in days)"
                      hi="डीईओ स्तर पर स्वीकृति का औसत समय (दिनों में)"
                    />
                  </p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Icon name="speed" size={22} />
                </div>
              </div>

              <div className="space-y-4 mt-4">
                <div>
                  <div className="flex justify-between font-label-md text-label-md text-on-surface-variant mb-1">
                    <span>
                      <T gu="જુલાઈ ૨૦૨૫" en="July 2025" hi="जुलाई 2025" />
                    </span>
                    <span className="font-bold text-on-surface">
                      <T gu="૫.૪ દિવસ" en="5.4 days" hi="5.4 दिन" />
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-3">
                    <div className="bg-outline h-3 rounded-full" style={{ width: "80%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-label-md text-label-md text-on-surface-variant mb-1">
                    <span>
                      <T gu="ઓગસ્ટ ૨૦૨૫" en="August 2025" hi="अगस्त 2025" />
                    </span>
                    <span className="font-bold text-on-surface">
                      <T gu="૪.૧ દિવસ" en="4.1 days" hi="4.1 दिन" />
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-3">
                    <div className="bg-outline h-3 rounded-full" style={{ width: "60%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-label-md text-label-md text-on-surface-variant mb-1">
                    <span>
                      <T gu="સપ્ટેમ્બર ૨૦૨૫" en="September 2025" hi="सितंबर 2025" />
                    </span>
                    <span className="font-bold text-on-surface">
                      <T gu="૨.૮ દિવસ" en="2.8 days" hi="2.8 दिन" />
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-3">
                    <div className="bg-primary h-3 rounded-full" style={{ width: "42%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-label-md text-label-md text-primary font-bold mb-1">
                    <span>
                      <T gu="ઓક્ટોબર ૨૦૨૫ (ચાલુ)" en="October 2025 (Current)" hi="अक्टूबर 2025 (वर्तमान)" />
                    </span>
                    <span className="font-bold text-primary">
                      <T gu="૧.૮ દિવસ (૬૬% ઝડપી)" en="1.8 days (66% faster)" hi="1.8 दिन (66% तेज)" />
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-3">
                    <div className="bg-emerald-500 h-3 rounded-full" style={{ width: "27%" }} />
                  </div>
                </div>
              </div>

              <div className="mt-5 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant flex items-center gap-3">
                <Icon name="military_tech" size={22} className="text-secondary shrink-0" />
                <p className="font-caption text-caption text-on-surface font-medium leading-relaxed">
                  <T
                    gu="રાજ્ય સ્તર લક્ષ્યાંક: < ૩.૦ દિવસ. આણંદ જિલ્લો હાલ સમગ્ર ગુજરાત રાજ્યમાં ત્રીજા ક્રમે છે."
                    en="State target: < 3.0 days. Anand District is currently ranked 3rd across Gujarat State."
                    hi="राज्य लक्ष्य: < 3.0 दिन। आणंद जिला वर्तमान में पूरे गुजरात राज्य में तीसरे स्थान पर है।"
                  />
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-2 text-on-surface-variant font-caption text-caption border-t border-outline-variant mt-3">
              <Icon name="auto_awesome" size={16} className="text-primary" />
              <span>
                <T
                  gu="AI સ્માર્ટ ઓટો-વેરિફિકેશન અને બલ્ક અપ્રૂવલ પ્રણાલી સક્રિય"
                  en="AI Smart Auto-Verification and Bulk Approval active"
                  hi="एआई स्मार्ट ऑटो-सत्यापन और बल्क अनुमोदन प्रणाली सक्रिय"
                />
              </span>
            </div>
          </div>

          {/* Block C: Digital Audit & DEO e-Sign Action Center */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-level-1 border border-outline-variant flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
                <div>
                  <h2 className="font-title-lg text-title-lg text-on-surface font-bold">
                    <T
                      gu="ડિજિટલ ઓડિટ અને કમાન્ડ કંટ્રોલ"
                      en="Digital Audit & e-Sign Command"
                      hi="डिजिटल ऑडिट और ई-साइन कमांड"
                    />
                  </h2>
                  <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                    <T gu="DEO Digital Sign & Integrity Summary" en="DEO Digital Sign & Integrity Summary" hi="डीईओ डिजिटल हस्ताक्षर व अखंडता सारांश" />
                  </p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Icon name="security" size={22} />
                </div>
              </div>

              {/* e-Sign Highlight Box */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant flex flex-col gap-2.5 mt-4">
                <div className="flex items-center gap-2 text-primary font-label-lg text-label-lg font-bold">
                  <Icon name="draw" size={20} />
                  <span>
                    <T gu="Digital e-Sign સજ્જતા" en="Digital e-Sign Readiness" hi="डिजिटल ई-हस्ताक्षर तत्परता" />
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface leading-normal">
                  <T
                    gu="૨૩૪ અરજીઓ ઓટો-વેરિફાઈડ અને આધાર-સીડેડ છે. માત્ર એક ક્લિકમાં ડિજિટલ સહી દ્વારા મંજૂરી આપી શકાય છે."
                    en="234 applications are auto-verified & Aadhaar-seeded. Ready for instant digital signature approval in 1-click."
                    hi="234 आवेदन स्वतः सत्यापित व आधार-सीडेड हैं। केवल एक क्लिक में डिजिटल हस्ताक्षर द्वारा स्वीकृति दी जा सकती है।"
                  />
                </p>
                <div className="flex items-center gap-2 text-emerald-700 font-caption text-caption font-bold">
                  <Icon name="check_circle" size={16} fill className="text-emerald-700" />
                  <span>
                    <T
                      gu="DSC Token: માન્ય (શ્રી હસમુખ જે. ત્રિવેદી)"
                      en="DSC Token: Valid (Shri Hasmukh J. Trivedi)"
                      hi="डीएससी टोकन: मान्य (श्री हसमुख जे. त्रिवेदी)"
                    />
                  </span>
                </div>
              </div>

              {/* Grievance Mini Breakdown */}
              <div className="mt-4 pt-3 flex flex-col gap-2">
                <div className="flex items-center justify-between font-label-md text-label-md">
                  <span className="font-bold text-on-surface">
                    <T gu="ફરિયાદ નિવારણ વિશ્લેષણ" en="Grievance SLA Status" hi="शिकायत SLA स्थिति" />
                  </span>
                  <span className="font-bold text-on-surface">
                    <T gu="૪૮ કુલ" en="48 Total" hi="48 कुल" />
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 p-2 rounded-lg bg-surface-container-low border border-outline-variant text-center">
                    <span className="block font-label-lg text-label-lg font-bold text-primary">૪૨</span>
                    <span className="font-caption text-caption text-on-surface-variant">
                      <T gu="સમયમર્યાદામાં" en="Within SLA" hi="समय सीमा में" />
                    </span>
                  </div>
                  <div className="flex-1 p-2 rounded-lg bg-danger-container border border-danger/20 text-center">
                    <span className="block font-label-lg text-label-lg font-bold text-danger">૬</span>
                    <span className="font-caption text-caption text-on-danger-container">
                      <T gu="તાકીદની (SLA નજીક)" en="Near SLA Breach" hi="एसएलए के निकट" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 mt-3 border-t border-outline-variant">
              <Link
                href="/deo/approvals"
                className="w-full py-3 px-4 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow hover:bg-primary-container transition-all flex items-center justify-center gap-2"
              >
                <Icon name="fingerprint" size={20} />
                <span>
                  <T
                    gu="બલ્ક અપ્રૂવલ સ્ક્રીન ખોલો (Review & Sign 234)"
                    en="Open Bulk Approvals (Review & Sign 234)"
                    hi="थोक अनुमोदन खोलें (समीक्षा व हस्ताक्षर 234)"
                  />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Modal: Defaulter 12 Schools & SMS Notice */}
        {showNoticeModal && (
          <div className="fixed inset-0 z-50 bg-on-surface/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-surface-container-lowest rounded-2xl max-w-xl w-full p-6 shadow-level-3 border border-outline-variant flex flex-col gap-4">
              <div className="flex items-start justify-between pb-3 border-b border-outline-variant">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-danger/10 text-danger flex items-center justify-center">
                    <Icon name="sms_failed" size={24} />
                  </div>
                  <div>
                    <h3 className="font-title-lg text-title-lg font-bold text-on-surface">
                      <T
                        gu="ડિફોલ્ટર ૧૨ શાળાઓ - SMS નોટિસ"
                        en="12 Defaulter Schools - Issue SMS Notice"
                        hi="12 डिफाल्टर स्कूल - एसएमएस नोटिस"
                      />
                    </h3>
                    <p className="font-caption text-caption text-on-surface-variant">
                      <T
                        gu="ઓક્ટોબર ૨૦૨૫ હાજરી અપલોડ ન કરનાર શાળાઓની યાદી"
                        en="Schools that haven't uploaded October 2025 attendance"
                        hi="अक्टूबर 2025 उपस्थिति अपलोड न करने वाले स्कूल"
                      />
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNoticeModal(false)}
                  className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"
                >
                  <Icon name="close" size={20} />
                </button>
              </div>

              <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant text-body-sm space-y-1.5 max-h-56 overflow-y-auto">
                <p className="font-label-md text-label-md font-bold text-on-surface mb-2">
                  <T gu="આચાર્યો અને શાળાઓ:" en="Principals & Schools:" hi="प्राचार्य एवं स्कूल:" />
                </p>
                {[
                  "શ્રી વિનય મંદિર હાઈસ્કૂલ (ખંભાત) - પ્રિન્સિપાલ: મો. 98250XXXXX",
                  "જનતા વિદ્યાલય (તારાપુર) - પ્રિન્સિપાલ: મો. 94280XXXXX",
                  "સરકારી હાઈસ્કૂલ નં ૨ (બોરસદ) - પ્રિન્સિપાલ: મો. 97241XXXXX",
                  "સાર્વજનિક કન્યા વિદ્યાલય (આંકલાવ) - પ્રિન્સિપાલ: મો. 98980XXXXX",
                  "આદર્શ હાઈસ્કૂલ (ઉમરેઠ) - પ્રિન્સિપાલ: મો. 98795XXXXX",
                  "શ્રી કલ્યાણ હાઈસ્કૂલ (પેટલાદ) - પ્રિન્સિપાલ: મો. 99042XXXXX",
                ].map((sch, i) => (
                  <div key={i} className="flex items-center justify-between py-1 text-on-surface font-caption text-caption border-b border-outline-variant/40 last:border-0">
                    <span className="font-medium">• {sch}</span>
                    <span className="px-2 py-0.5 rounded bg-danger-container text-on-danger-container font-semibold text-[10px]">
                      બાકી / Pending
                    </span>
                  </div>
                ))}
              </div>

              {/* SMS Draft Preview */}
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                <p className="font-caption text-caption text-amber-900 font-bold mb-1">
                  <T gu="મોકલવામાં આવનાર અધિકૃત SMS સંદેશ:" en="Official SMS Draft to be dispatched:" hi="भेजा जाने वाला आधिकारिक एसएमएस मसौदा:" />
                </p>
                <p className="font-caption text-caption text-amber-800 italic">
                  &ldquo;DEO Anand Office Alert: October attendance for your school is overdue. Failure to upload on Vidya Pragati Setu within 24 hours will pause scholarship disbursement for your students. - DEO Anand&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowNoticeModal(false)}
                  className="px-4 py-2 rounded-xl text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low transition-colors"
                  type="button"
                >
                  <T gu="રદ કરો" en="Cancel" hi="रद्द करें" />
                </button>

                <button
                  onClick={handleSendDefaulterNotice}
                  disabled={noticeSent}
                  className="px-5 py-2.5 rounded-xl bg-danger text-on-danger font-label-lg text-label-lg font-bold shadow hover:bg-danger/90 transition-all flex items-center gap-2"
                  type="button"
                >
                  {noticeSent ? (
                    <>
                      <Icon name="hourglass_top" size={18} className="animate-spin" />
                      <span>
                        <T gu="SMS મોકલાઈ રહ્યો છે..." en="Dispatching SMS..." hi="एसएमएस भेजा जा रहा है..." />
                      </span>
                    </>
                  ) : (
                    <>
                      <Icon name="send" size={18} />
                      <span>
                        <T gu="૧૨ શાળાઓને તાત્કાલિક SMS મોકલો" en="Send Instant SMS to 12 Schools" hi="12 स्कूलों को तुरंत एसएमएस भेजें" />
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </OfficerShell>
  );
}
