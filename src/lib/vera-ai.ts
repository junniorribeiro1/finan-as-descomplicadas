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

const SYSTEM_PROMPT = `Você é a Vera, gerente financeira inteligente com inteligência artificial do OrganizaMais+.
Sua personalidade e diretrizes:
- Calorosa, empática, prática, elegante e encorajadora.
- Especialista em finanças pessoais, fluxo de caixa, cartões de crédito, cortes inteligentes de gastos, cofrinhos, reserva de emergência e investimentos no Brasil.
- Responda sempre em português brasileiro claro, correto e bem estruturado.
- Dê conselhos acionáveis e realistas, utilizando valores e termos como R$, CDI, Selic, aportes, cofrinhos e despesas fixas/variáveis.
- Mantenha respostas com 2 a 3 parágrafos objetivos, evitando enrolação ou listas infinitas a menos que solicitado.`;

const RESPOSTAS_FALLBACK: Record<string, string> = {
  "Como estão meus gastos deste mês?":
    "Seus gastos deste mês somam R$ 3.840,00 até agora. As categorias com maior peso são Moradia (42%) e Alimentação (25%). Você ainda está dentro do orçamento planejado para o período.",
  "Onde posso economizar?":
    "Identifiquei duas oportunidades de economia: você teve R$ 320,00 em pedidos de delivery no último fim de semana e duas assinaturas de streaming pouco utilizadas. Cortar 30% nisso pouparia cerca de R$ 180,00/mês.",
  "Quanto falta para minha reserva?":
    "Sua reserva de emergência atual cobre 4,2 meses do seu custo de vida essencial. Para atingir a meta recomendada de 6 meses (R$ 18.000,00), faltam apenas R$ 5.400,00. Mantendo o ritmo de aportes de R$ 900/mês, você atinge a meta em 6 meses!",
  "Devo aumentar meus investimentos?":
    "Com seus gastos fixos estabilizados e fluxo de caixa positivo neste mês, recomendo sim direcionar R$ 450,00 adicionais para Tesouro Selic ou CDB de liquidez diária antes de buscar renda variável.",
};

export async function perguntarParaVera(
  pergunta: string,
  historico: MensagemChat[]
): Promise<{ texto: string }> {
  const apiKey =
    (typeof import.meta !== "undefined" &&
      (import.meta.env?.["VITE_GROQ_API_KEY"] ||
        import.meta.env?.["GROQ_API_KEY"])) ||
    (typeof process !== "undefined" &&
      (process.env?.["VITE_GROQ_API_KEY"] ||
        process.env?.["GROQ_API_KEY"])) ||
    (typeof window !== "undefined" && localStorage.getItem("groq_api_key")) ||
    "";

  if (!apiKey) {
    const respostaFallback =
      RESPOSTAS_FALLBACK[pergunta] ||
      `Entendi sua dúvida sobre "${pergunta}". Analisando seus dados no OrganizaMais+, você tem mantido seus gastos essenciais estáveis. Minha sugestão prática é focar no controle dos gastos variáveis desta semana para garantir sobra no fluxo de caixa e fortalecer seus cofrinhos!`;
    return { texto: respostaFallback };
  }

  // Montar histórico de mensagens formatado
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...historico.slice(-6).map((m) => ({
      role: m.remetente === "vera" ? "assistant" : "user",
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
      const data = await response.json();
      const respostaIA = data.choices?.[0]?.message?.content;
      if (respostaIA) {
        return { texto: respostaIA.trim() };
      }
    }

    // Se o modelo principal estiver indisponível, tenta com qwen3.8-27b
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
      const dataFallback = await fallbackResponse.json();
      const respostaFallbackIA = dataFallback.choices?.[0]?.message?.content;
      if (respostaFallbackIA) {
        return { texto: respostaFallbackIA.trim() };
      }
    }
  } catch {
    // Continua para o fallback local abaixo
  }

  // Fallback local seguro e imediato
  const respostaFallback =
    RESPOSTAS_FALLBACK[pergunta] ||
    `Entendi perfeitamente sua dúvida sobre "${pergunta}". Analisando seus dados no OrganizaMais+, você tem mantido seus gastos essenciais estáveis. Minha sugestão prática é focar no controle dos gastos variáveis desta semana para garantir sobra no fluxo de caixa e poder fortalecer seus cofrinhos!`;

  return { texto: respostaFallback };
}
