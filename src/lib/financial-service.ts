import { supabase } from "@/lib/supabase";

export interface RecebimentoItem {
  id: string;
  user_id?: string;
  descricao: string;
  valor: number;
  data: string; // YYYY-MM-DD or DD/MM/YYYY
  categoria: string;
  banco?: string | undefined;
  created_at?: string;
}

export interface GastoFixoItem {
  id: string;
  user_id?: string;
  nome: string;
  valor: number;
  diaVenc: number;
  status: "Pendente" | "Pago";
  categoria: string;
  formaPagamento: string;
  ativo: boolean;
  tipoConta?: "pessoal" | "empresa";
  observacao?: string | undefined;
  created_at?: string;
}

export interface GastoVariavelItem {
  id: string;
  user_id?: string;
  descricao: string;
  valor: number;
  data: string; // YYYY-MM-DD or DD/MM/YYYY
  status: "Pago" | "Pendente";
  categoria: string;
  formaPagamento: string;
  created_at?: string;
}

export interface ContaBancariaItem {
  id: string;
  user_id?: string;
  banco: string;
  tipo: string;
  saldo: number;
  agencia?: string | undefined;
  conta?: string | undefined;
  created_at?: string;
}

export interface CartaoItem {
  id: string;
  user_id?: string;
  nome: string;
  ultimosDigitos: string;
  limiteTotal: number;
  faturaAtual: number;
  diaFechamento: number;
  diaVencimento: number;
  cor: string;
  created_at?: string;
}

export interface CofrinhoItem {
  id: string;
  user_id?: string;
  titulo: string;
  metaValor: number;
  valorAtual: number;
  prazo?: string | undefined;
  categoria?: string | undefined;
  created_at?: string;
}

export interface InvestimentoItem {
  id: string;
  user_id?: string;
  titulo: string;
  tipo: string;
  valorAplicado: number;
  saldoAtual: number;
  instituicao?: string | undefined;
  rendimentoPct?: number | undefined;
  created_at?: string;
}

export interface GastosPorCategoriaItem {
  categoria: string;
  valor: number;
  porcentagem: number;
  cor: string;
}

export interface ResumoFinanceiro {
  totalGastos: number;
  totalReceitas: number;
  totalPago: number;
  faltaPagar: number;
  percentualPago: number;
  saldoDisponivel: number;
  totalInvestido: number;
  totalCofrinhos: number;
  gastosFixosTotal: number;
  gastosVariaveisTotal: number;
  gastosPorCategoria: GastosPorCategoriaItem[];
  gastosFixosLista: GastoFixoItem[];
  evolucaoSaldoDiario: { dia: number; saldo: number }[];
  comparativoMensal: { mes: string; receitas: number; despesas: number }[];
  recebimentosMensal: { mes: string; valor: number }[];
}

const CATEGORIA_CORES: Record<string, string> = {
  Moradia: "#F97316",
  Alimentação: "#EF4444",
  Transporte: "#3B82F6",
  Lazer: "#8B5CF6",
  Saúde: "#10B981",
  Educação: "#F59E0B",
  Serviços: "#06B6D4",
  Outros: "#A8A29E",
};

const MESES_ROTULOS = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

function extrairMes(dataStr: string): number {
  if (!dataStr) return new Date().getMonth();
  if (dataStr.includes("/")) {
    const parts = dataStr.split("/");
    if (parts.length >= 2) {
      const m = parseInt(parts[1] || "1", 10) - 1;
      return m >= 0 && m <= 11 ? m : new Date().getMonth();
    }
  }
  if (dataStr.includes("-")) {
    const parts = dataStr.split("-");
    if (parts.length >= 2) {
      const m = parseInt(parts[1] || "1", 10) - 1;
      return m >= 0 && m <= 11 ? m : new Date().getMonth();
    }
  }
  return new Date().getMonth();
}

function extrairDia(dataStr: string): number {
  if (!dataStr) return 1;
  if (dataStr.includes("/")) {
    const parts = dataStr.split("/");
    return parseInt(parts[0] || "1", 10) || 1;
  }
  if (dataStr.includes("-")) {
    const parts = dataStr.split("-");
    return parseInt(parts[2] || "1", 10) || 1;
  }
  return 1;
}

