"use client";

import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "./Button";

export function ErrorState({
  title = "Algo salió mal",
  description = "No pudimos cargar este contenido. Intenta de nuevo.",
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-12 text-center",
        className,
      )}
      role="alert"
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-danger/15 text-danger">
        <AlertTriangle className="size-5" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-text-primary">{title}</h3>
        <p className="max-w-sm text-sm text-text-muted">{description}</p>
      </div>
      {onRetry ? (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      ) : null}
    </div>
  );
}
