"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StudentShell } from "@/components/shell/StudentShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { Skeleton } from "@/components/states/Skeleton";
import { ErrorState } from "@/components/states/ErrorState";
import { EmptyState } from "@/components/states/EmptyState";
import { ApiModeBadge } from "@/app/student/components/ApiModeBadge";
import { useAppStore } from "@/lib/store";
import { useMe, useMySchemes, useApplications, useBulkApply, useSendGuardianOtp } from "@/lib/api/hooks";

function formatCountdown(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainder = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

export default function OneClickApplyPage() {
  const router = useRouter();
  const lang = useAppStore((s) => s.lang);
  const showSuccess = useAppStore((s) => s.showSuccess);
  const showError = useAppStore((s) => s.showError);

  const { data: profile, isLoading: loadingMe, error: errorMe, refetch: refetchMe } = useMe();
  const { data: schemes, isLoading: loadingSchemes, error: errorSchemes, refetch: refetchSchemes } = useMySchemes();
  const { data: appsData, isLoading: loadingApps, error: errorApps, refetch: refetchApps } = useApplications();
  const bulkApply = useBulkApply();
  const sendGuardianOtp = useSendGuardianOtp();

  const [selected, setSelected] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [guardianOtp, setGuardianOtp] = useState("");
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [maskedGuardianMobile, setMaskedGuardianMobile] = useState("");
  const [otpTtl, setOtpTtl] = useState<number | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setOtpTtl((ttl) => ttl === null || ttl <= 0 ? ttl : ttl - 1);
      setResendCooldown((remaining) => Math.max(0, remaining - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const schemeList = schemes ?? [];
  const appliedCodes = new Set((appsData?.items ?? []).map((a) => String(a.scheme_code ?? "")));
  const applicableSchemes = schemeList.filter(
    (s) => (s.status === "eligible" || s.status === "pending_docs") && !appliedCodes.has(s.scheme_code)
  );

  useEffect(() => {
    if (!initialized && schemes && appsData) {
      const defaults = applicableSchemes.filter((s) => s.scheme_code !== "nmms").map((s) => s.scheme_code);
      setSelected(defaults);
      setInitialized(true);
    }
  }, [initialized, schemes, appsData, applicableSchemes]);

  if (loadingMe || loadingSchemes || loadingApps) {
    return (
      <StudentShell>
        <ApiModeBadge />
        <div className="p-4">
          <Skeleton rows={5} />
        </div>
      </StudentShell>
    );
  }

  if (errorMe || errorSchemes || errorApps) {
    return (
      <StudentShell>
        <ApiModeBadge />
        <div className="p-4">
          <ErrorState
            error={errorMe ?? errorSchemes ?? errorApps}
            onRetry={() => { void refetchMe(); void refetchSchemes(); void refetchApps(); }}
          />
        </div>
      </StudentShell>
    );
  }

  function toggleScheme(code: string) {
    setSelected((prev) => (prev.includes(code) ? prev.filter((s) => s !== code) : [...prev, code]));
  }

  async function handleRequestGuardianOtp() {
    try {
      const response = await sendGuardianOtp.mutateAsync();
      setMaskedGuardianMobile(response.masked_mobile);
      setResendCooldown(response.resend_after_seconds);
      setOtpTtl(response.expires_in_seconds);
      setDemoOtp(response.demo_otp ?? null);
      setGuardianOtp(response.demo_otp ?? "");
      showSuccess("Guardian OTP sent");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Could not send guardian OTP");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent || selected.length === 0 || guardianOtp.length !== 6 || otpTtl === null || otpTtl <= 0) return;
    try {
      const res = await bulkApply.mutateAsync({ codes: selected, consent: true, guardianOtp });
      const created = Array.isArray(res.created) ? res.created : [];
      const skipped = Array.isArray(res.skipped) ? res.skipped : [];
      if (created.length > 0) {
        showSuccess(`Applied to ${created.length} scheme(s): ${created.join(", ")}`);
      } else if (skipped.length > 0) {
        showError(`Skipped: ${JSON.stringify(skipped[0])}`);
      }
      setGuardianOtp("");
      setDemoOtp(null);
      setOtpTtl(null);
      setSubmitted(true);
      setTimeout(() => router.push("/student/applications"), 1200);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Application submission failed");
    }
  }

  const totalSelectedAmount = schemeList
    .filter((s) => selected.includes(s.scheme_code))
    .reduce((sum, s) => sum + Number(s.amount || 0), 0);

  return (
    <StudentShell>
      <ApiModeBadge />
      {submitted ? (
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-success-container flex items-center justify-center">
            <Icon name="check_circle" size={48} fill className="text-on-success-container" />
          </div>
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              <T gu="અરજી સફળ!" en="Application Submitted!" hi="आवेदन सफल!" />
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              <T gu="ટ્રૅકર પર રીડાયરેક્ટ..." en="Redirecting to tracker..." hi="ट्रैकर पर रीडायरेक्ट..." />
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-6 px-4">
          {/* Header */}
          <div className="flex flex-col pt-2 pb-2">
            <div className="flex items-center gap-3 mb-1">
              <Link href="/student" className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors">
                <Icon name="arrow_back" size={24} />
              </Link>
              <h1 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">
                <T gu="One-Click અરજી" en="One-Click Apply" hi="एक-क्लिक आवेदन" />
              </h1>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              <T
                gu="બધી પાત્ર યોજનાઓ માટે એક સાથે અરજી"
                en="Apply to all eligible schemes at once"
                hi="सभी पात्र योजनाओं के लिए एक साथ आवेदन"
              />
            </p>

            {/* Student chip */}
            <div className="mt-3 bg-surface-container p-3 rounded-xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 font-bold text-sm">
                  {profile?.name_en?.slice(0, 2).toUpperCase() ?? "ST"}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-title-md text-title-md text-on-surface truncate">
                      {profile?.name_en ?? "Student"}
                    </span>
                    <span className="font-caption text-caption px-1.5 py-0.5 rounded-full bg-surface-container-high text-primary font-semibold shrink-0">
                      {profile?.grade ? `Gr ${profile.grade}` : <T gu="ધોરણ અજ્ઞાત" en="Grade unavailable" hi="कक्षा उपलब्ध नहीं" />}
                    </span>
                  </div>
                  <span className="font-caption text-caption text-on-surface-variant truncate font-mono">
                    {profile?.cts_id ?? ""} • {profile?.school_name ?? ""}
                  </span>
                </div>
              </div>
              <Icon name="verified" size={20} className="text-primary shrink-0" />
            </div>
          </div>

          {/* Schemes list */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                <T
                  gu={`પસંદ: ${selected.length} યોજના`}
                  en={`Selected: ${selected.length} scheme(s)`}
                  hi={`चयनित: ${selected.length} योजनाएं`}
                />
              </span>
              <span className="font-caption text-caption text-primary font-medium">
                ₹ {totalSelectedAmount.toLocaleString("en-IN")}
              </span>
            </div>

            {schemeList.length === 0 && <EmptyState title="No schemes available" description="Eligibility evaluation returned no schemes to apply for." />}
            {schemeList.map((scheme) => {
              const alreadyApplied = appliedCodes.has(scheme.scheme_code);
              const isEligible = scheme.status === "eligible" || scheme.status === "pending_docs";
              const disabled = alreadyApplied || !isEligible;
              const title = lang === "gu" ? scheme.scheme_name_gu || scheme.scheme_name_en : scheme.scheme_name_en;

              return (
                <label
                  key={scheme.scheme_code}
                  className={`relative p-4 rounded-xl shadow-sm block transition-all ${
                    disabled
                      ? "bg-surface-container-low opacity-70 cursor-not-allowed"
                      : "bg-surface-container-lowest cursor-pointer hover:bg-surface-container-low"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      data-testid={`scheme-${scheme.scheme_code}`}
                      disabled={disabled}
                      checked={!disabled && selected.includes(scheme.scheme_code)}
                      onChange={() => !disabled && toggleScheme(scheme.scheme_code)}
                      className="w-5 h-5 mt-1 accent-primary rounded cursor-pointer shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-title-md text-title-md text-on-surface truncate">{title}</span>
                        <span
                          className={`font-label-md text-label-md px-2 py-0.5 rounded-full shrink-0 ${
                            alreadyApplied
                              ? "bg-blue-100 text-primary"
                              : isEligible
                              ? "bg-success-container text-on-success-container"
                              : "bg-surface-container-high text-on-surface-variant"
                          }`}
                        >
                          {alreadyApplied ? "Applied" : scheme.status}
                        </span>
                      </div>
                      <div className="mt-1 flex items-baseline gap-2 flex-wrap">
                        <span className="font-title-lg text-title-lg font-bold text-primary">
                          {Number(scheme.amount) > 0 ? `₹${Number(scheme.amount).toLocaleString("en-IN")}/yr` : "Free Bicycle"}
                        </span>
                      </div>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Guardian Consent */}
          <label className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              data-testid="guardian-consent-checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="w-5 h-5 mt-0.5 accent-primary rounded shrink-0"
            />
            <span className="text-xs text-on-surface leading-relaxed">
              <T
                gu="હું અને મારા વાલી મારી માહિતી CTS, DigiLocker અને PFMS DBT સાથે ચકાસણી માટે સંમતિ આપીએ છીએ (DPDP Act 2023)."
                en="I and my guardian consent to verifying my eligibility and bank details via CTS, DigiLocker & PFMS for DBT (DPDP Act 2023)."
                hi="मैं और मेरे अभिभावक पात्रता और DBT के लिए CTS, DigiLocker और PFMS के माध्यम से सत्यापन की सहमति देते हैं।"
              />
            </span>
          </label>

          <section className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant space-y-3" aria-labelledby="guardian-otp-title">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 id="guardian-otp-title" className="text-sm font-semibold text-on-surface">
                  <T gu="વાલીનો OTP" en="Guardian OTP" hi="अभिभावक OTP" />
                </h2>
                {maskedGuardianMobile && <p className="text-xs text-on-surface-variant mt-0.5">{maskedGuardianMobile}</p>}
              </div>
              <button
                type="button"
                onClick={handleRequestGuardianOtp}
                disabled={!consent || selected.length === 0 || sendGuardianOtp.isPending || resendCooldown > 0}
                className="shrink-0 rounded-lg border border-primary px-3 py-2 text-xs font-semibold text-primary disabled:opacity-50"
              >
                {sendGuardianOtp.isPending ? (
                  <T gu="મોકલી રહ્યા છીએ..." en="Sending..." hi="भेज रहे हैं..." />
                ) : resendCooldown > 0 ? (
                  <T gu={`ફરી મોકલવા ${formatCountdown(resendCooldown)}`} en={`Resend in ${formatCountdown(resendCooldown)}`} hi={`${formatCountdown(resendCooldown)} में फिर भेजें`} />
                ) : otpTtl !== null ? (
                  <T gu="OTP ફરી મોકલો" en="Resend OTP" hi="OTP फिर भेजें" />
                ) : (
                  <T gu="OTP મોકલો" en="Send OTP" hi="OTP भेजें" />
                )}
              </button>
            </div>

            {otpTtl !== null && (
              <>
                <label htmlFor="guardian-otp" className="block text-xs font-medium text-on-surface-variant">
                  <T gu="વાલીનો ૬ અંકનો OTP દાખલ કરો" en="Enter the 6-digit code sent to your guardian" hi="अभिभावक को भेजा गया 6 अंकों का OTP दर्ज करें" />
                </label>
                <input
                  id="guardian-otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={guardianOtp}
                  onChange={(event) => setGuardianOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  disabled={otpTtl <= 0}
                  placeholder="••••••"
                  className="input w-full text-center font-mono tracking-[0.4em]"
                  aria-describedby="guardian-otp-status"
                />
                <div id="guardian-otp-status" className="flex items-center justify-between gap-2 text-xs text-on-surface-variant">
                  <span>
                    {otpTtl > 0 ? (
                      <T gu={`સમય બાકી ${formatCountdown(otpTtl)}`} en={`Expires in ${formatCountdown(otpTtl)}`} hi={`${formatCountdown(otpTtl)} में समाप्त होगा`} />
                    ) : (
                      <T gu="OTPની મુદત પૂરી થઈ. ફરી મોકલો." en="OTP expired. Request another code." hi="OTP समाप्त हो गया। नया कोड मांगें।" />
                    )}
                  </span>
                  {demoOtp && <span className="font-mono font-semibold text-amber-800"><T gu={`ડેમો OTP: ${demoOtp}`} en={`Demo OTP: ${demoOtp}`} hi={`डेमो OTP: ${demoOtp}`} /></span>}
                </div>
              </>
            )}
          </section>

          <button
            type="submit"
            disabled={!consent || selected.length === 0 || guardianOtp.length !== 6 || otpTtl === null || otpTtl <= 0 || bulkApply.isPending}
            className="w-full h-12 bg-secondary disabled:opacity-50 text-on-secondary font-label-lg font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <Icon name="bolt" size={20} />
            {bulkApply.isPending ? (
              <T gu="સબમિટ થઈ રહ્યું છે..." en="Submitting..." hi="जमा हो रहा है..." />
            ) : (
              <T
                gu={`અરજી સબમિટ કરો (${selected.length})`}
                en={`Submit ${selected.length} Application(s)`}
                hi={`${selected.length} आवेदन जमा करें`}
              />
            )}
          </button>
        </form>
      )}
    </StudentShell>
  );
}
