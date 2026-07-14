import { StyleSheet, Text } from "react-native";
import { colors, radii, spacing, touchTargets } from "@hypelive/design-tokens";
import { Focusable } from "./Focusable";

type Variant = "primary" | "secondary" | "ghost";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  hasTVPreferredFocus?: boolean;
};

export function Button({
  label,
  onPress,
  variant = "primary",
  hasTVPreferredFocus,
}: Props) {
  return (
    <Focusable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hasTVPreferredFocus={hasTVPreferredFocus}
      style={[styles.base, variantStyles[variant]]}
    >
      <Text style={styles.label}>{label}</Text>
    </Focusable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: touchTargets.tv,
    paddingHorizontal: spacing[5],
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.md,
  },
  label: {
    color: colors.textOnAccent,
    fontSize: 20,
    fontWeight: "600",
  },
});

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: colors.accent },
  secondary: {
    backgroundColor: colors.elevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: { backgroundColor: "transparent" },
});
