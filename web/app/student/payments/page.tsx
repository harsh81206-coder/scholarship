"use client";

import { useState } from "react";
import Link from "next/link";
import { StudentShell } from "@/components/shell/StudentShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { StatusChip, Avatar } from "@/components/ui";

type FilterTab = "all" | "credited" | "inprogress" | "failed";

interface PaymentRecord {
  id: string;
  schemeGu: string;
  schemeEn: string;
  schemeHi: string;
  tagGu: string;
  tagEn: string;
  tagHi: string;
  categoryGu: string;
  categoryEn: string;
  categoryHi: string;
  amount: string;
  dateGu: string;
  dateEn: string;
  dateHi: string;
  status: "approved" | "inprogress" | "rejected" | "pending";
  statusLabelGu: string;
  statusLabelEn: string;
  statusLabelHi: string;
  utr?: string;
  pfms?: string;
  bank?: string;
  hasReceipt?: boolean;
  isSigned?: boolean;
  estimatedDateGu?: string;
  estimatedDateEn?: string;
  estimatedDateHi?: string;
  noteGu?: string;
  noteEn?: string;
  noteHi?: string;
  actionTextGu?: string;
  actionTextEn?: string;
  actionTextHi?: string;
  trackLink?: string;
  errorTitleGu?: string;
  errorTitleEn?: string;
  errorTitleHi?: string;
  errorDescGu?: string;
  errorDescEn?: string;
  errorDescHi?: string;
  retryAction?: boolean;
}

const PAYMENT_HISTORY: PaymentRecord[] = [
  {
    id: "pay-01",
    schemeGu: "જ્ઞાન સાધના / જ્ઞાન સેતુ મેરિટ સ્કોલરશિપ",
    schemeEn: "Gyan Setu Merit Scholarship",
    schemeHi: "ज्ञान सेतु मेरिट छात्रवृत्ति",
    tagGu: "વાર્ષિક હપ્તો",
    tagEn: "Annual Installment",
    tagHi: "वार्षिक किस्त",
    categoryGu: "મેરિટ સ્કોલરશિપ",
    categoryEn: "Merit Scholarship",
    categoryHi: "मेरिट छात्रवृत्ति",
    amount: "+ ₹ 12,500",
    dateGu: "02 નવેમ્બર 2025 • 11:24 AM",
    dateEn: "02 Nov 2025 • 11:24 AM",
    dateHi: "02 नवंबर 2025 • 11:24 AM",
    status: "approved",
    statusLabelGu: "ખાતામાં જમા",
    statusLabelEn: "Credited",
    statusLabelHi: "खाते में जमा",
    utr: "SBIN2611020045",
    pfms: "C10260481923",
    bank: "SBI •••• 4521 (Hetalben Patel)",
    hasReceipt: true,
    isSigned: true,
  },
  {
    id: "pay-02",
    schemeGu: "નમો લક્ષ્મી યોજના (વાર્ષિક સહાય)",
    schemeEn: "Namo Lakshmi Scheme (Annual Aid)",
    schemeHi: "नमो लक्ष्मी योजना (वार्षिक सहायता)",
    tagGu: "વાર્ષિક સહાય",
    tagEn: "Annual Aid",
    tagHi: "वार्षिक सहायता",
    categoryGu: "નમો લક્ષ્મી",
    categoryEn: "Namo Lakshmi",
    categoryHi: "नमो लक्ष्मी",
    amount: "+ ₹ 10,000",
    dateGu: "12 માર્ચ 2026 • 10:15 AM",
    dateEn: "12 Mar 2026 • 10:15 AM",
    dateHi: "12 मार्च 2026 • 10:15 AM",
    status: "approved",
    statusLabelGu: "ખાતામાં જમા",
    statusLabelEn: "Credited",
    statusLabelHi: "खाते में जमा",
    utr: "SBIN2603124891",
    pfms: "C10260984120",
    bank: "SBI •••• 4521 (Hetalben Patel)",
    hasReceipt: true,
    isSigned: true,
  },
  {
    id: "pay-03",
    schemeGu: "નમો લક્ષ્મી યોજના (Q2 Installment)",
    schemeEn: "Namo Lakshmi Scheme (Q2 Installment)",
    schemeHi: "नमो लक्ष्मी योजना (Q2 किस्त)",
    tagGu: "Q2 સહાય",
    tagEn: "Q2 Aid",
    tagHi: "Q2 सहायता",
    categoryGu: "નમો લક્ષ્મી",
    categoryEn: "Namo Lakshmi",
    categoryHi: "नमो लक्ष्मी",
    amount: "+ ₹ 2,500",
    dateGu: "15 ઓક્ટોબર 2025 • 03:45 PM",
    dateEn: "15 Oct 2025 • 03:45 PM",
    dateHi: "15 अक्टूबर 2025 • 03:45 PM",
    status: "approved",
    statusLabelGu: "ખાતામાં જમા",
    statusLabelEn: "Credited",
    statusLabelHi: "खाते में जमा",
    utr: "SBIN2510154921",
    pfms: "C10259834112",
    bank: "SBI •••• 4521 (Hetalben Patel)",
    hasReceipt: true,
    isSigned: false,
  },
  {
    id: "pay-04",
    schemeGu: "નમો લક્ષ્મી યોજના (Q3 Installment)",
    schemeEn: "Namo Lakshmi Scheme (Q3 Installment)",
    schemeHi: "नमो लक्ष्मी योजना (Q3 किस्त)",
    tagGu: "Q3 સહાય",
    tagEn: "Q3 Aid",
    tagHi: "Q3 सहायता",
    categoryGu: "નમો લક્ષ્મી",
    categoryEn: "Namo Lakshmi",
    categoryHi: "नमो लक्ष्मी",
    amount: "₹ 2,500",
    dateGu: "અરજી સ્વીકૃત • પ્રોસેસિંગ મોડ",
    dateEn: "Application Approved • Processing Mode",
    dateHi: "आवेदन स्वीकृत • प्रसंस्करण मोड",
    status: "inprogress",
    statusLabelGu: "PFMS ક્લિયરન્સમાં",
    statusLabelEn: "In PFMS Clearance",
    statusLabelHi: "PFMS क्लीयरेंस में",
    estimatedDateGu: "05 નવેમ્બર 2025",
    estimatedDateEn: "05 Nov 2025",
    estimatedDateHi: "05 नवंबर 2025",
    noteGu: "રાજ્ય નાણાં વિભાગ તરફથી મંજૂર. SBI નોડલ બેંકિંગ સર્વર દ્વારા ક્લિયરન્સ પેન્ડિંગ છે.",
    noteEn: "Approved by State Finance Dept. SBI nodal server clearance pending.",
    noteHi: "राज्य वित्त विभाग से स्वीकृत। SBI नोडल सर्वर क्लीयरेंस लंबित है।",
    actionTextGu: "કોઈ કાર્યવાહી જરૂરી નથી",
    actionTextEn: "No action required",
    actionTextHi: "कोई कार्रवाई आवश्यक नहीं",
    trackLink: "/student/applications",
  },
  {
    id: "pay-05",
    schemeGu: "સાધન સહાય શિષ્યવૃત્તિ (Special Aid)",
    schemeEn: "Special Aid Scholarship (Equipment Aid)",
    schemeHi: "साधन सहायता छात्रवृत्ति (विशेष सहायता)",
    tagGu: "શિષ્યવૃત્તિ",
    tagEn: "Scholarship",
    tagHi: "छात्रवृत्ति",
    categoryGu: "ધ્યાન આપો",
    categoryEn: "Action Needed",
    categoryHi: "कार्रवाई आवश्यक",
    amount: "₹ 2,000",
    dateGu: "28 ઓક્ટોબર 2025",
    dateEn: "28 Oct 2025",
    dateHi: "28 अक्टूबर 2025",
    status: "rejected",
    statusLabelGu: "DBT અસફળ",
    statusLabelEn: "DBT Failed",
    statusLabelHi: "DBT विफल",
    errorTitleGu: "NPCI આધાર મેપિંગ ફરી વેરિફિકેશન માંગે છે",
    errorTitleEn: "NPCI Aadhaar Mapping Requires Re-verification",
    errorTitleHi: "NPCI आधार मैपिंग पुनर्सत्यापन की आवश्यकता है",
    errorDescGu: "બેંક સર્વર રિસ્પોન્સ: માતાના આધાર કાર્ડ સાથે સેકન્ડરી NPCI મેપિંગ અધૂરું છે. શિષ્યવૃત્તિ આપમેળે ફરી જમા કરવા માટે તુરંત લિંક પૂર્ણ કરો.",
    errorDescEn: "Bank server response: Secondary NPCI mapping with mother's Aadhaar is incomplete. Complete linking to automatically credit scholarship.",
    errorDescHi: "बैंक सर्वर प्रतिक्रिया: माता के आधार कार्ड के साथ माध्यमिक NPCI मैपिंग अधूरी है। छात्रवृत्ति स्वतः जमा करने के लिए लिंकिंग पूर्ण करें।",
    retryAction: true,
  },
];

