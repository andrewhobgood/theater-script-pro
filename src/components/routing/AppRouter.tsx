import { Routes, Route } from "react-router-dom";
import { useRouteLogger } from "@/hooks/useRouteLogger";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Home from "@/pages/Home";
import Scripts from "@/pages/Scripts";
import ScriptDetail from "@/pages/ScriptDetail";
import Analytics from "@/pages/Analytics";
import PlaywrightProfile from "@/pages/PlaywrightProfile";
import AdminPanel from "@/pages/AdminPanel";
import NotificationCenter from "@/pages/NotificationCenter";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

const AppRouter = () => {
  useRouteLogger();
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/scripts" element={<Scripts />} />
      <Route path="/scripts/:id" element={<ScriptDetail />} />
      <Route path="/playwrights/:id" element={<PlaywrightProfile />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/signup" element={<Auth />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute requiredRole="playwright">
            <Analytics />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/notifications" 
        element={
          <ProtectedRoute>
            <NotificationCenter />
          </ProtectedRoute>
        } 
      />
      
      {/* Admin Routes */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminPanel />
          </ProtectedRoute>
        } 
      />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;