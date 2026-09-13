import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Calendar,
  Video,
  Award,
  TrendingUp,
  Coins,
  PieChart,
  BarChart3,
  FileText,
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
  component: ImersaoPage,
});

export default function ImersaoPage() {
  // 1. WhatsApp link
  const wppNumber = "5577981381477";
  const defaultWppUrl = `https://wa.me/${wppNumber}?text=${encodeURIComponent(
    "Olá, Natalia! Gostaria de garantir minha vaga na 1ª Edição da Imersão Educação Financeira PF e PJ."
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

      if (window.scrollY > 600) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. Typewriter effect in Dobra 2
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
          }, 32);
        }
      },
      { threshold: 0.25 }
    );

    if (typewriterRef.current) {
      observer.observe(typewriterRef.current);
    }

    return () => observer.disconnect();
  }, [hasTyped]);

  // 4. FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  // 5. Active Pricing Lot State
  const [selectedLot, setSelectedLot] = useState<1 | 2 | 3>(1);

  return (
    <div className="relative min-h-screen w-full bg-[#06080a] text-stone-100 selection:bg-amber-400 selection:text-stone-950 font-sans antialiased overflow-x-hidden">
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

      {/* ── 0. ANNOUNCEMENT TICKER MARQUEE ── */}
      <div className="relative z-40 w-full overflow-hidden bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 py-2 text-stone-950 shadow-md">
        <div className="flex w-max animate-marquee items-center gap-8 text-[0.72rem] md:text-xs font-black tracking-widest uppercase">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-6 whitespace-nowrap">
              <span className="flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 fill-stone-950 text-stone-950" />
                1ª EDIÇÃO DA IMERSÃO EDUCAÇÃO FINANCEIRA PF E PJ
              </span>
              <span>•</span>
              <span className="font-extrabold text-stone-900">
                25 DE OUTUBRO • 100% AO VIVO NO ZOOM
              </span>
              <span>•</span>
              <span className="rounded bg-stone-950 px-2 py-0.5 text-[0.65rem] font-bold text-amber-300">
                LOTE 1 ATIVO
              </span>
              <span>•</span>
              <span>VAGAS LIMITADAS COM CERTIFICAÇÃO OFICIAL</span>
              <span>•</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── HEADER / TOPBAR ── */}
      <header className="relative z-30 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link
          to="/"
          className="group flex items-center gap-3 transition-opacity hover:opacity-90"
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
        </Link>

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
          DOBRA 1 — HERO SECTION DE ALTO IMPACTO
      ═══════════════════════════════════════════════ */}
      <section className="relative z-20 mx-auto w-full max-w-7xl px-5 pt-4 pb-16 md:px-8 md:pt-8 md:pb-24">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* COLUNA ESQUERDA — COPYWRITING & OFERTA */}
          <div className="flex flex-col gap-5 lg:col-span-7">
            {/* Tag de Evento / Topo */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-3.5 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-md">
                <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                <span>25 de Outubro</span>
                <span className="text-emerald-500/60">•</span>
                <Video className="h-3.5 w-3.5 text-emerald-400" />
                <span>Ao vivo no Zoom</span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
                <Sparkles className="h-3 w-3" />
                <span>1ª Edição Oficial</span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
                <Award className="h-3 w-3" />
                <span>Com Certificação</span>
              </div>
            </div>

            {/* BADGES DA IMAGEM OFICIAL */}
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="rounded-full border border-white/20 bg-white/[0.04] px-3.5 py-1 text-[0.7rem] font-bold tracking-[0.2em] text-white uppercase backdrop-blur-md">
                IMERSÃO
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/60 bg-emerald-900/60 px-3.5 py-1 text-[0.7rem] font-bold tracking-wider text-emerald-200 uppercase backdrop-blur-md">
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" />
                COM CERTIFICAÇÃO
              </span>
              <span className="rounded-full bg-gradient-to-r from-amber-600 to-amber-500 px-3.5 py-1 text-[0.7rem] font-black tracking-wider text-stone-950 uppercase shadow-sm">
                1ª EDIÇÃO
              </span>
            </div>

            {/* TÍTULO PRINCIPAL (IDÊNTICO À ARTE DO BANNER) */}
            <div className="mt-2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-black tracking-tight leading-[1.05] text-white">
                EDUCAÇÃO
                <span className="block bg-gradient-to-r from-[#ffd977] via-[#f59e0b] to-[#d97706] bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(245,158,11,0.3)]">
                  FINANCEIRA
                </span>
                <span className="block text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold tracking-[0.18em] text-stone-300 uppercase mt-1">
                  PARA PESSOAS FÍSICA E JURÍDICA
                </span>
              </h1>
            </div>

            {/* SUBTÍTULO DA IMAGEM */}
            <p className="text-base sm:text-lg md:text-xl font-normal leading-relaxed text-stone-300 max-w-xl">
              Aprenda a organizar seu dinheiro,{" "}
              <strong className="font-bold text-white underline decoration-amber-400/60 decoration-2 underline-offset-4">
                sair do vermelho
              </strong>{" "}
              e construir uma vida financeira leve e consciente.
            </p>

            {/* 4 PILARES DA IMAGEM OFICIAL (COM ÍCONES VERDES E DESTAQUE) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="group flex flex-col items-center text-center p-3 rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-emerald-500/40 hover:bg-emerald-950/20 hover:-translate-y-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
                  <Coins className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-white leading-tight">
                  Organize
                </span>
                <span className="text-[0.7rem] text-stone-400">seu dinheiro</span>
              </div>

              <div className="group flex flex-col items-center text-center p-3 rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-emerald-500/40 hover:bg-emerald-950/20 hover:-translate-y-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
                  <PieChart className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-white leading-tight">
                  Controle
                </span>
                <span className="text-[0.7rem] text-stone-400">seus gastos</span>
              </div>

              <div className="group flex flex-col items-center text-center p-3 rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-emerald-500/40 hover:bg-emerald-950/20 hover:-translate-y-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-white leading-tight">
                  Planeje
                </span>
                <span className="text-[0.7rem] text-stone-400">seu futuro</span>
              </div>

              <div className="group flex flex-col items-center text-center p-3 rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-emerald-500/40 hover:bg-emerald-950/20 hover:-translate-y-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-white leading-tight">
                  Tome decisões
                </span>
                <span className="text-[0.7rem] text-stone-400">mais conscientes</span>
              </div>
            </div>

            {/* SELETOR DOS 3 LOTES NO HERO (INSPIRADO NA REFERÊNCIA) */}
            <div className="mt-2 flex flex-col gap-2 max-w-md">
              <span className="text-[0.72rem] font-bold uppercase tracking-wider text-stone-400">
                Selecione seu lote de entrada:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {/* Lote 1 Ativo */}
                <button
                  type="button"
                  onClick={() => setSelectedLot(1)}
                  className={`relative flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-center ${
                    selectedLot === 1
                      ? "border-amber-400 bg-amber-500/15 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/50"
                      : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
                  }`}
                >
                  <span className="font-mono text-[0.65rem] font-bold text-amber-400 uppercase tracking-wider">
                    LOTE 1
                  </span>
                  <span className="text-sm font-black text-white">R$ 47,00</span>
                  <span className="inline-flex items-center gap-1 text-[0.65rem] font-extrabold text-emerald-400 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Ativo
                  </span>
                </button>

                {/* Lote 2 */}
                <button
                  type="button"
                  onClick={() => setSelectedLot(2)}
                  className={`relative flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-center opacity-70 ${
                    selectedLot === 2
                      ? "border-amber-400 bg-amber-500/15 ring-1 ring-amber-400/50 opacity-100"
                      : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <span className="font-mono text-[0.65rem] font-medium text-stone-400 uppercase tracking-wider">
                    LOTE 2
                  </span>
                  <span className="text-sm font-bold text-stone-300">R$ 97,00</span>
                  <span className="text-[0.65rem] text-stone-500 mt-0.5">Em breve</span>
                </button>

                {/* Lote 3 */}
                <button
                  type="button"
                  onClick={() => setSelectedLot(3)}
                  className={`relative flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-center opacity-60 ${
                    selectedLot === 3
                      ? "border-amber-400 bg-amber-500/15 ring-1 ring-amber-400/50 opacity-100"
                      : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <span className="font-mono text-[0.65rem] font-medium text-stone-400 uppercase tracking-wider">
                    LOTE 3
                  </span>
                  <span className="text-sm font-bold text-stone-300">R$ 197</span>
                  <span className="text-[0.65rem] text-stone-500 mt-0.5">Final</span>
                </button>
              </div>
            </div>

            {/* BOTÕES DE AÇÃO HERO */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                href={defaultWppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-orange-400 px-8 py-4 text-sm font-black uppercase tracking-wider text-stone-950 shadow-[0_4px_32px_rgba(245,158,11,0.4)] transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span>Garantir Meu Ingresso no Lote 1</span>
                <ArrowRight className="h-4 w-4 stroke-[3] transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="#cronograma"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-4 text-xs font-bold uppercase tracking-wider text-stone-300 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white"
              >
                <span>Ver Cronograma</span>
                <ChevronDown className="h-4 w-4 text-stone-400" />
              </a>
            </div>

            {/* BARRA DE PROGRESSO DE VAGAS */}
            <div className="flex flex-col gap-1.5 max-w-md pt-1">
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10 border border-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-400 shadow-[0_0_10px_#f59e0b] transition-all duration-1000"
                  style={{ width: "94%" }}
                />
              </div>
              <div className="flex items-center justify-between text-[0.72rem] text-stone-400">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  94% das vagas preenchidas no 1º Lote
                </span>
                <span className="font-mono text-stone-500">Últimas vagas</span>
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA — CINEMA CARD VISUAL (INSPIRADO NA REFERÊNCIA) */}
          <div className="relative flex items-center justify-center lg:col-span-5">
            {/* Halo de Luz Posterior */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-orange-500/10 to-emerald-500/20 blur-2xl opacity-70" />

            {/* O CARD CINEMA 3D */}
            <div className="relative w-full max-w-[440px] overflow-hidden rounded-3xl border border-white/[0.12] bg-[#0c0e14]/90 p-3 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] transition-transform duration-500 hover:scale-[1.02]">
              {/* Foto da Especialista */}
              <div className="relative aspect-[4/4.5] w-full overflow-hidden rounded-2xl bg-stone-900">
                <img
                  src="/natalia-original.png"
                  alt="Natalia Rodolfo — Educadora Financeira"
                  className="h-full w-full object-cover object-top filter contrast-[1.05] brightness-95 transition-transform duration-700 hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0c0e14] via-[#0c0e14]/20 to-transparent" />

                {/* Selo no Topo da Imagem */}
                <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-stone-950/70 px-3 py-1 text-[0.65rem] font-bold text-amber-300 backdrop-blur-md">
                  <Sparkles className="h-3 w-3" />
                  <span>Mentora & Estrategista</span>
                </div>

                {/* Card de Depoimento Flutuante Sobreposto (Efeito do site de referência) */}
                <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/10 bg-black/70 p-3.5 backdrop-blur-md">
                  <p className="text-xs text-stone-200 leading-relaxed italic">
                    "Você já perdeu tempo e dinheiro demais tentando resolver
                    sozinho algo que vamos destravar juntos em 1 dia de imersão."
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-mono text-[0.65rem] font-bold tracking-wider text-amber-400 uppercase">
                      Natalia Rodolfo
                    </span>
                    <div className="flex gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Strip de Estatísticas Rápidas Abaixo da Foto */}
              <div className="grid grid-cols-3 gap-2 pt-3 text-center">
                <div className="flex flex-col">
                  <span className="text-base font-extrabold text-white">
                    100%
                  </span>
                  <span className="text-[0.65rem] font-medium text-stone-400 uppercase tracking-wider">
                    Ao Vivo no Zoom
                  </span>
                </div>
                <div className="flex flex-col border-x border-white/10">
                  <span className="text-base font-extrabold text-emerald-400">
                    Oficial
                  </span>
                  <span className="text-[0.65rem] font-medium text-stone-400 uppercase tracking-wider">
                    Certificação
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-extrabold text-amber-400">
                    PF + PJ
                  </span>
                  <span className="text-[0.65rem] font-medium text-stone-400 uppercase tracking-wider">
                    Sem Misturas
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          DOBRA 2 — TYPEWRITER + TIMELINE DE TRANSFORMAÇÃO
      ═══════════════════════════════════════════════ */}
      <section className="relative z-20 mx-auto w-full max-w-5xl px-5 py-12 md:px-8">
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

          {/* Timeline de 3 Passos (idêntica ao layout da referência) */}
          <div className="relative max-w-3xl mx-auto flex flex-col gap-10 md:gap-12 before:absolute before:left-4 md:before:left-1/2 before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-amber-500 before:via-emerald-500 before:to-amber-500/20 before:-translate-x-1/2">
            {/* Passo 1 */}
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="md:w-1/2 md:text-right md:pr-10 pl-10 md:pl-0">
                <span className="font-mono text-xs font-bold text-amber-400 tracking-wider uppercase">
                  Fase 01
                </span>
                <h3 className="text-lg md:text-xl font-bold text-white mt-1">
                  Diagnóstico & Fim da Mistura
                </h3>
                <p className="text-sm text-stone-300/80 mt-1 leading-relaxed">
                  Você vai mapear exatamente onde o dinheiro está vazando e
                  erguer o "muro de contenção" entre a conta física e jurídica.
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
          DOBRA 3 — MÓDULOS DA IMERSÃO (O QUE VOCÊ VAI APRENDER)
      ═══════════════════════════════════════════════ */}
      <section id="modulos" className="relative z-20 mx-auto w-full max-w-7xl px-5 py-16 md:px-8">
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
              Apresentação de ferramentas práticas (planilhas descomplicadas e
              integração com sistemas como o OrganiAI) para automatizar seus
              registros sem tomar horas do seu dia.
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
          DOBRA 4 — O DIAGNÓSTICO REAL (CHEGA DE FICAR PERDIDO)
      ═══════════════════════════════════════════════ */}
      <section className="relative z-20 mx-auto w-full max-w-7xl px-5 py-16 md:px-8">
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
          DOBRA 5 — BÔNUS EXCLUSIVOS (AURORA CARD)
      ═══════════════════════════════════════════════ */}
      <section className="relative z-20 mx-auto w-full max-w-5xl px-5 py-12 md:px-8">
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
              Kit de Ferramentas e Planilhas Oficiais de Diagnóstico
            </h2>
            <p className="mt-3 text-sm sm:text-base text-stone-300 max-w-2xl leading-relaxed">
              Você não vai sair da imersão apenas com anotações. Você receberá o
              pacote completo de planilhas e templates prontos para uso que a
              Natalia utiliza em suas consultorias individuais.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 p-3">
                <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
                <span className="text-xs sm:text-sm text-stone-200">
                  Planilha Master de Separação PF vs PJ
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 p-3">
                <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
                <span className="text-xs sm:text-sm text-stone-200">
                  Simulador de Quitação Rápida de Dívidas
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 p-3">
                <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
                <span className="text-xs sm:text-sm text-stone-200">
                  Guia Prático de Cálculo de Pró-labore
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 p-3">
                <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
                <span className="text-xs sm:text-sm text-stone-200">
                  Acesso ao Grupo Exclusivo de Alunos
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
      <section id="cronograma" className="relative z-20 mx-auto w-full max-w-5xl px-5 py-16 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2">
            <Clock className="h-3.5 w-3.5" />
            <span>25 de Outubro • Cronograma Oficial</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Um dia inteiro focado no seu futuro financeiro
          </h2>
          <p className="mt-2 text-sm text-stone-400">
            Encontro ao vivo via Zoom com tempo para perguntas, exercícios e
            acompanhamento prático.
          </p>
        </div>

        <div className="flex flex-col gap-3 max-w-2xl mx-auto">
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-amber-500/30 hover:bg-white/[0.04]">
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm font-bold text-amber-400">
                09h00
              </span>
              <span className="text-sm font-semibold text-white">
                Abertura & Raio-X Financeiro (Diagnóstico Real)
              </span>
            </div>
            <span className="text-[0.65rem] font-bold text-stone-500 uppercase tracking-wider">
              Manhã
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-amber-500/30 hover:bg-white/[0.04]">
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm font-bold text-amber-400">
                10h30
              </span>
              <span className="text-sm font-semibold text-white">
                O Muro de Separação: Descomplicando PF e PJ
              </span>
            </div>
            <span className="text-[0.65rem] font-bold text-stone-500 uppercase tracking-wider">
              Manhã
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] p-4 opacity-70">
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm font-bold text-stone-400">
                12h00
              </span>
              <span className="text-sm font-medium text-stone-300">
                Intervalo para Almoço e Descanso
              </span>
            </div>
            <span className="text-[0.65rem] font-bold text-stone-500 uppercase tracking-wider">
              Pausa
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-emerald-500/30 hover:bg-white/[0.04]">
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm font-bold text-emerald-400">
                13h30
              </span>
              <span className="text-sm font-semibold text-white">
                Mão na Massa: Fluxo de Caixa, Ferramentas & Pró-labore
              </span>
            </div>
            <span className="text-[0.65rem] font-bold text-stone-500 uppercase tracking-wider">
              Tarde
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-emerald-500/30 hover:bg-white/[0.04]">
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm font-bold text-emerald-400">
                15h30
              </span>
              <span className="text-sm font-semibold text-white">
                Plano de Saída do Vermelho & Reserva de Emergência
              </span>
            </div>
            <span className="text-[0.65rem] font-bold text-stone-500 uppercase tracking-wider">
              Tarde
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-amber-500/30 hover:bg-white/[0.04]">
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm font-bold text-amber-400">
                17h00
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
      <section className="relative z-20 mx-auto w-full max-w-7xl px-5 py-16 md:px-8">
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

        {/* BOX DE GARANTIA INCONDICIONAL (DOBRA DA REFERÊNCIA) */}
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
              Participe da imersão. Se você assistir ao conteúdo e achar que o
              método não agregou na sua organização financeira, basta enviar uma
              mensagem e devolveremos 100% do valor do seu ingresso. Sem letras
              miúdas.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          DOBRA 8 — OFERTA / PREÇO (LOTE 1 ATIVO)
      ═══════════════════════════════════════════════ */}
      <section id="preco" className="relative z-20 mx-auto w-full max-w-5xl px-5 py-16 md:px-8">
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
                    Kit de Planilhas e Templates de Separação PF/PJ
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
            </div>

            {/* Box de Preço e CTA */}
            <div className="lg:col-span-5 flex flex-col items-center text-center rounded-2xl border border-white/10 bg-black/60 p-6 backdrop-blur-xl">
              <div className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                <span>1º Lote Exclusivo</span>
              </div>

              <span className="text-xs text-stone-400 line-through">
                De R$ 197,00 por apenas
              </span>

              {/* Valor do Lote */}
              <div className="flex items-baseline justify-center gap-1 my-2 text-white">
                <span className="text-xl font-bold text-stone-400">R$</span>
                <span className="text-5xl sm:text-6xl font-black tracking-tight text-white">
                  47
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
                <span>Garantir Vaga no Lote 1</span>
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
      <section className="relative z-20 mx-auto w-full max-w-5xl px-5 py-12 md:px-8">
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
      <section className="relative z-20 mx-auto w-full max-w-5xl px-5 py-16 md:px-8">
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
      <section className="relative z-20 mx-auto w-full max-w-3xl px-5 py-16 md:px-8">
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
      <section className="relative z-20 mx-auto w-full max-w-xl px-5 py-12 md:px-8">
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

      {/* ── STICKY BAR INFERIOR (SURGE NO SCROLL) ── */}
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
            Lote 1: Apenas R$ 47,00
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
