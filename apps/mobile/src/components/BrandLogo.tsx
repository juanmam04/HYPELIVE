import { View, Text, StyleSheet } from "react-native";
import { APP_NAME } from "@hypelive/domain";
import { colors, spacing } from "@hypelive/design-tokens";

/** Mobile brand — typographic wordmark. */
export function BrandLogo({ size = 28 }: { size?: number }) {
  return (
    <View
      style={styles.row}
      accessibilityRole="header"
      accessibilityLabel={APP_NAME}
    >
      <Text style={[styles.wordmark, { fontSize: Math.round(size * 0.78) }]}>
        <Text style={styles.accent}>H</Text>
        <Text>YPE</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[1],
  },
  wordmark: {
    color: colors.textPrimary,
    fontWeight: "800",
    letterSpacing: -0.8,
    textTransform: "uppercase",
  },
  accent: {
    color: colors.accent,
  },
});
