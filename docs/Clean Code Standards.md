# Clean Code Standards for TheaterScript Pro

## Overview

TheaterScript Pro requires exceptional code quality due to its handling of intellectual property, financial transactions, and complex role-based permissions. These standards ensure maintainable, secure, and scalable code across the platform's critical features including script management, licensing automation, and copyright protection.

## TypeScript Conventions

### Type Safety for Theater Domain

Use strict typing for all theater-specific entities and role-based permissions. Define comprehensive interfaces for core domain objects including Script, Playwright, TheaterCompany, and License entities. Leverage TypeScript's discriminated unions for role-based access patterns and licensing states.

Create domain-specific type guards for user roles, script access levels, and licensing permissions. Use branded types for sensitive identifiers like script IDs, user IDs, and payment references to prevent accidental misuse across different contexts.

### Zod Integration Patterns

Implement consistent validation schemas that mirror TypeScript interfaces for all forms and API endpoints. Define reusable schema components for common patterns like contact information, script metadata, and licensing options. Use Zod's transform capabilities for data sanitization, especially for user-generated content like script descriptions and playwright bios.

Create validation hierarchies that reflect the platform's role-based permissions, ensuring theater companies cannot access playwright-only fields and vice versa. Implement custom validation rules for theater-specific requirements like cast size ranges, duration formats, and genre classifications.

## Component Organization

### Feature-Based Architecture

```
components/
├── ui/                    # Shadcn base components
├── forms/                 # Complex form components
│   ├── script-upload/     # Script metadata and file handling
│   ├── licensing/         # Licensing configuration forms
│   └── profile/           # User profile management
├── viewers/               # Script and document viewers
├── dashboards/            # Role-specific dashboard components
└── shared/                # Cross-feature reusable components
```

### Component Composition Patterns

Design components with clear separation between presentation and business logic. Use composition over inheritance for complex UI elements like script cards, licensing forms, and profile sections. Implement consistent prop interfaces that reflect the platform's domain model.

Create higher-order components for role-based rendering, ensuring sensitive information is properly filtered based on user permissions. Use compound components for complex interactions like script uploading with progress tracking and error handling.

## DRY Principles for Theater Platform

### Shared Business Logic

Extract common patterns into reusable utilities, particularly for role-based access control, licensing calculations, and script metadata handling. Create centralized functions for permission checking, ensuring consistent security across all features.

Implement shared hooks for common operations like script fetching, user authentication state, and payment processing. Use custom hooks to encapsulate complex state management patterns specific to theater operations like licensing workflows and copyright submissions.

### Data Transformation Utilities

Create standardized functions for transforming between different data representations, such as converting between database models and display formats for script information, licensing terms, and user profiles. Implement consistent error handling patterns across all data operations.

Develop reusable formatters for theater-specific data like performance dates, licensing periods, and financial calculations. Ensure these utilities handle edge cases common in theater operations like extended runs and seasonal scheduling.

## Error Handling and Logging

### Sentry Integration Strategy

Implement comprehensive error boundaries that capture context-specific information for theater operations. Include user role, script access level, and licensing state in error reports to facilitate debugging. Use Sentry's custom tags for categorizing errors by feature area and user type.

Create structured logging for critical operations like payment processing, script access, and copyright submissions. Implement performance monitoring for script upload and PDF viewing operations to ensure optimal user experience.

### Graceful Degradation Patterns

Design components to handle partial data gracefully, particularly important for public script profiles and playwright pages that may be accessed by search engines. Implement fallback states for complex features like the perusal viewer when PDF loading fails.

Create user-friendly error messages that provide actionable guidance, especially for licensing-related errors and payment processing issues. Implement retry mechanisms for transient failures in file operations and external service integrations.

## Security and Data Protection

### Intellectual Property Safeguards

Implement strict access controls for script content, ensuring perusal versions are properly protected and full scripts are only accessible to licensed users. Use consistent patterns for generating expiring URLs and validating access permissions.

Create audit trails for all script access and licensing operations, logging user interactions with sensitive content. Implement watermarking utilities that can be consistently applied across different script viewing contexts.

### Payment and Licensing Security

Establish secure patterns for handling payment information and licensing transactions. Ensure all financial operations are properly validated and logged. Implement consistent error handling for payment failures that doesn't expose sensitive information.

Create secure patterns for storing and transmitting licensing agreements and copyright information. Use encryption for sensitive data at rest and implement proper key management practices.

## Performance Optimization

### Script Delivery Optimization

Implement efficient caching strategies for script metadata and public profile information. Use Next.js's built-in optimization features for static generation of public pages while maintaining dynamic content for authenticated users.

Create lazy loading patterns for large script files and PDF viewers. Implement progressive loading for script search results and profile galleries to maintain responsive performance.

### Database Query Optimization

Design consistent patterns for database queries that minimize N+1 problems, particularly important for script listings with associated playwright and licensing information. Use proper indexing strategies for search functionality.

Implement caching layers for frequently accessed data like script metadata, user profiles, and licensing options. Create efficient patterns for role-based data filtering at the database level.

## Code Review and Quality Assurance

### Review Checklist Standards

Ensure all code changes include proper TypeScript typing, Zod validation, and error handling. Verify that role-based access controls are properly implemented and tested. Check that sensitive operations include appropriate logging and monitoring.

Review all user-facing messages for clarity and professionalism, particularly important for a platform serving creative professionals. Ensure accessibility standards are maintained across all new components and features.

### Testing Integration

Implement unit tests for all business logic, particularly licensing calculations and permission checking. Create integration tests for critical user flows like script upload, licensing purchase, and copyright submission.

Use test utilities that mock external services like Stripe, AWS S3, and Resend to ensure reliable testing. Implement visual regression testing for public-facing components like script profiles and playwright pages.