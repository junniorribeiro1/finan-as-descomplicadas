import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Panel } from "@/components/app/kit";
import { User, Mail, Phone, Shield, Calendar, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil do Usuário — OrganizAI" },
      { name: "description", content: "Gerencie dados da sua conta e preferências pessoais." },
    ],
  }),
  component: Perfil,
});

function Perfil() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const nomeCompleto =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Usuário";

  const iniciais = (
    user?.user_metadata?.full_name?.[0] ||
    user?.email?.[0] ||
    "U"
  ).toUpperCase();

  const dataMembro = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      })
    : "2026";

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Sessão encerrada com sucesso.");
      navigate({ to: "/login" });
    } catch {
      toast.error("Erro ao encerrar sessão.");
    }
  };

  return (
    <AppShell titulo="Perfil" descricao="Seus dados pessoais, plano e preferências de conta.">
      <div className="mx-auto max-w-2xl space-y-6">
        <Panel className="p-6 sm:p-8">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="flex h-16 w-16 sm:h-18 sm:w-18 items-center justify-center rounded-2xl bg-orange-500/20 border border-orange-500/30 font-display text-2xl font-bold text-orange-400 shadow-md shadow-orange-950/40">
              {iniciais}
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">{nomeCompleto}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Ativo • Membro desde {dataMembro}
              </p>
            </div>
          </div>

          <div className="mt-8 divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08] bg-surface/30">
            <div className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Nome</span>
              </div>
              <span className="text-xs font-semibold text-foreground">{nomeCompleto}</span>
            </div>

            <div className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">E-mail</span>
              </div>
              <span className="text-xs font-semibold text-foreground">{user?.email || "—"}</span>
            </div>

            <div className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Telefone</span>
              </div>
              <span className="text-xs font-semibold text-foreground">
                {profile?.phone || (user?.user_metadata as any)?.phone || "—"}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Conta criada em</span>
              </div>
              <span className="text-xs font-semibold text-foreground">{dataMembro}</span>
            </div>

            <div className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Status do Plano</span>
              </div>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
                Free
              </span>
            </div>
          </div>

          {/* Botão de Logout */}
          <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Deseja encerrar sua sessão neste dispositivo?
            </p>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-all"
            >
              <LogOut className="h-4 w-4" />
              Sair da Conta
            </button>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
