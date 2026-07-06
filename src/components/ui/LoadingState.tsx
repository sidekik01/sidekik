import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
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
      <div className="flex items-center gap-3">
        <Loader2 className="size-4 animate-spin" />
        <div>
          <div className="text-sm font-semibold text-sky-50">{title}</div>
          {children ? <div className="mt-1 text-sky-100/75">{children}</div> : null}
        </div>
      </div>
    </Card>
  );
}
