import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface LoginSearch {
  redirect?: string;
}

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: (search.redirect as string) || "/app",
    };
  },
  head: () => ({
    meta: [
      { title: "Entrar — OrganizAI" },
      {
        name: "description",
        content: "Acesse sua plataforma financeira inteligente OrganizAI.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { redirect } = useSearch({ from: "/login" });
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();

  const [modo, setModo] = useState<"login" | "cadastro" | "recuperar">("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [recuperacaoEnviada, setRecuperacaoEnviada] = useState(false);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  // Se já estiver logado, redirecionar automaticamente para a página solicitada ou /app
  useEffect(() => {
    if (!authLoading && session) {
      navigate({ to: redirect || "/app" });
    }
  }, [session, authLoading, navigate, redirect]);

  const alternarModo = (novoModo: "login" | "cadastro" | "recuperar") => {
    setModo(novoModo);
    setMensagemErro(null);
    setMensagemSucesso(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagemErro(null);
    setMensagemSucesso(null);

    if (!email.trim() || !senha) {
      const msg = "Preencha todos os campos.";
      setMensagemErro(msg);
      toast.error(msg);
      return;
    }

    setCarregando(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: senha,
      });

      if (error) {
        let msg = error.message;
        if (error.message.includes("Invalid login credentials")) {
          msg = "E-mail ou senha incorretos. Verifique e tente novamente.";
        } else if (error.message.includes("Email not confirmed")) {
          msg = "Por favor, confirme seu e-mail antes de fazer login.";
        }
        setMensagemErro(msg);
        toast.error(msg);
        return;
      }

      if (data.session) {
        toast.success("Bem-vindo de volta ao OrganizAI!");
        navigate({ to: redirect || "/app" });
      }
    } catch (err: any) {
      const msg = "Erro ao conectar ao servidor. Tente novamente.";
      setMensagemErro(msg);
      toast.error(msg);
    } finally {
      setCarregando(false);
    }
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagemErro(null);
    setMensagemSucesso(null);

    if (!nome.trim() || !email.trim() || !senha) {
      const msg = "Preencha todos os campos.";
      setMensagemErro(msg);
      toast.error(msg);
      return;
    }

    if (senha.length < 6) {
      const msg = "A senha deve ter pelo menos 6 caracteres.";
      setMensagemErro(msg);
      toast.error(msg);
      return;
    }

    if (senha !== confirmarSenha) {
      const msg = "As senhas não conferem. Digite a mesma senha nos dois campos.";
      setMensagemErro(msg);
      toast.error(msg);
      return;
    }

    setCarregando(true);
    try {
      // Chama RPC que cadastra diretamente sem esgotar cota de envio de email do Supabase
      const { data: rpcResult, error: rpcError } = await supabase.rpc(
        "create_student_account",
        {
          p_email: email.trim(),
          p_password: senha,
          p_full_name: nome.trim(),
        }
      );

      if (rpcError) {
        console.error("Erro ao chamar create_student_account:", rpcError);
        const msg = rpcError.message || "Erro ao registrar conta no servidor.";
        setMensagemErro(msg);
        toast.error(msg);
        return;
      }

      const res = rpcResult as {
        success: boolean;
        error?: string;
        user_id?: string;
        status?: string;
      };

      if (!res.success) {
        const msg = res.error || "Não foi possível criar a conta.";
        setMensagemErro(msg);
        toast.error(msg);
        if (res.error?.includes("já está cadastrado")) {
          setTimeout(() => alternarModo("login"), 2000);
        }
        return;
      }

      // Realiza login automático imediato com a senha fornecida
      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: senha,
        });

      if (loginError) {
        console.error("Erro no login automático:", loginError);
        setMensagemSucesso(
          "Conta criada com sucesso! Por favor, faça login com sua senha."
        );
        toast.success("Conta criada! Por favor, faça login.");
        alternarModo("login");
        return;
      }

      if (loginData?.session) {
        toast.success(
          "Conta criada! Seu acesso foi enviado para análise e aprovação."
        );
        navigate({ to: redirect || "/app" });
      }
    } catch (err: any) {
      console.error("Erro inesperado no cadastro:", err);
      const msg = "Erro ao conectar ao servidor. Tente novamente.";
      setMensagemErro(msg);
      toast.error(msg);
    } finally {
      setCarregando(false);
    }
  };

  const handleRecuperarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Informe seu e-mail.");
      return;
    }

    setCarregando(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setRecuperacaoEnviada(true);
      toast.success("Instruções de recuperação enviadas para o seu e-mail!");
    } catch (err: any) {
      toast.error("Erro ao enviar e-mail de recuperação.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col justify-between selection:bg-[#F97316]/30">
      {/* Background glow ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-gradient-to-b from-[#F97316]/15 via-purple-600/5 to-transparent blur-[140px] rounded-full" />
        <div className="absolute -bottom-40 right-10 w-[450px] h-[450px] bg-[#F97316]/10 blur-[130px] rounded-full" />
      </div>

      {/* Header com Logo */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <img
              src="/logo.png"
              alt="OrganizAI"
              className="h-10 w-10 object-contain drop-shadow-[0_2px_12px_rgba(249,115,22,0.35)]"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-lg font-bold tracking-tight text-white">
              Organiz<span className="text-[#F97316] font-black">AI</span>
            </span>
            <span className="text-[0.68rem] text-stone-400">
              Finanças Descomplicadas
            </span>
          </div>
        </a>

        <a
          href="/"
          className="text-xs text-stone-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          Voltar ao site
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </header>

      {/* Conteúdo Central */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[440px]">
          {/* Card Principal */}
          <div className="rounded-3xl border border-white/[0.08] bg-[#121214]/90 backdrop-blur-xl p-7 sm:p-9 shadow-2xl shadow-black/80">
            {/* Ícone topo do card */}
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2c170d] to-[#1a1311] border border-[#F97316]/30 shadow-lg shadow-orange-950/40">
              <Sparkles className="h-7 w-7 text-[#F97316]" />
            </div>

            {/* Cabeçalho do Card */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-white">
                {modo === "login" && "Acesse sua conta"}
                {modo === "cadastro" && "Crie sua conta"}
                {modo === "recuperar" && "Recuperar senha"}
              </h1>
              <p className="mt-1.5 text-xs text-stone-400">
                {modo === "login" &&
                  "Entre com seu e-mail e senha para acessar o OrganizAI."}
                {modo === "cadastro" &&
                  "Cadastre-se para gerenciar suas finanças com inteligência."}
                {modo === "recuperar" &&
                  "Digite seu e-mail para receber as instruções de recuperação."}
              </p>
            </div>

            {/* Alternador Entrar / Cadastrar (se não estiver em recuperação) */}
            {modo !== "recuperar" && (
              <div className="grid grid-cols-2 rounded-2xl bg-[#1a1a1c] p-1 mb-6 border border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => alternarModo("login")}
                  className={`rounded-xl py-2 text-xs font-semibold transition-all ${
                    modo === "login"
                      ? "bg-[#F97316] text-white shadow-md shadow-orange-950/40"
                      : "text-stone-400 hover:text-white"
                  }`}
                >
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => alternarModo("cadastro")}
                  className={`rounded-xl py-2 text-xs font-semibold transition-all ${
                    modo === "cadastro"
                      ? "bg-[#F97316] text-white shadow-md shadow-orange-950/40"
                      : "text-stone-400 hover:text-white"
                  }`}
                >
                  Criar conta
                </button>
              </div>
            )}

            {/* Mensagens de Alerta Inline */}
            {mensagemErro && (
              <div className="flex items-start gap-2.5 p-3.5 mb-5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs shadow-lg shadow-rose-950/20 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span className="leading-relaxed font-medium">{mensagemErro}</span>
              </div>
            )}

            {mensagemSucesso && (
              <div className="flex items-start gap-2.5 p-3.5 mb-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs shadow-lg shadow-emerald-950/20 animate-in fade-in slide-in-from-top-1 duration-200">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span className="leading-relaxed font-medium">{mensagemSucesso}</span>
              </div>
            )}

            {/* Formulário de Login */}
            {modo === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      required
                      className="w-full rounded-xl bg-[#19191d] border border-white/10 pl-10 pr-4 py-2.5 text-xs text-white placeholder-stone-500 outline-none focus:border-[#F97316] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-stone-300">
                      Senha
                    </label>
                    <button
                      type="button"
                      onClick={() => alternarModo("recuperar")}
                      className="text-[11px] text-[#F97316] hover:underline"
                    >
                      Esqueci a senha
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                    <input
                      type={mostrarSenha ? "text" : "password"}
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full rounded-xl bg-[#19191d] border border-white/10 pl-10 pr-10 py-2.5 text-xs text-white placeholder-stone-500 outline-none focus:border-[#F97316] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                    >
                      {mostrarSenha ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={carregando}
                  className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F97316] to-[#ea580c] py-3 text-xs font-bold text-white shadow-lg shadow-orange-950/40 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {carregando ? "Entrando..." : "Entrar no OrganizAI"}
                  {!carregando && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>
            )}

            {/* Formulário de Cadastro */}
            {modo === "cadastro" && (
              <form onSubmit={handleCadastro} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Nome completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Seu nome"
                      required
                      className="w-full rounded-xl bg-[#19191d] border border-white/10 pl-10 pr-4 py-2.5 text-xs text-white placeholder-stone-500 outline-none focus:border-[#F97316] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      required
                      className="w-full rounded-xl bg-[#19191d] border border-white/10 pl-10 pr-4 py-2.5 text-xs text-white placeholder-stone-500 outline-none focus:border-[#F97316] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Criar Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                    <input
                      type={mostrarSenha ? "text" : "password"}
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      placeholder="Mínimo de 6 caracteres"
                      required
                      minLength={6}
                      className="w-full rounded-xl bg-[#19191d] border border-white/10 pl-10 pr-10 py-2.5 text-xs text-white placeholder-stone-500 outline-none focus:border-[#F97316] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                    >
                      {mostrarSenha ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                    <input
                      type={mostrarSenha ? "text" : "password"}
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      placeholder="Repita sua senha"
                      required
                      minLength={6}
                      className="w-full rounded-xl bg-[#19191d] border border-white/10 pl-10 pr-4 py-2.5 text-xs text-white placeholder-stone-500 outline-none focus:border-[#F97316] transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={carregando}
                  className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F97316] to-[#ea580c] py-3 text-xs font-bold text-white shadow-lg shadow-orange-950/40 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {carregando ? "Criando conta..." : "Criar Minha Conta"}
                  {!carregando && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>
            )}

            {/* Formulário de Recuperação de Senha */}
            {modo === "recuperar" && (
              <div>
                {recuperacaoEnviada ? (
                  <div className="text-center py-4 space-y-3">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-bold text-white">E-mail Enviado!</h3>
                    <p className="text-xs text-stone-400">
                      Enviamos um link para redefinir sua senha no e-mail informado.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setRecuperacaoEnviada(false);
                        alternarModo("login");
                      }}
                      className="mt-3 inline-flex items-center justify-center rounded-xl bg-white/[0.08] px-4 py-2 text-xs font-semibold text-white hover:bg-white/[0.14] transition-colors"
                    >
                      Voltar ao Login
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRecuperarSenha} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1.5">
                        E-mail cadastrado
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="seu.email@exemplo.com"
                          required
                          className="w-full rounded-xl bg-[#19191d] border border-white/10 pl-10 pr-4 py-2.5 text-xs text-white placeholder-stone-500 outline-none focus:border-[#F97316] transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={carregando}
                      className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F97316] to-[#ea580c] py-3 text-xs font-bold text-white shadow-lg shadow-orange-950/40 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {carregando ? "Enviando..." : "Enviar link de recuperação"}
                    </button>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => alternarModo("login")}
                        className="text-xs text-stone-400 hover:text-white transition-colors"
                      >
                        ← Voltar para o Login
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Rodapé de Segurança */}
            <div className="mt-8 pt-5 border-t border-white/[0.06] flex items-center justify-center gap-2 text-[11px] text-stone-500">
              <ShieldCheck className="h-3.5 w-3.5 text-[#F97316]" />
              <span>Acesso seguro com criptografia de ponta a ponta</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer minimalista */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-stone-600">
        © {new Date().getFullYear()} OrganizAI · Natalia Rodolfo · Todos os direitos reservados.
      </footer>
    </div>
  );
}
