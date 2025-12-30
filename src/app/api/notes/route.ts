import { NextResponse } from "next/server";
import { z } from "zod";

import { ensureDbUser, getSupabaseUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";

const noteCreateSchema = z.object({
  title: z.string().min(1).max(80),
  body: z.string().min(3).max(800),
  scheduledFor: z.string().optional(),
});

export async function GET() {
  const user = await getSupabaseUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await ensureDbUser();
  if (!dbUser) {
    return NextResponse.json({ error: "User missing" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("notes")
    .select("id,title,body,scheduled_for,created_at")
    .order("created_at", { ascending: false })
    .returns<Database["public"]["Tables"]["notes"]["Row"][]>();

  if (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  const user = await getSupabaseUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await ensureDbUser();
  if (!dbUser) {
    return NextResponse.json({ error: "User missing" }, { status: 400 });
  }

  const body = await req.json();
  const parsed = noteCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("notes")
    .insert({
      user_id: dbUser.id,
      title: parsed.data.title,
      body: parsed.data.body,
      scheduled_for: parsed.data.scheduledFor || null,
    })
    .select("id,title,body,scheduled_for,created_at")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
