import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Panel, PanelHead, Eyebrow, Money } from "@/components/app/kit";
import { Plus, Tag, ShoppingCart, Home, Car, HeartPulse, GraduationCap, Sparkles } from "lucide-react";
import { categorias as categoriasMock } from "@/lib/mock-data";

export const Route = createFileRoute("/categorias")({
  head: () => ({
    meta: [
      { title: "Categorias — OrganizAI" },
      { name: "description", content: "Organize seus lançamentos por categorias e limites de orçamento." },
    ],
  }),
  component: Categorias,
});

function Categorias() {
  const [lista] = useState(categoriasMock);

  return (
    <AppShell titulo="Categorias" descricao="Agrupe suas receitas e despesas para entender seus hábitos financeiros.">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Orçamentos por Categoria</h3>
          <p className="text-xs text-muted-foreground">Distribuição e limite de gastos por grupo</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90">
          <Plus className="h-4 w-4" />
          Nova Categoria
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((cat) => (
          <Panel key={cat.nome} className="p-5 card-hover">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 text-orange-400">
                  <Tag className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">{cat.nome}</h4>
                  <span className="text-[0.7rem] text-muted-foreground">{cat.percentual}% do total</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-display font-semibold text-foreground">
                  <Money valor={cat.valor} />
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${cat.percentual}%` }}
                />
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </AppShell>
  );
}
