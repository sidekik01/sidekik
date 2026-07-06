import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { AppShell } from "@/src/components/app/AppShell";
import { SectionTitle, SurfaceCard } from "@/src/components/app/AppCards";
import { mockBrands, mockProjects } from "@/src/features/app/mockData";

export default function ProjectsPage() {
  return (
    <AppShell
      activePath="/projects"
      eyebrow="Projects Dashboard"
      title="Projects"
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm leading-6 text-zinc-400">
            Manage every video project from upload through creative review,
            captions, rendering, and export.
          </p>
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-400 px-5 py-3 text-sm font-black text-zinc-950 shadow-lg shadow-sky-950/30 transition duration-200 hover:-translate-y-0.5 hover:bg-sky-300"
            href="/projects/new"
          >
            <Plus className="size-4" />
            New Project
          </Link>
        </div>

        {mockProjects.length ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {mockProjects.map((project) => (
            <SurfaceCard className="p-4 transition duration-200 hover:-translate-y-0.5" key={project.id}>
              <div className="aspect-video rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(56,189,248,0.2),rgba(24,24,27,0.95))]" />
              <div className="mt-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-black text-white">
                    {project.name}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    {project.brand} · {project.platform}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-300/10 px-3 py-1 text-xs font-black text-emerald-100">
                  {project.creativeScore}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
                  <div className="text-zinc-500">Last Edited</div>
                  <div className="mt-1 font-bold text-zinc-200">
                    {project.lastEdited}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
                  <div className="text-zinc-500">Status</div>
                  <div className="mt-1 font-bold text-zinc-200">
                    {project.status}
                  </div>
                </div>
              </div>
              <Link
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-zinc-100 transition duration-200 hover:-translate-y-0.5 hover:bg-white/[0.08]"
                href={`/editor/${project.id}`}
              >
                Open Project
                <ArrowRight className="size-4" />
              </Link>
            </SurfaceCard>
            ))}
          </div>
        ) : (
          <SurfaceCard>
            <div className="text-sm font-semibold text-zinc-500">
              No projects yet. Use New Project to upload your first video.
            </div>
          </SurfaceCard>
        )}

        <SurfaceCard className="scroll-mt-8" id="new-project">
          <SectionTitle>New Project Flow</SectionTitle>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              {
                body: "Pick the brand preset that should guide captions and export defaults.",
                title: "Choose Brand",
                value: mockBrands[0].name,
              },
              {
                body: "Drop in the video file and let Sidekik read the project metadata.",
                title: "Upload Video",
                value: "MP4, MOV, M4V",
              },
              {
                body: "Open the project workspace and begin analysis, captions, and review.",
                title: "Open Editor",
                value: "/editor/new-project",
              },
            ].map((step, index) => (
              <div
                className="rounded-3xl border border-white/8 bg-white/[0.035] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.055]"
                key={step.title}
              >
                <div className="grid size-9 place-items-center rounded-2xl bg-sky-300 text-sm font-black text-zinc-950">
                  {index + 1}
                </div>
                <h3 className="mt-5 text-lg font-black text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {step.body}
                </p>
                <div className="mt-5 rounded-2xl border border-white/8 bg-zinc-900/80 px-3 py-2 text-xs font-bold text-zinc-300">
                  {step.value}
                </div>
              </div>
            ))}
          </div>
          <Link
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-400 px-5 py-3 text-sm font-black text-zinc-950 shadow-lg shadow-sky-950/30 transition duration-200 hover:-translate-y-0.5 hover:bg-sky-300"
            href="/projects/new"
          >
            Start New Project
            <ArrowRight className="size-4" />
          </Link>
        </SurfaceCard>
      </div>
    </AppShell>
  );
}
