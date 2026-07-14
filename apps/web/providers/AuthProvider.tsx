"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { logger } from "@hypelive/analytics";
import { signIn, signOut, signUp, type AuthSession } from "@hypelive/auth";
import type { Profile } from "@hypelive/types";
import { createClient, hasSupabaseBrowser } from "@/lib/supabase/client";
import { isDemoMode } from "@/lib/env";

type AuthContextValue = {
  user: User | null;
  session: AuthSession | null;
  profile: Profile | null;
  loading: boolean;
  demoMode: boolean;
  configured: boolean;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUpWithPassword: (input: {
    email: string;
    password: string;
    displayName: string;
    username: string;
  }) => Promise<void>;
  signOutUser: () => Promise<void>;
  enterDemoSession: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_PROFILE: Profile = {
  id: "demo-profile",
  username: "demo",
  displayName: "Invitado demo",
  avatarUrl: null,
  role: "viewer",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const demoMode = isDemoMode();
  const configured = hasSupabaseBrowser();

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      if (!configured) {
        if (!cancelled) {
          setLoading(false);
        }
        return;
      }

      const client = createClient();
      if (!client) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await client.auth.getSession();
        if (cancelled) return;
        if (data.session) {
          setSession({
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
            expiresAt: data.session.expires_at ?? null,
            user: data.session.user,
          });
          setUser(data.session.user);
        }
      } catch (error) {
        logger.warn("Auth boot failed", error);
      } finally {
        if (!cancelled) setLoading(false);
      }

      const { data: sub } = client.auth.onAuthStateChange((_event, next) => {
        if (!next) {
          setSession(null);
          setUser(null);
          setProfile(null);
          return;
        }
        setSession({
          accessToken: next.access_token,
          refreshToken: next.refresh_token,
          expiresAt: next.expires_at ?? null,
          user: next.user,
        });
        setUser(next.user);
      });

      return () => sub.subscription.unsubscribe();
    }

    const cleanupPromise = boot();
    return () => {
      cancelled = true;
      void cleanupPromise.then((cleanup) => cleanup?.());
    };
  }, [configured]);

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      const client = createClient();
      if (!client) {
        throw new Error(
          "Supabase no está configurado. Usa el modo demo o agrega las variables de entorno.",
        );
      }
      const next = await signIn(client, { email, password });
      setSession(next);
      setUser(next.user);
    },
    [],
  );

  const signUpWithPassword = useCallback(
    async (input: {
      email: string;
      password: string;
      displayName: string;
      username: string;
    }) => {
      const client = createClient();
      if (!client) {
        throw new Error(
          "Supabase no está configurado. Usa el modo demo o agrega las variables de entorno.",
        );
      }
      const result = await signUp(client, input);
      setProfile(result.profile as Profile);
      if (result.session) {
        setSession(result.session);
        setUser(result.session.user);
      }
    },
    [],
  );

  const signOutUser = useCallback(async () => {
    const client = createClient();
    if (client) {
      await signOut(client);
    }
    setSession(null);
    setUser(null);
    setProfile(null);
  }, []);

  const enterDemoSession = useCallback(() => {
    setProfile(DEMO_PROFILE as Profile);
    setUser({ id: "demo-user", email: "demo@hypelive.local" } as User);
    logger.info("Entered demo session");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      profile: profile ?? (user ? (DEMO_PROFILE as Profile) : null),
      loading,
      demoMode,
      configured,
      signInWithPassword,
      signUpWithPassword,
      signOutUser,
      enterDemoSession,
    }),
    [
      user,
      session,
      profile,
      loading,
      demoMode,
      configured,
      signInWithPassword,
      signUpWithPassword,
      signOutUser,
      enterDemoSession,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
