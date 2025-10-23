import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import React from 'react';

const Billing = () => {
  // Get current date for billing period
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  // Monthly insights data
  const monthlyInsights = {
    currentMonth: {
      totalCost: 3885,
      waterCost: 1575,
      electricityCost: 2310,
      waterUsage: 3.5,
      electricityUsage: 210
    },
    previousMonth: {
      totalCost: 3715.50,
      waterCost: 1525,
      electricityCost: 2190.50,
      waterUsage: 3.2,
      electricityUsage: 198
    },
    yearToDate: {
      totalCost: 15658,
      avgMonthlyCost: 3914.50,
      totalSavings: 245.80
    }
  };

  const costDifference = monthlyInsights.currentMonth.totalCost - monthlyInsights.previousMonth.totalCost;
  const costPercentChange = ((costDifference / monthlyInsights.previousMonth.totalCost) * 100).toFixed(1);

  // Usage document image path
  const USAGE_DOCUMENT_IMAGE = '/aquawatt-usage-document.jpg';

  // Helper to download the usage document image
  const downloadUsageDocument = async (filename: string): Promise<boolean> => {
    try {
      const response = await fetch(USAGE_DOCUMENT_IMAGE);
      if (!response.ok) throw new Error('Image not found');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Download failed:', error);
      return false;
    }
  };

  // Function to handle bill download - downloads usage document image
  const handleDownload = async (month: string) => {
    try {
      const filename = `AQUAWATT-Usage-Document-${month.replace(/\s/g, '-')}.jpg`;
      const success = await downloadUsageDocument(filename);
      
      if (success) {
        toast({ 
          title: 'Document Downloaded', 
          description: `Your ${month} usage document has been downloaded` 
        });
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading the document. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to export usage report - downloads usage document image
  const handleExportPDF = async () => {
    try {
      const filename = 'AQUAWATT-Usage-Report.jpg';
      const success = await downloadUsageDocument(filename);
      
      if (success) {
        toast({
          title: "Export Complete",
          description: "Usage report has been downloaded",
        });
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the report. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to export detailed usage report - downloads usage document image
  const handleExportDetailedPDF = async () => {
    try {
      const filename = 'AQUAWATT-Detailed-Usage-Report.jpg';
      const success = await downloadUsageDocument(filename);
      
      if (success) {
        toast({ 
          title: 'Export Complete', 
          description: 'Detailed usage report downloaded successfully.' 
        });
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Detailed export error:', error);
      toast({ 
        title: 'Export Failed', 
        description: 'Could not export the report. Please try again.', 
        variant: 'destructive' 
      });
    }
  };

  return (
    <div className="flex h-screen bg-background flex-col">
      <main className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <div className="flex-1 overflow-auto p-6">
          <div className="grid gap-6">
            {/* Monthly Summary & Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Monthly Summary & Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">This Month vs Last Month</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">₹{monthlyInsights.currentMonth.totalCost}</span>
                      <div className={`flex items-center gap-1 text-sm ${costDifference > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {costDifference > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {costPercentChange}%
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {costDifference > 0 ? `₹${costDifference.toFixed(2)} more` : `₹${Math.abs(costDifference).toFixed(2)} less`} than last month
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Average Monthly Cost</p>
                    <span className="text-2xl font-bold">₹{monthlyInsights.yearToDate.avgMonthlyCost}</span>
                    <p className="text-xs text-muted-foreground">Year to date average</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total Savings</p>
                    <span className="text-2xl font-bold text-green-500">₹{monthlyInsights.yearToDate.totalSavings}</span>
                    <p className="text-xs text-muted-foreground">Efficiency improvements</p>
                  </div>
                </div>
                
                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Water Usage Trend</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Current: {monthlyInsights.currentMonth.waterUsage} kL</span>
                        <span className="text-muted-foreground">Previous: {monthlyInsights.previousMonth.waterUsage} kL</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {monthlyInsights.currentMonth.waterUsage > monthlyInsights.previousMonth.waterUsage ? 'Usage increased' : 'Usage decreased'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Electricity Usage Trend</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Current: {monthlyInsights.currentMonth.electricityUsage} kWh</span>
                        <span className="text-muted-foreground">Previous: {monthlyInsights.previousMonth.electricityUsage} kWh</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {monthlyInsights.currentMonth.electricityUsage > monthlyInsights.previousMonth.electricityUsage ? 'Usage increased' : 'Usage decreased'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Export Usage Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Export Usage Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Download detailed usage reports with daily consumption data, costs, and trends.
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <Button variant="outline" onClick={handleExportPDF} className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Export as PDF
                    </Button>
                    
                    <Button variant="outline" onClick={handleExportDetailedPDF} className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export Detailed PDF
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Reports include: Daily usage data, cost breakdown, consumption trends, and efficiency metrics
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Bill */}
            <Card>
              <CardHeader>
                <CardTitle>Current Bill ({currentMonth} {currentYear})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Water Usage (3.50 kL)</span>
                    <span className="font-semibold">₹1,575.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Electricity Usage (210 kWh)</span>
                    <span className="font-semibold">₹2,310.00</span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-4">
                    <span className="font-semibold">Total Amount</span>
                    <span className="font-bold text-lg">₹3,885.00</span>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => handleDownload(`${currentMonth} ${currentYear}`)}>
                      <Download className="mr-2 h-4 w-4" />
                      Download Bill
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing History */}
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { month: `March ${currentYear}`, amount: "₹3,715.50", status: "Paid" },
                    { month: `February ${currentYear}`, amount: "₹3,925.75", status: "Paid" },
                    { month: `January ${currentYear}`, amount: "₹4,132.00", status: "Paid" },
                  ].map((bill) => (
                    <div key={bill.month} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{bill.month}</p>
                        <p className="text-sm text-muted-foreground">{bill.status}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span>{bill.amount}</span>
                        <Button variant="outline" size="icon" onClick={() => handleDownload(bill.month)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Billing;
