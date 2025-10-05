// src/store/auth.ts
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

// Proste funkcje auth
export const auth = {
  // Sprawdź czy użytkownik jest zalogowany
  checkAuth: async () => {
    console.log("🔐 Sprawdzam auth...");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("📋 Sesja:", session?.user?.email);

      if (session?.user) {
        useAuth.setState({
          user: session.user,
          isLoading: false,
        });
        console.log("✅ Użytkownik zalogowany");
      } else {
        useAuth.setState({
          user: null,
          isLoading: false,
        });
        console.log("❌ Brak użytkownika");
      }
    } catch (error) {
      console.error("💥 Błąd sprawdzania auth:", error);
      useAuth.setState({ isLoading: false });
    }
  },

  // Logowanie Google
  signInWithGoogle: async () => {
    console.log("🔑 Logowanie Google...");
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
    console.log("🚪 Wylogowanie...");
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    useAuth.setState({ user: null });
    console.log("✅ Wylogowano");
  },
};
