"use client";

import { Icon } from "@/components/Icon";

export function DownloadButton({
  label,
  onClick,
  disabled = false,
}: {
  label: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="btn-outline inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">
      <Icon name="download" size={18} />
      {label}
    </button>
  );
}
