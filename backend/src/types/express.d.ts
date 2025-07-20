import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'playwright' | 'theater_company' | 'admin';
  is_verified: boolean;
  company_name?: string;
  is_educational?: boolean;
  created_at: string;
  updated_at: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
      profile?: UserProfile;
    }
  }
}