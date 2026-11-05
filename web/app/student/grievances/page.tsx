"use client";

import { useState } from "react";
import Link from "next/link";
import { StudentShell } from "@/components/shell/StudentShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { StatusChip, Avatar, EmptyState } from "@/components/ui";

interface TimelineStep {
  titleGu: string;
  titleEn: string;
  titleHi: string;
  descGu: string;
  descEn: string;
  descHi: string;
  time?: string;
  status: "completed" | "current" | "pending";
}

interface GrievanceItem {
  id: string;
  token: string;
  schemeId: string;
  schemeNameGu: string;
  schemeNameEn: string;
  schemeNameHi: string;
  subjectGu: string;
  subjectEn: string;
  subjectHi: string;
  categoryIcon: string;
  status: "inprogress" | "approved" | "pending";
  statusLabelGu: string;
  statusLabelEn: string;
  statusLabelHi: string;
  dateFiledGu: string;
  dateFiledEn: string;
  dateFiledHi: string;
  assignedOfficer: {
    nameGu: string;
    nameEn: string;
    nameHi: string;
    designationGu: string;
    designationEn: string;
    designationHi: string;
    phone: string;
  };
  escalationLevelGu: string;
  escalationLevelEn: string;
  escalationLevelHi: string;
  slaRemainingDays?: number;
  slaTargetDateGu?: string;
  slaTargetDateEn?: string;
  slaTargetDateHi?: string;
  descriptionGu: string;
  descriptionEn: string;
  descriptionHi: string;
  timeline: TimelineStep[];
  resolutionNoteGu?: string;
  resolutionNoteEn?: string;
  resolutionNoteHi?: string;
  rating?: number;
}

