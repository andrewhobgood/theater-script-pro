import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient } from '../api-client';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
  },
}));

// Mock fetch
global.fetch = vi.fn();

describe('ApiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset CSRF token
    (apiClient as any).csrfToken = null;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('CSRF Protection', () => {
    it('should fetch CSRF token for POST requests', async () => {
      const mockToken = 'test-csrf-token';
      
      // Mock CSRF token fetch
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: mockToken }),
      } as Response);

      // Mock actual request
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      // Mock auth session
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      });

      await apiClient.scripts.createScript({
        title: 'Test Script',
        genre: 'Drama',
      } as any);

      // First call should be to get CSRF token
      expect(global.fetch).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('/csrf-token'),
        expect.objectContaining({
          credentials: 'include',
        })
      );

      // Second call should include CSRF token in headers
      expect(global.fetch).toHaveBeenNthCalledWith(
        2,
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-CSRF-Token': mockToken,
          }),
          credentials: 'include',
        })
      );
    });

    it('should not fetch CSRF token for GET requests', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ scripts: [] }),
      } as Response);

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      });

      await apiClient.scripts.getScripts();

      // Should only make one call (no CSRF token fetch)
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).not.toHaveBeenCalledWith(
        expect.stringContaining('/csrf-token'),
        expect.any(Object)
      );
    });
  });

  describe('Authentication', () => {
    it('should include auth token in requests when available', async () => {
      const mockToken = 'auth-token-123';
      
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: {
          session: {
            access_token: mockToken,
          } as any,
        },
        error: null,
      });

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ scripts: [] }),
      } as Response);

      await apiClient.scripts.getScripts();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockToken}`,
          }),
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('should throw error with message from API response', async () => {
      const errorMessage = 'Invalid request';
      
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: { message: errorMessage } }),
      } as Response);

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      });

      await expect(apiClient.scripts.getScripts()).rejects.toThrow(errorMessage);
    });

    it('should handle non-JSON error responses', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error('Not JSON');
        },
      } as Response);

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      });

      await expect(apiClient.scripts.getScripts()).rejects.toThrow('HTTP 500');
    });
  });

  describe('Script Endpoints', () => {
    beforeEach(() => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      });
    });

    it('should fetch scripts with query parameters', async () => {
      const params = {
        page: 2,
        limit: 20,
        genre: 'Comedy',
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ scripts: [], total: 0 }),
      } as Response);

      await apiClient.scripts.getScripts(params);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/scripts?page=2&limit=20&genre=Comedy'),
        expect.any(Object)
      );
    });

    it('should create a script', async () => {
      const scriptData = {
        title: 'New Script',
        genre: 'Drama',
        description: 'A new play',
      };

      // Mock CSRF token fetch
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'csrf-token' }),
      } as Response);

      // Mock create request
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: '123', ...scriptData }),
      } as Response);

      const result = await apiClient.scripts.createScript(scriptData as any);

      expect(result).toMatchObject(scriptData);
      expect(global.fetch).toHaveBeenLastCalledWith(
        expect.stringContaining('/scripts'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(scriptData),
        })
      );
    });
  });

  describe('Payment Endpoints', () => {
    it('should create payment intent', async () => {
      const paymentData = {
        script_id: 'script123',
        license_type: 'standard',
      };

      // Mock CSRF token fetch
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'csrf-token' }),
      } as Response);

      // Mock payment intent creation
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          client_secret: 'pi_secret',
          payment_intent_id: 'pi_123',
          license_id: 'license_123',
          amount: 1000,
          currency: 'usd',
        }),
      } as Response);

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: { access_token: 'token' } as any },
        error: null,
      });

      const result = await apiClient.payments.createPaymentIntent(paymentData);

      expect(result).toHaveProperty('client_secret');
      expect(result).toHaveProperty('payment_intent_id');
    });
  });
});