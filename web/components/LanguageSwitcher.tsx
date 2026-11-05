"use client";
import { useAppStore, type Lang } from "@/lib/store";

const LANGS: { code: Lang; label: string }[] = [
  { code: "gu", label: "ગુ" },
  { code: "hi", label: "हि" },
  { code: "en", label: "EN" },
];

export function LanguageSwitcher() {
  const { lang, setLang } = useAppStore();

  return (
    <div className="flex items-center gap-0.5 rounded-full bg-surface-container-high p-0.5">
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          className={`px-2.5 py-1 rounded-full font-label-md text-label-md transition-all ${
            lang === code
              ? "bg-primary text-on-primary shadow-sm"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
          aria-pressed={lang === code}
          aria-label={`Switch to ${code}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
