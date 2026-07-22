import type { Session, User } from "@supabase/supabase-js";
import {
  profileToDomain,
  type HypeliveSupabaseClient,
} from "@hypelive/database";
import type { Profile } from "@hypelive/types";
import { AppError } from "./errors";

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number | null;
  user: User;
}

export function toAuthSession(session: Session): AuthSession {
  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    expiresAt: session.expires_at ?? null,
    user: session.user,
  };
}

export async function getSession(
  client: HypeliveSupabaseClient,
): Promise<AuthSession | null> {
  const { data, error } = await client.auth.getSession();
  if (error) {
    throw new AppError("unavailable", error.message, { cause: error });
  }
  return data.session ? toAuthSession(data.session) : null;
}

export async function getUser(
  client: HypeliveSupabaseClient,
): Promise<User | null> {
  const { data, error } = await client.auth.getUser();
  if (error) {
    throw new AppError("unauthorized", error.message, { cause: error });
  }
  return data.user;
}

export async function getProfileForUser(
  client: HypeliveSupabaseClient,
  userId: string,
): Promise<Profile | null> {
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new AppError("unavailable", error.message, { cause: error });
  }
  return data ? profileToDomain(data) : null;
}

export async function signIn(
  client: HypeliveSupabaseClient,
  input: { email: string; password: string },
): Promise<AuthSession> {
  const { data, error } = await client.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error || !data.session) {
    throw new AppError("unauthorized", error?.message ?? "Sign in failed", {
      cause: error,
    });
  }

  return toAuthSession(data.session);
}

export async function signUp(
  client: HypeliveSupabaseClient,
  input: {
    email: string;
    password: string;
    displayName: string;
    username: string;
  },
): Promise<{
  session: AuthSession | null;
  user: User;
  profile: Profile | null;
  needsEmailConfirmation: boolean;
}> {
  const { data, error } = await client.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        display_name: input.displayName,
        username: input.username,
      },
    },
  });

  if (error || !data.user) {
    throw new AppError(
      "validation",
      mapAuthError(error?.message ?? "No se pudo crear la cuenta"),
      { cause: error },
    );
  }

  // Trigger creates the profile; give it a moment, then read (or insert own row).
  let profile =
    (await getProfileForUser(client, data.user.id).catch(() => null)) ?? null;

  if (!profile && data.session) {
    profile = await ensureProfile(client, {
      userId: data.user.id,
      displayName: input.displayName,
      username: input.username,
    }).catch(() => null);
  }

  if (!profile) {
    // Retry once — trigger can lag slightly behind signup response.
    await new Promise((r) => setTimeout(r, 400));
    profile = await getProfileForUser(client, data.user.id).catch(() => null);
  }

  return {
    session: data.session ? toAuthSession(data.session) : null,
    user: data.user,
    profile,
    needsEmailConfirmation: !data.session,
  };
}

function mapAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("rate limit") || m.includes("over_email")) {
    return "Demasiados intentos. Esperá un minuto o desactivá “Confirm email” en Supabase Auth.";
  }
  if (m.includes("already registered") || m.includes("already been registered")) {
    return "Ese email ya está registrado. Probá iniciar sesión.";
  }
  if (m.includes("email address") && m.includes("invalid")) {
    return "Email inválido. Usá un correo real (ej. Gmail).";
  }
  if (m.includes("password")) {
    return "La contraseña no cumple los requisitos de seguridad.";
  }
  if (m.includes("signup is disabled")) {
    return "El registro está deshabilitado en el proyecto Supabase.";
  }
  return message;
}

export async function signOut(client: HypeliveSupabaseClient): Promise<void> {
  const { error } = await client.auth.signOut();
  if (error) {
    throw new AppError("unavailable", error.message, { cause: error });
  }
}

export async function ensureProfile(
  client: HypeliveSupabaseClient,
  input: { userId: string; displayName: string; username: string },
): Promise<Profile> {
  const existing = await getProfileForUser(client, input.userId);
  if (existing) return existing;

  const now = new Date().toISOString();
  const { data, error } = await client
    .from("profiles")
    .insert({
      id: input.userId,
      display_name: input.displayName,
      username: input.username,
      avatar_url: null,
      role: "viewer",
      created_at: now,
      updated_at: now,
    })
    .select("*")
    .single();

  if (error || !data) {
    // Race with trigger: profile may already exist.
    const again = await getProfileForUser(client, input.userId);
    if (again) return again;
    throw new AppError(
      "conflict",
      error?.message ?? "No se pudo crear el perfil",
      { cause: error },
    );
  }

  return profileToDomain(data);
}
