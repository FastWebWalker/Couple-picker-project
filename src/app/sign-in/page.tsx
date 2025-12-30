"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signInWithEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      window.location.href = "/";
    } catch (error) {
      toast({
        title: "Помилка входу",
        description: error instanceof Error ? error.message : "Спробуйте ще раз.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-[radial-gradient(circle_at_top,_rgba(255,216,164,0.35),_transparent_55%)] px-4 py-16">
      <div className="mx-auto grid w-full max-w-5xl gap-10 md:grid-cols-12 md:items-center">
        <div className="grid gap-6 md:col-span-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Рулетка для двох
          </p>
          <h1 className="text-4xl font-semibold leading-tight">
            Поверни випадковість у побачення
          </h1>
          <p className="text-muted-foreground">
            Увійди, щоб створювати власні рулетки та зберігати історію спінів.
          </p>
        </div>
        <div className="glass grid gap-4 rounded-3xl p-8 md:col-span-6">
          <Button className="w-full" variant="outline" onClick={signInWithGoogle}>
            Увійти через Google
          </Button>
          <div className="text-center text-xs text-muted-foreground">або email + пароль</div>
          <form className="grid gap-3" onSubmit={signInWithEmail}>
            <Input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Входимо..." : "Увійти"}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground">
            Немає акаунта?{" "}
            <Link href="/sign-up" className="font-semibold text-primary">
              Зареєструватися
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
