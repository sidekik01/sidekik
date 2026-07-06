import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/src/features/auth/AuthForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#090a0d] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_22%_12%,rgba(56,189,248,0.14),transparent_30%),linear-gradient(145deg,rgba(255,255,255,0.05),transparent_34%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-5 py-12">
        <section className="w-full max-w-md rounded-[32px] border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <Link href="/" className="inline-flex">
            <Image
              alt="sidekik"
              className="h-10 w-auto"
              height={40}
              priority
              src="/images/sidekik-logo-white.png"
              width={146}
            />
          </Link>
          <h1 className="mt-8 text-3xl font-black text-white">
            Sign in to Sidekik
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Authentication is ready for Supabase. Local mode remains available
            when Supabase environment variables are not configured.
          </p>

          <Suspense
            fallback={
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-zinc-500">
                Loading sign in...
              </div>
            }
          >
            <AuthForm mode="login" />
          </Suspense>

          <p className="mt-6 text-sm text-zinc-500">
            New here?{" "}
            <Link className="font-bold text-sky-200" href="/signup">
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
