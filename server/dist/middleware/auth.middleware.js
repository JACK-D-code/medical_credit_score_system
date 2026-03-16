"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractUserIdFromToken = exports.optionalAuthMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.substring(7)
            : null;
        if (!token) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Access token is required'
            });
        }
        // Verify token
        const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Get user from database
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                role: true,
                isActive: true,
                lastLogin: true,
                createdAt: true
            }
        });
        if (!user) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'User not found'
            });
        }
        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Account is deactivated'
            });
        }
        // Attach user to request
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Token expired'
            });
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid token'
            });
        }
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: 'Authentication failed'
        });
    }
};
exports.authMiddleware = authMiddleware;
/**
 * Optional authentication middleware
 * Attaches user to request if token is present, but doesn't require it
 */
const optionalAuthMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.substring(7)
            : null;
        if (!token) {
            // No token, continue without user
            return next();
        }
        // Verify token
        const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Get user from database
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                role: true,
                isActive: true,
                lastLogin: true,
                createdAt: true
            }
        });
        if (user && user.isActive) {
            // Attach user to request
            req.user = user;
        }
        next();
    }
    catch (error) {
        // Log error but continue without user
        console.error('Optional auth middleware error:', error);
        next();
    }
};
exports.optionalAuthMiddleware = optionalAuthMiddleware;
/**
 * Extract user ID from token without full authentication
 */
const extractUserIdFromToken = (req) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.substring(7)
            : null;
        if (!token) {
            return null;
        }
        const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return decoded.userId;
    }
    catch (error) {
        return null;
    }
};
exports.extractUserIdFromToken = extractUserIdFromToken;
