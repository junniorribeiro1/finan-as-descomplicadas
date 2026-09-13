import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Panel, PanelHead, Eyebrow } from "@/components/app/kit";
import { ListChecks, CheckCircle2, Circle, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/passo-a-passo")({
  head: () => ({
    meta: [
      { title: "Passo a Passo — OrganizAI" },
      { name: "description", content: "Guia passo a passo para colocar sua vida financeira em ordem." },
    ],
  }),
  component: PassoAPasso,
});

const etapas = [
  { id: 1, titulo: "Mapear Gastos Fixos", desc: "Liste aluguel, energia, internet e todas as contas essenciais.", concluido: true },
  { id: 2, titulo: "Conectar Contas & Cartões", desc: "Vincule seus bancos para consolidar saldos e faturas.", concluido: true },
  { id: 3, titulo: "Definir Tetos de Gastos Variáveis", desc: "Estipule um limite semanal para lazer, alimentação e compras.", concluido: false },
  { id: 4, titulo: "Criar o Cofrinho de Reserva", desc: "Guarde os primeiros R$ 1.000 para imprevistos e emergências.", concluido: false },
  { id: 5, titulo: "Começar a Investir", desc: "Dê o primeiro passo em ativos seguros com liquidez diária.", concluido: false },
];

function PassoAPasso() {
  const [lista, setLista] = useState(etapas);

  const toggleEtapa = (id: number) => {
    setLista((prev) =>
      prev.map((e) => (e.id === id ? { ...e, concluido: !e.concluido } : e))
    );
  };

  const concluidas = lista.filter((e) => e.concluido).length;
  const progresso = Math.round((concluidas / lista.length) * 100);

  return (
    <AppShell titulo="Passo a passo" descricao="Seu roteiro prático para conquistar estabilidade e liberdade financeira.">
      <Panel className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <Eyebrow>Trilha de Organização</Eyebrow>
            <h3 className="mt-1 text-xl font-bold">Progresso do Método ({progresso}%)</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {concluidas} de {lista.length} etapas concluídas
            </p>
          </div>
          <div className="w-full sm:w-48">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${progresso}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {lista.map((etapa) => (
            <div
              key={etapa.id}
              onClick={() => toggleEtapa(etapa.id)}
              className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                etapa.concluido
                  ? "border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10"
                  : "border-border bg-surface/40 hover:bg-surface/70"
              }`}
            >
              <div className="mt-0.5">
                {etapa.concluido ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <h4 className={`text-sm font-semibold ${etapa.concluido ? "text-foreground line-through opacity-80" : "text-foreground"}`}>
                  {etapa.id}. {etapa.titulo}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">{etapa.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </AppShell>
  );
}
