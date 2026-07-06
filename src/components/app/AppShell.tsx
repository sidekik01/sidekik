import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  FolderKanban,
  Home,
  LayoutTemplate,
  Palette,
  Settings,
  UserCircle,
} from "lucide-react";
import { mockWorkspace } from "@/src/features/app/mockData";
import { cn } from "@/src/components/ui/utils";

const navigationItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/projects", icon: FolderKanban, label: "Projects" },
  { href: "/brands", icon: Palette, label: "Brands" },
  { href: "#", icon: LayoutTemplate, label: "Templates", meta: "Coming Soon" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function AppShell({
  activePath,
  children,
  eyebrow,
  title,
}: Readonly<{
  activePath: string;
  children: React.ReactNode;
  eyebrow?: string;
  title: string;
}>) {
  return (
    <main className="min-h-screen bg-[#090a0d] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(56,189,248,0.14),transparent_28%),radial-gradient(circle_at_86%_16%,rgba(168,85,247,0.1),transparent_30%),linear-gradient(145deg,rgba(255,255,255,0.05),transparent_35%)]" />

      <div className="relative flex min-h-screen">
        <aside className="hidden w-[260px] shrink-0 border-r border-white/10 bg-zinc-950/75 p-4 shadow-2xl shadow-black/25 backdrop-blur-xl lg:flex lg:flex-col">
          <Link className="flex h-12 items-center px-2" href="/dashboard">
            <Image
              alt="sidekik"
              className="h-9 w-auto"
              height={40}
              priority
              src="/images/sidekik-logo-white.png"
              width={146}
            />
          </Link>

          <nav className="mt-8 grid gap-1">
            {navigationItems.map(({ href, icon: Icon, label, meta }) => {
              const isActive = activePath === href;

              return (
                <Link
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font-semibold transition",
                    isActive
                      ? "bg-sky-400 text-zinc-950 shadow-lg shadow-sky-950/30"
                      : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-100",
                  )}
                  href={href}
                  key={label}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{label}</span>
                  {meta ? (
                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-zinc-500">
                      {meta}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-3xl border border-white/10 bg-white/[0.035] p-4">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Current Workspace
            </div>
            <div className="mt-2 text-sm font-bold text-zinc-100">
              {mockWorkspace.name}
            </div>
            <div className="mt-1 text-xs text-zinc-500">{mockWorkspace.plan}</div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex min-h-16 items-center justify-between border-b border-white/10 bg-zinc-950/70 px-5 backdrop-blur-xl sm:px-8">
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                {eyebrow ?? "Good morning"}
              </div>
              <h1 className="mt-1 truncate text-xl font-black text-white sm:text-2xl">
                {title}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-2 text-right md:block">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Workspace
                </div>
                <div className="text-xs font-bold text-zinc-200">
                  {mockWorkspace.name}
                </div>
              </div>
              <button
                aria-label="Notifications"
                className="grid size-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-400 transition hover:bg-white/[0.08] hover:text-zinc-100"
                type="button"
              >
                <Bell className="size-4" />
              </button>
              <button
                aria-label="Profile menu"
                className="grid size-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-300 transition hover:bg-white/[0.08] hover:text-zinc-100"
                type="button"
              >
                <UserCircle className="size-5" />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-5 sm:p-8">{children}</div>
        </div>
      </div>
    </main>
  );
}
