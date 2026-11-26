"use client";

import { useState } from "react";
import Link from "next/link";
import { StudentShell } from "@/components/shell/StudentShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { StatusChip } from "@/components/ui";
import { Skeleton } from "@/components/states/Skeleton";
import { ErrorState } from "@/components/states/ErrorState";
import { EmptyState } from "@/components/states/EmptyState";
import { ApiModeBadge } from "@/app/student/components/ApiModeBadge";
import { useApplications, useApplicationTimeline, useMe } from "@/lib/api/hooks";

type TabFilter = "all" | "active" | "completed" | "action";

function statusToChip(status: string): "approved" | "pending" | "rejected" | "inprogress" {
  if (["disbursed", "sanctioned", "deo_approved"].includes(status)) return "approved";
  if (status === "rejected") return "rejected";
  if (["school_verified", "taluka_approved"].includes(status)) return "inprogress";
  return "pending";
}

function ApplicationTimelineView({ appCode }: { appCode: string }) {
  const { data: events, isLoading, error, refetch } = useApplicationTimeline(appCode);
  if (isLoading) return <Skeleton rows={2} />;
  if (error) return <ErrorState error={error} onRetry={() => void refetch()} />;
  const list = Array.isArray(events) ? events : [];
  if (list.length === 0) {
    return (
      <p className="text-xs text-on-surface-variant py-2">
        <T gu="કોઈ ટાઇમલાઇન ઇવેન્ટ નથી" en="No timeline events recorded yet." hi="अभी कोई समयरेखा नहीं है।" />
      </p>
    );
  }
  return (
    <div className="mt-3 pt-3 border-t border-outline-variant space-y-2.5">
      {list.map((ev, idx) => (
        <div key={idx} className="flex items-start gap-2.5">
          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Icon name="check" size={12} className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-on-surface capitalize">
                {String(ev.stage ?? "").replace(/_/g, " ")}
              </span>
              <span className="text-[10px] text-on-surface-variant font-mono">
                {ev.at || ev.created_at ? new Date(String(ev.at ?? ev.created_at)).toLocaleDateString() : ""}
              </span>
            </div>
            {Boolean(ev.note) && <p className="text-[11px] text-on-surface-variant">{String(ev.note)}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ApplicationTrackerPage() {
  const { data: profile, isLoading: loadingProfile, error: profileError, refetch: refetchProfile } = useMe();
  const { data, isLoading, error, refetch } = useApplications();
  const [tab, setTab] = useState<TabFilter>("all");
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  if (isLoading || loadingProfile) {
    return (
      <StudentShell>
        <ApiModeBadge />
        <div className="p-4">
          <Skeleton rows={5} />
        </div>
      </StudentShell>
    );
  }

  if (error || profileError) {
    return (
      <StudentShell>
        <ApiModeBadge />
        <div className="p-4">
          <ErrorState error={error ?? profileError} onRetry={() => { void refetch(); void refetchProfile(); }} />
        </div>
      </StudentShell>
    );
  }

  const apps = data?.items ?? [];
  const filtered = apps.filter((a) => {
    if (tab === "all") return true;
    if (tab === "completed") return ["disbursed", "sanctioned"].includes(a.status);
    if (tab === "action") return ["correction_requested", "awaiting_consent", "rejected"].includes(a.status);
    return !["disbursed", "sanctioned", "rejected"].includes(a.status);
  });

  return (
    <StudentShell>
      <ApiModeBadge />
      <div className="px-4 py-3 space-y-4 pb-24">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              <T gu="અરજી ટ્રેકર" en="Application Tracker" hi="आवेदन ट्रैकर" />
            </h1>
            <p className="text-xs text-on-surface-variant font-mono">
              {profile?.name_en ?? ""} • {profile?.cts_id ?? ""}
            </p>
          </div>
          <Link href="/student/apply" className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold">
            + <T gu="નવી અરજી" en="Apply" hi="आवेदन" />
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(
            [
              { id: "all", gu: "બધી", en: "All", hi: "सभी" },
              { id: "active", gu: "સક્રિય", en: "Active", hi: "सक्रिय" },
              { id: "completed", gu: "પૂર્ણ", en: "Completed", hi: "पूर्ण" },
              { id: "action", gu: "પગલાં જરૂરી", en: "Action", hi: "कार्रवाई" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                tab === t.id
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-low text-on-surface-variant"
              }`}
            >
              <T gu={t.gu} en={t.en} hi={t.hi} />
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No applications found" description="Apply to eligible schemes to track them here." />
        ) : (
          <div className="space-y-3">
            {filtered.map((app) => {
              const isOpen = expandedCode === app.app_code;
              return (
                <div key={app.app_code} className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant shadow-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-mono text-primary font-semibold">{app.app_code}</p>
                      <h3 className="text-sm font-bold text-on-surface truncate">
                        {String(app.scheme_name_en ?? app.scheme_code)}
                      </h3>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">
                        {app.amount > 0 ? `₹${Number(app.amount).toLocaleString("en-IN")}` : "Free Bicycle"} •{" "}
                        {String(app.stage ?? app.status).replace(/_/g, " ")}
                      </p>
                    </div>
                    <StatusChip status={statusToChip(app.status)} label={app.status.replace(/_/g, " ")} />
                  </div>

                  <button
                    type="button"
                    onClick={() => setExpandedCode(isOpen ? null : app.app_code)}
                    className="mt-3 text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline"
                  >
                    <Icon name={isOpen ? "expand_less" : "timeline"} size={15} />
                    <T
                      gu={isOpen ? "ટાઇમલાઇન છુપાવો" : "ટાઇમલાઇન જુઓ"}
                      en={isOpen ? "Hide Timeline" : "View Timeline"}
                      hi={isOpen ? "समयरेखा छिपाएं" : "समयरेखा देखें"}
                    />
                  </button>

                  {isOpen && <ApplicationTimelineView appCode={app.app_code} />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </StudentShell>
  );
}
