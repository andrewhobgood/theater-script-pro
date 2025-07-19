# File Storage & Security Architecture

## Overview

TheaterScript Pro implements a comprehensive file storage and security system using AWS S3 to protect intellectual property while enabling controlled access to scripts. The architecture balances security requirements with user experience, providing secure hosting for full scripts and perusal versions with sophisticated access controls.

## Storage Architecture

```
S3 Bucket Structure:
scripts/
├── full/
│   ├── {playwright-id}/
│   │   └── {script-id}/
│   │       ├── script.pdf
│   │       └── metadata.json
├── perusal/
│   ├── {playwright-id}/
│   │   └── {script-id}/
│   │       ├── perusal.pdf
│   │       └── watermark-config.json
└── temp/
    └── {upload-session-id}/
        └── pending-files/
```

The storage system segregates full scripts from perusal versions, enabling different access control policies. Each playwright maintains isolated storage spaces with script-specific folders containing both content and metadata.

## Security Flow Architecture

```
Access Request Flow:
User Request → Authentication Check → Role Validation → License Verification
     ↓
Permission Matrix → S3 Policy Check → Presigned URL Generation
     ↓
Time-Limited Access → Download Tracking → Usage Analytics
```

## Access Control Mechanisms

### Role-Based Permissions
Implement granular access control based on user roles and licensing status. Theater companies gain access to full scripts only after successful licensing transactions, while perusal scripts remain accessible with viewing restrictions.

### Presigned URL Generation
Generate time-limited, secure URLs for script access using AWS SDK with configurable expiration times. Full scripts receive shorter expiration windows (1-2 hours) while perusal scripts allow longer access periods (24-48 hours) for evaluation purposes.

### License Verification Integration
Integrate with Stripe payment records and licensing database to verify access rights before generating download URLs. Maintain audit trails linking file access to specific licensing transactions.

## Upload Security Pipeline

### Multi-Stage Validation
Implement comprehensive file validation including format verification, virus scanning, and content analysis. Reject uploads that don't meet security standards or contain suspicious content.

### Temporary Storage Processing
Use temporary S3 prefixes for initial uploads, moving files to permanent storage only after successful validation and metadata processing. This prevents incomplete or malicious uploads from reaching production storage.

### Metadata Extraction
Extract and validate script metadata during upload, including page count, text content analysis, and format verification. Store metadata separately to enable search functionality without exposing script content.

## Perusal Script Protection

### Watermarking Integration
Apply dynamic watermarking to perusal scripts based on requesting user information and timestamp. Watermarks include user identification, access timestamp, and usage restrictions to discourage unauthorized distribution.

### Viewing Restrictions
Implement browser-based viewing restrictions for perusal scripts using React PDF viewer with disabled download, print, and text selection capabilities. Apply additional JavaScript obfuscation to prevent easy content extraction.

### Access Logging
Track all perusal script access including user identity, viewing duration, page interactions, and download attempts. Generate reports for playwrights showing script engagement metrics and potential licensing opportunities.

## File Lifecycle Management

### Automated Cleanup
Implement S3 lifecycle policies to automatically remove temporary files, expired cached content, and orphaned uploads. Maintain active scripts indefinitely while cleaning up processing artifacts.

### Version Control
Support script versioning with unique identifiers for each upload iteration. Maintain historical versions for licensing continuity while allowing playwrights to update scripts with new revisions.

### Backup and Recovery
Establish automated backup procedures with cross-region replication for critical script content. Implement recovery procedures for accidental deletions or corruption events.

## Performance Optimization

### CDN Integration
Configure CloudFront distribution for global script delivery with edge caching for perusal scripts and geographic optimization. Maintain security headers and access controls through CDN configuration.

### Compression and Optimization
Apply intelligent compression for script files while maintaining quality standards. Optimize file sizes for faster delivery without compromising readability or print quality.

### Concurrent Access Handling
Design system to handle multiple simultaneous downloads of popular scripts while maintaining security controls. Implement rate limiting and abuse detection for unusual access patterns.

## Monitoring and Analytics

### Access Analytics
Track comprehensive file access metrics including download success rates, geographic distribution, and user engagement patterns. Generate insights for playwrights about script popularity and licensing opportunities.

### Security Monitoring
Implement real-time monitoring for suspicious access patterns, unauthorized download attempts, and potential security breaches. Integrate with Sentry for immediate alerting on security events.

### Cost Optimization
Monitor S3 storage costs and access patterns to optimize storage classes and lifecycle policies. Implement intelligent tiering based on script popularity and access frequency.

## Integration Points

### Authentication Integration
Seamlessly integrate with Supabase authentication to verify user identity before granting file access. Maintain session consistency across file operations and user interactions.

### Payment System Integration
Coordinate with Stripe payment processing to immediately grant script access upon successful licensing transactions. Handle payment failures and refunds by revoking file access appropriately.

### Email Notification Integration
Trigger automated email notifications through Resend for successful downloads, access grants, and security alerts. Provide playwrights with detailed access reports and licensing activity summaries.