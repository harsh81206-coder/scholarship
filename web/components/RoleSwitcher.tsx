"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppStore, type Role } from "@/lib/store";
import { ROLE_DASHBOARD, ROLE_LABELS } from "@/lib/nav.config";
import { loginDemoRole } from "@/lib/api/resources";
import { t } from "@/lib/i18n";

const ROLES: Role[] = ["student", "school", "deo", "admin", "vendor", "tpeo", "demo"];

export function RoleSwitcher() {
  const { role, lang, showError } = useAppStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function switchRole(r: Role) {
    try {
      await loginDemoRole(r);
      setOpen(false);
      router.push(ROLE_DASHBOARD[r]);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Could not switch demo role");
    }
  }

  const currentLabel = ROLE_LABELS[role][lang];

  return (
    <div className="fixed bottom-24 right-4 z-50">
      {open && (
        <div className="mb-2 card shadow-level-3 p-2 min-w-[180px] animate-slide-up">
          <p className="font-label-sm text-label-sm text-on-surface-variant px-2 pb-1 border-b border-outline-variant mb-1">
            {t("demo.switchRole", lang)}
          </p>
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => switchRole(r)}
              className={`w-full text-left px-3 py-2 rounded font-label-md text-label-md transition-colors flex items-center gap-2 ${
                role === r
                  ? "bg-primary text-on-primary"
                  : "hover:bg-surface-container-low text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {r === "student" ? "school" : r === "admin" ? "admin_panel_settings" : r === "vendor" ? "local_shipping" : r === "tpeo" ? "account_tree" : r === "demo" ? "science" : "business"}
              </span>
              {ROLE_LABELS[r][lang]}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md shadow-level-2 hover:bg-primary-container transition-colors"
        aria-expanded={open}
        aria-label={t("demo.switchRole", lang)}
        title={t("demo.switchRole", lang)}
      >
        <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
        <span className="hidden sm:inline">{currentLabel}</span>
      </button>
    </div>
  );
}
