"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

type NavigationContextValue = {
  pending: boolean;
  start: () => void;
  done: () => void;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

function isInternalHref(href: string) {
  if (!href || href.startsWith("#")) return false;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  if (href.startsWith("http://") || href.startsWith("https://")) {
    try {
      return new URL(href).origin === window.location.origin;
    } catch {
      return false;
    }
  }
  return href.startsWith("/");
}

/**
 * Tracks in-flight navigations for a premium top indicator (no page dim).
 */
export function NavigationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [pending, setPending] = useState(false);
  const safety = useRef<number | null>(null);

  const clearSafety = useCallback(() => {
    if (safety.current) {
      window.clearTimeout(safety.current);
      safety.current = null;
    }
  }, []);

  const done = useCallback(() => {
    clearSafety();
    setPending(false);
  }, [clearSafety]);

  const start = useCallback(() => {
    setPending(true);
    clearSafety();
    safety.current = window.setTimeout(() => setPending(false), 6000);
  }, [clearSafety]);

  useEffect(() => {
    done();
  }, [pathname, done]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest?.(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (!anchor || (anchor.target && anchor.target !== "_self")) return;
      if (anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || !isInternalHref(href)) return;
      try {
        const next = new URL(href, window.location.origin);
        if (
          next.pathname === window.location.pathname &&
          next.search === window.location.search
        ) {
          return;
        }
      } catch {
        return;
      }
      start();
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [start]);

  useEffect(() => () => clearSafety(), [clearSafety]);

  const value = useMemo(
    () => ({ pending, start, done }),
    [pending, start, done],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    return { pending: false, start: () => undefined, done: () => undefined };
  }
  return ctx;
}
