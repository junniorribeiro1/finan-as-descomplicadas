import { supabase } from "@/lib/supabase";
import {
  extrairAnoMes,
  projetarCompraParaMes,
  getPeriodoAtivo,
  NOMES_MESES,
  type CompraProjetada,
} from "./periodo";

export interface RecebimentoItem {
  id: string;
  user_id?: string;
  descricao: string;
  valor: number;
  data: string; // YYYY-MM-DD or DD/MM/YYYY
  categoria: string;
  banco?: string | undefined;
  tipoConta?: "pessoal" | "empresa";
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
  tipoConta?: "pessoal" | "empresa";
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
  tipoConta?: "pessoal" | "empresa";
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
  tipoConta?: "pessoal" | "empresa";
  created_at?: string;
}

export interface CompraCartaoItem {
  id: string;
  cartaoId: string;
  descricao: string;
  categoria: string;
  valor: number;
  data: string;
  parcelaAtual?: number;
  parcelasTotal?: number;
  tipoConta?: "pessoal" | "empresa";
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
  tipoConta?: "pessoal" | "empresa";
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
  aporteMensal?: number | undefined;
  prazoMeses?: number | undefined;
  dataInicio?: string | undefined;
  tipoConta?: "pessoal" | "empresa";
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
  faturaCartaoTotal: number;
  comprasCartaoLista: CompraProjetada[];
  gastosPorCategoria: GastosPorCategoriaItem[];
  gastosFixosLista: GastoFixoItem[];
  evolucaoSaldoDiario: { dia: number; saldo: number }[];
  comparativoMensal: { mes: string; receitas: number; despesas: number }[];
  recebimentosMensal: { mes: string; valor: number }[];
  rotuloPeriodo: string;
  mesIndex: number;
  ano: number;
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

export function calcularResumoFinanceiro(
  recebimentos: RecebimentoItem[],
  gastosFixos: GastoFixoItem[],
  gastosVariaveis: GastoVariavelItem[],
  bancos: ContaBancariaItem[],
  investimentos: InvestimentoItem[] = [],
  cofrinhos: CofrinhoItem[] = [],
  tipoConta?: "pessoal" | "empresa",
  periodo?: { mesIndex: number; ano: number },
  comprasCartao: CompraCartaoItem[] = []
): ResumoFinanceiro {
  const perAtivo = periodo ?? getPeriodoAtivo();
  const mesAlvo = perAtivo.mesIndex;
  const anoAlvo = perAtivo.ano;

  const recConta = tipoConta
    ? recebimentos.filter((r) => (r.tipoConta || "pessoal") === tipoConta)
    : recebimentos;
  const fixosBase = tipoConta
    ? gastosFixos.filter((g) => (g.tipoConta || "pessoal") === tipoConta)
    : gastosFixos;
  const varConta = tipoConta
    ? gastosVariaveis.filter((v) => (v.tipoConta || "pessoal") === tipoConta)
    : gastosVariaveis;
  const cartaoConta = tipoConta
    ? comprasCartao.filter((c) => (c.tipoConta || "pessoal") === tipoConta)
    : comprasCartao;

  // Receitas do mês/ano ativo
  const recMes = recConta.filter((r) => {
    const { ano, mesIndex } = extrairAnoMes(r.data);
    return ano === anoAlvo && mesIndex === mesAlvo;
  });
  const totalReceitas = recMes.reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
  
  // Gastos fixos ativos (recorrentes mensalmente)
  const gastosFixosAtivos = fixosBase.filter((g) => g.ativo);
  const gastosFixosTotal = gastosFixosAtivos.reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);

  // Gastos variáveis do mês/ano ativo
  const varMes = varConta.filter((v) => {
    const { ano, mesIndex } = extrairAnoMes(v.data);
    return ano === anoAlvo && mesIndex === mesAlvo;
  });
  const gastosVariaveisTotal = varMes.reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
  
