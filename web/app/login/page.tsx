"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PublicShell } from "@/components/shell/PublicShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { useAppStore, type Role } from "@/lib/store";
import { api } from "@/lib/api/resources";

const ROLES = [
  { key: "student", icon: "school", gu: "વિદ્યાર્થી/વાલી", en: "Student/Parent" },
  { key: "school", icon: "apartment", gu: "શાળા/આચાર્ય", en: "School/Principal" },
  { key: "deo", icon: "corporate_fare", gu: "DEO/DPO", en: "DEO/DPO" },
  { key: "admin", icon: "policy", gu: "રાજ્ય કક્ષા", en: "State Level" },
] as const;

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useAppStore();
  const [selectedRole, setSelectedRole] = useState<"student" | "school" | "deo" | "admin">("student");
  const [ctsId, setCtsId] = useState("");
  const [dob, setDob] = useState("");
  const [mobile, setMobile] = useState("");
  const [consent, setConsent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [officerId, setOfficerId] = useState("");
  const [formError, setFormError] = useState("");
  const { showError } = useAppStore();

  function autoFill() {
    setSelectedRole("student");
    setCtsId("GJ-AND-2026-004512");
    setDob("2009-08-15");
    setMobile("9876543210");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Map login role to app role
    const roleMap: Record<string, Role> = {
      student: "student",
      school: "school",
      deo: "deo",
      admin: "admin",
    };
    setRole(roleMap[selectedRole]);
    try {
      const response = await api.sendOtp(ctsId, mobile, roleMap[selectedRole]);
      window.localStorage.setItem("vps_pending_identifier", ctsId);
      window.localStorage.setItem("vps_pending_role", roleMap[selectedRole]);
      window.localStorage.setItem("vps_resend_after", String(response.resend_after_seconds));
      router.push("/login/verify");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not send OTP";
      setFormError(message);
      showError(message);
      setLoading(false);
    }
  }

  async function handleOfficerLogin(e: React.FormEvent) {
    e.preventDefault();
    const roleMap: Record<string, Role> = { school: "school", deo: "deo", admin: "admin" };
    const r = roleMap[selectedRole] ?? "school";
    setRole(r);
    setLoading(true);
    try {
      const response = await api.sendOtp(officerId, "", r);
      window.localStorage.setItem("vps_pending_identifier", officerId);
      window.localStorage.setItem("vps_pending_role", r);
      window.localStorage.setItem("vps_resend_after", String(response.resend_after_seconds));
      router.push("/login/verify");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not send OTP";
      setFormError(message);
      showError(message);
      setLoading(false);
    }
  }

  const isStudent = selectedRole === "student";

  return (
    <PublicShell>
      <div className="max-w-[1240px] w-full mx-auto my-4 lg:my-8 px-2 md:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-xl overflow-hidden shadow-level-3 bg-surface-container-lowest">
          {/* ── LEFT PANE (blue) ─────────────────────────────────────── */}
          <div className="lg:col-span-5 bg-gradient-to-br from-primary via-primary-container to-primary p-6 sm:p-8 lg:p-10 text-on-primary flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-on-primary/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-6">
              {/* Gov header */}
              <div className="flex items-center gap-3 pb-4 border-b border-on-primary/10">
                <div className="w-12 h-12 rounded-xl bg-on-primary/10 backdrop-blur-md flex items-center justify-center shadow-sm">
                  <Icon name="account_balance" size={28} fill className="text-secondary" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-lg text-label-lg tracking-wide uppercase text-secondary">
                    <T gu="શિક્ષણ વિભાગ • ગુજરાત સરકાર" en="Education Dept • Govt of Gujarat" hi="शिक्षा विभाग • गुजरात सरकार" />
                  </span>
                  <span className="font-caption text-caption text-on-primary/70">
                    Department of Education • Gov of Gujarat
                  </span>
                </div>
              </div>

              {/* Headline */}
              <div className="flex flex-col gap-2">
                <span className="font-label-md text-label-md tracking-wider uppercase text-secondary bg-on-primary/10 px-3 py-1 rounded-full w-fit">
                  <T gu="એકિકૃત નાગરિક પોર્ટલ" en="Unified Citizen Portal" hi="एकीकृत नागरिक पोर्टल" />
                </span>
                <h1 className="font-headline-lg text-headline-lg text-on-primary tracking-tight leading-tight">
                  <T gu="એક વિદ્યાર્થી. એક આઈડી. બધી યોજનાઓ." en="One Student. One ID. All Schemes." hi="एक छात्र. एक ID. सभी योजनाएं." />
                </h1>
                <p className="font-body-sm text-body-sm text-on-primary/70 leading-relaxed">
                  One Single Secure Login for All Gujarat Educational Scholarships & Welfare Schemes.
                </p>
              </div>

              {/* Riya's sample card */}
              <div className="rounded-xl bg-on-primary/10 backdrop-blur-md p-4 text-on-primary shadow-lg flex flex-col gap-3 relative overflow-hidden">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 shadow-md bg-primary flex items-center justify-center font-title-lg text-on-primary font-bold">
                      RP
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-title-md text-title-md font-bold truncate">
                        <T gu="રિયા હસમુખભાઈ પટેલ" en="Riya H. Patel" hi="रिया एच. पटेल" />
                      </span>
                      <span className="font-caption text-caption text-on-primary/70 truncate">
                        <T gu="ધોરણ ૯-બી • આણંદ" en="Grade 9-B • Anand" hi="कक्षा 9-B • आणंद" />
                      </span>
                    </div>
                  </div>
                  <div className="bg-on-primary/20 text-on-primary px-2.5 py-1 rounded-full flex items-center gap-1 font-label-md text-label-md shrink-0">
                    <Icon name="verified" size={14} fill />
                    <span>DigiLocker</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {["નમો લક્ષ્મી • ₹50,000", "સરસ્વતી સાધના • QR", "OBC • મંજૂર"].map((t) => (
                    <div key={t} className="rounded-lg bg-on-primary/15 p-2 font-caption text-caption font-bold text-secondary">{t}</div>
                  ))}
                </div>
                <div className="flex items-center justify-between font-caption text-caption text-on-primary/70 pt-1">
                  <span className="flex items-center gap-1"><Icon name="account_balance_wallet" size={14} />DBT Active</span>
                  <span className="text-secondary font-semibold font-mono">GJ-AND-2026-004512</span>
                </div>
              </div>

              {/* Trust pillars */}
              <div className="flex flex-col gap-3 py-1">
                {[
                  { icon: "lock", gu: "DPDP કાયદો ૨૦૨૩ સુસંગત", en: "DPDP Act 2023 Compliant" },
                  { icon: "bolt", gu: "ત્વરિત ઓટો-વેરિફિકેશન", en: "Instant Auto-Verification" },
                  { icon: "payments", gu: "સીધું DBT (PFMS)", en: "Direct DBT via PFMS" },
                  { icon: "sms", gu: "પાસવર્ડ વગર OTP", en: "Passwordless OTP" },
                ].map(({ icon, gu, en }) => (
                  <div key={icon} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-on-primary/10 flex items-center justify-center shrink-0">
                      <Icon name={icon} size={18} className="text-secondary" />
                    </div>
                    <span className="font-label-lg text-label-lg font-bold text-on-primary">
                      <T gu={gu} en={en} hi={en} />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Help footer */}
            <div className="relative z-10 mt-6 pt-4 border-t border-on-primary/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <Icon name="support_agent" size={18} className="text-on-secondary" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-label-md text-secondary font-bold">
                  <T gu="ટોલ-ફ્રી હેલ્પલાઇન" en="Toll-Free Helpline" hi="टोल-फ्री हेल्पलाइन" />
                </span>
                <span className="font-caption text-caption text-on-primary/70 truncate">
                  1800-233-5500 • 8:00 – 20:00 (Working days)
                </span>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANE (form) ─────────────────────────────────── */}
          <div className="lg:col-span-7 bg-surface-container-lowest p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
            <div className="flex flex-col gap-6">
              {/* Greeting */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary font-label-md text-label-md font-semibold">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse-dot" />
                    <T gu="સ્વાગત છે • Vidya Pragati Setu" en="Welcome to Vidya Pragati Setu" hi="Vidya Pragati Setu में स्वागत है" />
                  </span>
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                  <T gu="સુરક્ષિત પોર્ટલ લૉગિન" en="Secure Portal Login" hi="सुरक्षित पोर्टल लॉगिन" />
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  <T
                    gu="તમારી ભૂમિકા પસંદ કરો અને OTP દ્વારા પ્રવેશ મેળવો."
                    en="Select your role and login via OTP."
                    hi="अपनी भूमिका चुनें और OTP से लॉगिन करें।"
                  />
                </p>
              </div>

              {/* Role selector */}
              <div className="flex flex-col gap-2">
                <span className="font-label-md text-label-md text-on-surface-variant font-semibold">
                  <T gu="તમારી ઓળખ પસંદ કરો:" en="Select Your Role:" hi="अपनी भूमिका चुनें:" />
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-surface-container-low rounded-xl">
                  {ROLES.map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setSelectedRole(r.key)}
                      className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-2.5 rounded-lg transition-all font-label-lg text-label-lg ${
                        selectedRole === r.key
                          ? "bg-surface-container-lowest text-primary shadow-sm font-bold"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      <Icon name={r.icon} size={20} fill={selectedRole === r.key} />
                      <span className="text-center text-xs sm:text-label-lg">
                        <T gu={r.gu} en={r.en} hi={r.en} />
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Student login form */}
              {isStudent ? (
                <div className="flex flex-col gap-4">
                  {/* Demo autofill */}
                  <div className="flex items-center justify-between bg-surface-container-low p-2.5 rounded-lg">
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon name="speed" size={18} className="text-secondary shrink-0" />
                      <span className="font-caption text-caption text-on-surface font-medium truncate">
                        <T gu="ડેમો: રિયા પટેલ (ધોરણ ૯-બી, આણંદ)" en="Demo: Riya Patel (Grade 9-B, Anand)" hi="डेमो: रिया पटेल" />
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={autoFill}
                      className="btn-cta flex items-center gap-1 px-3 py-1 rounded h-8 text-xs shrink-0"
                    >
                      <Icon name="auto_fix_high" size={14} />
                      <T gu="ઓટો-ફિલ" en="Auto-Fill" hi="ऑटो-भरें" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {formError && <p role="alert" className="text-danger text-sm">{formError}</p>}
                    {/* CTS ID */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="ctsId" className="font-label-lg text-label-lg text-on-surface flex items-center gap-1">
                        <T gu="CTS ID અથવા આધારના છેલ્લા ૪ અંક" en="CTS ID or Last 4 Aadhaar Digits" hi="CTS ID या आधार के अंतिम 4 अंक" />
                        <span className="text-danger font-bold">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <Icon name="fingerprint" size={20} className="text-on-surface-variant absolute left-3.5 pointer-events-none" />
                        <input
                          id="ctsId"
                          type="text"
                          required
                          value={ctsId}
                          onChange={(e) => setCtsId(e.target.value)}
                          placeholder="GJ-AND-2026-004512"
                          className="input pl-11"
                        />
                      </div>
                    </div>

                    {/* DOB */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="dob" className="font-label-lg text-label-lg text-on-surface flex items-center gap-1">
                        <T gu="જન્મ તારીખ" en="Date of Birth" hi="जन्म तिथि" />
                        <span className="text-danger font-bold">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <Icon name="calendar_today" size={20} className="text-on-surface-variant absolute left-3.5 pointer-events-none" />
                        <input
                          id="dob"
                          type="date"
                          required
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          className="input pl-11"
                        />
                      </div>
                    </div>

                    {/* Mobile */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="mobile" className="font-label-lg text-label-lg text-on-surface flex items-center gap-1">
                        <T gu="નોંધાયેલ મોબાઇલ નંબર" en="Registered Mobile Number" hi="पंजीकृत मोबाइल नंबर" />
                        <span className="text-danger font-bold">*</span>
                      </label>
                      <div className="flex gap-2">
                        <div className="h-11 px-3 bg-surface-container-high rounded border border-outline flex items-center gap-1 font-label-lg text-label-lg text-on-surface shrink-0">
                          <Icon name="call" size={16} />
                          <span>+91</span>
                        </div>
                        <input
                          id="mobile"
                          type="tel"
                          required
                          maxLength={10}
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          placeholder="98765 43210"
                          className="input flex-1"
                        />
                      </div>
                    </div>

                    {/* Consent */}
                    <div className="flex items-start gap-3 p-3 bg-surface-container-low/70 rounded-lg">
                      <input
                        type="checkbox"
                        id="consent"
                        required
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="w-4 h-4 mt-1 accent-primary rounded cursor-pointer"
                      />
                      <label htmlFor="consent" className="font-caption text-caption text-on-surface-variant leading-relaxed cursor-pointer select-none">
                        <T
                          gu="હું CTS / આધાર ડેટા ચકાસણી માટે સંમતિ આપું છું. (DPDP Act 2023)"
                          en="I consent to CTS/Aadhaar data verification for scholarship eligibility. (DPDP Act 2023)"
                          hi="मैं CTS/आधार डेटा सत्यापन के लिए सहमति देता/देती हूं। (DPDP Act 2023)"
                        />
                      </label>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-secondary hover:bg-secondary/90 text-on-secondary font-title-md text-title-md font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-60"
                    >
                      <Icon name="lock_open" size={20} />
                      <T gu="સુરક્ષિત OTP મોકલો" en="Send Secure OTP" hi="सुरक्षित OTP भेजें" />
                      <Icon name="arrow_forward" size={20} className="transition-transform group-hover:translate-x-1" />
                    </button>
                  </form>
                </div>
              ) : (
                /* Officer login form */
                <form onSubmit={handleOfficerLogin} className="flex flex-col gap-4 p-4 bg-surface-container-low rounded-xl">
                  <div className="flex items-center gap-2 text-primary font-label-lg text-label-lg font-bold">
                    <Icon name="security" size={22} />
                    <T gu="અધિકારી SSO / DSC લૉગિન" en="Officer SSO / DSC Login" hi="अधिकारी SSO / DSC लॉगिन" />
                  </div>
                  <input className="input" placeholder="Official User ID (UDISE/DEO)" type="text" required value={officerId} onChange={(event) => setOfficerId(event.target.value)} />
                  <input className="input" placeholder="Password / DSC PIN" type="password" />
                  <button type="submit" className="btn-primary w-full h-11 flex items-center justify-center gap-2 rounded">
                    <Icon name="badge" size={18} />
                    <T gu="SSO / DSC દ્વારા પ્રવેશ" en="Login via SSO / DSC" hi="SSO / DSC द्वारा लॉगिन" />
                  </button>
                </form>
              )}

              {/* Help section */}
              <div className="p-3.5 bg-surface-container-low rounded-xl flex items-start gap-3">
                <Icon name="contact_support" size={20} className="text-primary mt-0.5 shrink-0" />
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="font-label-md text-label-md text-on-surface font-bold">
                    <T gu="CTS ID ખબર નથી?" en="Don't know your CTS ID?" hi="CTS ID नहीं पता?" />
                  </span>
                  <p className="font-caption text-caption text-on-surface-variant leading-relaxed">
                    <T
                      gu="તમારી શાળા દ્વારા આપોઆપ નોંધણી થઈ ચૂકી છે."
                      en="Your school has already registered you automatically."
                      hi="आपका स्कूल आपको स्वचालित रूप से पंजीकृत कर चुका है।"
                    />
                    {" "}
                    <Link href="/login#ctsId" className="text-primary font-bold hover:underline">
                      <T gu="અહીં ક્લિક કરો →" en="Click here →" hi="यहाँ क्लिक करें →" />
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-6 pt-4 border-t border-surface-container flex flex-wrap items-center justify-between gap-3 font-caption text-caption text-on-surface-variant">
              {["enhanced_encryption:256-Bit SSL", "gavel:Gujarat Govt. Certified", "cloud_done:NIC State Data Centre"].map((s) => {
                const [icon, label] = s.split(":");
                return (
                  <div key={icon} className="flex items-center gap-1.5">
                    <Icon name={icon} size={14} fill className="text-primary" />
                    <span>{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
