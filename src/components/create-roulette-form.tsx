"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useSupabaseUser } from "@/hooks/use-supabase-user";

export function CreateRouletteForm() {
  const { isSignedIn } = useSupabaseUser();
  const { toast } = useToast();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("🎯");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [loading, setLoading] = useState(false);

  const updateOption = (index: number, value: string) => {
    setOptions((prev) => prev.map((item, idx) => (idx === index ? value : item)));
  };

  const addOption = () => {
    setOptions((prev) => [...prev, ""]);
  };

  const removeOption = (index: number) => {
    setOptions((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isSignedIn) {
      toast({ title: "Увійдіть, щоб створювати рулетки" });
      return;
    }
    const filteredOptions = options.filter((item) => item.trim().length > 0);
    if (filteredOptions.length < 2) {
      toast({ title: "Додайте щонайменше 2 опції" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/roulettes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          icon,
          options: filteredOptions,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Помилка");
      toast({ title: "Рулетку створено" });
      router.push(`/roulette/${data.id}`);
    } catch {
      toast({ title: "Помилка створення", description: "Перевірте поля та спробуйте ще раз." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <label className="text-sm font-semibold">Назва</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Напр. Вечір удвох" />
        </div>
        <div>
          <label className="text-sm font-semibold">Іконка/emoji</label>
          <Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="🎯" />
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold">Опис</label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Коротко про рулетку"
        />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold">Опції</label>
          <Button type="button" variant="ghost" onClick={addOption}>
            + Додати поле
          </Button>
        </div>
        <div className="space-y-3">
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Опція ${index + 1}`}
              />
              {options.length > 2 && (
                <Button type="button" variant="ghost" onClick={() => removeOption(index)}>
                  Видалити
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
      <Button type="submit" size="lg" disabled={loading}>
        {loading ? "Створення..." : "Створити рулетку"}
      </Button>
    </form>
  );
}
