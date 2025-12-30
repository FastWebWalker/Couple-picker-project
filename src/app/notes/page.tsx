"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const sampleNotes = [
  {
    title: "Романтичний вечір",
    body: "Купити свічки, зробити пасту та увімкнути плейлист з джазом.",
  },
  {
    title: "Список бажань",
    body: "Плед, ароматичні свічки, похід у гори, фотоальбом за весну.",
  },
  {
    title: "Нагадування",
    body: "Записати побажання до спільної поїздки та обрати дату.",
  },
];

type NoteItem = {
  id: string;
  title: string;
  body: string;
  scheduled_for: string | null;
  created_at: string;
};

const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

function buildMonthDays(baseDate: Date) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = last.getDate();
  const cells: (Date | null)[] = [];

  for (let i = 0; i < startOffset; i += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }
  return cells;
}

function formatDateLabel(date: Date) {
  return date.toLocaleDateString("uk-UA", { day: "numeric", month: "long" });
}

function formatDateValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function NotesPage() {
  const { toast } = useToast();
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [authRequired, setAuthRequired] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [monthDate, setMonthDate] = useState(new Date());

  const monthLabel = useMemo(
    () => monthDate.toLocaleDateString("uk-UA", { month: "long", year: "numeric" }),
    [monthDate]
  );

  const monthCells = useMemo(() => buildMonthDays(monthDate), [monthDate]);

  const loadNotes = async () => {
    setLoading(true);
    const res = await fetch("/api/notes");
    if (res.status === 401) {
      setNotes([]);
      setAuthRequired(true);
      setLoading(false);
      return;
    }
    const data = await res.json();
    setNotes(data ?? []);
    setAuthRequired(false);
    setLoading(false);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const addNote = async (payload?: { title: string; body: string }) => {
    const noteTitle = payload?.title ?? title.trim();
    const noteBody = payload?.body ?? body.trim();

    if (!noteTitle || !noteBody) {
      toast({ title: "Заповніть заголовок і текст" });
      return;
    }

    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: noteTitle,
        body: noteBody,
        scheduledFor: selectedDate ? formatDateValue(selectedDate) : undefined,
      }),
    });

    if (!res.ok) {
      toast({ title: "Помилка", description: "Не вдалося створити нотатку." });
      return;
    }

    const created = (await res.json()) as NoteItem;
    setNotes((prev) => [created, ...prev]);
    setTitle("");
    setBody("");
    setSelectedDate(null);
  };

  const deleteNote = async (id: string) => {
    const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast({ title: "Помилка", description: "Не вдалося видалити нотатку." });
      return;
    }
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const goPrevMonth = () => {
    setMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goNextMonth = () => {
    setMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div className="grid h-[calc(100vh-64px)] w-full overflow-hidden">
      <div className="grid h-full gap-0 md:grid-cols-[1.2fr_0.8fr]">
        <section className="grid h-full gap-6 border-r border-orange-400 p-6">
          <header className="grid gap-2">
            <h1 className="text-2xl font-semibold uppercase tracking-[0.25em]">Нотатки</h1>
            <p className="text-sm text-muted-foreground">
              Спільні нотатки для всіх авторизованих. Додавайте ідеї та діліться планами.
            </p>
          </header>

          <div className="grid gap-4 rounded-2xl border border-orange-400 bg-white/70 p-4 shadow-sm">
            <div className="grid gap-2">
              <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Заголовок</label>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Напр. Неділя разом" />
            </div>
            <div className="grid gap-2">
              <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Текст</label>
              <textarea
                className="h-28 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Що саме хочете зробити або згадати"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Дата</label>
              <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                <div className="text-sm text-muted-foreground">
                  {selectedDate ? formatDateLabel(selectedDate) : "Без дати"}
                </div>
                <Button type="button" variant="ghost" onClick={() => setSelectedDate(null)}>
                  Очистити
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-[1fr_auto] items-center gap-2">
              <Button type="button" onClick={() => addNote()}>
                Додати нотатку
              </Button>
              <div className="text-xs text-muted-foreground">
                {selectedDate ? "Прив'язано до дня" : "Дата необов'язкова"}
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <h2 className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Приклади</h2>
            <div className="grid gap-3 md:grid-cols-3">
              {sampleNotes.map((note) => (
                <div key={note.title} className="grid gap-3 rounded-2xl border border-orange-400 bg-white/70 p-4">
                  <div className="grid gap-1">
                    <p className="text-sm font-semibold">{note.title}</p>
                    <p className="text-xs text-muted-foreground">{note.body}</p>
                  </div>
                  <Button type="button" variant="secondary" onClick={() => addNote(note)}>
                    Додати
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid min-h-0 gap-3 overflow-auto">
            {loading ? (
              <div className="text-sm text-muted-foreground">Завантаження...</div>
            ) : authRequired ? (
              <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
                Увійдіть, щоб створювати та переглядати нотатки.
              </div>
            ) : notes.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
                Поки що нотаток немає. Додайте першу.
              </div>
            ) : (
              <div className="grid gap-3">
                {notes.map((note) => (
                  <div key={note.id} className="grid gap-3 rounded-2xl border border-orange-400 bg-white/70 p-4">
                    <div className="grid gap-1">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.2em]">
                        {note.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{note.body}</p>
                    </div>
                    <div className="grid grid-cols-[1fr_auto] items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        {note.scheduled_for
                          ? `Подія: ${new Date(note.scheduled_for).toLocaleDateString("uk-UA")}`
                          : "Без дати"}
                      </span>
                      <Button size="sm" variant="ghost" onClick={() => deleteNote(note.id)}>
                        Видалити
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <aside className="grid h-full gap-6 p-6">
          <div className="grid gap-2">
            <h2 className="text-lg font-semibold uppercase tracking-[0.2em]">Календар</h2>
            <p className="text-sm text-muted-foreground">
              Оберіть дату, якщо хочете прив'язати подію.
            </p>
          </div>

          <div className="grid gap-3 rounded-2xl border border-orange-400 bg-white/70 p-4 shadow-sm">
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
              <Button variant="ghost" onClick={goPrevMonth}>←</Button>
              <div className="text-center text-sm font-semibold">{monthLabel}</div>
              <Button variant="ghost" onClick={goNextMonth}>→</Button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {daysOfWeek.map((day) => (
                <span key={day} className="text-center">{day}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {monthCells.map((cell, index) => {
                if (!cell) {
                  return <div key={`empty-${index}`} className="h-10" />;
                }
                const isSelected = selectedDate
                  ? formatDateValue(selectedDate) === formatDateValue(cell)
                  : false;
                return (
                  <button
                    key={cell.toISOString()}
                    type="button"
                    onClick={() => setSelectedDate(cell)}
                    className={`h-10 rounded-lg border border-orange-400 text-sm transition ${
                      isSelected
                        ? "bg-orange-100 text-orange-700"
                        : "bg-white/70 text-gray-700 hover:bg-orange-50"
                    }`}
                  >
                    {cell.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-3 rounded-2xl border border-orange-400 bg-white/70 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Обрана дата</p>
            <p className="text-sm font-semibold">
              {selectedDate ? formatDateLabel(selectedDate) : "Немає"}
            </p>
            <Button variant="secondary" onClick={() => setSelectedDate(null)}>
              Прибрати дату
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
