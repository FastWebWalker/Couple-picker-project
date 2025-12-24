import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <div className="text-5xl">🧭</div>
      <h1 className="text-3xl font-semibold">Схоже, тут нічого немає</h1>
      <p className="text-muted-foreground">
        Сторінку не знайдено. Спробуйте повернутися на головну або у каталог рулеток.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/">На головну</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/roulettes">Каталог</Link>
        </Button>
      </div>
    </div>
  );
}
