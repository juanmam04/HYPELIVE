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
  sm: { mark: "size-7", text: "text-[15px]", gap: "gap-2" },
  md: { mark: "size-8", text: "text-[19px]", gap: "gap-2.5" },
  lg: { mark: "size-11", text: "text-[26px]", gap: "gap-3" },
} as const;

/**
 * Brand lockup: H monogram + wordmark.
 */
export function BrandLogo({
  href = "/",
  size = "md",
  markOnly = false,
  className,
}: BrandLogoProps) {
  const s = sizes[size];

  const content = (
    <span className={cn("inline-flex items-center", s.gap, "select-none", className)}>
      <BrandMark className={s.mark} />
      {markOnly ? null : (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-extrabold uppercase tracking-[0.18em] text-text-primary",
              s.text,
            )}
          >
            {APP_NAME}
          </span>
          <span
            className="mt-[3px] h-[2px] w-full rounded-full bg-accent"
            aria-hidden
          />
        </span>
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

/** H monogram — reads as a brand mark, not a generic play button. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <rect width="40" height="40" rx="9" fill="#3D7EEA" />
      {/* Stylized H */}
      <path
        fill="#F5F7FA"
        d="M11 9h5.2v8.2h7.6V9H29v22h-5.2v-8.4h-7.6V31H11V9z"
      />
      {/* Small play notch in the crossbar — streaming cue without looking like a stock icon */}
      <path fill="#3D7EEA" d="M19.2 17.4h1.7l2.6 2.6-2.6 2.6h-1.7l2.55-2.6z" />
    </svg>
  );
}
