"use client";

import React, { useState, useMemo } from "react";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { StatusChip, Avatar } from "@/components/ui";
import { Skeleton } from "@/components/states/Skeleton";
import { ErrorState } from "@/components/states/ErrorState";
import { EmptyState } from "@/components/states/EmptyState";
import { useAppStore } from "@/lib/store";
import { localizedName } from "@/lib/i18n";
import { useApplications, useBulkApprove, useCreateDelegation, useDelegations } from "@/lib/api/hooks";
import type { ApplicationSummary } from "@/lib/api/resources";

const EMPTY_APPLICATIONS: ApplicationSummary[] = [];

type RouteTab = "all" | "auto" | "taluka" | "deo";

export default function DeOApprovalsPage() {
  const lang = useAppStore((s) => s.lang);
  const showSuccess = useAppStore((s) => s.showSuccess);
  const showError = useAppStore((s) => s.showError);

  const { data, isLoading, error, refetch } = useApplications();
  const { data: delegations } = useDelegations();
  const bulkApprove = useBulkApprove();
  const createDelegation = useCreateDelegation();

  const [routeTab, setRouteTab] = useState<RouteTab>("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [remark, setRemark] = useState("Approved by DEO Anand");
  const [delegateToUserId, setDelegateToUserId] = useState("2");

  const apps = data?.items ?? EMPTY_APPLICATIONS;

  const filtered = useMemo(() => {
    return apps.filter((a) => {
      if (routeTab !== "all" && String(a.route ?? "auto") !== routeTab) return false;
      return true;
    });
  }, [apps, routeTab]);

  if (isLoading) {
    return (
      <OfficerShell role="deo">
        <div className="p-6">
          <Skeleton rows={6} />
        </div>
      </OfficerShell>
    );
  }

  if (error) {
    return (
      <OfficerShell role="deo">
        <div className="p-6">
          <ErrorState error={error} onRetry={() => void refetch()} />
        </div>
      </OfficerShell>
    );
  }

  const approvable = filtered.filter((a) => a.route === "deo" && ["school_verified", "taluka_approved"].includes(a.status));

  function toggleSelect(code: string) {
    setSelected((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
  }

  function selectAllApprovable() {
    setSelected(approvable.map((a) => a.app_code));
  }

  async function handleBulkApprove() {
    if (selected.length === 0) return;
    try {
      const res = await bulkApprove.mutateAsync({ codes: selected, remark });
      const count = Number(res.count ?? selected.length);
      const skipped = Number(res.skipped_count ?? 0);
      showSuccess(`DEO Approved ${count} application(s)${skipped > 0 ? ` (${skipped} skipped)` : ""}`);
      setSelected([]);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Bulk approve failed");
    }
  }

  async function handleDelegate() {
    if (selected.length === 0) return;
    const recipientId = Number(delegateToUserId);
    if (!Number.isInteger(recipientId) || recipientId < 1) {
      showError("Enter a valid officer user ID");
      return;
    }
    try {
      const result = await createDelegation.mutateAsync({ to_user_id: recipientId, application_ids: selected });
      showSuccess(`Delegated ${Array.isArray(result.application_ids) ? result.application_ids.length : selected.length} application(s)`);
      setSelected([]);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Delegation failed");
    }
  }

  return (
    <OfficerShell role="deo">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              <T gu="DEO બલ્ક મંજૂરી" en="DEO Bulk Approvals & Risk Routing" hi="DEO थोक अनुमोदन" />
            </h1>
            <p className="text-sm text-on-surface-variant">
              {apps.length} total applications • {approvable.length} ready for DEO approval • {(delegations ?? []).length} active delegations
            </p>
          </div>
          <div className="flex items-center gap-2">
            {approvable.length > 0 && (
              <button
                type="button"
                onClick={selectAllApprovable}
                className="px-3 py-2 rounded-xl border border-outline-variant text-xs font-semibold hover:bg-surface-container-low"
              >
                <T gu="બધી પસંદ કરો" en={`Select Ready (${approvable.length})`} hi="सभी चुनें" />
              </button>
            )}
            <button
              type="button"
              onClick={handleBulkApprove}
              disabled={selected.length === 0 || bulkApprove.isPending}
              className="px-4 py-2 rounded-xl bg-primary disabled:opacity-50 text-on-primary text-sm font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Icon name="done_all" size={18} />
              <T
                gu={`મંજૂર કરો (${selected.length})`}
                en={`Bulk Approve (${selected.length})`}
                hi={`स्वीकृत करें (${selected.length})`}
              />
            </button>
          </div>
        </div>

        {/* Route Tabs + Remark */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2 flex-wrap">
            {(
              [
                { id: "all", label: <T gu="બધા રૂટ" en="All Routes" hi="सभी रूट" /> },
                { id: "auto", label: <T gu="ઓટો / ઓછું જોખમ" en="Auto / Low Risk" hi="ऑटो / कम जोखिम" /> },
                { id: "taluka", label: <T gu="તાલુકા એસ્કેલેટેડ" en="Taluka Escalated" hi="तालुका स्तर पर भेजा" /> },
                { id: "deo", label: <T gu="DEO ઊંચું જોખમ" en="DEO High Risk" hi="DEO उच्च जोखिम" /> },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setRouteTab(t.id);
                  setSelected([]);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                  routeTab === t.id ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant"
                }`}
              >
              {t.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Approval remark..."
            className="px-3 py-1.5 rounded-xl border border-outline-variant bg-surface text-xs min-w-[220px]"
          />
          <div className="flex items-center gap-2">
            <label htmlFor="delegate-user-id" className="text-xs text-on-surface-variant">
              <T gu="વપરાશકર્તા ID ને સોંપો" en="Delegate to user ID" hi="उपयोगकर्ता ID को सौंपें" />
            </label>
            <input
              id="delegate-user-id"
              type="number"
              min={1}
              value={delegateToUserId}
              onChange={(event) => setDelegateToUserId(event.target.value)}
              className="w-24 px-2 py-1.5 rounded-xl border border-outline-variant bg-surface text-xs"
            />
            <button
              type="button"
              onClick={handleDelegate}
              disabled={selected.length === 0 || createDelegation.isPending}
              className="px-3 py-1.5 rounded-xl border border-outline-variant text-xs font-semibold disabled:opacity-50"
            >
              <T gu="પસંદ કરેલ સોંપો" en="Delegate Selected" hi="चयनित सौंपें" />
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No applications in this route" description="Applications routed to this tier will appear here." />
        ) : (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-x-auto shadow-xs">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low text-xs font-semibold text-on-surface-variant">
                  <th className="p-3 w-10"></th>
                  <th className="p-3">Student</th>
                  <th className="p-3">App Code</th>
                  <th className="p-3">Scheme</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Route / Risk</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant text-sm">
                {filtered.map((app) => {
                  const canApprove = app.route === "deo" && ["school_verified", "taluka_approved"].includes(app.status);
                  return (
                    <tr key={app.app_code} className="hover:bg-surface-container-low/50">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          disabled={!canApprove}
                          checked={selected.includes(app.app_code)}
                          onChange={() => toggleSelect(app.app_code)}
                          className="w-4 h-4 accent-primary rounded disabled:opacity-30"
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={String(app.student_name ?? "Student")} size="sm" />
                          <div>
                            <p className="font-semibold text-on-surface">{String(app.student_name ?? "Student")}</p>
                            <p className="text-xs font-mono text-on-surface-variant">{String(app.student_cts_id ?? "")}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-xs text-primary font-semibold">{app.app_code}</td>
                      <td className="p-3">{localizedName({
                        name_en: app.scheme_name_en ?? app.scheme_code,
                        name_gu: app.scheme_name_gu,
                        name_hi: app.scheme_name_hi,
                      }, lang)}</td>
                      <td className="p-3 font-semibold">
                        {app.amount > 0 ? `₹${Number(app.amount).toLocaleString("en-IN")}` : "Bicycle"}
                      </td>
                      <td className="p-3 text-xs">
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-high font-medium">
                          {String(app.route ?? "auto")} ({String(app.risk_level ?? "low")})
                        </span>
                      </td>
                      <td className="p-3">
                        <StatusChip
                          status={
                            ["deo_approved", "sanctioned", "disbursed"].includes(app.status)
                              ? "approved"
                              : app.status === "rejected"
                              ? "rejected"
                              : "inprogress"
                          }
                          label={app.status.replace(/_/g, " ")}
                        />
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
