import { T } from "@/components/T";

export function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning-container px-2.5 py-1 font-label-sm text-label-sm text-on-surface">
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-warning" />
      <T gu="ડેમો / સિમ્યુલેટેડ" en="Demo / Simulated" hi="डेमो / सिम्युलेटेड" />
    </span>
  );
}
