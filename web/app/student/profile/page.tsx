"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StudentShell } from "@/components/shell/StudentShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { Avatar } from "@/components/ui";
import { useAppStore } from "@/lib/store";

export default function StudentProfilePage() {
  const router = useRouter();
  const { lang, setLang } = useAppStore();

  // Interactive states
  const [copiedCts, setCopiedCts] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [editSection, setEditSection] = useState<string | null>(null);

  // Editable fields mock state
  const [mobileNumber, setMobileNumber] = useState("+91 98795 44521");
  const [emailAddress, setEmailAddress] = useState("riya.patel2011@gujgov.edu.in");

  // Accordion open states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    personal: true,
    family: true,
    academic: true,
    bank: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Consents state
  const [consents, setConsents] = useState({
    docs: true,
    autoRenewal: true,
    notifications: true,
    digilocker: true,
    dbtMandate: true,
  });

  const handleToggleConsent = (key: keyof typeof consents) => {
    setConsents((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      showToast(
        updated[key]
          ? "સંમતિ સક્ષમ કરવામાં આવી છે"
          : "સંમતિ રદ કરવામાં આવી છે"
      );
      return updated;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCopyCts = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText("GJ-AND-2026-004512");
      setCopiedCts(true);
      showToast("CTS ID ક્લિપબોર્ડ પર કૉપિ થયો!");
      setTimeout(() => setCopiedCts(false), 2000);
    }
  };

  const handleDownloadData = () => {
    const studentData = {
      ctsId: "GJ-AND-2026-004512",
      name: "Riya Hasmukhbhai Patel",
      dob: "2011-08-14",
      gender: "Female",
      category: "SEBC/OBC",
      aadhaarMasked: "XXXX-XXXX-4512",
      school: "Shree Sardar Patel High School, Anand",
      udise: "24150100412",
      class: "9-B",
      rollNo: 18,
      lastScore: "78%",
      attendance: "82%",
      bank: {
        accountHolder: "Hetalben Patel (Mother)",
        bankName: "State Bank of India",
        maskedAccount: "SBI-****4521",
        ifsc: "SBIN0001234",
        npciSeeded: true,
      },
      consents: {
        schemeDocumentSharing: consents.docs,
        annualAutoRenewal: consents.autoRenewal,
        whatsappSmsNotifications: consents.notifications,
        digilockerAutoFetch: consents.digilocker,
        dbtMandate: consents.dbtMandate,
      },
      exportedAt: new Date().toISOString(),
      compliance: "DPDP Act 2023 Compliant Citizen Record",
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(studentData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "riya_patel_profile_record.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast("ડેટા આર્કાઇવ (.JSON) ડાઉનલોડ શરૂ થયું");
  };

  const handleWithdrawAll = () => {
    setConsents({
      docs: false,
      autoRenewal: false,
      notifications: false,
      digilocker: false,
      dbtMandate: false,
    });
    setShowWithdrawModal(false);
    showToast("તમામ બિનજરૂરી ડેટા સંમતિ પાછી ખેંચવામાં આવી છે");
  };

  const handleSavePreferences = () => {
    showToast("તમારી સંમતિ પ્રાથમિકતાઓ સફળતાપૂર્વક સાચવવામાં આવી છે!");
  };

  const handleConfirmSignOut = () => {
    setShowLogoutModal(false);
    router.push("/login");
  };

  return (
    <StudentShell>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-on-surface text-surface-container-lowest px-4 py-2.5 rounded-full shadow-lg text-body-sm flex items-center gap-2 animate-fade-in border border-surface-container-high/20">
          <Icon name="check_circle" size={18} className="text-secondary-container" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="px-4 py-4 space-y-4 max-w-[430px] mx-auto pb-24 relative">
        {/* Navigation / Page Header */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Link
              href="/student"
              className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
              aria-label="Back to Dashboard"
            >
              <Icon name="arrow_back" size={22} />
            </Link>
            <h1 className="font-title-lg text-title-lg text-on-surface">
              <T gu="પ્રોફાઇલ અને સંમતિ" en="Profile & Consent" hi="प्रोफ़ाइल और सहमति" />
            </h1>
          </div>
          <Link
            href="/student/notifications"
            className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors relative"
            aria-label="Notifications"
          >
            <Icon name="notifications" size={22} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary" />
          </Link>
        </div>

        {/* 1. Student Profile Hero Card */}
        <section className="relative bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant shadow-level-1 overflow-hidden">
          {/* Subtle Decorative Civic Glow */}
          <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-primary/5 pointer-events-none" />

          <div className="flex items-start gap-3.5 relative z-10">
            {/* Student Avatar with Verified Checkmark */}
            <div className="relative shrink-0">
              <Avatar
                name="Riya Patel"
                size="lg"
                className="w-16 h-16 text-headline-sm ring-2 ring-primary/20 shadow-sm"
              />
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-sm"
                title="Verified Student"
              >
                <Icon name="verified" size={15} fill className="text-on-primary" />
              </div>
            </div>

            {/* Student Title Details */}
            <div className="flex-1 min-w-0">
              <h2 className="font-title-lg text-title-lg text-on-surface leading-snug truncate">
                <T gu="રિયા હસમુખભાઈ પટેલ" en="Riya Hasmukhbhai Patel" hi="रिया हसमुखभाई पटेल" />
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5">
                <T
                  gu="ધોરણ ૯-બી • શ્રી સરદાર પટેલ હાઇસ્કૂલ, આણંદ"
                  en="Class 9-B • Shree Sardar Patel High School, Anand"
                  hi="कक्षा 9-बी • श्री सरदार पटेल हाई स्कूल, आणंद"
                />
              </p>

              {/* CTS ID Badge with Copy Button */}
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface text-caption font-caption">
                <span className="text-on-surface-variant">CTS ID:</span>
                <span className="font-semibold text-primary font-mono tracking-wide">
                  GJ-AND-2026-004512
                </span>
                <button
                  type="button"
                  onClick={handleCopyCts}
                  className="w-5 h-5 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-95 ml-0.5"
                  aria-label="Copy CTS ID"
                  title="Copy CTS ID"
                >
                  <Icon
                    name={copiedCts ? "check" : "content_copy"}
                    size={14}
                    className={copiedCts ? "text-emerald-600" : ""}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Trust Verification Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-surface-container-high/40">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low text-primary text-label-md font-label-md border border-primary/10">
              <Icon name="verified_user" size={15} className="text-primary" />
              <T gu="GSRDA વેરિફાઇડ ✓" en="GSRDA Verified ✓" hi="GSRDA सत्यापित ✓" />
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low text-primary text-label-md font-label-md border border-primary/10">
              <Icon name="cloud_done" size={15} className="text-primary" />
              <T gu="DigiLocker સિંક્ડ ✓" en="DigiLocker Synced ✓" hi="DigiLocker सिंक किया गया ✓" />
            </span>
          </div>

          {/* Profile Progress Completion Meter (92%) */}
          <div className="mt-4 p-3 rounded-xl bg-surface-container-low">
            <div className="flex items-center justify-between font-label-md text-label-md text-on-surface mb-2">
              <span className="flex items-center gap-1.5">
                <Icon name="analytics" size={17} className="text-primary" />
                <T gu="પ્રોફાઇલ પૂર્ણતા" en="Profile Completion" hi="प्रोफ़ाइल पूर्णता" />
              </span>
              <span className="text-primary font-bold">
                <T gu="૯૨% પૂર્ણ" en="92% Complete" hi="92% पूर्ण" />
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-surface-container overflow-hidden">
              <div
                className="h-full rounded-full bg-primary-container transition-all duration-700 ease-out"
                style={{ width: "92%" }}
              />
            </div>
            <p className="font-caption text-caption text-on-surface-variant mt-2 flex items-center gap-1.5">
              <Icon name="stars" size={15} className="text-secondary shrink-0" fill />
              <span>
                <T
                  gu="તમામ શિષ્યવૃત્તિઓ માટે જરૂરી ૮૫% પૂર્ણતા સ્તર મેળવેલ છે."
                  en="Achieved the required 85% completion level for all scholarships."
                  hi="सभी छात्रवृत्तियों के लिए आवश्यक 85% पूर्णता स्तर प्राप्त किया।"
                />
              </span>
            </p>
          </div>
        </section>

        {/* 2. Auto-Renewal / Auto-Rollover Coverage Banner */}
        <section className="rounded-2xl p-4 bg-gradient-to-br from-secondary-container via-amber-600 to-amber-700 text-on-secondary shadow-md relative overflow-hidden">
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-on-secondary/20 flex items-center justify-center shrink-0">
                <Icon name="autorenew" size={20} className="text-on-secondary" />
              </div>
              <div>
                <span className="font-label-md text-label-md uppercase tracking-wider text-on-secondary/90 text-[10px]">
                  <T gu="ઓટો-રોલઓવર કવરેજ" en="AUTO-ROLLOVER COVERAGE" hi="ऑटो-रोलओवर कवरेज" />
                </span>
                <h3 className="font-title-md text-title-md text-on-secondary leading-snug">
                  <T
                    gu="આગામી વર્ષ ઓટો-રિન્યુઅલ સંમતિ"
                    en="Next Year Auto-Renewal Consent"
                    hi="अगले वर्ष ऑटो-नवीनीकरण सहमति"
                  />
                </h3>
              </div>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-label-md font-label-md shadow-sm shrink-0 transition-colors ${
                consents.autoRenewal
                  ? "bg-surface-container-lowest text-secondary"
                  : "bg-on-secondary/20 text-on-secondary"
              }`}
            >
              {consents.autoRenewal ? (
                <T gu="સક્રિય (ON)" en="Active (ON)" hi="सक्रिय (ON)" />
              ) : (
                <T gu="નિષ્ક્રિય (OFF)" en="Disabled (OFF)" hi="निष्क्रिय (OFF)" />
              )}
            </span>
          </div>

          <p className="font-body-sm text-body-sm text-on-secondary/95 mt-2.5 relative z-10 leading-relaxed">
            <T
              gu="જ્યારે તમે ધોરણ ૧૦ માં પ્રવેશ મેળવશો ત્યારે યોગ્ય યોજનાઓ માટે આપોઆપ પાત્રતા ચકાસવામાં આવશે અને OTP દ્વારા તમારી અંતિમ સંમતિ લેવામાં આવશે."
              en="When you enter Class 10, eligibility for suitable schemes will be checked automatically, and your final consent will be taken via OTP."
              hi="जब आप कक्षा 10 में प्रवेश करेंगे, तो उपयुक्त योजनाओं के लिए स्वचालित रूप से पात्रता की जांच की जाएगी और OTP द्वारा आपकी अंतिम सहमति ली जाएगी।"
            />
          </p>

          <div className="mt-3 pt-2.5 flex items-center justify-between text-caption font-caption text-on-secondary/90 relative z-10 border-t border-on-secondary/20">
            <span className="flex items-center gap-1.5">
              <Icon name="policy" size={15} />
              <T
                gu="શિક્ષણ વિભાગ ઠરાવ ૨૦૨૫ અંતર્ગત"
                en="Under Education Department Resolution 2025"
                hi="शिक्षा विभाग संकल्प 2025 के अंतर्गत"
              />
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={consents.autoRenewal}
                onChange={() => handleToggleConsent("autoRenewal")}
                className="sr-only peer"
                aria-label="Toggle auto-renewal"
              />
              <div className="w-11 h-6 bg-on-secondary/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-surface-container-lowest" />
            </label>
          </div>
        </section>

        {/* 3. Verifiable Profile Sections Header */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Icon name="badge" size={20} className="text-primary" />
            <h3 className="font-title-lg text-title-lg text-on-surface">
              <T gu="ચકાસાયેલ પ્રોફાઇલ વિગતો" en="Verified Profile Details" hi="सत्यापित प्रोफ़ाइल विवरण" />
            </h3>
          </div>
          <span className="font-caption text-caption text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full font-semibold">
            <T gu="૪/૪ સંપૂર્ણ" en="4/4 Complete" hi="4/4 पूर्ण" />
          </span>
        </div>

        {/* Profile Sections Accordion / Cards List */}
        <div className="flex flex-col gap-3">
          {/* Section 1: Personal Details */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-level-1 overflow-hidden transition-all">
            <div
              onClick={() => toggleSection("personal")}
              className="p-4 flex items-center justify-between cursor-pointer select-none hover:bg-surface-container-low/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center shrink-0 text-primary">
                  <Icon name="person" size={20} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-title-md text-title-md text-on-surface truncate">
                    <T gu="૧. વ્યક્તિગત વિગતો" en="1. Personal Details" hi="1. व्यक्तिगत विवरण" />
                  </h4>
                  <p className="font-caption text-caption text-on-surface-variant truncate">
                    <T gu="આધાર પ્રમાણિત રેકોર્ડ" en="Aadhaar Verified Record" hi="आधार प्रमाणित रिकॉर्ड" />
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-label-md font-label-md border border-emerald-200">
                  <T gu="સંપૂર્ણ ✓" en="Complete ✓" hi="पूर्ण ✓" />
                </span>
                <Icon
                  name="expand_more"
                  size={20}
                  className={`text-on-surface-variant transition-transform duration-200 ${
                    openSections.personal ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            {openSections.personal && (
              <div className="px-4 pb-4 pt-1 border-t border-outline-variant/40 animate-fade-in">
                <div className="p-3 rounded-xl bg-surface-container-low grid grid-cols-2 gap-3 text-body-sm">
                  <div>
                    <span className="font-caption text-caption text-on-surface-variant block">
                      <T gu="જન્મ તારીખ" en="Date of Birth" hi="जन्म तिथि" />
                    </span>
                    <span className="font-label-lg text-label-lg text-on-surface">14 Aug 2011</span>
                  </div>
                  <div>
                    <span className="font-caption text-caption text-on-surface-variant block">
                      <T gu="લિંગ (Gender)" en="Gender" hi="लिंग" />
                    </span>
                    <span className="font-label-lg text-label-lg text-on-surface">
                      <T gu="સ્ત્રી (Female)" en="Female" hi="महिला (Female)" />
                    </span>
                  </div>
                  <div>
                    <span className="font-caption text-caption text-on-surface-variant block">
                      <T gu="સામાજિક વર્ગ" en="Social Category" hi="सामाजिक श्रेणी" />
                    </span>
                    <span className="font-label-lg text-label-lg text-on-surface">SEBC / OBC</span>
                  </div>
                  <div>
                    <span className="font-caption text-caption text-on-surface-variant block">
                      <T gu="આધાર નંબર (છેલ્લા ૪)" en="Aadhaar (Last 4)" hi="आधार (अंतिम 4)" />
                    </span>
                    <span className="font-label-lg text-label-lg text-on-surface font-mono">
                      •••• •••• 4512
                    </span>
                  </div>
                  <div>
                    <span className="font-caption text-caption text-on-surface-variant block">
                      <T gu="મોબાઇલ નંબર" en="Mobile Number" hi="मोबाइल नंबर" />
                    </span>
                    <span className="font-label-lg text-label-lg text-on-surface">{mobileNumber}</span>
                  </div>
                  <div>
                    <span className="font-caption text-caption text-on-surface-variant block">
                      <T gu="દિવ્યાંગતા સ્થિતિ" en="Disability Status" hi="दिव्यांगता स्थिति" />
                    </span>
                    <span className="font-label-lg text-label-lg text-on-surface">
                      <T gu="લાગુ પડતું નથી" en="Not Applicable" hi="लागू नहीं" />
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-caption text-caption text-on-surface-variant block">
                      <T gu="ઇમેઇલ સરનામું" en="Email Address" hi="ईमेल पता" />
                    </span>
                    <span className="font-label-lg text-label-lg text-on-surface truncate block font-mono">
                      {emailAddress}
                    </span>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setEditSection("personal")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-label-md font-label-md text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    <Icon name="edit" size={16} />
                    <T gu="વિગતો સુધારો" en="Edit Details" hi="विवरण संशोधित करें" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Family & Guardian Details */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-level-1 overflow-hidden transition-all">
            <div
              onClick={() => toggleSection("family")}
              className="p-4 flex items-center justify-between cursor-pointer select-none hover:bg-surface-container-low/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center shrink-0 text-primary">
                  <Icon name="family_restroom" size={20} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-title-md text-title-md text-on-surface truncate">
                    <T gu="૨. વાલી અને કુટુંબની વિગતો" en="2. Guardian & Family Details" hi="2. अभिभावक और परिवार विवरण" />
                  </h4>
                  <p className="font-caption text-caption text-on-surface-variant truncate">
                    <T
                      gu="આવક દાખલો ૧૨ માર્ચ ૨૦૨૬ માન્ય"
                      en="Income Certificate Valid until 12 Mar 2026"
                      hi="आय प्रमाण पत्र 12 मार्च 2026 तक मान्य"
                    />
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-label-md font-label-md border border-emerald-200">
                  <T gu="સંપૂર્ણ ✓" en="Complete ✓" hi="पूर्ण ✓" />
                </span>
                <Icon
                  name="expand_more"
                  size={20}
                  className={`text-on-surface-variant transition-transform duration-200 ${
                    openSections.family ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            {openSections.family && (
              <div className="px-4 pb-4 pt-1 border-t border-outline-variant/40 animate-fade-in">
                <div className="p-3 rounded-xl bg-surface-container-low flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-caption text-caption text-on-surface-variant block">
                        <T gu="પિતાનું નામ" en="Father's Name" hi="पिता का नाम" />
                      </span>
                      <span className="font-label-lg text-label-lg text-on-surface">
                        <T gu="હસમુખભાઈ પટેલ" en="Hasmukhbhai Patel" hi="हसमुखभाई पटेल" />
                      </span>
                    </div>
                    <span className="font-caption text-caption text-on-surface-variant font-mono">
                      +91 98••• ••521
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-surface-container-high/60 pt-2">
                    <div>
                      <span className="font-caption text-caption text-on-surface-variant block">
                        <T gu="માતાનું નામ" en="Mother's Name" hi="माता का नाम" />
                      </span>
                      <span className="font-label-lg text-label-lg text-on-surface">
                        <T gu="હેતલબેન પટેલ" en="Hetalben Patel" hi="हेतलबेन पटेल" />
                      </span>
                    </div>
                    <span className="font-caption text-caption text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
                      <T gu="પ્રાથમિક વાલી" en="Primary Guardian" hi="प्राथमिक अभिभावक" />
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-surface-container-lowest flex items-center justify-between border border-outline-variant/60">
                    <span className="font-caption text-caption text-on-surface-variant">
                      <T gu="પ્રમાણિત વાર્ષિક આવક:" en="Certified Annual Income:" hi="प्रमाणित वार्षिक आय:" />
                    </span>
                    <span className="font-title-md text-title-md text-primary font-semibold">
                      <T gu="₹ ૯૬,૦૦૦ / વર્ષ" en="₹ 96,000 / yr" hi="₹ 96,000 / वर्ष" />
                    </span>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setEditSection("family")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-label-md font-label-md text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    <Icon name="edit" size={16} />
                    <T gu="આવક વિગત સુધારો" en="Edit Income Record" hi="आय विवरण संशोधित करें" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Academic Records */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-level-1 overflow-hidden transition-all">
            <div
              onClick={() => toggleSection("academic")}
              className="p-4 flex items-center justify-between cursor-pointer select-none hover:bg-surface-container-low/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center shrink-0 text-primary">
                  <Icon name="school" size={20} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-title-md text-title-md text-on-surface truncate">
                    <T gu="૩. શૈક્ષણિક વિગતો" en="3. Academic Details" hi="3. शैक्षणिक विवरण" />
                  </h4>
                  <p className="font-caption text-caption text-on-surface-variant truncate">
                    <T gu="ગુણપત્રક અને હાજરી ટ્રેક" en="Marksheet & Attendance Track" hi="अंकतालिका और उपस्थिति ट्रैक" />
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-label-md font-label-md border border-emerald-200">
                  <T gu="સંપૂર્ણ ✓" en="Complete ✓" hi="पूर्ण ✓" />
                </span>
                <Icon
                  name="expand_more"
                  size={20}
                  className={`text-on-surface-variant transition-transform duration-200 ${
                    openSections.academic ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            {openSections.academic && (
              <div className="px-4 pb-4 pt-1 border-t border-outline-variant/40 animate-fade-in">
                <div className="p-3 rounded-xl bg-surface-container-low grid grid-cols-2 gap-3">
                  <div>
                    <span className="font-caption text-caption text-on-surface-variant block">
                      <T gu="પાછલું પરિણામ (ધોરણ ૮)" en="Previous Result (Class 8)" hi="पिछला परिणाम (कक्षा 8)" />
                    </span>
                    <span className="font-label-lg text-label-lg text-on-surface">
                      <T gu="૭૮% (A-Grade)" en="78% (A-Grade)" hi="78% (A-Grade)" />
                    </span>
                  </div>
                  <div>
                    <span className="font-caption text-caption text-on-surface-variant block">
                      <T gu="વર્તમાન હાજરી દર" en="Current Attendance Rate" hi="वर्तमान उपस्थिति दर" />
                    </span>
                    <span className="font-label-lg text-label-lg text-primary font-bold">
                      <T gu="૮૨% (પાત્ર > ૭૫%)" en="82% (Eligible > 75%)" hi="82% (पात्र > 75%)" />
                    </span>
                  </div>
                  <div>
                    <span className="font-caption text-caption text-on-surface-variant block">
                      <T gu="ધોરણ અને વર્ગ" en="Class & Section" hi="कक्षा और वर्ग" />
                    </span>
                    <span className="font-label-lg text-label-lg text-on-surface">
                      <T gu="ધોરણ ૯-બી (રોલ: ૧૮)" en="Class 9-B (Roll: 18)" hi="कक्षा 9-बी (रोल: 18)" />
                    </span>
                  </div>
                  <div>
                    <span className="font-caption text-caption text-on-surface-variant block">
                      <T gu="શાળા UDISE કોડ" en="School UDISE Code" hi="स्कूल UDISE कोड" />
                    </span>
                    <span className="font-label-lg text-label-lg text-on-surface font-mono">
                      24150100412
                    </span>
                  </div>
                  <div className="col-span-2 border-t border-surface-container-high/60 pt-2">
                    <span className="font-caption text-caption text-on-surface-variant block">
                      <T gu="શાળાનું નામ" en="School Name" hi="स्कूल का नाम" />
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface">
                      <T
                        gu="શ્રી સરદાર પટેલ હાઇસ્કૂલ, આણંદ"
                        en="Shree Sardar Patel High School, Anand"
                        hi="श्री सरदार पटेल हाई स्कूल, आणंद"
                      />
                    </span>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setEditSection("academic")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-label-md font-label-md text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    <Icon name="edit" size={16} />
                    <T gu="શાળા સુધારો" en="Update Academic Info" hi="शैक्षणिक विवरण अपडेट करें" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: DBT Bank Account Details */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-level-1 overflow-hidden transition-all">
            <div
              onClick={() => toggleSection("bank")}
              className="p-4 flex items-center justify-between cursor-pointer select-none hover:bg-surface-container-low/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center shrink-0 text-primary">
                  <Icon name="account_balance" size={20} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-title-md text-title-md text-on-surface truncate">
                    <T gu="૪. DBT બેંક ખાતું" en="4. DBT Bank Account" hi="4. डीबीटी बैंक खाता" />
                  </h4>
                  <p className="font-caption text-caption text-on-surface-variant truncate">
                    <T
                      gu="આધાર સીડેડ • NPCI માન્ય"
                      en="Aadhaar Seeded • NPCI Active"
                      hi="आधार सीडेड • एनपीसीआई मान्य"
                    />
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-label-md font-label-md border border-emerald-200">
                  <T gu="માન્ય ✓" en="Active ✓" hi="मान्य ✓" />
                </span>
                <Icon
                  name="expand_more"
                  size={20}
                  className={`text-on-surface-variant transition-transform duration-200 ${
                    openSections.bank ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            {openSections.bank && (
              <div className="px-4 pb-4 pt-1 border-t border-outline-variant/40 animate-fade-in">
                <div className="p-3 rounded-xl bg-surface-container-low flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-caption text-caption text-on-surface-variant">
                        <T gu="ખાતાધારક:" en="Account Holder:" hi="खाताधारक:" />
                      </span>
                      <span className="font-label-lg text-label-lg text-on-surface block">
                        <T
                          gu="માતા હેતલબેન પટેલ"
                          en="Mother Hetalben Patel"
                          hi="माता हेतलबेन पटेल"
                        />
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-label-md font-label-md text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <Icon name="verified" size={15} fill className="text-emerald-700" />
                      <span>NPCI Active</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-container-high/60">
                    <div>
                      <span className="font-caption text-caption text-on-surface-variant block">
                        <T gu="બેંક અને ખાતા નં." en="Bank & Account No." hi="बैंक और खाता संख्या" />
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface font-mono font-medium">
                        SBI ••••4521
                      </span>
                    </div>
                    <div>
                      <span className="font-caption text-caption text-on-surface-variant block">
                        <T gu="IFSC કોડ" en="IFSC Code" hi="IFSC कोड" />
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface font-mono font-medium">
                        SBIN0001234
                      </span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <span className="font-caption text-caption text-on-surface-variant block">
                      <T gu="શાખા" en="Branch" hi="शाखा" />
                    </span>
                    <span className="font-caption text-caption text-on-surface font-medium">
                      <T gu="આણંદ મુખ્ય શાખા (SBI Main Branch, Anand)" en="SBI Main Branch, Anand" hi="आनंद मुख्य शाखा (एसबीआई)" />
                    </span>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setEditSection("bank")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-label-md font-label-md text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    <Icon name="edit" size={16} />
                    <T gu="ખાતું બદલો / અપડેટ કરો" en="Change / Update Account" hi="खाता बदलें / अपडेट करें" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. Language Preference Setting */}
        <section className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant shadow-level-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Icon name="translate" size={18} />
            </div>
            <div>
              <h3 className="font-title-md text-title-md text-on-surface">
                <T gu="ભાષા પસંદગી" en="Language Preference" hi="भाषा प्राथमिकता" />
              </h3>
              <p className="font-caption text-caption text-on-surface-variant">
                <T
                  gu="તમારી અનુકૂળ ભાષા પસંદ કરો"
                  en="Select your preferred language"
                  hi="अपनी पसंदीदा भाषा चुनें"
                />
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            <button
              type="button"
              onClick={() => setLang("gu")}
              className={`py-2 px-3 rounded-xl border text-label-md font-label-md flex flex-col items-center justify-center gap-0.5 transition-all ${
                lang === "gu"
                  ? "bg-primary text-on-primary border-primary shadow-sm"
                  : "bg-surface-container-low text-on-surface border-outline-variant/50 hover:bg-surface-container"
              }`}
            >
              <span className="font-bold text-sm">ગુજરાતી</span>
              <span className={`text-[11px] ${lang === "gu" ? "text-on-primary/80" : "text-on-surface-variant"}`}>
                Gujarati
              </span>
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`py-2 px-3 rounded-xl border text-label-md font-label-md flex flex-col items-center justify-center gap-0.5 transition-all ${
                lang === "en"
                  ? "bg-primary text-on-primary border-primary shadow-sm"
                  : "bg-surface-container-low text-on-surface border-outline-variant/50 hover:bg-surface-container"
              }`}
            >
              <span className="font-bold text-sm">English</span>
              <span className={`text-[11px] ${lang === "en" ? "text-on-primary/80" : "text-on-surface-variant"}`}>
                ઇંગ્લિશ
              </span>
            </button>
            <button
              type="button"
              onClick={() => setLang("hi")}
              className={`py-2 px-3 rounded-xl border text-label-md font-label-md flex flex-col items-center justify-center gap-0.5 transition-all ${
                lang === "hi"
                  ? "bg-primary text-on-primary border-primary shadow-sm"
                  : "bg-surface-container-low text-on-surface border-outline-variant/50 hover:bg-surface-container"
              }`}
            >
              <span className="font-bold text-sm">हिन्दी</span>
              <span className={`text-[11px] ${lang === "hi" ? "text-on-primary/80" : "text-on-surface-variant"}`}>
                Hindi
              </span>
            </button>
          </div>
        </section>

        {/* 5. Data Privacy & DPDP Act 2023 Consent Manager */}
        <section className="mt-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Icon name="security" size={18} />
            </div>
            <div>
              <h3 className="font-title-lg text-title-lg text-on-surface leading-tight">
                <T
                  gu="ડેટા ગોપનીયતા અને સંમતિ વ્યવસ્થાપક"
                  en="Data Privacy & Consent Manager"
                  hi="डेटा गोपनीयता और सहमति प्रबंधक"
                />
              </h3>
              <span className="font-caption text-caption text-on-surface-variant block">
                DPDP Act 2023 Compliant Citizen Controls
              </span>
            </div>
          </div>

          {/* Consent Switches Container */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant shadow-level-1 flex flex-col gap-4">
            {/* Consent 1: Document & Scheme Sharing */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0 pr-1">
                <h4 className="font-title-md text-title-md text-on-surface">
                  <T
                    gu="યોજનાઓ સાથે દસ્તાવેજ શેરિંગ"
                    en="Scheme Document Sharing"
                    hi="योजनाओं के साथ दस्तावेज़ साझाकरण"
                  />
                </h4>
                <p className="font-caption text-caption text-on-surface-variant mt-1 leading-relaxed">
                  <T
                    gu="આવક, જાતિ અને ગુણપત્રક ડેટા સરકારી સ્કોલરશિપ પોર્ટલ સાથે સુરક્ષિત વેરિફિકેશન માટે વાપરવાની સંમતિ."
                    en="Consent to use income, caste, and marksheet data with government scholarship portals for secure verification."
                    hi="सुरक्षित सत्यापन के लिए सरकारी छात्रवृत्ति पोर्टल के साथ आय, जाति और अंकतालिका डेटा का उपयोग करने की सहमति।"
                  />
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={consents.docs}
                  onChange={() => handleToggleConsent("docs")}
                  className="sr-only peer"
                  aria-label="Toggle scheme document sharing"
                />
                <div className="w-11 h-6 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>

            <div className="h-px bg-surface-container" />

            {/* Consent 2: Auto-Apply / Auto-Renewal */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0 pr-1">
                <h4 className="font-title-md text-title-md text-on-surface">
                  <T
                    gu="આપોઆપ વાર્ષિક નવીકરણ (Auto-Apply)"
                    en="Annual Auto-Renewal (Auto-Apply)"
                    hi="स्वचालित वार्षिक नवीनीकरण (Auto-Apply)"
                  />
                </h4>
                <p className="font-caption text-caption text-on-surface-variant mt-1 leading-relaxed">
                  <T
                    gu="આગામી શૈક્ષણિક વર્ષમાં યોગ્ય યોજનાઓ માટે ડેટા ઓટો-ચેક કરવાની પૂર્વ-મંજૂરી."
                    en="Pre-approval to auto-check data for eligible schemes in the upcoming academic year."
                    hi="आगामी शैक्षणिक वर्ष में पात्र योजनाओं के लिए डेटा की स्वतः जांच की पूर्व-स्वीकृति।"
                  />
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={consents.autoRenewal}
                  onChange={() => handleToggleConsent("autoRenewal")}
                  className="sr-only peer"
                  aria-label="Toggle auto-renewal"
                />
                <div className="w-11 h-6 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>

            <div className="h-px bg-surface-container" />

            {/* Consent 3: WhatsApp & SMS Alerts */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0 pr-1">
                <h4 className="font-title-md text-title-md text-on-surface">
                  <T
                    gu="WhatsApp અને SMS નોટિફિકેશન એલર્ટ્સ"
                    en="WhatsApp & SMS Notification Alerts"
                    hi="व्हाट्सएप और एसएमएस अधिसूचना अलर्ट"
                  />
                </h4>
                <p className="font-caption text-caption text-on-surface-variant mt-1 leading-relaxed">
                  <T
                    gu="અરજી મંજૂરી, સાયકલ OTP અને DBT જમા સ્થિતિ અંગે ત્વરિત સંદેશાઓ મોકલવા."
                    en="Send instant notifications regarding application approval, cycle OTP, and DBT credit status."
                    hi="आवेदन अनुमोदन, साइकिल OTP और डीबीटी क्रेडिट स्थिति के बारे में त्वरित संदेश भेजना।"
                  />
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={consents.notifications}
                  onChange={() => handleToggleConsent("notifications")}
                  className="sr-only peer"
                  aria-label="Toggle notifications"
                />
                <div className="w-11 h-6 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>

            <div className="h-px bg-surface-container" />

            {/* Consent 4: DigiLocker Auto-Fetching */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0 pr-1">
                <h4 className="font-title-md text-title-md text-on-surface">
                  <T
                    gu="ડિજીલોકર ઓટો-ફેચિંગ સંમતિ"
                    en="DigiLocker Auto-Fetching Consent"
                    hi="डिजीलॉकर ऑटो-फ़ेचिंग सहमति"
                  />
                </h4>
                <p className="font-caption text-caption text-on-surface-variant mt-1 leading-relaxed">
                  <T
                    gu="નવા શૈક્ષણિક પ્રમાણપત્રો આપોઆપ મેળવી પોર્ટલમાં સિંક રાખવાની પરવાનગી."
                    en="Permission to automatically fetch new academic certificates and keep them synced in the portal."
                    hi="नए शैक्षणिक प्रमाण पत्र स्वचालित रूप से प्राप्त करने और उन्हें पोर्टल में सिंक रखने की अनुमति।"
                  />
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={consents.digilocker}
                  onChange={() => handleToggleConsent("digilocker")}
                  className="sr-only peer"
                  aria-label="Toggle DigiLocker sync"
                />
                <div className="w-11 h-6 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>

            <div className="h-px bg-surface-container" />

            {/* Consent 5: DBT Mandate Consent */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0 pr-1">
                <h4 className="font-title-md text-title-md text-on-surface">
                  <T
                    gu="DBT જમા અને ખાતા સંમતિ"
                    en="DBT Mandate & Account Consent"
                    hi="डीबीटी अधिदेश और खाता सहमति"
                  />
                </h4>
                <p className="font-caption text-caption text-on-surface-variant mt-1 leading-relaxed">
                  <T
                    gu="સરકારી શિષ્યવૃત્તિ હપ્તા સીધા તમારા આધાર સીડેડ ખાતામાં જમા કરાવવાની સંમતિ."
                    en="Consent to credit government scholarship disbursements directly into the Aadhaar seeded account."
                    hi="सरकारी छात्रवृत्ति किस्तें सीधे आधार सीडेड खाते में जमा करने की सहमति।"
                  />
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={consents.dbtMandate}
                  onChange={() => handleToggleConsent("dbtMandate")}
                  className="sr-only peer"
                  aria-label="Toggle DBT mandate"
                />
                <div className="w-11 h-6 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>
          </div>
        </section>

        {/* 6. Data Rights & Aadhaar Privacy Box */}
        <section className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
              <Icon name="lock" size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-title-md text-title-md text-on-surface">
                <T
                  gu="આધાર અને ડેટા સુરક્ષા ખાતરી"
                  en="Aadhaar & Data Security Assurance"
                  hi="आधार और डेटा सुरक्षा आश्वासन"
                />
              </h4>
              <p className="font-caption text-caption text-on-surface-variant mt-1 leading-relaxed">
                <T
                  gu="🔒 તમારો સંપૂર્ણ આધાર નંબર ક્યારેય સેવ કરવામાં આવતો નથી. UIDAI માર્ગદર્શિકા મુજબ માત્ર સુરક્ષિત SHA-256 ટોકન અને માસ્ક કરેલા છેલ્લા ૪ આંકડા જ વપરાય છે."
                  en="🔒 Your full Aadhaar number is never stored. Per UIDAI guidelines, only secure SHA-256 tokens and masked last 4 digits are used."
                  hi="🔒 आपका पूरा आधार नंबर कभी सेव नहीं किया जाता है। UIDAI दिशानिर्देशों के अनुसार केवल सुरक्षित SHA-256 टोकन और अंतिम 4 अंक ही उपयोग किए जाते हैं।"
                />
              </p>
            </div>
          </div>

          {/* Action Buttons for Data Rights */}
          <div className="mt-4 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleDownloadData}
              className="w-full h-11 px-4 rounded-xl bg-surface-container-lowest text-primary font-label-lg text-label-lg flex items-center justify-center gap-2 border border-outline-variant hover:bg-surface-container transition-all active:scale-[0.99] shadow-sm"
            >
              <Icon name="download_for_offline" size={18} />
              <T
                gu="મારો સંપૂર્ણ ડેટા ડાઉનલોડ કરો (.JSON)"
                en="Download My Complete Data (.JSON)"
                hi="मेरा पूरा डेटा डाउनलोड करें (.JSON)"
              />
            </button>
            <button
              type="button"
              onClick={() => setShowWithdrawModal(true)}
              className="w-full h-11 px-4 rounded-xl bg-surface-container-lowest text-red-600 font-label-lg text-label-lg flex items-center justify-center gap-2 border border-red-200 hover:bg-red-50 transition-all active:scale-[0.99] shadow-sm"
            >
              <Icon name="cancel" size={18} />
              <T
                gu="ડેટા સંમતિ રદ કરો (Withdraw Consent)"
                en="Withdraw Data Consent"
                hi="डेटा सहमति वापस लें (Withdraw Consent)"
              />
            </button>
          </div>
        </section>

        {/* 7. Save Preferences & Sign Out Actions */}
        <div className="pt-2 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleSavePreferences}
            className="w-full h-12 rounded-xl bg-secondary-container text-on-secondary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-all active:scale-[0.99]"
          >
            <Icon name="save" size={20} />
            <T
              gu="પસંદગી સાચવો (Save Preferences)"
              en="Save Preferences"
              hi="प्राथमिकताएं सहेजें"
            />
          </button>

          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="w-full h-11 rounded-xl bg-surface-container text-on-surface-variant font-label-lg text-label-lg flex items-center justify-center gap-2 border border-outline-variant/60 hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            <Icon name="logout" size={18} />
            <T gu="લૉગ આઉટ (Sign Out)" en="Sign Out" hi="लॉग आउट" />
          </button>
        </div>

        {/* Legal & Compliance Civic Footer */}
        <footer className="pt-4 pb-6 text-center space-y-1">
          <p className="font-caption text-caption text-on-surface-variant">
            <T
              gu="ગુજરાત સરકાર શિક્ષણ વિભાગ • DPDP Act 2023 Compliant"
              en="Government of Gujarat Education Department • DPDP Act 2023 Compliant"
              hi="गुजरात सरकार शिक्षा विभाग • DPDP Act 2023 Compliant"
            />
          </p>
          <p className="font-caption text-caption text-outline text-[11px]">
            <T
              gu="સુરક્ષિત સત્ર ID: VGPS-2026-GUJ-PRO • Version 3.2.0"
              en="Secure Session ID: VGPS-2026-GUJ-PRO • Version 3.2.0"
              hi="सुरक्षित सत्र ID: VGPS-2026-GUJ-PRO • Version 3.2.0"
            />
          </p>
        </footer>
      </div>

      {/* Warning Modal for Withdrawing Consent */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-outline-variant">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Icon name="warning" size={28} />
            </div>
            <h3 className="font-title-lg text-title-lg text-on-surface text-center">
              <T
                gu="સંમતિ પાછી ખેંચવી છે?"
                en="Withdraw Consent?"
                hi="क्या आप सहमति वापस लेना चाहते हैं?"
              />
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant text-center mt-2 leading-relaxed">
              <T
                gu="જો તમે સંમતિ રદ કરશો, તો તમારી સક્રિય શિષ્યવૃત્તિ અરજીઓ સ્થગિત થઈ શકે છે અને આગામી DBT હપ્તા જમા થવામાં વિલંબ થશે."
                en="If you withdraw consent, your active scholarship applications may be suspended and upcoming DBT installments will be delayed."
                hi="यदि आप सहमति वापस लेते हैं, तो आपके सक्रिय छात्रवृत्ति आवेदन स्थगित हो सकते हैं और आगामी डीबीटी किस्त में देरी होगी।"
              />
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleWithdrawAll}
                className="w-full h-11 rounded-xl bg-red-600 text-white font-label-lg text-label-lg hover:bg-red-700 transition-colors"
              >
                <T
                  gu="હા, સંમતિ પાછી ખેંચો"
                  en="Yes, Withdraw Consent"
                  hi="हाँ, सहमति वापस लें"
                />
              </button>
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="w-full h-11 rounded-xl bg-surface-container text-on-surface font-label-lg text-label-lg hover:bg-surface-container-high transition-colors"
              >
                <T gu="રદ કરો (પાછા ફરો)" en="Cancel (Go Back)" hi="रद्द करें (वापस जाएं)" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section Edit Modal */}
      {editSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-outline-variant max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/50">
              <h3 className="font-title-md text-title-md text-on-surface">
                {editSection === "personal" && (
                  <T gu="વ્યક્તિગત વિગતો સુધારો" en="Edit Personal Details" hi="व्यक्तिगत विवरण संपादित करें" />
                )}
                {editSection === "family" && (
                  <T gu="વાલી / આવક વિગત સુધારો" en="Edit Family / Income" hi="अभिभावक / आय विवरण संपादित करें" />
                )}
                {editSection === "academic" && (
                  <T gu="શૈક્ષણિક વિગત સુધારો" en="Edit Academic Info" hi="शैक्षणिक विवरण संपादित करें" />
                )}
                {editSection === "bank" && (
                  <T gu="DBT બેંક ખાતું સુધારો" en="Update DBT Bank Account" hi="डीबीटी बैंक खाता अपडेट करें" />
                )}
              </h3>
              <button
                type="button"
                onClick={() => setEditSection(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="py-4 space-y-3.5">
              {editSection === "personal" && (
                <>
                  <div>
                    <label className="font-caption text-caption text-on-surface-variant block mb-1">
                      <T gu="મોબાઇલ નંબર" en="Mobile Number" hi="मोबाइल नंबर" />
                    </label>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg border border-outline bg-surface-container-lowest font-body-sm text-body-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-caption text-caption text-on-surface-variant block mb-1">
                      <T gu="ઇમેઇલ સરનામું" en="Email Address" hi="ईमेल पता" />
                    </label>
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg border border-outline bg-surface-container-lowest font-body-sm text-body-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-caption font-caption">
                    <p className="flex items-start gap-1.5">
                      <Icon name="info" size={16} className="text-amber-700 shrink-0 mt-0.5" />
                      <span>
                        <T
                          gu="નામ, જન્મ તારીખ અથવા જાતિ બદલવા માટે આધાર પ્રમાણીકરણ અથવા શાળાના આચાર્યશ્રીનો સંપર્ક કરવો જરૂરી છે."
                          en="To update Name, DOB or Category, Aadhaar re-authentication or contacting your School Principal is required."
                          hi="नाम, जन्म तिथि या श्रेणी बदलने के लिए आधार प्रमाणीकरण या स्कूल के प्रधानाचार्य से संपर्क करना आवश्यक है।"
                        />
                      </span>
                    </p>
                  </div>
                </>
              )}

              {editSection === "family" && (
                <div className="p-3 rounded-xl bg-surface-container-low text-body-sm space-y-2">
                  <p className="text-on-surface font-medium">
                    <T
                      gu="આવક દાખલો ૧૨ માર્ચ ૨૦૨૬ સુધી માન્ય છે."
                      en="Income certificate is valid until 12 Mar 2026."
                      hi="आय प्रमाण पत्र 12 मार्च 2026 तक मान्य है।"
                    />
                  </p>
                  <p className="font-caption text-caption text-on-surface-variant">
                    <T
                      gu="નવો આવક દાખલો અપલોડ કરવા માટે ડિજીલોકર અથવા જન સેવા કેન્દ્ર મારફતે અપડેટ વિનંતી સબમિટ કરો."
                      en="To submit a new certificate, request an update via DigiLocker or Jan Seva Kendra."
                      hi="नया आय प्रमाण पत्र अपलोड करने के लिए डिजिलॉकर या जन सेवा केंद्र के माध्यम से अपडेट अनुरोध सबमिट करें।"
                    />
                  </p>
                </div>
              )}

              {editSection === "academic" && (
                <div className="p-3 rounded-xl bg-surface-container-low text-body-sm space-y-2">
                  <p className="text-on-surface font-medium">
                    <T
                      gu="શૈક્ષણિક વિગતો UDISE પોર્ટલ સાથે સિંક થયેલ છે."
                      en="Academic records are synced with the UDISE portal."
                      hi="शैक्षणिक रिकॉर्ड UDISE पोर्टल के साथ सिंक किए गए हैं।"
                    />
                  </p>
                  <p className="font-caption text-caption text-on-surface-variant">
                    <T
                      gu="શાળા બદલાવ અથવા ગુણપત્રક સુધારા માટે તમારા વર્ગશિક્ષક અથવા DEO કચેરીનો સંપર્ક કરો."
                      en="Contact your Class Teacher or DEO office for school transfer or marksheet corrections."
                      hi="स्कूल परिवर्तन या अंकतालिका सुधार के लिए अपने कक्षा शिक्षक या डीईओ कार्यालय से संपर्क करें।"
                    />
                  </p>
                </div>
              )}

              {editSection === "bank" && (
                <div className="p-3 rounded-xl bg-surface-container-low text-body-sm space-y-2">
                  <p className="text-on-surface font-medium">
                    <T
                      gu="નવું બેંક ખાતું NPCI / આધાર સાથે સીડ થયેલ હોવું ફરજિયાત છે."
                      en="New bank account must be Aadhaar/NPCI seeded."
                      hi="नया बैंक खाता आधार/एनपीसीआई से जुड़ा होना अनिवार्य है।"
                    />
                  </p>
                  <p className="font-caption text-caption text-on-surface-variant">
                    <T
                      gu="ખાતું બદલવા માટે બેંક પાસબુક અને આધાર સીડિંગ ફોર્મ સાથે શાળા નોડલ અધિકારીનો સંપર્ક કરો."
                      en="To change account, submit your bank passbook and Aadhaar seeding slip to the School Nodal Officer."
                      hi="खाता बदलने के लिए बैंक पासबुक और आधार सीडिंग फॉर्म के साथ स्कूल नोडल अधिकारी से संपर्क करें।"
                    />
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-outline-variant/50">
              <button
                type="button"
                onClick={() => setEditSection(null)}
                className="px-4 py-2 rounded-xl text-label-md font-label-md text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                <T gu="બંધ કરો" en="Close" hi="बंद करें" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditSection(null);
                  showToast("વિગતો સાચવવામાં આવી છે");
                }}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary text-label-md font-label-md hover:bg-primary-container transition-colors"
              >
                <T gu="સાચવો" en="Save Changes" hi="सहेजें" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-outline-variant">
            <div className="w-12 h-12 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center mx-auto mb-3">
              <Icon name="logout" size={24} />
            </div>
            <h3 className="font-title-lg text-title-lg text-on-surface text-center">
              <T gu="લૉગ આઉટ કરવું છે?" en="Sign Out?" hi="क्या आप लॉग आउट करना चाहते हैं?" />
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant text-center mt-2 leading-relaxed">
              <T
                gu="શું તમે ખરેખર વિદ્યા પ્રગતિ સેતુ પોર્ટલમાંથી લૉગ આઉટ કરવા માંગો છો?"
                en="Are you sure you want to sign out from Vidya Pragati Setu?"
                hi="क्या आप वाकई विद्या प्रगति सेतु पोर्टल से लॉग आउट करना चाहते हैं?"
              />
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleConfirmSignOut}
                className="w-full h-11 rounded-xl bg-red-600 text-white font-label-lg text-label-lg hover:bg-red-700 transition-colors"
              >
                <T gu="હા, લૉગ આઉટ કરો" en="Yes, Sign Out" hi="हाँ, लॉग आउट करें" />
              </button>
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="w-full h-11 rounded-xl bg-surface-container text-on-surface font-label-lg text-label-lg hover:bg-surface-container-high transition-colors"
              >
                <T gu="રદ કરો" en="Cancel" hi="रद्द करें" />
              </button>
            </div>
          </div>
        </div>
      )}
    </StudentShell>
  );
}
