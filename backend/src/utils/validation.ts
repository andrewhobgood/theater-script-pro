import Joi from 'joi';

// Auth validation schemas
export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  first_name: Joi.string().min(1).max(100).required(),
  last_name: Joi.string().min(1).max(100).required(),
  role: Joi.string().valid('playwright', 'theater_company').required(),
  company_name: Joi.when('role', {
    is: 'theater_company',
    then: Joi.string().min(1).max(200).required(),
    otherwise: Joi.optional(),
  }),
  is_educational: Joi.when('role', {
    is: 'theater_company',
    then: Joi.boolean().optional(),
    otherwise: Joi.optional(),
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  token: Joi.string().length(6).required(),
});

// Profile validation schemas
export const updateProfileSchema = Joi.object({
  first_name: Joi.string().min(1).max(100).optional(),
  last_name: Joi.string().min(1).max(100).optional(),
  bio: Joi.string().max(1000).optional(),
  website: Joi.string().uri().optional().allow(''),
  location: Joi.object({
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    country: Joi.string().optional(),
  }).optional(),
  social_media: Joi.object({
    twitter: Joi.string().optional().allow(''),
    facebook: Joi.string().optional().allow(''),
    instagram: Joi.string().optional().allow(''),
    linkedin: Joi.string().optional().allow(''),
  }).optional(),
  specialties: Joi.array().items(Joi.string()).optional(),
  awards: Joi.array().items(Joi.string()).optional(),
  company_name: Joi.string().min(1).max(200).optional(),
  year_founded: Joi.number().min(1800).max(new Date().getFullYear()).optional(),
  venue_capacity: Joi.number().min(1).max(100000).optional(),
  is_educational: Joi.boolean().optional(),
});

// Script validation schemas
export const createScriptSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().min(10).max(500).required(),
  synopsis: Joi.string().min(50).max(2000).required(),
  genre: Joi.string().min(1).max(50).required(),
  cast_size_min: Joi.number().min(1).max(100).required(),
  cast_size_max: Joi.number().min(Joi.ref('cast_size_min')).max(100).required(),
  duration_minutes: Joi.number().min(1).max(480).required(),
  language: Joi.string().default('English'),
  age_rating: Joi.string().valid('G', 'PG', 'PG-13', 'R', 'NR').required(),
  themes: Joi.array().items(Joi.string()).max(10).optional(),
  technical_requirements: Joi.object().optional(),
  awards: Joi.array().items(Joi.string()).optional(),
  premiere_date: Joi.date().optional(),
  premiere_venue: Joi.string().optional(),
  standard_price: Joi.number().min(0).max(10000).required(),
  premium_price: Joi.number().min(0).max(10000).required(),
  educational_price: Joi.number().min(0).max(10000).required(),
});

export const updateScriptSchema = createScriptSchema.fork(
  Object.keys(createScriptSchema.describe().keys),
  (schema) => schema.optional()
);

// License validation schemas
export const createLicenseSchema = Joi.object({
  script_id: Joi.string().uuid().required(),
  license_type: Joi.string().valid('standard', 'premium', 'educational').required(),
  performance_dates: Joi.array().items(
    Joi.object({
      date: Joi.date().required(),
      time: Joi.string().optional(),
    })
  ).min(1).required(),
  venue_name: Joi.string().min(1).max(200).required(),
  venue_capacity: Joi.number().min(1).max(100000).required(),
  special_terms: Joi.string().max(1000).optional(),
});

// Validation middleware
export function validate(schema: Joi.Schema) {
  return (req: any, res: any, next: any) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          details: errors,
        },
      });
    }
    
    next();
  };
}