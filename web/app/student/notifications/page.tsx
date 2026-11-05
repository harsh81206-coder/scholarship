"use client";

import { useState } from "react";
import Link from "next/link";
import { StudentShell } from "@/components/shell/StudentShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { EmptyState } from "@/components/ui";

type FilterType = "all" | "schemes" | "payments" | "delivery" | "alerts" | "grievances";
type DateGroup = "today" | "yesterday" | "this_week";

interface NotificationItem {
  id: string;
  category: Exclude<FilterType, "all">;
  dateGroup: DateGroup;
  icon: string;
  iconBg: string;
  badge: {
    gu: string;
    en: string;
    hi: string;
    className: string;
  };
  time: {
    gu: string;
    en: string;
    hi: string;
  };
  title: {
    gu: string;
    en: string;
    hi: string;
  };
  body: {
    gu: string;
    en: string;
    hi: string;
  };
  read: boolean;
  extraType?: "utr" | "otp";
  action?: {
    label: {
      gu: string;
      en: string;
      hi: string;
    };
    href: string;
    icon?: string;
    variant: "primary" | "secondary" | "tonal";
  };
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  // ── Today ────────────────────────────────────────────────────────────────
  {
    id: "notif-1",
    category: "schemes",
    dateGroup: "today",
    icon: "auto_awesome",
    iconBg: "bg-surface-container text-primary",
    badge: {
      gu: "મેરિટ યોજના",
      en: "Merit Scheme",
      hi: "मेरिट योजना",
      className: "bg-surface-container text-primary",
    },
    time: {
      gu: "૧૦ મિ. પહેલાં",
      en: "10m ago",
      hi: "10 मिनट पहले",
    },
    title: {
      gu: "નવી યોજના પાત્રતા: મુખ્યમંત્રી જ્ઞાન સાધના મેરિટ સ્કોલરશિપ",
      en: "New Scheme Eligibility: CM Gyan Sadhna Merit Scholarship",
      hi: "नई योजना पात्रता: मुख्यमंत्री ज्ञान साधना मेरिट छात्रवृत्ति",
    },
    body: {
      gu: "તમારા ધોરણ ૮ ના પરિણામ (૭૮%) અને હાજરી (૮૨%) ના આધારે તમે ₹ ૧૫,૦૦૦/વર્ષ ની શિષ્યવૃત્તિ માટે પાત્ર બન્યા છો.",
      en: "Based on your Class 8 score (78%) and attendance (82%), you are eligible for ₹ 15,000/year scholarship.",
      hi: "कक्षा 8 के परिणाम (78%) और उपस्थिति (82%) के आधार पर आप ₹ 15,000/वर्ष छात्रवृत्ति के लिए पात्र हैं।",
    },
    read: false,
    action: {
      label: {
        gu: "વિગત જુઓ & અરજી કરો",
        en: "View Details & Apply",
        hi: "विवरण देखें और आवेदन करें",
      },
      href: "/student/apply",
      icon: "arrow_forward",
      variant: "secondary",
    },
  },
  {
    id: "notif-2",
    category: "payments",
    dateGroup: "today",
    icon: "account_balance",
    iconBg: "bg-surface-container-high text-primary",
    badge: {
      gu: "DBT જમા",
      en: "DBT Credited",
      hi: "DBT जमा",
      className: "bg-surface-container text-primary",
    },
    time: {
      gu: "૨ કલાક પહેલાં",
      en: "2h ago",
      hi: "2 घंटे पहले",
    },
    title: {
      gu: "DBT જમા: ₹ ૧૦,૦૦૦ નમો લક્ષ્મી યોજના (SBI ****4521)",
      en: "₹10,000 credited to SBI ****4521 (Namo Lakshmi Scheme)",
      hi: "₹10,000 एसबीआई ****4521 में जमा (नमो लक्ष्मी योजना)",
    },
    body: {
      gu: "માતા હેતલબેન પટેલના સ્ટેટ બેંક ઓફ ઇન્ડિયા (SBI ••••4521) ખાતામાં નમો લક્ષ્મી યોજનાનો પ્રથમ હપ્તો ₹ ૧૦,૦૦૦ સફળતાપૂર્વક જમા થયો છે.",
      en: "First installment of ₹10,000 under Namo Lakshmi Scheme has been successfully credited to SBI ••••4521 (Hetalben Patel).",
      hi: "नमो लक्ष्मी योजना की ₹10,000 की पहली किस्त हेतलबेन पटेल के एसबीआई ••••4521 खाते में जमा कर दी गई है।",
    },
    read: false,
    extraType: "utr",
    action: {
      label: {
        gu: "ડિજિટલ રસીદ (.PDF)",
        en: "Digital Receipt (.PDF)",
        hi: "डिजिटल रसीद (.PDF)",
      },
      href: "/student/payments",
      icon: "download",
      variant: "tonal",
    },
  },
  {
    id: "notif-3",
    category: "delivery",
    dateGroup: "today",
    icon: "pedal_bike",
    iconBg: "bg-secondary-fixed text-on-secondary-fixed",
    badge: {
      gu: "હસ્તાંતરણ OTP",
      en: "Handover OTP",
      hi: "हस्तांतरण OTP",
      className: "bg-secondary-fixed text-on-secondary-fixed",
    },
    time: {
      gu: "૪ કલાક પહેલાં",
      en: "4h ago",
      hi: "4 घंटे पहले",
    },
    title: {
      gu: "સાયકલ શાળામાં પહોંચી ગઈ છે! (Cycle arrived at school)",
      en: "Cycle arrived at school - Saraswati Sadhna Scheme",
      hi: "साइकिल स्कूल पहुंच गई है! - सरस्वती साधना योजना",
    },
    body: {
      gu: "શ્રી સરદાર પટેલ હાઇસ્કૂલ ખાતે સાયકલ પ્રાપ્ત થઈ ગઈ છે. તમારા વર્ગ શિક્ષક સમક્ષ રજૂ કરવા માટેનો ગુપ્ત સુરક્ષા કોડ:",
      en: "Bicycle has arrived at Shree Sardar Patel High School. Show secret security verification code to your class teacher:",
      hi: "श्री सरदार पटेल हाई स्कूल में साइकिल पहुंच गई है। अपने कक्षा शिक्षक को सत्यापन कोड दिखाएं:",
    },
    read: false,
    extraType: "otp",
    action: {
      label: {
        gu: "OTP જુઓ & વિગતો",
        en: "View OTP & Details",
        hi: "OTP देखें और विवरण",
      },
      href: "/student/cycle",
      icon: "chevron_right",
      variant: "primary",
    },
  },

