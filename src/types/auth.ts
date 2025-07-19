// Authentication and user types for TheaterScript Pro

export type UserRole = 'playwright' | 'theater_company' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  name?: string; // Computed property for display
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlaywrightProfile {
  id: string;
  userId: string;
  bio: string;
  headshot?: string;
  website?: string;
  socialMedia?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  isPublic: boolean;
  specialties: string[];
  awards?: string[];
}

export interface TheaterCompanyProfile {
  id: string;
  userId: string;
  companyName: string;
  description: string;
  logo?: string;
  website?: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  yearFounded?: number;
  venueCapacity?: number;
  isEducational: boolean;
  licenseHistory: string[];
}

export interface AdminProfile {
  id: string;
  userId: string;
  permissions: string[];
  department: string;
}

export interface AuthState {
  user: User | null;
  profile: PlaywrightProfile | TheaterCompanyProfile | AdminProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}