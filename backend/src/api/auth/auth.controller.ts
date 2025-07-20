import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin, createUserProfile } from '../../services/supabase';
import { AppError } from '../../middleware/errorHandler';
import { logger } from '../../utils/logger';
import { sendWelcomeEmail } from '../../services/email';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, first_name, last_name, role, company_name, is_educational } = req.body;

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: false,
    });

    if (authError) {
      logger.error('Error creating auth user:', authError);
      throw new AppError('Failed to create user', 500);
    }

    // Create user profile
    const profile = await createUserProfile({
      user_id: authData.user.id,
      email,
      first_name,
      last_name,
      role,
      ...(role === 'theater_company' && { company_name, is_educational }),
    });

    // Send OTP email
    const { error: otpError } = await supabaseAdmin.auth.signInWithOtp({
      email,
    });

    if (otpError) {
      logger.error('Error sending OTP:', otpError);
      throw new AppError('Failed to send verification email', 500);
    }

    res.status(201).json({
      message: 'User registered successfully. Please check your email for verification code.',
      profile: {
        id: profile.id,
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        role: profile.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;

    // Check if user exists
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (!profile) {
      throw new AppError('User not found', 404);
    }

    // Send OTP
    const { error } = await supabaseAdmin.auth.signInWithOtp({
      email,
    });

    if (error) {
      logger.error('Error sending OTP:', error);
      throw new AppError('Failed to send verification email', 500);
    }

    res.json({
      message: 'Verification code sent to your email',
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, token } = req.body;

    // Verify OTP
    const { data, error } = await supabaseAdmin.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) {
      logger.error('OTP verification error:', error);
      throw new AppError('Invalid or expired verification code', 400);
    }

    // Get user profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('user_id', data.user!.id)
      .single();

    if (!profile) {
      throw new AppError('User profile not found', 404);
    }

    // Update verified status if first time
    if (!profile.is_verified) {
      await supabaseAdmin
        .from('profiles')
        .update({ is_verified: true })
        .eq('id', profile.id);
      
      // Send welcome email
      try {
        await sendWelcomeEmail(email, profile.first_name, profile.role);
      } catch (emailError) {
        logger.error('Failed to send welcome email:', emailError);
        // Don't fail the verification if email fails
      }
    }

    res.json({
      access_token: data.session!.access_token,
      refresh_token: data.session!.refresh_token,
      user: {
        id: data.user!.id,
        email: data.user!.email,
      },
      profile: {
        id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        role: profile.role,
        is_verified: true,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      throw new AppError('Refresh token required', 400);
    }

    const { data, error } = await supabaseAdmin.auth.refreshSession({
      refresh_token,
    });

    if (error) {
      logger.error('Token refresh error:', error);
      throw new AppError('Invalid refresh token', 401);
    }

    res.json({
      access_token: data.session!.access_token,
      refresh_token: data.session!.refresh_token,
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    // Supabase handles token invalidation on the client side
    // We can add server-side token blacklisting here if needed
    
    res.json({
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({
      user: req.user,
      profile: req.profile,
    });
  } catch (error) {
    next(error);
  }
}