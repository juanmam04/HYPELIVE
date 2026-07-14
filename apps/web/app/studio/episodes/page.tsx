"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { studioQueryOptions } from "@hypelive/api";
import { StreamingShell } from "@/components/layout/StreamingShell";
import { EpisodeCard } from "@/components/content/EpisodeCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Button } from "@/components/ui/Button";
import { apiOptions } from "@/lib/api-options";
import { normalizeStudioSummary } from "@/lib/models";

export default function StudioEpisodesPage() {
  const query = useQuery(studioQueryOptions(undefined, apiOptions()));
  const studio = query.data ? normalizeStudioSummary(query.data) : null;

  return (
    <StreamingShell>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Episodios</h1>
              <p className="mt-1 text-sm text-text-muted">
                Episodios publicados y en borrador de{" "}
                {studio?.channel?.name ?? "tu canal"}.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/studio/recordings">
                <Button variant="secondary" size="sm">
                  Grabaciones
                </Button>
              </Link>
              <Link href="/studio">
                <Button variant="secondary" size="sm">
                  ← Studio
                </Button>
              </Link>
            </div>
          </div>

          {query.isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-video rounded" />
              ))}
            </div>
          ) : null}

          {query.isError ? (
            <ErrorState onRetry={() => void query.refetch()} />
          ) : null}

          {studio && !query.isLoading ? (
            studio.recentEpisodes.length === 0 ? (
              <EmptyState title="Todavía no hay episodios disponibles." />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {studio.recentEpisodes.map((episode) => (
                  <EpisodeCard key={episode.id} episode={episode} />
                ))}
              </div>
            )
          ) : null}
        </div>
      </div>
    </StreamingShell>
  );
}
