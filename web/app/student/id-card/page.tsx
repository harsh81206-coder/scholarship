"use client";

import { T } from "@/components/T";
import { DownloadButton } from "@/components/DownloadButton";
import { ErrorState } from "@/components/states/ErrorState";
import { Skeleton } from "@/components/states/Skeleton";
import { StudentShell } from "@/components/shell/StudentShell";
import { QRCodeView } from "@/components/QRCodeView";
import { useMe } from "@/lib/api/hooks";
import { localizedName } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { downloadApiFile } from "@/lib/api/client";

export default function Page() {
  const query = useMe();
  const lang = useAppStore((state) => state.lang);
  const student = query.data;
  return <StudentShell><main className="mx-auto max-w-xl space-y-5 px-4 py-5"><header><p className="font-label-sm text-primary"><T gu="ડિજિટલ ઓળખ" en="DIGITAL IDENTITY" hi="डिजिटल पहचान" /></p><h1 className="mt-1 font-headline-md text-on-surface"><T gu="વિદ્યાર્થી ઓળખપત્ર" en="Student identity card" hi="छात्र पहचान पत्र" /></h1></header>{query.isLoading ? <Skeleton rows={4} /> : query.isError ? <ErrorState error={query.error} onRetry={() => void query.refetch()} /> : student ? <><article className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm"><div className="bg-primary p-5 text-on-primary"><p className="text-xs uppercase tracking-widest"><T gu="વિદ્યા પ્રગતિ સેતુ" en="Vidya Pragati Setu" hi="विद्या प्रगति सेतु" /></p><h2 className="mt-1 font-title-md"><T gu="વિદ્યાર્થી ઓળખપત્ર" en="Student ID" hi="छात्र पहचान पत्र" /></h2></div><div className="grid grid-cols-[1fr_auto] items-center gap-3 p-5"><div><p className="font-title-sm text-on-surface">{localizedName(student, lang)}</p><p className="mt-1 font-mono text-xs text-on-surface-variant">{student.cts_id}</p><p className="mt-3 text-sm text-on-surface-variant">Grade {student.grade}</p><p className="text-sm text-on-surface-variant">{student.school_name}</p></div><QRCodeView value={`VPS-STUDENT|${student.cts_id}`} label={student.cts_id} size={112} /></div><p className="border-t border-outline-variant px-5 py-3 text-xs text-on-surface-variant"><T gu="QR માં CTS ID જ છે; આધાર નંબર નથી." en="QR contains only the CTS ID; no Aadhaar number." hi="QR में केवल CTS ID है; आधार नंबर नहीं।" /></p></article><DownloadButton label={<T gu="ઓળખપત્ર PDF" en="Download ID card PDF" hi="पहचान पत्र PDF डाउनलोड" />} onClick={() => void downloadApiFile("/students/me/id-card.pdf", "student-id.pdf")} /></> : null}</main></StudentShell>;
}
