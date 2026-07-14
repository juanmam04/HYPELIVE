import { describe, expect, it } from "vitest";
import {
  getChannelBySlug,
  getChannelDetail,
  getEpisodeById,
  getHomeFeed,
  getNextEpisode,
  getPreviousEpisode,
  getProgramBySlug,
  getProgramDetail,
  getProgramEpisodes,
  getRelatedEpisodes,
  getStreamById,
  getVideoById,
  mockEpisodes,
  mockPrograms,
  mockStreams,
} from "./index";

const opts = { useMock: true as const };

describe("content hierarchy queries (mock)", () => {
  it("home feed separates streams, channels, programs and episodes", async () => {
    const feed = await getHomeFeed(opts);
    expect(feed.featured?.status).toBe("live");
    expect(feed.liveNow.length).toBeGreaterThan(0);
    expect(feed.featuredChannels.length).toBe(4);
    expect(feed.popularPrograms.length).toBeGreaterThan(0);
    expect(feed.recentEpisodes.length).toBeGreaterThan(0);
  });

  it("channel → programs", async () => {
    const channel = await getChannelBySlug("nocturna", opts);
    expect(channel?.name).toBe("Nocturna");
    const detail = await getChannelDetail("nocturna", opts);
    expect(detail?.programs.length).toBeGreaterThanOrEqual(3);
    expect(detail?.programs.every((p) => p.channelId === channel!.id)).toBe(
      true,
    );
  });

  it("program → episodes", async () => {
    const program = await getProgramBySlug(
      "nocturna",
      "la-noche-es-nuestra",
      opts,
    );
    expect(program?.title).toContain("Noche");
    const episodes = await getProgramEpisodes(program!.id, opts);
    expect(episodes.length).toBeGreaterThan(0);
    expect(episodes.every((e) => e.programId === program!.id)).toBe(true);

    const detail = await getProgramDetail(
      "nocturna",
      "la-noche-es-nuestra",
      opts,
    );
    expect(detail?.hosts.length).toBeGreaterThan(0);
    expect(detail?.episodes.length).toBeGreaterThan(0);
  });

  it("stream can have program_id or be a channel event (null)", async () => {
    const withProgram = mockStreams.find((s) => s.programId !== null);
    const event = mockStreams.find((s) => s.programId === null);
    expect(withProgram).toBeTruthy();
    expect(event).toBeTruthy();

    const a = await getStreamById(withProgram!.id, opts);
    const b = await getStreamById(event!.id, opts);
    expect(a?.programId).toBeTruthy();
    expect(b?.programId).toBeNull();
    expect(b?.channelId).toBeTruthy();
  });

  it("episode navigation and related", async () => {
    const ep = mockEpisodes.find((e) => e.status === "published")!;
    const full = await getEpisodeById(ep.id, opts);
    expect(full?.id).toBe(ep.id);

    const next = await getNextEpisode(ep.id, opts);
    const prev = await getPreviousEpisode(ep.id, opts);
    const related = await getRelatedEpisodes(ep.id, opts);
    expect(related.every((r) => r.programId === ep.programId)).toBe(true);
    if (next) expect(next.programId).toBe(ep.programId);
    if (prev) expect(prev.programId).toBe(ep.programId);
  });

  it("getVideoById adapts to episode for compatibility", async () => {
    const ep = mockEpisodes[0]!;
    const video = await getVideoById(ep.id, opts);
    expect(video?.id).toBe(ep.id);
    expect(video?.programId).toBe(ep.programId);
  });

  it("seed programs belong to canonical channels", () => {
    const channelIds = new Set(
      mockPrograms.map((p) => p.channelId),
    );
    expect(channelIds.size).toBe(4);
  });
});
