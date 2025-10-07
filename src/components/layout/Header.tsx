import { useAuth, auth } from "@/store/auth";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Plus, Menu, LogOut, User } from "lucide-react";
import { useState } from "react";
import { CreateListingModal } from "../listings/CreateListingModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "../Logo";

export function Header() {
  const { user, isLoading } = useAuth();
  const [createListingOpen, setCreateListingOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              className="flex items-center space-x-2 hover:opacity-80 flex-shrink-0"
            >
              <Logo />
            </Link>

            <nav className="hidden md:flex items-center space-x-4">
              <Button
                onClick={() => setCreateListingOpen(true)}
                className="flex items-center gap-2"
                size="sm"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden lg:inline">Dodaj Ogłoszenie</span>
                <span className="lg:hidden">Dodaj</span>
              </Button>
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-green-600 transition-colors text-sm"
                  >
                    Mój Profil
                  </Link>

                  <div className="flex items-center space-x-3 border-l pl-4">
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">
                          {user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center space-x-1 text-sm text-gray-700 hover:text-gray-900">
                          <span className="max-w-[120px] truncate hidden lg:inline">
                            {user.user_metadata?.full_name || user.email}
                          </span>
                          <span className="lg:hidden">
                            {user.user_metadata?.full_name?.split(" ")[0] ||
                              user.email?.split("@")[0]}
                          </span>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to="/profile" className="cursor-pointer">
                            <User className="h-4 w-4 mr-2" />
                            Mój Profil
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={handleSignOut}
                          className="cursor-pointer text-red-600"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Wyloguj
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

            <div className="flex items-center space-x-2 md:hidden">
              {user && (
                <Button
                  onClick={() => setCreateListingOpen(true)}
                  size="sm"
                  className="h-9 w-9 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}

              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[340px]">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center space-x-3 pb-4 border-b">
                      {user?.user_metadata?.avatar_url ? (
                        <img
                          src={user.user_metadata.avatar_url}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {user?.email?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {user?.user_metadata?.full_name || user?.email}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    <nav className="flex-1 py-6 space-y-4">
                      {/* <Link
                        to="/listings"
                        className="flex items-center space-x-3 text-gray-700 hover:text-green-600 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span>📋</span>
                        <span>Przeglądaj Ogłoszenia</span>
                      </Link> */}

                      {user ? (
                        <>
                          <Link
                            to="/profile"
                            className="flex items-center space-x-3 text-gray-700 hover:text-green-600 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <User className="h-5 w-5" />
                            <span>Mój Profil</span>
                          </Link>

                          <Button
                            onClick={handleSignOut}
                            variant="destructive"
                            className="w-full justify-start gap-3 mt-8"
                          >
                            <LogOut className="h-5 w-5" />
                            <span>Wyloguj</span>
                          </Button>
                        </>
                      ) : (
                        <div>
                          <Button
                            onClick={() => {
                              setCreateListingOpen(true);
                              setMobileMenuOpen(false);
                            }}
                            className="w-full justify-start gap-3"
                            variant="outline"
                          >
                            <Plus className="h-5 w-5" />
                            <span>Dodaj Ogłoszenie</span>
                          </Button>

                          <Link
                            to="/login"
                            className="flex items-center space-x-3 text-gray-700 hover:text-green-600 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <span>🔐</span>
                            <span>Zaloguj się</span>
                          </Link>
                        </div>
                      )}
                    </nav>

                    <div className="pt-4 border-t">
                      <p className="text-xs flex items-center justify-between p-2 text-gray-500 text-center">
                        <Logo />© 2025
                      </p>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
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
