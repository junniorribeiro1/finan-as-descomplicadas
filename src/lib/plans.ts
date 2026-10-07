// ============================================================================
// Organiz.AI - Arquitetura Centralizada de Planos, Modalidades e Acesso
// ============================================================================

export type CanonicalPlanCode =
  | "free"
  // PF (Pessoa Física)
  | "mensal_pf"
  | "trimestral_pf"
  | "semestral_pf"
  | "anual_pf"
  // PJ (Pessoa Jurídica)
  | "mensal_pj"
  | "trimestral_pj"
  | "semestral_pj"
  | "anual_pj"
  // COMBO PF + PJ
  | "mensal_pfj"
  | "trimestral_pfj"
  | "semestral_pfj"
  | "anual_pfj"
  // INTERNAL / ADMIN ONLY
  | "vitalicio";

export type CanonicalAccountType = "pf" | "pj" | "pfj";
export type LegacyAccountType = "pessoal" | "empresarial" | "empresa" | "ambos";
export type AccountType = CanonicalAccountType | LegacyAccountType;

export type PlanCategory = "FREE" | "PF" | "PJ" | "COMBO" | "INTERNAL";

export interface PlanMetadata {
  code: CanonicalPlanCode;
  name: string;
  shortName: string;
  category: PlanCategory;
  categoryLabel: string;
  accountType: CanonicalAccountType | null;
  price: number | null;
  formattedPrice: string;
  durationMonths: number | null;
  recurring: boolean;
  commercial: boolean;
  lifetime?: boolean;
  description?: string;
  checkoutUrl?: string;
  installments?: {
    count: number;
    value: string;
  };
}

