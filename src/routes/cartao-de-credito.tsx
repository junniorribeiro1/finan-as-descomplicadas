import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Panel, PanelHead, Eyebrow, Money, Badge, StatusPill, ProgressBar } from "@/components/app/kit";
import { BarrasSimples } from "@/components/app/charts";
import { cartao, comprasCartao, parcelas, faturasHistorico } from "@/lib/mock-data";

export const Route = createFileRoute("/cartao-de-credito")({
  head: () => ({
    meta: [
      { title: "Cartão de Crédito — Órbita Finanças" },
      {
        name: "description",
        content:
          "Fatura atual, limite disponível, compras recentes e parcelas do seu cartão de crédito.",
      },
      { property: "og:title", content: "Cartão de Crédito — Órbita Finanças" },
      {
        property: "og:description",
        content: "Acompanhe fatura, limite e parcelas com clareza.",
      },
    ],
  }),
  component: CartaoCredito,
});

const abas = ["Compras recentes", "Parcelas", "Fatura", "Limite", "Histórico"];

const usoMensal = [
  { rotulo: "Abr", valor: 1520.8 },
  { rotulo: "Mai", valor: 2310.4 },
  { rotulo: "Jun", valor: 1687.9 },
  { rotulo: "Jul", valor: 2104.3 },
  { rotulo: "Ago", valor: 1842.5 },
];

function CartaoCredito() {
  const [aba, setAba] = useState(abas[0]);
  const usoLimite = ((cartao.limiteTotal - cartao.limiteDisponivel) / cartao.limiteTotal) * 100;

  return (
    <AppShell titulo="Cartão de Crédito" descricao="Sua fatura e seu limite em tempo real.">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
        {/* Cartão */}
        <div className="relative overflow-hidden rounded-3xl bg-primary-deep p-6 text-foreground">
          <div className="absolute -top-24 -right-16 h-56 w-56 rounded-full bg-primary/25" />
          <div className="relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[0.68rem] tracking-[0.16em] uppercase opacity-70">Cartão</p>
                <p className="mt-1 font-display text-lg font-semibold">{cartao.banco}</p>
              </div>
              <div className="flex gap-1.5">
                <span className="h-6 w-6 rounded-full bg-foreground/85" />
                <span className="-ml-3 h-6 w-6 rounded-full bg-foreground/40" />
              </div>
            </div>
            <p className="num mt-12 text-lg tracking-[0.2em]">{cartao.numero}</p>
            <div className="mt-6 flex items-end justify-between text-xs">
              <span className="opacity-80">{cartao.titular}</span>
              <span className="num opacity-80">Val. {cartao.validade}</span>
            </div>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Panel className="p-6">
            <Eyebrow>Fatura atual</Eyebrow>
            <p className="mt-4 text-2xl font-semibold sm:text-3xl">
              <Money valor={cartao.fatura} />
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Fechamento {cartao.fechamento}
            </p>
          </Panel>
          <Panel className="p-6">
            <Eyebrow>Vencimento</Eyebrow>
            <p className="num mt-4 text-2xl font-semibold sm:text-3xl">10/09</p>
            <div className="mt-4">
              <Badge tom="atencao">Vence em 4 dias</Badge>
            </div>
          </Panel>
          <Panel className="p-6 sm:col-span-2">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
              <div className="min-w-0">
                <Eyebrow>Limite disponível</Eyebrow>
                <p className="mt-4 text-2xl font-semibold text-primary sm:text-3xl">
                  <Money valor={cartao.limiteDisponivel} />
                </p>
              </div>
              <p className="num shrink-0 text-xs text-muted-foreground">
                de <Money valor={cartao.limiteTotal} />
              </p>
            </div>
            <ProgressBar valor={usoLimite} className="mt-5" />
            <p className="mt-3 text-xs text-muted-foreground">
              {usoLimite.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% do limite
              utilizado neste ciclo.
            </p>
          </Panel>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_1fr]">
        <Panel>
          <PanelHead titulo="Detalhes do cartão" descricao="Selecione o que deseja visualizar" />
          <div className="flex gap-1 overflow-x-auto px-5 pb-4 sm:px-6">
            {abas.map((a) => (
              <button
                key={a}
                onClick={() => setAba(a)}
                className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  a === aba ? "bg-primary/12 text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {a}
              </button>
            ))}
          </div>

          {aba === "Compras recentes" && (
            <ul className="divide-y divide-border border-t border-border">
              {comprasCartao.map((c) => (
                <li
                  key={c.descricao}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 sm:px-6"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{c.descricao}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {c.categoria} · {c.data}
                    </p>
                  </div>
                  <p className="num shrink-0 text-sm">
                    <Money valor={-c.valor} sinal />
                  </p>
                </li>
              ))}
            </ul>
          )}

          {aba === "Parcelas" && (
            <ul className="divide-y divide-border border-t border-border">
              {parcelas.map((p) => (
                <li key={p.descricao} className="px-5 py-4 sm:px-6">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{p.descricao}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Parcela {p.atual} de {p.total}
                      </p>
                    </div>
                    <p className="num shrink-0 text-sm">
                      <Money valor={p.valor} />
                    </p>
                  </div>
                  <ProgressBar valor={(p.atual / p.total) * 100} className="mt-3 h-1.5" />
                </li>
              ))}
            </ul>
          )}

          {aba === "Fatura" && (
            <div className="border-t border-border px-5 py-6 sm:px-6">
              <div className="space-y-4">
                {[
                  ["Compras do período", 1420.6],
                  ["Parcelas do mês", 619.7],
                  ["Estornos", -197.8],
                ].map(([rotulo, valor]) => (
                  <div key={rotulo as string} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{rotulo}</span>
                    <span className="num">
                      <Money valor={valor as number} />
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
                <span className="text-sm font-medium">Total da fatura</span>
                <span className="num text-lg font-semibold text-primary">
                  <Money valor={cartao.fatura} />
                </span>
              </div>
            </div>
          )}

          {aba === "Limite" && (
            <div className="border-t border-border px-5 py-6 sm:px-6">
              <p className="text-sm text-muted-foreground">
                Limite total de <Money valor={cartao.limiteTotal} />, com{" "}
                <Money valor={cartao.limiteDisponivel} /> disponíveis.
              </p>
              <ProgressBar valor={usoLimite} className="mt-5" />
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-background p-4">
                  <Eyebrow>Utilizado</Eyebrow>
                  <p className="num mt-3 text-lg font-semibold">
                    <Money valor={cartao.limiteTotal - cartao.limiteDisponivel} />
                  </p>
                </div>
                <div className="rounded-2xl bg-background p-4">
                  <Eyebrow>Disponível</Eyebrow>
                  <p className="num mt-3 text-lg font-semibold text-primary">
                    <Money valor={cartao.limiteDisponivel} />
                  </p>
                </div>
              </div>
            </div>
          )}

          {aba === "Histórico" && (
            <ul className="divide-y divide-border border-t border-border">
              {faturasHistorico.map((f) => (
                <li
                  key={f.mes}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 sm:px-6"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{f.mes}</p>
                    <div className="mt-1.5">
                      <StatusPill status={f.status} />
                    </div>
                  </div>
                  <p className="num shrink-0 text-sm">
                    <Money valor={f.valor} />
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel>
          <PanelHead titulo="Uso do cartão" descricao="Faturas dos últimos 5 meses" />
          <div className="px-5 pb-6 sm:px-6">
            <BarrasSimples dados={usoMensal} altura={150} />
            <p className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
              Média mensal de <Money valor={1893.18} /> nos últimos cinco ciclos.
            </p>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
