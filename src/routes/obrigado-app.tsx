import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  MessageCircle,
  ExternalLink,
  Sparkles,
  Inbox,
  KeyRound,
  Check,
  HelpCircle,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { trackEvent } from "@/lib/meta-pixel";

interface ObrigadoAppSearch {
  name?: string;
  nome?: string;
  first_name?: string;
  email?: string;
  transaction?: string;
  transacao?: string;
}

export const Route = createFileRoute("/obrigado-app")({
  validateSearch: (search: Record<string, unknown>): ObrigadoAppSearch => {
    return {
      name:
        (search["name"] as string) ||
        (search["nome"] as string) ||
        (search["first_name"] as string) ||
        undefined,
      nome:
        (search["nome"] as string) ||
        (search["name"] as string) ||
        (search["first_name"] as string) ||
        undefined,
      first_name:
        (search["first_name"] as string) ||
        (search["name"] as string) ||
        undefined,
      email: (search["email"] as string) || undefined,
      transaction:
        (search["transaction"] as string) ||
        (search["transacao"] as string) ||
        undefined,
      transacao:
        (search["transacao"] as string) ||
        (search["transaction"] as string) ||
        undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Compra Confirmada! Como Acessar o App — Organiz.AI" },
      {
        name: "description",
        content:
          "Parabéns por assinar o Organiz.AI! Abra sua caixa de entrada para criar sua senha de acesso e começar a usar o aplicativo.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ObrigadoAppPage,
});

export function ObrigadoAppPage() {
  const search = useSearch({ from: "/obrigado-app" });
  const rawName = search.name || search.nome || search.first_name || "";
  const rawEmail = search.email || "";

  // Formata o primeiro nome para tratamento carinhoso e profissional
  const clienteNome = useMemo(() => {
    if (!rawName) return "";
    const clean = rawName.trim();
    const parts = clean.split(/\s+/);
    const first = parts[0] || "";
    return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
  }, [rawName]);

  const emailCadastrado = useMemo(() => {
    return rawEmail ? rawEmail.trim().toLowerCase() : "";
  }, [rawEmail]);

  // Identifica provedor a partir do domínio do email cadastrado
  const provedorDetectado = useMemo(() => {
    if (!emailCadastrado) return null;
    if (emailCadastrado.includes("@gmail.com")) return "gmail";
    if (
      emailCadastrado.includes("@outlook.com") ||
      emailCadastrado.includes("@hotmail.com") ||
      emailCadastrado.includes("@live.com") ||
      emailCadastrado.includes("@msn.com")
    )
      return "outlook";
    if (
      emailCadastrado.includes("@yahoo.com") ||
      emailCadastrado.includes("@yahoo.com.br")
    )
      return "yahoo";
    if (
      emailCadastrado.includes("@icloud.com") ||
      emailCadastrado.includes("@me.com") ||
      emailCadastrado.includes("@mac.com")
    )
      return "icloud";
    return "outro";
  }, [emailCadastrado]);

  const wppNumber = "5577981381477";
  const supportWppUrl = `https://wa.me/${wppNumber}?text=${encodeURIComponent(
    `Olá, Natália! Acabei de concluir a assinatura do Organiz.AI na Hotmart${
      clienteNome ? ` (meu nome é ${clienteNome})` : ""
    }${
      emailCadastrado ? ` com o e-mail ${emailCadastrado}` : ""
    } e preciso de ajuda para ativar o meu acesso / definir minha senha.`
  )}`;

  useEffect(() => {
    // 1. Rastreamento oficial de conversão de compra no Meta Pixel
    try {
      trackEvent("Purchase", {
        content_name: "Organiz.AI App Subscription",
        currency: "BRL",
        content_type: "product",
      });
    } catch (_) {}

    // 2. Chuva elegante de confetes celebratórios
    try {
      const end = Date.now() + 2.5 * 1000;
      const colors = ["#f97316", "#fb923c", "#10b981", "#fbbf24", "#ffffff"];

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
    } catch (_) {}
  }, []);

  const copiarEmail = () => {
    if (!emailCadastrado) return;
    try {
      navigator.clipboard.writeText(emailCadastrado);
      toast.success("E-mail copiado para a área de transferência!");
    } catch {
      toast.info(`E-mail: ${emailCadastrado}`);
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#07080a] text-white selection:bg-orange-500/25 selection:text-orange-200 overflow-x-hidden font-sans">
      {/* Luzes de fundo de alta fidelidade — Laranja Organiz.AI & Esmeralda */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden [contain:paint]">
        <div className="absolute -top-[140px] left-1/2 -translate-x-1/2 h-[420px] w-[680px] rounded-full bg-orange-600/15 blur-[70px] sm:blur-[110px]" />
        <div className="absolute top-[200px] left-1/2 -translate-x-1/2 h-[260px] w-[360px] rounded-full bg-amber-500/10 blur-[60px] sm:blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-emerald-950/20 blur-[80px]" />
      </div>

      {/* Container Principal Centralizado */}
      <main className="relative z-10 mx-auto flex w-full max-w-[620px] flex-col items-center px-4 pt-8 pb-14 sm:pt-12 sm:pb-20 text-center">
        {/* BADGE: COMPRA APROVADA HOTMART */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/70 px-4 py-1.5 text-xs font-bold text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.25)] backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          <span>ASSINATURA APROVADA NA HOTMART</span>
        </div>

        {/* TÍTULO PRINCIPAL PERSONALIZADO COM O NOME DO CLIENTE */}
        <div className="mt-5 flex flex-col items-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white leading-snug">
            {clienteNome ? (
              <>
                Parabéns,{" "}
                <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-amber-400 bg-clip-text text-transparent">
                  {clienteNome}
                </span>
                !
              </>
            ) : (
              <>Parabéns por dar o primeiro passo!</>
            )}
            <span className="block mt-1 font-black text-[clamp(1.15rem,4.5vw,2rem)] text-white">
              Seu acesso ao{" "}
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-emerald-400 bg-clip-text text-transparent">
                Organiz.AI
              </span>{" "}
              está liberado!
            </span>
          </h1>

          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-stone-300 max-w-lg">
            Agora falta apenas <span className="text-white font-semibold">1 passo simples</span> para começar a usar a inteligência financeira que vai transformar o seu dinheiro.
          </p>
        </div>

        {/* ── CARD SUPREMO DE ALERTA: AÇÃO OBRIGATÓRIA NO E-MAIL ── */}
        <div className="mt-7 w-full rounded-3xl border-2 border-orange-500/60 bg-gradient-to-b from-[#1a110a]/95 via-[#120d09]/95 to-[#0b0c10]/95 p-5 sm:p-7 shadow-[0_12px_50px_rgba(249,115,22,0.22)] backdrop-blur-xl relative overflow-hidden text-left sm:text-center">
          {/* Efeito de luz sutil no topo do card */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-orange-500/15 blur-2xl" />

          {/* Tag de Alerta com Ícone */}
          <div className="inline-flex items-center gap-1.5 rounded-md bg-orange-500/20 px-2.5 py-1 text-[0.68rem] sm:text-xs font-black uppercase tracking-wider text-orange-300 border border-orange-500/40 mb-3.5">
            <AlertTriangle className="h-3.5 w-3.5 text-orange-400 shrink-0" />
            <span>ÚLTIMO PASSO • AÇÃO OBRIGATÓRIA</span>
          </div>

          <h2 className="text-lg sm:text-xl md:text-[22px] font-black text-white leading-snug">
            {clienteNome ? `${clienteNome}, confirme` : "Confirme"} seu e-mail para criar sua senha de acesso
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
            Nós acabamos de enviar um e-mail de ativação para você.{" "}
            <strong className="text-white font-bold">
              Abra a sua Caixa de Entrada ou a pasta de Spam / Lixo Eletrônico
            </strong>{" "}
            do e-mail cadastrado na compra da Hotmart e clique no link para definir sua senha.
          </p>

          {/* Exibição Destacada do E-mail Cadastrado (se presente) */}
          {emailCadastrado ? (
            <div className="mt-4 rounded-xl border border-white/10 bg-black/50 p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 min-w-0 text-left">
                <Mail className="h-4 w-4 text-orange-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                    E-mail cadastrado na Hotmart:
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white truncate block">
                    {emailCadastrado}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={copiarEmail}
                className="shrink-0 flex items-center gap-1 rounded-lg bg-white/10 hover:bg-white/20 px-2.5 py-1.5 text-[11px] font-semibold text-stone-200 transition-all active:scale-95"
              >
                <Copy className="h-3 w-3" />
                <span>Copiar</span>
              </button>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-3 text-center">
              <span className="text-xs text-stone-300 flex items-center justify-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                <span>Utilize exatamente o mesmo e-mail digitado no momento do checkout.</span>
              </span>
            </div>
          )}

          {/* ── BOTÕES DE ACESSO RÁPIDO AOS PROVEDORES DE E-MAIL COM LOGOTIPOS ── */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-stone-400 block mb-3 text-center">
              Toque no seu provedor para abrir direto:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* 1. GMAIL (GOOGLE) */}
              <a
                href="https://mail.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`relative group flex flex-col items-center justify-center gap-2 rounded-2xl border p-3.5 transition-all text-center ${
                  provedorDetectado === "gmail"
                    ? "border-red-500/80 bg-red-950/30 ring-2 ring-red-500/50 shadow-lg shadow-red-950/40"
                    : "border-white/10 bg-white/[0.03] hover:border-red-500/50 hover:bg-red-500/10"
                }`}
              >
                {provedorDetectado === "gmail" && (
                  <span className="absolute -top-2 rounded-full bg-red-500 px-2 py-0.2 text-[9px] font-black uppercase text-white shadow-sm">
                    Seu e-mail
                  </span>
                )}
                {/* Logotipo Oficial do Gmail (Envelope 4-Cores) */}
                <svg
                  className="h-7 w-7 transition-transform group-hover:scale-110"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 6.5C2 5.12 3.12 4 4.5 4H7V13.5L2 9.5V6.5Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M22 6.5C22 5.12 20.88 4 19.5 4H17V13.5L22 9.5V6.5Z"
                    fill="#34A853"
                  />
                  <path
                    d="M17 4H7L12 9.5L17 4Z"
                    fill="#EA4335"
                  />
                  <path
                    d="M2 9.5L7 13.5V20H4.5C3.12 20 2 18.88 2 17.5V9.5Z"
                    fill="#FBBC04"
                  />
                  <path
                    d="M22 9.5L17 13.5V20H19.5C20.88 20 22 18.88 22 17.5V9.5Z"
                    fill="#34A853"
                  />
                  <path
                    d="M7 13.5L12 17.5L17 13.5V20H7V13.5Z"
                    fill="#EA4335"
                  />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-white group-hover:text-red-400">
                    Gmail
                  </span>
                  <span className="text-[10px] text-stone-400">Google</span>
                </div>
              </a>

              {/* 2. OUTLOOK / HOTMAIL (MICROSOFT) */}
              <a
                href="https://outlook.live.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`relative group flex flex-col items-center justify-center gap-2 rounded-2xl border p-3.5 transition-all text-center ${
                  provedorDetectado === "outlook"
                    ? "border-sky-500/80 bg-sky-950/30 ring-2 ring-sky-500/50 shadow-lg shadow-sky-950/40"
                    : "border-white/10 bg-white/[0.03] hover:border-sky-500/50 hover:bg-sky-500/10"
                }`}
              >
                {provedorDetectado === "outlook" && (
                  <span className="absolute -top-2 rounded-full bg-sky-500 px-2 py-0.2 text-[9px] font-black uppercase text-white shadow-sm">
                    Seu e-mail
                  </span>
                )}
                {/* Logotipo Oficial do Outlook */}
                <svg
                  className="h-7 w-7 transition-transform group-hover:scale-110"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="24" height="24" rx="4" fill="#0078D4" />
                  <path
                    d="M17.5 7H11.5C10.67 7 10 7.67 10 8.5V15.5C10 16.33 10.67 17 11.5 17H17.5C18.33 17 19 16.33 19 15.5V8.5C19 7.67 18.33 7 17.5 7Z"
                    fill="#28A8EA"
                  />
                  <path
                    d="M10 9L14.5 12.5L19 9V8.5C19 7.67 18.33 7 17.5 7H11.5C10.67 7 10 7.67 10 8.5V9Z"
                    fill="#50E6FF"
                  />
                  <path
                    d="M9 10C7.34 10 6 11.34 6 13C6 14.66 7.34 16 9 16C10.66 16 12 14.66 12 13C12 11.34 10.66 10 9 10Z"
                    fill="#005A9E"
                  />
                  <path
                    d="M9 11C7.9 11 7 11.9 7 13C7 14.1 7.9 15 9 15C10.1 15 11 14.1 11 13C11 11.9 10.1 11 9 11Z"
                    fill="#FFFFFF"
                  />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-white group-hover:text-sky-400">
                    Outlook
                  </span>
                  <span className="text-[10px] text-stone-400">Hotmail</span>
                </div>
              </a>

              {/* 3. YAHOO MAIL (YAHOO) */}
              <a
                href="https://mail.yahoo.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`relative group flex flex-col items-center justify-center gap-2 rounded-2xl border p-3.5 transition-all text-center ${
                  provedorDetectado === "yahoo"
                    ? "border-purple-500/80 bg-purple-950/30 ring-2 ring-purple-500/50 shadow-lg shadow-purple-950/40"
                    : "border-white/10 bg-white/[0.03] hover:border-purple-500/50 hover:bg-purple-500/10"
                }`}
              >
                {provedorDetectado === "yahoo" && (
                  <span className="absolute -top-2 rounded-full bg-purple-500 px-2 py-0.2 text-[9px] font-black uppercase text-white shadow-sm">
                    Seu e-mail
                  </span>
                )}
                {/* Logotipo Oficial do Yahoo */}
                <svg
                  className="h-7 w-7 transition-transform group-hover:scale-110"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="24" height="24" rx="4" fill="#6001D2" />
                  <path
                    d="M7 6.5L10.5 13V18H13.5V13L17 6.5H13.8L12 10.4L10.2 6.5H7Z"
                    fill="#FFFFFF"
                  />
                  <circle cx="18" cy="17" r="1.5" fill="#FFFFFF" />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-white group-hover:text-purple-400">
                    Yahoo!
                  </span>
                  <span className="text-[10px] text-stone-400">Mail</span>
                </div>
              </a>

              {/* 4. ICLOUD MAIL (APPLE) */}
              <a
                href="https://www.icloud.com/mail"
                target="_blank"
                rel="noopener noreferrer"
                className={`relative group flex flex-col items-center justify-center gap-2 rounded-2xl border p-3.5 transition-all text-center ${
                  provedorDetectado === "icloud"
                    ? "border-blue-400/80 bg-blue-950/30 ring-2 ring-blue-400/50 shadow-lg shadow-blue-950/40"
                    : "border-white/10 bg-white/[0.03] hover:border-blue-400/50 hover:bg-blue-400/10"
                }`}
              >
                {provedorDetectado === "icloud" && (
                  <span className="absolute -top-2 rounded-full bg-blue-500 px-2 py-0.2 text-[9px] font-black uppercase text-white shadow-sm">
                    Seu e-mail
                  </span>
                )}
                {/* Logotipo Oficial do iCloud */}
                <svg
                  className="h-7 w-7 transition-transform group-hover:scale-110"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="24" height="24" rx="4" fill="#1C1C1E" />
                  <path
                    d="M17.4 11.2C17.1 9.4 15.6 8 13.8 8C12.5 8 11.4 8.7 10.8 9.7C10.4 9.5 9.9 9.4 9.5 9.4C7.8 9.4 6.4 10.8 6.4 12.5C6.4 12.7 6.4 12.9 6.5 13.1C5.1 13.4 4 14.6 4 16.1C4 17.8 5.3 19.1 7 19.1H17C18.7 19.1 20 17.7 20 16C20 14.4 18.9 13.2 17.4 13C17.4 12.4 17.4 11.8 17.4 11.2Z"
                    fill="url(#icloud-grad)"
                  />
                  <defs>
                    <linearGradient
                      id="icloud-grad"
                      x1="4"
                      y1="8"
                      x2="20"
                      y2="19.1"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#369BFF" />
                      <stop offset="1" stopColor="#5AC8FA" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-white group-hover:text-blue-300">
                    iCloud
                  </span>
                  <span className="text-[10px] text-stone-400">Apple</span>
                </div>
              </a>
            </div>

            {/* Opção para Outro E-mail */}
            <div className="mt-3 text-center">
              <span className="text-[11px] text-stone-400">
                Usa outro provedor corporativo ou personalizado? Acesse seu Webmail normalmente.
              </span>
            </div>
          </div>
        </div>

        {/* ── PASSO A PASSO VISUAL DETALHADO ── */}
        <section className="mt-8 w-full text-left">
          <div className="flex items-center gap-2 mb-4 px-1">
            <Sparkles className="h-4 w-4 text-orange-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-200">
              Passo a Passo Para o Seu Primeiro Acesso
            </h3>
          </div>

          <div className="space-y-3">
            {/* ETAPA 1 */}
            <div className="rounded-2xl border border-white/10 bg-[#101115] p-4.5 sm:p-5 flex items-start gap-4 transition-all hover:border-white/20">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 font-extrabold text-sm">
                1
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  Abra a caixa de entrada do seu e-mail
                </h4>
                <p className="mt-1 text-xs text-stone-300 leading-relaxed">
                  Acesse o mesmo e-mail que você utilizou para pagar na Hotmart (Gmail, Outlook, Yahoo, iCloud ou seu webmail).
                </p>
              </div>
            </div>

            {/* ETAPA 2 */}
            <div className="rounded-2xl border border-white/10 bg-[#101115] p-4.5 sm:p-5 flex items-start gap-4 transition-all hover:border-white/20">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 font-extrabold text-sm">
                2
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 flex-wrap">
                  <span>Encontre o e-mail de definição de senha</span>
                  <span className="rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-1.5 py-0.2 font-semibold">
                    Importante
                  </span>
                </h4>
                <p className="mt-1 text-xs text-stone-300 leading-relaxed">
                  Procure pelo e-mail com o assunto <strong className="text-white">"Defina sua senha de acesso"</strong> ou <strong className="text-white">"Recuperação de Acesso"</strong>.
                </p>
                <div className="mt-2 rounded-lg bg-white/[0.04] border border-white/10 p-2.5 text-[11px] text-stone-300 flex items-start gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Dica essencial:</strong> Se não encontrar em 2 minutos, procure na pasta de <strong className="text-white">Spam</strong>, <strong className="text-white">Lixo Eletrônico</strong> ou na aba <strong className="text-white">Promoções</strong>.
                  </span>
                </div>
              </div>
            </div>

            {/* ETAPA 3 */}
            <div className="rounded-2xl border border-white/10 bg-[#101115] p-4.5 sm:p-5 flex items-start gap-4 transition-all hover:border-white/20">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 font-extrabold text-sm">
                3
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  Clique no botão do e-mail e crie sua senha
                </h4>
                <p className="mt-1 text-xs text-stone-300 leading-relaxed">
                  Ao clicar no link seguro, você será direcionado para criar sua senha pessoal. Digite sua nova senha de no mínimo 6 dígitos e confirme.
                </p>
              </div>
            </div>

            {/* ETAPA 4 */}
            <div className="rounded-2xl border border-white/10 bg-[#101115] p-4.5 sm:p-5 flex items-start gap-4 transition-all hover:border-white/20">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-extrabold text-sm">
                4
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  Pronto! Acesse o Organiz.AI
                </h4>
                <p className="mt-1 text-xs text-stone-300 leading-relaxed">
                  Com sua senha definida, você já pode entrar na plataforma e começar a utilizar a IA e todos os recursos liberados para sua conta!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── BOTÕES DE AÇÃO: IR PARA LOGIN OU CHAMAR SUPORTE ── */}
        <div className="mt-8 w-full flex flex-col gap-3">
          {/* Botão Principal: Ir para o Login */}
          <Link
            to="/login"
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:brightness-110 active:scale-[0.99] py-3.5 px-6 text-sm font-black text-black shadow-lg shadow-orange-950/60 transition-all"
          >
            <KeyRound className="h-4 w-4" />
            <span>Já criei minha senha • Ir para o Login</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          {/* Botão Secundário: Suporte WhatsApp */}
          <a
            href={supportWppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 hover:bg-emerald-950/70 hover:border-emerald-500/50 py-3.5 px-6 text-xs sm:text-sm font-bold text-emerald-300 transition-all active:scale-[0.99]"
          >
            <MessageCircle className="h-4 w-4 text-emerald-400" />
            <span>Precisa de ajuda com seu acesso? Falar no WhatsApp</span>
          </a>
        </div>

        {/* ── GARANTIAS E TRANQUILIDADE ── */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-[11px] text-stone-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Ambiente 100% Criptografado</span>
          </div>
          <span className="text-stone-600">•</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-orange-400" />
            <span>Garantia de 7 dias Hotmart</span>
          </div>
          <span className="text-stone-600">•</span>
          <div className="flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-sky-400" />
            <span>Suporte da Equipe</span>
          </div>
        </div>
      </main>
    </div>
  );
}
