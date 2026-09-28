/**
 * Serviço de Integração com a IA Samy utilizando Groq (LPU Ultra-Rápida)
 * Escopo estritamente limitado ao funcionamento do aplicativo Organiz.AI e aos dados do próprio usuário.
 */

export interface MensagemChat {
  id: string;
  remetente: "samy" | "usuario" | "vera";
  texto: string;
  hora: string;
}

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const CANAIS_SUPORTE = {
  whatsapp: "https://wa.me/5577981381477",
  whatsappTexto: "WhatsApp: (77) 98138-1477",
  email: "suporte@nataliarodolfo.com.br",
  instagram: "https://www.instagram.com/nataliafinancas",
  instagramTexto: "@nataliafinancas",
};

export const MENSAGEM_SUPORTE_PADRAO = `\n\nCaso precise de suporte adicional, liberação de acesso ou consultoria personalizada com a equipe da Natália Rodolfo, entre em contato com nossa equipe de suporte.`;

function getSystemPrompt(nomeUsuario?: string, contextoFinanceiro?: string): string {
  const instrucaoNome = nomeUsuario
    ? `\n- O usuário configurou que deseja ser chamado(a) de "${nomeUsuario}". Sempre se dirija a ele(a) chamando por "${nomeUsuario}" com simpatia, elegância e profissionalismo.`
    : "";

  return `Você é a Samy, assistente oficial de inteligência artificial do aplicativo Organiz.AI.
Sua missão é responder com base ESTRITAMENTE no funcionamento do aplicativo e nos dados reais do usuário logado.

DIRETRIZES FUNDAMENTAIS E INEGOCIÁVEIS:

1. ISOLAMENTO TOTAL E PRIVACIDADE DE CADA USUÁRIO:
- Você está conversando única e exclusivamente com este usuário.
- NUNCA mencione, acesse, invente ou misture informações de outros usuários ou contas de terceiros. Cada usuário tem dados 100% isolados.

2. ESCOPO E LIMITAÇÃO ESTRITA:
- Você SÓ PODE falar sobre:
  a) O funcionamento e recursos do aplicativo Organiz.AI (por exemplo: como lançar Gastos Fixos, Gastos Variáveis, Cartões de Crédito, Entradas/Recebimentos, Cofrinhos, Bancos, Investimentos, Categorias, alternância entre contas Pessoal e Empresa, e filtros).
  b) O histórico e dados financeiros reais do próprio usuário presentes no resumo contextual abaixo.
- NÃO ESPECULE E NÃO VÁ ALÉM: NÃO dê consultoria financeira complexa, não faça recomendações de compra ou venda de ações na bolsa ou criptomoedas, não invente regras tributárias/fiscais/contábeis avançadas, e não forneça dicas de organização financeira que fujam ou vão muito além dos dados reais cadastrados dentro do aplicativo.
- Se uma informação não estiver cadastrada ou você não possuir o dado no contexto, informe com sinceridade que ela ainda não consta no app.

3. DIRECIONAMENTO OBRIGATÓRIO PARA O SUPORTE:
- Sempre que a solicitação do usuário:
  • Fugir do que é visto dentro do app ou exigir consultoria financeira personalizada avançada da mentora;
  • Tratar de problemas de acesso, erros na conta, faturamento, alteração de plano ou suporte técnico;
  • Envolver dúvidas sobre a mentoria individual de 30 minutos ou alinhamento com a equipe;
  VOCÊ DEVE INFORMAR CORDIALMENTE QUE É NECESSÁRIO ENTRAR EM CONTATO COM A EQUIPE DE SUPORTE.
  IMPORTANTE: NÃO liste contatos ou links brutos de WhatsApp, E-mail ou Instagram no corpo do texto, pois a interface do aplicativo exibe automaticamente os botões interativos de Acesso Rápido ao Suporte logo abaixo da sua mensagem.

4. IDENTIDADE E ESTILO:
- Seu nome é Samy.
- Responda sempre em português brasileiro claro, acolhedor, polido e objetivo.${instrucaoNome}
- Mantenha respostas sucintas (2 a 3 parágrafos curtos ou listas com marcadores), sem enrolação.

${contextoFinanceiro ? `\n--- DADOS REAIS DO USUÁRIO NO APLICATIVO ---\n${contextoFinanceiro}\n------------------------------------------\n` : ""}`;
}

