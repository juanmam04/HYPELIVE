import type { StreamStatus } from "@hypelive/types";

export const STREAM_STATUS_LABELS: Record<StreamStatus, string> = {
  scheduled: "Programado",
  starting: "Iniciando",
  live: "En vivo",
  processing: "Procesando",
  ended: "Finalizado",
  failed: "Fallido",
};

export function getStreamStatusLabel(status: StreamStatus): string {
  return STREAM_STATUS_LABELS[status];
}

export function isLive(status: StreamStatus): boolean {
  return status === "live";
}

export function canChat(status: StreamStatus): boolean {
  return status === "live" || status === "starting";
}

export function isStreamActive(status: StreamStatus): boolean {
  return status === "live" || status === "scheduled" || status === "starting";
}
