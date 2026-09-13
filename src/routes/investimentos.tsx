import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Panel, PanelHead, Eyebrow, Money } from "@/components/app/kit";
import { Plus, TrendingUp, DollarSign, PieChart, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/investimentos")({
  head: () => ({
    meta: [
      { title: "Investimentos — OrganizAI" },
      { name: "description", content: "Acompanhe a rentabilidade e evolução da sua carteira de investimentos." },
    ],
  }),
  component: Investimentos,
});

const posicoes = [
  { id: "1", ativo: "Tesouro Selic 2029", classe: "Renda Fixa", valor: 12500.0, rentabilidade: "+1.05%", lucro: 131.25 },
  { id: "2", ativo: "CDB 110% CDI Inter", classe: "Renda Fixa", valor: 8200.0, rentabilidade: "+0.98%", lucro: 80.36 },
  { id: "3", ativo: "IVVB11 (S&P 500)", classe: "ETFs Globais", valor: 4500.0, rentabilidade: "+3.42%", lucro: 153.9 },
  { id: "4", ativo: "HGLG11 (Logística)", classe: "Fundos Imobiliários", valor: 3100.0, rentabilidade: "+0.85%", lucro: 26.35 },
];

function Investimentos() {
  const [itens] = useState(posicoes);
  const patrimonioInvestido = itens.reduce((acc, p) => acc + p.valor, 0);
  const lucroMensal = itens.reduce((acc, p) => acc + p.lucro, 0);

  return (
    <AppShell titulo="Investimentos" descricao="Evolução patrimonial, rentabilidade e alocação de ativos.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Panel className="p-5">
          <Eyebrow>Patrimônio Investido</Eyebrow>
          <div className="mt-2 text-2xl font-bold text-orange-400">
            <Money valor={patrimonioInvestido} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{itens.length} ativos em carteira</p>
        </Panel>

        <Panel className="p-5">
          <Eyebrow>Rendimento Estimado (Mês)</Eyebrow>
          <div className="mt-2 text-2xl font-bold text-emerald-400">
            +<Money valor={lucroMensal} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Rentabilidade média de +1.38% a.m.</p>
        </Panel>

        <Panel className="p-5">
          <Eyebrow>Alocação Principal</Eyebrow>
          <div className="mt-2 text-2xl font-bold text-foreground">
            73% Renda Fixa
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Perfil conservador e protegido</p>
        </Panel>
      </div>

      <Panel className="mt-6">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <PanelHead
            titulo="Posição Consolidada"
            descricao="Detalhamento por papel e modalidade"
          />
          <button className="flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90">
            <Plus className="h-4 w-4" />
            Adicionar Ativo
          </button>
        </div>

        <div className="divide-y divide-border">
          {itens.map((pos) => (
            <div key={pos.id} className="flex items-center justify-between p-4 hover:bg-surface/50 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{pos.ativo}</p>
                  <span className="text-xs text-muted-foreground">{pos.classe}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div>
                  <p className="font-display font-semibold text-foreground">
                    <Money valor={pos.valor} />
                  </p>
                  <span className="text-[0.7rem] text-emerald-400 font-medium">
                    {pos.rentabilidade} (+R$ {pos.lucro.toFixed(2)})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </AppShell>
  );
}
