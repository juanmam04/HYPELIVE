"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { followProgram, programDetailQueryOptions } from "@hypelive/api";
import { logger } from "@hypelive/analytics";
import { StreamingShell } from "@/components/layout/StreamingShell";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EpisodeCard } from "@/components/content/EpisodeCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { LiveBadge } from "@/components/ui/LiveBadge";
import { Tabs } from "@/components/ui/Tabs";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { apiOptions } from "@/lib/api-options";
import {
  formatScheduleDate,
  formatScheduleTime,
  posterGradient,
  toChannel,
  toEpisode,
  toProgram,
  toStream,
} from "@/lib/models";

const TABS = [
  { id: "inicio", label: "Inicio" },
  { id: "episodios", label: "Episodios" },
  { id: "temporadas", label: "Temporadas" },
  { id: "acerca", label: "Acerca de" },
] as const;

export default function ProgramPage({
  params,
}: {
  params: Promise<{ channelSlug: string; programSlug: string }>;
}) {
  const { channelSlug, programSlug } = use(params);
  const { user, profile, enterDemoSession } = useAuth();
  const { toast } = useToast();
  const [following, setFollowing] = useState(false);
  const [tab, setTab] = useState("inicio");

  const detailQuery = useQuery(
    programDetailQueryOptions(channelSlug, programSlug, apiOptions()),
  );

  const detail = detailQuery.data;
  const channel = detail?.channel ? toChannel(detail.channel) : null;
  const program = detail?.program
    ? toProgram(detail.program, channel ? [channel] : [])
    : null;
  const liveStream = detail?.liveStream
    ? toStream(detail.liveStream, channel ? [channel] : [])
    : null;
  const upcoming = detail?.upcomingStream
    ? toStream(detail.upcomingStream, channel ? [channel] : [])
    : null;
  const episodes = (detail?.episodes ?? []).map((e) =>
    toEpisode(e, channel ? [channel] : []),
  );
  const latest = detail?.latestEpisode
    ? toEpisode(detail.latestEpisode, channel ? [channel] : [])
    : null;
  const seasons = detail?.seasons ?? [];
  const hosts = detail?.hosts ?? [];

  async function onFollow() {
    if (!program) return;
    if (!user) enterDemoSession();
    try {
      await followProgram(
        {
          userId: profile?.id ?? user?.id ?? "demo-profile",
          programId: program.id,
        },
        apiOptions(),
      );
      setFollowing(true);
      toast(`Sigues ${program.title}`, { tone: "success" });
    } catch (error) {
      logger.warn("Follow program failed", error);
      toast("No se pudo seguir el programa", { tone: "error" });
    }
  }

  return (
    <StreamingShell>
      <div className="px-4 py-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {detailQuery.isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full rounded" />
              <Skeleton className="h-24 w-full rounded" />
            </div>
          ) : null}

          {detailQuery.isError ? (
            <ErrorState onRetry={() => void detailQuery.refetch()} />
          ) : null}

          {!detailQuery.isLoading && !program ? (
            <EmptyState
              title="Programa no encontrado"
              description="Revisá el enlace o explorá el canal."
              actionLabel="Ver canal"
              onAction={() => {
                window.location.href = `/channel/${channelSlug}`;
              }}
            />
          ) : null}

          {program && channel ? (
            <div className="space-y-8">
              <section className="overflow-hidden rounded border border-border-subtle bg-slate">
                <div
                  className="relative h-44 sm:h-56"
                  style={{
                    backgroundImage: program.bannerUrl
                      ? `url(${program.bannerUrl})`
                      : program.coverUrl
                        ? `url(${program.coverUrl})`
                        : posterGradient(program.id + program.title),
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate via-ink/40 to-transparent" />
                </div>
                <div className="relative -mt-16 space-y-4 px-5 pb-5 sm:px-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <Link
                        href={`/channel/${channel.slug}`}
                        className="text-sm font-medium text-text-muted hover:text-text-primary"
                      >
                        {channel.name}
                      </Link>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
                          {program.title}
                        </h1>
                        {liveStream ? <LiveBadge compact /> : null}
                        {program.isActive ? (
                          <Badge tone="muted">Activo</Badge>
                        ) : null}
                      </div>
                      {program.scheduleDescription ? (
                        <p className="mt-2 text-sm text-text-secondary">
                          {program.scheduleDescription}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {liveStream ? (
                        <Link href={`/live/${liveStream.id}`}>
                          <Button>Ver en vivo</Button>
                        </Link>
                      ) : null}
                      <Button
                        variant={following ? "secondary" : "primary"}
                        onClick={() => void onFollow()}
                        disabled={following}
                      >
                        {following ? "Siguiendo" : "Seguir programa"}
                      </Button>
                    </div>
                  </div>

                  {hosts.length > 0 ? (
                    <div className="flex flex-wrap gap-3 border-t border-border-subtle pt-4">
                      {hosts.map((ph) => {
                        const host = ph.host;
                        if (!host) return null;
                        return (
                          <div
                            key={ph.id}
                            className="flex items-center gap-2"
                          >
                            <Avatar
                              name={host.name}
                              src={host.avatarUrl}
                              size="sm"
                            />
                            <div>
                              <p className="text-sm font-medium text-text-primary">
                                {host.name}
                              </p>
                              {ph.role ? (
                                <p className="text-xs text-text-muted">
                                  {ph.role}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </section>

              <Tabs value={tab} onChange={setTab} tabs={[...TABS]} />

              {tab === "inicio" ? (
                <div className="space-y-10">
                  {upcoming && !liveStream ? (
                    <section>
                      <h2 className="mb-3 text-xl font-bold text-text-primary">
                        Próximo episodio en vivo
                      </h2>
                      <Link
                        href={`/live/${upcoming.id}`}
                        className="block rounded border border-border-subtle bg-slate px-4 py-3 hover:bg-elevated"
                      >
                        <p className="font-semibold text-text-primary">
                          {upcoming.title}
                        </p>
                        <p className="mt-1 text-sm text-text-muted">
                          {formatScheduleTime(upcoming.scheduledAt)} ·{" "}
                          {formatScheduleDate(upcoming.scheduledAt)}
                        </p>
                      </Link>
                    </section>
                  ) : null}

                  {latest ? (
                    <section>
                      <h2 className="mb-4 text-xl font-bold text-text-primary">
                        Último episodio
                      </h2>
                      <div className="max-w-md">
                        <EpisodeCard episode={latest} />
                      </div>
                    </section>
                  ) : null}

                  <section>
                    <h2 className="mb-4 text-xl font-bold text-text-primary">
                      Episodios
                    </h2>
                    {episodes.length === 0 ? (
                      <EmptyState title="Sin episodios publicados" />
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {episodes.slice(0, 8).map((episode) => (
                          <EpisodeCard key={episode.id} episode={episode} />
                        ))}
                      </div>
                    )}
                  </section>
                </div>
              ) : null}

              {tab === "episodios" ? (
                <section>
                  {episodes.length === 0 ? (
                    <EmptyState title="Sin episodios publicados" />
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {episodes.map((episode) => (
                        <EpisodeCard key={episode.id} episode={episode} />
                      ))}
                    </div>
                  )}
                </section>
              ) : null}

              {tab === "temporadas" ? (
                <section>
                  {seasons.length === 0 ? (
                    <EmptyState title="Sin temporadas" />
                  ) : (
                    <ul className="divide-y divide-border-subtle overflow-hidden rounded border border-border-subtle bg-slate">
                      {seasons.map((season) => {
                        const count = episodes.filter(
                          (e) => e.seasonId === season.id,
                        ).length;
                        return (
                          <li
                            key={season.id}
                            className="flex items-center justify-between gap-4 px-4 py-3"
                          >
                            <div>
                              <p className="font-semibold text-text-primary">
                                {season.title}
                              </p>
                              <p className="text-sm text-text-muted">
                                {season.number != null
                                  ? `Temporada ${season.number}`
                                  : null}
                                {season.year ? ` · ${season.year}` : null}
                              </p>
                            </div>
                            <span className="text-sm text-text-muted">
                              {count} episodios
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </section>
              ) : null}

              {tab === "acerca" ? (
                <section className="max-w-2xl space-y-3">
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {program.description ?? "Sin descripción."}
                  </p>
                  {program.scheduleDescription ? (
                    <p className="text-sm text-text-muted">
                      Horario: {program.scheduleDescription}
                    </p>
                  ) : null}
                </section>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </StreamingShell>
  );
}
