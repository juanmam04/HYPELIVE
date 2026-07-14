import { StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing } from "@hypelive/design-tokens";
import { formatDuration, formatViewerCount } from "@hypelive/domain";
import { Focusable } from "./Focusable";
import { LiveBadge } from "./LiveBadge";

type Props = {
  title: string;
  subtitle?: string;
  live?: boolean;
  viewers?: number;
  durationSeconds?: number | null;
  onPress?: () => void;
  large?: boolean;
  hasTVPreferredFocus?: boolean;
};

export function ContentCard({
  title,
  subtitle,
  live,
  viewers,
  durationSeconds,
  onPress,
  large,
  hasTVPreferredFocus,
}: Props) {
  return (
    <Focusable
      onPress={onPress}
      hasTVPreferredFocus={hasTVPreferredFocus}
      style={[styles.card, large && styles.large]}
    >
      <View style={[styles.thumb, large && styles.thumbLarge]}>
        {live ? (
          <View style={styles.badge}>
            <LiveBadge />
          </View>
        ) : null}
        {typeof durationSeconds === "number" ? (
          <Text style={styles.duration}>{formatDuration(durationSeconds)}</Text>
        ) : null}
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={styles.sub} numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}
      {typeof viewers === "number" ? (
        <Text style={styles.meta}>{formatViewerCount(viewers)} espectadores</Text>
      ) : null}
    </Focusable>
  );
}

export function FocusableCard(props: Props) {
  return <ContentCard {...props} />;
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    marginRight: spacing[4],
    padding: spacing[2],
  },
  large: { width: 420 },
  thumb: {
    height: 158,
    borderRadius: radii.lg,
    backgroundColor: colors.slate,
    justifyContent: "flex-end",
  },
  thumbLarge: { height: 236 },
  badge: { position: "absolute", top: spacing[2], left: spacing[2] },
  duration: {
    alignSelf: "flex-end",
    margin: spacing[2],
    backgroundColor: colors.overlay,
    color: colors.textPrimary,
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.sm,
    overflow: "hidden",
  },
  title: {
    marginTop: spacing[2],
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "600",
  },
  sub: { color: colors.textSecondary, fontSize: 16 },
  meta: { color: colors.textMuted, fontSize: 14, marginTop: 2 },
});
