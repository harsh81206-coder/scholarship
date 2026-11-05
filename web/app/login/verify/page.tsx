"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PublicShell } from "@/components/shell/PublicShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { useAppStore } from "@/lib/store";
import { ROLE_DASHBOARD } from "@/lib/nav.config";
import { api, storeAuthSession } from "@/lib/api/resources";

const RESEND_TIMER = 30;

export default function OtpVerifyPage() {
  const router = useRouter();
  const { role, login, showSuccess, setRole } = useAppStore();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(RESEND_TIMER);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  // 6 explicit refs (hooks cannot be called inside callbacks/loops)
  const ref0 = useRef<HTMLInputElement>(null);
  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);
  const ref3 = useRef<HTMLInputElement>(null);
  const ref4 = useRef<HTMLInputElement>(null);
  const ref5 = useRef<HTMLInputElement>(null);
  const refs = [ref0, ref1, ref2, ref3, ref4, ref5];

  // Countdown timer
  useEffect(() => {
    const pendingRole = window.localStorage.getItem("vps_pending_role");
    if (["student", "school", "deo", "admin", "vendor", "tpeo", "demo"].includes(pendingRole ?? "")) {
      setRole(pendingRole as typeof role);
    }
    const resendAfter = Number(window.localStorage.getItem("vps_resend_after"));
    if (Number.isFinite(resendAfter) && resendAfter > 0) setTimeLeft(resendAfter);
  }, [setRole]);

  useEffect(() => {
    if (timeLeft <= 0) { setCanResend(true); return; }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft]);

  function autoFill() {
    setDigits(["1", "2", "3", "4", "5", "6"]);
    setError("");
    refs[5].current?.focus();
  }

  function handleChange(idx: number, val: string) {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = digit;
    setDigits(next);
    setError("");
    if (digit && idx < 5) refs[idx + 1].current?.focus();
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      refs[idx - 1].current?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      const next = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
      setDigits(next);
      refs[Math.min(pasted.length, 5)].current?.focus();
    }
  }

  async function handleVerify() {
    const otp = digits.join("");
    if (otp.length < 6) { setError("Please enter all 6 digits."); return; }
    setLoading(true);
    try {
      const identifier = window.localStorage.getItem("vps_pending_identifier") ?? "GJ-AND-2026-004512";
      const response = await api.verifyOtp(identifier, otp, role);
      storeAuthSession(identifier, role, response);
      setSuccess(true);
      login(role);
      showSuccess("લૉગ ઇન સફળ! / Login successful!");
      setTimeout(() => router.push(ROLE_DASHBOARD[role]), 500);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Wrong OTP. Try again.");
      setDigits(["", "", "", "", "", ""]);
      refs[0].current?.focus();
      setLoading(false);
    }
  }

  async function handleResend() {
    const identifier = window.localStorage.getItem("vps_pending_identifier") ?? "GJ-AND-2026-004512";
    try {
      const response = await api.sendOtp(identifier, "", role);
      setTimeLeft(response.resend_after_seconds || RESEND_TIMER);
      window.localStorage.setItem("vps_resend_after", String(response.resend_after_seconds || RESEND_TIMER));
      setCanResend(false);
      setDigits(["", "", "", "", "", ""]);
      setError("");
      refs[0].current?.focus();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not resend OTP");
    }
  }

  const timer = timeLeft < 10 ? `00:0${timeLeft}` : `00:${timeLeft}`;

  return (
    <PublicShell>
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-on-primary font-label-md text-[11px] font-bold">2</span>
            <span className="font-label-md text-label-md text-primary font-semibold">
              <T gu="પગલું ૨: OTP ચકાસણી" en="Step 2: OTP Verification" hi="चरण 2: OTP सत्यापन" />
            </span>
          </div>
          <span className="font-caption text-caption text-on-surface-variant">Step 2 of 2</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden mb-6">
          <div className="bg-primary h-full w-full rounded-full transition-all duration-500" />
        </div>

        {/* Student context card */}
        <div className="card p-4 mb-4 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-surface-container-high/40 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg self-start w-fit mb-2">
            <Icon name="school" size={16} fill className="text-primary" />
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              <T gu="રિયા હસમુખભાઈ પટેલ" en="Riya H. Patel" hi="रिया एच. पटेल" />
            </span>
            <span className="font-caption text-caption text-on-surface-variant">
              • <T gu="ધોરણ ૯-બી, આણંદ" en="Grade 9-B, Anand" hi="कक्षा 9-B, आणंद" />
            </span>
          </div>
          <span className="font-caption text-[11px] text-on-surface-variant font-mono pl-1 block">CTS: GJ-AND-2026-004512</span>
          <div className="pt-2">
            <h1 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
              <T gu="OTP ચકાસણી" en="OTP Verification" hi="OTP सत्यापन" />
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-snug">
              <T
                gu="તમારા મોબાઇલ પર મોકલેલ ૬-અંકનો કોડ દાખલ કરો."
                en="Enter the 6-digit code sent to your registered mobile."
                hi="अपने मोबाइल पर भेजा गया 6-अंकीय कोड दर्ज करें।"
              />
            </p>
          </div>
          <div className="flex items-center justify-between bg-surface-container-low px-3 py-2 rounded-lg mt-3">
            <div className="flex items-center gap-2">
              <Icon name="phone_android" size={18} className="text-secondary" />
              <span className="font-label-lg text-label-lg font-bold text-on-surface tracking-wider">+91 98254-XXXXX</span>
            </div>
            <button className="font-label-md text-label-md text-primary font-bold flex items-center gap-0.5">
              <T gu="બદલો" en="Change" hi="बदलें" />
              <Icon name="edit" size={14} />
            </button>
          </div>
        </div>

        {/* OTP Input */}
        <div className="card p-4 mb-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="font-label-md text-label-md font-semibold text-on-surface flex items-center gap-1">
              <T gu="૬-અંકનો OTP" en="6-Digit OTP" hi="6-अंकीय OTP" />
              <span className="text-danger">*</span>
            </label>
            <span className="font-caption text-[11px] text-on-surface-variant">6 Digit Code</span>
          </div>

          {/* Digit cells */}
          <div className="grid grid-cols-6 gap-2 w-full" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={refs[i]}
                id={`otp-input-${i + 1}`}
                aria-label={`Digit ${i + 1}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-full py-3 text-center font-headline-sm text-headline-sm font-bold rounded-lg focus:outline-none focus:ring-2 transition-all shadow-inner ${
                  error
                    ? "bg-danger-container text-on-danger-container focus:ring-danger border border-danger"
                    : d
                    ? "bg-primary/10 text-primary focus:ring-primary focus:bg-surface-container-lowest border border-primary"
                    : "bg-surface-container-low text-on-surface focus:ring-primary focus:bg-surface-container-lowest border border-outline"
                }`}
              />
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-danger font-body-sm text-body-sm">
              <Icon name="error" size={16} />
              {error}
            </div>
          )}

          {process.env.NEXT_PUBLIC_USE_MOCK === "true" && (
            <button
              onClick={autoFill}
              className="self-center flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container text-secondary hover:bg-surface-container-high transition-all shadow-sm font-label-md text-label-md font-bold"
            >
              <Icon name="auto_fix_high" size={16} className="text-secondary" />
              <T gu="ડેમો OTP: 123456" en="Demo OTP: 123456" hi="डेमो OTP: 123456" />
            </button>
          )}

          {/* Timer & resend */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-low rounded-full text-on-surface-variant font-label-md text-label-md">
              <Icon name="schedule" size={16} className="text-on-surface-variant" />
              <T gu="નવો OTP:" en="Resend in:" hi="पुनः भेजें:" />
              <span className="font-bold text-primary font-mono">{canResend ? "00:00" : timer}</span>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={canResend ? handleResend : undefined}
                disabled={!canResend}
                className={`font-label-md text-label-md flex items-center gap-1 ${
                  canResend ? "text-primary hover:underline cursor-pointer" : "text-on-surface-variant cursor-not-allowed"
                }`}
              >
                <Icon name="sms" size={16} />
                <T gu="SMS" en="Resend SMS" hi="SMS भेजें" />
              </button>
              <span className="text-outline-variant font-caption">•</span>
              <button
                onClick={canResend ? handleResend : undefined}
                disabled={!canResend}
                className={`font-label-md text-label-md flex items-center gap-1 ${
                  canResend ? "text-secondary hover:underline cursor-pointer" : "text-on-surface-variant cursor-not-allowed"
                }`}
              >
                <Icon name="chat" size={16} />
                <T gu="WhatsApp" en="WhatsApp" hi="WhatsApp" />
              </button>
            </div>
          </div>
        </div>

        {/* Security badge */}
        <div className="card p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-primary shrink-0">
              <Icon name="verified_user" size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-label-md text-label-md font-bold text-on-surface">
                  <T gu="સુરક્ષિત ૨૫૬-બીટ એન્ક્રિપ્શન" en="Secure 256-bit Encryption" hi="256-बिट एन्क्रिप्शन" />
                </span>
                <span className="bg-surface-container-high text-primary font-label-md text-[10px] px-1.5 py-0.5 rounded font-bold">DPDP ACT 2023</span>
              </div>
              <span className="font-caption text-caption text-on-surface-variant mt-0.5 block">
                <T
                  gu="OTP ક્યારેય અન્ય સાથે શેર ન કરો."
                  en="Never share your OTP with anyone. Gujarat Govt. verified."
                  hi="OTP कभी किसी के साथ साझा न करें।"
                />
              </span>
            </div>
          </div>
        </div>

        {/* Verify button */}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full h-12 rounded-lg bg-secondary text-on-secondary flex items-center justify-center gap-2 font-label-lg text-label-lg font-bold shadow-md hover:bg-secondary/90 active:scale-[0.98] transition-all disabled:opacity-60"
        >
          {success ? (
            <>
              <Icon name="check_circle" size={20} fill />
              <T gu="પ્રમાણિત! રીડાયરેક્ટ..." en="Verified! Redirecting..." hi="सत्यापित! रीडायरेक्ट..." />
            </>
          ) : (
            <>
              <T gu="ચકાસો અને આગળ વધો" en="Verify & Continue" hi="सत्यापित करें और जारी रखें" />
              <Icon name="arrow_forward" size={20} />
            </>
          )}
        </button>

        {/* Success toast */}
        {success && (
          <div className="mt-4 card p-4 flex items-center gap-3 border-l-4 border-l-primary animate-fade-in">
            <div className="w-9 h-9 rounded-full bg-success-container flex items-center justify-center shrink-0">
              <Icon name="check_circle" size={22} fill className="text-on-success-container" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-label-md font-bold text-on-surface">
                <T gu="✓ પ્રમાણિત સત્ર!" en="✓ Authenticated!" hi="✓ प्रमाणित!" />
              </span>
              <span className="font-caption text-caption text-on-surface-variant truncate">
                <T gu="ડૅશબૉર્ડ પર રીડાયરેક્ટ..." en="Redirecting to dashboard..." hi="डैशबोर्ड पर रीडायरेक्ट..." />
              </span>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>
        )}

        {/* Help */}
        <div className="mt-4 flex items-start gap-2 px-2 text-on-surface-variant">
          <Icon name="support_agent" size={18} className="text-primary shrink-0 mt-0.5" />
          <div className="flex flex-col font-caption text-caption leading-tight">
            <span className="font-semibold text-on-surface">
              <T gu="OTP ન મળ્યો?" en="Didn't receive OTP?" hi="OTP नहीं मिला?" />
            </span>
            <span>
              <T
                gu="શાળાના નોડલ શિક્ષક અથવા 1800-233-5500 હેલ્પલાઇન."
                en="Contact your school nodal teacher or helpline 1800-233-5500."
                hi="अपने स्कूल के नोडल शिक्षक या हेल्पलाइन 1800-233-5500 से संपर्क करें।"
              />
            </span>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
