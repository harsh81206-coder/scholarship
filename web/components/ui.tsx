import { clsx } from "clsx";
import { Icon } from "@/components/Icon";

type Status = "approved" | "pending" | "rejected" | "inprogress";

const STATUS_CONFIG: Record<
  Status,
  { icon: string; className: string }
> = {
  approved: { icon: "check_circle", className: "chip-approved" },
  pending: { icon: "schedule", className: "chip-pending" },
  rejected: { icon: "cancel", className: "chip-rejected" },
  inprogress: { icon: "autorenew", className: "chip-inprogress" },
};

interface StatusChipProps {
  status: Status;
  label: React.ReactNode;
}

export function StatusChip({ status, label }: StatusChipProps) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={clsx("chip", cfg.className)}>
      <Icon name={cfg.icon} size={14} fill />
      {label}
    </span>
  );
}

// ── KPI Card ───────────────────────────────────────────────────────────────
interface KpiCardProps {
  icon: string;
  label: React.ReactNode;
  value: React.ReactNode;
  sub?: React.ReactNode;
  accent?: string; // tailwind text color class
}

export function KpiCard({ icon, label, value, sub, accent = "text-primary" }: KpiCardProps) {
  return (
    <div className="card p-4 flex items-start gap-3 hover:shadow-level-2 transition-shadow">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon name={icon} size={22} className="text-primary" />
      </div>
      <div className="min-w-0">
        <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{label}</p>
        <p className={`font-headline-sm text-headline-sm ${accent} leading-tight`}>{value}</p>
        {sub && <p className="font-caption text-caption text-on-surface-variant mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={clsx(
        "bg-surface-container-high rounded animate-pulse",
        className
      )}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card p-4 space-y-3">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  );
}

// ── EmptyState ─────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ icon = "inbox", title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-4">
        <Icon name={icon} size={32} className="text-on-surface-variant" />
      </div>
      <h3 className="font-title-md text-title-md text-on-surface mb-1">{title}</h3>
      {description && (
        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ── ErrorState ─────────────────────────────────────────────────────────────
interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-danger-container flex items-center justify-center mb-4">
        <Icon name="error_outline" size={32} className="text-on-danger-container" />
      </div>
      <h3 className="font-title-md text-title-md text-on-surface mb-1">{title}</h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">{description}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-outline mt-4 flex items-center gap-2 px-4 py-2 rounded h-10 text-sm">
          <Icon name="refresh" size={18} />
          Retry
        </button>
      )}
    </div>
  );
}

// ── Avatar (initials) ──────────────────────────────────────────────────────
interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = { sm: "w-7 h-7 text-xs", md: "w-9 h-9 text-sm", lg: "w-12 h-12 text-base" };

export function Avatar({ name, size = "md", className = "" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className={clsx(
        "rounded-full bg-primary flex items-center justify-center font-title-sm text-on-primary font-semibold shrink-0",
        SIZE_MAP[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
