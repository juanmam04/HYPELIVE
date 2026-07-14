"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
  success?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, success, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <label className="flex w-full flex-col gap-1.5">
        {label ? (
          <span className="text-sm font-medium text-text-secondary">
            {label}
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 w-full rounded-md border bg-slate px-3 text-text-primary",
            "placeholder:text-text-muted transition-colors duration-fast",
            "hover:border-ash/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30",
            error
              ? "border-danger/70 focus:border-danger focus:ring-danger/20"
              : success
                ? "border-success/50"
                : "border-border",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className,
          )}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={
            error
              ? `${inputId}-error`
              : success
                ? `${inputId}-success`
                : hint
                  ? `${inputId}-hint`
                  : undefined
          }
          {...props}
        />
        <span className="min-h-5 text-sm">
          {error ? (
            <span id={`${inputId}-error`} className="text-danger" role="alert">
              {error}
            </span>
          ) : success ? (
            <span id={`${inputId}-success`} className="text-success">
              {success}
            </span>
          ) : hint ? (
            <span id={`${inputId}-hint`} className="text-text-muted">
              {hint}
            </span>
          ) : null}
        </span>
      </label>
    );
  },
);

Input.displayName = "Input";
