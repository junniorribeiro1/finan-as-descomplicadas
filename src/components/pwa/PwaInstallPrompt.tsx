import { useState, useEffect } from "react";
import { Download, X, Share2, PlusSquare, Sparkles, Smartphone, Monitor } from "lucide-react";

declare global {
  interface Window {
    __pwaInstallPrompt?: any;
  }
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [instructionMode, setInstructionMode] = useState<"none" | "ios" | "desktop">("none");
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // 1. Verifica se já está em modo standalone (já instalado)
    const standaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (standaloneMode) {
      setIsStandalone(true);
      return;
    }

    // 2. Verifica se o usuário já dispensou nesta sessão
    const dismissed = sessionStorage.getItem("organizai_pwa_dismissed");
    if (dismissed === "true") {
      return;
    }

    // 3. Detecta iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    if (isIosDevice) {
      setIsIOS(true);
    }

    // 4. Captura prompt pré-existente ou adiciona listeners
    if (window.__pwaInstallPrompt) {
      setDeferredPrompt(window.__pwaInstallPrompt);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      window.__pwaInstallPrompt = e;
      setDeferredPrompt(e);
      setIsOpen(true);
    };

    const handleCustomEvent = () => {
      if (window.__pwaInstallPrompt) {
        setDeferredPrompt(window.__pwaInstallPrompt);
        setIsOpen(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("pwa-install-available", handleCustomEvent);

    // Garante que o popup apareça na tela de login após 1 segundo se ainda não estiver instalado
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("pwa-install-available", handleCustomEvent);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setInstructionMode("ios");
      return;
    }

    const promptEvent = deferredPrompt || window.__pwaInstallPrompt;

    if (!promptEvent) {
      // Caso o navegador não suporte ou não tenha disparado beforeinstallprompt
      setInstructionMode("desktop");
      return;
    }

    setIsInstalling(true);
    try {
      promptEvent.prompt();
      const choiceResult = await promptEvent.userChoice;
      if (choiceResult.outcome === "accepted") {
        console.log("Usuário aceitou a instalação do PWA OrganizAI");
        setIsOpen(false);
        window.__pwaInstallPrompt = null;
        setDeferredPrompt(null);
      } else {
        console.log("Usuário rejeitou a instalação do PWA OrganizAI");
      }
    } catch (err) {
      console.error("Erro ao acionar prompt de instalação:", err);
      setInstructionMode("desktop");
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem("organizai_pwa_dismissed", "true");
  };

  if (isStandalone || !isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-labelledby="pwa-dialog-title"
      aria-describedby="pwa-dialog-desc"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-in fade-in slide-in-from-bottom-6 duration-300 sm:bottom-6 sm:right-6 sm:left-auto"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#141416]/95 p-5 shadow-2xl backdrop-blur-xl shadow-black/80 ring-1 ring-[#F97316]/20">
        {/* Glow de fundo */}
        <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-[#F97316]/15 blur-2xl" />

        {/* Botão de Fechar */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3 right-3 rounded-lg p-1.5 text-stone-400 hover:bg-white/5 hover:text-white transition-colors"
          aria-label="Fechar aviso de instalação"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3.5">
          {/* Ícone do App */}
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2c170d] to-[#1a1311] border border-[#F97316]/40 shadow-md shadow-orange-950/40">
            <img
              src="/logo.png"
              alt="OrganizAI"
              className="h-8 w-8 object-contain drop-shadow-[0_2px_8px_rgba(249,115,22,0.4)]"
            />
          </div>

          {/* Textos */}
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F97316]/10 px-2 py-0.5 text-[10px] font-semibold text-[#F97316] border border-[#F97316]/20">
                <Sparkles className="h-2.5 w-2.5" /> PWA Oficial
              </span>
            </div>
            <h2 id="pwa-dialog-title" className="mt-1 text-sm font-bold text-white tracking-tight">
              Instale o OrganizAI no seu aparelho
            </h2>
            <p id="pwa-dialog-desc" className="mt-0.5 text-xs text-stone-400 leading-relaxed">
              Acesso rápido com 1 clique na tela inicial, funcionamento fluido e seguro.
            </p>
          </div>
        </div>

        {/* Instruções para iOS Safari */}
        {instructionMode === "ios" && (
          <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-stone-300 animate-in fade-in">
            <p className="font-semibold text-white flex items-center gap-1.5">
              <Smartphone className="h-4 w-4 text-[#F97316]" /> No iPhone / iPad (Safari):
            </p>
            <ol className="mt-2 list-decimal list-inside space-y-1 text-stone-400 text-[11.5px]">
              <li>
                Toque no botão <Share2 className="inline h-3.5 w-3.5 text-[#F97316]" />{" "}
                <strong className="text-stone-200">Compartilhar</strong> na barra inferior do Safari.
              </li>
              <li>
                Role para baixo e toque em{" "}
                <strong className="text-stone-200">
                  <PlusSquare className="inline h-3.5 w-3.5 text-[#F97316]" /> Adicionar à Tela de Início
                </strong>
                .
              </li>
              <li>
                Toque em <strong className="text-stone-200">Adicionar</strong> no canto superior direito.
              </li>
            </ol>
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={handleDismiss}
                className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
              >
                Entendi
              </button>
            </div>
          </div>
        )}

        {/* Instruções para navegadores desktop ou sem suporte a prompt programático direto */}
        {instructionMode === "desktop" && (
          <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-stone-300 animate-in fade-in">
            <p className="font-semibold text-white flex items-center gap-1.5">
              <Monitor className="h-4 w-4 text-[#F97316]" /> Como instalar no navegador:
            </p>
            <ul className="mt-2 list-disc list-inside space-y-1 text-stone-400 text-[11.5px]">
              <li>
                Clique no ícone de <strong className="text-stone-200">Instalar</strong> (ícone de computador ou '+' na barra de endereço).
              </li>
              <li>
                Ou abra o menu de 3 pontos do navegador e selecione{" "}
                <strong className="text-stone-200">Instalar OrganizAI</strong>.
              </li>
            </ul>
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={handleDismiss}
                className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
              >
                Entendi
              </button>
            </div>
          </div>
        )}

        {/* Ações principais */}
        {instructionMode === "none" && (
          <div className="mt-4 flex items-center gap-2">
            <button
              id="installButton"
              type="button"
              onClick={handleInstallClick}
              disabled={isInstalling}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#F97316] to-[#ea580c] px-3.5 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-950/40 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              {isInstalling ? "Instalando..." : "Instalar App"}
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-xs font-medium text-stone-400 hover:bg-white/[0.08] hover:text-white transition-colors cursor-pointer"
            >
              Agora não
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
