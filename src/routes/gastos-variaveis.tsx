import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { cn } from "@/lib/utils";
import { brl } from "@/lib/mock-data";
import { ChevronDown, Plus, Calendar, Trash2 } from "lucide-react";

export const Route = createFileRoute("/gastos-variaveis")({
  head: () => ({
    meta: [
      { title: "Gastos variáveis — OrganizAI" },
      { name: "description", content: "Compras avulsas · Pessoal." },
    ],
  }),
  component: GastosVariaveis,
});

interface GastoVariavelItem {
  id: string;
  descricao: string;
  valor: number;
  data: string;
  status: "Pago" | "Pendente";
  categoria: string;
  formaPagamento: string;
}

const categoriasDisponiveis = [
  "Moradia",
  "Alimentação",
  "Transporte",
  "Lazer",
  "Saúde",
  "Educação",
  "Serviços",
  "Outros",
];

function GastosVariaveis() {
  const [gastos, setGastos] = useState<GastoVariavelItem[]>([]);

  // Form states
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("13/09/2026");
  const [statusGasto, setStatusGasto] = useState<"Pago" | "Pendente">("Pago");
  const [categoria, setCategoria] = useState("Moradia");
  const [formaPagamento, setFormaPagamento] = useState("PIX");

  // Calculations
  const totalMes = gastos.reduce((acc, curr) => acc + curr.valor, 0);

  // Category leader
  const categoriaTotais = gastos.reduce((acc, g) => {
    acc[g.categoria] = (acc[g.categoria] || 0) + g.valor;
    return acc;
  }, {} as Record<string, number>);

  const liderEntry = Object.entries(categoriaTotais).sort((a, b) => b[1] - a[1])[0];
  const categoriaLider = liderEntry ? { nome: liderEntry[0], total: liderEntry[1] } : null;

  const handleSalvarGasto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim()) return;

    const parsedValor = parseFloat(valor.replace(/\./g, "").replace(",", ".")) || 0;

    const novoGasto: GastoVariavelItem = {
      id: Date.now().toString(),
      descricao: descricao.trim(),
      valor: parsedValor,
      data: data.trim() || "13/09/2026",
      status: statusGasto,
      categoria,
      formaPagamento,
    };

    setGastos((prev) => [novoGasto, ...prev]);
    setDescricao("");
    setValor("");
  };

  const alternarStatus = (id: string) => {
    setGastos((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, status: g.status === "Pago" ? "Pendente" : "Pago" }
          : g
      )
    );
  };

  const removerGasto = (id: string) => {
    setGastos((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <AppShell>
      {/* 1. Cabeçalho da Página: Ícone 3D Carteira + Título e Subtítulo */}
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
            Compras avulsas · Pessoal.
          </p>
        </div>
      </div>

      {/* 2. Top 3 Cards de Resumo (TOTAL DO MÊS, LANÇAMENTOS, CATEGORIA LÍDER) */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3 mt-6">
        {/* TOTAL DO MÊS */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
            <span className="h-2 w-2 rounded-full bg-[#FF6B6B] shadow-[0_0_8px_rgba(255,107,107,0.6)]" />
            TOTAL DO MÊS
          </div>
          <span className="font-display text-2xl font-bold text-[#FF6B6B] mt-3 block leading-none">
            {brl(totalMes)}
          </span>
          <p className="text-xs text-stone-500 mt-2">
            {gastos.length === 0
              ? "Sem histórico anterior ainda"
              : `${gastos.length} ${gastos.length === 1 ? "compra registrada" : "compras registradas"}`}
          </p>
        </div>

        {/* LANÇAMENTOS */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
            <span className="h-2 w-2 rounded-full bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            LANÇAMENTOS
          </div>
          <span className="font-display text-2xl font-bold text-[#3b82f6] mt-3 block leading-none">
            {gastos.length}
          </span>
          {gastos.length > 0 && (
            <p className="text-xs text-stone-500 mt-2">
              {gastos.filter((g) => g.status === "Pago").length} pagos
            </p>
          )}
        </div>

        {/* CATEGORIA LÍDER */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
            <span className="h-2 w-2 rounded-full bg-[#c084fc] shadow-[0_0_8px_rgba(192,132,252,0.6)]" />
            CATEGORIA LÍDER
          </div>
          <div className="mt-3">
            {categoriaLider ? (
              <div>
                <span className="font-display text-xl font-bold text-[#c084fc] block leading-none truncate">
                  {categoriaLider.nome}
                </span>
                <p className="text-xs text-stone-500 mt-2">
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
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm">
          {/* Feixe de luz suave superior */}
          <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-3/4 rounded-full bg-amber-500/10 blur-xl" />

          <span className="text-[11px] font-bold tracking-wider text-stone-400 uppercase block mb-4">
            NOVO GASTO VARIÁVEL
          </span>

          <form onSubmit={handleSalvarGasto} className="space-y-3.5">
            {/* Descrição */}
            <div>
              <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                Descrição
              </label>
              <input
                type="text"
                placeholder="Ex.: Supermercado"
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
                    placeholder="13/09/2026"
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
                Categoria
              </label>
              <div className="relative">
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 pr-8 text-xs text-white outline-none cursor-pointer"
                >
                  {categoriasDisponiveis.map((cat) => (
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
              <Plus className="h-4 w-4" /> Lançar gasto
            </button>
          </form>
        </div>

        {/* Coluna da Direita: Gastos lançados */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm min-h-[440px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3">
              <h3 className="text-xs font-bold text-white">Gastos lançados</h3>
              <span className="font-display text-xs font-bold text-[#FF6B6B]">
                {brl(totalMes)}
              </span>
            </div>

            {/* Lista de gastos se houver itens */}
            {gastos.length > 0 && (
              <div className="divide-y divide-white/[0.06] mt-2">
                {gastos.map((g) => (
                  <div
                    key={g.id}
                    className="flex items-center justify-between py-3.5 hover:bg-white/[0.02] px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-orange-500/10 text-[#F97316] flex items-center justify-center font-bold text-xs">
                        {g.categoria.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white leading-tight">{g.descricao}</p>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          {g.categoria} • {g.formaPagamento} • {g.data}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-display text-xs font-bold text-[#FF6B6B]">
                        {brl(g.valor)}
                      </span>
                      <button
                        type="button"
                        onClick={() => alternarStatus(g.id)}
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[10px] font-semibold border transition-all cursor-pointer",
                          g.status === "Pago"
                            ? "bg-emerald-950/40 border-emerald-800/40 text-emerald-400"
                            : "bg-orange-950/40 border-orange-800/40 text-orange-400"
                        )}
                      >
                        {g.status}
                      </button>
                      <button
                        type="button"
                        onClick={() => removerGasto(g.id)}
                        className="text-stone-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
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

          {/* Estado Vazio (exatamente como na imagem de referência!) */}
          {gastos.length === 0 && (
            <div className="my-auto py-12 flex flex-col items-center justify-center text-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden shadow-xl shadow-black/80 border border-white/[0.08] bg-[#1a1a1a]">
                <img
                  src="/empty-search-icon@2x.png"
                  alt="Nenhum gasto lançado"
                  className="h-full w-full object-cover select-none pointer-events-none"
                />
              </div>
              <h4 className="mt-4 text-sm font-bold text-white">
                Nenhum gasto lançado
              </h4>
              <p className="mt-1.5 text-xs text-stone-400 max-w-sm text-center leading-relaxed">
                Registre a primeira compra ao lado.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
