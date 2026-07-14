"use client";

import { Search, X } from "lucide-react";
import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { IconButton } from "./IconButton";

export type SearchInputProps = InputHTMLAttributes<HTMLInputElement> & {
  onClear?: () => void;
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onClear, ...props }, ref) => {
    const hasValue = Boolean(value && String(value).length > 0);
    return (
      <div className={cn("relative w-full", className)}>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
          aria-hidden
        />
        <input
          ref={ref}
          type="search"
          value={value}
          className={cn(
            "h-11 w-full rounded-md border border-border bg-slate pl-10 pr-10",
            "text-text-primary placeholder:text-text-muted",
            "transition-colors duration-fast hover:border-ash/50 focus:border-accent focus:outline-none",
          )}
          {...props}
        />
        {hasValue && onClear ? (
          <IconButton
            label="Limpiar búsqueda"
            size="sm"
            className="absolute right-1.5 top-1/2 -translate-y-1/2"
            onClick={onClear}
          >
            <X className="size-4" />
          </IconButton>
        ) : null}
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";
