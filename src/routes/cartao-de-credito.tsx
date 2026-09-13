import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { cn } from "@/lib/utils";
import { brl } from "@/lib/mock-data";
import {
  Plus,
  CreditCard as CreditCardIcon,
  X,
  Trash2,
  Calendar,
  AlertCircle,
} from "lucide-react";

export const Route = createFileRoute("/cartao-de-credito")({
  head: () => ({
    meta: [
      { title: "Cartões de crédito — OrganizAI" },
      {
        name: "description",
        content: "Acompanhe o uso do limite, fatura do mês e compras parceladas.",
      },
    ],
  }),
  component: CartaoCredito,
});

interface CartaoItem {
  id: string;
  nome: string;
  ultimosDigitos: string;
  limiteTotal: number;
  faturaAtual: number;
  diaFechamento: number;
  diaVencimento: number;
  cor: string;
}

interface CompraCartaoItem {
  id: string;
  cartaoId: string;
  descricao: string;
  categoria: string;
  valor: number;
  data: string;
  parcelaAtual?: number | undefined;
  parcelasTotal?: number | undefined;
}

function CartaoCredito() {
  const [cartoes, setCartoes] = useState<CartaoItem[]>([]);
  const [cartaoSelecionadoId, setCartaoSelecionadoId] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  // Form states for new card
  const [nome, setNome] = useState("");
  const [limiteTotal, setLimiteTotal] = useState("");
  const [diaFechamento, setDiaFechamento] = useState("3");
  const [diaVencimento, setDiaVencimento] = useState("10");
  const [ultimosDigitos, setUltimosDigitos] = useState("");
  const [cor, setCor] = useState("black");

  const [compras] = useState<CompraCartaoItem[]>([]);

  const handleSalvarCartao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    const limiteNum = parseFloat(limiteTotal.replace(/\./g, "").replace(",", ".")) || 0;

    const novoCartao: CartaoItem = {
      id: Date.now().toString(),
      nome: nome.trim(),
      ultimosDigitos: ultimosDigitos.trim() || "0000",
      limiteTotal: limiteNum,
      faturaAtual: 0,
      diaFechamento: parseInt(diaFechamento) || 3,
      diaVencimento: parseInt(diaVencimento) || 10,
      cor,
    };

    setCartoes((prev) => [...prev, novoCartao]);
    setCartaoSelecionadoId(novoCartao.id);
    setNome("");
    setLimiteTotal("");
    setUltimosDigitos("");
    setModalAberto(false);
  };

  const removerCartao = (id: string) => {
    setCartoes((prev) => prev.filter((c) => c.id !== id));
    if (cartaoSelecionadoId === id) {
      setCartaoSelecionadoId(null);
    }
  };

  const cartaoAtivo = cartoes.find((c) => c.id === cartaoSelecionadoId) || cartoes[0];

  return (
    <AppShell>
      {/* 1. Cabeçalho da Página: Ícone 3D Cartão + Título e Subtítulo */}
      <div className="flex items-center gap-3.5">
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.5)] bg-[#1e1e1e] border border-white/10">
          <img
            src="/icons/kpi/cartao-header@2x.png"
            alt="Cartões de crédito"
            className="h-full w-full object-cover select-none pointer-events-none"
          />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white leading-tight">
            Cartões de crédito
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Acompanhe o uso do limite, fatura do mês e compras parceladas.
          </p>
        </div>
      </div>

      {/* 2. Container Principal (Estado Vazio fiel à imagem referência) */}
      {cartoes.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-12 min-h-[380px] flex flex-col items-center justify-center text-center mt-6 shadow-sm">
          {/* Pod com a Lupa 3D sobre pedestal metálico e partículas de ouro */}
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden shadow-xl shadow-black/80 border border-white/[0.08] bg-[#1a1a1a]">
            <img
              src="/empty-search-icon@2x.png"
              alt="Nenhum cartão cadastrado ainda"
              className="h-full w-full object-cover select-none pointer-events-none"
            />
          </div>

          <h3 className="mt-4 text-sm font-bold text-white">
            Nenhum cartão cadastrado ainda
          </h3>

          <p className="mt-1.5 text-xs text-stone-400 max-w-sm leading-relaxed">
            Cadastre seu primeiro cartão pra acompanhar limite, fatura e parcelas.
          </p>

          <button
            type="button"
            onClick={() => setModalAberto(true)}
            className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:brightness-110 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-950/50 transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Novo cartão
          </button>
        </div>
      ) : (
        /* Quando houver cartões cadastrados */
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            {/* Lista de abas de cartões */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {cartoes.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCartaoSelecionadoId(c.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer border",
                    cartaoAtivo?.id === c.id
                      ? "bg-[#F97316] text-white border-transparent shadow-md shadow-orange-950/40"
                      : "bg-[#1e1e1e] text-stone-400 border-white/[0.08] hover:text-white"
                  )}
                >
                  <CreditCardIcon className="h-3.5 w-3.5" />
                  <span>{c.nome}</span>
                  <span className="opacity-70 text-[10px]">•••• {c.ultimosDigitos}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setModalAberto(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#222] border border-white/10 hover:bg-[#2c2c2c] px-3.5 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 text-[#F97316]" />
              Adicionar outro cartão
            </button>
          </div>

          {cartaoAtivo && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[380px_minmax(0,1fr)] items-start">
              {/* Visualizador 3D do Cartão */}
              <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm space-y-4">
                <div
                  className={cn(
                    "relative overflow-hidden rounded-2xl p-6 text-white shadow-xl border border-white/10 min-h-[210px] flex flex-col justify-between",
                    cartaoAtivo.cor === "purple"
                      ? "bg-gradient-to-br from-[#4c1d95] via-[#2e1065] to-[#0f0728]"
                      : cartaoAtivo.cor === "blue"
                      ? "bg-gradient-to-br from-[#1e3a8a] via-[#172554] to-[#080d1e]"
                      : "bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#0d0d0d]"
                  )}
                >
                  {/* Sheen de luz */}
                  <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                        Cartão de crédito
                      </span>
                      <p className="font-display text-base font-bold tracking-tight mt-0.5">
                        {cartaoAtivo.nome}
                      </p>
                    </div>
                    {/* Chip dourado */}
                    <div className="h-7 w-9 rounded-md bg-gradient-to-tr from-amber-600 via-amber-300 to-amber-500 border border-amber-200/40 shadow-sm flex items-center justify-center">
                      <div className="h-3 w-5 border border-amber-900/40 rounded-sm" />
                    </div>
                  </div>

                  <div>
                    <p className="font-mono text-base tracking-[0.25em] text-stone-300">
                      •••• •••• •••• {cartaoAtivo.ultimosDigitos}
                    </p>
                  </div>

                  <div className="flex items-end justify-between text-xs text-stone-400 pt-2 border-t border-white/[0.08]">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider block text-stone-500">
                        Fechamento
                      </span>
                      <span className="font-medium text-stone-200">Dia {cartaoAtivo.diaFechamento}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider block text-stone-500">
                        Vencimento
                      </span>
                      <span className="font-medium text-stone-200">Dia {cartaoAtivo.diaVencimento}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removerCartao(cartaoAtivo.id)}
                      className="text-stone-500 hover:text-red-400 transition-colors p-1"
                      title="Excluir cartão"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Resumo de Limite */}
                <div className="rounded-xl border border-white/[0.06] bg-[#1a1a1a] p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-400">Limite Total</span>
                    <span className="font-bold text-white">{brl(cartaoAtivo.limiteTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-400">Fatura Atual</span>
                    <span className="font-bold text-[#FF6B6B]">{brl(cartaoAtivo.faturaAtual)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-400">Limite Disponível</span>
                    <span className="font-bold text-[#34d399]">
                      {brl(Math.max(0, cartaoAtivo.limiteTotal - cartaoAtivo.faturaAtual))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Fatura & Compras */}
              <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm min-h-[350px]">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                  <div>
                    <h3 className="text-xs font-bold text-white">Compras nesta fatura</h3>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Vencimento previsto para dia {cartaoAtivo.diaVencimento}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#FF6B6B]">
                    {brl(cartaoAtivo.faturaAtual)}
                  </span>
                </div>

                {compras.length === 0 ? (
                  <div className="py-16 flex flex-col items-center justify-center text-center">
                    <AlertCircle className="h-8 w-8 text-stone-600 mb-2" />
                    <p className="text-xs font-medium text-stone-300">
                      Nenhuma compra registrada nesta fatura
                    </p>
                    <p className="text-[11px] text-stone-500 mt-1 max-w-xs">
                      Suas despesas com este cartão aparecerão discriminadas aqui.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/[0.06] mt-2">
                    {compras.map((compra) => (
                      <div
                        key={compra.id}
                        className="flex items-center justify-between py-3.5 hover:bg-white/[0.02] px-2 rounded-xl transition-colors"
                      >
                        <div>
                          <p className="text-xs font-bold text-white">{compra.descricao}</p>
                          <p className="text-[11px] text-stone-400 mt-0.5">
                            {compra.categoria} • {compra.data}
                          </p>
                        </div>
                        <span className="font-display text-xs font-bold text-[#FF6B6B]">
                          {brl(compra.valor)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal: Novo Cartão de Crédito */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#151515] p-6 shadow-2xl">
            {/* Feixe de luz suave superior */}
            <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-3/4 rounded-full bg-amber-500/15 blur-xl" />

            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-[#F97316]">
                  <CreditCardIcon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Cadastrar novo cartão</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="rounded-lg p-1.5 text-stone-400 hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSalvarCartao} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                  Nome do cartão / Banco
                </label>
                <input
                  type="text"
                  placeholder="Ex.: Nubank Ultravioleta"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white placeholder:text-stone-500 outline-none focus:border-orange-500/60 transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                    Limite total
                  </label>
                  <div className="relative flex items-center rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs focus-within:border-orange-500/60 transition-colors">
                    <span className="text-stone-400 font-medium mr-1.5 select-none">R$</span>
                    <input
                      type="text"
                      placeholder="5.000,00"
                      value={limiteTotal}
                      onChange={(e) => setLimiteTotal(e.target.value)}
                      className="w-full bg-transparent text-white font-medium outline-none placeholder:text-stone-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                    Últimos 4 dígitos
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="Ex.: 8842"
                    value={ultimosDigitos}
                    onChange={(e) => setUltimosDigitos(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white placeholder:text-stone-500 outline-none focus:border-orange-500/60 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                    Dia fechamento
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={diaFechamento}
                      onChange={(e) => setDiaFechamento(e.target.value)}
                      className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500/60 transition-colors"
                      required
                    />
                    <Calendar className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                    Dia vencimento
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={diaVencimento}
                      onChange={(e) => setDiaVencimento(e.target.value)}
                      className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500/60 transition-colors"
                      required
                    />
                    <Calendar className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                  Tema visual do cartão
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCor("black")}
                    className={cn(
                      "rounded-xl border p-2 text-center text-xs font-medium transition-colors cursor-pointer",
                      cor === "black"
                        ? "border-[#F97316] bg-orange-500/10 text-white"
                        : "border-white/10 bg-[#1e1e1e] text-stone-400"
                    )}
                  >
                    Black Fosco
                  </button>
                  <button
                    type="button"
                    onClick={() => setCor("purple")}
                    className={cn(
                      "rounded-xl border p-2 text-center text-xs font-medium transition-colors cursor-pointer",
                      cor === "purple"
                        ? "border-[#F97316] bg-orange-500/10 text-white"
                        : "border-white/10 bg-[#1e1e1e] text-stone-400"
                    )}
                  >
                    Roxo Luxo
                  </button>
                  <button
                    type="button"
                    onClick={() => setCor("blue")}
                    className={cn(
                      "rounded-xl border p-2 text-center text-xs font-medium transition-colors cursor-pointer",
                      cor === "blue"
                        ? "border-[#F97316] bg-orange-500/10 text-white"
                        : "border-white/10 bg-[#1e1e1e] text-stone-400"
                    )}
                  >
                    Azul Safira
                  </button>
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
                  Salvar cartão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
