import { useState } from "react";
import { ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  followChannel,
  streamQueryOptions,
} from "@hypelive/api";
import { APP_NAME, formatViewerCount } from "@hypelive/domain";
import { colors, spacing } from "@hypelive/design-tokens";
import { Button } from "../../src/components/Button";
import { ChatPanel } from "../../src/components/ChatPanel";
import { EmptyState } from "../../src/components/EmptyState";
import { ErrorState } from "../../src/components/ErrorState";
import { FakePlayer } from "../../src/components/FakePlayer";
import { Skeleton } from "../../src/components/Skeleton";
import { useAuth } from "../../src/providers/AuthProvider";
import { getSupabase } from "../../src/lib/supabase";

export default function LiveScreen() {
  const { streamId } = useLocalSearchParams<{ streamId: string }>();
  const { profile } = useAuth();
  const [chatOpen, setChatOpen] = useState(true);
  const [following, setFollowing] = useState(false);
  const apiOpts = { supabase: getSupabase(), useMock: !getSupabase() };

  const { data, isLoading, isError, refetch } = useQuery(
    streamQueryOptions(streamId!, apiOpts),
  );

  const followMutation = useMutation({
    mutationFn: async () => {
      if (!data) return;
      await followChannel(
        {
          userId: profile?.id ?? "guest-profile",
          channelId: data.channelId,
        },
        apiOpts,
      );
    },
    onSuccess: () => setFollowing(true),
  });

  if (isLoading) {
    return (
      <View style={styles.pad}>
        <Skeleton height={220} />
        <Skeleton height={20} width="70%" style={{ marginTop: 16 }} />
      </View>
    );
  }

  if (isError) {
    return <ErrorState onRetry={() => void refetch()} />;
  }

  if (!data) {
    return (
      <EmptyState
        title="Stream no encontrado"
        description="El enlace puede haber expirado."
      />
    );
  }

  const stream = data;
  const channel = stream.channel;
  const program = stream.program;

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <FakePlayer title={stream.title} live={stream.status === "live"} />
        <Text style={styles.title}>{stream.title}</Text>
        {program ? (
          <Text
            style={styles.link}
            onPress={() => {
              if (channel?.slug && program.slug) {
                router.push(
                  `/channel/${channel.slug}/program/${program.slug}`,
                );
              }
            }}
          >
            {program.title}
          </Text>
        ) : null}
        {channel ? (
          <Text
            style={styles.link}
            onPress={() => router.push(`/channel/${channel.slug}`)}
          >
            {channel.name}
          </Text>
        ) : null}
        <Text style={styles.meta}>
          {formatViewerCount(stream.viewerCount ?? 0)} espectadores
        </Text>
        {stream.description ? (
          <Text style={styles.desc}>{stream.description}</Text>
        ) : null}

        <View style={styles.actions}>
          <Button
            label={chatOpen ? "Ocultar chat" : "Mostrar chat"}
            variant="secondary"
            onPress={() => setChatOpen((v) => !v)}
            style={styles.action}
          />
          <Button
            label={following ? "Siguiendo" : "Seguir"}
            variant={following ? "ghost" : "primary"}
            loading={followMutation.isPending}
            onPress={() => followMutation.mutate()}
            style={styles.action}
          />
          <Button
            label="Compartir"
            variant="secondary"
            onPress={() =>
              void Share.share({
                message: `Mirá ${stream.title} en ${APP_NAME}: hypelive://live/${stream.id}`,
              })
            }
            style={styles.action}
          />
        </View>
      </ScrollView>
      <ChatPanel streamId={stream.id} visible={chatOpen} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  content: { padding: spacing[4], gap: spacing[2] },
  pad: { flex: 1, padding: spacing[4], backgroundColor: colors.ink },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: "700" },
  link: {
    color: colors.accentSoft,
    fontSize: 15,
    fontWeight: "600",
    minHeight: 44,
    textAlignVertical: "center",
  },
  meta: { color: colors.textMuted, fontSize: 14 },
  desc: { color: colors.textSecondary, fontSize: 15, marginTop: spacing[1] },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
    marginTop: spacing[3],
  },
  action: { flexGrow: 1 },
});
