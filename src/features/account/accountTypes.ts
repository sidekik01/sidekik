import type { Subscription } from "@/src/features/subscription/subscriptionTypes";

export type UserProfile = {
  id: string;
  name: string;
  company: string;
  email: string;
  avatar: string | null;
  timezone: string;
  defaultWorkspace: string;
  subscription: Subscription;
};

export type AccountMode = "anonymous" | "authenticated";

export type AccountState = {
  mode: AccountMode;
  profile: UserProfile | null;
  isLocalMode: boolean;
  isLoading: boolean;
  error: string | null;
};
