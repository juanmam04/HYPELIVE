import { useEffect, useMemo, useState } from "react";
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import {
  mockChannels,
  mockEpisodes,
  mockPrograms,
  mockStreams,
} from "@hypelive/api";
import { colors, radii, spacing, touchTargets } from "@hypelive/design-tokens";
import { Button } from "../src/components/Button";
import { ChannelCard } from "../src/components/ChannelCard";
import { ContentCard } from "../src/components/ContentCard";
import { EmptyState } from "../src/components/EmptyState";
import { OVERSCAN } from "../src/lib/theme";

export default function SearchScreen() {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      router.back();
      return true;
    });
    return () => sub.remove();
  }, []);

  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!q) {
      return {
        streams: mockStreams.filter((s) => s.status === "live"),
        episodes: mockEpisodes.filter((e) => e.status === "published").slice(0, 12),
        programs: mockPrograms.filter((p) => p.isActive).slice(0, 12),
        channels: mockChannels,
      };
    }
    return {
      streams: mockStreams.filter((s) => s.title.toLowerCase().includes(q)),
      episodes: mockEpisodes.filter((e) => e.title.toLowerCase().includes(q)),
      programs: mockPrograms.filter((p) => p.title.toLowerCase().includes(q)),
      channels: mockChannels.filter(
        (c) =>
          c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q),
      ),
    };
  }, [q]);

  const empty =
    results.streams.length +
      results.episodes.length +
      results.programs.length +
      results.channels.length ===
    0;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Buscar</Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Canales, programas, episodios…"
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        autoFocus={false}
      />
      <Button label="Atrás" variant="ghost" onPress={() => router.back()} />

      {empty ? (
        <EmptyState
          title="Sin resultados"
          description="Probá con otro término."
        />
      ) : (
        <>
          <Text style={styles.section}>En vivo / streams</Text>
          <ScrollView horizontal>
            {results.streams.map((s) => (
              <ContentCard
                key={s.id}
                title={s.title}
                live={s.status === "live"}
                viewers={s.viewerCount}
                onPress={() => router.push(`/live/${s.id}`)}
              />
            ))}
          </ScrollView>

          <Text style={styles.section}>Canales</Text>
          <ScrollView horizontal>
            {results.channels.map((c) => (
              <ChannelCard
                key={c.id}
                name={c.name}
                slug={c.slug}
                followerCount={c.followerCount}
                onPress={() => router.push(`/channel/${c.slug}`)}
              />
            ))}
          </ScrollView>

          <Text style={styles.section}>Programas</Text>
          <ScrollView horizontal>
            {results.programs.map((p) => {
              const channel = mockChannels.find((c) => c.id === p.channelId);
              return (
                <ContentCard
                  key={p.id}
                  title={p.title}
                  live={p.isLive}
                  onPress={() => {
                    if (!channel) return;
                    router.push(`/channel/${channel.slug}/program/${p.slug}`);
                  }}
                />
              );
            })}
          </ScrollView>

          <Text style={styles.section}>Episodios</Text>
          <ScrollView horizontal>
            {results.episodes.map((ep) => (
              <ContentCard
                key={ep.id}
                title={ep.title}
                durationSeconds={ep.durationSeconds}
                onPress={() => router.push(`/watch/${ep.id}`)}
              />
            ))}
          </ScrollView>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ink },
  content: { padding: OVERSCAN, gap: spacing[3] },
  title: { color: colors.textPrimary, fontSize: 40, fontWeight: "700" },
  input: {
    minHeight: touchTargets.tv,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.slate,
    color: colors.textPrimary,
    paddingHorizontal: spacing[4],
    fontSize: 22,
  },
  section: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "600",
    marginTop: spacing[4],
  },
});
