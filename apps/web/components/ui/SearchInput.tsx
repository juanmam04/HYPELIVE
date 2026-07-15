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
      <div className={cn("group relative w-full", className)}>
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-text-muted transition-colors duration-fast group-focus-within:text-accent-soft"
          aria-hidden
        />
        <input
          ref={ref}
          type="search"
          value={value}
          className={cn(
            "h-11 w-full rounded-md border border-border bg-slate pl-10 pr-10",
            "text-text-primary placeholder:text-text-muted",
            "shadow-none transition-[border-color,box-shadow,background-color] duration-fast",
            "hover:border-ash/50 hover:bg-elevated/40",
            "focus:border-accent focus:bg-elevated/30 focus:outline-none focus:shadow-[0_0_0_3px_rgba(61,126,234,0.2)]",
          )}
          {...props}
        />
        {hasValue && onClear ? (
          <IconButton
            label="Limpiar búsqueda"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 opacity-70 transition-opacity duration-fast hover:opacity-100"
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
