import { NextResponse } from "next/server";
import { optionCreateSchema } from "@/lib/validators";
import { ensureDbUser, getSupabaseUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getSupabaseUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: roulette, error: rouletteError } = await supabaseAdmin
    .from("roulettes")
    .select("id,is_prebuilt,owner_id")
    .eq("id", params.id)
    .maybeSingle();
  if (rouletteError || !roulette) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = optionCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const dbUser = await ensureDbUser();
  if (!dbUser) {
    return NextResponse.json({ error: "User missing" }, { status: 400 });
  }

  if (roulette.is_prebuilt) {
    if (dbUser.role === "admin") {
      const { data: option, error: optionError } = await supabaseAdmin
        .from("options")
        .insert({
          roulette_id: roulette.id,
          label: parsed.data.label,
          weight: parsed.data.weight ?? null,
        })
        .select("*")
        .single();
      if (optionError || !option) {
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
      return NextResponse.json({ mode: "added", option });
    }

    const { data: proposal, error: proposalError } = await supabaseAdmin
      .from("proposals")
      .insert({
        roulette_id: roulette.id,
        label: parsed.data.label,
        status: "pending",
      })
      .select("*")
      .single();
    if (proposalError || !proposal) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
    return NextResponse.json({ mode: "proposal", proposal });
  }

  if (roulette.owner_id !== dbUser.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: option, error: optionError } = await supabaseAdmin
    .from("options")
    .insert({
      roulette_id: roulette.id,
      label: parsed.data.label,
      weight: parsed.data.weight ?? null,
    })
    .select("*")
    .single();
  if (optionError || !option) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
  return NextResponse.json({ mode: "added", option });
}
