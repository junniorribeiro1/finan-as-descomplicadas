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
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const ADMIN_FALLBACK_EMAILS = ["junniorribeiro1@gmail.com"];

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  isAdmin: false,
  isPending: false,
  isBlocked: false,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string, userEmail?: string | null) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (!error && data) {
        setProfile(data as UserProfile);
      } else if (userEmail && ADMIN_FALLBACK_EMAILS.includes(userEmail.toLowerCase())) {
        // Fallback para admin imediato caso a tabela ainda esteja populando
        setProfile({
          id: userId,
          full_name: "Administrador",
          email: userEmail,
          role: "admin",
          status: "ativo",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
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
    // 1. Obter sessão inicial
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.id, currentUser.email);
      }
      setLoading(false);
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
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const isEmailAdmin = !!user?.email && ADMIN_FALLBACK_EMAILS.includes(user.email.toLowerCase());
  const isAdmin = isEmailAdmin || profile?.role === "admin";
  const isPending = !isAdmin && profile?.status === "pendente";
  const isBlocked = !isAdmin && profile?.status === "bloqueado";

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
