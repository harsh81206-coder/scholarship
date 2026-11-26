"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { T } from "@/components/T";
import { ErrorState } from "@/components/states/ErrorState";
import { PublicShell } from "@/components/shell/PublicShell";
import { usePublicStatus } from "@/lib/api/hooks";

export default function Page() {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");
  const query = usePublicStatus(code);
  const result = query.data as { app_code?: string; status?: string; student?: string; updated_at?: string } | undefined;
  function submit(event: FormEvent) { event.preventDefault(); setCode(input.trim()); }
  return <PublicShell><main className="mx-auto max-w-4xl space-y-8 px-5 py-10"><header><p className="font-label-sm text-primary"><T gu="માર્ગદર્શન" en="GUIDANCE" hi="मार्गदर्शन" /></p><h1 className="mt-1 font-headline-lg text-on-surface"><T gu="સહાય કેન્દ્ર" en="Help centre" hi="सहायता केंद्र" /></h1><p className="mt-2 text-on-surface-variant"><T gu="અરજીની સ્થિતિ તપાસો અથવા દસ્તાવેજોની યાદી જુઓ." en="Check an application status or review the document checklist." hi="आवेदन की स्थिति देखें या दस्तावेज़ सूची देखें।" /></p></header>
    <section className="card p-5"><h2 className="font-title-sm text-on-surface"><T gu="અરજીની સ્થિતિ જુઓ" en="Look up an application" hi="आवेदन की स्थिति देखें" /></h2><form onSubmit={submit} className="mt-3 flex flex-col gap-2 sm:flex-row"><input value={input} onChange={(event) => setInput(event.target.value)} required placeholder="APP-2026-..." className="h-11 flex-1 rounded-lg border border-outline-variant px-3" /><button className="btn-primary rounded-lg px-4 py-2"><T gu="તપાસો" en="Check status" hi="स्थिति जांचें" /></button></form>{query.isError && <div className="mt-3"><ErrorState error={query.error} onRetry={() => void query.refetch()} /></div>}{result && <div className="mt-4 rounded-lg bg-surface-container-low p-4"><p className="font-mono text-sm">{result.app_code}</p><p className="mt-1 font-semibold capitalize">{result.status?.replaceAll("_", " ")}</p><p className="text-sm text-on-surface-variant">{result.student} · {result.updated_at ? new Date(result.updated_at).toLocaleDateString() : ""}</p></div>}</section>
    <section className="grid gap-4 md:grid-cols-2"><article className="card p-5"><h2 className="font-title-sm text-on-surface"><T gu="સામાન્ય પ્રશ્નો" en="Common questions" hi="सामान्य प्रश्न" /></h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-on-surface-variant"><li><T gu="OTP મેળવવા માટે લૉગિન પૃષ્ઠ પર CTS ID દાખલ કરો." en="Enter your CTS ID on the login page to request an OTP." hi="OTP पाने के लिए लॉगिन पेज पर CTS ID दर्ज करें।" /></li><li><T gu="દસ્તાવેજ સ્પષ્ટ અને માન્ય હોવો જોઈએ." en="Documents should be clear and current." hi="दस्तावेज़ स्पष्ट और वैध होने चाहिए।" /></li><li><T gu="સહાય માટે 1800-233-5500 પર સંપર્ક કરો." en="Call 1800-233-5500 for assistance." hi="सहायता के लिए 1800-233-5500 पर कॉल करें।" /></li></ul></article><article className="card p-5"><h2 className="font-title-sm text-on-surface"><T gu="દસ્તાવેજ ચેકલિસ્ટ" en="Document checklist" hi="दस्तावेज़ चेकलिस्ट" /></h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-on-surface-variant"><li><T gu="આવક પ્રમાણપત્ર" en="Income certificate" hi="आय प्रमाण पत्र" /></li><li><T gu="જાતિ પ્રમાણપત્ર (જ્યાં લાગુ પડે)" en="Caste certificate (where applicable)" hi="जाति प्रमाण पत्र (जहां लागू हो)" /></li><li><T gu="છેલ્લી માર્કશીટ અને બેંક પાસબુક" en="Latest marksheet and bank passbook" hi="नवीनतम अंकपत्र और बैंक पासबुक" /></li></ul><Link href="/login" className="mt-4 inline-flex text-sm font-semibold text-primary"><T gu="વિદ્યાર્થી લૉગિન" en="Student login" hi="छात्र लॉगिन" /> →</Link></article></section>
  </main></PublicShell>;
}
