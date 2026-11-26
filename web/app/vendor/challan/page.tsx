"use client";

import { useEffect, useMemo, useState } from "react";
import { DemoBadge } from "@/components/DemoBadge";
import { QRCodeView } from "@/components/QRCodeView";
import { T } from "@/components/T";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { Skeleton } from "@/components/states/Skeleton";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { useBatchTracking, useVendorBatches } from "@/lib/api/hooks";

type Batch = { id: number; batch_code: string; qty: number; received_qty: number; status: string };

export default function Page() {
  const batchesQuery = useVendorBatches();
  const batches = useMemo(() => (batchesQuery.data ?? []) as Batch[], [batchesQuery.data]);
  const [batchId, setBatchId] = useState(0);
  useEffect(() => { if (!batchId && batches[0]) setBatchId(batches[0].id); }, [batchId, batches]);
  const trackQuery = useBatchTracking(batchId);
  const batch = batches.find((item) => item.id === batchId);
  const track = trackQuery.data as { school?: { name_en?: string; name_gu?: string; latitude?: number; longitude?: number }; dispatched_at?: string } | undefined;

  return (
    <OfficerShell role="vendor">
      <div className="mx-auto max-w-4xl space-y-5 p-5">
        <header className="flex flex-wrap items-end justify-between gap-4 print:hidden">
          <div>
            <p className="font-label-sm text-primary"><T gu="વેન્ડર દસ્તાવેજો" en="VENDOR DOCUMENTS" hi="विक्रेता दस्तावेज़" /></p>
            <h1 className="mt-1 font-headline-md text-headline-md text-on-surface"><T gu="ડિલિવરી ચલણ" en="Delivery challan" hi="डिलीवरी चालान" /></h1>
            <p className="mt-1 text-sm text-on-surface-variant"><T gu="શાળામાં મોકલાયેલા સાયકલ બેચની નોંધ." en="Dispatch record for a cycle batch sent to a school." hi="स्कूल भेजे गए साइकिल बैच का डिस्पैच रिकॉर्ड।" /></p>
          </div>
          <div className="flex items-center gap-3"><DemoBadge />
            <label className="flex items-center gap-2 text-sm text-on-surface-variant"><T gu="બેચ" en="Batch" hi="बैच" />
              <select value={batchId || ""} onChange={(event) => setBatchId(Number(event.target.value))} className="h-10 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-on-surface">
                {batches.map((item) => <option value={item.id} key={item.id}>{item.batch_code}</option>)}
              </select>
            </label>
            <button type="button" onClick={() => window.print()} disabled={!batch} className="btn-primary rounded-lg px-4 py-2 text-sm disabled:opacity-50"><T gu="PDF તરીકે સાચવો" en="Print / save PDF" hi="PDF प्रिंट / सेव करें" /></button>
          </div>
        </header>

        {batchesQuery.isLoading ? <Skeleton rows={5} /> : batchesQuery.isError ? <ErrorState error={batchesQuery.error} onRetry={() => void batchesQuery.refetch()} /> : !batches.length ? <EmptyState title={<T gu="ચલણ માટે બેચ નથી" en="No batches available" hi="चालान के लिए बैच नहीं" />} /> : trackQuery.isLoading ? <Skeleton rows={4} /> : trackQuery.isError ? <ErrorState error={trackQuery.error} onRetry={() => void trackQuery.refetch()} /> : (
          <article className="rounded-xl border-2 border-on-surface bg-white p-6 text-slate-900 shadow-sm print:mx-auto print:max-w-none print:border print:shadow-none">
            <div className="flex flex-wrap items-start justify-between gap-5 border-b-2 border-slate-800 pb-5">
              <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary"><T gu="ગુજરાત રાજ્ય શિષ્યવૃત્તિ પોર્ટલ" en="Gujarat Scholarship Platform" hi="गुजरात छात्रवृत्ति पोर्टल" /></p><h2 className="mt-2 text-2xl font-bold"><T gu="ડિલિવરી ચલણ" en="Delivery challan" hi="डिलीवरी चालान" /></h2><p className="mt-1 text-sm text-slate-600"><T gu="સરસ્વતી સાધના સાયકલ સહાય" en="Saraswati Sadhana Cycle Support" hi="सरस्वती साधना साइकिल सहायता" /></p></div>
              {batch ? <QRCodeView value={batch.batch_code} label={batch.batch_code} size={100} /> : null}
            </div>
            <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              <Field label={<T gu="ચલણ નંબર" en="Challan number" hi="चालान संख्या" />} value={`CH-${batch?.batch_code ?? "—"}`} />
              <Field label={<T gu="બેચ કોડ" en="Batch code" hi="बैच कोड" />} value={batch?.batch_code ?? "—"} />
              <Field label={<T gu="વેન્ડર" en="Vendor" hi="विक्रेता" />} value="VND-001" />
              <Field label={<T gu="શાળા" en="School" hi="स्कूल" />} value={track?.school?.name_en ?? "—"} />
              <Field label={<T gu="કુલ સાયકલ" en="Cycle quantity" hi="साइकिल मात्रा" />} value={String(batch?.qty ?? 0)} />
              <Field label={<T gu="શાળાએ સ્વીકારેલ" en="Received by school" hi="स्कूल द्वारा प्राप्त" />} value={`${batch?.received_qty ?? 0} / ${batch?.qty ?? 0}`} />
              <Field label={<T gu="સ્થિતિ" en="Status" hi="स्थिति" />} value={batch?.status === "received" ? <T gu="સ્વીકારાયું" en="Acknowledged" hi="प्राप्त" /> : batch?.status ?? "—"} />
              <Field label={<T gu="ડિસ્પેચ તારીખ" en="Dispatch date" hi="डिस्पैच तारीख" />} value={track?.dispatched_at ? new Date(track.dispatched_at).toLocaleDateString() : "—"} />
            </div>
            <div className="mt-10 grid grid-cols-2 gap-10 border-t border-slate-300 pt-6 text-center text-sm text-slate-600"><div className="border-t border-slate-400 pt-2"><T gu="વેન્ડરની સહી" en="Vendor signature" hi="विक्रेता हस्ताक्षर" /></div><div className="border-t border-slate-400 pt-2"><T gu="શાળા સ્વીકાર સહી" en="School acknowledgement" hi="स्कूल प्राप्ति हस्ताक्षर" /></div></div>
            <div className="mt-6 text-center text-[10px] text-slate-500"><T gu="આ ચલણ ડેમો સિસ્ટમ દ્વારા બનાવવામાં આવ્યું છે." en="This challan was generated by the demo system." hi="यह चालान डेमो प्रणाली द्वारा बनाया गया है।" /></div>
          </article>
        )}
      </div>
    </OfficerShell>
  );
}

function Field({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return <div className="border-b border-slate-200 pb-2"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 font-semibold text-slate-900">{value}</p></div>;
}
