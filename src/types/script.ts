// Script and licensing types for TheaterScript Pro

export interface Script {
  id: string;
  playwrightId: string;
  title: string;
  subtitle?: string;
  description: string;
  genre: string[];
  themes: string[];
  language: string;
  duration: number; // in minutes
  pages: number;
  ageRating: 'G' | 'PG' | 'PG-13' | 'R' | 'Adult';
  publicationYear?: number;
  
  // Cast requirements
  castSize: {
    min: number;
    max: number;
    flexible: boolean;
  };
  characters: Character[];
  
  // Technical requirements
  sets: string[];
  specialRequirements?: string[];
  
  // Files and media
  fullScriptUrl?: string;
  perusaleScriptUrl?: string;
  thumbnail?: string;
  photos?: string[];
  
  // Pricing
  standard_price: number;
  premium_price: number;
  educational_price: number;
  
  // Publishing info
  isPublished: boolean;
  isPublic: boolean;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface Character {
  name: string;
  description: string;
  ageRange: string;
  gender: 'male' | 'female' | 'non-binary' | 'any';
  isLead: boolean;
  voiceType?: 'soprano' | 'alto' | 'tenor' | 'bass' | 'baritone';
}

export interface LicensingOption {
  id: string;
  scriptId: string;
  type: 'standard' | 'educational' | 'professional' | 'extended';
  name: string;
  description: string;
  basePrice: number;
  royaltyPercentage?: number;
  minimumFee?: number;
  currency: string;
  restrictions?: string[];
  includedMaterials: string[];
  duration: number; // days
  isActive: boolean;
}

export interface License {
  id: string;
  scriptId: string;
  licenseOptionId: string;
  theaterCompanyId: string;
  status: 'pending' | 'active' | 'expired' | 'cancelled';
  
  // Performance details
  productionTitle: string;
  venueDetails: {
    name: string;
    address: string;
    capacity: number;
  };
  performanceDates: {
    start: string;
    end: string;
    performances: string[];
  };
  
  // Payment
  totalAmount: number;
  currency: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  stripePaymentId?: string;
  
  // Agreement
  agreementUrl: string;
  signedAt?: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface ProductionReport {
  id: string;
  licenseId: string;
  
  // Attendance data
  totalPerformances: number;
  totalAttendance: number;
  averageAttendance: number;
  soldOutPerformances: number;
  
  // Financial data (optional)
  ticketPrices?: {
    adult: number;
    student: number;
    senior: number;
  };
  totalRevenue?: number;
  
  // Feedback
  audienceRating?: number;
  reviews?: string[];
  photos?: string[];
  
  // Reports
  submittedAt: string;
  isComplete: boolean;
}