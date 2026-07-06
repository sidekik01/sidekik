import { Card } from "@/src/components/ui";

export function ControlSection({
  title,
  children,
}: Readonly<{
  title: string;
  children: React.ReactNode;
}>) {
  return (
    <Card as="section" className="p-4">
      <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
      <div className="mt-4">{children}</div>
    </Card>
  );
}
