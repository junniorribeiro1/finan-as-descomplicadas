import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShieldAlert,
  FileCheck,
  CheckCircle2,
  ArrowLeft,
  Mail,
  AlertTriangle,
  Scale,
  Send,
  HelpCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { DADOS_EMPRESA } from "@/lib/empresa";
import { toast } from "sonner";

export const Route = createFileRoute("/denuncia-direitos-autorais")({
  head: () => ({
    meta: [
      { title: "Canal de Notificação de Direitos Autorais (Notice & Takedown) — Organiz.AI" },
      {
        name: "description",
        content:
          "Canal oficial de denúncia de violação de direitos autorais e propriedade intelectual, com fluxo formal de notificação e remoção conforme a Lei 9.610/98 e o Marco Civil da Internet.",
      },
      { property: "og:title", content: "Denúncia de Direitos Autorais — Organiz.AI" },
      { property: "og:url", content: "https://nataliarodolfo.com.br/denuncia-direitos-autorais" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://nataliarodolfo.com.br/denuncia-direitos-autorais" },
    ],
  }),
  component: DenunciaDireitosAutoraisPage,
});

function DenunciaDireitosAutoraisPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [documento, setDocumento] = useState("");
  const [representado, setRepresentado] = useState("");
  const [ehRepresentante, setEhRepresentante] = useState(false);
  const [obraDescricao, setObraDescricao] = useState("");
  const [urlInfratora, setUrlInfratora] = useState("");
  const [linkComprovacao, setLinkComprovacao] = useState("");
  const [declaracaoBoaFe, setDeclaracaoBoaFe] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [protocoloGerado, setProtocoloGerado] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim() || !email.trim() || !obraDescricao.trim() || !urlInfratora.trim()) {
      toast.error("Por favor, preencha todos os campos obrigatórios assinalados com (*).");
      return;
    }

    if (!declaracaoBoaFe) {
      toast.error("É obrigatório concordar com a declaração legal de veracidade sob as penas da lei.");
      return;
    }

    setEnviando(true);
    try {
      const { data, error } = await supabase
        .from("copyright_reports")
        .insert({
          notifier_name: nome.trim(),
          notifier_email: email.trim().toLowerCase(),
          notifier_document: documento.trim() || null,
          represented_owner: ehRepresentante ? representado.trim() : nome.trim(),
          original_work_description: obraDescricao.trim(),
          infringing_url_or_content: urlInfratora.trim(),
          proof_url: linkComprovacao.trim() || null,
          good_faith_declaration: true,
          status: "pendente",
        })
        .select("id")
        .single();

      if (error) {
        throw error;
      }

      const numProtocolo = `CR-${(data?.id || "").slice(0, 8).toUpperCase()}`;
      setProtocoloGerado(numProtocolo);
      toast.success("Notificação enviada com sucesso! O protocolo foi gerado.");
    } catch (err: any) {
      console.error("Erro ao registrar notificação de direitos autorais:", err);
      toast.error("Erro ao registrar a notificação. Tente novamente ou envie para nosso e-mail oficial.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 antialiased selection:bg-orange-500/20 selection:text-orange-400">
      {/* Header com navegação */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#070709]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Início
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-orange-400" />
            <span className="text-xs font-semibold tracking-wider text-orange-400 uppercase">
              Notice & Takedown Oficial
            </span>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-medium text-orange-400 mb-4">
            <Scale className="h-3.5 w-3.5" />
            Marco Civil da Internet (Lei nº 12.965/14) & Lei nº 9.610/98
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Canal de Denúncia de Direitos Autorais e Remoção de Conteúdo
          </h1>
          <p className="mt-3 text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Procedimento oficial para autores, titulares de propriedade intelectual ou seus procuradores notificarem eventuais infrações e solicitarem a pronta remoção de material na plataforma <strong>Organiz.AI</strong>.
          </p>
        </div>

        {/* Linha do Tempo do Fluxo de Remoção (Notice and Takedown) */}
        <section className="rounded-3xl border border-white/10 bg-[#121214] p-6 sm:p-8 mb-10 shadow-xl">
          <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-[#F97316]" />
            Como funciona nosso fluxo de apuração e remoção (Notice & Takedown)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/20 text-[#F97316] font-bold text-[11px] mb-2">
                1
              </span>
              <strong className="text-white block mb-1">Envio & Protocolo</strong>
              <p className="text-stone-400 leading-snug">
                Você envia a notificação preenchendo o formulário abaixo ou via e-mail e recebe um número de protocolo imediato.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/20 text-[#F97316] font-bold text-[11px] mb-2">
                2
              </span>
              <strong className="text-white block mb-1">Análise (24h a 48h)</strong>
              <p className="text-stone-400 leading-snug">
                Nossa equipe jurídica e de conformidade avalia a verossimilhança da alegação e a comprovação de titularidade.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/20 text-[#F97316] font-bold text-[11px] mb-2">
                3
              </span>
              <strong className="text-white block mb-1">Remoção Cautelar</strong>
              <p className="text-stone-400 leading-snug">
                Havendo indícios consistentes, o conteúdo denunciado é preventivamente desativado ou removido dos servidores.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/20 text-[#F97316] font-bold text-[11px] mb-2">
                4
              </span>
              <strong className="text-white block mb-1">Contraditório</strong>
              <p className="text-stone-400 leading-snug">
                O autor do upload é notificado para eventual contra-notificação, assegurando a resolução legal transparente.
              </p>
            </div>
          </div>
        </section>

        {protocoloGerado ? (
          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/[0.05] p-8 sm:p-10 text-center space-y-4 animate-in fade-in">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">Notificação Registrada com Sucesso!</h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto leading-relaxed">
              Sua notificação de violação de direitos autorais foi recebida e encaminhada ao nosso setor jurídico para análise prioritária.
            </p>
            <div className="inline-block rounded-2xl border border-emerald-500/40 bg-black/60 px-6 py-3 my-2">
              <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-bold">
                Número de Protocolo
              </span>
              <span className="text-xl font-mono font-bold text-emerald-400">
                {protocoloGerado}
              </span>
            </div>
            <p className="text-xs text-stone-400 max-w-md mx-auto">
              Guarde este protocolo. Qualquer complemento de documentos pode ser enviado para{" "}
              <a
                href={`mailto:${DADOS_EMPRESA.canais.direitosAutorais}`}
                className="text-[#F97316] hover:underline font-semibold"
              >
                {DADOS_EMPRESA.canais.direitosAutorais}
              </a>{" "}
              citando o protocolo acima.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={() => {
                  setProtocoloGerado(null);
                  setNome("");
                  setEmail("");
                  setObraDescricao("");
                  setUrlInfratora("");
                  setLinkComprovacao("");
                  setDeclaracaoBoaFe(false);
                }}
                className="inline-flex items-center justify-center rounded-xl bg-white/[0.08] hover:bg-white/[0.14] px-5 py-2.5 text-xs font-semibold text-white transition-colors"
              >
                Enviar Outra Notificação
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-[#121214] p-6 sm:p-9 shadow-2xl">
            <div className="flex items-center gap-3 pb-6 border-b border-white/[0.08] mb-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 border border-orange-500/30 text-[#F97316]">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Formulário de Notificação de Infração</h2>
                <p className="text-xs text-stone-400">
                  Preencha com exatidão as informações abaixo para viabilizar a análise jurídica.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Identificação do Notificante */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Nome completo ou Razão Social do Notificante *
                  </label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome ou razão social"
                    required
                    className="w-full rounded-xl bg-[#19191d] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-stone-500 outline-none focus:border-[#F97316] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    E-mail oficial para contato e resposta *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    required
                    className="w-full rounded-xl bg-[#19191d] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-stone-500 outline-none focus:border-[#F97316] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    CPF ou CNPJ do Titular / Notificante (opcional para identificação)
                  </label>
                  <input
                    type="text"
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                    placeholder="000.000.000-00 ou 00.000.000/0001-00"
                    className="w-full rounded-xl bg-[#19191d] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-stone-500 outline-none focus:border-[#F97316] transition-colors"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-2.5">
                    <input
                      type="checkbox"
                      checked={ehRepresentante}
                      onChange={(e) => setEhRepresentante(e.target.checked)}
                      className="h-4 w-4 rounded border-stone-700 bg-stone-900 text-[#F97316] focus:ring-[#F97316]"
                    />
                    <span className="text-xs text-stone-300">
                      Sou procurador ou representante legal de terceiro
                    </span>
                  </label>
                </div>
              </div>

              {ehRepresentante && (
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Nome do Titular Original dos Direitos Autorais representado *
                  </label>
                  <input
                    type="text"
                    value={representado}
                    onChange={(e) => setRepresentado(e.target.value)}
                    placeholder="Nome completo ou empresa titular dos direitos"
                    required={ehRepresentante}
                    className="w-full rounded-xl bg-[#19191d] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-stone-500 outline-none focus:border-[#F97316] transition-colors"
                  />
                </div>
              )}

              {/* Detalhamento da Obra Protegida */}
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Descrição detalhada da Obra Protegida por Direitos Autorais *
                </label>
                <textarea
                  rows={3}
                  value={obraDescricao}
                  onChange={(e) => setObraDescricao(e.target.value)}
                  placeholder="Especifique a obra (título, autor, tipo de material, texto, curso, metodologia, imagem ou criação intelectual violada)..."
                  required
                  className="w-full rounded-xl bg-[#19191d] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-stone-500 outline-none focus:border-[#F97316] transition-colors resize-y"
                />
              </div>

              {/* Localização do Conteúdo Denunciado na Plataforma */}
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  URL ou Localização precisa do Conteúdo Infringente na Plataforma *
                </label>
                <textarea
                  rows={2}
                  value={urlInfratora}
                  onChange={(e) => setUrlInfratora(e.target.value)}
                  placeholder="Insira a URL exata, nome do curso, módulo ou trecho dentro da plataforma Organiz.AI onde o material é exibido..."
                  required
                  className="w-full rounded-xl bg-[#19191d] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-stone-500 outline-none focus:border-[#F97316] transition-colors resize-y"
                />
              </div>

              {/* Link de Comprovação de Titularidade */}
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Link ou Prova de Titularidade da Obra (opcional, mas recomendado)
                </label>
                <input
                  type="url"
                  value={linkComprovacao}
                  onChange={(e) => setLinkComprovacao(e.target.value)}
                  placeholder="https://exemplo.com/publicacao-original ou link do registro na Biblioteca Nacional / INPI"
                  className="w-full rounded-xl bg-[#19191d] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-stone-500 outline-none focus:border-[#F97316] transition-colors"
                />
              </div>

              {/* Declaração Legal de Boa-Fé e Veracidade */}
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-4 text-xs text-stone-300 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-amber-400">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>Declaração sob as penas da lei</span>
                </div>
                <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={declaracaoBoaFe}
                    onChange={(e) => setDeclaracaoBoaFe(e.target.checked)}
                    required
                    className="h-4 w-4 mt-0.5 rounded border-stone-700 bg-stone-900 text-[#F97316] focus:ring-[#F97316] shrink-0"
                  />
                  <span className="text-[11.5px] leading-relaxed text-stone-300">
                    Declaro de boa-fé que sou o titular dos direitos autorais reivindicados ou estou legalmente autorizado a agir em seu nome; que o uso do material não foi autorizado pelo titular ou pela lei; e que as informações aqui prestadas são verídicas, sob as penas do Art. 299 do Código Penal (falsidade ideológica) e da legislação aplicável.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={enviando}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-xs font-bold text-white shadow-lg shadow-orange-950/40 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {enviando ? "Enviando notificação..." : "Enviar Notificação de Direitos Autorais"}
                {!enviando && <Send className="h-3.5 w-3.5" />}
              </button>
            </form>
          </div>
        )}

        {/* Rodapé e Contatos Oficiais */}
        <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            <p className="font-semibold text-white">Canal Jurídico & Propriedade Intelectual</p>
            <p className="mt-0.5">
              Notificações judiciais e extrajudiciais:{" "}
              <a
                href={`mailto:${DADOS_EMPRESA.canais.direitosAutorais}`}
                className="text-[#F97316] hover:underline"
              >
                {DADOS_EMPRESA.canais.direitosAutorais}
              </a>
            </p>
          </div>
          <Link
            to="/termos-de-uso"
            className="inline-flex items-center gap-1.5 text-stone-300 hover:text-white underline underline-offset-2"
          >
            <FileCheck className="h-3.5 w-3.5" />
            Consultar Termos de Uso
          </Link>
        </div>
      </main>

      {/* Footer corporativo com CNPJ */}
      <footer className="border-t border-white/[0.06] bg-[#0c0a09] py-6 px-4 text-center text-xs text-stone-500 space-y-1">
        <p className="font-medium text-stone-400">
          {DADOS_EMPRESA.razaoSocial} · CNPJ: {DADOS_EMPRESA.cnpjFormatado}
        </p>
        <p>{DADOS_EMPRESA.enderecoCompleto}</p>
        <p className="text-[11px] text-stone-600">
          © {new Date().getFullYear()} Organiz.AI · Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
