import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
    submitCreditClaim,
    submitOfferApplication,
    getMyClaimsAndOffers,
    getAllPendingRequests,
    reviewCreditClaim,
    reviewOfferApplication
} from '../controllers/claims.controller';

const router = Router();

// Patient routes
router.post('/claim', authenticateToken, submitCreditClaim);
router.post('/offer', authenticateToken, submitOfferApplication);
router.get('/my-requests', authenticateToken, getMyClaimsAndOffers);

// Admin/Provider routes
router.get('/pending', authenticateToken, getAllPendingRequests);
router.put('/claim/:id/review', authenticateToken, reviewCreditClaim);
router.put('/offer/:id/review', authenticateToken, reviewOfferApplication);

export default router;
