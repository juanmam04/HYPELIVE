import { View, Text, StyleSheet } from "react-native";
import { APP_NAME } from "@hypelive/domain";
import { colors, spacing } from "@hypelive/design-tokens";

/** Disney Streaming lockup — Mickey mark + wordmark. */
export function BrandLogo({ size = 28 }: { size?: number }) {
  const mark = Math.round(size * 0.95);
  const ear = Math.round(mark * 0.42);
  const head = Math.round(mark * 0.55);

  return (
    <View
      style={styles.row}
      accessibilityRole="header"
      accessibilityLabel={APP_NAME}
    >
      <View style={{ width: mark, height: mark }}>
        <View
          style={[
            styles.circle,
            {
              width: ear,
              height: ear,
              borderRadius: ear / 2,
              left: 0,
              top: 0,
            },
          ]}
        />
        <View
          style={[
            styles.circle,
            {
              width: ear,
              height: ear,
              borderRadius: ear / 2,
              right: 0,
              top: 0,
            },
          ]}
        />
        <View
          style={[
            styles.circle,
            {
              width: head,
              height: head,
              borderRadius: head / 2,
              left: (mark - head) / 2,
              bottom: 0,
            },
          ]}
        />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.disney, { fontSize: Math.round(size * 0.78) }]}>
          Disney
        </Text>
        <Text style={[styles.streaming, { fontSize: Math.round(size * 0.28) }]}>
          STREAMING
        </Text>
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
  circle: {
    position: "absolute",
    backgroundColor: colors.textPrimary,
  },
  copy: {
    justifyContent: "center",
  },
  disney: {
    color: colors.textPrimary,
    fontWeight: "600",
    fontStyle: "italic",
    letterSpacing: -0.4,
  },
  streaming: {
    color: colors.textPrimary,
    fontWeight: "700",
    letterSpacing: 2.2,
    marginTop: -2,
  },
});
