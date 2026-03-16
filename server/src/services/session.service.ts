import redis from '../config/redis';
import crypto from 'crypto';
import prisma from '../utils/prisma';

// Session TTL Configuration
const ACCESS_TOKEN_TTL = 15 * 60; // 15 minutes in seconds
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60; // 7 days in seconds
const SESSION_ACTIVITY_TTL = 30 * 24 * 60 * 60; // 30 days for activity logs

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

interface SessionActivity {
  timestamp: string;
  action: string;
  ipAddress?: string;
  userAgent?: string;
}

export class SessionService {
  /**
   * Generate a unique session ID
   */
  private static generateSessionId(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Hash token for storage
   */
  private static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Get Redis key for access token
   */
  private static getAccessTokenKey(tokenHash: string): string {
    return `session:access:${tokenHash}`;
  }

  /**
   * Get Redis key for refresh token
   */
  private static getRefreshTokenKey(tokenHash: string): string {
    return `session:refresh:${tokenHash}`;
  }

  /**
   * Get Redis key for user sessions list
   */
  private static getUserSessionsKey(userId: string): string {
    return `user:sessions:${userId}`;
  }

  /**
   * Get Redis key for session activity log
   */
  private static getSessionActivityKey(sessionId: string): string {
    return `session:activity:${sessionId}`;
  }

  /**
   * Create a new session in Redis
   */
  static async createSession(
    userId: string,
    email: string,
    role: string,
    accessToken: string,
    refreshToken: string,
    metadata: {
      ipAddress?: string;
      userAgent?: string;
      deviceType?: string;
    }
  ): Promise<string> {
    const sessionId = this.generateSessionId();
    const accessTokenHash = this.hashToken(accessToken);
    const refreshTokenHash = this.hashToken(refreshToken);
    const now = new Date().toISOString();

    const sessionData: SessionData = {
      userId,
      email,
      role,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
      deviceType: metadata.deviceType,
      createdAt: now,
      lastActivity: now,
    };

    // Store access token mapping to session data
    await redis.setex(
      this.getAccessTokenKey(accessTokenHash),
      ACCESS_TOKEN_TTL,
      JSON.stringify({ ...sessionData, sessionId, tokenType: 'access' })
    );

    // Store refresh token mapping to session data
    await redis.setex(
      this.getRefreshTokenKey(refreshTokenHash),
      REFRESH_TOKEN_TTL,
      JSON.stringify({ ...sessionData, sessionId, tokenType: 'refresh' })
    );

    // Add session to user's active sessions set
    await redis.zadd(
      this.getUserSessionsKey(userId),
      Date.now(),
      JSON.stringify({
        sessionId,
        accessTokenHash,
        refreshTokenHash,
        ...metadata,
        createdAt: now,
      })
    );

    // Set expiry on user sessions set
    await redis.expire(this.getUserSessionsKey(userId), REFRESH_TOKEN_TTL);

    // Log session creation activity
    await this.logSessionActivity(sessionId, 'session_created', {
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    });

    // Also store in PostgreSQL for audit trail
    await prisma.session.create({
      data: {
        userId,
        accessTokenHash,
        refreshTokenHash,
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
        deviceType: metadata.deviceType,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL * 1000),
        isActive: true,
      },
    });

    return sessionId;
  }

