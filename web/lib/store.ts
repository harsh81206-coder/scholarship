import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "gu" | "en" | "hi";
export type Role = "student" | "school" | "deo" | "admin" | "vendor" | "tpeo" | "demo";

// ── Toast ────────────────────────────────────────────────────────────────────
export type ToastType = "success" | "error" | "info" | "warning";
export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// ── Demo state ───────────────────────────────────────────────────────────────
export interface DemoState {
  isAuthenticated: boolean;
  authenticatedRole: Role;
  /** CTS IDs of schemes the student has applied to in this session */
  appliedSchemes: string[];
  /** IDs of applications approved by school officer in this session */
  schoolApproved: string[];
  /** IDs of applications bulk-approved by DEO in this session */
  deoApproved: string[];
  /** Number of unread notifications */
  unreadCount: number;
}

interface AppStore {
  // Language
  lang: Lang;
  setLang: (lang: Lang) => void;

  // Role
  role: Role;
  setRole: (role: Role) => void;

  // Auth (demo)
  isAuthenticated: boolean;
  login: (role: Role) => void;
  logout: () => void;

  // Demo flows
  appliedSchemes: string[];
  addAppliedScheme: (schemeId: string) => void;
  schoolApproved: string[];
  addSchoolApproved: (appId: string) => void;
  deoApproved: string[];
  addDeoApproved: (appId: string) => void;
  unreadCount: number;
  setUnreadCount: (n: number) => void;
  decrementUnread: () => void;

  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // ── Language ──────────────────────────────────────────────────────────
      lang: "gu",
      setLang: (lang) => set({ lang }),

      // ── Role ──────────────────────────────────────────────────────────────
      role: "student",
      setRole: (role) => set({ role }),

      // ── Auth ──────────────────────────────────────────────────────────────
      isAuthenticated: false,
      login: (role) => set({ isAuthenticated: true, role, authenticatedRole: role } as Partial<AppStore>),
      logout: () =>
        set({
          isAuthenticated: false,
          appliedSchemes: [],
          schoolApproved: [],
          deoApproved: [],
        }),

      // ── Demo flows ────────────────────────────────────────────────────────
      appliedSchemes: [],
      addAppliedScheme: (schemeId) =>
        set((s) => ({
          appliedSchemes: s.appliedSchemes.includes(schemeId)
            ? s.appliedSchemes
            : [...s.appliedSchemes, schemeId],
        })),

      schoolApproved: [],
      addSchoolApproved: (appId) =>
        set((s) => ({ schoolApproved: [...s.schoolApproved, appId] })),

      deoApproved: [],
      addDeoApproved: (appId) =>
        set((s) => ({ deoApproved: [...s.deoApproved, appId] })),

      unreadCount: 4,
      setUnreadCount: (n) => set({ unreadCount: n }),
      decrementUnread: () =>
        set((s) => ({ unreadCount: Math.max(0, s.unreadCount - 1) })),

      // ── Toasts ────────────────────────────────────────────────────────────
      toasts: [],
      addToast: (toast) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
        setTimeout(() => {
          get().removeToast(id);
        }, toast.duration ?? 3500);
      },
      removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
      showSuccess: (message) => get().addToast({ type: "success", message }),
      showError: (message) => get().addToast({ type: "error", message }),
      showInfo: (message) => get().addToast({ type: "info", message }),
    }),
    {
      name: "vps-app-store",
      partialize: (state) => ({
        lang: state.lang,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
        appliedSchemes: state.appliedSchemes,
        unreadCount: state.unreadCount,
      }),
    }
  )
);
