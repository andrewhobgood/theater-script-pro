# Theater Script Pro Backend

Backend API server for the Theater Script Pro platform - a script licensing marketplace for playwrights and theater companies.

## Architecture

- **Framework**: Express.js with TypeScript
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **File Storage**: AWS S3 (configured but not yet implemented)
- **Payment Processing**: Stripe (configured but not yet implemented)
- **Email Service**: Resend (configured but not yet implemented)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your actual credentials
```

3. Run development server:
```bash
npm run dev
```

The server will start on http://localhost:3001

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run type-check` - Check TypeScript types

## API Endpoints

### Health Check
- `GET /health` - Server health status
- `GET /api/v1` - API information

### Authentication (To be implemented)
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/verify-otp`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

### Scripts (To be implemented)
- `GET /api/v1/scripts` - List scripts
- `GET /api/v1/scripts/:id` - Get script details
- `POST /api/v1/scripts` - Create script (playwright only)
- `PUT /api/v1/scripts/:id` - Update script
- `DELETE /api/v1/scripts/:id` - Delete script

### Licenses (To be implemented)
- `GET /api/v1/licenses` - List user's licenses
- `POST /api/v1/licenses` - Create new license
- `GET /api/v1/licenses/:id` - Get license details

### Payments (To be implemented)
- `POST /api/v1/payments/create-intent`
- `POST /api/v1/payments/webhook`
- `GET /api/v1/payments/history`

## Project Structure

```
backend/
├── src/
│   ├── api/          # Route handlers
│   ├── services/     # Business logic
│   ├── middleware/   # Express middleware
│   ├── utils/        # Utility functions
│   ├── types/        # TypeScript types
│   ├── config/       # Configuration
│   ├── app.ts        # Express app setup
│   └── index.ts      # Server entry point
├── tests/            # Test files
└── logs/             # Log files
```

## Security

- Helmet.js for security headers
- CORS configured for frontend origin
- Rate limiting on API endpoints
- Input validation with Joi
- JWT authentication (to be implemented)
- Row Level Security via Supabase

## Development Guidelines

1. All new endpoints should be documented
2. Use TypeScript strict mode
3. Follow RESTful conventions
4. Implement proper error handling
5. Add request validation
6. Write tests for new features