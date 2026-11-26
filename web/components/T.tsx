"use client";
import { useAppStore } from "@/lib/store";
import { localizedText, t } from "@/lib/i18n";

interface TProps {
  k?: string;
  gu?: string;
  en?: string;
  hi?: string;
  values?: Record<string, string | number>;
}

/**
 * <T gu="ગુજરાતી ટેક્સ્ટ" en="English text" hi="हिन्दी पाठ" />
 * Shows only the string for the currently selected language.
 * Falls back: hi → en if hi missing.
 */
export function T({ k, gu, en, hi, values }: TProps) {
  const lang = useAppStore((s) => s.lang);
  if (k) return <>{t(k, lang, values)}</>;
  const value = lang === "gu" ? gu ?? en ?? hi : lang === "hi" ? hi ?? en : en ?? gu ?? hi;
  return <>{localizedText(value ?? "", lang)}</>;
}
