import React from "react";
import { Lock, Sparkles, CheckCircle2, Shield } from "lucide-react";

export interface ConquistaItem {
  id: string;
  titulo: string;
  descricao: string;
}

export interface PatenteInfo {
  nivel: number;
  id: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  criterio: string;
  corHex: string;
  corBadge: string;
  corBorda: string;
  corGradiente: string;
  conquistas: ConquistaItem[];
}

export const PATENTES: PatenteInfo[] = [
  {
    nivel: 1,
    id: "aprendiz",
    titulo: "Organizador Aprendiz",
    subtitulo: "Primeiros Passos",
    descricao:
      "Concluiu todo o passo a passo inicial do OrganizAI, mapeou as primeiras contas e ativou a assistente Vera.",
    criterio: "Concluir os 7 passos do onboarding do sistema.",
    corHex: "#d97706",
    corBadge: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    corBorda: "border-amber-500/40",
    corGradiente: "from-amber-600/30 via-orange-600/15 to-transparent",
    conquistas: [
      {
        id: "passo_a_passo",
        titulo: "Passo a Passo Concluído",
        descricao: "Completou os 7 passos práticos de organização financeira.",
      },
      {
        id: "vera_ativada",
        titulo: "Assistente Vera Ativada",
        descricao: "Assistente de IA pronta para esclarecer dúvidas e guiar seu orçamento.",
      },
      {
        id: "contas_iniciais",
        titulo: "Primeiras Contas Mapeadas",
        descricao: "Bancos, cartões e despesas fixas cadastradas.",
      },
    ],
  },
  {
    nivel: 2,
    id: "guardiao",
    titulo: "Guardião do Orçamento",
    subtitulo: "Controle & Estabilidade",
    descricao:
      "Gastos fixos e variáveis 100% controlados, sem juros rotativos de cartão e acompanhamento contínuo.",
    criterio:
      "Manter o orçamento mensal no positivo e não utilizar o cheque especial.",
    corHex: "#94a3b8",
    corBadge: "bg-slate-400/20 text-slate-300 border-slate-400/40",
    corBorda: "border-slate-400/40",
    corGradiente: "from-slate-400/25 via-zinc-500/10 to-transparent",
    conquistas: [
      {
        id: "gastos_sob_controle",
        titulo: "Gastos Variáveis Dominados",
        descricao: "Despesas do dia a dia contidas dentro do limite planejado.",
      },
      {
        id: "cartao_em_dia",
        titulo: "Cartão de Crédito em Dia",
        descricao: "Faturas pagas integralmente sem parcelamentos nocivos.",
      },
      {
        id: "habito_financeiro",
        titulo: "Disciplina Registrada",
        descricao: "Acompanhamento semanal constante verificado pela mentoria.",
      },
    ],
  },
  {
    nivel: 3,
    id: "mestre_reserva",
    titulo: "Mestre da Reserva",
    subtitulo: "Segurança & Tranquilidade",
    descricao:
      "Construiu a reserva de emergência e estabeleceu metas claras nos cofrinhos para sonhos futuros.",
    criterio:
      "Atingir a meta de reserva de emergência estipulada na mentoria.",
    corHex: "#eab308",
    corBadge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
    corBorda: "border-yellow-500/40",
    corGradiente: "from-yellow-500/30 via-amber-500/15 to-transparent",
    conquistas: [
      {
        id: "reserva_construida",
        titulo: "Reserva de Emergência Formada",
        descricao: "Tranquilidade blindada para imprevistos do cotidiano.",
      },
      {
        id: "cofrinhos_ativos",
        titulo: "Metas de Sonhos Definidas",
        descricao: "Dinheiro carimbado para objetivos específicos.",
      },
      {
        id: "paz_mental",
        titulo: "Previsibilidade Blindada",
        descricao: "Ausência de ansiedade financeira no dia a dia.",
      },
    ],
  },
  {
    nivel: 4,
    id: "investidor",
    titulo: "Investidor Consciente",
    subtitulo: "Multiplicação & Patrimônio",
    descricao:
      "Aportes mensais consistentes, carteira diversificada e dinheiro trabalhando ativamente para você.",
    criterio:
      "Realizar aportes recorrentes de investimentos em pelo menos 3 meses consecutivos.",
    corHex: "#06b6d4",
    corBadge: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
    corBorda: "border-cyan-500/40",
    corGradiente: "from-cyan-500/30 via-blue-600/15 to-transparent",
    conquistas: [
      {
        id: "aportes_recorrentes",
        titulo: "Aportes Mensais Ativos",
        descricao: "Rotina consistente de investimento no longo prazo.",
      },
      {
        id: "carteira_diversificada",
        titulo: "Carteira Inteligente",
        descricao: "Alocação estratégica validada com suporte da mentoria.",
      },
      {
        id: "juros_compostos",
        titulo: "Renda Passiva em Formação",
        descricao: "Juros compostos trabalhando ativamente a favor do seu futuro.",
      },
    ],
  },
  {
    nivel: 5,
    id: "liberdade",
    titulo: "Liberdade Financeira",
    subtitulo: "Autonomia & Prosperidade",
    descricao:
      "Independência plena, vida financeira descomplicada e patrimônio gerando segurança e abundância contínua.",
    criterio:
      "Autonomia total, metas batidas e aprovação de excelência pela mentoria Natalia Rodolfo.",
    corHex: "#a855f7",
    corBadge: "bg-purple-500/25 text-purple-300 border-purple-500/50 shadow-sm shadow-purple-950/40",
    corBorda: "border-purple-500/50",
    corGradiente: "from-purple-600/35 via-fuchsia-600/20 to-transparent",
    conquistas: [
      {
        id: "independencia_total",
        titulo: "Vida Financeira Descomplicada",
        descricao: "Domínio total das finanças pessoais e empresariais.",
      },
      {
        id: "patrimonio_solido",
        titulo: "Patrimônio Consolidado",
        descricao: "Geração contínua de rendimentos passivos sustentáveis.",
      },
      {
        id: "aluno_inspiracao",
        titulo: "Case de Sucesso da Mentoria",
        descricao: "Reconhecimento de excelência máxima por Natalia Rodolfo.",
      },
    ],
  },
];

