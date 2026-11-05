"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";

interface ConditionRule {
  id: string;
  connector: "IF" | "AND" | "OR";
  attribute: string;
  attributeLabelGu: string;
  attributeLabelEn: string;
  attributeLabelHi: string;
  operator: string;
  operatorLabelGu: string;
  operatorLabelEn: string;
  value: string;
  valueBadgeGu: string;
  valueBadgeEn: string;
  badgeBg: string;
  badgeText: string;
  noteGu?: string;
  noteEn?: string;
}

interface SchemeItem {
  id: string;
  code: string;
  nameGu: string;
  nameEn: string;
  nameHi: string;
  version: string;
  status: "approved" | "pending" | "inprogress";
  statusTextGu: string;
  statusTextEn: string;
  targetGu: string;
  targetEn: string;
  amount: string;
  classRange: string;
  gender: string[];
  categories: string[];
  incomeCeiling: number;
  startDate: string;
  endDate: string;
  benefitAmounts: { [key: string]: number };
  mutuallyExclusive: string[];
  allowedConcurrent: string[];
}

const INITIAL_SCHEMES: SchemeItem[] = [
  {
    id: "sch-1",
    code: "SCH-NL-2026",
    nameGu: "નમો લક્ષ્મી યોજના (વિસ્તરણ - ધોરણ ૯ થી ૧૨)",
    nameEn: "Namo Lakshmi Yojana (Classes 9 to 12)",
    nameHi: "नमो लक्ष्मी योजना (कक्षा 9 से 12)",
    version: "v2026-27 ડ્રાફ્ટ (Draft)",
    status: "pending",
    statusTextGu: "સમીક્ષા હેઠળ",
    statusTextEn: "Under Review",
    targetGu: "કન્યાઓ • ધોરણ ૯-૧૨",
    targetEn: "Girls • Classes 9-12",
    amount: "₹ ૧૨,૫૦૦/વર્ષ",
    classRange: "9-12",
    gender: ["female"],
    categories: ["SC", "ST", "OBC", "General", "EWS"],
    incomeCeiling: 600000,
    startDate: "2026-06-01",
    endDate: "2027-05-31",
    benefitAmounts: { class9: 10000, class10: 10000, class11: 15000, class12: 15000 },
    mutuallyExclusive: [
      "કેટેગરી છાત્રાલય નિર્વાહ ભથ્થું (Hostel Maintenance Allowance)",
      "ખાનગી સ્પોન્સર્ડ સ્કોલરશિપ (Private Sponsored Scholarship)"
    ],
    allowedConcurrent: ["સરસ્વતી સાધના સાયકલ યોજના (Saraswati Sadhana Cycle Scheme)"]
  },
  {
    id: "sch-2",
    code: "SCH-NS-2026",
    nameGu: "નમો સરસ્વતી વિજ્ઞાન સાધના યોજના",
    nameEn: "Namo Saraswati Vigyan Sadhana Scheme",
    nameHi: "नमो सरस्वती विज्ञान साधना योजना",
    version: "v2026-27 સક્રિય (Active)",
    status: "approved",
    statusTextGu: "મંજૂર (સક્રિય)",
    statusTextEn: "Active Approved",
    targetGu: "વિજ્ઞાન પ્રવાહ • ધોરણ ૧૧-૧૨",
    targetEn: "Science Stream • Classes 11-12",
    amount: "₹ ૨૦,૦૦૦/વર્ષ",
    classRange: "11-12",
    gender: ["female", "male"],
    categories: ["SC", "ST", "OBC", "General", "EWS"],
    incomeCeiling: 600000,
    startDate: "2026-06-01",
    endDate: "2027-05-31",
    benefitAmounts: { class11: 20000, class12: 25000 },
    mutuallyExclusive: ["ખાનગી સ્પોન્સર્ડ સ્કોલરશિપ (Private Sponsored Scholarship)"],
    allowedConcurrent: ["સરસ્વતી સાધના સાયકલ યોજના (Saraswati Sadhana Cycle Scheme)"]
  },
  {
    id: "sch-3",
    code: "SCH-SS-2026",
    nameGu: "સરસ્વતી સાધના સાયકલ યોજના",
    nameEn: "Saraswati Sadhana Cycle Scheme",
    nameHi: "सरस्वती साधना साइकिल योजना",
    version: "v2026-27 સક્રિય (Active)",
    status: "approved",
    statusTextGu: "મંજૂર (સક્રિય)",
    statusTextEn: "Active Approved",
    targetGu: "ધોરણ ૯ કન્યાઓ • મફત સાયકલ",
    targetEn: "Class 9 Girls • Free Cycle",
    amount: "સાધન સહાય (સાયકલ)",
    classRange: "9",
    gender: ["female"],
    categories: ["SC", "ST", "OBC", "EWS"],
    incomeCeiling: 600000,
    startDate: "2026-06-01",
    endDate: "2027-05-31",
    benefitAmounts: { class9: 4500 },
    mutuallyExclusive: [],
    allowedConcurrent: ["નમો લક્ષ્મી યોજના (Namo Lakshmi Yojana)"]
  },
  {
    id: "sch-4",
    code: "SCH-PM-2026",
    nameGu: "પોસ્ટ-મેટ્રિક શિષ્યવૃત્તિ યોજના (SC / ST / OBC)",
    nameEn: "Post-Matric Scholarship Scheme (SC / ST / OBC)",
    nameHi: "पोस्ट-मैट्रिक छात्रवृत्ति योजना (SC / ST / OBC)",
    version: "v2026-27 સક્રિય (Active)",
    status: "approved",
    statusTextGu: "મંજૂર (સક્રિય)",
    statusTextEn: "Active Approved",
    targetGu: "ધોરણ ૧૧-૧૨ અને કોલેજ",
    targetEn: "Classes 11-12 & Higher",
    amount: "₹ ૮,૦૦૦ થી ૧૫,૦૦૦",
    classRange: "11-12",
    gender: ["female", "male", "other"],
    categories: ["SC", "ST", "OBC"],
    incomeCeiling: 250000,
    startDate: "2026-06-01",
    endDate: "2027-05-31",
    benefitAmounts: { class11: 8000, class12: 12000 },
    mutuallyExclusive: ["મુખ્યમંત્રી યુવા સ્વાવલંબન યોજના (MYSY)"],
    allowedConcurrent: ["સરસ્વતી સાધના સાયકલ યોજના"]
  },
  {
    id: "sch-5",
    code: "SCH-MYSY-2026",
    nameGu: "મુખ્યમંત્રી યુવા સ્વાવલંબન યોજના (MYSY)",
    nameEn: "Mukhyamantri Yuva Swavalamban Yojana (MYSY)",
    nameHi: "मुख्यमंत्री युवा स्वावलंबन योजना (MYSY)",
    version: "v2025-26 સમીક્ષા (Review)",
    status: "inprogress",
    statusTextGu: "પ્રક્રિયા હેઠળ",
    statusTextEn: "In Progress",
    targetGu: "ઉચ્ચ શિક્ષણ / ૮૦% ગુણ",
    targetEn: "Higher Education / 80% Marks",
    amount: "₹ ૨૫,૦૦૦ સુધી",
    classRange: "college",
    gender: ["female", "male", "other"],
    categories: ["SC", "ST", "OBC", "General", "EWS"],
    incomeCeiling: 600000,
    startDate: "2026-07-01",
    endDate: "2027-06-30",
    benefitAmounts: { higher: 25000 },
    mutuallyExclusive: ["પોસ્ટ-મેટ્રિક શિષ્યવૃત્તિ યોજના (Post-Matric)"],
    allowedConcurrent: []
  }
];

const INITIAL_CONDITIONS: ConditionRule[] = [
  {
    id: "cond-1",
    connector: "IF",
    attribute: "gender",
    attributeLabelGu: "જાતિ / લિંગ (Gender)",
    attributeLabelEn: "Gender",
    attributeLabelHi: "लिंग",
    operator: "=",
    operatorLabelGu: "બરાબર (Equals =)",
    operatorLabelEn: "Equals (=)",
    value: "female",
    valueBadgeGu: "કન્યા (Female)",
    valueBadgeEn: "Female",
    badgeBg: "bg-pink-100",
    badgeText: "text-pink-900"
  },
  {
    id: "cond-2",
    connector: "AND",
    attribute: "class",
    attributeLabelGu: "શૈક્ષણિક ધોરણ (Class / Grade)",
    attributeLabelEn: "Class / Grade",
    attributeLabelHi: "कक्षा / श्रेणी",
    operator: "in_range",
    operatorLabelGu: "માં સમાવિષ્ટ (In Range)",
    operatorLabelEn: "In Range",
    value: "9,10,11,12",
    valueBadgeGu: "ધોરણ ૯ થી ૧૨ (9, 10, 11, 12)",
    valueBadgeEn: "Classes 9 to 12",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-900"
  },
  {
    id: "cond-3",
    connector: "AND",
    attribute: "attendance",
    attributeLabelGu: "ન્યૂનતમ હાજરી ટકાવારી (Attendance %)",
    attributeLabelEn: "Minimum Attendance %",
    attributeLabelHi: "न्यूनतम उपस्थिति %",
    operator: ">=",
    operatorLabelGu: "વધારે અથવા સરખું (>=)",
    operatorLabelEn: "Greater Than or Equal (>=)",
    value: "80%",
    valueBadgeGu: "૮૦% (80.00%)",
    valueBadgeEn: "80.00%",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-900"
  },
  {
    id: "cond-4",
    connector: "AND",
    attribute: "school_type",
    attributeLabelGu: "શાળા પ્રકાર (School Type)",
    attributeLabelEn: "School Type",
    attributeLabelHi: "स्कूल का प्रकार",
    operator: "=",
    operatorLabelGu: "બરાબર (Equals =)",
    operatorLabelEn: "Equals (=)",
    value: "govt_granted",
    valueBadgeGu: "સરકારી / ગ્રાન્ટેડ શાળાઓ",
    valueBadgeEn: "Govt / Grant-in-aid Schools",
    badgeBg: "bg-violet-100",
    badgeText: "text-violet-900"
  },
  {
    id: "cond-5",
    connector: "AND",
    attribute: "income",
    attributeLabelGu: "વાર્ષિક કુટુંબ આવક (Family Income)",
    attributeLabelEn: "Annual Family Income",
    attributeLabelHi: "वार्षिक पारिवारिक आय",
    operator: "<=",
    operatorLabelGu: "ઓછું અથવા સરખું (<=)",
    operatorLabelEn: "Less Than or Equal (<=)",
    value: "600000",
    valueBadgeGu: "₹ ૬,૦૦,૦૦૦ (Cap Limit)",
    valueBadgeEn: "₹ 6,00,000 (Cap Limit)",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-900",
    noteGu: "આવક દાખલો માન્ય",
    noteEn: "Valid Income Certificate"
  }
];

