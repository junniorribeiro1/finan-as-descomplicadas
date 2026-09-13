import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { cn } from "@/lib/utils";
import { brl } from "@/lib/mock-data";
import { ChevronDown, Plus, Calendar, Trash2 } from "lucide-react";

export const Route = createFileRoute("/recebimentos")({
  head: () => ({
    meta: [
      { title: "Recebimentos — OrganizAI" },
      { name: "description", content: "Entradas · Pessoal." },
    ],
  }),
  component: Recebimentos,
});

interface RecebimentoItem {
  id: string;
  descricao: string;
  valor: number;
  data: string;
  categoria: string;
  banco?: string | undefined;
}

const categoriasDisponiveis = [
  "Salário",
  "Freelance",
  "Investimentos",
  "Pró-labore",
  "Vendas",
  "Outros",
];

const bancosDisponiveis = [
  "Selecionar",
  "Nubank",
  "Inter",
  "Itaú",
  "Bradesco",
  "Caixa",
  "Banco do Brasil",
  "Santander",
];

function Recebimentos() {
  const [recebimentos, setRecebimentos] = useState<RecebimentoItem[]>([]);
  const [filtroPeriodo, setFiltroPeriodo] = useState<"mes" | "ano" | "todos">("mes");

  // Form states
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("13/09/2026");
  const [categoria, setCategoria] = useState("Salário");
  const [banco, setBanco] = useState("Selecionar");

  // Calculations
  const totalRecebido = recebimentos.reduce((acc, curr) => acc + curr.valor, 0);
  const registros = recebimentos.length;
  const maiorRecebimento =
    recebimentos.length > 0 ? Math.max(...recebimentos.map((r) => r.valor)) : 0;
  const ticketMedio = registros > 0 ? totalRecebido / registros : 0;

  const handleSalvarRecebimento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim()) return;

    const parsedValor = parseFloat(valor.replace(/\./g, "").replace(",", ".")) || 0;

    const novoRecebimento: RecebimentoItem = {
      id: Date.now().toString(),
      descricao: descricao.trim(),
      valor: parsedValor,
      data: data.trim() || "13/09/2026",
      categoria,
      banco: banco !== "Selecionar" ? banco : undefined,
    };

    setRecebimentos((prev) => [novoRecebimento, ...prev]);
    setDescricao("");
    setValor("");
  };

  const removerRecebimento = (id: string) => {
    setRecebimentos((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <AppShell>
      {/* 1. Cabeçalho da Página: Ícone 3D Recebimentos + Título e Subtítulo */}
      <div className="flex items-center gap-3.5">
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.5)] bg-[#1e1e1e] border border-white/10">
          <img
            src="/icons/kpi/recebimentos@2x.png"
            alt="Recebimentos"
            className="h-full w-full object-cover select-none pointer-events-none"
          />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white leading-tight">
            Recebimentos
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Entradas · Pessoal.
          </p>
        </div>
      </div>

      {/* 2. Top 4 Cards de Resumo (TOTAL RECEBIDO, REGISTROS, MAIOR RECEBIMENTO, TICKET MÉDIO) */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4 mt-6">
        {/* TOTAL RECEBIDO */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
              <span className="h-2 w-2 rounded-full bg-[#34d399] shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              TOTAL RECEBIDO
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
            REGISTROS
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

      {/* 3. Filtros de Período (Pills: Este mês, Este ano, Todos) */}
      <div className="mt-4">
        <div className="inline-flex items-center gap-1 rounded-full bg-[#151515] p-1 border border-white/[0.06]">
          <button
            type="button"
            onClick={() => setFiltroPeriodo("mes")}
            className={cn(
              "rounded-full px-3.5 py-1 text-xs font-bold transition-all cursor-pointer",
              filtroPeriodo === "mes"
                ? "bg-[#F97316] text-white shadow-sm"
                : "text-stone-400 hover:text-white"
            )}
          >
            Este mês
          </button>
          <button
            type="button"
            onClick={() => setFiltroPeriodo("ano")}
            className={cn(
              "rounded-full px-3.5 py-1 text-xs font-medium transition-all cursor-pointer",
              filtroPeriodo === "ano"
                ? "bg-[#F97316] text-white font-bold shadow-sm"
                : "text-stone-400 hover:text-white"
            )}
          >
            Este ano
          </button>
          <button
            type="button"
            onClick={() => setFiltroPeriodo("todos")}
            className={cn(
              "rounded-full px-3.5 py-1 text-xs font-medium transition-all cursor-pointer",
              filtroPeriodo === "todos"
                ? "bg-[#F97316] text-white font-bold shadow-sm"
                : "text-stone-400 hover:text-white"
            )}
          >
            Todos
          </button>
        </div>
      </div>

      {/* 4. Grid Principal em 2 Colunas: Formulário na Esquerda e Histórico na Direita */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[380px_minmax(0,1fr)] mt-4 items-start">
        {/* Coluna da Esquerda: NOVO RECEBIMENTO */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm">
          {/* Feixe de luz suave superior */}
          <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-3/4 rounded-full bg-amber-500/10 blur-xl" />

          <span className="text-[11px] font-bold tracking-wider text-stone-400 uppercase block mb-4">
            NOVO RECEBIMENTO
          </span>

          <form onSubmit={handleSalvarRecebimento} className="space-y-3.5">
            {/* Descrição */}
            <div>
              <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                Descrição
              </label>
              <input
                type="text"
                placeholder="Ex.: Salário"
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

            {/* Banco (opcional) */}
            <div>
              <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                Banco (opcional)
              </label>
              <div className="relative">
                <select
                  value={banco}
                  onChange={(e) => setBanco(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 pr-8 text-xs text-white outline-none cursor-pointer"
                >
                  {bancosDisponiveis.map((b) => (
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
            <div className="flex items-center justify-between pb-3">
              <h3 className="text-xs font-bold text-white">Histórico</h3>
              <span className="rounded-full bg-white/[0.06] border border-white/10 px-2.5 py-0.5 text-[11px] text-stone-400 font-medium">
                {recebimentos.length} {recebimentos.length === 1 ? "entrada" : "entradas"}
              </span>
            </div>

            {/* Lista se houver itens */}
            {recebimentos.length > 0 && (
              <div className="divide-y divide-white/[0.06] mt-2">
                {recebimentos.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between py-3.5 hover:bg-white/[0.02] px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-[#34d399] flex items-center justify-center font-bold text-xs">
                        {r.categoria.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white leading-tight">{r.descricao}</p>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          {r.categoria} {r.banco ? `• ${r.banco}` : ""} • {r.data}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-display text-xs font-bold text-[#34d399]">
                        +{brl(r.valor)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removerRecebimento(r.id)}
                        className="text-stone-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                        title="Excluir recebimento"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Estado Vazio (exatamente como na imagem referência) */}
          {recebimentos.length === 0 && (
            <div className="my-auto py-12 flex flex-col items-center justify-center text-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden shadow-xl shadow-black/80 border border-white/[0.08] bg-[#1a1a1a]">
                <img
                  src="/empty-search-icon@2x.png"
                  alt="Sem recebimentos no período"
                  className="h-full w-full object-cover select-none pointer-events-none"
                />
              </div>
              <h4 className="mt-4 text-sm font-bold text-white">
                Sem recebimentos no período
              </h4>
              <p className="mt-1.5 text-xs text-stone-400 max-w-sm text-center leading-relaxed">
                Registre uma entrada ao lado ou troque o filtro acima.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
