import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

export type Json =
  | boolean
  | null
  | number
  | string
  | Json[]
  | { [key: string]: Json | undefined };

export type SidekikDatabase = {
  public: {
    Tables: {
      brand_presets: {
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          owner_id: string;
          settings: Json;
        };
        Row: {
          created_at: string;
          id: string;
          name: string;
          owner_id: string;
          settings: Json;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          owner_id?: string;
          settings?: Json;
        };
      };
      profiles: {
        Insert: {
          avatar?: string | null;
          company?: string | null;
          default_workspace?: string | null;
          email: string;
          id: string;
          name?: string | null;
          timezone?: string | null;
        };
        Row: {
          avatar: string | null;
          company: string | null;
          default_workspace: string | null;
          email: string;
          id: string;
          name: string | null;
          timezone: string | null;
        };
        Update: {
          avatar?: string | null;
          company?: string | null;
          default_workspace?: string | null;
          email?: string;
          id?: string;
          name?: string | null;
          timezone?: string | null;
        };
      };
      projects: {
        Insert: {
          brand_id?: string | null;
          created_at?: string;
          id?: string;
          metadata: Json;
          name: string;
          owner_id: string;
          status: string;
          updated_at?: string;
        };
        Row: {
          brand_id: string | null;
          created_at: string;
          id: string;
          metadata: Json;
          name: string;
          owner_id: string;
          status: string;
          updated_at: string;
        };
        Update: {
          brand_id?: string | null;
          created_at?: string;
          id?: string;
          metadata?: Json;
          name?: string;
          owner_id?: string;
          status?: string;
          updated_at?: string;
        };
      };
      workspaces: {
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          owner_id: string;
          plan: string;
        };
        Row: {
          created_at: string;
          id: string;
          name: string;
          owner_id: string;
          plan: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          owner_id?: string;
          plan?: string;
        };
      };
    };
  };
};

export type SupabaseBrowserClient = SupabaseClient<SidekikDatabase>;

export type SupabaseConfig = {
  anonKey: string | null;
  isConfigured: boolean;
  url: string | null;
};

let browserClient: SupabaseBrowserClient | null = null;

export function getSupabaseConfig(): SupabaseConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? null;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? null;

  return {
    anonKey,
    isConfigured: Boolean(url && anonKey),
    url,
  };
}

export function getSupabaseBrowserClient(): SupabaseBrowserClient | null {
  const config = getSupabaseConfig();

  if (!config.isConfigured || !config.url || !config.anonKey) {
    return null;
  }

  if (!browserClient) {
    browserClient = createClient<SidekikDatabase>(config.url, config.anonKey);
  }

  return browserClient;
}
