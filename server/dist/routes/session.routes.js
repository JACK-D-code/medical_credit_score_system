"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const session_controller_1 = require("../controllers/session.controller");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/sessions
 * @desc    Get all active sessions for authenticated user
 * @access  Private
 */
router.get('/', auth_1.authenticateToken, session_controller_1.getUserSessions);
/**
 * @route   GET /api/sessions/:sessionId/activity
 * @desc    Get activity log for a specific session
 * @access  Private
 */
router.get('/:sessionId/activity', auth_1.authenticateToken, session_controller_1.getSessionActivity);
/**
 * @route   DELETE /api/sessions/:sessionId
 * @desc    Invalidate a specific session (logout from specific device)
 * @access  Private
 */
router.delete('/:sessionId', auth_1.authenticateToken, session_controller_1.invalidateSession);
/**
 * @route   GET /api/sessions/stats
 * @desc    Get session statistics (admin only)
 * @access  Private (Admin)
 */
router.get('/admin/stats', auth_1.authenticateToken, session_controller_1.getSessionStats);
/**
 * @route   POST /api/sessions/cleanup
 * @desc    Clean up expired sessions (admin only)
 * @access  Private (Super Admin)
 */
router.post('/admin/cleanup', auth_1.authenticateToken, session_controller_1.cleanupSessions);
exports.default = router;
