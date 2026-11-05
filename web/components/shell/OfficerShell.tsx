"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { T } from "@/components/T";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { NAV_CONFIG, ROLE_LABELS } from "@/lib/nav.config";
import { useAppStore, type Role } from "@/lib/store";

interface OfficerShellProps {
  children: React.ReactNode;
  role: Exclude<Role, "student">;
}

export function OfficerShell({ children, role }: OfficerShellProps) {
  const pathname = usePathname();
  const lang = useAppStore((s) => s.lang);
  const navItems = NAV_CONFIG[role] ?? [];
  const roleLabel = ROLE_LABELS[role];

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-surface-container-lowest border-r border-outline-variant flex flex-col fixed inset-y-0 left-0 z-30">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-outline-variant shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[20px]">school</span>
          </div>
          <div>
            <p className="font-title-sm text-on-surface leading-tight">
              <T gu="વિદ્યા પ્રગતિ સેતુ" en="Vidya Pragati Setu" hi="विद्या प्रगति सेतु" />
            </p>
            <p className="font-caption text-caption text-on-surface-variant">
              {lang === "en" ? roleLabel.en : roleLabel.gu}
            </p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const label = lang === "en" ? item.en : lang === "hi" ? item.hi : item.gu;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 font-label-lg text-label-lg transition-all group ${
                  isActive
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className="material-symbols-outlined text-[20px] shrink-0"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom of sidebar — help link */}
        <div className="p-3 border-t border-outline-variant">
          <Link
            href="/student/assistant"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low font-label-md text-label-md transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">help_outline</span>
            <T gu="સહાય" en="Help & Support" hi="सहायता" />
          </Link>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 min-w-0 ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-surface-container-lowest border-b border-outline-variant h-16 flex items-center justify-between px-6 shadow-sm">
          <div />
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              href="/student/notifications"
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-[22px]">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-secondary border-2 border-surface-container-lowest" />
            </Link>
            <div className="flex items-center gap-2 pl-2 border-l border-outline-variant">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-title-sm text-on-primary font-bold text-xs">
                {role === "school" ? "KS" : role === "admin" ? "SA" : role === "deo" ? "DE" : role === "vendor" ? "VN" : role === "demo" ? "DM" : "TP"}
              </div>
              <div className="hidden sm:block">
                <p className="font-label-md text-on-surface leading-tight">
                  {role === "school" ? "Dr. Kalpesh Shah" : role === "admin" ? "State Admin" : role === "deo" ? "Anand DEO" : role === "vendor" ? "Cycle Vendor" : role === "demo" ? "Demo Controller" : "TPEO Borsad"}
                </p>
                <p className="font-caption text-caption text-on-surface-variant">
                  {lang === "en" ? roleLabel.en : roleLabel.gu}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
      <RoleSwitcher />
    </div>
  );
}
