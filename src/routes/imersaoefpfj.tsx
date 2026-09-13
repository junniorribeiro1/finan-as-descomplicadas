import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Calendar,
  Video,
  Award,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  Clock,
  Check,
  MessageCircle,
  Lock,
  Star,
  Flame,
  ArrowUpRight,
  BadgeCheck,
  Wallet,
  Building2,
  Layers,
} from "lucide-react";

export const Route = createFileRoute("/imersaoefpfj")({
  head: () => ({
    meta: [
      { title: "Imersão Educação Financeira PF e PJ — Natalia Rodolfo" },
      {
        name: "description",
        content:
          "Participe da Imersão Educação Financeira para Pessoas Física e Jurídica com Natalia Rodolfo. Aprenda a organizar suas finanças, sair do vermelho e ter fluxo de caixa previsível. 25 de Outubro, 100% ao vivo no Zoom.",
      },
      {
        property: "og:title",
        content: "Imersão Educação Financeira PF e PJ — Natalia Rodolfo",
      },
      {
        property: "og:description",
        content:
          "Método definitivo para organizar as contas pessoais e da sua empresa. 25 de Outubro ao vivo no Zoom com certificado oficial. Ingressos do Lote 1 por R$ 27,00.",
      },
      { property: "og:image", content: "/imersao-banner.png" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ImersaoPage,
});

export default function ImersaoPage() {
  // 1. WhatsApp link
  const wppNumber = "5577981381477";
  const defaultWppUrl = `https://wa.me/${wppNumber}?text=${encodeURIComponent(
    "Olá, Natalia! Gostaria de garantir minha vaga no 1º Lote (R$ 27,00) da Imersão Educação Financeira PF e PJ."
  )}`;
  const supportWppUrl = `https://wa.me/${wppNumber}?text=${encodeURIComponent(
    "Olá! Tenho uma dúvida sobre a Imersão Educação Financeira PF e PJ."
  )}`;

  // 2. Scroll progress indicator
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress =
        totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(currentProgress);

      if (window.scrollY > 500) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. Reveal-on-scroll with blur effect
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal-on-scroll");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // 4. Typewriter effect in Dobra 2
  const [typewriterText, setTypewriterText] = useState("");
  const fullText =
    "Você está prestes a transformar de vez a sua relação com o dinheiro pessoal e empresarial.";
  const typewriterRef = useRef<HTMLDivElement>(null);
  const [hasTyped, setHasTyped] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasTyped) {
          setHasTyped(true);
          let index = 0;
          const timer = setInterval(() => {
            if (index <= fullText.length) {
              setTypewriterText(fullText.slice(0, index));
              index++;
            } else {
              clearInterval(timer);
            }
          }, 30);
        }
      },
      { threshold: 0.25 }
    );

    if (typewriterRef.current) {
      observer.observe(typewriterRef.current);
    }

    return () => observer.disconnect();
  }, [hasTyped]);

  // 5. FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  // 6. Active Pricing Lot State
  const [selectedLot, setSelectedLot] = useState<1 | 2 | 3>(1);

  return (
    <div className="relative min-h-screen w-full bg-[#06080a] text-stone-100 selection:bg-amber-400 selection:text-stone-950 font-sans antialiased overflow-x-hidden">
      {/* ── CSS FOR REVEAL-ON-SCROLL BLUR EFFECT ── */}
      <style>{`
        .reveal-on-scroll {
          opacity: 0;
          filter: blur(12px);
          transform: translateY(28px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                      filter 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, filter, transform;
        }
        .reveal-on-scroll.is-revealed {
          opacity: 1;
          filter: blur(0px);
          transform: translateY(0);
        }
        .delay-100 { transition-delay: 0.1s; }
        .delay-200 { transition-delay: 0.2s; }
        .delay-300 { transition-delay: 0.3s; }

        @keyframes ticker-marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .ticker-track {
          display: flex;
          width: max-content;
          animation: ticker-marquee 32s linear infinite;
          will-change: transform;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* ── BARRA DE PROGRESSO DE SCROLL NO TOPO ── */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-amber-500 via-orange-400 to-emerald-400 z-50 transition-all duration-75 shadow-[0_0_12px_rgba(245,158,11,0.6)]"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* ── BACKGROUND NOISE & AURORAS ── */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.035] mix-blend-overlay bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="pointer-events-none fixed -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[90vw] max-w-[1200px] rounded-full bg-gradient-to-b from-amber-500/10 via-emerald-600/5 to-transparent blur-[140px]" />
      <div className="pointer-events-none fixed top-[35%] -left-40 h-[500px] w-[500px] rounded-full bg-amber-500/5 blur-[120px]" />
      <div className="pointer-events-none fixed top-[60%] -right-40 h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[120px]" />

      {/* ── 0. ANNOUNCEMENT TICKER MARQUEE (LOOP INFINITO: DIREITA -> ESQUERDA) ── */}
      <div className="relative z-40 w-full overflow-hidden bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 py-2.5 text-stone-950 shadow-md">
        <div className="ticker-track">
          {/* TRACK 1 */}
          <div className="flex shrink-0 items-center gap-6 whitespace-nowrap text-[0.72rem] md:text-xs font-black tracking-widest uppercase pr-6">
            <span className="flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 fill-stone-950 text-stone-950" />
              IMERSÃO EDUCAÇÃO FINANCEIRA PF E PJ - 1ª EDIÇÃO
            </span>
            <span>•</span>
            <span className="font-extrabold text-stone-900">
              25 DE OUTUBRO • 100% AO VIVO NO ZOOM
            </span>
            <span>•</span>
            <span className="rounded bg-stone-950 px-2 py-0.5 text-[0.65rem] font-bold text-amber-300">
              LOTE 1 ATIVO: R$ 27,00
            </span>
            <span>•</span>
            <span>VAGAS LIMITADAS COM CERTIFICAÇÃO OFICIAL</span>
            <span>•</span>
            <span>DOMINE SEU FLUXO DE CAIXA E SAIA DO VERMELHO</span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 fill-stone-950 text-stone-950" />
              IMERSÃO EDUCAÇÃO FINANCEIRA PF E PJ - 1ª EDIÇÃO
            </span>
            <span>•</span>
            <span className="font-extrabold text-stone-900">
              25 DE OUTUBRO • 100% AO VIVO NO ZOOM
            </span>
            <span>•</span>
            <span className="rounded bg-stone-950 px-2 py-0.5 text-[0.65rem] font-bold text-amber-300">
              LOTE 1 ATIVO: R$ 27,00
            </span>
            <span>•</span>
            <span>VAGAS LIMITADAS COM CERTIFICAÇÃO OFICIAL</span>
            <span>•</span>
            <span>DOMINE SEU FLUXO DE CAIXA E SAIA DO VERMELHO</span>
            <span>•</span>
          </div>

          {/* TRACK 2 (RÉPLICA IDÊNTICA PARA GARANTIR LOOP 100% PERFEITO SEM CORTE) */}
          <div
            className="flex shrink-0 items-center gap-6 whitespace-nowrap text-[0.72rem] md:text-xs font-black tracking-widest uppercase pr-6"
            aria-hidden="true"
          >
            <span className="flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 fill-stone-950 text-stone-950" />
              IMERSÃO EDUCAÇÃO FINANCEIRA PF E PJ - 1ª EDIÇÃO
            </span>
            <span>•</span>
            <span className="font-extrabold text-stone-900">
              25 DE OUTUBRO • 100% AO VIVO NO ZOOM
            </span>
            <span>•</span>
            <span className="rounded bg-stone-950 px-2 py-0.5 text-[0.65rem] font-bold text-amber-300">
              LOTE 1 ATIVO: R$ 27,00
            </span>
            <span>•</span>
            <span>VAGAS LIMITADAS COM CERTIFICAÇÃO OFICIAL</span>
            <span>•</span>
            <span>DOMINE SEU FLUXO DE CAIXA E SAIA DO VERMELHO</span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 fill-stone-950 text-stone-950" />
              IMERSÃO EDUCAÇÃO FINANCEIRA PF E PJ - 1ª EDIÇÃO
            </span>
            <span>•</span>
            <span className="font-extrabold text-stone-900">
              25 DE OUTUBRO • 100% AO VIVO NO ZOOM
            </span>
            <span>•</span>
            <span className="rounded bg-stone-950 px-2 py-0.5 text-[0.65rem] font-bold text-amber-300">
              LOTE 1 ATIVO: R$ 27,00
            </span>
            <span>•</span>
            <span>VAGAS LIMITADAS COM CERTIFICAÇÃO OFICIAL</span>
            <span>•</span>
            <span>DOMINE SEU FLUXO DE CAIXA E SAIA DO VERMELHO</span>
            <span>•</span>
          </div>
        </div>
      </div>

      {/* ── HEADER / TOPBAR (AUTÔNOMO DA IMERSÃO) ── */}
      <header className="relative z-30 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <a
          href="#"
          className="group flex items-center gap-3 transition-opacity hover:opacity-90"
          title="Imersão Educação Financeira PF e PJ"
        >
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-amber-500/40 bg-stone-900 p-0.5 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <img
              src="/natalia-profile.jpg"
              alt="Natalia Rodolfo"
              className="h-full w-full rounded-full object-cover object-center"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
              Natalia Rodolfo
            </span>
            <span className="text-[0.65rem] font-medium tracking-wider text-amber-400/90 uppercase">
              Educação Financeira PF & PJ
            </span>
          </div>
        </a>

        <div className="flex items-center gap-3">
          {/* Tag Data Live */}
          <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1.5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            </span>
            <span className="font-mono text-[0.7rem] font-bold tracking-wider text-emerald-300 uppercase">
              25 de Outubro • Ao Vivo
            </span>
          </div>

          <a
            href="#preco"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-2 text-xs font-black uppercase tracking-wider text-stone-950 shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all duration-300 hover:scale-105 hover:from-amber-400 hover:to-orange-400 active:scale-95"
          >
            <span>Garantir Vaga</span>
            <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
          </a>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════
          DOBRA 1 — HERO SECTION DE ALTO IMPACTO (SEM EXPERT LATERAL)
          Informações posicionadas mais abaixo, proporções refinadas
          e fundo limpo com o degradê natural
      ═══════════════════════════════════════════════ */}
      <section className="relative z-20 mx-auto w-full max-w-5xl px-5 pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-14 md:pb-20">
        <div className="flex flex-col items-start text-left gap-4">
          {/* TAGS DE EVENTO NO TOPO (CLEAN E COMPACTAS) */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/50 px-3 py-1 text-[0.68rem] sm:text-xs font-semibold text-emerald-300 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              </span>
              <Calendar className="h-3 w-3 text-emerald-400 ml-0.5" />
              <span>25 de Outubro</span>
              <span className="text-emerald-500/60">•</span>
              <Video className="h-3 w-3 text-emerald-400" />
              <span>Ao vivo no Zoom</span>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-[0.68rem] sm:text-xs font-semibold text-emerald-300 backdrop-blur-md shadow-[0_0_12px_rgba(16,185,129,0.15)]">
              <BadgeCheck className="h-3 w-3 text-emerald-400" />
              <span>Com Certificação</span>
            </div>
          </div>

          {/* TÍTULO PRINCIPAL — EDUCAÇÃO FINANCEIRA COM GRANDE DESTAQUE */}
          <div className="w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.8rem] xl:text-[4.2rem] font-black tracking-tight leading-[1.06] text-white">
              EDUCAÇÃO
              <span className="block bg-gradient-to-r from-[#ffe494] via-[#f59e0b] to-[#d97706] bg-clip-text text-transparent drop-shadow-[0_4px_28px_rgba(245,158,11,0.35)] mt-0.5">
                FINANCEIRA
              </span>
              <span className="block text-xs sm:text-sm md:text-base font-bold tracking-[0.14em] text-stone-300 uppercase mt-2.5">
                PARA PESSOAS FÍSICA E JURÍDICA
              </span>
            </h1>
          </div>

          {/* SUBTÍTULO CONCISO E ENXUTO */}
          <p className="text-xs sm:text-sm md:text-[0.95rem] font-normal leading-relaxed text-stone-300/80 max-w-lg">
            Aprenda a organizar seu dinheiro,{" "}
            <strong className="font-semibold text-white underline decoration-amber-400 decoration-2 underline-offset-4">
              sair do vermelho
            </strong>{" "}
            e construir uma vida financeira leve e consciente.
          </p>

          {/* 3 LOTES NO HERO (APENAS OS LOTES, SEM TEXTO SELECIONE) */}
          <div className="mt-1 w-full max-w-sm sm:max-w-md">
            <div className="grid grid-cols-3 gap-2">
              {/* Lote 1 Ativo - R$ 27,00 */}
              <button
                type="button"
                onClick={() => setSelectedLot(1)}
                className={`relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all text-center ${
                  selectedLot === 1
                    ? "border-amber-400 bg-amber-500/15 shadow-[0_0_16px_rgba(245,158,11,0.2)] ring-2 ring-amber-400/60"
                    : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
                }`}
              >
                <div className="absolute top-0 right-0 w-5 h-5 bg-amber-400/10 rounded-full blur-sm pointer-events-none" />
                <span className="font-mono text-[0.6rem] sm:text-[0.65rem] font-bold text-amber-400 uppercase tracking-widest mb-0.5">
                  LOTE 1
                </span>
                <span className="text-xs sm:text-sm font-black text-white tracking-tight leading-tight">
                  R$ 27,00
                </span>
                <span className="inline-flex items-center gap-1 text-[0.58rem] font-extrabold text-emerald-400 mt-0.5">
                  <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
                  Ativo
                </span>
              </button>

              {/* Lote 2 - R$ 57,00 */}
              <button
                type="button"
                onClick={() => setSelectedLot(2)}
                className={`relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all text-center opacity-75 ${
                  selectedLot === 2
                    ? "border-amber-400 bg-amber-500/15 ring-2 ring-amber-400/60 opacity-100"
                    : "border-white/10 bg-white/[0.02]"
                }`}
              >
                <span className="font-mono text-[0.6rem] sm:text-[0.65rem] font-medium text-stone-400 uppercase tracking-widest mb-0.5">
                  LOTE 2
                </span>
                <span className="text-xs sm:text-sm font-bold text-stone-300 tracking-tight leading-tight">
                  R$ 57,00
                </span>
                <span className="text-[0.58rem] text-stone-500 mt-0.5">
                  Em breve
                </span>
              </button>

              {/* Lote 3 - R$ 97,00 */}
              <button
                type="button"
                onClick={() => setSelectedLot(3)}
                className={`relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all text-center opacity-65 ${
                  selectedLot === 3
                    ? "border-amber-400 bg-amber-500/15 ring-2 ring-amber-400/60 opacity-100"
                    : "border-white/10 bg-white/[0.02]"
                }`}
              >
                <span className="font-mono text-[0.6rem] sm:text-[0.65rem] font-medium text-stone-400 uppercase tracking-widest mb-0.5">
                  LOTE 3
                </span>
                <span className="text-xs sm:text-sm font-bold text-stone-300 tracking-tight leading-tight">
                  R$ 97,00
                </span>
                <span className="text-[0.58rem] text-stone-500 mt-0.5">Final</span>
              </button>
            </div>
          </div>

          {/* BOTÕES DE AÇÃO HERO */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1 w-full max-w-sm sm:max-w-md">
            <a
              href={defaultWppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-orange-400 px-6 py-3 text-xs sm:text-sm font-extrabold text-stone-950 shadow-[0_4px_24px_rgba(245,158,11,0.3)] transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span>Garantir meu ingresso</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5] transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href="#modulos"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-xs sm:text-sm font-semibold text-stone-300 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white"
            >
              <span>Saiba mais</span>
              <ChevronDown className="h-4 w-4 text-stone-400" />
            </a>
          </div>

          {/* BARRA DE PROGRESSO DE VAGAS */}
          <div className="flex flex-col gap-1 w-full max-w-sm sm:max-w-md pt-0.5">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10 border border-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-400 shadow-[0_0_10px_#f59e0b] transition-all duration-1000"
                style={{ width: "94%" }}
              />
            </div>
            <div className="flex items-center justify-between text-[0.68rem] text-stone-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                94% das vagas preenchidas no 1º Lote
              </span>
              <span className="font-mono text-stone-500">Últimas vagas</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          DOBRA 2 — TYPEWRITER + TIMELINE DE TRANSFORMAÇÃO (COM BLUR IN EFFECT)
      ═══════════════════════════════════════════════ */}
      <section className="reveal-on-scroll relative z-20 mx-auto w-full max-w-5xl px-5 py-12 md:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 sm:p-10 md:p-14 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Efeito Typewriter */}
          <div ref={typewriterRef} className="text-center min-h-[5rem] mb-10">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              A Virada de Chave
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight max-w-3xl mx-auto">
              {typewriterText}
              <span className="inline-block w-1.5 h-6 bg-amber-400 ml-1 animate-pulse align-middle" />
            </h2>
          </div>

          {/* Timeline de 3 Passos */}
          <div className="relative max-w-3xl mx-auto flex flex-col gap-10 md:gap-12 before:absolute before:left-4 md:before:left-1/2 before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-amber-500 before:via-emerald-500 before:to-amber-500/20 before:-translate-x-1/2">
            {/* Passo 1 */}
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="md:w-1/2 md:text-right md:pr-10 pl-10 md:pl-0">
                <span className="font-mono text-xs font-bold text-amber-400 tracking-wider uppercase">
                  Fase 01
                </span>
                <h3 className="text-lg md:text-xl font-bold text-white mt-1">
                  Diagnóstico e Fim da Mistura e Saída do Vermelho e Construção de Reserva
                </h3>
                <p className="text-sm text-stone-300/80 mt-1 leading-relaxed">
                  Você vai mapear exatamente onde o dinheiro está vazando, erguer
                  o muro de separação entre as contas e traçar o plano prático
                  para eliminar dívidas e construir sua reserva.
                </p>
              </div>

              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-stone-950 border-2 border-amber-400 text-amber-300 shadow-[0_0_12px_#f59e0b] z-10">
                <span className="text-xs font-black">1</span>
              </div>

              <div className="hidden md:block md:w-1/2 md:pl-10" />
            </div>

            {/* Passo 2 */}
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="hidden md:block md:w-1/2 md:pr-10" />

              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-stone-950 border-2 border-emerald-400 text-emerald-300 shadow-[0_0_12px_#10b981] z-10">
                <span className="text-xs font-black">2</span>
              </div>

              <div className="md:w-1/2 md:text-left md:pl-10 pl-10">
                <span className="font-mono text-xs font-bold text-emerald-400 tracking-wider uppercase">
                  Fase 02
                </span>
                <h3 className="text-lg md:text-xl font-bold text-white mt-1">
                  Método de Fluxo e Gastos na Prática
                </h3>
                <p className="text-sm text-stone-300/80 mt-1 leading-relaxed">
                  Aprenda como manter um controle diário de 5 minutos, definindo
                  pró-labore real sem sufocar o caixa da sua empresa.
                </p>
              </div>
            </div>

            {/* Passo 3 */}
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="md:w-1/2 md:text-right md:pr-10 pl-10 md:pl-0">
                <span className="font-mono text-xs font-bold text-amber-400 tracking-wider uppercase">
                  Fase 03
                </span>
                <h3 className="text-lg md:text-xl font-bold text-white mt-1">
                  Saída do Vermelho & Construção de Reserva
                </h3>
                <p className="text-sm text-stone-300/80 mt-1 leading-relaxed">
                  Estratégia de estancamento de juros, negociação de dívidas e o
                  plano prático para blindar sua família contra imprevistos.
                </p>
              </div>

              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-stone-950 border-2 border-amber-400 text-amber-300 shadow-[0_0_12px_#f59e0b] z-10">
                <span className="text-xs font-black">3</span>
              </div>

              <div className="hidden md:block md:w-1/2 md:pl-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          DOBRA 3 — MÓDULOS DA IMERSÃO (COM BLUR IN EFFECT)
      ═══════════════════════════════════════════════ */}
      <section id="modulos" className="reveal-on-scroll relative z-20 mx-auto w-full max-w-7xl px-5 py-16 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
            Grade Curricular Completa
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            O que você vai dominar durante a Imersão
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-400">
            Conteúdo direto ao ponto, 100% prático e aplicável logo no primeiro
            dia, sem teorias complexas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Módulo 1 */}
          <div className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/40 hover:bg-amber-950/10 hover:shadow-[0_10px_30px_rgba(245,158,11,0.1)]">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider">
                Módulo 01
              </span>
              <Building2 className="h-5 w-5 text-amber-400/80 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
              A Separação Cirúrgica entre PF e PJ
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-stone-400 leading-relaxed">
              O erro nº 1 que quebra negócios promissores: usar o CNPJ como caixa
              eletrônico do CPF. Você vai aprender a criar contas espelhadas,
              estabelecer pró-labore e nunca mais misturar boletos.
            </p>
          </div>

          {/* Módulo 2 */}
          <div className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/40 hover:bg-emerald-950/10 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)]">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Módulo 02
              </span>
              <ShieldCheck className="h-5 w-5 text-emerald-400/80 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
              Plano de Ataque para Sair do Vermelho
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-stone-400 leading-relaxed">
              Táticas comprovadas de renegociação bancária, ordenação de dívidas
              pelo custo efetivo total e estancamento de cheque especial e cartão
              de crédito.
            </p>
          </div>

          {/* Módulo 3 */}
          <div className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/40 hover:bg-amber-950/10 hover:shadow-[0_10px_30px_rgba(245,158,11,0.1)]">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider">
                Módulo 03
              </span>
              <BarChart3 className="h-5 w-5 text-amber-400/80 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
              Fluxo de Caixa com Previsibilidade
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-stone-400 leading-relaxed">
              Como antecipar as entradas e saídas dos próximos 30, 60 e 90 dias.
              Chega de surpresas desagradáveis no fim do mês: saiba quanto vai
              sobrar antes de começar a gastar.
            </p>
          </div>

          {/* Módulo 4 */}
          <div className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/40 hover:bg-emerald-950/10 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)]">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Módulo 04
              </span>
              <Layers className="h-5 w-5 text-emerald-400/80 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
              Orçamento Inteligente & Ferramentas
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-stone-400 leading-relaxed">
              Apresentação de ferramentas práticas e do Aplicativo OrganizAI
              para organizar seus registros financeiros com agilidade sem tomar
              horas do seu dia.
            </p>
          </div>

          {/* Módulo 5 */}
          <div className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/40 hover:bg-amber-950/10 hover:shadow-[0_10px_30px_rgba(245,158,11,0.1)]">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider">
                Módulo 05
              </span>
              <Wallet className="h-5 w-5 text-amber-400/80 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
              Construção da Reserva de Emergência
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-stone-400 leading-relaxed">
              O cálculo exato do seu colchão de segurança pessoal e empresarial.
              Onde deixar o dinheiro rendendo acima da inflação com 100% de
              liquidez imediata.
            </p>
          </div>

          {/* Módulo 6 */}
          <div className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/40 hover:bg-emerald-950/10 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)]">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Módulo 06
              </span>
              <TrendingUp className="h-5 w-5 text-emerald-400/80 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
              Decisões Conscientes & Multiplicação
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-stone-400 leading-relaxed">
              Planejamento de investimentos para quem já equilibrou as contas e
              deseja fazer o patrimônio crescer de forma sustentável para o
              futuro dos filhos e aposentadoria.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          DOBRA 4 — O DIAGNÓSTICO REAL (COM BLUR IN EFFECT)
      ═══════════════════════════════════════════════ */}
      <section className="reveal-on-scroll relative z-20 mx-auto w-full max-w-7xl px-5 py-16 md:px-8">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#12161f] via-[#0b0e14] to-[#07080a] p-8 md:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red-400">
                Chega de Angústia
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Você trabalha duro o mês inteiro, mas o dinheiro nunca parece
                sobrar?
              </h2>
              <p className="mt-4 text-stone-300 text-sm sm:text-base leading-relaxed">
                A verdade que ninguém te conta:{" "}
                <strong className="text-white">
                  ganhar mais dinheiro não resolve desorganização financeira
                </strong>
                . Se o fluxo estiver furado, mais faturamento só gera contas
                maiores.
              </p>

              <div className="mt-6 border-l-4 border-amber-400 pl-4 py-1">
                <p className="font-mono text-xs sm:text-sm text-amber-300 tracking-wide uppercase">
                  "O maior risco financeiro de uma família ou empresa não é a
                  crise, é a falta de método para administrar o que entra todo
                  mês."
                </p>
              </div>

              <div className="mt-8">
                <a
                  href="#preco"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-3.5 text-xs font-black uppercase tracking-wider text-stone-950 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all hover:scale-105"
                >
                  <span>Quero Mudar Minha Realidade</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Comparativo Antes vs Depois */}
            <div className="flex flex-col gap-3">
              <div className="rounded-2xl border border-red-500/20 bg-red-950/15 p-5">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                  Sem o Método da Imersão
                </span>
                <ul className="mt-2.5 flex flex-col gap-2 text-xs sm:text-sm text-stone-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">✕</span>
                    Mistura diária de boletos pessoais e empresariais no mesmo app
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">✕</span>
                    Dívidas acumulando juros sem estratégia clara de quitação
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">✕</span>
                    Sensação constante de insegurança caso ocorra uma emergência
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 shadow-[0_4px_24px_rgba(16,185,129,0.1)]">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Com a Imersão de Natalia Rodolfo
                </span>
                <ul className="mt-2.5 flex flex-col gap-2 text-xs sm:text-sm text-stone-200">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    Contas PF e PJ 100% isoladas com pró-labore definido
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    Cronograma de saída das dívidas e recomposição de margem
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    Paz de espírito, noites de sono tranquilas e reserva crescendo
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          DOBRA 5 — BÔNUS EXCLUSIVOS (AURORA CARD COM BLUR IN EFFECT)
      ═══════════════════════════════════════════════ */}
      <section className="reveal-on-scroll relative z-20 mx-auto w-full max-w-5xl px-5 py-12 md:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-[#1a120b] via-[#0d0a06] to-[#070503] p-8 md:p-14 shadow-[0_20px_60px_rgba(245,158,11,0.15)]">
          {/* Luzes de Aurora de Fundo */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-amber-500/20 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-[90px]" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/15 px-3.5 py-1 text-xs font-bold text-amber-300 uppercase tracking-wider mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Bônus Exclusivo da 1ª Edição</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white max-w-xl">
              Acesso Exclusivo ao App OrganizAI
            </h2>
            <p className="mt-3 text-sm sm:text-base text-stone-300 max-w-2xl leading-relaxed">
              Você não vai sair da imersão apenas com anotações e teoria. Você
              receberá o acesso ao nosso App OrganizAI, a plataforma
              completa de inteligência e gestão para organizar suas finanças
              pessoais e jurídicas com máxima praticidade.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 p-3">
                <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
                <span className="text-xs sm:text-sm text-stone-200">
                  Aplicativo com Separação Prática PF vs PJ
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 p-3">
                <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
                <span className="text-xs sm:text-sm text-stone-200">
                  Painel de Fluxo de Caixa e Controle de Gastos
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 p-3">
                <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
                <span className="text-xs sm:text-sm text-stone-200">
                  Módulo de Metas, Diagnóstico & Pró-labore
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 p-3">
                <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
                <span className="text-xs sm:text-sm text-stone-200">
                  Comunidade Exclusiva de Alunos e Suporte
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 pt-6 border-t border-white/10">
              <span className="font-mono text-xs text-stone-500 line-through uppercase">
                Vendido separadamente por R$ 197,00
              </span>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3.5 py-1 text-xs font-bold text-emerald-300">
                100% Gratuito para Inscritos no Lote 1
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          DOBRA 6 — CRONOGRAMA DA IMERSÃO (25 DE OUTUBRO)
      ═══════════════════════════════════════════════ */}
      <section id="cronograma" className="reveal-on-scroll relative z-20 mx-auto w-full max-w-5xl px-5 py-16 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2">
            <Clock className="h-3.5 w-3.5" />
            <span>25 de Outubro • Cronograma Oficial</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Uma tarde inteira focada no seu futuro financeiro
          </h2>
          <p className="mt-2 text-sm text-stone-400">
            Encontro ao vivo via Zoom com tempo para perguntas, exercícios e
            acompanhamento prático.
          </p>
        </div>

        <div className="flex flex-col gap-3 max-w-2xl mx-auto">
          {/* 13h00 */}
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-amber-500/30 hover:bg-white/[0.04]">
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm font-bold text-amber-400">
                13h00
              </span>
              <span className="text-sm font-semibold text-white">
                Abertura & Raio-X Financeiro (Diagnóstico Real)
              </span>
            </div>
            <span className="text-[0.65rem] font-bold text-stone-500 uppercase tracking-wider">
              Abertura
            </span>
          </div>

          {/* 14h30 */}
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-amber-500/30 hover:bg-white/[0.04]">
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm font-bold text-amber-400">
                14h30
              </span>
              <span className="text-sm font-semibold text-white">
                O Muro de Separação: Descomplicando PF e PJ
              </span>
            </div>
            <span className="text-[0.65rem] font-bold text-stone-500 uppercase tracking-wider">
              Tarde
            </span>
          </div>

          {/* 15h30 */}
          <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] p-4 opacity-70">
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm font-bold text-stone-400">
                15h30
              </span>
              <span className="text-sm font-medium text-stone-300">
                Intervalo para Café
              </span>
            </div>
            <span className="text-[0.65rem] font-bold text-stone-500 uppercase tracking-wider">
              Pausa
            </span>
          </div>

          {/* 15h45 */}
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-emerald-500/30 hover:bg-white/[0.04]">
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm font-bold text-emerald-400">
                15h45
              </span>
              <span className="text-sm font-semibold text-white">
                Mão na Massa: Fluxo de Caixa, Ferramentas & Pró-labore
              </span>
            </div>
            <span className="text-[0.65rem] font-bold text-stone-500 uppercase tracking-wider">
              Tarde
            </span>
          </div>

          {/* 16h45 */}
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-emerald-500/30 hover:bg-white/[0.04]">
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm font-bold text-emerald-400">
                16h45
              </span>
              <span className="text-sm font-semibold text-white">
                Plano de Saída do Vermelho & Reserva de Emergência
              </span>
            </div>
            <span className="text-[0.65rem] font-bold text-stone-500 uppercase tracking-wider">
              Tarde
            </span>
          </div>

          {/* 17h30 */}
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-amber-500/30 hover:bg-white/[0.04]">
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm font-bold text-amber-400">
                17h30
              </span>
              <span className="text-sm font-semibold text-white">
                Sessão de Mentorias, Dúvidas ao Vivo & Conclusão
              </span>
            </div>
            <span className="text-[0.65rem] font-bold text-stone-500 uppercase tracking-wider">
              Encerramento
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          DOBRA 7 — PARA QUEM É A IMERSÃO?
      ═══════════════════════════════════════════════ */}
      <section className="reveal-on-scroll relative z-20 mx-auto w-full max-w-7xl px-5 py-16 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
            Público Ideal
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Para quem é a Imersão Educação Financeira?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-white/20 transition-colors">
            <span className="font-mono text-xs font-bold text-amber-400">
              01/
            </span>
            <h3 className="text-base font-bold text-white mt-2">
              Autônomos e MEIs
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 leading-relaxed">
              Que misturam a conta da empresa com os boletos de casa e nunca
              sabem exatamente quanto faturaram de lucro.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-white/20 transition-colors">
            <span className="font-mono text-xs font-bold text-emerald-400">
              02/
            </span>
            <h3 className="text-base font-bold text-white mt-2">
              Quem Está no Vermelho
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 leading-relaxed">
              Que quer estancar dívidas de cartão ou empréstimos e precisa de um
              plano realista para voltar a respirar com dignidade.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-white/20 transition-colors">
            <span className="font-mono text-xs font-bold text-amber-400">
              03/
            </span>
            <h3 className="text-base font-bold text-white mt-2">
              Empresários e Sócios
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 leading-relaxed">
              Que precisam alinhar a distribuição de lucros, definir pró-labore
              justo e ter fluxo de caixa com previsibilidade mensal.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-white/20 transition-colors">
            <span className="font-mono text-xs font-bold text-emerald-400">
              04/
            </span>
            <h3 className="text-base font-bold text-white mt-2">
              Quem Ganha Bem, Mas Não Vê Sobrar
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 leading-relaxed">
              Profissionais liberais e assalariados que sofrem com inflação do
              estilo de vida e querem começar a guardar com inteligência.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-white/20 transition-colors sm:col-span-2 lg:col-span-2">
            <span className="font-mono text-xs font-bold text-amber-400">
              05/
            </span>
            <h3 className="text-base font-bold text-white mt-2">
              Famílias que Desejam Construir Patrimônio Sólido
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 leading-relaxed">
              Casais que querem falar de dinheiro sem brigas, alinhar planos para
              o futuro e construir uma reserva segura que garanta tranquilidade.
            </p>
          </div>
        </div>

        {/* BOX DE GARANTIA INCONDICIONAL */}
        <div className="mt-12 max-w-4xl mx-auto rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-[#0d1512] to-emerald-950/20 p-6 sm:p-10 backdrop-blur-xl flex flex-col md:flex-row items-center gap-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-300 uppercase tracking-wider">
              <span>Garantia Incondicional de 7 Dias</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              Risco Zero para a sua Inscrição
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed">
              Participe da imersão. Se você se arrepender até antes da data da
              imersão e achar que o método não agrega em sua organização
              financeira, basta enviar uma mensagem e devolveremos 100% do valor
              do seu ingresso. Sem letras miúdas.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          DOBRA 8 — OFERTA / PREÇO (VALORES: 27,00 | 57,00 | 97,00)
      ═══════════════════════════════════════════════ */}
      <section id="preco" className="reveal-on-scroll relative z-20 mx-auto w-full max-w-5xl px-5 py-16 md:px-8">
        <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-b from-[#18120a] via-[#0f0c07] to-[#080808] p-8 md:p-14 shadow-[0_10px_60px_rgba(245,158,11,0.2)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Benefícios Inclusos */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-[0.2em]">
                Ingresso Oficial
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                Tudo o que está incluso no seu acesso:
              </h2>

              <ul className="flex flex-col gap-2.5 mt-2 text-xs sm:text-sm text-stone-200">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>
                    Acesso ao vivo e exclusivo à Imersão no Zoom (25 de outubro)
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>
                    Certificado Oficial de Conclusão da Imersão
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>
                    Acesso Exclusivo ao App OrganizAI (Módulos PF & PJ)
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>
                    Sessão ao vivo de tira-dúvidas e mentoria com Natalia Rodolfo
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>
                    Material de apoio em PDF com checklists de rotina financeira
                  </span>
                </li>
              </ul>

              {/* Comparativo dos 3 Lotes na Dobra de Oferta */}
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-4 max-w-sm">
                <div className="flex flex-col p-2 rounded-lg bg-amber-500/10 border border-amber-400/30 text-center">
                  <span className="font-mono text-[0.65rem] text-amber-400 font-bold uppercase">Lote 1</span>
                  <span className="text-sm font-black text-white">R$ 27,00</span>
                  <span className="text-[0.6rem] text-emerald-400 font-bold">Ativo</span>
                </div>
                <div className="flex flex-col p-2 rounded-lg bg-white/[0.02] border border-white/5 text-center opacity-60">
                  <span className="font-mono text-[0.65rem] text-stone-400 font-bold uppercase">Lote 2</span>
                  <span className="text-sm font-bold text-stone-300">R$ 57,00</span>
                  <span className="text-[0.6rem] text-stone-500">Em breve</span>
                </div>
                <div className="flex flex-col p-2 rounded-lg bg-white/[0.02] border border-white/5 text-center opacity-50">
                  <span className="font-mono text-[0.65rem] text-stone-400 font-bold uppercase">Lote 3</span>
                  <span className="text-sm font-bold text-stone-300">R$ 97,00</span>
                  <span className="text-[0.6rem] text-stone-500">Final</span>
                </div>
              </div>
            </div>

            {/* Box de Preço e CTA */}
            <div className="lg:col-span-5 flex flex-col items-center text-center rounded-2xl border border-white/10 bg-black/60 p-6 backdrop-blur-xl">
              <div className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                <span>1º Lote Ativo</span>
              </div>

              <span className="text-xs text-stone-400 line-through">
                De R$ 197,00 por apenas
              </span>

              {/* Valor do Lote 1 Oficial: 27,00 */}
              <div className="flex items-baseline justify-center gap-1 my-2 text-white">
                <span className="text-xl font-bold text-stone-400">R$</span>
                <span className="text-5xl sm:text-6xl font-black tracking-tight text-white">
                  27
                </span>
                <span className="text-lg font-bold text-stone-400">,00</span>
              </div>

              <span className="text-xs text-emerald-400 font-semibold mb-5">
                Pagamento único • Acesso imediato
              </span>

              <a
                href={defaultWppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-orange-400 px-6 py-4 text-sm font-black uppercase tracking-wider text-stone-950 shadow-[0_4px_24px_rgba(245,158,11,0.35)] transition-all hover:scale-105 active:scale-95"
              >
                <span>Garantir Vaga no Lote 1 (R$ 27)</span>
                <ArrowRight className="h-4 w-4 stroke-[3]" />
              </a>

              <div className="mt-4 flex items-center gap-2 text-[0.7rem] text-stone-400">
                <Lock className="h-3.5 w-3.5 text-emerald-400" />
                <span>Compra 100% segura e protegida</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          DOBRA 9 — CERTIFICADO OFICIAL
      ═══════════════════════════════════════════════ */}
      <section className="reveal-on-scroll relative z-20 mx-auto w-full max-w-5xl px-5 py-12 md:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-3">
              <Award className="h-3.5 w-3.5" />
              <span>Certificação Oficial</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Vou receber certificado?
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <strong className="text-white">Sim!</strong> Todos os participantes
              que concluírem a Imersão receberão o{" "}
              <strong className="text-amber-300">
                Certificado Oficial de Educação Financeira PF e PJ
              </strong>
              , emitido com chancela de Natalia Rodolfo, comprovando sua
              capacitação na organização e gestão orçamentária.
            </p>
          </div>

          <div className="md:w-1/2 flex justify-center">
            {/* Mockup estilizado do Certificado */}
            <div className="relative w-full max-w-sm rounded-2xl border-2 border-amber-400/40 bg-gradient-to-br from-[#1b150c] via-[#0f0c08] to-stone-950 p-6 shadow-[0_10px_40px_rgba(245,158,11,0.15)] text-center">
              <div className="flex justify-center mb-3">
                <div className="h-10 w-10 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
                  <Award className="h-6 w-6" />
                </div>
              </div>
              <span className="font-mono text-[0.65rem] tracking-[0.25em] text-amber-400 uppercase font-bold">
                CERTIFICADO DE CONCLUSÃO
              </span>
              <h4 className="text-sm font-bold text-white mt-2">
                Imersão Educação Financeira PF e PJ
              </h4>
              <p className="text-[0.65rem] text-stone-400 mt-1">
                Concedido a você por participação na 1ª Edição Oficial
              </p>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[0.6rem] text-stone-400">
                <span>Natalia Rodolfo</span>
                <span>25 de Outubro</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          DOBRA 10 — SOBRE A ESPECIALISTA (NATALIA RODOLFO)
      ═══════════════════════════════════════════════ */}
      <section className="reveal-on-scroll relative z-20 mx-auto w-full max-w-5xl px-5 py-16 md:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-12 flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-5/12">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border border-amber-500/30 bg-stone-900 shadow-xl">
              <img
                src="/natalia-original.png"
                alt="Natalia Rodolfo"
                className="h-full w-full object-cover object-top filter brightness-95"
              />
            </div>
          </div>

          <div className="lg:w-7/12 flex flex-col gap-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300 uppercase tracking-wider w-fit">
              <Sparkles className="h-3 w-3" />
              <span>Sua Professora & Mentora</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Quem é Natalia Rodolfo?
            </h2>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Educadora Financeira, mentora e estrategista, Natalia Rodolfo tem
              como missão simplificar o que as instituições financeiras tornaram
              complexo.
            </p>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Com anos de atuação orientando famílias, autônomos e pequenos
              empresários, desenvolveu um método direto e sem rodeios para
              transformar a relação com o dinheiro: eliminando a confusão entre
              contas pessoais e empresariais, estancando dívidas e construindo
              um futuro com previsibilidade e paz.
            </p>

            <div className="pt-2">
              <a
                href="https://www.instagram.com/nataliafinancas/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>Acompanhe no Instagram @nataliafinancas</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          DOBRA 11 — FAQ (PERGUNTAS FREQUENTES)
      ═══════════════════════════════════════════════ */}
      <section className="reveal-on-scroll relative z-20 mx-auto w-full max-w-3xl px-5 py-16 md:px-8">
        <div className="text-center mb-10">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
            Tire Suas Dúvidas
          </span>
          <h2 className="mt-2 text-3xl font-extrabold text-white">
            Perguntas Frequentes
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {[
            {
              q: "O que eu preciso para participar da Imersão?",
              a: "Apenas de um celular ou computador conectado à internet para acessar a sala ao vivo no Zoom. Você não precisa ter conhecimento prévio de finanças, pois o método ensina tudo a partir do zero de forma simples e descomplicada.",
            },
            {
              q: "Quando e como acontece a Imersão?",
              a: "A imersão será no dia 25 de Outubro, 100% online e ao vivo pelo Zoom. Ao confirmar sua inscrição, você receberá o link exclusivo de acesso e as instruções no seu e-mail e WhatsApp.",
            },
            {
              q: "E se eu não puder assistir ao vivo em algum horário?",
              a: "Aconselhamos a participação ao vivo para aproveitar a sessão de mentoria e dúvidas, mas você terá acesso às orientações, materiais e resumo completo do evento.",
            },
            {
              q: "Serve tanto para quem é pessoa física quanto para PJ/MEI?",
              a: "Sim, esse é o grande diferencial da imersão! A metodologia foi criada exatamente para resolver a dor de quem tem finanças pessoais e empresariais e precisa separar ambas com clareza.",
            },
            {
              q: "Como funciona a garantia incondicional de 7 dias?",
              a: "Se você participar da imersão e por qualquer razão sentir que o conteúdo não é para você, basta solicitar o reembolso em até 7 dias e devolveremos 100% do valor pago.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-colors hover:border-white/20"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-white gap-4"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-amber-400 shrink-0 transition-transform duration-300 ${
                    openFaq === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-stone-300/90 leading-relaxed border-t border-white/5 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          DOBRA 12 — SUPORTE DIRETO NO WHATSAPP
      ═══════════════════════════════════════════════ */}
      <section className="reveal-on-scroll relative z-20 mx-auto w-full max-w-xl px-5 py-12 md:px-8">
        <div className="rounded-3xl border border-emerald-500/30 bg-[#0b1410] p-8 text-center flex flex-col items-center shadow-lg">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4">
            <MessageCircle className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-bold text-white">
            Ainda tem dúvidas sobre a Imersão?
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 mt-2 max-w-sm">
            Fale diretamente com nossa equipe no WhatsApp para esclarecer
            qualquer detalhe e garantir sua inscrição.
          </p>
          <a
            href={supportWppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 px-6 py-3 text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-transform hover:scale-105"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Chamar no WhatsApp (77) 98138-1477</span>
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-20 border-t border-white/10 bg-[#040507] py-10 text-center text-xs text-stone-400">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span className="font-bold text-white">Natalia Rodolfo</span>
            <span>•</span>
            <span>Imersão Educação Financeira PF e PJ</span>
          </div>
          <p className="text-[0.7rem] text-stone-400">
            &copy; {new Date().getFullYear()} Natalia Rodolfo. Todos os direitos
            reservados.
          </p>
        </div>
      </footer>

      {/* ── STICKY BAR INFERIOR (SURGE NO SCROLL - LOTE 1: R$ 27,00) ── */}
      <div
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92vw] max-w-md rounded-full border border-white/15 bg-black/80 p-2 pl-4 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] transition-all duration-500 flex items-center justify-between ${
          showStickyBar
            ? "translate-y-0 opacity-100"
            : "translate-y-20 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col">
          <span className="text-xs font-bold text-white leading-tight">
            Imersão 25 de Outubro
          </span>
          <span className="text-[0.65rem] text-emerald-400 font-semibold">
            Lote 1: Apenas R$ 27,00
          </span>
        </div>
        <a
          href={defaultWppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-stone-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-transform hover:scale-105 active:scale-95"
        >
          <span>Garantir Vaga</span>
          <ArrowRight className="h-3 w-3 stroke-[3]" />
        </a>
      </div>

      {/* ── FLOATING WHATSAPP BUTTON ── */}
      <a
        href={supportWppUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale conosco no WhatsApp"
        className="fixed bottom-6 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-stone-950 shadow-[0_0_24px_rgba(16,185,129,0.5)] transition-all duration-300 hover:scale-110 hover:bg-emerald-400"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}
