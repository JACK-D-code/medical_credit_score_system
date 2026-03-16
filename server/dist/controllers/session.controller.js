"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupSessions = exports.getSessionStats = exports.invalidateSession = exports.getSessionActivity = exports.getUserSessions = void 0;
const session_service_1 = require("../services/session.service");
/**
 * Get all active sessions for the authenticated user
 */
const getUserSessions = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const sessions = await session_service_1.SessionService.getUserSessions(req.user.id);
        res.json({
            sessions,
            total: sessions.length,
        });
    }
    catch (error) {
        console.error('Get user sessions error:', error);
        res.status(500).json({ error: 'Server error retrieving sessions' });
    }
};
exports.getUserSessions = getUserSessions;
/**
 * Get session activity log
 */
const getSessionActivity = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const sessionId = req.params.sessionId;
        if (!sessionId || Array.isArray(sessionId)) {
            res.status(400).json({ error: 'Valid session ID is required' });
            return;
        }
        const activities = await session_service_1.SessionService.getSessionActivity(sessionId);
        res.json({
            sessionId,
            activities,
            total: activities.length,
        });
    }
    catch (error) {
        console.error('Get session activity error:', error);
        res.status(500).json({ error: 'Server error retrieving session activity' });
    }
};
exports.getSessionActivity = getSessionActivity;
/**
 * Invalidate a specific session (logout from specific device)
 */
const invalidateSession = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const sessionId = req.params.sessionId;
        if (!sessionId || Array.isArray(sessionId)) {
            res.status(400).json({ error: 'Valid session ID is required' });
            return;
        }
        // Get user sessions to find the access token hash
        const sessions = await session_service_1.SessionService.getUserSessions(req.user.id);
        const targetSession = sessions.find((s) => s.sessionId === sessionId);
        if (!targetSession) {
            res.status(404).json({ error: 'Session not found' });
            return;
        }
        // Note: We would need to store session ID mapping to invalidate specific sessions
        // For now, we'll return a message
        res.json({
            message: 'Session invalidation requires access token. Use logout endpoint instead.',
        });
    }
    catch (error) {
        console.error('Invalidate session error:', error);
        res.status(500).json({ error: 'Server error invalidating session' });
    }
};
exports.invalidateSession = invalidateSession;
/**
 * Get session statistics (admin only)
 */
const getSessionStats = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        // Check if user is admin
        if (req.user.role !== 'super_admin' && req.user.role !== 'financial_admin') {
            res.status(403).json({ error: 'Forbidden: Admin access required' });
            return;
        }
        const stats = await session_service_1.SessionService.getSessionStats();
        res.json(stats);
    }
    catch (error) {
        console.error('Get session stats error:', error);
        res.status(500).json({ error: 'Server error retrieving session statistics' });
    }
};
exports.getSessionStats = getSessionStats;
/**
 * Clean up expired sessions (admin only, can be called manually or via cron)
 */
const cleanupSessions = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        // Check if user is admin
        if (req.user.role !== 'super_admin') {
            res.status(403).json({ error: 'Forbidden: Super admin access required' });
            return;
        }
        await session_service_1.SessionService.cleanupExpiredSessions();
        res.json({
            message: 'Expired sessions cleaned up successfully',
        });
    }
    catch (error) {
        console.error('Cleanup sessions error:', error);
        res.status(500).json({ error: 'Server error cleaning up sessions' });
    }
};
exports.cleanupSessions = cleanupSessions;
