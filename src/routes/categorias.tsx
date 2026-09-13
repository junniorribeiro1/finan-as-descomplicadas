import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
  Edit2,
  Trash2,
  X,
  Briefcase,
  Laptop,
  TrendingUp,
  Building,
  ShoppingBag,
  Tag,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/categorias")({
  head: () => ({
    meta: [
      { title: "Categorias — OrganizAI" },
      {
        name: "description",
        content: "Categorias do escopo Pessoal. Alterne no topo para o outro.",
      },
    ],
  }),
  component: Categorias,
});

interface CategoriaItem {
  id: string;
  nome: string;
  tipo: "despesa" | "receita";
  icone: string;
  corFundo: string;
  corTexto: string;
  uso: string;
}

const categoriasIniciaisDespesas: CategoriaItem[] = [
  {
    id: "moradia",
    nome: "Moradia",
    tipo: "despesa",
    icone: "Home",
    corFundo: "bg-amber-500/10",
    corTexto: "text-amber-500",
    uso: "Sem uso",
  },
  {
    id: "transporte",
    nome: "Transporte",
    tipo: "despesa",
    icone: "Car",
    corFundo: "bg-blue-500/10",
    corTexto: "text-blue-400",
    uso: "Sem uso",
  },
  {
    id: "alimentacao",
    nome: "Alimentação",
    tipo: "despesa",
    icone: "Utensils",
    corFundo: "bg-amber-700/20",
    corTexto: "text-amber-500",
    uso: "Sem uso",
  },
  {
    id: "saude",
    nome: "Saúde",
    tipo: "despesa",
    icone: "HeartPulse",
    corFundo: "bg-red-500/10",
    corTexto: "text-red-400",
    uso: "Sem uso",
  },
  {
    id: "educacao",
    nome: "Educação",
    tipo: "despesa",
    icone: "GraduationCap",
    corFundo: "bg-purple-500/10",
    corTexto: "text-purple-400",
    uso: "Sem uso",
  },
  {
    id: "lazer",
    nome: "Lazer",
    tipo: "despesa",
    icone: "Gamepad2",
    corFundo: "bg-indigo-500/10",
    corTexto: "text-indigo-400",
    uso: "Sem uso",
  },
  {
    id: "servicos",
    nome: "Serviços",
    tipo: "despesa",
    icone: "Wrench",
    corFundo: "bg-sky-500/10",
    corTexto: "text-sky-400",
    uso: "Sem uso",
  },
  {
    id: "assinaturas",
    nome: "Assinaturas",
    tipo: "despesa",
    icone: "Sparkles",
    corFundo: "bg-orange-500/10",
    corTexto: "text-orange-400",
    uso: "Sem uso",
  },
];

const categoriasIniciaisReceitas: CategoriaItem[] = [
  {
    id: "salario",
    nome: "Salário",
    tipo: "receita",
    icone: "Briefcase",
    corFundo: "bg-emerald-500/10",
    corTexto: "text-emerald-400",
    uso: "Sem uso",
  },
  {
    id: "freelance",
    nome: "Freelance",
    tipo: "receita",
    icone: "Laptop",
    corFundo: "bg-blue-500/10",
    corTexto: "text-blue-400",
    uso: "Sem uso",
  },
  {
    id: "investimentos",
    nome: "Investimentos",
    tipo: "receita",
    icone: "TrendingUp",
    corFundo: "bg-purple-500/10",
    corTexto: "text-purple-400",
    uso: "Sem uso",
  },
  {
    id: "prolabore",
    nome: "Pró-labore",
    tipo: "receita",
    icone: "Building",
    corFundo: "bg-amber-500/10",
    corTexto: "text-amber-400",
    uso: "Sem uso",
  },
  {
    id: "vendas",
    nome: "Vendas",
    tipo: "receita",
    icone: "ShoppingBag",
    corFundo: "bg-orange-500/10",
    corTexto: "text-orange-400",
    uso: "Sem uso",
  },
  {
    id: "outros-rec",
    nome: "Outros",
    tipo: "receita",
    icone: "Tag",
    corFundo: "bg-stone-500/10",
    corTexto: "text-stone-400",
    uso: "Sem uso",
  },
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
    default:
      return <Tag className={className} />;
  }
}

