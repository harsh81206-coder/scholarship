"use client";

import { useParams } from "next/navigation";
import { T } from "@/components/T";
import { ErrorState } from "@/components/states/ErrorState";
import { Skeleton } from "@/components/states/Skeleton";
import { PublicShell } from "@/components/shell/PublicShell";
import { QRCodeView } from "@/components/QRCodeView";
import { usePublicVerify } from "@/lib/api/hooks";

type Verification = { valid: boolean; code: string; kind?: string; issued_at?: string; reference?: string; student?: string; amount?: number; status?: string; hash?: string; reason?: string };

export default function Page() {
  const params = useParams<{ code: string }>();
  const code = decodeURIComponent(params.code ?? "");
  const query = usePublicVerify(code);
  const result = query.data as Verification | undefined;
  return <PublicShell><main className="mx-auto max-w-3xl space-y-5 px-5 py-10"><header><p className="font-label-sm text-primary"><T gu="જાહેર ચકાસણી" en="PUBLIC VERIFICATION" hi="सार्वजनिक सत्यापन" /></p><h1 className="mt-1 font-headline-lg text-on-surface"><T gu="દસ્તાવેજની અધિકૃતતા તપાસો" en="Verify a document" hi="दस्तावेज़ सत्यापित करें" /></h1></header>{query.isLoading ? <Skeleton rows={4} /> : query.isError ? <ErrorState error={query.error} onRetry={() => void query.refetch()} /> : result ? <section className={`card grid gap-5 p-5 sm:grid-cols-[1fr_160px] ${result.valid ? "border-success/40" : "border-error/40"}`}><div><div className="flex items-center gap-2"><span className={`material-symbols-outlined ${result.valid ? "text-success" : "text-error"}`}>{result.valid ? "verified" : "error"}</span><h2 className="font-title-md text-on-surface">{result.valid ? <T gu="ચકાસણી સફળ" en="Verified" hi="सत्यापित" /> : <T gu="રેકોર્ડ મળ્યો નથી" en="No matching record" hi="रिकॉर्ड नहीं मिला" />}</h2></div><dl className="mt-4 space-y-2 text-sm"><Row label={<T gu="કોડ" en="Code" hi="कोड" />} value={result.code} /><Row label={<T gu="પ્રકાર" en="Type" hi="प्रकार" />} value={result.kind ?? result.reason ?? "—"} /><Row label={<T gu="સંદર્ભ" en="Reference" hi="संदर्भ" />} value={result.reference ?? "—"} /><Row label={<T gu="વિદ્યાર્થી" en="Student" hi="छात्र" />} value={result.student ?? "—"} /><Row label={<T gu="રકમ" en="Amount" hi="राशि" />} value={result.amount == null ? "—" : `₹${result.amount.toLocaleString("en-IN")}`} /><Row label={<T gu="સ્થિતિ" en="Status" hi="स्थिति" />} value={result.status ?? "—"} /><Row label={<T gu="જારી તારીખ" en="Issued" hi="जारी" />} value={result.issued_at ? new Date(result.issued_at).toLocaleString() : "—"} /></dl>{result.hash && <p className="mt-4 break-all font-mono text-[10px] text-on-surface-variant">SHA-256: {result.hash}</p>}</div><QRCodeView value={code} label={code} size={132} /></section> : null}<p className="text-xs text-on-surface-variant"><T gu="જાહેર ચકાસણી વ્યક્તિગત માહિતી દર્શાવતી નથી." en="Public verification does not expose private personal records." hi="सार्वजनिक सत्यापन निजी व्यक्तिगत रिकॉर्ड नहीं दिखाता।" /></p></main></PublicShell>;
}

function Row({ label, value }: { label: React.ReactNode; value: string }) { return <div className="grid grid-cols-[120px_1fr] gap-3"><dt className="text-on-surface-variant">{label}</dt><dd className="break-all font-medium text-on-surface">{value}</dd></div>; }
