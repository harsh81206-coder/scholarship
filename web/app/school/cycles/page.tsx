"use client";

import { useState } from "react";
import Link from "next/link";
import { MobileShell } from "@/components/shell/MobileShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import {Avatar} from "@/components/ui";

interface CycleStudent {
  id: string;
  nameGu: string;
  nameEn: string;
  nameHi: string;
  gradeGu: string;
  gradeEn: string;
  gradeHi: string;
  rollNo: string;
  ctsNumber: string;
  cycleId: string;
  cycleModel: string;
  status: "delivered" | "pending_otp" | "pending_scan";
  phone: string;
  otp: string;
  receiptNo?: string;
  deliveredTime?: string;
}

const INITIAL_STUDENTS: CycleStudent[] = [
  {
    id: "GJ-AND-2026-004512",
    nameGu: "રિયા હસમુખભાઈ પટેલ",
    nameEn: "Riya Hasmukhbhai Patel",
    nameHi: "रिया हसमुखभाई पटेल",
    gradeGu: "ધોરણ ૯-બી",
    gradeEn: "Class 9-B",
    gradeHi: "कक्षा 9-बी",
    rollNo: "૨૮",
    ctsNumber: "GJ-AND-2026-004512",
    cycleId: "SSB-2026-077432",
    cycleModel: "Atlas 20T Blue",
    status: "pending_otp",
    phone: "••••••8912",
    otp: "482913",
  },
  {
    id: "GJ-AND-2026-004529",
    nameGu: "પ્રિયા કિરણભાઈ વણકર",
    nameEn: "Priya Kiranbhai Vankar",
    nameHi: "प्रिया किरणभाई वणकर",
    gradeGu: "ધોરણ ૯-એ",
    gradeEn: "Class 9-A",
    gradeHi: "कक्षा 9-ए",
    rollNo: "૧૪",
    ctsNumber: "GJ-AND-2026-004529",
    cycleId: "SSB-2026-077420",
    cycleModel: "Atlas 20T Maroon",
    status: "delivered",
    phone: "••••••6641",
    otp: "619420",
    receiptNo: "REC-SSB-2026-0914",
    deliveredTime: "૧૨ ઓક્ટોબર, ૧૦:૧૫ AM",
  },
  {
    id: "GJ-AND-2026-005602",
    nameGu: "જીયા મુકેશકુમાર બ્રહ્મભટ્ટ",
    nameEn: "Jiya Mukeshkumar Brahmbhatt",
    nameHi: "जिया मुकेशकुमार ब्रह्मभट्ट",
    gradeGu: "ધોરણ ૯-એ",
    gradeEn: "Class 9-A",
    gradeHi: "कक्षा 9-ए",
    rollNo: "૨૨",
    ctsNumber: "GJ-AND-2026-005602",
    cycleId: "SSB-2026-077421",
    cycleModel: "Hero Sprint 20T",
    status: "delivered",
    phone: "••••••9024",
    otp: "518392",
    receiptNo: "REC-SSB-2026-0918",
    deliveredTime: "૧૨ ઓક્ટોબર, ૧૧:૦૦ AM",
  },
  {
    id: "GJ-AND-2026-005615",
    nameGu: "ભાવિકા રાજેશભાઈ રાઠોડ",
    nameEn: "Bhavika Rajeshbhai Rathod",
    nameHi: "भाविका राजेशभाई राठौड़",
    gradeGu: "ધોરણ ૯-સી",
    gradeEn: "Class 9-C",
    gradeHi: "कक्षा 9-सी",
    rollNo: "૦૯",
    ctsNumber: "GJ-AND-2026-005615",
    cycleId: "SSB-2026-077435",
    cycleModel: "Atlas 20T Blue",
    status: "pending_otp",
    phone: "••••••3104",
    otp: "740192",
  },
  {
    id: "GJ-AND-2026-005630",
    nameGu: "કિંજલ દિનેશભાઈ પટેલ",
    nameEn: "Kinjal Dineshbhai Patel",
    nameHi: "किंजल दिनेशभाई पटेल",
    gradeGu: "ધોરણ ૯-બી",
    gradeEn: "Class 9-B",
    gradeHi: "कक्षा 9-बी",
    rollNo: "૩૧",
    ctsNumber: "GJ-AND-2026-005630",
    cycleId: "SSB-2026-077436",
    cycleModel: "Hero Sprint 20T Blue",
    status: "pending_scan",
    phone: "••••••5582",
    otp: "891240",
  },
  {
    id: "GJ-AND-2026-005642",
    nameGu: "પૂજા મહેશભાઈ સોલંકી",
    nameEn: "Pooja Maheshbhai Solanki",
    nameHi: "पूजा महेशभाई सोलंकी",
    gradeGu: "ધોરણ ૯-સી",
    gradeEn: "Class 9-C",
    gradeHi: "कक्षा 9-सी",
    rollNo: "૧૮",
    ctsNumber: "GJ-AND-2026-005642",
    cycleId: "SSB-2026-077422",
    cycleModel: "Atlas 20T Maroon",
    status: "delivered",
    phone: "••••••7823",
    otp: "304912",
    receiptNo: "REC-SSB-2026-0922",
    deliveredTime: "૧૨ ઓક્ટોબર, ૧૧:૩૦ AM",
  },
];

