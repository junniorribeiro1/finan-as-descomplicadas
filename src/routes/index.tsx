import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import {
  Wallet,
  ArrowDownToLine,
  CheckCircle2,
  Clock,
  Landmark,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — OrganizAI" },
      {
        name: "description",
        content: "OrganizAI — Sua vida financeira simplificada.",
      },
      { property: "og:title", content: "Dashboard — OrganizAI" },
      {
        property: "og:description",
        content: "OrganizAI — Sua vida financeira simplificada.",
      },
    ],
  }),
  component: Dashboard,
});

const mesesRotulos = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

const mesesRecebimentos = [
  "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

const diasMes = Array.from({ length: 30 }, (_, i) => i + 1);

function Dashboard() {
  return (
    <AppShell>
      {/* 1. Hero Banner de Boas-Vindas */}
      <div className="relative min-h-[170px] sm:min-h-[190px] overflow-hidden rounded-3xl border border-white/[0.06] bg-[#121212] shadow-xl">
        {/* Imagem de Fundo 3D Luxo com Moedas e Ondas */}
        <img
          src="/hero-banner.jpg"
          alt="Finanças OrganizAI"
          className="absolute right-0 top-0 h-full w-full sm:w-[65%] object-cover object-center opacity-85"
        />
        {/* Degradê para fusão suave com o texto */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/90 sm:via-[#121212]/75 to-transparent" />

        {/* Textos do Banner */}
        <div className="relative z-10 flex h-full flex-col justify-center p-6 sm:p-8">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F97316]">
            ORGANIZAI
          </span>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Bem-vindo(a) 👋
          </h2>
          <p className="mt-1 text-xs text-stone-400 sm:text-sm">
            Aqui está o resumo das suas finanças.
          </p>
        </div>
      </div>

      {/* 2. Top 5 KPI Cards em Linha Horizontal */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {/* Card 1: TOTAL DE GASTOS */}
        <div className="relative flex flex-col justify-between rounded-2xl border border-white/[0.06] bg-[#151515] p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase">
              TOTAL DE GASTOS
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#221c17] text-orange-400 shadow-inner">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-xl font-bold tracking-tight text-white">
              R$ 0,00
            </span>
            <p className="mt-0.5 text-[11px] text-stone-400">Fixos + variáveis</p>
          </div>
        </div>

        {/* Card 2: TOTAL DE RECEBIMENTOS */}
        <div className="relative flex flex-col justify-between rounded-2xl border border-white/[0.06] bg-[#151515] p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase">
              TOTAL DE RECEBIMENTOS
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#16221a] text-emerald-400 shadow-inner">
              <ArrowDownToLine className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-xl font-bold tracking-tight text-white">
              R$ 0,00
            </span>
            <p className="mt-0.5 text-[11px] text-stone-400">Somatório do período</p>
          </div>
        </div>

        {/* Card 3: TOTAL PAGO */}
        <div className="relative flex flex-col justify-between rounded-2xl border border-white/[0.06] bg-[#151515] p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase">
              TOTAL PAGO
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#172221] text-teal-400 shadow-inner">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-xl font-bold tracking-tight text-white">
              R$ 0,00
            </span>
            <p className="mt-0.5 text-[11px] text-stone-400">0% das contas</p>
          </div>
        </div>

        {/* Card 4: FALTA PAGAR */}
        <div className="relative flex flex-col justify-between rounded-2xl border border-white/[0.06] bg-[#151515] p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase">
              FALTA PAGAR
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#241a1c] text-rose-400 shadow-inner">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-xl font-bold tracking-tight text-white">
              R$ 0,00
            </span>
            <p className="mt-0.5 text-[11px] text-stone-400">Este mês</p>
          </div>
        </div>

        {/* Card 5: SALDO DISPONÍVEL */}
        <div className="relative flex flex-col justify-between rounded-2xl border border-white/[0.06] bg-[#151515] p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase">
              SALDO DISPONÍVEL
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#262017] text-amber-400 shadow-inner">
              <Landmark className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-xl font-bold tracking-tight text-white">
              R$ 0,00
            </span>
            <p className="mt-0.5 text-[11px] text-stone-400">Todos os bancos</p>
          </div>
        </div>
      </div>

      {/* 3. Grid Principal em 2 Colunas */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1.1fr)]">
        {/* COLUNA DA ESQUERDA */}
        <div className="space-y-4">
          {/* Card: Evolução do Saldo */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm">
            <div>
              <span className="text-xs text-stone-400">Evolução do saldo</span>
              <h3 className="font-display text-lg font-bold text-white">R$ 0,00</h3>
            </div>

            {/* Gráfico de Linha do Saldo */}
            <div className="mt-4">
              <div className="relative h-44 w-full">
                {/* Linhas de Grade e Eixo Y */}
                <div className="flex h-full flex-col justify-between text-[10px] text-stone-500">
                  <div className="flex items-center gap-3">
                    <span className="w-11 shrink-0 text-right">R$ 4,00</span>
                    <div className="h-px w-full bg-white/[0.04]" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-11 shrink-0 text-right">R$ 3,00</span>
                    <div className="h-px w-full bg-white/[0.04]" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-11 shrink-0 text-right">R$ 2,00</span>
                    <div className="h-px w-full bg-white/[0.04]" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-11 shrink-0 text-right">R$ 1,00</span>
                    <div className="h-px w-full bg-white/[0.04]" />
                  </div>
                  <div className="relative flex items-center gap-3">
                    <span className="w-11 shrink-0 text-right">R$ 0,00</span>
                    {/* Linha Laranja no R$ 0,00 */}
                    <div className="h-[2px] w-full bg-[#F97316] shadow-sm shadow-orange-500/50" />
                  </div>
                </div>
              </div>

              {/* Eixo X: Dias do Mês (1 a 30) */}
              <div className="mt-2 flex justify-between pl-14 text-[9px] text-stone-500">
                {diasMes.map((dia) => (
                  <span key={dia} className="w-3 text-center">
                    {dia}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card: Despesas x Receitas */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm">
            <span className="text-xs text-stone-400">Despesas x Receitas</span>

            <div className="mt-4">
              <div className="relative h-40 w-full">
                <div className="flex h-full flex-col justify-between text-[10px] text-stone-500">
                  <div className="flex items-center gap-3">
                    <span className="w-11 shrink-0 text-right">R$ 4,00</span>
                    <div className="h-px w-full bg-white/[0.04]" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-11 shrink-0 text-right">R$ 3,00</span>
                    <div className="h-px w-full bg-white/[0.04]" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-11 shrink-0 text-right">R$ 2,00</span>
                    <div className="h-px w-full bg-white/[0.04]" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-11 shrink-0 text-right">R$ 1,00</span>
                    <div className="h-px w-full bg-white/[0.04]" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-11 shrink-0 text-right">R$ 0,00</span>
                    <div className="h-px w-full bg-white/[0.06]" />
                  </div>
                </div>
              </div>

              {/* Eixo X: Meses Jan a Dez */}
              <div className="mt-2 flex justify-between pl-14 text-[10px] text-stone-500">
                {mesesRotulos.map((m) => (
                  <span key={m} className="w-6 text-center">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card: Gastos fixos do mês */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
              <span className="text-xs font-semibold text-stone-300">Gastos fixos do mês</span>
              <span className="font-display text-xs font-bold text-white">R$ 0,00</span>
            </div>
            <p className="mt-4 text-xs text-stone-400">
              Nenhum gasto fixo cadastrado ainda.
            </p>
          </div>
        </div>

        {/* COLUNA DA DIREITA */}
        <div className="space-y-4">
          {/* Card: Total de gastos por categoria */}
          <div className="flex min-h-[200px] flex-col justify-between rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm">
            <span className="text-xs text-stone-400">Total de gastos por categoria</span>
            <div className="my-auto py-8 text-center">
              <p className="text-xs text-stone-400">Sem gastos cadastrados</p>
            </div>
          </div>

          {/* Card: Recebimentos por mês */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm">
            <span className="text-xs text-stone-400">Recebimentos por mês</span>

            <div className="mt-4">
              <div className="relative h-32 w-full">
                <div className="flex h-full flex-col justify-between">
                  <div className="h-px w-full bg-white/[0.04]" />
                  <div className="h-px w-full bg-white/[0.04]" />
                  <div className="h-px w-full bg-white/[0.04]" />
                  {/* Linha Azul com Bolinhas */}
                  <div className="relative flex items-center">
                    <div className="h-[2px] w-full bg-[#3B82F6]" />
                    <div className="absolute inset-0 flex justify-between">
                      {mesesRecebimentos.map((_, i) => (
                        <div
                          key={i}
                          className="h-2 w-2 -translate-y-[3px] rounded-full bg-[#3B82F6] ring-2 ring-[#151515]"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Eixo X: Fev a Dez */}
              <div className="mt-2 flex justify-between text-[10px] text-stone-500">
                {mesesRecebimentos.map((m) => (
                  <span key={m} className="w-5 text-center">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card: RENDIMENTO DE INVESTIMENTO (Gradiente Coral para Magenta) */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FF5E43] via-[#D83672] to-[#B0288E] p-5 text-white shadow-lg shadow-pink-950/20">
            <span className="text-[10px] font-black uppercase tracking-wider text-white/90">
              RENDIMENTO DE INVESTIMENTO
            </span>
            <h3 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">
              R$ 0,00
            </h3>
            <p className="text-[11px] text-white/80">Ganhos acumulados na carteira</p>

            <div className="mt-4 flex items-center justify-between text-xs pt-1">
              <span className="text-[11px] text-white/85">Rentabilidade média</span>
              <span className="font-bold text-white text-xs">0,0% a.a.</span>
            </div>
          </div>

          {/* Card: Cofrinhos Vazio */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-[#151515] p-6 text-center shadow-sm">
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl shadow-xl shadow-amber-950/30">
              <img
                src="/vault-empty.jpg"
                alt="Cofrinhos"
                className="h-full w-full object-cover"
              />
            </div>
            <h4 className="mt-3 text-sm font-semibold text-white">
              Nenhum cofrinho ainda
            </h4>
            <p className="mt-1 text-xs text-stone-400 max-w-xs">
              Crie sua primeira meta na aba Cofrinhos.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