  /**
   * Validate session by access token
   */
  static async validateSession(accessToken: string): Promise<SessionData | null> {
    const tokenHash = this.hashToken(accessToken);
    const key = this.getAccessTokenKey(tokenHash);

    const sessionDataStr = await redis.get(key);
    if (!sessionDataStr) {
      return null;
    }

    const sessionData = JSON.parse(sessionDataStr) as SessionData & { sessionId: string };

    // Update last activity timestamp
    const now = new Date().toISOString();
    sessionData.lastActivity = now;

    // Update session data in Redis (refresh TTL)
    await redis.setex(key, ACCESS_TOKEN_TTL, JSON.stringify(sessionData));

    // Log activity
    await this.logSessionActivity(sessionData.sessionId, 'session_validated', {
      ipAddress: sessionData.ipAddress,
    });

    // Update last activity in PostgreSQL
    await prisma.session.updateMany({
      where: {
        accessTokenHash: tokenHash,
        isActive: true,
      },
      data: {
        lastActivity: new Date(),
      },
    });

    return sessionData;
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshSession(
    refreshToken: string,
    newAccessToken: string
  ): Promise<SessionData | null> {
    const oldRefreshTokenHash = this.hashToken(refreshToken);
    const refreshKey = this.getRefreshTokenKey(oldRefreshTokenHash);

    const sessionDataStr = await redis.get(refreshKey);
    if (!sessionDataStr) {
      return null;
    }

    const sessionData = JSON.parse(sessionDataStr) as SessionData & { sessionId: string };

    // Delete old access token
    const oldAccessTokens = await redis.keys(`session:access:*`);
    for (const key of oldAccessTokens) {
      const data = await redis.get(key);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.sessionId === sessionData.sessionId) {
          await redis.del(key);
          break;
        }
      }
    }

    // Store new access token
    const newAccessTokenHash = this.hashToken(newAccessToken);
    const now = new Date().toISOString();
    sessionData.lastActivity = now;

    await redis.setex(
      this.getAccessTokenKey(newAccessTokenHash),
      ACCESS_TOKEN_TTL,
      JSON.stringify({ ...sessionData, tokenType: 'access' })
    );

    // Log activity
    await this.logSessionActivity(sessionData.sessionId, 'token_refreshed', {
      ipAddress: sessionData.ipAddress,
    });

    // Update PostgreSQL
    await prisma.session.updateMany({
      where: {
        refreshTokenHash: oldRefreshTokenHash,
        isActive: true,
      },
      data: {
        accessTokenHash: newAccessTokenHash,
        lastActivity: new Date(),
      },
    });

