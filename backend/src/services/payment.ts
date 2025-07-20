import Stripe from 'stripe';
import { config } from '../config';
import { logger } from '../utils/logger';

// Initialize Stripe
const stripe = new Stripe(config.stripe.secretKey || 'sk_test_placeholder', {
  apiVersion: '2025-02-24.acacia',
});

export async function createPaymentIntent(
  amount: number,
  description: string,
  customerId: string,
  metadata?: Record<string, string>
) {
  try {
    // Convert amount to cents
    const amountInCents = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      description,
      metadata: {
        customer_id: customerId,
        ...metadata,
      },
    });

    return paymentIntent;
  } catch (error) {
    logger.error('Error creating payment intent:', error);
    throw error;
  }
}

export async function confirmPaymentIntent(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    logger.error('Error retrieving payment intent:', error);
    throw error;
  }
}

export async function createCustomer(email: string, name: string, profileId: string) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        profile_id: profileId,
      },
    });

    return customer;
  } catch (error) {
    logger.error('Error creating Stripe customer:', error);
    throw error;
  }
}

export async function handleWebhook(payload: Buffer, signature: string) {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      config.stripe.webhookSecret
    );

    return event;
  } catch (error) {
    logger.error('Webhook signature verification failed:', error);
    throw error;
  }
}

// Export as a service object for consistency
export const paymentService = {
  createPaymentIntent,
  confirmPaymentIntent,
  createCustomer,
  handleWebhook,
};