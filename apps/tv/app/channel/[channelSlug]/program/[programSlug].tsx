import { useEffect } from "react";
import { BackHandler, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { programDetailQueryOptions } from "@hypelive/api";
import { colors, spacing } from "@hypelive/design-tokens";
import { Button } from "../../../../src/components/Button";
import { ContentCard } from "../../../../src/components/ContentCard";
import { EmptyState } from "../../../../src/components/EmptyState";
import { ErrorState } from "../../../../src/components/ErrorState";
import { Skeleton } from "../../../../src/components/Skeleton";
import { OVERSCAN } from "../../../../src/lib/theme";

export default function ProgramScreen() {
  const { channelSlug, programSlug } = useLocalSearchParams<{
    channelSlug: string;
    programSlug: string;
  }>();
  const { data, isLoading, isError, refetch } = useQuery(
    programDetailQueryOptions(channelSlug!, programSlug!, { useMock: true }),
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
        <Skeleton height={48} width="50%" />
        <View style={{ marginTop: 24 }}>
          <Skeleton height={200} />
        </View>
      </View>
    );
  }
  if (isError) return <ErrorState onRetry={() => void refetch()} />;
  if (!data?.program) return <EmptyState title="Programa no encontrado" />;

  const { program, channel, liveStream, episodes } = data;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Button label="Atrás" variant="ghost" onPress={() => router.back()} />
      <Text style={styles.channel}>{channel.name}</Text>
      <Text style={styles.title}>{program.title}</Text>
      {program.description ? (
        <Text style={styles.desc}>{program.description}</Text>
      ) : null}

      {liveStream ? (
        <>
          <Text style={styles.section}>En vivo</Text>
          <ContentCard
            title={liveStream.title}
            live
            viewers={liveStream.viewerCount}
            hasTVPreferredFocus
            onPress={() => router.push(`/live/${liveStream.id}`)}
          />
        </>
      ) : null}

      <Text style={styles.section}>Episodios</Text>
      <ScrollView horizontal>
        {episodes.length === 0 ? (
          <EmptyState title="Sin episodios" />
        ) : (
          episodes.map((ep, i) => (
            <ContentCard
              key={ep.id}
              title={ep.title}
              durationSeconds={ep.durationSeconds}
              subtitle={
                typeof ep.episodeNumber === "number"
                  ? `Episodio ${ep.episodeNumber}`
                  : undefined
              }
              hasTVPreferredFocus={!liveStream && i === 0}
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
  content: { padding: OVERSCAN, gap: spacing[3], paddingBottom: spacing[10] },
  pad: { flex: 1, padding: OVERSCAN, backgroundColor: colors.ink },
  channel: { color: colors.accentSoft, fontSize: 20, fontWeight: "600" },
  title: { color: colors.textPrimary, fontSize: 40, fontWeight: "700" },
  desc: { color: colors.textSecondary, fontSize: 22, maxWidth: 900 },
  section: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: "600",
    marginTop: spacing[4],
  },
});
