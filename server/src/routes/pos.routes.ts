import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { verifyPOS, checkoutPOS } from '../controllers/pos.controller';

const router = Router();

// Provider POS routes
router.post('/verify', authenticateToken, verifyPOS);
router.post('/checkout', authenticateToken, checkoutPOS);

export default router;
