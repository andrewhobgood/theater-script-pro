import { Request, Response, NextFunction } from 'express';
import { paymentService } from '../../services/payment';
import { supabaseAdmin } from '../../services/supabase';
import { logger } from '../../utils/logger';

export async function createPaymentIntent(req: Request, res: Response, next: NextFunction) {
  try {
    const { script_id, license_type } = req.body;
    const userId = req.user!.id;

    // Validate input
    if (!script_id || !license_type) {
      return res.status(400).json({
        error: 'Missing required fields: script_id, license_type'
      });
    }

    // Validate license type
    const validLicenseTypes = ['standard', 'premium', 'educational'];
    if (!validLicenseTypes.includes(license_type)) {
      return res.status(400).json({
        error: 'Invalid license type. Must be: standard, premium, or educational'
      });
    }

    // Get script details
    const { data: script, error: scriptError } = await supabaseAdmin
      .from('scripts')
      .select('*, profiles:playwright_id(first_name, last_name)')
      .eq('id', script_id)
      .single();

    if (scriptError || !script) {
      logger.error('Error fetching script:', scriptError);
      return res.status(404).json({ error: 'Script not found' });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      logger.error('Error fetching profile:', profileError);
      return res.status(404).json({ error: 'User profile not found' });
    }

    // Verify user has permission (must be theater company)
    if (profile.role !== 'theater_company') {
      return res.status(403).json({ 
        error: 'Only theater companies can purchase licenses' 
      });
    }

    // Check for existing active license
    const { data: existingLicense } = await supabaseAdmin
      .from('licenses')
      .select('id')
      .eq('script_id', script_id)
      .eq('theater_company_id', userId)
      .eq('status', 'active')
      .single();

    if (existingLicense) {
      return res.status(400).json({
        error: 'You already have an active license for this script'
      });
    }

    // Calculate amount based on license type
    let amount: number;
    switch (license_type) {
      case 'standard':
        amount = script.standard_price;
        break;
      case 'premium':
        amount = script.premium_price;
        break;
      case 'educational':
        amount = script.educational_price;
        break;
      default:
        amount = script.standard_price;
    }

    // Convert to cents for Stripe
    const amountInCents = Math.round(amount * 100);

    // Create or get Stripe customer
    let stripeCustomerId = profile.stripe_customer_id;
    
    if (!stripeCustomerId) {
      const customer = await paymentService.createCustomer(
        profile.email,
        `${profile.first_name} ${profile.last_name}`,
        profile.id
      );
      
      stripeCustomerId = customer.id;
      
      // Update profile with Stripe customer ID
      await supabaseAdmin
        .from('profiles')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', userId);
    }

    // Create payment intent
    const paymentIntent = await paymentService.createPaymentIntent(
      amountInCents,
      `License for "${script.title}" - ${license_type}`,
      stripeCustomerId,
      {
        script_id,
        license_type,
        theater_company_id: userId,
        playwright_id: script.playwright_id,
        script_title: script.title
      }
    );

    // Create a pending license record
    const { data: pendingLicense, error: licenseError } = await supabaseAdmin
      .from('licenses')
      .insert({
        script_id,
        theater_company_id: userId,
        theater_company_name: profile.company_name || `${profile.first_name} ${profile.last_name}`,
        type: license_type,
        purchase_price: amount,
        payment_intent_id: paymentIntent.id,
        status: 'pending'
      })
      .select()
      .single();

    if (licenseError) {
      logger.error('Error creating pending license:', licenseError);
      throw new Error('Failed to create license record');
    }

    res.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
      license_id: pendingLicense.id,
      amount: amount,
      currency: 'usd'
    });

  } catch (error) {
    next(error);
  }
}

