import { supabase } from "./supabase";
import type { UserProfile } from "./auth-context";

export const LIMITE_DIARIO_VERA = 10;

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
 * Retorna as informações do ciclo diário atual da Vera.
 * O ciclo diário de 24 horas inicia e renova pontualmente às 06:00 AM (horário local).
 */
export function getCicloAtualVera(dataReferencia: Date = new Date()): {
  cicloId: string;
  proximaRenovacao: Date;
  proximaRenovacaoFormatada: string;
  tempoRestanteTexto: string;
} {
  const agora = new Date(dataReferencia);
  const dataCiclo = new Date(agora);
  const proximaRenovacao = new Date(agora);

  if (agora.getHours() < 6) {
    // Antes das 06:00: o ciclo atual iniciou ontem às 06:00 e renova HOJE às 06:00
    dataCiclo.setDate(dataCiclo.getDate() - 1);
    proximaRenovacao.setHours(6, 0, 0, 0);
  } else {
    // A partir das 06:00: o ciclo atual iniciou hoje às 06:00 e renova AMANHÃ às 06:00
    proximaRenovacao.setDate(proximaRenovacao.getDate() + 1);
    proximaRenovacao.setHours(6, 0, 0, 0);
  }

  const ano = dataCiclo.getFullYear();
  const mes = String(dataCiclo.getMonth() + 1).padStart(2, "0");
  const dia = String(dataCiclo.getDate()).padStart(2, "0");
  const cicloId = `${ano}-${mes}-${dia}`;

  // Formatar data de renovação
  const diaRenovacao = String(proximaRenovacao.getDate()).padStart(2, "0");
  const mesRenovacao = String(proximaRenovacao.getMonth() + 1).padStart(2, "0");
  const anoRenovacao = proximaRenovacao.getFullYear();
  const horaRenovacao = String(proximaRenovacao.getHours()).padStart(2, "0");
  const minRenovacao = String(proximaRenovacao.getMinutes()).padStart(2, "0");

  const diffMs = Math.max(0, proximaRenovacao.getTime() - agora.getTime());
  const horasRestantes = Math.floor(diffMs / (1000 * 60 * 60));
  const minutosRestantes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  const hojeMesmoDia =
    agora.getDate() === proximaRenovacao.getDate() &&
    agora.getMonth() === proximaRenovacao.getMonth();

  const prefixoDia = hojeMesmoDia ? "hoje" : "amanhã";
  const proximaRenovacaoFormatada = `${prefixoDia}, ${diaRenovacao}/${mesRenovacao}/${anoRenovacao} às ${horaRenovacao}:${minRenovacao}`;

  const tempoRestanteTexto =
    horasRestantes > 0
      ? `${horasRestantes}h ${minutosRestantes}min`
      : `${minutosRestantes}min`;

  return {
    cicloId,
    proximaRenovacao,
    proximaRenovacaoFormatada,
    tempoRestanteTexto,
  };
}

/**
 * Consulta o status de créditos do usuário para o ciclo atual
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

  if (!userId) {
    return {
      isAdmin: false,
      limite: LIMITE_DIARIO_VERA,
      mensagensEnviadas: 0,
      mensagensRestantes: LIMITE_DIARIO_VERA,
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

  const mensagensRestantes = Math.max(0, LIMITE_DIARIO_VERA - enviadas);
  const isBloqueado = mensagensRestantes <= 0;

  return {
    isAdmin: false,
    limite: LIMITE_DIARIO_VERA,
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
    isBloqueado: novoEnviadas >= LIMITE_DIARIO_VERA,
  };
}
