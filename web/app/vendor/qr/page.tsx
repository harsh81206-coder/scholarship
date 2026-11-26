"use client";

import { useEffect, useMemo, useState } from "react";
import { DemoBadge } from "@/components/DemoBadge";
import { T } from "@/components/T";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { Skeleton } from "@/components/states/Skeleton";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { QRCodeView } from "@/components/QRCodeView";
import { useBatchQr, useVendorBatches } from "@/lib/api/hooks";
import styles from "./page.module.css";

type Batch = { id: number; batch_code: string; qty: number; status: string };
type QrItem = { serial_no: string; payload: string; status: string };

export default function Page() {
  const batchesQuery = useVendorBatches();
  const batches = useMemo(() => (batchesQuery.data ?? []) as Batch[], [batchesQuery.data]);
  const [batchId, setBatchId] = useState(0);
  useEffect(() => { if (!batchId && batches[0]) setBatchId(batches[0].id); }, [batchId, batches]);
  const qrQuery = useBatchQr(batchId);
  const items = useMemo(() => (qrQuery.data?.items ?? []) as QrItem[], [qrQuery.data?.items]);
  const sheets = useMemo(() => Array.from({ length: Math.ceil(items.length / 12) }, (_, index) => items.slice(index * 12, index * 12 + 12)), [items]);
  const selected = batches.find((batch) => batch.id === batchId);

  return (
    <OfficerShell role="vendor">
      <div className="mx-auto max-w-6xl space-y-5 p-5">
        <header className="flex flex-wrap items-end justify-between gap-4 print:hidden">
          <div>
            <p className="font-label-sm text-primary"><T gu="વેન્ડર સાધનો" en="VENDOR TOOLS" hi="विक्रेता उपकरण" /></p>
            <h1 className="mt-1 font-headline-md text-headline-md text-on-surface"><T gu="સાયકલ QR લેબલ" en="Cycle QR labels" hi="साइकिल QR लेबल" /></h1>
            <p className="mt-1 text-sm text-on-surface-variant"><T gu="દરેક સીરિયલ નંબર માટે સહી કરેલો QR કોડ." en="Signed QR codes for each cycle serial number." hi="हर साइकिल सीरियल नंबर के लिए हस्ताक्षरित QR कोड।" /></p>
          </div>
          <div className="flex items-center gap-3"><DemoBadge />
            <label className="flex items-center gap-2 text-sm text-on-surface-variant"><T gu="બેચ" en="Batch" hi="बैच" />
              <select value={batchId || ""} onChange={(event) => setBatchId(Number(event.target.value))} className="h-10 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-on-surface">
                {batches.map((batch) => <option value={batch.id} key={batch.id}>{batch.batch_code}</option>)}
              </select>
            </label>
            <button type="button" disabled={!items.length} onClick={() => window.print()} className="btn-primary rounded-lg px-4 py-2 text-sm disabled:opacity-50"><T gu="લેબલ PDF છાપો" en="Print label PDF" hi="लेबल PDF प्रिंट करें" /></button>
          </div>
        </header>

        {batchesQuery.isLoading ? <Skeleton rows={5} /> : batchesQuery.isError ? <ErrorState error={batchesQuery.error} onRetry={() => void batchesQuery.refetch()} /> : !batches.length ? <EmptyState title={<T gu="કોઈ બેચ નથી" en="No batches available" hi="कोई बैच उपलब्ध नहीं" />} description={<T gu="QR લેબલ બનાવવા પહેલાં બેચ બનાવો." en="Create a batch before generating labels." hi="लेबल बनाने से पहले बैच बनाएं।" />} /> : qrQuery.isLoading ? <Skeleton rows={5} /> : qrQuery.isError ? <ErrorState error={qrQuery.error} onRetry={() => void qrQuery.refetch()} /> : !items.length ? <EmptyState title={<T gu="આ બેચમાં સીરિયલ નથી" en="This batch has no serials" hi="इस बैच में सीरियल नहीं हैं" />} /> : (
          <>
            <section className="card flex flex-wrap items-center justify-between gap-3 p-4 print:hidden">
              <div><p className="font-title-sm text-on-surface">{selected?.batch_code}</p><p className="mt-1 text-sm text-on-surface-variant">{items.length} <T gu="સાયકલ લેબલ" en="cycle labels" hi="साइकिल लेबल" /></p></div>
              <p className="text-xs text-on-surface-variant"><T gu="A4 પેજ પર ૧૨ લેબલ" en="12 labels per A4 page" hi="A4 पेज पर 12 लेबल" /></p>
            </section>
            <div className="space-y-6">
              {sheets.map((sheet, sheetIndex) => <section className={styles.sheet} key={`${batchId}-${sheetIndex}`}>
                {sheet.map((item) => <div className={styles.label} key={item.serial_no}><QRCodeView value={item.payload} label={item.serial_no} size={112} /><p className={styles.batchCode}>{selected?.batch_code}</p></div>)}
              </section>)}
            </div>
          </>
        )}
      </div>
    </OfficerShell>
  );
}
