import Link from "next/link";

import { HomeGrid } from "@/components/home-grid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const sections = [
  {
    title: "Куди йдемо",
    description: "Локації для вечора або прогулянки.",
    icon: "📍",
    href: "/roulettes",
    tone: "warm" as const,
  },
  {
    title: "Їжа",
    description: "Смак дня без спорів.",
    icon: "🍜",
    href: "/roulettes",
    tone: "cool" as const,
  },
  {
    title: "Активність",
    description: "Живі ідеї для руху.",
    icon: "🧩",
    href: "/roulettes",
    tone: "neutral" as const,
  },
  {
    title: "Кіно",
    description: "Фільм чи серіал на вечір.",
    icon: "🎬",
    href: "/roulettes",
    tone: "cool" as const,
  },
  {
    title: "Подарунок",
    description: "Маленька несподіванка.",
    icon: "🎁",
    href: "/roulettes",
    tone: "warm" as const,
  },
  {
    title: "Прогулянка",
    description: "Маршрут на 30 хвилин.",
    icon: "🚶",
    href: "/roulettes",
    tone: "neutral" as const,
  },
  {
    title: "Random challenge",
    description: "Сміливий челендж для двох.",
    icon: "⚡",
    href: "/roulettes",
    tone: "cool" as const,
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <section className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-muted-foreground">
            Рулетка для двох
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
            Date Roulette — коли хочеться сюрпризу, а не спорів
          </h1>
          <p className="text-base text-muted-foreground md:text-lg">
            Обирайте модуль, крутить колесо, додавайте свої опції та зберігайте
            історію найкращих ідей. Все українською, красиво і швидко.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/roulettes">Запустити рулетки</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/create">Створити свою</Link>
            </Button>
          </div>
        </div>
        <Card className="glass border-white/30">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center justify-between text-sm font-semibold text-muted-foreground">
              <span>Сьогоднішній набір</span>
              <span className="rounded-full bg-white/60 px-3 py-1 text-xs text-foreground">
                Live
              </span>
            </div>
            <div className="space-y-3 text-sm">
              <p>🎡 12 готових рулеток</p>
              <p>🧡 Топові категорії: їжа, активність, побачення</p>
              <p>✨ Результати зберігаються локально</p>
              <p>🛡️ Кастомні рулетки лише для власника</p>
            </div>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/roulettes">Перейти до каталогу</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="mt-14 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Модулі на головній</h2>
          <Link href="/roulettes" className="text-sm font-semibold text-primary">
            Дивитися всі →
          </Link>
        </div>
        <HomeGrid sections={sections} />
      </section>
    </div>
  );
}
