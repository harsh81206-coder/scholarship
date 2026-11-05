import { StudentShell } from "@/components/shell/StudentShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { StatusChip } from "@/components/ui";
import Link from "next/link";

interface PageProps {
  params: { id: string };
}

const ELIGIBILITY_RULES = [
  {
    icon: "female",
    gu: "જાતિ: કન્યા (Female)",
    en: "Gender: Female",
    hi: "लिंग: महिला",
    detail: { gu: "CTS રેકોર્ડ સાથે સુમેળ", en: "Matched with CTS school record", hi: "CTS रिकॉर्ड से मेल" },
    pass: true,
  },
  {
    icon: "menu_book",
    gu: "પ્રવેશ: ધોરણ ૯ (Class 9-B)",
    en: "Enrollment: Grade 9 (Class 9-B)",
    hi: "प्रवेश: कक्षा 9 (9-B)",
    detail: { gu: "માન્ય: ધો. ૯–૧૨", en: "Valid: Grade 9–12", hi: "मान्य: कक्षा 9–12" },
    pass: true,
  },
  {
    icon: "calendar_today",
    gu: "હાજરી: ૮૯% (Attendance)",
    en: "Attendance: 89%",
    hi: "उपस्थिति: 89%",
    detail: { gu: "ન્યૂનતમ: ૭૫% | તમારી: ૮૯%", en: "Minimum: 75% | Yours: 89%", hi: "न्यूनतम: 75% | आपकी: 89%" },
    pass: true,
    progress: 89,
  },
  {
    icon: "account_balance",
    gu: "સરકારી શાળા (Government School)",
    en: "Government School",
    hi: "सरकारी स्कूल",
    detail: { gu: "UDISE: 24150104502 ✓", en: "UDISE: 24150104502 ✓", hi: "UDISE: 24150104502 ✓" },
    pass: true,
  },
  {
    icon: "currency_rupee",
    gu: "પારિવારિક આવક < ₹2 લાખ",
    en: "Family Income < ₹2 Lakh",
    hi: "पारिवारिक आय < ₹2 लाख",
    detail: { gu: "DigiLocker EWS / Income cert ✓", en: "DigiLocker EWS / Income cert ✓", hi: "DigiLocker EWS सर्टिफिकेट ✓" },
    pass: true,
  },
];

const TIMELINE = [
  { gu: "ઓનલાઇન અરજી", en: "Online Application", hi: "ऑनलाइन आवेदन", icon: "edit_note" },
  { gu: "શાળા ચકાસણી", en: "School Verification", hi: "स्कूल सत्यापन", icon: "fact_check" },
  { gu: "DEO મંજૂરી", en: "DEO Approval", hi: "DEO अनुमोदन", icon: "approval" },
  { gu: "PFMS ચૂકવણી", en: "PFMS Payment", hi: "PFMS भुगतान", icon: "account_balance" },
];

