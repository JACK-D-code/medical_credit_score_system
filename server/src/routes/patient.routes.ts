import { Router } from 'express';
import { getPatientProfile, updatePatientProfile, requestPhid } from '../controllers/patient.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/:id', authenticateToken, getPatientProfile);
router.put('/:id', authenticateToken, updatePatientProfile);
router.post('/request-phid', authenticateToken, requestPhid);

export default router;
