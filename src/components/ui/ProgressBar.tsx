import { cn } from "./utils";

export function ProgressBar({
  className,
  value,
}: Readonly<{
  className?: string;
  value: number;
}>) {
  const safeValue = Math.max(0, Math.min(value, 100));

  return (
    <div className={cn("h-1.5 overflow-hidden rounded-full bg-zinc-800", className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-sky-400 to-violet-400 transition-all duration-500"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
