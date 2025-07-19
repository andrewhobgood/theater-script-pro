// Mock authentication hook for development

import { useState, useEffect } from 'react';
import { User, PlaywrightProfile, TheaterCompanyProfile, AdminProfile, UserRole } from '@/types/auth';
import { mockCurrentUser, mockCurrentProfile, mockUsers, mockPlaywrightProfiles, mockTheaterProfiles } from '@/lib/mock-data';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<PlaywrightProfile | TheaterCompanyProfile | AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    const timer = setTimeout(() => {
      // For development, start with playwright user
      const userWithName = { ...mockCurrentUser, name: `${mockCurrentUser.firstName} ${mockCurrentUser.lastName}` };
      setUser(userWithName);
      setProfile(mockCurrentProfile);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, role: UserRole) => {
    setIsLoading(true);
    
    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email && u.role === role);
    if (user) {
      const userWithName = { ...user, name: `${user.firstName} ${user.lastName}` };
      setUser(userWithName);
      
      // Get profile based on role
      if (role === 'playwright') {
        const profile = mockPlaywrightProfiles.find(p => p.userId === user.id);
        setProfile(profile || null);
      } else if (role === 'theater_company') {
        const profile = mockTheaterProfiles.find(p => p.userId === user.id);
        setProfile(profile || null);
      }
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
  };

  const switchRole = (role: UserRole) => {
    const newUser = mockUsers.find(u => u.role === role);
    if (newUser) {
      const userWithName = { ...newUser, name: `${newUser.firstName} ${newUser.lastName}` };
      setUser(userWithName);
      
      if (role === 'playwright') {
        const profile = mockPlaywrightProfiles.find(p => p.userId === newUser.id);
        setProfile(profile || null);
      } else if (role === 'theater_company') {
        const profile = mockTheaterProfiles.find(p => p.userId === newUser.id);
        setProfile(profile || null);
      } else {
        setProfile(null);
      }
    }
  };

  return {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    switchRole, // Helper for development
  };
};