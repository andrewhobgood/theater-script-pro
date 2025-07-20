// Mock data for development and testing

import { User, PlaywrightProfile, TheaterCompanyProfile } from '@/types/auth';
import { Script, LicensingOption, License } from '@/types/script';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'shakespeare@theater.com',
    role: 'playwright',
    firstName: 'William',
    lastName: 'Shakespeare',
    isVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'broadway@company.com',
    role: 'theater_company',
    firstName: 'Sarah',
    lastName: 'Director',
    isVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    email: 'admin@theaterscript.com',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    isVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Mock Playwright Profiles
export const mockPlaywrightProfiles: PlaywrightProfile[] = [
  {
    id: '1',
    userId: '1',
    bio: 'Renowned playwright with over 400 years of experience crafting timeless theatrical works. Known for tragedies, comedies, and histories that continue to captivate audiences worldwide.',
    website: 'https://shakespeare.com',
    socialMedia: {
      twitter: '@shakespeare',
      instagram: '@bardlife',
    },
    isPublic: true,
    specialties: ['Drama', 'Comedy', 'Historical Plays', 'Sonnets'],
    awards: ['Nobel Prize in Literature (Honorary)', 'Tony Award for Lifetime Achievement'],
  },
];

// Mock Theater Company Profiles  
export const mockTheaterProfiles: TheaterCompanyProfile[] = [
  {
    id: '1',
    userId: '2',
    companyName: 'Broadway Theater Company',
    description: 'Premier theater company specializing in classical and contemporary works. We bring exceptional storytelling to life through innovative productions.',
    website: 'https://broadwaytheater.com',
    location: {
      city: 'New York',
      state: 'NY',
      country: 'USA',
    },
    yearFounded: 1985,
    venueCapacity: 1200,
    isEducational: false,
    licenseHistory: ['hamlet-2024', 'macbeth-2023'],
  },
];

// Mock Scripts (extended with extra fields for UI)
export const mockScripts: (Script & { playwright: string; difficulty: string; price: number })[] = [
  {
    id: 'hamlet-2024',
    playwrightId: '1',
    title: 'Hamlet',
    subtitle: 'Prince of Denmark',
    description: 'A tragic tale of revenge, madness, and moral corruption in the Danish court. When young Prince Hamlet learns that his father was murdered by his uncle, now king, he must decide between action and inaction.',
    genre: ['Tragedy', 'Drama', 'Classical'],
    themes: ['Revenge', 'Madness', 'Mortality', 'Family', 'Power'],
    language: 'English',
    duration: 180,
    pages: 89,
    ageRating: 'PG-13',
    publicationYear: 1601,
    castSize: {
      min: 8,
      max: 20,
      flexible: true,
    },
    characters: [
      {
        name: 'Hamlet',
        description: 'Prince of Denmark, protagonist torn between duty and doubt',
        ageRange: '25-35',
        gender: 'male',
        isLead: true,
      },
      {
        name: 'Ophelia',
        description: 'Daughter of Polonius, love interest of Hamlet',
        ageRange: '20-30',
        gender: 'female',
        isLead: true,
      },
      {
        name: 'Claudius',
        description: 'King of Denmark, Hamlet\'s uncle and stepfather',
        ageRange: '40-55',
        gender: 'male',
        isLead: true,
      },
    ],
    sets: ['Castle courtyard', 'Throne room', 'Ophelia\'s chamber', 'Graveyard'],
    specialRequirements: ['Sword fighting choreography', 'Ghost effects'],
    standard_price: 125,
    premium_price: 200,
    educational_price: 75,
    isPublished: true,
    isPublic: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    playwright: 'William Shakespeare',
    difficulty: 'Advanced',
    price: 125,
  },
  {
    id: 'romeo-juliet-2024',
    playwrightId: '1',
    title: 'Romeo and Juliet',
    description: 'The ultimate tale of star-crossed lovers whose passionate romance defies the hatred between their feuding families in Renaissance Verona.',
    genre: ['Romance', 'Tragedy', 'Classical'],
    themes: ['Love', 'Family Conflict', 'Youth', 'Fate', 'Death'],
    language: 'English',
    duration: 150,
    pages: 78,
    ageRating: 'PG',
    publicationYear: 1597,
    castSize: {
      min: 10,
      max: 25,
      flexible: true,
    },
    characters: [
      {
        name: 'Romeo',
        description: 'Young Montague, passionate and impulsive lover',
        ageRange: '18-25',
        gender: 'male',
        isLead: true,
      },
      {
        name: 'Juliet',
        description: 'Young Capulet, intelligent and determined',
        ageRange: '16-22',
        gender: 'female',
        isLead: true,
      },
    ],
    sets: ['Verona streets', 'Capulet house', 'Balcony', 'Friar\'s cell', 'Tomb'],
    standard_price: 95,
    premium_price: 165,
    educational_price: 55,
    isPublished: true,
    isPublic: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    playwright: 'William Shakespeare',
    difficulty: 'Intermediate',
    price: 95,
  },
];

// Mock Licensing Options
export const mockLicensingOptions: LicensingOption[] = [
  {
    id: 'hamlet-standard',
    scriptId: 'hamlet-2024',
    type: 'standard',
    name: 'Standard Production License',
    description: 'Full production rights for professional theaters',
    basePrice: 2500,
    royaltyPercentage: 8,
    minimumFee: 500,
    currency: 'USD',
    includedMaterials: ['Full script', 'Production notes', 'Character breakdown'],
    duration: 365,
    isActive: true,
  },
  {
    id: 'hamlet-educational',
    scriptId: 'hamlet-2024',
    type: 'educational',
    name: 'Educational License',
    description: 'Special pricing for schools and educational institutions',
    basePrice: 750,
    currency: 'USD',
    restrictions: ['Non-profit performances only', 'Educational institution required'],
    includedMaterials: ['Full script', 'Study guide', 'Character breakdown'],
    duration: 180,
    isActive: true,
  },
];

// Current mock user (for development)
export const mockCurrentUser: User = mockUsers[0]; // Playwright by default
export const mockCurrentProfile: PlaywrightProfile = mockPlaywrightProfiles[0];