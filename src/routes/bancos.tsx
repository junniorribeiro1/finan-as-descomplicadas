import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { AppShell } from "@/components/app/AppShell";
import { cn } from "@/lib/utils";
import { brl } from "@/lib/mock-data";
import {
  Plus,
  Landmark,
  X,
  Trash2,
  Edit2,
  Pencil,
  Check,
  Search,
  User,
  Building2,
  ArrowUpRight,
  Wallet,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { notificarAtualizacaoFinanceira, type ContaBancariaItem } from "@/lib/financial-service";
import { toast } from "sonner";

export const Route = createFileRoute("/bancos")({
  head: () => ({
    meta: [
      { title: "Bancos — OrganizAI" },
      {
        name: "description",
        content: "Todos os seus saldos em um lugar só · Pessoal e Empresa.",
      },
      { property: "og:title", content: "Bancos — OrganizAI" },
    ],
  }),
  component: Bancos,
});

const BANCOS_PREDEFINIDOS = [
  "Nubank",
  "Banco Inter",
  "Itaú Unibanco",
  "Bradesco",
  "Banco do Brasil",
  "Caixa Econômica",
  "Santander",
  "C6 Bank",
  "BTG Pactual",
  "Cora",
  "Mercado Pago",
  "Outro",
];

const TIPOS_CONTA_PESSOAL = [
  "Conta Corrente",
  "Conta Pagamento / Digital",
  "Poupança",
  "Conta Salário",
  "Conta Investimento",
  "Outro",
];

const TIPOS_CONTA_EMPRESA = [
  "Conta Corrente PJ",
  "Conta Digital PJ",
  "Conta Pagamento PJ",
  "Aplicação / CDB Automático PJ",
  "Conta Garantida PJ",
  "Outro",
];

function Bancos() {
  const { user } = useAuth();
  const [contas, setContas] = useState<ContaBancariaItem[]>([]);
  const [carregando, setCarregando] = useState(true);

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

  // Modais
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [contaEditando, setContaEditando] = useState<ContaBancariaItem | null>(null);
  const [editandoSaldoId, setEditandoSaldoId] = useState<string | null>(null);
  const [novoSaldoInput, setNovoSaldoInput] = useState("");

  // Form states para NOVO banco
  const [banco, setBanco] = useState<string>("Nubank");
  const [outroBanco, setOutroBanco] = useState("");
  const [tipo, setTipo] = useState<string>("Conta Corrente");
  const [saldo, setSaldo] = useState("");
  const [agencia, setAgencia] = useState("");
  const [numeroConta, setNumeroConta] = useState("");

  // Form states para EDIÇÃO completa
  const [editBanco, setEditBanco] = useState("");
  const [editOutroBanco, setEditOutroBanco] = useState("");
  const [editTipo, setEditTipo] = useState("");
  const [editSaldo, setEditSaldo] = useState("");
  const [editAgencia, setEditAgencia] = useState("");
  const [editNumeroConta, setEditNumeroConta] = useState("");

  // Filtros
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [busca, setBusca] = useState("");

  const tiposAtivos =
    tipoConta === "pessoal" ? TIPOS_CONTA_PESSOAL : TIPOS_CONTA_EMPRESA;

  // Ajusta o tipo padrão ao alternar tipoConta
  useEffect(() => {
    const tipos = tipoConta === "pessoal" ? TIPOS_CONTA_PESSOAL : TIPOS_CONTA_EMPRESA;
    setTipo(tipos[0] || "Conta Corrente");
  }, [tipoConta]);

  // Carregar contas do usuário do Supabase
  useEffect(() => {
    if (!user?.id) return;

    let cancelado = false;

    const carregar = async () => {
      try {
        setCarregando(true);
        const { data: bData, error } = await supabase
          .from("bancos_contas")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!cancelado && !error && bData) {
          setContas(
            bData.map((b: any) => ({
              id: b.id,
              user_id: b.user_id,
              banco: b.banco,
              tipo: b.tipo,
              saldo: Number(b.saldo) || 0,
              agencia: b.agencia,
              conta: b.conta,
              tipoConta: (b.tipo_conta as "pessoal" | "empresa") || "pessoal",
              created_at: b.created_at,
            }))
          );
        }
      } catch (err) {
        console.error("Erro ao carregar bancos:", err);
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
  const contasPorConta = useMemo(() => {
    return contas.filter((c) => (c.tipoConta || "pessoal") === tipoConta);
  }, [contas, tipoConta]);

  // Aplica filtro de tipo e busca em tempo real
  const listaVisivel = useMemo(() => {
    return contasPorConta.filter((c) => {
      if (filtroTipo !== "todos" && c.tipo !== filtroTipo) return false;

      if (busca.trim()) {
        const termo = busca.toLowerCase();
        const noBanco = c.banco.toLowerCase().includes(termo);
        const noTipo = c.tipo.toLowerCase().includes(termo);
        const naAgencia = c.agencia?.toLowerCase().includes(termo) || false;
        const naConta = c.conta?.toLowerCase().includes(termo) || false;
        return noBanco || noTipo || naAgencia || naConta;
      }
      return true;
    });
  }, [contasPorConta, filtroTipo, busca]);

  // Cálculos do Banner e Top KPIs
  const saldoTotal = useMemo(() => {
    return contasPorConta.reduce((acc, c) => acc + c.saldo, 0);
  }, [contasPorConta]);

  const contaMaiorSaldo = useMemo(() => {
    if (contasPorConta.length === 0) return null;
    return [...contasPorConta].sort((a, b) => b.saldo - a.saldo)[0];
  }, [contasPorConta]);

  // Cadastrar Novo Banco
  const handleSalvarBanco = async (e: React.FormEvent) => {
    e.preventDefault();
    const nomeBanco = banco === "Outro" ? outroBanco.trim() : banco;
    if (!nomeBanco) {
      toast.error("Informe o nome do banco.");
      return;
    }

    const parsedSaldo = parseFloat(saldo.replace(/\./g, "").replace(",", ".")) || 0;

    const novaContaTemp: ContaBancariaItem = {
      id: "temp-" + Date.now(),
      user_id: user?.id,
      banco: nomeBanco,
      tipo,
      saldo: parsedSaldo,
      agencia: agencia.trim() || undefined,
      conta: numeroConta.trim() || undefined,
      tipoConta,
    };

    setContas((prev) => [novaContaTemp, ...prev]);
    setSaldo("");
    setAgencia("");
    setNumeroConta("");
    setOutroBanco("");
    setModalNovoAberto(false);

    try {
      if (user?.id) {
        const { data: inserted, error } = await supabase
          .from("bancos_contas")
          .insert({
            user_id: user.id,
            banco: novaContaTemp.banco,
            tipo: novaContaTemp.tipo,
            saldo: novaContaTemp.saldo,
            agencia: novaContaTemp.agencia,
            conta: novaContaTemp.conta,
            tipo_conta: tipoConta,
          })
          .select()
          .single();

        if (!error && inserted) {
          setContas((prev) =>
            prev.map((item) =>
              item.id === novaContaTemp.id
                ? {
                    id: inserted.id,
                    user_id: inserted.user_id,
                    banco: inserted.banco,
                    tipo: inserted.tipo,
                    saldo: Number(inserted.saldo) || 0,
                    agencia: inserted.agencia,
                    conta: inserted.conta,
                    tipoConta: (inserted.tipo_conta as "pessoal" | "empresa") || "pessoal",
                    created_at: inserted.created_at,
                  }
                : item
            )
          );
          toast.success(`Conta do ${novaContaTemp.banco} cadastrada com sucesso!`);
        } else if (error) {
          console.error("Erro ao salvar banco:", error);
          toast.error("Erro ao salvar no banco. Guardado localmente.");
        }
      }
      notificarAtualizacaoFinanceira();
    } catch {
      toast.error("Erro ao salvar conta bancária.");
    }
  };

  // Atualização Rápida de Saldo
  const handleAtualizarSaldo = async (id: string) => {
    const parsed = parseFloat(novoSaldoInput.replace(/\./g, "").replace(",", ".")) || 0;
    setContas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, saldo: parsed } : c))
    );
    setEditandoSaldoId(null);
    setNovoSaldoInput("");

    try {
      if (user?.id && !id.startsWith("temp-")) {
        await supabase
          .from("bancos_contas")
          .update({ saldo: parsed })
          .eq("id", id)
          .eq("user_id", user.id);
      }
      notificarAtualizacaoFinanceira();
      toast.success("Saldo atualizado com sucesso!");
    } catch {
      toast.error("Erro ao salvar novo saldo.");
    }
  };

  // Abrir Modal de Edição Completa
  const abrirEdicao = (conta: ContaBancariaItem) => {
    setContaEditando(conta);
    const isOutro = !BANCOS_PREDEFINIDOS.includes(conta.banco);
    setEditBanco(isOutro ? "Outro" : conta.banco);
    setEditOutroBanco(isOutro ? conta.banco : "");
    setEditTipo(conta.tipo);
    setEditSaldo(conta.saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 }));
    setEditAgencia(conta.agencia || "");
    setEditNumeroConta(conta.conta || "");
  };

  // Salvar Edição Completa
  const handleSalvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contaEditando) return;

    const nomeBanco = editBanco === "Outro" ? editOutroBanco.trim() : editBanco;
    if (!nomeBanco) {
      toast.error("Informe o nome do banco.");
      return;
    }

    const parsedSaldo = parseFloat(editSaldo.replace(/\./g, "").replace(",", ".")) || 0;

    const atualizado: ContaBancariaItem = {
      ...contaEditando,
      banco: nomeBanco,
      tipo: editTipo,
      saldo: parsedSaldo,
      agencia: editAgencia.trim() || undefined,
      conta: editNumeroConta.trim() || undefined,
    };

    setContas((prev) =>
      prev.map((c) => (c.id === contaEditando.id ? atualizado : c))
    );
    setContaEditando(null);

    try {
      if (user?.id && !contaEditando.id.startsWith("temp-")) {
        await supabase
          .from("bancos_contas")
          .update({
            banco: atualizado.banco,
            tipo: atualizado.tipo,
            saldo: atualizado.saldo,
            agencia: atualizado.agencia,
            conta: atualizado.conta,
          })
          .eq("id", contaEditando.id)
          .eq("user_id", user.id);
      }
      notificarAtualizacaoFinanceira();
      toast.success("Conta atualizada com sucesso!");
    } catch {
      toast.error("Erro ao salvar alterações no banco.");
    }
  };

  // Excluir Conta
  const removerConta = async (id: string) => {
    setContas((prev) => prev.filter((c) => c.id !== id));
    try {
      if (user?.id && !id.startsWith("temp-")) {
        await supabase.from("bancos_contas").delete().eq("id", id).eq("user_id", user.id);
      }
      notificarAtualizacaoFinanceira();
      toast.info("Conta removida com sucesso.");
    } catch {
      toast.error("Erro ao excluir conta.");
    }
  };

  return (
    <AppShell>
      {/* Modal: Editar Conta Bancária Completa */}
      {contaEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#151515] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-[#F97316]">
                  <Pencil className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Editar conta bancária</h3>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    {tipoConta === "pessoal" ? "Conta Pessoal" : "Conta Empresarial / PJ"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setContaEditando(null)}
                className="rounded-lg p-1.5 text-stone-400 hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSalvarEdicao} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                  Instituição Financeira / Banco
                </label>
                <select
                  value={editBanco}
                  onChange={(e) => setEditBanco(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white outline-none cursor-pointer"
                >
                  {BANCOS_PREDEFINIDOS.map((b) => (
                    <option key={b} value={b} className="bg-[#1e1e1e]">
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {editBanco === "Outro" && (
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                    Nome da instituição
                  </label>
                  <input
                    type="text"
                    value={editOutroBanco}
                    onChange={(e) => setEditOutroBanco(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500/60"
                    required
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                  Tipo de conta
                </label>
                <select
                  value={editTipo}
                  onChange={(e) => setEditTipo(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white outline-none cursor-pointer"
                >
                  {tiposAtivos.map((t) => (
                    <option key={t} value={t} className="bg-[#1e1e1e]">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                  Saldo disponível
                </label>
                <div className="relative flex items-center rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs focus-within:border-orange-500/60 transition-colors">
                  <span className="text-stone-400 font-medium mr-1.5 select-none">R$</span>
                  <input
                    type="text"
                    value={editSaldo}
                    onChange={(e) => setEditSaldo(e.target.value)}
                    className="w-full bg-transparent text-white font-medium outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                    Agência
                  </label>
                  <input
                    type="text"
                    value={editAgencia}
                    onChange={(e) => setEditAgencia(e.target.value)}
                    placeholder="0001"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500/60"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1.5 block">
                    Conta
                  </label>
                  <input
                    type="text"
                    value={editNumeroConta}
                    onChange={(e) => setEditNumeroConta(e.target.value)}
                    placeholder="12345-6"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500/60"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setContaEditando(null)}
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

      {/* Modal: Novo Banco */}
      {modalNovoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#151515] p-6 shadow-2xl">
            <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-3/4 rounded-full bg-amber-500/15 blur-xl" />

            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-[#F97316]">
                  <Landmark className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Cadastrar novo banco</h3>
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
                    {BANCOS_PREDEFINIDOS.map((b) => (
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
                    {tiposAtivos.map((t) => (
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
                  onClick={() => setModalNovoAberto(false)}
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

      {/* 1. Cabeçalho da Página com Toggle Pessoal / Empresa Integrado */}
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
              Todos os seus saldos em um lugar só —{" "}
              <span className="font-semibold text-stone-200">
                {tipoConta === "pessoal" ? "Pessoal" : "Empresa / PJ"}
              </span>
              .
            </p>
          </div>
        </div>

        {/* Botão Novo Banco */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setModalNovoAberto(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:brightness-110 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-950/50 transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Novo banco
          </button>
        </div>
      </div>

      {/* 2. Top Banner Card e KPIs de Saldos */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 mt-6">
        {/* Banner Principal: SALDO TOTAL GERAL */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-6 px-7 shadow-sm relative overflow-hidden flex items-center justify-between min-h-[140px]">
          <div className="pointer-events-none absolute -top-12 left-1/4 h-28 w-1/2 rounded-full bg-amber-500/10 blur-2xl" />

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase block">
                SALDO TOTAL GERAL ({tipoConta.toUpperCase()})
              </span>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                Disponível
              </span>
            </div>
            <span
              className={cn(
                "font-display text-3xl sm:text-4xl font-bold mt-2 block leading-none",
                saldoTotal >= 0 ? "text-white" : "text-red-400"
              )}
            >
              {brl(saldoTotal)}
            </span>
            <span className="text-xs text-stone-400 mt-1.5 block">
              Somatório de {contasPorConta.length}{" "}
              {contasPorConta.length === 1 ? "conta ativa" : "contas ativas"} em {tipoConta === "pessoal" ? "Pessoal" : "Empresa"}
            </span>
          </div>

          <div className="relative h-24 w-28 sm:h-28 sm:w-32 shrink-0 overflow-hidden flex items-center justify-end">
            <img
              src="/banco-banner-building@2x.png"
              alt="Edifício Bancário 3D"
              className="h-full w-full object-contain select-none pointer-events-none drop-shadow-[0_8px_16px_rgba(249,115,22,0.3)]"
            />
          </div>
        </div>

        {/* Mini KPIs de Apoio */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-4 flex flex-col justify-between">
            <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase">
              CONTAS ATIVAS
            </span>
            <div>
              <span className="font-display text-2xl font-bold text-white block">
                {contasPorConta.length}
              </span>
              <span className="text-[10px] text-stone-500 mt-0.5 block">
                {tipoConta === "pessoal" ? "Pessoa Física" : "Pessoa Jurídica"}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-4 flex flex-col justify-between">
            <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase truncate">
              MAIOR SALDO
            </span>
            <div>
              <span className="font-display text-lg font-bold text-emerald-400 block truncate">
                {contaMaiorSaldo ? brl(contaMaiorSaldo.saldo) : "R$ 0,00"}
              </span>
              <span className="text-[10px] text-stone-400 mt-0.5 block truncate">
                {contaMaiorSaldo ? contaMaiorSaldo.banco : "Nenhum"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Barra de Controles: Filtro de Tipos + Busca */}
      <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Pills de Tipos */}
        <div className="inline-flex items-center gap-1 rounded-full bg-[#151515] p-1 border border-white/[0.06] self-start overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setFiltroTipo("todos")}
            className={cn(
              "rounded-full px-3.5 py-1 text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
              filtroTipo === "todos"
                ? "bg-[#F97316] text-white shadow-sm shadow-orange-950/40"
                : "text-stone-400 hover:text-white"
            )}
          >
            Todas ({contasPorConta.length})
          </button>
          {tiposAtivos.slice(0, 3).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFiltroTipo(t)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer whitespace-nowrap",
                filtroTipo === t
                  ? "bg-[#F97316] text-white font-bold shadow-sm shadow-orange-950/40"
                  : "text-stone-400 hover:text-white"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Campo de Busca Rápida */}
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-500" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar conta ou banco..."
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

      {/* 4. Container Principal: Estado Vazio ou Grid de Contas */}
      {listaVisivel.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-16 min-h-[340px] flex flex-col items-center justify-center text-center mt-4 shadow-sm">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden shadow-xl shadow-black/80 border border-white/[0.08] bg-[#1a1a1a]">
            <img
              src="/empty-search-icon@2x.png"
              alt="Nenhum banco cadastrado"
              className="h-full w-full object-cover select-none pointer-events-none"
            />
          </div>

          <h3 className="mt-4 text-sm font-bold text-white">
            {busca
              ? "Nenhum banco encontrado na busca"
              : `Nenhum banco cadastrado em ${tipoConta === "pessoal" ? "Pessoal" : "Empresa"}`}
          </h3>

          <p className="mt-1.5 text-xs text-stone-400 max-w-sm leading-relaxed">
            {busca
              ? "Tente buscar por outro termo ou limpe a busca."
              : `Clique em "Novo banco" para cadastrar sua primeira conta ${tipoConta === "pessoal" ? "pessoal" : "empresarial"}.`}
          </p>

          {!busca && (
            <button
              type="button"
              onClick={() => setModalNovoAberto(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#F97316] to-[#EA580C] px-5 py-2 text-xs font-bold text-white shadow-lg shadow-orange-950/50 hover:brightness-110 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Cadastrar banco
            </button>
          )}
        </div>
      ) : (
        /* Grid de Contas Bancárias */
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listaVisivel.map((conta) => (
            <div
              key={conta.id}
              className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm relative overflow-hidden flex flex-col justify-between space-y-4 hover:border-white/10 transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-orange-500/10 text-[#F97316] flex items-center justify-center shrink-0 border border-orange-500/20">
                    <Landmark className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white leading-tight truncate">
                      {conta.banco}
                    </h4>
                    <p className="text-[11px] text-stone-400 mt-0.5 truncate">{conta.tipo}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => abrirEdicao(conta)}
                    className="text-stone-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/[0.05] cursor-pointer"
                    title="Editar conta"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removerConta(conta.id)}
                    className="text-stone-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-white/[0.05] cursor-pointer"
                    title="Excluir conta"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-stone-400 block mb-1">Saldo disponível</span>
                {editandoSaldoId === conta.id ? (
                  <div className="flex items-center gap-2">
                    <div className="relative flex items-center rounded-lg border border-white/10 bg-[#1e1e1e] px-2.5 py-1 text-xs">
                      <span className="text-stone-400 mr-1 select-none">R$</span>
                      <input
                        type="text"
                        value={novoSaldoInput}
                        onChange={(e) => setNovoSaldoInput(e.target.value)}
                        className="w-28 bg-transparent text-white font-medium outline-none"
                        autoFocus
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAtualizarSaldo(conta.id)}
                      className="rounded-lg bg-[#F97316] p-1.5 text-white hover:brightness-110 cursor-pointer"
                      title="Confirmar saldo"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditandoSaldoId(null)}
                      className="rounded-lg bg-white/[0.05] p-1.5 text-stone-400 hover:text-white cursor-pointer"
                      title="Cancelar"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "font-display text-2xl font-bold",
                        conta.saldo >= 0 ? "text-[#34d399]" : "text-red-400"
                      )}
                    >
                      {brl(conta.saldo)}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditandoSaldoId(conta.id);
                        setNovoSaldoInput(
                          conta.saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
                        );
                      }}
                      className="text-stone-500 hover:text-stone-300 transition-colors p-1 cursor-pointer rounded hover:bg-white/[0.05]"
                      title="Ajustar saldo rápido"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[11px] text-stone-400">
                <div className="flex items-center gap-3">
                  {conta.agencia ? <span>Ag: {conta.agencia}</span> : <span>Sem agência</span>}
                  {conta.conta ? <span>CC: {conta.conta}</span> : null}
                </div>
                <span className="text-[10px] text-stone-500 uppercase font-medium">
                  {conta.tipoConta || "pessoal"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
