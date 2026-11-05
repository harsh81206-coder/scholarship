"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { StudentShell } from "@/components/shell/StudentShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { StatusChip, EmptyState, Avatar } from "@/components/ui";
import { useAppStore } from "@/lib/store";

interface VaultDoc {
  id: string;
  nameGu: string;
  nameEn: string;
  nameHi: string;
  subGu: string;
  subEn: string;
  subHi: string;
  category: "identity" | "academic" | "income" | "bank";
  categoryGu: string;
  categoryEn: string;
  categoryHi: string;
  icon: string;
  uploadDateGu: string;
  uploadDateEn: string;
  uploadDateHi: string;
  status: "approved" | "pending" | "rejected";
  statusLabelGu: string;
  statusLabelEn: string;
  statusLabelHi: string;
  badgeGu?: string;
  badgeEn?: string;
  badgeHi?: string;
  meta: {
    line1LeftGu: string;
    line1LeftEn: string;
    line1LeftVal: string;
    line1RightGu?: string;
    line1RightEn?: string;
    line1RightVal?: string;
    line1RightAlert?: boolean;
    line2LeftGu?: string;
    line2LeftEn?: string;
    line2LeftVal?: string;
    line2RightGu?: string;
    line2RightEn?: string;
    line2RightVal?: string;
    noteGu?: string;
    noteEn?: string;
    noteHi?: string;
  };
  schemes: Array<{ gu: string; en: string; hi: string }>;
  canDownload?: boolean;
  needsUpload?: boolean;
}

