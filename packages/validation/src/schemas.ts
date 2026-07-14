import { z } from "zod";

export const devicePairingStatusSchema = z.enum([
  "waiting",
  "paired",
  "expired",
  "cancelled",
]);

export const episodeStatusSchema = z.enum([
  "draft",
  "processing",
  "published",
  "unavailable",
  "archived",
]);

export const chatMessageSchema = z.object({
  streamId: z.string().uuid(),
  content: z
    .string()
    .trim()
    .min(1, "Mensaje vacío")
    .max(500, "Máximo 500 caracteres"),
});

export const profileUpdateSchema = z
  .object({
    displayName: z.string().trim().min(2).max(60).nullable().optional(),
    username: z
      .string()
      .trim()
      .min(3)
      .max(30)
      .regex(/^[a-z0-9_]+$/)
      .optional(),
    avatarUrl: z.string().url().nullable().optional(),
  })
  .strict();

export const streamCreateSchema = z.object({
  channelId: z.string().uuid(),
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().max(2000).nullable().optional(),
  programId: z.string().uuid().nullable().optional(),
  scheduledFor: z.string().datetime().nullable().optional(),
  thumbnailUrl: z.string().url().nullable().optional(),
});

export const programCreateSchema = z.object({
  channelId: z.string().uuid(),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido"),
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(2000).nullable().optional(),
  artworkUrl: z.string().url().nullable().optional(),
  bannerUrl: z.string().url().nullable().optional(),
  scheduleDescription: z.string().trim().max(200).nullable().optional(),
  isActive: z.boolean().optional(),
});

export const episodeCreateSchema = z.object({
  programId: z.string().uuid(),
  seasonId: z.string().uuid().nullable().optional(),
  sourceStreamId: z.string().uuid().nullable().optional(),
  sourceRecordingId: z.string().uuid().nullable().optional(),
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().max(4000).nullable().optional(),
  episodeNumber: z.number().int().positive().nullable().optional(),
  airedAt: z.string().datetime().nullable().optional(),
  durationSeconds: z.number().int().nonnegative().nullable().optional(),
  thumbnailUrl: z.string().url().nullable().optional(),
  playbackId: z.string().trim().min(1).nullable().optional(),
  status: episodeStatusSchema.optional(),
  publishedAt: z.string().datetime().nullable().optional(),
});

export const goLiveSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("program"),
    channelId: z.string().uuid(),
    programId: z.string().uuid(),
    title: z.string().trim().min(3).max(120),
    description: z.string().trim().max(2000).nullable().optional(),
    scheduledFor: z.string().datetime().nullable().optional(),
    thumbnailUrl: z.string().url().nullable().optional(),
  }),
  z.object({
    kind: z.literal("special_event"),
    channelId: z.string().uuid(),
    programId: z.null().optional(),
    title: z.string().trim().min(3).max(120),
    description: z.string().trim().max(2000).nullable().optional(),
    scheduledFor: z.string().datetime().nullable().optional(),
    thumbnailUrl: z.string().url().nullable().optional(),
  }),
]);

export const devicePairingSchema = z.object({
  pairingCode: z
    .string()
    .trim()
    .length(6, "El código debe tener 6 caracteres")
    .regex(/^[A-Z0-9]+$/, "Código inválido"),
  tvDeviceId: z.string().trim().min(1).max(120),
  status: devicePairingStatusSchema.optional(),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type StreamCreateInput = z.infer<typeof streamCreateSchema>;
export type ProgramCreateInput = z.infer<typeof programCreateSchema>;
export type EpisodeCreateInput = z.infer<typeof episodeCreateSchema>;
export type GoLiveInput = z.infer<typeof goLiveSchema>;
export type DevicePairingInput = z.infer<typeof devicePairingSchema>;
export type DevicePairingStatusInput = z.infer<typeof devicePairingStatusSchema>;
export type EpisodeStatusInput = z.infer<typeof episodeStatusSchema>;
