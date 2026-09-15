import { useState, useEffect } from "react";

export const NOMES_MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
] as const;

export interface PeriodoAtivo {
  mesTexto: string; // "Este mês", "Janeiro", ..., "Dezembro"
  mesIndex: number; // 0 a 11
  ano: number; // ex: 2026
  rotuloExibicao: string; // ex: "Outubro de 2026"
}

// Obtém o período ativo do localStorage ou data atual
export function getPeriodoAtivo(): PeriodoAtivo {
  const agora = new Date();
  const mesAtualIndex = agora.getMonth();
  const anoAtual = agora.getFullYear();

  if (typeof window === "undefined") {
    return {
      mesTexto: "Este mês",
      mesIndex: mesAtualIndex,
      ano: anoAtual,
      rotuloExibicao: `${NOMES_MESES[mesAtualIndex]} de ${anoAtual}`,
    };
  }

  const mesTextoSalvo = localStorage.getItem("organizai_mes") || "Este mês";
  const anoSalvo = parseInt(localStorage.getItem("organizai_ano") || "", 10) || anoAtual;

  let mesIndex: number;
  if (mesTextoSalvo === "Este mês") {
    mesIndex = mesAtualIndex;
  } else {
    const idx = NOMES_MESES.indexOf(mesTextoSalvo as any);
    mesIndex = idx !== -1 ? idx : mesAtualIndex;
  }

  return {
    mesTexto: mesTextoSalvo,
    mesIndex,
    ano: anoSalvo,
    rotuloExibicao: `${NOMES_MESES[mesIndex]} de ${anoSalvo}`,
  };
}

// Salva e notifica globalmente a troca de mês/ano
export function setPeriodoAtivo(mesTexto: string, ano: number | string): PeriodoAtivo {
  const agora = new Date();
  const mesAtualIndex = agora.getMonth();
  const anoAtual = agora.getFullYear();

  const anoNum = typeof ano === "string" ? parseInt(ano, 10) || anoAtual : ano;
  let mesIndex: number;
  if (mesTexto === "Este mês") {
    mesIndex = mesAtualIndex;
  } else {
    const idx = NOMES_MESES.indexOf(mesTexto as any);
    mesIndex = idx !== -1 ? idx : mesAtualIndex;
  }

  const periodo: PeriodoAtivo = {
    mesTexto,
    mesIndex,
    ano: anoNum,
    rotuloExibicao: `${NOMES_MESES[mesIndex]} de ${anoNum}`,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem("organizai_mes", mesTexto);
    localStorage.setItem("organizai_ano", String(anoNum));
    window.dispatchEvent(new CustomEvent("organizai_periodo_sync", { detail: periodo }));
  }

  return periodo;
}

