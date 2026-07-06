"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/src/features/auth/authProvider";

export function AuthForm({
  mode,
}: Readonly<{
  mode: "login" | "signup";
}>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { error, isLocalMode, signInWithEmail, signUpWithEmail, status } =
    useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const isLoading = status === "loading";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError("Email and password are required.");
      return;
    }

    if (mode === "login") {
      await signInWithEmail(email, password);
    } else {
      await signUpWithEmail(email, password);
    }

    router.push(searchParams.get("next") ?? "/dashboard");
  }

  return (
    <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
      <input
        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-zinc-600 focus:border-sky-300/50"
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email"
        type="email"
        value={email}
      />
      <input
        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-zinc-600 focus:border-sky-300/50"
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
        type="password"
        value={password}
      />
      <button
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-400 px-5 py-3 text-sm font-black text-zinc-950 shadow-lg shadow-sky-950/30 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isLoading}
        type="submit"
      >
        {isLoading ? <Loader2 className="size-4 animate-spin" /> : null}
        {mode === "login" ? "Continue" : "Start Free"}
      </button>

      {localError || error ? (
        <div className="rounded-2xl border border-rose-300/15 bg-rose-300/10 px-4 py-3 text-xs leading-5 text-rose-100">
          {localError ?? error}
        </div>
      ) : null}

      {isLocalMode ? (
        <div className="rounded-2xl border border-sky-300/15 bg-sky-300/10 px-4 py-3 text-xs leading-5 text-sky-100">
          Supabase credentials will activate protected SaaS auth. Without them,
          Sidekik stays in local demo mode.
        </div>
      ) : null}
    </form>
  );
}
