import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Panel, PanelHead, Eyebrow } from "@/components/app/kit";
import { CircleHelp, Search, BookOpen, MessageCircle, Mail } from "lucide-react";

export const Route = createFileRoute("/ajuda")({
  head: () => ({
    meta: [
      { title: "Central de Ajuda — OrganizAI" },
      { name: "description", content: "Dúvidas frequentes, tutoriais e canal de suporte." },
    ],
  }),
  component: CentralAjuda,
});

const faqs = [
  { q: "Como sincronizar minhas contas bancárias automaticamente?", a: "Vá em 'Bancos', clique em 'Conectar Banco' e autorize o compartilhamento via Open Finance seguro do Banco Central." },
  { q: "Qual a diferença entre Gastos Fixos e Gastos Variáveis?", a: "Gastos fixos são aqueles previsíveis e obrigatórios de todo mês (aluguel, condomínio, internet). Gastos variáveis dependem do seu consumo (mercado, saídas, lazer)." },
  { q: "Como funciona a divisão com o Segundo Usuário?", a: "Você envia um convite por e-mail na aba 'Segundo Usuário'. O convidado terá acesso para visualizar e cadastrar gastos na mesma conta conjunta." },
  { q: "Meus dados bancários estão seguros?", a: "Sim, utilizamos criptografia de ponta a ponta e conexões certificadas com as diretrizes de segurança do Open Finance Brasil." },
];

function CentralAjuda() {
  return (
    <AppShell titulo="Ajuda" descricao="Tire dúvidas, aprenda a usar as ferramentas e fale com o nosso time.">
      <div className="mx-auto max-w-3xl space-y-6">
        <Panel className="p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 mb-3">
            <CircleHelp className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold">Como podemos te ajudar hoje?</h3>
          <p className="text-xs text-muted-foreground mt-1">Busque por artigos, tutoriais ou tópicos de ajuda</p>
          <div className="relative mt-5 max-w-md mx-auto">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Digite sua dúvida..."
              className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
        </Panel>

        <Panel className="p-6">
          <PanelHead titulo="Perguntas Frequentes" descricao="Dúvidas comuns sobre o OrganizAI" />
          <div className="mt-4 divide-y divide-border">
            {faqs.map((faq, i) => (
              <div key={i} className="py-4 first:pt-2 last:pb-0">
                <h4 className="text-sm font-semibold text-foreground">{faq.q}</h4>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
