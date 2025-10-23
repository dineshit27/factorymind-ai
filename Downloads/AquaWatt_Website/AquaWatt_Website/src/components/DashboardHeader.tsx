import { Button } from "@/components/ui/button";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Mail, LogOut, User, Menu, ChevronRight, Home as HomeIcon } from "lucide-react";
import { useState } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { useToast } from "@/hooks/use-toast";
import { SubscriptionButton } from "@/components/SubscriptionButton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
// ThemeToggle removed to enforce always-light mode

export function DashboardHeader() {
  const { user, signInEmail, signUpEmail, signOutUser } = useSupabaseAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Blue highlight for active nav items
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative transition-colors px-0.5 ${
      isActive
        ? 'text-blue-600 after:absolute after:left-0 after:-bottom-2 after:h-0.5 after:w-full after:bg-blue-600'
        : 'text-gray-900 hover:text-blue-600'
    }`;

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signInEmail(email, password);
      toast({ title: 'Welcome back!', description: 'Sign-in successful' });
      setOpen(false);
      setEmail(''); setPassword('');
    } catch (err: any) {
      toast({ title: 'Sign in failed', description: err?.message || 'Unknown error', variant: 'destructive' });
    } finally { setLoading(false); }
  };

  const onSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { user: newUser, session } = await signUpEmail(email, password);
      if (newUser && !session) {
        toast({ title: 'Check your email', description: 'We sent you a confirmation link.' });
      } else {
        toast({ title: 'Account created', description: 'Welcome to AquaWatt!' });
      }
      setOpen(false);
      setEmail(''); setPassword('');
    } catch (err: any) {
      toast({ title: 'Sign up failed', description: err?.message || 'Unknown error', variant: 'destructive' });
    } finally { setLoading(false); }
  };

  const onLogout = async () => {
    try {
      await signOutUser();
      toast({ title: 'Logged out', description: 'You have been successfully logged out.' });
    } catch (err: any) {
      toast({ title: 'Logout failed', description: err?.message || 'Unknown error', variant: 'destructive' });
    }
  };

  // Navigation handler for section links
  const handleSectionNavigation = (path: string, sectionId?: string) => {
    if (sectionId) {
      // Navigate to the page first, then scroll to section
      navigate(path);
      // Use setTimeout to ensure the page has loaded before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      navigate(path);
    }
  };

  // Handler for View House Map
  const handleViewHouseMap = () => {
    navigate('/analytics');
    // Wait for page to load, then trigger the map to show
    setTimeout(() => {
      // Look for the "View House Map" button and click it programmatically
      const mapButton = document.querySelector('[data-testid="view-house-map-button"]') as HTMLButtonElement;
      if (mapButton) {
        mapButton.click();
      } else {
        // Alternative: dispatch a custom event that the Analytics page can listen to
        window.dispatchEvent(new CustomEvent('showHouseMap'));
      }
    }, 100);
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-6">
        {/* Left: Brand */}
        <div className="flex items-center gap-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <img 
              src="/AquaWatt Logo.png" 
              alt="AQUAWATT Solutions" 
              className="h-12 w-auto object-contain max-w-[200px]"
            />
          </Link>
        </div>

        {/* Center: Nav items */}
        <nav className="mx-auto hidden md:flex items-center gap-6 text-sm">
          {/* Home dropdown */}
          <div className="relative inline-flex items-center">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-1 p-1 transition-colors text-gray-900 hover:text-blue-600">
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>
                  <button onClick={() => handleSectionNavigation('/', 'our-impact')} className="w-full text-left">
                    Our Impact
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <button onClick={() => handleSectionNavigation('/', 'business')} className="w-full text-left">
                    AquaWatt for Business
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <button onClick={() => handleSectionNavigation('/', 'what-we-do')} className="w-full text-left">
                    What We Do
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <button onClick={() => handleSectionNavigation('/', 'testimonials')} className="w-full text-left">
                    Testimonials
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <button onClick={() => handleSectionNavigation('/', 'creator')} className="w-full text-left">
                    About the Creator
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
          {/* Billing dropdown */}
          <div className="relative inline-flex items-center">
            <NavLink to="/billing" className={navLinkClass}>Billing</NavLink>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-1 p-1 transition-colors text-gray-900 hover:text-blue-600">
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>
                  <button onClick={() => handleSectionNavigation('/billing', 'export')} className="w-full text-left">
                    Export Usage Reports
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <button onClick={() => handleSectionNavigation('/billing', 'current-bill')} className="w-full text-left">
                    Current Bill
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <button onClick={() => handleSectionNavigation('/billing', 'history')} className="w-full text-left">
                    Billing History
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* Analytics dropdown */}
          <div className="relative inline-flex items-center">
            <NavLink to="/analytics" className={navLinkClass}>Analytics</NavLink>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-1 p-1 transition-colors text-gray-900 hover:text-blue-600">
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>
                  <button onClick={() => handleSectionNavigation('/analytics', 'ai-insights')} className="w-full text-left">
                    AI-Powered Insights
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <button onClick={() => handleSectionNavigation('/analytics', 'smart-tips')} className="w-full text-left">
                    Smart Tips
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <button onClick={() => handleViewHouseMap()} className="w-full text-left">
                    View House Map
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <button onClick={() => handleSectionNavigation('/analytics', 'usage-distribution')} className="w-full text-left">
                    Usage Distribution
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* Community dropdown */}
          <div className="relative inline-flex items-center">
            <NavLink to="/community" className={navLinkClass}>Community</NavLink>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-1 p-1 transition-colors text-gray-900 hover:text-blue-600">
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>
                  <button onClick={() => handleSectionNavigation('/community', 'events')} className="w-full text-left">
                    Upcoming Events
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <button onClick={() => handleSectionNavigation('/community', 'resources')} className="w-full text-left">
                    Resources
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <button onClick={() => handleSectionNavigation('/community', 'announcements')} className="w-full text-left">
                    Announcements
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
        </nav>

        {/* Right: Auth actions + Mobile menu */}
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden sm:inline-flex">
            <SubscriptionButton />
          </div>
          {/* Theme toggle removed: always-light mode enforced */}
          {user ? (
            <Button variant="outline" className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700" onClick={() => navigate('/profile')}>
              <User className="h-4 w-4" />
              Profile
            </Button>
          ) : (
            <>
              <Button variant="link" className="hidden md:inline p-0 h-auto text-blue-600 hover:text-blue-700 font-medium" onClick={() => { setActiveTab('signin'); setOpen(true); }}>Sign In</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => { setActiveTab('signup'); setOpen(true); }}>Sign Up</Button>
            </>
          )}
          {/* Mobile menu trigger */}
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] sm:w-[360px] p-0">
              <div className="border-b p-4">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <span className="text-base font-semibold">Menu</span>
                  </SheetTitle>
                </SheetHeader>
              </div>
              <nav className="p-2">
                <button onClick={() => { setMobileNavOpen(false); navigate('/'); }} className="w-full flex items-center justify-between px-4 py-3 rounded-md hover:bg-muted text-sm">
                  <span className="flex items-center gap-2"><HomeIcon className="h-4 w-4"/> Home</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
                <button onClick={() => { setMobileNavOpen(false); navigate('/dashboard'); }} className="w-full flex items-center justify-between px-4 py-3 rounded-md hover:bg-muted text-sm">
                  <span>Dashboard</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
                <button onClick={() => { setMobileNavOpen(false); navigate('/billing'); }} className="w-full flex items-center justify-between px-4 py-3 rounded-md hover:bg-muted text-sm">
                  <span>Billing</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
                <button onClick={() => { setMobileNavOpen(false); navigate('/analytics'); }} className="w-full flex items-center justify-between px-4 py-3 rounded-md hover:bg-muted text-sm">
                  <span>Analytics</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
                <button onClick={() => { setMobileNavOpen(false); handleViewHouseMap(); }} className="ml-2 w-[calc(100%-0.5rem)] flex items-center justify-between px-4 py-3 rounded-md hover:bg-muted text-sm">
                  <span>View House Map</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
                <button onClick={() => { setMobileNavOpen(false); navigate('/community'); }} className="w-full flex items-center justify-between px-4 py-3 rounded-md hover:bg-muted text-sm">
                  <span>Community</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
                <button onClick={() => { setMobileNavOpen(false); navigate('/contact'); }} className="w-full flex items-center justify-between px-4 py-3 rounded-md hover:bg-muted text-sm">
                  <span>Contact</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
                <div className="mt-2 border-t" />
                {user ? (
                  <button onClick={() => { setMobileNavOpen(false); navigate('/profile'); }} className="w-full flex items-center justify-between px-4 py-3 rounded-md hover:bg-muted text-sm">
                    <span>Profile</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ) : (
                  <div className="p-3 flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => { setMobileNavOpen(false); setActiveTab('signin'); setOpen(true); }}>Sign In</Button>
                    <Button className="flex-1" onClick={() => { setMobileNavOpen(false); setActiveTab('signup'); setOpen(true); }}>Sign Up</Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Auth Dialog (email/password) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[92vw] sm:w-full sm:max-w-md max-h-[85vh] overflow-y-auto rounded-xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 justify-center text-center">
              <Lock className="h-5 w-5" />
              Sign in to AQUAWATT
            </DialogTitle>
            <DialogDescription className="text-center">Email and password only</DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'signin' | 'signup')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={onSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="signin-email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter your email" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="signin-password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter your password" className="pl-10" required />
                  </div>
                </div>
                <Button type="submit" className="w-full h-11" disabled={loading}>
                  {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</>) : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={onSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="signup-email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter your email" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="signup-password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Create a password" className="pl-10" minLength={6} required />
                  </div>
                </div>
                <Button type="submit" className="w-full h-11" disabled={loading}>
                  {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</>) : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </header>
  );
}
