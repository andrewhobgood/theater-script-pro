
# Backend Development Handoff Report

## Project Status Overview

**Frontend Completion:** 95% complete with production-ready UI components
**Backend Status:** Not implemented - requires full backend development
**Estimated Backend Timeline:** 10-12 weeks for production-ready implementation
**Technology Stack:** Supabase, AWS S3, Stripe, Resend, Sentry

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

**Database Schema Requirements:**
```sql
-- Users table (handled by Supabase Auth)
-- Custom profile tables needed:
CREATE TABLE playwright_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  bio TEXT,
  headshot_url TEXT,
  contact_email TEXT,
  social_links JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE theater_company_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  company_name TEXT NOT NULL,
  address JSONB,
  capacity INTEGER,
  founded_year INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  permissions JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW()
);
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

**Database Schema:**
```sql
CREATE TABLE scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playwright_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  genre TEXT,
  duration_minutes INTEGER,
  cast_size_min INTEGER,
  cast_size_max INTEGER,
  age_rating TEXT,
  themes TEXT[],
  synopsis TEXT,
  full_script_url TEXT,
  perusal_script_url TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE script_metadata (
  script_id UUID PRIMARY KEY REFERENCES scripts(id),
  page_count INTEGER,
  character_count INTEGER,
  setting_requirements TEXT,
  technical_requirements TEXT,
  licensing_notes TEXT,
  copyright_year INTEGER
);
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

**Database Schema:**
```sql
CREATE TABLE licensing_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  script_id UUID REFERENCES scripts(id),
  theater_company_id UUID REFERENCES auth.users(id),
  playwright_id UUID REFERENCES auth.users(id),
  stripe_payment_intent_id TEXT UNIQUE,
  amount_cents INTEGER NOT NULL,
  license_type TEXT NOT NULL,
  performance_dates DATERANGE,
  venue_capacity INTEGER,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE script_access_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES licensing_transactions(id),
  user_id UUID REFERENCES auth.users(id),
  script_id UUID REFERENCES scripts(id),
  access_type TEXT NOT NULL, -- 'full' or 'perusal'
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
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

### Authentication Security
- JWT token validation on all protected routes
- Rate limiting on authentication endpoints
- Secure password hashing (handled by Supabase)
- Session management with proper expiration

### Data Protection
- Row Level Security (RLS) policies in Supabase
- Input validation and sanitization
- XSS and CSRF protection
- File upload security scanning

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
