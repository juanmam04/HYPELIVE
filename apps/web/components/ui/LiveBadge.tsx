import { cn } from "@/lib/cn";

export function LiveBadge({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded bg-live px-2 py-0.5",
        "text-[10px] font-bold uppercase tracking-wide text-white",
        compact ? "px-1.5" : "px-2",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-white" aria-hidden />
      EN VIVO
    </span>
  );
}
