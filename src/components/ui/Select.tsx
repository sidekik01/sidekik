import type { SelectHTMLAttributes } from "react";
import { cn } from "./utils";

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-xl border border-white/8 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-sky-300/45 focus:ring-2 focus:ring-sky-300/15 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
