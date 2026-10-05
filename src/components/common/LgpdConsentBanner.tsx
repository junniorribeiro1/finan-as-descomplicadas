import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, X, Check, Cookie } from "lucide-react";
import { setPixelConsent } from "@/lib/meta-pixel";

const LGPD_STORAGE_KEY = "organizai_lgpd_consent_v2";

export function LgpdConsentBanner() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(LGPD_STORAGE_KEY);
      if (!consent) {
        // Pequeno atraso para não causar layout shift instantâneo
        const timer = setTimeout(() => setVisivel(true), 1200);
        return () => clearTimeout(timer);
      } else {
        // Aplica consentimento prévio ao Google Analytics e Meta Pixel
        const parsed = JSON.parse(consent) as { analytics?: boolean };
        const granted = !!parsed.analytics;
        setPixelConsent(granted);

        if (typeof window !== "undefined" && typeof (window as unknown as { gtag?: Function }).gtag === "function") {
          (window as unknown as { gtag: Function }).gtag("consent", "update", {
            analytics_storage: granted ? "granted" : "denied",
            ad_storage: "denied",
          });
        }
      }
    } catch {
      // Ignora erro de local storage
    }
  }, []);

  const salvarConsentimento = (analytics: boolean) => {
    try {
      const consentData = {
        accepted: true,
        analytics,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(LGPD_STORAGE_KEY, JSON.stringify(consentData));

      // Atualiza consentimento no Meta Pixel
      setPixelConsent(analytics);

      if (typeof window !== "undefined" && typeof (window as unknown as { gtag?: Function }).gtag === "function") {
        (window as unknown as { gtag: Function }).gtag("consent", "update", {
          analytics_storage: analytics ? "granted" : "denied",
          ad_storage: "denied",
        });
      }
    } catch {
      // Ignora erro de local storage
    }
    setVisivel(false);
  };

  if (!visivel) return null;

  return (
    <aside
      aria-label="Consentimento de Cookies e Privacidade LGPD"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-3xl rounded-2xl border border-zinc-800 bg-[#0c0a09]/95 p-4 shadow-2xl backdrop-blur-xl transition-all animate-in fade-in slide-in-from-bottom-5 sm:bottom-6 sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              Privacidade & Proteção de Dados (LGPD)
            </h3>
            <p className="text-xs leading-relaxed text-zinc-400">
              Utilizamos cookies essenciais para autenticação segura e dados anonimizados para aprimorar sua experiência. Seus dados financeiros são estritamente confidenciais e protegidos por Row Level Security (RLS). Saiba mais em nossa{" "}
              <Link
                to="/politica-de-privacidade"
                className="font-medium text-emerald-400 underline underline-offset-2 hover:text-emerald-300"
              >
                Política de Privacidade
              </Link>{" "}
              e{" "}
              <Link
                to="/termos-de-uso"
                className="font-medium text-emerald-400 underline underline-offset-2 hover:text-emerald-300"
              >
                Termos de Uso
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-stretch sm:gap-1.5">
          <button
            type="button"
            onClick={() => salvarConsentimento(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-zinc-950 transition-all hover:bg-emerald-400 active:scale-95 shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
            Aceitar Todos
          </button>
          <button
            type="button"
            onClick={() => salvarConsentimento(false)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white cursor-pointer"
          >
            Apenas Essenciais
          </button>
        </div>
      </div>
    </aside>
  );
}
