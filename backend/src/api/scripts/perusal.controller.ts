import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../services/supabase';
import { AppError } from '../../middleware/errorHandler';
import { logger } from '../../utils/logger';
import { addPerusalWatermark } from '../../services/pdf-watermark';
import { storageService } from '../../services/storage';

export async function requestPerusal(req: Request, res: Response, next: NextFunction) {
  try {
    const { id: scriptId } = req.params;
    const requesterId = req.profile!.id;
    const { company_name, purpose } = req.body;

    // Verify script exists and is published
    const { data: script, error: scriptError } = await supabaseAdmin
      .from('scripts')
      .select('id, title, perusal_url, playwright_id')
      .eq('id', scriptId)
      .eq('status', 'published')
      .single();

    if (scriptError || !script) {
      throw new AppError('Script not found or not available', 404);
    }

    if (!script.perusal_url) {
      throw new AppError('Perusal copy not available for this script', 404);
    }

    // Create perusal request record
    const { data: perusaRequest, error: requestError } = await supabaseAdmin
      .from('perusal_requests')
      .insert([{
        script_id: scriptId,
        requester_id: requesterId,
        company_name: company_name || req.profile!.company_name,
        purpose,
        status: 'approved', // Auto-approve for now
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      }])
      .select()
      .single();

    if (requestError) {
      logger.error('Error creating perusal request:', requestError);
      throw new AppError('Failed to create perusal request', 500);
    }

    res.json({
      request_id: perusaRequest.id,
      expires_at: perusaRequest.expires_at,
      message: 'Perusal request approved. You can now download the perusal script.',
    });
  } catch (error) {
    next(error);
  }
}

export async function downloadPerusal(req: Request, res: Response, next: NextFunction) {
  try {
    const { requestId } = req.params;
    const requesterId = req.profile!.id;

    // Verify perusal request
    const { data: perusaRequest, error: requestError } = await supabaseAdmin
      .from('perusal_requests')
      .select(`
        *,
        scripts (
          id,
          title,
          perusal_url
        )
      `)
      .eq('id', requestId)
      .eq('requester_id', requesterId)
      .single();

    if (requestError || !perusaRequest) {
      throw new AppError('Perusal request not found', 404);
    }

    if (perusaRequest.status !== 'approved') {
      throw new AppError('Perusal request not approved', 403);
    }

    // Check if request has expired
    if (new Date(perusaRequest.expires_at) < new Date()) {
      throw new AppError('Perusal request has expired', 403);
    }

    if (!perusaRequest.scripts.perusal_url) {
      throw new AppError('Perusal script not available', 404);
    }

    try {
      // Download the perusal PDF from S3
      const perusaPdfBuffer = await storageService.downloadFile(
        perusaRequest.scripts.perusal_url
      );

      // Get requester profile
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('company_name, email')
        .eq('id', requesterId)
        .single();

      // Add perusal watermark
      const watermarkedPdf = await addPerusalWatermark(
        perusaPdfBuffer,
        profile?.company_name || perusaRequest.company_name || 'Unknown Theater',
        profile?.email || 'unknown@example.com'
      );

      // Generate a unique filename
      const filename = `${perusaRequest.scripts.title.replace(/[^a-z0-9]/gi, '_')}_perusal_${requestId}.pdf`;

      // Upload watermarked PDF to temporary storage
      const tempUrl = await storageService.uploadTemporaryFile(
        watermarkedPdf,
        filename,
        'application/pdf',
        3600 // 1 hour expiry
      );

      // Log download
      await supabaseAdmin
        .from('perusal_downloads')
        .insert([{
          request_id: requestId,
          downloaded_at: new Date().toISOString(),
          ip_address: req.ip,
        }]);

      // Update download count
      await supabaseAdmin
        .from('perusal_requests')
        .update({
          download_count: (perusaRequest.download_count || 0) + 1,
          last_downloaded_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      res.json({
        download_url: tempUrl,
        expires_in: 3600, // 1 hour
        script_title: perusaRequest.scripts.title,
        filename: filename,
        watermark_notice: 'This perusal copy is watermarked and not for performance.',
      });
    } catch (storageError) {
      logger.error('Error processing perusal download:', storageError);
      throw new AppError('Failed to process perusal script', 500);
    }
  } catch (error) {
    next(error);
  }
}

export async function getMyPerusalRequests(req: Request, res: Response, next: NextFunction) {
  try {
    const requesterId = req.profile!.id;
    const { status, limit = 20, offset = 0 } = req.query;

    let query = supabaseAdmin
      .from('perusal_requests')
      .select(`
        *,
        scripts (
          id,
          title,
          genre,
          profiles!scripts_playwright_id_fkey (
            first_name,
            last_name
          )
        )
      `, { count: 'exact' })
      .eq('requester_id', requesterId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query
      .range(Number(offset), Number(offset) + Number(limit) - 1)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching perusal requests:', error);
      throw new AppError('Failed to fetch perusal requests', 500);
    }

    res.json({
      requests: data || [],
      total: count || 0,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    next(error);
  }
}