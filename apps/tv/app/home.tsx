import { useEffect, type ReactNode } from "react";
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { homeFeedQueryOptions, mockStreams } from "@hypelive/api";
import { BRAND_NAME } from "@hypelive/domain";
import { colors, spacing } from "@hypelive/design-tokens";
import { ChannelCard } from "../src/components/ChannelCard";
import { ContentCard } from "../src/components/ContentCard";
import { EmptyState } from "../src/components/EmptyState";
import { ErrorState } from "../src/components/ErrorState";
import { Focusable } from "../src/components/Focusable";
import { SkeletonCard } from "../src/components/Skeleton";
import {
  getChannels,
  getLiveStreams,
  getPrograms,
  getRecentEpisodes,
  getSchedule,
  resolveChannelSlug,
  type HomeFeedView,
} from "../src/lib/feed";
import { apiOptions } from "../src/lib/api-options";
import { OVERSCAN } from "../src/lib/theme";

export default function HomeScreen() {
  const { data, isLoading, isError, refetch } = useQuery(
    homeFeedQueryOptions(apiOptions()),
  );

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      return true;
    });
    return () => sub.remove();
  }, []);

  const feed = data as HomeFeedView | undefined;
  const live = getLiveStreams(feed);
  const channels = getChannels(feed);
  const programs = getPrograms(feed);
  const episodes = getRecentEpisodes(feed);
  const schedule =
    getSchedule(feed).length > 0
      ? getSchedule(feed)
      : mockStreams.filter((s) => s.status === "scheduled");
  const hero = live[0] ?? schedule[0];

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <Text style={styles.brand}>{BRAND_NAME}</Text>
          <View style={styles.nav}>
            <Focusable
              hasTVPreferredFocus
              onPress={() => router.push("/search")}
              style={styles.navItem}
            >
              <Text style={styles.navText}>Buscar</Text>
            </Focusable>
            <Focusable onPress={() => router.push("/settings")} style={styles.navItem}>
              <Text style={styles.navText}>Ajustes</Text>
            </Focusable>
          </View>
        </View>

        {isError ? (
          <ErrorState onRetry={() => void refetch()} />
        ) : (
          <>
            {hero ? (
              <Focusable
                onPress={() => router.push(`/live/${hero.id}`)}
                style={styles.hero}
              >
                <Text style={styles.heroEyebrow}>Destacado</Text>
                <Text style={styles.heroTitle}>{hero.title}</Text>
                <Text style={styles.heroMeta}>
                  {hero.status === "live" ? "En vivo ahora" : "Próximamente"}
                </Text>
              </Focusable>
            ) : null}

            <Row title="En vivo ahora">
              {isLoading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : live.length === 0 ? (
                <EmptyState title="Nadie en vivo" />
              ) : (
                live.map((s, i) => (
                  <ContentCard
                    key={s.id}
                    title={s.title}
                    live
                    viewers={s.viewerCount}
                    subtitle={s.program?.title ?? s.channel?.name}
                    large={i === 0}
                    onPress={() => router.push(`/live/${s.id}`)}
                  />
                ))
              )}
            </Row>

            <Row title="Próximas transmisiones">
              {schedule.length === 0 ? (
                <EmptyState title="Sin programación" />
              ) : (
                schedule.map((s) => (
                  <ContentCard
                    key={s.id}
                    title={s.title}
                    subtitle={
                      ("scheduledFor" in s && s.scheduledFor) ||
                      ("scheduledAt" in s && s.scheduledAt) ||
                      "Próximamente"
                    }
                    onPress={() => router.push(`/live/${s.id}`)}
                  />
                ))
              )}
            </Row>

            <Row title="Canales">
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

            <Row title="Programas">
              {programs.length === 0 && !isLoading ? (
                <EmptyState title="Sin programas" />
              ) : (
                programs.map((p) => {
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
                })
              )}
            </Row>

            <Row title="Episodios">
              {episodes.length === 0 && !isLoading ? (
                <EmptyState title="Sin episodios" />
              ) : (
                episodes.map((ep) => (
                  <ContentCard
                    key={ep.id}
                    title={ep.title}
                    durationSeconds={ep.durationSeconds}
                    subtitle={ep.program?.title ?? ep.channel?.name}
                    onPress={() => router.push(`/watch/${ep.id}`)}
                  />
                ))
              )}
            </Row>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function Row({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ink },
  content: {
    paddingVertical: OVERSCAN,
    paddingHorizontal: OVERSCAN,
    paddingBottom: spacing[10],
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing[5],
  },
  brand: { color: colors.textPrimary, fontSize: 32, fontWeight: "700" },
  nav: { flexDirection: "row", gap: spacing[3] },
  navItem: { paddingHorizontal: spacing[4], justifyContent: "center" },
  navText: { color: colors.textSecondary, fontSize: 20 },
  hero: {
    minHeight: 220,
    backgroundColor: colors.slate,
    borderRadius: 16,
    padding: spacing[6],
    marginBottom: spacing[6],
    justifyContent: "flex-end",
  },
  heroEyebrow: { color: colors.accentSoft, fontSize: 18, marginBottom: 8 },
  heroTitle: { color: colors.textPrimary, fontSize: 40, fontWeight: "700" },
  heroMeta: { color: colors.textSecondary, fontSize: 20, marginTop: 8 },
  section: { marginBottom: spacing[7] },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: "600",
    marginBottom: spacing[3],
  },
});
