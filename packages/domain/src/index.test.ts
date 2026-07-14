import { describe, expect, it } from "vitest";
import {
  canChat,
  canWatchEpisode,
  formatDuration,
  formatViewerCount,
  isLive,
  isPublishedEpisode,
  isStreamActive,
  validateChatContent,
  BRAND_NAME,
  APP_NAME,
  BRAND_SLUG,
  EMPTY_STATE,
  getStreamStatusLabel,
} from "./index";

describe("stream helpers", () => {
  it("detects live status", () => {
    expect(isLive("live")).toBe(true);
    expect(isLive("ended")).toBe(false);
    expect(isLive("starting")).toBe(false);
  });

  it("allows chat while live or starting", () => {
    expect(canChat("live")).toBe(true);
    expect(canChat("starting")).toBe(true);
    expect(canChat("scheduled")).toBe(false);
    expect(canChat("processing")).toBe(false);
  });

  it("treats scheduled, starting and live as active", () => {
    expect(isStreamActive("scheduled")).toBe(true);
    expect(isStreamActive("starting")).toBe(true);
    expect(isStreamActive("live")).toBe(true);
    expect(isStreamActive("failed")).toBe(false);
  });

  it("labels all stream statuses", () => {
    expect(getStreamStatusLabel("starting")).toBe("Iniciando");
    expect(getStreamStatusLabel("processing")).toBe("Procesando");
    expect(getStreamStatusLabel("failed")).toBe("Fallido");
  });
});

describe("chat rules", () => {
  it("rejects empty and overly long messages", () => {
    expect(validateChatContent("   ").ok).toBe(false);
    expect(validateChatContent("a".repeat(501)).ok).toBe(false);
  });

  it("accepts normal messages", () => {
    const result = validateChatContent("  Hola HYPE  ");
    expect(result.ok).toBe(true);
    expect(result.sanitized).toBe("Hola HYPE");
  });
});

describe("formatters", () => {
  it("formats viewer counts", () => {
    expect(formatViewerCount(42)).toBe("42");
    expect(formatViewerCount(1500)).toBe("1.5 K");
    expect(formatViewerCount(2_000_000)).toBe("2 M");
  });

  it("formats durations", () => {
    expect(formatDuration(65)).toBe("1:05");
    expect(formatDuration(3661)).toBe("1:01:01");
  });
});

describe("branding", () => {
  it("exposes HYPE LIVE constants", () => {
    expect(APP_NAME).toBe("HYPE LIVE");
    expect(BRAND_NAME).toBe("HYPE LIVE");
    expect(BRAND_SLUG).toBe("hype-live");
  });
});

describe("episode helpers", () => {
  it("detects published and watchable episodes", () => {
    expect(isPublishedEpisode("published")).toBe(true);
    expect(isPublishedEpisode("draft")).toBe(false);
    expect(
      canWatchEpisode({ status: "published", playbackId: "pb_1" }),
    ).toBe(true);
    expect(
      canWatchEpisode({ status: "published", playbackId: null }),
    ).toBe(false);
  });

  it("exposes empty-state copy", () => {
    expect(EMPTY_STATE.noLiveStreams).toContain("vivo");
    expect(EMPTY_STATE.programNoEpisodes).toContain("episodios");
  });
});
