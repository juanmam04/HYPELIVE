"use client";

import { useState } from "react";
import { logger } from "@hypelive/analytics";
import { cn } from "@/lib/cn";
import { posterGradient } from "@/lib/models";

/**
 * Media with surface placeholder + fade-in. No broken browser icon.
 */
export function FadeImage({
  src,
  alt,
  seed,
  className,
  imgClassName,
}: {
  src?: string | null;
  alt: string;
  seed: string;
  className?: string;
  imgClassName?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const showImg = Boolean(src) && !failed;

  return (
    <div
      className={cn("relative overflow-hidden bg-charcoal", className)}
      style={!showImg ? { background: posterGradient(seed) } : undefined}
    >
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src!}
          alt={alt}
          className={cn(
            "fade-img absolute inset-0 h-full w-full object-cover card-media",
            loaded && "is-loaded",
            imgClassName,
          )}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setFailed(true);
            logger.warn("Image failed to load", { src });
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-ink/25" aria-hidden />
      )}
    </div>
  );
}
