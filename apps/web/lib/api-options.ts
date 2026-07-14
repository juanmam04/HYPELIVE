import { isDemoMode } from "@/lib/env";

/** Prefer real Supabase when configured; otherwise mock for Phase 0. */
export function apiOptions() {
  return { useMock: isDemoMode() };
}