  // Projeção das parcelas de cartão de crédito no mês/ano ativo
  const comprasCartaoProjetadas: CompraProjetada[] = [];
  for (const cp of cartaoConta) {
    const proj = projetarCompraParaMes(cp, mesAlvo, anoAlvo);
    if (proj) {
      comprasCartaoProjetadas.push(proj);
    }
  }
  const faturaCartaoTotal = comprasCartaoProjetadas.reduce(
    (acc, curr) => acc + (Number(curr.valor) || 0),
    0
  );

  // Total de gastos consolidados do período selecionado
  const totalGastos = gastosFixosTotal + gastosVariaveisTotal + faturaCartaoTotal;

  const fixosPagos = gastosFixosAtivos
    .filter((g) => g.status === "Pago")
    .reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
  const variaveisPagos = varMes
    .filter((v) => v.status === "Pago")
    .reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
  const totalPago = fixosPagos + variaveisPagos;

  const faltaPagar = Math.max(0, totalGastos - totalPago);
  const percentualPago = totalGastos > 0 ? Math.round((totalPago / totalGastos) * 100) : 0;

  const bancosFiltrados = tipoConta
    ? bancos.filter((b) => (b.tipoConta || "pessoal") === tipoConta)
    : bancos;
  const saldoBancos = bancosFiltrados.reduce((acc, curr) => acc + (Number(curr.saldo) || 0), 0);
  const saldoDisponivel = bancosFiltrados.length > 0 ? saldoBancos : totalReceitas - totalPago;

  const investFiltrados = tipoConta
    ? investimentos.filter((i) => (i.tipoConta || "pessoal") === tipoConta)
    : investimentos;
  const totalInvestido = investFiltrados.reduce((acc, curr) => acc + (Number(curr.saldoAtual) || 0), 0);
  const cofrinhosFiltrados = tipoConta
    ? cofrinhos.filter((c) => (c.tipoConta || "pessoal") === tipoConta)
    : cofrinhos;
  const totalCofrinhos = cofrinhosFiltrados.reduce((acc, curr) => acc + (Number(curr.valorAtual) || 0), 0);

  // Gastos por categoria no mês/ano ativo
  const catMap: Record<string, number> = {};
  gastosFixosAtivos.forEach((g) => {
    const c = g.categoria || "Outros";
    catMap[c] = (catMap[c] || 0) + (Number(g.valor) || 0);
  });
  varMes.forEach((g) => {
    const c = g.categoria || "Outros";
    catMap[c] = (catMap[c] || 0) + (Number(g.valor) || 0);
  });
  comprasCartaoProjetadas.forEach((cp) => {
    const c = cp.categoria || "Outros";
    catMap[c] = (catMap[c] || 0) + (Number(cp.valor) || 0);
  });

  const gastosPorCategoria: GastosPorCategoriaItem[] = Object.entries(catMap)
    .map(([categoria, valor]) => ({
      categoria,
      valor,
      porcentagem: totalGastos > 0 ? Math.round((valor / totalGastos) * 100) : 0,
      cor: CATEGORIA_CORES[categoria] || "#F97316",
    }))
    .sort((a, b) => b.valor - a.valor);

  // Evolução do saldo diário (dias 1 a 30) do mês selecionado
  const diaMovimentos: Record<number, { entradas: number; saidas: number }> = {};
  for (let i = 1; i <= 30; i++) {
    diaMovimentos[i] = { entradas: 0, saidas: 0 };
  }

