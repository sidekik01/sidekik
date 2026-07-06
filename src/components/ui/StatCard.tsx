import { Card } from "./Card";

export function StatCard({
  label,
  value,
}: Readonly<{
  label: string;
  value: string | number;
}>) {
  return (
    <Card className="p-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      <div className="mt-1 truncate text-sm font-semibold text-zinc-100">
        {value}
      </div>
    </Card>
  );
}
