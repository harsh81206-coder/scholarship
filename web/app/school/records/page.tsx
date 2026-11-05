"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { Avatar } from "@/components/ui";

interface StudentRecord {
  id: string;
  rollNo: string;
  nameGu: string;
  nameEn: string;
  ctsId: string;
  class: string;
  // Monthly attendance %
  attendance: {
    jun: number;
    jul: number;
    aug: number;
    sep: number;
    octDays: number;
    octTotalDays: number;
  };
  totalAttendancePct: number;
  anomaly?: {
    type: "name_mismatch" | "over_100" | "cts_not_found" | "zero_attendance" | "below_75";
    titleGu: string;
    titleEn: string;
    titleHi: string;
    descGu: string;
    descEn: string;
    descHi: string;
  };
  isResolved?: boolean;
  resolutionNote?: string;
  // Subject-wise marks
  marks: {
    gujarati: number;
    maths: number;
    science: number;
    socialScience: number;
    english: number;
  };
}

const INITIAL_STUDENTS: StudentRecord[] = [
  // Class 9-B students (5-6 students as requested)
  {
    id: "stu-1",
    rollNo: "01",
    nameGu: "રિયા હસમુખભાઈ પટેલ",
    nameEn: "Riya Hasmukhbhai Patel",
    ctsId: "GJ-AND-2026-004512",
    class: "9-B",
    attendance: { jun: 96, jul: 94, aug: 95, sep: 98, octDays: 23, octTotalDays: 24 },
    totalAttendancePct: 95.8,
    anomaly: {
      type: "name_mismatch",
      titleGu: "નામ વિસંગતતા (Name Mismatch)",
      titleEn: "Name Mismatch",
      titleHi: "नाम बेमेल (Name Mismatch)",
      descGu: "શાળા ડેટાબેઝ: Riya Mansukhbhai vs Riya Hasmukhbhai",
      descEn: "School DB: Riya Mansukhbhai vs CTS Portal: Riya Hasmukhbhai",
      descHi: "स्कूल रिकॉर्ड: Riya Mansukhbhai बनाम CTS पोर्टल: Riya Hasmukhbhai",
    },
    marks: { gujarati: 88, maths: 92, science: 85, socialScience: 90, english: 84 },
  },
  {
    id: "stu-2",
    rollNo: "02",
    nameGu: "આરવ ભરતભાઈ સોલંકી",
    nameEn: "Aarav Bharatbhai Solanki",
    ctsId: "GJ-AND-2026-004515",
    class: "9-B",
    attendance: { jun: 90, jul: 88, aug: 86, sep: 92, octDays: 22, octTotalDays: 24 },
    totalAttendancePct: 89.4,
    marks: { gujarati: 78, maths: 82, science: 79, socialScience: 84, english: 75 },
  },
  {
    id: "stu-3",
    rollNo: "03",
    nameGu: "હેતવી જગદીશકુમાર શાહ",
    nameEn: "Hetvi Jagdishkumar Shah",
    ctsId: "GJ-AND-2026-004520",
    class: "9-B",
    attendance: { jun: 74, jul: 72, aug: 70, sep: 68, octDays: 17, octTotalDays: 24 },
    totalAttendancePct: 70.8,
    anomaly: {
      type: "below_75",
      titleGu: "૭૫% લઘુત્તમ નિયમ અપૂર્ણ (Below 75%)",
      titleEn: "Below 75% Attendance Requirement",
      titleHi: "75% न्यूनतम उपस्थिति नियम अपूर्ण",
      descGu: "નમો લક્ષ્મી યોજના માટે ૨ દિવસ ઓછા પડે છે",
      descEn: "2 days short of eligibility for Namo Lakshmi Yojana",
      descHi: "नमो लक्ष्मी योजना के लिए 2 दिन कम हैं",
    },
    marks: { gujarati: 65, maths: 58, science: 62, socialScience: 70, english: 60 },
  },
  {
    id: "stu-4",
    rollNo: "04",
    nameGu: "દર્શન મહેશભાઈ પરમાર",
    nameEn: "Darshan Maheshbhai Parmar",
    ctsId: "GJ-AND-2026-004525",
    class: "9-B",
    attendance: { jun: 0, jul: 0, aug: 0, sep: 0, octDays: 0, octTotalDays: 24 },
    totalAttendancePct: 0.0,
    anomaly: {
      type: "zero_attendance",
      titleGu: "સંપૂર્ણ ગેરહાજર (Zero Attendance)",
      titleEn: "Zero Attendance Recorded",
      titleHi: "शून्य उपस्थिति (Zero Attendance)",
      descGu: "મેડિકલ રજા અથવા માન્ય કારણ સર્ટિફિકેટ જરૂરી છે",
      descEn: "Medical leave certificate or official reason required",
      descHi: "मेडिकल अवकाश अथवा वैध प्रमाणपत्र आवश्यक",
    },
    marks: { gujarati: 0, maths: 0, science: 0, socialScience: 0, english: 0 },
  },
  {
    id: "stu-5",
    rollNo: "05",
    nameGu: "દિવ્યા નરેશભાઈ પ્રજાપતિ",
    nameEn: "Divya Nareshbhai Prajapati",
    ctsId: "GJ-AND-2026-004531",
    class: "9-B",
    attendance: { jun: 95, jul: 92, aug: 94, sep: 96, octDays: 23, octTotalDays: 24 },
    totalAttendancePct: 94.6,
    marks: { gujarati: 91, maths: 95, science: 94, socialScience: 88, english: 89 },
  },
  {
    id: "stu-6",
    rollNo: "06",
    nameGu: "માનવ કમલેશભાઈ દેસાઈ",
    nameEn: "Manav Kamleshbhai Desai",
    ctsId: "GJ-AND-2026-004540",
    class: "9-B",
    attendance: { jun: 98, jul: 98, aug: 100, sep: 100, octDays: 26, octTotalDays: 24 },
    totalAttendancePct: 108.3,
    anomaly: {
      type: "over_100",
      titleGu: "અમાન્ય હાજરી (>100% Error)",
      titleEn: "Invalid Attendance (>100% Error)",
      titleHi: "अमान्य उपस्थिति (>100% Error)",
      descGu: "કુલ કાર્યકારી દિવસો ૨૪ કરતાં વધુ (૨૬) નોંધાયેલ છે",
      descEn: "26 days recorded which exceeds working days of 24",
      descHi: "कार्य दिवस 24 से अधिक (26) दर्ज किए गए हैं",
    },
    marks: { gujarati: 72, maths: 68, science: 74, socialScience: 71, english: 69 },
  },
  // Additional classes from the HTML screen
  {
    id: "stu-7",
    rollNo: "12",
    nameGu: "કલ્પેશ દિનેશભાઈ ઠાકોર",
    nameEn: "Kalpesh Dineshbhai Thakor",
    ctsId: "GJ-AND-2026-003891",
    class: "10-A",
    attendance: { jun: 90, jul: 92, aug: 91, sep: 94, octDays: 26, octTotalDays: 24 },
    totalAttendancePct: 108.3,
    anomaly: {
      type: "over_100",
      titleGu: "અમાન્ય હાજરી (>100% Error)",
      titleEn: "Invalid Attendance (>100% Error)",
      titleHi: "अमान्य उपस्थिति (>100% Error)",
      descGu: "કુલ કાર્યકારી દિવસો ૨૪ કરતાં વધુ દિવસો નોંધાયેલ છે",
      descEn: "Total working days exceeded (26 / 24 recorded)",
      descHi: "कार्य दिवस 24 से अधिक दर्ज किए गए हैं",
    },
    marks: { gujarati: 70, maths: 65, science: 68, socialScience: 72, english: 64 },
  },
  {
    id: "stu-8",
    rollNo: "08",
    nameGu: "રાહુલ ભરતભાઈ સોલંકી",
    nameEn: "Rahul Bharatbhai Solanki",
    ctsId: "GJ-AND-2026-999999",
    class: "11-Science",
    attendance: { jun: 78, jul: 75, aug: 76, sep: 74, octDays: 18, octTotalDays: 24 },
    totalAttendancePct: 75.0,
    anomaly: {
      type: "cts_not_found",
      titleGu: "CTS ID માન્ય નથી (Not Found)",
      titleEn: "CTS ID Not Found",
      titleHi: "CTS ID मान्य नहीं (Not Found)",
      descGu: "રાજ્ય શાળા પોર્ટલ ડેટાબેઝમાં આ ID ઉપલબ્ધ નથી",
      descEn: "Student ID does not match state school database",
      descHi: "राज्य स्कूल पोर्टल डेटाबेस में यह ID उपलब्ध नहीं है",
    },
    marks: { gujarati: 80, maths: 75, science: 82, socialScience: 79, english: 78 },
  },
  {
    id: "stu-9",
    rollNo: "15",
    nameGu: "પૂજા રમેશભાઈ પ્રજાપતિ",
    nameEn: "Pooja Rameshbhai Prajapati",
    ctsId: "GJ-AND-2026-004112",
    class: "9-A",
    attendance: { jun: 0, jul: 0, aug: 0, sep: 0, octDays: 0, octTotalDays: 24 },
    totalAttendancePct: 0.0,
    anomaly: {
      type: "zero_attendance",
      titleGu: "સંપૂર્ણ ગેરહાજર (Zero Attendance)",
      titleEn: "Zero Attendance Recorded",
      titleHi: "शून्य उपस्थिति (Zero Attendance)",
      descGu: "મેડિકલ રજા અથવા માન્ય કારણ અપલોડ કરો",
      descEn: "Upload medical leave or authorized leave reason",
      descHi: "मेडिकल अवकाश या वैध कारण अपलोड करें",
    },
    marks: { gujarati: 0, maths: 0, science: 0, socialScience: 0, english: 0 },
  },
  {
    id: "stu-10",
    rollNo: "22",
    nameGu: "મિતેશ સંજયભાઈ વણકર",
    nameEn: "Mitesh Sanjaybhai Vankar",
    ctsId: "GJ-AND-2026-004780",
    class: "12-General",
    attendance: { jun: 72, jul: 70, aug: 68, sep: 72, octDays: 17, octTotalDays: 24 },
    totalAttendancePct: 70.8,
    anomaly: {
      type: "below_75",
      titleGu: "૭૫% લઘુત્તમ નિયમ અપૂર્ણ (Below 75%)",
      titleEn: "Below 75% Attendance Requirement",
      titleHi: "75% न्यूनतम उपस्थिति नियम अपूर्ण",
      descGu: "નમો લક્ષ્મી યોજના માટે ૨ દિવસ ઓછા પડે છે",
      descEn: "2 days short of eligibility for Namo Lakshmi Yojana",
      descHi: "नमो लक्ष्मी योजना के लिए 2 दिन कम हैं",
    },
    marks: { gujarati: 75, maths: 60, science: 62, socialScience: 68, english: 65 },
  },
];