export default function StudentPaymentsPage() {
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showFixModal, setShowFixModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Bank Account State
  const [bankDetails, setBankDetails] = useState({
    holder: "Hetalben Patel",
    holderGu: "હેતલબેન પટેલ",
    holderRelation: "(માતા - Guardian)",
    holderRelationEn: "(Mother - Guardian)",
    holderRelationHi: "(माता - Guardian)",
    bankName: "State Bank of India (SBI)",
    branchGu: "આણંદ મુખ્ય શાખા (Anand Main Branch)",
    branchEn: "Anand Main Branch",
    branchHi: "आणंद मुख्य शाखा",
    accMasked: "•••• •••• 4521",
    accRaw: "4521",
    ifsc: "SBIN0001234",
    aadhaarSeeded: true,
    pfmsVerified: true,
    npciVerified: true,
  });

  // Edit Modal Form State
  const [formHolder, setFormHolder] = useState("Hetalben Patel");
  const [formBank, setFormBank] = useState("State Bank of India (SBI)");
  const [formAcc, setFormAcc] = useState("304891824521");
  const [formIfsc, setFormIfsc] = useState("SBIN0001234");
  const [formRelation, setFormRelation] = useState("Mother");
  const [isUpdating, setIsUpdating] = useState(false);

  // Fix NPCI Modal State
  const [isFixing, setIsFixing] = useState(false);
  const [fixSuccess, setFixSuccess] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    showToast(`Copied: ${text}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadReceipt = (scheme: string, utr: string) => {
    showToast(`Downloading DBT receipt for ${scheme} (${utr})...`);
  };

  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      const last4 = formAcc.slice(-4) || "4521";
      setBankDetails((prev) => ({
        ...prev,
        holder: formHolder,
        holderGu: formHolder,
        bankName: formBank,
        accMasked: `•••• •••• ${last4}`,
        ifsc: formIfsc.toUpperCase(),
      }));
      setIsUpdating(false);
      setShowUpdateModal(false);
      showToast("બેંક ખાતું સફળતાપૂર્વક અપડેટ થયું! (Bank details updated successfully)");
    }, 1000);
  };

  const handleFixNPCI = () => {
    setIsFixing(true);
    setTimeout(() => {
      setIsFixing(false);
      setFixSuccess(true);
      setTimeout(() => {
        setShowFixModal(false);
        setFixSuccess(false);
        showToast("NPCI આધાર મેપિંગ સફળ! ફરી પ્રક્રિયા શરૂ થઈ છે.");
      }, 1500);
    }, 1200);
  };

  const filteredHistory = PAYMENT_HISTORY.filter((item) => {
    if (filterTab === "all") return true;
    if (filterTab === "credited") return item.status === "approved";
    if (filterTab === "inprogress") return item.status === "inprogress";
    if (filterTab === "failed") return item.status === "rejected";
    return true;
  });

  return (
    <StudentShell>
      <div className="flex flex-col w-full max-w-[430px] mx-auto pb-24 text-on-surface">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-2 rounded-full shadow-lg text-xs font-medium flex items-center gap-2 animate-fade-in pointer-events-none">
            <Icon name="check_circle" size={16} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. Header & Back Navigation */}
        <div className="px-4 pt-3 pb-2 bg-surface">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1">
              <Link
                href="/student"
                aria-label="Back"
                className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container active:scale-95 transition-transform"
              >
                <Icon name="arrow_back" size={24} />
              </Link>
              <div className="flex flex-col min-w-0">
                <h1 className="font-headline-sm text-headline-sm text-on-surface tracking-tight truncate">
                  <T gu="મારી ચૂકવણીઓ" en="My Payments" hi="मेरे भुगतान" />
                </h1>
                <span className="font-caption text-caption text-primary font-semibold truncate">
                  <T gu="DBT સહાય • Direct to Bank" en="DBT Benefit • Direct to Bank" hi="DBT सहायता • Direct to Bank" />
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-full text-tertiary">
              <Icon name="verified_user" size={16} fill />
              <span className="font-label-md text-label-md font-semibold">
                <T gu="૧૦૦% સુરક્ષિત" en="100% Secure" hi="100% सुरक्षित" />
              </span>
            </div>
          </div>
          <p className="font-caption text-caption text-on-surface-variant">
            <T
              gu="સરકારી સહાય સીધી બેંક ખાતામાં (Direct Beneficiary Transfer)"
              en="Government assistance directly into bank account (Direct Beneficiary Transfer)"
              hi="सरकारी सहायता सीधे बैंक खाते में (Direct Beneficiary Transfer)"
            />
          </p>
        </div>

        {/* 2. Student Mini Strip */}
        <div className="px-4 pb-3">
          <div className="bg-surface-container-low rounded-xl p-3 shadow-xs flex items-center gap-3 border border-outline-variant/60">
            <div className="relative shrink-0">
              <Avatar name="Riya Patel" size="md" className="ring-2 ring-primary/20 shadow-xs" />
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-primary-container rounded-full flex items-center justify-center ring-2 ring-surface text-on-primary">
                <Icon name="school" size={10} className="text-white" />
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="font-title-md text-title-md text-on-surface truncate">
                  <T gu="રિયા પટેલ" en="Riya Patel" hi="रिया पटेल" />
                </span>
                <span className="bg-surface-container text-tertiary font-label-md text-label-md px-2 py-0.5 rounded-full shrink-0 font-medium">
                  <T gu="ધોરણ ૯-બી" en="Class 9-B" hi="कक्षा 9-बी" />
                </span>
              </div>
              <p className="font-caption text-caption text-on-surface-variant truncate">
                <T
                  gu="શ્રી સરદાર પટેલ હાઈસ્કૂલ, આણંદ"
                  en="Shree Sardar Patel High School, Anand"
                  hi="श्री सरदार पटेल हाई स्कूल, आणंद"
                />
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="font-caption text-[11px] text-outline font-mono truncate">
                  CTS ID: GJ-AND-2026-004512
                </p>
                <button
                  type="button"
                  onClick={() => handleCopy("GJ-AND-2026-004512", "cts")}
                  className="text-primary hover:text-primary-container transition-colors"
                  title="Copy CTS ID"
                  aria-label="Copy CTS ID"
                >
                  <Icon name={copiedKey === "cts" ? "check" : "content_copy"} size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Hero Total Received Amount Card (Prominently Displayed) */}
        <div className="px-4 pb-3">
          <div className="bg-gradient-to-br from-primary via-[#1e40af] to-[#1e3a8a] text-on-primary rounded-2xl p-4 shadow-md relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="font-label-md text-label-md text-on-primary-container bg-white/15 px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-xs">
                <Icon name="calendar_month" size={14} />
                <T gu="શૈક્ષણિક વર્ષ ૨૦૨૫-૨૦૨૬" en="Academic Year 2025-2026" hi="शैक्षणिक वर्ष 2025-2026" />
              </span>
              <span className="font-caption text-caption text-primary-fixed-dim flex items-center gap-1">
                <Icon name="sync" size={14} className="animate-spin" />
                <T gu="લાઇવ સ્ટેટસ" en="Live Status" hi="लाइव स्थिति" />
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 relative z-10">
              {/* Box 1: Total Received Amount */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex flex-col justify-between border border-white/10">
                <div className="flex items-center gap-1.5 text-primary-fixed mb-1">
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
                    <Icon name="payments" size={15} />
                  </span>
                  <span className="font-caption text-caption font-medium">
                    <T gu="કુલ જમા સહાય" en="Total Received" hi="कुल जमा सहायता" />
                  </span>
                </div>
                <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold tracking-tight text-white">
                  ₹ 25,000
                </span>
                <span className="font-caption text-[11px] text-primary-fixed-dim mt-0.5">
                  <T gu="૨૦૨૫-૨૬ માં સફળ ક્રેડિટ" en="Successfully credited in 2025-26" hi="2025-26 में सफल क्रेडिट" />
                </span>
              </div>

              {/* Box 2: Approved / In Process */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex flex-col justify-between border border-white/10">
                <div className="flex items-center gap-1.5 text-primary-fixed mb-1">
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
                    <Icon name="pending_actions" size={15} />
                  </span>
                  <span className="font-caption text-caption font-medium">
                    <T gu="મંજૂર - પ્રોસેસમાં" en="Approved - In Process" hi="स्वीकृत - प्रक्रिया में" />
                  </span>
                </div>
                <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold tracking-tight text-white">
                  ₹ 2,500
                </span>
                <span className="font-caption text-[11px] text-primary-fixed-dim mt-0.5">
                  <T gu="ટ્રેઝરી મંજૂર થયેલ" en="Treasury Approved" hi="ट्रेजरी स्वीकृत" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Primary DBT Bank Account Card */}
        <div className="px-4 pb-4">
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-surface-container-high/60">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                  <Icon name="account_balance" size={20} />
                </div>
                <div>
                  <h2 className="font-title-md text-title-md text-on-surface leading-tight font-semibold">
                    <T gu="પ્રાથમિક DBT બેંક ખાતું" en="Primary DBT Bank Account" hi="प्राथमिक DBT बैंक खाता" />
                  </h2>
                  <p className="font-caption text-caption text-on-surface-variant">
                    <T
                      gu="માતાનું માન્ય લિંક્ડ ખાતું (Aadhaar / NPCI)"
                      en="Mother's Verified Linked Account (Aadhaar / NPCI)"
                      hi="माता का सत्यापित लिंक खाता (Aadhaar / NPCI)"
                    />
                  </p>
                </div>
              </div>
              <span className="bg-surface-container-high text-primary font-label-md text-label-md px-2.5 py-1 rounded-full font-medium">
                <T gu="પ્રાથમિક ખાતું" en="Primary Account" hi="प्राथमिक खाता" />
              </span>
            </div>

            {/* Bank details card strip */}
            <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/50">
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                      <T gu={bankDetails.holderGu} en={bankDetails.holder} hi={bankDetails.holder} />
                    </span>
                    <span className="text-on-surface-variant font-caption text-caption">
                      <T
                        gu={bankDetails.holderRelation}
                        en={bankDetails.holderRelationEn}
                        hi={bankDetails.holderRelationHi}
                      />
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface font-medium">{bankDetails.bankName}</p>
                  <p className="font-caption text-caption text-on-surface-variant">
                    <T
                      gu={bankDetails.branchGu}
                      en={bankDetails.branchEn}
                      hi={bankDetails.branchHi}
                    />
                  </p>
                </div>

                {/* Bank stylized badge placeholder (no external image) */}
                <div className="w-10 h-10 rounded-full bg-blue-900 text-white flex flex-col items-center justify-center font-bold text-[10px] shadow-xs border-2 border-white ring-1 ring-blue-200 shrink-0">
                  <span className="leading-none text-[9px] text-amber-300">SBI</span>
                  <Icon name="account_balance" size={14} className="text-white" />
                </div>
              </div>

              {/* Account & IFSC details */}
              <div className="mt-3 pt-2 border-t border-surface-container-high/80 flex items-center justify-between">
                <div>
                  <span className="font-caption text-caption text-outline block">
                    <T gu="ખાતા નંબર" en="Account Number" hi="खाता संख्या" />
                  </span>
                  <span className="font-mono text-body-md font-semibold text-on-surface tracking-wider">
                    {bankDetails.accMasked}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-caption text-caption text-outline block">
                    <T gu="IFSC કોડ" en="IFSC Code" hi="IFSC कोड" />
                  </span>
                  <span className="font-mono text-body-sm font-semibold text-on-surface">
                    {bankDetails.ifsc}
                  </span>
                </div>
              </div>
            </div>

            {/* Verification Badges */}
            <div className="flex flex-wrap gap-1.5 py-1">
              <div className="bg-surface-container text-on-surface flex items-center gap-1 px-2.5 py-1 rounded-full border border-outline-variant/60">
                <Icon name="check_circle" size={15} fill className="text-primary" />
                <span className="font-label-md text-label-md font-medium">Aadhaar Seeded ✓</span>
              </div>
              <div className="bg-surface-container text-on-surface flex items-center gap-1 px-2.5 py-1 rounded-full border border-outline-variant/60">
                <Icon name="verified" size={15} fill className="text-primary" />
                <span className="font-label-md text-label-md font-medium">PFMS Verified ✓</span>
              </div>
              <div className="bg-surface-container text-on-surface flex items-center gap-1 px-2.5 py-1 rounded-full border border-outline-variant/60">
                <Icon name="verified_user" size={15} fill className="text-primary" />
                <span className="font-label-md text-label-md font-medium">NPCI Verified ✓</span>
              </div>
              <div className="bg-secondary-fixed text-on-secondary-fixed flex items-center gap-1 px-2.5 py-1 rounded-full">
                <Icon name="bolt" size={14} />
                <span className="font-label-md text-label-md font-semibold">DBT Direct Active</span>
              </div>
            </div>

            {/* Direct Benefit Info Notice */}
            <div className="bg-surface-container-high/60 rounded-xl p-3 flex items-start gap-2 border border-outline-variant/40">
              <Icon name="shield" size={18} className="text-primary shrink-0 mt-0.5" />
              <p className="font-caption text-caption text-on-surface-variant leading-relaxed">
                <strong className="text-on-surface">
                  <T gu="૧૦૦% સીધી સહાય: " en="100% Direct Benefit: " hi="100% सीधी सहायता: " />
                </strong>
                <T
                  gu="તમામ સરકારી નાણાં કોઈપણ વચેટિયા વગર સીધા માતાના બેંક ખાતામાં PFMS દ્વારા જમા થાય છે."
                  en="All government funds are credited directly to mother's bank account via PFMS with zero middlemen."
                  hi="सभी सरकारी सहायता बिना किसी बिचौलिए के सीधे माता के बैंक खाते में PFMS द्वारा जमा होती है।"
                />
              </p>
            </div>

            {/* Secondary CTA: Add/Update Bank Account */}
            <div className="pt-1 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowUpdateModal(true)}
                className="text-primary font-label-md text-label-md flex items-center gap-1.5 hover:underline py-1 group"
              >
                <Icon name="edit_square" size={16} className="group-hover:scale-110 transition-transform" />
                <span>
                  <T
                    gu="બેંક ખાતું ઉમેરો / સુધારો"
                    en="Add / Update Bank Account"
                    hi="बैंक खाता जोड़ें / अपडेट करें"
                  />
                </span>
              </button>
              <span className="font-caption text-[11px] text-outline flex items-center gap-1">
                <Icon name="lock" size={13} className="text-emerald-600" />
                <T gu="OTP સુરક્ષિત" en="OTP Secured" hi="OTP सुरक्षित" />
              </span>
            </div>
          </div>
        </div>

        {/* 5. Payment History Header & Filter Tabs */}
        <div className="px-4 pb-2">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">
                <T gu="ચૂકવણી ઇતિહાસ" en="Payment History" hi="भुगतान इतिहास" />
              </h2>
              <span className="font-caption text-caption text-on-surface-variant">
                <T gu="DBT પાસબુક અને ટ્રાન્ઝેક્શન વિગત" en="DBT Passbook & Transaction Details" hi="DBT पासबुक और लेनदेन विवरण" />
              </span>
            </div>
            <button
              type="button"
              onClick={() => showToast("Showing recent 2025-26 transactions")}
              className="text-primary flex items-center gap-1 font-label-md text-label-md bg-surface-container px-2.5 py-1 rounded-full hover:bg-surface-container-high transition-colors"
            >
              <Icon name="tune" size={16} />
              <T gu="ફિલ્ટર" en="Filter" hi="फ़िल्टर" />
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setFilterTab("all")}
              className={`px-3 py-1.5 rounded-full font-label-md text-label-md shrink-0 transition-colors ${
                filterTab === "all"
                  ? "bg-primary text-on-primary shadow-sm font-semibold"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <T gu="બધા (૫)" en="All (5)" hi="सभी (5)" />
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("credited")}
              className={`px-3 py-1.5 rounded-full font-label-md text-label-md shrink-0 transition-colors ${
                filterTab === "credited"
                  ? "bg-primary text-on-primary shadow-sm font-semibold"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <T gu="જમા થયેલ (૩)" en="Credited (3)" hi="जमा (3)" />
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("inprogress")}
              className={`px-3 py-1.5 rounded-full font-label-md text-label-md shrink-0 transition-colors ${
                filterTab === "inprogress"
                  ? "bg-primary text-on-primary shadow-sm font-semibold"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <T gu="પ્રક્રિયામાં (૧)" en="In Progress (1)" hi="प्रक्रिया में (1)" />
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("failed")}
              className={`px-3 py-1.5 rounded-full font-label-md text-label-md shrink-0 transition-colors ${
                filterTab === "failed"
                  ? "bg-primary text-on-primary shadow-sm font-semibold"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <T gu="સમસ્યા / ધ્યાન આપો (૧)" en="Action Needed (1)" hi="कार्रवाई आवश्यक (1)" />
            </button>
          </div>
        </div>

        {/* 6. Payment History List Cards */}
        <div className="px-4 space-y-3 pb-6">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant space-y-3 hover:border-primary/40 transition-colors"
            >
              {/* Header row: Scheme name & Amount */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`font-label-md text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                        item.status === "rejected"
                          ? "bg-danger-container text-on-danger-container"
                          : item.status === "inprogress"
                          ? "bg-surface-container-high text-tertiary"
                          : "bg-surface-container text-primary"
                      }`}
                    >
                      <T gu={item.categoryGu} en={item.categoryEn} hi={item.categoryHi} />
                    </span>
                    <span className="text-outline font-caption text-[11px]">
                      <T gu={item.tagGu} en={item.tagEn} hi={item.tagHi} />
                    </span>
                  </div>
                  <h3 className="font-title-md text-title-md text-on-surface font-semibold leading-snug">
                    <T gu={item.schemeGu} en={item.schemeEn} hi={item.schemeHi} />
                  </h3>
                  <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                    <T gu={item.dateGu} en={item.dateEn} hi={item.dateHi} />
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`font-headline-sm text-headline-sm font-bold block ${
                      item.status === "approved"
                        ? "text-primary"
                        : item.status === "rejected"
                        ? "text-danger"
                        : "text-on-surface"
                    }`}
                  >
                    {item.amount}
                  </span>
                  <div className="mt-1 flex justify-end">
                    <StatusChip
                      status={item.status}
                      label={
                        <T
                          gu={item.statusLabelGu}
                          en={item.statusLabelEn}
                          hi={item.statusLabelHi}
                        />
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Details box for successful credits */}
              {item.status === "approved" && (
                <div className="bg-surface-container-low rounded-xl p-3 space-y-1.5 text-on-surface-variant font-caption text-caption border border-outline-variant/40">
                  {item.utr && (
                    <div className="flex justify-between items-center">
                      <span className="text-outline">
                        <T gu="UTR નંબર:" en="UTR Number:" hi="UTR नंबर:" />
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-on-surface font-semibold select-all">
                          {item.utr}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(item.utr!, item.id + "-utr")}
                          className="text-primary hover:text-primary-container p-0.5 transition-colors"
                          title="Copy UTR"
                          aria-label="Copy UTR"
                        >
                          <Icon name={copiedKey === item.id + "-utr" ? "check" : "content_copy"} size={12} />
                        </button>
                      </div>
                    </div>
                  )}

                  {item.pfms && (
                    <div className="flex justify-between items-center">
                      <span className="text-outline">
                        <T gu="PFMS સંદર્ભ:" en="PFMS Ref:" hi="PFMS संदर्भ:" />
                      </span>
                      <span className="font-mono text-on-surface font-medium select-all">
                        {item.pfms}
                      </span>
                    </div>
                  )}

                  {item.bank && (
                    <div className="flex justify-between items-center">
                      <span className="text-outline">
                        <T gu="જમા બેંક:" en="Credited Bank:" hi="जमा बैंक:" />
                      </span>
                      <span className="text-on-surface font-medium">{item.bank}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Details box for in-progress payment */}
              {item.status === "inprogress" && (
                <div className="bg-surface-container-low rounded-xl p-3 space-y-1.5 border border-outline-variant/40">
                  <div className="flex items-center justify-between text-caption font-caption text-on-surface">
                    <span className="text-on-surface-variant font-medium">
                      <T gu="અંદાજિત જમા તારીખ:" en="Estimated Credit Date:" hi="अनुमानित जमा तिथि:" />
                    </span>
                    <span className="font-semibold text-primary">
                      <T
                        gu={item.estimatedDateGu || ""}
                        en={item.estimatedDateEn || ""}
                        hi={item.estimatedDateHi || ""}
                      />
                    </span>
                  </div>
                  {item.noteGu && (
                    <p className="font-caption text-[11px] text-on-surface-variant leading-relaxed">
                      <T gu={item.noteGu} en={item.noteEn || ""} hi={item.noteHi || ""} />
                    </p>
                  )}
                </div>
              )}

              {/* Error box for failed DBT payment */}
              {item.status === "rejected" && (
                <div className="bg-danger-container/40 rounded-xl p-3 flex items-start gap-2.5 border border-danger-container">
                  <Icon name="error" size={20} className="text-danger shrink-0 mt-0.5" />
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <p className="font-label-md text-label-md text-on-danger-container font-semibold">
                      <T
                        gu={item.errorTitleGu || ""}
                        en={item.errorTitleEn || ""}
                        hi={item.errorTitleHi || ""}
                      />
                    </p>
                    <p className="font-caption text-caption text-on-surface-variant leading-relaxed">
                      <T
                        gu={item.errorDescGu || ""}
                        en={item.errorDescEn || ""}
                        hi={item.errorDescHi || ""}
                      />
                    </p>
                  </div>
                </div>
              )}

              {/* Footer actions for payment card */}
              <div className="pt-1 flex items-center justify-between">
                {item.status === "approved" && (
                  <>
                    <div className="flex items-center gap-1 text-on-surface-variant font-caption text-[11px]">
                      <Icon name="verified" size={14} fill className="text-primary" />
                      <span>
                        <T gu="ડિજિટલ સહી કરેલ" en="Digitally Signed" hi="डिजिटल हस्ताक्षरित" />
                      </span>
                    </div>
                    {item.hasReceipt && (
                      <button
                        type="button"
                        onClick={() => handleDownloadReceipt(item.schemeEn, item.utr || "DBT")}
                        className="h-9 px-3 bg-surface-container hover:bg-surface-container-high text-primary rounded-lg font-label-md text-label-md flex items-center gap-1.5 transition-colors"
                      >
                        <Icon name="download" size={16} />
                        <span>
                          <T gu="રસીદ ડાઉનલોડ" en="Download Receipt" hi="रसीद डाउनलोड" />
                        </span>
                      </button>
                    )}
                  </>
                )}

                {item.status === "inprogress" && (
                  <>
                    <span className="flex items-center gap-1 text-on-surface-variant font-caption text-[11px]">
                      <Icon name="info" size={14} className="text-tertiary" />
                      <T gu="કોઈ કાર્યવાહી જરૂરી નથી" en="No action required" hi="कोई कार्रवाई आवश्यक नहीं" />
                    </span>
                    <Link
                      href={item.trackLink || "/student/applications"}
                      className="text-primary font-label-md text-label-md hover:underline flex items-center gap-1"
                    >
                      <span>
                        <T gu="વિગત ટ્રેક કરો" en="Track Details" hi="विवरण ट्रैक करें" />
                      </span>
                      <Icon name="arrow_forward" size={14} />
                    </Link>
                  </>
                )}

                {item.status === "rejected" && item.retryAction && (
                  <button
                    type="button"
                    onClick={() => setShowFixModal(true)}
                    className="w-full h-11 bg-secondary hover:bg-secondary/90 text-on-secondary rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all font-semibold"
                  >
                    <Icon name="bolt" size={18} />
                    <span>
                      <T
                        gu="ફરી લિંક કરો / સુધારો કરો (Fix & Retry)"
                        en="Fix & Retry NPCI Link"
                        hi="फिर से लिंक करें / सुधारें (Fix & Retry)"
                      />
                    </span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredHistory.length === 0 && (
            <div className="bg-surface-container-lowest rounded-2xl p-8 text-center border border-outline-variant space-y-2">
              <div className="w-12 h-12 rounded-full bg-surface-container-high mx-auto flex items-center justify-center text-on-surface-variant">
                <Icon name="search_off" size={24} />
              </div>
              <p className="font-title-md text-title-md font-semibold text-on-surface">
                <T gu="કોઈ રેકોર્ડ મળ્યો નથી" en="No records found" hi="कोई रिकॉर्ड नहीं मिला" />
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                <T
                  gu="આ ફિલ્ટર કેટેગરીમાં કોઈ ચૂકવણી ઉપલબ્ધ નથી."
                  en="No payment transactions found in this filter category."
                  hi="इस श्रेणी में कोई भुगतान लेनदेन नहीं मिला।"
                />
              </p>
            </div>
          )}
        </div>

        {/* 7. DBT & PFMS Citizen Help Center */}
        <div className="px-4 pb-6">
          <div className="bg-surface-container rounded-2xl p-4 shadow-xs space-y-3 text-center border border-outline-variant/60">
            <div className="w-10 h-10 rounded-full bg-surface-container-high mx-auto flex items-center justify-center text-primary">
              <Icon name="support_agent" size={22} />
            </div>
            <div>
              <h4 className="font-title-md text-title-md text-on-surface font-semibold">
                <T
                  gu="DBT / PFMS નાગરિક સહાયતા કેન્દ્ર"
                  en="DBT / PFMS Citizen Support Center"
                  hi="DBT / PFMS नागरिक सहायता केंद्र"
                />
              </h4>
              <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                <T
                  gu="જો આપની શિષ્યવૃત્તિ જમા થવામાં કોઈ સમસ્યા હોય તો ટોલ-ફ્રી સંપર્ક કરો:"
                  en="If you have any difficulty receiving your scholarship DBT, contact toll-free:"
                  hi="यदि आपकी छात्रवृत्ति जमा होने में कोई समस्या है तो टोल-फ्री संपर्क करें:"
                />
              </p>
            </div>
            <div>
              <a
                href="tel:18002335500"
                className="bg-surface-container-lowest rounded-xl py-2 px-4 inline-flex items-center gap-2 shadow-xs hover:bg-surface-container-low transition-colors border border-outline-variant/50"
              >
                <Icon name="call" size={18} className="text-primary" />
                <span className="font-mono font-bold text-title-md text-primary">1800-233-5500</span>
                <span className="font-caption text-caption text-on-surface-variant">
                  <T gu="(સવારે 8 થી રાત્રે 8)" en="(8 AM to 8 PM)" hi="(सुबह 8 से रात 8)" />
                </span>
              </a>
            </div>
            <p className="font-caption text-[11px] text-outline leading-tight">
              <T
                gu="આ પોર્ટલ ડિજિટલ પર્સનલ ડેટા પ્રોટેક્શન (DPDP) એક્ટ ૨૦૨૩ હેઠળ સુરક્ષિત અને ટોકનાઇઝ્ડ છે. ખાતાની વિગતો સંપૂર્ણ ગોપનીય રહે છે."
                en="This portal is secured and tokenized under Digital Personal Data Protection (DPDP) Act 2023. Account details remain strictly confidential."
                hi="यह पोर्टल डिजिटल पर्सनल डेटा प्रोटेक्शन (DPDP) अधिनियम 2023 के तहत सुरक्षित और टोकनाइज्ड है। खाता विवरण पूरी तरह गोपनीय रहता है।"
              />
            </p>
          </div>
        </div>

        {/* Modal 1: Add/Update Bank Account */}
        {showUpdateModal && (
          <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in"
            onClick={() => setShowUpdateModal(false)}
          >
            <div
              className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-5 border border-outline-variant shadow-level-3 space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Icon name="account_balance" size={20} />
                  </div>
                  <div>
                    <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                      <T
                        gu="બેંક ખાતું ઉમેરો / સુધારો"
                        en="Add / Update Bank Account"
                        hi="बैंक खाता जोड़ें / अपडेट करें"
                      />
                    </h3>
                    <p className="font-caption text-[11px] text-on-surface-variant">
                      <T gu="DBT સહાય ખાતાની વિગતો" en="DBT Benefit Bank Details" hi="DBT सहायता बैंक विवरण" />
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high"
                >
                  <Icon name="close" size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveBank} className="space-y-3">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1">
                    <T gu="ખાતાધારકનું નામ" en="Account Holder Name" hi="खाताधारक का नाम" />
                  </label>
                  <input
                    type="text"
                    required
                    value={formHolder}
                    onChange={(e) => setFormHolder(e.target.value)}
                    className="input"
                    placeholder="e.g. Hetalben Patel"
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1">
                    <T gu="સંબંધ (Relation with Student)" en="Relation with Student" hi="छात्र के साथ संबंध" />
                  </label>
                  <select
                    value={formRelation}
                    onChange={(e) => setFormRelation(e.target.value)}
                    className="input"
                  >
                    <option value="Mother">માતા (Mother / Guardian)</option>
                    <option value="Father">પિતા (Father / Guardian)</option>
                    <option value="Self">વિદ્યાર્થી પોતે (Student Self)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1">
                    <T gu="બેંકનું નામ" en="Bank Name" hi="बैंक का नाम" />
                  </label>
                  <input
                    type="text"
                    required
                    value={formBank}
                    onChange={(e) => setFormBank(e.target.value)}
                    className="input"
                    placeholder="e.g. State Bank of India (SBI)"
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1">
                    <T gu="બેંક ખાતા નંબર" en="Bank Account Number" hi="बैंक खाता संख्या" />
                  </label>
                  <input
                    type="text"
                    required
                    value={formAcc}
                    onChange={(e) => setFormAcc(e.target.value)}
                    className="input font-mono"
                    placeholder="e.g. 304891824521"
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1">
                    <T gu="IFSC કોડ" en="IFSC Code" hi="IFSC कोड" />
                  </label>
                  <input
                    type="text"
                    required
                    value={formIfsc}
                    onChange={(e) => setFormIfsc(e.target.value)}
                    className="input font-mono uppercase"
                    placeholder="e.g. SBIN0001234"
                  />
                </div>

                <div className="bg-surface-container-high/60 rounded-xl p-2.5 flex items-start gap-2 text-[11px] text-on-surface-variant">
                  <Icon name="verified_user" size={16} className="text-primary shrink-0 mt-0.5" />
                  <span>
                    <T
                      gu="આધાર-લિંક્ડ ખાતું NPCI અને PFMS પોર્ટલ સાથે રીઅલ-ટાઇમ ચકાસવામાં આવશે."
                      en="Aadhaar-linked bank account will be verified in real-time with NPCI and PFMS."
                      hi="आधार-लिंक बैंक खाते का NPCI और PFMS के साथ वास्तविक समय में सत्यापन किया जाएगा।"
                    />
                  </span>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowUpdateModal(false)}
                    className="flex-1 btn-outline h-10 text-sm"
                  >
                    <T gu="રદ કરો" en="Cancel" hi="रद्द करें" />
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 btn-primary h-10 text-sm flex items-center justify-center gap-1.5"
                  >
                    {isUpdating ? (
                      <>
                        <Icon name="sync" size={16} className="animate-spin" />
                        <T gu="ચકાસણી ચાલુ..." en="Verifying..." hi="सत्यापन जारी..." />
                      </>
                    ) : (
                      <>
                        <Icon name="save" size={16} />
                        <T gu="ચકાસો અને સાચવો" en="Verify & Save" hi="सत्यापित करें और सहेजें" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal 2: Fix & Retry NPCI Link */}
        {showFixModal && (
          <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in"
            onClick={() => setShowFixModal(false)}
          >
            <div
              className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-5 border border-outline-variant shadow-level-3 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center">
                    <Icon name="bolt" size={20} />
                  </div>
                  <div>
                    <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                      <T
                        gu="NPCI આધાર લિંક ફરી સુધારો"
                        en="Re-sync NPCI Aadhaar Link"
                        hi="NPCI आधार लिंक पुनर्सत्यापित करें"
                      />
                    </h3>
                    <p className="font-caption text-[11px] text-on-surface-variant">
                      <T gu="DBT પેમેન્ટ ક્લિયરન્સ" en="DBT Payment Clearance" hi="DBT भुगतान क्लीयरेंस" />
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFixModal(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high"
                >
                  <Icon name="close" size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  <T
                    gu="માતાના આધાર કાર્ડ સાથે SBI ખાતાનું NPCI મેપિંગ પુનઃસૂચિત કરવા માટે તુરંત UIDAI આધાર કન્સેન્ટ મોકલો. સિસ્ટમ આપમેળે ₹ ૨,૦૦૦ DBT ફરી શરૂ કરશે."
                    en="Submit UIDAI Aadhaar consent to re-sync NPCI mapping for mother's SBI account. System will automatically re-trigger ₹ 2,000 DBT disbursement."
                    hi="माता के आधार कार्ड के साथ SBI खाते के NPCI मैपिंग को पुनः सिंक करने के लिए सहमति सबमिट करें। ₹ 2,000 DBT भुगतान स्वतः पुनः सक्रिय हो जाएगा।"
                  />
                </p>

                <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/60 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">
                      <T gu="યોજના:" en="Scheme:" hi="योजना:" />
                    </span>
                    <span className="font-medium text-on-surface">સાધન સહાય શિષ્યવૃત્તિ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">
                      <T gu="રકમ:" en="Amount:" hi="राशि:" />
                    </span>
                    <span className="font-bold text-primary">₹ 2,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">
                      <T gu="લિંક્ડ ખાતું:" en="Linked Account:" hi="लिंक खाता:" />
                    </span>
                    <span className="font-mono text-on-surface">SBI •••• 4521</span>
                  </div>
                </div>

                {fixSuccess ? (
                  <div className="bg-success-container/60 text-on-success-container p-3 rounded-xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
                    <Icon name="check_circle" size={18} fill className="text-success" />
                    <span>
                      <T
                        gu="NPCI આધાર સફળતાપૂર્વક જોડાયું! ₹ ૨,૦૦૦ DBT પુનઃપ્રક્રિયામાં મુકાયેલ છે."
                        en="NPCI Aadhaar mapping linked! ₹ 2,000 DBT queued for instant credit."
                        hi="NPCI आधार सफलतापूर्वक लिंक हुआ! ₹ 2,000 DBT पुनः प्रक्रिया में है।"
                      />
                    </span>
                  </div>
                ) : (
                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowFixModal(false)}
                      className="flex-1 btn-outline h-10 text-sm"
                    >
                      <T gu="પાછા જાઓ" en="Back" hi="वापस जाएं" />
                    </button>
                    <button
                      type="button"
                      disabled={isFixing}
                      onClick={handleFixNPCI}
                      className="flex-1 btn-cta h-10 text-sm flex items-center justify-center gap-1.5"
                    >
                      {isFixing ? (
                        <>
                          <Icon name="sync" size={16} className="animate-spin" />
                          <T gu="NPCI પોર્ટલ કનેક્ટ..." en="Connecting NPCI..." hi="NPCI कनेक्ट हो रहा है..." />
                        </>
                      ) : (
                        <>
                          <Icon name="bolt" size={16} />
                          <T gu="હમણાં ફરી લિંક કરો" en="Sync & Retry Now" hi="अभी पुनः लिंक करें" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentShell>
  );
}
