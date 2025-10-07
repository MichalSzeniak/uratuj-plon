// src/pages/AuthCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/store/auth";

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      console.log("🔄 Przetwarzanie callbacku...");

      // Po prostu sprawdź auth i przekieruj
      await auth.checkAuth();

      // Daj chwilę na aktualizację stanu
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Logowanie udane!</p>
        <p className="text-sm text-gray-400 mt-2">Przekierowuję...</p>
      </div>
    </div>
  );
}
