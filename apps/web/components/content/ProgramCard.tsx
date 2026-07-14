import Link from "next/link";
import { LiveBadge } from "@/components/ui/LiveBadge";
import { cn } from "@/lib/cn";
import { posterGradient, programHref, type AppProgram } from "@/lib/models";

export function ProgramCard({
  program,
  channelSlug,
  className,
}: {
  program: AppProgram;
  /** Override when program.channel is missing */
  channelSlug?: string;
  className?: string;
}) {
  return (
    <Link
      href={programHref(program, channelSlug)}
      className={cn(
        "card-hover group block overflow-hidden rounded border border-border-subtle bg-slate",
        "focus-visible:ring-2 focus-visible:ring-accent",
        className,
      )}
    >
      <div
        className="relative aspect-video overflow-hidden bg-charcoal"
        style={{
          backgroundImage: program.coverUrl
            ? `url(${program.coverUrl})`
            : posterGradient(program.id + program.title),
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        {program.isLive ? (
          <div className="absolute left-2 top-2">
            <LiveBadge compact />
          </div>
        ) : null}
        <div className="absolute inset-x-3 bottom-3">
          <h3 className="text-base font-bold leading-snug text-text-primary">
            {program.title}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-xs text-text-muted">
            {program.channel?.name ?? program.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
