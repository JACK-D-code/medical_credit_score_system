import { Router } from 'express';
import { getProfile, updatePersonalInfo, updateContactInfo, updateSecurityInfo, updatePrivacyInfo, uploadDocument, reportVisit, completeTask, getAvailableActivities, updateMedicalInfo } from '../controllers/profile.controller';
import { syncProvider } from '../controllers/integration.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getProfile);
router.get('/activities/available', authenticateToken, getAvailableActivities);
router.put('/personal', authenticateToken, updatePersonalInfo);
router.put('/contact', authenticateToken, updateContactInfo);
router.put('/medical', authenticateToken, updateMedicalInfo);
router.put('/security', authenticateToken, updateSecurityInfo);
router.put('/privacy', authenticateToken, updatePrivacyInfo);
router.post('/documents', authenticateToken, uploadDocument);
router.post('/timeline', authenticateToken, reportVisit);
router.post('/complete-task', authenticateToken, completeTask);
router.post('/integration/sync', authenticateToken, syncProvider);

export default router;
