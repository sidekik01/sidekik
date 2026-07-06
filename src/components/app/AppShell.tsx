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
  { icon: LayoutTemplate, label: "Templates", meta: "Coming Soon" },
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
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(56,189,248,0.12),transparent_28%),radial-gradient(circle_at_86%_16%,rgba(168,85,247,0.08),transparent_30%),linear-gradient(145deg,rgba(255,255,255,0.045),transparent_35%)]" />

      <div className="relative flex min-h-screen">
        <aside className="hidden w-[268px] shrink-0 border-r border-white/10 bg-zinc-950/78 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl lg:flex lg:flex-col">
          <Link
            aria-label="Go to dashboard"
            className="flex h-12 cursor-pointer items-center rounded-lg px-2 transition duration-150 hover:scale-[1.01] hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
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

          <nav className="mt-9 grid gap-1.5">
            {navigationItems.map(({ href, icon: Icon, label, meta }) => {
              const isActive = activePath === href;
              const itemClassName = cn(
                "group relative flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font-semibold transition duration-200",
                isActive
                  ? "bg-white/[0.08] text-zinc-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_10px_30px_rgba(0,0,0,0.2)]"
                  : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-100 hover:translate-x-0.5",
                !href && "cursor-not-allowed opacity-70 hover:bg-transparent",
              );

              return href ? (
                <Link
                  className={itemClassName}
                  href={href}
                  key={label}
                >
                  {isActive ? (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-sky-300 shadow-[0_0_18px_rgba(125,211,252,0.55)]" />
                  ) : null}
                  <Icon className="size-4 shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{label}</span>
                  {meta ? (
                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-zinc-500">
                      {meta}
                    </span>
                  ) : null}
                </Link>
              ) : (
                <div className={itemClassName} key={label}>
                  <Icon className="size-4 shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{label}</span>
                  {meta ? (
                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-zinc-500">
                      {meta}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </nav>

          <div className="mt-auto rounded-[26px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] p-4 shadow-xl shadow-black/20">
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
          <header className="flex min-h-16 items-center justify-between border-b border-white/10 bg-zinc-950/72 px-5 backdrop-blur-xl sm:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                aria-label="Go to dashboard"
                className="flex h-10 shrink-0 cursor-pointer items-center rounded-lg transition duration-150 hover:scale-[1.01] hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 lg:hidden"
                href="/dashboard"
              >
                <Image
                  alt="sidekik"
                  className="h-8 w-auto"
                  height={36}
                  priority
                  src="/images/sidekik-logo-white.png"
                  width={132}
                />
              </Link>
              <div className="min-w-0">
                <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  {eyebrow ?? "Good morning"}
                </div>
                <h1 className="mt-1 truncate text-xl font-black text-white sm:text-2xl">
                  {title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden rounded-full border border-sky-300/15 bg-sky-300/10 px-3 py-1.5 text-xs font-bold text-sky-100 xl:block">
                Sidekik is currently in private beta.
              </div>
              <a
                className="hidden rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-zinc-300 transition hover:bg-white/[0.08] hover:text-zinc-100 sm:inline-flex"
                href="mailto:hello@momentumstudios.us?subject=Sidekik%20Beta%20Feedback"
              >
                Send Feedback
              </a>
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

          <nav className="border-b border-white/10 bg-zinc-950/60 px-4 py-3 backdrop-blur-xl lg:hidden">
            <div className="flex gap-2 overflow-x-auto">
              {navigationItems
                .filter((item) => item.href)
                .map(({ href, icon: Icon, label }) => {
                  const isActive = activePath === href;

                  return (
                    <Link
                      className={cn(
                        "inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold transition duration-200",
                        isActive
                          ? "border-sky-300/30 bg-sky-300/15 text-sky-100 shadow-[0_0_22px_rgba(56,189,248,0.08)]"
                          : "border-white/10 bg-white/[0.035] text-zinc-400 hover:bg-white/[0.07] hover:text-zinc-100",
                      )}
                      href={href as string}
                      key={label}
                    >
                      <Icon className="size-3.5" />
                      {label}
                    </Link>
                  );
                })}
            </div>
          </nav>

          <div className="flex-1 overflow-auto p-5 sm:p-8 lg:p-9">{children}</div>
        </div>
      </div>
    </main>
  );
}
