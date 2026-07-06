import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./utils";

type BadgeTone = "neutral" | "info" | "success" | "warning" | "danger";

const toneClasses: Record<BadgeTone, string> = {
  danger: "border-red-300/20 bg-red-300/10 text-red-100",
  info: "border-sky-300/20 bg-sky-300/10 text-sky-100",
  neutral: "border-white/10 bg-white/[0.04] text-zinc-400",
  success: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
  warning: "border-amber-300/20 bg-amber-300/10 text-amber-100",
};

export function Badge({
  children,
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: BadgeTone;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
