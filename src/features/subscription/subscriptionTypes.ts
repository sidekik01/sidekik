export type SubscriptionPlan = "creator" | "studio" | "enterprise";

export type SubscriptionStatus =
  | "none"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled";

export type Subscription = {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
  customerId?: string | null;
};

export type SubscriptionState = {
  current: Subscription | null;
  plan: SubscriptionPlan;
};

export const subscriptionPlans: Array<{
  id: SubscriptionPlan;
  name: string;
  description: string;
}> = [
  {
    description: "For solo creators building a consistent short-form workflow.",
    id: "creator",
    name: "Creator Plan",
  },
  {
    description: "For studios and agencies managing multiple brands.",
    id: "studio",
    name: "Studio Plan",
  },
  {
    description: "For larger teams that need governance and custom workflows.",
    id: "enterprise",
    name: "Enterprise Plan",
  },
];

export const defaultSubscription: Subscription = {
  currentPeriodEnd: null,
  plan: "creator",
  status: "none",
};
