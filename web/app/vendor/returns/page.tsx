"use client";

import { useState } from "react";
import { T } from "@/components/T";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { Skeleton } from "@/components/states/Skeleton";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { useCreateVendorReturn, useVendorReturns } from "@/lib/api/hooks";
import { useAppStore } from "@/lib/store";

type ReturnItem = { id: number; serial_no: string; reason: string; status: string; replacement_batch?: number };
export default function Page() {
  const query = useVendorReturns(); const create = useCreateVendorReturn(); const [serial, setSerial] = useState(""); const [reason, setReason] = useState(""); const showSuccess = useAppStore((s) => s.showSuccess); const showError = useAppStore((s) => s.showError); const rows = (query.data?.items ?? []) as ReturnItem[];
  async function submit(event: React.FormEvent) { event.preventDefault(); try { await create.mutateAsync({ cycle_serial: serial.trim(), reason: reason.trim() }); setSerial(""); setReason(""); showSuccess("Defect report submitted"); } catch (error) { showError(error instanceof Error ? error.message : "Could not submit defect"); } }
  return <OfficerShell role="vendor"><main className="mx-auto max-w-5xl space-y-5 p-5"><header><p className="font-label-sm text-primary">QUALITY & RETURNS</p><h1 className="mt-1 font-headline-md text-on-surface"><T gu="ક્ષતિગ્રસ્ત સાયકલ રિટર્ન" en="Cycle defects and returns" hi="साइकिल दोष और वापसी" /></h1></header><form onSubmit={(event) => void submit(event)} className="card grid gap-3 p-4 sm:grid-cols-[1fr_2fr_auto]"><label className="text-sm">Cycle serial<input required value={serial} onChange={(event) => setSerial(event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-outline-variant px-3" placeholder="VPS-CYCLE-…" /></label><label className="text-sm">Issue description<input required maxLength={500} value={reason} onChange={(event) => setReason(event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-outline-variant px-3" placeholder="Describe the defect" /></label><button disabled={create.isPending} className="btn-primary self-end rounded-lg px-4 py-2 text-sm">Report defect</button></form>{query.isLoading ? <Skeleton rows={5} /> : query.isError ? <ErrorState error={query.error} onRetry={() => void query.refetch()} /> : rows.length === 0 ? <EmptyState title="No defects reported" description="Submitted return and replacement requests will appear here." /> : <section className="space-y-3">{rows.map((row) => <article className="card flex flex-wrap items-start justify-between gap-3 p-4" key={row.id}><div><p className="font-mono text-xs text-primary">{row.serial_no}</p><p className="mt-1 font-medium">{row.reason}</p></div><div className="text-right"><p className="capitalize">{row.status.replaceAll("_", " ")}</p><p className="text-xs text-on-surface-variant">{row.replacement_batch ? `Replacement batch #${row.replacement_batch}` : "Replacement not assigned"}</p></div></article>)}</section>}</main></OfficerShell>;
}
