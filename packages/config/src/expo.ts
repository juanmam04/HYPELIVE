import { z } from "zod";
import { parseEnv } from "./parse";

const emptyToUndefined = (value: unknown) =>
  value === "" || value === null ? undefined : value;

const optionalUrl = z.preprocess(
  emptyToUndefined,
  z.string().url().optional(),
);

const optionalString = z.preprocess(
  emptyToUndefined,
  z.string().min(1).optional(),
);

export const expoEnvSchema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: optionalUrl,
  EXPO_PUBLIC_SUPABASE_ANON_KEY: optionalString,
  EXPO_PUBLIC_API_URL: optionalUrl,
  EXPO_PUBLIC_SENTRY_DSN: optionalUrl,
  EXPO_PUBLIC_APP_ENV: z.preprocess(
    emptyToUndefined,
    z.enum(["development", "preview", "production"]).default("development"),
  ),
});

export type ExpoEnv = z.infer<typeof expoEnvSchema>;

export function getExpoEnv(
  env: Record<string, string | undefined> = process.env,
): ExpoEnv {
  return parseEnv(expoEnvSchema, env, "@hypelive/config/expo");
}

export function requireExpoSupabaseEnv(
  env: Record<string, string | undefined> = process.env,
): ExpoEnv & {
  EXPO_PUBLIC_SUPABASE_URL: string;
  EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
} {
  const parsed = getExpoEnv(env);
  if (!parsed.EXPO_PUBLIC_SUPABASE_URL || !parsed.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error(
      "[@hypelive/config/expo] Missing EXPO_PUBLIC_SUPABASE_URL and/or EXPO_PUBLIC_SUPABASE_ANON_KEY",
    );
  }
  return {
    ...parsed,
    EXPO_PUBLIC_SUPABASE_URL: parsed.EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_ANON_KEY: parsed.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  };
}

export function hasExpoSupabaseEnv(
  env: Record<string, string | undefined> = process.env,
): boolean {
  const parsed = expoEnvSchema.safeParse(env);
  if (!parsed.success) return false;
  const url = parsed.data.EXPO_PUBLIC_SUPABASE_URL;
  const key = parsed.data.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  // Placeholder / CI stubs are not a real backend — keep demo mode.
  if (key === "public-anon-key-for-ci" || key.length < 20) return false;
  return true;
}
