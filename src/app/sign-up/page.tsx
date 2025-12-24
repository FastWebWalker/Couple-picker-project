"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signUpWithEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      toast({
        title: "Перевірте email",
        description: "Ми надіслали лист для підтвердження.",
      });
    } catch (error) {
      toast({
        title: "Помилка реєстрації",
        description: error instanceof Error ? error.message : "Спробуйте ще раз.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(164,210,255,0.35),_transparent_55%)] px-4 py-16">
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Date Roulette
          </p>
          <h1 className="text-4xl font-semibold leading-tight">
            Створи власні рулетки та грай разом
          </h1>
          <p className="text-muted-foreground">
            Реєстрація займе хвилину. Додавай опції, обертай колесо й зберігай
            свої найкращі комбінації.
          </p>
        </div>
        <div className="glass rounded-3xl p-8">
          <div className="space-y-4">
            <form className="space-y-3" onSubmit={signUpWithEmail}>
              <Input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Пароль (мін. 6 символів)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Реєструємо..." : "Зареєструватися"}
              </Button>
            </form>
            <p className="text-sm text-muted-foreground">
              Вже є акаунт?{" "}
              <Link href="/sign-in" className="font-semibold text-primary">
                Увійти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
