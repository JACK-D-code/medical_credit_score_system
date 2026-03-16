import { Router } from 'express';
import { getPatientByIdForAdmin, getCharityGrants } from '../controllers/provider.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/patients/:id', authenticateToken, getPatientByIdForAdmin);
router.get('/charity/grants', authenticateToken, getCharityGrants);

export default router;
