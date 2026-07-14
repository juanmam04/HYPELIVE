import { StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing } from "@hypelive/design-tokens";

export function LiveBadge({ label = "EN VIVO" }: { label?: string }) {
  return (
    <View style={styles.badge}>
      <View style={styles.dot} />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    backgroundColor: colors.live,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radii.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  text: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
