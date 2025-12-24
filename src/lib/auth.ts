import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type Role = "user" | "admin";

export type DbUser = {
  id: string;
  supabase_id: string;
  role: Role;
  created_at: string;
};

export async function getSupabaseUser() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function ensureDbUser(): Promise<DbUser | null> {
  const user = await getSupabaseUser();
  if (!user) return null;
  const { data: existing, error: existingError } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("supabase_id", user.id)
    .maybeSingle<DbUser>();
  if (existingError) {
    throw existingError;
  }
  if (existing) return existing;

  const { data: created, error: createError } = await supabaseAdmin
    .from("users")
    .insert({ supabase_id: user.id, role: "user" })
    .select("*")
    .single<DbUser>();
  if (createError) {
    throw createError;
  }
  return created;
}

export async function getDbUser(): Promise<DbUser | null> {
  const user = await getSupabaseUser();
  if (!user) return null;
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("supabase_id", user.id)
    .maybeSingle<DbUser>();
  if (error) {
    throw error;
  }
  return data;
}
