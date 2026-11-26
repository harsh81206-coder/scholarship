"use client";
import { useAppStore, type Lang } from "@/lib/store";
import { t } from "@/lib/i18n";

const LANGS: { code: Lang; label: string; name: string }[] = [
  { code: "gu", label: "ગુ", name: "gu" },
  { code: "hi", label: "हि", name: "hi" },
  { code: "en", label: "EN", name: "en" },
];

export function LanguageSwitcher() {
  const { lang, setLang } = useAppStore();

  return (
    <div className="flex items-center gap-0.5 rounded-full bg-surface-container-high p-0.5">
      {LANGS.map(({ code, label, name }) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          className={`px-2.5 py-1 rounded-full font-label-md text-label-md transition-all ${
            lang === code
              ? "bg-primary text-on-primary shadow-sm"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
          aria-pressed={lang === code}
          aria-label={t("language.switchTo", lang, { language: t(`language.${name}`, lang) })}
          title={t(`language.${name}`, lang)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
