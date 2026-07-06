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
        "rounded-[28px] border border-white/10 bg-zinc-950/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl",
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
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-sm font-black uppercase tracking-wider text-zinc-400">
        {children}
      </h2>
      {actionHref && actionLabel ? (
        <Link
          className="inline-flex items-center gap-1 text-xs font-bold text-sky-200 transition hover:text-sky-100"
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
      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-400 px-4 py-2 text-sm font-black text-zinc-950 shadow-lg shadow-sky-950/30 transition hover:bg-sky-300"
      href={href}
    >
      <Plus className="size-4" />
      {children}
    </Link>
  );
}
