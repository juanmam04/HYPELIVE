import { Inbox } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "./Button";

export function EmptyState({
  title = "Sin contenido",
  description,
  actionLabel,
  onAction,
  className,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded border border-border-subtle bg-slate/40 px-6 py-12 text-center",
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-elevated text-text-muted">
        <Inbox className="size-5" aria-hidden />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-text-primary">{title}</h3>
        {description ? (
          <p className="max-w-sm text-sm text-text-muted">{description}</p>
        ) : null}
      </div>
      {actionLabel && onAction ? (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
