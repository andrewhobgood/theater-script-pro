import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import Auth from '../Auth';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// Mock hooks
vi.mock('@/hooks/useAuth');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('Auth Page', () => {
  const mockNavigate = vi.fn();
  const mockLogin = vi.fn();
  const mockRegister = vi.fn();
  const mockVerifyOtp = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      profile: null,
      isLoading: false,
      login: mockLogin,
      register: mockRegister,
      verifyOtp: mockVerifyOtp,
      logout: vi.fn(),
      updateProfile: vi.fn(),
    });
  });

  describe('Login Flow', () => {
    it('should render login form by default', () => {
      render(<Auth />);
      
      expect(screen.getByRole('tab', { name: 'Login' })).toHaveAttribute(
        'data-state',
        'active'
      );
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Continue with Email' })).toBeInTheDocument();
    });

    it('should handle successful login', async () => {
      mockLogin.mockResolvedValueOnce({
        success: true,
        requiresOtp: true,
      });

      render(<Auth />);
      
      const emailInput = screen.getByLabelText('Email');
      const submitButton = screen.getByRole('button', { name: 'Continue with Email' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com');
        expect(screen.getByText(/Enter the 6-digit code/)).toBeInTheDocument();
      });
    });

    it('should show error on login failure', async () => {
      mockLogin.mockResolvedValueOnce({
        success: false,
        error: 'Invalid email address',
      });

      render(<Auth />);
      
      const emailInput = screen.getByLabelText('Email');
      const submitButton = screen.getByRole('button', { name: 'Continue with Email' });

      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      });
    });
  });

  describe('Registration Flow', () => {
    it('should render registration form when tab is clicked', () => {
      render(<Auth />);
      
      const signUpTab = screen.getByRole('tab', { name: 'Sign Up' });
      fireEvent.click(signUpTab);

      expect(screen.getByLabelText('First Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Account Type')).toBeInTheDocument();
    });

    it('should handle successful registration', async () => {
      mockRegister.mockResolvedValueOnce({
        success: true,
        requiresOtp: true,
      });

      render(<Auth />);
      
      // Switch to sign up tab
      fireEvent.click(screen.getByRole('tab', { name: 'Sign Up' }));

      // Fill form
      fireEvent.change(screen.getByLabelText('First Name'), {
        target: { value: 'John' },
      });
      fireEvent.change(screen.getByLabelText('Last Name'), {
        target: { value: 'Doe' },
      });
      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'john@example.com' },
      });

      // Select account type
      const accountTypeSelect = screen.getByLabelText('Account Type');
      fireEvent.click(accountTypeSelect);
      fireEvent.click(screen.getByText('Playwright'));

      // Submit
      fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith(
          'john@example.com',
          'John',
          'Doe',
          'playwright'
        );
        expect(screen.getByText(/Enter the 6-digit code/)).toBeInTheDocument();
      });
    });
  });

  describe('OTP Verification', () => {
    it('should handle successful OTP verification', async () => {
      mockLogin.mockResolvedValueOnce({
        success: true,
        requiresOtp: true,
      });

      mockVerifyOtp.mockResolvedValueOnce({
        success: true,
        user: { id: '123', email: 'test@example.com' },
      });

      render(<Auth />);
      
      // Login first
      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Continue with Email' }));

      await waitFor(() => {
        expect(screen.getByText(/Enter the 6-digit code/)).toBeInTheDocument();
      });

      // Enter OTP
      const otpInputs = screen.getAllByRole('textbox');
      const otpCode = '123456';
      otpCode.split('').forEach((digit, index) => {
        fireEvent.change(otpInputs[index], { target: { value: digit } });
      });

      await waitFor(() => {
        expect(mockVerifyOtp).toHaveBeenCalledWith('test@example.com', '123456');
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should show error on invalid OTP', async () => {
      mockLogin.mockResolvedValueOnce({
        success: true,
        requiresOtp: true,
      });

      mockVerifyOtp.mockResolvedValueOnce({
        success: false,
        error: 'Invalid verification code',
      });

      render(<Auth />);
      
      // Login first
      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Continue with Email' }));

      await waitFor(() => {
        expect(screen.getByText(/Enter the 6-digit code/)).toBeInTheDocument();
      });

      // Enter OTP
      const otpInputs = screen.getAllByRole('textbox');
      const otpCode = '999999';
      otpCode.split('').forEach((digit, index) => {
        fireEvent.change(otpInputs[index], { target: { value: digit } });
      });

      await waitFor(() => {
        expect(screen.getByText('Invalid verification code')).toBeInTheDocument();
      });
    });
  });

  it('should redirect to dashboard if already authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '123', email: 'test@example.com' } as any,
      profile: { role: 'playwright' } as any,
      isLoading: false,
      login: mockLogin,
      register: mockRegister,
      verifyOtp: mockVerifyOtp,
      logout: vi.fn(),
      updateProfile: vi.fn(),
    });

    render(<Auth />);

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});