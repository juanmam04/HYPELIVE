"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { SearchHit, SearchHitKind } from "@hypelive/api";
import { LiveBadge } from "@/components/ui/LiveBadge";
import { Thumbnail } from "@/components/ui/Thumbnail";
import { cn } from "@/lib/cn";

const KIND_LABEL: Record<SearchHitKind, string> = {
  channel: "Canal",
  program: "Programa",
  episode: "Episodio",
  stream: "En vivo",
};

export function SearchHitList({
  hits,
  onSelect,
  dense = false,
  className,
}: {
  hits: SearchHit[];
  onSelect?: () => void;
  dense?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <ul className={cn("space-y-1.5", className)} role="list">
      <AnimatePresence initial={false} mode="popLayout">
        {hits.map((hit, i) => (
          <motion.li
            key={`${hit.kind}-${hit.id}`}
            layout={!reduce}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -4 }}
            transition={{
              duration: reduce ? 0 : 0.18,
              delay: reduce ? 0 : Math.min(i * 0.028, 0.18),
              ease: [0.2, 0, 0, 1],
            }}
          >
            <Link
              href={hit.href}
              onClick={onSelect}
              className={cn(
                "group flex items-center gap-3 rounded border border-transparent bg-slate/80 transition-colors duration-fast",
                "hover:border-border hover:bg-elevated",
                dense ? "p-2" : "p-2.5",
              )}
            >
              <div
                className={cn(
                  "relative shrink-0 overflow-hidden rounded bg-charcoal",
                  dense ? "size-11" : "size-14",
                )}
              >
                <Thumbnail
                  src={hit.thumbnailUrl}
                  seed={hit.id + hit.title}
                  className="size-full transition-transform duration-fast group-hover:scale-[1.04]"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                    {KIND_LABEL[hit.kind]}
                  </span>
                  {hit.live ? <LiveBadge /> : null}
                </div>
                <p className="truncate font-semibold text-text-primary transition-colors duration-fast group-hover:text-white">
                  {hit.title}
                </p>
                {hit.subtitle ? (
                  <p className="truncate text-sm text-text-muted">
                    {hit.subtitle}
                  </p>
                ) : null}
              </div>
            </Link>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
