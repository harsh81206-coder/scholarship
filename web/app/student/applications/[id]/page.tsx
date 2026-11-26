"use client";

import { useParams } from "next/navigation";
import { DownloadButton } from "@/components/DownloadButton";
import { T } from "@/components/T";
import { ErrorState } from "@/components/states/ErrorState";
import { Skeleton } from "@/components/states/Skeleton";
import { StudentShell } from "@/components/shell/StudentShell";
import { useApplication, useApplicationTimeline } from "@/lib/api/hooks";
import { downloadApiFile } from "@/lib/api/client";

type AppDetail = { app_code: string; status: string; amount: number; scheme?: { name_en?: string } | string; student?: { name_en?: string }; timeline?: Array<Record<string, unknown>> };

export default function Page() {
  const params = useParams<{ id: string }>();
  const code = decodeURIComponent(params.id ?? "");
  const query = useApplication(code);
  const timeline = useApplicationTimeline(code);
  const data = query.data as AppDetail | undefined;
  return <StudentShell><main className="mx-auto max-w-3xl space-y-5 px-4 py-5"><header><p className="font-label-sm text-primary"><T gu="અરજી ટ્રૅકર" en="APPLICATION TRACKER" hi="आवेदन ट्रैकर" /></p><h1 className="mt-1 font-headline-md text-on-surface"><T gu="અરજીની સંપૂર્ણ વિગતો" en="Application details" hi="आवेदन विवरण" /></h1></header>{query.isLoading ? <Skeleton rows={5} /> : query.isError ? <ErrorState error={query.error} onRetry={() => void query.refetch()} /> : data ? <><section className="card p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-mono text-xs text-primary">{data.app_code}</p><h2 className="mt-2 font-title-md text-on-surface">{typeof data.scheme === "string" ? data.scheme : data.scheme?.name_en ?? "Scholarship application"}</h2><p className="mt-1 text-sm capitalize text-on-surface-variant">{data.status.replaceAll("_", " ")}</p></div><p className="font-title-md text-on-surface">₹{Number(data.amount ?? 0).toLocaleString("en-IN")}</p></div><DownloadButton label={<T gu="સ્વીકૃતિ પત્ર" en="Download acknowledgement" hi="स्वीकृति पत्र डाउनलोड" />} onClick={() => void downloadApiFile(`/applications/${encodeURIComponent(code)}/ack.pdf`, `${code}-ack.pdf`)} /></section><section className="card p-5"><h2 className="font-title-sm text-on-surface"><T gu="પ્રક્રિયા સમયરેખા" en="Application timeline" hi="आवेदन समयरेखा" /></h2>{timeline.isLoading ? <Skeleton rows={3} className="mt-4" /> : timeline.isError ? <ErrorState error={timeline.error} onRetry={() => void timeline.refetch()} /> : <ol className="mt-4 space-y-4">{(timeline.data ?? []).map((event, index) => <li className="flex gap-3" key={`${String(event.at)}-${index}`}><span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-primary" /><div><p className="font-medium capitalize text-on-surface">{String(event.stage ?? "Update").replaceAll("_", " ")}</p><p className="text-sm text-on-surface-variant">{String(event.note ?? "")}</p><p className="mt-1 text-xs text-on-surface-variant">{event.at ? new Date(String(event.at)).toLocaleString() : ""} · {String(event.actor ?? "")}</p></div></li>)}</ol>}</section></> : null}</main></StudentShell>;
}
