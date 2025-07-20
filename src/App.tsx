
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

const queryClient = new QueryClient();

const App: React.FC = () => {
  // Preload critical routes for better performance
  React.useEffect(() => {
    preloadCriticalRoutes();
  }, []);

  // Register service worker
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
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
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/scripts" element={<Scripts />} />
                <Route path="/scripts/:id" element={<ScriptDetail />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/playwrights/:id" element={<PlaywrightProfile />} />
                <Route path="/admin/*" element={<AdminPanel />} />
                <Route path="/notifications" element={<NotificationCenter />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/settings" element={<Settings />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
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
