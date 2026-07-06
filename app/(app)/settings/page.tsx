import { AppShell } from "@/src/components/app/AppShell";
import { SectionTitle, SurfaceCard } from "@/src/components/app/AppCards";

const settingsSections = [
  {
    description: "Workspace name, default client, and team preferences.",
    title: "Workspace",
  },
  {
    description: "Default export format, render quality, and platform presets.",
    title: "Export Defaults",
  },
  {
    description: "Notification placeholders for render status and project review.",
    title: "Notifications",
  },
  {
    description: "Profile, billing placeholders, and security preferences.",
    href: "/account",
    title: "Account",
  },
];

export default function SettingsPage() {
  return (
    <AppShell activePath="/settings" eyebrow="Preferences" title="Settings">
      <div className="mx-auto max-w-5xl space-y-5">
        <SurfaceCard>
          <h2 className="text-3xl font-black text-white">
            Keep Sidekik calm and predictable.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            Settings are placeholders for now. Authentication is not implemented
            yet, but this page reserves the structure for workspace and account
            preferences.
          </p>
        </SurfaceCard>

        <SurfaceCard>
          <SectionTitle>Settings Areas</SectionTitle>
          <div className="grid gap-3 md:grid-cols-2">
            {settingsSections.map((section) => (
              <div
                className="rounded-3xl border border-white/8 bg-white/[0.035] p-5"
                key={section.title}
              >
                <h3 className="text-lg font-black text-white">
                  {section.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {section.description}
                </p>
                {"href" in section ? (
                  <a
                    className="mt-5 inline-flex rounded-2xl border border-white/8 bg-zinc-900/80 px-4 py-3 text-xs font-bold text-zinc-200 transition hover:bg-white/[0.06]"
                    href={section.href}
                  >
                    Open
                  </a>
                ) : (
                  <div className="mt-5 rounded-2xl border border-white/8 bg-zinc-900/80 px-4 py-3 text-xs font-bold text-zinc-500">
                    Coming soon
                  </div>
                )}
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </AppShell>
  );
}
