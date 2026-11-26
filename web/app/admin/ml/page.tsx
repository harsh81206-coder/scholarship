"use client";

import { T } from "@/components/T";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { Skeleton } from "@/components/states/Skeleton";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { useAdminMlMetrics } from "@/lib/api/hooks";

type Metrics = { samples?: number; source?: string; auc?: number; accuracy?: number; precision?: number; recall?: number; r2?: number; expected_anomaly_rate?: number };
export default function Page() {
  const query = useAdminMlMetrics(); const data = query.data as { available?: boolean; synthetic_demo_data?: boolean; models?: Record<string, Metrics> } | undefined; const models = Object.entries(data?.models ?? {});
  return <OfficerShell role="admin"><main className="mx-auto max-w-6xl space-y-5 p-5"><header><p className="font-label-sm text-primary">MODEL OPERATIONS</p><h1 className="mt-1 font-headline-md text-on-surface"><T gu="ML મોડેલ મેટ્રિક્સ" en="ML model metrics" hi="ML मॉडल मेट्रिक्स" /></h1><p className="mt-1 text-sm text-on-surface-variant">Read-only report from the backend trained artifacts.</p></header>{query.isLoading ? <Skeleton rows={5} /> : query.isError ? <ErrorState error={query.error} onRetry={() => void query.refetch()} /> : !data?.available || models.length === 0 ? <EmptyState title="No trained metrics available" description="Train the local demo artifacts, then refresh this page." /> : <><p className="rounded-lg bg-tertiary-container p-3 text-sm text-on-tertiary-container">{data.synthetic_demo_data ? "Synthetic demo data. These values are not real-world accuracy claims." : "Metrics from the available artifacts."}</p><div className="grid gap-4 md:grid-cols-3">{models.map(([name, metrics]) => <section className="card space-y-3 p-5" key={name}><h2 className="font-title-sm capitalize text-on-surface">{name} model</h2><p className="text-xs text-on-surface-variant">{metrics.source ?? "Local trained artifact"}</p><dl className="space-y-2 text-sm">{Object.entries(metrics).filter(([key]) => key !== "source").map(([key, value]) => <div key={key} className="flex justify-between gap-3 border-b border-outline-variant/50 pb-2"><dt className="capitalize text-on-surface-variant">{key.replaceAll("_", " ")}</dt><dd className="font-semibold">{typeof value === "number" && value <= 1 ? `${(value * 100).toFixed(1)}%` : value}</dd></div>)}</dl></section>)}</div></>}</main></OfficerShell>;
}
