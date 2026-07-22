import type { Config } from "tailwindcss";
import { colors, radii, spacing, durations, breakpoints } from "@hypelive/design-tokens";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./providers/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: colors.ink,
        charcoal: colors.charcoal,
        slate: colors.slate,
        elevated: colors.elevated,
        mist: colors.mist,
        ash: colors.ash,
        stone: colors.stone,
        border: {
          DEFAULT: colors.border,
          subtle: colors.borderSubtle,
        },
        accent: {
          DEFAULT: colors.accent,
          hover: colors.accentHover,
          muted: colors.accentMuted,
          soft: colors.accentSoft,
        },
        amber: {
          DEFAULT: colors.amber,
          muted: colors.amberMuted,
        },
        live: colors.live,
        success: colors.success,
        warning: colors.warning,
        danger: colors.danger,
        info: colors.info,
        surface: {
          ink: colors.ink,
          charcoal: colors.charcoal,
          slate: colors.slate,
          elevated: colors.elevated,
        },
        text: {
          primary: colors.textPrimary,
          secondary: colors.textSecondary,
          muted: colors.textMuted,
          inverse: colors.textInverse,
          "on-accent": colors.textOnAccent,
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Times New Roman", "serif"],
        mono: ["ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: `${radii.sm}px`,
        md: `${radii.md}px`,
        lg: `${radii.lg}px`,
        xl: `${radii.xl}px`,
        "2xl": `${radii["2xl"]}px`,
      },
      spacing: Object.fromEntries(
        Object.entries(spacing).map(([k, v]) => [k, `${v}px`]),
      ),
      transitionDuration: {
        instant: `${durations.instant}ms`,
        fast: `${durations.fast}ms`,
        normal: `${durations.normal}ms`,
        slow: `${durations.slow}ms`,
        page: `${durations.page}ms`,
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.2, 0, 0, 1)",
        enter: "cubic-bezier(0, 0, 0.2, 1)",
        exit: "cubic-bezier(0.4, 0, 1, 1)",
      },
      screens: {
        sm: `${breakpoints.sm}px`,
        md: `${breakpoints.md}px`,
        lg: `${breakpoints.lg}px`,
        xl: `${breakpoints.xl}px`,
        "2xl": `${breakpoints["2xl"]}px`,
      },
      boxShadow: {
        soft: "0 8px 24px rgba(0, 0, 0, 0.4)",
        deep: "0 16px 40px rgba(0, 0, 0, 0.55)",
        glow: "0 0 24px rgba(0, 99, 229, 0.35)",
      },
      keyframes: {
        pulseLive: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "pulse-live": "pulseLive 1.6s ease-in-out infinite",
        shimmer: "shimmer 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
