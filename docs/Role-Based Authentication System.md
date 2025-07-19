# Role-Based Authentication System

## Overview

TheaterScript Pro implements a comprehensive role-based authentication system supporting three distinct user types: Playwrights, Theater Companies, and Admins. The system uses OTP email verification through Resend for secure account creation and maintains strict permission boundaries throughout the application.

## Authentication Flow Architecture

```
User Registration Request
         |
         v
    Email Validation
         |
         v
    OTP Generation & Send (Resend)
         |
         v
    OTP Verification
         |
         v
    Role Selection & Assignment
         |
         v
    Supabase User Creation
         |
         v
    Role-Specific Profile Setup
         |
         v
    Dashboard Redirect
```

## Role Definitions and Permissions

### Playwright Role
- **Primary Purpose**: Script creators and intellectual property owners
- **Key Permissions**: Upload scripts, manage licensing terms, view analytics, register copyrights
- **Profile Features**: Public bio, headshot, WYSIWYG content sections, contact information
- **Restricted Actions**: Cannot purchase licenses, limited theater company data access

### Theater Company Role  
- **Primary Purpose**: Script licensees and production entities
- **Key Permissions**: Browse scripts, purchase licenses, submit production data, manage company profile
- **Profile Features**: Company information, production history, performance statistics
- **Restricted Actions**: Cannot upload scripts, limited playwright contact access

### Admin Role
- **Primary Purpose**: Platform management and oversight
- **Key Permissions**: Full system access, user management, content moderation, analytics oversight
- **Profile Features**: Administrative dashboard, system monitoring tools
- **Restricted Actions**: Cannot impersonate users for licensing transactions

## Implementation Guidelines

### Authentication State Management

Use Supabase Auth with custom role claims stored in user metadata. Implement auth state persistence across page refreshes and maintain session security with automatic token refresh.

### OTP Verification Process

Configure Resend email templates for professional OTP delivery. Implement rate limiting for OTP requests and provide clear error messaging for invalid codes. Set OTP expiration to 10 minutes with option to resend after 60 seconds.

### Role Assignment Logic

Present role selection during initial registration after OTP verification. Store role information in both Supabase user metadata and dedicated profiles table for efficient querying. Prevent role changes after initial assignment without admin intervention.

### Permission Checking Patterns

Create centralized permission checking utilities that verify both authentication status and role-specific permissions. Implement server-side permission validation for all API routes and client-side checks for UI rendering.

### Protected Route Structure

```
/dashboard/playwright/* - Playwright-only routes
/dashboard/theater/* - Theater Company-only routes  
/admin/* - Admin-only routes
/auth/* - Public authentication routes
/scripts/[id] - Public with role-specific features
```

## Security Considerations

### Session Management

Implement secure session handling with httpOnly cookies and CSRF protection. Configure session timeout based on user activity and provide clear logout functionality across all devices.

### Role Escalation Prevention

Validate role permissions on every protected action, both client and server-side. Never trust client-side role information for security decisions. Implement audit logging for sensitive role-based actions.

### Data Access Controls

Apply row-level security policies in Supabase based on user roles. Ensure playwrights can only access their own scripts and analytics, while theater companies can only view licensed content and their own production data.

## UI Rendering Patterns

### Conditional Component Rendering

Create role-aware components that render different interfaces based on user permissions. Use TypeScript discriminated unions to ensure type safety when rendering role-specific content.

### Navigation Structure

Implement dynamic navigation menus that adapt to user roles. Provide clear visual indicators for role-specific sections and maintain consistent navigation patterns across role types.

### Form Validation

Apply role-specific form validation rules using Zod schemas. Ensure theater companies cannot access playwright-only form fields and vice versa. Validate permissions before form submission.

## Error Handling and Fallbacks

### Authentication Failures

Provide clear error messages for authentication failures without exposing security details. Implement graceful degradation for unauthenticated users accessing public content.

### Permission Denied Scenarios

Create user-friendly error pages for permission denied situations. Redirect unauthorized users to appropriate login or registration flows with context about required permissions.

### Session Expiration

Handle session expiration gracefully with automatic redirects to login. Preserve user context and redirect back to intended destination after re-authentication.

## Integration Points

### Supabase Configuration

Configure Supabase Auth with custom claims for role information. Set up row-level security policies that enforce role-based data access. Implement auth state change listeners for real-time session updates.

### Resend Email Integration

Configure professional email templates for OTP delivery and account notifications. Implement email delivery tracking and handle bounce/failure scenarios appropriately.

### Stripe Integration Considerations

Ensure only Theater Company roles can initiate payment flows. Validate user permissions before processing licensing transactions. Maintain audit trails for all payment-related authentication events.

## Testing Strategy

### Authentication Flow Testing

Test complete registration and login flows for each role type. Verify OTP generation, delivery, and validation processes. Ensure proper role assignment and profile creation.

### Permission Boundary Testing

Verify that each role can only access appropriate resources and functionality. Test edge cases where users might attempt to access unauthorized content or actions.

### Session Security Testing

Test session timeout behavior, concurrent session handling, and secure logout functionality. Verify that authentication state remains consistent across browser tabs and page refreshes.