"use client";

import { useEffect } from "react";
import Link from "next/link";
import { reportError } from "@/lib/sentry";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, { boundary: "app-error" });
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm font-medium text-live">Error</p>
      <h1 className="text-3xl font-bold text-text-primary">Algo no respondió</h1>
      <p className="text-sm text-text-muted">
        Podés reintentar o volver al inicio. Si el problema continúa, revisá la
        conexión.
      </p>
      <div className="flex gap-2">
        <Button onClick={reset}>Reintentar</Button>
        <Link
          href="/home"
          className="inline-flex h-10 items-center rounded border border-border bg-elevated px-4 text-sm font-medium"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
