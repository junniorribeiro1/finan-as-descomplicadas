import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Panel, PanelHead, Eyebrow } from "@/components/app/kit";
import { UserPlus, Users, Shield, Mail, Check, Clock } from "lucide-react";

export const Route = createFileRoute("/segundo-usuario")({
  head: () => ({
    meta: [
      { title: "Segundo Usuário & Casal — OrganizAI" },
      { name: "description", content: "Compartilhe finanças com seu parceiro(a) ou segundo titular." },
    ],
  }),
  component: SegundoUsuario,
});

function SegundoUsuario() {
  const [conviteEnviado, setConviteEnviado] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <AppShell titulo="Segundo Usuário" descricao="Gerencie finanças a dois ou compartilhe o acesso com um dependente.">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Panel className="p-6">
          <PanelHead
            titulo="Gestão Financeira Compartilhada"
            descricao="Adicione uma segunda pessoa para lançar despesas conjuntas"
          />

          <div className="mt-6 rounded-2xl border border-border bg-surface/40 p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Acesso em Parceria</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Ideal para casais ou sócios que dividem contas da casa e cartões
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <label className="text-xs font-semibold text-foreground">E-mail do segundo usuário</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (email) setConviteEnviado(true);
                  }}
                  className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <UserPlus className="h-4 w-4" />
                  Convidar
                </button>
              </div>
              {conviteEnviado && (
                <p className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2">
                  <Check className="h-3.5 w-3.5" />
                  Convite enviado com sucesso para {email}!
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-subtle mb-3">Membros com Acesso</h4>
            <div className="divide-y divide-border rounded-xl border border-border bg-surface/30">
              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                    JR
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Titular Principal</p>
                    <p className="text-xs text-muted-foreground">Admin • Acesso Total</p>
                  </div>
                </div>
                <span className="rounded-md bg-primary/15 px-2 py-0.5 text-[0.65rem] font-semibold text-primary">
                  Ativo
                </span>
              </div>
            </div>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel className="p-5">
            <Eyebrow>Permissões & Privacidade</Eyebrow>
            <h4 className="mt-2 text-base font-semibold">O que o 2º usuário pode ver?</h4>
            <ul className="mt-3 space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>Visualizar despesas compartilhadas marcadas como conjuntas.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>Registrar gastos diários e compras no supermercado.</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="h-4 w-4 shrink-0 text-orange-400 mt-0.5" />
                <span>Suas contas bancárias pessoais permanecem protegidas e privadas.</span>
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