  // ── Yesterday ────────────────────────────────────────────────────────────
  {
    id: "notif-4",
    category: "schemes",
    dateGroup: "yesterday",
    icon: "verified",
    iconBg: "bg-surface-container text-primary",
    badge: {
      gu: "DEO મંજૂરી",
      en: "DEO Approval",
      hi: "DEO स्वीकृति",
      className: "bg-surface-container text-primary",
    },
    time: {
      gu: "ગઈકાલે, સાંજે ૫:૨૦",
      en: "Yesterday, 5:20 PM",
      hi: "कल, शाम 5:20",
    },
    title: {
      gu: "DEO આણંદ દ્વારા નમો લક્ષ્મી યોજના મંજૂર (Approved)",
      en: "Namo Lakshmi approved by DEO Anand",
      hi: "DEO आणंद द्वारा नमो लक्ष्मी योजना स्वीकृत",
    },
    body: {
      gu: "જિલ્લા શિક્ષણ અધિકારી (DEO) દ્વારા તમારી નમો લક્ષ્મી યોજના શિષ્યવૃત્તિ અરજી #APP-2026-00871 ડિજિટલ સહી (DSC) સાથે મંજૂર કરવામાં આવી છે.",
      en: "District Education Officer (DEO Anand) approved your Namo Lakshmi scholarship application #APP-2026-00871 with Digital Signature (DSC).",
      hi: "जिला शिक्षा अधिकारी (DEO आणंद) द्वारा आपके नमो लक्ष्मी छात्रवृत्ति आवेदन #APP-2026-00871 को डिजिटल हस्ताक्षर से स्वीकृति दी गई।",
    },
    read: true,
    action: {
      label: {
        gu: "અરજી ટ્રેક કરો",
        en: "Track Application",
        hi: "आवेदन ट्रैक करें",
      },
      href: "/student/applications",
      icon: "arrow_forward",
      variant: "tonal",
    },
  },
  {
    id: "notif-5",
    category: "alerts",
    dateGroup: "yesterday",
    icon: "notification_important",
    iconBg: "bg-danger-container text-on-danger-container",
    badge: {
      gu: "૧૫ દિવસ બાકી",
      en: "15 Days Left",
      hi: "15 दिन शेष",
      className: "bg-danger-container text-on-danger-container",
    },
    time: {
      gu: "ગઈકાલે, બપોરે ૨:૧૫",
      en: "Yesterday, 2:15 PM",
      hi: "कल, दोपहर 2:15",
    },
    title: {
      gu: "આવકનો દાખલો: રિન્યુઅલ ચેતવણી (Upload income cert)",
      en: "Upload income cert - Renewal Alert",
      hi: "आय प्रमाण पत्र अपलोड करें - नवीनीकरण चेतावनी",
    },
    body: {
      gu: "તમારો વાર્ષિક આવકનો દાખલો ૧૨ માર્ચ ૨૦૨૬ ના રોજ સમાપ્ત થાય છે. ડિજીલોકર દ્વારા નવો દાખલો સિંક કરો જેથી આગામી હપ્તો અટકે નહીં.",
      en: "Your annual income certificate expires on 12 March 2026. Please sync your latest certificate from DigiLocker to prevent DBT pause.",
      hi: "आपका वार्षिक आय प्रमाण पत्र 12 मार्च 2026 को समाप्त हो रहा है। डीबीटी रुकावट से बचने के लिए डिजीलॉकर से नया प्रमाण पत्र अपलोड करें।",
    },
    read: true,
    action: {
      label: {
        gu: "દસ્તાવેજ વૉલ્ટ ખોલો",
        en: "Open Doc Vault",
        hi: "दस्तावेज़ वॉल्ट खोलें",
      },
      href: "/student/vault",
      icon: "folder_shared",
      variant: "tonal",
    },
  },

