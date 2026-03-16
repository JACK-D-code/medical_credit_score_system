import { Router } from 'express';
import {
    register,
    login,
    getMe,
    sendOtp,
    verifyOtp,
    refreshToken,
    logout,
    logoutAll,
    getSessions
} from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth';
import { rateLimitLogin } from '../middleware/rate-limit';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', rateLimitLogin, login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/refresh', refreshToken);

// Protected routes
router.get('/me', authenticateToken, getMe);
router.post('/logout', authenticateToken, logout);
router.post('/logout-all', authenticateToken, logoutAll);
router.get('/sessions', authenticateToken, getSessions);

export default router;
