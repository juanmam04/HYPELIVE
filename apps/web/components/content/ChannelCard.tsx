import Link from "next/link";
import { formatViewerCount } from "@hypelive/domain";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { LiveBadge } from "@/components/ui/LiveBadge";
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
        "card-hover flex items-center gap-3 rounded border border-border-subtle bg-slate p-3",
        "focus-visible:ring-2 focus-visible:ring-accent",
        className,
      )}
    >
      <Avatar name={channel.name} src={channel.avatarUrl} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-text-primary">
            {channel.name}
          </h3>
          {channel.isVerified ? <Badge tone="accent">Verificado</Badge> : null}
          {channel.isLive ? <LiveBadge compact /> : null}
        </div>
        <p className="truncate text-xs text-text-muted">{meta}</p>
      </div>
    </Link>
  );
}