export default function SchemeDetailPage({ params }: PageProps) {
  const _isNamoLakshmi = !params.id || params.id === "namo-lakshmi";
  void _isNamoLakshmi;

  return (
    <StudentShell>
      <div className="flex flex-col gap-4 pb-6">
        {/* Back + gov badge row */}
        <div className="px-4 pt-2 pb-1 flex items-center justify-between">
          <Link href="/student" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shadow-sm">
            <Icon name="arrow_back" size={20} />
          </Link>
          <div className="flex items-center gap-1 bg-surface-container-high px-3 py-1 rounded-full">
            <Icon name="verified" size={14} fill className="text-primary" />
            <span className="font-label-md text-label-md text-primary font-semibold">
              <T gu="ગુજ. સરકાર • શિક્ષણ વિભ." en="Gujarat Govt • Education Dept" hi="गुज. सरकार • शिक्षा विभाग" />
            </span>
          </div>
          <button className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
            <Icon name="bookmark_border" size={20} />
          </button>
        </div>

        {/* Scheme title card */}
        <div className="mx-4">
          <div className="card p-4 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-surface-container-high opacity-40 pointer-events-none" />
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-primary shrink-0 shadow-md">
                <Icon name="school" size={26} />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="font-caption text-caption uppercase tracking-wider text-on-surface-variant font-semibold">
                    <T gu="કન્યા કેળવણી યોજના" en="Girl Education Scheme" hi="बालिका शिक्षा योजना" />
                  </span>
                  <span className="w-1 h-1 rounded-full bg-outline-variant" />
                  <span className="font-caption text-caption text-primary font-semibold">NL-2026</span>
                </div>
                <h1 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-snug mt-0.5">
                  <T gu="નમો લક્ષ્મી યોજના" en="Namo Lakshmi Yojana" hi="नमो लक्ष्मी योजना" />
                </h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Namo Lakshmi Yojana</p>
              </div>
            </div>

            {/* Amount pill */}
            <div className="mt-3 bg-surface-container rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center font-bold text-on-secondary text-xs">₹</div>
                <div className="flex flex-col">
                  <span className="font-label-lg text-label-lg text-primary font-bold">
                    <T gu="૪ વર્ષ | કુલ ₹૫૦,૦૦૦" en="4 Years | Total ₹50,000" hi="4 साल | कुल ₹50,000" />
                  </span>
                  <span className="font-caption text-caption text-on-surface-variant">
                    <T gu="ધો.૯–૧૨ | માસિક DBT" en="Grade 9–12 | Monthly DBT" hi="कक्षा 9–12 | मासिक DBT" />
                  </span>
                </div>
              </div>
              <Icon name="payments" size={20} className="text-primary" />
            </div>

            {/* Student identifier */}
            <div className="flex items-center justify-between pt-2 mt-1 border-t border-outline-variant">
              <div className="flex items-center gap-1">
                <Icon name="person" size={16} className="text-on-surface-variant" />
                <span className="font-caption text-caption text-on-surface-variant">
                  <T gu="રિયા પટેલ (ધો. ૯-B)" en="Riya Patel (Gr 9-B)" hi="रिया पटेल (कक्षा 9-B)" />
                </span>
              </div>
              <span className="font-caption text-caption text-on-surface-variant">
                <T gu="આણંદ જિ." en="Anand Dist." hi="आणंद जिला" />
              </span>
            </div>
          </div>
        </div>

        {/* Eligibility verdict */}
        <div className="mx-4">
          <div className="card p-4 relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-full bg-success-container text-on-success-container flex items-center justify-center shrink-0">
                <Icon name="check_circle" size={24} fill />
              </div>
              <div className="flex flex-col flex-1">
                <StatusChip status="approved" label="Eligible ✓ | પાત્ર" />
                <h2 className="font-title-md text-title-md text-on-surface font-semibold mt-1">
                  <T gu="તમારી અરજી મંજૂર થઈ શકે છે" en="Your application can be approved" hi="आपका आवेदन स्वीकार हो सकता है" />
                </h2>
                <p className="font-caption text-caption text-on-surface-variant mt-0.5 leading-relaxed">
                  <T
                    gu="CTS ના આધારે શાળા રેકોર્ડ્સ અને નિયમોની ચકાસણી આપોઆપ."
                    en="School records and rules automatically verified via CTS."
                    hi="CTS के आधार पर स्कूल रिकॉर्ड और नियमों की स्वचालित जांच।"
                  />
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1 mt-3 bg-surface-container-low rounded-lg p-2.5">
              <div className="flex items-center gap-1.5">
                <Icon name="database" size={16} className="text-primary" />
                <span className="font-caption text-caption text-on-surface">GJ-AND-2026-004512</span>
              </div>
              <div className="flex items-center gap-1.5 justify-end">
                <Icon name="verified_user" size={16} className="text-primary" />
                <span className="font-caption text-caption text-on-surface">DigiLocker ✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Criteria checklist */}
        <div className="mx-4">
          <div className="card p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="fact_check" size={20} className="text-primary" />
                <h2 className="font-title-md text-title-md text-on-surface font-semibold">
                  <T gu="નિયમ ચકાસણી" en="Criteria Match" hi="मानदंड मिलान" />
                </h2>
              </div>
              <span className="font-caption text-caption text-primary font-bold bg-success-container px-2 py-0.5 rounded-full">
                <T gu="૫/૫ સફળ" en="5/5 Passed" hi="5/5 पास" />
              </span>
            </div>

            {ELIGIBILITY_RULES.map((rule, i) => (
              <div key={i} className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                      <Icon name={rule.icon} size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg text-on-surface font-medium">
                        <T gu={rule.gu} en={rule.en} hi={rule.hi} />
                      </span>
                      <span className="font-caption text-caption text-on-surface-variant">
                        <T gu={rule.detail.gu} en={rule.detail.en} hi={rule.detail.hi} />
                      </span>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${rule.pass ? "bg-success-container text-on-success-container" : "bg-danger-container text-on-danger-container"}`}>
                    <Icon name={rule.pass ? "check" : "close"} size={16} />
                  </div>
                </div>
                {rule.progress && (
                  <div className="mt-1 ml-11">
                    <div className="w-full bg-surface-container-high rounded-full h-1.5">
                      <div className="bg-success h-full rounded-full" style={{ width: `${rule.progress}%` }} />
                    </div>
                    <div className="flex justify-between font-caption text-caption text-on-surface-variant mt-0.5">
                      <span>0%</span>
                      <span className="text-success font-bold">{rule.progress}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Payment breakdown */}
        <div className="mx-4">
          <div className="card p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Icon name="account_balance_wallet" size={20} className="text-primary" />
              <h2 className="font-title-md text-title-md text-on-surface font-semibold">
                <T gu="ચૂકવણી વિગત" en="Payment Breakdown" hi="भुगतान विवरण" />
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { yr: { gu: "ધો. ૯", en: "Grade 9", hi: "कक्षा 9" }, amt: "₹10,000", detail: { gu: "₹833/માહ", en: "₹833/month", hi: "₹833/माह" } },
                { yr: { gu: "ધો. ૧૦", en: "Grade 10", hi: "कक्षा 10" }, amt: "₹10,000", detail: { gu: "₹833/માહ", en: "₹833/month", hi: "₹833/माह" } },
                { yr: { gu: "ધો. ૧૧", en: "Grade 11", hi: "कक्षा 11" }, amt: "₹15,000", detail: { gu: "₹1,250/માહ", en: "₹1,250/month", hi: "₹1,250/माह" } },
                { yr: { gu: "ધો. ૧૨", en: "Grade 12", hi: "कक्षा 12" }, amt: "₹15,000", detail: { gu: "₹1,250/માહ", en: "₹1,250/month", hi: "₹1,250/माह" } },
              ].map((row, i) => (
                <div key={i} className="bg-surface-container-low rounded-lg p-3 text-center">
                  <p className="font-caption text-caption text-on-surface-variant"><T gu={row.yr.gu} en={row.yr.en} hi={row.yr.hi} /></p>
                  <p className="font-title-lg text-title-lg text-primary font-bold">{row.amt}</p>
                  <p className="font-caption text-caption text-on-surface-variant"><T gu={row.detail.gu} en={row.detail.en} hi={row.detail.hi} /></p>
                </div>
              ))}
            </div>
            <div className="bg-primary text-on-primary rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="font-label-lg text-label-lg font-bold"><T gu="૪ વર્ષ કુલ" en="4-Year Total" hi="4 साल कुल" /></span>
              <span className="font-headline-sm text-headline-sm font-bold">₹50,000</span>
            </div>
          </div>
        </div>

        {/* Process timeline */}
        <div className="mx-4">
          <div className="card p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Icon name="timeline" size={20} className="text-primary" />
              <h2 className="font-title-md text-title-md text-on-surface font-semibold">
                <T gu="અરજી પ્રક્રિયા" en="Application Process" hi="आवेदन प्रक्रिया" />
              </h2>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-primary/20" />
              {TIMELINE.map((step, i) => (
                <div key={i} className="flex items-start gap-3 mb-4 last:mb-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${i === 0 ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"}`}>
                    {i === 0 ? <Icon name={step.icon} size={16} /> : <span className="font-label-sm text-label-sm font-bold">{i + 1}</span>}
                  </div>
                  <div className="flex flex-col pt-1">
                    <span className={`font-label-lg text-label-lg font-medium ${i === 0 ? "text-primary" : "text-on-surface-variant"}`}>
                      <T gu={step.gu} en={step.en} hi={step.hi} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Important notes */}
        <div className="mx-4">
          <div className="card p-4 border-l-4 border-l-warning flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Icon name="info" size={18} className="text-warning" />
              <h3 className="font-label-lg text-label-lg text-on-surface font-semibold">
                <T gu="મહત્વની નોંધ" en="Important Notes" hi="महत्वपूर्ण नोट" />
              </h3>
            </div>
            <ul className="font-caption text-caption text-on-surface-variant space-y-1 ml-6 list-disc">
              <li><T gu="NMMS સ્કૉ. સાથે ન ચાલે (Exclusive)" en="Cannot combine with NMMS Scholarship (Exclusive)" hi="NMMS छात्रवृत्ति के साथ नहीं चल सकती" /></li>
              <li><T gu="૭૫% ન્યૂ. હાજરી ફરજિયાત" en="Min 75% attendance mandatory" hi="न्यूनतम 75% उपस्थिति अनिवार्य" /></li>
              <li><T gu="ફ્રૅન્ડ: ₹1 ક્ષ. ≤ ₹2 L" en="Family income ≤ ₹2 lakh mandatory" hi="पारिवारिक आय ≤ ₹2 लाख अनिवार्य" /></li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="mx-4 flex flex-col gap-3">
          <Link
            href="/student/apply"
            className="w-full h-12 bg-secondary text-on-secondary font-label-lg text-label-lg font-bold rounded-lg shadow-md flex items-center justify-center gap-2 hover:opacity-90 transition-all"
          >
            <Icon name="send" size={20} />
            <T gu="One-Click અરજી કરો" en="One-Click Apply" hi="एक-क्लिक आवेदन" />
          </Link>
          <Link
            href="/student/vault"
            className="w-full h-11 bg-surface-container-lowest border border-outline-variant text-primary font-label-lg text-label-lg rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors"
          >
            <Icon name="folder" size={18} />
            <T gu="ડૉક્સ વૉલ્ટ જુઓ" en="View Document Vault" hi="दस्तावेज़ वॉल्ट देखें" />
          </Link>
        </div>
      </div>
    </StudentShell>
  );
}
