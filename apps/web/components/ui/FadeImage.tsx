"use client";

import { useEffect, useRef, useState } from "react";
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
  priority = false,
}: {
  src?: string | null;
  alt: string;
  seed: string;
  className?: string;
  imgClassName?: string;
  /** Above-the-fold: load eagerly */
  priority?: boolean;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const showImg = Boolean(src) && !failed;

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.complete && el.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src, showImg]);

  return (
    <div
      className={cn("relative overflow-hidden bg-charcoal", className)}
      style={{ background: posterGradient(seed) }}
    >
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          src={src!}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          referrerPolicy="no-referrer"
          className={cn(
            "absolute inset-0 h-full w-full object-cover card-media",
            "transition-opacity duration-normal ease-enter",
            loaded ? "opacity-100" : "opacity-0",
            imgClassName,
          )}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setFailed(true);
            logger.warn("Image failed to load", { src });
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-ink/20" aria-hidden />
      )}
    </div>
  );
}
