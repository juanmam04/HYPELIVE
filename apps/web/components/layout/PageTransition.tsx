"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Shell content wrapper — no remount flash, no dimming on navigate.
 * Instant feel; data comes from React Query cache.
 */
export function PageTransition({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("relative", className)}>{children}</div>;
}
