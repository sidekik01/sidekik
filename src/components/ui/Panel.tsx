import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "./utils";

export function Panel({
  as,
  children,
  className,
  ...props
}: HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  children: ReactNode;
}) {
  const Component = as ?? "section";

  return (
    <Component
      className={cn(
        "rounded-[28px] border border-white/10 bg-zinc-950/85 shadow-2xl shadow-black/30 backdrop-blur-xl",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
