import Link from "next/link";
import { PublicShell } from "@/components/shell/PublicShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";

const SCHEMES = [
  {
    id: "namo-lakshmi",
    name: { gu: "નમો લક્ષ્મી યોજના", en: "Namo Lakshmi Yojana", hi: "नमो लक्ष्मी योजना" },
    amount: "₹50,000",
    target: { gu: "ધો. ૯-૧૨ | કન્યા", en: "Grade 9-12 | Girls", hi: "कक्षा 9-12 | बालिका" },
    icon: "volunteer_activism",
    color: "bg-primary/10 text-primary",
  },
  {
    id: "nmms",
    name: { gu: "NMMS શિષ્યવૃત્તિ", en: "NMMS Scholarship", hi: "NMMS छात्रवृत्ति" },
    amount: "₹12,000/yr",
    target: { gu: "ધો. ૯-૧૨ | મેરિટ", en: "Grade 9-12 | Merit", hi: "कक्षा 9-12 | मेरिट" },
    icon: "emoji_events",
    color: "bg-warning/10 text-warning",
  },
  {
    id: "saraswati-cycle",
    name: { gu: "સરસ્વતી સાધના સાયકલ", en: "Saraswati Sadhana Cycle", hi: "सरस्वती साधना साइकिल" },
    amount: { gu: "વિનામૂલ્યે સાઇકલ", en: "Free Bicycle", hi: "मुफ्त साइकिल" },
    target: { gu: "ધો. ૯ | કન્યા", en: "Grade 9 | Girls", hi: "कक्षा 9 | बालिका" },
    icon: "pedal_bike",
    color: "bg-secondary/10 text-secondary",
  },
  {
    id: "gnasadhana",
    name: { gu: "જ્ઞાન સાધના", en: "Gnan Sadhana", hi: "ज्ञान साधना" },
    amount: "₹5,000/yr",
    target: { gu: "ધો. ૮ | SC/ST", en: "Grade 8 | SC/ST", hi: "कक्षा 8 | SC/ST" },
    icon: "auto_stories",
    color: "bg-tertiary/10 text-tertiary",
  },
  {
    id: "obc-scholarship",
    name: { gu: "OBC કેટેગરી સહાય", en: "OBC Category Scholarship", hi: "OBC श्रेणी सहायता" },
    amount: "₹3,000-15,000",
    target: { gu: "ધો. ૧-૧૨ | OBC", en: "Grade 1-12 | OBC", hi: "कक्षा 1-12 | OBC" },
    icon: "diversity_3",
    color: "bg-success/10 text-success",
  },
  {
    id: "pre-matric",
    name: { gu: "પૂર્વ-મેટ્રિક સ્કૉલરશિપ", en: "Pre-Matric Scholarship", hi: "पूर्व-मैट्रिक छात्रवृत्ति" },
    amount: "₹1,500-7,500",
    target: { gu: "ધો. ૧-૮ | SC/ST/OBC", en: "Grade 1-8 | SC/ST/OBC", hi: "कक्षा 1-8 | SC/ST/OBC" },
    icon: "school",
    color: "bg-info/10 text-info",
  },
];

const HOW_STEPS = [
  {
    num: "1",
    icon: "login",
    gu: "CTS ID / OTP લૉગિન",
    en: "Login via CTS ID & OTP",
    hi: "CTS ID/OTP से लॉगिन",
    desc: { gu: "૧૮-અંકના CTS ID + DOB + OTP. પાસવર્ડ નહીં.", en: "18-digit CTS ID + DOB + OTP. No password needed.", hi: "18-अंक CTS ID + DOB + OTP। कोई पासवर्ड नहीं।" },
  },
  {
    num: "2",
    icon: "cloud_upload",
    gu: "AI OCR ડૉક્સ",
    en: "AI OCR Document Upload",
    hi: "AI OCR दस्तावेज़ अपलोड",
    desc: { gu: "એકવાર અપલોડ, AI OCR ડેટા ઓળખે, DigiLocker સ્વીકૃત.", en: "Upload once, AI OCR extracts data, DigiLocker accepted.", hi: "एक बार अपलोड करें, AI OCR डेटा निकालता है।" },
  },
  {
    num: "3",
    icon: "done_all",
    gu: "One-Click અરજી",
    en: "One-Click Apply",
    hi: "एक-क्लिक आवेदन",
    desc: { gu: "પાત્ર તમામ યોજનાઓ માટે એક ક્લિકમાં, NMMS exclusive જળવાય.", en: "Apply to all eligible schemes in one click. NMMS exclusivity respected.", hi: "सभी पात्र योजनाओं के लिए एक क्लिक।" },
  },
  {
    num: "4",
    icon: "account_balance",
    gu: "DBT ડાયરેક્ટ ક્રેડિટ",
    en: "DBT Direct Bank Credit",
    hi: "DBT सीधे बैंक में",
    desc: { gu: "PFMS-verified DBT, UTR સહ, SMS/app notification.", en: "PFMS-verified DBT with UTR. SMS + app notification.", hi: "PFMS-verified DBT, UTR सहित।" },
  },
];

