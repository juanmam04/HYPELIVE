"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { homeFeedQueryOptions } from "@hypelive/api";
import { StreamingShell } from "@/components/layout/StreamingShell";
import { EpisodeCard } from "@/components/content/EpisodeCard";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { apiOptions } from "@/lib/api-options";
import { normalizeHomeFeed } from "@/lib/models";
import { useAuth } from "@/providers/AuthProvider";

export default function MiListaPage() {
  const { user } = useAuth();
  const query = useQuery(homeFeedQueryOptions(apiOptions()));
  const feed = query.data ? normalizeHomeFeed(query.data) : null;

  return (
    <StreamingShell>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-6 text-2xl font-bold text-text-primary">
            Mi lista
          </h1>

          {!user ? (
            <div className="rounded border border-border-subtle bg-slate px-5 py-8 text-center sm:px-8">
              <h2 className="text-lg font-bold text-text-primary">
                Iniciá sesión para ver tu lista
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
                Guardá progreso y retomá donde lo dejaste en tus episodios.
              </p>
              <Link href="/login" className="mt-5 inline-block">
                <Button>Iniciar sesión</Button>
              </Link>
            </div>
          ) : (
            <>
              {query.isLoading ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-video rounded" />
                  ))}
                </div>
              ) : null}

              {query.isError ? (
                <ErrorState onRetry={() => void query.refetch()} />
              ) : null}

              {feed && !query.isLoading ? (
                feed.continueWatching.length === 0 ? (
                  <EmptyState
                    title="Tu lista está vacía"
                    description="Cuando veas un episodio, aparecerá aquí."
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {feed.continueWatching.map((episode) => (
                      <EpisodeCard
                        key={episode.id}
                        episode={episode}
                        progressSeconds={episode.progressSeconds}
                      />
                    ))}
                  </div>
                )
              ) : null}
            </>
          )}
        </div>
      </div>
    </StreamingShell>
  );
}
