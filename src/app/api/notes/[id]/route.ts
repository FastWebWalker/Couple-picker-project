import { NextResponse } from "next/server";

import { ensureDbUser, getSupabaseUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const user = await getSupabaseUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await ensureDbUser();
  if (!dbUser) {
    return NextResponse.json({ error: "User missing" }, { status: 400 });
  }

  const { data: note, error: noteError } = await supabaseAdmin
    .from("notes")
    .select("id")
    .eq("id", params.id)
    .maybeSingle();

  if (noteError || !note) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { error: deleteError } = await supabaseAdmin
    .from("notes")
    .delete()
    .eq("id", params.id);

  if (deleteError) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
