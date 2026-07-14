import type { Episode, EpisodeStatus } from "@hypelive/types";

export function isPublishedEpisode(
  episode: Pick<Episode, "status"> | EpisodeStatus,
): boolean {
  const status = typeof episode === "string" ? episode : episode.status;
  return status === "published";
}

export function canWatchEpisode(
  episode: Pick<Episode, "status" | "playbackId">,
): boolean {
  return isPublishedEpisode(episode) && Boolean(episode.playbackId);
}

export const EMPTY_STATE = {
  channelNoPrograms: "Este canal todavía no publicó programas.",
  programNoEpisodes: "Todavía no hay episodios disponibles.",
  noLiveStreams: "No hay transmisiones en vivo en este momento.",
  episodeProcessing: "Estamos preparando la repetición.",
  episodeUnavailable: "Este episodio no está disponible.",
  genericError: "Algo salió mal. Intentá nuevamente.",
} as const;

export function upcomingStreamMessage(scheduledFor: string): string {
  return `Próxima transmisión: ${scheduledFor}.`;
}