const INITIAL_GRIEVANCES: GrievanceItem[] = [
  {
    id: "grv-2026-00341",
    token: "GRV-2026-00341",
    schemeId: "APP-2026-00344",
    schemeNameGu: "નમો લક્ષ્મી યોજના (Namo Lakshmi Yojana)",
    schemeNameEn: "Namo Lakshmi Yojana",
    schemeNameHi: "नमो लक्ष्मी योजना",
    subjectGu: "શિષ્યવૃત્તિ ચૂકવણી વિલંબ",
    subjectEn: "Payment Delay",
    subjectHi: "छात्रवृत्ति भुगतान में देरी",
    categoryIcon: "payments",
    status: "inprogress",
    statusLabelGu: "પ્રક્રિયા હેઠળ (In Progress)",
    statusLabelEn: "In Progress",
    statusLabelHi: "प्रक्रियाधीन",
    dateFiledGu: "૨૪ ફેબ્રુઆરી ૨૦૨૬",
    dateFiledEn: "24 Feb 2026",
    dateFiledHi: "24 फरवरी 2026",
    assignedOfficer: {
      nameGu: "શ્રી પરેશ ત્રિવેદી",
      nameEn: "Shri Paresh Trivedi",
      nameHi: "श्री परेश त्रिवेदी",
      designationGu: "નાયબ DEO, આણંદ જિલ્લા શિક્ષણ કચેરી",
      designationEn: "Deputy DEO, Anand District Education Office",
      designationHi: "उप डीईओ, आणंद जिला शिक्षा कार्यालय",
      phone: "+912692245000",
    },
    escalationLevelGu: "લેવલ ૧ - DEO ડેસ્ક તપાસ (SLA Active)",
    escalationLevelEn: "Level 1 - DEO Desk Review (SLA Active)",
    escalationLevelHi: "स्तर 1 - डीईओ डेस्क समीक्षा (SLA Active)",
    slaRemainingDays: 2,
    slaTargetDateGu: "૦૨ માર્ચ ૨૦૨૬",
    slaTargetDateEn: "02 Mar 2026",
    slaTargetDateHi: "02 मार्च 2026",
    descriptionGu:
      "બીજા હપ્તાની ₹ ૨,૫૦૦ રકમ હજુ બેંક ખાતામાં જમા થઈ નથી. આધાર સીડિંગ વેરિફિકેશન સફળ થઈ ગયું હોવા છતાં PFMS સ્ટેટસ પેન્ડિંગ દર્શાવે છે.",
    descriptionEn:
      "2nd installment of ₹2,500 has not been credited to the bank account yet. Despite Aadhaar seeding verification completed, PFMS status is pending.",
    descriptionHi:
      "दूसरी किस्त की ₹2,500 राशि अभी तक बैंक खाते में जमा नहीं हुई है। आधार सीडिंग सत्यापन पूरा होने के बावजूद PFMS स्थिति लंबित दिख रही है।",
    timeline: [
      {
        titleGu: "૧. ફરિયાદ પોર્ટલ પર નોંધાઈ",
        titleEn: "1. Grievance Registered on Portal",
        titleHi: "1. शिकायत पोर्टल पर दर्ज",
        time: "24 Feb 2026, 10:30 AM",
        descGu: "ઓટો જનરેટેડ ટોકન #GRV-2026-00341 જારી કરાયો",
        descEn: "Auto generated token #GRV-2026-00341 issued",
        descHi: "ऑटो जनरेटेड टोकन #GRV-2026-00341 जारी",
        status: "completed",
      },
      {
        titleGu: "૨. DEO ડેસ્કને રીવ્યુ માટે સોંપાઈ",
        titleEn: "2. Assigned to DEO Desk Review",
        titleHi: "2. डीईओ डेस्क को समीक्षा हेतु सुपुर्द",
        time: "24 Feb 2026, 02:15 PM",
        descGu: "અધિકારી પરેશ ત્રિવેદી દ્વારા પ્રાથમિક ચકાસણી શરૂ",
        descEn: "Preliminary scrutiny initiated by Officer Paresh Trivedi",
        descHi: "अधिकारी परेश त्रिवेदी द्वारा प्रारंभिक जांच शुरू",
        status: "completed",
      },
      {
        titleGu: "૩. PFMS પેમેન્ટ બેચ રી-વેલિડેશન હેઠળ",
        titleEn: "3. PFMS Payment Batch Re-validation",
        titleHi: "3. PFMS भुगतान बैच पुनर्सत्यापन अधीन",
        time: "25 Feb 2026",
        descGu: "બેંક એકાઉન્ટ અને NPCI પેમેન્ટ ગેટવે રિસ્પોન્સ રી-ટેસ્ટિંગ પ્રક્રિયા ચાલુ",
        descEn: "Bank account and NPCI payment gateway response re-testing in progress",
        descHi: "बैंक खाता और NPCI पेमेंट गेटवे प्रतिक्रिया की जांच जारी",
        status: "current",
      },
      {
        titleGu: "૪. અંતિમ નિરાકરણ અને DBT રવાનગી",
        titleEn: "4. Final Resolution & DBT Credit",
        titleHi: "4. अंतिम निवारण और DBT प्रेषण",
        descGu: "ખાતામાં જમા થયેલ UTR નંબર સાથે SMS મોકલાશે",
        descEn: "Confirmation SMS with credit UTR number will be sent",
        descHi: "खाते में जमा यूटीआर नंबर के साथ एसएमएस भेजा जाएगा",
        status: "pending",
      },
    ],
  },
  {
    id: "grv-2026-0412",
    token: "GRV-2026-0412",
    schemeId: "APP-2026-00871",
    schemeNameGu: "સરસ્વતી સાધના યોજના (Saraswati Sadhna Yojana)",
    schemeNameEn: "Saraswati Sadhna Scheme",
    schemeNameHi: "सरस्वती साधना योजना",
    subjectGu: "સાયકલ વિતરણ સંબંધિત",
    subjectEn: "Bicycle Handover / QR Issue",
    subjectHi: "साइकिल वितरण संबंधित",
    categoryIcon: "pedal_bike",
    status: "inprogress",
    statusLabelGu: "પ્રક્રિયા હેઠળ (In Progress)",
    statusLabelEn: "In Progress",
    statusLabelHi: "प्रक्रियाधीन",
    dateFiledGu: "૨૨ ફેબ્રુઆરી ૨૦૨૬",
    dateFiledEn: "22 Feb 2026",
    dateFiledHi: "22 फरवरी 2026",
    assignedOfficer: {
      nameGu: "શ્રી પરેશ ત્રિવેદી",
      nameEn: "Shri Paresh Trivedi",
      nameHi: "श्री परेश त्रिवेदी",
      designationGu: "નાયબ DEO, આણંદ જિલ્લા શિક્ષણ કચેરી",
      designationEn: "Deputy DEO, Anand District Education Office",
      designationHi: "उप डीईओ, आणंद जिला शिक्षा कार्यालय",
      phone: "+912692245000",
    },
    escalationLevelGu: "લેવલ ૧ - શાળા અને વેન્ડર તપાસ (SLA Active)",
    escalationLevelEn: "Level 1 - School & Vendor Inspection (SLA Active)",
    escalationLevelHi: "स्तर 1 - स्कूल और विक्रेता निरीक्षण (SLA Active)",
    slaRemainingDays: 2,
    slaTargetDateGu: "૦૨ માર્ચ ૨૦૨૬",
    slaTargetDateEn: "02 Mar 2026",
    slaTargetDateHi: "02 मार्च 2026",
    descriptionGu:
      "શાળામાં સાયકલ બેચ આવી ગઈ હોવા છતાં OTP વેલિડેશન સમયે બારકોડ સ્કેન એરર દર્શાવે છે. કૃપા કરીને ફ્રેમ નંબર મેપિંગ તપાસવા વિનંતી.",
    descriptionEn:
      "Although the bicycle lot has reached school, barcode scan displays an error during OTP validation. Kindly verify frame number mapping.",
    descriptionHi:
      "स्कूल में साइकिल आ चुकी है फिर भी OTP सत्यापन के समय बारकोड स्कैन त्रुटि दिखा रहा है। फ्रेम नंबर मैपिंग की जांच का अनुरोध है।",
    timeline: [
      {
        titleGu: "૧. ફરિયાદ પોર્ટલ પર નોંધાઈ",
        titleEn: "1. Grievance Registered",
        titleHi: "1. शिकायत पोर्टल पर दर्ज",
        time: "24 Feb 2026, 10:30 AM",
        descGu: "ઓટો જનરેટેડ ટોકન",
        descEn: "Auto generated token",
        descHi: "ऑटो जनरेटेड टोकन",
        status: "completed",
      },
      {
        titleGu: "૨. DEO ડેસ્કને રીવ્યુ માટે સોંપાઈ",
        titleEn: "2. Assigned to DEO Desk",
        titleHi: "2. डीईओ डेस्क को सुपुर्द",
        time: "24 Feb 2026, 02:15 PM",
        descGu: "અધિકારી ચકાસણી શરૂ",
        descEn: "Officer scrutiny started",
        descHi: "अधिकारी जांच शुरू",
        status: "completed",
      },
      {
        titleGu: "૩. શાળા આચાર્ય અને વેન્ડર તપાસ હેઠળ",
        titleEn: "3. School Principal & Vendor Verification",
        titleHi: "3. स्कूल प्राचार्य एवं विक्रेता जांच के तहत",
        time: "25 Feb 2026",
        descGu: "સ્ટોક યાદી અને ફ્રેમ બારકોડ રી-ટેસ્ટિંગ પ્રક્રિયા ચાલુ",
        descEn: "Stock inventory and cycle frame barcode re-testing under process",
        descHi: "स्टॉक सूची और साइकिल फ्रेम बारकोड का पुन: परीक्षण जारी",
        status: "current",
      },
      {
        titleGu: "૪. અંતિમ નિરાકરણ અને સુધારેલ OTP",
        titleEn: "4. Final Resolution & Corrected OTP",
        titleHi: "4. अंतिम निवारण और संशोधित OTP",
        descGu: "સાયકલ હેન્ડઓવર સ્વીકૃતિ SMS મોકલાશે",
        descEn: "Bicycle handover confirmation SMS will be dispatched",
        descHi: "साइकिल वितरण स्वीकृति एसएमएस भेजा जाएगा",
        status: "pending",
      },
    ],
  },
  {
    id: "grv-2025-00892",
    token: "GRV-2025-00892",
    schemeId: "APP-2025-994102",
    schemeNameGu: "નમો લક્ષ્મી યોજના (Namo Lakshmi Yojana)",
    schemeNameEn: "Namo Lakshmi Yojana",
    schemeNameHi: "नमो लक्ष्मी योजना",
    subjectGu: "DBT બેંક ખાતું સુધારો",
    subjectEn: "DBT Bank Account Update",
    subjectHi: "DBT बैंक खाता सुधार",
    categoryIcon: "account_balance",
    status: "approved",
    statusLabelGu: "સફળ નિરાકરણ (Resolved)",
    statusLabelEn: "Resolved",
    statusLabelHi: "सफलतापूर्वक हल",
    dateFiledGu: "૧૪ ફેબ્રુઆરી ૨૦૨૬",
    dateFiledEn: "14 Feb 2026",
    dateFiledHi: "14 फरवरी 2026",
    assignedOfficer: {
      nameGu: "શ્રીમતી ભાવનાબેન દેસાઈ",
      nameEn: "Smt. Bhavanaben Desai",
      nameHi: "श्रीमती भावनाबेन देसाई",
      designationGu: "જિલ્લા શિક્ષણ હિસાબી અધિકારી, આણંદ",
      designationEn: "District Education Accounts Officer, Anand",
      designationHi: "जिला शिक्षा लेखा अधिकारी, आणंद",
      phone: "+912692245100",
    },
    escalationLevelGu: "લેવલ ૧ - ૪ દિવસમાં સફળ નિરાકરણ",
    escalationLevelEn: "Level 1 - Resolved within 4 Days",
    escalationLevelHi: "स्तर 1 - 4 दिनों में सफल समाधान",
    descriptionGu:
      "માતાના બેંક ખાતામાં NPCI આધાર સીડિંગ મિસમેચ હોવાને લીધે હપ્તો અટકી ગયો હતો. સુધારેલ આધાર વિગત જોડવામાં આવી હતી.",
    descriptionEn:
      "Installment was held up due to NPCI Aadhaar seeding mismatch in mother's account. Updated Aadhaar proof was provided.",
    descriptionHi:
      "माता के बैंक खाते में NPCI आधार सीडिंग बेमेल के कारण किस्त रुक गई थी। अद्यतन आधार विवरण प्रस्तुत किया गया था।",
    resolutionNoteGu:
      "માતા હેતલબેન પટેલનું SBI ખાતું NPCI સાથે સફળતાપૂર્વક મેપ થઈ ચૂક્યું છે અને પ્રથમ હપ્તો ₹ ૨,૫૦૦ સીધા ખાતામાં જમા થઈ ગયો છે (UTR: SBIN2611020045).",
    resolutionNoteEn:
      "Mother Hetalben Patel's SBI account has been successfully linked with NPCI and 1st installment ₹2,500 credited directly (UTR: SBIN2611020045).",
    resolutionNoteHi:
      "माता हेतलबेन पटेल का एसबीआई खाता एनपीसीआई से सफलतापूर्वक जुड़ गया है और पहली किस्त ₹2,500 खाते में जमा हो गई है (UTR: SBIN2611020045)।",
    rating: 4,
    timeline: [
      {
        titleGu: "૧. ફરિયાદ પોર્ટલ પર નોંધાઈ",
        titleEn: "1. Grievance Logged",
        titleHi: "1. शिकायत दर्ज",
        time: "14 Feb 2026",
        descGu: "ટોકન #GRV-2025-00892 જનરેટ થયો",
        descEn: "Token #GRV-2025-00892 created",
        descHi: "टोकन #GRV-2025-00892 बना",
        status: "completed",
      },
      {
        titleGu: "૨. બેંક નોડલ અધિકારી સાથે NPCI ચકાસણી",
        titleEn: "2. NPCI Verification with Bank Officer",
        titleHi: "2. बैंक अधिकारी के साथ NPCI सत्यापन",
        time: "15 Feb 2026",
        descGu: "SBI શાખા સાથે ઈ-કેવાયસી પુષ્ટિ થઈ",
        descEn: "e-KYC re-confirmed with SBI branch",
        descHi: "एसबीआई शाखा के साथ ई-केवाईसी की पुष्टि हुई",
        status: "completed",
      },
      {
        titleGu: "૩. DBT પોર્ટલ પર આધાર પુનઃ સીડિંગ",
        titleEn: "3. Aadhaar Re-seeded on DBT Portal",
        titleHi: "3. DBT पोर्टल पर आधार पुनः सीडिंग",
        time: "17 Feb 2026",
        descGu: "ખાતું સફળતાપૂર્વક એક્ટિવેટ થયું",
        descEn: "Account successfully activated for subsidy",
        descHi: "सब्सिडी के लिए खाता सक्रिय हुआ",
        status: "completed",
      },
      {
        titleGu: "૪. ₹ ૨,૫૦૦ સહાય રકમ ખાતામાં જમા",
        titleEn: "4. ₹2,500 Credited to Account",
        titleHi: "4. ₹2,500 सहायता राशि खाते में जमा",
        time: "18 Feb 2026",
        descGu: "સફળ નિરાકરણ • UTR: SBIN2611020045",
        descEn: "Resolved successfully • UTR: SBIN2611020045",
        descHi: "सफल समाधान • यूटीआर: SBIN2611020045",
        status: "completed",
      },
    ],
  },
];

