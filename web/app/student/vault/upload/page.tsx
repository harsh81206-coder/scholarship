"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StudentShell } from "@/components/shell/StudentShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { Skeleton } from "@/components/states/Skeleton";
import { ErrorState } from "@/components/states/ErrorState";
import { EmptyState } from "@/components/states/EmptyState";
import { ApiModeBadge } from "@/app/student/components/ApiModeBadge";
import { useAppStore } from "@/lib/store";
import { useMe, useDocuments, useUploadDocument } from "@/lib/api/hooks";

type Step = "select" | "scanning" | "review" | "done";

const DOC_TYPES = [
  { id: "income", gu: "આવકનો દાખલો", en: "Income Certificate", hi: "आय प्रमाण पत्र" },
  { id: "aadhaar", gu: "આધાર કાર્ડ", en: "Aadhaar Card", hi: "आधार कार्ड" },
  { id: "caste", gu: "જાતિનો દાખલો", en: "Caste Certificate", hi: "जाति प्रमाण पत्र" },
  { id: "marksheet", gu: "માર્કશીટ", en: "Marksheet", hi: "मार्कशीट" },
];

const GUIDELINES = [
  { icon: "crop_free", gu: "૪ ખૂણા સ્પષ્ટ", en: "4 Corners Visible", hi: "चारों कोने स्पष्ट" },
  { icon: "light_mode", gu: "સારો પ્રકાશ", en: "Good Lighting", hi: "अच्छी रोशनी" },
  { icon: "qr_code_2", gu: "QR દેખાય", en: "QR Visible", hi: "QR स्पष्ट दिखे" },
];

