import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../services/supabase';
import { AppError } from '../../middleware/errorHandler';
import { logger } from '../../utils/logger';
import { createPaymentIntent } from '../../services/payment';
import { sendLicenseConfirmation, sendNewLicenseNotification } from '../../services/email';
import { addLicenseWatermark } from '../../services/pdf-watermark';
import { storageService } from '../../services/storage';

export async function createLicense(req: Request, res: Response, next: NextFunction) {
  try {
    const licenseeId = req.profile!.id;
    const { script_id, license_type, performance_dates, venue_name, venue_capacity, special_terms } = req.body;

    // Get script details and pricing
    const { data: script, error: scriptError } = await supabaseAdmin
      .from('scripts')
      .select('*, profiles!scripts_playwright_id_fkey (id, first_name, last_name)')
      .eq('id', script_id)
      .eq('status', 'published')
      .single();

    if (scriptError || !script) {
      throw new AppError('Script not found or not available for licensing', 404);
    }

    // Check if theater company is educational for pricing
    const isEducational = req.profile!.is_educational && license_type === 'educational';
    
    // Determine price based on license type
    let price: number;
    if (license_type === 'premium') {
      price = script.premium_price;
    } else if (isEducational) {
      price = script.educational_price;
    } else {
      price = script.standard_price;
    }

    // TODO: Create Stripe payment intent
    // const paymentIntent = await createPaymentIntent(price, script.title, licenseeId);

    // For now, create license directly (payment integration pending)
    const licenseData = {
      script_id,
      licensee_id: licenseeId,
      license_type: isEducational ? 'educational' : license_type,
      status: 'active',
      purchase_price: price,
      performance_dates,
      venue_name,
      venue_capacity,
      special_terms,
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
    };

    const { data: license, error: licenseError } = await supabaseAdmin
      .from('licenses')
      .insert([licenseData])
      .select()
      .single();

    if (licenseError) {
      logger.error('Error creating license:', licenseError);
      throw new AppError('Failed to create license', 500);
    }

    // Create transaction record
    await supabaseAdmin
      .from('transactions')
      .insert([{
        license_id: license.id,
        playwright_id: script.playwright_id,
        theater_company_id: licenseeId,
        script_id: script.id,
        amount: price,
        platform_fee: price * 0.15, // 15% platform fee
        playwright_earnings: price * 0.85,
        payment_method: 'stripe',
        // stripe_payment_intent_id: paymentIntent.id,
        status: 'completed',
      }]);

    // Update script download count
    await supabaseAdmin
      .from('scripts')
      .update({ download_count: script.download_count + 1 })
      .eq('id', script_id);

    // Send confirmation emails
    try {
      // Email to theater company
      await sendLicenseConfirmation(
        req.profile!.email,
        req.profile!.company_name || `${req.profile!.first_name} ${req.profile!.last_name}`,
        script.title,
        `${script.profiles.first_name} ${script.profiles.last_name}`,
        license_type,
        performance_dates
      );

      // Email to playwright
      const { data: playwrightProfile } = await supabaseAdmin
        .from('profiles')
        .select('email, first_name')
        .eq('id', script.playwright_id)
        .single();

      if (playwrightProfile) {
        await sendNewLicenseNotification(
          playwrightProfile.email,
          playwrightProfile.first_name,
          script.title,
          req.profile!.company_name || 'A theater company',
          price
        );
      }
    } catch (emailError) {
      logger.error('Failed to send license emails:', emailError);
      // Don't fail the license creation if emails fail
    }

    res.status(201).json({
      message: 'License created successfully',
      license,
      script: {
        title: script.title,
        playwright: script.profiles,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyLicenses(req: Request, res: Response, next: NextFunction) {
  try {
    const licenseeId = req.profile!.id;
    const { status, limit = 20, offset = 0 } = req.query;

    let query = supabaseAdmin
      .from('licenses')
      .select(`
        *,
        scripts (
          id,
          title,
          genre,
          duration_minutes,
          cast_size_min,
          cast_size_max,
          profiles!scripts_playwright_id_fkey (
            id,
            first_name,
            last_name
          )
        )
      `, { count: 'exact' })
      .eq('licensee_id', licenseeId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query
      .range(Number(offset), Number(offset) + Number(limit) - 1)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching licenses:', error);
      throw new AppError('Failed to fetch licenses', 500);
    }

    res.json({
      licenses: data || [],
      total: count || 0,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    next(error);
  }
}

export async function getLicense(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.profile!.id;

    const { data: license, error } = await supabaseAdmin
      .from('licenses')
      .select(`
        *,
        scripts (
          id,
          title,
          description,
          synopsis,
          genre,
          duration_minutes,
          cast_size_min,
          cast_size_max,
          technical_requirements,
          profiles!scripts_playwright_id_fkey (
            id,
            first_name,
            last_name,
            email
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error || !license) {
      throw new AppError('License not found', 404);
    }

    // Check access rights
    const hasAccess = 
      license.licensee_id === userId || 
      license.scripts.playwright_id === userId ||
      req.profile!.role === 'admin';

    if (!hasAccess) {
      throw new AppError('Access denied', 403);
    }

    res.json(license);
  } catch (error) {
    next(error);
  }
}

export async function getLicenses(req: Request, res: Response, next: NextFunction) {
  try {
    const playwrightId = req.profile!.id;
    const { script_id, status, limit = 20, offset = 0 } = req.query;

    // Get playwright's scripts
    const { data: scriptIds } = await supabaseAdmin
      .from('scripts')
      .select('id')
      .eq('playwright_id', playwrightId);

    if (!scriptIds || scriptIds.length === 0) {
      return res.json({
        licenses: [],
        total: 0,
        limit: Number(limit),
        offset: Number(offset),
      });
    }

    let query = supabaseAdmin
      .from('licenses')
      .select(`
        *,
        scripts (
          id,
          title
        ),
        profiles!licenses_licensee_id_fkey (
          id,
          company_name,
          location
        )
      `, { count: 'exact' })
      .in('script_id', scriptIds.map(s => s.id));

    if (script_id) {
      query = query.eq('script_id', script_id);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query
      .range(Number(offset), Number(offset) + Number(limit) - 1)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching playwright licenses:', error);
      throw new AppError('Failed to fetch licenses', 500);
    }

    res.json({
      licenses: data || [],
      total: count || 0,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    next(error);
  }
}

export async function downloadScript(req: Request, res: Response, next: NextFunction) {
  try {
    const { id: licenseId } = req.params;
    const licenseeId = req.profile!.id;

    // Verify license ownership and status
    const { data: license, error } = await supabaseAdmin
      .from('licenses')
      .select(`
        *,
        scripts (
          id,
          title,
          file_url,
          perusal_url
        ),
        profiles!licenses_licensee_id_fkey (
          company_name,
          email
        )
      `)
      .eq('id', licenseId)
      .eq('licensee_id', licenseeId)
      .single();

    if (error || !license) {
      throw new AppError('License not found', 404);
    }

    if (license.status !== 'active') {
      throw new AppError('License is not active', 403);
    }

    // Check if license has expired
    if (license.expires_at && new Date(license.expires_at) < new Date()) {
      throw new AppError('License has expired', 403);
    }

    if (!license.scripts.file_url) {
      throw new AppError('Script file not available', 404);
    }

    try {
      // Download the original PDF from S3
      const originalPdfBuffer = await storageService.downloadFile(
        license.scripts.file_url
      );

      // Add watermark with license information
      const watermarkedPdf = await addLicenseWatermark(originalPdfBuffer, {
        theaterName: license.profiles.company_name || 'Unknown Theater',
        licenseeEmail: license.profiles.email,
        licenseType: license.license_type,
        licenseId: license.id,
        performanceDates: license.performance_dates || [],
      });

      // Generate a unique filename
      const filename = `${license.scripts.title.replace(/[^a-z0-9]/gi, '_')}_licensed_${licenseId}.pdf`;

      // Upload watermarked PDF to temporary storage
      const tempUrl = await storageService.uploadTemporaryFile(
        watermarkedPdf,
        filename,
        'application/pdf',
        3600 // 1 hour expiry
      );

      // Log download
      await supabaseAdmin
        .from('download_logs')
        .insert([{
          license_id: licenseId,
          downloaded_by: licenseeId,
          ip_address: req.ip,
        }]);

      res.json({
        download_url: tempUrl,
        expires_in: 3600, // 1 hour
        script_title: license.scripts.title,
        filename: filename,
      });
    } catch (storageError) {
      logger.error('Error processing script download:', storageError);
      throw new AppError('Failed to process script for download', 500);
    }
  } catch (error) {
    next(error);
  }
}

export async function updatePerformanceDates(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const licenseeId = req.profile!.id;
    const { performance_dates } = req.body;

    // Verify ownership
    const { data, error } = await supabaseAdmin
      .from('licenses')
      .update({
        performance_dates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('licensee_id', licenseeId)
      .select()
      .single();

    if (error || !data) {
      throw new AppError('License not found or access denied', 404);
    }

    res.json({
      message: 'Performance dates updated successfully',
      license: data,
    });
  } catch (error) {
    next(error);
  }
}