// ----------------------------------------------------------------------------
// Registro Central de Planos
// ----------------------------------------------------------------------------
export const PLANS_REGISTRY: Record<CanonicalPlanCode, PlanMetadata> = {
  // GRATUITO
  free: {
    code: "free",
    name: "Gratuito (Free)",
    shortName: "Free",
    category: "FREE",
    categoryLabel: "Gratuito",
    accountType: "pfj",
    price: 0,
    formattedPrice: "Grátis",
    durationMonths: null,
    recurring: false,
    commercial: false,
    description: "Acesso inicial com funcionalidades essenciais.",
  },

  // PESSOA FÍSICA (PF)
  mensal_pf: {
    code: "mensal_pf",
    name: "Mensal PF",
    shortName: "Mensal",
    category: "PF",
    categoryLabel: "Pessoa Física",
    accountType: "pf",
    price: 49.9,
    formattedPrice: "R$ 49,90/mês",
    durationMonths: 1,
    recurring: true,
    commercial: true,
    description: "Controle financeiro pessoal e familiar com renovação mensal.",
    checkoutUrl: "https://pay.hotmart.com/I107907116E?off=idhxulv7&checkoutMode=6",
  },
  trimestral_pf: {
    code: "trimestral_pf",
    name: "Trimestral PF",
    shortName: "Trimestral",
    category: "PF",
    categoryLabel: "Pessoa Física",
    accountType: "pf",
    price: 119.9,
    formattedPrice: "R$ 119,90",
    durationMonths: 3,
    recurring: true,
    commercial: true,
    description: "Acesso por 3 meses para planejamento pessoal contínuo.",
    checkoutUrl: "https://pay.hotmart.com/I107907116E?off=7cd2yal7&checkoutMode=6&bid=1791324379232",
    installments: { count: 3, value: "R$ 39,97" },
  },
  semestral_pf: {
    code: "semestral_pf",
    name: "Semestral PF",
    shortName: "Semestral",
    category: "PF",
    categoryLabel: "Pessoa Física",
    accountType: "pf",
    price: 209.9,
    formattedPrice: "R$ 209,90",
    durationMonths: 6,
    recurring: true,
    commercial: true,
    description: "Histórico semestral e acompanhamento financeiro individual.",
    checkoutUrl: "https://pay.hotmart.com/I107907116E?off=fg900m0d&checkoutMode=6&bid=1791324396598",
    installments: { count: 6, value: "R$ 34,98" },
  },
  anual_pf: {
    code: "anual_pf",
    name: "Anual PF",
    shortName: "Anual",
    category: "PF",
    categoryLabel: "Pessoa Física",
    accountType: "pf",
    price: 349.9,
    formattedPrice: "R$ 349,90",
    durationMonths: 12,
    recurring: true,
    commercial: true,
    description: "1 ano completo com a maior economia anual.",
    checkoutUrl: "https://pay.hotmart.com/I107907116E?off=6takcxq1&checkoutMode=6&bid=1791324435263",
    installments: { count: 12, value: "R$ 29,16" },
  },

  // PESSOA JURÍDICA (PJ)
  mensal_pj: {
    code: "mensal_pj",
    name: "Mensal PJ",
    shortName: "Mensal",
    category: "PJ",
    categoryLabel: "Pessoa Jurídica",
    accountType: "pj",
    price: 69.9,
    formattedPrice: "R$ 69,90/mês",
    durationMonths: 1,
    recurring: true,
    commercial: true,
    description: "Fluxo de caixa empresarial, MEI e empresas com renovação mensal.",
    checkoutUrl: "https://pay.hotmart.com/I107907116E?off=kq33injc&checkoutMode=6&bid=1791324449801",
  },
  trimestral_pj: {
    code: "trimestral_pj",
    name: "Trimestral PJ",
    shortName: "Trimestral",
    category: "PJ",
    categoryLabel: "Pessoa Jurídica",
    accountType: "pj",
    price: 149.9,
    formattedPrice: "R$ 149,90",
    durationMonths: 3,
    recurring: true,
    commercial: true,
    description: "Gestão empresarial com contas a pagar, receber e conciliação.",
    checkoutUrl: "https://pay.hotmart.com/I107907116E?off=c2uwbnuq&checkoutMode=6&bid=1791324460121",
    installments: { count: 3, value: "R$ 49,96" },
  },
  semestral_pj: {
    code: "semestral_pj",
    name: "Semestral PJ",
    shortName: "Semestral",
    category: "PJ",
    categoryLabel: "Pessoa Jurídica",
    accountType: "pj",
    price: 229.9,
    formattedPrice: "R$ 229,90",
    durationMonths: 6,
    recurring: true,
    commercial: true,
    description: "Histórico semestral contínuo e relatórios gerenciais da empresa.",
    checkoutUrl: "https://pay.hotmart.com/I107907116E?off=byf9ao05&checkoutMode=6&bid=1791324487732",
    installments: { count: 6, value: "R$ 38,31" },
  },
  anual_pj: {
    code: "anual_pj",
    name: "Anual PJ",
    shortName: "Anual",
    category: "PJ",
    categoryLabel: "Pessoa Jurídica",
    accountType: "pj",
    price: 369.9,
    formattedPrice: "R$ 369,90",
    durationMonths: 12,
    recurring: true,
    commercial: true,
    description: "1 ano completo de blindagem e inteligência financeira PJ.",
    checkoutUrl: "https://pay.hotmart.com/I107907116E?off=l6v3lamw&checkoutMode=6&bid=1791324511735",
    installments: { count: 12, value: "R$ 30,82" },
  },

  // COMBO PF + PJ
  mensal_pfj: {
    code: "mensal_pfj",
    name: "Mensal Combo PF + PJ",
    shortName: "Mensal",
    category: "COMBO",
    categoryLabel: "Combo PF + PJ",
    accountType: "pfj",
    price: 99.9,
    formattedPrice: "R$ 99,90/mês",
    durationMonths: 1,
    recurring: true,
    commercial: true,
    description: "Dois ambientes isolados: vida pessoal e empresa integradas.",
    checkoutUrl: "https://pay.hotmart.com/I107907116E?off=fy7e51sj&checkoutMode=6&bid=1791324523500",
  },
  trimestral_pfj: {
    code: "trimestral_pfj",
    name: "Trimestral Combo PF + PJ",
    shortName: "Trimestral",
    category: "COMBO",
    categoryLabel: "Combo PF + PJ",
    accountType: "pfj",
    price: 219.9,
    formattedPrice: "R$ 219,90",
    durationMonths: 3,
    recurring: true,
    commercial: true,
    description: "Separação de patrimônio e pró-labore com histórico de 3 meses.",
    checkoutUrl: "https://pay.hotmart.com/I107907116E?off=sge5gsav&checkoutMode=6&bid=1791324537562",
    installments: { count: 3, value: "R$ 73,30" },
  },
  semestral_pfj: {
    code: "semestral_pfj",
    name: "Semestral Combo PF + PJ",
    shortName: "Semestral",
    category: "COMBO",
    categoryLabel: "Combo PF + PJ",
    accountType: "pfj",
    price: 399.9,
    formattedPrice: "R$ 399,90",
    durationMonths: 6,
    recurring: true,
    commercial: true,
    description: "Visão consolidada PF + PJ com relatórios semestrais completos.",
    checkoutUrl: "https://pay.hotmart.com/I107907116E?off=oq2ztv93&checkoutMode=6&bid=1791324561026",
    installments: { count: 6, value: "R$ 66,65" },
  },
  anual_pfj: {
    code: "anual_pfj",
    name: "Anual Combo PF + PJ",
    shortName: "Anual",
    category: "COMBO",
    categoryLabel: "Combo PF + PJ",
    accountType: "pfj",
    price: 599.9,
    formattedPrice: "R$ 599,90",
    durationMonths: 12,
    recurring: true,
    commercial: true,
    description: "Máxima economia para gerenciar a vida pessoal e empresarial por 1 ano.",
    checkoutUrl: "https://pay.hotmart.com/I107907116E?off=wdat8f96&checkoutMode=6&bid=1791324575491",
    installments: { count: 12, value: "R$ 49,99" },
  },

  // INTERNAL / ADMIN ONLY (NUNCA VENDIDO OU EXPOSTO NO CHECKOUT)
  vitalicio: {
    code: "vitalicio",
    name: "Vitalício — acesso permanente",
    shortName: "Vitalício",
    category: "INTERNAL",
    categoryLabel: "Interno / Administrativo",
    accountType: "pfj",
    price: null,
    formattedPrice: "Vitalício",
    durationMonths: null,
    recurring: false,
    commercial: false,
    lifetime: true,
    description: "Acesso permanente sem data de expiração concedido exclusivamente pela administração.",
  },
};