  // ── This Week ────────────────────────────────────────────────────────────
  {
    id: "notif-6",
    category: "grievances",
    dateGroup: "this_week",
    icon: "support_agent",
    iconBg: "bg-surface-container-high text-primary",
    badge: {
      gu: "ફરિયાદ ઉકેલાઈ",
      en: "Grievance Resolved",
      hi: "शिकायत हल",
      className: "bg-surface-container text-primary",
    },
    time: {
      gu: "૩ દિવસ પહેલાં",
      en: "3 days ago",
      hi: "3 दिन पहले",
    },
    title: {
      gu: "ફરિયાદ અપડેટ: બેંક ખાતા વિસંગતતા સફળતાપૂર્વક સુધારી",
      en: "Grievance update: Bank account mismatch updated",
      hi: "शिकायत अपडेट: बैंक खाता विसंगति का सफल समाधान",
    },
    body: {
      gu: "તમારી ફરિયાદ #GRV-2026-0192 (બેંક શાખા IFSC સુધારો) સફળતાપૂર્વક ઉકેલાઈ ગઈ છે અને આધાર NPCI મેપર સાથે માન્ય થયેલ છે.",
      en: "Your grievance #GRV-2026-0192 regarding bank branch IFSC update has been resolved and verified with Aadhaar NPCI mapper.",
      hi: "आपकी शिकायत #GRV-2026-0192 (बैंक शाखा IFSC सुधार) का समाधान कर दिया गया है और एनपीसीआई मैपर से सत्यापित किया गया है।",
    },
    read: true,
    action: {
      label: {
        gu: "ફરિયાદ સ્થિતિ જુઓ",
        en: "View Grievance Status",
        hi: "शिकायत स्थिति देखें",
      },
      href: "/student/grievances",
      icon: "arrow_forward",
      variant: "tonal",
    },
  },
  {
    id: "notif-7",
    category: "schemes",
    dateGroup: "this_week",
    icon: "school",
    iconBg: "bg-surface-container text-primary",
    badge: {
      gu: "શાળા મંજૂરી",
      en: "School Verified",
      hi: "स्कूल सत्यापन",
      className: "bg-surface-container text-primary",
    },
    time: {
      gu: "૪ દિવસ પહેલાં",
      en: "4 days ago",
      hi: "4 दिन पहले",
    },
    title: {
      gu: "શાળા વેરિફિકેશન પૂર્ણ થયું",
      en: "School verification completed",
      hi: "स्कूल सत्यापन पूर्ण हुआ",
    },
    body: {
      gu: "આચાર્ય ડૉ. કલ્પેશ શાહ દ્વારા તમારી સાયકલ અને શિષ્યવૃત્તિ અરજી #APP-2026-00871 સફળતાપૂર્વક માન્ય કરવામાં આવી છે.",
      en: "Principal Dr. Kalpesh Shah successfully verified and forwarded your scholarship application #APP-2026-00871.",
      hi: "प्रधानाचार्य डॉ. कल्पेश शाह द्वारा साइकिल व छात्रवृत्ति आवेदन #APP-2026-00871 सत्यापित किया गया।",
    },
    read: true,
    action: {
      label: {
        gu: "અરજી વિગતો",
        en: "Application Details",
        hi: "आवेदन विवरण",
      },
      href: "/student/applications",
      icon: "arrow_forward",
      variant: "tonal",
    },
  },
  {
    id: "notif-8",
    category: "payments",
    dateGroup: "this_week",
    icon: "link",
    iconBg: "bg-surface-container-high text-primary",
    badge: {
      gu: "NPCI સીડીંગ",
      en: "NPCI Seeding",
      hi: "NPCI सीडिंग",
      className: "bg-surface-container text-primary",
    },
    time: {
      gu: "૫ દિવસ પહેલાં",
      en: "5 days ago",
      hi: "5 दिन पहले",
    },
    title: {
      gu: "આધાર-બેંક ખાતું સફળતાપૂર્વક લિંક થયું (DBT Active)",
      en: "Aadhaar Bank seeded alert - DBT Active",
      hi: "आधार-बैंक खाता सफलतापूर्वक लिंक हुआ (DBT सक्रिय)",
    },
    body: {
      gu: "તમારું આધાર કાર્ડ SBI ખાતા સાથે NPCI મેપર પર ચકાસાયેલ છે. તમામ સરકારી લાભો સીધા ખાતામાં મેળવવા સક્ષમ.",
      en: "Your Aadhaar is mapped to SBI account on NPCI mapper. The account is active to receive all DBT disbursements.",
      hi: "आपका आधार कार्ड एसबीआई खाते के साथ एनपीसीआई मैपर पर सक्रिय है। सभी सरकारी लाभ सीधे खाते में प्राप्त होंगे।",
    },
    read: true,
    action: {
      label: {
        gu: "બેંક સ્થિતિ જુઓ",
        en: "View Bank Status",
        hi: "बैंक स्थिति देखें",
      },
      href: "/student/payments",
      icon: "arrow_forward",
      variant: "tonal",
    },
  },
];

