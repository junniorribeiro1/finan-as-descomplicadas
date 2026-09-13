import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Instagram,
  MessageCircle,
  ShieldCheck,
  ChevronRight,
  WalletCards,
  Award,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Natalia Rodolfo — Links Oficiais" },
      {
        name: "description",
        content:
          "Educadora Financeira e Estrategista de Gestão. Conheça a Imersão Educação Financeira PF e PJ, a plataforma OrganiAI e canais oficiais.",
      },
      { property: "og:title", content: "Natalia Rodolfo — Links Oficiais" },
      {
        property: "og:description",
        content:
          "Educadora Financeira e Estrategista. Acesse a Imersão Educação Financeira PF e PJ, plataforma OrganiAI e canais de contato.",
      },
      { property: "og:image", content: "/natalia-profile.jpg" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NataliaLinksPage,
});

function NataliaLinksPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#08090b] text-white selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden font-sans">
      {/* Luzes de fundo / Ambient Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Glow Superior Âmbar/Dourado suave */}
        <div className="absolute -top-[120px] left-1/2 -translate-x-1/2 h-[420px] w-[650px] rounded-full bg-gradient-to-b from-amber-500/15 via-orange-500/10 to-transparent blur-[110px]" />
        {/* Glow Esquerdo Sutil */}
        <div className="absolute top-[35%] -left-[180px] h-[360px] w-[360px] rounded-full bg-orange-600/5 blur-[120px]" />
        {/* Glow Inferior Violeta/Esmeralda Suave */}
        <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-purple-900/10 blur-[130px]" />
      </div>

      {/* Conteúdo Principal — Max-w-md Mobile First */}
      <main className="relative z-10 mx-auto flex w-full max-w-[480px] flex-col items-center px-5 py-12 md:py-16">
        {/* 1. SEÇÃO DE PERFIL */}
        <header className="flex flex-col items-center text-center">
          {/* Avatar com moldura dourada e brilho sutil */}
          <div className="group relative mb-5">
            {/* Anel de iluminação exterior */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-amber-500/40 via-orange-400/20 to-amber-200/50 opacity-75 blur-md transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative flex h-28 w-28 md:h-32 md:w-32 items-center justify-center overflow-hidden rounded-full p-[3px] bg-gradient-to-b from-amber-400/60 via-stone-800 to-amber-600/40 ring-1 ring-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <img
                src="/natalia-profile.jpg"
                alt="Natalia Rodolfo"
                className="h-full w-full rounded-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Selo de Verificado / Especialista */}
            <div
              className="absolute bottom-0 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950 shadow-md ring-2 ring-[#08090b]"
              title="Perfil Oficial"
            >
              <ShieldCheck className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>

          {/* Nome */}
          <h1 className="text-2xl md:text-[1.75rem] font-bold tracking-tight text-white font-display">
            Natalia Rodolfo
          </h1>

          {/* Tagline / Especialidade */}
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3.5 py-1 text-[0.75rem] font-semibold uppercase tracking-wider text-amber-300 backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>Educadora Financeira &amp; Estrategista</span>
          </div>

          {/* Bio Descritiva */}
          <p className="mt-3.5 max-w-[370px] text-[0.925rem] leading-relaxed text-stone-300 text-balance">
            Especialista em organização e inteligência financeira para pessoas
            físicas e jurídicas. Transformando sua relação com o dinheiro
            através de método, clareza e previsibilidade.
          </p>
        </header>

        {/* 2. LINKS PRINCIPAIS */}
        <section className="mt-8 flex w-full flex-col gap-3.5" aria-label="Links Oficiais">
          {/* LINK 1: DESTAQUE PRINCIPAL — Imersão Educação Financeira PF e PJ */}
          <Link
            to="/imersaoefpfj"
            className="group relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-br from-[#29170e]/95 via-[#1d120a]/90 to-[#130b06]/95 p-5 shadow-[0_4px_28px_rgba(245,158,11,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/80 hover:shadow-[0_8px_36px_rgba(245,158,11,0.3)] active:translate-y-0"
          >
            {/* Sheen animado / Brilho suave de passagem */}
            <div className="pointer-events-none absolute -left-full top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 transition-all duration-1000 group-hover:left-[150%]" />

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Ícone Destaque */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 text-stone-950 shadow-md shadow-amber-950/40">
                  <TrendingUp className="h-5 w-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 rounded-md bg-amber-400/15 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-amber-300 border border-amber-400/30">
                    <Sparkles className="h-2.5 w-2.5" />
                    <span>Destaque Oficial</span>
                  </div>
                  <h2 className="mt-1 text-base font-bold text-white leading-snug group-hover:text-amber-200 transition-colors">
                    Imersão Educação Financeira PF e PJ
                  </h2>
                </div>
              </div>

              {/* Botão de ação */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 transition-all duration-300 group-hover:bg-amber-400 group-hover:text-stone-950 group-hover:scale-110">
                <ChevronRight className="h-5 w-5 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
            </div>

            <p className="mt-2.5 text-[0.8rem] leading-relaxed text-stone-300/90 pl-14">
              O método definitivo para dominar o fluxo de caixa, separar as contas pessoais das empresariais e construir patrimônio sólido.
            </p>
          </Link>

          {/* LINK 2: OrganiAI (/app) */}
          <Link
            to="/app"
            className="group relative flex items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-500/50 hover:bg-white/[0.07] hover:shadow-[0_4px_24px_rgba(249,115,22,0.15)] active:translate-y-0"
          >
            <div className="flex items-center gap-3.5">
              {/* Logo/Ícone do OrganiAI */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-[#2a170d] to-[#150e09] border border-orange-500/30 shadow-sm group-hover:border-orange-500/60 transition-colors">
                <img
                  src="/logo.png"
                  alt="OrganiAI"
                  className="h-6 w-6 object-contain drop-shadow"
                />
              </div>

              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[0.925rem] font-semibold text-white group-hover:text-orange-300 transition-colors">
                    OrganiAI
                  </span>
                  <span className="rounded bg-orange-500/10 px-1.5 py-0.5 text-[0.625rem] font-medium text-orange-400 border border-orange-500/20">
                    App
                  </span>
                </div>
                <span className="text-[0.775rem] text-stone-400 line-clamp-1 mt-0.5">
                  Acesse sua plataforma completa de controle orçamentário
                </span>
              </div>
            </div>

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.04] text-stone-400 border border-white/[0.06] transition-all duration-300 group-hover:border-orange-500/30 group-hover:text-orange-400 group-hover:bg-orange-500/10">
              <ChevronRight className="h-4 w-4 stroke-[2.2] transition-transform duration-300 group-hover:translate-x-0.5" />
            </div>
          </Link>

          {/* LINK 3: Instagram */}
          <a
            href="https://instagram.com/nataliarodolfo"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-500/40 hover:bg-gradient-to-r hover:from-purple-950/20 hover:to-pink-950/15 hover:shadow-[0_4px_24px_rgba(236,72,153,0.12)] active:translate-y-0"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 text-white shadow-sm shadow-pink-950/30">
                <Instagram className="h-5 w-5 stroke-[2.2]" />
              </div>

              <div className="flex flex-col text-left">
                <span className="text-[0.925rem] font-semibold text-white group-hover:text-pink-300 transition-colors">
                  Instagram Oficial
                </span>
                <span className="text-[0.775rem] text-stone-400 line-clamp-1 mt-0.5">
                  Conteúdos diários, análises financeiras e bastidores
                </span>
              </div>
            </div>

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.04] text-stone-400 border border-white/[0.06] transition-all duration-300 group-hover:border-pink-500/30 group-hover:text-pink-400 group-hover:bg-pink-500/10">
              <ArrowUpRight className="h-4 w-4 stroke-[2.2]" />
            </div>
          </a>

          {/* LINK 4: WhatsApp */}
          <a
            href="https://wa.me/5511999999999?text=Ol%C3%A1%2C%20Natalia!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20a%20Imers%C3%A3o%20e%20mentorias."
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:bg-emerald-950/20 hover:shadow-[0_4px_24px_rgba(16,185,129,0.12)] active:translate-y-0"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-sm shadow-emerald-950/30">
                <MessageCircle className="h-5 w-5 stroke-[2.2]" />
              </div>

              <div className="flex flex-col text-left">
                <span className="text-[0.925rem] font-semibold text-white group-hover:text-emerald-300 transition-colors">
                  Fale no WhatsApp
                </span>
                <span className="text-[0.775rem] text-stone-400 line-clamp-1 mt-0.5">
                  Atendimento direto para dúvidas, mentorias e eventos
                </span>
              </div>
            </div>

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.04] text-stone-400 border border-white/[0.06] transition-all duration-300 group-hover:border-emerald-500/30 group-hover:text-emerald-400 group-hover:bg-emerald-500/10">
              <ArrowUpRight className="h-4 w-4 stroke-[2.2]" />
            </div>
          </a>
        </section>

        {/* 3. RODAPÉ */}
        <footer className="mt-12 flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2 text-xs font-medium text-stone-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500/70" />
            <span className="text-stone-300 font-semibold tracking-wide">
              Natalia Rodolfo
            </span>
            <span className="text-stone-600">•</span>
            <span className="text-stone-400">Educação Financeira PF e PJ</span>
          </div>

          <p className="text-[0.725rem] text-stone-500 tracking-tight">
            &copy; {new Date().getFullYear()} Natalia Rodolfo. Todos os direitos reservados.
          </p>
        </footer>
      </main>
    </div>
  );
}
