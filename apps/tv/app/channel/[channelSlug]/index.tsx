import { useEffect } from "react";
import { BackHandler, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { channelDetailQueryOptions } from "@hypelive/api";
import { formatViewerCount } from "@hypelive/domain";
import { colors, spacing } from "@hypelive/design-tokens";
import { Button } from "../../../src/components/Button";
import { ContentCard } from "../../../src/components/ContentCard";
import { EmptyState } from "../../../src/components/EmptyState";
import { ErrorState } from "../../../src/components/ErrorState";
import { Skeleton } from "../../../src/components/Skeleton";
import { OVERSCAN } from "../../../src/lib/theme";

export default function ChannelScreen() {
  const { channelSlug } = useLocalSearchParams<{ channelSlug: string }>();
  const { data, isLoading, isError, refetch } = useQuery(
    channelDetailQueryOptions(channelSlug!, { useMock: true }),
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
        <Skeleton height={120} width={120} radius={60} />
      </View>
    );
  }
  if (isError) return <ErrorState onRetry={() => void refetch()} />;
  if (!data?.channel) return <EmptyState title="Canal no encontrado" />;

  const { channel, liveStream, programs, recentEpisodes } = data;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Button label="Atrás" variant="ghost" onPress={() => router.back()} />
      <Text style={styles.name}>
        {channel.name}
        {channel.isVerified ? " ✓" : ""}
      </Text>
      <Text style={styles.meta}>
        @{channel.slug} · {formatViewerCount(channel.followerCount ?? 0)}{" "}
        seguidores
      </Text>
      {channel.description ? (
        <Text style={styles.desc}>{channel.description}</Text>
      ) : null}

      <Text style={styles.section}>En vivo</Text>
      <ScrollView horizontal>
        {!liveStream ? (
          <EmptyState title="Nada en vivo" />
        ) : (
          <ContentCard
            title={liveStream.title}
            live
            viewers={liveStream.viewerCount}
            subtitle={liveStream.program?.title}
            onPress={() => router.push(`/live/${liveStream.id}`)}
          />
        )}
      </ScrollView>

      <Text style={styles.section}>Programas</Text>
      <ScrollView horizontal>
        {programs.length === 0 ? (
          <EmptyState title="Sin programas" />
        ) : (
          programs.map((p) => (
            <ContentCard
              key={p.id}
              title={p.title}
              live={p.isLive}
              subtitle={p.scheduleDescription ?? undefined}
              onPress={() =>
                router.push(`/channel/${channel.slug}/program/${p.slug}`)
              }
            />
          ))
        )}
      </ScrollView>

      <Text style={styles.section}>Episodios recientes</Text>
      <ScrollView horizontal>
        {recentEpisodes.length === 0 ? (
          <EmptyState title="Sin episodios" />
        ) : (
          recentEpisodes.map((ep) => (
            <ContentCard
              key={ep.id}
              title={ep.title}
              durationSeconds={ep.durationSeconds}
              subtitle={ep.program?.title}
              onPress={() => router.push(`/watch/${ep.id}`)}
            />
          ))
        )}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ink },
  content: { padding: OVERSCAN, gap: spacing[3] },
  pad: { flex: 1, padding: OVERSCAN, backgroundColor: colors.ink },
  name: { color: colors.textPrimary, fontSize: 40, fontWeight: "700" },
  meta: { color: colors.textMuted, fontSize: 20 },
  desc: { color: colors.textSecondary, fontSize: 20, maxWidth: 800 },
  section: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: "600",
    marginTop: spacing[4],
  },
});
