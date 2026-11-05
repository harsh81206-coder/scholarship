"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { T } from "@/components/T";
import type { Role } from "@/lib/store";

const SCHOOL_NAV = [
  { href: "/school", icon: "dashboard", gu: "ડેશબોર્ડ", en: "Home", hi: "होम" },
  { href: "/school/queue", icon: "fact_check", gu: "ચકાસણી કતાર", en: "Queue", hi: "जांच" },
  { href: "/school/cycles", icon: "pedal_bike", gu: "વિતરણ", en: "Distribution", hi: "वितरण" },
  { href: "/school/reports", icon: "assessment", gu: "અહેવાલ", en: "Reports", hi: "रिपोर्ट" },
];

export function MobileShell({ children, role }: { children: React.ReactNode; role: Extract<Role, "school" | "tpeo"> }) {
  const pathname = usePathname();
  const isCyclePage = pathname === "/school/cycles";

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-surface">
      <header className="sticky top-0 z-40 flex h-12 items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-4">
        <div className="flex min-w-0 items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-primary">school</span>
          <div className="min-w-0 leading-tight">
            <p className="truncate font-label-md text-on-surface">
              <T gu="વિદ્યા પ્રગતિ સેતુ" en="Vidya Pragati Setu" hi="विद्या प्रगति सेतु" />
            </p>
            <p className="truncate font-caption text-on-surface-variant">
              {role === "school" ? "Dr. Kalpesh Shah" : "TPEO Borsad"}
            </p>
          </div>
        </div>
        <LanguageSwitcher />
      </header>
      <main className="min-h-0 flex-1 pb-24">{children}</main>
      <nav aria-label="School navigation" className="fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 border-t border-outline-variant bg-surface-container-lowest">
        <div className="grid h-16 grid-cols-4 items-center">
          {SCHOOL_NAV.map((item) => {
            const active = item.href === "/school/cycles" ? isCyclePage : pathname === item.href;
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}
                className={`flex h-full flex-col items-center justify-center gap-0.5 ${active ? "text-primary" : "text-on-surface-variant"}`}>
                <span className="material-symbols-outlined text-[21px]">{item.icon}</span>
                <span className="font-caption text-[10px] leading-none"><T gu={item.gu} en={item.en} hi={item.hi} /></span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