  recMes.forEach((r) => {
    const dia = Math.min(30, Math.max(1, extrairAnoMes(r.data).dia));
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

  varMes.forEach((g) => {
    const dia = Math.min(30, Math.max(1, extrairAnoMes(g.data).dia));
    if (diaMovimentos[dia]) {
      diaMovimentos[dia].saidas += Number(g.valor) || 0;
    }
  });

  comprasCartaoProjetadas.forEach((cp) => {
    const dia = Math.min(30, Math.max(1, extrairAnoMes(cp.dataOriginal).dia));
    if (diaMovimentos[dia]) {
      diaMovimentos[dia].saidas += Number(cp.valor) || 0;
    }
  });

  let acumulado = 0;
  const evolucaoSaldoDiario: { dia: number; saldo: number }[] = [];
  for (let i = 1; i <= 30; i++) {
    const mov = diaMovimentos[i] || { entradas: 0, saidas: 0 };
    acumulado += mov.entradas - mov.saidas;
    evolucaoSaldoDiario.push({ dia: i, saldo: acumulado });
  }

  // Comparativo Mensal (12 meses do ano selecionado anoAlvo)
  const mesReceitas: number[] = new Array(12).fill(0);
  const mesDespesas: number[] = new Array(12).fill(0);

  recConta.forEach((r) => {
    const { ano, mesIndex } = extrairAnoMes(r.data);
    if (ano === anoAlvo && mesIndex >= 0 && mesIndex < 12) {
      mesReceitas[mesIndex] = (mesReceitas[mesIndex] || 0) + (Number(r.valor) || 0);
    }
  });

  gastosFixosAtivos.forEach((g) => {
    for (let m = 0; m < 12; m++) {
      mesDespesas[m] = (mesDespesas[m] || 0) + (Number(g.valor) || 0);
    }
  });

  varConta.forEach((g) => {
    const { ano, mesIndex } = extrairAnoMes(g.data);
    if (ano === anoAlvo && mesIndex >= 0 && mesIndex < 12) {
      mesDespesas[mesIndex] = (mesDespesas[mesIndex] || 0) + (Number(g.valor) || 0);
    }
  });

  cartaoConta.forEach((cp) => {
    for (let m = 0; m < 12; m++) {
      const proj = projetarCompraParaMes(cp, m, anoAlvo);
      if (proj) {
        mesDespesas[m] = (mesDespesas[m] || 0) + (Number(proj.valor) || 0);
      }
    }
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

  const rotuloPeriodo = `${NOMES_MESES[mesAlvo]} de ${anoAlvo}`;

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
    faturaCartaoTotal,
    comprasCartaoLista: comprasCartaoProjetadas,
    gastosPorCategoria,
    gastosFixosLista: gastosFixosAtivos,
    evolucaoSaldoDiario,
    comparativoMensal,
    recebimentosMensal,
    rotuloPeriodo,
    mesIndex: mesAlvo,
    ano: anoAlvo,
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
      { data: cartData },
      { data: compData },
    ] = await Promise.all([
      supabase.from("recebimentos").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("gastos_fixos").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("gastos_variaveis").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("bancos_contas").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("investimentos").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("cofrinhos").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("cartoes_credito").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("compras_cartao").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    ]);

    const recebimentos: RecebimentoItem[] = (recData || []).map((r: any) => ({
      id: r.id,
      user_id: r.user_id,
      descricao: r.descricao,
      valor: Number(r.valor) || 0,
      data: r.data,
      categoria: r.categoria,
      banco: r.banco,
      tipoConta: (r.tipo_conta as "pessoal" | "empresa") || "pessoal",
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
      tipoConta: (v.tipo_conta as "pessoal" | "empresa") || "pessoal",
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
      tipoConta: (b.tipo_conta as "pessoal" | "empresa") || "pessoal",
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
      aporteMensal: Number(i.aporte_mensal) || 0,
      prazoMeses: Number(i.prazo_meses) || 60,
      dataInicio: i.data_inicio,
      tipoConta: (i.tipo_conta as "pessoal" | "empresa") || "pessoal",
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
      tipoConta: (c.tipo_conta as "pessoal" | "empresa") || "pessoal",
      created_at: c.created_at,
    }));

    const cartoes: CartaoItem[] = (cartData || []).map((c: any) => ({
      id: c.id,
      user_id: c.user_id,
      nome: c.nome,
      ultimosDigitos: c.ultimos_digitos || "0000",
      limiteTotal: Number(c.limite_total) || 0,
      faturaAtual: Number(c.fatura_atual) || 0,
      diaFechamento: Number(c.dia_fechamento) || 3,
      diaVencimento: Number(c.dia_vencimento) || 10,
      cor: c.cor || "black",
      tipoConta: (c.tipo_conta as "pessoal" | "empresa") || "pessoal",
      created_at: c.created_at,
    }));

    const comprasCartao: CompraCartaoItem[] = (compData || []).map((cp: any) => ({
      id: cp.id,
      cartaoId: cp.cartao_id,
      descricao: cp.descricao,
      categoria: cp.categoria,
      valor: Number(cp.valor) || 0,
      data: cp.data,
      parcelaAtual: cp.parcela_atual || 1,
      parcelasTotal: cp.parcelas_total || 1,
      tipoConta: (cp.tipo_conta as "pessoal" | "empresa") || "pessoal",
      created_at: cp.created_at,
    }));

    const payload = {
      recebimentos,
      gastosFixos,
      gastosVariaveis,
      bancos,
      investimentos,
      cofrinhos,
      cartoes,
      comprasCartao,
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
      cofrinhos,
      undefined,
      undefined,
      comprasCartao
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
            parsed.cofrinhos || [],
            undefined,
            undefined,
            parsed.comprasCartao || []
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
      cartoes: [],
      comprasCartao: [],
      resumo: calcularResumoFinanceiro([], [], [], []),
    };
    return vazio;
  }
}

export interface CategoriaItem {
  id: string;
  user_id?: string;
  nome: string;
  tipo: "despesa" | "receita";
  tipoConta?: "pessoal" | "empresa";
  icone: string;
  corFundo?: string;
  corTexto?: string;
  uso?: string;
  created_at?: string;
}

export const CATEGORIAS_PADRAO_DESPESA_PESSOAL: CategoriaItem[] = [
  { id: "def-moradia", nome: "Moradia", tipo: "despesa", tipoConta: "pessoal", icone: "Home", corFundo: "bg-amber-500/10", corTexto: "text-amber-500" },
  { id: "def-transporte", nome: "Transporte", tipo: "despesa", tipoConta: "pessoal", icone: "Car", corFundo: "bg-blue-500/10", corTexto: "text-blue-400" },
  { id: "def-alimentacao", nome: "Alimentação", tipo: "despesa", tipoConta: "pessoal", icone: "Utensils", corFundo: "bg-amber-700/20", corTexto: "text-amber-500" },
  { id: "def-saude", nome: "Saúde", tipo: "despesa", tipoConta: "pessoal", icone: "HeartPulse", corFundo: "bg-red-500/10", corTexto: "text-red-400" },
  { id: "def-educacao", nome: "Educação", tipo: "despesa", tipoConta: "pessoal", icone: "GraduationCap", corFundo: "bg-purple-500/10", corTexto: "text-purple-400" },
  { id: "def-lazer", nome: "Lazer", tipo: "despesa", tipoConta: "pessoal", icone: "Gamepad2", corFundo: "bg-indigo-500/10", corTexto: "text-indigo-400" },
  { id: "def-servicos", nome: "Serviços", tipo: "despesa", tipoConta: "pessoal", icone: "Wrench", corFundo: "bg-sky-500/10", corTexto: "text-sky-400" },
  { id: "def-assinaturas", nome: "Assinaturas", tipo: "despesa", tipoConta: "pessoal", icone: "Sparkles", corFundo: "bg-orange-500/10", corTexto: "text-orange-400" },
  { id: "def-vestuario", nome: "Vestuário", tipo: "despesa", tipoConta: "pessoal", icone: "ShoppingBag", corFundo: "bg-pink-500/10", corTexto: "text-pink-400" },
  { id: "def-outros-desp", nome: "Outros", tipo: "despesa", tipoConta: "pessoal", icone: "Tag", corFundo: "bg-stone-500/10", corTexto: "text-stone-400" },
];

export const CATEGORIAS_PADRAO_RECEITA_PESSOAL: CategoriaItem[] = [
  { id: "def-salario", nome: "Salário", tipo: "receita", tipoConta: "pessoal", icone: "Briefcase", corFundo: "bg-emerald-500/10", corTexto: "text-emerald-400" },
  { id: "def-freelance", nome: "Freelance", tipo: "receita", tipoConta: "pessoal", icone: "Laptop", corFundo: "bg-blue-500/10", corTexto: "text-blue-400" },
  { id: "def-investimentos", nome: "Investimentos", tipo: "receita", tipoConta: "pessoal", icone: "TrendingUp", corFundo: "bg-purple-500/10", corTexto: "text-purple-400" },
  { id: "def-prolabore", nome: "Pró-labore", tipo: "receita", tipoConta: "pessoal", icone: "Building", corFundo: "bg-amber-500/10", corTexto: "text-amber-400" },
  { id: "def-vendas", nome: "Vendas", tipo: "receita", tipoConta: "pessoal", icone: "ShoppingBag", corFundo: "bg-orange-500/10", corTexto: "text-orange-400" },
  { id: "def-restituicao", nome: "Restituição IR", tipo: "receita", tipoConta: "pessoal", icone: "Sparkles", corFundo: "bg-teal-500/10", corTexto: "text-teal-400" },
  { id: "def-presente", nome: "Presente / Bônus", tipo: "receita", tipoConta: "pessoal", icone: "Sparkles", corFundo: "bg-yellow-500/10", corTexto: "text-yellow-400" },
  { id: "def-outros-rec", nome: "Outros", tipo: "receita", tipoConta: "pessoal", icone: "Tag", corFundo: "bg-stone-500/10", corTexto: "text-stone-400" },
];

export const CATEGORIAS_PADRAO_DESPESA_EMPRESA: CategoriaItem[] = [
  { id: "def-emp-folha", nome: "Folha / Pró-labore", tipo: "despesa", tipoConta: "empresa", icone: "Briefcase", corFundo: "bg-emerald-500/10", corTexto: "text-emerald-400" },
  { id: "def-emp-impostos", nome: "Impostos / DAS", tipo: "despesa", tipoConta: "empresa", icone: "Building", corFundo: "bg-red-500/10", corTexto: "text-red-400" },
  { id: "def-emp-aluguel", nome: "Aluguel Comercial", tipo: "despesa", tipoConta: "empresa", icone: "Home", corFundo: "bg-amber-500/10", corTexto: "text-amber-500" },
  { id: "def-emp-sistemas", nome: "Sistemas / SaaS", tipo: "despesa", tipoConta: "empresa", icone: "Laptop", corFundo: "bg-blue-500/10", corTexto: "text-blue-400" },
  { id: "def-emp-contabil", nome: "Contabilidade", tipo: "despesa", tipoConta: "empresa", icone: "Briefcase", corFundo: "bg-indigo-500/10", corTexto: "text-indigo-400" },
  { id: "def-emp-marketing", nome: "Marketing / Anúncios", tipo: "despesa", tipoConta: "empresa", icone: "TrendingUp", corFundo: "bg-purple-500/10", corTexto: "text-purple-400" },
  { id: "def-emp-fornecedores", nome: "Fornecedores", tipo: "despesa", tipoConta: "empresa", icone: "ShoppingBag", corFundo: "bg-orange-500/10", corTexto: "text-orange-400" },
  { id: "def-emp-insumos", nome: "Insumos / Matéria-prima", tipo: "despesa", tipoConta: "empresa", icone: "Wrench", corFundo: "bg-amber-700/20", corTexto: "text-amber-500" },
  { id: "def-emp-servicos", nome: "Serviços", tipo: "despesa", tipoConta: "empresa", icone: "Wrench", corFundo: "bg-sky-500/10", corTexto: "text-sky-400" },
  { id: "def-emp-logistica", nome: "Logística / Entregas", tipo: "despesa", tipoConta: "empresa", icone: "Car", corFundo: "bg-cyan-500/10", corTexto: "text-cyan-400" },
  { id: "def-emp-outros", nome: "Outros", tipo: "despesa", tipoConta: "empresa", icone: "Tag", corFundo: "bg-stone-500/10", corTexto: "text-stone-400" },
];

export const CATEGORIAS_PADRAO_RECEITA_EMPRESA: CategoriaItem[] = [
  { id: "def-emp-vendas-prod", nome: "Vendas de Produtos", tipo: "receita", tipoConta: "empresa", icone: "ShoppingBag", corFundo: "bg-orange-500/10", corTexto: "text-orange-400" },
  { id: "def-emp-prestacao", nome: "Prestação de Serviços", tipo: "receita", tipoConta: "empresa", icone: "Wrench", corFundo: "bg-blue-500/10", corTexto: "text-blue-400" },
  { id: "def-emp-contratos", nome: "Contratos Recorrentes", tipo: "receita", tipoConta: "empresa", icone: "Sparkles", corFundo: "bg-emerald-500/10", corTexto: "text-emerald-400" },
  { id: "def-emp-comissoes", nome: "Comissões", tipo: "receita", tipoConta: "empresa", icone: "TrendingUp", corFundo: "bg-purple-500/10", corTexto: "text-purple-400" },
  { id: "def-emp-rendimentos", nome: "Rendimentos PJ", tipo: "receita", tipoConta: "empresa", icone: "TrendingUp", corFundo: "bg-teal-500/10", corTexto: "text-teal-400" },
  { id: "def-emp-aportes", nome: "Aportes", tipo: "receita", tipoConta: "empresa", icone: "Briefcase", corFundo: "bg-amber-500/10", corTexto: "text-amber-400" },
  { id: "def-emp-reembolsos", nome: "Reembolsos PJ", tipo: "receita", tipoConta: "empresa", icone: "Sparkles", corFundo: "bg-sky-500/10", corTexto: "text-sky-400" },
  { id: "def-emp-outros-rec", nome: "Outros", tipo: "receita", tipoConta: "empresa", icone: "Tag", corFundo: "bg-stone-500/10", corTexto: "text-stone-400" },
];

export function getCategoriasPadrao(
  tipoConta: "pessoal" | "empresa",
  tipo: "despesa" | "receita"
): CategoriaItem[] {
  if (tipoConta === "empresa") {
    return tipo === "despesa" ? CATEGORIAS_PADRAO_DESPESA_EMPRESA : CATEGORIAS_PADRAO_RECEITA_EMPRESA;
  }
  return tipo === "despesa" ? CATEGORIAS_PADRAO_DESPESA_PESSOAL : CATEGORIAS_PADRAO_RECEITA_PESSOAL;
}

export async function carregarCategoriasUsuario(
  userId?: string | null,
  tipoConta: "pessoal" | "empresa" = "pessoal",
  tipo?: "despesa" | "receita"
): Promise<CategoriaItem[]> {
  const padroes = tipo
    ? getCategoriasPadrao(tipoConta, tipo)
    : [...getCategoriasPadrao(tipoConta, "despesa"), ...getCategoriasPadrao(tipoConta, "receita")];

  if (!userId) return padroes;

  try {
    let query = supabase
      .from("categorias")
      .select("*")
      .eq("user_id", userId)
      .eq("tipo_conta", tipoConta);

    if (tipo) {
      query = query.eq("tipo", tipo);
    }

    const { data, error } = await query.order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return padroes;
    }

    const custom: CategoriaItem[] = data.map((c: any) => ({
      id: c.id,
      user_id: c.user_id,
      nome: c.nome,
      tipo: c.tipo as "despesa" | "receita",
      tipoConta: (c.tipo_conta as "pessoal" | "empresa") || tipoConta,
      icone: c.icone || "Tag",
      corFundo: c.cor_fundo || "bg-orange-500/10",
      corTexto: c.cor_texto || "text-[#F97316]",
      created_at: c.created_at,
    }));

    // Merge: custom categories take precedence or are added, ensuring unique names
    const nomesCustom = new Set(custom.map((c) => c.nome.trim().toLowerCase()));
    const padroesNaoSobrescritos = padroes.filter(
      (p) => !nomesCustom.has(p.nome.trim().toLowerCase())
    );

    return [...custom, ...padroesNaoSobrescritos];
  } catch (err) {
    console.error("Erro ao carregar categorias do usuário:", err);
    return padroes;
  }
}

export function notificarAtualizacaoCategorias(
  tipoConta?: "pessoal" | "empresa",
  tipo?: "despesa" | "receita"
) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("organizai_categorias_sync", { detail: { tipoConta, tipo } })
    );
    window.dispatchEvent(new Event("organizai_finance_sync"));
  }
}

