// src/providers/AuthProvider.tsx - WRÓĆMY DO DZIAŁAJĄCEJ WERSJI
import { useEffect } from "react";
import { auth, useAuth } from "@/store/auth";
import { supabase } from "@/lib/supabase";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log("🚀 Uruchamiam AuthProvider...");

    // Sprawdź auth przy starcie
    auth.checkAuth();

    // Nasłuchuj zmian auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔄 Zmiana auth:", event);

      if (event === "SIGNED_IN" && session?.user) {
        console.log("🎉 Zalogowano!");
        useAuth.setState({ user: session.user });
      } else if (event === "SIGNED_OUT") {
        console.log("👋 Wylogowano");
        useAuth.setState({ user: null });
      }
    });

    return () => {
      console.log("🧹 Czyszczenie AuthProvider");
      subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
}
