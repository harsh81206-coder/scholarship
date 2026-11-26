"use client";

import { useParams } from "next/navigation";
import { T } from "@/components/T";
import { ErrorState } from "@/components/states/ErrorState";
import { Skeleton } from "@/components/states/Skeleton";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { useSchoolStudent } from "@/lib/api/hooks";

type Student360 = { cts_id: string; name_en: string; name_gu: string; grade: number; risk_level: string; risk_score: number; distance_km: number; attendance: Array<Record<string, unknown>>; applications: Array<Record<string, unknown>>; cycles: Array<Record<string, unknown>>; grievances: Array<Record<string, unknown>>; bank: Array<Record<string, unknown>> };

export default function Page() {
  const params = useParams<{ id: string }>();
  const query = useSchoolStudent(decodeURIComponent(params.id ?? ""));
  const data = query.data as Student360 | undefined;
  return <OfficerShell role="school"><main className="mx-auto max-w-6xl space-y-5 p-5"><header><p className="font-label-sm text-primary"><T gu="વિદ્યાર્થી ૩૬૦°" en="STUDENT 360°" hi="छात्र 360°" /></p>{query.isLoading ? <Skeleton rows={1} /> : query.isError ? <ErrorState error={query.error} onRetry={() => void query.refetch()} /> : data ? <><h1 className="mt-1 font-headline-md text-on-surface">{data.name_en}</h1><p className="mt-1 font-mono text-sm text-on-surface-variant">{data.cts_id} · Grade {data.grade} · {data.risk_level} risk</p></> : null}</header>{data && <><section className="grid gap-3 sm:grid-cols-3"><Kpi label="Attendance records" value={data.attendance.length} /><Kpi label="Applications" value={data.applications.length} /><Kpi label="Cycle handovers" value={data.cycles.length} /></section><section className="grid gap-4 lg:grid-cols-2"><Panel title="Attendance & marks">{data.attendance.map((row, index) => <Row key={index} text={`${String(row.month)} · ${String(row.attendance_pct)}% attendance · ${String(row.marks_pct)}% marks`} />)}</Panel><Panel title="Applications">{data.applications.map((row) => <Row key={String(row.app_code)} text={`${String(row.app_code)} · ${String(row.status)} · ₹${String(row.amount)}`} />)}</Panel><Panel title="Cycles">{data.cycles.map((row) => <Row key={String(row.serial_no)} text={`${String(row.serial_no)} · ${String(row.status)}`} />)}</Panel><Panel title="Grievances">{data.grievances.map((row) => <Row key={String(row.grv_code)} text={`${String(row.grv_code)} · ${String(row.category)} · ${String(row.status)}`} />)}</Panel><Panel title="Bank status">{data.bank.map((row, index) => <Row key={index} text={`${String(row.holder_type)} · •••• ${String(row.last4)} · ${row.verified ? "verified" : "pending"}`} />)}</Panel></section></>}</main></OfficerShell>;
}
function Kpi({ label, value }: { label: string; value: number }) { return <article className="card p-4"><p className="text-xs text-on-surface-variant">{label}</p><p className="mt-1 font-title-md text-on-surface">{value}</p></article>; }
function Panel({ title, children }: { title: string; children: React.ReactNode }) { return <section className="card p-4"><h2 className="font-title-sm text-on-surface">{title}</h2><div className="mt-3 divide-y divide-outline-variant/50">{children}</div></section>; }
function Row({ text }: { text: string }) { return <p className="py-2 text-sm text-on-surface-variant">{text}</p>; }
