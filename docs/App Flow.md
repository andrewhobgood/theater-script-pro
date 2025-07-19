# TheaterScript Pro - Complete App Flow Documentation

## Overview

TheaterScript Pro orchestrates complex user journeys across multiple roles with secure authentication, sophisticated licensing workflows, and comprehensive post-production tracking. This documentation maps the complete user experience from registration through script discovery, licensing, and analytics reporting.

## User Role Architecture

```
Registration Entry Point
         |
    OTP Verification
         |
    Role Selection
    /    |    \
Playwright  Theater  Admin
   |      Company    |
Profile    Profile   Dashboard
Setup      Setup     Access
```

## Playwright Journey Flow

### Registration & Profile Setup
```
1. Email/Password Registration
   └── OTP Verification via Resend
       └── Role Selection (Playwright)
           └── Profile Creation
               ├── Bio & Headshot Upload
               ├── Contact Information
               ├── WYSIWYG Content Sections
               └── Social Media Links
```

### Script Management Workflow
```
Script Upload Process:
1. Upload Full Script → S3 Secure Storage
2. Upload Perusal Version → S3 with Expiring URLs
3. Script Metadata Entry:
   ├── Title, Genre, Duration
   ├── Cast Requirements
   ├── Age Range & Themes
   ├── Production Notes
   └── Licensing Options Setup
4. Script Profile Page Generation
5. Search Index Registration
```

### Licensing Configuration
```
Pricing Model Setup:
├── Standard Production Rights
├── Educational Licensing Rates
├── Extended Run Pricing
├── Regional Restrictions
└── Approval Requirements
```

## Theater Company Journey Flow

### Discovery & Research Phase
```
Search Interface:
├── Advanced Filters
│   ├── Cast Size Range
│   ├── Genre & Theme Tags
│   ├── Duration Requirements
│   └── Budget Constraints
├── Script Profile Browsing
├── Perusal Script Viewing
└── Playwright Profile Research
```

### Licensing Process
```
Licensing Workflow:
1. Script Selection & Perusal Review
2. Licensing Option Selection
3. Performance Date Specification
4. Stripe Payment Processing
5. Instant Script Access via Expiring URLs
6. License Agreement Download
7. Production Notification Setup
```

### Post-Production Reporting
```
Analytics Submission:
1. Production Completion Notification
2. Attendance Data Entry
3. Ticket Price & Capacity Reporting
4. Optional Review Submission
5. Production Photo Upload
6. Playwright Notification Trigger
```

## Authentication & Security Flow

### Multi-Role Authentication
```
Supabase Auth Flow:
Registration → OTP Email → Role Assignment → Profile Creation
                    ↓
            Role-Based Permissions:
            ├── Playwright: Script Management
            ├── Theater: Licensing & Reporting
            └── Admin: Platform Oversight
```

### File Access Control
```
S3 Security Model:
Script Upload → Secure Storage → Role-Based Access
                    ↓
            Expiring URL Generation:
            ├── Perusal Scripts (24-48 hours)
            ├── Licensed Scripts (Extended Access)
            └── Watermarked Preview Files
```

## Payment & Licensing Integration

### Stripe Integration Workflow
```
Licensing Transaction Flow:
1. License Selection & Customization
2. Stripe Checkout Session Creation
3. Payment Processing & Confirmation
4. License Agreement Generation
5. Script Access Provisioning
6. Automated Email Confirmations
7. Playwright Revenue Distribution
```

### Copyright Registration Service
```
Copyright Processing:
1. Fee Collection via Stripe
2. Document Preparation & Validation
3. US Copyright Office Submission
4. Tracking Number Assignment
5. Confirmation Storage & Notification
```

## Notification & Communication System

### Automated Notification Triggers
```
Resend Email Automation:
├── Registration Confirmations
├── Licensing Notifications
├── Production Reminders
├── Report Submission Requests
├── Revenue Distribution Alerts
└── Copyright Status Updates
```

### Smart Reminder System
```
Behavior-Based Notifications:
User Activity → Pattern Recognition → Targeted Reminders
                    ↓
            Notification Types:
            ├── Licensing Opportunities
            ├── Report Deadlines
            ├── Show Extensions
            └── Profile Updates
```

## Search & Discovery Architecture

### Advanced Search Implementation
```
Search Index Structure:
Scripts → Metadata Indexing → Filter Categories
            ↓
    Search Parameters:
    ├── Title & Playwright Name
    ├── Genre & Theme Classifications
    ├── Technical Requirements
    ├── Licensing Availability
    └── Production History
```

### Content Recommendation Engine
```
Recommendation Logic:
User Behavior → Preference Analysis → Personalized Suggestions
                    ↓
            Recommendation Types:
            ├── Similar Scripts
            ├── Playwright Catalogs
            ├── Trending Productions
            └── Budget-Appropriate Options
```

## Analytics & Reporting Framework

### Performance Tracking
```
Analytics Data Flow:
Production Data → Privacy Controls → Playwright Dashboard
                    ↓
            Report Categories:
            ├── Attendance Metrics
            ├── Revenue Performance
            ├── Geographic Distribution
            └── Seasonal Trends
```

### Platform Analytics
```
Admin Dashboard Metrics:
├── User Engagement Tracking
├── Licensing Transaction Volume
├── Script Performance Rankings
├── Revenue Distribution Analysis
└── Platform Growth Indicators
```

## Error Handling & Reliability

### Sentry Integration Points
```
Critical Monitoring Areas:
├── Payment Processing Failures
├── File Access Errors
├── Authentication Issues
├── Email Delivery Problems
└── Database Connection Failures
```

### Fallback Mechanisms
```
Reliability Measures:
├── Payment Retry Logic
├── Email Delivery Confirmation
├── File Access Redundancy
├── Session Management
└── Data Backup Protocols
```

## Implementation Guidelines

### User Experience Priorities
- Maintain consistent navigation across role-specific interfaces
- Implement progressive disclosure for complex licensing options
- Ensure mobile responsiveness for script discovery and basic management
- Provide clear status indicators throughout multi-step processes

### Security Considerations
- Implement role-based route protection at Next.js middleware level
- Use Supabase RLS policies for data access control
- Generate time-limited S3 URLs for script access
- Validate all user inputs with Zod schemas

### Performance Optimization
- Leverage Vercel Edge Functions for geographically distributed script delivery
- Implement lazy loading for script previews and large file operations
- Use Next.js ISR for frequently accessed script profile pages
- Optimize search queries with proper database indexing

### Integration Standards
- Maintain webhook endpoints for Stripe payment confirmations
- Implement proper error boundaries for PDF viewer components
- Use TypeScript interfaces for all inter-service communication
- Follow Supabase best practices for real-time subscriptions