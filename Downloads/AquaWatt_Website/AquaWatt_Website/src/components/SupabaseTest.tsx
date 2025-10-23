import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const SupabaseTest = () => {
  const { user, session } = useSupabaseAuth();
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test basic Supabase connection by getting the current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        // Test database connection by trying to access a simple table
        // If profiles table doesn't exist, we'll get a specific error
        const { data, error: dbError } = await supabase
          .from('profiles')
          .select('count')
          .limit(1);

        if (dbError) {
          // Check if it's a table doesn't exist error
          if (dbError.message.includes('relation "public.profiles" does not exist')) {
            setConnectionStatus('error');
            setError('Database schema not set up. Please run the SQL schema in your Supabase dashboard.');
          } else {
            throw dbError;
          }
        } else {
          setConnectionStatus('connected');
        }
      } catch (err) {
        setConnectionStatus('error');
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    testConnection();
  }, []);

  const retestConnection = async () => {
    setTesting(true);
    setError(null);
    setConnectionStatus('checking');
    
    try {
      // Test basic Supabase connection by getting the current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      // Test database connection by trying to access a simple table
      const { data, error: dbError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

      if (dbError) {
        if (dbError.message.includes('relation "public.profiles" does not exist')) {
          setConnectionStatus('error');
          setError('Database schema not set up. Please run the SQL schema in your Supabase dashboard.');
        } else {
          throw dbError;
        }
      } else {
        setConnectionStatus('connected');
      }
    } catch (err) {
      setConnectionStatus('error');
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
        <CardDescription>
          Testing database and authentication connection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Database Connection:</span>
          <Badge variant={connectionStatus === 'connected' ? 'default' : connectionStatus === 'error' ? 'destructive' : 'secondary'}>
            {connectionStatus}
          </Badge>
        </div>
        
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            Error: {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span>Authentication:</span>
          <Badge variant={user ? 'default' : 'secondary'}>
            {user ? 'User signed in' : 'No user signed in'}
          </Badge>
        </div>

        {!user && (
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
            <strong>Note:</strong> "No user signed in" is normal. Try signing up or signing in using the button in the top-right corner to test authentication.
          </div>
        )}

        {user && (
          <div className="text-sm space-y-1">
            <div><strong>User ID:</strong> {user.id}</div>
            <div><strong>Email:</strong> {user.email || 'Not provided'}</div>
            <div><strong>Display Name:</strong> {user.user_metadata?.display_name || 'Not provided'}</div>
          </div>
        )}

        {session && (
          <div className="text-sm">
            <div><strong>Session Status:</strong> Active</div>
            <div><strong>Expires:</strong> {new Date(session.expires_at! * 1000).toLocaleString()}</div>
          </div>
        )}

        <div className="pt-4 border-t">
          <Button 
            onClick={retestConnection} 
            disabled={testing}
            className="w-full"
            variant="outline"
          >
            {testing ? 'Testing...' : 'Retest Connection'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
