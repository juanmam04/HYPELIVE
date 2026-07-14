import { cn } from "@/lib/cn";

type Size = "sm" | "md" | "lg" | "xl";

const sizes: Record<Size, string> = {
  sm: "size-8 text-xs",
  md: "size-12 text-sm",
  lg: "size-[72px] text-lg",
  xl: "size-24 text-xl",
};

export function Avatar({
  name,
  src,
  size = "md",
  className,
}: {
  name: string;
  src?: string | null;
  size?: Size;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        "bg-elevated text-text-secondary ring-1 ring-border",
        sizes[size],
        className,
      )}
      aria-hidden={!src}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full object-cover" />
      ) : (
        <span className="font-semibold tracking-wide">{initials || "?"}</span>
      )}
    </span>
  );
}
