// src/components/ProtectedRoute.tsx
import { useAuth } from "@/store/auth";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  console.log("🛡️ ProtectedRoute:", { user: user?.email, isLoading });

  // Jeśli jeszcze się ładuje
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Sprawdzanie...</p>
        </div>
      </div>
    );
  }

  // Jeśli nie zalogowany - przekieruj do logowania
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Jeśli zalogowany - pokaż dzieci
  return <>{children}</>;
}
