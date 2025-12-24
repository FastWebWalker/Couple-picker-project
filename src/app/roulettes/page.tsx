import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ensureDbUser, getSupabaseUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function RoulettesPage() {
  const user = await getSupabaseUser();
  const dbUser = user ? await ensureDbUser() : null;

  const [prebuiltResult, customResult] = await Promise.all([
    supabaseAdmin
      .from("roulettes")
      .select("id,title,description,icon,is_prebuilt, options(id)")
      .eq("is_prebuilt", true)
      .order("created_at", { ascending: true }),
    dbUser
      ? supabaseAdmin
          .from("roulettes")
          .select("id,title,description,icon,is_prebuilt, options(id)")
          .eq("owner_id", dbUser.id)
          .eq("is_prebuilt", false)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
  ]);

  const prebuilt = prebuiltResult.data ?? [];
  const custom = customResult.data ?? [];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Каталог рулеток</h1>
          <p className="text-muted-foreground">
            Готові модулі та ваші власні експерименти.
          </p>
        </div>
        <Button asChild>
          <Link href="/create">Створити рулетку</Link>
        </Button>
      </div>

      <section className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold">Готові рулетки</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {prebuilt.map((roulette) => (
            <Card key={roulette.id} className="glass">
              <CardHeader>
                <CardTitle className="text-lg">
                  {roulette.icon} {roulette.title}
                </CardTitle>
                <CardDescription>{roulette.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{roulette.options?.length ?? 0} опцій</span>
                <Button asChild size="sm">
                  <Link href={`/roulette/${roulette.id}`}>Відкрити</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="text-xl font-semibold">Мої кастомні</h2>
        {custom.length === 0 ? (
          <div className="rounded-3xl border border-dashed p-6 text-sm text-muted-foreground">
            {user
              ? "Поки що немає власних рулеток. Створіть першу."
              : "Увійдіть, щоб створювати власні рулетки."}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {custom.map((roulette) => (
              <Card key={roulette.id} className="glass">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {roulette.icon} {roulette.title}
                  </CardTitle>
                  <CardDescription>{roulette.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{roulette.options?.length ?? 0} опцій</span>
                  <Button asChild size="sm">
                    <Link href={`/roulette/${roulette.id}`}>Відкрити</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
