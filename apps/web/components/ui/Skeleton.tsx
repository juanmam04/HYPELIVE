"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export function Skeleton({
  className,
  delayMs = 120,
}: {
  className?: string;
  /** Avoid shimmer flash on instant loads */
  delayMs?: number;
}) {
  const [visible, setVisible] = useState(delayMs <= 0);

  useEffect(() => {
    if (delayMs <= 0) return;
    const t = window.setTimeout(() => setVisible(true), delayMs);
    return () => window.clearTimeout(t);
  }, [delayMs]);

  if (!visible) {
    return (
      <div
        className={cn("rounded-md bg-slate/60", className)}
        aria-hidden
      />
    );
  }

  return (
    <div
      className={cn("skeleton-shimmer rounded-md", className)}
      aria-hidden
    />
  );
}
