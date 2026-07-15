"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { homeFeedQueryOptions } from "@hypelive/api";
import { BookmarkCheck } from "lucide-react";
import { StreamingShell } from "@/components/layout/StreamingShell";
import { EpisodeCard } from "@/components/content/EpisodeCard";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Thumbnail } from "@/components/ui/Thumbnail";
import { apiOptions } from "@/lib/api-options";
import { normalizeHomeFeed } from "@/lib/models";
import { useAuth } from "@/providers/AuthProvider";
import { useWatchlist } from "@/lib/watchlist";
import { cn } from "@/lib/cn";
import { useState } from "react";

type Tab = "saved" | "continue";

export default function MiListaPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("saved");
  const watchlist = useWatchlist();
  const query = useQuery(homeFeedQueryOptions(apiOptions()));
  const feed = query.data ? normalizeHomeFeed(query.data) : null;

  return (
    <StreamingShell>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-2 text-2xl font-bold text-text-primary">Mi lista</h1>
          <p className="mb-5 text-sm text-text-muted">
            Guardados y progreso de visionado.
          </p>

          <div className="mb-6 flex gap-2">
            <button
              type="button"
              onClick={() => setTab("saved")}
              className={cn(
                "rounded px-3 py-1.5 text-sm font-medium",
                tab === "saved"
                  ? "bg-accent text-text-on-accent"
                  : "bg-slate text-text-muted",
              )}
            >
              Guardados
            </button>
            <button
              type="button"
              onClick={() => setTab("continue")}
              className={cn(
                "rounded px-3 py-1.5 text-sm font-medium",
                tab === "continue"
                  ? "bg-accent text-text-on-accent"
                  : "bg-slate text-text-muted",
              )}
            >
              Seguir viendo
            </button>
          </div>

          {tab === "saved" ? (
            !watchlist.hydrated ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-video rounded" />
                ))}
              </div>
            ) : watchlist.items.length === 0 ? (
              <EmptyState
                title="Nada guardado todavía"
                description="Usá el botón Guardar en episodios y programas para armar tu lista."
                actionLabel="Explorar programas"
                onAction={() => {
                  window.location.href = "/programas";
                }}
              />
            ) : (
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {watchlist.items.map((item) => (
                  <li key={`${item.kind}-${item.id}`}>
                    <div className="overflow-hidden rounded border border-border-subtle bg-slate">
                      <Link href={item.href} className="block">
                        <div className="relative aspect-video bg-charcoal">
                          <Thumbnail
                            src={item.thumbnailUrl}
                            seed={item.id + item.title}
                          />
                        </div>
                        <div className="p-3">
                          <p className="text-[11px] uppercase text-text-muted">
                            {item.kind === "episode"
                              ? "Episodio"
                              : item.kind === "program"
                                ? "Programa"
                                : "Canal"}
                          </p>
                          <p className="font-semibold text-text-primary">
                            {item.title}
                          </p>
                          {item.subtitle ? (
                            <p className="text-sm text-text-muted">
                              {item.subtitle}
                            </p>
                          ) : null}
                        </div>
                      </Link>
                      <div className="border-t border-border-subtle px-3 py-2">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary"
                          onClick={() => watchlist.remove(item.kind, item.id)}
                        >
                          <BookmarkCheck className="size-4" />
                          Quitar
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )
          ) : !user ? (
            <div className="rounded border border-border-subtle bg-slate px-5 py-8 text-center sm:px-8">
              <h2 className="text-lg font-bold text-text-primary">
                Iniciá sesión para ver tu progreso
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
                Retomá episodios donde los dejaste.
              </p>
              <Link href="/login?next=/mi-lista" className="mt-5 inline-block">
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
                    title="Sin progreso todavía"
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
