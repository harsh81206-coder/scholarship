"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { StatusChip, Avatar } from "@/components/ui";
import { Skeleton } from "@/components/states/Skeleton";
import { ErrorState } from "@/components/states/ErrorState";
import { EmptyState } from "@/components/states/EmptyState";
import { useAppStore } from "@/lib/store";
import { useApplications, useApprove, useBulkApprove } from "@/lib/api/hooks";
import type { ApplicationSummary } from "@/lib/api/resources";

const EMPTY_APPLICATIONS: ApplicationSummary[] = [];

function mapStatusChip(status: string): "approved" | "pending" | "rejected" | "inprogress" {
  if (["school_verified", "taluka_approved", "deo_approved", "sanctioned", "disbursed"].includes(status)) {
    return "approved";
  }
  if (status === "rejected") return "rejected";
  if (status === "correction_requested") return "inprogress";
  return "pending";
}

export default function SchoolQueuePage() {
  const showSuccess = useAppStore((s) => s.showSuccess);
  const showError = useAppStore((s) => s.showError);

  const { data, isLoading, error, refetch } = useApplications();
  const approveOne = useApprove();
  const bulkApprove = useBulkApprove();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  const apps = data?.items ?? EMPTY_APPLICATIONS;

  const filtered = useMemo(() => {
    return apps.filter((a) => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = String(a.student_name ?? "").toLowerCase().includes(q);
        const matchCode = String(a.app_code ?? "").toLowerCase().includes(q);
        const matchCts = String(a.student_cts_id ?? "").toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchCts) return false;
      }
      return true;
    });
  }, [apps, statusFilter, search]);

  if (isLoading) {
    return (
      <OfficerShell role="school">
        <div className="p-6">
          <Skeleton rows={6} />
        </div>
      </OfficerShell>
    );
  }

  if (error) {
    return (
      <OfficerShell role="school">
        <div className="p-6">
          <ErrorState error={error} onRetry={() => void refetch()} />
        </div>
      </OfficerShell>
    );
  }

  const schoolRouteApps = apps.filter((a) => a.route === "school");
  const pendingCount = schoolRouteApps.filter((a) => a.status === "applied").length;
  const verifiedCount = apps.filter((a) => a.status === "school_verified").length;

  function toggleSelect(code: string) {
    setSelectedCodes((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
  }

  async function handleQuickApprove(appCode: string) {
    try {
      await approveOne.mutateAsync({ code: appCode, remark: "Verified by School Officer" });
      showSuccess(`Approved ${appCode}`);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to approve");
    }
  }

  async function handleBulkApprove() {
    if (selectedCodes.length === 0) return;
    try {
      await bulkApprove.mutateAsync({ codes: selectedCodes, remark: "Bulk verified by School" });
      showSuccess(`Verified ${selectedCodes.length} application(s)`);
      setSelectedCodes([]);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Bulk approve failed");
    }
  }

  return (
    <OfficerShell role="school">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              <T gu="શાળા ચકાસણી કતાર" en="School Verification Queue" hi="स्कूल सत्यापन कतार" />
            </h1>
            <p className="text-sm text-on-surface-variant">
              <T
                gu={`કુલ ${apps.length} અરજીઓ • ${pendingCount} બાકી • ${verifiedCount} ચકાસાયેલ`}
                en={`${apps.length} total • ${pendingCount} pending review • ${verifiedCount} verified`}
                hi={`कुल ${apps.length} • ${pendingCount} लंबित • ${verifiedCount} सत्यापित`}
              />
            </p>
          </div>
          {selectedCodes.length > 0 && (
            <button
              type="button"
              onClick={handleBulkApprove}
              disabled={bulkApprove.isPending}
              className="px-4 py-2 rounded-xl bg-primary text-on-primary text-sm font-semibold flex items-center gap-2 shadow-sm"
            >
              <Icon name="done_all" size={18} />
              <T
                gu={`પસંદ કરેલ મંજૂર કરો (${selectedCodes.length})`}
                en={`Approve Selected (${selectedCodes.length})`}
                hi={`चयनित स्वीकृत करें (${selectedCodes.length})`}
              />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student name, CTS ID, or App Code..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-outline-variant bg-surface text-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["all", "applied", "school_verified", "rejected"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${
                  statusFilter === st ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant"
                }`}
              >
                {st.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <EmptyState title="No applications in queue" description="Applications matching your filters will appear here." />
        ) : (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-x-auto shadow-xs">
            <table className="w-full text-left border-collapse min-w-[780px]">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low text-xs font-semibold text-on-surface-variant">
                  <th className="p-3 w-10"></th>
                  <th className="p-3"><T gu="વિદ્યાર્થી" en="Student" hi="छात्र" /></th>
                  <th className="p-3"><T gu="અરજી ID" en="App Code" hi="आवेदन ID" /></th>
                  <th className="p-3"><T gu="યોજના" en="Scheme" hi="योजना" /></th>
                  <th className="p-3"><T gu="રકમ" en="Amount" hi="राशि" /></th>
                  <th className="p-3"><T gu="જોખમ / રૂટ" en="Risk / Route" hi="जोखिम" /></th>
                  <th className="p-3"><T gu="સ્થિતિ" en="Status" hi="स्थिति" /></th>
                  <th className="p-3 text-right"><T gu="પગલાં" en="Actions" hi="कार्रवाई" /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant text-sm">
                {filtered.map((app) => {
                  const studentName = String(app.student_name ?? "Student");
                  const canSchoolReview = app.route === "school" && app.status === "applied";
                  return (
                    <tr key={app.app_code} className="hover:bg-surface-container-low/50">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          disabled={!canSchoolReview}
                          checked={selectedCodes.includes(app.app_code)}
                          onChange={() => toggleSelect(app.app_code)}
                          className="w-4 h-4 accent-primary rounded disabled:opacity-30"
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={studentName} size="sm" />
                          <div>
                            <p className="font-semibold text-on-surface">{studentName}</p>
                            <p className="text-xs text-on-surface-variant font-mono">{String(app.student_cts_id ?? "")}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-xs text-primary font-semibold">{app.app_code}</td>
                      <td className="p-3 text-on-surface">{String(app.scheme_name_en ?? app.scheme_code)}</td>
                      <td className="p-3 font-semibold">
                        {app.amount > 0 ? `₹${Number(app.amount).toLocaleString("en-IN")}` : "Bicycle"}
                      </td>
                      <td className="p-3 text-xs">
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-high font-medium">
                          {String(app.risk_level ?? "low")} • {String(app.route ?? "auto")}
                        </span>
                      </td>
                      <td className="p-3">
                        <StatusChip status={mapStatusChip(app.status)} label={app.status.replace(/_/g, " ")} />
                      </td>
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          {canSchoolReview && (
                            <button
                              type="button"
                              onClick={() => handleQuickApprove(app.app_code)}
                              disabled={approveOne.isPending}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                            >
                              <T gu="મંજૂર" en="Approve" hi="स्वीकृत" />
                            </button>
                          )}
                          <Link
                            href={`/school/queue/${encodeURIComponent(app.app_code)}`}
                            className="px-2.5 py-1 rounded-lg bg-surface-container text-primary text-xs font-semibold hover:bg-surface-container-high"
                          >
                            <T gu="સમીક્ષા" en="Review" hi="समीक्षा" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </OfficerShell>
  );
}
