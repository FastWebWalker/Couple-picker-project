import { NextResponse } from "next/server";
import { rouletteCreateSchema } from "@/lib/validators";
import { ensureDbUser, getSupabaseUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const user = await getSupabaseUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = rouletteCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const dbUser = await ensureDbUser();
  if (!dbUser) {
    return NextResponse.json({ error: "User missing" }, { status: 400 });
  }

  const { data: roulette, error } = await supabaseAdmin
    .from("roulettes")
    .insert({
      title: parsed.data.title,
      description: parsed.data.description,
      icon: parsed.data.icon,
      owner_id: dbUser.id,
      is_prebuilt: false,
    })
    .select("*")
    .single();

  if (error || !roulette) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  const { error: optionsError } = await supabaseAdmin.from("options").insert(
    parsed.data.options.map((label) => ({
      roulette_id: roulette.id,
      label,
    }))
  );

  if (optionsError) {
    return NextResponse.json({ error: "Options error" }, { status: 500 });
  }

  return NextResponse.json(roulette, { status: 201 });
}
