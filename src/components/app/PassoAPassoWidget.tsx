import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  ListChecks,
  Check,
  X,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Trophy,
  RotateCcw,
} from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface PassoItem {
  id: string;
  numero: number;
  titulo: string;
  descricao: string;
  link: string;
}

export const passosIniciais: PassoItem[] = [
  {
    id: "passo-1",
    numero: 1,
    titulo: "Gastos fixos",
    descricao: "Cadastre suas contas recorrentes (aluguel, luz, internet)",
    link: "/gastos-fixos",
  },
  {
    id: "passo-2",
    numero: 2,
    titulo: "Gastos variáveis",
    descricao: "Lance despesas do dia a dia (mercado, farmácia, lazer)",
    link: "/gastos-variaveis",
  },
  {
    id: "passo-3",
    numero: 3,
    titulo: "Cartões de crédito",
    descricao: "Adicione seus cartões, limites e datas de fechamento",
    link: "/cartao-de-credito",
  },
  {
    id: "passo-4",
    numero: 4,
    titulo: "Recebimentos",
    descricao: "Anote seus salários, pró-labore e rendas extras",
    link: "/recebimentos",
  },
  {
    id: "passo-5",
    numero: 5,
    titulo: "Cofrinhos",
    descricao: "Crie metas de reserva e objetivos financeiros",
    link: "/cofrinhos",
  },
  {
    id: "passo-6",
    numero: 6,
    titulo: "Bancos",
    descricao: "Cadastre suas contas bancárias e saldos atuais",
    link: "/bancos",
  },
  {
    id: "passo-7",
    numero: 7,
    titulo: "Vera | Gerente",
    descricao: "Converse com sua assistente financeira com IA",
    link: "/vera-gerente",
  },
];

export const STORAGE_KEY = "organizais_passos_concluidos_v1";
export const DISMISSED_KEY = "organizai_passos_dismissed_v1";

interface Balloon {
  id: number;
  left: number;
  size: number;
  color: string;
  riseDuration: number;
  swayDuration: number;
  delay: number;
}

const BALLOON_COLORS = [
  "#F97316", // Orange OrganizAI
  "#EF4444", // Red
  "#10B981", // Emerald
  "#8B5CF6", // Purple
  "#3B82F6", // Blue
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#06B6D4", // Cyan
];

