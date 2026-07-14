/**
 * HYPE LIVE design tokens — commercial streaming platform.
 * Dark blue-black surfaces, sober blue accent, red only for LIVE/errors.
 */

export const colors = {
  // Surfaces — black / very dark blue
  ink: "#07090D",
  charcoal: "#0C1017",
  slate: "#141A24",
  elevated: "#1A2230",
  overlay: "rgba(7, 9, 13, 0.78)",

  // Neutrals
  white: "#F5F7FA",
  mist: "#C5CDD8",
  ash: "#8B95A5",
  stone: "#5C6573",
  border: "#2A3344",
  borderSubtle: "#1C2433",

  // Accent — sober blue (primary CTAs, focus, links)
  accent: "#3D7EEA",
  accentHover: "#5B93F0",
  accentMuted: "rgba(61, 126, 234, 0.16)",
  accentSoft: "#8BB0F5",

  // Deprecated aliases kept for gradual migration (map to blue, not orange)
  amber: "#8B95A5",
  amberMuted: "rgba(139, 149, 165, 0.14)",

  // Semantic — red ONLY for live / danger
  live: "#E11D2E",
  success: "#2F9E6E",
  warning: "#C9A227",
  danger: "#E11D2E",
  info: "#3D7EEA",

  // Text
  textPrimary: "#F5F7FA",
  textSecondary: "#C5CDD8",
  textMuted: "#8B95A5",
  textInverse: "#07090D",
  textOnAccent: "#F5F7FA",
} as const;

export const typography = {
  fontFamily: {
    sans: '"Source Sans 3", "Segoe UI", system-ui, sans-serif',
    display: '"Source Sans 3", "Segoe UI", system-ui, sans-serif',
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
  sm: 2,
  md: 4,
  lg: 6,
  xl: 8,
  "2xl": 12,
  full: 9999,
} as const;

export const shadows = {
  none: "none",
  sm: "0 1px 2px rgba(0, 0, 0, 0.4)",
  md: "0 4px 12px rgba(0, 0, 0, 0.45)",
  lg: "0 8px 24px rgba(0, 0, 0, 0.5)",
  glowAccent: "none",
  rn: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.4,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.45,
      shadowRadius: 8,
      elevation: 6,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 10,
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
  cardHoverScale: 1.015,
  cardPressedScale: 0.985,
  tvFocusScale: 1.04,
  imageZoomHover: 1.025,
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
