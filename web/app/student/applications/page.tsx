"use client";

import { useState } from "react";
import Link from "next/link";
import { StudentShell } from "@/components/shell/StudentShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { StatusChip, Avatar, EmptyState } from "@/components/ui";

type TabFilter = "all" | "active" | "completed" | "action";

interface TimelineStep {
  titleGu: string;
  titleEn: string;
  titleHi: string;
  descGu?: string;
  descEn?: string;
  descHi?: string;
  time?: string;
  status: "completed" | "current" | "pending";
  activeBadgeGu?: string;
  activeBadgeEn?: string;
  activeBadgeHi?: string;
}

interface ApplicationData {
  id: string;
  schemeId: string;
  nameGu: string;
  nameEn: string;
  nameHi: string;
  appId: string;
  dateGu: string;
  dateEn: string;
  dateHi: string;
  category: "active" | "completed" | "action";
  status: "approved" | "pending" | "rejected" | "inprogress";
  statusLabelGu: string;
  statusLabelEn: string;
  statusLabelHi: string;
  amount?: string;
  rank?: string;
  currentStepIndex: number;
  totalSteps: number;
  timeline: TimelineStep[];
  expectedDateGu?: string;
  expectedDateEn?: string;
  expectedDateHi?: string;
  noteGu?: string;
  noteEn?: string;
  noteHi?: string;
  utr?: string;
  account?: string;
  accountHolder?: string;
  errorReasonGu?: string;
  errorReasonEn?: string;
  errorReasonHi?: string;
  errorDescGu?: string;
  errorDescEn?: string;
  errorDescHi?: string;
  cycleWarehouse?: boolean;
  cycleArrivalNoteGu?: string;
  cycleArrivalNoteEn?: string;
  cycleArrivalNoteHi?: string;
}

