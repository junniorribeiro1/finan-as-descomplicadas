import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Send, Sparkles, Check, Edit2, Bot, ShieldCheck } from "lucide-react";
import { perguntarParaVera } from "@/lib/vera-ai";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { STORAGE_KEY } from "@/components/app/PassoAPassoWidget";

export const Route = createFileRoute("/vera-gerente")({
  head: () => ({
    meta: [
      { title: "Vera | Gerente — OrganizAI" },
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

function VeraGerente() {
  const { user, profile, refreshProfile } = useAuth();

  const [isAtivada, setIsAtivada] = useState(false);
  const [nomeTratamento, setNomeTratamento] = useState("");
  const [nomeInput, setNomeInput] = useState("");
  const [editandoNome, setEditandoNome] = useState(false);
  const [salvandoAtivacao, setSalvandoAtivacao] = useState(false);
  const [iniciado, setIniciado] = useState(false);

  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [input, setInput] = useState("");
  const [carregando, setCarregando] = useState(false);
  const fimMensagensRef = useRef<HTMLDivElement>(null);

  // Carrega status de ativação e nome exclusivo do usuário
  useEffect(() => {
    if (!user) return;

    const keyAtivada = `vera_ativada_${user.id}`;
    const keyNome = `vera_nome_${user.id}`;

    let nomeSalvo = "";
    let ativadaLocal = false;

    if (typeof window !== "undefined") {
      ativadaLocal = localStorage.getItem(keyAtivada) === "true";
      nomeSalvo = localStorage.getItem(keyNome) || "";
    }

    const ativadaSupabase = Boolean(profile?.vera_activated_at);
    const nomeSupabase = profile?.preferred_name || "";

    const finalAtivada = ativadaSupabase || ativadaLocal;
    const finalNome =
      nomeSupabase ||
      nomeSalvo ||
      profile?.full_name?.split(" ")[0] ||
      user.user_metadata?.full_name?.split(" ")[0] ||
      "";

    setIsAtivada(finalAtivada);
    setNomeTratamento(finalNome);
    setNomeInput(finalNome);

    // Inicializa mensagem de boas-vindas da Vera
    const saudacao = finalNome ? `Oi, ${finalNome}!` : "Oi!";
    setMensagens([
      {
        id: "msg-1",
        remetente: "vera",
        texto: `${saudacao} Eu sou a Vera, sua gerente financeira com inteligência artificial do OrganizAI. Posso te ajudar a analisar seus gastos, sugerir cortes e acompanhar seus cofrinhos. Como posso te ajudar hoje?`,
        hora: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setIniciado(true);
  }, [user, profile]);

  const rolarParaFim = () => {
    fimMensagensRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isAtivada) {
      rolarParaFim();
    }
  }, [mensagens, carregando, isAtivada]);

  // Ativação da Vera e conclusão do passo no Passo a Passo
  const handleAtivarVera = async (e: React.FormEvent) => {
    e.preventDefault();
    const nomeLimpo = nomeInput.trim();

    if (!nomeLimpo || nomeLimpo.length < 2) {
      toast.error("Por favor, informe um nome ou apelido com pelo menos 2 letras.");
      return;
    }

    setSalvandoAtivacao(true);

    try {
      if (user) {
        // 1. Salva no banco Supabase no perfil exclusivo do usuário
        await supabase
          .from("profiles")
          .update({
            preferred_name: nomeLimpo,
            vera_activated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        // 2. Salva no localStorage com a chave individual do usuário
        localStorage.setItem(`vera_ativada_${user.id}`, "true");
        localStorage.setItem(`vera_nome_${user.id}`, nomeLimpo);
      }

      // 3. Conclui automaticamente a etapa da Vera no Passo a Passo
      let totalJaConcluidos = 0;
      if (typeof window !== "undefined") {
        try {
          const passosSalvos = localStorage.getItem(STORAGE_KEY);
          let passos: string[] = passosSalvos ? JSON.parse(passosSalvos) : [];
          if (!passos.includes("passo-7")) {
            passos.push("passo-7");
            localStorage.setItem(STORAGE_KEY, JSON.stringify(passos));
            window.dispatchEvent(new Event("organizai_passo_sync"));
          }
          totalJaConcluidos = passos.length;
        } catch {
          // No-op
        }
      }

      // 4. Se com esse passo atingiu todos os 7 passos, dispara confetes!
      if (totalJaConcluidos >= 7) {
        try {
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#F97316", "#10B981", "#8B5CF6", "#F59E0B", "#3B82F6"],
          });
        } catch {
          // No-op
        }
      }

      setNomeTratamento(nomeLimpo);
      setIsAtivada(true);
      setEditandoNome(false);

      // Atualiza primeira mensagem de boas-vindas com o nome escolhido
      setMensagens([
        {
          id: "msg-1",
          remetente: "vera",
          texto: `Prazer em te conhecer, ${nomeLimpo}! Eu sou a Vera, sua gerente financeira com inteligência artificial do OrganizAI. Já memorizei seu nome e estou pronta para te ajudar a descomplicar suas contas, identificar economias e acelerar seus objetivos. Como posso te ajudar hoje?`,
          hora: new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

      if (refreshProfile) {
        await refreshProfile();
      }

      toast.success(`Vera ativada com sucesso! Bem-vindo(a), ${nomeLimpo}! 🎉`, {
        description: "A etapa 'Vera | Gerente' no Passo a Passo foi concluída.",
      });
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar ativação. Tente novamente.");
    } finally {
      setSalvandoAtivacao(false);
    }
  };

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

    const { texto: respostaTexto } = await perguntarParaVera(
      conteudo,
      mensagens,
      nomeTratamento
    );

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
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
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

            {/* Status de Ativação / Nome exclusivo do usuário */}
            {isAtivada && (
              <div className="self-start sm:self-auto flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1.5 text-xs text-purple-300 shadow-sm">
                <Bot className="h-3.5 w-3.5 text-purple-400" />
                <span>
                  Ativa para <strong className="text-white">{nomeTratamento}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setEditandoNome(true)}
                  className="p-1 hover:text-white transition-colors"
                  title="Alterar como a Vera me chama"
                >
                  <Edit2 className="h-3 w-3" />
                </button>
              </div>
            )}
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

        {/* Modal de Edição Rápida do Nome */}
        {editandoNome && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-3xl border border-purple-500/30 bg-[#161618] p-6 shadow-2xl">
              <h3 className="text-base font-bold text-white">
                Como a Vera deve te chamar?
              </h3>
              <p className="mt-1 text-xs text-stone-400 leading-relaxed">
                A Vera usará esse nome exclusivo em todas as orientações e respostas.
              </p>
              <form onSubmit={handleAtivarVera} className="mt-4 space-y-4">
                <input
                  type="text"
                  value={nomeInput}
                  onChange={(e) => setNomeInput(e.target.value)}
                  placeholder="Ex.: Junnior, Natalia, Dani..."
                  className="w-full rounded-xl border border-white/10 bg-[#111113] px-3.5 py-2.5 text-sm text-white placeholder:text-stone-500 outline-none focus:border-purple-500 transition-colors"
                />
                <div className="flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setEditandoNome(false)}
                    className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-stone-300 hover:bg-white/5 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={salvandoAtivacao}
                    className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-purple-950/40 hover:brightness-110 transition-all"
                  >
                    {salvandoAtivacao ? "Salvando..." : "Atualizar Nome"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TELA DE ATIVAÇÃO PRÉVIA (Se ainda não ativou a Vera) */}
        {!isAtivada && iniciado ? (
          <div className="mt-6 rounded-2xl border border-purple-500/25 bg-[#161618] p-6 sm:p-10 shadow-2xl shadow-purple-950/20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 mb-5 shadow-lg shadow-purple-950/40">
              <Sparkles className="h-8 w-8 animate-pulse" />
            </div>

            <span className="text-[11px] font-black uppercase tracking-widest text-[#a855f7]">
              ETAPA DE ATIVAÇÃO
            </span>
            <h2 className="mt-1 text-2xl font-bold text-white tracking-tight sm:text-3xl">
              Ative sua Gerente Financeira IA
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-xs sm:text-sm text-stone-300 leading-relaxed">
              Antes de iniciar sua primeira conversa, informe como a Vera poderá
              chamá-lo(a). Ela lembrará do seu nome em todas as orientações,
              concluindo também este passo da sua jornada inicial.
            </p>

            <form
              onSubmit={handleAtivarVera}
              className="mx-auto mt-6 max-w-sm text-left"
            >
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Como a Vera pode te chamar?
              </label>
              <input
                type="text"
                required
                value={nomeInput}
                onChange={(e) => setNomeInput(e.target.value)}
                placeholder="Ex.: Junnior, Dani, Marcelo..."
                className="w-full rounded-xl border border-white/10 bg-[#111113] px-4 py-3 text-sm text-white placeholder:text-stone-500 outline-none focus:border-purple-500/80 transition-colors shadow-inner"
              />

              <button
                type="submit"
                disabled={salvandoAtivacao || !nomeInput.trim()}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:brightness-110 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-purple-950/40 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>
                  {salvandoAtivacao
                    ? "Ativando assistente..."
                    : "Ativar Assistente IA"}
                </span>
              </button>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Configuração exclusiva para o seu perfil.</span>
              </div>
            </form>
          </div>
        ) : (
          /* CARD PRINCIPAL DO CHAT (Quando já está ativada) */
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
                  placeholder={`Pergunte à Vera${nomeTratamento ? `, ${nomeTratamento}` : ""}...`}
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
        )}
      </div>
    </AppShell>
  );
}

