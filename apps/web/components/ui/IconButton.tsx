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
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
};

const variants = {
  ghost: "bg-transparent hover:bg-elevated text-text-secondary hover:text-text-primary",
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
        "inline-flex items-center justify-center rounded-md transition-all duration-fast",
        "active:scale-[0.96] disabled:opacity-50 disabled:pointer-events-none",
        sizes[size],
        variants[variant],
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : children}
    </button>
  ),
);

IconButton.displayName = "IconButton";
