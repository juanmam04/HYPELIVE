"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Thin top progress bar — only if navigation takes > delayMs.
 */
export function NavigationProgress({ delayMs = 180 }: { delayMs?: number }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const prev = useRef(pathname);

  useEffect(() => {
    if (prev.current === pathname) return;
    prev.current = pathname;
    setWidth(12);
    const show = window.setTimeout(() => setVisible(true), delayMs);
    const mid = window.setTimeout(() => setWidth(72), delayMs + 80);
    const done = window.setTimeout(() => {
      setWidth(100);
      window.setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 200);
    }, delayMs + 240);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(mid);
      window.clearTimeout(done);
    };
  }, [pathname, delayMs]);

  if (!visible && width === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[600] h-0.5 bg-transparent"
      aria-hidden
    >
      <div
        className="h-full bg-accent transition-[width] duration-fast ease-standard"
        style={{
          width: `${width}%`,
          opacity: visible ? 1 : 0,
        }}
      />
    </div>
  );
}