const APPLICATIONS: ApplicationData[] = [
  {
    id: "app-namo-lakshmi",
    schemeId: "namo-lakshmi",
    nameGu: "નમો લક્ષ્મી યોજના",
    nameEn: "Namo Lakshmi Yojana",
    nameHi: "नमो लक्ष्मी योजना",
    appId: "APP-2026-00871",
    dateGu: "૧૨ ઓક્ટોબર ૨૦૨૬",
    dateEn: "12 Oct 2026",
    dateHi: "12 अक्टूबर 2026",
    category: "active",
    status: "inprogress",
    statusLabelGu: "DEO મંજૂર",
    statusLabelEn: "DEO Approved",
    statusLabelHi: "डीईओ स्वीकृत",
    amount: "₹ ૧૦,૦૦૦",
    currentStepIndex: 4,
    totalSteps: 6,
    expectedDateGu: "અંદાજિત જમા તારીખ: ૦૫ નવેમ્બર ૨૦૨૬",
    expectedDateEn: "Estimated Credit Date: 05 November 2026",
    expectedDateHi: "अनुमानित जमा तिथि: 05 नवंबर 2026",
    timeline: [
      {
        titleGu: "અરજી સબમિટ",
        titleEn: "Applied",
        titleHi: "आवेदन सबमिट",
        time: "12 Oct, 11:30 AM",
        descGu: "ડિજિટલ પોર્ટલ દ્વારા સફળતાપૂર્વક સબમિટ",
        descEn: "Successfully submitted via digital portal",
        descHi: "डिजिटल पोर्टल के माध्यम से सफलतापूर्वक जमा किया गया",
        status: "completed",
      },
      {
        titleGu: "શાળા ચકાસણી",
        titleEn: "School Verified",
        titleHi: "स्कूल सत्यापन",
        time: "15 Oct",
        descGu: "પ્રિન્સિપાલ ડૉ. કલ્પેશ શાહ દ્વારા સત્યાપિત",
        descEn: "Verified by Principal Dr. Kalpesh Shah",
        descHi: "प्रिंसिपल डॉ. कल्पेश शाह द्वारा सत्यापित",
        status: "completed",
      },
      {
        titleGu: "ડીઈઓ મંજૂરી",
        titleEn: "DEO Approved",
        titleHi: "डीईओ स्वीकृति",
        time: "22 Oct",
        descGu: "ડીઈઓ આણંદ કચેરી દ્વારા ક્વોટા સ્વીકૃત",
        descEn: "Quota sanctioned by DEO Anand Office",
        descHi: "डीईओ आणंद कार्यालय द्वारा कोटा स्वीकृत",
        status: "completed",
      },
      {
        titleGu: "મંજૂરી આદેશ",
        titleEn: "Sanctioned",
        titleHi: "मंजूरी आदेश",
        descGu: "રાજ્ય શિક્ષણ બોર્ડ વેરિફિકેશન • ૨-૩ દિવસમાં પૂર્ણ થશે",
        descEn: "State Education Board verification • Expected in 2-3 days",
        descHi: "राज्य शिक्षा बोर्ड सत्यापन • 2-3 दिनों में पूरा होगा",
        status: "current",
        activeBadgeGu: "ચાલુ",
        activeBadgeEn: "In Progress",
        activeBadgeHi: "चालू",
      },
      {
        titleGu: "DBT ચૂકવણી પ્રક્રિયા",
        titleEn: "DBT Initiated",
        titleHi: "DBT भुगतान प्रक्रिया",
        descGu: "PFMS પેમેન્ટ ગેટવે રવાનગી",
        descEn: "PFMS Payment Gateway forward",
        descHi: "PFMS पेमेंट गेटवे को अग्रेषित",
        status: "pending",
      },
      {
        titleGu: "ખાતામાં જમા",
        titleEn: "Credited",
        titleHi: "खाते में जमा",
        descGu: "આધાર સીડેડ બેંક ખાતામાં ટ્રાન્સફર",
        descEn: "Transfer to Aadhaar seeded bank account",
        descHi: "आधार लिंक बैंक खाते में स्थानांतरण",
        status: "pending",
      },
    ],
  },
  {
    id: "app-saraswati-sadhna",
    schemeId: "saraswati-sadhna",
    nameGu: "સરસ્વતી સાધના સાઇકલ યોજના",
    nameEn: "Saraswati Sadhna Bicycle Scheme",
    nameHi: "सरस्वती साधना साइकिल योजना",
    appId: "APP-2026-00872",
    dateGu: "૧૨ ઓક્ટોબર ૨૦૨૬",
    dateEn: "12 Oct 2026",
    dateHi: "12 अक्टूबर 2026",
    category: "active",
    status: "inprogress",
    statusLabelGu: "ડિલિવરી હેઠળ",
    statusLabelEn: "Dispatched",
    statusLabelHi: "वितरण के तहत",
    cycleWarehouse: true,
    cycleArrivalNoteGu:
      "આચાર્યશ્રી દ્વારા ચકાસણી પૂર્ણ. વિતરણ કાર્યક્રમ માટે OTP હેન્ડઓવર બાકી છે.",
    cycleArrivalNoteEn:
      "Principal verification completed. Handover OTP required during distribution ceremony.",
    cycleArrivalNoteHi:
      "प्रधानाचार्य द्वारा सत्यापन पूर्ण। वितरण कार्यक्रम के लिए OTP हैंडओवर बाकी है।",
    currentStepIndex: 4,
    totalSteps: 5,
    timeline: [
      {
        titleGu: "અરજી સબમિટ",
        titleEn: "Applied",
        titleHi: "आवेदन सबमिट",
        time: "12 Oct",
        descGu: "ઓનલાઇન અરજી સફળતાપૂર્વક સ્વીકૃત",
        descEn: "Application successfully submitted",
        descHi: "ऑनलाइन आवेदन सफलतापूर्वक स्वीकार",
        status: "completed",
      },
      {
        titleGu: "શાળા ચકાસણી",
        titleEn: "School Verified",
        titleHi: "स्कूल सत्यापन",
        time: "16 Oct",
        descGu: "શાળા પ્રવેશ અને હાજરી સત્યાપિત",
        descEn: "School enrollment and attendance verified",
        descHi: "स्कूल प्रवेश और उपस्थिति सत्यापित",
        status: "completed",
      },
      {
        titleGu: "ડીઈઓ મંજૂરી",
        titleEn: "DEO Approved",
        titleHi: "डीईओ स्वीकृति",
        time: "20 Oct",
        descGu: "જિલ્લા શિક્ષણ અધિકારી દ્વારા મંજૂર",
        descEn: "Approved by District Education Officer",
        descHi: "जिला शिक्षा अधिकारी द्वारा अनुमोदित",
        status: "completed",
      },
      {
        titleGu: "ડિલિવરી & સાઇકલ પહોંચી",
        titleEn: "Arrived at School",
        titleHi: "स्कूल पहुंची",
        descGu: "સાઇકલ શાળા પરિસરમાં પહોંચી ગઈ છે",
        descEn: "Bicycle reached school campus",
        descHi: "साइकिल स्कूल परिसर में पहुंच गई है",
        status: "current",
        activeBadgeGu: "ચાલુ",
        activeBadgeEn: "Ready",
        activeBadgeHi: "तैयार",
      },
      {
        titleGu: "વિદ્યાર્થી હેન્ડઓવર",
        titleEn: "Student Handover",
        titleHi: "छात्र को सुपुर्द",
        descGu: "OTP વેરિફિકેશન દ્વારા સાઇકલ વિતરણ",
        descEn: "Final bicycle handover via OTP verification",
        descHi: "OTP सत्यापन के माध्यम से अंतिम वितरण",
        status: "pending",
      },
    ],
  },
  {
    id: "app-gyan-sadhna",
    schemeId: "gyan-sadhna",
    nameGu: "જ્ઞાન સાધના મેરિટ સ્કોલરશિપ",
    nameEn: "Gyan Sadhna Merit Scholarship",
    nameHi: "ज्ञान साधना मेरिट छात्रवृत्ति",
    appId: "APP-2025-004190",
    dateGu: "૧૫ ઓગસ્ટ ૨૦૨૫",
    dateEn: "15 Aug 2025",
    dateHi: "15 अगस्त 2025",
    category: "completed",
    status: "approved",
    statusLabelGu: "ખાતામાં જમા",
    statusLabelEn: "Credited ✓",
    statusLabelHi: "खाते में जमा ✓",
    amount: "₹ ૧૨,૫૦૦",
    rank: "#૧૪૨",
    expectedDateGu: "૦૨ નવેમ્બર ૨૦૨૬",
    expectedDateEn: "02 November 2026",
    expectedDateHi: "02 नवंबर 2026",
    utr: "SBIN2611020045",
    account: "••••4521",
    accountHolder: "હેતલબેન પટેલ",
    currentStepIndex: 5,
    totalSteps: 5,
    timeline: [
      {
        titleGu: "અરજી સબમિટ",
        titleEn: "Applied",
        titleHi: "आवेदन सबमिट",
        time: "15 Aug 2025",
        descGu: "પરીક્ષા પરિણામ સાથે અરજી સબમિટ",
        descEn: "Application submitted with exam results",
        descHi: "परीक्षा परिणाम के साथ आवेदन सबमिट",
        status: "completed",
      },
      {
        titleGu: "શાળા ચકાસણી",
        titleEn: "School Verified",
        titleHi: "स्कूल सत्यापन",
        time: "20 Aug 2025",
        descGu: "શાળા દ્વારા ગુણપત્રક પ્રમાણિત",
        descEn: "Marksheet certified by school",
        descHi: "स्कूल द्वारा अंकतालिका प्रमाणित",
        status: "completed",
      },
      {
        titleGu: "ડીઈઓ & રાજ્ય મેરિટ",
        titleEn: "DEO & Merit Selection",
        titleHi: "डीईओ और मेरिट चयन",
        time: "05 Sep 2025",
        descGu: "રાજ્ય મેરિટ યાદીમાં ક્રમાંક #૧૪૨",
        descEn: "Ranked #142 in State Merit List",
        descHi: "राज्य मेरिट सूची में रैंक #142",
        status: "completed",
      },
      {
        titleGu: "મંજૂરી આદેશ",
        titleEn: "Sanctioned",
        titleHi: "मंजूरी आदेश",
        time: "18 Oct 2026",
        descGu: "નાણાં વિભાગ દ્વારા ભંડોળ મંજૂર",
        descEn: "Fund sanctioned by Finance Dept",
        descHi: "वित्त विभाग द्वारा फंड मंजूर",
        status: "completed",
      },
      {
        titleGu: "ખાતામાં જમા (DBT)",
        titleEn: "Credited via DBT",
        titleHi: "DBT द्वारा खाते में जमा",
        time: "02 Nov 2026",
        descGu: "SBI બેંક ખાતામાં ₹૧૨,૫૦૦ જમા",
        descEn: "Credited ₹12,500 directly to SBI account",
        descHi: "एसबीआई बैंक खाते में ₹12,500 जमा",
        status: "completed",
      },
    ],
  },
  {
    id: "app-obc-pre-matric",
    schemeId: "obc-pre-matric",
    nameGu: "ઓબીસી કેટેગરી પ્રી-મેટ્રિક શિષ્યવૃત્તિ",
    nameEn: "OBC Pre-Matric Scholarship",
    nameHi: "ओबीसी प्री-मैट्रिक छात्रवृत्ति",
    appId: "APP-2026-00875",
    dateGu: "૧૮ ઓક્ટોબર ૨૦૨૬",
    dateEn: "18 Oct 2026",
    dateHi: "18 अक्टूबर 2026",
    category: "action",
    status: "rejected",
    statusLabelGu: "સુધારો જરૂરી",
    statusLabelEn: "Correction Needed",
    statusLabelHi: "सुधार आवश्यक",
    errorReasonGu: "કારણ: આવકના દાખલાની તારીખ પૂર્ણ થયેલ છે",
    errorReasonEn: "Reason: Income Certificate Expired",
    errorReasonHi: "कारण: आय प्रमाण पत्र समाप्त हो गया है",
    errorDescGu:
      "Expired Income Certificate. સક્ષમ અધિકારી દ્વારા જારી કરાયેલું નાણાકીય વર્ષ ૨૦૨૫-૨૬ નું પ્રમાણપત્ર અપલોડ કરો.",
    errorDescEn:
      "Expired Income Certificate. Please upload a valid certificate for FY 2025-26 issued by a competent authority.",
    errorDescHi:
      "सक्षम प्राधिकारी द्वारा जारी वित्तीय वर्ष 2025-26 का वैध आय प्रमाण पत्र अपलोड करें।",
    currentStepIndex: 3,
    totalSteps: 5,
    timeline: [
      {
        titleGu: "અરજી સબમિટ",
        titleEn: "Applied",
        titleHi: "आवेदन सबमिट",
        time: "18 Oct",
        descGu: "દસ્તાવેજો સાથે અરજી સબમિટ",
        descEn: "Submitted with uploaded documents",
        descHi: "दस्तावेजों के साथ आवेदन सबमिट",
        status: "completed",
      },
      {
        titleGu: "શાળા ચકાસણી",
        titleEn: "School Verified",
        titleHi: "स्कूल सत्यापन",
        time: "24 Oct",
        descGu: "શાળા સ્તરે ચકાસણી પૂર્ણ",
        descEn: "Verified at school level",
        descHi: "स्कूल स्तर पर सत्यापन पूर्ण",
        status: "completed",
      },
      {
        titleGu: "દસ્તાવેજ ચકાસણી ક્ષતિ",
        titleEn: "Document Query Raised",
        titleHi: "दस्तावेज़ आपत्ति दर्ज",
        time: "30 Oct",
        descGu: "આવક દાખલો સમયાવધિ સમાપ્ત થયેલ માલૂમ પડ્યો",
        descEn: "Income certificate found to be expired",
        descHi: "आय प्रमाण पत्र की अवधि समाप्त पाई गई",
        status: "current",
        activeBadgeGu: "સુધારો",
        activeBadgeEn: "Action",
        activeBadgeHi: "सुधार",
      },
      {
        titleGu: "સુધારેલ દસ્તાવેજ પુનઃ અપલોડ",
        titleEn: "Re-upload & Review",
        titleHi: "पुनः अपलोड और समीक्षा",
        descGu: "વિદ્યાર્થી તરફથી અપલોડની રાહ જોવાઈ રહી છે",
        descEn: "Waiting for student to upload new document",
        descHi: "छात्र की ओर से नया दस्तावेज़ अपेक्षित",
        status: "pending",
      },
      {
        titleGu: "મંજૂરી અને DBT ચૂકવણી",
        titleEn: "Final Approval & DBT",
        titleHi: "अंतिम स्वीकृति और DBT",
        descGu: "યોગ્ય દસ્તાવેજ બાદ સ્વીકૃતિ",
        descEn: "Sanction after document clearance",
        descHi: "दस्तावेज़ स्वीकृति के बाद भुगतान",
        status: "pending",
      },
    ],
  },
];

