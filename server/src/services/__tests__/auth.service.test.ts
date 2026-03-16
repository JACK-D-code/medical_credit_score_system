/**
 * Authentication Service Tests
 * 
 * These tests verify the core authentication functionality:
 * - Password hashing with bcrypt (salt rounds >= 12)
 * - JWT token generation (access + refresh tokens)
 * - Token verification
 * - Session management
 */

// Mock Redis before importing anything else
jest.mock('../../config/redis', () => ({
  __esModule: true,
  default: {
    setex: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
    exists: jest.fn(),
    zadd: jest.fn(),
    zrange: jest.fn(),
    zrem: jest.fn(),
    zcard: jest.fn(),
    expire: jest.fn(),
    rpush: jest.fn(),
    lrange: jest.fn(),
    on: jest.fn(),
  },
}));

// Mock Prisma
jest.mock('../../utils/prisma', () => ({
  __esModule: true,
  default: {
    session: {
      create: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

// Mock SessionService
jest.mock('../session.service', () => ({
  SessionService: {
    createSession: jest.fn(),
    validateSession: jest.fn(),
    refreshSession: jest.fn(),
    invalidateSession: jest.fn(),
    invalidateAllUserSessions: jest.fn(),
    getUserSessions: jest.fn(),
    cleanupExpiredSessions: jest.fn(),
  },
}));

import { AuthService } from '../auth.service';
import { SessionService } from '../session.service';

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Password Hashing', () => {
    it('should hash password with bcrypt salt rounds >= 12', async () => {
      const password = 'TestPassword123!';
      const hash = await AuthService.hashPassword(password);
      
      // Verify hash is generated
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      
      // Verify hash starts with bcrypt identifier
      expect(hash.startsWith('$2a$') || hash.startsWith('$2b$')).toBe(true);
      
      // Extract salt rounds from hash (format: $2a$rounds$...)
      const rounds = parseInt(hash.split('$')[2]);
      expect(rounds).toBeGreaterThanOrEqual(12);
    });

    it('should verify correct password', async () => {
      const password = 'TestPassword123!';
      const hash = await AuthService.hashPassword(password);
      
      const isValid = await AuthService.verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'TestPassword123!';
      const wrongPassword = 'WrongPassword456!';
      const hash = await AuthService.hashPassword(password);
      
      const isValid = await AuthService.verifyPassword(wrongPassword, hash);
      expect(isValid).toBe(false);
    });
  });

  describe('Token Generation', () => {
    it('should generate access and refresh token pair', () => {
      const payload = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'provider',
      };

      const tokenPair = AuthService.generateTokenPair(payload);

      expect(tokenPair).toBeDefined();
      expect(tokenPair.accessToken).toBeDefined();
      expect(tokenPair.refreshToken).toBeDefined();
      expect(typeof tokenPair.accessToken).toBe('string');
      expect(typeof tokenPair.refreshToken).toBe('string');
      expect(tokenPair.accessToken).not.toBe(tokenPair.refreshToken);
    });

    it('should generate different tokens for different users', () => {
      const payload1 = {
        id: 'user-123',
        email: 'test1@example.com',
        role: 'provider',
      };

      const payload2 = {
        id: 'user-456',
        email: 'test2@example.com',
        role: 'financial_admin',
      };

      const tokenPair1 = AuthService.generateTokenPair(payload1);
      const tokenPair2 = AuthService.generateTokenPair(payload2);

      expect(tokenPair1.accessToken).not.toBe(tokenPair2.accessToken);
      expect(tokenPair1.refreshToken).not.toBe(tokenPair2.refreshToken);
    });
  });

  describe('Token Verification', () => {
    it('should verify and decode valid token', () => {
      const payload = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'provider',
      };

      const tokenPair = AuthService.generateTokenPair(payload);
      const decoded = AuthService.verifyToken(tokenPair.accessToken);

      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(payload.id);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.role).toBe(payload.role);
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => {
        AuthService.verifyToken(invalidToken);
      }).toThrow('Invalid or expired token');
    });

    it('should throw error for malformed token', () => {
      const malformedToken = 'not-a-jwt-token';

      expect(() => {
        AuthService.verifyToken(malformedToken);
      }).toThrow('Invalid or expired token');
    });
  });

  describe('Token Hashing', () => {
    it('should hash token consistently', () => {
      const token = 'sample.jwt.token';
      
      const hash1 = AuthService.hashToken(token);
      const hash2 = AuthService.hashToken(token);

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA-256 produces 64 character hex string
    });

    it('should produce different hashes for different tokens', () => {
      const token1 = 'sample.jwt.token1';
      const token2 = 'sample.jwt.token2';

      const hash1 = AuthService.hashToken(token1);
      const hash2 = AuthService.hashToken(token2);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('Token Refresh Logic', () => {
    it('should refresh access token with valid refresh token', async () => {
      const payload = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'provider',
      };

      // Generate initial token pair
      const initialTokenPair = AuthService.generateTokenPair(payload);

      // Mock SessionService.refreshSession to return session data
      const mockSessionData = {
        userId: payload.id,
        email: payload.email,
        role: payload.role,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      };

      (SessionService.refreshSession as jest.Mock).mockResolvedValue(mockSessionData);

      // Wait a moment to ensure different timestamps in JWT
      await new Promise(resolve => setTimeout(resolve, 1100));

      // Generate new access token
      const newAccessToken = AuthService.generateTokenPair(payload).accessToken;

      // Refresh the token
      const refreshedTokenPair = await AuthService.refreshAccessToken(
        initialTokenPair.refreshToken,
        newAccessToken
      );

      expect(refreshedTokenPair).toBeDefined();
      expect(refreshedTokenPair?.accessToken).toBeDefined();
      expect(refreshedTokenPair?.refreshToken).toBeDefined();
      
      // Verify the new token contains correct payload
      const decoded = AuthService.verifyToken(refreshedTokenPair!.accessToken);
      expect(decoded.id).toBe(payload.id);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.role).toBe(payload.role);
      
      // Verify SessionService was called
      expect(SessionService.refreshSession).toHaveBeenCalledWith(
        initialTokenPair.refreshToken,
        newAccessToken
      );
    });

    it('should return null for invalid refresh token', async () => {
      const invalidRefreshToken = 'invalid.refresh.token';
      const newAccessToken = 'new.access.token';

      const result = await AuthService.refreshAccessToken(
        invalidRefreshToken,
        newAccessToken
      );

      expect(result).toBeNull();
    });

    it('should return null when session does not exist', async () => {
      const payload = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'provider',
      };

      const tokenPair = AuthService.generateTokenPair(payload);

      // Mock SessionService.refreshSession to return null (session not found)
      (SessionService.refreshSession as jest.Mock).mockResolvedValue(null);

      const newAccessToken = AuthService.generateTokenPair(payload).accessToken;

      const result = await AuthService.refreshAccessToken(
        tokenPair.refreshToken,
        newAccessToken
      );

      expect(result).toBeNull();
    });

    it('should handle expired refresh token', async () => {
      // Create a token that expires immediately
      const jwt = require('jsonwebtoken');
      const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_change_in_production';
      
      const expiredToken = jwt.sign(
        { id: 'user-123', email: 'test@example.com', role: 'provider' },
        JWT_SECRET,
        { expiresIn: '0s' } // Expires immediately
      );

      // Wait a moment to ensure token is expired
      await new Promise(resolve => setTimeout(resolve, 100));

      const newAccessToken = 'new.access.token';

      const result = await AuthService.refreshAccessToken(
        expiredToken,
        newAccessToken
      );

      expect(result).toBeNull();
    });
  });

  describe('Session Management', () => {
    it('should create session with tokens and metadata', async () => {
      const userId = 'user-123';
      const email = 'test@example.com';
      const role = 'provider';
      const tokenPair = AuthService.generateTokenPair({ id: userId, email, role });
      const sessionData = {
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        deviceType: 'desktop',
      };

      // Mock SessionService.createSession
      const mockSessionId = 'session-123';
      (SessionService.createSession as jest.Mock).mockResolvedValue(mockSessionId);

      const sessionId = await AuthService.createSession(
        userId,
        email,
        role,
        tokenPair.accessToken,
        tokenPair.refreshToken,
        sessionData
      );

      expect(sessionId).toBe(mockSessionId);
      expect(SessionService.createSession).toHaveBeenCalledWith(
        userId,
        email,
        role,
        tokenPair.accessToken,
        tokenPair.refreshToken,
        sessionData
      );
    });

    it('should validate active session', async () => {
      const payload = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'provider',
      };
      const tokenPair = AuthService.generateTokenPair(payload);

      // Mock SessionService.validateSession to return session data
      const mockSessionData = {
        userId: payload.id,
        email: payload.email,
        role: payload.role,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      };
      (SessionService.validateSession as jest.Mock).mockResolvedValue(mockSessionData);

      const isValid = await AuthService.validateSession(tokenPair.accessToken);

      expect(isValid).toBe(true);
      expect(SessionService.validateSession).toHaveBeenCalledWith(tokenPair.accessToken);
    });

    it('should return false for invalid session', async () => {
      const invalidToken = 'invalid.token';

      // Mock SessionService.validateSession to return null
      (SessionService.validateSession as jest.Mock).mockResolvedValue(null);

      const isValid = await AuthService.validateSession(invalidToken);

      expect(isValid).toBe(false);
    });

    it('should invalidate session on logout', async () => {
      const payload = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'provider',
      };
      const tokenPair = AuthService.generateTokenPair(payload);

      // Mock SessionService.invalidateSession
      (SessionService.invalidateSession as jest.Mock).mockResolvedValue(undefined);

      await AuthService.invalidateSession(tokenPair.accessToken);

      expect(SessionService.invalidateSession).toHaveBeenCalledWith(tokenPair.accessToken);
    });

    it('should invalidate all user sessions', async () => {
      const userId = 'user-123';

      // Mock SessionService.invalidateAllUserSessions
      (SessionService.invalidateAllUserSessions as jest.Mock).mockResolvedValue(undefined);

      await AuthService.invalidateAllUserSessions(userId);

      expect(SessionService.invalidateAllUserSessions).toHaveBeenCalledWith(userId);
    });

    it('should get user active sessions for multi-device tracking', async () => {
      const userId = 'user-123';
      const mockSessions = [
        {
          sessionId: 'session-1',
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0 (Windows)',
          deviceType: 'desktop',
          createdAt: new Date().toISOString(),
          lastActivity: new Date().toISOString(),
        },
        {
          sessionId: 'session-2',
          ipAddress: '192.168.1.2',
          userAgent: 'Mozilla/5.0 (iPhone)',
          deviceType: 'mobile',
          createdAt: new Date().toISOString(),
          lastActivity: new Date().toISOString(),
        },
      ];

      // Mock SessionService.getUserSessions
      (SessionService.getUserSessions as jest.Mock).mockResolvedValue(mockSessions);

      const sessions = await AuthService.getUserSessions(userId);

      expect(sessions).toEqual(mockSessions);
      expect(sessions).toHaveLength(2);
      expect(sessions[0].deviceType).toBe('desktop');
      expect(sessions[1].deviceType).toBe('mobile');
      expect(SessionService.getUserSessions).toHaveBeenCalledWith(userId);
    });

    it('should cleanup expired sessions', async () => {
      // Mock SessionService.cleanupExpiredSessions
      (SessionService.cleanupExpiredSessions as jest.Mock).mockResolvedValue(undefined);

      await AuthService.cleanupExpiredSessions();

      expect(SessionService.cleanupExpiredSessions).toHaveBeenCalled();
    });
  });
});
