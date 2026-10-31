import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env.js";

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error(
        "Supabase credentials missing. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set."
      );
    }
    supabaseInstance = createClient(
      env.SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );
  }
  return supabaseInstance;
}
