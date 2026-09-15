import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { AppShell } from "@/components/app/AppShell";
import { cn } from "@/lib/utils";
import { brl } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { notificarAtualizacaoFinanceira, type InvestimentoItem } from "@/lib/financial-service";
import { toast } from "sonner";
import {
  Plus,
  TrendingUp,
  ChevronDown,
  Calendar,
  Trash2,
  Pencil,
  X,
  Search,
  User,
  Building2,
  Sparkles,
  Percent,
  Clock,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/investimentos")({
  head: () => ({
    meta: [
      { title: "Investimentos — OrganizAI" },
      {
        name: "description",
        content: "Sua carteira completa com projeção de longo prazo · Pessoal e Empresa.",
      },
      { property: "og:title", content: "Investimentos — OrganizAI" },
    ],
  }),
  component: Investimentos,
});

const TIPOS_INVESTIMENTO_PESSOAL = [
  "CDB",
  "Tesouro Direto",
  "Ações",
  "FIIs (Fundos Imobiliários)",
  "Criptoativos",
  "LCI / LCA",
  "Fundos Multimercado",
  "Previdência Privada",
  "Outros",
];

const TIPOS_INVESTIMENTO_EMPRESA = [
  "CDB PJ (Liquidez Diária)",
  "Renda Fixa Corporativa",
  "Tesouro Nacional PJ",
  "Fundos de Investimento PJ",
  "Operações Estruturadas",
  "Ações / Participações PJ",
  "LCI / LCA Empresarial",
  "Outros",
];

