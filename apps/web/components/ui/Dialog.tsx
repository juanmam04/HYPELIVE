"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { IconButton } from "./IconButton";
import { Button } from "./Button";

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  confirmLabel,
  cancelLabel = "Cancelar",
  onConfirm,
  loading,
  tone = "default",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  loading?: boolean;
  tone?: "default" | "danger";
}) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Cerrar diálogo"
            className="absolute inset-0 bg-ink/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.16 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            className={cn(
              "relative z-10 w-full max-w-md rounded-xl border border-border bg-charcoal p-5 shadow-deep",
            )}
            initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 id="dialog-title" className="font-display text-xl text-text-primary">
                  {title}
                </h2>
                {description ? (
                  <p className="mt-1 text-sm text-text-muted">{description}</p>
                ) : null}
              </div>
              <IconButton label="Cerrar" onClick={onClose}>
                <X className="size-4" />
              </IconButton>
            </div>
            {children}
            {(confirmLabel || onConfirm) && (
              <div className="mt-5 flex justify-end gap-2">
                <Button variant="ghost" onClick={onClose} disabled={loading}>
                  {cancelLabel}
                </Button>
                <Button
                  variant={tone === "danger" ? "danger" : "primary"}
                  loading={loading}
                  onClick={onConfirm}
                >
                  {confirmLabel ?? "Confirmar"}
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
