import { useAuth, auth } from "@/store/auth";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { CreateListingModal } from "../../listings/CreateListingModal";
import { Logo } from "../../Logo";
import MobileNavigation from "./MobileNavigation";
import DesktopNavigation from "./DesktopNavigation";

export function Header() {
  const { user, isLoading } = useAuth();
  const [createListingOpen, setCreateListingOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setMobileMenuOpen(false);
    } catch (error) {
      console.error("Błąd wylogowania:", error);
    }
  };

  if (isLoading) {
    return (
      <header className="shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full"></div>
              <h1 className="text-xl font-bold text-muted-foreground">
                ratuj plon
              </h1>
            </div>
            <div className="text-sm text-gray-500">Ładowanie...</div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 hover:opacity-80 flex-shrink-0"
            >
              <Logo />
            </Link>

            <DesktopNavigation
              user={user}
              onCreateListing={() => setCreateListingOpen(true)}
              onSignOut={handleSignOut}
              onNavigate={navigate}
            />

            <MobileNavigation
              user={user}
              mobileMenuOpen={mobileMenuOpen}
              onMobileMenuChange={setMobileMenuOpen}
              onCreateListing={() => setCreateListingOpen(true)}
              onSignOut={handleSignOut}
            />
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
