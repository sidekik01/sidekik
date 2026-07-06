import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { Card } from "./Card";
import { cn } from "./utils";

export function EmptyState({
  action,
  children,
  className,
  title,
}: Readonly<{
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  title: string;
}>) {
  return (
    <Card className={cn("p-6 text-sm leading-6 text-zinc-400", className)}>
      <div className="mb-4 grid size-10 place-items-center rounded-2xl border border-sky-300/15 bg-sky-300/10 text-sky-100">
        <Sparkles className="size-4" />
      </div>
      <div className="text-sm font-black text-zinc-100">{title}</div>
      <div className="mt-2 text-zinc-500">{children}</div>
      {action ? <div className="mt-4">{action}</div> : null}
    </Card>
  );
}
