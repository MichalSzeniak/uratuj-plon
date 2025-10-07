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
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
              <Button
                onClick={() => setCreateListingOpen(true)}
                size="sm"
                className="h-9 w-9 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>

              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTitle className="hidden">menu</SheetTitle>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[280px] sm:w-[340px] p-0"
                >
                  <div className="flex flex-col h-full">
                    {/* Header with user info */}
                    <div className="flex items-center space-x-3 p-6 pb-4 border-b">
                      {user?.user_metadata?.avatar_url && (
                        <img
                          src={user.user_metadata.avatar_url}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full border border-gray-200"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate text-sm">
                          {user?.user_metadata?.full_name || user?.email}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 py-6 px-6 space-y-2">
                      {user ? (
                        <>
                          <Link
                            to="/profile"
                            className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <User className="h-4 w-4" />
                            <span className="font-medium text-sm">
                              Mój Profil
                            </span>
                          </Link>

                          <div className="pt-4 mt-4 border-t">
                            <Button
                              onClick={handleSignOut}
                              variant="ghost"
                              className="w-full justify-start gap-3 px-3 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <LogOut className="h-4 w-4" />
                              <span className="font-medium text-sm">
                                Wyloguj
                              </span>
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-3">
                          <Button
                            onClick={() => {
                              setCreateListingOpen(true);
                              setMobileMenuOpen(false);
                            }}
                            className="w-full justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium"
                          >
                            <Plus className="h-4 w-4" />
                            <span className="text-sm">Dodaj Ogłoszenie</span>
                          </Button>

                          <Link
                            to="/login"
                            className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 border border-gray-200"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <span>🔐</span>
                            <span className="font-medium text-sm">
                              Zaloguj się
                            </span>
                          </Link>
                        </div>
                      )}
                    </nav>

                    <div className="p-6 pt-4 border-t bg-gray-50">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <Logo />
                        <span>© 2025</span>
                      </div>
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
