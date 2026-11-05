"use client";

import { T } from "@/components/T";

export function ErrorState({ error, onRetry }: { error?: unknown; onRetry: () => void }) {
  const message = error instanceof Error ? error.message : "Please try again.";
  return (
    <div role="alert" className="rounded-xl border border-danger/30 bg-danger-container/30 p-6">
      <p className="font-title-sm text-on-surface"><T gu="માહિતી લોડ થઈ શકી નથી" en="Could not load this information" hi="जानकारी लोड नहीं हो सकी" /></p>
      <p className="mt-1 font-body-sm text-on-surface-variant">{message}</p>
      <button type="button" onClick={onRetry} className="mt-4 rounded-lg bg-primary px-4 py-2 font-label-md text-on-primary">
        <T gu="ફરી પ્રયાસ કરો" en="Retry" hi="फिर कोशिश करें" />
      </button>
    </div>
  );
}
