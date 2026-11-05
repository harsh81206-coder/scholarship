"use client";
import { useState } from "react";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { StatusChip } from "@/components/ui";

const SCHOOLS = [
  { name: "Vinay Mandir High School", gu: "વ. મ. HS", udise: "24150302101", taluka: "Khambhat", students: 320, pending: 2, compliance: 94 },
  { name: "Sarvajanik High School", gu: "સ. HS", udise: "24150600801", taluka: "Anklav", students: 280, pending: 1, compliance: 88 },
  { name: "R.K. High School", gu: "R.K. HS", udise: "24150403301", taluka: "Petlad", students: 410, pending: 1, compliance: 91 },
  { name: "Shri Vallabh Kanya Vidyalaya", gu: "Sh. VKV", udise: "24150201905", taluka: "Borsad", students: 190, pending: 0, compliance: 100 },
  { name: "Shree Sardar Patel High School", gu: "SP HS", udise: "24150104502", taluka: "Anand", students: 540, pending: 0, compliance: 97 },
  { name: "Govt High School Borsad", gu: "Gov. HS B.", udise: "24150204101", taluka: "Borsad", students: 220, pending: 0, compliance: 72 },
];

export default function TpeoSchoolsPage() {
  const [search, setSearch] = useState("");
  const filtered = SCHOOLS.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.taluka.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <OfficerShell role="tpeo">
      <div className="p-6 flex flex-col gap-5 max-w-5xl">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
            <T gu="શ. ન." en="School Oversight" hi="स्कूल निगरानी" />
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            <T gu="TPEO ત. ш. — Anand Taluka" en="TPEO Taluka School Oversight — Anand Taluka" hi="TPEO तालुका स्कूल निगरानी" />
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search school or taluka…"
            className="w-full pl-10 pr-4 h-10 rounded-xl bg-surface-container border border-outline-variant text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>

        {/* Schools table */}
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface-container-low">
              <tr>
                {["School", "UDISE", "Taluka", "Students", "Pending TPEO", "Compliance"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-label-md text-label-md text-on-surface-variant">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filtered.map((school) => (
                <tr key={school.udise} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-label-lg text-label-lg text-on-surface font-semibold">{school.name}</p>
                    <p className="font-caption text-caption text-on-surface-variant font-mono">{school.udise}</p>
                  </td>
                  <td className="px-4 py-3 font-caption text-caption text-on-surface-variant font-mono">{school.udise}</td>
                  <td className="px-4 py-3 font-body-sm text-body-sm text-on-surface">{school.taluka}</td>
                  <td className="px-4 py-3 font-label-lg text-label-lg text-on-surface font-bold">{school.students}</td>
                  <td className="px-4 py-3">
                    {school.pending > 0 ? (
                      <StatusChip status="pending" label={`${school.pending} Pending`} />
                    ) : (
                      <StatusChip status="approved" label="Clear" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-surface-container-high rounded-full h-2 overflow-hidden">
                        <div className={`h-full rounded-full ${school.compliance >= 90 ? "bg-success" : school.compliance >= 75 ? "bg-warning" : "bg-danger"}`}
                          style={{ width: `${school.compliance}%` }} />
                      </div>
                      <span className="font-label-md text-label-md font-bold text-on-surface w-10 text-right">{school.compliance}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </OfficerShell>
  );
}
