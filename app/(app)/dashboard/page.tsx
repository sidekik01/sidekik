import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Clock3,
  FileVideo,
  FolderOpen,
  Sparkles,
  Upload,
} from "lucide-react";
import { AppShell } from "@/src/components/app/AppShell";
import {
  PrimaryLink,
  SectionTitle,
  SurfaceCard,
} from "@/src/components/app/AppCards";
import {
  mockActivity,
  mockExports,
  mockProjects,
  quickActions,
} from "@/src/features/app/mockData";

const actionIcons = [FileVideo, Upload, Brain, FolderOpen];

export default function DashboardPage() {
  const continueProject = mockProjects[0];

  return (
    <AppShell
      activePath="/dashboard"
      eyebrow="Good morning"
      title="Welcome back to Sidekik"
    >
      <div className="mx-auto grid max-w-7xl gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <SurfaceCard className="bg-[linear-gradient(135deg,rgba(56,189,248,0.14),rgba(24,24,27,0.92)_46%,rgba(0,0,0,0.84))]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs font-bold text-sky-100">
                  Continue Editing
                </div>
                <h2 className="mt-5 text-3xl font-black text-white sm:text-4xl">
                  {continueProject.name}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                  Pick up where you left off with transcript edits, creative
                  scoring, captions, and export prep ready in the editor.
                </p>
              </div>
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-400 px-5 py-3 text-sm font-black text-zinc-950 shadow-lg shadow-sky-950/30 transition hover:bg-sky-300"
                href={`/editor/${continueProject.id}`}
              >
                Open Editor
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </SurfaceCard>

          <SurfaceCard>
            <SectionTitle actionHref="/projects" actionLabel="View all">
              Recent Projects
            </SectionTitle>
            {mockProjects.length ? (
              <div className="grid gap-3 md:grid-cols-3">
                {mockProjects.map((project) => (
                <Link
                  className="rounded-3xl border border-white/8 bg-white/[0.035] p-4 transition hover:bg-white/[0.06]"
                  href={`/editor/${project.id}`}
                  key={project.id}
                >
                  <div className="mb-4 aspect-video rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(56,189,248,0.18),rgba(39,39,42,0.9))]" />
                  <div className="truncate text-sm font-black text-white">
                    {project.name}
                  </div>
                  <div className="mt-2 text-xs text-zinc-500">
                    {project.brand} · {project.platform}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="rounded-full bg-emerald-300/10 px-2.5 py-1 text-xs font-bold text-emerald-100">
                      {project.creativeScore}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {project.lastEdited}
                    </span>
                  </div>
                </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-white/8 bg-white/[0.035] p-6 text-sm font-semibold text-zinc-500">
                No projects yet. Create a new project to get started.
              </div>
            )}
          </SurfaceCard>

          <SurfaceCard>
            <SectionTitle>Recent Exports</SectionTitle>
            {mockExports.length ? (
              <div className="grid gap-2">
                {mockExports.map((exportItem) => (
                <div
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-zinc-900/80 px-4 py-3"
                  key={`${exportItem.name}-${exportItem.format}`}
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-zinc-100">
                      {exportItem.name}
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">
                      {exportItem.platform} · {exportItem.format}
                    </div>
                  </div>
                  <span className="rounded-full bg-sky-300/10 px-3 py-1 text-xs font-bold text-sky-100">
                    {exportItem.status}
                  </span>
                </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-white/8 bg-white/[0.035] p-6 text-sm font-semibold text-zinc-500">
                No recent exports yet. Finished renders will appear here.
              </div>
            )}
          </SurfaceCard>
        </div>

        <div className="space-y-5">
          <SurfaceCard>
            <SectionTitle>Quick Actions</SectionTitle>
            <div className="grid gap-2">
              {quickActions.map((action, index) => {
                const Icon = actionIcons[index] ?? Sparkles;
                const href =
                  action === "Manage Brands"
                    ? "/brands"
                    : action === "New Project" || action === "Upload Video"
                      ? "/projects/new"
                      : "/editor/demo-project";

                return (
                  <Link
                    className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.035] px-4 py-3 text-sm font-bold text-zinc-200 transition hover:bg-white/[0.06]"
                    href={href}
                    key={action}
                  >
                    <Icon className="size-4 text-sky-200" />
                    {action}
                  </Link>
                );
              })}
            </div>
          </SurfaceCard>

          <SurfaceCard>
            <SectionTitle>Recent Activity</SectionTitle>
            <div className="space-y-3">
              {mockActivity.map((activity) => (
                <div className="flex gap-3" key={activity}>
                  <div className="mt-1 grid size-7 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04]">
                    <Clock3 className="size-3.5 text-zinc-400" />
                  </div>
                  <p className="text-sm leading-6 text-zinc-400">{activity}</p>
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard>
            <SectionTitle>New Project Flow</SectionTitle>
            <div className="space-y-2">
              {["Choose Brand", "Upload Video", "Open Editor"].map(
                (step, index) => (
                  <div
                    className="flex items-center gap-3 rounded-2xl border border-white/8 bg-zinc-900/80 px-4 py-3"
                    key={step}
                  >
                    <span className="grid size-7 place-items-center rounded-full bg-sky-300 text-xs font-black text-zinc-950">
                      {index + 1}
                    </span>
                    <span className="text-sm font-bold text-zinc-200">
                      {step}
                    </span>
                  </div>
                ),
              )}
            </div>
            <div className="mt-4">
              <PrimaryLink href="/projects/new">New Project</PrimaryLink>
            </div>
          </SurfaceCard>
        </div>
      </div>
    </AppShell>
  );
}
