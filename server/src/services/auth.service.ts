import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
import crypto from 'crypto';
import { SessionService } from './session.service';

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_change_in_production';
const JWT_ACCESS_EXPIRY = '15m'; // 15 minutes for access token
const JWT_REFRESH_EXPIRY = '7d'; // 7 days for refresh token
const BCRYPT_SALT_ROUNDS = 12; // Requirement: >= 12

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface SessionData {
  ipAddress?: string;
  userAgent?: string;
  deviceType?: string;
}

export class AuthService {
  /**
   * Hash password using bcrypt with salt rounds >= 12
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  }

  /**
   * Verify password against hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate access and refresh token pair
   */
  static generateTokenPair(payload: TokenPayload): TokenPair {
    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_ACCESS_EXPIRY,
    });

    const refreshToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRY,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Verify and decode JWT token
   */
  static verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Hash token for storage (for session management)
   */
  static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Create session with access and refresh tokens
   * Now uses Redis-based SessionService for better performance
   */
  static async createSession(
    userId: string,
    email: string,
    role: string,
    accessToken: string,
    refreshToken: string,
    sessionData: SessionData
  ): Promise<string> {
    // Use Redis-based session service
    return SessionService.createSession(
      userId,
      email,
      role,
      accessToken,
      refreshToken,
      {
        ipAddress: sessionData.ipAddress,
        userAgent: sessionData.userAgent,
        deviceType: sessionData.deviceType,
      }
    );
  }

  /**
   * Validate session by access token
   * Now uses Redis-based SessionService for better performance
   */
  static async validateSession(accessToken: string): Promise<boolean> {
    const sessionData = await SessionService.validateSession(accessToken);
    return sessionData !== null;
  }

  /**
   * Refresh access token using refresh token
   * Now uses Redis-based SessionService for better performance
   */
  static async refreshAccessToken(
    refreshToken: string,
    newAccessToken: string
  ): Promise<TokenPair | null> {
    try {
      // Verify refresh token
      const payload = this.verifyToken(refreshToken);

      // Use Redis-based session service to refresh
      const sessionData = await SessionService.refreshSession(refreshToken, newAccessToken);

      if (!sessionData) {
        return null;
      }

      // Generate new token pair
      const newTokenPair = this.generateTokenPair({
        id: sessionData.userId,
        email: sessionData.email,
        role: sessionData.role,
      });

      return newTokenPair;
    } catch (error) {
      return null;
    }
  }

  /**
   * Invalidate session (logout)
   * Now uses Redis-based SessionService for better performance
   */
  static async invalidateSession(accessToken: string): Promise<void> {
    await SessionService.invalidateSession(accessToken);
  }

  /**
   * Invalidate all user sessions (logout from all devices)
   * Now uses Redis-based SessionService for better performance
   */
  static async invalidateAllUserSessions(userId: string): Promise<void> {
    await SessionService.invalidateAllUserSessions(userId);
  }

  /**
   * Clean up expired sessions
   * Now uses Redis-based SessionService for better performance
   */
  static async cleanupExpiredSessions(): Promise<void> {
    await SessionService.cleanupExpiredSessions();
  }

  /**
   * Get user active sessions
   * Now uses Redis-based SessionService for better performance and multi-device tracking
   */
  static async getUserSessions(userId: string) {
    return SessionService.getUserSessions(userId);
  }
}
