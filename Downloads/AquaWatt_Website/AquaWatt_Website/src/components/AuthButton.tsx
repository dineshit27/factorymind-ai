import { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock, Mail, LogIn, LogOut } from "lucide-react";
// removed supabase types

export const AuthButton = () => {
  const { user, signInEmail, signUpEmail, signOutUser, resetPassword } = useSupabaseAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const { toast } = useToast();

  useEffect(() => {
    // Handle auth state changes
  }, [user]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }
    try {
      setLoading(true);
      const { user: newUser, session } = await signUpEmail(email, password);
      
      if (newUser && !session) {
        toast({ 
          title: "Check your email", 
          description: "We sent you a confirmation link to verify your account. Please check your inbox and spam folder." 
        });
      } else if (newUser && session) {
        toast({ title: "Account created", description: "Welcome to AquaWatt!" });
      } else {
        toast({ 
          title: "Account created", 
          description: "Please check your email for a confirmation link to complete your registration." 
        });
      }
      
      setOpen(false);
      setEmail("");
      setPassword("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast({ title: 'Sign up failed', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    try {
      setLoading(true);
      await signInEmail(email, password);
      toast({ title: 'Welcome back!', description: 'Sign-in successful' });
      setOpen(false);
      setEmail('');
      setPassword('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      let errorTitle = 'Sign in failed';
      
      // Handle specific Supabase auth errors
      if (message.includes('Invalid login credentials')) {
        errorTitle = 'Invalid credentials';
      } else if (message.includes('Email not confirmed')) {
        errorTitle = 'Email not confirmed';
      } else if (message.includes('Too many requests')) {
        errorTitle = 'Too many attempts';
      }
      
      toast({ title: errorTitle, description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      toast({ title: "Signed out", description: "Sign-out successful" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast({ title: 'Sign out failed', description: message, variant: 'destructive' });
    }
  };

  // Removed Google & Guest sign-in per simplification request

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    try {
      setLoading(true);
      await resetPassword(email);
      toast({ 
        title: "Reset link sent", 
        description: "Check your email for password reset instructions" 
      });
      setOpen(false);
      setEmail("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast({ title: 'Reset failed', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleSignOut} className="min-h-[44px] text-xs md:text-sm">
          <LogOut className="h-4 w-4 mr-1 md:mr-2" />
          <span className="hidden sm:inline">Sign Out</span>
          <span className="sm:hidden">Out</span>
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="min-h-[44px] text-xs md:text-sm">
          <LogIn className="h-4 w-4 mr-1 md:mr-2" />
          <span className="hidden sm:inline">Sign In</span>
          <span className="sm:hidden">In</span>
        </Button>
      </DialogTrigger>
  <DialogContent className="w-[92vw] sm:w-full sm:max-w-md max-h-[85vh] overflow-y-auto rounded-xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 justify-center text-center">
            <Lock className="h-5 w-5" />
            Welcome to AQUAWATT
          </DialogTitle>
          <DialogDescription className="text-center">
            Sign in to your account or create a new one
          </DialogDescription>
        </DialogHeader>
        
        {/* Simplified: email/password only */}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  className="text-sm text-primary hover:underline"
                  disabled={loading}
                >
                  Forgot your password?
                </button>
              </div>
            </form>
          </TabsContent>
          
          
          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};