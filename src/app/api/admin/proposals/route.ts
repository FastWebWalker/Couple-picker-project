import { NextResponse } from "next/server";
import { z } from "zod";

import { getDbUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

const updateSchema = z.object({
  id: z.string().cuid(),
  action: z.enum(["approve", "reject"]),
});

export async function GET() {
  const dbUser = await getDbUser();
  if (!dbUser || dbUser.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: proposals, error } = await supabaseAdmin
    .from("proposals")
    .select("id,label,roulette:roulettes(id,title,icon),created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json(proposals ?? []);
}

export async function PATCH(req: Request) {
  const dbUser = await getDbUser();
  if (!dbUser || dbUser.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { data: proposal, error: proposalError } = await supabaseAdmin
    .from("proposals")
    .select("id,roulette_id,label")
    .eq("id", parsed.data.id)
    .maybeSingle();
  if (proposalError || !proposal) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (parsed.data.action === "approve") {
    const { error: optionError } = await supabaseAdmin.from("options").insert({
      roulette_id: proposal.roulette_id,
      label: proposal.label,
    });
    if (optionError) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
  }

  const { error: updateError } = await supabaseAdmin
    .from("proposals")
    .update({ status: parsed.data.action === "approve" ? "approved" : "rejected" })
    .eq("id", proposal.id);
  if (updateError) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
