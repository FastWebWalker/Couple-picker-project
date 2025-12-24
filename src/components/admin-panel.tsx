"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

type Prebuilt = {
  id: string;
  title: string;
  icon: string;
};

type ProposalItem = {
  id: string;
  label: string;
  roulette: {
    id: string;
    title: string;
    icon: string;
  };
};

export function AdminPanel({ prebuilt }: { prebuilt: Prebuilt[] }) {
  const { toast } = useToast();
  const [proposals, setProposals] = useState<ProposalItem[]>([]);
  const [selected, setSelected] = useState(prebuilt[0]?.id ?? "");
  const [label, setLabel] = useState("");

  const loadProposals = async () => {
    const res = await fetch("/api/admin/proposals");
    if (!res.ok) return;
    const data = await res.json();
    setProposals(data);
  };

  useEffect(() => {
    loadProposals();
  }, []);

  const addOption = async () => {
    if (!selected || !label.trim()) return;
    const res = await fetch(`/api/roulettes/${selected}/options`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: label.trim() }),
    });
    if (!res.ok) {
      toast({ title: "Помилка", description: "Не вдалося додати опцію." });
      return;
    }
    toast({ title: "Опцію додано" });
    setLabel("");
  };

  const updateProposal = async (id: string, action: "approve" | "reject") => {
    const res = await fetch("/api/admin/proposals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    if (!res.ok) {
      toast({ title: "Помилка", description: "Не вдалося оновити." });
      return;
    }
    toast({ title: action === "approve" ? "Підтверджено" : "Відхилено" });
    setProposals((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Додати опцію до готової рулетки</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_2fr_auto]">
          <select
            className="h-11 rounded-xl border border-input bg-background px-3 text-sm"
            value={selected}
            onChange={(event) => setSelected(event.target.value)}
          >
            {prebuilt.map((roulette) => (
              <option key={roulette.id} value={roulette.id}>
                {roulette.icon} {roulette.title}
              </option>
            ))}
          </select>
          <Input value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Нова опція" />
          <Button onClick={addOption}>Додати</Button>
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Пропозиції від користувачів</h2>
          <Button variant="ghost" onClick={loadProposals}>
            Оновити
          </Button>
        </div>
        <div className="mt-4 space-y-3">
          {proposals.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
              Немає нових пропозицій.
            </div>
          ) : (
            proposals.map((proposal) => (
              <div key={proposal.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-3">
                <div>
                  <p className="text-sm font-semibold">{proposal.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {proposal.roulette.icon} {proposal.roulette.title}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => updateProposal(proposal.id, "approve")}>
                    Підтвердити
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => updateProposal(proposal.id, "reject")}>
                    Відхилити
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
