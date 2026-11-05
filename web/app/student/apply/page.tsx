"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { StudentShell } from "@/components/shell/StudentShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import Link from "next/link";
import { useAppStore } from "@/lib/store";

interface Scheme {
  id: string;
  nameGu: string;
  nameEn: string;
  amount: string;
  detailGu: string;
  detailEn: string;
  icon: string;
  iconColor: string;
  disabled?: boolean;
  disabledReason?: string;
}

const SCHEMES: Scheme[] = [
  {
    id: "namo-lakshmi",
    nameGu: "૧. નમો લક્ષ્મી યોજના",
    nameEn: "1. Namo Lakshmi Yojana",
    amount: "₹10,000/yr",
    detailGu: "માસિક ₹1,000 DBT | ધો.9-12",
    detailEn: "Monthly ₹1,000 DBT | Grade 9-12",
    icon: "volunteer_activism",
    iconColor: "text-primary",
  },
  {
    id: "saraswati-cycle",
    nameGu: "૨. સરસ્વતી સાધના સાઇકલ",
    nameEn: "2. Saraswati Sadhana Cycle",
    amount: "Free Bicycle",
    detailGu: "QR-OTP ડિલિવરી | શાળા હેન્ડઓવર",
    detailEn: "QR-OTP delivery | School handover",
    icon: "pedal_bike",
    iconColor: "text-secondary",
  },
  {
    id: "gyan-setu",
    nameGu: "૩. જ્ઞાન સેતુ મેરિટ",
    nameEn: "3. Gyan Setu Merit Scholarship",
    amount: "₹12,000/yr",
    detailGu: "2 સમાન DBT હપ્તા",
    detailEn: "2 equal DBT instalments",
    icon: "emoji_events",
    iconColor: "text-primary",
  },
  {
    id: "nmms",
    nameGu: "૪. NMMS મેરિટ સ્કૉલ.",
    nameEn: "4. NMMS Merit Scholarship",
    amount: "₹12,000/yr",
    detailGu: "જ્ઞાન સેતુ સાથે Exclusive — આ નિષ્ક્રિય",
    detailEn: "Mutually exclusive with Gyan Setu — disabled",
    icon: "block",
    iconColor: "text-on-surface-variant",
    disabled: true,
    disabledReason: "ED/SCH/2024/78B",
  },
];

