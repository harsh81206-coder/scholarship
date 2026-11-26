"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DownloadButton } from "@/components/DownloadButton";
import { T } from "@/components/T";
import { ErrorState } from "@/components/states/ErrorState";
import { Skeleton } from "@/components/states/Skeleton";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { useApplications } from "@/lib/api/hooks";
import { downloadCsv } from "@/lib/download";

type Application = { app_code: string; status: string; amount: number; scheme_name_en?: string; student?: { name_en?: string; cts_id?: string }; route?: string; risk_level?: string };

export default function Page() {
  const query = useApplications();
  const [filter, setFilter] = useState("");
  const rows = useMemo(() => ((query.data?.items ?? []) as Application[]).filter((row) => !filter || row.status === filter), [filter, query.data]);
  return <OfficerShell role="deo"><main className="mx-auto max-w-6xl space-y-5 p-5"><header className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-label-sm text-primary"><T gu="જિલ્લા અરજી કાર્ય" en="DISTRICT APPLICATIONS" hi="जिला आवेदन" /></p><h1 className="mt-1 font-headline-md text-on-surface"><T gu="તમામ અરજીઓ" en="All applications" hi="सभी आवेदन" /></h1><p className="mt-1 text-sm text-on-surface-variant"><T gu="તમારા જિલ્લા માટે મંજૂરી સ્થિતિ પ્રમાણે શોધો." en="Review applications in your district by approval status." hi="अपने जिले के आवेदनों को मंजूरी स्थिति के अनुसार देखें।" /></p></div><DownloadButton label={<T gu="CSV નિકાસ" en="Export CSV" hi="CSV निर्यात" />} disabled={!rows.length} onClick={() => downloadCsv("district-applications.csv", rows)} /></header><div className="flex gap-2"><label className="text-sm text-on-surface-variant"><T gu="સ્થિતિ" en="Status" hi="स्थिति" /><select className="ml-2 h-10 rounded-lg border border-outline-variant bg-surface-container-lowest px-3" value={filter} onChange={(event) => setFilter(event.target.value)}><option value="">All</option>{["applied", "school_verified", "taluka_approved", "deo_approved", "sanctioned", "dbt_initiated", "credited", "rejected"].map((status) => <option key={status}>{status}</option>)}</select></label></div>{query.isLoading ? <Skeleton rows={8} /> : query.isError ? <ErrorState error={query.error} onRetry={() => void query.refetch()} /> : <div className="overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-lowest"><table className="min-w-full text-left text-sm"><thead className="bg-surface-container-low text-xs uppercase text-on-surface-variant"><tr><th className="px-4 py-3">Application</th><th className="px-4 py-3">Student</th><th className="px-4 py-3">Scheme</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Route / risk</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">View</th></tr></thead><tbody>{rows.map((row) => <tr className="border-t border-outline-variant/60" key={row.app_code}><td className="px-4 py-3 font-mono text-xs">{row.app_code}</td><td className="px-4 py-3">{row.student?.name_en ?? "—"}<div className="font-mono text-[10px] text-on-surface-variant">{row.student?.cts_id}</div></td><td className="px-4 py-3">{row.scheme_name_en ?? "—"}</td><td className="px-4 py-3">₹{Number(row.amount).toLocaleString("en-IN")}</td><td className="px-4 py-3">{row.route ?? "—"} / {row.risk_level ?? "—"}</td><td className="px-4 py-3 capitalize">{row.status?.replaceAll("_", " ")}</td><td className="px-4 py-3"><Link className="font-semibold text-primary" href={`/deo/approvals?code=${encodeURIComponent(row.app_code)}`}>Open →</Link></td></tr>)}</tbody></table><p className="px-4 py-3 text-xs text-on-surface-variant">{query.data?.total ?? 0} district applications</p></div>}</main></OfficerShell>;
}
