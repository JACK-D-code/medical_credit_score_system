import { Router } from 'express';
import { calculateScore, getScoreHistory, getScoreDetails } from '../controllers/score.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Routes for the Score Engine
router.post('/calculate/:patientId', authenticateToken, calculateScore);
router.get('/history/:patientId', authenticateToken, getScoreHistory);
router.get('/details', authenticateToken, getScoreDetails);

export default router;
