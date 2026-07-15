import { useEffect } from "react";
import { BackHandler, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { episodeQueryOptions } from "@hypelive/api";
import { formatDuration } from "@hypelive/domain";
import { colors, spacing } from "@hypelive/design-tokens";
import { Button } from "../../src/components/Button";
import { EmptyState } from "../../src/components/EmptyState";
import { ErrorState } from "../../src/components/ErrorState";
import { FakePlayer } from "../../src/components/FakePlayer";
import { Skeleton } from "../../src/components/Skeleton";
import { apiOptions } from "../../src/lib/api-options";
import { OVERSCAN } from "../../src/lib/theme";

export default function WatchScreen() {
  const { videoId } = useLocalSearchParams<{ videoId: string }>();
  const { data, isLoading, isError, refetch } = useQuery(
    episodeQueryOptions(videoId!, apiOptions()),
  );

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      router.back();
      return true;
    });
    return () => sub.remove();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.pad}>
        <Skeleton height={360} />
      </View>
    );
  }
  if (isError) return <ErrorState onRetry={() => void refetch()} />;
  if (!data) return <EmptyState title="Episodio no encontrado" />;

  const episode = data;
  const program = episode.program;
  const channel = episode.channel;

  return (
    <View style={styles.screen}>
      <FakePlayer title={episode.title} live={false} />
      <View style={styles.info}>
        <Text style={styles.title}>{episode.title}</Text>
        <Text style={styles.meta}>
          {typeof episode.durationSeconds === "number"
            ? formatDuration(episode.durationSeconds)
            : "—"}
          {typeof episode.episodeNumber === "number"
            ? ` · Episodio ${episode.episodeNumber}`
            : ""}
        </Text>
        {program ? (
          <Text style={styles.program}>{program.title}</Text>
        ) : null}
        {channel ? (
          <Text style={styles.channel}>{channel.name}</Text>
        ) : null}
        {episode.description ? (
          <Text style={styles.desc}>{episode.description}</Text>
        ) : null}
        <Button label="Atrás" variant="secondary" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ink, padding: OVERSCAN, gap: spacing[4] },
  pad: { flex: 1, padding: OVERSCAN, backgroundColor: colors.ink },
  info: { gap: spacing[2] },
  title: { color: colors.textPrimary, fontSize: 32, fontWeight: "700" },
  meta: { color: colors.textMuted, fontSize: 20 },
  program: { color: colors.accentSoft, fontSize: 20, fontWeight: "600" },
  channel: { color: colors.textSecondary, fontSize: 18 },
  desc: { color: colors.textSecondary, fontSize: 20, maxWidth: 900 },
});
