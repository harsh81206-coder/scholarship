"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { T } from "@/components/T";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { Skeleton } from "@/components/states/Skeleton";
import { StudentShell } from "@/components/shell/StudentShell";
import { useMySchemes } from "@/lib/api/hooks";
import { localizedName } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";

export default function Page() {
  const query = useMySchemes();
  const lang = useAppStore((state) => state.lang);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const schemes = useMemo(() => (query.data ?? []).filter((scheme) => {
    const name = localizedName({ name_en: scheme.scheme_name_en, name_gu: scheme.scheme_name_gu, name_hi: scheme.scheme_name_hi }, lang);
    const matchesText = `${name} ${scheme.scheme_code}`.toLowerCase().includes(search.toLowerCase());
    return matchesText && (filter === "all" || scheme.status === filter);
  }), [filter, lang, query.data, search]);

  return (
    <StudentShell>
      <div className="mx-auto max-w-3xl space-y-5 px-4 py-5">
        <header>
          <p className="font-label-sm text-primary"><T gu="તમારી શિષ્યવૃત્તિ" en="YOUR SCHOLARSHIPS" hi="आपकी छात्रवृत्तियां" /></p>
          <h1 className="mt-1 font-headline-md text-headline-md text-on-surface"><T gu="યોજનાઓ શોધો" en="Explore schemes" hi="योजनाएं देखें" /></h1>
          <p className="mt-1 text-sm text-on-surface-variant"><T gu="તમારી પાત્રતા અને બાકી દસ્તાવેજો તપાસો." en="Check your eligibility and missing documents." hi="अपनी पात्रता और जरूरी दस्तावेज़ देखें।" /></p>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_190px]">
          <label className="sr-only" htmlFor="scheme-search"><T gu="યોજના શોધો" en="Search schemes" hi="योजनाएं खोजें" /></label>
          <input id="scheme-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={lang === "gu" ? "યોજના શોધો" : lang === "hi" ? "योजनाएं खोजें" : "Search schemes"} className="h-11 rounded-xl border border-outline-variant bg-surface-container-lowest px-3 text-sm text-on-surface" />
          <label className="sr-only" htmlFor="scheme-filter"><T gu="પાત્રતા પ્રમાણે ફિલ્ટર કરો" en="Filter schemes" hi="योजनाएं छांटें" /></label>
          <select id="scheme-filter" value={filter} onChange={(event) => setFilter(event.target.value)} className="h-11 rounded-xl border border-outline-variant bg-surface-container-lowest px-3 text-sm text-on-surface">
            <option value="all">{lang === "gu" ? "બધી યોજનાઓ" : lang === "hi" ? "सभी योजनाएं" : "All schemes"}</option>
            <option value="eligible">{lang === "gu" ? "પાત્ર" : lang === "hi" ? "पात्र" : "Eligible"}</option>
            <option value="pending_docs">{lang === "gu" ? "દસ્તાવેજ બાકી" : lang === "hi" ? "दस्तावेज़ बाकी" : "Documents needed"}</option>
            <option value="ineligible">{lang === "gu" ? "હાલ પાત્ર નથી" : lang === "hi" ? "अभी पात्र नहीं" : "Not eligible"}</option>
          </select>
        </div>

        {query.isLoading ? <Skeleton rows={5} /> : query.isError ? <ErrorState error={query.error} onRetry={() => void query.refetch()} /> : schemes.length === 0 ? (
          <EmptyState title={search || filter !== "all" ? (lang === "gu" ? "કોઈ યોજના મળી નથી" : lang === "hi" ? "कोई योजना नहीं मिली" : "No schemes match") : (lang === "gu" ? "હાલ કોઈ યોજના ઉપલબ્ધ નથી" : lang === "hi" ? "अभी कोई योजना उपलब्ध नहीं है" : "No schemes available")} description={lang === "gu" ? "ફિલ્ટર બદલીને ફરી પ્રયાસ કરો." : lang === "hi" ? "फ़िल्टर बदलकर फिर कोशिश करें।" : "Change the filters and try again."} />
        ) : (
          <div className="space-y-3">
            {schemes.map((scheme) => {
              const name = localizedName({ name_en: scheme.scheme_name_en, name_gu: scheme.scheme_name_gu, name_hi: scheme.scheme_name_hi }, lang);
              const eligible = scheme.status === "eligible";
              const statusText = scheme.status === "eligible" ? ["પાત્ર", "Eligible", "पात्र"] : scheme.status === "pending_docs" ? ["દસ્તાવેજ જરૂરી", "Documents needed", "दस्तावेज़ जरूरी"] : ["હાલ પાત્ર નથી", "Not eligible", "अभी पात्र नहीं"];
              return (
                <article key={scheme.scheme_code} className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="font-title-sm text-on-surface">{name}</h2>
                      <p className="mt-1 font-mono text-xs text-on-surface-variant">{scheme.scheme_code}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${eligible ? "bg-success-container text-on-success-container" : "bg-warning-container text-on-surface"}`}>
                      {statusText[lang === "gu" ? 0 : lang === "hi" ? 2 : 1]}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="font-title-sm text-primary">₹{Number(scheme.amount ?? 0).toLocaleString("en-IN")}</p>
                    <div className="flex gap-2">
                      <Link href={`/student/schemes/${encodeURIComponent(scheme.scheme_code)}`} className="btn-outline rounded-lg px-3 py-2 text-xs font-semibold">
                        <T gu="વિગતો" en="Details" hi="विवरण" />
                      </Link>
                      <Link href={eligible ? "/student/apply" : `/student/schemes/${encodeURIComponent(scheme.scheme_code)}`} className="btn-primary rounded-lg px-3 py-2 text-xs font-semibold">
                        <T gu={eligible ? "અરજી કરો" : "દસ્તાવેજ સુધારો"} en={eligible ? "Apply" : "Fix documents"} hi={eligible ? "आवेदन करें" : "दस्तावेज़ ठीक करें"} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </StudentShell>
  );
}
