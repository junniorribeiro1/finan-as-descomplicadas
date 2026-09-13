import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutGrid,
  Receipt,
  ShoppingBag,
  CreditCard,
  CircleArrowDown,
  PiggyBank,
  Landmark,
  TrendingUp,
  Tag,
  Users,
  Bot,
  ListChecks,
  CircleHelp,
  Upload,
  Bell,
  Sun,
  ChevronDown,
  Sparkles,
  Menu,
  X,
  LogOut,
  ShieldAlert,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { useState, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

export const menuItens = [
  { rotulo: "Dashboard", to: "/app", icone: LayoutGrid },
  { rotulo: "Gastos fixos", to: "/gastos-fixos", icone: Receipt },
  { rotulo: "Gastos variáveis", to: "/gastos-variaveis", icone: ShoppingBag },
  { rotulo: "Cartões de crédito", to: "/cartao-de-credito", icone: CreditCard },
  { rotulo: "Recebimentos", to: "/recebimentos", icone: CircleArrowDown },
  { rotulo: "Cofrinhos", to: "/cofrinhos", icone: PiggyBank },
  { rotulo: "Bancos", to: "/bancos", icone: Landmark },
  { rotulo: "Investimentos", to: "/investimentos", icone: TrendingUp },
  { rotulo: "Categorias", to: "/categorias", icone: Tag },
  { rotulo: "Segundo Usuário", to: "/segundo-usuario", icone: Users },
  { rotulo: "Vera | Gerente", to: "/vera-gerente", icone: Bot },
  { rotulo: "Passo a passo", to: "/passo-a-passo", icone: ListChecks },
  { rotulo: "Ajuda", to: "/ajuda", icone: CircleHelp },
  { rotulo: "Importar dados", to: "/importar-dados", icone: Upload },
] as const;

function Marca() {
  return (
    <Link to="/app" className="flex items-center gap-3 px-1 py-1 group">
      {/* Moeda Dourada IA / Ícone da marca OrganizAI */}
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center transition-transform duration-200 group-hover:scale-105">
        <img
          src="/logo.png"
          alt="OrganizAI"
          className="h-10 w-10 object-contain drop-shadow-[0_2px_10px_rgba(249,115,22,0.25)]"
        />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-display text-[1.12rem] font-bold tracking-tight text-white">
          Organiz<span className="text-[#F97316] font-black">AI</span>
        </span>
        <span className="text-[0.7rem] text-stone-400 font-normal tracking-normal">
          Sua vida financeira
        </span>
      </div>
    </Link>
  );
}

function NavItem({
  to,
  rotulo,
  Icone,
  onClick,
}: {
  to: string;
  rotulo: string;
  Icone: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  onClick?: (() => void) | undefined;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      activeOptions={{ exact: to === "/app" }}
      className="group flex items-center gap-3.5 rounded-2xl px-3.5 py-2.5 text-[0.875rem] font-medium text-stone-200 transition-all hover:bg-white/[0.06] hover:text-white data-[status=active]:bg-[#2c170d] data-[status=active]:text-[#f97316] data-[status=active]:font-semibold"
    >
      <Icone
        className="h-5 w-5 shrink-0 text-stone-300 transition-colors group-hover:text-white group-data-[status=active]:text-[#f97316]"
        strokeWidth={1.85}
      />
      <span className="truncate">{rotulo}</span>
    </Link>
  );
}

function VeraAjudaCard({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="mt-4 pt-3 border-t border-white/[0.06]">
      <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-b from-[#1f122c]/90 via-[#160c20]/95 to-[#0f0717] p-3.5 shadow-lg shadow-purple-950/20">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-purple-500/40">
            <img
              src="/vera-avatar.jpg"
              alt="Vera"
              className="h-full w-full object-cover"
              onError={(e) => {
                // Fallback caso a imagem não carregue
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white leading-tight">Precisa de ajuda?</h4>
            <p className="text-[0.68rem] text-purple-300/80">Fale com a Vera</p>
          </div>
        </div>
        <p className="mt-2 text-[0.7rem] text-stone-300 leading-snug">
          Sua gerente financeira com IA.
        </p>
        <Link
          to="/vera-gerente"
          onClick={onNavigate}
          className="mt-2.5 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-1.5 px-3 text-[0.75rem] font-semibold text-white shadow-md shadow-purple-900/30 transition-all hover:brightness-110"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Falar com a Vera
        </Link>
      </div>
    </div>
  );
}

export function AppShell({
  titulo,
  descricao,
  children,
}: {
  titulo?: string;
  descricao?: string;
  children: ReactNode;
}) {
  const { user, session, profile, loading, isAdmin, isPending, isBlocked, signOut } = useAuth();
  const navigate = useNavigate();

  const [aberto, setAberto] = useState(false);
  const [tipoConta, setTipoConta] = useState<"pessoal" | "empresa">("pessoal");
  const [mes, setMes] = useState("Este mês");
  const [ano, setAno] = useState("2026");

  // Proteção de rota: Redireciona para /login se não estiver autenticado
  useEffect(() => {
    if (!loading && !session) {
      const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "/app";
      navigate({ to: "/login", search: { redirect: currentPath } });
    }
  }, [loading, session, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center">
        <div className="relative flex h-14 w-14 items-center justify-center animate-pulse">
          <img
            src="/logo.png"
            alt="OrganizAI"
            className="h-14 w-14 object-contain drop-shadow-[0_0_25px_rgba(249,115,22,0.4)]"
          />
        </div>
        <p className="mt-4 text-xs text-stone-400 font-medium">
          Carregando Organiz<span className="text-[#F97316] font-bold">AI</span>...
        </p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Se o aluno estiver com cadastro pendente de aprovação pela administradora
  if (isPending) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 text-center text-white selection:bg-amber-500/30">
        <div className="max-w-md w-full rounded-3xl border border-amber-500/25 bg-[#141311] p-8 sm:p-10 shadow-2xl shadow-amber-950/20">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 mb-6 shadow-lg shadow-amber-950/40">
            <Clock className="h-8 w-8 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Cadastro em Análise
          </h2>
          <p className="mt-3 text-xs text-stone-300 leading-relaxed">
            Olá, <strong className="text-white">{user?.email}</strong>! Sua conta no OrganizAI foi criada com sucesso e está aguardando a liberação da mentoria.
          </p>
          <div className="mt-4 rounded-xl bg-white/[0.04] border border-white/[0.06] p-3 text-left">
            <span className="text-[11px] text-[#F97316] font-bold block mb-1">
              Status do seu acesso:
            </span>
            <p className="text-[11px] text-stone-400 leading-snug">
              A aprovação é feita manualmente pela equipe da Natalia Rodolfo para garantir o acompanhamento individualizado. Assim que liberado no painel, seu acesso será ativado.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <a
              href="https://wa.me/5577981381477?text=Ol%C3%A1!%20Acabei%20de%20me%20cadastrar%20no%20OrganizAI%20e%20gostaria%20de%20solicitar%20a%20aprova%C3%A7%C3%A3o%20do%20meu%20acesso."
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-950/40 transition-colors"
            >
              Avisar a Mentoria no WhatsApp
            </a>
            <button
              type="button"
              onClick={async () => {
                await signOut();
                navigate({ to: "/login" });
              }}
              className="w-full rounded-xl border border-white/10 hover:bg-white/5 py-2.5 text-xs font-semibold text-stone-300 transition-colors"
            >
              Encerrar Sessão
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Se o aluno estiver com status bloqueado pela coordenação
  if (isBlocked) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 text-center text-white selection:bg-rose-500/30">
        <div className="max-w-md w-full rounded-3xl border border-rose-500/25 bg-[#141214] p-8 sm:p-10 shadow-2xl shadow-rose-950/30">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 mb-6 shadow-lg shadow-rose-950/40">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Acesso em Análise ou Suspenso
          </h2>
          <p className="mt-3 text-xs text-stone-400 leading-relaxed">
            Olá, <strong className="text-white">{user?.email}</strong>. Seu acesso aos módulos do OrganizAI está temporariamente bloqueado ou aguardando aprovação da mentoria.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <a
              href="https://wa.me/5577981381477?text=Ol%C3%A1!%20Sou%20aluno(a)%20do%20OrganizAI%20e%20gostaria%20de%20verificar%20a%20libera%C3%A7%C3%A3o%20do%20meu%20acesso."
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-950/40 transition-colors"
            >
              Falar no WhatsApp da Mentoria
            </a>
            <button
              type="button"
              onClick={async () => {
                await signOut();
                navigate({ to: "/login" });
              }}
              className="w-full rounded-xl border border-white/10 hover:bg-white/5 py-2.5 text-xs font-semibold text-stone-300 transition-colors"
            >
              Encerrar Sessão
            </button>
          </div>
        </div>
      </div>
    );
  }

  const inicial = (
    user?.user_metadata?.full_name?.[0] ||
    user?.email?.[0] ||
    "U"
  ).toUpperCase();
  const nomeUsuario =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Usuário";

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-foreground font-sans">
      {/* Sidebar Desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[17rem] flex-col border-r border-white/[0.06] bg-[#0d0d0d] px-4 py-5 lg:flex">
        <Marca />

        {/* Botão de Destaque para o Painel Admin (somente Administrador) */}
        {isAdmin && (
          <Link
            to="/admin"
            className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-gradient-to-r from-amber-500/15 via-[#F97316]/15 to-transparent border border-[#F97316]/30 px-3 py-2 text-xs font-bold text-[#F97316] hover:brightness-125 transition-all shadow-sm shadow-orange-950/30"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Painel Admin
            </span>
            <span className="text-[10px] bg-[#F97316] text-black px-1.5 py-0.5 rounded-md font-black tracking-wider">
              GESTOR
            </span>
          </Link>
        )}
        <div className="mt-6 flex-1 overflow-y-auto pr-1">
          <nav className="space-y-1">
            {menuItens.map((i) => (
              <NavItem key={i.to} to={i.to} rotulo={i.rotulo} Icone={i.icone} />
            ))}
          </nav>
        </div>
        <VeraAjudaCard />

        {/* Card do Usuário Logado & Logout */}
        <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between px-1">
          <Link
            to="/perfil"
            className="flex items-center gap-2.5 min-w-0 hover:opacity-80 transition-opacity"
            title="Ver meu perfil"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-orange-500/50 bg-[#1c120c] text-xs font-bold text-orange-400">
              {inicial}
            </div>
            <div className="min-w-0 text-left">
              <p className="text-xs font-medium text-stone-200 truncate max-w-[130px]">
                {nomeUsuario}
              </p>
              <p className="text-[10px] text-stone-500 truncate max-w-[130px]">
                {user?.email}
              </p>
            </div>
          </Link>
          <button
            type="button"
            onClick={async () => {
              await signOut();
              navigate({ to: "/login" });
            }}
            title="Sair da conta"
            className="grid h-8 w-8 place-items-center rounded-lg text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Drawer Mobile */}
      {aberto && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Fechar menu"
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setAberto(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[17.5rem] flex-col border-r border-white/10 bg-[#0d0d0d] px-4 py-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <Marca />
              <button
                onClick={() => setAberto(false)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-stone-400 hover:text-white"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setAberto(false)}
                className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-gradient-to-r from-amber-500/15 via-[#F97316]/15 to-transparent border border-[#F97316]/30 px-3 py-2 text-xs font-bold text-[#F97316]"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Painel Admin
                </span>
                <span className="text-[10px] bg-[#F97316] text-black px-1.5 py-0.5 rounded-md font-black tracking-wider">
                  GESTOR
                </span>
              </Link>
            )}
            <div className="mt-6 flex-1 overflow-y-auto pr-1">
              <nav className="space-y-1">
                {menuItens.map((i) => (
                  <NavItem
                    key={i.to}
                    to={i.to}
                    rotulo={i.rotulo}
                    Icone={i.icone}
                    onClick={() => setAberto(false)}
                  />
                ))}
              </nav>
            </div>
            <VeraAjudaCard onNavigate={() => setAberto(false)} />

            {/* Card do Usuário Logado & Logout Mobile */}
            <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between px-1">
              <Link
                to="/perfil"
                onClick={() => setAberto(false)}
                className="flex items-center gap-2.5 min-w-0 hover:opacity-80 transition-opacity"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-orange-500/50 bg-[#1c120c] text-xs font-bold text-orange-400">
                  {inicial}
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-xs font-medium text-stone-200 truncate max-w-[130px]">
                    {nomeUsuario}
                  </p>
                  <p className="text-[10px] text-stone-500 truncate max-w-[130px]">
                    {user?.email}
                  </p>
                </div>
              </Link>
              <button
                type="button"
                onClick={async () => {
                  setAberto(false);
                  await signOut();
                  navigate({ to: "/login" });
                }}
                title="Sair da conta"
                className="grid h-8 w-8 place-items-center rounded-lg text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="lg:pl-[17rem]">
        {/* Top Navbar conforme o padrão da imagem */}
        <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#0d0d0d]/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            {/* Lado Esquerdo: Filtros */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Botão Menu Mobile */}
              <button
                onClick={() => setAberto(true)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 text-stone-400 hover:text-white lg:hidden"
                aria-label="Abrir menu"
              >
                <Menu className="h-4 w-4" />
              </button>

              {/* Toggle Pessoal / Empresa */}
              <div className="flex items-center rounded-full bg-[#181818] p-1 border border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setTipoConta("pessoal")}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
                    tipoConta === "pessoal"
                      ? "bg-[#F97316] text-white shadow-md shadow-orange-950/40"
                      : "text-stone-400 hover:text-stone-200"
                  )}
                >
                  Pessoal
                </button>
                <button
                  type="button"
                  onClick={() => setTipoConta("empresa")}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
                    tipoConta === "empresa"
                      ? "bg-[#F97316] text-white shadow-md shadow-orange-950/40"
                      : "text-stone-400 hover:text-stone-200"
                  )}
                >
                  Empresa
                </button>
              </div>

              {/* Dropdown Este mês */}
              <div className="relative">
                <select
                  value={mes}
                  onChange={(e) => setMes(e.target.value)}
                  className="appearance-none rounded-full bg-[#181818] border border-white/[0.08] px-4 py-1.5 pr-8 text-xs font-medium text-white outline-none cursor-pointer hover:border-white/20 transition-colors"
                >
                  <option value="Este mês" className="bg-[#181818]">Este mês</option>
                  <option value="Janeiro" className="bg-[#181818]">Janeiro</option>
                  <option value="Fevereiro" className="bg-[#181818]">Fevereiro</option>
                  <option value="Março" className="bg-[#181818]">Março</option>
                  <option value="Abril" className="bg-[#181818]">Abril</option>
                  <option value="Maio" className="bg-[#181818]">Maio</option>
                  <option value="Junho" className="bg-[#181818]">Junho</option>
                  <option value="Julho" className="bg-[#181818]">Julho</option>
                  <option value="Agosto" className="bg-[#181818]">Agosto</option>
                  <option value="Setembro" className="bg-[#181818]">Setembro</option>
                  <option value="Outubro" className="bg-[#181818]">Outubro</option>
                  <option value="Novembro" className="bg-[#181818]">Novembro</option>
                  <option value="Dezembro" className="bg-[#181818]">Dezembro</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
              </div>

              {/* Dropdown 2026 */}
              <div className="relative">
                <select
                  value={ano}
                  onChange={(e) => setAno(e.target.value)}
                  className="appearance-none rounded-full bg-[#181818] border border-white/[0.08] px-3.5 py-1.5 pr-7 text-xs font-medium text-white outline-none cursor-pointer hover:border-white/20 transition-colors"
                >
                  <option value="2026" className="bg-[#181818]">2026</option>
                  <option value="2025" className="bg-[#181818]">2025</option>
                  <option value="2024" className="bg-[#181818]">2024</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
              </div>
            </div>

            {/* Lado Direito: Ações e Perfil */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Botão Atalho Painel Admin no Navbar */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden sm:flex items-center gap-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 px-3 py-1.5 text-xs font-bold text-[#F97316] hover:bg-orange-500/25 transition-colors"
                  title="Acessar Gestão da Mentoria"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Painel Admin</span>
                </Link>
              )}

              {/* Modo Claro/Escuro */}
              <button
                className="grid h-9 w-9 place-items-center rounded-full text-stone-400 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Alternar tema"
              >
                <Sun className="h-4 w-4" />
              </button>

              {/* Notificações */}
              <button
                className="grid h-9 w-9 place-items-center rounded-full text-stone-400 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Notificações"
              >
                <Bell className="h-4 w-4" />
              </button>

              {/* Avatar do Usuário */}
              <Link
                to="/perfil"
                className="flex items-center gap-2 pl-1.5 py-1 text-stone-300 hover:text-white transition-colors"
                title="Meu perfil"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-orange-500 bg-[#1c120c] text-xs font-bold text-orange-400 shadow-sm shadow-orange-950/50">
                  {inicial}
                </div>
                <span className="hidden sm:inline text-xs font-medium text-stone-300 truncate max-w-[100px]">
                  {nomeUsuario}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-stone-400" />
              </Link>
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
