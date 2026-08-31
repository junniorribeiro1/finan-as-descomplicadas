import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, TrendingUp, TrendingDown, Clock, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Panel, PanelHead, Eyebrow, Money, Badge, StatusPill, SelectPill } from "@/components/app/kit";
import { BarrasComparativas, Rosca } from "@/components/app/charts";
import {
  aluno,
  resumoMes,
  serieMensal,
  categorias,
  lancamentos,
  alertas,
} from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Visão Geral — Órbita Finanças" },
      {
        name: "description",
        content:
          "Painel financeiro do estudante: saldo, receitas, despesas, categorias e lançamentos recentes em um só lugar.",
      },
      { property: "og:title", content: "Visão Geral — Órbita Finanças" },
      {
        property: "og:description",
        content: "Painel financeiro premium para estudantes organizarem a vida financeira.",
      },
    ],
  }),
  component: Dashboard,
});

const totalDespesas = categorias.reduce((s, c) => s + c.valor, 0);

function Dashboard() {
  const [mes, setMes] = useState("Agosto");
  const [ano, setAno] = useState("2026");

  return (
    <AppShell titulo={`Olá, ${aluno.nome}`} descricao="Vamos organizar suas finanças.">
      {/* Boas-vindas + período */}
      <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <Eyebrow>Visão geral</Eyebrow>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Olá, {aluno.nome} 👋</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Veja como estão suas finanças hoje.
          </p>
        </div>
        <div className="flex gap-2">
          <SelectPill
            valor={mes}
            onChange={setMes}
            opcoes={[
              "Janeiro",
              "Fevereiro",
              "Março",
              "Abril",
              "Maio",
              "Junho",
              "Julho",
              "Agosto",
            ]}
          />
          <SelectPill valor={ano} onChange={setAno} opcoes={["2024", "2025", "2026"]} />
        </div>
      </div>

      {/* Cards principais */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card-hover rounded-3xl bg-primary p-6 text-primary-foreground sm:col-span-2 xl:col-span-1">
          <p className="text-[0.68rem] font-medium tracking-[0.16em] uppercase opacity-70">
            Saldo atual
          </p>
          <p className="mt-6 text-3xl font-semibold sm:text-4xl">
            <Money valor={resumoMes.saldo} />
          </p>
          <div className="mt-6 flex items-center justify-between border-t border-primary-foreground/15 pt-4 text-xs">
            <span className="opacity-80">{mes} de {ano}</span>
            <span className="inline-flex items-center gap-1 font-medium">
              <TrendingUp className="h-3.5 w-3.5" /> +14% no mês
            </span>
          </div>
        </div>

        <CardResumo
          rotulo="Receitas"
          valor={resumoMes.receitas}
          nota="+ R$ 290,00 vs julho"
          Icone={TrendingUp}
          tom="positivo"
        />
        <CardResumo
          rotulo="Despesas"
          valor={resumoMes.despesas}
          nota="− R$ 1.226,62 vs julho"
          Icone={TrendingDown}
          tom="neutro"
        />
        <CardResumo
          rotulo="A pagar"
          valor={resumoMes.aPagar}
          nota="4 contas em aberto"
          Icone={Clock}
          tom="atencao"
        />
      </div>

      {/* Gráficos */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.35fr_1fr]">
        <Panel>
          <PanelHead
            titulo="Receitas x Despesas"
            descricao="Comparativo dos últimos 8 meses"
            acao={
              <Link
                to="/controle-financeiro"
                className="grid h-9 w-9 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:text-primary"
                aria-label="Abrir controle financeiro"
              >
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            }
          />
          <BarrasComparativas dados={serieMensal} />
        </Panel>

        <Panel>
          <PanelHead titulo="Distribuição das despesas" descricao={`${mes} de ${ano}`} />
          <Rosca dados={categorias} total={totalDespesas} />
        </Panel>
      </div>

      {/* Lançamentos + atenção */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.35fr_1fr]">
        <Panel>
          <PanelHead
            titulo="Últimos lançamentos"
            descricao="Movimentações mais recentes da sua conta"
            acao={
              <Link
                to="/controle-financeiro"
                className="rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                Ver tudo
              </Link>
            }
          />
          <ul className="divide-y divide-border border-t border-border">
            {lancamentos.slice(0, 6).map((l) => (
              <li
                key={l.descricao}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-2/50 sm:px-6"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{l.descricao}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {l.categoria} · {l.data} · {l.pagamento}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p
                    className={`num text-sm ${l.valor > 0 ? "text-primary" : "text-foreground"}`}
                  >
                    <Money valor={l.valor} sinal />
                  </p>
                  <div className="mt-1.5 flex justify-end">
                    <StatusPill status={l.status} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <PanelHead titulo="Precisa de atenção" descricao="Três pontos para revisar" />
            <ul className="divide-y divide-border border-t border-border">
              {alertas.map((a) => (
                <li key={a.titulo} className="flex gap-3 px-5 py-4 sm:px-6">
                  <AlertCircle
                    className={`mt-0.5 h-4 w-4 shrink-0 ${a.tom === "atencao" ? "text-warning" : "text-primary"}`}
                    strokeWidth={1.75}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{a.titulo}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{a.detalhe}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <Eyebrow>Reserva de emergência</Eyebrow>
            <p className="num mt-4 text-2xl font-semibold">
              <Money valor={6850} />
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              45,7% da meta de R$ 15.000,00
            </p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface-2">
              <div className="h-full w-[45.7%] rounded-full bg-primary" />
            </div>
            <Link
              to="/reserva-de-emergencia"
              className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-surface-2 px-4 py-2.5 text-xs font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Acompanhar reserva
            </Link>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

function CardResumo({
  rotulo,
  valor,
  nota,
  Icone,
  tom,
}: {
  rotulo: string;
  valor: number;
  nota: string;
  Icone: typeof TrendingUp;
  tom: "positivo" | "neutro" | "atencao";
}) {
  return (
    <div className="panel card-hover p-6">
      <div className="flex items-center justify-between">
        <Eyebrow>{rotulo}</Eyebrow>
        <Icone
          className={`h-4 w-4 ${tom === "positivo" ? "text-primary" : tom === "atencao" ? "text-warning" : "text-muted-foreground"}`}
          strokeWidth={1.75}
        />
      </div>
      <p className="mt-6 text-2xl font-semibold sm:text-3xl">
        <Money valor={valor} />
      </p>
      <div className="mt-6 border-t border-border pt-4">
        <Badge tom={tom}>{nota}</Badge>
      </div>
    </div>
  );
}
