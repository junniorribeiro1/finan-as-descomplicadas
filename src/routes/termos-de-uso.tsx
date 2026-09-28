import { createFileRoute, Link } from "@tanstack/react-router";
import { Scale, ArrowLeft, FileCheck, AlertTriangle, ShieldCheck, Mail } from "lucide-react";

export const Route = createFileRoute("/termos-de-uso")({
  head: () => ({
    meta: [
      { title: "Termos de Uso — Organiz.AI & Mentoria Natália Rodolfo" },
      {
        name: "description",
        content:
          "Leia os Termos e Condições Gerais de Uso da plataforma Organiz.AI e dos serviços de mentoria financeira de Natália Rodolfo.",
      },
      { property: "og:title", content: "Termos de Uso — Organiz.AI & Mentoria Natália Rodolfo" },
      {
        property: "og:description",
        content: "Condições e responsabilidades de uso da plataforma Organiz.AI e canais de mentoria.",
      },
      { property: "og:url", content: "https://nataliarodolfo.com.br/termos-de-uso" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://nataliarodolfo.com.br/termos-de-uso" },
    ],
  }),
  component: TermosDeUsoPage,
});

function TermosDeUsoPage() {
  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 antialiased selection:bg-amber-500/20 selection:text-amber-400">
      {/* Header com navegação */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#070709]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Início
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-amber-400" />
            <span className="text-xs font-semibold tracking-wider text-amber-400 uppercase">
              Condições Oficiais
            </span>
          </div>
        </div>
      </header>

      {/* Conteúdo do Documento */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-medium text-amber-400 mb-4">
            <Scale className="h-3.5 w-3.5" />
            Termos e Condições Gerais de Uso
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Termos de Uso
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            Vigência a partir de: 20 de setembro de 2026 · Versão 2.1
          </p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed text-zinc-300">
          <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-sm">
            <h2 className="flex items-center gap-2.5 text-lg font-semibold text-white">
              <FileCheck className="h-5 w-5 text-amber-400" />
              1. Aceitação dos Termos
            </h2>
            <p className="mt-3">
              Ao criar uma conta, adquirir uma assinatura, participar de eventos ou utilizar a plataforma <strong>Organiz.AI</strong> e os conteúdos educativos de <strong>Natália Rodolfo</strong>, você declara ter lido, compreendido e concordado integralmente com estes Termos de Uso e com a nossa Política de Privacidade.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">2. Objeto e Natureza dos Serviços</h2>
            <p>
              O <strong>Organiz.AI</strong> é um software como serviço (SaaS) voltado ao controle e planejamento financeiro pessoal (PF) e empresarial (PJ), com funcionalidades de gestão de despesas fixas, despesas variáveis, cartões de crédito, saldos bancários, metas de poupança (cofrinhos), categorização e assistente com inteligência artificial para apoio financeiro.
            </p>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
              <div className="flex items-center gap-2 font-semibold text-amber-400">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                Aviso Legal Importante:
              </div>
              <p className="mt-1 leading-relaxed">
                A plataforma Organiz.AI e os cursos de Natália Rodolfo possuem caráter estritamente educativo, de mentoria e de gestão organizacional. Não constituem serviços de assessoria ou recomendação individualizada de investimentos, intermediação financeira ou consultoria de valores mobiliários regulada pela CVM (Comissão de Valores Mobiliários).
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">3. Responsabilidades do Usuário</h2>
            <p>Como usuário da plataforma, você se compromete a:</p>
            <ul className="list-inside list-disc space-y-2 text-zinc-300 pl-2">
              <li>Fornecer informações cadastrais fidedignas e mantê-las atualizadas;</li>
              <li>Manter o sigilo estrito de sua senha e credenciais de acesso, não as compartilhando com terceiros não autorizados;</li>
              <li>Não utilizar engenharia reversa, robôs de extração automatizada ou tentar contornar mecanismos de autenticação ou Row Level Security (RLS) da base de dados;</li>
              <li>Respeitar a propriedade intelectual de todos os materiais, layouts, marcas e metodologias pertencentes a Natália Rodolfo.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">4. Propriedade Intelectual</h2>
            <p>
              Todos os elementos da plataforma Organiz.AI — incluindo código-fonte, marcas, logotipos, identidades visuais, apostilas, planilhas e metodologias pedagógicas — são de titularidade exclusiva de Natália Rodolfo e protegidos pelas leis brasileiras de direitos autorais e propriedade industrial. É vedada a reprodução ou comercialização sem autorização expressa por escrito.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">5. Cancelamento, Reembolso e Rescisão</h2>
            <p>
              Em compras de cursos e assinaturas da plataforma realizadas em ambiente eletrônico, o usuário poderá solicitar o cancelamento e reembolso integral no prazo de até 7 (sete) dias corridos a contar da confirmação do pagamento, nos moldes do Artigo 49 do Código de Defesa do Consumidor (CDC).
            </p>
            <p>
              A Organiz.AI reserva-se o direito de suspender ou rescindir o acesso de qualquer usuário que descumpra as diretrizes de segurança, realize tentativas de invasão ou viole direitos de outros membros.
            </p>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
              <Mail className="h-5 w-5 text-amber-400" />
              6. Canal de Suporte e Legislação Aplicável
            </h2>
            <p className="mt-2 text-sm text-zinc-300">
              Estes termos são regidos pelas leis da República Federativa do Brasil. Para dúvidas, cancelamentos ou orientações de suporte, contate nosso time:
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs sm:text-sm">
              <a
                href="mailto:contato@nataliarodolfo.com.br"
                className="inline-flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2 font-medium text-amber-400 transition-colors hover:bg-amber-500/20"
              >
                <Mail className="h-4 w-4" />
                contato@nataliarodolfo.com.br
              </a>
              <Link
                to="/politica-de-privacidade"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 font-medium text-zinc-200 transition-colors hover:bg-zinc-700"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Ver Política de Privacidade
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