const PORTAL_CARDS = [
  {
    role: "school",
    icon: "apartment",
    gu: "શાળા / આચાર્ય",
    en: "School / Principal Portal",
    hi: "शाला / प्रधानाचार्य पोर्टल",
    desc: { gu: "વિદ્યાર્થી ચકાસણી, ઉપસ્થિતિ, ગુણ, સાઇકલ", en: "Student verification, attendance, marks, cycle handover", hi: "छात्र सत्यापन, उपस्थिति, अंक, साइकिल" },
    href: "/school",
    color: "bg-primary",
  },
  {
    role: "deo",
    icon: "corporate_fare",
    gu: "DEO / TPEO",
    en: "DEO / Taluka Officer",
    hi: "DEO / तालुका अधिकारी",
    desc: { gu: "બૅચ મંજૂરી, સાઇકલ ટ્રૅક, ગ્રીવ", en: "Bulk approvals, cycle tracking, grievance management", hi: "थोक अनुमोदन, साइकिल ट्रैकिंग" },
    href: "/deo",
    color: "bg-tertiary",
  },
  {
    role: "admin",
    icon: "policy",
    gu: "રાજ્ય સ્તર",
    en: "State Admin Portal",
    hi: "राज्य स्तरीय पोर्टल",
    desc: { gu: "Analytics, Rule Builder, Fund Tracker, Fraud Detection", en: "Analytics, Rule Builder, Fund Tracker, Fraud Detection", hi: "Analytics, नियम, फंड, धोखाधड़ी" },
    href: "/admin",
    color: "bg-success",
  },
  {
    role: "vendor",
    icon: "local_shipping",
    gu: "વિક્રેતા",
    en: "Vendor Portal",
    hi: "विक्रेता पोर्टल",
    desc: { gu: "સાઇકલ બૅચ, QR, GPS ટ્રૅક, ચલણ", en: "Cycle batch dispatch, QR, GPS tracking, delivery challan", hi: "साइकिल बैच, QR, GPS, चालान" },
    href: "/vendor",
    color: "bg-secondary",
  },
];

