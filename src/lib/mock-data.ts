// Dados fictícios usados apenas para apresentação visual.

export const aluno = {
  nome: "Keyla",
  nomeCompleto: "Keyla Ribeiro Martins",
  email: "keyla.martins@email.com",
  plano: "Plano Anual · Premium",
  status: "Conta ativa",
  desde: "12/03/2026",
  iniciais: "KM",
};

export const brl = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const resumoMes = {
  saldo: 8406.62,
  receitas: 12190,
  despesas: 3783.38,
  aPagar: 2450,
};

export const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago"];

export const serieMensal = [
  { mes: "Jan", receitas: 9400, despesas: 4100 },
  { mes: "Fev", receitas: 9800, despesas: 3600 },
  { mes: "Mar", receitas: 10400, despesas: 4820 },
  { mes: "Abr", receitas: 10100, despesas: 3980 },
  { mes: "Mai", receitas: 11250, despesas: 5240 },
  { mes: "Jun", receitas: 11600, despesas: 4360 },
  { mes: "Jul", receitas: 11900, despesas: 5010 },
  { mes: "Ago", receitas: 12190, despesas: 3783.38 },
];

export const categorias = [
  { nome: "Moradia", valor: 1450, percentual: 38.3, cor: "var(--chart-1)" },
  { nome: "Alimentação", valor: 862.4, percentual: 22.8, cor: "var(--chart-2)" },
  { nome: "Transporte", valor: 480.5, percentual: 12.7, cor: "var(--chart-3)" },
  { nome: "Saúde", valor: 389.9, percentual: 10.3, cor: "var(--chart-4)" },
  { nome: "Lazer", valor: 320.58, percentual: 8.5, cor: "var(--chart-5)" },
  { nome: "Outros", valor: 280, percentual: 7.4, cor: "var(--chart-6)" },
];

export const categoriasDetalhadas = [
  { nome: "Moradia", valor: 1450, percentual: 38.3, variacao: 2.1, lancamentos: 4 },
  { nome: "Alimentação", valor: 862.4, percentual: 22.8, variacao: 18, lancamentos: 21 },
  { nome: "Transporte", valor: 480.5, percentual: 12.7, variacao: -4.5, lancamentos: 12 },
  { nome: "Saúde", valor: 389.9, percentual: 10.3, variacao: 0, lancamentos: 3 },
  { nome: "Educação", valor: 259.9, percentual: 6.9, variacao: 0, lancamentos: 2 },
  { nome: "Lazer", valor: 320.58, percentual: 8.5, variacao: 9.4, lancamentos: 7 },
  { nome: "Assinaturas", valor: 128.7, percentual: 3.4, variacao: 1.2, lancamentos: 5 },
  { nome: "Outros", valor: 151.3, percentual: 4, variacao: -1.8, lancamentos: 6 },
];

export type Status = "Pago" | "Pendente" | "Recebido" | "Agendado";

export type Lancamento = {
  data: string;
  descricao: string;
  categoria: string;
  pagamento: string;
  valor: number;
  status: Status;
};

export const lancamentos: Lancamento[] = [
  {
    data: "28/08/2026",
    descricao: "Supermercado Pão de Açúcar",
    categoria: "Alimentação",
    pagamento: "Cartão Nubank",
    valor: -320.5,
    status: "Pago",
  },
  {
    data: "27/08/2026",
    descricao: "Academia Smart Fit",
    categoria: "Saúde",
    pagamento: "Pix",
    valor: -89.9,
    status: "Pago",
  },
  {
    data: "25/08/2026",
    descricao: "Salário",
    categoria: "Receita",
    pagamento: "Banco do Brasil",
    valor: 5000,
    status: "Recebido",
  },
  {
    data: "24/08/2026",
    descricao: "Aluguel do apartamento",
    categoria: "Moradia",
    pagamento: "Débito automático",
    valor: -1450,
    status: "Pago",
  },
  {
    data: "22/08/2026",
    descricao: "Uber · deslocamentos",
    categoria: "Transporte",
    pagamento: "Cartão Nubank",
    valor: -138.4,
    status: "Pago",
  },
  {
    data: "20/08/2026",
    descricao: "Mensalidade faculdade",
    categoria: "Educação",
    pagamento: "Boleto",
    valor: -259.9,
    status: "Pendente",
  },
  {
    data: "18/08/2026",
    descricao: "Freelance design",
    categoria: "Receita",
    pagamento: "Pix",
    valor: 1200,
    status: "Recebido",
  },
  {
    data: "15/08/2026",
    descricao: "Netflix + Spotify",
    categoria: "Assinaturas",
    pagamento: "Cartão Itaú",
    valor: -78.8,
    status: "Pago",
  },
  {
    data: "12/08/2026",
    descricao: "Cinema com amigos",
    categoria: "Lazer",
    pagamento: "Pix",
    valor: -96.6,
    status: "Pago",
  },
  {
    data: "10/09/2026",
    descricao: "Fatura Nubank",
    categoria: "Cartão",
    pagamento: "Débito automático",
    valor: -1842.5,
    status: "Agendado",
  },
];

