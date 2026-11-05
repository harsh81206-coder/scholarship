import { PublicShell } from "@/components/shell/PublicShell";
import { StatusChip, KpiCard, EmptyState, ErrorState, SkeletonCard } from "@/components/ui";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";

export default function DesignSystemPage() {
  return (
    <PublicShell>
      <div className="page-container py-12 space-y-16">
        <section>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Design System</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Vidya Pragati Setu — DESIGN.md tokens rendered live
          </p>
        </section>

        {/* Colors */}
        <section>
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6">Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { name: "primary", bg: "bg-primary", text: "text-on-primary" },
              { name: "secondary", bg: "bg-secondary", text: "text-on-secondary" },
              { name: "tertiary", bg: "bg-tertiary", text: "text-on-tertiary" },
              { name: "success", bg: "bg-success", text: "text-on-success" },
              { name: "warning", bg: "bg-warning", text: "text-on-warning" },
              { name: "danger", bg: "bg-danger", text: "text-on-danger" },
              { name: "surface", bg: "bg-surface border border-outline-variant", text: "text-on-surface" },
              { name: "surface-low", bg: "bg-surface-container-low border border-outline-variant", text: "text-on-surface" },
              { name: "surface-high", bg: "bg-surface-container-high", text: "text-on-surface" },
              { name: "primary-container", bg: "bg-primary-container", text: "text-on-primary" },
              { name: "success-container", bg: "bg-success-container", text: "text-on-success-container" },
              { name: "warning-container", bg: "bg-warning-container", text: "text-on-warning-container" },
            ].map(({ name, bg, text }) => (
              <div key={name} className={`${bg} rounded-xl p-4 h-20 flex items-end`}>
                <span className={`font-label-sm text-label-sm ${text}`}>{name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6">Typography</h2>
          <div className="card p-6 space-y-4">
            {[
              { cls: "font-display text-display", label: "display — 56px/800" },
              { cls: "font-headline-lg text-headline-lg", label: "headline-lg — 32px/700" },
              { cls: "font-headline-md text-headline-md", label: "headline-md — 24px/700" },
              { cls: "font-headline-sm text-headline-sm", label: "headline-sm — 20px/600" },
              { cls: "font-title-lg text-title-lg", label: "title-lg — 18px/600" },
              { cls: "font-title-md text-title-md", label: "title-md — 16px/600" },
              { cls: "font-body-lg text-body-lg", label: "body-lg — 16px/400" },
              { cls: "font-body-md text-body-md", label: "body-md — 14px/400" },
              { cls: "font-body-sm text-body-sm", label: "body-sm — 12px/400" },
              { cls: "font-label-lg text-label-lg", label: "label-lg — 14px/500" },
              { cls: "font-label-md text-label-md", label: "label-md — 12px/500" },
              { cls: "font-caption text-caption", label: "caption — 12px/400" },
            ].map(({ cls, label }) => (
              <div key={label} className="flex items-baseline gap-4">
                <span className={`${cls} text-on-surface`}>
                  <T gu="ગુજરાતી ટેક્સ્ટ" en="Sample Text" hi="नमूना पाठ" />
                </span>
                <span className="font-caption text-caption text-on-surface-variant ml-auto">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6">Buttons</h2>
          <div className="flex flex-wrap gap-3">
            <button className="btn-primary px-5 py-2 rounded h-11">Primary</button>
            <button className="btn-cta px-5 py-2 rounded h-11">CTA Saffron</button>
            <button className="btn-outline px-5 py-2 rounded h-11">Outline</button>
            <button className="btn-danger px-5 py-2 rounded h-11">Danger</button>
            <button className="btn-primary px-5 py-2 rounded h-11 flex items-center gap-2">
              <Icon name="add" size={18} /> With Icon
            </button>
          </div>
        </section>

        {/* Status chips */}
        <section>
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6">Status Chips</h2>
          <div className="flex flex-wrap gap-3">
            <StatusChip status="approved" label="Approved / મંજૂર" />
            <StatusChip status="pending" label="Pending / બાકી" />
            <StatusChip status="rejected" label="Rejected / નામંજૂર" />
            <StatusChip status="inprogress" label="In Progress / પ્રક્રિયામાં" />
          </div>
        </section>

        {/* KPI Cards */}
        <section>
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6">KPI Cards</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard icon="school" label="Total Students / વિદ્યાર્થી" value="1,24,312" sub="+3.2% this month" />
            <KpiCard icon="check_circle" label="Approved / મંજૂર" value="98,450" accent="text-success" />
            <KpiCard icon="schedule" label="Pending / બાકી" value="21,890" accent="text-warning" />
            <KpiCard icon="payments" label="Disbursed / વિતરણ" value="₹24.6 Cr" accent="text-primary" />
          </div>
        </section>

        {/* Loading states */}
        <section>
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6">Loading States</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </section>

        {/* Empty / Error states */}
        <section>
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6">Empty & Error States</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card">
              <EmptyState
                icon="inbox"
                title="No Applications Found"
                description="You haven't applied to any schemes yet."
              />
            </div>
            <div className="card">
              <ErrorState
                title="Failed to load data"
                description="Network error. Check your connection."
              />
            </div>
          </div>
        </section>

        {/* Icons */}
        <section>
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6">Icons (Material Symbols)</h2>
          <div className="card p-6 flex flex-wrap gap-6">
            {["home","school","auto_stories","send","timeline","person","dashboard","fact_check","payments","bar_chart","gavel","policy","inventory_2","qr_code_2","location_on","description","analytics","pedal_bike","verified","fingerprint","notifications","badge","help_outline","account_balance","receipt_long","leaderboard","build","insights","warning","route","done_all"].map((n) => (
              <div key={n} className="flex flex-col items-center gap-1">
                <Icon name={n} size={28} className="text-primary" />
                <span className="font-caption text-caption text-on-surface-variant text-[10px]">{n}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Input */}
        <section>
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6">Input Field</h2>
          <div className="card p-6 max-w-md space-y-4">
            <div>
              <label className="font-label-lg text-label-lg text-on-surface block mb-1">
                CTS ID <span className="text-danger">*</span>
              </label>
              <input className="input" placeholder="GJ-AND-2026-004512" />
            </div>
            <div>
              <label className="font-label-lg text-label-lg text-on-surface block mb-1">
                Date of Birth
              </label>
              <input className="input border-danger" placeholder="DD/MM/YYYY" />
              <p className="font-body-sm text-body-sm text-danger mt-1 flex items-center gap-1">
                <Icon name="error" size={14} /> Invalid date format
              </p>
            </div>
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
