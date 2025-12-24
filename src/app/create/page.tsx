import { CreateRouletteForm } from "@/components/create-roulette-form";
import { Card, CardContent } from "@/components/ui/card";

export default function CreatePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold">Створити кастомну рулетку</h1>
        <p className="text-muted-foreground">
          Додавайте назву, опис, емоджі та перелік опцій. Все одразу зʼявиться у вашому каталозі.
        </p>
      </div>
      <Card className="mt-6 glass">
        <CardContent className="p-6">
          <CreateRouletteForm />
        </CardContent>
      </Card>
    </div>
  );
}
