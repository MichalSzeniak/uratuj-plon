import ThemeToggle from "@/components/themeProvider/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Plus, User } from "lucide-react";
import { Link } from "react-router-dom";

interface DesktopNavigationProps {
  user: any;
  onCreateListing: () => void;
  onSignOut: () => void;
  onNavigate: (path: string) => void;
}

const DesktopNavigation = ({
  user,
  onCreateListing,
  onSignOut,
  onNavigate,
}: DesktopNavigationProps) => {
  return (
    <nav className="hidden md:flex items-center space-x-4">
      <Button onClick={onCreateListing} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Dodaj Ogłoszenie
        <span className="lg:hidden">Dodaj</span>
      </Button>

      {user ? (
        <div className="flex items-center space-x-4">
          <Link
            to="/profile"
            className="text-muted-foreground hover:text-green-600 transition-colors text-sm"
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
                <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-muted-foreground">
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
                  onClick={onSignOut}
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
        <Button onClick={() => onNavigate("/login")}>Zaloguj</Button>
      )}

      <ThemeToggle />
    </nav>
  );
};
export default DesktopNavigation;
