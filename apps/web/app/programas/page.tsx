"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { homeFeedQueryOptions } from "@hypelive/api";
import { StreamingShell } from "@/components/layout/StreamingShell";
import { ProgramCard } from "@/components/content/ProgramCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { apiOptions } from "@/lib/api-options";
import { normalizeHomeFeed } from "@/lib/models";
import { cn } from "@/lib/cn";

type Sort = "az" | "za" | "channel";

export default function ProgramasPage() {
  const query = useQuery(homeFeedQueryOptions(apiOptions()));
  const feed = query.data ? normalizeHomeFeed(query.data) : null;
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("az");

  const programs = useMemo(() => {
    let list = [...(feed?.popularPrograms ?? [])];
    const needle = q.trim().toLowerCase();
    if (needle) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(needle) ||
          p.channel?.name?.toLowerCase().includes(needle) ||
          p.description?.toLowerCase().includes(needle),
      );
    }
    list.sort((a, b) => {
      if (sort === "channel") {
        return (a.channel?.name ?? "").localeCompare(b.channel?.name ?? "");
      }
      const cmp = a.title.localeCompare(b.title);
      return sort === "za" ? -cmp : cmp;
    });
    return list;
  }, [feed, q, sort]);

  return (
    <StreamingShell>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="text-2xl font-bold text-text-primary">Programas</h1>
            <div className="flex w-full flex-col gap-2 sm:max-w-md sm:flex-row">
              <SearchInput
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onClear={() => setQ("")}
                placeholder="Filtrar programas…"
                className="flex-1"
              />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className={cn(
                  "h-11 rounded-md border border-border bg-slate px-3 text-sm text-text-primary",
                )}
                aria-label="Ordenar"
              >
                <option value="az">A–Z</option>
                <option value="za">Z–A</option>
                <option value="channel">Por canal</option>
              </select>
            </div>
          </div>

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
