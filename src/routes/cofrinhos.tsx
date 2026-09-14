import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { AppShell } from "@/components/app/AppShell";
import { cn } from "@/lib/utils";
import { brl } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { notificarAtualizacaoFinanceira } from "@/lib/financial-service";
import { toast } from "sonner";
import {
  Plus,
  PiggyBank,
  X,
  Trash2,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  Pencil,
  Search,
  User,
  Building2,
  CheckCircle2,
  Target,
  Sparkles,
  Tag,
} from "lucide-react";

export const Route = createFileRoute("/cofrinhos")({
  head: () => ({
    meta: [
      { title: "Cofrinhos — OrganizAI" },
      {
        name: "description",
        content:
          "Poupe para objetivos específicos. Reserva de emergência, viagens, presentes e metas PJ.",
      },
      { property: "og:title", content: "Cofrinhos — OrganizAI" },
    ],
  }),
  component: Cofrinhos,
});

interface CofrinhoItemLocal {
  id: string;
  user_id?: string;
  nome: string;
  valorObjetivo: number;
  valorAtual: number;
  prazo?: string | undefined;
  categoria?: string | undefined;
  tipoConta: "pessoal" | "empresa";
  created_at?: string;
}

const CATEGORIAS_SUGERIDAS_PESSOAL = [
  "Reserva de Emergência",
  "Viagem / Férias",
  "Carro / Veículo",
  "Casa / Imóvel",
  "Sonhos / Lazer",
  "Educação",
  "Outros",
];

const CATEGORIAS_SUGERIDAS_EMPRESA = [
  "Capital de Giro",
  "Reserva Tributária",
  "Fundo 13º / Encargos",
  "Expansão / Filial",
  "Equipamentos / Maquinário",
  "Investimento em Marketing",
  "Outros",
];

