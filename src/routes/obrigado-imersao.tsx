import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Calendar,
  Clock,
  Video,
  Award,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  MessageCircle,
  ExternalLink,
  HelpCircle,
} from "lucide-react";
import { trackEvent } from "@/lib/meta-pixel";

export const Route = createFileRoute("/obrigado-imersao")({
  head: () => ({
    meta: [
      { title: "Inscrição Confirmada! — IMER$ÃO EDUCAÇÃO FINANCEIRA" },
      {
        name: "description",
        content:
          "Parabéns! Sua vaga na IMER$ÃO EDUCAÇÃO FINANCEIRA PF e PJ está confirmada. Entre no grupo VIP do WhatsApp para receber o link do Meet.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ObrigadoImersaoPage,
});

export function ObrigadoImersaoPage() {
  // Link oficial do grupo VIP da Imersão (pode ser configurado no .env via VITE_WHATSAPP_IMERSAO_GROUP_URL)
  // Fallback para o WhatsApp da equipe com mensagem pronta caso o grupo ainda não tenha link curto definido
  const wppNumber = "5577981381477";
  const defaultWppGroupUrl =
    (typeof import.meta !== "undefined" &&
      import.meta.env?.VITE_WHATSAPP_IMERSAO_GROUP_URL) ||
    `https://wa.me/${wppNumber}?text=${encodeURIComponent(
      "Olá, Natália! Acabei de concluir minha compra da IMER$ÃO EDUCAÇÃO FINANCEIRA na Hotmart e quero entrar no grupo oficial de alunos do WhatsApp."
    )}`;

  const supportWppUrl = `https://wa.me/${wppNumber}?text=${encodeURIComponent(
    "Olá! Preciso de ajuda com a minha inscrição da IMER$ÃO EDUCAÇÃO FINANCEIRA feita na Hotmart."
  )}`;

  useEffect(() => {
    // 1. Rastreamento de conversão oficial de compra (Meta Pixel Purchase)
    trackEvent("Purchase", {
      content_name: "IMER$ÃO EDUCAÇÃO FINANCEIRA PF e PJ",
      currency: "BRL",
      value: 27.0,
      content_type: "product",
    });

    // 2. Chuva de confetes comemorativos elegantes
    try {
      const end = Date.now() + 2.5 * 1000;
      const colors = ["#10b981", "#34d399", "#f59e0b", "#fbbf24", "#ffffff"];

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.65 },
          colors,
          zIndex: 99999,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.65 },
          colors,
          zIndex: 99999,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    } catch {
      // Ignora erro se canvas-confetti não carregar
    }
  }, []);

  const handleGroupClick = () => {
    trackEvent("Contact", {
      method: "WhatsApp Group",
      content_name: "Entrada no Grupo VIP da Imersão",
    });
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#080d0a] text-white selection:bg-emerald-500/25 selection:text-emerald-200 overflow-x-hidden font-sans">
      {/* Luzes de fundo elegantes — Esmeralda & Dourado */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden [contain:paint]">
        <div className="absolute -top-[140px] left-1/2 -translate-x-1/2 h-[420px] w-[640px] rounded-full bg-emerald-600/15 blur-[60px] sm:blur-[100px]" />
        <div className="absolute top-[180px] left-1/2 -translate-x-1/2 h-[220px] w-[320px] rounded-full bg-amber-400/10 blur-[50px] sm:blur-[90px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-emerald-950/20 blur-[60px]" />
      </div>

      {/* Conteúdo Principal — Max-w-xl Mobile First e Direto ao Ponto */}
      <main className="relative z-10 mx-auto flex w-full max-w-[560px] flex-col items-center px-4.5 pt-8 pb-12 sm:pt-12 sm:pb-16 text-center">
        {/* SELO DE COMPRA CONFIRMADA */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/70 px-4 py-1.5 text-xs font-bold text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.25)] backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          <span>INSCRIÇÃO CONFIRMADA PELA HOTMART</span>
        </div>

        {/* TÍTULO */}
        <div className="mt-5 flex flex-col items-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white leading-snug">
            Parabéns! Sua vaga na{" "}
            <span className="block mt-1 whitespace-nowrap text-[clamp(1.05rem,4.4vw,1.9rem)] font-black tracking-tight bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent drop-shadow-sm">
              IMER$ÃO EDUCAÇÃO FINANCEIRA
            </span>
            está 100% garantida!
          </h1>

          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-stone-300 max-w-md">
            Você deu o passo definitivo para organizar suas finanças, separar as contas pessoais das empresariais e construir estabilidade.
          </p>
        </div>

        {/* ── CARD EM DESTAQUE MÁXIMO: PASSO 1 & BOTÃO DO WHATSAPP ── */}
        <div className="mt-6 w-full rounded-2xl border-2 border-amber-400/60 bg-gradient-to-b from-[#0f2c1f]/95 via-[#0a1e15]/95 to-[#161206]/95 p-5 sm:p-6 shadow-[0_8px_40px_rgba(245,158,11,0.22)] backdrop-blur-xl relative overflow-hidden">
          {/* Luz interna */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-amber-400/15 blur-2xl" />

          {/* Tag de Alerta Importante */}
          <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-400/20 px-2.5 py-1 text-[0.68rem] sm:text-xs font-black uppercase tracking-wider text-amber-300 border border-amber-400/40 mb-3">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
            <span>ÚLTIMO PASSO • AÇÃO OBRIGATÓRIA</span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
            Você está quase lá!
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-stone-200/90 leading-relaxed text-left sm:text-center">
            Para finalizar e garantir seu acesso, entre agora mesmo no{" "}
            <strong className="text-white font-bold underline decoration-amber-400 decoration-2 underline-offset-2">
              Grupo Oficial de Alunos no WhatsApp
            </strong>
            .
          </p>

          <div className="mt-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-left">
            <div className="flex items-start gap-2.5">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5">
                <Video className="h-3.5 w-3.5" />
              </div>
              <p className="text-[0.78rem] text-stone-300 leading-snug">
                <strong className="text-emerald-300 font-semibold">O link da sala do Google Meet</strong>, avisos importantes e os materiais de apoio serão enviados <strong className="text-white">exclusivamente por dentro do grupo</strong>!
              </p>
            </div>
          </div>

          {/* BOTÃO PRINCIPAL GIGANTE DO WHATSAPP */}
          <a
            href={defaultWppGroupUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleGroupClick}
            className="group mt-5 relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 px-6 py-4 text-sm sm:text-base font-black uppercase tracking-wider text-stone-950 shadow-[0_6px_28px_rgba(16,185,129,0.45)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_36px_rgba(16,185,129,0.6)] active:scale-95"
          >
            {/* Brilho animado de passagem */}
            <div className="pointer-events-none absolute -left-full top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 transition-all duration-1000 group-hover:left-[150%]" />

            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-950/20">
              <MessageCircle className="h-4 w-4 stroke-[2.8]" />
            </div>
            <span>ENTRAR NO GRUPO VIP DO WHATSAPP</span>
            <ArrowRight className="h-4 w-4 stroke-[3] transition-transform duration-300 group-hover:translate-x-1" />
          </a>

          <p className="mt-2.5 text-[0.72rem] text-stone-400 font-medium">
            🔒 Grupo restrito e silencioso. Apenas a equipe envia recados e links.
          </p>
        </div>

        {/* ── CARD RESUMO DA IMERSÃO (DATA, DIA E HORÁRIO) ── */}
        <section
          aria-label="Informações do Evento"
          className="mt-6 w-full rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-md"
        >
          <div className="flex items-center justify-center gap-2 text-stone-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Calendar className="h-3.5 w-3.5 text-amber-400" />
            <span>Dados Oficiais do Encontro</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {/* Item 1: Data */}
            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <span className="block text-[0.68rem] font-bold text-stone-400 uppercase tracking-wider">
                  Dia &amp; Data
                </span>
                <span className="text-sm font-bold text-white">
                  01 de Novembro (Sábado)
                </span>
              </div>
            </div>

            {/* Item 2: Horário */}
            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Clock className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <span className="block text-[0.68rem] font-bold text-stone-400 uppercase tracking-wider">
                  Horário
                </span>
                <span className="text-sm font-bold text-white">
                  13h00 às 18h00 <span className="text-xs text-stone-400 font-normal">(Brasília)</span>
                </span>
              </div>
            </div>

            {/* Item 3: Plataforma */}
            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                <Video className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <span className="block text-[0.68rem] font-bold text-stone-400 uppercase tracking-wider">
                  Transmissão
                </span>
                <span className="text-sm font-bold text-white">
                  100% Ao Vivo no Google Meet
                </span>
              </div>
            </div>

            {/* Item 4: Certificado & Gravação */}
            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Award className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <span className="block text-[0.68rem] font-bold text-stone-400 uppercase tracking-wider">
                  Certificação &amp; Gravação
                </span>
                <span className="text-sm font-bold text-white">
                  Inclusos no seu Ingresso
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── SUPORTE & DÚVIDAS ── */}
        <div className="mt-7 flex flex-col items-center gap-2 text-center text-xs text-stone-400">
          <p className="flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-stone-400" />
            <span>Precisa de ajuda ou teve alguma dúvida com seu pagamento?</span>
          </p>
          <a
            href={supportWppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-emerald-400 underline underline-offset-4 hover:text-emerald-300 transition-colors"
          >
            <span>Falar com o Suporte Oficial no WhatsApp</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* LOGO ORGANIZ.AI DISCRETO NO RODAPÉ */}
        <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-center gap-2 opacity-60">
          <picture>
            <source srcSet="/logo.webp" type="image/webp" />
            <img
              src="/logo.png"
              alt="Organiz.AI"
              width={24}
              height={24}
              className="h-6 w-auto object-contain"
            />
          </picture>
          <span className="text-[0.7rem] font-medium tracking-wide text-stone-400">
            Natália Rodolfo • Organiz.AI
          </span>
        </div>
      </main>
    </div>
  );
}
