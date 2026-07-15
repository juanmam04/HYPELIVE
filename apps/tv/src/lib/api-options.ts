import { hasExpoSupabaseEnv } from "@hypelive/config";

/** Prefer Supabase when Expo public env is configured; otherwise mocks. */
export function apiOptions() {
  return { useMock: !hasExpoSupabaseEnv() };
}
