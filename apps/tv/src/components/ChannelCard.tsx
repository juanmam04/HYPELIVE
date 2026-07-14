import { StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing } from "@hypelive/design-tokens";
import { formatViewerCount } from "@hypelive/domain";
import { Focusable } from "./Focusable";

type Props = {
  name: string;
  slug: string;
  followerCount?: number;
  verified?: boolean;
  onPress?: () => void;
  hasTVPreferredFocus?: boolean;
};

export function ChannelCard({
  name,
  slug,
  followerCount,
  verified,
  onPress,
  hasTVPreferredFocus,
}: Props) {
  return (
    <Focusable
      onPress={onPress}
      hasTVPreferredFocus={hasTVPreferredFocus}
      style={styles.card}
    >
      <View style={styles.avatar}>
        <Text style={styles.initial}>{name.slice(0, 1).toUpperCase()}</Text>
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {name}
        {verified ? " ✓" : ""}
      </Text>
      <Text style={styles.slug}>@{slug}</Text>
      {typeof followerCount === "number" ? (
        <Text style={styles.meta}>
          {formatViewerCount(followerCount)} seguidores
        </Text>
      ) : null}
    </Focusable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 180,
    marginRight: spacing[4],
    alignItems: "center",
    padding: spacing[3],
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: radii.full,
    backgroundColor: colors.elevated,
    alignItems: "center",
    justifyContent: "center",
  },
  initial: { color: colors.accentSoft, fontSize: 36, fontWeight: "700" },
  name: {
    marginTop: spacing[2],
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  slug: { color: colors.textMuted, fontSize: 14 },
  meta: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
});
