"use client";

import { useQuery } from "@tanstack/react-query";
import { homeFeedQueryOptions } from "@hypelive/api";
import { StreamingShell } from "@/components/layout/StreamingShell";
import { ProgramCard } from "@/components/content/ProgramCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { apiOptions } from "@/lib/api-options";
import { normalizeHomeFeed } from "@/lib/models";

export default function ProgramasPage() {
  const query = useQuery(homeFeedQueryOptions(apiOptions()));
  const feed = query.data ? normalizeHomeFeed(query.data) : null;
  const programs = feed?.popularPrograms ?? [];

  return (
    <StreamingShell>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-6 text-2xl font-bold text-text-primary">
            Programas
          </h1>

          {query.isLoading ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-video rounded" />
              ))}
            </div>
          ) : null}

          {query.isError ? (
            <ErrorState onRetry={() => void query.refetch()} />
          ) : null}

          {feed && !query.isLoading ? (
            programs.length === 0 ? (
              <EmptyState title="Sin programas" />
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {programs.map((program) => (
                  <ProgramCard key={program.id} program={program} />
                ))}
              </div>
            )
          ) : null}
        </div>
      </div>
    </StreamingShell>
  );
}
