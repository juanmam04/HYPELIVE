"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { homeFeedQueryOptions } from "@hypelive/api";
import { StreamingShell } from "@/components/layout/StreamingShell";
import { ContentCard } from "@/components/content/ContentCard";
import { ChannelCard } from "@/components/content/ChannelCard";
import { ProgramCard } from "@/components/content/ProgramCard";
import { EpisodeCard } from "@/components/content/EpisodeCard";
import { ContentRow } from "@/components/ui/ContentRow";
import { PageLoader } from "@/components/ui/PageLoader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LiveBadge } from "@/components/ui/LiveBadge";
import { Button } from "@/components/ui/Button";
import { ReminderButton } from "@/components/ui/FollowButton";
import { apiOptions } from "@/lib/api-options";
import {
  formatScheduleDate,
  formatScheduleTime,
  normalizeHomeFeed,
} from "@/lib/models";
import { EMPTY_STATE } from "@hypelive/domain";

function SectionHeader({
  title,
  href,
}: {
  title: string;
  href?: string;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <h2 className="font-display text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">
        {title}
      </h2>
      {href ? (
        <Link
          href={href}
          className="text-sm font-medium text-text-muted hover:text-text-primary"
        >
          Ver todo
        </Link>
      ) : null}
    </div>
  );
}

const HERO_IMAGE = "/media/hero.jpg";

