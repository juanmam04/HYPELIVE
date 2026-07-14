import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { studioQueryOptions } from "@hypelive/api";
import { colors, spacing } from "@hypelive/design-tokens";
import { Button } from "../../src/components/Button";
import { ContentCard } from "../../src/components/ContentCard";
import { EmptyState } from "../../src/components/EmptyState";
import { ErrorState } from "../../src/components/ErrorState";
import { Skeleton } from "../../src/components/Skeleton";
import { getSupabase } from "../../src/lib/supabase";

export default function StudioScreen() {
  const apiOpts = { supabase: getSupabase(), useMock: !getSupabase() };
  const { data, isLoading, isError, refetch } = useQuery(
    studioQueryOptions(undefined, apiOpts),
  );

  const summary = data;
  const channel = summary?.channel;
  const programs = summary?.programs ?? [];
  const episodes = summary?.recentEpisodes ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Studio</Text>
        <Text style={styles.sub}>Gestioná tu canal y salí al aire.</Text>

        {isLoading ? (
          <View style={{ gap: 12 }}>
            <Skeleton height={80} />
            <Skeleton height={44} />
          </View>
        ) : isError ? (
          <ErrorState onRetry={() => void refetch()} />
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                {channel?.name ?? "Tu canal"}
              </Text>
              <Text style={styles.meta}>
                {summary?.metrics?.followers ?? channel?.followerCount ?? 0}{" "}
                seguidores
                {typeof summary?.metrics?.totalViews === "number"
                  ? ` · ${summary.metrics.totalViews} vistas`
                  : ""}
              </Text>
              {summary?.liveStream ? (
                <Text style={styles.live}>
                  En vivo: {summary.liveStream.title}
                </Text>
              ) : summary?.nextStream ? (
                <Text style={styles.meta}>
                  Próximo: {summary.nextStream.title}
                </Text>
              ) : (
                <Text style={styles.meta}>Sin transmisión activa</Text>
              )}
            </View>

            <Button
              label="Salir al aire"
              onPress={() => router.push("/studio/go-live")}
            />

            <Text style={styles.section}>Programas</Text>
            {programs.length === 0 ? (
              <EmptyState
                title="Sin programas"
                description="Creá un programa para organizar episodios."
              />
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {programs.map((p) => (
                  <ContentCard
                    key={p.id}
                    title={p.title}
                    live={p.isLive}
                    onPress={() => {
                      if (!channel?.slug) return;
                      router.push(
                        `/channel/${channel.slug}/program/${p.slug}`,
                      );
                    }}
                  />
                ))}
              </ScrollView>
            )}

            <Text style={styles.section}>Episodios recientes</Text>
            {episodes.length === 0 ? (
              <EmptyState
                title="Sin episodios"
                description="Cuando publiques episodios aparecerán acá."
              />
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {episodes.map((ep) => (
                  <ContentCard
                    key={ep.id}
                    title={ep.title}
                    durationSeconds={ep.durationSeconds}
                    meta={
                      typeof ep.episodeNumber === "number"
                        ? `Episodio ${ep.episodeNumber}`
                        : undefined
                    }
                    onPress={() => router.push(`/watch/${ep.id}`)}
                  />
                ))}
              </ScrollView>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  content: { padding: spacing[4], gap: spacing[3] },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: "700" },
  sub: { color: colors.textSecondary, marginBottom: spacing[3] },
  card: {
    backgroundColor: colors.slate,
    borderRadius: 12,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing[1],
  },
  cardTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: "600" },
  meta: { color: colors.textMuted, fontSize: 14 },
  live: { color: colors.live, fontWeight: "600", marginTop: spacing[1] },
  section: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "600",
    marginTop: spacing[3],
  },
});
