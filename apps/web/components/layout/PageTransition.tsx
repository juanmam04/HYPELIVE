"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

/**
 * Discrete content fade on route change. Shell stays stable.
 */
export function PageTransition({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const [animKey, setAnimKey] = useState(pathname);
  const prev = useRef(pathname);

  useEffect(() => {
    if (prev.current !== pathname) {
      prev.current = pathname;
      setAnimKey(pathname);
    }
  }, [pathname]);

  return (
    <div key={animKey} className={cn("page-enter", className)}>
      {children}
    </div>
  );
}
