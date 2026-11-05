"use client";

import { T } from "@/components/T";

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-8 text-center">
      <p className="font-title-md text-on-surface">{title}</p>
      {description && <p className="mt-2 font-body-sm text-on-surface-variant">{description}</p>}
      <span className="sr-only"><T gu="કોઈ માહિતી ઉપલબ્ધ નથી" en="No data available" hi="कोई जानकारी उपलब्ध नहीं है" /></span>
    </div>
  );
}
