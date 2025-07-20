import { supabase } from '@/integrations/supabase/client';
import { API_CONFIG, getApiUrl } from '@/config/api';

interface ApiRequestOptions extends RequestInit {
  token?: string;
  timeout?: number;
}

interface ApiError extends Error {
  status?: number;
  code?: string;
}

class ApiClient {
  private csrfToken: string | null = null;

  private async getAuthToken(): Promise<string | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token || null;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async getCSRFToken(): Promise<string> {
    if (!this.csrfToken) {
      try {
        const response = await fetch(getApiUrl('/csrf-token'), {
          credentials: 'include',
          signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        });
        
        if (!response.ok) {
          throw new Error(`CSRF token fetch failed: ${response.status}`);
        }
        
        const data = await response.json();
        this.csrfToken = data.token;
      } catch (error) {
        console.error('Failed to get CSRF token:', error);
        throw new Error('Unable to initialize secure connection');
      }
    }
    return this.csrfToken;
  }

  private async requestWithRetry<T>(
    endpoint: string,
    options: ApiRequestOptions = {},
    attempt: number = 1
  ): Promise<T> {
    try {
      return await this.request<T>(endpoint, options);
    } catch (error: any) {
      const isNetworkError = !error.status || error.status >= 500;
      const shouldRetry = isNetworkError && attempt < API_CONFIG.RETRY_ATTEMPTS;
      
      if (shouldRetry) {
        console.warn(`API request failed (attempt ${attempt}), retrying...`, error.message);
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY * attempt));
        return this.requestWithRetry<T>(endpoint, options, attempt + 1);
      }
      