export function calcularResumoFinanceiro(
  recebimentos: RecebimentoItem[],
  gastosFixos: GastoFixoItem[],
  gastosVariaveis: GastoVariavelItem[],
  bancos: ContaBancariaItem[],
  investimentos: InvestimentoItem[] = [],
  cofrinhos: CofrinhoItem[] = []
): ResumoFinanceiro {
  const totalReceitas = recebimentos.reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
  
  const gastosFixosAtivos = gastosFixos.filter((g) => g.ativo);
  const gastosFixosTotal = gastosFixosAtivos.reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
  const gastosVariaveisTotal = gastosVariaveis.reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
  
  const totalGastos = gastosFixosTotal + gastosVariaveisTotal;

  const fixosPagos = gastosFixosAtivos
    .filter((g) => g.status === "Pago")
    .reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
  const variaveisPagos = gastosVariaveis
    .filter((g) => g.status === "Pago")
    .reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
  const totalPago = fixosPagos + variaveisPagos;

  const faltaPagar = Math.max(0, totalGastos - totalPago);
  const percentualPago = totalGastos > 0 ? Math.round((totalPago / totalGastos) * 100) : 0;

  const saldoBancos = bancos.reduce((acc, curr) => acc + (Number(curr.saldo) || 0), 0);
  const saldoDisponivel = bancos.length > 0 ? saldoBancos : totalReceitas - totalPago;

  const totalInvestido = investimentos.reduce((acc, curr) => acc + (Number(curr.saldoAtual) || 0), 0);
  const totalCofrinhos = cofrinhos.reduce((acc, curr) => acc + (Number(curr.valorAtual) || 0), 0);

  // Gastos por categoria
  const catMap: Record<string, number> = {};
  gastosFixosAtivos.forEach((g) => {
    const c = g.categoria || "Outros";
    catMap[c] = (catMap[c] || 0) + (Number(g.valor) || 0);
  });
  gastosVariaveis.forEach((g) => {
    const c = g.categoria || "Outros";
    catMap[c] = (catMap[c] || 0) + (Number(g.valor) || 0);
  });

  const gastosPorCategoria: GastosPorCategoriaItem[] = Object.entries(catMap)
    .map(([categoria, valor]) => ({
      categoria,
      valor,
      porcentagem: totalGastos > 0 ? Math.round((valor / totalGastos) * 100) : 0,
      cor: CATEGORIA_CORES[categoria] || "#F97316",
    }))
    .sort((a, b) => b.valor - a.valor);

  // Evolução do saldo diário (dias 1 a 30)
  const diaMovimentos: Record<number, { entradas: number; saidas: number }> = {};
  for (let i = 1; i <= 30; i++) {
    diaMovimentos[i] = { entradas: 0, saidas: 0 };
  }

  recebimentos.forEach((r) => {
    const dia = Math.min(30, Math.max(1, extrairDia(r.data)));
    if (diaMovimentos[dia]) {
      diaMovimentos[dia].entradas += Number(r.valor) || 0;
    }
  });

  gastosFixosAtivos.forEach((g) => {
    const dia = Math.min(30, Math.max(1, g.diaVenc || 5));
    if (diaMovimentos[dia]) {
      diaMovimentos[dia].saidas += Number(g.valor) || 0;
    }
  });

  gastosVariaveis.forEach((g) => {
    const dia = Math.min(30, Math.max(1, extrairDia(g.data)));
    if (diaMovimentos[dia]) {
      diaMovimentos[dia].saidas += Number(g.valor) || 0;
    }
  });

  let acumulado = 0;
  const evolucaoSaldoDiario: { dia: number; saldo: number }[] = [];
  for (let i = 1; i <= 30; i++) {
    const mov = diaMovimentos[i] || { entradas: 0, saidas: 0 };
    acumulado += mov.entradas - mov.saidas;
    evolucaoSaldoDiario.push({ dia: i, saldo: acumulado });
  }

  // Comparativo Mensal (12 meses)
  const mesReceitas: number[] = new Array(12).fill(0);
  const mesDespesas: number[] = new Array(12).fill(0);

  recebimentos.forEach((r) => {
    const mes = extrairMes(r.data);
    mesReceitas[mes] = (mesReceitas[mes] || 0) + (Number(r.valor) || 0);
  });

  gastosFixosAtivos.forEach((g) => {
    for (let m = 0; m < 12; m++) {
      mesDespesas[m] = (mesDespesas[m] || 0) + (Number(g.valor) || 0);
    }
  });

  gastosVariaveis.forEach((g) => {
    const mes = extrairMes(g.data);
    mesDespesas[mes] = (mesDespesas[mes] || 0) + (Number(g.valor) || 0);
  });

  const comparativoMensal = MESES_ROTULOS.map((mes, idx) => ({
    mes,
    receitas: mesReceitas[idx] || 0,
    despesas: mesDespesas[idx] || 0,
  }));

  const recebimentosMensal = MESES_ROTULOS.map((mes, idx) => ({
    mes,
    valor: mesReceitas[idx] || 0,
  }));

  return {
    totalGastos,
    totalReceitas,
    totalPago,
    faltaPagar,
    percentualPago,
    saldoDisponivel,
    totalInvestido,
    totalCofrinhos,
    gastosFixosTotal,
    gastosVariaveisTotal,
    gastosPorCategoria,
    gastosFixosLista: gastosFixosAtivos,
    evolucaoSaldoDiario,
    comparativoMensal,
    recebimentosMensal,
  };
}

