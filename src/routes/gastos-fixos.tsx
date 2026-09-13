import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { cn } from "@/lib/utils";
import { brl } from "@/lib/mock-data";
import { ChevronDown, Plus, Tag } from "lucide-react";

export const Route = createFileRoute("/gastos-fixos")({
  head: () => ({
    meta: [
      { title: "Gastos fixos — OrganizaMais+" },
      { name: "description", content: "Contas recorrentes - Pessoal." },
    ],
  }),
  component: GastosFixos,
});

interface GastoFixoItem {
  id: string;
  nome: string;
  valor: number;
  diaVenc: number;
  status: "Pendente" | "Pago";
  categoria: string;
  formaPagamento: string;
  ativo: boolean;
  observacao?: string | undefined;
}

function GastosFixos() {
  const [gastos, setGastos] = useState<GastoFixoItem[]>([]);

  // Form states
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [diaVenc, setDiaVenc] = useState("5");
  const [statusGasto, setStatusGasto] = useState<"Pendente" | "Pago">("Pendente");
  const [categoria, setCategoria] = useState("Moradia");
  const [formaPagamento, setFormaPagamento] = useState("Boleto");
  const [ativo, setAtivo] = useState(true);
  const [observacao, setObservacao] = useState("");

  // Categories list
  const [categorias, setCategorias] = useState([
    "Moradia",
    "Serviços",
    "Saúde",
    "Lazer",
    "Alimentação",
    "Transporte",
    "Educação",
    "Outros",
  ]);
  const [novaCategoria, setNovaCategoria] = useState("");

  // Calculations
  const gastosAtivos = gastos.filter((g) => g.ativo);
  const totalMes = gastosAtivos.reduce((acc, curr) => acc + curr.valor, 0);
  const totalPagos = gastosAtivos
    .filter((g) => g.status === "Pago")
    .reduce((acc, curr) => acc + curr.valor, 0);
  const totalPendentes = totalMes - totalPagos;
  const pctPago = totalMes > 0 ? Math.round((totalPagos / totalMes) * 100) : 0;
  const pctPendente = totalMes > 0 ? 100 - pctPago : 0;

  const handleSalvarGasto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    const parsedValor = parseFloat(valor.replace(/\./g, "").replace(",", ".")) || 0;

    const novoGasto: GastoFixoItem = {
      id: Date.now().toString(),
      nome: nome.trim(),
      valor: parsedValor,
      diaVenc: parseInt(diaVenc) || 5,
      status: statusGasto,
      categoria,
      formaPagamento,
      ativo,
      observacao: observacao.trim() || undefined,
    };

    setGastos((prev) => [novoGasto, ...prev]);
    setNome("");
    setValor("");
    setObservacao("");
  };

  const handleCriarCategoria = () => {
    if (!novaCategoria.trim()) return;
    if (!categorias.includes(novaCategoria.trim())) {
      setCategorias((prev) => [...prev, novaCategoria.trim()]);
      setCategoria(novaCategoria.trim());
    }
    setNovaCategoria("");
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

  return (
    <AppShell>
      {/* 1. Cabeçalho da Página: Ícone 3D Carteira + Título e Subtítulo */}
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
            Contas recorrentes - Pessoal.
          </p>
        </div>
      </div>

      {/* 2. Top 3 Cards de Resumo (TOTAL DO MÊS, PAGOS, PENDENTES) */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3 mt-6">
        {/* TOTAL DO MÊS */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-stone-400 uppercase">
            <span className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            TOTAL DO MÊS
          </div>
          <span className="font-display text-2xl font-bold text-white mt-3 block leading-none">
            {brl(totalMes)}
          </span>
          <p className="text-xs text-stone-400 mt-2">
            {gastos.length} {gastos.length === 1 ? "lançamento ativo" : "lançamentos ativos"}
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
          <div className="mt-7">
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
            PAGO VS TOTAL DO MÊS
          </span>
          <span className="text-xs font-bold text-stone-200">
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
            {/* Feixe de luz suave superior */}
            <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-3/4 rounded-full bg-amber-500/10 blur-xl" />

            <span className="text-[11px] font-bold tracking-wider text-stone-400 uppercase block mb-4">
              NOVO GASTO FIXO
            </span>

            <form onSubmit={handleSalvarGasto} className="space-y-3.5">
              {/* Nome */}
              <div>
                <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                  Nome
                </label>
                <input
                  type="text"
                  placeholder="Ex.: Aluguel"
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
                  Categoria
                </label>
                <div className="relative">
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 pr-8 text-xs text-white outline-none cursor-pointer"
                  >
                    {categorias.map((cat) => (
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
                    Aparece na lista mensal
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
                <Plus className="h-3.5 w-3.5" /> Salvar gasto fixo
              </button>
            </form>
          </div>

          {/* Card: Nova categoria (Pessoal) */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-200 mb-3">
              <Tag className="h-3.5 w-3.5 text-[#F97316]" /> Nova categoria (Pessoal)
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Nome da categoria"
                value={novaCategoria}
                onChange={(e) => setNovaCategoria(e.target.value)}
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
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-6 shadow-sm min-h-[580px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Lista de gastos fixos</h3>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Toque no status pra alternar pago/pendente
                </p>
              </div>
              <span className="rounded-full bg-white/[0.06] border border-white/10 px-3 py-1 text-[11px] font-medium text-stone-300">
                {gastos.length} {gastos.length === 1 ? "item" : "itens"}
              </span>
            </div>

            {/* Se houver itens na lista */}
            {gastos.length > 0 && (
              <div className="divide-y divide-white/[0.06] mt-2">
                {gastos.map((g) => (
                  <div
                    key={g.id}
                    className="flex items-center justify-between py-3.5 hover:bg-white/[0.02] px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-orange-500/10 text-[#F97316] flex items-center justify-center font-bold text-xs">
                        {g.diaVenc}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white leading-tight">{g.nome}</p>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          {g.categoria} • {g.formaPagamento}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-display text-xs font-bold text-white">
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Estado Vazio (exatamente como na imagem de referência!) */}
          {gastos.length === 0 && (
            <div className="my-auto py-16 flex flex-col items-center justify-center text-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden shadow-xl shadow-black/80 border border-white/[0.08] bg-[#1a1a1a]">
                <img
                  src="/cofrinho-icon.png"
                  alt="Nenhum gasto fixo por aqui"
                  className="h-full w-full object-cover select-none pointer-events-none"
                />
              </div>
              <h4 className="mt-4 text-sm font-bold text-white">
                Nenhum gasto fixo por aqui
              </h4>
              <p className="mt-1.5 text-xs text-stone-400 max-w-sm text-center leading-relaxed">
                Cadastre o primeiro no formulário ao lado — aluguel, internet, streaming, o que for.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
