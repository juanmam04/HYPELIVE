"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  episodeQueryOptions,
  getNextEpisode,
  getPreviousEpisode,
  relatedEpisodesQueryOptions,
  upsertWatchProgress,
  watchProgressQueryOptions,
} from "@hypelive/api";
import { formatDuration } from "@hypelive/domain";
import { logger } from "@hypelive/analytics";
import { StreamingShell } from "@/components/layout/StreamingShell";
import { FakePlayer, type PlayerMode } from "@/components/player/FakePlayer";
import { EpisodeCard } from "@/components/content/EpisodeCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/providers/AuthProvider";
import { apiOptions } from "@/lib/api-options";
import {
  formatEpisodeLabel,
  formatScheduleDate,
  toEpisode,
} from "@/lib/models";

export default function WatchEpisodePage({
  params,
}: {
  params: Promise<{ episodeId: string }>;
}) {
  const { episodeId } = use(params);
  const { user, profile } = useAuth();
  const [forceMode, setForceMode] = useState<PlayerMode | null>(null);

  const episodeQuery = useQuery(
    episodeQueryOptions(episodeId, apiOptions()),
  );
  const progressQuery = useQuery({
    ...watchProgressQueryOptions(
      profile?.id ?? user?.id ?? "demo-profile",
      episodeId,
      apiOptions(),
    ),
    enabled: Boolean(user || profile),
  });
  const relatedQuery = useQuery(
    relatedEpisodesQueryOptions(episodeId, apiOptions()),
  );
  const nextPrevQuery = useQuery({
    queryKey: ["episode-nav", episodeId],
    queryFn: async () => {
      const [next, prev] = await Promise.all([
        getNextEpisode(episodeId, apiOptions()),
        getPreviousEpisode(episodeId, apiOptions()),
      ]);
      return { next, prev };
    },
  });

  const episode = episodeQuery.data
    ? toEpisode(episodeQuery.data)
    : null;
  const related = (relatedQuery.data ?? []).map((e) => toEpisode(e));
  const progressSeconds =
    progressQuery.data?.progressSeconds ??
    (episode && episode.durationSeconds > 0
      ? Math.floor(episode.durationSeconds * 0.12)
      : 0);

  const mode: PlayerMode = useMemo(() => {
    if (forceMode) return forceMode;
    if (!episode) return "vod";
    if (episode.status === "processing") return "processing";
    if (episode.status === "unavailable" || episode.status === "archived")
      return "unavailable";
    if (episode.status === "draft") return "unavailable";
    return "vod";
  }, [forceMode, episode]);

  async function onProgressChange(seconds: number) {
    if (!episode || !user) return;
    try {
      await upsertWatchProgress(
        {
          userId: profile?.id ?? user.id,
          episodeId: episode.id,
          progressSeconds: seconds,
        },
        apiOptions(),
      );
    } catch (error) {
      logger.debug("Progress upsert skipped", error);
    }
  }

  const programLink =
    episode?.program && episode.channel
      ? `/channel/${episode.channel.slug}/program/${episode.program.slug}`
      : episode?.channel
        ? `/channel/${episode.channel.slug}`
        : null;

  return (
    <StreamingShell>
      <div className="px-3 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {episodeQuery.isLoading ? (
            <Skeleton className="aspect-video w-full rounded" />
          ) : null}

          {episodeQuery.isError ? (
            <ErrorState onRetry={() => void episodeQuery.refetch()} />
          ) : null}

          {!episodeQuery.isLoading && !episode ? (
            <EmptyState
              title="Episodio no disponible"
              description="Puede haber sido eliminado o aún no está listo."
              actionLabel="Ir al inicio"
              onAction={() => {
                window.location.href = "/home";
              }}
            />
          ) : null}

          {episode ? (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div>
                <FakePlayer
                  id={episode.id}
                  title={episode.title}
                  mode={mode}
                  duration={episode.durationSeconds}
                  progress={progressSeconds}
                  onProgressChange={(s) => void onProgressChange(s)}
                />

                <div className="mt-3">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-text-muted">
                    {formatEpisodeLabel(episode) ? (
                      <span>{formatEpisodeLabel(episode)}</span>
                    ) : null}
                    {episode.airedAt || episode.publishedAt ? (
                      <span>
                        ·{" "}
                        {formatScheduleDate(
                          episode.airedAt ?? episode.publishedAt,
                        )}
                      </span>
                    ) : null}
                  </div>
                  <h1 className="mt-1 text-xl font-bold text-text-primary sm:text-2xl">
                    {episode.title}
                  </h1>
                  <p className="mt-1 text-sm text-text-muted">
                    {episode.program?.title ? (
                      programLink ? (
                        <Link
                          href={programLink}
                          className="hover:text-text-primary"
                        >
                          {episode.program.title}
                        </Link>
                      ) : (
                        episode.program.title
                      )
                    ) : null}
                    {episode.channel ? (
                      <>
                        {" · "}
                        <Link
                          href={`/channel/${episode.channel.slug}`}
                          className="hover:text-text-primary"
                        >
                          {episode.channel.name}
                        </Link>
                      </>
                    ) : null}
                    {episode.durationSeconds > 0
                      ? ` · ${formatDuration(episode.durationSeconds)}`
                      : null}
                  </p>
                  {episode.description ? (
                    <p className="mt-3 max-w-2xl text-sm text-text-secondary">
                      {episode.description}
                    </p>
                  ) : null}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {nextPrevQuery.data?.prev ? (
                    <Link href={`/watch/${nextPrevQuery.data.prev.id}`}>
                      <Button size="sm" variant="secondary">
                        Anterior
                      </Button>
                    </Link>
                  ) : null}
                  {nextPrevQuery.data?.next ? (
                    <Link href={`/watch/${nextPrevQuery.data.next.id}`}>
                      <Button size="sm" variant="secondary">
                        Siguiente
                      </Button>
                    </Link>
                  ) : null}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setForceMode("processing")}
                  >
                    Procesando
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setForceMode("unavailable")}
                  >
                    No disponible
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setForceMode(null)}
                  >
                    Reset
                  </Button>
                </div>
              </div>

              <aside>
                <h2 className="mb-3 text-sm font-semibold text-text-secondary">
                  Más del programa
                </h2>
                <div className="space-y-3">
                  {related.length === 0 ? (
                    <EmptyState title="Sin más episodios" />
                  ) : (
                    related.slice(0, 6).map((item) => (
                      <EpisodeCard key={item.id} episode={item} />
                    ))
                  )}
                </div>
              </aside>
            </div>
          ) : null}
        </div>
      </div>
    </StreamingShell>
  );
}
