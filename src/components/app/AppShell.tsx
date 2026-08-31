import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  Tags,
  ShieldCheck,
  Landmark,
  GraduationCap,
  CircleHelp,
  LifeBuoy,
  Settings,
  Bell,
  Menu,
  X,
  User,
  PiggyBank,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { aluno } from "@/lib/mock-data";

const principal = [
  { rotulo: "Visão Geral", to: "/", icone: LayoutDashboard },
  { rotulo: "Controle Financeiro", to: "/controle-financeiro", icone: Wallet },
  { rotulo: "Cartão de Crédito", to: "/cartao-de-credito", icone: CreditCard },
  { rotulo: "Categorias", to: "/categorias", icone: Tags },
  { rotulo: "Reserva de Emergência", to: "/reserva-de-emergencia", icone: ShieldCheck },
  { rotulo: "Bancos", to: "/bancos", icone: Landmark },
] as const;

const secundario = [
  { rotulo: "Área de Membros", to: "/area-de-membros", icone: GraduationCap },
  { rotulo: "Ajuda", to: "/ajuda", icone: CircleHelp },
  { rotulo: "Suporte", to: "/suporte", icone: LifeBuoy },
] as const;

const mobile = [
  { rotulo: "Início", to: "/", icone: LayoutDashboard },
  { rotulo: "Finanças", to: "/controle-financeiro", icone: Wallet },
  { rotulo: "Cartão", to: "/cartao-de-credito", icone: CreditCard },
  { rotulo: "Reserva", to: "/reserva-de-emergencia", icone: ShieldCheck },
  { rotulo: "Perfil", to: "/perfil", icone: User },
] as const;

function Marca() {
  return (
    <Link to="/" className="flex items-center gap-2.5 px-1">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
        <PiggyBank className="h-4.5 w-4.5" strokeWidth={2} />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-sm font-semibold tracking-tight">
          Órbita
        </span>
        <span className="block text-[0.65rem] tracking-[0.14em] text-subtle uppercase">
          Finanças
        </span>
      </span>
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
  Icone: typeof Wallet;
  onClick?: (() => void) | undefined;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      activeOptions={{ exact: to === "/" }}
      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.82rem] text-muted-foreground transition-colors hover:bg-surface hover:text-foreground data-[status=active]:bg-primary/12 data-[status=active]:text-primary"
    >
      <Icone className="h-4 w-4 shrink-0" strokeWidth={1.75} />
      <span className="truncate">{rotulo}</span>
    </Link>
  );
}

function NavConteudo({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <>
      <nav className="space-y-1">
        {principal.map((i) => (
          <NavItem key={i.to} to={i.to} rotulo={i.rotulo} Icone={i.icone} onClick={onNavigate} />
        ))}
      </nav>
      <div className="my-6 h-px bg-border" />
      <nav className="space-y-1">
        {secundario.map((i) => (
          <NavItem key={i.to} to={i.to} rotulo={i.rotulo} Icone={i.icone} onClick={onNavigate} />
        ))}
      </nav>
    </>
  );
}

function RodapePerfil({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <div className="space-y-1 border-t border-border pt-4">
      <Link
        to="/perfil"
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface data-[status=active]:bg-primary/12"
      >
        <span className="num grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/15 text-[0.7rem] font-semibold text-primary">
          {aluno.iniciais}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[0.8rem] font-medium">{aluno.nomeCompleto}</span>
          <span className="block truncate text-[0.68rem] text-subtle">Perfil do aluno</span>
        </span>
      </Link>
      <NavItem to="/configuracoes" rotulo="Configurações" Icone={Settings} onClick={onNavigate} />
    </div>
  );
}

export function AppShell({
  titulo,
  descricao,
  children,
}: {
  titulo: string;
  descricao: string;
  children: ReactNode;
}) {
  const [aberto, setAberto] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[16.5rem] flex-col border-r border-border bg-background px-4 py-6 lg:flex">
        <Marca />
        <div className="mt-8 flex-1 overflow-y-auto">
          <NavConteudo />
        </div>
        <RodapePerfil />
      </aside>

      {/* Drawer mobile */}
      {aberto && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Fechar menu"
            className="absolute inset-0 bg-background/80"
            onClick={() => setAberto(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[17rem] flex-col border-r border-border bg-background px-4 py-6">
            <div className="flex items-center justify-between">
              <Marca />
              <button
                onClick={() => setAberto(false)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-border text-muted-foreground"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-8 flex-1 overflow-y-auto">
              <NavConteudo onNavigate={() => setAberto(false)} />
            </div>
            <RodapePerfil onNavigate={() => setAberto(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-[16.5rem]">
        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-border bg-background/92 backdrop-blur-sm">
          <div className="mx-auto grid max-w-[1400px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setAberto(true)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border text-muted-foreground lg:hidden"
                aria-label="Abrir menu"
              >
                <Menu className="h-4 w-4" />
              </button>
              <div className="min-w-0">
                <h1 className="truncate text-lg font-semibold sm:text-xl">{titulo}</h1>
                <p className="truncate text-xs text-muted-foreground sm:text-sm">{descricao}</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <button
                className="relative grid h-10 w-10 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Notificações"
              >
                <Bell className="h-4 w-4" strokeWidth={1.75} />
                <span className="absolute top-2.5 right-3 h-1.5 w-1.5 rounded-full bg-primary" />
              </button>
              <Link
                to="/perfil"
                className="flex items-center gap-3 rounded-xl border border-border px-2 py-1.5 transition-colors hover:border-border-strong sm:px-3"
              >
                <span className="relative">
                  <span className="num grid h-8 w-8 place-items-center rounded-full bg-primary/15 text-[0.7rem] font-semibold text-primary">
                    {aluno.iniciais}
                  </span>
                  <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary" />
                </span>
                <span className="hidden leading-tight sm:block">
                  <span className="block text-[0.8rem] font-medium">{aluno.nome}</span>
                  <span className="block text-[0.68rem] text-subtle">{aluno.status}</span>
                </span>
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1400px] px-4 pt-6 pb-28 sm:px-6 lg:px-8 lg:pb-12">
          {children}
        </main>
      </div>

      {/* Bottom nav mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <ul className="grid grid-cols-5">
          {mobile.map((i) => {
            const ativo = i.to === "/" ? pathname === "/" : pathname.startsWith(i.to);
            return (
              <li key={i.to}>
                <Link
                  to={i.to}
                  className={cn(
                    "flex flex-col items-center gap-1 py-2.5 text-[0.65rem] transition-colors",
                    ativo ? "text-primary" : "text-subtle",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-8 w-12 place-items-center rounded-lg",
                      ativo && "bg-primary/12",
                    )}
                  >
                    <i.icone className="h-4.5 w-4.5" strokeWidth={1.75} />
                  </span>
                  {i.rotulo}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
