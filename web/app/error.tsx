"use client";

import { useEffect } from "react";
import { T } from "@/components/T";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("Application route error", error); }, [error]);
  return <main role="alert" className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-5 text-center"><span className="material-symbols-outlined text-5xl text-error">error</span><h1 className="mt-4 font-title-md text-on-surface"><T gu="પૃષ્ઠ લોડ થઈ શક્યું નથી" en="This page could not load" hi="यह पेज लोड नहीं हो सका" /></h1><p className="mt-2 text-sm text-on-surface-variant">{error.message}</p><button onClick={reset} className="btn-primary mt-5 rounded-lg px-4 py-2"><T gu="ફરી પ્રયાસ કરો" en="Try again" hi="फिर कोशिश करें" /></button></main>;
}
