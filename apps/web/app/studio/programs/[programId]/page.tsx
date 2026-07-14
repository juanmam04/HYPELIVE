"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { studioQueryOptions } from "@hypelive/api";
import { StreamingShell } from "@/components/layout/StreamingShell";
import { Button } from "@/components/ui/Button";
import { EpisodeCard } from "@/components/content/EpisodeCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { apiOptions } from "@/lib/api-options";
import { normalizeStudioSummary } from "@/lib/models";

export default function StudioProgramDetailPage() {
  const params = useParams<{ programId: string }>();
  const programId = params.programId;
  const query = useQuery(studioQueryOptions(undefined, apiOptions()));
  const studio = query.data ? normalizeStudioSummary(query.data) : null;
  const program = studio?.programs.find((p) => p.id === programId);

  return (
    <StreamingShell>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-text-muted">
                <Link href="/studio/programs" className="hover:text-text-primary">
                  Programas
                </Link>
                {" / "}
                {program?.title ?? "Programa"}
              </p>
              <h1 className="mt-1 text-2xl font-bold text-text-primary">
                {program?.title ?? "Programa"}
              </h1>
              {program?.scheduleDescription ? (
                <p className="mt-1 text-sm text-text-muted">
                  {program.scheduleDescription}
                </p>
              ) : null}
            </div>
            <Link href="/studio/programs">
              <Button variant="secondary" size="sm">
                ← Volver
              </Button>
            </Link>
          </div>

          {query.isLoading ? <Skeleton className="h-40 w-full rounded" /> : null}
          {query.isError ? (
            <ErrorState onRetry={() => void query.refetch()} />
          ) : null}

          {studio && !program && !query.isLoading ? (
            <EmptyState title="No encontramos este programa." />
          ) : null}

          {program ? (
            <div className="space-y-8">
              <section className="rounded border border-border-subtle bg-slate p-5">
                <h2 className="text-lg font-semibold text-text-primary">
                  Detalle
                </h2>
                <p className="mt-2 text-sm text-text-secondary">
                  {program.description ?? "Sin descripción."}
                </p>
                <p className="mt-3 text-xs text-text-muted">
                  Slug: {program.slug} ·{" "}
                  {program.isActive ? "Activo" : "Inactivo"}
                </p>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-semibold text-text-primary">
                  Episodios recientes del canal
                </h2>
                {studio!.recentEpisodes.filter(
                  (e) => e.programId === program.id,
                ).length === 0 ? (
                  <EmptyState title="Todavía no hay episodios disponibles." />
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {studio!.recentEpisodes
                      .filter((e) => e.programId === program.id)
                      .map((episode) => (
                        <EpisodeCard key={episode.id} episode={episode} />
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
