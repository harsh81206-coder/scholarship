import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // ── Colors (from DESIGN.md) ────────────────────────────────────────────
      colors: {
        // Primary – Trust Blue
        primary: "#1D4ED8",
        "on-primary": "#FFFFFF",
        "primary-container": "#1E3A8A",
        "on-primary-container": "#DBEAFE",
        "primary-fixed": "#DBEAFE",
        "primary-fixed-dim": "#BFDBFE",
        "on-primary-fixed": "#1E3A8A",

        // Secondary – Saffron Orange
        secondary: "#F97316",
        "on-secondary": "#FFFFFF",
        "secondary-container": "#F97316",
        "on-secondary-container": "#FFFFFF",
        "secondary-fixed": "#FED7AA",
        "on-secondary-fixed": "#7C2D12",

        // Tertiary
        tertiary: "#7C3AED",
        "on-tertiary": "#FFFFFF",
        "tertiary-fixed": "#EDE9FE",
        "on-tertiary-fixed": "#4C1D95",

        // Semantic
        success: "#16A34A",
        "on-success": "#FFFFFF",
        "success-container": "#DCFCE7",
        "on-success-container": "#15803D",
        warning: "#EAB308",
        "on-warning": "#FFFFFF",
        "warning-container": "#FEF9C3",
        "on-warning-container": "#A16207",
        danger: "#DC2626",
        error: "#DC2626",
        "on-danger": "#FFFFFF",
        "on-error": "#FFFFFF",
        "danger-container": "#FEE2E2",
        "error-container": "#FEE2E2",
        "on-danger-container": "#B91C1C",
        "on-error-container": "#B91C1C",
        info: "#0EA5E9",
        "on-info": "#FFFFFF",
        "info-container": "#E0F2FE",
        "on-info-container": "#0369A1",

        // Surface & Canvas
        surface: "#F8FAFC",
        "on-surface": "#0F172A",
        "on-surface-variant": "#64748B",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-low": "#F1F5F9",
        "surface-container": "#F8FAFC",
        "surface-container-high": "#E2E8F0",
        "surface-container-highest": "#CBD5E1",
        "surface-dim": "#94A3B8",
        "inverse-surface": "#0F172A",
        "on-inverse-surface": "#F8FAFC",

        // Outline
        outline: "#94A3B8",
        "outline-variant": "#E2E8F0",

        // Status chip colors (direct)
        "chip-approved-bg": "#DCFCE7",
        "chip-approved-text": "#15803D",
        "chip-approved-border": "#BBF7D0",
        "chip-pending-bg": "#FEF9C3",
        "chip-pending-text": "#A16207",
        "chip-pending-border": "#FEF08A",
        "chip-rejected-bg": "#FEE2E2",
        "chip-rejected-text": "#B91C1C",
        "chip-rejected-border": "#FECACA",
        "chip-inprogress-bg": "#E0F2FE",
        "chip-inprogress-text": "#0369A1",
        "chip-inprogress-border": "#BAE6FD",
      },

      // ── Typography Scale (from DESIGN.md) ──────────────────────────────────
      fontFamily: {
        sans: ["var(--font-inter)", "Noto Sans Gujarati", "system-ui", "sans-serif"],
        gujarati: ["var(--font-noto-gujarati)", "sans-serif"],
      },
      fontSize: {
        display: ["3.5rem", { lineHeight: "1.12", letterSpacing: "-0.02em", fontWeight: "800" }],
        "headline-lg": ["2rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-md": ["1.5rem", { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-sm": ["1.25rem", { lineHeight: "1.3", fontWeight: "600" }],
        "title-lg": ["1.125rem", { lineHeight: "1.4", fontWeight: "600" }],
        "title-md": ["1rem", { lineHeight: "1.5", fontWeight: "600" }],
        "title-sm": ["0.875rem", { lineHeight: "1.5", fontWeight: "600" }],
        "body-lg": ["1rem", { lineHeight: "1.6" }],
        "body-md": ["0.875rem", { lineHeight: "1.57" }],
        "body-sm": ["0.75rem", { lineHeight: "1.6" }],
        "label-lg": ["0.875rem", { lineHeight: "1.43", fontWeight: "500" }],
        "label-md": ["0.75rem", { lineHeight: "1.33", fontWeight: "500" }],
        "label-sm": ["0.6875rem", { lineHeight: "1.45", fontWeight: "500" }],
        caption: ["0.75rem", { lineHeight: "1.33" }],
      },

      // ── Spacing (4px base modular) ──────────────────────────────────────────
      spacing: {
        "space-xs": "0.25rem",   // 4px
        "space-sm": "0.5rem",    // 8px
        "space-md": "1rem",      // 16px
        "space-lg": "1.5rem",    // 24px
        "space-xl": "2rem",      // 32px
        "space-2xl": "3rem",     // 48px
        gutter: "1.5rem",        // 24px desktop gutter
      },

      // ── Border Radius ───────────────────────────────────────────────────────
      borderRadius: {
        DEFAULT: "8px",
        sm: "4px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
        full: "9999px",
      },

      // ── Shadows (Elevation levels from DESIGN.md) ──────────────────────────
      boxShadow: {
        "level-1": "0 4px 16px rgba(15, 23, 42, 0.06)",
        "level-2": "0 8px 24px rgba(15, 23, 42, 0.09)",
        "level-3": "0 16px 36px rgba(15, 23, 42, 0.12)",
        "focus": "0 0 0 3px #DBEAFE",
      },

      // ── Container max-width ─────────────────────────────────────────────────
      maxWidth: {
        container: "1280px",
      },

      // ── Keyframes for micro-animations ─────────────────────────────────────
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "pulse-dot": "pulse-dot 1.5s ease-in-out infinite",
      },
    },
  },
  // Generate font-{scale} utilities to mirror text-{scale} (Stitch HTML uses both together)
  plugins: [
    plugin(({ addUtilities }) => {
      // font-{scale} sets the same font-weight as the text-{scale} entry
      const fontScaleWeights: Record<string, string> = {
        "font-display": "800",
        "font-headline-lg": "700",
        "font-headline-md": "700",
        "font-headline-sm": "600",
        "font-title-lg": "600",
        "font-title-md": "600",
        "font-title-sm": "600",
        "font-body-lg": "400",
        "font-body-md": "400",
        "font-body-sm": "400",
        "font-label-lg": "500",
        "font-label-md": "500",
        "font-label-sm": "500",
        "font-caption": "400",
      };
      const utils = Object.fromEntries(
        Object.entries(fontScaleWeights).map(([cls, weight]) => [
          "." + cls,
          { fontWeight: weight },
        ])
      );
      addUtilities(utils);
    }),
  ],
};

export default config;
