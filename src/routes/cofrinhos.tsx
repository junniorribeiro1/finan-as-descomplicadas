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
  PiggyBank,
  X,
  Trash2,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/cofrinhos")({
  head: () => ({
    meta: [
      { title: "Cofrinhos — OrganizAI" },
      {
        name: "description",
        content:
          "Poupe para objetivos específicos. Reserva de emergência, viagens, presentes e muito mais.",
      },
    ],
  }),
  component: Cofrinhos,
});

interface CofrinhoItem {
  id: string;
  nome: string;
  valorObjetivo: number;
  valorAtual: number;
  prazo?: string | undefined;
  cor: string;
}

function Cofrinhos() {
  const { user } = useAuth();
  const [cofrinhos, setCofrinhos] = useState<CofrinhoItem[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalAporteId, setModalAporteId] = useState<string | null>(null);
  const [valorAporte, setValorAporte] = useState("");

  // Form states for new piggy bank
  const [nome, setNome] = useState("");
  const [valorObjetivo, setValorObjetivo] = useState("");
  const [valorAtual, setValorAtual] = useState("");
  const [prazo, setPrazo] = useState("");
  const [cor, setCor] = useState("orange");

  useEffect(() => {
    if (!user?.id) return;

    const carregar = async () => {
      try {
        setCarregando(true);
        const { data, error } = await supabase
          .from("cofrinhos")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!error && data) {
          setCofrinhos(
            data.map((c: any) => ({
              id: c.id,
              nome: c.titulo,
              valorObjetivo: Number(c.meta_valor) || 0,
              valorAtual: Number(c.valor_atual) || 0,
              prazo: c.prazo || undefined,
              cor: "orange",
            }))
          );
        }
      } catch (err) {
        console.error("Erro ao carregar cofrinhos:", err);
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, [user?.id]);

  // Calculations
  const totalPoupado = cofrinhos.reduce((acc, c) => acc + c.valorAtual, 0);
  const totalObjetivos = cofrinhos.reduce((acc, c) => acc + c.valorObjetivo, 0);

  const handleCriarCofrinho = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    const parsedObjetivo = parseFloat(valorObjetivo.replace(/\./g, "").replace(",", ".")) || 0;
    const parsedAtual = parseFloat(valorAtual.replace(/\./g, "").replace(",", ".")) || 0;

    const novoTemp: CofrinhoItem = {
      id: "temp-" + Date.now(),
      nome: nome.trim(),
      valorObjetivo: parsedObjetivo,
      valorAtual: parsedAtual,
      prazo: prazo.trim() || undefined,
      cor,
    };

    setCofrinhos((prev) => [novoTemp, ...prev]);
    setNome("");
    setValorObjetivo("");
    setValorAtual("");
    setPrazo("");
    setModalAberto(false);

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
          })
          .select()
          .single();

        if (error) {
          toast.error("Erro ao salvar no banco. Guardado localmente.");
        } else if (data) {
          setCofrinhos((prev) =>
            prev.map((c) => (c.id === novoTemp.id ? { ...c, id: data.id } : c))
          );
          toast.success("Cofrinho criado com sucesso!");
        }
        notificarAtualizacaoFinanceira();
      } catch (err) {
        console.error("Erro ao criar cofrinho:", err);
      }
    }
  };

  const handleAporte = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalAporteId) return;

    const quantia = parseFloat(valorAporte.replace(/\./g, "").replace(",", ".")) || 0;
    if (quantia <= 0) return;

    const cofreAlvo = cofrinhos.find((c) => c.id === modalAporteId);
    const novoValor = (cofreAlvo?.valorAtual || 0) + quantia;

    setCofrinhos((prev) =>
      prev.map((c) =>
        c.id === modalAporteId
          ? { ...c, valorAtual: novoValor }
          : c
      )
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

        toast.success(`Aporte de ${brl(quantia)} adicionado!`);
        notificarAtualizacaoFinanceira();
      } catch (err) {
        console.error("Erro ao atualizar aporte:", err);
      }
    }
  };

  const removerCofrinho = async (id: string) => {
    setCofrinhos((prev) => prev.filter((c) => c.id !== id));

    if (user?.id && !id.startsWith("temp-")) {
      try {
        await supabase.from("cofrinhos").delete().eq("id", id).eq("user_id", user.id);
        toast.success("Cofrinho removido!");
        notificarAtualizacaoFinanceira();
      } catch (err) {
        console.error("Erro ao remover cofrinho:", err);
      }
    }
  };

  return (
    <AppShell>
      {/* 1. Cabeçalho da Página: Ícone 3D Porquinho + Título/Subtítulo + Botão Novo Cofrinho */}
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
              Poupe para objetivos específicos. Reserva de emergência, viagens, presentes e muito mais.
            </p>
          </div>
        </div>

        {/* Botão + Novo cofrinho no cabeçalho */}
        <button
          type="button"
          onClick={() => setModalAberto(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:brightness-110 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-950/50 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          Novo cofrinho
        </button>
      </div>

      {/* 2. Top Banner Card: TOTAL POUPADO com o Porquinho 3D à direita */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-6 px-7 shadow-sm relative overflow-hidden flex items-center justify-between min-h-[135px] mt-6">
        {/* Feixe de luz suave superior */}
        <div className="pointer-events-none absolute -top-12 left-1/4 h-24 w-1/2 rounded-full bg-amber-500/10 blur-2xl" />

        <div>
          <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase block">
            TOTAL POUPADO
          </span>
          <span className="font-display text-3xl sm:text-4xl font-bold text-white mt-1.5 block leading-none">
            {brl(totalPoupado)}
          </span>
          <span className="text-xs text-stone-500 mt-1.5 block">
            de {brl(totalObjetivos)} em objetivos
          </span>
        </div>

        {/* Artwork do Cofrinho 3D com brilho âmbar */}
        <div className="relative h-24 w-28 sm:h-28 sm:w-32 shrink-0 overflow-hidden flex items-center justify-end">
          <img
            src="/cofrinho-banner-pig@2x.png"
            alt="Cofrinho 3D"
            className="h-full w-full object-cover object-left select-none pointer-events-none drop-shadow-[0_8px_16px_rgba(249,115,22,0.3)]"
          />
        </div>
      </div>

      {/* 3. Container Principal: Estado Vazio ou Lista de Cofrinhos */}
      {cofrinhos.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-16 min-h-[360px] flex flex-col items-center justify-center text-center mt-4 shadow-sm">
          {/* Pod com a Lupa 3D sobre pedestal metálico e partículas de ouro */}
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden shadow-xl shadow-black/80 border border-white/[0.08] bg-[#1a1a1a]">
            <img
              src="/empty-search-icon@2x.png"
              alt="Nenhum cofrinho criado"
              className="h-full w-full object-cover select-none pointer-events-none"
            />
          </div>

          <h3 className="mt-4 text-sm font-bold text-white">
            Nenhum cofrinho criado
          </h3>

          <p className="mt-1.5 text-xs text-stone-400 max-w-sm leading-relaxed">
            Clique em <span className="text-stone-300 font-semibold">"Novo cofrinho"</span> para criar sua primeira meta de poupança.
          </p>
        </div>
      ) : (
        /* Grid de Cofrinhos quando houver itens */
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cofrinhos.map((meta) => {
            const pct = meta.valorObjetivo > 0 ? Math.min(100, Math.round((meta.valorAtual / meta.valorObjetivo) * 100)) : 0;
            return (
              <div
                key={meta.id}
                className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm relative overflow-hidden flex flex-col justify-between space-y-4 hover:border-white/10 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-orange-500/10 text-[#F97316] flex items-center justify-center">
                      <PiggyBank className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">{meta.nome}</h4>
                      {meta.prazo && (
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          Prazo: {meta.prazo}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="rounded-full bg-white/[0.06] border border-white/10 px-2.5 py-0.5 text-[11px] font-bold text-stone-300">
                    {pct}%
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline justify-between text-xs mb-1.5">
                    <span className="text-stone-400">Poupado</span>
                    <span className="font-bold text-white font-display">
                      {brl(meta.valorAtual)} / <span className="text-stone-500">{brl(meta.valorObjetivo)}</span>
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/[0.07] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#F97316] to-[#EA580C] transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setModalAporteId(meta.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#F97316] hover:text-orange-400 transition-colors cursor-pointer"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" /> Guardar dinheiro
                  </button>
                  <button
                    type="button"
                    onClick={() => removerCofrinho(meta.id)}
                    className="text-stone-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                    title="Excluir cofrinho"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Novo Cofrinho */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#151515] p-6 shadow-2xl">
            {/* Feixe de luz suave superior */}
            <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-3/4 rounded-full bg-amber-500/15 blur-xl" />

            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-[#F97316]">
                  <PiggyBank className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Criar novo cofrinho</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalAberto(false)}
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
                  placeholder="Ex.: Reserva de Emergência, Viagem..."
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
                    Valor inicial já guardado
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
                  Criar cofrinho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Aporte no Cofrinho */}
      {modalAporteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#151515] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <h3 className="text-sm font-bold text-white">Guardar no cofrinho</h3>
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
                  className="rounded-xl border border-white/10 bg-transparent hover:bg-white/[0.05] px-4 py-2.5 text-xs font-semibold text-stone-300 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:brightness-110 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-950/50 transition-all cursor-pointer"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
