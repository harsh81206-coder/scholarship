"use client";

import { useState } from "react";
import Link from "next/link";
import { StudentShell } from "@/components/shell/StudentShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { Avatar } from "@/components/ui";
import { Skeleton } from "@/components/states/Skeleton";
import { ErrorState } from "@/components/states/ErrorState";
import { EmptyState } from "@/components/states/EmptyState";
import { ApiModeBadge } from "@/app/student/components/ApiModeBadge";
import { useAppStore } from "@/lib/store";
import {
  useMe,
  useMySchemes,
  useApplications,
  useNotifications,
  useMyCycle,
} from "@/lib/api/hooks";

export default function StudentDashboardPage() {
  const lang = useAppStore((s) => s.lang);
  const { data: profile, isLoading: loadingMe, error: errorMe, refetch: refetchMe } = useMe();
  const { data: schemes, isLoading: loadingSchemes, error: errorSchemes, refetch: refetchSchemes } = useMySchemes();
  const { data: appsData, isLoading: loadingApps, error: errorApps, refetch: refetchApps } = useApplications();
  const { data: notifications, isLoading: loadingNotifications, error: errorNotifications, refetch: refetchNotifications } = useNotifications();
  const { data: cycle, isLoading: loadingCycle, error: errorCycle, refetch: refetchCycle } = useMyCycle();

  const [copiedCts, setCopiedCts] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);

  if (loadingMe || loadingSchemes || loadingApps || loadingNotifications || loadingCycle) {
    return (
      <StudentShell>
        <ApiModeBadge />
        <div className="px-4 py-4 max-w-[430px] mx-auto pb-24">
          <Skeleton rows={6} />
        </div>
      </StudentShell>
    );
  }

  if (errorMe || errorSchemes || errorApps || errorNotifications || errorCycle) {
    return (
      <StudentShell>
        <ApiModeBadge />
        <div className="px-4 py-4 max-w-[430px] mx-auto pb-24">
          <ErrorState
            error={errorMe ?? errorSchemes ?? errorApps ?? errorNotifications ?? errorCycle}
            onRetry={() => {
              void refetchMe();
              void refetchSchemes();
              void refetchApps();
              void refetchNotifications();
              void refetchCycle();
            }}
          />
        </div>
      </StudentShell>
    );
  }

  const ctsId = profile?.cts_id ?? "";
  const studentName =
    lang === "gu" ? profile?.name_gu || profile?.name_en || "Student" : profile?.name_en || "Student";
  const schoolName = profile?.school_name ?? "";
  const grade = profile?.grade;
  const completionPct = profile?.completion_pct ?? 0;

  const schemeList = schemes ?? [];
  const eligibleSchemes = schemeList.filter((s) => s.status === "eligible" || s.status === "pending_docs");
  const totalBenefit = eligibleSchemes.reduce((sum, s) => sum + Number(s.amount || 0), 0);
  const hasFreeCycle = eligibleSchemes.some((s) => s.scheme_type === "material" || s.scheme_code === "saraswati-sadhna");

  const appsList = appsData?.items ?? [];
  const approvedApps = appsList.filter((a) =>
    ["school_verified", "taluka_approved", "deo_approved", "sanctioned", "disbursed"].includes(a.status)
  );
  const latestApp = appsList[0];

  const notifList = Array.isArray(notifications) ? notifications : [];
  const unreadCount = notifList.filter((n) => !n.read).length;

  const cycleAssigned = Boolean(cycle?.assigned);
  const cycleOtp = cycle?.handover_otp ?? cycle?.otp
    ? String(cycle.handover_otp ?? cycle.otp)
    : notifList.find((notification) => String(notification.type) === "cycle")?.body
      ? String(notifList.find((notification) => String(notification.type) === "cycle")?.body).match(/\b\d{6}\b/)?.[0] ?? null
      : null;

  const handleCopyCts = () => {
    navigator.clipboard?.writeText(ctsId);
    setCopiedCts(true);
    setTimeout(() => setCopiedCts(false), 2000);
  };

  const handleCopyOtp = () => {
    if (!cycleOtp) return;
    navigator.clipboard?.writeText(cycleOtp);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const stageStep = (status?: string) => {
    switch (status) {
      case "applied":
        return 1;
      case "school_verified":
        return 2;
      case "taluka_approved":
        return 3;
      case "deo_approved":
        return 4;
      case "sanctioned":
        return 5;
      case "disbursed":
        return 6;
      default:
        return 1;
    }
  };
  const currentStep = stageStep(latestApp?.status);

  return (
    <StudentShell>
      <ApiModeBadge />
      <div className="px-4 py-3 space-y-4 max-w-[430px] mx-auto pb-24 relative">
        {/* 1. Greeting & Profile Strip Card */}
        <section className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant shadow-level-1 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar name={profile?.name_en ?? "Student"} size="md" className="ring-2 ring-primary/20 shadow-sm" />
                <span className="absolute -bottom-0.5 -right-0.5 bg-emerald-600 text-white rounded-full p-0.5 border border-surface flex items-center justify-center">
                  <Icon name="check" size={10} className="font-bold text-white" />
                </span>
              </div>
              <div className="min-w-0">
                <h1 className="font-title-md text-title-md text-on-surface leading-tight">
                  <T gu={`નમસ્તે, ${studentName} 👋`} en={`Namaste, ${studentName} 👋`} hi={`नमस्ते, ${studentName} 👋`} />
                </h1>
                <p className="font-caption text-caption text-on-surface-variant truncate">{schoolName}</p>
              </div>
            </div>
          </div>

          {/* Badges & CTS ID */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {profile?.verification_status === "verified" && <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-emerald-200">
              <Icon name="verified" size={13} fill className="text-emerald-700" />
              <T gu="GSRDA માન્ય ✓" en="GSRDA Verified ✓" hi="GSRDA सत्यापित ✓" />
            </span>}
            <span className="text-[11px] font-medium text-on-surface-variant bg-surface-container-high px-2.5 py-0.5 rounded-full">
              {grade ? <T gu={`ધોરણ ${grade}`} en={`Class ${grade}`} hi={`कक्षा ${grade}`} /> : <T gu="ધોરણ ઉપલબ્ધ નથી" en="Grade unavailable" hi="कक्षा उपलब्ध नहीं" />}
            </span>
            <div className="inline-flex items-center gap-1 bg-surface-container-low px-2 py-0.5 rounded-full text-[11px] text-on-surface-variant font-mono">
              <span>{ctsId}</span>
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
                <T gu="પ્રોફાઇલ પૂર્ણતા" en="Profile Completion Status" hi="प्रोफ़ाइल पूर्णता स्थिति" />
              </span>
              <span className="font-semibold text-primary">{completionPct}%</span>
            </div>
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary to-primary-container h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, completionPct))}%` }}
              />
            </div>
          </div>
        </section>

        {/* 2. KPI Summary Chips */}
        <section className="grid grid-cols-4 gap-2">
          <div className="bg-surface-container-lowest rounded-xl p-2.5 border border-outline-variant text-center shadow-xs">
            <p className="font-headline-sm text-primary font-bold leading-tight">{eligibleSchemes.length}</p>
            <p className="text-[10px] text-on-surface-variant font-medium mt-0.5 leading-tight">
              <T gu="પાત્ર યોજના" en="Eligible" hi="पात्र" />
            </p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-2.5 border border-outline-variant text-center shadow-xs">
            <p className="font-headline-sm text-secondary font-bold leading-tight">{appsList.length}</p>
            <p className="text-[10px] text-on-surface-variant font-medium mt-0.5 leading-tight">
              <T gu="અરજી કરેલ" en="Applied" hi="आवेदन" />
            </p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-2.5 border border-outline-variant text-center shadow-xs">
            <p className="font-headline-sm text-emerald-600 font-bold leading-tight">{approvedApps.length}</p>
            <p className="text-[10px] text-on-surface-variant font-medium mt-0.5 leading-tight">
              <T gu="મંજૂર થયેલ" en="Approved" hi="स्वीकृत" />
            </p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-2.5 border border-outline-variant text-center shadow-xs">
            <p className="font-headline-sm text-primary font-bold leading-tight">
              ₹{totalBenefit >= 1000 ? `${Math.round(totalBenefit / 1000)}k` : totalBenefit}
            </p>
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
                  gu={`તમે ${eligibleSchemes.length} સરકારી યોજનાઓ માટે પાત્ર છો!`}
                  en={`You are eligible for ${eligibleSchemes.length} government schemes!`}
                  hi={`आप ${eligibleSchemes.length} सरकारी योजनाओं के लिए पात्र हैं!`}
                />
              </h2>
              <p className="text-xs text-on-primary-container mt-1 font-medium">
                <T gu="અંદાજિત વાર્ષિક લાભ: " en="Estimated annual benefit: " hi="अनुमानित वार्षिक लाभ: " />
                <span className="text-secondary-fixed font-bold text-sm">
                  ₹ {totalBenefit.toLocaleString("en-IN")}
                </span>
                {hasFreeCycle && (
                  <>
                    {" + "}
                    <T gu="મફત સાયકલ" en="Free Cycle" hi="मुफ़्त साइकिल" />
                  </>
                )}
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
              <T gu="દસ્તાવેજો" en="Documents" hi="दस्तावेज़" />
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
              {appsList.length} <T gu="સક્રિય" en="Active" hi="सक्रिय" />
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

        {/* 5. Cycle Delivery Mini Card */}
        {cycleAssigned && (
          <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-3.5 shadow-xs">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Icon name="pedal_bike" size={20} className="text-white" />
                </div>
                <div>
                  <span className="inline-flex items-center text-[10px] uppercase font-bold text-primary tracking-wide">
                    {String(cycle?.status ?? "READY FOR PICKUP")}
                  </span>
                  <h3 className="text-xs font-bold text-on-surface">
                    <T gu="સાયકલ સ્થિતિ" en="Bicycle Delivery Status" hi="साइकिल वितरण स्थिति" />
                  </h3>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-300 font-mono">
                {String(cycle?.serial_no ?? "")}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between bg-white rounded-xl p-2.5 border border-blue-100">
              <div>
                <span className="text-[10px] text-on-surface-variant block">
                  <T gu="ડિલિવરી OTP" en="Delivery OTP" hi="वितरण OTP" />
                </span>
                <div className="flex items-center gap-1.5">
                  {cycleOtp ? (
                    <>
                      <span className="text-base font-extrabold font-mono tracking-widest text-primary">{cycleOtp}</span>
                      <button type="button" onClick={handleCopyOtp} className="text-on-surface-variant hover:text-primary transition-colors p-0.5" title="Copy OTP" aria-label="Copy OTP">
                        <Icon name={copiedOtp ? "check" : "content_copy"} size={13} />
                      </button>
                      {copiedOtp && <span className="text-[9px] text-emerald-600 font-bold"><T gu="કોપી!" en="Copied!" hi="कॉपी!" /></span>}
                    </>
                  ) : <span className="text-xs text-on-surface-variant"><T gu="શાળામાં OTP મળશે" en="OTP provided at school handover" hi="स्कूल में हस्तांतरण पर OTP मिलेगा" /></span>}
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
        )}

        {/* 6. Live Application Tracker */}
        {latestApp && (
          <section className="bg-surface-container-lowest rounded-2xl p-3.5 border border-outline-variant shadow-level-1 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-on-surface uppercase tracking-wide">
                  <T gu="લાઇવ અરજી ટ્રેકર" en="Live Application Tracker" hi="लाइव आवेदन ट्रैकर" />
                </h3>
                <p className="text-[11px] font-medium text-on-surface-variant">
                  {String(latestApp.scheme_name_en ?? latestApp.scheme_code)} (#{latestApp.app_code})
                </p>
              </div>
              <Link href="/student/applications" className="text-xs text-primary font-semibold hover:underline">
                <T gu="વિગત જુઓ" en="View Details" hi="विवरण देखें" />
              </Link>
            </div>

            <div className="grid grid-cols-6 gap-1 pt-1 pb-1">
              {[
                { step: 1, gu: "સબમિટ", en: "Submit", hi: "सबमिट" },
                { step: 2, gu: "શાળા", en: "School", hi: "स्कूल" },
                { step: 3, gu: "તાલુકા", en: "Taluka", hi: "तालुका" },
                { step: 4, gu: "DEO", en: "DEO", hi: "DEO" },
                { step: 5, gu: "મંજૂર", en: "Sanction", hi: "मंजूर" },
                { step: 6, gu: "DBT", en: "Credited", hi: "क्रेडिट" },
              ].map((item) => {
                const done = currentStep >= item.step;
                return (
                  <div key={item.step} className="flex flex-col items-center text-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shadow-xs ${
                        done
                          ? "bg-emerald-600 text-white"
                          : "bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      {done ? <Icon name="check" size={13} className="text-white" /> : item.step}
                    </div>
                    <span className="text-[9px] font-medium text-on-surface-variant mt-1 leading-tight">
                      <T gu={item.gu} en={item.en} hi={item.hi} />
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 7. Scheme Cards Stack */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-on-surface">
                <T gu="તમારી યોજનાઓ" en="Your Schemes" hi="आपकी योजनाएं" />
              </h3>
              <p className="text-[11px] text-on-surface-variant">
                <T
                  gu="તમારી પાત્રતા મુજબ પસંદગી કરેલ યોજનાઓ"
                  en="Curated schemes based on your eligibility"
                  hi="आपकी पात्रता के आधार पर चयनित योजनाएं"
                />
              </p>
            </div>
            <Link href="/student/apply" className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5">
              <span>
                <T gu="અરજી કરો" en="Apply All" hi="आवेदन करें" />
              </span>
              <Icon name="chevron_right" size={14} />
            </Link>
          </div>

          {schemeList.length === 0 ? (
            <EmptyState title="No schemes available" description="Eligibility evaluation returned no schemes." />
          ) : (
            <div className="space-y-2.5">
              {schemeList.map((scheme) => {
                const isEligible = scheme.status === "eligible";
                const isApplied = appsList.some((a) => a.scheme_code === scheme.scheme_code);
                const title =
                  lang === "gu"
                    ? scheme.scheme_name_gu || scheme.scheme_name_en
                    : scheme.scheme_name_en;
                return (
                  <div
                    key={scheme.scheme_code}
                    className="bg-surface-container-lowest rounded-2xl p-3.5 border border-outline-variant hover:border-primary/40 transition-all shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          {isApplied ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-primary">
                              <Icon name="hourglass_top" size={12} className="text-primary" />
                              <T gu="અરજી કરેલ" en="Applied" hi="आवेदन किया" />
                            </span>
                          ) : isEligible ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              <Icon name="check_circle" size={12} fill className="text-emerald-800" />
                              <T gu="પાત્ર ✓" en="Eligible ✓" hi="पात्र ✓" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-container-high text-on-surface-variant">
                              <T gu="અપાત્ર" en={scheme.status} hi={scheme.status} />
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-on-surface truncate">{title}</h4>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold text-primary">
                          {Number(scheme.amount) > 0 ? `₹ ${Number(scheme.amount).toLocaleString("en-IN")}` : "Cycle"}
                        </span>
                        <span className="text-[10px] text-on-surface-variant block">
                          <T gu="વાર્ષિક" en="Annual" hi="वार्षिक" />
                        </span>
                      </div>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-surface-container-low flex items-center justify-between">
                      <Link
                        href={`/student/schemes/${encodeURIComponent(scheme.scheme_code)}`}
                        className="text-xs font-semibold text-on-surface-variant hover:text-primary inline-flex items-center gap-0.5"
                      >
                        <T gu="પાત્રતા વિગત" en="Explain Eligibility" hi="पात्रता विवरण" />
                      </Link>
                      {!isApplied && isEligible && (
                        <Link
                          href="/student/apply"
                          className="text-xs font-semibold text-primary hover:text-primary-container inline-flex items-center gap-0.5"
                        >
                          <span>
                            <T gu="અરજી કરો" en="Apply Now" hi="आवेदन करें" />
                          </span>
                          <Icon name="arrow_forward" size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 8. Recent Activity & Notification Preview */}
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
            {notifList.slice(0, 3).map((n) => (
              <div key={n.id} className="flex items-start gap-2.5 p-2 rounded-xl bg-surface-container-low">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name="notifications" size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-on-surface leading-tight">
                    {lang === "gu" ? String(n.title_gu ?? n.title_en) : lang === "hi" ? String(n.title_hi ?? n.title_en) : n.title_en}
                  </p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5 truncate">
                    {String(n.body ?? "")}
                  </p>
                </div>
              </div>
            ))}
            {notifList.length === 0 && (
              <p className="text-xs text-on-surface-variant">
                <T gu="કોઈ તાજેતરની સૂચના નથી" en="No recent notifications" hi="कोई हालिया सूचना नहीं" />
              </p>
            )}
          </div>
        </section>

        {/* 9. Floating AI Help Button (Vidya Mitra AI) */}
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
      </div>
    </StudentShell>
  );
}
