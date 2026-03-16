"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middleware/auth");
const rate_limit_1 = require("../middleware/rate-limit");
const router = (0, express_1.Router)();
// Public routes
router.post('/register', auth_controller_1.register);
router.post('/login', rate_limit_1.rateLimitLogin, auth_controller_1.login);
router.post('/send-otp', auth_controller_1.sendOtp);
router.post('/verify-otp', auth_controller_1.verifyOtp);
router.post('/refresh', auth_controller_1.refreshToken);
// Protected routes
router.get('/me', auth_1.authenticateToken, auth_controller_1.getMe);
router.post('/logout', auth_1.authenticateToken, auth_controller_1.logout);
router.post('/logout-all', auth_1.authenticateToken, auth_controller_1.logoutAll);
router.get('/sessions', auth_1.authenticateToken, auth_controller_1.getSessions);
exports.default = router;
