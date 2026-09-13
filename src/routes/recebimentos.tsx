import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Panel, PanelHead, Eyebrow, Money, StatusPill } from "@/components/app/kit";
import { Plus, CircleArrowDown, Briefcase, Laptop, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/recebimentos")({
  head: () => ({
    meta: [
      { title: "Recebimentos — OrganizAI" },
      { name: "description", content: "Controle suas fontes de renda, salários, freelas e recebimentos." },
    ],
  }),
  component: Recebimentos,
});

const receitasMock = [
  { id: "1", descricao: "Salário Principal", fonte: "Empresa LTDA", valor: 5400.0, data: "05/09", status: "pago", icone: Briefcase },
  { id: "2", descricao: "Projeto Freelance UI/UX", fonte: "Cliente Externo", valor: 1850.0, data: "10/09", status: "pago", icone: Laptop },
  { id: "3", descricao: "Rendimento CDB", fonte: "Banco Inter", valor: 145.2, data: "12/09", status: "pago", icone: TrendingUp },
  { id: "4", descricao: "Consultoria Pontual", fonte: "Parceiro", valor: 600.0, data: "25/09", status: "pendente", icone: Laptop },
];

function Recebimentos() {
  const [receitas] = useState(receitasMock);
  const total = receitas.reduce((acc, curr) => acc + curr.valor, 0);
  const totalRecebido = receitas.filter(r => r.status === "pago").reduce((acc, curr) => acc + curr.valor, 0);
  const totalPrevisto = total - totalRecebido;

  return (
    <AppShell titulo="Recebimentos" descricao="Gerencie salários, freelas e receitas extraordinárias.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Panel className="p-5">
          <Eyebrow>Total Previsto no Mês</Eyebrow>
          <div className="mt-2 text-2xl font-bold">
            <Money valor={total} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{receitas.length} fontes cadastradas</p>
        </Panel>

        <Panel className="p-5">
          <Eyebrow>Já Recebido</Eyebrow>
          <div className="mt-2 text-2xl font-bold text-emerald-400">
            <Money valor={totalRecebido} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Disponível em conta</p>
        </Panel>

        <Panel className="p-5">
          <Eyebrow>A Receber</Eyebrow>
          <div className="mt-2 text-2xl font-bold text-orange-400">
            <Money valor={totalPrevisto} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Previsão até o fim do mês</p>
        </Panel>
      </div>

      <Panel className="mt-6">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <PanelHead
            titulo="Entradas & Rendimentos"
            descricao="Histórico e previsões de crédito em conta"
          />
          <button className="flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90">
            <Plus className="h-4 w-4" />
            Novo Recebimento
          </button>
        </div>

        <div className="divide-y divide-border">
          {receitas.map((item) => {
            const Icone = item.icone;
            return (
              <div key={item.id} className="flex items-center justify-between p-4 hover:bg-surface/50 transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <CircleArrowDown className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.descricao}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{item.fonte}</span>
                      <span>•</span>
                      <span>{item.data}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-display font-semibold text-emerald-400">
                      +<Money valor={item.valor} />
                    </p>
                    <p className="text-[0.7rem] text-muted-foreground">Entrada</p>
                  </div>
                  <StatusPill status={item.status === "pago" ? "pago" : "pendente"} />
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </AppShell>
  );
}
