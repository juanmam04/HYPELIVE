"use client";

import { useEffect, useState } from "react";
import {
  Maximize2,
  Pause,
  Play,
  Volume2,
  WifiOff,
} from "lucide-react";
import { formatDuration, formatViewerCount } from "@hypelive/domain";
import { LiveBadge } from "@/components/ui/LiveBadge";
import Link from "next/link";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/cn";
import { posterGradient } from "@/lib/models";

export type PlayerMode =
  | "live"
  | "vod"
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
  className,
}: {
  id: string;
  title: string;
  mode?: PlayerMode;
  viewerCount?: number;
  progress?: number;
  duration?: number;
  onProgressChange?: (seconds: number) => void;
  className?: string;
}) {
  const [playing, setPlaying] = useState(mode === "live" || mode === "vod");
  const [localProgress, setLocalProgress] = useState(progress);

  useEffect(() => {
    setLocalProgress(progress);
  }, [progress]);

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

  const overlay =
    mode === "ended"
      ? "Transmisión finalizada"
      : mode === "reconnect"
        ? "Reconectando…"
        : mode === "processing"
          ? "Procesando video…"
          : mode === "error"
            ? "Error de reproducción"
            : mode === "unavailable"
              ? "Contenido no disponible"
              : null;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded border border-border-subtle bg-charcoal",
        className,
      )}
    >
      <div
        className="relative aspect-video w-full"
        style={{ background: posterGradient(id + title) }}
      >
        <div className="pointer-events-none absolute inset-0 bg-ink/25" />

        {mode === "live" ? (
          <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
            <LiveBadge />
            {typeof viewerCount === "number" ? (
              <span className="rounded bg-ink/80 px-2 py-1 text-xs text-text-secondary">
                {formatViewerCount(viewerCount)} viendo
              </span>
            ) : null}
          </div>
        ) : null}

        {overlay ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-ink/70">
            {mode === "reconnect" ? (
              <WifiOff className="size-7 text-text-muted" />
            ) : null}
            <p className="text-lg font-semibold text-text-primary sm:text-xl">
              {overlay}
            </p>
            {mode === "reconnect" ? (
              <p className="text-sm text-text-muted">
                Intentando recuperar la señal
              </p>
            ) : null}
          </div>
        ) : (
          <button
            type="button"
            className="absolute inset-0 z-10 flex items-center justify-center"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pausar" : "Reproducir"}
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-ink/70 text-white transition-colors duration-fast hover:bg-ink/85">
              {playing ? (
                <Pause className="size-6" />
              ) : (
                <Play className="size-6 translate-x-0.5" />
              )}
            </span>
          </button>
        )}

        <div className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-ink via-ink/70 to-transparent p-3 pt-10">
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
                onClick={() => setPlaying((p) => !p)}
                disabled={Boolean(overlay)}
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