export async function sincronizarResumoNoSupabase(userId: string, resumo: ResumoFinanceiro) {
  try {
    await supabase.from("user_financial_summaries").upsert({
      user_id: userId,
      saldo_total: resumo.saldoDisponivel,
      total_receitas: resumo.totalReceitas,
      total_gastos_fixos: resumo.gastosFixosTotal,
      total_gastos_variaveis: resumo.gastosVariaveisTotal,
      total_investido: resumo.totalInvestido,
      total_cofrinhos: resumo.totalCofrinhos,
      cartao_fatura_atual: 0,
      reserva_emergencia_atual: resumo.totalCofrinhos,
      reserva_emergencia_meta: resumo.gastosFixosTotal * 6,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Erro ao sincronizar resumo no Supabase:", err);
  }
}

export function notificarAtualizacaoFinanceira() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("organizai_finance_sync"));
  }
}

// Carregador centralizado para todas as seções do usuário
export async function carregarDadosFinanceirosUsuario(userId: string) {
  const cacheKey = `organizai_finance_data_${userId}`;

  try {
    const [
      { data: recData },
      { data: fixData },
      { data: varData },
      { data: banData },
      { data: invData },
      { data: cofData },
    ] = await Promise.all([
      supabase.from("recebimentos").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("gastos_fixos").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("gastos_variaveis").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("bancos_contas").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("investimentos").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("cofrinhos").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    ]);

    const recebimentos: RecebimentoItem[] = (recData || []).map((r: any) => ({
      id: r.id,
      user_id: r.user_id,
      descricao: r.descricao,
      valor: Number(r.valor) || 0,
      data: r.data,
      categoria: r.categoria,
      banco: r.banco,
      created_at: r.created_at,
    }));

    const gastosFixos: GastoFixoItem[] = (fixData || []).map((f: any) => ({
      id: f.id,
      user_id: f.user_id,
      nome: f.nome,
      valor: Number(f.valor) || 0,
      diaVenc: Number(f.dia_venc) || 5,
      status: f.status || "Pendente",
      categoria: f.categoria || "Moradia",
      formaPagamento: f.forma_pagamento || "Boleto",
      ativo: f.ativo ?? true,
      tipoConta: (f.tipo_conta as "pessoal" | "empresa") || "pessoal",
      observacao: f.observacao,
      created_at: f.created_at,
    }));

    const gastosVariaveis: GastoVariavelItem[] = (varData || []).map((v: any) => ({
      id: v.id,
      user_id: v.user_id,
      descricao: v.descricao,
      valor: Number(v.valor) || 0,
      data: v.data,
      status: v.status || "Pago",
      categoria: v.categoria || "Outros",
      formaPagamento: v.forma_pagamento || "PIX",
      created_at: v.created_at,
    }));

    const bancos: ContaBancariaItem[] = (banData || []).map((b: any) => ({
      id: b.id,
      user_id: b.user_id,
      banco: b.banco,
      tipo: b.tipo,
      saldo: Number(b.saldo) || 0,
      agencia: b.agencia,
      conta: b.conta,
      created_at: b.created_at,
    }));

    const investimentos: InvestimentoItem[] = (invData || []).map((i: any) => ({
      id: i.id,
      user_id: i.user_id,
      titulo: i.titulo,
      tipo: i.tipo,
      valorAplicado: Number(i.valor_aplicado) || 0,
      saldoAtual: Number(i.saldo_atual) || 0,
      instituicao: i.instituicao,
      rendimentoPct: Number(i.rendimento_pct) || 0,
      created_at: i.created_at,
    }));

    const cofrinhos: CofrinhoItem[] = (cofData || []).map((c: any) => ({
      id: c.id,
      user_id: c.user_id,
      titulo: c.titulo,
      metaValor: Number(c.meta_valor) || 0,
      valorAtual: Number(c.valor_atual) || 0,
      prazo: c.prazo,
      categoria: c.categoria,
      created_at: c.created_at,
    }));

    const payload = {
      recebimentos,
      gastosFixos,
      gastosVariaveis,
      bancos,
      investimentos,
      cofrinhos,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(cacheKey, JSON.stringify(payload));
    }

    const resumo = calcularResumoFinanceiro(
      recebimentos,
      gastosFixos,
      gastosVariaveis,
      bancos,
      investimentos,
      cofrinhos
    );

    // Atualiza resumo no Supabase para o Admin
    sincronizarResumoNoSupabase(userId, resumo);

    return { ...payload, resumo };
  } catch (err) {
    console.warn("Erro ao carregar dados do Supabase, usando cache local:", err);
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const resumo = calcularResumoFinanceiro(
            parsed.recebimentos || [],
            parsed.gastosFixos || [],
            parsed.gastosVariaveis || [],
            parsed.bancos || [],
            parsed.investimentos || [],
            parsed.cofrinhos || []
          );
          return { ...parsed, resumo };
        } catch {}
      }
    }

    const vazio = {
      recebimentos: [],
      gastosFixos: [],
      gastosVariaveis: [],
      bancos: [],
      investimentos: [],
      cofrinhos: [],
      resumo: calcularResumoFinanceiro([], [], [], []),
    };
    return vazio;
  }
}
