import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: "user" | "admin";
  status: "ativo" | "pendente" | "bloqueado";
  account_type?: string;
  plan?: string;
  avatar_url?: string | null;
  phone?: string | null;
  preferred_name?: string | null;
  vera_activated_at?: string | null;
  vera_mensagens_hoje?: number | null;
  vera_ultimo_ciclo?: string | null;
  mentor_notes?: string | null;
  patente_nivel?: number | null;
  patente_atualizada_em?: string | null;
  conquistas_desbloqueadas?: string[] | null;
  access_expires_at?: string | null;
  bonus_days_added?: number | null;
  plan_renovado?: boolean | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isPending: boolean;
  isBlocked: boolean;
  isAccessExpired: boolean;
  accessExpiresAt: string | null;
  planRenovado: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const ADMIN_FALLBACK_EMAILS = [
  "junniorribeiro1@gmail.com",
  "suporte@nataliarodolfo.com.br",
];

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  isAdmin: false,
  isPending: false,
  isBlocked: false,
  isAccessExpired: false,
  accessExpiresAt: null,
  planRenovado: false,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("organizai_cached_profile");
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string, userEmail?: string | null) => {
    try {
      const queryPromise = supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: new Error("Profile timeout") }), 2000)
      );

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

      if (!error && data) {
        const prof = data as UserProfile;
        setProfile(prof);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("organizai_cached_profile", JSON.stringify(prof));
          } catch {}
        }
      } else if (userEmail && ADMIN_FALLBACK_EMAILS.includes(userEmail.toLowerCase())) {
        // Fallback para admin imediato caso a tabela ainda esteja populando
        const adminProf: UserProfile = {
          id: userId,
          full_name: "Administrador",
          email: userEmail,
          role: "admin",
          status: "ativo",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setProfile(adminProf);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("organizai_cached_profile", JSON.stringify(adminProf));
          } catch {}
        }
      }
    } catch {
      // Ignora erro silenciosamente
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id, user.email);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    let finalizado = false;

    // Timeout de salvaguarda: nunca trava o app em "Carregando" por mais de 2s
    const timerSeguranca = setTimeout(() => {
      if (!finalizado) {
        finalizado = true;
        setLoading(false);
      }
    }, 2000);

    // 1. Obter sessão inicial
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.id, currentUser.email);
      }
      if (!finalizado) {
        finalizado = true;
        clearTimeout(timerSeguranca);
        setLoading(false);
      }
    }).catch(() => {
      if (!finalizado) {
        finalizado = true;
        clearTimeout(timerSeguranca);
        setLoading(false);
      }
    });

    // 2. Escutar mudanças de estado de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.id, currentUser.email);
      } else {
        setProfile(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("organizai_cached_profile");
        }
      }
      setLoading(false);
    });

    return () => {
      clearTimeout(timerSeguranca);
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("organizai_cached_profile");
    }
  };

  const isEmailAdmin = !!user?.email && ADMIN_FALLBACK_EMAILS.includes(user.email.toLowerCase());
  const isAdmin = isEmailAdmin || profile?.role === "admin";
  const isPending = !isAdmin && profile?.status === "pendente";

  // Se o aluno tiver uma data de expiração de bônus/acesso que já passou e não tiver renovado o plano
  const isAccessExpired = Boolean(
    !isAdmin &&
      profile?.access_expires_at &&
      new Date(profile.access_expires_at).getTime() < Date.now() &&
      !profile?.plan_renovado
  );

  const isBlocked = (!isAdmin && profile?.status === "bloqueado") || isAccessExpired;

  // Se expirou e ainda não foi marcado como bloqueado no banco, atualiza em segundo plano
  useEffect(() => {
    if (isAccessExpired && profile?.id && profile.status !== "bloqueado") {
      supabase
        .from("profiles")
        .update({ status: "bloqueado", updated_at: new Date().toISOString() })
        .eq("id", profile.id)
        .then(() => {});
    }
  }, [isAccessExpired, profile?.id, profile?.status]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isAdmin,
        isPending,
        isBlocked,
        isAccessExpired,
        accessExpiresAt: profile?.access_expires_at ?? null,
        planRenovado: Boolean(profile?.plan_renovado),
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
  }
  return context;
}
