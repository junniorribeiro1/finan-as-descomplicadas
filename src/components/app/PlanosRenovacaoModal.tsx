import { useState } from "react";
import {
  X,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Calendar,
  Clock,
  ArrowUpRight,
  Lock,
  Crown,
  Info,
} from "lucide-react";
import {
  PLANS_BY_CATEGORY,
  getPlanByCode,
  normalizeAccountType,
  checkUserAccess,
  type CanonicalPlanCode,
  type PlanCategory,
} from "@/lib/plans";
import { cn } from "@/lib/utils";

interface PlanosRenovacaoModalProps {
  aberto: boolean;
  onFechar: () => void;
  planoAtualCodigo?: string | null;
  accessExpiresAt?: string | null;
  accountType?: string | null;
  isPermanentAccess?: boolean;
}

export function PlanosRenovacaoModal({
  aberto,
  onFechar,
  planoAtualCodigo,
  accessExpiresAt,
  accountType,
  isPermanentAccess,
}: PlanosRenovacaoModalProps) {
  const modalidade = normalizeAccountType(accountType);

  // Inicializa a aba conforme a modalidade do usuário
  const [categoriaAtiva, setCategoriaAtiva] = useState<"PF" | "PJ" | "COMBO">(() => {
    if (modalidade === "pj") return "PJ";
    if (modalidade === "pfj") return "COMBO";
    return "PF";
  });

  if (!aberto) return null;

  const planoAtual = getPlanByCode(planoAtualCodigo);
  const infoAcesso = checkUserAccess({
    plan: planoAtualCodigo,
    access_expires_at: accessExpiresAt,
    status: "ativo",
  });

  const planosDaCategoria = PLANS_BY_CATEGORY[categoriaAtiva];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={onFechar}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-4xl my-auto overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#18161b] via-[#121114] to-[#0d0d0f] shadow-2xl shadow-orange-950/20 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow decorativo de fundo */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-gradient-to-tr from-orange-500/20 via-amber-500/15 to-purple-500/10 blur-3xl opacity-70" />

        {/* Header do Modal */}
        <div className="relative p-6 sm:p-8 pb-4 border-b border-white/[0.06] flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/15 border border-orange-500/30 px-3 py-1 text-[11px] font-bold text-[#F97316] mb-2.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Planos & Renovação Organiz.AI</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
              Escolha seu plano para renovar ou evoluir
            </h2>
            <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
              Mantenha o controle completo da sua vida financeira com inteligência artificial,
              metas guiadas e acompanhamento da mentoria.
            </p>
          </div>

          <button
            type="button"
            onClick={onFechar}
            className="rounded-full p-2 text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            aria-label="Fechar modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Card Informativo do Plano Atual + Regra Cumulativa */}
        <div className="relative px-6 sm:px-8 py-4 bg-white/[0.02]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Box do Plano Atual */}
            <div className="rounded-2xl border border-white/10 bg-[#16151a] p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400">
                  <Crown className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                    Seu Plano Atual
                  </span>
                  <p className="text-sm font-bold text-white truncate">
                    {planoAtual.name}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                {isPermanentAccess || planoAtual.code === "vitalicio" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/20 border border-purple-500/30 px-2.5 py-0.5 text-[11px] font-bold text-purple-300">
                    Vitalício
                  </span>
                ) : infoAcesso.dataExpiracaoFormatada ? (
                  <div>
                    <span className="text-[10px] text-stone-400 block">Válido até</span>
                    <span className="text-xs font-bold text-emerald-400 block">
                      {infoAcesso.dataExpiracaoFormatada}
                    </span>
                    {infoAcesso.diasRestantes !== null && (
                      <span className="text-[10px] text-stone-400">
                        ({infoAcesso.diasRestantes > 0 ? `${infoAcesso.diasRestantes} dias rest.` : "Vencido"})
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-stone-500/20 border border-stone-500/30 px-2.5 py-0.5 text-[11px] font-medium text-stone-300">
                    Sem expiração
                  </span>
                )}
              </div>
            </div>

            {/* Box de Vigência Cumulativa */}
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.04] p-3.5 flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5">
                <Zap className="h-4 w-4" />
              </div>
              <div className="text-xs text-stone-300 leading-snug">
                <strong className="text-emerald-400 block font-semibold mb-0.5">
                  Vigência Cumulativa Garantida
                </strong>
                Ao renovar antes do término, o novo período é <strong>somado ao seu vencimento atual</strong>.
                Você nunca perde os dias já contratados!
              </div>
            </div>
          </div>
        </div>

        {/* Abas de Categorias: PF, PJ, COMBO */}
        <div className="relative px-6 sm:px-8 pt-3 pb-2 flex items-center justify-center">
          <div className="inline-flex items-center rounded-2xl bg-black/50 p-1 border border-white/10 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setCategoriaAtiva("PF")}
              className={cn(
                "flex-1 sm:flex-initial rounded-xl px-5 py-2 text-xs font-bold transition-all cursor-pointer",
                categoriaAtiva === "PF"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-950/40"
                  : "text-stone-400 hover:text-white hover:bg-white/[0.04]"
              )}
            >
              Pessoa Física (PF)
            </button>
            <button
              type="button"
              onClick={() => setCategoriaAtiva("PJ")}
              className={cn(
                "flex-1 sm:flex-initial rounded-xl px-5 py-2 text-xs font-bold transition-all cursor-pointer",
                categoriaAtiva === "PJ"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-950/40"
                  : "text-stone-400 hover:text-white hover:bg-white/[0.04]"
              )}
            >
              Pessoa Jurídica (PJ)
            </button>
            <button
              type="button"
              onClick={() => setCategoriaAtiva("COMBO")}
              className={cn(
                "flex-1 sm:flex-initial rounded-xl px-5 py-2 text-xs font-bold transition-all cursor-pointer",
                categoriaAtiva === "COMBO"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-950/40"
                  : "text-stone-400 hover:text-white hover:bg-white/[0.04]"
              )}
            >
              Combo PF + PJ
            </button>
          </div>
        </div>

        {/* Grade de Planos da Categoria */}
        <div className="relative p-6 sm:p-8 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {planosDaCategoria.map((plano) => {
              const ehPlanoAtual = plano.code === planoAtualCodigo;
              const ehAnual = plano.durationMonths === 12;

              return (
                <div
                  key={plano.code}
                  className={cn(
                    "relative flex flex-col justify-between rounded-2xl p-5 transition-all duration-200 border",
                    ehAnual
                      ? "border-orange-500/50 bg-gradient-to-b from-orange-500/[0.08] via-stone-900/60 to-black/80 shadow-lg shadow-orange-950/30 ring-1 ring-orange-500/30"
                      : "border-white/10 bg-[#141317]/80 hover:border-white/20 hover:bg-[#18161d]"
                  )}
                >
                  {/* Tag Superior para Destaques */}
                  {ehAnual && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-md shadow-orange-950/40">
                        <Sparkles className="h-3 w-3" />
                        Mais Econômico
                      </span>
                    </div>
                  )}

                  {ehPlanoAtual && !ehAnual && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        Plano Atual
                      </span>
                    </div>
                  )}

                  {/* Detalhes do Plano */}
                  <div>
                    <h3 className="text-base font-bold text-white mt-1">
                      {plano.shortName}
                    </h3>

                    <div className="mt-2.5">
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-2xl font-black text-white">
                          {plano.formattedPrice}
                        </span>
                      </div>

                      {plano.installments && (
                        <p className="text-[11px] text-amber-300/90 font-medium mt-0.5">
                          em até {plano.installments.count}x de {plano.installments.value}
                        </p>
                      )}

                      <p className="text-[11px] text-stone-400 mt-1">
                        Duração de {plano.durationMonths}{" "}
                        {plano.durationMonths === 1 ? "mês" : "meses"}
                      </p>
                    </div>

                    <p className="mt-3 text-xs text-stone-300 leading-snug">
                      {plano.description}
                    </p>
                  </div>

                  {/* Botão de Ação / Checkout Hotmart */}
                  <div className="mt-5 pt-3 border-t border-white/[0.08]">
                    {plano.checkoutUrl ? (
                      <a
                        href={plano.checkoutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "w-full inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-3 text-xs font-bold transition-all shadow-md",
                          ehAnual
                            ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-white shadow-orange-950/40"
                            : ehPlanoAtual
                            ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40"
                            : "bg-white/10 hover:bg-white/20 text-white hover:border-white/20"
                        )}
                      >
                        <span>{ehPlanoAtual ? "Renovar Este Plano" : "Assinar Plano"}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <span className="block text-center text-xs text-stone-500 py-2">
                        Indisponível no momento
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rodapé de Segurança e Suporte */}
          <div className="mt-6 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>
                Pagamento seguro e processamento automático via Hotmart. Acesso liberado instantaneamente.
              </span>
            </div>

            <a
              href="https://wa.me/5577981381477?text=Ol%C3%A1!%20Tenho%20d%C3%BAvidas%20sobre%20a%20renova%C3%A7%C3%A3o%20do%20meu%20plano%20no%20Organiz.AI."
              target="_blank"
              rel="noreferrer"
              className="text-[#F97316] hover:underline font-semibold shrink-0"
            >
              Falar com o suporte no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