interface SampleStudent {
  id: string;
  initials: string;
  nameGu: string;
  nameEn: string;
  ctsId: string;
  gradeGu: string;
  gradeEn: string;
  gender: "female" | "male";
  classNum: number;
  attendance: number;
  schoolTypeGu: string;
  schoolTypeEn: string;
  isGovtGranted: boolean;
  income: number;
  incomeFormattedGu: string;
  incomeFormattedEn: string;
}

const SAMPLE_STUDENTS: SampleStudent[] = [
  {
    id: "riya",
    initials: "RP",
    nameGu: "રિયા હસમુખભાઈ પટેલ",
    nameEn: "Riya Hasmukhbhai Patel",
    ctsId: "GJ-AND-2026-004512",
    gradeGu: "ધોરણ ૯-બી • આણંદ",
    gradeEn: "Class 9-B • Anand",
    gender: "female",
    classNum: 9,
    attendance: 82,
    schoolTypeGu: "સરદાર પટેલ હાઈસ્કૂલ (ગ્રાન્ટેડ)",
    schoolTypeEn: "Sardar Patel High School (Grant-in-aid)",
    isGovtGranted: true,
    income: 96000,
    incomeFormattedGu: "₹ ૯૬,૦૦૦",
    incomeFormattedEn: "₹ 96,000"
  },
  {
    id: "harsh",
    initials: "HS",
    nameGu: "હર્ષ વિનોદભાઈ શર્મા",
    nameEn: "Harsh Vinodbhai Sharma",
    ctsId: "GJ-SUR-2026-009823",
    gradeGu: "ધોરણ ૧૦-એ • સુરત",
    gradeEn: "Class 10-A • Surat",
    gender: "male",
    classNum: 10,
    attendance: 85,
    schoolTypeGu: "સરકારી મોડેલ હાઈસ્કૂલ, સુરત",
    schoolTypeEn: "Govt Model High School, Surat",
    isGovtGranted: true,
    income: 120000,
    incomeFormattedGu: "₹ ૧,૨૦,૦૦૦",
    incomeFormattedEn: "₹ 1,20,000"
  },
  {
    id: "ananya",
    initials: "AS",
    nameGu: "અનન્યા દિલીપભાઈ શાહ",
    nameEn: "Ananya Dilipbhai Shah",
    ctsId: "GJ-AHM-2026-001290",
    gradeGu: "ધોરણ ૧૧-સી • અમદાવાદ",
    gradeEn: "Class 11-C • Ahmedabad",
    gender: "female",
    classNum: 11,
    attendance: 76,
    schoolTypeGu: "સેન્ટ ઝેવિયર્સ પ્રાઇવેટ એકેડેમી",
    schoolTypeEn: "St. Xavier's Private Academy",
    isGovtGranted: false,
    income: 750000,
    incomeFormattedGu: "₹ ૭,૫૦,૦૦૦",
    incomeFormattedEn: "₹ 7,50,000"
  }
];

