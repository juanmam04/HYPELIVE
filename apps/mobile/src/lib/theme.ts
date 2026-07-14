import {
  colors,
  focusScale,
  fontWeights,
  radii,
  shadows,
  sizes,
  spacing,
  touchTargets,
  typography,
} from "@hypelive/design-tokens";
import { StyleSheet, type TextStyle, type ViewStyle } from "react-native";

export const theme = {
  colors,
  spacing,
  radii,
  typography,
  fontWeights,
  sizes,
  shadows,
  touchTargets,
  focusScale,
} as const;

export const minTouch: ViewStyle = {
  minHeight: touchTargets.min,
  minWidth: touchTargets.min,
};

export const screenPadding: ViewStyle = {
  paddingHorizontal: spacing[4],
  paddingVertical: spacing[4],
};

export const textStyles = StyleSheet.create({
  display: {
    color: colors.textPrimary,
    fontSize: typography.fontSize["3xl"],
    fontWeight: fontWeights.bold,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xl,
    fontWeight: fontWeights.semibold,
  },
  body: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.md,
    fontWeight: fontWeights.regular,
  },
  caption: {
    color: colors.textMuted,
    fontSize: typography.fontSize.sm,
    fontWeight: fontWeights.regular,
  },
  label: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: fontWeights.medium,
  } satisfies TextStyle,
});
