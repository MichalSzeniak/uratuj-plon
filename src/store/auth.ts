import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

export const useAuth = create<AuthState>(() => ({
  user: null,
  isLoading: true,
}));

export const auth = {
  checkAuth: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        useAuth.setState({
          user: session.user,
          isLoading: false,
        });
      } else {
        useAuth.setState({
          user: null,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("💥 Błąd sprawdzania auth:", error);
      useAuth.setState({ isLoading: false });
    }
  },

  // Logowanie Google
  signInWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  },

  // Wylogowanie
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    useAuth.setState({ user: null });
  },
};
