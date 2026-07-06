import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "./utils";

export function Card({
  as,
  children,
  className,
  ...props
}: HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  children: ReactNode;
}) {
  const Component = as ?? "div";

  return (
    <Component
      className={cn(
        "rounded-2xl border border-white/8 bg-white/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
