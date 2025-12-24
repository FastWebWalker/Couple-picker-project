"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useSupabaseUser } from "@/hooks/use-supabase-user";

export function Header() {
  const { user, isSignedIn } = useSupabaseUser();
  const [role, setRole] = useState<"user" | "admin">("user");

  useEffect(() => {
    if (!isSignedIn) return;
    fetch("/api/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.role) setRole(data.role);
      })
      .catch(() => null);
  }, [isSignedIn]);

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <span className="text-2xl">🎡</span>
          <span>Date Roulette</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/roulettes">Рулетки</Link>
          <Link href="/create">Створити</Link>
          {role === "admin" && <Link href="/admin">Адмін</Link>}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isSignedIn ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-muted-foreground md:inline">
                {user?.email ?? "Користувач"}
              </span>
              <Button size="sm" variant="outline" onClick={handleSignOut}>
                Вийти
              </Button>
            </div>
          ) : (
            <Button asChild size="sm">
              <Link href="/sign-in">Увійти</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
