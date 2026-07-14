import { cn } from "@/lib/cn";

type Tone = "default" | "accent" | "success" | "warning" | "muted";

const tones: Record<Tone, string> = {
  default: "bg-elevated text-text-secondary border-border",
  accent: "bg-accent-muted text-accent-soft border-accent/30",
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  muted: "bg-slate text-text-muted border-border-subtle",
};

export function Badge({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
