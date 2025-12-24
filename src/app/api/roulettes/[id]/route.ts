import { NextResponse } from "next/server";
import { rouletteUpdateSchema } from "@/lib/validators";
import { getSupabaseUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getSupabaseUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: roulette, error: rouletteError } = await supabaseAdmin
    .from("roulettes")
    .select("id,is_prebuilt,owner_id")
    .eq("id", params.id)
    .maybeSingle();
  if (rouletteError || !roulette || roulette.is_prebuilt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: dbUser } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("supabase_id", user.id)
    .maybeSingle();
  if (!dbUser || roulette.owner_id !== dbUser.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = rouletteUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { data: updated, error: updateError } = await supabaseAdmin
    .from("roulettes")
    .update(parsed.data)
    .eq("id", params.id)
    .select("*")
    .single();
  if (updateError || !updated) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const user = await getSupabaseUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: roulette, error: rouletteError } = await supabaseAdmin
    .from("roulettes")
    .select("id,is_prebuilt,owner_id")
    .eq("id", params.id)
    .maybeSingle();
  if (rouletteError || !roulette || roulette.is_prebuilt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: dbUser } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("supabase_id", user.id)
    .maybeSingle();
  if (!dbUser || roulette.owner_id !== dbUser.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error: deleteError } = await supabaseAdmin
    .from("roulettes")
    .delete()
    .eq("id", params.id);
  if (deleteError) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
