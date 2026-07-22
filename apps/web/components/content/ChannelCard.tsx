import Link from "next/link";
import { formatViewerCount } from "@hypelive/domain";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { LiveBadge } from "@/components/ui/LiveBadge";
import { Thumbnail } from "@/components/ui/Thumbnail";
import { cn } from "@/lib/cn";
import { type AppChannel } from "@/lib/models";

export function ChannelCard({
  channel,
  className,
}: {
  channel: AppChannel;
  className?: string;
}) {
  const meta = [
    channel.isLive && channel.liveProgramTitle
      ? channel.liveProgramTitle
      : null,
    typeof channel.programCount === "number" && channel.programCount > 0
      ? `${channel.programCount} programas`
      : null,
    channel.followerCount > 0
      ? `${formatViewerCount(channel.followerCount)} seguidores`
      : channel.description,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={`/channel/${channel.slug}`}
      className={cn(
        "card-hover group flex overflow-hidden rounded-xl border border-border-subtle bg-slate",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className,
      )}
    >
      <div className="relative hidden w-24 shrink-0 sm:block">
        <Thumbnail
          src={channel.bannerUrl ?? channel.avatarUrl}
          seed={channel.id + channel.name}
          alt=""
        />
        <div className="card-overlay pointer-events-none absolute inset-0 bg-ink/25" />
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-3 p-3">
        <div className="transition-transform duration-fast group-hover:scale-[1.04]">
          <Avatar name={channel.name} src={channel.avatarUrl} size="md" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-text-primary">
              {channel.name}
            </h3>
            {channel.isVerified ? (
              <Badge tone="accent">Verificado</Badge>
            ) : null}
            {channel.isLive ? <LiveBadge compact /> : null}
          </div>
          <p className="card-meta truncate text-xs text-text-muted">{meta}</p>
        </div>
      </div>
    </Link>
  );
}
