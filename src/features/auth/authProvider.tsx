"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";
import type { UserProfile } from "@/src/features/account/accountTypes";
import {
  defaultSubscription,
  type Subscription,
} from "@/src/features/subscription/subscriptionTypes";
import { getSupabaseBrowserClient } from "@/src/lib/supabase/supabaseClient";

type AuthStatus = "loading" | "anonymous" | "authenticated";

type AuthContextValue = {
  error: string | null;
  isAuthenticated: boolean;
  isLocalMode: boolean;
  profile: UserProfile | null;
  status: AuthStatus;
  subscription: Subscription;
  user: User | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function createProfileFromUser(user: User): UserProfile {
  return {
    avatar:
      typeof user.user_metadata?.avatar_url === "string"
        ? user.user_metadata.avatar_url
        : null,
    company:
      typeof user.user_metadata?.company === "string"
        ? user.user_metadata.company
        : "",
    defaultWorkspace: "Momentum Studio",
    email: user.email ?? "",
    id: user.id,
    name:
      typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name
        : user.email?.split("@")[0] ?? "Sidekik User",
    subscription: defaultSubscription,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [error, setError] = useState<string | null>(null);
  const [isLocalMode, setIsLocalMode] = useState(false);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setIsLocalMode(true);
      setStatus("anonymous");
      return;
    }

    let isMounted = true;

    supabase.auth
      .getUser()
      .then(({ data, error: authError }) => {
        if (!isMounted) {
          return;
        }

        if (authError) {
          setError(authError.message);
        }

        setUser(data.user);
        setStatus(data.user ? "authenticated" : "anonymous");
      })
      .catch((authError: unknown) => {
        if (!isMounted) {
          return;
        }

        setError(
          authError instanceof Error
            ? authError.message
            : "Unable to check authentication.",
        );
        setStatus("anonymous");
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setStatus(session?.user ? "authenticated" : "anonymous");
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      const supabase = getSupabaseBrowserClient();

      if (!supabase) {
        setError("Supabase is not configured. Local mode is active.");
        return;
      }

      setStatus("loading");
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setStatus("anonymous");
        return;
      }

      setError(null);
    },
    [],
  );

  const signUpWithEmail = useCallback(
    async (email: string, password: string) => {
      const supabase = getSupabaseBrowserClient();

      if (!supabase) {
        setError("Supabase is not configured. Local mode is active.");
        return;
      }

      setStatus("loading");
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        setStatus("anonymous");
        return;
      }

      setError(null);
    },
    [],
  );

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setUser(null);
      setStatus("anonymous");
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
    setStatus("anonymous");
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const profile = user ? createProfileFromUser(user) : null;

    return {
      error,
      isAuthenticated: Boolean(user),
      isLocalMode,
      profile,
      signInWithEmail,
      signOut,
      signUpWithEmail,
      status,
      subscription: profile?.subscription ?? defaultSubscription,
      user,
    };
  }, [
    error,
    isLocalMode,
    signInWithEmail,
    signOut,
    signUpWithEmail,
    status,
    user,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

export function ProtectedRoute({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLocalMode, status } = useAuth();

  useEffect(() => {
    if (status === "anonymous" && !isAuthenticated && !isLocalMode) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLocalMode, pathname, router, status]);

  if (status === "loading") {
    return (
      <main className="grid min-h-screen place-items-center bg-[#090a0d] text-zinc-100">
        <div className="rounded-[28px] border border-white/10 bg-zinc-950/80 p-8 text-center shadow-2xl shadow-black/30">
          <Loader2 className="mx-auto size-6 animate-spin text-sky-200" />
          <div className="mt-4 text-sm font-black text-white">
            Opening Sidekik
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            The creative sidekick behind every great video.
          </p>
        </div>
      </main>
    );
  }

  if (status === "anonymous" && !isAuthenticated && !isLocalMode) {
    return null;
  }

  return children;
}