      throw error;
    }
  }

  private async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const token = options.token || await this.getAuthToken();
    const timeout = options.timeout || API_CONFIG.TIMEOUT;
    
    // Get CSRF token for non-GET requests
    let csrfToken: string | undefined;
    if (options.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method)) {
      try {
        csrfToken = await this.getCSRFToken();
      } catch (error) {
        console.warn('CSRF token unavailable, proceeding without it');
      }
    }
    
    const config: RequestInit = {
      ...options,
      credentials: 'include',
      signal: AbortSignal.timeout(timeout),
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(getApiUrl(endpoint), config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.error?.message || `HTTP ${response.status}`) as ApiError;
        error.status = response.status;
        error.code = errorData.error?.code;
        throw error;
      }

      // Handle empty responses
      if (response.status === 204) {
        return {} as T;
      }

      return response.json();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please check your connection');
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server - please try again later');
      }
      
      throw error;
    }
  }

  // Auth endpoints
  auth = {
    register: (data: {
      email: string;
      first_name: string;
      last_name: string;
      role: 'playwright' | 'theater_company';
      company_name?: string;
      is_educational?: boolean;
    }) => this.requestWithRetry('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

    login: (email: string) => 
      this.requestWithRetry('/auth/login', { method: 'POST', body: JSON.stringify({ email }) }),

    verifyOtp: (email: string, token: string) =>
      this.requestWithRetry<{
        access_token: string;
        refresh_token: string;
        user: any;
        profile: any;
      }>('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, token }) }),

    logout: () => this.requestWithRetry('/auth/logout', { method: 'POST' }),
    
    getMe: () => this.requestWithRetry<{ user: any; profile: any }>('/auth/me'),

    refreshToken: (refresh_token: string) =>
      this.requestWithRetry<{
        access_token: string;
        refresh_token: string;
      }>('/auth/refresh', { method: 'POST', body: JSON.stringify({ refresh_token }) }),
  };

  // User endpoints
  users = {
    getProfile: () => this.request('/users/profile'),
    
    updateProfile: (data: any) => 
      this.request('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
    
    getPublicProfile: (id: string) => this.request(`/users/${id}/public`),
    
    searchUsers: (params: URLSearchParams) => 
      this.request(`/users/search?${params}`),
    
    getPlaywrights: (params?: URLSearchParams) => 
      this.request(`/users/playwrights${params ? `?${params}` : ''}`),
    
    getTheaterCompanies: (params?: URLSearchParams) => 
      this.request(`/users/theater-companies${params ? `?${params}` : ''}`),
  };

  // Script endpoints
  scripts = {
    getScripts: (params?: URLSearchParams) => 
      this.request<{
        scripts: any[];
        total: number;
        limit: number;
        offset: number;
      }>(`/scripts${params ? `?${params}` : ''}`),
    
    getScript: (id: string) => this.request(`/scripts/${id}`),
    
    searchScripts: (query: string, params?: URLSearchParams) => {
      const searchParams = new URLSearchParams(params);
      searchParams.set('q', query);
      return this.request(`/scripts/search?${searchParams}`);
    },
    
    getMyScripts: (params?: URLSearchParams) => 
      this.request(`/scripts/my/scripts${params ? `?${params}` : ''}`),
    
    createScript: (data: any) => 
      this.request('/scripts', { method: 'POST', body: JSON.stringify(data) }),
    
    updateScript: (id: string, data: any) => 
      this.request(`/scripts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    
    deleteScript: (id: string) => 
      this.request(`/scripts/${id}`, { method: 'DELETE' }),
    
    publishScript: (id: string) => 
      this.request(`/scripts/${id}/publish`, { method: 'POST' }),
    
    unpublishScript: (id: string) => 
      this.request(`/scripts/${id}/unpublish`, { method: 'POST' }),
    
    uploadScriptFile: async (id: string, file: File) => {
      const token = await this.getAuthToken();
      const formData = new FormData();
      formData.append('script', file);
      
      return this.request(`/scripts/${id}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type for FormData
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
    },
    
    uploadCoverImage: async (id: string, file: File) => {
      const token = await this.getAuthToken();
      const formData = new FormData();
      formData.append('coverImage', file);
      
      return this.request(`/scripts/${id}/cover`, {
        method: 'POST',
        body: formData,
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
    },
    
    getReviews: (id: string, params?: URLSearchParams) => 
      this.request(`/scripts/${id}/reviews${params ? `?${params}` : ''}`),
    
    createReview: (id: string, data: { rating: number; title: string; comment: string }) => 
      this.request(`/scripts/${id}/reviews`, { method: 'POST', body: JSON.stringify(data) }),
  };

  // License endpoints
  licenses = {
    getMyLicenses: (params?: URLSearchParams) => 
      this.request(`/licenses/my${params ? `?${params}` : ''}`),
    
    createLicense: (data: any) => 
      this.request('/licenses', { method: 'POST', body: JSON.stringify(data) }),
    
    getLicense: (id: string) => this.request(`/licenses/${id}`),
    
    downloadScript: (id: string) => this.request<{
      download_url: string;
      expires_in: number;
      script_title: string;
    }>(`/licenses/${id}/download`),
    
    updatePerformanceDates: (id: string, performance_dates: any[]) => 
      this.request(`/licenses/${id}/performance-dates`, {
        method: 'PUT',
        body: JSON.stringify({ performance_dates }),
      }),
    
    getPlaywrightLicenses: (params?: URLSearchParams) => 
      this.request(`/licenses/playwright/licenses${params ? `?${params}` : ''}`),
  };

  // Payment endpoints
  payments = {
    createPaymentIntent: (data: { script_id: string; license_type: string }) =>
      this.request<{
        client_secret: string;
        payment_intent_id: string;
        license_id: string;
        amount: number;
        currency: string;
      }>('/payments/create-intent', {
        method: 'POST',
        body: JSON.stringify(data)
      }),

    confirmPayment: (paymentIntentId: string) =>
      this.request<{
        status: string;
        license_status: string;
      }>(`/payments/confirm/${paymentIntentId}`),

    getPaymentHistory: (params?: URLSearchParams) =>
      this.request<{
        transactions: any[];
        total: number;
        limit: number;
        offset: number;
      }>(`/payments/history${params ? `?${params}` : ''}`)
  };

  // Admin endpoints
  admin = {
    // Dashboard
    getDashboardStats: (timeRange: string = '30d') =>
      this.request<{ stats: any }>(`/admin/dashboard/stats?range=${timeRange}`),

    // User management
    getUsers: (params?: URLSearchParams) =>
      this.request<{
        users: any[];
        total: number;
        limit: number;
        offset: number;
      }>(`/admin/users${params ? `?${params}` : ''}`),

    updateUserStatus: (userId: string, action: 'suspend' | 'activate' | 'delete') =>
      this.request(`/admin/users/${userId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ action }),
      }),

    // Script moderation
    getScripts: (params?: URLSearchParams) =>
      this.request<{
        scripts: any[];
        total: number;
        limit: number;
        offset: number;
      }>(`/admin/scripts${params ? `?${params}` : ''}`),

    reviewScript: (scriptId: string, data: { action: 'approve' | 'reject'; notes?: string }) =>
      this.request(`/admin/scripts/${scriptId}/review`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    // Reports
    getReports: (params?: URLSearchParams) =>
      this.request<{
        reports: any[];
        total: number;
      }>(`/admin/reports${params ? `?${params}` : ''}`),

    resolveReport: (reportId: string, action: string) =>
      this.request(`/admin/reports/${reportId}/resolve`, {
        method: 'POST',
        body: JSON.stringify({ action }),
      }),
  };
}

export const apiClient = new ApiClient();
