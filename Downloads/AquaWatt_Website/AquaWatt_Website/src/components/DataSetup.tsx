import { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { seedUserData, clearUserData } from '@/services/dataSeeder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Database, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';

export const DataSetup = () => {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [isSeeded, setIsSeeded] = useState(false);

  const handleSeedData = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Please sign in to seed data',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      await seedUserData(user.id);
      setIsSeeded(true);
      toast({
        title: 'Data Seeded Successfully!',
        description: 'Sample data has been added to your account. You can now explore all features.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to seed data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Please sign in to clear data',
        variant: 'destructive',
      });
      return;
    }

    try {
      setClearing(true);
      await clearUserData(user.id);
      setIsSeeded(false);
      toast({
        title: 'Data Cleared',
        description: 'All your data has been removed.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to clear data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setClearing(false);
    }
  };

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Setup
          </CardTitle>
          <CardDescription>
            Please sign in to set up your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You need to be signed in to set up sample data for testing the application.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Setup
        </CardTitle>
        <CardDescription>
          Set up sample data to test all features of the water management system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isSeeded && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Sample data has been seeded! You can now explore the Dashboard, Analytics, Devices, and Billing features.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <div>
            <h4 className="font-semibold mb-2">Sample Data Includes:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 4 Smart water devices</li>
              <li>• 30 days of usage data</li>
              <li>• Water goals and targets</li>
              <li>• Billing and rate information</li>
              <li>• Sample notifications</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSeedData}
              disabled={loading || isSeeded}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Seeding...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  {isSeeded ? 'Data Seeded' : 'Seed Sample Data'}
                </>
              )}
            </Button>

            {isSeeded && (
              <Button
                onClick={handleClearData}
                disabled={clearing}
                variant="destructive"
                size="sm"
              >
                {clearing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Note:</strong> This will add sample data to your account. 
            You can clear it anytime using the trash button.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
