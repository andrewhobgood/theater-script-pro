
# Backend Development Handoff Report

## Project Status Overview

**Frontend Completion:** 95% complete with production-ready UI components
**Backend Status:** Database schema implemented - requires backend service development
**Database Setup:** ✅ Complete - Supabase tables, RLS policies, and storage configured
**Estimated Backend Timeline:** 8-10 weeks for service implementation
**Technology Stack:** Supabase, AWS S3, Stripe, Resend, Sentry

## Database Implementation Status ✅

**Completed Database Setup:**
- ✅ Complete database schema with 5 core tables
- ✅ Row Level Security (RLS) policies implemented
- ✅ Storage buckets configured (scripts, covers, samples, avatars, contracts)
- ✅ Authentication triggers for automatic profile creation
- ✅ Security definer functions to prevent RLS recursion
- ✅ Performance indexes on all key columns
- ✅ Auto-updating timestamps with triggers

**Database Tables Implemented:**
- `public.profiles` - User profile data with role-based fields
- `public.scripts` - Script metadata and file references
- `public.licenses` - Licensing transactions and terms
- `public.reviews` - Script reviews and ratings
- `public.transactions` - Payment and transaction history

## Critical Backend Services Required

### 1. Authentication System (Priority: Critical - Week 1-2)

**Service Requirements:**
- Supabase Auth integration with email/password registration
- OTP email verification through Resend API
- Multi-role user system (Playwright, Theater Company, Admin)
- Session management with secure token refresh
- Row Level Security (RLS) policies for data isolation

**Frontend Integration Points:**
- `src/hooks/useAuth.ts` - Auth state management hook
- `src/pages/Auth.tsx` - Registration and login forms
- `src/types/auth.ts` - TypeScript type definitions

**Database Schema (✅ IMPLEMENTED):**
```sql
-- ✅ COMPLETED: Unified profiles table supporting all user types
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'playwright',
    is_verified BOOLEAN DEFAULT FALSE,
    bio TEXT,
    website TEXT,
    location JSONB DEFAULT '{}',
    social_media JSONB DEFAULT '{}',
    specialties TEXT[] DEFAULT '{}',
    awards TEXT[] DEFAULT '{}',
    -- Theater Company specific fields
    company_name TEXT,
    year_founded INTEGER,
    venue_capacity INTEGER,
    is_educational BOOLEAN DEFAULT FALSE,
    -- Admin specific fields
    permissions TEXT[] DEFAULT '{}',
    department TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ✅ COMPLETED: User roles enum
CREATE TYPE public.user_role AS ENUM ('playwright', 'theater_company', 'admin');

-- ✅ COMPLETED: Auto profile creation trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**API Endpoints Needed:**
- `POST /api/auth/register` - User registration with role selection
- `POST /api/auth/verify-otp` - OTP verification
- `GET /api/auth/profile` - Get user profile data
- `PUT /api/auth/profile` - Update profile information

### 2. Script Management System (Priority: Critical - Week 3-4)

**Service Requirements:**
- AWS S3 integration for secure file storage
- Signed URL generation for time-limited access
- File upload validation and virus scanning
- Metadata extraction and storage
- Perusal script watermarking system

**Frontend Integration Points:**
- `src/components/upload/ScriptUploadWizard.tsx` - Multi-step upload form
- `src/components/scripts/ScriptCard.tsx` - Script display component
- `src/pages/ScriptDetail.tsx` - Individual script pages
- `src/types/script.ts` - Script type definitions

**S3 Bucket Structure:**
```
theaterscriptpro-bucket/
├── scripts/
│   ├── full/
│   │   └── {playwright-id}/
│   │       └── {script-id}/
│   │           ├── script.pdf
│   │           └── metadata.json
│   └── perusal/
│       └── {playwright-id}/
│           └── {script-id}/
│               ├── perusal.pdf
│               └── watermark-config.json
└── temp/
    └── {upload-session-id}/
