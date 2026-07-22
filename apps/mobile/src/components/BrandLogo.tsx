import { View, Text, StyleSheet } from "react-native";
import { APP_NAME } from "@hypelive/domain";
import { colors, spacing } from "@hypelive/design-tokens";

/** Mobile brand — cinematic wordmark + crest. */
export function BrandLogo({ size = 28 }: { size?: number }) {
  const mark = Math.round(size * 0.95);
  return (
    <View
      style={styles.row}
      accessibilityRole="header"
      accessibilityLabel={APP_NAME}
    >
      <View
        style={[
          styles.mark,
          {
            width: mark,
            height: mark,
            borderRadius: mark * 0.28,
          },
        ]}
      >
        <Text style={[styles.markLetter, { fontSize: mark * 0.48 }]}>H</Text>
      </View>
      <View>
        <Text style={[styles.wordmark, { fontSize: Math.round(size * 0.72) }]}>
          HYPE
        </Text>
        <View style={styles.goldLine} />
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
  markLetter: {
    color: colors.white,
    fontWeight: "800",
  },
  wordmark: {
    color: colors.textPrimary,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  goldLine: {
    marginTop: 2,
    height: 2,
    width: 28,
    borderRadius: 1,
    backgroundColor: colors.amber,
  },
});
