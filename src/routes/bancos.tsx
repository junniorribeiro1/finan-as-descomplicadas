import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { cn } from "@/lib/utils";
import { brl } from "@/lib/mock-data";
import {
  Plus,
  Landmark,
  X,
  Trash2,
  Edit2,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/bancos")({
  head: () => ({
    meta: [
      { title: "Bancos — OrganizAI" },
      {
        name: "description",
        content: "Todos os seus saldos em um lugar só.",
      },
    ],
  }),
  component: Bancos,
});

interface ContaBancariaItem {
  id: string;
  banco: string;
  tipo: string;
  saldo: number;
  agencia?: string | undefined;
  conta?: string | undefined;
}

const bancosPredefinidos = [
  "Nubank",
  "Banco Inter",
  "Itaú Unibanco",
  "Bradesco",
  "Banco do Brasil",
  "Caixa Econômica",
  "Santander",
  "C6 Bank",
  "BTG Pactual",
  "Outro",
];

const tiposConta = [
  "Conta Corrente",
  "Conta Pagamento / Digital",
  "Poupança",
  "Conta Salário",
  "Conta Investimento",
];

function Bancos() {
  const [contas, setContas] = useState<ContaBancariaItem[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoSaldoId, setEditandoSaldoId] = useState<string | null>(null);
  const [novoSaldoInput, setNovoSaldoInput] = useState("");

  // Form states
  const [banco, setBanco] = useState<string>("Nubank");
  const [outroBanco, setOutroBanco] = useState("");
  const [tipo, setTipo] = useState<string>("Conta Corrente");
  const [saldo, setSaldo] = useState("");
  const [agencia, setAgencia] = useState("");
  const [numeroConta, setNumeroConta] = useState("");

  // Calculations
  const saldoTotal = contas.reduce((acc, c) => acc + c.saldo, 0);

  const handleSalvarBanco = (e: React.FormEvent) => {
    e.preventDefault();
    const nomeBanco = banco === "Outro" ? outroBanco.trim() : banco;
    if (!nomeBanco) return;

    const parsedSaldo = parseFloat(saldo.replace(/\./g, "").replace(",", ".")) || 0;

    const novaConta: ContaBancariaItem = {
      id: Date.now().toString(),
      banco: nomeBanco,
      tipo,
      saldo: parsedSaldo,
      agencia: agencia.trim() || undefined,
      conta: numeroConta.trim() || undefined,
    };

    setContas((prev) => [...prev, novaConta]);
    setSaldo("");
    setAgencia("");
    setNumeroConta("");
    setOutroBanco("");
    setModalAberto(false);
  };

  const handleAtualizarSaldo = (id: string) => {
    const parsed = parseFloat(novoSaldoInput.replace(/\./g, "").replace(",", ".")) || 0;
    setContas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, saldo: parsed } : c))
    );
    setEditandoSaldoId(null);
    setNovoSaldoInput("");
  };

  const removerConta = (id: string) => {
    setContas((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <AppShell>
      {/* 1. Cabeçalho da Página: Ícone 3D Edifício Bancário + Título/Subtítulo + Botão Novo Banco */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.5)] bg-[#1e1e1e] border border-white/10">
            <img
              src="/icons/kpi/banco-header@2x.png"
              alt="Bancos"
              className="h-full w-full object-cover select-none pointer-events-none"
            />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white leading-tight">
              Bancos
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Todos os seus saldos em um lugar só.
            </p>
          </div>
        </div>

        {/* Botão + Novo banco no cabeçalho */}
        <button
          type="button"
          onClick={() => setModalAberto(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:brightness-110 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-950/50 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          Novo banco
        </button>
      </div>

      {/* 2. Top Banner Card: SALDO TOTAL GERAL com o Edifício Bancário 3D à direita */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-6 px-7 shadow-sm relative overflow-hidden flex items-center justify-between min-h-[135px] mt-6">
        {/* Feixe de luz suave superior */}
        <div className="pointer-events-none absolute -top-12 left-1/4 h-24 w-1/2 rounded-full bg-amber-500/10 blur-2xl" />

        <div>
          <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase block">
            SALDO TOTAL GERAL
          </span>
          <span className="font-display text-3xl sm:text-4xl font-bold text-white mt-1.5 block leading-none">
            {brl(saldoTotal)}
          </span>
          <span className="text-xs text-stone-500 mt-1.5 block">
            Somatório de {contas.length} {contas.length === 1 ? "conta ativa" : "contas ativas"}
          </span>
        </div>

        {/* Artwork do Edifício Bancário 3D */}
        <div className="relative h-24 w-28 sm:h-28 sm:w-32 shrink-0 overflow-hidden flex items-center justify-end">
          <img
            src="/banco-banner-building@2x.png"
            alt="Edifício Bancário 3D"
            className="h-full w-full object-contain select-none pointer-events-none drop-shadow-[0_8px_16px_rgba(249,115,22,0.3)]"
          />
        </div>
      </div>

      {/* 3. Container Principal: Estado Vazio ou Lista de Contas */}
      {contas.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-16 min-h-[360px] flex flex-col items-center justify-center text-center mt-4 shadow-sm">
          {/* Pod com a Lupa 3D sobre pedestal metálico e partículas de ouro */}
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden shadow-xl shadow-black/80 border border-white/[0.08] bg-[#1a1a1a]">
            <img
              src="/empty-search-icon@2x.png"
              alt="Nenhum banco cadastrado"
              className="h-full w-full object-cover select-none pointer-events-none"
            />
          </div>

          <h3 className="mt-4 text-sm font-bold text-white">
            Nenhum banco cadastrado
          </h3>

          <p className="mt-1.5 text-xs text-stone-400 max-w-sm leading-relaxed">
            Clique em <span className="text-stone-300 font-semibold">"Novo banco"</span> para começar a acompanhar seus saldos.
          </p>
        </div>
      ) : (
        /* Grid de Contas Bancárias quando houver itens */
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contas.map((conta) => (
            <div
              key={conta.id}
              className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm relative overflow-hidden flex flex-col justify-between space-y-4 hover:border-white/10 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-orange-500/10 text-[#F97316] flex items-center justify-center">
                    <Landmark className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">{conta.banco}</h4>
                    <p className="text-[11px] text-stone-400 mt-0.5">{conta.tipo}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removerConta(conta.id)}
                  className="text-stone-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                  title="Excluir conta"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div>
                <span className="text-[11px] text-stone-400 block mb-1">Saldo disponível</span>
                {editandoSaldoId === conta.id ? (
                  <div className="flex items-center gap-2">
                    <div className="relative flex items-center rounded-lg border border-white/10 bg-[#1e1e1e] px-2.5 py-1 text-xs">
                      <span className="text-stone-400 mr-1">R$</span>
                      <input
                        type="text"
                        value={novoSaldoInput}
                        onChange={(e) => setNovoSaldoInput(e.target.value)}
                        className="w-24 bg-transparent text-white font-medium outline-none"
                        autoFocus
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAtualizarSaldo(conta.id)}
                      className="rounded-lg bg-[#F97316] p-1.5 text-white hover:brightness-110 cursor-pointer"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-display text-2xl font-bold text-[#34d399]">
                      {brl(conta.saldo)}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditandoSaldoId(conta.id);
                        setNovoSaldoInput(conta.saldo.toString());
                      }}
                      className="text-stone-500 hover:text-stone-300 transition-colors p-1 cursor-pointer"
                      title="Ajustar saldo"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>

              {(conta.agencia || conta.conta) && (
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[11px] text-stone-400">
                  {conta.agencia && <span>Ag: {conta.agencia}</span>}
                  {conta.conta && <span>CC: {conta.conta}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal: Novo Banco */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#151515] p-6 shadow-2xl">
            {/* Feixe de luz suave superior */}
            <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-3/4 rounded-full bg-amber-500/15 blur-xl" />

            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-[#F97316]">
                  <Landmark className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Cadastrar novo banco</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="rounded-lg p-1.5 text-stone-400 hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSalvarBanco} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                  Instituição Financeira / Banco
                </label>
                <div className="relative">
                  <select
                    value={banco}
                    onChange={(e) => setBanco(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 pr-8 text-xs text-white outline-none cursor-pointer"
                  >
                    {bancosPredefinidos.map((b) => (
                      <option key={b} value={b} className="bg-[#1e1e1e]">
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {banco === "Outro" && (
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                    Nome da instituição
                  </label>
                  <input
                    type="text"
                    placeholder="Digite o nome do banco"
                    value={outroBanco}
                    onChange={(e) => setOutroBanco(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white placeholder:text-stone-500 outline-none focus:border-orange-500/60 transition-colors"
                    required
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                  Tipo de conta
                </label>
                <div className="relative">
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 pr-8 text-xs text-white outline-none cursor-pointer"
                  >
                    {tiposConta.map((t) => (
                      <option key={t} value={t} className="bg-[#1e1e1e]">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                  Saldo atual disponível
                </label>
                <div className="relative flex items-center rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs focus-within:border-orange-500/60 transition-colors">
                  <span className="text-stone-400 font-medium mr-1.5 select-none">R$</span>
                  <input
                    type="text"
                    placeholder="0,00"
                    value={saldo}
                    onChange={(e) => setSaldo(e.target.value)}
                    className="w-full bg-transparent text-white font-medium outline-none placeholder:text-stone-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                    Agência (opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="0001"
                    value={agencia}
                    onChange={(e) => setAgencia(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white placeholder:text-stone-500 outline-none focus:border-orange-500/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                    Conta (opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="12345-6"
                    value={numeroConta}
                    onChange={(e) => setNumeroConta(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white placeholder:text-stone-500 outline-none focus:border-orange-500/60 transition-colors"
                  />
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
                  Cadastrar banco
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
