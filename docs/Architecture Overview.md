# TheaterScript Pro - System Architecture Overview

## Platform Architecture

TheaterScript Pro implements a modern full-stack architecture optimized for secure content delivery, role-based access control, and scalable file management. The platform serves three distinct user types (Playwrights, Theater Companies, Admins) with specialized workflows and permissions.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Next.js App Router + Shadcn UI + Tailwind CSS                │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   │
│  │ Public Profiles │ │ Script Viewer   │ │ Admin Dashboard │   │
│  │ & Search Pages  │ │ & Licensing     │ │ & Analytics     │   │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  Next.js API Routes + Server Actions + Middleware              │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   │
│  │ Authentication  │ │ File Management │ │ Payment         │   │
│  │ & Authorization │ │ & Upload Logic  │ │ Processing      │   │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│  │  Supabase   │ │   AWS S3    │ │   Stripe    │ │   Resend    │ │
│  │ Database +  │ │ Secure File │ │  Payment    │ │   Email     │ │
│  │    Auth     │ │   Storage   │ │ Processing  │ │  Delivery   │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Core System Components

### Frontend Architecture
The Next.js App Router provides server-side rendering for SEO-critical public profiles and script pages. Shadcn UI components handle complex interfaces including script viewers, licensing forms, and role-based dashboards. TypeScript ensures type safety across role-based permissions and licensing logic.

### Backend Integration
Supabase manages authentication, role-based access control, and relational data structures for scripts, users, and licensing transactions. Row Level Security policies enforce data isolation between user roles and script ownership.

### File Storage Strategy
AWS S3 hosts script files with expiring URLs and access control for intellectual property protection. Full scripts and perusal versions are stored separately with different access patterns and security policies.

## Data Flow Architecture

### User Authentication & Authorization
```
Registration → OTP Verification → Role Selection → Profile Creation
     │                                                    │
     ▼                                                    ▼
Supabase Auth ──────────────────────────────────► Role-Based RLS
     │                                                    │
     ▼                                                    ▼
Session Management ──────────────────────────────► Permission Gates
```

### Script Management Workflow
```
1. Playwright Upload
   ├── File Validation (Zod)
   ├── S3 Upload (Full + Perusal)
   └── Metadata Storage (Supabase)

2. Script Processing
   ├── Thumbnail Generation
   ├── Search Index Update
   └── Profile Page Creation

3. Public Discovery
   ├── Search & Filter Engine
   ├── Public Profile Display
   └── Perusal Viewer Access
```

### Licensing Transaction Flow
```
Theater Company ──► Script Discovery ──► Licensing Request
      │                                         │
      ▼                                         ▼
Payment Processing ◄──── Stripe Integration ◄──┘
      │
      ▼
License Generation ──► Email Notification ──► Script Access
      │                                         │
      ▼                                         ▼
Database Update ──────────────────────────► S3 Download URL
```

## Security Architecture

### Role-Based Access Control
Implement three-tier permission system with Playwright, Theater Company, and Admin roles. Supabase RLS policies enforce data isolation and script ownership verification. Middleware validates role permissions before sensitive operations.

### File Security Model
AWS S3 bucket policies restrict direct access with pre-signed URLs for authorized downloads. Perusal scripts include optional watermarking and viewing restrictions through React PDF integration. Full scripts require licensing verification before access.

### Payment Security
Stripe handles sensitive payment data with PCI compliance. Webhook verification ensures transaction integrity. Failed payments trigger automatic access revocation and notification workflows.

## Performance Optimization

### Content Delivery
Vercel's global CDN accelerates script delivery and public profile loading. Next.js Image optimization reduces bandwidth for production photos and headshots. Static generation for public profiles improves SEO and loading times.

### Database Optimization
Supabase connection pooling manages concurrent user sessions. Database indexes optimize search queries across script metadata, cast requirements, and licensing history. Query optimization reduces response times for complex filtering operations.

### Caching Strategy
Implement multi-layer caching with Next.js static generation for public content, Redis for session data, and CDN caching for static assets. Cache invalidation triggers on content updates and licensing changes.

## Monitoring & Reliability

### Error Tracking
Sentry monitors critical error paths including payment processing failures, file access issues, and authentication problems. Real-time alerts ensure rapid response to platform reliability issues.

### Email Delivery
Resend provides reliable delivery for OTP authentication, licensing notifications, and production reminders. Delivery tracking and bounce handling maintain communication reliability.

### Analytics Integration
Post-production analytics collection with privacy controls allows theater companies to share performance data. Automated reporting generates insights for playwrights while respecting company privacy preferences.

## Scalability Considerations

### Horizontal Scaling
Next.js serverless functions auto-scale with demand. Supabase handles database scaling automatically. AWS S3 provides unlimited storage capacity for script files and media assets.

### API Rate Limiting
Implement rate limiting for file uploads, search queries, and licensing requests. Prevent abuse while maintaining responsive user experience for legitimate usage patterns.

### Copyright Integration
External API integration with US Copyright Office systems for automated registration submissions. Tracking workflows monitor application status and store confirmation documentation securely.