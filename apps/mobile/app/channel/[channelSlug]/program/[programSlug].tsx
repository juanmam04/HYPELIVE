import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { programDetailQueryOptions } from "@hypelive/api";
import { colors, spacing } from "@hypelive/design-tokens";
import { ContentCard } from "../../../../src/components/ContentCard";
import { EmptyState } from "../../../../src/components/EmptyState";
import { ErrorState } from "../../../../src/components/ErrorState";
import { Skeleton } from "../../../../src/components/Skeleton";
import { getSupabase } from "../../../../src/lib/supabase";

export default function ProgramScreen() {
  const { channelSlug, programSlug } = useLocalSearchParams<{
    channelSlug: string;
    programSlug: string;
  }>();
  const apiOpts = { supabase: getSupabase(), useMock: !getSupabase() };

  const { data, isLoading, isError, refetch } = useQuery(
    programDetailQueryOptions(channelSlug!, programSlug!, apiOpts),
  );

  if (isLoading) {
    return (
      <View style={styles.pad}>
        <Skeleton height={28} width="70%" />
        <Skeleton height={16} width="40%" style={{ marginTop: 12 }} />
        <Skeleton height={120} style={{ marginTop: 24 }} />
      </View>
    );
  }

  if (isError) return <ErrorState onRetry={() => void refetch()} />;
  if (!data?.program) {
    return (
      <EmptyState
        title="Programa no encontrado"
        description="Revisá el enlace o explorá el canal."
      />
    );
  }

  const { program, channel, liveStream, episodes, hosts } = data;

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.channel} onPress={() => router.push(`/channel/${channel.slug}`)}>
          {channel.name}
        </Text>
        <Text style={styles.title}>{program.title}</Text>
        {program.description ? (
          <Text style={styles.desc}>{program.description}</Text>
        ) : null}
        {program.scheduleDescription ? (
          <Text style={styles.meta}>{program.scheduleDescription}</Text>
        ) : null}
        {hosts.length > 0 ? (
          <Text style={styles.meta}>
            Con {hosts.map((h) => h.host?.name ?? "Host").join(", ")}
          </Text>
        ) : null}

        {liveStream ? (
          <>
            <Text style={styles.section}>En vivo</Text>
            <ContentCard
              title={liveStream.title}
              live
              viewers={liveStream.viewerCount}
              onPress={() => router.push(`/live/${liveStream.id}`)}
            />
          </>
        ) : null}

        <Text style={styles.section}>Episodios</Text>
        {episodes.length === 0 ? (
          <EmptyState title="Sin episodios publicados" />
        ) : (
          <View style={styles.list}>
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
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  content: { padding: spacing[4], gap: spacing[2], paddingBottom: spacing[10] },
  pad: { flex: 1, padding: spacing[4], backgroundColor: colors.ink },
  channel: {
    color: colors.accentSoft,
    fontSize: 14,
    fontWeight: "600",
    minHeight: 44,
    textAlignVertical: "center",
  },
  title: { color: colors.textPrimary, fontSize: 26, fontWeight: "700" },
  desc: { color: colors.textSecondary, fontSize: 15, marginTop: spacing[1] },
  meta: { color: colors.textMuted, fontSize: 14 },
  section: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "600",
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },
  list: { gap: spacing[2] },
});
