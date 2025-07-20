
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNavigation } from "@/components/mobile/MobileNavigation";
import { OfflineIndicator } from "@/components/mobile/OfflineIndicator";
import { SkipLinks } from "@/components/accessibility/SkipLink";
import { AccessibilityPanel } from "@/components/accessibility/AccessibilityPanel";
import { PerformanceMonitor } from "@/components/performance/PerformanceMonitor";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { preloadCriticalRoutes } from "@/components/performance/LazyLoader";
import Home from "./pages/Home";
import Scripts from "./pages/Scripts";
import ScriptDetail from "./pages/ScriptDetail";
import Analytics from "./pages/Analytics";
import PlaywrightProfile from "./pages/PlaywrightProfile";
import AdminPanel from "./pages/AdminPanel";
import NotificationCenter from "./pages/NotificationCenter";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { useAppLogger } from "@/hooks/useAppLogger";
import AppRouter from "@/components/routing/AppRouter";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const App: React.FC = () => {
  // Enable comprehensive logging
  useAppLogger();

  // Preload critical routes for better performance
  React.useEffect(() => {
    console.log('🚀 PRELOADING CRITICAL ROUTES');
    preloadCriticalRoutes();
  }, []);

  // Register service worker
  React.useEffect(() => {
    console.log('🔧 REGISTERING SERVICE WORKER');
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('✅ SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.error('❌ SW registration failed: ', registrationError);
          });
      });
    } else {
      console.warn('⚠️ Service Worker not supported');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <SkipLinks />
            <Header />
            <main id="main-content" className="flex-1">
              <AppRouter />
            </main>
            <Footer />
            <MobileNavigation />
            <OfflineIndicator />
            <AccessibilityPanel />
            <PerformanceMonitor />
          </div>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