export default function StudentGrievancesPage() {
    const [activeTab, setActiveTab] = useState<"track" | "raise">("track");
  const [grievances, setGrievances] = useState<GrievanceItem[]>(INITIAL_GRIEVANCES);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    "grv-2026-00341": true,
    "grv-2026-0412": false,
    "grv-2025-00892": true,
  });

  // Modal states
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyTargetToken, setReplyTargetToken] = useState<string>("GRV-2026-00341");
  const [replyOfficerName, setReplyOfficerName] = useState<string>("શ્રી પરેશ ત્રિવેદી");
  const [replyText, setReplyText] = useState("");

  // New Grievance Form State
  const [selectedScheme, setSelectedScheme] = useState("APP-2026-00344");
  const [selectedCategory, setSelectedCategory] = useState("dbt");
  const [description, setDescription] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string } | null>({
    name: "cycle_error_screen.jpg",
    size: "1.4 MB",
  });

  // Toast notification state
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  const showToast = (title: string, message: string) => {
    setToast({ title, message });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleRating = (grievanceId: string, ratingValue: number) => {
    setGrievances((prev) =>
      prev.map((g) => (g.id === grievanceId ? { ...g, rating: ratingValue } : g))
    );
    showToast(
      "પ્રતિભાવ સબમિટ થયો (Feedback Submitted)",
      `${ratingValue} સ્ટાર રેટિંગ આપવા બદલ આભાર! (${ratingValue}/5 Stars Submitted)`
    );
  };

  const handleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    setIsListening(true);
    setTimeout(() => {
      setDescription((prev) =>
        prev
          ? `${prev} બીજા હપ્તાની ₹૨,૫૦૦ સહાય રકમ હજુ સુધી ખાતામાં જમા થઈ નથી.`
          : "બીજા હપ્તાની ₹૨,૫૦૦ સહાય રકમ હજુ સુધી ખાતામાં જમા થઈ નથી, કૃપા કરીને ચકાસણી કરો."
      );
      setIsListening(false);
      showToast(
        "વોઇસ રેકગ્નિશન સફળ (Voice Recognized)",
        "ગુજરાતી વાક્ય ટાઇપ થઈ ગયું છે (Gujarati text transcribed)"
      );
    }, 1800);
  };

  const handleSimulateUpload = (source: string) => {
    setAttachedFile({
      name: source === "Camera" ? "camera_doc_scan.jpg" : "scholarship_slip.pdf",
      size: source === "Camera" ? "1.8 MB" : "1.2 MB",
    });
    showToast(
      `${source} થી જોડાણ પસંદ થયું`,
      "નવો પુરાવો દસ્તાવેજ સફળતાપૂર્વક જોડાયો છે (File attached)"
    );
  };

  const handleRemoveAttachment = () => {
    setAttachedFile(null);
    showToast("જોડાણ હટાવ્યું (Attachment Removed)", "દસ્તાવેજ રદ કરવામાં આવ્યો છે");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      showToast("વિગત જરૂરી છે", "કૃપા કરીને સમસ્યાનું વર્ણન દાખલ કરો.");
      return;
    }

    const randomNum = Math.floor(100 + Math.random() * 900);
    const newToken = `GRV-2026-00${randomNum}`;

    let subjectGu = "શિષ્યવૃત્તિ સહાય પૂછપરછ";
    let subjectEn = "Scholarship Assistance Inquiry";
    let subjectHi = "छात्रवृत्ति सहायता पूछताछ";
    let catIcon = "help";

    if (selectedCategory === "dbt") {
      subjectGu = "શિષ્યવૃત્તિ જમા વિલંબ";
      subjectEn = "Payment Delay";
      subjectHi = "भुगतान में देरी";
      catIcon = "payments";
    } else if (selectedCategory === "docs") {
      subjectGu = "દસ્તાવેજ વેરિફિકેશન વિલંબ";
      subjectEn = "Document Verification Delay";
      subjectHi = "दस्तावेज सत्यापन में देरी";
      catIcon = "description";
    } else if (selectedCategory === "wrong_amount") {
      subjectGu = "ખોટી રકમ જમા થયેલ";
      subjectEn = "Wrong Amount Credited";
      subjectHi = "गलत राशि जमा हुई";
      catIcon = "price_change";
    } else if (selectedCategory === "bicycle") {
      subjectGu = "સાયકલ વિતરણ સંબંધિત";
      subjectEn = "Bicycle Handover / Defect";
      subjectHi = "साइकिल वितरण संबंधित";
      catIcon = "pedal_bike";
    } else if (selectedCategory === "eligibility") {
      subjectGu = "પાત્રતા ખોટી દર્શાવે છે";
      subjectEn = "Eligibility Dispute";
      subjectHi = "पात्रता संबंधी विवाद";
      catIcon = "rule";
    } else if (selectedCategory === "school") {
      subjectGu = "શાળા કક્ષાએથી મંજૂરી અટકેલ";
      subjectEn = "School Level Approval Pending";
      subjectHi = "स्कूल स्तर पर अनुमोदन लंबित";
      catIcon = "school";
    }

    let schemeNameGu = "નમો લક્ષ્મી યોજના (Namo Lakshmi Yojana)";
    let schemeNameEn = "Namo Lakshmi Yojana";
    let schemeNameHi = "नमो लक्ष्मी योजना";

    if (selectedScheme === "APP-2026-00871") {
      schemeNameGu = "સરસ્વતી સાધના યોજના (Saraswati Sadhna Yojana)";
      schemeNameEn = "Saraswati Sadhna Scheme";
      schemeNameHi = "सरस्वती साधना योजना";
    } else if (selectedScheme === "APP-GEN") {
      schemeNameGu = "સામાન્ય શિષ્યવૃત્તિ પૂછપરછ (General Educational Grant)";
      schemeNameEn = "General Scholarship Assistance";
      schemeNameHi = "सामान्य छात्रवृत्ति पूछताछ";
    }

    const newGrievance: GrievanceItem = {
      id: `grv-${Date.now()}`,
      token: newToken,
      schemeId: selectedScheme,
      schemeNameGu,
      schemeNameEn,
      schemeNameHi,
      subjectGu,
      subjectEn,
      subjectHi,
      categoryIcon: catIcon,
      status: "inprogress",
      statusLabelGu: "પ્રક્રિયા હેઠળ (In Progress)",
      statusLabelEn: "In Progress",
      statusLabelHi: "प्रक्रियाधीन",
      dateFiledGu: "આજે (Today)",
      dateFiledEn: "Today",
      dateFiledHi: "आज",
      assignedOfficer: {
        nameGu: "શ્રી પરેશ ત્રિવેદી",
        nameEn: "Shri Paresh Trivedi",
        nameHi: "श्री परेश त्रिवेदी",
        designationGu: "નાયબ DEO, આણંદ જિલ્લા શિક્ષણ કચેરી",
        designationEn: "Deputy DEO, Anand District Education Office",
        designationHi: "उप डीईओ, आणंद जिला शिक्षा कार्यालय",
        phone: "+912692245000",
      },
      escalationLevelGu: "લેવલ ૧ - DEO ડેસ્ક તપાસ (SLA Active)",
      escalationLevelEn: "Level 1 - DEO Desk Review (SLA Active)",
      escalationLevelHi: "स्तर 1 - डीईओ डेस्क समीक्षा (SLA Active)",
      slaRemainingDays: 7,
      slaTargetDateGu: "૧૧ માર્ચ ૨૦૨૬",
      slaTargetDateEn: "11 Mar 2026",
      slaTargetDateHi: "11 मार्च 2026",
      descriptionGu: description,
      descriptionEn: description,
      descriptionHi: description,
      timeline: [
        {
          titleGu: "૧. ફરિયાદ પોર્ટલ પર નોંધાઈ",
          titleEn: "1. Grievance Registered on Portal",
          titleHi: "1. शिकायत पोर्टल पर दर्ज",
          time: "Just now",
          descGu: `ટોકન ${newToken} જનરેટ થયો • SMS મોકલાયો`,
          descEn: `Token ${newToken} generated • SMS sent`,
          descHi: `टोकन ${newToken} जनरेट हुआ • एसएमएस भेजा गया`,
          status: "completed",
        },
        {
          titleGu: "૨. સંબંધિત શિક્ષણ અધિકારીને રવાનગી",
          titleEn: "2. Forwarded to Nodal Officer",
          titleHi: "2. नोडल अधिकारी को अग्रेषित",
          time: "Under review",
          descGu: "DEO કચેરી દ્વારા પ્રાથમિક ચકાસણી શરૂ",
          descEn: "Under review by DEO Office Desk",
          descHi: "डीईओ कार्यालय द्वारा प्रारंभिक समीक्षा जारी",
          status: "current",
        },
        {
          titleGu: "૩. સ્થળ ચકાસણી / બેંક ક્લિયરન્સ",
          titleEn: "3. Field Verification / Bank Clearance",
          titleHi: "3. भौतिक सत्यापन / बैंक क्लीयरेंस",
          descGu: "૭ દિવસમાં ફરજિયાત નિરાકરણ ગેરંટી (GSRDA)",
          descEn: "Mandatory 7-day resolution guarantee under GSRDA",
          descHi: "जीएसआरडीए के तहत 7 दिनों में अनिवार्य समाधान",
          status: "pending",
        },
      ],
    };

    setGrievances((prev) => [newGrievance, ...prev]);
    setExpandedIds((prev) => ({ ...prev, [newGrievance.id]: true }));
    setDescription("");
    setIsNewModalOpen(false);
    setActiveTab("track");

    showToast(
      "ફરિયાદ સફળતાપૂર્વક નોંધાઈ ગઈ છે!",
      `ટોકન ક્રમાંક: #${newToken} • ૭ દિવસમાં નિવારણ ગેરંટી (GSRDA)`
    );
  };

  const openReplyModal = (token: string, officerName: string) => {
    setReplyTargetToken(token);
    setReplyOfficerName(officerName);
    setReplyText("");
    setIsReplyModalOpen(true);
  };

  const handleSendReply = () => {
    if (!replyText.trim()) {
      showToast("વિગત દાખલ કરો", "કૃપા કરીને સંદેશ દાખલ કરો.");
      return;
    }
    setIsReplyModalOpen(false);
    setReplyText("");
    showToast(
      "જવાબ મોકલાયો (Reply Dispatched)",
      `અધિકારીશ્રી ${replyOfficerName}ના ધ્યાન પર વિગત નોંધાઈ ગઈ છે.`
    );
  };

  const handlePriorityReminder = (token: string) => {
    showToast(
      "ઝડપી રીમાઇન્ડર નોંધાયું (Priority Reminder)",
      `ટિકિટ #${token} અગ્રતા ધોરણે ચિહ્નિત કરવામાં આવી છે.`
    );
  };

  const activeCount = grievances.filter((g) => g.status === "inprogress").length;
  const resolvedCount = grievances.filter((g) => g.status === "approved").length;

  return (
    <StudentShell>
      <div className="flex flex-col w-full px-4 space-y-4 pt-3 pb-24 max-w-[430px] mx-auto animate-fade-in">
        {/* Top Header & Back Link */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <Link
              href="/student"
              aria-label="Back to Student Home"
              className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-primary hover:bg-surface-container-high transition-colors shrink-0"
            >
              <Icon name="arrow_back" size={20} />
            </Link>
            <div className="min-w-0">
              <h1 className="font-title-lg text-title-lg text-on-surface font-bold truncate">
                <T
                  gu="ફરિયાદ નિવારણ (Grievance Portal)"
                  en="Grievance Redressal Portal"
                  hi="शिकायत निवारण पोर्टल"
                />
              </h1>
              <p className="font-caption text-caption text-on-surface-variant truncate">
                <T
                  gu="ટ્રેકિંગ અને ત્વરિત સહાય"
                  en="Real-time Tracking & Citizen Support"
                  hi="रीयल-टाइम ट्रैकिंग और नागरिक सहायता"
                />
              </p>
            </div>
          </div>

          {/* Primary Top CTA: Raise New Grievance */}
          <button
            onClick={() => setIsNewModalOpen(true)}
            type="button"
            className="h-10 px-3 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold flex items-center gap-1.5 shadow-level-1 hover:bg-primary-container active:scale-95 transition-all shrink-0"
          >
            <Icon name="add" size={18} />
            <span>
              <T gu="નવી ફરિયાદ" en="Raise Ticket" hi="नई शिकायत" />
            </span>
          </button>
        </div>

        {/* Citizen Assistance & Helpline Banner */}
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary">
              <Icon name="support_agent" size={22} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-label-md text-label-md text-primary font-bold">
                  <T gu="CM હેલ્પલાઇન: 181" en="CM Helpline: 181" hi="सीएम हेल्पलाइन: 181" />
                </span>
                <span className="text-outline-variant font-label-md">|</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                  <T
                    gu="શિક્ષણ સહાય: 1800-233-5500"
                    en="Education Helpline: 1800-233-5500"
                    hi="शिक्षा सहायता: 1800-233-5500"
                  />
                </span>
              </div>
              <p className="font-caption text-caption text-on-surface-variant truncate">
                <T
                  gu="વિદ્યા પ્રગતિ સેતુ • ૨૪x૭ ફરિયાદ નિવારણ ડેસ્ક"
                  en="Vidya Pragati Setu • 24x7 Grievance Desk"
                  hi="विद्या प्रगति सेतु • 24x7 शिकायत निवारण डेस्क"
                />
              </p>
            </div>
          </div>
          <a
            aria-label="Call Helpline"
            className="shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-level-1 hover:bg-primary-container active:scale-95 transition-transform"
            href="tel:18002335500"
          >
            <Icon name="call" size={18} />
          </a>
        </div>

        {/* Student Quick Profile Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-level-1 border border-outline-variant flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <Avatar name="Riya Patel" size="lg" className="bg-primary text-on-primary font-bold" />
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-secondary rounded-full flex items-center justify-center text-on-secondary shadow-xs">
                <Icon name="verified" size={11} fill />
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="font-title-md text-title-md text-on-surface font-bold truncate">
                  <T gu="રિયા પટેલ" en="Riya Patel" hi="रिया पटेल" />
                </h2>
                <span className="bg-surface-container text-on-surface-variant px-2 py-0.5 rounded font-caption text-caption">
                  <T gu="ધોરણ ૯-B" en="Class 9-B" hi="कक्षा 9-B" />
                </span>
              </div>
              <p className="font-caption text-caption text-on-surface-variant truncate">
                <T
                  gu="શ્રી સરદાર પટેલ હાઇસ્કૂલ, આણંદ"
                  en="Shri Sardar Patel High School, Anand"
                  hi="श्री सरदार पटेल हाई स्कूल, आणंद"
                />
              </p>
              <p className="font-caption text-caption text-primary font-semibold">
                CTS ID: GJ-AND-2026-004512
              </p>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <span className="inline-flex items-center gap-1 bg-secondary/10 text-secondary border border-secondary/20 font-label-md text-label-md px-2.5 py-1 rounded-full font-bold">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <T gu="GSRDA માન્ય" en="GSRDA Assured" hi="GSRDA मान्य" />
            </span>
          </div>
        </div>

        {/* Segmented Two-Tab Navigation */}
        <div className="bg-surface-container-high p-1 rounded-xl flex gap-1 shadow-inner">
          <button
            onClick={() => setActiveTab("track")}
            type="button"
            className={`flex-1 py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 font-label-lg text-label-lg font-semibold transition-all duration-200 ${
              activeTab === "track"
                ? "bg-surface-container-lowest text-primary shadow-level-1"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Icon name="receipt_long" size={18} />
            <span>
              <T gu="મારી ફરિયાદો" en="My Grievances" hi="मेरी शिकायतें" />
            </span>
            <span className="bg-primary text-on-primary text-[11px] px-1.5 py-0.2 rounded-full font-bold ml-0.5">
              {grievances.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("raise")}
            type="button"
            className={`flex-1 py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 font-label-lg text-label-lg font-semibold transition-all duration-200 ${
              activeTab === "raise"
                ? "bg-surface-container-lowest text-primary shadow-level-1"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Icon name="add_circle" size={18} />
            <span>
              <T gu="નવી ફરિયાદ નોંધાવો" en="Raise Grievance" hi="नई शिकायत दर्ज करें" />
            </span>
          </button>
        </div>

        {/* VIEW 1: MY GRIEVANCES TRACKING LIST */}
        {activeTab === "track" && (
          <div className="flex flex-col gap-4 w-full">
            {/* KPI Summary Strip */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant flex flex-col items-center text-center shadow-xs">
                <span className="font-caption text-caption text-on-surface-variant">
                  <T gu="કુલ ફરિયાદો" en="Total" hi="कुल" />
                </span>
                <span className="font-headline-sm text-headline-sm text-primary font-bold">
                  {grievances.length}
                </span>
              </div>
              <div className="bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant flex flex-col items-center text-center shadow-xs">
                <span className="font-caption text-caption text-on-surface-variant">
                  <T gu="પ્રક્રિયા હેઠળ" en="Active" hi="सक्रिय" />
                </span>
                <span className="font-headline-sm text-headline-sm text-secondary font-bold">
                  {activeCount}
                </span>
              </div>
              <div className="bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant flex flex-col items-center text-center shadow-xs">
                <span className="font-caption text-caption text-on-surface-variant">
                  <T gu="નિરાકરણ થયેલ" en="Resolved" hi="हल हुई" />
                </span>
                <span className="font-headline-sm text-headline-sm text-[#15803D] font-bold">
                  {resolvedCount}
                </span>
              </div>
            </div>

            {/* Section Header */}
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="font-title-md text-title-md text-on-surface font-bold">
                  <T
                    gu="સક્રિય ફરિયાદોનું ટ્રેકિંગ"
                    en="Grievances Tracking"
                    hi="सक्रिय शिकायतों की ट्रैकिंग"
                  />
                </h2>
                <p className="font-caption text-caption text-on-surface-variant">
                  <T
                    gu="Live SLA Status & Department Timeline"
                    en="Live SLA Status & Department Timeline"
                    hi="लाइव एसएलए स्थिति और समयरेखा"
                  />
                </p>
              </div>
              <span className="font-label-md text-label-md text-primary font-semibold flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full">
                <Icon name="sync" size={15} />
                <T gu="લાઇવ અપડેટ" en="Live Update" hi="लाइव अपडेट" />
              </span>
            </div>

            {/* Grievance Cards Feed */}
            {grievances.length === 0 ? (
              <EmptyState
                icon="mark_email_read"
                title="કોઈ ફરિયાદ નોંધાયેલી નથી"
                description="તમારી કોઈ પેન્ડિંગ ફરિયાદ નથી. નવી ફરિયાદ નોંધાવવા માટે બટન દબાવો."
                action={
                  <button
                    onClick={() => setActiveTab("raise")}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Icon name="add" size={18} />
                    <T gu="નવી ફરિયાદ નોંધાવો" en="Raise Grievance" hi="नई शिकायत दर्ज करें" />
                  </button>
                }
              />
            ) : (
              grievances.map((item) => {
                const isExpanded = !!expandedIds[item.id];
                const isResolved = item.status === "approved";

                return (
                  <div
                    key={item.id}
                    className="bg-surface-container-lowest rounded-2xl p-4 shadow-level-1 border border-outline-variant flex flex-col gap-3 relative transition-all"
                  >
                    {/* Header Row: Subject Badge, GRV ID, Status Chip */}
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-secondary/15 text-secondary border border-secondary/20 font-label-md text-label-md px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                          <Icon name={item.categoryIcon} size={15} />
                          <T gu={item.subjectGu} en={item.subjectEn} hi={item.subjectHi} />
                        </span>
                        <span className="font-label-md text-label-md text-on-surface-variant font-mono font-bold bg-surface-container px-2 py-0.5 rounded">
                          #{item.token}
                        </span>
                      </div>

                      <StatusChip
                        status={item.status}
                        label={
                          <T
                            gu={item.statusLabelGu}
                            en={item.statusLabelEn}
                            hi={item.statusLabelHi}
                          />
                        }
                      />
                    </div>

                    {/* Scheme Reference & Date Filed */}
                    <div>
                      <h3 className="font-title-md text-title-md text-on-surface font-bold leading-snug">
                        <T
                          gu={item.schemeNameGu}
                          en={item.schemeNameEn}
                          hi={item.schemeNameHi}
                        />
                      </h3>
                      <div className="flex items-center gap-2 font-caption text-caption text-on-surface-variant mt-0.5 flex-wrap">
                        <span>
                          <T
                            gu={`અરજી ક્રમાંક: ${item.schemeId}`}
                            en={`App ID: ${item.schemeId}`}
                            hi={`आवेदन आईडी: ${item.schemeId}`}
                          />
                        </span>
                        <span>•</span>
                        <span>
                          <T
                            gu={`નોંધણી તારીખ: ${item.dateFiledGu}`}
                            en={`Filed on: ${item.dateFiledEn}`}
                            hi={`दर्ज तिथि: ${item.dateFiledHi}`}
                          />
                        </span>
                      </div>
                    </div>

                    {/* Problem Summary (Brief preview) */}
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                      <T
                        gu={item.descriptionGu}
                        en={item.descriptionEn}
                        hi={item.descriptionHi}
                      />
                    </p>

                    {/* SLA Countdown Banner (if in-progress) */}
                    {!isResolved && item.slaRemainingDays !== undefined && (
                      <div className="bg-secondary/10 border border-secondary/25 rounded-xl p-2.5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary shrink-0">
                            <Icon name="hourglass_top" size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-label-md text-label-md text-secondary font-bold truncate">
                              <T
                                gu={`ઉકેલ સમય: ${item.slaRemainingDays} દિવસ બાકી`}
                                en={`SLA Window: ${item.slaRemainingDays} days remaining`}
                                hi={`समाधान समय: ${item.slaRemainingDays} दिन शेष`}
                              />
                            </p>
                            <p className="font-caption text-caption text-on-surface-variant truncate">
                              <T
                                gu={`નિયત લક્ષ્યાંક તારીખ: ${item.slaTargetDateGu ?? ""}`}
                                en={`Target Resolution: ${item.slaTargetDateEn ?? ""}`}
                                hi={`लक्षित तिथि: ${item.slaTargetDateHi ?? ""}`}
                              />
                            </p>
                          </div>
                        </div>
                        <span className="bg-secondary text-on-secondary text-caption font-bold px-2 py-0.5 rounded-full shrink-0 shadow-xs">
                          SLA Active
                        </span>
                      </div>
                    )}

                    {/* Assigned Officer Details Strip */}
                    <div className="bg-surface-container-low rounded-xl p-2.5 flex items-center justify-between gap-2 border border-outline-variant/60">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar
                          name={item.assignedOfficer.nameEn}
                          size="md"
                          className="bg-primary-fixed text-primary font-bold shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-label-md text-label-md text-on-surface font-bold truncate">
                            <T
                              gu={item.assignedOfficer.nameGu}
                              en={item.assignedOfficer.nameEn}
                              hi={item.assignedOfficer.nameHi}
                            />
                          </p>
                          <p className="font-caption text-caption text-on-surface-variant truncate">
                            <T
                              gu={item.assignedOfficer.designationGu}
                              en={item.assignedOfficer.designationEn}
                              hi={item.assignedOfficer.designationHi}
                            />
                          </p>
                        </div>
                      </div>
                      <a
                        className="shrink-0 h-9 px-3 rounded-lg bg-surface-container-lowest border border-outline-variant text-primary font-label-md text-label-md font-semibold flex items-center gap-1.5 hover:bg-primary/10 transition-colors shadow-xs"
                        href={`tel:${item.assignedOfficer.phone}`}
                      >
                        <Icon name="call" size={16} />
                        <span>
                          <T gu="કૉલ" en="Call" hi="कॉल" />
                        </span>
                      </a>
                    </div>

                    {/* Expand/Collapse Toggle Button */}
                    <button
                      onClick={() => toggleExpand(item.id)}
                      type="button"
                      className="flex items-center justify-between text-left py-1 text-primary hover:text-primary-container font-label-md text-label-md font-semibold transition-colors border-t border-outline-variant/40 pt-2"
                    >
                      <span className="flex items-center gap-1">
                        <Icon name="info" size={16} />
                        {isExpanded ? (
                          <T
                            gu="વિગતવાર વિગતો છુપાવો (Hide Details)"
                            en="Hide Details"
                            hi="विवरण छुपाएं"
                          />
                        ) : (
                          <T
                            gu="વિગતવાર વર્ણન અને સમયરેખા જુઓ (View Full Details)"
                            en="View Details & Timeline"
                            hi="पूर्ण विवरण व समयरेखा देखें"
                          />
                        )}
                      </span>
                      <Icon
                        name={isExpanded ? "expand_less" : "expand_more"}
                        size={20}
                        className="transition-transform"
                      />
                    </button>

                    {/* EXPANDABLE SECTION */}
                    {isExpanded && (
                      <div className="flex flex-col gap-3.5 pt-1 border-t border-outline-variant/40 animate-fade-in">
                        {/* Escalation Level Badge */}
                        <div className="flex items-center justify-between bg-surface-container p-2 rounded-lg">
                          <span className="font-caption text-caption text-on-surface-variant">
                            <T
                              gu="તપાસ સ્તર (Escalation Level):"
                              en="Escalation Level:"
                              hi="जांच स्तर:"
                            />
                          </span>
                          <span className="font-label-md text-label-md font-semibold text-primary">
                            <T
                              gu={item.escalationLevelGu}
                              en={item.escalationLevelEn}
                              hi={item.escalationLevelHi}
                            />
                          </span>
                        </div>

                        {/* Full Description */}
                        <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/60">
                          <p className="font-label-md text-label-md text-on-surface font-semibold mb-1">
                            <T
                              gu="સમસ્યાનું વિગતવાર વર્ણન:"
                              en="Grievance Description:"
                              hi="शिकायत का विस्तृत विवरण:"
                            />
                          </p>
                          <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                            <T
                              gu={item.descriptionGu}
                              en={item.descriptionEn}
                              hi={item.descriptionHi}
                            />
                          </p>
                        </div>

                        {/* Resolution Note if Resolved */}
                        {isResolved && item.resolutionNoteGu && (
                          <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl p-3 flex gap-2.5 items-start">
                            <Icon
                              name="task_alt"
                              size={20}
                              className="text-[#15803D] shrink-0 mt-0.5"
                            />
                            <div className="min-w-0">
                              <p className="font-label-md text-label-md text-[#15803D] font-bold">
                                <T
                                  gu="નિરાકરણ નોંધ (Resolution Summary):"
                                  en="Resolution Summary:"
                                  hi="निवारण सारांश:"
                                />
                              </p>
                              <p className="font-body-sm text-body-sm text-on-surface mt-1 leading-relaxed">
                                <T
                                  gu={item.resolutionNoteGu}
                                  en={item.resolutionNoteEn ?? ""}
                                  hi={item.resolutionNoteHi ?? ""}
                                />
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Interactive Star Rating Prompt for Resolved Cards */}
                        {isResolved && (
                          <div className="bg-surface-container-high/60 rounded-xl p-3 flex flex-col gap-2.5 border border-outline-variant/60">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-label-md text-label-md text-on-surface font-bold">
                                  <T
                                    gu="આ નિરાકરણથી તમે કેટલા સંતુષ્ટ છો?"
                                    en="How satisfied are you with this resolution?"
                                    hi="इस समाधान से आप कितने संतुष्ट हैं?"
                                  />
                                </p>
                                <p className="font-caption text-caption text-on-surface-variant">
                                  <T
                                    gu="Rate Grievance Resolution Quality"
                                    en="Rate Grievance Resolution Quality"
                                    hi="समाधान गुणवत्ता को रेट करें"
                                  />
                                </p>
                              </div>
                              <span className="font-caption text-caption font-bold text-secondary bg-secondary/15 px-2 py-0.5 rounded">
                                <T
                                  gu={`${item.rating ?? 4}/૫ રેટિંગ આપ્યું`}
                                  en={`${item.rating ?? 4}/5 Rating Given`}
                                  hi={`${item.rating ?? 4}/5 रेटिंग दी गई`}
                                />
                              </span>
                            </div>

                            {/* 5 Stars Row */}
                            <div className="flex items-center gap-2">
                              {[1, 2, 3, 4, 5].map((starVal) => {
                                const currentRating = item.rating ?? 0;
                                const isFilled = starVal <= currentRating;
                                return (
                                  <button
                                    key={starVal}
                                    type="button"
                                    aria-label={`Rate ${starVal} stars`}
                                    onClick={() => handleRating(item.id, starVal)}
                                    className={`w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center transition-all ${
                                      isFilled
                                        ? "text-secondary hover:scale-110"
                                        : "text-outline hover:text-secondary hover:scale-110"
                                    }`}
                                  >
                                    <Icon name="star" size={24} fill={isFilled} />
                                  </button>
                                );
                              })}
                            </div>
                            <p className="font-caption text-caption text-[#15803D] flex items-center gap-1 font-medium">
                              <Icon name="check_circle" size={14} fill />
                              <T
                                gu="તમારો પ્રતિભાવ સબમિટ થયો છે. આભાર!"
                                en="Your feedback has been recorded. Thank you!"
                                hi="आपकी प्रतिक्रिया दर्ज कर ली गई है। धन्यवाद!"
                              />
                            </p>
                          </div>
                        )}

                        {/* Stepper Progress Live Timeline */}
                        <div className="my-1 pl-1">
                          <p className="font-label-md text-label-md text-on-surface font-bold mb-3 flex items-center gap-1.5">
                            <Icon name="timeline" size={18} className="text-primary" />
                            <T
                              gu="તપાસ પ્રક્રિયાની સ્થિતિ (Live Timeline)"
                              en="Action Taken Timeline"
                              hi="कार्रवाई स्थिति समयरेखा"
                            />
                          </p>

                          <div className="relative flex flex-col gap-3 pl-6">
                            {item.timeline.map((step, idx) => {
                              const isLast = idx === item.timeline.length - 1;
                              const isCompleted = step.status === "completed";
                              const isCurrent = step.status === "current";

                              return (
                                <div key={idx} className="relative flex items-start gap-2">
                                  {/* Step Circle Indicator */}
                                  <div
                                    className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                      isCompleted
                                        ? "bg-primary text-on-primary"
                                        : isCurrent
                                        ? "bg-secondary text-on-secondary animate-pulse"
                                        : "bg-surface-container-high text-outline"
                                    }`}
                                  >
                                    {isCompleted ? (
                                      <Icon name="check" size={11} />
                                    ) : (
                                      <span>{idx + 1}</span>
                                    )}
                                  </div>

                                  {/* Connector Line */}
                                  {!isLast && (
                                    <div
                                      className={`absolute -left-[17px] top-4 w-0.5 h-7 ${
                                        isCompleted ? "bg-primary" : "bg-surface-container-high"
                                      }`}
                                    />
                                  )}

                                  {/* Step Content */}
                                  <div className="min-w-0 pb-1">
                                    {isCurrent && (
                                      <span className="inline-block bg-secondary/15 text-secondary font-label-md text-label-md px-1.5 py-0.2 rounded font-bold mb-0.5">
                                        <T
                                          gu="વર્તમાન સ્થિતિ (In Review)"
                                          en="Current Status (In Review)"
                                          hi="वर्तमान स्थिति (समीक्षाधीन)"
                                        />
                                      </span>
                                    )}
                                    <p
                                      className={`font-label-md text-label-md leading-tight ${
                                        isCurrent
                                          ? "text-on-surface font-bold"
                                          : isCompleted
                                          ? "text-on-surface font-semibold"
                                          : "text-on-surface-variant font-normal"
                                      }`}
                                    >
                                      <T
                                        gu={step.titleGu}
                                        en={step.titleEn}
                                        hi={step.titleHi}
                                      />
                                    </p>
                                    <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                                      {step.time && <span className="font-medium">{step.time} • </span>}
                                      <T
                                        gu={step.descGu}
                                        en={step.descEn}
                                        hi={step.descHi}
                                      />
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Action buttons (Reply & Priority Reminder for in-progress) */}
                        {!isResolved && (
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() =>
                                openReplyModal(item.token, item.assignedOfficer.nameGu)
                              }
                              type="button"
                              className="flex-1 min-h-[44px] px-3 rounded-xl bg-surface-container text-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 hover:bg-surface-container-high transition-colors shadow-xs"
                            >
                              <Icon name="add_comment" size={18} />
                              <span>
                                <T
                                  gu="જવાબ / વધારાની વિગત ઉમેરો"
                                  en="Add Detail / Reply"
                                  hi="विवरण जोड़ें / उत्तर दें"
                                />
                              </span>
                            </button>
                            <button
                              onClick={() => handlePriorityReminder(item.token)}
                              type="button"
                              title="ઝડપી રીમાઇન્ડર (Priority Reminder)"
                              className="h-11 px-3 rounded-xl bg-surface-container text-on-surface-variant hover:text-secondary hover:bg-surface-container-high transition-colors flex items-center justify-center shadow-xs"
                            >
                              <Icon name="notifications_active" size={18} />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Quick CTA to switch to Raise form */}
            <button
              onClick={() => setActiveTab("raise")}
              type="button"
              className="w-full min-h-[48px] rounded-2xl bg-surface-container-lowest text-primary border border-primary/30 font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/5 active:scale-98 transition-all shadow-level-1 mt-2"
            >
              <Icon name="post_add" size={20} />
              <span>
                <T
                  gu="નવી ફરિયાદ અથવા પ્રશ્ન નોંધાવો"
                  en="Raise New Grievance / Inquiry"
                  hi="नई शिकायत या प्रश्न दर्ज करें"
                />
              </span>
            </button>
          </div>
        )}

        {/* VIEW 2: RAISE NEW GRIEVANCE FORM (TAB VIEW) */}
        {activeTab === "raise" && (
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-level-1 border border-outline-variant flex flex-col gap-4 animate-fade-in">
            <div>
              <h2 className="font-title-md text-title-md text-on-surface font-bold">
                <T
                  gu="નવી ફરિયાદ નોંધાવો"
                  en="Raise New Grievance"
                  hi="नई शिकायत दर्ज करें"
                />
              </h2>
              <p className="font-caption text-caption text-on-surface-variant">
                <T
                  gu="ચકાસાયેલ વિદ્યાર્થી વિગતો સાથે ત્વરિત ફરિયાદ"
                  en="Raise New Ticket with Verified Student Details"
                  hi="सत्यापित छात्र विवरण के साथ त्वरित शिकायत"
                />
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              {/* Scheme / Application pre-selected dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-lg text-label-lg text-on-surface font-semibold flex items-center justify-between">
                  <span>
                    <T
                      gu="સંબંધિત યોજના / અરજી"
                      en="Associated Scheme / Application"
                      hi="संबंधित योजना / आवेदन"
                    />{" "}
                    <span className="text-error font-bold">*</span>
                  </span>
                  <span className="font-caption text-caption text-primary font-normal">
                    <T gu="Active Profile Link" en="Active Profile Link" hi="सक्रिय प्रोफाइल" />
                  </span>
                </label>
                <div className="relative">
                  <select
                    value={selectedScheme}
                    onChange={(e) => setSelectedScheme(e.target.value)}
                    className="w-full h-11 px-3 pr-9 rounded-xl bg-surface-container text-on-surface font-body-sm text-body-sm appearance-none outline-none focus:bg-surface-container-high border border-outline-variant/60"
                  >
                    <option value="APP-2026-00344">
                      APP-2026-00344 (નમો લક્ષ્મી યોજના - Namo Lakshmi)
                    </option>
                    <option value="APP-2026-00871">
                      APP-2026-00871 (સરસ્વતી સાધના યોજના - Saraswati Bicycle)
                    </option>
                    <option value="APP-GEN">
                      સામાન્ય શિષ્યવૃત્તિ પૂછપરછ (General Educational Grant)
                    </option>
                  </select>
                  <span className="absolute right-2.5 top-2.5 pointer-events-none text-on-surface-variant">
                    <Icon name="arrow_drop_down" size={20} />
                  </span>
                </div>
              </div>

              {/* Grievance Category Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-lg text-label-lg text-on-surface font-semibold">
                  <T
                    gu="સમસ્યાનો પ્રકાર (Grievance Category)"
                    en="Grievance Category"
                    hi="शिकायत की श्रेणी"
                  />{" "}
                  <span className="text-error font-bold">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    required
                    className="w-full h-11 px-3 pr-9 rounded-xl bg-surface-container text-on-surface font-body-sm text-body-sm appearance-none outline-none focus:bg-surface-container-high border border-outline-variant/60"
                  >
                    <option value="dbt">
                      શિષ્યવૃત્તિ જમા થઈ નથી / વિલંબ (Payment Delay / DBT Issue)
                    </option>
                    <option value="docs">
                      દસ્તાવેજ વેરિફિકેશન વિલંબ / અસ્વીકાર (Document Verification Delay)
                    </option>
                    <option value="wrong_amount">
                      ખોટી રકમ જમા થઈ (Wrong Amount Credited)
                    </option>
                    <option value="bicycle">
                      સાયકલ વિતરણ / ક્ષતિગ્રસ્ત સાયકલ (Bicycle Handover / Defect)
                    </option>
                    <option value="eligibility">
                      પાત્રતા ખોટી દર્શાવે છે (Eligibility Criteria Dispute)
                    </option>
                    <option value="school">
                      શાળા કક્ષાએથી મંજૂરી અટકેલ (School Level Pending)
                    </option>
                    <option value="other">અન્ય સમસ્યા (Other Grievance)</option>
                  </select>
                  <span className="absolute right-2.5 top-2.5 pointer-events-none text-on-surface-variant">
                    <Icon name="arrow_drop_down" size={20} />
                  </span>
                </div>
              </div>

              {/* Description textarea with voice input */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-label-lg text-label-lg text-on-surface font-semibold">
                    <T
                      gu="સમસ્યાનું વિગતવાર વર્ણન"
                      en="Detailed Problem Description"
                      hi="समस्या का विस्तृत विवरण"
                    />{" "}
                    <span className="text-error font-bold">*</span>
                  </label>
                  <span className="font-caption text-caption text-on-surface-variant">
                    <T gu="મહત્તમ ૫૦૦ શબ્દો" en="Max 500 words" hi="अधिकतम 500 शब्द" />
                  </span>
                </div>
                <div className="relative">
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="તમારી સમસ્યા વિગતવાર જણાવો... (જેમ કે: બીજા હપ્તાની ₹૨,૫૦૦ સહાય રકમ હજુ ખાતામાં જમા થઈ નથી)"
                    className="w-full p-3 pr-12 rounded-xl bg-surface-container text-on-surface font-body-sm text-body-sm outline-none resize-none focus:bg-surface-container-high border border-outline-variant/60 placeholder:text-on-surface-variant/70 leading-relaxed"
                  />
                  {/* Voice Input Floating Button */}
                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    title="ગુજરાતીમાં બોલીને લખો (Gujarati Voice Typing)"
                    className={`absolute right-2.5 bottom-2.5 w-9 h-9 rounded-full flex items-center justify-center shadow-level-1 transition-all ${
                      isListening
                        ? "bg-danger text-on-danger animate-pulse scale-105"
                        : "bg-primary text-on-primary hover:scale-105 active:scale-95"
                    }`}
                  >
                    <Icon name="mic" size={20} />
                  </button>
                </div>
                {/* Voice Guidance indicator */}
                <div className="flex items-center justify-between px-1">
                  <span className="font-caption text-caption text-primary flex items-center gap-1">
                    <Icon name="record_voice_over" size={14} />
                    <T
                      gu="વોઇસ ઇનપુટ ઉપલબ્ધ: માઇક દબાવી ગુજરાતીમાં બોલો"
                      en="Voice Input Available: Click mic and speak in Gujarati"
                      hi="वॉयस इनपुट उपलब्ध: माइक दबाकर बोलें"
                    />
                  </span>
                  {isListening && (
                    <span className="font-caption text-caption text-secondary font-bold animate-pulse">
                      <T gu="સાંભળી રહ્યા છીએ..." en="Listening..." hi="सुन रहे हैं..." />
                    </span>
                  )}
                </div>
              </div>

              {/* Attachment Uploader */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-lg text-label-lg text-on-surface font-semibold flex items-center justify-between">
                  <span>
                    <T
                      gu="ફોટો અથવા પુરાવો જોડો"
                      en="Attach Photo / Document"
                      hi="फोटो या दस्तावेज संलग्न करें"
                    />
                  </span>
                  <span className="font-caption text-caption text-on-surface-variant">
                    <T gu="વૈકલ્પિક (Max 5MB)" en="Optional (Max 5MB)" hi="वैकल्पिक (अधिकतम 5MB)" />
                  </span>
                </label>
                <div className="bg-surface-container p-3 rounded-xl flex flex-col gap-2.5 border border-outline-variant/60">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSimulateUpload("Camera")}
                      className="flex-1 h-11 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 shadow-xs border border-outline-variant/60 hover:bg-surface-container-low transition-colors"
                    >
                      <Icon name="photo_camera" size={18} className="text-primary" />
                      <span>
                        <T gu="કેમેરાથી ફોટો" en="Take Photo" hi="कैमरे से फोटो" />
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSimulateUpload("Gallery")}
                      className="flex-1 h-11 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 shadow-xs border border-outline-variant/60 hover:bg-surface-container-low transition-colors"
                    >
                      <Icon name="upload_file" size={18} className="text-primary" />
                      <span>
                        <T gu="દસ્તાવેજ પસંદ કરો" en="Upload File" hi="फ़ाइल चुनें" />
                      </span>
                    </button>
                  </div>

                  {/* Attached file preview pill */}
                  {attachedFile && (
                    <div className="bg-surface-container-lowest p-2 rounded-lg flex items-center justify-between gap-2 shadow-xs border border-outline-variant/40 animate-fade-in">
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon name="image" size={20} className="text-primary shrink-0" />
                        <div className="min-w-0">
                          <p className="font-label-md text-label-md text-on-surface font-semibold truncate">
                            {attachedFile.name}
                          </p>
                          <p className="font-caption text-caption text-on-surface-variant">
                            {attachedFile.size} •{" "}
                            <T gu="જોડાઈ ચૂક્યો છે" en="Attached" hi="संलग्न किया गया" />
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        aria-label="Remove Attachment"
                        onClick={handleRemoveAttachment}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-error hover:bg-error/10 transition-colors"
                      >
                        <Icon name="close" size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Citizen Charter Guarantee Box */}
              <div className="bg-surface-container-low rounded-xl p-3 flex items-start gap-2.5 border border-outline-variant/60 shadow-xs">
                <Icon name="verified_user" size={22} className="text-primary shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-label-md text-label-md text-on-surface font-bold">
                    <T
                      gu="ગુજરાત લોકસેવા હક્ક અધિનિયમ (GSRDA) ગેરંટી"
                      en="Gujarat Public Services Guarantee Act (GSRDA)"
                      hi="गुजरात लोक सेवा अधिकार अधिनियम (GSRDA) गारंटी"
                    />
                  </p>
                  <p className="font-caption text-caption text-on-surface-variant leading-relaxed">
                    <T
                      gu="તમારી ફરિયાદ નોંધાયા બાદ સંબંધિત શિક્ષણ અધિકારી દ્વારા ૭ દિવસમાં ફરજિયાત નિરાકરણ કરવામાં આવશે. આપને SMS દ્વારા સતત અપડેટ્સ મળતા રહેશે."
                      en="Mandatory resolution within 7 working days by the assigned education officer under GSRDA. Real-time updates delivered via SMS."
                      hi="शिकायत दर्ज होने के बाद संबंधित शिक्षा अधिकारी द्वारा 7 दिनों में अनिवार्य समाधान किया जाएगा। एसएमएस द्वारा अपडेट प्राप्त होंगे।"
                    />
                  </p>
                </div>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                className="w-full min-h-[48px] rounded-xl bg-primary text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-level-1 hover:bg-primary-container active:scale-98 transition-all"
              >
                <span>
                  <T
                    gu="ફરિયાદ સબમિટ કરો (Submit Ticket)"
                    en="Submit Grievance Ticket"
                    hi="शिकायत टिकट सबमिट करें"
                  />
                </span>
                <Icon name="arrow_forward" size={20} />
              </button>
            </form>
          </div>
        )}

        {/* HELP SECTION & HELPLINE FOOTER */}
        <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant flex flex-col gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <Icon name="contact_support" size={20} className="text-primary" />
            <h3 className="font-title-md text-title-md text-on-surface font-bold">
              <T gu="સહાયતા ડેસ્ક અને સંપર્ક" en="Help Desk & Direct Helpline" hi="सहायता डेस्क व संपर्क" />
            </h3>
          </div>
          <p className="font-caption text-caption text-on-surface-variant leading-relaxed">
            <T
              gu="જો તમારી સમસ્યાનું ૭ દિવસમાં નિવારણ ન થાય, તો આપ સીધો ટોલ ફ્રી હેલ્પલાઇન 1800-233-5500 અથવા CM ડેશબોર્ડ હેલ્પલાઇન 181 પર સંપર્ક કરી શકો છો."
              en="If your issue is not resolved within 7 days, you can directly call the toll-free helpline at 1800-233-5500 or CM Helpline 181."
              hi="यदि आपकी समस्या का 7 दिनों में समाधान नहीं होता है, तो आप टोल फ्री हेल्पलाइन 1800-233-5500 या सीएम हेल्पलाइन 181 पर संपर्क कर सकते हैं।"
            />
          </p>
          <div className="flex items-center gap-2 pt-1">
            <a
              href="tel:18002335500"
              className="flex-1 h-10 rounded-xl bg-primary/10 text-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 hover:bg-primary/20 transition-colors"
            >
              <Icon name="call" size={16} />
              <span>1800-233-5500</span>
            </a>
            <a
              href="tel:181"
              className="flex-1 h-10 rounded-xl bg-secondary/10 text-secondary font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 hover:bg-secondary/20 transition-colors"
            >
              <Icon name="emergency" size={16} />
              <span>CM 181</span>
            </a>
          </div>
        </div>
      </div>

      {/* MODAL 1: RAISE NEW GRIEVANCE MODAL (Pop-up from Top CTA) */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-4 shadow-level-3 flex flex-col gap-4 max-h-[85vh] overflow-y-auto border border-outline-variant">
            <div className="flex items-center justify-between border-b border-outline-variant pb-3">
              <div>
                <h3 className="font-title-md text-title-md text-on-surface font-bold">
                  <T
                    gu="નવી ફરિયાદ નોંધાવો"
                    en="Raise New Grievance"
                    hi="नई शिकायत दर्ज करें"
                  />
                </h3>
                <p className="font-caption text-caption text-on-surface-variant">
                  <T
                    gu="ટોકન આપમેળે જનરેટ થશે"
                    en="Instant Token Generation"
                    hi="त्वरित टोकन जनरेशन"
                  />
                </p>
              </div>
              <button
                type="button"
                aria-label="Close Modal"
                onClick={() => setIsNewModalOpen(false)}
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-3.5">
              {/* Scheme Dropdown */}
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-on-surface font-semibold">
                  <T gu="સંબંધિત યોજના" en="Scheme" hi="संबंधित योजना" />{" "}
                  <span className="text-error font-bold">*</span>
                </label>
                <select
                  value={selectedScheme}
                  onChange={(e) => setSelectedScheme(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-surface-container text-on-surface font-body-sm text-body-sm outline-none border border-outline-variant/60"
                >
                  <option value="APP-2026-00344">
                    APP-2026-00344 (નમો લક્ષ્મી યોજના - Namo Lakshmi)
                  </option>
                  <option value="APP-2026-00871">
                    APP-2026-00871 (સરસ્વતી સાધના યોજના - Saraswati Bicycle)
                  </option>
                  <option value="APP-GEN">
                    સામાન્ય શિષ્યવૃત્તિ પૂછપરછ (General Educational Grant)
                  </option>
                </select>
              </div>

              {/* Category Dropdown */}
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-on-surface font-semibold">
                  <T gu="સમસ્યાનો પ્રકાર" en="Grievance Category" hi="शिकायत की श्रेणी" />{" "}
                  <span className="text-error font-bold">*</span>
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  required
                  className="w-full h-11 px-3 rounded-xl bg-surface-container text-on-surface font-body-sm text-body-sm outline-none border border-outline-variant/60"
                >
                  <option value="dbt">શિષ્યવૃત્તિ જમા વિલંબ (Payment Delay)</option>
                  <option value="docs">દસ્તાવેજ વેરિફિકેશન વિલંબ (Document Rejection / Delay)</option>
                  <option value="wrong_amount">ખોટી રકમ જમા થયેલ (Wrong Amount Credited)</option>
                  <option value="bicycle">સાયકલ વિતરણ સંબંધિત (Bicycle Handover / Defect)</option>
                  <option value="eligibility">પાત્રતા ખોટી દર્શાવે છે (Eligibility Dispute)</option>
                  <option value="school">શાળા કક્ષાએથી મંજૂરી અટકેલ (School Level Pending)</option>
                  <option value="other">અન્ય સમસ્યા (Other Grievance)</option>
                </select>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-on-surface font-semibold">
                    <T gu="સમસ્યાનું વિગતવાર વર્ણન" en="Problem Description" hi="समस्या का विवरण" />{" "}
                    <span className="text-error font-bold">*</span>
                  </label>
                  <span className="font-caption text-caption text-on-surface-variant">
                    <T gu="મહત્તમ ૫૦૦ શબ્દો" en="Max 500 words" hi="अधिकतम 500 शब्द" />
                  </span>
                </div>
                <div className="relative">
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="તમારી સમસ્યા વિગતવાર જણાવો..."
                    className="w-full p-3 pr-11 rounded-xl bg-surface-container text-on-surface font-body-sm text-body-sm outline-none resize-none border border-outline-variant/60"
                  />
                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    title="ગુજરાતીમાં બોલીને લખો"
                    className={`absolute right-2 bottom-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isListening ? "bg-danger text-on-danger animate-pulse" : "bg-primary text-on-primary"
                    }`}
                  >
                    <Icon name="mic" size={16} />
                  </button>
                </div>
              </div>

              {/* Attachment summary */}
              {attachedFile && (
                <div className="bg-surface-container-low p-2 rounded-lg flex items-center justify-between text-caption text-on-surface-variant border border-outline-variant/40">
                  <span className="truncate flex items-center gap-1.5">
                    <Icon name="attachment" size={16} className="text-primary" />
                    {attachedFile.name} ({attachedFile.size})
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveAttachment}
                    className="text-error hover:underline text-caption"
                  >
                    <T gu="હટાવો" en="Remove" hi="हटाएं" />
                  </button>
                </div>
              )}

              {/* GSRDA Guarantee */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-2.5 flex items-center gap-2">
                <Icon name="verified_user" size={18} className="text-primary shrink-0" />
                <p className="font-caption text-caption text-on-surface-variant">
                  <T
                    gu="GSRDA ૭ દિવસમાં નિવારણ ગેરંટી અને SMS એલર્ટ"
                    en="GSRDA 7-day resolution guarantee & SMS alerts"
                    hi="GSRDA 7 दिनों में समाधान गारंटी व एसएमएस अलर्ट"
                  />
                </p>
              </div>

              {/* Modal Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="flex-1 min-h-[44px] rounded-xl bg-surface-container text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors"
                >
                  <T gu="રદ કરો" en="Cancel" hi="रद्द करें" />
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-[44px] rounded-xl bg-primary text-on-primary font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 hover:bg-primary-container transition-colors shadow-level-1"
                >
                  <span>
                    <T gu="સબમિટ કરો" en="Submit" hi="सबमिट करें" />
                  </span>
                  <Icon name="arrow_forward" size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REPLY / ADD DETAILS MODAL */}
      {isReplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-4 shadow-level-3 flex flex-col gap-4 border border-outline-variant">
            <div className="flex items-center justify-between border-b border-outline-variant pb-3">
              <div>
                <h4 className="font-title-md text-title-md text-on-surface font-bold">
                  <T
                    gu="વિગત ઉમેરો / જવાબ આપો"
                    en="Add Detail / Reply"
                    hi="विवरण जोड़ें / उत्तर दें"
                  />
                </h4>
                <p className="font-caption text-caption text-on-surface-variant font-mono">
                  <T
                    gu={`ટિકિટ: #${replyTargetToken}`}
                    en={`Ticket: #${replyTargetToken}`}
                    hi={`टिकट: #${replyTargetToken}`}
                  />
                </p>
              </div>
              <button
                type="button"
                aria-label="Close Reply Modal"
                onClick={() => setIsReplyModalOpen(false)}
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="bg-surface-container-low p-2.5 rounded-xl flex items-center gap-2 border border-outline-variant/60">
              <Icon name="info" size={18} className="text-primary shrink-0" />
              <p className="font-caption text-caption text-on-surface-variant">
                <T
                  gu={`અધિકારીશ્રી ${replyOfficerName}ના ધ્યાન પર સીધી માહિતી મોકલાશે.`}
                  en={`Information will be forwarded directly to Officer ${replyOfficerName}.`}
                  hi={`जानकारी सीधे अधिकारी ${replyOfficerName} के संज्ञान में भेजी जाएगी।`}
                />
              </p>
            </div>

            <textarea
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="તમારો વધારાનો ખુલાસો, સુધારેલ આધાર નંબર અથવા બેંક UTR અહીં લખો..."
              className="w-full p-3 rounded-xl bg-surface-container text-on-surface font-body-sm text-body-sm outline-none resize-none focus:bg-surface-container-high border border-outline-variant/60"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsReplyModalOpen(false)}
                className="flex-1 min-h-[44px] rounded-xl bg-surface-container text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors"
              >
                <T gu="રદ કરો" en="Cancel" hi="रद्द करें" />
              </button>
              <button
                type="button"
                onClick={handleSendReply}
                className="flex-1 min-h-[44px] rounded-xl bg-primary text-on-primary font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 hover:bg-primary-container transition-colors shadow-level-1"
              >
                <span>
                  <T gu="મોકલો" en="Send Reply" hi="भेजें" />
                </span>
                <Icon name="send" size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION POPUP */}
      {toast && (
        <div className="fixed bottom-20 left-4 right-4 z-50 max-w-[400px] mx-auto bg-inverse-surface text-on-inverse-surface p-3.5 rounded-2xl shadow-level-3 flex items-center gap-3 animate-slide-up border border-outline/30">
          <Icon name="check_circle" size={24} className="text-secondary shrink-0" fill />
          <div className="min-w-0">
            <p className="font-label-md text-label-md font-bold text-on-inverse-surface">
              {toast.title}
            </p>
            <p className="font-caption text-caption text-on-inverse-surface/85 truncate">
              {toast.message}
            </p>
          </div>
        </div>
      )}
    </StudentShell>
  );
}
