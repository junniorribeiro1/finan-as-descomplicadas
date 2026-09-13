import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppShell } from "@/components/app/AppShell";
import {
  Search,
  BookOpen,
  Video,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  X,
  ExternalLink,
  Bot,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/ajuda")({
  head: () => ({
    meta: [
      { title: "Central de Ajuda — OrganizAI" },
      {
        name: "description",
        content: "Encontre respostas rápidas e tutoriais para organizar sua vida financeira.",
      },
    ],
  }),
  component: CentralAjuda,
});

interface FaqItem {
  id: string;
  pergunta: string;
  resposta: string;
}

const faqList: FaqItem[] = [
  {
    id: "faq-1",
    pergunta: "Como cadastrar um novo gasto fixo?",
    resposta:
      "Vá em Gastos fixos, preencha o formulário à esquerda com nome, valor e dia de vencimento e clique em Salvar.",
  },
  {
    id: "faq-2",
    pergunta: "Como funcionam os cofrinhos?",
    resposta:
      "Os cofrinhos servem para guardar dinheiro com objetivos definidos. Defina um valor alvo, aporte valores periodicamente e acompanhe sua barra de evolução até atingir a meta.",
  },
  {
    id: "faq-3",
    pergunta: "Posso compartilhar minha conta?",
    resposta:
      "Sim! Na seção Segundo Usuário você pode convidar cônjuge, parceiro ou sócio por e-mail para acompanhar ou lançar transações juntos.",
  },
  {
    id: "faq-4",
    pergunta: "Como a Vera funciona?",
    resposta:
      "A Vera é sua assistente com inteligência artificial. Ela analisa seus gastos, identifica padrões de consumo, sugere cortes inteligentes e responde a qualquer dúvida financeira.",
  },
  {
    id: "faq-5",
    pergunta: "Meus dados estão seguros?",
    resposta:
      "Totalmente. Suas informações são protegidas com criptografia de ponta a ponta e rígidos protocolos de segurança. Apenas você e os usuários autorizados têm acesso.",
  },
  {
    id: "faq-6",
    pergunta: "Posso importar dados de outro app?",
    resposta:
      "Sim. Na aba 'Importar dados' você pode carregar extratos bancários em formato OFX, CSV ou planilhas Excel para sincronizar seu histórico financeiro rapidamente.",
  },
];