// ----------------------------------------------------------------------------
// Listas Estruturadas para a Interface
// ----------------------------------------------------------------------------
export const ALL_PLANS: PlanMetadata[] = Object.values(PLANS_REGISTRY);

export const COMMERCIAL_PLANS: PlanMetadata[] = ALL_PLANS.filter(
  (p) => p.commercial
);

export const PLANS_BY_CATEGORY: Record<"PF" | "PJ" | "COMBO", PlanMetadata[]> = {
  PF: ALL_PLANS.filter((p) => p.category === "PF"),
  PJ: ALL_PLANS.filter((p) => p.category === "PJ"),
  COMBO: ALL_PLANS.filter((p) => p.category === "COMBO"),
};

// ----------------------------------------------------------------------------
// Funções Utilitárias de Busca e Normalização
// ----------------------------------------------------------------------------

/**
 * Retorna os metadados do plano correspondente ao código.
 * Possui fallback inteligente para versões anteriores em caixa alta/baixa.
 */
export function getPlanByCode(rawCode?: string | null): PlanMetadata {
  if (!rawCode) return PLANS_REGISTRY.free;
  const cleaned = rawCode.toLowerCase().trim() as CanonicalPlanCode;
  if (PLANS_REGISTRY[cleaned]) {
    return PLANS_REGISTRY[cleaned];
  }
  // Mapeamento de possíveis códigos legados
  if (cleaned === "pro" || cleaned === "premium") {
    return PLANS_REGISTRY.anual_pfj;
  }
  return {
    code: "free",
    name: rawCode,
    shortName: rawCode,
    category: "FREE",
    categoryLabel: "Outro",
    accountType: "pfj",
    price: null,
    formattedPrice: "-",
    durationMonths: null,
    recurring: false,
    commercial: false,
  };
}

/**
 * Camada de compatibilidade retrocompatível para account_type.
 * Normaliza os tipos canônicos (pf, pj, pfj) e os legados (pessoal, empresarial, empresa, ambos).
 */
export function normalizeAccountType(
  rawType?: string | null
): CanonicalAccountType {
  if (!rawType) return "pfj";
  const t = rawType.toLowerCase().trim();
  if (t === "pf" || t === "pessoal") return "pf";
  if (t === "pj" || t === "empresarial" || t === "empresa") return "pj";
  return "pfj"; // "ambos" ou "pfj"
}

/**
 * Retorna o rótulo amigável em português para o tipo de conta.
 */
export function getAccountTypeLabel(rawType?: string | null): string {
  const normalized = normalizeAccountType(rawType);
  switch (normalized) {
    case "pf":
      return "Pessoa Física (PF)";
    case "pj":
      return "Pessoa Jurídica (PJ)";
    case "pfj":
      return "Combo PF + PJ";
  }
}

/**
 * Verifica se o usuário tem permissão para acessar o modo 'pessoal' ou 'empresa'.
 */
