import Link from "next/link";
import { APP_NAME } from "@hypelive/domain";
import { cn } from "@/lib/cn";

type BrandLogoProps = {
  href?: string;
  size?: "sm" | "md" | "lg";
  markOnly?: boolean;
  className?: string;
};

const sizes = {
  sm: { mark: "h-6 w-6", disney: "text-[22px]", streaming: "text-[8px]" },
  md: { mark: "h-7 w-7", disney: "text-[26px]", streaming: "text-[9px]" },
  lg: { mark: "h-10 w-10", disney: "text-[34px]", streaming: "text-[11px]" },
} as const;

/**
 * Disney Streaming lockup — Mickey mark + Disney script wordmark.
 */
export function BrandLogo({
  href = "/",
  size = "md",
  markOnly = false,
  className,
}: BrandLogoProps) {
  const s = sizes[size];

  const content = (
    <span className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      {markOnly ? (
        <BrandMark className={s.mark} />
      ) : (
        <>
          <BrandMark className={s.mark} />
          <BrandWordmark disneyClass={s.disney} streamingClass={s.streaming} />
        </>
      )}
    </span>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      className="shrink-0 outline-none transition-opacity duration-fast hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      aria-label={APP_NAME}
    >
      {content}
    </Link>
  );
}

/** Mickey mouse head monogram. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("shrink-0 text-text-primary", className)}
      aria-hidden
    >
      <circle cx="20" cy="24" r="11" fill="currentColor" />
      <circle cx="9.5" cy="12.5" r="7.2" fill="currentColor" />
      <circle cx="30.5" cy="12.5" r="7.2" fill="currentColor" />
    </svg>
  );
}

/**
 * Disney script wordmark + STREAMING.
 */
export function BrandWordmark({
  className,
  disneyClass,
  streamingClass,
}: {
  className?: string;
  disneyClass?: string;
  streamingClass?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-baseline gap-2 leading-none", className)}
      aria-hidden
    >
      <span
        className={cn(
          "font-[family-name:var(--font-disney)] italic font-normal tracking-tight text-text-primary",
          disneyClass,
        )}
      >
        Disney
      </span>
      <span
        className={cn(
          "font-bold uppercase tracking-[0.22em] text-text-primary translate-y-[-1px]",
          streamingClass,
        )}
      >
        Streaming
      </span>
    </span>
  );
}
