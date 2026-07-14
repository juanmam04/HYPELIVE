import {
  colors,
  focusScale,
  fontWeights,
  radii,
  spacing,
  touchTargets,
  typography,
} from "@hypelive/design-tokens";

export const theme = {
  colors,
  spacing,
  radii,
  typography,
  fontWeights,
  touchTargets,
  focusScale,
} as const;

/** ~5% overscan padding for TV safe area */
export const OVERSCAN = "5%" as const;
