import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  User,
  Building2,
  TrendingUp,
  CreditCard,
  PiggyBank,
  Wallet,
  Clock,
  Layers,
  Bot,
  Flame,
  Check,
  Shield,
  MessageCircle,
  BarChart3,
  XCircle,
  AlertTriangle,
  Zap,
  ArrowUpRight,
  Coins,
  Smartphone,
  CheckCircle,
  Award,
  Play,
  Pause,
  Film,
  Eye,
  RefreshCw,
  Volume2,
  VolumeX,
  Star,
} from "lucide-react";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Organiz.AI — A Nova Era do Controle Financeiro Inteligente" },
      {
        name: "description",
        content:
          "Pare de ver seu dinheiro sumir no fim do mês. O Organiz.AI une metodologia prática de educação financeira a controles modernos para pessoas físicas e empresas. Planos por menos de R$ 1,00 por dia.",
      },
      { property: "og:title", content: "Organiz.AI — Liberdade e Inteligência Financeira PF e PJ" },
      {
        property: "og:description",
        content:
          "Descubra para onde seu dinheiro vai e construa patrimônio com clareza total. Escolha seu plano com parcelas a partir de R$ 29,16.",
      },
      { property: "og:image", content: "/organiz-ai-app-phone.webp" },
      { property: "og:url", content: "https://nataliarodolfo.com.br/app" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://nataliarodolfo.com.br/app" },
      {
        rel: "preload",
        as: "image",
        href: "/logo.webp",
        type: "image/webp",
      },
      {
        rel: "preload",
        as: "image",
        href: "/natalia-mentora.webp",
        type: "image/webp",
      },
    ],
  }),
  component: OrganizAiFintechSalesPage,
});

const modulosCarrossel = [
  {
    id: "fluxo-caixa",
    tag: "Fluxo de Caixa",
    categoria: "Controle em Tempo Real",
    titulo: "Fluxo de Caixa em Tempo Real",
    descricao:
      "Saiba exatamente quanto entra, quanto sai e quanto sobra. Sem surpresas com juros ou contas atrasadas.",
    imagem: "/carrossel/fluxo-caixa.jpg",
    acento: "from-orange-500/30 via-orange-950/20 to-transparent",
    badgeCorText: "text-orange-400",
  },
  {
    id: "cartoes",
    tag: "Cartões Inteligentes",
    categoria: "Até 40 Dias sem Juros",
    titulo: "Controle de Cartões de Crédito",
    descricao:
      "Acompanhe datas de fechamento e melhor dia de compra de todos os seus cartões, mantendo o limite sob controle e sem faturas surpresa.",
    imagem: "/carrossel/cartoes.jpg",
    acento: "from-amber-500/30 via-amber-950/20 to-transparent",
    badgeCorText: "text-amber-400",
  },
  {
    id: "cofrinhos",
    tag: "Metas & Reserva",
    categoria: "Poupe com Propósito",
    titulo: "Cofrinhos & Reserva de Emergência",
    descricao:
      "Crie caixinhas para objetivos específicos: reserva de 6 meses, viagens, cursos ou compra de bens sem entrar em dívidas ou cheque especial.",
    imagem: "/carrossel/cofrinhos.jpg",
    acento: "from-emerald-500/30 via-emerald-950/20 to-transparent",
    badgeCorText: "text-emerald-400",
  },
  {
    id: "samy-ia",
    tag: "Inteligência Artificial",
    categoria: "Samy IA 24 Horas",
    titulo: "Samy · Sua Assistente Financeira com IA",
    descricao:
      "Converse com a Samy a qualquer momento para tirar dúvidas sobre seu orçamento, calcular parcelamentos e receber conselhos práticos para cortar desperdícios.",
    imagem: "/carrossel/vera-ia.jpg",
    acento: "from-purple-500/35 via-purple-950/20 to-transparent",
    badgeCorText: "text-purple-300",
  },
  {
    id: "blindagem-pfpj",
    tag: "Separação Blindada",
    categoria: "Blindagem PF & PJ",
    titulo: "Separação Blindada de PF e PJ",
    descricao:
      "Alterne entre sua vida pessoal e as contas da empresa com 1 clique. O fim definitivo da mistura de finanças sem precisar pagar duas ferramentas.",
    imagem: "/carrossel/blindagem-pfpj.jpg",
    acento: "from-blue-500/30 via-blue-950/20 to-transparent",
    badgeCorText: "text-blue-400",
  },
  {
    id: "patentes",
    tag: "Gamificação Financeira",
    categoria: "Evolução Contínua",
    titulo: "Sistema de Patentes e Conquistas",
    descricao:
      "Conquiste patentes reais do Recruta ao Mestre da Riqueza conforme melhora seus índices financeiros e consolida seu patrimônio.",
    imagem: "/carrossel/patentes.jpg",
    acento: "from-yellow-500/30 via-yellow-950/20 to-transparent",
    badgeCorText: "text-yellow-400",
  },
];

const TOTAL_MODULOS = modulosCarrossel.length; // 6
const BUFFER_CYCLES = 7;
const START_CYCLE = 3; // Ciclo central (índice 18 = primeiro módulo)

// Buffer amplo de 7 ciclos (42 cards) para garantir loop infinito sem fim e sem esgotamento de itens
const loopCards = Array.from({ length: BUFFER_CYCLES }, (_, cycle) =>
  modulosCarrossel.map((item, idx) => ({
    ...item,
    uniqueKey: `cycle-${cycle}-${item.id}-${idx}`,
    moduloRealIndex: idx,
  }))
).flat();

