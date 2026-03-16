import { Router } from 'express';
import { getBillingRecords, payBill, applyForCredit, getEmiSchedules } from '../controllers/billing.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getBillingRecords);
router.post('/pay', authenticateToken, payBill);
router.post('/apply-credit', authenticateToken, applyForCredit);
router.get('/emi-schedules', authenticateToken, getEmiSchedules);

export default router;
