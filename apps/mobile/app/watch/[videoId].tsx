import { StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { episodeQueryOptions } from "@hypelive/api";
import { formatDuration } from "@hypelive/domain";
import { colors, spacing } from "@hypelive/design-tokens";
import { EmptyState } from "../../src/components/EmptyState";
import { ErrorState } from "../../src/components/ErrorState";
import { FakePlayer } from "../../src/components/FakePlayer";
import { Skeleton } from "../../src/components/Skeleton";
import { getSupabase } from "../../src/lib/supabase";

export default function WatchScreen() {
  const { videoId } = useLocalSearchParams<{ videoId: string }>();
  const apiOpts = { supabase: getSupabase(), useMock: !getSupabase() };
  const { data, isLoading, isError, refetch } = useQuery(
    episodeQueryOptions(videoId!, apiOpts),
  );

  if (isLoading) {
    return (
      <View style={styles.pad}>
        <Skeleton height={220} />
        <Skeleton height={20} width="70%" style={{ marginTop: 16 }} />
      </View>
    );
  }

  if (isError) return <ErrorState onRetry={() => void refetch()} />;
  if (!data) {
    return <EmptyState title="Episodio no encontrado" />;
  }

  const episode = data;
  const program = episode.program;
  const channel = episode.channel;

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <View style={styles.content}>
        <FakePlayer title={episode.title} live={false} />
        <Text style={styles.title}>{episode.title}</Text>
        <Text style={styles.meta}>
          {typeof episode.durationSeconds === "number"
            ? formatDuration(episode.durationSeconds)
            : "—"}
          {typeof episode.episodeNumber === "number"
            ? ` · Episodio ${episode.episodeNumber}`
            : ""}
        </Text>
        {program && channel ? (
          <Text
            style={styles.link}
            onPress={() =>
              router.push(`/channel/${channel.slug}/program/${program.slug}`)
            }
          >
            {program.title} · {channel.name}
          </Text>
        ) : program ? (
          <Text style={styles.meta}>{program.title}</Text>
        ) : null}
        {episode.description ? (
          <Text style={styles.desc}>{episode.description}</Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  content: { padding: spacing[4], gap: spacing[2] },
  pad: { flex: 1, padding: spacing[4], backgroundColor: colors.ink },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: "700" },
  meta: { color: colors.textMuted, fontSize: 14 },
  link: {
    color: colors.accentSoft,
    fontSize: 14,
    fontWeight: "600",
    minHeight: 44,
    textAlignVertical: "center",
  },
  desc: { color: colors.textSecondary, fontSize: 15, marginTop: spacing[2] },
});