export default function OneClickApplyPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(["namo-lakshmi", "saraswati-cycle", "gyan-setu"]);
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addAppliedScheme, showSuccess } = useAppStore();

  function toggleScheme(id: string) {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) return;
    setLoading(true);
    setTimeout(() => {
      selected.forEach((id) => addAppliedScheme(id));
      showSuccess(`અરજી સંપન્ન! ${selected.length} યોજના માટે / Applied to ${selected.length} scheme(s)`);
      setSubmitted(true);
      setLoading(false);
      setTimeout(() => router.push("/student/applications"), 1500);
    }, 1200);
  }

  const totalBenefit = selected.includes("namo-lakshmi") && selected.includes("gyan-setu")
    ? "₹22,000 + સાઇકલ"
    : selected.includes("namo-lakshmi")
    ? "₹10,000 + (Cycle if selected)"
    : "Selected schemes";

  return (
    <StudentShell>
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
                <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 font-bold text-sm">RP</div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-title-md text-title-md text-on-surface truncate">
                      <T gu="રિયા પટેલ" en="Riya Patel" hi="रिया पटेल" />
                    </span>
                    <span className="font-caption text-caption px-1.5 py-0.5 rounded-full bg-surface-container-high text-primary font-semibold shrink-0">9-B</span>
                  </div>
                  <span className="font-caption text-caption text-on-surface-variant truncate">GJ-AND-2026-004512 • Sardar Patel HS, Anand</span>
                </div>
              </div>
              <Icon name="verified" size={20} className="text-primary shrink-0" />
            </div>
          </div>

          {/* AI Recommendation tip */}
          <div className="bg-surface-container-high p-4 rounded-xl flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 mt-0.5">
              <Icon name="auto_awesome" size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-title-md text-title-md text-primary">
                  <T gu="સ્માર્ટ સંયોજન" en="Smart Combination" hi="स्मार्ट संयोजन" />
                </span>
                <span className="font-caption text-caption px-2 py-0.5 rounded-full bg-surface-container-lowest text-primary font-semibold">AI Optimal</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-snug">
                <T
                  gu="ગુજ. સ. નિયમ હેઠળ મહત્તમ લાભ — NMMS Exclusive rule self-applied."
                  en="Max benefit under Gujarat rules — NMMS exclusivity rule auto-applied."
                  hi="गुजरात नियमों के तहत अधिकतम लाभ — NMMS Exclusive नियम स्वचालित।"
                />
              </p>
            </div>
          </div>

          {/* Schemes list */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                <T gu={`પસંદ: ${selected.length}/4 યોજ.`} en={`Selected: ${selected.length}/4 schemes`} hi={`चयनित: ${selected.length}/4 योजनाएं`} />
              </span>
              <span className="font-caption text-caption text-primary font-medium">{totalBenefit}</span>
            </div>

            {SCHEMES.map((scheme) => (
              <div key={scheme.id}>
                {scheme.disabled ? (
                  <div className="relative bg-surface-container-low p-4 rounded-xl opacity-70 cursor-not-allowed">
                    <div className="flex items-start gap-3">
                      <input type="checkbox" disabled className="w-5 h-5 mt-1 accent-outline rounded cursor-not-allowed shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-title-md text-title-md text-on-surface-variant line-through truncate">
                            <T gu={scheme.nameGu} en={scheme.nameEn} hi={scheme.nameEn} />
                          </span>
                          <span className="bg-surface-container-high text-on-surface-variant font-caption text-caption px-2 py-0.5 rounded-full shrink-0">
                            <T gu="Exclusive" en="Exclusive" hi="Exclusive" />
                          </span>
                        </div>
                        <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant leading-snug">
                          <T
                            gu="જ્ઞાન સેતુ સાથે Exclusive (₹12,000 > ₹12,000). Rule: ED/SCH/2024/78B."
                            en="Mutually exclusive with Gyan Setu (₹12,000 > ₹12,000). Rule: ED/SCH/2024/78B."
                            hi="ज्ञान सेतु के साथ Exclusive। नियम: ED/SCH/2024/78B।"
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className="group relative bg-surface-container-lowest p-4 rounded-xl shadow-sm cursor-pointer block hover:bg-surface-container-low transition-all">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(scheme.id)}
                        onChange={() => toggleScheme(scheme.id)}
                        className="w-5 h-5 mt-1 accent-primary rounded cursor-pointer shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-title-md text-title-md text-on-surface truncate">
                            <T gu={scheme.nameGu} en={scheme.nameEn} hi={scheme.nameEn} />
                          </span>
                          <span className="bg-success-container text-on-success-container font-label-md text-label-md px-2 py-0.5 rounded-full shrink-0 flex items-center gap-0.5">
                            <Icon name="check_circle" size={14} />
                            <T gu="પાત્ર" en="Eligible" hi="पात्र" />
                          </span>
                        </div>
                        <div className="mt-1 flex items-baseline gap-2 flex-wrap">
                          <span className={`font-title-lg text-title-lg font-bold ${scheme.iconColor}`}>{scheme.amount}</span>
                          <span className="font-caption text-caption text-on-surface-variant">
                            <T gu={scheme.detailGu} en={scheme.detailEn} hi={scheme.detailEn} />
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-1 text-on-surface-variant font-caption text-caption">
                          <Icon name={scheme.icon} size={16} className={scheme.iconColor} />
                          <span>DBT / Direct Benefit Transfer</span>
                        </div>
                      </div>
                    </div>
                  </label>
                )}
              </div>
            ))}
          </div>

          {/* DBT Bank card */}
          <div className="card p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                <T gu="DBT ખાતું" en="DBT Account" hi="DBT खाता" />
              </span>
              <span className="font-caption text-caption text-on-surface-variant">NPCI Active</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                <Icon name="account_balance" size={28} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-title-md text-title-md text-on-surface truncate block">
                  <T gu="હેતલબેન પટેલ (માતા)" en="Hetalben Patel (Mother)" hi="हेतलबेन पटेल (माता)" />
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant block">State Bank of India •••• 4521</span>
                <span className="font-caption text-caption text-on-surface-variant block">IFSC: SBIN0001234 • Anand Branch</span>
              </div>
            </div>
            <div className="bg-surface-container-low p-3 rounded-lg flex flex-wrap gap-3 items-center justify-between">
              <div className="flex items-center gap-1 text-primary font-caption text-caption font-semibold">
                <Icon name="fingerprint" size={16} />Aadhaar Seeded ✓
              </div>
              <div className="flex items-center gap-1 text-primary font-caption text-caption font-semibold">
                <Icon name="verified_user" size={16} />PFMS / NPCI ✓
              </div>
            </div>
          </div>

          {/* Consent */}
          <div className="flex items-start gap-3 p-4 bg-surface-container-low rounded-xl">
            <input
              type="checkbox"
              id="consent"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="w-5 h-5 mt-0.5 accent-primary rounded shrink-0"
            />
            <label htmlFor="consent" className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed cursor-pointer">
              <T
                gu="હું ઉક્ત તમામ વિગતોની ચોકસાઈ ખાતરી આપું છું. DPDP Act 2023 સસ. ગ. સ. રૂ.1000 OTP ચકાસ."
                en="I confirm accuracy of all details above. DPDP Act 2023 compliant. Gujarat Govt OTP verification at ₹1000 DBT milestone."
                hi="मैं उपरोक्त सभी विवरणों की सटीकता की पुष्टि करता/करती हूं। DPDP Act 2023।"
              />
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!consent || selected.length === 0 || loading}
            className="w-full h-14 bg-secondary text-on-secondary font-title-md text-title-md font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Icon name="hourglass_top" size={22} />
                <T gu="સબમિટ કરી રહ્યા..." en="Submitting..." hi="सबमिट हो रहा है..." />
              </>
            ) : (
              <>
                <Icon name="send" size={22} />
                <T gu={`${selected.length} યોજ. One-Click Submit`} en={`Submit ${selected.length} Schemes`} hi={`${selected.length} योजनाएं सबमिट करें`} />
              </>
            )}
          </button>
          <p className="text-center font-caption text-caption text-on-surface-variant">
            <T gu="OTP ચકાસ. • PFMS DBT • DPDP Compliant" en="OTP verified • PFMS DBT • DPDP Compliant" hi="OTP सत्यापित • PFMS DBT • DPDP" />
          </p>
        </form>
      )}
    </StudentShell>
  );
}
