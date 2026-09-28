import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, ArrowLeft, Lock, FileText, CheckCircle2, Mail } from "lucide-react";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Organiz.AI & Natália Rodolfo" },
      {
        name: "description",
        content:
          "Conheça nossa Política de Privacidade em conformidade com a LGPD (Lei 13.709/2018). Saiba como protegemos seus dados cadastrais e financeiros.",
      },
      { property: "og:title", content: "Política de Privacidade — Organiz.AI & Natália Rodolfo" },
      {
        property: "og:description",
        content:
          "Segurança, transparência e proteção de dados financeiros conforme a Lei Geral de Proteção de Dados (LGPD).",
      },
      { property: "og:url", content: "https://nataliarodolfo.com.br/politica-de-privacidade" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://nataliarodolfo.com.br/politica-de-privacidade" },
    ],
  }),
  component: PoliticaPrivacidadePage,
});

function PoliticaPrivacidadePage() {
  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 antialiased selection:bg-emerald-500/20 selection:text-emerald-400">
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
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
              LGPD em Vigor
            </span>
          </div>
        </div>
      </header>

      {/* Conteúdo do Documento */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-400 mb-4">
            <ShieldCheck className="h-3.5 w-3.5" />
            Conformidade Lei nº 13.709/2018 (LGPD)
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Política de Privacidade
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            Última atualização: 20 de setembro de 2026 · Versão 2.1
          </p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed text-zinc-300">
          <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-sm">
            <h2 className="flex items-center gap-2.5 text-lg font-semibold text-white">
              <Lock className="h-5 w-5 text-emerald-400" />
              1. Compromisso com a sua Privacidade
            </h2>
            <p className="mt-3">
              A presente Política de Privacidade regula o tratamento dos dados pessoais e financeiros coletados pela plataforma <strong>Organiz.AI</strong> e pelos canais educacionais de <strong>Natália Rodolfo</strong>, em estrita conformidade com a Lei Geral de Proteção de Dados Pessoais do Brasil (Lei nº 13.709/2018 — LGPD).
            </p>
            <p className="mt-3">
              Nosso compromisso é tratar seus dados com total transparência, confidencialidade, integridade e segurança, adotando as melhores práticas internacionais de segurança da informação e governança corporativa.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">2. Dados que Coletamos</h2>
            <p>
              Para prestar serviços de qualidade, viabilizar o acesso aos recursos do Organiz.AI e ministrar os treinamentos de educação financeira, coletamos as seguintes categorias de dados:
            </p>
            <ul className="list-inside list-disc space-y-2 text-zinc-300 pl-2">
              <li>
                <strong>Dados Cadastrais:</strong> Nome completo, endereço de e-mail, número de telefone/WhatsApp e foto de perfil opcional.
              </li>
              <li>
                <strong>Dados Financeiros inseridos pelo Usuário:</strong> Entradas, despesas fixas e variáveis, cartões de crédito, saldos bancários declarados, metas de economia (cofrinhos) e categorias personalizadas. O usuário tem pleno controle sobre todas as informações que cadastra na plataforma.
              </li>
              <li>
                <strong>Dados de Navegação e Auditoria:</strong> Endereço IP anonimizado, tipo de navegador, identificador de sessão e registros de ações de segurança (logs de login e alteração de privilégios) para prevenção de fraudes e invasões.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">3. Finalidade do Tratamento de Dados</h2>
            <p>Seus dados são tratados com base nas seguintes hipóteses legais previstas na LGPD:</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Execução de Contrato
                </h3>
                <p className="mt-1 text-xs text-zinc-400">
                  Permitir o funcionamento regular da plataforma Organiz.AI, cálculo de resumos financeiros, projeções e emissão de certificados das imersões.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Legítimo Interesse & Segurança
                </h3>
                <p className="mt-1 text-xs text-zinc-400">
                  Monitoramento contra ataques cibernéticos, autenticação multifator, auditoria de acessos não autorizados e aprimoramento contínuo dos sistemas.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">4. Armazenamento e Medidas de Segurança</h2>
            <p>
              Adotamos medidas técnicas e organizacionais rígidas para assegurar a inviolabilidade de seus registros:
            </p>
            <ul className="list-inside list-disc space-y-2 text-zinc-300 pl-2">
              <li>
                <strong>Criptografia Forte:</strong> Todo o tráfego é transmitido via protocolo HTTPS com certificados TLS modernos e criptografia de ponta a ponta.
              </li>
              <li>
                <strong>Row Level Security (RLS) no PostgreSQL:</strong> Cada linha da base de dados é isolada criptograficamente por meio de políticas RLS em nível de banco de dados, garantindo que nenhum usuário tenha visibilidade ou permissão sobre os registros financeiros de outro.
              </li>
              <li>
                <strong>Trilhas de Auditoria Imutáveis:</strong> Alterações sensíveis de privilégios e perfis são registradas em tabelas de auditoria imutáveis com gatilhos de segurança à prova de manipulação externa.
              </li>
              <li>
                <strong>Isolamento de Credenciais e APIs:</strong> Todas as chaves mestras e APIs de inteligência artificial executam estritamente em ambiente isolado de servidor backend.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">5. Seus Direitos como Titular (Art. 18 da LGPD)</h2>
            <p>
              Você possui controle total sobre suas informações. A qualquer momento, mediante requisição simples, você pode solicitar:
            </p>
            <ul className="list-inside list-disc space-y-2 text-zinc-300 pl-2">
              <li>Confirmação da existência de tratamento e acesso imediato aos seus dados;</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
              <li>Eliminação completa de seus dados pessoais e financeiros da nossa base;</li>
              <li>Portabilidade dos dados em formato interoperável (como exportação CSV ou planilha);</li>
              <li>Revogação do consentimento concedido para comunicações e cookies opcionais.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
              <Mail className="h-5 w-5 text-emerald-400" />
              6. Canal de Atendimento e Encarregado de Dados (DPO)
            </h2>
            <p className="mt-2 text-sm text-zinc-300">
              Para exercer qualquer direito garantido pela LGPD ou esclarecer dúvidas sobre esta Política, entre em contato diretamente com nossa equipe de privacidade:
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs sm:text-sm">
              <a
                href="mailto:privacidade@nataliarodolfo.com.br"
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
              >
                <Mail className="h-4 w-4" />
                privacidade@nataliarodolfo.com.br
              </a>
              <Link
                to="/ajuda"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 font-medium text-zinc-200 transition-colors hover:bg-zinc-700"
              >
                <FileText className="h-4 w-4" />
                Central de Ajuda & Suporte
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
