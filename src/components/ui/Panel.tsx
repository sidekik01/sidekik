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
        "rounded-[30px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.055),rgba(24,24,27,0.88)_34%,rgba(9,10,13,0.94))] shadow-2xl shadow-black/30 backdrop-blur-xl",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
