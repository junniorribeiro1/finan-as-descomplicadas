import { Link, useRouterState } from "@tanstack/react-router";
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
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const menuItens = [
  { rotulo: "Dashboard", to: "/", icone: LayoutGrid },
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
    <Link to="/" className="flex items-center gap-3 px-1 py-1 group">
      {/* Emblema metálico OrganizAI */}
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#9E4D1D] via-[#D97736] to-[#6E2E0A] shadow-md shadow-orange-950/50 ring-1 ring-[#F97316]/50 transition-transform group-hover:scale-105">
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-orange-300/40 bg-gradient-to-br from-[#7C3612] to-[#3D1A07]">
          <span className="text-[0.68rem] font-black tracking-tight text-orange-200 drop-shadow">AI</span>
        </div>
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
      activeOptions={{ exact: to === "/" }}
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
  const [aberto, setAberto] = useState(false);
  const [tipoConta, setTipoConta] = useState<"pessoal" | "empresa">("pessoal");
  const [mes, setMes] = useState("Este mês");
  const [ano, setAno] = useState("2026");

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-foreground font-sans">
      {/* Sidebar Desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[17rem] flex-col border-r border-white/[0.06] bg-[#0d0d0d] px-4 py-5 lg:flex">
        <Marca />
        <div className="mt-6 flex-1 overflow-y-auto pr-1">
          <nav className="space-y-1">
            {menuItens.map((i) => (
              <NavItem key={i.to} to={i.to} rotulo={i.rotulo} Icone={i.icone} />
            ))}
          </nav>
        </div>
        <VeraAjudaCard />
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

              {/* Avatar com Letra "V" e Chevron */}
              <Link
                to="/perfil"
                className="flex items-center gap-1.5 pl-1.5 py-1 text-stone-300 hover:text-white transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-orange-500 bg-transparent text-xs font-bold text-orange-400 shadow-sm shadow-orange-950/50">
                  V
                </div>
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
