import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, useMemo } from "react";
import { AppShell } from "@/components/app/AppShell";
import {
  Send,
  Sparkles,
  Check,
  Edit2,
  Bot,
  ShieldCheck,
  Lock,
  Clock,
  RotateCcw,
  MessageCircle,
  Instagram,
  Mail,
  ExternalLink,
} from "lucide-react";
import { perguntarParaSamy } from "@/lib/vera-ai";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { STORAGE_KEY } from "@/components/app/PassoAPassoWidget";
import {
  LIMITE_DIARIO_SAMY,
  obterStatusCreditosSamy,
  registrarEnvioMensagemSamy,
  type StatusCreditosSamy,
} from "@/lib/vera-credits";
import {
  carregarDadosFinanceirosUsuario,
  obterDadosFinanceirosCache,
} from "@/lib/financial-service";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vera-gerente")({
  head: () => ({
    meta: [
      { title: "Samy | Assistente IA — Organiz.AI" },
      {
        name: "description",
        content: "Sua assistente financeira com inteligência artificial.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SamyGerente,
});

interface Mensagem {
  id: string;
  remetente: "samy" | "usuario" | "vera";
  texto: string;
  hora: string;
}

const sugestoesRapidas = [
  "Como estão meus gastos no app?",
  "Qual o total das minhas despesas fixas?",
  "Como funciona a separação PF e PJ no app?",
  "Qual o saldo total das minhas contas no app?",
];

function FormatadorLinha({ texto }: { texto: string }) {
  // Regex para identificar links markdown [label](url), negritos **bold**, e URLs soltas
  const regex = /(\[[^\]]+\]\([^\)]+\)|\*\*[^*]+\*\*|https?:\/\/[^\s\)]+|mailto:[^\s\)]+)/g;
  const partes = texto.split(regex);

  return (
    <>
      {partes.map((parte, i) => {
        if (!parte) return null;

        // Link markdown: [texto](url)
        const matchLink = parte.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (matchLink) {
          const [, label, url] = matchLink;
          return (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-purple-400 underline underline-offset-2 hover:text-purple-300 transition-colors"
            >
              <span>{label}</span>
              <ExternalLink className="inline h-3 w-3 shrink-0 opacity-70" />
            </a>
          );
        }

        // Negrito: **texto**
        const matchBold = parte.match(/^\*\*([^*]+)\*\*$/);
        if (matchBold) {
          return (
            <strong key={i} className="font-bold text-white">
              {matchBold[1]}
            </strong>
          );
        }

        // URL solta
        if (parte.startsWith("http://") || parte.startsWith("https://") || parte.startsWith("mailto:")) {
          return (
            <a
              key={i}
              href={parte}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-purple-400 underline underline-offset-2 hover:text-purple-300 transition-colors break-all"
            >
              <span>{parte}</span>
              <ExternalLink className="inline h-3 w-3 shrink-0 opacity-70" />
            </a>
          );
        }

        return <span key={i}>{parte}</span>;
      })}
    </>
  );
}

function isLinhaCanalSuporte(linha: string): boolean {
  const l = linha.trim().toLowerCase();
  if (!l) return false;

  // URLs isoladas ou entre parênteses
  if (
    l.startsWith("(https://wa.me") ||
    l.startsWith("https://wa.me") ||
    l.startsWith("(mailto:") ||
    l.startsWith("mailto:") ||
    l.startsWith("(https://www.instagram.com") ||
    l.startsWith("(https://instagram.com") ||
    l.startsWith("https://www.instagram.com")
  ) {
    return true;
  }

  // Linhas com marcadores de canais de suporte (WhatsApp, E-mail, Instagram)
  const temWhatsApp =
    l.includes("whatsapp") &&
    (l.includes("98138") || l.includes("wa.me") || l.startsWith("-") || l.startsWith("•"));

  const temEmail =
    (l.includes("e-mail") || l.includes("email")) &&
    (l.includes("suporte@") || l.includes("nataliarodolfo") || l.startsWith("-") || l.startsWith("•"));

  const temInstagram =
    l.includes("instagram") &&
    (l.includes("nataliafinancas") || l.startsWith("-") || l.startsWith("•"));

  const ehCabecalhoCanais =
    l === "canais oficiais:" ||
    l === "nossos canais oficiais:" ||
    l === "utilize nossos canais oficiais:" ||
    l === "canais de atendimento:";

  return temWhatsApp || temEmail || temInstagram || ehCabecalhoCanais;
}

