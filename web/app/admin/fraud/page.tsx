"use client";
import { useState } from "react";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { StatusChip } from "@/components/ui";

type RiskLevel = "high" | "medium" | "low";

interface Anomaly {
  id: string;
  type: string;
  typeGu: string;
  riskScore: number;
  riskLevel: RiskLevel;
  studentName: string;
  district: string;
  amount: number;
  appId: string;
  description: string;
  status: "open" | "investigating" | "dismissed" | "escalated";
}

const ANOMALIES: Anomaly[] = [
  { id: "FRD-001", type: "Duplicate Aadhaar", typeGu: "ડ. આ.", riskScore: 94, riskLevel: "high", studentName: "Unknown A", district: "Vadodara", amount: 50000, appId: "APP-2026-04812", description: "Same Aadhaar UID linked to 3 different CTS IDs in Vadodara district.", status: "open" },
  { id: "FRD-002", type: "Ghost Beneficiary", typeGu: "G. B.", riskScore: 88, riskLevel: "high", studentName: "Unknown B", district: "Surat", amount: 50000, appId: "APP-2026-04733", description: "Student not found in school attendance records for 6 months but DBT active.", status: "investigating" },
  { id: "FRD-003", type: "Inflated Income", typeGu: "I. I.", riskScore: 72, riskLevel: "medium", studentName: "Rahul P.", district: "Ahmedabad", amount: 10000, appId: "APP-2026-04691", description: "Income certificate shows ₹95,000 but ITR data shows ₹3.4 lakh for same family.", status: "open" },
  { id: "FRD-004", type: "Attendance Mismatch", typeGu: "A. M.", riskScore: 65, riskLevel: "medium", studentName: "Priya S.", district: "Anand", amount: 10000, appId: "APP-2026-04520", description: "School reports 92% attendance but biometric data shows only 51% presence.", status: "open" },
  { id: "FRD-005", type: "Bank Fraud", typeGu: "B. F.", riskScore: 41, riskLevel: "low", studentName: "Anjali M.", district: "Gandhinagar", amount: 12000, appId: "APP-2026-04111", description: "Bank account changed 3 times in 30 days prior to DBT credit. NPCI flagged.", status: "dismissed" },
];

const RISK_COLOR: Record<RiskLevel, string> = {
  high: "text-danger bg-danger-container",
  medium: "text-warning bg-warning-container",
  low: "text-success bg-success-container",
};

const RISK_STATUS: Record<RiskLevel, "rejected" | "pending" | "approved"> = {
  high: "rejected",
  medium: "pending",
  low: "approved",
};

const MONTHLY_RISK = [
  { month: "Apr", count: 4 }, { month: "May", count: 7 }, { month: "Jun", count: 5 },
  { month: "Jul", count: 9 }, { month: "Aug", count: 12 }, { month: "Sep", count: 8 },
  { month: "Oct", count: 11 }, { month: "Nov", count: 6 },
];
const maxCount = Math.max(...MONTHLY_RISK.map((m) => m.count));

