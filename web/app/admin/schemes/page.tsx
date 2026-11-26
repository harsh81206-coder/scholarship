"use client";

import Link from "next/link";
import { useState } from "react";
import { T } from "@/components/T";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { Skeleton } from "@/components/states/Skeleton";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { useAdminSchemes, useSetSchemeActive } from "@/lib/api/hooks";
import { useAppStore } from "@/lib/store";
import { downloadJson } from "@/lib/download";

type Scheme = { id: number; code: string; name_en: string; name_gu?: string; version: number; active: boolean; budget?: number };
export default function Page() {
  const query = useAdminSchemes();
  const toggle = useSetSchemeActive();
  const lang = useAppStore((state) => state.lang);
  const showSuccess = useAppStore((state) => state.showSuccess);
  const showError = useAppStore((state) => state.showError);
  const [busy, setBusy] = useState<number | null>(null);
  const schemes = (query.data ?? []) as Scheme[];
  async function setActive(scheme: Scheme) {
    setBusy(scheme.id);
    try { await toggle.mutateAsync({ id: scheme.id, active: !scheme.active }); showSuccess("Scheme status updated"); }
    catch (error) { showError(error instanceof Error ? error.message : "Update failed"); }
    finally { setBusy(null); }
  }
  return <OfficerShell role="admin"><main className="mx-auto max-w-6xl space-y-5 p-5"><header className="flex flex-wrap items-end justify-between gap-3"><div><p className="font-label-sm text-primary">SCHEME CATALOG</p><h1 className="mt-1 font-headline-md text-on-surface"><T gu="યોજનાઓનું સંચાલન" en="Manage schemes" hi="योजना प्रबंधन" /></h1></div><div className="flex gap-2"><button className="btn-secondary rounded-lg px-4 py-2 text-sm" onClick={() => downloadJson("scholarship-schemes.json", schemes)}><T gu="JSON નિકાસ" en="Export JSON" hi="JSON निर्यात" /></button><Link className="btn-primary rounded-lg px-4 py-2 text-sm" href="/admin/schemes/builder"><T gu="નિયમ સંપાદક" en="Rule builder" hi="नियम निर्माता" /></Link></div></header>{query.isLoading ? <Skeleton rows={6} /> : query.isError ? <ErrorState error={query.error} onRetry={() => void query.refetch()} /> : schemes.length === 0 ? <EmptyState title="No schemes returned" description="The scheme catalog is empty." /> : <div className="overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-lowest"><table className="min-w-full text-left text-sm"><thead className="bg-surface-container-low text-xs uppercase text-on-surface-variant"><tr><th className="px-4 py-3">Scheme</th><th className="px-4 py-3">Code</th><th className="px-4 py-3">Version</th><th className="px-4 py-3">Budget</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Action</th></tr></thead><tbody>{schemes.map((scheme) => <tr className="border-t border-outline-variant/60" key={scheme.id ?? scheme.code}><td className="px-4 py-3 font-medium">{lang === "gu" ? scheme.name_gu || scheme.name_en : scheme.name_en}</td><td className="px-4 py-3 font-mono text-xs">{scheme.code}</td><td className="px-4 py-3">v{scheme.version}</td><td className="px-4 py-3">₹{Number(scheme.budget ?? 0).toLocaleString("en-IN")}</td><td className="px-4 py-3">{scheme.active ? "Active" : "Inactive"}</td><td className="px-4 py-3"><button disabled={busy === scheme.id} onClick={() => void setActive(scheme)} className="rounded-lg border border-outline-variant px-3 py-1.5 text-xs font-semibold">{scheme.active ? "Deactivate" : "Activate"}</button></td></tr>)}</tbody></table></div>}</main></OfficerShell>;
}
