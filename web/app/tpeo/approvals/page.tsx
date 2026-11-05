"use client";
import { useState } from "react";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { StatusChip, Avatar } from "@/components/ui";
import { useAppStore } from "@/lib/store";

type AppStatus = "pending" | "approved" | "rejected" | "returned" | "inprogress";
type RiskLevel = "low" | "medium" | "high";

interface TpeoApp {
  id: string;
  student: string;
  studentGu: string;
  ctsId: string;
  school: string;
  taluka: string;
  scheme: string;
  amount: number;
  daysPending: number;
  status: AppStatus;
  risk: RiskLevel;
  riskScore: number;
  attendancePct: number;
  incomeVerified: boolean;
  incomeAmt: number;
  principalCertified: boolean;
  remark: string;
}

const INITIAL: TpeoApp[] = [
  {
    id: "APP-GJ-2026-003891", student: "Harshil Maheshbhai Prajapati", studentGu: "હ. મ. પ.",
    ctsId: "GJ-AND-2026-003891", school: "Vinay Mandir High School, Khambhat",
    taluka: "Khambhat", scheme: "Gyan Sadhna Scholarship", amount: 12500, daysPending: 6,
    status: "pending", risk: "low", riskScore: 0.5, attendancePct: 88, incomeVerified: true,
    incomeAmt: 95000, principalCertified: true, remark: "",
  },
  {
    id: "APP-GJ-2026-006233", student: "Kishan Rameshbhai Parmar", studentGu: "ક. ર. પ.",
    ctsId: "GJ-AND-2026-006233", school: "Sarvajanik High School, Anklav",
    taluka: "Anklav", scheme: "Post-Matric SEBC/OBC", amount: 15000, daysPending: 9,
    status: "pending", risk: "medium", riskScore: 1.1, attendancePct: 76, incomeVerified: true,
    incomeAmt: 110000, principalCertified: true, remark: "",
  },
  {
    id: "APP-GJ-2026-007722", student: "Bhavik Pravinbhai Makwana", studentGu: "ભ. પ. મ.",
    ctsId: "GJ-AND-2026-007722", school: "R.K. High School, Petlad",
    taluka: "Petlad", scheme: "Post-Matric SC/ST Scholarship", amount: 18000, daysPending: 14,
    status: "inprogress", risk: "low", riskScore: 0.8, attendancePct: 81, incomeVerified: true,
    incomeAmt: 140000, principalCertified: true, remark: "",
  },
  {
    id: "APP-GJ-2026-001099", student: "Disha Bharatbhai Joshi", studentGu: "દ. ભ. જ.",
    ctsId: "GJ-AND-2026-001099", school: "Shri Vallabh Kanya Vidyalaya, Borsad",
    taluka: "Borsad", scheme: "Namo Lakshmi Yojana", amount: 10000, daysPending: 4,
    status: "approved", risk: "low", riskScore: 0.3, attendancePct: 94, incomeVerified: true,
    incomeAmt: 80000, principalCertified: true, remark: "TPEO Cleared.",
  },
];

const RISK_COLOR: Record<RiskLevel, string> = {
  low: "text-success",
  medium: "text-warning",
  high: "text-danger",
};

function chipStatus(s: AppStatus): "approved" | "rejected" | "pending" | "inprogress" {
  if (s === "returned") return "inprogress";
  return s;
}

