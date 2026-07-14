"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { EMPTY_STATE } from "@hypelive/domain";
import { cn } from "@/lib/cn";
import { Button } from "./Button";

export function ErrorState({
  title = EMPTY_STATE.genericError,
  description = "No pudimos cargar este contenido.",
  onRetry,
  homeHref = "/home",
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  homeHref?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded border border-border-subtle bg-slate/40 px-6 py-12 text-center",
        className,
      )}
      role="alert"
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-danger/15 text-danger">
        <AlertTriangle className="size-5" aria-hidden />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-text-primary">{title}</h3>
        <p className="max-w-sm text-sm text-text-muted">{description}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {onRetry ? (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Reintentar
          </Button>
        ) : null}
        <Link href={homeHref}>
          <Button variant="ghost" size="sm">
            Volver
          </Button>
        </Link>
      </div>
    </div>
  );
}
