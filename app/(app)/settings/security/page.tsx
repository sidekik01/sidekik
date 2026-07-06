import { AppShell } from "@/src/components/app/AppShell";
import { SectionTitle, SurfaceCard } from "@/src/components/app/AppCards";

export default function SecuritySettingsPage() {
  return (
    <AppShell activePath="/settings" eyebrow="Settings" title="Security">
      <div className="mx-auto max-w-4xl space-y-5">
        <SurfaceCard>
          <SectionTitle>Security</SectionTitle>
          <p className="text-sm leading-6 text-zinc-400">
            Password, session, and authentication provider controls will live
            here once Supabase auth is fully connected.
          </p>
        </SurfaceCard>
      </div>
    </AppShell>
  );
}
