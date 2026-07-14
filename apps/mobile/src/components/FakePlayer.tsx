import { StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing } from "@hypelive/design-tokens";
import { LiveBadge } from "./LiveBadge";

type Props = {
  title?: string;
  live?: boolean;
  aspectRatio?: number;
};

/** Fake player — Phase 0 placeholder until VideoProvider / SDK is wired. */
export function FakePlayer({ title, live = true, aspectRatio = 16 / 9 }: Props) {
  return (
    <View style={[styles.wrap, { aspectRatio }]}>
      <View style={styles.surface}>
        {live ? (
          <View style={styles.badge}>
            <LiveBadge />
          </View>
        ) : null}
        <Text style={styles.play}>▶</Text>
        <Text style={styles.caption} numberOfLines={2}>
          {title ?? "Reproducción simulada"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    backgroundColor: colors.ink,
    borderRadius: radii.lg,
    overflow: "hidden",
  },
  surface: {
    flex: 1,
    backgroundColor: colors.charcoal,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing[4],
  },
  badge: {
    position: "absolute",
    top: spacing[3],
    left: spacing[3],
  },
  play: {
    color: colors.white,
    fontSize: 40,
    opacity: 0.85,
  },
  caption: {
    marginTop: spacing[2],
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },
});
