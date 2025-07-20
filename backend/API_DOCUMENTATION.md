# Theater Script Pro API Documentation

Base URL: `http://localhost:3001/api/v1`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Endpoints

### Authentication

#### Register New User
`POST /auth/register`

**Body:**
```json
{
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "playwright", // or "theater_company"
  "company_name": "Example Theater", // required for theater_company
  "is_educational": false // optional for theater_company
}
```

**Response:**
```json
{
  "message": "User registered successfully. Please check your email for verification code.",
  "profile": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "playwright"
  }
}
```

#### Login
`POST /auth/login`

**Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Verification code sent to your email"
}
```

#### Verify OTP
`POST /auth/verify-otp`

**Body:**
```json
{
  "email": "user@example.com",
  "token": "123456"
}
```

**Response:**
```json
{
  "access_token": "jwt_token",
  "refresh_token": "refresh_token",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "profile": {
    "id": "uuid",
    "first_name": "John",
    "last_name": "Doe",
    "role": "playwright",
    "is_verified": true
  }
}
```

#### Refresh Token
`POST /auth/refresh`

**Body:**
```json
{
  "refresh_token": "refresh_token"
}
```

#### Get Current User
`GET /auth/me` 🔒

**Response:**
```json
{
  "user": { /* Supabase user object */ },
  "profile": { /* User profile */ }
}
```

#### Logout
`POST /auth/logout` 🔒

### Users

#### Get User Profile
`GET /users/profile` 🔒

**Response includes role-specific data:**
- Playwrights: includes their scripts
- Theater Companies: includes their licenses

#### Update Profile
`PUT /users/profile` 🔒

**Body:**
```json
{
  "bio": "Updated bio",
  "website": "https://example.com",
  "location": {
    "city": "New York",
    "state": "NY",
    "country": "USA"
  },
  "social_media": {
    "twitter": "@handle",
    "instagram": "@handle"
  }
}
```

#### Get Public Profile
`GET /users/:id/public`

#### Search Users
`GET /users/search?q=john&role=playwright&limit=20&offset=0`

#### Get All Playwrights
`GET /users/playwrights?limit=20&offset=0`

#### Get All Theater Companies
`GET /users/theater-companies?limit=20&offset=0&is_educational=true`

### Scripts

#### Get Published Scripts
`GET /scripts?genre=Drama&min_cast=2&max_cast=10&limit=20&offset=0`

**Query Parameters:**
- `genre`: Filter by genre
- `min_cast`: Minimum cast size
- `max_cast`: Maximum cast size
- `min_duration`: Minimum duration in minutes
- `max_duration`: Maximum duration in minutes
- `max_price`: Maximum standard price
- `sort`: Sort field (created_at, title, standard_price, average_rating)
- `order`: Sort order (asc, desc)

#### Get Script Details
`GET /scripts/:id`

#### Search Scripts
`GET /scripts/search?q=hamlet&limit=20&offset=0`

#### Get My Scripts (Playwright)
`GET /scripts/my/scripts?status=published` 🔒

#### Create Script (Playwright)
`POST /scripts` 🔒

**Body:**
```json
{
  "title": "My New Play",
  "description": "A compelling drama about...",
  "synopsis": "Full synopsis here...",
  "genre": "Drama",
  "cast_size_min": 4,
  "cast_size_max": 8,
  "duration_minutes": 120,
  "language": "English",
  "age_rating": "PG",
  "themes": ["family", "redemption"],
  "technical_requirements": {
    "set": "Single location",
    "lighting": "Basic",
    "sound": "Minimal"
  },
  "standard_price": 75.00,
  "premium_price": 150.00,
  "educational_price": 50.00
}
```

#### Update Script (Playwright)
`PUT /scripts/:id` 🔒

#### Delete Script (Playwright)
`DELETE /scripts/:id` 🔒

**Note:** Scripts with active licenses cannot be deleted, only archived.

#### Publish Script (Playwright)
`POST /scripts/:id/publish` 🔒

#### Unpublish Script (Playwright)
`POST /scripts/:id/unpublish` 🔒

#### Upload Script File (Playwright)
`POST /scripts/:id/upload` 🔒

**Body:** Form-data with file field named "script"
- Allowed formats: PDF, DOC, DOCX, TXT
- Max size: 10MB

#### Upload Cover Image (Playwright)
`POST /scripts/:id/cover` 🔒

**Body:** Form-data with file field named "coverImage"
- Allowed formats: JPEG, PNG, WebP
- Max size: 5MB

#### Delete Script Files (Playwright)
`DELETE /scripts/:id/file` 🔒

#### Get Script Reviews
`GET /scripts/:id/reviews?limit=20&offset=0`

#### Create Review (Theater Company with License)
`POST /scripts/:id/reviews` 🔒

**Body:**
```json
{
  "rating": 5,
  "title": "Excellent script!",
  "comment": "Our audience loved this production..."
}
```

### Licenses

#### Get My Licenses (Theater Company)
`GET /licenses/my?status=active&limit=20&offset=0` 🔒

#### Create License (Theater Company)
`POST /licenses` 🔒

**Body:**
```json
{
  "script_id": "uuid",
  "license_type": "standard", // or "premium", "educational"
  "performance_dates": [
    {
      "date": "2024-03-15",
      "time": "19:30"
    },
    {
      "date": "2024-03-16",
      "time": "14:00"
    }
  ],
  "venue_name": "Community Theater",
  "venue_capacity": 250,
  "special_terms": "Additional terms if any"
}
```

#### Get License Details
`GET /licenses/:id` 🔒

#### Get Licenses for My Scripts (Playwright)
`GET /licenses/playwright/licenses?script_id=uuid&status=active` 🔒

#### Download Script (Theater Company)
`GET /licenses/:id/download` 🔒

**Response:**
```json
{
  "download_url": "presigned_s3_url",
  "expires_in": 3600,
  "script_title": "Script Title"
}
```

#### Update Performance Dates (Theater Company)
`PUT /licenses/:id/performance-dates` 🔒

**Body:**
```json
{
  "performance_dates": [
    {
      "date": "2024-03-20",
      "time": "19:30"
    }
  ]
}
```

## Error Responses

All errors follow this format:
```json
{
  "error": {
    "message": "Error description",
    "details": [ /* Validation errors if applicable */ ]
  }
}
```

**Common Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting

API requests are limited to 100 requests per 15 minutes per IP address.

## File Upload Limits

- Script files: 10MB max (PDF, DOC, DOCX, TXT)
- Cover images: 5MB max (JPEG, PNG, WebP)

## Notes

- 🔒 indicates protected endpoints requiring authentication
- All timestamps are in ISO 8601 format
- Prices are in USD
- Pagination uses `limit` and `offset` parameters
- Search queries use case-insensitive partial matching