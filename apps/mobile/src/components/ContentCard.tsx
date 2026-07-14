import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing, touchTargets } from "@hypelive/design-tokens";
import { formatDuration, formatViewerCount } from "@hypelive/domain";
import { LiveBadge } from "./LiveBadge";

type Props = {
  title: string;
  subtitle?: string;
  meta?: string;
  live?: boolean;
  viewers?: number;
  durationSeconds?: number | null;
  onPress?: () => void;
};

export function ContentCard({
  title,
  subtitle,
  meta,
  live,
  viewers,
  durationSeconds,
  onPress,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.thumb}>
        {live ? (
          <View style={styles.badgeWrap}>
            <LiveBadge />
          </View>
        ) : null}
        {typeof durationSeconds === "number" ? (
          <Text style={styles.duration}>{formatDuration(durationSeconds)}</Text>
        ) : null}
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
        <Text style={styles.meta} numberOfLines={1}>
          {meta ??
            (typeof viewers === "number"
              ? `${formatViewerCount(viewers)} espectadores`
              : " ")}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 220,
    marginRight: spacing[3],
  },
  pressed: { opacity: 0.85 },
  thumb: {
    height: 124,
    borderRadius: radii.lg,
    backgroundColor: colors.slate,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  badgeWrap: {
    position: "absolute",
    top: spacing[2],
    left: spacing[2],
  },
  duration: {
    alignSelf: "flex-end",
    margin: spacing[2],
    backgroundColor: colors.overlay,
    color: colors.textPrimary,
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.sm,
    overflow: "hidden",
  },
  body: {
    marginTop: spacing[2],
    gap: 2,
    minHeight: touchTargets.min,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "600",
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  meta: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
