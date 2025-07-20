import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../services/supabase';
import { AppError } from '../../middleware/errorHandler';
import { logger } from '../../utils/logger';

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const profile = req.profile!;

    // Get additional data based on role
    let additionalData = {};

    if (profile.role === 'playwright') {
      const { data: scripts } = await supabaseAdmin
        .from('scripts')
        .select('id, title, status, created_at')
        .eq('playwright_id', profile.id)
        .order('created_at', { ascending: false });

      additionalData = { scripts: scripts || [] };
    } else if (profile.role === 'theater_company') {
      const { data: licenses } = await supabaseAdmin
        .from('licenses')
        .select('id, script_id, license_type, status, created_at')
        .eq('licensee_id', profile.id)
        .order('created_at', { ascending: false });

      additionalData = { licenses: licenses || [] };
    }

    res.json({
      profile,
      ...additionalData,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const profileId = req.profile!.id;
    const updates = req.body;

    // Remove fields that shouldn't be updated
    delete updates.id;
    delete updates.user_id;
    delete updates.email;
    delete updates.role;
    delete updates.created_at;

    // Update profile
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profileId)
      .select()
      .single();

    if (error) {
      logger.error('Error updating profile:', error);
      throw new AppError('Failed to update profile', 500);
    }

    res.json({
      message: 'Profile updated successfully',
      profile: data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPublicProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    // Get profile
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select(`
        id,
        first_name,
        last_name,
        role,
        bio,
        website,
        location,
        social_media,
        specialties,
        awards,
        company_name,
        year_founded,
        is_educational,
        created_at
      `)
      .eq('id', id)
      .single();

    if (error || !profile) {
      throw new AppError('Profile not found', 404);
    }

    // Get public data based on role
    let additionalData = {};

    if (profile.role === 'playwright') {
      const { data: scripts } = await supabaseAdmin
        .from('scripts')
        .select(`
          id,
          title,
          description,
          genre,
          cast_size_min,
          cast_size_max,
          duration_minutes,
          themes,
          standard_price,
          premium_price,
          educational_price,
          average_rating,
          total_reviews
        `)
        .eq('playwright_id', id)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      additionalData = { scripts: scripts || [] };
    }

    res.json({
      profile,
      ...additionalData,
    });
  } catch (error) {
    next(error);
  }
}

export async function searchUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const { 
      q, 
      role, 
      limit = 20, 
      offset = 0 
    } = req.query;

    let query = supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact' });

    // Apply filters
    if (role) {
      query = query.eq('role', role);
    }

    if (q) {
      query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,company_name.ilike.%${q}%`);
    }

    // Apply pagination
    query = query
      .range(Number(offset), Number(offset) + Number(limit) - 1)
      .order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      logger.error('Error searching users:', error);
      throw new AppError('Search failed', 500);
    }

    res.json({
      users: data || [],
      total: count || 0,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    next(error);
  }
}

export async function getPlaywrights(req: Request, res: Response, next: NextFunction) {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const { data, error, count } = await supabaseAdmin
      .from('profiles')
      .select(`
        id,
        first_name,
        last_name,
        bio,
        specialties,
        awards,
        location
      `, { count: 'exact' })
      .eq('role', 'playwright')
      .eq('is_verified', true)
      .range(Number(offset), Number(offset) + Number(limit) - 1)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching playwrights:', error);
      throw new AppError('Failed to fetch playwrights', 500);
    }

    res.json({
      playwrights: data || [],
      total: count || 0,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    next(error);
  }
}

export async function getTheaterCompanies(req: Request, res: Response, next: NextFunction) {
  try {
    const { limit = 20, offset = 0, is_educational } = req.query;

    let query = supabaseAdmin
      .from('profiles')
      .select(`
        id,
        company_name,
        bio,
        location,
        year_founded,
        venue_capacity,
        is_educational
      `, { count: 'exact' })
      .eq('role', 'theater_company')
      .eq('is_verified', true);

    if (is_educational !== undefined) {
      query = query.eq('is_educational', is_educational === 'true');
    }

    const { data, error, count } = await query
      .range(Number(offset), Number(offset) + Number(limit) - 1)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching theater companies:', error);
      throw new AppError('Failed to fetch theater companies', 500);
    }

    res.json({
      companies: data || [],
      total: count || 0,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    next(error);
  }
}