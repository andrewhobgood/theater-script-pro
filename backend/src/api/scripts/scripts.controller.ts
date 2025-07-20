import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../services/supabase';
import { AppError } from '../../middleware/errorHandler';
import { logger } from '../../utils/logger';

export async function getScripts(req: Request, res: Response, next: NextFunction) {
  try {
    const { 
      genre, 
      min_cast, 
      max_cast,
      min_duration,
      max_duration,
      max_price,
      limit = 20, 
      offset = 0,
      sort = 'created_at',
      order = 'desc'
    } = req.query;

    let query = supabaseAdmin
      .from('scripts')
      .select(`
        *,
        profiles!scripts_playwright_id_fkey (
          id,
          first_name,
          last_name
        )
      `, { count: 'exact' })
      .eq('status', 'published');

    // Apply filters
    if (genre) {
      query = query.eq('genre', genre);
    }
    if (min_cast) {
      query = query.gte('cast_size_min', Number(min_cast));
    }
    if (max_cast) {
      query = query.lte('cast_size_max', Number(max_cast));
    }
    if (min_duration) {
      query = query.gte('duration_minutes', Number(min_duration));
    }
    if (max_duration) {
      query = query.lte('duration_minutes', Number(max_duration));
    }
    if (max_price) {
      query = query.lte('standard_price', Number(max_price));
    }

    // Apply sorting
    const validSortFields = ['created_at', 'title', 'standard_price', 'average_rating'];
    const sortField = validSortFields.includes(sort as string) ? sort : 'created_at';
    query = query.order(sortField as any, { ascending: order === 'asc' });

    // Apply pagination
    query = query.range(Number(offset), Number(offset) + Number(limit) - 1);

    const { data, error, count } = await query;

    if (error) {
      logger.error('Error fetching scripts:', error);
      throw new AppError('Failed to fetch scripts', 500);
    }

    res.json({
      scripts: data || [],
      total: count || 0,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    next(error);
  }
}

export async function getScript(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const { data: script, error } = await supabaseAdmin
      .from('scripts')
      .select(`
        *,
        profiles!scripts_playwright_id_fkey (
          id,
          first_name,
          last_name,
          bio,
          awards
        )
      `)
      .eq('id', id)
      .single();

    if (error || !script) {
      throw new AppError('Script not found', 404);
    }

    // Only show published scripts to non-owners
    if (script.status !== 'published') {
      if (!req.profile || req.profile.id !== script.playwright_id) {
        throw new AppError('Script not found', 404);
      }
    }

    // Increment view count if not the owner
    if (!req.profile || req.profile.id !== script.playwright_id) {
      await supabaseAdmin
        .from('scripts')
        .update({ view_count: script.view_count + 1 })
        .eq('id', id);
    }

    res.json(script);
  } catch (error) {
    next(error);
  }
}

export async function createScript(req: Request, res: Response, next: NextFunction) {
  try {
    const playwrightId = req.profile!.id;
    const scriptData = req.body;

    const { data, error } = await supabaseAdmin
      .from('scripts')
      .insert([{
        ...scriptData,
        playwright_id: playwrightId,
        status: 'draft',
      }])
      .select()
      .single();

    if (error) {
      logger.error('Error creating script:', error);
      throw new AppError('Failed to create script', 500);
    }

    res.status(201).json({
      message: 'Script created successfully',
      script: data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateScript(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const playwrightId = req.profile!.id;
    const updates = req.body;

    // Check ownership
    const { data: existingScript } = await supabaseAdmin
      .from('scripts')
      .select('playwright_id')
      .eq('id', id)
      .single();

    if (!existingScript || existingScript.playwright_id !== playwrightId) {
      throw new AppError('Script not found or access denied', 404);
    }

    // Remove fields that shouldn't be updated
    delete updates.id;
    delete updates.playwright_id;
    delete updates.created_at;
    delete updates.view_count;
    delete updates.download_count;
    delete updates.average_rating;
    delete updates.total_reviews;

    const { data, error } = await supabaseAdmin
      .from('scripts')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Error updating script:', error);
      throw new AppError('Failed to update script', 500);
    }

    res.json({
      message: 'Script updated successfully',
      script: data,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteScript(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const playwrightId = req.profile!.id;

    // Check ownership and if script has active licenses
    const { data: script } = await supabaseAdmin
      .from('scripts')
      .select('playwright_id')
      .eq('id', id)
      .single();

    if (!script || script.playwright_id !== playwrightId) {
      throw new AppError('Script not found or access denied', 404);
    }

    // Check for active licenses
    const { data: activeLicenses } = await supabaseAdmin
      .from('licenses')
      .select('id')
      .eq('script_id', id)
      .eq('status', 'active')
      .limit(1);

    if (activeLicenses && activeLicenses.length > 0) {
      throw new AppError('Cannot delete script with active licenses', 400);
    }

    // Soft delete by changing status
    const { error } = await supabaseAdmin
      .from('scripts')
      .update({ 
        status: 'archived',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      logger.error('Error deleting script:', error);
      throw new AppError('Failed to delete script', 500);
    }

    res.json({
      message: 'Script archived successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyScripts(req: Request, res: Response, next: NextFunction) {
  try {
    const playwrightId = req.profile!.id;
    const { status, limit = 20, offset = 0 } = req.query;

    let query = supabaseAdmin
      .from('scripts')
      .select('*', { count: 'exact' })
      .eq('playwright_id', playwrightId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query
      .range(Number(offset), Number(offset) + Number(limit) - 1)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching playwright scripts:', error);
      throw new AppError('Failed to fetch scripts', 500);
    }

    res.json({
      scripts: data || [],
      total: count || 0,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    next(error);
  }
}

export async function publishScript(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const playwrightId = req.profile!.id;

    const { data, error } = await supabaseAdmin
      .from('scripts')
      .update({ 
        status: 'published',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('playwright_id', playwrightId)
      .select()
      .single();

    if (error || !data) {
      throw new AppError('Script not found or access denied', 404);
    }

    res.json({
      message: 'Script published successfully',
      script: data,
    });
  } catch (error) {
    next(error);
  }
}

export async function unpublishScript(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const playwrightId = req.profile!.id;

    const { data, error } = await supabaseAdmin
      .from('scripts')
      .update({ 
        status: 'draft',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('playwright_id', playwrightId)
      .select()
      .single();

    if (error || !data) {
      throw new AppError('Script not found or access denied', 404);
    }

    res.json({
      message: 'Script unpublished successfully',
      script: data,
    });
  } catch (error) {
    next(error);
  }
}

export async function searchScripts(req: Request, res: Response, next: NextFunction) {
  try {
    const { q, limit = 20, offset = 0 } = req.query;

    if (!q) {
      throw new AppError('Search query required', 400);
    }

    const { data, error, count } = await supabaseAdmin
      .from('scripts')
      .select(`
        *,
        profiles!scripts_playwright_id_fkey (
          id,
          first_name,
          last_name
        )
      `, { count: 'exact' })
      .eq('status', 'published')
      .or(`title.ilike.%${q}%,description.ilike.%${q}%,synopsis.ilike.%${q}%`)
      .range(Number(offset), Number(offset) + Number(limit) - 1)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error searching scripts:', error);
      throw new AppError('Search failed', 500);
    }

    res.json({
      scripts: data || [],
      total: count || 0,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    next(error);
  }
}

export async function getScriptReviews(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const { data, error, count } = await supabaseAdmin
      .from('reviews')
      .select(`
        *,
        profiles!reviews_reviewer_id_fkey (
          id,
          first_name,
          last_name,
          company_name
        )
      `, { count: 'exact' })
      .eq('script_id', id)
      .range(Number(offset), Number(offset) + Number(limit) - 1)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching reviews:', error);
      throw new AppError('Failed to fetch reviews', 500);
    }

    res.json({
      reviews: data || [],
      total: count || 0,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    next(error);
  }
}

export async function createReview(req: Request, res: Response, next: NextFunction) {
  try {
    const { id: scriptId } = req.params;
    const reviewerId = req.profile!.id;
    const { rating, title, comment } = req.body;

    // Check if user has a license for this script
    const { data: license } = await supabaseAdmin
      .from('licenses')
      .select('id')
      .eq('script_id', scriptId)
      .eq('licensee_id', reviewerId)
      .eq('status', 'active')
      .single();

    if (!license) {
      throw new AppError('You must have an active license to review this script', 403);
    }

    // Check if already reviewed
    const { data: existingReview } = await supabaseAdmin
      .from('reviews')
      .select('id')
      .eq('script_id', scriptId)
      .eq('reviewer_id', reviewerId)
      .single();

    if (existingReview) {
      throw new AppError('You have already reviewed this script', 400);
    }

    // Create review
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .insert([{
        script_id: scriptId,
        reviewer_id: reviewerId,
        rating,
        title,
        comment,
        is_verified_purchase: true,
      }])
      .select()
      .single();

    if (error) {
      logger.error('Error creating review:', error);
      throw new AppError('Failed to create review', 500);
    }

    // Update script average rating
    const { data: reviews } = await supabaseAdmin
      .from('reviews')
      .select('rating')
      .eq('script_id', scriptId);

    if (reviews) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      
      await supabaseAdmin
        .from('scripts')
        .update({
          average_rating: avgRating,
          total_reviews: reviews.length,
        })
        .eq('id', scriptId);
    }

    res.status(201).json({
      message: 'Review created successfully',
      review: data,
    });
  } catch (error) {
    next(error);
  }
}