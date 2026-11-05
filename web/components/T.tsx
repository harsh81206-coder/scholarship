"use client";
import { useAppStore } from "@/lib/store";

interface TProps {
  gu: string;
  en: string;
  hi?: string;
}

/**
 * <T gu="ગુજરાતી ટેક્સ્ટ" en="English text" hi="हिन्दी पाठ" />
 * Shows only the string for the currently selected language.
 * Falls back: hi → en if hi missing.
 */
export function T({ gu, en, hi }: TProps) {
  const lang = useAppStore((s) => s.lang);
  if (lang === "gu") return <>{gu}</>;
  if (lang === "hi") return <>{hi ?? en}</>;
  return <>{en}</>;
}
