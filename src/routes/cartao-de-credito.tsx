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
  CreditCard as CreditCardIcon,
  X,
  Trash2,
  Calendar,
  AlertCircle,
  Edit2,
  Building2,
  User,
  CheckCircle2,
  DollarSign,
  Receipt,
} from "lucide-react";

export const Route = createFileRoute("/cartao-de-credito")({
  head: () => ({
    meta: [
      { title: "Cartões de crédito — OrganizAI" },
      {
        name: "description",
        content: "Acompanhe o uso do limite, fatura do mês e compras parceladas · Pessoal e Empresa.",
      },
    ],
  }),
  component: CartaoCredito,
});

interface CartaoItem {
  id: string;
  user_id?: string;
  nome: string;
  ultimosDigitos: string;
  limiteTotal: number;
  faturaAtual: number;
  diaFechamento: number;
  diaVencimento: number;
  cor: string;
  tipoConta?: "pessoal" | "empresa";
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
  tipoConta?: "pessoal" | "empresa";
}

function CartaoCredito() {
  const { user } = useAuth();
  const [cartoes, setCartoes] = useState<CartaoItem[]>([]);
  const [compras, setCompras] = useState<CompraCartaoItem[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [cartaoSelecionadoId, setCartaoSelecionadoId] = useState<string | null>(null);

  // Modo da Conta: "pessoal" ou "empresa"
  const [tipoConta, setTipoConta] = useState<"pessoal" | "empresa">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("organizai_tipo_conta") as "pessoal" | "empresa") || "pessoal";
    }
    return "pessoal";
  });

  const alternarTipoConta = (novo: "pessoal" | "empresa") => {
    setTipoConta(novo);
    if (typeof window !== "undefined") {
      localStorage.setItem("organizai_tipo_conta", novo);
      window.dispatchEvent(new CustomEvent("organizai_tipo_conta_sync", { detail: novo }));
    }
  };

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
  const [modalNovoCartao, setModalNovoCartao] = useState(false);
  const [modalEditarCartao, setModalEditarCartao] = useState(false);
  const [modalNovaCompra, setModalNovaCompra] = useState(false);

  // Form states para NOVO Cartão
  const [nome, setNome] = useState("");
  const [limiteTotal, setLimiteTotal] = useState("");
  const [diaFechamento, setDiaFechamento] = useState("3");
  const [diaVencimento, setDiaVencimento] = useState("10");
  const [ultimosDigitos, setUltimosDigitos] = useState("");
  const [cor, setCor] = useState("black");

  // Form states para EDITAR Cartão
  const [editNome, setEditNome] = useState("");
  const [editLimiteTotal, setEditLimiteTotal] = useState("");
  const [editDiaFechamento, setEditDiaFechamento] = useState("3");
  const [editDiaVencimento, setEditDiaVencimento] = useState("10");
  const [editUltimosDigitos, setEditUltimosDigitos] = useState("");
  const [editCor, setEditCor] = useState("black");

  // Form states para NOVA Compra
  const [compraDescricao, setCompraDescricao] = useState("");
  const [compraValor, setCompraValor] = useState("");
  const hoje = new Date().toLocaleDateString("pt-BR");
  const [compraData, setCompraData] = useState(hoje);
  const [compraCategoria, setCompraCategoria] = useState("Outros");
  const [compraParcelas, setCompraParcelas] = useState("1");

  // Carregar cartões e compras do usuário
  useEffect(() => {
    if (!user?.id) return;

    const carregar = async () => {
      try {
        setCarregando(true);
        const [{ data: cartData }, { data: compData }] = await Promise.all([
          supabase
            .from("cartoes_credito")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("compras_cartao")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
        ]);

        if (cartData) {
          const list: CartaoItem[] = cartData.map((c: any) => ({
            id: c.id,
            user_id: c.user_id,
            nome: c.nome,
            ultimosDigitos: c.ultimos_digitos || "0000",
            limiteTotal: Number(c.limite_total) || 0,
            faturaAtual: Number(c.fatura_atual) || 0,
            diaFechamento: Number(c.dia_fechamento) || 3,
            diaVencimento: Number(c.dia_vencimento) || 10,
            cor: c.cor || "black",
            tipoConta: (c.tipo_conta as "pessoal" | "empresa") || "pessoal",
          }));
          setCartoes(list);
        }

        if (compData) {
          const cList: CompraCartaoItem[] = compData.map((cp: any) => ({
            id: cp.id,
            cartaoId: cp.cartao_id,
            descricao: cp.descricao,
            categoria: cp.categoria,
            valor: Number(cp.valor) || 0,
            data: cp.data,
            parcelaAtual: cp.parcela_atual || 1,
            parcelasTotal: cp.parcelas_total || 1,
            tipoConta: (cp.tipo_conta as "pessoal" | "empresa") || "pessoal",
          }));
          setCompras(cList);
        }
      } catch (err) {
        console.error("Erro ao carregar cartões:", err);
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, [user?.id]);

  // Cartões filtrados por Pessoal / Empresa
  const cartoesFiltrados = useMemo(() => {
    return cartoes.filter((c) => (c.tipoConta || "pessoal") === tipoConta);
  }, [cartoes, tipoConta]);

  // Cartão selecionado atualmente
  const cartaoAtivo = useMemo(() => {
    if (cartoesFiltrados.length === 0) return null;
    const encontrado = cartoesFiltrados.find((c) => c.id === cartaoSelecionadoId);
    return encontrado || cartoesFiltrados[0];
  }, [cartoesFiltrados, cartaoSelecionadoId]);

  // Atualiza seleção ao alternar conta se o ativo não pertencer mais à lista
  useEffect(() => {
    if (cartoesFiltrados.length > 0) {
      if (!cartaoSelecionadoId || !cartoesFiltrados.some((c) => c.id === cartaoSelecionadoId)) {
        setCartaoSelecionadoId(cartoesFiltrados[0].id);
      }
    } else {
      setCartaoSelecionadoId(null);
    }
  }, [cartoesFiltrados, cartaoSelecionadoId]);

  // Compras da fatura do cartão ativo
  const comprasDoCartaoAtivo = useMemo(() => {
    if (!cartaoAtivo) return [];
    return compras.filter((cp) => cp.cartaoId === cartaoAtivo.id);
  }, [compras, cartaoAtivo]);

  // Totais consolidados dos cartões da conta ativa
  const totalFaturasConta = cartoesFiltrados.reduce((acc, c) => acc + c.faturaAtual, 0);
  const totalLimitesConta = cartoesFiltrados.reduce((acc, c) => acc + c.limiteTotal, 0);
  const totalDisponivelConta = Math.max(0, totalLimitesConta - totalFaturasConta);

  // Criar Novo Cartão
  const handleSalvarCartao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      toast.error("Informe o nome do cartão.");
      return;
    }

    const limiteNum = parseFloat(limiteTotal.replace(/\./g, "").replace(",", ".")) || 0;
    if (limiteNum <= 0) {
      toast.error("Informe um limite válido maior que zero.");
      return;
    }

    const novoTemp: CartaoItem = {
      id: "temp-" + Date.now(),
      user_id: user?.id,
      nome: nome.trim(),
      ultimosDigitos: ultimosDigitos.trim() || "0000",
      limiteTotal: limiteNum,
      faturaAtual: 0,
      diaFechamento: Math.min(31, Math.max(1, parseInt(diaFechamento) || 3)),
      diaVencimento: Math.min(31, Math.max(1, parseInt(diaVencimento) || 10)),
      cor,
      tipoConta,
    };

    setCartoes((prev) => [novoTemp, ...prev]);
    setCartaoSelecionadoId(novoTemp.id);
    setNome("");
    setLimiteTotal("");
    setUltimosDigitos("");
    setModalNovoCartao(false);

    if (user?.id) {
      try {
        const { data, error } = await supabase
          .from("cartoes_credito")
          .insert({
            user_id: user.id,
            nome: novoTemp.nome,
            ultimos_digitos: novoTemp.ultimosDigitos,
            limite_total: novoTemp.limiteTotal,
            fatura_atual: 0,
            dia_fechamento: novoTemp.diaFechamento,
            dia_vencimento: novoTemp.diaVencimento,
            cor: novoTemp.cor,
            tipo_conta: tipoConta,
          })
          .select()
          .single();

        if (error) {
          toast.error("Erro ao salvar cartão no banco.");
        } else if (data) {
          setCartoes((prev) =>
            prev.map((c) =>
              c.id === novoTemp.id
                ? {
                    id: data.id,
                    user_id: data.user_id,
                    nome: data.nome,
                    ultimosDigitos: data.ultimos_digitos,
                    limiteTotal: Number(data.limite_total) || 0,
                    faturaAtual: Number(data.fatura_atual) || 0,
                    diaFechamento: Number(data.dia_fechamento) || 3,
                    diaVencimento: Number(data.dia_vencimento) || 10,
                    cor: data.cor,
                    tipoConta: (data.tipo_conta as "pessoal" | "empresa") || "pessoal",
                  }
                : c
            )
          );
          setCartaoSelecionadoId(data.id);
          toast.success(`Cartão (${tipoConta === "empresa" ? "Empresa" : "Pessoal"}) adicionado!`);
        }
        notificarAtualizacaoFinanceira();
      } catch (err) {
        console.error("Erro ao cadastrar cartão:", err);
      }
    }
  };

  // Abrir Modal de Edição
  const abrirEdicaoCartao = (c: CartaoItem) => {
    setEditNome(c.nome);
    setEditLimiteTotal(c.limiteTotal.toFixed(2).replace(".", ","));
    setEditDiaFechamento(String(c.diaFechamento));
    setEditDiaVencimento(String(c.diaVencimento));
    setEditUltimosDigitos(c.ultimosDigitos);
    setEditCor(c.cor);
    setModalEditarCartao(true);
  };

  // Salvar Edição do Cartão
  const handleSalvarEdicaoCartao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cartaoAtivo) return;

    const limiteNum = parseFloat(editLimiteTotal.replace(/\./g, "").replace(",", ".")) || 0;
    if (limiteNum <= 0) {
      toast.error("Informe um limite válido.");
      return;
    }

    const atualizado: CartaoItem = {
      ...cartaoAtivo,
      nome: editNome.trim() || cartaoAtivo.nome,
      limiteTotal: limiteNum,
      diaFechamento: Math.min(31, Math.max(1, parseInt(editDiaFechamento) || 3)),
      diaVencimento: Math.min(31, Math.max(1, parseInt(editDiaVencimento) || 10)),
      ultimosDigitos: editUltimosDigitos.trim() || cartaoAtivo.ultimosDigitos,
      cor: editCor,
    };

    setCartoes((prev) => prev.map((c) => (c.id === cartaoAtivo.id ? atualizado : c)));
    setModalEditarCartao(false);

    if (user?.id && !cartaoAtivo.id.startsWith("temp-")) {
      try {
        await supabase
          .from("cartoes_credito")
          .update({
            nome: atualizado.nome,
            limite_total: atualizado.limiteTotal,
            dia_fechamento: atualizado.diaFechamento,
            dia_vencimento: atualizado.diaVencimento,
            ultimos_digitos: atualizado.ultimosDigitos,
            cor: atualizado.cor,
          })
          .eq("id", cartaoAtivo.id)
          .eq("user_id", user.id);

        notificarAtualizacaoFinanceira();
        toast.success("Cartão atualizado com sucesso!");
      } catch (err) {
        console.error("Erro ao atualizar cartão:", err);
      }
    }
  };

  // Remover Cartão
  const removerCartao = async (id: string) => {
    setCartoes((prev) => prev.filter((c) => c.id !== id));
    if (cartaoSelecionadoId === id) {
      const restantes = cartoesFiltrados.filter((c) => c.id !== id);
      setCartaoSelecionadoId(restantes[0]?.id || null);
    }

    if (user?.id && !id.startsWith("temp-")) {
      try {
        await supabase.from("cartoes_credito").delete().eq("id", id).eq("user_id", user.id);
        toast.success("Cartão removido!");
        notificarAtualizacaoFinanceira();
      } catch (err) {
        console.error("Erro ao remover cartão:", err);
      }
    }
  };

  // Adicionar Compra na Fatura do Cartão
  const handleAdicionarCompra = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cartaoAtivo) return;
    if (!compraDescricao.trim()) {
      toast.error("Informe a descrição da compra.");
      return;
    }

    const valorNum = parseFloat(compraValor.replace(/\./g, "").replace(",", ".")) || 0;
    if (valorNum <= 0) {
      toast.error("Informe um valor válido maior que zero.");
      return;
    }

    const parcelasNum = Math.max(1, parseInt(compraParcelas) || 1);
    const novaCompraTemp: CompraCartaoItem = {
      id: "temp-" + Date.now(),
      cartaoId: cartaoAtivo.id,
      descricao: compraDescricao.trim(),
      categoria: compraCategoria,
      valor: valorNum,
      data: compraData.trim() || hoje,
      parcelaAtual: 1,
      parcelasTotal: parcelasNum,
      tipoConta,
    };

    const novaFatura = cartaoAtivo.faturaAtual + valorNum;

    // Atualiza localmente
    setCompras((prev) => [novaCompraTemp, ...prev]);
    setCartoes((prev) =>
      prev.map((c) => (c.id === cartaoAtivo.id ? { ...c, faturaAtual: novaFatura } : c))
    );

    setCompraDescricao("");
    setCompraValor("");
    setModalNovaCompra(false);

    if (user?.id) {
      try {
        // Grava a compra
        const { data: compInserida } = await supabase
          .from("compras_cartao")
          .insert({
            user_id: user.id,
            cartao_id: cartaoAtivo.id,
            descricao: novaCompraTemp.descricao,
            categoria: novaCompraTemp.categoria,
            valor: novaCompraTemp.valor,
            data: novaCompraTemp.data,
            parcela_atual: novaCompraTemp.parcelaAtual,
            parcelas_total: novaCompraTemp.parcelasTotal,
            tipo_conta: tipoConta,
          })
          .select()
          .single();

        if (compInserida) {
          setCompras((prev) =>
            prev.map((cp) => (cp.id === novaCompraTemp.id ? { ...cp, id: compInserida.id } : cp))
          );
        }

        // Atualiza a fatura no cartão
        if (!cartaoAtivo.id.startsWith("temp-")) {
          await supabase
            .from("cartoes_credito")
            .update({ fatura_atual: novaFatura })
            .eq("id", cartaoAtivo.id)
            .eq("user_id", user.id);
        }

        notificarAtualizacaoFinanceira();
        toast.success(`Compra de ${brl(valorNum)} lançada no cartão!`);
      } catch (err) {
        console.error("Erro ao registrar compra no cartão:", err);
      }
    }
  };

  // Pagar / Zerar Fatura
  const handlePagarFatura = async () => {
    if (!cartaoAtivo || cartaoAtivo.faturaAtual <= 0) return;

    const valorPago = cartaoAtivo.faturaAtual;
    setCartoes((prev) =>
      prev.map((c) => (c.id === cartaoAtivo.id ? { ...c, faturaAtual: 0 } : c))
    );

    if (user?.id && !cartaoAtivo.id.startsWith("temp-")) {
      try {
        await supabase
          .from("cartoes_credito")
          .update({ fatura_atual: 0 })
          .eq("id", cartaoAtivo.id)
          .eq("user_id", user.id);

        notificarAtualizacaoFinanceira();
        toast.success(`Fatura de ${brl(valorPago)} liquidada! Limite restabelecido.`);
      } catch (err) {
        console.error("Erro ao pagar fatura:", err);
      }
    }
  };

  // Excluir Compra da Fatura
  const removerCompra = async (compraId: string, valorCompra: number) => {
    if (!cartaoAtivo) return;

    const novaFatura = Math.max(0, cartaoAtivo.faturaAtual - valorCompra);
    setCompras((prev) => prev.filter((cp) => cp.id !== compraId));
    setCartoes((prev) =>
      prev.map((c) => (c.id === cartaoAtivo.id ? { ...c, faturaAtual: novaFatura } : c))
    );

    if (user?.id && !compraId.startsWith("temp-")) {
      try {
        await supabase.from("compras_cartao").delete().eq("id", compraId).eq("user_id", user.id);
        if (!cartaoAtivo.id.startsWith("temp-")) {
          await supabase
            .from("cartoes_credito")
            .update({ fatura_atual: novaFatura })
            .eq("id", cartaoAtivo.id)
            .eq("user_id", user.id);
        }
        notificarAtualizacaoFinanceira();
        toast.info("Compra removida da fatura.");
      } catch (err) {
        console.error("Erro ao excluir compra:", err);
      }
    }
  };

  return (
    <AppShell>
      {/* 1. Cabeçalho com Seletor Pessoal / Empresa e Ação de Novo Cartão */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
              {tipoConta === "pessoal"
                ? "Acompanhe o uso do limite, fatura do mês e compras parceladas · Pessoal."
                : "Cartões corporativos, limites e faturas da empresa · Empresa / PJ."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
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
                  ? "bg-[#F97316] text-white shadow-md shadow-orange-950/40"
                  : "text-stone-400 hover:text-stone-200"
              )}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Empresa</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setModalNovoCartao(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:brightness-110 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-orange-950/40 transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Novo cartão
          </button>
        </div>
      </div>

      {/* 2. Top 3 Cards de Resumo */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3 mt-6">
        {/* TOTAL EM FATURAS */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
            <span className="h-2 w-2 rounded-full bg-[#FF6B6B] shadow-[0_0_8px_rgba(255,107,107,0.6)]" />
            TOTAL EM FATURAS ({tipoConta.toUpperCase()})
          </div>
          <span className="font-display text-2xl font-bold text-[#FF6B6B] mt-3 block leading-none font-mono">
            {brl(totalFaturasConta)}
          </span>
          <p className="text-xs text-stone-400 mt-2">
            {cartoesFiltrados.length}{" "}
            {cartoesFiltrados.length === 1 ? "cartão cadastrado" : "cartões cadastrados"}
          </p>
        </div>

        {/* LIMITE DISPONÍVEL TOTAL */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
            <span className="h-2 w-2 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            LIMITE DISPONÍVEL TOTAL
          </div>
          <span className="font-display text-2xl font-bold text-[#34d399] mt-3 block leading-none font-mono">
            {brl(totalDisponivelConta)}
          </span>
          <p className="text-xs text-stone-400 mt-2">
            De {brl(totalLimitesConta)} em limites somados
          </p>
        </div>

        {/* CARTÕES ATIVOS */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
            <span className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            CARTÕES ATIVOS
          </div>
          <div className="mt-3">
            <span className="font-display text-2xl font-bold text-white leading-none">
              {cartoesFiltrados.length}
            </span>
            <p className="text-xs text-stone-400 mt-2">
              Conta {tipoConta === "pessoal" ? "Pessoal" : "Empresarial"}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Container Principal: Estado Vazio ou Cartões */}
      {cartoesFiltrados.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-12 min-h-[360px] flex flex-col items-center justify-center text-center mt-6 shadow-sm">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden shadow-xl shadow-black/80 border border-white/[0.08] bg-[#1a1a1a]">
            <img
              src="/empty-search-icon@2x.png"
              alt="Nenhum cartão cadastrado"
              className="h-full w-full object-cover select-none pointer-events-none"
            />
          </div>

          <h3 className="mt-4 text-sm font-bold text-white">
            Nenhum cartão {tipoConta === "pessoal" ? "pessoal" : "corporativo"} cadastrado
          </h3>

          <p className="mt-1.5 text-xs text-stone-400 max-w-sm leading-relaxed">
            {tipoConta === "pessoal"
              ? "Cadastre seus cartões de crédito pessoais para controlar o limite e as parcelas."
              : "Cadastre os cartões da sua empresa (PJ) para gerenciar despesas e fluxo de caixa."}
          </p>

          <button
            type="button"
            onClick={() => setModalNovoCartao(true)}
            className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:brightness-110 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-950/50 transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Novo cartão ({tipoConta})
          </button>
        </div>
      ) : (
        /* Se houver cartões */
        <div className="mt-6 space-y-6">
          {/* Seletor de Cartões / Abas */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              {cartoesFiltrados.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCartaoSelecionadoId(c.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer border shrink-0",
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
              onClick={() => setModalNovoCartao(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#222] border border-white/10 hover:bg-[#2c2c2c] px-3.5 py-2 text-xs font-semibold text-white transition-colors cursor-pointer self-start sm:self-auto shrink-0"
            >
              <Plus className="h-3.5 w-3.5 text-[#F97316]" />
              Adicionar outro cartão
            </button>
          </div>

          {cartaoAtivo && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[380px_minmax(0,1fr)] items-start">
              {/* Coluna da Esquerda: Visualizador do Cartão & Limites */}
              <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm space-y-4">
                {/* Visualizador do Cartão */}
                <div
                  className={cn(
                    "relative overflow-hidden rounded-2xl p-6 text-white shadow-xl border border-white/10 min-h-[210px] flex flex-col justify-between transition-all",
                    cartaoAtivo.cor === "purple"
                      ? "bg-gradient-to-br from-[#4c1d95] via-[#2e1065] to-[#0f0728]"
                      : cartaoAtivo.cor === "blue"
                      ? "bg-gradient-to-br from-[#1e3a8a] via-[#172554] to-[#080d1e]"
                      : cartaoAtivo.cor === "orange"
                      ? "bg-gradient-to-br from-[#c2410c] via-[#9a3412] to-[#431407]"
                      : cartaoAtivo.cor === "emerald"
                      ? "bg-gradient-to-br from-[#065f46] via-[#064e3b] to-[#022c22]"
                      : "bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#0d0d0d]"
                  )}
                >
                  <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                        Cartão {tipoConta === "empresa" ? "Corporativo" : "Pessoal"}
                      </span>
                      <p className="font-display text-base font-bold tracking-tight mt-0.5">
                        {cartaoAtivo.nome}
                      </p>
                    </div>

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
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => abrirEdicaoCartao(cartaoAtivo)}
                        className="text-stone-400 hover:text-white transition-colors p-1 cursor-pointer"
                        title="Editar cartão"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removerCartao(cartaoAtivo.id)}
                        className="text-stone-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                        title="Excluir cartão"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Resumo de Limite */}
                <div className="rounded-xl border border-white/[0.06] bg-[#1a1a1a] p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-400">Limite Total</span>
                    <span className="font-bold text-white font-mono">{brl(cartaoAtivo.limiteTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-400">Fatura Atual</span>
                    <span className="font-bold text-[#FF6B6B] font-mono">{brl(cartaoAtivo.faturaAtual)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-400">Limite Disponível</span>
                    <span className="font-bold text-[#34d399] font-mono">
                      {brl(Math.max(0, cartaoAtivo.limiteTotal - cartaoAtivo.faturaAtual))}
                    </span>
                  </div>

                  {/* Barra de Limite Usado */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between text-[10px] text-stone-500 mb-1">
                      <span>Uso do limite</span>
                      <span>
                        {cartaoAtivo.limiteTotal > 0
                          ? Math.min(100, Math.round((cartaoAtivo.faturaAtual / cartaoAtivo.limiteTotal) * 100))
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/[0.07] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#F97316] transition-all duration-300"
                        style={{
                          width: `${
                            cartaoAtivo.limiteTotal > 0
                              ? Math.min(100, Math.round((cartaoAtivo.faturaAtual / cartaoAtivo.limiteTotal) * 100))
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Botões de Ação na Fatura */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setModalNovaCompra(true)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange-500/15 border border-orange-500/30 hover:bg-orange-500/25 px-3 py-2 text-xs font-bold text-[#F97316] transition-colors cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Lançar compra
                    </button>
                    {cartaoAtivo.faturaAtual > 0 && (
                      <button
                        type="button"
                        onClick={handlePagarFatura}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 px-3 py-2 text-xs font-bold text-emerald-400 transition-colors cursor-pointer"
                        title="Zerar fatura atual"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Pagar fatura
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Coluna da Direita: Compras nesta Fatura */}
              <div className="rounded-2xl border border-white/[0.06] bg-[#151515] p-5 shadow-sm min-h-[440px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                    <div>
                      <h3 className="text-sm font-bold text-white">Compras nesta fatura</h3>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Vencimento previsto para dia {cartaoAtivo.diaVencimento}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm font-bold text-[#FF6B6B] font-mono">
                        {brl(cartaoAtivo.faturaAtual)}
                      </span>
                      <button
                        type="button"
                        onClick={() => setModalNovaCompra(true)}
                        className="inline-flex items-center gap-1 rounded-lg bg-white/[0.06] hover:bg-white/10 px-2.5 py-1 text-xs font-semibold text-stone-200 transition-colors cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5 text-[#F97316]" />
                        Adicionar compra
                      </button>
                    </div>
                  </div>

                  {comprasDoCartaoAtivo.length === 0 ? (
                    <div className="py-16 flex flex-col items-center justify-center text-center">
                      <AlertCircle className="h-8 w-8 text-stone-600 mb-2" />
                      <p className="text-xs font-medium text-stone-300">
                        Nenhuma compra registrada nesta fatura
                      </p>
                      <p className="text-[11px] text-stone-500 mt-1 max-w-xs">
                        Clique em "+ Adicionar compra" para registrar suas compras neste cartão.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-white/[0.06] mt-2 max-h-[380px] overflow-y-auto pr-1">
                      {comprasDoCartaoAtivo.map((compra) => (
                        <div
                          key={compra.id}
                          className="flex items-center justify-between py-3.5 hover:bg-white/[0.02] px-2 rounded-xl transition-colors"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{compra.descricao}</p>
                            <p className="text-[11px] text-stone-400 mt-0.5">
                              {compra.categoria} • {compra.data}
                              {compra.parcelasTotal && compra.parcelasTotal > 1 && (
                                <span className="ml-1 text-orange-400 font-semibold">
                                  ({compra.parcelaAtual || 1}/{compra.parcelasTotal}x)
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-display text-xs font-bold text-[#FF6B6B] font-mono">
                              {brl(compra.valor)}
                            </span>
                            <button
                              type="button"
                              onClick={() => removerCompra(compra.id, compra.valor)}
                              className="text-stone-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                              title="Excluir compra da fatura"
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
          )}
        </div>
      )}

      {/* Modal: Novo Cartão de Crédito */}
      {modalNovoCartao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#151515] p-6 shadow-2xl">
            <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-3/4 rounded-full bg-amber-500/15 blur-xl" />

            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-[#F97316]">
                  <CreditCardIcon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Cadastrar novo cartão</h3>
                  <p className="text-[11px] text-stone-400">
                    {tipoConta === "empresa" ? "Cartão Empresarial / PJ" : "Cartão Pessoal"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalNovoCartao(false)}
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
                  placeholder={tipoConta === "pessoal" ? "Ex.: Nubank Black" : "Ex.: Cora PJ, Inter Corporate"}
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
                        ? "border-[#F97316] bg-orange-500/10 text-white font-bold"
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
                        ? "border-[#F97316] bg-orange-500/10 text-white font-bold"
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
                        ? "border-[#F97316] bg-orange-500/10 text-white font-bold"
                        : "border-white/10 bg-[#1e1e1e] text-stone-400"
                    )}
                  >
                    Azul Safira
                  </button>
                  <button
                    type="button"
                    onClick={() => setCor("orange")}
                    className={cn(
                      "rounded-xl border p-2 text-center text-xs font-medium transition-colors cursor-pointer",
                      cor === "orange"
                        ? "border-[#F97316] bg-orange-500/10 text-white font-bold"
                        : "border-white/10 bg-[#1e1e1e] text-stone-400"
                    )}
                  >
                    Laranja Glow
                  </button>
                  <button
                    type="button"
                    onClick={() => setCor("emerald")}
                    className={cn(
                      "rounded-xl border p-2 text-center text-xs font-medium transition-colors cursor-pointer",
                      cor === "emerald"
                        ? "border-[#F97316] bg-orange-500/10 text-white font-bold"
                        : "border-white/10 bg-[#1e1e1e] text-stone-400"
                    )}
                  >
                    Esmeralda
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setModalNovoCartao(false)}
                  className="rounded-xl border border-white/10 bg-transparent hover:bg-white/[0.05] px-4 py-2.5 text-xs font-semibold text-stone-300 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:brightness-110 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-950/50 transition-all cursor-pointer"
                >
                  Salvar cartão ({tipoConta})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Editar Cartão de Crédito */}
      {modalEditarCartao && cartaoAtivo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#151515] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-[#F97316]" />
                <h3 className="text-sm font-bold text-white">Editar Cartão</h3>
              </div>
              <button
                onClick={() => setModalEditarCartao(false)}
                className="rounded-lg p-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSalvarEdicaoCartao} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-medium text-stone-300 mb-1.5 block">Nome do cartão</label>
                <input
                  type="text"
                  value={editNome}
                  onChange={(e) => setEditNome(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2 text-xs text-white outline-none focus:border-orange-500/60"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1.5 block">Limite total (R$)</label>
                  <input
                    type="text"
                    value={editLimiteTotal}
                    onChange={(e) => setEditLimiteTotal(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2 text-xs text-white outline-none focus:border-orange-500/60"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1.5 block">Últimos 4 dígitos</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={editUltimosDigitos}
                    onChange={(e) => setEditUltimosDigitos(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2 text-xs text-white outline-none focus:border-orange-500/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1.5 block">Dia fechamento</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={editDiaFechamento}
                    onChange={(e) => setEditDiaFechamento(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2 text-xs text-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1.5 block">Dia vencimento</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={editDiaVencimento}
                    onChange={(e) => setEditDiaVencimento(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2 text-xs text-white outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-300 mb-1.5 block">Tema visual</label>
                <div className="grid grid-cols-3 gap-2">
                  {["black", "purple", "blue", "orange", "emerald"].map((corOp) => (
                    <button
                      key={corOp}
                      type="button"
                      onClick={() => setEditCor(corOp)}
                      className={cn(
                        "rounded-xl border p-2 text-center text-xs font-medium transition-colors cursor-pointer capitalize",
                        editCor === corOp
                          ? "border-[#F97316] bg-orange-500/10 text-white font-bold"
                          : "border-white/10 bg-[#1e1e1e] text-stone-400"
                      )}
                    >
                      {corOp}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setModalEditarCartao(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#F97316] to-[#EA580C] px-5 py-2 text-xs font-bold text-white shadow-md shadow-orange-950/40 hover:brightness-110 transition-all cursor-pointer"
                >
                  Salvar alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Adicionar Compra no Cartão */}
      {modalNovaCompra && cartaoAtivo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#151515] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-[#F97316]" />
                <div>
                  <h3 className="text-sm font-bold text-white">Adicionar compra no cartão</h3>
                  <p className="text-[11px] text-stone-400">{cartaoAtivo.nome}</p>
                </div>
              </div>
              <button
                onClick={() => setModalNovaCompra(false)}
                className="rounded-lg p-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAdicionarCompra} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-medium text-stone-300 mb-1.5 block">Descrição da compra</label>
                <input
                  type="text"
                  placeholder="Ex.: Supermercado, Assinatura, Equipamento..."
                  value={compraDescricao}
                  onChange={(e) => setCompraDescricao(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500/60"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1.5 block">Valor da compra</label>
                  <div className="relative flex items-center rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs focus-within:border-orange-500/60">
                    <span className="text-stone-400 font-medium mr-1.5 select-none">R$</span>
                    <input
                      type="text"
                      placeholder="0,00"
                      value={compraValor}
                      onChange={(e) => setCompraValor(e.target.value)}
                      className="w-full bg-transparent text-white font-medium outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1.5 block">Data</label>
                  <input
                    type="text"
                    value={compraData}
                    onChange={(e) => setCompraData(e.target.value)}
                    placeholder={hoje}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1.5 block">Categoria</label>
                  <select
                    value={compraCategoria}
                    onChange={(e) => setCompraCategoria(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="Alimentação">Alimentação</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Lazer">Lazer</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Serviços">Serviços</option>
                    <option value="Insumos">Insumos</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-300 mb-1.5 block">Parcelas</label>
                  <select
                    value={compraParcelas}
                    onChange={(e) => setCompraParcelas(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#1e1e1e] px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="1">À vista (1x)</option>
                    <option value="2">2x</option>
                    <option value="3">3x</option>
                    <option value="6">6x</option>
                    <option value="10">10x</option>
                    <option value="12">12x</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setModalNovaCompra(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#F97316] to-[#EA580C] px-5 py-2 text-xs font-bold text-white shadow-md shadow-orange-950/40 hover:brightness-110 transition-all cursor-pointer"
                >
                  Lançar compra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
