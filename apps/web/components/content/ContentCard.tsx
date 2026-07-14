import Link from "next/link";
import { Play } from "lucide-react";
import { formatDuration, formatViewerCount } from "@hypelive/domain";
import { LiveBadge } from "@/components/ui/LiveBadge";
import { FadeImage } from "@/components/ui/FadeImage";
import { cn } from "@/lib/cn";
import {
  formatScheduleTime,
  type AppStream,
  type AppVideo,
} from "@/lib/models";

type Content = (AppStream | AppVideo) & { href?: string };

function isLive(item: Content): item is AppStream {
  return "viewerCount" in item && "status" in item && item.status === "live";
}

function isStream(item: Content): item is AppStream {
  return "status" in item && "viewerCount" in item;
}

export function ContentCard({
  item,
  href,
  progressSeconds,
  className,
}: {
  item: Content;
  href?: string;
  progressSeconds?: number;
  className?: string;
}) {
  const link =
    href ??
    (isStream(item) && item.status === "live"
      ? `/live/${item.id}`
      : "durationSeconds" in item
        ? `/watch/${item.id}`
        : `/live/${item.id}`);

  const duration =
    "durationSeconds" in item && item.durationSeconds
      ? formatDuration(item.durationSeconds)
      : null;

  const programName = isStream(item) ? item.program?.title : null;
  const channelName = item.channel?.name;
  const schedule =
    isStream(item) && item.scheduledAt
      ? formatScheduleTime(item.scheduledAt)
      : isStream(item) && item.startedAt
        ? formatScheduleTime(item.startedAt)
        : null;

  return (
    <Link
      href={link}
      className={cn(
        "card-hover group relative block overflow-hidden rounded border border-border-subtle bg-slate",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className,
      )}
    >
      <div className="relative aspect-video overflow-hidden">
        <FadeImage
          src={item.thumbnailUrl}
          alt=""
          seed={item.id + item.title}
          className="absolute inset-0"
          priority
        />
        <div className="card-overlay absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
        <div
          className="card-play absolute inset-0 flex items-center justify-center"
          aria-hidden
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-ink/75 text-white">
            <Play className="size-4 translate-x-px fill-current" />
          </span>
        </div>
        {isLive(item) ? (
          <div className="absolute left-2 top-2 z-[1]">
            <LiveBadge compact />
          </div>
        ) : null}
        {duration ? (
          <span className="absolute bottom-2 right-2 z-[1] rounded bg-ink/85 px-1.5 py-0.5 text-[11px] font-medium text-white">
            {duration}
          </span>
        ) : null}
        {typeof progressSeconds === "number" &&
        "durationSeconds" in item &&
        item.durationSeconds > 0 ? (
          <div className="absolute inset-x-0 bottom-0 z-[1] h-1 bg-white/20">
            <div
              className="h-full bg-accent"
              style={{
                width: `${Math.min(100, (progressSeconds / item.durationSeconds) * 100)}%`,
              }}
            />
          </div>
        ) : null}
      </div>
      <div className="space-y-0.5 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-text-primary">
          {item.title}
        </h3>
        <p className="card-meta truncate text-xs text-text-muted">
          {[
            programName,
            channelName,
            schedule,
            isLive(item) ? formatViewerCount(item.viewerCount) : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
    </Link>
  );
}
