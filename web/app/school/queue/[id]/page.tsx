"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import {Avatar} from "@/components/ui";
import { useAppStore } from "@/lib/store";

type DocumentType = "income" | "caste" | "marksheet" | "aadhaar";
type ActionState = "idle" | "approved" | "rejected" | "correction_requested";

interface DocumentItem {
  id: DocumentType;
  titleGu: string;
  titleEn: string;
  titleHi: string;
  docNumber: string;
  status: "verified" | "pending";
  statusTextGu: string;
  statusTextEn: string;
  statusTextHi: string;
  badgeType: "success" | "warning";
  icon: string;
}

const REQUIRED_DOCUMENTS: DocumentItem[] = [
  {
    id: "income",
    titleGu: "આવકનું પ્રમાણપત્ર",
    titleEn: "Income Certificate",
    titleHi: "आय प्रमाण पत्र",
    docNumber: "REV/AND/2026/049182",
    status: "pending",
    statusTextGu: "ધ્યાન જરૂરી (AI ૮૪%)",
    statusTextEn: "Flagged (AI 84%)",
    statusTextHi: "ध्यान आवश्यक (AI 84%)",
    badgeType: "warning",
    icon: "description",
  },
  {
    id: "caste",
    titleGu: "જાતિ પ્રમાણપત્ર (SEBC/OBC)",
    titleEn: "Caste Certificate (SEBC/OBC)",
    titleHi: "जाति प्रमाण पत्र (SEBC/OBC)",
    docNumber: "CST/GUJ/2024/99102",
    status: "verified",
    statusTextGu: "ચકાસાયેલ (DigiLocker)",
    statusTextEn: "Verified (DigiLocker)",
    statusTextHi: "सत्यापित (DigiLocker)",
    badgeType: "success",
    icon: "verified",
  },
  {
    id: "marksheet",
    titleGu: "ધોરણ ૮ માર્કશીટ",
    titleEn: "Std 8 Marksheet",
    titleHi: "कक्षा 8 मार्कशीट",
    docNumber: "GSEB/2025/MS-88124",
    status: "verified",
    statusTextGu: "ચકાસાયેલ (૮૨%)",
    statusTextEn: "Verified (82%)",
    statusTextHi: "सत्यापित (82%)",
    badgeType: "success",
    icon: "school",
  },
  {
    id: "aadhaar",
    titleGu: "આધાર કાર્ડ / બેંક જોડાણ",
    titleEn: "Aadhaar Card / Bank Linkage",
    titleHi: "आधार कार्ड / बैंक सीडिंग",
    docNumber: "•••• •••• 8912 (NPCI Active)",
    status: "verified",
    statusTextGu: "e-KYC માન્ય",
    statusTextEn: "e-KYC Valid",
    statusTextHi: "e-KYC मान्य",
    badgeType: "success",
    icon: "badge",
  },
];

interface LogEntry {
  id: string;
  timeGu: string;
  timeEn: string;
  timeHi: string;
  titleGu: string;
  titleEn: string;
  titleHi: string;
  detailGu: string;
  detailEn: string;
  detailHi: string;
  type: "system" | "officer" | "student";
}

