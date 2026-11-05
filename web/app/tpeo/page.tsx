"use client";
import { useState } from "react";
import Link from "next/link";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { KpiCard, StatusChip, Avatar } from "@/components/ui";
import { useAppStore } from "@/lib/store";

const PENDING_APPS = [
  { id: "APP-GJ-2026-003891", student: "Harshil M. Prajapati", school: "Vinay Mandir HS, Khambhat", scheme: "Gyan Sadhna", amount: 12500, days: 6, risk: "low" },
  { id: "APP-GJ-2026-006233", student: "Kishan R. Parmar", school: "Sarvajanik HS, Anklav", scheme: "SEBC/OBC Post-Matric", amount: 15000, days: 9, risk: "medium" },
  { id: "APP-GJ-2026-007722", student: "Bhavik P. Makwana", school: "R.K. High School, Petlad", scheme: "SC/ST Post-Matric", amount: 18000, days: 14, risk: "low" },
];

export default function TpeoDashboardPage() {
  const { showSuccess } = useAppStore();
  const [approved, setApproved] = useState<string[]>([]);

  function handleQuickApprove(id: string) {
    setApproved((p) => [...p, id]);
    showSuccess(`APP ${id.slice(-6)} TPEO ✓ — forwarded to DEO queue`);
  }

  return (
    <OfficerShell role="tpeo">
      <div className="p-6 flex flex-col gap-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-widest">
              <T gu="તાલુકા પ્રાથ. શ. અ." en="Taluka Primary Education Officer" hi="तालुका प्राथमिक शिक्षा अधिकारी" />
            </p>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold mt-0.5">
              <T gu="TPEO ડૅ. — આ. ત." en="TPEO Dashboard — Anand Taluka" hi="TPEO डैशबोर्ड — आणंद तालुका" />
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              <T gu="Sh. RP • TPEO-AND-2026 • ₹10,000+ TPEO pre-approval" en="Shri Rameshbhai Patel • TPEO-AND-2026 • Apps above ₹10,000 require TPEO pre-approval" hi="श्री रमेशभाई पटेल • TPEO-AND-2026" />
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-warning-container border border-warning/30">
            <Icon name="hourglass_top" size={16} className="text-warning" />
            <span className="font-label-md text-label-md text-warning font-semibold">3 Pending</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          <KpiCard icon="pending_actions" label={<T gu="TPEO Pending" en="TPEO Pending" hi="TPEO Pending" />} value="3" sub="₹45,500 total" accent="text-warning" />
          <KpiCard icon="check_circle" label={<T gu="Cleared (Month)" en="TPEO Cleared (Month)" hi="TPEO Cleared" />} value="47" sub="↑ 12% vs last month" accent="text-success" />
          <KpiCard icon="currency_rupee" label={<T gu="Pending Amount" en="Pending Amount" hi="लंबित राशि" />} value="₹45,500" sub="3 high-value apps" />
          <KpiCard icon="school" label={<T gu="Taluka Schools" en="Taluka Schools" hi="तालुका स्कूल" />} value="28" sub="Anand Taluka" />
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: "fact_check", href: "/tpeo/approvals", labelEn: "Approval Queue", labelGu: "મ. ક.", descEn: "3 pending", badge: 3 },
            { icon: "school", href: "/tpeo/schools", labelEn: "School Oversight", labelGu: "શ. ન.", descEn: "28 schools", badge: 0 },
            { icon: "bar_chart", href: "/tpeo/reports", labelEn: "Reports", labelGu: "Rep.", descEn: "Oct 2026", badge: 0 },
          ].map((q) => (
            <Link key={q.href} href={q.href} className="card p-4 flex items-center gap-3 hover:shadow-level-2 hover:bg-primary/5 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-all">
                <Icon name={q.icon} size={24} className="text-primary group-hover:text-on-primary" />
              </div>
              <div className="flex-1">
                <p className="font-title-md text-title-md text-on-surface font-semibold">
                  <T gu={q.labelGu} en={q.labelEn} hi={q.labelEn} />
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{q.descEn}</p>
              </div>
              {q.badge > 0 && (
                <span className="w-6 h-6 rounded-full bg-warning text-on-warning text-[11px] font-bold flex items-center justify-center">{q.badge}</span>
              )}
            </Link>
          ))}
        </div>

        {/* Pending high-value applications */}
        <div className="card">
          <div className="flex items-center justify-between p-4 border-b border-outline-variant">
            <h2 className="font-title-lg text-title-lg text-on-surface font-semibold">
              <T gu="₹10,000+ — TPEO Clearance Pending" en="High-Value Apps Requiring TPEO Clearance" hi="₹10,000+ TPEO Clearance Pending" />
            </h2>
            <Link href="/tpeo/approvals" className="font-label-md text-label-md text-primary hover:underline flex items-center gap-1">
              <T gu="B. J." en="View All" hi="सभी देखें" /> <Icon name="arrow_forward" size={16} />
            </Link>
          </div>
          <div className="divide-y divide-outline-variant">
            {PENDING_APPS.map((app) => {
              const isApproved = approved.includes(app.id);
              return (
                <div key={app.id} className="flex items-center gap-4 p-4">
                  <Avatar name={app.student} />
                  <div className="flex-1 min-w-0">
                    <p className="font-label-lg text-label-lg text-on-surface font-semibold truncate">{app.student}</p>
                    <p className="font-caption text-caption text-on-surface-variant truncate">{app.school} · {app.scheme}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-title-md text-title-md text-primary font-bold">₹{app.amount.toLocaleString()}</p>
                    <p className="font-caption text-caption text-on-surface-variant">{app.days}d pending</p>
                  </div>
                  <StatusChip
                    status={isApproved ? "approved" : app.risk === "medium" ? "pending" : "inprogress"}
                    label={isApproved ? "TPEO Cleared" : app.risk === "medium" ? "Review" : "Eligible"}
                  />
                  {!isApproved ? (
                    <button onClick={() => handleQuickApprove(app.id)}
                      className="px-3 py-1.5 rounded-lg bg-success text-on-success font-label-md text-label-md hover:opacity-90 shrink-0 transition-opacity">
                      <T gu="TPEO ✓" en="TPEO Approve" hi="TPEO Approve" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 text-success font-label-md text-label-md shrink-0">
                      <Icon name="check_circle" size={18} fill /> DEO →
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Risk threshold info banner */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
          <Icon name="policy" size={20} className="text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-label-lg text-label-lg text-primary font-semibold">
              <T gu="TPEO Threshold Rule — GR No. SCH/2026/TPEO-11" en="TPEO Threshold Rule — GR No. SCH/2026/TPEO-11" hi="TPEO Threshold Rule" />
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              <T gu="₹10,000+ TPEO pre-clearance. DEO auto-routed." en="All disbursements above ₹10,000 require TPEO pre-clearance before DEO final approval. Auto-routed by system." hi="₹10,000 से अधिक सभी छात्रवृत्ति के लिए TPEO pre-clearance आवश्यक।" />
            </p>
          </div>
        </div>
      </div>
    </OfficerShell>
  );
}
