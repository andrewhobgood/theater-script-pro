import { useState, useEffect, useCallback } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/components/ui/use-toast';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'playwright' | 'theater_company' | 'admin';
  is_verified: boolean;
  bio?: string;
  website?: string;
  location?: any;
  social_media?: any;
  specialties?: string[];
  awards?: string[];
  company_name?: string;
  year_founded?: number;
  venue_capacity?: number;
  is_educational?: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: SupabaseUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
  });
  const { toast } = useToast();

  // Fetch user profile from API
  const fetchProfile = useCallback(async (user: SupabaseUser) => {
    try {
      const { profile } = await apiClient.auth.getMe();
      setAuthState({
        user,
        profile,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setAuthState({
        user,
        profile: null,
        isLoading: false,
        isAuthenticated: true,
      });
    }
  }, []);

  // Check for existing session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          await fetchProfile(session.user);
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Session check error:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        setAuthState({
          user: null,
          profile: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const register = async (data: {
    email: string;
    first_name: string;
    last_name: string;
    role: 'playwright' | 'theater_company';
    company_name?: string;
    is_educational?: boolean;
  }) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      await apiClient.auth.register(data);
      
      toast({
        title: "Registration successful!",
        description: "Please check your email for a verification code.",
      });
      
      return { success: true, email: data.email };
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const login = async (email: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      await apiClient.auth.login(email);
      
      toast({
        title: "Verification code sent",
        description: "Please check your email for the verification code.",
      });
      
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const verifyOtp = async (email: string, token: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await apiClient.auth.verifyOtp(email, token);
      
      // Set the session in Supabase
      await supabase.auth.setSession({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
      });
      
      toast({
        title: "Welcome!",
        description: "You have successfully logged in.",
      });
      
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid or expired verification code",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      await apiClient.auth.logout();
      await supabase.auth.signOut();
      
      setAuthState({
        user: null,
        profile: null,
        isLoading: false,
        isAuthenticated: false,
      });
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Force local logout even if API fails
      await supabase.auth.signOut();
      setAuthState({
        user: null,
        profile: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      const response = await apiClient.users.updateProfile(data);
      
      if (response.profile) {
        setAuthState(prev => ({
          ...prev,
          profile: response.profile,
        }));
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  return {
    user: authState.user,
    profile: authState.profile,
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    register,
    login,
    verifyOtp,
    logout,
    updateProfile,
  };
};