export default function SchoolQueueDetailPage() {
  const routeParams = useParams();
  const rawId = routeParams?.id;
  const appId = Array.isArray(rawId) ? rawId[0] : rawId || "APP-2026-008712";
  const { addSchoolApproved, showSuccess, showError } = useAppStore();

  // State
  const [selectedDoc, setSelectedDoc] = useState<DocumentType>("income");
  const [aiOverlayActive, setAiOverlayActive] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [isLogExpanded, setIsLogExpanded] = useState<boolean>(true);

  // Officer Action State
  const [actionState, setActionState] = useState<ActionState>("idle");
  const [principalRemark, setPrincipalRemark] = useState<string>("");
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState<boolean>(false);
  const [correctionInstruction, setCorrectionInstruction] = useState<string>(
    "કૃપા કરીને પિતાનું નામ મેળ બેસતું સોગંદનામું અથવા અપડેટ કરેલ આધાર અપલોડ કરો."
  );

  // Dynamic audit log
  const [auditLogs, setAuditLogs] = useState<LogEntry[]>([
    {
      id: "log-1",
      timeGu: "૧૨ ઓક્ટોબર ૨૦૨૬, ૦૯:૩૦ AM",
      timeEn: "12 Oct 2026, 09:30 AM",
      timeHi: "12 अक्टूबर 2026, 09:30 AM",
      titleGu: "AI સ્ક્રુટિની ફ્લેગ",
      titleEn: "AI Scrutiny Flag",
      titleHi: "AI स्क्रूटिनी फ़्लैग",
      detailGu: "AI સ્ક્રુટિની એન્જિને પિતાના નામના તફાવત માટે 84% સ્કોર ફ્લેગ કર્યો.",
      detailEn: "AI Scrutiny engine flagged father's name spelling discrepancy with 84% match score.",
      detailHi: "AI स्क्रूटिनी इंजन ने पिता के नाम में भिन्नता के लिए 84% स्कोर फ़्लैग किया।",
      type: "system",
    },
    {
      id: "log-2",
      timeGu: "૧૧ ઓક્ટોબર ૨૦૨૬, ૦૪:૧૫ PM",
      timeEn: "11 Oct 2026, 04:15 PM",
      timeHi: "11 अक्टूबर 2026, 04:15 PM",
      titleGu: "DigiLocker વેરિફિકેશન",
      titleEn: "DigiLocker Verification",
      titleHi: "डिजीलॉकर सत्यापन",
      detailGu: "DigiLocker મારફતે OBC પ્રમાણપત્ર અને આધાર e-KYC સફળતાપૂર્વક મેળવાયું.",
      detailEn: "OBC Caste Certificate and Aadhaar e-KYC verified via DigiLocker automated bridge.",
      detailHi: "डिजीलॉकर के माध्यम से ओबीसी प्रमाण पत्र और आधार e-KYC सफलतापूर्वक प्राप्त हुआ।",
      type: "system",
    },
    {
      id: "log-3",
      timeGu: "૧૦ ઓક્ટોબર ૨૦૨૬, ૦૨:૪૦ PM",
      timeEn: "10 Oct 2026, 02:40 PM",
      timeHi: "10 अक्टूबर 2026, 02:40 PM",
      titleGu: "અરજી સબમિશન",
      titleEn: "Application Submitted",
      titleHi: "आवेदन जमा किया गया",
      detailGu: "વિદ્યાર્થી પોર્ટલ પરથી અરજી સબમિટ થઈ (OTP વેરિફાઇડ: ••••8912).",
      detailEn: "Application submitted from Student Portal (OTP verified: ••••8912).",
      detailHi: "छात्र पोर्टल से आवेदन जमा किया गया (OTP सत्यापित: ••••8912)।",
      type: "student",
    },
  ]);

  // Insert AI Remark
  const handleApplyAiRemark = () => {
    setPrincipalRemark(
      "પિતાના નામમાં સામાન્ય પ્રાદેશિક બોલીભેદ ('ભાઈ' / 'લાલ' તથા 'આર.') છે. આધાર નંબર અને રહેઠાણ સરનામું સમાન હોવાથી આચાર્ય વિવેકબુદ્ધિ અંતર્ગત અરજી મંજૂર કરવામાં આવે છે."
    );
  };

  // Approve Handler
  const handleApprove = useCallback(() => {
    const remarkText =
      principalRemark.trim() ||
      "આચાર્યશ્રી દ્વારા દસ્તાવેજી ચકાસણી પૂર્ણ. વિવેકાધિકાર અંતર્ગત મંજૂર.";
    setActionState("approved");
    addSchoolApproved(appId);
    showSuccess(`APP ${appId} મંજૂર! DEO કચેરીને મોકલા. / Approved & forwarded to DEO`);

    const newLog: LogEntry = {
      id: `log-approve-${Date.now()}`,
      timeGu: "હમણાં જ (04 નવેમ્બર 2026)",
      timeEn: "Just now (04 Nov 2026)",
      timeHi: "अभी-अभी (04 नवंबर 2026)",
      titleGu: "આચાર્યશ્રી દ્વારા મંજૂર (DEO અગ્રેસર)",
      titleEn: "Approved by Principal (Forwarded to DEO)",
      titleHi: "प्रधानाचार्य द्वारा स्वीकृत (DEO को अग्रेषित)",
      detailGu: `અરજી મંજૂર કરી DEO કચેરીને મોકલાઈ. નોંધ: "${remarkText}"`,
      detailEn: `Application approved and forwarded to DEO. Note: "${remarkText}"`,
      detailHi: `आवेदन स्वीकृत कर DEO कार्यालय को भेजा गया। नोट: "${remarkText}"`,
      type: "officer",
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  }, [principalRemark, addSchoolApproved, appId, showSuccess]);

  // Reject Submit Handler
  const handleConfirmReject = () => {
    const reason =
      rejectionReason.trim() ||
      "દસ્તાવેજી વિસંગતતા અને અમાન્ય પ્રમાણપત્ર કારણે નામંજૂર.";
    setActionState("rejected");
    setShowRejectModal(false);
    showError(`APP ${appId} નામંજૂર. / Rejected by school`);

    const newLog: LogEntry = {
      id: `log-reject-${Date.now()}`,
      timeGu: "હમણાં જ (04 નવેમ્બર 2026)",
      timeEn: "Just now (04 Nov 2026)",
      timeHi: "अभी-अभी (04 नवंबर 2026)",
      titleGu: "આચાર્યશ્રી દ્વારા નામંજૂર (Rejected)",
      titleEn: "Rejected by Principal",
      titleHi: "प्रधानाचार्य द्वारा अस्वीकृत",
      detailGu: `અરજી નામંજૂર કરવામાં આવી. કારણ: "${reason}"`,
      detailEn: `Application rejected by school authority. Reason: "${reason}"`,
      detailHi: `आवेदन अस्वीकृत किया गया। कारण: "${reason}"`,
      type: "officer",
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Request Correction Submit Handler
  const handleConfirmCorrection = () => {
    const instruction =
      correctionInstruction.trim() ||
      "કૃપા કરીને પિતાનું નામ મેળ બેસતું સોગંદનામું અથવા અપડેટ કરેલ આધાર અપલોડ કરો.";
    setActionState("correction_requested");
    setShowCorrectionModal(false);

    const newLog: LogEntry = {
      id: `log-fix-${Date.now()}`,
      timeGu: "હમણાં જ (04 નવેમ્બર 2026)",
      timeEn: "Just now (04 Nov 2026)",
      timeHi: "अभी-अभी (04 नवंबर 2026)",
      titleGu: "વિદ્યાર્થીને સુધારો મોકલાયો (Correction Requested)",
      titleEn: "Correction Requested to Student",
      titleHi: "छात्र को सुधार का अनुरोध भेजा गया",
      detailGu: `સુધારા નિર્દેશ મોકલાયો: "${instruction}"`,
      detailEn: `Correction instructions dispatched: "${instruction}"`,
      detailHi: `सुधार निर्देश भेजा गया: "${instruction}"`,
      type: "officer",
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Keyboard Shortcuts (A: Approve, R: Request Fix, J: Reject)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      if (actionState !== "idle") return;

      if (e.key === "a" || e.key === "A") {
        e.preventDefault();
        handleApprove();
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        setShowCorrectionModal(true);
      } else if (e.key === "j" || e.key === "J") {
        e.preventDefault();
        setShowRejectModal(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [actionState, handleApprove]);

  return (
    <OfficerShell role="school">
      <div className="p-4 md:p-6 max-w-7xl mx-auto flex flex-col gap-5 pb-16">
        {/* Top Navigation & Action Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/40">
          <div className="flex flex-col gap-1.5">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md flex-wrap">
              <Link
                href="/school"
                className="hover:text-primary cursor-pointer transition-colors"
              >
                <T gu="શાળાઓ" en="Schools" hi="स्कूल" />
              </Link>
              <Icon name="chevron_right" size={14} className="text-on-surface-variant" />
              <Link
                href="/school/queue"
                className="hover:text-primary cursor-pointer transition-colors"
              >
                <T gu="વેરિફિકેશન કતાર" en="Verification Queue" hi="सत्यापन कतार" />
              </Link>
              <Icon name="chevron_right" size={14} className="text-on-surface-variant" />
              <span className="text-on-surface font-title-md text-title-md font-semibold">
                <T
                  gu={`રિયા પટેલ (${appId})`}
                  en={`Riya Patel (${appId})`}
                  hi={`रिया पटेल (${appId})`}
                />
              </span>
            </div>

            {/* Status & School Info */}
            <div className="flex items-center gap-3 flex-wrap">
              {actionState === "idle" && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed/50 text-secondary font-label-md text-label-md font-semibold border border-secondary/30">
                  <Icon name="warning" size={16} className="text-secondary" />
                  <span>
                    <T
                      gu="ધ્યાન જરૂરી / ફ્લેગ થયેલ (AI ચોકસાઈ ૮૪%)"
                      en="Flagged Review • AI Confidence 84%"
                      hi="ध्यान आवश्यक / फ़्लैग किया गया (AI कॉन्फिडेंस 84%)"
                    />
                  </span>
                </div>
              )}
              {actionState === "approved" && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-label-md text-label-md font-semibold border border-emerald-300">
                  <Icon name="check_circle" size={16} className="text-emerald-600" />
                  <span>
                    <T
                      gu="વિશેષાધિકારથી મંજૂર થયેલ (DEO અગ્રેસર)"
                      en="Approved under Discretion (Forwarded to DEO)"
                      hi="विशेषाधिकार से स्वीकृत (DEO को अग्रेषित)"
                    />
                  </span>
                </div>
              )}
              {actionState === "rejected" && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-error font-label-md text-label-md font-semibold border border-error/30">
                  <Icon name="cancel" size={16} className="text-error" />
                  <span>
                    <T
                      gu="નામંજૂર થયેલ (Rejected)"
                      en="Rejected by Principal"
                      hi="अस्वीकृत (Rejected)"
                    />
                  </span>
                </div>
              )}
              {actionState === "correction_requested" && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-label-md text-label-md font-semibold border border-amber-300">
                  <Icon name="build" size={16} className="text-amber-600" />
                  <span>
                    <T
                      gu="સુધારો મોકલાયેલ (Correction Requested)"
                      en="Correction Requested"
                      hi="सुधार का अनुरोध भेजा गया"
                    />
                  </span>
                </div>
              )}

              <span className="text-on-surface-variant font-caption text-caption hidden sm:inline">
                <T
                  gu="UDISE: 24150104502 • આણંદ ગ્રામ્ય"
                  en="UDISE: 24150104502 • Anand Rural"
                  hi="UDISE: 24150104502 • आणंद ग्रामीण"
                />
              </span>
            </div>
          </div>

          {/* Quick Controls & Navigation */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="hidden xl:flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-lg text-on-surface-variant font-caption text-caption">
              <span className="font-semibold text-on-surface">
                <T gu="શોર્ટકટ્સ:" en="Shortcuts:" hi="शॉर्टकट:" />
              </span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-lowest text-primary font-bold shadow-xs">
                A
              </kbd>{" "}
              <T gu="મંજૂર" en="Approve" hi="मंजूर" />
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-lowest text-secondary font-bold shadow-xs ml-1">
                R
              </kbd>{" "}
              <T gu="સુધારો" en="Fix" hi="सुधार" />
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-lowest text-error font-bold shadow-xs ml-1">
                J
              </kbd>{" "}
              <T gu="નામંજૂર" en="Reject" hi="नामंजूर" />
            </div>

            <div className="flex items-center gap-1">
              <Link
                href="/school/queue"
                className="flex items-center gap-1 h-9 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors"
                title="Previous Application"
              >
                <Icon name="chevron_left" size={18} />
                <span className="hidden sm:inline">
                  <T gu="પાછલી અરજી" en="Previous" hi="पिछला" />
                </span>
              </Link>
              <span className="px-2 text-on-surface-variant font-label-md text-label-md">
                ૧૪ / ૮૬
              </span>
              <Link
                href="/school/queue"
                className="flex items-center gap-1 h-9 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors"
                title="Next Application"
              >
                <span className="hidden sm:inline">
                  <T gu="આગામી અરજી" en="Next" hi="अगला" />
                </span>
                <Icon name="chevron_right" size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Success / Approved State Alert Banner */}
        {actionState === "approved" && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500/60 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow">
                <Icon name="task_alt" size={24} />
              </div>
              <div>
                <h3 className="font-title-md text-title-md font-bold text-emerald-900 dark:text-emerald-100">
                  <T
                    gu="અરજી સફળતાપૂર્વક મંજૂર કરવામાં આવી છે!"
                    en="Application Approved Successfully!"
                    hi="आवेदन सफलतापूर्वक स्वीकृत किया गया!"
                  />
                </h3>
                <p className="font-body-sm text-body-sm text-emerald-800 dark:text-emerald-200 mt-0.5">
                  <T
                    gu="નમો લક્ષ્મી યોજના હેઠળ ₹ ૧૦,૦૦૦ ના DBT હપ્તાની અંતિમ મંજૂરી અર્થે ડેટા જિલ્લા શિક્ષણાધિકારી (DEO) કચેરીને સફળતાપૂર્વક મોકલી દેવાયો છે."
                    en="Application data for ₹ 10,000 annual DBT has been securely transmitted to the District Education Officer (DEO) for final payout clearance."
                    hi="नमो लक्ष्मी योजना के अंतर्गत ₹ 10,000 DBT किस्त की अंतिम मंजूरी हेतु डेटा DEO कार्यालय को अग्रेषित किया गया है।"
                  />
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/school/queue"
                className="h-10 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-label-md text-label-md font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>
                  <T gu="કતાર પર પાછા જાઓ" en="Back to Queue" hi="कतार पर वापस जाएं" />
                </span>
                <Icon name="arrow_forward" size={16} />
              </Link>
            </div>
          </div>
        )}

        {/* Rejected State Alert Banner */}
        {actionState === "rejected" && (
          <div className="bg-red-50 dark:bg-red-950/40 border-2 border-red-500/60 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow">
                <Icon name="cancel" size={24} />
              </div>
              <div>
                <h3 className="font-title-md text-title-md font-bold text-red-900 dark:text-red-100">
                  <T
                    gu="અરજી સત્તાવાર રીતે નામંજૂર કરવામાં આવી છે"
                    en="Application Officially Rejected"
                    hi="आवेदन आधिकारिक रूप से अस्वीकृत किया गया"
                  />
                </h3>
                <p className="font-body-sm text-body-sm text-red-800 dark:text-red-200 mt-0.5">
                  <T
                    gu="વિદ્યાર્થી અને વાલીને SMS તેમજ પોર્ટલ નોટિફિકેશન મારફતે નામંજૂરીનું સત્તાવાર કારણ મોકલવામાં આવ્યું છે."
                    en="Official rejection grounds and SMS notification have been dispatched to the student and guardian portal."
                    hi="छात्र और अभिभावक को एसएमएस एवं पोर्टल अधिसूचना के माध्यम से अस्वीकृति का कारण भेज दिया गया है।"
                  />
                </p>
              </div>
            </div>
            <Link
              href="/school/queue"
              className="h-10 px-4 rounded-xl bg-red-700 hover:bg-red-800 text-white font-label-md text-label-md font-bold flex items-center gap-1.5 transition-colors shrink-0"
            >
              <span>
                <T gu="કતાર પર પાછા જાઓ" en="Back to Queue" hi="कतार पर वापस जाएं" />
              </span>
              <Icon name="arrow_forward" size={16} />
            </Link>
          </div>
        )}

        {/* Correction Requested Alert Banner */}
        {actionState === "correction_requested" && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-500/60 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow">
                <Icon name="build" size={24} />
              </div>
              <div>
                <h3 className="font-title-md text-title-md font-bold text-amber-900 dark:text-amber-100">
                  <T
                    gu="વિદ્યાર્થીને દસ્તાવેજ સુધારા સૂચના મોકલાઈ છે"
                    en="Document Correction Dispatched to Student"
                    hi="छात्र को दस्तावेज सुधार निर्देश भेजा गया है"
                  />
                </h3>
                <p className="font-body-sm text-body-sm text-amber-800 dark:text-amber-200 mt-0.5">
                  <T
                    gu="વિદ્યાર્થી તેમના પોર્ટલ પરથી સુધારેલ દસ્તાવેજ ફરીથી અપલોડ કરી શકશે."
                    en="The student can now re-upload the corrected document directly from their portal."
                    hi="छात्र अपने पोर्टल से संशोधित दस्तावेज दोबारा अपलोड कर सकता है।"
                  />
                </p>
              </div>
            </div>
            <Link
              href="/school/queue"
              className="h-10 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-label-md text-label-md font-bold flex items-center gap-1.5 transition-colors shrink-0"
            >
              <span>
                <T gu="કતાર પર પાછા જાઓ" en="Back to Queue" hi="कतार पर वापस जाएं" />
              </span>
              <Icon name="arrow_forward" size={16} />
            </Link>
          </div>
        )}

        {/* Main 60 / 40 Split View Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: 60% Width (col-span-7) Interactive Document Viewer & Forensics */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Document Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedDoc("income")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-lg text-label-lg transition-all whitespace-nowrap shadow-sm ${
                  selectedDoc === "income"
                    ? "bg-primary-container text-on-primary font-bold shadow-md ring-2 ring-primary/20"
                    : "bg-surface-container-lowest hover:bg-surface-container text-on-surface shadow-xs"
                }`}
              >
                <Icon name="description" size={18} />
                <span>
                  <T
                    gu="આવકનું પ્રમાણપત્ર"
                    en="Income Cert"
                    hi="आय प्रमाण पत्र"
                  />
                </span>
                <span className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-caption text-[11px] font-bold">
                  <T gu="ધ્યાન જરૂરી" en="Flagged" hi="ध्यान आवश्यक" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDoc("caste")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-lg text-label-lg transition-all whitespace-nowrap shadow-sm ${
                  selectedDoc === "caste"
                    ? "bg-primary-container text-on-primary font-bold shadow-md ring-2 ring-primary/20"
                    : "bg-surface-container-lowest hover:bg-surface-container text-on-surface shadow-xs"
                }`}
              >
                <Icon name="verified" size={18} className={selectedDoc === "caste" ? "text-on-primary" : "text-primary"} />
                <span>
                  <T
                    gu="જાતિનું પ્રમાણપત્ર (OBC)"
                    en="Caste Cert (OBC)"
                    hi="जाति प्रमाण पत्र (OBC)"
                  />
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDoc("marksheet")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-lg text-label-lg transition-all whitespace-nowrap shadow-sm ${
                  selectedDoc === "marksheet"
                    ? "bg-primary-container text-on-primary font-bold shadow-md ring-2 ring-primary/20"
                    : "bg-surface-container-lowest hover:bg-surface-container text-on-surface shadow-xs"
                }`}
              >
                <Icon name="school" size={18} className={selectedDoc === "marksheet" ? "text-on-primary" : "text-on-surface-variant"} />
                <span>
                  <T
                    gu="ધોરણ ૮ માર્કશીટ"
                    en="Std 8 Marksheet"
                    hi="कक्षा 8 मार्कशीट"
                  />
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDoc("aadhaar")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-lg text-label-lg transition-all whitespace-nowrap shadow-sm ${
                  selectedDoc === "aadhaar"
                    ? "bg-primary-container text-on-primary font-bold shadow-md ring-2 ring-primary/20"
                    : "bg-surface-container-lowest hover:bg-surface-container text-on-surface shadow-xs"
                }`}
              >
                <Icon name="account_balance" size={18} className={selectedDoc === "aadhaar" ? "text-on-primary" : "text-on-surface-variant"} />
                <span>
                  <T
                    gu="આધાર / બેંક પાસબુક"
                    en="Aadhaar / Passbook"
                    hi="आधार / पासबुक"
                  />
                </span>
              </button>
            </div>

            {/* Document Frame & Canvas */}
            <div className="flex flex-col bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-outline-variant/40">
              {/* Viewer Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-surface-container-low border-b border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <span className="font-title-md text-title-md text-on-surface flex items-center gap-2 font-semibold">
                    <Icon name="document_scanner" size={20} className="text-primary" />
                    {selectedDoc === "income" && (
                      <T
                        gu="રાજસ્વ વિભાગ • આવક પ્રમાણપત્ર સ્કેન"
                        en="Revenue Dept • Income Certificate Scan"
                        hi="राजस्व विभाग • आय प्रमाण पत्र स्कैन"
                      />
                    )}
                    {selectedDoc === "caste" && (
                      <T
                        gu="સામાજિક ન્યાય વિભાગ • જાતિ પ્રમાણપત્ર"
                        en="Social Justice Dept • Caste Certificate"
                        hi="सामाजिक न्याय विभाग • जाति प्रमाण पत्र"
                      />
                    )}
                    {selectedDoc === "marksheet" && (
                      <T
                        gu="ગુજરાત માધ્યમિક બોર્ડ • ધોરણ ૮ પરિણામ"
                        en="GSEB Board • Class 8 Marksheet"
                        hi="गुजरात बोर्ड • कक्षा 8 परिणाम"
                      />
                    )}
                    {selectedDoc === "aadhaar" && (
                      <T
                        gu="UIDAI • આધાર ઈ-કેવાયસી અને NPCI બ્રિજ"
                        en="UIDAI • Aadhaar e-KYC & NPCI Bridge"
                        hi="UIDAI • आधार e-KYC और NPCI ब्रिज"
                      />
                    )}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-caption text-caption font-mono">
                    {selectedDoc === "income" && "REV/AND/2026/049182"}
                    {selectedDoc === "caste" && "CST/GUJ/2024/99102"}
                    {selectedDoc === "marksheet" && "GSEB/2025/MS-88124"}
                    {selectedDoc === "aadhaar" && "UIDAI-NPCI-004512"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* AI Overlay Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer bg-surface-container hover:bg-surface-container-high px-3 py-1.5 rounded-lg select-none transition-colors">
                    <Icon name="auto_fix_high" size={18} className="text-primary" />
                    <span className="font-label-md text-label-md text-on-surface font-semibold hidden sm:inline">
                      <T gu="AI ઓવરલે" en="AI Overlay" hi="AI ओवरले" />
                    </span>
                    <input
                      type="checkbox"
                      checked={aiOverlayActive}
                      onChange={(e) => setAiOverlayActive(e.target.checked)}
                      className="w-4 h-4 accent-primary rounded cursor-pointer"
                    />
                  </label>

                  <div className="h-5 w-px bg-surface-variant" />

                  {/* Zoom controls */}
                  <button
                    type="button"
                    onClick={() => setZoomLevel((prev) => Math.max(70, prev - 10))}
                    className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
                    title="Zoom Out"
                  >
                    <Icon name="zoom_out" size={18} />
                  </button>
                  <span className="text-caption font-mono text-on-surface-variant min-w-[36px] text-center">
                    {zoomLevel}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((prev) => Math.min(140, prev + 10))}
                    className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
                    title="Zoom In"
                  >
                    <Icon name="zoom_in" size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setRotation((prev) => (prev + 90) % 360)}
                    className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
                    title="Rotate"
                  >
                    <Icon name="rotate_right" size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => alert("PDF દસ્તાવેજ ડાઉનલોડ પ્રક્રિયા શરૂ થઈ.")}
                    className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center hover:opacity-90 transition-opacity"
                    title="PDF Download"
                  >
                    <Icon name="download" size={18} />
                  </button>
                </div>
              </div>

              {/* Simulated Authentic High-Fidelity Gujarat Govt Certificate Canvas */}
              <div className="relative p-4 sm:p-8 bg-surface-bright flex justify-center items-center overflow-auto min-h-[580px]">
                <div
                  style={{
                    transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                    transformOrigin: "center center",
                    transition: "transform 0.2s ease-in-out",
                  }}
                  className="w-full max-w-[560px] bg-surface-container-lowest p-6 sm:p-8 rounded-xl shadow-md relative text-on-surface border border-outline-variant/30"
                >
                  {/* Watermark Coat of Arms */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
                    <Icon name="shield" size={240} className="text-on-surface" />
                  </div>

                  {selectedDoc === "income" && (
                    <>
                      {/* Certificate Header */}
                      <div className="flex flex-col items-center text-center gap-1.5 pb-4 border-b-2 border-surface-variant">
                        <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary mb-1">
                          <Icon name="account_balance" size={30} />
                        </div>
                        <h2 className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
                          ગુજરાત સરકાર • મહેસૂલ વિભાગ
                        </h2>
                        <p className="font-title-md text-title-md text-on-surface-variant">
                          મામલતદાર કચેરી, આણંદ (ગ્રામ્ય)
                        </p>
                        <div className="flex items-center justify-between w-full mt-2 font-caption text-caption text-on-surface-variant">
                          <span>
                            પ્રમાણપત્ર ક્રમાંક: <strong>REV/AND/2026/049182</strong>
                          </span>
                          <span>
                            તારીખ: <strong>15/04/2025</strong>
                          </span>
                        </div>
                      </div>

                      {/* Barcode strip mock */}
                      <div className="flex items-center justify-between my-3 px-2 py-1 bg-surface-container-low rounded">
                        <div className="flex items-center gap-1 text-[11px] font-mono tracking-widest text-on-surface-variant">
                          ||| | ||||| || ||| |||| || ||||| |||| || ||| ||||
                        </div>
                        <span className="font-caption text-[11px] text-on-surface-variant font-mono">
                          DIGITAL-BARCODE-VERIFIED
                        </span>
                      </div>

                      {/* Body of Certificate with AI Highlights */}
                      <div className="space-y-4 my-6 font-body-sm text-body-sm leading-relaxed text-on-surface">
                        <p>
                          આથી પ્રમાણપત્ર આપવામાં આવે છે કે અરજદાર શ્રીમતી/કુમારી{" "}
                          <strong className="font-bold text-on-surface underline decoration-primary decoration-2 underline-offset-4">
                            રિયા પટેલ (Riya Patel)
                          </strong>{" "}
                          ના પિતાશ્રી{" "}
                          {/* Bounding Box 1: Guardian Name (Flagged - Yellow pulse) */}
                          <span
                            className={`relative inline-block my-1 px-2.5 py-1 rounded-md transition-all ${
                              aiOverlayActive
                                ? "bg-amber-100 dark:bg-amber-950/60 ring-2 ring-amber-500 shadow-sm animate-pulse"
                                : "bg-surface-container"
                            }`}
                          >
                            <span className="font-title-md text-title-md font-bold text-amber-950 dark:text-amber-200">
                              મનસુખલાલ આર. પટેલ
                            </span>
                            {aiOverlayActive && (
                              <span className="absolute -top-3 -right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-secondary-container text-white font-caption text-[10px] font-bold shadow">
                                <Icon name="flag" size={12} /> ૮૪% મેળ
                              </span>
                            )}
                          </span>{" "}
                          રહેવાસી: મુ.પો. મોગરી, તાલુકો: આણંદ, જીલ્લો: આણંદ ના કાયદેસરના
                          રહેવાસી છે.
                        </p>

                        <p>
                          તલાટીશ્રી તેમજ સંબંધિત મહેસૂલી પંચના દસ્તાવેજી ચકાસણી અહેવાલ મુજબ
                          તેઓના કુટુંબની તમામ સાધનોમાંથી થતી વાર્ષિક આવક{" "}
                          {/* Bounding Box 2: Annual Income (Valid - Green ring) */}
                          <span
                            className={`relative inline-block my-1 px-3 py-1 rounded-md transition-all ${
                              aiOverlayActive
                                ? "bg-emerald-50 dark:bg-emerald-950/50 ring-2 ring-emerald-600 text-emerald-800 dark:text-emerald-300 font-bold text-title-md shadow-xs"
                                : "bg-surface-container"
                            }`}
                          >
                            ₹ ૯૬,૦૦૦/- (અંકે રૂપિયા છન્નું હજાર પુરા)
                            {aiOverlayActive && (
                              <span className="absolute -top-3 -right-3 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-600 text-white font-caption text-[10px] font-bold shadow">
                                <Icon name="check" size={12} /> માન્ય
                              </span>
                            )}
                          </span>{" "}
                          છે.
                        </p>

                        <p className="text-on-surface-variant font-caption text-caption">
                          આ પ્રમાણપત્ર ઈસ્યુ થયા તારીખથી સતત ૩ (ત્રણ) નાણાકીય વર્ષ એટલે કે
                          તારીખ <strong>૩૧/૦૩/૨૦૨૮</strong> સુધી માન્ય ગણાશે.
                        </p>
                      </div>

                      {/* Certificate Footer: Mamlatdar Seal & Digital Sign */}
                      <div className="mt-8 pt-4 border-t border-surface-variant flex items-end justify-between">
                        {/* QR Code Mock */}
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-16 h-16 bg-surface-container-highest rounded-lg p-1.5 flex flex-col justify-between">
                            <div className="grid grid-cols-3 gap-0.5 h-full">
                              <div className="bg-on-surface rounded-xs" />
                              <div className="bg-surface" />
                              <div className="bg-on-surface rounded-xs" />
                              <div className="bg-surface" />
                              <div className="bg-on-surface rounded-xs" />
                              <div className="bg-surface" />
                              <div className="bg-on-surface rounded-xs" />
                              <div className="bg-surface" />
                              <div className="bg-on-surface rounded-xs" />
                            </div>
                          </div>
                          <span className="font-caption text-[10px] text-on-surface-variant font-mono">
                            e-SEAL QR
                          </span>
                        </div>

                        {/* Digital Signature Stamp */}
                        <div className="flex flex-col items-end text-right">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-primary border border-primary/20">
                            <Icon name="verified_user" size={18} />
                            <div className="flex flex-col text-left">
                              <span className="font-caption text-[11px] font-bold">
                                DIGITALLY SIGNED
                              </span>
                              <span className="font-caption text-[10px] text-on-surface-variant">
                                ડી. જે. પરમાર (મામલતદાર, આણંદ)
                              </span>
                            </div>
                          </div>
                          <span className="font-caption text-[10px] text-on-surface-variant mt-1 font-mono">
                            15-04-2025 14:22:18 IST
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedDoc === "caste" && (
                    <div className="flex flex-col gap-4 py-4">
                      <div className="flex flex-col items-center text-center pb-3 border-b border-surface-variant">
                        <Icon name="verified" size={32} className="text-primary mb-1" />
                        <h3 className="font-title-lg text-title-lg font-bold text-primary">
                          સામાજિક ન્યાય અને અધિકારિતા વિભાગ
                        </h3>
                        <p className="font-caption text-caption text-on-surface-variant">
                          જિલ્લા સમાજ કલ્યાણ અધિકારી કચેરી, આણંદ
                        </p>
                      </div>
                      <div className="space-y-3 font-body-sm text-body-sm">
                        <p>
                          પ્રમાણપત્ર આપતાં આનંદ થાય છે કે કુમારી <strong>રિયા પટેલ</strong>{" "}
                          સામાજિક અને શૈક્ષણિક રીતે પછાત વર્ગ (SEBC / OBC - બક્ષીપંચ) જાતિના
                          છે.
                        </p>
                        <div className="p-3 bg-surface-container-low rounded-lg space-y-1 font-caption text-caption">
                          <div>
                            <strong>પ્રમાણપત્ર નંબર:</strong> CST/GUJ/2024/99102
                          </div>
                          <div>
                            <strong>ઇસ્યુ તારીખ:</strong> 18/06/2024
                          </div>
                          <div>
                            <strong>નોન-ક્રીમીલેયર સ્થિતિ:</strong> પરિશિષ્ટ-ક મુજબ માન્ય
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-label-md text-label-md font-semibold">
                          <Icon name="verified" size={18} />
                          <span>DigiLocker સત્તાવાર ડેટાબેઝ સાથે ૧૦૦% મેળ ખાધો છે.</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedDoc === "marksheet" && (
                    <div className="flex flex-col gap-4 py-4">
                      <div className="flex flex-col items-center text-center pb-3 border-b border-surface-variant">
                        <Icon name="school" size={32} className="text-primary mb-1" />
                        <h3 className="font-title-lg text-title-lg font-bold text-primary">
                          ગુજરાત રાજ્ય પ્રાથમિક શિક્ષણ પરિષદ
                        </h3>
                        <p className="font-caption text-caption text-on-surface-variant">
                          ધોરણ ૮ વાર્ષિક મૂલ્યાંકન પત્રક (સત્ર ૨૦૨૫-૨૬)
                        </p>
                      </div>
                      <div className="space-y-3 font-body-sm text-body-sm">
                        <div className="grid grid-cols-2 gap-2 text-caption font-caption p-3 bg-surface-container-low rounded-lg">
                          <div>
                            વિદ્યાર્થી: <strong>રિયા પટેલ</strong>
                          </div>
                          <div>
                            પરિણામ: <strong>પ્રથમ વર્ગ (વિશિષ્ટતા સાથે)</strong>
                          </div>
                          <div>
                            મેળવેલ ગુણ: <strong>૮૨% (A ગ્રેડ)</strong>
                          </div>
                          <div>
                            હાજરી પ્રમાણ: <strong>૮૯%</strong>
                          </div>
                        </div>
                        <p className="text-emerald-700 dark:text-emerald-300 font-label-md text-label-md flex items-center gap-1.5 font-semibold">
                          <Icon name="check_circle" size={18} />
                          <span>શાળા CTS રેકોર્ડ તથા પરીક્ષા રજીસ્ટર સાથે માન્ય.</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedDoc === "aadhaar" && (
                    <div className="flex flex-col gap-4 py-4">
                      <div className="flex flex-col items-center text-center pb-3 border-b border-surface-variant">
                        <Icon name="badge" size={32} className="text-primary mb-1" />
                        <h3 className="font-title-lg text-title-lg font-bold text-primary">
                          UIDAI આધાર ઈ-કેવાયસી અને NPCI બ્રિજ
                        </h3>
                        <p className="font-caption text-caption text-on-surface-variant">
                          પ્રત્યક્ષ લાભ હસ્તાંતરણ (DBT Bridge) ચકાસણી
                        </p>
                      </div>
                      <div className="space-y-3 font-body-sm text-body-sm">
                        <div className="p-3 bg-surface-container-low rounded-lg space-y-1.5 font-caption text-caption">
                          <div>
                            માસ્ક આધાર નંબર: <strong>•••• •••• 8912</strong>
                          </div>
                          <div>
                            નામ: <strong>રિયા પટેલ (Riya Patel)</strong>
                          </div>
                          <div>
                            વાલીનું બેંક ખાતું: <strong>SBI A/C ••••4521 (હેતલબેન પટેલ)</strong>
                          </div>
                          <div>
                            NPCI આધાર સીડિંગ સ્થિતિ:{" "}
                            <span className="text-emerald-700 dark:text-emerald-300 font-bold">
                              સક્રિય (Active DBT Bridge)
                            </span>
                          </div>
                        </div>
                        <p className="text-emerald-700 dark:text-emerald-300 font-label-md text-label-md flex items-center gap-1.5 font-semibold">
                          <Icon name="verified_user" size={18} />
                          <span>PFMS દ્વારા સીધી DBT ચૂકવણી માટે સંપૂર્ણપણે માન્ય.</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Document Verification Checklist / Status Panel */}
            <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/40 flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-surface-variant/40">
                <div className="flex items-center gap-2">
                  <Icon name="inventory_2" size={20} className="text-primary" />
                  <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                    <T
                      gu="જરૂરી દસ્તાવેજ ચકાસણી સૂચિ (Document Verification)"
                      en="Document Verification Checklist"
                      hi="दस्तावेज सत्यापन सूची"
                    />
                  </h3>
                </div>
                <span className="font-caption text-caption text-on-surface-variant">
                  <T gu="૪/૪ દસ્તાવેજો ઉપલબ્ધ" en="4/4 Documents Available" hi="4/4 दस्तावेज उपलब्ध" />
                </span>
              </div>

              <div className="space-y-2.5">
                {REQUIRED_DOCUMENTS.map((doc) => (
                  <div
                    key={doc.id}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all border ${
                      selectedDoc === doc.id
                        ? "bg-primary/5 border-primary/40 shadow-xs"
                        : "bg-surface-container-low border-transparent hover:border-outline-variant/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          doc.badgeType === "warning"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        }`}
                      >
                        <Icon name={doc.icon} size={20} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-title-sm text-on-surface font-semibold truncate">
                          <T
                            gu={doc.titleGu}
                            en={doc.titleEn}
                            hi={doc.titleHi}
                          />
                        </div>
                        <div className="font-caption text-caption text-on-surface-variant font-mono truncate">
                          {doc.docNumber}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-caption text-caption font-semibold ${
                          doc.badgeType === "warning"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        }`}
                      >
                        <T
                          gu={doc.statusTextGu}
                          en={doc.statusTextEn}
                          hi={doc.statusTextHi}
                        />
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedDoc(doc.id)}
                        className={`h-8 px-3 rounded-lg font-label-md text-label-md font-semibold transition-colors flex items-center gap-1 ${
                          selectedDoc === doc.id
                            ? "bg-primary text-on-primary"
                            : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                        }`}
                      >
                        <Icon name="visibility" size={16} />
                        <span>
                          <T gu="જુઓ" en="View" hi="देखें" />
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Document Authenticity & Forensic Checks Card */}
            <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/40 flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-surface-variant/40">
                <div className="flex items-center gap-2">
                  <Icon name="policy" size={22} className="text-primary" />
                  <h3 className="font-title-lg text-title-lg text-on-surface font-bold">
                    <T
                      gu="દસ્તાવેજ પ્રમાણીકરણ અને ફોરેન્સિક તપાસ"
                      en="Document Authenticity & Forensic Checks"
                      hi="दस्तावेज प्रमाणीकरण और फोरेंसिक जांच"
                    />
                  </h3>
                </div>
                <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-label-md text-label-md font-bold">
                  <T gu="૧૦૦% પ્રામાણિક" en="100% Authentic" hi="100% प्रामाणिक" />
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-body-sm font-body-sm">
                {/* Check 1 */}
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-low">
                  <Icon name="verified" size={20} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-title-md text-title-md text-on-surface font-semibold">
                      <T
                        gu="ડિજિટલ સહી (Digital Signature)"
                        en="Digital Signature"
                        hi="डिजिटल हस्ताक्षर"
                      />
                    </div>
                    <p className="text-on-surface-variant font-caption text-caption mt-0.5">
                      <T
                        gu="મામલતદાર આણંદ (ગ્રામ્ય) ની અધિકૃત ક્રિપ્ટોગ્રાફિક કી વડે હસ્તાક્ષર થયેલ છે. અમાન્યતા નથી."
                        en="Cryptographically verified using Mamlatdar Anand Rural authority private key. Valid and untampered."
                        hi="मामलतदार आणंद (ग्रामीण) की आधिकारिक क्रिप्टोग्राफिक कुंजी से हस्ताक्षरित।"
                      />
                    </p>
                  </div>
                </div>

                {/* Check 2 */}
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-low">
                  <Icon name="sync_saved_locally" size={20} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-title-md text-title-md text-on-surface font-semibold">
                      <T
                        gu="મહેસૂલ પોર્ટલ API મેળ (Revenue Sync)"
                        en="Revenue Portal API Sync"
                        hi="राजस्व पोर्टल API मिलान"
                      />
                    </div>
                    <p className="text-on-surface-variant font-caption text-caption mt-0.5">
                      <T
                        gu="i-Khedut / e-Dhara રેકોર્ડ #GUJ-REV-849102 સાથે સીધો ઓનલાઈન તાળો મળેલ છે."
                        en="Direct online match with i-Khedut / e-Dhara record #GUJ-REV-849102."
                        hi="i-Khedut / e-Dhara रिकॉर्ड #GUJ-REV-849102 के साथ ऑनलाइन मिलान पूर्ण।"
                      />
                    </p>
                  </div>
                </div>

                {/* Check 3 */}
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-low">
                  <Icon name="security" size={20} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-title-md text-title-md text-on-surface font-semibold">
                      <T
                        gu="મેટાડેટા વિશ્લેષણ (Tamper Detection)"
                        en="Metadata & Tamper Detection"
                        hi="मेटाडेटा विश्लेषण (टैम्पर डिटेक्शन)"
                      />
                    </div>
                    <p className="text-on-surface-variant font-caption text-caption mt-0.5">
                      <T
                        gu="0% વિસંગતતા. પીડીએફ ફાઇલમાં કોઈ ફોટોશોપ કે એડિટિંગ અંશ મળેલ નથી."
                        en="0% anomaly. PDF stream analysis confirms zero external retouching or forgery."
                        hi="0% विसंगति। पीडीएफ फाइल में कोई हेरफेर या फोटोशॉप अंश नहीं मिला।"
                      />
                    </p>
                  </div>
                </div>

                {/* Check 4 */}
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-low">
                  <Icon name="qr_code_scanner" size={20} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-title-md text-title-md text-on-surface font-semibold">
                      <T
                        gu="QR કોડ સ્કેન (Encrypted Payload)"
                        en="QR Code Encrypted Payload"
                        hi="QR कोड स्कैन (एन्क्रिप्टेड पेलोड)"
                      />
                    </div>
                    <p className="text-on-surface-variant font-caption text-caption mt-0.5">
                      <T
                        gu="ડીકોડેડ ડેટા સર્ટિફિકેટ સિરિયલ નંબર અને નામ સાથે સંપૂર્ણ સુસંગત છે."
                        en="Decrypted payload strictly matches certificate serial number and student applicant name."
                        hi="डिकोड किया गया डेटा प्रमाणपत्र क्रमांक और नाम से पूरी तरह मेल खाता है।"
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 40% Width (col-span-5) Student Profile, Checklist & Action Desk */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Student Profile & Scheme Summary Card */}
            <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/40 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <Avatar name="Riya Patel" size="lg" className="w-16 h-16 text-xl shadow" />
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-title-lg text-title-lg text-on-surface font-bold truncate">
                        <T gu="રિયા પટેલ" en="Riya Patel" hi="रिया पटेल" />
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-caption text-caption font-semibold">
                        <T gu="વર્ગ ૯-બી" en="Class 9-B" hi="कक्षा 9-B" />
                      </span>
                    </div>
                    <span className="text-on-surface-variant font-caption text-caption">
                      <T
                        gu="રોલ નંબર: ૨૮ • જન્મ તારીખ: 12/08/2011"
                        en="Roll No: 28 • DOB: 12/08/2011"
                        hi="रोल नंबर: 28 • जन्म तिथि: 12/08/2011"
                      />
                    </span>
                    <span className="text-on-surface-variant font-caption text-caption font-mono">
                      CTS ID: GJ-AND-2026-004512
                    </span>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-lg bg-surface-container text-on-surface-variant font-caption text-caption text-right shrink-0">
                  <span>
                    <T gu="શાળા કોડ:" en="School Code:" hi="स्कूल कोड:" />
                  </span>
                  <div className="font-bold text-on-surface font-mono">SPH-AND-042</div>
                </div>
              </div>

              {/* Family & Demographic Details */}
              <div className="grid grid-cols-2 gap-2 text-caption font-caption bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
                <div>
                  <span className="text-on-surface-variant block">
                    <T gu="માતાનું નામ:" en="Mother's Name:" hi="माता का नाम:" />
                  </span>
                  <span className="font-title-md text-title-md text-on-surface font-semibold">
                    <T gu="હેતલબેન પટેલ" en="Hetalben Patel" hi="हेतलबेन पटेल" />
                  </span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">
                    <T gu="પિતાનું નામ (CTS):" en="Father's Name (CTS):" hi="पिता का नाम (CTS):" />
                  </span>
                  <span className="font-title-md text-title-md text-on-surface font-semibold">
                    <T
                      gu="મનસુખભાઈ રણછોડભાઈ પટેલ"
                      en="Mansukhbhai R. Patel"
                      hi="मनसुखभाई रणछोड़भाई पटेल"
                    />
                  </span>
                </div>
              </div>

              {/* Scheme Grant Highlight Banner */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-primary text-on-primary shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-on-primary/15 flex items-center justify-center">
                    <Icon name="savings" size={20} />
                  </div>
                  <div>
                    <span className="font-caption text-caption opacity-90 block">
                      <T gu="અરજી કરેલ યોજના:" en="Applied Scheme:" hi="आवेदन की गई योजना:" />
                    </span>
                    <span className="font-title-md text-title-md font-bold">
                      <T
                        gu="નમો લક્ષ્મી યોજના"
                        en="Namo Lakshmi Scheme"
                        hi="नमो लक्ष्मी योजना"
                      />
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-caption text-caption opacity-90 block">
                    <T gu="વાર્ષિક સહાય DBT" en="Annual DBT Grant" hi="वार्षिक सहायता DBT" />
                  </span>
                  <span className="font-title-lg text-title-lg font-bold">₹ ૧૦,૦૦૦</span>
                </div>
              </div>
            </div>

            {/* Rule-by-Rule Eligibility Checklist (5 Rules from S2 + Flagged Divergence Check) */}
            <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/40 flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-surface-variant/40">
                <div className="flex items-center gap-2">
                  <Icon name="checklist" size={20} className="text-primary" />
                  <h4 className="font-title-md text-title-md text-on-surface font-semibold">
                    <T
                      gu="નિયમાનુસાર પાત્રતા ચકાસણી (Eligibility Criteria)"
                      en="Eligibility Rule Verification"
                      hi="पात्रता नियम सत्यापन"
                    />
                  </h4>
                </div>
                <span className="font-caption text-caption text-on-surface-variant">
                  <T gu="૬/૬ શરતો ચકાસાયેલ" en="6/6 Rules Checked" hi="6/6 शर्तें जांची गईं" />
                </span>
              </div>

              <div className="space-y-2.5">
                {/* Rule 1: Caste */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low text-body-sm font-body-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon name="check_circle" size={18} className="text-primary shrink-0" />
                    <span className="truncate">
                      <T
                        gu="જાતિ / કેટેગરી: SEBC / OBC (માન્ય પ્રમાણપત્ર)"
                        en="Caste / Category: SEBC / OBC (Valid Certificate)"
                        hi="जाति / वर्ग: SEBC / OBC (मान्य प्रमाण पत्र)"
                      />
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-primary font-caption text-caption font-semibold shrink-0">
                    <T gu="પાત્ર" en="Eligible" hi="पात्र" />
                  </span>
                </div>

                {/* Rule 2: Gender & Class */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low text-body-sm font-body-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon name="check_circle" size={18} className="text-primary shrink-0" />
                    <span className="truncate">
                      <T
                        gu="ધોરણ અને લિંગ: ધોરણ ૯-બી, કન્યા વિદ્યાર્થી"
                        en="Class & Gender: Grade 9-B, Girl Student"
                        hi="कक्षा और लिंग: कक्षा 9-B, छात्रा"
                      />
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-primary font-caption text-caption font-semibold shrink-0">
                    <T gu="પાત્ર" en="Eligible" hi="पात्र" />
                  </span>
                </div>

                {/* Rule 3: School Type */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low text-body-sm font-body-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon name="check_circle" size={18} className="text-primary shrink-0" />
                    <span className="truncate">
                      <T
                        gu="શાળાનો પ્રકાર: સરકારી માન્ય અનુદાનિત હાઈસ્કૂલ"
                        en="School Type: Govt. Grant-in-aid High School"
                        hi="स्कूल प्रकार: सरकारी मान्यता प्राप्त हाईस्कूल"
                      />
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-primary font-caption text-caption font-semibold shrink-0">
                    <T gu="માન્ય" en="Valid" hi="मान्य" />
                  </span>
                </div>

                {/* Rule 4: Attendance */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low text-body-sm font-body-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon name="check_circle" size={18} className="text-primary shrink-0" />
                    <span className="truncate">
                      <T
                        gu="લઘુત્તમ હાજરી: ૮૨% (જરૂરી ૮૦% કરતાં વધુ)"
                        en="Minimum Attendance: 82% (Threshold: 80%)"
                        hi="न्यूनतम उपस्थिति: 82% (आवश्यक: 80%)"
                      />
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-primary font-caption text-caption font-semibold shrink-0">
                    <T gu="માન્ય" en="Valid" hi="मान्य" />
                  </span>
                </div>

                {/* Rule 5: Income */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low text-body-sm font-body-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon name="check_circle" size={18} className="text-primary shrink-0" />
                    <span className="truncate">
                      <T
                        gu="કૌટુંબિક વાર્ષિક આવક: ₹ ૯૬,૦૦૦ (< ₹ ૬,૦૦,૦૦૦)"
                        en="Annual Family Income: ₹ 96,000 (< ₹ 6 Lakh)"
                        hi="पारिवारिक वार्षिक आय: ₹ 96,000 (< ₹ 6 लाख)"
                      />
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-primary font-caption text-caption font-semibold shrink-0">
                    <T gu="પાત્ર" en="Eligible" hi="पात्र" />
                  </span>
                </div>

                {/* Rule 6: Discrepancy Flag Box */}
                <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon name="warning" size={20} className="text-secondary" />
                      <span className="font-title-md text-title-md text-secondary font-bold">
                        <T
                          gu="પિતાના નામમાં વિસંગતતા (Spelling Divergence)"
                          en="Father's Name Spelling Divergence"
                          hi="पिता के नाम में वर्तनी विसंगति"
                        />
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-container text-white font-caption text-caption font-bold">
                      <T gu="AI મેળ ૮૪%" en="AI Match 84%" hi="AI मिलान 84%" />
                    </span>
                  </div>

                  <div className="text-caption font-caption text-on-surface pl-7 space-y-1">
                    <div>
                      • <T gu="શાળા CTS રજીસ્ટર:" en="School CTS Register:" hi="स्कूल CTS रजिस्टर:" />{" "}
                      <code className="font-bold bg-surface-container-lowest px-1 py-0.5 rounded border border-outline-variant/30">
                        મનસુખભાઈ રણછોડભાઈ પટેલ
                      </code>
                    </div>
                    <div>
                      • <T gu="મહેસૂલ આવક દાખલો:" en="Revenue Income Cert:" hi="राजस्व आय प्रमाण पत्र:" />{" "}
                      <code className="font-bold bg-surface-container-lowest px-1 py-0.5 rounded border border-outline-variant/30">
                        મનસુખલાલ આર. પટેલ
                      </code>
                    </div>
                    <p className="text-secondary font-semibold pt-1">
                      <T
                        gu="આચાર્યશ્રીના વિશેષાધિકાર અંતર્ગત સામાન્ય બોલીભેદ ('ભાઈ' / 'લાલ' અને મધ્યનામ 'આર.') સ્વીકાર્ય ગણી શકાય છે."
                        en="Under Principal discretionary review, regional phonetical variation ('Bhai'/'Lal' and 'R.') is legally acceptable."
                        hi="प्रधानाचार्य के विवेकाधिकार अंतर्गत सामान्य बोलीभेद ('भाई' / 'लाल' और मध्यनाम 'आर.') स्वीकार्य माना जा सकता है।"
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Anti-Fraud & De-duplication Verification Panel */}
            <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/40 flex flex-col gap-3">
              <div className="flex items-center gap-2 pb-2 border-b border-surface-variant/40">
                <Icon name="fingerprint" size={20} className="text-primary" />
                <h4 className="font-title-md text-title-md text-on-surface font-semibold">
                  <T
                    gu="ડી-ડુપ્લિકેશન અને ફ્રોડ ચકાસણી (Anti-Fraud Check)"
                    en="Anti-Fraud & De-duplication Check"
                    hi="एंटी-फ्रॉड और डी-डुप्लीकेशन जांच"
                  />
                </h4>
              </div>

              <div className="space-y-2 text-body-sm font-body-sm">
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-surface-container-low">
                  <Icon name="account_balance_wallet" size={18} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-on-surface">
                      <T
                        gu="બેંક ખાતા ડુપ્લિકેશન ચેક:"
                        en="Bank Account Duplication:"
                        hi="बैंक खाता डुप्लीकेशन जांच:"
                      />
                    </span>
                    <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                      <T
                        gu="રાજ્યના અન્ય કોઈ વિદ્યાર્થી સાથે લિંક નથી (SBI A/C ••••4521 - માતા હેતલબેન પટેલ)."
                        en="Unique across state registry (SBI A/C ••••4521 - Mother Hetalben Patel)."
                        hi="राज्य के किसी अन्य छात्र से लिंक नहीं है (SBI A/C ••••4521 - माता हेतलबेन पटेल)।"
                      />
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-surface-container-low">
                  <Icon name="badge" size={18} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-on-surface">
                      <T
                        gu="NPCI આધાર સીડિંગ સ્ટેટસ:"
                        en="NPCI Aadhaar Seeding Status:"
                        hi="NPCI आधार सीडिंग स्थिति:"
                      />
                    </span>
                    <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                      <T
                        gu="માતાના આધાર સાથે NPCI મેપિંગ સક્રિય અને એકમાત્ર નોંધાયેલ છે (Active DBT Bridge)."
                        en="Aadhaar-to-bank mapping active with single registered mandate (Active DBT Bridge)."
                        hi="माता के आधार के साथ NPCI मैपिंग सक्रिय एवं एकमात्र पंजीकृत (Active DBT Bridge)।"
                      />
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-surface-container-low">
                  <Icon name="merge_type" size={18} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-on-surface">
                      <T
                        gu="સમાંતર સ્કીમ અથડામણ (Scheme Clash):"
                        en="Parallel Scheme Conflict:"
                        hi="समानांतर योजना टकराव (Scheme Clash):"
                      />
                    </span>
                    <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                      <T
                        gu="સરસ્વતી સાધના કે અન્ય પ્રતિબંધિત DBT સહાય સાથે કોઈ ટકરાવ નથી."
                        en="No conflict detected with Saraswati Sadhana or restricted financial grant schemes."
                        hi="सरस्वती साधना या अन्य प्रतिबंधित DBT सहायता के साथ कोई टकराव नहीं।"
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Officer Action Panel & Remarks */}
            <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/40 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="principalRemark"
                  className="font-title-md text-title-md text-on-surface font-semibold flex items-center gap-1.5"
                >
                  <Icon name="rate_review" size={18} className="text-primary" />
                  <span>
                    <T
                      gu="આચાર્યશ્રીની નોંધ અને અભિપ્રાય (Principal Remarks)"
                      en="Principal's Remarks & Decision"
                      hi="प्रधानाचार्य की टिप्पणी एवं निर्णय"
                    />
                  </span>
                </label>
                <button
                  type="button"
                  onClick={handleApplyAiRemark}
                  className="flex items-center gap-1 text-primary hover:text-primary-container font-caption text-caption font-bold transition-colors"
                >
                  <Icon name="smart_toy" size={14} />
                  <span>
                    <T
                      gu="AI ભલામણ લાગુ કરો"
                      en="Insert AI Suggestion"
                      hi="AI सुझाव लागू करें"
                    />
                  </span>
                </button>
              </div>

              <textarea
                id="principalRemark"
                rows={3}
                value={principalRemark}
                onChange={(e) => setPrincipalRemark(e.target.value)}
                placeholder="અહીં નિર્ણયનું કારણ અથવા નોંધ લખો... (Type justification or remarks here...)"
                disabled={actionState !== "idle"}
                className="w-full p-3 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary border border-outline-variant/30 disabled:opacity-60"
              />

              {/* Action Buttons */}
              {actionState === "idle" ? (
                <div className="flex flex-col gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    {/* Approve Button (Green) */}
                    <button
                      type="button"
                      onClick={handleApprove}
                      className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.98]"
                    >
                      <Icon name="task_alt" size={20} />
                      <span>
                        <T
                          gu="વિશેષાધિકારથી મંજૂર કરો (Approve)"
                          en="Approve under Discretion"
                          hi="विशेषाधिकार से स्वीकृत करें (Approve)"
                        />
                      </span>
                    </button>

                    {/* Request Correction Button (Amber) */}
                    <button
                      type="button"
                      onClick={() => setShowCorrectionModal(true)}
                      className="h-12 px-4 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 dark:bg-amber-950 dark:text-amber-200 font-label-lg text-label-lg font-bold flex items-center justify-center gap-1.5 transition-colors border border-amber-300 dark:border-amber-700"
                    >
                      <Icon name="build" size={18} />
                      <span className="hidden sm:inline">
                        <T gu="સુધારો મોકલો" en="Request Fix" hi="सुधार भेजें" />
                      </span>
                    </button>

                    {/* Reject Button (Red) */}
                    <button
                      type="button"
                      onClick={() => setShowRejectModal(true)}
                      title="Reject Application"
                      className="h-12 px-3 rounded-xl bg-error hover:bg-red-700 text-on-error font-label-lg text-label-lg flex items-center justify-center transition-colors shadow-sm"
                    >
                      <Icon name="close" size={20} />
                    </button>
                  </div>
                  <p className="text-center font-caption text-[11px] text-on-surface-variant">
                    <T
                      gu="મંજૂર કરવાથી DBT પોર્ટલ પર ₹ ૧૦,૦૦૦ ની વાર્ષિક હપ્તા મંજૂરી માટે ડેટા જિલ્લા શિક્ષણાધિકારી (DEO) કચેરીને અગ્રેસર થશે."
                      en="Approval automatically queues the ₹ 10,000 DBT tranche to the District Education Office (DEO) ledger."
                      hi="स्वीकृत करने से DBT पोर्टल पर ₹ 10,000 की वार्षिक किस्त मंजूरी हेतु डेटा DEO कार्यालय को अग्रेषित होगा।"
                    />
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-2">
                  <div className="font-caption text-caption text-on-surface-variant">
                    <T
                      gu="આ અરજી પર નિર્ણય લેવાઈ ગયો છે."
                      en="Decision recorded on this application."
                      hi="इस आवेदन पर निर्णय दर्ज हो चुका है।"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActionState("idle");
                      setPrincipalRemark("");
                    }}
                    className="text-xs font-semibold text-primary underline hover:opacity-80"
                  >
                    <T gu="ફેરફાર કરવો છે? (Reset)" en="Change Decision" hi="निर्णय बदलें" />
                  </button>
                </div>
              )}
            </div>

            {/* Application Audit Trail / Activity Log Accordion */}
            <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/40 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setIsLogExpanded(!isLogExpanded)}
                className="flex items-center justify-between cursor-pointer w-full text-left"
              >
                <div className="flex items-center gap-2">
                  <Icon name="history" size={20} className="text-on-surface-variant" />
                  <span className="font-title-md text-title-md text-on-surface font-semibold">
                    <T
                      gu="અરજી સમયરેખા (Audit Trail & Activity Log)"
                      en="Application Timeline & Audit Log"
                      hi="आवेदन समयरेखा एवं ऑडिट लॉग"
                    />
                  </span>
                </div>
                <Icon
                  name={isLogExpanded ? "expand_more" : "chevron_right"}
                  size={20}
                  className="text-on-surface-variant"
                />
              </button>

              {isLogExpanded && (
                <div className="space-y-3 pt-2 border-t border-surface-variant/40 font-caption text-caption text-on-surface-variant">
                  {auditLogs.map((entry) => (
                    <div key={entry.id} className="flex items-start gap-2.5">
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          entry.type === "officer"
                            ? "bg-emerald-600 ring-2 ring-emerald-200"
                            : entry.type === "system"
                            ? "bg-primary"
                            : "bg-on-surface-variant"
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-on-surface">
                            <T
                              gu={entry.titleGu}
                              en={entry.titleEn}
                              hi={entry.titleHi}
                            />
                          </span>
                          <span className="text-[11px] text-on-surface-variant font-mono">
                            <T
                              gu={entry.timeGu}
                              en={entry.timeEn}
                              hi={entry.timeHi}
                            />
                          </span>
                        </div>
                        <div className="mt-0.5">
                          <T
                            gu={entry.detailGu}
                            en={entry.detailEn}
                            hi={entry.detailHi}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal: Rejection Reason */}
        {showRejectModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest max-w-md w-full p-6 rounded-2xl shadow-xl border border-outline-variant/40 flex flex-col gap-4 animate-scale-in">
              <div className="flex items-center justify-between pb-2 border-b border-surface-variant/40">
                <div className="flex items-center gap-2 text-error font-title-lg font-bold">
                  <Icon name="cancel" size={24} />
                  <span>
                    <T gu="અરજી નામંજૂર કરો" en="Reject Application" hi="आवेदन अस्वीकृत करें" />
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant"
                >
                  <Icon name="close" size={20} />
                </button>
              </div>

              <p className="font-body-sm text-body-sm text-on-surface">
                <T
                  gu="કૃપા કરીને રિયા પટેલની અરજી નામંજૂર કરવાનું સત્તાવાર કારણ દર્શાવો. આ કારણ વિદ્યાર્થી અને વાલીને મોકલવામાં આવશે."
                  en="Please state the official rejection grounds for Riya Patel. This notification will be communicated to the student and parent."
                  hi="कृपया रिया पटेल के आवेदन को अस्वीकृत करने का आधिकारिक कारण दर्ज करें। यह कारण छात्र और अभिभावक को भेजा जाएगा।"
                />
              </p>

              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="અયોગ્ય દસ્તાવેજ અથવા વિસંગતતાનું કારણ... (State reason for rejection...)"
                className="w-full p-3 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm border border-outline-variant/40 focus:ring-2 focus:ring-error focus:outline-none"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold"
                >
                  <T gu="રદ કરો" en="Cancel" hi="रद्द करें" />
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  className="px-5 py-2 rounded-xl bg-error hover:bg-red-700 text-on-error font-label-md text-label-md font-bold shadow-sm"
                >
                  <T gu="નામંજૂર પુષ્ટિ કરો" en="Confirm Rejection" hi="अस्वीकृति की पुष्टि करें" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Request Correction */}
        {showCorrectionModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest max-w-md w-full p-6 rounded-2xl shadow-xl border border-outline-variant/40 flex flex-col gap-4 animate-scale-in">
              <div className="flex items-center justify-between pb-2 border-b border-surface-variant/40">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-title-lg font-bold">
                  <Icon name="build" size={24} />
                  <span>
                    <T gu="સુધારો મોકલો" en="Request Correction" hi="सुधार का अनुरोध भेजें" />
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCorrectionModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant"
                >
                  <Icon name="close" size={20} />
                </button>
              </div>

              <p className="font-body-sm text-body-sm text-on-surface">
                <T
                  gu="વિદ્યાર્થીને સુધારા માટેની સ્પષ્ટ સૂચના આપો (દા.ત. પિતાનું નામ મેળ બેસતું સોગંદનામું અથવા અપડેટ કરેલ આધાર અપલોડ કરવો):"
                  en="Specify the correction instructions for the student (e.g. upload father's affidavit or corrected Aadhaar e-KYC):"
                  hi="छात्र के लिए आवश्यक सुधार निर्देश दर्ज करें (उदा. पिता के नाम का शपथ पत्र या अद्यतन आधार अपलोड करें):"
                />
              </p>

              <textarea
                rows={3}
                value={correctionInstruction}
                onChange={(e) => setCorrectionInstruction(e.target.value)}
                placeholder="સુધારા સૂચના દાખલ કરો... (Type correction instructions...)"
                className="w-full p-3 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm border border-outline-variant/40 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCorrectionModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold"
                >
                  <T gu="રદ કરો" en="Cancel" hi="रद्द करें" />
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCorrection}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-label-md text-label-md font-bold shadow-sm"
                >
                  <T gu="સુધારો મોકલો" en="Send Request" hi="सुधार भेजें" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </OfficerShell>
  );
}
