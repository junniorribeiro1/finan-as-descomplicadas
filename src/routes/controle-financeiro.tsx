import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import {
  Panel,
  PanelHead,
  Eyebrow,
  Money,
  StatusPill,
  Segmented,
  SelectPill,
} from "@/components/app/kit";
import { lancamentos, resumoMes } from "@/lib/mock-data";

export const Route = createFileRoute("/controle-financeiro")({
  head: () => ({
    meta: [
      { title: "Controle Financeiro — Órbita Finanças" },
      {
        name: "description",
        content:
          "Lançamentos do mês organizados por data, categoria, forma de pagamento e status de pagamento.",
      },
      { property: "og:title", content: "Controle Financeiro — Órbita Finanças" },
      {
        property: "og:description",
        content: "A evolução digital da planilha: seus lançamentos com clareza total.",
      },
    ],
  }),
  component: ControleFinanceiro,
});

const filtros = ["Todos", "Receitas", "Despesas", "Pagos", "Pendentes"];

export default function noop() {}

function ControleFinanceiro() {
  const [filtro, setFiltro] = useState("Todos");
  const [mes, setMes] = useState("Agosto");
  const [ano, setAno] = useState("2026");

  return (
    <AppShell
      titulo="Controle Financeiro"
      descricao="Todos os seus lançamentos em uma única visão."
    >
      <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <Eyebrow>Período</Eyebrow>
          <h2 className="mt-2 text-2xl font-semibold">
            {mes} de {ano}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <SelectPill
            valor={ano}
            onChange={setAno}
            opcoes={["2024", "2025", "2026"]}
            label="Ano"
          />
          <SelectPill
            valor={mes}
            onChange={setMes}
            label="Mês"
            opcoes={["Maio", "Junho", "Julho", "Agosto"]}
          />
          <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90">
            <Plus className="h-3.5 w-3.5" /> Novo lançamento
          </button>
        </div>
      </div>

      {/* Resumo */}
      <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-5">
        <Resumo rotulo="Receitas" valor={resumoMes.receitas} destaque />
        <Resumo rotulo="Despesas" valor={resumoMes.despesas} />
        <Resumo rotulo="Pagos" valor={2333.38} />
        <Resumo rotulo="Pendentes" valor={1450} />
        <Resumo rotulo="Saldo" valor={resumoMes.saldo} className="col-span-2 xl:col-span-1" />
      </div>

      <Panel className="mt-4">
        <PanelHead
          titulo="Lançamentos"
          descricao={`${lancamentos.length} registros em ${mes.toLowerCase()}`}
          acao={
            <div className="hidden items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground sm:flex">
              <Search className="h-3.5 w-3.5" />
              <input
                placeholder="Buscar lançamento"
                className="w-36 bg-transparent outline-none placeholder:text-subtle"
              />
            </div>
          }
        />
        <div className="px-5 pb-4 sm:px-6">
          <Segmented itens={filtros} ativo={filtro} onChange={setFiltro} className="w-full sm:w-auto" />
        </div>

        {/* Tabela desktop */}
        <div className="hidden border-t border-border lg:block">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[0.68rem] tracking-[0.12em] text-subtle uppercase">
                <th className="px-6 py-3 font-medium">Data</th>
                <th className="px-6 py-3 font-medium">Descrição</th>
                <th className="px-6 py-3 font-medium">Categoria</th>
                <th className="px-6 py-3 font-medium">Forma de pagamento</th>
                <th className="px-6 py-3 text-right font-medium">Valor</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border border-t border-border">
              {lancamentos.map((l) => (
                <tr key={l.descricao} className="transition-colors hover:bg-surface-2/50">
                  <td className="num px-6 py-4 text-xs text-muted-foreground">{l.data}</td>
                  <td className="px-6 py-4 text-sm font-medium">{l.descricao}</td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">{l.categoria}</td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">{l.pagamento}</td>
                  <td
                    className={`px-6 py-4 text-right text-sm ${l.valor > 0 ? "text-primary" : ""}`}
                  >
                    <Money valor={l.valor} sinal />
                  </td>
                  <td className="px-6 py-4">
                    <StatusPill status={l.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards mobile */}
        <ul className="divide-y divide-border border-t border-border lg:hidden">
          {lancamentos.map((l) => (
            <li key={l.descricao} className="px-5 py-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{l.descricao}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {l.categoria} · {l.pagamento}
                  </p>
                </div>
                <p className={`num shrink-0 text-sm ${l.valor > 0 ? "text-primary" : ""}`}>
                  <Money valor={l.valor} sinal />
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="num text-xs text-subtle">{l.data}</span>
                <StatusPill status={l.status} />
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </AppShell>
  );
}

function Resumo({
  rotulo,
  valor,
  destaque,
  className,
}: {
  rotulo: string;
  valor: number;
  destaque?: boolean;
  className?: string;
}) {
  return (
    <div className={`panel p-5 ${className ?? ""}`}>
      <Eyebrow>{rotulo}</Eyebrow>
      <p
        className={`mt-4 text-lg font-semibold sm:text-xl ${destaque ? "text-primary" : ""}`}
      >
        <Money valor={valor} />
      </p>
    </div>
  );
}
