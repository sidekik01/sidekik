import Link from "next/link";
import type { HTMLAttributes } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { cn } from "@/src/components/ui/utils";

export function SurfaceCard({
  children,
  className,
  ...props
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}> &
  HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn(
        "rounded-[30px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.055),rgba(24,24,27,0.86)_36%,rgba(9,10,13,0.92))] p-6 shadow-2xl shadow-black/25 backdrop-blur-xl transition duration-200 hover:border-white/15 hover:shadow-[0_22px_70px_rgba(0,0,0,0.36),0_0_34px_rgba(56,189,248,0.045)]",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function SectionTitle({
  actionHref,
  actionLabel,
  children,
}: Readonly<{
  actionHref?: string;
  actionLabel?: string;
  children: string;
}>) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <h2 className="text-sm font-black uppercase tracking-[0.14em] text-zinc-400">
        {children}
      </h2>
      {actionHref && actionLabel ? (
        <Link
          className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold text-sky-200 transition duration-200 hover:bg-sky-300/10 hover:text-sky-100"
          href={actionHref}
        >
          {actionLabel}
          <ArrowRight className="size-3.5" />
        </Link>
      ) : null}
    </div>
  );
}

export function PrimaryLink({
  children,
  href,
}: Readonly<{
  children: React.ReactNode;
  href: string;
}>) {
  return (
    <Link
      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-400 px-4 py-2 text-sm font-black text-zinc-950 shadow-lg shadow-sky-950/30 transition duration-200 hover:-translate-y-0.5 hover:bg-sky-300 hover:shadow-sky-950/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
      href={href}
    >
      <Plus className="size-4" />
      {children}
    </Link>
  );
}
