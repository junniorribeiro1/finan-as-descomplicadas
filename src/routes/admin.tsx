import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth, type UserProfile } from "@/lib/auth-context";
import {
  ShieldCheck,
  Users,
  UserCheck,
  UserX,
  Clock,
  Search,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  DollarSign,
  PiggyBank,
  CreditCard,
  Receipt,
  ShoppingBag,
  FileText,
  Save,
  CheckCircle2,
  XCircle,
  AlertCircle,
  LogOut,
  RefreshCw,
  Eye,
  Phone,
  X,
  Filter,
  Trophy,
  Award,
  Sparkles,
  RotateCcw,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { brl } from "@/lib/mock-data";
import { PATENTES, EscudoPatente, getPatentePorNivel } from "@/lib/patentes";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel Administrativo — OrganizAI" },
      {
        name: "description",
        content: "Gestão de alunos, autorizações, bloqueios e relatórios da mentoria.",
      },
    ],
  }),
  component: AdminPage,
});

interface AlunoFinanceiro {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  role: "user" | "admin";
  status: "ativo" | "pendente" | "bloqueado";
  plan?: string;
  account_type?: string;
  created_at: string;
  last_active_at?: string;
  mentor_notes?: string | null;
  patente_nivel?: number | null;
  patente_atualizada_em?: string | null;
  conquistas_desbloqueadas?: string[] | null;
  // Métricas do Raio-X
  saldo_total: number;
  total_receitas: number;
  total_gastos_fixos: number;
  total_gastos_variaveis: number;
  total_investido: number;
  total_cofrinhos: number;
  cartao_fatura_atual: number;
  reserva_emergencia_atual: number;
  reserva_emergencia_meta: number;
}


