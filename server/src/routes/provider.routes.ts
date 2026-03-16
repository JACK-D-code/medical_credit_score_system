import { Router } from 'express';
import { getProviderPatients, getPatientById, issueBill, approveTreatment, getProviderAnalytics, getProviderBilling, evaluatePatient, getCreditEngineAnalytics, getFinanceAnalytics, getHospitalAnalytics, sendPhidToPatient } from '../controllers/provider.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/analytics', authenticateToken, getProviderAnalytics);
router.get('/analytics/engine', authenticateToken, getCreditEngineAnalytics);
router.get('/analytics/finance', authenticateToken, getFinanceAnalytics);
router.get('/analytics/hospital', authenticateToken, getHospitalAnalytics);
router.get('/patients', authenticateToken, getProviderPatients);
router.get('/patients/:id', authenticateToken, getPatientById);
    router.post('/patients/:patientId/send-phid', authenticateToken, sendPhidToPatient);
    router.post('/evaluate-patient', authenticateToken, evaluatePatient);
router.post('/approve/:patientId', authenticateToken, approveTreatment);
router.post('/issue-bill', authenticateToken, issueBill);
router.get('/billing', authenticateToken, getProviderBilling);

export default router;
