import { cn } from "@/lib/cn";

export function Skeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-md bg-gradient-to-r from-slate via-elevated to-slate",
        "bg-[length:200%_100%]",
        className,
      )}
      aria-hidden
    />
  );
}
