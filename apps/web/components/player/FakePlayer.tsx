"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Volume2,
  VolumeX,
  WifiOff,
  Loader2,
  Radio,
  Settings2,
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

const QUALITIES = ["Auto", "1080p", "720p", "480p"] as const;
type Quality = (typeof QUALITIES)[number];

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
  const rootRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(
    mode === "live" || mode === "vod" || mode === "paused",
  );
  const [localProgress, setLocalProgress] = useState(progress);
  const [showControls, setShowControls] = useState(true);
  const [bootLoading, setBootLoading] = useState(
    mode === "loading" || mode === "idle",
  );
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [fullscreen, setFullscreen] = useState(false);
  const [quality, setQuality] = useState<Quality>("Auto");
  const [qualityOpen, setQualityOpen] = useState(false);
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

  const bumpControls = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (playing && (mode === "live" || mode === "vod")) {
        setShowControls(false);
        setQualityOpen(false);
      }
    }, 2800);
  }, [playing, mode]);

  useEffect(() => {
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, []);

  useEffect(() => {
    function onFs() {
      setFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const togglePlay = useCallback(() => {
    setPlaying((p) => !p);
    bumpControls();
  }, [bumpControls]);

  const toggleMute = useCallback(() => {
    setMuted((m) => !m);
    bumpControls();
  }, [bumpControls]);

  const toggleFullscreen = useCallback(async () => {
    const el = rootRef.current;
    if (!el) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await el.requestFullscreen();
      }
    } catch (error) {
      logger.warn("Fullscreen failed", error);
    }
    bumpControls();
  }, [bumpControls]);

  const seekBy = useCallback(
    (delta: number) => {
      if (mode !== "vod" || duration <= 0) return;
      setLocalProgress((prev) => {
        const next = Math.max(0, Math.min(duration, prev + delta));
        onProgressChange?.(next);
        return next;
      });
      bumpControls();
    },
    [mode, duration, onProgressChange, bumpControls],
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      const key = e.key.toLowerCase();
      if (key === " " || key === "k") {
        e.preventDefault();
        togglePlay();
      } else if (key === "m") {
        e.preventDefault();
        toggleMute();
      } else if (key === "f") {
        e.preventDefault();
        void toggleFullscreen();
      } else if (key === "arrowright") {
        e.preventDefault();
        seekBy(10);
      } else if (key === "arrowleft") {
        e.preventDefault();
        seekBy(-10);
      } else if (key === "arrowup") {
        e.preventDefault();
        setVolume((v) => Math.min(1, v + 0.05));
        setMuted(false);
        bumpControls();
      } else if (key === "arrowdown") {
        e.preventDefault();
        setVolume((v) => Math.max(0, v - 0.05));
        bumpControls();
      }
    }

    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [togglePlay, toggleMute, toggleFullscreen, seekBy, bumpControls]);

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
  const effectiveMuted = muted || volume === 0;

  if (bootLoading && mode === "loading") {
    return <PlayerSkeleton />;
  }

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      role="region"
      aria-label={`Reproductor: ${title}`}
      className={cn(
        "relative overflow-hidden rounded border border-border-subtle bg-charcoal outline-none focus-visible:ring-2 focus-visible:ring-accent",
        fullscreen && "rounded-none border-0",
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
            <span className="rounded bg-ink/80 px-2 py-1 text-[11px] text-text-muted">
              {quality}
            </span>
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
            onClick={togglePlay}
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
                onClick={togglePlay}
                disabled={Boolean(overlayTitle)}
              >
                {playing ? (
                  <Pause className="size-4" />
                ) : (
                  <Play className="size-4" />
                )}
              </IconButton>
              <div className="flex items-center gap-1">
                <IconButton
                  label={effectiveMuted ? "Activar sonido" : "Silenciar"}
                  size="sm"
                  onClick={toggleMute}
                >
                  {effectiveMuted ? (
                    <VolumeX className="size-4" />
                  ) : (
                    <Volume2 className="size-4" />
                  )}
                </IconButton>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={effectiveMuted ? 0 : volume}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    setVolume(next);
                    setMuted(next === 0);
                    bumpControls();
                  }}
                  className="hidden h-1 w-20 cursor-pointer appearance-none rounded-full bg-white/20 accent-accent sm:block"
                  aria-label="Volumen"
                />
              </div>
              <span className="ml-2 hidden truncate text-sm text-text-secondary md:inline">
                {title}
              </span>
            </div>
            <div className="relative flex items-center gap-1">
              <IconButton
                label="Calidad"
                size="sm"
                onClick={() => {
                  setQualityOpen((o) => !o);
                  bumpControls();
                }}
              >
                <Settings2 className="size-4" />
              </IconButton>
              {qualityOpen ? (
                <div className="absolute bottom-10 right-0 z-40 min-w-[7.5rem] overflow-hidden rounded border border-border bg-charcoal shadow-deep">
                  {QUALITIES.map((q) => (
                    <button
                      key={q}
                      type="button"
                      className={cn(
                        "block w-full px-3 py-2 text-left text-sm transition-colors hover:bg-elevated",
                        q === quality
                          ? "text-accent-soft"
                          : "text-text-secondary",
                      )}
                      onClick={() => {
                        setQuality(q);
                        setQualityOpen(false);
                        bumpControls();
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              ) : null}
              <IconButton
                label={
                  fullscreen
                    ? "Salir de pantalla completa"
                    : "Pantalla completa"
                }
                size="sm"
                onClick={() => void toggleFullscreen()}
              >
                {fullscreen ? (
                  <Minimize2 className="size-4" />
                ) : (
                  <Maximize2 className="size-4" />
                )}
              </IconButton>
            </div>
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
