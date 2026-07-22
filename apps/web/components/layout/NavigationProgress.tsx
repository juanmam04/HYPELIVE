"use client";

import { useEffect, useState } from "react";
import { useNavigation } from "@/providers/NavigationProvider";
import { cn } from "@/lib/cn";

/**
 * Premium top rail — only appears if navigation takes a beat,
 * soft gradient shimmer, no harsh glow / no page dim.
 */
export function NavigationProgress() {
  const { pending } = useNavigation();
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (pending) {
      setLeaving(false);
      const show = window.setTimeout(() => setVisible(true), 140);
      return () => window.clearTimeout(show);
    }

    if (!visible) return undefined;

    setLeaving(true);
    const hide = window.setTimeout(() => {
      setVisible(false);
      setLeaving(false);
    }, 280);
    return () => window.clearTimeout(hide);
  }, [pending, visible]);

  if (!visible && !leaving) return null;

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[600] h-[2px] overflow-hidden",
        "transition-opacity duration-300 ease-out",
        leaving ? "opacity-0" : "opacity-100",
      )}
      aria-hidden
    >
      <div className="nav-progress-rail absolute inset-y-0 left-0 w-full" />
    </div>
  );
}