export default function SchoolRecordsPage() {
  const [activeTab, setActiveTab] = useState<"attendance" | "marks" | "audit">("attendance");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterMode, setFilterMode] = useState<"all" | "errors" | "below75">("all");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);

  // Auto-sync UI states
  const [autoSyncActive, setAutoSyncActive] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Bulk import state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  // Confirmation modal state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

  // Inline edit state for attendance days
  const [editDaysValue, setEditDaysValue] = useState<{ [id: string]: string }>({
    "stu-6": "22",
    "stu-7": "22",
  });
  const [editCtsValue, setEditCtsValue] = useState<{ [id: string]: string }>({
    "stu-8": "GJ-AND-2026-004921",
  });

  // Filter students
  const filteredStudents = students.filter((stu) => {
    // Class filter
    if (selectedClass !== "all" && stu.class !== selectedClass) {
      return false;
    }
    // Search query (name, roll, CTS ID)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchName =
        stu.nameGu.toLowerCase().includes(q) ||
        stu.nameEn.toLowerCase().includes(q) ||
        stu.rollNo.includes(q) ||
        stu.ctsId.toLowerCase().includes(q);
      if (!matchName) return false;
    }
    // Filter mode
    if (filterMode === "errors") {
      return Boolean(stu.anomaly && !stu.isResolved);
    }
    if (filterMode === "below75") {
      return stu.totalAttendancePct < 75;
    }
    return true;
  });

  // KPI Calculations
  const remainingErrorsCount = students.filter((s) => s.anomaly && !s.isResolved).length;

  // Handlers for inline resolution
  const handleAcceptCtsName = (id: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              isResolved: true,
              resolutionNote: "CTS Name Accepted: Riya Hasmukhbhai Patel",
            }
          : s
      )
    );
  };

  const handleSaveDays = (id: string) => {
    const rawVal = editDaysValue[id];
    const val = parseInt(rawVal, 10);
    if (isNaN(val) || val < 0 || val > 24) {
      alert("કૃપા કરીને માન્ય દિવસો દાખલ કરો (૦ થી ૨૪) / Please enter days between 0 and 24");
      return;
    }
    const newPct = Number(((val / 24) * 100).toFixed(1));
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            attendance: { ...s.attendance, octDays: val },
            totalAttendancePct: newPct,
            isResolved: true,
            resolutionNote: `અપડેટ દિવસો: ${val}/૨૪ (${newPct}%)`,
          };
        }
        return s;
      })
    );
  };

  const handleMapCtsId = (id: string) => {
    const newCts = editCtsValue[id];
    if (!newCts || !newCts.trim()) {
      alert("કૃપા કરીને માન્ય CTS ID દાખલ કરો / Please enter valid CTS ID");
      return;
    }
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              ctsId: newCts.trim(),
              isResolved: true,
              resolutionNote: `નવું CTS ID મેપ કર્યું: ${newCts}`,
            }
          : s
      )
    );
  };

  const handlePrincipalConcession = (id: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              isResolved: true,
              resolutionNote: "આચાર્ય વિશેષાધિકાર છૂટછાટ મંજૂર (Principal Concession Approved)",
            }
          : s
      )
    );
  };

  const handleMedicalWaiver = (id: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              isResolved: true,
              resolutionNote: "મેડિકલ રજા સર્ટિફિકેટ માન્ય (Medical Leave Approved)",
            }
          : s
      )
    );
  };

  // Marks update handler
  const handleMarkChange = (
    studentId: string,
    subject: keyof StudentRecord["marks"],
    value: string
  ) => {
    const num = Math.max(0, Math.min(100, parseInt(value, 10) || 0));
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            marks: {
              ...s.marks,
              [subject]: num,
            },
          };
        }
        return s;
      })
    );
  };

  // Auto-sync action
  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncNotice("રાજ્ય પોર્ટલ API સાથે સફળતાપૂર્વક સિંક થયું (State Portal Sync Complete)");
      setTimeout(() => setSyncNotice(null), 4000);
    }, 1200);
  };

  // CSV Bulk Import simulation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportNotice(`ફાઇલ '${file.name}' સફળતાપૂર્વક અપલોડ થઈ: ૮૪૨ વિદ્યાર્થીઓ સિંક થયા!`);
      setTimeout(() => setImportNotice(null), 5000);
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Roll_No,Student_Name,CTS_ID,Class,Jun_Pct,Jul_Pct,Aug_Pct,Sep_Pct,Oct_Days_Present,Oct_Total_Days,Gujarati,Mathematics,Science,Social_Science,English\n" +
      "01,Riya Hasmukhbhai Patel,GJ-AND-2026-004512,9-B,96,94,95,98,23,24,88,92,85,90,84\n" +
      "02,Aarav Bharatbhai Solanki,GJ-AND-2026-004515,9-B,90,88,86,92,22,24,78,82,79,84,75\n" +
      "03,Hetvi Jagdishkumar Shah,GJ-AND-2026-004520,9-B,74,72,70,68,17,24,65,58,62,70,60\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_attendance_marks_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Toggle selection
  const toggleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map((s) => s.id));
    }
  };

  const toggleSelectStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <OfficerShell role="school">
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto">
        {/* Hidden file input for Bulk Import */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv,.xlsx,.xls"
          className="hidden"
        />

        {/* Sync or Import Toast Notification */}
        {(syncNotice || importNotice) && (
          <div className="p-4 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-between shadow-md animate-fade-in border border-primary/20">
            <div className="flex items-center gap-2">
              <Icon name="check_circle" size={20} className="text-primary" />
              <span className="font-label-lg font-medium">{syncNotice || importNotice}</span>
            </div>
            <button
              onClick={() => {
                setSyncNotice(null);
                setImportNotice(null);
              }}
              className="text-on-primary-fixed hover:opacity-75"
            >
              <Icon name="close" size={18} />
            </button>
          </div>
        )}

        {/* Top Breadcrumb & Page Header Section */}
        <section className="flex flex-col gap-2">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant flex-wrap"
          >
            <Link href="/school" className="hover:text-primary transition-colors cursor-pointer">
              <T gu="શાળાઓ" en="Schools" hi="स्कूल" />
            </Link>
            <Icon name="chevron_right" size={14} className="text-on-surface-variant" />
            <span className="hover:text-primary transition-colors cursor-pointer">
              <T
                gu="વિદ્યાર્થી રેકોર્ડ્સ અને માર્કસ"
                en="Student Records & Marks"
                hi="छात्र रिकॉर्ड और अंक"
              />
            </span>
            <Icon name="chevron_right" size={14} className="text-on-surface-variant" />
            <span className="text-primary font-semibold">
              <T
                gu="હાજરી અને પરિણામ અપલોડ"
                en="Attendance & Marks Upload"
                hi="उपस्थिति और परिणाम अपलोड"
              />
            </span>
          </nav>

          <div className="flex flex-wrap items-start justify-between gap-4 mt-1">
            <div className="flex flex-col max-w-3xl">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                  <T
                    gu="વિદ્યાર્થી હાજરી અને માર્કસ ડેટા સિંક"
                    en="Student Attendance & Marks Data Sync"
                    hi="छात्र उपस्थिति एवं अंक डेटा सिंक"
                  />
                </h1>
                <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-primary font-label-md text-label-md flex items-center gap-1 shadow-sm font-semibold">
                  <Icon name="sync" size={14} /> SC4 Engine
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                <T
                  gu="શિષ્યવૃત્તિ પાત્રતા માટે ધોરણ ૯ થી ૧૨ ના માસિક હાજરી પત્રક અને સત્રાંત પરીક્ષા પરિણામ અપલોડ કરો. (શૈક્ષણિક વર્ષ ૨૦૨૫-૨૬)"
                  en="Upload monthly attendance sheets and term exam results for Classes 9 to 12 scholarship eligibility. (Academic Year 2025-26)"
                  hi="छात्रवृत्ति पात्रता हेतु कक्षा 9 से 12 की मासिक उपस्थिति पत्रक एवं सत्रांत परीक्षा परिणाम अपलोड करें। (शैक्षणिक वर्ष 2025-26)"
                />
              </p>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto flex-wrap">
              <button
                type="button"
                onClick={() =>
                  alert(
                    "માર્ગદર્શિકા:\n1. 75%+ હાજરી નમો લક્ષ્મી અને જ્ઞાન સાધના શિષ્યવૃત્તિ માટે ફરજિયાત છે.\n2. એક્સેલ/CSV અપલોડ માટે યોગ્ય કોલમ ફોર્મેટ અનુસરો.\n3. ક્ષતિવાળા રેકોર્ડ્સ આચાર્ય ચકાસણી દ્વારા સુધારી શકાય છે."
                  )
                }
                className="h-10 px-4 rounded-lg bg-surface-container-lowest border border-outline-variant text-primary font-label-lg text-label-lg shadow-sm hover:shadow hover:bg-surface-container-low transition-all flex items-center gap-2"
              >
                <Icon name="menu_book" size={18} />
                <span>
                  <T gu="પોર્ટલ માર્ગદર્શિકા" en="Guidelines" hi="दिशानिर्देश" />
                </span>
              </button>

              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="h-10 px-4 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg shadow-md hover:bg-primary-container transition-all flex items-center gap-2"
              >
                <Icon name="download_for_offline" size={18} />
                <span>
                  <T
                    gu="નમૂના ફાઇલ ડાઉનલોડ (.csv)"
                    en="Download Template (.csv)"
                    hi="प्रारूप डाउनलोड (.csv)"
                  />
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Module Sub-Navigation Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-surface-container-low p-1.5 rounded-xl shadow-sm gap-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab("attendance")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-title-md text-title-md transition-all shrink-0 ${
                activeTab === "attendance"
                  ? "bg-surface-container-lowest text-primary shadow-sm font-bold"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60"
              }`}
            >
              <Icon
                name="calendar_today"
                size={18}
                className={activeTab === "attendance" ? "text-primary" : ""}
              />
              <span>
                <T gu="માસિક હાજરી" en="Monthly Attendance" hi="मासिक उपस्थिति" />
              </span>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-md text-[11px]">
                <T gu="ઓક્ટોબર ૨૦૨૫" en="October 2025" hi="अक्टूबर 2025" />
              </span>
            </button>

            <button
              onClick={() => setActiveTab("marks")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-title-md text-title-md transition-all shrink-0 ${
                activeTab === "marks"
                  ? "bg-surface-container-lowest text-primary shadow-sm font-bold"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60"
              }`}
            >
              <Icon
                name="assignment_turned_in"
                size={18}
                className={activeTab === "marks" ? "text-primary" : ""}
              />
              <span>
                <T
                  gu="સત્ર પરીક્ષા ગુણ (Exam Marks)"
                  en="Exam Marks Entry"
                  hi="परीक्षा अंक प्रविष्टि"
                />
              </span>
            </button>

            <button
              onClick={() => setActiveTab("audit")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-title-md text-title-md transition-all shrink-0 ${
                activeTab === "audit"
                  ? "bg-surface-container-lowest text-primary shadow-sm font-bold"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60"
              }`}
            >
              <Icon
                name="history"
                size={18}
                className={activeTab === "audit" ? "text-primary" : ""}
              />
              <span>
                <T gu="અપલોડ ઇતિહાસ" en="Upload Audit Log" hi="अपलोड ऑडिट लॉग" />
              </span>
            </button>
          </div>

          <div className="hidden xl:flex items-center gap-2 pr-3 text-on-surface-variant font-label-md text-label-md">
            <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse"></span>
            <span>UDISE 24150104502 • Anand District Node</span>
          </div>
        </div>

        {/* Live State Portal Auto-Sync Integration Banner */}
        <section className="p-4 sm:p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-tertiary-fixed flex items-center justify-center shrink-0">
              <Icon name="cloud_sync" size={24} className="text-tertiary" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-title-md text-title-md text-on-surface font-semibold">
                  <T
                    gu="ગુજરાત શાળા પોર્ટલ (State School Attendance Portal / CTS API) સાથે લિંક"
                    en="Linked to Gujarat State School Attendance Portal (CTS API)"
                    hi="गुजरात राज्य स्कूल उपस्थिति पोर्टल (CTS API) से लिंक"
                  />
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-success-container text-on-success-container font-label-md text-[11px] flex items-center gap-1 font-bold">
                  <Icon name="check_circle" size={13} />
                  <T
                    gu="સ્વચાલિત સિંક સક્રિય"
                    en="Auto-Sync Connected"
                    hi="स्वचालित सिंक सक्रिय"
                  />
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                <T
                  gu="છેલ્લું સફળ દૈનિક સિંક: ગઈકાલે રાત્રે ૧૧:૫૯ વાગ્યે (૮૩૦ વિદ્યાર્થીઓ આપમેળે અપડેટ થયા). બાકીના ૧૨ રેકોર્ડ્સમાં વિસંગતતા હોવાથી આચાર્ય ચકાસણી જરૂરી છે."
                  en="Last successful auto-sync: Yesterday 11:59 PM (830 students auto-updated). Remaining 12 records have anomalies requiring Principal verification."
                  hi="अंतिम सफल ऑटो-सिंक: कल रात 11:59 बजे (830 छात्र स्वचालित रूप से अपडेट हुए)। शेष 12 रिकॉर्ड में विसंगति होने से प्राचार्य सत्यापन आवश्यक है।"
                />
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0 self-end lg:self-center">
            <label className="flex items-center gap-2 cursor-pointer text-on-surface font-label-md text-label-md">
              <input
                type="checkbox"
                checked={autoSyncActive}
                onChange={(e) => setAutoSyncActive(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
              />
              <span className="hidden sm:inline">
                <T
                  gu="સ્વચાલિત દૈનિક સિંક ચાલુ રાખો"
                  en="Keep Daily Auto-Sync Active"
                  hi="स्वचालित दैनिक सिंक चालू रखें"
                />
              </span>
            </label>
            <button
              type="button"
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="h-9 px-3.5 rounded-lg bg-surface-container text-primary font-label-md text-label-md flex items-center gap-1.5 hover:bg-surface-container-high transition-colors disabled:opacity-60"
            >
              <Icon
                name="sync"
                size={18}
                className={isSyncing ? "animate-spin text-primary" : "text-primary"}
              />
              <span>
                {isSyncing ? (
                  <T gu="સિંક થઈ રહ્યું છે..." en="Syncing..." hi="सिंक हो रहा है..." />
                ) : (
                  <T gu="હમણાં ફરી સિંક કરો" en="Sync Now" hi="अभी सिंक करें" />
                )}
              </span>
            </button>
          </div>
        </section>

        {/* 3-Step Wizard Stepper */}
        <section className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
            {/* Step 1 (Completed) */}
            <div className="flex items-center gap-3.5 p-3 rounded-lg bg-surface-container-low/70">
              <div className="w-9 h-9 rounded-full bg-success text-on-success flex items-center justify-center shrink-0">
                <Icon name="check" size={20} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-caption text-caption text-on-success-container font-semibold uppercase tracking-wider">
                  <T gu="પગલું ૧ • પૂર્ણ થયેલ" en="Step 1 • Completed" hi="चरण 1 • पूर्ण" />
                </span>
                <span className="font-title-md text-title-md text-on-surface truncate font-semibold">
                  <T
                    gu="૧. એક્સેલ / CSV અપલોડ"
                    en="1. Excel / CSV Upload"
                    hi="1. एक्सेल / CSV अपलोड"
                  />
                </span>
                <span className="font-caption text-caption text-on-surface-variant truncate">
                  attendance_oct_2025.xlsx (1.4 MB)
                </span>
              </div>
            </div>

            {/* Step 2 (Active Current Step) */}
            <div className="flex items-center gap-3.5 p-3 rounded-lg bg-primary-fixed/40 relative overflow-hidden border-l-4 border-primary">
              <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 relative font-bold text-[14px]">
                ૨
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-secondary animate-ping"></span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-caption text-caption text-primary font-semibold uppercase tracking-wider">
                  <T gu="પગલું ૨ • વર્તમાન પ્રક્રિયા" en="Step 2 • In Progress" hi="चरण 2 • जारी" />
                </span>
                <span className="font-title-md text-title-md text-primary font-bold truncate">
                  <T
                    gu="૨. ડેટા ચકાસણી અને માન્યતા"
                    en="2. Data Verification & Validation"
                    hi="2. डेटा सत्यापन एवं मान्यता"
                  />
                </span>
                <span className="font-caption text-caption text-on-surface-variant truncate">
                  <T
                    gu={`${remainingErrorsCount} વિસંગતતાઓના સુધારા પેન્ડિંગ`}
                    en={`${remainingErrorsCount} anomalies pending fix`}
                    hi={`${remainingErrorsCount} विसंगतियों का सुधार लंबित`}
                  />
                </span>
              </div>
            </div>

            {/* Step 3 (Upcoming) */}
            <div className="flex items-center gap-3.5 p-3 rounded-lg bg-surface-container-low/40 opacity-75">
              <div className="w-9 h-9 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0 font-bold text-[14px]">
                ૩
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">
                  <T gu="પગલું ૩ • અંતિમ" en="Step 3 • Final" hi="चरण 3 • अंतिम" />
                </span>
                <span className="font-title-md text-title-md text-on-surface-variant truncate">
                  <T
                    gu="૩. અંતિમ પુષ્ટિ અને સ્કીમ લિંકિંગ"
                    en="3. Scheme Linking & Final Sync"
                    hi="3. योजना लिंकिंग एवं अंतिम सिंक"
                  />
                </span>
                <span className="font-caption text-caption text-on-surface-variant truncate">
                  <T
                    gu="નમો લક્ષ્મી અને જ્ઞાન સાધના સ્કીમ"
                    en="Namo Lakshmi & Gyan Sadhna Scheme"
                    hi="नमो लक्ष्मी एवं ज्ञान साधना योजना"
                  />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Metric Bento Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wide font-medium">
                <T
                  gu="કુલ પ્રોસેસ કરેલ રેકોર્ડ્સ"
                  en="Total Processed Records"
                  hi="कुल संसाधित रिकॉर्ड"
                />
              </span>
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
                <Icon name="group" size={18} />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-[32px] leading-tight text-on-surface font-bold">
                  ૮૪૨
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  <T gu="વિદ્યાર્થીઓ" en="Students (842)" hi="विद्यार्थी (842)" />
                </span>
              </div>
              <span className="font-caption text-caption text-on-surface-variant block mt-1">
                <T
                  gu="૮ વર્ગો (ધોરણ ૯ થી ૧૨) શામેલ"
                  en="8 Classes (Grades 9 to 12) Included"
                  hi="8 कक्षाएं (कक्षा 9 से 12) शामिल"
                />
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-success font-semibold uppercase tracking-wide">
                <T
                  gu="માન્ય રેકોર્ડ્સ (Auto-Approved)"
                  en="Auto-Approved Records"
                  hi="मान्य रिकॉर्ड (ऑटो-स्वीकृत)"
                />
              </span>
              <div className="w-8 h-8 rounded-lg bg-success-container flex items-center justify-center text-on-success-container">
                <Icon name="task_alt" size={18} />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-[32px] leading-tight text-success font-bold">
                  ૮૩૦
                </span>
                <span className="px-2 py-0.5 rounded-full bg-success-container text-on-success-container font-label-md text-[11px] font-bold">
                  ૯૮.૬%
                </span>
              </div>
              <span className="font-caption text-caption text-on-surface-variant block mt-1">
                <T
                  gu="રાજ્ય હાજરી સર્વર સાથે સંપૂર્ણ મેળ"
                  en="100% matched with State Attendance Server"
                  hi="राज्य उपस्थिति सर्वर के साथ पूर्ण मिलान"
                />
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-danger font-semibold uppercase tracking-wide">
                <T
                  gu="ક્ષતિ / વિસંગતતા (Conflicts)"
                  en="Conflicts / Errors"
                  hi="विसंगति / त्रुटियां (Conflicts)"
                />
              </span>
              <div className="w-8 h-8 rounded-lg bg-danger-container flex items-center justify-center text-danger">
                <Icon name="warning" size={18} />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-[32px] leading-tight text-danger font-bold">
                  {remainingErrorsCount}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-danger-container text-on-danger-container font-label-md text-[11px] font-bold">
                  <T gu="ધ્યાન જરૂરી" en="Action Required" hi="ध्यान आवश्यक" />
                </span>
              </div>
              <span className="font-caption text-caption text-danger font-medium block mt-1">
                <T
                  gu="સુધારો કર્યા વિના સ્કીમ સિંક અટકશે"
                  en="Scheme sync paused until resolved"
                  hi="सुधार के बिना योजना सिंक रुकेगा"
                />
              </span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-secondary font-semibold uppercase tracking-wide">
                <T
                  gu="શિષ્યવૃત્તિ પાત્રતા અસર"
                  en="Scholarship Eligibility"
                  hi="छात्रवृत्ति पात्रता प्रभाव"
                />
              </span>
              <div className="w-8 h-8 rounded-lg bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                <Icon name="savings" size={18} />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-[32px] leading-tight text-primary font-bold">
                  ૭૮૮
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  <T gu="૭૫%+ હાજરી" en="75%+ Attendance" hi="75%+ उपस्थिति" />
                </span>
              </div>
              <span className="font-caption text-caption text-on-surface-variant block mt-1">
                <T
                  gu="નમો લક્ષ્મી & જ્ઞાન સાધના માટે તુરંત પાત્ર"
                  en="Immediately eligible for Namo Lakshmi & Gyan Sadhna"
                  hi="नमो लक्ष्मी एवं ज्ञान साधना हेतु तुरंत पात्र"
                />
              </span>
            </div>
          </div>
        </section>

        {/* Filter and Control Strip */}
        <section className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Active file badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md">
              <Icon name="description" size={18} className="text-primary" />
              <span className="font-semibold">attendance_oct_2025.xlsx</span>
              <span className="text-on-surface-variant text-caption">| ૧૨ ઓક્ટોબર, ૧૦:૧૫ AM</span>
            </div>

            <div className="h-6 w-px bg-outline-variant hidden sm:block"></div>

            {/* Error & Status Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setFilterMode("all")}
                className={`px-3 py-1.5 rounded-lg font-label-md text-label-md transition-colors ${
                  filterMode === "all"
                    ? "bg-primary text-on-primary font-bold shadow-sm"
                    : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                }`}
              >
                <T gu="બધા રેકોર્ડ્સ (842)" en="All Records (842)" hi="सभी रिकॉर्ड (842)" />
              </button>

              <button
                type="button"
                onClick={() => setFilterMode("errors")}
                className={`px-3 py-1.5 rounded-lg font-label-md text-label-md flex items-center gap-1.5 transition-colors ${
                  filterMode === "errors"
                    ? "bg-danger text-on-danger font-bold shadow-sm"
                    : "bg-danger-container text-on-danger-container hover:bg-danger-container/80"
                }`}
              >
                <Icon name="filter_alt" size={16} />
                <span>
                  <T
                    gu={`માત્ર ક્ષતિઓ (${remainingErrorsCount})`}
                    en={`Errors Only (${remainingErrorsCount})`}
                    hi={`केवल त्रुटियां (${remainingErrorsCount})`}
                  />
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFilterMode("below75")}
                className={`px-3 py-1.5 rounded-lg font-label-md text-label-md flex items-center gap-1.5 transition-colors ${
                  filterMode === "below75"
                    ? "bg-warning text-on-warning font-bold shadow-sm"
                    : "bg-warning-container text-on-warning-container hover:bg-warning-container/80"
                }`}
              >
                <Icon name="warning" size={16} />
                <span>
                  <T gu="< ૭૫% હાજરી" en="< 75% Attendance" hi="< 75% उपस्थिति" />
                </span>
              </button>
            </div>

            {/* Class Selector Dropdown */}
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="h-9 pl-3 pr-8 rounded-lg bg-surface-container border border-outline-variant/60 text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
              >
                <option value="all">વર્ગ: તમામ વર્ગો (All Classes)</option>
                <option value="9-B">ધોરણ ૯-B (Class 9-B)</option>
                <option value="9-A">ધોરણ ૯-A (Class 9-A)</option>
                <option value="10-A">ધોરણ ૧૦-A (Class 10-A)</option>
                <option value="11-Science">ધોરણ ૧૧-વિજ્ઞાન (Class 11-Sci)</option>
                <option value="12-General">ધોરણ ૧૨-સામાન્ય (Class 12-Gen)</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[16px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Search & Bulk CSV Trigger */}
          <div className="flex items-center gap-3 justify-between lg:justify-end flex-wrap">
            <div className="relative flex-1 sm:w-64 min-w-[200px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search CTS ID, Roll # or Name..."
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-surface-container-low border border-outline-variant/60 text-on-surface font-body-sm text-body-sm placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-9 px-3 rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center gap-1.5 shadow-sm hover:bg-primary-container transition-colors"
            >
              <Icon name="upload_file" size={16} />
              <span>
                <T gu="CSV આયાત કરો" en="Bulk Import CSV" hi="थोक CSV आयात" />
              </span>
            </button>
          </div>
        </section>

        {/* TAB 1: Attendance Table */}
        {activeTab === "attendance" && (
          <section className="rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
                    <th className="py-3 px-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={
                          filteredStudents.length > 0 &&
                          selectedStudentIds.length === filteredStudents.length
                        }
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                      />
                    </th>
                    <th className="py-3 px-3 w-16">
                      <T gu="રોલ #" en="Roll #" hi="रोल #" />
                    </th>
                    <th className="py-3 px-4 min-w-[220px]">
                      <T
                        gu="CTS ID અને વિદ્યાર્થીનું નામ"
                        en="CTS ID & Student Name"
                        hi="CTS ID और छात्र का नाम"
                      />
                    </th>
                    <th className="py-3 px-3 min-w-[100px]">
                      <T gu="ધોરણ/વર્ગ" en="Class" hi="कक्षा" />
                    </th>
                    <th className="py-3 px-4 min-w-[170px] text-center">
                      <T
                        gu="માસિક વિગત (Jun-Sep)"
                        en="Monthly % (Jun-Sep)"
                        hi="मासिक % (Jun-Sep)"
                      />
                    </th>
                    <th className="py-3 px-4 min-w-[140px] text-center">
                      <T
                        gu="ઓક્ટોબર હાજરી (૨૪ માંથી)"
                        en="October Days (/24)"
                        hi="अक्टूबर दिन (/24)"
                      />
                    </th>
                    <th className="py-3 px-3 min-w-[90px] text-center">
                      <T gu="કુલ %" en="Total %" hi="कुल %" />
                    </th>
                    <th className="py-3 px-4 min-w-[260px]">
                      <T
                        gu="ઓળખાયેલ વિસંગતતા / ક્ષતિ"
                        en="Identified Anomaly"
                        hi="पहचानी गई विसंगति"
                      />
                    </th>
                    <th className="py-3 px-4 min-w-[220px]">
                      <T gu="સુધારો અને કાર્યવાહી" en="Action / Inline Fix" hi="कार्यवाही / सुधार" />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/60 font-body-sm text-body-sm text-on-surface">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-on-surface-variant">
                        <Icon name="search_off" size={32} className="mx-auto mb-2 text-outline" />
                        <p className="font-title-md">
                          <T
                            gu="કોઈ વિદ્યાર્થી મળ્યા નથી"
                            en="No students found matching filters"
                            hi="कोई छात्र नहीं मिला"
                          />
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => {
                      const isBelow75 = student.totalAttendancePct < 75;
                      const isOver100 = student.totalAttendancePct > 100;
                      const hasActiveAnomaly = student.anomaly && !student.isResolved;

                      let rowBg = "hover:bg-surface-container-low/50";
                      if (hasActiveAnomaly && (isBelow75 || isOver100)) {
                        rowBg = "bg-danger-container/15 hover:bg-danger-container/25";
                      } else if (hasActiveAnomaly) {
                        rowBg = "bg-warning-container/15 hover:bg-warning-container/25";
                      } else if (student.isResolved) {
                        rowBg = "bg-success-container/10 hover:bg-success-container/20";
                      }

                      return (
                        <tr key={student.id} className={`${rowBg} transition-colors group`}>
                          {/* Checkbox */}
                          <td className="py-3.5 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={selectedStudentIds.includes(student.id)}
                              onChange={() => toggleSelectStudent(student.id)}
                              className="w-4 h-4 rounded text-primary accent-primary"
                            />
                          </td>

                          {/* Roll No */}
                          <td className="py-3.5 px-3 font-mono font-semibold text-on-surface-variant">
                            #{student.rollNo}
                          </td>

                          {/* Student Name & CTS ID */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar name={student.nameEn} size="sm" />
                              <div className="flex flex-col">
                                <span className="font-title-sm text-title-sm text-on-surface font-semibold">
                                  <T
                                    gu={student.nameGu}
                                    en={student.nameEn}
                                    hi={student.nameEn}
                                  />
                                </span>
                                <span className="font-caption text-caption text-primary font-mono flex items-center gap-1">
                                  {student.ctsId}
                                  {student.anomaly?.type === "cts_not_found" &&
                                    !student.isResolved && (
                                      <Icon
                                        name="link_off"
                                        size={12}
                                        className="text-danger inline"
                                      />
                                    )}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Class */}
                          <td className="py-3.5 px-3">
                            <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-md text-[12px] font-medium">
                              {student.class}
                            </span>
                          </td>

                          {/* Monthly Breakdown (Jun-Sep) */}
                          <td className="py-3.5 px-4 text-center text-on-surface-variant font-mono text-[12px]">
                            <div className="flex items-center justify-center gap-1.5">
                              <span title="June">{student.attendance.jun}%</span>
                              <span className="text-outline">/</span>
                              <span title="July">{student.attendance.jul}%</span>
                              <span className="text-outline">/</span>
                              <span title="August">{student.attendance.aug}%</span>
                              <span className="text-outline">/</span>
                              <span title="September">{student.attendance.sep}%</span>
                            </div>
                          </td>

                          {/* October Days / 24 with inline edit if error */}
                          <td className="py-3.5 px-4 text-center font-mono">
                            {student.anomaly?.type === "over_100" && !student.isResolved ? (
                              <div className="flex items-center justify-center gap-1">
                                <input
                                  type="number"
                                  min={0}
                                  max={24}
                                  value={editDaysValue[student.id] ?? student.attendance.octDays}
                                  onChange={(e) =>
                                    setEditDaysValue({
                                      ...editDaysValue,
                                      [student.id]: e.target.value,
                                    })
                                  }
                                  className="w-14 h-8 px-1 text-center font-bold text-danger border border-danger rounded bg-surface-container-lowest focus:ring-2 focus:ring-primary text-[13px]"
                                />
                                <span className="text-on-surface-variant">/ 24</span>
                              </div>
                            ) : (
                              <span>
                                <span
                                  className={`font-semibold ${
                                    isBelow75 || isOver100 ? "text-danger" : "text-on-surface"
                                  }`}
                                >
                                  {student.attendance.octDays}
                                </span>{" "}
                                / 24
                              </span>
                            )}
                          </td>

                          {/* Total % badge */}
                          <td className="py-3.5 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[12px] ${
                                isBelow75
                                  ? "bg-danger-container text-on-danger-container"
                                  : isOver100
                                  ? "bg-danger-container text-on-danger-container"
                                  : "bg-success-container text-on-success-container"
                              }`}
                            >
                              {student.totalAttendancePct}%
                            </span>
                          </td>

                          {/* Identified Anomaly / Status */}
                          <td className="py-3.5 px-4">
                            {student.isResolved ? (
                              <div className="flex items-center gap-1.5 text-success font-medium text-[13px]">
                                <Icon name="check_circle" size={16} />
                                <span>{student.resolutionNote ?? "સુધારેલ (Resolved)"}</span>
                              </div>
                            ) : student.anomaly ? (
                              <div className="flex items-start gap-2">
                                <Icon
                                  name={
                                    student.anomaly.type === "below_75"
                                      ? "priority_high"
                                      : student.anomaly.type === "zero_attendance"
                                      ? "event_busy"
                                      : student.anomaly.type === "over_100"
                                      ? "error"
                                      : student.anomaly.type === "cts_not_found"
                                      ? "person_search"
                                      : "badge"
                                  }
                                  size={18}
                                  className={`shrink-0 mt-0.5 ${
                                    student.anomaly.type === "below_75" ||
                                    student.anomaly.type === "zero_attendance"
                                      ? "text-secondary"
                                      : student.anomaly.type === "over_100" ||
                                        student.anomaly.type === "cts_not_found"
                                      ? "text-danger"
                                      : "text-warning"
                                  }`}
                                />
                                <div className="flex flex-col">
                                  <span
                                    className={`font-medium ${
                                      student.anomaly.type === "below_75" ||
                                      student.anomaly.type === "zero_attendance"
                                        ? "text-secondary"
                                        : student.anomaly.type === "over_100" ||
                                          student.anomaly.type === "cts_not_found"
                                        ? "text-danger"
                                        : "text-amber-800"
                                    }`}
                                  >
                                    <T
                                      gu={student.anomaly.titleGu}
                                      en={student.anomaly.titleEn}
                                      hi={student.anomaly.titleHi}
                                    />
                                  </span>
                                  <span className="font-caption text-caption text-on-surface-variant">
                                    <T
                                      gu={student.anomaly.descGu}
                                      en={student.anomaly.descEn}
                                      hi={student.anomaly.descHi}
                                    />
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-success font-medium text-[13px]">
                                <Icon name="task_alt" size={16} />
                                <span>
                                  <T
                                    gu="કોઈ વિસંગતતા નથી (માન્ય)"
                                    en="Valid & Verified"
                                    hi="मान्य एवं सत्यापित"
                                  />
                                </span>
                              </div>
                            )}
                          </td>

                          {/* Action / Inline Fix */}
                          <td className="py-3.5 px-4">
                            {student.isResolved ? (
                              <span className="text-on-surface-variant text-[12px] flex items-center gap-1">
                                <Icon name="lock" size={14} />
                                <T gu="ચકાસણી સંપન્ન" en="Verified" hi="सत्यापित" />
                              </span>
                            ) : student.anomaly?.type === "name_mismatch" ? (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleAcceptCtsName(student.id)}
                                  className="h-8 px-2.5 rounded bg-primary text-on-primary font-label-md text-[12px] flex items-center gap-1 hover:bg-primary-container transition-colors shadow-sm"
                                >
                                  <Icon name="done" size={14} />
                                  <span>
                                    <T
                                      gu="CTS નામ સ્વીકારો"
                                      en="Accept CTS Name"
                                      hi="CTS नाम स्वीकारें"
                                    />
                                  </span>
                                </button>
                              </div>
                            ) : student.anomaly?.type === "over_100" ? (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleSaveDays(student.id)}
                                  className="h-8 px-3 rounded bg-success text-on-success font-label-md text-[12px] flex items-center gap-1 hover:bg-success/90 transition-colors shadow-sm font-semibold"
                                >
                                  <Icon name="save" size={14} />
                                  <span>
                                    <T gu="સાચવો" en="Save (22d)" hi="सहेजें" />
                                  </span>
                                </button>
                              </div>
                            ) : student.anomaly?.type === "cts_not_found" ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={editCtsValue[student.id] ?? ""}
                                  onChange={(e) =>
                                    setEditCtsValue({
                                      ...editCtsValue,
                                      [student.id]: e.target.value,
                                    })
                                  }
                                  placeholder="સાચો CTS દાખલ કરો..."
                                  className="h-8 px-2 rounded bg-surface-container text-on-surface font-mono text-[11px] w-36 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary border border-outline-variant/60"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleMapCtsId(student.id)}
                                  className="h-8 px-2 rounded bg-primary text-on-primary font-label-md text-[12px] flex items-center gap-1 hover:bg-primary-container transition-colors"
                                >
                                  <span>
                                    <T gu="મેપ કરો" en="Map" hi="मैप करें" />
                                  </span>
                                </button>
                              </div>
                            ) : student.anomaly?.type === "zero_attendance" ? (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleMedicalWaiver(student.id)}
                                  className="h-8 px-2.5 rounded bg-surface-container border border-outline-variant/60 text-primary font-label-md text-[12px] flex items-center gap-1 hover:bg-surface-container-high transition-colors"
                                  title="મેડિકલ સર્ટિફિકેટ માન્ય કરો"
                                >
                                  <Icon name="attach_file" size={14} />
                                  <span>
                                    <T
                                      gu="મેડિકલ છૂટછાટ"
                                      en="Medical Waiver"
                                      hi="मेडिकल छूट"
                                    />
                                  </span>
                                </button>
                              </div>
                            ) : student.anomaly?.type === "below_75" ? (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handlePrincipalConcession(student.id)}
                                  className="h-8 px-2.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-md text-[12px] flex items-center gap-1.5 hover:bg-secondary-fixed-dim transition-colors font-medium shadow-sm"
                                >
                                  <Icon name="verified_user" size={14} />
                                  <span>
                                    <T
                                      gu="આચાર્ય વિશેષાધિકાર છૂટછાટ"
                                      en="Principal Concession"
                                      hi="प्राचार्य विशेषाधिकार छूट"
                                    />
                                  </span>
                                </button>
                              </div>
                            ) : (
                              <span className="text-on-surface-variant text-[12px]">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Pagination / Status Footer */}
            <div className="px-4 py-3 bg-surface-container-low border-t border-outline-variant/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-on-surface-variant font-label-md text-label-md">
              <div className="flex items-center gap-2">
                <span>
                  <T
                    gu={`કુલ ${filteredStudents.length} રેકોર્ડ્સ દર્શાવવામાં આવ્યા છે`}
                    en={`Showing ${filteredStudents.length} student records`}
                    hi={`कुल ${filteredStudents.length} रिकॉर्ड दिखाए गए हैं`}
                  />
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled
                  className="w-8 h-8 rounded bg-surface-container-lowest flex items-center justify-center text-on-surface-variant disabled:opacity-50 shadow-sm border border-outline-variant/60"
                >
                  <Icon name="chevron_left" size={16} />
                </button>
                <span className="px-2 font-semibold text-on-surface">૧ / ૧</span>
                <button
                  type="button"
                  disabled
                  className="w-8 h-8 rounded bg-surface-container-lowest flex items-center justify-center text-on-surface-variant disabled:opacity-50 shadow-sm border border-outline-variant/60"
                >
                  <Icon name="chevron_right" size={16} />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: Subject-wise Marks Entry */}
        {activeTab === "marks" && (
          <section className="rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 bg-surface-container-low/60 border-b border-outline-variant/60 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                  <T
                    gu="વિષયવાર ગુણ પ્રવિષ્ટિ (Term 1 & 2 Examination Marks)"
                    en="Subject-wise Marks Entry (Term 1 & 2 Examination)"
                    hi="विषयवार अंक प्रविष्टि (Term 1 & 2 परीक्षा)"
                  />
                </h3>
                <p className="font-caption text-caption text-on-surface-variant">
                  <T
                    gu="શિષ્યવૃત્તિ લાયકાત માટે લઘુત્તમ ૫૦% અથવા પાસિંગ ગુણ જરૂરી છે (નમો લક્ષ્મી અને જ્ઞાન સાધના સ્કીમ)"
                    en="Minimum 50% or passing marks required for scholarship eligibility (Namo Lakshmi & Gyan Sadhna Scheme)"
                    hi="छात्रवृत्ति पात्रता के लिए न्यूनतम 50% या उत्तीर्ण अंक आवश्यक हैं"
                  />
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    alert("તમામ ગુણ સફળતાપૂર્વક સાચવવામાં આવ્યા છે! (Marks Saved Successfully)");
                  }}
                  className="h-9 px-4 rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center gap-1.5 shadow-sm hover:bg-primary-container transition-colors"
                >
                  <Icon name="save" size={16} />
                  <span>
                    <T gu="ગુણ સાચવો" en="Save Marks" hi="अंक सहेजें" />
                  </span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
                    <th className="py-3 px-3 w-14 text-center">
                      <T gu="રોલ #" en="Roll #" hi="रोल #" />
                    </th>
                    <th className="py-3 px-4 min-w-[200px]">
                      <T gu="વિદ્યાર્થી" en="Student" hi="विद्यार्थी" />
                    </th>
                    <th className="py-3 px-3 min-w-[80px]">
                      <T gu="વર્ગ" en="Class" hi="कक्षा" />
                    </th>
                    <th className="py-3 px-3 min-w-[100px] text-center">
                      <T gu="ગુજરાતી (100)" en="Gujarati (100)" hi="गुजराती (100)" />
                    </th>
                    <th className="py-3 px-3 min-w-[100px] text-center">
                      <T gu="ગણિત (100)" en="Maths (100)" hi="गणित (100)" />
                    </th>
                    <th className="py-3 px-3 min-w-[100px] text-center">
                      <T gu="વિજ્ઞાન (100)" en="Science (100)" hi="विज्ञान (100)" />
                    </th>
                    <th className="py-3 px-3 min-w-[100px] text-center">
                      <T gu="સા. વિજ્ઞાન (100)" en="Soc. Sci (100)" hi="सा. विज्ञान (100)" />
                    </th>
                    <th className="py-3 px-3 min-w-[100px] text-center">
                      <T gu="અંગ્રેજી (100)" en="English (100)" hi="अंग्रेजी (100)" />
                    </th>
                    <th className="py-3 px-3 min-w-[110px] text-center">
                      <T gu="કુલ / ૫૦૦" en="Total / 500" hi="कुल / 500" />
                    </th>
                    <th className="py-3 px-3 min-w-[90px] text-center">
                      <T gu="ટકાવારી" en="Pct %" hi="प्रतिशत" />
                    </th>
                    <th className="py-3 px-4 min-w-[150px]">
                      <T gu="લાયકાત સ્થિતિ" en="Eligibility Status" hi="पात्रता स्थिति" />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/60 font-body-sm text-body-sm text-on-surface">
                  {filteredStudents.map((student) => {
                    const totalMarks =
                      student.marks.gujarati +
                      student.marks.maths +
                      student.marks.science +
                      student.marks.socialScience +
                      student.marks.english;
                    const pct = (totalMarks / 5).toFixed(1);
                    const isPassing = Number(pct) >= 50;

                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-surface-container-low/50 transition-colors"
                      >
                        <td className="py-3 px-3 font-mono font-semibold text-center text-on-surface-variant">
                          #{student.rollNo}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-title-sm text-title-sm font-semibold text-on-surface">
                              <T
                                gu={student.nameGu}
                                en={student.nameEn}
                                hi={student.nameEn}
                              />
                            </span>
                            <span className="font-caption text-caption text-on-surface-variant font-mono">
                              {student.ctsId}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-md text-[12px]">
                            {student.class}
                          </span>
                        </td>
                        {/* Gujarati */}
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={student.marks.gujarati}
                            onChange={(e) =>
                              handleMarkChange(student.id, "gujarati", e.target.value)
                            }
                            className="w-16 h-8 text-center rounded border border-outline-variant bg-surface-container-lowest font-mono font-semibold focus:ring-2 focus:ring-primary text-[13px]"
                          />
                        </td>
                        {/* Maths */}
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={student.marks.maths}
                            onChange={(e) =>
                              handleMarkChange(student.id, "maths", e.target.value)
                            }
                            className="w-16 h-8 text-center rounded border border-outline-variant bg-surface-container-lowest font-mono font-semibold focus:ring-2 focus:ring-primary text-[13px]"
                          />
                        </td>
                        {/* Science */}
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={student.marks.science}
                            onChange={(e) =>
                              handleMarkChange(student.id, "science", e.target.value)
                            }
                            className="w-16 h-8 text-center rounded border border-outline-variant bg-surface-container-lowest font-mono font-semibold focus:ring-2 focus:ring-primary text-[13px]"
                          />
                        </td>
                        {/* Social Science */}
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={student.marks.socialScience}
                            onChange={(e) =>
                              handleMarkChange(student.id, "socialScience", e.target.value)
                            }
                            className="w-16 h-8 text-center rounded border border-outline-variant bg-surface-container-lowest font-mono font-semibold focus:ring-2 focus:ring-primary text-[13px]"
                          />
                        </td>
                        {/* English */}
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={student.marks.english}
                            onChange={(e) =>
                              handleMarkChange(student.id, "english", e.target.value)
                            }
                            className="w-16 h-8 text-center rounded border border-outline-variant bg-surface-container-lowest font-mono font-semibold focus:ring-2 focus:ring-primary text-[13px]"
                          />
                        </td>
                        {/* Total */}
                        <td className="py-3 px-3 text-center font-mono font-bold text-on-surface">
                          {totalMarks}
                        </td>
                        {/* Percentage */}
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[12px] ${
                              isPassing
                                ? "bg-success-container text-on-success-container"
                                : "bg-danger-container text-on-danger-container"
                            }`}
                          >
                            {pct}%
                          </span>
                        </td>
                        {/* Eligibility Status */}
                        <td className="py-3 px-4">
                          {isPassing ? (
                            <span className="px-2.5 py-1 rounded-full bg-success-container text-on-success-container font-label-md text-[11px] font-semibold flex items-center gap-1 w-fit">
                              <Icon name="verified" size={13} />
                              <T gu="પાત્ર (Eligible)" en="Eligible" hi="पात्र (Eligible)" />
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-danger-container text-on-danger-container font-label-md text-[11px] font-semibold flex items-center gap-1 w-fit">
                              <Icon name="error" size={13} />
                              <T gu="અપાત્ર (<50%)" en="Not Eligible" hi="अपात्र (<50%)" />
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 3: Upload Audit Log */}
        {activeTab === "audit" && (
          <section className="rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm p-6 flex flex-col gap-4">
            <h3 className="font-title-md text-title-md text-on-surface font-semibold">
              <T
                gu="અગાઉના અપલોડ અને સિંક ઑડિટ ઇતિહાસ"
                en="Upload & Sync Audit Log"
                hi="अपलोड एवं सिंक ऑडिट इतिहास"
              />
            </h3>
            <div className="divide-y divide-outline-variant/60">
              <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                    <Icon name="description" size={20} />
                  </div>
                  <div>
                    <p className="font-title-sm font-semibold text-on-surface">
                      attendance_oct_2025.xlsx
                    </p>
                    <p className="font-caption text-on-surface-variant">
                      ૧૨ ઓક્ટોબર ૨૦૨૫, ૧૦:૧૫ AM • ૮૪૨ રેકોર્ડ્સ • ૧૨ વિસંગતતાઓ • આચાર્ય ડો. કલ્પેશ શાહ
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-warning-container text-on-warning-container font-label-md text-[11px] font-bold w-fit">
                  <T gu="ચકાસણી ચાલુ" en="Validation In Progress" hi="सत्यापन जारी" />
                </span>
              </div>

              <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary">
                    <Icon name="cloud_done" size={20} />
                  </div>
                  <div>
                    <p className="font-title-sm font-semibold text-on-surface">
                      attendance_sep_2025_state_api.json
                    </p>
                    <p className="font-caption text-on-surface-variant">
                      ૧૫ સપ્ટેમ્બર ૨૦૨૫, ૦૪:૩૦ PM • ૮૪૦ રેકોર્ડ્સ • ૦ વિસંગતતા • CTS API સ્વચાલિત સિંક
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-success-container text-on-success-container font-label-md text-[11px] font-bold w-fit">
                  <T gu="સંપૂર્ણ સિંક" en="Fully Synced" hi="पूर्ण सिंक" />
                </span>
              </div>

              <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <Icon name="assignment" size={20} />
                  </div>
                  <div>
                    <p className="font-title-sm font-semibold text-on-surface">
                      term1_exam_marks_2025.xlsx
                    </p>
                    <p className="font-caption text-on-surface-variant">
                      ૧૦ સપ્ટેમ્બર ૨૦૨૫, ૧૧:૨૦ AM • ૮૩૮ રેકોર્ડ્સ • પરીક્ષા સમિતિ
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-success-container text-on-success-container font-label-md text-[11px] font-bold w-fit">
                  <T gu="માન્ય થયેલ" en="Approved" hi="स्वीकृत" />
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Sticky Wizard Bottom Controller */}
        <footer className="sticky bottom-4 z-30 p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Left: Resolved Status & Proceed Toggle */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-surface-container">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
              <span className="font-title-md text-title-md text-on-surface">
                <T
                  gu="૧૨ માંથી ૨ ક્ષતિઓ સુધારી છે"
                  en="2 of 12 anomalies resolved"
                  hi="12 में से 2 विसंगतियां सुधारी गईं"
                />
              </span>
              <span className="font-caption text-caption text-on-surface-variant font-medium">
                <T
                  gu={`(${remainingErrorsCount} બાકી છે)`}
                  en={`(${remainingErrorsCount} remaining)`}
                  hi={`(${remainingErrorsCount} शेष)`}
                />
              </span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface select-none">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
              />
              <span>
                <T
                  gu="ક્ષતિવાળા રેકોર્ડ્સ પછીથી સુધારવા માટે રાખી માન્ય રેકોર્ડ્સ આગળ ધપાવો"
                  en="Proceed with valid records while holding remaining anomalies for later"
                  hi="त्रुटिपूर्ण रिकॉर्ड बाद में सुधारने हेतु रख मान्य रिकॉर्ड आगे बढ़ाएं"
                />
              </span>
            </label>
          </div>

          {/* Right: Navigation CTAs */}
          <div className="flex flex-wrap items-center gap-3 justify-end">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-11 px-4 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high font-label-lg text-label-lg transition-colors flex items-center gap-2"
            >
              <Icon name="upload_file" size={18} />
              <span>
                <T gu="નવી ફાઇલ અપલોડ" en="Upload New File" hi="नई फाइल अपलोड" />
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                alert("ડ્રાફ્ટ સફળતાપૂર્વક સાચવવામાં આવ્યો છે! (Draft Saved Successfully)")
              }
              className="h-11 px-4 rounded-xl bg-surface-container-high text-primary hover:bg-surface-container-highest font-label-lg text-label-lg transition-colors flex items-center gap-2 shadow-sm font-semibold"
            >
              <Icon name="save" size={18} />
              <span>
                <T gu="ડ્રાફ્ટ સાચવો" en="Save Draft" hi="ड्राफ्ट सहेजें" />
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsConfirmModalOpen(true)}
              className="h-11 px-6 rounded-xl bg-secondary text-on-secondary font-label-lg text-label-lg hover:bg-secondary/90 transition-all flex items-center gap-2 shadow-md hover:shadow-lg font-bold"
            >
              <span>
                <T
                  gu="ડેટા માન્ય કરો અને શિષ્યવૃત્તિ સિંક કરો"
                  en="Validate & Sync Scholarships"
                  hi="डेटा सत्यापित करें एवं छात्रवृत्ति सिंक करें"
                />
              </span>
              <Icon name="arrow_forward" size={18} />
            </button>
          </div>
        </footer>

        {/* Confirmation Modal */}
        {isConfirmModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                    <Icon name="verified" size={24} />
                  </div>
                  <div>
                    <h3 className="font-title-lg text-title-lg text-on-surface font-bold">
                      <T
                        gu="ડેટા પુષ્ટિ અને શિષ્યવૃત્તિ સિંક"
                        en="Confirm & Sync Scholarship Data"
                        hi="डेटा पुष्टि एवं छात्रवृत्ति सिंक"
                      />
                    </h3>
                    <p className="font-caption text-caption text-on-surface-variant">
                      SC4 Attendance & Academic Engine
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container"
                >
                  <Icon name="close" size={20} />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2.5 text-on-surface font-body-sm text-body-sm">
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant">
                    <T gu="કુલ માન્ય વિદ્યાર્થીઓ:" en="Total Valid Students:" hi="कुल मान्य छात्र:" />
                  </span>
                  <span className="font-bold text-success font-mono text-[15px]">
                    ૮૩૨ (98.8%)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant">
                    <T
                      gu="બાકી વિસંગતતાવાળા રેકોર્ડ્સ:"
                      en="Pending Anomaly Records:"
                      hi="लंबित विसंगति रिकॉर्ड:"
                    />
                  </span>
                  <span className="font-bold text-danger font-mono text-[15px]">
                    {remainingErrorsCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant">
                    <T gu="લક્ષિત યોજનાઓ:" en="Target Schemes:" hi="लक्षित योजनाएं:" />
                  </span>
                  <span className="font-semibold text-primary">
                    નમો લક્ષ્મી અને જ્ઞાન સાધના સ્કીમ
                  </span>
                </div>
              </div>

              <p className="font-body-sm text-body-sm text-on-surface-variant">
                <T
                  gu="શું તમે ખરેખર આ ડેટા રાજ્ય શિષ્યવૃત્તિ પોર્ટલ (State Scholarship Engine) પર મોકલવા અને પાત્ર વિદ્યાર્થીઓને DBT માટે લિંક કરવા માંગો છો?"
                  en="Are you sure you want to push this verified dataset to the State Scholarship Engine and link eligible students for DBT disbursals?"
                  hi="क्या आप वाकई इस सत्यापित डेटा को राज्य छात्रवृत्ति पोर्टल पर भेजना और पात्र छात्रों को DBT हेतु लिंक करना चाहते हैं?"
                />
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="h-10 px-4 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md text-label-md transition-colors font-medium"
                >
                  <T gu="રદ કરો" en="Cancel" hi="रद्द करें" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsConfirmModalOpen(false);
                    setSubmissionSuccess(true);
                  }}
                  className="h-10 px-5 rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-all flex items-center gap-2 shadow-md font-bold"
                >
                  <Icon name="check_circle" size={18} />
                  <span>
                    <T
                      gu="પુષ્ટિ કરો અને સિંક કરો"
                      en="Confirm & Sync"
                      hi="पुष्टि करें और सिंक करें"
                    />
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Final Submission Success Banner / Modal */}
        {submissionSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-success/30 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-success-container flex items-center justify-center text-on-success-container">
                <Icon name="verified" size={36} />
              </div>
              <div>
                <h3 className="font-title-lg text-title-lg text-on-surface font-bold">
                  <T
                    gu="ડેટા ચકાસણી અને સિંક સંપન્ન!"
                    en="Data Validation & Sync Completed!"
                    hi="डेटा सत्यापन एवं सिंक संपन्न!"
                  />
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                  <T
                    gu="૮૩૨ વિદ્યાર્થીઓ નમો લક્ષ્મી અને જ્ઞાન સાધના શિષ્યવૃત્તિ સ્કીમ સાથે સફળતાપૂર્વક લિંક કરવામાં આવ્યા છે. DBT માટે પાત્રતા પ્રમાણિત થઈ ગઈ છે."
                    en="832 students have been successfully verified and linked to Namo Lakshmi & Gyan Sadhna Scholarship schemes for DBT disbursal."
                    hi="832 छात्रों को नमो लक्ष्मी और ज्ञान साधना छात्रवृत्ति योजना से सफलतापूर्वक लिंक कर दिया गया है।"
                  />
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSubmissionSuccess(false)}
                className="w-full h-11 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg hover:bg-primary-container transition-all shadow-md font-bold"
              >
                <T gu="ઠીક છે (Done)" en="Done" hi="ठीक है" />
              </button>
            </div>
          </div>
        )}
      </div>
    </OfficerShell>
  );
}
