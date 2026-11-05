"use client";
import { useRouter } from "next/navigation";
import { useAppStore, type Role } from "@/lib/store";
import { ROLE_LABELS } from "@/lib/nav.config";
import { Icon } from "@/components/Icon";
import { useState } from "react";
import { loginDemoRole } from "@/lib/api/resources";

const ROLE_ICONS: Record<Role, string> = {
  student: "school",
  school: "apartment",
  deo: "corporate_fare",
  admin: "policy",
  vendor: "inventory_2",
  tpeo: "account_tree",
  demo: "tune",
};

const QUICK_LINKS: { label: string; href: string; role: Role }[] = [
  { label: "Student", href: "/student", role: "student" },
  { label: "School", href: "/school", role: "school" },
  { label: "DEO", href: "/deo", role: "deo" },
  { label: "Admin", href: "/admin", role: "admin" },
  { label: "Vendor", href: "/vendor", role: "vendor" },
  { label: "Simulate", href: "/demo/simulate", role: "demo" },
];

export function DemoBar() {
  const router = useRouter();
  const { role, lang, setLang, showSuccess, showError } = useAppStore();
  const [open, setOpen] = useState(false);

  async function switchRole(newRole: Role, href: string) {
    try {
      await loginDemoRole(newRole);
      router.push(href);
      showSuccess(`Switched to ${ROLE_LABELS[newRole].en}`);
      setOpen(false);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Could not switch demo role");
    }
  }

  return (
    <>
      {/* Collapsed toggle tab */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[1000]">
        <button
          onClick={() => setOpen((p) => !p)}
          className="flex items-center gap-1.5 bg-on-surface text-surface px-3 py-1 rounded-b-lg font-label-md text-label-md shadow-level-2 hover:bg-primary transition-colors"
          title="Demo Control Bar"
        >
          <Icon name="tune" size={14} />
          <span className="hidden sm:inline">DEMO</span>
          <Icon name={open ? "expand_less" : "expand_more"} size={14} />
        </button>
      </div>

      {/* Expanded bar */}
      {open && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[999] w-[min(96vw,560px)]">
          <div className="bg-on-surface/95 backdrop-blur-xl rounded-2xl shadow-level-3 p-3 flex flex-col gap-2">
            {/* Role switcher */}
            <div>
              <p className="font-caption text-caption text-surface/50 uppercase tracking-widest px-1 mb-1">Switch Role</p>
              <div className="grid grid-cols-3 gap-1.5">
                {QUICK_LINKS.map((q) => (
                  <button
                    key={q.role}
                    onClick={() => switchRole(q.role, q.href)}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg font-label-md text-label-md transition-all ${
                      role === q.role
                        ? "bg-primary text-on-primary"
                        : "bg-surface/10 text-surface hover:bg-surface/20"
                    }`}
                  >
                    <Icon name={ROLE_ICONS[q.role]} size={15} />
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Language + demo actions */}
            <div className="flex items-center gap-2 pt-1 border-t border-surface/10">
              <span className="font-caption text-caption text-surface/50 mr-1">Lang:</span>
              {(["gu", "en", "hi"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2.5 py-1 rounded-full font-label-md text-label-md transition-all ${
                    lang === l ? "bg-secondary text-on-secondary" : "bg-surface/10 text-surface hover:bg-surface/20"
                  }`}
                >
                  {l === "gu" ? "ગુ" : l === "en" ? "EN" : "हि"}
                </button>
              ))}

              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => { router.push("/login"); setOpen(false); }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface/10 text-surface hover:bg-surface/20 font-label-md text-label-md"
                >
                  <Icon name="login" size={13} />
                  Login
                </button>
                <button
                  onClick={() => { router.push("/"); setOpen(false); }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface/10 text-surface hover:bg-surface/20 font-label-md text-label-md"
                >
                  <Icon name="home" size={13} />
                  Home
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="w-6 h-6 rounded-full bg-surface/10 text-surface hover:bg-surface/20 flex items-center justify-center"
                >
                  <Icon name="close" size={14} />
                </button>
              </div>
            </div>

            {/* Current state indicator */}
            <div className="text-[11px] text-surface/40 font-mono px-1">
              Role: <span className="text-surface/70">{role}</span> · Lang: <span className="text-surface/70">{lang}</span> · OTP: <span className="text-secondary">123456</span> · CTS: <span className="text-surface/70">GJ-AND-2026-004512</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