```

**Database Schema (✅ IMPLEMENTED):**
```sql
-- ✅ COMPLETED: Comprehensive scripts table with metadata
CREATE TABLE public.scripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    playwright_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    synopsis TEXT,
    genre TEXT NOT NULL,
    cast_size_min INTEGER DEFAULT 1,
    cast_size_max INTEGER DEFAULT 50,
    duration_minutes INTEGER,
    language TEXT DEFAULT 'English',
    age_rating TEXT,
    themes TEXT[] DEFAULT '{}',
    technical_requirements JSONB DEFAULT '{}',
    awards TEXT[] DEFAULT '{}',
    premiere_date DATE,
    premiere_venue TEXT,
    file_url TEXT,
    perusal_url TEXT,
    cover_image_url TEXT,
    sample_pages_url TEXT,
    standard_price DECIMAL(10,2) DEFAULT 0,
    premium_price DECIMAL(10,2) DEFAULT 0,
    educational_price DECIMAL(10,2) DEFAULT 0,
    status script_status DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ✅ COMPLETED: Script status enum
CREATE TYPE public.script_status AS ENUM ('draft', 'published', 'archived');

-- ✅ COMPLETED: Storage buckets for file organization
-- Buckets: scripts (private), covers (public), samples (public)
```

**API Endpoints:**
- `POST /api/scripts/upload` - Handle file uploads
- `GET /api/scripts` - List scripts with filtering
- `GET /api/scripts/{id}` - Get individual script details
- `POST /api/scripts/{id}/access` - Generate signed download URLs
- `PUT /api/scripts/{id}` - Update script metadata

### 3. Licensing & Payment System (Priority: Critical - Week 5-6)

**Service Requirements:**
- Stripe integration for payment processing
- Webhook handling for payment confirmations
- License generation and validation
- Educational pricing tier management
- Revenue tracking and analytics

**Frontend Integration Points:**
- `src/components/checkout/CheckoutFlow.tsx` - Payment interface
- `src/components/licensing/LicenseManagement.tsx` - License dashboard
- `src/components/transactions/TransactionHistory.tsx` - Payment history

**Database Schema (✅ IMPLEMENTED):**
```sql
-- ✅ COMPLETED: Comprehensive licensing table
CREATE TABLE public.licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    script_id UUID REFERENCES public.scripts(id) ON DELETE CASCADE NOT NULL,
    licensee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    license_type license_type NOT NULL,
    status license_status DEFAULT 'active',
    purchase_price DECIMAL(10,2) NOT NULL,
    performance_dates JSONB DEFAULT '[]',
    venue_name TEXT,
    venue_capacity INTEGER,
    special_terms TEXT,
    signed_contract_url TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ✅ COMPLETED: Transaction tracking table
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    script_id UUID REFERENCES public.scripts(id) ON DELETE CASCADE,
    license_id UUID REFERENCES public.licenses(id) ON DELETE SET NULL,
    stripe_payment_intent_id TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status transaction_status DEFAULT 'pending',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ✅ COMPLETED: Review system table
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    script_id UUID REFERENCES public.scripts(id) ON DELETE CASCADE NOT NULL,
    reviewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(script_id, reviewer_id)
);

-- ✅ COMPLETED: License, transaction, and status enums
CREATE TYPE public.license_type AS ENUM ('standard', 'premium', 'educational');
CREATE TYPE public.license_status AS ENUM ('active', 'expired', 'cancelled');
CREATE TYPE public.transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
```

**Stripe Integration:**
- Payment Intent creation with metadata
- Webhook endpoint for payment confirmations
- Subscription handling for recurring licenses
- Refund processing and access revocation

**API Endpoints:**
- `POST /api/licensing/create-payment-intent` - Initialize payment
- `POST /api/webhooks/stripe` - Handle Stripe webhooks
- `GET /api/licensing/transactions` - Get user's licensing history
- `POST /api/licensing/validate-access` - Check script access permissions

### 4. Communication System (Priority: High - Week 7-8)

**Service Requirements:**
- Resend API integration for email delivery
- Email template system with role-based customization
- Notification queue management
- Real-time notification system

**Frontend Integration Points:**
- `src/pages/NotificationCenter.tsx` - Notification dashboard
- `src/components/messaging/MessageCenter.tsx` - Communication interface

**Email Templates Required:**
- OTP verification emails
- License purchase confirmations
- Script access notifications
- Production reminders
- Copyright registration updates

**Database Schema:**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  data JSONB,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email TEXT NOT NULL,
  template_id TEXT NOT NULL,
  template_data JSONB,
  status TEXT DEFAULT 'pending',
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**API Endpoints:**
- `POST /api/notifications/send` - Queue notification
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/{id}/read` - Mark as read
- `POST /api/email/send` - Send email via Resend

