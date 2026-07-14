"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <label className="flex w-full flex-col gap-1.5">
        {label ? (
          <span className="text-sm font-medium text-text-secondary">{label}</span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 w-full rounded-md border bg-slate px-3 text-text-primary",
            "placeholder:text-text-muted transition-colors duration-fast",
            "hover:border-ash/50 focus:border-accent focus:outline-none",
            error ? "border-danger" : "border-border",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className,
          )}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
        {error ? (
          <span id={`${inputId}-error`} className="text-sm text-danger" role="alert">
            {error}
          </span>
        ) : hint ? (
          <span id={`${inputId}-hint`} className="text-sm text-text-muted">
            {hint}
          </span>
        ) : null}
      </label>
    );
  },
);

Input.displayName = "Input";
