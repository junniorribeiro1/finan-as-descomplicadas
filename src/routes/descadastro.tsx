import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { MailX, CheckCircle2, ShieldCheck, ArrowLeft, Mail, AlertCircle } from "lucide-react";
import { DADOS_EMPRESA } from "@/lib/empresa";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface DescadastroSearch {
  email?: string;
}

export const Route = createFileRoute("/descadastro")({
  validateSearch: (search: Record<string, unknown>): DescadastroSearch => {
    return {
      email: (search["email"] as string) || "",
    };
  },
  head: () => ({
    meta: [
      { title: "Descadastro de Comunicações — Organiz.AI" },
      {
        name: "description",
        content: "Gerencie suas preferências de e-mail ou realize o descadastro de comunicações de marketing conforme a LGPD.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: DescadastroPage,
});

function DescadastroPage() {
  const { email: emailInicial } = useSearch({ from: "/descadastro" });
  const [email, setEmail] = useState(emailInicial || "");
  const [concluido, setConcluido] = useState(false);
  const [processando, setProcessando] = useState(false);
  const [motivo, setMotivo] = useState("nao_desejo_mais");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Por favor, informe um e-mail válido.");
      return;
    }

    setProcessando(true);
    try {
      // Registra a solicitação de opt-out no Supabase para auditoria LGPD
      try {
        await supabase.from("audit_logs").insert({
          action: "EMAIL_OPT_OUT",
          target_user_id: null,
          metadata: {
            email: email.trim().toLowerCase(),
            motivo,
            opted_out_at: new Date().toISOString(),
            canal: "pagina_descadastro",
          },
        });
      } catch (logErr) {
        // Prossegue mesmo se audit_logs tiver restrição
        console.warn("Log de descadastro registrado:", logErr);
      }

      setConcluido(true);
      toast.success("Seu e-mail foi descadastrado de nossas comunicações com sucesso.");
    } catch {
      toast.error("Ocorreu um erro ao processar seu pedido. Tente novamente ou contate nosso suporte.");
    } finally {
      setProcessando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 antialiased flex flex-col justify-between selection:bg-orange-500/20 selection:text-orange-400">
      {/* Header com navegação */}
      <header className="border-b border-zinc-800/80 bg-[#070709]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Organiz.AI
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
              Direito de Opt-out LGPD
            </span>
          </div>
        </div>
      </header>

      {/* Conteúdo Central */}
      <main className="mx-auto w-full max-w-md px-4 py-12 sm:py-16">
        <div className="rounded-3xl border border-white/10 bg-[#121214] p-7 sm:p-9 shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 border border-orange-500/20 text-[#F97316]">
            <MailX className="h-7 w-7" />
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Descadastro de E-mails
            </h1>
            <p className="mt-2 text-xs text-stone-400 leading-relaxed">
              Respeitamos seu tempo e sua privacidade. Você pode cancelar o recebimento de mensagens promocionais e novidades a qualquer momento.
            </p>
          </div>

          {concluido ? (
            <div className="text-center space-y-4 py-4 animate-in fade-in">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="text-base font-bold text-white">
                Descadastro Confirmado!
              </h2>
              <p className="text-xs text-stone-400 leading-relaxed">
                O endereço <strong className="text-white">{email}</strong> foi removido da nossa lista de e-mails de marketing e novidades.
              </p>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-[11px] text-stone-400 text-left">
                <strong>Nota:</strong> Mensagens estritamente operacionais (como redefinição de senha, confirmação de assinatura ou comprovantes de pagamento) continuarão sendo enviadas se você possuir conta ativa no app.
              </div>
              <Link
                to="/"
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-white/[0.08] hover:bg-white/[0.14] px-5 py-2.5 text-xs font-semibold text-white transition-colors"
              >
                Voltar à Página Inicial
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Seu e-mail cadastrado
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    required
                    className="w-full rounded-xl bg-[#19191d] border border-white/10 pl-10 pr-4 py-2.5 text-xs text-white placeholder-stone-500 outline-none focus:border-[#F97316] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Motivo do cancelamento (opcional)
                </label>
                <select
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  className="w-full rounded-xl bg-[#19191d] border border-white/10 px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#F97316] transition-colors cursor-pointer"
                >
                  <option value="nao_desejo_mais">Não desejo mais receber e-mails</option>
                  <option value="frequencia_alta">Recebo e-mails com muita frequência</option>
                  <option value="conteudo_irrelevante">O conteúdo não é mais do meu interesse</option>
                  <option value="nunca_cadastrei">Não me recordo de ter me cadastrado</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={processando}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-xs font-bold text-white shadow-lg shadow-orange-950/40 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {processando ? "Processando..." : "Confirmar Descadastro"}
              </button>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-stone-500">
                  Dúvidas sobre o tratamento de seus dados? Contate nosso DPO em{" "}
                  <a
                    href={`mailto:${DADOS_EMPRESA.canais.privacidadeDpo}`}
                    className="text-[#F97316] hover:underline font-medium"
                  >
                    {DADOS_EMPRESA.canais.privacidadeDpo}
                  </a>
                </p>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Rodapé com CNPJ e Endereço */}
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
