import { StyleSheet, View, type DimensionValue } from "react-native";
import { colors, radii, spacing } from "@hypelive/design-tokens";

export function Skeleton({
  width = "100%" as DimensionValue,
  height = 20,
  radius = radii.md,
}: {
  width?: DimensionValue;
  height?: number;
  radius?: number;
}) {
  return (
    <View style={[styles.base, { width, height, borderRadius: radius }]} />
  );
}

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <Skeleton height={158} radius={radii.lg} />
      <Skeleton height={18} width="80%" />
    </View>
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: colors.slate, opacity: 0.75 },
  card: { width: 280, marginRight: spacing[4], gap: spacing[2] },
});
