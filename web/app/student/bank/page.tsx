"use client";

import { FormEvent, useState } from "react";
import { T } from "@/components/T";
import { DemoBadge } from "@/components/DemoBadge";
import { ErrorState } from "@/components/states/ErrorState";
import { Skeleton } from "@/components/states/Skeleton";
import { StudentShell } from "@/components/shell/StudentShell";
import { useAddBank, useMyBank, useVerifyBank } from "@/lib/api/hooks";
import { useAppStore } from "@/lib/store";

type Bank = { id: number; holder_type: string; holder_name: string; last4: string; ifsc: string; bank_name: string; verified: boolean; aadhaar_seeded: boolean };

export default function Page() {
  const query = useMyBank();
  const add = useAddBank();
  const verify = useVerifyBank();
  const lang = useAppStore((state) => state.lang);
  const [holder, setHolder] = useState("Hetalben Patel");
  const [account, setAccount] = useState("");
  const [ifsc, setIfsc] = useState("SBIN0001234");
  const [message, setMessage] = useState("");
  const rows = (query.data?.items ?? []) as Bank[];
  async function submit(event: FormEvent) {
    event.preventDefault(); setMessage("");
    try {
      await add.mutateAsync({ holder_type: "mother", holder_name: holder, account_number: account, ifsc, bank_name: "State Bank of India" });
      setAccount(""); setMessage(lang === "gu" ? "ખાતું સુરક્ષિત રીતે ઉમેરાયું." : lang === "hi" ? "खाता सुरक्षित रूप से जोड़ा गया।" : "Account added securely.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not add account"); }
  }
  return <StudentShell><main className="mx-auto max-w-2xl space-y-5 px-4 py-5"><header className="flex items-start justify-between gap-3"><div><p className="font-label-sm text-primary"><T gu="ચુકવણી સેટઅપ" en="PAYMENT SETUP" hi="भुगतान सेटअप" /></p><h1 className="mt-1 font-headline-md text-on-surface"><T gu="બેંક ખાતું" en="Bank account" hi="बैंक खाता" /></h1><p className="mt-1 text-sm text-on-surface-variant"><T gu="DBT માટે ખાતાની વિગતો અને આધાર સીડિંગ તપાસો." en="Review account details and Aadhaar seeding for DBT." hi="DBT के लिए खाता विवरण और आधार सीडिंग देखें।" /></p></div><DemoBadge /></header>{query.isLoading ? <Skeleton rows={3} /> : query.isError ? <ErrorState error={query.error} onRetry={() => void query.refetch()} /> : rows.map((bank) => <article className="card p-5" key={bank.id}><div className="flex items-start justify-between gap-3"><div><p className="text-xs uppercase text-on-surface-variant">{bank.bank_name}</p><h2 className="mt-1 font-title-sm text-on-surface">{bank.holder_name}</h2><p className="mt-1 font-mono text-sm text-on-surface-variant">•••• {bank.last4} · {bank.ifsc}</p></div><span className={`rounded-full px-2.5 py-1 text-xs ${bank.verified ? "bg-success-container text-on-success-container" : "bg-warning-container text-on-surface"}`}>{bank.verified ? (lang === "gu" ? "ચકાસેલું" : lang === "hi" ? "सत्यापित" : "Verified") : (lang === "gu" ? "ચકાસણી બાકી" : lang === "hi" ? "सत्यापन बाकी" : "Verification needed")}</span></div><p className="mt-3 text-xs text-on-surface-variant"><T gu="આધાર સીડિંગ" en="Aadhaar seeding" hi="आधार सीडिंग" />: {bank.aadhaar_seeded ? "Active" : "Not active"}</p>{!bank.verified && <button onClick={() => verify.mutate()} disabled={verify.isPending} className="btn-primary mt-4 rounded-lg px-4 py-2 text-sm"><T gu="પેની-ડ્રોપ ડેમો ચકાસણી" en="Run demo penny-drop" hi="डेमो पेनी-ड्रॉप जांचें" /></button>}</article>)}<section className="card p-5"><h2 className="font-title-sm text-on-surface"><T gu="બીજું ખાતું ઉમેરો" en="Add another account" hi="दूसरा खाता जोड़ें" /></h2><form onSubmit={(event) => void submit(event)} className="mt-4 space-y-3"><label className="block text-sm text-on-surface-variant"><T gu="ખાતાધારકનું નામ" en="Account holder" hi="खाताधारक का नाम" /><input value={holder} onChange={(event) => setHolder(event.target.value)} required className="mt-1 h-10 w-full rounded-lg border border-outline-variant px-3 text-on-surface" /></label><label className="block text-sm text-on-surface-variant"><T gu="ખાતા નંબર" en="Account number" hi="खाता नंबर" /><input inputMode="numeric" autoComplete="off" value={account} onChange={(event) => setAccount(event.target.value)} required minLength={9} maxLength={18} className="mt-1 h-10 w-full rounded-lg border border-outline-variant px-3 text-on-surface" /></label><label className="block text-sm text-on-surface-variant">IFSC<input value={ifsc} onChange={(event) => setIfsc(event.target.value.toUpperCase())} required className="mt-1 h-10 w-full rounded-lg border border-outline-variant px-3 uppercase text-on-surface" /></label><button disabled={add.isPending} className="btn-primary rounded-lg px-4 py-2 text-sm"><T gu="ખાતું ઉમેરો" en="Add account" hi="खाता जोड़ें" /></button></form>{message && <p role="status" className="mt-3 text-sm text-on-surface-variant">{message}</p>}<p className="mt-3 text-xs text-on-surface-variant"><T gu="ખાતા નંબર સંગ્રહાતો નથી; ડેમો પેની-ડ્રોપ માત્ર અનુસરણ માટે છે." en="The raw account number is not stored; penny-drop verification is simulated." hi="खाता नंबर सहेजा नहीं जाता; पेनी-ड्रॉप जांच सिम्युलेटेड है।" /></p></section></main></StudentShell>;
}