export function isAccountTypeAllowed(
  rawUserAccountType: string | undefined | null,
  targetMode: "pessoal" | "empresa"
): boolean {
  const normalized = normalizeAccountType(rawUserAccountType);
  if (normalized === "pfj") return true;
  if (normalized === "pf") return targetMode === "pessoal";
  if (normalized === "pj") return targetMode === "empresa";
  return true;
}

// ----------------------------------------------------------------------------
// Controle Central de Acesso e Expiração
// ----------------------------------------------------------------------------
export interface UserAccessInfo {
  isBlocked: boolean;
  isPending: boolean;
  isAccessExpired: boolean;
  isPermanentAccess: boolean; // vitalício ou admin
  isActive: boolean;
  dataExpiracaoFormatada: string | null;
  diasRestantes: number | null;
}

/**
 * Avalia o status de acesso do usuário seguindo rigorosamente a ordem de prioridade:
 * 1. Admin: acesso total permanente
 * 2. Status 'bloqueado': acesso negado
 * 3. Status 'pendente': aguardando aprovação
 * 4. Plan === 'vitalicio': ACESSO PERMANENTE (nunca expira, access_expires_at = null)
 * 5. access_expires_at preenchido: ativo enquanto a data for futura ou plan_renovado = true
 * 6. Usuários Free/padrão sem data de expiração: mantêm comportamento ativo normal
 */
export function checkUserAccess(
  profile: {
    status?: string | null;
    plan?: string | null;
    access_expires_at?: string | null;
    plan_renovado?: boolean | null;
  } | null | undefined,
  isAdmin: boolean = false
): UserAccessInfo {
  if (isAdmin) {
    return {
      isBlocked: false,
      isPending: false,
      isAccessExpired: false,
      isPermanentAccess: true,
      isActive: true,
      dataExpiracaoFormatada: null,
      diasRestantes: null,
    };
  }

  const status = profile?.status || "pendente";
  const planClean = (profile?.plan || "").toLowerCase().trim();
  const isVitalicio = planClean === "vitalicio";
  const isPending = status === "pendente";

  // Prioridade 1: Status Bloqueado explicitamente
  if (status === "bloqueado") {
    return {
      isBlocked: true,
      isPending: false,
      isAccessExpired: false,
      isPermanentAccess: isVitalicio,
      isActive: false,
      dataExpiracaoFormatada: null,
      diasRestantes: null,
    };
  }

  // Prioridade 2: Plano Vitalício (acesso permanente, isenta de expiração)
  if (isVitalicio) {
    return {
      isBlocked: false,
      isPending,
      isAccessExpired: false,
      isPermanentAccess: true,
      isActive: !isPending,
      dataExpiracaoFormatada: null,
      diasRestantes: null,
    };
  }

  // Prioridade 3: Se houver data de expiração de assinatura / bônus
  if (profile?.access_expires_at) {
    const expiresMs = new Date(profile.access_expires_at).getTime();
    const agora = Date.now();
    const isExpirado = Boolean(
      expiresMs <= agora && !profile?.plan_renovado
    );
    const diffMs = expiresMs - agora;
    const diasRestantes = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const dataExpiracaoFormatada = new Date(
      profile.access_expires_at
    ).toLocaleDateString("pt-BR");

    return {
      isBlocked: isExpirado,
      isPending,
      isAccessExpired: isExpirado,
      isPermanentAccess: false,
      isActive: !isPending && !isExpirado,
      dataExpiracaoFormatada,
      diasRestantes,
    };
  }

  // Prioridade 4: Usuários Free / sem data de expiração (mantêm acesso ativo compatível)
  return {
    isBlocked: false,
    isPending,
    isAccessExpired: false,
    isPermanentAccess: false,
    isActive: !isPending,
    dataExpiracaoFormatada: null,
    diasRestantes: null,
  };
}

/**
 * Calcula a data de expiração para concessão de plano pelo administrador.
 * - vitalicio: retorna null (acesso permanente sem data)
 * - free: retorna null (restaura comportamento normal)
 * - planos pagos: calcula a partir da data atual (ou base informada) adicionando a duração em meses
 */
export function calculatePlanExpiration(
  planCode: CanonicalPlanCode,
  fromDate?: Date
): string | null {
  if (planCode === "vitalicio" || planCode === "free") {
    return null;
  }
  const meta = PLANS_REGISTRY[planCode];
  if (!meta || !meta.durationMonths) {
    return null;
  }
  const base = fromDate ? new Date(fromDate) : new Date();
  const target = new Date(base);
  target.setMonth(target.getMonth() + meta.durationMonths);
  return target.toISOString();
}
