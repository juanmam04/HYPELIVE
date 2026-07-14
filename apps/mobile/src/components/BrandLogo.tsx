import { View, Text, StyleSheet } from "react-native";
import { APP_NAME } from "@hypelive/domain";
import { colors, spacing } from "@hypelive/design-tokens";

/** Mobile brand lockup — H mark + wordmark. */
export function BrandLogo({ size = 28 }: { size?: number }) {
  const bar = size * 0.16;
  const gap = size * 0.14;
  return (
    <View
      style={styles.row}
      accessibilityRole="header"
      accessibilityLabel={APP_NAME}
    >
      <View
        style={[
          styles.mark,
          { width: size, height: size, borderRadius: size * 0.22 },
        ]}
      >
        <View style={styles.hRow}>
          <View style={[styles.hStem, { width: bar, height: size * 0.55 }]} />
          <View style={[styles.hCross, { width: size * 0.28, height: bar, marginHorizontal: gap * 0.3 }]} />
          <View style={[styles.hStem, { width: bar, height: size * 0.55 }]} />
        </View>
      </View>
      <View>
        <Text style={[styles.wordmark, { fontSize: size * 0.68 }]}>{APP_NAME}</Text>
        <View style={styles.underline} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  mark: {
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  hRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  hStem: {
    backgroundColor: colors.textPrimary,
    borderRadius: 1,
  },
  hCross: {
    backgroundColor: colors.textPrimary,
    borderRadius: 1,
  },
  wordmark: {
    color: colors.textPrimary,
    fontWeight: "800",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  underline: {
    marginTop: 3,
    height: 2,
    backgroundColor: colors.accent,
    borderRadius: 1,
  },
});
