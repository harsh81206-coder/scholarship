"use client";

import { useMemo, useState } from "react";
import { DownloadButton } from "@/components/DownloadButton";
import { T } from "@/components/T";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { Skeleton } from "@/components/states/Skeleton";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { useDistrictSchools } from "@/lib/api/hooks";
import { downloadCsv } from "@/lib/download";

type SchoolRow = { school_id: number; udise_code: string; name_en: string; name_gu?: string; taluka_name: string; student_count: number; high_risk_count: number; application_count: number; pending_count: number; credited_count: number; cycle_batches: number };

export default function Page() {
  const query = useDistrictSchools();
  const [search, setSearch] = useState("");
  const items = useMemo(() => ((query.data?.items ?? []) as SchoolRow[]).filter((school) => `${school.name_en} ${school.name_gu ?? ""} ${school.udise_code} ${school.taluka_name}`.toLowerCase().includes(search.toLowerCase())), [query.data, search]);

  return (
    <OfficerShell role="deo">
      <div className="mx-auto max-w-6xl space-y-5 p-5">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-label-sm text-primary"><T gu="જિલ્લા દેખરેખ" en="DISTRICT OVERSIGHT" hi="जिला निगरानी" /></p>
            <h1 className="mt-1 font-headline-md text-headline-md text-on-surface"><T gu="શાળા પ્રદર્શન" en="School performance" hi="स्कूल प्रदर्शन" /></h1>
            <p className="mt-1 text-sm text-on-surface-variant"><T gu="અરજીઓ, જોખમ અને સાયકલ બેચનો જિલ્લાવાર દેખાવ." en="District view of applications, student risk and cycle batches." hi="आवेदन, छात्र जोखिम और साइकिल बैच का जिला-स्तरीय दृश्य।" /></p>
          </div>
          <div className="flex gap-2">
            <input aria-label="Search schools" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search school / UDISE" className="h-10 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-sm" />
            <DownloadButton label={<T gu="CSV નિકાસ" en="Export CSV" hi="CSV निर्यात" />} disabled={!items.length} onClick={() => downloadCsv("district-schools.csv", items)} />
          </div>
        </header>
        {query.isLoading ? <Skeleton rows={8} /> : query.isError ? <ErrorState error={query.error} onRetry={() => void query.refetch()} /> : !items.length ? <EmptyState title={<T gu="કોઈ શાળા મળી નથી" en="No schools found" hi="कोई स्कूल नहीं मिला" />} description={<T gu="શોધ બદલીને ફરી પ્રયાસ કરો." en="Change your search and try again." hi="खोज बदलकर फिर कोशिश करें।" />} /> : (
          <section className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-surface-container-low text-xs uppercase text-on-surface-variant"><tr>
                  <th className="px-4 py-3"><T gu="શાળા" en="School" hi="स्कूल" /></th><th className="px-4 py-3"><T gu="તાલુકો" en="Taluka" hi="तालुका" /></th><th className="px-4 py-3"><T gu="વિદ્યાર્થીઓ" en="Students" hi="छात्र" /></th><th className="px-4 py-3"><T gu="જોખમમાં" en="At risk" hi="जोखिम में" /></th><th className="px-4 py-3"><T gu="બાકી અરજીઓ" en="Pending apps" hi="लंबित आवेदन" /></th><th className="px-4 py-3"><T gu="જમા અરજીઓ" en="Credited apps" hi="भुगतान आवेदन" /></th><th className="px-4 py-3"><T gu="સાયકલ બેચ" en="Cycle batches" hi="साइकिल बैच" /></th>
                </tr></thead>
                <tbody>{items.map((school) => <tr key={school.school_id} className="border-t border-outline-variant/60">
                  <td className="px-4 py-3"><p className="font-semibold text-on-surface">{school.name_en}</p><p className="font-mono text-xs text-on-surface-variant">{school.udise_code}</p></td><td className="px-4 py-3">{school.taluka_name}</td><td className="px-4 py-3">{school.student_count}</td><td className="px-4 py-3">{school.high_risk_count}</td><td className="px-4 py-3">{school.pending_count}</td><td className="px-4 py-3">{school.credited_count}</td><td className="px-4 py-3">{school.cycle_batches}</td>
                </tr>)}</tbody>
              </table>
            </div>
            <p className="border-t border-outline-variant bg-surface-container-low px-4 py-3 text-xs text-on-surface-variant">{query.data?.total ?? items.length} <T gu="શાળાઓ" en="schools in your scope" hi="स्कूल आपके क्षेत्र में" /></p>
          </section>
        )}
      </div>
    </OfficerShell>
  );
}
