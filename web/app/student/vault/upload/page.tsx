"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { StudentShell } from "@/components/shell/StudentShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import Link from "next/link";

type Step = "select" | "scanning" | "review" | "done";

const OCR_RESULT = {
  certNo: "REV/AND/2026/049182",
  parentName: "Mansukhbhai R. Patel",
  studentName: "Riya Mansukhbhai Patel",
  annualIncome: "₹96,000 (Chhannyu Hazar)",
  validity: "31 March 2027",
  confidence: 98,
};

const GUIDELINES = [
  { icon: "crop_free", gu: "૪ ખૂણા સ્પષ્ટ", en: "4 Corners Visible" },
  { icon: "light_mode", gu: "સારો પ્રકાશ", en: "Good Lighting" },
  { icon: "qr_code_2", gu: "QR દેખાય", en: "QR Visible" },
];

export default function DocumentUploadOCRPage() {
    const router = useRouter();
  const [step, setStep] = useState<Step>("select");
  const [editing, setEditing] = useState<Record<string, string>>({});

  function handleFileSelect() {
    setStep("scanning");
    setTimeout(() => setStep("review"), 2000);
  }

  function handleConfirm() {
    setStep("done");
    setTimeout(() => router.push("/student/vault"), 1200);
  }

  return (
    <StudentShell>
      <div className="flex flex-col gap-4 pb-6 px-4">
        {/* Step header */}
        <div className="flex items-center justify-between pt-2">
          <Link href="/student/vault" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shadow-sm">
            <Icon name="arrow_back" size={20} />
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-md text-label-md">
            <Icon name="verified" size={15} className="text-primary" />
            <T gu="AI સ્કેન સમીક્ષા" en="AI OCR Review" hi="AI स्कैन समीक्षा" />
          </div>
          <button className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
            <Icon name="help_outline" size={20} />
          </button>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">
            <T gu="દસ્તાવેજ અપલોડ & AI OCR" en="Document Upload & AI OCR" hi="दस्तावेज़ अपलोड और AI OCR" />
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            <T
              gu="એકવાર અપ. → AI ચકાસ. → ડૉ. વૉ. સ. સ."
              en="Upload once → AI verifies → Secure digital vault."
              hi="एक बार अपलोड → AI सत्यापन → सुरक्षित वॉल्ट।"
            />
          </p>
        </div>

        {/* Student card */}
        <div className="card p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-title-lg font-bold shrink-0 shadow-sm">RP</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-title-md text-title-md text-on-surface font-semibold truncate">
                  <T gu="રિયા હસ. પટેલ" en="Riya H. Patel" hi="रिया एच. पटेल" />
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-surface-container text-primary font-label-md text-[11px] font-bold">ધો. 9-B</span>
              </div>
              <p className="font-caption text-caption text-on-surface-variant truncate">
                <T gu="શ્રી સ. પ. હાઈ., આ." en="Sardar Patel HS, Anand" hi="सरदार पटेल HS, आणंद" />
              </p>
              <p className="font-caption text-[11px] text-on-surface-variant font-mono">GJ-AND-2026-004512</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-container text-primary font-caption text-caption">
            <Icon name="auto_awesome" size={16} className="text-secondary shrink-0" />
            <span className="truncate">
              <T
                gu="→ નમો લક્ષ્મી + OBC શ. સ. link"
                en="→ Will link to Namo Lakshmi + OBC Scholarship"
                hi="→ नमो लक्ष्मी + OBC छात्रवृत्ति से लिंक होगा"
              />
            </span>
          </div>
        </div>

        {/* STEP: Select / Upload */}
        {step === "select" && (
          <>
            {/* Existing uploaded doc */}
            <div className="card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                    <Icon name="description" size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-label-lg text-label-lg text-on-surface truncate">
                      <T gu="આવકનું પ્રમાણ." en="Income Certificate" hi="आय प्रमाण पत्र" />
                    </div>
                    <div className="font-caption text-caption text-on-surface-variant">
                      <T gu="સ. અ. દ્વ. પ્ર." en="Certified by competent authority" hi="सक्षम प्राधिकारी द्वारा" />
                    </div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success-container text-on-success-container font-label-md text-label-md">
                  <Icon name="check_circle" size={14} />
                  <T gu="અ. સ." en="Uploaded" hi="अपलोड" />
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded bg-surface-container-high flex items-center justify-center text-primary shrink-0 font-label-md font-bold text-xs">PDF</div>
                  <div className="min-w-0">
                    <p className="font-label-md text-label-md text-on-surface truncate font-mono">Aavak_Pramanpatra_2026.pdf</p>
                    <p className="font-caption text-caption text-on-surface-variant">1.8 MB • 15 Apr 2025</p>
                  </div>
                </div>
                <button className="shrink-0 px-2.5 py-1 rounded-full bg-surface-container text-primary font-label-md text-label-md hover:bg-surface-container-high transition-colors">
                  <T gu="બ." en="Replace" hi="बदलें" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {GUIDELINES.map((g) => (
                  <div key={g.icon} className="flex items-center justify-center gap-1 py-1.5 px-1 rounded bg-surface-container-low text-on-surface-variant font-caption text-[11px] text-center">
                    <Icon name={g.icon} size={14} className="text-primary" />
                    <T gu={g.gu} en={g.en} hi={g.en} />
                  </div>
                ))}
              </div>
            </div>

            {/* Upload new doc */}
            <div
              onClick={handleFileSelect}
              className="border-2 border-dashed border-primary/40 rounded-xl p-8 flex flex-col items-center gap-3 text-center cursor-pointer hover:bg-surface-container-low hover:border-primary transition-all"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="cloud_upload" size={30} className="text-primary" />
              </div>
              <div>
                <p className="font-title-md text-title-md text-on-surface font-semibold">
                  <T gu="ફોટો / PDF ઉ." en="Upload Photo / PDF" hi="फोटो / PDF अपलोड करें" />
                </p>
                <p className="font-caption text-caption text-on-surface-variant mt-1">
                  <T gu="ટૅ. ક. • JPG, PNG, PDF • ≤5MB" en="Tap to select • JPG, PNG, PDF • ≤5MB" hi="टैप करें • JPG, PNG, PDF • ≤5MB" />
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 font-caption text-caption text-on-surface-variant">
                  <Icon name="photo_camera" size={14} />
                  <T gu="ક." en="Camera" hi="कैमरा" />
                </span>
                <span className="flex items-center gap-1 font-caption text-caption text-on-surface-variant">
                  <Icon name="folder" size={14} />
                  <T gu="ગ." en="Gallery" hi="गैलरी" />
                </span>
                <span className="flex items-center gap-1 font-caption text-caption text-on-surface-variant">
                  <Icon name="drive_folder_upload" size={14} />
                  <T gu="ડ." en="DigiLocker" hi="DigiLocker" />
                </span>
              </div>
            </div>
          </>
        )}

        {/* STEP: Scanning */}
        {step === "scanning" && (
          <div className="card p-8 flex flex-col items-center gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center relative">
              <Icon name="psychology" size={40} className="text-primary" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-on-secondary animate-ping" />
              </span>
            </div>
            <div>
              <h2 className="font-title-lg text-title-lg text-on-surface font-semibold">
                <T gu="AI OCR સ્કૅ. ચ...." en="AI OCR Scanning..." hi="AI OCR स्कैनिंग..." />
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                <T gu="ક. ✓ → ડ. ✓ → ✓ ✓ ✓" en="Detecting → Extracting → Verifying fields..." hi="पहचान → निष्कर्षण → सत्यापन..." />
              </p>
            </div>
            <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
              <div className="bg-primary h-full rounded-full animate-pulse" style={{ width: "75%" }} />
            </div>
          </div>
        )}

        {/* STEP: Review OCR */}
        {step === "review" && (
          <>
            <div className="card p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                  <h2 className="font-title-md text-title-md text-on-surface">
                    <T gu="AI OCR ફ. ন." en="AI Extracted Fields" hi="AI निष्कर्षित फील्ड" />
                  </h2>
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-success-container text-on-success-container font-label-md text-label-md font-semibold">
                  <Icon name="psychology" size={14} />
                  <span>{OCR_RESULT.confidence}%</span>
                </div>
              </div>

              {/* Document sim */}
              <div className="relative w-full rounded-xl bg-surface-container-low p-3 shadow-inner overflow-hidden">
                <div className="bg-surface-container-lowest rounded-lg p-3 space-y-2 shadow-sm text-[11px]">
                  <div className="flex flex-col items-center text-center space-y-0.5 pb-2 border-b border-outline-variant">
                    <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-primary">
                      <Icon name="account_balance" size={16} />
                    </div>
                    <div className="font-label-md text-[11px] text-on-surface font-bold">ગુજ. સ. - મ. વિ.</div>
                    <div className="font-caption text-[10px] text-on-surface-variant">મામ. ક., આ. - આ. પ્ર.</div>
                  </div>
                  {[
                    { label: "જા. ક્ર.:", value: OCR_RESULT.certNo, highlight: true },
                    { label: "વ. ન.:", value: OCR_RESULT.parentName, highlight: false },
                    { label: "વ.ના. ન.:", value: OCR_RESULT.studentName, highlight: false },
                    { label: "વ. આ.:", value: OCR_RESULT.annualIncome, highlight: true },
                  ].map(({ label, value, highlight }) => (
                    <div key={label} className="flex items-center justify-between gap-2">
                      <span className="text-on-surface-variant shrink-0">{label}</span>
                      <span className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-semibold ${highlight ? "bg-primary/10 text-primary" : "text-on-surface"}`}>{value}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-2">
                    <div className="w-10 h-10 rounded bg-surface-container-high flex items-center justify-center text-primary">
                      <Icon name="qr_code_2" size={22} />
                    </div>
                    <span className="font-caption text-[10px] text-on-surface-variant">DigiLocker QR ✓</span>
                    <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-primary">
                      <Icon name="verified" size={18} fill />
                    </div>
                  </div>
                </div>
              </div>

              {/* Editable fields */}
              <div className="space-y-3">
                <p className="font-label-md text-label-md text-on-surface-variant font-semibold">
                  <T gu="ચ. & સ." en="Review & Confirm Extracted Data" hi="समीक्षा और पुष्टि करें" />
                </p>
                {Object.entries(OCR_RESULT).filter(([k]) => k !== "confidence").map(([key, val]) => (
                  <div key={key} className="flex flex-col gap-1">
                    <label className="font-caption text-caption text-on-surface-variant capitalize">{key.replace(/([A-Z])/g, " $1")}</label>
                    <input
                      className="input text-sm"
                      value={editing[key] ?? String(val)}
                      onChange={(e) => setEditing((p) => ({ ...p, [key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full h-12 bg-secondary text-on-secondary font-label-lg text-label-lg font-bold rounded-xl shadow-md flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            >
              <Icon name="check_circle" size={20} />
              <T gu="ચ. & ડૉ. વૉ. સ." en="Confirm & Save to Vault" hi="पुष्टि करें और वॉल्ट में सहेजें" />
            </button>
          </>
        )}

        {/* STEP: Done */}
        {step === "done" && (
          <div className="card p-8 flex flex-col items-center gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-success-container flex items-center justify-center">
              <Icon name="check_circle" size={48} fill className="text-on-success-container" />
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                <T gu="ડૉ. સ. ✓" en="Document Saved!" hi="दस्तावेज़ सहेजा!" />
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                <T gu="ડૉ. વૉ. → ..." en="Returning to Document Vault..." hi="दस्तावेज़ वॉल्ट पर वापस..." />
              </p>
            </div>
          </div>
        )}
      </div>
    </StudentShell>
  );
}
