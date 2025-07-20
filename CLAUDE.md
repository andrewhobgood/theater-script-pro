# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important Documents

- **Product Strategy**: See [PRODUCT_STRATEGY.md](./PRODUCT_STRATEGY.md) for comprehensive product vision, technical roadmap, and market analysis
- **API Documentation**: See [backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md) for detailed API endpoints

## Development Commands

### Frontend
```bash
npm install      # Install dependencies
npm run dev      # Start development server (Vite)
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

### Backend
```bash
cd backend && npm install  # Install backend dependencies
npm run dev:backend        # Start backend server
npm run dev:all           # Start both frontend and backend
npm run build:backend     # Build backend for production
npm run lint:backend      # Run backend ESLint
```

## High-Level Architecture

This is a theater script licensing platform built with React, TypeScript, and Supabase. The platform connects playwrights with theater companies through a secure script licensing marketplace.

### Core User Roles
- **Playwrights**: Upload scripts, set licensing terms, track analytics
- **Theater Companies**: Browse scripts, purchase licenses, manage productions
- **Admins**: Platform management and content moderation

### Technology Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js with TypeScript (Node.js)
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Authentication**: Supabase Auth (email-based OTP per docs)
- **File Storage**: AWS S3 integration (configured)
- **Payments**: Stripe integration (configured)
- **Email Service**: Resend (configured)

### Key Architectural Patterns

1. **Component Organization**: Feature-based structure under `src/components/`
   - Each feature area has its own folder (scripts/, licensing/, profile/, etc.)
   - UI primitives in `src/components/ui/` (shadcn/ui components)
   - Shared components for cross-feature functionality

2. **Page Structure**: Routes organized in `src/pages/`
   - Public pages: Home, Scripts, About, Contact
   - Auth pages: Auth (login/signup)
   - Protected pages: Dashboard, Profile, AdminPanel
   - Script detail pages with licensing flows

3. **State Management**: 
   - React hooks for local state
   - Tanstack Query for server state (data fetching/caching)
   - Supabase real-time subscriptions for live updates

4. **Security Architecture**:
   - Row Level Security (RLS) enforces permissions at database level
   - Role-based access control throughout the application
   - Secure file storage with time-limited signed URLs
   - Watermarking for perusal scripts

5. **Database Schema Core Tables**:
   - `profiles`: User profiles with role discrimination
   - `scripts`: Script metadata and pricing
   - `licenses`: Active licensing agreements
   - `reviews`: Script ratings and reviews
   - `transactions`: Payment history

### Critical Implementation Details

1. **Supabase Integration**: 
   - Client initialized in `src/integrations/supabase/client.ts`
   - Types auto-generated in `src/integrations/supabase/types.ts`
   - Use `supabase` client for all database operations

2. **Authentication Flow**:
   - Email-based authentication through Supabase
   - Role determined at signup and stored in profiles table
   - Protected routes check authentication status

3. **Script Management**:
   - Scripts have draft/published/archived status
   - Multiple pricing tiers: standard, premium, educational
   - Perusal versions separate from full scripts

4. **Licensing System**:
   - Licenses track performance dates, venue details
   - Expiration dates for time-limited licenses
   - Integration with payment processing

### Development Guidelines

1. **Type Safety**: All components use TypeScript interfaces
2. **Component Patterns**: Follow existing shadcn/ui patterns
3. **Error Handling**: User-friendly messages for theater professionals
4. **Performance**: Lazy load heavy components (PDF viewers, etc.)
5. **Accessibility**: Components include ARIA labels and keyboard navigation

### Environment Setup

The project uses Lovable.dev for deployment and includes:
- Vite for fast development builds
- Tailwind CSS for styling
- shadcn/ui for consistent component design
- Supabase for backend services

### Key Files to Understand

#### Frontend
- `src/App.tsx`: Main routing and layout structure
- `src/pages/Dashboard.tsx`: Role-based dashboard logic
- `src/components/scripts/`: Script browsing and management
- `src/components/licensing/`: License purchase flows
- `src/hooks/useAuth.ts`: Authentication state management

#### Backend
- `backend/src/index.ts`: Server entry point
- `backend/src/app.ts`: Express app configuration
- `backend/src/config/`: Environment configuration
- `backend/src/middleware/`: Error handling, logging, auth
- `backend/src/api/`: Route handlers (to be implemented)
- `backend/src/services/`: Business logic services

### Backend Implementation Status

The backend has been implemented with:
- ✅ Express server with TypeScript
- ✅ Comprehensive middleware (helmet, cors, rate limiting, logging)
- ✅ Health check and API info endpoints
- ✅ Authentication system (register, login, OTP verification, JWT)
- ✅ User profile management (CRUD operations, role-based access)
- ✅ Script management APIs (CRUD, publishing, search, filtering)
- ✅ License management system (creation, tracking, download)
- ✅ File upload to S3 (scripts and cover images)
- ✅ Email notifications (welcome, license confirmations)
- ✅ Input validation with Joi schemas
- ✅ Comprehensive error handling
- ✅ API documentation (see backend/API_DOCUMENTATION.md)
- ✅ Stripe payment integration (payment intents, webhooks, customer management)
- ❌ Admin panel endpoints
- ❌ PDF watermarking service
- ❌ Copyright registration automation
- ❌ Advanced analytics endpoints

### API Endpoints Summary

**Authentication**: `/api/v1/auth/*`
- Register, login (OTP), verify, refresh token, logout, get current user

**Users**: `/api/v1/users/*`
- Profile management, public profiles, search, list playwrights/companies

**Scripts**: `/api/v1/scripts/*`
- CRUD operations, search, filtering, file uploads, reviews, publishing

**Licenses**: `/api/v1/licenses/*`
- Create licenses, view licenses, download scripts, update performance dates

**Payments**: `/api/v1/payments/*`
- Create payment intent, confirm payment, handle webhooks, view payment history

### Running the Backend

```bash
# Start backend only
cd backend && npm run dev

# Start both frontend and backend
npm run dev:all
```

The backend runs on `http://localhost:3001` with full CORS support for the frontend.

## Strategic Priorities

Based on the comprehensive analysis in [PRODUCT_STRATEGY.md](./PRODUCT_STRATEGY.md), the immediate priorities are:

### 🚨 Critical Security Issues
1. **Remove exposed Supabase credentials from frontend code**
2. **Implement comprehensive test coverage (currently 0%)**
3. **Add CSRF protection and rate limiting**

### 🔧 Complete Core Features
1. **PDF watermarking for perusal scripts**
2. **Admin panel for platform management**
3. **Performance analytics dashboard**
4. **Copyright registration automation**

### 🚀 Technical Improvements
1. **Add Redis caching layer**
2. **Implement monitoring and error tracking**
3. **Set up CI/CD pipeline with automated testing**
4. **Database query optimization**

### 📈 Product Vision
TheaterScript Pro aims to become the "Netflix + LinkedIn + Shopify" of theater - a comprehensive platform that revolutionizes script licensing globally. See the full product strategy document for detailed roadmap and market analysis.