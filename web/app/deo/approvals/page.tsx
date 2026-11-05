"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { StatusChip, Avatar } from "@/components/ui";
import { useAppStore } from "@/lib/store";

interface Application {
  id: string;
  studentName: string;
  studentNameGu: string;
  gender: "female" | "male";
  std: string;
  ctsId: string;
  schoolName: string;
  schoolNameGu: string;
  udise: string;
  taluka: string;
  talukaGu: string;
  schoolType: "Govt" | "Grant-in-Aid" | "Model";
  scheme: string;
  schemeId: string;
  schemeGu: string;
  amount: number;
  daysPending: number;
  status: "pending" | "approved" | "rejected" | "inprogress";
  tpeoStatus: "required" | "cleared" | "not_required";
  autoMatchPercent: number;
  riskScore: number;
  attendancePercent: number;
  incomeVerified: boolean;
  incomeAmount: number;
  bankSeeded: boolean;
  bankName: string;
  principalCertified: boolean;
  principalName: string;
}

const INITIAL_APPLICATIONS: Application[] = [
  {
    id: "APP-GJ-2026-004512",
    studentName: "Riya Hasmukhbhai Patel",
    studentNameGu: "રિયા હસમુખભાઈ પટેલ",
    gender: "female",
    std: "Std 9-B",
    ctsId: "GJ-AND-2026-004512",
    schoolName: "Shree Sardar Patel High School, Anand",
    schoolNameGu: "શ્રી સરદાર પટેલ હાઈસ્કૂલ, આણંદ",
    udise: "24150104502",
    taluka: "Anand",
    talukaGu: "આણંદ",
    schoolType: "Govt",
    scheme: "Namo Lakshmi Yojana",
    schemeId: "namo-lakshmi",
    schemeGu: "નમો લક્ષ્મી યોજના",
    amount: 5000,
    daysPending: 2,
    status: "pending",
    tpeoStatus: "not_required",
    autoMatchPercent: 100,
    riskScore: 0.2,
    attendancePercent: 84.2,
    incomeVerified: true,
    incomeAmount: 120000,
    bankSeeded: true,
    bankName: "State Bank of India (SBI)",
    principalCertified: true,
    principalName: "M. K. Vyas",
  },
  {
    id: "APP-GJ-2026-003891",
    studentName: "Harshil Maheshbhai Prajapati",
    studentNameGu: "હર્ષિલ મહેશભાઈ પ્રજાપતિ",
    gender: "male",
    std: "Std 10-A",
    ctsId: "GJ-AND-2026-003891",
    schoolName: "Vinay Mandir High School, Khambhat",
    schoolNameGu: "વિનય મંદિર હાઈસ્કૂલ, ખંભાત",
    udise: "24150302101",
    taluka: "Khambhat",
    talukaGu: "ખંભાત",
    schoolType: "Grant-in-Aid",
    scheme: "Gyan Sadhna Scholarship",
    schemeId: "gyan-sadhna",
    schemeGu: "જ્ઞાન સાધના શિષ્યવૃત્તિ",
    amount: 12500,
    daysPending: 6,
    status: "pending",
    tpeoStatus: "required",
    autoMatchPercent: 100,
    riskScore: 0.5,
    attendancePercent: 88.0,
    incomeVerified: true,
    incomeAmount: 95000,
    bankSeeded: true,
    bankName: "Bank of Baroda",
    principalCertified: true,
    principalName: "R. S. Rathod",
  },
  {
    id: "APP-GJ-2026-008124",
    studentName: "Pooja Vinodbhai Solanki",
    studentNameGu: "પૂજા વિનોદભાઈ સોલંકી",
    gender: "female",
    std: "Std 9-Kanya",
    ctsId: "GJ-AND-2026-008124",
    schoolName: "Janta Vidyalaya, Tarapur",
    schoolNameGu: "જનતા વિદ્યાલય, તારાપુર",
    udise: "24150801402",
    taluka: "Tarapur",
    talukaGu: "તારાપુર",
    schoolType: "Govt",
    scheme: "Saraswati Sadhna Yojana",
    schemeId: "saraswati-sadhna",
    schemeGu: "સરસ્વતી સાધના યોજના",
    amount: 4500,
    daysPending: 1,
    status: "approved",
    tpeoStatus: "not_required",
    autoMatchPercent: 100,
    riskScore: 0.1,
    attendancePercent: 91.5,
    incomeVerified: true,
    incomeAmount: 65000,
    bankSeeded: true,
    bankName: "Dena Gujarat Gramin Bank",
    principalCertified: true,
    principalName: "K. L. Dave",
  },
  {
    id: "APP-GJ-2026-006233",
    studentName: "Kishan Rameshbhai Parmar",
    studentNameGu: "કિશન રમેશભાઈ પરમાર",
    gender: "male",
    std: "Std 11-Arts",
    ctsId: "GJ-AND-2026-006233",
    schoolName: "Sarvajanik High School, Anklav",
    schoolNameGu: "સાર્વજનિક હાઈસ્કૂલ, આંકલાવ",
    udise: "24150600801",
    taluka: "Anklav",
    talukaGu: "આંકલાવ",
    schoolType: "Grant-in-Aid",
    scheme: "Post-Matric SEBC/OBC Scholarship",
    schemeId: "sebc-obc",
    schemeGu: "ઓબીસી/SEBC પોસ્ટ-મેટ્રિક શિષ્યવૃત્તિ",
    amount: 15000,
    daysPending: 9,
    status: "pending",
    tpeoStatus: "required",
    autoMatchPercent: 100,
    riskScore: 1.1,
    attendancePercent: 76.4,
    incomeVerified: true,
    incomeAmount: 110000,
    bankSeeded: true,
    bankName: "State Bank of India (SBI)",
    principalCertified: true,
    principalName: "J. N. Bhatt",
  },
  {
    id: "APP-GJ-2026-001099",
    studentName: "Disha Bharatbhai Joshi",
    studentNameGu: "દિશા ભરતભાઈ જોષી",
    gender: "female",
    std: "Std 11-Science",
    ctsId: "GJ-AND-2026-001099",
    schoolName: "Shri Vallabh Kanya Vidyalaya, Borsad",
    schoolNameGu: "શ્રી વલ્લભ કન્યા વિદ્યાલય, બોરસદ",
    udise: "24150201905",
    taluka: "Borsad",
    talukaGu: "બોરસદ",
    schoolType: "Model",
    scheme: "Namo Lakshmi Yojana",
    schemeId: "namo-lakshmi",
    schemeGu: "નમો લક્ષ્મી યોજના",
    amount: 10000,
    daysPending: 4,
    status: "pending",
    tpeoStatus: "not_required",
    autoMatchPercent: 100,
    riskScore: 0.3,
    attendancePercent: 94.0,
    incomeVerified: true,
    incomeAmount: 80000,
    bankSeeded: true,
    bankName: "HDFC Bank",
    principalCertified: true,
    principalName: "P. V. Sharma",
  },
  {
    id: "APP-GJ-2026-009411",
    studentName: "Amit Dilipbhai Vaghela",
    studentNameGu: "અમિત દિલીપભાઈ વાઘેલા",
    gender: "male",
    std: "Std 10-B",
    ctsId: "GJ-AND-2026-009411",
    schoolName: "Model School, Umreth",
    schoolNameGu: "મોડેલ સ્કૂલ, ઉમરેઠ",
    udise: "24150501102",
    taluka: "Umreth",
    talukaGu: "ઉમરેઠ",
    schoolType: "Model",
    scheme: "Gyan Sadhna Scholarship",
    schemeId: "gyan-sadhna",
    schemeGu: "જ્ઞાન સાધના શિષ્યવૃત્તિ",
    amount: 6000,
    daysPending: 3,
    status: "approved",
    tpeoStatus: "not_required",
    autoMatchPercent: 100,
    riskScore: 0.4,
    attendancePercent: 83.1,
    incomeVerified: true,
    incomeAmount: 72000,
    bankSeeded: true,
    bankName: "Bank of India",
    principalCertified: true,
    principalName: "S. M. Patel",
  },
  {
    id: "APP-GJ-2026-007722",
    studentName: "Bhavik Pravinbhai Makwana",
    studentNameGu: "ભાવિક પ્રવિણભાઈ મકવાણા",
    gender: "male",
    std: "Std 12-Commerce",
    ctsId: "GJ-AND-2026-007722",
    schoolName: "R.K. High School, Petlad",
    schoolNameGu: "આર.કે. હાઈસ્કૂલ, પેટલાદ",
    udise: "24150403301",
    taluka: "Petlad",
    talukaGu: "પેટલાદ",
    schoolType: "Grant-in-Aid",
    scheme: "Post-Matric SC/ST Scholarship",
    schemeId: "sc-st",
    schemeGu: "એસસી/એસટી પોસ્ટ-મેટ્રિક શિષ્યવૃત્તિ",
    amount: 18000,
    daysPending: 14,
    status: "inprogress",
    tpeoStatus: "cleared",
    autoMatchPercent: 98,
    riskScore: 0.8,
    attendancePercent: 81.2,
    incomeVerified: true,
    incomeAmount: 140000,
    bankSeeded: true,
    bankName: "Union Bank of India",
    principalCertified: true,
    principalName: "T. B. Solanki",
  },
  {
    id: "APP-GJ-2026-005118",
    studentName: "Meera Arvindbhai Desai",
    studentNameGu: "મીરા અરવિંદભાઈ દેસાઈ",
    gender: "female",
    std: "Std 9-A",
    ctsId: "GJ-AND-2026-005118",
    schoolName: "Sharda Mandir Girls High School, Sojitra",
    schoolNameGu: "શારદા મંદિર કન્યા હાઇસ્કૂલ, સોજિત્રા",
    udise: "24150700504",
    taluka: "Sojitra",
    talukaGu: "સોજિત્રા",
    schoolType: "Grant-in-Aid",
    scheme: "Namo Lakshmi Yojana",
    schemeId: "namo-lakshmi",
    schemeGu: "નમો લક્ષ્મી યોજના",
    amount: 5000,
    daysPending: 5,
    status: "pending",
    tpeoStatus: "not_required",
    autoMatchPercent: 100,
    riskScore: 0.2,
    attendancePercent: 87.5,
    incomeVerified: true,
    incomeAmount: 90000,
    bankSeeded: true,
    bankName: "Axis Bank",
    principalCertified: true,
    principalName: "G. R. Pandya",
  },
  {
    id: "APP-GJ-2026-002341",
    studentName: "Parth Nareshbhai Dabhi",
    studentNameGu: "પાર્થ નરેશભાઈ ડાભી",
    gender: "male",
    std: "Std 9-C",
    ctsId: "GJ-AND-2026-002341",
    schoolName: "Govt High School, Borsad",
    schoolNameGu: "સરકારી હાઈસ્કૂલ, બોરસદ",
    udise: "24150204101",
    taluka: "Borsad",
    talukaGu: "બોરસદ",
    schoolType: "Govt",
    scheme: "Saraswati Sadhna Yojana",
    schemeId: "saraswati-sadhna",
    schemeGu: "સરસ્વતી સાધના યોજના",
    amount: 3500,
    daysPending: 7,
    status: "rejected",
    tpeoStatus: "not_required",
    autoMatchPercent: 72,
    riskScore: 4.8,
    attendancePercent: 58.0,
    incomeVerified: false,
    incomeAmount: 180000,
    bankSeeded: true,
    bankName: "Bank of Baroda",
    principalCertified: true,
    principalName: "D. K. Chauhan",
  },
  {
    id: "APP-GJ-2026-001928",
    studentName: "Neha Sureshbhai Baria",
    studentNameGu: "નેહા સુરેશભાઈ બારિયા",
    gender: "female",
    std: "Std 10-B",
    ctsId: "GJ-AND-2026-001928",
    schoolName: "B.M. High School, Anand",
    schoolNameGu: "બી.એમ. હાઈસ્કૂલ, આણંદ",
    udise: "24150106202",
    taluka: "Anand",
    talukaGu: "આણંદ",
    schoolType: "Govt",
    scheme: "Namo Lakshmi Yojana",
    schemeId: "namo-lakshmi",
    schemeGu: "નમો લક્ષ્મી યોજના",
    amount: 5000,
    daysPending: 2,
    status: "pending",
    tpeoStatus: "not_required",
    autoMatchPercent: 100,
    riskScore: 0.1,
    attendancePercent: 89.2,
    incomeVerified: true,
    incomeAmount: 75000,
    bankSeeded: true,
    bankName: "Kotak Mahindra Bank",
    principalCertified: true,
    principalName: "N. C. Shukla",
  },
];

