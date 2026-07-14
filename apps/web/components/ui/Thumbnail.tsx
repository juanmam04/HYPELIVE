import { cn } from "@/lib/cn";
import { posterGradient } from "@/lib/models";

/**
 * Reliable thumbnail for Phase 0: CSS background (same technique as hero).
 * Prefer local `/media/*` assets so the UI never depends on external CDN.
 */
export function Thumbnail({
  src,
  seed,
  className,
  alt = "",
}: {
  src?: string | null;
  seed: string;
  className?: string;
  alt?: string;
}) {
  const url = src?.trim() || null;

  return (
    <div
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={cn("card-media absolute inset-0 bg-cover bg-center", className)}
      style={{
        backgroundImage: url
          ? `url(${url})`
          : posterGradient(seed),
        backgroundColor: "#141A24",
      }}
    />
  );
}
