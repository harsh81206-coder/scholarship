"use client";

import { DownloadButton } from "@/components/DownloadButton";
import { T } from "@/components/T";
import { ErrorState } from "@/components/states/ErrorState";
import { Skeleton } from "@/components/states/Skeleton";
import { PublicShell } from "@/components/shell/PublicShell";
import { usePublicTransparency } from "@/lib/api/hooks";

type Metrics = { district_count: number; school_count: number; student_count: number; application_count: number; credited_count: number; total_disbursed: number; grievance_count: number; grievances_resolved: number };

export default function Page() {
  const query = usePublicTransparency();
  const data = query.data as Metrics | undefined;
  return <PublicShell><main className="mx-auto max-w-6xl space-y-6 px-5 py-10">
    <header className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-label-sm text-primary"><T gu="જાહેર માહિતી" en="PUBLIC INFORMATION" hi="सार्वजनिक जानकारी" /></p><h1 className="mt-1 font-headline-lg text-on-surface"><T gu="પારદર્શિતા ડૅશબોર્ડ" en="Transparency dashboard" hi="पारदर्शिता डैशबोर्ड" /></h1><p className="mt-2 max-w-2xl text-on-surface-variant"><T gu="જાહેર આંકડા એકત્રિત સ્વરૂપમાં દર્શાવાય છે. વ્યક્તિગત માહિતી અહીં બતાવવામાં આવતી નથી." en="Public statistics are shown in aggregate. Personal records are not displayed here." hi="सार्वजनिक आंकड़े समेकित रूप में दिखाए जाते हैं। यहां व्यक्तिगत जानकारी नहीं दिखाई जाती।" /></p></div><DownloadButton label={<T gu="CSV ડાઉનલોડ" en="Download CSV" hi="CSV डाउनलोड" />} onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/public/transparency.csv`, "_blank", "noopener,noreferrer")} /></header>
    {query.isLoading ? <Skeleton rows={4} /> : query.isError ? <ErrorState error={query.error} onRetry={() => void query.refetch()} /> : <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[["શાળાઓ", "Schools", "स्कूल", data?.school_count], ["વિદ્યાર્થીઓ", "Students", "छात्र", data?.student_count], ["અરજીઓ", "Applications", "आवेदन", data?.application_count], ["જમા ચુકવણીઓ", "Credited payments", "भुगतान", data?.credited_count], ["કુલ ચુકવણી", "Total disbursed", "कुल वितरित", `₹${(data?.total_disbursed ?? 0).toLocaleString("en-IN")}`], ["ફરિયાદો", "Grievances", "शिकायतें", data?.grievance_count], ["ઉકેલાયેલી ફરિયાદો", "Resolved grievances", "हल शिकायतें", data?.grievances_resolved], ["જિલ્લાઓ", "Districts", "जिले", data?.district_count]].map(([gu, en, hi, value]) => <article className="card p-5" key={String(en)}><p className="text-sm text-on-surface-variant"><T gu={String(gu)} en={String(en)} hi={String(hi)} /></p><p className="mt-2 font-headline-md text-on-surface">{value ?? 0}</p></article>)}
    </section>}
    <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4 text-sm text-on-surface-variant"><T gu="આ પોર્ટલનું PFMS અને અન્ય સરકારી સિસ્ટમ જોડાણ ડેમો મોડમાં છે." en="PFMS and other government system connections are simulated in this demo." hi="इस डेमो में PFMS और अन्य सरकारी प्रणालियों के कनेक्शन सिम्युलेटेड हैं।" /></div>
  </main></PublicShell>;
}
