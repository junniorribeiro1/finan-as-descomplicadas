import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Send, Sparkles } from "lucide-react";
import { perguntarParaVera } from "@/lib/vera-ai";

export const Route = createFileRoute("/vera-gerente")({
  head: () => ({
    meta: [
      { title: "Vera | Gerente — OrganizaMais+" },
      {
        name: "description",
        content: "Sua gerente financeira com inteligência artificial.",
      },
    ],
  }),
  component: VeraGerente,
});

interface Mensagem {
  id: string;
  remetente: "vera" | "usuario";
  texto: string;
  hora: string;
}

const sugestoesRapidas = [
  "Como estão meus gastos deste mês?",
  "Onde posso economizar?",
  "Quanto falta para minha reserva?",
  "Devo aumentar meus investimentos?",
];

const respostasInteligentes: Record<string, string> = {
  "Como estão meus gastos deste mês?":
    "Seus gastos deste mês somam R$ 3.840,00 até agora. As categorias com maior peso são Moradia (42%) e Alimentação (25%). Você ainda está dentro do orçamento planejado para o período.",
  "Onde posso economizar?":
    "Identifiquei duas oportunidades de economia: você teve R$ 320,00 em pedidos de delivery no último fim de semana e duas assinaturas de streaming pouco utilizadas. Cortar 30% nisso pouparia cerca de R$ 180,00/mês.",
  "Quanto falta para minha reserva?":
    "Sua reserva de emergência atual cobre 4,2 meses do seu custo de vida essencial. Para atingir a meta recomendada de 6 meses (R$ 18.000,00), faltam apenas R$ 5.400,00. Mantendo o ritmo de aportes de R$ 900/mês, você atinge a meta em 6 meses!",
  "Devo aumentar meus investimentos?":
    "Com seus gastos fixos estabilizados e fluxo de caixa positivo neste mês, recomendo sim direcionar R$ 450,00 adicionais para Tesouro Selic ou CDB de liquidez diária antes de buscar renda variável.",
};

