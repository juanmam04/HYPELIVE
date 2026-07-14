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
    gap: spacing[1],
    backgroundColor: colors.live,
    paddingHorizontal: spacing[2],
    paddingVertical: 4,
    borderRadius: radii.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.white,
  },
  text: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
});
