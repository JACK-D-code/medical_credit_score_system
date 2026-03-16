"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.requireAnyRole = exports.requireRole = exports.authenticateToken = void 0;
const auth_service_1 = require("../services/auth.service");
/**
 * Authentication middleware for protected routes
 * Validates JWT access token and attaches user info to request
 */
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({
                error: 'Access denied. No token provided.',
                code: 'NO_TOKEN'
            });
            return;
        }
        // Verify token
        const decoded = auth_service_1.AuthService.verifyToken(token);
        // Validate session (optional but recommended for added security)
        const isValidSession = await auth_service_1.AuthService.validateSession(token);
        if (!isValidSession) {
            res.status(401).json({
                error: 'Session expired or invalid.',
                code: 'INVALID_SESSION'
            });
            return;
        }
        // Attach user info to request
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        if (error.message === 'Invalid or expired token') {
            res.status(401).json({
                error: 'Invalid or expired token.',
                code: 'TOKEN_EXPIRED'
            });
        }
        else {
            res.status(403).json({
                error: 'Authentication failed.',
                code: 'AUTH_FAILED'
            });
        }
    }
};
exports.authenticateToken = authenticateToken;
/**
 * Role-based access control middleware
 * Requires specific role to access the route
 */
const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                error: 'Authentication required.',
                code: 'NOT_AUTHENTICATED'
            });
            return;
        }
        if (req.user.role !== role) {
            res.status(403).json({
                error: `Access denied. Requires ${role} privileges.`,
                code: 'INSUFFICIENT_PERMISSIONS'
            });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
/**
 * Multiple roles access control middleware
 * Allows access if user has any of the specified roles
 */
const requireAnyRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                error: 'Authentication required.',
                code: 'NOT_AUTHENTICATED'
            });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                error: `Access denied. Requires one of: ${roles.join(', ')}`,
                code: 'INSUFFICIENT_PERMISSIONS'
            });
            return;
        }
        next();
    };
};
exports.requireAnyRole = requireAnyRole;
/**
 * Optional authentication middleware
 * Attaches user info if token is present, but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            const decoded = auth_service_1.AuthService.verifyToken(token);
            req.user = {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role,
            };
        }
        next();
    }
    catch (error) {
        // Continue without authentication
        next();
    }
};
exports.optionalAuth = optionalAuth;
