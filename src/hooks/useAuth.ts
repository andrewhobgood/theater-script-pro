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
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });
  const { toast } = useToast();

  // Clear error after a timeout
  const clearError = useCallback(() => {
    setTimeout(() => {
      setAuthState(prev => ({ ...prev, error: null }));
    }, 5000);
  }, []);

  // Fetch user profile from API
  const fetchProfile = useCallback(async (user: SupabaseUser) => {
    try {
      console.log('Fetching profile for user:', user.id);
      const { profile } = await apiClient.auth.getMe();
      
      setAuthState({
        user,
        profile,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      const errorMessage = error.message || 'Failed to load user profile';
      
      setAuthState({
        user,
        profile: null,
        isLoading: false,
        isAuthenticated: true,
        error: errorMessage,
      });
      
      toast({
        title: "Profile Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      clearError();
    }
  }, [toast, clearError]);

  // Check for existing session and set up auth listener
  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        console.log('Checking existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          if (mounted) {
            setAuthState(prev => ({ 
              ...prev, 
              isLoading: false, 
              error: 'Session verification failed' 
            }));
            clearError();
          }
          return;
        }
        
        if (session?.user && mounted) {
          console.log('Found existing session');
          await fetchProfile(session.user);
        } else if (mounted) {
          console.log('No existing session found');
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error: any) {
        console.error('Session check error:', error);
        if (mounted) {
          setAuthState(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: 'Unable to verify authentication status' 
          }));
          clearError();
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        // Defer profile fetching to avoid deadlock
        setTimeout(() => {
          if (mounted) {
            fetchProfile(session.user);
          }
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        setAuthState({
          user: null,
          profile: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        // Update user but keep existing profile if available
        setAuthState(prev => ({
          ...prev,
          user: session.user,
          error: null,
        }));
      }
    });

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile, clearError]);

  const register = async (data: {
    email: string;
    first_name: string;
    last_name: string;
    role: 'playwright' | 'theater_company';
    company_name?: string;
    is_educational?: boolean;
  }) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      console.log('Registering user:', data.email);
      await apiClient.auth.register(data);
      
      toast({
        title: "Registration successful!",
        description: "Please check your email for a verification code.",
      });
      
      return { success: true, email: data.email };
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.message || "An error occurred during registration";
      
      setAuthState(prev => ({ ...prev, error: errorMessage }));
      
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      clearError();
      return { success: false, error: errorMessage };
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const login = async (email: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      console.log('Logging in user:', email);
      await apiClient.auth.login(email);
      
      toast({
        title: "Verification code sent",
        description: "Please check your email for the verification code.",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.message || "An error occurred during login";
      
      setAuthState(prev => ({ ...prev, error: errorMessage }));
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      clearError();
      return { success: false, error: errorMessage };
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const verifyOtp = async (email: string, token: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      console.log('Verifying OTP for user:', email);
      const response = await apiClient.auth.verifyOtp(email, token);
      
      // Set the session in Supabase client
      console.log('Setting Supabase session');
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
      });
      
      if (sessionError) {
        throw new Error('Failed to establish session');
      }
      
      toast({
        title: "Welcome!",
        description: "You have successfully logged in.",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('OTP verification error:', error);
      const errorMessage = error.message || "Invalid or expired verification code";
      
      setAuthState(prev => ({ ...prev, error: errorMessage }));
      
      toast({
        title: "Verification failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      clearError();
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      console.log('Logging out user');
      
      // Call backend logout first
      try {
        await apiClient.auth.logout();
      } catch (error) {
        console.warn('Backend logout failed, continuing with local logout:', error);
      }
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      setAuthState({
        user: null,
        profile: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      // Force local logout even if API fails
      await supabase.auth.signOut();
      setAuthState({
        user: null,
        profile: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      console.log('Updating profile:', data);
      const response = await apiClient.users.updateProfile(data);
      
      if (response.profile) {
        setAuthState(prev => ({
          ...prev,
          profile: response.profile,
          error: null,
        }));
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Profile update error:', error);
      const errorMessage = error.message || "Failed to update profile";
      
      setAuthState(prev => ({ ...prev, error: errorMessage }));
      
      toast({
        title: "Update failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      clearError();
      return { success: false, error: errorMessage };
    }
  };

  return {
    user: authState.user,
    profile: authState.profile,
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    error: authState.error,
    register,
    login,
    verifyOtp,
    logout,
    updateProfile,
  };
};