const MOCK_DOCS: VaultDoc[] = [
  {
    id: "aadhaar",
    nameGu: "આધાર કાર્ડ (Aadhaar)",
    nameEn: "Aadhaar Card",
    nameHi: "आधार कार्ड",
    subGu: "UIDAI e-KYC વેરીફાઇડ ટોકન",
    subEn: "UIDAI e-KYC Verified Hash",
    subHi: "UIDAI ई-केवाईसी सत्यापित टोकन",
    category: "identity",
    categoryGu: "ઓળખ",
    categoryEn: "Identity",
    categoryHi: "पहचान",
    icon: "fingerprint",
    uploadDateGu: "૧૫/૦૧/૨૦૨૪",
    uploadDateEn: "15/01/2024",
    uploadDateHi: "15/01/2024",
    status: "approved",
    statusLabelGu: "સુરક્ષિત માસ્ક્ડ",
    statusLabelEn: "Secure Masked",
    statusLabelHi: "सुरक्षित मास्क्ड",
    badgeGu: "DPDP માન્ય",
    badgeEn: "DPDP Certified",
    badgeHi: "DPDP मान्य",
    meta: {
      line1LeftGu: "ટોકન નં",
      line1LeftEn: "Token ID",
      line1LeftVal: "XXXX XXXX ૪૫૨૧",
      line1RightGu: "સ્થિતિ",
      line1RightEn: "Status",
      line1RightVal: "OTP Verified",
      line1RightAlert: false,
      noteGu: "DPDP એક્ટ ૨૦૨૩ નિયમ મુજબ સંપૂર્ણ આધાર સંગ્રહિત નથી, માત્ર પ્રમાણિત ટોકન સચવાયેલ છે.",
      noteEn: "Under DPDP Act 2023, full Aadhaar number is not stored; only verified cryptographic token is held.",
      noteHi: "DPDP अधिनियम 2023 के तहत पूरा आधार संग्रहीत नहीं है, केवल सत्यापित टोकन सुरक्षित है।",
    },
    schemes: [
      { gu: "તમામ DBT યોજનાઓ", en: "All DBT Schemes", hi: "सभी DBT योजनाएं" },
      { gu: "નમો લક્ષ્મી", en: "Namo Lakshmi", hi: "नमो लक्ष्मी" },
    ],
    canDownload: true,
  },
  {
    id: "income",
    nameGu: "આવકનું પ્રમાણપત્ર",
    nameEn: "Annual Family Income Certificate",
    nameHi: "वार्षिक पारिवारिक आय प्रमाण पत्र",
    subGu: "વાર્ષિક કૌટુંબિક આવક દાખલો",
    subEn: "Annual Family Income Certificate",
    subHi: "वार्षिक पारिवारिक आय प्रमाण पत्र",
    category: "income",
    categoryGu: "આવક",
    categoryEn: "Income",
    categoryHi: "आय",
    icon: "payments",
    uploadDateGu: "૧૦/૦૪/૨૦૨૨",
    uploadDateEn: "10/04/2022",
    uploadDateHi: "10/04/2022",
    status: "pending",
    statusLabelGu: "મુદત સમાપ્ત • રીન્યુ કરો",
    statusLabelEn: "Expired • Action Required",
    statusLabelHi: "समाप्त • नवीनीकरण आवश्यक",
    badgeGu: "ધ્યાન જરૂરી",
    badgeEn: "Action Needed",
    badgeHi: "ध्यान आवश्यक",
    meta: {
      line1LeftGu: "જારીકર્તા",
      line1LeftEn: "Issuer",
      line1LeftVal: "મામલતદાર કચેરી, આણંદ",
      line1RightGu: "સમાપ્તિ",
      line1RightEn: "Expiry",
      line1RightVal: "૩૧/૦૩/૨૦૨૫",
      line1RightAlert: true,
      line2LeftGu: "વાર્ષિક આવક",
      line2LeftEn: "Annual Income",
      line2LeftVal: "₹ ૧,૨૦,૦૦૦",
      line2RightGu: "જારી તારીખ",
      line2RightEn: "Issue Date",
      line2RightVal: "૧૦/૦૪/૨૦૨૨",
    },
    schemes: [
      { gu: "નમો લક્ષ્મી યોજના", en: "Namo Lakshmi Scheme", hi: "नमो लक्ष्मी योजना" },
      { gu: "OBC પ્રી-મેટ્રિક", en: "OBC Pre-Matric", hi: "ओबीसी प्री-मैट्रिक" },
    ],
    needsUpload: true,
    canDownload: false,
  },
  {
    id: "marksheet",
    nameGu: "ધોરણ ૮ વાર્ષિક માર્કશીટ",
    nameEn: "Class 8 Final Board Marksheet",
    nameHi: "कक्षा 8 वार्षिक मार्कशीट",
    subGu: "શાળા પરિણામ પત્રક",
    subEn: "School Annual Marksheet",
    subHi: "स्कूल परिणाम पत्रक",
    category: "academic",
    categoryGu: "શૈક્ષણિક",
    categoryEn: "Academic",
    categoryHi: "शैक्षणिक",
    icon: "grade",
    uploadDateGu: "૧૨/૦૬/૨૦૨૫",
    uploadDateEn: "12/06/2025",
    uploadDateHi: "12/06/2025",
    status: "approved",
    statusLabelGu: "શાળા માન્ય",
    statusLabelEn: "School Verified",
    statusLabelHi: "स्कूल मान्य",
    badgeGu: "શિક્ષણ બોર્ડ",
    badgeEn: "Board Verified",
    badgeHi: "बोर्ड सत्यापित",
    meta: {
      line1LeftGu: "મેળવેલ ગુણ",
      line1LeftEn: "Marks",
      line1LeftVal: "૮૪.૫% (A Grade)",
      line1RightGu: "રોલ નં",
      line1RightEn: "Roll No",
      line1RightVal: "૨૮",
      line1RightAlert: false,
      line2LeftGu: "વેરિફાઇડ બાય",
      line2LeftEn: "Verified By",
      line2LeftVal: "આચાર્ય શ્રી, સરદાર પટેલ હાઈસ્કૂલ",
    },
    schemes: [
      { gu: "જ્ઞાન સેતુ મેરિટ સ્કોલરશીપ", en: "Gyan Setu Merit", hi: "ज्ञान सेतु मेरिट" },
      { gu: "NMMS પરીક્ષા", en: "NMMS Exam", hi: "NMMS परीक्षा" },
    ],
    canDownload: true,
  },
  {
    id: "caste",
    nameGu: "જાતિનું પ્રમાણપત્ર (OBC)",
    nameEn: "Caste Certificate (OBC)",
    nameHi: "जाति प्रमाण पत्र (ओबीसी)",
    subGu: "સામાજિક અને શૈક્ષણિક પછાત વર્ગ",
    subEn: "Socially & Edu. Backward Class",
    subHi: "सामाजिक एवं शैक्षणिक पिछड़ा वर्ग",
    category: "identity",
    categoryGu: "ઓળખ",
    categoryEn: "Identity",
    categoryHi: "पहचान",
    icon: "badge",
    uploadDateGu: "૨૧/૦૭/૨૦૨૧",
    uploadDateEn: "21/07/2021",
    uploadDateHi: "21/07/2021",
    status: "approved",
    statusLabelGu: "ચકાસાયેલ",
    statusLabelEn: "Verified",
    statusLabelHi: "सत्यापित",
    badgeGu: "કાયમી માન્યતા",
    badgeEn: "Permanent",
    badgeHi: "स्थायी",
    meta: {
      line1LeftGu: "પ્રમાણપત્ર નં",
      line1LeftEn: "Cert No",
      line1LeftVal: "OBC/AND/2021/88219",
      line1RightGu: "માન્યતા",
      line1RightEn: "Validity",
      line1RightVal: "કાયમી માન્યતા",
      line1RightAlert: false,
      line2LeftGu: "સ્રોત",
      line2LeftEn: "Source",
      line2LeftVal: "DigiLocker વેરીફાઇડ",
      line2RightGu: "જારી તારીખ",
      line2RightEn: "Issue Date",
      line2RightVal: "૨૧/૦૭/૨૦૨૧",
    },
    schemes: [
      { gu: "OBC પ્રી-મેટ્રિક શિષ્યવૃત્તિ", en: "OBC Pre-Matric Scholarship", hi: "ओबीसी प्री-मैट्रिक छात्रवृत्ति" },
      { gu: "સાયકલ સહાય યોજના", en: "Cycle Assistance Scheme", hi: "साइकिल सहायता योजना" },
    ],
    canDownload: true,
  },
  {
    id: "bank",
    nameGu: "માતાની બેંક પાસબુક",
    nameEn: "Mother's Bank Passbook",
    nameHi: "माता की बैंक पासबुक",
    subGu: "ડાયરેક્ટ બેનિફિટ ટ્રાન્સફર (DBT)",
    subEn: "Direct Benefit Transfer (DBT) A/C",
    subHi: "डायरेक्ट बेनिफिट ट्रांसफर (DBT)",
    category: "bank",
    categoryGu: "બેંક",
    categoryEn: "Banking",
    categoryHi: "बैंक खाता",
    icon: "account_balance",
    uploadDateGu: "૦૫/૦૨/૨૦૨૪",
    uploadDateEn: "05/02/2024",
    uploadDateHi: "05/02/2024",
    status: "approved",
    statusLabelGu: "DBT સક્રિય",
    statusLabelEn: "DBT Active",
    statusLabelHi: "DBT सक्रिय",
    badgeGu: "PFMS લિંક્ડ",
    badgeEn: "PFMS Linked",
    badgeHi: "PFMS लिंक्ड",
    meta: {
      line1LeftGu: "ખાતાધારક",
      line1LeftEn: "Account Holder",
      line1LeftVal: "હેતલબેન પટેલ (Hetalben)",
      line1RightGu: "બેંક",
      line1RightEn: "Bank",
      line1RightVal: "SBI આણંદ",
      line1RightAlert: false,
      line2LeftGu: "ખાતા નં",
      line2LeftEn: "A/C Number",
      line2LeftVal: "•••• •••• ૪૫૨૧",
      line2RightGu: "IFSC",
      line2RightEn: "IFSC",
      line2RightVal: "SBIN0001234",
    },
    schemes: [
      { gu: "તમામ DBT સરકારી સહાય (All Schemes)", en: "All Direct Benefit Transfer Schemes", hi: "सभी DBT सरकारी सहायता" },
    ],
    canDownload: true,
  },
];

