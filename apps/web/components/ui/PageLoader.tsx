"use client";

import { BrandMark } from "@/components/brand/BrandLogo";
import { cn } from "@/lib/cn";

/**
 * First-paint loader — crest pulse, cinematic and quiet.
 */
export function PageLoader({
  label = "Cargando",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[42vh] flex-col items-center justify-center gap-5 px-6",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="page-loader-mark">
        <BrandMark className="h-12 w-12 sm:h-14 sm:w-14" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="font-display text-sm font-medium tracking-wide text-text-secondary">
          {label}
        </p>
        <div className="page-loader-bar" aria-hidden />
      </div>
    </div>
  );
}