function MensagemConteudo({ texto, isSamy }: { texto: string; isSamy: boolean }) {
  // 1. Substitui qualquer referência anterior para o Instagram oficial de suporte
  let textoAjustado = texto
    .replace(/@nataliarodolfo\.financas/g, "@nataliafinancas")
    .replace(/instagram\.com\/nataliarodolfo\.financas/g, "instagram.com/nataliafinancas")
    .replace(/Organiz\.Al/g, "Organiz.AI");

  // 2. Corrige quebra indevida de markdown gerada pela IA, onde [Texto] e (Link) foram para linhas separadas
  // Exemplo: - **WhatsApp:** [WhatsApp de Suporte (77 98138-1477)] \n (https://wa.me/5577981381477)
  textoAjustado = textoAjustado.replace(
    /\[([^\]]+)\]\s*\n+\s*\((https?:\/\/[^\s\)]+|mailto:[^\s\)]+)\)/g,
    "[$1]($2)"
  );

  // 3. Detecta se a mensagem menciona canais de suporte para exibir os botões interativos
  const textoMin = textoAjustado.toLowerCase();
  const temMencaoSuporte =
    isSamy &&
    (textoMin.includes("suporte") ||
      textoMin.includes("equipe de suporte") ||
      textoMin.includes("wa.me") ||
      textoMin.includes("98138-1477") ||
      textoMin.includes("whatsapp") ||
      textoMin.includes("nataliafinancas"));

  // 4. Divide em linhas. Se houver menção a suporte, remove os marcadores textuais brutos para manter APENAS os botões de acesso rápido
  const todasLinhas = textoAjustado.split("\n");
  const linhas = temMencaoSuporte
    ? todasLinhas.filter((linha) => !isLinhaCanalSuporte(linha))
    : todasLinhas;

  return (
    <div className="space-y-1.5">
      <div className="space-y-1">
        {linhas.map((linha, idx) => {
          if (!linha.trim()) {
            return <div key={idx} className="h-1.5" />;
          }

          const isBullet = linha.trim().startsWith("- ") || linha.trim().startsWith("• ");
          const conteudoLinha = isBullet ? linha.trim().replace(/^[-•]\s*/, "") : linha;

          return (
            <div
              key={idx}
              className={`leading-relaxed ${
                isBullet ? "flex items-start gap-2 pl-1" : ""
              }`}
            >
              {isBullet && (
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
              )}
              <div className="flex-1">
                <FormatadorLinha texto={conteudoLinha} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Cartão de Acesso Direto aos Canais de Suporte Oficiais */}
      {temMencaoSuporte && (
        <div className="mt-3.5 pt-3 border-t border-white/10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-2">
            Acesso Rápido aos Canais de Suporte:
          </span>
          <div className="flex flex-wrap gap-2">
            <a
              href="https://wa.me/5577981381477"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 hover:bg-emerald-500/25 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition-all shadow-sm active:scale-95"
            >
              <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />
              <span>WhatsApp: (77) 98138-1477</span>
            </a>

            <a
              href="https://www.instagram.com/nataliafinancas"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-pink-500/30 bg-gradient-to-r from-purple-500/15 to-pink-500/15 hover:from-purple-500/25 hover:to-pink-500/25 px-3 py-1.5 text-xs font-semibold text-pink-300 hover:text-pink-200 transition-all shadow-sm active:scale-95"
            >
              <Instagram className="h-3.5 w-3.5 text-pink-400" />
              <span>Instagram: @nataliafinancas</span>
            </a>

            <a
              href="mailto:suporte@nataliarodolfo.com.br"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-semibold text-stone-300 hover:text-white transition-all shadow-sm active:scale-95"
            >
              <Mail className="h-3.5 w-3.5 text-indigo-400" />
              <span>suporte@nataliarodolfo.com.br</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function formatarContextoFinanceiro(dados: any, tipoConta: string): string {
  if (!dados) return "Nenhum dado financeiro registrado no momento.";

  const fixos = dados.gastosFixos || [];
  const variaveis = dados.gastosVariaveis || [];
  const bancos = dados.bancos || [];
  const cofrinhos = dados.cofrinhos || [];
  const cartoes = dados.cartoes || [];
  const recebimentos = dados.recebimentos || [];

  const fixosFiltrados = fixos.filter((f: any) => (f.tipoConta || "pessoal") === tipoConta);
  const totalFixos = fixosFiltrados.filter((f: any) => f.ativo).reduce((acc: number, f: any) => acc + (f.valor || 0), 0);
  const totalFixosPagos = fixosFiltrados.filter((f: any) => f.ativo && f.status === "Pago").reduce((acc: number, f: any) => acc + (f.valor || 0), 0);
  const totalFixosPendentes = Math.max(0, totalFixos - totalFixosPagos);

  const varFiltrados = variaveis.filter((v: any) => (v.tipoConta || "pessoal") === tipoConta);
  const totalVar = varFiltrados.reduce((acc: number, v: any) => acc + (v.valor || 0), 0);

  const recFiltrados = recebimentos.filter((r: any) => (r.tipoConta || "pessoal") === tipoConta);
  const totalReceitas = recFiltrados.reduce((acc: number, r: any) => acc + (r.valor || 0), 0);

  const bancosFiltrados = bancos.filter((b: any) => (b.tipoConta || "pessoal") === tipoConta);
  const totalSaldo = bancosFiltrados.reduce((acc: number, b: any) => acc + (b.saldo || 0), 0);

  const cartoesFiltrados = cartoes.filter((c: any) => (c.tipoConta || "pessoal") === tipoConta);
  const cofrinhosFiltrados = cofrinhos.filter((cof: any) => (cof.tipoConta || "pessoal") === tipoConta);

  const resumoBancos = bancosFiltrados.length > 0
    ? bancosFiltrados.map((b: any) => `${b.banco} (${b.tipo}): R$ ${Number(b.saldo).toFixed(2)}`).join(" | ")
    : "Nenhum banco cadastrado";

  const resumoCartoes = cartoesFiltrados.length > 0
    ? cartoesFiltrados.map((c: any) => `${c.nome}: limite R$ ${Number(c.limiteTotal).toFixed(2)}, fatura atual R$ ${Number(c.faturaAtual).toFixed(2)} (vencimento dia ${c.diaVencimento})`).join(" | ")
    : "Nenhum cartão cadastrado";

  const resumoCofrinhos = cofrinhosFiltrados.length > 0
    ? cofrinhosFiltrados.map((cof: any) => `${cof.titulo}: acumulado R$ ${Number(cof.valorAtual).toFixed(2)} / meta R$ ${Number(cof.metaValor).toFixed(2)}`).join(" | ")
    : "Nenhum cofrinho cadastrado";

  return `Conta Selecionada: ${tipoConta.toUpperCase()}
• Gastos Fixos Ativos: R$ ${totalFixos.toFixed(2)} (R$ ${totalFixosPagos.toFixed(2)} pagos, R$ ${totalFixosPendentes.toFixed(2)} pendentes)
• Gastos Variáveis: R$ ${totalVar.toFixed(2)} (${varFiltrados.length} lançamentos)
• Total de Recebimentos: R$ ${totalReceitas.toFixed(2)}
• Saldo em Contas Bancárias: R$ ${totalSaldo.toFixed(2)}
• Bancos: ${resumoBancos}
• Cartões de Crédito: ${resumoCartoes}
• Metas/Cofrinhos: ${resumoCofrinhos}`;
}

function SamyGerente() {
  const { user, profile, refreshProfile, isAdmin } = useAuth();

  const [isAtivada, setIsAtivada] = useState(false);
  const [nomeTratamento, setNomeTratamento] = useState("");
  const [nomeInput, setNomeInput] = useState("");
  const [editandoNome, setEditandoNome] = useState(false);
  const [salvandoAtivacao, setSalvandoAtivacao] = useState(false);
  const [iniciado, setIniciado] = useState(false);

  // Tipo de conta atual (pessoal ou empresa)
  const [tipoConta, setTipoConta] = useState<"pessoal" | "empresa">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("organizai_tipo_conta") as "pessoal" | "empresa") || "pessoal";
    }
    return "pessoal";
  });

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail) setTipoConta(e.detail);
      else if (typeof window !== "undefined") {
        const stored = localStorage.getItem("organizai_tipo_conta") as "pessoal" | "empresa";
        if (stored) setTipoConta(stored);
      }
    };
    window.addEventListener("organizai_tipo_conta_sync", handler);
    return () => window.removeEventListener("organizai_tipo_conta_sync", handler);
  }, []);

  // Dados financeiros reais do usuário para alimentar a IA
  const [dadosFinanceiros, setDadosFinanceiros] = useState<any>(() => {
    if (user?.id) return obterDadosFinanceirosCache(user.id);
    return null;
  });

  useEffect(() => {
    if (!user?.id) return;
    carregarDadosFinanceirosUsuario(user.id)
      .then((d) => setDadosFinanceiros(d))
      .catch(() => {});
  }, [user?.id]);

  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [historicoCarregado, setHistoricoCarregado] = useState(false);
  const [input, setInput] = useState("");
  const [carregando, setCarregando] = useState(false);
  const fimMensagensRef = useRef<HTMLDivElement>(null);

  // Status de créditos diários da Samy
  const [creditos, setCreditos] = useState<StatusCreditosSamy>(() =>
    obterStatusCreditosSamy(user?.id, isAdmin, profile)
  );

  // Atualiza créditos sempre que user, profile ou status admin mudarem
  useEffect(() => {
    setCreditos(obterStatusCreditosSamy(user?.id, isAdmin, profile));
  }, [user?.id, isAdmin, profile]);

  // Escuta sincronização externa/entre abas de créditos e atualiza o relógio a cada 60s
  useEffect(() => {
    const atualizar = () => {
      setCreditos(obterStatusCreditosSamy(user?.id, isAdmin, profile));
    };

    window.addEventListener("organizai_vera_creditos_sync", atualizar);
    const interval = setInterval(atualizar, 60000);

    return () => {
      window.removeEventListener("organizai_vera_creditos_sync", atualizar);
      clearInterval(interval);
    };
  }, [user?.id, isAdmin, profile]);

  // Carrega status de ativação, nome exclusivo e histórico de conversas do usuário
  useEffect(() => {
    if (!user) return;

    const keyAtivadaSamy = `samy_ativada_${user.id}`;
    const keyAtivadaVera = `vera_ativada_${user.id}`;
    const keyNomeSamy = `samy_nome_${user.id}`;
    const keyNomeVera = `vera_nome_${user.id}`;

    let nomeSalvo = "";
    let ativadaLocal = false;

    if (typeof window !== "undefined") {
      ativadaLocal =
        localStorage.getItem(keyAtivadaSamy) === "true" ||
        localStorage.getItem(keyAtivadaVera) === "true";
      nomeSalvo =
        localStorage.getItem(keyNomeSamy) ||
        localStorage.getItem(keyNomeVera) ||
        "";
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

    // Carrega histórico de mensagens anteriores salvo no dispositivo para este usuário
    const keyHistorico = `organizai_samy_chat_history_${user.id}`;
    let historicoSalvo: Mensagem[] = [];

    if (typeof window !== "undefined") {
      try {
        const item = localStorage.getItem(keyHistorico);
        if (item) {
          const parsed = JSON.parse(item);
          if (Array.isArray(parsed) && parsed.length > 0) {
            historicoSalvo = parsed;
          }
        }
      } catch (e) {
        console.error("Erro ao carregar histórico anterior da Samy:", e);
      }
    }

    if (historicoSalvo.length > 0) {
      setMensagens(historicoSalvo);
    } else {
      // Inicializa com a mensagem oficial de boas-vindas da Samy
      const saudacao = finalNome ? `Oi, ${finalNome}!` : "Oi!";
      setMensagens([
        {
          id: "msg-1",
          remetente: "samy",
          texto: `${saudacao} Eu sou a Samy, sua assistente com inteligência artificial do Organiz.AI. Estou pronta para analisar os lançamentos do seu aplicativo (gastos fixos, variáveis, cartões, cofrinhos e bancos) e te ajudar a entender o funcionamento da plataforma. Como posso te ajudar hoje?`,
          hora: new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }

    setHistoricoCarregado(true);
    setIniciado(true);
  }, [user, profile]);

  // Persiste conversas anteriores no histórico local individual de cada usuário
  useEffect(() => {
    if (!historicoCarregado || !user?.id || mensagens.length === 0) return;
    try {
      localStorage.setItem(
        `organizai_samy_chat_history_${user.id}`,
        JSON.stringify(mensagens)
      );
    } catch (e) {
      console.error("Erro ao salvar histórico de chat da Samy:", e);
    }
  }, [mensagens, historicoCarregado, user?.id]);

  // Limpar e reiniciar conversa
  const handleLimparHistorico = () => {
    if (typeof window !== "undefined") {
      const confirmou = window.confirm(
        "Deseja reiniciar a conversa e limpar o histórico anterior com a Samy?"
      );
      if (!confirmou) return;
    }

    const saudacao = nomeTratamento ? `Oi, ${nomeTratamento}!` : "Oi!";
    const msgReset: Mensagem = {
      id: "msg-" + Date.now(),
      remetente: "samy",
      texto: `${saudacao} Conversa reiniciada com sucesso! Como posso te ajudar agora com suas finanças ou navegação no Organiz.AI?`,
      hora: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMensagens([msgReset]);
    if (user?.id && typeof window !== "undefined") {
      try {
        localStorage.removeItem(`organizai_samy_chat_history_${user.id}`);
      } catch (e) {
        console.error(e);
      }
    }
    toast.success("Histórico da conversa reiniciado.");
  };

  const rolarParaFim = () => {
    fimMensagensRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isAtivada) {
      rolarParaFim();
    }
  }, [mensagens, carregando, isAtivada]);

  // Ativação da Samy e conclusão do passo no Passo a Passo
  const handleAtivarSamy = async (e: React.FormEvent) => {
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
        localStorage.setItem(`samy_ativada_${user.id}`, "true");
        localStorage.setItem(`samy_nome_${user.id}`, nomeLimpo);
        localStorage.setItem(`vera_ativada_${user.id}`, "true");
        localStorage.setItem(`vera_nome_${user.id}`, nomeLimpo);
      }

      // 3. Conclui automaticamente a etapa no Passo a Passo
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

      // Atualiza primeira mensagem de boas-vindas com o nome escolhido mantendo histórico caso já exista
      setMensagens((prev) => {
        if (prev.length <= 1) {
          return [
            {
              id: "msg-1",
              remetente: "samy",
              texto: `Prazer em te conhecer, ${nomeLimpo}! Eu sou a Samy, sua assistente com inteligência artificial do Organiz.AI. Já memorizei seu nome e estou pronta para te ajudar a navegar pelo app e analisar seus números. Como posso te ajudar hoje?`,
              hora: new Date().toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ];
        }
        return prev;
      });

      if (refreshProfile) {
        await refreshProfile();
      }

      toast.success(`Samy ativada com sucesso! Bem-vindo(a), ${nomeLimpo}! 🎉`, {
        description: "A etapa 'Samy | Assistente IA' no Passo a Passo foi concluída.",
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

    // Se usuário não for admin e atingiu o limite diário de 10 mensagens
    if (!isAdmin && creditos.isBloqueado) {
      toast.error("Limite diário de 10 mensagens atingido!", {
        description: `Seus créditos serão renovados em ${creditos.proximaRenovacaoFormatada}.`,
      });
      return;
    }

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

    // Registra envio e atualiza contagem de créditos do ciclo atual
    if (user?.id && !isAdmin) {
      const { novoEnviadas, isBloqueado } = await registrarEnvioMensagemSamy(
        user.id,
        isAdmin,
        profile
      );
      setCreditos((prev) => ({
        ...prev,
        mensagensEnviadas: novoEnviadas,
        mensagensRestantes: Math.max(0, LIMITE_DIARIO_SAMY - novoEnviadas),
        isBloqueado: Boolean(isBloqueado),
      }));
    }

    // Contexto financeiro do usuário logado (estritamente do seu histórico no app)
    const contextoFormatado = formatarContextoFinanceiro(dadosFinanceiros, tipoConta);

    const { texto: respostaTexto } = await perguntarParaSamy(
      conteudo,
      mensagens,
      nomeTratamento,
      contextoFormatado
    );

    const msgSamy: Mensagem = {
      id: "samy-" + Date.now(),
      remetente: "samy",
      texto: respostaTexto,
      hora: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMensagens((prev) => [...prev, msgSamy]);
    setCarregando(false);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-3 py-4 sm:px-6 sm:py-6 flex flex-col h-[calc(100dvh-5.5rem)] max-h-[880px] min-h-[520px]">
        {/* Card Banner da Samy */}
        <div className="relative shrink-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#161618] p-4 sm:p-5 shadow-xl sm:rounded-3xl">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar 3D Circular da Samy */}
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full shadow-lg shadow-purple-950/40 ring-2 ring-purple-500/40 sm:h-14 sm:w-14">
                <img
                  src="/icons/kpi/vera-avatar-3d.png"
                  alt="Samy | Assistente IA"
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a855f7] sm:text-[11px]">
                  Assistente IA
                </span>
                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Samy <span className="font-light text-neutral-400">|</span> Assistente IA
                </h1>
                <p className="mt-0.5 text-xs text-neutral-400 sm:text-sm">
                  Sua assistente financeira com inteligência artificial.
                </p>
              </div>
            </div>

            {/* Status de Ativação / Nome exclusivo do usuário & Créditos */}
            {isAtivada && (
              <div className="self-start sm:self-auto flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1.5 text-xs text-purple-300 shadow-sm">
                  <Bot className="h-3.5 w-3.5 text-purple-400" />
                  <span>
                    Ativa para <strong className="text-white">{nomeTratamento}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditandoNome(true)}
                    className="p-1 hover:text-white transition-colors"
                    title="Alterar como a Samy me chama"
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                </div>

                {/* Badge de Créditos Diários */}
                {isAdmin ? (
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/15 px-3.5 py-1.5 text-xs font-bold text-amber-300 shadow-sm">
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                    <span>Ilimitado (Admin)</span>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium shadow-sm transition-colors",
                      creditos.isBloqueado
                        ? "border-amber-500/40 bg-amber-500/15 text-amber-300"
                        : creditos.mensagensRestantes <= 2
                        ? "border-amber-500/30 bg-[#1f1d1a] text-amber-200"
                        : "border-purple-500/30 bg-[#1a1922] text-stone-300"
                    )}
                  >
                    {creditos.isBloqueado ? (
                      <Lock className="h-3 w-3 text-amber-400" />
                    ) : (
                      <Sparkles className="h-3 w-3 text-purple-400" />
                    )}
                    <span>
                      {creditos.isBloqueado ? (
                        <strong>0 de {LIMITE_DIARIO_SAMY} créditos hoje</strong>
                      ) : (
                        <>
                          <strong className="text-white">{creditos.mensagensRestantes}</strong> de{" "}
                          {LIMITE_DIARIO_SAMY} créditos hoje
                        </>
                      )}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Arte de Ondas Fluídas Roxas no canto direito */}
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
                Como a Samy deve te chamar?
              </h3>
              <p className="mt-1 text-xs text-stone-400 leading-relaxed">
                A Samy usará esse nome exclusivo em todas as orientações e respostas.
              </p>
              <form onSubmit={handleAtivarSamy} className="mt-4 space-y-4">
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

        {/* TELA DE ATIVAÇÃO PRÉVIA (Se ainda não ativou a Samy) */}
        {!isAtivada && iniciado ? (
          <div className="mt-4 flex-1 min-h-0 overflow-y-auto chat-scrollbar rounded-2xl border border-purple-500/25 bg-[#161618] p-6 sm:p-10 shadow-2xl shadow-purple-950/20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 mb-5 shadow-lg shadow-purple-950/40">
              <Sparkles className="h-8 w-8 animate-pulse" />
            </div>

            <span className="text-[11px] font-black uppercase tracking-widest text-[#a855f7]">
              ETAPA DE ATIVAÇÃO
            </span>
            <h2 className="mt-1 text-2xl font-bold text-white tracking-tight sm:text-3xl">
              Ative sua Assistente Financeira IA
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-xs sm:text-sm text-stone-300 leading-relaxed">
              Antes de iniciar sua primeira conversa, informe como a Samy poderá
              chamá-lo(a). Ela lembrará do seu nome em todas as orientações,
              concluindo também este passo da sua jornada inicial.
            </p>

            <form
              onSubmit={handleAtivarSamy}
              className="mx-auto mt-6 max-w-sm text-left"
            >
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Como a Samy pode te chamar?
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
          <div className="mt-4 flex flex-1 min-h-0 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#161618] p-4 sm:p-5 shadow-xl sm:rounded-3xl">
            {/* Barra de Topo do Chat: Status do Histórico e Botão Nova Conversa */}
            <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-stone-200">Histórico de Mensagens</span>
                <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-stone-400 font-medium">
                  {mensagens.length} {mensagens.length === 1 ? "mensagem" : "mensagens"}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLimparHistorico}
                title="Reiniciar conversa e limpar histórico"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-stone-400 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-pointer active:scale-95"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Nova conversa</span>
              </button>
            </div>

            {/* Lista de Mensagens com Rolagem Interna (.chat-scrollbar) */}
            <div className="flex-1 min-h-0 space-y-4 overflow-y-auto chat-scrollbar pr-2 pb-2">
              {mensagens.map((msg) => {
                const isSamy = msg.remetente === "samy" || msg.remetente === "vera";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${
                      isSamy ? "justify-start" : "justify-end"
                    }`}
                  >
                    {isSamy && (
                      <div className="mt-1 h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-purple-500/30 sm:h-8 sm:w-8">
                        <img
                          src="/icons/kpi/vera-avatar-3d.png"
                          alt="Samy"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    <div
                      className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed sm:max-w-xl sm:p-4 sm:text-sm ${
                        isSamy
                          ? "rounded-tl-sm border border-white/[0.06] bg-[#1c1c1f] text-neutral-200"
                          : "rounded-tr-sm bg-gradient-to-r from-orange-500 to-amber-500 font-medium text-white shadow-md shadow-orange-500/20"
                      }`}
                    >
                      <MensagemConteudo texto={msg.texto} isSamy={isSamy} />
                      <span
                        className={`mt-2 block text-[10px] ${
                          isSamy ? "text-neutral-500" : "text-orange-100/80"
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
                      alt="Samy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm border border-white/[0.06] bg-[#1c1c1f] px-4 py-3 text-xs text-neutral-400 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]"></span>
                    <span className="ml-1 text-[11px]">Samy está analisando...</span>
                  </div>
                </div>
              )}

              <div ref={fimMensagensRef} />
            </div>

            {/* Sugestões Rápidas + Barra de Entrada Fixa no Fundo */}
            <div className="shrink-0 mt-3 pt-3 border-t border-white/[0.06]">
              {!creditos.isBloqueado ? (
                <>
                  {/* Pílulas de Sugestões de Perguntas (rolagem horizontal suave em telas menores) */}
                  <div className="mb-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:flex-wrap">
                    {sugestoesRapidas.map((sugestao) => (
                      <button
                        key={sugestao}
                        onClick={() => enviar(sugestao)}
                        disabled={carregando}
                        className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-[#1a1a1c]/80 px-3 py-1.5 text-xs text-neutral-300 transition-all hover:border-purple-500/40 hover:bg-purple-950/25 hover:text-white active:scale-95 disabled:opacity-50"
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
                      placeholder={`Pergunte à Samy${nomeTratamento ? `, ${nomeTratamento}` : ""}...`}
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
                </>
              ) : (
                /* Card de Bloqueio de Créditos Diários - Estilo ChatGPT */
                <div className="rounded-2xl border border-amber-500/25 bg-gradient-to-b from-[#1c1815] to-[#121214] p-5 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 mb-3 shadow-md shadow-amber-950/40">
                    <Lock className="h-5 w-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white tracking-tight sm:text-base">
                    Limite diário de 10 mensagens atingido
                  </h4>
                  <p className="mx-auto mt-1.5 max-w-lg text-xs sm:text-sm text-stone-300 leading-relaxed">
                    No <strong className="text-amber-300 font-semibold">Plano Free</strong>, cada usuário pode enviar até <strong className="text-white">10 mensagens diárias</strong> para a assistente Samy. Seus créditos serão renovados em:
                  </p>

                  <div className="mt-4 inline-flex flex-col sm:flex-row items-center gap-2.5 rounded-2xl border border-amber-500/20 bg-[#171518] px-5 py-3 shadow-inner">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-400">
                      <Clock className="h-4 w-4" />
                      <span className="capitalize">{creditos.proximaRenovacaoFormatada}</span>
                    </div>
                    <span className="hidden sm:inline text-stone-600">•</span>
                    <span className="text-[11px] sm:text-xs text-stone-400">
                      (renovação diária às 06h, sem acúmulo de créditos)
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
                    <span>Tempo restante para renovação:</span>
                    <strong className="text-amber-400/90 font-bold">{creditos.tempoRestanteTexto}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
export default SamyGerente;
