import Link from "next/link";

import { ensureDbUser, getSupabaseUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";

type RouletteItem = {
  title: string;
  href: string;
};

export default async function RoulettesPage() {
  const user = await getSupabaseUser();
  const dbUser = user ? await ensureDbUser() : null;

  type RouletteListItem = Database["public"]["Tables"]["roulettes"]["Row"];

  const [prebuiltResult, customResult] = await Promise.all([
    supabaseAdmin
      .from("roulettes")
      .select("id,title,is_prebuilt")
      .eq("is_prebuilt", true)
      .order("created_at", { ascending: true })
      .returns<RouletteListItem[]>(),
    dbUser
      ? supabaseAdmin
          .from("roulettes")
          .select("id,title,is_prebuilt")
          .eq("owner_id", dbUser.id)
          .eq("is_prebuilt", false)
          .order("created_at", { ascending: false })
          .returns<RouletteListItem[]>()
      : Promise.resolve({ data: [] }),
  ]);

  const prebuilt = prebuiltResult.data ?? [];
  const custom = customResult.data ?? [];

  const items: RouletteItem[] = [...prebuilt, ...custom].map((roulette) => ({
    title: roulette.title,
    href: `/roulette/${roulette.id}`,
  }));

  while (items.length < 6) {
    items.push({
      title: "Порожньо",
      href: `/soon-${items.length + 1}`,
    });
  }

  return (
    <div className="grid h-[calc(100vh-64px)] w-full overflow-hidden">
      <div className="grid h-full grid-rows-2 gap-0 md:grid-cols-3 md:grid-rows-2">
        {items.slice(0, 6).map((item, index) => (
          <Link
            key={`${item.href}-${item.title}`}
            href={item.href}
            className="card-animate card-folder group grid h-full content-center border border-orange-400 bg-white/70 p-6 text-gray-900 shadow-sm transition-all duration-500 ease-out hover:-translate-y-2 hover:bg-orange-50/80 hover:shadow-2xl"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <h2 className="text-lg font-semibold uppercase tracking-[0.25em]">
              {item.title}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