export default function HomePage() {
  return (
    <PublicShell>
      {/* ── HERO ───────────────────────────────────────────── */}
      <section id="home" className="relative w-full overflow-hidden bg-gradient-to-b from-surface-container-high/40 via-surface to-surface">
        <div className="absolute -top-32 right-[-5%] w-[580px] h-[580px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-[-10%] w-[420px] h-[420px] rounded-full bg-secondary/5 blur-3xl pointer-events-none" />

        <div className="page-container py-space-xl lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            {/* Left: Text */}
            <div className="lg:col-span-7 flex flex-col gap-space-lg">
              {/* Badge */}
              <div className="inline-flex items-center gap-space-sm self-start px-space-md py-space-xs rounded-full bg-surface-container-lowest shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse-dot" />
                <Icon name="verified" size={16} fill className="text-primary" />
                <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">
                  <T
                    gu="ગુજરાત સરકાર • ડિજિટલ ગુજરાત"
                    en="Govt of Gujarat • Digital Gujarat Initiative"
                    hi="गुजरात सरकार • डिजिटल गुजरात"
                  />
                </span>
              </div>

              {/* Headline */}
              <div className="flex flex-col gap-space-xs">
                <h1 className="font-display text-display text-on-surface leading-[1.12] tracking-tight">
                  <T gu="એક વિદ્યાર્થી. એક આઈડી." en="One Student. One ID." hi="एक छात्र. एक ID." />{" "}
                  <br />
                  <span className="text-primary">
                    <T gu="બધી યોજનાઓ." en="All Schemes." hi="सभी योजनाएं." />
                  </span>
                </h1>
                <p className="font-title-lg text-title-lg text-secondary font-semibold">
                  Ek Student. Ek ID. Saari Yojanayein.
                </p>
              </div>

              {/* Body */}
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                <T
                  gu="નમો લક્ષ્મી, NMMS, સરસ્વતી સાધના સાયકલ, જ્ઞાન સાધના — હવે એક જ પ્લેટફૉર્મ. એકવાર ડૉક, એક ક્લિકમાં અરજી, DBT સીધા ખાતામાં."
                  en="Namo Lakshmi, NMMS, Saraswati Sadhana Cycle, Gnan Sadhana — now on one platform. Upload once, apply in one click, DBT directly to bank."
                  hi="नमो लक्ष्मी, NMMS, सरस्वती साधना साइकिल — अब एक प्लेटफॉर्म पर। एक बार अपलोड करें, एक क्लिक में आवेदन करें।"
                />
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-space-sm px-7 py-3.5 rounded-xl bg-secondary text-on-secondary font-label-lg text-label-lg shadow-lg hover:opacity-90 transition-all hover:-translate-y-0.5"
                >
                  <Icon name="fingerprint" size={22} />
                  <T gu="વિદ્યાર્થી લૉગિન" en="Student Login" hi="छात्र लॉगिन" />
                  <Icon name="arrow_forward" size={18} />
                </Link>
                <a
                  href="#portals"
                  className="inline-flex items-center justify-center gap-space-sm px-6 py-3.5 rounded-xl bg-surface-container-lowest text-primary hover:bg-surface-container-high font-label-lg text-label-lg shadow-sm transition-colors"
                >
                  <Icon name="school" size={20} />
                  <T gu="શાળા / અધિકારી" en="School / Officer Portal" hi="शाला / अधिकारी पोर्टल" />
                </a>
              </div>

              {/* Trust pill */}
              <div className="flex items-center gap-space-sm font-caption text-caption text-on-surface-variant -mt-2">
                <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-label-md">
                  CTS ID / Aadhaar OTP
                </span>
                <T gu="કોઈ પાસવર્ડ નહીં • સુરક્ષિત" en="No password • Secure & instant" hi="कोई पासवर्ड नहीं • सुरक्षित" />
              </div>

              {/* Trust signals */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
                {[
                  { gu: "DigiLocker", en: "DigiLocker Integrated" },
                  { gu: "૧૦૦% Paperless", en: "100% Paperless" },
                  { gu: "PFMS DBT", en: "PFMS Verified DBT" },
                  { gu: "ગુજ/EN સહાય", en: "Gujarati/EN Support" },
                ].map((s) => (
                  <div key={s.en} className="flex items-center gap-space-xs">
                    <Icon name="check_circle" size={18} fill className="text-success" />
                    <span className="font-caption text-caption text-on-surface font-semibold">
                      <T gu={s.gu} en={s.en} hi={s.en} />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Hero card */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 via-surface-container-high/60 to-secondary/10 rounded-3xl blur-2xl -z-10" />
              <div className="relative w-full max-w-[440px] rounded-2xl overflow-hidden bg-surface-container-lowest shadow-level-3">
                {/* Visual placeholder (replaces external img) */}
                <div className="relative h-[380px] w-full overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/10 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4 text-center p-8">
                    <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-level-2">
                      <span className="font-display text-display text-on-primary font-bold">RP</span>
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded mb-2">
                        <Icon name="verified" size={14} fill className="text-primary" />
                        <span className="font-label-md text-label-md text-primary font-bold">DigiLocker Verified</span>
                      </div>
                      <p className="font-title-lg text-title-lg text-on-surface font-bold">
                        <T gu="રિયા એમ. પટેલ" en="Riya M. Patel" hi="रिया एम. पटेल" />
                      </p>
                      <p className="font-caption text-caption text-on-surface-variant">
                        <T gu="ધો. ૯-બી • આણંદ" en="Grade 9-B • Anand" hi="कक्षा 9-B • आणंद" />
                      </p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant font-mono mt-1">GJ-AND-2026-004512</p>
                    </div>
                  </div>
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-on-primary">
                    <span className="font-label-md text-label-md bg-primary px-2 py-0.5 rounded inline-block mb-1">
                      <T gu="ધો. ૧૦ • આણંદ" en="Grade 10 • Anand" hi="कक्षा 10 • आणंद" />
                    </span>
                    <p className="font-title-lg text-title-lg">
                      <T gu="રિયા એમ. પટેલ" en="Riya M. Patel" hi="रिया एम. पटेल" />
                    </p>
                    <p className="font-caption text-caption text-on-primary/70">GJ-AND-2026-004512</p>
                  </div>
                </div>

                {/* Floating badge — Namo Lakshmi */}
                <div className="absolute -top-3 -right-3 sm:-right-5 bg-surface-container-lowest/95 backdrop-blur-md px-space-md py-space-sm rounded-xl shadow-level-2 max-w-[200px]">
                  <div className="flex items-center gap-space-xs mb-1">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    <span className="font-label-md text-label-md text-success font-bold">
                      <T gu="પાત્ર ✓" en="Eligible ✓" hi="पात्र ✓" />
                    </span>
                  </div>
                  <p className="font-title-md text-title-md text-primary leading-tight">
                    <T gu="નમો લક્ષ્મી" en="Namo Lakshmi" hi="नमो लक्ष्मी" />
                  </p>
                  <p className="font-caption text-caption text-on-surface-variant">₹50,000</p>
                </div>

                {/* Floating badge — Cycle */}
                <div className="absolute bottom-28 -left-3 sm:-left-6 bg-surface-container-lowest/95 backdrop-blur-md p-space-sm rounded-xl shadow-level-2 flex items-center gap-space-sm max-w-[220px]">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <Icon name="pedal_bike" size={24} className="text-secondary" />
                  </div>
                  <div>
                    <span className="font-label-md text-label-md text-secondary font-bold block">
                      <T gu="સરસ્વતી સાઇકલ" en="Saraswati Cycle" hi="सरस्वती साइकिल" />
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant flex items-center gap-1">
                      <Icon name="qr_code_scanner" size={12} className="text-success" />
                      <T gu="ડિલિવરી તૈયાર" en="Ready for Delivery" hi="डिलीवरी के लिए तैयार" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── IMPACT STATS ───────────────────────────────────── */}
      <section className="bg-primary py-10">
        <div className="page-container grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { val: "₹847 Cr", gu: "DBT ચૂકવ્યા", en: "DBT Disbursed" },
            { val: "12.4 L", gu: "વિદ્યાર્થી", en: "Students Covered" },
            { val: "33,841", gu: "શાળાઓ", en: "Schools Onboarded" },
            { val: "98.2%", gu: "સ્વ-ચાલિત ચકાસણી", en: "Auto-Verified" },
          ].map((s) => (
            <div key={s.en} className="text-on-primary">
              <p className="font-headline-lg text-headline-lg font-bold">{s.val}</p>
              <p className="font-body-sm text-body-sm text-on-primary/70">
                <T gu={s.gu} en={s.en} hi={s.en} />
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SCHEMES ──────────────────────────────────────────── */}
      <section id="schemes" className="py-16 bg-surface">
        <div className="page-container">
          <div className="text-center mb-10">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              <T gu="ઉપલબ્ધ યોજનાઓ" en="Available Schemes" hi="उपलब्ध योजनाएं" />
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              <T gu="ગુજરાત સરકારની ૬+ શૈક્ષણિક સહાય યોજનાઓ" en="6+ Gujarat Government educational scholarship schemes" hi="गुजरात सरकार की 6+ छात्रवृत्ति योजनाएं" />
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SCHEMES.map((s) => (
              <Link key={s.id} href={`/student/schemes/${s.id}`} className="card p-5 hover:shadow-level-2 transition-all group hover:-translate-y-0.5">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center shrink-0`}>
                    <Icon name={s.icon} size={22} />
                  </div>
                  <div>
                    <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                      <T gu={s.name.gu} en={s.name.en} hi={s.name.hi} />
                    </h3>
                    <p className="font-caption text-caption text-on-surface-variant">
                      <T gu={s.target.gu} en={s.target.en} hi={s.target.hi} />
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">
                    {typeof s.amount === "string" ? s.amount : <T gu={s.amount.gu} en={s.amount.en} hi={s.amount.hi} />}
                  </span>
                  <Icon name="arrow_forward" size={18} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section id="how" className="py-16 bg-surface-container-low">
        <div className="page-container">
          <div className="text-center mb-10">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              <T gu="કેવી રીતે કાર્ય કરે છે?" en="How it Works?" hi="यह कैसे काम करता है?" />
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_STEPS.map((step, i) => (
              <div key={i} className="card p-5 text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-on-primary font-headline-sm text-headline-sm font-bold flex items-center justify-center mx-auto mb-4">
                  {step.num}
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon name={step.icon} size={22} className="text-primary" />
                </div>
                <h3 className="font-title-md text-title-md text-on-surface font-semibold mb-2">
                  <T gu={step.gu} en={step.en} hi={step.hi} />
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  <T gu={step.desc.gu} en={step.desc.en} hi={step.desc.hi} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTALS ──────────────────────────────────────── */}
      <section id="portals" className="py-16 bg-surface">
        <div className="page-container">
          <div className="text-center mb-10">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              <T gu="અધિકારી પોર્ટલ" en="Officer Portals" hi="अधिकारी पोर्टल" />
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              <T gu="ભૂમિકા અનુસાર ડૅશબૉર્ડ" en="Role-based dashboards for each stakeholder" hi="प्रत्येक हितधारक के लिए भूमिका-आधारित डैशबोर्ड" />
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PORTAL_CARDS.map((p) => (
              <Link key={p.role} href={p.href} className="card p-5 hover:shadow-level-2 transition-all group hover:-translate-y-0.5">
                <div className={`w-12 h-12 rounded-xl ${p.color} flex items-center justify-center mb-4`}>
                  <Icon name={p.icon} size={26} className="text-on-primary" />
                </div>
                <h3 className="font-title-lg text-title-lg text-on-surface font-semibold mb-1">
                  <T gu={p.gu} en={p.en} hi={p.hi} />
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  <T gu={p.desc.gu} en={p.desc.en} hi={p.desc.hi} />
                </p>
                <div className="flex items-center gap-1 text-primary font-label-md text-label-md mt-3 group-hover:gap-2 transition-all">
                  <T gu="પ્રવેશ" en="Access Portal" hi="पोर्टल एक्सेस" />
                  <Icon name="arrow_forward" size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-container">
        <div className="page-container text-center text-on-primary">
          <h2 className="font-headline-lg text-headline-lg font-bold mb-4">
            <T gu="આજે જ શરૂ કરો" en="Start Today" hi="आज ही शुरू करें" />
          </h2>
          <p className="font-body-lg text-body-lg text-on-primary/80 max-w-2xl mx-auto mb-8">
            <T
              gu="₹847 કરોડ+ DBT ટ્રાન્સ ✓ | 12.4 લાખ+ વિદ્યાર્થી ✓ | 33,841 શાળા ✓"
              en="₹847 Cr+ DBT transferred ✓ | 12.4 Lakh+ students ✓ | 33,841 schools ✓"
              hi="₹847 करोड़+ DBT ✓ | 12.4 लाख+ छात्र ✓ | 33,841 स्कूल ✓"
            />
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-secondary text-on-secondary font-title-md text-title-md font-bold shadow-lg hover:opacity-90 transition-all"
          >
            <Icon name="fingerprint" size={24} />
            <T gu="CTS ID / OTP થી લૉગિન" en="Login with CTS ID & OTP" hi="CTS ID/OTP से लॉगिन" />
          </Link>
          <p className="font-caption text-caption text-on-primary/60 mt-4">
            <T gu="કોઈ પાસવર્ડ નહીં • DPDP 2023 Compliant" en="No password • DPDP 2023 Compliant" hi="कोई पासवर्ड नहीं • DPDP 2023" />
          </p>
        </div>
      </section>
    </PublicShell>
  );
}
