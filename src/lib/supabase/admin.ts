import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL");
}

const globalForSupabase = globalThis as unknown as {
  supabaseAdmin: SupabaseClient<Database> | undefined;
};

export const supabaseAdmin =
  globalForSupabase.supabaseAdmin ??
  createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForSupabase.supabaseAdmin = supabaseAdmin;
}
