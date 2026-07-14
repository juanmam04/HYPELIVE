import { StyleSheet, View, type DimensionValue } from "react-native";
import { colors, radii, spacing } from "@hypelive/design-tokens";

type Props = {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  style?: object;
};

export function Skeleton({
  width = "100%",
  height = 16,
  radius = radii.md,
  style,
}: Props) {
  return (
    <View
      style={[
        styles.base,
        { width, height, borderRadius: radius },
        style,
      ]}
    />
  );
}

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <Skeleton height={124} radius={radii.lg} />
      <Skeleton height={14} width="80%" style={{ marginTop: spacing[2] }} />
      <Skeleton height={12} width="50%" style={{ marginTop: spacing[1] }} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.slate,
    opacity: 0.7,
  },
  card: {
    width: 220,
    marginRight: spacing[3],
  },
});
