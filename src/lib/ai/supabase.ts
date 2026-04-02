import "server-only";

import { createClient } from "@supabase/supabase-js";
import { aiEnv } from "./env";

export function getSupabaseAdminClient() {
  return createClient(aiEnv.SUPABASE_URL, aiEnv.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