function AdminPage() {
  const { user, session, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();

  const [alunos, setAlunos] = useState<AlunoFinanceiro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<"todos" | "ativo" | "pendente" | "bloqueado">("todos");

  // Estado do Modal de Raio-X Financeiro
  const [alunoSelecionado, setAlunoSelecionado] = useState<AlunoFinanceiro | null>(null);
  // Estado do Modal Dedicado de Gestão e Liberação de Patentes
  const [alunoGerenciandoPatente, setAlunoGerenciandoPatente] = useState<AlunoFinanceiro | null>(null);
  const [notasEdicao, setNotasEdicao] = useState("");
  const [salvandoNotas, setSalvandoNotas] = useState(false);

  // Redireciona se não for admin
  useEffect(() => {
    if (!authLoading) {
      if (!session) {
        navigate({ to: "/login", search: { redirect: "/admin" } });
      }
    }
  }, [authLoading, session, navigate]);

  // Carrega lista de alunos do Supabase
  const carregarAlunos = async () => {
    setCarregando(true);
    try {
      const { data: profiles, error: pError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (pError) throw pError;

      // Busca dados dos dashboards/resumos financeiros de cada aluno se disponível
      const { data: summaries } = await supabase
        .from("financial_summary")
        .select("*");

      const summaryMap = new Map();
      (summaries || []).forEach((s: any) => {
        summaryMap.set(s.user_id, s);
      });

      // Mapeia perfis reais
      const alunosReais: AlunoFinanceiro[] = (profiles || []).map((p: any) => {
        const sum = summaryMap.get(p.id) || {};
        return {
          id: p.id,
          full_name: p.full_name || p.email?.split("@")[0] || "Aluno",
          email: p.email || "",
          phone: p.phone || "Não informado",
          role: p.role || "user",
          status: p.status || "ativo",
          plan: p.plan || "Free",
          account_type: p.account_type || "pessoal",
          created_at: p.created_at || new Date().toISOString(),
          last_active_at: p.last_active_at || p.created_at,
          mentor_notes: p.mentor_notes || "",
          patente_nivel: p.patente_nivel ?? 0,
          patente_atualizada_em: p.patente_atualizada_em || null,
          conquistas_desbloqueadas: p.conquistas_desbloqueadas || [],
          saldo_total: Number(sum.saldo_total) || 0,
          total_receitas: Number(sum.total_receitas) || 0,
          total_gastos_fixos: Number(sum.total_gastos_fixos) || 0,
          total_gastos_variaveis: Number(sum.total_gastos_variaveis) || 0,
          total_investido: Number(sum.total_investido) || 0,
          total_cofrinhos: Number(sum.total_cofrinhos) || 0,
          cartao_fatura_atual: Number(sum.cartao_fatura_atual) || 0,
          reserva_emergencia_atual: Number(sum.reserva_emergencia_atual) || 0,
          reserva_emergencia_meta: Number(sum.reserva_emergencia_meta) || 0,
        };
      });

      setAlunos(alunosReais);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao sincronizar alunos do banco de dados.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (session) {
      carregarAlunos();
    }
  }, [session]);

  // Alterar status de um aluno (Ativar / Bloquear / Pendente)
  const alterarStatus = async (
    alunoId: string,
    novoStatus: "ativo" | "pendente" | "bloqueado"
  ) => {
    try {
      // Se for aluno real do Supabase
      if (!alunoId.startsWith("exemplo-")) {
        const { error } = await supabase
          .from("profiles")
          .update({ status: novoStatus, updated_at: new Date().toISOString() })
          .eq("id", alunoId);

        if (error) {
          toast.error("Erro ao atualizar status no banco.");
          return;
        }
      }

      setAlunos((prev) =>
        prev.map((a) => (a.id === alunoId ? { ...a, status: novoStatus } : a))
      );

      if (alunoSelecionado?.id === alunoId) {
        setAlunoSelecionado((prev) =>
          prev ? { ...prev, status: novoStatus } : null
        );
      }

      const mensagem =
        novoStatus === "ativo"
          ? "Acesso aprovado e ativado com sucesso!"
          : novoStatus === "bloqueado"
          ? "Acesso do aluno suspenso/bloqueado."
          : "Aluno colocado em pendência.";

      toast.success(mensagem);
    } catch {
      toast.error("Erro ao alterar status.");
    }
  };

  // Salvar notas da mentoria
  const salvarNotas = async () => {
    if (!alunoSelecionado) return;
    setSalvandoNotas(true);
    try {
      if (!alunoSelecionado.id.startsWith("exemplo-")) {
        const { error } = await supabase
          .from("profiles")
          .update({
            mentor_notes: notasEdicao,
            updated_at: new Date().toISOString(),
          })
          .eq("id", alunoSelecionado.id);

        if (error) {
          toast.error("Erro ao salvar anotações no Supabase.");
          return;
        }
      }

      setAlunos((prev) =>
        prev.map((a) =>
          a.id === alunoSelecionado.id ? { ...a, mentor_notes: notasEdicao } : a
        )
      );

      setAlunoSelecionado((prev) =>
        prev ? { ...prev, mentor_notes: notasEdicao } : null
      );

      toast.success("Anotações da mentoria salvas com sucesso!");
    } catch {
      toast.error("Erro ao salvar anotações.");
    } finally {
      setSalvandoNotas(false);
    }
  };

  // Alterar ou regredir a patente do aluno
  const alterarPatente = async (alunoId: string, novoNivel: number) => {
    try {
      if (!alunoId.startsWith("exemplo-")) {
        const infoPatente = getPatentePorNivel(novoNivel);
        const conquistas = infoPatente ? infoPatente.conquistas.map((c) => c.id) : [];

        const { error } = await supabase
          .from("profiles")
          .update({
            patente_nivel: novoNivel,
            patente_atualizada_em: new Date().toISOString(),
            conquistas_desbloqueadas: conquistas,
            updated_at: new Date().toISOString(),
          })
          .eq("id", alunoId);

        if (error) {
          toast.error("Erro ao atualizar patente no Supabase: " + error.message);
          return;
        }
      }

      setAlunos((prev) =>
        prev.map((a) => (a.id === alunoId ? { ...a, patente_nivel: novoNivel } : a))
      );

      if (alunoSelecionado?.id === alunoId) {
        setAlunoSelecionado((prev) =>
          prev ? { ...prev, patente_nivel: novoNivel } : null
        );
      }

      if (alunoGerenciandoPatente?.id === alunoId) {
        setAlunoGerenciandoPatente((prev) =>
          prev ? { ...prev, patente_nivel: novoNivel } : null
        );
      }

      const info = getPatentePorNivel(novoNivel);
      if (info) {
        toast.success(`Patente atualizada para: ${info.titulo}!`);
      } else {
        toast.info("Patente redefinida para Iniciante (Nível 0).");
      }
    } catch {
      toast.error("Erro ao alterar patente.");
    }
  };

  // Abrir Raio-X do Aluno
  const abrirRaioX = (aluno: AlunoFinanceiro) => {
    setAlunoSelecionado(aluno);
    setNotasEdicao(aluno.mentor_notes || "");
  };

  // Métricas calculadas
  const metricas = useMemo(() => {
    const total = alunos.length;
    const ativos = alunos.filter((a) => a.status === "ativo").length;
    const pendentes = alunos.filter((a) => a.status === "pendente").length;
    const bloqueados = alunos.filter((a) => a.status === "bloqueado").length;
    const volumeTotal = alunos.reduce((acc, a) => acc + (a.saldo_total + a.total_investido), 0);

    return { total, ativos, pendentes, bloqueados, volumeTotal };
  }, [alunos]);

  // Alunos filtrados por busca e status
  const alunosFiltrados = useMemo(() => {
    return alunos.filter((aluno) => {
      const matchBusca =
        aluno.full_name.toLowerCase().includes(busca.toLowerCase()) ||
        aluno.email.toLowerCase().includes(busca.toLowerCase());

      const matchStatus =
        filtroStatus === "todos" ? true : aluno.status === filtroStatus;

      return matchBusca && matchStatus;
    });
  }, [alunos, busca, filtroStatus]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-white">
        <div className="h-12 w-12 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-stone-400">Verificando credenciais de administrador...</p>
      </div>
    );
  }

  // Se não for admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="max-w-md w-full rounded-3xl border border-rose-500/25 bg-[#141214] p-8 sm:p-10 shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 mb-6">
            <XCircle className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Acesso Não Autorizado
          </h2>
          <p className="mt-2 text-xs text-stone-400 leading-relaxed">
            Esta área é de uso exclusivo da coordenação e administradores do OrganizAI.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/app"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#F97316] hover:bg-[#ea580c] py-2.5 text-xs font-bold text-white transition-colors"
            >
              Voltar ao Meu OrganizAI (/app)
            </Link>
            <button
              onClick={() => signOut()}
              className="w-full rounded-xl border border-white/10 hover:bg-white/5 py-2.5 text-xs font-semibold text-stone-300 transition-colors"
            >
              Encerrar Sessão
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-[#F97316]/30">
      {/* Topo Administrativo */}
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#0d0d10]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1650px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo e Badge Admin */}
          <div className="flex items-center gap-3">
            <Link to="/app" className="flex items-center gap-2.5 group">
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center transition-transform group-hover:scale-105">
                <img
                  src="/logo.png"
                  alt="OrganizAI"
                  className="h-9 w-9 object-contain drop-shadow-[0_2px_8px_rgba(249,115,22,0.3)]"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-display text-base font-bold tracking-tight text-white">
                  Organiz<span className="text-[#F97316] font-black">AI</span>
                </span>
                <span className="text-[10px] text-stone-400">
                  Gestão & Mentoria
                </span>
              </div>
            </Link>

            <div className="h-5 w-px bg-white/10 mx-1 hidden sm:block" />

            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 px-3 py-1 text-[11px] font-bold text-[#F97316]">
              <ShieldCheck className="h-3.5 w-3.5" />
              PAINEL ADMINISTRADOR
            </span>
          </div>

          {/* Ações Topo: Alternar para /app e Usuário Logado */}
          <div className="flex items-center gap-3">
            <Link
              to="/app"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-stone-200 hover:bg-white/[0.08] hover:text-white transition-all shadow-sm"
              title="Acessar visão de aluno no aplicativo"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Ir para o OrganizAI (/app)</span>
            </Link>

            <button
              onClick={carregarAlunos}
              disabled={carregando}
              title="Atualizar dados agora"
              className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-stone-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${carregando ? "animate-spin" : ""}`} />
            </button>

            <div className="h-6 w-px bg-white/10 hidden sm:block" />

            {/* Administrador logado */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-orange-500/50 bg-[#1c120c] text-xs font-bold text-orange-400">
                {user?.email?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-medium text-stone-200 max-w-[150px] truncate">
                  {(user?.user_metadata?.["full_name"] as string | undefined) || user?.email?.split("@")[0]}
                </span>
                <span className="text-[10px] text-stone-500 truncate max-w-[150px]">
                  {user?.email}
                </span>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  navigate({ to: "/login" });
                }}
                title="Sair"
                className="grid h-8 w-8 place-items-center rounded-lg text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-1"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="mx-auto max-w-[1650px] px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Banner de Boas-Vindas */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-white/[0.08] bg-gradient-to-r from-[#171318] via-[#141217] to-[#121214] p-6 sm:p-8 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#F97316] uppercase tracking-wider mb-1">
              <ShieldCheck className="h-4 w-4" />
              Centro de Controle da Mentoria
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Painel de Gestão de Alunos & Finanças
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-stone-400 max-w-2xl">
              Monitore os novos cadastros, aprove acessos, bloqueie quando necessário e consulte o Raio-X financeiro minucioso de cada aluno.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              Supabase Conectado
            </span>
          </div>
        </div>

        {/* Grade de KPIs Globais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Alunos */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#141417] p-5">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-xs font-medium">Total de Alunos</span>
              <Users className="h-4 w-4 text-stone-500" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">{metricas.total}</p>
            <span className="text-[11px] text-stone-500 mt-1 block">cadastrados na plataforma</span>
          </div>

          {/* Alunos Ativos */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-5">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-xs font-semibold">Alunos Ativos</span>
              <UserCheck className="h-4 w-4" />
            </div>
            <p className="text-2xl font-bold text-emerald-300 mt-2">{metricas.ativos}</p>
            <span className="text-[11px] text-emerald-400/80 mt-1 block">com acesso 100% liberado</span>
          </div>

          {/* Alunos Pendentes */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-950/10 p-5">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-xs font-semibold">Pendentes</span>
              <Clock className="h-4 w-4" />
            </div>
            <p className="text-2xl font-bold text-amber-300 mt-2">{metricas.pendentes}</p>
            <span className="text-[11px] text-amber-400/80 mt-1 block">aguardando aprovação</span>
          </div>

          {/* Alunos Bloqueados */}
          <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-5">
            <div className="flex items-center justify-between text-rose-400">
              <span className="text-xs font-semibold">Bloqueados</span>
              <UserX className="h-4 w-4" />
            </div>
            <p className="text-2xl font-bold text-rose-300 mt-2">{metricas.bloqueados}</p>
            <span className="text-[11px] text-rose-400/80 mt-1 block">acesso suspenso</span>
          </div>

          {/* Volume Total Gerido */}
          <div className="rounded-2xl border border-orange-500/20 bg-orange-950/10 p-5">
            <div className="flex items-center justify-between text-[#F97316]">
              <span className="text-xs font-semibold">Patrimônio Gerido</span>
              <TrendingUp className="h-4 w-4" />
            </div>
            <p className="text-2xl font-bold text-orange-200 mt-2">
              {brl(metricas.volumeTotal)}
            </p>
            <span className="text-[11px] text-orange-300/80 mt-1 block">soma dos alunos</span>
          </div>
        </div>

        {/* Alerta de Cadastros Aguardando Aprovação Manual */}
        {metricas.pendentes > 0 && (
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-transparent p-4 sm:p-5 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                <Clock className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {metricas.pendentes} {metricas.pendentes === 1 ? "aluno aguardando aprovação" : "alunos aguardando aprovação"}
                </h4>
                <p className="text-xs text-stone-300">
                  Novos cadastros entram como pendentes. Clique em "Aprovar Acesso" na tabela abaixo para liberar o OrganizAI.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setFiltroStatus("pendente")}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2 text-xs font-bold text-black transition-colors"
            >
              Ver Pendentes
            </button>
          </div>
        )}

        {/* Tabela de Gestão de Alunos com Busca e Filtros */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#121215] p-6 sm:p-7 shadow-xl">
          {/* Barra de Ações: Busca + Filtros de Status */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
            {/* Campo de Busca */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome ou e-mail..."
                className="w-full rounded-xl bg-[#19191d] border border-white/10 pl-10 pr-4 py-2 text-xs text-white placeholder-stone-500 outline-none focus:border-[#F97316] transition-colors"
              />
            </div>

            {/* Pílulas de Filtro de Status */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#18181c] border border-white/[0.06] w-full sm:w-auto overflow-x-auto">
              <button
                type="button"
                onClick={() => setFiltroStatus("todos")}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  filtroStatus === "todos"
                    ? "bg-[#F97316] text-white shadow-md shadow-orange-950/40"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                Todos ({metricas.total})
              </button>
              <button
                type="button"
                onClick={() => setFiltroStatus("ativo")}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  filtroStatus === "ativo"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                Ativos ({metricas.ativos})
              </button>
              <button
                type="button"
                onClick={() => setFiltroStatus("pendente")}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  filtroStatus === "pendente"
                    ? "bg-amber-600 text-white shadow-md"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                Pendentes ({metricas.pendentes})
              </button>
              <button
                type="button"
                onClick={() => setFiltroStatus("bloqueado")}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  filtroStatus === "bloqueado"
                    ? "bg-rose-600 text-white shadow-md"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                Bloqueados ({metricas.bloqueados})
              </button>
            </div>
          </div>

          {/* Tabela de Alunos */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-stone-400 font-medium">
                  <th className="py-3.5 px-3">Aluno</th>
                  <th className="py-3.5 px-3">Tipo / Plano</th>
                  <th className="py-3.5 px-3">Patente Atual</th>
                  <th className="py-3.5 px-3">Cadastro</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3">Patrimônio Declarado</th>
                  <th className="py-3.5 px-3 text-right">Ações & Raio-X</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {alunosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-stone-500">
                      Nenhum aluno encontrado para este filtro.
                    </td>
                  </tr>
                ) : (
                  alunosFiltrados.map((aluno) => {
                    const inicial = (aluno.full_name?.[0] || aluno.email?.[0] || "A").toUpperCase();
                    const dataCadastro = new Date(aluno.created_at).toLocaleDateString("pt-BR");

                    return (
                      <tr
                        key={aluno.id}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        {/* Aluno (Avatar + Nome + E-mail) */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-orange-500/30 bg-[#1c120c] font-bold text-orange-400 text-xs">
                              {inicial}
                            </div>
                            <div>
                              <p className="font-semibold text-white group-hover:text-[#F97316] transition-colors">
                                {aluno.full_name}
                              </p>
                              <p className="text-[11px] text-stone-400">{aluno.email}</p>
                              {aluno.phone && aluno.phone !== "Não informado" && (
                                <a
                                  href={`https://wa.me/55${aluno.phone.replace(/\D/g, "")}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 font-medium transition-colors mt-0.5"
                                  title="Conversar no WhatsApp"
                                >
                                  <Phone className="h-2.5 w-2.5" />
                                  {aluno.phone}
                                </a>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Plano */}
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[10px] font-semibold text-stone-300">
                            {aluno.plan || "Free"}
                          </span>
                        </td>

                        {/* Patente Atual & Controle Direto */}
                        <td className="py-3.5 px-3 min-w-[210px]">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setAlunoGerenciandoPatente(aluno)}
                                title="Clique para abrir a tela de metas e patentes deste aluno"
                                className="shrink-0 transition-transform hover:scale-110 cursor-pointer"
                              >
                                <EscudoPatente
                                  nivel={aluno.patente_nivel && aluno.patente_nivel > 0 ? aluno.patente_nivel : 1}
                                  bloqueado={!aluno.patente_nivel || aluno.patente_nivel === 0}
                                  tamanho="sm"
                                />
                              </button>

                              <div className="min-w-0 flex-1">
                                <span className="font-semibold text-white block text-[11px] truncate">
                                  {aluno.patente_nivel && aluno.patente_nivel > 0
                                    ? getPatentePorNivel(aluno.patente_nivel)?.titulo
                                    : "Nível 0 • Sem Patente"}
                                </span>
                                <span className="text-[10px] text-stone-400 block">
                                  {aluno.patente_nivel && aluno.patente_nivel > 0
                                    ? `Nível ${aluno.patente_nivel} de 5`
                                    : "Iniciante (Auto no Passo a Passo)"}
                                </span>
                              </div>
                            </div>

                            {/* Seletor Rápido de Patente e Botão de Liberar Próxima */}
                            <div className="flex items-center gap-1.5">
                              <select
                                value={aluno.patente_nivel ?? 0}
                                onChange={(e) => alterarPatente(aluno.id, Number(e.target.value))}
                                className="rounded-lg border border-white/10 bg-[#16151a] px-2 py-1 text-[11px] font-medium text-stone-300 outline-none hover:border-amber-400 focus:border-amber-400 transition-colors cursor-pointer w-full max-w-[155px]"
                                title="Selecione para alterar ou regredir a patente diretamente"
                              >
                                <option value={0} className="bg-[#141417] text-stone-400">Nível 0: Sem Patente</option>
                                <option value={1} className="bg-[#141417] text-amber-400">Nível 1: Org. Aprendiz (Auto)</option>
                                <option value={2} className="bg-[#141417] text-cyan-400">Nível 2: Guardião Orçamento</option>
                                <option value={3} className="bg-[#141417] text-yellow-400">Nível 3: Mestre Reserva</option>
                                <option value={4} className="bg-[#141417] text-emerald-400">Nível 4: Investidor Consciente</option>
                                <option value={5} className="bg-[#141417] text-purple-400">Nível 5: Liberdade Financeira</option>
                              </select>

                              {(aluno.patente_nivel || 0) < 5 && (
                                <button
                                  type="button"
                                  onClick={() => alterarPatente(aluno.id, (aluno.patente_nivel || 0) + 1)}
                                  title={`Liberar imediatamente a próxima patente (Nível ${(aluno.patente_nivel || 0) + 1})`}
                                  className="inline-flex items-center gap-0.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 px-2 py-1 text-[10px] font-bold text-white shadow-sm hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
                                >
                                  <Sparkles className="h-2.5 w-2.5" />
                                  <span>+Nível {(aluno.patente_nivel || 0) + 1}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Data */}
                        <td className="py-3.5 px-3 text-stone-400">
                          {dataCadastro}
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-3">
                          {aluno.status === "ativo" && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              Ativo
                            </span>
                          )}
                          {aluno.status === "pendente" && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                              Pendente
                            </span>
                          )}
                          {aluno.status === "bloqueado" && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 text-[10px] font-bold text-rose-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                              Bloqueado
                            </span>
                          )}
                        </td>

                        {/* Patrimônio Declarado */}
                        <td className="py-3.5 px-3 font-semibold text-stone-200">
                          {brl(aluno.saldo_total + aluno.total_investido)}
                        </td>

                        {/* Ações */}
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Botão Dedicado de Liberar Patente */}
                            <button
                              type="button"
                              onClick={() => setAlunoGerenciandoPatente(aluno)}
                              title="Liberar ou alterar patente deste aluno"
                              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/15 hover:bg-amber-500/25 px-3 py-1.5 text-xs font-bold text-amber-300 transition-all shadow-sm cursor-pointer hover:scale-105"
                            >
                              <Trophy className="h-3.5 w-3.5 text-amber-400" />
                              <span>Liberar Patente</span>
                            </button>

                            {/* Botão de Raio-X */}
                            <button
                              type="button"
                              onClick={() => abrirRaioX(aluno)}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-xs font-bold text-[#F97316] hover:bg-orange-500/20 transition-all shadow-sm cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              Raio-X
                            </button>

                            {/* Botões de Ação Dinâmicos */}
                            {aluno.status === "pendente" && (
                              <button
                                type="button"
                                onClick={() => alterarStatus(aluno.id, "ativo")}
                                title="Aprovar Cadastro do Aluno"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-emerald-950/40 transition-all hover:scale-105"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Aprovar Acesso
                              </button>
                            )}

                            {aluno.status === "bloqueado" && (
                              <button
                                type="button"
                                onClick={() => alterarStatus(aluno.id, "ativo")}
                                title="Desbloquear Acesso"
                                className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                              >
                                Desbloquear
                              </button>
                            )}

                            {aluno.status === "ativo" && (
                              <button
                                type="button"
                                onClick={() => alterarStatus(aluno.id, "bloqueado")}
                                title="Suspender Acesso"
                                className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-colors"
                              >
                                Bloquear
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal / Gaveta do Raio-X Financeiro do Aluno */}
      {alunoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
            onClick={() => setAlunoSelecionado(null)}
          />

          {/* Conteúdo do Modal */}
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#141418] p-6 sm:p-8 shadow-2xl shadow-black z-10">
            {/* Header do Modal */}
            <div className="flex items-start justify-between gap-4 pb-6 border-b border-white/[0.08]">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-500/40 bg-[#1c120c] font-display text-xl font-bold text-orange-400">
                  {(alunoSelecionado.full_name?.[0] || "A").toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">
                      {alunoSelecionado.full_name}
                    </h2>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        alunoSelecionado.status === "ativo"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : alunoSelecionado.status === "pendente"
                          ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                          : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {alunoSelecionado.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1 flex items-center gap-2 flex-wrap">
                    <span>{alunoSelecionado.email}</span>
                    <span>•</span>
                    {alunoSelecionado.phone && alunoSelecionado.phone !== "Não informado" ? (
                      <a
                        href={`https://wa.me/55${alunoSelecionado.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-400 hover:underline font-semibold"
                        title="Conversar no WhatsApp"
                      >
                        <Phone className="h-3 w-3" />
                        {alunoSelecionado.phone} (WhatsApp)
                      </a>
                    ) : (
                      <span>Sem telefone</span>
                    )}
                    <span>•</span>
                    <span className="text-stone-300">Plano {alunoSelecionado.plan || "Free"}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAlunoSelecionado(null)}
                className="grid h-8 w-8 place-items-center rounded-xl border border-white/10 text-stone-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Corpo do Raio-X: Métricas Financeiras do Aluno */}
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#F97316] mb-3">
                  Raio-X Financeiro do Aluno
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5">
                    <span className="text-[11px] text-stone-400">Saldo em Contas</span>
                    <p className="text-base font-bold text-white mt-1">
                      {brl(alunoSelecionado.saldo_total)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-3.5">
                    <span className="text-[11px] text-emerald-400">Entradas / Mês</span>
                    <p className="text-base font-bold text-emerald-300 mt-1">
                      {brl(alunoSelecionado.total_receitas)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5">
                    <span className="text-[11px] text-stone-400">Gastos Fixos</span>
                    <p className="text-base font-bold text-stone-200 mt-1">
                      {brl(alunoSelecionado.total_gastos_fixos)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5">
                    <span className="text-[11px] text-stone-400">Gastos Variáveis</span>
                    <p className="text-base font-bold text-stone-200 mt-1">
                      {brl(alunoSelecionado.total_gastos_variaveis)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-orange-500/20 bg-orange-950/10 p-3.5">
                    <span className="text-[11px] text-orange-400">Cartão / Fatura</span>
                    <p className="text-base font-bold text-orange-200 mt-1">
                      {brl(alunoSelecionado.cartao_fatura_atual)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-purple-500/20 bg-purple-950/10 p-3.5">
                    <span className="text-[11px] text-purple-400">Investimentos</span>
                    <p className="text-base font-bold text-purple-200 mt-1">
                      {brl(alunoSelecionado.total_investido)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Barra de Reserva de Emergência do Aluno */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <PiggyBank className="h-4 w-4 text-[#F97316]" />
                    Reserva de Emergência
                  </span>
                  <span className="text-stone-400">
                    {brl(alunoSelecionado.reserva_emergencia_atual)} de {brl(alunoSelecionado.reserva_emergencia_meta)}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (alunoSelecionado.reserva_emergencia_atual /
                          (alunoSelecionado.reserva_emergencia_meta || 1)) *
                          100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Gestão de Patente & Metas da Mentoria (Apenas Administrador) */}
              <div className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.04] p-4 sm:p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-amber-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      Gestão de Patente & Metas do Aluno
                    </h3>
                  </div>
                  <span className="text-[10px] text-stone-400">Exclusivo Coordenação</span>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed mb-4">
                  Selecione a patente atual do aluno conforme os resultados alcançados na mentoria. Você pode promover ou regredir a patente a qualquer momento.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {/* Opção Nível 0 */}
                  <button
                    type="button"
                    onClick={() => alterarPatente(alunoSelecionado.id, 0)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer",
                      (alunoSelecionado.patente_nivel || 0) === 0
                        ? "border-white/50 bg-white/10 ring-2 ring-white/20 shadow-md"
                        : "border-white/[0.06] bg-black/30 hover:border-white/20 opacity-70 hover:opacity-100"
                    )}
                  >
                    <div className="h-8 w-8 rounded-lg bg-stone-800 flex items-center justify-center text-xs font-bold text-stone-400 shrink-0">
                      0
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block truncate">
                        Sem Patente
                      </span>
                      <span className="text-[10px] text-stone-400 block truncate">
                        Iniciante (Onboarding)
                      </span>
                    </div>
                  </button>

                  {/* Opções Níveis 1 a 5 */}
                  {PATENTES.map((patente) => {
                    const isAtual = (alunoSelecionado.patente_nivel || 0) === patente.nivel;
                    return (
                      <button
                        key={patente.id}
                        type="button"
                        onClick={() => alterarPatente(alunoSelecionado.id, patente.nivel)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer",
                          isAtual
                            ? `border-amber-400/80 bg-gradient-to-r ${patente.corGradiente} ring-2 ring-amber-400/50 shadow-lg`
                            : "border-white/[0.06] bg-black/30 hover:border-white/20 opacity-80 hover:opacity-100"
                        )}
                      >
                        <div className="shrink-0">
                          <EscudoPatente nivel={patente.nivel} tamanho="sm" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white block truncate">
                              {patente.titulo}
                            </span>
                          </div>
                          <span className="text-[10px] text-stone-300 block truncate">
                            Nível {patente.nivel} • {patente.subtitulo}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Anotações Confidenciais da Mentoria */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#1a1a1f] p-4 sm:p-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-[#F97316]" />
                    Anotações da Mentoria (Apenas você visualiza)
                  </label>
                  <span className="text-[10px] text-stone-500">Salvo no Supabase</span>
                </div>
                <textarea
                  rows={4}
                  value={notasEdicao}
                  onChange={(e) => setNotasEdicao(e.target.value)}
                  placeholder="Registre o diagnóstico financeiro do aluno, metas combinadas e pontos de atenção para a próxima sessão..."
                  className="w-full rounded-xl bg-[#121215] border border-white/10 p-3 text-xs text-white placeholder-stone-500 outline-none focus:border-[#F97316] transition-colors resize-none leading-relaxed"
                />
                <div className="mt-3 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={salvarNotas}
                    disabled={salvandoNotas}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#F97316] to-[#ea580c] px-4 py-2 text-xs font-bold text-white shadow-md shadow-orange-950/40 hover:brightness-110 disabled:opacity-60 transition-all"
                  >
                    <Save className="h-3.5 w-3.5" />
                    {salvandoNotas ? "Salvando..." : "Salvar Anotações"}
                  </button>
                </div>
              </div>

              {/* Controle de Status no Modal */}
              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <span className="text-xs text-stone-400">Alterar acesso do aluno:</span>
                <div className="flex items-center gap-2">
                  {alunoSelecionado.status !== "ativo" && (
                    <button
                      type="button"
                      onClick={() => alterarStatus(alunoSelecionado.id, "ativo")}
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white transition-colors"
                    >
                      Aprovar & Ativar Acesso
                    </button>
                  )}
                  {alunoSelecionado.status !== "bloqueado" && (
                    <button
                      type="button"
                      onClick={() => alterarStatus(alunoSelecionado.id, "bloqueado")}
                      className="rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 px-3.5 py-2 text-xs font-bold text-rose-400 transition-colors"
                    >
                      Bloquear Aluno
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal Dedicado de Gestão e Liberação de Patentes */}
      {alunoGerenciandoPatente && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity"
            onClick={() => setAlunoGerenciandoPatente(null)}
          />

          {/* Conteúdo do Modal */}
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-amber-500/30 bg-[#131217] p-6 sm:p-8 shadow-2xl shadow-black z-10">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-6 border-b border-white/[0.08]">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-amber-500/40 bg-amber-500/10 text-amber-400 shadow-lg">
                  <Trophy className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Liberar & Gerenciar Patentes
                    </h2>
                    <span className="rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      Mentoria
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-300 mt-1">
                    Aluno(a): <strong className="text-white">{alunoGerenciandoPatente.full_name}</strong> •{" "}
                    <span className="text-stone-400">{alunoGerenciandoPatente.email}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAlunoGerenciandoPatente(null)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-stone-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Aviso Explicativo da Regra das Patentes */}
            <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-4 sm:p-5 flex items-start gap-3.5">
              <Sparkles className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-stone-200 leading-relaxed">
                <p className="font-bold text-amber-300 mb-1">
                  Como funciona a evolução de patentes:
                </p>
                <p>
                  • <strong>Nível 1 (Organizador Aprendiz)</strong>: É concedida automaticamente pelo sistema quando o aluno conclui os 7 passos do onboarding no aplicativo.
                </p>
                <p className="mt-1">
                  • <strong>Níveis 2 a 5</strong>: São liberadas <strong>exclusivamente por você</strong>, conforme o aluno atinge as metas financeiras estabelecidas na mentoria.
                </p>
                <p className="mt-1">
                  • <strong>Regressão</strong>: Se o aluno descuidar do orçamento ou perder disciplina, você pode <strong>regredir o nível a qualquer momento</strong> clicando no botão correspondente.
                </p>
              </div>
            </div>

            {/* Banner da Patente Atual e Ação Rápida de Avanço */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-r from-[#1b1722] via-[#16141a] to-[#121215] p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  <EscudoPatente
                    nivel={
                      alunoGerenciandoPatente.patente_nivel && alunoGerenciandoPatente.patente_nivel > 0
                        ? alunoGerenciandoPatente.patente_nivel
                        : 1
                    }
                    bloqueado={!alunoGerenciandoPatente.patente_nivel || alunoGerenciandoPatente.patente_nivel === 0}
                    tamanho="md"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Situação Atual do Aluno
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {alunoGerenciandoPatente.patente_nivel && alunoGerenciandoPatente.patente_nivel > 0
                      ? `Nível ${alunoGerenciandoPatente.patente_nivel}: ${getPatentePorNivel(alunoGerenciandoPatente.patente_nivel)?.titulo}`
                      : "Nível 0: Sem Patente (Iniciante)"}
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {alunoGerenciandoPatente.patente_nivel && alunoGerenciandoPatente.patente_nivel > 0
                      ? getPatentePorNivel(alunoGerenciandoPatente.patente_nivel)?.descricao
                      : "Aluno ainda não concluiu o checklist passo a passo ou teve a patente removida."}
                  </p>
                </div>
              </div>

              {/* Botão de Avanço Imediato para a Próxima Patente */}
              {(alunoGerenciandoPatente.patente_nivel || 0) < 5 && (
                <button
                  type="button"
                  onClick={() =>
                    alterarPatente(
                      alunoGerenciandoPatente.id,
                      (alunoGerenciandoPatente.patente_nivel || 0) + 1
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:brightness-110 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-orange-950/40 hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>
                    Liberar Próxima Patente (Nível {(alunoGerenciandoPatente.patente_nivel || 0) + 1})
                  </span>
                </button>
              )}
            </div>

            {/* Grade com Todas as 5 Patentes + Nível 0 para Liberação Direta */}
            <div className="mt-6 space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Selecione a patente desejada para o aluno:
              </h4>

              {/* Nível 0: Sem Patente */}
              <div
                className={cn(
                  "rounded-2xl p-4 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                  (alunoGerenciandoPatente.patente_nivel || 0) === 0
                    ? "border-white/40 bg-white/[0.06] shadow-md"
                    : "border-white/[0.06] bg-white/[0.02] opacity-75 hover:opacity-100"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-stone-800/80 border border-white/10 flex items-center justify-center text-sm font-bold text-stone-400 shrink-0">
                    0
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-bold text-white">Nível 0 — Sem Patente (Iniciante)</h5>
                      {(alunoGerenciandoPatente.patente_nivel || 0) === 0 && (
                        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white">
                          ATUAL
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Fase de entrada. Aluno ainda não concluiu o onboarding inicial.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={(alunoGerenciandoPatente.patente_nivel || 0) === 0}
                  onClick={() => alterarPatente(alunoGerenciandoPatente.id, 0)}
                  className="rounded-xl border border-white/10 hover:bg-white/10 px-3.5 py-2 text-xs font-bold text-stone-300 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer self-start sm:self-auto shrink-0"
                >
                  {(alunoGerenciandoPatente.patente_nivel || 0) === 0 ? "Patente Atual" : "Definir como Nível 0"}
                </button>
              </div>

              {/* Níveis 1 a 5 */}
              {PATENTES.map((patente) => {
                const nivelAtual = alunoGerenciandoPatente.patente_nivel || 0;
                const isAtual = nivelAtual === patente.nivel;
                const isAlcancada = nivelAtual >= patente.nivel;
                const isProxima = nivelAtual + 1 === patente.nivel;

                return (
                  <div
                    key={patente.id}
                    className={cn(
                      "rounded-2xl p-4 sm:p-5 border transition-all flex flex-col md:flex-row md:items-center justify-between gap-5",
                      isAtual
                        ? `border-amber-400/80 bg-gradient-to-r ${patente.corGradiente} ring-2 ring-amber-400/40 shadow-xl`
                        : isAlcancada
                        ? "border-emerald-500/30 bg-emerald-500/[0.04]"
                        : isProxima
                        ? "border-amber-500/30 bg-amber-500/[0.03]"
                        : "border-white/[0.05] bg-white/[0.01] opacity-70 hover:opacity-95"
                    )}
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="shrink-0 transition-transform hover:scale-105 duration-200">
                        <EscudoPatente
                          nivel={patente.nivel}
                          bloqueado={!isAlcancada}
                          tamanho="md"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-white">Nível {patente.nivel}</span>
                          <span className="text-stone-500">•</span>
                          <h5 className="text-sm sm:text-base font-bold text-white">
                            {patente.titulo}
                          </h5>

                          {isAtual ? (
                            <span className="rounded-full bg-amber-400 text-black px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-sm">
                              ⭐ PATENTE ATUAL
                            </span>
                          ) : isAlcancada ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                              <CheckCircle2 className="h-3 w-3" />
                              CONQUISTADA
                            </span>
                          ) : isProxima ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-amber-300 animate-pulse">
                              <Sparkles className="h-3 w-3" />
                              PRÓXIMA META
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.05] border border-white/10 px-2 py-0.5 text-[10px] font-medium text-stone-400">
                              <Lock className="h-3 w-3" />
                              BLOQUEADA
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-stone-300 mt-1 max-w-xl">
                          {patente.descricao}
                        </p>

                        <div className="mt-2.5 flex items-center gap-2 flex-wrap text-xs">
                          <span className="font-semibold text-stone-300">Meta:</span>
                          <span className="text-stone-400">{patente.criterio}</span>
                        </div>
                      </div>
                    </div>

                    {/* Botões de Ação para cada Patente */}
                    <div className="self-end md:self-center shrink-0">
                      {isAtual ? (
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 px-4 py-2 text-xs font-bold text-white shadow-inner">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          Patente Ativa
                        </span>
                      ) : isAlcancada ? (
                        <button
                          type="button"
                          onClick={() => alterarPatente(alunoGerenciandoPatente.id, patente.nivel)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/15 hover:bg-amber-500/25 px-4 py-2 text-xs font-bold text-amber-300 transition-all cursor-pointer hover:scale-105"
                          title="Regredir ou reposicionar aluno nesta patente"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>Regredir para Nível {patente.nivel}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => alterarPatente(alunoGerenciandoPatente.id, patente.nivel)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-950/40 transition-all cursor-pointer hover:scale-105"
                          title={`Liberar patente Nível ${patente.nivel} para este aluno`}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Liberar Nível {patente.nivel}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rodapé do Modal */}
            <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center justify-end">
              <button
                type="button"
                onClick={() => setAlunoGerenciandoPatente(null)}
                className="rounded-xl border border-white/10 hover:bg-white/5 px-5 py-2.5 text-xs font-semibold text-stone-300 hover:text-white transition-colors cursor-pointer"
              >
                Concluir & Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
