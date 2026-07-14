"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  followChannel,
  followProgram,
  homeFeedQueryOptions,
  streamQueryOptions,
} from "@hypelive/api";
import { formatViewerCount } from "@hypelive/domain";
import { logger } from "@hypelive/analytics";
import { Share2, UserPlus, Check } from "lucide-react";
import { StreamingShell } from "@/components/layout/StreamingShell";
import { LiveChat } from "@/components/chat/LiveChat";
import {
  EndedRecommendations,
  FakePlayer,
  type PlayerMode,
} from "@/components/player/FakePlayer";
import { EpisodeCard } from "@/components/content/EpisodeCard";
import { ContentCard } from "@/components/content/ContentCard";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { apiOptions } from "@/lib/api-options";
import { normalizeHomeFeed, toStream } from "@/lib/models";

export default function LivePage({
  params,
}: {
  params: Promise<{ streamId: string }>;
}) {
  const { streamId } = use(params);
  const { user, profile, enterDemoSession } = useAuth();
  const { toast } = useToast();
  const [followingChannel, setFollowingChannel] = useState(false);
  const [followingProgram, setFollowingProgram] = useState(false);
  const [forceMode, setForceMode] = useState<PlayerMode | null>(null);

  const streamQuery = useQuery(streamQueryOptions(streamId, apiOptions()));
  const feedQuery = useQuery(homeFeedQueryOptions(apiOptions()));

  const stream = streamQuery.data ? toStream(streamQuery.data) : null;
  const feed = feedQuery.data ? normalizeHomeFeed(feedQuery.data) : null;

  const mode: PlayerMode = useMemo(() => {
    if (forceMode) return forceMode;
    if (!stream) return "live";
    if (stream.status === "ended") return "ended";
    if (stream.status === "failed") return "error";
    if (stream.status === "live") return "live";
    return "live";
  }, [forceMode, stream]);

  async function onFollowChannel() {
    if (!stream?.channelId) return;
    if (!user) enterDemoSession();
    try {
      await followChannel(
        {
          userId: profile?.id ?? user?.id ?? "demo-profile",
          channelId: stream.channelId,
        },
        apiOptions(),
      );
      setFollowingChannel(true);
      toast("Siguiendo canal", { tone: "success" });
    } catch (error) {
      logger.warn("Follow failed", error);
      toast("No se pudo seguir el canal", { tone: "error" });
    }
  }

  async function onFollowProgram() {
    if (!stream?.programId) return;
    if (!user) enterDemoSession();
    try {
      await followProgram(
        {
          userId: profile?.id ?? user?.id ?? "demo-profile",
          programId: stream.programId,
        },
        apiOptions(),
      );
      setFollowingProgram(true);
      toast("Siguiendo programa", { tone: "success" });
    } catch (error) {
      logger.warn("Follow program failed", error);
      toast("No se pudo seguir el programa", { tone: "error" });
    }
  }

  async function onShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: stream?.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast("Enlace copiado", { tone: "success" });
      }
    } catch {
      toast("No se pudo compartir", { tone: "error" });
    }
  }

  const channelHref = stream?.channel
    ? `/channel/${stream.channel.slug}`
    : null;
  const programHref =
    stream?.program && stream.channel
      ? `/channel/${stream.channel.slug}/program/${stream.program.slug}`
      : null;

  return (
    <StreamingShell>
      <div className="px-3 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {streamQuery.isLoading ? (
            <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
              <Skeleton className="aspect-video w-full rounded" />
              <Skeleton className="min-h-[420px] rounded" />
            </div>
          ) : null}

          {streamQuery.isError ? (
            <ErrorState onRetry={() => void streamQuery.refetch()} />
          ) : null}

          {!streamQuery.isLoading && !stream ? (
            <EmptyState
              title="Transmisión no encontrada"
              description="Es posible que haya finalizado o el enlace no sea válido."
              actionLabel="Volver al inicio"
              onAction={() => {
                window.location.href = "/home";
              }}
            />
          ) : null}

          {stream ? (
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div>
                <FakePlayer
                  id={stream.id}
                  title={stream.title}
                  mode={mode}
                  viewerCount={stream.viewerCount}
                />

                <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h1 className="text-xl font-bold text-text-primary sm:text-2xl">
                      {stream.title}
                    </h1>
                    <p className="mt-1 text-sm text-text-muted">
                      {channelHref && stream.channel ? (
                        <Link
                          href={channelHref}
                          className="hover:text-text-primary"
                        >
                          {stream.channel.name}
                        </Link>
                      ) : (
                        "Canal"
                      )}
                      {programHref && stream.program ? (
                        <>
                          {" · "}
                          <Link
                            href={programHref}
                            className="hover:text-text-primary"
                          >
                            {stream.program.title}
                          </Link>
                        </>
                      ) : stream.programId == null ? (
                        <span> · Evento especial</span>
                      ) : null}
                      {" · "}
                      {formatViewerCount(stream.viewerCount)} espectadores
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => void onFollowChannel()}
                      disabled={followingChannel}
                    >
                      {followingChannel ? (
                        <>
                          <Check className="size-4" /> Canal
                        </>
                      ) : (
                        <>
                          <UserPlus className="size-4" /> Seguir canal
                        </>
                      )}
                    </Button>
                    {stream.programId ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => void onFollowProgram()}
                        disabled={followingProgram}
                      >
                        {followingProgram ? (
                          <>
                            <Check className="size-4" /> Programa
                          </>
                        ) : (
                          <>
                            <UserPlus className="size-4" /> Seguir programa
                          </>
                        )}
                      </Button>
                    ) : null}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => void onShare()}
                    >
                      <Share2 className="size-4" /> Compartir
                    </Button>
                    {mode === "live" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setForceMode("reconnect")}
                      >
                        Simular reconexión
                      </Button>
                    ) : null}
                    {mode === "reconnect" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setForceMode("live")}
                      >
                        Recuperar
                      </Button>
                    ) : null}
                    {mode !== "ended" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setForceMode("ended")}
                      >
                        Fin
                      </Button>
                    ) : null}
                  </div>
                </div>

                {stream.description ? (
                  <p className="mt-3 max-w-2xl text-sm text-text-secondary">
                    {stream.description}
                  </p>
                ) : null}

                {mode === "ended" ? (
                  <EndedRecommendations>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {(feed?.recentEpisodes ?? []).slice(0, 4).map((ep) => (
                        <EpisodeCard key={ep.id} episode={ep} />
                      ))}
                      {(feed?.recentStreams ?? [])
                        .filter((s) => s.id !== stream.id)
                        .slice(0, 2)
                        .map((s) => (
                          <ContentCard
                            key={s.id}
                            item={s}
                            href={`/live/${s.id}`}
                          />
                        ))}
                    </div>
                  </EndedRecommendations>
                ) : null}
              </div>

              <div className="lg:sticky lg:top-20 lg:self-start">
                <LiveChat
                  streamId={stream.id}
                  enabled={mode === "live" || mode === "reconnect"}
                  className="h-[min(70vh,640px)]"
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </StreamingShell>
  );
}
