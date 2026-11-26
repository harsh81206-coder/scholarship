"use client";

import Link from "next/link";
import { useState } from "react";
import { DownloadButton } from "@/components/DownloadButton";
import { T } from "@/components/T";
import { ErrorState } from "@/components/states/ErrorState";
import { Skeleton } from "@/components/states/Skeleton";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { useSchoolStudents } from "@/lib/api/hooks";
import { downloadCsv } from "@/lib/download";

type Student = { cts_id: string; name_en: string; name_gu: string; grade: number; gender: string; risk_level: string; risk_score: number; attendance_pct: number };

export default function Page() {
  const [search, setSearch] = useState("");
  const [risk, setRisk] = useState("");
  const query = useSchoolStudents({ q: search, risk: risk || undefined });
  const rows = (query.data?.items ?? []) as Student[];
  return <OfficerShell role="school"><main className="mx-auto max-w-6xl space-y-5 p-5"><header className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-label-sm text-primary"><T gu="વિદ્યાર્થી સેવા" en="STUDENT SERVICES" hi="छात्र सेवाएं" /></p><h1 className="mt-1 font-headline-md text-on-surface"><T gu="વિદ્યાર્થી યાદી" en="Student directory" hi="छात्र सूची" /></h1><p className="mt-1 text-sm text-on-surface-variant"><T gu="શોધો, જોખમ જુઓ અને વિદ્યાર્થીની સંપૂર્ણ પ્રોફાઇલ ખોલો." en="Search students, review risk, and open a student profile." hi="छात्र खोजें, जोखिम देखें और उनकी पूरी प्रोफ़ाइल खोलें।" /></p></div><DownloadButton label={<T gu="CSV નિકાસ" en="Export CSV" hi="CSV निर्यात" />} disabled={!rows.length} onClick={() => downloadCsv("school-students.csv", rows)} /></header><div className="flex flex-wrap gap-2"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="CTS ID or student name" aria-label="Search students" className="h-10 min-w-64 rounded-lg border border-outline-variant bg-surface-container-lowest px-3" /><select value={risk} onChange={(event) => setRisk(event.target.value)} aria-label="Risk filter" className="h-10 rounded-lg border border-outline-variant bg-surface-container-lowest px-3"><option value="">All risk levels</option><option value="high">High risk</option><option value="medium">Medium risk</option><option value="low">Low risk</option></select></div>{query.isLoading ? <Skeleton rows={8} /> : query.isError ? <ErrorState error={query.error} onRetry={() => void query.refetch()} /> : <div className="overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-lowest"><table className="min-w-full text-left text-sm"><thead className="bg-surface-container-low text-xs uppercase text-on-surface-variant"><tr><th className="px-4 py-3">CTS ID</th><th className="px-4 py-3">Student</th><th className="px-4 py-3">Grade</th><th className="px-4 py-3">Attendance</th><th className="px-4 py-3">Risk</th><th className="px-4 py-3">Open</th></tr></thead><tbody>{rows.map((student) => <tr key={student.cts_id} className="border-t border-outline-variant/60"><td className="px-4 py-3 font-mono text-xs">{student.cts_id}</td><td className="px-4 py-3"><p className="font-semibold text-on-surface">{student.name_en}</p><p className="text-xs text-on-surface-variant">{student.name_gu}</p></td><td className="px-4 py-3">{student.grade}</td><td className="px-4 py-3">{student.attendance_pct}%</td><td className="px-4 py-3"><span className="rounded-full bg-warning-container px-2 py-1 text-xs capitalize">{student.risk_level} · {Math.round(student.risk_score * 100)}%</span></td><td className="px-4 py-3"><Link className="font-semibold text-primary" href={`/school/students/${encodeURIComponent(student.cts_id)}`}>View →</Link></td></tr>)}</tbody></table><p className="border-t border-outline-variant px-4 py-3 text-xs text-on-surface-variant">{query.data?.total ?? 0} students</p></div>}</main></OfficerShell>;
}