export default function CycleHandoverPage() {
  const [activeTab, setActiveTab] = useState<"handover" | "batch">("handover");
  const [studentFilter, setStudentFilter] = useState<"all" | "pending" | "delivered">("all");
  const [students, setStudents] = useState<CycleStudent[]>(INITIAL_STUDENTS);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("GJ-AND-2026-004512");
  
  // Interactive scanner & micro-interaction states
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [flashOn, setFlashOn] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [syncDone, setSyncDone] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deliveredSuccess, setDeliveredSuccess] = useState<boolean>(false);
  const [teacherCertified, setTeacherCertified] = useState<boolean>(true);
  const [otpInput, setOtpInput] = useState<string[]>(["4", "8", "2", "9", "1", "3"]);
  const [resendingOtp, setResendingOtp] = useState<boolean>(false);
  const [otpResentToast, setOtpResentToast] = useState<boolean>(false);
  const [receiptModal, setReceiptModal] = useState<CycleStudent | null>(null);

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const deliveredCount = students.filter((s) => s.status === "delivered").length;
  const pendingCount = students.length - deliveredCount;

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSyncDone(true);
      setTimeout(() => setSyncDone(false), 3000);
    }, 1200);
  };

  const handleResendOtp = () => {
    setResendingOtp(true);
    setTimeout(() => {
      setResendingOtp(false);
      setOtpResentToast(true);
      setTimeout(() => setOtpResentToast(false), 3500);
    }, 800);
  };

  const handleSelectStudent = (student: CycleStudent) => {
    setSelectedStudentId(student.id);
    setDeliveredSuccess(student.status === "delivered");
    // Preload OTP chars
    const digits = student.otp.split("").slice(0, 6);
    setOtpInput(digits.length === 6 ? digits : ["4", "8", "2", "9", "1", "3"]);
  };

  const handleConfirmHandover = () => {
    if (!teacherCertified) {
      alert("કૃપા કરીને નોડલ શિક્ષક ડિજિટલ પ્રમાણીકરણ સ્વીકારો / Please check the certification box.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedReceipt = `REC-SSB-2026-09${Math.floor(10 + Math.random() * 89)}`;
      const updatedTime = "૧૨ ઓક્ટોબર, ૧૧:૪૫ AM";

      const updatedStudents = students.map((s) => {
        if (s.id === selectedStudent.id) {
          return {
            ...s,
            status: "delivered" as const,
            receiptNo: generatedReceipt,
            deliveredTime: updatedTime,
          };
        }
        return s;
      });

      setStudents(updatedStudents);
      setIsSubmitting(false);
      setDeliveredSuccess(true);
      setReceiptModal({
        ...selectedStudent,
        status: "delivered",
        receiptNo: generatedReceipt,
        deliveredTime: updatedTime,
      });
    }, 1100);
  };

  const filteredStudents = students.filter((s) => {
    if (studentFilter === "pending") return s.status !== "delivered";
    if (studentFilter === "delivered") return s.status === "delivered";
    return true;
  });

  return (
    <MobileShell role="school">
      <div className="min-h-screen bg-surface pb-16">
        {/* Top Header Banner for School Desk */}
        <div className="bg-surface-container-lowest border-b border-outline-variant px-4 py-4 md:px-8">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0">
                <Icon name="pedal_bike" size={24} className="text-primary" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-label-md text-label-md text-primary font-semibold">
                    <T
                      gu="સરસ્વતી સાધના • સાયકલ વિતરણ"
                      en="Saraswati Sadhana • Bicycle Distribution"
                      hi="सरस्वती साधना • साइकिल वितरण"
                    />
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-caption text-[11px] font-bold">
                    <T gu="સત્ર ૨૦૨૫-૨૬" en="Session 2025-26" hi="सत्र 2025-26" />
                  </span>
                </div>
                <h1 className="font-title-lg text-title-lg text-on-surface font-bold">
                  <T
                    gu="સાયકલ સ્કેનર અને વિદ્યાર્થી હેન્ડઓવર"
                    en="Cycle Scanner & Student Handover"
                    hi="साइकिल स्कैनर और छात्र वितरण"
                  />
                </h1>
                <span className="font-caption text-caption text-on-surface-variant">
                  <T
                    gu="શ્રી સરદાર પટેલ હાઈસ્કૂલ, આણંદ (UDISE: 24150104502)"
                    en="Shree Sardar Patel High School, Anand (UDISE: 24150104502)"
                    hi="श्री सरदार पटेल हाई स्कूल, आणंद (UDISE: 24150104502)"
                  />
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <Link
                href="/school/reports"
                className="btn-outline h-9 px-3 rounded-lg flex items-center gap-1.5 text-label-md"
              >
                <Icon name="bar_chart" size={16} />
                <T gu="વિતરણ રિપોર્ટ" en="Distribution Report" hi="वितरण रिपोर्ट" />
              </Link>
            </div>
          </div>
        </div>

        {/* Responsive Content Container */}
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Nodal Teacher Meta Bar */}
          <div className="card p-3 sm:p-4 flex items-center justify-between gap-3 bg-surface-container-lowest">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
                <Icon name="badge" size={20} className="text-primary" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-lg text-label-lg text-on-surface font-bold truncate">
                  <T gu="શ્રી આર. કે. પટેલ" en="Shri R. K. Patel" hi="श्री आर. के. पटेल" />
                </span>
                <span className="font-caption text-caption text-on-surface-variant truncate">
                  <T
                    gu="નોડલ શિક્ષક • સાયકલ વિતરણ ડેસ્ક"
                    en="Nodal Teacher • Bicycle Distribution Desk"
                    hi="नोडल शिक्षक • साइकिल वितरण डेस्क"
                  />
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <span className="font-caption text-caption text-primary font-semibold">
                <T gu="ડેસ્ક સક્રિય" en="Desk Active" hi="डेस्क सक्रिय" />
              </span>
            </div>
          </div>

          {/* Live Counter & Offline Sync Banner */}
          <div className="card p-5 space-y-4 bg-surface-container-lowest">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="font-caption text-caption text-on-surface-variant font-medium block">
                  <T
                    gu="સરસ્વતી સાધના વિતરણ પ્રગતિ"
                    en="Saraswati Sadhana Distribution Progress"
                    hi="सरस्वती साधना वितरण प्रगति"
                  />
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-headline-lg text-headline-lg text-primary font-bold">
                    {96 + (deliveredCount > 3 ? deliveredCount - 3 : 0)}
                  </span>
                  <span className="font-title-md text-title-md text-on-surface-variant">
                    <T gu="/ ૧૨૦ વિતરિત" en="/ 120 Delivered" hi="/ 120 वितरित" />
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-label-lg text-label-lg text-secondary font-bold px-3 py-1 rounded-full bg-secondary-fixed">
                  {Math.round(((96 + (deliveredCount > 3 ? deliveredCount - 3 : 0)) / 120) * 100)}%{" "}
                  <T gu="સંપન્ન" en="Completed" hi="पूर्ण" />
                </span>
                <span className="font-caption text-caption text-on-surface-variant block mt-1.5">
                  {120 - (96 + (deliveredCount > 3 ? deliveredCount - 3 : 0))}{" "}
                  <T gu="સ્ટોકમાં બાકી" en="Remaining in Stock" hi="स्टॉक में शेष" />
                </span>
              </div>
            </div>

            {/* Linear Progress Bar */}
            <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round(((96 + (deliveredCount > 3 ? deliveredCount - 3 : 0)) / 120) * 100)}%`,
                }}
              />
            </div>

            {/* Sync Status Pill & Manual Sync */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-outline-variant/40">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-on-surface">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse-dot" />
                <span className="font-caption text-caption font-medium">
                  <T
                    gu="ઑફલાઇન મોડ સક્ષમ • ૪ લોકલ ટ્રાન્ઝેક્શન પેન્ડિંગ"
                    en="Offline Mode Ready • 4 local transactions queued"
                    hi="ऑफ़लाइन मोड तैयार • 4 स्थानीय लेनदेन लंबित"
                  />
                </span>
              </div>

              <button
                type="button"
                onClick={handleSync}
                disabled={syncing}
                className="inline-flex items-center gap-1.5 font-label-md text-label-md text-primary font-semibold hover:text-primary-container transition-colors py-1 px-2 rounded-lg hover:bg-surface-container-low"
              >
                <Icon
                  name={syncDone ? "check_circle" : "sync"}
                  size={16}
                  className={syncing ? "animate-spin text-primary" : syncDone ? "text-success" : ""}
                />
                <span>
                  {syncing ? (
                    <T gu="સિંક થઈ રહ્યું છે..." en="Syncing with portal..." hi="पोर्टल के साथ सिंक हो रहा है..." />
                  ) : syncDone ? (
                    <T gu="સિંક પૂર્ણ ✓" en="Sync Completed ✓" hi="सिंक पूर्ण ✓" />
                  ) : (
                    <T gu="હમણાં સિંક કરો" en="Sync Now" hi="अभी सिंक करें" />
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* Module Switcher Tabs: 1. Batch Receive vs 2. Cycle Handover */}
          <div className="bg-surface-container-high p-1 rounded-xl flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("batch")}
              className={`flex-1 py-2.5 px-3 rounded-lg font-label-lg text-label-lg transition-all text-center ${
                activeTab === "batch"
                  ? "bg-surface-container-lowest text-primary font-bold shadow-sm"
                  : "text-on-surface-variant font-medium hover:text-on-surface"
              }`}
            >
              <T
                gu="૧. બેચ રિસીવ (Vendor)"
                en="1. Batch Receive (Vendor)"
                hi="1. बैच प्राप्ति (विक्रेता)"
              />
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("handover")}
              className={`flex-1 py-2.5 px-3 rounded-lg font-label-lg text-label-lg transition-all text-center ${
                activeTab === "handover"
                  ? "bg-surface-container-lowest text-primary font-bold shadow-sm"
                  : "text-on-surface-variant font-medium hover:text-on-surface"
              }`}
            >
              <T
                gu="૨. સાયકલ હેન્ડઓવર (Live)"
                en="2. Cycle Handover (Live)"
                hi="2. साइकिल वितरण (लाइव)"
              />
            </button>
          </div>

          {/* If Batch Receive tab is clicked */}
          {activeTab === "batch" && (
            <div className="card p-6 space-y-4 bg-surface-container-lowest animate-fade-in">
              <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                    <Icon name="local_shipping" size={22} />
                  </div>
                  <div>
                    <h3 className="font-title-md text-title-md font-bold text-on-surface">
                      <T
                        gu="વેન્ડર ડિલિવરી ચલણ અને બેચ વેરિફિકેશન"
                        en="Vendor Delivery Challan & Batch Verification"
                        hi="विक्रेता डिलीवरी चालान और बैच सत्यापन"
                      />
                    </h3>
                    <p className="font-caption text-caption text-on-surface-variant">
                      <T
                        gu="જિલ્લા ડેપો તરફથી પ્રાપ્ત થયેલ સાયકલ કન્સાઇનમેન્ટ"
                        en="Cycle consignment received from District Depot"
                        hi="जिला डिपो से प्राप्त साइकिल कन्साइनमेंट"
                      />
                    </p>
                  </div>
                </div>
                <span className="chip chip-approved">
                  <Icon name="check_circle" size={14} fill />
                  <T gu="ચકાસાયેલ" en="Verified" hi="सत्यापित" />
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
                <div className="p-3 rounded-lg bg-surface-container-low">
                  <span className="font-caption text-caption text-on-surface-variant">
                    <T gu="ચલણ નંબર:" en="Challan No:" hi="चालान संख्या:" />
                  </span>
                  <p className="font-label-lg text-label-lg font-bold font-mono text-on-surface mt-0.5">
                    DEP-AND-8891
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-surface-container-low">
                  <span className="font-caption text-caption text-on-surface-variant">
                    <T gu="કુલ જથ્થો:" en="Total Quantity:" hi="कुल मात्रा:" />
                  </span>
                  <p className="font-label-lg text-label-lg font-bold text-primary mt-0.5">
                    ૧૨૦ / ૧૨૦ <T gu="સાયકલો" en="Bicycles" hi="साइकिलें" />
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-surface-container-low">
                  <span className="font-caption text-caption text-on-surface-variant">
                    <T gu="વેન્ડર વિગતો:" en="Vendor Details:" hi="विक्रेता विवरण:" />
                  </span>
                  <p className="font-label-lg text-label-lg font-bold text-on-surface mt-0.5">
                    Atlas Logistics Gujarat
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-primary-fixed/30 border border-primary-fixed flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="verified" size={20} className="text-primary" />
                  <span className="font-body-sm text-body-sm text-on-surface">
                    <T
                      gu="૧૨૦ સાયકલના QR કોડ અને ફ્રેમ નંબર શાળા સ્ટોકમાં દાખલ થઈ ચૂક્યા છે."
                      en="120 bicycle QR codes and frame serials are already registered into school stock."
                      hi="120 साइकिलों के क्यूआर कोड और फ्रेम सीरियल पहले ही स्कूल स्टॉक में दर्ज हो चुके हैं।"
                    />
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("handover")}
                  className="btn-primary h-9 px-3 text-label-sm shrink-0"
                >
                  <T gu="હેન્ડઓવર શરૂ કરો →" en="Start Handover →" hi="वितरण शुरू करें →" />
                </button>
              </div>
            </div>
          )}

          {/* 3-Step Guided Workflow Indicator */}
          <div className="card px-4 py-3 bg-surface-container-lowest">
            <div className="flex items-center justify-between relative max-w-md mx-auto">
              <div className="absolute left-6 right-6 top-4 h-0.5 bg-surface-container-high -z-0">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{
                    width: deliveredSuccess ? "100%" : isScanning ? "35%" : "70%",
                  }}
                />
              </div>

              {/* Step 1 */}
              <div className="flex flex-col items-center gap-1 z-10">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm">
                  <Icon name="qr_code_scanner" size={18} />
                </div>
                <span className="font-caption text-caption text-primary font-bold">
                  <T gu="૧. QR સ્કેન" en="1. QR Scan" hi="1. QR स्कैन" />
                </span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center gap-1 z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm font-label-md text-label-md font-bold transition-colors ${
                    deliveredSuccess
                      ? "bg-primary text-on-primary"
                      : "bg-primary-container text-on-primary"
                  }`}
                >
                  {deliveredSuccess ? <Icon name="check" size={16} /> : "૨"}
                </div>
                <span className="font-caption text-caption text-primary font-bold">
                  <T gu="૨. OTP પુષ્ટિ" en="2. OTP Verify" hi="2. OTP पुष्टि" />
                </span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center gap-1 z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-label-md text-label-md font-medium transition-colors ${
                    deliveredSuccess
                      ? "bg-primary text-on-primary font-bold shadow-sm"
                      : "bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  {deliveredSuccess ? <Icon name="check" size={16} /> : "૩"}
                </div>
                <span
                  className={`font-caption text-caption font-medium ${
                    deliveredSuccess ? "text-primary font-bold" : "text-on-surface-variant"
                  }`}
                >
                  <T gu="૩. પુરાવો & પાવતી" en="3. Proof & Receipt" hi="3. प्रमाण व रसीद" />
                </span>
              </div>
            </div>
          </div>

          {/* Responsive Layout: Split Columns on Desktop (Left Scanner & Workflow, Right Student Selection & Status) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Live Scanner + Selected Student Verification (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Live QR Scanner Viewfinder Mockup */}
              <div className="card p-5 space-y-3 bg-surface-container-lowest">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="qr_code_scanner" size={20} className="text-primary" />
                    <span className="font-title-md text-title-md text-on-surface font-semibold">
                      <T
                        gu="સાયકલ QR કોડ સ્કેનર"
                        en="Cycle Frame QR Code Scanner"
                        hi="साइकिल फ्रेम QR कोड स्कैनर"
                      />
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-md text-label-md text-on-secondary-fixed-variant px-2.5 py-0.5 rounded-full bg-secondary-fixed flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                      <T gu="લાઇવ કેમેરા" en="Live Camera" hi="लाइव कैमरा" />
                    </span>
                  </div>
                </div>

                {/* Viewfinder Box */}
                <div className="relative w-full h-64 bg-inverse-surface rounded-xl overflow-hidden flex flex-col justify-between p-3.5 shadow-inner">
                  {/* Subdued Grid Overlay */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Camera Controls */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="font-caption text-caption text-inverse-on-surface px-2.5 py-1 rounded bg-black/50 backdrop-blur-md flex items-center gap-1">
                      <Icon name="center_focus_strong" size={14} />
                      <T gu="ફ્રેમ સેન્ટર કરો" en="Center Cycle QR" hi="साइकिल क्यूआर सेंटर करें" />
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFlashOn(!flashOn)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                          flashOn ? "bg-secondary text-on-secondary" : "bg-black/50 text-white hover:bg-black/70"
                        }`}
                        title="Flashlight"
                      >
                        <Icon name={flashOn ? "flash_on" : "flash_off"} size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsScanning(!isScanning)}
                        className="w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/70 transition-colors"
                        title="Switch Camera"
                      >
                        <Icon name="flip_camera_ios" size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Reticle Target Corners */}
                  <div className="relative self-center w-44 h-44 flex items-center justify-center">
                    <div className="absolute top-0 left-0 w-7 h-7 border-t-4 border-l-4 border-secondary rounded-tl-md" />
                    <div className="absolute top-0 right-0 w-7 h-7 border-t-4 border-r-4 border-secondary rounded-tr-md" />
                    <div className="absolute bottom-0 left-0 w-7 h-7 border-b-4 border-l-4 border-secondary rounded-bl-md" />
                    <div className="absolute bottom-0 right-0 w-7 h-7 border-b-4 border-r-4 border-secondary rounded-br-md" />

                    {/* Animated Scanline */}
                    {isScanning && (
                      <div className="absolute w-40 h-0.5 bg-gradient-to-r from-transparent via-secondary to-transparent shadow-[0_0_12px_#F97316] animate-pulse" />
                    )}

                    <div className="flex flex-col items-center justify-center opacity-30 text-inverse-on-surface">
                      <Icon name="pedal_bike" size={44} />
                      <span className="font-caption text-[10px] tracking-wider mt-1">FRAME QR</span>
                    </div>
                  </div>

                  {/* Detected Barcode Notification Toast */}
                  <div className="relative z-10 bg-surface-container-lowest/95 backdrop-blur-md p-2.5 rounded-lg shadow-sm flex items-center justify-between gap-2 border border-outline-variant/40">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
                        <Icon name="check_circle" size={18} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-label-md text-label-md text-on-surface font-bold font-mono truncate">
                            {selectedStudent.cycleId}
                          </span>
                          <span className="font-caption text-caption text-secondary font-bold">
                            {selectedStudent.cycleModel}
                          </span>
                        </div>
                        <span className="font-caption text-caption text-on-surface-variant truncate block">
                          <T
                            gu="ગુજરાત નોડલ ડિપો સીલ: પાસ ✓"
                            en="Gujarat Nodal Depot Seal: Passed ✓"
                            hi="गुजरात नोडल डिपो सील: पास ✓"
                          />
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsScanning(true);
                        alert(`QR Scanned successfully: ${selectedStudent.cycleId} matched with ${selectedStudent.nameGu}`);
                      }}
                      className="px-2.5 py-1 rounded bg-primary-fixed text-primary hover:bg-primary hover:text-on-primary transition-colors font-label-md text-xs font-semibold shrink-0"
                    >
                      <T gu="રી-સ્કેન" en="Re-scan" hi="पुनः स्कैन" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 2: Auto-Detected Student Profile Card & OTP Verification */}
              <div className="card p-5 space-y-4 bg-surface-container-lowest">
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <Avatar name={selectedStudent.nameEn} size="lg" className="w-14 h-14 text-lg" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[11px] shadow-sm font-bold">
                      ✓
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="font-title-md text-title-md text-on-surface font-bold truncate">
                        <T
                          gu={selectedStudent.nameGu}
                          en={selectedStudent.nameEn}
                          hi={selectedStudent.nameHi}
                        />
                      </h2>
                      <span
                        className={`chip text-[11px] ${
                          selectedStudent.status === "delivered" || deliveredSuccess
                            ? "chip-approved"
                            : "chip-pending"
                        }`}
                      >
                        <Icon
                          name={
                            selectedStudent.status === "delivered" || deliveredSuccess
                              ? "check_circle"
                              : "schedule"
                          }
                          size={12}
                          fill
                        />
                        {selectedStudent.status === "delivered" || deliveredSuccess ? (
                          <T gu="હેન્ડઓવર પૂર્ણ" en="Delivered" hi="वितरित" />
                        ) : (
                          <T gu="OTP પુષ્ટિ પેન્ડિંગ" en="Pending OTP" hi="OTP लंबित" />
                        )}
                      </span>
                    </div>

                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      <T
                        gu={`${selectedStudent.gradeGu} • રોલ નં: ${selectedStudent.rollNo}`}
                        en={`${selectedStudent.gradeEn} • Roll No: ${selectedStudent.rollNo}`}
                        hi={`${selectedStudent.gradeHi} • रोल नं: ${selectedStudent.rollNo}`}
                      />
                    </p>

                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="font-caption text-caption bg-surface-container px-2 py-0.5 rounded text-on-surface font-mono font-medium">
                        CTS: {selectedStudent.ctsNumber}
                      </span>
                      <span className="font-caption text-caption bg-surface-container-high px-2 py-0.5 rounded text-primary font-semibold">
                        DEO Approved ✓
                      </span>
                    </div>
                  </div>
                </div>

                {/* Scheme Badge Banner */}
                <div className="p-3 rounded-lg bg-surface-container-low flex items-center gap-2.5">
                  <Icon name="workspace_premium" size={20} className="text-secondary shrink-0" />
                  <span className="font-caption text-caption text-on-surface font-medium">
                    <T
                      gu="સરસ્વતી સાધના યોજના (મુક્ત સાયકલ સહાય ૨૦૨૫-૨૬) • માન્ય લાભાર્થી"
                      en="Saraswati Sadhana Yojana (Free Cycle Scheme 2025-26) • Approved Beneficiary"
                      hi="सरस्वती साधना योजना (निःशुल्क साइकिल सहायता 2025-26) • स्वीकृत लाभार्थी"
                    />
                  </span>
                </div>

                {/* Delivery OTP Box */}
                <div className="space-y-3 pt-1 border-t border-outline-variant/40">
                  <div className="flex items-center justify-between">
                    <label className="font-label-lg text-label-lg text-on-surface font-semibold block">
                      <T
                        gu="વિદ્યાર્થી / વાલી OTP પુષ્ટિ"
                        en="Student / Parent OTP Verification"
                        hi="छात्र / अभिभावक OTP सत्यापन"
                      />{" "}
                      <span className="text-error">*</span>
                    </label>
                    <span className="font-caption text-caption text-primary font-semibold flex items-center gap-1">
                      <Icon name="verified" size={14} />
                      <T gu="આધાર પ્રમાણિત ✓" en="Aadhaar Verified ✓" hi="आधार सत्यापित ✓" />
                    </span>
                  </div>

                  <p className="font-caption text-caption text-on-surface-variant">
                    <T
                      gu={`રજિસ્ટર્ડ નંબર (${selectedStudent.phone}) પર મોકલેલ ૬-અંકનો સુરક્ષિત કોડ:`}
                      en={`6-digit secure code sent to registered mobile (${selectedStudent.phone}):`}
                      hi={`पंजीकृत मोबाइल (${selectedStudent.phone}) पर भेजा गया 6-अंकीय सुरक्षित कोड:`}
                    />
                  </p>

                  {/* 6-Digit OTP Cells */}
                  <div className="grid grid-cols-6 gap-2">
                    {otpInput.map((digit, idx) => (
                      <div
                        key={idx}
                        className="h-12 rounded-lg bg-surface-container-low border border-outline-variant/60 shadow-xs flex items-center justify-center font-headline-sm text-headline-sm text-primary font-bold font-mono"
                      >
                        {digit}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-caption text-caption text-on-surface-variant">
                      <T
                        gu="OTP માન્યતા અવધિ: ૦૮:૨૪ મિનિટ"
                        en="OTP Validity: 08:24 mins"
                        hi="OTP वैधता: 08:24 मिनट"
                      />
                    </span>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendingOtp}
                      className="font-label-md text-label-md text-secondary font-semibold hover:underline flex items-center gap-1"
                    >
                      {resendingOtp ? (
                        <>
                          <Icon name="refresh" size={14} className="animate-spin" />
                          <T gu="મોકલી રહ્યું છે..." en="Sending..." hi="भेज रहा है..." />
                        </>
                      ) : (
                        <T gu="ફરી મોકલો (Resend OTP)" en="Resend OTP" hi="OTP पुनः भेजें" />
                      )}
                    </button>
                  </div>

                  {otpResentToast && (
                    <div className="p-2 rounded bg-success-container text-on-success-container font-caption text-caption flex items-center gap-1.5 animate-fade-in">
                      <Icon name="check_circle" size={14} />
                      <T
                        gu="નવો OTP સફળતાપૂર્વક મોકલવામાં આવ્યો છે!"
                        en="New OTP has been dispatched to student's registered mobile!"
                        hi="नया OTP छात्र के पंजीकृत मोबाइल पर भेज दिया गया है!"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3: Geo-Tagged Handover Proof & Teacher Declaration */}
              <div className="card p-5 space-y-4 bg-surface-container-lowest">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="add_a_photo" size={20} className="text-primary" />
                    <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                      <T
                        gu="જીઓ-ટેગ ડિલિવરી પુરાવો (Photo Proof)"
                        en="Geo-Tagged Delivery Proof Photo"
                        hi="जियो-टैग डिलीवरी प्रमाण फोटो"
                      />
                    </h3>
                  </div>
                  <span className="font-label-md text-label-md text-primary font-semibold px-2.5 py-0.5 rounded-full bg-primary-fixed">
                    <T gu="પગલું ૩" en="Step 3" hi="चरण 3" />
                  </span>
                </div>

                {/* Captured Picture Proof Container */}
                <div className="relative rounded-xl overflow-hidden shadow-sm bg-gradient-to-br from-primary-container/20 to-surface-container-high h-44 flex flex-col justify-between p-3 border border-outline-variant">
                  {/* Photo Visual Graphic placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none">
                    <div className="flex items-center gap-4">
                      <Icon name="person" size={72} />
                      <Icon name="pedal_bike" size={72} />
                    </div>
                  </div>

                  <div className="relative z-10 flex justify-between items-start">
                    <span className="px-2 py-0.5 rounded bg-black/60 text-white font-caption text-xs backdrop-blur-md">
                      <T
                        gu="શાળા પ્રાંગણ કેમેરા"
                        en="School Campus Camera"
                        hi="स्कूल परिसर कैमरा"
                      />
                    </span>

                    <button
                      type="button"
                      onClick={() => alert("કેમેરા સક્રિય: ફોટો પુનઃ પ્રાપ્ત થયો.")}
                      className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-caption text-caption flex items-center gap-1 hover:bg-black/80 transition-colors"
                    >
                      <Icon name="refresh" size={14} />
                      <T gu="ફરી ક્લિક કરો" en="Retake Photo" hi="पुनः फोटो लें" />
                    </button>
                  </div>

                  {/* Live Watermark Tagging Scrim */}
                  <div className="relative z-10 bg-black/75 backdrop-blur-md p-2.5 rounded-lg text-white space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Icon name="location_on" size={16} className="text-secondary" />
                      <span className="font-caption text-caption text-white font-medium truncate">
                        ૨૨.૫૬૪૫° N, ૭૨.૯૨૮૯° E • સરદાર પટેલ હાઈસ્કૂલ, આણંદ
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-300">
                        {selectedStudent.deliveredTime || "૧૨ ઓક્ટોબર ૨૦૨૫ • ૧૧:૪૨:૧૮ AM"}
                      </span>
                      <span className="bg-secondary px-2 py-0.5 rounded text-white font-bold uppercase tracking-wider text-[10px]">
                        <T gu="જીઓ-વેરિફાઈડ" en="Geo-Verified" hi="जियो-सत्यापित" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Teacher Digital Undertaking Checkbox */}
                <label className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low cursor-pointer select-none border border-outline-variant/60">
                  <input
                    type="checkbox"
                    checked={teacherCertified}
                    onChange={(e) => setTeacherCertified(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded bg-surface-container-lowest text-primary focus:ring-primary cursor-pointer"
                  />
                  <span className="font-body-sm text-body-sm text-on-surface leading-snug">
                    <T
                      gu={`હું શાળા નોડલ શિક્ષક તરીકે પ્રમાણિત કરું છું કે નવી સરસ્વતી સાધના સાયકલ સંપૂર્ણ સુસજ્જ અને ચાલુ હાલતમાં વિદ્યાર્થિની ${selectedStudent.nameGu}ને સુપરત કરેલ છે.`}
                      en={`I, as the school Nodal Teacher, hereby certify that the new Saraswati Sadhana bicycle is complete, in functional order, and handed over to ${selectedStudent.nameEn}.`}
                      hi={`मैं स्कूल नोडल शिक्षक के रूप में प्रमाणित करता हूँ कि नई सरस्वती साधना साइकिल पूरी तरह से चालू हालत में छात्रा ${selectedStudent.nameHi} को सौंप दी गई है।`}
                    />
                  </span>
                </label>

                {/* Action CTAs */}
                <div className="space-y-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleConfirmHandover}
                    disabled={isSubmitting || selectedStudent.status === "delivered" || deliveredSuccess}
                    className={`w-full h-12 font-label-lg text-label-lg font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all ${
                      selectedStudent.status === "delivered" || deliveredSuccess
                        ? "bg-success text-on-success"
                        : "bg-secondary hover:opacity-90 text-on-secondary active:scale-[0.99]"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Icon name="progress_activity" size={20} className="animate-spin" />
                        <span>
                          <T
                            gu="ડિજિટલ પાવતી તૈયાર થાય છે..."
                            en="Generating Digital Receipt..."
                            hi="डिजिटल रसीद तैयार हो रही है..."
                          />
                        </span>
                      </>
                    ) : selectedStudent.status === "delivered" || deliveredSuccess ? (
                      <>
                        <Icon name="check_circle" size={20} fill />
                        <span>
                          <T
                            gu="ડિલિવરી પૂર્ણ • પાવતી જનરેટ થઈ ✓"
                            en="Handover Complete • Receipt Generated ✓"
                            hi="वितरण पूर्ण • रसीद जनरेट हुई ✓"
                          />
                        </span>
                      </>
                    ) : (
                      <>
                        <span>
                          <T
                            gu="ડિલિવરી પુષ્ટિ કરો અને પાવતી બનાવો"
                            en="Confirm Handover & Generate Receipt"
                            hi="वितरण पुष्टि करें और रसीद बनाएं"
                          />
                        </span>
                        <Icon name="arrow_forward" size={20} />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      // Switch to next pending student
                      const nextPending = students.find(
                        (s) => s.status !== "delivered" && s.id !== selectedStudent.id
                      );
                      if (nextPending) {
                        handleSelectStudent(nextPending);
                      } else {
                        alert("તમામ પાત્ર વિદ્યાર્થીઓનું વિતરણ પૂર્ણ થઈ ગયું છે!");
                      }
                    }}
                    className="w-full h-11 bg-surface-container-lowest hover:bg-surface-container text-primary font-label-lg text-label-lg font-semibold rounded-xl shadow-xs border border-outline-variant flex items-center justify-center gap-2 transition-all"
                  >
                    <Icon name="qr_code_scanner" size={18} />
                    <span>
                      <T
                        gu="અન્ય સાયકલ સ્કેન કરો (Scan Next Student)"
                        en="Scan Next Cycle / Student"
                        hi="अन्य साइकिल / छात्र स्कैन करें"
                      />
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Student List with Handover Status (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="card p-4 space-y-3 bg-surface-container-lowest">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="checklist" size={20} className="text-primary" />
                    <h3 className="font-title-md text-title-md text-on-surface font-bold">
                      <T
                        gu="વિદ્યાર્થી વિતરણ યાદી"
                        en="Student Handover Roster"
                        hi="छात्र वितरण सूची"
                      />
                    </h3>
                  </div>
                  <span className="font-caption text-caption text-on-surface-variant">
                    {students.length} <T gu="વિદ્યાર્થીઓ" en="Students" hi="छात्र" />
                  </span>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 p-1 bg-surface-container-high rounded-lg text-label-sm">
                  <button
                    type="button"
                    onClick={() => setStudentFilter("all")}
                    className={`flex-1 py-1.5 rounded-md font-medium text-center transition-all ${
                      studentFilter === "all"
                        ? "bg-surface-container-lowest text-primary font-bold shadow-xs"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    <T gu="તમામ" en="All" hi="सभी" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setStudentFilter("pending")}
                    className={`flex-1 py-1.5 rounded-md font-medium text-center transition-all ${
                      studentFilter === "pending"
                        ? "bg-surface-container-lowest text-secondary font-bold shadow-xs"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    <T gu="બાકી (Pending)" en="Pending" hi="लंबित" /> ({pendingCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStudentFilter("delivered")}
                    className={`flex-1 py-1.5 rounded-md font-medium text-center transition-all ${
                      studentFilter === "delivered"
                        ? "bg-surface-container-lowest text-success font-bold shadow-xs"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    <T gu="પૂર્ણ (Done)" en="Delivered" hi="पूर्ण" /> ({deliveredCount})
                  </button>
                </div>

                {/* Student Scrollable List */}
                <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
                  {filteredStudents.map((st) => {
                    const isSelected = st.id === selectedStudent.id;
                    const isDone = st.status === "delivered";

                    return (
                      <div
                        key={st.id}
                        onClick={() => handleSelectStudent(st)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? "bg-primary-fixed/30 border-primary shadow-xs ring-1 ring-primary"
                            : "bg-surface-container-low hover:bg-surface-container-high border-outline-variant/60"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar name={st.nameEn} size="md" className="shrink-0" />
                          <div className="min-w-0">
                            <h4 className="font-label-lg text-label-lg text-on-surface font-bold truncate">
                              <T gu={st.nameGu} en={st.nameEn} hi={st.nameHi} />
                            </h4>
                            <p className="font-caption text-caption text-on-surface-variant truncate">
                              <T gu={st.gradeGu} en={st.gradeEn} hi={st.gradeHi} /> •{" "}
                              <span className="font-mono">{st.cycleId}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end shrink-0 gap-1">
                          {isDone ? (
                            <span className="chip chip-approved text-[11px] py-0 px-2">
                              <Icon name="check_circle" size={12} fill />
                              <T gu="વિતરિત" en="Delivered" hi="वितरित" />
                            </span>
                          ) : st.status === "pending_otp" ? (
                            <span className="chip chip-pending text-[11px] py-0 px-2">
                              <Icon name="key" size={12} />
                              <T gu="OTP બાકી" en="OTP Wait" hi="OTP शेष" />
                            </span>
                          ) : (
                            <span className="chip chip-inprogress text-[11px] py-0 px-2">
                              <Icon name="qr_code_scanner" size={12} />
                              <T gu="સ્કેન કરો" en="Scan" hi="स्कैन" />
                            </span>
                          )}

                          {isDone && st.receiptNo && (
                            <span className="font-caption text-[10px] text-primary font-mono font-semibold">
                              {st.receiptNo}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Vendor Batch Summary Card */}
              <div className="card p-4 space-y-2 bg-surface-container-lowest">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="local_shipping" size={18} className="text-on-surface-variant" />
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                      <T
                        gu="તાજેતરની વેન્ડર બેચ ચકાસણી"
                        en="Recent Vendor Batch Verification"
                        hi="हालिया विक्रेता बैच सत्यापन"
                      />
                    </span>
                  </div>
                  <span className="font-caption text-caption text-primary font-bold">
                    <T gu="પૂર્ણ ✓" en="Verified ✓" hi="पूर्ण ✓" />
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-container-low text-on-surface space-y-1">
                  <div className="flex items-center justify-between text-body-sm">
                    <span className="font-semibold">Batch #B-2026-0145 (Atlas Logistics)</span>
                    <span className="font-label-md text-label-md text-secondary font-bold">
                      ૧૨૦ / ૧૨૦ <T gu="સ્વીકૃત" en="Accepted" hi="स्वीकृत" />
                    </span>
                  </div>
                  <p className="font-caption text-caption text-on-surface-variant">
                    <T
                      gu="ડીપો ચલણ: DEP-AND-8891 • પ્રાપ્તિ તારીખ: ૧૧ ઓક્ટોબર ૨૦૨૫"
                      en="Depot Challan: DEP-AND-8891 • Received: Oct 11, 2025"
                      hi="डिपो चालान: DEP-AND-8891 • प्राप्ति: 11 अक्टूबर 2025"
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Compliance Seal */}
          <div className="flex items-center justify-center gap-2 py-4 text-center text-on-surface-variant border-t border-outline-variant/40">
            <Icon name="verified_user" size={16} className="text-primary" />
            <span className="font-caption text-caption">
              <T
                gu="શિક્ષણ વિભાગ, ગુજરાત સરકાર • વિદ્યા પ્રગતિ સેતુ ૨૦૨૫-૨૬"
                en="Education Department, Government of Gujarat • Vidya Pragati Setu 2025-26"
                hi="शिक्षा विभाग, गुजरात सरकार • विद्या प्रगति सेतु 2025-26"
              />
            </span>
          </div>
        </div>

        {/* Modal: Digital Receipt Confirmation Popup */}
        {receiptModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 space-y-4 shadow-level-3 border border-outline-variant">
              <div className="w-12 h-12 rounded-full bg-success-container text-on-success-container flex items-center justify-center mx-auto">
                <Icon name="check_circle" size={32} />
              </div>

              <div className="text-center space-y-1">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  <T
                    gu="સાયકલ વિતરણ પાવતી જનરેટ થઈ!"
                    en="Cycle Handover Receipt Generated!"
                    hi="साइकिल वितरण रसीद जनरेट हुई!"
                  />
                </h3>
                <p className="font-caption text-caption text-on-surface-variant">
                  <T
                    gu="સરસ્વતી સાધના યોજના અંતર્ગત ડિજિટલ પુરાવો સ્વીકારવામાં આવ્યો છે."
                    en="Digital proof accepted under Saraswati Sadhana Yojana."
                    hi="सरस्वती साधना योजना के तहत डिजिटल प्रमाण स्वीकार कर लिया गया है।"
                  />
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low space-y-2 text-on-surface font-body-sm text-sm border border-outline-variant/60">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">
                    <T gu="પાવતી નં:" en="Receipt No:" hi="रसीद नं:" />
                  </span>
                  <span className="font-bold font-mono text-primary">{receiptModal.receiptNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">
                    <T gu="વિદ્યાર્થિની:" en="Student:" hi="छात्रा:" />
                  </span>
                  <span className="font-bold">
                    <T
                      gu={receiptModal.nameGu}
                      en={receiptModal.nameEn}
                      hi={receiptModal.nameHi}
                    />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">
                    <T gu="સાયકલ મોડેલ:" en="Cycle Model:" hi="साइकिल मॉडल:" />
                  </span>
                  <span className="font-medium">{receiptModal.cycleModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">
                    <T gu="ફ્રેમ નંબર:" en="Frame Serial:" hi="फ्रेम सीरियल:" />
                  </span>
                  <span className="font-mono font-medium">{receiptModal.cycleId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">
                    <T gu="તારીખ & સમય:" en="Date & Time:" hi="दिनांक व समय:" />
                  </span>
                  <span>{receiptModal.deliveredTime}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    alert(`પાવતી ${receiptModal.receiptNo} ડાઉનલોડ થઈ રહી છે...`);
                    setReceiptModal(null);
                  }}
                  className="btn-primary flex-1 h-11 text-label-md flex items-center justify-center gap-2"
                >
                  <Icon name="download" size={18} />
                  <T gu="પાવતી PDF" en="Download PDF" hi="रसीद PDF" />
                </button>
                <button
                  type="button"
                  onClick={() => setReceiptModal(null)}
                  className="btn-outline flex-1 h-11 text-label-md"
                >
                  <T gu="બંધ કરો" en="Close" hi="बंद करें" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
