import { z } from "zod";
import { parseEnv } from "./parse";

/** Treat empty string as undefined for optional env vars. */
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

export const webEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalString,
  NEXT_PUBLIC_SITE_URL: optionalUrl,
  NEXT_PUBLIC_SENTRY_DSN: optionalUrl,
  NEXT_PUBLIC_APP_ENV: z.preprocess(
    emptyToUndefined,
    z.enum(["development", "preview", "production"]).default("development"),
  ),
});

export type WebEnv = z.infer<typeof webEnvSchema>;

/** Soft parse: allows missing Supabase for demo mode. */
export function getWebEnv(
  env: Record<string, string | undefined> = process.env,
): WebEnv {
  return parseEnv(webEnvSchema, env, "@hypelive/config/web");
}

/** Strict: throws if Supabase credentials are missing. */
export function requireWebSupabaseEnv(
  env: Record<string, string | undefined> = process.env,
): WebEnv & {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
} {
  const parsed = getWebEnv(env);
  if (!parsed.NEXT_PUBLIC_SUPABASE_URL || !parsed.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error(
      "[@hypelive/config/web] Missing NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }
  return {
    ...parsed,
    NEXT_PUBLIC_SUPABASE_URL: parsed.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: parsed.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

export function hasWebSupabaseEnv(
  env: Record<string, string | undefined> = process.env,
): boolean {
  const parsed = webEnvSchema.safeParse(env);
  if (!parsed.success) return false;
  const url = parsed.data.NEXT_PUBLIC_SUPABASE_URL;
  const key = parsed.data.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  // Placeholder / CI stubs are not a real backend — keep demo mode.
  if (key === "public-anon-key-for-ci" || key.length < 20) return false;
  return true;
}
