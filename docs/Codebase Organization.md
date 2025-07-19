# TheaterScript Pro Codebase Organization

## Overview
This document establishes file structure conventions and organizational patterns for TheaterScript Pro's role-based theater platform. The architecture supports complex role-based permissions, secure file handling, and multi-tenant functionality while maintaining scalability and developer productivity.

## Directory Structure

### Core Application Structure
```
app/
├── (auth)/                    # Authentication routes with layout isolation
├── (dashboard)/               # Role-based dashboard layouts
├── (public)/                  # Public-facing pages (profiles, scripts)
├── api/                       # API routes organized by domain
├── globals.css                # Global styles and Tailwind imports
└── layout.tsx                 # Root layout with providers

components/
├── ui/                        # Shadcn UI components (buttons, forms, dialogs)
├── auth/                      # Authentication-specific components
├── dashboard/                 # Role-based dashboard components
├── script/                    # Script viewing and management components
├── profile/                   # User and company profile components
├── licensing/                 # Payment and licensing flow components
└── shared/                    # Reusable cross-domain components

lib/
├── auth/                      # Authentication utilities and middleware
├── database/                  # Supabase client and query helpers
├── payments/                  # Stripe integration and payment processing
├── storage/                   # S3 file management and URL generation
├── email/                     # Resend email templates and sending
├── validation/                # Zod schemas for forms and API validation
└── utils/                     # General utility functions and helpers
```

## Role-Based Organization Strategy

### Route Grouping by Access Level
Organize routes using Next.js route groups to separate public, authenticated, and role-specific areas:

```
app/
├── (public)/
│   ├── scripts/[id]/          # Public script profiles
│   ├── playwrights/[id]/      # Public playwright profiles
│   └── companies/[id]/        # Public company profiles
├── (auth)/
│   ├── login/
│   ├── register/
│   └── verify/
└── (dashboard)/
    ├── playwright/            # Playwright-specific dashboard
    ├── company/               # Theater company dashboard
    └── admin/                 # Admin panel routes
```

### Component Organization by Domain
Structure components by business domain rather than technical function:

```
components/
├── script/
│   ├── ScriptViewer/          # PDF viewer with watermarking
│   ├── ScriptUpload/          # Multi-step upload process
│   ├── ScriptMetadata/        # Cast info, themes, duration forms
│   └── ScriptLicensing/       # Pricing and licensing options
├── profile/
│   ├── PlaywrightProfile/     # Bio, headshot, WYSIWYG sections
│   ├── CompanyProfile/        # Company info and production history
│   └── ProfileEditor/         # Shared profile editing components
└── licensing/
    ├── LicensingFlow/         # Multi-step licensing process
    ├── PaymentForm/           # Stripe payment integration
    └── LicenseConfirmation/   # Post-purchase confirmation
```

## API Route Organization

### Domain-Driven API Structure
Organize API routes by business domain with clear separation of concerns:

```
app/api/
├── auth/                      # Authentication endpoints
├── scripts/                   # Script CRUD and metadata management
├── licensing/                 # Payment processing and license generation
├── profiles/                  # User and company profile management
├── search/                    # Advanced search and filtering
├── storage/                   # File upload and URL generation
├── notifications/             # Email and system notifications
└── webhooks/                  # Stripe and external service webhooks
```

### API Route Naming Conventions
- Use RESTful patterns: `GET /api/scripts/[id]`, `POST /api/scripts`
- Include role-based endpoints: `/api/playwright/scripts`, `/api/company/licenses`
- Separate public and authenticated endpoints clearly
- Use descriptive action names: `/api/scripts/[id]/license`, `/api/copyright/register`

## Import/Export Patterns

### Barrel Exports for Clean Imports
Create index files for clean component and utility imports:

```typescript
// components/script/index.ts
export { ScriptViewer } from './ScriptViewer'
export { ScriptUpload } from './ScriptUpload'
export { ScriptMetadata } from './ScriptMetadata'

// lib/index.ts
export * from './auth'
export * from './database'
export * from './payments'
```

### Type-Safe Database Exports
Organize database types and queries with clear export patterns:

```typescript
// lib/database/types.ts
export type Script = Database['public']['Tables']['scripts']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']

// lib/database/queries.ts
export const getScriptById = (id: string) => { /* query logic */ }
export const getPlaywrightScripts = (userId: string) => { /* query logic */ }
```

## File Naming Conventions

### Component Files
- Use PascalCase for component files: `ScriptViewer.tsx`
- Include component type in name: `ScriptViewerDialog.tsx`, `ScriptUploadForm.tsx`
- Use descriptive names that indicate purpose: `LicensingPaymentForm.tsx`

### Utility and Hook Files
- Use camelCase for utilities: `formatCurrency.ts`, `generateSecureUrl.ts`
- Prefix hooks with 'use': `useScriptLicensing.ts`, `useRolePermissions.ts`
- Group related utilities: `stringUtils.ts`, `dateUtils.ts`, `validationUtils.ts`

### API Route Files
- Use kebab-case for multi-word endpoints: `script-licensing.ts`
- Include HTTP method when needed: `upload-script.ts`, `process-payment.ts`
- Use descriptive action names: `generate-license.ts`, `verify-copyright.ts`

## Security and Access Control Organization

### Role-Based Component Structure
Organize components with role-based access patterns:

```
components/
├── auth/
│   ├── RoleGuard.tsx          # Component-level role protection
│   ├── PermissionCheck.tsx    # Fine-grained permission checking
│   └── RoleRedirect.tsx       # Role-based navigation
├── dashboard/
│   ├── PlaywrightDashboard/   # Playwright-specific features
│   ├── CompanyDashboard/      # Company-specific features
│   └── AdminDashboard/        # Admin-only functionality
```

### Middleware Organization
Structure middleware for layered security:

```
middleware.ts                  # Route-level authentication
lib/auth/
├── roleMiddleware.ts          # Role-based access control
├── permissionMiddleware.ts    # Feature-level permissions
└── rateLimitMiddleware.ts     # API rate limiting
```

## Development Workflow Patterns

### Feature Branch Organization
Structure feature development around business domains:
- `feature/script-upload-enhancement`
- `feature/licensing-flow-optimization`
- `feature/playwright-profile-editor`

### Testing File Organization
Mirror source structure in test directories:

```
__tests__/
├── components/
│   ├── script/
│   └── profile/
├── lib/
│   ├── auth/
│   └── database/
└── api/
    ├── scripts/
    └── licensing/
```

## Performance and Scalability Considerations

### Code Splitting Strategy
- Implement route-based code splitting for role-specific features
- Use dynamic imports for heavy components like PDF viewers
- Separate vendor libraries from application code
- Implement component-level lazy loading for dashboard widgets

### Asset Organization
Structure static assets for optimal delivery:

```
public/
├── images/
│   ├── logos/                 # Company and platform logos
│   ├── placeholders/          # Default profile images
│   └── icons/                 # Custom SVG icons
├── fonts/                     # Custom typography
└── documents/                 # Legal documents and terms
```

This organizational structure ensures maintainable, scalable code while supporting TheaterScript Pro's complex role-based functionality and secure file handling requirements.