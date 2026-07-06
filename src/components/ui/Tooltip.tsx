import type { ReactNode } from "react";

export function Tooltip({
  children,
  label,
}: Readonly<{
  children: ReactNode;
  label: string;
}>) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-zinc-950 px-2 py-1 text-[11px] font-medium text-zinc-200 shadow-xl shadow-black/30 group-hover:block">
        {label}
      </span>
    </span>
  );
}
