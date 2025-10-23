import React, { useEffect, Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const Index = lazy(() => import("./pages/Index"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Billing = lazy(() => import("./pages/Billing"));
const Devices = lazy(() => import("./pages/Devices"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Community = lazy(() => import("./pages/Community"));
const Contact = lazy(() => import("./pages/Contact"));
const Health = lazy(() => import("./pages/Health"));
const Profile = lazy(() => import("./pages/Profile"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminFaqRequests = lazy(() => import("./pages/AdminFaqRequests"));
import { LanguageProvider } from "./contexts/LanguageContext";
import { SupabaseAuthProvider } from "./contexts/SupabaseAuthContext";
import { AuthProvider } from "./contexts/AuthContext"; // Firebase (optional) auth layer
import { GlobalChatbotButton } from "@/components/GlobalChatbotButton";
import { SiteFooter } from "@/components/SiteFooter";

const queryClient = new QueryClient();

class RootErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: unknown) {
    console.error('[App ErrorBoundary]', error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 text-center text-red-600">
          <div>
            <h1 className="text-xl font-semibold mb-2">Something went wrong.</h1>
            <p className="text-sm mb-4">{this.state.error.message}</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 rounded bg-red-600 text-white text-sm">Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => {
  // Apply stored theme on initial load
  useEffect(() => {
    // Force light mode regardless of stored preference or system setting
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
    try {
      localStorage.setItem("theme", "light");
    } catch (e) {
      // no-op if localStorage is unavailable
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <SupabaseAuthProvider>
            <AuthProvider>
            <RootErrorBoundary>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Suspense fallback={<div className="w-full h-screen flex items-center justify-center text-sm text-muted-foreground">Loading...</div>}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/billing" element={<Billing />} />
                    <Route path="/devices" element={<Devices />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/health" element={<Health />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/admin/faq-requests" element={<AdminFaqRequests />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
                <SiteFooter />
                <GlobalChatbotButton />
              </BrowserRouter>
            </RootErrorBoundary>
            </AuthProvider>
          </SupabaseAuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
