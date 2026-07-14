import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";
import type { HypeliveSupabaseClient } from "@hypelive/database";
import { getPublicEnv, isDemoMode } from "@/lib/env";

export function createClient(): HypeliveSupabaseClient | null {
  if (isDemoMode()) return null;
  const { supabaseUrl, supabaseAnonKey } = getPublicEnv();
  return createSupabaseBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
  ) as unknown as HypeliveSupabaseClient;
}

export function hasSupabaseBrowser(): boolean {
  return !isDemoMode();
}