function FloatingBalloons() {
  const [balloons, setBalloons] = useState<Balloon[]>([]);

  useEffect(() => {
    const list: Balloon[] = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: Math.floor(Math.random() * 92) + 4, // 4% to 96%
      size: Math.floor(Math.random() * 24) + 48, // 48px to 72px
      color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      riseDuration: 4.5 + Math.random() * 2.5,
      swayDuration: 2 + Math.random() * 1.5,
      delay: Math.random() * 1.2,
    }));
    setBalloons(list);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {balloons.map((b) => (
        <div
          key={b.id}
          className="balloon-rise-animation absolute bottom-0 select-none"
          style={
            {
              left: `${b.left}%`,
              animationDelay: `${b.delay}s`,
              "--rise-duration": `${b.riseDuration}s`,
              "--sway-duration": `${b.swayDuration}s`,
            } as React.CSSProperties
          }
        >
          {/* Corpo do Balão */}
          <div
            className="relative flex flex-col items-center"
            style={{
              width: `${b.size}px`,
              height: `${b.size * 1.25}px`,
            }}
          >
            {/* Balão 3D Oval com Gradiente e Brilho */}
            <div
              className="relative h-full w-full rounded-[50%_50%_50%_50%_/_40%_40%_60%_60%] shadow-2xl"
              style={{
                backgroundColor: b.color,
                backgroundImage: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 65%), linear-gradient(to bottom, transparent, rgba(0,0,0,0.3))`,
                boxShadow: `0 10px 25px -5px ${b.color}80, inset -3px -5px 12px rgba(0,0,0,0.35)`,
              }}
            >
              {/* Brilho esférico reflexivo */}
              <div className="absolute left-[20%] top-[15%] h-3 w-4 rounded-full bg-white/60 blur-[1px] transform -rotate-45" />
            </div>

            {/* Nó do Balão */}
            <div
              className="h-1.5 w-2 rounded-sm"
              style={{ backgroundColor: b.color, filter: "brightness(0.85)" }}
            />

            {/* Cordão ondulado */}
            <svg
              width="12"
              height="55"
              viewBox="0 0 12 55"
              fill="none"
              className="overflow-visible opacity-70"
            >
              <path
                d="M6 0 C2 12, 10 24, 6 36 C2 48, 10 52, 6 55"
                stroke="rgba(255, 255, 255, 0.7)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PassoAPassoWidget() {
  const [aberto, setAberto] = useState(false);
  const [concluidos, setConcluidos] = useState<string[]>([]);
  const [isDismissed, setIsDismissed] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Carrega estado salvo do localStorage e escuta eventos de sincronização
  useEffect(() => {
    setMounted(true);

    const recarregar = () => {
      if (typeof window === "undefined") return;
      try {
        const savedConcluidos = localStorage.getItem(STORAGE_KEY);
        const savedDismissed = localStorage.getItem(DISMISSED_KEY);

        if (savedConcluidos) {
          const parsed = JSON.parse(savedConcluidos);
          if (Array.isArray(parsed)) {
            setConcluidos(parsed);
          }
        }

        if (savedDismissed === "true") {
          setIsDismissed(true);
        } else {
          setIsDismissed(false);
        }
      } catch {
        // Fallback limpo
      }
    };

    recarregar();

    window.addEventListener("organizai_passo_sync", recarregar);
    window.addEventListener("storage", recarregar);

    return () => {
      window.removeEventListener("organizai_passo_sync", recarregar);
      window.removeEventListener("storage", recarregar);
    };
  }, []);

  const totalPassos = passosIniciais.length;
  const qtdConcluidos = concluidos.length;
  const isTudoConcluido = qtdConcluidos === totalPassos;
  const porcentagem = Math.round((qtdConcluidos / totalPassos) * 100);

  const dispararCelebracao = () => {
    setShowCelebration(true);

    // Canhões de confete multidirecionais
    try {
      // Tiro 1: Centro
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.65, x: 0.5 },
        colors: ["#F97316", "#10B981", "#8B5CF6", "#F59E0B", "#3B82F6", "#EC4899"],
      });

      // Tiro 2: Esquerda
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 60,
          origin: { x: 0.15, y: 0.75 },
          colors: ["#F97316", "#10B981", "#8B5CF6", "#F59E0B"],
        });
      }, 250);

      // Tiro 3: Direita
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 60,
          origin: { x: 0.85, y: 0.75 },
          colors: ["#3B82F6", "#EC4899", "#10B981", "#F97316"],
        });
      }, 400);

      // Tiro 4: Estrelas douradas
      setTimeout(() => {
        confetti({
          particleCount: 40,
          spread: 100,
          origin: { y: 0.5, x: 0.5 },
          shapes: ["star"],
          colors: ["#FFD700", "#FFA500", "#F97316"],
        });
      }, 700);
    } catch {
      // Fallback gracioso caso canvas-confetti não esteja disponível
    }

    toast.success("Parabéns! Você completou todos os 7 passos do OrganizAI!", {
      duration: 5000,
    });

    // Desaparece após a celebração (4.5 segundos)
    setTimeout(() => {
      finalizarEDesaparecer();
    }, 4500);
  };

  const toggleConcluido = (id: string, titulo: string) => {
    setConcluidos((prev) => {
      let novos: string[];
      if (prev.includes(id)) {
        novos = prev.filter((item) => item !== id);
        toast.info(`Passo marcado como pendente: ${titulo}`);
      } else {
        novos = [...prev, id];
        toast.success(`Etapa concluída: ${titulo}!`);

        // Se acabou de completar todos os 7 passos
        if (novos.length === totalPassos) {
          setTimeout(() => {
            dispararCelebracao();
          }, 300);
        }
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(novos));
      }
      return novos;
    });
  };

  const finalizarEDesaparecer = () => {
    setShowCelebration(false);
    setAberto(false);
    setIsDismissed(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(DISMISSED_KEY, "true");
    }
  };

  // Se ainda não montou no cliente ou foi dispensado após conclusão, não renderiza o botão flutuante
  if (!mounted || isDismissed) {
    return showCelebration ? <FloatingBalloons /> : null;
  }

  return (
    <>
      {/* Balões flutuantes animados na tela */}
      {showCelebration && <FloatingBalloons />}

      {/* Pop-up Flutuante com Checklist de Passos */}
      {aberto && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[360px] sm:w-[390px] max-w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#161618] p-5 sm:p-6 shadow-2xl shadow-black/80 backdrop-blur-xl">
            {/* Feixe sutil superior */}
            <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 h-20 w-3/4 rounded-full bg-gradient-to-b from-orange-500/20 to-transparent blur-xl" />

            {/* Cabeçalho do Pop-up */}
            <div className="relative z-10 flex items-start justify-between gap-3 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/30 text-[#F97316] shadow-md shadow-orange-950/40">
                  <ListChecks className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-white tracking-tight">
                    Passo a passo
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    {qtdConcluidos} de {totalPassos} passos ({porcentagem}%)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setAberto(false)}
                  className="grid h-8 w-8 place-items-center rounded-xl text-stone-400 hover:text-white hover:bg-white/5 transition-colors"
                  title="Minimizar"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Barra de Progresso Horizontal */}
            <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                style={{ width: `${porcentagem}%` }}
              />
            </div>

            {/* Mensagem de Conclusão ou Lista de Passos */}
            {isTudoConcluido ? (
              <div className="py-6 text-center animate-in zoom-in-95 duration-200">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-950/40 mb-3">
                  <Trophy className="h-7 w-7 animate-bounce" />
                </div>
                <h4 className="text-base font-bold text-white">Tudo Pronto! 🎉</h4>
                <p className="mt-1 text-xs text-stone-300 leading-relaxed px-2">
                  Parabéns! Você completou todas as etapas iniciais do OrganizAI.
                </p>
                <div className="mt-5 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={finalizarEDesaparecer}
                    className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-950/40 transition-all cursor-pointer"
                  >
                    Concluir e Fechar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setConcluidos([]);
                      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
                    }}
                    className="inline-flex items-center justify-center gap-1.5 py-1 text-[11px] text-stone-400 hover:text-stone-200 transition-colors"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reiniciar passos
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-3.5 max-h-[360px] overflow-y-auto space-y-2 pr-1">
                {passosIniciais.map((p) => {
                  const isDone = concluidos.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => toggleConcluido(p.id, p.titulo)}
                      className={cn(
                        "group flex items-center justify-between rounded-2xl border p-2.5 sm:p-3 transition-all cursor-pointer",
                        isDone
                          ? "bg-emerald-500/5 border-emerald-500/20"
                          : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-orange-500/40"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Checkbox redonda */}
                        <div
                          className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-200",
                            isDone
                              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm ring-2 ring-orange-500/40"
                              : "border-2 border-neutral-600 group-hover:border-orange-500"
                          )}
                        >
                          {isDone && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
                        </div>

                        <div className="min-w-0">
                          <p
                            className={cn(
                              "text-xs font-semibold leading-tight transition-colors",
                              isDone
                                ? "text-stone-400 line-through"
                                : "text-white group-hover:text-white"
                            )}
                          >
                            {p.numero}. {p.titulo}
                          </p>
                          <p className="text-[10px] text-stone-400 truncate mt-0.5 max-w-[200px] sm:max-w-[230px]">
                            {p.descricao}
                          </p>
                        </div>
                      </div>

                      {/* Botão de Atalho para a página */}
                      <Link
                        to={p.link}
                        onClick={(e) => {
                          e.stopPropagation();
                          setAberto(false);
                        }}
                        className="p-1 text-stone-400 hover:text-[#F97316] transition-colors shrink-0"
                        title={`Ir para ${p.titulo}`}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Rodapé com link para visão detalhada */}
            {!isTudoConcluido && (
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                <Link
                  to="/passo-a-passo"
                  onClick={() => setAberto(false)}
                  className="text-stone-400 hover:text-[#F97316] transition-colors flex items-center gap-1 font-medium"
                >
                  <span>Ver página completa</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>

                <button
                  type="button"
                  onClick={() => setAberto(false)}
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  Minimizar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ícone Flutuante no Canto Inferior Direito */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setAberto(!aberto)}
          className={cn(
            "group relative flex items-center gap-2.5 rounded-full px-4 py-3 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer",
            aberto
              ? "bg-stone-900 border border-white/20 text-white"
              : "bg-gradient-to-r from-orange-500 via-amber-500 to-[#F97316] text-white shadow-orange-950/50 hover:brightness-110"
          )}
          title="Passo a passo OrganizAI"
          aria-label="Abrir Passo a Passo"
        >
          {/* Indicador de pulso de atenção */}
          {!isTudoConcluido && !aberto && (
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 ring-2 ring-[#0d0d0d]" />
            </span>
          )}

          <div className="flex h-6 w-6 items-center justify-center">
            {aberto ? (
              <X className="h-4 w-4" />
            ) : (
              <ListChecks className="h-5 w-5 transition-transform group-hover:scale-110" />
            )}
          </div>

          <span className="text-xs font-bold tracking-tight">Passo a passo</span>

          {/* Badge de Progresso */}
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-black",
              aberto ? "bg-white/10 text-stone-200" : "bg-black/30 text-white"
            )}
          >
            {qtdConcluidos}/{totalPassos}
          </span>
        </button>
      </div>
    </>
  );
}
