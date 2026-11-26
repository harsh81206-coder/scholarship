"use client";

import { useApiDemoData } from "@/lib/api/resources";
import { T } from "@/components/T";

export function ApiModeBadge() {
  const isDemoData = useApiDemoData();
  if (!isDemoData) return null;

  return (
    <p
      role="status"
      className="mx-4 mb-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-center text-xs font-semibold text-amber-900"
    >
      <T gu="ડેમો ડેટા" en="Demo data" hi="डेमो डेटा" />
    </p>
  );
}
