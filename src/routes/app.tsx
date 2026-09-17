import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { usePeriodoAtivo } from "@/lib/periodo";
import { PATENTES, getPatentePorNivel, EscudoPatente, PatenteInfo } from "@/lib/patentes";
import { CelebracaoPatenteModal } from "@/components/app/CelebracaoPatenteModal";
import {
  Trophy,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Shield,
  PiggyBank,
  TrendingUp,
  CreditCard,
  ChevronRight,
  Wallet,
  Clock,
  Check,
} from "lucide-react";
import { brl } from "@/lib/mock-data";
import {
  carregarDadosFinanceirosUsuario,
  calcularResumoFinanceiro,
  type ResumoFinanceiro,
  type CofrinhoItem,
} from "@/lib/financial-service";

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
    links: [
      {
        rel: "preload",
        as: "image",
        href: "/hero-banner.webp",
        type: "image/webp",
        // @ts-expect-error fetchpriority
        fetchpriority: "high",
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
  const { user, profile, refreshProfile } = useAuth();
  const periodo = usePeriodoAtivo();
  const [hoverDia, setHoverDia] = useState<number | null>(null);
  const [hoverMesComp, setHoverMesComp] = useState<number | null>(null);
  const [hoverMesRec, setHoverMesRec] = useState<number | null>(null);
  const [patenteCelebrar, setPatenteCelebrar] = useState<PatenteInfo | null>(null);

  // Estado financeiro real do usuário
  const [resumo, setResumo] = useState<ResumoFinanceiro>(() =>
    calcularResumoFinanceiro([], [], [], [])
  );
  const [cofrinhosLista, setCofrinhosLista] = useState<CofrinhoItem[]>([]);
  const [carregando, setCarregando] = useState(true);

  const nomeExibicao =
    profile?.preferred_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Usuário";

  const nivelAtual = profile?.patente_nivel || 0;
  const patenteAtual = getPatentePorNivel(nivelAtual);

  const [tipoConta, setTipoConta] = useState<"pessoal" | "empresa">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("organizai_tipo_conta") as "pessoal" | "empresa") || "pessoal";
    }
    return "pessoal";
  });
  const [dadosBrutos, setDadosBrutos] = useState<any>(null);

  // Ouve alterações no tipo de conta (Pessoal / Empresa)
  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail) {
        setTipoConta(e.detail);
      } else if (typeof window !== "undefined") {
        const stored = localStorage.getItem("organizai_tipo_conta") as "pessoal" | "empresa";
        if (stored) setTipoConta(stored);
      }
    };
    window.addEventListener("organizai_tipo_conta_sync", handler);
    return () => window.removeEventListener("organizai_tipo_conta_sync", handler);
  }, []);

  // Recalcula o resumo quando tipoConta, periodo ou dadosBrutos mudam
  useEffect(() => {
    if (!dadosBrutos) return;
    const res = calcularResumoFinanceiro(
      dadosBrutos.recebimentos || [],
      dadosBrutos.gastosFixos || [],
      dadosBrutos.gastosVariaveis || [],
      dadosBrutos.bancos || [],
      dadosBrutos.investimentos || [],
      dadosBrutos.cofrinhos || [],
      tipoConta,
      { mesIndex: periodo.mesIndex, ano: periodo.ano },
      dadosBrutos.comprasCartao || []
    );
    setResumo(res);
  }, [dadosBrutos, tipoConta, periodo.mesIndex, periodo.ano]);

  // Carrega e sincroniza dados financeiros do usuário
  useEffect(() => {
    if (!user?.id) return;

    let cancelado = false;

    const carregar = async () => {
      try {
        const dados = await carregarDadosFinanceirosUsuario(user.id);
        if (!cancelado) {
          setDadosBrutos(dados);
          const res = calcularResumoFinanceiro(
            dados.recebimentos || [],
            dados.gastosFixos || [],
            dados.gastosVariaveis || [],
            dados.bancos || [],
            dados.investimentos || [],
            dados.cofrinhos || [],
            tipoConta,
            { mesIndex: periodo.mesIndex, ano: periodo.ano },
            dados.comprasCartao || []
          );
          setResumo(res);
          setCofrinhosLista(dados.cofrinhos || []);
          setCarregando(false);
        }
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
      }
    };

    carregar();

    const handler = () => {
      carregar();
    };

    window.addEventListener("organizai_finance_sync", handler);
    window.addEventListener("storage", handler);

    return () => {
      cancelado = true;
      window.removeEventListener("organizai_finance_sync", handler);
      window.removeEventListener("storage", handler);
    };
  }, [user?.id, tipoConta, periodo.mesIndex, periodo.ano]);

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

  // KPI cards alimentados com os dados do usuário e do período ativo
  const kpiCards = [
    {
      rotulo: "TOTAL DE GASTOS",
      valor: brl(resumo.totalGastos),
      descricao: `Fixos ${brl(resumo.gastosFixosTotal)} + Var ${brl(resumo.gastosVariaveisTotal)}${
        resumo.faturaCartaoTotal > 0 ? ` + Cartão ${brl(resumo.faturaCartaoTotal)}` : ""
      }`,
      icone: "/icons/kpi/gastos@2x.png",
      bordaHover:
        "hover:border-[#d97736]/70 hover:shadow-[0_0_24px_rgba(217,119,54,0.22)] hover:bg-gradient-to-b hover:from-[#241a14] hover:to-[#131212]",
      sheenHover: "group-hover:from-amber-500/25",
    },
    {
      rotulo: "TOTAL DE RECEBIMENTOS",
      valor: brl(resumo.totalReceitas),
      descricao: `Entradas em ${periodo.rotuloExibicao}`,
      icone: "/icons/kpi/recebimentos@2x.png",
      bordaHover:
        "hover:border-emerald-500/70 hover:shadow-[0_0_24px_rgba(16,185,129,0.22)] hover:bg-gradient-to-b hover:from-[#13241b] hover:to-[#131212]",
      sheenHover: "group-hover:from-emerald-500/25",
    },
    {
      rotulo: "TOTAL PAGO",
      valor: brl(resumo.totalPago),
      descricao: `${resumo.percentualPago}% pago em ${periodo.mesTexto}`,
      icone: "/icons/kpi/total_pago@2x.png",
      bordaHover:
        "hover:border-teal-400/70 hover:shadow-[0_0_24px_rgba(45,212,191,0.22)] hover:bg-gradient-to-b hover:from-[#122323] hover:to-[#131212]",
      sheenHover: "group-hover:from-teal-400/25",
    },
    {
      rotulo: "FALTA PAGAR",
      valor: brl(resumo.faltaPagar),
      descricao: `Em ${periodo.rotuloExibicao}`,
      icone: "/icons/kpi/falta_pagar@2x.png",
      bordaHover:
        "hover:border-orange-500/70 hover:shadow-[0_0_24px_rgba(249,115,22,0.22)] hover:bg-gradient-to-b hover:from-[#261913] hover:to-[#131212]",
      sheenHover: "group-hover:from-orange-500/25",
    },
    {
      rotulo: "SALDO DISPONÍVEL",
      valor: brl(resumo.saldoDisponivel),
      descricao: "Todos os bancos",
      icone: "/icons/kpi/saldo@2x.png",
      bordaHover:
        "hover:border-amber-400/70 hover:shadow-[0_0_24px_rgba(251,191,36,0.22)] hover:bg-gradient-to-b hover:from-[#261c12] hover:to-[#131212]",
      sheenHover: "group-hover:from-amber-400/25",
    },
  ];

  // Cálculo da escala da Evolução do Saldo (30 dias)
  const saldosValores = resumo.evolucaoSaldoDiario.map((d) => d.saldo);
  const maxSaldoReal = Math.max(0, ...saldosValores);
  const minSaldoReal = Math.min(0, ...saldosValores);
  const tetoSaldo = maxSaldoReal > 0 ? Math.ceil(maxSaldoReal * 1.15) : 4;
  const pisoSaldo = minSaldoReal < 0 ? Math.floor(minSaldoReal * 1.15) : 0;
  const amplitudeSaldo = Math.max(tetoSaldo - pisoSaldo, 1);

  // 5 Linhas de grade para a evolução do saldo
  const passosEvolucao = [4, 3, 2, 1, 0].map((step) => {
    const val = pisoSaldo + (amplitudeSaldo * step) / 4;
    return val;
  });

  // Cálculo dos pontos SVG do gráfico de saldo
  const pontosSaldoSvg = useMemo(() => {
    return resumo.evolucaoSaldoDiario.map((d, idx) => {
      const x = ((idx + 0.5) / 30) * 100;
      const y = 100 - ((d.saldo - pisoSaldo) / amplitudeSaldo) * 100;
      return `${x.toFixed(2)},${Math.max(2, Math.min(98, y)).toFixed(2)}`;
    });
  }, [resumo.evolucaoSaldoDiario, pisoSaldo, amplitudeSaldo]);

  const saldoSvgPolyline = pontosSaldoSvg.join(" ");

  // Posição do hover do dia
  const diaHoverData = hoverDia
    ? resumo.evolucaoSaldoDiario.find((d) => d.dia === hoverDia)
    : null;
  const diaHoverSaldo = diaHoverData?.saldo ?? 0;
  const diaHoverYPct = Math.max(
    0,
    Math.min(100, 100 - ((diaHoverSaldo - pisoSaldo) / amplitudeSaldo) * 100)
  );

  // Escala para Comparativo Mensal (Despesas x Receitas)
  const maxComp = Math.max(
    10,
    ...resumo.comparativoMensal.map((m) => Math.max(m.receitas, m.despesas))
  );
  const tetoComp = Math.ceil(maxComp * 1.15);
  const passosComp = [4, 3, 2, 1, 0].map((step) => (tetoComp * step) / 4);

  // Escala para Recebimentos Mensal
  const recsValores = resumo.recebimentosMensal.map((r) => r.valor);
  const maxRecReal = Math.max(10, ...recsValores);
  const tetoRec = Math.ceil(maxRecReal * 1.15);

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

      {/* 1. Hero Banner de Boas-Vindas com Fluidez 3D (LCP Otimizado) */}
      <div className="relative min-h-[175px] sm:min-h-[190px] overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0d0d0d] shadow-xl">
        <picture>
          <source srcSet="/hero-banner.webp" type="image/webp" />
          <img
            src="/hero-banner.png"
            alt="Fluidez OrganizAI"
            width={1200}
            height={380}
            fetchPriority="high"
            decoding="async"
            className="absolute right-0 top-0 h-full w-full object-cover object-right pointer-events-none select-none"
          />
        </picture>

        <div className="relative z-10 flex h-full flex-col justify-center p-6 sm:p-8">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F97316]">
            ORGANIZAI
          </span>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Bem-vindo(a), {nomeExibicao} 👋
          </h2>
          <p className="mt-1 text-xs text-stone-400 sm:text-sm">
            Aqui está o resumo em tempo real das suas finanças.
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
                  Complete os 7 passos do onboarding para desbloquear sua 1ª Patente:{" "}
                  <strong>Organizador Aprendiz</strong>.
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

      {/* 3. Top 5 KPI Cards em Linha Horizontal */}
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
                  width={44}
                  height={44}
                  loading="lazy"
                  decoding="async"
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

      {/* 4. Grid Principal em 2 Colunas */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1.1fr)]">
        {/* COLUNA DA ESQUERDA */}
        <div className="space-y-4">
          {/* Card: Evolução do Saldo */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 sm:p-6 shadow-sm flex flex-col justify-between min-h-[280px]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400">Evolução do saldo</span>
                <span className="rounded-full bg-white/[0.06] border border-white/10 px-2 py-0.5 text-[10px] font-semibold text-[#F97316]">
                  {periodo.rotuloExibicao}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-white leading-tight mt-0.5">
                {brl(resumo.saldoDisponivel)}
              </h3>
            </div>

            {/* Gráfico de Linha do Saldo */}
            <div className="mt-4">
              <div className="relative h-44 w-full">
                {/* Linhas de Grade e Eixo Y */}
                <div className="flex h-full flex-col justify-between text-[10px] text-stone-500 pointer-events-none">
                  {passosEvolucao.map((valor, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="w-16 shrink-0 text-right font-mono text-[10px]">
                        {brl(valor)}
                      </span>
                      <div
                        className={cn(
                          "w-full",
                          idx === 4
                            ? "h-[2px] bg-[#F97316] shadow-sm shadow-orange-500/50"
                            : "h-px bg-white/[0.04]"
                        )}
                      />
                    </div>
                  ))}
                </div>

                {/* SVG dinâmico da Linha do Saldo */}
                <svg
                  className="pointer-events-none absolute inset-0 pl-16 h-full w-full overflow-visible z-10"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {/* Linha da Evolução */}
                  <polyline
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={saldoSvgPolyline}
                  />
                </svg>

                {/* Elementos Interativos de Hover */}
                {hoverDia !== null && (
                  <div className="pointer-events-none absolute inset-0 pl-16 z-20">
                    {/* Linha vertical branca suave */}
                    <div
                      className="absolute top-0 bottom-0 w-[1px] bg-white/40"
                      style={{
                        left: `${((hoverDia - 0.5) / 30) * 100}%`,
                      }}
                    />
                    {/* Ponto indicador com anel branco no valor */}
                    <div
                      className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F97316] ring-2 ring-white shadow-[0_0_10px_rgba(249,115,22,0.8)]"
                      style={{
                        left: `${((hoverDia - 0.5) / 30) * 100}%`,
                        top: `${diaHoverYPct}%`,
                      }}
                    />
                    {/* Tooltip Card flutuante escuro com borda suave */}
                    <div
                      className="absolute rounded-xl border border-white/15 bg-[#1a1a1a]/95 px-3.5 py-2.5 shadow-2xl backdrop-blur-md min-w-[120px]"
                      style={{
                        left: `clamp(65px, ${((hoverDia - 0.5) / 30) * 100}%, calc(100% - 65px))`,
                        top: diaHoverYPct > 50 ? "25%" : "70%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <span className="block font-bold text-white text-sm leading-tight">
                        Dia {hoverDia}
                      </span>
                      <span className="mt-1 block text-xs font-semibold text-[#F97316] whitespace-nowrap">
                        saldo : {brl(diaHoverSaldo)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Overlay de captura de hover para cada dia */}
                <div className="absolute inset-0 pl-16 flex z-30">
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
              <div className="mt-2 flex justify-between pl-16 text-[9px] text-stone-500">
                {diasMes.map((dia) => {
                  const isVisibleOnMobile = dia === 1 || dia % 5 === 0 || dia === 30 || hoverDia === dia;
                  return (
                    <span
                      key={dia}
                      className={cn(
                        "w-3 text-center transition-colors",
                        isVisibleOnMobile ? "block" : "hidden sm:block",
                        hoverDia === dia ? "text-white font-bold" : "text-stone-500"
                      )}
                    >
                      {dia}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card: Despesas x Receitas */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 sm:p-6 shadow-sm flex flex-col justify-between min-h-[280px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400">Despesas x Receitas</span>
                <span className="rounded-full bg-white/[0.06] border border-white/10 px-2 py-0.5 text-[10px] font-semibold text-stone-300">
                  {periodo.ano}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1.5 text-stone-400">
                  <span className="h-2.5 w-2.5 rounded-sm bg-[#10B981]" /> Receitas
                </span>
                <span className="flex items-center gap-1.5 text-stone-400">
                  <span className="h-2.5 w-2.5 rounded-sm bg-[#EF4444]" /> Despesas
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="relative h-44 w-full">
                {/* Linhas de Grade e Eixo Y */}
                <div className="flex h-full flex-col justify-between text-[10px] text-stone-500 pointer-events-none">
                  {passosComp.map((valor, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="w-16 shrink-0 text-right font-mono text-[10px]">
                        {brl(valor)}
                      </span>
                      <div className="h-px w-full bg-white/[0.04]" />
                    </div>
                  ))}
                </div>

                {/* Barras dinâmicas de cada mês */}
                <div className="absolute inset-0 pl-16 flex items-end justify-between gap-1 pointer-events-none z-10 pb-0.5">
                  {resumo.comparativoMensal.map((item, i) => {
                    const pctRec = tetoComp > 0 ? (item.receitas / tetoComp) * 100 : 0;
                    const pctDesp = tetoComp > 0 ? (item.despesas / tetoComp) * 100 : 0;

                    return (
                      <div key={item.mes} className="flex-1 flex items-end justify-center gap-1 h-full px-0.5">
                        {/* Barra Receita (Verde) */}
                        <div
                          style={{ height: `${Math.min(100, Math.max(pctRec > 0 ? 3 : 0, pctRec))}%` }}
                          className="w-full max-w-[10px] bg-emerald-500 rounded-t-sm shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-all duration-300"
                        />
                        {/* Barra Despesa (Vermelho) */}
                        <div
                          style={{ height: `${Math.min(100, Math.max(pctDesp > 0 ? 3 : 0, pctDesp))}%` }}
                          className="w-full max-w-[10px] bg-rose-500 rounded-t-sm shadow-[0_0_8px_rgba(244,63,94,0.3)] transition-all duration-300"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Elementos de Hover: Coluna destacada e Tooltip */}
                {hoverMesComp !== null && (
                  <div className="pointer-events-none absolute inset-0 pl-16 z-20">
                    <div
                      className="absolute top-0 bottom-0 bg-white/[0.08] rounded-t-md transition-all duration-75"
                      style={{
                        left: `${(hoverMesComp / 12) * 100}%`,
                        width: `${100 / 12}%`,
                      }}
                    />
                    {/* Tooltip flutuante */}
                    <div
                      className="absolute rounded-xl border border-white/15 bg-[#1a1a1a]/95 px-3.5 py-2.5 shadow-2xl backdrop-blur-md min-w-[140px]"
                      style={{
                        left: `clamp(75px, ${((hoverMesComp + 0.5) / 12) * 100}%, calc(100% - 75px))`,
                        top: "40%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <span className="block font-bold text-white text-sm leading-tight">
                        {mesesRotulos[hoverMesComp]} de {periodo.ano}
                      </span>
                      <span className="mt-1.5 block text-xs font-semibold text-[#f87171] whitespace-nowrap">
                        Despesas : {brl(resumo.comparativoMensal[hoverMesComp]?.despesas || 0)}
                      </span>
                      <span className="mt-0.5 block text-xs font-semibold text-[#34d399] whitespace-nowrap">
                        Receitas : {brl(resumo.comparativoMensal[hoverMesComp]?.receitas || 0)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Overlay de captura de hover para cada mês */}
                <div className="absolute inset-0 pl-16 flex z-30">
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
              <div className="mt-2 flex justify-between pl-16 text-[10px] text-stone-500">
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
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-stone-300">Gastos fixos ({periodo.mesTexto})</span>
                  <span className="text-[11px] text-stone-500">
                    ({resumo.gastosFixosLista.length} itens)
                  </span>
                </div>
                <span className="font-display text-sm font-bold text-white">
                  {brl(resumo.gastosFixosTotal)}
                </span>
              </div>

              {resumo.gastosFixosLista.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-xs text-stone-400">
                    Nenhum gasto fixo cadastrado ainda.
                  </p>
                  <Link
                    to="/gastos-fixos"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#F97316] hover:underline"
                  >
                    Cadastrar em Gastos Fixos
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="mt-3 divide-y divide-white/[0.04] max-h-56 overflow-y-auto pr-1">
                  {resumo.gastosFixosLista.slice(0, 6).map((g) => (
                    <div
                      key={g.id}
                      className="py-2.5 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-7 w-7 shrink-0 rounded-lg bg-white/[0.06] flex items-center justify-center text-stone-300">
                          <Wallet className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-white truncate">{g.nome}</p>
                          <p className="text-[11px] text-stone-400">
                            Vence dia {g.diaVenc} de {periodo.mesTexto} • {g.categoria}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-bold text-white font-mono">
                          {brl(g.valor)}
                        </span>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                            g.status === "Pago"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          )}
                        >
                          {g.status}
                        </span>
                      </div>
                    </div>
                  ))}

                  {resumo.gastosFixosLista.length > 6 && (
                    <div className="pt-2 text-center">
                      <Link
                        to="/gastos-fixos"
                        className="text-xs text-stone-400 hover:text-white transition-colors"
                      >
                        Ver todos os {resumo.gastosFixosLista.length} gastos fixos →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* COLUNA DA DIREITA */}
        <div className="space-y-4">
          {/* Card: Total de gastos por categoria */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/[0.06] bg-[#151515] p-5 sm:p-6 shadow-sm min-h-[260px]">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <span className="text-xs font-semibold text-stone-300">
                Gastos por categoria ({periodo.mesTexto})
              </span>
              <span className="text-xs font-bold text-white font-mono">
                {brl(resumo.totalGastos)}
              </span>
            </div>

            {resumo.gastosPorCategoria.length === 0 ? (
              <div className="my-auto py-8 text-center">
                <p className="text-xs text-stone-400">Sem gastos cadastrados em {periodo.rotuloExibicao}</p>
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                {resumo.gastosPorCategoria.slice(0, 5).map((cat) => (
                  <div key={cat.categoria} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-stone-200">{cat.categoria}</span>
                      <span className="font-mono text-stone-300">
                        {brl(cat.valor)}{" "}
                        <span className="text-stone-500">({cat.porcentagem}%)</span>
                      </span>
                    </div>
                    {/* Barra de progresso */}
                    <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, Math.max(2, cat.porcentagem))}%`,
                          backgroundColor: cat.cor,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card: Recebimentos por mês */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 sm:p-6 shadow-sm flex flex-col justify-between min-h-[250px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400">Recebimentos por mês</span>
                <span className="rounded-full bg-white/[0.06] border border-white/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
                  {periodo.ano}
                </span>
              </div>
              <span className="text-xs font-bold text-white font-mono">
                {brl(resumo.totalReceitas)}
              </span>
            </div>

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
                    <div
                      className="absolute top-0 bottom-0 w-[1px] bg-white/40"
                      style={{
                        left: `${(hoverMesRec / (mesesRecebimentos.length - 1)) * 100}%`,
                      }}
                    />
                    <div
                      className="absolute bottom-0 h-3 w-3 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#3B82F6] ring-2 ring-white shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                      style={{
                        left: `${(hoverMesRec / (mesesRecebimentos.length - 1)) * 100}%`,
                      }}
                    />
                    {/* Tooltip flutuante escuro com valor em azul */}
                    <div
                      className="absolute rounded-xl border border-white/10 bg-[#1a1a1a]/95 px-3.5 py-2.5 shadow-2xl backdrop-blur-md min-w-[120px]"
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
                        valor :{" "}
                        {brl(
                          resumo.recebimentosMensal.find(
                            (r) => r.mes === mesesRecebimentos[hoverMesRec]
                          )?.valor || 0
                        )}
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
          <Link
            to="/investimentos"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FF5E43] via-[#D83672] to-[#B0288E] p-5 sm:p-6 text-white shadow-lg shadow-pink-950/20 flex flex-col justify-between min-h-[120px] transition-transform hover:scale-[1.01]"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-white/90">
                  RENDIMENTO DE INVESTIMENTO
                </span>
                <ArrowRight className="h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="mt-1 font-display text-2xl font-bold tracking-tight text-white leading-tight">
                {brl(resumo.totalInvestido)}
              </h3>
              <p className="text-[11px] text-white/80">Capital aplicado na sua carteira</p>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs pt-1 border-t border-white/15">
              <span className="text-[11px] text-white/85">Rentabilidade estimada</span>
              <span className="font-bold text-white text-xs">
                {resumo.totalInvestido > 0 ? "12,5% a.a." : "0,0% a.a."}
              </span>
            </div>
          </Link>

          {/* Card: Cofrinhos */}
          {resumo.totalCofrinhos > 0 && cofrinhosLista.length > 0 ? (
            <Link
              to="/cofrinhos"
              className="group flex flex-col justify-between rounded-2xl border border-white/[0.06] bg-[#151515] p-5 sm:p-6 shadow-sm min-h-[185px] hover:border-white/15 transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-orange-500/15 flex items-center justify-center text-[#F97316]">
                      <PiggyBank className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-stone-300">Cofrinhos & Metas</h4>
                      <p className="text-[11px] text-stone-500">
                        {cofrinhosLista.length} meta(s) em andamento
                      </p>
                    </div>
                  </div>
                  <span className="font-display text-sm font-bold text-white">
                    {brl(resumo.totalCofrinhos)}
                  </span>
                </div>

                {/* Barra do Cofrinho Principal */}
                <div className="mt-4 space-y-2">
                  {cofrinhosLista.slice(0, 2).map((c) => {
                    const pct =
                      c.metaValor > 0
                        ? Math.min(100, Math.round((c.valorAtual / c.metaValor) * 100))
                        : 0;
                    return (
                      <div key={c.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-stone-300 font-medium truncate max-w-[140px]">
                            {c.titulo}
                          </span>
                          <span className="text-[11px] text-stone-400 font-mono">
                            {brl(c.valorAtual)} / {brl(c.metaValor)} ({pct}%)
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end text-xs text-[#F97316] font-semibold group-hover:underline gap-1">
                <span>Ver todos os cofrinhos</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ) : (
            /* Card: Cofrinhos Vazio */
            <Link
              to="/cofrinhos"
              className="group flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-[#151515] p-6 text-center shadow-sm min-h-[185px] hover:border-white/15 transition-all"
            >
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl overflow-hidden shadow-lg shadow-black/60 border border-white/[0.08] bg-[#1a1a1a] group-hover:scale-105 transition-transform">
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
                Crie sua primeira meta de poupança na aba Cofrinhos.
              </p>
            </Link>
          )}
        </div>
      </div>
    </AppShell>
  );
}
