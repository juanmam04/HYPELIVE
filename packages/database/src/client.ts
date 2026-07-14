import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./rows";

export type HypeliveSupabaseClient = SupabaseClient<Database>;

export function createBrowserClient(
  url: string,
  anonKey: string,
): HypeliveSupabaseClient {
  return createClient<Database>(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

/**
 * Server stub helper — pass cookie/header-backed auth options from the app layer.
 * Does not import Next.js; apps wire cookies themselves.
 */
export function createServerClient(
  url: string,
  anonKey: string,
  options?: {
    accessToken?: string | (() => Promise<string | undefined>);
    headers?: Record<string, string>;
  },
): HypeliveSupabaseClient {
  return createClient<Database>(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: options?.headers,
      fetch: async (input, init) => {
        const headers = new Headers(init?.headers);
        if (options?.accessToken) {
          const token =
            typeof options.accessToken === "function"
              ? await options.accessToken()
              : options.accessToken;
          if (token) headers.set("Authorization", `Bearer ${token}`);
        }
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export function createServiceClient(
  url: string,
  serviceRoleKey: string,
): HypeliveSupabaseClient {
  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
