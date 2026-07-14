import {
  getProfileForUser,
  getSession,
  signIn as authSignIn,
  signOut as authSignOut,
  signUp as authSignUp,
  type AuthSession,
} from "@hypelive/auth";
import type { Profile } from "@hypelive/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getSupabase, hasSupabase } from "../lib/supabase";

type AuthContextValue = {
  session: AuthSession | null;
  profile: Profile | null;
  loading: boolean;
  isDemo: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: {
    email: string;
    password: string;
    displayName: string;
    username: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  enterDemo: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_PROFILE: Profile = {
  id: "demo-profile",
  username: "demo",
  displayName: "Demo",
  avatarUrl: null,
  role: "viewer",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function restore() {
      try {
        const client = getSupabase();
        if (!client) {
          if (!cancelled) {
            setIsDemo(true);
            setLoading(false);
          }
          return;
        }

        const restored = await getSession(client);
        if (cancelled) return;
        setSession(restored);
        if (restored?.user) {
          const p = await getProfileForUser(client, restored.user.id);
          if (!cancelled) setProfile(p);
        }
      } catch {
        if (!cancelled) {
          setSession(null);
          setProfile(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void restore();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const client = getSupabase();
    if (!client) {
      setIsDemo(true);
      setProfile(DEMO_PROFILE);
      setSession(null);
      return;
    }
    const next = await authSignIn(client, { email, password });
    setSession(next);
    setIsDemo(false);
    const p = await getProfileForUser(client, next.user.id);
    setProfile(p);
  }, []);

  const signUp = useCallback(
    async (input: {
      email: string;
      password: string;
      displayName: string;
      username: string;
    }) => {
      const client = getSupabase();
      if (!client) {
        setIsDemo(true);
        setProfile({
          ...DEMO_PROFILE,
          displayName: input.displayName,
          username: input.username,
        } as Profile);
        return;
      }
      const result = await authSignUp(client, input);
      setSession(result.session);
      setProfile(result.profile as Profile);
      setIsDemo(false);
    },
    [],
  );

  const signOut = useCallback(async () => {
    const client = getSupabase();
    if (client) await authSignOut(client);
    setSession(null);
    setProfile(null);
    setIsDemo(!hasSupabase());
  }, []);

  const enterDemo = useCallback(() => {
    setIsDemo(true);
    setProfile(DEMO_PROFILE);
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      profile,
      loading,
      isDemo: isDemo || (!hasSupabase() && !session),
      signIn,
      signUp,
      signOut,
      enterDemo,
    }),
    [session, profile, loading, isDemo, signIn, signUp, signOut, enterDemo],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
