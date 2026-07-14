import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  chatQueryOptions,
  queryKeys,
  sendChatMessage,
} from "@hypelive/api";
import { colors, radii, spacing, touchTargets } from "@hypelive/design-tokens";
import { Button } from "./Button";
import { EmptyState } from "./EmptyState";
import { Skeleton } from "./Skeleton";
import { useAuth } from "../providers/AuthProvider";
import { getSupabase } from "../lib/supabase";

type Props = {
  streamId: string;
  visible: boolean;
};

export function ChatPanel({ streamId, visible }: Props) {
  const { profile } = useAuth();
  const [text, setText] = useState("");
  const queryClient = useQueryClient();
  const apiOpts = { supabase: getSupabase(), useMock: !getSupabase() };

  const { data, isLoading, isError, refetch } = useQuery(
    chatQueryOptions(streamId, apiOpts),
  );

  const mutation = useMutation({
    mutationFn: (content: string) =>
      sendChatMessage(
        {
          streamId,
          userId: profile?.id ?? "a1111111-1111-4111-8111-111111111105",
          content,
        },
        apiOpts,
      ),
    onSuccess: () => {
      setText("");
      void queryClient.invalidateQueries({ queryKey: queryKeys.chat(streamId) });
    },
  });

  if (!visible) return null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.wrap}
    >
      <Text style={styles.heading}>Chat</Text>
      {isLoading ? (
        <View style={styles.skel}>
          <Skeleton height={14} />
          <Skeleton height={14} width="70%" />
          <Skeleton height={14} width="55%" />
        </View>
      ) : isError ? (
        <EmptyState
          title="Chat no disponible"
          description="No se pudieron cargar los mensajes."
          actionLabel="Reintentar"
          onAction={() => void refetch()}
        />
      ) : !data?.length ? (
        <EmptyState
          title="Sin mensajes"
          description="Sé el primero en comentar."
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          style={styles.list}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.user}>
                {(item as { displayName?: string; username?: string })
                  .displayName ??
                  (item as { username?: string }).username ??
                  "Usuario"}
              </Text>
              <Text style={styles.msg}>{item.content}</Text>
            </View>
          )}
        />
      )}
      <View style={styles.composer}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Escribí un mensaje…"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          maxLength={280}
        />
        <Button
          label="Enviar"
          loading={mutation.isPending}
          disabled={!text.trim()}
          onPress={() => mutation.mutate(text.trim())}
          style={styles.send}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.charcoal,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing[3],
    minHeight: 220,
  },
  heading: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 16,
    marginBottom: spacing[2],
  },
  list: { flex: 1 },
  row: { marginBottom: spacing[2] },
  user: { color: colors.accentSoft, fontWeight: "600", fontSize: 13 },
  msg: { color: colors.textSecondary, fontSize: 14 },
  composer: {
    flexDirection: "row",
    gap: spacing[2],
    alignItems: "center",
    marginTop: spacing[2],
  },
  input: {
    flex: 1,
    minHeight: touchTargets.min,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.slate,
    color: colors.textPrimary,
    paddingHorizontal: spacing[3],
  },
  send: { paddingHorizontal: spacing[3] },
  skel: { gap: spacing[2], paddingVertical: spacing[3] },
});