export function getPatentePorNivel(nivel?: number | null): PatenteInfo | null {
  if (!nivel || nivel <= 0) return null;
  return PATENTES.find((p) => p.nivel === nivel) || null;
}

export function EscudoPatente({
  nivel,
  bloqueado = false,
  tamanho = "md",
  className = "",
}: {
  nivel: number;
  bloqueado?: boolean;
  tamanho?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const info = PATENTES.find((p) => p.nivel === nivel) || PATENTES[0];

  const dimensoes = {
    sm: "w-10 h-12 text-[9px]",
    md: "w-16 h-20 text-xs",
    lg: "w-24 h-28 text-sm",
    xl: "w-32 h-38 text-base",
  }[tamanho];

  // Cores por nível
  const coresNivel = [
    {
      // Nível 1 - Bronze
      fillTopo: "#b45309",
      fillBase: "#78350f",
      stroke: "#f59e0b",
      glow: "rgba(245, 158, 11, 0.4)",
    },
    {
      // Nível 2 - Prata
      fillTopo: "#64748b",
      fillBase: "#334155",
      stroke: "#cbd5e1",
      glow: "rgba(203, 213, 225, 0.4)",
    },
    {
      // Nível 3 - Ouro
      fillTopo: "#ca8a04",
      fillBase: "#854d0e",
      stroke: "#facc15",
      glow: "rgba(250, 204, 21, 0.5)",
    },
    {
      // Nível 4 - Platina / Ciano
      fillTopo: "#0891b2",
      fillBase: "#155e75",
      stroke: "#38bdf8",
      glow: "rgba(56, 189, 248, 0.5)",
    },
    {
      // Nível 5 - Diamante Imperial / Roxo Dourado
      fillTopo: "#7e22ce",
      fillBase: "#581c87",
      stroke: "#e879f9",
      glow: "rgba(232, 121, 249, 0.6)",
    },
  ];

  const cor = coresNivel[Math.min(nivel - 1, 4)] || coresNivel[0];

  return (
    <div
      className={`relative flex items-center justify-center select-none ${dimensoes} ${
        bloqueado ? "grayscale opacity-40 brightness-75" : "drop-shadow-lg"
      } ${className}`}
      style={{
        filter: bloqueado
          ? "grayscale(100%) opacity(35%)"
          : `drop-shadow(0 0 14px ${cor.glow})`,
      }}
    >
      <svg
        viewBox="0 0 100 120"
        className="w-full h-full overflow-visible transition-transform duration-300"
      >
        <defs>
          <linearGradient id={`escudo-grad-${nivel}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={cor.fillTopo} />
            <stop offset="100%" stopColor={cor.fillBase} />
          </linearGradient>
          <linearGradient id={`escudo-borda-${nivel}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="50%" stopColor={cor.stroke} />
            <stop offset="100%" stopColor={cor.stroke} stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Corpo do Escudo */}
        <path
          d="M 50 6 C 76 6, 94 16, 94 36 C 94 74, 50 114, 50 114 C 50 114, 6 74, 6 36 C 6 16, 24 6, 50 6 Z"
          fill={`url(#escudo-grad-${nivel})`}
          stroke={`url(#escudo-borda-${nivel})`}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Linha de reflexo interna */}
        <path
          d="M 50 12 C 72 12, 86 21, 86 38 C 86 69, 50 102, 50 102 C 50 102, 14 69, 14 38 C 14 21, 28 12, 50 12 Z"
          fill="none"
          stroke="rgba(255, 255, 255, 0.25)"
          strokeWidth="1.5"
        />

        {/* Insígnia Central */}
        {bloqueado ? (
          <g transform="translate(37, 43)">
            <rect x="2" y="10" width="22" height="18" rx="3" fill="#ffffff" opacity="0.6" />
            <path
              d="M 6 10 L 6 7 C 6 3.5, 20 3.5, 20 7 L 20 10"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              opacity="0.8"
            />
          </g>
        ) : (
          <g className="text-white">
            {nivel === 1 && (
              /* Estrela do Aprendiz */
              <polygon
                points="50,30 55,44 70,44 58,54 62,68 50,59 38,68 42,54 30,44 45,44"
                fill="#fff"
                stroke={cor.stroke}
                strokeWidth="1.5"
              />
            )}

            {nivel === 2 && (
              /* Duplo Chevron / Asas de Guardião */
              <g stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <polyline points="32,46 50,62 68,46" />
                <polyline points="32,36 50,52 68,36" />
              </g>
            )}

            {nivel === 3 && (
              /* Coroa Dourada */
              <g fill="#fff">
                <polygon points="30,62 70,62 72,42 58,52 50,34 42,52 28,42" />
                <circle cx="50" cy="30" r="3" fill="#fff" />
                <circle cx="27" cy="39" r="2.5" fill="#fff" />
                <circle cx="73" cy="39" r="2.5" fill="#fff" />
              </g>
            )}

            {nivel === 4 && (
              /* Diamante Ascendente / Ciano */
              <g fill="#fff" stroke={cor.stroke} strokeWidth="1">
                <polygon points="50,28 68,44 50,72 32,44" />
                <polyline points="50,28 50,72" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                <polyline points="32,44 68,44" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
              </g>
            )}

            {nivel === 5 && (
              /* Coroa Imperial com Estrela Diamante */
              <g fill="#fff">
                <polygon points="50,26 56,38 68,40 58,48 62,60 50,52 38,60 42,48 32,40 44,38" />
                <circle cx="50" cy="68" r="3.5" fill="#fff" />
                <circle cx="34" cy="65" r="2.5" fill="#fff" />
                <circle cx="66" cy="65" r="2.5" fill="#fff" />
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
}
