import type { ReactNode } from "react";

export function SectionHeader({
  action,
  eyebrow,
  subtitle,
  title,
}: Readonly<{
  action?: ReactNode;
  eyebrow?: string;
  subtitle?: string;
  title: string;
}>) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        {eyebrow ? (
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            {eyebrow}
          </div>
        ) : null}
        <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
        {subtitle ? (
          <p className="mt-1 text-xs leading-5 text-zinc-500">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
