"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function useSupabaseUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  return { user, loading, isSignedIn: !!user };
}
