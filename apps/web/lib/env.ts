import { hasWebSupabaseEnv } from "@hypelive/config";

export function isDemoMode(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return !hasWebSupabaseEnv(env);
}

export function getPublicEnv() {
  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "",
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "",
    sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN?.trim() || "",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:4748",
    appEnv: process.env.NEXT_PUBLIC_APP_ENV ?? "development",
  };
}
