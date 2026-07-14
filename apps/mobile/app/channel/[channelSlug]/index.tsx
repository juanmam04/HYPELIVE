import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  channelDetailQueryOptions,
  followChannel,
} from "@hypelive/api";
import { formatViewerCount } from "@hypelive/domain";
import { colors, spacing } from "@hypelive/design-tokens";
import { Button } from "../../../src/components/Button";
import { ContentCard } from "../../../src/components/ContentCard";
import { EmptyState } from "../../../src/components/EmptyState";
import { ErrorState } from "../../../src/components/ErrorState";
import { Skeleton } from "../../../src/components/Skeleton";
import { useAuth } from "../../../src/providers/AuthProvider";
import { getSupabase } from "../../../src/lib/supabase";

export default function ChannelScreen() {
  const { channelSlug } = useLocalSearchParams<{ channelSlug: string }>();
  const { profile } = useAuth();
  const [following, setFollowing] = useState(false);
  const apiOpts = { supabase: getSupabase(), useMock: !getSupabase() };

  const { data, isLoading, isError, refetch } = useQuery(
    channelDetailQueryOptions(channelSlug!, apiOpts),
  );

  const followMutation = useMutation({
    mutationFn: async () => {
      if (!data?.channel) return;
      await followChannel(
        {
          userId: profile?.id ?? "guest-profile",
          channelId: data.channel.id,
        },
        apiOpts,
      );
    },
    onSuccess: () => setFollowing(true),
  });

  if (isLoading) {
    return (
      <View style={styles.pad}>
        <Skeleton height={96} radius={48} width={96} />
        <Skeleton height={24} width="60%" style={{ marginTop: 16 }} />
      </View>
    );
  }

  if (isError) return <ErrorState onRetry={() => void refetch()} />;
  if (!data?.channel) {
    return (
      <EmptyState title="Canal no encontrado" description="Revisá el enlace." />
    );
  }

  const { channel, liveStream, programs, recentEpisodes } = data;

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.initial}>
            {channel.name.slice(0, 1).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>
          {channel.name}
          {channel.isVerified ? " ✓" : ""}
        </Text>
        <Text style={styles.meta}>@{channel.slug}</Text>
        <Text style={styles.meta}>
          {formatViewerCount(channel.followerCount ?? 0)} seguidores
        </Text>
        {channel.description ? (
          <Text style={styles.desc}>{channel.description}</Text>
        ) : null}

        <Button
          label={following ? "Siguiendo" : "Seguir canal"}
          variant={following ? "secondary" : "primary"}
          loading={followMutation.isPending}
          onPress={() => followMutation.mutate()}
        />

        <Text style={styles.section}>En vivo</Text>
        {!liveStream ? (
          <EmptyState title="Nada en vivo ahora" />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <ContentCard
              title={liveStream.title}
              live
              viewers={liveStream.viewerCount}
              subtitle={liveStream.program?.title}
              onPress={() => router.push(`/live/${liveStream.id}`)}
            />
          </ScrollView>
        )}

        <Text style={styles.section}>Programas</Text>
        {programs.length === 0 ? (
          <EmptyState title="Sin programas" />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {programs.map((p) => (
              <ContentCard
                key={p.id}
                title={p.title}
                live={p.isLive}
                subtitle={p.scheduleDescription ?? undefined}
                onPress={() =>
                  router.push(
                    `/channel/${channel.slug}/program/${p.slug}`,
                  )
                }
              />
            ))}
          </ScrollView>
        )}

        <Text style={styles.section}>Episodios recientes</Text>
        {recentEpisodes.length === 0 ? (
          <EmptyState title="Sin episodios" />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentEpisodes.map((ep) => (
              <ContentCard
                key={ep.id}
                title={ep.title}
                durationSeconds={ep.durationSeconds}
                subtitle={ep.program?.title}
                onPress={() => router.push(`/watch/${ep.id}`)}
              />
            ))}
          </ScrollView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  content: { padding: spacing[4], alignItems: "center", gap: spacing[2] },
  pad: {
    flex: 1,
    padding: spacing[4],
    backgroundColor: colors.ink,
    alignItems: "center",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.elevated,
    alignItems: "center",
    justifyContent: "center",
  },
  initial: { color: colors.accentSoft, fontSize: 36, fontWeight: "700" },
  name: { color: colors.textPrimary, fontSize: 24, fontWeight: "700" },
  meta: { color: colors.textMuted },
  desc: {
    color: colors.textSecondary,
    textAlign: "center",
    marginVertical: spacing[2],
  },
  section: {
    alignSelf: "flex-start",
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "600",
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },
});
