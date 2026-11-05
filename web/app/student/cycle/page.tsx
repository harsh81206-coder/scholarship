"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { StudentShell } from "@/components/shell/StudentShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { Avatar } from "@/components/ui";

export default function StudentCycleDeliveryPage() {
    const [otp, setOtp] = useState("482913");
  const [timeLeft, setTimeLeft] = useState(525); // 8 minutes 45 seconds
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [copiedSerial, setCopiedSerial] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [handoverConfirmed, setHandoverConfirmed] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Timer countdown simulator
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    const enStr = `${pad(mins)}:${pad(secs)}`;

    const toGuDigits = (str: string) => {
      const guDigits = ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"];
      return str.replace(/[0-9]/g, (d) => guDigits[parseInt(d, 10)] ?? d);
    };

    return {
      en: enStr,
      gu: toGuDigits(enStr),
    };
  };

  const handleRefreshOtp = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setOtp(randomOtp);
      setTimeLeft(600); // 10 minutes reset
      setIsRefreshing(false);
    }, 600);
  };

  const handleCopyOtp = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(otp);
    }
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const handleCopySerial = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("SSB-2026-077432");
    }
    setCopiedSerial(true);
    setTimeout(() => setCopiedSerial(false), 2000);
  };

  const handleDownloadReceipt = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const timeFormatted = formatTime(timeLeft);
  const otpDigits = otp.split("");

  return (
    <StudentShell>
      <div className="flex flex-col w-full pb-20">
        {/* Top Navigation & Scheme Sub-Header */}
        <div className="px-4 py-3 bg-surface-container-low border-b border-outline-variant/60 shadow-sm">
          <div className="flex items-center gap-3 mb-1.5">
            <Link
              href="/student"
              aria-label="Back to dashboard"
              className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high text-primary flex items-center justify-center transition-colors shadow-sm shrink-0"
            >
              <Icon name="arrow_back" size={20} />
            </Link>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-label-md text-label-md text-secondary font-bold">
                  <T
                    gu="સરસ્વતી સાધના યોજના"
                    en="Saraswati Sadhna Yojana"
                    hi="सरस्वती साधना योजना"
                  />
                </span>
                <span className="text-outline-variant text-[10px]">•</span>
                <span className="font-caption text-caption text-on-surface-variant">
                  <T
                    gu="સાઇકલ વિતરણ ટ્રેકર"
                    en="Cycle Delivery Tracker"
                    hi="साइकिल वितरण ट्रैकर"
                  />
                </span>
              </div>
              <h1 className="font-title-lg text-title-lg text-on-surface font-bold leading-tight truncate">
                <T
                  gu="મારી સાઇકલ | સાઇકલ સોંપણી"
                  en="My Bicycle | Delivery Handover"
                  hi="मेरी साइकिल | सुपुर्दगी ट्रैकर"
                />
              </h1>
            </div>
          </div>
          <p className="font-caption text-caption text-on-surface-variant pl-12 leading-snug">
            <T
              gu="વિદ્યાર્થી સાઇકલ વેરિફિકેશન અને સુરક્ષિત OTP ડિલિવરી પોર્ટલ"
              en="Student cycle verification & secure OTP delivery portal"
              hi="छात्र साइकिल सत्यापन एवं सुरक्षित OTP वितरण पोर्टल"
            />
          </p>
        </div>

        {/* Content Container */}
        <div className="px-4 py-4 flex flex-col gap-4 max-w-[430px] mx-auto w-full">
          {/* 1. Student & Vehicle Identification Card */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-md border border-outline-variant/60">
            <div className="flex items-start gap-3">
              <div className="relative shrink-0">
                <Avatar name="Riya Patel" size="lg" className="shadow-sm ring-2 ring-primary/20" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm">
                  <Icon name="pedal_bike" size={13} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-title-md text-title-md text-on-surface font-bold truncate">
                    <T gu="રિયા પટેલ" en="Riya Patel" hi="रिया पटेल" />
                  </span>
                  <span className="bg-surface-container text-primary font-label-md text-label-md px-2 py-0.5 rounded-full shrink-0 font-medium">
                    <T gu="ધોરણ ૯-બી" en="Class 9-B" hi="कक्षा 9-बी" />
                  </span>
                </div>
                <p className="font-caption text-caption text-on-surface-variant truncate mt-0.5">
                  <T
                    gu="રિયા પટેલ • ધોરણ ૯-બી"
                    en="Riya Patel • Class 9-B"
                    hi="रिया पटेल • कक्षा 9-बी"
                  />
                </p>
                <div className="flex items-center gap-1.5 mt-1.5 font-caption text-caption text-on-surface-variant">
                  <Icon name="badge" size={14} className="text-primary shrink-0" />
                  <span>CTS ID:</span>
                  <span className="font-mono font-semibold text-on-surface">GJ-AND-2026-004512</span>
                </div>
              </div>
            </div>

            {/* Sub-card details */}
            <div className="mt-3 pt-3 bg-surface-container-low rounded-lg p-3 flex flex-col gap-2 border border-outline-variant/40">
              <div className="flex items-center justify-between gap-2">
                <span className="font-caption text-caption text-on-surface-variant">
                  <T
                    gu="સાઇકલ સીરીયલ નંબર:"
                    en="Cycle Serial Number:"
                    hi="साइकिल सीरियल नंबर:"
                  />
                </span>
                <button
                  type="button"
                  onClick={handleCopySerial}
                  title="Click to copy serial number"
                  className="inline-flex items-center gap-1 font-label-md text-label-md font-mono bg-primary hover:bg-primary-container text-on-primary px-2.5 py-0.5 rounded shadow-sm transition-colors active:scale-95"
                >
                  <span>SSB-2026-077432</span>
                  <Icon name={copiedSerial ? "check" : "content_copy"} size={12} />
                </button>
              </div>

              <div className="flex items-center gap-2 text-on-surface">
                <Icon name="school" size={16} className="text-primary shrink-0" />
                <span className="font-caption text-caption font-medium truncate">
                  <T
                    gu="શ્રી સરદાર પટેલ હાઈસ્કૂલ, આણંદ"
                    en="Shree Sardar Patel High School, Anand"
                    hi="श्री सरदार पटेल हाई स्कूल, आणंद"
                  />
                </span>
              </div>

              <div className="flex items-center gap-2 text-on-surface-variant">
                <Icon name="precision_manufacturing" size={16} className="text-secondary shrink-0" />
                <span className="font-caption text-caption truncate">
                  <T
                    gu="એટલાસ ૨૨T / હીરો સાઇકલ્સ ગુજરાત બેચ #B-2026-0145"
                    en="Atlas 22T / Hero Cycles Gujarat Govt Batch #B-2026-0145"
                    hi="एटलस 22T / हीरो साइकिल्स गुजरात सरकार बैच #B-2026-0145"
                  />
                </span>
              </div>
            </div>
          </div>

          {/* 2. Main Handover OTP & QR Verification Card (Hero Focus) */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xl border border-outline-variant/60 overflow-hidden relative">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-sm">
                  <Icon name="verified_user" size={18} />
                </div>
                <div>
                  <h2 className="font-title-md text-title-md text-on-surface font-bold leading-tight">
                    <T
                      gu="સોંપણી OTP અને QR કોડ"
                      en="Handover OTP & QR Code"
                      hi="सुपुर्दगी OTP और QR कोड"
                    />
                  </h2>
                  <p className="font-caption text-caption text-on-surface-variant">
                    <T
                      gu="સુરક્ષિત સોંપણી ટોકન"
                      en="Secure Handover Token"
                      hi="सुरक्षित सुपुर्दगी टोकन"
                    />
                  </p>
                </div>
              </div>
              <span className="bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
                <T gu="સક્રિય" en="Active" hi="सक्रिय" />
              </span>
            </div>

            {/* Prominent OTP Display Area */}
            <div className="bg-surface-container-high rounded-xl p-4 text-center flex flex-col items-center justify-center shadow-inner my-3 border border-outline-variant/40">
              <span className="font-label-md text-label-md text-on-surface-variant mb-2 font-medium">
                <T
                  gu="આચાર્ય/શિક્ષકને દર્શાવવા માટેનો ૬-અંકનો OTP"
                  en="6-digit OTP to show to Principal/Teacher"
                  hi="प्रधानाचार्य/शिक्षक को दिखाने हेतु 6-अंकीय OTP"
                />
              </span>

              {/* Monospace 6-digit OTP Boxes */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 my-1">
                <span className="w-10 h-13 sm:w-11 sm:h-13 bg-surface-container-lowest text-primary font-display-mobile text-2xl sm:text-3xl font-mono font-bold rounded-lg flex items-center justify-center shadow-sm border border-outline-variant/70">
                  {otpDigits[0] ?? "4"}
                </span>
                <span className="w-10 h-13 sm:w-11 sm:h-13 bg-surface-container-lowest text-primary font-display-mobile text-2xl sm:text-3xl font-mono font-bold rounded-lg flex items-center justify-center shadow-sm border border-outline-variant/70">
                  {otpDigits[1] ?? "8"}
                </span>
                <span className="w-10 h-13 sm:w-11 sm:h-13 bg-surface-container-lowest text-primary font-display-mobile text-2xl sm:text-3xl font-mono font-bold rounded-lg flex items-center justify-center shadow-sm border border-outline-variant/70">
                  {otpDigits[2] ?? "2"}
                </span>
                <span className="w-2 text-on-surface-variant font-bold text-center">-</span>
                <span className="w-10 h-13 sm:w-11 sm:h-13 bg-surface-container-lowest text-primary font-display-mobile text-2xl sm:text-3xl font-mono font-bold rounded-lg flex items-center justify-center shadow-sm border border-outline-variant/70">
                  {otpDigits[3] ?? "9"}
                </span>
                <span className="w-10 h-13 sm:w-11 sm:h-13 bg-surface-container-lowest text-primary font-display-mobile text-2xl sm:text-3xl font-mono font-bold rounded-lg flex items-center justify-center shadow-sm border border-outline-variant/70">
                  {otpDigits[4] ?? "1"}
                </span>
                <span className="w-10 h-13 sm:w-11 sm:h-13 bg-surface-container-lowest text-primary font-display-mobile text-2xl sm:text-3xl font-mono font-bold rounded-lg flex items-center justify-center shadow-sm border border-outline-variant/70">
                  {otpDigits[5] ?? "3"}
                </span>
              </div>

              {/* Timer, Copy and Refresh Controls */}
              <div className="flex items-center justify-between w-full mt-3 pt-2 border-t border-outline-variant/40">
                <div className="flex items-center gap-1.5 text-secondary">
                  <Icon name="timer" size={16} />
                  <span className="font-caption text-caption font-bold">
                    <T
                      gu={`માન્યતા: ${timeFormatted.gu} મિનિટ બાકી`}
                      en={`Validity: ${timeFormatted.en} mins left`}
                      hi={`वैधता: ${timeFormatted.en} मिनट शेष`}
                    />
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyOtp}
                    className="flex items-center gap-1 text-on-surface hover:text-primary font-label-md text-xs font-semibold px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high transition-colors active:scale-95"
                  >
                    <Icon name={copiedOtp ? "check" : "content_copy"} size={14} />
                    <span>
                      {copiedOtp ? (
                        <T gu="કોપી થયું!" en="Copied!" hi="कॉपी हुआ!" />
                      ) : (
                        <T gu="કોપી કરો" en="Copy" hi="कॉपी" />
                      )}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRefreshOtp}
                    disabled={isRefreshing}
                    className="flex items-center gap-1 text-primary hover:text-primary-container font-label-md text-xs font-semibold px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high transition-transform active:scale-95 disabled:opacity-50"
                  >
                    <span className={isRefreshing ? "animate-spin" : ""}>
                      <Icon name="refresh" size={14} />
                    </span>
                    <span>
                      <T gu="નવો OTP" en="New OTP" hi="नया OTP" />
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="mt-3 flex items-center gap-3 p-3 bg-surface-container-low rounded-xl border border-outline-variant/40">
              <div className="bg-surface-container-lowest p-2 rounded-lg shadow-sm shrink-0 flex flex-col items-center border border-outline-variant/40">
                {/* Clean Inline Dynamic QR SVG Graphic */}
                <svg className="w-24 h-24 text-on-surface" fill="currentColor" viewBox="0 0 100 100">
                  <rect fill="#ffffff" height="100" rx="4" width="100" />
                  {/* Top-left finder */}
                  <path d="M6 6h28v28H6z M10 10v20h20V10z M14 14h12v12H14z" fill="#131b2e" />
                  {/* Top-right finder */}
                  <path d="M66 6h28v28H66z M70 10v20h20V10z M74 14h12v12H74z" fill="#131b2e" />
                  {/* Bottom-left finder */}
                  <path d="M6 66h28v28H6z M10 70v20h20V70z M14 74h12v12H14z" fill="#131b2e" />
                  {/* QR data modules */}
                  <rect fill="#131b2e" height="6" width="6" x="38" y="10" />
                  <rect fill="#1d4ed8" height="6" width="6" x="50" y="14" />
                  <rect fill="#131b2e" height="6" width="6" x="42" y="24" />
                  <rect fill="#131b2e" height="6" width="6" x="54" y="24" />
                  <rect fill="#131b2e" height="6" width="6" x="10" y="42" />
                  <rect fill="#1d4ed8" height="6" width="6" x="22" y="42" />
                  <rect fill="#131b2e" height="6" width="6" x="14" y="52" />
                  <rect fill="#131b2e" height="6" width="6" x="26" y="52" />
                  <rect fill="#fd761a" height="8" width="8" x="40" y="40" />
                  <rect fill="#131b2e" height="6" width="6" x="52" y="40" />
                  <rect fill="#131b2e" height="6" width="6" x="44" y="52" />
                  <rect fill="#1d4ed8" height="8" width="8" x="56" y="50" />
                  <rect fill="#131b2e" height="6" width="6" x="70" y="42" />
                  <rect fill="#131b2e" height="6" width="6" x="84" y="42" />
                  <rect fill="#131b2e" height="6" width="6" x="74" y="52" />
                  <rect fill="#131b2e" height="6" width="6" x="82" y="52" />
                  <rect fill="#131b2e" height="6" width="6" x="40" y="70" />
                  <rect fill="#131b2e" height="6" width="6" x="52" y="68" />
                  <rect fill="#131b2e" height="6" width="6" x="42" y="82" />
                  <rect fill="#131b2e" height="6" width="6" x="54" y="80" />
                  <rect fill="#1d4ed8" height="8" width="8" x="70" y="72" />
                  <rect fill="#131b2e" height="6" width="6" x="84" y="72" />
                  <rect fill="#131b2e" height="6" width="6" x="72" y="84" />
                  <rect fill="#fd761a" height="8" width="8" x="82" y="84" />
                </svg>
                <span className="font-caption text-[10px] text-on-surface-variant font-mono mt-1 font-semibold">
                  SSB-077432
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-primary">
                  <Icon name="qr_code_scanner" size={16} />
                  <span className="font-label-md text-label-md font-bold">
                    <T
                      gu="શિક્ષક દ્વારા સ્કેન થશે"
                      en="To be scanned by Teacher"
                      hi="शिक्षक द्वारा स्कैन किया जाएगा"
                    />
                  </span>
                </div>
                <p className="font-caption text-caption text-on-surface-variant mt-1 leading-snug">
                  <T
                    gu="શાળાના આચાર્યશ્રી અથવા નોડલ શિક્ષક સાઇકલ આપતી વખતે તમારા ફોનમાંથી આ QR કોડ સ્કેન કરશે."
                    en="School Principal or Nodal Teacher will scan this QR code from your phone during physical bicycle handover."
                    hi="साइकिल वितरण के समय स्कूल प्रधानाचार्य या नोडल शिक्षक आपके फोन से यह QR कोड स्कैन करेंगे।"
                  />
                </p>
                <div className="mt-2 inline-flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded text-[11px] font-medium text-on-surface border border-outline-variant/30">
                  <Icon name="bolt" size={13} className="text-secondary" />
                  <span>
                    <T
                      gu="ઇન્સ્ટન્ટ વેરિફિકેશન"
                      en="Instant Verification"
                      hi="त्वरित सत्यापन"
                    />
                  </span>
                </div>
              </div>
            </div>

            {/* Advisory note */}
            <div className="mt-3 pt-1 flex items-start gap-2">
              <Icon name="info" size={16} className="text-primary shrink-0 mt-0.5" />
              <p className="font-caption text-caption text-on-surface-variant leading-tight">
                <T
                  gu="શાળાના આચાર્ય અથવા નોડલ શિક્ષકને સાઇકલ આપતી વખતે જ આ કોડ બતાવો. (Share only during physical delivery inspection)."
                  en="Show this code to school principal or nodal teacher only during physical delivery inspection."
                  hi="साइकिल वितरण व भौतिक निरीक्षण के समय ही यह कोड स्कूल प्रधानाचार्य या शिक्षक को दिखाएं।"
                />
              </p>
            </div>
          </div>

          {/* 3. Safety Alert Box (Amber Theme) */}
          <div className="bg-amber-950 text-amber-100 dark:bg-amber-950 rounded-xl p-4 shadow-md flex items-start gap-3 border border-amber-800/60">
            <Icon name="gpp_maybe" size={24} className="text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-label-lg text-label-lg font-bold text-amber-200">
                <T
                  gu="મહત્વપૂર્ણ સુરક્ષા સૂચના (Security Advisory)"
                  en="Important Security Advisory"
                  hi="महत्वपूर्ण सुरक्षा सूचना (Security Advisory)"
                />
              </h3>
              <p className="font-caption text-caption text-amber-100/80 mt-1 leading-snug">
                <T
                  gu="સાવચેતી: આ OTP માત્ર શાળાના અધિકૃત શિક્ષક સાથે જ શેર કરવો. કોઈ અજાણી વ્યક્તિ, એજન્ટ કે બિન-અધિકૃત સંસ્થા સાથે ક્યારેય શેર કરવો નહીં."
                  en="Caution: Share this OTP only with authorized school teachers. Never share with strangers, middle-men or unauthorized agents."
                  hi="सावधानी: यह OTP केवल स्कूल के अधिकृत शिक्षक के साथ ही साझा करें। किसी अज्ञात व्यक्ति या अनधिकृत एजेंट के साथ साझा न करें।"
                />
              </p>
            </div>
          </div>

          {/* 4. 4-Step Delivery Progress Stepper */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-md border border-outline-variant/60">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-title-md text-title-md text-on-surface font-bold">
                  <T
                    gu="વિતરણ સ્થિતિ અને ટ્રેકર"
                    en="Delivery Status & Tracker"
                    hi="वितरण स्थिति एवं ट्रैकर"
                  />
                </h2>
                <p className="font-caption text-caption text-on-surface-variant">
                  <T
                    gu="૪-તબક્કાની સોંપણી પ્રક્રિયા"
                    en="4-Stage Handover Progress"
                    hi="4-चरणीय सुपुर्दगी प्रक्रिया"
                  />
                </p>
              </div>
              <span className="bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md px-2.5 py-0.5 rounded-full font-bold">
                <T gu="૩ / ૪ પૂરાં" en="3 of 4 Done" hi="3 / 4 पूर्ण" />
              </span>
            </div>

            {/* Stepper Chain */}
            <div className="relative pl-7 flex flex-col gap-4">
              {/* Connecting Line */}
              <div className="absolute left-3 top-3 bottom-4 w-0.5 bg-surface-container-highest" />

              {/* Step 1 (Completed) */}
              <div className="relative flex flex-col">
                <div className="absolute -left-7 top-0 w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm">
                  <Icon name="check" size={14} />
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-label-md text-label-md text-on-surface font-bold">
                    <T
                      gu="વિક્રેતા તરફથી રવાના (Dispatched)"
                      en="Dispatched from Vendor"
                      hi="विक्रेता से रवाना (Dispatched)"
                    />
                  </span>
                  <span className="font-caption text-[11px] text-on-surface-variant shrink-0">
                    <T gu="૦૮ ઑક્ટો • 10:30 AM" en="08 Oct • 10:30 AM" hi="08 अक्टूबर • 10:30 AM" />
                  </span>
                </div>
                <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                  <T
                    gu="Hero Cycles Gujarat Logistics Hub, વડોદરા"
                    en="Hero Cycles Gujarat Logistics Hub, Vadodara"
                    hi="हीरो साइकिल्स गुजरात लॉजिस्टिक्स हब, वडोदरा"
                  />
                </p>
              </div>

              {/* Step 2 (Completed) */}
              <div className="relative flex flex-col">
                <div className="absolute -left-7 top-0 w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm">
                  <Icon name="check" size={14} />
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-label-md text-label-md text-on-surface font-bold">
                    <T
                      gu="શાળામાં પ્રાપ્ત (Received at School)"
                      en="Received at School"
                      hi="स्कूल में प्राप्त (Received at School)"
                    />
                  </span>
                  <span className="font-caption text-[11px] text-on-surface-variant shrink-0">
                    <T gu="૧૪ ઑક્ટો • 02:15 PM" en="14 Oct • 02:15 PM" hi="14 अक्टूबर • 02:15 PM" />
                  </span>
                </div>
                <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                  <T
                    gu="તપાસણી પૂર્ણ • આચાર્ય ડૉ. કલ્પેશ શાહ દ્વારા વેરિફાઇડ"
                    en="Inspection Complete • Verified by Principal Dr. Kalpesh Shah"
                    hi="निरीक्षण पूर्ण • प्रधानाचार्य डॉ. कल्पेश शाह द्वारा सत्यापित"
                  />
                </p>
              </div>

              {/* Step 3 (Active / Current) */}
              <div className="relative flex flex-col bg-surface-container-low p-3 rounded-lg -ml-2 pl-4 border border-secondary/40 shadow-sm">
                <div className="absolute -left-5 top-2.5 w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center ring-4 ring-secondary-fixed shadow-sm">
                  <Icon name="local_shipping" size={14} />
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span className="font-label-md text-label-md text-secondary font-bold">
                    <T
                      gu="સોંપણી પેન્ડિંગ (Handover Ready)"
                      en="Handover Pending (Ready at School)"
                      hi="सुपुर्दगी लंबित (Handover Ready)"
                    />
                  </span>
                  <span className="bg-secondary text-on-secondary font-caption text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                    <T gu="આજે" en="TODAY" hi="आज" />
                  </span>
                </div>
                <p className="font-caption text-caption text-on-surface mt-1 font-medium">
                  <T
                    gu="આજે વિતરણ કાર્યક્રમ • રૂમ નં. ૪, પ્રાર્થના ખંડ"
                    en="Today's Distribution Event • Room No. 4, Assembly Hall"
                    hi="आज वितरण कार्यक्रम • कक्ष संख्या 4, प्रार्थना कक्ष"
                  />
                </p>
                <div className="mt-1 flex items-center gap-1 font-caption text-[11px] text-secondary font-medium">
                  <Icon name="alarm" size={13} />
                  <span>
                    <T
                      gu="સમય: બપોરે ૦૨:૩૦ થી ૦૪:૦૦ કલાકે"
                      en="Time: 02:30 PM to 04:00 PM"
                      hi="समय: दोपहर 02:30 से 04:00 बजे"
                    />
                  </span>
                </div>
                <div className="mt-1 text-on-surface-variant font-caption text-[11px]">
                  <T
                    gu="નોડલ શિક્ષક: આચાર્ય ડૉ. કલ્પેશ શાહ"
                    en="Nodal Teacher: Principal Dr. Kalpesh Shah"
                    hi="नोडल शिक्षक: प्रधानाचार्य डॉ. कल्पेश शाह"
                  />
                </div>
              </div>

              {/* Step 4 (Upcoming / Final Handover) */}
              <div className="relative flex flex-col opacity-80">
                <div className="absolute -left-7 top-0 w-6 h-6 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-caption font-bold text-xs">
                  {handoverConfirmed ? <Icon name="check" size={14} className="text-primary font-bold" /> : "૪"}
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    <T
                      gu="વિદ્યાર્થીને સોંપણી પૂર્ણ (Delivered)"
                      en="Delivered to Student"
                      hi="छात्र को सुपुर्दगी पूर्ण (Delivered)"
                    />
                  </span>
                  <span className="font-caption text-[11px] text-on-surface-variant shrink-0">
                    {handoverConfirmed ? (
                      <span className="text-success font-semibold">
                        <T gu="પૂર્ણ" en="Done" hi="पूर्ण" />
                      </span>
                    ) : (
                      <T gu="બાકી" en="Pending" hi="शेष" />
                    )}
                  </span>
                </div>
                <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                  <T
                    gu="OTP અને જિઓ-ટેગ ડિજિટલ પુરાવા પછી તાત્કાલિક પૂર્ણ થશે"
                    en="Will be marked delivered immediately after OTP & geo-tagged verification"
                    hi="OTP और जियो-टैग डिजिटल सत्यापन के बाद तत्काल पूर्ण होगा"
                  />
                </p>
              </div>
            </div>
          </div>

          {/* 5. School Pickup & Confirm Handover CTA Card */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-md border border-outline-variant/60">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Icon name="handshake" size={22} />
              </div>
              <div>
                <h3 className="font-title-md text-title-md text-on-surface font-bold leading-tight">
                  <T
                    gu="શાળા પિકઅપ અને સોંપણી પુષ્ટિ"
                    en="School Pickup & Handover Confirmation"
                    hi="स्कूल पिकअप एवं सुपुर्दगी पुष्टि"
                  />
                </h3>
                <p className="font-caption text-caption text-on-surface-variant">
                  <T
                    gu="આચાર્ય ડૉ. કલ્પેશ શાહ • શ્રી સરદાર પટેલ હાઈસ્કૂલ"
                    en="Principal Dr. Kalpesh Shah • Shree Sardar Patel High School"
                    hi="प्रधानाचार्य डॉ. कल्पेश शाह • श्री सरदार पटेल हाई स्कूल"
                  />
                </p>
              </div>
            </div>

            {handoverConfirmed ? (
              <div className="bg-success-container/40 border border-success/40 rounded-lg p-3 text-center flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-success text-on-success flex items-center justify-center mb-1">
                  <Icon name="check" size={18} />
                </div>
                <span className="font-title-sm text-title-sm text-on-success-container font-bold">
                  <T
                    gu="સાઇકલ સોંપણી સફળતાપૂર્વક ચકાસાયેલ છે!"
                    en="Cycle Handover Successfully Confirmed!"
                    hi="साइकिल सुपुर्दगी सफलतापूर्वक सत्यापित!"
                  />
                </span>
                <p className="font-caption text-caption text-on-surface-variant">
                  <T
                    gu="ડિજિટલ રસીદ જનરેટ થઈ ગઈ છે. નીચેથી ડાઉનલોડ કરો."
                    en="Digital receipt has been generated. Download it below."
                    hi="डिजिटल रसीद जनरेट हो गई है। नीचे से डाउनलोड करें।"
                  />
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <p className="font-caption text-caption text-on-surface-variant leading-snug">
                  <T
                    gu="તમે સાઇકલનું નિરીક્ષણ કરી લીધું હોય અને આચાર્ય ડૉ. કલ્પેશ શાહ સાથે હોવ ત્યારે જ પુષ્ટિ બટન દબાવો."
                    en="Please press confirm only when you have physically inspected your cycle with Principal Dr. Kalpesh Shah."
                    hi="साइकिल का भौतिक निरीक्षण करने और प्रधानाचार्य डॉ. कल्पेश शाह की उपस्थिति में ही पुष्टि करें।"
                  />
                </p>
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  className="btn-cta w-full h-12 flex items-center justify-center gap-2 rounded-xl text-white font-bold shadow-md transition-all active:scale-[0.99]"
                >
                  <Icon name="check_circle" size={20} />
                  <span>
                    <T
                      gu="સોંપણી પુષ્ટિ કરો (Confirm Handover)"
                      en="Confirm Handover"
                      hi="सुपुर्दगी की पुष्टि करें"
                    />
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* 6. Geo-tagged Photo Proof & Digital Receipt Info Card */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-md border border-outline-variant/60">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-8 h-8 rounded-full bg-surface-container text-primary flex items-center justify-center shrink-0">
                <Icon name="add_a_photo" size={18} />
              </div>
              <div>
                <h2 className="font-title-md text-title-md text-on-surface font-bold">
                  <T
                    gu="જિઓ-ટેગ ડિજિટલ પુરાવો"
                    en="Geo-tagged Digital Proof"
                    hi="जियो-टैग डिजिटल साक्ष्य"
                  />
                </h2>
                <p className="font-caption text-caption text-on-surface-variant">
                  <T
                    gu="જિઓ-ટેગ ડિલિવરી વેરિફિકેશન"
                    en="Geo-tagged Delivery Verification"
                    hi="जियो-टैग डिलीवरी सत्यापन"
                  />
                </p>
              </div>
            </div>

            <p className="font-caption text-caption text-on-surface-variant leading-relaxed">
              <T
                gu="સરકારી પારદર્શિતા અંતર્ગત સાઇકલ આપતી વખતે શિક્ષક વિદ્યાર્થી સાથે સાઇકલનો GPS લોકેશન (આણંદ, ગુજરાત) યુક્ત ફોટો લેશે જેથી બોગસ વિતરણ અટકાવી શકાય."
                en="Under government transparency norms, the teacher captures a GPS location-tagged photo (Anand, Gujarat) with the student and bicycle to eliminate spurious distribution."
                hi="सरकारी पारदर्शिता के तहत साइकिल देते समय शिक्षक छात्र के साथ जीपीएस लोकेशन युक्त फोटो लेंगे ताकि फर्जी वितरण रोका जा सके।"
              />
            </p>

            {/* Simulated Receipt Mock & Action */}
            <div className="mt-3 bg-surface-container-low rounded-lg p-3 flex items-center justify-between gap-3 border border-outline-variant/40">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex flex-col items-center justify-center text-primary shrink-0 relative">
                  <Icon name="description" size={22} className="text-primary" />
                  <span className="text-[8px] font-mono font-bold text-primary">PDF</span>
                </div>
                <div className="min-w-0">
                  <span className="font-label-md text-label-md text-on-surface font-bold block truncate">
                    <T
                      gu="ડિલિવરી રસીદ નમૂનો"
                      en="Delivery Receipt Preview"
                      hi="वितरण रसीद पूर्वावलोकन"
                    />
                  </span>
                  <span className="font-caption text-[11px] text-on-surface-variant block truncate">
                    <T
                      gu="Handover Receipt PDF (SSB-077432)"
                      en="Handover Receipt PDF (SSB-077432)"
                      hi="Handover Receipt PDF (SSB-077432)"
                    />
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadReceipt}
                className="shrink-0 h-9 px-3 bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-md text-label-md font-semibold rounded-lg flex items-center gap-1.5 transition-colors border border-outline-variant/30 active:scale-95"
              >
                <Icon name={downloadSuccess ? "check" : "download"} size={16} />
                <span>
                  {downloadSuccess ? (
                    <T gu="ડાઉનલોડ થઈ ગયું" en="Downloaded" hi="डाउनलोड हुआ" />
                  ) : (
                    <T gu="ડાઉનલોડ" en="Download" hi="डाउनलोड" />
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* 7. Cycle Details Photo & Specifications */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-md border border-outline-variant/60">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="font-label-lg text-label-lg font-bold text-on-surface">
                <T
                  gu="સાઇકલ મોડેલ વિગતો (Bicycle Specs)"
                  en="Bicycle Specifications"
                  hi="साइकिल मॉडल विवरण (Bicycle Specs)"
                />
              </h3>
              <span className="font-caption text-caption text-primary font-semibold bg-primary-fixed px-2 py-0.5 rounded-full">
                <T gu="મેક ઇન ઇન્ડિયા" en="Make In India" hi="मेक इन इंडिया" />
              </span>
            </div>

            {/* Stylized Bicycle Placeholder Graphic Banner */}
            <div className="w-full h-36 rounded-lg overflow-hidden relative mb-3 bg-gradient-to-br from-primary/10 via-surface-container-high to-secondary/15 flex items-center justify-center border border-outline-variant/50 shadow-inner">
              <div className="flex flex-col items-center justify-center text-center p-2">
                <div className="w-14 h-14 rounded-full bg-surface-container-lowest/90 text-primary flex items-center justify-center shadow-md mb-1.5">
                  <Icon name="pedal_bike" size={32} />
                </div>
                <span className="font-label-md text-label-md font-bold text-on-surface">
                  <T
                    gu="સરસ્વતી સાધના સ્પેશિયલ એડિશન"
                    en="Saraswati Sadhna Special Edition"
                    hi="सरस्वती साधना विशेष संस्करण"
                  />
                </span>
                <span className="text-[11px] text-on-surface-variant font-mono">
                  Atlas 22T / Hero Roadster 26T
                </span>
              </div>
              <div className="absolute bottom-2 left-2 bg-on-surface/85 backdrop-blur-sm text-surface font-caption text-[11px] px-2 py-0.5 rounded shadow-sm">
                Model: Atlas 22T / Saraswati Roadster 26T (With Basket)
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-2 text-on-surface-variant font-caption text-caption">
              <div className="bg-surface-container-low p-2.5 rounded-lg flex flex-col border border-outline-variant/30">
                <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant">
                  <T gu="વોરંટી / સહાય" en="Warranty / Support" hi="वारंटी / सहायता" />
                </span>
                <span className="font-semibold text-on-surface mt-0.5">
                  <T
                    gu="૧ વર્ષ મફત સર્વિસ"
                    en="1 Year Free Service"
                    hi="1 वर्ष मुफ्त सर्विस"
                  />
                </span>
              </div>
              <div className="bg-surface-container-low p-2.5 rounded-lg flex flex-col border border-outline-variant/30">
                <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant">
                  <T gu="એક્સેસરીઝ" en="Accessories Included" hi="सहायक उपकरण" />
                </span>
                <span className="font-semibold text-on-surface mt-0.5">
                  <T
                    gu="ટોપલી, ઘંટડી, લોક કીટ"
                    en="Basket, Bell, Lock Kit"
                    hi="टोकरी, घंटी, लॉक किट"
                  />
                </span>
              </div>
            </div>
          </div>

          {/* 8. Support & Issue Resolution Section */}
          <div className="bg-surface-container-low rounded-xl p-4 shadow-md flex flex-col gap-3 border border-outline-variant/60">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-danger-container text-danger flex items-center justify-center shrink-0">
                <Icon name="report_problem" size={18} />
              </div>
              <div>
                <h3 className="font-label-lg text-label-lg font-bold text-on-surface">
                  <T
                    gu="સાઇકલ ક્ષતિગ્રસ્ત છે કે મળી નથી?"
                    en="Bicycle damaged or not received?"
                    hi="साइकिल क्षतिग्रस्त है या नहीं मिली?"
                  />
                </h3>
                <p className="font-caption text-caption text-on-surface-variant leading-snug mt-0.5">
                  <T
                    gu="જો સાઇકલ તૂટેલી હોય કે વિતરણમાં વિલંબ હોય તો ફરિયાદ નોંધાવો."
                    en="If the bicycle is damaged, defective or delivery is delayed, lodge a grievance immediately."
                    hi="यदि साइकिल टूटी है या वितरण में देरी है तो तुरंत शिकायत दर्ज करें।"
                  />
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-1">
              <Link
                href="/student/grievances"
                className="w-full h-11 bg-surface-container-lowest hover:bg-surface text-primary font-label-md text-label-md font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all border border-outline-variant/60 active:scale-[0.99]"
              >
                <span>
                  <T
                    gu="ફરિયાદ નોંધાવો / ટિકિટ ખોલો (Raise Ticket)"
                    en="Raise Grievance / Open Ticket"
                    hi="शिकायत दर्ज करें / टिकट खोलें"
                  />
                </span>
                <Icon name="arrow_forward" size={16} />
              </Link>

              <a
                href="tel:18002335500"
                className="h-10 bg-surface-container text-on-surface-variant hover:text-on-surface font-label-md text-label-md rounded-lg flex items-center justify-center gap-2 transition-colors border border-outline-variant/30"
              >
                <Icon name="call" size={16} className="text-primary" />
                <span>
                  <T
                    gu="ટોલ-ફ્રી હેલ્પલાઇન: ૧૮૦૦ ૨૩૩ ૫૫૦૦ (1800-233-5500)"
                    en="Toll-Free Helpline: 1800-233-5500"
                    hi="टोल-फ्री हेल्पलाइन: 1800-233-5500"
                  />
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-outline-variant animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center mx-auto mb-3">
                <Icon name="pedal_bike" size={26} />
              </div>
              <h3 className="font-title-md text-title-md text-on-surface font-bold text-center">
                <T
                  gu="સાઇકલ સોંપણીની પુષ્ટિ"
                  en="Confirm Bicycle Handover"
                  hi="साइकिल सुपुर्दगी की पुष्टि"
                />
              </h3>
              <p className="font-caption text-caption text-on-surface-variant text-center mt-1.5 leading-snug">
                <T
                  gu="હું પુષ્ટિ કરું છું કે મેં આચાર્ય ડૉ. કલ્પેશ શાહની હાજરીમાં મારી એટલાસ ૨૨T સાઇકલ (SSB-2026-077432), ટોપલી, ઘંટડી અને ૧ વર્ષનું વોરંટી કાર્ડ પ્રાપ્ત કર્યું છે."
                  en="I confirm that I have physically inspected and received my Atlas 22T bicycle (SSB-2026-077432), basket, bell, and 1-year warranty card from Principal Dr. Kalpesh Shah."
                  hi="मैं पुष्टि करती हूँ कि मैंने प्रधानाचार्य डॉ. कल्पेश शाह की उपस्थिति में अपनी एटलस 22T साइकिल (SSB-2026-077432), टोकरी, घंटी और 1 वर्ष का वारंटी कार्ड प्राप्त कर लिया है।"
                />
              </p>

              <div className="mt-4 pt-2 border-t border-outline-variant flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-md text-label-md font-semibold transition-colors"
                >
                  <T gu="રદ કરો" en="Cancel" hi="रद्द करें" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHandoverConfirmed(true);
                    setShowConfirmModal(false);
                  }}
                  className="flex-1 h-10 rounded-lg bg-secondary hover:opacity-90 text-on-secondary font-label-md text-label-md font-semibold transition-opacity shadow-sm"
                >
                  <T gu="હા, પુષ્ટિ કરો" en="Yes, Confirm" hi="हाँ, पुष्टि करें" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentShell>
  );
}
