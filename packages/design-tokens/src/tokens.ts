/**
 * HYPE design tokens — cinematic streaming (Disney+-inspired atmosphere).
 * Deep night blues, signature blue CTAs, warm gold for brand sparkle.
 * Red only for LIVE / danger. Brand name remains HYPE (not Disney IP).
 */

export const colors = {
  // Surfaces — deep cinematic night
  ink: "#03060F",
  charcoal: "#0A1020",
  slate: "#141B2E",
  elevated: "#1C2540",
  overlay: "rgba(3, 6, 15, 0.82)",

  // Neutrals — soft silver whites
  white: "#F7F8FC",
  mist: "#C8D0E0",
  ash: "#8E9BB3",
  stone: "#5A667C",
  border: "#2A3550",
  borderSubtle: "#1A2238",

  // Accent — streaming blue (primary CTAs)
  accent: "#0063E5",
  accentHover: "#1A7AFF",
  accentMuted: "rgba(0, 99, 229, 0.18)",
  accentSoft: "#7EB6FF",

  // Brand gold — magical / premium moments (replaces old amber alias)
  amber: "#D4AF37",
  amberMuted: "rgba(212, 175, 55, 0.16)",

  // Semantic — red ONLY for live / danger
  live: "#E11D2E",
  success: "#2F9E6E",
  warning: "#D4AF37",
  danger: "#E11D2E",
  info: "#0063E5",

  // Text
  textPrimary: "#F7F8FC",
  textSecondary: "#C8D0E0",
  textMuted: "#8E9BB3",
  textInverse: "#03060F",
  textOnAccent: "#FFFFFF",
} as const;

export const typography = {
  fontFamily: {
    sans: '"Nunito Sans", "Segoe UI", system-ui, sans-serif',
    display: '"Playfair Display", "Times New Roman", serif',
    mono: '"SF Mono", ui-monospace, monospace',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
    "5xl": 48,
    "6xl": 60,
  },
} as const;

export const fontWeights = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

export const lineHeights = {
  tight: 1.15,
  snug: 1.25,
  normal: 1.45,
  relaxed: 1.65,
} as const;

export const sizes = {
  iconSm: 16,
  iconMd: 20,
  iconLg: 24,
  iconXl: 32,
  avatarSm: 32,
  avatarMd: 48,
  avatarLg: 72,
  avatarXl: 96,
  controlSm: 32,
  controlMd: 40,
  controlLg: 48,
  headerHeight: 64,
  tabBarHeight: 56,
  sidebarWidth: 240,
} as const;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 32,
  8: 40,
  9: 48,
  10: 64,
  12: 80,
  16: 128,
} as const;

export const radii = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 22,
  full: 9999,
} as const;

export const shadows = {
  none: "none",
  sm: "0 2px 8px rgba(0, 0, 0, 0.35)",
  md: "0 8px 24px rgba(0, 0, 0, 0.45)",
  lg: "0 16px 40px rgba(0, 0, 0, 0.55)",
  glowAccent: "0 0 24px rgba(0, 99, 229, 0.35)",
  rn: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.35,
      shadowRadius: 6,
      elevation: 3,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 12,
    },
  },
} as const;

export const opacities = {
  disabled: 0.4,
  muted: 0.6,
  hover: 0.85,
  pressed: 0.7,
  overlay: 0.78,
  full: 1,
} as const;

export const zIndex = {
  base: 0,
  raised: 10,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  toast: 500,
  max: 9999,
} as const;

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

/** Duration tokens in ms — prefer `motion` for new work. */
export const durations = {
  instant: 80,
  fast: 140,
  normal: 200,
  slow: 280,
  page: 320,
  /** @deprecated use durations.page */
  slower: 280,
} as const;

export const easings = {
  /** Spec: motion.easingStandard */
  standard: "cubic-bezier(0.2, 0, 0, 1)",
  enter: "cubic-bezier(0, 0, 0.2, 1)",
  exit: "cubic-bezier(0.4, 0, 1, 1)",
  /** Aliases */
  emphasized: "cubic-bezier(0.2, 0, 0, 1)",
  decelerate: "cubic-bezier(0, 0, 0.2, 1)",
  accelerate: "cubic-bezier(0.4, 0, 1, 1)",
} as const;

/** Canonical motion system for polish / microinteractions. */
export const motion = {
  instant: durations.instant,
  fast: durations.fast,
  normal: durations.normal,
  slow: durations.slow,
  page: durations.page,
  easingStandard: easings.standard,
  easingEnter: easings.enter,
  easingExit: easings.exit,
  cardHoverScale: 1.03,
  cardPressedScale: 0.985,
  tvFocusScale: 1.05,
  imageZoomHover: 1.05,
  pageTranslateY: 6,
  heroTranslateY: 8,
  messageTranslateY: 4,
} as const;

export const touchTargets = {
  min: 44,
  comfortable: 48,
  tv: 56,
  webMin: 40,
} as const;

export const focusScale = {
  default: 1.04,
  strong: 1.04,
  subtle: 1.015,
} as const;

export const tokens = {
  colors,
  typography,
  fontWeights,
  lineHeights,
  sizes,
  spacing,
  radii,
  shadows,
  opacities,
  zIndex,
  breakpoints,
  durations,
  easings,
  motion,
  touchTargets,
  focusScale,
} as const;

export type DesignTokens = typeof tokens;
export type ColorToken = keyof typeof colors;
