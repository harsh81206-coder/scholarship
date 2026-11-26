"use client";

import { useMemo, useState } from "react";
import { T } from "@/components/T";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { Skeleton } from "@/components/states/Skeleton";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { useGrievances } from "@/lib/api/hooks";
import { useAppStore } from "@/lib/store";

type Grievance = { grv_code: string; category: string; description: string; status: string; sla_due?: string; created_at?: string };

export default function Page() {
  const query = useGrievances();
  const lang = useAppStore((state) => state.lang);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<string | null>(null);
  const items = useMemo(() => ((query.data?.items ?? []) as Grievance[]).filter((item) => filter === "all" || item.status === filter), [filter, query.data]);
  const active = items.find((item) => item.grv_code === selected) ?? items[0];

  return (
    <OfficerShell role="school">
      <div className="mx-auto max-w-6xl space-y-5 p-5">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-label-sm text-primary"><T gu="વિદ્યાર્થી સહાય" en="STUDENT SUPPORT" hi="छात्र सहायता" /></p>
            <h1 className="mt-1 font-headline-md text-headline-md text-on-surface"><T gu="ફરિયાદ ઇનબોક્સ" en="Grievance inbox" hi="शिकायत इनबॉक्स" /></h1>
            <p className="mt-1 text-sm text-on-surface-variant"><T gu="તમારી શાળાને સોંપાયેલી ફરિયાદો અને સમયમર્યાદા જુઓ." en="Review grievances assigned to your school and their SLA deadlines." hi="अपने स्कूल को सौंपी गई शिकायतें और समय-सीमा देखें।" /></p>
          </div>
          <label className="flex items-center gap-2 text-sm text-on-surface-variant">
            <T gu="સ્થિતિ" en="Status" hi="स्थिति" />
            <select value={filter} onChange={(event) => setFilter(event.target.value)} className="h-10 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-on-surface">
              <option value="all">{lang === "gu" ? "બધી" : lang === "hi" ? "सभी" : "All"}</option>
              <option value="new">{lang === "gu" ? "નવી" : lang === "hi" ? "नई" : "New"}</option>
              <option value="in_progress">{lang === "gu" ? "ચાલુ" : lang === "hi" ? "प्रगति में" : "In progress"}</option>
              <option value="resolved">{lang === "gu" ? "ઉકેલાઈ" : lang === "hi" ? "हल हुई" : "Resolved"}</option>
            </select>
          </label>
        </header>

        {query.isLoading ? <Skeleton rows={6} /> : query.isError ? <ErrorState error={query.error} onRetry={() => void query.refetch()} /> : !items.length ? <EmptyState title={<T gu="કોઈ ફરિયાદ મળી નથી" en="No grievances found" hi="कोई शिकायत नहीं मिली" />} description={<T gu="સ્થિતિ ફિલ્ટર બદલીને જુઓ." en="Try another status filter." hi="दूसरा स्थिति फ़िल्टर चुनें।" />} /> : (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
            <section className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest">
              <div className="divide-y divide-outline-variant/60">
                {items.map((item) => (
                  <button type="button" key={item.grv_code} onClick={() => setSelected(item.grv_code)} className={`block w-full p-4 text-left transition-colors hover:bg-surface-container-low ${active?.grv_code === item.grv_code ? "bg-primary/5" : ""}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-xs font-semibold text-primary">{item.grv_code}</span>
                      <span className="rounded-full bg-surface-container-high px-2.5 py-1 text-xs capitalize text-on-surface-variant">{item.status.replaceAll("_", " ")}</span>
                    </div>
                    <p className="mt-2 font-semibold capitalize text-on-surface">{item.category.replaceAll("_", " ")}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-on-surface-variant">{item.description}</p>
                    <p className="mt-2 text-xs text-on-surface-variant"><T gu="સમયમર્યાદા" en="SLA due" hi="समय-सीमा" />: {item.sla_due ? new Date(item.sla_due).toLocaleString() : "—"}</p>
                  </button>
                ))}
              </div>
            </section>
            <aside className="card h-fit p-5">
              {active ? <>
                <p className="font-label-sm text-primary"><T gu="ફરિયાદની વિગતો" en="GRIEVANCE DETAILS" hi="शिकायत विवरण" /></p>
                <h2 className="mt-2 font-title-md text-on-surface">{active.category.replaceAll("_", " ")}</h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-on-surface-variant">{active.description}</p>
                <div className="mt-4 rounded-lg bg-surface-container-low p-3 text-xs text-on-surface-variant"><span className="font-semibold">{active.grv_code}</span><br /><T gu="સ્થિતિ" en="Status" hi="स्थिति" />: {active.status.replaceAll("_", " ")}</div>
                <p className="mt-4 text-xs text-on-surface-variant"><T gu="સંદેશ અને ઉકેલ માટેની ક્રિયાઓ આગામી સુધારામાં ઉપલબ્ધ થશે." en="Reply and resolution actions are being connected to this inbox." hi="जवाब और समाधान के विकल्प इस इनबॉक्स से जोड़े जा रहे हैं।" /></p>
              </> : null}
            </aside>
          </div>
        )}
      </div>
    </OfficerShell>
  );
}
