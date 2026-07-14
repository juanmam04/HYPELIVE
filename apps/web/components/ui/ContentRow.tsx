"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Horizontal content row with soft scroll, edge fades, and arrows.
 * Does not hijack vertical scroll.
 */
export function ContentRow({
  children,
  className,
  ariaLabel = "Fila de contenido",
}: {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanLeft(scrollLeft > 8);
    setCanRight(scrollLeft + clientWidth < scrollWidth - 8);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update, children]);

  function scrollByDir(dir: -1 | 1) {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(480, el.clientWidth * 0.85), behavior: "smooth" });
  }

  return (
    <div className={cn("group/row relative", className)}>
      {canLeft ? (
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-ink to-transparent"
          aria-hidden
        />
      ) : null}
      {canRight ? (
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-ink to-transparent"
          aria-hidden
        />
      ) : null}

      <button
        type="button"
        aria-label="Anterior"
        disabled={!canLeft}
        onClick={() => scrollByDir(-1)}
        className={cn(
          "absolute left-1 top-1/2 z-20 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full",
          "border border-border bg-elevated/95 text-text-primary shadow-soft transition-all duration-fast",
          "hover:bg-slate hover:[&_svg]:-translate-x-0.5 disabled:opacity-0",
          "md:flex",
          canLeft ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <ChevronLeft className="size-5 transition-transform duration-fast" />
      </button>

      <button
        type="button"
        aria-label="Siguiente"
        disabled={!canRight}
        onClick={() => scrollByDir(1)}
        className={cn(
          "absolute right-1 top-1/2 z-20 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full",
          "border border-border bg-elevated/95 text-text-primary shadow-soft transition-all duration-fast",
          "hover:bg-slate hover:[&_svg]:translate-x-0.5 disabled:opacity-0",
          "md:flex",
          canRight ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <ChevronRight className="size-5 transition-transform duration-fast" />
      </button>

      <div
        ref={ref}
        role="list"
        aria-label={ariaLabel}
        className="flex gap-3 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
      >
        {children}
      </div>
    </div>
  );
}
