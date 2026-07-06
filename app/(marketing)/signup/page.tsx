import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/src/features/auth/AuthForm";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[#090a0d] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_78%_10%,rgba(168,85,247,0.12),transparent_28%),linear-gradient(145deg,rgba(255,255,255,0.05),transparent_34%)]" />
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
            Create your Sidekik account
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Prepare your creator workspace for cloud projects, subscriptions,
            and collaboration.
          </p>

          <Suspense
            fallback={
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-zinc-500">
                Loading sign up...
              </div>
            }
          >
            <AuthForm mode="signup" />
          </Suspense>

          <p className="mt-6 text-sm text-zinc-500">
            Already have an account?{" "}
            <Link className="font-bold text-sky-200" href="/login">
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
