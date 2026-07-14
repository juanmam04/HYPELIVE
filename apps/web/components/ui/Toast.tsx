"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { useToastStore } from "@/stores/toast";
import { IconButton } from "./IconButton";

const toneClass = {
  default: "border-border",
  success: "border-success/40",
  error: "border-danger/40",
  info: "border-info/40",
};

export function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[500] flex w-full max-w-sm flex-col gap-2"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            id={toast.id}
            title={toast.title}
            description={toast.description}
            tone={toast.tone}
            onDismiss={dismiss}
            reduceMotion={Boolean(reduceMotion)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({
  id,
  title,
  description,
  tone,
  onDismiss,
  reduceMotion,
}: {
  id: string;
  title: string;
  description?: string;
  tone: keyof typeof toneClass;
  onDismiss: (id: string) => void;
  reduceMotion: boolean;
}) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(id), 4200);
    return () => window.clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <motion.div
      layout
      initial={reduceMotion ? false : { opacity: 0, y: 16, x: 8 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
      transition={{ duration: reduceMotion ? 0 : 0.16 }}
      className={cn(
        "pointer-events-auto rounded-lg border bg-elevated/95 p-3 shadow-soft backdrop-blur",
        toneClass[tone],
      )}
    >
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text-primary">{title}</p>
          {description ? (
            <p className="mt-0.5 text-sm text-text-muted">{description}</p>
          ) : null}
        </div>
        <IconButton label="Cerrar aviso" size="sm" onClick={() => onDismiss(id)}>
          <X className="size-3.5" />
        </IconButton>
      </div>
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastViewport />
    </>
  );
}

export function useToast() {
  const push = useToastStore((s) => s.push);
  const dismiss = useToastStore((s) => s.dismiss);
  return {
    toast: (
      title: string,
      options?: { description?: string; tone?: "default" | "success" | "error" | "info" },
    ) =>
      push({
        title,
        description: options?.description,
        tone: options?.tone ?? "default",
      }),
    dismiss,
  };
}
