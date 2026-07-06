import type { ReactNode } from "react";
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
    <Card className={cn("p-5 text-sm leading-6 text-zinc-400", className)}>
      <div className="text-sm font-semibold text-zinc-100">{title}</div>
      <div className="mt-2">{children}</div>
      {action ? <div className="mt-4">{action}</div> : null}
    </Card>
  );
}