export const alertas = [
  {
    titulo: "3 contas vencem nos próximos 7 dias",
    detalhe: "Total de R$ 1.020,40 · Moradia, Educação e Assinaturas",
    tom: "neutro" as const,
  },
  {
    titulo: "Fatura do cartão vence em 4 dias",
    detalhe: "Nubank · R$ 1.842,50 · vencimento 10/09/2026",
    tom: "atencao" as const,
  },
  {
    titulo: "Você gastou 18% acima da média em Alimentação",
    detalhe: "R$ 862,40 neste mês contra R$ 731,00 de média",
    tom: "neutro" as const,
  },
];

export const cartao = {
  banco: "Nubank",
  numero: "•••• 0911",
  titular: "Keyla R. Martins",
  validade: "03/29",
  fatura: 1842.5,
  limiteTotal: 5000,
  limiteDisponivel: 3157.5,
  vencimento: "10/09/2026",
  fechamento: "03/09/2026",
};

export const comprasCartao = [
  { data: "28/08/2026", descricao: "Supermercado Pão de Açúcar", categoria: "Alimentação", valor: 320.5 },
  { data: "26/08/2026", descricao: "Renner", categoria: "Vestuário", valor: 289.9 },
  { data: "22/08/2026", descricao: "Uber", categoria: "Transporte", valor: 138.4 },
  { data: "19/08/2026", descricao: "Farmácia Pacheco", categoria: "Saúde", valor: 112.3 },
  { data: "16/08/2026", descricao: "iFood", categoria: "Alimentação", valor: 96.7 },
];

export const parcelas = [
  { descricao: "Notebook Lenovo", atual: 4, total: 10, valor: 349.9 },
  { descricao: "Curso de inglês", atual: 2, total: 6, valor: 189.9 },
  { descricao: "Fone Bluetooth", atual: 5, total: 5, valor: 79.9 },
];

export const faturasHistorico = [
  { mes: "Ago 2026", valor: 1842.5, status: "Aberta" },
  { mes: "Jul 2026", valor: 2104.3, status: "Paga" },
  { mes: "Jun 2026", valor: 1687.9, status: "Paga" },
  { mes: "Mai 2026", valor: 2310.4, status: "Paga" },
  { mes: "Abr 2026", valor: 1520.8, status: "Paga" },
];

export const reserva = {
  atual: 6850,
  meta: 15000,
  percentual: 45.7,
  aporteMensal: 650,
  mesesRestantes: 13,
  projecao: "Setembro de 2027",
};

export const aportes = [
  { mes: "Abr 2026", valor: 600 },
  { mes: "Mai 2026", valor: 650 },
  { mes: "Jun 2026", valor: 500 },
  { mes: "Jul 2026", valor: 800 },
  { mes: "Ago 2026", valor: 650 },
];

export const bancos = [
  { nome: "Nubank", conta: "Conta corrente · ag. 0001 / cc 12345-6", saldo: 4210.32, atualizado: "Hoje, 08:40" },
  { nome: "Banco do Brasil", conta: "Conta corrente · ag. 3271 / cc 45871-0", saldo: 2890.5, atualizado: "Hoje, 07:15" },
  { nome: "Itaú", conta: "Conta poupança · ag. 8842 / cc 09112-3", saldo: 980.8, atualizado: "Ontem, 21:02" },
  { nome: "Caixa", conta: "Conta corrente · ag. 1204 / cc 33019-7", saldo: 325, atualizado: "Ontem, 19:47" },
];

export const membrosCards = [
  { titulo: "Minha jornada", descricao: "Acompanhe seu progresso no método de organização financeira.", meta: "Etapa 3 de 8" },
  { titulo: "Aulas", descricao: "Módulos em vídeo sobre orçamento, dívidas e investimentos.", meta: "24 aulas" },
  { titulo: "Materiais", descricao: "Guias em PDF, checklists e resumos para consulta rápida.", meta: "11 arquivos" },
  { titulo: "Planilhas", descricao: "Modelos prontos de controle mensal e planejamento anual.", meta: "6 modelos" },
  { titulo: "Conteúdos", descricao: "Artigos e estudos de caso publicados toda semana.", meta: "Novo hoje" },
  { titulo: "Suporte", descricao: "Fale com a equipe e tire dúvidas sobre o método.", meta: "Seg a sex" },
];
