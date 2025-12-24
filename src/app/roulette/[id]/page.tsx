import { notFound } from "next/navigation";

import { RouletteClient } from "@/components/roulette-client";
import { ensureDbUser, getSupabaseUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function RoulettePage({ params }: { params: { id: string } }) {
  const { data: roulette, error } = await supabaseAdmin
    .from("roulettes")
    .select("id,title,description,icon,is_prebuilt,owner_id, options(id,label,weight,created_at)")
    .eq("id", params.id)
    .maybeSingle();

  if (error || !roulette) {
    notFound();
  }

  const user = await getSupabaseUser();
  const dbUser = user ? await ensureDbUser() : null;

  const sortedOptions =
    roulette.options?.slice().sort((a, b) => {
      const aTime = new Date(a.created_at).getTime();
      const bTime = new Date(b.created_at).getTime();
      return aTime - bTime;
    }) ?? [];

  const isOwner = !!dbUser && roulette.owner_id === dbUser.id;
  const isAdmin = dbUser?.role === "admin";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <RouletteClient
        roulette={{ ...roulette, options: sortedOptions }}
        isOwner={isOwner}
        isAdmin={!!isAdmin}
      />
    </div>
  );
}