function Investimentos() {
  const { user } = useAuth();
  const [investimentos, setInvestimentos] = useState<InvestimentoItem[]>([]);
  const [carregando, setCarregando] = useState(false);

  // Modo da Conta: "pessoal" ou "empresa"
  const [tipoConta, setTipoConta] = useState<"pessoal" | "empresa">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("organizai_tipo_conta") as "pessoal" | "empresa") || "pessoal";
    }
    return "pessoal";
  });

  // Alterna o tipo de conta com sincronização com AppShell e localStorage
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

  const tiposAtivos =
    tipoConta === "pessoal" ? TIPOS_INVESTIMENTO_PESSOAL : TIPOS_INVESTIMENTO_EMPRESA;

  // Form states para NOVO investimento
  const hojePt = new Date().toLocaleDateString("pt-BR");
  const [nome, setNome] = useState("");
  const [instituicao, setInstituicao] = useState("");
  const [tipo, setTipo] = useState(tiposAtivos[0] || "CDB");
  const [dataInicio, setDataInicio] = useState(hojePt);
  const [capitalInicial, setCapitalInicial] = useState("");
  const [aporteMensal, setAporteMensal] = useState("");
  const [rentabilidadeAnual, setRentabilidadeAnual] = useState("");
  const [prazoMeses, setPrazoMeses] = useState("60");

  // Ajusta o tipo padrão ao alternar tipoConta
  useEffect(() => {
    const tipos = tipoConta === "pessoal" ? TIPOS_INVESTIMENTO_PESSOAL : TIPOS_INVESTIMENTO_EMPRESA;
    setTipo(tipos[0] || "CDB");
  }, [tipoConta]);

  // Modal de Edição
  const [itemEditando, setItemEditando] = useState<InvestimentoItem | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editInstituicao, setEditInstituicao] = useState("");
  const [editTipo, setEditTipo] = useState("");
  const [editCapitalInicial, setEditCapitalInicial] = useState("");
  const [editAporteMensal, setEditAporteMensal] = useState("");
  const [editRentabilidade, setEditRentabilidade] = useState("");
  const [editPrazoMeses, setEditPrazoMeses] = useState("60");

  // Filtros de busca
  const [busca, setBusca] = useState("");

  // Carregar investimentos do Supabase
  useEffect(() => {
    if (!user?.id) return;

    let cancelado = false;

    const carregar = async () => {
      try {
        setCarregando(true);
        const { data, error } = await supabase
          .from("investimentos")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!cancelado && !error && data) {
          setInvestimentos(
            data.map((inv: any) => ({
              id: inv.id,
              user_id: inv.user_id,
              titulo: inv.titulo,
              instituicao: inv.instituicao || undefined,
              tipo: inv.tipo || "CDB",
              dataInicio: inv.data_inicio || hojePt,
              valorAplicado: Number(inv.valor_aplicado) || 0,
              saldoAtual: Number(inv.saldo_atual) || Number(inv.valor_aplicado) || 0,
              aporteMensal: Number(inv.aporte_mensal) || 0,
              rendimentoPct: Number(inv.rendimento_pct) || 0,
              prazoMeses: Number(inv.prazo_meses) || 60,
              tipoConta: (inv.tipo_conta as "pessoal" | "empresa") || "pessoal",
              created_at: inv.created_at,
            }))
          );
        }
      } catch (err) {
        console.error("Erro ao carregar investimentos:", err);
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
  const investimentosPorConta = useMemo(() => {
    return investimentos.filter((i) => (i.tipoConta || "pessoal") === tipoConta);
  }, [investimentos, tipoConta]);

  // Filtra por busca em tempo real
  const listaVisivel = useMemo(() => {
    if (!busca.trim()) return investimentosPorConta;
    const termo = busca.toLowerCase();
    return investimentosPorConta.filter((i) => {
      const noTitulo = i.titulo.toLowerCase().includes(termo);
      const noTipo = i.tipo.toLowerCase().includes(termo);
      const naInst = i.instituicao?.toLowerCase().includes(termo) || false;
      return noTitulo || noTipo || naInst;
    });
  }, [investimentosPorConta, busca]);

  // Cálculos do Top Card: Patrimônio, Total Investido, Rendimento
  const totalInvestido = useMemo(() => {
    return investimentosPorConta.reduce((acc, curr) => acc + curr.valorAplicado, 0);
  }, [investimentosPorConta]);

  // Cálculo de rendimento estimado anual/acumulado
  const rendimentoTotal = useMemo(() => {
    return investimentosPorConta.reduce((acc, curr) => {
      const taxaMensal = Math.pow(1 + (curr.rendimentoPct || 0) / 100, 1 / 12) - 1;
      const mesesDecorridos = 1;
      const valorComJuros = curr.valorAplicado * Math.pow(1 + taxaMensal, mesesDecorridos);
      return acc + (valorComJuros - curr.valorAplicado);
    }, 0);
  }, [investimentosPorConta]);

  const patrimonioAtual = totalInvestido + rendimentoTotal;

  // Rentabilidade média ponderada
  const rentabilidadeMediaPonderada = useMemo(() => {
    if (totalInvestido === 0) return 0;
    const somaPonderada = investimentosPorConta.reduce(
      (acc, curr) => acc + curr.valorAplicado * (curr.rendimentoPct || 0),
      0
    );
    return (somaPonderada / totalInvestido).toFixed(2);
  }, [investimentosPorConta, totalInvestido]);

  // Projeção futura em 60 meses
  const projecao60Meses = useMemo(() => {
    const meses = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
    const taxaAnualMedia = Number(rentabilidadeMediaPonderada) || 10;
    const taxaMensal = Math.pow(1 + taxaAnualMedia / 100, 1 / 12) - 1;
    const totalAporteMensal = investimentosPorConta.reduce((acc, curr) => acc + (curr.aporteMensal || 0), 0);

    return meses.map((m) => {
      let vf = totalInvestido * Math.pow(1 + taxaMensal, m);
      if (taxaMensal > 0 && totalAporteMensal > 0 && m > 0) {
        vf += totalAporteMensal * ((Math.pow(1 + taxaMensal, m) - 1) / taxaMensal);
      }
      return { mes: m, valor: vf };
    });
  }, [totalInvestido, rentabilidadeMediaPonderada, investimentosPorConta]);

  const valorFinalProjetado = projecao60Meses[projecao60Meses.length - 1]?.valor || 0;

  // Registrar Novo Investimento
  const handleSalvarInvestimento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      toast.error("Informe o nome do investimento.");
      return;
    }

    const capInicial = parseFloat(capitalInicial.replace(/\./g, "").replace(",", ".")) || 0;
    const aporte = parseFloat(aporteMensal.replace(/\./g, "").replace(",", ".")) || 0;
    const rent = parseFloat(rentabilidadeAnual.replace(/\./g, "").replace(",", ".")) || 0;
    const prazo = parseInt(prazoMeses, 10) || 60;

    if (capInicial <= 0) {
      toast.error("Informe um capital inicial maior que zero.");
      return;
    }

    const novoTemp: InvestimentoItem = {
      id: "temp-" + Date.now(),
      user_id: user?.id,
      titulo: nome.trim(),
      instituicao: instituicao.trim() || undefined,
      tipo,
      dataInicio: dataInicio.trim() || hojePt,
      valorAplicado: capInicial,
      saldoAtual: capInicial,
      aporteMensal: aporte,
      rendimentoPct: rent,
      prazoMeses: prazo,
      tipoConta,
    };

    setInvestimentos((prev) => [novoTemp, ...prev]);
    setNome("");
    setInstituicao("");
    setCapitalInicial("");
    setAporteMensal("");
    setRentabilidadeAnual("");
    setPrazoMeses("60");

    if (user?.id) {
      try {
        const { data, error } = await supabase
          .from("investimentos")
          .insert({
            user_id: user.id,
            titulo: novoTemp.titulo,
            tipo: novoTemp.tipo,
            valor_aplicado: novoTemp.valorAplicado,
            saldo_atual: novoTemp.saldoAtual,
            instituicao: novoTemp.instituicao || null,
            rendimento_pct: novoTemp.rendimentoPct,
            aporte_mensal: novoTemp.aporteMensal,
            prazo_meses: novoTemp.prazoMeses,
            data_inicio: novoTemp.dataInicio,
            tipo_conta: tipoConta,
          })
          .select()
          .single();

        if (error) {
          console.error("Erro ao salvar investimento:", error);
          toast.error("Erro ao salvar no banco. Guardado localmente.");
        } else if (data) {
          setInvestimentos((prev) =>
            prev.map((i) => (i.id === novoTemp.id ? { ...i, id: data.id } : i))
          );
          toast.success(`Investimento "${novoTemp.titulo}" registrado com sucesso!`);
        }
        notificarAtualizacaoFinanceira();
      } catch (err) {
        console.error("Erro ao salvar investimento:", err);
      }
    }
  };

  // Abrir Modal de Edição
  const abrirEdicao = (inv: InvestimentoItem) => {
    setItemEditando(inv);
    setEditNome(inv.titulo);
    setEditInstituicao(inv.instituicao || "");
    setEditTipo(inv.tipo);
    setEditCapitalInicial(inv.valorAplicado.toLocaleString("pt-BR", { minimumFractionDigits: 2 }));
    setEditAporteMensal((inv.aporteMensal || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 }));
    setEditRentabilidade(String(inv.rendimentoPct || ""));
    setEditPrazoMeses(String(inv.prazoMeses || 60));
  };

  // Salvar Edição
  const handleSalvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemEditando) return;

    if (!editNome.trim()) {
      toast.error("Informe o nome.");
      return;
    }

    const capInicial = parseFloat(editCapitalInicial.replace(/\./g, "").replace(",", ".")) || 0;
    const aporte = parseFloat(editAporteMensal.replace(/\./g, "").replace(",", ".")) || 0;
    const rent = parseFloat(editRentabilidade.replace(/\./g, "").replace(",", ".")) || 0;
    const prazo = parseInt(editPrazoMeses, 10) || 60;

    if (capInicial <= 0) {
      toast.error("O valor aplicado deve ser maior que zero.");
      return;
    }

    const atualizado: InvestimentoItem = {
      ...itemEditando,
      titulo: editNome.trim(),
      instituicao: editInstituicao.trim() || undefined,
      tipo: editTipo,
      valorAplicado: capInicial,
      saldoAtual: capInicial,
      aporteMensal: aporte,
      rendimentoPct: rent,
      prazoMeses: prazo,
    };

    setInvestimentos((prev) =>
      prev.map((i) => (i.id === itemEditando.id ? atualizado : i))
    );
    setItemEditando(null);

    if (user?.id && !itemEditando.id.startsWith("temp-")) {
      try {
        await supabase
          .from("investimentos")
          .update({
            titulo: atualizado.titulo,
            instituicao: atualizado.instituicao || null,
            tipo: atualizado.tipo,
            valor_aplicado: atualizado.valorAplicado,
            saldo_atual: atualizado.saldoAtual,
            aporte_mensal: atualizado.aporteMensal,
            rendimento_pct: atualizado.rendimentoPct,
            prazo_meses: atualizado.prazoMeses,
          })
          .eq("id", itemEditando.id)
          .eq("user_id", user.id);

        toast.success("Investimento atualizado com sucesso!");
        notificarAtualizacaoFinanceira();
      } catch (err) {
        console.error("Erro ao atualizar investimento:", err);
      }
    }
  };

  // Excluir Investimento
  const removerInvestimento = async (id: string) => {
    setInvestimentos((prev) => prev.filter((i) => i.id !== id));

    if (user?.id && !id.startsWith("temp-")) {
      try {
        await supabase.from("investimentos").delete().eq("id", id).eq("user_id", user.id);
        toast.success("Investimento removido!");
        notificarAtualizacaoFinanceira();
      } catch (err) {
        console.error("Erro ao remover investimento:", err);
      }
    }
  };

  return (
    <AppShell>
      {/* Modal de Edição de Investimento */}
      {itemEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#151515] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Pencil className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Editar investimento</h3>
              </div>
              <button
                type="button"
                onClick={() => setItemEditando(null)}
                className="rounded-lg p-1.5 text-stone-400 hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSalvarEdicao} className="space-y-3.5 mt-4">
              <div>
                <label className="text-xs font-medium text-stone-300 mb-1 block">Nome do ativo</label>
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
                  <label className="text-xs font-medium text-stone-300 mb-1 block">Instituição</label>
                  <input
                    type="text"
                    value={editInstituicao}
                    onChange={(e) => setEditInstituicao(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1 block">Tipo</label>
                  <select
                    value={editTipo}
                    onChange={(e) => setEditTipo(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3 py-2.5 text-xs text-white outline-none cursor-pointer"
                  >
                    {tiposAtivos.map((t) => (
                      <option key={t} value={t} className="bg-[#1e1e1e]">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1 block">Capital inicial (R$)</label>
                  <input
                    type="text"
                    value={editCapitalInicial}
                    onChange={(e) => setEditCapitalInicial(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500/60 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1 block">Aporte/mês (R$)</label>
                  <input
                    type="text"
                    value={editAporteMensal}
                    onChange={(e) => setEditAporteMensal(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500/60 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1 block">Rent. anual (% a.a.)</label>
                  <input
                    type="text"
                    value={editRentabilidade}
                    onChange={(e) => setEditRentabilidade(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1 block">Prazo (meses)</label>
                  <input
                    type="number"
                    value={editPrazoMeses}
                    onChange={(e) => setEditPrazoMeses(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500/60 transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setItemEditando(null)}
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
              src="/icons/kpi/invest-header@2x.png"
              alt="Investimentos"
              className="h-full w-full object-cover select-none pointer-events-none"
            />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white leading-tight">
              Investimentos
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Sua carteira completa com projeção —{" "}
              <span className="font-semibold text-stone-200">
                {tipoConta === "pessoal" ? "Pessoal" : "Empresarial"}
              </span>
              .
            </p>
          </div>
        </div>
      </div>

      {/* 2. Top Summary Card: PATRIMÔNIO ATUAL / TOTAL INVESTIDO / RENDIMENTO */}
      <div className="rounded-2xl border border-emerald-500/20 bg-[#151515] p-6 px-8 shadow-sm relative overflow-hidden mt-6">
        <div className="pointer-events-none absolute -top-12 left-1/4 h-28 w-1/2 rounded-full bg-emerald-500/10 blur-2xl" />

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 items-center">
          {/* PATRIMÔNIO ATUAL */}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase block">
                PATRIMÔNIO ATUAL
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                {tipoConta.toUpperCase()}
              </span>
            </div>
            <span className="font-display text-3xl sm:text-4xl font-bold text-white mt-1.5 block leading-none">
              {brl(patrimonioAtual)}
            </span>
          </div>

          {/* TOTAL INVESTIDO */}
          <div>
            <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase block">
              TOTAL INVESTIDO
            </span>
            <span className="font-display text-xl sm:text-2xl font-bold text-stone-300 mt-1.5 block leading-none">
              {brl(totalInvestido)}
            </span>
          </div>

          {/* RENDIMENTO */}
          <div>
            <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase block">
              RENDIMENTO ESTIMADO
            </span>
            <span className="font-display text-xl sm:text-2xl font-bold text-[#34d399] mt-1.5 block leading-none">
              + {brl(rendimentoTotal)}
            </span>
          </div>

          {/* RENTABILIDADE MÉDIA PONDERADA */}
          <div>
            <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase block">
              RENTABILIDADE MÉDIA
            </span>
            <span className="font-display text-xl sm:text-2xl font-bold text-orange-400 mt-1.5 block leading-none">
              {rentabilidadeMediaPonderada}% <span className="text-xs text-stone-400 font-normal">a.a.</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Grid Principal em 2 Colunas: Formulário na Esquerda e Carteira/Projeção na Direita */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[380px_minmax(0,1fr)] mt-4 items-start">
        {/* Coluna da Esquerda: NOVO APORTE */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm">
          <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-3/4 rounded-full bg-amber-500/10 blur-xl" />

          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold tracking-wider text-stone-400 uppercase block">
              NOVO APORTE ({tipoConta === "pessoal" ? "PESSOAL" : "EMPRESA"})
            </span>
            <span className="text-[10px] font-semibold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
              {tipoConta === "pessoal" ? "PF" : "PJ"}
            </span>
          </div>

          <form onSubmit={handleSalvarInvestimento} className="space-y-3.5">
            {/* Nome */}
            <div>
              <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                Nome do ativo / investimento
              </label>
              <input
                type="text"
                placeholder={
                  tipoConta === "pessoal"
                    ? "Ex.: Tesouro Selic 2029, CDB Inter..."
                    : "Ex.: CDB PJ Liquidez Diária, Fundo Empresarial..."
                }
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white placeholder:text-stone-500 outline-none focus:border-orange-500/60 transition-colors"
                required
              />
            </div>

            {/* Instituição */}
            <div>
              <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                Instituição financeira / Corretora
              </label>
              <input
                type="text"
                value={instituicao}
                onChange={(e) => setInstituicao(e.target.value)}
                placeholder="Ex.: XP Investimentos, BTG, Nubank, Inter..."
                className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white placeholder:text-stone-500 outline-none focus:border-orange-500/60 transition-colors"
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                Tipo de ativo
              </label>
              <div className="relative">
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 pr-8 text-xs text-white outline-none cursor-pointer"
                >
                  {tiposAtivos.map((t) => (
                    <option key={t} value={t} className="bg-[#1e1e1e]">
                      {t}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
              </div>
            </div>

            {/* Data de Início */}
            <div>
              <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                Data de início
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  placeholder="DD/MM/AAAA"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 pr-8 text-xs text-white placeholder:text-stone-500 outline-none focus:border-orange-500/60 transition-colors"
                />
                <Calendar className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
              </div>
            </div>

            {/* Capital Inicial */}
            <div>
              <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                Capital inicial aplicado
              </label>
              <div className="relative flex items-center rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs focus-within:border-orange-500/60 transition-colors">
                <span className="text-stone-400 font-medium mr-1.5 select-none">R$</span>
                <input
                  type="text"
                  placeholder="1.000,00"
                  value={capitalInicial}
                  onChange={(e) => setCapitalInicial(e.target.value)}
                  className="w-full bg-transparent text-white font-medium outline-none placeholder:text-stone-500"
                  required
                />
              </div>
            </div>

            {/* Linha de 3 colunas: Aporte/mês, Rent. a.a. (%), Prazo (m) */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-medium text-stone-300 mb-1 block truncate">
                  Aporte/mês (R$)
                </label>
                <input
                  type="text"
                  placeholder="0,00"
                  value={aporteMensal}
                  onChange={(e) => setAporteMensal(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-2.5 py-2.5 text-xs text-white placeholder:text-stone-500 outline-none focus:border-orange-500/60 transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-stone-300 mb-1 block truncate">
                  Rent. a.a. (%)
                </label>
                <input
                  type="text"
                  placeholder="12,5"
                  value={rentabilidadeAnual}
                  onChange={(e) => setRentabilidadeAnual(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-2.5 py-2.5 text-xs text-white placeholder:text-stone-500 outline-none focus:border-orange-500/60 transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-stone-300 mb-1 block truncate">
                  Prazo (meses)
                </label>
                <input
                  type="number"
                  placeholder="60"
                  value={prazoMeses}
                  onChange={(e) => setPrazoMeses(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-2.5 py-2.5 text-xs text-white placeholder:text-stone-500 outline-none focus:border-orange-500/60 transition-colors"
                />
              </div>
            </div>

            {/* Botão + Adicionar */}
            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:brightness-110 py-3 text-xs font-bold text-white shadow-lg shadow-orange-950/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-2"
            >
              <Plus className="h-4 w-4" /> Registrar investimento
            </button>
          </form>
        </div>

        {/* Coluna da Direita: Projeção da carteira e Sua carteira */}
        <div className="space-y-4">
          {/* Card 1: Projeção da Carteira */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm min-h-[220px] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div>
                <h3 className="text-xs font-bold text-white">Projeção da carteira</h3>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Simulação composta para 60 meses
                </p>
              </div>
              {totalInvestido > 0 && (
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 uppercase block">Projeção em 5 anos</span>
                  <span className="font-display text-sm font-bold text-emerald-400">
                    {brl(valorFinalProjetado)}
                  </span>
                </div>
              )}
            </div>

            {investimentosPorConta.length === 0 ? (
              <div className="my-auto py-8 flex flex-col items-center justify-center text-center">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl overflow-hidden shadow-xl shadow-black/80 border border-white/[0.08] bg-[#1a1a1a]">
                  <img
                    src="/empty-search-icon@2x.png"
                    alt="Sem projeção ainda"
                    className="h-full w-full object-cover select-none pointer-events-none"
                  />
                </div>
                <h4 className="mt-3 text-xs font-bold text-white">
                  Sem projeção ainda ({tipoConta === "pessoal" ? "Pessoal" : "Empresarial"})
                </h4>
                <p className="mt-1 text-[11px] text-stone-400 max-w-sm leading-relaxed">
                  Adicione um investimento ao lado para calcular a curva patrimonial.
                </p>
              </div>
            ) : (
              /* Curva de projeção visual proporcional */
              <div className="py-4">
                <div className="h-32 w-full flex items-end gap-1 px-1">
                  {projecao60Meses.map((item, idx) => {
                    const maxVal = valorFinalProjetado || 1;
                    const altura = Math.max(15, Math.min(100, Math.round((item.valor / maxVal) * 100)));
                    return (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer"
                      >
                        <div
                          className="w-full rounded-t-md bg-gradient-to-t from-emerald-600/30 via-emerald-500/50 to-emerald-400 group-hover:brightness-125 transition-all shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                          style={{ height: `${altura}%` }}
                        />
                        {/* Tooltip no hover */}
                        <div className="pointer-events-none absolute -top-8 hidden group-hover:block z-20 whitespace-nowrap rounded-md bg-[#1f1f1f] px-2 py-1 text-[10px] text-white shadow-xl border border-white/10">
                          Mês {item.mes}: {brl(item.valor)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[10px] text-stone-500 mt-2 px-1">
                  <span>Mês 0</span>
                  <span>Mês 30</span>
                  <span>Mês 60</span>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Sua Carteira */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm min-h-[260px] flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-white">Sua carteira</h3>
                  <span className="text-[10px] text-stone-400">
                    ({tipoConta === "pessoal" ? "Pessoal" : "Empresarial"})
                  </span>
                  {investimentosPorConta.length > 0 && (
                    <span className="rounded-full bg-white/[0.06] border border-white/10 px-2 py-0.2 text-[10px] text-stone-400 font-medium">
                      {investimentosPorConta.length} {investimentosPorConta.length === 1 ? "ativo" : "ativos"}
                    </span>
                  )}
                </div>

                {/* Campo de Busca Rápida na Carteira */}
                <div className="relative w-full sm:w-48">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-stone-500" />
                  <input
                    type="text"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar ativo..."
                    className="w-full rounded-full border border-white/[0.08] bg-[#1c1c1c] py-1 pl-7 pr-6 text-xs text-white placeholder:text-stone-500 outline-none focus:border-orange-500/60"
                  />
                  {busca && (
                    <button
                      type="button"
                      onClick={() => setBusca("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  )}
                </div>
              </div>

              {listaVisivel.length === 0 ? (
                <div className="my-auto py-10 flex flex-col items-center justify-center text-center">
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl overflow-hidden shadow-xl shadow-black/80 border border-white/[0.08] bg-[#1a1a1a]">
                    <img
                      src="/empty-search-icon@2x.png"
                      alt="Nenhum investimento"
                      className="h-full w-full object-cover select-none pointer-events-none"
                    />
                  </div>
                  <h4 className="mt-3 text-xs font-bold text-white">
                    {busca
                      ? "Nenhum ativo encontrado na busca"
                      : `Nenhum investimento cadastrado (${tipoConta === "pessoal" ? "Pessoal" : "Empresarial"})`}
                  </h4>
                  <p className="mt-1 text-[11px] text-stone-400 max-w-sm leading-relaxed">
                    {busca
                      ? "Tente buscar por outro termo ou limpe a busca."
                      : "Adicione seu primeiro aporte no formulário ao lado."}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.06] mt-2 max-h-[380px] overflow-y-auto pr-1">
                  {listaVisivel.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-3 hover:bg-white/[0.02] px-2 rounded-xl transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-500/20">
                          <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white leading-tight truncate">
                            {item.titulo}
                          </p>
                          <p className="text-[11px] text-stone-400 mt-0.5 truncate">
                            {item.tipo} {item.instituicao ? `• ${item.instituicao}` : ""}{" "}
                            {item.aporteMensal && item.aporteMensal > 0 ? `• +${brl(item.aporteMensal)}/mês` : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <div className="text-right">
                          <p className="font-display text-xs font-bold text-white">
                            {brl(item.valorAplicado)}
                          </p>
                          {item.rendimentoPct && item.rendimentoPct > 0 ? (
                            <span className="text-[10px] text-emerald-400 block font-semibold">
                              +{item.rendimentoPct}% a.a.
                            </span>
                          ) : null}
                        </div>

                        <button
                          type="button"
                          onClick={() => abrirEdicao(item)}
                          className="text-stone-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/[0.05] cursor-pointer"
                          title="Editar ativo"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removerInvestimento(item.id)}
                          className="text-stone-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-white/[0.05] cursor-pointer"
                          title="Excluir ativo"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
