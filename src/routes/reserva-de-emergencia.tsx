import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Panel, PanelHead, Eyebrow, Money, ProgressBar } from "@/components/app/kit";
import { ShieldCheck, Plus, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/reserva-de-emergencia")({
  head: () => ({
    meta: [
      { title: "Reserva de Emergência — OrganizAI" },
      { name: "description", content: "Construa sua segurança e colchão financeiro." },
    ],
  }),
  component: ReservaEmergencia,
});

function ReservaEmergencia() {
  const atual = 8400;
  const meta = 12000;
  const pct = Math.round((atual / meta) * 100);

  return (
    <AppShell titulo="Reserva de Emergência" descricao="Sua rede de segurança para imprevistos e tranquilidade.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Panel className="p-5">
          <Eyebrow>Saldo da Reserva</Eyebrow>
          <div className="mt-2 text-2xl font-bold text-emerald-400">
            <Money valor={atual} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Aplicado em liquidez diária</p>
        </Panel>

        <Panel className="p-5">
          <Eyebrow>Meta Recomendada (6 meses)</Eyebrow>
          <div className="mt-2 text-2xl font-bold text-foreground">
            <Money valor={meta} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Com base no seu custo de vida</p>
        </Panel>

        <Panel className="p-5">
          <Eyebrow>Cobertura Atual</Eyebrow>
          <div className="mt-2 text-2xl font-bold text-orange-400">
            4.2 Meses
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Progresso: {pct}% do objetivo</p>
        </Panel>
      </div>

      <Panel className="mt-6 p-6">
        <PanelHead titulo="Evolução da Reserva" descricao="Rumo aos 6 meses de tranquilidade financeira" />
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">Meta de R$ 12.000</span>
            <span className="font-semibold text-foreground">{pct}%</span>
          </div>
          <ProgressBar valor={pct} />
        </div>
      </Panel>
    </AppShell>
  );
}
