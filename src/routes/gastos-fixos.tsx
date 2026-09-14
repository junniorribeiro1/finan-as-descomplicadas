import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { AppShell } from "@/components/app/AppShell";
import { cn } from "@/lib/utils";
import { brl } from "@/lib/mock-data";
import {
  ChevronDown,
  Plus,
  Tag,
  Trash2,
  Edit2,
  X,
  Search,
  Check,
  Building2,
  User,
  CheckCircle2,
  Clock,
  Power,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import {
  notificarAtualizacaoFinanceira,
  carregarCategoriasUsuario,
  notificarAtualizacaoCategorias,
  type GastoFixoItem,
} from "@/lib/financial-service";
import { toast } from "sonner";

export const Route = createFileRoute("/gastos-fixos")({
  head: () => ({
    meta: [
      { title: "Gastos fixos — OrganizAI" },
      { name: "description", content: "Contas recorrentes - Pessoal e Empresa." },
    ],
  }),
  component: GastosFixos,
});

const CATEGORIAS_PADRAO_PESSOAL = [
  "Moradia",
  "Serviços",
  "Saúde",
  "Lazer",
  "Alimentação",
  "Transporte",
  "Educação",
  "Outros",
];

const CATEGORIAS_PADRAO_EMPRESA = [
  "Folha / Pró-labore",
  "Impostos / DAS",
  "Aluguel Comercial",
  "Sistemas / SaaS",
  "Contabilidade",
  "Marketing",
  "Fornecedores",
  "Serviços",
  "Outros",
];

function GastosFixos() {
  const { user } = useAuth();
  const [gastos, setGastos] = useState<GastoFixoItem[]>([]);
  const [carregando, setCarregando] = useState(true);

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
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [diaVenc, setDiaVenc] = useState("5");
  const [statusGasto, setStatusGasto] = useState<"Pendente" | "Pago">("Pendente");
  const [categoria, setCategoria] = useState("Moradia");
  const [formaPagamento, setFormaPagamento] = useState("Boleto");
  const [ativo, setAtivo] = useState(true);
  const [observacao, setObservacao] = useState("");

  // Modal de EDIÇÃO
  const [gastoEditando, setGastoEditando] = useState<GastoFixoItem | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editValor, setEditValor] = useState("");
  const [editDiaVenc, setEditDiaVenc] = useState("5");
  const [editStatus, setEditStatus] = useState<"Pendente" | "Pago">("Pendente");
  const [editCategoria, setEditCategoria] = useState("");
  const [editFormaPagamento, setEditFormaPagamento] = useState("Boleto");
  const [editAtivo, setEditAtivo] = useState(true);
  const [editObservacao, setEditObservacao] = useState("");

  // Filtros na lista
  const [filtroStatus, setFiltroStatus] = useState<"todos" | "pendentes" | "pagos">("todos");
  const [busca, setBusca] = useState("");

  // Categorias separadas por Pessoal / Empresa
  const [categoriasPessoal, setCategoriasPessoal] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("organizai_cat_pessoal");
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
      const stored = localStorage.getItem("organizai_cat_empresa");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return CATEGORIAS_PADRAO_EMPRESA;
  });

  const categoriasAtuais = tipoConta === "pessoal" ? categoriasPessoal : categoriasEmpresa;
  const [novaCategoria, setNovaCategoria] = useState("");

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
      console.error("Erro ao sincronizar categorias em gastos-fixos:", err);
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
      setCategoria(categoriasPessoal[0] || "Moradia");
    } else {
      setCategoria(categoriasEmpresa[0] || "Folha / Pró-labore");
    }
  }, [tipoConta, categoriasPessoal, categoriasEmpresa]);

  // Carregar gastos fixos do usuário no Supabase
  useEffect(() => {
    if (!user?.id) return;
    const carregar = async () => {
      try {
        setCarregando(true);
        const { data: fixData, error } = await supabase
          .from("gastos_fixos")
          .select("*")
          .eq("user_id", user.id)
          .order("dia_venc", { ascending: true });

        if (!error && fixData) {
          setGastos(
            fixData.map((f: any) => ({
              id: f.id,
              user_id: f.user_id,
              nome: f.nome,
              valor: Number(f.valor) || 0,
              diaVenc: Number(f.dia_venc) || 5,
              status: f.status || "Pendente",
              categoria: f.categoria || (f.tipo_conta === "empresa" ? "Serviços" : "Moradia"),
              formaPagamento: f.forma_pagamento || "Boleto",
              ativo: f.ativo ?? true,
              tipoConta: (f.tipo_conta as "pessoal" | "empresa") || "pessoal",
              observacao: f.observacao,
              created_at: f.created_at,
            }))
          );
        }
      } catch (err) {
        console.error("Erro ao carregar gastos fixos:", err);
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, [user?.id]);

  // Gastos específicos do tipo de conta selecionado (Pessoal ou Empresa)
  const gastosFiltradosPorConta = useMemo(() => {
    return gastos.filter((g) => (g.tipoConta || "pessoal") === tipoConta);
  }, [gastos, tipoConta]);

  // Cálculos dos Top Cards baseados estritamente na conta ativa (Pessoal ou Empresa)
  const gastosAtivosConta = gastosFiltradosPorConta.filter((g) => g.ativo);
  const totalMes = gastosAtivosConta.reduce((acc, curr) => acc + curr.valor, 0);
  const totalPagos = gastosAtivosConta
    .filter((g) => g.status === "Pago")
    .reduce((acc, curr) => acc + curr.valor, 0);
  const totalPendentes = Math.max(0, totalMes - totalPagos);
  const pctPago = totalMes > 0 ? Math.round((totalPagos / totalMes) * 100) : 0;
  const pctPendente = totalMes > 0 ? 100 - pctPago : 0;

  // Lista final visível aplicando busca e filtro de status
  const listaVisivel = useMemo(() => {
    return gastosFiltradosPorConta.filter((g) => {
      if (filtroStatus === "pagos" && g.status !== "Pago") return false;
      if (filtroStatus === "pendentes" && g.status !== "Pendente") return false;
      if (busca.trim()) {
        const termo = busca.toLowerCase();
        return (
          g.nome.toLowerCase().includes(termo) ||
          g.categoria.toLowerCase().includes(termo) ||
          g.formaPagamento.toLowerCase().includes(termo)
        );
      }
      return true;
    });
  }, [gastosFiltradosPorConta, filtroStatus, busca]);

  // Criar Novo Gasto Fixo
  const handleSalvarGasto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      toast.error("Informe o nome do gasto fixo.");
      return;
    }

    const parsedValor = parseFloat(valor.replace(/\./g, "").replace(",", ".")) || 0;
    if (parsedValor <= 0) {
      toast.error("Informe um valor válido maior que zero.");
      return;
    }

    const diaParsed = Math.min(31, Math.max(1, parseInt(diaVenc) || 5));
    const novoGastoTemp: GastoFixoItem = {
      id: "temp-" + Date.now(),
      user_id: user?.id,
      nome: nome.trim(),
      valor: parsedValor,
      diaVenc: diaParsed,
      status: statusGasto,
      categoria,
      formaPagamento,
      ativo,
      tipoConta,
      observacao: observacao.trim() || undefined,
    };

    setGastos((prev) => [...prev, novoGastoTemp].sort((a, b) => a.diaVenc - b.diaVenc));
    setNome("");
    setValor("");
    setObservacao("");

    try {
      if (user?.id) {
        const { data: inserted, error } = await supabase
          .from("gastos_fixos")
          .insert({
            user_id: user.id,
            nome: novoGastoTemp.nome,
            valor: novoGastoTemp.valor,
            dia_venc: novoGastoTemp.diaVenc,
            status: novoGastoTemp.status,
            categoria: novoGastoTemp.categoria,
            forma_pagamento: novoGastoTemp.formaPagamento,
            ativo: novoGastoTemp.ativo,
            tipo_conta: tipoConta,
            observacao: novoGastoTemp.observacao,
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
                    nome: inserted.nome,
                    valor: Number(inserted.valor) || 0,
                    diaVenc: Number(inserted.dia_venc) || 5,
                    status: inserted.status || "Pendente",
                    categoria: inserted.categoria,
                    formaPagamento: inserted.forma_pagamento,
                    ativo: inserted.ativo ?? true,
                    tipoConta: (inserted.tipo_conta as "pessoal" | "empresa") || "pessoal",
                    observacao: inserted.observacao,
                    created_at: inserted.created_at,
                  }
                : item
            )
          );
        }
      }
      notificarAtualizacaoFinanceira();
      toast.success(
        `Gasto fixo (${tipoConta === "empresa" ? "Empresa" : "Pessoal"}) salvo com sucesso!`
      );
    } catch {
      toast.error("Erro ao salvar no banco de dados.");
    }
  };

  // Alternar Status (Pago / Pendente)
  const alternarStatus = async (id: string) => {
    const itemAtual = gastos.find((g) => g.id === id);
    if (!itemAtual) return;
    const novoStatus: "Pendente" | "Pago" = itemAtual.status === "Pago" ? "Pendente" : "Pago";

    setGastos((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status: novoStatus } : g))
    );

    try {
      if (user?.id && !id.startsWith("temp-")) {
        await supabase
          .from("gastos_fixos")
          .update({ status: novoStatus })
          .eq("id", id)
          .eq("user_id", user.id);
      }
      notificarAtualizacaoFinanceira();
      toast.success(`Conta alterada para ${novoStatus}!`);
    } catch {
      toast.error("Erro ao atualizar status.");
    }
  };

  // Alternar Ativo / Inativo na lista
  const alternarAtivoNaLista = async (id: string) => {
    const itemAtual = gastos.find((g) => g.id === id);
    if (!itemAtual) return;
    const novoAtivo = !itemAtual.ativo;

    setGastos((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ativo: novoAtivo } : g))
    );

    try {
      if (user?.id && !id.startsWith("temp-")) {
        await supabase
          .from("gastos_fixos")
          .update({ ativo: novoAtivo })
          .eq("id", id)
          .eq("user_id", user.id);
      }
      notificarAtualizacaoFinanceira();
      toast.info(novoAtivo ? "Gasto fixo reativado." : "Gasto fixo pausado.");
    } catch {
      toast.error("Erro ao atualizar.");
    }
  };

  // Abrir Modal de Edição
  const abrirEdicao = (g: GastoFixoItem) => {
    setGastoEditando(g);
    setEditNome(g.nome);
    setEditValor(g.valor.toFixed(2).replace(".", ","));
    setEditDiaVenc(String(g.diaVenc));
    setEditStatus(g.status);
    setEditCategoria(g.categoria);
    setEditFormaPagamento(g.formaPagamento);
    setEditAtivo(g.ativo);
    setEditObservacao(g.observacao || "");
  };

  // Salvar Edição
  const handleSalvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gastoEditando) return;
    if (!editNome.trim()) {
      toast.error("Informe o nome do gasto.");
      return;
    }

    const valNum = parseFloat(editValor.replace(/\./g, "").replace(",", ".")) || 0;
    if (valNum <= 0) {
      toast.error("Informe um valor válido.");
      return;
    }

    const diaParsed = Math.min(31, Math.max(1, parseInt(editDiaVenc) || 5));
    const atualizado: GastoFixoItem = {
      ...gastoEditando,
      nome: editNome.trim(),
      valor: valNum,
      diaVenc: diaParsed,
      status: editStatus,
      categoria: editCategoria,
      formaPagamento: editFormaPagamento,
      ativo: editAtivo,
      observacao: editObservacao.trim() || undefined,
    };

    setGastos((prev) =>
      prev
        .map((g) => (g.id === gastoEditando.id ? atualizado : g))
        .sort((a, b) => a.diaVenc - b.diaVenc)
    );
    setGastoEditando(null);

    try {
      if (user?.id && !gastoEditando.id.startsWith("temp-")) {
        await supabase
          .from("gastos_fixos")
          .update({
            nome: atualizado.nome,
            valor: atualizado.valor,
            dia_venc: atualizado.diaVenc,
            status: atualizado.status,
            categoria: atualizado.categoria,
            forma_pagamento: atualizado.formaPagamento,
            ativo: atualizado.ativo,
            observacao: atualizado.observacao,
          })
          .eq("id", gastoEditando.id)
          .eq("user_id", user.id);
      }
      notificarAtualizacaoFinanceira();
      toast.success("Gasto fixo atualizado com sucesso!");
    } catch {
      toast.error("Erro ao atualizar gasto no banco.");
    }
  };

  // Excluir Gasto
  const removerGasto = async (id: string) => {
    setGastos((prev) => prev.filter((g) => g.id !== id));
    try {
      if (user?.id && !id.startsWith("temp-")) {
        await supabase.from("gastos_fixos").delete().eq("id", id).eq("user_id", user.id);
      }
      notificarAtualizacaoFinanceira();
      toast.info("Gasto fixo removido.");
    } catch {
      toast.error("Erro ao excluir gasto fixo.");
    }
  };

  // Criar Nova Categoria
  const handleCriarCategoria = async () => {
    const limpo = novaCategoria.trim();
    if (!limpo) return;

    if (tipoConta === "pessoal") {
      if (!categoriasPessoal.includes(limpo)) {
        const novas = [...categoriasPessoal, limpo];
        setCategoriasPessoal(novas);
        if (typeof window !== "undefined") {
          localStorage.setItem("organizai_cat_pessoal", JSON.stringify(novas));
        }
        setCategoria(limpo);
        toast.success(`Categoria "${limpo}" criada para Pessoal!`);
      }
    } else {
      if (!categoriasEmpresa.includes(limpo)) {
        const novas = [...categoriasEmpresa, limpo];
        setCategoriasEmpresa(novas);
        if (typeof window !== "undefined") {
          localStorage.setItem("organizai_cat_empresa", JSON.stringify(novas));
        }
        setCategoria(limpo);
        toast.success(`Categoria "${limpo}" criada para Empresa!`);
      }
    }

    if (user?.id) {
      try {
        await supabase.from("categorias").insert({
          user_id: user.id,
          nome: limpo,
          tipo: "despesa",
          tipo_conta: tipoConta,
          icone: "Tag",
        });
        notificarAtualizacaoCategorias(tipoConta, "despesa");
      } catch (err) {
        console.error("Erro ao persistir categoria:", err);
      }
    }
    setNovaCategoria("");
  };

  return (
    <AppShell>
      {/* Modal de Edição de Gasto Fixo */}
      {gastoEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#161616] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-orange-500/15 text-[#F97316] flex items-center justify-center">
                  <Edit2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Editar Gasto Fixo</h3>
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
                <label className="text-xs font-medium text-stone-300 mb-1 block">Nome</label>
                <input
                  type="text"
                  value={editNome}
                  onChange={(e) => setEditNome(e.target.value)}
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
                  <label className="text-xs font-medium text-stone-300 mb-1 block">Dia vencimento</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={editDiaVenc}
                    onChange={(e) => setEditDiaVenc(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2 text-xs text-white outline-none focus:border-orange-500/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1 block">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as "Pendente" | "Pago")}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Pago">Pago</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1 block">Forma Pagamento</label>
                  <select
                    value={editFormaPagamento}
                    onChange={(e) => setEditFormaPagamento(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="Boleto">Boleto</option>
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                    <option value="Débito Automático">Débito Automático</option>
                    <option value="PIX">PIX</option>
                    <option value="Dinheiro">Dinheiro</option>
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

              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-stone-300">Gasto ativo no mês</span>
                <button
                  type="button"
                  onClick={() => setEditAtivo(!editAtivo)}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer",
                    editAtivo ? "bg-[#F97316]" : "bg-stone-700"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 rounded-full bg-white transition-transform shadow-sm",
                      editAtivo ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-300 mb-1 block">Observação</label>
                <textarea
                  value={editObservacao}
                  onChange={(e) => setEditObservacao(e.target.value)}
                  placeholder="Opcional"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] p-2.5 text-xs text-white outline-none resize-none min-h-[50px]"
                />
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
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.5)] bg-[#1e1e1e] border border-white/10">
            <img
              src="/icons/kpi/gastos@2x.png"
              alt="Gastos fixos"
              className="h-full w-full object-cover select-none pointer-events-none"
            />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white leading-tight">
              Gastos fixos
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Contas recorrentes —{" "}
              <span className="font-semibold text-stone-200">
                {tipoConta === "pessoal" ? "Pessoal" : "Empresa / PJ"}
              </span>
              .
            </p>
          </div>
        </div>

        {/* Seletor Rápido Pessoal vs Empresa na própria página */}
        <div className="flex items-center rounded-full bg-[#181818] p-1 border border-white/[0.08] self-start sm:self-auto shadow-md">
          <button
            type="button"
            onClick={() => alternarTipoConta("pessoal")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer",
              tipoConta === "pessoal"
                ? "bg-[#F97316] text-white shadow-md shadow-orange-950/40"
                : "text-stone-400 hover:text-stone-200"
            )}
          >
            <User className="h-3.5 w-3.5" />
            <span>Pessoal</span>
          </button>
          <button
            type="button"
            onClick={() => alternarTipoConta("empresa")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-all cursor-pointer",
              tipoConta === "empresa"
                ? "bg-[#F97316] text-white shadow-md shadow-orange-950/40"
                : "text-stone-400 hover:text-stone-200"
            )}
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>Empresa</span>
          </button>
        </div>
      </div>

      {/* 2. Top 3 Cards de Resumo (TOTAL DO MÊS, PAGOS, PENDENTES) */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3 mt-6">
        {/* TOTAL DO MÊS */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-stone-400 uppercase">
            <span className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            TOTAL DO MÊS ({tipoConta.toUpperCase()})
          </div>
          <span className="font-display text-2xl font-bold text-white mt-3 block leading-none">
            {brl(totalMes)}
          </span>
          <p className="text-xs text-stone-400 mt-2">
            {gastosAtivosConta.length}{" "}
            {gastosAtivosConta.length === 1 ? "lançamento ativo" : "lançamentos ativos"}
          </p>
        </div>

        {/* PAGOS */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-stone-400 uppercase">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            PAGOS
          </div>
          <span className="font-display text-2xl font-bold text-[#34d399] mt-3 block leading-none">
            {brl(totalPagos)}
          </span>
          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {pctPago}% pago
            </span>
          </div>
        </div>

        {/* PENDENTES */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-stone-400 uppercase">
            <span className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
            PENDENTES
          </div>
          <span className="font-display text-2xl font-bold text-[#fb923c] mt-3 block leading-none">
            {brl(totalPendentes)}
          </span>
          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-950/40 border border-orange-800/40 px-2.5 py-0.5 text-[11px] font-medium text-orange-400">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
              {pctPendente}% em aberto
            </span>
          </div>
        </div>
      </div>

      {/* 3. Barra Horizontal: PAGO VS TOTAL DO MÊS */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-4 px-5 shadow-sm mt-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider text-stone-400 uppercase">
            PAGO VS TOTAL DO MÊS ({tipoConta.toUpperCase()})
          </span>
          <span className="text-xs font-bold text-stone-200 font-mono">
            {brl(totalPagos)} / {brl(totalMes)}
          </span>
        </div>
        <div className="mt-2.5 h-1.5 w-full rounded-full bg-white/[0.07] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#F97316] transition-all duration-300"
            style={{ width: `${pctPago}%` }}
          />
        </div>
      </div>

      {/* 4. Grid Principal em 2 Colunas: Formulário na Esquerda e Lista na Direita */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[380px_minmax(0,1fr)] mt-4 items-start">
        {/* Coluna da Esquerda: Formulários */}
        <div className="space-y-3">
          {/* Card: NOVO GASTO FIXO */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm">
            <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-3/4 rounded-full bg-amber-500/10 blur-xl" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold tracking-wider text-stone-400 uppercase block">
                NOVO GASTO FIXO
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
              {/* Nome */}
              <div>
                <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                  Nome
                </label>
                <input
                  type="text"
                  placeholder={
                    tipoConta === "pessoal" ? "Ex.: Aluguel, Internet..." : "Ex.: DAS, Pró-labore, Contador..."
                  }
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
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

              {/* Linha 2 Colunas: Dia venc. e Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                    Dia venc.
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={diaVenc}
                    onChange={(e) => setDiaVenc(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={statusGasto}
                      onChange={(e) => setStatusGasto(e.target.value as "Pendente" | "Pago")}
                      className="w-full appearance-none rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 pr-8 text-xs text-white outline-none cursor-pointer"
                    >
                      <option value="Pendente" className="bg-[#1e1e1e]">Pendente</option>
                      <option value="Pago" className="bg-[#1e1e1e]">Pago</option>
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
                    <option value="Boleto" className="bg-[#1e1e1e]">Boleto</option>
                    <option value="Cartão de Crédito" className="bg-[#1e1e1e]">Cartão de Crédito</option>
                    <option value="Débito Automático" className="bg-[#1e1e1e]">Débito Automático</option>
                    <option value="PIX" className="bg-[#1e1e1e]">PIX</option>
                    <option value="Dinheiro" className="bg-[#1e1e1e]">Dinheiro</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                </div>
              </div>

              {/* Toggle Ativo */}
              <div className="flex items-center justify-between py-1">
                <div>
                  <span className="text-xs font-semibold text-stone-200 block leading-tight">
                    Ativo
                  </span>
                  <span className="text-[11px] text-stone-400 block">
                    Aparece nos relatórios do mês
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAtivo(!ativo)}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer",
                    ativo ? "bg-[#F97316]" : "bg-stone-700"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 rounded-full bg-white transition-transform shadow-sm",
                      ativo ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>

              {/* Observação */}
              <div>
                <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                  Observação
                </label>
                <textarea
                  placeholder="Opcional"
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] p-3 text-xs text-white placeholder:text-stone-500 outline-none resize-none min-h-[60px] focus:border-orange-500/60 transition-colors"
                />
              </div>

              {/* Botão Salvar Gasto Fixo */}
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:brightness-110 py-3 text-xs font-bold text-white shadow-lg shadow-orange-950/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-2"
              >
                <Plus className="h-3.5 w-3.5" /> Salvar gasto fixo ({tipoConta})
              </button>
            </form>
          </div>

          {/* Card: Nova categoria */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-200 mb-3">
              <Tag className="h-3.5 w-3.5 text-[#F97316]" /> Nova categoria (
              {tipoConta === "pessoal" ? "Pessoal" : "Empresa"})
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Nome da categoria"
                value={novaCategoria}
                onChange={(e) => setNovaCategoria(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleCriarCategoria())}
                className="flex-1 rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2 text-xs text-white placeholder:text-stone-500 outline-none focus:border-orange-500/60"
              />
              <button
                type="button"
                onClick={handleCriarCategoria}
                className="rounded-xl border border-white/10 bg-[#252525] hover:bg-[#2f2f2f] px-4 py-2 text-xs font-semibold text-stone-200 transition-colors cursor-pointer"
              >
                Criar
              </button>
            </div>
          </div>
        </div>

        {/* Coluna da Direita: Lista de Gastos Fixos */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 sm:p-6 shadow-sm min-h-[580px] flex flex-col justify-between">
          <div>
            {/* Cabeçalho da Lista + Filtros */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.06] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">Lista de gastos fixos</h3>
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

              {/* Pílulas de Filtro de Status */}
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
                  Todos ({gastosFiltradosPorConta.length})
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

            {/* Barra de busca rápida */}
            {gastosFiltradosPorConta.length > 0 && (
              <div className="mt-3 relative">
                <Search className="h-3.5 w-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filtrar por nome, categoria ou pagamento..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.06] bg-[#1c1c1c] pl-9 pr-4 py-2 text-xs text-white placeholder:text-stone-500 outline-none focus:border-orange-500/60"
                />
              </div>
            )}

            {/* Lista com Itens */}
            {listaVisivel.length > 0 && (
              <div className="divide-y divide-white/[0.06] mt-3 max-h-[500px] overflow-y-auto pr-1">
                {listaVisivel.map((g) => (
                  <div
                    key={g.id}
                    className={cn(
                      "flex items-center justify-between py-3.5 hover:bg-white/[0.02] px-2 rounded-xl transition-all",
                      !g.ativo && "opacity-50"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Vencimento Badge */}
                      <div
                        title={`Vence todo dia ${g.diaVenc}`}
                        className={cn(
                          "h-10 w-10 shrink-0 rounded-xl flex flex-col items-center justify-center font-bold text-xs shadow-sm",
                          g.status === "Pago"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-orange-500/10 text-[#F97316] border border-orange-500/20"
                        )}
                      >
                        <span className="text-[9px] text-stone-400 leading-none font-normal">Dia</span>
                        <span className="leading-tight">{g.diaVenc}</span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-white leading-tight truncate">
                            {g.nome}
                          </p>
                          {!g.ativo && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-stone-800 text-stone-400">
                              Pausado
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-400 mt-0.5 truncate">
                          {g.categoria} • {g.formaPagamento}
                          {g.observacao && ` — ${g.observacao}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      <span className="font-display text-xs sm:text-sm font-bold text-white font-mono">
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
                        title="Editar gasto fixo"
                        className="rounded-lg p-1.5 text-stone-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>

                      {/* Botão Excluir Gasto */}
                      <button
                        type="button"
                        onClick={() => removerGasto(g.id)}
                        title="Excluir gasto fixo"
                        className="rounded-lg p-1.5 text-stone-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
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
                  src="/cofrinho-icon.png"
                  alt="Nenhum gasto fixo"
                  className="h-full w-full object-cover select-none pointer-events-none"
                />
              </div>
              <h4 className="mt-4 text-sm font-bold text-white">
                Nenhum gasto fixo para {tipoConta === "pessoal" ? "Pessoal" : "Empresa"}
              </h4>
              <p className="mt-1.5 text-xs text-stone-400 max-w-sm text-center leading-relaxed">
                {tipoConta === "pessoal"
                  ? "Cadastre o primeiro no formulário ao lado — aluguel, internet, luz, streaming, etc."
                  : "Cadastre as contas recorrentes da sua empresa — Pró-labore, DAS, Contador, Sistemas, etc."}
              </p>
            </div>
          )}

          {/* Busca sem resultados */}
          {gastosFiltradosPorConta.length > 0 && listaVisivel.length === 0 && (
            <div className="my-auto py-12 text-center text-xs text-stone-400">
              Nenhum gasto fixo encontrado com o filtro aplicado.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
