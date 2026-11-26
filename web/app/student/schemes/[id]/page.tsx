"use client";

import Link from "next/link";
import { StudentShell } from "@/components/shell/StudentShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { StatusChip } from "@/components/ui";
import { Skeleton } from "@/components/states/Skeleton";
import { ErrorState } from "@/components/states/ErrorState";
import { EmptyState } from "@/components/states/EmptyState";
import { ApiModeBadge } from "@/app/student/components/ApiModeBadge";
import { useAppStore } from "@/lib/store";
import { useExplain, useMySchemes, useMe } from "@/lib/api/hooks";

interface PageProps {
  params: { id: string };
}

export default function SchemeDetailPage({ params }: PageProps) {
  const schemeCode = decodeURIComponent(params.id);
  const lang = useAppStore((s) => s.lang);
  const { data: explain, isLoading: loadingExplain, error: errorExplain, refetch: refetchExplain } = useExplain(schemeCode, lang);
  const { data: schemes, isLoading: loadingSchemes, error: errorSchemes, refetch: refetchSchemes } = useMySchemes();
  const { data: profile, isLoading: loadingProfile, error: errorProfile, refetch: refetchProfile } = useMe();

  if (loadingExplain || loadingSchemes || loadingProfile) {
    return (
      <StudentShell>
        <ApiModeBadge />
        <div className="p-4">
          <Skeleton rows={5} />
        </div>
      </StudentShell>
    );
  }

  if (errorExplain || errorSchemes || errorProfile) {
    return (
      <StudentShell>
        <ApiModeBadge />
        <div className="p-4">
          <ErrorState
            error={errorExplain ?? errorSchemes ?? errorProfile}
            onRetry={() => {
              void refetchExplain();
              void refetchSchemes();
              void refetchProfile();
            }}
          />
        </div>
      </StudentShell>
    );
  }

  const scheme = (schemes ?? []).find((s) => s.scheme_code === schemeCode);
  if (!scheme) {
    return (
      <StudentShell>
        <ApiModeBadge />
        <div className="p-4"><EmptyState title="Scheme not found" description="This scheme is not available for your profile." /></div>
      </StudentShell>
    );
  }
  const title =
    lang === "gu"
      ? scheme?.scheme_name_gu || scheme?.scheme_name_en || schemeCode
      : scheme?.scheme_name_en || schemeCode;
  const status = String(explain?.status ?? scheme.status ?? "unknown");
  const isEligible = status === "eligible";
  const reasons = Array.isArray(scheme?.reasons) ? scheme.reasons : [];
  const passedCount = reasons.filter((r) => Boolean(r.passed)).length;
  const aiText = String(explain?.text ?? "");
  const steps = Array.isArray(explain?.steps) ? (explain.steps as string[]) : [];

  return (
    <StudentShell>
      <ApiModeBadge />
      <div className="flex flex-col gap-4 pb-6">
        {/* Back + gov badge row */}
        <div className="px-4 pt-2 pb-1 flex items-center justify-between">
          <Link href="/student" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shadow-sm">
            <Icon name="arrow_back" size={20} />
          </Link>
          <div className="flex items-center gap-1 bg-surface-container-high px-3 py-1 rounded-full">
            <Icon name="verified" size={14} fill className="text-primary" />
            <span className="font-label-md text-label-md text-primary font-semibold">
              <T gu="ગુજ. સરકાર • શિક્ષણ વિભ." en="Gujarat Govt • Education Dept" hi="गुज. सरकार • शिक्षा विभाग" />
            </span>
          </div>
          <Link href="/student/apply" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors">
            <Icon name="bolt" size={20} />
          </Link>
        </div>

        {/* Scheme title card */}
        <div className="mx-4">
          <div className="card p-4 relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-primary shrink-0 shadow-md">
                <Icon name="school" size={26} />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="font-caption text-caption uppercase tracking-wider text-on-surface-variant font-semibold">
                    {String(scheme?.scheme_type ?? "Scholarship")}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-outline-variant" />
                  <span className="font-caption text-caption text-primary font-semibold font-mono">{schemeCode}</span>
                </div>
                <h1 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-snug mt-0.5">
                  {title}
                </h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{scheme?.scheme_name_en ?? schemeCode}</p>
              </div>
            </div>

            {/* Amount pill */}
            <div className="mt-3 bg-surface-container rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center font-bold text-on-secondary text-xs">₹</div>
                <div className="flex flex-col">
                  <span className="font-label-lg text-label-lg text-primary font-bold">
                    {Number(scheme?.amount ?? 0) > 0
                      ? `₹ ${Number(scheme?.amount).toLocaleString("en-IN")} / Year`
                      : "Free Bicycle (In-Kind)"}
                  </span>
                  <span className="font-caption text-caption text-on-surface-variant">
                    <T gu="સીધી બેંક સહાય / લાભ" en="Direct Benefit Transfer" hi="प्रत्यक्ष लाभ अंतरण" />
                  </span>
                </div>
              </div>
              <Icon name="payments" size={20} className="text-primary" />
            </div>

            {/* Student identifier */}
            <div className="flex items-center justify-between pt-2 mt-2 border-t border-outline-variant">
              <div className="flex items-center gap-1">
                <Icon name="person" size={16} className="text-on-surface-variant" />
                <span className="font-caption text-caption text-on-surface-variant">
                  {profile?.name_en ?? "Student"} (Gr {profile?.grade ?? 9})
                </span>
              </div>
              <span className="font-caption text-caption text-on-surface-variant font-mono">
                {profile?.cts_id ?? ""}
              </span>
            </div>
          </div>
        </div>

        {/* Eligibility verdict */}
        <div className="mx-4">
          <div className="card p-4 relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${isEligible ? "bg-success-container text-on-success-container" : "bg-amber-100 text-amber-800"}`}>
                <Icon name={isEligible ? "check_circle" : "info"} size={24} fill />
              </div>
              <div className="flex flex-col flex-1">
                <StatusChip status={isEligible ? "approved" : "pending"} label={status} />
                <h2 className="font-title-md text-title-md text-on-surface font-semibold mt-1">
                  {isEligible ? (
                    <T gu="તમે આ યોજના માટે પાત્ર છો" en="You are eligible for this scheme" hi="आप इस योजना के लिए पात्र हैं" />
                  ) : (
                    <T gu="પાત્રતા સ્થિતિ તપાસો" en="Review eligibility requirements" hi="पात्रता आवश्यकताएं जांचें" />
                  )}
                </h2>
                {aiText && (
                  <p className="font-caption text-caption text-on-surface-variant mt-1 leading-relaxed">{aiText}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Criteria checklist */}
        {reasons.length > 0 && (
          <div className="mx-4">
            <div className="card p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="fact_check" size={20} className="text-primary" />
                  <h2 className="font-title-md text-title-md text-on-surface font-semibold">
                    <T gu="નિયમ ચકાસણી" en="Criteria Match" hi="मानदंड मिलान" />
                  </h2>
                </div>
                <span className="font-caption text-caption text-primary font-bold bg-success-container px-2 py-0.5 rounded-full">
                  {passedCount}/{reasons.length} Passed
                </span>
              </div>

              {reasons.map((rule, i) => {
                const passed = Boolean(rule.passed);
                const hint = String(rule[`fix_hint_${lang}`] ?? rule.fix_hint_en ?? "");
                return (
                  <div key={i} className="p-3 bg-surface-container-low rounded-lg flex items-center justify-between gap-2">
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-lg text-label-lg text-on-surface font-medium capitalize">
                        {String(rule.field ?? "Rule")} ({String(rule.op ?? "")} {String(rule.expected ?? "")})
                      </span>
                      <span className="font-caption text-caption text-on-surface-variant">
                        Actual: {String(rule.actual ?? "—")} {hint ? `• ${hint}` : ""}
                      </span>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${passed ? "bg-success-container text-on-success-container" : "bg-danger-container text-on-danger-container"}`}>
                      <Icon name={passed ? "check" : "close"} size={16} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Steps */}
        {steps.length > 0 && (
          <div className="mx-4">
            <div className="card p-4 space-y-2">
              <h3 className="font-title-sm text-on-surface font-semibold">
                <T gu="આગળના પગલાં" en="Next Steps" hi="अगले कदम" />
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-xs text-on-surface-variant">
                {steps.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Apply CTA */}
        <div className="mx-4">
          <Link
            href="/student/apply"
            className="w-full py-3 px-4 rounded-xl bg-primary text-on-primary font-label-lg font-semibold flex items-center justify-center gap-2 shadow-level-1"
          >
            <Icon name="bolt" size={18} />
            <T gu="અરજી કરવા આગળ વધો" en="Proceed to 1-Click Apply" hi="आवेदन करने के लिए आगे बढ़ें" />
          </Link>
        </div>
      </div>
    </StudentShell>
  );
}
