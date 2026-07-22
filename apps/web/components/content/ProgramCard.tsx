import Link from "next/link";
import { LiveBadge } from "@/components/ui/LiveBadge";
import { Thumbnail } from "@/components/ui/Thumbnail";
import { cn } from "@/lib/cn";
import { programHref, type AppProgram } from "@/lib/models";

export function ProgramCard({
  program,
  channelSlug,
  className,
}: {
  program: AppProgram;
  channelSlug?: string;
  className?: string;
}) {
  const schedule = program.scheduleDescription;

  return (
    <Link
      href={programHref(program, channelSlug)}
      className={cn(
        "card-hover group block overflow-hidden rounded-xl border border-border-subtle bg-slate",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className,
      )}
    >
      <div className="relative aspect-video overflow-hidden bg-charcoal">
        <Thumbnail
          src={program.coverUrl}
          seed={program.id + program.title}
          alt={program.title}
        />
        <div className="card-overlay pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />
        {program.isLive ? (
          <div className="absolute left-2 top-2 z-[1]">
            <LiveBadge compact />
          </div>
        ) : null}
        <div className="absolute inset-x-3 bottom-3 z-[1]">
          <h3 className="text-base font-bold leading-snug text-text-primary">
            {program.title}
          </h3>
          <p className="card-meta mt-0.5 line-clamp-1 text-xs text-text-muted">
            {[program.channel?.name, schedule].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>
    </Link>
  );
}
