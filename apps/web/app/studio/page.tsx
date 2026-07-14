"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { studioQueryOptions } from "@hypelive/api";
import { formatViewerCount } from "@hypelive/domain";
import { Radio, Eye, Users, Clock, Film, Disc } from "lucide-react";
import { StreamingShell } from "@/components/layout/StreamingShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ContentCard } from "@/components/content/ContentCard";
import { ProgramCard } from "@/components/content/ProgramCard";
import { EpisodeCard } from "@/components/content/EpisodeCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { apiOptions } from "@/lib/api-options";
import {
  formatScheduleTime,
  normalizeStudioSummary,
  posterGradient,
} from "@/lib/models";

export default function StudioPage() {
  const query = useQuery(studioQueryOptions(undefined, apiOptions()));
  const studio = query.data ? normalizeStudioSummary(query.data) : null;

  return (
    <StreamingShell>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
                {studio?.channel?.name ?? "Tu canal"}
              </h1>
              <p className="mt-1 text-sm text-text-muted">
                Resumen, programas, episodios y grabaciones.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/studio/programs">
                <Button variant="secondary" size="sm">
                  <Film className="size-4" />
                  Programas
                </Button>
              </Link>
              <Link href="/studio/episodes">
                <Button variant="secondary" size="sm">
                  Episodios
                </Button>
              </Link>
              <Link href="/studio/recordings">
                <Button variant="secondary" size="sm">
                  <Disc className="size-4" />
                  Grabaciones
                </Button>
              </Link>
              <Link href="/studio/go-live">
                <Button>
                  <Radio className="size-4" />
                  Ir en vivo
                </Button>
              </Link>
            </div>
          </div>

          {query.isLoading ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded" />
              ))}
            </div>
          ) : null}

          {query.isError ? (
            <ErrorState onRetry={() => void query.refetch()} />
          ) : null}

          {studio ? (
            <div className="space-y-10">
              <section className="grid gap-3 sm:grid-cols-3">
                <Metric
                  icon={<Users className="size-4" />}
                  label="Seguidores"
                  value={formatViewerCount(studio.metrics.followers)}
                />
                <Metric
                  icon={<Eye className="size-4" />}
                  label="Vistas totales"
                  value={formatViewerCount(studio.metrics.totalViews)}
                />
                <Metric
                  icon={<Clock className="size-4" />}
                  label="Horas emitidas"
                  value={String(studio.metrics.hoursStreamed)}
                />
              </section>

              <section className="overflow-hidden rounded border border-border-subtle bg-slate">
                <div
                  className="h-24"
                  style={{
                    backgroundImage: studio.nextStream?.thumbnailUrl
                      ? `url(${studio.nextStream.thumbnailUrl})`
                      : posterGradient(studio.nextStream?.id ?? "next-stream"),
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                  <div>
                    <Badge tone="muted">Próxima transmisión</Badge>
                    <h2 className="mt-2 text-xl font-bold text-text-primary">
                      {studio.nextStream?.title ?? "Sin título programado"}
                    </h2>
                    <p className="mt-1 text-sm text-text-muted">
                      {formatScheduleTime(
                        studio.nextStream?.scheduledAt ?? null,
                      )}
                      {studio.liveStream ? " · Ya hay una señal en vivo" : null}
                    </p>
                  </div>
                  <Link href="/studio/go-live">
                    <Button variant="secondary" size="sm">
                      Preparar go-live
                    </Button>
                  </Link>
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-end justify-between">
                  <h2 className="text-xl font-bold text-text-primary">
                    Programas
                  </h2>
                  <Link
                    href="/studio/programs"
                    className="text-sm text-text-muted hover:text-text-primary"
                  >
                    Ver todos
                  </Link>
                </div>
                {studio.programs.length === 0 ? (
                  <EmptyState title="Aún no hay programas" />
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {studio.programs.map((program) => (
                      <ProgramCard
                        key={program.id}
                        program={program}
                        channelSlug={studio.channel?.slug}
                      />
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h2 className="mb-4 text-xl font-bold text-text-primary">
                  Episodios recientes
                </h2>
                {studio.recentEpisodes.length === 0 ? (
                  <EmptyState title="Sin episodios todavía" />
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {studio.recentEpisodes.map((episode) => (
                      <EpisodeCard key={episode.id} episode={episode} />
                    ))}
                  </div>
                )}
              </section>

              <section>
                <div className="mb-4 flex items-end justify-between">
                  <h2 className="text-xl font-bold text-text-primary">
                    Historial de transmisiones
                  </h2>
                  <Link
                    href="/studio/recordings"
                    className="text-sm text-text-muted hover:text-text-primary"
                  >
                    Grabaciones
                  </Link>
                </div>
                {studio.recentStreams.length === 0 ? (
                  <EmptyState title="Sin historial todavía" />
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {studio.recentStreams.map((stream) => (
                      <ContentCard
                        key={stream.id}
                        item={stream}
                        href={`/live/${stream.id}`}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>
          ) : null}
        </div>
      </div>
    </StreamingShell>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded border border-border-subtle bg-slate p-4">
      <div className="flex items-center gap-2 text-text-muted">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold tabular-nums text-text-primary">
        {value}
      </p>
    </div>
  );
}
