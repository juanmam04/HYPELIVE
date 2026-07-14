export interface VideoSource {
  url: string;
  mimeType?: string;
  posterUrl?: string | null;
}

export interface VideoProvider {
  /** Resolve playback from a provider `playbackId` (stream or VOD). */
  getPlaybackSource(playbackId: string): Promise<VideoSource | null>;
  /** Resolve live playback from a provider `playbackId`. */
  getLiveSource(playbackId: string): Promise<VideoSource | null>;
  isReady(playbackId: string): Promise<boolean>;
}

export class MockVideoProvider implements VideoProvider {
  private readonly baseUrl: string;

  constructor(baseUrl = "https://cdn.example.com/mock") {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async getPlaybackSource(playbackId: string): Promise<VideoSource> {
    return {
      url: `${this.baseUrl}/playback/${playbackId}.m3u8`,
      mimeType: "application/x-mpegURL",
      posterUrl: `${this.baseUrl}/posters/${playbackId}.jpg`,
    };
  }

  async getLiveSource(playbackId: string): Promise<VideoSource> {
    return {
      url: `${this.baseUrl}/live/${playbackId}.m3u8`,
      mimeType: "application/x-mpegURL",
      posterUrl: `${this.baseUrl}/posters/live-${playbackId}.jpg`,
    };
  }

  async isReady(_playbackId: string): Promise<boolean> {
    return true;
  }
}
