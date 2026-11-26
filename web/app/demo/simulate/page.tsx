"use client";

import React, { useState } from "react";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { useAppStore } from "@/lib/store";
import { useDemoPromote } from "@/lib/api/hooks";
import { ErrorState } from "@/components/states/ErrorState";
import { EmptyState } from "@/components/states/EmptyState";

export default function SimulateNextYearPage() {
  const showSuccess = useAppStore((s) => s.showSuccess);
  const showError = useAppStore((s) => s.showError);
  const lang = useAppStore((s) => s.lang);

  const promote = useDemoPromote();
  const [ctsId, setCtsId] = useState("GJ-AND-2026-004512");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [actionError, setActionError] = useState<Error | null>(null);

  async function runPromote() {
    setActionError(null);
    try {
      const res = await promote.mutateAsync(ctsId);
      setResult(res);
      showSuccess(`Promoted ${ctsId} from Grade ${String(res.old_grade)} to Grade ${String(res.new_grade)}`);
    } catch (err) {
      const normalized = err instanceof Error ? err : new Error("Promote failed");
      setActionError(normalized);
      showError(normalized.message);
    }
  }

  function handlePromote(e: React.FormEvent) {
    e.preventDefault();
    void runPromote();
  }

  const diff = (result?.diff ?? {}) as Record<string, unknown>;
  const newlyEligible = Array.isArray(diff.newly_eligible) ? diff.newly_eligible : [];
  const renewed = Array.isArray(diff.renewed) ? diff.renewed : [];
  const noLonger = Array.isArray(diff.no_longer_applicable) ? diff.no_longer_applicable : [];
  const emptyCopy = {
    gu: { title: "હજુ કોઈ સિમ્યુલેશન નથી", description: "પાત્રતા ફેરફાર અને નવીકરણ જોવા માટે વિદ્યાર્થીને આગળના ધોરણમાં પ્રમોટ કરો." },
    en: { title: "No simulation run yet", description: "Promote a seeded student to see the eligibility diff and renewal results." },
    hi: { title: "अभी कोई सिमुलेशन नहीं चला", description: "पात्रता अंतर और नवीनीकरण देखने के लिए सीड किए गए छात्र को अगली कक्षा में प्रमोट करें।" },
  }[lang];

  return (
    <OfficerShell role="demo">
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">
            <T gu="આગામી વર્ષ સિમ્યુલેશન" en="Simulate Next Academic Year (X1)" hi="अगले वर्ष का सिमुलेशन" />
          </h1>
          <p className="text-sm text-on-surface-variant">
            Promote a student to the next grade, compute eligibility diff, auto-create renewals, and trigger notifications.
          </p>
        </div>

        <form onSubmit={handlePromote} className="card p-4 flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[240px]">
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Student CTS ID</label>
            <input
              type="text"
              value={ctsId}
              onChange={(e) => setCtsId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface text-sm font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={promote.isPending}
            className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold flex items-center gap-2"
          >
            <Icon name="fast_forward" size={18} />
            {promote.isPending ? "Promoting..." : "Promote to Next Grade"}
          </button>
        </form>

        {actionError && <ErrorState error={actionError} onRetry={() => void runPromote()} />}

        {result ? (
          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant pb-3">
              <div>
                <p className="text-xs font-mono text-primary font-semibold">{String(result.cts_id)}</p>
                <h2 className="font-title-md font-bold text-on-surface">
                  Grade {String(result.old_grade)} → Grade {String(result.new_grade)}
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                Diff Computed ✓
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <p className="font-bold text-emerald-900">Newly Eligible ({newlyEligible.length})</p>
                <pre className="mt-1 whitespace-pre-wrap text-[11px]">{JSON.stringify(newlyEligible, null, 2)}</pre>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                <p className="font-bold text-blue-900">Auto-Renewed ({renewed.length})</p>
                <pre className="mt-1 whitespace-pre-wrap text-[11px]">{JSON.stringify(renewed, null, 2)}</pre>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <p className="font-bold text-amber-900">No Longer Applicable ({noLonger.length})</p>
                <pre className="mt-1 whitespace-pre-wrap text-[11px]">{JSON.stringify(noLonger, null, 2)}</pre>
              </div>
            </div>
          </div>
        ) : !actionError ? (
          <EmptyState title={emptyCopy.title} description={emptyCopy.description} />
        ) : null}
      </div>
    </OfficerShell>
  );
}
