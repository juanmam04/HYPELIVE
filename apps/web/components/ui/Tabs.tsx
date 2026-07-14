"use client";

import { cn } from "@/lib/cn";

export function Tabs({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: Array<{ id: string; label: string }>;
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex gap-1 rounded-lg border border-border bg-slate/60 p-1",
        className,
      )}
    >
      {tabs.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-fast",
              active
                ? "bg-elevated text-text-primary shadow-sm"
                : "text-text-muted hover:text-text-secondary",
            )}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
