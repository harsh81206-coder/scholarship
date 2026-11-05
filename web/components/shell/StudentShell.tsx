"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { T } from "@/components/T";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { NAV_CONFIG } from "@/lib/nav.config";
import { useAppStore } from "@/lib/store";

export function StudentShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lang = useAppStore((s) => s.lang);
  const unreadCount = useAppStore((s) => s.unreadCount);
  const navItems = NAV_CONFIG.student;

  return (
    <div className="min-h-screen bg-surface flex flex-col max-w-[430px] mx-auto">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-primary flex items-center justify-between px-4 h-14 shadow-level-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-on-primary/20 flex items-center justify-center font-title-sm text-on-primary font-bold">
            RP
          </div>
          <div>
            <p className="font-label-lg text-label-lg text-on-primary leading-tight">
              <T gu="રિયા એમ. પટેલ" en="Riya M. Patel" hi="रिया एम. पटेल" />
            </p>
            <p className="font-caption text-caption text-on-primary/70">GJ-AND-2026-004512</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link href="/student/notifications" className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-on-primary/10 transition-colors">
            <span className="material-symbols-outlined text-on-primary text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 rounded-full bg-secondary border-2 border-primary flex items-center justify-center">
                <span className="font-caption text-[9px] text-on-secondary font-bold leading-none px-0.5">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto pb-safe">{children}</main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-surface-container-lowest border-t border-outline-variant z-40 safe-area-inset-bottom">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/student" && pathname.startsWith(item.href));
            const label = lang === "en" ? item.en : lang === "hi" ? item.hi : item.gu;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-2 transition-colors ${
                  isActive ? "text-primary" : "text-on-surface-variant"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className={`material-symbols-outlined text-[24px] transition-all ${
                    isActive ? "scale-110" : ""
                  }`}
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span className="font-label-sm text-[10px] leading-none">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      <RoleSwitcher />
    </div>
  );
}
