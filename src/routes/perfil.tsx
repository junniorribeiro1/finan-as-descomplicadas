import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Panel, PanelHead, Eyebrow } from "@/components/app/kit";
import { User, Mail, Shield, Smartphone } from "lucide-react";
import { aluno } from "@/lib/mock-data";

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
  return (
    <AppShell titulo="Perfil" descricao="Seus dados pessoais, plano e preferências de conta.">
      <div className="mx-auto max-w-2xl space-y-6">
        <Panel className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/20 font-display text-2xl font-bold text-orange-400">
              {aluno.iniciais}
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">{aluno.nomeCompleto}</h3>
              <p className="text-xs text-muted-foreground">{aluno.status} • Membro desde 2026</p>
            </div>
          </div>

          <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-surface/30">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Nome</span>
              </div>
              <span className="text-xs font-semibold text-foreground">{aluno.nomeCompleto}</span>
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">E-mail</span>
              </div>
              <span className="text-xs font-semibold text-foreground">{aluno.email}</span>
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Plano</span>
              </div>
              <span className="rounded-full bg-orange-500/20 px-2.5 py-0.5 text-xs font-bold text-orange-400">
                OrganizAI Pro
              </span>
            </div>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
