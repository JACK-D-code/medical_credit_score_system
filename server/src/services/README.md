# Authentication Service Documentation

## Overview

The authentication service provides secure JWT-based authentication with access and refresh tokens, session management, and bcrypt password hashing.

## Features

### 1. Password Security
- **Bcrypt hashing** with salt rounds >= 12 (meets security requirement 14.1)
- Secure password verification
- Protection against rainbow table attacks

### 2. JWT Token Management
- **Access tokens**: Short-lived (15 minutes) for API authentication
- **Refresh tokens**: Long-lived (7 days) for token renewal
- Automatic token refresh capability
- Token verification and validation

### 3. Session Management
- Database-backed session storage
- Multi-device session tracking
- Session invalidation (logout)
- Automatic cleanup of expired sessions
- IP address and user agent tracking

## API Endpoints

### Public Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "role": "provider",
  "firstName": "John",
  "lastName": "Doe",
  "hospitalName": "City Hospital"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "provider",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### POST /api/auth/login
Authenticate user and receive tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "provider",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### POST /api/auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### Protected Endpoints

All protected endpoints require `Authorization: Bearer <accessToken>` header.

#### GET /api/auth/me
Get current user information.

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "provider",
  "firstName": "John",
  "lastName": "Doe",
  "isActive": true,
  "lastLogin": "2024-01-15T10:30:00Z"
}
```

#### POST /api/auth/logout
Logout from current session.

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

#### POST /api/auth/logout-all
Logout from all devices (invalidate all sessions).

**Response:**
```json
{
  "message": "Logged out from all devices successfully"
}
```

#### GET /api/auth/sessions
Get list of active sessions.

**Response:**
```json
{
  "sessions": [
    {
      "id": "uuid",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "deviceType": "web",
      "lastActivity": "2024-01-15T10:30:00Z",
      "createdAt": "2024-01-15T09:00:00Z"
    }
  ]
}
```

## Usage Examples

### Client-Side Token Management

```typescript
// Store tokens after login
const { accessToken, refreshToken } = await login(email, password);
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);

// Make authenticated requests
const response = await fetch('/api/patients', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
});

// Handle token expiration
if (response.status === 401) {
  const newTokens = await refreshAccessToken(localStorage.getItem('refreshToken'));
  localStorage.setItem('accessToken', newTokens.accessToken);
  localStorage.setItem('refreshToken', newTokens.refreshToken);
  // Retry original request
}
```

### Automatic Token Refresh

```typescript
// Refresh token before it expires (recommended)
setInterval(async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken) {
    try {
      const newTokens = await refreshAccessToken(refreshToken);
      localStorage.setItem('accessToken', newTokens.accessToken);
      localStorage.setItem('refreshToken', newTokens.refreshToken);
    } catch (error) {
      // Refresh token expired, redirect to login
      window.location.href = '/login';
    }
  }
}, 14 * 60 * 1000); // Refresh every 14 minutes (before 15-minute expiry)
```

## Middleware Usage

### Protect Routes

```typescript
import { authenticateToken, requireRole, requireAnyRole } from '../middleware/auth';

// Require authentication
router.get('/protected', authenticateToken, handler);

// Require specific role
router.get('/admin-only', authenticateToken, requireRole('super_admin'), handler);

// Require any of multiple roles
router.get('/financial', authenticateToken, requireAnyRole(['super_admin', 'financial_admin']), handler);
```

## Security Considerations

1. **Token Storage**: Store tokens securely (httpOnly cookies recommended for production)
2. **HTTPS**: Always use HTTPS in production to protect tokens in transit
3. **Token Expiry**: Access tokens expire in 15 minutes to limit exposure
4. **Refresh Token Rotation**: New refresh token issued on each refresh
5. **Session Tracking**: All sessions tracked with IP and user agent
6. **Password Requirements**: Enforce strong password policies in production

## Environment Variables

```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
```

**Important**: Change the JWT_SECRET in production to a strong, random value (minimum 32 characters).

## Testing

Run authentication tests:
```bash
npm test -- auth.service.test.ts
```

## Requirements Satisfied

- ✅ **Requirement 1.1**: Bcrypt password hashing with salt rounds >= 12
- ✅ **Requirement 1.2**: JWT tokens (access + refresh) for secure sessions
- ✅ **Requirement 1.3**: Role-based access control middleware
- ✅ **Requirement 1.4**: Automatic token refresh logic
- ✅ **Requirement 1.5**: Session invalidation on logout
- ✅ **Requirement 14.1**: Secure password storage with bcrypt

## Future Enhancements

- Rate limiting for login attempts (Requirement 1.6)
- Account lockout after failed attempts (Requirement 1.6)
- Multi-factor authentication (MFA)
- OAuth 2.0 integration
- Biometric authentication support
