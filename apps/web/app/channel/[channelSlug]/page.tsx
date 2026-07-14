"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { channelDetailQueryOptions, followChannel } from "@hypelive/api";
import { formatViewerCount } from "@hypelive/domain";
import { logger } from "@hypelive/analytics";
import { StreamingShell } from "@/components/layout/StreamingShell";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ContentCard } from "@/components/content/ContentCard";
import { ProgramCard } from "@/components/content/ProgramCard";
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
  { id: "programas", label: "Programas" },
  { id: "programacion", label: "Programación" },
  { id: "episodios", label: "Episodios" },
  { id: "acerca", label: "Acerca de" },
] as const;

export default function ChannelPage({
  params,
}: {
  params: Promise<{ channelSlug: string }>;
}) {
  const { channelSlug } = use(params);
  const { user, profile, enterDemoSession } = useAuth();
  const { toast } = useToast();
  const [following, setFollowing] = useState(false);
  const [tab, setTab] = useState<string>("inicio");

  const detailQuery = useQuery(
    channelDetailQueryOptions(channelSlug, apiOptions()),
  );

  const detail = detailQuery.data;
  const channel = detail?.channel ? toChannel(detail.channel) : null;
  const liveStream = detail?.liveStream
    ? toStream(detail.liveStream, channel ? [channel] : [])
    : null;
  const nextStream = detail?.nextStream
    ? toStream(detail.nextStream, channel ? [channel] : [])
    : null;
  const programs = (detail?.programs ?? []).map((p) =>
    toProgram(p, channel ? [channel] : []),
  );
  const schedule = (detail?.schedule ?? []).map((s) =>
    toStream(s, channel ? [channel] : []),
  );
  const episodes = (detail?.recentEpisodes ?? []).map((e) =>
    toEpisode(e, channel ? [channel] : []),
  );
  const specialEvents = (detail?.specialEvents ?? []).map((s) =>
    toStream(s, channel ? [channel] : []),
  );

  async function onFollow() {
    if (!channel) return;
    if (!user) enterDemoSession();
    try {
      await followChannel(
        {
          userId: profile?.id ?? user?.id ?? "demo-profile",
          channelId: channel.id,
        },
        apiOptions(),
      );
      setFollowing(true);
      toast(`Sigues a ${channel.name}`, { tone: "success" });
    } catch (error) {
      logger.warn("Follow failed", error);
      toast("No se pudo seguir el canal", { tone: "error" });
    }
  }

  return (
    <StreamingShell>
      <div className="px-4 py-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {detailQuery.isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-40 w-full rounded" />
              <Skeleton className="h-20 w-full rounded" />
            </div>
          ) : null}

          {detailQuery.isError ? (
            <ErrorState onRetry={() => void detailQuery.refetch()} />
          ) : null}

          {!detailQuery.isLoading && !channel ? (
            <EmptyState
              title="Canal no encontrado"
              description="Revisá el enlace o explorá otros canales."
              actionLabel="Ir al inicio"
              onAction={() => {
                window.location.href = "/home";
              }}
            />
          ) : null}

          {channel ? (
            <div className="space-y-8">
              <section className="overflow-hidden rounded border border-border-subtle bg-slate">
                <div
                  className="h-36 sm:h-44"
                  style={{
                    backgroundImage: channel.bannerUrl
                      ? `url(${channel.bannerUrl})`
                      : posterGradient(channel.id + channel.slug),
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex items-end gap-4">
                    <Avatar
                      name={channel.name}
                      src={channel.avatarUrl}
                      size="lg"
                      className="-mt-12 ring-4 ring-slate"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
                          {channel.name}
                        </h1>
                        {channel.isVerified ? (
                          <Badge tone="accent">Verificado</Badge>
                        ) : null}
                        {liveStream ? <LiveBadge compact /> : null}
                      </div>
                      <p className="mt-1 text-sm text-text-muted">
                        {formatViewerCount(channel.followerCount)} seguidores
                        {typeof channel.programCount === "number"
                          ? ` · ${channel.programCount} programas`
                          : null}
                        {liveStream?.program?.title
                          ? ` · ${liveStream.program.title}`
                          : channel.liveProgramTitle
                            ? ` · ${channel.liveProgramTitle}`
                            : null}
                      </p>
                    </div>
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
                      {following ? "Siguiendo" : "Seguir"}
                    </Button>
                  </div>
                </div>
              </section>

              <Tabs
                value={tab}
                onChange={setTab}
                tabs={[...TABS]}
                className="w-full overflow-x-auto"
              />

              {tab === "inicio" ? (
                <div className="space-y-10">
                  {liveStream ? (
                    <section>
                      <h2 className="mb-4 text-xl font-bold text-text-primary">
                        En vivo
                      </h2>
                      <div className="max-w-md">
                        <ContentCard
                          item={liveStream}
                          href={`/live/${liveStream.id}`}
                        />
                      </div>
                    </section>
                  ) : nextStream ? (
                    <section>
                      <h2 className="mb-4 text-xl font-bold text-text-primary">
                        Próxima transmisión
                      </h2>
                      <Link
                        href={`/live/${nextStream.id}`}
                        className="block rounded border border-border-subtle bg-slate px-4 py-3 hover:bg-elevated"
                      >
                        <p className="font-semibold text-text-primary">
                          {nextStream.title}
                        </p>
                        <p className="mt-1 text-sm text-text-muted">
                          {formatScheduleTime(nextStream.scheduledAt)} ·{" "}
                          {formatScheduleDate(nextStream.scheduledAt)}
                        </p>
                      </Link>
                    </section>
                  ) : null}

                  <section>
                    <h2 className="mb-4 text-xl font-bold text-text-primary">
                      Programas
                    </h2>
                    {programs.length === 0 ? (
                      <EmptyState title="Sin programas publicados" />
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {programs.slice(0, 4).map((program) => (
                          <ProgramCard
                            key={program.id}
                            program={program}
                            channelSlug={channel.slug}
                          />
                        ))}
                      </div>
                    )}
                  </section>

                  <section>
                    <h2 className="mb-4 text-xl font-bold text-text-primary">
                      Episodios recientes
                    </h2>
                    {episodes.length === 0 ? (
                      <EmptyState title="Sin episodios todavía" />
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {episodes.slice(0, 4).map((episode) => (
                          <EpisodeCard key={episode.id} episode={episode} />
                        ))}
                      </div>
                    )}
                  </section>
                </div>
              ) : null}

              {tab === "programas" ? (
                <section>
                  {programs.length === 0 ? (
                    <EmptyState title="Sin programas publicados" />
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {programs.map((program) => (
                        <ProgramCard
                          key={program.id}
                          program={program}
                          channelSlug={channel.slug}
                        />
                      ))}
                    </div>
                  )}
                </section>
              ) : null}

              {tab === "programacion" ? (
                <section>
                  {schedule.length === 0 && specialEvents.length === 0 ? (
                    <EmptyState title="Nada programado por ahora" />
                  ) : (
                    <div className="overflow-hidden rounded border border-border-subtle">
                      <ul className="divide-y divide-border-subtle bg-slate">
                        {schedule.map((stream) => (
                          <li key={stream.id}>
                            <Link
                              href={`/live/${stream.id}`}
                              className="flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-elevated sm:flex-row sm:items-center sm:gap-6"
                            >
                              <span className="w-28 shrink-0 text-sm font-semibold tabular-nums text-text-secondary">
                                {formatScheduleTime(stream.scheduledAt)}
                                <span className="mt-0.5 block text-xs font-normal text-text-muted">
                                  {formatScheduleDate(stream.scheduledAt)}
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
                                  {stream.program?.title ??
                                    (stream.programId == null
                                      ? "Evento especial"
                                      : null)}
                                </span>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              ) : null}

              {tab === "episodios" ? (
                <section>
                  {episodes.length === 0 ? (
                    <EmptyState title="Sin episodios todavía" />
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {episodes.map((episode) => (
                        <EpisodeCard key={episode.id} episode={episode} />
                      ))}
                    </div>
                  )}
                </section>
              ) : null}

              {tab === "acerca" ? (
                <section className="max-w-2xl space-y-4">
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {channel.description ?? "Sin descripción."}
                  </p>
                  {specialEvents.length > 0 ? (
                    <div>
                      <h3 className="mb-2 font-semibold text-text-primary">
                        Eventos especiales
                      </h3>
                      <ul className="space-y-2 text-sm text-text-muted">
                        {specialEvents.map((ev) => (
                          <li key={ev.id}>
                            <Link
                              href={`/live/${ev.id}`}
                              className="hover:text-text-primary"
                            >
                              {ev.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
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