export default function BulkApprovalsPage() {
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    INITIAL_APPLICATIONS.filter((a) => a.status === "pending").map((a) => a.id)
  );
  const [activeInspectionId, setActiveInspectionId] = useState<string>(
    INITIAL_APPLICATIONS[0].id
  );
  const [activeTab, setActiveTab] = useState<"auto" | "manual" | "returned">("auto");
  const [searchQuery, setSearchQuery] = useState("");
  const [schemeFilter, setSchemeFilter] = useState("all");
  const [talukaFilter, setTalukaFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [daysPendingFilter, setDaysPendingFilter] = useState("all");
  const [isSamplingActive, setIsSamplingActive] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [isDscModalOpen, setIsDscModalOpen] = useState(false);
  const [dscPin, setDscPin] = useState("849201");
  const [isSigning, setIsSigning] = useState(false);
  const { addDeoApproved, showSuccess, showInfo } = useAppStore();

  const showToast = showInfo;

  // Filtered applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Tab filter
      if (activeTab === "auto" && app.status === "rejected") return false;
      if (activeTab === "manual" && app.tpeoStatus !== "required") return false;
      if (activeTab === "returned" && app.status !== "rejected") return false;

      // Scheme filter
      if (schemeFilter !== "all" && app.schemeId !== schemeFilter) return false;

      // Taluka filter
      if (talukaFilter !== "all" && app.taluka.toLowerCase() !== talukaFilter.toLowerCase())
        return false;

      // Status filter
      if (statusFilter !== "all" && app.status !== statusFilter) return false;

      // Days pending filter
      if (daysPendingFilter === "3" && app.daysPending <= 3) return false;
      if (daysPendingFilter === "7" && app.daysPending <= 7) return false;
      if (daysPendingFilter === "14" && app.daysPending <= 14) return false;

      // Search Query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesName =
          app.studentName.toLowerCase().includes(query) ||
          app.studentNameGu.includes(query);
        const matchesSchool =
          app.schoolName.toLowerCase().includes(query) ||
          app.schoolNameGu.includes(query);
        const matchesUdise = app.udise.includes(query);
        const matchesCts = app.ctsId.toLowerCase().includes(query);
        if (!matchesName && !matchesSchool && !matchesUdise && !matchesCts) {
          return false;
        }
      }

      return true;
    });
  }, [
    applications,
    activeTab,
    schemeFilter,
    talukaFilter,
    statusFilter,
    daysPendingFilter,
    searchQuery,
  ]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage) || 1;
  const paginatedApplications = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredApplications.slice(start, start + itemsPerPage);
  }, [filteredApplications, currentPage, itemsPerPage]);

  // Selection statistics
  const selectedApplications = useMemo(
    () => applications.filter((app) => selectedIds.includes(app.id)),
    [applications, selectedIds]
  );

  const selectedTotalAmount = useMemo(
    () => selectedApplications.reduce((acc, curr) => acc + curr.amount, 0),
    [selectedApplications]
  );

  const selectedTpeoCount = useMemo(
    () =>
      selectedApplications.filter(
        (app) => app.amount > 10000 && app.tpeoStatus === "required"
      ).length,
    [selectedApplications]
  );

  const isAllPageSelected =
    paginatedApplications.length > 0 &&
    paginatedApplications.every((app) => selectedIds.includes(app.id));

  const handleToggleSelectAll = () => {
    if (isAllPageSelected) {
      const pageIds = new Set(paginatedApplications.map((a) => a.id));
      setSelectedIds((prev) => prev.filter((id) => !pageIds.has(id)));
    } else {
      const newSelected = new Set(selectedIds);
      paginatedApplications.forEach((a) => newSelected.add(a.id));
      setSelectedIds(Array.from(newSelected));
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Inspect currently selected application
  const activeInspection = useMemo(() => {
    return (
      applications.find((app) => app.id === activeInspectionId) || applications[0]
    );
  }, [applications, activeInspectionId]);

  // Actions
  const handleBulkApprove = () => {
    if (selectedIds.length === 0) {
      showToast("મંજૂરી માટે કૃપા કરીને ઓછામાં ઓછી એક અરજી પસંદ કરો.");
      return;
    }
    setIsDscModalOpen(true);
  };

  const handleConfirmDscSign = () => {
    setIsSigning(true);
    setTimeout(() => {
      selectedIds.forEach((id) => addDeoApproved(id));
      setApplications((prev) =>
        prev.map((app) =>
          selectedIds.includes(app.id) ? { ...app, status: "approved" } : app
        )
      );
      setIsSigning(false);
      setIsDscModalOpen(false);
      showSuccess(`સફળ: ${selectedIds.length} અરજીઓ DSC મંજૂર! DBT PFMS ફાઇલ ગાંધીનગર મોકલાઈ. / ${selectedIds.length} apps approved via DSC.`
      );
      setSelectedIds([]);
    }, 1500);
  };

  const handleBulkReject = () => {
    if (selectedIds.length === 0) return;
    setApplications((prev) =>
      prev.map((app) =>
        selectedIds.includes(app.id) ? { ...app, status: "rejected" } : app
      )
    );
    showToast(`${selectedIds.length} અરજીઓ અસ્વીકૃત કરવામાં આવી છે.`);
  };

  const handleBulkRequestInfo = () => {
    if (selectedIds.length === 0) return;
    setApplications((prev) =>
      prev.map((app) =>
        selectedIds.includes(app.id) ? { ...app, status: "inprogress" } : app
      )
    );
    showToast(
      `${selectedIds.length} અરજીઓ માટે શાળાના આચાર્યને સ્પષ્ટતા માટે વિનંતી મોકલાઈ છે.`
    );
  };

  const handleRouteToTPEO = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? { ...app, tpeoStatus: "cleared", status: "inprogress" }
          : app
      )
    );
    showToast(
      `અરજી ${appId} (₹10,000 થી વધુ) પૂર્વ મંજૂરી માટે સંબંધિત તાલુકા શિક્ષણ અધિકારી (TPEO) ને ફોરવર્ડ કરાઈ છે.`
    );
  };

  const handleRouteSelectedToTPEO = () => {
    const tpeoEligibleIds = selectedApplications
      .filter((app) => app.amount > 10000 && app.tpeoStatus === "required")
      .map((app) => app.id);

    if (tpeoEligibleIds.length === 0) {
      showToast("પસંદ કરેલ અરજીઓમાં ₹10,000 થી વધુની કોઈ TPEO બાકી અરજી નથી.");
      return;
    }

    setApplications((prev) =>
      prev.map((app) =>
        tpeoEligibleIds.includes(app.id)
          ? { ...app, tpeoStatus: "cleared", status: "inprogress" }
          : app
      )
    );
    showToast(
      `${tpeoEligibleIds.length} અરજીઓ TPEO પૂર્વ-મંજૂરી માટે તાલુકા કક્ષાએ મોકલાઈ છે.`
    );
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSchemeFilter("all");
    setTalukaFilter("all");
    setStatusFilter("all");
    setDaysPendingFilter("all");
    setCurrentPage(1);
    showToast("બધા ફિલ્ટર્સ રીસેટ કરવામાં આવ્યા છે.");
  };

  return (
    <OfficerShell role="deo">
      {/* Toast handled globally by ToastContainer in layout */}

      <div className="max-w-[1440px] w-full mx-auto px-6 py-6 space-y-6">
        {/* 1. Breadcrumbs & Title Section */}
        <div className="flex flex-col gap-1.5">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2">
            <Link
              href="/deo"
              className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary font-label-md text-label-md transition-colors"
            >
              <Icon name="apartment" size={16} />
              <span>
                <T
                  gu="જિલ્લા કચેરી (District HQ)"
                  en="District HQ"
                  hi="जिला मुख्यालय"
                />
              </span>
            </Link>
            <span className="text-outline font-caption text-caption">/</span>
            <span className="text-primary font-label-md text-label-md font-bold">
              <T
                gu="જથ્થાબંધ મંજૂરી ડેસ્ક (Bulk Approvals & DSC Desk)"
                en="Bulk Approvals & DSC Desk"
                hi="थोक अनुमोदन व डीएससी डेस्क"
              />
            </span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-1">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                  <T
                    gu="જિલ્લા સ્તરીય જથ્થાબંધ મંજૂરી અને ડિજિટલ હસ્તાક્ષર"
                    en="District Bulk Sanctions & Digital Signatures"
                    hi="जिला स्तरीय थोक अनुमोदन एवं डिजिटल हस्ताक्षर"
                  />
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest text-primary font-label-md text-label-md font-bold">
                  Bulk Sanction Desk
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                <T
                  gu="નિયમ આધારિત ચકાસાયેલ અરજીઓની સામૂહિક સમીક્ષા, સેમ્પલિંગ ઓડિટ અને DSC ઈ-સાઇનિંગ | આણંદ જિલ્લો (DEO Anand Jurisdiction - Cycle 2025-26)"
                  en="Automated rule-checked batch review, sampling audit, and DSC e-signing | Anand District (DEO Anand - Cycle 2025-26)"
                  hi="नियम आधारित सत्यापित आवेदनों की सामूहिक समीक्षा, नमूना ऑडिट व डीएससी हस्ताक्षर | आणंद जिला"
                />
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-low text-on-surface font-label-md text-label-md shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
                <span className="text-on-surface font-semibold">DSC Token:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Icon name="verified_user" size={16} className="text-emerald-600" />
                  <T gu="સક્રિય (Dongle Active)" en="Dongle Active" hi="डोंगल सक्रिय" />
                </span>
              </div>
              <Link
                href="/admin/audit"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-lowest text-on-surface font-label-md text-label-md shadow-sm hover:bg-surface-container-high transition-colors border border-outline-variant/40"
              >
                <Icon name="history" size={18} />
                <span>
                  <T gu="ઓડિટ લોગ્સ" en="Audit Logs" hi="ऑडिट लॉग" />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* 2. High-Impact Approval Banner / Master Metric Bar */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary-container to-tertiary text-on-primary p-6 shadow-md">
          {/* Subtle Decorative SVG Overlay */}
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <svg height="240" viewBox="0 0 200 200" width="240" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" fill="none" r="80" stroke="currentColor" strokeDasharray="12 12" strokeWidth="4" />
              <path d="M100 30 L100 170 M30 100 L170 100" stroke="currentColor" strokeWidth="3" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            {/* Left Banner Metrics */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest/15 backdrop-blur-md flex items-center justify-center shrink-0">
                <Icon name="fact_check" size={32} className="text-on-primary" fill />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary font-label-md text-label-md font-bold tracking-wide">
                    <T
                      gu="તાત્કાલિક મંજૂરી માટે તૈયાર"
                      en="READY FOR SANCTION"
                      hi="मंजूरी के लिए तैयार"
                    />
                  </span>
                  <span className="text-on-primary-container font-caption text-caption">
                    <T
                      gu="બેચ ID: GJ-AND-BLK-2026-088"
                      en="Batch ID: GJ-AND-BLK-2026-088"
                      hi="बैच ID: GJ-AND-BLK-2026-088"
                    />
                  </span>
                </div>
                <div className="flex items-baseline gap-3 mt-1">
                  <h2 className="font-display text-display text-on-primary font-bold tracking-tight">
                    ૧,૨૪૦
                  </h2>
                  <span className="font-title-lg text-title-lg text-on-primary/90 font-medium">
                    <T gu="પાત્ર અરજીઓ" en="Eligible Applications" hi="पात्र आवेदन" />
                  </span>
                  <span className="text-on-primary/60 font-body-sm text-body-sm">|</span>
                  <span className="font-headline-sm text-headline-sm text-secondary-fixed font-bold">
                    ₹ ૩,૧૨,૫૦,૦૦૦
                  </span>
                  <span className="text-on-primary/80 font-body-sm text-body-sm">
                    (₹ 3.12 Cr DBT Funds)
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-primary-container mt-1">
                  <T
                    gu="આણંદના ૮ તાલુકાઓની તમામ નિયમ-આધારિત (Rule-Engine Passed) અને આચાર્ય-પ્રમાણિત અરજીઓ."
                    en="All automated rule-engine passed and principal-certified applications across 8 talukas of Anand."
                    hi="आणंद के 8 तालुकों के सभी नियम-सत्यापित और प्राचार्य-प्रमाणित आवेदन।"
                  />
                </p>
              </div>
            </div>

            {/* Right Side Interactive Controls & DSC Sign Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
              {/* Sampling Audit Switch */}
              <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-lowest/10 backdrop-blur-sm cursor-pointer hover:bg-surface-container-lowest/20 transition-all select-none">
                <input
                  type="checkbox"
                  checked={isSamplingActive}
                  onChange={(e) => {
                    setIsSamplingActive(e.target.checked);
                    showToast(
                      e.target.checked
                        ? "૫% રેન્ડમ સેમ્પલિંગ ઓડિટ સક્રિય કરવામાં આવ્યું છે."
                        : "સેમ્પલિંગ ઓડિટ બંધ કરવામાં આવ્યું છે."
                    );
                  }}
                  className="w-5 h-5 rounded accent-secondary cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-primary font-semibold leading-tight">
                    <T
                      gu="રેન્ડમ સેમ્પલિંગ ઓડિટ સક્રિય"
                      en="Random Sampling Audit"
                      hi="यादृच्छिक नमूना ऑडिट"
                    />
                  </span>
                  <span className="font-caption text-caption text-on-primary-container">
                    <T
                      gu="૫% પ્રતિનિધિ ચકાસણી (૬૨ પસંદિત)"
                      en="5% sample check (62 selected)"
                      hi="5% नमूना जांच (62 चयनित)"
                    />
                  </span>
                </div>
              </label>

              {/* Export Excel CTA */}
              <button
                type="button"
                onClick={() =>
                  showToast("બેચ ડેટા .xlsx એક્સેલ ફાઈલ સફળતાપૂર્વક ડાઉનલોડ થઈ રહી છે.")
                }
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-surface-container-lowest/20 text-on-primary hover:bg-surface-container-lowest/30 font-label-lg text-label-lg font-semibold transition-colors"
                title="Export current auto-passed batch to Excel"
              >
                <Icon name="table_view" size={20} />
                <span>
                  <T gu="બેચ નિકાસ (.xlsx)" en="Export (.xlsx)" hi="निर्यात (.xlsx)" />
                </span>
              </button>

              {/* Bulk Approve Primary Trigger Button */}
              <button
                type="button"
                onClick={handleBulkApprove}
                className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-secondary hover:bg-secondary/90 text-on-secondary transition-transform transform active:scale-95 shadow-lg font-title-md text-title-md font-bold"
              >
                <Icon name="draw" size={22} />
                <span>
                  <T
                    gu="૧,૨૪૦ અરજીઓ જથ્થાબંધ મંજૂર કરો"
                    en="Bulk Sanction All with DSC"
                    hi="सभी को थोक में डीएससी से स्वीकृत करें"
                  />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. Workflow Stage Tabs & District Health Metrics */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Main Workflow Tabs */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-surface-container-low shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab("auto")}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-label-lg text-label-lg font-bold transition-all ${
                  activeTab === "auto"
                    ? "bg-surface-container-lowest text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
              >
                <Icon name="verified" size={18} className="text-emerald-600" />
                <span>
                  <T
                    gu="આપોઆપ પાસ થયેલ (Auto-Passed)"
                    en="Auto-Passed"
                    hi="स्वचालित स्वीकृत"
                  />
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md font-bold">
                  ૧,૨૪૦
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("manual")}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-label-lg text-label-lg font-bold transition-all ${
                  activeTab === "manual"
                    ? "bg-surface-container-lowest text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
              >
                <Icon name="contact_support" size={18} className="text-amber-600" />
                <span>
                  <T
                    gu="મેન્યુઅલ સમીક્ષા / TPEO (> ₹10k)"
                    en="Manual Review / TPEO"
                    hi="समीक्षा / TPEO"
                  />
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md font-semibold">
                  ૧૪૨
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("returned")}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-label-lg text-label-lg font-bold transition-all ${
                  activeTab === "returned"
                    ? "bg-surface-container-lowest text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
              >
                <Icon name="assignment_return" size={18} className="text-error" />
                <span>
                  <T
                    gu="શાળા તરફથી પરત (Returned)"
                    en="Returned to School"
                    hi="स्कूल को वापस"
                  />
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md font-semibold">
                  ૩૮
                </span>
              </button>
            </div>

            {/* Metric Pills */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-lowest shadow-sm text-on-surface border border-outline-variant/30">
                <Icon name="currency_rupee" size={18} className="text-primary" />
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  <T gu="કુલ રકમ:" en="Total Sanction:" hi="कुल राशि:" />
                </span>
                <span className="font-label-lg text-label-lg font-bold text-primary">
                  ₹ ૩.૧૨ કરોડ
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-lowest shadow-sm text-on-surface border border-outline-variant/30">
                <Icon name="bolt" size={18} className="text-emerald-600" />
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  <T gu="ઓટો-પાસ રેટ:" en="Auto-Pass Rate:" hi="ऑटो-पास दर:" />
                </span>
                <span className="font-label-lg text-label-lg font-bold text-emerald-700">
                  ૯૨.૪%
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-lowest shadow-sm text-on-surface border border-outline-variant/30">
                <Icon name="fingerprint" size={18} className="text-primary" />
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  <T gu="આધાર સીડિંગ:" en="Aadhaar Seeding:" hi="आधार सीडिंग:" />
                </span>
                <span className="font-label-lg text-label-lg font-bold text-on-surface">
                  ૧૦૦% પૂર્ણ
                </span>
              </div>
            </div>
          </div>

          {/* 4. Filter Toolbar & Search Bar */}
          <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline">
                <Icon name="search" size={20} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="શાળા, વિદ્યાર્થીનું નામ, UDISE અથવા CTS ID શોધો..."
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all border border-transparent focus:border-primary"
              />
            </div>

            {/* Filter Selects */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Scheme Filter */}
              <div className="relative">
                <select
                  value={schemeFilter}
                  onChange={(e) => {
                    setSchemeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-11 pl-3 pr-8 rounded-xl bg-surface-container-low text-on-surface font-label-md text-label-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer border border-outline-variant/30"
                >
                  <option value="all">યોજના: તમામ યોજનાઓ (All Schemes)</option>
                  <option value="namo-lakshmi">નમો લક્ષ્મી યોજના (Namo Lakshmi)</option>
                  <option value="saraswati-sadhna">સરસ્વતી સાધના યોજના (Saraswati Sadhna)</option>
                  <option value="gyan-sadhna">જ્ઞાન સાધના શિષ્યવૃત્તિ (Gyan Sadhna)</option>
                  <option value="sebc-obc">ઓબીસી/SEBC પોસ્ટ-મેટ્રિક શિષ્યવૃત્તિ</option>
                  <option value="sc-st">એસસી/એસટી પોસ્ટ-મેટ્રિક શિષ્યવૃત્તિ</option>
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                  <Icon name="keyboard_arrow_down" size={18} />
                </span>
              </div>

              {/* Taluka Filter */}
              <div className="relative">
                <select
                  value={talukaFilter}
                  onChange={(e) => {
                    setTalukaFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-11 pl-3 pr-8 rounded-xl bg-surface-container-low text-on-surface font-label-md text-label-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer border border-outline-variant/30"
                >
                  <option value="all">તાલુકો: તમામ ૮ તાલુકા (Anand District)</option>
                  <option value="anand">આણંદ (Anand)</option>
                  <option value="khambhat">ખંભાત (Khambhat)</option>
                  <option value="tarapur">તારાપુર (Tarapur)</option>
                  <option value="anklav">આંકલાવ (Anklav)</option>
                  <option value="borsad">બોરસદ (Borsad)</option>
                  <option value="umreth">ઉમરેઠ (Umreth)</option>
                  <option value="petlad">પેટલાદ (Petlad)</option>
                  <option value="sojitra">સોજિત્રા (Sojitra)</option>
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                  <Icon name="keyboard_arrow_down" size={18} />
                </span>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-11 pl-3 pr-8 rounded-xl bg-surface-container-low text-on-surface font-label-md text-label-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer border border-outline-variant/30"
                >
                  <option value="all">સ્થિતિ: તમામ (All Status)</option>
                  <option value="pending">બાકી (Pending)</option>
                  <option value="approved">મંજૂર (Approved)</option>
                  <option value="inprogress">પ્રક્રિયા હેઠળ (In Progress)</option>
                  <option value="rejected">અસ્વીકૃત (Rejected)</option>
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                  <Icon name="keyboard_arrow_down" size={18} />
                </span>
              </div>

              {/* Days Pending Filter */}
              <div className="relative">
                <select
                  value={daysPendingFilter}
                  onChange={(e) => {
                    setDaysPendingFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-11 pl-3 pr-8 rounded-xl bg-surface-container-low text-on-surface font-label-md text-label-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer border border-outline-variant/30"
                >
                  <option value="all">બાકી દિવસો: તમામ (All Days)</option>
                  <option value="3">&gt; ૩ દિવસ બાકી (&gt; 3 Days)</option>
                  <option value="7">&gt; ૭ દિવસ બાકી (&gt; 7 Days)</option>
                  <option value="14">&gt; ૧૪ દિવસ બાકી (&gt; 14 Days)</option>
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                  <Icon name="keyboard_arrow_down" size={18} />
                </span>
              </div>

              {/* Reset Filters */}
              <button
                type="button"
                onClick={handleResetFilters}
                className="h-11 px-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center gap-1.5 transition-colors border border-outline-variant/30"
                title="રીસેટ ફિલ્ટર્સ"
              >
                <Icon name="restart_alt" size={18} />
                <span>
                  <T gu="રીસેટ" en="Reset" hi="रीसेट" />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 5. Sticky / Active Bulk Action Bar */}
        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-primary/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <div className="flex items-baseline gap-2">
              <span className="font-title-md text-title-md font-bold text-on-surface">
                {selectedIds.length}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                <T
                  gu="અરજીઓ પસંદિત"
                  en={`of ${applications.length} applications selected`}
                  hi={`कुल ${applications.length} में से चयनित`}
                />
              </span>
              <span className="text-outline">•</span>
              <span className="font-label-lg text-label-lg font-bold text-primary">
                ₹ {selectedTotalAmount.toLocaleString("en-IN")}
              </span>
            </div>

            {selectedTpeoCount > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-label-md text-xs font-bold flex items-center gap-1">
                <Icon name="warning" size={14} className="text-amber-700" />
                <T
                  gu={`${selectedTpeoCount} અરજીઓમાં TPEO પૂર્વ-મંજૂરી જરૂરી (> ₹10k)`}
                  en={`${selectedTpeoCount} high-value (> ₹10k) require TPEO routing`}
                  hi={`${selectedTpeoCount} आवेदनों में TPEO अनुमोदन आवश्यक`}
                />
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Route Selected to TPEO */}
            {selectedTpeoCount > 0 && (
              <button
                type="button"
                onClick={handleRouteSelectedToTPEO}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-label-md text-label-md font-bold shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Icon name="forward" size={16} />
                <span>
                  <T
                    gu={`TPEO ને મોકલો (${selectedTpeoCount})`}
                    en={`Route ${selectedTpeoCount} to TPEO`}
                    hi={`TPEO को भेजें (${selectedTpeoCount})`}
                  />
                </span>
              </button>
            )}

            {/* Request Info Button */}
            <button
              type="button"
              onClick={handleBulkRequestInfo}
              disabled={selectedIds.length === 0}
              className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <Icon name="help_outline" size={16} />
              <span>
                <T gu="માહિતી મંગાવો" en="Request Info" hi="जानकारी मांगें" />
              </span>
            </button>

            {/* Reject Selected Button */}
            <button
              type="button"
              onClick={handleBulkReject}
              disabled={selectedIds.length === 0}
              className="px-3.5 py-2 rounded-xl bg-error-container hover:bg-error/20 text-on-error-container font-label-md text-label-md font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <Icon name="cancel" size={16} />
              <span>
                <T gu="અસ્વીકાર કરો" en="Reject Selected" hi="अस्वीकृत करें" />
              </span>
            </button>

            {/* Bulk Approve Button */}
            <button
              type="button"
              onClick={handleBulkApprove}
              disabled={selectedIds.length === 0}
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-bold shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Icon name="draw" size={18} />
              <span>
                <T
                  gu="પસંદ કરેલ મંજૂર કરો"
                  en="Approve Selected (DSC)"
                  hi="चयनित स्वीकृत करें"
                />
              </span>
            </button>
          </div>
        </div>

        {/* 6. Bento Workspace: Data Grid (Left 8 Cols) + Inspection Drawer (Right 4 Cols) */}
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Left Panel: Table of Batches & Schools (8 Columns) */}
          <div className="col-span-12 xl:col-span-8 flex flex-col gap-4">
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
              {/* Master Checkbox Header Row */}
              <div className="p-4 bg-surface-container-low flex items-center justify-between gap-4 border-b border-outline-variant/20">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="masterSelectAll"
                    checked={isAllPageSelected}
                    onChange={handleToggleSelectAll}
                    className="w-5 h-5 rounded accent-primary cursor-pointer"
                  />
                  <label
                    htmlFor="masterSelectAll"
                    className="font-label-lg text-label-lg font-bold text-on-surface cursor-pointer select-none"
                  >
                    <T
                      gu={`આ પૃષ્ઠ પરની તમામ અરજીઓ પસંદ કરો (${paginatedApplications.length} અરજીઓ)`}
                      en={`Select all on this page (${paginatedApplications.length} applications)`}
                      hi={`इस पृष्ठ के सभी आवेदन चुनें (${paginatedApplications.length})`}
                    />
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-caption text-caption text-on-surface-variant">
                    <T
                      gu={`દર્શાવેલ: ${paginatedApplications.length} (કુલ ${filteredApplications.length})`}
                      en={`Showing: ${paginatedApplications.length} of ${filteredApplications.length}`}
                      hi={`दिखाया गया: ${paginatedApplications.length}`}
                    />
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-outline" />
                  <span className="font-caption text-caption text-emerald-700 font-semibold">
                    <T
                      gu="૧૦૦% સ્વીકૃત નિયમાવલિ"
                      en="Rule-Engine Compliant"
                      hi="नियम अनुपालित"
                    />
                  </span>
                </div>
              </div>

              {/* Applications Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container/60 text-on-surface-variant font-label-md text-label-md border-b border-outline-variant/20">
                      <th className="py-3.5 pl-4 pr-2 w-12 text-center">
                        <span className="sr-only">પસંદ કરો</span>
                      </th>
                      <th className="py-3.5 px-3">
                        <T
                          gu="વિદ્યાર્થી અને શાળા"
                          en="Student & School"
                          hi="छात्र व स्कूल"
                        />
                      </th>
                      <th className="py-3.5 px-3">
                        <T gu="યોજના" en="Scheme" hi="योजना" />
                      </th>
                      <th className="py-3.5 px-3 text-right">
                        <T gu="મંજૂર રકમ" en="Amount" hi="राशि" />
                      </th>
                      <th className="py-3.5 px-3 text-center">
                        <T gu="બાકી દિવસ" en="Pending" hi="लंबित दिन" />
                      </th>
                      <th className="py-3.5 px-3 text-center">
                        <T gu="સ્થિતિ" en="Status" hi="स्थिति" />
                      </th>
                      <th className="py-3.5 px-3 text-center">
                        <T
                          gu="ચકાસણી / TPEO"
                          en="TPEO / Audit"
                          hi="सत्यापन / TPEO"
                        />
                      </th>
                      <th className="py-3.5 pr-4 pl-2 text-right">
                        <T gu="કાર્ય" en="Action" hi="क्रिया" />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container text-body-sm font-body-sm text-on-surface">
                    {paginatedApplications.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-on-surface-variant">
                          <Icon name="search_off" size={36} className="mx-auto mb-2 text-outline" />
                          <p className="font-title-md text-title-md font-semibold text-on-surface">
                            કોઈ અરજી મળી નથી
                          </p>
                          <p className="font-body-sm text-body-sm mt-1">
                            તમારા ફિલ્ટર અથવા શોધ માપદંડ બદલો.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      paginatedApplications.map((app) => {
                        const isSelected = selectedIds.includes(app.id);
                        const isInspected = activeInspectionId === app.id;
                        const isHighValue = app.amount > 10000;

                        return (
                          <tr
                            key={app.id}
                            onClick={() => setActiveInspectionId(app.id)}
                            className={`transition-colors cursor-pointer group ${
                              isInspected
                                ? "bg-primary/5 hover:bg-primary/10"
                                : "hover:bg-surface-container/60"
                            }`}
                          >
                            {/* Row Checkbox */}
                            <td
                              className="py-4 pl-4 pr-2 text-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleRow(app.id)}
                                className="w-4 h-4 rounded accent-primary cursor-pointer"
                              />
                            </td>

                            {/* Student and School Info */}
                            <td className="py-4 px-3">
                              <div className="flex items-start gap-3">
                                <Avatar name={app.studentName} size="sm" className="mt-0.5" />
                                <div className="flex flex-col min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-title-sm text-title-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                                      {app.studentNameGu}
                                    </span>
                                    <span className="text-on-surface-variant text-xs">
                                      ({app.gender === "female" ? "કન્યા" : "કુમાર"} - {app.std})
                                    </span>
                                  </div>
                                  <p className="text-on-surface-variant text-xs truncate mt-0.5">
                                    {app.schoolNameGu}
                                  </p>
                                  <div className="flex items-center gap-2 mt-0.5 text-on-surface-variant font-caption text-[11px]">
                                    <span>UDISE: {app.udise}</span>
                                    <span>•</span>
                                    <span>તાલુકો: {app.talukaGu}</span>
                                    <span>•</span>
                                    <span className="text-emerald-700 font-medium">આચાર્ય પ્રમાણિત ✓</span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Scheme Badge */}
                            <td className="py-4 px-3">
                              <span className="inline-block px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-caption text-caption font-medium">
                                {app.schemeGu}
                              </span>
                            </td>

                            {/* Amount */}
                            <td className="py-4 px-3 text-right whitespace-nowrap">
                              <span className="font-label-lg text-label-lg font-bold text-on-surface">
                                ₹ {app.amount.toLocaleString("en-IN")}
                              </span>
                              {isHighValue && (
                                <span className="block font-caption text-[10px] text-amber-700 font-bold uppercase">
                                  &gt; ₹10k Threshold
                                </span>
                              )}
                            </td>

                            {/* Days Pending */}
                            <td className="py-4 px-3 text-center whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 rounded font-caption text-caption font-bold ${
                                  app.daysPending > 7
                                    ? "bg-error-container text-on-error-container"
                                    : app.daysPending > 3
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-surface-container-high text-on-surface"
                                }`}
                              >
                                {app.daysPending} દિવસ
                              </span>
                            </td>

                            {/* Status Chip */}
                            <td className="py-4 px-3 text-center whitespace-nowrap">
                              <StatusChip
                                status={app.status}
                                label={
                                  app.status === "approved" ? (
                                    <T gu="મંજૂર" en="Approved" hi="स्वीकृत" />
                                  ) : app.status === "rejected" ? (
                                    <T gu="અસ્વીકૃત" en="Rejected" hi="अस्वीकृत" />
                                  ) : app.status === "inprogress" ? (
                                    <T gu="પ્રક્રિયામાં" en="In Progress" hi="प्रगति में" />
                                  ) : (
                                    <T gu="બાકી" en="Pending" hi="लंबित" />
                                  )
                                }
                              />
                            </td>

                            {/* TPEO / Audit column */}
                            <td className="py-4 px-3 text-center whitespace-nowrap">
                              {isHighValue ? (
                                app.tpeoStatus === "cleared" ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-label-md text-xs font-bold">
                                    <Icon name="check_circle" size={14} className="text-emerald-700" />
                                    TPEO Cleared
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-label-md text-xs font-bold">
                                    <Icon name="schedule" size={14} className="text-amber-700" />
                                    TPEO બાકી
                                  </span>
                                )
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-label-md text-xs font-semibold">
                                  <Icon name="verified" size={14} className="text-emerald-600" />
                                  100% Match
                                </span>
                              )}
                            </td>

                            {/* Action Buttons */}
                            <td
                              className="py-4 pr-4 pl-2 text-right whitespace-nowrap"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center justify-end gap-1.5">
                                {isHighValue && app.tpeoStatus === "required" && (
                                  <button
                                    type="button"
                                    onClick={() => handleRouteToTPEO(app.id)}
                                    className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-label-md text-xs font-semibold transition-colors border border-amber-300"
                                    title="Route to Taluka Education Officer"
                                  >
                                    <T gu="TPEO મોકલો" en="Route TPEO" hi="TPEO भेजें" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => setActiveInspectionId(app.id)}
                                  className={`px-2.5 py-1.5 rounded-lg font-label-md text-label-md font-semibold transition-colors ${
                                    isInspected
                                      ? "bg-primary text-on-primary"
                                      : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                                  }`}
                                >
                                  <T gu="વિગત" en="Inspect" hi="विवरण" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Pagination */}
              <div className="p-4 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-outline-variant/20">
                <div className="flex items-center gap-3">
                  <span className="font-caption text-caption text-on-surface-variant">
                    <T
                      gu={`કુલ પસંદ કરેલ: ${selectedIds.length} અરજીઓ (₹ ${selectedTotalAmount.toLocaleString("en-IN")})`}
                      en={`Selected: ${selectedIds.length} applications (₹ ${selectedTotalAmount.toLocaleString("en-IN")})`}
                      hi={`चयनित: ${selectedIds.length} आवेदन`}
                    />
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-md text-label-md disabled:opacity-40 border border-outline-variant/30"
                  >
                    <T gu="પાછળ" en="Previous" hi="पिछला" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded-lg font-label-md text-label-md font-bold transition-colors ${
                        currentPage === pageNum
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/30"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors disabled:opacity-40 border border-outline-variant/30"
                  >
                    <T gu="આગળ" en="Next" hi="अगला" />
                  </button>
                </div>
              </div>
            </div>

            {/* Statutory e-Governance Directive Note Card */}
            <div className="p-4 rounded-xl bg-surface-container-low flex items-start gap-3.5 shadow-sm border border-outline-variant/30">
              <div className="w-8 h-8 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0 mt-0.5">
                <Icon name="gavel" size={20} />
              </div>
              <div className="leading-relaxed">
                <h4 className="font-label-lg text-label-lg font-bold text-on-surface">
                  <T
                    gu="વૈધાનિક સૂચના (Statutory e-Governance Directive)"
                    en="Statutory e-Governance Directive"
                    hi="वैधानिक ई-गवर्नेंस निर्देश"
                  />
                </h4>
                <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                  <T
                    gu="ઇન્ફોર્મેશન ટેકનોલોજી એક્ટ ૨૦૦૦ અને DBT ગાઈડલાઈન્સ મુજબ, DEO દ્વારા ડિજિટલ સહી કરેલ દરેક ઓર્ડર સીધો ગાંધીનગર સ્ટેટ ટ્રેઝરી અને PFMS સર્વર સાથે સિંક થાય છે. સેમ્પલિંગ ઓડિટ રેકોર્ડ રાજ્ય ઓડિટ ટીમ દ્વારા ચકાસણી યોગ્ય રહેશે."
                    en="Under IT Act 2000 and DBT Guidelines, orders digitally signed with DEO Class-3 DSC directly synchronize with Gandhinagar State Treasury and PFMS server. Audit sampling trails remain archived for state CAG inspection."
                    hi="सूचना प्रौद्योगिकी अधिनियम 2000 और डीबीटी दिशानिर्देशों के तहत डीईओ द्वारा हस्ताक्षरित आदेश सीधे गांधीनगर राज्य कोष और पीएफएमएस से सिंक होते हैं।"
                  />
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel: Sticky Inspection / Sample Audit Drawer (4 Columns) */}
          <div className="col-span-12 xl:col-span-4 flex flex-col gap-4">
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-5 space-y-5 sticky top-24">
              {/* Drawer Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-outline-variant/20">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                    <span className="font-label-md text-label-md uppercase tracking-wider text-outline font-bold">
                      SAMPLE INSPECTION DESK
                    </span>
                  </div>
                  <h3 className="font-title-lg text-title-lg font-bold text-on-surface mt-1">
                    <T
                      gu="અરજી અને ઓડિટ સારાંશ"
                      en="Inspection & Audit Summary"
                      hi="आवेदन एवं ऑडिट सारांश"
                    />
                  </h3>
                </div>
                <span className="px-2 py-1 rounded-lg bg-surface-container text-primary font-label-md text-label-md font-bold flex items-center gap-1">
                  <Icon name="visibility" size={16} />
                  <T gu="લાઇવ વ્યૂ" en="Live View" hi="लाइव दृश्य" />
                </span>
              </div>

              {/* Selected School Summary Card */}
              <div className="p-3.5 rounded-xl bg-surface-container-low space-y-2.5 border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <span className="font-caption text-caption text-outline uppercase font-semibold">
                    <T gu="ચકાસણી હેઠળની શાળા" en="School Under Audit" hi="सत्यापनधीन स्कूल" />
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-md text-xs font-bold">
                    {activeInspection.schoolType}
                  </span>
                </div>
                <div className="font-title-md text-title-md font-bold text-primary">
                  {activeInspection.schoolNameGu}
                </div>
                <div className="text-on-surface-variant font-caption text-caption flex items-center gap-2">
                  <span>UDISE: {activeInspection.udise}</span>
                  <span>•</span>
                  <span>{activeInspection.talukaGu} તાલુકો</span>
                </div>
              </div>

              {/* Deep-Dive Student Quick Card */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                    <Icon name="flaky" size={18} className="text-secondary" />
                    <T
                      gu="પસંદ થયેલ નમૂનો (Student Case Audit)"
                      en="Student Case Audit"
                      hi="छात्र केस ऑडिट"
                    />
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-caption text-caption">
                    CTS ID: {activeInspection.ctsId.slice(-6)}
                  </span>
                </div>

                {/* Student Profile Card */}
                <div className="p-4 rounded-xl bg-surface-container space-y-3.5 border border-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <Avatar name={activeInspection.studentName} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="font-title-md text-title-md font-bold text-on-surface truncate">
                        {activeInspection.studentNameGu}
                      </div>
                      <div className="font-caption text-caption text-on-surface-variant truncate">
                        {activeInspection.std} | {activeInspection.ctsId}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-label-md text-label-md font-bold shrink-0">
                      ₹ {activeInspection.amount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Verification Checks */}
                  <div className="space-y-2 pt-1 font-body-sm text-body-sm">
                    {/* Attendance Check */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest">
                      <div className="flex items-center gap-2">
                        <Icon name="calendar_month" size={18} className="text-emerald-600" />
                        <span className="text-on-surface font-medium text-xs">
                          <T gu="શાળા હાજરી (SwiftChat):" en="Attendance (SwiftChat):" hi="उपस्थिति:" />
                        </span>
                      </div>
                      <span
                        className={`font-label-md text-xs font-bold flex items-center gap-1 ${
                          activeInspection.attendancePercent >= 70
                            ? "text-emerald-700"
                            : "text-error"
                        }`}
                      >
                        {activeInspection.attendancePercent}% (નિયમ &gt; ૭૦%)
                        {activeInspection.attendancePercent >= 70 ? " ✓" : " ✗"}
                      </span>
                    </div>

                    {/* DigiLocker Income */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest">
                      <div className="flex items-center gap-2">
                        <Icon name="verified" size={18} className="text-emerald-600" />
                        <span className="text-on-surface font-medium text-xs">
                          <T gu="આવક પ્રમાણપત્ર:" en="Income Certificate:" hi="आय प्रमाण पत्र:" />
                        </span>
                      </div>
                      <span className="font-label-md text-xs text-emerald-700 font-bold flex items-center gap-1">
                        {activeInspection.incomeVerified
                          ? "ડિજિલોકર માન્ય (< ₹1.5L) ✓"
                          : "આવક મર્યાદા બહાર ✗"}
                      </span>
                    </div>

                    {/* Aadhaar Seeding */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest">
                      <div className="flex items-center gap-2">
                        <Icon name="account_balance" size={18} className="text-emerald-600" />
                        <span className="text-on-surface font-medium text-xs">
                          <T gu="NPCI સીડેડ બેંક:" en="NPCI Bank Seeding:" hi="बैंक सीडिंग:" />
                        </span>
                      </div>
                      <span className="font-label-md text-xs text-emerald-700 font-bold flex items-center gap-1">
                        {activeInspection.bankName.slice(0, 14)} ✓
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* TPEO Threshold Alert if > ₹10,000 */}
              {activeInspection.amount > 10000 && (
                <div
                  className={`p-3.5 rounded-xl border flex flex-col gap-2 ${
                    activeInspection.tpeoStatus === "cleared"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : "bg-amber-50 border-amber-200 text-amber-900"
                  }`}
                >
                  <div className="flex items-center gap-2 font-label-md text-label-md font-bold">
                    <Icon
                      name={
                        activeInspection.tpeoStatus === "cleared"
                          ? "check_circle"
                          : "warning"
                      }
                      size={18}
                      className={
                        activeInspection.tpeoStatus === "cleared"
                          ? "text-emerald-600"
                          : "text-amber-700"
                      }
                    />
                    <span>
                      <T
                        gu="TPEO પૂર્વ-મંજૂરી નિયમ (GR-SCH-2024)"
                        en="TPEO Threshold Rule (GR-SCH-2024)"
                        hi="TPEO सीमा नियम (GR-SCH-2024)"
                      />
                    </span>
                  </div>
                  <p className="font-caption text-caption">
                    <T
                      gu="₹૧૦,૦૦૦ થી વધુ રકમની શિષ્યવૃત્તિ અરજીઓ માટે સંબંધિત તાલુકા શિક્ષણ અધિકારી (TPEO) ની પૂર્વ-ચકાસણી ફરજિયાત છે."
                      en="Scholarship grants exceeding ₹10,000 require prior verification and routing through the Taluka Primary Education Officer (TPEO)."
                      hi="₹10,000 से अधिक के अनुदान हेतु तालुका शिक्षा अधिकारी (TPEO) की पूर्व-सत्यापन अनुशंसा आवश्यक है।"
                    />
                  </p>
                  {activeInspection.tpeoStatus === "required" ? (
                    <button
                      type="button"
                      onClick={() => handleRouteToTPEO(activeInspection.id)}
                      className="mt-1 w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-label-md text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Icon name="forward" size={16} />
                      <span>
                        <T
                          gu="TPEO સમીક્ષા માટે ફોરવર્ડ કરો"
                          en="Route to TPEO for Pre-Approval"
                          hi="TPEO को पूर्व-अनुमोदन हेतु भेजें"
                        />
                      </span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-emerald-800 font-label-md text-xs font-bold mt-1">
                      <Icon name="verified" size={16} className="text-emerald-700" />
                      <span>
                        <T
                          gu="TPEO તાલુકા કચેરી દ્વારા માન્ય પ્રમાણિત ✓"
                          en="Pre-approved by Taluka Education Office ✓"
                          hi="TPEO द्वारा पूर्व-स्वीकृत ✓"
                        />
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Rules Passed Checklist */}
              <div className="space-y-2">
                <span className="font-label-md text-label-md font-bold text-on-surface block">
                  <T
                    gu="નિયમ-એન્જિન પ્રમાણીકરણ (Algorithm Rules Passed):"
                    en="Algorithm Rules Passed:"
                    hi="एल्गोरिदम नियम सत्यापन:"
                  />
                </span>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 font-caption text-caption text-on-surface">
                    <Icon name="check_circle" size={16} className="text-emerald-600" />
                    <span>૧. વય અને ધોરણ માપદંડ સરકારી નિયમ GR-2024 અનુરૂપ.</span>
                  </div>
                  <div className="flex items-center gap-2 font-caption text-caption text-on-surface">
                    <Icon name="check_circle" size={16} className="text-emerald-600" />
                    <span>૨. સરકારી/અનુદાનિત શાળા પ્રવેશ અને UDISE વેરિફિકેશન સત્ય.</span>
                  </div>
                  <div className="flex items-center gap-2 font-caption text-caption text-on-surface">
                    <Icon name="check_circle" size={16} className="text-emerald-600" />
                    <span>૩. અન્ય કોઈપણ યોજનામાં ડુપ્લિકેટ ક્લેઈમ શૂન્ય (Zero Duplicates).</span>
                  </div>
                  <div className="flex items-center gap-2 font-caption text-caption text-on-surface">
                    <Icon name="check_circle" size={16} className="text-emerald-600" />
                    <span>૪. આચાર્ય {activeInspection.principalName} દ્વારા પ્રમાણિત.</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions in Drawer */}
              <div className="pt-3 border-t border-outline-variant/20 space-y-2">
                <Link
                  href="/student/profile"
                  className="w-full py-2.5 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md font-bold flex items-center justify-center gap-2 transition-colors border border-outline-variant/30"
                >
                  <Icon name="open_in_new" size={18} />
                  <span>
                    <T
                      gu="વિગતવાર વિદ્યાર્થી પ્રોફાઈલ જુઓ"
                      en="View Complete Profile"
                      hi="विस्तृत प्रोफाइल देखें"
                    />
                  </span>
                </Link>

                <div className="p-2.5 rounded-lg bg-amber-50 text-amber-900 font-caption text-caption flex items-center gap-2">
                  <Icon name="info" size={18} className="text-amber-600 shrink-0" />
                  <span>
                    <T
                      gu="ઓડિટ સંતોષકારક જણાય ત્યારે જથ્થાબંધ મંજૂરી બટન પર ક્લિક કરો."
                      en="Click bulk sanction when audit inspection is satisfactory."
                      hi="ऑडिट संतुष्टि पर थोक अनुमोदन बटन पर क्लिक करें।"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. DSC Confirmation Modal Overlay */}
      {isDscModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/50 backdrop-blur-sm animate-fade-in p-4">
          <div className="w-full max-w-xl bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden transform transition-all border border-outline-variant/30">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary to-primary-container p-6 text-on-primary">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-lowest/20 flex items-center justify-center">
                    <Icon name="vpn_key" size={24} className="text-on-primary" />
                  </div>
                  <div>
                    <h3 className="font-title-lg text-title-lg font-bold">
                      <T
                        gu="ડિજિટલ સહી અધિકૃતતા (DSC Sanction)"
                        en="Digital Signature Certificate Sanction"
                        hi="डिजिटल हस्ताक्षर प्रमाण पत्र अनुमोदन"
                      />
                    </h3>
                    <p className="font-caption text-caption text-on-primary-container">
                      District Education Office, Anand (DEO-GJ-AND-04)
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDscModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-surface-container-lowest/20 text-on-primary transition-colors"
                >
                  <Icon name="close" size={24} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div className="p-4 rounded-xl bg-surface-container-low space-y-2 border border-outline-variant/20">
                <div className="flex justify-between font-label-md text-label-md">
                  <span className="text-on-surface-variant">
                    <T gu="મંજૂરી માટે અરજીઓ:" en="Applications for Sanction:" hi="मंजूरी हेतु आवेदन:" />
                  </span>
                  <span className="text-on-surface font-bold">
                    {selectedIds.length} વિદ્યાર્થીઓ ({selectedIds.length} Students)
                  </span>
                </div>
                <div className="flex justify-between font-label-md text-label-md">
                  <span className="text-on-surface-variant">
                    <T gu="કુલ રકમ (DBT Disbursements):" en="Total DBT Sanction:" hi="कुल डीबीटी राशि:" />
                  </span>
                  <span className="text-primary font-bold font-title-md">
                    ₹ {selectedTotalAmount.toLocaleString("en-IN")}/-
                  </span>
                </div>
                <div className="flex justify-between font-label-md text-label-md">
                  <span className="text-on-surface-variant">
                    <T gu="સર્ટિફિકેટ વિગત:" en="DSC Token Certificate:" hi="प्रमाणपत्र विवरण:" />
                  </span>
                  <span className="text-emerald-700 font-bold">
                    Hasmukh J. Trivedi (Class-3 DSC Valid)
                  </span>
                </div>
              </div>

              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                <strong>પુષ્ટિ:</strong> તમે ₹ {selectedTotalAmount.toLocaleString("en-IN")} ની{" "}
                {selectedIds.length} નિયમ-માન્ય અરજીઓને તમારા ડિજિટલ સિગ્નેચર સર્ટિફિકેટ (DSC)
                દ્વારા મંજૂરી આપી રહ્યા છો. આ પ્રક્રિયા બાદ ગાંધીનગર PFMS પોર્ટલ પર DBT પેમેન્ટ
                ફાઈલ સ્વચાલિત રીતે ટ્રાન્સફર થશે.
              </p>

              {/* PIN Entry Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="dscPinInput"
                  className="font-label-lg text-label-lg font-bold text-on-surface block"
                >
                  <T
                    gu="DSC ટોકન પિન દાખલ કરો (Enter 6-digit USB Token PIN):"
                    en="Enter 6-digit USB Token PIN:"
                    hi="6-अंकीय टोकन पिन दर्ज करें:"
                  />
                </label>
                <div className="relative">
                  <input
                    id="dscPinInput"
                    type="password"
                    maxLength={6}
                    value={dscPin}
                    onChange={(e) => setDscPin(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary tracking-widest border border-outline-variant/30"
                    placeholder="••••••"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600">
                    <Icon name="lock" size={20} />
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-surface-container-low flex items-center justify-end gap-3 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setIsDscModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md font-semibold transition-colors border border-outline-variant/30"
              >
                <T gu="રદ કરો (Cancel)" en="Cancel" hi="रद्द करें" />
              </button>

              <button
                type="button"
                onClick={handleConfirmDscSign}
                disabled={isSigning || dscPin.length < 4}
                className="px-6 py-2.5 rounded-xl bg-secondary hover:bg-secondary/90 text-on-secondary font-label-md text-label-md font-bold shadow-md flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isSigning ? (
                  <>
                    <span className="animate-spin">
                      <Icon name="sync" size={20} />
                    </span>
                    <span>
                      <T
                        gu="સહી થઈ રહી છે (Processing DSC)..."
                        en="Processing DSC Signature..."
                        hi="डीएससी हस्ताक्षर हो रहा है..."
                      />
                    </span>
                  </>
                ) : (
                  <>
                    <Icon name="draw" size={20} />
                    <span>
                      <T
                        gu="ડિજિટલ સહી કરો અને આગળ વધો (Confirm & e-Sign)"
                        en="Confirm & e-Sign (DSC)"
                        hi="पुष्टि करें और ई-हस्ताक्षर करें"
                      />
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </OfficerShell>
  );
}
