import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Panel } from "@/components/app/kit";
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  LogOut,
  KeyRound,
  Eye,
  EyeOff,
  Users,
  Upload,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  ShieldAlert,
  Trophy,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { PATENTES, EscudoPatente, getPatentePorNivel } from "@/lib/patentes";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState, useEffect } from "react";


export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil do Usuário — OrganizAI" },
      {
        name: "description",
        content:
          "Gerencie dados da sua conta, segurança, compartilhamento e importação de dados.",
      },
    ],
  }),
  component: Perfil,
});

function Perfil() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  // Estados de alteração de senha
  const [modalSenhaAberto, setModalSenhaAberto] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [alterandoSenha, setAlterandoSenha] = useState(false);

  // Se vier com ?acao=alterar-senha na URL, abre automaticamente o formulário
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("acao") === "alterar-senha") {
        setModalSenhaAberto(true);
      }
    }
  }, []);

  const nomeCompleto =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Usuário";

  const iniciais = (
    user?.user_metadata?.full_name?.[0] ||
    user?.email?.[0] ||
    "U"
  ).toUpperCase();

  const dataMembro = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      })
    : "2026";

  const nivelAtual = profile?.patente_nivel || 0;
  const patenteAtual = getPatentePorNivel(nivelAtual);

  // Acordão de Patentes: por padrão abre a próxima meta
  const nivelProxima = nivelAtual + 1;
  const [patenteAberta, setPatenteAberta] = useState<number | null>(nivelProxima);
  const togglePatente = (nivel: number) =>
    setPatenteAberta((prev) => (prev === nivel ? null : nivel));

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Sessão encerrada com sucesso.");
      navigate({ to: "/login" });
    } catch {
      toast.error("Erro ao encerrar sessão.");
    }
  };

  const handleAlterarSenha = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!senhaAtual.trim()) {
      toast.error("Por favor, informe a sua senha atual.");
      return;
    }

    if (!novaSenha || novaSenha.length < 6) {
      toast.error("A nova senha deve possuir pelo menos 6 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      toast.error("A confirmação da senha não coincide com a nova senha digitada.");
      return;
    }

    if (senhaAtual === novaSenha) {
      toast.error("A nova senha precisa ser diferente da senha atual.");
      return;
    }

    if (!user?.email) {
      toast.error("Não foi possível identificar o e-mail da sua conta.");
      return;
    }

    setAlterandoSenha(true);

    try {
      // 1. Validar se a senha atual está correta tentando autenticar no Supabase
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: senhaAtual,
      });

      if (signInError) {
        toast.error("A senha atual informada está incorreta. Verifique e tente novamente.");
        setAlterandoSenha(false);
        return;
      }

      // 2. Atualizar para a nova senha no banco de dados do Supabase
      const { error: updateError } = await supabase.auth.updateUser({
        password: novaSenha,
      });

      if (updateError) {
        toast.error(`Erro ao atualizar senha no Supabase: ${updateError.message}`);
        setAlterandoSenha(false);
        return;
      }

      toast.success("Senha alterada com sucesso no banco de dados do Supabase!");
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
      setModalSenhaAberto(false);
    } catch (err: any) {
      toast.error(err?.message || "Ocorreu um erro ao tentar alterar a senha.");
    } finally {
      setAlterandoSenha(false);
    }
  };

  return (
    <AppShell
      titulo="Seção do Usuário"
      descricao="Gerencie dados pessoais, segurança, compartilhamento de conta e importação."
    >
      <div className="mx-auto max-w-3xl space-y-6">
        {/* 1. CARD PRINCIPAL DO USUÁRIO */}
        <Panel className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500/25 to-amber-500/15 border border-orange-500/30 font-display text-2xl sm:text-3xl font-bold text-orange-400 shadow-lg shadow-orange-950/40">
                {iniciais}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                    {nomeCompleto}
                  </h3>
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                    Free
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {user?.email} • Membro desde {dataMembro}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 self-start sm:self-auto rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair da Conta</span>
            </button>
          </div>

          {/* Dados Pessoais da Conta */}
          <div className="mt-8 divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08] bg-surface/30">
            <div className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Nome Completo</span>
              </div>
              <span className="text-xs font-semibold text-foreground">{nomeCompleto}</span>
            </div>

            <div className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">E-mail</span>
              </div>
              <span className="text-xs font-semibold text-foreground">{user?.email || "—"}</span>
            </div>

            <div className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Telefone</span>
              </div>
              <span className="text-xs font-semibold text-foreground">
                {profile?.phone || (user?.user_metadata as any)?.phone || "—"}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Conta criada em</span>
              </div>
              <span className="text-xs font-semibold text-foreground">{dataMembro}</span>
            </div>

            <div className="flex items-center justify-between p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Status do Plano</span>
              </div>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
                Plano Free Ativo
              </span>
            </div>
          </div>
        </Panel>

        {/* 2. SEÇÃO METAS & ESCUDOS DA MENTORIA */}
        <Panel id="metas" className="p-6 sm:p-8 relative overflow-hidden">
          {/* Header da Seção */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-md">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    Metas & Patentes da Mentoria
                  </h3>
                  <span className="rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    Evolução
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-1 max-w-xl leading-relaxed">
                  Seu plano de evolução financeira. As metas e patentes são avaliadas e ativadas pelo administrador conforme seu desempenho. Escudos coloridos representam conquistas já batidas.
                </p>
              </div>
            </div>

            {/* Badge da Patente Atual */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 flex items-center gap-3 self-start sm:self-auto shrink-0">
              <div className="shrink-0">
                <EscudoPatente
                  nivel={nivelAtual > 0 ? nivelAtual : 1}
                  bloqueado={nivelAtual === 0}
                  tamanho="sm"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">
                  Sua Patente:
                </span>
                <span className="text-xs font-bold text-white block">
                  {patenteAtual ? patenteAtual.titulo : "Iniciante (Nível 0)"}
                </span>
              </div>
            </div>
          </div>

          {/* Acordão de Níveis (sanfonado) */}
          <div className="mt-6 divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08] overflow-hidden">
            {PATENTES.map((patente) => {
              const alcancada = (profile?.patente_nivel || 0) >= patente.nivel;
              const isProxima = (profile?.patente_nivel || 0) + 1 === patente.nivel;
              const isOpen = patenteAberta === patente.nivel;

              return (
                <div key={patente.id}>
                  {/* Cabeçalho clicavel do acordão */}
                  <button
                    type="button"
                    onClick={() => togglePatente(patente.nivel)}
                    className={cn(
                      "w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors",
                      isOpen ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 transition-transform hover:scale-105 duration-200">
                        <EscudoPatente
                          nivel={patente.nivel}
                          bloqueado={!alcancada}
                          tamanho="sm"
                        />
                      </div>

                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-xs text-stone-500 font-semibold">Nível {patente.nivel}</span>
                        <span className="text-xs text-stone-600">•</span>
                        <span className="text-sm font-bold text-white">{patente.titulo}</span>

                        {alcancada ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            ALCANÇADA
                          </span>
                        ) : isProxima ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                            <Sparkles className="h-2.5 w-2.5" />
                            PRÓXIMA META
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] border border-white/10 px-2 py-0.5 text-[10px] font-medium text-stone-500">
                            <Lock className="h-2.5 w-2.5" />
                            BLOQUEADA
                          </span>
                        )}
                      </div>
                    </div>

                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 text-stone-400 transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {/* Conteúdo expandível */}
                  {isOpen && (
                    <div
                      className={cn(
                        "px-5 pb-5 pt-1 border-t border-white/[0.06] animate-in fade-in slide-in-from-top-1 duration-200",
                        alcancada
                          ? `bg-gradient-to-r ${patente.corGradiente}`
                          : isProxima
                          ? "bg-white/[0.01]"
                          : "bg-transparent opacity-70"
                      )}
                    >
                      <p className="text-xs text-stone-300 mt-3 max-w-xl leading-relaxed">
                        {patente.descricao}
                      </p>

                      {/* Critério da Meta */}
                      <div className="mt-3 rounded-xl bg-black/30 border border-white/[0.06] p-3 text-xs">
                        <span className="font-semibold text-stone-300 block mb-0.5">
                          Meta para esta patente:
                        </span>
                        <span className="text-stone-400">{patente.criterio}</span>
                      </div>

                      {/* Conquistas da Patente */}
                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        {patente.conquistas.map((conquista) => (
                          <span
                            key={conquista.id}
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium border",
                              alcancada
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                                : "bg-white/[0.03] border-white/10 text-stone-500"
                            )}
                          >
                            {alcancada ? (
                              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <Lock className="h-3 w-3 text-stone-500" />
                            )}
                            <span>{conquista.titulo}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Panel>

        {/* 3. CARD DE SEGURANÇA & ALTERAÇÃO DE SENHA */}
        <Panel className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  Segurança & Alteração de Senha
                </h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-md leading-relaxed">
                  Altere sua senha de acesso sempre que desejar. Para sua segurança, confirme sua senha atual antes de cadastrar uma nova.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setModalSenhaAberto(!modalSenhaAberto)}
              className="group inline-flex items-center justify-center gap-2 self-start sm:self-auto rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-orange-950/40 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <Lock className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>{modalSenhaAberto ? "Fechar Formulário" : "Alterar Senha"}</span>
            </button>
          </div>

          {/* FORMULÁRIO DE ALTERAÇÃO DE SENHA */}
          {modalSenhaAberto && (
            <form
              onSubmit={handleAlterarSenha}
              className="mt-6 rounded-2xl border border-amber-500/25 bg-amber-500/[0.03] p-5 sm:p-6 space-y-4 animate-in fade-in duration-200"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                <ShieldAlert className="h-4 w-4" />
                <span>Atualização de Credenciais no Supabase</span>
              </div>

              {/* 1. Senha Atual */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Senha Atual <span className="text-orange-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={mostrarSenhaAtual ? "text" : "password"}
                    required
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                    placeholder="Digite sua senha atual"
                    className="w-full rounded-xl border border-white/10 bg-[#111113] px-4 py-2.5 pr-10 text-xs sm:text-sm text-white placeholder:text-stone-500 outline-none focus:border-amber-500/80 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white transition-colors"
                    title={mostrarSenhaAtual ? "Ocultar senha" : "Ver senha"}
                  >
                    {mostrarSenhaAtual ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-stone-400">
                  Necessário para validar que você é o titular desta conta.
                </p>
              </div>

              {/* 2. Nova Senha */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Nova Senha <span className="text-orange-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={mostrarNovaSenha ? "text" : "password"}
                    required
                    minLength={6}
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    placeholder="Digite a nova senha (mínimo 6 caracteres)"
                    className="w-full rounded-xl border border-white/10 bg-[#111113] px-4 py-2.5 pr-10 text-xs sm:text-sm text-white placeholder:text-stone-500 outline-none focus:border-amber-500/80 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white transition-colors"
                    title={mostrarNovaSenha ? "Ocultar senha" : "Ver senha"}
                  >
                    {mostrarNovaSenha ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* 3. Confirmar Nova Senha */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Confirmar Nova Senha <span className="text-orange-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={mostrarConfirmarSenha ? "text" : "password"}
                    required
                    minLength={6}
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    placeholder="Digite novamente a nova senha"
                    className="w-full rounded-xl border border-white/10 bg-[#111113] px-4 py-2.5 pr-10 text-xs sm:text-sm text-white placeholder:text-stone-500 outline-none focus:border-amber-500/80 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white transition-colors"
                    title={mostrarConfirmarSenha ? "Ocultar senha" : "Ver senha"}
                  >
                    {mostrarConfirmarSenha ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {novaSenha && confirmarSenha && novaSenha !== confirmarSenha && (
                  <p className="mt-1 text-[11px] text-rose-400 font-medium">
                    As senhas digitadas não coincidem.
                  </p>
                )}
                {novaSenha && confirmarSenha && novaSenha === confirmarSenha && (
                  <p className="mt-1 text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    As senhas coincidem perfeitamente.
                  </p>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={alterandoSenha || !senhaAtual || !novaSenha || novaSenha !== confirmarSenha}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-950/40 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>
                    {alterandoSenha ? "Verificando e alterando..." : "Confirmar e Salvar Nova Senha"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalSenhaAberto(false);
                    setSenhaAtual("");
                    setNovaSenha("");
                    setConfirmarSenha("");
                  }}
                  className="w-full sm:w-auto rounded-xl border border-white/10 hover:bg-white/5 px-4 py-2.5 text-xs font-semibold text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </Panel>

        {/* 3. CARD DE COMPARTILHAMENTO DE CONTA */}
        <Panel className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    Compartilhamento de Conta
                  </h3>
                  <span className="rounded-full bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 text-[10px] font-bold text-purple-300 uppercase tracking-wider">
                    Colaboração
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 max-w-md leading-relaxed">
                  Convide cônjuge, parceiro ou sócio para acompanhar ou lançar transações juntos. Você controla permissões de acesso total ou somente visualização.
                </p>
              </div>
            </div>

            <Link
              to="/segundo-usuario"
              className="group inline-flex items-center justify-center gap-2 self-start sm:self-auto rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-950/40 hover:brightness-110 active:scale-95 transition-all shrink-0"
            >
              <span>Gerenciar Compartilhamento</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Panel>

        {/* 4. CARD DE IMPORTAR DADOS */}
        <Panel className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    Importar Dados Financeiros
                  </h3>
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                    Automação
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 max-w-md leading-relaxed">
                  Importe extratos bancários nos formatos OFX, CSV ou backups de planilhas para preencher suas movimentações financeiras no OrganizAI com facilidade.
                </p>
              </div>
            </div>

            <Link
              to="/importar-dados"
              className="group inline-flex items-center justify-center gap-2 self-start sm:self-auto rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-950/40 hover:brightness-110 active:scale-95 transition-all shrink-0"
            >
              <span>Acessar Importação</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
