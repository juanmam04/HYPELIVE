import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing, touchTargets } from "@hypelive/design-tokens";
import { formatViewerCount } from "@hypelive/domain";

type Props = {
  name: string;
  slug: string;
  followerCount?: number;
  verified?: boolean;
  onPress?: () => void;
};

export function ChannelCard({
  name,
  slug,
  followerCount,
  verified,
  onPress,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Canal ${name}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.avatar}>
        <Text style={styles.initial}>{name.slice(0, 1).toUpperCase()}</Text>
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {name}
        {verified ? " ✓" : ""}
      </Text>
      <Text style={styles.slug} numberOfLines={1}>
        @{slug}
      </Text>
      {typeof followerCount === "number" ? (
        <Text style={styles.meta}>
          {formatViewerCount(followerCount)} seguidores
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    marginRight: spacing[3],
    alignItems: "center",
    minHeight: touchTargets.min * 2,
  },
  pressed: { opacity: 0.85 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radii.full,
    backgroundColor: colors.elevated,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  initial: {
    color: colors.accentSoft,
    fontSize: 28,
    fontWeight: "700",
  },
  name: {
    marginTop: spacing[2],
    color: colors.textPrimary,
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  slug: {
    color: colors.textMuted,
    fontSize: 12,
  },
  meta: {
    marginTop: 2,
    color: colors.textSecondary,
    fontSize: 11,
  },
});
