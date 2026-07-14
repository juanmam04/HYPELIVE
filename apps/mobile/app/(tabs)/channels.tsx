import { ScrollView, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { featuredChannelsQueryOptions } from "@hypelive/api";
import { colors, spacing } from "@hypelive/design-tokens";
import { ChannelCard } from "../../src/components/ChannelCard";
import { EmptyState } from "../../src/components/EmptyState";
import { ErrorState } from "../../src/components/ErrorState";
import { SkeletonCard } from "../../src/components/Skeleton";
import { getSupabase } from "../../src/lib/supabase";

export default function ChannelsScreen() {
  const apiOpts = { supabase: getSupabase(), useMock: !getSupabase() };
  const { data, isLoading, isError, refetch } = useQuery(
    featuredChannelsQueryOptions(apiOpts),
  );

  const channels = data ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Canales</Text>
        <Text style={styles.sub}>Explorá canales y sus programas.</Text>

        {isError ? (
          <ErrorState onRetry={() => void refetch()} />
        ) : isLoading ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <SkeletonCard />
            <SkeletonCard />
          </ScrollView>
        ) : channels.length === 0 ? (
          <EmptyState title="Sin canales" />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
          </ScrollView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  content: { padding: spacing[4], gap: spacing[3] },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: "700" },
  sub: { color: colors.textSecondary, marginBottom: spacing[2] },
});
