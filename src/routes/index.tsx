import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Instagram,
  MessageCircle,
  ShieldCheck,
  ChevronRight,
  Mail,
  Target,
  Building2,
  LineChart,
  Scale,
  Headphones,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Natália Rodolfo — Links Oficiais & Plataforma OrganizAI" },
      {
        name: "description",
        content:
          "Educadora Financeira e Estrategista de Gestão. Conheça a IMER$ÃO EDUCAÇÃO FINANCEIRA PF e PJ, a plataforma OrganizAI e soluções financeiras.",
      },
      { property: "og:title", content: "Natália Rodolfo — Links Oficiais & OrganizAI" },
      {
        property: "og:description",
        content:
          "Educadora Financeira e Estrategista. Acesse a IMER$ÃO EDUCAÇÃO FINANCEIRA PF e PJ, plataforma OrganizAI e canais de contato.",
      },
      { property: "og:image", content: "/natalia-profile.jpg" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NataliaLinksPage,
});

function NataliaLinksPage() {
  const wppNumber = "5577981381477";

  // Links pré-digitados com mensagens diretas para cada serviço
  const mentoriaIndividualUrl = `https://wa.me/${wppNumber}?text=${encodeURIComponent(
    "Olá, Natália! Tenho interesse na Mentoria Individual em Educação Financeira. Ganho acima de R$ 5 mil e gostaria de entender como funciona a mentoria para organizar minha vida financeira e assumir o controle do meu dinheiro."
  )}`;

  const assistenteVirtualUrl = `https://wa.me/${wppNumber}?text=${encodeURIComponent(
    "Olá, Natália! Gostaria de mais informações sobre o Serviço de Assistente Virtual / Apoio Remoto para atendimento, gestão de agenda e rotinas do meu negócio ou consultório."
  )}`;

  const terceirizacaoFinanceiraUrl = `https://wa.me/${wppNumber}?text=${encodeURIComponent(
    "Olá, Natália! Gostaria de mais informações sobre a Terceirização Financeira Empresarial (BPO) para manter o financeiro da minha empresa organizado e focar no crescimento."
  )}`;

  const consultoriaPequenasEmpresasUrl = `https://wa.me/${wppNumber}?text=${encodeURIComponent(
    "Olá, Natália! Tenho interesse na Consultoria para Pequenas Empresas. Gostaria de uma orientação prática para organizar as finanças e melhorar a gestão do meu negócio."
  )}`;

  const recuperacaoFinanceiraUrl = `https://wa.me/${wppNumber}?text=${encodeURIComponent(
    "Olá, Natália! Gostaria de entender mais sobre a Recuperação Financeira Empresarial para reduzir a inadimplência e recuperar valores em aberto com soluções administrativas e suporte jurídico especializado."
  )}`;

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#080d0a] text-white selection:bg-emerald-500/25 selection:text-emerald-200 overflow-x-hidden font-sans">
      {/* Luzes de fundo elegantes — Verde Esmeralda & Dourado Suave */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden ios-hardware-accel">
        <div className="absolute -top-[130px] left-1/2 -translate-x-1/2 h-[420px] w-[640px] rounded-full bg-emerald-600/15 blur-[100px]" />
        <div className="absolute top-[160px] left-1/2 -translate-x-1/2 h-[200px] w-[300px] rounded-full bg-amber-400/10 blur-[90px]" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-emerald-950/20 blur-[110px]" />
      </div>

      {/* Conteúdo Principal — Max-w-md Mobile First */}
      <main className="relative z-10 mx-auto flex w-full max-w-[480px] flex-col items-center px-4.5 pt-12 pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] md:py-16">
        {/* 1. SEÇÃO DE PERFIL */}
        <header className="flex flex-col items-center text-center">
          {/* Avatar com moldura esmeralda e dourada */}
          <div className="group relative mb-4">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-emerald-500/35 via-amber-400/30 to-emerald-400/30 opacity-75 blur-md transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative flex h-28 w-28 md:h-32 md:w-32 items-center justify-center overflow-hidden rounded-full p-[2.5px] bg-gradient-to-b from-amber-400/70 via-emerald-950 to-emerald-600/50 ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <img
                src="/natalia-profile.jpg"
                alt="Natália Rodolfo"
                decoding="async"
                className="h-full w-full rounded-full object-cover object-top transition-transform duration-500 group-hover:scale-105 ios-hardware-accel"
              />
            </div>

            {/* Selo Oficial */}
            <div
              className="absolute bottom-0.5 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-stone-950 shadow-md ring-2 ring-[#080d0a]"
              title="Perfil Oficial"
            >
              <ShieldCheck className="h-3.5 w-3.5 stroke-[2.5]" />
            </div>
          </div>

          {/* Nome */}
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            Natália Rodolfo
          </h1>

          {/* Tagline */}
          <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-0.5 text-[0.725rem] font-medium tracking-wide text-emerald-300 backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>Educadora Financeira &amp; Estrategista</span>
          </div>

          {/* Bio Descritiva */}
          <p className="mt-3 w-full max-w-sm text-[0.875rem] leading-relaxed text-stone-300">
            Especialista em organização e inteligência financeira para pessoas físicas e jurídicas. Método, clareza e previsibilidade.
          </p>
        </header>

        {/* 2. LINKS PRINCIPAIS */}
        <section className="mt-7 flex w-full flex-col gap-3.5" aria-label="Links Principais">
          {/* DESTAQUE PRINCIPAL EXCLUSIVO: IMER$ÃO EDUCAÇÃO FINANCEIRA PF e PJ */}
          <Link
            to="/imersaoefpfj"
            className="group relative overflow-hidden rounded-2xl border-2 border-amber-400/50 bg-gradient-to-br from-[#0e2c1e]/95 via-[#081d14]/95 to-[#1c1404]/95 p-5 shadow-[0_8px_32px_rgba(245,158,11,0.20)] transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/85 hover:shadow-[0_12px_40px_rgba(245,158,11,0.32)] active:translate-y-0"
          >
            {/* Sheen de passagem dourado */}
            <div className="pointer-events-none absolute -left-full top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-amber-200/20 to-transparent skew-x-12 transition-all duration-1000 group-hover:left-[150%]" />

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-400 via-amber-500 to-emerald-500 text-stone-950 shadow-md shadow-amber-950/50">
                  <TrendingUp className="h-5 w-5 stroke-[2.4]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="inline-flex items-center gap-1 rounded-md bg-amber-400/20 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-amber-300 border border-amber-400/40">
                    <Sparkles className="h-2.5 w-2.5" />
                    <span>Destaque Oficial</span>
                  </div>
                  <h2 className="mt-1 text-[0.975rem] font-bold text-white leading-snug group-hover:text-amber-200 transition-colors">
                    IMER$ÃO EDUCAÇÃO FINANCEIRA PF e PJ
                  </h2>
                </div>
              </div>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 transition-all duration-300 group-hover:bg-amber-400 group-hover:text-stone-950 group-hover:scale-110">
                <ChevronRight className="h-5 w-5 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
            </div>

            <p className="mt-2.5 text-[0.825rem] leading-relaxed text-stone-300/90 sm:pl-14">
              O método definitivo para dominar o fluxo de caixa, separar as contas pessoais das empresariais e construir patrimônio sólido.
            </p>
          </Link>

          {/* ORGANIZAI — CARD COMPACTO E ELEGANTE (SEM DISPUTAR COM A IMERSÃO) */}
          <Link
            to="/app"
            className="group relative flex items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/45 hover:bg-emerald-950/20 active:translate-y-0"
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-[#102d1d] to-[#08170e] border border-emerald-500/30 p-2 shadow-sm group-hover:border-emerald-400/60 transition-colors">
                <img
                  src="/logo.png"
                  alt="OrganizAI"
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="flex flex-col text-left min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[0.925rem] font-semibold text-white group-hover:text-emerald-300 transition-colors">
                    OrganizAI
                  </span>
                  <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[0.625rem] font-medium text-emerald-300 border border-emerald-500/20">
                    Plataforma Oficial
                  </span>
                </div>
                <p className="text-[0.80rem] text-stone-300/80 leading-relaxed mt-0.5">
                  Acesse sua plataforma completa de controle orçamentário e gestão financeira.
                </p>
              </div>
            </div>

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.04] text-stone-400 border border-white/[0.06] transition-all duration-300 group-hover:border-emerald-500/30 group-hover:text-emerald-300 group-hover:bg-emerald-500/10">
              <ChevronRight className="h-4 w-4 stroke-[2.2] transition-transform duration-300 group-hover:translate-x-0.5" />
            </div>
          </Link>

          {/* DIVISOR: MENTORIAS & SOLUÇÕES */}
          <div className="my-1.5 flex items-center gap-2 px-1">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
            <span className="text-[0.675rem] font-bold uppercase tracking-wider text-emerald-400/90">
              Mentorias &amp; Soluções Financeiras
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
          </div>

          {/* SERVIÇO 1: MENTORIA INDIVIDUAL EM EDUCAÇÃO FINANCEIRA */}
          <a
            href={mentoriaIndividualUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col gap-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:bg-emerald-950/20 hover:shadow-[0_4px_24px_rgba(16,185,129,0.12)] active:translate-y-0"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-sm group-hover:bg-emerald-500/15 transition-colors">
                  <Target className="h-5 w-5 stroke-[2.2]" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[0.925rem] font-semibold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    Mentoria Individual em Educação Financeira
                  </span>
                  <div className="mt-0.5">
                    <span className="inline-block rounded bg-emerald-500/10 px-1.5 py-0.5 text-[0.625rem] font-medium text-emerald-300 border border-emerald-500/20">
                      Pessoa Física
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-stone-950 group-hover:scale-105"
                title="Conversar no WhatsApp"
              >
                <MessageCircle className="h-4 w-4 stroke-[2.2]" />
              </div>
            </div>

            <p className="text-[0.80rem] text-stone-300/85 leading-relaxed">
              Para quem ganha acima de R$ 5 mil e busca sair do vermelho, organizar a vida financeira e assumir o controle do dinheiro.
            </p>

            <div className="flex items-center gap-1 text-[0.72rem] font-medium text-emerald-400 group-hover:text-emerald-300 transition-colors pt-0.5">
              <span>Conversar sobre a mentoria no WhatsApp</span>
              <ArrowUpRight className="h-3 w-3 stroke-[2.2] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </a>

          {/* SERVIÇO 2: ASSISTENTE VIRTUAL (SEM O "NOVO", PADRONIZADO COM OS DEMAIS) */}
          <a
            href={assistenteVirtualUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col gap-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:bg-emerald-950/20 hover:shadow-[0_4px_24px_rgba(16,185,129,0.12)] active:translate-y-0"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-sm group-hover:bg-emerald-500/15 transition-colors">
                  <Headphones className="h-5 w-5 stroke-[2.2]" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[0.925rem] font-semibold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    Serviço de Assistente Virtual
                  </span>
                  <div className="mt-0.5">
                    <span className="inline-block rounded bg-emerald-500/10 px-1.5 py-0.5 text-[0.625rem] font-medium text-emerald-300 border border-emerald-500/20">
                      Apoio Remoto PJ
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-stone-950 group-hover:scale-105"
                title="Conversar no WhatsApp"
              >
                <MessageCircle className="h-4 w-4 stroke-[2.2]" />
              </div>
            </div>

            <p className="text-[0.80rem] text-stone-300/85 leading-relaxed">
              Atendimento no WhatsApp, agendamento de consultas e apoio administrativo com agilidade para consultórios, clínicas e pequenas empresas.
            </p>

            <div className="flex items-center gap-1 text-[0.72rem] font-medium text-emerald-400 group-hover:text-emerald-300 transition-colors pt-0.5">
              <span>Conversar sobre a assistente virtual no WhatsApp</span>
              <ArrowUpRight className="h-3 w-3 stroke-[2.2] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </a>

          {/* SERVIÇO 3: TERCEIRIZAÇÃO FINANCEIRA EMPRESARIAL */}
          <a
            href={terceirizacaoFinanceiraUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col gap-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:bg-emerald-950/20 hover:shadow-[0_4px_24px_rgba(16,185,129,0.12)] active:translate-y-0"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-sm group-hover:bg-emerald-500/15 transition-colors">
                  <Building2 className="h-5 w-5 stroke-[2.2]" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[0.925rem] font-semibold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    Terceirização Financeira Empresarial
                  </span>
                  <div className="mt-0.5">
                    <span className="inline-block rounded bg-emerald-500/10 px-1.5 py-0.5 text-[0.625rem] font-medium text-emerald-300 border border-emerald-500/20">
                      BPO Financeiro PJ
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-stone-950 group-hover:scale-105"
                title="Conversar no WhatsApp"
              >
                <MessageCircle className="h-4 w-4 stroke-[2.2]" />
              </div>
            </div>

            <p className="text-[0.80rem] text-stone-300/85 leading-relaxed">
              Gestão financeira completa da sua empresa para você manter as contas organizadas e focar nas vendas e no crescimento.
            </p>

            <div className="flex items-center gap-1 text-[0.72rem] font-medium text-emerald-400 group-hover:text-emerald-300 transition-colors pt-0.5">
              <span>Conversar sobre terceirização no WhatsApp</span>
              <ArrowUpRight className="h-3 w-3 stroke-[2.2] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </a>

          {/* SERVIÇO 4: CONSULTORIA PARA PEQUENAS EMPRESAS */}
          <a
            href={consultoriaPequenasEmpresasUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col gap-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:bg-emerald-950/20 hover:shadow-[0_4px_24px_rgba(16,185,129,0.12)] active:translate-y-0"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-sm group-hover:bg-emerald-500/15 transition-colors">
                  <LineChart className="h-5 w-5 stroke-[2.2]" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[0.925rem] font-semibold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    Consultoria para Pequenas Empresas
                  </span>
                  <div className="mt-0.5">
                    <span className="inline-block rounded bg-emerald-500/10 px-1.5 py-0.5 text-[0.625rem] font-medium text-emerald-300 border border-emerald-500/20">
                      Gestão Prática PJ
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-stone-950 group-hover:scale-105"
                title="Conversar no WhatsApp"
              >
                <MessageCircle className="h-4 w-4 stroke-[2.2]" />
              </div>
            </div>

            <p className="text-[0.80rem] text-stone-300/85 leading-relaxed">
              Orientação prática para estruturar processos, fluxo de caixa e melhorar a gestão e a lucratividade do seu negócio.
            </p>

            <div className="flex items-center gap-1 text-[0.72rem] font-medium text-emerald-400 group-hover:text-emerald-300 transition-colors pt-0.5">
              <span>Conversar sobre consultoria no WhatsApp</span>
              <ArrowUpRight className="h-3 w-3 stroke-[2.2] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </a>

          {/* SERVIÇO 5: RECUPERAÇÃO FINANCEIRA EMPRESARIAL */}
          <a
            href={recuperacaoFinanceiraUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col gap-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:bg-emerald-950/20 hover:shadow-[0_4px_24px_rgba(16,185,129,0.12)] active:translate-y-0"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-sm group-hover:bg-emerald-500/15 transition-colors">
                  <Scale className="h-5 w-5 stroke-[2.2]" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[0.925rem] font-semibold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    Recuperação Financeira Empresarial
                  </span>
                  <div className="mt-0.5">
                    <span className="inline-block rounded bg-emerald-500/10 px-1.5 py-0.5 text-[0.625rem] font-medium text-emerald-300 border border-emerald-500/20">
                      Suporte Jurídico &amp; Adm
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-stone-950 group-hover:scale-105"
                title="Conversar no WhatsApp"
              >
                <MessageCircle className="h-4 w-4 stroke-[2.2]" />
              </div>
            </div>

            <p className="text-[0.80rem] text-stone-300/85 leading-relaxed">
              Redução de inadimplência e recuperação de valores em aberto com soluções administrativas e suporte jurídico especializado.
            </p>

            <div className="flex items-center gap-1 text-[0.72rem] font-medium text-emerald-400 group-hover:text-emerald-300 transition-colors pt-0.5">
              <span>Conversar sobre recuperação no WhatsApp</span>
              <ArrowUpRight className="h-3 w-3 stroke-[2.2] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </a>

          {/* DIVISOR: CANAIS OFICIAIS */}
          <div className="my-1.5 flex items-center gap-2 px-1">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-[0.675rem] font-bold uppercase tracking-wider text-stone-400">
              Canais Oficiais &amp; Redes
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* LINK: Instagram (Cores originais da marca restauradas) */}
          <a
            href="https://www.instagram.com/nataliafinancas/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-500/40 hover:bg-gradient-to-r hover:from-purple-950/20 hover:to-pink-950/15 hover:shadow-[0_4px_24px_rgba(236,72,153,0.12)] active:translate-y-0"
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 text-white shadow-sm shadow-pink-950/30">
                <Instagram className="h-5 w-5 stroke-[2.2]" />
              </div>

              <div className="flex flex-col text-left min-w-0 flex-1">
                <span className="text-[0.925rem] font-semibold text-white group-hover:text-pink-300 transition-colors">
                  Instagram Oficial
                </span>
                <p className="text-[0.785rem] text-stone-400 leading-snug mt-0.5">
                  Conteúdos diários, análises financeiras e bastidores
                </p>
              </div>
            </div>

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.04] text-stone-400 border border-white/[0.06] transition-all duration-300 group-hover:border-pink-500/30 group-hover:text-pink-400 group-hover:bg-pink-500/10">
              <ArrowUpRight className="h-4 w-4 stroke-[2.2]" />
            </div>
          </a>

          {/* LINK: WhatsApp Oficial */}
          <a
            href="https://wa.me/5577981381477?text=Ol%C3%A1%2C%20Nat%C3%A1lia!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20a%20Imers%C3%A3o%20e%20mentorias."
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:bg-emerald-950/20 hover:shadow-[0_4px_24px_rgba(16,185,129,0.12)] active:translate-y-0"
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-sm shadow-emerald-950/30">
                <MessageCircle className="h-5 w-5 stroke-[2.2]" />
              </div>

              <div className="flex flex-col text-left min-w-0 flex-1">
                <span className="text-[0.925rem] font-semibold text-white group-hover:text-emerald-300 transition-colors">
                  Fale no WhatsApp
                </span>
                <p className="text-[0.785rem] text-stone-400 leading-snug mt-0.5">
                  Atendimento direto para dúvidas, mentorias e eventos
                </p>
              </div>
            </div>

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.04] text-stone-400 border border-white/[0.06] transition-all duration-300 group-hover:border-emerald-500/30 group-hover:text-emerald-400 group-hover:bg-emerald-500/10">
              <ArrowUpRight className="h-4 w-4 stroke-[2.2]" />
            </div>
          </a>

          {/* LINK: E-mail de Suporte (Cores originais da marca restauradas) */}
          <a
            href="mailto:suporte@nataliarodolfo.com.br"
            className="group relative flex items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-500/40 hover:bg-orange-950/20 hover:shadow-[0_4px_24px_rgba(249,115,22,0.12)] active:translate-y-0"
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-950/30">
                <Mail className="h-5 w-5 stroke-[2.2]" />
              </div>

              <div className="flex flex-col text-left min-w-0 flex-1">
                <span className="text-[0.925rem] font-semibold text-white group-hover:text-orange-300 transition-colors">
                  E-mail de Suporte
                </span>
                <p className="text-[0.785rem] text-stone-400 leading-snug mt-0.5">
                  suporte@nataliarodolfo.com.br
                </p>
              </div>
            </div>

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.04] text-stone-400 border border-white/[0.06] transition-all duration-300 group-hover:border-orange-500/30 group-hover:text-orange-400 group-hover:bg-orange-500/10">
              <ArrowUpRight className="h-4 w-4 stroke-[2.2]" />
            </div>
          </a>
        </section>

        {/* 3. RODAPÉ */}
        <footer className="mt-12 flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2 text-xs font-medium text-stone-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/70" />
            <span className="text-stone-300 font-semibold tracking-wide">
              Natália Rodolfo
            </span>
            <span className="text-stone-600">•</span>
            <span className="text-stone-400">Educação Financeira PF e PJ</span>
          </div>

          <p className="text-[0.725rem] text-stone-500 tracking-tight">
            &copy; {new Date().getFullYear()} Natália Rodolfo. Todos os direitos reservados.
          </p>
        </footer>
      </main>
    </div>
  );
}
