"use client";

import { useState } from "react";
import { DownloadButton } from "@/components/DownloadButton";
import { T } from "@/components/T";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { Skeleton } from "@/components/states/Skeleton";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { useSchoolReports } from "@/lib/api/hooks";
import { downloadCsv } from "@/lib/download";
import { useAppStore } from "@/lib/store";

const REPORTS = [
  ["scheme-wise-applications", "યોજના પ્રમાણે અરજીઓ", "Scheme-wise applications", "योजना अनुसार आवेदन"],
  ["pending-verification", "ચકાસણી બાકી", "Pending verification", "सत्यापन लंबित"],
  ["attendance-defaulters", "ઓછી હાજરી", "Attendance defaulters", "कम उपस्थिति"],
  ["cycle-distribution", "સાયકલ વિતરણ", "Cycle distribution", "साइकिल वितरण"],
  ["funds-received", "મળેલ સહાય", "Funds received", "प्राप्त राशि"],
] as const;

type Report = { type?: string; total?: number; status_counts?: Record<string, number>; items?: Array<Record<string, unknown>> };

export default function Page() {
  const [type, setType] = useState<string>(REPORTS[0][0]);
  const lang = useAppStore((state) => state.lang);
  const query = useSchoolReports(type);
  const report = query.data as Report | undefined;
  const items = report?.items ?? [];

  return (
    <OfficerShell role="school">
      <div className="mx-auto max-w-6xl space-y-5 p-5">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-label-sm text-primary"><T gu="શાળા અહેવાલ" en="SCHOOL REPORTS" hi="स्कूल रिपोर्ट" /></p>
            <h1 className="mt-1 font-headline-md text-headline-md text-on-surface"><T gu="અહેવાલ અને વિશ્લેષણ" en="Reports & analysis" hi="रिपोर्ट और विश्लेषण" /></h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="sr-only" htmlFor="report-type"><T gu="અહેવાલ પસંદ કરો" en="Choose report" hi="रिपोर्ट चुनें" /></label>
            <select id="report-type" value={type} onChange={(event) => setType(event.target.value)} className="h-10 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-sm text-on-surface">
              {REPORTS.map(([id, gu, en, hi]) => <option key={id} value={id}>{lang === "gu" ? gu : lang === "hi" ? hi : en}</option>)}
            </select>
            <DownloadButton label={<T gu="CSV નિકાસ" en="Export CSV" hi="CSV निर्यात" />} disabled={!items.length} onClick={() => downloadCsv(`school-${type}.csv`, items)} />
          </div>
        </header>

        {query.isLoading ? <Skeleton rows={6} /> : query.isError ? <ErrorState error={query.error} onRetry={() => void query.refetch()} /> : (
          <>
            <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="card p-4"><p className="text-xs text-on-surface-variant"><T gu="રેકોર્ડ" en="Rows" hi="पंक्तियां" /></p><p className="mt-1 font-headline-sm text-on-surface">{report?.total ?? 0}</p></div>
              {Object.entries(report?.status_counts ?? {}).slice(0, 3).map(([status, count]) => (
                <div className="card p-4" key={status}><p className="truncate text-xs capitalize text-on-surface-variant">{status.replaceAll("_", " ")}</p><p className="mt-1 font-headline-sm text-on-surface">{count}</p></div>
              ))}
            </section>
            {!items.length ? <EmptyState title={<T gu="આ અહેવાલમાં કોઈ રેકોર્ડ નથી" en="No rows in this report" hi="इस रिपोर्ट में कोई पंक्ति नहीं है" />} description={<T gu="બીજો અહેવાલ પસંદ કરો." en="Try a different report type." hi="दूसरी रिपोर्ट चुनें।" />} /> : (
              <section className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest">
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse text-left text-sm">
                    <thead className="bg-surface-container-low text-xs uppercase text-on-surface-variant">
                      <tr>{Object.keys(items[0]).map((key) => <th className="whitespace-nowrap px-4 py-3 font-semibold" key={key}>{key.replaceAll("_", " ")}</th>)}</tr>
                    </thead>
                    <tbody>{items.slice(0, 100).map((row, index) => (
                      <tr key={String(row.app_code ?? row.batch_code ?? row.txn_id ?? index)} className="border-t border-outline-variant/60">
                        {Object.keys(items[0]).map((key) => <td className="whitespace-nowrap px-4 py-3 text-on-surface" key={key}>{String(row[key] ?? "—")}</td>)}
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
                <p className="border-t border-outline-variant bg-surface-container-low px-4 py-3 text-xs text-on-surface-variant"><T gu="પ્રથમ ૧૦૦ રેકોર્ડ બતાવ્યા છે." en="Showing up to 100 rows." hi="अधिकतम 100 पंक्तियां दिखाई गई हैं।" /></p>
              </section>
            )}
          </>
        )}
      </div>
    </OfficerShell>
  );
}
