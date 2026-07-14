import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@hypelive/design-tokens";

/**
 * Fake QR — View grid pattern (no camera / QR lib).
 * Pairing URL is also shown as text for expo-linking / phone entry.
 */
export function FakeQr({ value }: { value: string }) {
  const cells = Array.from({ length: 81 }, (_, i) => {
    const bit = (value.charCodeAt(i % value.length) + i * 7) % 3 === 0;
    return bit;
  });

  return (
    <View style={styles.wrap}>
      <View style={styles.grid}>
        {cells.map((on, i) => (
          <View
            key={i}
            style={[styles.cell, on ? styles.cellOn : styles.cellOff]}
          />
        ))}
      </View>
      <Text style={styles.url} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", gap: spacing[3] },
  grid: {
    width: 180,
    height: 180,
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: colors.white,
    padding: 8,
  },
  cell: { width: "11.11%", aspectRatio: 1 },
  cellOn: { backgroundColor: colors.ink },
  cellOff: { backgroundColor: colors.white },
  url: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: "center",
    maxWidth: 360,
  },
});
