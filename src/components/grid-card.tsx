import Link from "next/link";

import { cn } from "@/lib/utils";

type GridCardProps = {
  title: string;
  description: string;
  icon: string;
  href: string;
  tone?: "warm" | "cool" | "neutral";
};

const toneClasses: Record<NonNullable<GridCardProps["tone"]>, string> = {
  warm: "from-amber-200/70 via-orange-100/40 to-rose-100/30 dark:from-amber-500/20 dark:via-orange-500/10 dark:to-rose-500/10",
  cool: "from-sky-200/70 via-blue-100/40 to-indigo-100/30 dark:from-sky-500/20 dark:via-blue-500/10 dark:to-indigo-500/10",
  neutral: "from-slate-200/70 via-white/60 to-slate-100/40 dark:from-slate-500/20 dark:via-slate-500/10 dark:to-slate-500/10",
};

export function GridCard({ title, description, icon, href, tone = "neutral" }: GridCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex aspect-square flex-col justify-between overflow-hidden rounded-3xl border border-white/30 bg-white/70 p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-xl dark:bg-white/5",
        "before:absolute before:inset-0 before:-z-10 before:opacity-0 before:transition group-hover:before:opacity-100",
        `before:bg-gradient-to-br ${toneClasses[tone]}`
      )}
    >
      <div className="text-3xl">{icon}</div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Відкрити →
      </span>
    </Link>
  );
}
