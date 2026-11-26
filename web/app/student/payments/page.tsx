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
import { usePayments, useMe, useReceipt } from "@/lib/api/hooks";
import { useAppStore } from "@/lib/store";

type FilterTab = "all" | "credited" | "inprogress" | "failed";

export default function StudentPaymentsPage() {
  const showError = useAppStore((s) => s.showError);
  const { data: profile, isLoading: loadingProfile, error: profileError, refetch: refetchProfile } = useMe();
  const { data, isLoading, error, refetch } = usePayments();
  const receipt = useReceipt();
  const [filter, setFilter] = useState<FilterTab>("all");

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

  const totalCredited = Number(data?.total_credited ?? 0);
  const txns = Array.isArray(data?.transactions) ? (data.transactions as Array<Record<string, unknown>>) : [];
  const bank = (profile?.bank ?? {}) as Record<string, unknown>;

  async function downloadReceipt(txnId: number) {
    try {
      const result = await receipt.mutateAsync(txnId);
      const file = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = `payment-receipt-${txnId}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (downloadError) {
      showError(downloadError instanceof Error ? downloadError.message : "Could not download receipt");
    }
  }

  const filtered = txns.filter((t) => {
    const st = String(t.status ?? "").toLowerCase();
    if (filter === "all") return true;
    if (filter === "credited") return st === "credited";
    if (filter === "failed") return st === "failed";
    return st !== "credited" && st !== "failed";
  });

  return (
    <StudentShell>
      <ApiModeBadge />
      <div className="px-4 py-3 space-y-4 pb-24">
        <div className="flex items-center gap-3">
          <Link href="/student" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
            <Icon name="arrow_back" size={20} />
          </Link>
          <div>
            <h1 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              <T gu="DBT ચૂકવણી અને બેંક" en="DBT Payments & Bank" hi="DBT भुगतान और बैंक" />
            </h1>
            <p className="text-xs text-on-surface-variant font-mono">{profile?.cts_id ?? ""}</p>
          </div>
        </div>

        {/* Summary Card */}
        <section className="rounded-2xl p-4 bg-gradient-to-br from-emerald-700 to-emerald-900 text-white shadow-level-2 space-y-2">
          <p className="text-xs text-emerald-100">
            <T gu="કુલ DBT જમા રકમ" en="Total Credited via PFMS DBT" hi="PFMS DBT द्वारा कुल जमा" />
          </p>
          <p className="text-2xl font-extrabold">₹ {totalCredited.toLocaleString("en-IN")}</p>
          <div className="pt-2 border-t border-white/20 text-xs flex items-center justify-between">
            <span>
              {bank.bank_name || bank.last4
                ? `${String(bank.bank_name ?? "Bank")} •••• ${String(bank.last4 ?? "—")}`
                : <T gu="બેંક વિગતો ઉપલબ્ધ નથી" en="Bank details unavailable" hi="बैंक विवरण उपलब्ध नहीं" />}
            </span>
            {typeof bank.aadhaar_seeded === "boolean" && <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-semibold">
              {bank.aadhaar_seeded ? "Aadhaar Seeded ✓" : "Pending KYC"}
            </span>}
          </div>
        </section>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(
            [
              { id: "all", gu: "બધા", en: "All", hi: "सभी" },
              { id: "credited", gu: "જમા", en: "Credited", hi: "जमा" },
              { id: "inprogress", gu: "પ્રક્રિયામાં", en: "In Progress", hi: "प्रगति में" },
              { id: "failed", gu: "નિષ્ફળ", en: "Failed", hi: "विफल" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setFilter(t.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 ${
                filter === t.id ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant"
              }`}
            >
              <T gu={t.gu} en={t.en} hi={t.hi} />
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No transactions yet" description="Sanctioned scholarship payments will appear here." />
        ) : (
          <div className="space-y-3">
            {filtered.map((txn, idx) => {
              const st = String(txn.status ?? "initiated").toLowerCase();
              const chipStatus = st === "credited" ? "approved" : st === "failed" ? "rejected" : "inprogress";
              return (
                <div key={String(txn.id ?? idx)} className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant shadow-xs space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-mono text-primary font-semibold">{String(txn.app_code ?? txn.pfms_ref ?? txn.utr_no ?? txn.id ?? "Payment")}</p>
                      <h3 className="text-sm font-bold text-on-surface">
                        {String(txn.scheme_name_en ?? txn.scheme_name ?? txn.scheme_code ?? "DBT Payment")}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-emerald-700">
                        + ₹ {Number(txn.amount ?? 0).toLocaleString("en-IN")}
                      </p>
                      <StatusChip status={chipStatus} label={st} />
                    </div>
                  </div>
                  <div className="text-[11px] text-on-surface-variant flex flex-wrap gap-x-4 gap-y-1 pt-1 border-t border-surface-container-low font-mono">
                    {Boolean(txn.utr_no) && <span>UTR: {String(txn.utr_no)}</span>}
                    {Boolean(txn.pfms_ref) && <span>PFMS: {String(txn.pfms_ref)}</span>}
                  </div>
                  {Number.isInteger(Number(txn.id)) && Number(txn.id) > 0 && (
                    <button type="button" onClick={() => void downloadReceipt(Number(txn.id))} disabled={receipt.isPending} className="text-xs font-semibold text-primary hover:underline disabled:opacity-50">
                      <T gu="રસીદ ડાઉનલોડ કરો" en="Download receipt" hi="रसीद डाउनलोड करें" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </StudentShell>
  );
}
