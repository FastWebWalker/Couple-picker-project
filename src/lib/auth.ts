import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type Role = "user" | "admin";

export async function getSupabaseUser() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function ensureDbUser() {
  const user = await getSupabaseUser();
  if (!user) return null;
  const { data: existing, error: existingError } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("supabase_id", user.id)
    .maybeSingle();
  if (existingError) {
    throw existingError;
  }
  if (existing) return existing;

  const { data: created, error: createError } = await supabaseAdmin
    .from("users")
    .insert({ supabase_id: user.id, role: "user" })
    .select("*")
    .single();
  if (createError) {
    throw createError;
  }
  return created;
}

export async function getDbUser() {
  const user = await getSupabaseUser();
  if (!user) return null;
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("supabase_id", user.id)
    .maybeSingle();
  if (error) {
    throw error;
  }
  return data;
}
