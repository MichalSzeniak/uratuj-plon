// src/components/DebugAuth.tsx
import { useAuthStore } from "@/store/authStore";

export function DebugAuth() {
  const { user, loading, initialized } = useAuthStore();

  if (process.env.NODE_ENV === "development") {
    return (
      <div className="fixed bottom-4 left-4 bg-blue-100 border border-blue-400 p-3 rounded-lg text-xs z-50">
        <div className="font-bold">🔍 Auth Debug</div>
        <div>
          User: {user ? "✅" : "❌"} {user?.email}
        </div>
        <div>Loading: {loading ? "🔄" : "✅"}</div>
        <div>Initialized: {initialized ? "✅" : "🔄"}</div>
        <button
          onClick={() => {
            const state = useAuthStore.getState();
            console.log("Store state:", state);
          }}
          className="mt-1 bg-blue-500 text-white px-2 py-1 rounded text-xs"
        >
          Log State
        </button>
      </div>
    );
  }

  return null;
}

// Dodaj do App.tsx:
// <DebugAuth />
