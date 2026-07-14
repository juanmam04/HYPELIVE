import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@hypelive/design-tokens";
import { LiveBadge } from "./LiveBadge";

export function FakePlayer({
  title,
  live = true,
  fullscreen,
}: {
  title?: string;
  live?: boolean;
  fullscreen?: boolean;
}) {
  return (
    <View style={[styles.wrap, fullscreen && styles.full]}>
      <View style={styles.surface}>
        {live ? (
          <View style={styles.badge}>
            <LiveBadge />
          </View>
        ) : null}
        <Text style={styles.play}>▶</Text>
        <Text style={styles.caption}>{title ?? "Reproducción simulada"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: colors.ink,
    overflow: "hidden",
  },
  full: {
    flex: 1,
    aspectRatio: undefined,
  },
  surface: {
    flex: 1,
    backgroundColor: colors.charcoal,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing[6],
  },
  badge: { position: "absolute", top: spacing[5], left: spacing[5] },
  play: { color: colors.white, fontSize: 64, opacity: 0.9 },
  caption: {
    marginTop: spacing[3],
    color: colors.textSecondary,
    fontSize: 22,
    textAlign: "center",
  },
});
