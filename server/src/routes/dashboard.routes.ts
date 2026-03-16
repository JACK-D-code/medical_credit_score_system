import { Router } from 'express';
import { getDashboardMetrics } from '../controllers/dashboard.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Retrieve all top-level metrics for the dashboard view
router.get('/', authenticateToken, getDashboardMetrics);

export default router;