export async function confirmPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const { payment_intent_id } = req.params;
    const userId = req.user!.id;

    if (!payment_intent_id) {
      return res.status(400).json({ error: 'Payment intent ID required' });
    }

    // Verify the license belongs to this user
    const { data: license, error: licenseError } = await supabaseAdmin
      .from('licenses')
      .select('*')
      .eq('payment_intent_id', payment_intent_id)
      .eq('theater_company_id', userId)
      .single();

    if (licenseError || !license) {
      return res.status(404).json({ error: 'License not found' });
    }

    // Get payment intent status from Stripe
    const paymentIntent = await paymentService.confirmPaymentIntent(payment_intent_id);

    if (paymentIntent.status === 'succeeded' && license.status === 'pending') {
      // Update license status
      const { error: updateError } = await supabaseAdmin
        .from('licenses')
        .update({ 
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', license.id);

      if (updateError) {
        logger.error('Error updating license status:', updateError);
        throw new Error('Failed to activate license');
      }

      // Create transaction record
      const platformFee = license.purchase_price * 0.15; // 15% platform fee
      const playwrightEarnings = license.purchase_price * 0.85;

      const { error: transactionError } = await supabaseAdmin
        .from('transactions')
        .insert({
          license_id: license.id,
          amount: license.purchase_price,
          platform_fee: platformFee,
          playwright_earnings: playwrightEarnings,
          payment_method: 'stripe',
          stripe_payment_intent_id: payment_intent_id,
          status: 'completed'
        });

      if (transactionError) {
        logger.error('Error creating transaction:', transactionError);
      }
    }

    res.json({
      status: paymentIntent.status,
      license_status: paymentIntent.status === 'succeeded' ? 'active' : license.status
    });

  } catch (error) {
    next(error);
  }
}

export async function handleStripeWebhook(req: Request, res: Response) {
  try {
    const sig = req.headers['stripe-signature'] as string;
    
    if (!sig) {
      return res.status(400).json({ error: 'No stripe signature' });
    }

    const event = await paymentService.handleWebhook(req.body, sig);
    
    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as any;
        
        // Find and update the license
        const { data: license, error: licenseError } = await supabaseAdmin
          .from('licenses')
          .select('*')
          .eq('payment_intent_id', paymentIntent.id)
          .single();

        if (license && license.status === 'pending') {
          // Update license status
          await supabaseAdmin
            .from('licenses')
            .update({ 
              status: 'active',
              updated_at: new Date().toISOString()
            })
            .eq('id', license.id);

          // Create transaction record
          const platformFee = license.purchase_price * 0.15;
          const playwrightEarnings = license.purchase_price * 0.85;

          await supabaseAdmin
            .from('transactions')
            .insert({
              license_id: license.id,
              amount: license.purchase_price,
              platform_fee: platformFee,
              playwright_earnings: playwrightEarnings,
              payment_method: 'stripe',
              stripe_payment_intent_id: paymentIntent.id,
              status: 'completed'
            });

          logger.info(`License ${license.id} activated via webhook`);
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as any;
        
        // Update license status to failed
        await supabaseAdmin
          .from('licenses')
          .update({ 
            status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('payment_intent_id', failedPayment.id);

        logger.info(`Payment failed for intent ${failedPayment.id}`);
        break;

      default:
        logger.info(`Unhandled webhook event type: ${event.type}`);
    }

    res.json({ received: true });

  } catch (error) {
    logger.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
}

export async function getPaymentHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { limit = 50, offset = 0 } = req.query;

    // Get user profile to determine role
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    let query = supabaseAdmin
      .from('transactions')
      .select(`
        *,
        licenses!inner(
          id,
          type,
          scripts(title, playwright_id),
          theater_company_id
        )
      `)
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    // Filter based on role
    if (profile.role === 'theater_company') {
      query = query.eq('licenses.theater_company_id', userId);
    } else if (profile.role === 'playwright') {
      query = query.eq('licenses.scripts.playwright_id', userId);
    }

    const { data: transactions, error, count } = await query;

    if (error) {
      logger.error('Error fetching payment history:', error);
      throw new Error('Failed to fetch payment history');
    }

    res.json({
      transactions: transactions || [],
      total: count || 0,
      limit: Number(limit),
      offset: Number(offset)
    });

  } catch (error) {
    next(error);
  }
}