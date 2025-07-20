import { createClient } from '@supabase/supabase-js';
import { config } from '../config';
import { logger } from '../utils/logger';

// Create Supabase client with service role key for backend operations
export const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Helper function to get user from JWT token
export async function getUserFromToken(token: string) {
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error) {
      logger.error('Error verifying token:', error);
      return null;
    }
    
    return user;
  } catch (error) {
    logger.error('Error in getUserFromToken:', error);
    return null;
  }
}

// Helper function to get user profile with role
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      logger.error('Error fetching user profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    logger.error('Error in getUserProfile:', error);
    return null;
  }
}

// Helper function to create user profile
export async function createUserProfile(userData: {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'playwright' | 'theater_company' | 'admin';
  company_name?: string;
  is_educational?: boolean;
}) {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .insert([userData])
      .select()
      .single();
    
    if (error) {
      logger.error('Error creating user profile:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    logger.error('Error in createUserProfile:', error);
    throw error;
  }
}