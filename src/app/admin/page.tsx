import { redirect } from "next/navigation";

import { AdminPanel } from "@/components/admin-panel";
import { ensureDbUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function AdminPage() {
  const dbUser = await ensureDbUser();
  if (!dbUser || dbUser.role !== "admin") {
    redirect("/");
  }

  const { data: prebuilt } = await supabaseAdmin
    .from("roulettes")
    .select("id,title,icon")
    .eq("is_prebuilt", true)
    .order("created_at", { ascending: true });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold">Адмін панель</h1>
        <p className="text-muted-foreground">
          Керуйте готовими рулетками та підтверджуйте пропозиції.
        </p>
      </div>
      <div className="mt-6">
        <AdminPanel prebuilt={prebuilt ?? []} />
      </div>
    </div>
  );
}
