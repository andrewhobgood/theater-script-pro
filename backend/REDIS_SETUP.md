# Redis Setup for Theater Script Pro Backend

## Overview

This implementation provides Redis integration for the Theater Script Pro backend with the following features:

- Connection pooling
- Automatic reconnection with retry strategy
- Caching middleware for HTTP responses
- Session management
- Rate limiting
- Various data structure support (strings, hashes, sets)

## Configuration

Add the following environment variables to your `.env` file:

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password  # Optional
REDIS_DB=0                          # Optional, defaults to 0
```

## Installation

Redis dependencies have been installed:
- `ioredis` - A robust, performance-focused Redis client
- `@types/ioredis` - TypeScript definitions

## Core Components

### 1. Redis Service (`src/services/redis.ts`)

The main Redis service provides:
- Connection management
- Basic operations (get, set, delete)
- Cache wrapper with TTL
- Hash operations
- Set operations
- Counter operations

### 2. Cache Middleware (`src/middleware/cache.ts`)

HTTP response caching middleware with:
- Configurable TTL
- Custom key generators
- Cache invalidation
- Conditional caching

### 3. Session Service (`src/services/session.ts`)

Session management using Redis:
- Create/read/update/delete sessions
- Session expiration
- Multi-session support per user

### 4. Redis Rate Limiter (`src/middleware/redisRateLimiter.ts`)

Advanced rate limiting with:
- Sliding window implementation
- Per-user or per-IP limiting
- Configurable skip rules

## Usage Examples

### Basic Caching

```typescript
import { cache, cacheKeyGenerators } from './middleware/cache';

// Cache all scripts for 5 minutes
router.get('/scripts', 
  cache({ ttl: 300 }), 
  getScripts
);

// Cache with custom key generator
router.get('/scripts/:id', 
  cache({ 
    ttl: 600, 
    keyGenerator: cacheKeyGenerators.resource('script', 'id') 
  }), 
  getScript
);
```

### Cache Invalidation

```typescript
import { invalidateCache } from './middleware/cache';

// Invalidate cache after updates
router.put('/scripts/:id', 
  updateScript, 
  invalidateCache(['scripts:*', 'script:*'])
);
```

### Direct Redis Usage

```typescript
import { redisService, cacheKeys } from './services/redis';

// Cache user data
const userData = await redisService.cache(
  cacheKeys.user(userId),
  async () => {
    // Expensive database query
    return await fetchUserFromDB(userId);
  },
  3600 // 1 hour TTL
);

// Set custom data
await redisService.set('custom:key', { data: 'value' }, 300);

// Use counters
const viewCount = await redisService.incr(`views:script:${scriptId}`, 86400);
```

### Session Management

```typescript
import { SessionService } from './services/session';

// Create session
const sessionId = await SessionService.create(userId, email, role);

// Get session
const session = await SessionService.get(sessionId);

// Delete all user sessions
await SessionService.deleteUserSessions(userId);
```

### Rate Limiting

```typescript
import { redisRateLimit } from './middleware/redisRateLimiter';

// Custom rate limiter
const customLimiter = redisRateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  keyGenerator: (req) => req.user?.id || req.ip,
});

router.post('/api/endpoint', customLimiter, handler);
```

## Cache Key Conventions

The `cacheKeys` helper provides consistent key naming:

```typescript
cacheKeys.user(userId)                    // user:{userId}
cacheKeys.script(scriptId)                // script:{scriptId}
cacheKeys.scripts.list(params)            // scripts:list:{params}
cacheKeys.scripts.byUser(userId)          // scripts:user:{userId}
cacheKeys.licenses.byUser(userId)         // licenses:user:{userId}
cacheKeys.session(sessionId)              // session:{sessionId}
cacheKeys.rateLimit(identifier)           // ratelimit:{identifier}
```

## Best Practices

1. **TTL Strategy**: Use appropriate TTL values based on data volatility
   - Static data: 1-24 hours
   - Dynamic data: 5-60 minutes
   - Session data: Match your session timeout

2. **Key Naming**: Use the provided `cacheKeys` helper for consistency

3. **Error Handling**: The service gracefully handles Redis connection issues

4. **Cache Warming**: Consider pre-populating frequently accessed data

5. **Monitoring**: Monitor Redis memory usage and eviction policies

## Development

To run Redis locally:

```bash
# Using Docker
docker run -d -p 6379:6379 redis:alpine

# Using Homebrew (macOS)
brew install redis
brew services start redis

# Using apt (Ubuntu/Debian)
sudo apt-get install redis-server
sudo systemctl start redis-server
```

## Production Considerations

1. **Connection Pooling**: The service uses ioredis which handles connection pooling automatically

2. **Security**: Always use password authentication in production

3. **Persistence**: Configure Redis persistence (RDB/AOF) based on your needs

4. **Memory Management**: Set appropriate `maxmemory` and eviction policies

5. **High Availability**: Consider Redis Sentinel or Redis Cluster for production