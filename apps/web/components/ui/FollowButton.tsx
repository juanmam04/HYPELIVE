"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

type FollowState = "idle" | "following" | "loading" | "error";

export function FollowButton({
  label = "Seguir",
  followingLabel = "Siguiendo",
  initialFollowing = false,
  className,
  size = "sm",
  onToggle,
}: {
  label?: string;
  followingLabel?: string;
  initialFollowing?: boolean;
  className?: string;
  size?: "sm" | "md";
  onToggle?: (next: boolean) => Promise<void> | void;
}) {
  const { toast } = useToast();
  const [state, setState] = useState<FollowState>(
    initialFollowing ? "following" : "idle",
  );

  async function handleClick() {
    if (state === "loading") return;
    const next = state !== "following";
    setState("loading");
    try {
      await onToggle?.(next);
      setState(next ? "following" : "idle");
      toast(next ? followingLabel : "Dejaste de seguir", {
        tone: "success",
      });
    } catch {
      setState("error");
      toast("No se pudo actualizar", { tone: "error" });
      window.setTimeout(() => setState(next ? "idle" : "following"), 1600);
    }
  }

  const text =
    state === "loading"
      ? "…"
      : state === "following"
        ? followingLabel
        : state === "error"
          ? "Reintentar"
          : label;

  return (
    <Button
      size={size}
      variant={state === "following" ? "secondary" : "primary"}
      loading={state === "loading"}
      tone={state === "error" ? "error" : "default"}
      onClick={() => void handleClick()}
      className={cn("min-w-[7.5rem]", className)}
      aria-pressed={state === "following"}
    >
      {text}
    </Button>
  );
}

type ReminderState = "idle" | "set" | "loading" | "error";

export function ReminderButton({
  className,
  onToggle,
}: {
  className?: string;
  onToggle?: (next: boolean) => Promise<void> | void;
}) {
  const { toast } = useToast();
  const [state, setState] = useState<ReminderState>("idle");

  async function handleClick() {
    if (state === "loading") return;
    const next = state !== "set";
    setState("loading");
    try {
      await onToggle?.(next);
      setState(next ? "set" : "idle");
      toast(next ? "Recordatorio activado" : "Recordatorio quitado", {
        tone: "success",
      });
    } catch {
      setState("error");
      toast("No se pudo guardar el recordatorio", { tone: "error" });
      window.setTimeout(() => setState(next ? "idle" : "set"), 1600);
    }
  }

  return (
    <Button
      size="sm"
      variant={state === "set" ? "secondary" : "outline"}
      loading={state === "loading"}
      tone={state === "error" ? "error" : "default"}
      onClick={() => void handleClick()}
      className={cn("min-w-[10.5rem]", className)}
      aria-pressed={state === "set"}
    >
      {state === "loading"
        ? "…"
        : state === "set"
          ? "Recordatorio activado"
          : state === "error"
            ? "Reintentar"
            : "Recordarme"}
    </Button>
  );
}