export default function StudentApplicationsPage() {
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [expandedTimelines, setExpandedTimelines] = useState<Record<string, boolean>>({
    "app-namo-lakshmi": true,
  });
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const toggleTimeline = (id: string) => {
    setExpandedTimelines((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDownload = (id: string) => {
    setDownloadSuccess(id);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 3000);
  };

  // Filter cards
  const filteredApps = APPLICATIONS.filter((app) => {
    if (activeTab === "all") return true;
    return app.category === activeTab;
  });

  const activeCount = APPLICATIONS.filter((a) => a.category === "active").length;
  const completedCount = APPLICATIONS.filter((a) => a.category === "completed").length;
  const actionCount = APPLICATIONS.filter((a) => a.category === "action").length;
  const totalCount = APPLICATIONS.length;

  return (
    <StudentShell>
      <div className="flex flex-col w-full px-4 space-y-4 pt-4 pb-20 max-w-[430px] mx-auto">
        {/* Top Navigation & Header */}
        <div className="flex flex-col pt-1">
          <div className="flex items-center gap-3 mb-1">
            <Link
              href="/student"
              aria-label="Back"
              className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors shrink-0"
            >
              <Icon name="arrow_back" size={20} />
            </Link>
            <div className="min-w-0">
              <h1 className="font-headline-sm text-headline-sm text-on-surface tracking-tight truncate flex items-center gap-1.5 flex-wrap">
                <span>
                  <T gu="મારી અરજીઓ" en="My Applications" hi="मेरे आवेदन" />
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant font-normal">
                  | <T gu="અરજી ટ્રેકર" en="Application Tracker" hi="आवेदन ट्रैकर" />
                </span>
              </h1>
            </div>
          </div>
          <p className="font-caption text-caption text-on-surface-variant leading-relaxed">
            <T
              gu="બધી સ્કોલરશિપ અરજીઓનું રીયલ-ટાઇમ સ્ટેટસ (Track real-time status of all scholarship applications)"
              en="Track real-time status of all scholarship applications"
              hi="सभी छात्रवृत्ति आवेदनों की रीयल-टाइम स्थिति देखें"
            />
          </p>
        </div>

        {/* Student Identifier Snippet */}
        <div className="flex items-center justify-between bg-surface-container-low px-4 py-2.5 rounded-xl border border-outline-variant/60">
          <div className="flex items-center gap-2.5">
            <Avatar
              name="Riya Patel"
              size="sm"
              className="bg-primary-fixed text-primary font-bold"
            />
            <div>
              <p className="font-label-md text-label-md text-on-surface font-semibold leading-tight">
                <T gu="રિયા પટેલ" en="Riya Patel" hi="रिया पटेल" />
              </p>
              <p className="font-caption text-[11px] text-on-surface-variant">
                <T
                  gu="ધોરણ ૧૦ (Class 10-A) • આણંદ"
                  en="Class 10-A • Anand"
                  hi="कक्षा 10-A • आणंद"
                />
              </p>
            </div>
          </div>
          <span className="font-caption text-[11px] bg-surface text-primary px-2.5 py-1 rounded-full font-semibold shadow-sm border border-outline-variant/50">
            <T gu="વિદ્યાર્થી ID: VPS-9921" en="Student ID: VPS-9921" hi="छात्र ID: VPS-9921" />
          </span>
        </div>

        {/* Summary KPI Row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-surface-container-lowest p-3 rounded-xl shadow-level-1 border border-outline-variant/60 flex flex-col items-center text-center">
            <span className="font-caption text-[11px] text-on-surface-variant mb-0.5 truncate w-full">
              <T gu="કુલ અરજીઓ" en="Total Applied" hi="कुल आवेदन" />
            </span>
            <span className="font-headline-sm text-headline-sm text-primary font-bold">
              0{totalCount}
            </span>
            <span className="font-caption text-[10px] text-outline font-medium mt-0.5">
              Total Applied
            </span>
          </div>

          <div className="bg-surface-container-lowest p-3 rounded-xl shadow-level-1 border border-outline-variant/60 flex flex-col items-center text-center">
            <span className="font-caption text-[11px] text-on-surface-variant mb-0.5 truncate w-full">
              <T gu="મંજૂર થયેલ" en="Approved" hi="स्वीकृत" />
            </span>
            <span className="font-headline-sm text-headline-sm text-[#15803D] font-bold">
              0{completedCount}
            </span>
            <span className="font-caption text-[10px] text-[#15803D] font-medium mt-0.5">
              Approved
            </span>
          </div>

          <div className="bg-surface-container-lowest p-3 rounded-xl shadow-level-1 border border-outline-variant/60 flex flex-col items-center text-center">
            <span className="font-caption text-[11px] text-on-surface-variant mb-0.5 truncate w-full">
              <T gu="પ્રક્રિયા હેઠળ" en="In Progress" hi="प्रक्रियाधीन" />
            </span>
            <span className="font-headline-sm text-headline-sm text-secondary font-bold">
              0{activeCount}
            </span>
            <span className="font-caption text-[10px] text-secondary font-medium mt-0.5">
              In Progress
            </span>
          </div>
        </div>

        {/* Filter Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none" id="statusFilterBar">
          <button
            onClick={() => setActiveTab("all")}
            type="button"
            className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-all ${
              activeTab === "all"
                ? "bg-primary-container text-on-primary font-semibold shadow-sm"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <T gu="બધી" en="All" hi="सभी" /> ({totalCount})
          </button>

          <button
            onClick={() => setActiveTab("active")}
            type="button"
            className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-all ${
              activeTab === "active"
                ? "bg-primary-container text-on-primary font-semibold shadow-sm"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <T gu="સક્રિય" en="Active" hi="सक्रिय" /> ({activeCount})
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            type="button"
            className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-all ${
              activeTab === "completed"
                ? "bg-primary-container text-on-primary font-semibold shadow-sm"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <T gu="પૂર્ણ / જમા" en="Completed" hi="पूर्ण / जमा" /> ({completedCount})
          </button>

          <button
            onClick={() => setActiveTab("action")}
            type="button"
            className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-all ${
              activeTab === "action"
                ? "bg-primary-container text-on-primary font-semibold shadow-sm"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <T gu="ધ્યાન આપો" en="Action Required" hi="कार्रवाई आवश्यक" /> ({actionCount})
          </button>
        </div>

        {/* Download notification banner if active */}
        {downloadSuccess && (
          <div className="bg-[#DCFCE7] text-[#15803D] px-3.5 py-2 rounded-xl text-caption flex items-center gap-2 border border-[#BBF7D0] animate-fade-in">
            <Icon name="check_circle" size={16} fill />
            <span>
              <T
                gu="અરજી પત્રક સફળતાપૂર્વક ડાઉનલોડ થયું છે (PDF)."
                en="Application PDF downloaded successfully."
                hi="आवेदन पत्र सफलतापूर्वक डाउनलोड हो गया (PDF)।"
              />
            </span>
          </div>
        )}

        {/* Cards Feed */}
        <div className="space-y-4" id="applicationCardsContainer">
          {filteredApps.length === 0 ? (
            <div className="card p-6 bg-surface-container-lowest">
              <EmptyState
                icon="inbox"
                title="કોઈ અરજીઓ મળી નથી"
                description="પસંદ કરેલ ફિલ્ટર હેઠળ કોઈ અરજી ઉપલબ્ધ નથી."
                action={
                  <button
                    onClick={() => setActiveTab("all")}
                    className="btn-outline text-label-md h-9 px-4 rounded-lg flex items-center gap-1.5"
                  >
                    <Icon name="refresh" size={16} />
                    <T gu="બધી અરજીઓ બતાવો" en="Show All Applications" hi="सभी आवेदन दिखाएं" />
                  </button>
                }
              />
            </div>
          ) : (
            filteredApps.map((app) => {
              const isTimelineOpen = !!expandedTimelines[app.id];

              return (
                <div
                  key={app.id}
                  className="bg-surface-container-lowest rounded-2xl p-4 shadow-level-1 border border-outline-variant/60 space-y-3.5"
                  data-category={app.category}
                >
                  {/* Top card info: Status chip, Title, ID, Amount / Icon */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div>
                        <StatusChip
                          status={app.status}
                          label={
                            <T
                              gu={app.statusLabelGu}
                              en={app.statusLabelEn}
                              hi={app.statusLabelHi}
                            />
                          }
                        />
                      </div>
                      <h2 className="font-title-md text-title-md text-on-surface pt-0.5 leading-snug">
                        <T gu={app.nameGu} en={app.nameEn} hi={app.nameHi} />
                      </h2>
                      <p className="font-caption text-caption text-on-surface-variant flex items-center gap-1 flex-wrap">
                        <span>
                          ID: <span className="font-semibold text-on-surface">{app.appId}</span>
                        </span>
                        <span>•</span>
                        <span>
                          <T gu={app.dateGu} en={app.dateEn} hi={app.dateHi} />
                        </span>
                        {app.rank && (
                          <>
                            <span>•</span>
                            <span>
                              <T
                                gu={`મેરિટ ક્રમાંક: ${app.rank}`}
                                en={`Merit Rank: ${app.rank}`}
                                hi={`मेरिट रैंक: ${app.rank}`}
                              />
                            </span>
                          </>
                        )}
                        {app.category === "action" && (
                          <>
                            <span>•</span>
                            <span className="text-danger font-medium">
                              <T gu="૩ દિવસ બાકી" en="3 days left" hi="3 दिन शेष" />
                            </span>
                          </>
                        )}
                      </p>
                    </div>

                    {/* Right corner badge or icon */}
                    {app.amount && app.category !== "completed" && (
                      <div className="text-right shrink-0 bg-surface-container px-2.5 py-1.5 rounded-xl border border-outline-variant/40">
                        <span className="font-caption text-[11px] text-on-surface-variant block">
                          <T gu="સહાય રકમ" en="Benefit" hi="सहायता राशि" />
                        </span>
                        <span className="font-label-lg text-label-lg text-primary font-bold">
                          {app.amount}
                        </span>
                      </div>
                    )}

                    {app.cycleWarehouse && (
                      <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0 border border-outline-variant/40">
                        <Icon name="pedal_bike" size={24} />
                      </div>
                    )}

                    {app.category === "completed" && (
                      <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#15803D] shrink-0 border border-[#BBF7D0]">
                        <Icon name="account_balance_wallet" size={24} />
                      </div>
                    )}

                    {app.category === "action" && (
                      <div className="w-10 h-10 rounded-xl bg-danger-container flex items-center justify-center text-danger shrink-0 border border-danger/20">
                        <Icon name="assignment_late" size={24} />
                      </div>
                    )}
                  </div>

                  {/* Micro Status Banner for Saraswati Bicycle Scheme */}
                  {app.cycleWarehouse && (
                    <div className="bg-surface-container-high p-3 rounded-xl flex items-start gap-2.5 border border-outline-variant/50">
                      <Icon name="warehouse" size={20} className="text-secondary shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="font-label-md text-label-md text-on-surface font-semibold">
                          <T
                            gu="સાઇકલ શાળામાં પહોંચી ગઈ છે"
                            en="Bicycle arrived at school"
                            hi="साइकिल स्कूल पहुंच गई है"
                          />
                        </p>
                        <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                          <T
                            gu={app.cycleArrivalNoteGu ?? ""}
                            en={app.cycleArrivalNoteEn ?? ""}
                            hi={app.cycleArrivalNoteHi ?? ""}
                          />
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Success Card Box for Completed Scheme */}
                  {app.category === "completed" && (
                    <div className="bg-[#F0FDF4] p-3 rounded-xl space-y-1.5 border border-[#DCFCE7]">
                      <div className="flex items-center justify-between">
                        <span className="font-title-md text-title-md text-[#15803D] font-bold">
                          {app.amount}
                        </span>
                        <span className="font-caption text-caption bg-surface-container-lowest text-[#15803D] px-2 py-0.5 rounded-full font-medium shadow-xs border border-[#DCFCE7]">
                          <T
                            gu={app.expectedDateGu ?? ""}
                            en={app.expectedDateEn ?? ""}
                            hi={app.expectedDateHi ?? ""}
                          />
                        </span>
                      </div>
                      <p className="font-caption text-caption text-[#166534] font-medium">
                        <T
                          gu="સીધા બેંક ખાતામાં જમા (DBT Success)"
                          en="Directly credited to bank account (DBT Success)"
                          hi="सीधे बैंक खाते में जमा (DBT Success)"
                        />
                      </p>
                      <p className="font-caption text-[11px] text-on-surface-variant pt-0.5 flex items-center gap-1 flex-wrap">
                        <span>UTR:</span>
                        <span className="font-mono font-medium text-on-surface">{app.utr}</span>
                        <span>•</span>
                        <span>SBI A/C {app.account}</span>
                        <span>(</span>
                        <span>
                          <T
                            gu={app.accountHolder ?? ""}
                            en="Hetalben Patel"
                            hi="हेतलबेन पटेल"
                          />
                        </span>
                        <span>)</span>
                      </p>
                    </div>
                  )}

                  {/* Error Clarification Box for Action Required */}
                  {app.category === "action" && (
                    <div className="bg-danger-container/30 p-3 rounded-xl space-y-1 border border-danger-container">
                      <p className="font-label-md text-label-md text-danger font-semibold flex items-center gap-1.5">
                        <Icon name="info" size={16} className="text-danger shrink-0" />
                        <T
                          gu={app.errorReasonGu ?? ""}
                          en={app.errorReasonEn ?? ""}
                          hi={app.errorReasonHi ?? ""}
                        />
                      </p>
                      <p className="font-caption text-caption text-on-surface-variant leading-relaxed">
                        <T
                          gu={app.errorDescGu ?? ""}
                          en={app.errorDescEn ?? ""}
                          hi={app.errorDescHi ?? ""}
                        />
                      </p>
                    </div>
                  )}

                  {/* Collapsible Timeline Header / Toggle */}
                  <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/40 space-y-3">
                    <button
                      type="button"
                      onClick={() => toggleTimeline(app.id)}
                      className="w-full flex items-center justify-between text-left hover:opacity-80 transition-opacity"
                      aria-expanded={isTimelineOpen}
                    >
                      <span className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1.5">
                        <Icon name="route" size={18} className="text-primary shrink-0" />
                        <T
                          gu="અરજી સ્થિતિ ટ્રેકર (Live Timeline)"
                          en="Live Application Timeline"
                          hi="आवेदन स्थिति ट्रैकर (Live)"
                        />
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="font-caption text-[11px] text-primary font-semibold bg-primary-fixed/60 px-2 py-0.5 rounded-full">
                          <T
                            gu={`સ્ટેપ ${app.currentStepIndex}/${app.totalSteps}`}
                            en={`Step ${app.currentStepIndex}/${app.totalSteps}`}
                            hi={`चरण ${app.currentStepIndex}/${app.totalSteps}`}
                          />
                        </span>
                        <Icon
                          name={isTimelineOpen ? "expand_less" : "expand_more"}
                          size={18}
                          className="text-on-surface-variant"
                        />
                      </div>
                    </button>

                    {/* Timeline Body */}
                    {isTimelineOpen && (
                      <div className="pt-2 border-t border-surface-container animate-fade-in">
                        <div className="relative pl-6 space-y-4">
                          {/* Timeline Vertical Track */}
                          <div className="absolute left-2.5 top-2 bottom-3 w-0.5 bg-surface-container-highest" />

                          {app.timeline.map((step, idx) => {
                            const isCompleted = step.status === "completed";
                            const isCurrent = step.status === "current";
                            const isPending = step.status === "pending";

                            return (
                              <div
                                key={idx}
                                className={`relative flex items-start gap-2.5 ${
                                  isPending ? "opacity-60" : ""
                                }`}
                              >
                                {/* Step Icon Node */}
                                {isCompleted && (
                                  <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#15803D] text-on-primary flex items-center justify-center ring-2 ring-surface-container-lowest">
                                    <Icon name="check" size={12} />
                                  </div>
                                )}

                                {isCurrent && (
                                  <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center ring-4 ring-primary-fixed/50 animate-pulse">
                                    <Icon name="hourglass_top" size={12} />
                                  </div>
                                )}

                                {isPending && (
                                  <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-surface-container-highest text-outline flex items-center justify-center ring-2 ring-surface-container-lowest">
                                    <span className="w-2 h-2 rounded-full bg-outline" />
                                  </div>
                                )}

                                {/* Step Content */}
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-1 flex-wrap">
                                    <p
                                      className={`font-label-md text-label-md leading-tight ${
                                        isCurrent
                                          ? "text-primary font-bold"
                                          : isCompleted
                                          ? "text-on-surface font-semibold"
                                          : "text-on-surface-variant font-medium"
                                      }`}
                                    >
                                      <T
                                        gu={step.titleGu}
                                        en={step.titleEn}
                                        hi={step.titleHi}
                                      />
                                    </p>

                                    {step.time && (
                                      <span className="font-caption text-[11px] text-outline">
                                        {step.time}
                                      </span>
                                    )}

                                    {isCurrent && step.activeBadgeGu && (
                                      <span className="font-caption text-[11px] bg-primary-fixed text-primary px-1.5 py-0.2 rounded font-semibold">
                                        <T
                                          gu={step.activeBadgeGu}
                                          en={step.activeBadgeEn ?? ""}
                                          hi={step.activeBadgeHi ?? ""}
                                        />
                                      </span>
                                    )}
                                  </div>

                                  {(step.descGu || step.descEn || step.descHi) && (
                                    <p
                                      className={`font-caption text-caption mt-0.5 ${
                                        isCompleted
                                          ? "text-[#15803D] font-medium"
                                          : isCurrent
                                          ? "text-on-surface"
                                          : "text-outline"
                                      }`}
                                    >
                                      <T
                                        gu={step.descGu ?? ""}
                                        en={step.descEn ?? ""}
                                        hi={step.descHi ?? ""}
                                      />
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Expected timeline banner for Card 1 */}
                  {app.expectedDateGu && app.category !== "completed" && (
                    <div className="flex items-center gap-2.5 bg-primary-fixed/40 p-3 rounded-xl border border-primary-fixed">
                      <Icon name="calendar_clock" size={20} className="text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="font-caption text-caption font-semibold text-primary leading-tight">
                          <T
                            gu={app.expectedDateGu}
                            en={app.expectedDateEn ?? ""}
                            hi={app.expectedDateHi ?? ""}
                          />
                        </p>
                        <p className="font-caption text-[11px] text-on-surface-variant mt-0.5">
                          <T
                            gu="Direct Benefit Transfer (DBT) આધાર લિંક્ડ ખાતામાં"
                            en="Direct Benefit Transfer (DBT) to Aadhaar linked account"
                            hi="डायरेक्ट बेनिफिट ट्रांसफर (DBT) आधार से जुड़े खाते में"
                          />
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Actions according to Card Type */}
                  {app.id === "app-namo-lakshmi" && (
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => handleDownload(app.id)}
                        type="button"
                        className="inline-flex items-center gap-1.5 font-label-md text-label-md text-primary font-semibold hover:underline"
                      >
                        <Icon name="download" size={18} />
                        <T
                          gu="અરજી ડાઉનલોડ (PDF)"
                          en="Download Application (PDF)"
                          hi="आवेदन डाउनलोड (PDF)"
                        />
                      </button>
                      <Link
                        href="/student/assistant"
                        className="inline-flex items-center gap-1 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
                      >
                        <Icon name="contact_support" size={18} />
                        <T gu="સહાયતા મેળવો" en="Get Support" hi="सहायता प्राप्त करें" />
                      </Link>
                    </div>
                  )}

                  {app.cycleWarehouse && (
                    <Link
                      href="/student/cycle"
                      className="w-full h-11 bg-secondary hover:bg-secondary/90 text-on-secondary rounded-xl font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-sm transition-colors text-center"
                    >
                      <Icon name="pin" size={20} />
                      <span>
                        <T
                          gu="ઓટીપી જુઓ અને ડિલિવરી ટ્રેક કરો →"
                          en="View OTP & Track Delivery →"
                          hi="OTP देखें और डिलीवरी ट्रैक करें →"
                        />
                      </span>
                    </Link>
                  )}

                  {app.category === "completed" && (
                    <Link
                      href="/student/payments"
                      className="w-full h-10 bg-surface-container text-primary hover:bg-surface-container-high rounded-xl font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 transition-colors text-center border border-outline-variant/40"
                    >
                      <Icon name="receipt_long" size={18} />
                      <span>
                        <T
                          gu="રસીદ ડાઉનલોડ (Download Receipt)"
                          en="Download Receipt"
                          hi="रसीद डाउनलोड"
                        />
                      </span>
                    </Link>
                  )}

                  {app.category === "action" && (
                    <Link
                      href="/student/vault/upload"
                      className="w-full h-11 bg-primary text-on-primary hover:bg-primary-container rounded-xl font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-sm transition-colors text-center"
                    >
                      <Icon name="upload_file" size={20} />
                      <span>
                        <T
                          gu="નવો દસ્તાવેજ અપલોડ કરો (Fix & Re-upload)"
                          en="Fix & Re-upload Document"
                          hi="नया दस्तावेज़ अपलोड करें"
                        />
                      </span>
                    </Link>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Help & Query Notice Card */}
        <div className="bg-surface-container p-4 rounded-2xl flex items-center gap-3.5 shadow-xs border border-outline-variant/50">
          <div className="w-12 h-12 rounded-full bg-surface-container-highest text-primary flex items-center justify-center shrink-0">
            <Icon name="headset_mic" size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-label-md text-label-md text-on-surface font-semibold leading-snug">
              <T
                gu="અરજી સંબંધી કોઈ ફરિયાદ છે? (Have a grievance?)"
                en="Have an issue regarding your application?"
                hi="क्या आवेदन के संबंध में कोई शिकायत है?"
              />
            </p>
            <p className="font-caption text-caption text-on-surface-variant mt-0.5">
              <T
                gu="હેલ્પલાઇન ૧૮૦૦ ૨૩૩ ૫૫૦૦ અથવા ઓનલાઇન ફરિયાદ"
                en="Helpline 1800 233 5500 or online redressal"
                hi="हेल्पलाइन 1800 233 5500 या ऑनलाइन शिकायत"
              />
            </p>
            <Link
              href="/student/grievances"
              className="inline-flex items-center gap-1 font-label-md text-label-md text-secondary font-bold hover:underline mt-1"
            >
              <span>
                <T
                  gu="ફરિયાદ નોંધાવો (Raise Grievance)"
                  en="Raise Grievance"
                  hi="शिकायत दर्ज करें"
                />
              </span>
              <Icon name="arrow_forward" size={16} />
            </Link>
          </div>
        </div>
      </div>
    </StudentShell>
  );
}
