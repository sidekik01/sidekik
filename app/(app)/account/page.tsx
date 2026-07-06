import { AppShell } from "@/src/components/app/AppShell";
import { SectionTitle, SurfaceCard } from "@/src/components/app/AppCards";

const profileRows = [
  ["Name", "Sidekik User"],
  ["Company", "Momentum Studio"],
  ["Email", "creator@example.com"],
  ["Avatar", "Placeholder"],
  ["Timezone", "America/Los_Angeles"],
  ["Default Workspace", "Momentum Studio"],
  ["Subscription", "Creator Plan"],
];

export default function AccountPage() {
  return (
    <AppShell activePath="/settings" eyebrow="Account" title="Account">
      <div className="mx-auto max-w-5xl space-y-5">
        <SurfaceCard>
          <h2 className="text-3xl font-black text-white">
            Your Sidekik profile
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            This placeholder profile reserves the shape for Supabase user data,
            workspace defaults, and future subscription state.
          </p>
        </SurfaceCard>

        <SurfaceCard>
          <SectionTitle>User Profile Interface</SectionTitle>
          <div className="grid gap-3 md:grid-cols-2">
            {profileRows.map(([label, value]) => (
              <div
                className="rounded-2xl border border-white/8 bg-white/[0.035] p-4"
                key={label}
              >
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  {label}
                </div>
                <div className="mt-2 text-sm font-black text-zinc-100">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </AppShell>
  );
}
