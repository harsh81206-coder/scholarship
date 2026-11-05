"use client";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";

const DATA = [
  { month: "Jun", cleared: 8, returned: 1, rejected: 0 },
  { month: "Jul", cleared: 15, returned: 2, rejected: 1 },
  { month: "Aug", cleared: 22, returned: 1, rejected: 0 },
  { month: "Sep", cleared: 31, returned: 3, rejected: 2 },
  { month: "Oct", cleared: 47, returned: 2, rejected: 1 },
  { month: "Nov", cleared: 3, returned: 0, rejected: 0 },
];
const maxVal = Math.max(...DATA.map((d) => d.cleared + d.returned + d.rejected));

export default function TpeoReportsPage() {
  return (
    <OfficerShell role="tpeo">
      <div className="p-6 flex flex-col gap-6 max-w-5xl">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
            <T gu="TPEO Re." en="TPEO Reports & Analytics" hi="TPEO रिपोर्ट" />
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            <T gu="Anand Taluka · Jun–Nov 2026" en="Anand Taluka · Jun–Nov 2026" hi="आणंद तालुका · Jun–Nov 2026" />
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: "check_circle", val: "126", label: { gu: "Total TPEO Cl.", en: "Total TPEO Cleared", hi: "Total TPEO Cleared" }, color: "text-success bg-success-container" },
            { icon: "undo", val: "9", label: { gu: "School Return", en: "Returned to School", hi: "School Return" }, color: "text-warning bg-warning-container" },
            { icon: "cancel", val: "4", label: { gu: "Rejected", en: "Rejected", hi: "अस्वीकृत" }, color: "text-danger bg-danger-container" },
          ].map((s, i) => (
            <div key={i} className={`card p-4 flex items-center gap-3 ${s.color}`}>
              <Icon name={s.icon} size={28} fill />
              <div>
                <p className="font-headline-md text-headline-md font-bold">{s.val}</p>
                <p className="font-label-md text-label-md"><T {...s.label} /></p>
              </div>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div className="card p-5">
          <h2 className="font-title-lg text-title-lg text-on-surface font-semibold mb-4">
            <T gu="Month. TPEO Act." en="Monthly TPEO Activity" hi="मासिक TPEO गतिविधि" />
          </h2>
          <div className="flex items-end gap-3 h-36">
            {DATA.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="font-caption text-[10px] text-on-surface-variant">{d.cleared + d.returned + d.rejected}</span>
                <div className="w-full flex flex-col-reverse rounded-t-sm overflow-hidden" style={{ height: `${((d.cleared + d.returned + d.rejected) / maxVal) * 100}%` }}>
                  <div className="bg-success" style={{ flex: d.cleared }} />
                  <div className="bg-warning" style={{ flex: d.returned }} />
                  <div className="bg-danger" style={{ flex: d.rejected || 0.001 }} />
                </div>
                <span className="font-caption text-[10px] text-on-surface-variant">{d.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 font-caption text-caption text-on-surface-variant">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-success inline-block" /> Cleared</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-warning inline-block" /> Returned</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-danger inline-block" /> Rejected</span>
          </div>
        </div>

        {/* Avg processing time */}
        <div className="card p-5">
          <h2 className="font-title-lg text-title-lg text-on-surface font-semibold mb-3">
            <T gu="Avg Proc. Time" en="Avg TPEO Processing Time" hi="औसत प्रोसेसिंग समय" />
          </h2>
          <div className="flex items-center gap-6 flex-wrap">
            {[
              { label: "< ₹12,000", days: 2.1, color: "text-success" },
              { label: "₹12,000–₹15,000", days: 3.4, color: "text-warning" },
              { label: "> ₹15,000", days: 5.8, color: "text-danger" },
            ].map((r) => (
              <div key={r.label} className="flex flex-col items-center gap-1">
                <span className={`font-headline-md text-headline-md font-bold ${r.color}`}>{r.days}d</span>
                <span className="font-caption text-caption text-on-surface-variant">{r.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </OfficerShell>
  );
}
