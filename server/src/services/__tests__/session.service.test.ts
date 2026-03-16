import { SessionService } from '../session.service';
import redis from '../../config/redis';
import prisma from '../../utils/prisma';

// Mock Redis and Prisma
jest.mock('../../config/redis', () => ({
  __esModule: true,
  default: {
    setex: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
    zadd: jest.fn(),
    zrange: jest.fn(),
    zrem: jest.fn(),
    zcard: jest.fn(),
    expire: jest.fn(),
    exists: jest.fn(),
    keys: jest.fn(),
    rpush: jest.fn(),
    lrange: jest.fn(),
  },
}));

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

describe('SessionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createSession', () => {
    it('should create a session in Redis and PostgreSQL', async () => {
      const userId = 'user-123';
      const email = 'test@example.com';
      const role = 'provider';
      const accessToken = 'access-token-123';
      const refreshToken = 'refresh-token-123';
      const metadata = {
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
        deviceType: 'web',
      };

      (redis.setex as jest.Mock).mockResolvedValue('OK');
      (redis.zadd as jest.Mock).mockResolvedValue(1);
      (redis.expire as jest.Mock).mockResolvedValue(1);
      (redis.rpush as jest.Mock).mockResolvedValue(1);
      (prisma.session.create as jest.Mock).mockResolvedValue({});

      const sessionId = await SessionService.createSession(
        userId,
        email,
        role,
        accessToken,
        refreshToken,
        metadata
      );

      expect(sessionId).toBeDefined();
      expect(typeof sessionId).toBe('string');
      expect(redis.setex).toHaveBeenCalledTimes(2); // access and refresh tokens
      expect(redis.zadd).toHaveBeenCalledTimes(1); // user sessions set
      expect(prisma.session.create).toHaveBeenCalledTimes(1);
    });

    it('should log session creation activity', async () => {
      const userId = 'user-123';
      const email = 'test@example.com';
      const role = 'provider';
      const accessToken = 'access-token-123';
      const refreshToken = 'refresh-token-123';
      const metadata = {
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
        deviceType: 'web',
      };

      (redis.setex as jest.Mock).mockResolvedValue('OK');
      (redis.zadd as jest.Mock).mockResolvedValue(1);
      (redis.expire as jest.Mock).mockResolvedValue(1);
      (redis.rpush as jest.Mock).mockResolvedValue(1);
      (prisma.session.create as jest.Mock).mockResolvedValue({});

      await SessionService.createSession(
        userId,
        email,
        role,
        accessToken,
        refreshToken,
        metadata
      );

      expect(redis.rpush).toHaveBeenCalled();
      const rpushCall = (redis.rpush as jest.Mock).mock.calls[0];
      expect(rpushCall[0]).toContain('session:activity:');
    });
  });

  describe('validateSession', () => {
    it('should validate an active session', async () => {
      const accessToken = 'access-token-123';
      const sessionData = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'provider',
        sessionId: 'session-123',
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      };

      (redis.get as jest.Mock).mockResolvedValue(JSON.stringify(sessionData));
      (redis.setex as jest.Mock).mockResolvedValue('OK');
      (redis.rpush as jest.Mock).mockResolvedValue(1);
      (redis.expire as jest.Mock).mockResolvedValue(1);
      (prisma.session.updateMany as jest.Mock).mockResolvedValue({});

      const result = await SessionService.validateSession(accessToken);

      expect(result).toBeDefined();
      expect(result?.userId).toBe('user-123');
      expect(result?.email).toBe('test@example.com');
      expect(redis.setex).toHaveBeenCalled(); // Updates TTL
      expect(prisma.session.updateMany).toHaveBeenCalled();
    });

    it('should return null for invalid session', async () => {
      const accessToken = 'invalid-token';

      (redis.get as jest.Mock).mockResolvedValue(null);

      const result = await SessionService.validateSession(accessToken);

      expect(result).toBeNull();
    });
  });

  describe('invalidateSession', () => {
    it('should invalidate a session', async () => {
      const accessToken = 'access-token-123';
      const sessionData = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'provider',
        sessionId: 'session-123',
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      };

      (redis.get as jest.Mock).mockResolvedValue(JSON.stringify(sessionData));
      (redis.zrange as jest.Mock).mockResolvedValue([
        JSON.stringify({
          sessionId: 'session-123',
          accessTokenHash: 'hash-123',
          refreshTokenHash: 'refresh-hash-123',
        }),
      ]);
      (redis.del as jest.Mock).mockResolvedValue(1);
      (redis.zrem as jest.Mock).mockResolvedValue(1);
      (redis.rpush as jest.Mock).mockResolvedValue(1);
      (redis.expire as jest.Mock).mockResolvedValue(1);
      (prisma.session.updateMany as jest.Mock).mockResolvedValue({});

      await SessionService.invalidateSession(accessToken);

      expect(redis.del).toHaveBeenCalled();
      expect(redis.zrem).toHaveBeenCalled();
      expect(prisma.session.updateMany).toHaveBeenCalled();
    });
  });

  describe('invalidateAllUserSessions', () => {
    it('should invalidate all sessions for a user', async () => {
      const userId = 'user-123';
      const sessions = [
        JSON.stringify({
          sessionId: 'session-1',
          accessTokenHash: 'hash-1',
          refreshTokenHash: 'refresh-hash-1',
        }),
        JSON.stringify({
          sessionId: 'session-2',
          accessTokenHash: 'hash-2',
          refreshTokenHash: 'refresh-hash-2',
        }),
      ];

      (redis.zrange as jest.Mock).mockResolvedValue(sessions);
      (redis.del as jest.Mock).mockResolvedValue(1);
      (redis.rpush as jest.Mock).mockResolvedValue(1);
      (redis.expire as jest.Mock).mockResolvedValue(1);
      (prisma.session.updateMany as jest.Mock).mockResolvedValue({});

      await SessionService.invalidateAllUserSessions(userId);

      expect(redis.del).toHaveBeenCalledTimes(5); // 2 access + 2 refresh + 1 user sessions set
      expect(prisma.session.updateMany).toHaveBeenCalled();
    });
  });

  describe('getUserSessions', () => {
    it('should return active sessions for a user', async () => {
      const userId = 'user-123';
      const sessions = [
        JSON.stringify({
          sessionId: 'session-1',
          accessTokenHash: 'hash-1',
          refreshTokenHash: 'refresh-hash-1',
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla/5.0',
          deviceType: 'web',
          createdAt: new Date().toISOString(),
        }),
      ];

      const sessionData = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'provider',
        sessionId: 'session-1',
        lastActivity: new Date().toISOString(),
      };

      (redis.zrange as jest.Mock).mockResolvedValue(sessions);
      (redis.get as jest.Mock).mockResolvedValue(JSON.stringify(sessionData));

      const result = await SessionService.getUserSessions(userId);

      expect(result).toHaveLength(1);
      expect(result[0].sessionId).toBe('session-1');
      expect(result[0].ipAddress).toBe('127.0.0.1');
    });

    it('should remove expired sessions from the list', async () => {
      const userId = 'user-123';
      const sessions = [
        JSON.stringify({
          sessionId: 'session-1',
          accessTokenHash: 'hash-1',
          refreshTokenHash: 'refresh-hash-1',
          ipAddress: '127.0.0.1',
          createdAt: new Date().toISOString(),
        }),
      ];

      (redis.zrange as jest.Mock).mockResolvedValue(sessions);
      (redis.get as jest.Mock).mockResolvedValue(null); // Session expired
      (redis.zrem as jest.Mock).mockResolvedValue(1);

      const result = await SessionService.getUserSessions(userId);

      expect(result).toHaveLength(0);
      expect(redis.zrem).toHaveBeenCalled();
    });
  });

  describe('logSessionActivity', () => {
    it('should log session activity', async () => {
      const sessionId = 'session-123';
      const action = 'session_validated';
      const metadata = {
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
      };

      (redis.rpush as jest.Mock).mockResolvedValue(1);
      (redis.expire as jest.Mock).mockResolvedValue(1);

      await SessionService.logSessionActivity(sessionId, action, metadata);

      expect(redis.rpush).toHaveBeenCalled();
      expect(redis.expire).toHaveBeenCalled();
    });
  });

  describe('getSessionActivity', () => {
    it('should return session activity log', async () => {
      const sessionId = 'session-123';
      const activities = [
        JSON.stringify({
          timestamp: new Date().toISOString(),
          action: 'session_created',
          ipAddress: '127.0.0.1',
        }),
        JSON.stringify({
          timestamp: new Date().toISOString(),
          action: 'session_validated',
          ipAddress: '127.0.0.1',
        }),
      ];

      (redis.lrange as jest.Mock).mockResolvedValue(activities);

      const result = await SessionService.getSessionActivity(sessionId);

      expect(result).toHaveLength(2);
      expect(result[0].action).toBe('session_created');
      expect(result[1].action).toBe('session_validated');
    });
  });

  describe('cleanupExpiredSessions', () => {
    it('should clean up expired sessions', async () => {
      const userSessionKeys = ['user:sessions:user-1', 'user:sessions:user-2'];
      const sessions = [
        JSON.stringify({
          sessionId: 'session-1',
          accessTokenHash: 'hash-1',
          refreshTokenHash: 'refresh-hash-1',
        }),
      ];

      (redis.keys as jest.Mock).mockResolvedValue(userSessionKeys);
      (redis.zrange as jest.Mock).mockResolvedValue(sessions);
      (redis.exists as jest.Mock).mockResolvedValue(0); // Session expired
      (redis.zrem as jest.Mock).mockResolvedValue(1);
      (redis.del as jest.Mock).mockResolvedValue(1);
      (redis.zcard as jest.Mock).mockResolvedValue(0);
      (prisma.session.deleteMany as jest.Mock).mockResolvedValue({});

      await SessionService.cleanupExpiredSessions();

      expect(redis.zrem).toHaveBeenCalled();
      expect(redis.del).toHaveBeenCalled();
      expect(prisma.session.deleteMany).toHaveBeenCalled();
    });
  });

  describe('getSessionStats', () => {
    it('should return session statistics', async () => {
      const userSessionKeys = ['user:sessions:user-1', 'user:sessions:user-2'];
      const sessions = [
        JSON.stringify({
          sessionId: 'session-1',
          refreshTokenHash: 'refresh-hash-1',
          deviceType: 'web',
        }),
        JSON.stringify({
          sessionId: 'session-2',
          refreshTokenHash: 'refresh-hash-2',
          deviceType: 'mobile',
        }),
      ];

      (redis.keys as jest.Mock).mockResolvedValue(userSessionKeys);
      (redis.zrange as jest.Mock).mockResolvedValue(sessions);
      (redis.exists as jest.Mock).mockResolvedValue(1); // Sessions active

      const result = await SessionService.getSessionStats();

      expect(result.totalActiveSessions).toBe(4); // 2 users * 2 sessions
      expect(result.totalActiveUsers).toBe(2);
      expect(result.sessionsByDevice).toHaveProperty('web');
      expect(result.sessionsByDevice).toHaveProperty('mobile');
    });
  });
});
