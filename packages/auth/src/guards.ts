import type { HypeliveSupabaseClient } from "@hypelive/database";
import type { Profile, UserRole } from "@hypelive/types";
import { AppError } from "./errors";
import { getProfileForUser, getSession, getUser } from "./session";

export async function requireSession(client: HypeliveSupabaseClient) {
  const session = await getSession(client);
  if (!session) {
    throw new AppError("unauthorized", "Authentication required");
  }
  return session;
}

export async function requireUser(client: HypeliveSupabaseClient) {
  const user = await getUser(client);
  if (!user) {
    throw new AppError("unauthorized", "Authentication required");
  }
  return user;
}

export async function requireProfile(
  client: HypeliveSupabaseClient,
): Promise<Profile> {
  const user = await requireUser(client);
  const profile = await getProfileForUser(client, user.id);
  if (!profile) {
    throw new AppError("not_found", "Profile not found");
  }
  return profile;
}

export function assertRole(
  profile: Profile,
  allowed: UserRole | UserRole[],
): void {
  const roles = Array.isArray(allowed) ? allowed : [allowed];
  if (!roles.includes(profile.role)) {
    throw new AppError("forbidden", "Insufficient permissions");
  }
}

/** Path helpers for protected app routes (web / expo). */
export function isProtectedPath(
  pathname: string,
  protectedPrefixes: string[] = ["/studio", "/settings", "/pair"],
): boolean {
  return protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function getLoginRedirectPath(
  returnTo: string,
  loginPath = "/login",
): string {
  const encoded = encodeURIComponent(returnTo);
  return `${loginPath}?next=${encoded}`;
}
