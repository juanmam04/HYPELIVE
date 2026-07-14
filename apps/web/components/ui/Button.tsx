"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-text-on-accent hover:bg-accent-hover disabled:bg-accent/40",
  secondary:
    "bg-elevated text-text-primary hover:bg-slate border border-border",
  ghost: "bg-transparent text-text-secondary hover:bg-elevated hover:text-text-primary",
  danger: "bg-live text-white hover:bg-live/90",
  outline:
    "bg-transparent border border-border text-text-primary hover:border-accent hover:text-accent-soft",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm gap-1.5 rounded",
  md: "h-10 px-4 text-sm gap-2 rounded",
  lg: "h-11 px-5 text-base gap-2 rounded",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
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
          "inline-flex items-center justify-center font-semibold transition-colors duration-normal",
          "active:opacity-80 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className,
        )}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
