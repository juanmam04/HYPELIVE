import { describe, expect, it } from "vitest";
import {
  channelToDatabase,
  channelToDomain,
  episodeToDatabase,
  episodeToDomain,
  episodeToVideo,
  profileToDatabase,
  profileToDomain,
  programToDatabase,
  programToDomain,
  streamToDatabase,
  streamToDomain,
  videoToEpisode,
  watchProgressToDatabase,
  watchProgressToDomain,
} from "./mappers";
import type {
  ChannelRow,
  EpisodeRow,
  ProfileRow,
  ProgramRow,
  StreamRow,
  WatchProgressRow,
} from "./rows";

describe("mappers snake_case ↔ camelCase", () => {
  it("maps profile both ways", () => {
    const row: ProfileRow = {
      id: "a1111111-1111-4111-8111-111111111101",
      username: "ana",
      display_name: "Ana",
      avatar_url: null,
      role: "viewer",
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    };
    const domain = profileToDomain(row);
    expect(domain.id).toBe("a1111111-1111-4111-8111-111111111101");
    expect(domain.displayName).toBe("Ana");
    expect(domain.username).toBe("ana");
    expect(profileToDatabase(domain)).toEqual(row);
  });

  it("maps channel both ways", () => {
    const row: ChannelRow = {
      id: "b2222222-2222-4222-8222-222222222201",
      slug: "nocturna",
      name: "Nocturna",
      description: null,
      logo_url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=200",
      banner_url: null,
      is_verified: true,
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    };
    const domain = channelToDomain(row);
    expect(domain.slug).toBe("nocturna");
    expect(domain.isVerified).toBe(true);
    expect(channelToDatabase(domain)).toEqual(row);
  });

  it("maps program with banner and is_active", () => {
    const row: ProgramRow = {
      id: "d4444444-4444-4444-8444-444444444401",
      channel_id: "b2222222-2222-4222-8222-222222222201",
      slug: "la-noche-es-nuestra",
      title: "La Noche es Nuestra",
      description: "Conversación nocturna",
      artwork_url: null,
      banner_url: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=1200",
      schedule_description: "Lunes a viernes · 22:00",
      is_active: true,
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    };
    const domain = programToDomain(row);
    expect(domain.bannerUrl).toContain("unsplash");
    expect(domain.isActive).toBe(true);
    expect(programToDatabase(domain)).toEqual(row);
  });

  it("maps stream both ways", () => {
    const row: StreamRow = {
      id: "e5555555-5555-4555-8555-555555555501",
      channel_id: "b2222222-2222-4222-8222-222222222201",
      program_id: null,
      title: "Late set",
      description: null,
      status: "live",
      scheduled_for: null,
      started_at: "2026-01-01T00:00:00.000Z",
      ended_at: null,
      viewer_count: 42,
      thumbnail_url: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=1280",
      playback_id: "pb_live_001",
      provider: "mock",
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    };
    const domain = streamToDomain(row);
    expect(domain.channelId).toBe("b2222222-2222-4222-8222-222222222201");
    expect(domain.viewerCount).toBe(42);
    expect(domain.playbackId).toBe("pb_live_001");
    expect(domain.scheduledFor).toBeNull();
    expect(streamToDatabase(domain)).toEqual(row);
  });

  it("maps episode both ways", () => {
    const row: EpisodeRow = {
      id: "f6666666-6666-4666-8666-666666666601",
      program_id: "d4444444-4444-4444-8444-444444444401",
      season_id: "c3333333-3333-4333-8333-333333333301",
      source_stream_id: "e5555555-5555-4555-8555-555555555508",
      source_recording_id: "aa888888-8888-4888-8888-888888888801",
      title: "Episodio 1 — Arrancamos la noche",
      description: "Primera emisión de la temporada.",
      episode_number: 1,
      aired_at: "2026-07-01T22:00:00.000Z",
      duration_seconds: 3600,
      thumbnail_url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1280",
      playback_id: "pb_ep_001",
      status: "published",
      published_at: "2026-07-02T10:00:00.000Z",
      created_at: "2026-07-01T00:00:00.000Z",
      updated_at: "2026-07-02T10:00:00.000Z",
    };
    const domain = episodeToDomain(row);
    expect(domain.programId).toBe("d4444444-4444-4444-8444-444444444401");
    expect(domain.episodeNumber).toBe(1);
    expect(domain.status).toBe("published");
    expect(domain.sourceRecordingId).toBe("aa888888-8888-4888-8888-888888888801");
    expect(episodeToDatabase(domain)).toEqual(row);
  });

  it("adapts episode ↔ video for compatibility", () => {
    const episode = episodeToDomain({
      id: "f6666666-6666-4666-8666-666666666699",
      program_id: "d4444444-4444-4444-8444-444444444401",
      season_id: null,
      source_stream_id: null,
      source_recording_id: null,
      title: "Highlights",
      description: null,
      episode_number: 2,
      aired_at: null,
      duration_seconds: 600,
      thumbnail_url: null,
      playback_id: "pb_ep_hl",
      status: "published",
      published_at: "2026-07-10T12:00:00.000Z",
      created_at: "2026-07-10T00:00:00.000Z",
      updated_at: "2026-07-10T12:00:00.000Z",
    });
    const video = episodeToVideo(episode, "b2222222-2222-4222-8222-222222222201");
    expect(video.status).toBe("ready");
    expect(video.channelId).toBe("b2222222-2222-4222-8222-222222222201");
    expect(video.programId).toBe(episode.programId);

    const back = videoToEpisode(video);
    expect(back.id).toBe(episode.id);
    expect(back.status).toBe("published");
    expect(back.programId).toBe(episode.programId);
  });

  it("maps watch progress with episode_id", () => {
    const row: WatchProgressRow = {
      id: "bb888888-8888-4888-8888-888888888801",
      user_id: "a1111111-1111-4111-8111-111111111105",
      episode_id: "f6666666-6666-4666-8666-666666666601",
      progress_seconds: 1200,
      completed: false,
      updated_at: "2026-07-14T18:00:00.000Z",
      video_id: null,
    };
    const domain = watchProgressToDomain(row);
    expect(domain.episodeId).toBe("f6666666-6666-4666-8666-666666666601");
    expect(domain.videoId).toBeUndefined();
    expect(watchProgressToDatabase(domain)).toEqual(row);
  });
});
