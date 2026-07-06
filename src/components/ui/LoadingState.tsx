import type { ReactNode } from "react";
import { Card } from "./Card";
import { cn } from "./utils";

export function LoadingState({
  children,
  className,
  title,
}: Readonly<{
  children?: ReactNode;
  className?: string;
  title: string;
}>) {
  return (
    <Card className={cn("p-5 text-sm leading-6 text-sky-100", className)}>
      <div className="flex items-center gap-4">
        <div className="grid size-10 shrink-0 place-items-center rounded-2xl border border-sky-300/15 bg-sky-300/10">
          <span className="size-2.5 animate-pulse rounded-full bg-sky-200 shadow-[0_0_22px_rgba(125,211,252,0.75)]" />
        </div>
        <div>
          <div className="text-sm font-semibold text-sky-50">{title}</div>
          {children ? <div className="mt-1 text-sky-100/75">{children}</div> : null}
        </div>
      </div>
      <div className="mt-5 space-y-2">
        <div className="h-2 w-3/4 animate-pulse rounded-full bg-white/10" />
        <div className="h-2 w-1/2 animate-pulse rounded-full bg-white/[0.06]" />
      </div>
    </Card>
  );
}
