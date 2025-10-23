
import { Button } from "@/components/ui/button";
// ThemeToggle removed to enforce always-light mode
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, signOutUser } = useSupabaseAuth();

  const handleSignOut = async () => {
    try { await signOutUser(); } catch (e) { console.warn('Sign out failed', e); }
  };

  const getDisplayName = () => {
  return (user as any)?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';
  };

  return (
    <header className="sticky top-0 z-10 h-16 bg-white/90 backdrop-blur flex items-center justify-between border-b px-6 text-gray-900">
      <div className="flex-1 flex items-center">
        <h2 className="text-xl font-semibold text-gray-900">AQUAWATT</h2>
      </div>

      <div className="flex items-center gap-4">
  {/* Theme toggle removed: always-light mode enforced */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="Profile" />
                  <AvatarFallback className="text-xs">
                    {getDisplayName().charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{getDisplayName()}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/'}>
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