    return sessionData;
  }

  /**
   * Invalidate session (logout)
   */
  static async invalidateSession(accessToken: string): Promise<void> {
    const tokenHash = this.hashToken(accessToken);
    const key = this.getAccessTokenKey(tokenHash);

    const sessionDataStr = await redis.get(key);
    if (sessionDataStr) {
      const sessionData = JSON.parse(sessionDataStr) as SessionData & {
        sessionId: string;
      };

      // Find and delete refresh token
      const userSessionsKey = this.getUserSessionsKey(sessionData.userId);
      const sessions = await redis.zrange(userSessionsKey, 0, -1);

      for (const sessionStr of sessions) {
        const session = JSON.parse(sessionStr);
        if (session.sessionId === sessionData.sessionId) {
          const refreshKey = this.getRefreshTokenKey(session.refreshTokenHash);
          await redis.del(refreshKey);
          await redis.zrem(userSessionsKey, sessionStr);
          break;
        }
      }

      // Delete access token
      await redis.del(key);

      // Log activity
      await this.logSessionActivity(sessionData.sessionId, 'session_invalidated', {
        ipAddress: sessionData.ipAddress,
      });

      // Update PostgreSQL
      await prisma.session.updateMany({
        where: {
          accessTokenHash: tokenHash,
        },
        data: {
          isActive: false,
        },
      });
    }
  }

  /**
   * Invalidate all user sessions (logout from all devices)
   */
  static async invalidateAllUserSessions(userId: string): Promise<void> {
    const userSessionsKey = this.getUserSessionsKey(userId);
    const sessions = await redis.zrange(userSessionsKey, 0, -1);

    for (const sessionStr of sessions) {
      const session = JSON.parse(sessionStr);

      // Delete access and refresh tokens
      await redis.del(this.getAccessTokenKey(session.accessTokenHash));
      await redis.del(this.getRefreshTokenKey(session.refreshTokenHash));

      // Log activity
      await this.logSessionActivity(session.sessionId, 'all_sessions_invalidated', {
        ipAddress: session.ipAddress,
      });
    }

    // Clear user sessions set
    await redis.del(userSessionsKey);

    // Update PostgreSQL
    await prisma.session.updateMany({
      where: {
        userId,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });
  }

  /**
   * Get all active sessions for a user (multi-device tracking)
   */
  static async getUserSessions(userId: string): Promise<
    Array<{
      sessionId: string;
      ipAddress?: string;
      userAgent?: string;
      deviceType?: string;
      createdAt: string;
      lastActivity?: string;
    }>
  > {
    const userSessionsKey = this.getUserSessionsKey(userId);
    const sessions = await redis.zrange(userSessionsKey, 0, -1);

    const activeSessions = [];

    for (const sessionStr of sessions) {
      const session = JSON.parse(sessionStr);

      // Check if session is still active by checking if access or refresh token exists
      const refreshKey = this.getRefreshTokenKey(session.refreshTokenHash);
      const refreshData = await redis.get(refreshKey);

      if (refreshData) {
        const sessionData = JSON.parse(refreshData);
        activeSessions.push({
          sessionId: session.sessionId,
          ipAddress: session.ipAddress,
          userAgent: session.userAgent,
          deviceType: session.deviceType,
          createdAt: session.createdAt,
          lastActivity: sessionData.lastActivity,
        });
      } else {
        // Remove expired session from set
        await redis.zrem(userSessionsKey, sessionStr);
      }
    }

    return activeSessions;
  }

  /**
   * Log session activity for audit trail
   */
  static async logSessionActivity(
    sessionId: string,
    action: string,
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<void> {
    const activityKey = this.getSessionActivityKey(sessionId);
    const activity: SessionActivity = {
      timestamp: new Date().toISOString(),
      action,
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent,
    };

    // Add to activity log list
    await redis.rpush(activityKey, JSON.stringify(activity));

    // Set expiry on activity log
    await redis.expire(activityKey, SESSION_ACTIVITY_TTL);
  }

  /**
   * Get session activity log
   */
  static async getSessionActivity(sessionId: string): Promise<SessionActivity[]> {
    const activityKey = this.getSessionActivityKey(sessionId);
    const activities = await redis.lrange(activityKey, 0, -1);

    return activities.map((activityStr: string) => JSON.parse(activityStr) as SessionActivity);
  }

  /**
   * Clean up expired sessions (run periodically)
   */
  static async cleanupExpiredSessions(): Promise<void> {
    // Get all user session keys
    const userSessionKeys = await redis.keys('user:sessions:*');

    for (const key of userSessionKeys) {
      const sessions = await redis.zrange(key, 0, -1);

      for (const sessionStr of sessions) {
        const session = JSON.parse(sessionStr);

        // Check if refresh token still exists
        const refreshKey = this.getRefreshTokenKey(session.refreshTokenHash);
        const exists = await redis.exists(refreshKey);

        if (!exists) {
          // Remove expired session from set
          await redis.zrem(key, sessionStr);

          // Clean up access token if it exists
          await redis.del(this.getAccessTokenKey(session.accessTokenHash));
        }
      }

      // Remove empty sets
      const count = await redis.zcard(key);
      if (count === 0) {
        await redis.del(key);
      }
    }

    // Also clean up PostgreSQL
    await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }

  /**
   * Get session statistics for monitoring
   */
  static async getSessionStats(): Promise<{
    totalActiveSessions: number;
    totalActiveUsers: number;
    sessionsByDevice: Record<string, number>;
  }> {
    const userSessionKeys = await redis.keys('user:sessions:*');
    let totalActiveSessions = 0;
    const sessionsByDevice: Record<string, number> = {};

    for (const key of userSessionKeys) {
      const sessions = await redis.zrange(key, 0, -1);

      for (const sessionStr of sessions) {
        const session = JSON.parse(sessionStr);

        // Check if session is still active
        const refreshKey = this.getRefreshTokenKey(session.refreshTokenHash);
        const exists = await redis.exists(refreshKey);

        if (exists) {
          totalActiveSessions++;

          const deviceType = session.deviceType || 'unknown';
          sessionsByDevice[deviceType] = (sessionsByDevice[deviceType] || 0) + 1;
        }
      }
    }

    return {
      totalActiveSessions,
      totalActiveUsers: userSessionKeys.length,
      sessionsByDevice,
    };
  }
}
