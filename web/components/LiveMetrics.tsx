"use client";

import { ErrorState } from "@/components/states/ErrorState";
import { Skeleton } from "@/components/states/Skeleton";

type Props = { title: string; data?: Record<string, unknown>; loading: boolean; error?: Error | null; onRetry: () => void };
export function LiveMetrics({ title, data, loading, error, onRetry }: Props) {
  const entries = Object.entries(data ?? {}).filter(([, value]) => ["string", "number", "boolean"].includes(typeof value));
  return <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4" aria-live="polite">
    <h2 className="font-title-sm text-on-surface">{title}</h2>
    {loading ? <div className="mt-3"><Skeleton rows={1} /></div> : error ? <div className="mt-3"><ErrorState error={error} onRetry={onRetry} /></div> : <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">{entries.map(([key, value]) => <div className="min-w-0 rounded-lg bg-surface-container-low p-3" key={key}><dt className="truncate text-xs capitalize text-on-surface-variant">{key.replaceAll("_", " ")}</dt><dd className="mt-1 truncate font-title-sm text-on-surface">{typeof value === "number" ? value.toLocaleString("en-IN") : String(value)}</dd></div>)}</dl>}
  </section>;
}
