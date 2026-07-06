import { AppShell } from "@/src/components/app/AppShell";
import { SectionTitle, SurfaceCard } from "@/src/components/app/AppCards";

export default function ProfileSettingsPage() {
  return (
    <AppShell activePath="/settings" eyebrow="Settings" title="Profile">
      <div className="mx-auto max-w-4xl space-y-5">
        <SurfaceCard>
          <SectionTitle>Profile Settings</SectionTitle>
          <p className="text-sm leading-6 text-zinc-400">
            Name, company, avatar, timezone, and default workspace preferences
            will connect to Supabase profiles here.
          </p>
        </SurfaceCard>
      </div>
    </AppShell>
  );
}
