"use client";

import { useEffect, useMemo, useState } from "react";
import { DemoBadge } from "@/components/DemoBadge";
import { T } from "@/components/T";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { Skeleton } from "@/components/states/Skeleton";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { useBatchTracking, useUpdateBatchGps, useVendorBatches } from "@/lib/api/hooks";

type Batch = { id: number; batch_code: string; qty: number; status: string };
type Point = { lat: number; lng: number; at: string };

export default function Page() {
  const batchesQuery = useVendorBatches();
  const batches = useMemo(() => (batchesQuery.data ?? []) as Batch[], [batchesQuery.data]);
  const [batchId, setBatchId] = useState(0);
  useEffect(() => { if (!batchId && batches[0]) setBatchId(batches[0].id); }, [batchId, batches]);
  const trackQuery = useBatchTracking(batchId);
  const ping = useUpdateBatchGps();
  const data = trackQuery.data as { batch_code?: string; status?: string; qty?: number; received_qty?: number; gps_points?: Point[]; school?: { name_en?: string; name_gu?: string; latitude?: number; longitude?: number } } | undefined;
  const points = data?.gps_points ?? [];
  const latest = points.at(-1);

  async function simulatePing() {
    if (!latest || !batchId) return;
    const direction = points.length % 2 === 0 ? 1 : -1;
    await ping.mutateAsync({ id: batchId, gps: { lat: latest.lat + 0.002 * direction, lng: latest.lng + 0.003 } });
  }

  return (
    <OfficerShell role="vendor">
      <div className="mx-auto max-w-6xl space-y-5 p-5">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-label-sm text-primary"><T gu="ડિસ્પેચ કામગીરી" en="DISPATCH OPERATIONS" hi="डिस्पैच संचालन" /></p>
            <h1 className="mt-1 font-headline-md text-headline-md text-on-surface"><T gu="GPS ટ્રેકિંગ" en="GPS tracking" hi="GPS ट्रैकिंग" /></h1>
            <p className="mt-1 text-sm text-on-surface-variant"><T gu="બેચની સફર અને તાજેતરના સ્થાન બિંદુઓ." en="Batch route and latest recorded location." hi="बैच का मार्ग और हाल में दर्ज स्थान।" /></p>
          </div>
          <div className="flex items-center gap-3"><DemoBadge />
            <label className="flex items-center gap-2 text-sm text-on-surface-variant"><T gu="બેચ" en="Batch" hi="बैच" />
              <select value={batchId || ""} onChange={(event) => setBatchId(Number(event.target.value))} className="h-10 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-on-surface">
                {batches.map((batch) => <option key={batch.id} value={batch.id}>{batch.batch_code}</option>)}
              </select>
            </label>
            <button type="button" onClick={() => void simulatePing()} disabled={!latest || ping.isPending} className="btn-primary rounded-lg px-4 py-2 text-sm disabled:opacity-50"><T gu="GPS પિંગ સિમ્યુલેટ કરો" en="Simulate GPS ping" hi="GPS पिंग सिम्युलेट करें" /></button>
          </div>
        </header>

        {batchesQuery.isLoading ? <Skeleton rows={5} /> : batchesQuery.isError ? <ErrorState error={batchesQuery.error} onRetry={() => void batchesQuery.refetch()} /> : !batches.length ? <EmptyState title={<T gu="ટ્રેક કરવા માટે બેચ નથી" en="No batches to track" hi="ट्रैक करने के लिए बैच नहीं" />} /> : trackQuery.isLoading ? <Skeleton rows={5} /> : trackQuery.isError ? <ErrorState error={trackQuery.error} onRetry={() => void trackQuery.refetch()} /> : (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <section className="card overflow-hidden p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><div><h2 className="font-title-md text-on-surface">{data?.batch_code}</h2><p className="text-sm text-on-surface-variant">{data?.school?.name_en}</p></div><span className="rounded-full bg-success-container px-3 py-1 text-xs font-semibold capitalize text-on-success-container">{data?.status?.replaceAll("_", " ")}</span></div>
              <div className="rounded-xl bg-[#eef5f1] p-3">
                <svg viewBox="0 0 700 360" role="img" aria-label="Offline delivery route map" className="h-[340px] w-full rounded-lg bg-[#e4eee8]">
                  <path d="M35 55 C160 90 115 165 270 160 S390 215 485 155 S575 130 665 275" fill="none" stroke="#c1d3c8" strokeWidth="34" strokeLinecap="round" />
                  <path d="M35 55 C160 90 115 165 270 160 S390 215 485 155 S575 130 665 275" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="8 10" />
                  <text x="35" y="32" className="fill-slate-600 text-[13px]">Karamsad depot</text>
                  <circle cx="35" cy="55" r="12" fill="#176b52" />
                  <circle cx="665" cy="275" r="14" fill="#db6b1d" />
                  <text x="520" y="315" className="fill-slate-700 text-[13px]">{data?.school?.name_en ?? "School"}</text>
                  {points.map((point, index) => <circle key={`${point.at}-${index}`} cx={80 + index * 38} cy={70 + (index % 3) * 25} r={index === points.length - 1 ? 10 : 5} fill={index === points.length - 1 ? "#1676a3" : "#70a9bd"} stroke="#fff" strokeWidth="3" />)}
                  <text x="24" y="340" className="fill-slate-500 text-[12px]">Offline schematic · {points.length} GPS pings</text>
                </svg>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center"><div className="rounded-lg bg-surface-container-low p-3"><p className="text-xs text-on-surface-variant"><T gu="માત્રા" en="Quantity" hi="मात्रा" /></p><p className="mt-1 font-title-sm text-on-surface">{data?.qty ?? 0}</p></div><div className="rounded-lg bg-surface-container-low p-3"><p className="text-xs text-on-surface-variant"><T gu="મળેલ" en="Received" hi="प्राप्त" /></p><p className="mt-1 font-title-sm text-on-surface">{data?.received_qty ?? 0}</p></div><div className="rounded-lg bg-surface-container-low p-3"><p className="text-xs text-on-surface-variant"><T gu="સ્થાન પિંગ" en="GPS pings" hi="GPS पिंग" /></p><p className="mt-1 font-title-sm text-on-surface">{points.length}</p></div></div>
            </section>
            <aside className="card h-fit p-5">
              <h2 className="font-title-sm text-on-surface"><T gu="ડિલિવરી સ્થિતિ" en="Delivery timeline" hi="डिलीवरी समयरेखा" /></h2>
              <ol className="mt-4 space-y-4">
                {[["ordered", "બેચ તૈયાર", "Batch ready"], ["dispatched", "ડિસ્પેચ થયું", "Dispatched"], ["received", "શાળાએ સ્વીકાર્યું", "Received by school"]].map(([key, gu, en]) => {
                  const complete = key === "ordered" || (key === "dispatched" && data?.status !== "ordered") || data?.status === "received";
                  return <li className="flex items-start gap-3" key={key}><span className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-xs ${complete ? "bg-success text-white" : "bg-surface-container-high text-on-surface-variant"}`}>{complete ? "✓" : ""}</span><div><p className={`text-sm font-medium ${complete ? "text-on-surface" : "text-on-surface-variant"}`}><LocalizedLabel gu={gu} en={en} /></p>{key === "dispatched" && data?.gps_points?.length ? <p className="text-xs text-on-surface-variant">{new Date(data.gps_points[0].at).toLocaleString()}</p> : null}</div></li>;
                })}
              </ol>
            </aside>
          </div>
        )}
      </div>
    </OfficerShell>
  );
}

function LocalizedLabel({ gu, en }: { gu: string; en: string }) {
  return <T gu={gu} en={en} hi={en} />;
}
