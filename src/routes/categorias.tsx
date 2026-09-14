import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useCallback } from "react";
import { AppShell } from "@/components/app/AppShell";
import { cn } from "@/lib/utils";
import {
  Plus,
  Home,
  Car,
  Utensils,
  HeartPulse,
  GraduationCap,
  Gamepad2,
  Wrench,
  Sparkles,
  Briefcase,
  Laptop,
  TrendingUp,
  Building,
  ShoppingBag,
  Tag,
  CreditCard,
  Wallet,
  Check,
  Edit2,
  Trash2,
  X,
  Search,
  User,
  Building2,
  Layers,
  DollarSign,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import {
  carregarCategoriasUsuario,
  notificarAtualizacaoCategorias,
  type CategoriaItem,
} from "@/lib/financial-service";
import { toast } from "sonner";

export const Route = createFileRoute("/categorias")({
  head: () => ({
    meta: [
      { title: "Categorias — OrganizAI" },
      {
        name: "description",
        content: "Gerencie suas categorias financeiras · Pessoal e Empresa.",
      },
      { property: "og:title", content: "Categorias — OrganizAI" },
    ],
  }),
  component: Categorias,
});

const ICONES_DISPONIVEIS = [
  { nome: "Home", label: "Moradia / Casa" },
  { nome: "Car", label: "Transporte / Veículo" },
  { nome: "Utensils", label: "Alimentação / Refeição" },
  { nome: "HeartPulse", label: "Saúde / Farmácia" },
  { nome: "GraduationCap", label: "Educação / Cursos" },
  { nome: "Gamepad2", label: "Lazer / Jogos" },
  { nome: "Wrench", label: "Serviços / Manutenção" },
  { nome: "Sparkles", label: "Assinaturas / Extras" },
  { nome: "Briefcase", label: "Trabalho / Salário" },
  { nome: "Laptop", label: "Sistemas / Tech" },
  { nome: "TrendingUp", label: "Investimentos / Rendimentos" },
  { nome: "Building", label: "Empresas / Impostos" },
  { nome: "ShoppingBag", label: "Compras / Vendas" },
  { nome: "CreditCard", label: "Cartão / Finanças" },
  { nome: "Wallet", label: "Carteira / Dinheiro" },
  { nome: "DollarSign", label: "Receitas / Cifras" },
  { nome: "Layers", label: "Diversos / Geral" },
  { nome: "Tag", label: "Outros / Padrão" },
];

const CORES_PALETA = [
  { nome: "Laranja", bg: "bg-orange-500/10", text: "text-[#F97316]", border: "border-orange-500/30" },
  { nome: "Esmeralda", bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  { nome: "Azul", bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  { nome: "Roxo", bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
  { nome: "Âmbar", bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  { nome: "Vermelho", bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30" },
  { nome: "Índigo", bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/30" },
  { nome: "Ciano", bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" },
  { nome: "Rosa", bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/30" },
  { nome: "Cinza", bg: "bg-stone-500/10", text: "text-stone-400", border: "border-stone-500/30" },
];

function renderIcon(iconeNome: string, className?: string) {
  switch (iconeNome) {
    case "Home":
      return <Home className={className} />;
    case "Car":
      return <Car className={className} />;
    case "Utensils":
      return <Utensils className={className} />;
    case "HeartPulse":
      return <HeartPulse className={className} />;
    case "GraduationCap":
      return <GraduationCap className={className} />;
    case "Gamepad2":
      return <Gamepad2 className={className} />;
    case "Wrench":
      return <Wrench className={className} />;
    case "Sparkles":
      return <Sparkles className={className} />;
    case "Briefcase":
      return <Briefcase className={className} />;
    case "Laptop":
      return <Laptop className={className} />;
    case "TrendingUp":
      return <TrendingUp className={className} />;
    case "Building":
      return <Building className={className} />;
    case "ShoppingBag":
      return <ShoppingBag className={className} />;
    case "CreditCard":
      return <CreditCard className={className} />;
    case "Wallet":
      return <Wallet className={className} />;
    case "DollarSign":
      return <DollarSign className={className} />;
    case "Layers":
      return <Layers className={className} />;
    default:
      return <Tag className={className} />;
  }
}

function Categorias() {
  const { user } = useAuth();

  // Tipo de Conta: "pessoal" ou "empresa"
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

  // Tipo ativo: "despesa" ou "receita"
  const [tipoAtivo, setTipoAtivo] = useState<"despesa" | "receita">("despesa");
  const [carregando, setCarregando] = useState(true);

  // Lista de categorias carregadas
  const [categorias, setCategorias] = useState<CategoriaItem[]>([]);
  // Mapa de uso real calculado { [nomeNormalizado]: contagem }
  const [mapaUso, setMapaUso] = useState<Record<string, number>>({});

  // Filtros
  const [busca, setBusca] = useState("");

  // Modal states
  const [modalAberto, setModalAberto] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState<CategoriaItem | null>(null);
  const [nomeForm, setNomeForm] = useState("");
  const [tipoForm, setTipoForm] = useState<"despesa" | "receita">("despesa");
  const [iconeForm, setIconeForm] = useState("Tag");
  const [corSelecionada, setCorSelecionada] = useState(CORES_PALETA[0]);

  // Função para carregar categorias e contagem de uso real
  const carregarDados = useCallback(async () => {
    if (!user?.id) {
      setCarregando(false);
      return;
    }

    try {
      setCarregando(true);

      // 1. Carregar categorias do usuário + padrões
      const lista = await carregarCategoriasUsuario(user.id, tipoConta);
      setCategorias(lista);

      // 2. Carregar transações do usuário para contar o uso real das categorias
      const [fixosRes, varRes, compRes, recRes] = await Promise.all([
        supabase
          .from("gastos_fixos")
          .select("categoria")
          .eq("user_id", user.id)
          .eq("tipo_conta", tipoConta),
        supabase
          .from("gastos_variaveis")
          .select("categoria")
          .eq("user_id", user.id)
          .eq("tipo_conta", tipoConta),
        supabase
          .from("compras_cartao")
          .select("categoria")
          .eq("user_id", user.id)
          .eq("tipo_conta", tipoConta),
        supabase
          .from("recebimentos")
          .select("categoria")
          .eq("user_id", user.id)
          .eq("tipo_conta", tipoConta),
      ]);

      const contagem: Record<string, number> = {};

      const somar = (itens: { categoria?: string | null }[] | null) => {
        if (!itens) return;
        for (const item of itens) {
          if (item.categoria) {
            const key = item.categoria.trim().toLowerCase();
            contagem[key] = (contagem[key] || 0) + 1;
          }
        }
      };

      somar(fixosRes.data);
      somar(varRes.data);
      somar(compRes.data);
      somar(recRes.data);

      setMapaUso(contagem);
    } catch (err) {
      console.error("Erro ao carregar categorias e contagem:", err);
    } finally {
      setCarregando(false);
    }
  }, [user?.id, tipoConta]);

  useEffect(() => {
    carregarDados();

    const handler = () => carregarDados();
    window.addEventListener("organizai_categorias_sync", handler);
    window.addEventListener("organizai_finance_sync", handler);
    return () => {
      window.removeEventListener("organizai_categorias_sync", handler);
      window.removeEventListener("organizai_finance_sync", handler);
    };
  }, [carregarDados]);

  // Filtra por tipo ativo (despesa ou receita) e busca
  const listaFiltrada = useMemo(() => {
    return categorias.filter((c) => {
      if (c.tipo !== tipoAtivo) return false;
      if (busca.trim()) {
        const termo = busca.toLowerCase();
        return c.nome.toLowerCase().includes(termo);
      }
      return true;
    });
  }, [categorias, tipoAtivo, busca]);

  // Contagens para os botões de tipo
  const totalDespesas = useMemo(
    () => categorias.filter((c) => c.tipo === "despesa").length,
    [categorias]
  );
  const totalReceitas = useMemo(
    () => categorias.filter((c) => c.tipo === "receita").length,
    [categorias]
  );

  // Total de categorias em uso
  const categoriasEmUsoCount = useMemo(() => {
    return listaFiltrada.filter((c) => (mapaUso[c.nome.trim().toLowerCase()] || 0) > 0).length;
  }, [listaFiltrada, mapaUso]);

  // Categoria mais utilizada
  const categoriaMaisUtilizada = useMemo(() => {
    let maiorNome = "";
    let maiorQtd = 0;
    for (const c of listaFiltrada) {
      const qtd = mapaUso[c.nome.trim().toLowerCase()] || 0;
      if (qtd > maiorQtd) {
        maiorQtd = qtd;
        maiorNome = c.nome;
      }
    }
    return maiorQtd > 0 ? { nome: maiorNome, qtd: maiorQtd } : null;
  }, [listaFiltrada, mapaUso]);

  // Abrir Modal para Criar Nova Categoria
  const abrirCriacao = () => {
    setCategoriaEditando(null);
    setNomeForm("");
    setTipoForm(tipoAtivo);
    setIconeForm("Tag");
    setCorSelecionada(CORES_PALETA[0]);
    setModalAberto(true);
  };

  // Abrir Modal para Editar
  const abrirModalEditar = (cat: CategoriaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setCategoriaEditando(cat);
    setNomeForm(cat.nome);
    setTipoForm(cat.tipo);
    setIconeForm(cat.icone || "Tag");

    const corEncontrada =
      CORES_PALETA.find((cp) => cp.bg === cat.corFundo && cp.text === cat.corTexto) ||
      CORES_PALETA[0];
    setCorSelecionada(corEncontrada);

    setModalAberto(true);
  };

  // Salvar Criação ou Edição
  const handleSalvarCategoria = async (e: React.FormEvent) => {
    e.preventDefault();
    const nomeLimpo = nomeForm.trim();
    if (!nomeLimpo) {
      toast.error("Informe o nome da categoria.");
      return;
    }

    if (!user?.id) {
      toast.error("Usuário não autenticado.");
      return;
    }

    setModalAberto(false);

    try {
      if (categoriaEditando) {
        // Se for uma categoria padrão (inicia com 'def-'), inserimos como personalizada no Supabase
        const isDefault = categoriaEditando.id.startsWith("def-");

        if (isDefault) {
          const { data, error } = await supabase
            .from("categorias")
            .insert({
              user_id: user.id,
              nome: nomeLimpo,
              tipo: tipoForm,
              tipo_conta: tipoConta,
              icone: iconeForm,
              cor_fundo: corSelecionada.bg,
              cor_texto: corSelecionada.text,
            })
            .select()
            .single();

          if (error) {
            console.error("Erro ao salvar categoria personalizada:", error);
            toast.error("Erro ao salvar categoria.");
            return;
          }

          // Atualiza lista local
          setCategorias((prev) => [
            ...prev.filter((c) => c.id !== categoriaEditando.id),
            {
              id: data.id,
              user_id: data.user_id,
              nome: data.nome,
              tipo: data.tipo,
              tipoConta: data.tipo_conta,
              icone: data.icone,
              corFundo: data.cor_fundo,
              corTexto: data.cor_texto,
            },
          ]);
        } else {
          // Atualiza existente na tabela categorias
          const { error } = await supabase
            .from("categorias")
            .update({
              nome: nomeLimpo,
              tipo: tipoForm,
              icone: iconeForm,
              cor_fundo: corSelecionada.bg,
              cor_texto: corSelecionada.text,
            })
            .eq("id", categoriaEditando.id)
            .eq("user_id", user.id);

          if (error) {
            console.error("Erro ao atualizar categoria:", error);
            toast.error("Erro ao atualizar categoria.");
            return;
          }

          setCategorias((prev) =>
            prev.map((c) =>
              c.id === categoriaEditando.id
                ? {
                    ...c,
                    nome: nomeLimpo,
                    tipo: tipoForm,
                    icone: iconeForm,
                    corFundo: corSelecionada.bg,
                    corTexto: corSelecionada.text,
                  }
                : c
            )
          );
        }

        toast.success(`Categoria "${nomeLimpo}" atualizada com sucesso!`);
      } else {
        // Nova Categoria
        const { data, error } = await supabase
          .from("categorias")
          .insert({
            user_id: user.id,
            nome: nomeLimpo,
            tipo: tipoForm,
            tipo_conta: tipoConta,
            icone: iconeForm,
            cor_fundo: corSelecionada.bg,
            cor_texto: corSelecionada.text,
          })
          .select()
          .single();

        if (error) {
          console.error("Erro ao criar categoria:", error);
          toast.error("Erro ao criar categoria.");
          return;
        }

        const nova: CategoriaItem = {
          id: data.id,
          user_id: data.user_id,
          nome: data.nome,
          tipo: data.tipo,
          tipoConta: data.tipo_conta,
          icone: data.icone,
          corFundo: data.cor_fundo,
          corTexto: data.cor_texto,
        };

        setCategorias((prev) => [nova, ...prev]);
        toast.success(
          `Categoria "${nomeLimpo}" criada para ${tipoConta === "empresa" ? "Empresa" : "Pessoal"}!`
        );
      }

      // Notifica todos os dropdowns do app
      notificarAtualizacaoCategorias(tipoConta, tipoForm);
    } catch (err) {
      console.error("Erro geral ao salvar categoria:", err);
      toast.error("Erro ao salvar categoria.");
    }
  };

  // Excluir Categoria
  const removerCategoria = async (cat: CategoriaItem, e: React.MouseEvent) => {
    e.stopPropagation();

    // Se estiver em uso, avisa ao usuário
    const qtdUso = mapaUso[cat.nome.trim().toLowerCase()] || 0;
    if (qtdUso > 0) {
      const confirmou = window.confirm(
        `A categoria "${cat.nome}" possui ${qtdUso} ${
          qtdUso === 1 ? "registro vinculado" : "registros vinculados"
        }. Deseja realmente removê-la da lista de opções?`
      );
      if (!confirmou) return;
    }

    setCategorias((prev) => prev.filter((c) => c.id !== cat.id));

    try {
      if (user?.id && !cat.id.startsWith("def-")) {
        await supabase
          .from("categorias")
          .delete()
          .eq("id", cat.id)
          .eq("user_id", user.id);
      }
      notificarAtualizacaoCategorias(tipoConta, cat.tipo);
      toast.info(`Categoria "${cat.nome}" removida.`);
    } catch (err) {
      console.error("Erro ao excluir categoria:", err);
      toast.error("Erro ao remover categoria.");
    }
  };

  return (
    <AppShell>
      {/* 1. Cabeçalho da Página: Ícone 3D + Título + Toggle Pessoal/Empresa + Botão + Nova */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.5)] bg-[#1e1e1e] border border-white/10">
            <img
              src="/icons/kpi/categoria-header@2x.png"
              alt="Categorias"
              className="h-full w-full object-cover select-none pointer-events-none"
            />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white leading-tight">
              Categorias
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Organize suas finanças em{" "}
              <span className="font-semibold text-stone-200">
                {tipoConta === "pessoal" ? "Pessoal" : "Empresa / PJ"}
              </span>
              . Categorias sincronizadas com todo o sistema.
            </p>
          </div>
        </div>

        {/* Botão Nova Categoria */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={abrirCriacao}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:brightness-110 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-950/50 transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Nova categoria
          </button>
        </div>
      </div>

      {/* 2. Banner Resumo de Categorias e Mini KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm relative overflow-hidden flex items-center justify-between">
          <div className="pointer-events-none absolute -top-10 left-1/4 h-20 w-1/2 rounded-full bg-amber-500/10 blur-xl" />
          <div>
            <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase block">
              TOTAL DE CATEGORIAS
            </span>
            <span className="font-display text-2xl sm:text-3xl font-bold text-white mt-1 block">
              {listaFiltrada.length}
            </span>
            <span className="text-[11px] text-stone-400 mt-1 block">
              Em {tipoAtivo === "despesa" ? "Despesas" : "Receitas"} ({tipoConta})
            </span>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-orange-500/10 text-[#F97316] flex items-center justify-center border border-orange-500/20 shrink-0">
            <Layers className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm relative overflow-hidden flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase block">
              CATEGORIAS EM USO
            </span>
            <span className="font-display text-2xl sm:text-3xl font-bold text-emerald-400 mt-1 block">
              {categoriasEmUsoCount}
            </span>
            <span className="text-[11px] text-stone-400 mt-1 block">
              Com lançamentos ativos
            </span>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0">
            <Check className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm relative overflow-hidden flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase block">
              MAIS UTILIZADA
            </span>
            <span className="font-display text-lg sm:text-xl font-bold text-white mt-1 block truncate max-w-[180px]">
              {categoriaMaisUtilizada ? categoriaMaisUtilizada.nome : "Nenhuma"}
            </span>
            <span className="text-[11px] text-stone-400 mt-1 block">
              {categoriaMaisUtilizada
                ? `${categoriaMaisUtilizada.qtd} ${
                    categoriaMaisUtilizada.qtd === 1 ? "lançamento" : "lançamentos"
                  }`
                : "Aguardando registros"}
            </span>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 3. Barra de Controles: Toggle Despesas/Receitas + Campo de Busca */}
      <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Toggle Despesas / Receitas */}
        <div className="inline-flex items-center gap-1 rounded-full bg-[#151515] p-1 border border-white/[0.06] self-start">
          <button
            type="button"
            onClick={() => setTipoAtivo("despesa")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer",
              tipoAtivo === "despesa"
                ? "bg-[#F97316] text-white shadow-sm shadow-orange-950/40"
                : "text-stone-400 hover:text-white"
            )}
          >
            Despesas ({totalDespesas})
          </button>
          <button
            type="button"
            onClick={() => setTipoAtivo("receita")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer",
              tipoAtivo === "receita"
                ? "bg-[#F97316] text-white shadow-sm shadow-orange-950/40"
                : "text-stone-400 hover:text-white"
            )}
          >
            Receitas ({totalReceitas})
          </button>
        </div>

        {/* Busca em Tempo Real */}
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-500" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar categoria..."
            className="w-full rounded-full border border-white/[0.08] bg-[#151515] py-1.5 pl-8 pr-8 text-xs text-white placeholder:text-stone-500 outline-none focus:border-orange-500/60 transition-colors"
          />
          {busca && (
            <button
              type="button"
              onClick={() => setBusca("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* 4. Grid de Categorias */}
      {carregando ? (
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-16 flex flex-col items-center justify-center text-center mt-4">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-orange-500 border-t-transparent mb-3" />
          <p className="text-xs text-stone-400">Carregando categorias...</p>
        </div>
      ) : listaFiltrada.length === 0 && busca ? (
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-16 flex flex-col items-center justify-center text-center mt-4">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden shadow-xl shadow-black/80 border border-white/[0.08] bg-[#1a1a1a]">
            <img
              src="/empty-search-icon@2x.png"
              alt="Nenhuma categoria encontrada"
              className="h-full w-full object-cover select-none pointer-events-none"
            />
          </div>
          <h3 className="mt-4 text-sm font-bold text-white">Nenhuma categoria encontrada</h3>
          <p className="mt-1.5 text-xs text-stone-400 max-w-sm">
            Nenhuma categoria corresponde ao termo "{busca}". Tente buscar por outro termo ou limpe a busca.
          </p>
          <button
            type="button"
            onClick={() => setBusca("")}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] hover:bg-white/10 px-4 py-1.5 text-xs font-semibold text-stone-300 transition-colors cursor-pointer"
          >
            Limpar busca
          </button>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {listaFiltrada.map((cat) => {
            const qtdUso = mapaUso[cat.nome.trim().toLowerCase()] || 0;
            const textoUso = qtdUso === 0 ? "Sem uso" : qtdUso === 1 ? "1 uso" : `${qtdUso} usos`;

            return (
              <div
                key={cat.id}
                className="group relative rounded-2xl border border-white/[0.06] bg-[#151515] p-4.5 min-h-[110px] flex flex-col justify-between hover:border-orange-500/40 hover:bg-[#181818] transition-all shadow-sm"
              >
                {/* Top row: Ícone estilizado e Botões de Hover */}
                <div className="flex items-start justify-between">
                  <div
                    className={cn(
                      "h-9 w-9 rounded-xl flex items-center justify-center border border-white/5 shadow-inner transition-transform group-hover:scale-105",
                      cat.corFundo || "bg-orange-500/10",
                      cat.corTexto || "text-[#F97316]"
                    )}
                  >
                    {renderIcon(cat.icone || "Tag", "h-4.5 w-4.5")}
                  </div>

                  {/* Ações de Hover (Editar e Excluir) */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => abrirModalEditar(cat, e)}
                      className="h-7 w-7 rounded-lg bg-white/[0.08] hover:bg-white/15 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Editar categoria"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => removerCategoria(cat, e)}
                      className="h-7 w-7 rounded-lg bg-white/[0.08] hover:bg-red-500/20 text-stone-300 hover:text-red-400 flex items-center justify-center transition-colors cursor-pointer"
                      title="Excluir categoria"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Bottom text: Nome e Badge de Uso */}
                <div className="mt-3">
                  <span className="text-sm font-bold text-white block leading-tight truncate">
                    {cat.nome}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block",
                        qtdUso > 0
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-white/[0.04] text-stone-500 border border-white/[0.06]"
                      )}
                    >
                      {textoUso}
                    </span>
                    <span className="text-[10px] text-stone-500 uppercase font-medium">
                      {cat.tipo}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Card: Nova categoria (Tracejado) */}
          <div
            onClick={abrirCriacao}
            className="group rounded-2xl border border-dashed border-white/[0.08] hover:border-orange-500/40 bg-transparent hover:bg-white/[0.01] p-4.5 min-h-[110px] flex flex-col items-center justify-center text-center cursor-pointer transition-all"
          >
            <div className="h-8 w-8 rounded-full bg-orange-500/10 text-[#F97316] group-hover:scale-110 flex items-center justify-center transition-transform">
              <Plus className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-stone-400 group-hover:text-stone-200 mt-2 transition-colors">
              Nova categoria
            </span>
            <span className="text-[10px] text-stone-500 mt-0.5">
              {tipoAtivo === "despesa" ? "Adicionar despesa" : "Adicionar receita"}
            </span>
          </div>
        </div>
      )}

      {/* 5. Modal: Nova / Editar Categoria */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#151515] p-6 shadow-2xl">
            {/* Efeito Glow superior */}
            <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-3/4 rounded-full bg-amber-500/15 blur-xl" />

            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-[#F97316]">
                  <Tag className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {categoriaEditando ? "Editar categoria" : "Nova categoria"}
                  </h3>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Escopo:{" "}
                    <span className="font-semibold text-orange-400">
                      {tipoConta === "pessoal" ? "Pessoal" : "Empresa / PJ"}
                    </span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="rounded-lg p-1.5 text-stone-400 hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSalvarCategoria} className="space-y-4 mt-4">
              {/* Tipo da Categoria (Despesa / Receita) */}
              <div>
                <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                  Tipo de lançamento
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTipoForm("despesa")}
                    className={cn(
                      "py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center",
                      tipoForm === "despesa"
                        ? "bg-orange-500/15 border-[#F97316] text-white"
                        : "bg-[#1e1e1e] border-white/10 text-stone-400 hover:text-white"
                    )}
                  >
                    Despesa
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipoForm("receita")}
                    className={cn(
                      "py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center",
                      tipoForm === "receita"
                        ? "bg-emerald-500/15 border-emerald-500 text-emerald-300"
                        : "bg-[#1e1e1e] border-white/10 text-stone-400 hover:text-white"
                    )}
                  >
                    Receita
                  </button>
                </div>
              </div>

              {/* Nome da Categoria */}
              <div>
                <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                  Nome da categoria
                </label>
                <input
                  type="text"
                  placeholder="Ex.: Marketing, Aluguel, Farmácia..."
                  value={nomeForm}
                  onChange={(e) => setNomeForm(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white placeholder:text-stone-500 outline-none focus:border-orange-500/60 transition-colors"
                  required
                  autoFocus
                />
              </div>

              {/* Escolha do Ícone */}
              <div>
                <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                  Escolha um ícone
                </label>
                <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto pr-1 p-1">
                  {ICONES_DISPONIVEIS.map((ic) => (
                    <button
                      key={ic.nome}
                      type="button"
                      onClick={() => setIconeForm(ic.nome)}
                      title={ic.label}
                      className={cn(
                        "h-10 rounded-xl border flex items-center justify-center transition-colors cursor-pointer",
                        iconeForm === ic.nome
                          ? "border-[#F97316] bg-orange-500/15 text-[#F97316]"
                          : "border-white/10 bg-[#1e1e1e] text-stone-400 hover:text-white"
                      )}
                    >
                      {renderIcon(ic.nome, "h-4 w-4")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Escolha da Cor / Destaque */}
              <div>
                <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                  Cor de destaque
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {CORES_PALETA.map((cp) => (
                    <button
                      key={cp.nome}
                      type="button"
                      onClick={() => setCorSelecionada(cp)}
                      className={cn(
                        "h-8 rounded-xl border flex items-center justify-center gap-1.5 text-[11px] font-semibold transition-all cursor-pointer",
                        cp.bg,
                        cp.text,
                        corSelecionada.nome === cp.nome
                          ? "ring-2 ring-white ring-offset-2 ring-offset-[#151515] border-white/20"
                          : "border-white/10 opacity-70 hover:opacity-100"
                      )}
                    >
                      <div className={cn("h-2.5 w-2.5 rounded-full", cp.text.replace("text-", "bg-"))} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="rounded-xl border border-white/10 bg-transparent hover:bg-white/[0.05] px-4 py-2.5 text-xs font-semibold text-stone-300 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:brightness-110 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-950/50 transition-all cursor-pointer"
                >
                  {categoriaEditando ? "Salvar alterações" : "Criar categoria"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
