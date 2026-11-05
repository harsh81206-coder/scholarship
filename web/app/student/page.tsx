"use client";

import { useState } from "react";
import Link from "next/link";
import { StudentShell } from "@/components/shell/StudentShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { Avatar } from "@/components/ui";
import { useAppStore } from "@/lib/store";

export default function StudentDashboardPage() {
  const unreadCount = useAppStore((s) => s.unreadCount);
  const [copiedCts, setCopiedCts] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [showWhyModal, setShowWhyModal] = useState(false);

  const handleCopyCts = () => {
    navigator.clipboard?.writeText("GJ-AND-2026-004512");
    setCopiedCts(true);
    setTimeout(() => setCopiedCts(false), 2000);
  };

  const handleCopyOtp = () => {
    navigator.clipboard?.writeText("482913");
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  return (
    <StudentShell>
      <div className="px-4 py-3 space-y-4 max-w-[430px] mx-auto pb-24 relative">
        {/* 1. Greeting & Profile Strip Card */}
        <section className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant shadow-level-1 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar name="Riya Patel" size="md" className="ring-2 ring-primary/20 shadow-sm" />
                <span className="absolute -bottom-0.5 -right-0.5 bg-emerald-600 text-white rounded-full p-0.5 border border-surface flex items-center justify-center">
                  <Icon name="check" size={10} className="font-bold text-white" />
                </span>
              </div>
              <div className="min-w-0">
                <h1 className="font-title-md text-title-md text-on-surface leading-tight">
                  <T gu="નમસ્તે, રિયા પટેલ 👋" en="Namaste, Riya Patel 👋" hi="नमस्ते, रिया पटेल 👋" />
                </h1>
                <p className="font-caption text-caption text-on-surface-variant truncate">
                  <T gu="શ્રી સરદાર પટેલ હાઇસ્કૂલ, આણંદ" en="Shree Sardar Patel High School, Anand" hi="श्री सरदार पटेल हाई स्कूल, आणंद" />
                </p>
              </div>
            </div>
          </div>

          {/* Badges & CTS ID */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-emerald-200">
              <Icon name="verified" size={13} fill className="text-emerald-700" />
              <T gu="GSRDA માન્ય ✓" en="GSRDA Verified ✓" hi="GSRDA सत्यापित ✓" />
            </span>
            <span className="text-[11px] font-medium text-on-surface-variant bg-surface-container-high px-2.5 py-0.5 rounded-full">
              <T gu="ધોરણ ૯-બી" en="Class 9-B" hi="कक्षा 9-बी" />
            </span>
            <div className="inline-flex items-center gap-1 bg-surface-container-low px-2 py-0.5 rounded-full text-[11px] text-on-surface-variant font-mono">
              <span>GJ-AND-2026-004512</span>
              <button
                type="button"
                onClick={handleCopyCts}
                aria-label="Copy CTS ID"
                className="text-primary hover:text-primary-container p-0.5 transition-colors"
                title="Copy CTS ID"
              >
                <Icon name={copiedCts ? "check" : "content_copy"} size={13} />
              </button>
            </div>
            {copiedCts && (
              <span className="text-[10px] text-emerald-600 font-semibold animate-fade-in">
                <T gu="કોપી થઈ ગયું!" en="Copied!" hi="कॉपी हो गया!" />
              </span>
            )}
          </div>

          {/* Profile Completion Progress */}
          <div className="pt-2 border-t border-outline-variant">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-on-surface">
                <T gu="પ્રોફાઇલ પૂર્ણતા (Profile Status)" en="Profile Completion Status" hi="प्रोफ़ाइल पूर्णता स्थिति" />
              </span>
              <span className="font-semibold text-primary">
                <T gu="૯૨% પૂર્ણ" en="92% Complete" hi="92% पूर्ण" />
              </span>
            </div>
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary to-primary-container h-full rounded-full transition-all duration-500"
                style={{ width: "92%" }}
              />
            </div>
          </div>
        </section>

        {/* 2. KPI Summary Chips */}
        <section className="grid grid-cols-4 gap-2">
          <div className="bg-surface-container-lowest rounded-xl p-2.5 border border-outline-variant text-center shadow-xs">
            <p className="font-headline-sm text-primary font-bold leading-tight">4</p>
            <p className="text-[10px] text-on-surface-variant font-medium mt-0.5 leading-tight">
              <T gu="પાત્ર યોજના" en="Eligible" hi="पात्र" />
            </p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-2.5 border border-outline-variant text-center shadow-xs">
            <p className="font-headline-sm text-secondary font-bold leading-tight">1</p>
            <p className="text-[10px] text-on-surface-variant font-medium mt-0.5 leading-tight">
              <T gu="અરજી કરેલ" en="Applied" hi="आवेदन" />
            </p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-2.5 border border-outline-variant text-center shadow-xs">
            <p className="font-headline-sm text-emerald-600 font-bold leading-tight">1</p>
            <p className="text-[10px] text-on-surface-variant font-medium mt-0.5 leading-tight">
              <T gu="મંજૂર થયેલ" en="Approved" hi="स्वीकृत" />
            </p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-2.5 border border-outline-variant text-center shadow-xs">
            <p className="font-headline-sm text-primary font-bold leading-tight">₹25k</p>
            <p className="text-[10px] text-on-surface-variant font-medium mt-0.5 leading-tight">
              <T gu="વાર્ષિક સહાય" en="DBT Aid" hi="वार्षिक सहायता" />
            </p>
          </div>
        </section>

        {/* 3. Hero Card (Trust Blue with Saffron Accents) */}
        <section className="rounded-2xl p-4 bg-gradient-to-br from-[#1d4ed8] via-[#1a44c2] to-[#122e8a] text-white shadow-level-2 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-secondary/20 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-2.5">
            <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-medium w-fit text-primary-fixed">
              <Icon name="auto_awesome" size={15} className="text-secondary-fixed" />
              <T gu="આટોમેટિક પાત્રતા ચકાસાયેલ" en="Auto-verified Eligibility" hi="स्वचालित पात्रता सत्यापित" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                <T
                  gu="તમે ૪ સરકારી યોજનાઓ માટે પાત્ર છો!"
                  en="You are eligible for 4 government schemes!"
                  hi="आप 4 सरकारी योजनाओं के लिए पात्र हैं!"
                />
              </h2>
              <p className="text-xs text-on-primary-container mt-1 font-medium">
                <T gu="અંદાજિત વાર્ષિક લાભ: " en="Estimated annual benefit: " hi="अनुमानित वार्षिक लाभ: " />
                <span className="text-secondary-fixed font-bold text-sm">
                  <T gu="₹ ૨૫,૦૦૦" en="₹ 25,000" hi="₹ 25,000" />
                </span>
                {" + "}
                <T gu="મફત સાયકલ" en="Free Cycle" hi="मुफ़्त साइकिल" />
              </p>
            </div>

            {/* Saffron CTA */}
            <Link
              href="/student/apply"
              className="w-full mt-1.5 py-2.5 px-3 bg-gradient-to-r from-secondary to-[#e05b02] hover:brightness-110 active:scale-[0.99] text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-secondary/30 transition-all"
            >
              <span>
                <T
                  gu="બધી યોજનાઓમાં એકસાથે અરજી કરો (૧-ક્લિક Apply)"
                  en="Apply to All Eligible Schemes (1-Click Apply)"
                  hi="सभी योजनाओं में एक साथ आवेदन करें (1-क्लिक)"
                />
              </span>
              <Icon name="bolt" size={16} />
            </Link>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-white/80 pt-1">
              <Icon name="lock" size={12} className="text-emerald-300" />
              <span>
                <T
                  gu="DPDP Act ૨૦૨૩ હેઠળ ૧૦૦% સુરક્ષિત ડેટા"
                  en="100% data secure under DPDP Act 2023"
                  hi="DPDP Act 2023 के तहत 100% सुरक्षित डेटा"
                />
              </span>
            </div>
          </div>
        </section>

        {/* 4. Quick Action Grid Buttons */}
        <section className="grid grid-cols-3 gap-2.5">
          <Link
            href="/student/vault"
            className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant hover:border-primary/50 hover:shadow-level-1 transition-all flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-white transition-colors">
              <Icon name="folder_shared" size={20} />
            </div>
            <span className="font-label-md text-xs font-semibold text-on-surface leading-tight">
              <T gu="દસ્તાવેજ વૉલ્ટ" en="Doc Vault" hi="दस्तावेज़ वॉल्ट" />
            </span>
            <span className="text-[10px] text-amber-700 font-medium mt-0.5">
              <T gu="૧ બાકી" en="1 Pending" hi="1 बाकी" />
            </span>
          </Link>

          <Link
            href="/student/applications"
            className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant hover:border-primary/50 hover:shadow-level-1 transition-all flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-2 group-hover:bg-secondary group-hover:text-white transition-colors">
              <Icon name="timeline" size={20} />
            </div>
            <span className="font-label-md text-xs font-semibold text-on-surface leading-tight">
              <T gu="અરજી ટ્રેકર" en="Track Apps" hi="आवेदन ट्रैकर" />
            </span>
            <span className="text-[10px] text-emerald-700 font-medium mt-0.5">
              <T gu="૧ સક્રિય" en="1 Active" hi="1 सक्रिय" />
            </span>
          </Link>

          <Link
            href="/student/payments"
            className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant hover:border-primary/50 hover:shadow-level-1 transition-all flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Icon name="payments" size={20} />
            </div>
            <span className="font-label-md text-xs font-semibold text-on-surface leading-tight">
              <T gu="DBT ચૂકવણી" en="Payments" hi="DBT भुगतान" />
            </span>
            <span className="text-[10px] text-on-surface-variant font-medium mt-0.5">
              <T gu="ઈ-રૂપી / DBT" en="Direct Benefit" hi="प्रत्यक्ष लाभ" />
            </span>
          </Link>
        </section>

        {/* 5. Action Needed Alert (Warm Amber Card) */}
        <section className="bg-amber-50/90 border border-amber-300 rounded-2xl p-3.5 shadow-xs">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <Icon name="warning" size={18} className="text-amber-800" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-bold text-amber-950">
                <T
                  gu="તાત્કાલિક જરૂરી પગલાં: આવકનો દાખલો અપલોડ કરો"
                  en="Action Needed: Upload Income Certificate"
                  hi="आवश्यक कार्रवाई: आय प्रमाण पत्र अपलोड करें"
                />
              </h3>
              <p className="text-[11px] text-amber-900 mt-1 leading-relaxed">
                <T
                  gu="તમારો નવો આવક દાખલો અપલોડ કરવાથી ઓબીસી કેટેગરી યોજના અનલોક થશે અને ₹ ૬,૦૦૦ સીધા બેંકમાં જમા થશે."
                  en="Uploading your latest income certificate unlocks the OBC Category Pre-Matric Scholarship and transfers ₹ 6,000 directly to your bank account."
                  hi="अपना नया आय प्रमाण पत्र अपलोड करने से ओबीसी श्रेणी छात्रवृत्ति अनलॉक होगी और ₹ 6,000 सीधे बैंक में जमा होंगे।"
                />
              </p>
              <Link
                href="/student/vault"
                className="mt-2 text-xs font-semibold text-secondary hover:text-on-secondary-fixed inline-flex items-center gap-1 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                <span>
                  <T gu="દસ્તાવેજ અપલોડ કરો" en="Upload Document" hi="दस्तावेज़ अपलोड करें" />
                </span>
                <Icon name="arrow_forward" size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* 6. Cycle Delivery Mini Card */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-3.5 shadow-xs">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-sm">
                <Icon name="pedal_bike" size={20} className="text-white" />
              </div>
              <div>
                <span className="inline-flex items-center text-[10px] uppercase font-bold text-primary tracking-wide">
                  <T gu="તૈયાર છે • READY FOR PICKUP" en="READY FOR PICKUP" hi="तैयार है • पिकअप के लिए तैयार" />
                </span>
                <h3 className="text-xs font-bold text-on-surface">
                  <T gu="સાયકલ શાળામાં પહોંચી ગઈ છે!" en="Bicycle has arrived at school!" hi="साइकिल स्कूल पहुंच गई है!" />
                </h3>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-300">
              <T gu="ઓન-સાઇટ" en="On-Site" hi="ऑन-साइट" />
            </span>
          </div>

          <p className="text-[11px] text-on-surface-variant mt-2 leading-relaxed">
            <T
              gu="વર્ગ શિક્ષક પાસે ડિલિવરી સમયે નીચેનો વેરિફિકેશન OTP રજૂ કરો:"
              en="Show the verification OTP below to your class teacher during bicycle handover:"
              hi="साइकिल हस्तांतरण के समय अपने कक्षा शिक्षक को नीचे दिया गया सत्यापन OTP दिखाएं:"
            />
          </p>

          <div className="mt-2 flex items-center justify-between bg-white rounded-xl p-2.5 border border-blue-100">
            <div>
              <span className="text-[10px] text-on-surface-variant block">
                <T gu="ડિલિવરી OTP (માન્યતા ૧૦ મિનિટ)" en="Delivery OTP (Valid 10 mins)" hi="वितरण OTP (वैधता 10 मिनट)" />
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold font-mono tracking-widest text-primary">482913</span>
                <button
                  type="button"
                  onClick={handleCopyOtp}
                  className="text-on-surface-variant hover:text-primary transition-colors p-0.5"
                  title="Copy OTP"
                  aria-label="Copy OTP"
                >
                  <Icon name={copiedOtp ? "check" : "content_copy"} size={13} />
                </button>
                {copiedOtp && (
                  <span className="text-[9px] text-emerald-600 font-bold">
                    <T gu="કોપી!" en="Copied!" hi="कॉपी!" />
                  </span>
                )}
              </div>
            </div>

            <Link
              href="/student/cycle"
              className="px-2.5 py-1.5 bg-primary text-white text-[11px] font-semibold rounded-lg hover:bg-primary-container flex items-center gap-1 transition-colors shadow-xs"
            >
              <Icon name="qr_code_2" size={14} className="text-white" />
              <span>
                <T gu="QR રસીદ" en="QR Receipt" hi="QR रसीद" />
              </span>
            </Link>
          </div>
        </section>

        {/* 7. Live Application Tracker */}
        <section className="bg-surface-container-lowest rounded-2xl p-3.5 border border-outline-variant shadow-level-1 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wide">
                <T gu="લાઇવ અરજી ટ્રેકર" en="Live Application Tracker" hi="लाइव आवेदन ट्रैकर" />
              </h3>
              <p className="text-[11px] font-medium text-on-surface-variant">
                <T
                  gu="સરસ્વતી સાધના સાયકલ યોજના (#APP-2026-00871)"
                  en="Saraswati Sadhna Cycle Scheme (#APP-2026-00871)"
                  hi="सरस्वती साधना साइकिल योजना (#APP-2026-00871)"
                />
              </p>
            </div>
            <Link href="/student/applications" className="text-xs text-primary font-semibold hover:underline">
              <T gu="વિગત જુઓ" en="View Details" hi="विवरण देखें" />
            </Link>
          </div>

          {/* Compact 6-step progress stepper */}
          <div className="grid grid-cols-6 gap-1 pt-1 pb-1">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-bold shadow-xs">
                <Icon name="check" size={13} className="text-white" />
              </div>
              <span className="text-[9px] font-medium text-emerald-800 mt-1 leading-tight">
                <T gu="સબમિટ" en="Submit" hi="सबमिट" />
              </span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-bold shadow-xs">
                <Icon name="check" size={13} className="text-white" />
              </div>
              <span className="text-[9px] font-medium text-emerald-800 mt-1 leading-tight">
                <T gu="શાળા ચકાસણી" en="School Verify" hi="स्कूल सत्यापन" />
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-bold shadow-xs">
                <Icon name="check" size={13} className="text-white" />
              </div>
              <span className="text-[9px] font-medium text-emerald-800 mt-1 leading-tight">
                <T gu="DEO મંજૂર" en="DEO Approved" hi="DEO स्वीकृत" />
              </span>
            </div>

            {/* Step 4 (Active) */}
            <div className="flex flex-col items-center text-center">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[11px] font-bold ring-2 ring-primary/30 animate-pulse">
                <Icon name="sync" size={13} className="text-white animate-spin" />
              </div>
              <span className="text-[9px] font-bold text-primary mt-1 leading-tight">
                <T gu="ડિસ્પેચ (શાળા)" en="Dispatched" hi="डिस्पैच" />
              </span>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col items-center text-center opacity-60">
              <div className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center text-[10px] font-semibold border border-outline-variant">
                5
              </div>
              <span className="text-[9px] text-on-surface-variant mt-1 leading-tight">
                <T gu="OTP વેરિફાઈ" en="OTP Verify" hi="OTP सत्यापन" />
              </span>
            </div>

            {/* Step 6 */}
            <div className="flex flex-col items-center text-center opacity-60">
              <div className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center text-[10px] font-semibold border border-outline-variant">
                6
              </div>
              <span className="text-[9px] text-on-surface-variant mt-1 leading-tight">
                <T gu="હસ્તાંતરણ" en="Handover" hi="हस्तांतरण" />
              </span>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-xl px-2.5 py-1.5 flex items-center gap-2 text-[11px] text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping shrink-0" />
            <span className="truncate">
              <T
                gu="તાજેતરનું અપડેટ: સાયકલ સ્કૂલ ગોડાઉન પહોંચી છે. (આજે 11:30 AM)"
                en="Latest update: Bicycle arrived at school warehouse. (Today 11:30 AM)"
                hi="नवीनतम अपडेट: साइकिल स्कूल गोदाम पहुंच गई है। (आज 11:30 AM)"
              />
            </span>
          </div>
        </section>

        {/* 8. Scheme Cards Stack */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-on-surface">
                <T gu="તમારી યોજનાઓ (Your Schemes)" en="Your Schemes" hi="आपकी योजनाएं" />
              </h3>
              <p className="text-[11px] text-on-surface-variant">
                <T
                  gu="તમારી પાત્રતા મુજબ પસંદગી કરેલ યોજનાઓ"
                  en="Curated schemes based on your eligibility"
                  hi="आपकी पात्रता के आधार पर चयनित योजनाएं"
                />
              </p>
            </div>
            <Link href="/student/schemes/list" className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5">
              <span>
                <T gu="બધી જુઓ" en="View All" hi="सभी देखें" />
              </span>
              <Icon name="chevron_right" size={14} />
            </Link>
          </div>

          <div className="space-y-2.5">
            {/* Card 1: Namo Lakshmi */}
            <div className="bg-surface-container-lowest rounded-2xl p-3.5 border border-outline-variant hover:border-primary/40 transition-all shadow-xs">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <Icon name="check_circle" size={12} fill className="text-emerald-800" />
                      <T gu="પાત્ર (Eligible) ✓" en="Eligible ✓" hi="पात्र ✓" />
                    </span>
                    <span className="text-[10px] text-on-surface-variant bg-surface-container-high px-1.5 py-0.5 rounded">
                      <T gu="માસિક સહાય" en="Monthly Aid" hi="मासिक सहायता" />
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-on-surface truncate">
                    <T
                      gu="નમો લક્ષ્મી યોજના (Namo Lakshmi)"
                      en="Namo Lakshmi Scheme"
                      hi="नमो लक्ष्मी योजना"
                    />
                  </h4>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    <T
                      gu="ધોરણ ૯ થી ૧૨ ની વિદ્યાર્થીનીઓ માટે શિષ્યવૃત્તિ"
                      en="Scholarship for girl students of Classes 9 to 12"
                      hi="कक्षा 9 से 12 की छात्राओं के लिए छात्रवृत्ति"
                    />
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-extrabold text-primary">
                    <T gu="₹ ૧૦,૦૦૦" en="₹ 10,000" hi="₹ 10,000" />
                  </span>
                  <span className="text-[10px] text-on-surface-variant block">
                    <T gu="પ્રતિ વર્ષ" en="Per year" hi="प्रति वर्ष" />
                  </span>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-surface-container-low flex items-center justify-between">
                <span className="text-[10px] text-emerald-700 font-medium">
                  <T gu="સંપૂર્ણ દસ્તાવેજો ઉપલબ્ધ છે" en="All documents available in vault" hi="सभी दस्तावेज़ उपलब्ध हैं" />
                </span>
                <Link
                  href="/student/apply"
                  className="text-xs font-semibold text-primary hover:text-primary-container inline-flex items-center gap-0.5"
                >
                  <span>
                    <T gu="અરજી કરો" en="Apply Now" hi="आवेदन करें" />
                  </span>
                  <Icon name="arrow_forward" size={14} />
                </Link>
              </div>
            </div>

            {/* Card 2: Saraswati Sadhna Cycle */}
            <div className="bg-surface-container-lowest rounded-2xl p-3.5 border border-outline-variant hover:border-primary/40 transition-all shadow-xs">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-primary">
                      <Icon name="hourglass_top" size={12} className="text-primary" />
                      <T gu="અરજી કરેલ (Applied)" en="Applied" hi="आवेदन किया" />
                    </span>
                    <span className="text-[10px] text-on-surface-variant bg-surface-container-high px-1.5 py-0.5 rounded">
                      <T gu="મફત સાયકલ" en="Free Cycle" hi="मुफ़्त साइकिल" />
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-on-surface truncate">
                    <T
                      gu="સરસ્વતી સાધના સાયકલ યોજના"
                      en="Saraswati Sadhna Cycle Scheme"
                      hi="सरस्वती साधना साइकिल योजना"
                    />
                  </h4>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    <T
                      gu="Atlas 22T ગર્લ્સ સાયકલ • શાળા પહોંચી ગઈ"
                      en="Atlas 22T Girls Cycle • Arrived at school"
                      hi="Atlas 22T गर्ल्स साइकिल • स्कूल पहुंच गई"
                    />
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-extrabold text-emerald-700">
                    <T gu="મંજૂર (Approved)" en="Approved" hi="स्वीकृत" />
                  </span>
                  <span className="text-[10px] text-on-surface-variant block">#APP-2026-00871</span>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-surface-container-low flex items-center justify-between">
                <span className="text-[10px] text-primary font-medium">
                  <T gu="ડિલિવરી પ્રક્રિયા ચાલુ" en="Delivery process in progress" hi="वितरण प्रक्रिया जारी" />
                </span>
                <Link
                  href="/student/cycle"
                  className="text-xs font-semibold text-primary hover:text-primary-container inline-flex items-center gap-0.5"
                >
                  <span>
                    <T gu="ટ્રેકિંગ જુઓ" en="View Tracking" hi="ट्रैकिंग देखें" />
                  </span>
                  <Icon name="arrow_forward" size={14} />
                </Link>
              </div>
            </div>

            {/* Card 3: OBC Category Scholarship */}
            <div className="bg-surface-container-lowest rounded-2xl p-3.5 border border-amber-200 hover:border-amber-400 transition-all shadow-xs">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                      <Icon name="pending_actions" size={12} className="text-amber-900" />
                      <T gu="દસ્તાવેજ જરૂરી (Needs Doc)" en="Needs Document" hi="दस्तावेज़ आवश्यक" />
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-on-surface truncate">
                    <T
                      gu="ઓબીસી કેટેગરી પ્રિ-મેટ્રિક સ્કોલરશિપ"
                      en="OBC Pre-Matric Scholarship"
                      hi="ओबीसी प्री-मैट्रिक छात्रवृत्ति"
                    />
                  </h4>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    <T
                      gu="આવક પ્રમાણપત્ર અપલોડ કરવું જરૂરી છે"
                      en="Income certificate needs to be uploaded"
                      hi="आय प्रमाण पत्र अपलोड करना आवश्यक है"
                    />
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-extrabold text-primary">
                    <T gu="₹ ૬,૦૦૦" en="₹ 6,000" hi="₹ 6,000" />
                  </span>
                  <span className="text-[10px] text-on-surface-variant block">
                    <T gu="સંભવિત સહાય" en="Potential Aid" hi="संभावित सहायता" />
                  </span>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-surface-container-low flex items-center justify-between">
                <span className="text-[10px] text-amber-800 font-medium">
                  <T gu="બાકી દસ્તાવેજ: ૧" en="Pending docs: 1" hi="बाकी दस्तावेज़: 1" />
                </span>
                <Link
                  href="/student/vault"
                  className="text-xs font-semibold text-secondary hover:text-on-secondary-fixed inline-flex items-center gap-0.5"
                >
                  <span>
                    <T gu="અપલોડ કરો" en="Upload Now" hi="अपलोड करें" />
                  </span>
                  <Icon name="upload_file" size={14} />
                </Link>
              </div>
            </div>

            {/* Card 4: National Merit (NMMS) */}
            <div className="bg-surface-container-lowest rounded-2xl p-3.5 border border-outline-variant opacity-85 hover:opacity-100 transition-all shadow-xs">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-container-high text-on-surface-variant">
                      <Icon name="block" size={12} className="text-on-surface-variant" />
                      <T gu="હાલમાં અપાત્ર (Not Eligible)" en="Currently Not Eligible" hi="वर्तमान में अपात्र" />
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-on-surface truncate">
                    <T
                      gu="નેશનલ મેરિટ સ્કોલરશિપ (NMMS)"
                      en="National Means-cum-Merit Scholarship (NMMS)"
                      hi="नेशनल मेरिट स्कॉलरशिप (NMMS)"
                    />
                  </h4>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    <T
                      gu="પરીક્ષા પરિણામ વેરિફિકેશન બાકી છે"
                      en="Class 8 exam score verification pending"
                      hi="कक्षा 8 परीक्षा परिणाम सत्यापन लंबित है"
                    />
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-on-surface-variant">
                    <T gu="₹ ૧૨,૦૦૦" en="₹ 12,000" hi="₹ 12,000" />
                  </span>
                  <span className="text-[10px] text-on-surface-variant block">
                    <T gu="વાર્ષિક" en="Annually" hi="वार्षिक" />
                  </span>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-surface-container-low flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowWhyModal(true)}
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
                >
                  <span>
                    <T gu="કારણ જુઓ (See why)" en="See Reason" hi="कारण देखें" />
                  </span>
                  <Icon name="help_outline" size={13} />
                </button>
                <span className="text-[10px] text-on-surface-variant">
                  <T gu="ધોરણ ૮ મેરિટ કટ-ઓફ: ૭૦%" en="Class 8 Cut-off: 70%" hi="कक्षा 8 कट-ऑफ: 70%" />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Recent Activity & Notification Preview */}
        <section className="bg-surface-container-lowest rounded-2xl p-3.5 border border-outline-variant shadow-level-1 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-on-surface uppercase tracking-wide">
              <T gu="તાજેતરની પ્રવૃત્તિ" en="Recent Activity" hi="हाल की गतिविधि" />
            </h3>
            <Link href="/student/notifications" className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
              <T gu="બધી જુઓ" en="View All" hi="सभी देखें" />
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-secondary text-on-secondary text-[9px] font-bold leading-none">
                  {unreadCount}
                </span>
              )}
            </Link>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-surface-container-low">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Icon name="pedal_bike" size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-on-surface leading-tight">
                  <T gu="સાયકલ શાળામાં ડિલિવર થઈ" en="Bicycle delivered to school" hi="साइकिल स्कूल में डिलीवर हुई" />
                </p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">
                  <T
                    gu="સરસ્વતી સાધના યોજના હેઠળ Atlas 22T સાયકલ તૈયાર છે."
                    en="Atlas 22T cycle ready under Saraswati Sadhna Scheme."
                    hi="सरस्वती साधना योजना के तहत साइकिल तैयार है।"
                  />
                </p>
              </div>
              <span className="text-[9px] text-on-surface-variant shrink-0">
                <T gu="૨ કલાક પહેલાં" en="2h ago" hi="2 घंटे पहले" />
              </span>
            </div>

            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-surface-container-low">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <Icon name="verified_user" size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-on-surface leading-tight">
                  <T gu="GSRDA આધાર ચકાસણી પૂર્ણ" en="GSRDA Aadhaar KYC Verified" hi="GSRDA आधार सत्यापन पूर्ण" />
                </p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">
                  <T
                    gu="નમો લક્ષ્મી યોજના માટે ડેટા ઓટો-પ્રમાણિત થયો."
                    en="Data auto-verified for Namo Lakshmi Scheme."
                    hi="नमो लक्ष्मी योजना के लिए डेटा सत्यापित हुआ।"
                  />
                </p>
              </div>
              <span className="text-[9px] text-on-surface-variant shrink-0">
                <T gu="ગઈકાલે" en="Yesterday" hi="कल" />
              </span>
            </div>
          </div>
        </section>

        {/* 10. Floating AI Help Button (Vidya Mitra AI) */}
        <div className="fixed bottom-20 right-4 z-40 md:right-[max(1rem,calc(50%-215px+1rem))]">
          <Link
            href="/student/assistant"
            aria-label="Vidya Mitra AI Assistant"
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-white pl-3 pr-3.5 py-2.5 rounded-full shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all group"
          >
            <div className="relative">
              <Icon name="smart_toy" size={20} className="text-white" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold leading-tight">
                <T gu="વિદ્યા મિત્ર AI" en="Vidya Mitra AI" hi="विद्या मित्र AI" />
              </span>
              <span className="text-[9px] text-white/80 leading-none">
                <T gu="સહાયક • AI Help" en="Student Assistant" hi="AI सहायक" />
              </span>
            </div>
          </Link>
        </div>

        {/* NMMS Eligibility Details Modal */}
        {showWhyModal && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in"
            onClick={() => setShowWhyModal(false)}
          >
            <div
              className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-4 border border-outline-variant shadow-level-3 space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Icon name="info" size={18} />
                  </div>
                  <h4 className="font-title-md text-sm font-bold text-on-surface">
                    <T gu="પાત્રતા વિગતો (NMMS)" en="Eligibility Details (NMMS)" hi="पात्रता विवरण (NMMS)" />
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowWhyModal(false)}
                  className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors"
                >
                  <Icon name="close" size={18} />
                </button>
              </div>

              <div className="space-y-2 text-xs text-on-surface-variant leading-relaxed">
                <p>
                  <strong className="text-on-surface">
                    <T gu="યોજના:" en="Scheme:" hi="योजना:" />
                  </strong>{" "}
                  <T
                    gu="નેશનલ મીન્સ-કમ-મેરિટ સ્કોલરશિપ (NMMS)"
                    en="National Means-cum-Merit Scholarship (NMMS)"
                    hi="नेशनल मीन्स-कम-मेरिट स्कॉलरशिप (NMMS)"
                  />
                </p>
                <p>
                  <strong className="text-on-surface">
                    <T gu="શરત:" en="Requirement:" hi="शर्त:" />
                  </strong>{" "}
                  <T
                    gu="ધોરણ ૮ NMMS રાજ્ય સ્તરની પરીક્ષામાં લઘુત્તમ ૭૦% ગુણ જરૂરી છે."
                    en="Minimum 70% marks required in Class 8 NMMS state examination."
                    hi="कक्षा 8 NMMS राज्य स्तरीय परीक्षा में न्यूनतम 70% अंक आवश्यक हैं।"
                  />
                </p>
                <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant">
                  <p className="font-medium text-on-surface">
                    <T
                      gu="હાલની સ્થિતિ: SEB (રાજ્ય પરીક્ષા બોર્ડ) તરફથી ગુણ વેરિફિકેશન પ્રક્રિયામાં છે."
                      en="Current Status: Marks verification in progress from SEB (State Examination Board)."
                      hi="वर्तमान स्थिति: राज्य परीक्षा बोर्ड (SEB) से अंक सत्यापन प्रक्रिया में है।"
                    />
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowWhyModal(false)}
                  className="btn-primary px-4 py-1.5 h-9 rounded-lg text-xs"
                >
                  <T gu="સમજાયું" en="Got it" hi="समझ गया" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentShell>
  );
}