type CategoryFilter = "all" | "identity" | "academic" | "income" | "bank" | "other";
type StatusFilter = "all" | "approved" | "pending";

export default function DocumentVaultPage() {
  const lang = useAppStore((s) => s.lang);

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<VaultDoc | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // Filtered documents
  const filteredDocs = useMemo(() => {
    return MOCK_DOCS.filter((doc) => {
      // Category filter
      if (activeCategory !== "all" && doc.category !== activeCategory) {
        return false;
      }
      // Status filter
      if (activeStatus !== "all" && doc.status !== activeStatus) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName =
          doc.nameGu.toLowerCase().includes(q) ||
          doc.nameEn.toLowerCase().includes(q) ||
          doc.nameHi.toLowerCase().includes(q);
        const matchCategory =
          doc.categoryEn.toLowerCase().includes(q) ||
          doc.categoryGu.toLowerCase().includes(q);
        const matchSchemes = doc.schemes.some(
          (s) =>
            s.gu.toLowerCase().includes(q) ||
            s.en.toLowerCase().includes(q) ||
            s.hi.toLowerCase().includes(q)
        );
        const matchMeta =
          doc.meta.line1LeftVal.toLowerCase().includes(q) ||
          (doc.meta.line2LeftVal && doc.meta.line2LeftVal.toLowerCase().includes(q));
        return matchName || matchCategory || matchSchemes || matchMeta;
      }
      return true;
    });
  }, [activeCategory, activeStatus, searchQuery]);

  const handleSyncDigiLocker = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncToast(true);
      setTimeout(() => setSyncToast(false), 3000);
    }, 1200);
  };

  const handleDownloadMock = (docTitle: string) => {
    setDownloadToast(docTitle);
    setTimeout(() => setDownloadToast(null), 2500);
  };

  // Health metric counters
  const totalCount = MOCK_DOCS.length;
  const verifiedCount = MOCK_DOCS.filter((d) => d.status === "approved").length;
  const pendingCount = MOCK_DOCS.filter((d) => d.status === "pending").length;

  return (
    <StudentShell>
      <div className="flex flex-col w-full pb-28 max-w-[430px] mx-auto min-h-screen bg-surface px-4 py-3 space-y-4">
        {/* 1. Header with back link, document count chip, and Upload button */}
        <div className="flex flex-col gap-2 pt-1 pb-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <Link
                href="/student"
                aria-label="Back to Student Dashboard"
                className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary active:scale-95 transition-transform hover:bg-surface-container-highest shrink-0"
              >
                <Icon name="arrow_back" size={20} />
              </Link>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="font-headline-sm text-headline-sm text-on-surface leading-tight truncate">
                    <T gu="દસ્તાવેજ વૉલ્ટ" en="Document Vault" hi="दस्तावेज़ वॉल्ट" />
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary-fixed text-on-primary-fixed shrink-0">
                    <T gu={`${totalCount} દસ્તાવેજ`} en={`${totalCount} Docs`} hi={`${totalCount} दस्तावेज़`} />
                  </span>
                </div>
                <span className="font-caption text-caption text-on-surface-variant font-medium">
                  <T gu="મારું સુરક્ષિત વૉલ્ટ" en="My Secure Vault" hi="मेरा सुरक्षित वॉल्ट" />
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-high rounded-full">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-caption text-[11px] font-semibold text-primary">
                  <T gu="DPDP સુરક્ષિત" en="DPDP Safe" hi="DPDP सुरक्षित" />
                </span>
              </div>
              <Link
                href="/student/vault/upload"
                className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Icon name="upload" size={16} />
                <span className="font-bold">
                  <T gu="અપલોડ" en="Upload" hi="अपलोड" />
                </span>
              </Link>
            </div>
          </div>

          <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
            <T
              gu="એકવાર અપલોડ કરો, દરેક સરકારી યોજના માટે વાપરો."
              en="Upload once, auto-reuse for every government scholarship."
              hi="एक बार अपलोड करें, हर सरकारी योजना के लिए पुनः उपयोग करें।"
            />
            <span className="block font-caption text-caption text-outline">
              <T
                gu="દરેક સ્કોલરશિપ માટે વારંવાર ઝેરોક્ષ કે ફાઇલ સબમિટ કરવાની જરૂર નથી."
                en="No repetitive photocopies or document submissions required."
                hi="हर छात्रवृत्ति के लिए बार-बार ज़ेरॉक्स जमा करने की आवश्यकता नहीं।"
              />
            </span>
          </p>
        </div>

        {/* 2. Student Quick Profile Card */}
        <section className="bg-surface-container-low rounded-xl p-3 flex items-center gap-3 shadow-xs border border-outline-variant">
          <Avatar name="Riya Patel" size="md" className="ring-2 ring-primary/20 shrink-0 shadow-sm" />
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <span className="font-title-md text-title-md text-on-surface truncate">
                <T gu="રિયા પટેલ" en="Riya Patel" hi="रिया पटेल" />
              </span>
              <span className="font-caption text-caption text-primary bg-primary-fixed px-2 py-0.5 rounded-full font-semibold shrink-0">
                <T gu="ધો. ૯-B" en="Std 9-B" hi="कक्षा 9-B" />
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant font-caption text-caption truncate mt-0.5">
              <Icon name="school" size={14} className="text-primary shrink-0" />
              <span className="truncate">
                <T
                  gu="શ્રી સરદાર પટેલ હાઈસ્કૂલ, આણંદ"
                  en="Shree Sardar Patel High School, Anand"
                  hi="श्री सरदार पटेल हाई स्कूल, आणंद"
                />
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-caption text-[11px] text-outline">
                CTS ID: <strong className="text-on-surface font-mono">GJ-AND-2026-004512</strong>
              </span>
            </div>
          </div>
        </section>

        {/* 3. Vault Health Metric Cards (KPI summary) */}
        <section className="bg-surface-container-low rounded-xl p-3.5 border border-outline-variant shadow-level-1">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <Icon name="verified_user" size={18} className="text-primary" />
              <span className="font-label-lg text-label-lg text-on-surface">
                <T gu="વૉલ્ટ સ્થિતિ" en="Vault Health Status" hi="वॉल्ट स्थिति" />
              </span>
            </div>
            <span className="font-label-md text-label-md text-primary font-bold">
              <T gu="૮૫% સજ્જ" en="85% Ready" hi="85% तैयार" />
            </span>
          </div>

          {/* 4 Compact Health Counters */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-surface-container-lowest rounded-lg p-2 flex flex-col items-center justify-center text-center shadow-xs border border-outline-variant">
              <span className="font-title-lg text-title-lg text-on-surface font-bold">{totalCount}</span>
              <span className="font-caption text-[11px] text-on-surface-variant leading-none mt-1">
                <T gu="કુલ દસ્તાવેજ" en="Total Docs" hi="कुल दस्तावेज़" />
              </span>
            </div>
            <div className="bg-surface-container-lowest rounded-lg p-2 flex flex-col items-center justify-center text-center shadow-xs border border-outline-variant">
              <span className="font-title-lg text-title-lg text-primary font-bold">{verifiedCount}</span>
              <span className="font-caption text-[11px] text-on-surface-variant leading-none mt-1">
                <T gu="ચકાસાયેલ" en="Verified" hi="सत्यापित" />
              </span>
            </div>
            <div className="bg-surface-container-lowest rounded-lg p-2 flex flex-col items-center justify-center text-center shadow-xs border border-outline-variant">
              <span className="font-title-lg text-title-lg text-secondary font-bold">{pendingCount}</span>
              <span className="font-caption text-[11px] text-secondary font-semibold leading-none mt-1">
                <T gu="ધ્યાન જરૂરી" en="Action Due" hi="कार्रवाई बाकी" />
              </span>
            </div>
            <div className="bg-surface-container-lowest rounded-lg p-2 flex flex-col items-center justify-center text-center shadow-xs border border-outline-variant">
              <span className="font-title-lg text-title-lg text-outline font-bold">૧</span>
              <span className="font-caption text-[11px] text-on-surface-variant leading-none mt-1">
                <T gu="સુરક્ષિત" en="Encrypted" hi="सुरक्षित" />
              </span>
            </div>
          </div>
        </section>

        {/* 4. DigiLocker Official Sync Banner */}
        <section className="bg-surface-container-high/60 rounded-xl p-3.5 relative overflow-hidden border border-outline-variant shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
              <Icon name="cloud_sync" size={24} className="text-on-primary" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-label-lg text-label-lg text-on-surface font-bold">
                  <T gu="DigiLocker લિંક થયેલ છે" en="DigiLocker Linked" hi="डिजिलॉकर लिंक है" />
                </span>
                <Icon name="check_circle" size={16} fill className="text-primary" />
              </div>
              <p className="font-caption text-caption text-on-surface-variant mt-0.5 leading-snug">
                <T
                  gu="તમારા પ્રમાણિત પ્રમાણપત્રો આપમેળે મેળવો — કોઈ ઝેરોક્ષ કે ફિઝિકલ વેરીફિકેશનની જરૂર નથી."
                  en="Fetch certified certificates automatically — no photocopies or manual visits required."
                  hi="अपने प्रमाणित प्रमाण पत्र स्वचालित रूप से प्राप्त करें — ज़ेरॉक्स की आवश्यकता नहीं।"
                />
              </p>
              <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleSyncDigiLocker}
                  disabled={isSyncing}
                  className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm active:scale-95 transition-all disabled:opacity-75"
                >
                  <Icon name="sync" size={16} className={isSyncing ? "animate-spin" : ""} />
                  <span>
                    {isSyncing ? (
                      <T gu="સિન્ક થઈ રહ્યું છે..." en="Syncing Docs..." hi="सिंक हो रहा है..." />
                    ) : (
                      <T gu="નવા દસ્તાવેજ ખેંચો" en="Pull from DigiLocker" hi="डिजिलॉकर से लाएं" />
                    )}
                  </span>
                </button>
                <span className="font-caption text-[11px] text-on-surface-variant">
                  <T gu="છેલ્લું સિન્ક: આજે ૧૦:૧૨ AM" en="Last synced: Today 10:12 AM" hi="अंतिम सिंक: आज 10:12 AM" />
                </span>
              </div>
              {syncToast && (
                <div className="mt-2 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 animate-fade-in flex items-center gap-1">
                  <Icon name="check" size={14} />
                  <span>
                    <T
                      gu="DigiLocker સાથે સફળતાપૂર્વક સિન્ક પૂર્ણ થયું!"
                      en="Successfully synced with DigiLocker!"
                      hi="डिजिलॉकर के साथ सफलतापूर्वक सिंक हुआ!"
                    />
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 5. Search Bar & Filter Tab Row */}
        <section className="flex flex-col gap-2.5">
          {/* Search Bar */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
              <Icon name="search" size={20} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === "gu"
                  ? "દસ્તાવેજ અથવા યોજના શોધો... (Search)"
                  : lang === "hi"
                  ? "दस्तावेज़ या योजना खोजें..."
                  : "Search documents or schemes..."
              }
              className="w-full h-11 pl-10 pr-10 bg-surface-container-lowest text-on-surface font-body-sm text-body-sm rounded-xl border border-outline-variant shadow-xs focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-outline"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear Search"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-on-surface"
              >
                <Icon name="close" size={18} />
              </button>
            ) : (
              <button
                type="button"
                aria-label="Voice Search"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-primary"
                onClick={() => setSearchQuery("ઓળખ")}
                title="Voice input simulation"
              >
                <Icon name="mic" size={20} />
              </button>
            )}
          </div>

          {/* Category Tabs (Horizontal Scroll) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`px-3 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap shrink-0 transition-colors ${
                activeCategory === "all"
                  ? "bg-primary text-on-primary font-bold shadow-xs"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              <T gu={`બધા (${totalCount})`} en={`All (${totalCount})`} hi={`सभी (${totalCount})`} />
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("identity")}
              className={`px-3 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap shrink-0 transition-colors ${
                activeCategory === "identity"
                  ? "bg-primary text-on-primary font-bold shadow-xs"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              <T gu="ઓળખ (Identity)" en="Identity" hi="पहचान" />
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("academic")}
              className={`px-3 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap shrink-0 transition-colors ${
                activeCategory === "academic"
                  ? "bg-primary text-on-primary font-bold shadow-xs"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              <T gu="શૈક્ષણિક (Academic)" en="Academic" hi="शैक्षणिक" />
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("income")}
              className={`px-3 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap shrink-0 transition-colors ${
                activeCategory === "income"
                  ? "bg-primary text-on-primary font-bold shadow-xs"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              <T gu="આવક (Income)" en="Income" hi="आय" />
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("bank")}
              className={`px-3 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap shrink-0 transition-colors ${
                activeCategory === "bank"
                  ? "bg-primary text-on-primary font-bold shadow-xs"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              <T gu="બેંક (Bank)" en="Bank" hi="बैंक" />
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("other")}
              className={`px-3 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap shrink-0 transition-colors ${
                activeCategory === "other"
                  ? "bg-primary text-on-primary font-bold shadow-xs"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              <T gu="અન્ય (0)" en="Other (0)" hi="अन्य (0)" />
            </button>
          </div>

          {/* Quick Status Sub-filters */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-on-surface-variant text-[11px] font-medium mr-1">
              <T gu="સ્થિતિ:" en="Status:" hi="स्थिति:" />
            </span>
            <button
              type="button"
              onClick={() => setActiveStatus("all")}
              className={`px-2.5 py-0.5 rounded-md font-medium text-[11px] transition-colors ${
                activeStatus === "all"
                  ? "bg-surface-container-highest text-on-surface font-bold"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <T gu="બધા" en="All" hi="सभी" />
            </button>
            <button
              type="button"
              onClick={() => setActiveStatus("approved")}
              className={`px-2.5 py-0.5 rounded-md font-medium text-[11px] transition-colors flex items-center gap-1 ${
                activeStatus === "approved"
                  ? "bg-emerald-100 text-emerald-800 font-bold"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <T gu={`ચકાસાયેલ (${verifiedCount})`} en={`Verified (${verifiedCount})`} hi={`सत्यापित (${verifiedCount})`} />
            </button>
            <button
              type="button"
              onClick={() => setActiveStatus("pending")}
              className={`px-2.5 py-0.5 rounded-md font-medium text-[11px] transition-colors flex items-center gap-1 ${
                activeStatus === "pending"
                  ? "bg-amber-100 text-amber-900 font-bold"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              <T gu={`ધ્યાન જરૂરી (${pendingCount})`} en={`Action Needed (${pendingCount})`} hi={`कार्रवाई आवश्यक (${pendingCount})`} />
            </button>
          </div>
        </section>

        {/* 6. Document List Section Header */}
        <div className="flex items-center justify-between pt-1">
          <span className="font-title-md text-title-md text-on-surface font-semibold">
            <T gu="સંગ્રહિત દસ્તાવેજો" en="Saved Documents" hi="सहेजे गए दस्तावेज़" />{" "}
            <span className="text-on-surface-variant text-xs font-normal">({filteredDocs.length})</span>
          </span>
          <span className="font-caption text-caption text-outline">
            <T gu="સોર્ટ: તાજેતરના" en="Sort: Recent" hi="क्रम: नवीनतम" />
          </span>
        </div>

        {/* 7. Document Cards Feed OR Empty State */}
        {filteredDocs.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-level-1">
            <EmptyState
              icon="folder_open"
              title={
                lang === "gu"
                  ? "કોઈ દસ્તાવેજ મળ્યા નથી"
                  : lang === "hi"
                  ? "कोई दस्तावेज़ नहीं मिला"
                  : "No documents found"
              }
              description={
                lang === "gu"
                  ? "આ કેટેગરી અથવા શોધ પરિણામ માટે કોઈ દસ્તાવેજ ઉપલબ્ધ નથી."
                  : lang === "hi"
                  ? "इस श्रेणी या खोज परिणाम के लिए कोई दस्तावेज़ उपलब्ध नहीं है।"
                  : "No documents match the selected filters or search criteria."
              }
              action={
                <Link
                  href="/student/vault/upload"
                  className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm rounded-xl"
                >
                  <Icon name="upload" size={18} />
                  <span>
                    <T gu="નવો દસ્તાવેજ અપલોડ કરો" en="Upload New Document" hi="नया दस्तावेज़ अपलोड करें" />
                  </span>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className={`bg-surface-container-lowest rounded-xl p-4 shadow-sm border ${
                  doc.status === "pending"
                    ? "border-amber-300 ring-1 ring-amber-100"
                    : "border-outline-variant"
                } flex flex-col gap-2.5 transition-all hover:shadow-level-1`}
              >
                {/* Header Row: Icon, Title, Subtitle, StatusChip */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        doc.category === "income"
                          ? "bg-secondary-fixed text-secondary"
                          : "bg-surface-container-high text-primary"
                      }`}
                    >
                      <Icon name={doc.icon} size={22} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-title-md text-title-md text-on-surface leading-tight font-semibold truncate">
                          <T gu={doc.nameGu} en={doc.nameEn} hi={doc.nameHi} />
                        </span>
                      </div>
                      <span className="font-caption text-caption text-on-surface-variant truncate">
                        <T gu={doc.subGu} en={doc.subEn} hi={doc.subHi} />
                      </span>
                    </div>
                  </div>

                  {/* Verification StatusChip */}
                  <div className="shrink-0">
                    <StatusChip
                      status={doc.status}
                      label={<T gu={doc.statusLabelGu} en={doc.statusLabelEn} hi={doc.statusLabelHi} />}
                    />
                  </div>
                </div>

                {/* Metadata Box */}
                <div className="bg-surface-container-low rounded-lg p-2.5 flex flex-col gap-1 font-caption text-caption text-on-surface-variant">
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <span className="truncate">
                      <T gu={`${doc.meta.line1LeftGu}: `} en={`${doc.meta.line1LeftEn}: `} hi={`${doc.meta.line1LeftGu}: `} />
                      <strong className="text-on-surface font-mono">{doc.meta.line1LeftVal}</strong>
                    </span>
                    {doc.meta.line1RightGu && (
                      <span className={doc.meta.line1RightAlert ? "text-danger font-bold" : "text-primary font-medium"}>
                        <T gu={`${doc.meta.line1RightGu}: `} en={`${doc.meta.line1RightEn}: `} hi={`${doc.meta.line1RightGu}: `} />
                        <strong>{doc.meta.line1RightVal}</strong>
                      </span>
                    )}
                  </div>

                  {(doc.meta.line2LeftGu || doc.meta.line2RightGu) && (
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      {doc.meta.line2LeftGu && (
                        <span className="truncate">
                          <T gu={`${doc.meta.line2LeftGu}: `} en={`${doc.meta.line2LeftEn}: `} hi={`${doc.meta.line2LeftGu}: `} />
                          <strong className="text-on-surface">{doc.meta.line2LeftVal}</strong>
                        </span>
                      )}
                      {doc.meta.line2RightGu && (
                        <span>
                          <T gu={`${doc.meta.line2RightGu}: `} en={`${doc.meta.line2RightEn}: `} hi={`${doc.meta.line2RightGu}: `} />
                          <strong className="text-on-surface">{doc.meta.line2RightVal}</strong>
                        </span>
                      )}
                    </div>
                  )}

                  {doc.meta.noteGu && (
                    <p className="font-caption text-[11px] text-outline leading-tight mt-0.5">
                      <T gu={doc.meta.noteGu} en={doc.meta.noteEn ?? ""} hi={doc.meta.noteHi ?? ""} />
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-outline pt-0.5 border-t border-outline-variant/50">
                    <span>
                      <T gu="અપલોડ તારીખ:" en="Upload Date:" hi="अपलोड तिथि:" />{" "}
                      <strong className="text-on-surface-variant">
                        <T gu={doc.uploadDateGu} en={doc.uploadDateEn} hi={doc.uploadDateHi} />
                      </strong>
                    </span>
                    <span className="bg-surface-container-high text-on-surface-variant px-1.5 py-0.2 rounded font-semibold text-[10px]">
                      <T gu={doc.categoryGu} en={doc.categoryEn} hi={doc.categoryHi} />
                    </span>
                  </div>
                </div>

                {/* Scheme Reuse Badges */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-caption text-[11px] text-outline font-medium">
                    <T gu="જોડાયેલ યોજના:" en="Linked Schemes:" hi="संबद्ध योजना:" />
                  </span>
                  {doc.schemes.map((sch, idx) => (
                    <span
                      key={idx}
                      className="bg-surface-container-high text-primary font-caption text-[11px] px-2 py-0.5 rounded-full font-semibold"
                    >
                      <T gu={sch.gu} en={sch.en} hi={sch.hi} />
                    </span>
                  ))}
                </div>

                {/* Action Row */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-outline-variant/60">
                  <div className="flex items-center gap-2 flex-1">
                    {/* Eye View/Preview Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedDoc(doc)}
                      className="bg-surface-container-high hover:bg-surface-container-highest text-primary px-3 py-1.5 rounded-lg font-label-md text-label-md flex items-center gap-1.5 active:scale-95 transition-all"
                    >
                      <Icon name="visibility" size={16} />
                      <span className="font-semibold">
                        <T gu="જુઓ (View)" en="View" hi="देखें" />
                      </span>
                    </button>

                    {/* Download Button */}
                    {doc.canDownload && (
                      <button
                        type="button"
                        onClick={() => handleDownloadMock(doc.nameEn)}
                        className="bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant px-3 py-1.5 rounded-lg font-label-md text-label-md flex items-center gap-1 active:scale-95 transition-all"
                      >
                        <Icon name="download" size={16} />
                        <span>
                          <T gu="ડાઉનલોડ" en="Download" hi="डाउनलोड" />
                        </span>
                      </button>
                    )}

                    {/* Upload New CTA for pending/expired */}
                    {doc.needsUpload && (
                      <Link
                        href="/student/vault/upload"
                        className="flex-1 bg-secondary hover:opacity-90 text-on-secondary py-1.5 px-3 rounded-lg font-label-md text-label-md flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-transform"
                      >
                        <Icon name="upload" size={16} />
                        <span className="font-bold">
                          <T gu="નવું અપલોડ કરો" en="Upload New" hi="नया अपलोड करें" />
                        </span>
                      </Link>
                    )}
                  </div>

                  <button
                    type="button"
                    aria-label="More Options"
                    onClick={() => setSelectedDoc(doc)}
                    className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface"
                  >
                    <Icon name="more_vert" size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 8. Trust & Privacy Shield Banner (DPDP Act 2023) */}
        <section className="bg-surface-container-low rounded-xl p-3 flex items-start gap-2.5 border border-outline-variant shadow-xs">
          <Icon name="security" size={20} className="text-primary shrink-0 mt-0.5" />
          <p className="font-caption text-caption text-on-surface-variant leading-relaxed">
            <strong className="text-on-surface">
              <T gu="ડેટા ગોપનીયતા ખાતરી: " en="Data Privacy Assurance: " hi="डेटा गोपनीयता आश्वासन: " />
            </strong>
            <T
              gu="આપના દસ્તાવેજો ગુજરાત સરકારના શિક્ષણ વિભાગ અને અધિકૃત યોજના વેરિફિકેશન સિવાય કોઈપણ તૃતીય પક્ષ સાથે શેર કરવામાં આવતા નથી. (DPDP Act ૨૦૨૩ હેઠળ સુરક્ષિત)"
              en="Your documents are never shared with any third party except the Gujarat Department of Education for official verification under DPDP Act 2023."
              hi="आपके दस्तावेज़ गुजरात शिक्षा विभाग के अलावा किसी तीसरे पक्ष के साथ साझा नहीं किए जाते हैं। (DPDP Act 2023 के तहत सुरक्षित)"
            />
          </p>
        </section>

        {/* 9. Smart OCR AI Scanner Floating CTA Card */}
        <section className="bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-2xl p-4 shadow-md flex flex-col gap-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Icon name="auto_awesome" size={18} className="text-white" />
              </div>
              <span className="font-title-md text-title-md font-bold text-white">
                <T gu="સ્માર્ટ AI સ્કેનર" en="Smart AI Scanner" hi="स्मार्ट AI स्कैनर" />
              </span>
            </div>
            <span className="bg-secondary text-on-secondary font-caption text-[11px] px-2 py-0.5 rounded-full font-bold">
              <T gu="ઝડપી" en="Instant OCR" hi="त्वरित" />
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-white/90 leading-tight">
            <T
              gu="કોઈપણ નવો દસ્તાવેજ અપલોડ કરો — અમારું AI આપમેળે તારીખો અને વિગતો વાંચીને વૉલ્ટમાં સાચવશે."
              en="Upload any new document — our AI will automatically read expiry dates, numbers and link them to scholarships."
              hi="कोई भी नया दस्तावेज़ अपलोड करें — हमारा AI अपने आप तारीखें पढ़कर वॉल्ट में सहेज लेगा।"
            />
          </p>
          <Link
            href="/student/vault/upload"
            className="mt-1 w-full bg-surface-container-lowest text-primary py-2.5 px-4 rounded-xl font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform hover:bg-surface-container-low"
          >
            <Icon name="add_photo_alternate" size={20} className="text-primary" />
            <span>
              <T
                gu="+ નવો દસ્તાવેજ અપલોડ કરો (Upload Document)"
                en="+ Upload New Document"
                hi="+ नया दस्तावेज़ अपलोड करें"
              />
            </span>
          </Link>
        </section>

        {/* 10. Floating Action Button (FAB) linking to /student/vault/upload */}
        <div className="fixed bottom-20 right-4 z-40 md:right-[max(1rem,calc(50%-215px+1rem))]">
          <Link
            href="/student/vault/upload"
            aria-label="Upload Document FAB"
            className="flex items-center gap-2 bg-gradient-to-r from-secondary to-[#e05b02] text-white px-4 py-3 rounded-full shadow-lg shadow-secondary/40 hover:scale-105 active:scale-95 transition-all group font-bold text-xs"
          >
            <Icon name="add" size={20} className="text-white" />
            <span className="tracking-wide">
              <T gu="દસ્તાવેજ ઉમેરો" en="Add Document" hi="दस्तावेज़ जोड़ें" />
            </span>
          </Link>
        </div>

        {/* 11. Document Preview Modal (when eye is clicked) */}
        {selectedDoc && (
          <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in"
            onClick={() => setSelectedDoc(null)}
          >
            <div
              className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-4 border border-outline-variant shadow-level-3 space-y-3.5 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-outline-variant">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon name={selectedDoc.icon} size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-title-md text-title-md text-on-surface font-bold leading-tight truncate">
                      <T gu={selectedDoc.nameGu} en={selectedDoc.nameEn} hi={selectedDoc.nameHi} />
                    </h3>
                    <span className="font-caption text-caption text-on-surface-variant">
                      <T gu={selectedDoc.categoryGu} en={selectedDoc.categoryEn} hi={selectedDoc.categoryHi} /> •{" "}
                      <T gu={selectedDoc.uploadDateGu} en={selectedDoc.uploadDateEn} hi={selectedDoc.uploadDateHi} />
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDoc(null)}
                  className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface"
                >
                  <Icon name="close" size={18} />
                </button>
              </div>

              {/* Status & Badge row */}
              <div className="flex items-center justify-between">
                <StatusChip
                  status={selectedDoc.status}
                  label={<T gu={selectedDoc.statusLabelGu} en={selectedDoc.statusLabelEn} hi={selectedDoc.statusLabelHi} />}
                />
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface">
                  CTS: GJ-AND-2026-004512
                </span>
              </div>

              {/* Visual Mock Certificate View */}
              <div className="relative rounded-xl border border-outline-variant bg-gradient-to-b from-blue-50/50 to-surface-container-low p-4 flex flex-col items-center text-center space-y-2 overflow-hidden shadow-inner">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Icon name="verified" size={28} />
                </div>
                <div>
                  <p className="font-label-lg text-label-lg font-bold text-on-surface">
                    <T gu={selectedDoc.nameGu} en={selectedDoc.nameEn} hi={selectedDoc.nameHi} />
                  </p>
                  <p className="font-caption text-[11px] text-on-surface-variant font-mono">
                    {selectedDoc.meta.line1LeftVal}
                  </p>
                </div>

                <div className="w-full bg-white rounded-lg p-2.5 border border-outline-variant text-left space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">
                      <T gu="વિદ્યાર્થી:" en="Student:" hi="विद्यार्थी:" />
                    </span>
                    <strong className="text-on-surface">Riya M. Patel</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">
                      <T gu="શાળા:" en="School:" hi="स्कूल:" />
                    </span>
                    <span className="text-on-surface truncate max-w-[170px]">Sardar Patel High School</span>
                  </div>
                  {selectedDoc.meta.line2LeftGu && (
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">
                        <T gu={selectedDoc.meta.line2LeftGu} en={selectedDoc.meta.line2LeftEn ?? ""} hi={selectedDoc.meta.line2LeftGu} />:
                      </span>
                      <strong className="text-on-surface truncate max-w-[170px]">{selectedDoc.meta.line2LeftVal}</strong>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <Icon name="lock" size={12} className="text-emerald-700" />
                  <span>
                    <T
                      gu="ગુજરાત સરકાર ડિજિટલ સહી પ્રમાણિત"
                      en="Govt of Gujarat Digitally Certified"
                      hi="गुजरात सरकार डिजिटल हस्ताक्षर प्रमाणित"
                    />
                  </span>
                </div>
              </div>

              {/* Linked schemes */}
              <div className="space-y-1">
                <p className="font-caption text-caption font-semibold text-on-surface-variant">
                  <T gu="જોડાયેલ શિષ્યવૃત્તિ યોજનાઓ:" en="Linked Scholarship Schemes:" hi="संबद्ध छात्रवृत्ति योजनाएं:" />
                </p>
                <div className="flex flex-wrap gap-1">
                  {selectedDoc.schemes.map((sch, i) => (
                    <span key={i} className="text-[11px] bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full font-medium">
                      <T gu={sch.gu} en={sch.en} hi={sch.hi} />
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-outline-variant">
                {selectedDoc.needsUpload ? (
                  <Link
                    href="/student/vault/upload"
                    className="flex-1 btn-cta text-center py-2 px-3 rounded-xl font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Icon name="upload" size={16} />
                    <span>
                      <T gu="નવો દસ્તાવેજ અપલોડ કરો" en="Upload Renewal" hi="नया दस्तावेज़ अपलोड करें" />
                    </span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      handleDownloadMock(selectedDoc.nameEn);
                      setSelectedDoc(null);
                    }}
                    className="flex-1 btn-primary py-2 px-3 rounded-xl font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Icon name="download" size={16} />
                    <span>
                      <T gu="પ્રમાણપત્ર ડાઉનલોડ" en="Download Certificate" hi="प्रमाण पत्र डाउनलोड" />
                    </span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedDoc(null)}
                  className="btn-outline py-2 px-4 rounded-xl font-label-md text-label-md font-semibold"
                >
                  <T gu="બંધ કરો" en="Close" hi="बंद करें" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 12. Download Toast */}
        {downloadToast && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-on-surface text-surface px-4 py-2 rounded-xl text-xs font-semibold shadow-lg animate-fade-in flex items-center gap-2">
            <Icon name="download_done" size={16} className="text-emerald-400" />
            <span>
              <T
                gu={`${downloadToast} ડાઉનલોડ થઈ ગયું.`}
                en={`${downloadToast} downloaded successfully.`}
                hi={`${downloadToast} सफलतापूर्वक डाउनलोड हुआ।`}
              />
            </span>
          </div>
        )}
      </div>
    </StudentShell>
  );
}
