import type { Stream, Video } from "@hypelive/types";

/** Start / stop broadcast ingest (Phase 1 stub). */
export interface Broadcaster {
  startBroadcast(streamId: string): Promise<{ ingestUrl: string }>;
  stopBroadcast(streamId: string): Promise<void>;
  getIngestHealth(streamId: string): Promise<"ok" | "degraded" | "down">;
}

/** Playback control surface. */
export interface Playback {
  load(sourceUrl: string): Promise<void>;
  play(): Promise<void>;
  pause(): Promise<void>;
  seek(positionSeconds: number): Promise<void>;
  getPosition(): Promise<number>;
  destroy(): Promise<void>;
}

/** Recording of a live session into a VOD asset. */
export interface Recording {
  startRecording(streamId: string): Promise<{ recordingId: string }>;
  stopRecording(recordingId: string): Promise<Video | null>;
  getRecordingStatus(
    recordingId: string,
  ): Promise<"recording" | "processing" | "ready" | "failed">;
}

/** Thumbnail generation for streams / videos. */
export interface ThumbnailGeneration {
  generateFromStream(streamId: string): Promise<string>;
  generateFromVideo(videoId: string, atSeconds?: number): Promise<string>;
}

export type StreamWebhookEvent =
  | "stream.started"
  | "stream.ended"
  | "stream.health"
  | "recording.ready";

export interface StreamWebhookPayload {
  event: StreamWebhookEvent;
  streamId: string;
  occurredAt: string;
  data?: Record<string, unknown>;
}

/** Inbound / outbound stream lifecycle webhooks. */
export interface StreamWebhooks {
  verifySignature(rawBody: string, signature: string): boolean;
  handle(payload: StreamWebhookPayload): Promise<void>;
}

/** Async video processing pipeline. */
export interface VideoProcessing {
  enqueueTranscode(videoId: string): Promise<{ jobId: string }>;
  getJobStatus(jobId: string): Promise<"queued" | "running" | "done" | "failed">;
  attachToStream(stream: Stream, videoId: string): Promise<Video>;
}
