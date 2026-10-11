import { supabase } from "./supabase";
import type { UserProfile } from "./auth-context";
import { getPlanAiCreditsMonthly } from "./plans";

export const LIMITE_DIARIO_VERA = 10;
export const LIMITE_MENSAL_PADRAO = 100;
export const LIMITE_MENSAL_ANUAL = 300;

export interface StatusCreditosVera {
  isAdmin: boolean;
  limite: number;
  mensagensEnviadas: number;
  mensagensRestantes: number;
  isBloqueado: boolean;
  proximaRenovacao: Date;
  proximaRenovacaoFormatada: string;
  tempoRestanteTexto: string;
  cicloId: string;
}

/**
 * Retorna as informações do ciclo mensal atual da Samy IA.
 * O ciclo mensal renova pontualmente no 1º dia de cada mês às 00:00.
 */
export function getCicloAtualVera(dataReferencia: Date = new Date()): {
  cicloId: string;
  proximaRenovacao: Date;
  proximaRenovacaoFormatada: string;
  tempoRestanteTexto: string;
} {
  const agora = new Date(dataReferencia);
  const ano = agora.getFullYear();
  const mesIdx = agora.getMonth(); // 0 a 11
  const mesFormatado = String(mesIdx + 1).padStart(2, "0");
  const cicloId = `${ano}-${mesFormatado}`;

  // Próxima renovação: 1º dia do mês seguinte às 00:00
  const proximaRenovacao = new Date(ano, mesIdx + 1, 1, 0, 0, 0);

  const diaRenovacao = String(proximaRenovacao.getDate()).padStart(2, "0");
  const mesRenovacao = String(proximaRenovacao.getMonth() + 1).padStart(2, "0");
  const anoRenovacao = proximaRenovacao.getFullYear();
  const proximaRenovacaoFormatada = `${diaRenovacao}/${mesRenovacao}/${anoRenovacao} às 00:00`;

  const diffMs = Math.max(0, proximaRenovacao.getTime() - agora.getTime());
  const diasRestantes = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const horasRestantes = Math.floor(
    (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  const tempoRestanteTexto =
    diasRestantes > 0
      ? `${diasRestantes} dia${diasRestantes > 1 ? "s" : ""} e ${horasRestantes}h`
      : `${horasRestantes}h`;

  return {
    cicloId,
    proximaRenovacao,
    proximaRenovacaoFormatada,
    tempoRestanteTexto,
  };
}

/**
 * Consulta o status de créditos do usuário para o ciclo mensal atual
 */
export function obterStatusCreditosVera(
  userId?: string | null,
  isAdmin: boolean = false,
  profile?: UserProfile | null
): StatusCreditosVera {
  const { cicloId, proximaRenovacao, proximaRenovacaoFormatada, tempoRestanteTexto } =
    getCicloAtualVera();

  // Administradores nunca são limitados
  if (isAdmin) {
    return {
      isAdmin: true,
      limite: Infinity,
      mensagensEnviadas: 0,
      mensagensRestantes: Infinity,
      isBloqueado: false,
      proximaRenovacao,
      proximaRenovacaoFormatada,
      tempoRestanteTexto,
      cicloId,
    };
  }

  // Determina o limite mensal de acordo com o plano:
  // - Mensal / Trimestral / Semestral: 100 mensal
  // - Anual / Vitalício: 300 mensal
  // - Free / Sem plano: 10 mensal
  const limite = getPlanAiCreditsMonthly(profile?.plan);

  if (!userId) {
    return {
      isAdmin: false,
      limite,
      mensagensEnviadas: 0,
      mensagensRestantes: limite,
      isBloqueado: false,
      proximaRenovacao,
      proximaRenovacaoFormatada,
      tempoRestanteTexto,
      cicloId,
    };
  }

  let enviadas = 0;

  // 1. Tenta recuperar do localStorage para agilidade
  if (typeof window !== "undefined") {
    try {
      const cicloSalvo = localStorage.getItem(`vera_ultimo_ciclo_${userId}`);
      if (cicloSalvo === cicloId) {
        const contagemStr = localStorage.getItem(`vera_mensagens_${userId}`);
        if (contagemStr) {
          enviadas = parseInt(contagemStr, 10) || 0;
        }
      }
    } catch {
      // No-op
    }
  }

  // 2. Se o profile do Supabase tiver registro mais recente do mesmo ciclo, utiliza o maior
  if (profile?.vera_ultimo_ciclo === cicloId && typeof profile?.vera_mensagens_hoje === "number") {
    enviadas = Math.max(enviadas, profile.vera_mensagens_hoje);
  }

  const mensagensRestantes = Math.max(0, limite - enviadas);
  const isBloqueado = mensagensRestantes <= 0;

  return {
    isAdmin: false,
    limite,
    mensagensEnviadas: enviadas,
    mensagensRestantes,
    isBloqueado,
    proximaRenovacao,
    proximaRenovacaoFormatada,
    tempoRestanteTexto,
    cicloId,
  };
}

/**
 * Registra o envio de uma mensagem e atualiza tanto localStorage quanto Supabase
 */
export async function registrarEnvioMensagemVera(
  userId: string,
  isAdmin: boolean = false,
  profile?: UserProfile | null
): Promise<{ novoEnviadas: number; isBloqueado: number | boolean }> {
  // Se for admin, não decrementa cota
  if (isAdmin) {
    return { novoEnviadas: 0, isBloqueado: false };
  }

  const statusAtual = obterStatusCreditosVera(userId, isAdmin, profile);
  const limite = statusAtual.limite;
  const novoEnviadas = statusAtual.mensagensEnviadas + 1;
  const cicloId = statusAtual.cicloId;

  // 1. Salva no localStorage imediatamente
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(`vera_ultimo_ciclo_${userId}`, cicloId);
      localStorage.setItem(`vera_mensagens_${userId}`, novoEnviadas.toString());
      window.dispatchEvent(
        new CustomEvent("organizai_vera_creditos_sync", {
          detail: { userId, cicloId, novoEnviadas },
        })
      );
    } catch {
      // No-op
    }
  }

  // 2. Persiste no Supabase profiles
  try {
    await supabase
      .from("profiles")
      .update({
        vera_mensagens_hoje: novoEnviadas,
        vera_ultimo_ciclo: cicloId,
      })
      .eq("id", userId);
  } catch (err) {
    console.error("Erro ao sincronizar créditos da Vera no Supabase:", err);
  }

  return {
    novoEnviadas,
    isBloqueado: novoEnviadas >= limite,
  };
}

// Aliases para transição da IA de Vera para Samy
export const LIMITE_DIARIO_SAMY = LIMITE_DIARIO_VERA;
export const LIMITE_MENSAL_SAMY = LIMITE_MENSAL_PADRAO;
export const obterStatusCreditosSamy = obterStatusCreditosVera;
export const registrarEnvioMensagemSamy = registrarEnvioMensagemVera;
export const getCicloAtualSamy = getCicloAtualVera;
export type StatusCreditosSamy = StatusCreditosVera;