// Hook React para escutar alterações de período em qualquer tela
export function usePeriodoAtivo(): PeriodoAtivo {
  const [periodo, setPeriodo] = useState<PeriodoAtivo>(() => getPeriodoAtivo());

  useEffect(() => {
    const handler = (e: any) => {
      if (e?.detail && typeof e.detail.mesIndex === "number") {
        setPeriodo(e.detail);
      } else {
        setPeriodo(getPeriodoAtivo());
      }
    };

    window.addEventListener("organizai_periodo_sync", handler);
    window.addEventListener("storage", handler);

    return () => {
      window.removeEventListener("organizai_periodo_sync", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return periodo;
}

// Extrai partes de data (dia, mês 0-11, ano) de formatos ISO ou pt-BR
export function extrairAnoMes(dataStr?: string | null): { ano: number; mesIndex: number; dia: number } {
  if (!dataStr) {
    const d = new Date();
    return { ano: d.getFullYear(), mesIndex: d.getMonth(), dia: d.getDate() };
  }

  // Se vier no formato ISO / YYYY-MM-DD
  if (dataStr.includes("-")) {
    const parts = dataStr.split("T")[0].split("-");
    if (parts.length >= 3) {
      return {
        ano: parseInt(parts[0], 10),
        mesIndex: parseInt(parts[1], 10) - 1,
        dia: parseInt(parts[2], 10),
      };
    }
  }

  // Se vier no formato DD/MM/YYYY
  if (dataStr.includes("/")) {
    const parts = dataStr.split("/");
    if (parts.length >= 3) {
      return {
        ano: parseInt(parts[2], 10),
        mesIndex: parseInt(parts[1], 10) - 1,
        dia: parseInt(parts[0], 10),
      };
    }
  }

  const d = new Date(dataStr);
  if (!isNaN(d.getTime())) {
    return { ano: d.getFullYear(), mesIndex: d.getMonth(), dia: d.getDate() };
  }

  const hoje = new Date();
  return { ano: hoje.getFullYear(), mesIndex: hoje.getMonth(), dia: hoje.getDate() };
}

// Projeção de uma compra parcelada do cartão de crédito para o mês/ano selecionado
export interface CompraProjetada {
  id: string;
  cartaoId: string;
  descricao: string;
  categoria: string;
  valor: number; // valor da parcela neste mês selecionado
  valorTotalCompra: number; // valor total somando todas as parcelas
  dataOriginal: string;
  dataParcela: string; // data formatada para a fatura do mês selecionado
  parcelaAtualNoMes: number; // ex: 2
  parcelasTotal: number; // ex: 3
  tipoConta?: "pessoal" | "empresa";
}

export function projetarCompraParaMes(
  compra: {
    id: string;
    cartaoId: string;
    descricao: string;
    categoria: string;
    valor: number;
    data: string;
    parcelaAtual?: number;
    parcelasTotal?: number;
    tipoConta?: "pessoal" | "empresa";
  },
  mesAlvoIndex: number,
  anoAlvo: number
): CompraProjetada | null {
  const { ano: anoCompra, mesIndex: mesCompra, dia } = extrairAnoMes(compra.data);
  const totalParcelas = Math.max(1, compra.parcelasTotal || 1);
  const parcelaOriginal = Math.max(1, compra.parcelaAtual || 1);

  // Mês em que a primeira parcela (1/X) venceu ou vence
  const mesesAtePrimeira = anoCompra * 12 + mesCompra - (parcelaOriginal - 1);
  const mesesAlvo = anoAlvo * 12 + mesAlvoIndex;

  const diffDesdePrimeira = mesesAlvo - mesesAtePrimeira;

  // Se o mês selecionado for anterior ao início das parcelas ou posterior ao término
  if (diffDesdePrimeira < 0 || diffDesdePrimeira >= totalParcelas) {
    return null;
  }

  const parcelaAtualNoMes = diffDesdePrimeira + 1;
  const diaFmt = String(dia).padStart(2, "0");
  const mesFmt = String(mesAlvoIndex + 1).padStart(2, "0");
  const dataParcela = `${diaFmt}/${mesFmt}/${anoAlvo}`;

  return {
    id: compra.id,
    cartaoId: compra.cartaoId,
    descricao: compra.descricao,
    categoria: compra.categoria,
    valor: compra.valor,
    valorTotalCompra: compra.valor * totalParcelas,
    dataOriginal: compra.data,
    dataParcela,
    parcelaAtualNoMes,
    parcelasTotal: totalParcelas,
    tipoConta: compra.tipoConta,
  };
}

// Calcula quantas parcelas restantes da compra comprometem o limite a partir do mês selecionado
export function calcularParcelasRestantesNoMes(
  compra: {
    data: string;
    parcelaAtual?: number;
    parcelasTotal?: number;
  },
  mesAlvoIndex: number,
  anoAlvo: number
): number {
  const { ano: anoCompra, mesIndex: mesCompra } = extrairAnoMes(compra.data);
  const totalParcelas = Math.max(1, compra.parcelasTotal || 1);
  const parcelaOriginal = Math.max(1, compra.parcelaAtual || 1);

  const mesesAtePrimeira = anoCompra * 12 + mesCompra - (parcelaOriginal - 1);
  const mesesAlvo = anoAlvo * 12 + mesAlvoIndex;
  const diffDesdePrimeira = mesesAlvo - mesesAtePrimeira;

  if (diffDesdePrimeira < 0) {
    // Compra futura: ainda compromete todas as parcelas
    return totalParcelas;
  }

  if (diffDesdePrimeira >= totalParcelas) {
    // Compra já concluída antes deste mês
    return 0;
  }

  const parcelaAtualNoMes = diffDesdePrimeira + 1;
  return Math.max(0, totalParcelas - parcelaAtualNoMes + 1);
}
