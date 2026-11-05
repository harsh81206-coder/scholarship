"use client";

import { useAppStore, type Toast } from "@/lib/store";
import { Icon } from "@/components/Icon";

const ICONS: Record<Toast["type"], string> = {
  success: "check_circle",
  error: "error",
  info: "info",
  warning: "warning",
};

const COLORS: Record<Toast["type"], string> = {
  success: "bg-success text-on-success",
  error: "bg-danger text-on-danger",
  info: "bg-primary text-on-primary",
  warning: "bg-warning text-on-warning",
};

function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useAppStore((s) => s.removeToast);
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-level-3 font-label-lg text-label-lg font-semibold min-w-[260px] max-w-[380px] animate-slide-up ${COLORS[toast.type]}`}
    >
      <Icon name={ICONS[toast.type]} size={20} className="shrink-0" />
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => removeToast(toast.id)}
        className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
      >
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useAppStore((s) => s.toasts);
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} />
        </div>
      ))}
    </div>
  );
}