export default function HomePage() {
  const query = useQuery(homeFeedQueryOptions(apiOptions()));
  const feed = query.data ? normalizeHomeFeed(query.data) : null;
  const featured = feed?.featured;

  const liveRow = [
    ...(feed?.liveNow ?? []),
    ...(feed?.todaySchedule.filter((s) => s.status === "starting") ?? []),
  ];
  const liveForRow =
    liveRow.length >= 4
      ? liveRow
      : [...liveRow, ...(feed?.todaySchedule ?? [])].slice(0, 6);

  const programHref =
    featured?.program && featured.channel
      ? `/channel/${featured.channel.slug}/program/${featured.program.slug}`
      : featured?.channel
        ? `/channel/${featured.channel.slug}`
        : featured
          ? `/live/${featured.id}`
          : "/en-vivo";

  return (
    <StreamingShell>
      {!feed && query.isPending ? <PageLoader /> : null}

      {query.isError && !feed ? (
        <div className="px-4 py-10 sm:px-8">
          <ErrorState onRetry={() => void query.refetch()} />
        </div>
      ) : null}

      {feed ? (
        <>
          <section className="relative h-[min(58vh,560px)] min-h-[360px] w-full overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${featured?.thumbnailUrl ?? HERO_IMAGE})`,
              }}
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />

            <div className="relative mx-auto flex h-full max-w-[1920px] flex-col justify-end px-4 pb-8 pt-10 sm:px-8 sm:pb-10 lg:px-12 lg:pb-12">
              <div className="hero-enter max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  {featured?.status === "live" ? <LiveBadge /> : null}
                  {featured?.channel?.name ? (
                    <span className="text-sm font-medium text-text-secondary">
                      {featured.channel.name}
                    </span>
                  ) : null}
                  {featured?.program?.title ? (
                    <span className="text-sm text-text-muted">
                      · {featured.program.title}
                    </span>
                  ) : null}
                </div>

                <h1 className="font-display mt-3 text-3xl font-semibold leading-[1.12] tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
                  {featured?.title ?? "Transmisión destacada"}
                </h1>

                <p className="mt-2 line-clamp-2 max-w-xl text-sm text-text-secondary sm:text-base">
                  {featured?.description ??
                    "Programa en vivo desde el estudio."}
                </p>

                {featured ? (
                  <div className="hero-enter-delay mt-5 flex flex-wrap gap-3">
                    <Link href={`/live/${featured.id}`}>
                      <Button size="lg">Ver en vivo</Button>
                    </Link>
                    <Link href={programHref}>
                      <Button size="lg" variant="secondary">
                        Más info
                      </Button>
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <section className="relative z-10 -mt-2 bg-ink px-4 pb-6 pt-2 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-[1920px]">
              <SectionHeader title="En vivo ahora" href="/en-vivo" />
              {liveForRow.length === 0 ? (
                <EmptyState
                  title={EMPTY_STATE.noLiveStreams}
                  description="Mirá las próximas transmisiones más abajo."
                />
              ) : (
                <ContentRow ariaLabel="En vivo ahora">
                  {liveForRow.map((stream) => (
                    <div
                      key={stream.id}
                      role="listitem"
                      className="w-[200px] shrink-0 snap-start sm:w-[220px] lg:w-[240px]"
                    >
                      <ContentCard item={stream} href={`/live/${stream.id}`} />
                    </div>
                  ))}
                </ContentRow>
              )}
            </div>
          </section>

          <div className="mx-auto max-w-[1920px] space-y-10 px-4 pb-16 sm:px-8 lg:px-12">
            <section>
              <SectionHeader title="Canales destacados" href="/canales" />
              {feed.featuredChannels.length === 0 ? (
                <EmptyState title="Sin canales" />
              ) : (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {feed.featuredChannels.slice(0, 4).map((channel) => (
                    <ChannelCard key={channel.id} channel={channel} />
                  ))}
                </div>
              )}
            </section>

            <section>
              <SectionHeader title="Programas populares" href="/programas" />
              <ContentRow ariaLabel="Programas populares">
                {feed.popularPrograms.slice(0, 8).map((program) => (
                  <div
                    key={program.id}
                    role="listitem"
                    className="w-[200px] shrink-0 snap-start sm:w-[220px]"
                  >
                    <ProgramCard program={program} />
                  </div>
                ))}
              </ContentRow>
            </section>

            <section>
              <SectionHeader title="Episodios recientes" />
              {feed.recentEpisodes.length === 0 ? (
                <EmptyState title={EMPTY_STATE.programNoEpisodes} />
              ) : (
                <ContentRow ariaLabel="Episodios recientes">
                  {feed.recentEpisodes.slice(0, 8).map((episode) => (
                    <div
                      key={episode.id}
                      role="listitem"
                      className="w-[200px] shrink-0 snap-start sm:w-[220px]"
                    >
                      <EpisodeCard episode={episode} />
                    </div>
                  ))}
                </ContentRow>
              )}
            </section>

            <section>
              <SectionHeader title="Próximas transmisiones" href="/en-vivo" />
              {feed.todaySchedule.length === 0 ? (
                <EmptyState title="Sin próximas transmisiones" />
              ) : (
                <div className="overflow-hidden rounded border border-border-subtle bg-slate">
                  <ul className="divide-y divide-border-subtle">
                    {feed.todaySchedule.slice(0, 6).map((stream) => (
                      <li
                        key={stream.id}
                        className="flex flex-col gap-2 px-4 py-3 transition-colors hover:bg-elevated sm:flex-row sm:items-center sm:gap-6"
                      >
                        <Link
                          href={`/live/${stream.id}`}
                          className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-6"
                        >
                          <span className="w-28 shrink-0 text-sm font-semibold tabular-nums text-text-secondary">
                            {formatScheduleTime(stream.scheduledAt)}
                            <span className="mt-0.5 block text-xs font-normal text-text-muted">
                              {formatScheduleDate(stream.scheduledAt)}
                            </span>
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-semibold text-text-primary">
                              {stream.title}
                            </span>
                            <span className="block truncate text-sm text-text-muted">
                              {[stream.program?.title, stream.channel?.name]
                                .filter(Boolean)
                                .join(" · ")}
                            </span>
                          </span>
                        </Link>
                        <ReminderButton />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            <section>
              <SectionHeader title="Seguir viendo" href="/mi-lista" />
              {feed.continueWatching.length === 0 ? (
                <EmptyState
                  title="Todavía no hay progreso."
                  description="Los episodios que empieces a ver aparecen acá."
                  actionLabel="Explorar programas"
                  onAction={() => {
                    window.location.href = "/programas";
                  }}
                />
              ) : (
                <ContentRow ariaLabel="Seguir viendo">
                  {feed.continueWatching.slice(0, 8).map((episode) => (
                    <div
                      key={episode.id}
                      role="listitem"
                      className="w-[200px] shrink-0 snap-start sm:w-[220px]"
                    >
                      <EpisodeCard
                        episode={episode}
                        progressSeconds={episode.progressSeconds}
                      />
                    </div>
                  ))}
                </ContentRow>
              )}
            </section>
          </div>
        </>
      ) : null}
    </StreamingShell>
  );
}
