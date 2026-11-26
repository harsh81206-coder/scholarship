"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { Avatar, StatusChip } from "@/components/ui";
import { Skeleton } from "@/components/states/Skeleton";
import { ErrorState } from "@/components/states/ErrorState";
import { useAppStore } from "@/lib/store";
import { useApplication, useApprove, useReject, useRequestCorrection } from "@/lib/api/hooks";

export default function SchoolQueueDetailPage() {
  const router = useRouter();
  const routeParams = useParams();
  const appCode = decodeURIComponent(String(routeParams?.id ?? ""));

  const showSuccess = useAppStore((s) => s.showSuccess);
  const showError = useAppStore((s) => s.showError);

  const { data: detail, isLoading, error, refetch } = useApplication(appCode);
  const approveMutation = useApprove();
  const rejectMutation = useReject();
  const correctionMutation = useRequestCorrection();

  const [remark, setRemark] = useState("");

  if (isLoading) {
    return (
      <OfficerShell role="school">
        <div className="p-6">
          <Skeleton rows={5} />
        </div>
      </OfficerShell>
    );
  }

  if (error || !detail) {
    return (
      <OfficerShell role="school">
        <div className="p-6">
          <ErrorState error={error ?? new Error("Application not found")} onRetry={() => void refetch()} />
        </div>
      </OfficerShell>
    );
  }

  const student = (detail.student ?? {}) as Record<string, unknown>;
  const scheme = (detail.scheme ?? {}) as Record<string, unknown>;
  const timeline = Array.isArray(detail.timeline) ? (detail.timeline as Array<Record<string, unknown>>) : [];
  const status = String(detail.status ?? "applied");
  const canSchoolReview = detail.route === "school" && status === "applied";

  async function handleApprove() {
    try {
      await approveMutation.mutateAsync({ code: appCode, remark: remark || "Verified by School Principal" });
      showSuccess(`Application ${appCode} approved`);
      router.push("/school/queue");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Approve failed");
    }
  }

  async function handleReject() {
    try {
      await rejectMutation.mutateAsync({ code: appCode, reason: remark || "Eligibility mismatch" });
      showSuccess(`Application ${appCode} rejected`);
      router.push("/school/queue");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Reject failed");
    }
  }

  async function handleCorrection() {
    try {
      await correctionMutation.mutateAsync({
        code: appCode,
        fields: ["income_certificate"],
        note: remark || "Please re-upload clear income certificate",
      });
      showSuccess(`Correction requested for ${appCode}`);
      router.push("/school/queue");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Correction request failed");
    }
  }

  return (
    <OfficerShell role="school">
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/school/queue" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
              <Icon name="arrow_back" size={20} />
            </Link>
            <div>
              <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                <T gu="અરજી સમીક્ષા વિગત" en="Application Review Detail" hi="आवेदन समीक्षा विवरण" />
              </h1>
              <p className="text-xs font-mono text-primary font-semibold">{appCode}</p>
            </div>
          </div>
          <StatusChip
            status={status === "rejected" ? "rejected" : status === "applied" ? "pending" : "approved"}
            label={status.replace(/_/g, " ")}
          />
        </div>

        {/* Student & Scheme Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Avatar name={String(student.name_en ?? "Student")} size="md" />
              <div>
                <h2 className="font-title-md font-bold text-on-surface">{String(student.name_en ?? "Student")}</h2>
                <p className="text-xs font-mono text-on-surface-variant">{String(student.cts_id ?? "")}</p>
              </div>
            </div>
          </div>

          <div className="card p-4 space-y-2">
            <p className="text-xs text-on-surface-variant uppercase font-semibold">Scheme & Benefit</p>
            <h2 className="font-title-md font-bold text-on-surface">{String(scheme.name_en ?? scheme.code ?? "")}</h2>
            <p className="text-sm font-bold text-primary">
              {Number(detail.amount ?? 0) > 0 ? `₹${Number(detail.amount).toLocaleString("en-IN")}` : "Free Bicycle"} • Route:{" "}
              {String(detail.route ?? "auto")} ({String(detail.risk_level ?? "low")} risk)
            </p>
          </div>
        </div>

        {/* Review Actions */}
        <div className="card p-4 space-y-4">
          <h3 className="font-title-sm font-bold text-on-surface">
            <T gu="ચકાસણી નિર્ણય" en="Verification Decision" hi="सत्यापन निर्णय" />
          </h3>
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            rows={2}
            placeholder="Add verification remark or correction note..."
            className="w-full rounded-xl border border-outline-variant bg-surface p-3 text-sm"
          />
          {canSchoolReview ? (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleApprove}
              disabled={approveMutation.isPending}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold flex items-center gap-1.5 hover:bg-emerald-700"
            >
              <Icon name="check_circle" size={18} />
              <T gu="મંજૂર કરો" en="Approve & Forward" hi="स्वीकृत करें" />
            </button>
            <button
              type="button"
              onClick={handleCorrection}
              disabled={correctionMutation.isPending}
              className="px-4 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-semibold flex items-center gap-1.5 hover:bg-amber-600"
            >
              <Icon name="edit_note" size={18} />
              <T gu="સુધારો માંગો" en="Request Correction" hi="सुधार का अनुरोध करें" />
            </button>
            <button
              type="button"
              onClick={handleReject}
              disabled={rejectMutation.isPending}
              className="px-4 py-2.5 rounded-xl bg-danger text-on-danger text-sm font-semibold flex items-center gap-1.5"
            >
              <Icon name="cancel" size={18} />
              <T gu="નામંજૂર" en="Reject" hi="अस्वीकार करें" />
            </button>
          </div>
          ) : (
            <p className="text-sm text-on-surface-variant">
              <T
                gu={`આ અરજી શાળાની સમીક્ષા માટે બાકી નથી. વર્તમાન રૂટ: ${String(detail.route ?? "unknown")}.`}
                en={`This application is not awaiting school review. Current route: ${String(detail.route ?? "unknown")}.`}
                hi={`यह आवेदन स्कूल समीक्षा के लिए लंबित नहीं है। वर्तमान रूट: ${String(detail.route ?? "unknown")}।`}
              />
            </p>
          )}
        </div>

        {/* Timeline */}
        {timeline.length > 0 && (
          <div className="card p-4 space-y-3">
            <h3 className="font-title-sm font-bold text-on-surface">Audit Timeline</h3>
            <div className="space-y-2">
              {timeline.map((ev, i) => (
                <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-surface-container-low">
                  <span className="font-semibold capitalize">{String(ev.stage ?? "").replace(/_/g, " ")}</span>
                  <span className="text-on-surface-variant">{String(ev.note ?? "")}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </OfficerShell>
  );
}