### 5. Analytics & Reporting (Priority: Medium - Week 9-10)

**Service Requirements:**
- Production data collection and analysis
- Revenue reporting for playwrights
- Usage analytics and metrics
- Performance monitoring integration

**Frontend Integration Points:**
- `src/components/analytics/AnalyticsDashboard.tsx` - Analytics interface
- `src/pages/Analytics.tsx` - Detailed analytics page

**Database Schema:**
```sql
CREATE TABLE production_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES licensing_transactions(id),
  theater_company_id UUID REFERENCES auth.users(id),
  script_id UUID REFERENCES scripts(id),
  total_performances INTEGER,
  total_attendance INTEGER,
  average_ticket_price DECIMAL(10,2),
  total_revenue DECIMAL(10,2),
  venue_capacity INTEGER,
  submitted_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 6. Admin Panel System (Priority: Medium - Week 11-12)

**Service Requirements:**
- User management and moderation
- Content approval workflows
- Copyright registration processing
- Platform analytics and monitoring

**Frontend Integration Points:**
- `src/pages/AdminPanel.tsx` - Admin dashboard
- Various admin components for user/content management

**API Endpoints:**
- `GET /api/admin/users` - User management
- `POST /api/admin/approve-script` - Content moderation
- `GET /api/admin/analytics` - Platform metrics
- `POST /api/admin/copyright/process` - Copyright registration

## Security Requirements

### Authentication Security (✅ PARTIALLY IMPLEMENTED)
- ✅ JWT token validation on all protected routes (Supabase handles)
- Rate limiting on authentication endpoints (needs implementation)
- ✅ Secure password hashing (handled by Supabase)
- ✅ Session management with proper expiration (Supabase handles)
- ✅ Auto email confirmation configured for development

### Data Protection (✅ IMPLEMENTED)
- ✅ Row Level Security (RLS) policies implemented on all tables
- ✅ Security definer functions to prevent RLS policy recursion
- ✅ Proper table relationships and cascading deletes
- ✅ User-scoped data access controls
- Input validation and sanitization (needs implementation)
- XSS and CSRF protection (needs implementation)
- File upload security scanning (needs implementation)

### Storage Security (✅ IMPLEMENTED)
- ✅ Private storage bucket for scripts with access control
- ✅ Public buckets for covers/samples with user ownership policies
- ✅ Signed URL access patterns ready for implementation
- ✅ User-folder organization for secure file isolation

### Payment Security
- PCI compliance through Stripe
- Webhook signature verification
- Secure API key management
- Transaction audit logging

## Environment Configuration

**Required Environment Variables:**
```bash
# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=theaterscriptpro-bucket

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Resend
RESEND_API_KEY=your_resend_api_key

# Sentry (optional)
SENTRY_DSN=your_sentry_dsn
```

## Testing Requirements

### Unit Testing
- API endpoint testing with proper mocking
- Database operation testing
- Authentication flow testing
- Payment processing testing

### Integration Testing
- End-to-end user registration flow
- Complete licensing transaction flow
- File upload and access flow
- Email delivery testing

### Security Testing
- Authentication bypass testing
- SQL injection prevention
- File upload security testing
- Payment security validation

## Deployment Considerations

### Infrastructure Requirements
- Supabase project with proper RLS policies
- AWS S3 bucket with CORS configuration
- Stripe account with webhook endpoints
- Resend account for email delivery
- Domain configuration for email authentication

### Monitoring and Logging
- Sentry integration for error tracking
- Database performance monitoring
- API response time tracking
- Email delivery monitoring

### Scalability Planning
- Database connection pooling
- File storage CDN integration
- API rate limiting implementation
- Background job processing for heavy operations

## Frontend-Backend Integration Points

### State Management
The frontend uses React Query for server state management with these key patterns:
- Authentication state via `useAuth` hook
- Script data via `useQuery` hooks
- Real-time updates via Supabase subscriptions

### API Response Formats
All API responses should follow this format:
```typescript
interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
```

### Error Handling
The frontend expects standardized error responses:
```typescript
interface ApiError {
  code: string;
  message: string;
  details?: any;
}
```

This comprehensive backend implementation will provide a production-ready foundation for TheaterScript Pro, enabling all frontend functionality with proper security, scalability, and performance considerations.