export default function FraudDetectionPage() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>(ANOMALIES);
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | RiskLevel>("all");

  function updateStatus(id: string, status: Anomaly["status"]) {
    setAnomalies((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
  }

  const filtered = filter === "all" ? anomalies : anomalies.filter((a) => a.riskLevel === filter);
  const high = anomalies.filter((a) => a.riskLevel === "high").length;
  const medium = anomalies.filter((a) => a.riskLevel === "medium").length;
  // const selectedAnomaly = anomalies.find((a) => a.id === selected);

  return (
    <OfficerShell role="admin">
      <div className="p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
              <T gu="છેતરપિંડી & અસંગતતા" en="Fraud & Anomaly Detection" hi="धोखाधड़ी और अनियमितता" />
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              <T gu="AI-powered realtime fraud detection • Gujarat DBT Shield" en="AI-powered real-time fraud detection • Gujarat DBT Shield" hi="AI-powered रियल-टाइम धोखाधड़ी पहचान" />
            </p>
          </div>
          <div className="flex items-center gap-2 text-success font-label-md text-label-md">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <T gu="AI Shield Active" en="AI Shield Active" hi="AI Shield सक्रिय" />
          </div>
        </div>

        {/* KPI summary */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: { gu: "ઉચ્ચ જોખમ", en: "High Risk", hi: "उच्च जोखिम" }, val: high, color: "bg-danger-container text-danger", icon: "dangerous" },
            { label: { gu: "મધ્યમ જોખમ", en: "Medium Risk", hi: "मध्यम जोखिम" }, val: medium, color: "bg-warning-container text-warning", icon: "warning" },
            { label: { gu: "ઉ. ફ્લૅ. (આ.)", en: "Flagged This Month", hi: "इस महीने फ्लैग" }, val: 12, color: "bg-surface-container text-on-surface", icon: "flag" },
            { label: { gu: "DBT બ.", en: "DBT Blocked", hi: "DBT अवरुद्ध" }, val: 3, color: "bg-surface-container text-primary", icon: "block" },
          ].map((k, i) => (
            <div key={i} className={`card p-4 ${k.color}`}>
              <div className="flex items-center gap-2 mb-1">
                <Icon name={k.icon} size={20} />
                <span className="font-label-lg text-label-lg font-semibold"><T gu={k.label.gu} en={k.label.en} hi={k.label.hi} /></span>
              </div>
              <p className="font-headline-lg text-headline-lg font-bold">{k.val}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Anomaly list */}
          <div className="col-span-7 flex flex-col gap-4">
            {/* Filter */}
            <div className="flex items-center gap-2">
              {(["all", "high", "medium", "low"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-full font-label-md text-label-md transition-colors ${filter === f ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface hover:bg-surface-container-high"}`}
                >
                  {f === "all" ? <T gu="બધા" en="All" hi="सभी" /> : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
              <span className="ml-auto font-caption text-caption text-on-surface-variant">{filtered.length} <T gu="ફ્લૅ." en="flagged" hi="फ्लैग" /></span>
            </div>

            {filtered.map((anomaly) => (
              <div
                key={anomaly.id}
                onClick={() => setSelected(selected === anomaly.id ? null : anomaly.id)}
                className={`card p-4 cursor-pointer transition-all hover:shadow-level-2 ${selected === anomaly.id ? "ring-2 ring-primary" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-headline-sm font-bold shrink-0 ${RISK_COLOR[anomaly.riskLevel]}`}>
                    {anomaly.riskScore}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-title-md text-title-md text-on-surface font-semibold">{anomaly.type}</span>
                      <StatusChip status={RISK_STATUS[anomaly.riskLevel]} label={anomaly.riskLevel.toUpperCase()} />
                      <span className="font-caption text-caption text-on-surface-variant ml-auto">{anomaly.id}</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-snug">{anomaly.description}</p>
                    <div className="flex items-center gap-4 mt-2 font-caption text-caption text-on-surface-variant">
                      <span className="flex items-center gap-1"><Icon name="location_on" size={12} />{anomaly.district}</span>
                      <span className="flex items-center gap-1"><Icon name="currency_rupee" size={12} />₹{anomaly.amount.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Icon name="assignment" size={12} />{anomaly.appId}</span>
                      <StatusChip
                        status={anomaly.status === "dismissed" ? "rejected" : anomaly.status === "escalated" ? "inprogress" : anomaly.status === "investigating" ? "pending" : "pending"}
                        label={anomaly.status}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {selected === anomaly.id && anomaly.status === "open" && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-outline-variant" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => updateStatus(anomaly.id, "investigating")} className="px-3 py-1.5 rounded-lg bg-warning text-on-warning font-label-md text-label-md">
                      <T gu="ત." en="Investigate" hi="जांच" />
                    </button>
                    <button onClick={() => updateStatus(anomaly.id, "escalated")} className="px-3 py-1.5 rounded-lg bg-danger text-on-danger font-label-md text-label-md">
                      <T gu="ઇ." en="Escalate" hi="एस्केलेट" />
                    </button>
                    <button onClick={() => updateStatus(anomaly.id, "dismissed")} className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md">
                      <T gu="ખ." en="Dismiss" hi="खारिज" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right panel: Risk trend chart */}
          <div className="col-span-5 flex flex-col gap-4">
            <div className="card p-4">
              <h2 className="font-title-lg text-title-lg text-on-surface font-semibold mb-4">
                <T gu="માસ. જ. ટ્ ." en="Monthly Risk Trend" hi="मासिक जोखिम प्रवृत्ति" />
              </h2>
              <div className="flex items-end gap-2 h-32">
                {MONTHLY_RISK.map((m) => (
                  <div key={m.month} className="flex flex-col items-center gap-1 flex-1">
                    <span className="font-caption text-caption text-on-surface-variant">{m.count}</span>
                    <div
                      className={`w-full rounded-t-sm transition-all ${m.count >= 10 ? "bg-danger" : m.count >= 7 ? "bg-warning" : "bg-primary/40"}`}
                      style={{ height: `${(m.count / maxCount) * 100}%` }}
                    />
                    <span className="font-caption text-[10px] text-on-surface-variant">{m.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Anomaly type breakdown */}
            <div className="card p-4">
              <h2 className="font-title-md text-title-md text-on-surface font-semibold mb-3">
                <T gu="પ્ ર. અ. ." en="Anomaly Type Breakdown" hi="अनियमितता प्रकार" />
              </h2>
              {[
                { type: "Duplicate Aadhaar", count: 5, pct: 42 },
                { type: "Ghost Beneficiary", count: 3, pct: 25 },
                { type: "Income Mismatch", count: 2, pct: 17 },
                { type: "Attendance Fraud", count: 1, pct: 8 },
                { type: "Bank Fraud", count: 1, pct: 8 },
              ].map((row) => (
                <div key={row.type} className="flex items-center gap-2 mb-2">
                  <span className="font-caption text-caption text-on-surface-variant w-32 truncate">{row.type}</span>
                  <div className="flex-1 bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                    <div className="bg-danger h-full rounded-full" style={{ width: `${row.pct}%` }} />
                  </div>
                  <span className="font-label-md text-label-md text-on-surface font-bold w-6 text-right">{row.count}</span>
                </div>
              ))}
            </div>

            {/* Network / relationship graph placeholder */}
            <div className="card p-4">
              <h2 className="font-title-md text-title-md text-on-surface font-semibold mb-3">
                <T gu="ક. ન. ." en="Cluster Network Graph" hi="क्लस्टर नेटवर्क ग्राफ" />
              </h2>
              <div className="relative h-40 bg-surface-container-low rounded-xl overflow-hidden flex items-center justify-center">
                {/* Fake node graph */}
                {[
                  { x: 50, y: 50, r: 20, color: "bg-danger", label: "A1" },
                  { x: 30, y: 70, r: 14, color: "bg-warning", label: "B2" },
                  { x: 70, y: 70, r: 14, color: "bg-warning", label: "C3" },
                  { x: 20, y: 50, r: 10, color: "bg-primary/40", label: "D4" },
                  { x: 80, y: 40, r: 10, color: "bg-primary/40", label: "E5" },
                ].map((node) => (
                  <div
                    key={node.label}
                    className={`absolute rounded-full ${node.color} flex items-center justify-center`}
                    style={{ left: `${node.x}%`, top: `${node.y}%`, width: node.r * 2, height: node.r * 2, transform: "translate(-50%,-50%)" }}
                  >
                    <span className="font-caption text-[9px] text-on-primary font-bold">{node.label}</span>
                  </div>
                ))}
                <div className="absolute inset-0 flex items-end justify-center pb-2">
                  <span className="font-caption text-caption text-on-surface-variant bg-surface/80 px-2 py-0.5 rounded">
                    <T gu="FRD-001 ક્ ." en="FRD-001 cluster (3 linked apps)" hi="FRD-001 क्लस्टर" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OfficerShell>
  );
}
