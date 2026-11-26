import en from "@/locales/en.json";
import gu from "@/locales/gu.json";
import hi from "@/locales/hi.json";
import { useAppStore, type Lang } from "@/lib/store";

const messages: Record<Lang, Record<string, unknown>> = { en, gu, hi };
const localeTags: Record<Lang, string> = { en: "en-IN", gu: "gu-IN", hi: "hi-IN" };

function lookup(source: Record<string, unknown>, key: string): string | undefined {
  const value = key.split(".").reduce<unknown>((current, part) => {
    return current && typeof current === "object"
      ? (current as Record<string, unknown>)[part]
      : undefined;
  }, source);
  return typeof value === "string" ? value : undefined;
}

export function t(key: string, lang: Lang, values: Record<string, string | number> = {}): string {
  const template = lookup(messages[lang], key) ?? lookup(messages.en, key) ?? key;
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, name: string) => {
    return Object.hasOwn(values, name) ? String(values[name]) : match;
  });
}

export function localizedText(input: string, lang: Lang): string {
  if (lang === "en") return input;
  const targetScript = lang === "gu" ? /[\u0A80-\u0AFF]/ : /[\u0900-\u097F]/;
  const otherIndicScript = lang === "gu" ? /[\u0900-\u097F]/ : /[\u0A80-\u0AFF]/;
  let output = input;
  output = output.replace(/([^()]+)\(([^()]*)\)/g, (whole, before: string, inside: string) => {
    const left = before.trim();
    const right = inside.trim();
    if (targetScript.test(left)) return `${left} `;
    if (targetScript.test(right)) return right;
    if (lang === "hi" && otherIndicScript.test(left)) return right || left;
    return left || right;
  });
  if (!targetScript.test(output) && /[A-Za-z]{2,}/.test(output)) return input;
  if (targetScript.test(output)) {
    output = output.replace(/\s*(?:\/|\||•|—)\s*[A-Za-z][A-Za-z /&-]*/g, "");
    output = output.replace(/\b[A-Za-z][A-Za-z0-9'-]*\b/g, (word) => {
      return /^[A-Z][A-Z0-9'-]{1,}$/.test(word) ? word : "";
    });
  }
  return output.trim();
}

export function formatNumber(value: number, lang: Lang, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(localeTags[lang], options).format(value);
}

export function formatDate(value: Date | string | number, lang: Lang, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(localeTags[lang], options ?? { dateStyle: "medium" }).format(new Date(value));
}

export function localizedName(
  value: { name_en?: unknown; name_gu?: unknown; name_hi?: unknown },
  lang: Lang,
): string {
  const selected = value[`name_${lang}`];
  const fallback = value.name_en ?? value.name_gu ?? value.name_hi ?? "";
  return String(typeof selected === "string" && selected ? selected : fallback);
}

export function useLang(): Lang {
  return useAppStore((state) => state.lang);
}