function OrganizAiFintechSalesPage() {
  const [faqAberto, setFaqAberto] = useState<number | null>(null);

  // Estado do Carrossel de Módulos (Estilo Nubank em Loop Infinito com Autoplay)
  const [activeIndex, setActiveIndex] = useState(START_CYCLE * TOTAL_MODULOS); // Começa no ciclo central (índice 18)
  const [withTransition, setWithTransition] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const isAnimatingRef = useRef(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [cardWidth, setCardWidth] = useState(285);
  const [cardGap, setCardGap] = useState(18);
  const [peekOffset, setPeekOffset] = useState(105);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragDeltaX, setDragDeltaX] = useState(0);

  // Índice real entre 0 e 5 para indicadores e contador
  const currentModuloIndex = ((activeIndex % TOTAL_MODULOS) + TOTAL_MODULOS) % TOTAL_MODULOS;

  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window === "undefined") return;
      if (window.innerWidth < 640) {
        setCardWidth(250);
        setCardGap(12);
        setPeekOffset(45);
      } else if (window.innerWidth < 1024) {
        setCardWidth(265);
        setCardGap(16);
        setPeekOffset(85);
      } else if (window.innerWidth < 1280) {
        setCardWidth(275);
        setCardGap(18);
        setPeekOffset(105);
      } else {
        setCardWidth(285);
        setCardGap(18);
        setPeekOffset(120);
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Avançar com transição suave e normalização imperceptível de ciclo
  const handleNext = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setWithTransition(true);

    setActiveIndex((prev) => {
      const nextIndex = prev + 1;
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        // Ao passar o ciclo 3 (chegando em 24 = módulo 0 do ciclo 4):
        // Teletransporta sem transição de 24 de volta para o ciclo central 18 (módulo 0)
        if (nextIndex >= (START_CYCLE + 1) * TOTAL_MODULOS) {
          setWithTransition(false);
          setActiveIndex(nextIndex - TOTAL_MODULOS);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setWithTransition(true);
              isAnimatingRef.current = false;
            });
          });
        } else {
          isAnimatingRef.current = false;
        }
      }, 660);
      return nextIndex;
    });
  }, []);

  // Voltar com transição suave e normalização imperceptível de ciclo
  const handlePrev = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setWithTransition(true);

    setActiveIndex((prev) => {
      const prevIndexVal = prev - 1;
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        // Se recuar antes do ciclo central (índice < 18):
        // Teletransporta sem transição de volta para o ciclo central (+6)
        if (prevIndexVal < START_CYCLE * TOTAL_MODULOS) {
          setWithTransition(false);
          setActiveIndex(prevIndexVal + TOTAL_MODULOS);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setWithTransition(true);
              isAnimatingRef.current = false;
            });
          });
        } else {
          isAnimatingRef.current = false;
        }
      }, 660);
      return prevIndexVal;
    });
  }, []);

  // Autoplay Automático a cada 4 segundos (pausa durante hover ou arraste)
  useEffect(() => {
    if (isHovered || isDragging) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered, isDragging, handleNext]);

  // Touch & Mouse Drag Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setIsHovered(true);
    setDragStartX(e.touches[0].clientX);
    setDragDeltaX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setDragDeltaX(e.touches[0].clientX - dragStartX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    if (dragDeltaX < -40) {
      handleNext();
    } else if (dragDeltaX > 40) {
      handlePrev();
    }
    setIsDragging(false);
    setDragDeltaX(0);
    setTimeout(() => setIsHovered(false), 800);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragDeltaX(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setDragDeltaX(e.clientX - dragStartX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    if (dragDeltaX < -40) {
      handleNext();
    } else if (dragDeltaX > 40) {
      handlePrev();
    }
    setIsDragging(false);
    setDragDeltaX(0);
  };

  // Estado do Tour Visual Interativo com Vídeos dos Módulos
  const [tourAtivo, setTourAtivo] = useState(0);
  const [tourAutoplay, setTourAutoplay] = useState(true);
  const [tourMuted, setTourMuted] = useState(true);
  const [progressoTimer, setProgressoTimer] = useState(0);
  const videoTourRef = useRef<HTMLVideoElement | null>(null);

  const modulosTour = [
    {
      id: "fluxo-caixa",
      numero: "01",
      tag: "Dashboard Inteligente",
      titulo: "Fluxo de Caixa em Tempo Real",
      descricao:
        "Lançamento em menos de 1 minuto, saldo diário sincronizado e previsão do que entra e sai sem planilhas confusas.",
      icon: TrendingUp,
      video: "/NR1.mp4",
      badgeCor: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    },
    {
      id: "cartoes",
      numero: "02",
      tag: "Gestão de Cartões",
      titulo: "Controle Total de Faturas e Limites",
      descricao:
        "Acompanhe o fechamento de cada fatura e o melhor dia de compra para ter até 40 dias sem juros.",
      icon: CreditCard,
      video: "/NR1-CARTÕES.mp4",
      badgeCor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    },
    {
      id: "blindagem-pfpj",
      numero: "03",
      tag: "Separação Blindada",
      titulo: "Módulo Duplo: PF e PJ Integrados",
      descricao:
        "Alterne entre sua vida pessoal e a empresa com 1 clique, acabando de vez com a mistura de contas.",
      icon: Building2,
      video: "/NR1-PFJ.mp4",
      badgeCor: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    },
    {
      id: "samy-ia",
      numero: "04",
      tag: "Inteligência Artificial",
      titulo: "Assistente Financeira Samy IA 24h",
      descricao:
        "Tire dúvidas no WhatsApp ou no app, calcule simulações de compras e receba conselhos práticos para poupar.",
      icon: Bot,
      video: "/NR1-AI.mp4",
      badgeCor: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    },
  ];

  // Timer de Autoplay do Tour Visual com atualização suave da barra de progresso (5.5s por módulo)
  useEffect(() => {
    if (!tourAutoplay) return;
    const duracaoPasso = 5500;
    const intervaloTick = 50;
    const stepIncrement = (intervaloTick / duracaoPasso) * 100;

    const timer = setInterval(() => {
      setProgressoTimer((prev) => {
        if (prev >= 100) {
          setTourAtivo((current) => (current + 1) % modulosTour.length);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervaloTick);

    return () => clearInterval(timer);
  }, [tourAutoplay, modulosTour.length]);

  // Reseta o tempo do vídeo ao alternar de módulo
  useEffect(() => {
    if (videoTourRef.current) {
      videoTourRef.current.currentTime = 0;
      videoTourRef.current.play().catch(() => {});
    }
  }, [tourAtivo]);

  const toggleFaq = (index: number) => {
    setFaqAberto((prev) => (prev === index ? null : index));
  };

  const [modalidadePlano, setModalidadePlano] = useState<"pf" | "pj" | "combo">("pf");

  const wppNumber = "5577981381477";

  const planosPorModalidade = {
    pf: {
      nome: "App Pessoa Física",
      tagline: "Para você e sua família organizarem a vida financeira",
      mensal: {
        valor: "R$ 49,90",
        link: `https://wa.me/${wppNumber}?text=${encodeURIComponent(
          "Olá, Natália! Gostaria de assinar o Organiz.AI Pessoa Física no Plano Mensal (R$ 49,90/mês). Como faço para liberar meu acesso agora?"
        )}`,
      },
      trimestral: {
        parcelas: "3x de",
        valorParcela: "R$ 39,97",
        aVista: "ou R$ 119,90 à vista",
        link: `https://wa.me/${wppNumber}?text=${encodeURIComponent(
          "Olá, Natália! Gostaria de assinar o Organiz.AI Pessoa Física no Plano Trimestral (3x de R$ 39,97 ou R$ 119,90 à vista). Como faço para liberar meu acesso agora?"
        )}`,
        beneficios: [
          "Dashboard financeiro completo PF",
          "Controle de contas, cartões e categorias",
          "Metas financeiras e Cofrinhos de reserva",
          "Assistente Inteligente Samy IA inclusa",
        ],
      },
      semestral: {
        parcelas: "6x de",
        valorParcela: "R$ 34,98",
        aVista: "ou R$ 209,90 à vista",
        link: `https://wa.me/${wppNumber}?text=${encodeURIComponent(
          "Olá, Natália! Gostaria de assinar o Organiz.AI Pessoa Física no Plano Semestral (6x de R$ 34,98 ou R$ 209,90 à vista). Como faço para liberar meu acesso agora?"
        )}`,
        beneficios: [
          "Todos os benefícios do Trimestral",
          "Histórico semestral contínuo de fluxo de caixa",
          "Relatórios analíticos e exportação",
          "Assistente Inteligente Samy IA inclusa",
        ],
      },
      anual: {
        parcelas: "12x de",
        valorParcela: "R$ 29,16",
        aVista: "ou R$ 349,90 à vista",
        diario: "Menos de R$ 1,00 por dia (apenas R$ 0,97/dia!)",
        link: `https://wa.me/${wppNumber}?text=${encodeURIComponent(
          "Olá, Natália! Gostaria de assinar o Organiz.AI Pessoa Física no Plano Anual com o maior desconto (12x de R$ 29,16 ou R$ 349,90 à vista). Como faço para liberar meu acesso agora?"
        )}`,
        beneficios: [
          "1 ano completo de organização financeira irrestrita",
          "Dashboard e controle pessoal com inteligência preditiva",
          "Acesso a Assistente Samy IA com mais créditos diários",
          "Todas as novas atualizações e recursos liberados",
        ],
      },
    },
    pj: {
      nome: "App Empresa",
      tagline: "Para o seu negócio, MEI ou empresa ter controle total de caixa",
      mensal: {
        valor: "R$ 69,90",
        link: `https://wa.me/${wppNumber}?text=${encodeURIComponent(
          "Olá, Natália! Gostaria de assinar o Organiz.AI Empresa no Plano Mensal (R$ 69,90/mês). Como faço para liberar meu acesso agora?"
        )}`,
      },
      trimestral: {
        parcelas: "3x de",
        valorParcela: "R$ 49,96",
        aVista: "ou R$ 149,90 à vista",
        link: `https://wa.me/${wppNumber}?text=${encodeURIComponent(
          "Olá, Natália! Gostaria de assinar o Organiz.AI Empresa no Plano Trimestral (3x de R$ 49,96 ou R$ 149,90 à vista). Como faço para liberar meu acesso agora?"
        )}`,
        beneficios: [
          "Dashboard de fluxo de caixa empresarial PJ",
          "Controle de contas a pagar, receber e despesas PJ",
          "Gestão de recebíveis e cartões corporativos",
          "Assistente Inteligente Samy IA inclusa",
        ],
      },
      semestral: {
        parcelas: "6x de",
        valorParcela: "R$ 38,31",
        aVista: "ou R$ 229,90 à vista",
        link: `https://wa.me/${wppNumber}?text=${encodeURIComponent(
          "Olá, Natália! Gostaria de assinar o Organiz.AI Empresa no Plano Semestral (6x de R$ 38,31 ou R$ 229,90 à vista). Como faço para liberar meu acesso agora?"
        )}`,
        beneficios: [
          "Todos os recursos empresariais do Trimestral",
          "Histórico semestral e relatórios da empresa",
          "Importação de extratos bancários PJ",
          "Assistente Inteligente Samy IA inclusa",
        ],
      },
      anual: {
        parcelas: "12x de",
        valorParcela: "R$ 30,82",
        aVista: "ou R$ 369,90 à vista",
        diario: "Apenas R$ 1,02 por dia para blindar a sua empresa!",
        link: `https://wa.me/${wppNumber}?text=${encodeURIComponent(
          "Olá, Natália! Gostaria de assinar o Organiz.AI Empresa no Plano Anual com o maior desconto (12x de R$ 30,82 ou R$ 369,90 à vista). Como faço para liberar meu acesso agora?"
        )}`,
        beneficios: [
          "1 ano completo de inteligência financeira empresarial",
          "Previsibilidade de caixa e blindagem contra surpresas",
          "Acesso a Assistente Samy IA com mais créditos diários",
          "Módulos futuros e relatórios gerenciais inclusos",
        ],
      },
    },
    combo: {
      nome: "App Combo PF + PJ",
      tagline: "Dois ambientes 100% isolados: sua vida pessoal e sua empresa organizadas",
      mensal: {
        valor: "R$ 99,90",
        link: `https://wa.me/${wppNumber}?text=${encodeURIComponent(
          "Olá, Natália! Gostaria de assinar o Organiz.AI Combo PF + PJ no Plano Mensal (R$ 99,90/mês). Como faço para liberar meu acesso agora?"
        )}`,
      },
      trimestral: {
        parcelas: "3x de",
        valorParcela: "R$ 73,30",
        aVista: "ou R$ 219,90 à vista",
        link: `https://wa.me/${wppNumber}?text=${encodeURIComponent(
          "Olá, Natália! Gostaria de assinar o Organiz.AI Combo PF + PJ no Plano Trimestral (3x de R$ 73,30 ou R$ 219,90 à vista). Como faço para liberar meu acesso agora?"
        )}`,
        beneficios: [
          "Acesso duplo completo: Pessoa Física e Empresa (PJ)",
          "Separação blindada de patrimônio (sem misturar contas)",
          "Controle de pró-labore e retiradas organizadas",
          "Assistente Inteligente Samy IA inclusa",
        ],
      },
      semestral: {
        parcelas: "6x de",
        valorParcela: "R$ 66,65",
        aVista: "ou R$ 399,90 à vista",
        link: `https://wa.me/${wppNumber}?text=${encodeURIComponent(
          "Olá, Natália! Gostaria de assinar o Organiz.AI Combo PF + PJ no Plano Semestral (6x de R$ 66,65 ou R$ 399,90 à vista). Como faço para liberar meu acesso agora?"
        )}`,
        beneficios: [
          "Todos os benefícios duplos do plano Trimestral",
          "Visão consolidada de patrimônio pessoal e da empresa",
          "Histórico semestral unificado e relatórios inteligentes",
          "Assistente Inteligente Samy IA inclusa",
        ],
      },
      anual: {
        parcelas: "12x de",
        valorParcela: "R$ 49,99",
        aVista: "ou R$ 599,90 à vista",
        diario: "Apenas R$ 1,66/dia para gestão integral Pessoal & Negócio!",
        link: `https://wa.me/${wppNumber}?text=${encodeURIComponent(
          "Olá, Natália! Gostaria de assinar o Organiz.AI Combo PF + PJ no Plano Anual com o maior desconto (12x de R$ 49,99 ou R$ 599,90 à vista). Como faço para liberar meu acesso agora?"
        )}`,
        beneficios: [
          "1 ano completo com os 2 ambientes (PF + PJ) desbloqueados",
          "Separação definitiva das contas pessoais e empresariais",
          "Acesso a Assistente Samy IA com mais créditos diários",
          "Acesso prioritário a todos os novos recursos e módulos",
        ],
      },
    },
  };

  const planoAtual = planosPorModalidade[modalidadePlano];

  const schemaOrgAppData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Organiz.AI",
    operatingSystem: "Web, iOS, Android",
    applicationCategory: "FinanceApplication",
    description:
      "Plataforma de inteligência financeira prática com IA, gestão de despesas fixas e variáveis, cartões de crédito, saldos bancários e cofrinhos PF e PJ.",
    url: "https://nataliarodolfo.com.br/app",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "BRL",
      lowPrice: "29.16",
      highPrice: "49.70",
      offerCount: "3",
    },
    author: {
      "@type": "Person",
      name: "Natália Rodolfo",
      url: "https://nataliarodolfo.com.br",
    },
  };

  return (
    <div className="min-h-screen bg-[#060709] text-stone-100 font-sans selection:bg-[#F97316]/30 selection:text-white overflow-x-hidden antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgAppData) }}
      />
      {/* Luzes de fundo atmosféricas inspiradas em fintechs modernas (Neon/Nubank/Inter) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden [contain:paint]">
        <div className="absolute -top-[160px] left-1/2 -translate-x-1/2 h-[650px] w-[960px] rounded-full bg-gradient-to-b from-[#F97316]/20 via-orange-600/5 to-transparent blur-[90px] sm:blur-[180px]" />
        <div className="absolute top-[38%] right-[-200px] h-[580px] w-[580px] rounded-full bg-amber-500/10 blur-[80px] sm:blur-[160px]" />
        <div className="absolute top-[68%] left-[-220px] h-[640px] w-[640px] rounded-full bg-emerald-600/10 blur-[90px] sm:blur-[180px]" />
      </div>

      {/* 1. TOP NAVBAR FINTECH (COM BOTÃO DE LOGIN EM DESTAQUE) */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#060709]/85 backdrop-blur-2xl transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo OrganizAI */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <picture>
                <source srcSet="/logo.webp" type="image/webp" />
                <img
                  src="/logo.png"
                  alt="Organiz.AI"
                  width={40}
                  height={40}
                  decoding="async"
                  className="h-9 w-9 sm:h-10 sm:w-10 object-contain drop-shadow-[0_2px_12px_rgba(249,115,22,0.4)]"
                />
              </picture>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-base sm:text-lg font-bold tracking-tight text-white">
                Organiz<span className="text-[#F97316] font-black">.AI</span>
              </span>
              <span className="text-[10px] sm:text-[11px] text-stone-400">
                Finanças Descomplicadas
              </span>
            </div>
          </Link>

          {/* Links Centrais (Estilo Inter & Nubank) */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-stone-300">
            <a href="#demonstracao" className="hover:text-white transition-colors">
              O App por Dentro
            </a>
            <a href="#comparativo" className="hover:text-white transition-colors">
              O Jeito Organiz.AI
            </a>
            <a href="#modulos" className="hover:text-white transition-colors">
              Módulos
            </a>
            <a href="#planos" className="text-[#F97316] hover:brightness-125 transition-all font-bold">
              Planos &amp; Preços
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              Dúvidas
            </a>
          </nav>

          {/* Botão de Acesso do Topo em Destaque */}
          <div className="flex items-center">
            <Link
              to="/login"
              className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#F97316] via-orange-500 to-amber-500 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-[0_4px_22px_rgba(249,115,22,0.45)] hover:shadow-[0_6px_28px_rgba(249,115,22,0.65)] hover:brightness-110 active:scale-95 transition-all cursor-pointer ring-1 ring-white/20"
            >
              <User className="h-4 w-4 stroke-[2.5] text-white" />
              <span>Já sou Assinante</span>
              <ArrowRight className="h-3.5 w-3.5 stroke-[2.5] text-white transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION COM O VÍDEO BACKGROUND EM ALTA DEFINIÇÃO */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        {/* Background Video Atmosférico */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 [contain:paint]">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="h-full w-full object-cover opacity-25 sm:opacity-30 scale-105 transition-opacity duration-1000"
          >
            <source src="/HERO-BG2.mp4" type="video/mp4" />
          </video>
          {/* Camada de degradê para garantir 100% de legibilidade dos textos e botões */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#060709]/85 via-[#060709]/75 to-[#060709]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(249,115,22,0.18),transparent)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-20">
          
          {/* Grid Principal Inspirado no Layout de Alta Conversão (Optibiz) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-14 items-center">
            
            {/* Coluna da Esquerda: Textos, Ações e Prova Social */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              
              {/* Badge Superior: Boas-vindas ao Organiz.AI */}
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold text-orange-400 mb-4 sm:mb-5 shadow-sm backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Bem-vindo ao Organiz.AI</span>
              </div>

              {/* Headline Principal */}
              <h1 className="font-display text-2xl sm:text-4xl lg:text-[2.6rem] xl:text-[2.85rem] font-extrabold tracking-tight text-white leading-[1.14] sm:leading-[1.16] max-w-xl">
                A clareza financeira que
                <br />
                o seu dinheiro sempre pediu.
                <span className="bg-gradient-to-r from-[#F97316] via-amber-400 to-[#F97316] bg-clip-text text-transparent block mt-1 sm:mt-1.5">
                  Para você e para sua empresa.
                </span>
              </h1>

              {/* Subheadline persuasiva com foco na dor real */}
              <p className="mt-4 sm:mt-5 text-base sm:text-lg text-stone-300 leading-relaxed max-w-xl font-normal">
                Chega de planilhas complexas abandonadas na segunda semana ou faturas do cartão que dão sustos. O{" "}
                <strong className="text-white font-semibold">Organiz.AI</strong> traz a metodologia prática da educadora Natália Rodolfo em uma plataforma simples, que você controla em menos de 5 minutos ao dia.
              </p>

              {/* Botões de Ação Hero: Botão Largo em Pílula + Botão Circular de Play */}
              <div className="mt-6 sm:mt-8 flex items-center gap-4 sm:gap-5 flex-wrap">
                <a
                  href="#planos"
                  className="group inline-flex items-center gap-3.5 rounded-full bg-gradient-to-r from-[#F97316] via-orange-500 to-amber-500 pl-6 sm:pl-7 pr-2.5 py-2.5 sm:py-3 text-sm sm:text-base font-extrabold text-white shadow-[0_8px_32px_rgba(249,115,22,0.45)] hover:shadow-[0_10px_40px_rgba(249,115,22,0.65)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Quero Começar Agora</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-transform group-hover:translate-x-0.5 group-hover:bg-white group-hover:text-[#F97316]">
                    <ArrowRight className="h-4 w-4 stroke-[3]" />
                  </div>
                </a>

                <a
                  href="#demonstracao"
                  className="group flex items-center gap-3 text-stone-300 hover:text-white transition-colors cursor-pointer"
                  title="Ver Tour do App em Vídeo"
                >
                  <div className="flex h-12 w-12 sm:h-13 sm:w-13 shrink-0 items-center justify-center rounded-full bg-white text-stone-900 shadow-xl shadow-black/50 group-hover:scale-105 group-hover:bg-amber-400 group-hover:text-black transition-all">
                    <Play className="h-5 w-5 sm:h-5 sm:w-5 fill-current ml-0.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold">
                    Ver Tour em Vídeo
                  </span>
                </a>
              </div>

              {/* Barra de Prova Social: Avaliações + Comunidade Ativa */}
              <div className="mt-8 sm:mt-10 pt-5 border-t border-white/[0.08] flex flex-wrap items-center gap-6 sm:gap-10 w-full">
                
                {/* Item 1: Estrelas & Avaliação 4.9 Alinhada com os Textos */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-[11px] font-bold text-stone-300 ml-1">(4.9/5)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">4.9</span>
                    <span className="text-xs text-stone-400 font-medium leading-snug">
                      Avaliações Positivas<br />de Assinantes
                    </span>
                  </div>
                </div>

                {/* Item 2: Cluster de Avatares (Comunidade Ativa) */}
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold text-stone-400 mb-1.5 uppercase tracking-wider">
                    Junte-se a nós agora:
                  </span>
                  <div className="flex items-center gap-2.5">
                    <div className="flex -space-x-2.5 overflow-hidden">
                      <img
                        className="inline-block h-9 w-9 rounded-full ring-2 ring-[#0c0a09] object-cover"
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                        alt="Usuária Organiz.AI"
                        width={36}
                        height={36}
                      />
                      <img
                        className="inline-block h-9 w-9 rounded-full ring-2 ring-[#0c0a09] object-cover"
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                        alt="Usuário Organiz.AI"
                        width={36}
                        height={36}
                      />
                      <img
                        className="inline-block h-9 w-9 rounded-full ring-2 ring-[#0c0a09] object-cover"
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80"
                        alt="Usuária Organiz.AI"
                        width={36}
                        height={36}
                      />
                      <img
                        className="inline-block h-9 w-9 rounded-full ring-2 ring-[#0c0a09] object-cover"
                        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80"
                        alt="Usuária Organiz.AI"
                        width={36}
                        height={36}
                      />
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 ring-2 ring-[#0c0a09] text-xs font-bold font-mono">
                        +
                      </div>
                    </div>
                    <span className="text-xs font-medium text-stone-300 leading-tight">
                      +250 pessoas<br />organizadas
                    </span>
                  </div>
                </div>

              </div>

            </div>

            {/* Coluna da Direita: Smartphones Isométricos Flutuantes em 3D Voltados para Cima com Hover Dinâmico */}
            <div className="lg:col-span-5 relative flex items-center justify-center py-6 sm:py-10">
              
              {/* Brilho Atmosférico Neon Atrás dos Telefones */}
              <div className="pointer-events-none absolute -inset-4 sm:-inset-10 rounded-full bg-gradient-to-tr from-[#F97316]/25 via-amber-500/15 to-transparent blur-3xl opacity-75" />

              {/* Badge Flutuante Superior */}
              <div className="absolute -top-3 sm:top-2 -left-2 sm:-left-6 z-30 flex items-center gap-3 rounded-2xl border border-white/15 bg-[#0e1015]/90 backdrop-blur-xl px-4 py-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] ring-1 ring-white/10 transition-transform duration-500 hover:-translate-y-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                  <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">Metodologia Validada</p>
                  <p className="text-[10px] text-stone-400">Separação Blindada PF e PJ</p>
                </div>
              </div>

              {/* Container dos Smartphones em Perspectiva 3D Isométrica Voltada para Cima com Interação Dinâmica */}
              <div className="group/phones relative w-[310px] sm:w-[380px] lg:w-[410px] h-[480px] sm:h-[530px] flex items-center justify-center select-none [perspective:1200px] cursor-pointer">
                
                {/* Sombra de Chão 3D Projetada */}
                <div className="absolute bottom-4 inset-x-8 h-12 rounded-full bg-black/80 blur-2xl transform rotate-[22deg] scale-90 group-hover/phones:scale-105 group-hover/phones:opacity-95 transition-all duration-700 pointer-events-none" />

                {/* Smartphone de Fundo (PJ / Contas Empresariais - deslocado em profundidade 3D) */}
                <div className="absolute top-12 sm:top-10 left-16 sm:left-20 z-10 w-[205px] sm:w-[240px] aspect-[9/19] rounded-[38px] p-2 bg-gradient-to-b from-[#252830] via-[#121418] to-[#07080a] border-2 border-white/15 shadow-[0_30px_70px_rgba(0,0,0,0.95)] ring-1 ring-white/10 [transform-style:preserve-3d] [transform:rotateX(32deg)_rotateY(-18deg)_rotateZ(26deg)] opacity-85 group-hover/phones:opacity-100 group-hover/phones:translate-x-3 group-hover/phones:translate-y-1 transition-all duration-700 ease-out">
                  <div className="relative h-full w-full rounded-[30px] overflow-hidden bg-[#090b0e] p-3 flex flex-col justify-between border border-white/5">
                    {/* Top notch */}
                    <div className="mx-auto h-3.5 w-20 rounded-full bg-black/90 border border-white/10 mb-2" />
                    {/* Header PJ */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">Módulo PJ</span>
                        <span className="text-[9px] text-stone-500 font-mono">Empresa Ativa</span>
                      </div>
                      <p className="text-[11px] text-stone-400">Faturamento Mensal</p>
                      <p className="text-base font-black text-white">R$ 58.920,00</p>
                    </div>
                    {/* Mini gráfico */}
                    <div className="my-2 p-2 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
                      <div className="flex justify-between text-[9px] text-stone-400">
                        <span>Lucro Líquido</span>
                        <span className="text-emerald-400 font-bold">+32.4%</span>
                      </div>
                      <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full" />
                      </div>
                    </div>
                    {/* Contas a Pagar */}
                    <div className="space-y-1 text-[9px] text-stone-400">
                      <div className="flex justify-between p-1.5 rounded-lg bg-white/[0.02]">
                        <span>Fornecedores</span>
                        <span className="text-white font-semibold">R$ 12.450</span>
                      </div>
                      <div className="flex justify-between p-1.5 rounded-lg bg-white/[0.02]">
                        <span>Impostos DAS</span>
                        <span className="text-white font-semibold">R$ 3.820</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Smartphone da Frente (Principal: Dashboard OrganizAI PF - 3D voltado para cima com levitação dinâmica) */}
                <div className="absolute top-0 left-0 sm:-left-2 z-20 w-[225px] sm:w-[260px] aspect-[9/19] rounded-[42px] p-2 sm:p-2.5 bg-gradient-to-b from-[#313540] via-[#16181f] to-[#07080a] border-2 border-white/25 shadow-[0_35px_90px_rgba(0,0,0,0.98),0_0_35px_rgba(249,115,22,0.25)] ring-1 ring-white/15 [transform-style:preserve-3d] [transform:rotateX(32deg)_rotateY(-18deg)_rotateZ(24deg)] group-hover/phones:[transform:rotateX(24deg)_rotateY(-12deg)_rotateZ(23deg)] group-hover/phones:-translate-y-4 group-hover/phones:scale-[1.03] transition-all duration-700 ease-out">
                  <div className="relative h-full w-full rounded-[34px] overflow-hidden bg-[#0a0c10] p-3 sm:p-3.5 flex flex-col justify-between border border-white/10">
                    
                    {/* Dynamic Island */}
                    <div className="mx-auto h-4 w-22 rounded-full bg-black/90 border border-white/15 flex items-center justify-center mb-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-stone-700 ml-auto mr-2" />
                    </div>

                    {/* Header do App */}
                    <div className="flex items-center justify-between pb-1 border-b border-white/[0.06]">
                      <div className="flex items-center gap-1.5">
                        <div className="h-5 w-5 rounded-md bg-[#F97316] flex items-center justify-center text-[10px] font-black text-white">AI</div>
                        <span className="text-xs font-bold text-white tracking-tight">Organiz<span className="text-[#F97316]">.AI</span></span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        Online
                      </span>
                    </div>

                    {/* Saldo Principal */}
                    <div className="pt-2 space-y-0.5">
                      <p className="text-[10px] text-stone-400 font-medium">Saldo Geral Disponível</p>
                      <p className="text-lg sm:text-xl font-black text-white tracking-tight">
                        R$ 34.567<span className="text-stone-400 text-sm">,89</span>
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                        <TrendingUp className="h-3 w-3" />
                        <span>+18,4% economia este mês</span>
                      </div>
                    </div>

                    {/* Curva Gráfica Simulada */}
                    <div className="py-2">
                      <div className="h-14 sm:h-16 w-full rounded-xl bg-gradient-to-b from-orange-500/15 to-transparent border border-orange-500/20 p-2 flex flex-col justify-between">
                        <div className="flex justify-between text-[9px] text-stone-400 font-mono">
                          <span>Fluxo Semanal</span>
                          <span className="text-orange-400 font-bold">R$ 8.120</span>
                        </div>
                        <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 30" fill="none">
                          <path d="M0 25 C20 22, 35 8, 50 14 C65 20, 80 5, 100 2" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
                          <circle cx="50" cy="14" r="2.5" fill="#F97316" />
                          <circle cx="100" cy="2" r="3" fill="#FBBF24" />
                        </svg>
                      </div>
                    </div>

                    {/* Cards de Recursos Rápidos */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.04] border border-white/5">
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="h-3 w-3 text-amber-400" />
                          <span className="text-[10px] text-stone-300 font-semibold">Cartões Nubank/Inter</span>
                        </div>
                        <span className="text-[10px] font-mono text-white font-bold">R$ 2.053</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.04] border border-white/5">
                        <div className="flex items-center gap-1.5">
                          <PiggyBank className="h-3 w-3 text-emerald-400" />
                          <span className="text-[10px] text-stone-300 font-semibold">Cofrinho Reserva</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">R$ 15.420</span>
                      </div>
                    </div>

                    {/* Barra Inferior */}
                    <div className="pt-1.5 flex justify-around text-stone-500 border-t border-white/[0.06]">
                      <div className="h-1 w-12 rounded-full bg-stone-600 mx-auto" />
                    </div>

                  </div>
                </div>

              </div>

              {/* Badge Flutuante Inferior ("25+ Years Of Experience" style) */}
              <div className="absolute -bottom-3 sm:bottom-2 right-1 sm:-right-4 z-30 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-[#F97316] p-3.5 sm:p-5 shadow-[0_20px_45px_rgba(249,115,22,0.45)] border border-white/25 hover:scale-105 transition-transform">
                <div className="text-stone-950 font-black text-2xl sm:text-3xl tracking-tight leading-none">
                  10+
                </div>
                <p className="text-[10px] sm:text-xs font-black text-stone-950 leading-tight mt-1 max-w-[100px] sm:max-w-[110px]">
                  Anos de Prática &amp; Metodologia
                </p>
              </div>

            </div>

          </div>

          {/* Micro-pills de Confiança no Rodapé da Hero */}
          <div className="mt-12 sm:mt-16 pt-8 border-t border-white/[0.08] flex flex-wrap items-center justify-center lg:justify-between gap-x-8 gap-y-3 text-xs sm:text-sm text-stone-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>No celular e no computador</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Menos de R$ 1,00/dia no Anual</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Garantia incondicional de 7 dias</span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. SEÇÃO TOUR VISUAL INTERATIVO COM BOTÕES À ESQUERDA E VÍDEOS DOS MÓDULOS À DIREITA (NR1.mp4) */}
      <section id="demonstracao" className="relative z-10 py-16 sm:py-24 border-t border-white/[0.08] bg-[#090b0e]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Cabeçalho da Seção */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1 text-xs font-bold text-orange-400 mb-3">
              <Film className="h-3.5 w-3.5" />
              <span>Tour Visual Interativo</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.12]">
              Veja como o Organiz.AI
              <br />
              funciona por dentro
            </h2>
            <p className="mt-3 text-sm sm:text-base text-stone-400 leading-relaxed max-w-2xl mx-auto">
              Selecione um dos módulos à esquerda ou acompanhe o tour automático para ver a experiência prática do app em tempo real.
            </p>
          </div>

          {/* Grid Principal: Botões dos Módulos à Esquerda e Vídeo Real à Direita */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
            
            {/* Coluna da Esquerda: Lista de Botões Interativos dos Módulos */}
            <div
              className="lg:col-span-6 space-y-3"
              onMouseEnter={() => setTourAutoplay(false)}
              onMouseLeave={() => setTourAutoplay(true)}
            >
              {modulosTour.map((item, idx) => {
                const isSelected = tourAtivo === idx;
                const IconComponent = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setTourAtivo(idx);
                      setProgressoTimer(0);
                    }}
                    className={`group relative w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-r from-orange-500/15 via-stone-900/60 to-[#101217] border-orange-500/50 shadow-xl shadow-orange-950/20"
                        : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/15"
                    }`}
                  >
                    {/* Barra de Progresso do Autoplay Ativo */}
                    {isSelected && tourAutoplay && (
                      <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/[0.08]">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-75 ease-linear"
                          style={{ width: `${progressoTimer}%` }}
                        />
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      {/* Ícone do Módulo */}
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                          isSelected
                            ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105"
                            : "bg-white/[0.06] text-stone-400 group-hover:text-white group-hover:bg-white/[0.1]"
                        }`}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>

                      {/* Informações Textuais */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${item.badgeCor}`}>
                            {item.tag}
                          </span>
                          <span className="text-[11px] font-mono font-medium text-stone-500 ml-auto">
                            Módulo {item.numero}
                          </span>
                        </div>

                        <h3 className={`text-base sm:text-lg font-bold transition-colors ${isSelected ? "text-white" : "text-stone-300 group-hover:text-white"}`}>
                          {item.titulo}
                        </h3>

                        <p className={`mt-1.5 text-xs sm:text-sm leading-relaxed transition-all duration-300 ${
                          isSelected ? "text-stone-300 line-clamp-3" : "text-stone-400 line-clamp-2"
                        }`}>
                          {item.descricao}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* Card Destaque: E há muito mais no OrganizAI */}
              <div className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-r from-orange-500/10 via-stone-900/40 to-amber-500/10 p-4 sm:p-4.5 backdrop-blur-sm overflow-hidden">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-orange-500/30 text-orange-400 bg-orange-500/10">
                        Ecossistema Completo
                      </span>
                      <span className="text-xs font-bold text-white">
                        E há muito mais dentro do app
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                      Cofrinhos de metas & reserva de emergência, importação inteligente de extratos, gestão de patrimônio, acesso compartilhado (2º usuário) e relatórios preditivos para sua independência financeira.
                    </p>
                  </div>
                </div>
              </div>

              {/* Controle de Play/Pause do Tour Automático */}
              <div className="pt-2 flex items-center justify-between text-xs text-stone-400 px-1">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${tourAutoplay ? "bg-emerald-400 animate-pulse" : "bg-stone-600"}`} />
                  <span>{tourAutoplay ? "Tour automático rodando (5.5s por módulo)" : "Tour pausado para sua leitura"}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTourAutoplay((prev) => !prev);
                    setProgressoTimer(0);
                  }}
                  className="flex items-center gap-1.5 font-semibold text-orange-400 hover:text-orange-300 transition-colors cursor-pointer py-1 px-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08]"
                >
                  {tourAutoplay ? (
                    <>
                      <Pause className="h-3 w-3" /> Pausar
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3" /> Retomar
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Coluna da Direita: Smartphone Mockup com Vídeo Real (Sem Borda Branca) */}
            <div className="lg:col-span-6 flex items-center justify-center relative">
              
              {/* Brilho de Fundo da Moldura */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-orange-500/20 via-amber-500/10 to-transparent blur-3xl pointer-events-none opacity-60" />

              {/* Moldura de Smartphone Escuro (Elimina 100% de qualquer borda branca com scale e overflow-hidden) */}
              <div className="relative w-full max-w-[310px] sm:max-w-[335px] xl:max-w-[355px] rounded-[42px] p-2.5 sm:p-3 bg-gradient-to-b from-[#22242a] via-[#121316] to-[#08090a] border-2 border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_35px_rgba(249,115,22,0.15)] ring-1 ring-white/10">
                
                {/* Botões laterais simulados do smartphone */}
                <div className="absolute -left-[4px] top-24 h-9 w-[3px] rounded-l-md bg-stone-700" />
                <div className="absolute -left-[4px] top-36 h-12 w-[3px] rounded-l-md bg-stone-700" />
                <div className="absolute -right-[4px] top-28 h-14 w-[3px] rounded-r-md bg-stone-700" />

                {/* Visor Interno: overflow-hidden absoluto e cantos arredondados de celular */}
                <div className="relative aspect-[9/19] w-full rounded-[34px] overflow-hidden bg-black shadow-inner">
                  
                  {/* Dynamic Island no topo */}
                  <div className="absolute top-2.5 inset-x-0 mx-auto h-4 w-24 rounded-full bg-black/90 border border-white/10 z-30 pointer-events-none flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-stone-700 ml-auto mr-2" />
                  </div>

                  {/* VÍDEO DO MÓDULO (COM SCALE PARA CORTAR QUALQUER BORDA BRANCA DAS EXTREMIDADES) */}
                  <video
                    ref={videoTourRef}
                    key={modulosTour[tourAtivo]?.video + tourAtivo}
                    src={modulosTour[tourAtivo]?.video}
                    autoPlay
                    muted={tourMuted}
                    loop
                    playsInline
                    className="h-full w-full object-cover scale-[1.06] transition-transform duration-500 select-none"
                    style={{
                      clipPath: "inset(2px round 32px)",
                    }}
                  />

                  {/* Gradiente sutil de reflexo de tela de vidro */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none z-20" />

                  {/* Barra Flutuante de Status no Rodapé do Vídeo */}
                  <div className="absolute bottom-3 inset-x-3 z-30 flex items-center justify-between gap-2 p-2 px-3 rounded-2xl bg-black/80 backdrop-blur-md border border-white/15 text-xs text-white shadow-lg">
                    <div className="flex items-center gap-2 truncate">
                      <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse shrink-0" />
                      <span className="font-semibold text-[11px] truncate text-stone-200">
                        {modulosTour[tourAtivo]?.titulo}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTourMuted((prev) => !prev)}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 hover:bg-orange-500 hover:text-black text-stone-300 transition-colors cursor-pointer"
                      title={tourMuted ? "Ativar áudio" : "Silenciar áudio"}
                      aria-label={tourMuted ? "Ativar áudio" : "Silenciar áudio"}
                    >
                      {tourMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. SEÇÃO COMPARATIVA: O JEITO ANTIGO VS. O JEITO ORGANIZAI (ESTILO NUBANK) */}
      <section id="comparativo" className="relative z-10 border-t border-white/[0.08] bg-[#060709] py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-rose-400">
              A Diferença é Brutal
            </span>
            <h2 className="mt-2 font-display text-2xl sm:text-4xl font-bold text-white tracking-tight">
              O jeito antigo te cansa.
              <br />
              O jeito Organiz.AI te liberta.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-stone-400 leading-relaxed">
              Veja por que quem tenta controlar as finanças do jeito tradicional acaba desistindo, e como a nossa plataforma muda as regras do jogo:
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* O JEITO ANTIGO */}
            <div className="rounded-3xl border border-rose-500/20 bg-[#120f12] p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-3 pb-5 border-b border-rose-500/20">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400">
                  <XCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">O Jeito Antigo e Burocrático</h3>
                  <span className="text-xs text-rose-400">O que te faz perder dinheiro e sono</span>
                </div>
              </div>

              <ul className="mt-6 space-y-4 text-xs sm:text-sm text-stone-300">
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>Planilhas cheias de fórmulas</strong> que quebram, travam e levam 40 minutos para preencher.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>Susto na fatura do cartão</strong> por não acompanhar o acúmulo de pequenas compras parceladas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>Mistura de contas PF e PJ</strong>: o almoço de domingo sai da empresa e a taxa do banco sai da sua conta pessoal.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>Sensação de trabalhar sem ver a cor do dinheiro</strong>, sem conseguir criar reserva de emergência.</span>
                </li>
              </ul>
            </div>

            {/* O JEITO ORGANIZAI */}
            <div className="rounded-3xl border-2 border-orange-500/50 bg-gradient-to-b from-[#18110b] via-[#120f0d] to-[#0d0e12] p-6 sm:p-8 shadow-2xl ring-1 ring-orange-500/30">
              <div className="flex items-center gap-3 pb-5 border-b border-orange-500/30">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/20 text-[#F97316]">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">O Jeito Organiz.AI</h3>
                  <span className="text-xs text-orange-400 font-medium">Clareza e tranquilidade com método</span>
                </div>
              </div>

              <ul className="mt-6 space-y-4 text-xs sm:text-sm text-stone-200">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-400 shrink-0 stroke-[2.5]" />
                  <span><strong>Menos de 5 minutos por dia</strong> no celular ou computador com interface limpa e intuitiva.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-400 shrink-0 stroke-[2.5]" />
                  <span><strong>Visão antecipada de todos os cartões</strong>, limites e indicação do melhor dia de compra.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-400 shrink-0 stroke-[2.5]" />
                  <span><strong>Separação blindada de PF e PJ</strong> com 1 clique, sem precisar pagar duas assinaturas separadas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-400 shrink-0 stroke-[2.5]" />
                  <span><strong>Cofrinhos com metas visuais</strong> e assistente Samy IA te ajudando a fazer o dinheiro sobrar.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CARROSSEL DE MÓDULOS (ESTILO NUBANK INFORMATIVO COM EFEITO BLUR E EXTENSÃO ATÉ A BORDA DIREITA) */}
      <section id="modulos" className="relative z-10 py-16 sm:py-24 border-t border-white/[0.08] bg-[#08090c] overflow-x-hidden">
        {/* Contêiner que alinha o texto da esquerda estritamente com as seções anteriores (max-w-7xl) e estende a esteira de cards até a lateral direita */}
        <div className="w-full pl-4 sm:pl-6 lg:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pr-0">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-10 xl:gap-12">
            
            {/* Bloco da Esquerda: Título da Seção Centralizado na Vertical com os Cards */}
            <div className="w-full lg:w-[330px] xl:w-[370px] shrink-0 pr-4 sm:pr-6 lg:pr-2 z-30 relative bg-transparent pointer-events-none select-none lg:self-start lg:pt-[110px] xl:pt-[125px]">
              <h2 className="font-display text-3xl sm:text-5xl lg:text-[44px] xl:text-[50px] font-black text-white tracking-tight leading-[1.08] drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)]">
                Tudo o que você precisa em um ecossistema integrado
              </h2>
            </div>

            {/* Bloco da Direita: Esteira de Cards sem cortes até a lateral direita, passando por trás do título */}
            <div
              className="flex-1 min-w-0 relative lg:-ml-[150px] xl:-ml-[180px] z-10"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Trilho Interativo com Arrastar, Swipe e Loop Infinito */}
              <div
                className="overflow-visible touch-pan-y"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <div
                  className="flex items-center select-none"
                  style={{
                    transform: `translateX(${
                      -(activeIndex * (cardWidth + cardGap) - peekOffset) +
                      (isDragging ? dragDeltaX * 0.4 : 0)
                    }px)`,
                    gap: `${cardGap}px`,
                    transition: withTransition
                      ? "transform 650ms cubic-bezier(0.22, 1, 0.36, 1)"
                      : "none",
                  }}
                >
                  {loopCards.map((item, index) => {
                    const isPastImmediate = index === activeIndex - 1;
                    const isOlderPast = index < activeIndex - 1;
                    const isActive = index === activeIndex;
                    const isNextImmediate = index === activeIndex + 1;

                    return (
                      <article
                        key={item.uniqueKey}
                        onClick={() => {
                          if (isAnimatingRef.current || index === activeIndex) return;
                          if (index > activeIndex) {
                            handleNext();
                          } else if (index < activeIndex) {
                            handlePrev();
                          }
                        }}
                        style={{
                          width: `${cardWidth}px`,
                          ...(isPastImmediate
                            ? {
                                transform: "scale(0.90) translateX(24px)",
                                WebkitMaskImage:
                                  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 15%, black 35%)",
                                maskImage:
                                  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 15%, black 35%)",
                              }
                            : {}),
                        }}
                        className={`relative flex-none h-[390px] sm:h-[425px] xl:h-[450px] rounded-3xl sm:rounded-[28px] overflow-hidden border select-none cursor-pointer ${
                          withTransition ? "transition-all duration-650 ease-[cubic-bezier(0.22,1,0.36,1)]" : ""
                        } ${
                          isOlderPast
                            ? "opacity-0 pointer-events-none scale-75 blur-[12px] z-0"
                            : isPastImmediate
                            ? "blur-[8px] opacity-65 z-10 border-white/10"
                            : isActive
                            ? "blur-0 scale-100 opacity-100 z-20 border-white/25 shadow-[0_25px_65px_rgba(0,0,0,0.98),0_0_0_1px_rgba(255,255,255,0.15)] ring-1 ring-white/20"
                            : isNextImmediate
                            ? "blur-0 scale-[0.98] opacity-100 z-15 border-white/10 hover:border-white/20"
                            : "blur-0 scale-[0.95] opacity-90 z-10 border-white/10 hover:border-white/20 hover:opacity-100"
                        }`}
                      >
                        {/* Imagem Fotográfica de Alta Resolução */}
                        <img
                          src={item.imagem}
                          alt={item.titulo}
                          loading="lazy"
                          draggable={false}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
                        />

                        {/* Gradiente Escuro para Legibilidade e Atmosfera */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 via-50% to-black/20 pointer-events-none" />
                        <div className={`absolute inset-0 bg-gradient-to-t ${item.acento} opacity-70 mix-blend-overlay pointer-events-none`} />

                        {/* Camada Escura Adicional para o card que recuou para trás com blur */}
                        {isPastImmediate && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-500 pointer-events-none" />
                        )}

                        {/* Tag Superior Discreta */}
                        <div className="relative z-10 p-5 sm:p-6 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 backdrop-blur-md px-3 py-1 text-[11px] font-medium text-stone-200 shadow-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                            {item.tag}
                          </span>
                        </div>

                        {/* Conteúdo Informativo Inferior (100% informativo, sem botões internos) */}
                        <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6 flex flex-col justify-end">
                          <span className={`text-[11px] font-bold uppercase tracking-wider ${item.badgeCorText} mb-1.5`}>
                            {item.categoria}
                          </span>
                          <h3 className="font-display text-lg sm:text-xl xl:text-2xl font-bold text-white tracking-tight leading-snug">
                            {item.titulo}
                          </h3>
                          <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
                            {item.descricao}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              {/* Controles de Navegação Estilo Nubank Posicionados Abaixo dos Cards */}
              <div className="mt-7 flex items-center gap-4">
                {/* Botões Circulares de Navegação (Sempre ativos em loop contínuo) */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Voltar card anterior"
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-stone-900/90 text-white hover:bg-orange-500 hover:border-orange-500 hover:text-black shadow-xl shadow-black/60 active:scale-95 cursor-pointer transition-all duration-200"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Avançar próximo card"
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-stone-900/90 text-white hover:bg-orange-500 hover:border-orange-500 hover:text-black shadow-xl shadow-black/60 active:scale-95 cursor-pointer transition-all duration-200"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                {/* Indicadores de bolinha interativos */}
                <div className="flex items-center gap-1.5 ml-1">
                  {modulosCarrossel.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => {
                        if (isAnimatingRef.current) return;
                        setWithTransition(true);
                        setActiveIndex(START_CYCLE * TOTAL_MODULOS + dotIdx);
                      }}
                      aria-label={`Ir para módulo ${dotIdx + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        dotIdx === currentModuloIndex
                          ? "w-8 bg-orange-400 shadow-sm shadow-orange-500/50"
                          : "w-2 bg-stone-700 hover:bg-stone-500"
                      }`}
                    />
                  ))}
                </div>

                {/* Contador Numérico */}
                <div className="text-xs font-semibold text-stone-400 ml-2">
                  <span className="text-white text-sm font-bold">{String(currentModuloIndex + 1).padStart(2, "0")}</span>
                  <span className="mx-1 text-stone-600">/</span>
                  {String(TOTAL_MODULOS).padStart(2, "0")}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. TABELA DE PLANOS DE ALTA CONVERSÃO (DESTAQUE MÁXIMO NAS PARCELAS E NO ANUAL) */}
      <section id="planos" className="relative z-10 scroll-mt-20 border-t border-white/[0.08] bg-[#060709] py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-bold text-amber-300 mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Menor que o valor de um cafezinho por dia</span>
            </div>

            {/* Título em duas linhas conforme solicitado */}
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              <span>Escolha seu plano</span>
              <br />
              <span className="text-stone-300">e comece hoje mesmo</span>
            </h2>

            <p className="mt-3 text-xs sm:text-sm text-stone-400 max-w-xl mx-auto">
              Acesso imediato e completo em todos os seus dispositivos. Cancele quando quiser.
            </p>

            {/* Seletor de Modalidades: Pessoa Física / Empresa / Combo PF + PJ */}
            <div className="flex justify-center mt-8 sm:mt-10">
              <div className="inline-flex items-center p-1.5 rounded-2xl bg-[#111216] border border-white/10 shadow-2xl gap-1 sm:gap-2">
                <button
                  type="button"
                  onClick={() => setModalidadePlano("pf")}
                  className={`flex items-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    modalidadePlano === "pf"
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 scale-[1.02]"
                      : "text-stone-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Pessoa Física</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalidadePlano("pj")}
                  className={`flex items-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    modalidadePlano === "pj"
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 scale-[1.02]"
                      : "text-stone-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <Building2 className="h-3.5 w-3.5" />
                  <span>Empresa (PJ)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalidadePlano("combo")}
                  className={`flex items-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    modalidadePlano === "combo"
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 scale-[1.02]"
                      : "text-stone-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>Combo PF + PJ</span>
                </button>
              </div>
            </div>

            <p className="mt-3 text-[11px] sm:text-xs text-orange-400/90 font-medium">
              {planoAtual.tagline}
            </p>
          </div>

          {/* Grid dos 3 Planos: Trimestral (mais estreito), Anual (no centro, mais longo e com destaque supremo), Semestral (mais estreito) */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-[0.85fr_1.3fr_0.85fr] lg:grid-cols-[0.82fr_1.36fr_0.82fr] gap-5 lg:gap-6 items-center max-w-6xl mx-auto">
            {/* PLANO 1: TRIMESTRAL (ESQUERDA - LARGURA MENOR) */}
            <div className="relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#101115] p-5 sm:p-6 shadow-lg transition-all hover:border-white/20 max-w-[340px] md:max-w-none mx-auto w-full">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
                    Trimestral
                  </span>
                  <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[10px] font-semibold text-stone-400">
                    3 Meses
                  </span>
                </div>

                <p className="mt-1.5 text-[11px] text-stone-400 leading-snug">
                  Primeiros passos para organizar suas finanças com clareza.
                </p>

                {/* Preço em Destaque em Linha Única */}
                <div className="mt-4 border-y border-white/[0.06] py-3.5 text-center">
                  <div className="flex items-baseline justify-center gap-1.5 whitespace-nowrap">
                    <span className="text-xs font-bold text-orange-400">{planoAtual.trimestral.parcelas}</span>
                    <span className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {planoAtual.trimestral.valorParcela}
                    </span>
                  </div>
                  <span className="mt-1 text-[11px] text-stone-400 block whitespace-nowrap text-center">
                    {planoAtual.trimestral.aVista}
                  </span>
                </div>

                <ul className="mt-4 space-y-2 text-[11px] sm:text-[11.5px] text-stone-300">
                  {planoAtual.trimestral.beneficios.map((ben, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400 mt-0.5" />
                      <span>{ben}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <a
                  href={planoAtual.trimestral.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 hover:bg-orange-500 hover:text-white py-2.5 px-3 text-xs font-bold text-orange-300 transition-all shadow-sm active:scale-[0.98]"
                >
                  <span>Assinar Trimestral</span>
                </a>
              </div>
            </div>

            {/* PLANO 2: ANUAL — CENTRO COM COMPRIMENTO MAIOR, DESTAQUE MÁXIMO E MELHOR CUSTO X BENEFÍCIO */}
            <div className="relative flex flex-col justify-between rounded-3xl border-2 border-amber-400/90 bg-gradient-to-b from-[#25170e] via-[#141212] to-[#0c0d10] p-6 sm:p-8 lg:p-9 shadow-[0_20px_70px_rgba(245,158,11,0.3)] ring-1 ring-amber-400/50 md:-translate-y-5 md:scale-[1.03] z-20 w-full">
              {/* Badge: Melhor Custo X Benefício com ícone Star */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 px-4 py-1 text-[10.5px] sm:text-[11px] font-black uppercase tracking-wider text-black shadow-xl shadow-amber-950/80 flex items-center gap-1.5 whitespace-nowrap">
                <Star className="h-3.5 w-3.5 fill-black stroke-black" />
                <span>Melhor Custo X Benefício</span>
              </div>

              <div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-amber-300">
                    Plano Anual
                  </span>
                  <span className="rounded-md bg-amber-400/20 border border-amber-400/40 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-amber-300">
                    12 Meses de Acesso
                  </span>
                </div>

                {/* Destaque de Economia Diária */}
                <div className="mt-3 rounded-xl bg-amber-500/15 border border-amber-400/30 py-1.5 px-3 text-center">
                  <span className="text-[11px] sm:text-xs font-extrabold text-amber-300 flex items-center justify-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span>{planoAtual.anual.diario}</span>
                  </span>
                </div>

                {/* Preço em Linha Única sem Duplicidade Centralizado */}
                <div className="mt-4 border-y border-amber-400/25 py-4 bg-black/40 rounded-xl px-4 text-center">
                  <div className="flex items-baseline justify-center gap-1.5 whitespace-nowrap">
                    <span className="text-sm font-bold text-amber-400">{planoAtual.anual.parcelas}</span>
                    <span className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md">
                      {planoAtual.anual.valorParcela}
                    </span>
                  </div>
                  <span className="mt-1 text-xs text-amber-200/90 block whitespace-nowrap font-medium text-center">
                    {planoAtual.anual.aVista}
                  </span>
                </div>

                <ul className="mt-5 space-y-2.5 text-xs text-stone-200 font-medium">
                  {planoAtual.anual.beneficios.map((ben, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 shrink-0 text-amber-400 mt-0.5 stroke-[2.5]" />
                      <span>{ben}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <a
                  href={planoAtual.anual.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 py-3.5 px-4 text-xs sm:text-sm font-black text-black shadow-lg shadow-orange-950/70 hover:brightness-110 active:scale-[0.98] transition-all"
                >
                  <Star className="h-4 w-4 fill-black stroke-black" />
                  <span>Garantir Plano Anual</span>
                </a>
                <p className="mt-2 text-center text-[10.5px] text-stone-400">
                  Garantia incondicional de 7 dias ou 100% de volta.
                </p>
              </div>
            </div>

            {/* PLANO 3: SEMESTRAL (DIREITA - LARGURA MENOR) */}
            <div className="relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#101115] p-5 sm:p-6 shadow-lg transition-all hover:border-white/20 max-w-[340px] md:max-w-none mx-auto w-full">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
                    Semestral
                  </span>
                  <span className="rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                    Economia
                  </span>
                </div>

                <p className="mt-1.5 text-[11px] text-stone-400 leading-snug">
                  Estabilidade e controle contínuo durante 6 meses completos.
                </p>

                {/* Preço em Destaque em Linha Única */}
                <div className="mt-4 border-y border-white/[0.06] py-3.5 text-center">
                  <div className="flex items-baseline justify-center gap-1.5 whitespace-nowrap">
                    <span className="text-xs font-bold text-orange-400">{planoAtual.semestral.parcelas}</span>
                    <span className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {planoAtual.semestral.valorParcela}
                    </span>
                  </div>
                  <span className="mt-1 text-[11px] text-stone-400 block whitespace-nowrap text-center">
                    {planoAtual.semestral.aVista}
                  </span>
                </div>

                <ul className="mt-4 space-y-2 text-[11px] sm:text-[11.5px] text-stone-300">
                  {planoAtual.semestral.beneficios.map((ben, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400 mt-0.5" />
                      <span>{ben}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <a
                  href={planoAtual.semestral.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 hover:bg-orange-500 hover:text-white py-2.5 px-3 text-xs font-bold text-orange-300 transition-all shadow-sm active:scale-[0.98]"
                >
                  <span>Assinar Semestral</span>
                </a>
              </div>
            </div>
          </div>

          {/* Opção Adicional: Plano Mensal */}
          <div className="mt-10 sm:mt-12 text-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 rounded-2xl bg-white/[0.03] border border-white/10 px-5 py-3 text-xs text-stone-300 backdrop-blur-sm shadow-md">
              <span className="text-stone-400">Prefere pagar mês a mês sem fidelidade?</span>
              <span className="font-bold text-white">
                Plano Mensal ({planoAtual.nome}): <span className="text-orange-400 font-extrabold">{planoAtual.mensal.valor}/mês</span>
              </span>
              <a
                href={planoAtual.mensal.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-orange-400 hover:text-orange-300 underline underline-offset-4 ml-1"
              >
                <span>Assinar Mensal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. QUEM É NATÁLIA RODOLFO (PROVA DE AUTORIDADE) */}
      <section className="relative z-10 py-16 sm:py-24 border-t border-white/[0.08] bg-[#08090c]">
        <div className="mx-auto max-w-4xl px-4">
          <div className="rounded-3xl border border-white/10 bg-[#121317] p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center gap-6 sm:gap-8">
            <div className="relative flex h-36 w-36 sm:h-44 sm:w-44 shrink-0 items-center justify-center rounded-full p-1 bg-gradient-to-tr from-amber-400 via-orange-500 to-emerald-500 shadow-xl">
              <picture className="h-full w-full">
                <source srcSet="/natalia-mentora.webp" type="image/webp" />
                <img
                  src="/natalia-mentora.jpg"
                  alt="Natália Rodolfo"
                  width={176}
                  height={176}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full rounded-full object-cover object-[center_20%]"
                />
              </picture>
            </div>

            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 text-xs font-semibold text-emerald-400 mb-2">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Estrategista Financeira &amp; Educadora</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Natália Rodolfo
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-stone-300 leading-relaxed">
                Especialista em organização e inteligência financeira para pessoas físicas e pequenas empresas. Ao longo de centenas de mentorias, identificou que o que impede as pessoas de prosperar não é o esforço, mas a falta de ferramentas práticas que caibam no dia a dia. O Organiz.AI é a materialização do seu método de liberdade financeira.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. GARANTIA BLINDADA DE 7 DIAS (RISCO ZERO) */}
      <section className="relative z-10 py-12 border-t border-white/[0.08] bg-[#060709]">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mb-4 shadow-lg shadow-emerald-950/40">
            <Shield className="h-8 w-8" />
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
            Garantia Incondicional de 7 Dias
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl mx-auto">
            Você tem 7 dias para acessar o Organiz.AI, cadastrar suas contas, testar a separação PF e PJ e sentir a transformação. Se por qualquer motivo não se adaptar, devolvemos 100% do valor pago.
          </p>
        </div>
      </section>

      {/* 9. FAQ INTERATIVO */}
      <section id="faq" className="relative z-10 py-16 sm:py-24 border-t border-white/[0.08] bg-[#08090c]">
        <div className="mx-auto max-w-3xl px-4">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
              Tire Suas Dúvidas
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-white">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                p: "Como eu recebo meu acesso após assinar?",
                r: "O acesso é imediato! Assim que seu plano for confirmado, você receberá a confirmação e poderá fazer login na tela inicial com seu e-mail e senha cadastrados no Organiz.AI.",
              },
              {
                p: "Funciona no celular (iPhone e Android) ou precisa de computador?",
                r: "Funciona perfeitamente nos dois! O Organiz.AI é uma plataforma moderna e PWA. Você pode instalá-lo diretamente na tela de início do seu smartphone com 1 toque, exatamente como um aplicativo nativo.",
              },
              {
                p: "Consigo usar para minhas contas de casa e da minha empresa no mesmo plano?",
                r: "Sim! Essa é uma das maiores vantagens do Organiz.AI. Você tem um alternador inteligente no topo do painel que separa instantaneamente o Controle Pessoal do Controle Empresarial (PJ), sem custos adicionais.",
              },
              {
                p: "Por que o Plano Anual é o mais vantajoso?",
                r: "No Plano Anual você garante a menor parcela (12x de R$ 29,16, que custa menos de R$ 1,00 por dia) e tem tempo suficiente para consolidar o método, criar sua reserva de emergência e colher os frutos da organização o ano inteiro.",
              },
              {
                p: "Meus dados financeiros estão seguros?",
                r: "Sim. Seus dados são protegidos por criptografia de ponta a ponta com infraestrutura segura em nuvem (Supabase / SSL), garantindo total privacidade e confidencialidade.",
              },
              {
                p: "Como entro na plataforma se eu já for assinante?",
                r: "Basta clicar no botão 'Já sou assinante · Entrar' localizado no topo desta página para acessar seu Dashboard completo.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/[0.08] bg-[#121317] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4.5 text-left text-xs sm:text-sm font-semibold text-stone-200 hover:text-white cursor-pointer"
                >
                  <span>{faq.p}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-stone-400 transition-transform duration-200 shrink-0 ml-3 ${
                      faqAberto === idx ? "rotate-180 text-orange-400" : ""
                    }`}
                  />
                </button>
                {faqAberto === idx && (
                  <div className="px-4.5 pb-4 pt-1 text-xs text-stone-400 leading-relaxed border-t border-white/[0.04]">
                    {faq.r}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CTA FINAL */}
      <section className="relative z-10 py-16 border-t border-white/[0.08] bg-gradient-to-b from-[#111216] to-[#060709] text-center">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white">
            Pronto para nunca mais se preocupar
            <br />
            com o dinheiro no fim do mês?
          </h2>
          <p className="mt-3 text-xs sm:text-base text-stone-300 max-w-xl mx-auto leading-relaxed">
            Dê o primeiro passo para a sua tranquilidade financeira. Escolha o seu plano e comece agora mesmo.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#planos"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#F97316] to-amber-500 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-orange-950/60 hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <span>Garantir Meu Acesso Agora</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-sm font-semibold text-stone-200 hover:bg-white/[0.08] hover:text-white transition-all"
            >
              <span>Já Tenho Cadastro · Entrar</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 11. FOOTER FINTECH */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-[#040507] py-8 text-center text-xs text-stone-500">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Organiz.AI" className="h-6 w-6 object-contain" />
            <span className="font-bold text-stone-300">Organiz.AI</span>
            <span>· Natália Rodolfo</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-stone-400">
            <a href="mailto:suporte@nataliarodolfo.com.br" className="hover:text-white transition-colors">
              Suporte por E-mail
            </a>
            <span>•</span>
            <a
              href={`https://wa.me/${wppNumber}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              WhatsApp Oficial
            </a>
            <span>•</span>
            <Link to="/login" className="text-[#F97316] font-semibold hover:underline">
              Área de Membros
            </Link>
          </div>

          <p className="text-[11px] text-stone-600">
            &copy; {new Date().getFullYear()} Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
