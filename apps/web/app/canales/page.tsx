"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { homeFeedQueryOptions } from "@hypelive/api";
import { StreamingShell } from "@/components/layout/StreamingShell";
import { ChannelCard } from "@/components/content/ChannelCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { apiOptions } from "@/lib/api-options";
import { normalizeHomeFeed, type AppChannel } from "@/lib/models";

export default function CanalesPage() {
  const query = useQuery(homeFeedQueryOptions(apiOptions()));
  const feed = query.data ? normalizeHomeFeed(query.data) : null;
  const [q, setQ] = useState("");

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
    let list = Array.from(byId.values());
    const needle = q.trim().toLowerCase();
    if (needle) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(needle) ||
          c.slug.toLowerCase().includes(needle) ||
          c.description?.toLowerCase().includes(needle),
      );
    }
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [feed, q]);

  return (
    <StreamingShell>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="text-2xl font-bold text-text-primary">Canales</h1>
            <SearchInput
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onClear={() => setQ("")}
              placeholder="Filtrar canales…"
              className="w-full sm:max-w-sm"
            />
          </div>

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