function CentralAjuda() {
  const [busca, setBusca] = useState("");
  const [abertoId, setAbertoId] = useState<string | null>("faq-1");
  const [modalSuporte, setModalSuporte] = useState(false);
  const [modalVideo, setModalVideo] = useState(false);

  const faqsFiltrados = useMemo(() => {
    if (!busca.trim()) return faqList;
    const termo = busca.toLowerCase().trim();
    return faqList.filter(
      (f) =>
        f.pergunta.toLowerCase().includes(termo) ||
        f.resposta.toLowerCase().includes(termo)
    );
  }, [busca]);

  const toggleFaq = (id: string) => {
    setAbertoId((prev) => (prev === id ? null : id));
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Header Superior com Ícone 3D em Pod Escuro */}
        <div className="flex items-center gap-4">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-[#161618] p-1.5 shadow-xl shadow-black/50 sm:h-14 sm:w-14">
            <img
              src="/icons/kpi/ajuda-header@2x.png"
              alt="Central de Ajuda"
              className="h-full w-full object-contain drop-shadow-[0_2px_8px_rgba(249,115,22,0.3)]"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Central de Ajuda
            </h1>
            <p className="mt-1 text-xs text-neutral-400 sm:text-sm">
              Encontre respostas rápidas e tutoriais.
            </p>
          </div>
        </div>

        {/* Barra de Busca na Central de Ajuda */}
        <div className="mt-6 relative flex items-center rounded-xl border border-white/[0.08] bg-[#161618] px-4 py-3 shadow-inner transition-colors focus-within:border-orange-500/50 sm:rounded-2xl">
          <Search className="h-4 w-4 text-neutral-500 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Buscar na Central de Ajuda..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="flex-1 bg-transparent text-xs text-white placeholder:text-neutral-500 focus:outline-none sm:text-sm"
          />
          {busca && (
            <button
              onClick={() => setBusca("")}
              className="text-neutral-500 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Grid dos 3 Cards de Ações Rápidas */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Card 1: Guia de primeiros passos */}
          <Link
            to="/passo-a-passo"
            className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#161618] p-5 shadow-lg transition-all duration-200 hover:border-orange-500/50 hover:bg-[#1a1a1d] cursor-pointer"
          >
            {/* Ícone Redondo Laranja */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2a170d] border border-orange-500/20 text-orange-400 shadow-sm transition-transform group-hover:scale-105">
              <BookOpen className="h-4 w-4" />
            </div>

            <h2 className="mt-4 text-sm font-bold text-white transition-colors">
              Guia de primeiros passos
            </h2>
            <p className="mt-1 text-xs text-neutral-400">
              Configure sua conta em 5 minutos.
            </p>

            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#f97316] group-hover:translate-x-0.5 transition-transform">
              Abrir →
            </span>

            {/* Marca d'água 3D translúcida no canto inferior direito */}
            <div className="pointer-events-none absolute -bottom-2 -right-2 h-14 w-14 opacity-25 select-none transition-opacity group-hover:opacity-40">
              <img
                src="/icons/kpi/ajuda-header@2x.png"
                alt=""
                className="h-full w-full object-contain"
              />
            </div>
          </Link>

          {/* Card 2: Vídeo: seu primeiro cofrinho */}
          <div
            onClick={() => setModalVideo(true)}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#161618] p-5 shadow-lg transition-all duration-200 hover:border-orange-500/50 hover:bg-[#1a1a1d] cursor-pointer"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2a170d] border border-orange-500/20 text-orange-400 shadow-sm transition-transform group-hover:scale-105">
              <Video className="h-4 w-4" />
            </div>

            <h2 className="mt-4 text-sm font-bold text-white transition-colors">
              Vídeo: seu primeiro cofrinho
            </h2>
            <p className="mt-1 text-xs text-neutral-400">
              Aprenda a criar metas de poupança.
            </p>

            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#f97316] group-hover:translate-x-0.5 transition-transform">
              Abrir →
            </span>

            <div className="pointer-events-none absolute -bottom-2 -right-2 h-14 w-14 opacity-25 select-none transition-opacity group-hover:opacity-40">
              <img
                src="/icons/kpi/ajuda-header@2x.png"
                alt=""
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          {/* Card 3: Conversar com suporte */}
          <div
            onClick={() => setModalSuporte(true)}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#161618] p-5 shadow-lg transition-all duration-200 hover:border-orange-500/50 hover:bg-[#1a1a1d] cursor-pointer"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2a170d] border border-orange-500/20 text-orange-400 shadow-sm transition-transform group-hover:scale-105">
              <MessageSquare className="h-4 w-4" />
            </div>

            <h2 className="mt-4 text-sm font-bold text-white transition-colors">
              Conversar com suporte
            </h2>
            <p className="mt-1 text-xs text-neutral-400">
              Nosso time responde em até 24h.
            </p>

            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#f97316] group-hover:translate-x-0.5 transition-transform">
              Abrir →
            </span>

            <div className="pointer-events-none absolute -bottom-2 -right-2 h-14 w-14 opacity-25 select-none transition-opacity group-hover:opacity-40">
              <img
                src="/icons/kpi/ajuda-header@2x.png"
                alt=""
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Card do Accordion: Perguntas frequentes */}
        <div className="mt-6 rounded-2xl border border-white/[0.08] bg-[#161618] p-5 shadow-xl sm:rounded-3xl sm:p-7">
          <h2 className="text-sm font-bold text-white sm:text-base mb-4">
            Perguntas frequentes
          </h2>

          <div className="space-y-2.5">
            {faqsFiltrados.length === 0 ? (
              <p className="py-8 text-center text-xs text-neutral-500">
                Nenhuma resposta encontrada para "{busca}". Tente outros termos.
              </p>
            ) : (
              faqsFiltrados.map((faq) => {
                const isOpen = abertoId === faq.id;
                return (
                  <div
                    key={faq.id}
                    onClick={() => toggleFaq(faq.id)}
                    className={`rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                      isOpen
                        ? "border-orange-500/50 bg-[#19191c]"
                        : "border-white/[0.06] bg-[#161618] hover:border-orange-500/30 hover:bg-[#19191c]"
                    }`}
                  >
                    <div className="flex items-center justify-between p-4">
                      <h3
                        className={`text-xs sm:text-sm font-semibold transition-colors ${
                          isOpen ? "text-white" : "text-neutral-200"
                        }`}
                      >
                        {faq.pergunta}
                      </h3>
                      <div className="text-neutral-400 shrink-0 ml-3">
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </div>

                    {isOpen && (
                      <div className="px-4 pb-4 pt-0 text-xs sm:text-sm text-neutral-400 leading-relaxed animate-in fade-in duration-200">
                        <p>{faq.resposta}</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Modal de Suporte */}
      {modalSuporte && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#161618] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Falar com o Suporte
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Estamos prontos para te ajudar
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalSuporte(false)}
                className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <p className="text-xs text-neutral-300 leading-relaxed">
                Você pode falar diretamente com nossa inteligência artificial ou abrir um chamado com nossa equipe humana:
              </p>

              <Link
                to="/vera-gerente"
                onClick={() => setModalSuporte(false)}
                className="flex items-center justify-between rounded-xl border border-purple-500/30 bg-purple-500/10 p-3.5 transition-colors hover:bg-purple-500/15"
              >
                <div className="flex items-center gap-3">
                  <Bot className="h-5 w-5 text-purple-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Falar com a Vera</h4>
                    <p className="text-[11px] text-purple-300/80">Resposta imediata com IA</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-purple-400">Iniciar →</span>
              </Link>

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                <h4 className="text-xs font-semibold text-white">E-mail de Suporte</h4>
                <p className="text-xs text-neutral-400 mt-1">suporte@organizai.com</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">Tempo médio de resposta: até 24h</p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setModalSuporte(false)}
                className="rounded-xl bg-white/[0.06] px-4 py-2 text-xs font-semibold text-white hover:bg-white/[0.1]"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Vídeo Tutorial */}
      {modalVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#161618] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
                  <Video className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Vídeo: Seu Primeiro Cofrinho
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Aprenda a criar e gerenciar metas de poupança
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalVideo(false)}
                className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 aspect-video w-full rounded-xl border border-white/10 bg-black/60 flex flex-col items-center justify-center p-6 text-center">
              <Video className="h-10 w-10 text-orange-500 mb-2" />
              <p className="text-xs font-semibold text-white">Tutorial Passo a Passo</p>
              <p className="text-[11px] text-neutral-400 mt-1 max-w-xs">
                Aprenda a definir o valor alvo, prazo e acompanhar o crescimento do seu cofrinho mês a mês.
              </p>
              <Link
                to="/cofrinhos"
                onClick={() => setModalVideo(false)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-orange-500/20"
              >
                Ir para Cofrinhos
              </Link>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
