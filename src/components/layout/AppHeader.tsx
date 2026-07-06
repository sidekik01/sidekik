"use client";

import Image from "next/image";
import Link from "next/link";
import { useProject } from "@/src/features/project/ProjectContext";

export function AppHeader() {
  const { selectedWorkspace, selectedWorkspaceClient } = useProject();

  return (
    <nav className="flex h-16 items-center justify-between border-b border-white/10 bg-zinc-950/70 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <Link
          aria-label="Go to dashboard"
          className="flex h-10 shrink-0 cursor-pointer items-center rounded-lg transition duration-150 hover:scale-[1.01] hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          href="/dashboard"
        >
          <Image
            alt="sidekik"
            className="h-9 w-auto"
            height={40}
            priority
            src="/images/sidekik-logo-white.png"
            width={146}
          />
        </Link>
        <div className="min-w-0">
          <p className="text-xs text-zinc-500">
            The creative sidekik behind every great video.
          </p>
        </div>
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <div className="mr-2 rounded-full border border-sky-300/15 bg-sky-300/10 px-3 py-1.5 text-xs font-bold text-sky-100">
          Private beta
        </div>
        <a
          className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.08] hover:text-zinc-100"
          href="mailto:hello@momentumstudios.us?subject=Sidekik%20Beta%20Feedback"
        >
          Send Feedback
        </a>
        <div className="mr-2 rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-2 text-right">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Workspace: {selectedWorkspace.name}
          </p>
          <p className="mt-0.5 text-xs font-semibold text-zinc-200">
            Client: {selectedWorkspaceClient.name}
          </p>
        </div>
        <button className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-zinc-300">
          Preview
        </button>
        <button className="rounded-xl bg-sky-400 px-4 py-2 text-sm font-semibold text-zinc-950 shadow-lg shadow-sky-950/30">
          Export
        </button>
      </div>
    </nav>
  );
}