function getRespostasFallback(pergunta: string, nomeUsuario?: string, contextoFinanceiro?: string): string {
  const nomeTratamento = nomeUsuario ? `${nomeUsuario}, ` : "";
  const pLower = pergunta.toLowerCase();

  if (pLower.includes("gasto") || pLower.includes("despesa") || pLower.includes("conta")) {
    return `${nomeTratamento}analisei seus registros no Organiz.AI. Suas despesas fixas e variáveis podem ser gerenciadas diretamente nas abas "Gastos Fixos" e "Gastos Variáveis". Manter o status de cada item atualizado (como "Pago" ou "Pendente") garante que o painel principal mostre com precisão o que ainda falta pagar no mês.${MENSAGEM_SUPORTE_PADRAO}`;
  }

  if (pLower.includes("economizar") || pLower.includes("corte") || pLower.includes("sobrar")) {
    return `${nomeTratamento}com base nas ferramentas do Organiz.AI, o caminho mais direto para economizar é revisar os lançamentos em "Gastos Variáveis", focando nas categorias com maior volume de saídas na semana. Pequenos ajustes em conveniência liberam fluxo de caixa para abastecer seus cofrinhos.${MENSAGEM_SUPORTE_PADRAO}`;
  }

  if (pLower.includes("cofrinho") || pLower.includes("reserva") || pLower.includes("meta")) {
    return `${nomeTratamento}no Organiz.AI você acompanha metas na tela de "Cofrinhos". Ao definir o valor alvo e o prazo, a cada aporte a barra de evolução calcula a porcentagem atingida para você acompanhar visualmente.${MENSAGEM_SUPORTE_PADRAO}`;
  }

  if (pLower.includes("investimento") || pLower.includes("investir") || pLower.includes("rendimento")) {
    return `${nomeTratamento}no módulo "Investimentos" do app você pode cadastrar e acompanhar seus ativos e aplicações. Por diretriz do Organiz.AI, eu não recomendo ativos específicos de renda variável ou investimentos de risco. Para orientações aprofundadas com a mentora, entre em contato com nosso suporte:${MENSAGEM_SUPORTE_PADRAO}`;
  }

  if (pLower.includes("cartão") || pLower.includes("fatura") || pLower.includes("limite")) {
    return `${nomeTratamento}no menu "Cartões de Crédito" você gerencia limites, datas de fechamento e vencimento de cada cartão. As compras parceladas lançadas são somadas automaticamente na fatura do período.${MENSAGEM_SUPORTE_PADRAO}`;
  }

  if (pLower.includes("empresa") || pLower.includes("pessoal") || pLower.includes("pf") || pLower.includes("pj")) {
    return `${nomeTratamento}o Organiz.AI conta com a separação blindada de contas. No topo da página você pode alternar entre os modos "Pessoal" e "Empresa", mantendo suas finanças físicas e jurídicas completamente organizadas e independentes.${MENSAGEM_SUPORTE_PADRAO}`;
  }

  return `${nomeTratamento}sou a Samy, sua assistente com IA do Organiz.AI. Estou pronta para tirar dúvidas sobre as telas do aplicativo (gastos fixos, variáveis, cartões, cofrinhos, bancos e entradas) e analisar os dados cadastrados na sua conta.${MENSAGEM_SUPORTE_PADRAO}`;
}

// Execução segura e isolada exclusivamente no servidor backend via TanStack Start
import { createServerFn } from "@tanstack/react-start";

export const perguntarParaSamyServerFn = createServerFn({ method: "POST" })
  .validator(
    (d: {
      pergunta: string;
      historico: MensagemChat[];
      nomeUsuario?: string;
      contextoFinanceiro?: string;
    }) => d
  )
  .handler(async ({ data }) => {
    const { pergunta, historico, nomeUsuario, contextoFinanceiro } = data;

    // Chave isolada no ambiente de servidor (nunca vazada no bundle client-side)
    const apiKey =
      (typeof process !== "undefined" &&
        (process.env?.["GROQ_API_KEY"] || process.env?.["VITE_GROQ_API_KEY"])) ||
      "";

    if (!apiKey) {
      return { texto: getRespostasFallback(pergunta, nomeUsuario, contextoFinanceiro) };
    }

    const messages = [
      { role: "system", content: getSystemPrompt(nomeUsuario, contextoFinanceiro) },
      ...historico.slice(-6).map((m) => ({
        role: m.remetente === "samy" || m.remetente === "vera" ? ("assistant" as const) : ("user" as const),
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
          temperature: 0.5,
          max_tokens: 500,
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
          temperature: 0.5,
          max_tokens: 500,
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
      console.error("[Samy AI Server] Erro ao comunicar com Groq API:", err);
    }

    return { texto: getRespostasFallback(pergunta, nomeUsuario, contextoFinanceiro) };
  });

export async function perguntarParaSamy(
  pergunta: string,
  historico: MensagemChat[],
  nomeUsuario?: string,
  contextoFinanceiro?: string
): Promise<{ texto: string }> {
  try {
    const res = await perguntarParaSamyServerFn({
      data: { pergunta, historico, nomeUsuario, contextoFinanceiro },
    });
    return res;
  } catch (error) {
    console.warn("[Samy AI Client] Fallback ativado devido a erro na chamada de servidor:", error);
    return { texto: getRespostasFallback(pergunta, nomeUsuario, contextoFinanceiro) };
  }
}

// Aliases para compatibilidade reversa
export const perguntarParaVera = perguntarParaSamy;
export const perguntarParaVeraServerFn = perguntarParaSamyServerFn;
