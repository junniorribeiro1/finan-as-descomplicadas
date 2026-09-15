import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { AppShell } from "@/components/app/AppShell";
import { cn } from "@/lib/utils";
import { brl } from "@/lib/mock-data";
import { usePeriodoAtivo, extrairAnoMes } from "@/lib/periodo";
import {
  ChevronDown,
  Plus,
  Calendar,
  Trash2,
  Edit2,
  X,
  Search,
  CheckCircle2,
  Clock,
  Building2,
  User,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import {
  notificarAtualizacaoFinanceira,
  carregarCategoriasUsuario,
  type GastoVariavelItem,
} from "@/lib/financial-service";
import { toast } from "sonner";

export const Route = createFileRoute("/gastos-variaveis")({
  head: () => ({
    meta: [
      { title: "Gastos variáveis — OrganizAI" },
      { name: "description", content: "Compras e despesas avulsas · Pessoal e Empresa." },
    ],
  }),
  component: GastosVariaveis,
});

const CATEGORIAS_PADRAO_PESSOAL = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Lazer",
  "Saúde",
  "Educação",
  "Vestuário",
  "Serviços",
  "Outros",
];

const CATEGORIAS_PADRAO_EMPRESA = [
  "Insumos / Matéria-prima",
  "Combustível / Viagem",
  "Alimentação / Refeições",
  "Material de Escritório",
  "Software / Ferramentas",
  "Logística / Entregas",
  "Marketing / Anúncios",
  "Manutenção",
  "Serviços",
  "Outros",
];

function parseDataParaISO(dataStr: string): string {
  if (!dataStr) return new Date().toISOString().split("T")[0];
  const limpo = dataStr.trim();
  if (limpo.includes("/")) {
    const parts = limpo.split("/");
    if (parts.length === 3) {
      const d = parts[0].padStart(2, "0");
      const m = parts[1].padStart(2, "0");
      const y = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
      return `${y}-${m}-${d}`;
    }
  }
  if (limpo.includes("-")) {
    const parts = limpo.split("-");
    if (parts.length === 3 && parts[0].length === 4) {
      return limpo;
    }
    if (parts.length === 3 && parts[2].length === 4) {
      return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
    }
  }
  return new Date().toISOString().split("T")[0];
}

function formatarDataExibicao(dataStr: string): string {
  if (!dataStr) return "";
  const limpo = dataStr.trim();
  if (limpo.includes("-")) {
    const parts = limpo.split("-");
    if (parts.length === 3 && parts[0].length === 4) {
      return `${parts[2].slice(0, 2)}/${parts[1]}/${parts[0]}`;
    }
  }
  return limpo;
}