export default function SchemeBuilderPage() {
  const [schemes, setSchemes] = useState<SchemeItem[]>(INITIAL_SCHEMES);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>("sch-1");
  const [activeStep, setActiveStep] = useState<number>(2);
  const [schemeSearch, setSchemeSearch] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isBacktesting, setIsBacktesting] = useState<boolean>(false);
  const [backtestCompleted, setBacktestCompleted] = useState<boolean>(false);

  // Form State
  const [schemeName, setSchemeName] = useState<string>("નમો લક્ષ્મી યોજના (વિસ્તરણ - ધોરણ ૯ થી ૧૨)");
  const [schemeCode, setSchemeCode] = useState<string>("SCH-NL-2026");
  const [departmentRef] = useState<string>("GR-SCH/2026/SEC-EDU/09");
  const [startDate, setStartDate] = useState<string>("2026-06-01");
  const [endDate, setEndDate] = useState<string>("2027-05-31");
  const [classRange, setClassRange] = useState<string>("9-12");
  const [gender, setGender] = useState<string[]>(["female"]);
  const [categories, setCategories] = useState<string[]>(["SC", "ST", "OBC", "General", "EWS"]);
  const [incomeCeiling, setIncomeCeiling] = useState<number>(600000);
  const [benefitAmounts, setBenefitAmounts] = useState<{ [key: string]: number }>({
    class9: 10000,
    class10: 10000,
    class11: 15000,
    class12: 15000,
  });

  // Conditions & Stacking State
  const [logicConnector, setLogicConnector] = useState<"ALL" | "ANY">("ALL");
  const [conditions, setConditions] = useState<ConditionRule[]>(INITIAL_CONDITIONS);
  const [mutuallyExclusive, setMutuallyExclusive] = useState<string[]>([
    "કેટેગરી છાત્રાલય નિર્વાહ ભથ્થું (Hostel Maintenance Allowance)",
    "ખાનગી સ્પોન્સર્ડ સ્કોલરશિપ (Private Sponsored Scholarship)"
  ]);
  const [allowedConcurrent, setAllowedConcurrent] = useState<string[]>([
    "સરસ્વતી સાધના સાયકલ યોજના (જોડાણ માન્ય)"
  ]);
  const [newExclusivityInput, setNewExclusivityInput] = useState<string>("");

  // Simulator State
  const [selectedStudentId, setSelectedStudentId] = useState<string>("riya");

  const activeStudent = useMemo(() => {
    return SAMPLE_STUDENTS.find((s) => s.id === selectedStudentId) || SAMPLE_STUDENTS[0];
  }, [selectedStudentId]);

  // Dynamic simulation evaluation based on current form rules & selected student
  const simulationResults = useMemo(() => {
    const checks = [
      {
        id: "gender",
        labelGu: "જાતિ / લિંગ: કન્યા (Female)",
        labelEn: "Gender: Female",
        passed: gender.includes(activeStudent.gender),
        detailGu: activeStudent.gender === "female" ? "માન્ય ✓" : "અમાન્ય (કન્યા જરૂરી)",
        detailEn: activeStudent.gender === "female" ? "Valid ✓" : "Invalid (Requires Female)",
      },
      {
        id: "class",
        labelGu: `ધોરણ: ${activeStudent.gradeGu.split("•")[0]} (શ્રેણી ૯ થી ૧૨)`,
        labelEn: `Grade: ${activeStudent.gradeEn.split("•")[0]} (Range 9 to 12)`,
        passed: activeStudent.classNum >= 9 && activeStudent.classNum <= 12,
        detailGu: "માન્ય ✓",
        detailEn: "Valid ✓",
      },
      {
        id: "attendance",
        labelGu: `હાજરી: ${activeStudent.attendance}% (જરૂર ૮૦%)`,
        labelEn: `Attendance: ${activeStudent.attendance}% (Required 80%)`,
        passed: activeStudent.attendance >= 80,
        detailGu: activeStudent.attendance >= 80 ? `+${activeStudent.attendance - 80}% સુરક્ષા ✓` : "ઓછી હાજરી ✗",
        detailEn: activeStudent.attendance >= 80 ? `+${activeStudent.attendance - 80}% Buffer ✓` : "Low Attendance ✗",
      },
      {
        id: "school",
        labelGu: `શાળા: ${activeStudent.schoolTypeGu}`,
        labelEn: `School: ${activeStudent.schoolTypeEn}`,
        passed: activeStudent.isGovtGranted,
        detailGu: activeStudent.isGovtGranted ? "માન્ય ✓" : "અમાન્ય શાળા પ્રકાર ✗",
        detailEn: activeStudent.isGovtGranted ? "Valid ✓" : "Invalid School Type ✗",
      },
      {
        id: "income",
        labelGu: `કુટુંબ આવક: ${activeStudent.incomeFormattedGu} (મર્યાદા ₹ ${incomeCeiling.toLocaleString("en-IN")})`,
        labelEn: `Family Income: ${activeStudent.incomeFormattedEn} (Limit ₹ ${incomeCeiling.toLocaleString("en-IN")})`,
        passed: activeStudent.income <= incomeCeiling,
        detailGu: activeStudent.income <= incomeCeiling ? "માન્ય ✓" : "આવક મર્યાદાથી વધુ ✗",
        detailEn: activeStudent.income <= incomeCeiling ? "Valid ✓" : "Exceeds Income Cap ✗",
      },
    ];

    const passedCount = checks.filter((c) => c.passed).length;
    const isOverallEligible = logicConnector === "ALL" ? passedCount === checks.length : passedCount > 0;

    return {
      checks,
      passedCount,
      totalCount: checks.length,
      isOverallEligible,
    };
  }, [gender, incomeCeiling, logicConnector, activeStudent]);

  // Filter schemes in sidebar
  const filteredSchemes = useMemo(() => {
    if (!schemeSearch.trim()) return schemes;
    const q = schemeSearch.toLowerCase();
    return schemes.filter(
      (s) =>
        s.code.toLowerCase().includes(q) ||
        s.nameGu.toLowerCase().includes(q) ||
        s.nameEn.toLowerCase().includes(q)
    );
  }, [schemes, schemeSearch]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSelectScheme = (item: SchemeItem) => {
    setSelectedSchemeId(item.id);
    setSchemeName(item.nameGu);
    setSchemeCode(item.code);
    setClassRange(item.classRange);
    setGender(item.gender);
    setCategories(item.categories);
    setIncomeCeiling(item.incomeCeiling);
    setStartDate(item.startDate);
    setEndDate(item.endDate);
    setBenefitAmounts(item.benefitAmounts);
    setMutuallyExclusive(item.mutuallyExclusive);
    setAllowedConcurrent(item.allowedConcurrent);
    showToast(`યોજના લોડ થઈ: ${item.nameEn}`);
  };

  const handleAddNewScheme = () => {
    const newId = `sch-${Date.now()}`;
    const newScheme: SchemeItem = {
      id: newId,
      code: `SCH-NEW-${new Date().getFullYear()}`,
      nameGu: "નવી યોજના ૨૦૨૬ (ડ્રાફ્ટ)",
      nameEn: "New Scholarship Scheme 2026 (Draft)",
      nameHi: "नई छात्रवृत्ति योजना 2026 (ड्राफ्ट)",
      version: "v1.0 ડ્રાફ્ટ (Draft)",
      status: "inprogress",
      statusTextGu: "નવી ડ્રાફ્ટ",
      statusTextEn: "New Draft",
      targetGu: "તમામ પાત્ર વિદ્યાર્થીઓ",
      targetEn: "All Eligible Students",
      amount: "₹ ૧૦,૦૦૦/વર્ષ",
      classRange: "9-12",
      gender: ["female", "male"],
      categories: ["SC", "ST", "OBC", "General", "EWS"],
      incomeCeiling: 600000,
      startDate: "2026-06-01",
      endDate: "2027-05-31",
      benefitAmounts: { class9: 10000, class10: 10000, class11: 12000, class12: 12000 },
      mutuallyExclusive: [],
      allowedConcurrent: [],
    };

    setSchemes((prev) => [newScheme, ...prev]);
    handleSelectScheme(newScheme);
    showToast("નવી યોજના તૈયાર થઈ. વિગતો ભરો અને સાચવો. (New scheme created in draft)");
  };

  const handleToggleGender = (val: string) => {
    setGender((prev) =>
      prev.includes(val) ? (prev.length > 1 ? prev.filter((g) => g !== val) : prev) : [...prev, val]
    );
  };

  const handleToggleCategory = (cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? (prev.length > 1 ? prev.filter((c) => c !== cat) : prev) : [...prev, cat]
    );
  };

  const handleAddCondition = () => {
    const newId = `cond-${Date.now()}`;
    const newCond: ConditionRule = {
      id: newId,
      connector: "AND",
      attribute: "custom_rule",
      attributeLabelGu: "નવો પાત્રતા નિયમ (Custom Condition)",
      attributeLabelEn: "Custom Condition",
      attributeLabelHi: "कस्टम नियम",
      operator: "=",
      operatorLabelGu: "બરાબર (Equals =)",
      operatorLabelEn: "Equals (=)",
      value: "માન્ય (Valid)",
      valueBadgeGu: "ચકાસણી જરૂરી (Verified)",
      valueBadgeEn: "Verified",
      badgeBg: "bg-blue-100",
      badgeText: "text-blue-900",
    };
    setConditions((prev) => [...prev, newCond]);
    showToast("નવો નિયમ ઉમેરાયો (+ New Condition Added)");
  };

  const handleAddQuickCondition = (type: "marks" | "caste" | "domicile" | "pwd") => {
    const newId = `cond-quick-${Date.now()}`;
    let newCond: ConditionRule;

    if (type === "marks") {
      newCond = {
        id: newId,
        connector: "AND",
        attribute: "marks",
        attributeLabelGu: "અગાઉના વાર્ષિક ગુણ (Minimum Marks %)",
        attributeLabelEn: "Minimum Marks %",
        attributeLabelHi: "न्यूनतम अंक %",
        operator: ">=",
        operatorLabelGu: "વધારે અથવા સરખું (>=)",
        operatorLabelEn: "Greater Than or Equal (>=)",
        value: "60%",
        valueBadgeGu: "૬૦.૦૦% ન્યૂનતમ ગુણ",
        valueBadgeEn: "60.00% Min Marks",
        badgeBg: "bg-teal-100",
        badgeText: "text-teal-900",
      };
    } else if (type === "caste") {
      newCond = {
        id: newId,
        connector: "AND",
        attribute: "caste",
        attributeLabelGu: "સામાજિક કેટેગરી (Social Category)",
        attributeLabelEn: "Social Category",
        attributeLabelHi: "सामाजिक श्रेणी",
        operator: "in_list",
        operatorLabelGu: "સમાવિષ્ટ (In List)",
        operatorLabelEn: "In List",
        value: "SC, ST, SEBC",
        valueBadgeGu: "SC / ST / SEBC માન્ય પ્રમાણપત્ર",
        valueBadgeEn: "SC / ST / SEBC Valid Certificate",
        badgeBg: "bg-purple-100",
        badgeText: "text-purple-900",
      };
    } else if (type === "domicile") {
      newCond = {
        id: newId,
        connector: "AND",
        attribute: "domicile",
        attributeLabelGu: "ગુજરાત રહેવાસી પુરાવો (Gujarat Domicile)",
        attributeLabelEn: "Gujarat Domicile Status",
        attributeLabelHi: "गुजरात मूल निवासी",
        operator: "=",
        operatorLabelGu: "બરાબર (Equals =)",
        operatorLabelEn: "Equals (=)",
        value: "yes",
        valueBadgeGu: "ગુજરાત રાજ્ય વતની (Gujarat Resident)",
        valueBadgeEn: "Gujarat Resident",
        badgeBg: "bg-indigo-100",
        badgeText: "text-indigo-900",
      };
    } else {
      newCond = {
        id: newId,
        connector: "AND",
        attribute: "pwd",
        attributeLabelGu: "દિવ્યાંગતા પ્રમાણપત્ર (Disability PwD %)",
        attributeLabelEn: "Disability % (PwD)",
        attributeLabelHi: "दिव्यांगता प्रतिशत",
        operator: ">=",
        operatorLabelGu: "વધારે અથવા સરખું (>=)",
        operatorLabelEn: "Greater Than or Equal (>=)",
        value: "40%",
        valueBadgeGu: "૪૦% કે તેથી વધુ (UDID કાર્ડ)",
        valueBadgeEn: "40% or more (UDID Card)",
        badgeBg: "bg-emerald-100",
        badgeText: "text-emerald-900",
      };
    }

    setConditions((prev) => [...prev, newCond]);
    showToast(`નિયમ ઉમેરાયો: ${newCond.attributeLabelEn}`);
  };

  const handleRemoveCondition = (id: string) => {
    if (conditions.length <= 1) {
      showToast("ઓછામાં ઓછો ૧ નિયમ જરૂરી છે (Minimum 1 condition required)");
      return;
    }
    setConditions((prev) => prev.filter((c) => c.id !== id));
    showToast("નિયમ હટાવ્યો (Condition removed)");
  };

  const handleAddExclusivity = () => {
    if (!newExclusivityInput.trim()) return;
    if (mutuallyExclusive.includes(newExclusivityInput.trim())) {
      showToast("યોજના પહેલેથી સૂચિમાં છે (Already in exclusivity list)");
      return;
    }
    setMutuallyExclusive((prev) => [...prev, newExclusivityInput.trim()]);
    setNewExclusivityInput("");
    showToast("બાકાત યોજના ઉમેરાઈ (Exclusivity rule added)");
  };

  const handleRemoveExclusivity = (item: string) => {
    setMutuallyExclusive((prev) => prev.filter((s) => s !== item));
    showToast("બાકાત શરત દૂર કરી (Removed)");
  };

  const handleSaveDraft = () => {
    setSchemes((prev) =>
      prev.map((s) =>
        s.id === selectedSchemeId
          ? {
              ...s,
              nameGu: schemeName,
              code: schemeCode,
              incomeCeiling,
              startDate,
              endDate,
              mutuallyExclusive,
              allowedConcurrent,
              version: `v2026-27 ડ્રાફ્ટ (Draft - ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})`,
            }
          : s
      )
    );
    showToast("✓ યોજના ડ્રાફ્ટ સફળતાપૂર્વક સાચવવામાં આવ્યો છે! (Draft saved successfully)");
  };

  const handlePublish = () => {
    setSchemes((prev) =>
      prev.map((s) =>
        s.id === selectedSchemeId
          ? {
              ...s,
              nameGu: schemeName,
              code: schemeCode,
              status: "approved",
              statusTextGu: "મંજૂર (સક્રિય)",
              statusTextEn: "Active Approved",
              version: "v2026-27 પ્રકાશિત (Published Live)",
            }
          : s
      )
    );
    showToast("🚀 યોજના નિયમો સફળતાપૂર્વક રાજ્ય પોર્ટલ પર લાઈવ પ્રકાશિત થયા! (Published to Gujarat Scholarship Engine)");
  };

  const handleRunBacktest = () => {
    setIsBacktesting(true);
    setBacktestCompleted(false);
    setTimeout(() => {
      setIsBacktesting(false);
      setBacktestCompleted(true);
      showToast("✓ ૨૦૨૪-૨૫ શૈક્ષણિક વર્ષના ડેટા સાથે ૯૯.૨% સફળ બેકટેસ્ટ પરિણામ! (99.2% historical match)");
    }, 1200);
  };

  const workflowSteps = [
    { num: 1, gu: "૧. પાયાની વિગતો", en: "1. Basics", subGu: "પૂર્ણ", subEn: "Completed", done: true },
    { num: 2, gu: "૨. પાત્રતા નિયમો", en: "2. Eligibility Rules", subGu: "સક્રિય", subEn: "Active", active: true },
    { num: 3, gu: "૩. જરૂરી દસ્તાવેજો", en: "3. Documents", subGu: "ચકાસણી", subEn: "Verification" },
    { num: 4, gu: "૪. ચુકવણી માળખું", en: "4. Payout & DBT", subGu: "શેડ્યૂલ", subEn: "Schedule" },
    { num: 5, gu: "૫. બજેટ ફાળવણી", en: "5. Budget Allocation", subGu: "નાણાકીય", subEn: "Financials" },
    { num: 6, gu: "૬. સમીક્ષા અને મંજૂરી", en: "6. Preview & Publish", subGu: "ચકાસણી", subEn: "Approval" },
  ];

  return (
    <OfficerShell role="admin">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 animate-fade-in bg-on-surface text-surface-container-lowest px-4 py-3 rounded-xl shadow-level-3 flex items-center gap-3 border border-outline/20">
          <Icon name="check_circle" size={20} className="text-secondary" />
          <span className="font-label-md text-label-md">{toastMessage}</span>
        </div>
      )}

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Top Policy Header & Metadata Bar */}
        <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-5 sm:p-6 flex flex-col gap-5">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-md text-label-md font-semibold">
                  <T gu="શિક્ષણ વિભાગ, ગુજરાત સરકાર" en="Education Department, Govt of Gujarat" hi="शिक्षा विभाग, गुजरात सरकार" />
                </span>
                <span className="text-outline text-caption">•</span>
                <span className="font-caption text-caption text-on-surface-variant font-medium">
                  <T gu={`સંદર્ભ: ${departmentRef}`} en={`Ref: ${departmentRef}`} hi={`संदर्भ: ${departmentRef}`} />
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight flex items-center gap-3 flex-wrap">
                <T gu="યોજના નિયમ નિર્માતા" en="Scheme Policy & Rule Builder" hi="योजना नियम निर्माता" />
                <span className="text-primary font-normal text-headline-sm">
                  (Policy Engine AY 2026-27)
                </span>
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                <T
                  gu="શૈક્ષણિક સત્ર ૨૦૨૬-૨૭ માટે નવી શિષ્યવૃત્તિ રચના અને આપોઆપ પાત્રતા અલ્ગોરિધમ સેટઅપ"
                  en="Scholarship policy formulation & automated eligibility algorithm setup for Academic Year 2026-27"
                  hi="शैक्षणिक सत्र 2026-27 के लिए छात्रवृत्ति नीति निर्माण और स्वचालित पात्रता एल्गोरिदम सेटअप"
                />
              </p>
            </div>

            {/* Action Cluster */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="h-11 px-4 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-primary font-label-lg text-label-lg transition-colors flex items-center gap-2 border border-outline-variant"
              >
                <Icon name="save" size={20} className="text-primary" />
                <span>
                  <T gu="ડ્રાફ્ટ સાચવો (Save Draft)" en="Save Draft" hi="ड्राफ्ट सहेजें" />
                </span>
              </button>
              <button
                type="button"
                onClick={handlePublish}
                className="btn-cta flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <Icon name="verified" size={20} className="text-on-secondary" />
                <span>
                  <T gu="પ્રકાશિત કરો (Publish Scheme Rule)" en="Publish Scheme Rule" hi="योजना नियम प्रकाशित करें" />
                </span>
              </button>
            </div>
          </div>

          {/* Scheme Spec Identification Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-outline-variant">
            <div className="bg-surface-container-low rounded-lg p-3 flex flex-col justify-center">
              <span className="font-caption text-caption text-on-surface-variant font-medium">
                <T gu="યોજના નામ (Scheme Name)" en="Scheme Name" hi="योजना का नाम" />
              </span>
              <span className="font-title-md text-title-md text-on-surface truncate font-semibold">
                {schemeName}
              </span>
            </div>

            <div className="bg-surface-container-low rounded-lg p-3 flex flex-col justify-center">
              <span className="font-caption text-caption text-on-surface-variant font-medium">
                <T gu="સ્કીમ કોડ (Unique Identifier)" en="Scheme Identifier Code" hi="योजना कोड" />
              </span>
              <div className="flex items-center gap-2">
                <span className="font-title-md text-title-md text-primary font-bold">{schemeCode}</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-tertiary font-label-md text-label-md">
                  Active Registry
                </span>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-lg p-3 flex flex-col justify-center">
              <span className="font-caption text-caption text-on-surface-variant font-medium">
                <T gu="વર્ઝન ઇતિહાસ (Version Revision)" en="Version Revision" hi="संस्करण इतिहास" />
              </span>
              <div className="flex items-center gap-2">
                <span className="font-label-lg text-label-lg text-on-surface font-semibold">v2026-27 ડ્રાફ્ટ (Draft)</span>
                <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
              </div>
            </div>

            <div className="bg-surface-container-low rounded-lg p-3 flex flex-col justify-center">
              <span className="font-caption text-caption text-on-surface-variant font-medium">
                <T gu="રાજ્ય સ્થિતિ (State Approval)" en="State Approval Status" hi="राज्य स्वीकृति स्थिति" />
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="px-3 py-0.5 rounded-full bg-amber-100 text-amber-800 font-label-md text-label-md inline-flex items-center gap-1.5 font-semibold">
                  <Icon name="pending" size={16} />
                  <T gu="સમીક્ષા હેઠળ (Under Review)" en="Under Review" hi="समीक्षाधीन" />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Multi-Step State Workflow Stepper */}
        <nav aria-label="Workflow Steps" className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-3 overflow-x-auto">
          <div className="flex items-center min-w-[860px] justify-between gap-2">
            {workflowSteps.map((st, idx) => {
              const isSelected = activeStep === st.num;
              return (
                <React.Fragment key={st.num}>
                  <button
                    type="button"
                    onClick={() => setActiveStep(st.num)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${
                      isSelected
                        ? "bg-primary-container text-on-primary shadow-sm"
                        : st.done
                        ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                        : "text-on-surface-variant hover:bg-surface-container-low"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-label-md text-label-md font-bold shrink-0 ${
                        isSelected
                          ? "bg-on-primary text-primary"
                          : st.done
                          ? "bg-emerald-600 text-on-primary"
                          : "bg-surface-container text-outline"
                      }`}
                    >
                      {st.done ? <Icon name="check" size={18} /> : st.num}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md font-bold leading-tight">
                        <T gu={st.gu} en={st.en} hi={st.en} />
                      </span>
                      <span
                        className={`font-caption text-caption leading-tight ${
                          isSelected
                            ? "text-on-primary-container"
                            : st.done
                            ? "text-emerald-700"
                            : "text-outline"
                        }`}
                      >
                        <T gu={st.subGu} en={st.subEn} hi={st.subEn} />
                      </span>
                    </div>
                  </button>
                  {idx < workflowSteps.length - 1 && (
                    <span className="text-outline-variant font-bold px-1 select-none">→</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </nav>

        {/* Master-Detail Grid: Left Schemes Panel (w-80) vs Right Builder & Simulator Area */}
        <div className="flex flex-col 2xl:flex-row gap-6 items-start">
          {/* LEFT SIDEBAR: Active Schemes List Panel */}
          <aside className="w-full 2xl:w-80 shrink-0 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <Icon name="folder_special" size={20} className="text-primary" />
                <h2 className="font-title-md text-title-md text-on-surface font-bold">
                  <T gu="યોજના યાદી" en="Schemes Registry" hi="योजना सूची" />
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-caption text-caption font-semibold">
                {schemes.length}
              </span>
            </div>

            {/* Add New Scheme Button */}
            <button
              type="button"
              onClick={handleAddNewScheme}
              className="w-full h-10 px-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Icon name="add_circle" size={18} />
              <span>
                <T gu="+ નવી યોજના ઉમેરો" en="+ Add New Scheme" hi="+ नई योजना जोड़ें" />
              </span>
            </button>

            {/* Scheme Search Input */}
            <div className="relative flex items-center">
              <Icon name="search" size={18} className="absolute left-3 text-outline" />
              <input
                type="text"
                value={schemeSearch}
                onChange={(e) => setSchemeSearch(e.target.value)}
                placeholder="Search schemes..."
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary border border-transparent focus:border-outline-variant"
              />
              {schemeSearch && (
                <button
                  type="button"
                  onClick={() => setSchemeSearch("")}
                  className="absolute right-2 text-outline hover:text-on-surface"
                >
                  <Icon name="close" size={16} />
                </button>
              )}
            </div>

            {/* Scheme List Items */}
            <div className="flex flex-col gap-2 max-h-[700px] overflow-y-auto pr-1">
              {filteredSchemes.map((item) => {
                const isSelected = item.id === selectedSchemeId;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectScheme(item)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? "bg-primary-container/10 border-primary shadow-sm ring-1 ring-primary/20"
                        : "bg-surface-container-lowest border-outline-variant hover:bg-surface-container-low"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-caption text-caption font-mono font-bold text-primary">
                        {item.code}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-caption text-caption font-semibold ${
                          item.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        <T gu={item.statusTextGu} en={item.statusTextEn} hi={item.statusTextEn} />
                      </span>
                    </div>

                    <h3 className="font-label-lg text-label-lg text-on-surface font-semibold line-clamp-2 leading-tight">
                      <T gu={item.nameGu} en={item.nameEn} hi={item.nameHi} />
                    </h3>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-outline-variant text-caption font-caption text-on-surface-variant">
                      <span>
                        <T gu={item.targetGu} en={item.targetEn} hi={item.targetEn} />
                      </span>
                      <span className="font-semibold text-secondary">{item.amount}</span>
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectScheme(item);
                        }}
                        className={`px-2.5 py-1 rounded text-caption font-caption font-semibold flex items-center gap-1 transition-colors ${
                          isSelected
                            ? "bg-primary text-on-primary"
                            : "bg-surface-container-low hover:bg-surface-container text-on-surface"
                        }`}
                      >
                        <Icon name="tune" size={14} />
                        <T gu="સંપાદન" en="Edit" hi="संपादन" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredSchemes.length === 0 && (
                <div className="p-4 text-center text-outline font-body-sm text-body-sm">
                  <T gu="કોઈ યોજના મળી નથી" en="No schemes found" hi="कोई योजना नहीं मिली" />
                </div>
              )}
            </div>
          </aside>

          {/* MAIN WORKSPACE: Visual Rule Builder (7 cols) + Live Simulator Desk (5 cols) */}
          <div className="flex-1 w-full min-w-0 flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT COLUMN: Visual Rule Builder & Form Fields (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                {/* Policy Identification & Target Group Form Card */}
                <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-5 sm:p-6 flex flex-col gap-5">
                  <div className="flex items-center gap-2 pb-2 border-b border-outline-variant">
                    <Icon name="edit_document" size={22} className="text-primary" />
                    <div>
                      <h2 className="font-title-lg text-title-lg text-on-surface font-bold">
                        <T gu="યોજના મૂળ વિગતો અને લક્ષિત જૂથ" en="Scheme Identity & Target Group" hi="योजना विवरण और लक्षित समूह" />
                      </h2>
                      <p className="font-caption text-caption text-on-surface-variant">
                        <T
                          gu="યોજનાનું નામ, શૈક્ષણિક ધોરણ, જાતિ અને કેટેગરી નિર્ધારિત કરો."
                          en="Define scheme name, grade span, gender, social category and benefit amount."
                          hi="योजना का नाम, कक्षा, लिंग और श्रेणी निर्धारित करें।"
                        />
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Scheme Name Input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between">
                        <span>
                          <T gu="યોજના નામ (Scheme Name):" en="Scheme Name:" hi="योजना का नाम:" />
                        </span>
                        <span className="font-caption text-caption text-primary">ગુજરાતી / English</span>
                      </label>
                      <input
                        type="text"
                        value={schemeName}
                        onChange={(e) => setSchemeName(e.target.value)}
                        className="input font-body-md"
                        placeholder="Enter scheme name..."
                      />
                    </div>

                    {/* Department Reference & Validity Period */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-md text-label-md text-on-surface font-semibold">
                          <T gu="સ્કીમ કોડ (Code):" en="Scheme Code:" hi="योजना कोड:" />
                        </label>
                        <input
                          type="text"
                          value={schemeCode}
                          onChange={(e) => setSchemeCode(e.target.value)}
                          className="h-10 px-3 rounded-lg border border-outline bg-surface-container-lowest font-mono font-bold text-primary text-sm focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-md text-label-md text-on-surface font-semibold">
                          <T gu="શરૂઆત તારીખ (Start):" en="Start Date:" hi="प्रारंभ तिथि:" />
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="h-10 px-3 rounded-lg border border-outline bg-surface-container-lowest text-sm focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-md text-label-md text-on-surface font-semibold">
                          <T gu="અંતિમ તારીખ (End):" en="End Date:" hi="समाप्ति तिथि:" />
                        </label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="h-10 px-3 rounded-lg border border-outline bg-surface-container-lowest text-sm focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Class Range Dropdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-md text-label-md text-on-surface font-semibold">
                          <T gu="શૈક્ષણિક ધોરણ શ્રેણી (Class Range):" en="Class Range:" hi="कक्षा श्रेणी:" />
                        </label>
                        <select
                          value={classRange}
                          onChange={(e) => setClassRange(e.target.value)}
                          className="h-11 px-3 rounded-lg border border-outline bg-surface-container-lowest text-body-md text-on-surface focus:outline-none focus:border-primary"
                        >
                          <option value="9-12">ધોરણ ૯ થી ૧૨ (Classes 9 to 12 - Secondary & Higher)</option>
                          <option value="1-8">ધોરણ ૧ થી ૮ (Classes 1 to 8 - Primary & Upper)</option>
                          <option value="9">ધોરણ ૯ (Class 9 Only - Cycle/Uniform)</option>
                          <option value="11-12">ધોરણ ૧૧ થી ૧૨ (Classes 11 to 12 - Higher Secondary)</option>
                          <option value="college">કોલેજ / ઉચ્ચ શિક્ષણ (College / Higher Ed)</option>
                          <option value="all">તમામ ધોરણ ૧ થી ૧૨ (All Classes 1 to 12)</option>
                        </select>
                      </div>

                      {/* Income Ceiling Input */}
                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between">
                          <span>
                            <T gu="વાર્ષિક કુટુંબ આવક મર્યાદા:" en="Annual Income Ceiling:" hi="वार्षिक आय सीमा:" />
                          </span>
                          <span className="font-caption text-caption text-secondary font-bold">
                            ₹ {incomeCeiling.toLocaleString("en-IN")}
                          </span>
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-on-surface-variant font-bold text-sm">₹</span>
                          <input
                            type="number"
                            step="10000"
                            value={incomeCeiling}
                            onChange={(e) => setIncomeCeiling(Number(e.target.value) || 0)}
                            className="w-full h-11 pl-8 pr-3 rounded-lg border border-outline bg-surface-container-lowest text-body-md text-on-surface focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Gender Checkboxes */}
                    <div className="flex flex-col gap-1.5 pt-1">
                      <label className="font-label-md text-label-md text-on-surface font-semibold">
                        <T gu="લક્ષિત જાતિ / લિંગ (Target Gender):" en="Target Gender:" hi="लक्षित लिंग:" />
                      </label>
                      <div className="flex items-center gap-4 flex-wrap">
                        <label className="flex items-center gap-2 cursor-pointer bg-surface-container-low px-3 py-2 rounded-lg hover:bg-surface-container-high transition-colors">
                          <input
                            type="checkbox"
                            checked={gender.includes("female")}
                            onChange={() => handleToggleGender("female")}
                            className="w-4 h-4 text-primary rounded"
                          />
                          <span className="font-body-sm text-body-sm text-on-surface font-semibold">
                            <T gu="કન્યા (Female)" en="Female" hi="छात्रा (महिला)" />
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer bg-surface-container-low px-3 py-2 rounded-lg hover:bg-surface-container-high transition-colors">
                          <input
                            type="checkbox"
                            checked={gender.includes("male")}
                            onChange={() => handleToggleGender("male")}
                            className="w-4 h-4 text-primary rounded"
                          />
                          <span className="font-body-sm text-body-sm text-on-surface font-semibold">
                            <T gu="કુમાર (Male)" en="Male" hi="छात्र (पुरुष)" />
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer bg-surface-container-low px-3 py-2 rounded-lg hover:bg-surface-container-high transition-colors">
                          <input
                            type="checkbox"
                            checked={gender.includes("other")}
                            onChange={() => handleToggleGender("other")}
                            className="w-4 h-4 text-primary rounded"
                          />
                          <span className="font-body-sm text-body-sm text-on-surface font-semibold">
                            <T gu="અન્ય / તમામ (All / Transgender)" en="All / Transgender" hi="अन्य / सभी" />
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Category Checkboxes */}
                    <div className="flex flex-col gap-1.5 pt-1">
                      <label className="font-label-md text-label-md text-on-surface font-semibold">
                        <T gu="સામાજિક કેટેગરી (Social Category):" en="Social Category:" hi="सामाजिक श्रेणी:" />
                      </label>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        {["SC", "ST", "OBC", "General", "EWS"].map((cat) => {
                          const isChecked = categories.includes(cat);
                          return (
                            <label
                              key={cat}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold cursor-pointer transition-colors ${
                                isChecked
                                  ? "bg-primary-container text-on-primary border-primary"
                                  : "bg-surface-container-low text-on-surface-variant border-outline-variant hover:bg-surface-container-high"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleCategory(cat)}
                                className="sr-only"
                              />
                              <span>{cat}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Grade-wise Annual Benefit Breakdown */}
                    <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant">
                      <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between">
                        <span>
                          <T
                            gu="વાર્ષિક સહાય રકમ (ધોરણવાર વાર્ષિક રકમ):"
                            en="Annual Benefit Amount (Grade-wise):"
                            hi="वार्षिक सहायता राशि (कक्षावार):"
                          />
                        </span>
                        <span className="font-caption text-caption text-emerald-700 font-bold">
                          Direct Benefit Transfer (DBT)
                        </span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <div className="bg-surface-container-low p-2.5 rounded-lg border border-outline-variant flex flex-col">
                          <span className="font-caption text-caption text-on-surface-variant">ધોરણ ૯ (Class 9)</span>
                          <span className="font-title-md text-title-md text-primary font-bold">
                            ₹ {benefitAmounts.class9?.toLocaleString("en-IN") || "10,000"}
                          </span>
                        </div>
                        <div className="bg-surface-container-low p-2.5 rounded-lg border border-outline-variant flex flex-col">
                          <span className="font-caption text-caption text-on-surface-variant">ધોરણ ૧૦ (Class 10)</span>
                          <span className="font-title-md text-title-md text-primary font-bold">
                            ₹ {benefitAmounts.class10?.toLocaleString("en-IN") || "10,000"}
                          </span>
                        </div>
                        <div className="bg-surface-container-low p-2.5 rounded-lg border border-outline-variant flex flex-col">
                          <span className="font-caption text-caption text-on-surface-variant">ધોરણ ૧૧ (Class 11)</span>
                          <span className="font-title-md text-title-md text-primary font-bold">
                            ₹ {benefitAmounts.class11?.toLocaleString("en-IN") || "15,000"}
                          </span>
                        </div>
                        <div className="bg-surface-container-low p-2.5 rounded-lg border border-outline-variant flex flex-col">
                          <span className="font-caption text-caption text-on-surface-variant">ધોરણ ૧૨ (Class 12)</span>
                          <span className="font-title-md text-title-md text-primary font-bold">
                            ₹ {benefitAmounts.class12?.toLocaleString("en-IN") || "15,000"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Core Eligibility Conditions Builder (From Stitch HTML) */}
                <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-5 sm:p-6 flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Icon name="account_tree" size={22} className="text-primary" />
                        <h2 className="font-title-lg text-title-lg text-on-surface font-bold">
                          <T gu="મુખ્ય પાત્રતા માપદંડ" en="Core Eligibility Conditions" hi="मुख्य पात्रता मानदंड" />
                        </h2>
                      </div>
                      <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                        <T
                          gu="રૂલ એન્જિન UDISE+, આધાર અને સ્કોલરશિપ પોર્ટલ પર આપોઆપ ચકાસણી કરશે."
                          en="The rule engine will automatically verify via UDISE+, Aadhaar, and scholarship registries."
                          hi="रूल इंजन UDISE+, आधार और छात्रवृत्ति पोर्टल पर स्वचालित सत्यापन करेगा।"
                        />
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-md text-label-md self-start sm:self-auto font-bold">
                      {conditions.length} <T gu="સક્રિય નિયમો" en="Active Conditions" hi="सक्रिय नियम" />
                    </span>
                  </div>

                  {/* Logic Operator Switcher (AND vs OR) */}
                  <div className="bg-surface-container-low rounded-lg p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-outline-variant">
                    <div className="flex items-center gap-2">
                      <Icon name="hub" size={20} className="text-secondary" />
                      <span className="font-label-md text-label-md text-on-surface font-semibold">
                        <T gu="તાર્કિક શરત કનેક્ટર:" en="Logical Evaluator:" hi="तार्किक शर्त संयोजक:" />
                      </span>
                    </div>
                    <div className="inline-flex rounded-lg bg-surface-container-highest p-1 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setLogicConnector("ALL")}
                        className={`px-3 py-1.5 rounded font-label-md text-label-md font-bold transition-all ${
                          logicConnector === "ALL"
                            ? "bg-primary-container text-on-primary shadow-sm"
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        <T gu="તમામ નિયમોનું પાલન (ALL - AND)" en="ALL Rules (AND)" hi="सभी नियम अनिवार्य (AND)" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setLogicConnector("ANY")}
                        className={`px-3 py-1.5 rounded font-label-md text-label-md font-bold transition-all ${
                          logicConnector === "ANY"
                            ? "bg-primary-container text-on-primary shadow-sm"
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        <T gu="કોઈપણ એક (ANY - OR)" en="ANY Rule (OR)" hi="कोई एक नियम (OR)" />
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Visual Condition Rows */}
                  <div className="flex flex-col gap-3 pt-1">
                    {conditions.map((cond, idx) => {
                      const isFirst = idx === 0;
                      const isLast = idx === conditions.length - 1;
                      return (
                        <div
                          key={cond.id}
                          className="bg-surface-container-low rounded-xl p-4 border border-outline-variant shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-primary/40 transition-colors"
                        >
                          {/* Connector & Attribute */}
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-2.5 py-1 rounded font-label-md text-label-md font-bold ${
                                isFirst
                                  ? "bg-primary text-on-primary"
                                  : logicConnector === "ALL"
                                  ? "bg-primary-container text-on-primary"
                                  : "bg-secondary text-on-secondary"
                              }`}
                            >
                              {isFirst ? "IF" : logicConnector}
                            </span>
                            <div className="flex flex-col">
                              <span className="font-caption text-caption text-on-surface-variant font-medium">
                                <T gu="ક્ષેત્ર (Attribute)" en="Attribute" hi="क्षेत्र" />
                              </span>
                              <span className="font-title-md text-title-md text-on-surface font-bold">
                                <T gu={cond.attributeLabelGu} en={cond.attributeLabelEn} hi={cond.attributeLabelHi} />
                              </span>
                            </div>
                          </div>

                          {/* Operator & Value Badge */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-1 rounded bg-surface-container-highest text-tertiary font-label-md text-label-md font-semibold">
                              <T gu={cond.operatorLabelGu} en={cond.operatorLabelEn} hi={cond.operatorLabelEn} />
                            </span>
                            <Icon name="arrow_right_alt" size={18} className="text-outline" />
                            <div className="flex flex-col">
                              <span
                                className={`px-3 py-1 rounded-lg ${cond.badgeBg} ${cond.badgeText} font-label-lg text-label-lg font-bold shadow-sm`}
                              >
                                <T gu={cond.valueBadgeGu} en={cond.valueBadgeEn} hi={cond.valueBadgeEn} />
                              </span>
                              {cond.noteGu && (
                                <span className="font-caption text-caption text-on-surface-variant text-right mt-0.5">
                                  <T gu={cond.noteGu} en={cond.noteEn || ""} hi={cond.noteEn || ""} />
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Row Actions */}
                          <div className="flex items-center gap-2 justify-end">
                            <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-caption text-caption font-bold">
                              {isLast ? "END" : logicConnector}
                            </span>
                            <button
                              type="button"
                              onClick={() => showToast(`સંપાદન નિયમ: ${cond.attributeLabelEn}`)}
                              className="w-8 h-8 rounded-lg hover:bg-surface-container-high flex items-center justify-center text-outline hover:text-on-surface transition-colors"
                              title="Tune rule parameters"
                            >
                              <Icon name="tune" size={18} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveCondition(cond.id)}
                              className="w-8 h-8 rounded-lg hover:bg-error-container flex items-center justify-center text-outline hover:text-error transition-colors"
                              title="Remove condition"
                            >
                              <Icon name="delete" size={18} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Condition Buttons Controller */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handleAddCondition}
                      className="h-10 px-4 rounded-lg bg-surface-container-high hover:bg-surface-container text-primary font-label-md text-label-md font-bold flex items-center gap-2 transition-colors border border-outline-variant"
                    >
                      <Icon name="add_circle" size={18} className="text-primary" />
                      <span>
                        <T gu="+ નવો નિયમ ઉમેરો" en="+ Add New Condition Rule" hi="+ नया नियम जोड़ें" />
                      </span>
                    </button>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-caption text-caption text-on-surface-variant font-semibold">
                        <T gu="ઝડપી ફિલ્ડ્સ:" en="Quick Fields:" hi="त्वरित फ़ील्ड:" />
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddQuickCondition("marks")}
                        className="px-2.5 py-1 rounded bg-surface-container-low hover:bg-surface-container-highest text-on-surface-variant font-caption text-caption border border-outline-variant"
                      >
                        <T gu="+ ગુણ % (Marks)" en="+ Marks %" hi="+ अंक %" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddQuickCondition("caste")}
                        className="px-2.5 py-1 rounded bg-surface-container-low hover:bg-surface-container-highest text-on-surface-variant font-caption text-caption border border-outline-variant"
                      >
                        <T gu="+ સામાજિક જાતિ (Caste)" en="+ Social Caste" hi="+ जाति" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddQuickCondition("domicile")}
                        className="px-2.5 py-1 rounded bg-surface-container-low hover:bg-surface-container-highest text-on-surface-variant font-caption text-caption border border-outline-variant"
                      >
                        <T gu="+ ગુજરાત વતની (Domicile)" en="+ Domicile" hi="+ मूल निवासी" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddQuickCondition("pwd")}
                        className="px-2.5 py-1 rounded bg-surface-container-low hover:bg-surface-container-highest text-on-surface-variant font-caption text-caption border border-outline-variant"
                      >
                        <T gu="+ દિવ્યાંગતા દરજ્જો (PwD)" en="+ Disability (PwD)" hi="+ दिव्यांगता" />
                      </button>
                    </div>
                  </div>
                </section>

                {/* Exclusivity & Stacking Policy Box (From Stitch HTML) */}
                <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-5 sm:p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Icon name="policy" size={22} className="text-secondary" />
                    <div>
                      <h3 className="font-title-md text-title-md text-on-surface font-bold">
                        <T
                          gu="વિશિષ્ટ શરતો અને પ્રતિબંધો (Mutually-Exclusive & Stacking Rules)"
                          en="Mutually-Exclusive & Stacking Rules"
                          hi="परस्पर अनन्य और स्टैकिंग नियम"
                        />
                      </h3>
                      <p className="font-caption text-caption text-on-surface-variant">
                        <T
                          gu="ડુપ્લિકેશન અને ડબલ બેનિફિટ અટકાવવા માટે નિયમો નક્કી કરો."
                          en="Define exclusivity constraints to prevent duplication and overlapping benefit disbursement."
                          hi="दोहरे लाभ और डुप्लिकेशन को रोकने के लिए प्रतिबंध निर्धारित करें।"
                        />
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Mutually Exclusive Group (Disallowed Stack) */}
                    <div className="p-4 rounded-xl bg-error-container/30 border border-error/20 flex flex-col gap-2.5">
                      <span className="font-label-md text-label-md text-error font-bold flex items-center gap-1.5">
                        <Icon name="cancel" size={18} />
                        <T
                          gu="આ યોજના સાથે જોડી ન શકાય (Disallowed Stack)"
                          en="Disallowed Stack (Mutually Exclusive)"
                          hi="इस योजना के साथ मान्य नहीं"
                        />
                      </span>

                      <div className="flex flex-wrap gap-2">
                        {mutuallyExclusive.map((sch) => (
                          <span
                            key={sch}
                            className="px-2.5 py-1 rounded-full bg-surface-container-lowest text-error font-label-md text-label-md flex items-center gap-1.5 shadow-sm border border-error/20"
                          >
                            <span className="truncate max-w-[220px]">{sch}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveExclusivity(sch)}
                              className="hover:text-on-surface"
                            >
                              <Icon name="close" size={14} />
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Add Exclusivity Scheme Input */}
                      <div className="flex items-center gap-2 mt-1">
                        <select
                          value={newExclusivityInput}
                          onChange={(e) => setNewExclusivityInput(e.target.value)}
                          className="flex-1 h-9 px-2 text-caption rounded border border-outline bg-surface-container-lowest text-on-surface focus:outline-none"
                        >
                          <option value="">+ બાકાત યોજના પસંદ કરો...</option>
                          <option value="ડૉ. આંબેડકર મેટ્રિકોત્તર શિષ્યવૃત્તિ">ડૉ. આંબેડકર મેટ્રિકોત્તર શિષ્યવૃત્તિ</option>
                          <option value="મુખ્યમંત્રી યુવા સ્વાવલંબન યોજના (MYSY)">મુખ્યમંત્રી યુવા સ્વાવલંબન યોજના (MYSY)</option>
                          <option value="વિદેશ અભ્યાસ લોન સહાય">વિદેશ અભ્યાસ લોન સહાય</option>
                          <option value="કેટેગરી છાત્રાલય નિર્વાહ ભથ્થું">કેટેગરી છાત્રાલય નિર્વાહ ભથ્થું</option>
                        </select>
                        <button
                          type="button"
                          onClick={handleAddExclusivity}
                          className="px-3 h-9 rounded bg-error text-on-error text-caption font-bold hover:opacity-90"
                        >
                          + ઉમેરો
                        </button>
                      </div>

                      <span className="font-caption text-caption text-on-surface-variant">
                        <T
                          gu="જો વિદ્યાર્થી આ યોજનાઓ મેળવે છે, તો સિસ્ટમ બ્લોક કરશે."
                          en="If the student receives these schemes, DBT engine will automatically block application."
                          hi="यदि छात्र को ये योजनाएं मिलती हैं, तो सिस्टम आवेदन ब्लॉक करेगा।"
                        />
                      </span>
                    </div>

                    {/* Allowed Stacking Group */}
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col gap-2.5">
                      <span className="font-label-md text-label-md text-emerald-800 font-bold flex items-center gap-1.5">
                        <Icon name="check_circle" size={18} />
                        <T
                          gu="માન્ય જોડાણ (Allowed Concurrent Stack)"
                          en="Allowed Concurrent Stack"
                          hi="मान्य सह-योजनाएं"
                        />
                      </span>

                      <div className="flex flex-wrap gap-2">
                        {allowedConcurrent.map((sch) => (
                          <span
                            key={sch}
                            className="px-2.5 py-1 rounded-full bg-surface-container-lowest text-emerald-800 font-label-md text-label-md flex items-center gap-1.5 shadow-sm border border-emerald-200"
                          >
                            <Icon name="done" size={14} className="text-emerald-600" />
                            <span>{sch}</span>
                          </span>
                        ))}
                      </div>

                      <span className="font-caption text-caption text-emerald-900 mt-auto">
                        <T
                          gu="સાધન સહાય હોવાથી બંને લાભ એકસાથે મળવાપાત્ર રહેશે."
                          en="Being in-kind assistive equipment, concurrent benefit entitlement is permitted."
                          hi="उपकरण सहायता होने के कारण दोनों लाभ एक साथ मान्य रहेंगे।"
                        />
                      </span>
                    </div>
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN: Live Simulator Desk & Statewide Impact (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* Instant Live Test Engine Card */}
                <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-5 sm:p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
                    <div className="flex items-center gap-2">
                      <Icon name="science" size={22} className="text-primary" />
                      <h2 className="font-title-lg text-title-lg text-on-surface font-bold">
                        <T gu="લાઈવ ટેસ્ટિંગ ડેસ્ક" en="Live Simulator Desk" hi="लाइव टेस्टिंग डेस्क" />
                      </h2>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-caption text-caption font-bold">
                      Simulated Sandbox
                    </span>
                  </div>

                  {/* Student Selector Dropdown Simulation */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md text-on-surface font-semibold">
                      <T
                        gu="વિદ્યાર્થી પ્રોફાઇલ પસંદ કરો (Select Sample Student):"
                        en="Select Sample Student:"
                        hi="नमूना छात्र प्रोफ़ाइल चुनें:"
                      />
                    </label>

                    <div className="relative">
                      <select
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                        className="w-full h-14 pl-12 pr-10 rounded-xl bg-surface-container-low border border-outline-variant text-on-surface font-label-lg text-label-lg font-bold appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        {SAMPLE_STUDENTS.map((st) => (
                          <option key={st.id} value={st.id}>
                            {st.nameGu} ({st.gradeGu}) • CTS: {st.ctsId}
                          </option>
                        ))}
                      </select>
                      <div className="absolute left-3 top-2.5 pointer-events-none">
                        <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs">
                          {activeStudent.initials}
                        </div>
                      </div>
                      <Icon
                        name="expand_more"
                        size={22}
                        className="absolute right-3 top-4 text-outline pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Verdict Banner */}
                  <div
                    className={`rounded-xl p-4 flex items-center justify-between shadow-md transition-all ${
                      simulationResults.isOverallEligible
                        ? "bg-emerald-600 text-on-primary"
                        : "bg-red-600 text-on-primary"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <Icon
                          name={simulationResults.isOverallEligible ? "verified" : "cancel"}
                          size={26}
                          className="text-white"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-headline-sm font-bold tracking-tight">
                          {simulationResults.isOverallEligible ? (
                            <T gu="પાત્ર છે ✓ (ELIGIBLE)" en="ELIGIBLE ✓" hi="पात्र है ✓" />
                          ) : (
                            <T gu="અપાત્ર ✗ (INELIGIBLE)" en="INELIGIBLE ✗" hi="अपात्र ✗" />
                          )}
                        </span>
                        <span className="font-caption text-caption text-white/90">
                          {simulationResults.isOverallEligible ? (
                            <T
                              gu="નિયમ એન્જિન ૧૦૦% શરતોને પ્રમાણિત કરે છે"
                              en="Rule engine validates all eligibility criteria successfully"
                              hi="रूल इंजन सभी पात्रता मानदंडों को प्रमाणित करता है"
                            />
                          ) : (
                            <T
                              gu="અમુક શરતો પરિપૂર્ણ થતી નથી"
                              en="One or more eligibility criteria failed verification"
                              hi="कुछ पात्रता शर्तें पूरी नहीं हुईं"
                            />
                          )}
                        </span>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white text-on-surface font-label-md text-label-md font-bold shrink-0">
                      Passed {simulationResults.passedCount}/{simulationResults.totalCount}
                    </span>
                  </div>

                  {/* Live Rule Checklist Verification */}
                  <div className="flex flex-col gap-2 bg-surface-container-low rounded-xl p-4 border border-outline-variant">
                    <span className="font-label-md text-label-md text-on-surface font-bold">
                      <T
                        gu={`${activeStudent.nameGu} માટે શરત ચકાસણી સારાંશ:`}
                        en={`Rule evaluation summary for ${activeStudent.nameEn}:`}
                        hi={`सत्यापन सारांश:`}
                      />
                    </span>

                    {simulationResults.checks.map((chk, idx) => (
                      <div
                        key={chk.id}
                        className={`flex items-center justify-between py-2 ${
                          idx < simulationResults.checks.length - 1 ? "border-b border-surface-container-high" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <Icon
                            name={chk.passed ? "check_circle" : "cancel"}
                            size={18}
                            className={chk.passed ? "text-emerald-600 shrink-0" : "text-error shrink-0"}
                          />
                          <span className="font-body-sm text-body-sm text-on-surface truncate">
                            <T gu={chk.labelGu} en={chk.labelEn} hi={chk.labelEn} />
                          </span>
                        </div>
                        <span
                          className={`font-label-md text-label-md font-semibold shrink-0 ${
                            chk.passed ? "text-emerald-700" : "text-error"
                          }`}
                        >
                          <T gu={chk.detailGu} en={chk.detailEn} hi={chk.detailEn} />
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Projected Payout Tile */}
                  <div className="p-4 rounded-xl bg-primary-container text-on-primary flex items-center justify-between shadow-sm">
                    <div className="flex flex-col">
                      <span className="font-caption text-caption text-on-primary-container font-medium">
                        <T
                          gu="વિદ્યાર્થી દીઠ અંદાજિત સહાય (Projected Annual Benefit)"
                          en="Projected Annual Benefit per Student"
                          hi="प्रति छात्र अनुमानित वार्षिक सहायता"
                        />
                      </span>
                      <span className="font-headline-sm text-headline-sm font-bold">
                        <T
                          gu="વાર્ષિક મળવાપાત્ર રકમ: ₹ ૧૨,૫૦૦"
                          en="Annual Entitlement: ₹ 12,500"
                          hi="वार्षिक देय राशि: ₹ 12,500"
                        />
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-on-primary/20 text-on-primary font-label-md text-label-md font-semibold shrink-0">
                      DBT મારફતે
                    </span>
                  </div>
                </section>

                {/* Statewide Impact & Coverage Simulation Card (From Stitch HTML) */}
                <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-5 sm:p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
                    <div className="flex items-center gap-2">
                      <Icon name="bar_chart" size={22} className="text-secondary" />
                      <h3 className="font-title-md text-title-md text-on-surface font-bold">
                        <T
                          gu="રાજ્યવ્યાપી અસર અને બજેટ અંદાજ"
                          en="Statewide Impact & Budget Estimate"
                          hi="राज्यव्यापी प्रभाव और बजट अनुमान"
                        />
                      </h3>
                    </div>
                    <span className="font-caption text-caption text-on-surface-variant font-medium">
                      UDISE+ Live Match
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant flex flex-col">
                      <span className="font-caption text-caption text-on-surface-variant font-medium">
                        <T gu="કુલ અંદાજિત પાત્ર વિદ્યાર્થીઓ" en="Estimated Eligible Students" hi="अनुमानित पात्र छात्र" />
                      </span>
                      <span className="font-headline-md text-headline-md text-primary font-bold tracking-tight">
                        ૯,૪૨,૮૦૦
                      </span>
                      <span className="font-caption text-caption text-emerald-700 font-semibold">
                        <T gu="વિદ્યાર્થીનીઓ કવરેજ" en="Statewide Female Coverage" hi="छात्राओं का कवरेज" />
                      </span>
                    </div>

                    <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant flex flex-col">
                      <span className="font-caption text-caption text-on-surface-variant font-medium">
                        <T gu="જરૂરી બજેટ અંદાજ" en="Annual Budget Outlay" hi="वार्षिक बजट परिव्यय" />
                      </span>
                      <span className="font-headline-md text-headline-md text-secondary font-bold tracking-tight">
                        ₹ ૪૮૫.૨ કરોડ
                      </span>
                      <span className="font-caption text-caption text-on-surface-variant">
                        <T gu="વાર્ષિક નાણાકીય બોજ" en="Annual State Financial Burden" hi="वार्षिक वित्तीय भार" />
                      </span>
                    </div>
                  </div>

                  {/* Grade Distribution Chart Simulation */}
                  <div className="flex flex-col gap-2 pt-1">
                    <div className="flex justify-between items-center text-caption font-caption text-on-surface-variant">
                      <span>
                        <T
                          gu="ધોરણ ૯ થી ૧૨ સંભવિત વહેંચણી (Grade Split):"
                          en="Grade-wise Eligible Split (9 to 12):"
                          hi="कक्षावार अनुमानित विभाजन:"
                        />
                      </span>
                      <span className="font-bold text-on-surface">૯૮.૭% ડેટા ઉપલબ્ધ</span>
                    </div>

                    {/* Stacked Bar Representation */}
                    <div className="h-3.5 w-full rounded-full bg-surface-container-highest overflow-hidden flex shadow-inner">
                      <div className="h-full bg-primary" style={{ width: "28%" }} title="ધોરણ ૯: ૨૮%" />
                      <div className="h-full bg-primary-container" style={{ width: "26%" }} title="ધોરણ ૧૦: ૨૬%" />
                      <div className="h-full bg-tertiary" style={{ width: "24%" }} title="ધોરણ ૧૧: ૨૪%" />
                      <div className="h-full bg-secondary" style={{ width: "22%" }} title="ધોરણ ૧૨: ૨૨%" />
                    </div>

                    <div className="grid grid-cols-4 gap-1 text-center font-caption text-caption text-on-surface-variant pt-1">
                      <div>ધોરણ ૯ (૨૮%)</div>
                      <div>ધોરણ ૧૦ (૨૬%)</div>
                      <div>ધોરણ ૧૧ (૨૪%)</div>
                      <div>ધોરણ ૧૨ (૨૨%)</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant flex items-center justify-between text-caption font-caption text-on-surface-variant">
                    <span className="flex items-center gap-1.5">
                      <Icon name="sync" size={16} className="text-primary" />
                      <T
                        gu="લાસ્ટ રન અલ્ગોરિધમ: ૧૪ મિનિટ પહેલાં"
                        en="Last algorithm run: 14 mins ago"
                        hi="अंतिम रन: 14 मिनट पहले"
                      />
                    </span>
                    <span className="font-bold text-primary">
                      <T gu="ઓટો-વેલિડેટેડ" en="Auto-Validated" hi="स्वचालित सत्यापित" />
                    </span>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Administrative Navigation & Audit Bar (From Stitch HTML) */}
        <footer className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-on-surface-variant font-caption text-caption flex-wrap">
            <Icon name="fingerprint" size={18} className="text-tertiary" />
            <span>
              <T gu="નિયમ અલ્ગોરિધમ હેશ (Algorithm Checksum):" en="Algorithm Hash:" hi="एल्गोरिदम हैश:" />
            </span>
            <code className="px-2 py-0.5 rounded bg-surface-container font-mono font-bold text-on-surface text-xs">
              SHA256-ED-RULE-8841B
            </code>
            {backtestCompleted && (
              <span className="text-emerald-700 font-semibold ml-2">✓ Backtested 2024-25</span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
            <button
              type="button"
              disabled={isBacktesting}
              onClick={handleRunBacktest}
              className="h-10 px-4 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md font-semibold transition-colors flex items-center gap-2 border border-outline-variant disabled:opacity-50"
            >
              <Icon name="history" size={18} className={isBacktesting ? "animate-spin" : ""} />
              <span>
                {isBacktesting ? (
                  <T gu="ચકાસણી ચાલુ છે..." en="Running Backtest..." hi="बैकटेस्ट चल रहा है..." />
                ) : (
                  <T
                    gu="નિયમ બેકટેસ્ટ કરો (Run Historical Backtest 2024-25)"
                    en="Run Historical Backtest (2024-25)"
                    hi="ऐतिहासिक बैकटेस्ट चलाएं (2024-25)"
                  />
                )}
              </span>
            </button>

            <Link
              href="/admin"
              className="h-10 px-5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-bold transition-all shadow-md flex items-center gap-2"
            >
              <span>
                <T
                  gu="આગળ વધો: દસ્તાવેજ સુયોજન (Next: Documents Setup)"
                  en="Next: Documents Setup"
                  hi="आगे बढ़ें: दस्तावेज़ सेटअप"
                />
              </span>
              <Icon name="arrow_forward" size={18} />
            </Link>
          </div>
        </footer>
      </div>
    </OfficerShell>
  );
}