function VeraGerente() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      id: "msg-1",
      remetente: "vera",
      texto:
        "Oi! Eu sou a Vera, sua gerente financeira. Posso te ajudar a entender seus gastos, sugerir cortes e acompanhar seus cofrinhos. Como posso te ajudar hoje?",
      hora: "09:12",
    },
  ]);

  const [input, setInput] = useState("");
  const [carregando, setCarregando] = useState(false);
  const fimMensagensRef = useRef<HTMLDivElement>(null);

  const rolarParaFim = () => {
    fimMensagensRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    rolarParaFim();
  }, [mensagens, carregando]);

  const enviar = async (textoParaEnviar?: string) => {
    const conteudo = (textoParaEnviar ?? input).trim();
    if (!conteudo || carregando) return;

    const agora = new Date();
    const horaFormatada = agora.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const msgUsuario: Mensagem = {
      id: "user-" + Date.now(),
      remetente: "usuario",
      texto: conteudo,
      hora: horaFormatada,
    };

    setMensagens((prev) => [...prev, msgUsuario]);
    if (!textoParaEnviar) setInput("");
    setCarregando(true);

    const { texto: respostaTexto } = await perguntarParaVera(conteudo, mensagens);

    const msgVera: Mensagem = {
      id: "vera-" + Date.now(),
      remetente: "vera",
      texto: respostaTexto,
      hora: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMensagens((prev) => [...prev, msgVera]);
    setCarregando(false);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Card Banner da Vera com Ondas Roxas */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#161618] p-5 shadow-xl sm:rounded-3xl sm:p-6">
          <div className="relative z-10 flex items-center gap-4">
            {/* Avatar 3D Circular da Vera */}
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full shadow-lg shadow-purple-950/40 ring-2 ring-purple-500/40 sm:h-14 sm:w-14">
              <img
                src="/icons/kpi/vera-avatar-3d.png"
                alt="Vera | Gerente"
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a855f7] sm:text-[11px]">
                Assistente IA
              </span>
              <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Vera <span className="font-light text-neutral-400">|</span> Gerente
              </h1>
              <p className="mt-0.5 text-xs text-neutral-400 sm:text-sm">
                Sua gerente financeira com inteligência artificial.
              </p>
            </div>
          </div>

          {/* Arte de Ondas Fluídas Roxas / Seda no canto direito */}
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 hidden h-full w-[48%] select-none sm:block">
            <img
              src="/icons/kpi/vera-banner-waves.png"
              alt="Ondas fluidas roxas"
              className="h-full w-full object-cover object-right"
            />
          </div>
        </div>

        {/* Card Principal do Chat */}
        <div className="mt-6 flex min-h-[500px] flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#161618] p-5 shadow-xl sm:min-h-[560px] sm:rounded-3xl sm:p-6">
          {/* Lista de Mensagens */}
          <div className="flex-1 space-y-4 overflow-y-auto pr-1 pb-4">
            {mensagens.map((msg) => {
              const isVera = msg.remetente === "vera";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${
                    isVera ? "justify-start" : "justify-end"
                  }`}
                >
                  {isVera && (
                    <div className="mt-1 h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-purple-500/30 sm:h-8 sm:w-8">
                      <img
                        src="/icons/kpi/vera-avatar-3d.png"
                        alt="Vera"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed sm:max-w-xl sm:p-4 sm:text-sm ${
                      isVera
                        ? "rounded-tl-sm border border-white/[0.06] bg-[#1c1c1f] text-neutral-200"
                        : "rounded-tr-sm bg-gradient-to-r from-orange-500 to-amber-500 font-medium text-white shadow-md shadow-orange-500/20"
                    }`}
                  >
                    <p>{msg.texto}</p>
                    <span
                      className={`mt-1.5 block text-[10px] ${
                        isVera ? "text-neutral-500" : "text-orange-100/80"
                      }`}
                    >
                      {msg.hora}
                    </span>
                  </div>
                </div>
              );
            })}

            {carregando && (
              <div className="flex items-start gap-3 justify-start">
                <div className="mt-1 h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-purple-500/30 sm:h-8 sm:w-8">
                  <img
                    src="/icons/kpi/vera-avatar-3d.png"
                    alt="Vera"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="rounded-2xl rounded-tl-sm border border-white/[0.06] bg-[#1c1c1f] px-4 py-3 text-xs text-neutral-400 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="ml-1 text-[11px]">Vera está analisando...</span>
                </div>
              </div>
            )}

            <div ref={fimMensagensRef} />
          </div>

          {/* Sugestões Rápidas + Barra de Entrada */}
          <div className="mt-4 pt-2">
            {/* Pílulas de Sugestões de Perguntas */}
            <div className="mb-3.5 flex flex-wrap gap-2">
              {sugestoesRapidas.map((sugestao) => (
                <button
                  key={sugestao}
                  onClick={() => enviar(sugestao)}
                  disabled={carregando}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#1a1a1c]/80 px-3.5 py-1.5 text-xs text-neutral-300 transition-all hover:border-purple-500/40 hover:bg-purple-950/25 hover:text-white active:scale-95 disabled:opacity-50"
                >
                  <span className="font-semibold text-purple-400 transition-transform group-hover:scale-110">
                    #
                  </span>
                  <span>{sugestao}</span>
                </button>
              ))}
            </div>

            {/* Input Arredondado */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                enviar();
              }}
              className="relative flex items-center rounded-full border border-white/[0.08] bg-[#111113] px-4 py-2 shadow-inner transition-colors focus-within:border-purple-500/50 sm:py-2.5"
            >
              <input
                type="text"
                placeholder="Pergunte à Vera..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={carregando}
                className="flex-1 bg-transparent pr-3 text-xs text-white placeholder:text-neutral-500 focus:outline-none sm:text-sm"
              />
              <button
                type="submit"
                disabled={!input.trim() || carregando}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7c3aed] text-white shadow-md shadow-purple-900/40 transition-all hover:bg-[#6d28d9] active:scale-95 disabled:opacity-40 disabled:hover:bg-[#7c3aed]"
                title="Enviar mensagem"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