export default function DocumentUploadOCRPage() {
  const router = useRouter();
  const showSuccess = useAppStore((s) => s.showSuccess);
  const showError = useAppStore((s) => s.showError);
  const lang = useAppStore((s) => s.lang);
  const { data: profile, isLoading: loadingMe, error: errorMe, refetch: refetchMe } = useMe();
  const { data: docs, isLoading: loadingDocs, error: errorDocs, refetch: refetchDocs } = useDocuments();
  const uploadMutation = useUploadDocument();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [docType, setDocType] = useState("income");
  const [step, setStep] = useState<Step>("select");
  const [ocrResult, setOcrResult] = useState<Record<string, unknown>>({});
  const [confidence, setConfidence] = useState(95);
  const [editing, setEditing] = useState<Record<string, string>>({});

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStep("scanning");
    try {
      const res = await uploadMutation.mutateAsync({ docType, file });
      const rawOcr = (res.ocr_fields ?? res.ocr_json ?? res.ocr ?? {}) as Record<string, unknown>;
      setOcrResult(
        Object.keys(rawOcr).length > 0
          ? rawOcr
          : { file_name: file.name, doc_type: docType, status: String(res.status ?? "pending") }
      );
      const conf = Number(res.confidence ?? 0.95);
      setConfidence(conf <= 1 ? Math.round(conf * 100) : Math.round(conf));
      setEditing({});
      setStep("review");
      showSuccess("Document uploaded & scanned via AI OCR");
    } catch (err) {
      setStep("select");
      showError(err instanceof Error ? err.message : "Upload failed");
    }
  }

  function handleConfirm() {
    setStep("done");
    setTimeout(() => router.push("/student/vault"), 1000);
  }

  if (loadingMe || loadingDocs) {
    return (
      <StudentShell>
        <ApiModeBadge />
        <div className="p-4">
          <Skeleton rows={4} />
        </div>
      </StudentShell>
    );
  }

  if (errorMe || errorDocs) {
    return (
      <StudentShell>
        <ApiModeBadge />
        <div className="p-4">
          <ErrorState error={errorMe ?? errorDocs} onRetry={() => { void refetchMe(); void refetchDocs(); }} />
        </div>
      </StudentShell>
    );
  }

  const docList = Array.isArray(docs) ? docs : [];

  return (
    <StudentShell>
      <ApiModeBadge />
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
          <Link href="/student/vault" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
            <Icon name="folder_shared" size={20} />
          </Link>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">
            <T gu="દસ્તાવેજ અપલોડ & AI OCR" en="Document Upload & AI OCR" hi="दस्तावेज़ अपलोड और AI OCR" />
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            <T
              gu="એકવાર અપલોડ → AI ચકાસણી → સુરક્ષિત વૉલ્ટ"
              en="Upload once → AI verifies → Secure digital vault."
              hi="एक बार अपलोड → AI सत्यापन → सुरक्षित वॉल्ट।"
            />
          </p>
        </div>

        {/* Student card */}
        <div className="card p-4 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary text-on-primary flex items-center justify-center font-title-md font-bold shrink-0 shadow-sm">
              {profile?.name_en?.slice(0, 2).toUpperCase() ?? "ST"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-title-md text-title-md text-on-surface font-semibold truncate">
                  {profile?.name_en ?? "Student"}
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-surface-container text-primary font-label-md text-[11px] font-bold">
                  {profile?.grade ? `Gr ${profile.grade}` : <T gu="ધોરણ અજ્ઞાત" en="Grade unavailable" hi="कक्षा उपलब्ध नहीं" />}
                </span>
              </div>
              <p className="font-caption text-caption text-on-surface-variant truncate">{profile?.school_name ?? ""}</p>
              <p className="font-caption text-[11px] text-on-surface-variant font-mono">{profile?.cts_id ?? ""}</p>
            </div>
          </div>
        </div>

        {/* STEP: Select / Upload */}
        {step === "select" && (
          <>
            <div className="card p-4 space-y-3">
              <label className="block text-xs font-semibold text-on-surface">
                <T gu="દસ્તાવેજનો પ્રકાર પસંદ કરો" en="Select Document Type" hi="दस्तावेज़ प्रकार चुनें" />
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-sm text-on-surface"
              >
                {DOC_TYPES.map((dt) => (
                  <option key={dt.id} value={dt.id}>
                    {dt[lang]}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-3 gap-1.5">
                {GUIDELINES.map((g) => (
                  <div key={g.icon} className="flex items-center justify-center gap-1 py-1.5 px-1 rounded bg-surface-container-low text-on-surface-variant font-caption text-[11px] text-center">
                    <Icon name={g.icon} size={14} className="text-primary" />
                    <T gu={g.gu} en={g.en} hi={g.hi} />
                  </div>
                ))}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf,application/pdf,image/jpeg,image/png"
              className="hidden"
              onChange={handleFileChange}
              data-testid="document-file-input"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-primary/40 rounded-xl p-8 flex flex-col items-center gap-3 text-center cursor-pointer hover:bg-surface-container-low hover:border-primary transition-all w-full"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="cloud_upload" size={30} className="text-primary" />
              </div>
              <div>
                <p className="font-title-md text-title-md text-on-surface font-semibold">
                  <T gu="ફોટો / PDF અપલોડ કરો" en="Upload Photo / PDF" hi="फोटो / PDF अपलोड करें" />
                </p>
                <p className="font-caption text-caption text-on-surface-variant mt-1">
                  <T gu="JPG, PNG, PDF • ≤10MB" en="Tap to select • JPG, PNG, PDF • ≤10MB" hi="टैप करें • JPG, PNG, PDF • ≤10MB" />
                </p>
              </div>
            </button>

            {docList.length > 0 && (
              <div className="card p-4 space-y-2">
                <p className="text-xs font-semibold text-on-surface-variant">
                  <T gu="અપલોડ થયેલા દસ્તાવેજો" en={`Uploaded Documents (${docList.length})`} hi={`अपलोड किए गए दस्तावेज़ (${docList.length})`} />
                </p>
                {docList.map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low text-xs">
                    <span className="font-medium capitalize">{d.doc_type}</span>
                    <span className="px-2 py-0.5 rounded-full bg-success-container text-on-success-container font-semibold">
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {docList.length === 0 && <EmptyState title="No documents yet" description="Uploaded documents will appear here." />}
          </>
        )}

        {/* STEP: Scanning */}
        {step === "scanning" && (
          <div className="card p-8 flex flex-col items-center gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="psychology" size={40} className="text-primary" />
            </div>
            <div>
              <h2 className="font-title-lg text-title-lg text-on-surface font-semibold">
                <T gu="AI OCR સ્કૅન ચાલુ છે..." en="AI OCR Scanning..." hi="AI OCR स्कैनिंग..." />
              </h2>
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
                    <T gu="AI OCR ડેટા" en="AI Extracted Fields" hi="AI निष्कर्षित फील्ड" />
                  </h2>
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-success-container text-on-success-container font-label-md text-label-md font-semibold">
                  <Icon name="psychology" size={14} />
                  <span>{confidence}%</span>
                </div>
              </div>

              <div className="space-y-3">
                {Object.entries(ocrResult).map(([key, val]) => (
                  <div key={key} className="flex flex-col gap-1">
                    <label className="font-caption text-caption text-on-surface-variant capitalize">
                      {key.replace(/_/g, " ")}
                    </label>
                    <input
                      className="input text-sm"
                      value={editing[key] ?? String(val ?? "")}
                      onChange={(e) => setEditing((p) => ({ ...p, [key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              className="w-full h-12 bg-secondary text-on-secondary font-label-lg text-label-lg font-bold rounded-xl shadow-md flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            >
              <Icon name="check_circle" size={20} />
              <T gu="ચકાસો અને વૉલ્ટમાં સંગ્રહો" en="Confirm & Save to Vault" hi="पुष्टि करें और वॉल्ट में सहेजें" />
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
                <T gu="દસ્તાવેજ સંગ્રહાયો ✓" en="Document Saved!" hi="दस्तावेज़ सहेजा!" />
              </h2>
            </div>
          </div>
        )}
      </div>
    </StudentShell>
  );
}
