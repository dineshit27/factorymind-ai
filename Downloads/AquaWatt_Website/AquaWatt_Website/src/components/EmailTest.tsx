import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, CheckCircle } from 'lucide-react';

export const EmailTest = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const testSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: 'Error',
        description: 'Please enter an email address',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password: 'testpassword123',
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        setResult({ error: error.message });
        toast({
          title: 'Signup failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setResult({ 
          success: true, 
          user: data.user, 
          session: data.session,
          needsConfirmation: data.user && !data.session
        });
        
        if (data.user && !data.session) {
          toast({
            title: 'Check your email',
            description: 'Confirmation email sent! Check your inbox and spam folder.',
          });
        } else {
          toast({
            title: 'Signup successful',
            description: 'Account created and signed in automatically.',
          });
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setResult({ error: message });
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Verification Test
        </CardTitle>
        <CardDescription>
          Test email signup and verification flow
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={testSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="test-email">Email Address</Label>
            <Input
              id="test-email"
              type="email"
              placeholder="Enter email to test"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing signup...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Test Email Signup
              </>
            )}
          </Button>
        </form>

        {result && (
          <div className="mt-4 p-4 rounded-lg bg-muted">
            <h4 className="font-semibold mb-2">Test Result:</h4>
            {result.error ? (
              <div className="text-red-600">
                <strong>Error:</strong> {result.error}
              </div>
            ) : result.success ? (
              <div className="text-green-600">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <strong>Success!</strong>
                </div>
                <div className="text-sm space-y-1">
                  <div><strong>User ID:</strong> {result.user?.id}</div>
                  <div><strong>Email:</strong> {result.user?.email}</div>
                  <div><strong>Email Confirmed:</strong> {result.user?.email_confirmed_at ? 'Yes' : 'No'}</div>
                  <div><strong>Session Active:</strong> {result.session ? 'Yes' : 'No'}</div>
                  <div><strong>Needs Confirmation:</strong> {result.needsConfirmation ? 'Yes' : 'No'}</div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p><strong>Note:</strong> This will create a test account with password "testpassword123"</p>
          <p>Check your email inbox and spam folder for the confirmation link.</p>
        </div>
      </CardContent>
    </Card>
  );
};
