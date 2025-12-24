"use client";

import { useEffect, useMemo, useState } from "react";

import { RouletteWheel } from "@/components/roulette-wheel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useSupabaseUser } from "@/hooks/use-supabase-user";

type OptionItem = {
  id: string;
  label: string;
  weight?: number | null;
};

type RouletteData = {
  id: string;
  title: string;
  description: string;
  icon: string;
  is_prebuilt: boolean;
  owner_id: string | null;
  options: OptionItem[];
};

type RouletteClientProps = {
  roulette: RouletteData;
  isOwner: boolean;
  isAdmin: boolean;
};

type HistoryItem = {
  label: string;
  at: string;
};

export function RouletteClient({ roulette, isOwner, isAdmin }: RouletteClientProps) {
  const { isSignedIn } = useSupabaseUser();
  const { toast } = useToast();
  const [options, setOptions] = useState<OptionItem[]>(roulette.options);
  const [draft, setDraft] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);

  const canEdit = isOwner && !roulette.is_prebuilt;
  const canSuggest = isSignedIn;
  const canAddDirectly = roulette.is_prebuilt ? isAdmin : canEdit;

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("dr:last-roulette", roulette.id);
    const stored = localStorage.getItem(`dr:history:${roulette.id}`);
    const storedDraft = localStorage.getItem(`dr:draft:${roulette.id}`);
    if (stored) setHistory(JSON.parse(stored));
    if (storedDraft) setDraft(storedDraft);
  }, [roulette.id]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(`dr:draft:${roulette.id}`, draft);
  }, [draft, roulette.id]);

  const handleResult = (option: OptionItem) => {
    const item = { label: option.label, at: new Date().toISOString() };
    const next = [item, ...history].slice(0, 10);
    setHistory(next);
    localStorage.setItem(`dr:history:${roulette.id}`, JSON.stringify(next));
  };

  const addOption = async () => {
    if (!draft.trim()) return;
    if (!isSignedIn) {
      toast({
        title: "Потрібен вхід",
        description: "Увійди, щоб додавати опції.",
      });
      return;
    }
    try {
      const res = await fetch(`/api/roulettes/${roulette.id}/options`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: draft.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Помилка");
      if (data.mode === "proposal") {
        toast({
          title: "Пропозицію збережено",
          description: "Адмін підтвердить її у списку.",
        });
      } else if (data.option) {
        setOptions((prev) => [...prev, data.option]);
        toast({ title: "Опцію додано" });
      }
      setDraft("");
    } catch {
      localStorage.setItem(`dr:pending:${roulette.id}`, draft.trim());
      toast({
        title: "Збережено локально",
        description: "Ми не втратили дані, спробуйте пізніше.",
      });
    }
  };

  const startEdit = (option: OptionItem) => {
    setEditingId(option.id);
    setEditingValue(option.label);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const res = await fetch(`/api/options/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: editingValue }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setOptions((prev) => prev.map((opt) => (opt.id === updated.id ? updated : opt)));
      setEditingId(null);
      toast({ title: "Опцію оновлено" });
    } catch {
      toast({ title: "Не вдалося оновити", description: "Спробуйте ще раз." });
    }
  };

  const deleteOption = async (id: string) => {
    try {
      const res = await fetch(`/api/options/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setOptions((prev) => prev.filter((opt) => opt.id !== id));
      toast({ title: "Опцію видалено" });
    } catch {
      toast({ title: "Помилка видалення", description: "Спробуйте ще раз." });
    }
  };

  const deleteRoulette = async () => {
    try {
      const res = await fetch(`/api/roulettes/${roulette.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast({ title: "Рулетку видалено" });
      window.location.href = "/roulettes";
    } catch {
      toast({ title: "Помилка видалення", description: "Спробуйте ще раз." });
    }
  };

  const historyList = useMemo(
    () =>
      history.map((item) => (
        <li key={item.at} className="flex items-center justify-between rounded-xl border p-3 text-sm">
          <span>{item.label}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(item.at).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </li>
      )),
    [history]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="glass rounded-3xl p-6">
        <RouletteWheel options={options} onResult={handleResult} canSpin={isSignedIn} />
      </div>
      <div className="space-y-6">
        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                {roulette.icon} {roulette.title}
              </h2>
              <p className="text-sm text-muted-foreground">{roulette.description}</p>
            </div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {roulette.is_prebuilt ? "Готова" : "Кастомна"}
            </div>
          </div>
          {canEdit && (
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
                Видалити рулетку
              </Button>
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span>{options.length} опцій</span>
            {roulette.is_prebuilt && <span>Доступно як демо</span>}
          </div>
        </div>

        <Tabs defaultValue="options">
          <TabsList>
            <TabsTrigger value="options">Опції</TabsTrigger>
            <TabsTrigger value="history">Історія</TabsTrigger>
          </TabsList>
          <TabsContent value="options">
            <div className="space-y-3">
              {options.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
                  Поки що немає опцій. Додайте перші, щоб колесо запрацювало.
                </div>
              ) : (
                options.map((option) => (
                  <div
                    key={option.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-3 text-sm"
                  >
                    {editingId === option.id ? (
                      <Input
                        value={editingValue}
                        onChange={(event) => setEditingValue(event.target.value)}
                        className="max-w-xs"
                      />
                    ) : (
                      <span>{option.label}</span>
                    )}
                    {canEdit && (
                      <div className="flex items-center gap-2">
                        {editingId === option.id ? (
                          <>
                            <Button size="sm" onClick={saveEdit}>
                              Зберегти
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                              Скасувати
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="ghost" onClick={() => startEdit(option)}>
                              Редагувати
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteOption(option.id)}>
                              Видалити
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          <TabsContent value="history">
            <div className="space-y-3">
              {history.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
                  Історія порожня. Зробіть перший спін.
                </div>
              ) : (
                <ul className="space-y-2">{historyList}</ul>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full" disabled={!canSuggest}>
              {roulette.is_prebuilt ? "Запропонувати опцію" : "Додати опцію"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {roulette.is_prebuilt ? "Пропозиція для готової рулетки" : "Нова опція"}
              </DialogTitle>
              <DialogDescription>
                {roulette.is_prebuilt
                  ? "Опція піде на підтвердження адміну."
                  : "Нова опція з'явиться одразу на колесі."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Напишіть варіант..."
              />
              <Button onClick={addOption} disabled={!draft.trim()}>
                {canAddDirectly ? "Додати" : "Запропонувати"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Видалити рулетку?</DialogTitle>
              <DialogDescription>
                Це назавжди видалить рулетку та всі її опції.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
                Скасувати
              </Button>
              <Button variant="destructive" onClick={deleteRoulette}>
                Видалити
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
