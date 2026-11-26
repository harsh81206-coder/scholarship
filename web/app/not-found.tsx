import Link from "next/link";
import { T } from "@/components/T";
import { PublicShell } from "@/components/shell/PublicShell";

export default function NotFound() {
  return <PublicShell><main className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center px-5 text-center"><span className="material-symbols-outlined text-5xl text-primary">search_off</span><h1 className="mt-4 font-headline-md text-on-surface"><T gu="પૃષ્ઠ મળ્યું નથી" en="Page not found" hi="पेज नहीं मिला" /></h1><p className="mt-2 text-on-surface-variant"><T gu="આ લિંક ઉપલબ્ધ નથી અથવા સરનામું બદલાયું છે." en="This link is unavailable or the address has changed." hi="यह लिंक उपलब्ध नहीं है या पता बदल गया है।" /></p><Link href="/" className="btn-primary mt-5 rounded-lg px-4 py-2"><T gu="મુખ્ય પૃષ્ઠ" en="Go home" hi="मुखपृष्ठ" /></Link></main></PublicShell>;
}
