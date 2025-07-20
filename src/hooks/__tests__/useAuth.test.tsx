import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { supabase } from '@/integrations/supabase/client';
import React from 'react';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      signInWithOtp: vi.fn(),
      verifyOtp: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
      upsert: vi.fn(),
    })),
  },
}));

// Mock API client
vi.mock('@/lib/api-client', () => ({
  apiClient: {
    auth: {
      register: vi.fn(),
    },
  },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => children;

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should initialize with loading state', () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
      data: { session: null },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBe(null);
    expect(result.current.profile).toBe(null);
  });

  it('should handle successful login', async () => {
    const mockEmail = 'test@example.com';
    
    vi.mocked(supabase.auth.signInWithOtp).mockResolvedValueOnce({
      data: { user: null, session: null },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    const loginResult = await result.current.login(mockEmail);

    expect(loginResult.success).toBe(true);
    expect(loginResult.requiresOtp).toBe(true);
    expect(supabase.auth.signInWithOtp).toHaveBeenCalledWith({
      email: mockEmail,
      options: { shouldCreateUser: false },
    });
  });

  it('should handle login error', async () => {
    const mockEmail = 'test@example.com';
    const mockError = new Error('Invalid email');
    
    vi.mocked(supabase.auth.signInWithOtp).mockResolvedValueOnce({
      data: { user: null, session: null },
      error: mockError as any,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    const loginResult = await result.current.login(mockEmail);

    expect(loginResult.success).toBe(false);
    expect(loginResult.error).toBe('Invalid email');
  });

  it('should handle successful OTP verification', async () => {
    const mockEmail = 'test@example.com';
    const mockOtp = '123456';
    const mockSession = {
      user: { id: '123', email: mockEmail },
      access_token: 'token123',
    };
    const mockProfile = {
      id: 'profile123',
      user_id: '123',
      email: mockEmail,
      first_name: 'Test',
      last_name: 'User',
      role: 'playwright',
    };

    vi.mocked(supabase.auth.verifyOtp).mockResolvedValueOnce({
      data: { user: mockSession.user as any, session: mockSession as any },
      error: null,
    });

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValueOnce({
            data: mockProfile,
            error: null,
          }),
        }),
      }),
    } as any);

    const { result } = renderHook(() => useAuth(), { wrapper });

    const verifyResult = await result.current.verifyOtp(mockEmail, mockOtp);

    expect(verifyResult.success).toBe(true);
    expect(verifyResult.user).toEqual(mockSession.user);
    expect(supabase.auth.verifyOtp).toHaveBeenCalledWith({
      email: mockEmail,
      token: mockOtp,
      type: 'email',
    });
  });

  it('should handle logout', async () => {
    vi.mocked(supabase.auth.signOut).mockResolvedValueOnce({
      error: null,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await result.current.logout();

    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(localStorage.getItem('auth-storage')).toBeNull();
  });

  it('should handle registration', async () => {
    const mockRegistrationData = {
      email: 'new@example.com',
      first_name: 'New',
      last_name: 'User',
      role: 'playwright' as const,
    };

    const { apiClient } = await import('@/lib/api-client');
    vi.mocked(apiClient.auth.register).mockResolvedValueOnce({
      message: 'Registration successful',
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    const registerResult = await result.current.register(
      mockRegistrationData.email,
      mockRegistrationData.first_name,
      mockRegistrationData.last_name,
      mockRegistrationData.role
    );

    expect(registerResult.success).toBe(true);
    expect(registerResult.requiresOtp).toBe(true);
    expect(apiClient.auth.register).toHaveBeenCalledWith(mockRegistrationData);
  });

  it('should update profile successfully', async () => {
    const mockUpdates = {
      first_name: 'Updated',
      last_name: 'Name',
    };

    const mockProfile = {
      id: 'profile123',
      user_id: '123',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      role: 'playwright',
    };

    // Set initial profile
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Mock the upsert call
    vi.mocked(supabase.from).mockReturnValue({
      upsert: vi.fn().mockResolvedValueOnce({
        error: null,
      }),
    } as any);

    // Mock the subsequent select call
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValueOnce({
            data: { ...mockProfile, ...mockUpdates },
            error: null,
          }),
        }),
      }),
    } as any);

    const updateResult = await result.current.updateProfile(mockUpdates);

    expect(updateResult.success).toBe(true);
  });
});