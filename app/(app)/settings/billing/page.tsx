import { AppShell } from "@/src/components/app/AppShell";
import { SectionTitle, SurfaceCard } from "@/src/components/app/AppCards";
import { subscriptionPlans } from "@/src/features/subscription/subscriptionTypes";

export default function BillingSettingsPage() {
  return (
    <AppShell activePath="/settings" eyebrow="Settings" title="Billing">
      <div className="mx-auto max-w-5xl space-y-5">
        <SurfaceCard>
          <SectionTitle>Subscription Plans</SectionTitle>
          <div className="grid gap-3 md:grid-cols-3">
            {subscriptionPlans.map((plan) => (
              <div
                className="rounded-3xl border border-white/8 bg-white/[0.035] p-5"
                key={plan.id}
              >
                <h2 className="text-lg font-black text-white">{plan.name}</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {plan.description}
                </p>
                <div className="mt-5 rounded-2xl border border-white/8 bg-zinc-900/80 px-4 py-3 text-xs font-bold text-zinc-500">
                  Stripe connection coming later
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </AppShell>
  );
}
