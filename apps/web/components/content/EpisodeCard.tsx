import Link from "next/link";
import { Play } from "lucide-react";
import { formatDuration } from "@hypelive/domain";
import { Thumbnail } from "@/components/ui/Thumbnail";
import { cn } from "@/lib/cn";
import {
  formatEpisodeLabel,
  formatScheduleDate,
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
        "card-hover group block overflow-hidden rounded-xl border border-border-subtle bg-slate",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className,
      )}
    >
      <div className="relative aspect-video overflow-hidden bg-charcoal">
        <Thumbnail
          src={episode.thumbnailUrl}
          seed={episode.id + episode.title}
          alt={episode.title}
        />
        <div className="card-overlay pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />
        <div
          className="card-play absolute inset-0 flex items-center justify-center"
          aria-hidden
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-ink/75 text-white">
            <Play className="size-4 translate-x-px fill-current" />
          </span>
        </div>
        {label ? (
          <span className="absolute left-2 top-2 z-[1] rounded bg-ink/85 px-1.5 py-0.5 text-[11px] font-medium text-white">
            {label}
          </span>
        ) : null}
        {duration ? (
          <span className="absolute bottom-2 right-2 z-[1] rounded bg-ink/85 px-1.5 py-0.5 text-[11px] font-medium text-white">
            {duration}
          </span>
        ) : null}
        {typeof progressSeconds === "number" && episode.durationSeconds > 0 ? (
          <div className="absolute inset-x-0 bottom-0 z-[1] h-1 bg-white/20">
            <div
              className="h-full bg-accent"
              style={{
                width: `${Math.min(
                  100,
                  (progressSeconds / episode.durationSeconds) * 100,
                )}%`,
              }}
            />
          </div>
        ) : null}
      </div>
      <div className="space-y-0.5 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-text-primary">
          {episode.title}
        </h3>
        <p className="card-meta truncate text-xs text-text-muted">
          {[episode.program?.title, episode.channel?.name, date || null]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
    </Link>
  );
}
