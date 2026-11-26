"use client";

import { DownloadButton } from "@/components/DownloadButton";
import { T } from "@/components/T";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { Skeleton } from "@/components/states/Skeleton";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { useStateRanking } from "@/lib/api/hooks";
import { downloadCsv } from "@/lib/download";

type Ranking = { rank: number; name_en: string; name_gu?: string; udise_code: string; taluka_name: string; score: number; credited_count: number; application_count: number; student_count: number };

export default function Page() {
  const query = useStateRanking();
  const rows = (query.data?.items ?? []) as Ranking[];
  return (
    <OfficerShell role="admin">
      <div className="mx-auto max-w-6xl space-y-5 p-5">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-label-sm text-primary"><T gu="રાજ્ય દેખરેખ" en="STATE OVERSIGHT" hi="राज्य निगरानी" /></p>
            <h1 className="mt-1 font-headline-md text-headline-md text-on-surface"><T gu="શાળા રેન્કિંગ" en="School ranking" hi="स्कूल रैंकिंग" /></h1>
            <p className="mt-1 text-sm text-on-surface-variant"><T gu="જમા થયેલી અરજીઓના પ્રમાણ પ્રમાણે ક્રમ." en="Ranked by the share of applications reaching credited status." hi="भुगतान तक पहुंचने वाले आवेदनों के अनुपात के आधार पर क्रम।" /></p>
          </div>
          <DownloadButton label={<T gu="CSV નિકાસ" en="Export CSV" hi="CSV निर्यात" />} disabled={!rows.length} onClick={() => downloadCsv("school-ranking.csv", rows)} />
        </header>
        {query.isLoading ? <Skeleton rows={8} /> : query.isError ? <ErrorState error={query.error} onRetry={() => void query.refetch()} /> : !rows.length ? <EmptyState title={<T gu="રેન્કિંગ માટે ડેટા નથી" en="No ranking data" hi="रैंकिंग डेटा उपलब्ध नहीं" />} description={<T gu="અરજીઓનો ડેટા ઉપલબ્ધ થયા પછી રેન્કિંગ દેખાશે." en="Rankings will appear when application data is available." hi="आवेदन डेटा उपलब्ध होने पर रैंकिंग दिखाई जाएगी।" />} /> : (
          <section className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest">
            <div className="overflow-x-auto"><table className="min-w-full text-left text-sm">
              <thead className="bg-surface-container-low text-xs uppercase text-on-surface-variant"><tr><th className="px-4 py-3">#</th><th className="px-4 py-3"><T gu="શાળા" en="School" hi="स्कूल" /></th><th className="px-4 py-3"><T gu="તાલુકો" en="Taluka" hi="तालुका" /></th><th className="px-4 py-3"><T gu="સ્કોર" en="Score" hi="स्कोर" /></th><th className="px-4 py-3"><T gu="જમા / કુલ" en="Credited / total" hi="भुगतान / कुल" /></th><th className="px-4 py-3"><T gu="વિદ્યાર્થીઓ" en="Students" hi="छात्र" /></th></tr></thead>
              <tbody>{rows.map((row) => <tr className="border-t border-outline-variant/60" key={row.udise_code}><td className="px-4 py-3 font-semibold text-primary">{row.rank}</td><td className="px-4 py-3"><p className="font-semibold text-on-surface">{row.name_en}</p><p className="font-mono text-xs text-on-surface-variant">{row.udise_code}</p></td><td className="px-4 py-3">{row.taluka_name}</td><td className="px-4 py-3">{row.score}%</td><td className="px-4 py-3">{row.credited_count} / {row.application_count}</td><td className="px-4 py-3">{row.student_count}</td></tr>)}</tbody>
            </table></div>
            <p className="border-t border-outline-variant bg-surface-container-low px-4 py-3 text-xs text-on-surface-variant"><T gu="રેન્કિંગનું માપ" en="Ranking metric" hi="रैंकिंग का माप" />: {query.data?.metric}</p>
          </section>
        )}
      </div>
    </OfficerShell>
  );
}
