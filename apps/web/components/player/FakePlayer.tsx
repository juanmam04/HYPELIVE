"use client";

import { useEffect, useRef, useState } from "react";
import {
  Maximize2,
  Pause,
  Play,
  Volume2,
  WifiOff,
  Loader2,
  Radio,
} from "lucide-react";
import { formatDuration, formatViewerCount } from "@hypelive/domain";
import { logger } from "@hypelive/analytics";
import { LiveBadge } from "@/components/ui/LiveBadge";
import Link from "next/link";
import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";
import { PlayerSkeleton } from "@/components/ui/ContentSkeletons";
import { cn } from "@/lib/cn";
import { posterGradient } from "@/lib/models";

export type PlayerMode =
  | "idle"
  | "loading"
  | "live"
  | "vod"
  | "paused"
  | "buffering"
  | "ended"
  | "reconnect"
  | "processing"
  | "error"
  | "unavailable";

export function FakePlayer({
  id,
  title,
  mode = "live",
  viewerCount,
  progress = 0,
  duration = 0,
  onProgressChange,
  channelHref,
  replayHref,
  nextLabel,
  className,
}: {
  id: string;
  title: string;
  mode?: PlayerMode;
  viewerCount?: number;
  progress?: number;
  duration?: number;
  onProgressChange?: (seconds: number) => void;
  channelHref?: string;
  replayHref?: string;
  nextLabel?: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(
    mode === "live" || mode === "vod" || mode === "paused",
  );
  const [localProgress, setLocalProgress] = useState(progress);
  const [showControls, setShowControls] = useState(true);
  const [bootLoading, setBootLoading] = useState(mode === "loading" || mode === "idle");
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    setLocalProgress(progress);
  }, [progress]);

  useEffect(() => {
    if (mode === "loading" || mode === "idle") {
      setBootLoading(true);
      const t = window.setTimeout(() => setBootLoading(false), 480);
      return () => window.clearTimeout(t);
    }
    setBootLoading(false);
    return undefined;
  }, [mode, id]);

  useEffect(() => {
    if (!playing || mode !== "vod" || duration <= 0) return;
    const timer = window.setInterval(() => {
      setLocalProgress((prev) => {
        const next = Math.min(duration, prev + 1);
        onProgressChange?.(next);
        return next;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [playing, mode, duration, onProgressChange]);

  function bumpControls() {
    setShowControls(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (playing && (mode === "live" || mode === "vod")) {
        setShowControls(false);
      }
    }, 2600);
  }

  useEffect(() => {
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, []);

  const overlayTitle =
    mode === "ended"
      ? "Transmisión finalizada"
      : mode === "reconnect"
        ? "Reconectando…"
        : mode === "processing"
          ? "Estamos preparando la repetición."
          : mode === "error"
            ? "Error de reproducción"
            : mode === "unavailable"
              ? "Este episodio no está disponible."
              : null;

  const isLiveMode = mode === "live";
  const showPlaySurface =
    !overlayTitle && !bootLoading && mode !== "buffering";

  if (bootLoading && mode === "loading") {
    return <PlayerSkeleton />;
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded border border-border-subtle bg-charcoal",
        className,
      )}
      onMouseMove={bumpControls}
      onMouseLeave={() => {
        if (playing) setShowControls(false);
      }}
      onFocusCapture={bumpControls}
    >
      <div
        className="relative aspect-video w-full"
        style={{ background: posterGradient(id + title) }}
      >
        <div className="pointer-events-none absolute inset-0 bg-ink/25" />

        {bootLoading ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-ink/40">
            <Loader2 className="size-7 animate-spin text-text-secondary" />
          </div>
        ) : null}

        {mode === "buffering" ? (
          <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/70 p-3">
            <Loader2 className="size-5 animate-spin text-white" />
          </div>
        ) : null}

        {isLiveMode ? (
          <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
            <LiveBadge />
            {typeof viewerCount === "number" ? (
              <span className="rounded bg-ink/80 px-2 py-1 text-xs text-text-secondary">
                {formatViewerCount(viewerCount)} viendo
              </span>
            ) : null}
          </div>
        ) : null}

        {overlayTitle ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-ink/75 px-4 text-center">
            {mode === "reconnect" ? (
              <WifiOff className="size-7 text-text-muted" />
            ) : mode === "ended" ? (
              <Radio className="size-7 text-text-muted" />
            ) : null}
            <p className="text-lg font-semibold text-text-primary sm:text-xl">
              {overlayTitle}
            </p>
            {mode === "reconnect" ? (
              <p className="text-sm text-text-muted">
                Intentando recuperar la señal
              </p>
            ) : null}
            {mode === "ended" ? (
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {replayHref ? (
                  <Link href={replayHref}>
                    <Button size="sm">Ver repetición</Button>
                  </Link>
                ) : null}
                {channelHref ? (
                  <Link href={channelHref}>
                    <Button size="sm" variant="secondary">
                      Volver al canal
                    </Button>
                  </Link>
                ) : null}
                {nextLabel ? (
                  <p className="w-full text-sm text-text-muted">{nextLabel}</p>
                ) : null}
              </div>
            ) : null}
            {mode === "error" ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  logger.warn("Player retry", { id });
                  setBootLoading(true);
                  window.setTimeout(() => setBootLoading(false), 600);
                }}
              >
                Reintentar
              </Button>
            ) : null}
          </div>
        ) : null}

        {showPlaySurface ? (
          <button
            type="button"
            className={cn(
              "absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-fast",
              showControls || !playing ? "opacity-100" : "opacity-0",
            )}
            onClick={() => {
              setPlaying((p) => !p);
              bumpControls();
            }}
            aria-label={playing ? "Pausar" : "Reproducir"}
          >
            <span className="btn-press flex size-14 items-center justify-center rounded-full bg-ink/70 text-white hover:bg-ink/85">
              {playing ? (
                <Pause className="size-6" />
              ) : (
                <Play className="size-6 translate-x-0.5" />
              )}
            </span>
          </button>
        ) : null}

        <div
          className={cn(
            "absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-ink via-ink/70 to-transparent p-3 pt-10 transition-opacity duration-fast",
            showControls || !playing || overlayTitle
              ? "opacity-100"
              : "pointer-events-none opacity-0",
          )}
        >
          {mode === "vod" && duration > 0 ? (
            <div className="mb-2">
              <input
                type="range"
                min={0}
                max={duration}
                value={localProgress}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  setLocalProgress(next);
                  onProgressChange?.(next);
                  bumpControls();
                }}
                className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-accent"
                aria-label="Progreso"
              />
              <div className="mt-1 flex justify-between text-[11px] text-text-muted">
                <span>{formatDuration(localProgress)}</span>
                <span>{formatDuration(duration)}</span>
              </div>
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <IconButton
                label={playing ? "Pausar" : "Reproducir"}
                size="sm"
                onClick={() => {
                  setPlaying((p) => !p);
                  bumpControls();
                }}
                disabled={Boolean(overlayTitle)}
              >
                {playing ? (
                  <Pause className="size-4" />
                ) : (
                  <Play className="size-4" />
                )}
              </IconButton>
              <IconButton label="Volumen" size="sm">
                <Volume2 className="size-4" />
              </IconButton>
              <span className="ml-2 hidden truncate text-sm text-text-secondary sm:inline">
                {title}
              </span>
            </div>
            <IconButton label="Pantalla completa" size="sm">
              <Maximize2 className="size-4" />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EndedRecommendations({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 rounded border border-border-subtle bg-slate p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-bold text-text-primary">
          Seguí explorando
        </h3>
        <Link
          href="/home"
          className="text-sm font-medium text-accent-soft hover:text-accent-hover"
        >
          Ver todo
        </Link>
      </div>
      {children}
    </div>
  );
}
