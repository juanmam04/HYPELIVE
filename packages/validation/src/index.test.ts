import { describe, expect, it } from "vitest";
import {
  chatMessageSchema,
  devicePairingSchema,
  devicePairingStatusSchema,
  episodeCreateSchema,
  goLiveSchema,
  loginSchema,
  programCreateSchema,
  registerSchema,
  streamCreateSchema,
} from "./index";

describe("auth schemas", () => {
  it("accepts valid login", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "secret123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects short password on register", () => {
    const result = registerSchema.safeParse({
      email: "user@example.com",
      password: "short",
      displayName: "Juan",
      username: "juan",
    });
    expect(result.success).toBe(false);
  });
});

describe("chat + stream + pairing", () => {
  it("validates chat message", () => {
    const ok = chatMessageSchema.safeParse({
      streamId: "11111111-1111-1111-1111-111111111111",
      content: "Hola",
    });
    expect(ok.success).toBe(true);
  });

  it("rejects chat over 500 chars", () => {
    const result = chatMessageSchema.safeParse({
      streamId: "11111111-1111-1111-1111-111111111111",
      content: "a".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("validates stream create", () => {
    const ok = streamCreateSchema.safeParse({
      channelId: "11111111-1111-1111-1111-111111111111",
      title: "Sesión en vivo",
      scheduledFor: "2026-07-15T20:00:00.000Z",
    });
    expect(ok.success).toBe(true);
  });

  it("validates device pairing code and status", () => {
    expect(
      devicePairingSchema.safeParse({
        pairingCode: "AB12CD",
        tvDeviceId: "tv-living-room",
        status: "waiting",
      }).success,
    ).toBe(true);
    expect(
      devicePairingSchema.safeParse({ pairingCode: "ab" }).success,
    ).toBe(false);
    expect(devicePairingStatusSchema.safeParse("waiting").success).toBe(true);
    expect(devicePairingStatusSchema.safeParse("pending").success).toBe(false);
  });

  it("validates program and episode create", () => {
    expect(
      programCreateSchema.safeParse({
        channelId: "11111111-1111-1111-1111-111111111111",
        slug: "mesa-abierta",
        title: "Mesa Abierta",
      }).success,
    ).toBe(true);
    expect(
      episodeCreateSchema.safeParse({
        programId: "11111111-1111-1111-1111-111111111111",
        title: "Episodio 3",
        status: "published",
      }).success,
    ).toBe(true);
  });

  it("validates go-live program and special event", () => {
    expect(
      goLiveSchema.safeParse({
        kind: "program",
        channelId: "11111111-1111-1111-1111-111111111111",
        programId: "22222222-2222-2222-2222-222222222222",
        title: "En vivo desde el estudio",
      }).success,
    ).toBe(true);
    expect(
      goLiveSchema.safeParse({
        kind: "special_event",
        channelId: "11111111-1111-1111-1111-111111111111",
        title: "Aniversario del canal",
        description: "Noche especial",
      }).success,
    ).toBe(true);
  });
});
