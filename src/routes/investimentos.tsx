import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/app/AppShell";
import { cn } from "@/lib/utils";
import { brl } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { notificarAtualizacaoFinanceira } from "@/lib/financial-service";
import { toast } from "sonner";
import {
  Plus,
  TrendingUp,
  ChevronDown,
  Calendar,
  Trash2,
  Percent,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/investimentos")({
  head: () => ({
    meta: [
      { title: "Investimentos — OrganizAI" },
      {
        name: "description",
        content: "Sua carteira completa com projeção de longo prazo.",
      },
    ],
  }),
  component: Investimentos,
});

interface InvestimentoItem {
  id: string;
  nome: string;
  instituicao?: string | undefined;
  tipo: string;
  dataInicio: string;
  capitalInicial: number;
  aporteMensal: number;
  rentabilidadeAnual: number;
  prazoMeses: number;
}

const tiposInvestimento = [
  "CDB",
  "Tesouro Direto",
  "Ações",
  "FIIs",
  "Cripto",
  "LCI/LCA",
  "Fundos",
  "Outros",
];

function Investimentos() {
  const { user } = useAuth();
  const [investimentos, setInvestimentos] = useState<InvestimentoItem[]>([]);
  const [carregando, setCarregando] = useState(false);

  // Form states
  const [nome, setNome] = useState("");
  const [instituicao, setInstituicao] = useState("");
  const [tipo, setTipo] = useState("CDB");
  const [dataInicio, setDataInicio] = useState("13/09/2026");
  const [capitalInicial, setCapitalInicial] = useState("");
  const [aporteMensal, setAporteMensal] = useState("");
  const [rentabilidadeAnual, setRentabilidadeAnual] = useState("");
  const [prazoMeses, setPrazoMeses] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    const carregar = async () => {
      try {
        setCarregando(true);
        const { data, error } = await supabase
          .from("investimentos")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!error && data) {
          setInvestimentos(
            data.map((inv: any) => ({
              id: inv.id,
              nome: inv.titulo,
              instituicao: inv.instituicao || undefined,
              tipo: inv.tipo || "CDB",
              dataInicio: "13/09/2026",
              capitalInicial: Number(inv.valor_aplicado) || 0,
              aporteMensal: 0,
              rentabilidadeAnual: Number(inv.rendimento_pct) || 0,
              prazoMeses: 60,
            }))
          );
        }
      } catch (err) {
        console.error("Erro ao carregar investimentos:", err);
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, [user?.id]);

  // Calculations
  const totalInvestido = investimentos.reduce((acc, curr) => acc + curr.capitalInicial, 0);
  
  // Calculate simulated yield
  const rendimentoTotal = investimentos.reduce((acc, curr) => {
    const taxaMensal = Math.pow(1 + curr.rentabilidadeAnual / 100, 1 / 12) - 1;
    const mesesDecorridos = 1; // 1 month simulation base
    const valorComJuros = curr.capitalInicial * Math.pow(1 + taxaMensal, mesesDecorridos);
    return acc + (valorComJuros - curr.capitalInicial);
  }, 0);

  const patrimonioAtual = totalInvestido + rendimentoTotal;

  const handleSalvarInvestimento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    const capInicial = parseFloat(capitalInicial.replace(/\./g, "").replace(",", ".")) || 0;
    const aporte = parseFloat(aporteMensal.replace(/\./g, "").replace(",", ".")) || 0;
    const rent = parseFloat(rentabilidadeAnual.replace(/\./g, "").replace(",", ".")) || 0;
    const prazo = parseInt(prazoMeses) || 60;

    const novoTemp: InvestimentoItem = {
      id: "temp-" + Date.now(),
      nome: nome.trim(),
      instituicao: instituicao.trim() || undefined,
      tipo,
      dataInicio: dataInicio.trim() || "13/09/2026",
      capitalInicial: capInicial,
      aporteMensal: aporte,
      rentabilidadeAnual: rent,
      prazoMeses: prazo,
    };

    setInvestimentos((prev) => [novoTemp, ...prev]);
    setNome("");
    setInstituicao("");
    setCapitalInicial("");
    setAporteMensal("");
    setRentabilidadeAnual("");
    setPrazoMeses("");

    if (user?.id) {
      try {
        const { data, error } = await supabase
          .from("investimentos")
          .insert({
            user_id: user.id,
            titulo: novoTemp.nome,
            tipo: novoTemp.tipo,
            valor_aplicado: novoTemp.capitalInicial,
            saldo_atual: novoTemp.capitalInicial,
            instituicao: novoTemp.instituicao || null,
            rendimento_pct: novoTemp.rentabilidadeAnual,
          })
          .select()
          .single();

        if (error) {
          toast.error("Erro ao salvar no banco. Guardado localmente.");
        } else if (data) {
          setInvestimentos((prev) =>
            prev.map((i) => (i.id === novoTemp.id ? { ...i, id: data.id } : i))
          );
          toast.success("Investimento registrado com sucesso!");
        }
        notificarAtualizacaoFinanceira();
      } catch (err) {
        console.error("Erro ao salvar investimento:", err);
      }
    }
  };

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
      {/* 1. Cabeçalho da Página: Ícone 3D Gráfico + Título e Subtítulo */}
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
            Sua carteira completa com projeção de longo prazo.
          </p>
        </div>
      </div>

      {/* 2. Top Summary Card: PATRIMÔNIO ATUAL / TOTAL INVESTIDO / RENDIMENTO */}
      <div className="rounded-2xl border border-emerald-500/20 bg-[#151515] p-6 px-8 shadow-sm relative overflow-hidden mt-6">
        {/* Brilho atmosférico esmeralda suave */}
        <div className="pointer-events-none absolute -top-12 left-1/4 h-28 w-1/2 rounded-full bg-emerald-500/10 blur-2xl" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          {/* PATRIMÔNIO ATUAL */}
          <div>
            <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase block">
              PATRIMÔNIO ATUAL
            </span>
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
              RENDIMENTO
            </span>
            <span className="font-display text-xl sm:text-2xl font-bold text-[#34d399] mt-1.5 block leading-none">
              + {brl(rendimentoTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Grid Principal em 2 Colunas: Formulário na Esquerda e Cards na Direita */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[380px_minmax(0,1fr)] mt-4 items-start">
        {/* Coluna da Esquerda: NOVO APORTE */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm">
          {/* Feixe de luz suave superior */}
          <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-3/4 rounded-full bg-amber-500/10 blur-xl" />

          <span className="text-[11px] font-bold tracking-wider text-stone-400 uppercase block mb-4">
            NOVO APORTE
          </span>

          <form onSubmit={handleSalvarInvestimento} className="space-y-3.5">
            {/* Nome */}
            <div>
              <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                Nome
              </label>
              <input
                type="text"
                placeholder="Ex.: CDB Banco Inter"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white placeholder:text-stone-500 outline-none focus:border-orange-500/60 transition-colors"
                required
              />
            </div>

            {/* Instituição */}
            <div>
              <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                Instituição
              </label>
              <input
                type="text"
                value={instituicao}
                onChange={(e) => setInstituicao(e.target.value)}
                placeholder=""
                className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white placeholder:text-stone-500 outline-none focus:border-orange-500/60 transition-colors"
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                Tipo
              </label>
              <div className="relative">
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 pr-8 text-xs text-white outline-none cursor-pointer"
                >
                  {tiposInvestimento.map((t) => (
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
                  placeholder="13/09/2026"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 pr-8 text-xs text-white placeholder:text-stone-500 outline-none focus:border-orange-500/60 transition-colors"
                />
                <Calendar className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
              </div>
            </div>

            {/* Capital Inicial */}
            <div>
              <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                Capital inicial
              </label>
              <div className="relative flex items-center rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs focus-within:border-orange-500/60 transition-colors">
                <span className="text-stone-400 font-medium mr-1.5 select-none">R$</span>
                <input
                  type="text"
                  placeholder="0,00"
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
                  Aporte/mês
                </label>
                <input
                  type="text"
                  placeholder=""
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
                  placeholder=""
                  value={rentabilidadeAnual}
                  onChange={(e) => setRentabilidadeAnual(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-2.5 py-2.5 text-xs text-white placeholder:text-stone-500 outline-none focus:border-orange-500/60 transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-stone-300 mb-1 block truncate">
                  Prazo (m)
                </label>
                <input
                  type="text"
                  placeholder=""
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
              <Plus className="h-4 w-4" /> Adicionar
            </button>
          </form>
        </div>

        {/* Coluna da Direita: Projeção da carteira e Sua carteira */}
        <div className="space-y-4">
          {/* Card 1: Projeção da carteira */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm min-h-[220px] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3">
              <h3 className="text-xs font-bold text-white">Projeção da carteira</h3>
              <span className="text-[11px] text-stone-500 font-medium">60 meses</span>
            </div>

            {investimentos.length === 0 ? (
              <div className="my-auto py-8 flex flex-col items-center justify-center text-center">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl overflow-hidden shadow-xl shadow-black/80 border border-white/[0.08] bg-[#1a1a1a]">
                  <img
                    src="/empty-search-icon@2x.png"
                    alt="Sem projeção ainda"
                    className="h-full w-full object-cover select-none pointer-events-none"
                  />
                </div>
                <h4 className="mt-3 text-xs font-bold text-white">
                  Sem projeção ainda
                </h4>
                <p className="mt-1 text-[11px] text-stone-400 max-w-sm leading-relaxed">
                  Adicione um investimento ao lado para ver a curva.
                </p>
              </div>
            ) : (
              /* Curva de projeção simples */
              <div className="py-4">
                <div className="h-28 w-full flex items-end gap-1 px-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((mes) => {
                    const altura = Math.min(100, Math.round(20 + mes * 6.5));
                    return (
                      <div
                        key={mes}
                        className="flex-1 rounded-t-sm bg-gradient-to-t from-emerald-500/20 to-emerald-400 hover:brightness-125 transition-all"
                        style={{ height: `${altura}%` }}
                        title={`Mês ${mes * 5}`}
                      />
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

          {/* Card 2: Sua carteira */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm min-h-[220px] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3">
              <h3 className="text-xs font-bold text-white">Sua carteira</h3>
              {investimentos.length > 0 && (
                <span className="text-[11px] text-stone-400 font-medium">
                  {investimentos.length} {investimentos.length === 1 ? "ativo" : "ativos"}
                </span>
              )}
            </div>

            {investimentos.length === 0 ? (
              <div className="my-auto py-8 flex flex-col items-center justify-center text-center">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl overflow-hidden shadow-xl shadow-black/80 border border-white/[0.08] bg-[#1a1a1a]">
                  <img
                    src="/empty-search-icon@2x.png"
                    alt="Nenhum investimento cadastrado"
                    className="h-full w-full object-cover select-none pointer-events-none"
                  />
                </div>
                <h4 className="mt-3 text-xs font-bold text-white">
                  Nenhum investimento cadastrado
                </h4>
                <p className="mt-1 text-[11px] text-stone-400 max-w-sm leading-relaxed">
                  Adicione seu primeiro aporte no formulário ao lado.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.06] mt-2">
                {investimentos.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 hover:bg-white/[0.02] px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white leading-tight">{item.nome}</p>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          {item.tipo} {item.instituicao ? `• ${item.instituicao}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-display text-xs font-bold text-white">
                          {brl(item.capitalInicial)}
                        </p>
                        {item.rentabilidadeAnual > 0 && (
                          <span className="text-[10px] text-emerald-400 block">
                            +{item.rentabilidadeAnual}% a.a.
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removerInvestimento(item.id)}
                        className="text-stone-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
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
    </AppShell>
  );
}
