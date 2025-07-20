import { Router } from 'express';
import { register, login, verifyOtp, logout, getMe, refreshToken } from './auth.controller';
import { validate, registerSchema, loginSchema, verifyOtpSchema } from '../../utils/validation';
import { authenticate } from '../../middleware/auth';
import { authRateLimiter, emailRateLimiter } from '../../middleware/rateLimiter';

const router = Router();

// Public routes with rate limiting
router.post('/register', authRateLimiter, emailRateLimiter, validate(registerSchema), register);
router.post('/login', authRateLimiter, validate(loginSchema), login);
router.post('/verify-otp', authRateLimiter, validate(verifyOtpSchema), verifyOtp);
router.post('/refresh', authRateLimiter, refreshToken);

// Protected routes
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

export default router;