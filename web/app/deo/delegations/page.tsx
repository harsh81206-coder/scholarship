"use client";

import { FormEvent, useState } from "react";
import { T } from "@/components/T";
import { ErrorState } from "@/components/states/ErrorState";
import { Skeleton } from "@/components/states/Skeleton";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { useCreateDelegation, useDelegations } from "@/lib/api/hooks";
import { useAppStore } from "@/lib/store";

type Delegation = { id: number; from_user_id: number; to_user_id: number; scope: { application_ids?: string[] }; due_date?: string; status: string };

export default function Page() {
  const query = useDelegations();
  const create = useCreateDelegation();
  const showSuccess = useAppStore((state) => state.showSuccess);
  const showError = useAppStore((state) => state.showError);
  const [userId, setUserId] = useState("");
  const [codes, setCodes] = useState("");
  const [dueDate, setDueDate] = useState("");
  async function submit(event: FormEvent) { event.preventDefault(); try { await create.mutateAsync({ to_user_id: Number(userId), application_ids: codes.split(/[\s,]+/).filter(Boolean), due_date: dueDate || undefined }); setCodes(""); showSuccess("Delegation created"); } catch (error) { showError(error instanceof Error ? error.message : "Delegation failed"); } }
  const rows = (query.data ?? []) as Delegation[];
  return <OfficerShell role="deo"><main className="mx-auto max-w-5xl space-y-5 p-5"><header><p className="font-label-sm text-primary"><T gu="સત્તા સોંપણી" en="APPROVAL DELEGATION" hi="अनुमोदन प्रत्यायोजन" /></p><h1 className="mt-1 font-headline-md text-on-surface"><T gu="તાલુકા અધિકારી સોંપણીઓ" en="Taluka officer delegations" hi="तालुका अधिकारी प्रत्यायोजन" /></h1></header><form onSubmit={(event) => void submit(event)} className="card grid gap-3 p-5 md:grid-cols-3"><label className="text-sm">Recipient user ID<input required type="number" min="1" value={userId} onChange={(event) => setUserId(event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-outline-variant px-3" /></label><label className="text-sm">Application codes<input required value={codes} onChange={(event) => setCodes(event.target.value)} placeholder="APP-..., APP-..." className="mt-1 h-10 w-full rounded-lg border border-outline-variant px-3" /></label><label className="text-sm">Expiry date<input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-outline-variant px-3" /></label><button disabled={create.isPending} className="btn-primary rounded-lg px-4 py-2 text-sm md:col-span-3"><T gu="સોંપણી બનાવો" en="Create delegation" hi="प्रत्यायोजन बनाएं" /></button></form>{query.isLoading ? <Skeleton rows={4} /> : query.isError ? <ErrorState error={query.error} onRetry={() => void query.refetch()} /> : <section className="space-y-3">{rows.map((row) => <article className="card flex flex-wrap items-center justify-between gap-3 p-4" key={row.id}><div><p className="font-semibold text-on-surface">Delegation #{row.id} · User {row.to_user_id}</p><p className="mt-1 text-sm text-on-surface-variant">{row.scope.application_ids?.join(", ") || "No application IDs"}</p></div><div className="text-right"><p className="capitalize text-on-surface">{row.status}</p><p className="text-xs text-on-surface-variant">Expires {row.due_date ?? "not set"}</p></div></article>)}</section>}</main></OfficerShell>;
}
