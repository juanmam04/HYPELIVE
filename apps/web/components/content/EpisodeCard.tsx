import Link from "next/link";
import { formatDuration } from "@hypelive/domain";
import { cn } from "@/lib/cn";
import {
  formatEpisodeLabel,
  formatScheduleDate,
  posterGradient,
  type AppEpisode,
} from "@/lib/models";

export function EpisodeCard({
  episode,
  progressSeconds,
  className,
}: {
  episode: AppEpisode;
  progressSeconds?: number;
  className?: string;
}) {
  const label = formatEpisodeLabel(episode);
  const duration =
    episode.durationSeconds > 0
      ? formatDuration(episode.durationSeconds)
      : null;
  const date = formatScheduleDate(episode.airedAt ?? episode.publishedAt);

  return (
    <Link
      href={`/watch/${episode.id}`}
      className={cn(
        "card-hover group block overflow-hidden rounded border border-border-subtle bg-slate outline-none",
        "focus-visible:ring-2 focus-visible:ring-accent",
        className,
      )}
    >
      <div
        className="relative aspect-video overflow-hidden bg-charcoal"
        style={{
          backgroundImage: episode.thumbnailUrl
            ? `url(${episode.thumbnailUrl})`
            : posterGradient(episode.id + episode.title),
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!episode.thumbnailUrl ? (
          <div className="absolute inset-0 bg-ink/20" aria-hidden />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
        )}
        {label ? (
          <span className="absolute left-2 top-2 rounded bg-ink/85 px-1.5 py-0.5 text-[11px] font-medium text-white">
            {label}
          </span>
        ) : null}
        {duration ? (
          <span className="absolute bottom-2 right-2 rounded bg-ink/85 px-1.5 py-0.5 text-[11px] font-medium text-white">
            {duration}
          </span>
        ) : null}
        {typeof progressSeconds === "number" && episode.durationSeconds > 0 ? (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
            <div
              className="h-full bg-accent"
              style={{
                width: `${Math.min(100, (progressSeconds / episode.durationSeconds) * 100)}%`,
              }}
            />
          </div>
        ) : null}
      </div>
      <div className="space-y-0.5 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-text-primary">
          {episode.title}
        </h3>
        <p className="truncate text-xs text-text-muted">
          {[
            episode.program?.title,
            episode.channel?.name,
            date || null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
    </Link>
  );
}
