"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { homeFeedQueryOptions } from "@hypelive/api";
import { StreamingShell } from "@/components/layout/StreamingShell";
import { ChannelCard } from "@/components/content/ChannelCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { apiOptions } from "@/lib/api-options";
import { normalizeHomeFeed, type AppChannel } from "@/lib/models";

export default function CanalesPage() {
  const query = useQuery(homeFeedQueryOptions(apiOptions()));
  const feed = query.data ? normalizeHomeFeed(query.data) : null;

  const channels = useMemo(() => {
    if (!feed) return [] as AppChannel[];
    const byId = new Map<string, AppChannel>();
    for (const channel of feed.featuredChannels) {
      byId.set(channel.id, channel);
    }
    for (const program of feed.popularPrograms) {
      if (program.channel && !byId.has(program.channel.id)) {
        byId.set(program.channel.id, program.channel);
      }
    }
    for (const stream of [...feed.liveNow, ...feed.todaySchedule]) {
      if (stream.channel && !byId.has(stream.channel.id)) {
        byId.set(stream.channel.id, stream.channel);
      }
    }
    return Array.from(byId.values());
  }, [feed]);

  return (
    <StreamingShell>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-6 text-2xl font-bold text-text-primary">
            Canales
          </h1>

          {query.isLoading ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded" />
              ))}
            </div>
          ) : null}

          {query.isError ? (
            <ErrorState onRetry={() => void query.refetch()} />
          ) : null}

          {feed && !query.isLoading ? (
            channels.length === 0 ? (
              <EmptyState title="Sin canales" />
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {channels.map((channel) => (
                  <ChannelCard key={channel.id} channel={channel} />
                ))}
              </div>
            )
          ) : null}
        </div>
      </div>
    </StreamingShell>
  );
}
