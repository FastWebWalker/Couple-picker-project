"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-10 w-10 rounded-full bg-muted" />;
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Перемкнути тему"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? "🌙" : "☀️"}
    </Button>
  );
}