export default function TpeoApprovalsPage() {
  const { showSuccess, showError } = useAppStore();
  const [apps, setApps] = useState<TpeoApp[]>(INITIAL);
  const [selected, setSelected] = useState<string | null>(null);
  const [remark, setRemark] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  function update(id: string, status: AppStatus, note = "") {
    setApps((p) => p.map((a) => a.id === id ? { ...a, status, remark: note } : a));
    setSelected(null);
    setRemark("");
  }

  function approve(id: string) {
    update(id, "approved", remark || "TPEO Clearance granted. Forwarded to DEO.");
    showSuccess(`APP ${id.slice(-6)} TPEO ✓ — Forwarded to DEO queue`);
  }

  function rejectApp(id: string) {
    if (!remark.trim()) { showError("Rejection requires a remark."); return; }
    update(id, "rejected", remark);
    showError(`APP ${id.slice(-6)} returned — ${remark.slice(0, 40)}`);
  }

  function returnToSchool(id: string) {
    update(id, "returned", remark || "Return to school for correction.");
    showSuccess(`APP ${id.slice(-6)} returned to school for correction.`);
  }

  const filtered = filter === "all" ? apps : apps.filter((a) => a.status === filter);
  const pendingCount = apps.filter((a) => a.status === "pending" || a.status === "inprogress").length;
  const totalAmt = apps.filter((a) => a.status === "pending").reduce((s, a) => s + a.amount, 0);

  return (
    <OfficerShell role="tpeo">
      <div className="p-6 flex flex-col gap-5 max-w-5xl">
        {/* Header */}
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
            <T gu="TPEO મ. ક." en="TPEO Approval Queue" hi="TPEO अनुमोदन कतार" />
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            <T gu="₹10,000+ — TPEO pre-approval" en="Applications above ₹10,000 requiring TPEO pre-approval before DEO" hi="₹10,000+ TPEO pre-approval आवश्यक" />
          </p>
        </div>

        {/* Summary bar */}
        <div className="flex items-center gap-4 p-3 rounded-xl bg-warning-container border border-warning/30 flex-wrap">
          <Icon name="hourglass_top" size={20} className="text-warning" />
          <span className="font-label-lg text-label-lg text-warning font-semibold">
            {pendingCount} <T gu="Pending TPEO Clearance" en="Pending TPEO Clearance" hi="Pending" />
          </span>
          <span className="text-on-surface-variant mx-1">·</span>
          <span className="font-title-md text-title-md text-on-surface font-bold">₹{totalAmt.toLocaleString()}</span>
          <span className="font-caption text-caption text-on-surface-variant ml-auto">
            Threshold: ₹10,000 · GR SCH/2026/TPEO-11
          </span>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {(["all", "pending", "approved"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full font-label-md text-label-md transition-colors ${filter === f ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface hover:bg-surface-container-high"}`}>
              {f === "all" ? <T gu="B." en="All" hi="सभी" /> : f === "pending" ? "Pending" : "Cleared"}
              {f === "pending" && pendingCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-warning text-on-warning text-[10px] font-bold">{pendingCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Application cards */}
        <div className="flex flex-col gap-3">
          {filtered.map((app) => (
            <div key={app.id} className={`card overflow-hidden transition-shadow ${selected === app.id ? "ring-2 ring-primary" : ""}`}>
              {/* Card header row */}
              <div className="flex items-start gap-4 p-4 cursor-pointer select-none"
                onClick={() => setSelected(selected === app.id ? null : app.id)}>
                <Avatar name={app.student} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-title-md text-title-md text-on-surface font-semibold">
                      <T gu={app.studentGu} en={app.student} hi={app.student} />
                    </span>
                    <StatusChip status={chipStatus(app.status)}
                      label={app.status === "inprogress" ? "In Review" : app.status === "returned" ? "Returned" : app.status.charAt(0).toUpperCase() + app.status.slice(1)} />
                    <span className={`font-label-md text-label-md font-semibold ${RISK_COLOR[app.risk]}`}>
                      Risk {app.riskScore.toFixed(1)}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 truncate">
                    {app.school} · {app.scheme}
                  </p>
                  <div className="flex items-center gap-4 mt-1 font-caption text-caption text-on-surface-variant flex-wrap">
                    <span className="font-mono">{app.ctsId}</span>
                    <span className="flex items-center gap-1"><Icon name="schedule" size={12} /> {app.daysPending}d pending</span>
                    <span className="flex items-center gap-1"><Icon name="trending_up" size={12} /> {app.attendancePct}% att.</span>
                    <span className="flex items-center gap-1"><Icon name="currency_rupee" size={12} /> ₹{app.incomeAmt.toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-headline-sm text-headline-sm text-primary font-bold">₹{app.amount.toLocaleString()}</p>
                  <p className="font-caption text-caption text-on-surface-variant">{app.taluka}</p>
                </div>
                <Icon name={selected === app.id ? "expand_less" : "expand_more"} size={20} className="text-on-surface-variant shrink-0 mt-1" />
              </div>

              {/* Expanded eligibility + actions */}
              {selected === app.id && (
                <div className="border-t border-outline-variant bg-surface-container-lowest p-4 flex flex-col gap-4"
                  onClick={(e) => e.stopPropagation()}>
                  {/* Eligibility checklist */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "School Principal Certified", ok: app.principalCertified },
                      { label: "Income Verified", ok: app.incomeVerified },
                      { label: `Attendance ≥ 75% (${app.attendancePct}%)`, ok: app.attendancePct >= 75 },
                      { label: `Risk Score < 3.0 (${app.riskScore})`, ok: app.riskScore < 3.0 },
                    ].map((c) => (
                      <div key={c.label} className="flex items-center gap-2 font-body-sm text-body-sm">
                        <Icon name={c.ok ? "check_circle" : "cancel"} size={16} className={c.ok ? "text-success" : "text-danger"} fill />
                        <span className={c.ok ? "text-on-surface" : "text-danger"}>{c.label}</span>
                      </div>
                    ))}
                  </div>

                  {app.status === "pending" || app.status === "inprogress" ? (
                    <>
                      <textarea
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        placeholder="TPEO remark (required for rejection)…"
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg bg-surface-container border border-outline-variant text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => approve(app.id)}
                          className="flex-1 py-2 rounded-xl bg-success text-on-success font-label-lg text-label-lg font-semibold hover:opacity-90 transition-opacity">
                          <T gu="TPEO ✓ → DEO" en="TPEO Approve → Forward to DEO" hi="TPEO Approve → DEO" />
                        </button>
                        <button onClick={() => returnToSchool(app.id)}
                          className="px-4 py-2 rounded-xl bg-warning text-on-warning font-label-lg text-label-lg font-semibold hover:opacity-90 transition-opacity">
                          <T gu="S. Return" en="Return to School" hi="School Return" />
                        </button>
                        <button onClick={() => rejectApp(app.id)}
                          className="px-4 py-2 rounded-xl bg-danger text-on-danger font-label-lg text-label-lg font-semibold hover:opacity-90 transition-opacity">
                          <T gu="Reject" en="Reject" hi="अस्वीकृत" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                      <Icon name={app.status === "approved" ? "check_circle" : "cancel"} size={16}
                        className={app.status === "approved" ? "text-success" : "text-danger"} fill />
                      {app.remark || (app.status === "approved" ? "TPEO Cleared → DEO" : "Returned/Rejected")}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </OfficerShell>
  );
}
