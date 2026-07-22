"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { homeFeedQueryOptions } from "@hypelive/api";
import { StreamingShell } from "@/components/layout/StreamingShell";
import { ContentCard } from "@/components/content/ContentCard";
import { PageLoader } from "@/components/ui/PageLoader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LiveBadge } from "@/components/ui/LiveBadge";
import { apiOptions } from "@/lib/api-options";
import {
  formatScheduleDate,
  formatScheduleTime,
  normalizeHomeFeed,
} from "@/lib/models";

export default function EnVivoPage() {
  const query = useQuery(homeFeedQueryOptions(apiOptions()));
  const feed = query.data ? normalizeHomeFeed(query.data) : null;
  const upcoming = feed?.todaySchedule ?? [];

  return (
    <StreamingShell>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
          {!feed && query.isPending ? <PageLoader /> : null}

          {query.isError && !feed ? (
            <ErrorState onRetry={() => void query.refetch()} />
          ) : null}

          {feed ? (
            <>
              <section>
                <h2 className="mb-4 text-xl font-bold text-text-primary sm:text-2xl">
                  En vivo ahora
                </h2>
                {feed.liveNow.length === 0 ? (
                  <EmptyState
                    title="Nadie está en vivo"
                    description="Revisá la guía del día o las próximas transmisiones."
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {feed.liveNow.map((stream) => (
                      <ContentCard
                        key={stream.id}
                        item={stream}
                        href={`/live/${stream.id}`}
                      />
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h2 className="mb-4 text-xl font-bold text-text-primary sm:text-2xl">
                  Guía del día / próximas
                </h2>
                {upcoming.length === 0 ? (
                  <EmptyState title="Sin próximas transmisiones" />
                ) : (
                  <div className="overflow-hidden rounded border border-border-subtle">
                    <ul className="divide-y divide-border-subtle bg-slate">
                      {upcoming.map((stream) => (
                        <li key={stream.id}>
                          <Link
                            href={`/live/${stream.id}`}
                            className="flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-elevated sm:flex-row sm:items-center sm:gap-6"
                          >
                            <span className="w-28 shrink-0 text-sm font-semibold tabular-nums text-text-secondary">
                              {formatScheduleTime(
                                stream.scheduledAt ?? stream.startedAt,
                              )}
                              <span className="mt-0.5 block text-xs font-normal text-text-muted">
                                {formatScheduleDate(
                                  stream.scheduledAt ?? stream.startedAt,
                                )}
                              </span>
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center gap-2">
                                {stream.status === "live" ? (
                                  <LiveBadge compact />
                                ) : null}
                                <span className="truncate font-semibold text-text-primary">
                                  {stream.title}
                                </span>
                              </span>
                              <span className="mt-0.5 block truncate text-sm text-text-muted">
                                {[stream.program?.title, stream.channel?.name]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            </>
          ) : null}
        </div>
      </div>
    </StreamingShell>
  );
}
