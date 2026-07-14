import type { Broadcaster } from "@hypelive/domain";

export type BroadcastQuality = "480p" | "720p" | "1080p";
export type ConnectionQuality = "excellent" | "good" | "poor" | "offline";
export type CameraFacing = "user" | "environment";

export type BroadcasterPreviewState = {
  facing: CameraFacing;
  micEnabled: boolean;
  flashEnabled: boolean;
  quality: BroadcastQuality;
  connection: ConnectionQuality;
  isLive: boolean;
  title: string;
  programId: string | null;
  startedAt: number | null;
  viewerCount: number;
};

/**
 * Phase 0 mock broadcaster.
 *
 * Future SDK (IVS / Agora / custom) should implement `@hypelive/domain` Broadcaster
 * and optionally drive a real camera preview module. This class never requests
 * camera or microphone permissions.
 */
export class MockBroadcaster implements Broadcaster {
  private state: BroadcasterPreviewState = {
    facing: "user",
    micEnabled: true,
    flashEnabled: false,
    quality: "720p",
    connection: "excellent",
    isLive: false,
    title: "",
    programId: null,
    startedAt: null,
    viewerCount: 0,
  };

  private viewerTimer: ReturnType<typeof setInterval> | null = null;

  getPreviewState(): BroadcasterPreviewState {
    return { ...this.state };
  }

  setTitle(title: string): void {
    this.state.title = title;
  }

  setProgramId(programId: string | null): void {
    this.state.programId = programId;
  }

  flipCamera(): void {
    this.state.facing = this.state.facing === "user" ? "environment" : "user";
  }

  toggleMic(): void {
    this.state.micEnabled = !this.state.micEnabled;
  }

  toggleFlash(): void {
    this.state.flashEnabled = !this.state.flashEnabled;
  }

  setQuality(quality: BroadcastQuality): void {
    this.state.quality = quality;
  }

  async startBroadcast(streamId: string): Promise<{ ingestUrl: string }> {
    this.state.isLive = true;
    this.state.startedAt = Date.now();
    this.state.viewerCount = 12;
    this.state.connection = "excellent";
    this.viewerTimer = setInterval(() => {
      this.state.viewerCount += Math.floor(Math.random() * 5);
    }, 4000);
    return { ingestUrl: `mock://ingest/${streamId}` };
  }

  async stopBroadcast(_streamId: string): Promise<void> {
    this.state.isLive = false;
    this.state.startedAt = null;
    this.state.viewerCount = 0;
    if (this.viewerTimer) {
      clearInterval(this.viewerTimer);
      this.viewerTimer = null;
    }
  }

  async getIngestHealth(_streamId: string): Promise<"ok" | "degraded" | "down"> {
    if (this.state.connection === "offline") return "down";
    if (this.state.connection === "poor") return "degraded";
    return "ok";
  }

  destroy(): void {
    if (this.viewerTimer) clearInterval(this.viewerTimer);
  }
}
