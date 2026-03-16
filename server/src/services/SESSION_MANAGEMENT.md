# Session Management Service

## Overview

The Session Management Service provides Redis-based session storage with TTL (Time To Live), multi-device session tracking, and comprehensive activity logging for audit trails. This implementation enhances the authentication system with better performance and scalability compared to PostgreSQL-only session storage.

## Features

### 1. Redis-Based Session Storage with TTL
- **Access Token TTL**: 15 minutes
- **Refresh Token TTL**: 7 days
- **Activity Log TTL**: 30 days
- Automatic expiration and cleanup
- High-performance session validation

### 2. Multi-Device Session Tracking
- Track multiple active sessions per user
- Store device information (IP address, user agent, device type)
- View all active sessions across devices
- Logout from specific devices or all devices

### 3. Session Activity Logging
- Comprehensive audit trail for all session activities
- Logged activities:
  - `session_created`: When a new session is created
  - `session_validated`: When a session is validated
  - `token_refreshed`: When access token is refreshed
  - `session_invalidated`: When a session is logged out
  - `all_sessions_invalidated`: When all user sessions are logged out
- Activity logs include timestamp, action, IP address, and user agent

### 4. Dual Storage Strategy
- **Redis**: Primary storage for fast session validation and real-time tracking
- **PostgreSQL**: Secondary storage for audit trail and long-term persistence
- Both systems are kept in sync for reliability

## Architecture

### Redis Key Structure

```
session:access:{tokenHash}        - Access token to session data mapping
session:refresh:{tokenHash}       - Refresh token to session data mapping
user:sessions:{userId}            - Sorted set of user's active sessions
session:activity:{sessionId}      - List of session activities
```

### Session Data Structure

```typescript
interface SessionData {
  userId: string;
  email: string;
  role: string;
  ipAddress?: string;
  userAgent?: string;
  deviceType?: string;
  createdAt: string;
  lastActivity: string;
}
```

## API Endpoints

### Get User Sessions
```
GET /api/sessions
Authorization: Bearer {accessToken}

Response:
{
  "sessions": [
    {
      "sessionId": "abc123...",
      "ipAddress": "127.0.0.1",
      "userAgent": "Mozilla/5.0...",
      "deviceType": "web",
      "createdAt": "2024-01-01T00:00:00Z",
      "lastActivity": "2024-01-01T01:00:00Z"
    }
  ],
  "total": 1
}
```

### Get Session Activity
```
GET /api/sessions/:sessionId/activity
Authorization: Bearer {accessToken}

Response:
{
  "sessionId": "abc123...",
  "activities": [
    {
      "timestamp": "2024-01-01T00:00:00Z",
      "action": "session_created",
      "ipAddress": "127.0.0.1",
      "userAgent": "Mozilla/5.0..."
    },
    {
      "timestamp": "2024-01-01T00:30:00Z",
      "action": "session_validated",
      "ipAddress": "127.0.0.1"
    }
  ],
  "total": 2
}
```

### Get Session Statistics (Admin Only)
```
GET /api/sessions/admin/stats
Authorization: Bearer {accessToken}

Response:
{
  "totalActiveSessions": 150,
  "totalActiveUsers": 75,
  "sessionsByDevice": {
    "web": 100,
    "mobile": 40,
    "tablet": 10
  }
}
```

### Cleanup Expired Sessions (Super Admin Only)
```
POST /api/sessions/admin/cleanup
Authorization: Bearer {accessToken}

Response:
{
  "message": "Expired sessions cleaned up successfully"
}
```

## Usage Examples

### Creating a Session (Login)

```typescript
import { SessionService } from './services/session.service';
import { AuthService } from './services/auth.service';

// Generate tokens
const tokenPair = AuthService.generateTokenPair({
  id: user.id,
  email: user.email,
  role: user.role,
});

// Create session
const sessionId = await SessionService.createSession(
  user.id,
  user.email,
  user.role,
  tokenPair.accessToken,
  tokenPair.refreshToken,
  {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    deviceType: 'web',
  }
);
```

### Validating a Session

```typescript
import { SessionService } from './services/session.service';

const sessionData = await SessionService.validateSession(accessToken);

if (sessionData) {
  console.log('Valid session for user:', sessionData.userId);
} else {
  console.log('Invalid or expired session');
}
```

### Getting User Sessions

```typescript
import { SessionService } from './services/session.service';

const sessions = await SessionService.getUserSessions(userId);

console.log(`User has ${sessions.length} active sessions`);
sessions.forEach((session) => {
  console.log(`Device: ${session.deviceType}, Last active: ${session.lastActivity}`);
});
```