function Categorias() {
  const [tipoAtivo, setTipoAtivo] = useState<"despesa" | "receita">("despesa");
  const [despesas, setDespesas] = useState<CategoriaItem[]>(categoriasIniciaisDespesas);
  const [receitas, setReceitas] = useState<CategoriaItem[]>(categoriasIniciaisReceitas);

  // Modal states
  const [modalAberto, setModalAberto] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState<CategoriaItem | null>(null);
  const [nomeForm, setNomeForm] = useState("");
  const [iconeForm, setIconeForm] = useState("Tag");

  const listaAtual = tipoAtivo === "despesa" ? despesas : receitas;

  const handleSalvarCategoria = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeForm.trim()) return;

    if (categoriaEditando) {
      // Edit existing
      const atualizar = (prev: CategoriaItem[]) =>
        prev.map((c) =>
          c.id === categoriaEditando.id
            ? { ...c, nome: nomeForm.trim(), icone: iconeForm }
            : c
        );
      if (categoriaEditando.tipo === "despesa") {
        setDespesas(atualizar);
      } else {
        setReceitas(atualizar);
      }
    } else {
      // Create new
      const nova: CategoriaItem = {
        id: Date.now().toString(),
        nome: nomeForm.trim(),
        tipo: tipoAtivo,
        icone: iconeForm,
        corFundo: "bg-orange-500/10",
        corTexto: "text-[#F97316]",
        uso: "Sem uso",
      };
      if (tipoAtivo === "despesa") {
        setDespesas((prev) => [...prev, nova]);
      } else {
        setReceitas((prev) => [...prev, nova]);
      }
    }

    setNomeForm("");
    setCategoriaEditando(null);
    setModalAberto(false);
  };

  const abrirModalEditar = (cat: CategoriaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setCategoriaEditando(cat);
    setNomeForm(cat.nome);
    setIconeForm(cat.icone);
    setModalAberto(true);
  };

  const removerCategoria = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tipoAtivo === "despesa") {
      setDespesas((prev) => prev.filter((c) => c.id !== id));
    } else {
      setReceitas((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <AppShell>
      {/* 1. Cabeçalho da Página: Ícone 3D Prisma + Título/Subtítulo + Botão + Nova */}
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
              Categorias do escopo Pessoal. Alterne no topo para o outro.
            </p>
          </div>
        </div>

        {/* Botão + Nova */}
        <button
          type="button"
          onClick={() => {
            setCategoriaEditando(null);
            setNomeForm("");
            setIconeForm("Tag");
            setModalAberto(true);
          }}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:brightness-110 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-orange-950/50 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          Nova
        </button>
      </div>

      {/* 2. Toggle Despesas / Receitas */}
      <div className="mt-5">
        <div className="inline-flex items-center gap-1 rounded-full bg-[#151515] p-1 border border-white/[0.06]">
          <button
            type="button"
            onClick={() => setTipoAtivo("despesa")}
            className={cn(
              "rounded-full px-3.5 py-1 text-xs font-bold transition-all cursor-pointer",
              tipoAtivo === "despesa"
                ? "text-[#F97316] bg-orange-500/10 shadow-sm"
                : "text-stone-400 hover:text-white"
            )}
          >
            Despesas
          </button>
          <button
            type="button"
            onClick={() => setTipoAtivo("receita")}
            className={cn(
              "rounded-full px-3.5 py-1 text-xs font-bold transition-all cursor-pointer",
              tipoAtivo === "receita"
                ? "text-[#F97316] bg-orange-500/10 shadow-sm"
                : "text-stone-400 hover:text-white"
            )}
          >
            Receitas
          </button>
        </div>
      </div>

      {/* 3. Grid de Categorias (4 colunas) */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
        {listaAtual.map((cat) => (
          <div
            key={cat.id}
            className="group relative rounded-2xl border border-white/[0.06] bg-[#151515] p-4.5 min-h-[105px] flex flex-col justify-between hover:border-amber-500/50 hover:bg-[#181818] transition-all cursor-pointer shadow-sm"
          >
            {/* Top row: Ícone à esquerda e botões de ação à direita (on hover) */}
            <div className="flex items-start justify-between">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center",
                  cat.corFundo,
                  cat.corTexto
                )}
              >
                {renderIcon(cat.icone, "h-4 w-4")}
              </div>

              {/* Ações de Hover (Editar e Excluir) */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => abrirModalEditar(cat, e)}
                  className="h-6 w-6 rounded-full bg-white/[0.08] hover:bg-white/15 text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
                  title="Editar categoria"
                >
                  <Edit2 className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={(e) => removerCategoria(cat.id, e)}
                  className="h-6 w-6 rounded-full bg-white/[0.08] hover:bg-red-500/20 text-stone-300 hover:text-red-400 flex items-center justify-center transition-colors cursor-pointer"
                  title="Excluir categoria"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Bottom text: Nome e Subtítulo */}
            <div className="mt-3">
              <span className="text-sm font-bold text-white block leading-tight">
                {cat.nome}
              </span>
              <span className="text-[11px] text-stone-500 block mt-0.5">
                {cat.uso}
              </span>
            </div>
          </div>
        ))}

        {/* Card: Nova categoria (Tracejado) */}
        <div
          onClick={() => {
            setCategoriaEditando(null);
            setNomeForm("");
            setIconeForm("Tag");
            setModalAberto(true);
          }}
          className="group rounded-2xl border border-dashed border-white/[0.08] hover:border-orange-500/40 bg-transparent hover:bg-white/[0.01] p-4.5 min-h-[105px] flex flex-col items-center justify-center text-center cursor-pointer transition-all"
        >
          <div className="h-7 w-7 rounded-full bg-orange-500/10 text-[#F97316] group-hover:scale-110 flex items-center justify-center transition-transform">
            <Plus className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-medium text-stone-400 group-hover:text-stone-200 mt-1.5 transition-colors">
            Nova categoria
          </span>
        </div>
      </div>

      {/* Modal: Nova / Editar Categoria */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#151515] p-6 shadow-2xl">
            {/* Feixe de luz suave superior */}
            <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-3/4 rounded-full bg-amber-500/15 blur-xl" />

            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <h3 className="text-sm font-bold text-white">
                {categoriaEditando ? "Editar categoria" : "Nova categoria"}
              </h3>
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="rounded-lg p-1.5 text-stone-400 hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSalvarCategoria} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                  Nome da categoria
                </label>
                <input
                  type="text"
                  placeholder="Ex.: Moradia, Alimentação..."
                  value={nomeForm}
                  onChange={(e) => setNomeForm(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white placeholder:text-stone-500 outline-none focus:border-orange-500/60 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                  Escolha um ícone
                </label>
                <div className="grid grid-cols-6 gap-2 pt-1">
                  {[
                    "Home",
                    "Car",
                    "Utensils",
                    "HeartPulse",
                    "GraduationCap",
                    "Gamepad2",
                    "Wrench",
                    "Sparkles",
                    "Briefcase",
                    "Laptop",
                    "TrendingUp",
                    "Tag",
                  ].map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setIconeForm(ic)}
                      className={cn(
                        "h-10 rounded-xl border flex items-center justify-center transition-colors cursor-pointer",
                        iconeForm === ic
                          ? "border-[#F97316] bg-orange-500/15 text-[#F97316]"
                          : "border-white/10 bg-[#1e1e1e] text-stone-400 hover:text-white"
                      )}
                    >
                      {renderIcon(ic, "h-4 w-4")}
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
