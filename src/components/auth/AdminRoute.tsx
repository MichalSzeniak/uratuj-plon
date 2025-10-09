import { useAuth } from "@/store/auth";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  const isAdmin = user?.email === "themichaltd@gmail.com";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p className="text-muted-foreground text-sm">Sprawdzanie...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
