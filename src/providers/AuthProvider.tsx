import { useEffect } from "react";
import { auth, useAuth } from "@/store/auth";
import { supabase } from "@/lib/supabase";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    auth.checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        useAuth.setState({ user: session.user });
      } else if (event === "SIGNED_OUT") {
        useAuth.setState({ user: null });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
}
