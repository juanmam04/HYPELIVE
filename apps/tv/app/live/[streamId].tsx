import { useEffect, useState } from "react";
import { BackHandler, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import {
  chatQueryOptions,
  streamQueryOptions,
} from "@hypelive/api";
import { formatViewerCount } from "@hypelive/domain";
import { colors, spacing } from "@hypelive/design-tokens";
import { Button } from "../../src/components/Button";
import { EmptyState } from "../../src/components/EmptyState";
import { ErrorState } from "../../src/components/ErrorState";
import { FakePlayer } from "../../src/components/FakePlayer";
import { LiveBadge } from "../../src/components/LiveBadge";
import { Skeleton } from "../../src/components/Skeleton";
import { apiOptions } from "../../src/lib/api-options";
import { OVERSCAN } from "../../src/lib/theme";

export default function LiveScreen() {
  const { streamId } = useLocalSearchParams<{ streamId: string }>();
  const [chatOpen, setChatOpen] = useState(true);
  const [paused, setPaused] = useState(false);
  const opts = apiOptions();

  const { data, isLoading, isError, refetch } = useQuery(
    streamQueryOptions(streamId!, opts),
  );
  const chat = useQuery(chatQueryOptions(streamId!, opts));

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
        <Skeleton height={400} />
      </View>
    );
  }
  if (isError) return <ErrorState onRetry={() => void refetch()} />;
  if (!data) return <EmptyState title="Stream no encontrado" />;

  const stream = data;
  const program = stream.program;
  const channel = stream.channel;

  return (
    <View style={styles.screen}>
      <FakePlayer
        title={paused ? `${stream.title} (pausa)` : stream.title}
        live={stream.status === "live"}
        fullscreen
      />

      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.top}>
          <LiveBadge />
          <Text style={styles.title}>{stream.title}</Text>
          {program ? (
            <Text style={styles.program}>{program.title}</Text>
          ) : null}
          {channel ? (
            <Text style={styles.channel}>{channel.name}</Text>
          ) : null}
          <Text style={styles.meta}>
            {formatViewerCount(stream.viewerCount ?? 0)} espectadores
          </Text>
        </View>

        <View style={styles.controls}>
          <Button
            label={paused ? "Reproducir" : "Pausa"}
            hasTVPreferredFocus
            onPress={() => setPaused((p) => !p)}
          />
          <Button
            label={chatOpen ? "Ocultar chat" : "Ver chat"}
            variant="secondary"
            onPress={() => setChatOpen((v) => !v)}
          />
          {program && channel ? (
            <Button
              label="Ver programa"
              variant="secondary"
              onPress={() =>
                router.push(
                  `/channel/${channel.slug}/program/${program.slug}`,
                )
              }
            />
          ) : null}
          <Button label="Atrás" variant="ghost" onPress={() => router.back()} />
        </View>
      </View>

      {chatOpen ? (
        <View style={styles.chat}>
          <Text style={styles.chatTitle}>Chat (solo lectura)</Text>
          <Text style={styles.chatHint}>
            Comentá desde el teléfono — en TV no se escribe.
          </Text>
          {(chat.data ?? []).slice(-6).map((m) => (
            <Text key={m.id} style={styles.chatLine}>
              <Text style={styles.chatUser}>
                {(m as { displayName?: string }).displayName ?? "Usuario"}:{" "}
              </Text>
              {m.content}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ink },
  pad: { flex: 1, padding: OVERSCAN, backgroundColor: colors.ink },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    padding: OVERSCAN,
    justifyContent: "space-between",
  },
  top: { gap: spacing[2], maxWidth: "60%" },
  title: { color: colors.textPrimary, fontSize: 32, fontWeight: "700" },
  program: { color: colors.accentSoft, fontSize: 22, fontWeight: "600" },
  channel: { color: colors.textSecondary, fontSize: 20 },
  meta: { color: colors.textSecondary, fontSize: 20 },
  controls: {
    flexDirection: "row",
    gap: spacing[3],
    flexWrap: "wrap",
    marginBottom: spacing[4],
  },
  chat: {
    position: "absolute",
    right: OVERSCAN,
    top: OVERSCAN,
    bottom: "25%",
    width: 360,
    backgroundColor: colors.overlay,
    borderRadius: 12,
    padding: spacing[4],
    gap: spacing[2],
  },
  chatTitle: { color: colors.textPrimary, fontSize: 20, fontWeight: "700" },
  chatHint: { color: colors.textMuted, fontSize: 14, marginBottom: spacing[2] },
  chatLine: { color: colors.textSecondary, fontSize: 16 },
  chatUser: { color: colors.accentSoft, fontWeight: "600" },
});
