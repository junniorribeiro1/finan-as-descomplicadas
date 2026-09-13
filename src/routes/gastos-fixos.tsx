import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Panel, PanelHead, Eyebrow, Money, Badge, StatusPill } from "@/components/app/kit";
import { Plus, Receipt, Calendar, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/gastos-fixos")({
  head: () => ({
    meta: [
      { title: "Gastos Fixos — OrganizAI" },
      { name: "description", content: "Gerencie e controle suas despesas fixas e recorrentes." },
    ],
  }),
  component: GastosFixos,
});

const gastosIniciais = [
  { id: "1", descricao: "Aluguel & Condomínio", categoria: "Moradia", valor: 1450.0, vencimento: "Dia 05", status: "pago" },
  { id: "2", descricao: "Internet Fibra 500MB", categoria: "Serviços", valor: 129.9, vencimento: "Dia 10", status: "pago" },
  { id: "3", descricao: "Energia Elétrica", categoria: "Moradia", valor: 215.4, vencimento: "Dia 15", status: "pendente" },
  { id: "4", descricao: "Plano de Saúde", categoria: "Saúde", valor: 380.0, vencimento: "Dia 20", status: "pendente" },
  { id: "5", descricao: "Assinaturas de Streaming", categoria: "Lazer", valor: 89.9, vencimento: "Dia 25", status: "pendente" },
];

function GastosFixos() {
  const [gastos] = useState(gastosIniciais);
  const totalFixos = gastos.reduce((acc, curr) => acc + curr.valor, 0);
  const totalPago = gastos.filter(g => g.status === "pago").reduce((acc, curr) => acc + curr.valor, 0);
  const totalPendente = totalFixos - totalPago;

  return (
    <AppShell titulo="Gastos Fixos" descricao="Acompanhe e antecipe seus custos recorrentes do mês.">
      {/* Resumo */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Panel className="p-5">
          <Eyebrow>Total Previsto</Eyebrow>
          <div className="mt-2 text-2xl font-bold">
            <Money valor={totalFixos} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{gastos.length} despesas cadastradas</p>
        </Panel>

        <Panel className="p-5">
          <Eyebrow>Já Pago</Eyebrow>
          <div className="mt-2 text-2xl font-bold text-emerald-400">
            <Money valor={totalPago} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Contas quitadas neste ciclo</p>
        </Panel>

        <Panel className="p-5">
          <Eyebrow>Pendente</Eyebrow>
          <div className="mt-2 text-2xl font-bold text-amber-400">
            <Money valor={totalPendente} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">A vencer nos próximos dias</p>
        </Panel>
      </div>

      {/* Lista de Gastos Fixos */}
      <Panel className="mt-6">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <PanelHead
            titulo="Despesas Recorrentes"
            descricao="Valores debitados ou pagos mensalmente"
          />
          <button className="flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90">
            <Plus className="h-4 w-4" />
            Novo Gasto Fixo
          </button>
        </div>

        <div className="divide-y divide-border">
          {gastos.map((gasto) => (
            <div key={gasto.id} className="flex items-center justify-between p-4 hover:bg-surface/50 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{gasto.descricao}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{gasto.categoria}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {gasto.vencimento}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-display font-semibold text-foreground">
                    <Money valor={gasto.valor} />
                  </p>
                  <p className="text-[0.7rem] text-muted-foreground">Mensal</p>
                </div>
                <StatusPill status={gasto.status === "pago" ? "pago" : "pendente"} />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </AppShell>
  );
}
