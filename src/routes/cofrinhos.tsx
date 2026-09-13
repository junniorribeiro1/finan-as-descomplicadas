import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Panel, PanelHead, Eyebrow, Money, ProgressBar } from "@/components/app/kit";
import { Plus, PiggyBank, Target, Plane, ShieldCheck, Car } from "lucide-react";

export const Route = createFileRoute("/cofrinhos")({
  head: () => ({
    meta: [
      { title: "Cofrinhos & Metas — OrganizAI" },
      { name: "description", content: "Economize para seus sonhos, metas e objetivos com cofrinhos virtuais." },
    ],
  }),
  component: Cofrinhos,
});

const metasIniciais = [
  { id: "1", nome: "Reserva de Emergência", atual: 8400, objetivo: 12000, icone: ShieldCheck, cor: "from-amber-500 to-orange-600" },
  { id: "2", nome: "Viagem de Férias", atual: 3200, objetivo: 5000, icone: Plane, cor: "from-blue-500 to-indigo-600" },
  { id: "3", nome: "Troca de Carro", atual: 14500, objetivo: 35000, icone: Car, cor: "from-emerald-500 to-teal-600" },
  { id: "4", nome: "Upgrade Equipamentos", atual: 2800, objetivo: 4000, icone: Target, cor: "from-purple-500 to-pink-600" },
];

function Cofrinhos() {
  const [metas] = useState(metasIniciais);
  const totalGuardado = metas.reduce((acc, m) => acc + m.atual, 0);
  const totalObjetivo = metas.reduce((acc, m) => acc + m.objetivo, 0);

  return (
    <AppShell titulo="Cofrinhos" descricao="Guarde dinheiro com propósito e acompanhe o progresso das suas metas.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Panel className="p-5">
          <Eyebrow>Total Guardado</Eyebrow>
          <div className="mt-2 text-2xl font-bold text-orange-400">
            <Money valor={totalGuardado} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{metas.length} metas ativas</p>
        </Panel>

        <Panel className="p-5">
          <Eyebrow>Meta Global</Eyebrow>
          <div className="mt-2 text-2xl font-bold text-foreground">
            <Money valor={totalObjetivo} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Soma de todos os objetivos</p>
        </Panel>

        <Panel className="p-5">
          <Eyebrow>Progresso Geral</Eyebrow>
          <div className="mt-2 text-2xl font-bold text-emerald-400">
            {((totalGuardado / totalObjetivo) * 100).toFixed(0)}%
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Do total desejado acumulado</p>
        </Panel>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Seus Objetivos</h3>
          <p className="text-xs text-muted-foreground">Cada cofrinho tem sua taxa de economia</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90">
          <Plus className="h-4 w-4" />
          Novo Cofrinho
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {metas.map((meta) => {
          const Icone = meta.icone;
          const pct = Math.min(100, Math.round((meta.atual / meta.objetivo) * 100));
          return (
            <Panel key={meta.id} className="p-5 relative overflow-hidden card-hover">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.cor} text-white shadow-lg shadow-black/40`}>
                    <Icone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base text-foreground">{meta.nome}</h4>
                    <p className="text-xs text-muted-foreground">
                      Objetivo: <Money valor={meta.objetivo} />
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold text-foreground">
                  {pct}%
                </span>
              </div>

              <div className="mt-5">
                <div className="flex items-baseline justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Saldo atual:</span>
                  <span className="font-semibold text-foreground text-sm">
                    <Money valor={meta.atual} />
                  </span>
                </div>
                <ProgressBar valor={pct} />
              </div>
            </Panel>
          );
        })}
      </div>
    </AppShell>
  );
}
