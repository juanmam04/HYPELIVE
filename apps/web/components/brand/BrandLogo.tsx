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
  sm: { mark: "h-6 w-6", word: "h-4 w-[88px]", text: "text-[15px]" },
  md: { mark: "h-7 w-7", word: "h-5 w-[110px]", text: "text-[19px]" },
  lg: { mark: "h-10 w-10", word: "h-7 w-[152px]", text: "text-[26px]" },
} as const;

/**
 * Brand lockup — typographic wordmark (no fragile composite SVG letters).
 */
export function BrandLogo({
  href = "/",
  size = "md",
  markOnly = false,
  className,
}: BrandLogoProps) {
  const s = sizes[size];

  const content = (
    <span className={cn("inline-flex items-center select-none", className)}>
      {markOnly ? (
        <BrandMark className={s.mark} />
      ) : (
        <BrandWordmark className={s.text} />
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

/** Compact monogram — H with accent crossbar. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("shrink-0 text-text-primary", className)}
      aria-hidden
    >
      <rect x="8" y="6" width="5.5" height="28" fill="currentColor" />
      <rect x="26.5" y="6" width="5.5" height="28" fill="currentColor" />
      <rect x="13.5" y="17" width="13" height="6" fill="#3D7EEA" />
    </svg>
  );
}

/**
 * Wordmark — real type, not path-built letters.
 * Accent: first letter in brand blue (stable, network-readable).
 */
export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline font-extrabold uppercase leading-none tracking-[-0.045em] text-text-primary",
        className,
      )}
      aria-hidden
    >
      <span className="text-accent">H</span>
      <span>YPE</span>
    </span>
  );
}