function GastosVariaveis() {
  const { user } = useAuth();
  const periodo = usePeriodoAtivo();
  const [gastos, setGastos] = useState<GastoVariavelItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroPeriodo, setFiltroPeriodo] = useState<"mes" | "ano" | "todos">("mes");

  // Modo da Conta: "pessoal" ou "empresa"
  const [tipoConta, setTipoConta] = useState<"pessoal" | "empresa">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("organizai_tipo_conta") as "pessoal" | "empresa") || "pessoal";
    }
    return "pessoal";
  });

  // Alterna o tipo de conta (sincroniza com AppShell e localStorage)
  const alternarTipoConta = (novo: "pessoal" | "empresa") => {
    setTipoConta(novo);
    if (typeof window !== "undefined") {
      localStorage.setItem("organizai_tipo_conta", novo);
      window.dispatchEvent(new CustomEvent("organizai_tipo_conta_sync", { detail: novo }));
    }
  };

  // Ouve alterações feitas pelo AppShell (toggle no topo da página)
  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail) {
        setTipoConta(e.detail);
      } else if (typeof window !== "undefined") {
        const stored = localStorage.getItem("organizai_tipo_conta") as "pessoal" | "empresa";
        if (stored) setTipoConta(stored);
      }
    };
    window.addEventListener("organizai_tipo_conta_sync", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("organizai_tipo_conta_sync", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  // Form states para NOVO Gasto
  const hoje = new Date().toLocaleDateString("pt-BR");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(hoje);
  const [statusGasto, setStatusGasto] = useState<"Pago" | "Pendente">("Pago");
  const [categoria, setCategoria] = useState("Alimentação");
  const [formaPagamento, setFormaPagamento] = useState("PIX");

  // Modal de EDIÇÃO
  const [gastoEditando, setGastoEditando] = useState<GastoVariavelItem | null>(null);
  const [editDescricao, setEditDescricao] = useState("");
  const [editValor, setEditValor] = useState("");
  const [editData, setEditData] = useState("");
  const [editStatus, setEditStatus] = useState<"Pago" | "Pendente">("Pago");
  const [editCategoria, setEditCategoria] = useState("");
  const [editFormaPagamento, setEditFormaPagamento] = useState("PIX");

  // Filtros na lista
  const [filtroStatus, setFiltroStatus] = useState<"todos" | "pendentes" | "pagos">("todos");
  const [busca, setBusca] = useState("");

  // Categorias separadas por Pessoal / Empresa
  const [categoriasPessoal, setCategoriasPessoal] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("organizai_cat_var_pessoal");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return CATEGORIAS_PADRAO_PESSOAL;
  });

  const [categoriasEmpresa, setCategoriasEmpresa] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("organizai_cat_var_empresa");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return CATEGORIAS_PADRAO_EMPRESA;
  });

  const categoriasAtuais = tipoConta === "pessoal" ? categoriasPessoal : categoriasEmpresa;

  // Carregar e sincronizar categorias em tempo real com /categorias
  const recarregarCategorias = async () => {
    try {
      const [catsP, catsE] = await Promise.all([
        carregarCategoriasUsuario(user?.id, "pessoal", "despesa"),
        carregarCategoriasUsuario(user?.id, "empresa", "despesa"),
      ]);
      setCategoriasPessoal(catsP.map((c) => c.nome));
      setCategoriasEmpresa(catsE.map((c) => c.nome));
    } catch (err) {
      console.error("Erro ao sincronizar categorias em gastos-variaveis:", err);
    }
  };

  useEffect(() => {
    recarregarCategorias();
    const handler = () => recarregarCategorias();
    window.addEventListener("organizai_categorias_sync", handler);
    return () => window.removeEventListener("organizai_categorias_sync", handler);
  }, [user?.id]);

  // Ajusta categoria padrão ao trocar de conta
  useEffect(() => {
    if (tipoConta === "pessoal") {
      setCategoria(categoriasPessoal[0] || "Alimentação");
    } else {
      setCategoria(categoriasEmpresa[0] || "Insumos / Matéria-prima");
    }
  }, [tipoConta, categoriasPessoal, categoriasEmpresa]);

  // Carregar gastos variáveis do usuário no Supabase
  useEffect(() => {
    if (!user?.id) return;
    const carregar = async () => {
      try {
        setCarregando(true);
        const { data: varData, error } = await supabase
          .from("gastos_variaveis")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!error && varData) {
          setGastos(
            varData.map((v: any) => ({
              id: v.id,
              user_id: v.user_id,
              descricao: v.descricao,
              valor: Number(v.valor) || 0,
              data: v.data || hoje,
              status: v.status || "Pago",
              categoria: v.categoria || (v.tipo_conta === "empresa" ? "Serviços" : "Outros"),
              formaPagamento: v.forma_pagamento || "PIX",
              tipoConta: (v.tipo_conta as "pessoal" | "empresa") || "pessoal",
              created_at: v.created_at,
            }))
          );
        }
      } catch (err) {
        console.error("Erro ao carregar gastos variáveis:", err);
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, [user?.id, hoje]);

  // Gastos específicos do tipo de conta selecionado (Pessoal ou Empresa)
  const gastosFiltradosPorConta = useMemo(() => {
    return gastos.filter((g) => (g.tipoConta || "pessoal") === tipoConta);
  }, [gastos, tipoConta]);

  // Gastos filtrados pelo período ativo (Mês, Ano ou Todos)
  const gastosFiltradosPorPeriodo = useMemo(() => {
    return gastosFiltradosPorConta.filter((g) => {
      if (filtroPeriodo === "todos") return true;
      const { ano, mesIndex } = extrairAnoMes(g.data);
      if (filtroPeriodo === "ano") {
        return ano === periodo.ano;
      }
      if (filtroPeriodo === "mes") {
        return ano === periodo.ano && mesIndex === periodo.mesIndex;
      }
      return true;
    });
  }, [gastosFiltradosPorConta, filtroPeriodo, periodo.mesIndex, periodo.ano]);

  // Cálculos dos Top Cards baseados no período selecionado e tipo de conta ativo
  const totalMes = gastosFiltradosPorPeriodo.reduce((acc, curr) => acc + curr.valor, 0);
  const totalPagos = gastosFiltradosPorPeriodo.filter((g) => g.status === "Pago").length;

  // Categoria líder do período ativo
  const categoriaTotais = useMemo(() => {
    return gastosFiltradosPorPeriodo.reduce((acc, g) => {
      acc[g.categoria] = (acc[g.categoria] || 0) + g.valor;
      return acc;
    }, {} as Record<string, number>);
  }, [gastosFiltradosPorPeriodo]);

  const liderEntry = Object.entries(categoriaTotais).sort((a, b) => b[1] - a[1])[0];
  const categoriaLider = liderEntry ? { nome: liderEntry[0], total: liderEntry[1] } : null;

  // Lista visível com busca e filtro de status
  const listaVisivel = useMemo(() => {
    return gastosFiltradosPorPeriodo.filter((g) => {
      if (filtroStatus === "pagos" && g.status !== "Pago") return false;
      if (filtroStatus === "pendentes" && g.status !== "Pendente") return false;
      if (busca.trim()) {
        const termo = busca.toLowerCase();
        return (
          g.descricao.toLowerCase().includes(termo) ||
          g.categoria.toLowerCase().includes(termo) ||
          g.formaPagamento.toLowerCase().includes(termo)
        );
      }
      return true;
    });
  }, [gastosFiltradosPorPeriodo, filtroStatus, busca]);

  // Criar Novo Gasto Variável
  const handleSalvarGasto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim()) {
      toast.error("Informe a descrição do gasto variável.");
      return;
    }

    const parsedValor = parseFloat(valor.replace(/\./g, "").replace(",", ".")) || 0;
    if (parsedValor <= 0) {
      toast.error("Informe um valor válido maior que zero.");
      return;
    }

    const dataFinal = parseDataParaISO(data.trim() || hoje);
    const novoGastoTemp: GastoVariavelItem = {
      id: "temp-" + Date.now(),
      user_id: user?.id,
      descricao: descricao.trim(),
      valor: parsedValor,
      data: dataFinal,
      status: statusGasto,
      categoria,
      formaPagamento,
      tipoConta,
    };

    setGastos((prev) => [novoGastoTemp, ...prev]);
    setDescricao("");
    setValor("");

    try {
      if (user?.id) {
        const { data: inserted, error } = await supabase
          .from("gastos_variaveis")
          .insert({
            user_id: user.id,
            descricao: novoGastoTemp.descricao,
            valor: novoGastoTemp.valor,
            data: novoGastoTemp.data,
            status: novoGastoTemp.status,
            categoria: novoGastoTemp.categoria,
            forma_pagamento: novoGastoTemp.formaPagamento,
            tipo_conta: tipoConta,
          })
          .select()
          .single();

        if (!error && inserted) {
          setGastos((prev) =>
            prev.map((item) =>
              item.id === novoGastoTemp.id
                ? {
                    id: inserted.id,
                    user_id: inserted.user_id,
                    descricao: inserted.descricao,
                    valor: Number(inserted.valor) || 0,
                    data: inserted.data,
                    status: inserted.status || "Pago",
                    categoria: inserted.categoria,
                    formaPagamento: inserted.forma_pagamento,
                    tipoConta: (inserted.tipo_conta as "pessoal" | "empresa") || "pessoal",
                    created_at: inserted.created_at,
                  }
                : item
            )
          );
        }
      }
      notificarAtualizacaoFinanceira();
      toast.success(
        `Gasto variável (${tipoConta === "empresa" ? "Empresa" : "Pessoal"}) lançado com sucesso!`
      );
    } catch {
      toast.error("Erro ao salvar no banco de dados.");
    }
  };

  // Alternar Status (Pago / Pendente)
  const alternarStatus = async (id: string) => {
    const itemAtual = gastos.find((g) => g.id === id);
    if (!itemAtual) return;
    const novoStatus: "Pago" | "Pendente" = itemAtual.status === "Pago" ? "Pendente" : "Pago";

    setGastos((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status: novoStatus } : g))
    );

    try {
      if (user?.id && !id.startsWith("temp-")) {
        await supabase
          .from("gastos_variaveis")
          .update({ status: novoStatus })
          .eq("id", id)
          .eq("user_id", user.id);
      }
      notificarAtualizacaoFinanceira();
      toast.success(`Gasto alterado para ${novoStatus}!`);
    } catch {
      toast.error("Erro ao atualizar status.");
    }
  };

  // Abrir Modal de Edição
  const abrirEdicao = (g: GastoVariavelItem) => {
    setGastoEditando(g);
    setEditDescricao(g.descricao);
    setEditValor(g.valor.toFixed(2).replace(".", ","));
    setEditData(formatarDataExibicao(g.data));
    setEditStatus(g.status);
    setEditCategoria(g.categoria);
    setEditFormaPagamento(g.formaPagamento);
  };

  // Salvar Edição
  const handleSalvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gastoEditando) return;
    if (!editDescricao.trim()) {
      toast.error("Informe a descrição.");
      return;
    }

    const valNum = parseFloat(editValor.replace(/\./g, "").replace(",", ".")) || 0;
    if (valNum <= 0) {
      toast.error("Informe um valor válido.");
      return;
    }

    const atualizado: GastoVariavelItem = {
      ...gastoEditando,
      descricao: editDescricao.trim(),
      valor: valNum,
      data: parseDataParaISO(editData.trim() || hoje),
      status: editStatus,
      categoria: editCategoria,
      formaPagamento: editFormaPagamento,
    };

    setGastos((prev) =>
      prev.map((g) => (g.id === gastoEditando.id ? atualizado : g))
    );
    setGastoEditando(null);

    try {
      if (user?.id && !gastoEditando.id.startsWith("temp-")) {
        await supabase
          .from("gastos_variaveis")
          .update({
            descricao: atualizado.descricao,
            valor: atualizado.valor,
            data: atualizado.data,
            status: atualizado.status,
            categoria: atualizado.categoria,
            forma_pagamento: atualizado.formaPagamento,
          })
          .eq("id", gastoEditando.id)
          .eq("user_id", user.id);
      }
      notificarAtualizacaoFinanceira();
      toast.success("Gasto variável atualizado com sucesso!");
    } catch {
      toast.error("Erro ao atualizar no banco.");
    }
  };

  // Excluir Gasto
  const removerGasto = async (id: string) => {
    setGastos((prev) => prev.filter((g) => g.id !== id));
    try {
      if (user?.id && !id.startsWith("temp-")) {
        await supabase.from("gastos_variaveis").delete().eq("id", id).eq("user_id", user.id);
      }
      notificarAtualizacaoFinanceira();
      toast.info("Gasto variável removido.");
    } catch {
      toast.error("Erro ao remover gasto.");
    }
  };


  return (
    <AppShell>
      {/* Modal de Edição de Gasto Variável */}
      {gastoEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#161616] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-orange-500/15 text-[#F97316] flex items-center justify-center">
                  <Edit2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Editar Gasto Variável</h3>
                  <p className="text-[11px] text-stone-400">
                    {tipoConta === "empresa" ? "Conta Empresarial / PJ" : "Conta Pessoal"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setGastoEditando(null)}
                className="rounded-lg p-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSalvarEdicao} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-stone-300 mb-1 block">Descrição</label>
                <input
                  type="text"
                  value={editDescricao}
                  onChange={(e) => setEditDescricao(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2 text-xs text-white outline-none focus:border-orange-500/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1 block">Valor (R$)</label>
                  <input
                    type="text"
                    value={editValor}
                    onChange={(e) => setEditValor(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2 text-xs text-white outline-none focus:border-orange-500/60"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1 block">Data</label>
                  <input
                    type="text"
                    value={editData}
                    onChange={(e) => setEditData(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2 text-xs text-white outline-none focus:border-orange-500/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1 block">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as "Pago" | "Pendente")}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="Pago">Pago</option>
                    <option value="Pendente">Pendente</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1 block">Forma Pagamento</label>
                  <select
                    value={editFormaPagamento}
                    onChange={(e) => setEditFormaPagamento(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="PIX">PIX</option>
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                    <option value="Cartão de Débito">Cartão de Débito</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Boleto">Boleto</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-300 mb-1 block">Categoria</label>
                <select
                  value={editCategoria}
                  onChange={(e) => setEditCategoria(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2 text-xs text-white outline-none"
                >
                  {categoriasAtuais.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setGastoEditando(null)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#F97316] to-[#EA580C] px-5 py-2 text-xs font-bold text-white shadow-md shadow-orange-950/40 hover:brightness-110 transition-all cursor-pointer"
                >
                  Salvar alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1. Cabeçalho da Página com Toggle Pessoal / Empresa Integrado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.5)] bg-[#1e1e1e] border border-white/10">
            <img
              src="/icons/kpi/gastos@2x.png"
              alt="Gastos variáveis"
              className="h-full w-full object-cover select-none pointer-events-none"
            />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white leading-tight">
              Gastos variáveis
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Compras avulsas —{" "}
              <span className="font-semibold text-stone-200">
                {tipoConta === "pessoal" ? "Pessoal" : "Empresa / PJ"}
              </span>
              .
            </p>
          </div>
        </div>
      </div>

      {/* 2. Top 3 Cards de Resumo (TOTAL DO MÊS, LANÇAMENTOS, CATEGORIA LÍDER) */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3 mt-6">
        {/* TOTAL DO MÊS */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
            <span className="h-2 w-2 rounded-full bg-[#FF6B6B] shadow-[0_0_8px_rgba(255,107,107,0.6)]" />
            TOTAL DE {filtroPeriodo === "mes" ? periodo.mesTexto.toUpperCase() : filtroPeriodo === "ano" ? String(periodo.ano) : "TODOS"} ({tipoConta.toUpperCase()})
          </div>
          <span className="font-display text-2xl font-bold text-[#FF6B6B] mt-3 block leading-none font-mono">
            {brl(totalMes)}
          </span>
          <p className="text-xs text-stone-500 mt-2">
            {gastosFiltradosPorPeriodo.length === 0
              ? "Sem compras registradas neste período"
              : `${gastosFiltradosPorPeriodo.length} ${
                  gastosFiltradosPorPeriodo.length === 1 ? "compra registrada" : "compras registradas"
                }`}
          </p>
        </div>

        {/* LANÇAMENTOS */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
            <span className="h-2 w-2 rounded-full bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            LANÇAMENTOS ({tipoConta.toUpperCase()})
          </div>
          <span className="font-display text-2xl font-bold text-[#3b82f6] mt-3 block leading-none font-mono">
            {gastosFiltradosPorPeriodo.length}
          </span>
          {gastosFiltradosPorPeriodo.length > 0 && (
            <p className="text-xs text-stone-500 mt-2">
              {totalPagos} pagos • {gastosFiltradosPorPeriodo.length - totalPagos} pendentes
            </p>
          )}
        </div>

        {/* CATEGORIA LÍDER */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
            <span className="h-2 w-2 rounded-full bg-[#c084fc] shadow-[0_0_8px_rgba(192,132,252,0.6)]" />
            CATEGORIA LÍDER ({tipoConta.toUpperCase()})
          </div>
          <div className="mt-3">
            {categoriaLider ? (
              <div>
                <span className="font-display text-xl font-bold text-[#c084fc] block leading-none truncate">
                  {categoriaLider.nome}
                </span>
                <p className="text-xs text-stone-400 mt-2 font-mono">
                  {brl(categoriaLider.total)}
                </p>
              </div>
            ) : (
              <div className="h-1 w-6 rounded-full bg-[#c084fc] mt-4" />
            )}
          </div>
        </div>
      </div>

      {/* 3. Grid Principal em 2 Colunas: Formulário na Esquerda e Painel na Direita */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[380px_minmax(0,1fr)] mt-4 items-start">
        {/* Coluna da Esquerda: NOVO GASTO VARIÁVEL */}
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm">
            <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-3/4 rounded-full bg-amber-500/10 blur-xl" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold tracking-wider text-stone-400 uppercase block">
                NOVO GASTO VARIÁVEL
              </span>
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                  tipoConta === "pessoal"
                    ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                    : "bg-purple-500/10 border-purple-500/30 text-purple-400"
                )}
              >
                {tipoConta}
              </span>
            </div>

            <form onSubmit={handleSalvarGasto} className="space-y-3.5">
              {/* Descrição */}
              <div>
                <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                  Descrição
                </label>
                <input
                  type="text"
                  placeholder={
                    tipoConta === "pessoal"
                      ? "Ex.: Supermercado, Farmácia..."
                      : "Ex.: Fornecedor, Material escritório..."
                  }
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white placeholder:text-stone-500 outline-none focus:border-orange-500/60 transition-colors"
                />
              </div>

              {/* Valor */}
              <div>
                <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                  Valor
                </label>
                <div className="relative flex items-center rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs focus-within:border-orange-500/60 transition-colors">
                  <span className="text-stone-400 font-medium mr-1.5 select-none">R$</span>
                  <input
                    type="text"
                    placeholder="0,00"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    className="w-full bg-transparent text-white font-medium outline-none placeholder:text-stone-500"
                  />
                </div>
              </div>

              {/* Linha 2 Colunas: Data e Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                    Data
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={data}
                      onChange={(e) => setData(e.target.value)}
                      placeholder={hoje}
                      className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 pr-8 text-xs text-white placeholder:text-stone-500 outline-none focus:border-orange-500/60 transition-colors"
                    />
                    <Calendar className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={statusGasto}
                      onChange={(e) => setStatusGasto(e.target.value as "Pago" | "Pendente")}
                      className="w-full appearance-none rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 pr-8 text-xs text-white outline-none cursor-pointer"
                    >
                      <option value="Pago" className="bg-[#1e1e1e]">Pago</option>
                      <option value="Pendente" className="bg-[#1e1e1e]">Pendente</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                  </div>
                </div>
              </div>

              {/* Categoria */}
              <div>
                <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                  Categoria ({tipoConta === "pessoal" ? "Pessoal" : "Empresa"})
                </label>
                <div className="relative">
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 pr-8 text-xs text-white outline-none cursor-pointer"
                  >
                    {categoriasAtuais.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#1e1e1e]">
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                </div>
              </div>

              {/* Forma de pagamento */}
              <div>
                <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                  Forma de pagamento
                </label>
                <div className="relative">
                  <select
                    value={formaPagamento}
                    onChange={(e) => setFormaPagamento(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 pr-8 text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="PIX" className="bg-[#1e1e1e]">PIX</option>
                    <option value="Cartão de Crédito" className="bg-[#1e1e1e]">Cartão de Crédito</option>
                    <option value="Cartão de Débito" className="bg-[#1e1e1e]">Cartão de Débito</option>
                    <option value="Dinheiro" className="bg-[#1e1e1e]">Dinheiro</option>
                    <option value="Boleto" className="bg-[#1e1e1e]">Boleto</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                </div>
              </div>

              {/* Botão + Lançar gasto */}
              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:brightness-110 py-3 text-xs font-bold text-white shadow-lg shadow-orange-950/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-2"
              >
                <Plus className="h-4 w-4" /> Lançar gasto ({tipoConta})
              </button>
            </form>
          </div>


        </div>

        {/* Coluna da Direita: Gastos lançados */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 sm:p-6 shadow-sm min-h-[580px] flex flex-col justify-between">
          <div>
            {/* Cabeçalho da Lista + Filtros */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.06] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">Gastos lançados</h3>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border",
                      tipoConta === "pessoal"
                        ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                        : "bg-purple-500/10 border-purple-500/30 text-purple-400"
                    )}
                  >
                    {tipoConta}
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Toque no status pra alternar pago/pendente instantaneamente
                </p>
              </div>

              {/* Pílulas de Filtro de Período e Status */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Período */}
                <div className="flex items-center gap-1 bg-[#1e1e1e] p-1 rounded-xl border border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setFiltroPeriodo("mes")}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer",
                      filtroPeriodo === "mes"
                        ? "bg-[#F97316] text-white font-bold shadow-sm"
                        : "text-stone-400 hover:text-stone-200"
                    )}
                  >
                    Mês ({periodo.mesTexto})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFiltroPeriodo("ano")}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer",
                      filtroPeriodo === "ano"
                        ? "bg-[#F97316] text-white font-bold shadow-sm"
                        : "text-stone-400 hover:text-stone-200"
                    )}
                  >
                    Ano ({periodo.ano})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFiltroPeriodo("todos")}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer",
                      filtroPeriodo === "todos"
                        ? "bg-[#F97316] text-white font-bold shadow-sm"
                        : "text-stone-400 hover:text-stone-200"
                    )}
                  >
                    Todos
                  </button>
                </div>

                {/* Status */}
                <div className="flex items-center gap-1.5 bg-[#1e1e1e] p-1 rounded-xl border border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setFiltroStatus("todos")}
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer",
                      filtroStatus === "todos"
                        ? "bg-white/10 text-white font-bold"
                        : "text-stone-400 hover:text-stone-200"
                    )}
                  >
                    Todos ({gastosFiltradosPorPeriodo.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFiltroStatus("pendentes")}
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer",
                      filtroStatus === "pendentes"
                        ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30"
                        : "text-stone-400 hover:text-stone-200"
                    )}
                  >
                    Pendentes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFiltroStatus("pagos")}
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer",
                      filtroStatus === "pagos"
                        ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30"
                        : "text-stone-400 hover:text-stone-200"
                    )}
                  >
                    Pagos
                  </button>
                </div>
              </div>
            </div>

            {/* Barra de busca rápida */}
            {gastosFiltradosPorConta.length > 0 && (
              <div className="mt-3 relative">
                <Search className="h-3.5 w-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filtrar por descrição, categoria ou forma de pagamento..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.06] bg-[#1c1c1c] pl-9 pr-4 py-2 text-xs text-white placeholder:text-stone-500 outline-none focus:border-orange-500/60"
                />
              </div>
            )}

            {/* Lista de gastos se houver itens */}
            {listaVisivel.length > 0 && (
              <div className="divide-y divide-white/[0.06] mt-3 max-h-[500px] overflow-y-auto pr-1">
                {listaVisivel.map((g) => (
                  <div
                    key={g.id}
                    className="flex items-center justify-between py-3.5 hover:bg-white/[0.02] px-2 rounded-xl transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar Categoria */}
                      <div className="h-10 w-10 shrink-0 rounded-xl bg-orange-500/10 text-[#F97316] flex items-center justify-center font-bold text-xs shadow-sm border border-orange-500/20">
                        {g.categoria.slice(0, 2).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white leading-tight truncate">
                          {g.descricao}
                        </p>
                        <p className="text-[11px] text-stone-400 mt-0.5 truncate">
                          {g.categoria} • {g.formaPagamento} • {formatarDataExibicao(g.data)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      <span className="font-display text-xs sm:text-sm font-bold text-[#FF6B6B] font-mono">
                        {brl(g.valor)}
                      </span>

                      {/* Botão de Alternar Status Pago / Pendente */}
                      <button
                        type="button"
                        onClick={() => alternarStatus(g.id)}
                        title="Toque para alternar entre Pago e Pendente"
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 shadow-sm",
                          g.status === "Pago"
                            ? "bg-emerald-950/50 border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/60"
                            : "bg-orange-950/50 border-orange-800/60 text-orange-300 hover:bg-orange-900/60"
                        )}
                      >
                        {g.status === "Pago" ? (
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Clock className="h-3 w-3 text-orange-400" />
                        )}
                        <span>{g.status}</span>
                      </button>

                      {/* Botão Editar Gasto */}
                      <button
                        type="button"
                        onClick={() => abrirEdicao(g)}
                        title="Editar gasto variável"
                        className="rounded-lg p-1.5 text-stone-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>

                      {/* Botão Excluir Gasto */}
                      <button
                        type="button"
                        onClick={() => removerGasto(g.id)}
                        className="rounded-lg p-1.5 text-stone-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Excluir gasto"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Estado Vazio */}
          {gastosFiltradosPorConta.length === 0 && (
            <div className="my-auto py-16 flex flex-col items-center justify-center text-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden shadow-xl shadow-black/80 border border-white/[0.08] bg-[#1a1a1a]">
                <img
                  src="/empty-search-icon@2x.png"
                  alt="Nenhum gasto lançado"
                  className="h-full w-full object-cover select-none pointer-events-none"
                />
              </div>
              <h4 className="mt-4 text-sm font-bold text-white">
                Nenhum gasto lançado para {tipoConta === "pessoal" ? "Pessoal" : "Empresa"}
              </h4>
              <p className="mt-1.5 text-xs text-stone-400 max-w-sm text-center leading-relaxed">
                {tipoConta === "pessoal"
                  ? "Registre a primeira compra pessoal ao lado — supermercado, farmácia, lazer, etc."
                  : "Registre a primeira despesa da empresa ao lado — fornecedor, matéria-prima, viagens, etc."}
              </p>
            </div>
          )}

          {/* Busca sem resultados */}
          {gastosFiltradosPorConta.length > 0 && listaVisivel.length === 0 && (
            <div className="my-auto py-12 text-center text-xs text-stone-400">
              Nenhum gasto variável encontrado com o filtro aplicado.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