function Cofrinhos() {
  const { user } = useAuth();
  const [cofrinhos, setCofrinhos] = useState<CofrinhoItemLocal[]>([]);
  const [carregando, setCarregando] = useState(false);

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

  // Modais
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [modalAporteId, setModalAporteId] = useState<string | null>(null);
  const [modalResgateId, setModalResgateId] = useState<string | null>(null);
  const [cofrinhoEditando, setCofrinhoEditando] = useState<CofrinhoItemLocal | null>(null);

  // Form states para NOVO cofrinho
  const [nome, setNome] = useState("");
  const [valorObjetivo, setValorObjetivo] = useState("");
  const [valorAtual, setValorAtual] = useState("");
  const [prazo, setPrazo] = useState("");
  const [categoria, setCategoria] = useState("Reserva de Emergência");

  // Ajusta categoria padrão ao alternar tipoConta
  useEffect(() => {
    const categorias = tipoConta === "pessoal" ? CATEGORIAS_SUGERIDAS_PESSOAL : CATEGORIAS_SUGERIDAS_EMPRESA;
    setCategoria(categorias[0] || "Outros");
  }, [tipoConta]);

  // Form states para Aporte / Resgate
  const [valorAporte, setValorAporte] = useState("");
  const [valorResgate, setValorResgate] = useState("");

  // Form states para Edição
  const [editNome, setEditNome] = useState("");
  const [editValorObjetivo, setEditValorObjetivo] = useState("");
  const [editPrazo, setEditPrazo] = useState("");
  const [editCategoria, setEditCategoria] = useState("");

  // Filtros da listagem
  const [filtroStatus, setFiltroStatus] = useState<"todos" | "andamento" | "concluidos">("todos");
  const [busca, setBusca] = useState("");

  // Carregar cofrinhos do Supabase
  useEffect(() => {
    if (!user?.id) return;

    let cancelado = false;

    const carregar = async () => {
      try {
        setCarregando(true);
        const { data, error } = await supabase
          .from("cofrinhos")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!cancelado && !error && data) {
          setCofrinhos(
            data.map((c: any) => ({
              id: c.id,
              user_id: c.user_id,
              nome: c.titulo,
              valorObjetivo: Number(c.meta_valor) || 0,
              valorAtual: Number(c.valor_atual) || 0,
              prazo: c.prazo || undefined,
              categoria: c.categoria || undefined,
              tipoConta: (c.tipo_conta as "pessoal" | "empresa") || "pessoal",
              created_at: c.created_at,
            }))
          );
        }
      } catch (err) {
        console.error("Erro ao carregar cofrinhos:", err);
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

  // Filtra estritamente por tipo de conta ativo (Pessoal ou Empresa)
  const cofrinhosPorConta = useMemo(() => {
    return cofrinhos.filter((c) => (c.tipoConta || "pessoal") === tipoConta);
  }, [cofrinhos, tipoConta]);

  // Aplica filtro de status e busca em tempo real
  const listaVisivel = useMemo(() => {
    return cofrinhosPorConta.filter((c) => {
      const pct = c.valorObjetivo > 0 ? (c.valorAtual / c.valorObjetivo) * 100 : 0;
      if (filtroStatus === "andamento" && pct >= 100) return false;
      if (filtroStatus === "concluidos" && pct < 100) return false;

      if (busca.trim()) {
        const termo = busca.toLowerCase();
        const noNome = c.nome.toLowerCase().includes(termo);
        const naCategoria = c.categoria?.toLowerCase().includes(termo) || false;
        const noPrazo = c.prazo?.toLowerCase().includes(termo) || false;
        return noNome || naCategoria || noPrazo;
      }
      return true;
    });
  }, [cofrinhosPorConta, filtroStatus, busca]);

  // Cálculos do Banner e KPIs
  const totalPoupado = useMemo(() => {
    return cofrinhosPorConta.reduce((acc, c) => acc + c.valorAtual, 0);
  }, [cofrinhosPorConta]);

  const totalObjetivos = useMemo(() => {
    return cofrinhosPorConta.reduce((acc, c) => acc + c.valorObjetivo, 0);
  }, [cofrinhosPorConta]);

  const percentualGeral =
    totalObjetivos > 0 ? Math.min(100, Math.round((totalPoupado / totalObjetivos) * 100)) : 0;

  const cofrinhoMaiorMeta = useMemo(() => {
    if (cofrinhosPorConta.length === 0) return null;
    return [...cofrinhosPorConta].sort((a, b) => b.valorObjetivo - a.valorObjetivo)[0];
  }, [cofrinhosPorConta]);

  const cofrinhoMaisProximo = useMemo(() => {
    if (cofrinhosPorConta.length === 0) return null;
    const calculados = cofrinhosPorConta
      .map((c) => ({
        ...c,
        pct: c.valorObjetivo > 0 ? (c.valorAtual / c.valorObjetivo) * 100 : 0,
      }))
      .sort((a, b) => b.pct - a.pct);
    return calculados[0];
  }, [cofrinhosPorConta]);

  // Criar Novo Cofrinho
  const handleCriarCofrinho = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      toast.error("Informe o nome do cofrinho.");
      return;
    }

    const parsedObjetivo = parseFloat(valorObjetivo.replace(/\./g, "").replace(",", ".")) || 0;
    const parsedAtual = parseFloat(valorAtual.replace(/\./g, "").replace(",", ".")) || 0;

    if (parsedObjetivo <= 0) {
      toast.error("A meta de valor deve ser maior que zero.");
      return;
    }

    const novoTemp: CofrinhoItemLocal = {
      id: "temp-" + Date.now(),
      user_id: user?.id,
      nome: nome.trim(),
      valorObjetivo: parsedObjetivo,
      valorAtual: parsedAtual,
      prazo: prazo.trim() || undefined,
      categoria: categoria || undefined,
      tipoConta,
    };

    setCofrinhos((prev) => [novoTemp, ...prev]);
    setNome("");
    setValorObjetivo("");
    setValorAtual("");
    setPrazo("");
    setModalNovoAberto(false);

    if (user?.id) {
      try {
        const { data, error } = await supabase
          .from("cofrinhos")
          .insert({
            user_id: user.id,
            titulo: novoTemp.nome,
            meta_valor: novoTemp.valorObjetivo,
            valor_atual: novoTemp.valorAtual,
            prazo: novoTemp.prazo || null,
            categoria: novoTemp.categoria || null,
            tipo_conta: tipoConta,
          })
          .select()
          .single();

        if (error) {
          console.error("Erro ao salvar cofrinho:", error);
          toast.error("Erro ao salvar no banco. Guardado localmente.");
        } else if (data) {
          setCofrinhos((prev) =>
            prev.map((c) =>
              c.id === novoTemp.id
                ? {
                    id: data.id,
                    user_id: data.user_id,
                    nome: data.titulo,
                    valorObjetivo: Number(data.meta_valor) || 0,
                    valorAtual: Number(data.valor_atual) || 0,
                    prazo: data.prazo || undefined,
                    categoria: data.categoria || undefined,
                    tipoConta: (data.tipo_conta as "pessoal" | "empresa") || "pessoal",
                    created_at: data.created_at,
                  }
                : c
            )
          );
          toast.success(`Cofrinho "${novoTemp.nome}" criado com sucesso!`);
        }
        notificarAtualizacaoFinanceira();
      } catch (err) {
        console.error("Erro ao criar cofrinho:", err);
      }
    }
  };

  // Guardar Dinheiro (Aporte)
  const handleAporte = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalAporteId) return;

    const quantia = parseFloat(valorAporte.replace(/\./g, "").replace(",", ".")) || 0;
    if (quantia <= 0) {
      toast.error("Informe um valor válido maior que zero.");
      return;
    }

    const cofreAlvo = cofrinhos.find((c) => c.id === modalAporteId);
    const novoValor = (cofreAlvo?.valorAtual || 0) + quantia;

    setCofrinhos((prev) =>
      prev.map((c) => (c.id === modalAporteId ? { ...c, valorAtual: novoValor } : c))
    );

    const idAtualizar = modalAporteId;
    setValorAporte("");
    setModalAporteId(null);

    if (user?.id && !idAtualizar.startsWith("temp-")) {
      try {
        await supabase
          .from("cofrinhos")
          .update({ valor_atual: novoValor })
          .eq("id", idAtualizar)
          .eq("user_id", user.id);

        toast.success(`Aporte de ${brl(quantia)} guardado com sucesso!`);
        notificarAtualizacaoFinanceira();
      } catch (err) {
        console.error("Erro ao atualizar aporte:", err);
      }
    }
  };

  // Resgatar Dinheiro (Retirada)
  const handleResgate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalResgateId) return;

    const quantia = parseFloat(valorResgate.replace(/\./g, "").replace(",", ".")) || 0;
    if (quantia <= 0) {
      toast.error("Informe um valor válido maior que zero.");
      return;
    }

    const cofreAlvo = cofrinhos.find((c) => c.id === modalResgateId);
    if (!cofreAlvo) return;

    if (quantia > cofreAlvo.valorAtual) {
      toast.error(`Valor excede o saldo disponível de ${brl(cofreAlvo.valorAtual)}.`);
      return;
    }

    const novoValor = Math.max(0, cofreAlvo.valorAtual - quantia);

    setCofrinhos((prev) =>
      prev.map((c) => (c.id === modalResgateId ? { ...c, valorAtual: novoValor } : c))
    );

    const idAtualizar = modalResgateId;
    setValorResgate("");
    setModalResgateId(null);

    if (user?.id && !idAtualizar.startsWith("temp-")) {
      try {
        await supabase
          .from("cofrinhos")
          .update({ valor_atual: novoValor })
          .eq("id", idAtualizar)
          .eq("user_id", user.id);

        toast.success(`Resgate de ${brl(quantia)} concluído!`);
        notificarAtualizacaoFinanceira();
      } catch (err) {
        console.error("Erro ao atualizar resgate:", err);
      }
    }
  };

  // Abrir Modal de Edição
  const abrirEdicao = (c: CofrinhoItemLocal) => {
    setCofrinhoEditando(c);
    setEditNome(c.nome);
    setEditValorObjetivo(c.valorObjetivo.toLocaleString("pt-BR", { minimumFractionDigits: 2 }));
    setEditPrazo(c.prazo || "");
    setEditCategoria(c.categoria || (tipoConta === "pessoal" ? "Reserva de Emergência" : "Capital de Giro"));
  };

  // Salvar Edição
  const handleSalvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cofrinhoEditando) return;

    if (!editNome.trim()) {
      toast.error("Informe o nome do cofrinho.");
      return;
    }

    const parsedObjetivo = parseFloat(editValorObjetivo.replace(/\./g, "").replace(",", ".")) || 0;
    if (parsedObjetivo <= 0) {
      toast.error("A meta deve ser maior que zero.");
      return;
    }

    const atualizado: CofrinhoItemLocal = {
      ...cofrinhoEditando,
      nome: editNome.trim(),
      valorObjetivo: parsedObjetivo,
      prazo: editPrazo.trim() || undefined,
      categoria: editCategoria || undefined,
    };

    setCofrinhos((prev) =>
      prev.map((c) => (c.id === cofrinhoEditando.id ? atualizado : c))
    );
    setCofrinhoEditando(null);

    if (user?.id && !cofrinhoEditando.id.startsWith("temp-")) {
      try {
        await supabase
          .from("cofrinhos")
          .update({
            titulo: atualizado.nome,
            meta_valor: atualizado.valorObjetivo,
            prazo: atualizado.prazo || null,
            categoria: atualizado.categoria || null,
          })
          .eq("id", cofrinhoEditando.id)
          .eq("user_id", user.id);

        toast.success("Cofrinho atualizado com sucesso!");
        notificarAtualizacaoFinanceira();
      } catch (err) {
        console.error("Erro ao atualizar cofrinho:", err);
      }
    }
  };

  // Excluir Cofrinho
  const removerCofrinho = async (id: string) => {
    setCofrinhos((prev) => prev.filter((c) => c.id !== id));

    if (user?.id && !id.startsWith("temp-")) {
      try {
        await supabase.from("cofrinhos").delete().eq("id", id).eq("user_id", user.id);
        toast.success("Cofrinho removido com sucesso!");
        notificarAtualizacaoFinanceira();
      } catch (err) {
        console.error("Erro ao remover cofrinho:", err);
      }
    }
  };

  const categoriasAtuais =
    tipoConta === "pessoal" ? CATEGORIAS_SUGERIDAS_PESSOAL : CATEGORIAS_SUGERIDAS_EMPRESA;

  return (
    <AppShell>
      {/* Modal: Novo Cofrinho */}
      {modalNovoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#151515] p-6 shadow-2xl">
            {/* Feixe de luz suave superior */}
            <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-3/4 rounded-full bg-amber-500/15 blur-xl" />

            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-[#F97316]">
                  <PiggyBank className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Criar novo cofrinho</h3>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Modalidade: <span className="text-orange-400 font-semibold">{tipoConta === "pessoal" ? "Pessoal" : "Empresa / PJ"}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalNovoAberto(false)}
                className="rounded-lg p-1.5 text-stone-400 hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCriarCofrinho} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                  Nome do cofrinho / Objetivo
                </label>
                <input
                  type="text"
                  placeholder={
                    tipoConta === "pessoal"
                      ? "Ex.: Reserva de Emergência, Viagem Europa..."
                      : "Ex.: Capital de Giro, Fundo de Expansão..."
                  }
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white placeholder:text-stone-500 outline-none focus:border-orange-500/60 transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                    Meta de valor (R$)
                  </label>
                  <div className="relative flex items-center rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs focus-within:border-orange-500/60 transition-colors">
                    <span className="text-stone-400 font-medium mr-1.5 select-none">R$</span>
                    <input
                      type="text"
                      placeholder="10.000,00"
                      value={valorObjetivo}
                      onChange={(e) => setValorObjetivo(e.target.value)}
                      className="w-full bg-transparent text-white font-medium outline-none placeholder:text-stone-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                    Valor inicial guardado
                  </label>
                  <div className="relative flex items-center rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs focus-within:border-orange-500/60 transition-colors">
                    <span className="text-stone-400 font-medium mr-1.5 select-none">R$</span>
                    <input
                      type="text"
                      placeholder="0,00"
                      value={valorAtual}
                      onChange={(e) => setValorAtual(e.target.value)}
                      className="w-full bg-transparent text-white font-medium outline-none placeholder:text-stone-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                    Categoria
                  </label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3 py-2.5 text-xs text-white outline-none cursor-pointer"
                  >
                    {categoriasAtuais.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#1e1e1e]">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                    Prazo previsto (opcional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ex.: Dezembro/2026"
                      value={prazo}
                      onChange={(e) => setPrazo(e.target.value)}
                      className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 pr-8 text-xs text-white placeholder:text-stone-500 outline-none focus:border-orange-500/60 transition-colors"
                    />
                    <Calendar className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setModalNovoAberto(false)}
                  className="rounded-xl border border-white/10 bg-transparent hover:bg-white/[0.05] px-4 py-2.5 text-xs font-semibold text-stone-300 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:brightness-110 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-950/50 transition-all cursor-pointer"
                >
                  Criar cofrinho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Guardar Dinheiro (Aporte) */}
      {modalAporteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#151515] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Guardar no cofrinho</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalAporteId(null)}
                className="rounded-lg p-1.5 text-stone-400 hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAporte} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                  Quanto você quer guardar hoje?
                </label>
                <div className="relative flex items-center rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs focus-within:border-orange-500/60 transition-colors">
                  <span className="text-stone-400 font-medium mr-1.5 select-none">R$</span>
                  <input
                    type="text"
                    placeholder="100,00"
                    value={valorAporte}
                    onChange={(e) => setValorAporte(e.target.value)}
                    className="w-full bg-transparent text-white font-medium outline-none placeholder:text-stone-500"
                    autoFocus
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setModalAporteId(null)}
                  className="rounded-xl border border-white/10 bg-transparent hover:bg-white/[0.05] px-4 py-2 text-xs font-semibold text-stone-300 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
                >
                  Confirmar aporte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Resgatar Dinheiro (Retirada) */}
      {modalResgateId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#151515] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
                  <ArrowDownLeft className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Resgatar do cofrinho</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalResgateId(null)}
                className="rounded-lg p-1.5 text-stone-400 hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleResgate} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                  Quanto deseja resgatar?
                </label>
                <div className="relative flex items-center rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs focus-within:border-orange-500/60 transition-colors">
                  <span className="text-stone-400 font-medium mr-1.5 select-none">R$</span>
                  <input
                    type="text"
                    placeholder="100,00"
                    value={valorResgate}
                    onChange={(e) => setValorResgate(e.target.value)}
                    className="w-full bg-transparent text-white font-medium outline-none placeholder:text-stone-500"
                    autoFocus
                    required
                  />
                </div>
                {modalResgateId && (
                  <p className="text-[11px] text-stone-400 mt-1.5">
                    Saldo disponível neste cofrinho:{" "}
                    <span className="text-white font-semibold">
                      {brl(cofrinhos.find((c) => c.id === modalResgateId)?.valorAtual || 0)}
                    </span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setModalResgateId(null)}
                  className="rounded-xl border border-white/10 bg-transparent hover:bg-white/[0.05] px-4 py-2 text-xs font-semibold text-stone-300 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:brightness-110 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-orange-950/50 transition-all cursor-pointer"
                >
                  Confirmar resgate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Editar Cofrinho */}
      {cofrinhoEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#151515] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
                  <Pencil className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Editar cofrinho</h3>
              </div>
              <button
                type="button"
                onClick={() => setCofrinhoEditando(null)}
                className="rounded-lg p-1.5 text-stone-400 hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSalvarEdicao} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                  Nome do cofrinho / Objetivo
                </label>
                <input
                  type="text"
                  value={editNome}
                  onChange={(e) => setEditNome(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500/60 transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                    Meta de valor (R$)
                  </label>
                  <input
                    type="text"
                    value={editValorObjetivo}
                    onChange={(e) => setEditValorObjetivo(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500/60 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                    Prazo previsto
                  </label>
                  <input
                    type="text"
                    value={editPrazo}
                    onChange={(e) => setEditPrazo(e.target.value)}
                    placeholder="Ex.: Dez/2026"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500/60 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                  Categoria
                </label>
                <select
                  value={editCategoria}
                  onChange={(e) => setEditCategoria(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3 py-2.5 text-xs text-white outline-none cursor-pointer"
                >
                  {categoriasAtuais.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#1e1e1e]">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setCofrinhoEditando(null)}
                  className="rounded-xl border border-white/10 bg-transparent hover:bg-white/[0.05] px-4 py-2 text-xs font-semibold text-stone-300 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:brightness-110 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-orange-950/50 transition-all cursor-pointer"
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
              src="/icons/kpi/cofrinho-header@2x.png"
              alt="Cofrinhos"
              className="h-full w-full object-cover select-none pointer-events-none"
            />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white leading-tight">
              Cofrinhos
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Metas de poupança —{" "}
              <span className="font-semibold text-stone-200">
                {tipoConta === "pessoal" ? "Pessoal" : "Empresa / PJ"}
              </span>
              .
            </p>
          </div>
        </div>

        {/* Controles do Cabeçalho: Toggle Pessoal/Empresa + Botão Novo Cofrinho */}
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          {/* Seletor Rápido Pessoal vs Empresa */}
          <div className="flex items-center rounded-full bg-[#181818] p-1 border border-white/[0.08] shadow-md">
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
                  ? "bg-[#F97316] text-white shadow-md shadow-orange-950/40 font-semibold"
                  : "text-stone-400 hover:text-stone-200"
              )}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Empresa</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setModalNovoAberto(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:brightness-110 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-orange-950/50 transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Novo cofrinho
          </button>
        </div>
      </div>

      {/* 2. Top Banner Card: TOTAL POUPADO com Porquinho 3D e KPIs de Apoio */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 mt-6">
        {/* Banner Principal */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-6 px-7 shadow-sm relative overflow-hidden flex items-center justify-between min-h-[140px]">
          <div className="pointer-events-none absolute -top-12 left-1/4 h-28 w-1/2 rounded-full bg-amber-500/10 blur-2xl" />

          <div className="max-w-[65%]">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase block">
                TOTAL POUPADO ({tipoConta.toUpperCase()})
              </span>
              <span className="rounded-full bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 text-[10px] font-bold text-orange-400">
                {percentualGeral}% alcançado
              </span>
            </div>
            <span className="font-display text-3xl sm:text-4xl font-bold text-white mt-2 block leading-none">
              {brl(totalPoupado)}
            </span>
            <span className="text-xs text-stone-400 mt-1.5 block">
              de <strong className="text-stone-200">{brl(totalObjetivos)}</strong> em objetivos estipulados
            </span>

            {/* Barra de Progresso Geral */}
            <div className="mt-3.5 w-full max-w-md h-2 rounded-full bg-white/[0.08] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#F97316] to-[#EA580C] transition-all duration-500 shadow-[0_0_12px_rgba(249,115,22,0.5)]"
                style={{ width: `${percentualGeral}%` }}
              />
            </div>
          </div>

          <div className="relative h-24 w-28 sm:h-28 sm:w-32 shrink-0 overflow-hidden flex items-center justify-end">
            <img
              src="/cofrinho-banner-pig@2x.png"
              alt="Cofrinho 3D"
              className="h-full w-full object-cover object-left select-none pointer-events-none drop-shadow-[0_8px_16px_rgba(249,115,22,0.3)]"
            />
          </div>
        </div>

        {/* Mini KPIs de Apoio */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-4 flex flex-col justify-between">
            <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase">
              COFRINHOS ATIVOS
            </span>
            <div>
              <span className="font-display text-2xl font-bold text-white block">
                {cofrinhosPorConta.length}
              </span>
              <span className="text-[10px] text-stone-500 mt-0.5 block">
                {cofrinhosPorConta.filter((c) => (c.valorObjetivo > 0 ? (c.valorAtual / c.valorObjetivo) >= 1 : false)).length} concluídos
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-4 flex flex-col justify-between">
            <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase truncate">
              MAIOR META
            </span>
            <div>
              <span className="font-display text-lg font-bold text-orange-400 block truncate">
                {cofrinhoMaiorMeta ? brl(cofrinhoMaiorMeta.valorObjetivo) : "R$ 0,00"}
              </span>
              <span className="text-[10px] text-stone-400 mt-0.5 block truncate">
                {cofrinhoMaiorMeta ? cofrinhoMaiorMeta.nome : "Nenhum"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Barra de Controles: Filtros de Status + Busca */}
      <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1 rounded-full bg-[#151515] p-1 border border-white/[0.06] self-start">
          <button
            type="button"
            onClick={() => setFiltroStatus("todos")}
            className={cn(
              "rounded-full px-3.5 py-1 text-xs font-bold transition-all cursor-pointer",
              filtroStatus === "todos"
                ? "bg-[#F97316] text-white shadow-sm shadow-orange-950/40"
                : "text-stone-400 hover:text-white"
            )}
          >
            Todos ({cofrinhosPorConta.length})
          </button>
          <button
            type="button"
            onClick={() => setFiltroStatus("andamento")}
            className={cn(
              "rounded-full px-3.5 py-1 text-xs font-medium transition-all cursor-pointer",
              filtroStatus === "andamento"
                ? "bg-[#F97316] text-white font-bold shadow-sm shadow-orange-950/40"
                : "text-stone-400 hover:text-white"
            )}
          >
            Em andamento
          </button>
          <button
            type="button"
            onClick={() => setFiltroStatus("concluidos")}
            className={cn(
              "rounded-full px-3.5 py-1 text-xs font-medium transition-all cursor-pointer",
              filtroStatus === "concluidos"
                ? "bg-[#F97316] text-white font-bold shadow-sm shadow-orange-950/40"
                : "text-stone-400 hover:text-white"
            )}
          >
            Concluídos
          </button>
        </div>

        {/* Campo de Busca Rápida */}
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-500" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar cofrinho..."
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

      {/* 4. Container Principal: Estado Vazio ou Grid de Cofrinhos */}
      {listaVisivel.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-16 min-h-[340px] flex flex-col items-center justify-center text-center mt-4 shadow-sm">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden shadow-xl shadow-black/80 border border-white/[0.08] bg-[#1a1a1a]">
            <img
              src="/empty-search-icon@2x.png"
              alt="Nenhum cofrinho"
              className="h-full w-full object-cover select-none pointer-events-none"
            />
          </div>

          <h3 className="mt-4 text-sm font-bold text-white">
            {busca
              ? "Nenhum cofrinho encontrado na busca"
              : `Nenhum cofrinho em ${tipoConta === "pessoal" ? "Pessoal" : "Empresa"}`}
          </h3>

          <p className="mt-1.5 text-xs text-stone-400 max-w-sm leading-relaxed">
            {busca
              ? "Tente buscar por outro termo ou limpe a busca."
              : `Clique em "Novo cofrinho" para criar sua primeira meta de poupança ${tipoConta === "pessoal" ? "pessoal" : "empresarial"}.`}
          </p>

          {!busca && (
            <button
              type="button"
              onClick={() => setModalNovoAberto(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#F97316] to-[#EA580C] px-5 py-2 text-xs font-bold text-white shadow-lg shadow-orange-950/50 hover:brightness-110 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Criar cofrinho
            </button>
          )}
        </div>
      ) : (
        /* Grid de Cofrinhos */
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listaVisivel.map((meta) => {
            const pct =
              meta.valorObjetivo > 0
                ? Math.min(100, Math.round((meta.valorAtual / meta.valorObjetivo) * 100))
                : 0;
            const faltaGuardar = Math.max(0, meta.valorObjetivo - meta.valorAtual);
            const metaBatida = pct >= 100;

            return (
              <div
                key={meta.id}
                className={cn(
                  "rounded-2xl border bg-[#151515] p-5 shadow-sm relative overflow-hidden flex flex-col justify-between space-y-4 transition-all group",
                  metaBatida
                    ? "border-emerald-500/30 hover:border-emerald-500/50"
                    : "border-white/[0.06] hover:border-white/10"
                )}
              >
                {/* Feixe sutil no topo do card se meta batida */}
                {metaBatida && (
                  <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 h-14 w-3/4 rounded-full bg-emerald-500/10 blur-xl" />
                )}

                {/* Cabeçalho do Card */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border",
                          metaBatida
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-orange-500/10 border-orange-500/20 text-[#F97316]"
                        )}
                      >
                        <PiggyBank className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white leading-tight truncate">
                          {meta.nome}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-stone-400">
                          {meta.categoria && (
                            <span className="truncate">{meta.categoria}</span>
                          )}
                          {meta.prazo && (
                            <>
                              <span>•</span>
                              <span className="truncate">Prazo: {meta.prazo}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[11px] font-bold border",
                          metaBatida
                            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 flex items-center gap-1"
                            : "bg-white/[0.06] border-white/10 text-stone-300"
                        )}
                      >
                        {metaBatida && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                        {pct}%
                      </span>
                    </div>
                  </div>

                  {/* Informações de Valores e Barra de Progresso */}
                  <div className="mt-4">
                    <div className="flex items-baseline justify-between text-xs mb-1.5">
                      <span className="text-stone-400">Poupado</span>
                      <span className="font-bold text-white font-display">
                        {brl(meta.valorAtual)}{" "}
                        <span className="text-stone-500 font-normal">/ {brl(meta.valorObjetivo)}</span>
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/[0.07] overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          metaBatida
                            ? "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                            : "bg-gradient-to-r from-[#F97316] to-[#EA580C]"
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-[11px]">
                      <span className="text-stone-500">
                        {metaBatida ? "Meta alcançada! 🎉" : `Falta: ${brl(faltaGuardar)}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botões de Ação do Card */}
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setValorAporte("");
                        setModalAporteId(meta.id);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                      title="Adicionar valor ao cofrinho"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" /> Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setValorResgate("");
                        setModalResgateId(meta.id);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
                      title="Resgatar valor deste cofrinho"
                    >
                      <ArrowDownLeft className="h-3.5 w-3.5" /> Resgatar
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => abrirEdicao(meta)}
                      className="text-stone-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/[0.05] cursor-pointer"
                      title="Editar cofrinho"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removerCofrinho(meta.id)}
                      className="text-stone-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-white/[0.05] cursor-pointer"
                      title="Excluir cofrinho"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