### Logging Out (Invalidate Session)

```typescript
import { SessionService } from './services/session.service';

// Logout from current device
await SessionService.invalidateSession(accessToken);

// Logout from all devices
await SessionService.invalidateAllUserSessions(userId);
```

### Getting Session Activity

```typescript
import { SessionService } from './services/session.service';

const activities = await SessionService.getSessionActivity(sessionId);

activities.forEach((activity) => {
  console.log(`${activity.timestamp}: ${activity.action} from ${activity.ipAddress}`);
});
```

## Configuration

### Environment Variables

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_DB=0

# JWT Configuration
JWT_SECRET=your_jwt_secret
```

### TTL Configuration

You can adjust TTL values in `session.service.ts`:

```typescript
const ACCESS_TOKEN_TTL = 15 * 60; // 15 minutes in seconds
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60; // 7 days in seconds
const SESSION_ACTIVITY_TTL = 30 * 24 * 60 * 60; // 30 days in seconds
```

## Maintenance

### Automatic Cleanup

The service includes a cleanup method that should be run periodically (e.g., via cron job):

```typescript
import { SessionService } from './services/session.service';

// Run cleanup every hour
setInterval(async () => {
  await SessionService.cleanupExpiredSessions();
}, 60 * 60 * 1000);
```

### Manual Cleanup

Super admins can trigger manual cleanup via the API:

```bash
curl -X POST http://localhost:3000/api/sessions/admin/cleanup \
  -H "Authorization: Bearer {superAdminAccessToken}"
```

## Security Considerations

1. **Token Hashing**: All tokens are hashed using SHA-256 before storage
2. **Secure Storage**: Sensitive session data is stored in Redis with automatic expiration
3. **Activity Logging**: All session activities are logged for audit purposes
4. **Multi-Device Tracking**: Users can view and manage all their active sessions
5. **Dual Storage**: PostgreSQL backup ensures data persistence even if Redis fails

## Performance Benefits

Compared to PostgreSQL-only session storage:

- **Faster Validation**: Redis in-memory storage provides sub-millisecond session validation
- **Automatic Expiration**: TTL-based expiration eliminates need for manual cleanup queries
- **Scalability**: Redis can handle millions of sessions with consistent performance
- **Real-Time Tracking**: Instant updates for multi-device session tracking

## Monitoring

### Session Statistics

Monitor session health using the stats endpoint:

```typescript
const stats = await SessionService.getSessionStats();

console.log(`Active sessions: ${stats.totalActiveSessions}`);
console.log(`Active users: ${stats.totalActiveUsers}`);
console.log('Sessions by device:', stats.sessionsByDevice);
```

### Redis Health

Monitor Redis connection status:

```typescript
import redis from './config/redis';

redis.on('connect', () => {
  console.log('✅ Redis connected');
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err);
});
```

## Testing

Run the test suite:

```bash
npm test -- session.service.test.ts
```

The test suite covers:
- Session creation
- Session validation
- Session invalidation
- Multi-device tracking
- Activity logging
- Cleanup operations
- Statistics generation

## Migration from PostgreSQL-Only Sessions

The service maintains backward compatibility with PostgreSQL sessions:

1. All session operations are written to both Redis and PostgreSQL
2. Existing PostgreSQL sessions continue to work
3. New sessions benefit from Redis performance
4. Gradual migration as users log in with new sessions

## Troubleshooting

### Redis Connection Issues

If Redis is unavailable, the service will:
1. Log connection errors
2. Retry with exponential backoff
3. Fall back to PostgreSQL for session validation (if implemented)

### Session Not Found

If a session is not found:
1. Check if the token has expired (15 minutes for access, 7 days for refresh)
2. Verify Redis is running and accessible
3. Check if the session was invalidated (logout)
4. Review session activity logs for details

### Performance Issues

If session validation is slow:
1. Check Redis memory usage
2. Monitor Redis connection pool
3. Review network latency between app and Redis
4. Consider Redis clustering for high load

## Requirements Validation

This implementation satisfies the following requirements:

- **Requirement 1.2**: Secure session with JWT tokens (access + refresh)
- **Requirement 1.4**: Automatic session refresh
- **Requirement 1.7**: Session activity logging for audit compliance

Task 3.4 deliverables:
- ✅ Session storage in Redis with TTL
- ✅ Session validation and cleanup logic
- ✅ Multi-device session tracking
- ✅ Session activity logging for audit trail
