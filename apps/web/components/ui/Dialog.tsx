"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
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
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);
  const submitting = useRef(false);

  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    window.setTimeout(() => {
      panelRef.current
        ?.querySelector<HTMLElement>("button, [href], input")
        ?.focus();
    }, 20);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (triggerRef.current instanceof HTMLElement) {
        triggerRef.current.focus();
      }
    };
  }, [open, onClose, loading]);

  async function handleConfirm() {
    if (!onConfirm || loading || submitting.current) return;
    submitting.current = true;
    try {
      await onConfirm();
    } finally {
      submitting.current = false;
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Cerrar diálogo"
            className="absolute inset-0 bg-ink/75"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={() => {
              if (!loading) onClose();
            }}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={cn(
              "relative z-10 w-full max-w-md rounded-xl border border-border bg-charcoal p-5 shadow-deep",
            )}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2
                  id={titleId}
                  className="font-display text-xl text-text-primary"
                >
                  {title}
                </h2>
                {description ? (
                  <p className="mt-1 text-sm text-text-muted">{description}</p>
                ) : null}
              </div>
              <IconButton
                label="Cerrar"
                onClick={onClose}
                disabled={loading}
              >
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
                  onClick={() => void handleConfirm()}
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
