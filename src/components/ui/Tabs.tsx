import { cn } from "./utils";

export function Tabs<T extends string>({
  activeTab,
  className,
  onChange,
  tabs,
}: Readonly<{
  activeTab: T;
  className?: string;
  onChange: (tab: T) => void;
  tabs: readonly T[];
}>) {
  return (
    <div
      className={cn(
        "grid gap-1 rounded-2xl border border-white/10 bg-black/25 p-1",
        className,
      )}
      style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
    >
      {tabs.map((tab) => (
        <button
          className={cn(
            "rounded-xl px-1.5 py-2 text-[11px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/50",
            activeTab === tab
              ? "bg-sky-400 text-zinc-950 shadow-lg shadow-sky-950/30"
              : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300",
          )}
          key={tab}
          onClick={() => onChange(tab)}
          type="button"
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
