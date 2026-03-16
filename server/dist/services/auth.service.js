"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const session_service_1 = require("./session.service");
// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_change_in_production';
const JWT_ACCESS_EXPIRY = '15m'; // 15 minutes for access token
const JWT_REFRESH_EXPIRY = '7d'; // 7 days for refresh token
const BCRYPT_SALT_ROUNDS = 12; // Requirement: >= 12
class AuthService {
    /**
     * Hash password using bcrypt with salt rounds >= 12
     */
    static async hashPassword(password) {
        return bcryptjs_1.default.hash(password, BCRYPT_SALT_ROUNDS);
    }
    /**
     * Verify password against hash
     */
    static async verifyPassword(password, hash) {
        return bcryptjs_1.default.compare(password, hash);
    }
    /**
     * Generate access and refresh token pair
     */
    static generateTokenPair(payload) {
        const accessToken = jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
            expiresIn: JWT_ACCESS_EXPIRY,
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
            expiresIn: JWT_REFRESH_EXPIRY,
        });
        return { accessToken, refreshToken };
    }
    /**
     * Verify and decode JWT token
     */
    static verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, JWT_SECRET);
        }
        catch (error) {
            throw new Error('Invalid or expired token');
        }
    }
    /**
     * Hash token for storage (for session management)
     */
    static hashToken(token) {
        return crypto_1.default.createHash('sha256').update(token).digest('hex');
    }
    /**
     * Create session with access and refresh tokens
     * Now uses Redis-based SessionService for better performance
     */
    static async createSession(userId, email, role, accessToken, refreshToken, sessionData) {
        // Use Redis-based session service
        return session_service_1.SessionService.createSession(userId, email, role, accessToken, refreshToken, {
            ipAddress: sessionData.ipAddress,
            userAgent: sessionData.userAgent,
            deviceType: sessionData.deviceType,
        });
    }
    /**
     * Validate session by access token
     * Now uses Redis-based SessionService for better performance
     */
    static async validateSession(accessToken) {
        const sessionData = await session_service_1.SessionService.validateSession(accessToken);
        return sessionData !== null;
    }
    /**
     * Refresh access token using refresh token
     * Now uses Redis-based SessionService for better performance
     */
    static async refreshAccessToken(refreshToken, newAccessToken) {
        try {
            // Verify refresh token
            const payload = this.verifyToken(refreshToken);
            // Use Redis-based session service to refresh
            const sessionData = await session_service_1.SessionService.refreshSession(refreshToken, newAccessToken);
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
        }
        catch (error) {
            return null;
        }
    }
    /**
     * Invalidate session (logout)
     * Now uses Redis-based SessionService for better performance
     */
    static async invalidateSession(accessToken) {
        await session_service_1.SessionService.invalidateSession(accessToken);
    }
    /**
     * Invalidate all user sessions (logout from all devices)
     * Now uses Redis-based SessionService for better performance
     */
    static async invalidateAllUserSessions(userId) {
        await session_service_1.SessionService.invalidateAllUserSessions(userId);
    }
    /**
     * Clean up expired sessions
     * Now uses Redis-based SessionService for better performance
     */
    static async cleanupExpiredSessions() {
        await session_service_1.SessionService.cleanupExpiredSessions();
    }
    /**
     * Get user active sessions
     * Now uses Redis-based SessionService for better performance and multi-device tracking
     */
    static async getUserSessions(userId) {
        return session_service_1.SessionService.getUserSessions(userId);
    }
}
exports.AuthService = AuthService;
