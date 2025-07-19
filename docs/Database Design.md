# Database Design Standards

## Overview

TheaterScript Pro uses Supabase as the primary database with a carefully designed schema supporting multi-tenant security through Row Level Security (RLS) policies. The database architecture handles complex relationships between users, scripts, licensing transactions, and production data while maintaining strict access controls for intellectual property protection.

## Core Database Architecture

```
Users & Authentication
    ↓
Scripts & Metadata → Licensing Transactions → Production Reports
    ↓                      ↓                      ↓
File Storage (S3)    Payment Records         Analytics Data
    ↓                      ↓                      ↓
Access Control      Copyright Records      Notification Queue
```

## Primary Entity Design

### User Management Schema
Design user tables supporting three distinct roles (Playwright, Theater Company, Admin) with shared authentication but role-specific profile data. Use discriminated unions for role-based fields and maintain separate profile tables for each user type to optimize queries and enforce data integrity.

Key tables: `users`, `playwright_profiles`, `theater_company_profiles`, `admin_profiles`

### Script Management Schema
Structure script data with comprehensive metadata support including cast requirements, genre classifications, duration, themes, and age appropriateness. Implement hierarchical relationships between scripts and their versions, with separate tracking for full scripts versus perusal versions.

Key tables: `scripts`, `script_versions`, `script_metadata`, `cast_requirements`, `genre_tags`

### Licensing Transaction Schema
Design transactional data supporting multiple pricing models (flat fee, percentage, tiered) with complete audit trails. Include support for educational pricing, bulk licensing, and time-limited access grants. Maintain referential integrity between licensing records and script access permissions.

Key tables: `licensing_transactions`, `pricing_models`, `access_grants`, `payment_records`

### Production Reporting Schema
Create flexible schema for post-production data collection including attendance figures, ticket pricing, venue capacity, and performance dates. Support optional reporting with privacy controls allowing playwrights to view aggregated data while protecting theater company confidentiality.

Key tables: `production_reports`, `performance_data`, `attendance_records`, `revenue_analytics`

## Row Level Security Implementation

### Multi-Tenant Security Strategy
Implement comprehensive RLS policies ensuring users can only access data appropriate to their role and ownership. Use policy functions to check user roles, script ownership, licensing agreements, and production relationships before granting access.

```
RLS Policy Flow:
User Request → Authentication Check → Role Verification → Resource Ownership → Access Grant/Deny
```

### Script Access Control
Design policies controlling script visibility based on publication status, licensing agreements, and user relationships. Ensure full scripts are only accessible to owners and licensed users, while perusal versions follow playwright-defined visibility rules.

Policy categories: `script_visibility`, `file_access`, `metadata_access`, `licensing_verification`

### Financial Data Protection
Implement strict policies protecting payment information, licensing revenue, and production financial data. Ensure theater companies cannot access other companies' financial records and playwrights only see their own licensing income.

Policy categories: `payment_isolation`, `revenue_privacy`, `transaction_access`

## Data Relationships and Constraints

### Referential Integrity
Establish foreign key relationships maintaining data consistency across licensing transactions, script access, and user profiles. Use cascade rules appropriately to handle account deletions while preserving historical licensing data for legal compliance.

Critical relationships: User → Script ownership, Licensing → Access grants, Production → Reporting data

### Constraint Design
Implement database constraints ensuring data quality including email uniqueness, valid licensing states, proper date ranges for productions, and required metadata completeness for published scripts.

Constraint types: `unique_constraints`, `check_constraints`, `not_null_requirements`, `date_validations`

## Performance Optimization

### Indexing Strategy
Create indexes supporting common query patterns including script searches by genre/cast size, user lookups by role, licensing transaction history, and production report aggregations. Balance query performance with write overhead for frequently updated tables.

Index categories: `search_indexes`, `relationship_indexes`, `temporal_indexes`, `composite_indexes`

### Query Optimization
Design table structures supporting efficient joins for complex queries like script recommendations, licensing history, and production analytics. Use materialized views for expensive aggregations and implement proper pagination for large result sets.

Optimization techniques: `join_optimization`, `aggregation_views`, `pagination_design`, `query_caching`

## Security and Compliance

### Data Encryption
Implement column-level encryption for sensitive data including payment information, personal contact details, and proprietary script content. Use Supabase's built-in encryption features while maintaining queryability for necessary operations.

Encryption targets: `payment_data`, `contact_information`, `script_content`, `personal_details`

### Audit Trail Design
Create comprehensive audit logging for all data modifications including script uploads, licensing transactions, user profile changes, and administrative actions. Maintain immutable audit records for compliance and dispute resolution.

Audit categories: `user_actions`, `financial_transactions`, `content_modifications`, `access_events`

### Backup and Recovery
Implement automated backup strategies with point-in-time recovery capabilities. Design backup retention policies balancing storage costs with regulatory requirements for financial and copyright data preservation.

Backup components: `automated_backups`, `point_in_time_recovery`, `cross_region_replication`, `retention_policies`

## Integration Points

### External Service Integration
Design database schema supporting integration with Stripe for payment processing, AWS S3 for file storage, and external copyright registration services. Maintain synchronization between external service states and internal database records.

Integration areas: `payment_sync`, `file_storage_refs`, `copyright_tracking`, `notification_queue`

### API Data Layer
Structure database access patterns supporting the application's API layer with efficient data fetching for script profiles, user dashboards, and licensing workflows. Design database functions for complex operations reducing API-database round trips.

API support: `profile_aggregation`, `dashboard_queries`, `licensing_workflows`, `search_operations`