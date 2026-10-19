import { DADOS_EMPRESA } from "./empresa";

/**
 * Utilitário de Rodapés em Conformidade Legal para Comunicações e E-mails de Marketing
 * Requisitos:
 * - Link visível de descadastro (opt-out imediato em 1 clique - LGPD Art. 18)
 * - Razão Social e Nome Fantasia
 * - CNPJ (Decreto nº 7.962/2013 e CDC Art. 31)
 * - Endereço físico completo
 * - Canal de suporte e privacidade (DPO)
 */

export interface EmailFooterOptions {
  destinatarioEmail?: string;
  tokenDescadastro?: string;
  motivoEnvio?: string;
}

/**
 * Gera o bloco HTML do rodapé obrigatório para envio em e-mails
 */
export function gerarRodapeEmailMarketingHtml(options?: EmailFooterOptions): string {
  const urlDescadastro = options?.destinatarioEmail
    ? `${DADOS_EMPRESA.canais.descadastroUrl}?email=${encodeURIComponent(options.destinatarioEmail)}`
    : DADOS_EMPRESA.canais.descadastroUrl;

  const motivo =
    options?.motivoEnvio ||
    "Você está recebendo este e-mail porque se cadastrou ou participou das ações educacionais do Organiz.AI / Natália Rodolfo.";

  return `
    <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e7eb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; line-height: 1.6; color: #6b7280; text-align: center;">
      <p style="margin: 0 0 10px 0;">
        ${motivo}
      </p>
      
      <p style="margin: 0 0 12px 0;">
        Se você não deseja mais receber nossas comunicações informativas ou ofertas, 
        <a href="${urlDescadastro}" style="color: #f97316; font-weight: 600; text-decoration: underline;" target="_blank" rel="noopener noreferrer">
          clique aqui para cancelar seu recebimento (Descadastro com 1 clique)
        </a>.
      </p>

      <div style="font-size: 11px; color: #9ca3af; margin-top: 14px; padding-top: 12px; border-top: 1px dashed #e5e7eb;">
        <p style="margin: 0 0 4px 0; font-weight: 600; color: #4b5563;">
          ${DADOS_EMPRESA.razaoSocial}
        </p>
        <p style="margin: 0;">
          Dúvidas ou direitos LGPD: <a href="mailto:${DADOS_EMPRESA.canais.privacidadeDpo}" style="color: #6b7280;">${DADOS_EMPRESA.canais.privacidadeDpo}</a> · 
          Suporte: <a href="mailto:${DADOS_EMPRESA.canais.suporteGeral}" style="color: #6b7280;">${DADOS_EMPRESA.canais.suporteGeral}</a>
        </p>
      </div>
    </div>
  `.trim();
}

/**
 * Versão em texto puro para templates de e-mail multipart/text
 */
export function gerarRodapeEmailMarketingTexto(options?: EmailFooterOptions): string {
  const urlDescadastro = options?.destinatarioEmail
    ? `${DADOS_EMPRESA.canais.descadastroUrl}?email=${encodeURIComponent(options.destinatarioEmail)}`
    : DADOS_EMPRESA.canais.descadastroUrl;

  return `
--------------------------------------------------
Descadastro: Caso não deseje mais receber nossas mensagens, acesse:
${urlDescadastro}

${DADOS_EMPRESA.razaoSocial}
Encarregado de Dados (DPO): ${DADOS_EMPRESA.canais.privacidadeDpo}
Suporte: ${DADOS_EMPRESA.canais.suporteGeral}
--------------------------------------------------
  `.trim();
}
