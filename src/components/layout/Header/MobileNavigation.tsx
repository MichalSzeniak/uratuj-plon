import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import { Plus, Menu, LogOut, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "../../Logo";
import ThemeToggle from "@/components/themeProvider/ThemeToggle";

interface MobileNavigationProps {
  user: any;
  mobileMenuOpen: boolean;
  onMobileMenuChange: (open: boolean) => void;
  onCreateListing: () => void;
  onSignOut: () => void;
}

const MobileNavigation = ({
  user,
  mobileMenuOpen,
  onMobileMenuChange,
  onCreateListing,
  onSignOut,
}: MobileNavigationProps) => {
  return (
    <div className="flex items-center space-x-2 md:hidden">
      <ThemeToggle />

      <Button onClick={onCreateListing} size="sm" className="h-9 w-9 p-0">
        <Plus className="h-4 w-4" />
      </Button>

      <Sheet open={mobileMenuOpen} onOpenChange={onMobileMenuChange}>
        <SheetTitle className="hidden">menu</SheetTitle>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[280px] sm:w-[340px] p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center space-x-3 p-6 pb-4 border-b">
              {user?.user_metadata?.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border border-gray-200"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-muted-foreground truncate text-sm">
                  {user?.user_metadata?.full_name || user?.email}
                </p>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {user?.email}
                </p>
              </div>
            </div>

            <nav className="flex-1 py-6 px-6 space-y-2">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-3 py-2.5 text-muted-foreground hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                    onClick={() => onMobileMenuChange(false)}
                  >
                    <User className="h-4 w-4" />
                    <span className="font-medium text-sm">Mój Profil</span>
                  </Link>

                  <div className="pt-4 mt-4 border-t">
                    <Button
                      onClick={onSignOut}
                      variant="ghost"
                      className="w-full justify-start gap-3 px-3 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="font-medium text-sm">Wyloguj</span>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      onCreateListing();
                      onMobileMenuChange(false);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Dodaj Ogłoszenie
                  </Button>

                  <Link
                    to="/login"
                    className="flex items-center space-x-3 px-3 py-2.5 text-muted-foreground hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 border border-gray-200"
                    onClick={() => onMobileMenuChange(false)}
                  >
                    <span>🔐</span>
                    <span className="font-medium text-sm">Zaloguj się</span>
                  </Link>
                </div>
              )}
            </nav>

            <div className="p-6 pt-4 border-t ">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <Logo />
                <span>© 2025</span>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
export default MobileNavigation;