const GUJARATI_DIGITS = ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"];
function toGujaratiDigits(n: number): string {
  return String(n)
    .split("")
    .map((ch) => GUJARATI_DIGITS[Number(ch)] || ch)
    .join("");
}

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const handleMarkSingleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetNotifications = () => {
    setNotifications(INITIAL_NOTIFICATIONS);
    setActiveFilter("all");
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  // Filter calculations
  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === "all") return true;
    return item.category === activeFilter;
  });

  const counts: Record<FilterType, number> = {
    all: notifications.length,
    schemes: notifications.filter((n) => n.category === "schemes").length,
    payments: notifications.filter((n) => n.category === "payments").length,
    delivery: notifications.filter((n) => n.category === "delivery").length,
    alerts: notifications.filter((n) => n.category === "alerts").length,
    grievances: notifications.filter((n) => n.category === "grievances").length,
  };

  const todayList = filteredNotifications.filter((n) => n.dateGroup === "today");
  const yesterdayList = filteredNotifications.filter((n) => n.dateGroup === "yesterday");
  const thisWeekList = filteredNotifications.filter((n) => n.dateGroup === "this_week");

  return (
    <StudentShell>
      <div className="flex flex-col w-full max-w-[430px] mx-auto px-4 pb-24 pt-2">
        {/* Student Context Bar */}
        <section className="mt-2 bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 text-primary">
                <Icon name="school" size={20} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-title-md text-title-md text-on-surface truncate">
                    <T gu="રિયા પટેલ" en="Riya Patel" hi="रिया पटेल" />
                  </span>
                  <span className="font-caption text-caption px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium">
                    <T gu="ધોરણ ૯-B" en="Class 9-B" hi="कक्षा 9-B" />
                  </span>
                </div>
                <p className="font-caption text-caption text-on-surface-variant truncate">
                  CTS: GJ-AND-2026-004512 •{" "}
                  <T
                    gu="શ્રી સરદાર પટેલ હાઇસ્કૂલ, આણંદ"
                    en="Shree Sardar Patel High School, Anand"
                    hi="श्री सरदार पटेल हाई स्कूल, आणंद"
                  />
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-caption text-caption font-semibold">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <T gu="સક્રિય" en="Active" hi="सक्रिय" />
              </span>
            </div>
          </div>
        </section>

        {/* Header & Mark all as read */}
        <section className="mt-5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Link
              href="/student"
              className="w-9 h-9 -ml-1 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container-high transition-colors"
              aria-label="Back to dashboard"
              title="Back"
            >
              <Icon name="arrow_back" size={22} />
            </Link>
            <h1 className="font-headline-sm text-headline-sm text-on-surface">
              <T gu="સૂચનાઓ" en="Notifications" hi="सूचनाएं" />
            </h1>
            <span
              className={`font-label-md text-label-md px-2 py-0.5 rounded-full font-semibold transition-all ${
                unreadCount > 0
                  ? "bg-secondary text-on-secondary shadow-xs"
                  : "bg-surface-container text-on-surface-variant font-medium"
              }`}
            >
              {unreadCount > 0 ? (
                <T
                  gu={`${toGujaratiDigits(unreadCount)} નવી (${unreadCount} New)`}
                  en={`${unreadCount} New`}
                  hi={`${unreadCount} नई`}
                />
              ) : (
                <T gu="બધી વાંચેલી (All Read)" en="All Read" hi="सभी पढ़ी गईं" />
              )}
            </span>
          </div>

          <button
            type="button"
            disabled={unreadCount === 0}
            onClick={handleMarkAllRead}
            className={`flex items-center gap-1 py-1.5 px-2.5 rounded-lg transition-colors ${
              unreadCount === 0
                ? "text-outline opacity-40 cursor-not-allowed"
                : "text-primary hover:bg-surface-container font-semibold"
            }`}
          >
            <Icon name="done_all" size={16} />
            <span className="font-label-md text-label-md">
              <T gu="બધી વાંચી ગણેલ" en="Mark all as read" hi="सभी पढ़ी चिह्नित करें" />
            </span>
          </button>
        </section>

        {/* Filter Chips (Horizontally Scrollable) */}
        <section className="mt-3 -mx-4 px-4 overflow-x-auto no-scrollbar flex items-center gap-2 pb-1">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`filter-chip shrink-0 h-9 px-3.5 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all ${
              activeFilter === "all"
                ? "bg-primary text-on-primary font-semibold shadow-sm"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <Icon name="all_inbox" size={16} />
            <span>
              <T
                gu={`બધી (All • ${counts.all})`}
                en={`All (${counts.all})`}
                hi={`सभी (${counts.all})`}
              />
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter("schemes")}
            className={`filter-chip shrink-0 h-9 px-3.5 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all ${
              activeFilter === "schemes"
                ? "bg-primary text-on-primary font-semibold shadow-sm"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <Icon name="school" size={16} />
            <span>
              <T
                gu={`યોજનાઓ (${counts.schemes})`}
                en={`Schemes (${counts.schemes})`}
                hi={`योजनाएं (${counts.schemes})`}
              />
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter("payments")}
            className={`filter-chip shrink-0 h-9 px-3.5 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all ${
              activeFilter === "payments"
                ? "bg-primary text-on-primary font-semibold shadow-sm"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <Icon name="payments" size={16} />
            <span>
              <T
                gu={`ચુકવણી (${counts.payments})`}
                en={`Payments (${counts.payments})`}
                hi={`भुगतान (${counts.payments})`}
              />
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter("delivery")}
            className={`filter-chip shrink-0 h-9 px-3.5 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all ${
              activeFilter === "delivery"
                ? "bg-primary text-on-primary font-semibold shadow-sm"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <Icon name="pedal_bike" size={16} />
            <span>
              <T
                gu={`સાયકલ વિતરણ (${counts.delivery})`}
                en={`Cycle (${counts.delivery})`}
                hi={`साइकिल (${counts.delivery})`}
              />
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter("alerts")}
            className={`filter-chip shrink-0 h-9 px-3.5 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all ${
              activeFilter === "alerts"
                ? "bg-primary text-on-primary font-semibold shadow-sm"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <Icon name="warning" size={16} />
            <span>
              <T
                gu={`દસ્તાવેજ એલર્ટ (${counts.alerts})`}
                en={`Doc Alerts (${counts.alerts})`}
                hi={`दस्तावेज़ अलर्ट (${counts.alerts})`}
              />
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter("grievances")}
            className={`filter-chip shrink-0 h-9 px-3.5 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all ${
              activeFilter === "grievances"
                ? "bg-primary text-on-primary font-semibold shadow-sm"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <Icon name="support_agent" size={16} />
            <span>
              <T
                gu={`ફરિયાદો (${counts.grievances})`}
                en={`Grievances (${counts.grievances})`}
                hi={`शिकायतें (${counts.grievances})`}
              />
            </span>
          </button>
        </section>

        {/* Global Empty State: When total notifications is 0 */}
        {notifications.length === 0 && (
          <div className="mt-6 bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant">
            <EmptyState
              icon="notifications_off"
              title={<T gu="કોઈ સૂચનાઓ નથી" en="No Notifications" hi="कोई सूचना नहीं" />}
              description={
                <T
                  gu="તમે બધી સૂચનાઓ વાંચી અથવા સાફ કરી દીધી છે. નવી સૂચનાઓ અહીં દેખાશે."
                  en="You have cleared all notifications. New updates and alerts will appear here."
                  hi="आपने सभी सूचनाएं हटा दी हैं। नए अपडेट यहां दिखाई देंगे।"
                />
              }
              action={
                <button
                  type="button"
                  onClick={handleResetNotifications}
                  className="btn-primary inline-flex items-center gap-2 text-sm mt-3"
                >
                  <Icon name="refresh" size={18} />
                  <span>
                    <T gu="ડેમો સૂચનાઓ ફરી લાવો" en="Reset Demo Notifications" hi="डेमो सूचनाएं रीसेट करें" />
                  </span>
                </button>
              }
            />
          </div>
        )}

        {/* Filter Empty State: When filter category has 0 items */}
        {notifications.length > 0 && filteredNotifications.length === 0 && (
          <div className="mt-6 bg-surface-container-lowest rounded-xl p-6 text-center shadow-sm border border-outline-variant">
            <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mx-auto text-outline mb-3">
              <Icon name="filter_alt_off" size={28} />
            </div>
            <h3 className="font-title-md text-title-md text-on-surface">
              <T gu="આ કેટેગરીમાં કોઈ સૂચના નથી" en="No notifications in this category" hi="इस श्रेणी में कोई सूचना नहीं है" />
            </h3>
            <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
              <T
                gu="કૃપા કરીને અન્ય કેટેગરી અથવા 'બધી' ફિલ્ટર પસંદ કરો."
                en="Please select another category or switch back to 'All'."
                hi="कृपया अन्य श्रेणी चुनें या 'सभी' फ़िल्टर देखें।"
              />
            </p>
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-colors shadow-sm"
            >
              <Icon name="all_inbox" size={16} />
              <span>
                <T gu="બધી સૂચનાઓ જુઓ" en="View All Notifications" hi="सभी सूचनाएं देखें" />
              </span>
            </button>
          </div>
        )}

        {/* ── Group 1: આજે (Today) ────────────────────────────────────────── */}
        {todayList.length > 0 && (
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <span className="font-title-md text-title-md text-on-surface font-bold">
                  <T gu="આજે (Today)" en="Today" hi="आज (Today)" />
                </span>
                <span className="font-caption text-caption px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-semibold">
                  <T
                    gu={`${toGujaratiDigits(todayList.length)} સૂચનાઓ`}
                    en={`${todayList.length} notifications`}
                    hi={`${todayList.length} सूचनाएं`}
                  />
                </span>
              </div>
              <span className="font-caption text-caption text-outline">
                <T gu="૧૨ ફેબ્રુઆરી ૨૦૨૬" en="12 Feb 2026" hi="12 फ़रवरी 2026" />
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {todayList.map((item) => (
                <NotificationCard
                  key={item.id}
                  item={item}
                  copiedKey={copiedKey}
                  onMarkRead={() => handleMarkSingleRead(item.id)}
                  onDelete={() => handleDelete(item.id)}
                  onCopy={handleCopy}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Group 2: ગઈકાલે (Yesterday) ─────────────────────────────────── */}
        {yesterdayList.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <span className="font-title-md text-title-md text-on-surface font-bold">
                  <T gu="ગઈકાલે (Yesterday)" en="Yesterday" hi="कल (Yesterday)" />
                </span>
                <span className="font-caption text-caption px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-semibold">
                  <T
                    gu={`${toGujaratiDigits(yesterdayList.length)} સૂચનાઓ`}
                    en={`${yesterdayList.length} notifications`}
                    hi={`${yesterdayList.length} सूचनाएं`}
                  />
                </span>
              </div>
              <span className="font-caption text-caption text-outline">
                <T gu="૧૧ ફેબ્રુઆરી ૨૦૨૬" en="11 Feb 2026" hi="11 फ़रवरी 2026" />
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {yesterdayList.map((item) => (
                <NotificationCard
                  key={item.id}
                  item={item}
                  copiedKey={copiedKey}
                  onMarkRead={() => handleMarkSingleRead(item.id)}
                  onDelete={() => handleDelete(item.id)}
                  onCopy={handleCopy}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Group 3: અગાઉ (Earlier / This Week) ─────────────────────────── */}
        {thisWeekList.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <span className="font-title-md text-title-md text-on-surface font-bold">
                  <T gu="અગાઉ (This Week)" en="This Week" hi="इस सप्ताह (This Week)" />
                </span>
                <span className="font-caption text-caption px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-semibold">
                  <T
                    gu={`${toGujaratiDigits(thisWeekList.length)} સૂચનાઓ`}
                    en={`${thisWeekList.length} notifications`}
                    hi={`${thisWeekList.length} सूचनाएं`}
                  />
                </span>
              </div>
              <span className="font-caption text-caption text-outline">
                <T gu="પાછલા ૭ દિવસ" en="Past 7 days" hi="पिछले 7 दिन" />
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {thisWeekList.map((item) => (
                <NotificationCard
                  key={item.id}
                  item={item}
                  copiedKey={copiedKey}
                  onMarkRead={() => handleMarkSingleRead(item.id)}
                  onDelete={() => handleDelete(item.id)}
                  onCopy={handleCopy}
                />
              ))}
            </div>
          </div>
        )}

        {/* Settings & Alerts Preference Card */}
        <section className="mt-6 bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shrink-0 text-primary">
                <Icon name="tune" size={20} />
              </div>
              <div>
                <h2 className="font-title-md text-title-md text-on-surface">
                  <T
                    gu="SMS અને WhatsApp એલર્ટ સેટિંગ્સ"
                    en="SMS and WhatsApp Alert Settings"
                    hi="एसएमएस और व्हाट्सएप अलर्ट सेटिंग्स"
                  />
                </h2>
                <p className="mt-0.5 font-caption text-caption text-on-surface-variant leading-normal">
                  <T
                    gu="નોંધાયેલ મોબાઈલ નંબર (+91 98••• ••521) પર નિયમિત અપડેટ મેળવો."
                    en="Receive timely updates on registered mobile number (+91 98••• ••521)."
                    hi="पंजीकृत मोबाइल नंबर (+91 98••• ••521) पर समय पर अपडेट प्राप्त करें।"
                  />
                </p>
              </div>
            </div>
            <Link
              href="/student/profile"
              className="shrink-0 text-primary hover:text-primary-container font-label-md text-label-md font-semibold flex items-center gap-0.5 pt-1"
            >
              <span>
                <T gu="સેટિંગ્સ" en="Settings" hi="सेटिंग्स" />
              </span>
              <Icon name="chevron_right" size={16} />
            </Link>
          </div>

          {/* Quick Preferences Toggle Row */}
          <div className="mt-3 pt-1 flex items-center justify-between gap-3 bg-surface-container-low rounded-lg p-2.5 border border-outline-variant/60">
            <div className="flex items-center gap-2">
              <Icon name="chat" size={18} className="text-primary" />
              <span className="font-label-md text-label-md text-on-surface">
                <T
                  gu="WhatsApp પર તાત્કાલિક સૂચના"
                  en="Instant notification on WhatsApp"
                  hi="व्हाट्सएप पर तत्काल सूचना"
                />
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={whatsappEnabled}
                onChange={() => setWhatsappEnabled((prev) => !prev)}
                className="sr-only peer"
                aria-label="Toggle WhatsApp notifications"
              />
              <div className="w-10 h-5 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:border-outline-variant after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>
        </section>

        {/* Legal & DPDP Disclaimer */}
        <footer className="mt-6 text-center px-2">
          <div className="inline-flex items-center justify-center gap-1.5 text-outline">
            <Icon name="shield" size={14} />
            <span className="font-caption text-caption">
              <T
                gu="ગુજરાત સરકાર • શિક્ષણ વિભાગ (Government of Gujarat)"
                en="Government of Gujarat • Education Department"
                hi="गुजरात सरकार • शिक्षा विभाग"
              />
            </span>
          </div>
          <p className="mt-1 font-caption text-caption text-outline leading-relaxed max-w-xs mx-auto">
            <T
              gu="ડિજિટલ પર્સનલ ડેટા પ્રોટેક્શન (DPDP) કાયદો, ૨૦૨૩ અંતર્ગત આ ડેટા સુરક્ષિત છે. તમામ નાણાકીય માહિતી NIC અને DBT મિશન સાથે એન્ક્રિપ્ટેડ છે."
              en="This data is protected under the Digital Personal Data Protection (DPDP) Act, 2023. All financial records are encrypted with NIC and DBT Mission."
              hi="यह डेटा डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) अधिनियम, 2023 के तहत सुरक्षित है। सभी वित्तीय रिकॉर्ड एनआईसी और डीबीटी मिशन के साथ एन्क्रिप्टेड हैं।"
            />
          </p>
        </footer>
      </div>
    </StudentShell>
  );
}

// ── Notification Card Component ──────────────────────────────────────────────
interface NotificationCardProps {
  item: NotificationItem;
  copiedKey: string | null;
  onMarkRead: () => void;
  onDelete: () => void;
  onCopy: (text: string, key: string) => void;
}

function NotificationCard({
  item,
  copiedKey,
  onMarkRead,
  onDelete,
  onCopy,
}: NotificationCardProps) {
  return (
    <article
      className={`notification-item bg-surface-container-lowest rounded-xl p-4 shadow-sm transition-all hover:shadow-md relative overflow-hidden border border-outline-variant ${
        !item.read ? "ring-1 ring-primary/25" : ""
      }`}
    >
      {/* Unread indicator dot */}
      {!item.read && (
        <span
          className="absolute top-3.5 right-3.5 w-2.5 h-2.5 rounded-full bg-primary unread-dot shadow-xs"
          title="Unread"
        />
      )}

      <div className="flex items-start gap-3">
        {/* Type-colored icon */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
          <Icon name={item.icon} size={24} />
        </div>

        {/* Content body */}
        <div className="min-w-0 flex-1 pr-3">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span className={`font-label-md text-label-md px-2 py-0.5 rounded-full font-semibold ${item.badge.className}`}>
              <T gu={item.badge.gu} en={item.badge.en} hi={item.badge.hi} />
            </span>
            <span className="font-caption text-caption text-outline flex items-center gap-0.5">
              <Icon name="schedule" size={12} />
              <T gu={item.time.gu} en={item.time.en} hi={item.time.hi} />
            </span>
          </div>

          <h3 className={`font-title-md text-title-md text-on-surface leading-snug ${!item.read ? "font-bold" : "font-semibold"}`}>
            <T gu={item.title.gu} en={item.title.en} hi={item.title.hi} />
          </h3>

          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            <T gu={item.body.gu} en={item.body.en} hi={item.body.hi} />
          </p>

          {/* Extra: UTR Pill for DBT Payments */}
          {item.extraType === "utr" && (
            <div className="mt-2 p-2 rounded-lg bg-surface-container-low flex items-center justify-between text-on-surface border border-outline-variant/60">
              <span className="font-caption text-caption text-on-surface-variant font-mono">
                UTR: SBIN2611020045
              </span>
              <span className="font-caption text-caption px-2 py-0.5 rounded-full bg-success-container text-on-success-container font-semibold flex items-center gap-1">
                <Icon name="check_circle" size={12} fill />
                <T gu="ચુકવણી પૂર્ણ" en="Payment Complete" hi="भुगतान पूर्ण" />
              </span>
            </div>
          )}

          {/* Extra: Cycle Handover OTP Card */}
          {item.extraType === "otp" && (
            <div className="mt-2 p-2.5 rounded-xl bg-surface-container flex items-center justify-between border border-secondary-fixed">
              <div>
                <span className="font-caption text-caption text-outline block">
                  <T gu="વેરિફિકેશન OTP" en="Verification OTP" hi="सत्यापन ओटीपी" />
                </span>
                <span className="font-headline-sm text-headline-sm tracking-widest text-primary font-bold">
                  482913
                </span>
              </div>
              <div className="text-right">
                <span className="font-caption text-caption px-2 py-0.5 rounded-full bg-surface-container-high text-secondary font-semibold block">
                  <T gu="માન્ય: ૧૦ મિનિટ" en="Valid: 10 mins" hi="वैधता: 10 मिनट" />
                </span>
                <button
                  type="button"
                  onClick={() => onCopy("482913", `otp-${item.id}`)}
                  className="mt-1 font-caption text-caption text-primary hover:underline flex items-center gap-0.5 justify-end"
                >
                  <Icon name={copiedKey === `otp-${item.id}` ? "check" : "content_copy"} size={12} />
                  <span>
                    {copiedKey === `otp-${item.id}` ? (
                      <T gu="કોપી થયું!" en="Copied!" hi="कॉपी हुआ!" />
                    ) : (
                      <T gu="કોપી કરો" en="Copy OTP" hi="कॉपी करें" />
                    )}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="mt-3 pt-2 border-t border-surface-container-low flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {item.action && (
                <Link
                  href={item.action.href}
                  className={`h-9 px-3 rounded-lg font-label-md text-label-md font-semibold flex items-center gap-1.5 transition-colors shadow-xs ${
                    item.action.variant === "primary"
                      ? "bg-primary text-on-primary hover:bg-primary-container"
                      : item.action.variant === "secondary"
                      ? "bg-secondary text-on-secondary hover:bg-secondary-container"
                      : "bg-surface-container text-primary hover:bg-surface-container-high"
                  }`}
                >
                  <span>
                    <T
                      gu={item.action.label.gu}
                      en={item.action.label.en}
                      hi={item.action.label.hi}
                    />
                  </span>
                  <Icon name={item.action.icon || "arrow_forward"} size={16} />
                </Link>
              )}

              {!item.read && (
                <button
                  type="button"
                  onClick={onMarkRead}
                  className="font-caption text-caption text-outline hover:text-on-surface hover:bg-surface-container px-2 py-1.5 rounded transition-colors"
                >
                  <T gu="વાંચેલી ગણો" en="Mark as read" hi="पढ़ी हुई चिह्नित करें" />
                </button>
              )}
            </div>

            {/* Swipe-to-dismiss simulation: Delete / dismiss button */}
            <button
              type="button"
              onClick={onDelete}
              className="text-outline hover:text-danger hover:bg-danger-container/40 p-1.5 rounded-lg transition-colors flex items-center gap-1"
              title="Dismiss notification"
              aria-label="Dismiss notification"
            >
              <Icon name="delete_outline" size={18} />
              <span className="font-caption text-caption">
                <T gu="કાઢી નાખો" en="Dismiss" hi="हटाएं" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
