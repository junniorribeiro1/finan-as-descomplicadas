import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Panel, PanelHead, Eyebrow, Money } from "@/components/app/kit";
import { Plus, Landmark, ArrowUpRight, ArrowDownLeft, Building2 } from "lucide-react";

export const Route = createFileRoute("/bancos")({
  head: () => ({
    meta: [
      { title: "Contas Bancárias — OrganizAI" },
      { name: "description", content: "Monitore saldos e extratos de todas as suas contas bancárias." },
    ],
  }),
  component: Bancos,
});

const contasMock = [
  { id: "1", banco: "Nubank", tipo: "Conta Corrente", saldo: 3420.5, agencia: "0001", conta: "48291-2", cor: "border-purple-500/30" },
  { id: "2", banco: "Banco Inter", tipo: "Conta Digital & Invest", saldo: 8940.0, agencia: "0001", conta: "93120-7", cor: "border-orange-500/30" },
  { id: "3", banco: "Itaú Unibanco", tipo: "Conta Salário", saldo: 520.1, agencia: "1402", conta: "12849-0", cor: "border-blue-500/30" },
];

function Bancos() {
  const [contas] = useState(contasMock);
  const totalSaldos = contas.reduce((acc, c) => acc + c.saldo, 0);

  return (
    <AppShell titulo="Bancos" descricao="Saldos unificados e conexões bancárias em tempo real.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Panel className="p-5">
          <Eyebrow>Saldo Total em Contas</Eyebrow>
          <div className="mt-2 text-2xl font-bold text-emerald-400">
            <Money valor={totalSaldos} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{contas.length} instituições conectadas</p>
        </Panel>

        <Panel className="p-5">
          <Eyebrow>Open Finance</Eyebrow>
          <div className="mt-2 flex items-center gap-2 text-lg font-bold text-foreground">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            Sincronizado
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Atualizado hoje às 08:30</p>
        </Panel>

        <Panel className="p-5">
          <Eyebrow>Liquidez Imediata</Eyebrow>
          <div className="mt-2 text-2xl font-bold text-foreground">
            <Money valor={totalSaldos} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Disponível para Pix e transferências</p>
        </Panel>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <PanelHead titulo="Contas Conectadas" descricao="Gerencie bancos e contas vinculadas" />
        <button className="flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90">
          <Plus className="h-4 w-4" />
          Conectar Banco
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {contas.map((conta) => (
          <Panel key={conta.id} className={`p-5 border ${conta.cor} card-hover`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-2 text-orange-400">
                  <Landmark className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">{conta.banco}</h4>
                  <p className="text-[0.7rem] text-muted-foreground">{conta.tipo}</p>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <span className="text-xs text-muted-foreground">Saldo disponível:</span>
              <p className="font-display text-xl font-bold text-foreground mt-0.5">
                <Money valor={conta.saldo} />
              </p>
            </div>

            <div className="mt-4 border-t border-border pt-3 flex justify-between text-[0.7rem] text-subtle">
              <span>Ag: {conta.agencia}</span>
              <span>CC: {conta.conta}</span>
            </div>
          </Panel>
        ))}
      </div>
    </AppShell>
  );
}
