"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { searchQueryOptions, type SearchHitKind } from "@hypelive/api";
import { StreamingShell } from "@/components/layout/StreamingShell";
import { SearchHitList } from "@/components/search/SearchHitList";
import { SearchInput } from "@/components/ui/SearchInput";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { apiOptions } from "@/lib/api-options";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import { cn } from "@/lib/cn";

const FILTERS: Array<{ id: "all" | SearchHitKind; label: string }> = [
  { id: "all", label: "Todo" },
  { id: "stream", label: "En vivo" },
  { id: "program", label: "Programas" },
  { id: "episode", label: "Episodios" },
  { id: "channel", label: "Canales" },
];

function BuscarContent() {
  const params = useSearchParams();
  const router = useRouter();
  const reduce = useReducedMotion();
  const initial = params.get("q") ?? "";
  const [q, setQ] = useState(initial);
  const [filter, setFilter] = useState<"all" | SearchHitKind>("all");
  const debounced = useDebouncedValue(q, 200);

  useEffect(() => {
    setQ(initial);
  }, [initial]);

  useEffect(() => {
    const next = debounced.trim();
    const current = params.get("q") ?? "";
    if (next === current) return;
    const url = next ? `/buscar?q=${encodeURIComponent(next)}` : "/buscar";
    router.replace(url, { scroll: false });
  }, [debounced, params, router]);

  const query = useQuery(searchQueryOptions(debounced, apiOptions()));

  const hits = useMemo(() => {
    const list = query.data ?? [];
    if (filter === "all") return list;
    return list.filter((h) => h.kind === filter);
  }, [query.data, filter]);

  const waiting = q.trim() !== debounced.trim();
  const ready = debounced.trim().length >= 2;

  return (
    <div className="mx-auto max-w-3xl">
      <motion.h1
        className="mb-4 text-2xl font-bold text-text-primary"
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
      >
        Buscar
      </motion.h1>

      <SearchInput
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onClear={() => setQ("")}
        placeholder="Canales, programas, episodios…"
        autoFocus
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                "relative rounded px-3 py-1.5 text-sm font-medium transition-colors duration-fast",
                active
                  ? "text-text-on-accent"
                  : "bg-slate text-text-muted hover:text-text-primary",
              )}
            >
              {active ? (
                <motion.span
                  layoutId={reduce ? undefined : "search-filter-pill"}
                  className="absolute inset-0 rounded bg-accent"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              ) : null}
              <span className="relative z-[1]">{f.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 min-h-[12rem]">
        <AnimatePresence mode="wait">
          {q.trim().length < 2 ? (
            <motion.div
              key="hint"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              <EmptyState
                title="Escribí para buscar"
                description="Los resultados aparecen al instante mientras tipeás."
              />
            </motion.div>
          ) : null}

          {ready && (query.isLoading || waiting) ? (
            <motion.div
              key="loading"
              className="space-y-2"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded" delayMs={40 + i * 40} />
              ))}
            </motion.div>
          ) : null}

          {ready && query.isError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ErrorState onRetry={() => void query.refetch()} />
            </motion.div>
          ) : null}

          {ready && !query.isLoading && !waiting && !query.isError ? (
            <motion.div
              key={`results-${filter}-${debounced}`}
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
            >
              {hits.length === 0 ? (
                <EmptyState
                  title="Sin resultados"
                  description={`No encontramos nada para “${debounced.trim()}”.`}
                />
              ) : (
                <>
                  <p className="mb-3 text-sm text-text-muted">
                    {hits.length} resultado{hits.length === 1 ? "" : "s"}
                  </p>
                  <SearchHitList hits={hits} />
                </>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function BuscarPage() {
  return (
    <StreamingShell>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="mx-auto max-w-3xl space-y-3">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-11 w-full" />
            </div>
          }
        >
          <BuscarContent />
        </Suspense>
      </div>
    </StreamingShell>
  );
}
