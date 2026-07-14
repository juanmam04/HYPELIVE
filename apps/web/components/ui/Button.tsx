"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";
type Tone = "default" | "success" | "error";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  tone?: Tone;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-text-on-accent hover:bg-accent-hover disabled:bg-accent/40 shadow-sm hover:shadow-soft",
  secondary:
    "bg-elevated text-text-primary hover:bg-slate border border-border hover:border-ash/40",
  ghost:
    "bg-transparent text-text-secondary hover:bg-elevated hover:text-text-primary",
  danger: "bg-live text-white hover:bg-live/90",
  outline:
    "bg-transparent border border-border text-text-primary hover:border-accent hover:text-accent-soft",
};

const sizes: Record<Size, string> = {
  sm: "h-8 min-h-8 px-3 text-sm gap-1.5 rounded",
  md: "h-10 min-h-10 px-4 text-sm gap-2 rounded",
  lg: "h-11 min-h-11 px-5 text-base gap-2 rounded",
};

const toneRing: Record<Tone, string> = {
  default: "",
  success: "ring-1 ring-success/50",
  error: "ring-1 ring-danger/50",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      tone = "default",
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "btn-press inline-flex items-center justify-center font-semibold",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          "disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          toneRing[tone],
          className,
        )}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
        ) : null}
        <span className="inline-flex items-center gap-2">{children}</span>
      </button>
    );
  },
);

Button.displayName = "Button";
