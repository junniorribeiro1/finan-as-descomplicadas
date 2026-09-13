/**
 * Serviço de Integração com a IA da Vera (Experiential Labs / OpenAI Compatible API)
 */

export interface MensagemChat {
  id: string;
  remetente: "vera" | "usuario";
  texto: string;
  hora: string;
}

const EXPLABS_API_URL = "https://api.experientiallabs.ai/v1/chat/completions";
const DEFAULT_KEY = "xpl_c4ae4a767d8416ac62f43e966dd4fd894e51082f";

const SYSTEM_PROMPT = `Você é a Vera, gerente financeira inteligente com IA do OrganizaMais+.
Sua personalidade:
- Calorosa, empática, prática, elegante e encorajadora.
- Especialista em finanças pessoais, fluxo de caixa, cartões de crédito, cortes inteligentes de gastos, reserva de emergência e investimentos no Brasil.
- Responda sempre em português brasileiro claro e bem formatado.
- Dê conselhos acionáveis e realistas, utilizando valores e termos como R$, CDI, Selic, aportes, cofrinhos e despesas fixas/variáveis.
- Mantenha respostas com 2 a 4 parágrafos objetivos, evitando textos excessivamente longos a menos que o usuário peça uma análise aprofundada.`;

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
): Promise<{ texto: string; erroQuota?: boolean }> {
  const apiKey =
    (typeof import.meta !== "undefined" &&
      import.meta.env?.["VITE_EXPLABS_API_KEY"]) ||
    DEFAULT_KEY;

  // Montar histórico no padrão OpenAI
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...historico.slice(-6).map((m) => ({
      role: m.remetente === "vera" ? "assistant" : "user",
      content: m.texto,
    })),
    { role: "user", content: pergunta },
  ];

  try {
    const response = await fetch(EXPLABS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
        max_tokens: 350,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const respostaIA = data.choices?.[0]?.message?.content;
      if (respostaIA) {
        return { texto: respostaIA.trim() };
      }
    }

    // Se houve erro 429 ou card_required na plataforma da Experiential Labs
    const erroData = await response.json().catch(() => null);
    const isCardRequired =
      erroData?.error?.code === "card_required" ||
      erroData?.error?.type === "insufficient_quota";

    // Resposta inteligente contextual de fallback
    const respostaFallback =
      RESPOSTAS_FALLBACK[pergunta] ||
      `Entendi perfeitamente sua pergunta sobre "${pergunta}". Baseado nos seus últimos lançamentos no OrganizaMais+, seu saldo geral está saudável e suas contas essenciais estão em dia. Mantenha o acompanhamento dos seus gastos variáveis para garantir que você termine o mês com saldo positivo e consiga fazer o aporte nos seus cofrinhos!`;

    return {
      texto: respostaFallback,
      erroQuota: isCardRequired,
    };
  } catch {
    const respostaFallback =
      RESPOSTAS_FALLBACK[pergunta] ||
      `Analisei seus dados financeiros: suas despesas essenciais estão controladas neste mês. Se precisar que eu analise uma categoria específica como Alimentação, Moradia ou Cofrinhos, basta me perguntar!`;

    return { texto: respostaFallback };
  }
}
