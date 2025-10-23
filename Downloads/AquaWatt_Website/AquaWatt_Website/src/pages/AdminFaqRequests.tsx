import React, { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type FaqRequest = { id: string; question: string; user_id: string | null; created_at: string };

const AdminFaqRequests: React.FC = () => {
  const { user, session } = useSupabaseAuth();
  const [items, setItems] = useState<FaqRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isAdmin = (session?.user?.app_metadata as any)?.role === 'admin' || (session?.user?.role as any) === 'admin';

  useEffect(() => {
    const load = async () => {
      setError(null);
      const { data, error } = await supabase.from('faq_requests').select('*').order('created_at', { ascending: false });
      if (error) { setError(error.message); return; }
      setItems(data as FaqRequest[]);
    };
    if (isAdmin) load();
  }, [isAdmin]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">FAQ Requests (Admin)</h1>
        {!isAdmin && (
          <Alert className="mb-6">
            <AlertTitle>Access denied</AlertTitle>
            <AlertDescription>You do not have permission to view this page.</AlertDescription>
          </Alert>
        )}
        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Submitted Questions</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {items.length === 0 ? (
                <div className="text-sm text-muted-foreground">No requests yet.</div>
              ) : (
                <ul className="space-y-3">
                  {items.map((it) => (
                    <li key={it.id} className="p-3 border rounded-md">
                      <div className="text-sm text-muted-foreground">{new Date(it.created_at).toLocaleString()}</div>
                      <div className="font-medium">{it.question}</div>
                      <div className="text-xs text-muted-foreground">User: {it.user_id ?? 'anonymous'}</div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminFaqRequests;
