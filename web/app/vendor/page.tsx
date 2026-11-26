"use client";

import React, { useState } from "react";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { StatusChip } from "@/components/ui";
import { Skeleton } from "@/components/states/Skeleton";
import { ErrorState } from "@/components/states/ErrorState";
import { EmptyState } from "@/components/states/EmptyState";
import { useAppStore } from "@/lib/store";
import { useVendorBatches, useCreateBatch, useDispatchBatch } from "@/lib/api/hooks";

export default function VendorBatchDispatchPage() {
  const showSuccess = useAppStore((s) => s.showSuccess);
  const showError = useAppStore((s) => s.showError);

  const { data: batches, isLoading, error, refetch } = useVendorBatches();
  const createBatch = useCreateBatch();
  const dispatchBatch = useDispatchBatch();

  const [schoolId, setSchoolId] = useState(1);
  const [qty, setQty] = useState(5);
  const [createdLabels, setCreatedLabels] = useState<{ batchCode: string; serials: string[] } | null>(null);

  if (isLoading) {
    return (
      <OfficerShell role="vendor">
        <div className="p-6">
          <Skeleton rows={5} />
        </div>
      </OfficerShell>
    );
  }

  if (error) {
    return (
      <OfficerShell role="vendor">
        <div className="p-6">
          <ErrorState error={error} onRetry={() => void refetch()} />
        </div>
      </OfficerShell>
    );
  }

  const batchList = Array.isArray(batches) ? batches : [];

  async function handleCreateBatch(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await createBatch.mutateAsync({ schoolId, qty });
      const batchCode = String(res.batch_code ?? res.id);
      const serials = Array.isArray(res.serials) ? res.serials.map(String) : [];
      setCreatedLabels({ batchCode, serials });
      showSuccess(`Created batch ${batchCode} (${qty} cycles)`);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to create batch");
    }
  }

  async function handleDispatch(id: number) {
    try {
      await dispatchBatch.mutateAsync({ id, gps: { lat: 22.5645, lng: 72.9289 } });
      showSuccess(`Batch #${id} dispatched with GPS`);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Dispatch failed");
    }
  }

  return (
    <OfficerShell role="vendor">
      <div className="space-y-6">
        <div>
          <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">
            <T gu="વેન્ડર બેચ અને ડિસ્પેચ" en="Vendor Batch & Dispatch" hi="विक्रेता बैच और डिस्पैच" />
          </h1>
          <p className="text-sm text-on-surface-variant">
            <T
              gu="સાયકલ બેચ બનાવો, QR સીરીયલ જનરેટ કરો અને GPS સાથે રવાના કરો"
              en="Create bicycle batches, generate serials, and dispatch with GPS"
              hi="साइकिल बैच बनाएं, सीरियल जनरेट करें और GPS के साथ भेजें"
            />
          </p>
        </div>

        {/* Create Batch Form */}
        <form onSubmit={handleCreateBatch} className="card p-4 flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">School ID</label>
            <input
              type="number"
              min={1}
              value={schoolId}
              onChange={(e) => setSchoolId(Number(e.target.value))}
              className="px-3 py-2 rounded-xl border border-outline-variant bg-surface text-sm w-32"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Quantity (Cycles)</label>
            <input
              type="number"
              min={1}
              max={100}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="px-3 py-2 rounded-xl border border-outline-variant bg-surface text-sm w-32"
            />
          </div>
          <button
            type="submit"
            disabled={createBatch.isPending}
            className="px-4 py-2 rounded-xl bg-primary text-on-primary text-sm font-semibold flex items-center gap-1.5"
          >
            <Icon name="add_circle" size={18} />
            <T gu="નવી બેચ બનાવો" en="Create Batch" hi="बैच बनाएं" />
          </button>
        </form>

        {createdLabels && (
          <section className="card p-4 space-y-2" aria-live="polite">
            <div>
              <h2 className="text-sm font-bold text-on-surface">
                <T gu="સાયકલ સીરીયલ લેબલ" en="Cycle serial labels" hi="साइकिल सीरियल लेबल" /> · {createdLabels.batchCode}
              </h2>
              <p className="text-xs text-on-surface-variant">
                <T gu="શાળા બેચ સ્વીકારતી વખતે આ સીરીયલ સ્કેન કરશે." en="Use these serials when the school scans the received batch." hi="बैच प्राप्त करते समय स्कूल इन सीरियल को स्कैन करेगा।" />
              </p>
            </div>
            {createdLabels.serials.length > 0 ? (
              <textarea
                readOnly
                value={createdLabels.serials.join("\n")}
                rows={Math.min(6, Math.max(2, createdLabels.serials.length))}
                className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface text-sm font-mono"
                aria-label="Generated cycle serial labels"
              />
            ) : (
              <p className="text-sm text-on-surface-variant">
                <T gu="આ બેચ માટે કોઈ સીરીયલ લેબલ મળ્યા નથી." en="No serial labels were returned for this batch." hi="इस बैच के लिए कोई सीरियल लेबल नहीं मिले।" />
              </p>
            )}
          </section>
        )}

        {/* Batches Table */}
        {batchList.length === 0 ? (
          <EmptyState title="No batches yet" description="Create a new cycle batch above to begin dispatch." />
        ) : (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-x-auto shadow-xs">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low text-xs font-semibold text-on-surface-variant">
                  <th className="p-3">Batch Code</th>
                  <th className="p-3">School ID</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant text-sm">
                {batchList.map((b) => {
                  const id = Number(b.id);
                  const st = String(b.status ?? "ordered");
                  return (
                    <tr key={id} className="hover:bg-surface-container-low/50">
                      <td className="p-3 font-mono text-xs font-semibold text-primary">
                        {String(b.batch_code ?? `BATCH-${id}`)}
                      </td>
                      <td className="p-3">School #{String(b.school_id ?? 1)}</td>
                      <td className="p-3 font-semibold">{String(b.qty ?? 0)}</td>
                      <td className="p-3">
                        <StatusChip
                          status={st === "received" ? "approved" : st === "dispatched" ? "inprogress" : "pending"}
                          label={st}
                        />
                      </td>
                      <td className="p-3 text-right">
                        {st === "ordered" && (
                          <button
                            type="button"
                            onClick={() => handleDispatch(id)}
                            disabled={dispatchBatch.isPending}
                            className="px-3 py-1.5 rounded-lg bg-secondary text-on-secondary text-xs font-semibold inline-flex items-center gap-1"
                          >
                            <Icon name="local_shipping" size={14} />
                            <T gu="ડિસ્પેચ" en="Dispatch" hi="डिस्पैच" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </OfficerShell>
  );
}
