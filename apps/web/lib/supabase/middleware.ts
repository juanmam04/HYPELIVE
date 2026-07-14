import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getLoginRedirectPath, isProtectedPath } from "@hypelive/auth";
import { getPublicEnv, isDemoMode } from "@/lib/env";

type CookieToSet = {
  name: string;
  value: string;
  options?: Record<string, unknown>;
};

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  // Without Supabase env, everything is browseable with mocks (including studio).
  if (isDemoMode()) {
    return response;
  }

  const { supabaseUrl, supabaseAnonKey } = getPublicEnv();
  const pathname = request.nextUrl.pathname;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({
          request: { headers: request.headers },
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isProtectedPath(pathname, ["/studio"]) && !user) {
    const url = request.nextUrl.clone();
    const redirect = getLoginRedirectPath(pathname);
    const [path, query] = redirect.split("?");
    url.pathname = path || "/login";
    if (query) {
      const params = new URLSearchParams(query);
      params.forEach((value, key) => url.searchParams.set(key, value));
    }
    return NextResponse.redirect(url);
  }

  return response;
}
