import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Check, ArrowRight, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";

export const Route = createFileRoute("/passo-a-passo")({
  head: () => ({
    meta: [
      { title: "Passo a passo — OrganizAI" },
      {
        name: "description",
        content: "Complete estas etapas para tirar o máximo do OrganizAI.",
      },
    ],
  }),
  component: PassoAPasso,
});

interface PassoItem {
  id: string;
  numero: string;
  titulo: string;
  descricao: string;
  link: string;
}

const passosIniciais: PassoItem[] = [
  {
    id: "passo-1",
    numero: "01",
    titulo: "Cadastre seus recebimentos",
    descricao: "Adicione salário e outras fontes de renda.",
    link: "/recebimentos",
  },
  {
    id: "passo-2",
    numero: "02",
    titulo: "Lance seus gastos fixos",
    descricao: "Aluguel, contas de casa, assinaturas.",
    link: "/gastos-fixos",
  },
  {
    id: "passo-3",
    numero: "03",
    titulo: "Cadastre seus cartões",
    descricao: "Bandeira, limite e dias de fechamento/vencimento.",
    link: "/cartao-de-credito",
  },
  {
    id: "passo-4",
    numero: "04",
    titulo: "Crie sua Reserva de Emergência",
    descricao: "Comece com uma meta de 6x seus gastos fixos.",
    link: "/cofrinhos",
  },
  {
    id: "passo-5",
    numero: "05",
    titulo: "Categorize seus gastos",
    descricao: "Facilita ver para onde vai seu dinheiro.",
    link: "/categorias",
  },
  {
    id: "passo-6",
    numero: "06",
    titulo: "Convide um segundo usuário",
    descricao: "Opcional. Compartilhe com quem organiza junto.",
    link: "/segundo-usuario",
  },
  {
    id: "passo-7",
    numero: "07",
    titulo: "Ative a Vera",
    descricao: "Sua gerente financeira com IA para tirar dúvidas.",
    link: "/vera-gerente",
  },
];

const STORAGE_KEY = "organizais_passos_concluidos_v1";

function PassoAPasso() {
  const [concluidos, setConcluidos] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const salvo = localStorage.getItem(STORAGE_KEY);
      return salvo ? JSON.parse(salvo) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(concluidos));
    } catch {
      // Ignora erro de storage
    }
  }, [concluidos]);

  const toggleConcluido = (id: string, titulo: string) => {
    setConcluidos((prev) => {
      const estaConcluido = prev.includes(id);
      if (estaConcluido) {
        toast.info(`Passo marcado como pendente`);
        return prev.filter((item) => item !== id);
      } else {
        const novos = [...prev, id];
        if (novos.length === passosIniciais.length) {
          try {
            confetti({
              particleCount: 90,
              spread: 80,
              origin: { y: 0.6 },
              colors: ["#F97316", "#10B981", "#8B5CF6", "#F59E0B", "#3B82F6"],
            });
          } catch {
            // No-op
          }
          toast.success("Parabéns! Você completou todos os 7 passos!");
        } else {
          toast.success(`"${titulo}" concluído!`);
        }
        return novos;
      }
    });
  };

  const totalPassos = passosIniciais.length;
  const qtdConcluidos = concluidos.length;
  const porcentagem = Math.round((qtdConcluidos / totalPassos) * 100);

  // SVG Gauge calculations
  const raio = 26;
  const circunferencia = 2 * Math.PI * raio;
  const offset = circunferencia - (porcentagem / 100) * circunferencia;

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Header Superior com Ícone 3D de Prancheta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-[#161618] p-1.5 shadow-xl shadow-black/50 sm:h-14 sm:w-14">
              <img
                src="/icons/kpi/passo-header@2x.png"
                alt="Passo a passo"
                className="h-full w-full object-contain drop-shadow-[0_2px_8px_rgba(249,115,22,0.25)]"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Passo a passo
              </h1>
              <p className="mt-1 text-xs text-neutral-400 sm:text-sm">
                Complete estas etapas para tirar o máximo do OrganizAI.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("organizai_passos_dismissed_v1");
              toast.success("Widget flutuante ativado no canto inferior direito!");
              window.location.reload();
            }}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-medium text-stone-300 transition-colors cursor-pointer"
            title="Reativar widget flutuante no canto da tela"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restaurar Widget Flutuante</span>
          </button>
        </div>

        {/* Card de Progresso */}
        <div className="mt-8 rounded-2xl border border-white/[0.08] bg-[#161618] p-5 shadow-xl sm:rounded-3xl sm:p-7">
          <div className="flex items-center gap-5 sm:gap-6">
            {/* Medidor Circular */}
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center sm:h-16 sm:w-16">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 64 64">
                {/* Trilha de fundo */}
                <circle
                  cx="32"
                  cy="32"
                  r={raio}
                  className="stroke-neutral-800"
                  strokeWidth="5"
                  fill="transparent"
                />
                {/* Trilha preenchida */}
                <circle
                  cx="32"
                  cy="32"
                  r={raio}
                  className="stroke-orange-500 transition-all duration-500"
                  strokeWidth="5"
                  strokeDasharray={circunferencia}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-xs font-bold text-white sm:text-sm">
                {porcentagem}%
              </span>
            </div>

            {/* Textos de Progresso */}
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 sm:text-[11px]">
                Seu progresso
              </span>
              <h2 className="mt-0.5 text-base font-bold text-white sm:text-lg">
                {qtdConcluidos} de {totalPassos} passos concluídos
              </h2>
              <p className="mt-0.5 text-xs text-neutral-400">
                Marque cada etapa conforme for concluindo.
              </p>

              {/* Barra Horizontal */}
              <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-800/80">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                  style={{ width: `${porcentagem}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lista das 7 Etapas */}
        <div className="mt-6 space-y-3">
          {passosIniciais.map((passo) => {
            const isDone = concluidos.includes(passo.id);
            return (
              <div
                key={passo.id}
                onClick={() => toggleConcluido(passo.id, passo.titulo)}
                className={`group relative flex items-center justify-between rounded-2xl border bg-[#161618] px-4 py-3.5 transition-all duration-200 cursor-pointer sm:px-5 sm:py-4 ${
                  isDone
                    ? "border-emerald-500/30 bg-[#161917]"
                    : "border-white/[0.06] hover:border-orange-500/50 hover:bg-[#19191c]"
                }`}
              >
                {/* Lado Esquerdo: Número e Textos */}
                <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-semibold transition-colors sm:h-9 sm:w-9 ${
                      isDone
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-white/[0.04] text-neutral-400 group-hover:text-white"
                    }`}
                  >
                    {passo.numero}
                  </div>

                  <div className="min-w-0">
                    <h3
                      className={`text-xs sm:text-sm font-semibold transition-colors ${
                        isDone
                          ? "text-neutral-300 line-through opacity-85"
                          : "text-white group-hover:text-white"
                      }`}
                    >
                      {passo.titulo}
                    </h3>
                    <p className="mt-0.5 truncate text-[11px] text-neutral-400 sm:text-xs">
                      {passo.descricao}
                    </p>
                  </div>
                </div>

                {/* Lado Direito: Círculo de Seleção + Link de Atalho */}
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <Link
                    to={passo.link}
                    onClick={(e) => e.stopPropagation()}
                    className="hidden text-neutral-500 hover:text-orange-400 transition-colors sm:block"
                    title={`Ir para ${passo.titulo}`}
                  >
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>

                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200 ${
                      isDone
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30 ring-2 ring-orange-500/40"
                        : "border-2 border-neutral-600 group-hover:border-orange-500/70"
                    }`}
                  >
                    {isDone && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
