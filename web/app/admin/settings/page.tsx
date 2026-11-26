"use client";

import { useEffect, useState } from "react";
import { T } from "@/components/T";
import { ErrorState } from "@/components/states/ErrorState";
import { Skeleton } from "@/components/states/Skeleton";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { useAdminSettings, useUpdateAdminSettings } from "@/lib/api/hooks";
import { useAppStore } from "@/lib/store";

const defaults = { RISK_AUTO_THRESHOLD: 0.3, RISK_TALUKA_THRESHOLD: 0.6, AMOUNT_LIMIT_TALUKA: 10000, OTP_TTL_SECONDS: 300, DBT_BATCH_SIZE: 100 };
export default function Page() {
  const query = useAdminSettings(); const update = useUpdateAdminSettings(); const [values, setValues] = useState<Record<string, number>>(defaults); const showSuccess = useAppStore((s) => s.showSuccess); const showError = useAppStore((s) => s.showError);
  useEffect(() => { if (query.data) setValues({ ...defaults, ...Object.fromEntries(Object.entries(query.data).map(([key, value]) => [key, Number(value)]).filter(([, value]) => Number.isFinite(value))) }); }, [query.data]);
  async function save(event: React.FormEvent) { event.preventDefault(); try { await update.mutateAsync(values); showSuccess("Settings saved"); } catch (error) { showError(error instanceof Error ? error.message : "Could not save settings"); } }
  return <OfficerShell role="admin"><main className="mx-auto max-w-4xl space-y-5 p-5"><header><p className="font-label-sm text-primary">SYSTEM POLICY</p><h1 className="mt-1 font-headline-md text-on-surface"><T gu="સિસ્ટમ સેટિંગ્સ" en="System settings" hi="सिस्टम सेटिंग्स" /></h1></header>{query.isLoading ? <Skeleton rows={4} /> : query.isError ? <ErrorState error={query.error} onRetry={() => void query.refetch()} /> : <form onSubmit={(event) => void save(event)} className="card grid gap-4 p-5 sm:grid-cols-2">{Object.entries(values).map(([key, value]) => <label className="text-sm font-medium" key={key}>{key.replaceAll("_", " ")}<input className="mt-1 h-10 w-full rounded-lg border border-outline-variant px-3" type="number" step={key.includes("THRESHOLD") ? "0.01" : "1"} value={value} onChange={(event) => setValues((old) => ({ ...old, [key]: Number(event.target.value) }))} /></label>)}<p className="text-xs text-on-surface-variant sm:col-span-2">Risk thresholds drive routing: low score goes to automatic checks, middle range to taluka, and higher scores to DEO review.</p><button disabled={update.isPending} className="btn-primary rounded-lg px-4 py-2 text-sm sm:col-span-2"><T gu="સેટિંગ્સ સાચવો" en="Save settings" hi="सेटिंग्स सहेजें" /></button></form>}</main></OfficerShell>;
}
