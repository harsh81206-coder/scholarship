"use client";

import { DownloadButton } from "@/components/DownloadButton";
import { T } from "@/components/T";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { Skeleton } from "@/components/states/Skeleton";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { useHandovers } from "@/lib/api/hooks";
import { downloadCsv } from "@/lib/download";

type Handover = { id: number; serial_no: string; cts_id: string; student_name: string; school: string; status: string; handed_at?: string; lat?: number; lng?: number };

export default function Page() {
  const query = useHandovers();
  const rows = (query.data?.items ?? []) as Handover[];
  return <OfficerShell role="school"><main className="mx-auto max-w-6xl space-y-5 p-5"><header className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-label-sm text-primary"><T gu="સાયકલ વિતરણ" en="CYCLE DISTRIBUTION" hi="साइकिल वितरण" /></p><h1 className="mt-1 font-headline-md text-on-surface"><T gu="હેન્ડઓવર રજિસ્ટર" en="Handover register" hi="हैंडओवर रजिस्टर" /></h1></div><DownloadButton label={<T gu="CSV નિકાસ" en="Export CSV" hi="CSV निर्यात" />} disabled={!rows.length} onClick={() => downloadCsv("handover-register.csv", rows)} /></header>{query.isLoading ? <Skeleton rows={6} /> : query.isError ? <ErrorState error={query.error} onRetry={() => void query.refetch()} /> : !rows.length ? <EmptyState title={<T gu="હેન્ડઓવર નોંધ નથી" en="No handovers recorded" hi="हैंडओवर दर्ज नहीं हैं" />} /> : <div className="overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-lowest"><table className="min-w-full text-left text-sm"><thead className="bg-surface-container-low text-xs uppercase text-on-surface-variant"><tr><th className="px-4 py-3">Serial</th><th className="px-4 py-3">Student</th><th className="px-4 py-3">CTS ID</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Location</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id} className="border-t border-outline-variant/60"><td className="px-4 py-3 font-mono text-xs">{row.serial_no}</td><td className="px-4 py-3">{row.student_name}</td><td className="px-4 py-3 font-mono text-xs">{row.cts_id}</td><td className="px-4 py-3 capitalize">{row.status}</td><td className="px-4 py-3">{row.handed_at ? new Date(row.handed_at).toLocaleString() : "—"}</td><td className="px-4 py-3">{row.lat && row.lng ? `${row.lat}, ${row.lng}` : "—"}</td></tr>)}</tbody></table></div>}</main></OfficerShell>;
}
