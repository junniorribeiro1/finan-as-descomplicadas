import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { AppShell } from "@/components/app/AppShell";
import { cn } from "@/lib/utils";
import { brl } from "@/lib/mock-data";
import {
  ChevronDown,
  Plus,
  Calendar,
  Trash2,
  Pencil,
  X,
  Search,
  User,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import {
  notificarAtualizacaoFinanceira,
  carregarCategoriasUsuario,
  type RecebimentoItem,
} from "@/lib/financial-service";
import { toast } from "sonner";

export const Route = createFileRoute("/recebimentos")({
  head: () => ({
    meta: [
      { title: "Entradas — OrganizAI" },
      { name: "description", content: "Entradas e recebimentos · Pessoal e Empresa." },
      { property: "og:title", content: "Entradas — OrganizAI" },
    ],
  }),
  component: Recebimentos,
});

const CATEGORIAS_PADRAO_PESSOAL = [
  "Salário",
  "Freelance",
  "Investimentos",
  "Pró-labore",
  "Vendas",
  "Restituição IR",
  "Presente / Bônus",
  "Outros",
];

const CATEGORIAS_PADRAO_EMPRESA = [
  "Vendas de Produtos",
  "Prestação de Serviços",
  "Contratos Recorrentes",
  "Comissões",
  "Rendimentos PJ",
  "Aportes",
  "Reembolsos PJ",
  "Outros",
];

const BANCOS_PADRAO = [
  "Selecionar",
  "Nubank",
  "Inter",
  "Itaú",
  "Bradesco",
  "Caixa Econômica",
  "Banco do Brasil",
  "Santander",
  "C6 Bank",
  "BTG Pactual",
  "Outro",
];

// Helper para converter data para formato ISO YYYY-MM-DD aceito pelo Postgres
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

// Helper para exibição amigável em DD/MM/YYYY
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

// Extrai partes de data para filtros de período
function extrairDataParts(dataStr: string) {
  if (!dataStr) return { ano: new Date().getFullYear(), mes: new Date().getMonth() };
  if (dataStr.includes("-")) {
    const parts = dataStr.split("-");
    if (parts.length === 3) {
      return {
        ano: parseInt(parts[0], 10),
        mes: parseInt(parts[1], 10) - 1,
        dia: parseInt(parts[2], 10),
      };
    }
  }
  if (dataStr.includes("/")) {
    const parts = dataStr.split("/");
    if (parts.length === 3) {
      return {
        ano: parseInt(parts[2], 10),
        mes: parseInt(parts[1], 10) - 1,
        dia: parseInt(parts[0], 10),
      };
    }
  }
  return { ano: new Date().getFullYear(), mes: new Date().getMonth() };
}

function dataCorrespondeAoPeriodo(dataStr: string, filtro: "mes" | "ano" | "todos"): boolean {
  if (filtro === "todos") return true;
  const hoje = new Date();
  const { ano, mes } = extrairDataParts(dataStr);
  if (filtro === "ano") {
    return ano === hoje.getFullYear();
  }
  if (filtro === "mes") {
    return ano === hoje.getFullYear() && mes === hoje.getMonth();
  }
  return true;
}

function Recebimentos() {
  const { user } = useAuth();
  const [recebimentos, setRecebimentos] = useState<RecebimentoItem[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Modo da Conta: "pessoal" ou "empresa"
  const [tipoConta, setTipoConta] = useState<"pessoal" | "empresa">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("organizai_tipo_conta") as "pessoal" | "empresa") || "pessoal";
    }
    return "pessoal";
  });

  // Alterna tipo de conta com sincronização com AppShell e localStorage
  const alternarTipoConta = (novo: "pessoal" | "empresa") => {
    setTipoConta(novo);
    if (typeof window !== "undefined") {
      localStorage.setItem("organizai_tipo_conta", novo);
      window.dispatchEvent(new CustomEvent("organizai_tipo_conta_sync", { detail: novo }));
    }
  };

  // Ouve eventos de sincronização de tipo de conta
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

  // Categorias salvas por tipo de conta
  const [categoriasPessoal, setCategoriasPessoal] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("organizai_cat_rec_pessoal");
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
      const stored = localStorage.getItem("organizai_cat_rec_empresa");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return CATEGORIAS_PADRAO_EMPRESA;
  });

  const categoriasAtivas = tipoConta === "pessoal" ? categoriasPessoal : categoriasEmpresa;

  // Carregar e sincronizar categorias em tempo real com /categorias
  const recarregarCategorias = async () => {
    try {
      const [catsP, catsE] = await Promise.all([
        carregarCategoriasUsuario(user?.id, "pessoal", "receita"),
        carregarCategoriasUsuario(user?.id, "empresa", "receita"),
      ]);
      setCategoriasPessoal(catsP.map((c) => c.nome));
      setCategoriasEmpresa(catsE.map((c) => c.nome));
    } catch (err) {
      console.error("Erro ao sincronizar categorias em recebimentos:", err);
    }
  };

  useEffect(() => {
    recarregarCategorias();
    const handler = () => recarregarCategorias();
    window.addEventListener("organizai_categorias_sync", handler);
    return () => window.removeEventListener("organizai_categorias_sync", handler);
  }, [user?.id]);

  // Bancos registrados pelo usuário
  const [bancosCadastrados, setBancosCadastrados] = useState<string[]>(BANCOS_PADRAO);

  // Filtros (inicia em "todos" para exibir imediatamente qualquer lançamento no histórico)
  const [filtroPeriodo, setFiltroPeriodo] = useState<"mes" | "ano" | "todos">("todos");
  const [busca, setBusca] = useState("");

  // Form states para NOVO Recebimento
  const hojePt = new Date().toLocaleDateString("pt-BR");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(hojePt);
  const [categoria, setCategoria] = useState(categoriasAtivas[0] || "Salário");
  const [banco, setBanco] = useState("Selecionar");

  // Ajusta categoria padrão quando alternar tipo de conta
  useEffect(() => {
    if (!categoriasAtivas.includes(categoria)) {
      setCategoria(categoriasAtivas[0] || "Outros");
    }
  }, [tipoConta, categoriasAtivas]);


  // Modal de Edição
  const [itemEditando, setItemEditando] = useState<RecebimentoItem | null>(null);
  const [editDescricao, setEditDescricao] = useState("");
  const [editValor, setEditValor] = useState("");
  const [editData, setEditData] = useState("");
  const [editCategoria, setEditCategoria] = useState("");
  const [editBanco, setEditBanco] = useState("Selecionar");

  // Carregar recebimentos e bancos do Supabase
  useEffect(() => {
    if (!user?.id) return;

    let cancelado = false;

    const carregar = async () => {
      try {
        setCarregando(true);
        const [
          { data: recData, error: recError },
          { data: banData },
        ] = await Promise.all([
          supabase
            .from("recebimentos")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("bancos_contas")
            .select("banco")
            .eq("user_id", user.id),
        ]);

        if (!cancelado) {
          if (!recError && recData) {
            setRecebimentos(
              recData.map((r: any) => ({
                id: r.id,
                user_id: r.user_id,
                descricao: r.descricao,
                valor: Number(r.valor) || 0,
                data: r.data,
                categoria: r.categoria,
                banco: r.banco,
                tipoConta: (r.tipo_conta as "pessoal" | "empresa") || "pessoal",
                created_at: r.created_at,
              }))
            );
          }

          if (banData && banData.length > 0) {
            const bancosUnicos = Array.from(
              new Set(["Selecionar", ...banData.map((b: any) => b.banco), ...BANCOS_PADRAO.slice(1)])
            );
            setBancosCadastrados(bancosUnicos);
          }
        }
      } catch (err) {
        console.error("Erro ao buscar recebimentos:", err);
      } finally {
        if (!cancelado) setCarregando(false);
      }
    };

    carregar();

    const handler = () => carregar();
    window.addEventListener("organizai_finance_sync", handler);

    return () => {
      cancelado = true;
      window.removeEventListener("organizai_finance_sync", handler);
    };
  }, [user?.id]);

  // Filtra por tipo de conta ativo (Pessoal ou Empresa)
  const recebimentosPorConta = useMemo(() => {
    return recebimentos.filter((r) => (r.tipoConta || "pessoal") === tipoConta);
  }, [recebimentos, tipoConta]);

  // Filtra por período ("mes", "ano", "todos")
  const recebimentosFiltradosPorPeriodo = useMemo(() => {
    return recebimentosPorConta.filter((r) =>
      dataCorrespondeAoPeriodo(r.data, filtroPeriodo)
    );
  }, [recebimentosPorConta, filtroPeriodo]);

  // Lista final visível (com campo de busca)
  const listaVisivel = useMemo(() => {
    if (!busca.trim()) return recebimentosFiltradosPorPeriodo;
    const termo = busca.toLowerCase();
    return recebimentosFiltradosPorPeriodo.filter((r) => {
      return (
        r.descricao.toLowerCase().includes(termo) ||
        r.categoria.toLowerCase().includes(termo) ||
        (r.banco && r.banco.toLowerCase().includes(termo))
      );
    });
  }, [recebimentosFiltradosPorPeriodo, busca]);

  // Cálculos dos Top KPI Cards
  const totalRecebido = useMemo(() => {
    return recebimentosFiltradosPorPeriodo.reduce((acc, curr) => acc + curr.valor, 0);
  }, [recebimentosFiltradosPorPeriodo]);

  const registros = recebimentosFiltradosPorPeriodo.length;

  const maiorRecebimento = useMemo(() => {
    return recebimentosFiltradosPorPeriodo.length > 0
      ? Math.max(...recebimentosFiltradosPorPeriodo.map((r) => r.valor))
      : 0;
  }, [recebimentosFiltradosPorPeriodo]);

  const ticketMedio = registros > 0 ? totalRecebido / registros : 0;

  // Registrar novo recebimento
  const handleSalvarRecebimento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim()) {
      toast.error("Informe a descrição do recebimento.");
      return;
    }

    const parsedValor = parseFloat(valor.replace(/\./g, "").replace(",", ".")) || 0;
    if (parsedValor <= 0) {
      toast.error("Informe um valor válido maior que zero.");
      return;
    }

    const dataFormatadaISO = parseDataParaISO(data.trim() || hojePt);
    const novoTemp: RecebimentoItem = {
      id: "temp-" + Date.now(),
      user_id: user?.id,
      descricao: descricao.trim(),
      valor: parsedValor,
      data: dataFormatadaISO,
      categoria,
      banco: banco !== "Selecionar" ? banco : undefined,
      tipoConta,
    };

    // Atualização otimista
    setRecebimentos((prev) => [novoTemp, ...prev]);
    setDescricao("");
    setValor("");

    try {
      if (user?.id) {
        const { data: inserted, error } = await supabase
          .from("recebimentos")
          .insert({
            user_id: user.id,
            descricao: novoTemp.descricao,
            valor: novoTemp.valor,
            data: novoTemp.data,
            categoria: novoTemp.categoria,
            banco: novoTemp.banco,
            tipo_conta: tipoConta,
          })
          .select()
          .single();

        if (!error && inserted) {
          setRecebimentos((prev) =>
            prev.map((item) =>
              item.id === novoTemp.id
                ? {
                    id: inserted.id,
                    user_id: inserted.user_id,
                    descricao: inserted.descricao,
                    valor: Number(inserted.valor) || 0,
                    data: inserted.data,
                    categoria: inserted.categoria,
                    banco: inserted.banco,
                    tipoConta: (inserted.tipo_conta as "pessoal" | "empresa") || "pessoal",
                    created_at: inserted.created_at,
                  }
                : item
            )
          );
        } else if (error) {
          console.error("Erro Supabase:", error);
        }
      }
      notificarAtualizacaoFinanceira();
      toast.success("Recebimento registrado com sucesso!");
    } catch {
      toast.error("Erro ao registrar recebimento no banco.");
    }
  };

  // Abrir modal de edição
  const abrirEdicao = (item: RecebimentoItem) => {
    setItemEditando(item);
    setEditDescricao(item.descricao);
    setEditValor(item.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 }));
    setEditData(formatarDataExibicao(item.data));
    setEditCategoria(item.categoria);
    setEditBanco(item.banco || "Selecionar");
  };

  // Salvar alterações da edição
  const handleSalvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemEditando) return;

    if (!editDescricao.trim()) {
      toast.error("Informe a descrição.");
      return;
    }

    const parsedValor = parseFloat(editValor.replace(/\./g, "").replace(",", ".")) || 0;
    if (parsedValor <= 0) {
      toast.error("Informe um valor válido maior que zero.");
      return;
    }

    const dataFormatadaISO = parseDataParaISO(editData.trim() || hojePt);
    const atualizado: RecebimentoItem = {
      ...itemEditando,
      descricao: editDescricao.trim(),
      valor: parsedValor,
      data: dataFormatadaISO,
      categoria: editCategoria,
      banco: editBanco !== "Selecionar" ? editBanco : undefined,
    };

    setRecebimentos((prev) =>
      prev.map((item) => (item.id === atualizado.id ? atualizado : item))
    );
    setItemEditando(null);

    try {
      if (user?.id && !atualizado.id.startsWith("temp-")) {
        await supabase
          .from("recebimentos")
          .update({
            descricao: atualizado.descricao,
            valor: atualizado.valor,
            data: atualizado.data,
            categoria: atualizado.categoria,
            banco: atualizado.banco,
          })
          .eq("id", atualizado.id)
          .eq("user_id", user.id);
      }
      notificarAtualizacaoFinanceira();
      toast.success("Recebimento atualizado com sucesso!");
    } catch {
      toast.error("Erro ao salvar alterações no banco.");
    }
  };

  // Excluir recebimento
  const removerRecebimento = async (id: string) => {
    setRecebimentos((prev) => prev.filter((r) => r.id !== id));
    try {
      if (user?.id && !id.startsWith("temp-")) {
        await supabase.from("recebimentos").delete().eq("id", id).eq("user_id", user.id);
      }
      notificarAtualizacaoFinanceira();
      toast.info("Recebimento removido.");
    } catch {
      toast.error("Erro ao excluir do banco.");
    }
  };


  return (
    <AppShell>
      {/* Modal de Edição de Entrada */}
      {itemEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#161616] p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-[#34d399]">
                  <Pencil className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">Editar Entrada</h3>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Atualize os detalhes deste recebimento
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setItemEditando(null)}
                className="rounded-lg p-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSalvarEdicao} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-medium text-stone-300 mb-1 block">Descrição</label>
                <input
                  type="text"
                  value={editDescricao}
                  onChange={(e) => setEditDescricao(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500/60 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1 block">Valor (R$)</label>
                  <input
                    type="text"
                    value={editValor}
                    onChange={(e) => setEditValor(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500/60 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1 block">Data (DD/MM/AAAA)</label>
                  <input
                    type="text"
                    value={editData}
                    onChange={(e) => setEditData(e.target.value)}
                    placeholder="DD/MM/AAAA"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500/60 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1 block">Categoria</label>
                  <select
                    value={editCategoria}
                    onChange={(e) => setEditCategoria(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3 py-2.5 text-xs text-white outline-none cursor-pointer"
                  >
                    {categoriasAtivas.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#1e1e1e]">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1 block">Banco / Conta</label>
                  <select
                    value={editBanco}
                    onChange={(e) => setEditBanco(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3 py-2.5 text-xs text-white outline-none cursor-pointer"
                  >
                    {bancosCadastrados.map((b) => (
                      <option key={b} value={b} className="bg-[#1e1e1e]">
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setItemEditando(null)}
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
              src="/icons/kpi/recebimentos@2x.png"
              alt="Entradas"
              className="h-full w-full object-cover select-none pointer-events-none"
            />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white leading-tight">
              Entradas
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Recebimentos —{" "}
              <span className="font-semibold text-stone-200">
                {tipoConta === "pessoal" ? "Pessoal" : "Empresa / PJ"}
              </span>
              .
            </p>
          </div>
        </div>
      </div>

      {/* 2. Top 4 Cards de Resumo Reativos ao Modo Ativo */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4 mt-6">
        {/* TOTAL RECEBIDO */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
              <span className="h-2 w-2 rounded-full bg-[#34d399] shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              TOTAL RECEBIDO ({tipoConta.toUpperCase()})
            </div>
            <div className="h-6 w-6 rounded-lg overflow-hidden bg-emerald-500/10 flex items-center justify-center p-0.5">
              <img
                src="/icons/kpi/recebimentos@2x.png"
                alt=""
                className="h-full w-full object-contain"
              />
            </div>
          </div>
          <span className="font-display text-2xl font-bold text-[#34d399] mt-3 block leading-none">
            {brl(totalRecebido)}
          </span>
        </div>

        {/* REGISTROS */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
            <span className="h-2 w-2 rounded-full bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            REGISTROS ({tipoConta.toUpperCase()})
          </div>
          <span className="font-display text-2xl font-bold text-[#3b82f6] mt-3 block leading-none">
            {registros}
          </span>
        </div>

        {/* MAIOR RECEBIMENTO */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
              <span className="h-2 w-2 rounded-full bg-[#c084fc] shadow-[0_0_8px_rgba(192,132,252,0.6)]" />
              MAIOR RECEBIMENTO
            </div>
            <div className="h-6 w-6 rounded-lg overflow-hidden bg-purple-500/10 flex items-center justify-center p-0.5">
              <img
                src="/cofrinho-icon.png"
                alt=""
                className="h-full w-full object-contain"
              />
            </div>
          </div>
          <span className="font-display text-2xl font-bold text-[#c084fc] mt-3 block leading-none">
            {brl(maiorRecebimento)}
          </span>
        </div>

        {/* TICKET MÉDIO */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
            <span className="h-2 w-2 rounded-full bg-[#F97316] shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
            TICKET MÉDIO
          </div>
          <span className="font-display text-2xl font-bold text-white mt-3 block leading-none">
            {brl(ticketMedio)}
          </span>
        </div>
      </div>

      {/* 3. Barra de Controles: Filtros de Período + Busca em Tempo Real */}
      <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Pills de Período */}
        <div className="inline-flex items-center gap-1 rounded-full bg-[#151515] p-1 border border-white/[0.06] self-start">
          <button
            type="button"
            onClick={() => setFiltroPeriodo("todos")}
            className={cn(
              "rounded-full px-3.5 py-1 text-xs font-bold transition-all cursor-pointer",
              filtroPeriodo === "todos"
                ? "bg-[#F97316] text-white shadow-sm shadow-orange-950/40"
                : "text-stone-400 hover:text-white"
            )}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => setFiltroPeriodo("mes")}
            className={cn(
              "rounded-full px-3.5 py-1 text-xs font-bold transition-all cursor-pointer",
              filtroPeriodo === "mes"
                ? "bg-[#F97316] text-white shadow-sm shadow-orange-950/40"
                : "text-stone-400 hover:text-white"
            )}
          >
            Este mês
          </button>
          <button
            type="button"
            onClick={() => setFiltroPeriodo("ano")}
            className={cn(
              "rounded-full px-3.5 py-1 text-xs font-bold transition-all cursor-pointer",
              filtroPeriodo === "ano"
                ? "bg-[#F97316] text-white shadow-sm shadow-orange-950/40"
                : "text-stone-400 hover:text-white"
            )}
          >
            Este ano
          </button>
        </div>

        {/* Campo de Busca Rápida */}
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-500" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar recebimentos..."
            className="w-full rounded-full border border-white/[0.08] bg-[#151515] py-1.5 pl-8 pr-8 text-xs text-white placeholder:text-stone-500 outline-none focus:border-orange-500/60 transition-colors"
          />
          {busca && (
            <button
              type="button"
              onClick={() => setBusca("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* 4. Grid Principal em 2 Colunas: Formulário na Esquerda e Histórico na Direita */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[380px_minmax(0,1fr)] mt-4 items-start">
        {/* Coluna da Esquerda: NOVO RECEBIMENTO */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm">
          {/* Feixe de luz suave superior */}
          <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-3/4 rounded-full bg-amber-500/10 blur-xl" />

          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold tracking-wider text-stone-400 uppercase block">
              NOVO RECEBIMENTO ({tipoConta === "pessoal" ? "PESSOAL" : "EMPRESA"})
            </span>
            <span className="text-[10px] font-medium text-orange-400/90 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
              {tipoConta === "pessoal" ? "PF" : "PJ"}
            </span>
          </div>

          <form onSubmit={handleSalvarRecebimento} className="space-y-3.5">
            {/* Descrição */}
            <div>
              <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                Descrição
              </label>
              <input
                type="text"
                placeholder={tipoConta === "pessoal" ? "Ex.: Salário mensal, Venda..." : "Ex.: Prestação de serviços, Faturamento..."}
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

            {/* Data */}
            <div>
              <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                Data (DD/MM/AAAA)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  placeholder="DD/MM/AAAA"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 pr-8 text-xs text-white placeholder:text-stone-500 outline-none focus:border-orange-500/60 transition-colors"
                />
                <Calendar className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
              </div>
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Categoria
              </label>
              <div className="relative">
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 pr-8 text-xs text-white outline-none cursor-pointer"
                >
                  {categoriasAtivas.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#1e1e1e]">
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
              </div>
            </div>

            {/* Banco / Conta Bancária */}
            <div>
              <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                Banco / Conta (opcional)
              </label>
              <div className="relative">
                <select
                  value={banco}
                  onChange={(e) => setBanco(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 pr-8 text-xs text-white outline-none cursor-pointer"
                >
                  {bancosCadastrados.map((b) => (
                    <option key={b} value={b} className="bg-[#1e1e1e]">
                      {b}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
              </div>
            </div>

            {/* Botão Registrar recebimento */}
            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:brightness-110 py-3 text-xs font-bold text-white shadow-lg shadow-orange-950/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-2"
            >
              <Plus className="h-4 w-4" /> Registrar recebimento
            </button>
          </form>
        </div>

        {/* Coluna da Direita: Histórico */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm min-h-[440px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-white">Histórico</h3>
                <span className="text-[10px] text-stone-400 font-normal">
                  ({tipoConta === "pessoal" ? "Pessoal" : "Empresa"})
                </span>
              </div>
              <span className="rounded-full bg-white/[0.06] border border-white/10 px-2.5 py-0.5 text-[11px] text-stone-400 font-medium">
                {listaVisivel.length} {listaVisivel.length === 1 ? "entrada" : "entradas"}
              </span>
            </div>

            {/* Lista se houver itens */}
            {listaVisivel.length > 0 && (
              <div className="divide-y divide-white/[0.06] mt-2">
                {listaVisivel.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between py-3.5 hover:bg-white/[0.02] px-2 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-[#34d399] flex items-center justify-center font-bold text-xs shrink-0">
                        {r.categoria.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white leading-tight truncate max-w-[200px] sm:max-w-xs">
                          {r.descricao}
                        </p>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          {r.categoria} {r.banco ? `• ${r.banco}` : ""} • {formatarDataExibicao(r.data)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="font-display text-xs font-bold text-[#34d399]">
                        +{brl(r.valor)}
                      </span>
                      <button
                        type="button"
                        onClick={() => abrirEdicao(r)}
                        className="text-stone-500 hover:text-white transition-colors p-1 cursor-pointer rounded-lg hover:bg-white/[0.05]"
                        title="Editar entrada"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removerRecebimento(r.id)}
                        className="text-stone-500 hover:text-red-400 transition-colors p-1 cursor-pointer rounded-lg hover:bg-white/[0.05]"
                        title="Excluir entrada"
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
          {listaVisivel.length === 0 && (
            <div className="my-auto py-12 flex flex-col items-center justify-center text-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden shadow-xl shadow-black/80 border border-white/[0.08] bg-[#1a1a1a]">
                <img
                  src="/empty-search-icon@2x.png"
                  alt="Sem recebimentos no período"
                  className="h-full w-full object-cover select-none pointer-events-none"
                />
              </div>
              <h4 className="mt-4 text-sm font-bold text-white">
                {busca
                  ? "Nenhum resultado para a busca"
                  : `Sem recebimentos no período (${tipoConta === "pessoal" ? "Pessoal" : "Empresa"})`}
              </h4>
              <p className="mt-1.5 text-xs text-stone-400 max-w-sm text-center leading-relaxed">
                {busca
                  ? "Tente buscar por outro termo ou limpe o filtro de busca."
                  : "Registre uma entrada ao lado ou troque o período acima."}
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
