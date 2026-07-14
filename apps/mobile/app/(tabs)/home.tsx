import type { ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { homeFeedQueryOptions, mockStreams } from "@hypelive/api";
import { BRAND_NAME } from "@hypelive/domain";
import { colors, spacing } from "@hypelive/design-tokens";
import { ChannelCard } from "../../src/components/ChannelCard";
import { ContentCard } from "../../src/components/ContentCard";
import { EmptyState } from "../../src/components/EmptyState";
import { ErrorState } from "../../src/components/ErrorState";
import { SkeletonCard } from "../../src/components/Skeleton";
import {
  getChannels,
  getContinueWatching,
  getLiveStreams,
  getPrograms,
  getRecentEpisodes,
  getSchedule,
  resolveChannelSlug,
  type HomeFeedView,
} from "../../src/lib/feed";
import { getSupabase } from "../../src/lib/supabase";

export default function HomeScreen() {
  const apiOpts = { supabase: getSupabase(), useMock: !getSupabase() };
  const { data, isLoading, isError, refetch, isFetching } = useQuery(
    homeFeedQueryOptions(apiOpts),
  );

  const feed = data as HomeFeedView | undefined;
  const live = getLiveStreams(feed);
  const channels = getChannels(feed);
  const programs = getPrograms(feed);
  const episodes = getRecentEpisodes(feed);
  const continueWatching = getContinueWatching(feed);
  const schedule =
    getSchedule(feed).length > 0
      ? getSchedule(feed)
      : mockStreams.filter((s) => s.status === "scheduled");

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.brand}>{BRAND_NAME}</Text>
        <Text style={styles.eyebrow}>Inicio</Text>

        {isError ? (
          <ErrorState onRetry={() => void refetch()} />
        ) : (
          <>
            <Section title="En vivo ahora">
              {isLoading ? (
                <Row>
                  <SkeletonCard />
                  <SkeletonCard />
                </Row>
              ) : live.length === 0 ? (
                <EmptyState
                  title="Nadie en vivo"
                  description="Volvé más tarde o explorá la programación."
                />
              ) : (
                <Row>
                  {live.map((s) => (
                    <ContentCard
                      key={s.id}
                      title={s.title}
                      live
                      viewers={s.viewerCount}
                      subtitle={s.program?.title ?? s.channel?.name}
                      onPress={() => router.push(`/live/${s.id}`)}
                    />
                  ))}
                </Row>
              )}
            </Section>

            {continueWatching.length > 0 ? (
              <Section title="Seguir viendo">
                <Row>
                  {continueWatching.map((ep) => (
                    <ContentCard
                      key={ep.id}
                      title={ep.title}
                      durationSeconds={ep.durationSeconds}
                      subtitle={ep.program?.title}
                      onPress={() => router.push(`/watch/${ep.id}`)}
                    />
                  ))}
                </Row>
              </Section>
            ) : null}

            <Section title="Próximas transmisiones">
              {schedule.length === 0 ? (
                <EmptyState title="Sin programación" />
              ) : (
                <Row>
                  {schedule.map((s) => (
                    <ContentCard
                      key={s.id}
                      title={s.title}
                      meta={
                        ("scheduledFor" in s && s.scheduledFor) ||
                        ("scheduledAt" in s && s.scheduledAt) ||
                        "Próximamente"
                      }
                      onPress={() => router.push(`/live/${s.id}`)}
                    />
                  ))}
                </Row>
              )}
            </Section>

            <Section title="Canales">
              {isLoading ? (
                <Row>
                  <SkeletonCard />
                </Row>
              ) : channels.length === 0 ? (
                <EmptyState title="Sin canales" />
              ) : (
                <Row>
                  {channels.map((c) => (
                    <ChannelCard
                      key={c.id}
                      name={c.name}
                      slug={c.slug}
                      followerCount={c.followerCount}
                      verified={c.isVerified}
                      onPress={() => router.push(`/channel/${c.slug}`)}
                    />
                  ))}
                </Row>
              )}
            </Section>

            <Section title="Programas">
              {isLoading ? (
                <Row>
                  <SkeletonCard />
                </Row>
              ) : programs.length === 0 ? (
                <EmptyState title="Sin programas" />
              ) : (
                <Row>
                  {programs.map((p) => {
                    const channelSlug = resolveChannelSlug(p, channels);
                    return (
                      <ContentCard
                        key={p.id}
                        title={p.title}
                        live={p.isLive}
                        subtitle={p.channel?.name}
                        onPress={() => {
                          if (!channelSlug) return;
                          router.push(
                            `/channel/${channelSlug}/program/${p.slug}`,
                          );
                        }}
                      />
                    );
                  })}
                </Row>
              )}
            </Section>

            <Section title="Episodios recientes">
              {episodes.length === 0 && !isLoading ? (
                <EmptyState title="Sin episodios" />
              ) : (
                <Row>
                  {episodes.map((ep) => (
                    <ContentCard
                      key={ep.id}
                      title={ep.title}
                      durationSeconds={ep.durationSeconds}
                      subtitle={ep.program?.title ?? ep.channel?.name}
                      onPress={() => router.push(`/watch/${ep.id}`)}
                    />
                  ))}
                </Row>
              )}
            </Section>

            {isFetching && !isLoading ? (
              <Text style={styles.refresh}>Actualizando…</Text>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Row({ children }: { children: ReactNode }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  content: { padding: spacing[4], paddingBottom: spacing[10] },
  brand: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: "700",
  },
  eyebrow: {
    color: colors.textSecondary,
    marginBottom: spacing[5],
    fontSize: 15,
  },
  section: { marginBottom: spacing[6] },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: spacing[3],
  },
  refresh: {
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing[2],
  },
});
