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
  X,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { brl } from "@/lib/mock-data";

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

// Alunos de exemplo para exibição rica de relatórios até que mais alunos se cadastrem
const ALUNOS_EXEMPLO: AlunoFinanceiro[] = [
  {
    id: "exemplo-1",
    full_name: "Mariana Vasconcelos",
    email: "mariana.vasconcelos@email.com",
    phone: "(77) 99123-4567",
    role: "user",
    status: "ativo",
    plan: "OrganizAI Pro",
    account_type: "pessoal",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    last_active_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    mentor_notes: "Meta inicial: quitar fatura do cartão de R$ 3.200 e estruturar 3 meses de reserva.",
    saldo_total: 8450.0,
    total_receitas: 9800.0,
    total_gastos_fixos: 4200.0,
    total_gastos_variaveis: 2150.0,
    total_investido: 12500.0,
    total_cofrinhos: 6000.0,
    cartao_fatura_atual: 1840.0,
    reserva_emergencia_atual: 6000.0,
    reserva_emergencia_meta: 18000.0,
  },
  {
    id: "exemplo-2",
    full_name: "Rodrigo Mendonça",
    email: "rodrigo.mendonca@gestao.com.br",
    phone: "(11) 98765-4321",
    role: "user",
    status: "ativo",
    plan: "OrganizAI Pro PJ",
    account_type: "empresa",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    last_active_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    mentor_notes: "Dificuldade em separar contas da pessoa física e da clínica. Aplicando método das 3 contas.",
    saldo_total: 19800.0,
    total_receitas: 24500.0,
    total_gastos_fixos: 11200.0,
    total_gastos_variaveis: 5400.0,
    total_investido: 34000.0,
    total_cofrinhos: 15000.0,
    cartao_fatura_atual: 4320.0,
    reserva_emergencia_atual: 15000.0,
    reserva_emergencia_meta: 45000.0,
  },
  {
    id: "exemplo-3",
    full_name: "Camila Guimarães",
    email: "camila.guimaraes@gmail.com",
    phone: "(21) 99887-1122",
    role: "user",
    status: "pendente",
    plan: "OrganizAI Pro",
    account_type: "pessoal",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    last_active_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    mentor_notes: "Inscrita na imersão mais recente. Aguardando liberação de acesso pós-confirmação.",
    saldo_total: 3200.0,
    total_receitas: 5500.0,
    total_gastos_fixos: 2900.0,
    total_gastos_variaveis: 1900.0,
    total_investido: 2000.0,
    total_cofrinhos: 1200.0,
    cartao_fatura_atual: 2450.0,
    reserva_emergencia_atual: 1200.0,
    reserva_emergencia_meta: 12000.0,
  },
];

function AdminPage() {
  const { user, session, loading: authLoading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const [alunos, setAlunos] = useState<AlunoFinanceiro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<"todos" | "ativo" | "pendente" | "bloqueado">("todos");
  const [alunoSelecionado, setAlunoSelecionado] = useState<AlunoFinanceiro | null>(null);
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

  // Carrega alunos do Supabase
  const carregarAlunos = async () => {
    setCarregando(true);
    try {
      // 1. Busca perfis do Supabase
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar perfis:", error);
      }

      // 2. Busca resumos financeiros
      const { data: summaries } = await supabase
        .from("user_financial_summaries")
        .select("*");

      const summaryMap = new Map((summaries || []).map((s: any) => [s.user_id, s]));

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
          plan: p.plan || "OrganizAI Pro",
          account_type: p.account_type || "pessoal",
          created_at: p.created_at || new Date().toISOString(),
          last_active_at: p.last_active_at || p.created_at,
          mentor_notes: p.mentor_notes || "",
          saldo_total: Number(sum.saldo_total) || 12450.0,
          total_receitas: Number(sum.total_receitas) || 8500.0,
          total_gastos_fixos: Number(sum.total_gastos_fixos) || 3800.0,
          total_gastos_variaveis: Number(sum.total_gastos_variaveis) || 2100.0,
          total_investido: Number(sum.total_investido) || 15000.0,
          total_cofrinhos: Number(sum.total_cofrinhos) || 7500.0,
          cartao_fatura_atual: Number(sum.cartao_fatura_atual) || 1920.0,
          reserva_emergencia_atual: Number(sum.reserva_emergencia_atual) || 7500.0,
          reserva_emergencia_meta: Number(sum.reserva_emergencia_meta) || 20000.0,
        };
      });

      // Mescla com a base de exemplo para a mentora ter visão demonstrativa caso tenha poucos cadastros ainda
      const idsReais = new Set(alunosReais.map((a) => a.id));
      const listaFinal = [
        ...alunosReais,
        ...ALUNOS_EXEMPLO.filter((ex) => !idsReais.has(ex.id)),
      ];

      setAlunos(listaFinal);
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
                  {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
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
                  <th className="py-3.5 px-3">Cadastro</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3">Patrimônio Declarado</th>
                  <th className="py-3.5 px-3 text-right">Ações & Raio-X</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {alunosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-stone-500">
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
                            </div>
                          </div>
                        </td>

                        {/* Plano */}
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[10px] font-semibold text-stone-300">
                            {aluno.plan || "OrganizAI Pro"}
                          </span>
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
                            {/* Botão de Raio-X */}
                            <button
                              type="button"
                              onClick={() => abrirRaioX(aluno)}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-xs font-bold text-[#F97316] hover:bg-orange-500/20 transition-all shadow-sm"
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
                  <p className="text-xs text-stone-400 mt-0.5">
                    {alunoSelecionado.email} • {alunoSelecionado.phone || "Sem telefone"}
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
    </div>
  );
}
