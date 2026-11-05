import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "@/lib/store";

export interface AuthScope {
  school_id: number | null;
  taluka_id: number | null;
  district_id: number | null;
}

interface AuthState {
  accessToken: string | null;
  role: Role | null;
  identifier: string | null;
  scope: AuthScope | null;
  setSession: (input: { accessToken: string; role: Role; identifier: string; scope: AuthScope }) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      role: null,
      identifier: null,
      scope: null,
      setSession: ({ accessToken, role, identifier, scope }) => {
        set({ accessToken, role, identifier, scope });
        if (typeof document !== "undefined") {
          document.cookie = `vps_access_token=${encodeURIComponent(accessToken)}; Path=/; SameSite=Lax`;
          document.cookie = `vps_role=${encodeURIComponent(role)}; Path=/; SameSite=Lax`;
        }
      },
      clearSession: () => {
        set({ accessToken: null, role: null, identifier: null, scope: null });
        if (typeof document !== "undefined") {
          document.cookie = "vps_access_token=; Path=/; Max-Age=0; SameSite=Lax";
          document.cookie = "vps_role=; Path=/; Max-Age=0; SameSite=Lax";
        }
      },
    }),
    {
      name: "vps-auth-session",
      partialize: ({ accessToken, role, identifier, scope }) => ({ accessToken, role, identifier, scope }),
    },
  ),
);
