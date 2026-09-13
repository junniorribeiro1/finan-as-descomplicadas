import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import {
  UserPlus,
  ShieldCheck,
  X,
  Mail,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  Shield,
  Eye,
  Check,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/segundo-usuario")({
  head: () => ({
    meta: [
      { title: "Compartilhamento — OrganizAI" },
      {
        name: "description",
        content: "Compartilhe suas finanças com quem organiza junto. Gestão financeira compartilhada.",
      },
    ],
  }),
  component: SegundoUsuario,
});

interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: "Titular" | "Acesso total" | "Visualizador";
  status: "ativo" | "pendente";
  isOwner?: boolean;
}

function SegundoUsuario() {
  const [modalAberto, setModalAberto] = useState(false);
  const [emailConvite, setEmailConvite] = useState("");
  const [nomeConvite, setNomeConvite] = useState("");
  const [papelConvite, setPapelConvite] = useState<"Acesso total" | "Visualizador">("Acesso total");

  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: "owner-1",
      nome: "Você",
      email: "voce@exemplo.com",
      papel: "Titular",
      status: "ativo",
      isOwner: true,
    },
  ]);

  const handleEnviarConvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailConvite.trim()) {
      toast.error("Por favor, insira um e-mail válido.");
      return;
    }

    if (usuarios.some((u) => u.email.toLowerCase() === emailConvite.trim().toLowerCase())) {
      toast.error("Este e-mail já possui acesso ou convite pendente.");
      return;
    }

    const novoUsuario: Usuario = {
      id: "user-" + Date.now(),
      nome: nomeConvite.trim() || emailConvite.split("@")[0] || "Segundo Usuário",
      email: emailConvite.trim(),
      papel: papelConvite,
      status: "pendente",
      isOwner: false,
    };

    setUsuarios((prev) => [...prev, novoUsuario]);
    setEmailConvite("");
    setNomeConvite("");
    setModalAberto(false);
    toast.success(`Convite enviado com sucesso para ${novoUsuario.email}!`);
  };

  const handleRemoverUsuario = (id: string, email: string) => {
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
    toast.info(`Acesso de ${email} removido.`);
  };

  const handleReenviarConvite = (email: string) => {
    toast.success(`Convite reenviado para ${email}!`);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Header Superior */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Compartilhamento
            </h1>
            <p className="mt-1 text-xs text-neutral-400 sm:text-sm">
              Compartilhe suas finanças com quem organiza junto.
            </p>
          </div>

          <button
            onClick={() => setModalAberto(true)}
            className="group inline-flex items-center justify-center gap-2 self-start rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-xs font-semibold text-white shadow-[0_4px_16px_rgba(249,115,22,0.3)] transition-all hover:from-orange-600 hover:to-amber-600 hover:shadow-[0_6px_22px_rgba(249,115,22,0.45)] active:scale-[0.98] sm:self-auto"
          >
            <UserPlus className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span>Convidar</span>
          </button>
        </div>

        {/* Card Banner Principal */}
        <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#161618] p-6 shadow-xl sm:rounded-3xl sm:p-8">
          <div className="relative z-10 max-w-lg">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9333ea] sm:text-xs">
              Colabore
            </span>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-[1.7rem] lg:leading-tight">
              Traga alguém de confiança para organizar junto
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-neutral-400 sm:text-sm">
              Compartilhe a gestão financeira com seu cônjuge, sócio ou gerente. Você controla o nível de acesso.
            </p>

            <div className="mt-6">
              <button
                onClick={() => setModalAberto(true)}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-xs font-semibold text-white shadow-[0_4px_20px_rgba(249,115,22,0.35)] transition-all hover:from-orange-600 hover:to-amber-600 hover:shadow-[0_6px_25px_rgba(249,115,22,0.5)] active:scale-[0.98] sm:text-sm"
              >
                <UserPlus className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>Convidar para compartilhar</span>
              </button>
            </div>
          </div>

          {/* Arte 3D dos Avatares */}
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 hidden h-full w-[45%] select-none sm:block">
            <img
              src="/icons/kpi/segundo-usuario-banner-art.png"
              alt="Ilustração de Compartilhamento"
              className="h-full w-full object-cover object-right"
            />
          </div>
        </div>

        {/* Card Usuários com acesso */}
        <div className="mt-6 rounded-2xl border border-white/[0.08] bg-[#161618] p-6 shadow-xl sm:rounded-3xl sm:p-7">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <h3 className="text-sm font-bold text-white sm:text-base">
              Usuários com acesso
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 sm:text-xs">
              {usuarios.length} {usuarios.length === 1 ? "PESSOA" : "PESSOAS"}
            </span>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {usuarios.map((user) => {
              const inicial = user.nome.charAt(0).toUpperCase() || "U";
              return (
                <div
                  key={user.id}
                  className="group flex flex-col gap-3 py-4 first:pt-4 last:pb-1 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Avatar redondo */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-md ${
                        user.isOwner
                          ? "bg-gradient-to-tr from-orange-500 to-amber-400 shadow-orange-500/20"
                          : "bg-gradient-to-tr from-purple-600 to-indigo-500 shadow-purple-500/20"
                      }`}
                    >
                      {inicial}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">
                          {user.nome}
                        </span>
                        {user.status === "ativo" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                            ativo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                            convite pendente
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {/* Badge do Papel */}
                    {user.isOwner ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-500">
                        <Shield className="h-3.5 w-3.5" />
                        Titular
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-400">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        {user.papel}
                      </span>
                    )}

                    {/* Ações para convidados */}
                    {!user.isOwner && (
                      <div className="flex items-center gap-1 opacity-90 transition-opacity group-hover:opacity-100">
                        {user.status === "pendente" && (
                          <button
                            onClick={() => handleReenviarConvite(user.email)}
                            title="Reenviar convite"
                            className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-white/[0.08] hover:text-white"
                          >
                            <Mail className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoverUsuario(user.id, user.email)}
                          title="Remover acesso"
                          className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal de Convidar Segundo Usuário */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#161618] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
                  <UserPlus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Convidar para Compartilhar
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Acesso compartilhado às finanças
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalAberto(false)}
                className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleEnviarConvite} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300">
                  Nome ou Apelido (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Maria ou João"
                  value={nomeConvite}
                  onChange={(e) => setNomeConvite(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300">
                  E-mail do convidado <span className="text-orange-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="convidado@email.com"
                  value={emailConvite}
                  onChange={(e) => setEmailConvite(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2">
                  Nível de Acesso
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPapelConvite("Acesso total")}
                    className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                      papelConvite === "Acesso total"
                        ? "border-orange-500/60 bg-orange-500/10 text-white shadow-sm"
                        : "border-white/10 bg-white/[0.02] text-neutral-400 hover:border-white/20"
                    }`}
                  >
                    <span className="text-xs font-bold text-white">Acesso Total</span>
                    <span className="text-[10px] text-neutral-400 mt-1 leading-tight">
                      Pode visualizar e lançar transações
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPapelConvite("Visualizador")}
                    className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                      papelConvite === "Visualizador"
                        ? "border-orange-500/60 bg-orange-500/10 text-white shadow-sm"
                        : "border-white/10 bg-white/[0.02] text-neutral-400 hover:border-white/20"
                    }`}
                  >
                    <span className="text-xs font-bold text-white">Visualizador</span>
                    <span className="text-[10px] text-neutral-400 mt-1 leading-tight">
                      Apenas visualiza relatórios e extratos
                    </span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-neutral-400 hover:bg-white/10 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Enviar convite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
