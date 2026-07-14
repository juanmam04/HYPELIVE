"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "solid" | "accent";
};

const sizes = {
  sm: "size-10 min-w-10 min-h-10",
  md: "size-10 min-w-10 min-h-10",
  lg: "size-11 min-w-11 min-h-11",
};

const variants = {
  ghost:
    "bg-transparent hover:bg-elevated text-text-secondary hover:text-text-primary",
  solid: "bg-elevated hover:bg-slate text-text-primary border border-border",
  accent: "bg-accent/15 text-accent-soft hover:bg-accent/25",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      label,
      loading,
      disabled,
      size = "md",
      variant = "ghost",
      children,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled || loading}
      className={cn(
        "btn-press inline-flex items-center justify-center rounded-md",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "disabled:opacity-50 disabled:pointer-events-none",
        sizes[size],
        variants[variant],
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : children}
    </button>
  ),
);

IconButton.displayName = "IconButton";
