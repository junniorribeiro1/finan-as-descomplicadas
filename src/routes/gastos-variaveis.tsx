import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Panel, PanelHead, Eyebrow, Money, Badge } from "@/components/app/kit";
import { Plus, ShoppingBag, Utensils, Fuel, Coffee, Film } from "lucide-react";

export const Route = createFileRoute("/gastos-variaveis")({
  head: () => ({
    meta: [
      { title: "Gastos Variáveis — OrganizAI" },
      { name: "description", content: "Acompanhe e controle seus gastos variáveis do dia a dia." },
    ],
  }),
  component: GastosVariaveis,
});

const variaveisMock = [
  { id: "1", descricao: "Supermercado Mensal", categoria: "Alimentação", valor: 684.2, data: "12/09", icone: ShoppingBag },
  { id: "2", descricao: "Jantar Restaurante", categoria: "Lazer", valor: 142.5, data: "11/09", icone: Utensils },
  { id: "3", descricao: "Abastecimento Posto Shell", categoria: "Transporte", valor: 190.0, data: "09/09", icone: Fuel },
  { id: "4", descricao: "Cafeteria & Lanches", categoria: "Alimentação", valor: 38.5, data: "08/09", icone: Coffee },
  { id: "5", descricao: "Cinema & Pipoca", categoria: "Lazer", valor: 76.0, data: "06/09", icone: Film },
];

function GastosVariaveis() {
  const [gastos] = useState(variaveisMock);
  const total = gastos.reduce((acc, curr) => acc + curr.valor, 0);

  return (
    <AppShell titulo="Gastos Variáveis" descricao="Monitore despesas do cotidiano, compras e lazer.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Panel className="p-5">
          <Eyebrow>Total Acumulado no Mês</Eyebrow>
          <div className="mt-2 text-2xl font-bold">
            <Money valor={total} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{gastos.length} compras registradas</p>
        </Panel>

        <Panel className="p-5">
          <Eyebrow>Média Diária</Eyebrow>
          <div className="mt-2 text-2xl font-bold text-orange-400">
            <Money valor={total / 12} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Com base nos últimos 12 dias</p>
        </Panel>

        <Panel className="p-5">
          <Eyebrow>Meta Mensal</Eyebrow>
          <div className="mt-2 text-2xl font-bold text-muted-foreground">
            <Money valor={1800.0} />
          </div>
          <p className="mt-1 text-xs text-emerald-400">Dentro do teto previsto (62%)</p>
        </Panel>
      </div>

      <Panel className="mt-6">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <PanelHead
            titulo="Últimas Despesas Variáveis"
            descricao="Compras recentes no cartão de débito, crédito ou Pix"
          />
          <button className="flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90">
            <Plus className="h-4 w-4" />
            Adicionar Compra
          </button>
        </div>

        <div className="divide-y divide-border">
          {gastos.map((gasto) => {
            const Icone = gasto.icone;
            return (
              <div key={gasto.id} className="flex items-center justify-between p-4 hover:bg-surface/50 transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                    <Icone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{gasto.descricao}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{gasto.categoria}</span>
                      <span>•</span>
                      <span>{gasto.data}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-display font-semibold text-foreground">
                    <Money valor={gasto.valor} />
                  </p>
                  <span className="text-[0.7rem] text-muted-foreground">Variável</span>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </AppShell>
  );
}
