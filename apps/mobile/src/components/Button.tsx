import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { colors, opacities, radii, spacing, touchTargets } from "@hypelive/design-tokens";

type Variant = "primary" | "secondary" | "ghost" | "danger";

type Props = PressableProps & {
  label: string;
  variant?: Variant;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  variant = "primary",
  loading,
  disabled,
  style,
  ...rest
}: Props) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        pressed && !isDisabled ? styles.pressed : null,
        isDisabled ? styles.disabled : null,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={colors.textOnAccent} />
      ) : (
        <Text style={[styles.label, variant === "ghost" && styles.ghostLabel]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: touchTargets.min,
    paddingHorizontal: spacing[4],
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: colors.textOnAccent,
    fontSize: 16,
    fontWeight: "600",
  },
  ghostLabel: {
    color: colors.textPrimary,
  },
  pressed: {
    opacity: opacities.pressed,
  },
  disabled: {
    opacity: opacities.disabled,
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
  danger: { backgroundColor: colors.danger },
});
