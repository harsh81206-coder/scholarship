"use client";

import React from "react";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { StatusChip } from "@/components/ui";
import { Skeleton } from "@/components/states/Skeleton";
import { ErrorState } from "@/components/states/ErrorState";
import { EmptyState } from "@/components/states/EmptyState";
import { useAppStore } from "@/lib/store";
import {
  useFundsOverview,
  useDbtReconciliation,
  useDbt,
  useApplications,
  useSanctionDbt,
  useInitiateDbt,
  useRetryDbt,
} from "@/lib/api/hooks";

export default function AdminFundTrackerPage() {
  const showSuccess = useAppStore((s) => s.showSuccess);
  const showError = useAppStore((s) => s.showError);

  const { data: overview, isLoading: loadingOverview, error: errorOverview, refetch } = useFundsOverview();
  const { data: recon, isLoading: loadingRecon, error: errorRecon, refetch: refetchRecon } = useDbtReconciliation();
  const { data: dbtData, isLoading: loadingDbt, error: errorDbt, refetch: refetchDbt } = useDbt();
  const { data: appsData, isLoading: loadingApps, error: errorApps, refetch: refetchApps } = useApplications();

  const sanctionDbt = useSanctionDbt();
  const initiateDbt = useInitiateDbt();
  const retryDbt = useRetryDbt();

  if (loadingOverview || loadingDbt || loadingApps || loadingRecon) {
    return (
      <OfficerShell role="admin">
        <div className="p-6">
          <Skeleton rows={6} />
        </div>
      </OfficerShell>
    );
  }

  const queryError = errorOverview ?? errorDbt ?? errorApps ?? errorRecon;
  if (queryError) {
    return (
      <OfficerShell role="admin">
        <div className="p-6">
          <ErrorState
            error={queryError}
            onRetry={() => void Promise.all([refetch(), refetchDbt(), refetchApps(), refetchRecon()])}
          />
        </div>
      </OfficerShell>
    );
  }

  const txns = dbtData?.items ?? [];
  const apps = appsData?.items ?? [];
  const deoApprovedCodes = apps.filter((a) => a.status === "deo_approved").map((a) => a.app_code);
  const sanctionedCodes = apps.filter((a) => a.status === "sanctioned").map((a) => a.app_code);

  async function handleSanctionAll() {
    if (deoApprovedCodes.length === 0) return;
    try {
      const res = await sanctionDbt.mutateAsync(deoApprovedCodes);
      showSuccess(`Sanctioned ${String(res.count ?? deoApprovedCodes.length)} application(s)`);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Sanction failed");
    }
  }

  async function handleInitiateAll() {
    if (sanctionedCodes.length === 0) return;
    try {
      const res = await initiateDbt.mutateAsync({ applicationIds: sanctionedCodes });
      showSuccess(`Initiated DBT for ${String(res.count ?? sanctionedCodes.length)} application(s)`);
      void refetchRecon();
    } catch (err) {
      showError(err instanceof Error ? err.message : "DBT initiate failed");
    }
  }

  async function handleRetry(id: number) {
    try {
      await retryDbt.mutateAsync(id);
      showSuccess(`Retried DBT transaction #${id}`);
      void refetchRecon();
    } catch (err) {
      showError(err instanceof Error ? err.message : "Retry failed");
    }
  }

  return (
    <OfficerShell role="admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              <T gu="ફંડ ટ્રેકર અને PFMS DBT" en="Fund Tracker & PFMS DBT Reconciliation" hi="फंड ट्रैकर और PFMS DBT" />
            </h1>
            <p className="text-sm text-on-surface-variant">
              Total Txns: {String(recon?.total_txns ?? txns.length)} • Credited: ₹
              {Number(recon?.total_credited ?? overview?.credited ?? 0).toLocaleString("en-IN")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {deoApprovedCodes.length > 0 && (
              <button
                type="button"
                onClick={handleSanctionAll}
                disabled={sanctionDbt.isPending}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold flex items-center gap-1.5"
              >
                <Icon name="verified" size={16} />
                Sanction Approved ({deoApprovedCodes.length})
              </button>
            )}
            {sanctionedCodes.length > 0 && (
              <button
                type="button"
                onClick={handleInitiateAll}
                disabled={initiateDbt.isPending}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Icon name="payments" size={16} />
                Initiate DBT ({sanctionedCodes.length})
              </button>
            )}
          </div>
        </div>

        {/* Overview KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Budget", value: Number(overview?.budget ?? overview?.allocated ?? 0) },
            { label: "Sanctioned", value: Number(overview?.sanctioned ?? overview?.released ?? 0) },
            { label: "Initiated", value: Number(overview?.initiated ?? 0) },
            { label: "Credited", value: Number(overview?.credited ?? overview?.utilized ?? 0) },
          ].map((k) => (
            <div key={k.label} className="card p-4">
              <p className="text-xs text-on-surface-variant">{k.label}</p>
              <p className="text-xl font-extrabold text-primary mt-1">₹ {k.value.toLocaleString("en-IN")}</p>
            </div>
          ))}
        </div>

        {/* DBT Transactions */}
        {txns.length === 0 ? (
          <EmptyState title="No DBT transactions yet" description="Sanction and initiate approved applications to create PFMS DBT transfers." />
        ) : (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-x-auto shadow-xs">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low text-xs font-semibold text-on-surface-variant">
                  <th className="p-3">PFMS Ref</th>
                  <th className="p-3">App Code</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">UTR</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant text-sm">
                {txns.map((t, i) => {
                  const id = Number(t.id ?? i);
                  const st = String(t.status ?? "initiated");
                  return (
                    <tr key={id} className="hover:bg-surface-container-low/50">
                      <td className="p-3 font-mono text-xs">#{id}</td>
                      <td className="p-3 font-mono text-xs text-primary">{String(t.app_code ?? "—")}</td>
                      <td className="p-3 font-semibold">₹ {Number(t.amount ?? 0).toLocaleString("en-IN")}</td>
                      <td className="p-3 font-mono text-xs">{String(t.utr ?? "—")}</td>
                      <td className="p-3">
                        <StatusChip
                          status={st === "credited" ? "approved" : st === "failed" ? "rejected" : "inprogress"}
                          label={st}
                        />
                      </td>
                      <td className="p-3 text-right">
                        {st === "failed" && (
                          <button
                            type="button"
                            onClick={() => handleRetry(id)}
                            disabled={retryDbt.isPending}
                            className="px-3 py-1 rounded-lg bg-secondary text-on-secondary text-xs font-semibold"
                          >
                            Retry
                          </button>
                        )}
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
