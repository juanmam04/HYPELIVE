"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { studioQueryOptions } from "@hypelive/api";
import { formatDuration } from "@hypelive/domain";
import { StreamingShell } from "@/components/layout/StreamingShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { apiOptions } from "@/lib/api-options";
import {
  formatScheduleDate,
  normalizeStudioSummary,
  posterGradient,
  type AppRecording,
} from "@/lib/models";

export default function StudioRecordingsPage() {
  const query = useQuery(studioQueryOptions(undefined, apiOptions()));
  const studio = query.data ? normalizeStudioSummary(query.data) : null;
  const { toast } = useToast();
  const [selected, setSelected] = useState<AppRecording | null>(null);
  const [busy, setBusy] = useState(false);

  async function convertToEpisode() {
    if (!selected) return;
    setBusy(true);
    await new Promise((r) => window.setTimeout(r, 900));
    setBusy(false);
    setSelected(null);
    toast("Grabación convertida a episodio (simulación)", {
      tone: "success",
    });
  }

  return (
    <StreamingShell>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                Grabaciones
              </h1>
              <p className="mt-1 text-sm text-text-muted">
                Convertí una grabación lista en episodio publicado.
              </p>
            </div>
            <Link href="/studio">
              <Button variant="secondary" size="sm">
                ← Studio
              </Button>
            </Link>
          </div>

          {query.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded" />
              ))}
            </div>
          ) : null}

          {query.isError ? (
            <ErrorState onRetry={() => void query.refetch()} />
          ) : null}

          {studio && !query.isLoading ? (
            studio.recordings.length === 0 ? (
              <EmptyState title="Sin grabaciones" />
            ) : (
              <ul className="divide-y divide-border-subtle overflow-hidden rounded border border-border-subtle bg-slate">
                {studio.recordings.map((rec) => (
                  <li
                    key={rec.id}
                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className="size-16 shrink-0 rounded bg-charcoal"
                        style={{
                          backgroundImage: rec.thumbnailUrl
                            ? `url(${rec.thumbnailUrl})`
                            : posterGradient(rec.id),
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-text-primary">
                          {rec.streamTitle ?? "Grabación"}
                        </p>
                        <p className="text-sm text-text-muted">
                          {formatScheduleDate(rec.createdAt)}
                          {rec.durationSeconds
                            ? ` · ${formatDuration(rec.durationSeconds)}`
                            : null}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        tone={
                          rec.status === "ready"
                            ? "success"
                            : rec.status === "failed"
                              ? "warning"
                              : "muted"
                        }
                      >
                        {rec.status === "ready"
                          ? "Lista"
                          : rec.status === "processing"
                            ? "Procesando"
                            : rec.status === "failed"
                              ? "Falló"
                              : rec.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={rec.status !== "ready"}
                        onClick={() => setSelected(rec)}
                      >
                        Convertir a episodio
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )
          ) : null}
        </div>
      </div>

      <Dialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Convertir a episodio"
        description={
          selected
            ? `Se creará un episodio a partir de “${selected.streamTitle ?? "esta grabación"}”. (UI mock — Phase 0)`
            : undefined
        }
        confirmLabel="Convertir"
        onConfirm={() => void convertToEpisode()}
        loading={busy}
      />
    </StreamingShell>
  );
}
