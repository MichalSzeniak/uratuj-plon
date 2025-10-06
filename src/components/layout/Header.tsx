import { useAuth, auth } from "@/store/auth";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateListingModal } from "../listings/CreateListingModal";

export function Header() {
  const { user, isLoading } = useAuth();
  const [createListingOpen, setCreateListingOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Błąd wylogowania:", error);
    }
  };

  if (isLoading) {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full"></div>
              <h1 className="text-xl font-bold text-gray-900">FarmConnect</h1>
            </div>
            <div className="text-sm text-gray-500">Ładowanie...</div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 hover:opacity-80"
            >
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">FarmConnect</h1>
            </Link>

            <nav className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => setCreateListingOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Dodaj Ogłoszenie
                  </Button>
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-green-600 transition-colors text-sm"
                  >
                    Mój Profil
                  </Link>

                  <div className="flex items-center space-x-3 border-l pl-4">
                    {user.user_metadata?.avatar_url && (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span className="text-sm text-gray-700">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                    >
                      Wyloguj
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600"
                >
                  Zaloguj
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>
      <CreateListingModal
        open={createListingOpen}
        onOpenChange={setCreateListingOpen}
      />
    </>
  );
}
