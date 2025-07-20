import { Router } from 'express';
import express from 'express';
import { authenticate } from '../../middleware/auth';
import { paymentRateLimiter, readRateLimiter } from '../../middleware/rateLimiter';
import {
  createPaymentIntent,
  confirmPayment,
  handleStripeWebhook,
  getPaymentHistory
} from './payments.controller';

const router = Router();

// Webhook endpoint (no auth, uses Stripe signature, requires raw body)
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Protected endpoints with rate limiting
router.post('/create-intent', paymentRateLimiter, authenticate, createPaymentIntent);
router.get('/confirm/:payment_intent_id', paymentRateLimiter, authenticate, confirmPayment);
router.get('/history', readRateLimiter, authenticate, getPaymentHistory);

export default router;