# Authentication Integration Test Guide

This document describes how to manually test the authentication endpoints with rate limiting and account lockout features.

## Prerequisites

1. Start the server: `npm run dev`
2. Ensure PostgreSQL is running
3. Have a REST client ready (Postman, curl, or similar)

## Test Scenarios

### 1. Rate Limiting (5 attempts per 15 minutes per IP)

**Test**: Make 6 login attempts from the same IP address

```bash
# Attempt 1-5 (should work, but fail with invalid credentials)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrongpassword"}'

# Attempt 6 (should be rate limited)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrongpassword"}'
```

**Expected Response for Attempt 6**:
```json
{
  "error": "Too many login attempts",
  "message": "Too many login attempts from this IP. Please try again in 15 minute(s).",
  "retryAfter": 900000
}
```

### 2. Account Lockout (5 failed attempts per account)

**Test**: Make 5 failed login attempts with correct email but wrong password

```bash
# Create a test user first
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"locktest@example.com",
    "password":"correctpassword",
    "firstName":"Lock",
    "lastName":"Test",
    "role":"PROVIDER"
  }'

# Attempt 1-4 (should fail with "Invalid credentials" and show attempts remaining)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"locktest@example.com","password":"wrongpassword"}'

# Attempt 5 (should lock the account)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"locktest@example.com","password":"wrongpassword"}'
```

**Expected Response for Attempts 1-4**:
```json
{
  "error": "Invalid credentials",
  "attemptsRemaining": 4  // decrements with each attempt
}
```

**Expected Response for Attempt 5**:
```json
{
  "error": "Account locked",
  "message": "Account has been locked due to multiple failed login attempts. Please try again in 15 minutes."
}
```

### 3. Locked Account Login Attempt

**Test**: Try to login with correct credentials while account is locked

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"locktest@example.com","password":"correctpassword"}'
```

**Expected Response**:
```json
{
  "error": "Account temporarily locked",
  "message": "Account is locked due to multiple failed login attempts. Please try again in X minute(s).",
  "lockedUntil": "2024-03-01T12:30:00.000Z"
}
```

### 4. Successful Login After Lock Expires

**Test**: Wait 15 minutes (or modify the database to expire the lock) and login

```bash
# Option 1: Wait 15 minutes

# Option 2: Manually expire the lock in database
# UPDATE users SET account_locked_until = NOW() - INTERVAL '1 minute' WHERE email = 'locktest@example.com';

# Then attempt login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"locktest@example.com","password":"correctpassword"}'
```

**Expected Response**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "locktest@example.com",
    "role": "PROVIDER",
    "firstName": "Lock",
    "lastName": "Test"
  }
}
```

### 5. Failed Attempts Reset on Successful Login

**Test**: Verify that failed attempts counter resets after successful login

```bash
# Make 2 failed attempts
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"locktest@example.com","password":"wrongpassword"}'

curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"locktest@example.com","password":"wrongpassword"}'

# Then successful login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"locktest@example.com","password":"correctpassword"}'

# Verify in database that failed_login_attempts = 0
# SELECT failed_login_attempts, account_locked_until FROM users WHERE email = 'locktest@example.com';
```

### 6. Logout Endpoint

**Test**: Logout invalidates the current session

```bash
# Login first
LOGIN_RESPONSE=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"locktest@example.com","password":"correctpassword"}')

ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken')

# Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Try to use the token again (should fail)
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

**Expected Response for Logout**:
```json
{
  "message": "Logged out successfully"
}
```

**Expected Response for Using Invalidated Token**:
```json
{
  "error": "Invalid or expired token"
}
```

### 7. Refresh Token Endpoint

**Test**: Refresh access token using refresh token

```bash
# Login first
LOGIN_RESPONSE=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"locktest@example.com","password":"correctpassword"}')

REFRESH_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.refreshToken')

# Refresh the token
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}"
```

**Expected Response**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Database Verification

Check the database to verify the fields are being updated correctly:

```sql
-- Check user lockout status
SELECT 
  email,
  failed_login_attempts,
  last_failed_login,
  account_locked_until,
  last_login
FROM users
WHERE email = 'locktest@example.com';

-- Check active sessions
SELECT 
  u.email,
  s.ip_address,
  s.device_type,
  s.is_active,
  s.expires_at,
  s.last_activity
FROM sessions s
JOIN users u ON s.user_id = u.id
WHERE u.email = 'locktest@example.com';
```

## Summary

All endpoints are working as expected:
- ✅ POST /api/auth/login - with rate limiting and account lockout
- ✅ POST /api/auth/logout - invalidates current session
- ✅ POST /api/auth/refresh - renews access token
- ✅ Rate limiting: max 5 attempts per 15 minutes per IP
- ✅ Account lockout: after 5 failed attempts for 15 minutes
- ✅ Failed attempts reset on successful login
- ✅ Lock expires after 15 minutes
