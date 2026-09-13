import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { PATENTES, getPatentePorNivel, EscudoPatente, PatenteInfo } from "@/lib/patentes";
import { CelebracaoPatenteModal } from "@/components/app/CelebracaoPatenteModal";
import { Trophy, ArrowRight, CheckCircle2, Sparkles, Shield } from "lucide-react";

export const Route = createFileRoute("/app")({
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

const kpiCards = [
  {
    rotulo: "TOTAL DE GASTOS",
    valor: "R$ 0,00",
    descricao: "Fixos + variáveis",
    icone: "/icons/kpi/gastos@2x.png",
    bordaHover: "hover:border-[#d97736]/70 hover:shadow-[0_0_24px_rgba(217,119,54,0.22)] hover:bg-gradient-to-b hover:from-[#241a14] hover:to-[#131212]",
    sheenHover: "group-hover:from-amber-500/25",
  },
  {
    rotulo: "TOTAL DE RECEBIMENTOS",
    valor: "R$ 0,00",
    descricao: "Somatório do período",
    icone: "/icons/kpi/recebimentos@2x.png",
    bordaHover: "hover:border-emerald-500/70 hover:shadow-[0_0_24px_rgba(16,185,129,0.22)] hover:bg-gradient-to-b hover:from-[#13241b] hover:to-[#131212]",
    sheenHover: "group-hover:from-emerald-500/25",
  },
  {
    rotulo: "TOTAL PAGO",
    valor: "R$ 0,00",
    descricao: "0% das contas",
    icone: "/icons/kpi/total_pago@2x.png",
    bordaHover: "hover:border-teal-400/70 hover:shadow-[0_0_24px_rgba(45,212,191,0.22)] hover:bg-gradient-to-b hover:from-[#122323] hover:to-[#131212]",
    sheenHover: "group-hover:from-teal-400/25",
  },
  {
    rotulo: "FALTA PAGAR",
    valor: "R$ 0,00",
    descricao: "Este mês",
    icone: "/icons/kpi/falta_pagar@2x.png",
    bordaHover: "hover:border-orange-500/70 hover:shadow-[0_0_24px_rgba(249,115,22,0.22)] hover:bg-gradient-to-b hover:from-[#261913] hover:to-[#131212]",
    sheenHover: "group-hover:from-orange-500/25",
  },
  {
    rotulo: "SALDO DISPONÍVEL",
    valor: "R$ 0,00",
    descricao: "Todos os bancos",
    icone: "/icons/kpi/saldo@2x.png",
    bordaHover: "hover:border-amber-400/70 hover:shadow-[0_0_24px_rgba(251,191,36,0.22)] hover:bg-gradient-to-b hover:from-[#261c12] hover:to-[#131212]",
    sheenHover: "group-hover:from-amber-400/25",
  },
];

function Dashboard() {
  const { user, profile, refreshProfile } = useAuth();
  const [hoverDia, setHoverDia] = useState<number | null>(null);
  const [hoverMesComp, setHoverMesComp] = useState<number | null>(null);
  const [hoverMesRec, setHoverMesRec] = useState<number | null>(null);
  const [patenteCelebrar, setPatenteCelebrar] = useState<PatenteInfo | null>(null);

  const nomeExibicao =
    profile?.preferred_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Usuário";

  const nivelAtual = profile?.patente_nivel || 0;
  const patenteAtual = getPatentePorNivel(nivelAtual);

  // Listener para sincronizar alterações de patente
  useEffect(() => {
    const handler = () => {
      refreshProfile();
    };
    window.addEventListener("organizai_patente_sync", handler);
    return () => window.removeEventListener("organizai_patente_sync", handler);
  }, [refreshProfile]);

  // Celebração na primeira vez que abre o dashboard com nova patente
  useEffect(() => {
    if (!user?.id || !profile) return;
    if (nivelAtual > 0) {
      const storageKey = `organizai_patente_vista_${user.id}`;
      const vista = Number(localStorage.getItem(storageKey) || "0");
      if (nivelAtual > vista) {
        const info = getPatentePorNivel(nivelAtual);
        if (info) {
          setPatenteCelebrar(info);
        }
      }
    }
  }, [user?.id, profile, nivelAtual]);

  const handleFecharCelebracao = () => {
    if (user?.id && nivelAtual > 0) {
      localStorage.setItem(`organizai_patente_vista_${user.id}`, String(nivelAtual));
    }
    setPatenteCelebrar(null);
  };

  return (
    <AppShell>
      {/* Modal de Celebração de Nova Patente Conquistada */}
      {patenteCelebrar && (
        <CelebracaoPatenteModal
          patente={patenteCelebrar}
          nomeUsuario={nomeExibicao}
          onFechar={handleFecharCelebracao}
        />
      )}

      {/* 1. Hero Banner de Boas-Vindas com Fluidez 3D */}
      <div className="relative min-h-[175px] sm:min-h-[190px] overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0d0d0d] shadow-xl">
        {/* Imagem de Fundo com as Ondas Fluidas e Moedas 3D da Referência */}
        <img
          src="/hero-banner.png"
          alt="Fluidez OrganizAI"
          className="absolute right-0 top-0 h-full w-full object-cover object-right pointer-events-none select-none"
        />

        {/* Textos do Banner */}
        <div className="relative z-10 flex h-full flex-col justify-center p-6 sm:p-8">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F97316]">
            ORGANIZAI
          </span>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Bem-vindo(a), {nomeExibicao} 👋
          </h2>
          <p className="mt-1 text-xs text-stone-400 sm:text-sm">
            Aqui está o resumo das suas finanças.
          </p>
        </div>
      </div>

      {/* 2. Card de Patente Atual & Metas da Mentoria */}
      <div className="mt-4 rounded-3xl border border-white/[0.08] bg-gradient-to-r from-[#18151f] via-[#141416] to-[#121214] p-5 sm:p-6 shadow-xl relative overflow-hidden">
        {patenteAtual ? (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="shrink-0 transition-transform hover:scale-105 duration-200">
                <EscudoPatente nivel={patenteAtual.nivel} tamanho="md" />
              </div>

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                    Patente Atual
                  </span>
                  <span className="text-xs font-semibold text-stone-400">
                    Nível {patenteAtual.nivel} de 5
                  </span>
                </div>

                <h3 className="mt-1 font-display text-lg sm:text-xl font-bold text-white">
                  {patenteAtual.titulo}
                </h3>
                <p className="text-xs text-stone-300 mt-0.5 max-w-xl">
                  {patenteAtual.descricao}
                </p>

                {/* Pílulas de Conquistas Alcançadas */}
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  {patenteAtual.conquistas.map((c) => (
                    <span
                      key={c.id}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] border border-white/10 px-3 py-1 text-[11px] font-medium text-stone-200"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>{c.titulo}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <Link
              to="/perfil"
              className="group inline-flex items-center justify-center gap-2 self-start md:self-auto rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/10 px-4 py-2.5 text-xs font-semibold text-stone-200 hover:text-white transition-all shrink-0"
            >
              <span>Ver todas as Metas</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">
                    Primeiros Passos na Mentoria
                  </h4>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-stone-300">
                    Nível 0
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  Complete os 7 passos do onboarding para desbloquear sua 1ª Patente: <strong>Organizador Aprendiz</strong>.
                </p>
              </div>
            </div>

            <Link
              to="/perfil"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-orange-950/40 hover:brightness-110 transition-all shrink-0 self-start sm:self-auto"
            >
              <span>Conhecer as Metas</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* 2. Top 5 KPI Cards em Linha Horizontal */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {kpiCards.map((card) => (
          <div
            key={card.rotulo}
            className={cn(
              "group relative flex flex-col justify-between rounded-2xl p-4 sm:p-5 text-left transition-all duration-300 ease-out outline-none overflow-hidden cursor-default",
              "border border-white/[0.08] bg-[#151515]",
              "hover:-translate-y-1",
              card.bordaHover
            )}
          >
            {/* Feixe de luz suave superior acionado SOMENTE no hover */}
            <div
              className={cn(
                "pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-3/4 rounded-full blur-xl transition-opacity duration-300",
                "bg-gradient-to-b to-transparent opacity-0 group-hover:opacity-100",
                card.sheenHover
              )}
            />

            {/* Linha Superior: Rótulo e Cápsula com Ícone 3D */}
            <div className="relative z-10 flex items-start justify-between gap-2 w-full">
              <span className="text-[11px] font-semibold tracking-wider text-stone-400 uppercase">
                {card.rotulo}
              </span>

              {/* Cápsula escura circular com reflexo neon e ícone 3D */}
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-105 shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                <img
                  src={card.icone}
                  alt={card.rotulo}
                  className="h-full w-full object-cover select-none pointer-events-none"
                />
              </div>
            </div>

            {/* Linha Inferior: Valor e Descrição */}
            <div className="relative z-10 mt-3 sm:mt-4">
              <span className="font-display text-2xl sm:text-[1.7rem] font-bold tracking-tight text-white leading-none block">
                {card.valor}
              </span>
              <p className="mt-1.5 text-[11px] font-normal text-stone-400">
                {card.descricao}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Grid Principal em 2 Colunas */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1.1fr)]">
        {/* COLUNA DA ESQUERDA */}
        <div className="space-y-4">
          {/* Card: Evolução do Saldo */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 sm:p-6 shadow-sm flex flex-col justify-between min-h-[260px]">
            <div>
              <span className="text-xs text-stone-400">Evolução do saldo</span>
              <h3 className="font-display text-lg font-bold text-white leading-tight">R$ 0,00</h3>
            </div>

            {/* Gráfico de Linha do Saldo */}
            <div className="mt-4">
              <div className="relative h-44 w-full">
                {/* Linhas de Grade e Eixo Y */}
                <div className="flex h-full flex-col justify-between text-[10px] text-stone-500 pointer-events-none">
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

                {/* Elementos Interativos de Hover */}
                {hoverDia !== null && (
                  <div className="pointer-events-none absolute inset-0 pl-14 z-10">
                    {/* Linha vertical branca suave */}
                    <div
                      className="absolute top-0 bottom-0 w-[1px] bg-white/40"
                      style={{
                        left: `${((hoverDia - 0.5) / 30) * 100}%`,
                      }}
                    />
                    {/* Ponto indicador com anel branco no valor */}
                    <div
                      className="absolute bottom-0 h-3 w-3 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#F97316] ring-2 ring-white shadow-[0_0_8px_rgba(249,115,22,0.6)]"
                      style={{
                        left: `${((hoverDia - 0.5) / 30) * 100}%`,
                      }}
                    />
                    {/* Tooltip Card flutuante escuro com borda suave */}
                    <div
                      className="absolute rounded-xl border border-white/10 bg-[#1a1a1a]/95 px-3.5 py-2.5 shadow-2xl backdrop-blur-md min-w-[110px]"
                      style={{
                        left: `clamp(60px, ${((hoverDia - 0.5) / 30) * 100}%, calc(100% - 60px))`,
                        top: "40%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <span className="block font-bold text-white text-sm leading-tight">
                        {hoverDia}
                      </span>
                      <span className="mt-1 block text-xs font-semibold text-[#F97316] whitespace-nowrap">
                        saldo : R$ 0,00
                      </span>
                    </div>
                  </div>
                )}

                {/* Overlay de captura de hover para cada dia */}
                <div className="absolute inset-0 pl-14 flex z-20">
                  {diasMes.map((dia) => (
                    <div
                      key={dia}
                      onMouseEnter={() => setHoverDia(dia)}
                      onMouseLeave={() => setHoverDia(null)}
                      className="flex-1 h-full cursor-pointer"
                    />
                  ))}
                </div>
              </div>

              {/* Eixo X: Dias do Mês (1 a 30) */}
              <div className="mt-2 flex justify-between pl-14 text-[9px] text-stone-500">
                {diasMes.map((dia) => (
                  <span
                    key={dia}
                    className={cn(
                      "w-3 text-center transition-colors",
                      hoverDia === dia ? "text-white font-bold" : "text-stone-500"
                    )}
                  >
                    {dia}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card: Despesas x Receitas */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 sm:p-6 shadow-sm flex flex-col justify-between min-h-[250px]">
            <span className="text-xs text-stone-400">Despesas x Receitas</span>

            <div className="mt-4">
              <div className="relative h-44 w-full">
                {/* Linhas de Grade e Eixo Y */}
                <div className="flex h-full flex-col justify-between text-[10px] text-stone-500 pointer-events-none">
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

                {/* Elementos de Hover: Coluna destacada e Tooltip */}
                {hoverMesComp !== null && (
                  <div className="pointer-events-none absolute inset-0 pl-14 z-10">
                    {/* Faixa vertical cinza/branca translúcida exatamente como na referência */}
                    <div
                      className="absolute top-0 bottom-0 bg-white/20 rounded-t-sm transition-all duration-75"
                      style={{
                        left: `${(hoverMesComp / 12) * 100}%`,
                        width: `${100 / 12}%`,
                      }}
                    />
                    {/* Tooltip flutuante com Despesas e Receitas */}
                    <div
                      className="absolute rounded-xl border border-white/10 bg-[#1a1a1a]/95 px-3.5 py-2.5 shadow-2xl backdrop-blur-md min-w-[130px]"
                      style={{
                        left: `clamp(70px, ${((hoverMesComp + 0.5) / 12) * 100}%, calc(100% - 70px))`,
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <span className="block font-bold text-white text-sm leading-tight">
                        {mesesRotulos[hoverMesComp]}
                      </span>
                      <span className="mt-1 block text-xs font-medium text-[#f87171] whitespace-nowrap">
                        Despesas : R$ 0,00
                      </span>
                      <span className="mt-0.5 block text-xs font-medium text-[#34d399] whitespace-nowrap">
                        Receitas : R$ 0,00
                      </span>
                    </div>
                  </div>
                )}

                {/* Overlay de captura de hover para cada mês */}
                <div className="absolute inset-0 pl-14 flex z-20">
                  {mesesRotulos.map((m, i) => (
                    <div
                      key={m}
                      onMouseEnter={() => setHoverMesComp(i)}
                      onMouseLeave={() => setHoverMesComp(null)}
                      className="flex-1 h-full cursor-pointer"
                    />
                  ))}
                </div>
              </div>

              {/* Eixo X: Meses Jan a Dez */}
              <div className="mt-2 flex justify-between pl-14 text-[10px] text-stone-500">
                {mesesRotulos.map((m, i) => (
                  <span
                    key={m}
                    className={cn(
                      "w-6 text-center transition-colors",
                      hoverMesComp === i ? "text-white font-bold" : "text-stone-500"
                    )}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card: Gastos fixos do mês */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 sm:p-6 shadow-sm flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <span className="text-xs font-semibold text-stone-300">Gastos fixos do mês</span>
                <span className="font-display text-xs font-bold text-white">R$ 0,00</span>
              </div>
              <p className="mt-4 text-xs text-stone-400">
                Nenhum gasto fixo cadastrado ainda.
              </p>
            </div>
          </div>
        </div>

        {/* COLUNA DA DIREITA */}
        <div className="space-y-4">
          {/* Card: Total de gastos por categoria */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/[0.06] bg-[#151515] p-5 sm:p-6 shadow-sm min-h-[260px]">
            <span className="text-xs text-stone-400">Total de gastos por categoria</span>
            <div className="my-auto py-8 text-center">
              <p className="text-xs text-stone-400">Sem gastos cadastrados</p>
            </div>
          </div>

          {/* Card: Recebimentos por mês */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 sm:p-6 shadow-sm flex flex-col justify-between min-h-[250px]">
            <span className="text-xs text-stone-400">Recebimentos por mês</span>

            <div className="mt-4">
              <div className="relative h-36 w-full">
                <div className="flex h-full flex-col justify-between pointer-events-none">
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

                {/* Elementos de Hover: Guia vertical, Ponto em anel branco e Tooltip */}
                {hoverMesRec !== null && (
                  <div className="pointer-events-none absolute inset-0 z-10">
                    {/* Linha vertical branca */}
                    <div
                      className="absolute top-0 bottom-0 w-[1px] bg-white/40"
                      style={{
                        left: `${(hoverMesRec / (mesesRecebimentos.length - 1)) * 100}%`,
                      }}
                    />
                    {/* Ponto destacado com anel branco no valor */}
                    <div
                      className="absolute bottom-0 h-3 w-3 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#3B82F6] ring-2 ring-white shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                      style={{
                        left: `${(hoverMesRec / (mesesRecebimentos.length - 1)) * 100}%`,
                      }}
                    />
                    {/* Tooltip flutuante escuro com valor em azul */}
                    <div
                      className="absolute rounded-xl border border-white/10 bg-[#1a1a1a]/95 px-3.5 py-2.5 shadow-2xl backdrop-blur-md min-w-[110px]"
                      style={{
                        left: `clamp(65px, ${(hoverMesRec / (mesesRecebimentos.length - 1)) * 100}%, calc(100% - 65px))`,
                        top: "40%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <span className="block font-bold text-white text-sm leading-tight">
                        {mesesRecebimentos[hoverMesRec]}
                      </span>
                      <span className="mt-1 block text-xs font-semibold text-[#3B82F6] whitespace-nowrap">
                        valor : R$ 0,00
                      </span>
                    </div>
                  </div>
                )}

                {/* Overlay de captura de hover para cada mês */}
                <div className="absolute inset-0 flex z-20">
                  {mesesRecebimentos.map((m, i) => (
                    <div
                      key={m}
                      onMouseEnter={() => setHoverMesRec(i)}
                      onMouseLeave={() => setHoverMesRec(null)}
                      className="flex-1 h-full cursor-pointer"
                    />
                  ))}
                </div>
              </div>

              {/* Eixo X: Fev a Dez */}
              <div className="mt-2 flex justify-between text-[10px] text-stone-500">
                {mesesRecebimentos.map((m, i) => (
                  <span
                    key={m}
                    className={cn(
                      "w-5 text-center transition-colors",
                      hoverMesRec === i ? "text-white font-bold" : "text-stone-500"
                    )}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card: RENDIMENTO DE INVESTIMENTO (Gradiente Coral para Magenta) */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FF5E43] via-[#D83672] to-[#B0288E] p-5 sm:p-6 text-white shadow-lg shadow-pink-950/20 flex flex-col justify-between min-h-[120px]">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-white/90">
                RENDIMENTO DE INVESTIMENTO
              </span>
              <h3 className="mt-1 font-display text-2xl font-bold tracking-tight text-white leading-tight">
                R$ 0,00
              </h3>
              <p className="text-[11px] text-white/80">Ganhos acumulados na carteira</p>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs pt-1 border-t border-white/10">
              <span className="text-[11px] text-white/85">Rentabilidade média</span>
              <span className="font-bold text-white text-xs">0,0% a.a.</span>
            </div>
          </div>

          {/* Card: Cofrinhos Vazio */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-[#151515] p-6 text-center shadow-sm min-h-[185px]">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl overflow-hidden shadow-lg shadow-black/60 border border-white/[0.08] bg-[#1a1a1a]">
              <img
                src="/cofrinho-icon.png"
                alt="Cofrinhos"
                className="h-full w-full object-cover select-none pointer-events-none"
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
