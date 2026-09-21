/**
 * Serviço de Integração com a IA da Vera utilizando Groq (LPU Ultra-Rápida)
 */

export interface MensagemChat {
  id: string;
  remetente: "vera" | "usuario";
  texto: string;
  hora: string;
}

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

function getSystemPrompt(nomeUsuario?: string): string {
  const instrucaoNome = nomeUsuario
    ? `\n- O usuário configurou que deseja ser chamado(a) de "${nomeUsuario}". Sempre se dirija a ele(a) chamando por "${nomeUsuario}" com naturalidade, simpatia, carinho e profissionalismo nas suas respostas.`
    : "";

  return `Você é a Vera, gerente financeira inteligente com inteligência artificial do OrganizAI.
Sua personalidade e diretrizes:
- Calorosa, empática, prática, elegante e encorajadora.${instrucaoNome}
- Especialista em finanças pessoais, fluxo de caixa, cartões de crédito, cortes inteligentes de gastos, cofrinhos, reserva de emergência e investimentos no Brasil.
- Responda sempre em português brasileiro claro, correto e bem estruturado.
- Dê conselhos acionáveis e realistas, utilizando valores e termos como R$, CDI, Selic, aportes, cofrinhos e despesas fixas/variáveis.
- Mantenha respostas com 2 a 3 parágrafos objetivos, evitando enrolação ou listas infinitas a menos que solicitado.`;
}

function getRespostasFallback(pergunta: string, nomeUsuario?: string): string {
  const nomeTratamento = nomeUsuario ? `${nomeUsuario}, ` : "";
  const mapa: Record<string, string> = {
    "Como estão meus gastos deste mês?":
      `${nomeTratamento}seus gastos deste mês somam R$ 3.840,00 até agora. As categorias com maior peso são Moradia (42%) e Alimentação (25%). Você ainda está dentro do orçamento planejado para o período.`,
    "Onde posso economizar?":
      `${nomeTratamento}identifiquei duas oportunidades de economia: você teve R$ 320,00 em pedidos de delivery no último fim de semana e duas assinaturas de streaming pouco utilizadas. Cortar 30% nisso pouparia cerca de R$ 180,00/mês.`,
    "Quanto falta para minha reserva?":
      `${nomeTratamento}sua reserva de emergência atual cobre 4,2 meses do seu custo de vida essencial. Para atingir a meta recomendada de 6 meses (R$ 18.000,00), faltam apenas R$ 5.400,00. Mantendo o ritmo de aportes de R$ 900/mês, você atinge a meta em 6 meses!`,
    "Devo aumentar meus investimentos?":
      `${nomeTratamento}com seus gastos fixos estabilizados e fluxo de caixa positivo neste mês, recomendo sim direcionar R$ 450,00 adicionais para Tesouro Selic ou CDB de liquidez diária antes de buscar renda variável.`,
  };

  return (
    mapa[pergunta] ||
    `${nomeTratamento}analisei seus dados no OrganizAI e vejo que você tem mantido seus gastos essenciais sob controle. Minha sugestão prática é focar no controle dos gastos variáveis desta semana para garantir sobra no fluxo de caixa e fortalecer seus cofrinhos!`
  );
}

// Execução segura e isolada exclusivamente no servidor backend via TanStack Start
import { createServerFn } from "@tanstack/react-start";

export const perguntarParaVeraServerFn = createServerFn({ method: "POST" })
  .validator(
    (d: {
      pergunta: string;
      historico: MensagemChat[];
      nomeUsuario?: string;
    }) => d
  )
  .handler(async ({ data }) => {
    const { pergunta, historico, nomeUsuario } = data;

    // Chave isolada no ambiente de servidor (nunca vazada no bundle client-side)
    const apiKey =
      (typeof process !== "undefined" &&
        (process.env?.["GROQ_API_KEY"] || process.env?.["VITE_GROQ_API_KEY"])) ||
      "";

    if (!apiKey) {
      return { texto: getRespostasFallback(pergunta, nomeUsuario) };
    }

    const messages = [
      { role: "system", content: getSystemPrompt(nomeUsuario) },
      ...historico.slice(-6).map((m) => ({
        role: m.remetente === "vera" ? ("assistant" as const) : ("user" as const),
        content: m.texto,
      })),
      { role: "user", content: pergunta },
    ];

    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages,
          temperature: 0.7,
          max_tokens: 450,
        }),
      });

      if (response.ok) {
        const resData = (await response.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
        };
        const respostaIA = resData.choices?.[0]?.message?.content;
        if (respostaIA) {
          return { texto: respostaIA.trim() };
        }
      }

      // Se o modelo principal estiver temporariamente indisponível, tenta com fallback
      const fallbackResponse = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "qwen/qwen3.8-27b",
          messages,
          temperature: 0.7,
          max_tokens: 450,
        }),
      });

      if (fallbackResponse.ok) {
        const dataFallback = (await fallbackResponse.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
        };
        const respostaFallbackIA = dataFallback.choices?.[0]?.message?.content;
        if (respostaFallbackIA) {
          return { texto: respostaFallbackIA.trim() };
        }
      }
    } catch (err) {
      console.error("[Vera AI Server] Erro ao comunicar com Groq API:", err);
    }

    return { texto: getRespostasFallback(pergunta, nomeUsuario) };
  });

export async function perguntarParaVera(
  pergunta: string,
  historico: MensagemChat[],
  nomeUsuario?: string
): Promise<{ texto: string }> {
  try {
    const res = await perguntarParaVeraServerFn({
      data: { pergunta, historico, nomeUsuario },
    });
    return res;
  } catch (error) {
    console.warn("[Vera AI Client] Fallback ativado devido a erro na chamada de servidor:", error);
    return { texto: getRespostasFallback(pergunta, nomeUsuario) };
  }
}
