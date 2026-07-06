import type { ReactNode } from "react";
import { cn } from "./utils";

export function InfoRow({
  className,
  label,
  value,
}: Readonly<{
  className?: string;
  label: string;
  value: ReactNode;
}>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-zinc-900/80 px-3 py-2",
        className,
      )}
    >
      <span className="text-sm font-medium text-zinc-300">{label}</span>
      <span className="text-sm font-semibold text-zinc-100">{value}</span>
    </div>
  );
}
