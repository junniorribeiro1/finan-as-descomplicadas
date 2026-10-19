/**
 * Informações Legais Oficiais da Empresa e Conformidade Regulatória (Brasil)
 * 
 * Legislações atendidas:
 * - LGPD (Lei nº 13.709/2018)
 * - Marco Civil da Internet (Lei nº 12.965/2014)
 * - ECA Digital (Estatuto da Criança e do Adolescente em Meios Digitais)
 * - Código de Defesa do Consumidor - CDC (Lei nº 8.078/1990)
 * - Decreto do Comércio Eletrônico (Decreto nº 7.962/2013)
 * - Lei de Direitos Autorais (Lei nº 9.610/1998)
 */

export const DADOS_EMPRESA = {
  razaoSocial: "Natália Rodolfo Educação Financeira",
  nomeFantasia: "Natália Rodolfo Educação Financeira",
  cnpj: "",
  cnpjFormatado: "",
  endereco: {
    logradouro: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    pais: "Brasil",
  },
  enderecoCompleto: "",
  canais: {
    suporteGeral: "suporte@nataliarodolfo.com.br",
    privacidadeDpo: "suporte@nataliarodolfo.com.br",
    direitosAutorais: "suporte@nataliarodolfo.com.br",
    juridico: "suporte@nataliarodolfo.com.br",
    whatsapp: "5577981381477",
    whatsappFormatado: "(77) 98138-1477",
    siteUrl: "https://nataliarodolfo.com.br",
    descadastroUrl: "https://nataliarodolfo.com.br/descadastro",
    denunciaCopyrightUrl: "https://nataliarodolfo.com.br/denuncia-direitos-autorais",
  },
  politicas: {
    prazoDireitoArrependimentoDias: 7, // CDC Art. 49
    prazoAvisoRenovacaoDias: 15, // Aviso obrigatório antes da cobrança da renovação
    idadeMinimaCadastro: 18, // ECA Digital e LGPD Art. 14
    gravacaoSessaoAtiva: false, // Session recording desativado por padrão para proteção de dados financeiros
  },
} as const;
