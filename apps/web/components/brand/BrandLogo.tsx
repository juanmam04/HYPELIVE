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
  sm: { mark: "h-7 w-7", text: "text-[1.35rem]" },
  md: { mark: "h-8 w-8", text: "text-[1.65rem]" },
  lg: { mark: "h-11 w-11", text: "text-[2.15rem]" },
} as const;

/**
 * Cinematic HYPE lockup — theatrical display type + gold spark (Disney+-inspired).
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
          <BrandWordmark className={s.text} />
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

/** Crest mark — rounded tile with H + gold crossbar. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("shrink-0 drop-shadow-[0_0_12px_rgba(0,99,229,0.35)]", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="hypeMarkBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0063E5" />
          <stop offset="100%" stopColor="#0A3F9A" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#hypeMarkBg)" />
      <path
        fill="#F7F8FC"
        d="M11 9h5.2v8.4h7.6V9H29v22h-5.2v-8.6h-7.6V31H11V9z"
      />
      <rect x="16.2" y="16.2" width="7.6" height="5.2" fill="#D4AF37" />
    </svg>
  );
}

/** Wordmark — Playfair display, gold spark under H. */
export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display relative inline-block leading-none tracking-[-0.03em] text-text-primary",
        className,
      )}
      aria-hidden
    >
      <span className="relative">
        H
        <span
          className="absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-amber via-accent to-transparent"
          aria-hidden
        />
      </span>
      <span>YPE</span>
    </span>
  );
}
